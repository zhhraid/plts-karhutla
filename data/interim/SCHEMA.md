# SCHEMA — Interim Facility Datasets

**Dibuat:** Prompt 3A, 2026-09-12. **Direvisi:** Prompt 3A.1 (Coordinate Quality Policy), 2026-09-12.
**Status isi:** `education_facilities.csv` berisi **header saja, 0 record**. `health_facilities.csv` berisi **20 record identity-only** hasil external acquisition (lihat §Identity-only records di bawah) — **tidak ada satu pun yang layak di-scoring**.

---

## Prinsip

1. **Satu baris = satu fasilitas.**
2. **Field yang tidak dapat diverifikasi diisi kosong (NULL), bukan ditebak.** Sel kosong = NULL.
3. **Verifikasi bersifat PER FIELD**, bukan per record.
4. **Sumber non-primer wajib ditandai eksplisit.**
5. **Identitas terverifikasi ≠ lokasi terverifikasi.** Nama fasilitas yang benar tidak membuat field lain menjadi benar.

---

# A. COORDINATE QUALITY POLICY (dikunci Prompt 3A.1)

Setiap record **wajib** memiliki `coordinate_quality`. Nilai ini menentukan **apa yang boleh dilakukan** terhadap record tersebut.

## Enum `coordinate_quality`

### `official_exact`
Koordinat berasal **langsung** dari sumber resmi yang secara eksplisit memberikan titik fasilitas — Kemendikdasmen, Kemenkes, Pemkab, atau dataset pemerintah lain.

> ✅ **Boleh digunakan untuk analisis spasial dan scoring.**

### `derived_confirmed`
Identitas dan alamat fasilitas berasal dari sumber resmi, tetapi koordinat diperoleh via geocoding atau map source sekunder.

**Tujuh syarat WAJIB — semuanya harus terpenuhi:**

| # | Syarat | Kolom bukti |
|---|---|---|
| 1 | Identitas fasilitas berasal dari sumber resmi | `official_identity_source` |
| 2 | Alamat atau locality resmi tersedia | `official_address_source` |
| 3 | Hasil koordinat mengarah ke fasilitas yang sesuai | `coordinate_notes` |
| 4 | Nama/lokasi berhasil dicocokkan dengan sumber kedua | `secondary_coordinate_source` + `cross_validation_status` |
| 5 | Metode geocoding dicatat | `coordinate_method` |
| 6 | Coordinate source dicatat | `coordinate_source_name` / `_url` / `_type` |
| 7 | Tidak terdapat ambiguity material | `coordinate_notes` |

> ⚠️ Bila **satu saja** syarat tidak terpenuhi → turunkan ke `approximate`, bukan `derived_confirmed`.

> ✅ **Boleh digunakan secara PROVISIONAL** pada MVP untuk analisis spasial, **wajib ditandai eksplisit sebagai derived coordinate** di UI dan dokumen.
>
> ⛔ **DILARANG menampilkannya sebagai "koordinat resmi pemerintah".**

### `approximate`
Termasuk: village centroid, district centroid, geocode yang hanya menemukan jalan, geocode yang hanya menemukan desa, titik estimasi kasar, atau lokasi dengan beberapa kemungkinan fasilitas.

> ⚠️ **MAP DISPLAY ONLY.**
>
> ⛔ **DILARANG** dipakai untuk: GHI extraction, hazard extraction, spatial Priority Score, site-level recommendation.

### `missing`
Tidak ada koordinat yang dapat dipertanggungjawabkan.

> ⛔ Tidak boleh dipakai untuk site-level spatial scoring.

## Ringkasan kelayakan penggunaan

| `coordinate_quality` | Peta | GHI/hazard extraction | Spatial scoring | Site-level recommendation |
|---|---|---|---|---|
| `official_exact` | ✅ | ✅ | ✅ | ✅ |
| `derived_confirmed` | ✅ | ✅ (provisional, berlabel) | ✅ (provisional, berlabel) | ✅ (provisional, berlabel) |
| `approximate` | ✅ (berlabel titik perkiraan) | ⛔ | ⛔ | ⛔ |
| `missing` | ⛔ | ⛔ | ⛔ | ⛔ |

---

# B. LARANGAN CENTROID (aturan permanen)

> ⛔ **Village centroid, district centroid, administrative centroid, dan bounding-box center TIDAK BOLEH digunakan sebagai representasi lokasi fasilitas untuk scoring.**

