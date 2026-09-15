import { describe, expect, it } from "vitest";

import {
  bandFor,
  calculateCriticalityScore,
  calculatePriorityScore,
  calculateResilienceScore,
  calculateSocialScore,
} from "@/lib/scoring/engine";

describe("per-dimension scores", () => {
  it("maps facility type to the documented criticality baseline", () => {
    expect(calculateCriticalityScore("Puskesmas")).toBe(100);
    expect(calculateCriticalityScore("Sekolah")).toBe(70);
  });

  it("returns null for an unknown facility type rather than a default", () => {
    expect(calculateCriticalityScore("Pustu")).toBeNull();
  });

  it("maps eligible karhutla classes onto the ordinal scale", () => {
    const eligible = "provisional_district_proxy";
    expect(calculateResilienceScore("Rendah", eligible)).toBe(33);
    expect(calculateResilienceScore("Sedang", eligible)).toBe(67);
    expect(calculateResilienceScore("Tinggi", eligible)).toBe(100);
  });

  it("returns null for a hazard class the mapping does not know", () => {
    expect(
      calculateResilienceScore("Sangat Tinggi", "provisional_district_proxy"),
    ).toBeNull();
  });

  it("normalises social impact on log10 into [10, 100]", () => {
    const cohort = [994, 778, 222, 46];
    expect(calculateSocialScore(994, cohort)).toBeCloseTo(100, 6);
    expect(calculateSocialScore(46, cohort)).toBeCloseTo(10, 6);
    // Log compression: 222 sits well above where a linear scale would place it
    // (linear would give ~10 + (222-46)/(994-46)*90 ≈ 26.7).
    const middle = calculateSocialScore(222, cohort) as number;
    expect(middle).toBeGreaterThan(40);
    expect(middle).toBeLessThan(70);
  });

  it("returns 100 when a cohort has no spread to normalise against", () => {
    expect(calculateSocialScore(500, [500, 500])).toBe(100);
    expect(calculateSocialScore(500, [500])).toBe(100);
  });
});

describe("priority score range and metadata", () => {
  const cases = [
    { solar: 100, social: 100, criticality: 100, resilience: 100 },
    { solar: 0, social: 10, criticality: 70, resilience: 33 },
    { solar: null, social: null, criticality: 100, resilience: 67 },
    { solar: 55.5, social: 10, criticality: 70, resilience: 100 },
  ] as const;

  it("always lands inside 0-100", () => {
    for (const dimensions of cases) {
      const { value } = calculatePriorityScore(dimensions);
      expect(value).not.toBeNull();
      expect(value as number).toBeGreaterThanOrEqual(0);
      expect(value as number).toBeLessThanOrEqual(100);
    }
  });

  it("reproduces the documented EDU-001 worked example", () => {
    const result = calculatePriorityScore({
      solar: null,
      social: 100,
      criticality: 70,
      resilience: 100,
    });
    expect(result.value).toBe(91.43);
    expect(result.status).toBe("PROVISIONAL_MISSING_SOLAR");
  });

  it("reproduces the documented HLT-001 worked example", () => {
    const result = calculatePriorityScore({
      solar: null,
      social: null,
      criticality: 100,
      resilience: 67,
    });
    expect(result.value).toBe(81.67);
    expect(result.status).toBe("NEEDS_DATA_VERIFICATION");
    expect(result.coverage).toBeCloseTo(0.45, 10);
  });

  it("reports effective weights that renormalise to 100 percent", () => {
    const { effectiveWeight, availableCriteria } = calculatePriorityScore({
      solar: null,
      social: 100,
      criticality: 70,
      resilience: 100,
    });
    const total = availableCriteria.reduce(
      (sum, dimension) => sum + (effectiveWeight[dimension] ?? 0),
      0,
    );
    expect(total).toBeCloseTo(100, 10);
    expect(effectiveWeight.solar).toBeUndefined();
  });

  it("returns every metadata field the UI needs", () => {
    const result = calculatePriorityScore({
      solar: null,
      social: 50,
      criticality: 70,
      resilience: 33,
    });
    expect(result.availableCriteria).toEqual(["social", "criticality", "resilience"]);
    expect(result.missingCriteria).toEqual(["solar"]);
    expect(result.breakdown).toHaveLength(4);
    expect(result.breakdown.filter((row) => row.available)).toHaveLength(3);
  });
});

describe("weight renormalisation", () => {
  it("gives the same score when the only missing dimension is dropped entirely", () => {
    // Renormalising over {social, criticality, resilience} must equal scoring
    // those three against a weight set that never contained solar.
    const renormalised = calculatePriorityScore({
      solar: null,
      social: 80,
      criticality: 70,
      resilience: 67,
    });
    const direct =
      (80 * 25 + 70 * 20 + 67 * 25) / 70;
    expect(renormalised.value).toBeCloseTo(Math.round(direct * 100) / 100, 10);
  });

  it("returns coverage 1 only when all four dimensions are present", () => {
    expect(
      calculatePriorityScore({ solar: 5, social: 5, criticality: 5, resilience: 5 })
        .coverage,
    ).toBe(1);
    expect(
      calculatePriorityScore({ solar: null, social: 5, criticality: 5, resilience: 5 })
        .coverage,
    ).toBeCloseTo(0.7, 10);
  });

  it("honours an alternative weight set without changing the formula", () => {
    const equal = { solar: 25, social: 25, criticality: 25, resilience: 25 };
    const result = calculatePriorityScore(
      { solar: null, social: 100, criticality: 70, resilience: 100 },
      equal,
    );
    expect(result.value).toBe(90);
  });
});

describe("minimum coverage", () => {
  it("publishes no number when criticality is absent", () => {
    const result = calculatePriorityScore({
      solar: 90,
      social: 90,
      criticality: null,
      resilience: 90,
    });
    expect(result.value).toBeNull();
    expect(result.status).toBe("INSUFFICIENT_DATA");
  });

  it("publishes no number when only one dimension is present", () => {
    const result = calculatePriorityScore({
      solar: null,
      social: null,
      criticality: 100,
      resilience: null,
    });
    expect(result.value).toBeNull();
    expect(result.status).toBe("INSUFFICIENT_DATA");
  });

  it("still reports coverage for an unscored site", () => {
    const result = calculatePriorityScore({
      solar: null,
      social: null,
      criticality: 100,
      resilience: null,
    });
    expect(result.coverage).toBeCloseTo(0.2, 10);
  });
});

describe("priority band", () => {
  it("never shows an unscored site as LOW", () => {
    expect(bandFor(null)).toBe("NEEDS_VERIFICATION");
  });

  it("uses the documented thresholds", () => {
    expect(bandFor(75)).toBe("HIGH");
    expect(bandFor(74.99)).toBe("MEDIUM");
    expect(bandFor(50)).toBe("MEDIUM");
    expect(bandFor(49.99)).toBe("LOW");
    expect(bandFor(0)).toBe("LOW");
  });
});
