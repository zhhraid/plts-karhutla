/**
 * Decision engine — TypeScript port of the methodology in
 * docs/DECISION_METHODOLOGY.md, docs/SCORING_FORMULA.md,
 * docs/DATA_CONFIDENCE_METHOD.md and docs/RECOMMENDATION_LOGIC.md.
 *
 * This is a port, not a redesign. Every threshold, mapping and branch below
 * reproduces `scripts/build_master_dataset.py`. No formula here is new.
 *
 * ## The one rule that governs everything in this file
 *
 * `null` is not `0`. A missing measurement is dropped from BOTH the numerator
 * and the denominator of the weighted sum. It is never substituted, never
 * defaulted, never treated as a low value.
 *
 * ## Why two implementations exist at all
 *
 * The Python pipeline remains the producer of record: it is what writes
 * data/processed/ and what the validator checks. This engine exists so the
 * application can recompute, explain and re-run scores (e.g. under adjusted
 * weights) without shelling out to Python. The drift risk that creates is
 * contained by a parity test that recomputes the entire published dataset here
 * and fails on any disagreement.
 */
import {
  BASELINE_WEIGHTS,
  CONFIDENCE_HIGH_THRESHOLD,
  CONFIDENCE_MEDIUM_THRESHOLD,
  CRITICALITY_BY_TYPE,
  HAZARD_CLASS_SCORE,
  MIN_DIMENSIONS,
  PRIORITY_BAND_THRESHOLDS,
  REQUIRED_DIMENSION,
  SOCIAL_FLOOR,
} from "@/lib/scoring/constants";
import { BASELINE_LABELS, DIMENSION_ORDER } from "@/lib/scoring/dimensions";
import type {
  DataConfidenceLevel,
  DecisionDimension,
  FacilityType,
  PriorityBand,
  RecommendationType,
  ScoreBreakdown,
  ScoreStatus,
} from "@/types";

/** Scores for the four dimensions. `null` means "not measured". */
export type DimensionScores = Readonly<Record<DecisionDimension, number | null>>;

/** Everything §E of the brief requires alongside the number itself. */
export interface PriorityScoreResult {
  /** `null` when minimum coverage is not met. No number is published at all. */
  readonly value: number | null;
  readonly status: ScoreStatus;
  readonly band: PriorityBand;
  readonly availableCriteria: readonly DecisionDimension[];
  readonly missingCriteria: readonly DecisionDimension[];
  /** Renormalised share (%) each available dimension actually contributed. */
  readonly effectiveWeight: Readonly<Partial<Record<DecisionDimension, number>>>;
  /** Share of total baseline weight backed by real data, 0–1. */
  readonly coverage: number;
  readonly breakdown: readonly ScoreBreakdown[];
}

// ---------------------------------------------------------------------------
// Per-dimension scores
// ---------------------------------------------------------------------------

/**
 * Solar Suitability — site-level GHI, passed through unchanged.
 *
 * Returns `null` when GHI is unavailable. Guessing a value, reading one off a
 * map image, or substituting a regional average would manufacture the very
 * discrimination between sites that the missing data denies us. See the
 * prohibition in docs/SCORING_FORMULA.md §2.4.
 */
export function calculateSolarScore(ghiValue: number | null): number | null {
  return ghiValue === null || Number.isNaN(ghiValue) ? null : ghiValue;
}

/**
 * Social Impact — log10 then min-max onto [SOCIAL_FLOOR, 100].
 *
 * Normalisation is cohort-relative, so the full set of canonical values is
 * required: a beneficiary count has no score in isolation. Sites with no
 * canonical value are excluded from the cohort entirely — they neither receive
 * a score nor shift anyone else's.
 *
 * Log rather than linear because the measured range spans ~21x (46–994); a
 * linear min-max would leave the smallest school contributing almost nothing.
 */
export function calculateSocialScore(
  beneficiaryValue: number | null,
  cohort: readonly (number | null)[],
): number | null {
  if (beneficiaryValue === null || Number.isNaN(beneficiaryValue)) return null;
  if (beneficiaryValue <= 0) return null;

  const measured = cohort.filter(
    (value): value is number => value !== null && !Number.isNaN(value) && value > 0,
  );
  // A cohort of one cannot be normalised against anything; matches Python.
  if (measured.length < 2) return 100;

  const logs = measured.map((value) => Math.log10(value));
  const lo = Math.min(...logs);
  const hi = Math.max(...logs);
  if (hi - lo === 0) return 100;

  const own = Math.log10(beneficiaryValue);
  return SOCIAL_FLOOR + ((own - lo) / (hi - lo)) * (100 - SOCIAL_FLOOR);
}

