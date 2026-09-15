import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { getDataset } from "@/lib/data";
import { BASELINE_LABELS, DIMENSION_DESCRIPTIONS, DIMENSION_ORDER } from "@/lib/scoring/dimensions";

export const metadata: Metadata = { title: "Metodologi" };

export default async function MethodologyPage() {
  const { meta } = await getDataset();

  return (
    <>
      <PageHeader
        title="Metodologi Penilaian"
        description={meta.methodology}
      />

      <Card title="Status bobot">
        <p className="text-sm">{meta.weightsAre}</p>
        <p className="mt-2 text-sm text-muted-fg">
          Sistem ini tidak mengklaim AHP. Tidak ada pairwise comparison dari
          panel ahli yang mendasari bobot di bawah ini.
        </p>
      </Card>

      <Card title="Bobot baseline">
        <ul className="space-y-3 text-sm">
          {DIMENSION_ORDER.map((dimension) => (
            <li key={dimension}>
              <div className="flex justify-between gap-3">
                <span className="font-medium">{BASELINE_LABELS[dimension]}</span>
                <span className="tabular-nums">{meta.baselineWeights[dimension]}</span>
              </div>
              <p className="text-muted-fg">{DIMENSION_DESCRIPTIONS[dimension]}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Kebijakan nilai hilang">
        <p className="text-sm">{meta.missingValuePolicy}</p>
      </Card>

      <Card title="Normalisasi sosial">
        <p className="text-sm">{meta.socialNormalisation}</p>
      </Card>

      <Placeholder>
        Uraian penuh rumus, analisis sensitivitas bobot, dan rubrik keyakinan data
        — saat ini tersedia di docs/DECISION_METHODOLOGY.md, docs/SCORING_FORMULA.md,
        dan docs/DATA_CONFIDENCE_METHOD.md — akan disajikan di halaman ini.
      </Placeholder>
    </>
  );
}
