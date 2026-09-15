# DATA_ACQUISITION_PLAN.md — Rencana Akuisisi Data SURYA-SIAGA

> **Pembaruan aktif Prompt 3 — 2026-09-14:** bagian lama berikut adalah riwayat riset. Keputusan MVP ada di [laporan final](PROMPT_3_FINAL_DATA_ACQUISITION_REPORT.md) dan [readiness](PROMPT_4_READINESS.md). Pool 10 official_exact dikunci; beneficiary FROZEN FOR MVP (4 canonical, 6 NULL). Request student_count/population proxy lama tidak aktif. Lisensi GSA CC BY 4.0 verified via external_manual_verification; gate lisensi tidak perlu dibuka ulang. [Permintaan nilai aktif](EXTERNAL_SOLAR_HAZARD_REQUESTS.md). Pernyataan lama “koordinat belum tersedia”, “lisensi belum verified”, atau “proxy boleh menjadi beneficiary” tidak berlaku untuk 10 kandidat MVP.

**Revisi:** Prompt 2.5 (Evidence Verification & Research Repair), 2026-09-12.
**Perubahan utama:** skema status diganti sesuai §L Prompt 2.5, dan **aturan ketat diterapkan — "jangan tandai READY jika evidence dasarnya belum terverifikasi."**

> ⚠️ **Hasil verification pass:** WebFetch diuji terhadap 7 domain prioritas, ketujuhnya ditolak `EGRESS_BLOCKED` oleh kebijakan egress organisasi. **Nol evidence dinaikkan ke `verified_primary`.** Konsekuensi langsung untuk dokumen ini: **tidak satu pun dataset dapat berstatus READY**, karena tidak satu pun spesifikasi dasarnya (format, resolusi, satuan, lisensi, kelengkapan field) berhasil dikonfirmasi.

## Skema Status (§L)

| Status | Arti |
|---|---|
| `READY_FOR_AUTOMATED_ACQUISITION` | Spesifikasi terverifikasi; agent dapat mengambil secara terprogram. |
| `READY_FOR_MANUAL_ACQUISITION` | Spesifikasi terverifikasi; pengambilan perlu langkah manusia (unduh/GIS). |
| `MANUAL_VERIFICATION_REQUIRED` | Sumber teridentifikasi tapi spesifikasi/isinya belum dikonfirmasi. **Belum boleh diakuisisi sebagai fakta.** |
| `ACCESS_RESTRICTED` | Sumber itu sendiri membatasi akses (login/berbayar/perizinan). |
| `NOT_AVAILABLE` | Data tidak ditemukan atau tidak ada dalam bentuk yang dibutuhkan. |
| `NOT_REQUIRED` | Tidak dibutuhkan untuk MVP, atau perannya sudah direklasifikasi. |

> **Catatan penting tentang `ACCESS_RESTRICTED`:** kategori ini menggambarkan pembatasan **pada sumbernya sendiri**, bukan blokir proxy sesi ini. Blokir egress di lingkungan agent adalah kondisi lingkungan sementara, bukan properti sumber — karena itu sumber-sumber yang diblokir proxy tetap diklasifikasi `MANUAL_VERIFICATION_REQUIRED` (manusia kemungkinan besar dapat membukanya dengan normal), bukan `ACCESS_RESTRICTED`.

---

> ✅ **PEMBARUAN PROMPT 2.6:** sebagian sumber kini terverifikasi melalui `external_manual_verification` (bukan oleh environment agent ini — lihat EV-A s.d. EV-H di `EVIDENCE_LEDGER.md`). Karena syarat "evidence dasarnya terverifikasi" kini terpenuhi untuk sumber-sumber tersebut, status READY dapat diberikan. **Keterbatasan `EGRESS_BLOCKED` pada environment agent tetap berlaku** dan tidak dihapus — artinya akuisisi tetap memerlukan environment/manusia dengan akses jaringan.

## READY_FOR_AUTOMATED_ACQUISITION

| ID | Dataset | Evidence | Cara akuisisi | Batasan wajib |
|---|---|---|---|---|
| RA-01 | **NASA POWER API** — `ALLSKY_SFC_SW_DWN` | EV-E (`verified_secondary`) | REST API publik | **Peran terbatas: supporting historical/time-series solar source.** BUKAN pembeda spasial antar fasilitas (resolusi ~1°×1° ≈ 111 km — seluruh Kubu Raya jatuh pada sel yang sama). ⚠️ Satuan belum terverifikasi (CF-004) — **catat satuan verbatim dari respons API saat akuisisi**, jangan diasumsikan |

