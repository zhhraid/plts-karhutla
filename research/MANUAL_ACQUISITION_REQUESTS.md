# MANUAL_ACQUISITION_REQUESTS.md — Permintaan Akuisisi Manual

**Dibuat:** Prompt 3A. **Direstrukturisasi:** Prompt 3A.1, 2026-09-12.
**Alasan:** environment agent terkena `EGRESS_BLOCKED` untuk seluruh domain sumber fasilitas. Agent **tidak membuat data** dan menyusun permintaan yang dapat dieksekusi manusia/environment lain.

## Hasil uji akses agent (2026-09-12)

| Domain | Hasil |
|---|---|
| `referensi.data.kemendikdasmen.go.id` | ❌ EGRESS_BLOCKED |
| `puskesmas.kuburayakab.go.id` | ❌ EGRESS_BLOCKED |
| `kalbarsehat.kalbarprov.go.id` | ❌ EGRESS_BLOCKED |

Keberadaan sumber-sumber ini **sudah terverifikasi** via `external_manual_verification` (EV-G, EV-H, EV-I, EV-J) — hambatannya murni akses jaringan agent.

> ⚠️ **Berlaku untuk semua request:** patuhi Terms of Service situs sumber. Ambil data secara wajar (manual / ekspor yang disediakan situs), bukan scraping masif.

> ⚠️ **Aturan koordinat mengikat semua request** — lihat `data/interim/SCHEMA.md` §A–§B. Ringkas: **dilarang** mengisi koordinat fasilitas dari centroid desa/kecamatan; koordinat turunan wajib memenuhi tujuh syarat `derived_confirmed` dan ditandai eksplisit.

---

# REQ-EDU-01 — Official School Facility Records

**Prioritas:** TINGGI — ini satu-satunya sumber dengan jalur koordinat resmi terverifikasi (EV-G, EV-I).

### Exact data needed

Per sekolah di Kabupaten Kubu Raya: `npsn`, `facility_name`, `education_level`, `school_status`, `address`, `village`, `district`, `latitude`, `longitude`, `last_update`, dan bila tersedia `electricity_source` (sumber listrik) serta jumlah peserta didik.

### Preferred official source
```
https://referensi.data.kemendikdasmen.go.id/
```
Daftar per kabupaten (Kubu Raya, kode wilayah **131300**):
```
https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/131300/2/jf/5/all
```
Telusuri per kecamatan, lalu buka **halaman profil per satuan pendidikan** — di situlah koordinat muncul.

### Acceptable fallback
- Tidak ada untuk **identitas**: NPSN dan nama sekolah **harus** dari Kemendikdasmen.
- Untuk **koordinat** saja: geocoding dari alamat resmi → hanya boleh bila memenuhi tujuh syarat `derived_confirmed`, dan wajib mengisi `coordinate_method`, `secondary_coordinate_source`, `cross_validation_status`.

### Unacceptable fallback
- ⛔ Centroid desa/kecamatan sebagai koordinat sekolah.
- ⛔ Koordinat dari layanan peta pihak ketiga **ketika portal resmi menyediakannya**.
- ⛔ Mengisi koordinat untuk sekolah yang halaman profilnya tidak menampilkannya.
- ⛔ Mengasumsikan seluruh sekolah memiliki koordinat/jumlah siswa.

### Expected format
Ekspor CSV/Excel dari portal bila ada (simpan apa adanya); atau salinan HTML halaman; atau CSV transkripsi manual dengan kolom persis seperti daftar di atas + `source_url` dan `retrieved_at` per baris.

### Destination folder
```
data/raw/facilities/education/
```
Sertakan `_MANIFEST.txt`: daftar file, URL asal, tanggal pengambilan.

### ⚠️ Peringatan interpretasi `electricity_source`
Nilai "PLN" pada profil sekolah **hanya** berarti sumber listrik yang dilaporkan. **JANGAN** diartikan sebagai listrik andal, tidak pernah padam, tidak membutuhkan resilience, atau tidak membutuhkan PLTS. Ini **bukan** indikator keandalan pasokan.

---

# REQ-HEALTH-01 — Official Health Facility Identities & Addresses

**Prioritas:** TINGGI

### Exact data needed

Per puskesmas: `facility_source_id` (kode fasyankes/puskesmas resmi), `facility_name`, `facility_type`, `official_status` (rawat inap / non), `address`, `village`, `district`.

