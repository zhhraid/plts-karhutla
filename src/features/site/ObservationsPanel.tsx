import { Card } from "@/components/ui/Card";
import { MissingValue } from "@/components/ui/MissingValue";
import { InfoTip } from "@/components/ui/InfoTip";
import { formatNumber, formatScore, SCOPE_LABEL } from "@/lib/formatting";
import type { Site } from "@/types";

/**
 * The underlying observations behind the scores.
 *
 * Each value states its own spatial reach, so a district hazard class is never
 * read as a measurement taken at the facility.
 */
export function ObservationsPanel({ site }: { readonly site: Site }) {
  return (
    <Card title="Observasi dasar">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium">Penerima manfaat</dt>
          <dd className="text-sm">
            {site.beneficiary.value === null ? (
              <MissingValue why="tidak ada nilai canonical terverifikasi" />
            ) : (
              <>
                {formatNumber(site.beneficiary.value)}{" "}
                <span className="text-muted-fg">{site.beneficiary.unit}</span>
              </>
            )}
          </dd>
          <dd className="text-xs text-muted-fg">{SCOPE_LABEL[site.beneficiary.scope]}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium">Iradiasi surya (GHI)</dt>
          <dd className="text-sm">
            {site.solar.ghiValue === null ? (
              <MissingValue why="menunggu ekstraksi nilai per titik" />
            ) : (
              <>
                {formatNumber(site.solar.ghiValue)}{" "}
                <span className="text-muted-fg">{site.solar.ghiUnit}</span>
              </>
            )}
          </dd>
          <dd className="text-xs text-muted-fg">{SCOPE_LABEL[site.solar.scope]}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium">Bahaya karhutla</dt>
          <dd className="text-sm">
            {site.karhutla.rawClass === null ? (
              <MissingValue why="kelas bahaya tidak tercatat" />
            ) : (
              <>
                Kelas {site.karhutla.rawClass}
                {site.karhutla.eligibleForScoring ? null : (
                  <span className="ml-1 text-xs text-muted-fg">
                    (tidak masuk skor)
                  </span>
                )}
              </>
            )}
          </dd>
          <dd className="text-xs text-muted-fg">{SCOPE_LABEL[site.karhutla.scope]}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium">
            Karhutla structural proxy
            <InfoTip term="karhutlaProxy" />
          </dt>
          <dd className="text-sm">
            {site.karhutlaProxy.value === null ? (
              <MissingValue why="rincian luas area kelas bahaya tidak tersedia" />
            ) : (
              <>
                {formatScore(site.karhutlaProxy.value)}
                <span className="ml-1 text-xs text-muted-fg">/ 100</span>
              </>
            )}
          </dd>
          <dd className="text-xs text-muted-fg">
            Proksi struktural tingkat kecamatan — bukan probabilitas kebakaran,
            bukan risiko site-specific, dan tidak dipakai dalam skor.
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium">Bahaya kekeringan</dt>
          <dd className="text-sm">
            {site.drought.rawClass === null ? (
              <MissingValue why="kelas bahaya tidak tercatat" />
            ) : (
              <>
                Kelas {site.drought.rawClass}
                <span className="ml-1 text-xs text-muted-fg">(tidak masuk skor)</span>
              </>
            )}
          </dd>
          <dd className="text-xs text-muted-fg">{SCOPE_LABEL[site.drought.scope]}</dd>
        </div>
      </dl>

      <p className="mt-3 border-t border-border pt-3 text-xs leading-snug text-muted-fg">
        Bahaya bukan risiko. Kelas di atas menyatakan paparan terhadap bahaya,
        bukan konsekuensi maupun kerentanan.
      </p>
    </Card>
  );
}
