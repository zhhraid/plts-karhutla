/**
 * Methodology constants.
 *
 * These mirror `scripts/build_master_dataset.py` exactly. They are documented
 * MVP design assumptions, not expert-validated values — see
 * docs/DECISION_METHODOLOGY.md §5 and docs/SCORING_FORMULA.md §1.
 *
 * Duplicating constants across two languages is a real drift risk. It is
 * contained by src/lib/scoring/__tests__/parity.test.ts, which recomputes the
 * whole published dataset with this engine and fails if any value disagrees
 * with what the Python pipeline wrote.
 */
import type { DecisionDimension, FacilityType } from "@/types";

export const BASELINE_WEIGHTS: Readonly<Record<DecisionDimension, number>> = {
  solar: 30,
  social: 25,
  criticality: 20,
  resilience: 25,
};

export const CRITICALITY_BY_TYPE: Readonly<Record<FacilityType, number>> = {
  Puskesmas: 100,
  Sekolah: 70,
};

export const HAZARD_CLASS_SCORE: Readonly<Record<string, number>> = {
  Rendah: 33,
  Sedang: 67,
  Tinggi: 100,
};

/**
 * Floor for the social normalisation.
 *
 * Without it the smallest measured cohort normalises to exactly 0, which in a
 * weighted sum is indistinguishable from "no data" — the precise confusion the
 * NULL-never-zero rule exists to prevent.
 */
export const SOCIAL_FLOOR = 10;

/** A numeric Priority Score is published only above this coverage. */
export const MIN_DIMENSIONS = 2;
export const REQUIRED_DIMENSION: DecisionDimension = "criticality";

export const CONFIDENCE_MAX_POINTS = 8;
export const CONFIDENCE_HIGH_THRESHOLD = 6;
export const CONFIDENCE_MEDIUM_THRESHOLD = 4;

/** Display bands over the Priority Score. Not a fifth criterion. */
export const PRIORITY_BAND_THRESHOLDS = { high: 75, medium: 50 } as const;