**Titik awal sudah tersedia:** 20 puskesmas sudah tercatat sebagai identity-only record di `data/interim/health_facilities.csv` (HF-001 … HF-020), bersumber dari daftar portal perangkat daerah Diskominfo Kubu Raya 2024 (EV-J). Request ini melengkapi field yang masih kosong — **dan memverifikasi apakah 20 itu daftar lengkap.**

### Preferred official source
1. `https://puskesmas.kuburayakab.go.id/` — portal per-puskesmas (pola teramati: `/<nama-puskesmas>/`, sub-halaman `read/9/sarana-dan-prasarana`).
2. `https://kalbarsehat.kalbarprov.go.id/` — daftar fasyankes Kalbar, filter Kubu Raya (validasi silang + menangkap fasilitas yang tak ada di portal kabupaten).
3. Open Data Kabupaten Kubu Raya, organisasi **Dinas Kesehatan** — dataset fasilitas/prasarana kesehatan.

### Acceptable fallback
- Dokumen resmi Dinkes/Pemkab (profil kesehatan kabupaten) untuk alamat.
- Data agregat BPS **hanya** untuk mengecek kelengkapan jumlah per kecamatan.

### Unacceptable fallback
- ⛔ Menebak `district` dari nama puskesmas (mis. "Puskesmas Batu Ampar" → district Batu Ampar). Kemiripan nama adalah petunjuk penelusuran, **bukan data**.
- ⛔ Dataset agregat kecamatan dipakai sebagai data per-fasilitas.
- ⛔ Sumber non-pemerintah untuk identitas fasilitas.

### Expected format
CSV/HTML/ekspor portal; bila transkripsi manual, gunakan kolom `data/interim/health_facilities.csv`. Gunakan prefiks file berbeda per sumber: `puskesmas-kkr_*` vs `kalbarsehat_*` vs `opendata-dinkes_*` — **jangan digabung** di tahap mentah.

### Destination folder
```
data/raw/facilities/health/
```

---

# REQ-HEALTH-02 — Health Facility Coordinate Acquisition

**Prioritas:** TINGGI — **ini penentu apakah puskesmas bisa masuk scoring sama sekali.**

Dipisahkan dari REQ-HEALTH-01 karena ketersediaan koordinat puskesmas **belum pernah terkonfirmasi sumber mana pun**, sementara identitas sudah. Ini pertanyaan terbuka terbesar yang tersisa.

### Exact data needed
Per puskesmas: `latitude`, `longitude`, `coordinate_quality`, `coordinate_source_name`, `coordinate_source_url`, `coordinate_source_type`, `coordinate_method`, `coordinate_retrieved_at`, `coordinate_notes`.

### Preferred official source (urut prioritas)
1. Koordinat yang ditampilkan langsung di portal puskesmas/Kalbar Sehat → `coordinate_quality = official_exact`.
2. Dataset geospasial resmi Dinkes/Pemkab/Kemenkes yang memuat titik fasyankes → `official_exact`.

### Acceptable fallback
Geocoding dari **alamat resmi** hasil REQ-HEALTH-01 → `derived_confirmed`, **hanya** bila ketujuh syarat di `SCHEMA.md` §A terpenuhi, termasuk pencocokan silang dengan sumber kedua dan konfirmasi bahwa titik mengarah ke fasilitas yang benar.

### Unacceptable fallback
- ⛔ Centroid desa/kecamatan.
- ⛔ Geocode yang hanya menemukan jalan atau desa → itu `approximate`, **map display only**, dilarang untuk GHI/hazard/scoring.
- ⛔ Titik dengan beberapa kemungkinan fasilitas tanpa penyelesaian ambiguitas.
- ⛔ Menandai koordinat turunan sebagai "koordinat resmi pemerintah".

### Expected format
CSV dengan kolom provenance koordinat lengkap (lihat `SCHEMA.md` §C). Satu baris per puskesmas, dapat dicocokkan ke `record_id` HF-001…HF-020.

### Destination folder
```
data/raw/facilities/health/coordinates/
```

### Bila koordinat resmi ternyata tidak ada
Laporkan apa adanya — **jangan diisi paksa**. Konsekuensinya keputusan produk (§H Prompt 3A.1): puskesmas tanpa `official_exact`/`derived_confirmed` tidak masuk site-level scoring, tetapi **produk tidak dipersempit** hanya karena itu; komposisi kandidat bergeser ke kategori yang datanya lebih kuat.

