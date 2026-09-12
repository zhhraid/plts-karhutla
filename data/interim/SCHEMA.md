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
| `coordinate_source_type` | `official_portal` / `official_dataset` / `geocoding_service` / `map_service` / `manual_digitization` |
| `coordinate_method` | Cara perolehan, mis. "ditampilkan di halaman profil satuan pendidikan", "geocoding alamat resmi via <layanan>", "digitasi manual dari citra" |
| `coordinate_retrieved_at` | Tanggal koordinat diperoleh |
| `coordinate_vstatus` | `verified_primary` / `verified_secondary` / `requires_verification` / `not_available` / (kosong = belum diperiksa) |
| `coordinate_notes` | Catatan ambiguitas, kecocokan target, keraguan |
| `official_identity_source` | *(untuk derived)* sumber resmi identitas fasilitas |
| `official_address_source` | *(untuk derived)* sumber resmi alamat |
| `secondary_coordinate_source` | *(untuk derived)* sumber kedua untuk pencocokan silang |
| `cross_validation_status` | *(untuk derived)* `matched` / `partial_match` / `no_match` / `not_attempted` |

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
