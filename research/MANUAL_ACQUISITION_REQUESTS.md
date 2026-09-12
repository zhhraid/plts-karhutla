# MANUAL_ACQUISITION_REQUESTS.md — Permintaan Akuisisi Manual

**Dibuat:** Prompt 3A (Acquisition: Facility Inventory), 2026-09-12.
**Alasan:** environment agent terkena `EGRESS_BLOCKED` untuk seluruh domain sumber fasilitas. Sesuai §G Prompt 3A, agent **tidak membuat data** dan sebagai gantinya menyusun permintaan akuisisi yang dapat dieksekusi manusia.

## Hasil uji akses (2026-09-12)

| Domain | Hasil |
|---|---|
| `referensi.data.kemendikdasmen.go.id` | ❌ EGRESS_BLOCKED |
| `puskesmas.kuburayakab.go.id` | ❌ EGRESS_BLOCKED |
| `kalbarsehat.kalbarprov.go.id` | ❌ EGRESS_BLOCKED |

Sumber-sumber ini **sudah terverifikasi keberadaannya** melalui `external_manual_verification` (EV-G, EV-H) — jadi hambatannya murni akses jaringan agent, bukan ketiadaan sumber.

> ⚠️ **Batasan yang berlaku untuk siapa pun yang mengeksekusi permintaan ini:** jangan melanggar Terms of Service situs sumber. Ambil data secara wajar (manual/ekspor yang disediakan situs), bukan scraping masif yang membebani server.

---

# REQ-01 — Inventaris Sekolah (Kemendikdasmen / Dapodik)

**Prioritas:** TINGGI — ini satu-satunya sumber dengan **jalur koordinat terverifikasi** (EV-G).

### URL

Daftar per kabupaten (Kubu Raya, kode wilayah **131300**):
```
https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/131300/2/jf/5/all
```
Telusuri juga per kecamatan dari halaman tersebut (9 kecamatan, lihat daftar di bawah), dan halaman detail per satuan pendidikan untuk koordinat.

### Yang perlu diambil

Untuk setiap sekolah di Kabupaten Kubu Raya:

| Field | Catatan |
|---|---|
| `npsn` | **Wajib** — identifier resmi, dipakai untuk deduplikasi |
| `facility_name` | Nama sekolah sesuai portal |
| `education_level` | SD / SMP / SMA / SMK / dll |
| `school_status` | Negeri / Swasta |
| `address` | Alamat sesuai portal |
| `village` | Desa/kelurahan |
| `district` | Kecamatan |
| `latitude`, `longitude` | **Hanya jika benar-benar ditampilkan portal.** Jika tidak ada → kosongkan |
| `last_update` | Tanggal pembaruan bila ditampilkan |
| jumlah peserta didik | Bila tersedia di halaman informasi pendidikan (opsional pada tahap ini) |

### ⚠️ Aturan wajib

- **Jangan mengisi koordinat yang tidak ditampilkan portal.** Kosongkan, jangan tebak, jangan pakai titik tengah desa.
- **Jangan mengasumsikan semua sekolah punya koordinat** — EV-G hanya membuktikan sebagian halaman memuatnya.
- Catat **tanggal pengambilan** (`retrieved_at`) dan **URL persis halaman** tempat tiap record diambil.

### Format & lokasi file

Simpan **mentah, tanpa diedit**, ke:
```
data/raw/facilities/education/
```
Format yang diterima (pilih salah satu, urut preferensi):
1. Ekspor CSV/Excel dari portal, bila tersedia — simpan apa adanya.
2. Salinan HTML halaman (`Save Page As`) — satu file per halaman, nama file mengandung kode wilayah/kecamatan.
3. CSV hasil transkripsi manual, **dengan kolom persis seperti tabel di atas** + kolom `source_url` dan `retrieved_at` per baris.

Sertakan satu file `data/raw/facilities/education/_MANIFEST.txt` berisi: daftar file, URL asalnya, dan tanggal pengambilan.

