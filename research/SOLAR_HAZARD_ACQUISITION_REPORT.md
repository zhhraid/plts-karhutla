# SOLAR_HAZARD_ACQUISITION_REPORT.md — Laporan Akuisisi Solar &amp; Hazard

**Pass:** Prompt 3C — Solar &amp; Hazard Data Acquisition
**Tanggal:** 2026-09-14
**Hasil:** ⚠️ **PASS WITH LIMITATIONS — WAITING FOR EXTERNAL SOLAR/HAZARD PACKAGE**

---

## Ringkasan Eksekutif

Ketiga sumber solar dan hazard diuji dan ketiganya ditolak `EGRESS_BLOCKED`. Tidak ada nilai GHI maupun hazard yang dibuat, ditebak, atau diambil dari hasil pencarian.

Yang dihasilkan pass ini adalah **struktur lengkap yang siap diisi**: 10 observasi solar dan 20 observasi hazard (10 site × 2 layer), seluruhnya NULL dengan `why_null` terdokumentasi, plus request eksternal yang memuat koordinat presisi per site dan aturan yang mengikat pengambilnya.

Satu temuan yang perlu diangkat: **lisensi Global Solar Atlas ternyata belum pernah terverifikasi oleh siapa pun.** Paket eksternal 2026-09-12 memverifikasi spesifikasi teknis GSA (resolusi, CRS, format) tetapi **tidak** mencakup lisensi. Klaim CC BY 4.0 yang beredar sejak Prompt 2 masih berstatus `snippet_only`. Konsekuensinya: **raster tidak boleh di-commit**, dan verifikasi lisensi kini menjadi bagian wajib dari REQ-SOL-01.

---

## 1. Jumlah Site Target

**10** — EDU-001…EDU-007, HLT-001…HLT-003.

Seluruhnya `coordinate_quality = official_exact`. Tidak ada identity-only record yang dipakai. Tidak ada centroid.

## 2. GHI Acquired

**0 dari 10.**

## 3. GHI NULL

**10 dari 10.** Seluruhnya `verification_status = requires_external_acquisition` dengan `why_null` menyebut domain terblokir dan tanggal uji. Tidak ada yang diisi 0, tidak ada normalisasi, tidak ada solar score.

## 4. Karhutla Acquired

**0 dari 10.**

## 5. Kekeringan Acquired

**0 dari 10.**

## 6. Hazard NULL

**20 dari 20** observasi (10 site × 2 layer). `raw_value`, `raw_class`, dan `metric_type` seluruhnya kosong.

`metric_type` sengaja **dikosongkan, bukan ditebak** — nilainya bergantung pada apakah layer yang tersedia adalah *bahaya* atau *risiko*, dan itu hanya dapat diketahui saat mengakses sumbernya.

## 7. License Status Global Solar Atlas

⚠️ **BELUM TERVERIFIKASI.**

| Aspek | Status |
|---|---|
| Spesifikasi teknis (GHI/DNI/DIF/GTI, 9 arcsec ~250 m, EPSG:4326, GeoTIFF/AAIGRID) | ✅ terverifikasi (EV-D) |
| Nama &amp; URL lisensi | ❌ belum |
| Izin penggunaan non-komersial/kompetisi | ❌ belum |
| Izin menyimpan raster | ❌ belum |
| Izin menyimpan derived point values | ❌ belum |
| Teks atribusi | ⚠️ `snippet_only` (EV-021, indikasi CC BY 4.0 — **tidak cukup** sebagai dasar keputusan) |

Detail di `research/GLOBAL_SOLAR_ATLAS_LICENSE.md`.

## 8. Apakah Raster Disimpan?

⛔ **TIDAK.** Tidak ada file GeoTIFF/AAIGRID yang diunduh maupun di-commit, sesuai aturan §C ("Jika license tidak jelas: JANGAN commit raster").

Penyimpanan derived point values juga **ditahan** sampai lisensi diverifikasi — meski saat ini belum menjadi kendala praktis, karena tidak ada nilai yang berhasil diakuisisi.

## 9. Apakah External Acquisition Dibutuhkan?

✅ **Ya, mutlak.** Dua request disusun di `research/EXTERNAL_SOLAR_HAZARD_REQUESTS.md`:

| ID | Isi | Prioritas |
|---|---|---|
| **REQ-SOL-01** | GHI untuk 10 titik + **verifikasi lisensi GSA** | TINGGI |
| **REQ-HAZ-01** | Karhutla &amp; kekeringan untuk 10 titik (20 observasi), dengan `metric_type` wajib | TINGGI |
| REQ-GEO-01 | Geometri batas administratif (lanjutan dari 3A.1) | SEDANG |
| REQ-CTX-01 | Contextual disaster events | RENDAH (opsional) |

