import { CircleHelp, MapPin, Plug, TrendingUp, Building2 } from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import type { Site } from "@/types";

/**
 * The five headline counts.
 *
 * Every figure is counted from the dataset at render time. Nothing here is a
 * constant, so a card cannot go stale against the data behind it.
 */
export function SummaryCards({ sites }: { readonly sites: readonly Site[] }) {
  const topPriority = sites.filter((site) => site.priorityBand === "HIGH").length;
  const existingContext = sites.filter(
    (site) => site.existingPltsContext !== null,
  ).length;
  const needsVerification = sites.filter(
    (site) =>
      site.dataConfidence.level === "NEEDS_VERIFICATION" ||
      site.recommendation.type === "NEEDS_DATA_VERIFICATION",
  ).length;
  // Only these two coordinate qualities are admitted into the candidate set;
  // a village or district centroid is never accepted as a facility location.
  const verifiedCoordinates = sites.filter(
    (site) =>
      site.evidenceInputs.coordinateQuality === "official_exact" ||
      site.evidenceInputs.coordinateQuality === "derived_confirmed",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        label="Candidate Sites"
        value={String(sites.length)}
        caption="Fasilitas publik berkoordinat terverifikasi yang masuk penyaringan."
        icon={<Building2 aria-hidden className="h-4 w-4" />}
      />
      <StatCard
        label="Top Priority"
        value={String(topPriority)}
        caption="Skor prioritas ≥ 75. Bukan rekomendasi pembangunan."
        icon={<TrendingUp aria-hidden className="h-4 w-4" />}
      />
      <StatCard
        label="Existing PLTS Context"
        value={String(existingContext)}
        caption="Situs dengan konteks PLTS eksisting tercatat; keterkaitan belum tentu ditetapkan."
        icon={<Plug aria-hidden className="h-4 w-4" />}
      />
      <StatCard
        label="Needs Verification"
        value={String(needsVerification)}
        caption="Bukti belum cukup untuk menentukan jalur tindak lanjut."
        icon={<CircleHelp aria-hidden className="h-4 w-4" />}
      />
      <StatCard
        label="Verified Coordinates"
        value={`${verifiedCoordinates}/${sites.length}`}
        caption="Koordinat official_exact atau derived_confirmed; centroid tidak pernah dipakai."
        icon={<MapPin aria-hidden className="h-4 w-4" />}
      />
    </div>
  );
}
