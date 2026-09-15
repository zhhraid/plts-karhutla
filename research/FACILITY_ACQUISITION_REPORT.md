# FACILITY_ACQUISITION_REPORT.md — Laporan Akuisisi Inventaris Fasilitas

**Pass:** Prompt 3A → 3A.1 → **3A.2 (Import & Validate External Package)**
**Tanggal:** 2026-09-12
**Hasil:** ✅ **10 record lolos gate** · **Facility Acquisition Gate: PASS** · **READY FOR PROMPT 3B**

---

## Ringkasan Eksekutif

External manual verification package diterima, disimpan immutable, **divalidasi secara struktural dan logis** (tidak dianggap benar otomatis), lalu diimpor. Sepuluh fasilitas kini memiliki identitas terverifikasi, kecamatan, sumber yang dapat ditelusuri, dan koordinat `official_exact`.

Validasi menemukan **satu ketidakcocokan kosakata enum** dan **satu kolom baru yang wajib diadopsi** (`coordinate_source_data_year`). Keduanya dilaporkan dan diselesaikan tanpa mengubah data sumber. **Tidak ada anomali koordinat.**

---

## 1. Record Diimpor

| Dataset | Diimpor | Total di file | Lolos gate |
|---|---|---|---|
| Education | **7** (EDU-001…EDU-007) | 7 | **7** |
| Health | **3** (HLT-001…HLT-003) | 23 (+20 identity-only dari Prompt 3A.1) | **3** |
| **Total** | **10** | 30 | **10** |

## 2. `coordinate_quality` Breakdown

| Nilai | Education | Health | Boleh scoring? |
|---|---|---|---|
| `official_exact` | **7** | **3** | ✅ |
| `derived_confirmed` | 0 | 0 | ✅ provisional |
| `approximate` | 0 | 0 | ⛔ |
| `missing` | 0 | 20 | ⛔ |

Tidak ada satu pun koordinat turunan, geocoding, digitasi manual, maupun centroid administratif. Seluruh 10 koordinat berasal langsung dari sumber pemerintah.

## 3. District Coverage (record berkoordinat)

| Kecamatan | Record |
|---|---|
| Batu Ampar | **5** (EDU-005, EDU-006, EDU-007, HLT-001, HLT-002) |
| Kubu | 2 (EDU-004, HLT-003) |
| Sungai Kakap | 1 (EDU-002) |
| Sungai Raya | 1 (EDU-001) |
| Terentang | 1 (EDU-003) |

**5 dari 9 kecamatan.** Belum tercakup: Kuala Mandor B, Rasau Jaya, Sungai Ambawang, Teluk Pakedai.

Konsentrasi di **Batu Ampar (5 record)** adalah kecamatan yang sama dengan ketiga desa penerima hibah PLTS 2021 (EV-F) — memberi kepadatan kandidat justru di wilayah dengan PLTS eksisting.

## 4. Source Coverage

| Sumber | Record | Peran |
|---|---|---|
| Kemendikdasmen — Referensi Data Pendidikan | 7 | Identitas + koordinat (`government_portal`) |
| Dinas Kesehatan Kubu Raya via Satu Data (dataset 2021) | 3 | Koordinat (`government_dataset`) |
| Portal UPTD Puskesmas (`pkm-*.kuburayakab.go.id`) | 3 | Cross-check identitas/alamat terkini |
| Diskominfo Kubu Raya — Portal Perangkat Daerah 2024 | 20 | Identitas saja (tanpa koordinat) |

**Validasi domain lolos:** setiap `coordinate_source_url` education berada di domain Kemendikdasmen **dan memuat NPSN record itu sendiri** (pengecekan silang yang kuat — URL tidak tertukar antar-record). Koordinat health seluruhnya dari `satudata.kuburayakab.go.id`; cross-check identitas dari subdomain resmi Pemkab. Tidak ada URL kosong.

## 5. Historical Coordinate Count

**3 record** (HLT-001, HLT-002, HLT-003) memiliki `coordinate_source_data_year = 2021`.

