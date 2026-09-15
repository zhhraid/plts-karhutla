import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { FacilityTypeBadge } from "@/components/ui/StatusBadges";
import { DataSourcesPanel } from "@/features/site/DataSourcesPanel";
import { Disclaimer } from "@/features/site/Disclaimer";
import { HeroMetrics } from "@/features/site/HeroMetrics";
import { ObservationsPanel } from "@/features/site/ObservationsPanel";
import { ScoreBreakdownPanel } from "@/features/site/ScoreBreakdown";
import { WhyPanel } from "@/features/site/WhyPanel";
import { getAllSites, getSiteById } from "@/lib/data";
import { formatCoordinate, formatYear } from "@/lib/formatting";
import type { DecisionDimension } from "@/types";

interface Params {
  readonly params: Promise<{ readonly id: string }>;
}

export async function generateStaticParams() {
  const sites = await getAllSites();
  return sites.map((site) => ({ id: site.recordId }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const site = await getSiteById((await params).id);
  return { title: site?.facilityName ?? "Situs tidak ditemukan" };
}

/**
 * A dimension with no data says which kind of absence it is.
 *
 * "Pending verification" and "Data belum tersedia" are different states: one
 * means the value exists but has not been confirmed, the other that it has not
 * been obtained at all.
 */
function missingLabel(dimension: DecisionDimension): string {
  return dimension === "solar" ? "Pending verification" : "Data belum tersedia";
}

export default async function SiteDetailPage({ params }: Params) {
  const site = await getSiteById((await params).id);
  if (site === null) notFound();

  return (
    <>
      <Link
        href="/map"
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-fg hover:text-slate-900"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        Kembali ke peta
      </Link>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {site.facilityName}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-fg">
          <FacilityTypeBadge type={site.facilityType} />
          <span>Kecamatan {site.district}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="h-3.5 w-3.5" />
            {formatCoordinate(site.latitude)}, {formatCoordinate(site.longitude)}
          </span>
          <span>· {site.recordId}</span>
        </div>
      </header>

      <Disclaimer />

      <HeroMetrics site={site} />

      <ScoreBreakdownPanel rows={site.breakdown} missingLabel={missingLabel} />

      <WhyPanel site={site} />

      <ObservationsPanel site={site} />

      {site.existingPltsContext === null ? null : (
        <Card title="Konteks PLTS eksisting">
          <p className="text-sm">{site.existingPltsContext}</p>
          {site.evidenceInputs.existingAssetLinkEstablished ? null : (
            <p className="mt-2 text-xs leading-snug text-muted-fg">
              Keterkaitan fisik/operasional antara fasilitas ini dan aset
              tersebut belum ditetapkan. Kesamaan nama desa bukan bukti
              keterkaitan aset.
            </p>
          )}
        </Card>
      )}

      <DataSourcesPanel sources={site.sources} />

      <Card title="Ringkasan keterlacakan">
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-fg">Jumlah lapis sumber</dt>
            <dd className="tabular-nums">{site.sourceCount}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-fg">Tahun data terbaru</dt>
            <dd className="tabular-nums">{formatYear(site.latestDataYear)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-fg">Kualitas koordinat</dt>
            <dd>{site.evidenceInputs.coordinateQuality}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
