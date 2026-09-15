/**
 * The source catalogue must describe the data that is actually shipped.
 *
 * A curated catalogue can drift from the dataset without anything failing to
 * compile — an entry can keep claiming a source that has been renamed or
 * dropped. These tests tie the two together.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { BASEMAP_ATTRIBUTION, SOURCE_CATALOG } from "@/lib/data/sourceCatalog";
import type { RawDataset } from "@/lib/data/normalise";

const dataset = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "public", "data", "site_master_dataset.json"),
    "utf-8",
  ),
) as RawDataset;

const datasetSourceNames = new Set(
  dataset.sites.flatMap((site) => site.sources.map((source) => source.source_name)),
);

describe("catalogue matches the shipped dataset", () => {
  it("has a unique id per entry", () => {
    const ids = SOURCE_CATALOG.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required source family", () => {
    const ids = SOURCE_CATALOG.map((entry) => entry.id);
    for (const required of [
      "kemendikdasmen",
      "dinkes-kubu-raya",
      "global-solar-atlas",
      "karhutla-structural",
      "bpk-plts-2021",
      "inarisk-bnpb",
    ]) {
      expect(ids).toContain(required);
    }
  });

  it("claims no source name the dataset does not actually cite", () => {
    for (const entry of SOURCE_CATALOG) {
      if (entry.status !== "in_canonical_data") continue;
      for (const name of entry.datasetSourceNames) {
        // The existing-PLTS source sits in the asset layer, not in per-site
        // provenance rows, so it is exempt from this particular check.
        if (entry.id === "bpk-plts-2021") continue;
        expect(datasetSourceNames.has(name), `${entry.id} cites "${name}"`).toBe(true);
      }
    }
  });

  it("leaves every dataset source name accounted for by some entry", () => {
    const claimed = new Set(SOURCE_CATALOG.flatMap((entry) => entry.datasetSourceNames));
    for (const name of datasetSourceNames) {
      expect(claimed.has(name), `no catalogue entry claims "${name}"`).toBe(true);
    }
  });

  it("marks a planned source as not yet in canonical data", () => {
    const planned = SOURCE_CATALOG.find((entry) => entry.id === "inarisk-bnpb");
    expect(planned?.status).toBe("planned_not_yet_available");
    expect(planned?.datasetSourceNames).toEqual([]);
  });

  it("does not list BPS, which the canonical product data does not use", () => {
    const names = SOURCE_CATALOG.map((entry) => entry.name).join(" ");
    expect(names).not.toMatch(/\bBPS\b/);
  });
});

describe("licence and attribution", () => {
  it("carries the full Global Solar Atlas attribution and licence", () => {
    const gsa = SOURCE_CATALOG.find((entry) => entry.id === "global-solar-atlas");
    expect(gsa?.licence).toBe("CC BY 4.0");
    for (const required of ["Global Solar Atlas 2.0", "World Bank Group", "ESMAP", "Solargis"]) {
      expect(gsa?.attribution).toContain(required);
    }
  });

  it("states that only derived point values are stored, never the raster", () => {
    const gsa = SOURCE_CATALOG.find((entry) => entry.id === "global-solar-atlas");
    expect(gsa?.limitations.join(" ")).toContain("raster tidak disimpan");
  });

  it("keeps the basemap separate from analytical sources", () => {
    expect(BASEMAP_ATTRIBUTION.attribution).toContain("OpenStreetMap contributors");
    expect(BASEMAP_ATTRIBUTION.role).toContain("konteks visual");
    // It must not appear in the analytical catalogue at all.
    expect(SOURCE_CATALOG.map((entry) => entry.id)).not.toContain("openstreetmap");
  });

  it("provides an openable URL wherever one exists", () => {
    for (const entry of SOURCE_CATALOG) {
      if (entry.url === null) continue;
      expect(entry.url).toMatch(/^https:\/\//);
    }
  });
});

describe("existing PLTS is framed as historical evidence", () => {
  const plts = SOURCE_CATALOG.find((entry) => entry.id === "bpk-plts-2021");

  it("never claims an active installation", () => {
    expect(plts?.usedFor).toContain("historis");
    expect(plts?.usedFor).not.toMatch(/PLTS aktif|active PLTS/i);
  });

  it("states that capacity and commissioning year are withheld as unresolved", () => {
    const limitations = plts?.limitations.join(" ") ?? "";
    expect(limitations).toContain("capacity_kwp");
    expect(limitations).toContain("tahun komisioning");
    expect(limitations).toContain("tidak sama dengan tahun komisioning");
  });
});

describe("dataset never publishes unresolved asset fields", () => {
  it("carries no capacity or commissioning field at all", () => {
    const serialised = JSON.stringify(dataset);
    expect(serialised).not.toContain("capacity_kwp");
    expect(serialised).not.toContain("commissioning_year");
  });
});

describe("usage counting basis", () => {
  it("counts the asset-layer source from PLTS context, not provenance rows", () => {
    const plts = SOURCE_CATALOG.find((entry) => entry.id === "bpk-plts-2021");
    expect(plts?.usageCountedFrom).toBe("existing_plts_context");
    // Counting it against per-site provenance would report zero for a source
    // the product genuinely uses.
    expect(datasetSourceNames.has("BPK Perwakilan Provinsi Kalimantan Barat")).toBe(false);
    expect(dataset.sites.some((site) => site.existing_plts_context.length > 0)).toBe(true);
  });

  it("counts every other source from per-site provenance rows", () => {
    for (const entry of SOURCE_CATALOG) {
      if (entry.id === "bpk-plts-2021") continue;
      expect(entry.usageCountedFrom).toBe("site_sources");
    }
  });
});