Centroid hanya boleh dipakai untuk **visualisasi agregat** dan **wajib diberi label jelas sebagai titik administratif**, bukan titik fasilitas. Sebuah puskesmas yang diplot di titik tengah desanya bukan "lokasi puskesmas dengan akurasi rendah" — itu **lokasi desa**, dan memperlakukannya sebagai lokasi fasilitas akan menghasilkan nilai GHI dan hazard yang menggambarkan tempat lain.

---

# C. Kolom Provenance Koordinat

| Kolom | Isi |
|---|---|
| `latitude`, `longitude` | Nilai koordinat (desimal, WGS84) |
| `coordinate_quality` | Enum §A — **wajib diisi** |
| `coordinate_source_name` | Nama sumber koordinat |
| `coordinate_source_url` | URL persis halaman/dataset asal koordinat |
| `coordinate_source_type` | `official_portal` / `official_dataset` / `geocoding_service` / `map_service` / `manual_digitization` — **plus sinonim yang diterima** (lihat catatan di bawah): `government_portal` ≡ `official_portal`, `government_dataset` ≡ `official_dataset` |
| `coordinate_method` | Cara perolehan. Nilai terkontrol yang sudah dipakai: `official_profile_point` (ditampilkan di halaman profil resmi), `official_dataset_point` (dari dataset geospasial resmi). Bebas-teks untuk metode lain, mis. "geocoding alamat resmi via &lt;layanan&gt;", "digitasi manual dari citra" |
| **`coordinate_source_data_year`** | **Tahun data dari dataset asal koordinat.** ⚠️ **WAJIB dibedakan dari `coordinate_retrieved_at`.** Koordinat dari dataset 2021 yang diakses pada 2026 memiliki `coordinate_source_data_year = 2021` dan `coordinate_retrieved_at = 2026-09-12`. **Koordinat historis tidak boleh dipresentasikan sebagai "koordinat diperbarui 2026".** |
| `coordinate_retrieved_at` | Tanggal koordinat diperoleh/diakses |
| `coordinate_vstatus` | `verified_primary` / `verified_secondary` / `requires_verification` / `not_available` / (kosong = belum diperiksa) |
| `coordinate_notes` | Catatan ambiguitas, kecocokan target, keraguan |
| `official_identity_source` | *(untuk derived)* sumber resmi identitas fasilitas |
| `official_address_source` | *(untuk derived)* sumber resmi alamat |
| `secondary_coordinate_source` | *(untuk derived)* sumber kedua untuk pencocokan silang |
| `cross_validation_status` | *(untuk derived)* `matched` / `partial_match` / `no_match` / `not_attempted` |

## Catatan sinonim `coordinate_source_type` (ditambahkan Prompt 3A.2)

External verification package 2026-09-12 menggunakan kosakata `government_portal` / `government_dataset`, sedangkan skema ini semula hanya mendefinisikan `official_portal` / `official_dataset`. **Ketidakcocokan ini dilaporkan, bukan diperbaiki diam-diam pada data sumber.** Nilai asli dipertahankan apa adanya di `data/raw/` maupun di interim; skema diperluas untuk menerima kedua kosakata sebagai ekuivalen. Semantiknya identik — keduanya berarti koordinat berasal langsung dari sumber pemerintah dan memenuhi `official_exact`.

## Catatan `coordinate_source_data_year` vs umur koordinat

Koordinat resmi yang berasal dari dataset lama **tetap** `official_exact` — umur data tidak mengubah asal-usulnya. Yang berubah adalah **risiko keterkinian**, dan itu direkam di `coordinate_source_data_year`, bukan dengan menurunkan `coordinate_quality`. Risiko residual yang harus disadari: fasilitas dapat pindah, dibangun ulang, atau berganti lokasi sejak tahun dataset. Ini dicatat, bukan disembunyikan dan bukan pula dijadikan alasan menolak data.

---

# D. Kolom `*_vstatus` — nilai yang diizinkan

| Nilai | Arti |
|---|---|
| `verified_primary` | Dari portal/dataset pemerintah resmi untuk fasilitas tersebut |
| `verified_secondary` | Dari sumber teknis/otoritatif non-pemerintah |
| `snippet_only` | Hanya dari hasil pencarian — **bukan bukti** |
| `requires_verification` | Nilai ada tapi belum dikonfirmasi |
| `not_available` | Sumber sudah diperiksa, field memang tidak tersedia |
| *(kosong)* | **Belum diperiksa sama sekali** |

Bedakan tegas: kosong + `not_available` = "sudah dicari, tidak ada". Kosong + vstatus kosong = "belum dicari".

---

# E. Aturan Deduplikasi

