import { describe, expect, it } from "vitest";

import { COMPARE_ROWS } from "@/lib/compare/matrix";
import { ABSENCE_LABEL } from "@/lib/compare/rows";
import { makeSite } from "@/lib/data/__tests__/fixtures";

const complete = makeSite({ recordId: "A" });
const sparse = makeSite({
  recordId: "B",
  priorityScore: null,
  priorityBand: "NEEDS_VERIFICATION",
  scoreStatus: "INSUFFICIENT_DATA",
  beneficiary: { ...makeSite().beneficiary, value: null, status: "not_available" },
  solar: { ghiValue: null, ghiUnit: null, status: "requires_point_extraction", scope: "unknown" },
  karhutla: { ...makeSite().karhutla, rawClass: null },
  drought: { ...makeSite().drought, rawClass: null },
  karhutlaProxy: { value: null, lowAreaHa: null, mediumAreaHa: null, highAreaHa: null, totalAreaHa: null },
  existingPltsContext: null,
});

describe("compare matrix covers the required dimensions", () => {
  const keys = COMPARE_ROWS.map((row) => row.key);

  it.each([
    "facility_type",
    "district",
    "priority_score",
    "priority_band",
    "score_status",
    "data_confidence",
    "dim_solar",
    "dim_social",
    "dim_criticality",
    "dim_resilience",
    "beneficiary",
    "ghi",
    "karhutla",
    "drought",
    "dimension_count",
    "weight_fraction",
    "missing",
    "recommendation",
    "existing_plts",
  ])("includes %s", (key) => {
    expect(keys).toContain(key);
  });

  it("uses a unique key per row", () => {
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("NULL rendering in compare", () => {
  const absentCells = COMPARE_ROWS.map((row) => row.cell(sparse)).filter(
    (cell) => cell.absence !== null,
  );

  it("produces absent cells for a sparse site", () => {
    expect(absentCells.length).toBeGreaterThan(4);
  });

  it("never renders an absent value as 0, Low, or a worst value", () => {
    for (const cell of absentCells) {
      expect(cell.text).not.toBe("0");
      expect(cell.text).not.toBe("0,00");
      expect(cell.text).not.toMatch(/^(low|rendah|terendah|worst)$/i);
    }
  });

  it("uses only the agreed absence vocabulary", () => {
    const allowed = Object.values(ABSENCE_LABEL);
    for (const cell of absentCells) {
      expect(allowed).toContain(cell.text);
    }
  });

  it("distinguishes pending verification from never obtained", () => {
    const ghi = COMPARE_ROWS.find((row) => row.key === "ghi");
    const beneficiary = COMPARE_ROWS.find((row) => row.key === "beneficiary");
    // GHI's source exists but the point value is not extracted.
    expect(ghi?.cell(sparse).absence).toBe("pending_verification");
    // The beneficiary count was never obtained.
    expect(beneficiary?.cell(sparse).absence).toBe("not_available");
  });

  it("marks a missing dimension score without implying a low score", () => {
    const solar = COMPARE_ROWS.find((row) => row.key === "dim_solar");
    const cell = solar?.cell(complete);
    expect(cell?.absence).toBe("pending_verification");
    expect(cell?.note).toContain("dikeluarkan dari perhitungan");
  });

  it("states coverage as completeness of evidence, not site quality", () => {
    const weight = COMPARE_ROWS.find((row) => row.key === "weight_fraction");
    expect(weight?.cell(complete).note).toContain("bukan kualitas situs");
  });

  it("frames existing PLTS as historical evidence with unverified linkage", () => {
    const row = COMPARE_ROWS.find((row) => row.key === "existing_plts");
    expect(row?.label).toContain("Historical Existing PLTS Evidence");
    const withContext = makeSite({
      existingPltsContext: "Kecamatan memiliki PLTS historis 2021.",
    });
    expect(row?.cell(withContext).note).toContain("belum ditetapkan");
  });
});
