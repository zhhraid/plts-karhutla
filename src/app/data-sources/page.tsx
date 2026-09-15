import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { getSites } from "@/lib/data";
import { formatYear } from "@/lib/formatting";

export const metadata: Metadata = { title: "Sumber Data" };

export default async function DataSourcesPage() {
  const sites = await getSites();

  return (
    <>
      <PageHeader
        title="Sumber Data & Keterlacakan"
        description="Setiap angka dalam sistem ini dapat ditelusuri ke sumbernya. Nilai yang tidak dapat diverifikasi dilaporkan sebagai tidak tersedia, bukan diisi dengan asumsi."
      />

      <Card title="Cakupan sumber per situs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-fg">
              <th scope="col" className="py-2">Situs</th>
              <th scope="col" className="py-2">Jumlah sumber</th>
              <th scope="col" className="py-2">Tahun data terbaru</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sites.map((site) => (
              <tr key={site.recordId}>
                <td className="py-2">{site.facilityName}</td>
                <td className="py-2 tabular-nums">{site.sourceCount}</td>
                <td className="py-2 tabular-nums">{formatYear(site.latestDataYear)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Placeholder>
        Registri bukti per sumber, lisensi dan atribusi, catatan konflik sumber,
        serta daftar permintaan akuisisi eksternal — saat ini tersedia di
        research/EVIDENCE_LEDGER.md, research/SOURCES.md, dan
        research/SOURCE_CONFLICTS.md — akan disajikan di halaman ini.
      </Placeholder>
    </>
  );
}
