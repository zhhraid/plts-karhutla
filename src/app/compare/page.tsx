import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CompareExplorer } from "@/features/compare/CompareExplorer";
import { getAllSites } from "@/lib/data";

export const metadata: Metadata = { title: "Bandingkan" };

export default async function ComparePage() {
  const sites = await getAllSites();

  return (
    <>
      <PageHeader
        title="Bandingkan Situs"
        description="Perbandingan berdampingan 2 sampai 4 situs kandidat. Perbandingan hanya sahih antar-situs yang dinilai atas himpunan dimensi yang sama — halaman ini menyatakan kapan syarat itu tidak terpenuhi."
      />
      {sites.length === 0 ? (
        <EmptyState
          title="Belum ada situs untuk dibandingkan"
          description="Dataset yang dimuat tidak berisi situs kandidat."
        />
      ) : (
        <CompareExplorer sites={sites} />
      )}
    </>
  );
}
