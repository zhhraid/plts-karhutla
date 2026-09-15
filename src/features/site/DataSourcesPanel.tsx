import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { NOT_AVAILABLE, SCOPE_LABEL } from "@/lib/formatting";
import type { SourceReference } from "@/types";

/**
 * Per-layer provenance.
 *
 * One row per data layer that actually has a source. A layer with no interim
 * record produces no row at all, rather than a row with blank provenance that
 * would read as though a source existed.
 */
export function DataSourcesPanel({
  sources,
}: {
  readonly sources: readonly SourceReference[];
}) {
  if (sources.length === 0) {
    return (
      <Card title="Data sources">
        <p className="text-sm text-muted-fg">
          Tidak ada catatan sumber yang tersimpan untuk situs ini.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Data sources">
      <ul className="divide-y divide-border">
        {sources.map((source) => (
          <li key={source.layer} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                {source.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {source.isHistorical ? (
                  <Badge tone="warning">Historical Data</Badge>
                ) : null}
                {source.isProvisionalProxy ? (
                  <Badge tone="unverified">Provisional Proxy</Badge>
                ) : null}
                {source.awaitingVerification ? (
                  <Badge tone="neutral">Menunggu verifikasi</Badge>
                ) : null}
              </div>
            </div>

            <p className="mt-1 text-sm">
              {source.sourceUrl === null ? (
                source.sourceName
              ) : (
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-start gap-1 text-secondary underline underline-offset-2"
                >
                  <span>{source.sourceName}</span>
                  <ExternalLink aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
                </a>
              )}
            </p>

            <dl className="mt-1.5 grid gap-x-4 gap-y-0.5 text-xs text-muted-fg sm:grid-cols-3">
              <div className="flex gap-1">
                <dt className="font-medium">Tahun/rujukan:</dt>
                <dd>{source.reference ?? NOT_AVAILABLE}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-medium">Status verifikasi:</dt>
                <dd>{source.verificationStatus.length === 0 ? NOT_AVAILABLE : source.verificationStatus}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-medium">Cakupan:</dt>
                <dd>{SCOPE_LABEL[source.scope]}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-border pt-3 text-xs leading-snug text-muted-fg">
        <span className="font-medium">Historical Data</span> menandai sumber yang
        tahun rujukannya lebih lama dari data terbaru situs ini — menggambarkan
        keadaan masa lalu, bukan keadaan sekarang.{" "}
        <span className="font-medium">Provisional Proxy</span> menandai nilai
        yang tidak menggambarkan situs ini sendiri, melainkan angka kecamatan
        atau kabupaten yang berdiri sebagai penggantinya.
      </p>
    </Card>
  );
}
