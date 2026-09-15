/**
 * File-backed implementation of `SiteDataSource` (MVP default).
 *
 * Reads the build artefact from disk at request time on the server. The whole
 * dataset is ten records, so it is read once and memoised; there is no database
 * and no external API call anywhere in the request path.
 *
 * Swapping to Supabase/PostgreSQL later means adding a sibling adapter that
 * implements the same interface — not touching any component.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { SiteDataSource } from "@/lib/data/source";
import { normaliseDataset, type RawDataset } from "@/lib/data/normalise";
import type { Site, SiteDataset } from "@/types";

const DATASET_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "site_master_dataset.json",
);

let cached: Promise<SiteDataset> | null = null;

async function load(): Promise<SiteDataset> {
  const contents = await readFile(DATASET_PATH, "utf-8");
  return normaliseDataset(JSON.parse(contents) as RawDataset);
}

export const staticFileSource: SiteDataSource = {
  name: "static-file",

  getDataset(): Promise<SiteDataset> {
    cached ??= load();
    return cached;
  },

  async getSites(): Promise<readonly Site[]> {
    return (await this.getDataset()).sites;
  },

  async getSiteById(recordId: string): Promise<Site | null> {
    const sites = await this.getSites();
    return sites.find((site) => site.recordId === recordId) ?? null;
  },
};
