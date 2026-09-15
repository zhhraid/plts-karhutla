import type { Site } from "@/types";

/**
 * Hand-built sites for query tests.
 *
 * Deliberately synthetic: the query layer must be testable against shapes the
 * real dataset does not currently contain (a HIGH-confidence site, a fully
 * covered score, an unscored site), so that behaviour is verified now rather
 * than discovered when the data improves.
 */
export function makeSite(overrides: Partial<Site> = {}): Site {
  const base: Site = {
    recordId: "TST-001",
    facilityName: "SDN 1 Uji",
    facilityType: "Sekolah",
    district: "SUNGAI RAYA",
    latitude: -0.08,
    longitude: 109.37,
    beneficiary: {
      value: 100,
      status: "canonical_verified",
      unit: "peserta didik",
      scope: "site_point",
      referenceDate: null,
    },
    solar: { ghiValue: null, ghiUnit: null, status: "requires_point_extraction", scope: "unknown" },
    karhutla: {
      hazardType: "karhutla",
      metricType: "hazard",
      rawClass: "Sedang",
      rawValue: null,
      scope: "kecamatan_proxy",
      datasetYear: null,
      eligibleForScoring: true,
    },
    drought: {
      hazardType: "kekeringan",
      metricType: "hazard",
      rawClass: "Rendah",
      rawValue: null,
      scope: "kabupaten_context_only",
      datasetYear: null,
      eligibleForScoring: false,
    },
    existingPltsContext: null,
    breakdown: [],
    priorityScore: 70,
    priorityBand: "MEDIUM",
    scoreStatus: "PROVISIONAL_MISSING_SOLAR",
    availableWeightFraction: 0.7,
    dataConfidence: { level: "MEDIUM", reason: "uji", internalPoints: 5 },
    recommendation: { type: "NEEDS_DATA_VERIFICATION", reason: "uji" },
    topPositiveFactors: [],
    limitations: [],
    missingData: ["solar"],
    evidenceInputs: {
      coordinateQuality: "official_exact",
      coordinateSourceDataYear: "",
      beneficiaryVerificationStatus: "verified_primary",
      beneficiaryVarianceRecorded: false,
      karhutlaScoringEligibility: "provisional_district_proxy",
      existingAssetLinked: false,
      existingAssetVillage: null,
      existingAssetLinkEstablished: false,
    },
    sourceCount: 4,
    latestDataYear: "2023",
  };
  return { ...base, ...overrides };
}
