# VERIFICATION_REPORT.md — Laporan Verifikasi Evidence SURYA-SIAGA

**Pass terakhir:** Prompt 2.6 — External Evidence Handoff & Research Gate Update
**Tanggal:** 2026-09-12
**Status keseluruhan:** ✅ **READY FOR PROMPT 3 — CONDITIONAL DATA ACQUISITION**

---

# ADENDUM PROMPT 2.6 — EXTERNAL EVIDENCE HANDOFF

> ℹ️ **Sumber verifikasi:** delapan evidence (EV-A s.d. EV-H) diverifikasi **di environment lain yang tidak terkena pembatasan egress**, bukan oleh environment agent ini. Seluruhnya dicatat dengan `verification_method: external_manual_verification`. **Agent ini tidak membuka URL tersebut.** Laporan Prompt 2.5 di bawah adendum ini **tetap dipertahankan utuh** sebagai catatan metodologis keterbatasan environment agent.

## Perubahan Gate

| Komponen | Prompt 2.5 | **Prompt 2.6** | Evidence |
|---|---|---|---|
| Pilot identity | ⚠️ Provisional | ✅ **VERIFIED PATHWAYS** | EV-B, EV-C, EV-F |
| Solar source | ❌ Belum cukup | ✅ **VERIFIED** — GSA primary, NASA POWER supporting | EV-D, EV-E |
| Disaster source | ❌ Belum cukup | ✅ **VERIFIED** — layer karhutla &amp; kekeringan ada | EV-C |
| Social source | ❌ Belum cukup | ✅ **VERIFIED** — BPS edisi 2026 | EV-B |
| Facility source (pendidikan) | ❌ Blocker | ✅ **VERIFIED DATA PATH** — termasuk jalur koordinat | EV-G |
| Facility source (kesehatan) | ❌ Blocker | ✅ **VERIFIED DATA PATH** | EV-H |
| Existing PLTS | ❌ Belum cukup | ✅ **VERIFIED HISTORICAL** (penyerahan aset 2021) | EV-F |
| National policy context | ⚠️ Konteks saja | ✅ **VERIFIED** (tanpa angka turunan) | EV-A |

## ✅ KEPUTUSAN GATE: READY FOR PROMPT 3 — CONDITIONAL DATA ACQUISITION

**"Conditional" berarti:** data **boleh dikumpulkan**, tetapi **belum boleh digunakan untuk scoring** sebelum Prompt 4–6.

### Lima syarat yang mengikat

1. **Verification dilakukan per-field** — sumber terverifikasi tidak membuat seluruh field-nya terverifikasi.
2. **Conflicting fields tetap `NULL`** — `capacity_kwp` (CF-001), `commissioning_year` (CF-006).
3. **Historical fields diberi tahun** — mis. `asset_handover_year = 2021` dengan label historis.
4. **Current status tidak disimpulkan dari historical evidence** — penyerahan aset 2021 ≠ status operasional 2026.
5. **Acquisition result diaudit ulang sebelum scoring.**

### Yang TIDAK berubah meski gate dibuka

- Seluruh **angka** tentang Kubu Raya tetap `DO_NOT_USE` (kapasitas, KK terlayani, skor IRBI, angka investasi program nasional, nilai GHI).
- **CF-001, CF-003, CF-005, CF-006 tetap UNRESOLVED.**
- **IRBI tetap dilarang** sebagai site-level scoring input pada MVP.
- **Klaim novelty berbasis ketiadaan fitur pesaing tetap terlarang** — audit competitor matrix tidak tersentuh external verification.
- **Lisensi Global Solar Atlas belum terverifikasi** — wajib dikonfirmasi sebelum redistribusi data.
- **Koordinat puskesmas belum terverifikasi** — hanya jalur sekolah yang terbukti.

### Interpretasi angka "1 dari 60 verified"

Angka tersebut **tidak lagi menjadi alasan menghentikan proyek**. Angka itu mencerminkan **keterbatasan environment agent** (`EGRESS_BLOCKED`), bukan kegagalan sumber dunia nyata. Setelah handoff eksternal, ukuran yang relevan bukan "berapa persen evidence terverifikasi", melainkan **"apakah setiap komponen utama MVP memiliki jalur sumber yang terverifikasi"** — dan jawabannya kini **ya untuk keenam komponen**.

