# PROPOSAL_STRENGTHENING.md — Rencana Penguatan Proposal SURYA-SIAGA

**Tujuan:** memetakan bagian-bagian proposal kompetisi yang perlu diperkuat sebelum proposal final ditulis, berdasarkan temuan `docs/PRODUCT_AUDIT.md` dan `PROJECT_CONTEXT.md`.
**Batasan:** dokumen ini **tidak mengubah proposal final** dan **tidak menambahkan klaim/angka baru tanpa sumber**. Semua kolom "Bukti/Data yang Dibutuhkan" menandai kebutuhan riset, bukan data yang sudah ada.
**Status verifikasi** memakai tiga nilai: `verified` (ada sumber tercatat), `requires_verification` (klaim masuk akal tapi belum bersumber), `open_decision` (keputusan internal tim yang belum dibuat, bukan soal sumber eksternal).

---

## 1. Urgensi

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Latar Belakang / Urgensi Masalah |
| **Kondisi sekarang** | `PROJECT_CONTEXT.md` menyatakan prinsip dan visi produk, tapi tidak mencantumkan data konkret yang membuktikan masalah ini mendesak di Kubu Raya secara spesifik. |
| **Kelemahan** | Urgensi berisiko generik ("energi terbarukan penting untuk Indonesia") tanpa angka lokal. Juri dapat menilai masalah belum dibuktikan nyata. |
| **Perbaikan** | Cari dan kutip data spesifik Kubu Raya/Kalbar: rasio elektrifikasi desa, jumlah desa belum terjangkau PLN, kondisi kelistrikan fasilitas kesehatan/pendidikan terpencil, target bauran EBT nasional (RUEN) vs capaian Kalbar. |
| **Bukti/data yang dibutuhkan** | Data rasio elektrifikasi (ESDM/PLN Wilayah Kalbar/BPS); laporan kondisi kelistrikan puskesmas/sekolah terpencil (Kemenkes/Kemendikdasmen/Dinas terkait Kubu Raya); dokumen RUEN atau rencana energi daerah Kalbar. |
| **Status verifikasi** | `requires_verification` — belum ada satu pun sumber ini dikutip di `PROJECT_CONTEXT.md`. |

---

## 2. Research Gap / Product Gap

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Tinjauan Pustaka / Analisis Kesenjangan Solusi Eksisting |
| **Kondisi sekarang** | Diferensiasi konseptual terhadap Global Solar Atlas, InaRISK, dashboard PLTS umum, dan solar calculator sudah dianalisis (lihat `docs/PRODUCT_AUDIT.md` §4), tapi berbasis pemahaman umum tim, bukan pengecekan langsung/riset literatur sistematis. |
| **Kelemahan** | Klaim "belum ada tool yang menggabungkan X+Y+Z" bisa salah jika ada tool lain yang sudah melakukannya (mis. tools ESMAP/World Bank, riset akademik Indonesia tentang prioritisasi PLTS). Klaim gap yang tidak diverifikasi adalah risiko integritas terbesar di bagian ini. |
| **Perbaikan** | Lakukan pengecekan langsung ke situs/dokumentasi resmi setiap tool pembanding sebelum proposal ditulis; susun tabel komparasi fitur dengan tanggal akses; jika ditemukan tool yang mirip, akui dan jelaskan perbedaan spesifik alih-alih mengklaim keunikan mutlak. |
| **Bukti/data yang dibutuhkan** | Dokumentasi fitur resmi Global Solar Atlas, InaRISK, dashboard EBT ESDM/PLN, serta pencarian literatur akademik terkait prioritisasi lokasi PLTS di Indonesia (jika ada). |
| **Status verifikasi** | `requires_verification` — riset pembanding belum dilakukan secara sistematis. |

---

## 3. Novelty

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Kontribusi/Keunikan Solusi |
| **Kondisi sekarang** | Tiga kandidat novelty teridentifikasi: (a) integrasi multi-domain pada level fasilitas, (b) pemisahan eksplisit Data Confidence dari Priority Score, (c) explainability sebagai fitur inti. |
| **Kelemahan** | Risiko novelty dianggap "sekadar menggabungkan data publik yang sudah ada" jika tidak diartikulasikan sebagai keputusan desain, bukan penemuan algoritma baru. |
| **Perbaikan** | Proposal harus eksplisit menyatakan novelty terletak pada *desain tata kelola keputusan* (transparansi, auditability, pemisahan confidence vs priority), didukung contoh konkret dari UI (breakdown skor, badge confidence, link provenance) — bukan klaim "algoritma baru" atau "pertama di Indonesia". |
| **Bukti/data yang dibutuhkan** | Tabel komparasi fitur dari §2 di atas sebagai bukti pendukung posisi diferensiasi; tidak memerlukan sumber eksternal untuk klaim desain milik sendiri. |
| **Status verifikasi** | `open_decision` untuk framing narasi (tim perlu sepakat cara mengartikulasikan); `requires_verification` untuk klaim "tidak ada yang serupa" (bergantung pada §2). |

