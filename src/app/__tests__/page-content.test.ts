/**
 * Content requirements for the methodology and data-sources pages.
 *
 * These pages carry the product's honesty claims. A refactor can quietly drop
 * a caveat without breaking a type or a render, so the required statements are
 * asserted directly against the page source.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function page(relative: string): string {
  return readFileSync(path.join(process.cwd(), relative), "utf-8").replace(/\s+/g, " ");
}

const methodology = page("src/app/methodology/page.tsx");
const dataSources = page("src/app/data-sources/page.tsx");
const glossary = page("src/lib/glossary.ts");

describe("methodology page covers all ten steps", () => {
  it.each([
    ["input data", /Input data/i],
    ["four decision dimensions", /Empat dimensi keputusan/i],
    ["normalisation", /Normalisasi/i],
    ["weighted sum model", /Weighted Sum Model/i],
    ["missing-value handling", /NULL bukan 0/i],
    ["priority score", /Priority Score dan statusnya/i],
    ["data confidence", /Data Confidence — terpisah/i],
    ["recommendation logic", /Logika rekomendasi/i],
    ["karhutla proxy", /proksi struktural tingkat kecamatan/i],
    ["sensitivity and limitations", /sensitivitas/i],
  ])("explains %s", (_label, pattern) => {
    expect(methodology).toMatch(pattern);
  });

  it("names the method as Weighted MCDA / WSM and denies AHP", () => {
    expect(methodology).toMatch(/Weighted Multi-Criteria Decision\s*Analysis/i);
    expect(methodology).toMatch(/tidak mengklaim AHP/i);
  });

  it("states the weights are an MVP design assumption, not validated AHP", () => {
    expect(methodology).toMatch(/MVP design assumption/);
    expect(methodology).toMatch(/belum\s*merupakan hasil expert-validated AHP/i);
  });

  it("spells out the full NULL-handling consequence chain", () => {
    for (const clause of [
      /tidak diberi nilai nol/,
      /tidak masuk pembilang/,
      /tidak masuk penyebut/,
      /dinormalisasi ulang/,
      /coverage/,
      /Data Confidence/,
      /provisional/,
    ]) {
      expect(methodology).toMatch(clause);
    }
    expect(methodology).toMatch(/tidak selalu adil untuk dibandingkan langsung/i);
  });

  it("gives the karhutla structural proxy formula and its label", () => {
    expect(methodology).toContain("karhutla_structural_proxy");
    expect(methodology).toContain("low_area_ha");
    expect(methodology).toContain("medium_area_ha");
    expect(methodology).toContain("high_area_ha");
    expect(methodology).toContain("total_area_ha");
    expect(methodology).toMatch(/district-level structural hazard proxy/i);
  });

  it("denies every thing the karhutla proxy is not", () => {
    for (const denial of [
      /probabilitas kebakaran/i,
      /risiko site-specific/i,
      /prediksi kebakaran/i,
      /hotspot/i,
    ]) {
      expect(methodology).toMatch(denial);
    }
  });

  it("states that drought does not differentiate sites", () => {
    expect(methodology).toMatch(/tidak membedakan antarsitus/i);
    expect(methodology).toMatch(/dikeluarkan dari skor/i);
  });

  it("explains the solar limitation without ever showing solar as zero", () => {
    expect(methodology).toMatch(/Global Solar Atlas/);
    expect(methodology).toMatch(/ekstraksi nilai per titik belum tersedia/i);
    expect(methodology).toMatch(/Solar tidak pernah ditampilkan sebagai 0/i);
  });

  it("keeps confidence separate from priority and refuses to move the threshold", () => {
    expect(methodology).toMatch(/tidak pernah menaikkan maupun menurunkan/i);
    expect(methodology).toMatch(/tidak diturunkan/i);
    for (const level of ["HIGH", "MEDIUM", "NEEDS_VERIFICATION"]) {
      expect(methodology).toContain(level);
    }
  });

  it("names all six confidence dimensions", () => {
    for (const dimension of [
      "Source Authority",
      "Data Recency",
      "Data Completeness",
      "Verification Status",
      "Spatial Specificity",
      "Conflict / Variance",
    ]) {
      expect(methodology).toContain(dimension);
    }
  });

  it("states what the product is not", () => {
    expect(methodology).toMatch(/bukan studi kelayakan/i);
    expect(methodology).toMatch(/bukan keputusan pembangunan/i);
    expect(methodology).toMatch(/bukan mesin\s*rekomendasi berbasis AI/i);
  });
});

describe("data sources page", () => {
  it("renders every catalogue field the brief requires", () => {
    for (const field of [
      "Digunakan untuk",
      "Cakupan spasial",
      "Tahun / periode rujukan",
      "Status verifikasi",
      "Lisensi",
      "Keterbatasan",
      "Atribusi wajib",
    ]) {
      expect(dataSources).toContain(field);
    }
  });

  it("opens external source links safely in a new tab", () => {
    expect(dataSources).toContain('target="_blank"');
    expect(dataSources).toContain('rel="noopener noreferrer"');
    expect(dataSources).toMatch(/membuka tab baru/);
  });

  it("separates basemap tiles from analytical data sources", () => {
    expect(dataSources).toMatch(/konteks visual, bukan sumber data analitik/i);
  });

  it("states that analytical data does not depend on a live API", () => {
    expect(dataSources).toMatch(/tidak ada API\s*langsung/i);
  });
});

describe("glossary defines every term the brief lists", () => {
  it.each([
    "priorityScore",
    "provisionalPriority",
    "dataConfidence",
    "solarSuitability",
    "socialImpact",
    "facilityCriticality",
    "resilienceNeed",
    "availableWeight",
    "needsVerification",
  ])("defines %s", (key) => {
    expect(glossary).toContain(`${key}: {`);
  });

  it("describes available weight as evidence completeness, not site quality", () => {
    expect(glossary).toMatch(/ukuran kelengkapan bukti, bukan ukuran kualitas situs/i);
  });
});
