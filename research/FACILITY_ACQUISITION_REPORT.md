# FACILITY_ACQUISITION_REPORT.md — Laporan Akuisisi Inventaris Fasilitas

**Pass:** Prompt 3A → **diperbarui Prompt 3A.1** (External Handoff & Coordinate Quality Policy)
**Tanggal:** 2026-09-12
**Hasil:** **20 identity-only record** (kesehatan) dari external acquisition · **0 record berkoordinat** · ⛔ **gate Prompt 3B masih tertutup**

---

## Ringkasan Eksekutif

Prompt 3A.1 menghasilkan dua hal: **kebijakan kualitas koordinat yang dikunci** (menentukan data mana yang boleh masuk scoring), dan **20 identitas puskesmas terverifikasi** hasil external acquisition.

Yang **belum** dihasilkan — dan ini yang memblokir gate — adalah **koordinat**. Tidak satu pun dari 20 record memiliki koordinat, sehingga tidak satu pun layak untuk GHI extraction, hazard extraction, maupun spatial scoring.

**Kerangka mental yang tepat:** identitas terverifikasi ≠ lokasi terverifikasi. Kita kini tahu *fasilitas apa saja yang ada*; kita masih belum tahu *di mana persisnya*. Untuk sebuah decision support system geospasial, yang kedua justru yang menentukan.

---

## 1. Jumlah Record

| Dataset | Record | Layak scoring | File |
|---|---|---|---|
| Fasilitas kesehatan | **20** (identity-only) | **0** | `data/interim/health_facilities.csv` |
| Sekolah | **0** | **0** | `data/interim/education_facilities.csv` (header saja) |

## 2. Distribusi `coordinate_quality`

| Nilai | Kesehatan | Sekolah | Boleh scoring? |
|---|---|---|---|
| `official_exact` | 0 | 0 | ✅ |
| `derived_confirmed` | 0 | 0 | ✅ (provisional, berlabel) |
| `approximate` | 0 | 0 | ⛔ map display only |
| `missing` | **20** | 0 | ⛔ |

## 3. Jumlah per Kecamatan

**Tidak dapat dihitung — `district` kosong pada seluruh 20 record.**

Ini disengaja. Delapan dari 20 nama puskesmas menyerupai nama kecamatan (Sungai Kakap, Teluk Pakedai, Sungai Ambawang, Kuala Mandor B, Batu Ampar, Rasau Jaya, Terentang, Kubu), tetapi **mengisi `district` dari kemiripan nama adalah inferensi, bukan data** — dan dilarang oleh `SCHEMA.md` §H. Puskesmas dapat berada di kecamatan yang berbeda dari namanya, dan satu kecamatan dapat memiliki lebih dari satu puskesmas.

## 4. Source Coverage

| Sumber | Status | Hasil |
|---|---|---|
| Diskominfo Kubu Raya — Portal Perangkat Daerah 2024 (EV-J) | ✅ external verified | **20 identitas puskesmas** |
| Kemendikdasmen / Dapodik (EV-G, EV-I) | ✅ pathway verified, ❌ agent EGRESS_BLOCKED | 0 record |
| Portal Puskesmas Kubu Raya (EV-H) | ✅ pathway verified, ❌ agent EGRESS_BLOCKED | 0 record |
| Kalbar Sehat (EV-H) | ✅ pathway verified, ❌ agent EGRESS_BLOCKED | 0 record |
| Open Data Dinkes Kubu Raya (EV-K) | ✅ pathway verified | 0 record (isi belum dibaca) |

## 5. Suspected Duplicate

**0 terdeteksi.** Kedua puluh nama berbeda satu sama lain. Namun deduplikasi **belum benar-benar dapat dilakukan** karena `facility_source_id` (kode fasyankes resmi) masih kosong pada seluruh record — dan kemiripan nama tidak pernah cukup untuk merge. Duplikat lintas-sumber baru dapat diperiksa setelah REQ-HEALTH-01 dan REQ-HEALTH-03 (Kalbar Sehat) masuk.

## 6. Coordinate Outlier

**0** — tidak ada koordinat untuk divalidasi.

Kebijakan validasi berubah pada pass ini: bounding box heuristik **turun status** menjadi sanity check awal saja. Validasi produksi menggunakan **point-in-polygon** terhadap geometri batas administratif resmi (REQ-GEO-01, EV-L). Titik yang gagal → `coordinate_outlier = true`, **tidak dihapus**.

## 7. Missing Critical Fields

