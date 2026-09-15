import { BAND_COLOR, BAND_GLYPH } from "@/features/map/markers";
import { PRIORITY_BAND_LABEL } from "@/lib/scoring/interpret";
import type { PriorityBand } from "@/types";

const BANDS: readonly PriorityBand[] = ["HIGH", "MEDIUM", "LOW", "NEEDS_VERIFICATION"];

const BAND_NOTE: Readonly<Record<PriorityBand, string>> = {
  HIGH: "Skor ≥ 75",
  MEDIUM: "Skor 50–74,99",
  LOW: "Skor < 50",
  NEEDS_VERIFICATION: "Tanpa skor — bukan skor rendah",
};

/**
 * Legend for both encodings.
 *
 * Explains shape and glyph as well as colour, because both are load-bearing:
 * a reader who cannot distinguish the colours must still be able to read the
 * map correctly.
 */
export function MapLegend() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-fg">
          Prioritas (bentuk simbol di dalam penanda)
        </p>
        <ul className="space-y-1.5">
          {BANDS.map((band) => (
            <li key={band} className="flex items-start gap-2">
              <span
                aria-hidden
                style={{ backgroundColor: BAND_COLOR[band] }}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white shadow"
              >
                {BAND_GLYPH[band]}
              </span>
              <span className="min-w-0">
                <span className="block">{PRIORITY_BAND_LABEL[band]}</span>
                <span className="block text-xs text-muted-fg">{BAND_NOTE[band]}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-fg">
          Tipe fasilitas (bentuk penanda)
        </p>
        <ul className="space-y-1.5">
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-5 w-5 shrink-0 rounded-full border-2 border-white bg-slate-500 shadow"
            />
            <span>Sekolah — penanda bulat</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-5 w-5 shrink-0 rounded-[4px] border-2 border-white bg-slate-500 shadow"
            />
            <span>Puskesmas — penanda kotak</span>
          </li>
        </ul>
      </div>

      <p className="text-xs leading-snug text-muted-fg">
        Warna hanya memperkuat; bentuk penanda dan simbol di dalamnya sudah
        cukup untuk membaca peta tanpa membedakan warna.
      </p>
    </div>
  );
}
