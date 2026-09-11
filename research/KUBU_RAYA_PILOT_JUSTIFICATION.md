# KUBU_RAYA_PILOT_JUSTIFICATION.md

> ⚠️ Seluruh evidence di dokumen ini merujuk ke `EVIDENCE_LEDGER.md` dan berstatus `unverified` kecuali dinyatakan lain (WebFetch diblokir total di sesi riset ini). Kesimpulan di §9 dibuat dengan mempertimbangkan keterbatasan ini secara eksplisit — bukan mengabaikannya.

---

## 1. Tujuan Pilot

Menilai apakah Kabupaten Kubu Raya, Kalimantan Barat cukup relevan dan data-supported untuk digunakan sebagai **proof-of-concept metodologi prioritisasi SURYA-SIAGA** (bukan untuk membuktikan Kubu Raya sebagai "lokasi PLTS terbaik di Indonesia" — sesuai `PROJECT_CONTEXT.md` §6).

---

## 2. Solar Evidence

- Tidak ditemukan data GHI spesifik-Kubu Raya yang sudah diekstrak (task ini memang melarang pengambilan angka GHI kandidat — lihat §I task Prompt 2).
- Yang terkonfirmasi: **Global Solar Atlas** menyediakan GHI/DNI resolusi ~250m secara global (mencakup Kubu Raya secara otomatis, karena cakupannya global) — resolusi ini secara teknis cukup halus untuk membedakan titik dalam satu kabupaten (EV-020), meski GSA sendiri menyatakan bukan untuk bankable assessment (EV-022).
- **NASA POWER TIDAK cocok** untuk tujuan ini di Kubu Raya — resolusi grid ~55×70km jauh melebihi luas kabupaten (EV-026).
- **Kekuatan evidence: SEDANG** — sumber data solar tersedia dan berlaku universal (bukan spesifik-keunggulan Kubu Raya), tapi belum ada satu pun angka GHI Kubu Raya aktual yang diekstrak/diverifikasi dalam riset ini.
- **Keterbatasan:** variasi GHI riil antar titik dalam kabupaten dataran rendah seperti Kubu Raya kemungkinan kecil secara fisik (didominasi tutupan awan regional, bukan topografi lokal) — catatan analitis dari agent riset, bukan pernyataan resmi GSA.

## 3. Existing PLTS Evidence

- **Ditemukan evidence konkret dan spesifik**: hibah PLTS Komunal 2018 untuk **3 desa** di Kecamatan Batu Ampar — Sumber Agung, Muara Tiga, Sungai Kerawang (EV-038, sumber: BPK Perwakilan Kalbar).
- Ini KONSISTEN dengan `PROJECT_CONTEXT.md` §11 (yang menyebut Sumber Agung), tapi PROJECT_CONTEXT belum mencantumkan 2 desa lainnya.
- **Namun**: detail kuantitatif (kapasitas, jumlah KK) **konflik antar-sumber** (CF-001) — tidak bisa dipakai sebagai fakta produksi tanpa verifikasi ulang.
- Ditemukan juga preseden PLTS skala kecil lain di Kubu Raya (Sepok Keladi, Sungai Kakap — EV-045) dan indikasi ambigu proyek "PLTS Kubu" yang bermasalah (EV-046, CF-005) — keduanya memerlukan verifikasi lanjutan.
- **Kekuatan evidence: KUAT untuk keberadaan, LEMAH untuk detail kuantitatif** — Kubu Raya jelas punya riwayat nyata PLTS komunal multi-lokasi, tapi angka pastinya belum bisa dipakai.

## 4. Public Facility Evidence

- Puskesmas: portal resmi kabupaten (puskesmas.kuburayakab.go.id) dan provinsi (kalbarsehat.kalbarprov.go.id/fasyankes) EKSIS dengan halaman per-fasilitas (EV-048, EV-049) — field dasar (nama, alamat, kecamatan) ada, **koordinat TIDAK terkonfirmasi tersedia**.
- Sekolah: platform resmi Kemendikdasmen (referensi.data.kemendikdasmen.go.id) EKSIS untuk Kubu Raya hingga level kecamatan (EV-051) — field detail &amp; koordinat belum terkonfirmasi.
- **Kekuatan evidence: SEDANG** — platform data resmi jelas ada dan aktif, tapi granularitas/kelengkapan field (terutama koordinat) belum bisa dipastikan tanpa membuka langsung.

## 5. Social Data Evidence

- BPS Kubu Raya secara aktif menerbitkan "Kabupaten Dalam Angka" (edisi 2025 terbaru, EV-053) dan "Kecamatan Dalam Angka" (setidaknya 2 dari 9 kecamatan terkonfirmasi, EV-054).
- **Granularitas maksimum yang terkonfirmasi: KECAMATAN**, bukan desa/kelurahan, apalagi per-fasilitas individual.
- Ini **membatasi** kemampuan model data §8 `PROJECT_CONTEXT.md` untuk mengisi `beneficiary_count` per fasilitas dari sumber BPS langsung — perlu proxy berlabel eksplisit atau sumber primer tambahan (mis. data internal puskesmas/sekolah).
- **Kekuatan evidence: KUAT untuk ketersediaan data resmi berkala, LEMAH untuk granularitas yang dibutuhkan produk.**

## 6. Disaster/Resilience Evidence

