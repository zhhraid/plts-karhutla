import { InfoTip } from "@/components/ui/InfoTip";
import { formatPercent } from "@/lib/formatting";
import type { Site } from "@/types";

/**
 * Evidence coverage per selected site.
 *
 * Labelled explicitly as completeness of evidence, not quality of the site. A
 * bar that reads as a score would invite exactly the misreading the whole
 * coverage concept exists to prevent.
 */
export function CoverageStrip({ sites }: { readonly sites: readonly Site[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <h2 className="mb-1 flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-muted-fg">
        Kelengkapan bukti
        <InfoTip term="availableWeight" />
      </h2>
      <p className="mb-3 text-xs leading-snug text-muted-fg">
        Menunjukkan seberapa lengkap bukti di balik tiap skor —{" "}
        <span className="font-medium">bukan</span> ukuran seberapa baik situsnya.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {sites.map((site) => (
          <li key={site.recordId}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="min-w-0 truncate text-sm font-medium">{site.facilityName}</span>
              <span className="text-xs tabular-nums text-muted-fg">
                {site.availableDimensionCount} / 4 dimensi ·{" "}
                {formatPercent(site.availableWeightFraction)} bobot baseline
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full rounded-full bg-muted"
                style={{ width: `${site.availableWeightFraction * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
