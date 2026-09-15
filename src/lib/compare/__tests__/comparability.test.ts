import { describe, expect, it } from "vitest";

import { assessComparability } from "@/lib/compare/comparability";
import { makeSite } from "@/lib/data/__tests__/fixtures";

const threeDim = makeSite({
  recordId: "A",
  coverageProfile: "criticality+resilience+social",
  availableDimensionCount: 3,
  availableWeightFraction: 0.7,
});
const twoDim = makeSite({
  recordId: "B",
  coverageProfile: "criticality+resilience",
  availableDimensionCount: 2,
  availableWeightFraction: 0.45,
  missingData: ["solar", "social"],
});

describe("comparability", () => {
  it("warns when coverage profiles differ", () => {
    const result = assessComparability([threeDim, twoDim]);
    expect(result.sameCoverageProfile).toBe(false);
    expect(result.warning).toBe(
      "Nilai tidak sepenuhnya sebanding karena kelengkapan dimensinya berbeda.",
    );
  });

  it("does not warn when profiles match", () => {
    const result = assessComparability([threeDim, makeSite({ recordId: "C" })]);
    expect(result.sameCoverageProfile).toBe(true);
    expect(result.warning).toBeNull();
  });

  it("refuses a global ranking unless every site carries the full baseline", () => {
    expect(assessComparability([threeDim, makeSite({ recordId: "C" })]).globallyRankable).toBe(
      false,
    );
    const complete = makeSite({
      recordId: "D",
      globalRankEligible: true,
      availableWeightFraction: 1,
      coverageProfile: "criticality+resilience+social+solar",
      availableDimensionCount: 4,
      missingData: [],
    });
    expect(assessComparability([complete, { ...complete, recordId: "E" }]).globallyRankable).toBe(
      true,
    );
  });

  it("withholds the higher-score note across different evidence bases", () => {
    expect(assessComparability([threeDim, twoDim]).mayHighlightHigherScore).toBe(false);
  });
});
