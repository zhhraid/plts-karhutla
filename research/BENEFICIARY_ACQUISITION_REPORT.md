# BENEFICIARY_ACQUISITION_REPORT.md — Laporan Akuisisi Data Beneficiary & Sosial

**Pass:** Prompt 3B → **3B.2 (Reconcile & Finalize Canonical Snapshot)**
**Tanggal:** 2026-09-14
**Unit analisis:** 10 fasilitas yang lolos Facility Acquisition Gate (EDU-001…007, HLT-001…003)
**Hasil:** ✅ **4 canonical dated student_count** · **Gate: PASS WITH DOCUMENTED LIMITATION** · 🔒 **BENEFICIARY ACQUISITION FROZEN FOR MVP**

---

## Ringkasan Eksekutif

Paket external 2026-09-14 **tidak dijadikan canonical secara langsung**. Rekonsiliasi menetapkan source policy yang konsisten dan reproducible: nilai canonical hanya diambil dari tabel wilayah Kemendikdasmen **yang memiliki tanggal snapshot eksplisit**; halaman detail satuan pendidikan berperan sebagai cross-check, bukan pengganti.

Hasilnya **4 sekolah** memiliki `student_count` bertanggal dan terverifikasi, **3 sekolah** tetap NULL karena tidak memiliki reference date yang memadai, dan **3 puskesmas** tetap NULL karena populasi wilayah kerja resmi tidak ditemukan.

Dua koreksi struktural dilakukan di lapisan interim (raw tidak disentuh): nilai EDU-006 berubah 333 → **330**, dan flag `is_proxy` pada ketiga puskesmas dikoreksi `true` → **`false`** karena tidak ada proxy yang sedang digunakan.

**Satu dugaan sebelumnya dikoreksi:** agent sempat menandai label "Residu Data Induk Pendidikan" sebagai indikasi seluruh nilai belum tervalidasi. Dugaan itu terlalu luas — "Residu NISN/Kependudukan/Kode Wilayah" adalah indikator kualitas pada field terpisah, dan **tidak** mengurangi validitas total peserta didik. `student_count` tidak dikurangi oleh angka residu apa pun.

---

## 1. Canonical Dated Student Count

**4 dari 7 sekolah.**

| record_id | NPSN | Sekolah | `student_count` | `data_reference_date` | Status |
|---|---|---|---|---|---|
| EDU-001 | 30101104 | SMAN 1 Sungai Raya | **994** | 2026-09-10 | `verified_primary` |
| EDU-002 | 30101107 | SMAN 1 Sungai Kakap | **778** | 2026-09-05 | `verified_primary` |
| EDU-005 | 30108035 | SD Negeri 22 Batu Ampar | **46** | 2026-08-30 | `verified_primary` |
| EDU-006 | 30101619 | SD Negeri 07 Batu Ampar | **330** | 2026-08-30 | `verified_primary` |

Seluruhnya dari tabel wilayah dengan tanggal snapshot eksplisit → **reproducible**.

## 2. Records yang Tetap NULL

**6 dari 10** (3 sekolah + 3 puskesmas). Tidak satu pun diisi 0.

| record_id | Alasan (`why_null`) | Secondary observation |
|---|---|---|
| EDU-003 | Tidak ada dated wilayah snapshot; nilai 272 tidak punya reference date terpisah dari `retrieved_at` | `BEN-S-EDU-003` = 272 |
| EDU-004 | Variasi antar view resmi belum direkonsiliasi; nilai per-view tidak dilaporkan | — |
| EDU-007 | Hanya detail page tanpa explicit reference date | `BEN-S-EDU-007` = 158 |
| HLT-001 | Service/work-area population tidak ditemukan | — |
| HLT-002 | Idem | — |
| HLT-003 | Idem | — |

> Nilai secondary **tidak dipakai untuk scoring**. Konsumsi hilir hanya membaca `observation_role = canonical`.

## 3. Source / View Variance

**3 variance terukur + 1 belum terselesaikan.** Detail di `research/BENEFICIARY_SOURCE_VARIANCE.md`.

| ID | record_id | View A (canonical) | View B | Selisih | Klasifikasi |
|---|---|---|---|---|---|
| VAR-001 | EDU-001 | 994 @ 2026-09-10 | 997 (detail, tanpa tanggal) | 3 (0,30%) | `TEMPORAL_OR_VIEW_VARIANCE` |
| VAR-002 | EDU-002 | 778 @ 2026-09-05 | 777 (detail, tanpa tanggal) | 1 (0,13%) | `TEMPORAL_OR_VIEW_VARIANCE` |
| VAR-003 | EDU-006 | 330 @ 2026-08-30 | 333 (raw, tanpa tanggal) | 3 (0,91%) | `TEMPORAL_OR_VIEW_VARIANCE` |
| VAR-004 | EDU-004 | — | — | tidak dilaporkan | belum direkonsiliasi → NULL |

**Bukan `SOURCE_CONFLICT`.** Data Induk Pendidikan bersifat dinamis; dua view pada waktu berbeda tidak mengklaim nilai yang sama untuk waktu dan definisi yang sama. Selisihnya 0,13%–0,91%, arahnya tidak konsisten (detail lebih tinggi pada EDU-001, lebih rendah pada EDU-002) — pola yang wajar untuk sistem yang terus diperbarui, bukan kesalahan sistematis.

## 4. Health Beneficiary Status

**3 dari 3 NULL**, dengan struktur yang kini konsisten:

| record_id | `beneficiary_value` | `is_proxy` | `proxy_level` | `proxy_overlap_risk` |
|---|---|---|---|---|
| HLT-001 Padang Tikar | NULL | **false** | NULL | **true** |
| HLT-002 Sungai Kerawang | NULL | **false** | NULL | **true** |
| HLT-003 Kubu | NULL | **false** | NULL | **unknown** |