## READY_FOR_MANUAL_ACQUISITION

| ID | Dataset | Evidence | Cara akuisisi | Batasan wajib |
|---|---|---|---|---|
| RM-01 | **Global Solar Atlas** — GHI/DNI/DIF/GTI | EV-D (`verified_secondary`) | Unduh **GeoTIFF** atau **AAIGRID**, CRS **EPSG:4326**, resolusi **9 arcsec ≈ 250 m** | **PRIMARY SOLAR SPATIAL SCREENING SOURCE untuk MVP.** ⚠️ **Lisensi belum terverifikasi** — konfirmasi ketentuan penggunaan **sebelum** data diredistribusi/ditampilkan publik |
| RM-02 | **BPS — Kubu Raya Dalam Angka 2026** | EV-B (`verified_primary`) | Unduh publikasi, ekstrak tabel yang dibutuhkan | **Prioritaskan edisi 2026** di atas 2025. **Catat `data_reference_year` per tabel** (umumnya 2025) — jangan samakan dengan `publication_year` 2026 |
| RM-03 | **InaRISK** — layer Karhutla &amp; Kekeringan | EV-C (`verified_primary` untuk keberadaan layer &amp; pembedaan metrik) | WebGIS / layanan geospasial BNPB | ⚠️ **HAZARD ≠ RISK — tentukan dan catat metrik mana yang diambil.** Mekanisme unduh, format, tahun data, dan batas kelas **belum terverifikasi** → catat verbatim saat akuisisi |

## READY_FOR_ACQUISITION_WITH_FIELD_VALIDATION

| ID | Dataset | Evidence | Batasan wajib |
|---|---|---|---|
| RF-01 | **Kemendikdasmen** — satuan pendidikan Kubu Raya | EV-G (`verified_primary`) | Field yang **dapat** muncul: NPSN, nama, alamat, desa/kelurahan, kecamatan, status; sebagian halaman memuat **latitude/longitude**; sebagian memuat jumlah peserta didik + tanggal pembaruan. ⚠️ **Verifikasi PER SITUS.** Jangan mengasumsikan semua sekolah punya koordinat/jumlah siswa. Field kosong → **`NULL`**, bukan diisi perkiraan |
| RF-02 | **Portal Puskesmas Kubu Raya** + **Kalbar Sehat** | EV-H (`verified_primary` untuk data path saja) | Yang terverifikasi hanya **ketersediaan sumber**, bukan kelengkapan field. Seluruh field per-fasilitas — termasuk **koordinat, yang belum terkonfirmasi tersedia untuk puskesmas** — `requires_verification` sampai diambil |

---

## MANUAL_VERIFICATION_REQUIRED

Diurutkan berdasarkan prioritas. Item ⭐ adalah blocker untuk Prompt 3.

### Prioritas 1 — Blocker langsung

| ID | Dataset/Sumber | Yang harus dikonfirmasi manusia |
|---|---|---|
| ⭐ MA-01 | **Global Solar Atlas** — halaman download Indonesia | Indikator (GHI/DNI), **satuan**, **resolusi spasial**, **CRS**, format file, agregasi jangka panjang, lisensi. Ini menentukan apakah GSA layak jadi primary solar screening dataset. |
| ⭐ MA-02 | **InaRISK** — layer karhutla &amp; kekeringan | Apakah layer berupa **bahaya atau risiko** (jangan dicampur), metodologi Bahaya/Kerentanan/Kapasitas/Risiko, skala &amp; kelas indeks, tahun data, mekanisme unduh, format/geospatial service (ArcGIS REST). |
| ⭐ MA-03 | **BPK Kalbar** — artikel hibah PLTS 3 desa | Kapasitas (angka + **satuan** + desa mana + individual/agregat + tahun + apakah kapasitas terpasang), jumlah KK, tahun operasi, pengelola. Ini menyelesaikan CF-001. |
| ⭐ MA-04 | **BPS Kubu Raya** — daftar publikasi | **Apakah edisi "Kubu Raya Dalam Angka 2026" sudah terbit.** Jika ya, gunakan sebagai sumber statistik utama dan turunkan edisi 2025 menjadi reference. Catat publication_date DAN data_year secara terpisah. |
| ⭐ MA-05 | **Kemendikdasmen** — referensi data sekolah Kubu Raya | Field apa yang benar-benar tersedia publik: nama, jenjang, alamat, kecamatan, jumlah siswa, **koordinat**. |
| ⭐ MA-06 | **Portal Puskesmas Kubu Raya** + fasyankes Kalbar | Field yang tersedia, terutama **koordinat**; kelengkapan/keseragaman antar-puskesmas. |

