# RESEARCH_FINDINGS.md — Ringkasan Riset SURYA-SIAGA (Prompt 2)

---

## Executive Summary

Riset ini dilakukan melalui 4 investigasi paralel berbasis pencarian web (kebijakan nasional &amp; metodologi; data teknis solar/disaster; PLTS eksisting &amp; data fasilitas Kubu Raya; competitor tool matrix), membaca penuh `PROJECT_CONTEXT.md`, `docs/PRODUCT_AUDIT.md`, dan `docs/PROPOSAL_STRENGTHENING.md` terlebih dahulu.

**Temuan metodologis paling penting, yang membingkai SELURUH hasil di bawah:** lingkungan eksekusi sesi ini memblokir tool WebFetch (akses langsung ke halaman web) untuk **hampir semua domain eksternal** — situs pemerintah `.go.id`, jurnal ilmiah (Elsevier/Springer/Nature/arXiv), World Bank, NASA, ResearchGate, Wikipedia — hanya GitHub yang bisa diakses penuh. Akibatnya, hampir seluruh evidence yang dikumpulkan berasal dari **ringkasan hasil pencarian (WebSearch), bukan pembacaan halaman sumber asli**. Sesuai prinsip §Faktualitas Wajib pada task ini, seluruh temuan ditandai `unverified` kecuali satu (definisi kualitas data DAMA-DMBOK2 via GitHub, `verified_secondary`). **Tidak ada satu pun temuan berstatus `verified_primary`.** Ini adalah keterbatasan lingkungan riset, bukan indikasi bahwa datanya tidak ada atau salah — tapi berarti tidak satu pun boleh diperlakukan sebagai fakta produksi sampai dikonfirmasi ulang oleh sesi/manusia dengan akses internet penuh.

Dengan caveat itu, riset tetap menghasilkan pemetaan yang cukup rinci: Kubu Raya punya evidence disaster-relevance dan existing-PLTS yang genuinely spesifik dan didukung sumber resmi (bukan sekadar diasumsikan tim); ekosistem data publik Indonesia (BPS, InaRISK, Kemendikdasmen, portal daerah) aktif dan terstruktur tapi granularitasnya sering hanya sampai level kecamatan; literatur MCDA/AHP untuk siting energi terbarukan established dan bahkan ada studi kasus persis di Kalimantan Barat; dan tidak satu pun tool kompetitor yang diperiksa menggabungkan seluruh dimensi SURYA-SIAGA dalam satu skor — meski banyak status masih UNKNOWN karena dokumentasi tidak terbaca penuh.

---

## Strong Evidence

- **Program PLTS Komunal 2018 di 3 desa Kecamatan Batu Ampar** (Sumber Agung, Muara Tiga, Sungai Kerawang) — dikonfirmasi via BPK Perwakilan Kalbar, konsisten dengan asumsi awal `PROJECT_CONTEXT.md` §11 tapi mengungkap 2 lokasi tambahan yang belum tercatat (EV-038).
- **IRBI BNPB 2023 &amp; 2024 mengklasifikasikan Kubu Raya sebagai risiko kekeringan "TINGGI"** secara eksplisit dan konsisten lintas 2 tahun terbitan — evidence resmi paling spesifik-Kubu Raya dalam seluruh riset ini (EV-032).
- **Kubu Raya ditetapkan sebagai salah satu dari 3 kabupaten prioritas** dalam inisiatif pemerintah 2025–2026 (Kemenhut+BRIN+YKAN) untuk pemetaan risiko karhutla gambut Kalbar, menyumbang ~77% luas karhutla Kalbar (EV-033).
- **3 studi akademik independen membahas karhutla Kubu Raya secara spesifik dan mendalam** — menunjukkan topik ini genuinely diteliti, bukan wilayah yang diabaikan literatur (EV-034, 035, 036).
- **Perbedaan resolusi teknis Global Solar Atlas (~250m) vs NASA POWER (~55×70km)** — temuan metodologis yang solid dan konsisten lintas beberapa sumber independen, penting untuk keputusan tech-stack data solar (EV-020, EV-026).
- **Literatur GIS-AHP MCDA untuk siting PLTS sudah established**, termasuk satu studi (SolarBoost) dengan lokasi studi PERSIS di Kalimantan Barat (EV-008) — mengonfirmasi metode yang dipilih `PROJECT_CONTEXT.md` §12 bukan pilihan sembarangan.
- **DAMA-DMBOK2 memberikan basis konseptual nyata untuk 4 dari 5 dimensi Data Confidence** yang diinginkan (§12.1 `PROJECT_CONTEXT.md`) — satu-satunya sumber yang berhasil diverifikasi penuh dalam riset ini (EV-014).
- **Ekosistem portal data resmi Kubu Raya aktif dan berlapis**: BPS (kabupaten + kecamatan), portal puskesmas kabupaten, platform fasyankes provinsi, referensi Kemendikdasmen, open data kabupaten — semuanya eksis dan terstruktur (meski isi belum terverifikasi penuh).

