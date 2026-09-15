import { CheckCircle2, CircleDashed, TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { BASELINE_LABELS } from "@/lib/scoring/dimensions";
import { RECOMMENDATION_LABEL } from "@/lib/scoring/interpret";
import type { Site } from "@/types";

/**
 * "Why this recommendation".
 *
 * Every line comes from a field the pipeline wrote. Nothing is generated
 * prose, so no sentence here can cite evidence the dataset does not hold.
 */
export function WhyPanel({ site }: { readonly site: Site }) {
  return (
    <Card title="Why this recommendation">
      <p className="text-sm">
        <span className="font-medium">
          {RECOMMENDATION_LABEL[site.recommendation.type]}
        </span>{" "}
        — {site.recommendation.reason}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-fg">
            <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />
            Faktor positif
          </h3>
          {site.topPositiveFactors.length === 0 ? (
            <p className="text-sm text-muted-fg">
              Tidak ada faktor penaik skor yang tercatat untuk situs ini.
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {site.topPositiveFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-fg">
            <TriangleAlert aria-hidden className="h-3.5 w-3.5" />
            Keterbatasan
          </h3>
          {site.limitations.length === 0 ? (
            <p className="text-sm text-muted-fg">Tidak ada keterbatasan tercatat.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {site.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-fg">
            <CircleDashed aria-hidden className="h-3.5 w-3.5" />
            Data yang belum tersedia
          </h3>
          {site.missingData.length === 0 ? (
            <p className="text-sm text-muted-fg">
              Keempat dimensi tersedia untuk situs ini.
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {site.missingData.map((dimension) => (
                <li key={dimension}>{BASELINE_LABELS[dimension]}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Card>
  );
}
