import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { getSites } from "@/lib/data";
import { formatPercent } from "@/lib/formatting";

export const metadata: Metadata = { title: "Bandingkan" };

export default async function ComparePage() {
  const sites = await getSites();
  const coverages = new Set(sites.map((site) => site.availableWeightFraction));

  return (
    <>
      <PageHeader
        title="Bandingkan Situs"
        description="Perbandingan berdampingan antar kandidat. Perbandingan hanya sahih bila kedua situs dinilai atas cakupan bobot yang sama."
      />

      {coverages.size > 1 ? (
        <Card title="Peringatan komparabilitas">
          <p className="text-sm">
            Situs pada dataset ini dinilai atas cakupan bobot yang berbeda (
            {[...coverages]
              .sort((a, b) => b - a)
              .map((coverage) => formatPercent(coverage))
              .join(", ")}
            ). Skor yang direnormalisasi atas himpunan dimensi yang berbeda
            bertumpu pada basis bukti yang berbeda dan tidak sepenuhnya sebanding.
          </p>
        </Card>
      ) : null}

      <Placeholder>
        Pemilih situs, tabel perbandingan per dimensi, dan penanda selisih
        dibangun pada tahap UI.
      </Placeholder>
    </>
  );
}
