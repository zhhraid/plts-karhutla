/**
 * Data contract for SURYA-SIAGA.
 *
 * Mirrors data/processed/site_master_dataset.json, produced by
 * scripts/build_master_dataset.py. No `any` anywhere.
 *
 * The single most important rule encoded here: a missing measurement is
 * `null`, never `0`. `0` is a real measured value; `null` means unknown.
 */

export type FacilityType = "Sekolah" | "Puskesmas";

export type CoordinateQuality =
  | "official_exact"
  | "derived_confirmed"
  | "approximate"
  | "missing";

/** Result-completeness of a Priority Score. Provisional is never a final result. */
export type ScoreStatus =
  | "FINAL_ENOUGH_FOR_MVP"
  | "PROVISIONAL_MISSING_SOLAR"
  | "PROVISIONAL_MISSING_SOCIAL"
  | "PROVISIONAL_LIMITED_HAZARD"
  | "NEEDS_DATA_VERIFICATION"
  | "INSUFFICIENT_DATA";

/** Strength of the evidence. Deliberately independent of Priority Score. */
export type DataConfidenceLevel = "HIGH" | "MEDIUM" | "NEEDS_VERIFICATION";

export type RecommendationType =
  | "NEW_DEPLOYMENT_ASSESSMENT"
  | "EXPANSION_ASSESSMENT"
  | "NEEDS_DATA_VERIFICATION"
  | "MONITOR_CONTEXT_ONLY";

/** Display band for a Priority Score. Not a fifth scoring dimension. */
export type PriorityBand = "HIGH" | "MEDIUM" | "LOW" | "NEEDS_VERIFICATION";

export type DecisionDimension = "solar" | "social" | "criticality" | "resilience";

/** How far a value's geography actually reaches. Guards against reading a
 *  district-wide figure as if it described one facility. */
export type ValueScope =
  | "site_point"
  | "kecamatan_proxy"
  | "kabupaten_context_only"
  | "unknown";

export type VerificationMethod =
  | "agent_verified"
  | "external_manual_verification"
  | "external_web_research"
  | "snippet_only";

export interface SourceReference {
  readonly sourceName: string;
  readonly sourceUrl: string | null;
  /** A = primary official, B = authoritative technical, C = credible contextual. */
  readonly authority: "A" | "B" | "C";
  readonly dataYear: string | null;
  readonly retrievedAt: string | null;
  readonly verificationMethod: VerificationMethod | null;
  readonly licence: string | null;
  readonly attributionText: string | null;
}

export interface ScoreBreakdown {
  readonly dimension: DecisionDimension;
  readonly label: string;
  /** null when the dimension has no data — excluded from numerator AND denominator. */
  readonly score: number | null;
  readonly baselineWeight: number;
  /** Share of the final score this dimension actually contributed, after renormalisation. */
  readonly effectiveWeight: number | null;
  readonly available: boolean;
}

export interface DataConfidence {
  readonly level: DataConfidenceLevel;
  readonly reason: string;
  /** Diagnostic only; the UI leads with `level`, not this number. */
  readonly internalPoints: number | null;
}

export interface Recommendation {
  readonly type: RecommendationType;
  readonly reason: string;
}

export interface BeneficiaryObservation {
  readonly value: number | null;
  readonly status: "canonical_verified" | "not_available";
  readonly unit: string;
  readonly scope: ValueScope;
  readonly referenceDate: string | null;
}

export interface HazardObservation {
  readonly hazardType: "karhutla" | "kekeringan";
  /** hazard ≠ risk. Never merge the two into one comparison series. */
  readonly metricType: "hazard" | "risk";
  readonly rawClass: string | null;
  readonly rawValue: number | null;
  readonly scope: ValueScope;
  readonly datasetYear: string | null;
  readonly eligibleForScoring: boolean;
}

export interface SolarObservation {
  readonly ghiValue: number | null;
  readonly ghiUnit: string | null;
  readonly status: string;
  readonly scope: ValueScope;
}

export interface Site {
  readonly recordId: string;
  readonly facilityName: string;
  readonly facilityType: FacilityType;
  readonly district: string;
  readonly latitude: number;
  readonly longitude: number;

  readonly beneficiary: BeneficiaryObservation;
  readonly solar: SolarObservation;
  readonly karhutla: HazardObservation;
  readonly drought: HazardObservation;

  readonly existingPltsContext: string | null;

  readonly breakdown: readonly ScoreBreakdown[];
  /** null when minimum coverage is not met — no number is published at all. */
  readonly priorityScore: number | null;
  readonly priorityBand: PriorityBand;
  readonly scoreStatus: ScoreStatus;
  /** Fraction of total baseline weight backed by real data. Scores with different
   *  fractions rest on different bases and are not fully comparable. */
  readonly availableWeightFraction: number;

  readonly dataConfidence: DataConfidence;
  readonly recommendation: Recommendation;

  readonly topPositiveFactors: readonly string[];
  readonly limitations: readonly string[];
  readonly missingData: readonly DecisionDimension[];

  readonly sourceCount: number;
  readonly latestDataYear: string | null;
}

export interface MethodologyMeta {
  readonly methodology: string;
  readonly weightsAre: string;
  readonly baselineWeights: Readonly<Record<DecisionDimension, number>>;
  readonly missingValuePolicy: string;
  readonly socialNormalisation: string;
}

export interface SiteDataset {
  readonly meta: MethodologyMeta;
  readonly sites: readonly Site[];
}