---

# LAPORAN PROMPT 2.5 (dipertahankan sebagai catatan metodologis)

**Pass:** Prompt 2.5 — Evidence Verification &amp; Research Repair
**Status pada saat itu:** ❌ NOT READY FOR PROMPT 3

---

## Ringkasan Eksekutif

Verification pass ini bertujuan menaikkan status evidence dari `unverified` menjadi `verified_primary`/`verified_secondary` dengan membuka sumber aslinya. **Tujuan itu tidak tercapai.** WebFetch diuji terhadap 7 domain prioritas Level-1 dan **ditolak seluruhnya** dengan `EGRESS_BLOCKED` — penolakan kebijakan egress organisasi. Diagnostik proxy menunjukkan proxy sendiri sehat; README proxy secara eksplisit melarang mencoba menerobos penolakan kebijakan.

Sesuai prinsip mutlak task ini ("Jika environment masih tidak memungkinkan: JANGAN memaksa"), **tidak ada satu pun status yang dinaikkan.**

Namun pass ini **tetap menghasilkan perbaikan substantif** pada bagian yang tidak memerlukan jaringan — dan beberapa di antaranya mengoreksi kesalahan nyata dari Prompt 2:

| Perbaikan | Dampak |
|---|---|
| CF-002 direklasifikasi dari "conflicting" → `DIFFERENT_METRIC` | Mengoreksi kesalahan klasifikasi: membandingkan *bahaya* dengan *risiko* seolah keduanya angka yang sama |
| Seluruh status NO di competitor matrix → UNKNOWN | **Klaim novelty berbasis ketiadaan fitur runtuh** — harus diganti framing "integration value" |
| 2 dataset "READY_FOR_ACQUISITION" → diturunkan | Prompt 2 menandai READY berdasarkan metode akses, bukan spesifikasi terverifikasi |
| IRBI dikeluarkan sebagai input skoring situs | Dua alasan independen: skala belum terverifikasi **dan** nilainya identik untuk semua kandidat dalam satu kabupaten |
| Per-field verification untuk 3 situs PLTS | Memisahkan field yang layak pakai dari yang harus NULL — mencegah 1 field buruk membuang seluruh situs |
| Penemuan pola "evidence kuat di level kabupaten, kosong di level situs" | Temuan paling penting untuk kelayakan MVP |

---

## 1. Evidence Successfully Verified

| EV | Klaim | Status | Cara verifikasi |
|---|---|---|---|
| EV-014 | Dimensi kualitas data DAMA-DMBOK2 | `verified_secondary` | Halaman GitHub berhasil dibuka penuh pada Prompt 2 (satu-satunya domain yang lolos) |

**Total: 1 dari ~60 evidence (1,7%).** Tidak bertambah dari Prompt 2. Ini pun sumber sekunder (ringkasan pihak ketiga atas DMBOK2), bukan dokumen resmi DAMA.

**Verifikasi baru pada pass ini: 0.**

---

## 2. Evidence Still Unverified

**Total: 56 entri tetap `unverified`, seluruhnya ditandai `MANUAL_VERIFICATION_REQUIRED`.**

Yang paling kritis (fondasi proyek, semuanya gagal diverifikasi):

| Prioritas | Evidence | Mengapa kritis |
|---|---|---|
| ⭐ | EV-020–023 (spesifikasi Global Solar Atlas) | Menentukan apakah GSA layak jadi primary solar dataset — **satu-satunya kandidat sumber surya yang tersisa** |
| ⭐ | EV-028–031 (metodologi &amp; akses InaRISK) | Menentukan apakah data bahaya/risiko dapat diunduh dan di-overlay ke titik kandidat |
| ⭐ | EV-038–039 (PLTS Batu Ampar) | Fondasi jalur "Expansion Assessment" |
| ⭐ | EV-048, EV-051 (koordinat fasilitas) | Prasyarat mutlak seluruh fitur geospasial |
| ⭐ | EV-053 (statistik BPS + keberadaan edisi 2026) | Fondasi dimensi sosial |
| — | EV-001–007 (kebijakan nasional) | Konteks, bukan fondasi |
| — | EV-008–013 (literatur MCDA) | Justifikasi metodologi — penting untuk proposal, bukan untuk MVP |