### Prioritas 2 — Penting untuk kualitas, bukan blocker

| ID | Dataset/Sumber | Yang harus dikonfirmasi |
|---|---|---|
| MA-07 | ESDM — halaman Program PLTS 100 GWp | Keberadaan program, tanggal peluncuran, target, positioning, **apakah BESS benar-benar disebut sumber**. Gunakan wording sumber; jangan tambah angka. |
| MA-08 | Dokumen IRBI 2023/2024 (BNPB) | Definisi indeks, **range/skala**, level analisis, batas kategori, hubungan dengan layer InaRISK. Menyelesaikan CF-003. |
| MA-09 | NASA POWER — parameter dictionary | Satuan `ALLSKY_SFC_SW_DWN` per endpoint temporal, resolusi grid, cakupan temporal. Menyelesaikan CF-004. |
| MA-10 | 3 paper akademik karhutla Kubu Raya | Metodologi lengkap; konfirmasi pembedaan **bahaya vs risiko** (CF-002) dan unit analisis masing-masing. |
| MA-11 | Dataset kependudukan Desa Sungai Kerawang 2020 | Isi dataset (jumlah penduduk/KK), format, tahun data. |
| MA-12 | Data ESDM Kalbar (elektrifikasi &amp; PLTS per kab/kota) | Apakah Kubu Raya tercakup; apakah ada versi lebih baru dari 2019/2020. |
| MA-13 | RUPTL PLN 2025–2034 (PDF resmi) | Angka kapasitas EBT/PLTS — saat ini hanya diketahui via ringkasan sekunder. |
| MA-14 | BPS — Kecamatan Dalam Angka | Kecamatan mana saja yang tersedia (baru 2 dari 9 terkonfirmasi); data_year sebenarnya. |
| MA-15 | Buku Statistik Sektoral Kubu Raya 2024 (Diskominfo) | Isi; apakah memuat data fasilitas lebih granular dari BPS. |
| MA-16 | Artikel Mongabay 2016 "PLTS Kubu" | **Lokasi persis** — menyelesaikan CF-005. |
| MA-17 | Peta risiko karhutla gambut Kalbar (Kemenhut/BRIN/YKAN) | Apakah sudah final dan tersedia publik. |
| MA-18 | Dokumentasi 4 tool pembanding | Fitur yang benar-benar ada — untuk mengganti status UNKNOWN di `COMPETITOR_TOOL_MATRIX.md`. |

---

## ACCESS_RESTRICTED

**(kosong — belum terkonfirmasi ada)**

Tidak ada sumber yang terbukti membatasi akses dari sisi sumbernya sendiri. Status ini kemungkinan akan terisi setelah verifikasi manual (mis. jika portal ternyata memerlukan login, atau jurnal Elsevier ternyata berbayar untuk MA-10).

---

## NOT_AVAILABLE

| ID | Data | Catatan |
|---|---|---|
| ~~NA-01~~ | ~~Koordinat fasilitas individual~~ | ✅ **SEBAGIAN TERSELESAIKAN (Prompt 2.6).** **Sekolah:** jalur koordinat terverifikasi ada pada sebagian halaman satuan pendidikan (EV-G) → pindah ke RF-01, dengan validasi per situs. **Puskesmas:** ketersediaan koordinat **masih belum terkonfirmasi** (EV-H hanya memverifikasi data path) → tetap risiko terbuka, lihat NA-01b. |
| NA-01b | **Koordinat puskesmas** | Belum terkonfirmasi tersedia. Jika akuisisi RF-02 menunjukkan koordinat tidak ada, diperlukan alternatif: permintaan data resmi ke Dinkes Kubu Raya, geocoding dari alamat, atau digitasi manual — **semuanya wajib dilabeli sebagai estimasi**, bukan koordinat resmi. |
| NA-02 | `beneficiary_count` per fasilitas individual | Hanya tersedia agregat kecamatan/kabupaten. Tidak boleh disamakan dengan penerima manfaat satu fasilitas. |
| NA-03 | Kapasitas/BESS per-desa terpisah (Muara Tiga, Sungai Kerawang) | Hanya angka agregat 3 desa, itu pun conflicting. |
| NA-04 | Kondisi teknis terkini ketiga PLTS Batu Ampar | Tidak ada sumber yang menjelaskan status 2026. |
| NA-05 | Data BPS Kalbar rasio elektrifikasi per kab/kota | Hanya ditemukan pola provinsi lain (Kaltim), bukan Kalbar. |
| NA-06 | Dokumen KRB Provinsi Kalbar (InaRISK) | Tidak ditemukan; hanya contoh dari Jawa Barat. |
| NA-07 | Publikasi BPS level **desa/kelurahan** | Level paling granular yang ditemukan adalah kecamatan. |