**`is_proxy` ≠ `proxy_overlap_risk`.** Yang pertama menyatakan *apakah proxy sedang dipakai* (tidak). Yang kedua adalah *metadata risiko bila proxy kelak dipakai* — HLT-001 dan HLT-002 berada di kecamatan yang sama (Batu Ampar), sehingga populasi kecamatan tidak boleh dialokasikan penuh ke keduanya. HLT-003 `unknown` karena keberadaan puskesmas lain di Kecamatan Kubu belum dapat dikesampingkan (20 record identity-only belum punya `district`).

Paket raw menandai ketiganya `is_proxy = true` meski nilainya NULL dan tidak ada proxy yang diterapkan. Ini dikoreksi di lapisan interim; raw dibiarkan utuh.

## 5. Proxy Usage

**Nol.** Tidak ada populasi kecamatan yang dipakai sebagai beneficiary fasilitas.

## 6. Source Years

| Sumber | Reference date |
|---|---|
| EDU-001 | 2026-09-10 |
| EDU-002 | 2026-09-05 |
| EDU-005, EDU-006 | 2026-08-30 |

Rentang snapshot **11 hari** (30 Agustus – 10 September 2026). Tidak seragam, tetapi seluruhnya dalam satu tahun ajaran dan terdokumentasi per record. `retrieved_at` (2026-09-14) tetap kolom terpisah dari `data_reference_date` pada semua baris.

## 7. Source Conflicts

**Tidak ada `TRUE_CONFLICT`.** Seluruh perbedaan diklasifikasikan `TEMPORAL_OR_VIEW_VARIANCE` dan dicatat di file terpisah. `research/SOURCE_CONFLICTS.md` diberi rujukan silang agar pembaca tahu variance beneficiary tidak dicatat di sana.

## 8. Raw Immutability

| Item | Status |
|---|---|
| `data/raw/external_manual/2026-09-14/beneficiary_observations_external.csv` | ✅ **tidak berubah** — `sha256sum -c` OK pasca-transformasi |
| Seluruh koreksi | hanya di `data/interim/` |
| Log transformasi | `data/interim/IMPORT_LOG.md` (raw_value → canonical_value, reason, source, reference_date) |

---

## GATE DECISION

### ✅ BENEFICIARY ACQUISITION GATE: **PASS WITH DOCUMENTED LIMITATION**

| Kriteria | Ambang | Hasil |
|---|---|---|
| Sekolah dengan dated verified `student_count` | ≥ 4 | **4** ✅ |
| Health NULL terdokumentasi | wajib | ✅ `why_null` terisi pada ketiganya |
| Tidak ada beneficiary palsu | wajib | ✅ nol proxy, nol nilai 0, nol tebakan |
| Methodology mengizinkan missing beneficiary | wajib | ✅ konsisten dengan §6 `PROJECT_CONTEXT.md` ("NULL lebih baik daripada angka buatan") |
| Scoring tidak memperlakukan NULL sebagai 0 | wajib | ⚠️ **belum dapat diverifikasi — scoring belum ada.** Menjadi syarat mengikat bagi tahap metodologi |

**Bukan `PASS WITH LIMITATIONS`** karena jalur itu mensyaratkan **5+** dated snapshot; yang tersedia 4.

### 🔒 BENEFICIARY ACQUISITION: **FROZEN FOR MVP**

Tidak ada riset beneficiary lanjutan kecuali muncul **critical methodological blocker**. Yang termasuk blocker semacam itu, misalnya: metodologi ternyata tidak dapat menangani NULL tanpa mendistorsi ranking, atau `student_count` terbukti tidak sebanding antar jenjang (SD/SMP/SMA/SMK) sehingga memerlukan normalisasi berbasis data tambahan.

### Batasan yang mengikat tahap berikutnya

1. **NULL tidak boleh diperlakukan sebagai 0.** Empat dari sepuluh fasilitas punya beneficiary; enam tidak. Menganggap NULL = 0 akan menempatkan keenamnya di dasar peringkat dampak sosial — kesimpulan yang tidak didukung data apa pun.
2. **Beneficiary bukan dimensi yang lengkap.** Hanya 40% fasilitas terisi; Data Confidence untuk dimensi ini harus tampil rendah apa adanya.
3. **Perbandingan lintas jenis fasilitas belum tervalidasi.** `student_count` (sekolah) dan populasi wilayah kerja (puskesmas) adalah satuan berbeda; tidak satu pun puskesmas memiliki nilai, jadi perbandingan lintas-tipe belum dapat diuji sama sekali.
4. **Proxy kecamatan tetap terlarang untuk Batu Ampar** tanpa pembagian wilayah kerja yang jelas.
5. **`electricity_source` tetap konteks** — tidak dipakai untuk menurunkan beneficiary, energy gap, maupun resilience need.

---

## STATUS UNTUK TAHAP SOLAR + HAZARD

### 🟢 **READY**

Tahap Solar + Hazard bergantung pada **koordinat**, bukan beneficiary — dan kesepuluh fasilitas memiliki `coordinate_quality = official_exact`. Beneficiary yang tidak lengkap **tidak memblokir** ekstraksi GHI maupun hazard; ia hanya membatasi dimensi dampak sosial pada tahap scoring nanti.

Yang dibawa sebagai catatan: **point-in-polygon masih `pending`** (REQ-GEO-01 belum terpenuhi), dan tiga koordinat puskesmas berumur **2021** — keduanya relevan untuk akurasi ekstraksi spasial, bukan untuk beneficiary.