/**
 * Facility Criticality — rule-based by facility type.
 *
 * Health services carry the higher baseline because loss of power interrupts
 * continuity of essential care. An unknown facility type yields `null`, not a
 * default: inventing a criticality would be inventing evidence.
 */
export function calculateCriticalityScore(
  facilityType: FacilityType | string,
): number | null {
  return CRITICALITY_BY_TYPE[facilityType as FacilityType] ?? null;
}

/**
 * Resilience Need — ordinal karhutla hazard class.
 *
 * Two independent gates. The observation must be eligible for scoring, and the
 * class must be one the mapping knows. Drought is deliberately not accepted
 * here: it is regency-wide and identical for every site, so it carries zero
 * discriminating power and is kept as context only.
 *
 * Hazard is not risk. This scores exposure to a hazard class, and says nothing
 * about consequence or vulnerability.
 */
export function calculateResilienceScore(
  hazardClass: string | null,
  scoringEligibility: string | null,
): number | null {
  if (scoringEligibility === null || !scoringEligibility.startsWith("provisional")) {
    return null;
  }
  if (hazardClass === null) return null;
  return HAZARD_CLASS_SCORE[hazardClass] ?? null;
}

// ---------------------------------------------------------------------------
// Priority Score
// ---------------------------------------------------------------------------

export function bandFor(score: number | null): PriorityBand {
  if (score === null) return "NEEDS_VERIFICATION";
  if (score >= PRIORITY_BAND_THRESHOLDS.high) return "HIGH";
  if (score >= PRIORITY_BAND_THRESHOLDS.medium) return "MEDIUM";
  return "LOW";
}

function deriveStatus(
  value: number | null,
  missing: readonly DecisionDimension[],
): ScoreStatus {
  if (value === null) return "INSUFFICIENT_DATA";
  const noSolar = missing.includes("solar");
  const noSocial = missing.includes("social");
  if (noSolar && noSocial) return "NEEDS_DATA_VERIFICATION";
  if (noSolar) return "PROVISIONAL_MISSING_SOLAR";
  if (noSocial) return "PROVISIONAL_MISSING_SOCIAL";
  return "PROVISIONAL_LIMITED_HAZARD";
}

/**
 * Weighted sum over available dimensions, with the denominator renormalised.
 *
 * A numeric score is published only when at least MIN_DIMENSIONS dimensions
 * are present AND criticality is among them. Below that the result is `null` —
 * not a low score, not an estimate, no number at all.
 *
 * Known and accepted consequence (docs/SCORING_FORMULA.md §3): renormalisation
 * scores each site only on the dimensions it happens to have, so a site with a
 * low *measured* value can rank below an otherwise identical site whose value
 * is merely unknown. `coverage` is returned so that difference in basis is
 * visible rather than hidden.
 */
export function calculatePriorityScore(
  dimensions: DimensionScores,
  weights: Readonly<Record<DecisionDimension, number>> = BASELINE_WEIGHTS,
): PriorityScoreResult {
  const available = DIMENSION_ORDER.filter(
    (dimension) => dimensions[dimension] !== null,
  );
  const missing = DIMENSION_ORDER.filter(
    (dimension) => dimensions[dimension] === null,
  );

  const totalWeight = DIMENSION_ORDER.reduce(
    (total, dimension) => total + weights[dimension],
    0,
  );
  const availableWeight = available.reduce(
    (total, dimension) => total + weights[dimension],
    0,
  );

  const meetsCoverage =
    available.includes(REQUIRED_DIMENSION) && available.length >= MIN_DIMENSIONS;

  let value: number | null = null;
  if (meetsCoverage && availableWeight > 0) {
    const weighted = available.reduce((total, dimension) => {
      return total + (dimensions[dimension] as number) * weights[dimension];
    }, 0);
    value = round2(weighted / availableWeight);
  }

  const effectiveWeight: Partial<Record<DecisionDimension, number>> = {};
  for (const dimension of available) {
    if (availableWeight > 0) {
      effectiveWeight[dimension] = (weights[dimension] / availableWeight) * 100;
    }
  }

  const breakdown: ScoreBreakdown[] = DIMENSION_ORDER.map((dimension) => ({
    dimension,
    label: BASELINE_LABELS[dimension],
    score: dimensions[dimension],
    baselineWeight: weights[dimension],
    effectiveWeight: effectiveWeight[dimension] ?? null,
    available: dimensions[dimension] !== null,
  }));

  return {
    value,
    status: deriveStatus(value, missing),
    band: bandFor(value),
    availableCriteria: available,
    missingCriteria: missing,
    effectiveWeight,
    // Coverage reflects the evidence base even when no score was published,
    // so an INSUFFICIENT_DATA site can still report how much it does have.
    coverage: totalWeight === 0 ? 0 : availableWeight / totalWeight,
    breakdown,
  };
}

