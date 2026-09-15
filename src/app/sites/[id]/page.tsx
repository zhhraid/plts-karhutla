import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MissingValue } from "@/components/ui/MissingValue";
import { Placeholder } from "@/components/ui/Placeholder";
import { getSiteById, getSites } from "@/lib/data";
import { formatPercent, formatScore, SCOPE_LABEL } from "@/lib/formatting";
import {
  CONFIDENCE_LABEL,
  RECOMMENDATION_LABEL,
  SCORE_STATUS_LABEL,
} from "@/lib/scoring/interpret";

interface Params {
  readonly params: Promise<{ readonly id: string }>;
}

export async function generateStaticParams() {
  const sites = await getSites();
  return sites.map((site) => ({ id: site.recordId }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const site = await getSiteById((await params).id);
  return { title: site?.facilityName ?? "Situs tidak ditemukan" };
}

export default async function SiteDetailPage({ params }: Params) {
  const site = await getSiteById((await params).id);
  if (site === null) notFound();

  return (
    <>
      <PageHeader
        title={site.facilityName}
        description={`${site.facilityType} · Kecamatan ${site.district} · ${site.recordId}`}
      />

      <div className="flex flex-wrap gap-2">
        <Badge tone="info">{SCORE_STATUS_LABEL[site.scoreStatus]}</Badge>
        <Badge tone={site.dataConfidence.level === "NEEDS_VERIFICATION" ? "unverified" : "warning"}>
          {CONFIDENCE_LABEL[site.dataConfidence.level]}
        </Badge>
        <Badge tone="neutral">
          {RECOMMENDATION_LABEL[site.recommendation.type]}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Skor prioritas">
          <p className="text-4xl font-semibold tabular-nums">
            {site.priorityScore === null ? (
              <MissingValue why="cakupan dimensi minimum tidak terpenuhi" />
            ) : (
              formatScore(site.priorityScore)
            )}
          </p>
          <p className="mt-2 text-xs text-muted-fg">
            Dihitung atas {formatPercent(site.availableWeightFraction)} dari total
            bobot baseline. Skor dengan cakupan bobot berbeda tidak sepenuhnya
            sebanding.
          </p>
        </Card>

        <Card title="Kontribusi per dimensi">
          <ul className="space-y-2 text-sm">
            {site.breakdown.map((row) => (
              <li key={row.dimension} className="flex items-baseline justify-between gap-3">
                <span>{row.label}</span>
                <span className="tabular-nums">
                  {row.available ? (
                    <>
                      {formatScore(row.score)}
                      <span className="ml-2 text-xs text-muted-fg">
                        bobot efektif {formatPercent((row.effectiveWeight ?? 0) / 100)}
                      </span>
                    </>
                  ) : (
                    <MissingValue why="dikeluarkan dari pembilang dan penyebut" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Dasar keyakinan data">
        <p className="text-sm">{site.dataConfidence.reason}</p>
      </Card>

      <Card title="Cakupan spasial nilai bahaya">
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium">Karhutla — {site.karhutla.rawClass ?? "kelas tidak tersedia"}</dt>
            <dd className="text-muted-fg">{SCOPE_LABEL[site.karhutla.scope]}</dd>
          </div>
          <div>
            <dt className="font-medium">Kekeringan — {site.drought.rawClass ?? "kelas tidak tersedia"}</dt>
            <dd className="text-muted-fg">{SCOPE_LABEL[site.drought.scope]}</dd>
          </div>
        </dl>
      </Card>

      {site.limitations.length === 0 ? null : (
        <Card title="Keterbatasan">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {site.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </Card>
      )}

      <Placeholder>
        Panel bukti per sumber, grafik kontribusi dimensi, dan mini-map situs
        dibangun pada tahap UI.
      </Placeholder>
    </>
  );
}
