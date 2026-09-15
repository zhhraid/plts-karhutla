import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MissingValue } from "@/components/ui/MissingValue";
import { Placeholder } from "@/components/ui/Placeholder";
import { PageHeader } from "@/components/layout/PageHeader";
import { getConfidenceSummary, getDataset, getRankedSites } from "@/lib/data";
import { formatScore } from "@/lib/formatting";
import {
  CONFIDENCE_LABEL,
  PRIORITY_BAND_LABEL,
} from "@/lib/scoring/interpret";

export default async function OverviewPage() {
  const [dataset, ranked, confidence] = await Promise.all([
    getDataset(),
    getRankedSites(),
    getConfidenceSummary(),
  ]);

  return (
    <>
      <PageHeader
        title="Ringkasan Pre-screening"
        description="Peringkat awal kandidat lokasi PLTS pada fasilitas publik Kabupaten Kubu Raya. Skor prioritas dan keyakinan data dilaporkan terpisah: skor tinggi pada data lemah bukan rekomendasi."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Situs dinilai">
          <p className="text-3xl font-semibold">{dataset.sites.length}</p>
        </Card>
        <Card title="Keyakinan data">
          <ul className="space-y-1 text-sm">
            {(
              ["HIGH", "MEDIUM", "NEEDS_VERIFICATION"] as const
            ).map((level) => (
              <li key={level} className="flex justify-between gap-2">
                <span>{CONFIDENCE_LABEL[level]}</span>
                <span className="font-medium">{confidence.byLevel[level]}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Metodologi">
          <p className="text-sm">{dataset.meta.methodology}</p>
          <p className="mt-2 text-xs text-muted-fg">{dataset.meta.weightsAre}</p>
        </Card>
      </div>

      <Card title="Peringkat kandidat">
        <ol className="divide-y divide-border">
          {ranked.map(({ site, rank, tied }) => (
            <li key={site.recordId} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
              <span className="w-10 shrink-0 text-sm text-muted-fg">
                {rank === null ? "—" : `#${rank}`}
              </span>
              <Link
                href={`/sites/${site.recordId}`}
                className="rounded-md font-medium"
              >
                {site.facilityName}
              </Link>
              <span className="text-xs text-muted-fg">{site.district}</span>
              <span className="ml-auto flex items-center gap-2 text-sm">
                {tied ? (
                  <span className="text-xs text-muted-fg">skor seri</span>
                ) : null}
                <Badge tone={site.dataConfidence.level === "NEEDS_VERIFICATION" ? "unverified" : "warning"}>
                  {CONFIDENCE_LABEL[site.dataConfidence.level]}
                </Badge>
                <span className="w-24 text-right font-semibold tabular-nums">
                  {site.priorityScore === null ? (
                    <MissingValue />
                  ) : (
                    formatScore(site.priorityScore)
                  )}
                </span>
                <span className="w-44 text-right text-xs text-muted-fg">
                  {PRIORITY_BAND_LABEL[site.priorityBand]}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Placeholder>
        Kartu KPI rinci, distribusi skor, dan filter kecamatan menyusul pada tahap
        pembangunan UI.
      </Placeholder>
    </>
  );
}