/** Matches Python's round(x, 2) for the non-negative scores used here. */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Data Confidence
// ---------------------------------------------------------------------------

export interface ConfidenceInput {
  readonly coordinateSourceDataYear: string;
  readonly beneficiaryVerificationStatus: string;
  readonly beneficiaryVarianceRecorded: boolean;
  readonly karhutlaScope: string | null;
  readonly missingCriteria: readonly DecisionDimension[];
}

export interface ConfidenceResult {
  readonly level: DataConfidenceLevel;
  /** Diagnostic only. Never presented as scientific precision. */
  readonly points: number;
  readonly reasons: readonly string[];
  /** True when hazard evidence is a district proxy, which caps the level. */
  readonly spatiallyCapped: boolean;
}

/**
 * Six-dimension evidence rubric, max 8 points.
 *
 * Data Confidence NEVER feeds into the Priority Score. They answer different
 * questions — how strong is the indication, and how strong is the evidence
 * behind it — and a site can legitimately be high on one and low on the other.
 * The validator checks this separation explicitly.
 */
export function calculateDataConfidence(input: ConfidenceInput): ConfidenceResult {
  let points = 0;
  const reasons: string[] = [];

  // 1. Source authority. Every site in this dataset comes from a government
  //    portal or authoritative technical source, so this is currently uniform.
  points += 2;
  reasons.push("otoritas sumber: portal pemerintah/teknis resmi");

  // 2. Recency.
  if (input.coordinateSourceDataYear === "2021") {
    reasons.push(
      "koordinat berasal dari dataset 2021, bukan lokasi terverifikasi terkini",
    );
  } else {
    points += 1;
    reasons.push("koordinat dari profil resmi terkini");
  }

  // 3. Completeness.
  const missingCount = input.missingCriteria.length;
  if (missingCount === 0) points += 2;
  else if (missingCount === 1) points += 1;
  reasons.push(`kelengkapan: ${4 - missingCount}/4 dimensi tersedia`);

  // 4. Verification.
  if (input.beneficiaryVerificationStatus === "verified_primary") {
    points += 1;
    reasons.push("beneficiary terverifikasi primer dan bertanggal");
  }

  // 5. Spatial specificity — a scored dimension AND a ceiling.
  const spatiallyCapped =
    input.karhutlaScope === null || input.karhutlaScope.includes("kecamatan");
  if (spatiallyCapped) {
    reasons.push(
      "spesifisitas spasial: bahaya hanya proksi kecamatan, bukan piksel situs",
    );
  } else {
    points += 1;
    reasons.push("spesifisitas spasial: nilai bahaya per titik situs");
  }

  // 6. Source conflict / variance.
  if (input.beneficiaryVarianceRecorded) {
    reasons.push(
      "terdapat variansi antar-view sumber beneficiary (tercatat, bukan konflik)",
    );
  } else {
    points += 1;
  }

  let level: DataConfidenceLevel =
    points >= CONFIDENCE_HIGH_THRESHOLD
      ? "HIGH"
      : points >= CONFIDENCE_MEDIUM_THRESHOLD
        ? "MEDIUM"
        : "NEEDS_VERIFICATION";

  // The ceiling. While hazard evidence describes a district rather than the
  // site, high confidence in a site-level recommendation cannot be justified —
  // however good every other dimension is. This is an evidence argument, not
  // an arithmetic one, which is why it overrides the point total.
  if (spatiallyCapped && level === "HIGH") {
    level = "MEDIUM";
    reasons.push("dibatasi ke MEDIUM karena evidence bahaya belum site-specific");
  }

  return { level, points, reasons, spatiallyCapped };
}

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