---

# REQ-02 — Inventaris Fasilitas Kesehatan (Portal Puskesmas Kubu Raya)

**Prioritas:** TINGGI

### URL
```
https://puskesmas.kuburayakab.go.id/
```
Telusuri halaman per-puskesmas (pola yang teramati pada riset sebelumnya: `/<nama-puskesmas>/`, dengan sub-halaman seperti `read/9/sarana-dan-prasarana`).

### Yang perlu diambil

| Field | Catatan |
|---|---|
| `facility_source_id` | Kode puskesmas resmi bila ditampilkan (mis. format `P6112xxxxxx`) — dipakai untuk deduplikasi |
| `facility_name` | Nama resmi |
| `facility_type` | Puskesmas / Puskesmas Rawat Inap / Pustu / dll |
| `official_status` | Status rawat inap / non-rawat inap bila dinyatakan |
| `address` | Alamat sesuai portal |
| `village`, `district` | Desa/kelurahan dan kecamatan |
| `latitude`, `longitude` | **Hanya jika ditampilkan.** Ketersediaan koordinat puskesmas BELUM terkonfirmasi — bila memang tidak ada, catat sebagai `not_available` |

### ⚠️ Catatan khusus

Riset sebelumnya menemukan indikasi bahwa sebagian halaman "sarana dan prasarana" bertuliskan **"masih dalam proses pengumpulan data"** — artinya kelengkapan antar-puskesmas kemungkinan tidak seragam. **Catat apa adanya**, jangan diisi dari sumber lain tanpa menandai.

### Format & lokasi file
```
data/raw/facilities/health/
```
Aturan format sama seperti REQ-01, plus `_MANIFEST.txt`.

---

# REQ-03 — Fasilitas Kesehatan (Kalbar Sehat) — sumber pelengkap/silang

**Prioritas:** SEDANG — berguna untuk validasi silang REQ-02 dan menangkap fasilitas yang tidak ada di portal kabupaten.

### URL
```
https://kalbarsehat.kalbarprov.go.id/
```
Cari daftar fasyankes, filter Kabupaten Kubu Raya.

### Yang perlu diambil
Field sama dengan REQ-02, **plus identifier fasyankes** bila platform ini memakai penomoran berbeda dari portal kabupaten.

### ⚠️ Aturan wajib
- **Jangan menggabungkan record dari REQ-02 dan REQ-03 secara otomatis** berdasarkan kemiripan nama. Simpan terpisah; agent akan menandai `potential_duplicate` dan menyerahkan keputusan merge ke manusia.
- Catat `source_name` berbeda untuk tiap portal agar asal tiap record tetap dapat ditelusuri.

### Format & lokasi file
```
data/raw/facilities/health/
```
Gunakan prefiks nama file yang membedakan sumber, mis. `kalbarsehat_*` vs `puskesmas-kkr_*`.

---

# REQ-04 — Validasi Jumlah (BPS) — opsional, untuk pengecekan kelengkapan

**Prioritas:** RENDAH (tapi murah)

### Sumber
Kabupaten Kubu Raya Dalam Angka **2026** (EV-B, `verified_primary`):
```
https://kuburayakab.bps.go.id/id/publication/2026/02/27/c93f971b4b29eaf6005aa0e3/kubu-raya-regency-in-figures-2026.html
```

### Yang perlu diambil
Tabel **jumlah** fasilitas kesehatan dan sekolah **per kecamatan**.

### Kegunaan
Hanya untuk menjawab: *"apakah inventaris yang terkumpul sudah mendekati lengkap?"* — mis. bila BPS menyebut 20 puskesmas tapi REQ-02 hanya menghasilkan 12, ada 8 yang terlewat.

### ⚠️ Aturan wajib
- Ini **angka agregat per kecamatan**, **BUKAN** data per fasilitas. Jangan dipakai untuk mengisi field fasilitas mana pun.
- Catat `data_reference_year` tabelnya (umumnya 2025) **terpisah** dari `publication_year` (2026).

