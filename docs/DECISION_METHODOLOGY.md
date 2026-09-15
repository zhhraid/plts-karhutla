# DECISION_METHODOLOGY.md — Metodologi Keputusan SURYA-SIAGA

**Versi:** MVP v1 (Prompt 4, 2026-09-15). **Implementasi:** `scripts/build_master_dataset.py`.

---

## 1. Positioning

SURYA-SIAGA adalah **Decision Support System berbasis web untuk pre-screening awal** prioritas pengembangan/penguatan PLTS.

**BUKAN:** feasibility study · detailed engineering design · keputusan pembangunan otomatis · pengganti PLN/ESDM/Pemda · prediksi AI black-box.

Seluruh keluaran berlabel **PRELIMINARY / PRE-SCREENING**. Sistem menunjuk lokasi yang **layak dikaji lebih lanjut**, bukan lokasi yang layak dibangun.

## 2. Nama Metode

**Weighted Multi-Criteria Decision Analysis (Weighted Sum Model).**

> ⚠️ Ini **bukan AHP**. Tidak ada pairwise comparison dari ahli, tidak ada consistency ratio, tidak ada expert elicitation. Menyebutnya AHP akan menjadi klaim palsu. Bobot di bawah adalah **MVP design assumption yang dapat dikonfigurasi**, bukan hasil validasi ahli.

## 3. Empat Dimensi Keputusan

| Dimensi | Variabel | Sumber | Status saat ini |
|---|---|---|---|
| **Solar Suitability** | GHI | Global Solar Atlas (CC BY 4.0) | ❌ NULL di 10/10 situs |
| **Social Impact** | jumlah peserta didik (sekolah); populasi wilayah kerja (puskesmas) | Kemendikdasmen; Dinkes | ⚠️ 4/10 situs |
| **Facility Criticality** | aturan berbasis `facility_type` | design assumption | ✅ 10/10 |
| **Resilience Need** | bahaya karhutla | Wijaya et al. (2024) Tabel 10 | ⚠️ 10/10, **proksi kecamatan** |

**Priority Score dan Data Confidence dipisahkan total.** Confidence tidak pernah menaikkan Priority Score; ia hanya menjelaskan seberapa kuat bukti di baliknya.

**Existing PLTS bukan komponen skor.** Ia menentukan *jenis rekomendasi* dan konteks energi — bukan menambah atau mengurangi prioritas.

## 4. Dimensi yang Dikeluarkan dari Skor

| Data | Alasan pengeluaran |
|---|---|
| **Kekeringan** (kelas Rendah, kabupaten) | Nilai identik untuk seluruh 10 situs → **nol daya pembeda**. Juga berasal dari salinan sekunder yang butuh konfirmasi resmi. Dibawa sebagai konteks. |
| **IRBI kabupaten** | Indeks level kabupaten, identik untuk semua situs; skala belum terverifikasi (CF-003). Tidak pernah masuk dataset hazard per-situs. |
| **Hotspot harian / kabut asap / status darurat** | Kejadian near-real-time, bukan risiko struktural. Keputusan investasi PLTS bersifat jangka panjang. |
| **NASA POWER** | Resolusi parameter surya ~1°×1° (≈111 km) — seluruh Kubu Raya jatuh pada satu sel grid. Peran: supporting time-series saja. |
| **`electricity_source` sekolah** | Fakta profil. "PLN" tidak berarti listrik andal; "Diesel" tidak otomatis berarti prioritas PLTS; "Tidak Ada" masih butuh validasi kondisi terkini. Tidak diturunkan menjadi energy gap atau resilience need. |

## 5. Facility Criticality — Aturan &amp; Rasional

| `facility_type` | Skor | Rasional |
|---|---|---|
| Puskesmas | **100** | Kehilangan daya memutus continuity of essential health services: layanan gawat darurat, rantai dingin vaksin, dan layanan rawat inap pada fasilitas berstatus PERAWATAN. |
| Sekolah | **70** | Tetap fasilitas publik kritis, tetapi gangguan layanan pendidikan umumnya tidak berimplikasi langsung pada keselamatan jiwa dalam hitungan jam. |

**Status: MVP design assumption.** Tidak ada validasi ahli, tidak ada klaim expert consensus. Nilai bersifat configurable (`CRITICALITY_BY_TYPE`). Jenjang sekolah (SD/SMP/SMA/SMK) **sengaja tidak dibedakan** — tidak ada dasar bukti untuk membedakannya, dan membedakannya akan menciptakan presisi yang tidak dapat dipertanggungjawabkan.

## 6. Resilience Need

Hanya bahaya karhutla yang dipakai, dengan `scoring_eligibility = provisional_district_proxy`.

> ⚠️ **Proksi kecamatan, bukan nilai piksel situs.** Seluruh fasilitas dalam satu kecamatan menerima kelas yang sama. Target pengganti: InaRISK `layer_bahaya_kebakaran_hutan_dan_lahan` ImageServer (100 m) — kapabilitas servicenya sudah terverifikasi, ekstraksi titiknya belum dapat dilakukan.

**HAZARD ≠ RISK dijaga ketat.** Sumber karhutla mengukur **bahaya** (kondisi biofisik), bukan risiko (bahaya × kerentanan ÷ kapasitas). `metric_type = hazard` tercatat di setiap baris. Keduanya tidak pernah dicampur.

## 7. Aturan Missing Value

> **NULL TIDAK PERNAH = 0.**

Kriteria yang hilang **dikeluarkan dari pembilang dan penyebut**, bukan diberi nol. Rinciannya di `docs/SCORING_FORMULA.md` §3.

**Minimum coverage:** skor numerik hanya diterbitkan bila ≥2 dari 4 dimensi tersedia **dan** Facility Criticality termasuk di dalamnya. Di bawah itu → `INSUFFICIENT_DATA`, tanpa angka.

## 8. Keterbatasan yang Diketahui

1. **Bobot terbesar (solar, 30%) saat ini inert** — GHI NULL di semua situs, sehingga menggesernya tidak mengubah apa pun.
2. **Hanya 6 skor berbeda dari 10 situs** — tiga puskesmas identik, tiga sekolah identik.
3. **Memiliki data dapat menurunkan peringkat** — EDU-005 (beneficiary terukur kecil) berperingkat di bawah EDU-007 (beneficiary tidak diketahui) meski identik pada dimensi lain. Konsekuensi struktural renormalisasi, bukan bug.
4. **Skor dengan `available_weight_fraction` berbeda tidak sepenuhnya sebanding.**
5. **Bahaya masih proksi kecamatan** — karena itu tidak ada situs yang dapat mencapai Data Confidence HIGH.
6. **Peringkat sangat sensitif terhadap encoding bahaya**, jauh lebih sensitif daripada terhadap bobot. Lihat `research/SCORING_SENSITIVITY_ANALYSIS.md`.

## 9. Konfigurasi

Seluruh konstanta berada di bagian atas `scripts/build_master_dataset.py`: `BASELINE_WEIGHTS`, `CRITICALITY_BY_TYPE`, `HAZARD_CLASS_SCORE`, `SOCIAL_FLOOR`, `MIN_DIMENSIONS`, `REQUIRED_DIMENSION`. Mengubahnya lalu menjalankan ulang script akan membangun kembali seluruh master dataset.

## 10. Atribusi

Data Global Solar Atlas berlisensi **CC BY 4.0** dan **wajib menyertakan atribusi** saat ditampilkan. GSA sendiri menyatakan datanya **bukan untuk "bankable assessment"** — hanya pre-feasibility/screening, konsisten dengan positioning produk ini.
