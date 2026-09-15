/**
 * Structural integrity checks over a decoded dataset.
 *
 * The Python validator already guards the pipeline. This is the application's
 * own last line: it protects against a dataset that was hand-edited, partially
 * written, or served from a stale deployment. A record that fails here is
 * withheld, never displayed with a plausible-looking wrong value.
 */
import type { RawSite } from "@/lib/data/normalise";

export interface IntegrityIssue {
  readonly recordId: string;
  readonly field: string;
  readonly problem: string;
}

/**
 * Returns every problem found, rather than throwing on the first.
 *
 * A caller fixing a broken dataset needs the whole list; failing fast would
 * make them rediscover the same file one error at a time.
 */
export function findIntegrityIssues(
  records: readonly RawSite[],
): readonly IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const seen = new Set<string>();

  for (const record of records) {
    const id = record.record_id;

    if (typeof id !== "string" || id.trim().length === 0) {
      issues.push({
        recordId: "(kosong)",
        field: "record_id",
        problem: "record_id kosong atau bukan string",
      });
      continue;
    }
    if (seen.has(id)) {
      issues.push({
        recordId: id,
        field: "record_id",
        problem: "record_id duplikat",
      });
    }
    seen.add(id);

    // A site without coordinates cannot be mapped and must not be ranked as
    // though its location were known.
    for (const [field, value, min, max] of [
      ["latitude", record.latitude, -90, 90],
      ["longitude", record.longitude, -180, 180],
    ] as const) {
      if (typeof value !== "number" || Number.isNaN(value)) {
        issues.push({ recordId: id, field, problem: "koordinat tidak tersedia" });
      } else if (value < min || value > max) {
        issues.push({
          recordId: id,
          field,
          problem: `koordinat di luar rentang sah (${min}..${max})`,
        });
      }
    }

    const score = record.priority_score;
    if (score !== null) {
      if (typeof score !== "number" || Number.isNaN(score)) {
        issues.push({
          recordId: id,
          field: "priority_score",
          problem: "skor bukan angka dan bukan null",
        });
      } else if (score < 0 || score > 100) {
        issues.push({
          recordId: id,
          field: "priority_score",
          problem: "skor di luar rentang 0-100",
        });
      }
    }

    // The NULL-never-zero rule, checked at the boundary: `missing_data` must
    // agree with the empty score columns. A dimension listed as missing while
    // carrying a number — or scored while listed as missing — means the two
    // halves of the record disagree about what is known.
    const declaredMissing = new Set(
      (record.missing_data ?? "")
        .split(";")
        .map((part) => part.trim())
        .filter((part) => part.length > 0),
    );
    const actual: Record<string, number | null> = {
      solar: record.solar_score,
      social: record.social_score,
      criticality: record.criticality_score,
      resilience: record.resilience_score,
    };
    for (const [dimension, value] of Object.entries(actual)) {
      const listed = declaredMissing.has(dimension);
      if (listed && value !== null) {
        issues.push({
          recordId: id,
          field: `${dimension}_score`,
          problem: "tercatat hilang tetapi memiliki nilai",
        });
      }
      if (!listed && value === null) {
        issues.push({
          recordId: id,
          field: `${dimension}_score`,
          problem: "bernilai null tetapi tidak tercatat di missing_data",
        });
      }
    }
  }

  return issues;
}

export function assertDatasetIntegrity(records: readonly RawSite[]): void {
  const issues = findIntegrityIssues(records);
  if (issues.length === 0) return;
  const detail = issues
    .map((issue) => `  ${issue.recordId} · ${issue.field}: ${issue.problem}`)
    .join("\n");
  throw new Error(
    `Dataset ditolak — ${issues.length} masalah integritas:\n${detail}\n` +
      "Jalankan `npm run data:build` untuk membangun ulang dari data interim.",
  );
}
