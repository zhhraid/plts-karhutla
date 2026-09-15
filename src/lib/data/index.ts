/**
 * The single binding point between the application and its data source.
 *
 * Every page imports from here. To move onto Supabase/PostgreSQL, implement
 * `SiteDataSource` in a new adapter and change the one line below.
 */
import { staticFileSource } from "@/lib/data/staticFileSource";
import type { SiteDataSource } from "@/lib/data/source";
import { rankSites } from "@/lib/scoring/interpret";
import type { Site, SiteDataset } from "@/types";

const source: SiteDataSource = staticFileSource;

export function getDataset(): Promise<SiteDataset> {
  return source.getDataset();
}

export function getSites(): Promise<readonly Site[]> {
  return source.getSites();
}

export function getSiteById(recordId: string): Promise<Site | null> {
  return source.getSiteById(recordId);
}

export async function getRankedSites() {
  return rankSites(await getSites());
}

export { source as activeDataSource };
export type { SiteDataSource };