export interface RecommendationInput {
  readonly hasLinkedExistingAsset: boolean;
  /** Whether the facility's link to that asset is established, not merely a
   *  shared village name. A name match is not evidence of a physical link,
   *  so this defaults to false wherever the data does not positively say
   *  otherwise. */
  readonly assetLinkIsEstablished: boolean;
  /** Village of the linked asset, named in the reason so the reader can see
   *  exactly which claim is and is not being made. */
  readonly linkedAssetVillage?: string;
  readonly missingCriteria: readonly DecisionDimension[];
}

export interface RecommendationResult {
  readonly type: RecommendationType;
  readonly reason: string;
}

/**
 * Rule order per docs/RECOMMENDATION_LOGIC.md.
 *
 * Every outcome is a recommendation to ASSESS, never to build. Nothing here
 * concludes that a site is suitable for construction or infers any capacity.
 */
export function determineRecommendation(
  input: RecommendationInput,
): RecommendationResult {
  // Rule 1 — an existing PLTS in the picture blocks an automatic "new
  // deployment" call, whether or not the link is established.
  if (input.hasLinkedExistingAsset) {
    const village = input.linkedAssetVillage ?? "";
    if (input.assetLinkIsEstablished) {
      return {
        type: "EXPANSION_ASSESSMENT",
        reason:
          `Terdapat PLTS eksisting di desa ${village} yang keterkaitannya dengan fasilitas ini ` +
          "telah ditetapkan. Kajian diarahkan pada penguatan/ekspansi, bukan deployment baru.",
      };
    }
    return {
      type: "NEEDS_DATA_VERIFICATION",
      reason:
        `Desa fasilitas ini (${village}) bernama sama dengan desa penerima hibah PLTS 2021; ` +
        "hubungan fisik/operasional belum diverifikasi, sehingga jalur ekspansi maupun deployment " +
        "baru belum dapat ditentukan.",
    };
  }

  // Rule 2 — solar carries the largest baseline weight (30). Without
  // site-level GHI the primary dimension cannot be assessed at all, so a
  // positive deployment call would outrun the evidence.
  if (input.missingCriteria.includes("solar")) {
    return {
      type: "NEEDS_DATA_VERIFICATION",
      reason:
        "GHI site-level belum tersedia, sehingga dimensi Solar Suitability (bobot terbesar) tidak dapat dinilai. Rekomendasi deployment belum dapat diberikan.",
    };
  }

  return {
    type: "NEW_DEPLOYMENT_ASSESSMENT",
    reason:
      "Seluruh dimensi utama tersedia dan tidak ada PLTS eksisting yang terkait dengan fasilitas ini.",
  };
}

// ---------------------------------------------------------------------------
// Explainability
// ---------------------------------------------------------------------------

export interface ReasonFactorsInput {
  readonly dimensions: DimensionScores;
  readonly beneficiaryValue: number | null;
  readonly coordinateSourceDataYear: string;
  readonly districtHasHistoricalPlts: boolean;
}

export interface ReasonFactors {
  readonly positive: readonly string[];
  readonly limitations: readonly string[];
}

/**
 * Derives the explanation strings from values that actually exist in the
 * record. These are data-derived phrases, not generated prose: nothing here
 * can reference evidence the dataset does not hold.
 */
export function generateReasonFactors(input: ReasonFactorsInput): ReasonFactors {
  const positive: string[] = [];
  const { criticality, resilience, social } = input.dimensions;

  if (criticality !== null && criticality >= 100) {
    positive.push("fasilitas layanan kesehatan dengan criticality baseline tertinggi");
  }
  if (resilience !== null && resilience >= 100) {
    positive.push("kecamatan berkelas bahaya karhutla Tinggi");
  }
  if (social !== null && social >= 67 && input.beneficiaryValue !== null) {
    positive.push(
      `jumlah peserta didik relatif besar (${Math.trunc(input.beneficiaryValue)})`,
    );
  }

  // These two always hold for the current dataset and are stated for every
  // site rather than only where they happen to be noticed.
  const limitations: string[] = [
    "bahaya karhutla hanya proksi kecamatan, bukan nilai piksel situs",
    "kekeringan hanya konteks kabupaten sehingga dikeluarkan dari skor",
  ];
  if (input.coordinateSourceDataYear === "2021") {
    limitations.push("koordinat berasal dari dataset 2021");
  }
  if (input.districtHasHistoricalPlts) {
    limitations.push(
      "kecamatan memiliki PLTS historis 2021, tetapi keterkaitan dengan fasilitas ini tidak ditetapkan",
    );
  }

  return { positive, limitations };
}
