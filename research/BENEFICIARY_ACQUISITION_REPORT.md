# BENEFICIARY_ACQUISITION_REPORT.md — Laporan Akuisisi Data Beneficiary & Sosial

**Pass:** Prompt 3B — Beneficiary & Social Data Acquisition
**Tanggal:** 2026-09-14
**Unit analisis:** 10 fasilitas yang lolos Facility Acquisition Gate (EDU-001…007, HLT-001…003)
**Hasil:** ⛔ **0 nilai beneficiary diakuisisi** — seluruh sumber diblokir egress. **Beneficiary Acquisition Gate: TIDAK PASS.**

---

## Ringkasan Eksekutif

Ketiga jalur sumber beneficiary diuji dan ketiganya ditolak `EGRESS_BLOCKED`. Sesuai §N, tidak ada workaround scraping, tidak ada nilai yang diisi dari hasil pencarian, dan tidak ada angka dari memori model.

Sepuluh observasi dicatat di `data/interim/beneficiary_observations.csv` dengan `beneficiary_value = NULL`, `beneficiary_type = unknown`, dan `why_null` terdokumentasi per record — **bukan** diisi 0, sesuai §L.

Meski nol nilai diperoleh, pass ini menghasilkan satu temuan analitis yang material dan tidak memerlukan data: **proksi populasi kecamatan secara struktural tidak aman untuk Batu Ampar**, karena 2 dari 3 puskesmas target berada di kecamatan yang sama.

## Uji Akses (2026-09-14)

| Sumber | Domain | Hasil |
|---|---|---|
| Profil sekolah (student count) | `referensi.data.kemendikdasmen.go.id` | ❌ EGRESS_BLOCKED |
| BPS Kubu Raya Dalam Angka 2026 | `kuburayakab.bps.go.id` | ❌ EGRESS_BLOCKED |
| Portal puskesmas (service population) | `pkm-kubu.kuburayakab.go.id` | ❌ EGRESS_BLOCKED |

---

## 1. Sekolah dengan Actual Student Count

**0 dari 7.**

| record_id | NPSN | Status |
|---|---|---|
| EDU-001 … EDU-007 | 7 NPSN target | `not_available` — belum diakuisisi |

## 2. Sekolah Tanpa Student Count

**7 dari 7.** Seluruhnya `beneficiary_value = NULL`, `beneficiary_type = unknown`, dengan `why_null` yang menyebut domain yang diblokir dan tanggal ujinya.

Tidak satu pun diisi dengan populasi desa/kecamatan — itu kategori berbeda dan dilarang eksplisit.

## 3. Puskesmas dengan Official Service Population

**0 dari 3.** Tidak ada LEVEL 1 (service population terkait puskesmas) maupun LEVEL 2 (catchment resmi dari Profil Kesehatan/Dinkes) yang berhasil diakses.

## 4. Puskesmas dengan Geographic Proxy

**0 dari 3.** LEVEL 3 (proksi populasi kecamatan) **sengaja tidak diterapkan**, karena dua alasan independen:

1. **Data sumbernya sendiri belum diakuisisi** — BPS 2026 diblokir, jadi angka populasi kecamatan pun tidak ada.
2. **Proksi akan tidak aman meski datanya ada** — lihat §8.

## 5. Beneficiary NULL

**10 dari 10 (100%).**

Seluruhnya `beneficiary_value` kosong (bukan 0), `beneficiary_type = unknown`, `verification_status = not_available`, dan `why_null` terisi.

## 6. Source Years

**Tidak ada** — tidak ada observasi yang memiliki `data_year` atau `data_reference_date`, karena tidak ada nilai yang diperoleh.

Aturan yang sudah disiapkan untuk akuisisi berikutnya: `retrieved_at` (kapan portal dibuka) ≠ `data_reference_date` (kapan data berlaku) ≠ `publication_date` ≠ `data_year`. Keempatnya adalah kolom terpisah dan tidak boleh disamakan.

## 7. Proxy Usage

**Nol proksi digunakan.** Seluruh record `is_proxy = false` dan `proxy_level` kosong — bukan karena proksi ditolak sebagai metode, melainkan karena tidak ada nilai apa pun yang diperoleh untuk diproksikan.

## 8. 🔴 Proxy Overlap Risk — temuan material pass ini

| record_id | district | `proxy_overlap_risk` | Dasar |
|---|---|---|---|
| HLT-001 Padang Tikar | BATU AMPAR | **true** | Satu kecamatan dengan HLT-002 |
| HLT-002 Sungai Kerawang | BATU AMPAR | **true** | Satu kecamatan dengan HLT-001 |
| HLT-003 Kubu | KUBU | **unknown** | Tidak dapat dikesampingkan adanya puskesmas lain di Kec. Kubu |
| EDU-001 … EDU-007 | — | false | `student_count` bersifat facility-level, tidak memerlukan proksi |

**Mengapa ini penting sekarang, bukan nanti:** dua dari tiga puskesmas target berada di Kecamatan Batu Ampar. Bila populasi kecamatan diberikan penuh ke masing-masing, penduduk yang sama dihitung dua kali, dan kedua fasilitas akan tampak melayani seluruh kecamatan. Dalam sistem prioritisasi, kesalahan ini tidak netral — ia **menggelembungkan bobot Batu Ampar** relatif terhadap kecamatan lain, tepat di wilayah yang juga memiliki konsentrasi kandidat tertinggi (5 dari 10 fasilitas) dan ketiga PLTS eksisting.

