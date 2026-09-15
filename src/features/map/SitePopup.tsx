"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { MissingValue } from "@/components/ui/MissingValue";
import {
  ConfidenceBadge,
  FacilityTypeBadge,
  RecommendationBadge,
  ScoreStatusBadge,
} from "@/components/ui/StatusBadges";
import { formatScore } from "@/lib/formatting";
import type { Site } from "@/types";

/**
 * Detail card for the selected marker.
 *
 * Anchored to the map container rather than to the marker itself: on a phone a
 * balloon tethered to a point either covers the map or falls off it, and this
 * card docks to the bottom instead.
 */
export function SitePopup({
  site,
  onClose,
}: {
  readonly site: Site;
  readonly onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-2 bottom-2 z-20 max-h-[60%] overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:right-3 sm:top-3 sm:bottom-auto sm:w-80">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{site.facilityName}</h3>
          <p className="text-xs text-muted-fg">Kec. {site.district}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail situs"
          className="rounded-md p-1 text-muted-fg hover:bg-surface-muted"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <FacilityTypeBadge type={site.facilityType} />
        <ScoreStatusBadge status={site.scoreStatus} />
        <ConfidenceBadge level={site.dataConfidence.level} />
        <RecommendationBadge type={site.recommendation.type} />
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs uppercase tracking-wide text-muted-fg">Skor prioritas</p>
        <p className="text-2xl font-semibold tabular-nums">
          {site.priorityScore === null ? (
            <span className="text-base font-normal">
              <MissingValue why="cakupan dimensi minimum tidak terpenuhi" />
            </span>
          ) : (
            formatScore(site.priorityScore)
          )}
        </p>
      </div>

      <Link
        href={`/sites/${site.recordId}`}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Lihat Detail
        <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
    </div>
  );
}
