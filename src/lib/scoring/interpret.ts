/**
 * Interpretation helpers over an already-computed score.
 *
 * Scoring itself happens once, in scripts/build_master_dataset.py. Nothing here
 * recomputes a Priority Score: a second implementation would be a second source
 * of truth, and the two would eventually disagree.
 */
import type {
  DataConfidenceLevel,
  PriorityBand,
  RecommendationType,
  ScoreStatus,
  Site,
} from "@/types";

export const PRIORITY_BAND_LABEL: Readonly<Record<PriorityBand, string>> = {
  HIGH: "Prioritas Tinggi",
  MEDIUM: "Prioritas Menengah",
  LOW: "Prioritas Rendah",
  NEEDS_VERIFICATION: "Belum Dapat Diperingkat",
};

export const CONFIDENCE_LABEL: Readonly<Record<DataConfidenceLevel, string>> = {
  HIGH: "Keyakinan Data Tinggi",
  MEDIUM: "Keyakinan Data Menengah",
  NEEDS_VERIFICATION: "Perlu Verifikasi Data",
};

export const SCORE_STATUS_LABEL: Readonly<Record<ScoreStatus, string>> = {
  FINAL_ENOUGH_FOR_MVP: "Lengkap untuk tahap pre-screening",
  PROVISIONAL_MISSING_SOLAR: "Provisional — data solar belum tersedia",
  PROVISIONAL_MISSING_SOCIAL: "Provisional — data sosial belum tersedia",
  PROVISIONAL_LIMITED_HAZARD: "Provisional — data bahaya terbatas",
  NEEDS_DATA_VERIFICATION: "Perlu verifikasi data",
  INSUFFICIENT_DATA: "Data tidak mencukupi untuk penilaian",
};

export const RECOMMENDATION_LABEL: Readonly<
  Record<RecommendationType, string>
> = {
  NEW_DEPLOYMENT_ASSESSMENT: "Kandidat Asesmen Deployment Baru",
  EXPANSION_ASSESSMENT: "Kandidat Asesmen Perluasan",
  NEEDS_DATA_VERIFICATION: "Perlu Verifikasi Data Lebih Dahulu",
  MONITOR_CONTEXT_ONLY: "Pantau — Konteks Saja",
};

/**
 * Whether two scores rest on the same evidence base.
 *
 * Scores renormalised over different sets of available dimensions are not
 * strictly comparable. The compare view must warn instead of ranking silently.
 */
export function sharesEvidenceBase(a: Site, b: Site): boolean {
  return (
    Math.abs(a.availableWeightFraction - b.availableWeightFraction) < 1e-9
  );
}

/** Sorts by score, highest first, with unscored sites always last. */
export function byPriorityDescending(a: Site, b: Site): number {
  if (a.priorityScore === null && b.priorityScore === null) {
    return a.recordId.localeCompare(b.recordId);
  }
  if (a.priorityScore === null) return 1;
  if (b.priorityScore === null) return -1;
  if (a.priorityScore !== b.priorityScore) {
    return b.priorityScore - a.priorityScore;
  }
  return a.recordId.localeCompare(b.recordId);
}

/**
 * Dense ranking, so tied scores share a rank.
 *
 * Several sites in this dataset tie exactly. Breaking a tie by list order would
 * invent a precedence the data does not support.
 */
export function rankSites(
  sites: readonly Site[],
): ReadonlyArray<{ site: Site; rank: number | null; tied: boolean }> {
  const ordered = [...sites].sort(byPriorityDescending);
  const counts = new Map<number, number>();
  for (const site of ordered) {
    if (site.priorityScore === null) continue;
    counts.set(site.priorityScore, (counts.get(site.priorityScore) ?? 0) + 1);
  }

  let rank = 0;
  let previous: number | null = null;
  return ordered.map((site) => {
    if (site.priorityScore === null) {
      return { site, rank: null, tied: false };
    }
    if (previous === null || site.priorityScore !== previous) {
      rank += 1;
      previous = site.priorityScore;
    }
    return {
      site,
      rank,
      tied: (counts.get(site.priorityScore) ?? 0) > 1,
    };
  });
}