**Status HLT-003 sengaja `unknown`, bukan `false`.** Kita tahu ada 20 puskesmas di Kubu Raya (EV-J), tetapi `district` seluruhnya masih kosong — sehingga keberadaan puskesmas lain di Kecamatan Kubu belum dapat dikesampingkan. Mengisi `district` pada REQ-HEALTH-01 akan menyelesaikan ini.

**Konsekuensi metodologis (dicatat, belum diputuskan):** bila LEVEL 1/2 tidak pernah tersedia, opsi yang tersisa bukan hanya "pakai proksi kecamatan" vs "NULL". Ada opsi ketiga — mengeluarkan beneficiary dari scoring untuk fasilitas kesehatan dan menyatakannya sebagai keterbatasan eksplisit. §R sendiri mengizinkan jalur ini. Keputusan ada di tahap metodologi, bukan di sini.

## 9. Source Conflicts

**Tidak ada.** Konflik memerlukan minimal dua sumber dengan nilai berbeda; nol nilai diperoleh, sehingga tidak ada yang dapat bertentangan. `research/SOURCE_CONFLICTS.md` tidak diubah pada pass ini.

## 10. Manual Acquisition Requirements

Tiga permintaan ditambahkan ke `research/MANUAL_ACQUISITION_REQUESTS.md`:

| ID | Isi | Prioritas |
|---|---|---|
| **REQ-BEN-EDU-01** | `student_count_total` untuk 7 NPSN target + tanggal referensi data | **TINGGI — penentu gate** |
| **REQ-BEN-HEALTH-01** | Service/work-area population untuk 3 puskesmas (LEVEL 1/2) | SEDANG-TINGGI |
| **REQ-BEN-BPS-01** | Populasi kecamatan Batu Ampar &amp; Kubu + reference_year tabel | RENDAH (fallback saja) |

Masing-masing memuat record_id, NPSN/identifier, field persis, sumber preferensi, fallback yang boleh dan yang dilarang, format, serta destination path.

---

## GATE DECISION

### ⛔ BENEFICIARY ACQUISITION GATE: **TIDAK PASS**

| Syarat | Ambang | Hasil |
|---|---|---|
| Sekolah dengan `student_count` aktual terverifikasi | ≥ 5 dari 7 | **0 dari 7** ❌ |
| Health: contextual population dengan provenance & proxy status jelas **ATAU** alasan terdokumentasi untuk mengeluarkan health beneficiary sementara | salah satu | ⚠️ Alasan terdokumentasi (egress) ada, tetapi syarat ini **tidak dapat menutupi** kegagalan arm sekolah |

Gate mensyaratkan **DAN** antara kedua arm. Arm sekolah gagal total, sehingga gate tidak dapat lolos.

**Penyebabnya tunggal dan bukan kegagalan metodologi:** environment agent tidak dapat menjangkau sumber. Seluruh jalur sumber sudah terverifikasi ada (EV-G, EV-I, EV-B) dan URL per-NPSN sudah pasti — yang hilang hanya aksesnya.

### Paket akuisisi eksternal yang dibutuhkan untuk membuka gate

**Minimum untuk PASS:** `student_count_total` untuk **minimal 5 dari 7** NPSN berikut, dengan tanggal referensi data:

`30101104` · `30101107` · `30100908` · `30101121` · `30108035` · `30101619` · `30109720`

**Disarankan menyertai:** service/work-area population untuk 3 puskesmas (REQ-BEN-HEALTH-01), atau pernyataan bahwa LEVEL 1/2 tidak tersedia — karena pernyataan itu sendiri sudah cukup untuk memenuhi arm kedua lewat jalur "alasan terdokumentasi".

**Tidak perlu dikirim kecuali health LEVEL 1/2 gagal:** populasi kecamatan BPS (REQ-BEN-BPS-01).

### Batasan yang dibawa ke tahap berikutnya

1. `electricity_source` (PLN / Diesel / Tidak Ada) **tidak** dipakai untuk menghitung beneficiary apa pun pada pass ini, dan **tidak** boleh menjadi energy-need score tanpa keputusan metodologi eksplisit.
2. Proksi populasi kecamatan untuk Batu Ampar **tidak aman** tanpa pembagian wilayah kerja yang jelas.
3. Record identity-only (HF-001…HF-020) **tidak** diperlakukan sebagai kandidat tambahan — hanya dipertahankan untuk provenance/dedup audit.
4. Nol nilai beneficiary berarti **Data Confidence untuk dimensi ini akan rendah**, dan itu harus tampil apa adanya, bukan ditutup dengan proksi.

*Catatan administratif: Prompt 3B merujuk `data/interim/IMPORT_LOG.md`; file tersebut sebenarnya berada di `data/raw/external_manual/2026-09-12/IMPORT_LOG.md` (bersama paket mentahnya). Tidak ada file yang hilang — hanya perbedaan path pada instruksi.*