### Format & lokasi file
```
data/raw/facilities/_validation/
```
(buat folder ini bila diperlukan)

---

# REQ-05 — Geometri Batas Administratif Kubu Raya

**Prioritas:** SEDANG — dibutuhkan untuk validasi geospasial yang benar.

### Kebutuhan
File geometri batas administratif Kabupaten Kubu Raya (dan idealnya batas 9 kecamatannya), format GeoJSON/Shapefile, dari sumber resmi (mis. Badan Informasi Geospasial / portal geospasial pemerintah).

### Kegunaan
Mengganti bounding box sementara berstatus `snippet_only` (lihat `data/interim/SCHEMA.md`) dengan uji **point-in-polygon** yang sahih untuk menandai `coordinate_outlier`.

### Format & lokasi file
```
data/raw/facilities/_boundary/
```

---

## Daftar 9 kecamatan Kubu Raya (untuk kelengkapan penelusuran)

Batu Ampar · Kuala Mandor B · Kubu · Rasau Jaya · Sungai Ambawang · Sungai Kakap · Sungai Raya · Teluk Pakedai · Terentang

> ⚠️ Daftar ini berstatus `snippet_only` dan **hanya dipakai sebagai checklist penelusuran**, bukan sebagai data proyek. Satu hasil pencarian menyebut adanya kecamatan baru dalam proses pemekaran — **konfirmasi daftar resmi** saat mengerjakan REQ-04. Jumlah desa juga belum dikonfirmasi.

---

## Cara agent memproses file setelah diserahkan

Begitu file tersedia di `data/raw/facilities/...`, agent akan:

1. **Membaca file mentah tanpa mengubahnya.** File di `data/raw/` bersifat immutable.
2. **Memetakan kolom sumber → skema** `data/interim/SCHEMA.md`, satu baris per fasilitas, dengan `record_id` yang dibuat agent (mis. `HF-001`, `EF-001`).
3. **Mengisi `*_vstatus` per field**, bukan per record:
   - field yang benar-benar ada di portal resmi → `verified_primary`;
   - field yang kosong di sumber → dibiarkan kosong + `not_available`;
   - field yang belum dicek → dibiarkan kosong + `*_vstatus` kosong.
4. **Mengisi `coordinate_source`** sesuai asal koordinat; koordinat non-portal ditandai eksplisit.
5. **Menjalankan validasi geospasial**: cek rentang lat/lon, lalu uji wilayah. Titik di luar wilayah **di-flag `coordinate_outlier = true`, tidak dihapus**.
6. **Menjalankan pemeriksaan duplikat**: pencocokan pada identifier resmi (NPSN / kode fasyankes) lebih dulu; kemiripan nama **hanya** memicu `potential_duplicate = true` + `duplicate_of`, **tanpa merge otomatis**.
7. **Mencatat provenance per record**: `source_name`, `source_url`, `data_year`, `retrieved_at`.
8. **Memperbarui** `research/FACILITY_ACQUISITION_REPORT.md` dengan hitungan sebenarnya (record, koordinat valid, per kecamatan, duplikat, outlier, field hilang).
9. **Tidak** menghitung skor/bobot/Data Confidence — itu tahap berikutnya dan memerlukan audit terlebih dahulu.

## Definition of done untuk tahap ini

Prompt 3B baru layak dijalankan bila:

- [ ] REQ-01 dan REQ-02 (minimal) terpenuhi;
- [ ] jumlah record fasilitas dengan **koordinat `official_portal`** cukup untuk membentuk kandidat yang bermakna (target MVP §7 `PROJECT_CONTEXT.md`: 10–15 lokasi, sehingga kandidat berkoordinat sebaiknya **melebihi** angka itu agar ada ruang seleksi);
- [ ] bila koordinat resmi ternyata langka, keputusan manusia diambil lebih dulu mengenai strategi fallback (geocoding/digitasi) beserta konsekuensi akurasinya.