---

## 4. Alasan Memilih Kubu Raya

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Justifikasi Lokasi Studi Kasus/Pilot |
| **Kondisi sekarang** | `PROJECT_CONTEXT.md` §4 hanya menyatakan framing "digunakan sebagai pilot untuk menguji metode", tanpa alasan spesifik mengapa Kubu Raya (dan bukan kabupaten lain) yang dipilih. |
| **Kelemahan** | Tanpa data pendukung, pemilihan lokasi terkesan arbitrer atau karena kedekatan/kemudahan tim, bukan karena relevansi objektif terhadap masalah (energi + resilience bencana). |
| **Perbaikan** | Cantumkan data spesifik yang menjustifikasi Kubu Raya: indeks kerawanan karhutla/bencana wilayah (nama repo mengisyaratkan konteks karhutla — perlu dikonfirmasi dan disumberkan), data GHI wilayah dari Global Solar Atlas, karakteristik geografis (wilayah pesisir/gambut yang secara teknis menyulitkan perluasan grid PLN konvensional, sehingga PLTS off-grid/komunal relevan), dan data elektrifikasi daerah. |
| **Bukti/data yang dibutuhkan** | Data indeks risiko karhutla/kekeringan Kubu Raya (BNPB/InaRISK/KLHK); data GHI Kubu Raya (Global Solar Atlas/NASA POWER); data elektrifikasi/desa berlistrik (ESDM/PLN Kalbar); data geografis wilayah (Pemda Kubu Raya/BPS). |
| **Status verifikasi** | `requires_verification` — tidak satu pun dari data ini tercantum di `PROJECT_CONTEXT.md` saat ini. |

---

## 5. Alasan Memilih Fasilitas Kesehatan/Sekolah/PLTS Eksisting

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Justifikasi Kriteria Seleksi Fasilitas |
| **Kondisi sekarang** | §5 `PROJECT_CONTEXT.md` menetapkan komposisi ideal (PLTS eksisting + ±5 puskesmas + ±5 sekolah), tapi tidak menjelaskan mengapa jenis fasilitas ini dipilih dibanding fasilitas publik lain (kantor desa, pasar, dll). |
| **Kelemahan** | Tanpa argumen eksplisit, pemilihan terlihat seperti asumsi tim yang "masuk akal" tapi tidak dijustifikasi — juri dapat mempertanyakan representativitas sampel. |
| **Perbaikan** | Nyatakan argumen eksplisit: puskesmas dan sekolah adalah fasilitas layanan dasar dengan continuity-of-service kritis (kesehatan, pendidikan), memiliki data ketersediaan publik yang relatif dapat diverifikasi (Kemenkes, Kemendikdasmen), dan merepresentasikan dua dimensi criticality yang berbeda (layanan darurat vs layanan rutin) untuk menguji framework secara memadai. PLTS eksisting dipilih untuk menguji jalur Expansion Assessment, bukan hanya New Deployment. |
| **Bukti/data yang dibutuhkan** | Dasar kebijakan (jika ada) terkait prioritas elektrifikasi fasilitas kesehatan/pendidikan terpencil; data ketersediaan/kualitas listrik puskesmas & sekolah Kubu Raya. |
| **Status verifikasi** | `requires_verification` untuk data pendukung; `open_decision` untuk redaksi argumentasi final. |

---

## 6. Alasan Penggunaan MCDA

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Metodologi |
| **Kondisi sekarang** | §10 `PROJECT_CONTEXT.md`: MCDA dipilih, kandidat metode AHP + Weighted Scoring, **bobot final belum ditentukan** (blocking, tercatat di §17). |
| **Kelemahan** | Tanpa justifikasi metodologis (kenapa AHP, bukan TOPSIS/ELECTRE/fuzzy MCDA) dan tanpa bobot final, bagian metodologi rentan dianggap belum matang saat Q&A. |
| **Perbaikan** | Jelaskan alasan AHP: relatif mudah dipahami stakeholder non-teknis, memungkinkan pairwise comparison berbasis expert judgment untuk kriteria heterogen (kuantitatif & kualitatif). **Bobot final harus melalui proses terdokumentasi** (mis. pairwise comparison dengan sumber ahli/dokumen kebijakan energi/resilience), bukan angka yang dipilih sepihak oleh tim. Jika waktu kompetisi tidak cukup untuk elisitasi ahli penuh, bobot yang dipakai di demo **wajib dilabeli eksplisit** sebagai "illustrative/provisional, subject to expert calibration" — baik di UI maupun proposal. |
| **Bukti/data yang dibutuhkan** | Dokumentasi proses pairwise comparison (siapa yang mengisi, basis penilaian, consistency ratio AHP jika dihitung). |
| **Status verifikasi** | `open_decision` — ini adalah keputusan metodologis internal yang sudah tercatat sebagai open item di `PROJECT_CONTEXT.md` §17, bukan soal mencari sumber eksternal. |

