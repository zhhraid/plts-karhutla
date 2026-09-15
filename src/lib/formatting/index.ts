/**
 * Display formatting.
 *
 * One rule governs this whole module: a missing value renders as an explicit
 * "Tidak tersedia", never as 0, "-", or an empty cell. A reader must never be
 * able to mistake an unknown for a measurement.
 */
import type { ValueScope } from "@/types";

export const NOT_AVAILABLE = "Tidak tersedia";

const numberFormat = new Intl.NumberFormat("id-ID");

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return NOT_AVAILABLE;
  }
  return numberFormat.format(value);
}

/** Scores carry two decimals; 0 is a real score and prints as "0,00". */
export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return NOT_AVAILABLE;
  }
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(
  fraction: number | null | undefined,
  digits = 0,
): string {
  if (fraction === null || fraction === undefined || Number.isNaN(fraction)) {
    return NOT_AVAILABLE;
  }
  return `${(fraction * 100).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatCoordinate(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return NOT_AVAILABLE;
  }
  return value.toFixed(4);
}

export function formatYear(value: string | null | undefined): string {
  return value === null || value === undefined || value.length === 0
    ? NOT_AVAILABLE
    : value;
}

/**
 * Plain-language statement of how far a value reaches.
 *
 * Shown next to every scope-limited figure so a district-level hazard class is
 * never read as a measurement at the facility.
 */
export const SCOPE_LABEL: Readonly<Record<ValueScope, string>> = {
  site_point: "Nilai pada titik fasilitas",
  kecamatan_proxy: "Proksi tingkat kecamatan — bukan nilai di titik fasilitas",
  kabupaten_context_only: "Konteks tingkat kabupaten — tidak membedakan antarsitus",
  unknown: "Cakupan spasial tidak tercatat",
};