---

## NOT_REQUIRED

| ID | Item | Alasan reklasifikasi |
|---|---|---|
| NR-01 | **NASA POWER sebagai sumber spasial intra-kabupaten** | ✅ **Dikonfirmasi Prompt 2.6.** EV-E (terverifikasi eksternal) menyebut parameter surya pada resolusi **~1°×1° (≈111 km)** — bahkan lebih kasar dari angka snippet sebelumnya (0,5°×0,625°, yang ternyata grid parameter **meteorologis**). Seluruh kandidat di Kubu Raya dipastikan jatuh pada sel grid yang sama → **nol daya pembeda**. Perannya sebagai **supporting historical/time-series solar source** tetap berlaku dan dataset-nya ada di RA-01. |
| NR-02 | Data hotspot real-time (SIPONGI/NASA FIRMS) sebagai input skoring | Hotspot = kejadian near-real-time, bukan risiko struktural jangka panjang. Keputusan investasi PLTS bersifat jangka panjang. Peran maksimal: validasi/kalibrasi peta risiko struktural, bukan input skoring. |
| NR-03 | **IRBI sebagai input skoring per-situs** | Dua alasan independen: (a) skala/definisi indeks belum terverifikasi (CF-003); (b) **bahkan bila terverifikasi**, IRBI adalah indeks level kabupaten — nilainya identik untuk semua kandidat dalam Kubu Raya sehingga tidak memiliki daya pembeda. Peran yang tepat: konteks kabupaten. |

---

## Ringkasan Status

| Status | Prompt 2.5 | **Prompt 2.6** |
|---|---|---|
| `READY_FOR_AUTOMATED_ACQUISITION` | 0 | **1** (RA-01) ⬆ |
| `READY_FOR_MANUAL_ACQUISITION` | 0 | **3** (RM-01…RM-03) ⬆ |
| `READY_FOR_ACQUISITION_WITH_FIELD_VALIDATION` | — | **2** (RF-01, RF-02) ⬆ |
| `MANUAL_VERIFICATION_REQUIRED` | 18 | ~12 ⬇ |
| `ACCESS_RESTRICTED` | 0 | 0 |
| `NOT_AVAILABLE` | 7 | 6 (NA-01 sebagian terselesaikan) ⬇ |
| `NOT_REQUIRED` | 3 | 3 |

### Aturan akuisisi yang mengikat (syarat gate CONDITIONAL)

Seluruh akuisisi pada Prompt 3 **wajib** mematuhi lima syarat berikut:

1. **Verifikasi dilakukan per-field**, bukan per-sumber atau per-situs. Sumber yang terverifikasi tidak membuat seluruh field-nya terverifikasi.
2. **Field yang conflicting tetap `NULL`** — khususnya `capacity_kwp` (CF-001) dan `commissioning_year` (CF-006).
3. **Field historis wajib diberi tahun** dan label historis (mis. `asset_handover_year = 2021`).
4. **Status terkini TIDAK boleh disimpulkan dari evidence historis.** Penyerahan aset 2021 bukan bukti operasional 2026.
5. **Hasil akuisisi diaudit ulang sebelum scoring.** Data boleh dikumpulkan pada Prompt 3, tetapi **belum boleh dipakai untuk scoring** sampai audit Prompt 4–6.

**Perjalanan status dataset lintas-pass:** Prompt 2 menandai 2 dataset READY berdasarkan *metode akses yang terlihat di hasil pencarian*. Prompt 2.5 **menurunkan keduanya ke 0** karena spesifikasinya belum terverifikasi. Prompt 2.6 menaikkan **6 dataset** ke status READY — kali ini berdasarkan **spesifikasi yang benar-benar diverifikasi** (di environment lain), bukan berdasarkan tampilan hasil pencarian. Perbedaan dasar inilah yang membedakan READY pada Prompt 2.6 dari READY pada Prompt 2.
