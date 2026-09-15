/**
 * The concrete comparison rows (§D of the product brief).
 *
 * Every cell either states a real value or names which kind of absence it is.
 * No cell ever renders a missing measurement as 0, as "Low", or as a worst
 * value — those would each be a claim the data does not make.
 */
import {
  absent,
  present,
  type CompareRow,
} from "@/lib/compare/rows";
import { formatNumber, formatPercent, formatScore, SCOPE_LABEL } from "@/lib/formatting";
import { BASELINE_LABELS, DIMENSION_ORDER } from "@/lib/scoring/dimensions";
import {
  CONFIDENCE_LABEL,
  PRIORITY_BAND_LABEL,
  RECOMMENDATION_LABEL,
  SCORE_STATUS_LABEL,
} from "@/lib/scoring/interpret";
import type { DecisionDimension, Site } from "@/types";

const DIMENSION_TERM: Readonly<Record<DecisionDimension, "solarSuitability" | "socialImpact" | "facilityCriticality" | "resilienceNeed">> = {
  solar: "solarSuitability",
  social: "socialImpact",
  criticality: "facilityCriticality",
  resilience: "resilienceNeed",
};

const dimensionRows: readonly CompareRow[] = DIMENSION_ORDER.map((dimension) => ({
  key: `dim_${dimension}`,
  label: BASELINE_LABELS[dimension],
  group: "dimensions" as const,
  term: DIMENSION_TERM[dimension],
  cell: (site: Site) => {
    const row = site.breakdown.find((entry) => entry.dimension === dimension);
    if (row === undefined || !row.available) {
      // Solar is the one dimension whose source exists but whose point value
      // has not been extracted; the others were simply never obtained.
      return absent(
        dimension === "solar" ? "pending_verification" : "not_available",
        `Bobot baseline ${row?.baselineWeight ?? 0} dikeluarkan dari perhitungan`,
      );
    }
    return present(
      formatScore(row.score),
      `Kontribusi efektif ${formatPercent((row.effectiveWeight ?? 0) / 100)}`,
    );
  },
}));

export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    key: "facility_type",
    label: "Tipe fasilitas",
    group: "identity",
    cell: (site) => present(site.facilityType),
  },
  {
    key: "district",
    label: "Kecamatan",
    group: "identity",
    cell: (site) => present(site.district),
  },
  {
    key: "priority_score",
    label: "Priority Score",
    group: "result",
    term: "priorityScore",
    cell: (site) =>
      site.priorityScore === null
        ? absent("not_available", "Cakupan dimensi minimum tidak terpenuhi")
        : present(formatScore(site.priorityScore)),
  },
  {
    key: "priority_band",
    label: "Provisional Priority Band",
    group: "result",
    term: "provisionalPriority",
    cell: (site) => present(PRIORITY_BAND_LABEL[site.priorityBand]),
  },
  {
    key: "score_status",
    label: "Score Status",
    group: "result",
    cell: (site) => present(SCORE_STATUS_LABEL[site.scoreStatus]),
  },
  {
    key: "data_confidence",
    label: "Data Confidence",
    group: "result",
    term: "dataConfidence",
    cell: (site) => present(CONFIDENCE_LABEL[site.dataConfidence.level]),
  },
  ...dimensionRows,
  {
    key: "beneficiary",
    label: "Penerima manfaat",
    group: "observations",
    cell: (site) =>
      site.beneficiary.value === null
        ? absent("not_available", "Tidak ada nilai canonical terverifikasi")
        : present(
            `${formatNumber(site.beneficiary.value)} ${site.beneficiary.unit}`,
            SCOPE_LABEL[site.beneficiary.scope],
          ),
  },
  {
    key: "ghi",
    label: "GHI (iradiasi surya)",
    group: "observations",
    cell: (site) =>
      site.solar.ghiValue === null
        ? absent("pending_verification", "Menunggu ekstraksi nilai per titik")
        : present(`${formatNumber(site.solar.ghiValue)} ${site.solar.ghiUnit ?? ""}`.trim()),
  },
  {
    key: "karhutla",
    label: "Bahaya karhutla",
    group: "observations",
    term: "resilienceNeed",
    cell: (site) =>
      site.karhutla.rawClass === null
        ? absent("not_available")
        : present(`Kelas ${site.karhutla.rawClass}`, SCOPE_LABEL[site.karhutla.scope]),
  },
  {
    key: "karhutla_proxy",
    label: "Karhutla structural proxy",
    group: "observations",
    term: "karhutlaProxy",
    cell: (site) =>
      site.karhutlaProxy.value === null
        ? absent("not_available", "Rincian luas area kelas bahaya tidak tersedia")
        : present(
            formatScore(site.karhutlaProxy.value),
            "Proksi struktural tingkat kecamatan — tidak dipakai dalam skor",
          ),
  },
  {
    key: "drought",
    label: "Konteks kekeringan",
    group: "observations",
    cell: (site) =>
      site.drought.rawClass === null
        ? absent("not_available")
        : present(
            `Kelas ${site.drought.rawClass}`,
            "Konteks kabupaten — tidak membedakan antarsitus",
          ),
  },
  {
    key: "dimension_count",
    label: "Dimensi tersedia",
    group: "coverage",
    cell: (site) => present(`${site.availableDimensionCount} / 4`),
  },
  {
    key: "weight_fraction",
    label: "Available Weight",
    group: "coverage",
    term: "availableWeight",
    cell: (site) =>
      present(
        formatPercent(site.availableWeightFraction),
        "Kelengkapan bukti, bukan kualitas situs",
      ),
  },
  {
    key: "coverage_profile",
    label: "Coverage Profile",
    group: "coverage",
    term: "coverageProfile",
    cell: (site) =>
      present(
        site.coverageProfile
          .split("+")
          .map((key) => BASELINE_LABELS[key as DecisionDimension] ?? key)
          .join(" · "),
      ),
  },
  {
    key: "missing",
    label: "Dimensi yang hilang",
    group: "coverage",
    cell: (site) =>
      site.missingData.length === 0
        ? present("Tidak ada — keempat dimensi tersedia")
        : present(
            site.missingData.map((dimension) => BASELINE_LABELS[dimension]).join(", "),
          ),
  },
  {
    key: "recommendation",
    label: "Recommendation Type",
    group: "result",
    term: "needsVerification",
    cell: (site) => present(RECOMMENDATION_LABEL[site.recommendation.type]),
  },
  {
    key: "existing_plts",
    label: "Historical Existing PLTS Evidence",
    group: "context",
    cell: (site) =>
      site.existingPltsContext === null
        ? absent("not_applicable", "Tidak ada bukti PLTS historis tercatat")
        : present(
            site.existingPltsContext,
            site.evidenceInputs.existingAssetLinkEstablished
              ? "Keterkaitan dengan fasilitas ini telah ditetapkan"
              : "Keterkaitan dengan fasilitas ini belum ditetapkan; status operasional kini belum diverifikasi",
          ),
  },
];