---

## 7. Explainability

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Desain Sistem / Fitur Unggulan |
| **Kondisi sekarang** | "Explainable Priority Score" tercantum sebagai fitur MVP (§11), tapi desain konkret breakdown-nya (bagaimana kontribusi tiap kriteria ditampilkan) belum final — Final UI tercatat belum final di §16. |
| **Kelemahan** | Klaim "explainable" berisiko jadi buzzword tanpa implementasi UI nyata yang menunjukkan kontribusi tiap kriteria dan sumbernya. |
| **Perbaikan** | Pastikan Site Insight menampilkan breakdown numerik/visual kontribusi tiap kriteria terhadap skor akhir, dengan tautan ke `source_name`/`source_url` per data point (sesuai model data §6 `PROJECT_CONTEXT.md`), sebelum menyebut fitur ini "explainable" di proposal. |
| **Bukti/data yang dibutuhkan** | Tidak memerlukan sumber eksternal; memerlukan spesifikasi desain UI konkret yang belum dibuat. |
| **Status verifikasi** | `open_decision` — menunggu desain UI final. |

---

## 8. Data Confidence

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Desain Sistem / Integritas Data |
| **Kondisi sekarang** | Field `data_confidence` dan `verification_status` sudah ada di model data (§6), dan secara desain dipisahkan dari Priority Score (§10). **Namun rubrik/formula perhitungan `data_confidence` itu sendiri belum didefinisikan sama sekali** di `PROJECT_CONTEXT.md` — ini bahkan belum tercatat sebagai item di §17 Unresolved Decisions. |
| **Kelemahan** | Tanpa rubrik yang konsisten, `data_confidence` berisiko diisi secara subjektif/ad-hoc per lokasi, bertentangan dengan prinsip transparansi (§14) yang menjadi nilai inti produk. |
| **Perbaikan** | Definisikan rubrik eksplisit — misalnya kombinasi terdokumentasi dari: tier sumber (Tier 1/2/3), kebaruan (`data_year` relatif terhadap tahun berjalan), kelengkapan field, dan `verification_status`. Setelah dirumuskan, catat sebagai keputusan resmi dan tambahkan ke `PROJECT_CONTEXT.md` §17 → dipindahkan ke "Resolved" begitu diputuskan. |
| **Bukti/data yang dibutuhkan** | Tidak memerlukan sumber eksternal; memerlukan keputusan metodologis internal yang terdokumentasi dan diterapkan konsisten ke semua field. |
| **Status verifikasi** | `open_decision` — **rekomendasi: tambahkan sebagai item baru ke `PROJECT_CONTEXT.md` §17**, karena saat ini belum tercatat di sana sama sekali. |

---

## 9. Limitations

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Keterbatasan Penelitian/Produk |
| **Kondisi sekarang** | Prinsip transparansi (§14) kuat secara filosofi, tapi belum ada draf bagian "Limitations" eksplisit (proposal final belum ditulis). |
| **Kelemahan** | Tanpa bagian limitations eksplisit, juri cenderung menilai tim kurang sadar akan keterbatasan sistem sendiri — kesan yang justru merugikan meski secara internal tim sudah cukup disiplin. |
| **Perbaikan** | Proposal wajib memuat bagian "Limitations" eksplisit yang mencantumkan minimal: (1) sebagian data bersifat historis dan belum tentu mencerminkan kondisi terkini (rujuk kasus Sumber Agung, §9 `PROJECT_CONTEXT.md`); (2) sampel 10–15 lokasi bersifat pilot, bukan representasi nasional; (3) bobot skoring belum melalui kalibrasi ahli penuh pada tahap MVP; (4) sistem adalah pre-screening tool, bukan pengganti feasibility study/rekayasa teknis; (5) belum ada validasi lapangan oleh instansi terkait. |
| **Bukti/data yang dibutuhkan** | Tidak memerlukan sumber eksternal. |
| **Status verifikasi** | `open_decision` — perlu ditulis saat proposal disusun; kontennya sudah dapat diturunkan langsung dari `PROJECT_CONTEXT.md`. |

