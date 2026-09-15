import { describe, expect, it } from "vitest";

import { calculateDataConfidence, type ConfidenceInput } from "@/lib/scoring/engine";

const sitePoint = "titik situs";
const districtProxy = "kecamatan (district-level structural proxy)";

function input(overrides: Partial<ConfidenceInput> = {}): ConfidenceInput {
  return {
    coordinateSourceDataYear: "",
    beneficiaryVerificationStatus: "verified_primary",
    beneficiaryVarianceRecorded: false,
    karhutlaScope: sitePoint,
    missingCriteria: [],
    ...overrides,
  };
}

describe("data confidence categories", () => {
  it("awards the documented maximum when every dimension is satisfied", () => {
    const result = calculateDataConfidence(input());
    expect(result.points).toBe(8);
    expect(result.level).toBe("HIGH");
    expect(result.spatiallyCapped).toBe(false);
  });

  it("maps points onto the documented thresholds", () => {
    // 6 points: authority 2 + recency 1 + completeness 1 (one missing) +
    // verification 1 + spatial 1 = 6, no variance penalty.
    expect(
      calculateDataConfidence(input({ missingCriteria: ["solar"] })).points,
    ).toBe(7);
    // Drop to the MEDIUM band.
    const medium = calculateDataConfidence(
      input({
        coordinateSourceDataYear: "2021",
        missingCriteria: ["solar", "social"],
        beneficiaryVerificationStatus: "not_available",
      }),
    );
    expect(medium.points).toBe(4);
    expect(medium.level).toBe("MEDIUM");
  });

  it("falls to NEEDS_VERIFICATION at three points or fewer", () => {
    const weak = calculateDataConfidence(
      input({
        coordinateSourceDataYear: "2021",
        beneficiaryVerificationStatus: "not_available",
        beneficiaryVarianceRecorded: true,
        karhutlaScope: districtProxy,
        missingCriteria: ["solar", "social"],
      }),
    );
    expect(weak.points).toBe(2);
    expect(weak.level).toBe("NEEDS_VERIFICATION");
  });
});

describe("spatial specificity ceiling", () => {
  it("caps an otherwise perfect site below HIGH while hazard is a district proxy", () => {
    const capped = calculateDataConfidence(input({ karhutlaScope: districtProxy }));
    // 7 points would be HIGH on arithmetic alone.
    expect(capped.points).toBe(7);
    expect(capped.level).toBe("MEDIUM");
    expect(capped.spatiallyCapped).toBe(true);
    expect(capped.reasons.join(" ")).toContain("belum site-specific");
  });

  it("treats an unrecorded hazard scope as capped, not as site-specific", () => {
    // Absence of a stated scope is not evidence of site specificity.
    const result = calculateDataConfidence(input({ karhutlaScope: null }));
    expect(result.spatiallyCapped).toBe(true);
    expect(result.level).not.toBe("HIGH");
  });

  it("lifts the cap once hazard evidence is site-level", () => {
    expect(calculateDataConfidence(input()).level).toBe("HIGH");
  });
});

describe("confidence is independent of priority", () => {
  it("takes no priority score as an input at all", () => {
    // Structural guarantee: the function signature cannot see a score, so
    // confidence can never be raised by a high score or lowered by a low one.
    const keys = Object.keys(input());
    expect(keys).not.toContain("priorityScore");
    expect(keys).not.toContain("value");
  });

  it("gives identical results for identical evidence regardless of dimension values", () => {
    const a = calculateDataConfidence(input({ missingCriteria: ["solar"] }));
    const b = calculateDataConfidence(input({ missingCriteria: ["resilience"] }));
    // Both are missing exactly one dimension; which one does not change the
    // strength of the evidence behind what remains.
    expect(a.points).toBe(b.points);
    expect(a.level).toBe(b.level);
  });
});

describe("confidence reasons", () => {
  it("states a reason for every evaluated dimension", () => {
    const result = calculateDataConfidence(input({ coordinateSourceDataYear: "2021" }));
    const text = result.reasons.join(" | ");
    expect(text).toContain("otoritas sumber");
    expect(text).toContain("dataset 2021");
    expect(text).toContain("kelengkapan");
    expect(text).toContain("spesifisitas spasial");
  });
});
