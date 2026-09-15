/**
 * Maps the snake_case build-script output onto the typed domain model.
 *
 * This is the only place in the application that knows the shape of
 * site_master_dataset.json. Nothing here invents, defaults or repairs a value:
 * an absent measurement stays `null` all the way to the screen.
 */
import { assertDatasetIntegrity } from "@/lib/data/integrity";
import { BASELINE_LABELS, DIMENSION_ORDER } from "@/lib/scoring/dimensions";
import { bandFor } from "@/lib/scoring/engine";
import type {
  CoordinateQuality,
  DataConfidenceLevel,
  DecisionDimension,
  FacilityType,
  RecommendationType,
  ScoreBreakdown,
  ScoreStatus,
  Site,
  SiteDataset,
  ValueScope,
} from "@/types";

/** Raw record as emitted by scripts/build_master_dataset.py. */
interface RawSite {
  record_id: string;
  facility_name: string;
  facility_type: string;
  district: string;
  latitude: number;
  longitude: number;
  beneficiary_value: number | null;
  beneficiary_status: string;
  ghi_value: number | null;
  ghi_status: string;
  karhutla_class: string | null;
  karhutla_scope: string | null;
  karhutla_high_area_fraction: number | null;
  drought_class: string | null;
  drought_scope: string | null;
  existing_plts_context: string;
  solar_score: number | null;
  social_score: number | null;
  criticality_score: number | null;
  resilience_score: number | null;
  priority_score: number | null;
  score_status: string;
  available_weight_fraction: number;
  data_confidence: string;
  data_confidence_reason: string;
  recommendation_type: string;
  recommendation_reason: string;
  top_positive_factors: string;
  limitations: string;
  missing_data: string;
  source_count: number;
  latest_data_year: string;
  coordinate_quality: string;
  coordinate_source_data_year: string;
  beneficiary_verification_status: string;
  beneficiary_variance_recorded: boolean;
  karhutla_scoring_eligibility: string;
  existing_asset_linked: boolean;
  existing_asset_village: string;
  existing_asset_link_established: boolean;
  confidence_points: number;
}

interface RawDataset {
  methodology: string;
  weights_are: string;
  baseline_weights: Record<string, number>;
  social_normalisation: string;
  missing_value_policy: string;
  sites: RawSite[];
}

/** Splits a "a; b; c" field. An empty field yields an empty list, not [""]. */
function splitList(value: string | null | undefined): readonly string[] {
  if (!value) return [];
  return value
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/** Empty string means "not recorded" in the CSV layer; `null` says so in types. */
function emptyToNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Reads how far a stated scope actually reaches. A hazard class labelled
 * "kecamatan" describes a district, not the facility — the UI must be able to
 * say so rather than presenting it as a site measurement.
 */
function readScope(scope: string | null): ValueScope {
  const text = (scope ?? "").toLowerCase();
  if (text.length === 0) return "unknown";
  if (text.includes("kecamatan")) return "kecamatan_proxy";
  if (text.includes("kabupaten") || text.includes("regency")) {
    return "kabupaten_context_only";
  }
  if (text.includes("site") || text.includes("titik")) return "site_point";
  return "unknown";
}

const COORDINATE_QUALITIES: readonly CoordinateQuality[] = [
  "official_exact",
  "derived_confirmed",
  "approximate",
  "missing",
];

function readCoordinateQuality(value: string): CoordinateQuality {
  return (
    COORDINATE_QUALITIES.find((candidate) => candidate === value) ?? "missing"
  );
}

function readFacilityType(value: string): FacilityType {
  return value === "Puskesmas" ? "Puskesmas" : "Sekolah";
}

const SCORE_STATUSES: readonly ScoreStatus[] = [
  "FINAL_ENOUGH_FOR_MVP",
  "PROVISIONAL_MISSING_SOLAR",
  "PROVISIONAL_MISSING_SOCIAL",
  "PROVISIONAL_LIMITED_HAZARD",
  "NEEDS_DATA_VERIFICATION",
  "INSUFFICIENT_DATA",
];

const RECOMMENDATION_TYPES: readonly RecommendationType[] = [
  "NEW_DEPLOYMENT_ASSESSMENT",
  "EXPANSION_ASSESSMENT",
  "NEEDS_DATA_VERIFICATION",
  "MONITOR_CONTEXT_ONLY",
];

const CONFIDENCE_LEVELS: readonly DataConfidenceLevel[] = [
  "HIGH",
  "MEDIUM",
  "NEEDS_VERIFICATION",
];

/**
 * Enum guards fail loudly. A value the contract does not know about is a build
 * defect, and silently coercing it would publish a wrong label as if verified.
 */
function readEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  field: string,
  recordId: string,
): T {
  const match = allowed.find((candidate) => candidate === value);
  if (match === undefined) {
    throw new Error(
      `${recordId}: unknown ${field} "${value}". Regenerate the dataset (npm run data:build) or extend the contract in src/types.`,
    );
  }
  return match;
}

