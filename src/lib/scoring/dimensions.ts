/**
 * Decision dimensions, in the order they are presented everywhere in the UI.
 *
 * Labels live here so a dimension is never re-worded per screen. Weight values
 * are NOT hardcoded here — they come from the dataset meta, which is written by
 * the build script, so the app can never display a weight the scores were not
 * actually computed with.
 */
import type { DecisionDimension } from "@/types";

export const DIMENSION_ORDER: readonly DecisionDimension[] = [
  "solar",
  "social",
  "criticality",
  "resilience",
];

export const BASELINE_LABELS: Readonly<Record<DecisionDimension, string>> = {
  solar: "Solar Suitability",
  social: "Social Benefit",
  criticality: "Service Criticality",
  resilience: "Resilience Need",
};

export const DIMENSION_DESCRIPTIONS: Readonly<
  Record<DecisionDimension, string>
> = {
  solar:
    "Potensi iradiasi surya di titik fasilitas. Dinilai dari GHI site-level; belum tersedia pada MVP ini.",
  social:
    "Besaran manfaat sosial, diproksikan dari jumlah penerima manfaat terverifikasi di fasilitas.",
  criticality:
    "Kekritisan layanan bila pasokan listrik terputus. Berbasis aturan menurut tipe fasilitas.",
  resilience:
    "Kebutuhan ketahanan terhadap bahaya karhutla. Bahaya, bukan risiko.",
};