---

## 3. Evidence Rejected

Evidence yang **ditolak untuk digunakan** (`DO_NOT_USE`), dengan alasan spesifik:

| EV | Alasan penolakan |
|---|---|
| EV-002 | Angka investasi (USD 28,9 miliar) belum diverifikasi — §A.1 melarang menambah angka investasi/penghematan yang belum diverifikasi |
| EV-003 | Angka kapasitas tahap tertentu (4,6 GW/2027 dst.) — larangan yang sama |
| EV-019 | Data provinsi lain (Kalimantan Timur), bukan Kalbar — tidak relevan, hanya pola analog |
| EV-039 | Seluruh angka kapasitas &amp; KK terlayani — `conflicting`, satuan tidak diketahui, scope tidak diketahui (CF-001) |
| EV-041 | Program "Desa BRILian" adalah program ekonomi BRI, **bukan** indikator status kelistrikan/PLTS — berisiko disalahgunakan sebagai "bukti desa berkembang berkat PLTS" |
| EV-046 | Lokasi "PLTS Kubu" ambigu (CF-005) |
| — | Unggahan Instagram tentang rilis publikasi BPS | Media sosial dilarang sebagai sumber fakta teknis (§9 `PROJECT_CONTEXT.md`) |
| — | Dokumen Scribd daftar sekolah | Unggahan pihak ketiga tanpa provenance resmi |

**Catatan:** penolakan EV-002/EV-003 adalah contoh penting — keduanya berasal dari sumber yang sah dan kemungkinan besar benar, tetapi merupakan **angka spesifik yang belum diverifikasi**, dan instruksi §A.1 melarangnya secara eksplisit. Keberadaan program PLTS 100 GWp sendiri tetap boleh dipakai sebagai konteks tanpa angka.

---

## 4. Conflicts Resolved

**Total: 1 dari 5.**

| ID | Resolusi |
|---|---|
| **CF-002** | **Bukan konflik.** Direklasifikasi sebagai `DIFFERENT_METRIC`: satu studi mengukur **bahaya karhutla** (kondisi biofisik), satunya mengukur **risiko karhutla** (bahaya × kerentanan ÷ kapasitas). Sebuah area dapat berbahaya tinggi namun berisiko rendah secara bersamaan — kedua temuan bisa benar sekaligus. Prompt 2 keliru memperlakukannya sebagai kontradiksi numerik. |

Resolusi ini dicapai **tanpa membuka sumber**, murni dari analisis definisi metrik — menunjukkan bahwa sebagian "konflik" pada Prompt 2 sebenarnya adalah kesalahan klasifikasi, bukan masalah data.

**Konsekuensi produk yang muncul dari resolusi ini:** SURYA-SIAGA harus memutuskan secara eksplisit apakah field `wildfire_risk` (§8 `PROJECT_CONTEXT.md`) merepresentasikan **bahaya** atau **risiko** — keduanya tidak dapat dipertukarkan dan berasal dari sumber berbeda. Keputusan ini **belum diambil** dan perlu masuk unresolved decisions.

---

## 5. Conflicts Unresolved

**Total: 4 dari 5.**

| ID | Klasifikasi | Mengapa belum selesai | Tindakan |
|---|---|---|---|
| CF-001 | `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` + kandidat `DIFFERENT_SCOPE` | Sumber asli (BPK Kalbar) tidak dapat dibuka | **Kapasitas tetap NULL.** Tidak memilih 150 maupun 250. |
| CF-003 | `DIFFERENT_METRIC` (dugaan) | Dokumentasi IRBI tidak dapat dibuka | **IRBI dilarang jadi input skoring situs** — dua alasan independen |
| CF-004 | `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` | Parameter dictionary NASA POWER tidak dapat dibuka | Dampak berkurang: peran NASA POWER direklasifikasi `NOT_REQUIRED` untuk screening spasial |
| CF-005 | `UNRESOLVED` (ambiguitas identifikasi) | Artikel Mongabay tidak dapat dibuka | `DO_NOT_USE` sampai lokasi dipastikan |

