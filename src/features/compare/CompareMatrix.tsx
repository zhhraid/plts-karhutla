import { InfoTip } from "@/components/ui/InfoTip";
import { COMPARE_ROWS } from "@/lib/compare/matrix";
import { GROUP_LABEL, type CompareCell, type CompareGroup, type CompareRow } from "@/lib/compare/rows";
import type { Site } from "@/types";

/** Absent values are italic and muted, and never look like a measurement. */
function Cell({ cell }: { readonly cell: CompareCell }) {
  return (
    <>
      <span className={cell.absence === null ? "" : "italic text-muted-fg"}>
        {cell.text}
      </span>
      {cell.note === undefined ? null : (
        <span className="mt-0.5 block text-xs leading-snug text-muted-fg">{cell.note}</span>
      )}
    </>
  );
}

function groupRows(): ReadonlyArray<readonly [CompareGroup, readonly CompareRow[]]> {
  const order: readonly CompareGroup[] = [
    "identity",
    "result",
    "dimensions",
    "observations",
    "coverage",
    "context",
  ];
  return order.map((group) => [group, COMPARE_ROWS.filter((row) => row.group === group)] as const);
}

function RowLabel({ row }: { readonly row: CompareRow }) {
  return (
    <span className="inline-flex items-center gap-1">
      {row.label}
      {row.term === undefined ? null : <InfoTip term={row.term} />}
    </span>
  );
}

/**
 * Side-by-side comparison.
 *
 * Two layouts from one row definition: a table at `lg` and above, stacked
 * per-site cards below it. A wide table squeezed onto a phone is unreadable,
 * and a horizontally scrolling one hides exactly the column you are comparing
 * against.
 */
export function CompareMatrix({ sites }: { readonly sites: readonly Site[] }) {
  const groups = groupRows();

  return (
    <>
      {/* Desktop / tablet: one column per site. */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <caption className="sr-only">
            Perbandingan {sites.length} situs kandidat menurut identitas, hasil
            penilaian, skor per dimensi, observasi dasar, kelengkapan bukti, dan
            konteks.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-56 border-b border-border p-2 text-left align-bottom">
                <span className="sr-only">Atribut</span>
              </th>
              {sites.map((site) => (
                <th
                  key={site.recordId}
                  scope="col"
                  className="border-b border-border p-2 text-left align-bottom"
                >
                  <span className="block font-semibold">{site.facilityName}</span>
                  <span className="block text-xs font-normal text-muted-fg">
                    {site.recordId}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map(([group, rows]) => (
            <tbody key={group}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={sites.length + 1}
                  className="bg-surface-sunken px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-fg"
                >
                  {GROUP_LABEL[group]}
                </th>
              </tr>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-border align-top">
                  <th scope="row" className="p-2 text-left font-medium">
                    <RowLabel row={row} />
                  </th>
                  {sites.map((site) => (
                    <td key={site.recordId} className="p-2">
                      <Cell cell={row.cell(site)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* Mobile / small tablet: one card per site. */}
      <div className="space-y-4 lg:hidden">
        {sites.map((site) => (
          <section
            key={site.recordId}
            className="rounded-lg border border-border bg-surface p-4 shadow-sm"
          >
            <h3 className="font-semibold">{site.facilityName}</h3>
            <p className="text-xs text-muted-fg">{site.recordId}</p>
            {groups.map(([group, rows]) => (
              <div key={group} className="mt-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-fg">
                  {GROUP_LABEL[group]}
                </p>
                <dl className="divide-y divide-border text-sm">
                  {rows.map((row) => (
                    <div key={row.key} className="flex flex-wrap gap-x-3 py-1.5">
                      <dt className="w-full font-medium sm:w-48">
                        <RowLabel row={row} />
                      </dt>
                      <dd className="min-w-0 flex-1">
                        <Cell cell={row.cell(site)} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
