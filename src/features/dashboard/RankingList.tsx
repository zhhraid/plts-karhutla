import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { InfoTip } from "@/components/ui/InfoTip";
import { MissingValue } from "@/components/ui/MissingValue";
import {
  ConfidenceBadge,
  FacilityTypeBadge,
  PriorityBadge,
} from "@/components/ui/StatusBadges";
import { formatPercent, formatScore } from "@/lib/formatting";
import { BASELINE_LABELS } from "@/lib/scoring/dimensions";
import type { CoverageCohort, RankedSite } from "@/lib/scoring/interpret";
import type { DecisionDimension } from "@/types";

function profileLabel(profile: string): string {
  return profile
    .split("+")
    .map((key) => BASELINE_LABELS[key as DecisionDimension] ?? key)
    .join(" · ");
}

function Row({ entry }: { readonly entry: RankedSite }) {
  const { site, rank, tied } = entry;
  return (
    <li>
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
            {tied ? <span className="text-xs text-muted-fg">· skor seri</span> : null}
          </span>
        </span>

        <span className="flex flex-wrap items-center justify-end gap-2">
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
  );
}

/**
 * The candidate ranking, grouped by coverage cohort.
 *
 * Ranks are issued inside a cohort, never across the whole set: scores
 * renormalised over different sets of dimensions rest on different evidence,
 * and one flat ordinal would assert a precedence the data cannot support. The
 * cohort heading states which dimensions each rank is valid over.
 */
export function RankingList({
  cohorts,
}: {
  readonly cohorts: readonly CoverageCohort[];
}) {
  const multiple = cohorts.length > 1;

  return (
    <div className="space-y-6">
      {multiple ? (
        <p className="rounded-md border border-warning bg-warning-subtle px-3 py-2 text-xs leading-snug text-warning">
          Situs dikelompokkan menurut kelengkapan dimensinya. Peringkat hanya
          berlaku di dalam kelompok — nilai antar-kelompok tidak sepenuhnya
          sebanding karena kelengkapan dimensinya berbeda.
        </p>
      ) : null}

      {cohorts.map((cohort) => (
        <section key={cohort.profile}>
          <h3 className="mb-1 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
            <span>
              {cohort.availableDimensionCount} dari 4 dimensi tersedia
            </span>
            <span className="text-xs font-normal text-muted-fg">
              {formatPercent(cohort.availableWeightFraction)} bobot baseline ·{" "}
              {profileLabel(cohort.profile)}
            </span>
            <InfoTip term="availableWeight" />
          </h3>
          <p className="mb-1 text-xs text-muted-fg">
            {cohort.ranked.length} situs · peringkat berlaku di dalam kelompok ini.
          </p>
          <ol className="divide-y divide-border">
            {cohort.ranked.map((entry) => (
              <Row key={entry.site.recordId} entry={entry} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
