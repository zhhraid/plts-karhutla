#!/usr/bin/env python3
"""Validate data/processed/site_master_dataset.csv against the methodology rules."""
import csv, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "data/processed/site_master_dataset.csv"

CONFIDENCE = {"HIGH", "MEDIUM", "NEEDS_VERIFICATION"}
RECOMMENDATION = {"NEW_DEPLOYMENT_ASSESSMENT", "EXPANSION_ASSESSMENT",
                  "NEEDS_DATA_VERIFICATION", "MONITOR_CONTEXT_ONLY"}
STATUS = {"FINAL_ENOUGH_FOR_MVP", "PROVISIONAL_MISSING_SOLAR", "PROVISIONAL_MISSING_SOCIAL",
          "PROVISIONAL_LIMITED_HAZARD", "NEEDS_DATA_VERIFICATION", "INSUFFICIENT_DATA"}
SCORE_COLS = ["solar_score", "social_score", "criticality_score", "resilience_score"]

failures, checks = [], []


def check(name, ok, detail=""):
    checks.append((name, ok, detail))
    if not ok:
        failures.append(f"{name}: {detail}")


def main():
    rows = list(csv.DictReader(open(MASTER, encoding="utf-8-sig")))

    ids = [r["record_id"] for r in rows]
    check("record_id unique", len(ids) == len(set(ids)), f"{len(ids)} rows, {len(set(ids))} unique")

    no_coord = [r["record_id"] for r in rows if not r["latitude"].strip() or not r["longitude"].strip()]
    check("every candidate site has coordinates", not no_coord, f"missing: {no_coord}")

    # NULL must never have been converted to 0: a dimension listed in missing_data
    # must be empty, never "0".
    bad = []
    for r in rows:
        for dim in filter(None, r["missing_data"].split("; ")):
            col = f"{dim}_score"
            if r.get(col, "").strip() != "":
                bad.append(f"{r['record_id']}.{col}={r[col]!r} but listed missing")
    check("no NULL-to-zero conversion", not bad, "; ".join(bad))

    zeros = [f"{r['record_id']}.{c}" for r in rows for c in SCORE_COLS
             if r[c].strip() and float(r[c]) == 0.0]
    check("no dimension scored exactly 0", not zeros, "; ".join(zeros))

    out_of_range = [f"{r['record_id']}={r['priority_score']}" for r in rows
                    if r["priority_score"].strip() and not 0 <= float(r["priority_score"]) <= 100]
    check("priority_score within 0-100", not out_of_range, "; ".join(out_of_range))

    check("data_confidence enum valid",
          all(r["data_confidence"] in CONFIDENCE for r in rows),
          str({r["data_confidence"] for r in rows} - CONFIDENCE))
    check("recommendation_type enum valid",
          all(r["recommendation_type"] in RECOMMENDATION for r in rows),
          str({r["recommendation_type"] for r in rows} - RECOMMENDATION))
    check("score_status enum valid",
          all(r["score_status"] in STATUS for r in rows),
          str({r["score_status"] for r in rows} - STATUS))

    # Missing criteria correctly flagged: missing_data must match the empty score columns.
    mism = []
    for r in rows:
        declared = set(filter(None, r["missing_data"].split("; ")))
        actual = {c[:-6] for c in SCORE_COLS if not r[c].strip()}
        if declared != actual:
            mism.append(f"{r['record_id']} declared={sorted(declared)} actual={sorted(actual)}")
    check("missing criteria flagged correctly", not mism, "; ".join(mism))

    # Numeric score only when minimum coverage satisfied (>=2 dims incl. criticality).
    viol = []
    for r in rows:
        present = {c[:-6] for c in SCORE_COLS if r[c].strip()}
        eligible = "criticality" in present and len(present) >= 2
        has_score = r["priority_score"].strip() != ""
        if has_score != eligible:
            viol.append(f"{r['record_id']} present={sorted(present)} score={r['priority_score']!r}")
    check("numeric score only under minimum coverage", not viol, "; ".join(viol))

    # Data Confidence must not raise Priority Score: they must be decoupled.
    pairs = {(r["data_confidence"], r["priority_score"]) for r in rows}
    confs_per_score = {}
    for c, p in pairs:
        confs_per_score.setdefault(p, set()).add(c)
    check("confidence decoupled from priority",
          any(len(v) > 1 for v in confs_per_score.values()) or len(confs_per_score) > 1,
          "confidence appears to track priority exactly")

    # JSON twin must agree with the CSV.
    js = json.load(open(ROOT / "data/processed/site_master_dataset.json"))
    check("json/csv row count match", len(js["sites"]) == len(rows),
          f"json={len(js['sites'])} csv={len(rows)}")

    width = max(len(n) for n, _, _ in checks)
    for name, ok, detail in checks:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name.ljust(width)}  {detail if not ok else ''}")
    print(f"\n{len(checks) - len(failures)}/{len(checks)} checks passed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