---

## 10. Indikator Keberhasilan Sistem

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Metrik Evaluasi/Keberhasilan |
| **Kondisi sekarang** | Tidak ada definisi indikator keberhasilan (baik untuk kompetisi maupun dampak jangka panjang) di `PROJECT_CONTEXT.md`. |
| **Kelemahan** | Tanpa indikator, klaim "sistem membantu keputusan" tidak terukur dan rentan dianggap retorika kosong saat Q&A ("bagaimana Anda tahu ini berhasil?"). |
| **Perbaikan** | Definisikan dua lapis indikator: **(a) Indikator MVP/kompetisi** — mis. persentase lokasi dengan data terverifikasi penuh (bukan proxy), kelengkapan traceability per lokasi, konsistensi rasio AHP (jika dihitung), hasil usability testing informal terhadap calon pengguna. **(b) Indikator dampak jangka panjang (jika diadopsi)** — mis. jumlah kajian lanjutan yang terpicu oleh rekomendasi sistem, adopsi oleh dinas terkait — **harus dinyatakan sebagai proyeksi/aspirasi, bukan capaian aktual**, karena belum terjadi. |
| **Bukti/data yang dibutuhkan** | Tidak memerlukan sumber eksternal untuk metrik MVP; indikator dampak jangka panjang tidak boleh disajikan sebagai data, hanya sebagai target masa depan. |
| **Status verifikasi** | `open_decision` — belum didefinisikan sama sekali, perlu dirumuskan tim sebelum proposal ditulis. |

---

## 11. Implementasi Dunia Nyata

| Aspek | Isi |
|---|---|
| **Bagian proposal** | Rencana Implementasi/Keberlanjutan |
| **Kondisi sekarang** | Tidak ada primary user atau jalur adopsi resmi tercatat di `PROJECT_CONTEXT.md` (lihat juga `docs/PRODUCT_AUDIT.md` §6). Tidak ada catatan mengenai status komunikasi dengan Pemda/PLN Kubu Raya. |
| **Kelemahan** | Tanpa jalur adopsi konkret (siapa pemilik data, siapa yang memelihara sistem, bagaimana serah terima ke instansi), klaim "dapat diimplementasikan di dunia nyata" lemah dan mudah dipatahkan juri. |
| **Perbaikan** | Definisikan jalur realistis: MVP sebagai proof-of-concept metodologi → keterlibatan Dinas ESDM/Bappeda Kubu Raya untuk validasi data & metodologi (jika dan hanya jika keterlibatan ini benar terjadi atau direncanakan konkret) → potensi penggunaan sebagai alat bantu studi pra-kelayakan internal pemda, bukan sistem produksi mandiri. **Jangan** mengklaim "siap dipakai PLN/Pemda" tanpa dasar. |
| **Bukti/data yang dibutuhkan** | Konfirmasi internal tim: apakah sudah ada komunikasi nyata dengan Pemda/PLN Kubu Raya atau pihak terkait lain. Jika belum ada, proposal harus menyatakan jalur implementasi sebagai rencana ke depan, bukan fakta yang sudah terjadi. |
| **Status verifikasi** | `requires_verification` — **status hubungan dengan instansi terkait harus dikonfirmasi langsung ke tim/user, tidak boleh diasumsikan oleh agent mana pun.** |

---

## Ringkasan Prioritas Tindak Lanjut

Urutan yang disarankan sebelum proposal final ditulis:

1. Konfirmasi ke tim: status komunikasi dengan Pemda/PLN Kubu Raya (§11) — ini menentukan bagaimana bagian implementasi boleh ditulis.
2. Riset data urgensi & alasan lokasi (§1, §4) — kebutuhan riset terbesar dan paling menentukan kekuatan Latar Belakang.
3. Riset pembanding tool eksisting (§2) — menentukan validitas klaim novelty/gap.
4. Putuskan rubrik Data Confidence dan tambahkan ke `PROJECT_CONTEXT.md` §17 (§8 dokumen ini).
5. Putuskan proses penentuan bobot MCDA, meski hasilnya sementara berstatus provisional (§6).
6. Susun bagian Limitations dan Indikator Keberhasilan (§9, §10) — tidak memerlukan riset eksternal, hanya perlu ditulis.

Tidak ada tindakan di atas yang dilakukan dalam sesi ini — seluruhnya memerlukan keputusan/riset lanjutan dari tim proyek.
