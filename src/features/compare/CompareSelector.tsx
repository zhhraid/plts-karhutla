"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";

import { FacilityTypeBadge } from "@/components/ui/StatusBadges";
import { MAX_COMPARE, isAtCapacity } from "@/lib/compare/selection";
import type { SelectionRejection } from "@/lib/compare/selection";
import type { Site } from "@/types";

const REJECTION_MESSAGE: Readonly<Record<SelectionRejection, string>> = {
  duplicate: "Situs itu sudah ada dalam perbandingan.",
  at_capacity: `Maksimal ${MAX_COMPARE} situs dapat dibandingkan sekaligus. Hapus satu terlebih dahulu.`,
  not_found: "Situs itu tidak ada dalam dataset yang diterbitkan.",
};

/**
 * Site picker for the comparison.
 *
 * Search matches facility name, type and district at once, because a planner
 * looks for "Puskesmas di Batu Ampar" as readily as for a specific name.
 * An already-selected or over-capacity choice is refused with a stated reason
 * rather than being silently ignored.
 */
export function CompareSelector({
  sites,
  selection,
  rejection,
  onAdd,
  onRemove,
  onClear,
}: {
  readonly sites: readonly Site[];
  readonly selection: readonly string[];
  readonly rejection: SelectionRejection | null;
  readonly onAdd: (recordId: string) => void;
  readonly onRemove: (recordId: string) => void;
  readonly onClear: () => void;
}) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("id-ID");
    if (needle.length === 0) return sites;
    return sites.filter((site) =>
      `${site.facilityName} ${site.facilityType} ${site.district}`
        .toLocaleLowerCase("id-ID")
        .includes(needle),
    );
  }, [sites, query]);

  const full = isAtCapacity(selection);
  const chosen = selection
    .map((id) => sites.find((site) => site.recordId === id))
    .filter((site): site is Site => site !== undefined);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="compare-search" className="mb-1 block text-xs font-medium text-muted-fg">
          Cari nama fasilitas, tipe, atau kecamatan
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-fg"
          />
          <input
            id="compare-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="mis. Puskesmas, Batu Ampar, SMAN"
            className="w-full rounded-md border border-border bg-surface py-1.5 pl-8 pr-2 text-sm"
          />
        </div>
      </div>

      {chosen.length === 0 ? null : (
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-fg">
            Dipilih ({chosen.length}/{MAX_COMPARE})
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {chosen.map((site) => (
              <li key={site.recordId}>
                <button
                  type="button"
                  onClick={() => onRemove(site.recordId)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary bg-secondary-subtle px-2.5 py-1 text-xs font-medium text-secondary-fg"
                >
                  <span className="max-w-[12rem] truncate">{site.facilityName}</span>
                  <X aria-hidden className="h-3 w-3" />
                  <span className="sr-only">Hapus dari perbandingan</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onClear}
            className="mt-2 rounded-md text-xs font-medium text-muted-fg underline underline-offset-2"
          >
            Kosongkan pilihan
          </button>
        </div>
      )}

      {rejection === null ? null : (
        <p role="status" className="rounded-md border border-warning bg-warning-subtle px-3 py-2 text-xs text-warning">
          {REJECTION_MESSAGE[rejection]}
        </p>
      )}

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-fg">
          {matches.length} situs tersedia
        </p>
        {matches.length === 0 ? (
          <p className="rounded-md border border-dashed border-border-strong px-3 py-4 text-center text-xs text-muted-fg">
            Tidak ada situs yang cocok dengan pencarian &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
            {matches.map((site) => {
              const selected = selection.includes(site.recordId);
              // A selected entry stays enabled so it can be toggled off;
              // only unselected entries are blocked when the set is full.
              const blocked = !selected && full;
              return (
                <li key={site.recordId}>
                  <button
                    type="button"
                    onClick={() => (selected ? onRemove(site.recordId) : onAdd(site.recordId))}
                    disabled={blocked}
                    aria-pressed={selected}
                    className="flex w-full items-center gap-2 rounded-md border border-border px-2 py-1.5 text-left text-sm hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {selected ? (
                      <Check aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Plus aria-hidden className="h-4 w-4 shrink-0 text-muted-fg" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{site.facilityName}</span>
                      <span className="mt-0.5 flex items-center gap-1.5">
                        <FacilityTypeBadge type={site.facilityType} />
                        <span className="text-xs text-muted-fg">Kec. {site.district}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
