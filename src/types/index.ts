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

/** Which data layer a source row provides. */
export type SourceLayer =
  | "facility"
  | "coordinate"
  | "beneficiary"
  | "solar"
  | "karhutla"
  | "kekeringan";

/**
 * One row of provenance, copied verbatim from the interim observation layer.
 *
 * A layer with no interim record produces no row at all. An empty source row
 * would look like provenance while carrying none.
 */
export interface SourceReference {
  readonly layer: SourceLayer;
  readonly label: string;
  readonly sourceName: string;
  readonly sourceUrl: string | null;
  /** The reference string exactly as the source states it. */
  readonly reference: string | null;
  readonly referenceYear: string | null;
  readonly verificationStatus: string;
  readonly scope: ValueScope;
  readonly scopeText: string | null;
  /** Describes a past state rather than the current one. */
  readonly isHistorical: boolean;
  /** Stands in for a site-level value it is not. */
  readonly isProvisionalProxy: boolean;
  /** Carries an explicit "not yet verified" status from the source layer. */
  readonly awaitingVerification: boolean;
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

/**
 * The raw facts the Data Confidence rubric is evaluated over.
 *
 * Carried on every site so the application can recompute and explain the
 * confidence level from the same inputs the pipeline used, instead of having
 * to trust an opaque category.
 */
export interface EvidenceInputs {
  readonly coordinateQuality: CoordinateQuality;
  readonly coordinateSourceDataYear: string;
  readonly beneficiaryVerificationStatus: string;
  readonly beneficiaryVarianceRecorded: boolean;
  readonly karhutlaScoringEligibility: string;
  /** A linked existing PLTS asset row — linkage itself may be unverified. */
  readonly existingAssetLinked: boolean;
  readonly existingAssetVillage: string | null;
  /** True only where the data positively states the link is verified. A shared
   *  village name never sets this. */
  readonly existingAssetLinkEstablished: boolean;
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

  readonly evidenceInputs: EvidenceInputs;

  readonly sources: readonly SourceReference[];
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
