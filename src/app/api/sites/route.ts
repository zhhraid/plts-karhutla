import { NextResponse } from "next/server";

import { getConfidenceSummary, getPrioritySummary, querySites } from "@/lib/data";
import type { SiteFilters, SortKey } from "@/lib/data";
import type {
  DataConfidenceLevel,
  FacilityType,
  PriorityBand,
  RecommendationType,
} from "@/types";

/**
 * GET /api/sites
 *
 * Read-only projection of the same data layer the pages use — not a second
 * path to the data, and not a place where any score is recomputed.
 *
 * Query parameters (all repeatable, all optional):
 *   facilityType, district, priorityBand, dataConfidence, recommendationType,
 *   search, sort
 *
 * An unrecognised filter value is rejected with 400 rather than silently
 * ignored: quietly dropping a filter returns a larger set than the caller
 * asked for, which they would have no way to detect.
 *
 * Rendered per request, not prerendered: a statically generated route is built
 * once with no query string, so every filter here would be read as absent and
 * the endpoint would answer every request with the unfiltered set.
 */
export const dynamic = "force-dynamic";

const FACILITY_TYPES: readonly FacilityType[] = ["Sekolah", "Puskesmas"];
const PRIORITY_BANDS: readonly PriorityBand[] = [
  "HIGH",
  "MEDIUM",
  "LOW",
  "NEEDS_VERIFICATION",
];
const CONFIDENCE_LEVELS: readonly DataConfidenceLevel[] = [
  "HIGH",
  "MEDIUM",
  "NEEDS_VERIFICATION",
];
const RECOMMENDATION_TYPES: readonly RecommendationType[] = [
  "NEW_DEPLOYMENT_ASSESSMENT",
  "EXPANSION_ASSESSMENT",
  "NEEDS_DATA_VERIFICATION",
  "MONITOR_CONTEXT_ONLY",
];
const SORT_KEYS: readonly SortKey[] = [
  "priority_desc",
  "confidence_desc",
  "beneficiary_desc",
  "facility_name_asc",
];

function readEnumList<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
  errors: string[],
): readonly T[] | undefined {
  const values = params.getAll(key);
  if (values.length === 0) return undefined;
  const parsed: T[] = [];
  for (const value of values) {
    const match = allowed.find((candidate) => candidate === value);
    if (match === undefined) {
      errors.push(`${key}="${value}" tidak dikenal. Nilai sah: ${allowed.join(", ")}`);
    } else {
      parsed.push(match);
    }
  }
  return parsed;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const errors: string[] = [];

  const filters: SiteFilters = {
    facilityType: readEnumList(params, "facilityType", FACILITY_TYPES, errors),
    priorityBand: readEnumList(params, "priorityBand", PRIORITY_BANDS, errors),
    dataConfidence: readEnumList(params, "dataConfidence", CONFIDENCE_LEVELS, errors),
    recommendationType: readEnumList(
      params,
      "recommendationType",
      RECOMMENDATION_TYPES,
      errors,
    ),
    district: params.getAll("district").length > 0 ? params.getAll("district") : undefined,
    search: params.get("search") ?? undefined,
  };

  const sortParam = params.get("sort");
  const sort = SORT_KEYS.find((key) => key === sortParam) ?? "priority_desc";
  if (sortParam !== null && sort !== sortParam) {
    errors.push(`sort="${sortParam}" tidak dikenal. Nilai sah: ${SORT_KEYS.join(", ")}`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: "Permintaan tidak sah", details: errors }, { status: 400 });
  }

  const [sites, priority, confidence] = await Promise.all([
    querySites(filters, sort),
    getPrioritySummary(filters),
    getConfidenceSummary(filters),
  ]);

  return NextResponse.json({
    // Summaries travel with the results so a consumer cannot recompute them
    // over a filtered subset and report a different picture from the UI.
    summary: { priority, confidence },
    count: sites.length,
    sites,
  });
}
