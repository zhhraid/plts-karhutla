# DATA_ACQUISITION_PLAN.md — Rencana Akuisisi Data SURYA-SIAGA

> ⚠️ Karena WebFetch diblokir total di sesi riset ini, **tidak ada satu pun dataset di bawah yang benar-benar diakuisisi/dibuka dalam sesi ini**. Klasifikasi di bawah adalah penilaian atas *metode akses yang teridentifikasi via WebSearch* (apakah publik, terbuka, terstruktur) — BUKAN konfirmasi bahwa isinya sudah benar/lengkap. Setiap dataset, sebelum benar-benar diakuisisi oleh agent Prompt berikutnya, **wajib dibuka manual dulu untuk konfirmasi isi, format, dan kelengkapan field** — sesuai prinsip §Faktualitas Wajib.

Kategori: `READY_FOR_ACQUISITION`, `MANUAL_ACQUISITION_REQUIRED`, `ACCESS_RESTRICTED`, `LOW_QUALITY`, `NOT_FOUND`, `NOT_NEEDED`.

---

## READY_FOR_ACQUISITION

Dataset dengan metode akses publik terdokumentasi (unduhan langsung atau API tanpa otentikasi khusus), tanpa indikasi pembatasan akses.

### RA-01: Global Solar Atlas — GHI/DNI raster
- **Cara akses (untuk agent berikutnya):** buka globalsolaratlas.info, gunakan fitur download per-negara/region untuk mengunduh GeoTIFF (GHI, DNI, DIF, GTI) resolusi ~250m, ATAU gunakan fitur "site-specific PDF report" untuk titik individual. Wajib menyertakan atribusi CC BY 4.0 ("© The World Bank, Source: Global Solar Atlas 2.0, Solar resource data: Solargis").
- **Peran yang direkomendasikan:** sumber utama untuk screening/ranking GHI intra-kabupaten (resolusi jauh lebih halus dari NASA POWER).
- **Caveat:** GSA sendiri menyatakan bukan untuk "bankable assessment" — hanya pre-screening (EV-022). Tidak ada REST API publik terkonfirmasi — kemungkinan perlu proses manual/GIS (unduh raster, ekstrak nilai per titik koordinat kandidat).

### RA-02: NASA POWER — API time-series
- **Cara akses:** REST API gratis tanpa API key, power.larc.nasa.gov/docs/services/api/, format JSON/CSV/ASCII/NetCDF.
- **Peran yang direkomendasikan:** **BUKAN** sumber pembeda spasial intra-kabupaten (resolusi grid ~55×70km jauh lebih kasar dari Global Solar Atlas) — reposisikan sebagai sumber *time-series historis panjang* (1984–sekarang) untuk analisis variabilitas musiman/tahunan level kabupaten/provinsi, atau cross-check terhadap nilai GSA.
- **Caveat:** satuan ALLSKY_SFC_SW_DWN belum dikonfirmasi pasti (lihat SOURCE_CONFLICTS.md CF-004) — cek parameter dictionary resmi sebelum dipakai dalam perhitungan.

---

## MANUAL_ACQUISITION_REQUIRED

Dataset yang kemungkinan bisa diakses publik, tapi memerlukan pembukaan halaman/dokumen manual untuk konfirmasi isi, resolusi format, atau karena berpotensi berisi konflik yang perlu direkonsiliasi sebelum dipakai.

### MA-01: RUPTL PLN 2025–2034 (dokumen resmi)
- URL: gatrik.esdm.go.id/assets/uploads/download_index/files/4ec39-materi-paparan-ruptl-2025-2034.pdf
- Alasan manual: dokumen primer paling penting untuk konteks kebijakan nasional (EV-004), saat ini hanya diketahui via ringkasan media sekunder — perlu dibuka langsung untuk konfirmasi angka.

### MA-02: Buku IRBI 2023 &amp; 2024 (BNPB) — skor kekeringan Kubu Raya
- URL: inarisk.bnpb.go.id/IRBI-2024/files/basic-html/page308.html ; inarisk.bnpb.go.id/IRBI-2023/files/basic-html/page306.html
- Alasan manual: **evidence paling spesifik-Kubu Raya dari sumber resmi BNPB** (EV-032) — wajib dikonfirmasi skala/definisi skor sebelum dipakai sebagai fakta produksi (lihat SOURCE_CONFLICTS.md CF-003).

### MA-03: Artikel BPK Kalbar — hibah PLTS 3 desa Batu Ampar
- URL: kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/
- Alasan manual: sumber utama untuk existing PLTS Kubu Raya (EV-038) — wajib dibuka untuk merekonsiliasi konflik kapasitas (CF-001) dan memastikan rincian per-desa (Sumber Agung/Muara Tiga/Sungai Kerawang).

