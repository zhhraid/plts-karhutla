# IMPORT_LOG — Interim / Canonical Layer

Log transformasi dari **raw immutable** ke **interim canonical**. Raw tidak pernah diedit; seluruh koreksi hanya terjadi di lapisan ini.

---

## 2026-09-15 — Prompt 3 final acquisition and readiness audit

| Item | Result |
|---|---|
| Candidate allowlist | EDU-001..007, HLT-001..003 (10) |
| Facility revalidation | PASS: IDs/NPSNs unique; 10/10 required target fields and `official_exact` coordinates valid |
| Identity-only rows | 20 retained in health dataset; excluded from candidate pool; no automatic merge |
| Beneficiary | Revalidated only; frozen CSV unchanged; 4 dated canonical + 6 documented NULL |
| Solar/hazard raw package | Not present; no import attempted |
| Solar interim | 10 NULL rows retained; license/provenance/request metadata added |
| Hazard interim | 20 NULL rows retained; requested hazard layer URLs and request metadata added |
| Existing PLTS | 3 historical village-level records created from EV-F + Prompt 3 handoff; unverified/current fields NULL |
| Quality matrix | 10 descriptive rows created; no score |
| License | GSA updated to CC BY 4.0 via `external_manual_verification`; raster storage remains prohibited by MVP policy |
| Raw immutability | Existing SHA-256 manifests rechecked against Git blobs: PASS. Windows worktree CRLF hashes differ bytewise as expected; LF-normalized content and Git blobs match manifests. No raw file edited. |

Transform notes: summary `verification_status` / `verification_method` fields were appended to facility CSVs for the mandatory minimum target schema. They summarize verified identity, district, and coordinate provenance and do not override field-level `*_vstatus`. `facility_type_vstatus` was added for education based on the already-preserved official raw facility type/level; no web re-verification was claimed.

`solar_observations.csv` and `hazard_observations.csv` distinguish request metadata from acquired-value metadata. Placeholder `retrieved_at`, value `verification_method`, units, periods, extraction methods, and values remain empty. `request_created_at` records the request date. Hazard `metric_type=hazard` denotes the requested primary metric while raw value/class remain NULL; a future risk fallback must use a separate risk series.

No normalization, AHP, MCDA, Priority Score, final Data Confidence, final ranking, or application code was produced.

---

## 2026-09-14 — Beneficiary reconciliation (Prompt 3B.2)

| Item | Nilai |
|---|---|
| Raw package | `data/raw/external_manual/2026-09-14/beneficiary_observations_external.csv` |
| Checksum raw | `e4d8f951775234ac663958c9d9406b409c097e8d7b82dfad011b7479a7c6d7aa` |
| Integritas raw pasca-transformasi | ✅ `sha256sum -c` OK — **raw tidak berubah** |
| Target interim | `data/interim/beneficiary_observations.csv` |
| Verification method | `external_manual_verification` (canonical values diverifikasi di environment lain) |

### Source policy yang dikunci

| Peran | Sumber |
|---|---|
| **PRIMARY CANONICAL** | Kemendikdasmen — Residu Data Induk Pendidikan, tabel `residu/pesertadidik/wilayah/...`, nilai "Jumlah Peserta Didik" — **hanya bila** NPSN cocok, nama sekolah cocok, dan **tanggal snapshot eksplisit** tersedia |
| **CROSS-CHECK** | `residu/satuanpendidikan/detail/<NPSN>` — **tidak menggantikan** canonical bila tidak punya reference date yang sebanding |

### Catatan interpretasi "Residu"

Istilah "Residu Data Induk Pendidikan" **tidak** berarti nilai `student_count` tidak valid. Dashboard menampilkan Data Induk Pendidikan beserta indikator residu/ketidakvalidan pada field tertentu (mis. Residu NISN, Residu Kependudukan, Residu Kode Wilayah) — indikator kualitas yang **terpisah** dari total peserta didik. **`student_count` tidak dikurangi menggunakan angka residu apa pun.** Bila residu counts kelak diperoleh, simpan sebagai metadata kualitas, bukan sebagai pengurang.

> Ini mengoreksi kekhawatiran yang diajukan agent pada commit `e512db4`, yang menduga label "residu" berarti seluruh nilai belum tervalidasi. Dugaan itu terlalu luas.

