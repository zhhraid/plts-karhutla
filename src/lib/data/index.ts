/**
 * The single binding point between the application and its data source.
 *
 * Every page and API route imports from here. To move onto Supabase or
 * PostgreSQL, implement `SiteDataSource` in a new adapter and change the one
 * line below; the filter and sort predicates in `query.ts` are pure and can be
 * pushed down into SQL by that adapter without altering any caller.
 */
import { staticFileSource } from "@/lib/data/staticFileSource";
import type { SiteDataSource } from "@/lib/data/source";
import {
  filterSites,
  getConfidenceSummary as summariseConfidence,
  getPrioritySummary as summarisePriority,
  listDistricts,
  sortSites,
  type ConfidenceSummary,
  type PrioritySummary,
  type SiteFilters,
  type SortKey,
} from "@/lib/data/query";
import { rankSites } from "@/lib/scoring/interpret";
import type { FacilityType, Site, SiteDataset } from "@/types";

const source: SiteDataSource = staticFileSource;

export function getDataset(): Promise<SiteDataset> {
  return source.getDataset();
}

export function getAllSites(): Promise<readonly Site[]> {
  return source.getSites();
}

/** Alias kept for the Prompt 5 pages; `getAllSites` is the canonical name. */
export const getSites = getAllSites;

export function getSiteById(recordId: string): Promise<Site | null> {
  return source.getSiteById(recordId);
}

export async function getSitesByDistrict(
  district: string,
): Promise<readonly Site[]> {
  return filterSites(await getAllSites(), { district: [district] });
}

export async function getSitesByFacilityType(
  facilityType: FacilityType,
): Promise<readonly Site[]> {
  return filterSites(await getAllSites(), { facilityType: [facilityType] });
}

/**
 * The general query entry point. Filters first, then sorts, so the ordering
 * always describes the set actually returned.
 */
export async function querySites(
  filters: SiteFilters = {},
  sort: SortKey = "priority_desc",
): Promise<readonly Site[]> {
  return sortSites(filterSites(await getAllSites(), filters), sort);
}

export async function getPrioritySummary(
  filters: SiteFilters = {},
): Promise<PrioritySummary> {
  return summarisePriority(filterSites(await getAllSites(), filters));
}

export async function getConfidenceSummary(
  filters: SiteFilters = {},
): Promise<ConfidenceSummary> {
  return summariseConfidence(filterSites(await getAllSites(), filters));
}

export async function getDistricts(): Promise<readonly string[]> {
  return listDistricts(await getAllSites());
}

export async function getRankedSites() {
  return rankSites(await getAllSites());
}

export { source as activeDataSource };
export type {
  ConfidenceSummary,
  PrioritySummary,
  SiteDataSource,
  SiteFilters,
  SortKey,
};
