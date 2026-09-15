/**
 * Parity between the TypeScript engine and the Python pipeline.
 *
 * Two implementations of one methodology is a standing drift risk. This test
 * is what contains it: it recomputes every published record with the engine in
 * this repository and fails if any value disagrees with what
 * scripts/build_master_dataset.py actually wrote.
 *
 * If this test fails, one of the two implementations has changed and the other
 * has not. Do not adjust an expectation to make it pass — reconcile the
 * implementations, and check docs/SCORING_FORMULA.md still describes both.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  calculateCriticalityScore,
  calculateDataConfidence,
  calculatePriorityScore,
  calculateResilienceScore,
  calculateSocialScore,
  calculateSolarScore,
  determineRecommendation,
  generateReasonFactors,
} from "@/lib/scoring/engine";
import type { RawDataset, RawSite } from "@/lib/data/normalise";

const dataset = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "public", "data", "site_master_dataset.json"),
    "utf-8",
  ),
) as RawDataset;

const sites: readonly RawSite[] = dataset.sites;

/** The canonical beneficiary cohort, exactly as the pipeline normalises over. */
const cohort = sites.map((site) => site.beneficiary_value);

function recompute(site: RawSite) {
  const dimensions = {
    solar: calculateSolarScore(site.ghi_value),
    social: calculateSocialScore(site.beneficiary_value, cohort),
    criticality: calculateCriticalityScore(site.facility_type),
    resilience: calculateResilienceScore(
      site.karhutla_class,
      site.karhutla_scoring_eligibility,
    ),
  };
  return { dimensions, priority: calculatePriorityScore(dimensions) };
}

describe("engine reproduces the published dataset", () => {
  it("has records to check", () => {
    expect(sites.length).toBeGreaterThan(0);
  });

  it.each(sites.map((site) => [site.record_id, site] as const))(
    "%s — priority score, status and coverage",
    (_id, site) => {
      const { priority } = recompute(site);
      expect(priority.value).toBe(site.priority_score);
      expect(priority.status).toBe(site.score_status);
      expect(priority.coverage).toBeCloseTo(site.available_weight_fraction, 3);
    },
  );

  it.each(sites.map((site) => [site.record_id, site] as const))(
    "%s — per-dimension scores",
    (_id, site) => {
      const { dimensions } = recompute(site);
      expect(dimensions.solar).toBe(site.solar_score);
      expect(dimensions.criticality).toBe(site.criticality_score);
      expect(dimensions.resilience).toBe(site.resilience_score);
      if (site.social_score === null) {
        expect(dimensions.social).toBeNull();
      } else {
        expect(dimensions.social as number).toBeCloseTo(site.social_score, 2);
      }
    },
  );

  it.each(sites.map((site) => [site.record_id, site] as const))(
    "%s — data confidence level and points",
    (_id, site) => {
      const { priority } = recompute(site);
      const confidence = calculateDataConfidence({
        coordinateSourceDataYear: site.coordinate_source_data_year,
        beneficiaryVerificationStatus: site.beneficiary_verification_status,
        beneficiaryVarianceRecorded: site.beneficiary_variance_recorded,
        karhutlaScope: site.karhutla_scope,
        missingCriteria: priority.missingCriteria,
      });
      expect(confidence.level).toBe(site.data_confidence);
      expect(confidence.points).toBe(site.confidence_points);
    },
  );

  it.each(sites.map((site) => [site.record_id, site] as const))(
    "%s — recommendation type",
    (_id, site) => {
      const { priority } = recompute(site);
      const recommendation = determineRecommendation({
        hasLinkedExistingAsset: site.existing_asset_linked,
        assetLinkIsEstablished: site.existing_asset_link_established,
        linkedAssetVillage: site.existing_asset_village,
        missingCriteria: priority.missingCriteria,
      });
      expect(recommendation.type).toBe(site.recommendation_type);
      expect(recommendation.reason).toBe(site.recommendation_reason);
    },
  );

  it.each(sites.map((site) => [site.record_id, site] as const))(
    "%s — explanation factors",
    (_id, site) => {
      const { dimensions } = recompute(site);
      const factors = generateReasonFactors({
        dimensions,
        beneficiaryValue: site.beneficiary_value,
        coordinateSourceDataYear: site.coordinate_source_data_year,
        districtHasHistoricalPlts:
          site.existing_plts_context.length > 0 && !site.existing_asset_linked,
      });
      expect(factors.positive.join("; ")).toBe(site.top_positive_factors);
      expect(factors.limitations.join("; ")).toBe(site.limitations);
    },
  );
});

describe("published dataset honours the integrity rules", () => {
  it("never publishes a dimension scored exactly 0", () => {
    for (const site of sites) {
      for (const key of ["solar_score", "social_score", "criticality_score", "resilience_score"] as const) {
        expect(site[key]).not.toBe(0);
      }
    }
  });

  it("lists a dimension in missing_data exactly when its score is null", () => {
    for (const site of sites) {
      const listed = new Set(
        site.missing_data.split(";").map((part) => part.trim()).filter(Boolean),
      );
      const nulls = (
        [
          ["solar", site.solar_score],
          ["social", site.social_score],
          ["criticality", site.criticality_score],
          ["resilience", site.resilience_score],
        ] as const
      )
        .filter(([, value]) => value === null)
        .map(([name]) => name);
      expect([...listed].sort()).toEqual([...nulls].sort());
    }
  });

  it("keeps confidence decoupled from priority across the dataset", () => {
    // If confidence tracked the score, the highest-scoring site would not be
    // able to share a confidence level with a much lower-scoring one.
    const byLevel = new Map<string, number[]>();
    for (const site of sites) {
      if (site.priority_score === null) continue;
      const bucket = byLevel.get(site.data_confidence) ?? [];
      bucket.push(site.priority_score);
      byLevel.set(site.data_confidence, bucket);
    }
    const spreads = [...byLevel.values()]
      .filter((scores) => scores.length > 1)
      .map((scores) => Math.max(...scores) - Math.min(...scores));
    expect(Math.max(...spreads)).toBeGreaterThan(10);
  });
});
