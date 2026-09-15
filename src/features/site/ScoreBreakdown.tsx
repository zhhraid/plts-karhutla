import { Card } from "@/components/ui/Card";
import { formatPercent, formatScore } from "@/lib/formatting";
import { DIMENSION_DESCRIPTIONS } from "@/lib/scoring/dimensions";
import type { ScoreBreakdown as Row } from "@/types";

/**
 * Per-dimension contribution.
 *
 * A dimension with no data is shown as its own row saying so, never omitted
 * and never rendered as 0. Hiding it would hide that the score rests on a
 * narrower base than the reader assumes.
 */
export function ScoreBreakdownPanel({
  rows,
  missingLabel,
}: {
  readonly rows: readonly Row[];
  readonly missingLabel: (dimension: Row["dimension"]) => string;
}) {
  return (
    <Card title="Score breakdown">
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.dimension}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-medium">{row.label}</span>
              {row.available ? (
                <span className="tabular-nums">
                  <span className="text-lg font-semibold">{formatScore(row.score)}</span>
                  <span className="ml-1 text-xs text-muted-fg">/ 100</span>
                </span>
              ) : (
                <span className="rounded-md bg-surface-sunken px-2 py-0.5 text-xs font-medium text-muted-fg">
                  {missingLabel(row.dimension)}
                </span>
              )}
            </div>

            {row.available ? (
              <>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, Math.max(0, row.score ?? 0))}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-fg">
                  Bobot baseline {row.baselineWeight} · kontribusi efektif{" "}
                  {formatPercent((row.effectiveWeight ?? 0) / 100)} setelah
                  renormalisasi.
                </p>
              </>
            ) : (
              <p className="mt-1 text-xs text-muted-fg">
                Dikeluarkan dari pembilang dan penyebut — tidak dinilai 0.
                Bobot baseline {row.baselineWeight} tidak ikut dihitung.
              </p>
            )}

            <p className="mt-1 text-xs leading-snug text-muted-fg">
              {DIMENSION_DESCRIPTIONS[row.dimension]}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