---

# REQ-GEO-01 — Official Administrative Geometry

**Prioritas:** SEDANG — dibutuhkan untuk validasi geospasial yang sahih (menggantikan bounding box heuristik).

### Exact data needed
Geometri batas administratif **Kabupaten Kubu Raya**, idealnya sampai level **kecamatan** (dan desa bila tersedia). Wajib didokumentasikan sebelum dipakai: `source`, `year`, `geometry level`, `CRS`, `license/access`.

### Preferred official source
1. Satu Data Kabupaten Kubu Raya — group **Geografi**.
2. Tanah Air Indonesia / BIG — layer batas administrasi **Kalimantan Barat**.

### Acceptable fallback
Dataset batas administratif dari lembaga pemerintah lain, **asalkan** tahun, level, dan CRS-nya terdokumentasi.

### Unacceptable fallback
- ⛔ Bounding box heuristik sebagai validasi produksi (hanya boleh sebagai sanity check awal).
- ⛔ Geometri dari sumber tanpa provenance/tahun yang jelas.

### Expected format
GeoJSON (preferensi) atau Shapefile, beserta file metadata/lisensi.

### Destination folder
```
data/raw/facilities/_boundary/
```

---

# REQ-VAL-01 *(opsional, murah)* — Validasi Kelengkapan via BPS

Tabel **jumlah** fasilitas kesehatan & sekolah per kecamatan dari Kabupaten Kubu Raya Dalam Angka **2026** (EV-B):
```
https://kuburayakab.bps.go.id/id/publication/2026/02/27/c93f971b4b29eaf6005aa0e3/kubu-raya-regency-in-figures-2026.html
```
**Kegunaan tunggal:** menjawab "apakah inventaris sudah mendekati lengkap?" — mis. bila BPS menyebut 22 puskesmas sedangkan daftar Diskominfo memuat 20, ada 2 yang terlewat.
**⛔ Dilarang** dipakai mengisi field fasilitas mana pun. Catat `data_reference_year` (umumnya 2025) terpisah dari `publication_year` (2026).
**Destination:** `data/raw/facilities/_validation/`

---

# REQ-BEN-EDU-01 — Student Counts untuk 7 NPSN Target

**Ditambahkan:** Prompt 3B, 2026-09-14. **Prioritas:** TINGGI — ini penentu Beneficiary Acquisition Gate.

### Exact field required
Per sekolah: `student_count_total` (**wajib**); `student_count_male` / `student_count_female` bila ditampilkan; `student_count_reference_date` (tanggal data yang dinyatakan sumber); `student_count_data_year`; tanggal pembaruan yang ditampilkan portal.

### Target (jangan diganti tanpa dokumentasi)

| record_id | NPSN | facility_name | URL profil |
|---|---|---|---|
| EDU-001 | 30101104 | SMAN 1 SUNGAI RAYA | `https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/30101104` |
| EDU-002 | 30101107 | SMAN 1 SUNGAI KAKAP | `.../npsn/30101107` |
| EDU-003 | 30100908 | SMP NEGERI 1 TERENTANG | `.../npsn/30100908` |
| EDU-004 | 30101121 | SMAN 1 KUBU | `.../npsn/30101121` |
| EDU-005 | 30108035 | SD NEGERI 22 BATU AMPAR | `.../npsn/30108035` |
| EDU-006 | 30101619 | SD NEGERI 07 BATU AMPAR | `.../npsn/30101619` |
| EDU-007 | 30109720 | SMKN 1 BATU AMPAR | `.../npsn/30109720` |

> ⚠️ **EDU-004:** NPSN 30101121 adalah SMAN 1 Kubu **Kabupaten Kubu Raya**. Ada sekolah bernama sama di Kabupaten Rokan Hilir — pastikan tidak tertukar.

### Preferred official source
Kemendikdasmen — Referensi Data Pendidikan, halaman profil/informasi pendidikan per NPSN.

### Acceptable fallback
Dokumen resmi Dinas Pendidikan/Kemendikdasmen lain yang menyebut jumlah peserta didik **per sekolah** (mis. rekap Dapodik resmi), dengan tahun data dinyatakan.

