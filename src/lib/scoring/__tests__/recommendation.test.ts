import { describe, expect, it } from "vitest";

import {
  determineRecommendation,
  generateReasonFactors,
} from "@/lib/scoring/engine";

describe("recommendation rule order", () => {
  it("rule 1: an established link to an existing asset routes to expansion", () => {
    const result = determineRecommendation({
      hasLinkedExistingAsset: true,
      assetLinkIsEstablished: true,
      missingCriteria: [],
    });
    expect(result.type).toBe("EXPANSION_ASSESSMENT");
  });

  it("rule 1: an unestablished link routes to verification, never to new deployment", () => {
    const result = determineRecommendation({
      hasLinkedExistingAsset: true,
      assetLinkIsEstablished: false,
      missingCriteria: [],
    });
    expect(result.type).toBe("NEEDS_DATA_VERIFICATION");
    expect(result.reason).toContain("bernama sama dengan desa penerima hibah");
    expect(result.reason).toContain("belum diverifikasi");
  });

  it("rule 1 outranks rule 2: an asset link decides even with solar present", () => {
    const result = determineRecommendation({
      hasLinkedExistingAsset: true,
      assetLinkIsEstablished: true,
      missingCriteria: [],
    });
    expect(result.type).toBe("EXPANSION_ASSESSMENT");
  });

  it("rule 1 still decides when solar is also missing", () => {
    // HLT-002's situation: it stays NEEDS_DATA_VERIFICATION for a reason that
    // survives the arrival of GHI.
    const result = determineRecommendation({
      hasLinkedExistingAsset: true,
      assetLinkIsEstablished: false,
      missingCriteria: ["solar", "social"],
    });
    expect(result.type).toBe("NEEDS_DATA_VERIFICATION");
    // The reason is about the unverified asset link, not about missing solar:
    // it survives the arrival of GHI.
    expect(result.reason).toContain("hubungan fisik/operasional belum diverifikasi");
    expect(result.reason).not.toContain("Solar Suitability");
  });

  it("rule 2: missing solar blocks any positive deployment call", () => {
    const result = determineRecommendation({
      hasLinkedExistingAsset: false,
      assetLinkIsEstablished: false,
      missingCriteria: ["solar"],
    });
    expect(result.type).toBe("NEEDS_DATA_VERIFICATION");
    expect(result.reason).toContain("Solar Suitability");
  });

  it("rule 3: a full unlinked record reaches new deployment assessment", () => {
    const result = determineRecommendation({
      hasLinkedExistingAsset: false,
      assetLinkIsEstablished: false,
      missingCriteria: [],
    });
    expect(result.type).toBe("NEW_DEPLOYMENT_ASSESSMENT");
  });

  it("missing social alone does not block a deployment assessment", () => {
    // Only solar is gated by rule 2; social absence is reflected in the score
    // status and coverage instead.
    const result = determineRecommendation({
      hasLinkedExistingAsset: false,
      assetLinkIsEstablished: false,
      missingCriteria: ["social"],
    });
    expect(result.type).toBe("NEW_DEPLOYMENT_ASSESSMENT");
  });
});

describe("recommendations never overstate", () => {
  it("phrases every outcome as an assessment, never as a build decision", () => {
    const outcomes = [
      determineRecommendation({ hasLinkedExistingAsset: true, assetLinkIsEstablished: true, linkedAssetVillage: "Sungai Kerawang", missingCriteria: [] }),
      determineRecommendation({ hasLinkedExistingAsset: false, assetLinkIsEstablished: false, missingCriteria: [] }),
      determineRecommendation({ hasLinkedExistingAsset: false, assetLinkIsEstablished: false, missingCriteria: ["solar"] }),
    ];
    for (const outcome of outcomes) {
      expect(outcome.reason).not.toMatch(/layak dibangun|siap dibangun/i);
      expect(outcome.reason).not.toMatch(/\bkWp\b/);
    }
  });
});

describe("reason factors are derived, not generated", () => {
  it("names a beneficiary figure only when that figure exists", () => {
    const withValue = generateReasonFactors({
      dimensions: { solar: null, social: 100, criticality: 70, resilience: 100 },
      beneficiaryValue: 994,
      coordinateSourceDataYear: "",
      districtHasHistoricalPlts: false,
    });
    expect(withValue.positive).toContain("jumlah peserta didik relatif besar (994)");

    const withoutValue = generateReasonFactors({
      dimensions: { solar: null, social: null, criticality: 100, resilience: 67 },
      beneficiaryValue: null,
      coordinateSourceDataYear: "",
      districtHasHistoricalPlts: false,
    });
    expect(withoutValue.positive.join(" ")).not.toContain("peserta didik");
  });

  it("always states the two standing limitations of this dataset", () => {
    const factors = generateReasonFactors({
      dimensions: { solar: null, social: 100, criticality: 70, resilience: 100 },
      beneficiaryValue: 994,
      coordinateSourceDataYear: "",
      districtHasHistoricalPlts: false,
    });
    expect(factors.limitations.join(" ")).toContain("proksi kecamatan");
    expect(factors.limitations.join(" ")).toContain("kekeringan hanya konteks kabupaten");
  });

  it("adds the 2021-coordinate limitation only when it applies", () => {
    const stale = generateReasonFactors({
      dimensions: { solar: null, social: null, criticality: 100, resilience: 67 },
      beneficiaryValue: null,
      coordinateSourceDataYear: "2021",
      districtHasHistoricalPlts: true,
    });
    expect(stale.limitations).toContain("koordinat berasal dari dataset 2021");
    expect(stale.limitations.join(" ")).toContain("PLTS historis 2021");
  });

  it("claims a high-criticality factor only for a genuinely top-criticality site", () => {
    const school = generateReasonFactors({
      dimensions: { solar: null, social: 100, criticality: 70, resilience: 100 },
      beneficiaryValue: 994,
      coordinateSourceDataYear: "",
      districtHasHistoricalPlts: false,
    });
    expect(school.positive.join(" ")).not.toContain("criticality baseline tertinggi");
  });
});