### MA-04: 3 paper akademik karhutla Kubu Raya (Wijaya et al.; Muharrama &amp; Widjonarko 2023; Jawad et al. 2015)
- URL: journal.ummat.ac.id/index.php/geography/article/view/20988 ; ejournal3.undip.ac.id/index.php/pwk/article/view/32816 ; jurnal.untan.ac.id/index.php/jmfkh/article/view/9244
- Alasan manual: hasil ketiganya saling tidak konsisten (CF-002) — perlu dibaca metodologi lengkap masing-masing sebelum salah satu/semua dipakai sebagai basis kriteria risiko karhutla.

### MA-05: Dataset kependudukan Desa Sungai Kerawang 31 Des 2020
- URL: data.kalbarprov.go.id (Satu Data Provinsi Kalimantan Barat)
- Alasan manual: isi belum dibaca sama sekali (EV-044) — berpotensi data desa-level langka untuk salah satu dari 3 kandidat existing-PLTS.

### MA-06: Portal Puskesmas Kabupaten Kubu Raya
- URL: puskesmas.kuburayakab.go.id
- Alasan manual: perlu cek langsung apakah koordinat geografis tersedia (EV-048 — tidak terkonfirmasi ada) dan seberapa lengkap/seragam data "sarana-prasarana" antar puskesmas.

### MA-07: Platform Fasyankes Provinsi Kalbar
- URL: kalbarsehat.kalbarprov.go.id/fasyankes/
- Alasan manual: field yang tersedia belum terkonfirmasi (EV-049).

### MA-08: Referensi Data Kemendikdasmen — sekolah Kubu Raya
- URL: referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/131300/2/jf/5/all
- Alasan manual: field detail (koordinat, jumlah siswa per sekolah) belum terkonfirmasi (EV-051) — perlu dibuka untuk memastikan granularitas nyata.

### MA-09: BPS "Kabupaten Kubu Raya Dalam Angka 2025"
- URL: kuburayakab.bps.go.id/en/publication/2025/02/28/b6bb9b4a2ce61ee62e955ec3/kabupaten-kubu-raya-dalam-angka-2025.html
- Alasan manual: publikasi resmi terbaru (data ~2024) untuk data sosial/demografis kabupaten (EV-053) — perlu diunduh untuk ekstraksi tabel relevan.

### MA-10: BPS "Kecamatan Sungai Raya/Kubu Dalam Angka 2025"
- Alasan manual: level kecamatan (EV-054) — perlu dibuka untuk memastikan cakupan kecamatan mana saja yang tersedia (baru 2 dari 9 kecamatan Kubu Raya terkonfirmasi).

### MA-11: Buku Data Statistik Sektoral Kabupaten Kubu Raya 2024 (Diskominfo)
- URL: kominfo.kuburaya.go.id
- Alasan manual: isi belum dibaca (EV-055), berpotensi melengkapi data sektoral pendidikan/kesehatan.

### MA-12: Dataset "Rasio Elektrifikasi berdasarkan Kabupaten/Kota" (data.go.id)
- URL: data.go.id/dataset/dataset/rasio-elektrifikasi ; katalog.data.go.id/id/dataset/rasio-elektrifikasi-berdasarkan-kabupaten-kota1
- Alasan manual: isi belum dibaca (EV-017) — perlu dicek apakah Kubu Raya tercakup.

### MA-13: Data ESDM Kalbar — rasio elektrifikasi &amp; PLTS per kab/kota (2019/2020)
- URL: data.kalbarprov.go.id/organization/dinas-energi-dan-sumber-daya-mineral-prov-kalbar
- Alasan manual: data sudah berumur (2019/2020, EV-018) — perlu dicek versi lebih baru sebelum dipakai, dan pastikan mencakup Kubu Raya secara eksplisit.

### MA-14: InaRISK WebGIS/ArcGIS REST Services — layer karhutla &amp; kekeringan
- URL: inarisk.bnpb.go.id/webgis/ ; gis.bnpb.go.id/server/rest/services/inarisk
- Alasan manual: perlu dicek format overlay untuk titik kandidat (koordinat), dan apakah Kubu Raya termasuk dalam 136 kab/kota yang dipetakan skala 1:50.000/1:25.000 (EV-029, belum dikonfirmasi).

### MA-15: Peta risiko karhutla gambut Kalbar 2025–2026 (Kemenhut+BRIN+YKAN)
- Alasan manual: masih tahap finalisasi per laporan berita Juli 2026 (EV-033) — cek ketersediaan publik terbaru sebelum menganggapnya sebagai sumber siap pakai.

---

## ACCESS_RESTRICTED