Keduanya memuat koordinat presisi per site, fallback yang boleh dan yang dilarang, format, serta destination path.

## 10. Cukup untuk Lanjut ke Methodology Setelah Paket Eksternal Masuk?

✅ **Ya**, dengan syarat paket memenuhi definition of done: GHI untuk ≥8 site, karhutla **dan** kekeringan untuk ≥8 site, `metric_type` terisi di setiap baris hazard, dan setiap nilai menyertakan sumber + tahun data + metode ekstraksi.

Struktur dataset, kunci relasi (`record_id`), dan aturan validasi sudah siap — impornya akan menjadi pemetaan kolom, bukan desain ulang.

---

## Geospatial QA (§J)

| Cek | Hasil |
|---|---|
| Validasi rentang lat/lon | ✅ **10/10 lolos** |
| Bounding box sanity check (heuristik, `snippet_only`) | ✅ 10/10 lolos |
| Point-in-polygon terhadap geometri resmi | ⏸️ **`pending`** — REQ-GEO-01 belum terpenuhi |
| `coordinate_quality` diturunkan karena polygon belum ada? | ❌ **Tidak** — sesuai aturan |

`point_in_polygon_status = pending` tercatat di setiap baris kedua dataset.

## Aturan yang Diterapkan pada Struktur Dataset

| Aturan | Penerapan |
|---|---|
| NASA POWER bukan pembeda spasial | `source_role = primary_spatial_screening` diisi Global Solar Atlas; NASA POWER hanya boleh `supporting_time_series`, dan dilewati untuk MVP |
| HAZARD ≠ RISK | Kolom `metric_type` terpisah dan wajib; dikosongkan daripada ditebak |
| Kelas tidak dikonversi ke angka | `raw_class` menyimpan Rendah/Sedang/Tinggi apa adanya; konversi adalah keputusan metodologi |
| IRBI bukan discriminator per-site | **Tidak dimasukkan** ke `hazard_observations.csv` sama sekali |
| Hotspot harian bukan structural hazard | Diarahkan ke `contextual_disaster_events.csv` (opsional, belum dibuat karena tidak ada data) |
| Tidak ada centroid | Seluruh titik memakai koordinat fasilitas `official_exact` |

## Catatan yang Dibawa ke Tahap Berikutnya

1. **Koordinat HLT-001/002/003 berumur 2021.** Nilai GHI dan hazard yang diekstrak pada titik-titik ini merepresentasikan lokasi per 2021, bukan lokasi terverifikasi 2026.
2. **Point-in-polygon masih pending** — bila kelak terbukti ada titik di luar batas resmi, nilai GHI/hazard-nya perlu ditinjau ulang.
3. **Lisensi GSA menentukan apa yang boleh ditampilkan di UI**, bukan hanya apa yang boleh disimpan.
4. **GSA bukan untuk "bankable assessment"** (EV-022) — batasan ini harus ikut ditampilkan bersama nilai GHI, konsisten dengan positioning pre-screening tool.

---

## GATE DECISION

### ⚠️ SOLAR + HAZARD GATE: **PASS WITH LIMITATIONS — WAITING FOR EXTERNAL SOLAR/HAZARD PACKAGE**

| Kriteria PASS penuh | Ambang | Hasil |
|---|---|---|
| Site dengan GHI + karhutla + kekeringan + traceable source | ≥ 8 dari 10 | **0** ❌ |

| Kriteria PASS WITH LIMITATIONS | Status |
|---|---|
| Struktur dataset siap | ✅ `solar_observations.csv` (10 baris), `hazard_observations.csv` (20 baris) |
| External request usable | ✅ koordinat presisi per site, aturan fallback, format, destination |
| Tidak ada data palsu | ✅ nol nilai dibuat, nol snippet dipakai, nol centroid |

**Bukan NOT PASS** karena request eksternal yang usable sudah tersedia — itu pembeda antara kedua status menurut §N.

### Yang Diperlukan untuk Membuka Gate Penuh

Paket eksternal berisi GHI (10 titik) dan hazard karhutla + kekeringan (20 observasi), plus hasil verifikasi lisensi GSA. Setelah itu: import, validasi, lalu methodology.

**Tidak ada scoring, normalisasi, AHP, Priority Score, Data Confidence final, maupun pemilihan kandidat yang dilakukan pada pass ini.**
