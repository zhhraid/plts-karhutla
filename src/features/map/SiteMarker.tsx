"use client";

import {
  BAND_COLOR,
  BAND_GLYPH,
  FACILITY_SHAPE,
  markerLabel,
} from "@/features/map/markers";
import type { Site } from "@/types";

/**
 * One map marker.
 *
 * Rendered as a real focusable <button> rather than a canvas symbol, so the
 * map is reachable by keyboard and by a screen reader — a plain requirement,
 * not an enhancement.
 */
export function SiteMarker({
  site,
  selected,
  onSelect,
}: {
  readonly site: Site;
  readonly selected: boolean;
  readonly onSelect: (site: Site) => void;
}) {
  const shape = FACILITY_SHAPE[site.facilityType];
  const color = BAND_COLOR[site.priorityBand];

  return (
    <button
      type="button"
      onClick={() => onSelect(site)}
      aria-label={markerLabel(site)}
      title={markerLabel(site)}
      aria-pressed={selected}
      style={{ backgroundColor: color }}
      className={[
        "flex h-7 w-7 items-center justify-center border-2 border-white text-[11px] font-bold leading-none text-white shadow-md transition-transform",
        shape === "circle" ? "rounded-full" : "rounded-[5px]",
        selected ? "scale-125 ring-2 ring-slate-900" : "hover:scale-110",
      ].join(" ")}
    >
      <span aria-hidden>{BAND_GLYPH[site.priorityBand]}</span>
    </button>
  );
}