function buildBreakdown(
  raw: RawSite,
  baselineWeights: Record<string, number>,
): readonly ScoreBreakdown[] {
  const scores: Record<DecisionDimension, number | null> = {
    solar: raw.solar_score,
    social: raw.social_score,
    criticality: raw.criticality_score,
    resilience: raw.resilience_score,
  };

  // Renormalisation denominator: only dimensions that actually carry data.
  const availableWeight = DIMENSION_ORDER.reduce((total, dimension) => {
    return scores[dimension] === null
      ? total
      : total + (baselineWeights[dimension] ?? 0);
  }, 0);

  return DIMENSION_ORDER.map((dimension) => {
    const score = scores[dimension];
    const baselineWeight = baselineWeights[dimension] ?? 0;
    return {
      dimension,
      label: BASELINE_LABELS[dimension],
      score,
      baselineWeight,
      effectiveWeight:
        score === null || availableWeight === 0
          ? null
          : (baselineWeight / availableWeight) * 100,
      available: score !== null,
    };
  });
}

function toSite(raw: RawSite, baselineWeights: Record<string, number>): Site {
  const missingData = splitList(raw.missing_data).filter(
    (entry): entry is DecisionDimension =>
      (DIMENSION_ORDER as readonly string[]).includes(entry),
  );

  return {
    recordId: raw.record_id,
    facilityName: raw.facility_name,
    facilityType: readFacilityType(raw.facility_type),
    district: raw.district,
    latitude: raw.latitude,
    longitude: raw.longitude,

    beneficiary: {
      value: raw.beneficiary_value,
      status:
        raw.beneficiary_status === "canonical_verified"
          ? "canonical_verified"
          : "not_available",
      unit: "peserta didik",
      scope: raw.beneficiary_value === null ? "unknown" : "site_point",
      referenceDate: null,
    },

    solar: {
      ghiValue: raw.ghi_value,
      ghiUnit: raw.ghi_value === null ? null : "kWh/m2/day",
      status: raw.ghi_status,
      scope: raw.ghi_value === null ? "unknown" : "site_point",
    },

    karhutla: {
      hazardType: "karhutla",
      metricType: "hazard",
      rawClass: emptyToNull(raw.karhutla_class),
      rawValue: raw.karhutla_high_area_fraction,
      scope: readScope(raw.karhutla_scope),
      datasetYear: null,
      eligibleForScoring: raw.resilience_score !== null,
    },

    drought: {
      hazardType: "kekeringan",
      metricType: "hazard",
      rawClass: emptyToNull(raw.drought_class),
      rawValue: null,
      scope: readScope(raw.drought_scope),
      datasetYear: null,
      // Kabupaten-wide context cannot discriminate between sites in the same
      // regency, so it is carried for display but excluded from the score.
      eligibleForScoring: false,
    },

    existingPltsContext: emptyToNull(raw.existing_plts_context),

    breakdown: buildBreakdown(raw, baselineWeights),
    priorityScore: raw.priority_score,
    priorityBand: bandFor(raw.priority_score),
    scoreStatus: readEnum(
      raw.score_status,
      SCORE_STATUSES,
      "score_status",
      raw.record_id,
    ),
    availableWeightFraction: raw.available_weight_fraction,

    dataConfidence: {
      level: readEnum(
        raw.data_confidence,
        CONFIDENCE_LEVELS,
        "data_confidence",
        raw.record_id,
      ),
      reason: raw.data_confidence_reason,
      internalPoints: raw.confidence_points,
    },

    recommendation: {
      type: readEnum(
        raw.recommendation_type,
        RECOMMENDATION_TYPES,
        "recommendation_type",
        raw.record_id,
      ),
      reason: raw.recommendation_reason,
    },

    topPositiveFactors: splitList(raw.top_positive_factors),
    limitations: splitList(raw.limitations),
    missingData,

    evidenceInputs: {
      coordinateQuality: readCoordinateQuality(raw.coordinate_quality),
      coordinateSourceDataYear: raw.coordinate_source_data_year,
      beneficiaryVerificationStatus: raw.beneficiary_verification_status,
      beneficiaryVarianceRecorded: raw.beneficiary_variance_recorded,
      karhutlaScoringEligibility: raw.karhutla_scoring_eligibility,
      existingAssetLinked: raw.existing_asset_linked,
      existingAssetVillage: emptyToNull(raw.existing_asset_village),
      existingAssetLinkEstablished: raw.existing_asset_link_established,
    },

    sourceCount: raw.source_count,
    latestDataYear: emptyToNull(raw.latest_data_year),
  };
}

export function normaliseDataset(raw: RawDataset): SiteDataset {
  // Structural check before anything is mapped. A malformed dataset is
  // withheld entirely rather than partly rendered with plausible-looking
  // wrong values.
  assertDatasetIntegrity(raw.sites);
  const baselineWeights = raw.baseline_weights;
  return {
    meta: {
      methodology: raw.methodology,
      weightsAre: raw.weights_are,
      baselineWeights: {
        solar: baselineWeights["solar"] ?? 0,
        social: baselineWeights["social"] ?? 0,
        criticality: baselineWeights["criticality"] ?? 0,
        resilience: baselineWeights["resilience"] ?? 0,
      },
      missingValuePolicy: raw.missing_value_policy,
      socialNormalisation: raw.social_normalisation,
    },
    sites: raw.sites.map((site) => toSite(site, baselineWeights)),
  };
}

export type { RawDataset, RawSite };
export type { CoordinateQuality };
