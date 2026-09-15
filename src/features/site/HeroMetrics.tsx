import { Card } from "@/components/ui/Card";
import { MissingValue } from "@/components/ui/MissingValue";
import {
  ConfidenceBadge,
  PriorityBadge,
  RecommendationBadge,
  ScoreStatusBadge,
} from "@/components/ui/StatusBadges";
import { formatPercent, formatScore } from "@/lib/formatting";
import type { Site } from "@/types";

/**
 * The four headline facts.
 *
 * The score never appears alone: its completeness status and the strength of
 * the evidence behind it sit beside it, because a number read without them is
 * read wrongly.
 */
export function HeroMetrics({ site }: { readonly site: Site }) {
  return (
    <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card title="Priority score">
        <p className="text-5xl font-semibold tabular-nums">
          {site.priorityScore === null ? (
            <span className="text-xl font-normal">
              <MissingValue why="cakupan dimensi minimum tidak terpenuhi" />
            </span>
          ) : (
            formatScore(site.priorityScore)
          )}
        </p>
        <div className="mt-3">
          <PriorityBadge band={site.priorityBand} />
        </div>
        <p className="mt-3 text-xs leading-snug text-muted-fg">
          Dihitung atas {formatPercent(site.availableWeightFraction)} dari total
          bobot baseline. Skor dengan cakupan bobot berbeda tidak sepenuhnya
          sebanding antar-situs.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-1">
        <Card title="Score status">
          <ScoreStatusBadge status={site.scoreStatus} />
        </Card>

        <Card title="Data confidence">
          <ConfidenceBadge level={site.dataConfidence.level} />
          <p className="mt-2 text-xs leading-snug text-muted-fg">
            {site.dataConfidence.reason}
          </p>
        </Card>

        <Card title="Recommendation">
          <RecommendationBadge type={site.recommendation.type} />
        </Card>
      </div>
    </div>
  );
}
