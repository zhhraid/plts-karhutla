/**
 * Filtering, sorting and summarising over an in-memory site collection.
 *
 * Pure functions: they take the sites they operate on, so they are testable
 * without any I/O and reusable behind a future database adapter that pushes
 * the same predicates down into SQL.
 *
 * Every operation here is deterministic. Ordering is total — every comparator
 * falls back to `recordId` so that equal keys never produce a result that
 * depends on input order.
 */
import { byPriorityDescending } from "@/lib/scoring/interpret";
import type {
  DataConfidenceLevel,
  FacilityType,
  PriorityBand,
  RecommendationType,
  Site,
} from "@/types";

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface SiteFilters {
  readonly facilityType?: readonly FacilityType[];
  readonly district?: readonly string[];
  readonly priorityBand?: readonly PriorityBand[];
  readonly dataConfidence?: readonly DataConfidenceLevel[];
  readonly recommendationType?: readonly RecommendationType[];
  /** Case- and diacritic-insensitive substring over name, district and id. */
  readonly search?: string;
}

/** Districts are compared case-insensitively; source spelling is never altered. */
function normaliseKey(value: string): string {
  return value.trim().toLocaleLowerCase("id-ID");
}

function matchesAny<T>(
  allowed: readonly T[] | undefined,
  value: T,
): boolean {
  // An absent or empty filter means "no constraint", not "match nothing".
  if (allowed === undefined || allowed.length === 0) return true;
  return allowed.includes(value);
}

export function filterSites(
  sites: readonly Site[],
  filters: SiteFilters = {},
): readonly Site[] {
  const districts = filters.district?.map(normaliseKey);
  const search =
    filters.search === undefined || filters.search.trim().length === 0
      ? null
      : normaliseKey(filters.search);

  return sites.filter((site) => {
    if (!matchesAny(filters.facilityType, site.facilityType)) return false;
    if (!matchesAny(filters.priorityBand, site.priorityBand)) return false;
    if (!matchesAny(filters.dataConfidence, site.dataConfidence.level)) return false;
    if (!matchesAny(filters.recommendationType, site.recommendation.type)) {
      return false;
    }
    if (
      districts !== undefined &&
      districts.length > 0 &&
      !districts.includes(normaliseKey(site.district))
    ) {
      return false;
    }
    if (search !== null) {
      const haystack = normaliseKey(
        `${site.facilityName} ${site.district} ${site.recordId}`,
      );
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export type SortKey =
  | "priority_desc"
  | "confidence_desc"
  | "beneficiary_desc"
  | "facility_name_asc";

/** Ordinal for confidence, strongest first. Not a score — an ordering only. */
const CONFIDENCE_RANK: Readonly<Record<DataConfidenceLevel, number>> = {
  HIGH: 0,
  MEDIUM: 1,
  NEEDS_VERIFICATION: 2,
};

/**
 * Sorts a copy, never the input.
 *
 * Unknown values always sort last, whichever key is active. A site with no
 * beneficiary count is not the site with the fewest beneficiaries, and must
 * not drift to the bottom of a descending list as though it were.
 */
export function sortSites(
  sites: readonly Site[],
  key: SortKey = "priority_desc",
): readonly Site[] {
  const copy = [...sites];
  switch (key) {
    case "priority_desc":
      return copy.sort(byPriorityDescending);

    case "confidence_desc":
      return copy.sort((a, b) => {
        const delta =
          CONFIDENCE_RANK[a.dataConfidence.level] -
          CONFIDENCE_RANK[b.dataConfidence.level];
        return delta !== 0 ? delta : a.recordId.localeCompare(b.recordId);
      });

    case "beneficiary_desc":
      return copy.sort((a, b) => {
        const left = a.beneficiary.value;
        const right = b.beneficiary.value;
        if (left === null && right === null) {
          return a.recordId.localeCompare(b.recordId);
        }
        if (left === null) return 1;
        if (right === null) return -1;
        return right - left || a.recordId.localeCompare(b.recordId);
      });

    case "facility_name_asc":
      return copy.sort(
        (a, b) =>
          a.facilityName.localeCompare(b.facilityName, "id-ID") ||
          a.recordId.localeCompare(b.recordId),
      );
  }
}

/**
 * A score that is not final for its own stated reason.
 *
 * Provisional scores must never be presented as a finished scientific result,
 * so every list that shows a score must be able to mark it.
 */
export function isProvisional(site: Site): boolean {
  return site.scoreStatus !== "FINAL_ENOUGH_FOR_MVP";
}

// ---------------------------------------------------------------------------
// Summaries
// ---------------------------------------------------------------------------

export interface PrioritySummary {
  readonly total: number;
  readonly scored: number;
  /** Sites with no publishable score. Counted apart from every band. */
  readonly unscored: number;
  readonly byBand: Readonly<Record<PriorityBand, number>>;
  readonly provisional: number;
  readonly highestScore: number | null;
  readonly lowestScore: number | null;
  /** Distinct coverage fractions present. More than one means the scores in
   *  this set rest on different evidence bases and are not fully comparable. */
  readonly coverageFractions: readonly number[];
  readonly fullyComparable: boolean;
}

export function getPrioritySummary(sites: readonly Site[]): PrioritySummary {
  const byBand: Record<PriorityBand, number> = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    NEEDS_VERIFICATION: 0,
  };
  const scores: number[] = [];
  const coverages = new Set<number>();
  let provisional = 0;

  for (const site of sites) {
    byBand[site.priorityBand] += 1;
    if (site.priorityScore !== null) scores.push(site.priorityScore);
    if (isProvisional(site)) provisional += 1;
    coverages.add(site.availableWeightFraction);
  }

  return {
    total: sites.length,
    scored: scores.length,
    unscored: sites.length - scores.length,
    byBand,
    provisional,
    // No mean is reported. Averaging scores computed over different
    // renormalisation bases would produce a number with no defined meaning.
    highestScore: scores.length === 0 ? null : Math.max(...scores),
    lowestScore: scores.length === 0 ? null : Math.min(...scores),
    coverageFractions: [...coverages].sort((a, b) => b - a),
    fullyComparable: coverages.size <= 1,
  };
}

export interface ConfidenceSummary {
  readonly total: number;
  readonly byLevel: Readonly<Record<DataConfidenceLevel, number>>;
  /** Sites whose hazard evidence is a district proxy, capping them below HIGH. */
  readonly spatiallyCapped: number;
}

export function getConfidenceSummary(sites: readonly Site[]): ConfidenceSummary {
  const byLevel: Record<DataConfidenceLevel, number> = {
    HIGH: 0,
    MEDIUM: 0,
    NEEDS_VERIFICATION: 0,
  };
  let spatiallyCapped = 0;

  for (const site of sites) {
    byLevel[site.dataConfidence.level] += 1;
    if (site.karhutla.scope === "kecamatan_proxy") spatiallyCapped += 1;
  }

  return { total: sites.length, byLevel, spatiallyCapped };
}

/** Distinct districts present, ordered for stable rendering. */
export function listDistricts(sites: readonly Site[]): readonly string[] {
  return [...new Set(sites.map((site) => site.district))].sort((a, b) =>
    a.localeCompare(b, "id-ID"),
  );
}
