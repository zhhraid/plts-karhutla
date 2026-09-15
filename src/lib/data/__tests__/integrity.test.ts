import { describe, expect, it } from "vitest";

import { assertDatasetIntegrity, findIntegrityIssues } from "@/lib/data/integrity";
import { normaliseDataset, type RawSite } from "@/lib/data/normalise";

function makeRaw(overrides: Partial<RawSite> = {}): RawSite {
  return {
    record_id: "EDU-001",
    facility_name: "SMAN 1 Uji",
    facility_type: "Sekolah",
    district: "SUNGAI RAYA",
    latitude: -0.0762,
    longitude: 109.3758,
    beneficiary_value: 994,
    beneficiary_status: "canonical_verified",
    ghi_value: null,
    ghi_status: "requires_point_extraction",
    karhutla_class: "Tinggi",
    karhutla_scope: "kecamatan (district-level structural proxy)",
    karhutla_high_area_fraction: 0.5293,
    drought_class: "Rendah",
    drought_scope: "Kabupaten Kubu Raya (regency context only)",
    existing_plts_context: "",
    solar_score: null,
    social_score: 100,
    criticality_score: 70,
    resilience_score: 100,
    priority_score: 91.43,
    score_status: "PROVISIONAL_MISSING_SOLAR",
    available_weight_fraction: 0.7,
    data_confidence: "MEDIUM",
    data_confidence_reason: "uji",
    recommendation_type: "NEEDS_DATA_VERIFICATION",
    recommendation_reason: "uji",
    top_positive_factors: "",
    limitations: "",
    missing_data: "solar",
    source_count: 4,
    latest_data_year: "2023",
    coordinate_quality: "official_exact",
    coordinate_source_data_year: "",
    beneficiary_verification_status: "verified_primary",
    beneficiary_variance_recorded: false,
    karhutla_scoring_eligibility: "provisional_district_proxy",
    existing_asset_linked: false,
    existing_asset_village: "",
    existing_asset_link_established: false,
    confidence_points: 5,
    sources: [],
    ...overrides,
  };
}

describe("duplicate record ids", () => {
  it("rejects a dataset containing the same record_id twice", () => {
    const issues = findIntegrityIssues([makeRaw(), makeRaw()]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.problem).toBe("record_id duplikat");
  });

  it("accepts distinct ids", () => {
    expect(findIntegrityIssues([makeRaw(), makeRaw({ record_id: "EDU-002" })]))
      .toHaveLength(0);
  });

  it("rejects an empty record_id", () => {
    const issues = findIntegrityIssues([makeRaw({ record_id: "  " })]);
    expect(issues[0]?.field).toBe("record_id");
  });
});

describe("invalid records", () => {
  it("rejects missing coordinates instead of mapping the site at 0,0", () => {
    const issues = findIntegrityIssues([
      makeRaw({ latitude: null as unknown as number }),
    ]);
    expect(issues[0]?.problem).toBe("koordinat tidak tersedia");
  });

  it("rejects coordinates outside the valid range", () => {
    const issues = findIntegrityIssues([makeRaw({ longitude: 999 })]);
    expect(issues[0]?.problem).toContain("di luar rentang sah");
  });

  it("rejects a score outside 0-100", () => {
    expect(findIntegrityIssues([makeRaw({ priority_score: 140 })])[0]?.problem)
      .toContain("di luar rentang 0-100");
  });

  it("accepts a null score — absence is valid, a wrong number is not", () => {
    expect(
      findIntegrityIssues([
        makeRaw({
          priority_score: null,
          solar_score: null,
          social_score: null,
          criticality_score: null,
          resilience_score: null,
          missing_data: "solar; social; criticality; resilience",
        }),
      ]),
    ).toHaveLength(0);
  });

  it("rejects a record whose missing_data disagrees with its score columns", () => {
    // Listed as missing but carries a value.
    expect(
      findIntegrityIssues([makeRaw({ solar_score: 5 })])[0]?.problem,
    ).toBe("tercatat hilang tetapi memiliki nilai");
    // Null but not listed — the NULL-never-zero rule's boundary check.
    expect(
      findIntegrityIssues([makeRaw({ social_score: null })])
        .map((issue) => issue.problem),
    ).toContain("bernilai null tetapi tidak tercatat di missing_data");
  });

  it("reports every problem at once rather than failing on the first", () => {
    const issues = findIntegrityIssues([
      makeRaw({ latitude: 400, longitude: 400, priority_score: 500 }),
    ]);
    expect(issues.length).toBeGreaterThanOrEqual(3);
  });
});

