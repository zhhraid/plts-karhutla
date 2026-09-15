import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { MissingValue } from "@/components/ui/MissingValue";
import {
  ConfidenceBadge,
  FacilityTypeBadge,
  PriorityBadge,
} from "@/components/ui/StatusBadges";
import { formatScore } from "@/lib/formatting";
import type { Site } from "@/types";

interface RankedRow {
  readonly site: Site;
  readonly rank: number | null;
  readonly tied: boolean;
}

/**
 * The candidate ranking.
 *
 * Dense ranking, so exactly tied scores share a rank and are labelled as tied.
 * Ordering equal scores by list position would invent a precedence the data
 * does not support.
 */
export function RankingList({ ranked }: { readonly ranked: readonly RankedRow[] }) {
  return (
    <ol className="divide-y divide-border">
      {ranked.map(({ site, rank, tied }) => (
        <li key={site.recordId}>
          <Link
            href={`/sites/${site.recordId}`}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md px-1 py-3 hover:bg-surface-muted"
          >
            <span className="w-8 shrink-0 text-sm tabular-nums text-muted-fg">
              {rank === null ? "—" : `#${rank}`}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{site.facilityName}</span>
              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                <FacilityTypeBadge type={site.facilityType} />
                <span className="text-xs text-muted-fg">Kec. {site.district}</span>
                {tied ? (
                  <span className="text-xs text-muted-fg">· skor seri</span>
                ) : null}
              </span>
            </span>

            <span className="flex flex-wrap items-center justify-end gap-2 sm:w-auto">
              <ConfidenceBadge level={site.dataConfidence.level} />
              <PriorityBadge band={site.priorityBand} />
              <span className="w-16 text-right text-base font-semibold tabular-nums">
                {site.priorityScore === null ? (
                  <span className="text-xs font-normal">
                    <MissingValue />
                  </span>
                ) : (
                  formatScore(site.priorityScore)
                )}
              </span>
              <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-fg" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
