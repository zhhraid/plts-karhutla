import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { getSites } from "@/lib/data";
import { formatCoordinate } from "@/lib/formatting";

export const metadata: Metadata = { title: "Peta" };

export default async function MapPage() {
  const sites = await getSites();

  return (
    <>
      <PageHeader
        title="Peta Kandidat"
        description="Sebaran titik fasilitas kandidat. Hanya fasilitas dengan koordinat terverifikasi yang dipetakan; titik pusat desa atau kecamatan tidak pernah digunakan sebagai koordinat fasilitas."
      />
      <Placeholder>
        Peta interaktif MapLibre GL (basemap, marker berlapis prioritas, popup
        situs, dan legenda) dibangun pada tahap UI. Daftar di bawah menampilkan
        koordinat yang akan dipetakan.
      </Placeholder>
      <Card title={`Titik siap dipetakan (${sites.length})`}>
        <ul className="divide-y divide-border text-sm">
          {sites.map((site) => (
            <li key={site.recordId} className="flex flex-wrap gap-x-4 py-2">
              <span className="font-medium">{site.facilityName}</span>
              <span className="text-muted-fg">{site.district}</span>
              <span className="ml-auto tabular-nums text-muted-fg">
                {formatCoordinate(site.latitude)}, {formatCoordinate(site.longitude)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
