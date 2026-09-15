/**
 * Deterministic comparison insights.
 *
 * Rule-based, generated at render time from values that are actually present.
 * There is no model in this path: every sentence below traces to a specific
 * comparison over specific non-null fields.
 *
 * Two rules govern the whole module:
 *
 * 1. No statement is ever produced from a NULL. A missing value yields either
 *    an explicit "not available" observation or no statement at all — never an
 *    implied low value.
 * 2. No statement names a winner, a best site, or a recommendation, and none
 *    is produced at all where the evidence bases differ, beyond the
 *    comparability warning itself.
 */
import { assessComparability } from "@/lib/compare/comparability";
import { formatNumber, formatScore } from "@/lib/formatting";
import { BASELINE_LABELS } from "@/lib/scoring/dimensions";
import type { Site } from "@/types";

export type InsightKind =
  | "comparability"
  | "observation"
  | "gap"
  | "provisional_score";

export interface Insight {
  readonly kind: InsightKind;
  readonly text: string;
}

function bySocialThenName(a: Site, b: Site): number {
  return (
    (b.beneficiary.value ?? 0) - (a.beneficiary.value ?? 0) ||
    a.facilityName.localeCompare(b.facilityName, "id-ID")
  );
}

export function buildInsights(sites: readonly Site[]): readonly Insight[] {
  if (sites.length < 2) return [];

  const insights: Insight[] = [];
  const comparability = assessComparability(sites);

  // 1. Comparability comes first: it frames everything that follows.
  if (comparability.warning !== null) {
    insights.push({
      kind: "comparability",
      text: `${comparability.warning} Profil cakupan yang dibandingkan: ${comparability.profiles
        .map((profile) => profile.split("+").length + "/4 dimensi")
        .join(" dan ")}.`,
    });
  }

  // 2. Beneficiary comparison, only between sites that BOTH have a value.
  const withBeneficiary = sites
    .filter((site) => site.beneficiary.value !== null)
    .sort(bySocialThenName);
  if (withBeneficiary.length >= 2) {
    const top = withBeneficiary[0] as Site;
    const bottom = withBeneficiary[withBeneficiary.length - 1] as Site;
    if ((top.beneficiary.value ?? 0) > (bottom.beneficiary.value ?? 0)) {
      insights.push({
        kind: "observation",
        text: `${top.facilityName} memiliki penerima manfaat terverifikasi lebih besar (${formatNumber(top.beneficiary.value)} ${top.beneficiary.unit}) dibanding ${bottom.facilityName} (${formatNumber(bottom.beneficiary.value)}).`,
      });
    }
  }

  // 3. Criticality, paired with what is missing at that same site. A higher
  //    criticality baseline means little if the social evidence is absent, and
  //    stating only the first half would be a half-truth.
  const criticality = sites
    .filter((site) => site.breakdown.some((row) => row.dimension === "criticality" && row.available))
    .map((site) => ({
      site,
      score:
        site.breakdown.find((row) => row.dimension === "criticality")?.score ?? null,
    }))
    .filter((entry): entry is { site: Site; score: number } => entry.score !== null);

  if (criticality.length >= 2) {
    const sorted = [...criticality].sort(
      (a, b) => b.score - a.score || a.site.facilityName.localeCompare(b.site.facilityName, "id-ID"),
    );
    const highest = sorted[0] as { site: Site; score: number };
    const lowest = sorted[sorted.length - 1] as { site: Site; score: number };
    if (highest.score > lowest.score) {
      const missingHere = highest.site.beneficiary.value === null;
      insights.push({
        kind: missingHere ? "gap" : "observation",
        text: missingHere
          ? `${highest.site.facilityName} memiliki criticality baseline lebih tinggi (${formatScore(highest.score)} vs ${formatScore(lowest.score)}), namun penerima manfaat site-level belum tersedia untuk situs tersebut.`
          : `${highest.site.facilityName} memiliki criticality baseline lebih tinggi (${formatScore(highest.score)}) dibanding ${lowest.site.facilityName} (${formatScore(lowest.score)}).`,
      });
    }
  }

  // 4. Name each missing dimension explicitly, per site. Silence about a gap
  //    reads as absence of a gap.
  for (const site of sites) {
    if (site.missingData.length === 0) continue;
    insights.push({
      kind: "gap",
      text: `${site.facilityName} belum memiliki data untuk ${site.missingData
        .map((dimension) => BASELINE_LABELS[dimension])
        .join(" dan ")}, sehingga dimensi tersebut tidak ikut dinilai.`,
    });
  }

  // 5. Spatial proxy disclosure, stated once for the set rather than repeated
  //    per site.
  const proxied = sites.filter((site) => site.karhutla.scope === "kecamatan_proxy");
  if (proxied.length > 0) {
    insights.push({
      kind: "gap",
      text:
        proxied.length === sites.length
          ? "Bahaya karhutla pada seluruh situs yang dibandingkan memakai proksi struktural tingkat kecamatan, bukan nilai di titik fasilitas."
          : `Bahaya karhutla pada ${proxied.length} dari ${sites.length} situs memakai proksi struktural tingkat kecamatan, bukan nilai di titik fasilitas.`,
    });
  }

  // 6. A score comparison is offered ONLY within one coverage profile, and
  //    only as a provisional observation carrying its own caveat.
  if (comparability.mayHighlightHigherScore) {
    const scored = sites
      .filter((site) => site.priorityScore !== null)
      .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));
    const top = scored[0];
    const next = scored[1];
    if (top !== undefined && next !== undefined && top.priorityScore !== next.priorityScore) {
      insights.push({
        kind: "provisional_score",
        text: `${top.facilityName} memiliki skor provisional lebih tinggi (${formatScore(top.priorityScore)} vs ${formatScore(next.priorityScore)}) atas profil cakupan yang sama. Ini indikasi prioritas awal, bukan penilaian bahwa situs tersebut lebih layak — keduanya masih ${comparability.anyNeedsVerification ? "memerlukan verifikasi data" : "bersifat provisional"}.`,
      });
    }
  }

  return insights;
}