- **Kekeringan**: IRBI BNPB 2023 &amp; 2024 secara EKSPLISIT mengklasifikasikan Kubu Raya kelas risiko "TINGGI" (EV-032) — ini evidence resmi paling spesifik dan kuat dalam seluruh riset ini, meski skalanya perlu diverifikasi (CF-003).
- **Karhutla**: 3 studi akademik independen membahas Kubu Raya secara spesifik dan mendalam (EV-034, EV-035, EV-036), PLUS inisiatif pemerintah 2025-2026 (Kemenhut+BRIN+YKAN) menetapkan Kubu Raya sebagai salah satu dari 3 kabupaten prioritas pemetaan risiko karhutla gambut Kalbar terbaru, menyumbang ~77% luas karhutla Kalbar (EV-033).
- **Namun**: ketiga studi akademik saling bertentangan hasilnya (CF-002 — beda definisi bahaya vs risiko, beda tahun, beda metodologi) — tidak bisa dipakai sebagai angka tunggal tanpa rekonsiliasi.
- **Kekuatan evidence: KUAT** — Kubu Raya punya relevansi disaster/resilience yang didukung sumber resmi BNPB DAN inisiatif pemerintah terbaru DAN literatur akademik — ini bukan asumsi kosong, tapi genuinely well-documented sebagai daerah rawan karhutla/kekeringan.

## 7. Data Availability (Ringkasan Lintas-Dimensi)

| Dimensi | Ketersediaan sumber resmi | Granularitas terkonfirmasi | Kekuatan |
|---|---|---|---|
| Solar | Global (GSA), berlaku otomatis untuk Kubu Raya | Piksel ~250m (GSA) | Sedang |
| Existing PLTS | Ya, spesifik 3 desa | Desa (tapi angka konflik) | Kuat (eksistensi), Lemah (angka) |
| Fasilitas publik | Ya, platform kabupaten/provinsi/nasional aktif | Per-fasilitas (field belum lengkap dikonfirmasi) | Sedang |
| Sosial/demografis | Ya, BPS aktif &amp; berkala | Kecamatan (bukan desa/fasilitas) | Sedang (kuat platformnya, lemah granularitasnya) |
| Disaster/resilience | Ya, BNPB resmi + akademik + inisiatif pemerintah baru | Kabupaten (kekeringan), sub-kabupaten (karhutla, tapi konflik) | Kuat |

## 8. Limitations

1. **Seluruh evidence di atas berstatus `unverified` (snippet-level)** — sesi riset ini tidak bisa membuka satu pun halaman sumber secara langsung karena WebFetch diblokir total. Ini BUKAN indikasi data salah, tapi berarti belum ada satu pun klaim di dokumen ini yang boleh dianggap fakta produksi.
2. Dua konflik data material belum terselesaikan (kapasitas PLTS 2018, klasifikasi risiko karhutla) — lihat `SOURCE_CONFLICTS.md`.
3. Granularitas data sosial/fasilitas maksimum yang terkonfirmasi adalah kecamatan, bukan desa/per-fasilitas — berpotensi memerlukan proxy berlabel eksplisit di banyak field model data §8 `PROJECT_CONTEXT.md`.
4. Koordinat presisi untuk fasilitas individual (puskesmas/sekolah) tidak terkonfirmasi tersedia di sumber publik manapun yang ditemukan.
5. Data historis PLTS di `PROJECT_CONTEXT.md` §11 (Sumber Agung: 100 kWp, 329/402 KK) tidak cocok dengan angka yang ditemukan riset ini (312 KK agregat, kapasitas 150/250) — memerlukan rekonsiliasi, bukan penggantian sepihak.
6. Peta risiko karhutla gambut terbaru Kalbar (yang menyebut Kubu Raya eksplisit sebagai prioritas) masih dalam tahap finalisasi per laporan berita Juli 2026 — belum tentu tersedia publik saat MVP dibangun.

## 9. Kesimpulan

> **VIABLE PILOT WITH LIMITATIONS**

**Alasan berdasarkan evidence:**

Kubu Raya menunjukkan relevansi yang **genuinely didukung sumber resmi dan spesifik** pada dimensi disaster/resilience (klasifikasi kekeringan "tinggi" oleh BNPB sendiri, prioritas pemerintah dalam pemetaan risiko karhutla gambut terbaru, literatur akademik yang secara khusus membahas kabupaten ini) dan existing-PLTS (program komunal nyata di 3 desa, bukan fiksi/asumsi tim). Ekosistem data resmi (BPS, portal kesehatan/pendidikan, portal data provinsi) juga aktif dan terstruktur, mengindikasikan infrastruktur data publik yang memadai untuk sebuah kabupaten di Indonesia.

Namun, pilot ini **belum bisa disebut STRONG** karena: (a) tidak satu pun evidence dalam riset ini berhasil diverifikasi langsung dari halaman sumber (keterbatasan lingkungan riset, bukan keterbatasan data itu sendiri), (b) ada dua konflik data material yang belum direkonsiliasi, dan (c) granularitas data sosial/fasilitas yang terkonfirmasi (kecamatan) berada di bawah level yang dibutuhkan model data produk (per-fasilitas). Pilot ini juga bukan **WEAK/RECONSIDER** — tidak ada satu pun temuan yang mengindikasikan Kubu Raya adalah pilihan buruk; sebaliknya, kombinasi bukti disaster-relevance + existing-PLTS + ekosistem data resmi yang aktif justru memperkuat kelayakannya, sejauh langkah verifikasi lanjutan dilakukan sebelum dataset pilot final dikunci.
