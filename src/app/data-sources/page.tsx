import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/features/methodology/Section";
import { getAllSites } from "@/lib/data";
import {
  BASEMAP_ATTRIBUTION,
  SOURCE_CATALOG,
  type CatalogEntry,
} from "@/lib/data/sourceCatalog";
import { formatYear } from "@/lib/formatting";

export const metadata: Metadata = { title: "Sumber Data" };

const AUTHORITY_NOTE: Readonly<Record<CatalogEntry["authority"], string>> = {
  A: "Otoritas A — sumber primer resmi",
  B: "Otoritas B — sumber teknis otoritatif",
  C: "Otoritas C — sumber kontekstual kredibel",
};

function SourceLink({ url, label }: { readonly url: string; readonly label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-start gap-1 text-secondary underline underline-offset-2"
    >
      <span className="min-w-0 break-words">{label}</span>
      <ExternalLink aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
      <span className="sr-only">(membuka tab baru)</span>
    </a>
  );
}

function Field({
  label,
  children,
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

function SourceCard({ entry, usedBy }: { readonly entry: CatalogEntry; readonly usedBy: number }) {
  const planned = entry.status === "planned_not_yet_available";
  return (
    <article className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 text-base font-semibold">{entry.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={entry.authority === "A" ? "success" : entry.authority === "B" ? "info" : "neutral"}>
            {AUTHORITY_NOTE[entry.authority]}
          </Badge>
          {planned ? (
            <Badge tone="unverified">Belum masuk canonical data</Badge>
          ) : (
            <Badge tone="neutral">Dipakai pada {usedBy} situs</Badge>
          )}
        </div>
      </div>

      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Digunakan untuk">{entry.usedFor}</Field>
        <Field label="Cakupan spasial">{entry.spatialScope}</Field>
        <Field label="Tahun / periode rujukan">{entry.referencePeriod}</Field>
        <Field label="Status verifikasi">{entry.verificationStatus}</Field>
        {entry.licence === null ? null : (
          <Field label="Lisensi">{entry.licence}</Field>
        )}
        {entry.url === null ? null : (
          <Field label="Tautan sumber">
            <SourceLink url={entry.url} label={entry.url} />
          </Field>
        )}
      </dl>

      {entry.attribution === null ? null : (
        <p className="mt-3 rounded-md border border-border bg-surface-sunken px-3 py-2 text-xs leading-snug">
          <span className="font-semibold">Atribusi wajib: </span>
          {entry.attribution}
        </p>
      )}

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
          Keterbatasan
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-fg">
          {entry.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default async function DataSourcesPage() {
  const sites = await getAllSites();

  // Counted from the dataset, so a catalogue entry cannot claim usage the data
  // does not show.
  const usage = new Map<string, number>();
  for (const entry of SOURCE_CATALOG) {
    const names = new Set(entry.datasetSourceNames);
    const count =
      entry.usageCountedFrom === "existing_plts_context"
        ? sites.filter((site) => site.existingPltsContext !== null).length
        : sites.filter((site) =>
            site.sources.some((source) => names.has(source.sourceName)),
          ).length;
    usage.set(entry.id, count);
  }

  const inData = SOURCE_CATALOG.filter((entry) => entry.status === "in_canonical_data");
  const planned = SOURCE_CATALOG.filter((entry) => entry.status !== "in_canonical_data");

  return (
    <>
      <PageHeader
        title="Sumber Data & Transparansi"
        description="Katalog sumber di balik setiap angka. Nilai yang tidak dapat diverifikasi dilaporkan sebagai tidak tersedia, bukan diisi dengan asumsi."
      />

      <Callout tone="info">
        Data analitik situs bersifat preprocessed dan lokal — tidak ada API
        langsung yang dipanggil saat halaman dibuka. Satu-satunya dependensi
        jaringan runtime pada produk ini adalah ubin peta dasar, yang merupakan
        konteks visual dan <strong>bukan</strong> sumber data analitik.
      </Callout>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Sumber dalam canonical data ({inData.length})
        </h2>
        {inData.map((entry) => (
          <SourceCard key={entry.id} entry={entry} usedBy={usage.get(entry.id) ?? 0} />
        ))}
      </section>

      {planned.length === 0 ? null : (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Sumber yang direncanakan, belum tersedia ({planned.length})
          </h2>
          <p className="text-sm text-muted-fg">
            Dicantumkan agar jalur perbaikan data terlihat. Tidak satu pun
            menyumbang nilai pada dataset saat ini.
          </p>
          {planned.map((entry) => (
            <SourceCard key={entry.id} entry={entry} usedBy={0} />
          ))}
        </section>
      )}

      <Card title="Peta dasar — konteks visual, bukan sumber data analitik">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="Penyedia">{BASEMAP_ATTRIBUTION.name}</Field>
          <Field label="Peran">{BASEMAP_ATTRIBUTION.role}</Field>
          <Field label="Lisensi">{BASEMAP_ATTRIBUTION.licence}</Field>
          <Field label="Atribusi wajib">
            <SourceLink
              url={BASEMAP_ATTRIBUTION.url}
              label={BASEMAP_ATTRIBUTION.attribution}
            />
          </Field>
        </dl>
      </Card>

      <Card title="Keterlacakan per situs">
        <p className="mb-3 text-sm text-muted-fg">
          Setiap halaman situs memuat baris provenance untuk tiap lapis data yang
          benar-benar memiliki sumber, lengkap dengan tautan bila tersedia.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-fg">
                <th scope="col" className="py-2">Situs</th>
                <th scope="col" className="py-2">Lapis sumber</th>
                <th scope="col" className="py-2">Tahun data terbaru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sites.map((site) => (
                <tr key={site.recordId}>
                  <td className="py-2">
                    <a
                      href={`/sites/${site.recordId}`}
                      className="text-secondary underline underline-offset-2"
                    >
                      {site.facilityName}
                    </a>
                  </td>
                  <td className="py-2 tabular-nums">{site.sourceCount}</td>
                  <td className="py-2 tabular-nums">{formatYear(site.latestDataYear)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