Ini **tetap `official_exact`** — umur data tidak mengubah asal-usul koordinat. Yang direkam adalah **risiko keterkinian**, bukan penurunan kualitas.

> ⚠️ **Aturan penyajian:** koordinat ini **tidak boleh** dipresentasikan sebagai "koordinat diperbarui 2026". `coordinate_retrieved_at = 2026-09-12` hanya menyatakan kapan diakses. Risiko residual yang harus disadari: fasilitas dapat pindah atau dibangun ulang sejak 2021.

## 6. Schema Conflicts

| # | Konflik | Penyelesaian |
|---|---|---|
| 1 | `coordinate_source_type` package (`government_portal`/`government_dataset`) ≠ enum skema (`official_portal`/`official_dataset`) | **Data sumber tidak diubah.** Skema diperluas menerima kedua kosakata sebagai ekuivalen |
| 2 | Kolom baru `coordinate_source_data_year` belum ada di skema | **Diadopsi ke kedua dataset** — ini kolom yang mencegah koordinat 2021 disalahartikan sebagai 2026 |
| 3 | Kolom `facility_type` belum ada di skema education | Diadopsi |
| 4 | `coordinate_method` memakai nilai terkontrol | Didokumentasikan di skema |
| 5 | Package health tanpa `facility_source_id` | Dibiarkan kosong — **identifier pemerintah tidak dibuat-buat** |

Detail lengkap: `data/raw/external_manual/2026-09-12/IMPORT_LOG.md`.

## 7. Duplicates

**3 grup ditandai, 0 di-merge.**

| Grup | Record | Alasan |
|---|---|---|
| Padang Tikar | HF-014 ↔ HLT-001 | Nama cocok lintas sumber |
| Sungai Kerawang | HF-015 ↔ HLT-002 | Nama cocok lintas sumber |
| Kubu | HF-019 ↔ HLT-003 | Nama cocok lintas sumber |

Ketiganya hampir pasti fasilitas yang sama (identitas dari Diskominfo 2024 vs koordinat dari Dinkes 2021), tetapi **tidak di-merge** karena tidak ada `facility_source_id` resmi di kedua sisi, dan kemiripan nama tidak pernah cukup untuk merge. Kedua sisi tetap hidup dengan `potential_duplicate = true` + `duplicate_of`. Keputusan merge menunggu identifier resmi (REQ-HEALTH-01).

**Implikasi hitungan:** 30 baris ≠ 30 fasilitas. Fasilitas distinct berkoordinat = **10**.

## 8. Coordinate Anomalies

**0 outlier.** Seluruh 10 koordinat lolos rentang dasar dan bounding box heuristik.

Dua observasi yang dicatat tapi **tidak** di-flag:

1. **EDU-001 (Sungai Raya, lat −0,0762) dan EDU-002 (Sungai Kakap, lat −0,0565)** berada di utara batas lintang salah satu dari dua sumber batas wilayah yang saling bertentangan (`snippet_only`). Secara geografis wajar — kedua kecamatan ini berbatasan dengan Kota Pontianak (±lat −0,02). Ini justru memperkuat dugaan bahwa rentang batas versi tersebut tidak lengkap, dan alasan bounding box sengaja dibuat permisif.
2. **Sebaran Batu Ampar:** HLT-001 ↔ HLT-002 terpisah **56,7 km**. Besar untuk satu kecamatan, tetapi Batu Ampar adalah kecamatan pesisir/kepulauan yang luas (mencakup Padang Tikar). **Menunggu point-in-polygon** untuk kepastian.

**Sinyal validasi positif:** EDU-004 (SMAN 1 Kubu, dari Kemendikdasmen) dan HLT-003 (Puskesmas Kubu, dari Dinkes 2021) berjarak **1,59 km** — dua sumber pemerintah yang sepenuhnya independen menempatkan fasilitas di lokalitas yang sama. Ini korroborasi silang yang kuat bahwa kedua set koordinat nyata.

