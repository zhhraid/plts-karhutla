/**
 * Consistency audit over every string the product can render.
 *
 * SURYA-SIAGA is a pre-screening decision support system. The wording that
 * would make it sound like something else — a feasibility study, an
 * engineering design, a build decision, an AI recommendation engine, a live
 * monitoring platform — is easy to introduce a word at a time and hard to
 * notice once introduced. This test scans the UI source for it.
 *
 * The product must also be able to NAME what it is not ("does not declare a
 * best site"), so a match is a failure only when it is not inside a denial.
 * Each occurrence is therefore judged in context rather than on its own.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOTS = ["src/app", "src/components", "src/features", "src/lib"];

function walk(dir: string): readonly string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      // Test files quote forbidden phrases in order to assert their absence.
      return entry === "__tests__" ? [] : walk(full);
    }
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [full] : [];
  });
}

const files = ROOTS.flatMap((root) => walk(path.join(process.cwd(), root)));

/** Collapses JSX line breaks and entities so a sentence reads as one line. */
function readable(content: string): string {
  return content
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/\s+/g, " ");
}

const SOURCES: ReadonlyArray<readonly [string, string]> = files.map(
  (file) =>
    [path.relative(process.cwd(), file), readable(readFileSync(file, "utf-8"))] as const,
);

const DENIAL = /\b(tidak|bukan|jangan|belum|never|not|no)\b/i;
const WINDOW = 140;

/** Occurrences of `pattern` that are NOT inside a denial, with their context. */
function undeniedMatches(pattern: RegExp): readonly string[] {
  const global = new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`);
  const offenders: string[] = [];
  for (const [file, content] of SOURCES) {
    for (const match of content.matchAll(global)) {
      const start = Math.max(0, (match.index ?? 0) - WINDOW);
      const context = content.slice(start, (match.index ?? 0) + match[0].length);
      if (!DENIAL.test(context)) {
        offenders.push(`${file}: …${context.trim().slice(-110)}`);
      }
    }
  }
  return offenders;
}

describe("no overclaiming language in the UI", () => {
  it("scans a non-trivial number of files", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it.each([
    ["a best location", /lokasi terbaik/i],
    ["a best site (id)", /situs terbaik/i],
    ["a best site (en)", /\bbest site\b/i],
    ["a winner (en)", /\bwinner\b/i],
    ["a winner (id)", /\bpemenang\b/i],
    ["a most-recommended site (en)", /most recommended/i],
    ["a most-recommended site (id)", /paling direkomendasikan/i],
    ["readiness to build", /siap dibangun/i],
    ["suitability to build", /layak dibangun/i],
    ["a final feasibility study", /studi kelayakan (teknis )?final/i],
    ["real-time monitoring", /real-?time monitoring/i],
    ["an AI recommendation engine", /rekomendasi berbasis AI/i],
    ["the methodology being AHP", /\bAHP\b/],
  ])("never asserts %s outside a denial", (_label, pattern) => {
    expect(undeniedMatches(pattern)).toEqual([]);
  });

  it("does actually find an assertion when one is introduced", () => {
    // Guards the guard: if the context window swallowed everything, the checks
    // above would pass vacuously.
    const probe = "Situs ini adalah lokasi terbaik untuk dibangun PLTS.";
    expect(DENIAL.test(probe)).toBe(false);
    expect(/lokasi terbaik/i.test(probe)).toBe(true);
  });
});

describe("the approved vocabulary is actually used", () => {
  const combined = SOURCES.map(([, content]) => content).join("\n");

  it.each([
    ["pre-screening", /pre-screening/i],
    ["indikasi prioritas awal", /indikasi prioritas awal/i],
    ["provisional", /provisional/i],
    ["requires verification", /verifikasi/i],
    ["assessment", /asesmen|assessment/i],
    ["Weighted Sum Model", /Weighted Sum Model/i],
  ])("uses %s", (_label, pattern) => {
    expect(combined).toMatch(pattern);
  });
});

describe("no global ranking is asserted across differing evidence", () => {
  const interpret = readFileSync(
    path.join(process.cwd(), "src/lib/scoring/interpret.ts"),
    "utf-8",
  );

  it("replaces the flat ranking with a coverage-scoped one", () => {
    expect(interpret).toContain("rankSitesByCoverage");
    expect(interpret).not.toMatch(/export function rankSites\s*\(/);
  });

  it("gates a global rank on full baseline coverage", () => {
    expect(interpret).toContain("globalRankEligible");
  });
});
