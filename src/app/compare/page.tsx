import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { getPrioritySummary } from "@/lib/data";
import { formatPercent } from "@/lib/formatting";

export const metadata: Metadata = { title: "Bandingkan" };

export default async function ComparePage() {
  const summary = await getPrioritySummary();

  return (
    <>
      <PageHeader
        title="Bandingkan Situs"
        description="Perbandingan berdampingan antar kandidat. Perbandingan hanya sahih bila kedua situs dinilai atas cakupan bobot yang sama."
      />

      {summary.fullyComparable ? null : (
        <Card title="Peringatan komparabilitas">
          <p className="text-sm">
            Situs pada dataset ini dinilai atas cakupan bobot yang berbeda (
            {summary.coverageFractions
              .map((coverage) => formatPercent(coverage))
              .join(", ")}
            ). Skor yang direnormalisasi atas himpunan dimensi yang berbeda
            bertumpu pada basis bukti yang berbeda dan tidak sepenuhnya sebanding.
          </p>
        </Card>
      )}

      <Placeholder>
        Pemilih situs, tabel perbandingan per dimensi, dan penanda selisih
        dibangun pada tahap UI.
      </Placeholder>
    </>
  );
}
