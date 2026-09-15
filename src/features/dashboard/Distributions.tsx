import { Card } from "@/components/ui/Card";
import { DistributionBar, type DistributionRow } from "@/components/ui/DistributionBar";
import { CONFIDENCE_LABEL, PRIORITY_BAND_LABEL } from "@/lib/scoring/interpret";
import type { ConfidenceSummary, PrioritySummary } from "@/lib/data";
import type { FacilityType, Site } from "@/types";

/**
 * Three count distributions.
 *
 * Deliberately plain bars, not a charting library: every category here is a
 * small integer count, and a richer chart would imply a precision and a
 * sample size this dataset does not have.
 */
export function Distributions({
  sites,
  priority,
  confidence,
}: {
  readonly sites: readonly Site[];
  readonly priority: PrioritySummary;
  readonly confidence: ConfidenceSummary;
}) {
  const priorityRows: readonly DistributionRow[] = [
    { label: PRIORITY_BAND_LABEL.HIGH, count: priority.byBand.HIGH, barClassName: "bg-priority-high" },
    { label: PRIORITY_BAND_LABEL.MEDIUM, count: priority.byBand.MEDIUM, barClassName: "bg-priority-medium" },
    { label: PRIORITY_BAND_LABEL.LOW, count: priority.byBand.LOW, barClassName: "bg-priority-low" },
    {
      label: PRIORITY_BAND_LABEL.NEEDS_VERIFICATION,
      count: priority.byBand.NEEDS_VERIFICATION,
      note: "Tanpa skor — bukan skor rendah.",
      barClassName: "bg-priority-unverified",
    },
  ];

  const facilityCounts = sites.reduce<Record<FacilityType, number>>(
    (counts, site) => {
      counts[site.facilityType] += 1;
      return counts;
    },
    { Sekolah: 0, Puskesmas: 0 },
  );

  const facilityRows: readonly DistributionRow[] = [
    { label: "Sekolah", count: facilityCounts.Sekolah, barClassName: "bg-secondary" },
    { label: "Puskesmas", count: facilityCounts.Puskesmas, barClassName: "bg-primary" },
  ];

  const confidenceRows: readonly DistributionRow[] = [
    { label: CONFIDENCE_LABEL.HIGH, count: confidence.byLevel.HIGH, barClassName: "bg-confidence-high" },
    { label: CONFIDENCE_LABEL.MEDIUM, count: confidence.byLevel.MEDIUM, barClassName: "bg-confidence-medium" },
    {
      label: CONFIDENCE_LABEL.NEEDS_VERIFICATION,
      count: confidence.byLevel.NEEDS_VERIFICATION,
      barClassName: "bg-confidence-unverified",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Distribusi prioritas">
        <DistributionBar rows={priorityRows} total={priority.total} />
        {priority.fullyComparable ? null : (
          <p className="mt-3 text-xs leading-snug text-muted-fg">
            Situs dinilai atas cakupan bobot yang berbeda, sehingga skor tidak
            sepenuhnya sebanding antar-situs.
          </p>
        )}
      </Card>

      <Card title="Distribusi fasilitas">
        <DistributionBar rows={facilityRows} total={sites.length} />
      </Card>

      <Card title="Distribusi keyakinan data">
        <DistributionBar rows={confidenceRows} total={confidence.total} />
        {confidence.spatiallyCapped === 0 ? null : (
          <p className="mt-3 text-xs leading-snug text-muted-fg">
            {confidence.spatiallyCapped} situs tidak dapat mencapai keyakinan
            tinggi karena bukti bahayanya masih proksi kecamatan, bukan nilai di
            titik fasilitas.
          </p>
        )}
      </Card>
    </div>
  );
}