> **Temuan penting:** setelah audit, **nol `TRUE_CONFLICT` yang terkonfirmasi.** Semua yang sebelumnya disebut "konflik" ternyata adalah perbedaan metrik, perbedaan scope, atau kemungkinan artefak ringkasan pencarian. Ini melemahkan asumsi Prompt 2 bahwa data Kubu Raya "saling bertentangan" — kemungkinan besar data tersebut konsisten, hanya belum pernah dibaca dengan benar.

---

## 6. Search-Snippet Artifacts Suspected

Perbedaan yang **diduga berasal dari proses ringkasan mesin pencari**, bukan dari sumber asli:

| Kasus | Indikasi |
|---|---|
| CF-001 (150 vs 250) | Kedua "sumber" tidak pernah dibuka; mungkin merangkum halaman yang sama, atau salah membaca angka dari kalimat/tabel yang sama. Satuan hilang di kedua versi — ciri khas ekstraksi ringkasan. |
| CF-004 (Wh/m² vs kWh/m²/day) | NASA POWER punya beberapa endpoint temporal dengan satuan berbeda; ringkasan kemungkinan mencampur endpoint. |
| EV-039 ("312 rumah tangga") | Angka konsisten muncul tapi scope-nya (1 desa atau 3 desa) hilang di seluruh ringkasan — informasi konteks kemungkinan terpotong saat perangkuman. |
| EV-038 (tanggal publikasi "~2021") | Tanggal muncul sebagai inferensi mesin pencari, bukan kutipan — ditandai "tidak dapat dipastikan". |
| EV-053 (data_year 2024) | Awalnya "asumsi pola penamaan BPS"; pencarian Prompt 2.5 memberi dukungan ("statistics during 2024") tapi tetap snippet-level. |

**Implikasi metodologis:** kategori artefak ini menjelaskan mengapa "jumlah konflik" pada Prompt 2 kemungkinan **dilebih-lebihkan**. Riset berbasis snippet cenderung menghasilkan konflik semu karena konteks (satuan, scope, tahun) adalah bagian pertama yang hilang saat diringkas.

---

## 7. Sources Requiring Manual Human Access

**Seluruh 42 sumber non-GitHub memerlukan akses manusia.** Prioritas tertinggi (6 blocker):

| # | Sumber | URL | Yang harus dicatat |
|---|---|---|---|
| 1 | Global Solar Atlas — download Indonesia | globalsolaratlas.info/download | GHI, satuan, resolusi, CRS, format, agregasi, lisensi |
| 2 | InaRISK — metodologi &amp; layer | inarisk.bnpb.go.id/metodologi + /webgis + gis.bnpb.go.id REST | Bahaya vs risiko, skala/kelas, tahun data, mekanisme unduh |
| 3 | BPK Kalbar — hibah PLTS 3 desa | kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/ | Kapasitas + **satuan** + desa + agregat/individual + tahun |
| 4 | BPS Kubu Raya — daftar publikasi | kuburayakab.bps.go.id/publication | **Apakah edisi 2026 ada**; publication_date vs data_year |
| 5 | Kemendikdasmen — referensi sekolah | referensi.data.kemendikdasmen.go.id/.../131300/... | Field tersedia, terutama **koordinat** |
| 6 | Portal Puskesmas Kubu Raya | puskesmas.kuburayakab.go.id | Field tersedia, terutama **koordinat**; keseragaman data |

Daftar lengkap 18 item: lihat `DATA_ACQUISITION_PLAN.md` § MANUAL_VERIFICATION_REQUIRED.

---

## 8. Safe Proposal Claims

Klaim yang **boleh** masuk proposal saat ini, dengan kualifikasi yang menyertainya:

