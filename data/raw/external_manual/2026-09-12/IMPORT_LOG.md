# IMPORT_LOG — External Manual Verification Package

| Item | Nilai |
|---|---|
| `received_at` | 2026-09-12 |
| `source` | `external_manual_verification` |
| `package_version` | 2026-09-12 (Prompt 3A External Acquisition) |
| Diimpor oleh | Prompt 3A.2 |
| Status raw | **immutable** — file di folder ini tidak diedit |

## Checksum (SHA-256)

Lihat `CHECKSUMS.sha256`:

```
ee66089adf58257a00f2ff8f1eb278c41112ff415702d0120f9ec71d3f8ad4f1  education_facilities_external.csv
af5a2b5edd42c43d3a479a33fa60d1bdb40bfbe336b20677640d7389f4f37ddd  health_facilities_external.csv
c24163fac3c784af0bd6aa2bc5337fa408f76fa8f1b62c5781db53c2116d9155  EXTERNAL_VERIFICATION_NOTES.md
```

## Perbedaan skema yang ditemukan (dilaporkan sebelum diadopsi)

| # | Temuan | Tindakan |
|---|---|---|
| 1 | Package memakai `coordinate_source_type = government_portal` / `government_dataset`; skema semula hanya mendefinisikan `official_portal` / `official_dataset` | **Nilai sumber TIDAK diubah.** Skema diperluas menerima kedua kosakata sebagai ekuivalen, dengan catatan eksplisit di `SCHEMA.md` |
| 2 | Package memiliki kolom **`coordinate_source_data_year`** yang belum ada di skema | **Diadopsi ke kedua dataset** — kolom ini yang mencegah koordinat 2021 disalahartikan sebagai koordinat 2026 |
| 3 | Package education memiliki `facility_type` (nilai "Sekolah"); skema education belum punya | Diadopsi |
| 4 | `coordinate_method` memakai nilai terkontrol `official_profile_point` / `official_dataset_point`; skema semula mendeskripsikannya sebagai bebas-teks | Nilai terkontrol didokumentasikan di skema |
| 5 | Package tidak memuat kolom derived-only (`official_identity_source`, `official_address_source`, `secondary_coordinate_source`, `cross_validation_status`) | Wajar — seluruh record `official_exact`, bukan `derived_confirmed`. Kolom dibiarkan kosong |
| 6 | Package health tidak memuat `facility_source_id` | Dibiarkan **kosong**. Identifier pemerintah **tidak dibuat-buat** (larangan §6) |

## Status verifikasi yang **ditetapkan agent saat impor** (bukan asersi package)

Package secara eksplisit memberi `*_vstatus` hanya untuk `facility_name`, `address`, `district`, dan `coordinate`. Field berikut diberi `verified_primary` **oleh agent saat impor**, diturunkan dari pernyataan menyeluruh package bahwa seluruh record bersumber dari halaman profil resmi yang sama:

- **Education:** `education_level_vstatus`, `school_status_vstatus`, `village_vstatus`, `electricity_source_vstatus`
- **Health:** `facility_type_vstatus`, `official_status_vstatus`, `village_vstatus`

Pengecualian: EDU-004 tidak memiliki nilai `electricity_source`, sehingga `electricity_source_vstatus = not_available`.

> Turunan ini dicatat di sini agar dapat dibantah/dikoreksi. Bila pernyataan menyeluruh itu tidak dimaksudkan mencakup field-field tersebut, status di atas harus diturunkan.

## Hal yang **tidak** dilakukan

- ❌ Tidak ada web fetch ulang (environment `EGRESS_BLOCKED`).
- ❌ Tidak ada koordinat yang dinaikkan/diturunkan kualitasnya.
- ❌ Tidak ada ejaan sumber yang diubah — perbedaan "JL. WINATA 1" (dataset 2021) vs "Jl. Wirata I" (portal terkini) **dipertahankan apa adanya** dan tetap tercatat di `coordinate_notes`.
- ❌ Tidak ada auto-merge duplikat.
- ❌ Tidak ada identifier pemerintah yang dibuat.
- ❌ Tidak ada scoring, beneficiary, GHI, atau hazard.