- Cocokkan pada **identifier resmi lebih dulu**: `npsn` (sekolah), `facility_source_id` (kode fasyankes/puskesmas).
- Kemiripan nama **tidak pernah** cukup untuk merge — fasilitas dapat pindah, berganti nama, atau bernama mirip namun berbeda entitas.
- Ragu → `potential_duplicate = true` + `duplicate_of`, **kedua record tetap hidup**, keputusan merge diserahkan ke manusia.

---

# F. Validasi Geospasial

**Kebijakan Prompt 3A.1:** bounding box heuristik **bukan lagi validasi utama**.

1. **Sanity check awal** (boleh, heuristik): rentang `lat ∈ [-90,90]`, `lon ∈ [-180,180]`; lalu bounding box permisif `lat ∈ [-1,05; +0,80]`, `lon ∈ [108,5; 110,0]`.
   > ⚠️ Bounding box ini `snippet_only` dan dua sumber pencarian memberi rentang berbeda — sengaja permisif agar tidak menyaring record sah. **Bukan data proyek.**
2. **Production QA**: uji **point-in-polygon** terhadap geometri batas administratif resmi (REQ-GEO-01). Sebelum dipakai, dokumentasikan: source, year, geometry level, CRS, license/access.

Titik yang gagal uji wilayah → `coordinate_outlier = true`, **tidak dihapus**.

---

# G. Catatan Kolom Khusus

- `data_year` vs `retrieved_at` vs `coordinate_retrieved_at`: tiga hal berbeda, jangan disamakan.
- `electricity_source` (sekolah): sumber listrik yang **dilaporkan pada profil pendidikan**.
  > ⚠️ **Peringatan interpretasi:** nilai "PLN" **hanya** berarti sumber listrik yang dilaporkan. **JANGAN** diartikan sebagai listrik andal, tidak pernah padam, tidak membutuhkan resilience, atau tidak membutuhkan PLTS. Field ini **bukan** indikator keandalan pasokan.
- `facility_type` (kesehatan): Puskesmas / Puskesmas Rawat Inap / Pustu / Klinik.
- `official_status` (kesehatan): status resmi yang dinyatakan portal.

---

# H. Identity-only Records

Record boleh ada dengan **hanya identitas terverifikasi** dan seluruh field lain kosong. Ini bukan data palsu — ini pencatatan jujur atas apa yang sudah dan belum diketahui.

Ciri identity-only record:
- `facility_name_vstatus = verified_primary`
- `coordinate_quality = missing`
- `district`, `address`, `village` **kosong** — **tidak boleh diisi dengan menebak dari nama fasilitas**

> ⚠️ **Larangan spesifik:** nama seperti "Puskesmas Batu Ampar" **tidak boleh** dipakai untuk mengisi `district = Batu Ampar`. Kemiripan nama fasilitas dengan nama kecamatan adalah petunjuk penelusuran, **bukan data**.

Identity-only record **tidak dihitung** sebagai kandidat yang memenuhi gate — gate mensyaratkan `coordinate_quality ∈ {official_exact, derived_confirmed}`.

# I. Kontrak akuisisi Prompt 3 — 2026-09-14

**NULL CSV = empty cell**, bukan angka 0. Literal NULL dari paket baru hanya boleh dipetakan ke empty cell di interim dengan log. Raw tidak disentuh. Tidak ada skor/normalisasi pada kontrak ini.

## Facility

Candidate allowlist: EDU-001..007 dan HLT-001..003. HF-001..020 adalah identity-only audit, bukan kandidat. ID unik lintas file; npsn sekolah unik. coordinate_source direpresentasikan oleh coordinate_source_name / coordinate_source_url / coordinate_source_type / coordinate_method. verification_status ringkasan hanya identity + district + coordinate, bukan status semua field. verification_method=external_manual_verification; seluruh *_vstatus tetap berlaku. Education facility_type_vstatus mengikuti tipe/jenjang resmi dalam raw. Field derived-only boleh kosong untuk official_exact. Source year/last_update yang tidak diberikan tetap NULL, tidak dipaksa menjadi tahun retrieval.

## Beneficiary

14 observation IDs unik: 10 canonical, 2 cross_check, 2 secondary. Hanya observation_role=canonical untuk konsumsi calon metodologi; empat nilai/date sesuai frozen snapshot. Enam canonical NULL wajib punya why_null. Cross_check dan secondary tanpa reference date tidak menggantikan canonical. Semua is_proxy=false; district population tidak menjadi facility beneficiary. NULL tidak dihukum sebagai nol; NULL kesehatan tidak menurunkan criticality. Criticality puskesmas dapat dirancang sebagai kriteria terpisah pada tahap berikutnya, belum diberi skor.

## Solar

