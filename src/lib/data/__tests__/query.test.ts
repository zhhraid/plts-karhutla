import { describe, expect, it } from "vitest";

import {
  filterSites,
  getConfidenceSummary,
  getPrioritySummary,
  isProvisional,
  listDistricts,
  sortSites,
} from "@/lib/data/query";
import { makeSite } from "@/lib/data/__tests__/fixtures";
import type { Site } from "@/types";

const sites: readonly Site[] = [
  makeSite({
    recordId: "A", facilityName: "SMAN 1 Beta", district: "SUNGAI RAYA",
    priorityScore: 91.43, priorityBand: "HIGH",
    beneficiary: { ...makeSite().beneficiary, value: 994 },
  }),
  makeSite({
    recordId: "B", facilityName: "Puskesmas Alpha", facilityType: "Puskesmas",
    district: "BATU AMPAR", priorityScore: 81.67, priorityBand: "HIGH",
    availableWeightFraction: 0.45,
    dataConfidence: { level: "NEEDS_VERIFICATION", reason: "uji", internalPoints: 3 },
    beneficiary: { ...makeSite().beneficiary, value: null, status: "not_available" },
  }),
  makeSite({
    recordId: "C", facilityName: "SDN 22 Gamma", district: "batu ampar",
    priorityScore: 47.5, priorityBand: "LOW",
    beneficiary: { ...makeSite().beneficiary, value: 46 },
  }),
  makeSite({
    recordId: "D", facilityName: "SDN 9 Delta", district: "SUNGAI KAKAP",
    priorityScore: null, priorityBand: "NEEDS_VERIFICATION",
    scoreStatus: "INSUFFICIENT_DATA", availableWeightFraction: 0.2,
    recommendation: { type: "MONITOR_CONTEXT_ONLY", reason: "uji" },
    beneficiary: { ...makeSite().beneficiary, value: null, status: "not_available" },
  }),
];

describe("filters", () => {
  it("filters by facility type", () => {
    const result = filterSites(sites, { facilityType: ["Puskesmas"] });
    expect(result.map((s) => s.recordId)).toEqual(["B"]);
  });

  it("filters by district case-insensitively without altering source spelling", () => {
    const result = filterSites(sites, { district: ["Batu Ampar"] });
    expect(result.map((s) => s.recordId)).toEqual(["B", "C"]);
    // The stored spelling is untouched; only the comparison is normalised.
    expect(result.map((s) => s.district)).toEqual(["BATU AMPAR", "batu ampar"]);
  });

  it("filters by priority band, confidence and recommendation type", () => {
    expect(filterSites(sites, { priorityBand: ["HIGH"] }).map((s) => s.recordId))
      .toEqual(["A", "B"]);
    expect(filterSites(sites, { dataConfidence: ["NEEDS_VERIFICATION"] }).map((s) => s.recordId))
      .toEqual(["B"]);
    expect(filterSites(sites, { recommendationType: ["MONITOR_CONTEXT_ONLY"] }).map((s) => s.recordId))
      .toEqual(["D"]);
  });

  it("treats an absent or empty filter as no constraint, not as match-nothing", () => {
    expect(filterSites(sites, {})).toHaveLength(4);
    expect(filterSites(sites, { facilityType: [] })).toHaveLength(4);
  });

  it("combines filters conjunctively", () => {
    const result = filterSites(sites, {
      district: ["BATU AMPAR"],
      facilityType: ["Sekolah"],
    });
    expect(result.map((s) => s.recordId)).toEqual(["C"]);
  });

  it("searches across name, district and record id", () => {
    expect(filterSites(sites, { search: "gamma" }).map((s) => s.recordId)).toEqual(["C"]);
    expect(filterSites(sites, { search: "kakap" }).map((s) => s.recordId)).toEqual(["D"]);
    expect(filterSites(sites, { search: "  " })).toHaveLength(4);
  });

  it("is deterministic and does not mutate the input", () => {
    const before = sites.map((s) => s.recordId);
    filterSites(sites, { search: "s" });
    expect(sites.map((s) => s.recordId)).toEqual(before);
    expect(filterSites(sites, { priorityBand: ["HIGH"] }))
      .toEqual(filterSites(sites, { priorityBand: ["HIGH"] }));
  });
});

