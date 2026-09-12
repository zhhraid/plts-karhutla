# FACILITY_ACQUISITION_REPORT.md — Laporan Akuisisi Inventaris Fasilitas

**Pass:** Prompt 3A — Acquisition: Facility Inventory
**Tanggal:** 2026-09-12
**Hasil:** ⛔ **0 record diakuisisi** — seluruh sumber fasilitas diblokir egress. **Tidak ada data yang dibuat/ditebak.**

---

## Ringkasan Eksekutif

Ketiga sumber fasilitas yang ditetapkan READY pada Prompt 2.6 diuji ulang dan **ketiganya ditolak `EGRESS_BLOCKED`** oleh kebijakan egress organisasi. Sesuai §G Prompt 3A ("Jika environment masih EGRESS_BLOCKED: JANGAN berhenti dengan membuat data"), agent tidak mengisi satu pun record dan sebagai gantinya membangun **infrastruktur akuisisi lengkap** agar data yang diserahkan manusia dapat langsung diproses.

**Penting untuk dipahami:** ini **bukan** kemunduran dari Prompt 2.6. Status `READY_FOR_ACQUISITION` pada Prompt 2.6 berarti *"sumbernya terverifikasi ada dan spesifikasinya diketahui"* — bukan *"agent ini dapat menjangkaunya"*. Keterbatasan jaringan environment agent tidak pernah hilang dan memang selalu dicatat.

---

## 1. Jumlah Record

| Dataset | Record | File |
|---|---|---|
| Fasilitas kesehatan | **0** | `data/interim/health_facilities.csv` (header saja) |
| Sekolah | **0** | `data/interim/education_facilities.csv` (header saja) |

## 2. Koordinat

| Metrik | Kesehatan | Sekolah |
|---|---|---|
| Koordinat valid | 0 | 0 |
| Tanpa koordinat | 0 | 0 |
| `coordinate_outlier` | 0 | 0 |

*(Nol di sini berarti "tidak ada record sama sekali", bukan "sudah dicek dan hasilnya nol".)*

## 3. Jumlah per Kecamatan

Tidak dapat dihitung — belum ada record. Sembilan kecamatan yang harus tercakup saat akuisisi (checklist, `snippet_only`):

Batu Ampar · Kuala Mandor B · Kubu · Rasau Jaya · Sungai Ambawang · Sungai Kakap · Sungai Raya · Teluk Pakedai · Terentang

⚠️ Satu hasil pencarian mengindikasikan adanya kecamatan baru dalam proses pemekaran — daftar resmi wajib dikonfirmasi via REQ-04.

## 4. Source Coverage

| Sumber | Status Prompt 2.6 | Hasil uji Prompt 3A | Record diperoleh |
|---|---|---|---|
| Kemendikdasmen (Dapodik) | `READY_FOR_ACQUISITION_WITH_FIELD_VALIDATION` (EV-G) | ❌ EGRESS_BLOCKED | 0 |
| Portal Puskesmas Kubu Raya | `READY_FOR_ACQUISITION_WITH_FIELD_VALIDATION` (EV-H) | ❌ EGRESS_BLOCKED | 0 |
| Kalbar Sehat | `READY_FOR_ACQUISITION_WITH_FIELD_VALIDATION` (EV-H) | ❌ EGRESS_BLOCKED | 0 |
| BPS Kubu Raya Dalam Angka 2026 | `READY_FOR_MANUAL_ACQUISITION` (EV-B) | tidak diuji (bukan sumber inventaris per-fasilitas) | 0 |

**Coverage: 0%.**

## 5. Suspected Duplicate

Tidak ada — belum ada record. Aturan deduplikasi sudah ditetapkan di `data/interim/SCHEMA.md`: pencocokan **identifier resmi lebih dulu** (NPSN untuk sekolah, kode fasyankes/puskesmas untuk kesehatan); kemiripan nama **tidak pernah** memicu merge otomatis, hanya flag `potential_duplicate`.

## 6. Coordinate Outlier

Tidak ada — belum ada record. Prosedur sudah ditetapkan:
1. Rentang dasar `lat ∈ [-90,90]`, `lon ∈ [-180,180]`;
2. Penyaring wilayah sementara (bounding box permisif, `snippet_only`): `lat ∈ [-1,05; +0,80]`, `lon ∈ [108,5; 110,0]`;
3. Titik di luar wilayah **di-flag, tidak dihapus**.

