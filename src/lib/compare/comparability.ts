/**
 * Whether a set of sites can be compared like for like.
 *
 * The product never publishes a "best site" or a global rank across sites
 * whose scores rest on different evidence. This module is where that judgement
 * is made, once, for every screen that needs it.
 */
import type { Site } from "@/types";

export interface Comparability {
  /** True when every selected site shares one coverage profile. */
  readonly sameCoverageProfile: boolean;
  readonly profiles: readonly string[];
  /** True only when comparable AND every site carries a full baseline. */
  readonly globallyRankable: boolean;
  /** True when at least one site still needs data verification. */
  readonly anyNeedsVerification: boolean;
  /**
   * Whether a "higher provisional score" note may be shown at all.
   *
   * Requires a shared coverage profile. Even then the note is phrased as a
   * provisional comparison with its caveats, never as a winner.
   */
  readonly mayHighlightHigherScore: boolean;
  readonly warning: string | null;
}

export function assessComparability(sites: readonly Site[]): Comparability {
  const profiles = [...new Set(sites.map((site) => site.coverageProfile))].sort();
  const sameCoverageProfile = profiles.length <= 1;
  const anyNeedsVerification = sites.some(
    (site) => site.recommendation.type === "NEEDS_DATA_VERIFICATION",
  );

  return {
    sameCoverageProfile,
    profiles,
    globallyRankable:
      sameCoverageProfile && sites.every((site) => site.globalRankEligible),
    anyNeedsVerification,
    mayHighlightHigherScore: sameCoverageProfile,
    warning: sameCoverageProfile
      ? null
      : "Nilai tidak sepenuhnya sebanding karena kelengkapan dimensinya berbeda.",
  };
}