### Unacceptable fallback
- ⛔ **Populasi desa/kecamatan sebagai pengganti jumlah siswa.** Ini kategori yang sama sekali berbeda.
- ⛔ Angka dari hasil pencarian/snippet.
- ⛔ Estimasi berdasarkan jenjang atau ukuran sekolah.
- ⛔ Mengisi 0 untuk data yang tidak ditemukan — gunakan NULL.

### ⚠️ Aturan tanggal
`retrieved_at` (tanggal membuka portal) **bukan** `data_reference_date` (tanggal data itu berlaku). Bila portal menampilkan tanggal pembaruan, catat terpisah. **Jangan mengasumsikan seluruh field profil diperbarui pada tanggal yang sama.**

### Expected format
CSV satu baris per sekolah, kolom sesuai `data/interim/beneficiary_observations.csv`, dapat dicocokkan ke `record_id`.

### Destination path
```
data/raw/external_manual/<tanggal>/beneficiary_education_external.csv
```

---

# REQ-BEN-HEALTH-01 — Official Service / Work-Area Population untuk 3 Puskesmas

**Prioritas:** SEDANG-TINGGI. Gate tetap dapat lolos tanpa ini **bila** alasan pengecualian sementara didokumentasikan.

### Exact field required
Per puskesmas: populasi wilayah kerja / service population resmi, beserta **daftar desa wilayah kerja** bila tersedia, tahun data, dan sumbernya.

### Target

| record_id | facility_name | district | Portal resmi |
|---|---|---|---|
| HLT-001 | Puskesmas Padang Tikar | BATU AMPAR | `https://pkm-padangtikar.kuburayakab.go.id/` |
| HLT-002 | Puskesmas Sungai Kerawang | BATU AMPAR | `https://pkm-sungaikerawang.kuburayakab.go.id/` |
| HLT-003 | Puskesmas Kubu | KUBU | `https://pkm-kubu.kuburayakab.go.id/` |

> ⚠️ **Jangan membuat service population berdasarkan nama fasilitas.**

### Preferred official source (urut prioritas)
1. **LEVEL 1** — Portal resmi puskesmas: populasi wilayah kerja yang secara eksplisit terkait puskesmas tersebut.
2. **LEVEL 2** — Profil Kesehatan Kabupaten Kubu Raya / dokumen Dinas Kesehatan yang memuat populasi wilayah kerja per puskesmas.

### Acceptable fallback
**LEVEL 3** — populasi kecamatan sebagai *konteks geografis*, **hanya** bila LEVEL 1 dan 2 tidak ada, dan **wajib** ditandai `is_proxy = true`, `beneficiary_type = district_population_proxy`, `proxy_level = 3`.

### Unacceptable fallback
- ⛔ Menyatakan "Puskesmas melayani X pasien" dari populasi kecamatan. Gunakan wording *"Potential service population proxy"* atau *"Population context — district level"*.
- ⛔ Memberikan populasi kecamatan penuh ke beberapa puskesmas di kecamatan yang sama (lihat peringatan di bawah).
- ⛔ LEVEL 4 diisi angka apa pun — itu NULL.

### 🔴 Peringatan overlap yang sudah terkonfirmasi
**HLT-001 dan HLT-002 berada di kecamatan yang sama (BATU AMPAR).** Populasi Kecamatan Batu Ampar **tidak boleh** dialokasikan penuh ke keduanya seolah masing-masing melayani seluruhnya — itu akan menghitung ganda penduduk yang sama. Keduanya sudah ditandai `proxy_overlap_risk = true`.

**HLT-003 (Kec. KUBU)** ditandai `proxy_overlap_risk = unknown` karena 20 record identity-only belum memiliki `district`, sehingga keberadaan puskesmas lain di Kecamatan Kubu belum dapat dikesampingkan. Mengisi `district` pada REQ-HEALTH-01 akan menyelesaikan ketidakpastian ini.

### Expected format & destination
```
data/raw/external_manual/<tanggal>/beneficiary_health_external.csv
```

---

# REQ-BEN-BPS-01 — District Population (fallback/context saja)

**Prioritas:** RENDAH — **hanya** dibutuhkan bila REQ-BEN-HEALTH-01 LEVEL 1/2 gagal.

### Exact field required
**Populasi per kecamatan** untuk (minimal) **Batu Ampar** dan **Kubu**, beserta **reference_year tabel tersebut**.