---

## Weak Evidence

- Angka kebijakan nasional (PLTS 100 GWp, RUPTL 2025-2034, target USD28,9 miliar) — konsisten muncul di banyak sumber sekunder tapi TIDAK SEKALI dikonfirmasi dari dokumen primer (PDF RUPTL resmi tidak terbuka).
- Seluruh 6 paper akademik MCDA/AHP (EV-008 s.d. EV-013) — sangat relevan tapi tidak satu pun dibuka langsung, hanya ringkasan pencarian.
- Feature matrix competitor tools (`COMPETITOR_TOOL_MATRIX.md`) — mayoritas status UNKNOWN, bukan YES/NO pasti, karena dokumentasi tidak terbaca penuh. Klaim novelty berdasarkan matriks ini masih tentatif.
- Data rasio elektrifikasi Kalbar per-kabupaten (EV-018) — sumbernya ada tapi datanya sudah berumur (2019/2020), belum dicek versi terbaru.

---

## Missing Evidence

- Tidak ada dokumen resmi pemerintah Indonesia yang secara eksplisit menyebut metodologi "site prioritization"/MCDA untuk lokasi PLTS — yang ada hanya laporan seleksi lahan berbasis ketersediaan aset (EV-006).
- Koordinat geografis presisi untuk puskesmas/sekolah individual di Kubu Raya — tidak terkonfirmasi tersedia di sumber publik manapun.
- Jumlah penerima manfaat (beneficiary_count) pada granularitas per-fasilitas individual — hanya ditemukan di level kecamatan/kabupaten, yang menurut aturan tugas ini sendiri (§H) TIDAK BOLEH disamakan dengan penerima manfaat spesifik satu fasilitas.
- Rincian kapasitas/BESS terpisah per-desa untuk Muara Tiga dan Sungai Kerawang (hanya ada angka agregat 3-desa).
- Kondisi teknis terkini (baterai, kerusakan, dsb.) ketiga PLTS Batu Ampar.
- Satu framework tunggal bernama yang menyatukan kelima dimensi Data Confidence yang diinginkan (source authority, recency, completeness, verification, conflicting evidence) — tidak ditemukan; DAMA-DMBOK2 hanya mencakup 4 dari 5.
- Konfirmasi apakah Kubu Raya termasuk dalam 136 kabupaten/kota yang dipetakan InaRISK pada skala lebih rinci (1:50.000/1:25.000).
- Dokumen KRB Provinsi Kalimantan Barat resmi InaRISK yang eksplisit menyebut Kubu Raya (hanya ditemukan contoh dari KRB Jawa Barat).
- Lokasi persis dan relevansi artikel Mongabay 2016 "PLTS Kubu" — ambigu, tidak terkonfirmasi.

---

## Product Assumptions Confirmed

1. **Kubu Raya benar-benar punya relevansi disaster/resilience yang spesifik dan didukung sumber resmi** (kekeringan tinggi via IRBI BNPB, karhutla via 3 studi akademik + inisiatif pemerintah terbaru) — ini lebih kuat dari yang mungkin diasumsikan sebelumnya di `PROJECT_CONTEXT.md`, yang tidak mencantumkan evidence spesifik ini sama sekali.
2. **Existing PLTS di Kubu Raya benar-benar ada dan bahkan lebih banyak dari yang tercatat** — 3 desa (bukan hanya Sumber Agung yang sudah didokumentasikan di §11 `PROJECT_CONTEXT.md`).
3. **MCDA/AHP untuk siting PLTS adalah metode akademik yang aktif dan established**, termasuk satu studi kasus persis di Kalimantan Barat — mengonfirmasi pilihan metodologi §12 `PROJECT_CONTEXT.md` bukan pilihan ad-hoc.
4. **Konteks kebijakan nasional PLTS (100 GWp) sedang mengalami momentum/percepatan** — sesuai batasan instruksi task (§D), ini HANYA dipakai sebagai konteks momentum, BUKAN untuk mengklaim pemerintah "membutuhkan" SURYA-SIAGA secara resmi.