| Field | Missing | Risiko |
|---|---|---|
| `latitude` / `longitude` | 20/20 | 🔴 **BLOCKER** — tanpa ini tidak ada spatial analysis sama sekali |
| `district` | 20/20 | 🔴 TINGGI — dibutuhkan gate; **tidak boleh diinferensi dari nama** |
| `address` | 20/20 | 🔴 TINGGI — prasyarat jalur `derived_confirmed` |
| `facility_source_id` | 20/20 | 🟡 SEDANG — dibutuhkan untuk deduplikasi lintas portal |
| `official_status` (rawat inap/non) | 20/20 | 🟡 SEDANG — relevan untuk facility criticality |
| `source_url` | 20/20 | 🟡 SEDANG — URL dataset Diskominfo belum diberikan; **dikosongkan, bukan dikarang** |
| Seluruh field sekolah | 100% | 🔴 TINGGI — REQ-EDU-01 belum dieksekusi |

## 8. Manual Acquisition Requirement

**Wajib.** Permintaan direstrukturisasi menjadi empat request utama (`research/MANUAL_ACQUISITION_REQUESTS.md`), masing-masing dengan *exact data needed / preferred official source / acceptable fallback / unacceptable fallback / expected format / destination folder*:

| ID | Isi | Prioritas |
|---|---|---|
| **REQ-EDU-01** | Official school facility records (termasuk koordinat resmi) | TINGGI |
| **REQ-HEALTH-01** | Official health facility identities & addresses (melengkapi HF-001…HF-020) | TINGGI |
| **REQ-HEALTH-02** | Health facility coordinate acquisition | **TINGGI — penentu gate** |
| **REQ-GEO-01** | Official administrative geometry | SEDANG |
| REQ-VAL-01 | Validasi kelengkapan via BPS 2026 | RENDAH |

---

## Kebijakan yang Dikunci pada Pass Ini

### Coordinate quality (`data/interim/SCHEMA.md` §A)

Empat tingkat, masing-masing dengan kelayakan penggunaan yang berbeda:

| Tingkat | Peta | GHI/hazard | Scoring | Site recommendation |
|---|---|---|---|---|
| `official_exact` | ✅ | ✅ | ✅ | ✅ |
| `derived_confirmed` (7 syarat wajib) | ✅ | ✅ provisional | ✅ provisional | ✅ provisional |
| `approximate` | ✅ berlabel | ⛔ | ⛔ | ⛔ |
| `missing` | ⛔ | ⛔ | ⛔ | ⛔ |

`derived_confirmed` **tidak boleh** ditampilkan sebagai "koordinat resmi pemerintah".

### Larangan centroid (permanen, §B)

Village/district/administrative centroid dan bounding-box center **dilarang** merepresentasikan lokasi fasilitas untuk scoring. Alasannya bukan sekadar akurasi: titik tengah desa **bukan lokasi fasilitas dengan presisi rendah** — itu lokasi desa, dan nilai GHI/hazard yang diekstrak darinya menggambarkan tempat lain.

### Komposisi kandidat (§I Prompt 3A.1)

Kuota "5 sekolah + 5 puskesmas + 3 PLTS" **tidak lagi dipaksakan**. Komposisi ditentukan setelah acquisition quality audit — **kualitas data diprioritaskan di atas kuota kategori**. Bila koordinat sekolah lebih lengkap, kandidat boleh didominasi sekolah, dan sebaliknya.

---

## Status Gate untuk Prompt 3B

⛔ **MASIH TERTUTUP.**

| Syarat gate | Status |
|---|---|
| ≥ 8–10 record dengan identity + district + traceable source + `coordinate_quality ∈ {official_exact, derived_confirmed}` | ❌ **0 record** memenuhi |
| REQ-EDU-01 dieksekusi | ❌ belum |
| REQ-HEALTH-01 dieksekusi | ⚠️ sebagian — identitas ada, alamat & district belum |
| REQ-HEALTH-02 dieksekusi atau dilaporkan nihil | ❌ belum |

**Kemajuan yang nyata:** dari 0 → 20 identitas terverifikasi, dan kebijakan yang menentukan kelayakan data kini terkunci. **Yang tersisa adalah satu hal: koordinat.**

**Pertanyaan terbuka terpenting** (belum terjawab sejak Prompt 2.6): apakah portal puskesmas/Kalbar Sehat benar-benar menampilkan koordinat? Bila ya, gate terbuka cepat lewat REQ-HEALTH-02 jalur `official_exact`. Bila tidak, jalur `derived_confirmed` lewat geocoding alamat resmi memerlukan REQ-HEALTH-01 terlebih dulu — dan konsekuensinya: seluruh puskesmas akan berkoordinat turunan yang **wajib berlabel**, bukan koordinat resmi.
