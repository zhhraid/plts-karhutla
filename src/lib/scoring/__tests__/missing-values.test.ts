/**
 * The NULL-never-zero rule, tested directly.
 *
 * These are the tests that matter most in this codebase. If any of them fails,
 * the product is publishing a fabricated measurement.
 */
import { describe, expect, it } from "vitest";

import {
  calculatePriorityScore,
  calculateResilienceScore,
  calculateSocialScore,
  calculateSolarScore,
  type DimensionScores,
} from "@/lib/scoring/engine";
import { BASELINE_WEIGHTS } from "@/lib/scoring/constants";

describe("NULL is never 0", () => {
  it("keeps a missing beneficiary count as null instead of scoring it 0", () => {
    const result = calculateSocialScore(null, [46, 994, 778]);
    expect(result).toBeNull();
    expect(result).not.toBe(0);
  });

  it("keeps a missing GHI as null instead of scoring it 0", () => {
    const result = calculateSolarScore(null);
    expect(result).toBeNull();
    expect(result).not.toBe(0);
  });

  it("keeps an ineligible hazard observation as null, not 0", () => {
    // Drought is regency-wide: carried as context, never scored.
    expect(
      calculateResilienceScore("Rendah", "context_only_not_site_scoring"),
    ).toBeNull();
  });

  it("still returns a real 0 when 0 is genuinely the measured value", () => {
    // GHI of 0 would be a measurement, not an absence, and must survive.
    expect(calculateSolarScore(0)).toBe(0);
  });

  it("excludes a missing dimension from the numerator AND the denominator", () => {
    const dimensions: DimensionScores = {
      solar: null,
      social: 100,
      criticality: 70,
      resilience: 100,
    };
    const result = calculatePriorityScore(dimensions);

    // (100*25 + 70*20 + 100*25) / 70 = 91.43 — not /100, which would be 64.
    expect(result.value).toBe(91.43);
    expect(result.coverage).toBeCloseTo(0.7, 10);
    expect(result.missingCriteria).toEqual(["solar"]);
  });

  it("does not let a missing criterion quietly depress the ranking", () => {
    // Same three known dimensions; one site additionally has a perfect solar
    // score. Treating the missing solar as 0 would push the second site far
    // below. Renormalisation must leave it scored purely on what it has.
    const withSolar = calculatePriorityScore({
      solar: 100,
      social: 100,
      criticality: 70,
      resilience: 100,
    });
    const withoutSolar = calculatePriorityScore({
      solar: null,
      social: 100,
      criticality: 70,
      resilience: 100,
    });

    const zeroFilled = calculatePriorityScore({
      solar: 0,
      social: 100,
      criticality: 70,
      resilience: 100,
    });

    expect(withoutSolar.value).toBeGreaterThan(zeroFilled.value as number);
    expect(withoutSolar.value).toBe(91.43);
    expect(withSolar.value).toBe(94.0);
    // The gap between "unknown" and "known good" is small; the gap to a
    // zero-filled site is large. That is the whole point of the rule.
    expect((withSolar.value as number) - (withoutSolar.value as number)).toBeLessThan(5);
  });

  it("never scores a dimension as exactly 0 through the social floor", () => {
    // The smallest measured cohort member floors at 10, so it stays
    // distinguishable from "no data" inside a weighted sum.
    expect(calculateSocialScore(46, [46, 994, 778, 222])).toBe(10);
  });

  it("weights sum to 100 so coverage fractions are readable as percentages", () => {
    const total = Object.values(BASELINE_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });
});