## Product Assumptions Challenged

1. **Angka historis PLTS Sumber Agung di `PROJECT_CONTEXT.md` §11** (kapasitas 100 kWp, 329/402 KK, gap 73 KK) **TIDAK cocok** dengan angka yang ditemukan riset ini (312 KK — kemungkinan agregat 3 desa, kapasitas akhir 150 atau 250, bukan 100). Ini BUKAN berarti PROJECT_CONTEXT salah — bisa jadi kedua set angka sama-sama tidak akurat, atau merujuk periode/cakupan berbeda — tapi **perlu direkonsiliasi eksplisit**, bukan diasumsikan konsisten.
2. **Asumsi bahwa `beneficiary_count` per fasilitas bisa diisi dari BPS** kemungkinan besar TIDAK terpenuhi — granularitas maksimum yang terkonfirmasi adalah kecamatan, bukan per-fasilitas. Ini menantang kelayakan model data §8 `PROJECT_CONTEXT.md` seperti didesain saat ini untuk field tersebut, kecuali dipakai sebagai proxy berlabel eksplisit.
3. **NASA POWER, meski disebut sebagai kandidat sumber Tier 2 di `PROJECT_CONTEXT.md` §7**, ternyata praktis tidak bisa dipakai untuk membedakan lokasi dalam satu kabupaten (resolusi terlalu kasar) — perannya perlu direklasifikasi (time-series/cross-check), bukan sumber utama GHI pembanding.
4. **Klaim novelty "kombinasi X+Y+Z belum ada di tool lain" belum bisa dinyatakan penuh** — riset kompetitif ini banyak menghasilkan status UNKNOWN (bukan NO pasti) karena dokumentasi tool pembanding tidak terbaca lengkap. Framing yang aman tetap "SURYA-SIAGA mengintegrasikan..." (integration value), bukan klaim keunikan mutlak.

## Potential Product Changes (REKOMENDASI SAJA — TIDAK diterapkan dalam riset ini)

> Sesuai larangan task ini (§O `PROJECT_CONTEXT.md` amandemen §17.1), berikut adalah rekomendasi untuk keputusan manusia — bukan perubahan yang sudah diterapkan ke `PROJECT_CONTEXT.md`.

1. Pertimbangkan menandai ulang angka historis Sumber Agung di §11 `PROJECT_CONTEXT.md` sebagai `requires_verification`/konflik eksplisit, bukan angka tunggal yang dianggap final, sambil menunggu pembukaan langsung sumber BPK Kalbar.
2. Pertimbangkan menambahkan Muara Tiga dan Sungai Kerawang sebagai konteks existing-PLTS tambahan di §11 `PROJECT_CONTEXT.md`, mengingat ketiganya bagian dari program yang sama.
3. Pertimbangkan mendokumentasikan metodologi proxy eksplisit untuk `beneficiary_count` (mis. berbasis populasi kecamatan berlabel jelas "proxy", bukan angka aktual per fasilitas) mengingat data individual tidak tersedia publik.
4. Pertimbangkan mereklasifikasi peran NASA POWER dari "kandidat sumber GHI pembanding" menjadi "sumber pelengkap time-series/validasi" dalam dokumentasi sumber data.
5. Pertimbangkan riset lanjutan (dengan akses fetch penuh) sebagai prasyarat sebelum dataset pilot final dan bobot MCDA dikunci, mengingat volume tinggi item `requires_verification` dalam riset ini.

## Data Acquisition Readiness

Ringkasan dari `DATA_ACQUISITION_PLAN.md`: 2 dataset READY_FOR_ACQUISITION (Global Solar Atlas, NASA POWER — dengan catatan peran masing-masing), 15 dataset MANUAL_ACQUISITION_REQUIRED (didominasi oleh kebutuhan verifikasi/rekonsiliasi konflik), 2 LOW_QUALITY (granularitas BPS per-kecamatan, angka kapasitas PLTS yang konflik), 7 NOT_FOUND (terutama koordinat presisi &amp; beneficiary per-fasilitas), 2 NOT_NEEDED (NASA POWER sebagai sumber utama, hotspot real-time sebagai input skoring).

## Critical Risks

