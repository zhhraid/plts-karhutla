# DATA_ACQUISITION_PLAN.md — Rencana Akuisisi Data SURYA-SIAGA

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

## READY_FOR_AUTOMATED_ACQUISITION

**(kosong)**

Tidak satu pun dataset memenuhi syarat. Kandidat terdekat (NASA POWER API) tidak dapat ditandai READY karena satuan parameternya masih `UNRESOLVED` (CF-004) dan dokumentasinya belum pernah dibuka.

## READY_FOR_MANUAL_ACQUISITION

**(kosong)**

Kandidat terdekat (Global Solar Atlas GeoTIFF) tidak dapat ditandai READY karena resolusi, CRS, format, dan lisensinya belum dikonfirmasi dari dokumentasi resmi. **Satu langkah manusia** (membuka halaman download GSA) akan langsung memindahkannya ke kategori ini.

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
| NA-01 | **Koordinat geografis fasilitas individual** (puskesmas/sekolah) | Tidak ditemukan di sumber publik mana pun. **Blocker struktural** — model data §8 `PROJECT_CONTEXT.md` mensyaratkan `latitude`/`longitude` per fasilitas, dan seluruh fitur peta bergantung padanya. Jika verifikasi manual juga gagal, diperlukan geocoding manual/permintaan data primer ke dinas. |
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
| NR-01 | **NASA POWER sebagai sumber spasial intra-kabupaten** | Resolusi grid ~0,5°×0,625° (≈55×70 km) melebihi luas kabupaten — seluruh kandidat akan jatuh pada sel grid yang sama dan **nilainya tidak memiliki daya pembeda apa pun** antar-lokasi. **Keputusan §A.5:** peran NASA POWER ditetapkan sebagai **historical/time-series validation**, BUKAN intra-kabupaten high-resolution spatial screening. (Catatan: angka resolusi ini sendiri masih `unverified` — tapi kesimpulan reklasifikasi tetap berlaku karena setiap sumber yang ditemukan menyebut skala puluhan kilometer, dan tidak ada indikasi sebaliknya.) |
| NR-02 | Data hotspot real-time (SIPONGI/NASA FIRMS) sebagai input skoring | Hotspot = kejadian near-real-time, bukan risiko struktural jangka panjang. Keputusan investasi PLTS bersifat jangka panjang. Peran maksimal: validasi/kalibrasi peta risiko struktural, bukan input skoring. |
| NR-03 | **IRBI sebagai input skoring per-situs** | Dua alasan independen: (a) skala/definisi indeks belum terverifikasi (CF-003); (b) **bahkan bila terverifikasi**, IRBI adalah indeks level kabupaten — nilainya identik untuk semua kandidat dalam Kubu Raya sehingga tidak memiliki daya pembeda. Peran yang tepat: konteks kabupaten. |

---

## Ringkasan Status

| Status | Jumlah |
|---|---|
| `READY_FOR_AUTOMATED_ACQUISITION` | **0** |
| `READY_FOR_MANUAL_ACQUISITION` | **0** |
| `MANUAL_VERIFICATION_REQUIRED` | 18 (6 di antaranya blocker Prompt 3) |
| `ACCESS_RESTRICTED` | 0 |
| `NOT_AVAILABLE` | 7 |
| `NOT_REQUIRED` | 3 |

**Perbandingan dengan Prompt 2:** sebelumnya 2 dataset ditandai "READY_FOR_ACQUISITION" (Global Solar Atlas, NASA POWER). Keduanya **diturunkan** pada pass ini — GSA karena spesifikasinya belum terverifikasi, NASA POWER karena perannya direklasifikasi menjadi `NOT_REQUIRED` untuk screening spasial. Penurunan ini adalah koreksi yang disengaja: Prompt 2 menandai READY berdasarkan *metode akses yang terlihat di hasil pencarian*, bukan berdasarkan spesifikasi yang terverifikasi.
