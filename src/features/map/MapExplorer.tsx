"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapFilters, EMPTY_FILTERS, type MapFilterState } from "@/features/map/MapFilters";
import { MapLegend } from "@/features/map/MapLegend";
import { SitePopup } from "@/features/map/SitePopup";
import { filterSites } from "@/lib/data/query";
import type { Site } from "@/types";

// MapLibre touches `window` on import, so the canvas is loaded only in the
// browser. The filters, legend and list around it stay server-rendered.
const MapView = dynamic(
  () => import("@/features/map/MapView").then((module) => module.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-surface-sunken text-sm text-muted-fg">
        Memuat peta…
      </div>
    ),
  },
);

/**
 * The map experience: filters, canvas, popup and legend.
 *
 * Filtering runs through the same `filterSites` predicate the dashboard and
 * the API use, so the map can never disagree with the rest of the product
 * about which sites match.
 */
export function MapExplorer({
  sites,
  districts,
}: {
  readonly sites: readonly Site[];
  readonly districts: readonly string[];
}) {
  const [filters, setFilters] = useState<MapFilterState>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      filterSites(sites, {
        facilityType: filters.facilityType === "ALL" ? undefined : [filters.facilityType],
        district: filters.district === "ALL" ? undefined : [filters.district],
        priorityBand: filters.priorityBand === "ALL" ? undefined : [filters.priorityBand],
        dataConfidence:
          filters.dataConfidence === "ALL" ? undefined : [filters.dataConfidence],
        recommendationType:
          filters.recommendationType === "ALL" ? undefined : [filters.recommendationType],
      }),
    [sites, filters],
  );

  // A selection that the current filter excludes is dropped, so the popup can
  // never describe a site that is no longer on the map.
  const selected =
    visible.find((site) => site.recordId === selectedId) ?? null;

  const reset = () => {
    setFilters(EMPTY_FILTERS);
    setSelectedId(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="space-y-4">
        <Card title="Filter">
          <MapFilters
            filters={filters}
            districts={districts}
            onChange={(next) => setFilters(next)}
            onReset={reset}
          />
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-fg">
            Menampilkan {visible.length} dari {sites.length} situs.
          </p>
        </Card>

        <Card title="Legenda">
          <MapLegend />
        </Card>
      </div>

      <div className="space-y-4">
        {visible.length === 0 ? (
          <EmptyState
            title="Tidak ada situs yang cocok dengan filter"
            description="Kombinasi filter yang dipilih tidak menghasilkan situs mana pun. Ini bukan berarti tidak ada situs — longgarkan salah satu filter atau setel ulang."
            action={
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-muted"
              >
                Reset Filter
              </button>
            }
          />
        ) : (
          <div className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-lg border border-border bg-surface-sunken lg:h-[70vh]">
            <MapView
              sites={visible}
              selectedId={selected?.recordId ?? null}
              onSelect={(site) => setSelectedId(site.recordId)}
            />
            {selected === null ? null : (
              <SitePopup site={selected} onClose={() => setSelectedId(null)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