### Transformasi raw → canonical

| record_id | raw_value | raw_reference_date | canonical_value | canonical_reference_date | reason | source |
|---|---|---|---|---|---|---|
| EDU-001 | 994 | 2026-09-14 | **994** | **2026-09-10** | Nilai sama; reference date dikoreksi ke tanggal snapshot sebenarnya (raw menyamakannya dengan `retrieved_at`) | wilayah `131310/3?jenjang=Dikmen` |
| EDU-002 | 777 | 2026-04-16 | **778** | **2026-09-05** | Nilai **dan** tanggal diganti oleh dated wilayah snapshot yang lebih baru; nilai raw 777 ternyata sama dengan detail page (kini dicatat sebagai cross-check) | wilayah `131305/3` |
| EDU-003 | 272 | 2026-09-14 | **NULL** | — | Tidak ada reference date yang terpisah dari `retrieved_at` → tidak memenuhi syarat canonical. Nilai dipertahankan sebagai **secondary** (`BEN-S-EDU-003`) | wilayah `131309/3` |
| EDU-004 | NULL | — | **NULL** | — | Tetap NULL; variasi antar view resmi belum direkonsiliasi | — |
| EDU-005 | 46 | 2026-09-14 | **46** | **2026-08-30** | Nilai sama; reference date dikoreksi | wilayah `131311/3?jenjang=Dikdas` |
| EDU-006 | 333 | 2026-09-14 | **330** | **2026-08-30** | Nilai dikoreksi oleh dated snapshot; selisih 3 dicatat sebagai variance, bukan kesalahan raw | wilayah `131311/3?jenjang=Dikdas` |
| EDU-007 | 158 | — | **NULL** | — | Detail page tanpa explicit reference date → tidak memenuhi syarat canonical. Dipertahankan sebagai **secondary** (`BEN-S-EDU-007`) | detail `30109720` |
| HLT-001 | NULL | — | **NULL** | — | Tidak ditemukan service/work-area population | — |
| HLT-002 | NULL | — | **NULL** | — | Idem | — |
| HLT-003 | NULL | — | **NULL** | — | Idem | — |

### Koreksi konsistensi skema (raw → canonical)

| Field | Raw | Canonical | Alasan |
|---|---|---|---|
| `is_proxy` (HLT-001/002/003) | `true` | **`false`** | **Tidak ada proxy yang digunakan** — nilainya NULL dan `proxy_level` kosong. Flag `true` bertentangan dengan isi barisnya. `is_proxy` ≠ `proxy_overlap_risk` |
| `proxy_overlap_risk` | true/true/unknown | **dipertahankan** | Metadata risiko bila proxy kelak dipakai — bukan pernyataan bahwa proxy sedang dipakai |
| `verification_status` (HLT) | `requires_verification` | **`not_available`** | Sumber sudah diperiksa dan populasi wilayah kerja memang tidak ditemukan — bukan "nilai ada tapi belum dikonfirmasi" |
| `proxy_overlap_risk` (sekolah) | kosong | **`false`** | `student_count` bersifat facility-level, tidak memerlukan proxy |

### Kolom baru pada interim

| Kolom | Fungsi |
|---|---|
| `observation_role` | `canonical` \| `cross_check` \| `secondary` — memungkinkan beberapa observasi hidup berdampingan untuk satu fasilitas tanpa mencampur mana yang dipakai scoring |
| `variance_classification` | `TEMPORAL_OR_VIEW_VARIANCE` bila ada — lihat `research/BENEFICIARY_SOURCE_VARIANCE.md` |

**Aturan konsumsi hilir:** scoring **hanya** membaca baris `observation_role = canonical`. Baris `cross_check` dan `secondary` ada untuk audit, **bukan** untuk dipakai sebagai nilai.

### Yang tidak dilakukan

- ❌ Raw tidak diedit (checksum diverifikasi ulang setelah transformasi).
- ❌ Tidak ada NULL yang diisi 0.
- ❌ Tidak ada proxy populasi kecamatan yang diterapkan.
- ❌ Tidak ada scoring, bobot, atau Data Confidence yang dihitung.