| Klaim | Status | Kualifikasi wajib |
|---|---|---|
| Dimensi kualitas data (DAMA-DMBOK2) sebagai basis konseptual Data Confidence | `SAFE_TO_USE` | Sebut sebagai "ringkasan pihak ketiga atas DMBOK2"; jangan klaim mengadopsi DAMA secara resmi |
| Terdapat momentum nasional pengembangan PLTS (program PLTS 100 GWp) | `SAFE_AS_CONTEXT_ONLY` | **Tanpa angka apa pun.** Hanya sebagai konteks momentum. Sitasi wajib dikonfirmasi sebelum submit. **Jangan** klaim pemerintah membutuhkan SURYA-SIAGA |
| Kubu Raya memiliki PLTS komunal eksisting di Kecamatan Batu Ampar | `SAFE_AS_CONTEXT_ONLY` | Keberadaan saja, **tanpa kapasitas/jumlah KK** |
| Kubu Raya disebut dalam klasifikasi risiko kekeringan BNPB | `SAFE_AS_CONTEXT_ONLY` | Konteks kabupaten; **jangan** kutip skor numerik (skala belum terverifikasi) |
| Kubu Raya termasuk kabupaten prioritas pemetaan karhutla gambut Kalbar | `SAFE_AS_CONTEXT_ONLY` | Sebutkan bahwa petanya masih dalam finalisasi |
| Data historis PLTS Sumber Agung (2018) | `SAFE_WITH_HISTORICAL_LABEL` | Label `Historical Data` + `Current Status Requires Verification` (§11 `PROJECT_CONTEXT.md`), **tanpa angka yang conflicting** |
| MCDA/AHP adalah metode mapan untuk siting energi terbarukan | `SAFE_AS_CONTEXT_ONLY` | Sitasi wajib dikonfirmasi sebelum dicantumkan sebagai referensi formal |
| SURYA-SIAGA mengintegrasikan solar + risiko bencana + criticality + sosial + PLTS eksisting dalam satu kerangka explainable | **Aman** | Ini deskripsi **desain sendiri** — tidak memerlukan bukti eksternal |

---

## 9. Unsafe Proposal Claims

Klaim yang **DILARANG** masuk proposal:

| Klaim terlarang | Alasan |
|---|---|
| Angka kapasitas PLTS Batu Ampar (100/150/250 kWp) | `conflicting`, satuan &amp; scope tidak diketahui (CF-001) |
| "329 dari 402 KK terlayani, gap 73 KK" | Tidak cocok dengan temuan riset (312 KK); belum diverifikasi dari sumber mana pun |
| Angka investasi/penghematan program PLTS 100 GWp (USD 28,9 miliar) | Belum diverifikasi; dilarang §A.1 |
| Angka kapasitas per tahun PLN (4,6 GW di 2027 dst.) | Idem |
| Skor IRBI Kubu Raya (34,21 / 36,00) | Skala, range, dan level analisis belum terverifikasi (CF-003) |
| **"Belum ada platform seperti ini di Indonesia" / "pertama di Indonesia"** | **Setelah audit, seluruh status NO pada competitor matrix menjadi UNKNOWN** — ketiadaan fitur pada tool lain tidak terbukti, hanya tidak terlihat |
| Tabel perbandingan fitur yang menampilkan "tidak ada" untuk tool pesaing | Alasan yang sama |
| Nilai GHI spesifik untuk lokasi mana pun di Kubu Raya | Belum pernah diambil maupun diverifikasi |
| Klaim bahwa PLTS 2018 "gagal" atau "terbengkalai" | Inferensi, bukan temuan. Tidak ada sumber tentang kondisi terkini |
| Klaim adanya kerja sama/dukungan Pemda/PLN/ESDM | §5.4 `PROJECT_CONTEXT.md` — tidak ada bukti apa pun |
| Persentase bahaya/risiko karhutla sebagai angka tunggal "risiko Kubu Raya" | `DIFFERENT_METRIC` — tidak boleh digabung/dirata-rata (CF-002) |

---

## 10. Data Ready for Acquisition

**Tidak ada.**

| Kategori | Jumlah |
|---|---|
| `READY_FOR_AUTOMATED_ACQUISITION` | **0** |
| `READY_FOR_MANUAL_ACQUISITION` | **0** |

Sesuai aturan §L ("jangan tandai READY jika evidence dasarnya belum terverifikasi"), dua dataset yang Prompt 2 tandai READY (Global Solar Atlas, NASA POWER) **diturunkan**:

- **Global Solar Atlas** → `MANUAL_VERIFICATION_REQUIRED`. Satu langkah manusia (membuka halaman download) akan langsung memindahkannya ke `READY_FOR_MANUAL_ACQUISITION`.
- **NASA POWER** → `NOT_REQUIRED` untuk screening spasial (resolusi grid jauh melebihi luas kabupaten); perannya ditetapkan sebagai **historical/time-series validation** sesuai keputusan §A.5.

---

## 11. Blocking Issues Before Prompt 3

Sesuai stop condition §N, Prompt 3 hanya boleh direkomendasikan bila enam komponen utama memiliki jalur sumber yang cukup. Evaluasi:

| Komponen | Jalur sumber | Status |
|---|---|---|
| **Pilot identity** (Kubu Raya) | Teridentifikasi, evidence kabupaten cukup meyakinkan | ⚠️ Provisional — belum terverifikasi |
| **Solar source** | Global Solar Atlas teridentifikasi, spesifikasi belum dikonfirmasi | ❌ Belum cukup |
| **Disaster source** | InaRISK teridentifikasi; bahaya-vs-risiko belum ditentukan; IRBI dikeluarkan sebagai input situs | ❌ Belum cukup |
| **Social source** | BPS teridentifikasi; granularitas hanya kecamatan; `beneficiary_count` per fasilitas `NOT_AVAILABLE` | ❌ Belum cukup |
| **Facility source** | Portal teridentifikasi; **koordinat `NOT_AVAILABLE`** | ❌ **Blocker terberat** |
| **Existing PLTS source** | Keberadaan plausibel; seluruh atribut kuantitatif `DO_NOT_USE` | ❌ Belum cukup |

### ❌ NOT READY FOR PROMPT 3

**Lima dari enam komponen utama belum memiliki jalur sumber yang cukup.**

### Yang harus dilakukan manusia sebelum Prompt 3

1. **Buka 6 sumber blocker** (§7 di atas) di browser biasa, catat kutipan verbatim + satuan + tahun data, simpan sebagai bukti (screenshot/salinan teks) ke `data/raw/`.
2. **Putuskan masalah koordinat fasilitas** — ini blocker terberat karena `NOT_AVAILABLE` dari seluruh sumber publik. Opsi: (a) cek apakah portal menyediakannya setelah dibuka manual; (b) permintaan data resmi ke Dinkes/Dinas Pendidikan Kubu Raya; (c) geocoding manual dari alamat; (d) digitasi manual via peta. Opsi (b) dan (c)/(d) memiliki implikasi akurasi dan waktu yang berbeda.
3. **Putuskan definisi `wildfire_risk`** — bahaya atau risiko (konsekuensi CF-002).
4. **Putuskan pendekatan `beneficiary_count`** — proxy kecamatan berlabel eksplisit, atau data primer dari fasilitas.
5. **Putuskan penanganan ketidaksesuaian angka `PROJECT_CONTEXT.md` §11** setelah sumber BPK dibuka.
6. **Pertimbangkan menjalankan riset ini di lingkungan dengan akses internet penuh** — sebagian besar blocker di atas akan selesai otomatis bila WebFetch tersedia.

### Alternatif jika verifikasi manual tidak memungkinkan sekarang

Jika verifikasi penuh tidak dapat dilakukan sebelum tenggat kompetisi, opsi yang **tidak melanggar integritas data**:

- **Persempit scope MVP** ke fasilitas yang datanya dapat diperoleh langsung (mis. hanya Kecamatan Batu Ampar, di mana ketiga PLTS eksisting berada), dengan koordinat hasil digitasi manual yang dilabeli sebagai estimasi.
- **Tampilkan seluruh dataset dengan label `NEEDS VERIFICATION`** — ini justru konsisten dengan positioning produk (§16 `PROJECT_CONTEXT.md`: "TRANSPARANSI LEBIH PENTING DARIPADA PRESISI PALSU") dan mendemonstrasikan fitur Data Confidence secara nyata, alih-alih menyembunyikan kelemahan data.

Yang **tidak boleh** dilakukan: mengisi field kosong dengan angka perkiraan, memilih salah satu angka conflicting, atau menampilkan data historis seolah kondisi terkini.