### Preferred official source
Kabupaten Kubu Raya Dalam Angka **2026** (EV-B, `verified_primary`):
```
https://kuburayakab.bps.go.id/id/publication/2026/02/27/c93f971b4b29eaf6005aa0e3/kubu-raya-regency-in-figures-2026.html
```

### ⚠️ Aturan tahun
`publication_year = 2026` **≠** `reference_year`. Catat tahun referensi **tabel populasi itu sendiri** — jangan diasumsikan seluruh isi publikasi adalah data 2026, dan jangan diasumsikan seragam antar-tabel.

### Batasan
- ⛔ **Jangan mengumpulkan variabel BPS lain** yang tidak dipakai.
- ⛔ Data ini **tidak boleh** menjadi `beneficiary_value` fasilitas tanpa `is_proxy = true` dan `proxy_level = 3`.
- ⛔ Tidak berlaku untuk sekolah sama sekali — jumlah siswa tidak boleh diproksi dari populasi.

### Destination path
```
data/raw/external_manual/<tanggal>/beneficiary_bps_district_population.csv
```

---

## Informasi yang masih kurang dari handoff sebelumnya

| Item | Status |
|---|---|
| **URL persis dataset "Portal Website Perangkat Daerah Tahun 2024"** (Satu Data/Diskominfo Kubu Raya) | ⚠️ **Belum diberikan.** Nama dataset dan daftar 20 puskesmas sudah diterima, tetapi URL-nya belum — sehingga `source_url` pada HF-001…HF-020 sengaja dikosongkan, bukan dikarang. **Mohon dilengkapi.** |
| URL persis dataset Open Data Dinkes Kubu Raya | ⚠️ Belum diberikan — dicatat sebagai pathway, URL menyusul |
| URL persis Satu Data Kubu Raya group Geografi | ⚠️ Belum diberikan |

---

## Daftar 9 kecamatan Kubu Raya (checklist penelusuran)

Batu Ampar · Kuala Mandor B · Kubu · Rasau Jaya · Sungai Ambawang · Sungai Kakap · Sungai Raya · Teluk Pakedai · Terentang

> ⚠️ `snippet_only`, **checklist penelusuran saja, bukan data proyek.** Satu hasil pencarian menyebut ada kecamatan baru dalam proses pemekaran — konfirmasi daftar resmi via REQ-VAL-01.

---

## Cara agent memproses file setelah diserahkan

1. **Baca file mentah tanpa mengubahnya** — `data/raw/` bersifat immutable.
2. **Petakan kolom sumber → skema** `data/interim/SCHEMA.md`; untuk kesehatan, cocokkan ke `record_id` HF-001…HF-020 yang sudah ada (jangan buat duplikat).
3. **Isi `*_vstatus` per field** — ada di portal resmi → `verified_primary`; kosong di sumber → `not_available`; belum dicek → biarkan kosong.
4. **Tetapkan `coordinate_quality`** sesuai §A `SCHEMA.md`, lengkap dengan seluruh kolom provenance koordinat. Bila `derived_confirmed`, verifikasi ketujuh syaratnya satu per satu.
5. **Validasi geospasial** — sanity check rentang, lalu point-in-polygon terhadap geometri REQ-GEO-01 bila sudah ada. Outlier **di-flag, tidak dihapus**.
6. **Pemeriksaan duplikat** — identifier resmi lebih dulu; kemiripan nama hanya memicu `potential_duplicate`, **tanpa merge otomatis**.
7. **Catat provenance per record.**
8. **Perbarui** `research/FACILITY_ACQUISITION_REPORT.md` dengan hitungan sebenarnya, termasuk distribusi `coordinate_quality`.
9. **Tidak** menghitung skor/bobot/Data Confidence.

## Definition of done (gate Prompt 3B)

- [ ] Minimal **8–10 facility record** memiliki: `identity` + `district` + `traceable source` + `coordinate_quality ∈ {official_exact, derived_confirmed}`;
- [ ] REQ-EDU-01 dan REQ-HEALTH-01 dieksekusi;
- [ ] REQ-HEALTH-02 dieksekusi **atau** dilaporkan bahwa koordinat resmi puskesmas tidak tersedia (agar keputusan komposisi kandidat dapat diambil);
- [ ] URL dataset yang masih kurang (tabel di atas) dilengkapi.

> Ini **bukan** final 10–15 pilot sites — ini ambang agar tahap akuisisi berikutnya layak dijalankan.
