# Solar & Hazard Acquisition Report — Prompt 3

**Acquisition snapshot:** 2026-09-14

**Final validation:** 2026-09-15

**Status:** `PASS_WITH_LIMITATIONS` — `WAITING_FOR_EXTERNAL_SOLAR_HAZARD_PACKAGE`

## Scope and result

The candidate allowlist contains 10 facilities: EDU-001 through EDU-007 and HLT-001 through HLT-003. All coordinates are `official_exact`; no identity-only health record and no administrative centroid is used. The three health coordinates come from a 2021 Dinkes dataset and retain that historical year. Official administrative point-in-polygon validation remains pending.

No external solar/hazard value package exists under `data/raw/external_manual/<date>/`. Therefore:

| Dataset | Required structure | Values acquired | Status |
|---|---:|---:|---|
| GHI | 10 site rows | 0/10 | `requires_external_acquisition` |
| Karhutla hazard | 10 site rows | 0/10 | `requires_external_acquisition` |
| Kekeringan hazard | 10 site rows | 0/10 | `requires_external_acquisition` |

All missing values are empty CSV fields, never zero or dummy values. Each row has a specific `why_null`. No normalization, class conversion, solar/resilience score, or ranking was performed.

## Solar source policy

Global Solar Atlas is the primary spatial screening source. GHI must be recorded in the source's original unit with the exact dataset/version, spatial resolution, temporal coverage, extraction method, and retrieval date. NASA POWER may only support time-series or a rough cross-check; it is not the primary spatial discriminator among the Kubu Raya sites.

The Global Solar Atlas license is **Creative Commons Attribution 4.0 International / CC BY 4.0**, verified by `external_manual_verification` through the Prompt 3 handoff. Attribution must mention **Global Solar Atlas 2.0, World Bank Group, ESMAP, and Solargis**. License verification does not verify any point value. No Global Solar Atlas raster is stored or tracked; the MVP may store derived point values only.

## Hazard source policy

InaRISK / BNPB is the primary source. The requested metric is `hazard` for `karhutla` and `kekeringan`. Risk layers may be used only as a documented fallback and must remain a separate `metric_type = risk` series. Hazard and risk must never be merged into one column or comparison series. Raw classes remain source text; no Rendah/Sedang/Tinggi-to-number conversion is allowed.

The source capability handoff identifies these candidates:

- hazard: `INDEKS_BAHAYA_KARHUTLA`, `INDEKS_BAHAYA_KEKERINGAN`, `layer_bahaya_kebakaran_hutan_dan_lahan`, `layer_bahaya_kekeringan`;
- risk: `layer_risiko_kebakaran_hutan_dan_lahan`, `layer_risiko_kekeringan`.

During this pass the agent could read the InaRISK directory and metadata for the two `INDEKS_BAHAYA_*` ImageServers, but point identification failed. Service-wide statistics are not site observations and were not imported. Dataset year, legend, and site values remain unresolved. IRBI district values and daily hotspots are excluded from the structural per-site dataset.

## External package readiness

[EXTERNAL_SOLAR_HAZARD_REQUESTS.md](EXTERNAL_SOLAR_HAZARD_REQUESTS.md) is ready to execute and includes every site's record ID, name, exact WGS84 coordinates, requested parameters/layers, preferred metric type, expected headers, destination paths, checksum requirement, and import validation rules. A package must be preserved byte-for-byte in a dated raw directory and pass record, coordinate, schema, numeric, metric, provenance, and license checks before interim import.

The gate remains limited because 0 of 10 sites currently has the complete GHI + karhutla + kekeringan value set. The limitation is acquisition, not candidate identity or schema readiness.

## Binding caveats for Prompt 4

- Methodology may be designed with explicit missing-data handling, but final scoring/ranking cannot claim complete spatial evidence yet.
- The same set of at least 8 sites must eventually have GHI, karhutla, and kekeringan; unrelated partial site sets do not satisfy the full gate.
- Health point extraction would use historical 2021 facility coordinates until a newer official point source is provided.
- Raster redistribution is outside the MVP repository policy even though the license is verified.

Validation details are recorded in `research/PROMPT_3_VALIDATION.json` and source-access evidence in `research/PROMPT_3_SOURCE_ACCESS_AUDIT.md`.
