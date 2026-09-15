import { describe, expect, it } from "vitest";

import { buildInsights } from "@/lib/compare/insights";
import { makeSite } from "@/lib/data/__tests__/fixtures";
import type { Site } from "@/types";

const big = makeSite({
  recordId: "A",
  facilityName: "SMAN 1 Sungai Raya",
  beneficiary: { ...makeSite().beneficiary, value: 994 },
  priorityScore: 91.43,
});
const small = makeSite({
  recordId: "B",
  facilityName: "SD Negeri 22 Batu Ampar",
  beneficiary: { ...makeSite().beneficiary, value: 46 },
  priorityScore: 47.5,
});
const puskesmasNoBeneficiary = makeSite({
  recordId: "C",
  facilityName: "Puskesmas Kubu",
  facilityType: "Puskesmas",
  beneficiary: { ...makeSite().beneficiary, value: null, status: "not_available" },
  breakdown: [
    { dimension: "solar", label: "Solar Suitability", score: null, baselineWeight: 30, effectiveWeight: null, available: false },
    { dimension: "social", label: "Social Benefit", score: null, baselineWeight: 25, effectiveWeight: null, available: false },
    { dimension: "criticality", label: "Service Criticality", score: 100, baselineWeight: 20, effectiveWeight: 44.4, available: true },
    { dimension: "resilience", label: "Resilience Need", score: 67, baselineWeight: 25, effectiveWeight: 55.6, available: true },
  ],
  coverageProfile: "criticality+resilience",
  availableDimensionCount: 2,
  availableWeightFraction: 0.45,
  missingData: ["solar", "social"],
});

function texts(sites: readonly Site[]): string {
  return buildInsights(sites).map((insight) => insight.text).join(" | ");
}

describe("deterministic insights", () => {
  it("produces nothing below two sites", () => {
    expect(buildInsights([])).toEqual([]);
    expect(buildInsights([big])).toEqual([]);
  });

  it("compares beneficiaries only where both values exist", () => {
    expect(texts([big, small])).toContain("penerima manfaat terverifikasi lebih besar");
    // The puskesmas has no beneficiary value, so no beneficiary comparison
    // may be drawn against it.
    expect(texts([big, puskesmasNoBeneficiary])).not.toContain(
      "penerima manfaat terverifikasi lebih besar",
    );
  });

  it("never states a value for a NULL", () => {
    const output = texts([big, puskesmasNoBeneficiary]);
    expect(output).not.toMatch(/\bnull\b/i);
    expect(output).not.toMatch(/Puskesmas Kubu memiliki penerima manfaat \d/);
  });

  it("pairs a higher criticality with what is missing at that site", () => {
    const output = texts([big, puskesmasNoBeneficiary]);
    expect(output).toContain("criticality baseline lebih tinggi");
    expect(output).toContain("belum tersedia");
  });

  it("names each missing dimension explicitly", () => {
    expect(texts([big, puskesmasNoBeneficiary])).toContain(
      "Solar Suitability dan Social Benefit",
    );
  });

  it("discloses the district-level hazard proxy", () => {
    expect(texts([big, small])).toContain("proksi struktural tingkat kecamatan");
  });

  it("leads with the comparability warning when evidence bases differ", () => {
    const insights = buildInsights([big, puskesmasNoBeneficiary]);
    expect(insights[0]?.kind).toBe("comparability");
    expect(insights[0]?.text).toContain("tidak sepenuhnya sebanding");
  });

  it("offers a higher-score note only within one coverage profile", () => {
    expect(texts([big, small])).toContain("skor provisional lebih tinggi");
    expect(texts([big, puskesmasNoBeneficiary])).not.toContain("skor provisional lebih tinggi");
  });

  it("caveats the higher-score note instead of declaring a winner", () => {
    const note = buildInsights([big, small]).find(
      (insight) => insight.kind === "provisional_score",
    );
    expect(note?.text).toContain("bukan penilaian bahwa situs tersebut lebih layak");
  });

  it("is deterministic — identical input yields identical output", () => {
    expect(buildInsights([big, small])).toEqual(buildInsights([big, small]));
  });
});

describe("no winner language anywhere in insights", () => {
  const forbidden = [
    /\bbest site\b/i,
    /\bwinner\b/i,
    /\bpemenang\b/i,
    /situs terbaik/i,
    /paling direkomendasikan/i,
    /most recommended/i,
    /layak dibangun/i,
  ];

  it("never names a best site or a winner", () => {
    for (const combination of [[big, small], [big, puskesmasNoBeneficiary], [big, small, puskesmasNoBeneficiary]]) {
      const output = texts(combination);
      for (const pattern of forbidden) {
        expect(output).not.toMatch(pattern);
      }
    }
  });
});