1. **Seluruh riset ini dilakukan di bawah lingkungan yang memblokir WebFetch ke domain eksternal** — tidak satu pun temuan boleh dianggap fakta produksi sampai sesi/manusia dengan akses internet penuh membuka ulang URL-URL primer di `EVIDENCE_LEDGER.md` dan `SOURCES.md`.
2. **Dua konflik data material belum terselesaikan** (kapasitas PLTS Batu Ampar; klasifikasi risiko karhutla Kubu Raya) — memakai salah satu angka tanpa disclosure akan melanggar `PROJECT_CONTEXT.md` §10 poin 6.
3. **Data historis PLTS di `PROJECT_CONTEXT.md` sendiri berpotensi perlu dikoreksi**, bukan hanya dikonfirmasi ulang — riset ini menemukan angka berbeda dari yang sudah tercatat, dan belum jelas mana yang lebih akurat.
4. **Granularitas data sosial/fasilitas yang tersedia publik (kecamatan) lebih kasar dari yang dibutuhkan desain model data produk (per-fasilitas)** — ini risiko struktural untuk MVP, bukan sekadar detail teknis, karena bisa memaksa penggunaan proxy secara luas di seluruh dataset pilot.

## Human Decisions Required

1. Menyetujui riset lanjutan di lingkungan dengan akses internet penuh untuk membuka &amp; mengonfirmasi ~20 URL primer prioritas tinggi yang teridentifikasi (lihat `DATA_ACQUISITION_PLAN.md` kategori MANUAL_ACQUISITION_REQUIRED).
2. Memutuskan cara menangani perbedaan angka historis Sumber Agung (§11 `PROJECT_CONTEXT.md`) — rekonsiliasi, penandaan konflik eksplisit, atau pencarian langsung ke sumber primer asli (bukan BPK Kalbar sebagai perantara).
3. Memutuskan apakah Muara Tiga dan Sungai Kerawang ditambahkan ke `PROJECT_CONTEXT.md` sebagai konteks existing-PLTS tambahan.
4. Memutuskan pendekatan untuk `beneficiary_count` mengingat hanya data agregat kecamatan yang ditemukan — proxy berlabel eksplisit, atau pengumpulan data primer langsung ke fasilitas/dinas terkait.
5. Memutuskan apakah perlu mengontak langsung Pemkab Kubu Raya/Dinkes/Dinas Pendidikan untuk daftar fasilitas primer dengan koordinat, mengingat platform online publik belum terkonfirmasi lengkap.
6. Menentukan prioritas: apakah dataset pilot final disusun dulu dari 3 lokasi existing-PLTS yang sudah ditemukan (Batu Ampar) plus fasilitas di kecamatan yang sama, atau menunggu verifikasi lanjutan seluruh kabupaten.

---

## Jawaban Ringkas atas 4 Pertanyaan Utama Task

1. **Apakah problem SURYA-SIAGA didukung bukti nyata?** Sebagian — konteks kebijakan nasional (momentum PLTS 100GWp) dan literatur MCDA-siting established dan relevan, tapi tidak ada dokumen resmi yang eksplisit menyebut "site prioritization" sebagai gap yang diakui pemerintah; ini tetap merupakan gap yang diidentifikasi tim, bukan yang secara eksplisit dinyatakan otoritas.
2. **Apakah Kubu Raya cukup relevan &amp; data-supported sebagai pilot?** Ya, dengan kualifikasi — lihat kesimpulan `KUBU_RAYA_PILOT_JUSTIFICATION.md`: **VIABLE PILOT WITH LIMITATIONS**.
3. **Apakah data yang diperlukan MVP benar-benar tersedia?** Sebagian — platform data resmi eksis dan aktif, tapi granularitas (kecamatan, bukan per-fasilitas) dan status verifikasi (semua unverified) berarti "tersedia" di sini berarti "berpotensi tersedia setelah verifikasi lanjutan", bukan "siap pakai hari ini".
4. **Di bagian mana SURYA-SIAGA benar-benar berbeda/memberi integration value?** Kombinasi solar+disaster+facility criticality+beneficiary+existing-PLTS dalam satu skor, dan pemisahan eksplisit Data Confidence dari Priority Score — tidak ditemukan di 4 tool yang diperiksa, tapi status ini masih UNKNOWN (bukan NO pasti) untuk banyak sub-fitur karena dokumentasi tidak terbaca penuh. Framing aman: "mengintegrasikan", bukan "pertama di Indonesia".
