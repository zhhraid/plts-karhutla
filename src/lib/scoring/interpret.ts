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
 * Dense ranking WITHIN one coverage cohort.
 *
 * Scores renormalised over different sets of dimensions rest on different
 * evidence bases, so a single ordinal across the whole set would assert a
 * precedence the data cannot support. Ranks are therefore issued per coverage
 * profile, and `rankScope` names the cohort a rank is valid inside.
 *
 * Tied scores share a rank: several sites in this dataset tie exactly, and
 * breaking a tie by list order would invent a precedence too.
 */
export interface RankedSite {
  readonly site: Site;
  /** Rank inside this site's coverage cohort. `null` when unscored. */
  readonly rank: number | null;
  readonly tied: boolean;
  /** The coverage profile the rank is valid within. */
  readonly rankScope: string;
  /** True only when every site in the set shares one profile AND that profile
   *  covers the full baseline — the only case where a rank is global. */
  readonly globalRank: boolean;
}

export interface CoverageCohort {
  readonly profile: string;
  readonly availableDimensionCount: number;
  readonly availableWeightFraction: number;
  readonly ranked: readonly RankedSite[];
}

function denseRank(
  sites: readonly Site[],
  rankScope: string,
  globalRank: boolean,
): readonly RankedSite[] {
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
      return { site, rank: null, tied: false, rankScope, globalRank };
    }
    if (previous === null || site.priorityScore !== previous) {
      rank += 1;
      previous = site.priorityScore;
    }
    return {
      site,
      rank,
      tied: (counts.get(site.priorityScore) ?? 0) > 1,
      rankScope,
      globalRank,
    };
  });
}

/**
 * Groups sites into coverage cohorts and ranks inside each.
 *
 * Cohorts are ordered by how much of the baseline they cover, strongest
 * evidence base first, so the most complete comparison appears at the top.
 */
export function rankSitesByCoverage(
  sites: readonly Site[],
): readonly CoverageCohort[] {
  const groups = new Map<string, Site[]>();
  for (const site of sites) {
    const bucket = groups.get(site.coverageProfile) ?? [];
    bucket.push(site);
    groups.set(site.coverageProfile, bucket);
  }

  const singleCohort = groups.size === 1;

  return [...groups.entries()]
    .map(([profile, members]) => {
      const first = members[0] as Site;
      return {
        profile,
        availableDimensionCount: first.availableDimensionCount,
        availableWeightFraction: first.availableWeightFraction,
        ranked: denseRank(
          members,
          profile,
          singleCohort && members.every((site) => site.globalRankEligible),
        ),
      };
    })
    .sort(
      (a, b) =>
        b.availableWeightFraction - a.availableWeightFraction ||
        a.profile.localeCompare(b.profile),
    );
}

/**
 * Whether a single ranking over this set would be defensible.
 *
 * Requires one shared coverage profile AND full baseline coverage. Anything
 * less and the ordinal would compare scores built on different evidence.
 */
export function isGloballyRankable(sites: readonly Site[]): boolean {
  if (sites.length === 0) return false;
  const profiles = new Set(sites.map((site) => site.coverageProfile));
  return profiles.size === 1 && sites.every((site) => site.globalRankEligible);
}
