import Link from "next/link";
import { Columns3, Map as MapIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Distributions } from "@/features/dashboard/Distributions";
import { Hero } from "@/features/dashboard/Hero";
import { RankingList } from "@/features/dashboard/RankingList";
import { SummaryCards } from "@/features/dashboard/SummaryCards";
import {
  getAllSites,
  getConfidenceSummary,
  getCoverageCohorts,
  getPrioritySummary,
} from "@/lib/data";

export default async function DashboardPage() {
  const [sites, cohorts, priority, confidence] = await Promise.all([
    getAllSites(),
    getCoverageCohorts(),
    getPrioritySummary(),
    getConfidenceSummary(),
  ]);

  if (sites.length === 0) {
    return (
      <>
        <Hero />
        <EmptyState
          title="Belum ada situs kandidat yang diterbitkan"
          description="Dataset yang dimuat tidak berisi situs. Jalankan `npm run data:build` untuk membangun ulang dari data interim."
        />
      </>
    );
  }

  return (
    <>
      <Hero />
      <SummaryCards sites={sites} />
      <Distributions sites={sites} priority={priority} confidence={confidence} />

      <Card title={`Peringkat kandidat (${sites.length})`}>
        <RankingList cohorts={cohorts} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs leading-snug text-muted-fg">
            {priority.provisional === sites.length
              ? "Seluruh skor masih provisional — tidak satu pun boleh dibaca sebagai hasil akhir."
              : `${priority.provisional} dari ${sites.length} skor masih provisional.`}
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-muted"
          >
            <Columns3 aria-hidden className="h-4 w-4" />
            Bandingkan situs
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-muted"
          >
            <MapIcon aria-hidden className="h-4 w-4" />
            Lihat di peta
          </Link>
        </div>
      </Card>
    </>
  );
}