Minimum: solar_observation_id, record_id, facility_name, latitude, longitude, ghi_value, ghi_unit, source_name, source_url, source_dataset, source_authority, spatial_resolution, temporal_coverage, data_year_or_period, extraction_method, retrieved_at, verification_method, verification_status, license, attribution_required, notes, why_null.

Tambahan: source_role, point_in_polygon_status, attribution_text, license_verification_method, license_verification_status, source_url_role, request_created_at. attribution_required boolean true. license CC BY 4.0 (nama lengkap pada CSV). Lisensi diverifikasi terpisah dari nilai. Placeholder tidak memiliki retrieved_at / verification_method nilai; request_created_at mencatat tanggal permintaan. URL portal placeholder dengan source_url_role=requested_source_portal bukan provenance nilai yang telah diperoleh. ghi_unit/resolusi/periode NULL sampai sumber ekstraksi ditentukan; tidak memakai default periode.

## Hazard

Minimum: hazard_observation_id, record_id, facility_name, latitude, longitude, hazard_type, metric_type, raw_value, raw_class, unit_or_scale, source_name, source_url, source_authority, dataset_year, extraction_method, retrieved_at, verification_method, verification_status, notes, why_null.

Tambahan: geometry_or_raster_type, point_in_polygon_status, source_url_role, request_created_at. hazard_type ∈ {karhutla,kekeringan}; metric_type ∈ {hazard,risk}. Placeholder hazard sebagai **target request**, bukan nilai terverifikasi. Nilai/kelas NULL, verification_status=requires_external_acquisition; metode/tanggal ekstraksi NULL; source_url_role=requested_layer. Identitas seri = (record_id,hazard_type,metric_type,dataset/year); hazard dan risk tidak ditumpuk menjadi satu seri. Kategori tidak dikonversi ke angka. Tahun data dari metadata, bukan tanggal query.

Validasi paket numerik, sumber, nodata, format dan fallback mengikuti EXTERNAL_SOLAR_HAZARD_REQUESTS.md. Placeholder tidak dihitung coverage.

## Existing energy assets

Satu baris per desa historis, primary key asset_id. record_id NULL karena relasi suplai belum diverifikasi; latitude/longitude NULL karena koordinat aset belum ada. existing_plts enum `verified historical`, existing_plts_vstatus=verified_primary. asset_handover_date tanggal peristiwa ISO; asset_manager_temporal_scope=reported_or_planned_at_handover_2021. Setiap field penting memiliki *_vstatus. data_year=2021; retrieved_at NULL bila tanggal akses asli tidak diberikan; handoff_received_at mencatat penerimaan instruksi. why_null menjelaskan capacity, commissioning, battery, operasi dan grid.

## Acquisition quality matrix

10 baris allowlist, satu per record_id. Field groups: identity, facility_type, district, coordinate, beneficiary, solar_ghi, karhutla, kekeringan, existing_energy_context, source_provenance. Enum deskriptif: available / missing / null_documented / secondary_only / historical_only / requires_external_acquisition / not_applicable. **Bukan skor.**

beneficiary=secondary_only berarti canonical NULL, ditegaskan canonical_beneficiary_status=null_documented. source_provenance=available berarti fakta terisi memiliki jejak dan missingness memiliki audit, bukan semua nilai target sudah ada. quality_flags dipisahkan `;`: VALID, PROXY_PRESENT, HISTORICAL_ONLY, MISSING_NONCRITICAL, MISSING_CRITICAL, SOURCE_CONFLICT, COORDINATE_ISSUE, REQUIRES_VERIFICATION, REQUIRES_EXTERNAL_ACQUISITION, SECONDARY_ONLY. VALID hanya bila tidak ada gap relevan; MISSING_CRITICAL saat solar/hazard belum tersedia, MISSING_NONCRITICAL untuk documented beneficiary NULL yang tidak memblokir gate. Tidak ada PROXY_PRESENT pada dataset ini.

existing_energy_context_scope: facility_profile / district / village / unknown. Lima site Batu Ampar historical_only untuk konteks administratif EV-F; HLT-002 cocok desa resmi Sungai Kerawang, bukan kemiripan nama fasilitas. context_asset_ids **bukan relasi suplai**. Tiga sekolah lain memiliki electricity_source sebagai konteks profil; EDU-004 dan HLT-003 null_documented. facility_existing_plts tetap NULL pada semua site. SOURCE_CONFLICT di lima site Batu Ampar merujuk konteks kapasitas/commissioning aset, bukan koordinat atau beneficiary. facility_energy_profile_status menjaga profil listrik terpisah dari konteks desa/district.
