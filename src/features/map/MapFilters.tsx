"use client";

import { RotateCcw } from "lucide-react";

import {
  CONFIDENCE_LABEL,
  PRIORITY_BAND_LABEL,
  RECOMMENDATION_LABEL,
} from "@/lib/scoring/interpret";
import type {
  DataConfidenceLevel,
  FacilityType,
  PriorityBand,
  RecommendationType,
} from "@/types";

export interface MapFilterState {
  readonly facilityType: FacilityType | "ALL";
  readonly district: string | "ALL";
  readonly priorityBand: PriorityBand | "ALL";
  readonly dataConfidence: DataConfidenceLevel | "ALL";
  readonly recommendationType: RecommendationType | "ALL";
}

export const EMPTY_FILTERS: MapFilterState = {
  facilityType: "ALL",
  district: "ALL",
  priorityBand: "ALL",
  dataConfidence: "ALL",
  recommendationType: "ALL",
};

export function countActiveFilters(filters: MapFilterState): number {
  return Object.values(filters).filter((value) => value !== "ALL").length;
}

const FIELD_CLASS =
  "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm";

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  readonly label: string;
  readonly value: T | "ALL";
  readonly options: ReadonlyArray<readonly [T, string]>;
  readonly onChange: (value: T | "ALL") => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-fg">{label}</span>
      <select
        className={FIELD_CLASS}
        value={value}
        onChange={(event) => onChange(event.target.value as T | "ALL")}
      >
        <option value="ALL">Semua</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MapFilters({
  filters,
  districts,
  onChange,
  onReset,
}: {
  readonly filters: MapFilterState;
  readonly districts: readonly string[];
  readonly onChange: (filters: MapFilterState) => void;
  readonly onReset: () => void;
}) {
  const active = countActiveFilters(filters);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Select
          label="Tipe fasilitas"
          value={filters.facilityType}
          options={[["Sekolah", "Sekolah"], ["Puskesmas", "Puskesmas"]] as const}
          onChange={(value) => onChange({ ...filters, facilityType: value })}
        />
        <Select
          label="Kecamatan"
          value={filters.district}
          options={districts.map((district) => [district, district] as const)}
          onChange={(value) => onChange({ ...filters, district: value })}
        />
        <Select
          label="Prioritas"
          value={filters.priorityBand}
          options={
            (["HIGH", "MEDIUM", "LOW", "NEEDS_VERIFICATION"] as const).map(
              (band) => [band, PRIORITY_BAND_LABEL[band]] as const,
            )
          }
          onChange={(value) => onChange({ ...filters, priorityBand: value })}
        />
        <Select
          label="Keyakinan data"
          value={filters.dataConfidence}
          options={
            (["HIGH", "MEDIUM", "NEEDS_VERIFICATION"] as const).map(
              (level) => [level, CONFIDENCE_LABEL[level]] as const,
            )
          }
          onChange={(value) => onChange({ ...filters, dataConfidence: value })}
        />
        <Select
          label="Rekomendasi"
          value={filters.recommendationType}
          options={
            ([
              "NEW_DEPLOYMENT_ASSESSMENT",
              "EXPANSION_ASSESSMENT",
              "NEEDS_DATA_VERIFICATION",
              "MONITOR_CONTEXT_ONLY",
            ] as const).map((type) => [type, RECOMMENDATION_LABEL[type]] as const)
          }
          onChange={(value) => onChange({ ...filters, recommendationType: value })}
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={active === 0}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCcw aria-hidden className="h-4 w-4" />
        Reset Filter{active === 0 ? "" : ` (${active})`}
      </button>
    </div>
  );
}
