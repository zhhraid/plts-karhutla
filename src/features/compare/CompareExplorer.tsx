"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CompareInsights } from "@/features/compare/CompareInsights";
import { CompareMatrix } from "@/features/compare/CompareMatrix";
import { CompareSelector } from "@/features/compare/CompareSelector";
import { CoverageStrip } from "@/features/compare/CoverageStrip";
import { assessComparability } from "@/lib/compare/comparability";
import { buildInsights } from "@/lib/compare/insights";
import {
  MIN_COMPARE,
  addToSelection,
  canCompare,
  removeFromSelection,
  type SelectionRejection,
} from "@/lib/compare/selection";
import type { Site } from "@/types";

/**
 * The comparison experience.
 *
 * Selection state lives here and flows through the pure rules in
 * `@/lib/compare`, so what the screen permits and what the tests assert are
 * the same code.
 */
export function CompareExplorer({ sites }: { readonly sites: readonly Site[] }) {
  const [selection, setSelection] = useState<readonly string[]>([]);
  const [rejection, setRejection] = useState<SelectionRejection | null>(null);

  const knownIds = useMemo(
    () => new Set(sites.map((site) => site.recordId)),
    [sites],
  );

  const selected = useMemo(
    () =>
      selection
        .map((id) => sites.find((site) => site.recordId === id))
        .filter((site): site is Site => site !== undefined),
    [selection, sites],
  );

  const ready = canCompare(selection);
  const comparability = useMemo(
    () => (ready ? assessComparability(selected) : null),
    [ready, selected],
  );
  const insights = useMemo(() => (ready ? buildInsights(selected) : []), [ready, selected]);

  const add = (recordId: string) => {
    const result = addToSelection(selection, recordId, knownIds);
    setSelection(result.selection);
    setRejection(result.rejected);
  };

  const remove = (recordId: string) => {
    setSelection(removeFromSelection(selection, recordId));
    setRejection(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <Card title="Pilih situs">
        <CompareSelector
          sites={sites}
          selection={selection}
          rejection={rejection}
          onAdd={add}
          onRemove={remove}
          onClear={() => {
            setSelection([]);
            setRejection(null);
          }}
        />
      </Card>

      <div className="space-y-4">
        {/* Selection changes are announced, so a screen-reader user learns the
            comparison updated without having to go looking for it. */}
        <p role="status" aria-live="polite" className="sr-only">
          {ready
            ? `Membandingkan ${selected.length} situs.`
            : `${selection.length} situs dipilih. Pilih minimal ${MIN_COMPARE} untuk membandingkan.`}
        </p>

        {!ready ? (
          <EmptyState
            title={`Pilih minimal ${MIN_COMPARE} situs untuk dibandingkan`}
            description={
              selection.length === 0
                ? "Gunakan pencarian di samping untuk menambahkan situs berdasarkan nama fasilitas, tipe, atau kecamatan. Perbandingan dapat memuat 2 sampai 4 situs."
                : `Baru ${selection.length} situs yang dipilih. Tambahkan sedikitnya satu lagi agar perbandingan dapat ditampilkan.`
            }
          />
        ) : (
          <>
            {comparability?.warning === null ? null : (
              <p
                role="status"
                className="rounded-md border border-warning bg-warning-subtle px-3 py-2 text-sm leading-snug text-warning"
              >
                {comparability?.warning}
              </p>
            )}

            <CoverageStrip sites={selected} />
            <CompareInsights insights={insights} />

            <Card title="Perbandingan rinci">
              <CompareMatrix sites={selected} />
            </Card>

            <p className="text-xs leading-snug text-muted-fg">
              Perbandingan ini tidak menetapkan situs terbaik dan tidak
              menghasilkan peringkat global. Seluruh nilai adalah indikasi
              prioritas awal yang masih memerlukan verifikasi dan asesmen teknis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