⚠️ **Temuan yang perlu dicatat:** dua sumber pencarian memberi rentang koordinat batas Kubu Raya yang **berbeda** (satu menyebut lintang 0°13'S–1°00'S / bujur 109°02'–109°58'E; satu lagi 0°44'N–1°01'S / 108°35'–109°58'E). Karena itu bounding box sengaja dibuat permisif agar tidak menyaring record yang sah, dan **wajib diganti** dengan point-in-polygon terhadap geometri batas resmi (REQ-05).

## 7. Missing Critical Fields

Seluruh field hilang karena tidak ada record. Yang paling kritis untuk MVP, berdasarkan status evidence saat ini:

| Field | Risiko | Dasar |
|---|---|---|
| `latitude` / `longitude` **puskesmas** | 🔴 **TERTINGGI** — ketersediaan belum pernah terkonfirmasi di sumber mana pun | EV-H hanya memverifikasi *data path*, bukan kelengkapan field |
| `latitude` / `longitude` **sekolah** | 🟡 SEDANG — jalur terverifikasi ada, tapi **tidak semua** sekolah memilikinya | EV-G |
| `beneficiary_count` (jumlah terlayani per fasilitas) | 🔴 TINGGI — tidak tersedia publik; hanya agregat kecamatan | NA-02 |
| Kode fasyankes resmi | 🟡 SEDANG — dibutuhkan untuk deduplikasi lintas portal | belum terkonfirmasi |

## 8. Manual Acquisition Requirement

**Wajib.** Lima permintaan terperinci disusun di `research/MANUAL_ACQUISITION_REQUESTS.md`:

| ID | Sumber | Prioritas |
|---|---|---|
| REQ-01 | Kemendikdasmen — inventaris sekolah | TINGGI |
| REQ-02 | Portal Puskesmas Kubu Raya | TINGGI |
| REQ-03 | Kalbar Sehat (validasi silang) | SEDANG |
| REQ-04 | BPS 2026 — validasi kelengkapan jumlah | RENDAH |
| REQ-05 | Geometri batas administratif | SEDANG |

Masing-masing memuat: URL persis, field yang diambil, aturan wajib (termasuk larangan menebak koordinat), format file, folder tujuan, dan langkah pemrosesan agent setelah file diserahkan.

---

## Yang Dibangun pada Pass Ini

Meski 0 record, pass ini menghasilkan infrastruktur yang membuat akuisisi berikutnya langsung dapat diproses:

| Artefak | Isi |
|---|---|
| `data/raw/facilities/health/`, `data/raw/facilities/education/` | Folder tujuan file mentah (immutable) |
| `data/interim/health_facilities.csv` | Skema 29 kolom, header saja |
| `data/interim/education_facilities.csv` | Skema 31 kolom, header saja |
| `data/interim/SCHEMA.md` | Kontrak data: aturan NULL, enum `*_vstatus` per field, enum `coordinate_source`, aturan deduplikasi, prosedur validasi geospasial |
| `research/MANUAL_ACQUISITION_REQUESTS.md` | 5 permintaan akuisisi siap eksekusi + definition of done |

Desain skema mengikuti instruksi **verifikasi per-field**: setiap field penting punya kolom `*_vstatus` sendiri, sehingga satu fasilitas dapat memiliki `facility_name = verified_primary` bersamaan dengan `latitude = not_available` — tanpa membuang seluruh record.

---

## Status Gate untuk Prompt 3B

⛔ **BELUM SIAP.**

Syarat minimum yang belum terpenuhi:
1. REQ-01 dan REQ-02 belum dieksekusi → 0 kandidat fasilitas;
2. Belum diketahui **berapa** fasilitas yang benar-benar memiliki koordinat resmi — ini pertanyaan terbuka terpenting, karena menentukan apakah pendekatan berbasis peta layak sama sekali;
3. Bila koordinat resmi ternyata langka, dibutuhkan **keputusan manusia** mengenai strategi fallback (geocoding dari alamat / digitasi manual) beserta konsekuensi akurasinya terhadap kredibilitas produk.

**Prompt 3B (solar/hazard) tidak dijalankan** — tanpa titik fasilitas berkoordinat, tidak ada apa pun untuk di-overlay dengan data surya maupun bencana.
