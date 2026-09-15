import { Fragment } from "react";

export interface DistributionRow {
  readonly label: string;
  readonly count: number;
  /** Optional caution note shown under the row. */
  readonly note?: string;
  readonly barClassName: string;
}

/**
 * A count distribution, drawn as proportional bars.
 *
 * Every row states its own count in text next to the bar, so the chart is
 * never the only way to read the number. A zero count renders as a labelled
 * "0" row rather than disappearing — an absent category and a category with no
 * members are different facts.
 */
export function DistributionBar({
  rows,
  total,
  emptyLabel = "Tidak ada data untuk ditampilkan.",
}: {
  readonly rows: readonly DistributionRow[];
  readonly total: number;
  readonly emptyLabel?: string;
}) {
  if (total === 0) {
    return <p className="text-sm text-muted-fg">{emptyLabel}</p>;
  }

  return (
    <dl className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 text-sm">
      {rows.map((row) => {
        const percent = total === 0 ? 0 : (row.count / total) * 100;
        return (
          <Fragment key={row.label}>
            <dt className="min-w-0">
              <span className="block truncate">{row.label}</span>
              <div
                className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
                role="presentation"
              >
                <div
                  className={`h-full rounded-full ${row.barClassName}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              {row.note === undefined ? null : (
                <span className="mt-1 block text-xs text-muted-fg">{row.note}</span>
              )}
            </dt>
            <dd className="self-start pt-0.5 tabular-nums font-medium">
              {row.count}
              <span className="ml-1 text-xs font-normal text-muted-fg">
                ({Math.round(percent)}%)
              </span>
            </dd>
          </Fragment>
        );
      })}
    </dl>
  );
}