Tidak ada dataset yang terkonfirmasi secara eksplisit "restricted" (berbayar/butuh perizinan khusus) dalam riset ini — kategori ini kosong untuk saat ini. Kemungkinan besar karena WebFetch diblokir, banyak status "MANUAL_ACQUISITION_REQUIRED" di atas bisa berubah menjadi ACCESS_RESTRICTED setelah dibuka langsung (mis. jika portal ternyata butuh login).

---

## LOW_QUALITY

### LQ-01: Data jumlah fasilitas kesehatan/pendidikan BPS per kecamatan
- Alasan: hanya berupa hitungan agregat per kecamatan (EV-050), **bukan data per-fasilitas individual** yang dibutuhkan model data §8 `PROJECT_CONTEXT.md` — kualitas granularitasnya terlalu rendah untuk dipakai langsung sebagai data kandidat fasilitas, hanya cocok sebagai konteks/proxy berlabel eksplisit.

### LQ-02: Angka kapasitas &amp; jumlah KK PLTS Komunal 2018 (agregat, tidak konsisten)
- Alasan: conflicting antar-sumber (CF-001), tidak jelas per-desa atau agregat 3 desa — kualitas data saat ini terlalu rendah untuk dipakai sebagai `existing_plts_capacity_kwp` per fasilitas tanpa verifikasi ulang.

---

## NOT_FOUND

### NF-01: Koordinat geografis presisi untuk puskesmas/sekolah individual di Kubu Raya
- Tidak ditemukan sumber yang mengonfirmasi ketersediaan koordinat terbuka untuk fasilitas individual (lihat EV-048, EV-051).

### NF-02: Jumlah penerima manfaat (beneficiary_count) per-fasilitas individual (bukan agregat kecamatan)
- Tidak ditemukan — data yang ada hanya di level kecamatan/kabupaten (EV-050, EV-054), yang menurut aturan tugas TIDAK BOLEH dianggap sebagai `population_served_by_specific_facility`.

### NF-03: Rincian kapasitas/BESS per-desa terpisah untuk Muara Tiga &amp; Sungai Kerawang
- Hanya ditemukan angka agregat 3-desa (EV-039), tidak ada rincian per lokasi individual.

### NF-04: Kondisi teknis terkini (mis. status baterai) PLTS Sumber Agung/Muara Tiga/Sungai Kerawang
- Tidak ditemukan laporan spesifik tentang kondisi teknis terbaru PLTS-PLTS ini.

### NF-05: Konfirmasi lokasi persis "PLTS Kubu" (artikel Mongabay 2016)
- Halaman gagal dibuka, lokasi ambigu (EV-046, CF-005).

### NF-06: Link BPS Kalimantan Barat spesifik untuk tabel rasio elektrifikasi per kabupaten/kota
- Hanya ditemukan pola dari provinsi lain (Kaltim, EV-019), bukan Kalbar langsung.

### NF-07: Dokumen KRB Provinsi Kalimantan Barat resmi InaRISK yang eksplisit menyebut status karhutla/kekeringan Kubu Raya
- Yang ditemukan hanya dokumen KRB Jawa Barat sebagai contoh metodologi (EV-030) — dokumen KRB Kalbar sendiri belum ditemukan/dibuka.

---

## NOT_NEEDED

### NN-01: NASA POWER sebagai sumber utama pembeda GHI antar-kandidat dalam satu kabupaten
- Resolusi grid (~55×70km) terlalu kasar untuk membedakan titik dalam kabupaten seukuran Kubu Raya (EV-026) — perannya direklasifikasi jadi pelengkap (time-series/cross-check), bukan sumber utama.

### NN-02: Data hotspot kebakaran real-time (SIPONGI/NASA FIRMS) sebagai input skoring langsung
- Sesuai aturan tugas §J: hotspot/current incident TIDAK otomatis menjadi scoring input untuk keputusan investasi jangka panjang seperti PLTS — perannya (jika dipakai sama sekali) hanya sebagai validasi/kalibrasi terhadap peta risiko struktural, bukan input utama.

---

## Ringkasan

| Kategori | Jumlah item |
|---|---|
| READY_FOR_ACQUISITION | 2 |
| MANUAL_ACQUISITION_REQUIRED | 15 |
| ACCESS_RESTRICTED | 0 (belum terkonfirmasi ada) |
| LOW_QUALITY | 2 |
| NOT_FOUND | 7 |
| NOT_NEEDED | 2 |

**Catatan untuk agent Prompt berikutnya:** mulai dari item MANUAL_ACQUISITION_REQUIRED yang bertanda ⭐ prioritas tinggi di `RESEARCH_FINDINGS.md` (MA-02, MA-03, MA-04 — semuanya terkait konflik data yang harus direkonsiliasi sebelum dataset pilot final disusun).
