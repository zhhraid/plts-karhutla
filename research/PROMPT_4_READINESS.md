# Prompt 4 Readiness

**Status:** `READY_WITH_LIMITATIONS`

**Reason code:** `WAITING_FOR_EXTERNAL_SOLAR_HAZARD_PACKAGE`

**Validated:** 2026-09-15 against acquisition snapshot 2026-09-14

## Decision basis

The candidate pool is stable at 10 facilities and all 10 have traceable `official_exact` coordinates. Beneficiary acquisition is frozen: four candidates have dated canonical student counts and six have documented canonical NULL. The dataset has clear schemas, per-field provenance, raw-package checksums, documented conflicts/variance, and no fabricated values.

However, no site currently has a GHI, karhutla, or kekeringan value. The full readiness rule requires at least 8 of the same 10 targets to have identity, coordinate, beneficiary or documented NULL, all three spatial observations, and source provenance. Current result: **0/10**.

| Readiness criterion | Result |
|---|---|
| Candidate pool clear | PASS — 10-site allowlist |
| Facility coordinates usable | PASS — 10/10 `official_exact` |
| Beneficiary stable | PASS WITH DOCUMENTED LIMITATION — 4 available, 6 documented NULL |
| Solar GHI available | FAIL FOR FULL READINESS — 0/10 |
| Karhutla available | FAIL FOR FULL READINESS — 0/10 |
| Kekeringan available | FAIL FOR FULL READINESS — 0/10 |
| External request usable | PASS |
| Main data auditable | PASS |

## Allowed Prompt 4 scope

Prompt 4 may design methodology, criteria definitions, treatment of documented NULL, metric separation, and caveats. It must not present final normalized values, AHP/MCDA results, Priority Scores, final Data Confidence categories, or candidate rankings from the incomplete spatial dataset.

## Condition to upgrade

Import and audit an external package that supplies GSA GHI plus InaRISK karhutla and kekeringan for at least 8 matching candidate sites, with exact record IDs/coordinates, original units/classes, dataset period/year, extraction method, retrieval date, source URLs, and verification metadata. Re-run the quality matrix and this readiness decision after import.

## Prompt 3.1 handoff status

The external extraction bundle is ready in `data/external_requests/`: 10 validated target sites, a solar template, a hazard template, and researcher instructions. External values are still required, so readiness remains `READY_WITH_LIMITATIONS` with the same reason code.

Once `solar_observations_external.csv` and `hazard_observations_external.csv` are completed and returned with extraction notes and checksums, the repository is ready to run the Prompt 3.2 import draft. Preparing this bundle does not increase GHI or hazard coverage and does not authorize scoring or normalization.
