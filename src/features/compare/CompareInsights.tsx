import { AlertTriangle, CircleDashed, Info, Scale } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { Insight, InsightKind } from "@/lib/compare/insights";

const ICON: Readonly<Record<InsightKind, typeof Info>> = {
  comparability: AlertTriangle,
  observation: Info,
  gap: CircleDashed,
  provisional_score: Scale,
};

const TONE: Readonly<Record<InsightKind, string>> = {
  comparability: "border-warning bg-warning-subtle text-warning",
  observation: "border-border bg-surface",
  gap: "border-border bg-surface-muted text-muted-fg",
  provisional_score: "border-secondary bg-secondary-subtle text-secondary-fg",
};

/**
 * Rule-based comparison notes.
 *
 * The heading says outright that these are derived by rule, not generated, so
 * a reader does not assume a model wrote them and discount them accordingly —
 * or, worse, trust them further than the data allows.
 */
export function CompareInsights({ insights }: { readonly insights: readonly Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <Card title="Catatan perbandingan">
      <ul className="space-y-2">
        {insights.map((insight) => {
          const Icon = ICON[insight.kind];
          return (
            <li
              key={insight.text}
              className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm leading-snug ${TONE[insight.kind]}`}
            >
              <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{insight.text}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 border-t border-border pt-3 text-xs leading-snug text-muted-fg">
        Catatan di atas diturunkan dengan aturan tetap dari nilai yang benar-benar
        ada pada dataset — bukan teks generatif, dan tidak ada model bahasa yang
        berjalan saat halaman ini dibuka. Tidak ada pernyataan yang dibuat dari
        nilai yang kosong.
      </p>
    </Card>
  );
}