describe("dataset rejection", () => {
  it("throws with an actionable message and names every offending record", () => {
    expect(() => assertDatasetIntegrity([makeRaw(), makeRaw()])).toThrow(
      /record_id duplikat/,
    );
    expect(() => assertDatasetIntegrity([makeRaw(), makeRaw()])).toThrow(
      /npm run data:build/,
    );
  });

  it("withholds the whole dataset rather than rendering the valid part", () => {
    expect(() =>
      normaliseDataset({
        methodology: "uji",
        weights_are: "uji",
        baseline_weights: { solar: 30, social: 25, criticality: 20, resilience: 25 },
        social_normalisation: "uji",
        missing_value_policy: "uji",
        sites: [makeRaw(), makeRaw({ record_id: "EDU-002", latitude: 400 })],
      }),
    ).toThrow(/integritas/);
  });

  it("passes a well-formed dataset through", () => {
    const result = normaliseDataset({
      methodology: "uji",
      weights_are: "uji",
      baseline_weights: { solar: 30, social: 25, criticality: 20, resilience: 25 },
      social_normalisation: "uji",
      missing_value_policy: "uji",
      sites: [makeRaw()],
    });
    expect(result.sites).toHaveLength(1);
    expect(result.sites[0]?.priorityScore).toBe(91.43);
  });
});

describe("enum guards", () => {
  it("refuses an unknown enum rather than coercing it to a nearest label", () => {
    expect(() =>
      normaliseDataset({
        methodology: "uji",
        weights_are: "uji",
        baseline_weights: { solar: 30, social: 25, criticality: 20, resilience: 25 },
        social_normalisation: "uji",
        missing_value_policy: "uji",
        sites: [makeRaw({ data_confidence: "SANGAT_TINGGI" })],
      }),
    ).toThrow(/unknown data_confidence/);
  });
});

describe("normalisation preserves absence", () => {
  it("never turns a null measurement into a number", () => {
    const { sites } = normaliseDataset({
      methodology: "uji",
      weights_are: "uji",
      baseline_weights: { solar: 30, social: 25, criticality: 20, resilience: 25 },
      social_normalisation: "uji",
      missing_value_policy: "uji",
      sites: [makeRaw({ beneficiary_value: null, missing_data: "solar" })],
    });
    const site = sites[0];
    expect(site?.solar.ghiValue).toBeNull();
    expect(site?.beneficiary.value).toBeNull();
    expect(site?.beneficiary.value).not.toBe(0);
    // Scope degrades to "unknown" rather than claiming a site-level reading.
    expect(site?.beneficiary.scope).toBe("unknown");
  });

  it("reads the hazard scope as a district proxy, not a site measurement", () => {
    const { sites } = normaliseDataset({
      methodology: "uji",
      weights_are: "uji",
      baseline_weights: { solar: 30, social: 25, criticality: 20, resilience: 25 },
      social_normalisation: "uji",
      missing_value_policy: "uji",
      sites: [makeRaw()],
    });
    expect(sites[0]?.karhutla.scope).toBe("kecamatan_proxy");
    expect(sites[0]?.drought.scope).toBe("kabupaten_context_only");
    expect(sites[0]?.drought.eligibleForScoring).toBe(false);
  });
});
