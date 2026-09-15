import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapExplorer } from "@/features/map/MapExplorer";
import { getAllSites, getDistricts } from "@/lib/data";

export const metadata: Metadata = { title: "Peta" };

export default async function MapPage() {
  const [sites, districts] = await Promise.all([getAllSites(), getDistricts()]);

  return (
    <>
      <PageHeader
        title="Solar Resilience Map"
        description="Sebaran situs kandidat. Hanya fasilitas dengan koordinat terverifikasi yang dipetakan — titik pusat desa atau kecamatan tidak pernah dipakai sebagai koordinat fasilitas."
      />
      {sites.length === 0 ? (
        <EmptyState
          title="Belum ada situs berkoordinat untuk dipetakan"
          description="Dataset yang dimuat tidak berisi situs dengan koordinat terverifikasi."
        />
      ) : (
        <MapExplorer sites={sites} districts={districts} />
      )}
    </>
  );
}
