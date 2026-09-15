/**
 * Marker encoding for the map.
 *
 * Two independent visual channels, so nothing depends on colour alone:
 *
 *   shape  → facility type   (circle = Sekolah, rounded square = Puskesmas)
 *   glyph  → priority band   (a rank-ish symbol; "?" where no score exists)
 *
 * Colour reinforces the band but never carries it by itself. Every marker also
 * gets an `aria-label` and a `title` stating both facts in words.
 */
import type { FacilityType, PriorityBand, Site } from "@/types";
import { PRIORITY_BAND_LABEL } from "@/lib/scoring/interpret";

export const BAND_COLOR: Readonly<Record<PriorityBand, string>> = {
  HIGH: "#b45309",
  MEDIUM: "#1d4ed8",
  LOW: "#64748b",
  NEEDS_VERIFICATION: "#7c3aed",
};

/** The glyph is the non-colour carrier of the band. */
export const BAND_GLYPH: Readonly<Record<PriorityBand, string>> = {
  HIGH: "▲",
  MEDIUM: "●",
  LOW: "▬",
  NEEDS_VERIFICATION: "?",
};

export const FACILITY_SHAPE: Readonly<Record<FacilityType, "circle" | "square">> = {
  Sekolah: "circle",
  Puskesmas: "square",
};

export function markerLabel(site: Site): string {
  return `${site.facilityName} — ${site.facilityType}, ${PRIORITY_BAND_LABEL[site.priorityBand]}`;
}
