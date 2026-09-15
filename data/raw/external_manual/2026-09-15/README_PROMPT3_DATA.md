# SURYA-SIAGA Prompt 3 External Data Package

Generated: 2026-09-15

Files:
- solar_observations_external.csv
- hazard_observations_external.csv
- prompt3_external_source_register.csv
- prompt3_master_external.csv

Important integrity notes:
1. No exact Global Solar Atlas site GHI value was fabricated. The official GSA source, resolution, unit convention, license, and target coordinates are populated, but ghi_value remains NULL until an actual raster/site extraction is possible.
2. Karhutla values are a district-level structural hazard proxy from Wijaya, Akbar & Romiyanto (2024), Table 10, processed data 2023. The source provides district class plus low/medium/high hazard area.
3. Drought is only regency-level context from a secondary copy of KRB Kubu Raya 2026-2030. It must not be used as a site-level ranking variable. Exact InaRISK point values remain pending.
4. InaRISK official ImageServer capability is verified, including the relevant karhutla and drought services, but this runtime could not submit point Identify/Get Samples requests.
5. Existing PLTS evidence is historical (December 2021) for Sumber Agung, Sungai Kerawang, and Muara Tiga. Do not infer current operating status, capacity, or commissioning year.
6. Missing beneficiary or GHI must never be treated as zero.

Recommended next step:
- Import this package as external_manual/external_web research with the scope flags preserved.
- Prompt 4 may proceed in READY_WITH_LIMITATIONS mode.
- Scoring methodology must either exclude GHI until exact point values arrive, or compute a provisional score without solar and reduce Data Confidence. Do not invent a GHI score.