**Point-in-polygon:** `pending` — geometri batas administratif resmi (REQ-GEO-01) belum tersedia. Sesuai kebijakan, ini **tidak** menurunkan `official_exact`.

## 9. Field-level Provenance

Status verifikasi **tidak** dikolapskan menjadi satu status per record. Contoh HLT-002:

| Field | Status | Tahun |
|---|---|---|
| Identitas fasilitas | `verified_primary` | cross-check portal 2026 |
| Koordinat | `verified_primary` | **data 2021**, diakses 2026-09-12 |
| Alamat | `verified_primary` | dataset 2021 ("JL. WINATA 1") |

Perbedaan ejaan alamat antara dataset 2021 ("JL. WINATA 1") dan portal terkini ("Jl. Wirata I") **dipertahankan apa adanya** dan tercatat di `coordinate_notes` — tidak diperbaiki diam-diam.

## 10. Electricity Source — TIDAK Diinterpretasikan

Field `electricity_source` diimpor sebagai **fakta profil**, tanpa turunan apa pun. **Tidak ada** `energy_gap`, `resilience_need`, `priority`, atau `recommendation` yang dibuat darinya.

| Nilai | Record | Aturan |
|---|---|---|
| PLN | EDU-001, 002, 003, 007 | ⚠️ **Bukan** berarti listrik selalu tersedia atau andal |
| Diesel | EDU-005 | ⚠️ **Bukan** otomatis berarti lokasi prioritas PLTS |
| Tidak Ada | EDU-006 | ⚠️ Field resmi yang **masih memerlukan validasi kondisi terkini** — bukan bukti final sekolah tanpa listrik |
| (kosong) | EDU-004 | `electricity_source_vstatus = not_available` |

---

## GATE DECISION

### ✅ FACILITY ACQUISITION GATE: **PASS**

| Syarat | Ambang | Hasil |
|---|---|---|
| Record dengan identity + district + traceable source + lat + lon + `coordinate_quality ∈ {official_exact, derived_confirmed}` | ≥ 8 | **10** ✅ |

Rincian: EDU-001…EDU-007 (7) + HLT-001…HLT-003 (3).

### 🟢 READY FOR PROMPT 3B

Prompt 3B **tidak dijalankan otomatis** pada task ini.

### Yang dibawa ke Prompt 3B sebagai batasan

1. **3 koordinat berumur 2021** — tidak boleh disajikan sebagai koordinat 2026.
2. **Point-in-polygon masih `pending`** — REQ-GEO-01 belum terpenuhi.
3. **3 duplikat belum terselesaikan** — jangan dihitung ganda; fasilitas distinct berkoordinat = 10.
4. **20 record `missing`** tidak boleh masuk ekstraksi spasial apa pun.
5. **4 kecamatan belum tercakup** — komposisi kandidat final belum ditentukan, dan kuota kategori tetap tidak dipaksakan.
6. **`electricity_source` tidak boleh menjadi input skoring** tanpa keputusan metodologi eksplisit.

## Revalidasi Prompt 3 — 2026-09-14

**PASS**: 10 target official_exact; 30 record_id unik lintas file, 7 NPSN unik, 10 nama/district/koordinat/source URL/provenance wajib terisi dan sesuai raw. Status per-field tidak hilang. Penambahan verification_status/method hanya ringkasan identity/district/coordinate; facility_type_vstatus sekolah mengikuti tipe dan jenjang raw. 20 HF dipertahankan, tiga pasangan duplikat tidak di-merge atau dihitung.

Health coordinate_source_data_year tetap 2021; point-in-polygon pending. Rentang/bounding box bukan validasi batas administratif. Candidate pool MVP kini **dikunci pengguna menjadi 10 target**; status komposisi belum final pada bagian lama digantikan keputusan ini. Hasil pemeriksaan: PROMPT_3_VALIDATION.json; keputusan berikutnya: PROMPT_4_READINESS.md. Tidak ada scoring.