describe("sorting", () => {
  it("sorts by priority descending with unscored sites last", () => {
    expect(sortSites(sites, "priority_desc").map((s) => s.recordId))
      .toEqual(["A", "B", "C", "D"]);
  });

  it("sorts by confidence strongest first", () => {
    const order = sortSites(sites, "confidence_desc").map((s) => s.recordId);
    expect(order[order.length - 1]).toBe("B");
  });

  it("sorts by beneficiary descending, with unknown counts last rather than lowest", () => {
    const order = sortSites(sites, "beneficiary_desc").map((s) => s.recordId);
    // A (994) then C (46); B and D have no count and must not be read as 0.
    expect(order.slice(0, 2)).toEqual(["A", "C"]);
    expect(order.slice(2).sort()).toEqual(["B", "D"]);
  });

  it("sorts by facility name ascending", () => {
    expect(sortSites(sites, "facility_name_asc").map((s) => s.facilityName))
      .toEqual(["Puskesmas Alpha", "SDN 22 Gamma", "SDN 9 Delta", "SMAN 1 Beta"]);
  });

  it("is a total order — equal keys fall back to record id", () => {
    const tied = [
      makeSite({ recordId: "Z", priorityScore: 50 }),
      makeSite({ recordId: "Y", priorityScore: 50 }),
    ];
    expect(sortSites(tied, "priority_desc").map((s) => s.recordId)).toEqual(["Y", "Z"]);
    expect(sortSites([...tied].reverse(), "priority_desc").map((s) => s.recordId))
      .toEqual(["Y", "Z"]);
  });

  it("returns a copy and leaves the input order untouched", () => {
    const input = [...sites];
    sortSites(input, "facility_name_asc");
    expect(input.map((s) => s.recordId)).toEqual(["A", "B", "C", "D"]);
  });
});

describe("provisional marking", () => {
  it("marks every score that is not final for its own stated reason", () => {
    expect(isProvisional(sites[0] as Site)).toBe(true);
    expect(isProvisional(makeSite({ scoreStatus: "FINAL_ENOUGH_FOR_MVP" }))).toBe(false);
  });
});

describe("priority summary", () => {
  const summary = getPrioritySummary(sites);

  it("counts unscored sites apart from every band", () => {
    expect(summary.total).toBe(4);
    expect(summary.scored).toBe(3);
    expect(summary.unscored).toBe(1);
    expect(summary.byBand.LOW).toBe(1);
    expect(summary.byBand.NEEDS_VERIFICATION).toBe(1);
  });

  it("reports extremes but publishes no mean across different bases", () => {
    expect(summary.highestScore).toBe(91.43);
    expect(summary.lowestScore).toBe(47.5);
    expect(summary).not.toHaveProperty("meanScore");
  });

  it("flags that mixed coverage fractions are not fully comparable", () => {
    expect(summary.fullyComparable).toBe(false);
    expect(summary.coverageFractions).toEqual([0.7, 0.45, 0.2]);
  });

  it("reports full comparability when every site shares one basis", () => {
    const uniform = getPrioritySummary([makeSite({ recordId: "P" }), makeSite({ recordId: "Q" })]);
    expect(uniform.fullyComparable).toBe(true);
  });

  it("handles an empty set without inventing zeroes", () => {
    const empty = getPrioritySummary([]);
    expect(empty.highestScore).toBeNull();
    expect(empty.lowestScore).toBeNull();
    expect(empty.total).toBe(0);
  });
});

describe("confidence summary", () => {
  it("counts levels and spatially capped sites", () => {
    const summary = getConfidenceSummary(sites);
    expect(summary.total).toBe(4);
    expect(summary.byLevel.MEDIUM).toBe(3);
    expect(summary.byLevel.NEEDS_VERIFICATION).toBe(1);
    expect(summary.byLevel.HIGH).toBe(0);
    expect(summary.spatiallyCapped).toBe(4);
  });
});

describe("districts", () => {
  it("lists distinct districts in stable order", () => {
    expect(listDistricts(sites)).toEqual([
      "batu ampar", "BATU AMPAR", "SUNGAI KAKAP", "SUNGAI RAYA",
    ]);
  });
});
