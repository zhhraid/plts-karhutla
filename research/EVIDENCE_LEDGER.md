# EVIDENCE_LEDGER.md — Registry Fakta Berstruktur SURYA-SIAGA

**Revisi:** Prompt 2.5 (Evidence Verification &amp; Research Repair), 2026-09-12.

> ⚠️ **HASIL VERIFICATION PASS PROMPT 2.5:** Verifikasi ulang diupayakan dengan menguji WebFetch terhadap 7 domain prioritas (`power.larc.nasa.gov`, `globalsolaratlas.info`, `www.esdm.go.id`, `inarisk.bnpb.go.id`, `kuburayakab.bps.go.id`, `arxiv.org`, `kalbar.bpk.go.id`). **Ketujuhnya ditolak dengan `EGRESS_BLOCKED`** — penolakan kebijakan egress organisasi, bukan masalah situs tujuan. Karena itu **NOL entri berhasil dinaikkan ke `verified_primary`**; seluruh entri `unverified` tetap `unverified` dan ditandai `MANUAL_VERIFICATION_REQUIRED`. Lihat `VERIFICATION_REPORT.md`.
>
> `data_confidence` produk (§12.1 `PROJECT_CONTEXT.md`) untuk kandidat lokasi TIDAK dihitung di sini — ledger ini adalah bukti tingkat riset, bukan skor kandidat.

Kategori: `policy`, `solar`, `disaster`, `social`, `facility`, `electricity`, `existing_plts`, `methodology`, `product_gap`.

**verification_status** yang diizinkan: `verified_primary`, `verified_secondary`, `historical`, `proxy`, `conflicting`, `unverified`.

**source_authority** (ditambahkan Prompt 2.5 §H) — A = primary official; B = authoritative technical/peer-reviewed; C = credible contextual.
> ⚠️ **Source authority BUKAN pengganti verifikasi.** URL resmi Tier A yang belum berhasil dibuka tetap `unverified`. Kedua dimensi ini independen.

**proposal_usage_status** (ditambahkan Prompt 2.5 §K) — `SAFE_TO_USE` | `SAFE_WITH_HISTORICAL_LABEL` | `SAFE_AS_CONTEXT_ONLY` | `NEEDS_MANUAL_VERIFICATION` | `DO_NOT_USE`. Tabel klasifikasi lengkap per evidence ada di bagian akhir dokumen ini.

**publication_date vs data_year** (ditegaskan Prompt 2.5 §G) — keduanya TIDAK boleh disamakan. Tahun terbit dokumen bukan tahun data yang dikandungnya. Audit khusus ada di bagian akhir dokumen.

**verification_method** (ditambahkan Prompt 2.6) — **wajib** untuk setiap entri terverifikasi, agar jelas SIAPA yang memverifikasi:

| Nilai | Arti |
|---|---|
| `agent_verified` | Environment agent ini membuka sendiri halaman sumber. Hanya 1 entri (EV-014, via GitHub). |
| `external_manual_verification` | Diverifikasi **di luar environment agent ini**, oleh manusia/environment lain yang dapat membuka halaman sumber asli. Agent ini **tidak** membuka URL-nya dan **tidak** mengklaim telah melakukannya. |
| `snippet_only` | Hanya dari hasil/ringkasan mesin pencari. Halaman asli belum dibuka oleh siapa pun. **Bukan bukti.** |

---

# BAGIAN I — EXTERNALLY VERIFIED EVIDENCE (EV-A – EV-H)

**Ditambahkan:** Prompt 2.6, 2026-09-12.

> ℹ️ **Asal-usul bagian ini:** entri EV-A s.d. EV-H **tidak diverifikasi oleh environment agent ini.** Seluruhnya diverifikasi di environment lain yang tidak terkena pembatasan egress, lalu diserahkan ke registry ini. Keterbatasan `EGRESS_BLOCKED` pada environment agent **tetap berlaku dan tetap dicatat** (lihat Bagian II dan `VERIFICATION_REPORT.md`) — external verification tidak menghapus keterbatasan itu, hanya melengkapinya dari jalur lain.

---

**EV-A — Program PLTS 100 GWp**
- claim: Pemerintah resmi memulai Program PLTS 100 GWp; peluncuran di Gilimanuk, Bali, 25 Agustus 2026; diposisikan Kementerian ESDM sebagai bagian penguatan kemandirian dan ketahanan energi nasional; peluncuran terhubung dengan beberapa proyek PLTS lain.
- category: `policy`
- source_title: "Dari Gilimanuk hingga Pulau Rengit, Program PLTS 100 GWp Dorong Kemandirian Energi Nasional"
- publisher: Kementerian Energi dan Sumber Daya Mineral Republik Indonesia
- source_url: https://esdm.go.id/id/media-center/arsip-berita/dari-gilimanuk-hingga-pulau-rengit-program-plts-100-gwp-dorong-kemandirian-energi-nasional
- publication_date: 25/26 Agustus 2026 | data_year: 2026
- source_authority: **A** | verification_status: **`verified_primary`** | verification_method: **`external_manual_verification`**
- proposal_usage_status: **`SAFE_TO_USE`**
- notes: ⚠️ **Hanya klaim di atas yang terverifikasi.** Angka investasi, tenaga kerja, penghematan, atau target turunan **TIDAK** tercakup dan tetap `DO_NOT_USE` (lihat EV-002, EV-003). Menggantikan EV-001 sebagai entri otoritatif untuk keberadaan program.

**EV-B — BPS Kabupaten Kubu Raya Dalam Angka 2026**
- claim: Publikasi resmi tahunan tersedia; statistik utama merepresentasikan pelaksanaan pembangunan selama tahun 2025; data bersumber dari berbagai instansi/dinas/lembaga serta pengumpulan/pengolahan BPS.
- category: `social`
- source_title: Kabupaten Kubu Raya Dalam Angka 2026 / Kubu Raya Regency in Figures 2026
- publisher: BPS Kabupaten Kubu Raya
- source_url: https://kuburayakab.bps.go.id/id/publication/2026/02/27/c93f971b4b29eaf6005aa0e3/kubu-raya-regency-in-figures-2026.html
- **publication_year: 2026** (rilis 27 Februari 2026) | **data_reference_year: 2025**
- source_authority: **A** | verification_status: **`verified_primary`** | verification_method: **`external_manual_verification`**
- proposal_usage_status: **`SAFE_TO_USE`**
- notes: **Edisi 2026 diprioritaskan** di atas edisi 2025 apabila tabel yang dibutuhkan tersedia. Edisi 2025 (EV-053) turun menjadi historical/reference. ⚠️ `publication_year` ≠ `data_reference_year` — wajib dibedakan per tabel; sebuah tabel dalam edisi 2026 bisa saja merepresentasikan tahun selain 2025, jadi **tahun data dicatat per tabel saat akuisisi**, bukan diasumsikan seragam.

**EV-C — InaRISK (BNPB)**
- claim: InaRISK menyediakan layer antara lain **Kebakaran Hutan dan Lahan** dan **Kekeringan**; InaRISK secara eksplisit membedakan **Bahaya, Kerentanan, Kapasitas, dan Risiko**.
- category: `disaster`
- publisher: BNPB
- source_url: https://inarisk.bnpb.go.id/
- source_authority: **A** | verification_status: **`verified_primary`** | verification_method: **`external_manual_verification`**
- proposal_usage_status: **`SAFE_TO_USE`**
- notes: ⚠️ **HAZARD ≠ RISK.** Jangan membandingkan atau menggabungkan angka bahaya dan risiko seolah metrik yang sama. Ini mengonfirmasi reklasifikasi CF-002 secara independen — pembedaan tersebut dinyatakan oleh platform BNPB sendiri, bukan hanya inferensi analitis Prompt 2.5.
- **yang TIDAK tercakup verifikasi ini** (tetap `MANUAL_VERIFICATION_REQUIRED`): mekanisme unduh/format layanan geospasial, tahun data per layer, skala &amp; batas kelas indeks, dan apakah Kubu Raya termasuk wilayah yang dipetakan pada resolusi lebih rinci.

**EV-D — Global Solar Atlas**
- claim: Parameter sumber daya surya mencakup **GHI, DNI, DIF, GTI**; resolusi spasial sumber daya surya **9 arcsec (nominal ±250 meter)**; spatial reference **EPSG:4326**; format unduhan mencakup **GeoTIFF** dan **AAIGRID/Esri ASCII Grid**; GHI = Global Horizontal Irradiation.
- category: `solar`
- source_title: Global Solar Atlas — FAQ / Data Outputs
- publisher: Global Solar Atlas / World Bank / ESMAP / Solargis
- source_url: https://www.globalsolaratlas.info/support/faq
- source_authority: **B** | verification_status: **`verified_secondary`** (authoritative technical) | verification_method: **`external_manual_verification`**
- proposal_usage_status: **`SAFE_TO_USE`**
- **KEPUTUSAN:** Global Solar Atlas ditetapkan sebagai **PRIMARY SOLAR SPATIAL SCREENING SOURCE** untuk MVP, sepanjang penggunaan datanya mematuhi ketentuan/lisensi yang berlaku.
- notes: ⚠️ **Lisensi belum termasuk dalam paket verifikasi eksternal.** Klaim CC BY 4.0 pada EV-021 masih `snippet_only`. **Ketentuan lisensi wajib dikonfirmasi sebelum data diredistribusi atau ditampilkan publik** dalam aplikasi/proposal. Ini terbuka sebagai item verifikasi tersisa.

**EV-E — NASA POWER**
- claim: NASA POWER menyediakan API; parameter `ALLSKY_SFC_SW_DWN` digunakan untuk radiasi surya; dokumentasi menyebut parameter surya tersedia pada resolusi **sekitar 1° × 1°**; parameter meteorologis memiliki resolusi berbeda.
- category: `solar`
- publisher: NASA POWER
- source_url: https://power.larc.nasa.gov/docs/tutorials/service-data-request/api/
- source_authority: **B** | verification_status: **`verified_secondary`** | verification_method: **`external_manual_verification`**
- proposal_usage_status: **`SAFE_TO_USE`**
- **KEPUTUSAN:** NASA POWER **BUKAN** primary spatial differentiator antar fasilitas berdekatan dalam satu kabupaten. Peran yang disetujui: **supporting historical/time-series solar source.**
- notes: Verifikasi ini **mengoreksi** angka resolusi pada EV-026 (`snippet_only`: 0,5° × 0,625°). Angka lama itu adalah grid parameter **meteorologis** (MERRA-2), bukan parameter surya — dokumentasi resmi menyebut keduanya memang berbeda. Koreksi ini **memperkuat**, bukan melemahkan, keputusan reklasifikasi peran: 1° ≈ 111 km, bahkan lebih kasar dari angka sebelumnya, sehingga seluruh kandidat di Kubu Raya dipastikan jatuh pada sel grid yang sama. ⚠️ **Satuan `ALLSKY_SFC_SW_DWN` tetap belum terverifikasi** (CF-004 masih terbuka) — dampaknya kecil karena perannya kini terbatas pada time-series.

**EV-F — Existing PLTS Kubu Raya (hibah aset 2021)**
- claim: Pada 2021 terdapat **penyerahan hibah aset PLTS** kepada tiga desa di Kecamatan Batu Ampar: **Desa Sumber Agung, Desa Sungai Kerawang, Desa Muara Tiga**. Aset direncanakan/disebut akan dikelola oleh BUMDes. Sumber menggambarkan ketiga desa sebagai desa jauh/terpencil dengan persoalan kebutuhan sarana dasar, khususnya listrik/penerangan **pada konteks saat itu**.
- category: `existing_plts`
- source_title: "Tiga Desa Terjauh di Kubu Raya Terima Hibah PLTS"
- publisher: BPK Perwakilan Provinsi Kalimantan Barat
- source_url: https://kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/
- **publication_date: 30 Desember 2021** | **data_year: 2021** (peristiwa penyerahan aset)
- source_authority: **A** | verification_status: **`verified_primary`** | verification_method: **`external_manual_verification`**
- proposal_usage_status: **`SAFE_WITH_HISTORICAL_LABEL`**
- notes: ⚠️ **CRITICAL — evidence ini HANYA memverifikasi keberadaan historis PLTS dan penyerahan aset pada 2021.** Field berikut **TIDAK** ikut terverifikasi dan tetap mengikuti evidence masing-masing: `capacity_kwp`, `battery_capacity`, `served_households`, `2026_operational_status`, `2026_grid_status`.
- ⚠️ **Temuan baru:** tanggal terverifikasi adalah **2021 (penyerahan aset)**, sedangkan sumber `snippet_only` sebelumnya menyebut program "sejak 2018". Keduanya bisa konsisten (operasi 2018, serah terima aset 2021) atau salah satunya keliru — **`commissioning_year` tetap `unverified`.** Dicatat sebagai CF-006.

**EV-G — Data Pendidikan (Kemendikdasmen)**
- claim: Portal menyediakan daftar satuan pendidikan untuk Kabupaten Kubu Raya dan kecamatan. Field yang dapat muncul: **NPSN, nama sekolah, alamat, desa/kelurahan, kecamatan, status sekolah**. Pada halaman satuan pendidikan tertentu juga tersedia **latitude dan longitude**. Pada halaman informasi pendidikan tertentu tersedia **jumlah peserta didik dan tanggal pembaruan**.
- category: `facility`
- publisher: Kemendikdasmen
- source_url: https://referensi.data.kemendikdasmen.go.id/
- source_authority: **A** | verification_status: **`verified_primary`** | verification_method: **`external_manual_verification`**
- **Acquisition decision:** `READY_FOR_ACQUISITION` **dengan PER-SITE FIELD VALIDATION.**
- notes: ⚠️ Contoh yang diverifikasi hanya membuktikan **kapabilitas portal**, BUKAN bahwa semua sekolah memiliki semua field. **Jangan mengasumsikan semua sekolah punya koordinat atau jumlah siswa lengkap** — validasi per situs, dan field yang kosong tetap `NULL`.
- **Dampak:** ini sebagian menyelesaikan blocker NA-01 (koordinat fasilitas) — **untuk sekolah**. Koordinat puskesmas belum memiliki jalur terverifikasi (lihat EV-H).

**EV-H — Jalur Data Fasilitas Kesehatan**
- claim: Portal Puskesmas Kabupaten Kubu Raya tersedia; Kalbar Sehat menyediakan daftar fasilitas layanan kesehatan Provinsi Kalimantan Barat; fasilitas di Kabupaten Kubu Raya dapat muncul dalam portal.
- category: `facility`
- publisher: Pemkab Kubu Raya; Dinas Kesehatan Prov. Kalbar
- source_url: https://puskesmas.kuburayakab.go.id/ ; https://kalbarsehat.kalbarprov.go.id/
- source_authority: **A** | verification_status: **`verified_primary` untuk keberadaan portal/source pathway** | verification_method: **`external_manual_verification`**
- **Acquisition status:** `READY_FOR_ACQUISITION_WITH_FIELD_VALIDATION`
- notes: ⚠️ **Yang diverifikasi adalah DATA PATH / ketersediaan sumber, BUKAN kelengkapan field.** Seluruh field per-fasilitas (termasuk **koordinat**, yang belum terkonfirmasi tersedia untuk puskesmas) berstatus `requires_verification` sampai benar-benar diambil.

---

## Peta Dampak: Entri Lama yang Diperbarui EV-A – EV-H

| Entri lama | Status setelah Prompt 2.6 |
|---|---|
| EV-001 (program PLTS 100 GWp) | **Digantikan EV-A** — kini `verified_primary` untuk keberadaan/peluncuran/positioning |
| EV-002, EV-003 (angka investasi &amp; kapasitas) | **Tidak berubah — tetap `DO_NOT_USE`.** Tidak tercakup verifikasi eksternal |
| EV-020, EV-021, EV-023 (spesifikasi GSA) | **Sebagian digantikan EV-D.** Resolusi/CRS/format kini terverifikasi; **lisensi (EV-021) tetap `snippet_only`** |
| EV-024–EV-027 (NASA POWER) | **Sebagian digantikan EV-E.** Resolusi surya dikoreksi ke ~1°×1°; **satuan tetap belum terverifikasi** |
| EV-028 (metodologi InaRISK) | **Dikuatkan EV-C** untuk pembedaan bahaya/kerentanan/kapasitas/risiko; sisanya tetap belum terverifikasi |
| EV-029–EV-031 (skala, kelas, akses InaRISK) | **Tidak berubah** — tetap `MANUAL_VERIFICATION_REQUIRED` |
| EV-032 (skor IRBI Kubu Raya) | **Tidak berubah.** CF-003 tetap terbuka; IRBI tetap dilarang sebagai input skoring situs |
| EV-038 (hibah PLTS 3 desa) | **Digantikan EV-F** — kini `verified_primary` untuk keberadaan &amp; penyerahan aset 2021 |
| EV-039 (kapasitas &amp; KK) | **Tidak berubah — tetap `DO_NOT_USE`.** CF-001 tetap terbuka, `capacity_kwp = NULL` |
| EV-051 (data sekolah) | **Digantikan EV-G** — kini `verified_primary`, termasuk adanya jalur koordinat |
| EV-048, EV-049 (portal kesehatan) | **Digantikan EV-H** — data path `verified_primary`, field per-fasilitas belum |
| EV-053 (BPS Dalam Angka 2025) | **Diturunkan menjadi historical/reference** — digantikan EV-B (edisi 2026) |

---

# BAGIAN II — EVIDENCE HASIL RISET AGENT (EV-001 – EV-060)

> ⚠️ **Seluruh entri di Bagian II berstatus `snippet_only` kecuali EV-014**, dan **tidak** diverifikasi oleh environment agent ini maupun secara eksternal — kecuali yang ditandai dalam peta dampak di atas. Keterbatasan `EGRESS_BLOCKED` yang mendasarinya tetap berlaku dan sengaja tidak dihapus dari dokumen ini sebagai catatan metodologis.

---

## Kategori: POLICY

**EV-001**
- claim: Kementerian ESDM meluncurkan program "PLTS 100 GWp" (target penyelesaian ~3 tahun), diresmikan sekitar 25 Agustus 2026 di Monumen Operasi Gilimanuk, Bali, terhubung hybrid dengan proyek PLTS Terapung Gajah Mungkur, PLTS Desa Sembur, PLTS Pulau Rengit.
- source_title: Dari Gilimanuk hingga Pulau Rengit, Program PLTS 100 GWp Dorong Kemandirian Energi Nasional
- publisher: Kementerian ESDM RI (Media Center)
- source_url: https://www.esdm.go.id/id/media-center/arsip-berita/dari-gilimanuk-hingga-pulau-rengit-program-plts-100-gwp-dorong-kemandirian-energi-nasional
- publication_date: ~25 Agustus 2026 | data_year: 2026
- access_date: 2026-09-11
- source_type: berita resmi pemerintah (Tier A)
- geographic_scope: nasional
- value/unit: 100 GWp (target kapasitas)
- verification_status: unverified
- notes: sumber domain resmi ESDM, tapi halaman tidak terbuka via WebFetch di sesi ini.

**EV-002**
- claim: Program PLTS 100 GWp menyertakan BESS; target mengurangi ketergantungan impor energi senilai ~USD28,9 miliar.
- source_title: (gabungan artikel ESDM + media sekunder)
- publisher: Kementerian ESDM RI / Serayu Nusantara
- source_url: https://serayunusantara.com/kementerian-esdm-targetkan-plts-100-gw-tekan-impor-energi-hingga-usd289-miliar/
- publication_date: tidak tercantum | data_year: 2026
- access_date: 2026-09-11
- source_type: berita (Tier A/C campuran)
- geographic_scope: nasional
- value/unit: USD 28,9 miliar
- verification_status: unverified

**EV-003**
- claim: PLN menargetkan tambahan kapasitas PLTS+BESS: 4,6 GW (2027), 4,4 GW (2028), 2,7 GW (2029), 2,4 GW (2030).
- source_title: PLN: Akan Ada Tambahan Kapasitas PLTS Pakai Baterai 4,6 GW di 2027
- publisher: CNBC Indonesia
- source_url: https://www.cnbcindonesia.com/news/20260702170705-4-747622/pln-akan-ada-tambahan-kapasitas-plts-pakai-baterai-46-gw-di-2027
- publication_date: 2 Juli 2026 | data_year: 2026
- access_date: 2026-09-11
- source_type: media nasional (Tier C)
- geographic_scope: nasional
- verification_status: unverified

**EV-004**
- claim: RUPTL PLN 2025–2034 (disahkan 26 Mei 2025) menetapkan tambahan kapasitas 69,5 GW, terdiri 42,6 GW EBT (61%) dan 10,3 GW penyimpanan energi (15%); rincian EBT: PLTS 17,1 GW, PLTA 11,7 GW, PLT Bayu 7,2 GW, Panas Bumi 5,2 GW, Bioenergi 0,9 GW, Nuklir 0,5 GW.
- source_title: Materi Paparan RUPTL PT PLN (Persero) 2025–2034
- publisher: Ditjen Ketenagalistrikan ESDM (gatrik.esdm.go.id) — dokumen PDF resmi, tapi angka di sini diambil dari ringkasan media sekunder (Bisnis.com, Detik, Katadata), BUKAN dari pembacaan langsung PDF
- source_url: https://gatrik.esdm.go.id/assets/uploads/download_index/files/4ec39-materi-paparan-ruptl-2025-2034.pdf
- publication_date: Mei 2025 | data_year: 2025
- access_date: 2026-09-11
- source_type: dokumen resmi pemerintah (Tier A), tapi via ringkasan sekunder
- geographic_scope: nasional
- verification_status: unverified — **dokumen primer paling penting, sangat disarankan dibuka manual**

**EV-005**
- claim: Peraturan Presiden (Perpres) khusus PLTS 100 GWp masih dalam proses harmonisasi lintas kementerian per awal September 2026 (belum final); 14 proyek sudah diluncurkan (5,3 GW terumumkan, ~4,5 GWp siap tender).
- source_title: Pemerintah persiapkan perpres untuk PLTS 100 GWp
- publisher: ANTARA News (mengutip Eniya Listiani Dewi, Dirjen EBTKE, IndoEBTKE ConEx 2026)
- source_url: https://www.antaranews.com/berita/5710828/pemerintah-persiapkan-perpres-untuk-plts-100-gwp
- publication_date: ~3 September 2026 | data_year: 2026
- access_date: 2026-09-11
- source_type: media nasional (Tier C)
- geographic_scope: nasional
- verification_status: unverified
- notes: bukti bahwa kerangka regulasi PLTS 100GWp masih berjalan, bukan final.

**EV-006**
- claim: PLN menyeleksi lahan pemerintah (termasuk bank tanah ATR/BPN) untuk proyek PLTS/penyimpanan energi; ESDM mengantongi ~9.000 hektare lahan untuk mengejar PLTS 30 GW. Tidak ditemukan istilah eksplisit "site prioritization"/metodologi MCDA dalam sumber ini — hanya seleksi berbasis ketersediaan aset.
- source_title: PLN seleksi lahan pemerintah untuk proyek PLTS dan penyimpanan energi / ESDM Kantongi 9.000 Hektare Lahan untuk Kejar PLTS 30 GW
- publisher: ANTARA News / CNN Indonesia
- source_url: https://www.antaranews.com/berita/5702961/pln-seleksi-lahan-pemerintah-untuk-proyek-plts-dan-penyimpanan-energi ; https://www.cnnindonesia.com/ekonomi/20260819143604-85-1394004/esdm-kantongi-9000-hektare-lahan-untuk-kejar-plts-30-gw
- publication_date: ~Agustus 2026 | data_year: 2026
- access_date: 2026-09-11
- source_type: media nasional (Tier C)
- geographic_scope: nasional
- verification_status: unverified
- notes: **NOT_FOUND** — tidak ada dokumen resmi pemerintah yang eksplisit menyebut metodologi "site prioritization"/MCDA untuk lokasi PLTS.

**EV-007**
- claim: RUEN (PP No. 22/2017) menetapkan potensi teknis EBT 443,2 GW (belum diperbarui sejak 2014 menurut IESR). Studi IESR "Beyond 443 GW" (Okt 2021, berbasis GIS) menemukan potensi jauh lebih besar (~7.879 GW skenario 1, ~7.714 GW dari surya), direkomendasikan untuk perencanaan/alokasi sumber daya pemerintah.
- source_title: Beyond 443 GW: Indonesia's Infinite Renewable Energy Potentials
- publisher: Institute for Essential Services Reform (IESR) — lembaga think-tank, BUKAN dokumen resmi pemerintah
- source_url: https://iesr.or.id/wp-content/uploads/2021/10/IESR-Beyond-443-GW-Indonesias-Infinite-Renewable-Energy-Potentials.pdf
- publication_date: Oktober 2021 | data_year: 2021 (berbasis RUEN 2014)
- access_date: 2026-09-11
- source_type: laporan riset lembaga non-pemerintah (Tier B)
- geographic_scope: nasional
- verification_status: unverified

---

## Kategori: METHODOLOGY

**EV-008**
- claim: "GIS-AHP Multi-Decision-Criteria-Analysis for the Optimal Location of Solar Energy Plants at Indonesia" (platform "SolarBoost") — studi kasus **Kalimantan Barat**, dibiayai British Council Newton Fund Institutional Links 2019–2020. Kriteria: klimatologi/iradiasi (perlu resolusi tinggi karena ±4° dari ekuator), topografi, jaringan listrik, infrastruktur jalan, kedekatan permukiman, kawasan konservasi budaya/ekologis.
- source_title: GIS-AHP Multi-Decision-Criteria-Analysis for the Optimal Location of Solar Energy Plants at Indonesia
- publisher: Ruiz, Sunarso, Ibrahim-Bathis, et al. — preprint arXiv:2007.15351, versi jurnal Solar Energy (Elsevier)
- source_url: https://arxiv.org/abs/2007.15351 ; https://www.sciencedirect.com/science/article/pii/S2352484720316243
- publication_date: 2020 | data_year: 2019–2020
- access_date: 2026-09-11
- source_type: paper akademik (Tier B)
- geographic_scope: Kalimantan Barat (provinsi tempat pilot Kubu Raya berada)
- verification_status: unverified
- notes: **paling relevan** — lokasi studi sama-sama Kalbar. Tantangan yang disebutkan: kebutuhan citra resolusi tinggi untuk iradiasi, kompleksitas pembobotan area konservasi.

**EV-009**
- claim: "Solar PV power plant site selection using a GIS-AHP based approach with application in Saudi Arabia" — AHP menghitung Land Suitability Index; kriteria: kedekatan jalan utama, jaringan transmisi, kota; hasil ~16% area studi cocok untuk PLTS skala utilitas.
- publisher: Al Garni &amp; Awasthi, Applied Energy 206 (2017), hlm. 1225–1240
- source_url: https://www.sciencedirect.com/science/article/abs/pii/S030626191731437X
- publication_date: 2017 | data_year: 2017
- access_date: 2026-09-11
- source_type: paper akademik (Tier B)
- geographic_scope: Arab Saudi (internasional, bukan Indonesia)
- verification_status: unverified

**EV-010**
- claim: "Site suitability for solar and wind energy in developing countries using combination of GIS-AHP; a case study of Pakistan" — 8 sub-kriteria dianalisis AHP; hasil 25,28% area cocok PLTS skala utilitas, 5,93% cocok PLTB.
- publisher: Raza, Yousif, Hassan, Numan, Abbas Kazmi, Renewable Energy 206 (2023), hlm. 180–191
- source_url: https://www.sciencedirect.com/science/article/abs/pii/S0960148123001520
- publication_date: 2023 | data_year: 2023
- access_date: 2026-09-11
- source_type: paper akademik (Tier B)
- geographic_scope: Pakistan
- verification_status: unverified

**EV-011**
- claim: "Site suitability assessment for solar power plants in Bangladesh: A GIS-based AHP and MCDA approach" — AHP menghitung bobot kriteria fisiografis/utilitas/iklim; hasil 44,59% (66.506,49 km²) area selatan-barat daya Bangladesh sangat cocok. Diklaim penulis sebagai penelitian GIS-MCDM PERTAMA untuk PLTS di Bangladesh.
- publisher: Islam, Aziz, Alauddin, Kader, Islam, Renewable Energy 220 (2024)
- source_url: https://www.sciencedirect.com/science/article/abs/pii/S0960148123015100
- publication_date: 2024 | data_year: 2024
- access_date: 2026-09-11
- source_type: paper akademik (Tier B)
- geographic_scope: Bangladesh
- verification_status: unverified
- notes: contoh klaim "pertama" dalam literatur — relevan sebagai preseden bahwa klaim semacam ini lazim di jurnal MCDA-solar-siting, sehingga SURYA-SIAGA juga harus berhati-hati dengan klaim serupa (lihat `docs/PRODUCT_AUDIT.md` §5, §9).

**EV-012**
- claim: "A robust, resilience multi-criteria decision-making with risk approach: a case study for renewable energy location" — mengusulkan RRMCDMR (menambahkan fungsi risiko + pendekatan robust-convex untuk ketidakpastian ke MCDM); studi kasus lokasi PLT Bayu Iran.
- publisher: Environmental Science and Pollution Research, Springer Nature (Januari 2023)
- source_url: https://link.springer.com/article/10.1007/s11356-023-25223-1
- publication_date: Januari 2023 | data_year: 2023
- access_date: 2026-09-11
- source_type: paper akademik (Tier B)
- geographic_scope: Iran
- verification_status: unverified
- notes: paling relevan secara konseptual untuk elemen resilience/risiko dalam MCDA SURYA-SIAGA.

**EV-013**
- claim: "Sensitivity analysis approaches in multi-criteria decision analysis: A systematic review" — mereview 250 studi sensitivity analysis dalam MCDA (metodologi PRISMA).
- publisher: Więckowski &amp; Sałabun, Applied Soft Computing 148 (2023), artikel 110915
- source_url: https://www.sciencedirect.com/science/article/pii/S156849462300933X ; DOI 10.1016/j.asoc.2023.110915
- publication_date: 2023 | data_year: 2023
- access_date: 2026-09-11
- source_type: paper akademik/tinjauan sistematis (Tier B)
- geographic_scope: global (tinjauan literatur)
- verification_status: unverified
- notes: konfirmasi bahwa sensitivity analysis bobot MCDA adalah topik aktif dan mapan.

**EV-014**
- claim: DAMA-DMBOK2 mendefinisikan dimensi kualitas data (versi ringkasan pihak ketiga): Accuracy (ketepatan mencerminkan kondisi nyata, termasuk verifikasi ke sumber otoritatif), Completeness, Consistency, Integrity, Reasonability, Timeliness ("mencerminkan akurasi data pada titik waktu tertentu"), Uniqueness, Validity.
- source_title: DAMA-DMBOK2-Data-Quality (README)
- publisher: repositori GitHub pihak ketiga (androchentw), meringkas DAMA Guide to the Data Management Body of Knowledge ed.2 — BUKAN situs resmi DAMA
- source_url: https://github.com/androchentw/DAMA-DMBOK2-Data-Quality
- publication_date: tidak tercantum | data_year: tidak tercantum
- access_date: 2026-09-11
- source_type: ringkasan pihak ketiga (Tier B, secondary)
- geographic_scope: global (framework generik)
- verification_status: **verified_secondary** (satu-satunya halaman yang berhasil dibuka penuh via WebFetch di sesi ini — tapi tetap sumber sekunder, bukan dokumen resmi DAMA)
- notes: mencakup 4 dari 5 dimensi yang diminta untuk basis Data Confidence (§12.1 `PROJECT_CONTEXT.md`): accuracy/verification, recency (timeliness), completeness, consistency — TIDAK mencakup "source authority" atau "conflicting evidence" sebagai dimensi terpisah bernama eksplisit.

**EV-015**
- claim: FAIR Guiding Principles (Findable, Accessible, Interoperable, Reusable) untuk data management.
- publisher: Wilkinson, Dumontier, Aalbersberg, et al., Scientific Data 3, artikel 160018 (2016), DOI 10.1038/sdata.2016.18
- source_url: https://www.nature.com/articles/sdata201618
- publication_date: 15 Maret 2016 | data_year: 2016
- access_date: 2026-09-11
- source_type: paper akademik (Tier B)
- geographic_scope: global (framework generik)
- verification_status: unverified
- notes: relevan untuk "completeness"/deskripsi metadata, kurang relevan untuk "conflicting evidence".

---

## Kategori: ELECTRICITY

**EV-016**
- claim: Rasio Elektrifikasi nasional 99,82–99,83% (Triwulan III 2024; khusus PLN 98,42%); Rasio Desa Berlistrik nasional 99,90% (khusus PLN 92,75%). Tren: 98,89% (2019) → 99,20% (2020) → 99,45% (2021) → 99,63% (2022) → 99,79% (2023) → 99,83% (2024).
- publisher: Ditjen Ketenagalistrikan, Kementerian ESDM RI
- source_url: https://gatrik.esdm.go.id/berita/?slug=meningkat-rasio-desa-berlistrik-dan-rasio-elektrifikasi-triwulan-iii-2024-ditetapkan
- publication_date: ~akhir 2024 | data_year: 2024 (Triwulan III)
- access_date: 2026-09-11
- source_type: statistik resmi pemerintah (Tier A)
- geographic_scope: nasional
- verification_status: unverified
- notes: **mengonfirmasi bahwa data rasio elektrifikasi nasional resmi ADA dan dipublikasikan berkala**.

**EV-017**
- claim: Dataset "Rasio Elektrifikasi berdasarkan Kabupaten/Kota" tersedia di portal Satu Data Indonesia.
- publisher: Satu Data Indonesia (data.go.id / katalog.data.go.id)
- source_url: https://data.go.id/dataset/dataset/rasio-elektrifikasi ; https://katalog.data.go.id/id/dataset/rasio-elektrifikasi-berdasarkan-kabupaten-kota1
- publication_date: tidak tercantum | data_year: tidak tercantum
- access_date: 2026-09-11
- source_type: portal data resmi (Tier A)
- geographic_scope: kabupaten/kota (level tersedia, isi belum dikonfirmasi mencakup Kubu Raya)
- verification_status: unverified

**EV-018**
- claim: Dinas ESDM Prov. Kalbar mempublikasikan data rasio elektrifikasi &amp; desa belum berlistrik per kabupaten/kota (teridentifikasi hingga Desember 2020), serta data PLTM/PLTMH/PLTS per kabupaten/kota (2019), di portal Satu Data Provinsi Kalimantan Barat.
- publisher: Satu Data Provinsi Kalimantan Barat (data.kalbarprov.go.id)
- source_url: https://data.kalbarprov.go.id/organization/dinas-energi-dan-sumber-daya-mineral-prov-kalbar
- publication_date: data s.d. Desember 2020 (elektrifikasi), 2019 (PLTS per kab/kota) | data_year: 2019–2020
- access_date: 2026-09-11
- source_type: portal data resmi provinsi (Tier A)
- geographic_scope: Kalimantan Barat, per kabupaten/kota (termasuk kemungkinan Kubu Raya — belum dikonfirmasi langsung)
- verification_status: unverified
- notes: **jawaban paling relevan untuk pertanyaan "apakah data elektrifikasi/PLTS eksisting per kabupaten tersedia di Kalbar"** — tapi datanya sudah berumur (2019/2020), perlu dicek versi terbaru.

**EV-019**
- claim: BPS Provinsi Kalimantan Timur mempublikasikan tabel "Electrification Ratio by Regency/Municipality" resmi — pola ini mengindikasikan BPS provinsi lain kemungkinan besar punya tabel serupa.
- publisher: BPS-Statistics Indonesia, Provinsi Kalimantan Timur
- source_url: https://kaltim.bps.go.id/en/statistics-table/2/Mzk5IzI=/rasio-elektrifikasi-menurut-kabupaten-kota.html
- publication_date: tidak tercantum | data_year: tidak tercantum
- access_date: 2026-09-11
- source_type: statistik resmi (Tier A)
- geographic_scope: Kalimantan Timur (BUKAN Kalbar — analog saja)
- verification_status: unverified
- notes: **NOT_FOUND** — link BPS Kalbar spesifik untuk tabel rasio elektrifikasi tidak ditemukan dalam pencarian ini.

---

## Kategori: SOLAR

**EV-020**
- claim: Global Solar Atlas menyediakan indikator GHI, DNI, DIF, GTI, OPTA, PVOUT, dan suhu udara; resolusi spasial ~250 m (9 arc-sec) untuk GHI/DNI/DIF/GTI, ~1 km (30 arc-sec) untuk PVOUT/TEMP, ~4 km (2 arc-min) untuk OPTA. Cakupan temporal rata-rata jangka panjang 1994–2024.
- publisher: World Bank Group (ESMAP) / Solargis
- source_url: https://globalsolaratlas.info/download ; https://datacatalog.worldbank.org/search/dataset/0038640 ; https://energydata.info/dataset/world-high-resolution-solar-resource-ghi-dif-gti-dni-gis-data-global-solar-atlas
- publication_date: tidak dikonfirmasi (GSA 2.0) | data_year: 1994–2024
- access_date: 2026-09-11
- source_type: situs teknis resmi (Tier B)
- geographic_scope: global
- value/unit: kWh/m² (satuan energi); resolusi dalam meter/arc-sec seperti disebutkan
- verification_status: unverified
- notes: angka resolusi konsisten muncul di 2 sumber independen (World Bank data catalog + energydata.info) — cukup kredibel meski belum dikonfirmasi via metadata resmi.

**EV-021**
- claim: Lisensi Global Solar Atlas — CC BY 4.0, atribusi wajib "© The World Bank, Source: Global Solar Atlas 2.0, Solar resource data: Solargis".
- source_url: https://globalsolaratlas.info/download
- access_date: 2026-09-11
- source_type: situs teknis resmi (Tier B)
- geographic_scope: global
- verification_status: unverified

**EV-022**
- claim: Ketidakpastian tahunan GSA ±4% (GHI)/±9% (DNI) di area validasi baik, bisa naik ±8%/±14% di lintang tinggi/minim stasiun darat; RMSE bulanan rata-rata GHI ~3,8%; validasi memakai 228 stasiun pengukuran darat publik. GSA **secara eksplisit menyatakan bukan untuk "bankable assessment"** — hanya pre-feasibility/screening.
- source_title: Global Solar Atlas 2.0 Validation Report
- publisher: World Bank
- source_url: https://globalsolaratlas.info/support/accuracy ; https://documents1.worldbank.org/curated/en/507341592893487792/pdf/Global-Solar-Atlas-2-0-Validation-Report.pdf
- access_date: 2026-09-11
- source_type: laporan validasi resmi (Tier B)
- geographic_scope: global
- verification_status: unverified
- notes: **sangat relevan untuk SURYA-SIAGA** — mengonfirmasi peran GSA sebagai alat screening awal, konsisten dengan positioning "pre-screening" produk (§4 `PROJECT_CONTEXT.md`), bukan dasar keputusan investasi final.

**EV-023**
- claim: Akses data GSA — peta interaktif gratis tanpa registrasi, unduhan GeoTIFF per negara/region, laporan PDF per-titik. **Tidak ditemukan bukti REST API publik terdokumentasi** untuk query terprogram.
- source_url: https://globalsolaratlas.info/download
- access_date: 2026-09-11
- source_type: situs teknis resmi (Tier B)
- geographic_scope: global
- verification_status: unverified
- notes: implikasi teknis — pengambilan data GSA untuk kandidat lokasi kemungkinan perlu dilakukan manual (unduh GeoTIFF lalu ekstrak nilai per titik via GIS), bukan otomatis via API.

**EV-024**
- claim: NASA POWER parameter ALLSKY_SFC_SW_DWN = "All Sky Surface Shortwave Downward Irradiance" (radiasi gelombang pendek ke permukaan horizontal, termasuk kondisi berawan).
- publisher: NASA Langley Research Center
- source_url: https://power.larc.nasa.gov/docs/methodology/ ; https://power.larc.nasa.gov/docs/faqs/solar/
- access_date: 2026-09-11
- source_type: dokumentasi teknis resmi (Tier B)
- geographic_scope: global
- verification_status: unverified
- notes: **satuan TIDAK terkonfirmasi secara pasti** (Wh/m² vs kWh/m²/day tidak konsisten di snippet) — NOT_VERIFIED, perlu dicek dari parameter dictionary resmi sebelum dipakai dalam perhitungan apa pun.

**EV-025**
- claim: Cakupan temporal NASA POWER — data meteorologi sejak 1981, data satelit surya sejak 1984, mendekati real-time (lag ~2–7 hari), update tiap malam (sumber: MERRA-2 + GEOS 5.12.4 near-real-time).
- source_url: https://power.larc.nasa.gov/docs/services/api/temporal/daily/ ; https://www.earthdata.nasa.gov/news/feature-articles/power-earth-science-data
- access_date: 2026-09-11
- source_type: dokumentasi teknis resmi (Tier B)
- geographic_scope: global
- verification_status: unverified

**EV-026**
- claim: Resolusi spasial grid NASA POWER — 0,5° x 0,625° (grid reanalysis MERRA-2), ≈ 55 km x 70 km di ekuator — **jauh lebih kasar dari luas Kabupaten Kubu Raya**.
- source_url: dokumentasi resmi power.larc.nasa.gov
- access_date: 2026-09-11
- source_type: dokumentasi teknis resmi (Tier B)
- geographic_scope: global
- verification_status: unverified
- notes: **implikasi teknis penting** — NASA POWER tidak cocok untuk membedakan titik-titik dalam satu kabupaten seukuran Kubu Raya (semua titik kemungkinan jatuh di grid cell sama/bertetangga dengan nilai nyaris identik). Lihat `SOURCE_CONFLICTS.md` untuk perbandingan resolusi vs GSA.

**EV-027**
- claim: API NASA POWER — RESTful, gratis, tanpa API key untuk pemakaian normal; format keluaran JSON/CSV/ASCII/NetCDF; maks 20 parameter per titik tunggal, request regional dibatasi 1 parameter.
- source_url: https://power.larc.nasa.gov/docs/services/api/ ; https://power.larc.nasa.gov/docs/tutorials/service-data-request/api/
- access_date: 2026-09-11
- source_type: dokumentasi API resmi (Tier B)
- geographic_scope: global
- verification_status: unverified

---

## Kategori: DISASTER

**EV-028**
- claim: InaRISK membedakan secara metodologis: Bahaya (hazard) → Kerentanan (vulnerability: populasi, fisik, ekonomi, lingkungan) → Kapasitas (capacity) → **Risiko** (kombinasi ketiganya). "Peta bahaya" ≠ "peta risiko".
- publisher: BNPB
- source_url: https://inarisk.bnpb.go.id/metodologi ; https://inarisk.bnpb.go.id/irbi
- access_date: 2026-09-11
- source_type: dokumentasi metodologi resmi (Tier A)
- geographic_scope: nasional
- verification_status: unverified
- notes: **pembeda krusial** untuk requirement §J task ini (long-term structural risk vs current hotspot) — lihat EV-037.

**EV-029**
- claim: Skala peta InaRISK saat ini 1:250.000 (nasional), sedang diperinci ke 1:50.000/1:25.000 untuk 136 kabupaten/kota — **belum dikonfirmasi apakah Kubu Raya termasuk 136 kab/kota tersebut**.
- source_url: https://inarisk.bnpb.go.id/portal/
- access_date: 2026-09-11
- source_type: dokumentasi resmi (Tier A)
- geographic_scope: nasional
- verification_status: unverified
- notes: NOT_FOUND untuk status inklusi Kubu Raya secara spesifik.

**EV-030**
- claim: Kelas indeks risiko/bahaya InaRISK memakai 3 kelas: Rendah (0–0,3), Sedang (0,3–0,6), Tinggi (0,6–1,0) — contoh Jawa Barat untuk karhutla: 11 kab/kota kelas tinggi, 4 sedang, 3 kab+7 kota rendah.
- source_url: https://inarisk.bnpb.go.id/pdf/Jawa%20Barat/Dokumen%20KRB%20Prov.%20Jawa%20Barat_final%20draft.pdf
- access_date: 2026-09-11
- source_type: dokumen resmi (Tier A)
- geographic_scope: **provinsi Jawa Barat — BUKAN Kalimantan Barat**, hanya contoh metodologi kelas
- verification_status: unverified

**EV-031**
- claim: Akses data InaRISK — WebGIS interaktif (inarisk.bnpb.go.id/webgis/), halaman unduh (inarisk.bnpb.go.id/portal/Unduh), dan **ArcGIS REST Services** (gis.bnpb.go.id/server/rest/services/inarisk) — jalur semi-API selain peta statis.
- access_date: 2026-09-11
- source_type: layanan data resmi (Tier A)
- geographic_scope: nasional
- verification_status: unverified

**EV-032** ⭐ (evidence paling spesifik-Kubu Raya dari sumber resmi BNPB)
- claim: Kubu Raya masuk kelas risiko kekeringan **"TINGGI"** — skor 34,21 (IRBI 2024) dan 36,00 (IRBI 2023).
- source_title: Buku IRBI 2023 / IRBI 2024
- publisher: BNPB (InaRISK)
- source_url: https://inarisk.bnpb.go.id/IRBI-2024/files/basic-html/page308.html ; https://inarisk.bnpb.go.id/IRBI-2023/files/basic-html/page306.html
- publication_date: 2023 &amp; 2024 | data_year: 2023, 2024
- access_date: 2026-09-11
- source_type: publikasi resmi BNPB (Tier A)
- geographic_scope: **Kabupaten Kubu Raya — SPESIFIK**
- value/unit: 34,21 (2024) / 36,00 (2023) — skala tidak dikonfirmasi (kemungkinan 0–100, berbeda dari skala 0–1 di EV-030)
- verification_status: unverified — **paling kredibel dalam ledger ini** (spesifik-halaman, konsisten lintas 2 tahun), tapi tetap wajib dikonfirmasi langsung sebelum dipakai sebagai fakta produksi
- notes: lihat `SOURCE_CONFLICTS.md` CF-003 untuk isu skala.

**EV-033** ⭐
- claim: Kubu Raya adalah salah satu dari 3 kabupaten prioritas (bersama Ketapang, Mempawah) dalam penyusunan peta risiko karhutla gambut Kalbar terbaru (mulai 2025, difinalisasi ~pertengahan 2026, oleh Kemenhut+BRIN+YKAN); 3 kabupaten ini menyumbang ~77% total luas karhutla Kalbar Jan–Jun 2026. Metodologi menggabungkan kondisi biofisik + aktivitas manusia pemicu kebakaran.
- publisher: Kompas (lestari.kompas.com), ANTARA News
- source_url: https://lestari.kompas.com/read/2026/07/31/082802186/pemerintah-dan-ykan-susun-peta-risiko-karhutla-gambut-di-kalbar ; https://www.antaranews.com/berita/5672457/kemenhut-kalbar-jadi-percontohan-peta-risiko-karhutla-gambut-nasional
- publication_date: Juli 2026 | data_year: 2025–2026
- access_date: 2026-09-11
- source_type: berita nasional (Tier C), melaporkan inisiatif pemerintah
- geographic_scope: **Kabupaten Kubu Raya — SPESIFIK**
- verification_status: unverified
- notes: peta ini masih tahap FINALISASI per laporan berita — status ketersediaan publik NOT_VERIFIED, kemungkinan besar belum bisa diakses.

**EV-034**
- claim: "Pemetaan Bahaya Bencana Kebakaran Hutan dan Lahan terhadap Kesatuan Hidrologis Gambut (KHG) di Kabupaten Kubu Raya" — kelas bahaya: Rendah 48.470,51 Ha (5,64%, 11 hotspot), Sedang 449.032,24 Ha (52,25%, 372 hotspot), Tinggi 361.878,68 Ha (42,11%, 2.106 hotspot).
- publisher: Wijaya, Akbar, Romiyanto — jurnal GEOGRAPHY, Universitas Tanjungpura/UMMAT
- source_url: https://journal.ummat.ac.id/index.php/geography/article/view/20988
- publication_date: tidak dikonfirmasi | data_year: tidak dikonfirmasi
- access_date: 2026-09-11
- source_type: paper akademik (Tier C, bukan publikasi resmi BNPB/KLHK)
- geographic_scope: Kabupaten Kubu Raya — SPESIFIK
- verification_status: **conflicting** (lihat SOURCE_CONFLICTS.md CF-002 — bertentangan dengan EV-035)
- notes: ini PETA BAHAYA (hazard), bukan peta risiko.

**EV-035**
- claim: "Risiko Bencana Kebakaran Hutan dan Lahan Gambut di Kabupaten Kubu Raya" — periode 2015–2019 tercatat 342 kejadian karhutla (rata-rata 60/tahun); hasil: risiko didominasi kelas **RENDAH** (44,60%), namun ada variabel pemicu risiko tinggi di area bergambut dan cakupan fasilitas pemadaman tidak merata.
- publisher: Muharrama &amp; Widjonarko (2023), Jurnal Teknik PWK UNDIP Vol.12 No.2, DOI 10.14710/tpwk.2023.32816
- source_url: https://ejournal3.undip.ac.id/index.php/pwk/article/view/32816
- publication_date: 2023 | data_year: 2015–2019
- access_date: 2026-09-11
- source_type: paper akademik (Tier C)
- geographic_scope: Kabupaten Kubu Raya — SPESIFIK
- verification_status: **conflicting** (lihat SOURCE_CONFLICTS.md CF-002 — bertentangan dengan EV-034)
- notes: ini PETA RISIKO (ancaman+kerentanan+kapasitas), metodologi mirip InaRISK tapi independen akademik, bukan data resmi BNPB.

**EV-036**
- claim: "Zonasi Daerah Rawan Kebakaran Hutan dan Lahan di Kabupaten Kubu Raya" — 349 hotspot tercatat s.d. Oktober 2013 (UPKHL Kalbar); parameter: kedalaman gambut, elevasi, tutupan lahan; kelas kerawanan 5 tingkat (aman/rendah/sedang/tinggi/sangat tinggi).
- publisher: Jawad, Nurdjali, Widiastuti (2015), Jurnal Hutan Lestari Vol.3 No.1, Universitas Tanjungpura
- source_url: https://jurnal.untan.ac.id/index.php/jmfkh/article/view/9244
- publication_date: 2015 | data_year: s.d. Oktober 2013
- access_date: 2026-09-11
- source_type: paper akademik (Tier C)
- geographic_scope: Kabupaten Kubu Raya — SPESIFIK
- verification_status: **historical** (data 2013, publikasi 2015 — jelas bukan kondisi 2026)

**EV-037**
- claim: SIPONGI (KLHK) dan NASA FIRMS menyediakan data hotspot/titik panas — anomali suhu terdeteksi satelit (MODIS/VIIRS) near-real-time (FIRMS: ~3 jam), BUKAN lokasi api pasti (1 piksel MODIS ~1 km bisa mengandung >1 sumber panas, perlu verifikasi lapangan). Ini berbeda secara fundamental dari peta risiko/bahaya struktural jangka panjang InaRISK/studi akademik (EV-028, EV-034-036) yang berbasis faktor tetap/semi-tetap dan diperbarui periodik.
- publisher: NASA (FIRMS); KLHK (SIPONGI, tidak dibuka langsung)
- source_url: https://firms.modaps.eosdis.nasa.gov/map/ ; https://www.earthdata.nasa.gov/data/tools/firms
- access_date: 2026-09-11
- source_type: layanan data satelit resmi (Tier B untuk FIRMS)
- geographic_scope: global (FIRMS) / nasional (SIPONGI)
- verification_status: unverified
- notes: **KEDUA JENIS DATA INI TIDAK BOLEH DISAMAKAN** (aturan eksplisit tugas §J) — hotspot = "di mana api terdeteksi hari ini", risiko struktural = "area mana yang secara jangka panjang rentan". Untuk DSS prioritisasi PLTS (keputusan investasi jangka panjang), yang relevan adalah risiko struktural, bukan hotspot harian.

---

## Kategori: EXISTING_PLTS

**EV-038** ⭐
- claim: Kubu Raya menerima hibah PLTS Komunal sejak 2018 untuk **tiga desa** di Kecamatan Batu Ampar: **Sumber Agung, Muara Tiga, dan Sungai Kerawang**. Pengelola: BUMDes masing-masing desa. Nilai hibah agregat ~Rp26 miliar untuk 3 desa.
- source_title: Tiga Desa Terjauh di Kubu Raya Terima Hibah PLTS
- publisher: BPK Perwakilan Provinsi Kalimantan Barat
- source_url: https://kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/
- publication_date: tidak dikonfirmasi (perkiraan ~2021, TIDAK bisa dipastikan) | data_year: 2018 (mulai operasi)
- access_date: 2026-09-11
- source_type: berita/laporan lembaga negara (Tier A)
- geographic_scope: Kecamatan Batu Ampar, Kabupaten Kubu Raya — 3 desa spesifik
- verification_status: unverified
- notes: **PENTING** — ini mengonfirmasi bahwa PROJECT_CONTEXT.md §11 (yang hanya menyebut Sumber Agung) TIDAK lengkap: ada 2 desa lain (Muara Tiga, Sungai Kerawang) dalam program yang SAMA. Perlu dilaporkan sebagai potensi update PROJECT_CONTEXT (lihat RESEARCH_FINDINGS.md — Potential Product Changes).

**EV-039**
- claim: Kapasitas PLTS komunal ini disebut "100" lalu bertambah — **satu sumber menyebut menjadi 250, sumber lain menyebut menjadi 150** (satuan tidak eksplisit di snippet, kemungkinan kWp) — melayani 312 rumah tangga (tidak jelas agregat 3 desa atau salah satu desa saja).
- publisher: sintesis WebSearch dari kalbar.bpk.go.id + ebtke.esdm.go.id + kalbar.antaranews.com
- source_url: (kombinasi, termasuk kalbar.antaranews.com/berita/542859 dan post ebtke 2023/06/22/3515)
- access_date: 2026-09-11
- source_type: campuran Tier A/C
- geographic_scope: Kecamatan Batu Ampar (agregat 3 desa atau 1 desa — tidak jelas)
- value/unit: 100 → 150 atau 100 → 250 (satuan tidak pasti); 312 rumah tangga
- verification_status: **conflicting** (lihat SOURCE_CONFLICTS.md CF-001) — **TIDAK BOLEH dipakai sebagai angka pasti tanpa verifikasi ulang ke dokumen asli**
- notes: ini juga berarti angka historis di `PROJECT_CONTEXT.md` §11 (100 kWp, 329/402 KK, gap 73 KK) TIDAK cocok dengan angka yang ditemukan riset ini (312 KK, kapasitas 150/250) — lihat RESEARCH_FINDINGS.md.

**EV-040**
- claim: Sejak dihuni tahun 1989, Desa Sumber Agung tidak mendapat pasokan listrik PLN (sebelum program PLTS 2018).
- publisher: ANTARA Kalbar
- source_url: https://kalbar.antaranews.com/berita/336593/
- publication_date: tidak dipastikan (tampak lebih lama dari artikel PLTS 2018) | data_year: sebelum 2018
- access_date: 2026-09-11
- source_type: media nasional/lokal (Tier C)
- geographic_scope: Desa Sumber Agung
- verification_status: **historical**

**EV-041**
- claim: Desa Sumber Agung terpilih sebagai salah satu dari 125 "Desa BRILian" se-Indonesia (program BRI, program ekonomi desa — BUKAN program elektrifikasi/PLTS).
- publisher: kuburaya.go.id, Liputan6
- publication_date: 2021 (perkiraan) | data_year: 2021
- access_date: 2026-09-11
- source_type: berita pemerintah daerah/media (Tier A/C)
- geographic_scope: Desa Sumber Agung
- verification_status: unverified
- notes: **JANGAN digabung sebagai "update kondisi PLTS"** — ini program ekonomi berbeda, tidak terkait status kelistrikan.

**EV-042**
- claim: Batu Ampar (kecamatan tempat Sumber Agung berada) masih jadi prioritas program listrik lanjutan per artikel "Sujiwo Targetkan Batu Ampar Jadi Desa Wisata, Listrik Jadi Langkah Awal".
- publisher: kuburaya.go.id
- publication_date: perkiraan 2025 (tidak dipastikan) | data_year: 2025 (perkiraan)
- access_date: 2026-09-11
- source_type: berita pemerintah daerah (Tier A)
- geographic_scope: Kecamatan Batu Ampar
- verification_status: unverified
- notes: mengindikasikan kondisi kelistrikan Batu Ampar MASIH menjadi isu terbuka tahun 2025 — relevan sebagai konteks bahwa PLTS 2018 kemungkinan belum sepenuhnya menyelesaikan masalah kelistrikan area ini, tapi ini INFERENSI, bukan pernyataan langsung sumber tentang kondisi PLTS.

**EV-043**
- claim: "Sungai Kerawang" adalah nama desa resmi yang benar di Kecamatan Batu Ampar (bukan salah eja dari "Sungai Kakap") — dikonfirmasi silang oleh 3 sumber independen (Wikipedia ID, kode pos indonesiapostcode.com, data cuaca weather.com yang menampilkan "Sungai Kerawang, Kubu Raya, West Kalimantan").
- publisher: berbagai (lihat SOURCES.md C-08)
- access_date: 2026-09-11
- source_type: ensiklopedia + data sekunder (Tier C, hanya untuk konfirmasi nama, bukan data teknis)
- geographic_scope: Desa Sungai Kerawang, Kecamatan Batu Ampar
- verification_status: unverified (tapi cukup meyakinkan karena konfirmasi silang independen)

**EV-044**
- claim: Dataset "Data Kependudukan Desa Sungai Kerawang Kecamatan Batu Ampar Kabupaten Kubu Raya - 31 Desember 2020" tersedia di Satu Data Provinsi Kalimantan Barat — isinya (jumlah penduduk/KK) belum dibaca.
- publisher: data.kalbarprov.go.id
- publication_date: data per 31 Desember 2020 | data_year: 2020
- access_date: 2026-09-11
- source_type: portal data resmi (Tier A)
- geographic_scope: Desa Sungai Kerawang — SPESIFIK
- verification_status: unverified (isi dataset NOT_FOUND/belum dibaca)

**EV-045**
- claim: Instalasi PLTS skala rumah tangga (panel 50 Wp, lampu LED DC) di Desa Sepok Keladi, Kecamatan **Sungai Kakap** (bukan Batu Ampar) — pengabdian masyarakat akademik, bukan program pemerintah.
- publisher: Wahyuni, Syaifurrahman, Islami — Jurnal J-ABDIPAMAS (Universitas Tanjungpura), 2019
- data_year: 2019
- access_date: 2026-09-11
- source_type: paper akademik/pengabdian (Tier C)
- geographic_scope: Desa Sepok Keladi, Kecamatan Sungai Kakap
- verification_status: **historical**
- notes: di luar 3 lokasi target riset (Batu Ampar), skala jauh lebih kecil, karakter berbeda (individual rumah tangga vs komunal terpusat).

**EV-046**
- claim: Artikel Mongabay 2016 "PLTS Kubu, Proyek Ambisius yang Kini Tidak Terurus" membahas proyek PLTS bermasalah — lokasi ambigu (bisa Kecamatan Kubu, berbeda dari Batu Ampar, atau tempat lain).
- publisher: Mongabay Indonesia
- source_url: https://mongabay.co.id/2016/05/01/plts-kubu-proyek-ambisius-yang-kini-tidak-terurus/
- publication_date: 1 Mei 2016 | data_year: 2016
- access_date: 2026-09-11
- source_type: media nasional (Tier C)
- geographic_scope: tidak pasti (kemungkinan Kecamatan Kubu, Kubu Raya)
- verification_status: **historical, NOT_FOUND untuk konfirmasi lokasi** — halaman gagal dibuka (EGRESS_BLOCKED), tidak bisa dipastikan relevansinya dengan 3 lokasi target. Perlu ditelusuri ulang sebagai preseden historis "PLTS terbengkalai" di Kubu Raya.

---

## Kategori: FACILITY

**EV-047**
- claim: Kubu Raya memiliki ~20 Puskesmas, 10 di antaranya berstatus rawat inap.
- publisher: kuburaya.go.id ("Kabupaten Kubu Raya Hadirkan Lima Puskesmas Rawat Inap Baru")
- access_date: 2026-09-11
- source_type: berita pemerintah daerah (Tier A)
- geographic_scope: Kabupaten Kubu Raya
- value/unit: ~20 puskesmas, 10 rawat inap
- verification_status: unverified

**EV-048**
- claim: Portal resmi puskesmas.kuburayakab.go.id memiliki halaman per-puskesmas termasuk tab "Sarana dan Prasarana". Contoh Puskesmas Lingga: alamat (Jl. Trans Kalimantan KM 31, Kec. Sungai Ambawang), kecamatan, kode puskesmas resmi (P6112080103), status rawat inap. **Koordinat: TIDAK terkonfirmasi ada.** Beberapa halaman "sarana-prasarana" disebut "masih dalam proses pengumpulan data".
- publisher: Pemkab Kubu Raya
- source_url: puskesmas.kuburayakab.go.id
- access_date: 2026-09-11
- source_type: portal pemerintah daerah (Tier A)
- geographic_scope: per-fasilitas (nama, alamat, kecamatan)
- verification_status: unverified
- notes: kelengkapan data kemungkinan tidak seragam antar puskesmas.

**EV-049**
- claim: Platform kalbarsehat.kalbarprov.go.id/fasyankes/ mendaftar fasilitas kesehatan (fasyankes) termasuk Puskesmas Sungai Rengas (Kubu Raya) dengan halaman individual — field yang tersedia belum terkonfirmasi.
- publisher: Dinas Kesehatan Prov. Kalbar
- access_date: 2026-09-11
- source_type: portal pemerintah provinsi (Tier A)
- geographic_scope: per-fasilitas
- verification_status: unverified

**EV-050**
- claim: BPS Kubu Raya memiliki tabel resmi "Jumlah Rumah Sakit Umum, Rumah Sakit Khusus, Puskesmas, Klinik Pratama, dan Posyandu **Menurut Kecamatan**" — tersedia untuk beberapa tahun (2017, 2021, 2022, 2023 teridentifikasi).
- publisher: BPS Kabupaten Kubu Raya
- source_url: kuburayakab.bps.go.id/id/statistics-table/3/...
- access_date: 2026-09-11
- source_type: statistik resmi (Tier A)
- geographic_scope: **KECAMATAN** (bukan per-fasilitas)
- verification_status: unverified
- notes: **HANYA hitungan per kecamatan, BUKAN nama/alamat/koordinat fasilitas individual, dan BUKAN jumlah penerima manfaat spesifik satu puskesmas** — level geografis berbeda dari yang dibutuhkan model data §8 `PROJECT_CONTEXT.md` (per-facility).

**EV-051**
- claim: Platform resmi referensi.data.kemendikdasmen.go.id menyediakan data satuan pendidikan per provinsi/kabupaten/kecamatan untuk Kubu Raya (kode wilayah 131300) hingga level kecamatan (mis. kode 131312 = Kec. Kubu). Ada fitur pencarian per-NPSN individual.
- publisher: Kemendikdasmen RI
- source_url: referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/131300/2/jf/5/all
- access_date: 2026-09-11
- source_type: portal data resmi (Tier A)
- geographic_scope: kabupaten &amp; kecamatan (granularitas kecamatan terkonfirmasi)
- verification_status: unverified
- notes: field detail (nama, jenjang, alamat, jumlah siswa) diklaim tersedia tapi **BUKAN kutipan langsung halaman** — tentatif. **Koordinat: TIDAK terkonfirmasi tersedia** di portal publik ini.

**EV-052**
- claim: opendata.kuburaya.go.id memiliki dataset bertag "smp" dari Dinas Pendidikan dan Kebudayaan — eksis, isi belum dibaca.
- publisher: Pemkab Kubu Raya
- access_date: 2026-09-11
- source_type: portal open data (Tier A)
- geographic_scope: tidak pasti (isi belum dibaca)
- verification_status: unverified

---

## Kategori: SOCIAL

**EV-053**
- claim: Publikasi "Kabupaten Kubu Raya Dalam Angka" tersedia online untuk edisi 2021, 2022, 2023, 2024, dan **2025 (terbit 28 Februari 2025)**; indikasi arsip sejak 2009 ada.
- publisher: BPS Kabupaten Kubu Raya
- source_url: kuburayakab.bps.go.id/en/publication/2025/02/28/b6bb9b4a2ce61ee62e955ec3/kabupaten-kubu-raya-dalam-angka-2025.html
- publication_date: 28 Februari 2025 | data_year: ~2024 (asumsi standar penamaan BPS, belum dikonfirmasi isi)
- access_date: 2026-09-11
- source_type: publikasi statistik resmi (Tier A)
- geographic_scope: kabupaten
- verification_status: unverified

**EV-054**
- claim: BPS Kubu Raya juga menerbitkan seri "Kecamatan [Nama] Dalam Angka" per kecamatan — 2 contoh terkonfirmasi: "Kecamatan Sungai Raya Dalam Angka 2025" dan "Kecamatan Kubu Dalam Angka 2025" (keduanya terbit 26 September 2025). **Tidak ditemukan publikasi setingkat desa/kelurahan** untuk data fasilitas/rumah tangga.
- publisher: BPS Kabupaten Kubu Raya
- publication_date: 26 September 2025 | data_year: 2024/2025 (asumsi)
- access_date: 2026-09-11
- source_type: publikasi statistik resmi (Tier A)
- geographic_scope: **KECAMATAN** (level paling granular yang terkonfirmasi — bukan desa)
- verification_status: unverified

**EV-055**
- claim: "Buku Data Statistik Sektoral Kabupaten Kubu Raya Tahun 2024" (PDF) diterbitkan Diskominfo Kubu Raya (bukan BPS) — berpotensi memuat data sektoral pendidikan/kesehatan tambahan, isi belum dibaca.
- publisher: Diskominfo Kubu Raya
- source_url: kominfo.kuburaya.go.id
- data_year: 2024
- access_date: 2026-09-11
- source_type: dokumen resmi pemerintah daerah (Tier A)
- geographic_scope: tidak pasti (isi belum dibaca)
- verification_status: unverified

---

## Kategori: PRODUCT_GAP

> Ringkasan singkat — detail penuh (profil tool &amp; matriks fitur lengkap) ada di `COMPETITOR_TOOL_MATRIX.md`. Entri di bawah hanya mencatat klaim inti per tool untuk keperluan ledger.

**EV-056**
- claim: Global Solar Atlas — YES untuk solar potential data &amp; scoring/ranking (level negara); NO untuk disaster risk, public facility context, facility criticality; PARTIAL untuk beneficiary/social impact (LCOE/indikator sosio-ekonomi tingkat negara); NO untuk explainable multi-criteria prioritization (bukan skor komposit lintas-kriteria heterogen).
- source_url: documents1.worldbank.org (Technical/Validation Report), esmap.org
- access_date: 2026-09-11
- source_type: Tier B
- geographic_scope: global
- verification_status: unverified

**EV-057**
- claim: InaRISK/IRBI — YES untuk disaster risk data, beneficiary/social impact (kerentanan sosial), scoring/ranking, dan explainable multi-criteria prioritization (**untuk risiko bencana wilayah, BUKAN untuk siting energi**); PARTIAL untuk public facility context &amp; facility criticality (hanya sebagai variabel exposure agregat wilayah, bukan penilaian per-fasilitas individual); NO untuk solar potential data, existing PLTS context, new/expansion deployment assessment (tidak relevan dengan domain platform ini).
- source_url: inarisk.bnpb.go.id/metodologi, Buku IRBI 2022
- access_date: 2026-09-11
- source_type: Tier A
- geographic_scope: nasional
- verification_status: unverified
- notes: **temuan paling penting untuk klaim novelty** — InaRISK SUDAH punya skor komposit explainable dengan bobot terdokumentasi publik, tapi untuk domain risiko bencana, bukan domain PLTS-siting. SURYA-SIAGA tidak bisa mengklaim "explainable scoring" sebagai hal baru secara absolut — hanya kombinasinya dengan domain PLTS yang berpotensi baru.

**EV-058**
- claim: ESDM One Map (layer EBTKE) — YES untuk solar potential data (peta potensi surya &amp; PLTS Terapung dengan angka MW); PARTIAL untuk existing PLTS context (peta PLTS Terapung menunjukkan lokasi potensi di badan air eksisting, bukan katalog komprehensif PLTS beroperasi) dan new deployment assessment; UNKNOWN untuk sebagian besar fitur lain (disaster risk, public facility, beneficiary, scoring) karena dokumentasi tidak terbaca penuh.
- source_url: onemap.esdm.go.id/map/ebtke.html
- access_date: 2026-09-11
- source_type: Tier A
- geographic_scope: nasional
- verification_status: unverified

**EV-059**
- claim: NREL RE Data Explorer/Technical Potential Tool — YES untuk solar potential data (irradiance resolusi tinggi termasuk Asia Tenggara/Indonesia), new deployment assessment (fungsi inti: technical potential + model reV), scoring/ranking (supply-curve LCOE+transmisi); PARTIAL untuk explainable multi-criteria (filter/exclusion transparan tapi belum terkonfirmasi ada breakdown kontribusi per-kriteria per lokasi) dan beneficiary/social impact (ekosistem terkait seperti Global Electrification Platform tampak terpisah, belum terintegrasi langsung); catatan: API resmi tool ini ditandai "deprecated" oleh NREL Developer Network meski situs re-explorer.org masih mempromosikannya — isu currency/status tool.
- source_url: re-explorer.org/about, docs.nrel.gov
- access_date: 2026-09-11
- source_type: Tier B
- geographic_scope: global, termasuk Asia Tenggara/Indonesia
- verification_status: unverified

**EV-060**
- claim: Tidak satu pun dari 4 tool yang diperiksa (GSA, InaRISK, ESDM One Map, NREL RE Data Explorer) secara eksplisit menggabungkan solar potential + disaster risk + facility criticality + beneficiary/social impact + existing-PLTS context dalam SATU skor prioritas tunggal — masing-masing cenderung spesialis 1-2 domain. Tidak ditemukan bukti eksplisit "data confidence indicator" yang secara sadar dipisahkan dari skor keputusan di keempat tool (GSA PARTIAL karena ada uncertainty di level laporan teknis, bukan indikator interaktif terpisah). Tidak ditemukan bukti fitur "expansion assessment" eksplisit di tool manapun.
- access_date: 2026-09-11
- source_type: sintesis dari riset kompetitif (Tier A+B gabungan)
- geographic_scope: global + nasional
- verification_status: unverified
- notes: **dasar untuk VERIFIED DIFFERENTIATOR / INTEGRATION VALUE** di `COMPETITOR_TOOL_MATRIX.md` — tapi banyak status UNKNOWN (bukan NO pasti) karena dokumentasi tidak terbaca penuh, sehingga klaim novelty ini masih harus dianggap tentatif, bukan final.

---

## LAPISAN VERIFIKASI PROMPT 2.5

Bagian di bawah ini ditambahkan pada verification pass Prompt 2.5. Isi entri EV-001 s.d. EV-060 di atas tidak diubah (tidak ada informasi baru yang bisa memperbaruinya, karena tidak satu pun sumber dapat dibuka) — yang ditambahkan adalah **dimensi klasifikasi baru** yang dapat dikerjakan tanpa akses jaringan.

---

### A. Per-Field Verification — Existing PLTS Kubu Raya (§F)

Sesuai instruksi §F Prompt 2.5: verifikasi tidak lagi diberikan pada level sumber atau level situs, melainkan **per field**, supaya satu field bermasalah tidak membuat seluruh situs tidak terpakai.

> **Diperbarui Prompt 2.6:** baris yang terdampak EV-F (external_manual_verification) ditandai ✅. Field yang **tidak** tercakup EV-F sengaja dibiarkan pada status lamanya — EV-F hanya memverifikasi keberadaan historis dan penyerahan aset 2021.

#### Situs 1 — PLTS Desa Sumber Agung, Kec. Batu Ampar

| Field | verification_status | source_authority | proposal_usage_status | Catatan |
|---|---|---|---|---|
| ✅ `location_existence` (desa ada, di Batu Ampar) | **`verified_primary`** (`external_manual_verification`, EV-F) | A (BPK) | `SAFE_TO_USE` | Dinaikkan Prompt 2.6 |
| ✅ `existing_plts` (ada PLTS, hibah aset) | **`verified_primary`** (`external_manual_verification`, EV-F) | A (BPK Kalbar) | `SAFE_WITH_HISTORICAL_LABEL` | Penyerahan aset **2021**; label tahun wajib |
| ✅ `asset_handover_year` = 2021 | **`verified_primary`** (EV-F) | A | `SAFE_WITH_HISTORICAL_LABEL` | Baru — dipisahkan dari `commissioning_year` |
| `existing_plts_capacity_kwp` | `conflicting` → **NULL** | A + C | **`DO_NOT_USE`** | CF-001 unresolved; satuan pun tidak diketahui |
| ⚠️ `commissioning_year` (2018?) | `unverified` — **CF-006** | A/C | **`NEEDS_MANUAL_VERIFICATION`** | EV-F memverifikasi serah terima **2021**, bukan tahun operasi. "2018" tetap `snippet_only` |
| `historical_served_households` (312? 329?) | `conflicting` + `historical` | A + C | **`DO_NOT_USE`** | Angka PROJECT_CONTEXT (329) ≠ angka riset (312); scope tak jelas |
| `historical_total_households` (402?) | `unverified` + `historical` | C | `NEEDS_MANUAL_VERIFICATION` | Hanya muncul di PROJECT_CONTEXT, tidak muncul di riset Prompt 2 |
| `reported_energy_constraint` (isu baterai/kapasitas) | `unverified` | C | `NEEDS_MANUAL_VERIFICATION` | Riset Prompt 2 **tidak menemukan** laporan spesifik kondisi teknis |
| ✅ pengelola (BUMDes) | **`verified_primary`** (EV-F) | A | `SAFE_WITH_HISTORICAL_LABEL` | Sumber menyebut aset "direncanakan/akan dikelola" BUMDes — **rencana per 2021, bukan status operasional 2026** |
| `current_status` (kondisi 2026) | `unverified` | — | **`NEEDS_MANUAL_VERIFICATION`** | **Tidak ada sumber apa pun** yang menjelaskan kondisi terkini |
| `current_grid_status` (PLN masuk?) | `unverified` | A/C | **`NEEDS_MANUAL_VERIFICATION`** | EV-042 mengindikasikan kelistrikan Batu Ampar masih isu terbuka 2025, tapi ini inferensi |
| `latitude` / `longitude` | **tidak tersedia** | — | **`DO_NOT_USE`** | Tidak ditemukan koordinat di sumber mana pun |

#### Situs 2 — PLTS Desa Muara Tiga, Kec. Batu Ampar

| Field | verification_status | source_authority | proposal_usage_status | Catatan |
|---|---|---|---|---|
| ✅ `location_existence` | **`verified_primary`** (`external_manual_verification`, EV-F) | A | `SAFE_TO_USE` | Disebut eksplisit dalam sumber BPK |
| ✅ `existing_plts` | **`verified_primary`** (EV-F) | A (BPK Kalbar) | `SAFE_WITH_HISTORICAL_LABEL` | Bagian penyerahan hibah aset **2021** yang sama |
| `existing_plts_capacity_kwp` | **tidak tersedia** (hanya angka agregat) | — | **`DO_NOT_USE`** | Tidak ada rincian per-desa (NF-03) |
| `commissioning_year` | `unverified` | A | `SAFE_WITH_HISTORICAL_LABEL` | Diasumsikan sama (2018) — **asumsi, belum dikonfirmasi per desa** |
| `served_households` | **tidak tersedia** | — | **`DO_NOT_USE`** | Hanya agregat 3 desa |
| `current_status` | `unverified` | — | **`NEEDS_MANUAL_VERIFICATION`** | Tidak ada sumber |
| `latitude` / `longitude` | **tidak tersedia** | — | **`DO_NOT_USE`** | — |

#### Situs 3 — PLTS Desa Sungai Kerawang, Kec. Batu Ampar

| Field | verification_status | source_authority | proposal_usage_status | Catatan |
|---|---|---|---|---|
| ✅ `location_existence` | **`verified_primary`** (`external_manual_verification`, EV-F) | A | `SAFE_TO_USE` | **Nama desa terkonfirmasi benar** dan disebut eksplisit dalam sumber BPK — bukan salah eja "Sungai Kakap" |
| ✅ `existing_plts` | **`verified_primary`** (EV-F) | A (BPK Kalbar) | `SAFE_WITH_HISTORICAL_LABEL` | Bagian penyerahan hibah aset **2021** yang sama |
| `existing_plts_capacity_kwp` | **tidak tersedia** | — | **`DO_NOT_USE`** | Tidak ada rincian per-desa |
| `commissioning_year` | `unverified` | A | `SAFE_WITH_HISTORICAL_LABEL` | Asumsi sama (2018), belum dikonfirmasi |
| `served_households` | **tidak tersedia** | — | **`DO_NOT_USE`** | — |
| `population/KK desa` (dataset 2020) | `unverified` + `historical` | A (Satu Data Kalbar) | `NEEDS_MANUAL_VERIFICATION` | Dataset EV-044 ada tapi isinya belum dibaca |
| `current_status` | `unverified` | — | **`NEEDS_MANUAL_VERIFICATION`** | — |
| `latitude` / `longitude` | **tidak tersedia** | — | **`DO_NOT_USE`** | — |

**Kesimpulan per-field:** untuk ketiga situs, field yang **paling mungkin selamat** ke tahap acquisition adalah `location_existence`, `existing_plts` (boolean), `commissioning_year`, dan pengelola — semuanya sebagai konteks berlabel. Seluruh field **numerik** (kapasitas, KK terlayani, koordinat) saat ini **DO_NOT_USE**. Ini konsisten dengan §6 `PROJECT_CONTEXT.md`: "NULL lebih baik daripada angka buatan."

---

### B. Audit publication_date vs data_year (§G)

Prompt 2.5 §G melarang menyamakan tahun terbit dengan tahun data. Audit ulang entri yang berisiko:

| EV | publication_date | data_year | Status audit |
|---|---|---|---|
| EV-053 (Kubu Raya Dalam Angka 2025) | 2025-02-28 | **2024** | ✅ Dipisahkan dengan benar. Ringkasan pencarian Prompt 2.5 menyebut edisi ini memuat statistik "during 2024" — konsisten, tapi tetap `unverified`. |
| EV-054 (Kecamatan Dalam Angka 2025) | 2025-09-26 | ~2024 (asumsi) | ⚠️ data_year masih **asumsi**, belum dikonfirmasi. Ditandai `NEEDS_MANUAL_VERIFICATION`. |
| EV-032 (IRBI 2023 &amp; 2024) | 2023, 2024 | **tidak diketahui** | ⚠️ **Risiko tinggi.** IRBI edisi 2024 kemungkinan besar memuat data tahun sebelumnya. Tahun data TIDAK boleh diasumsikan sama dengan tahun edisi. |
| EV-038/039 (PLTS Batu Ampar) | tidak diketahui (perkiraan 2021) | **2018** (mulai operasi) | ⚠️ Publikasi jauh setelah peristiwa — klasik kasus di mana publication_date menyesatkan jika dipakai sebagai data_year. |
| EV-018 (data ESDM Kalbar) | tidak diketahui | 2019 (PLTS), 2020 (elektrifikasi) | ✅ data_year eksplisit dan berbeda antar-dataset dalam satu portal. |
| EV-035 (paper karhutla) | 2023 | **2015–2019** | ✅ Selisih 4–8 tahun — bukti kuat mengapa aturan §G penting. |
| EV-036 (paper zonasi) | 2015 | **s.d. Okt 2013** | ✅ Dipisahkan dengan benar, sudah berlabel `historical`. |

**Temuan:** tidak ada pelanggaran §G yang ditemukan dalam ledger Prompt 2 (pemisahan sudah dilakukan), tapi **tiga entri (EV-054, EV-032, EV-038/039) memiliki data_year yang masih berupa asumsi atau tidak diketahui** dan karenanya tidak boleh dipakai untuk klaim keterkinian apa pun.

---

### C. Kabupaten Kubu Raya Dalam Angka 2026 (§A.2)

Instruksi Level-1 meminta memprioritaskan edisi **2026** sebagai sumber statistik utama. Hasil pencarian Prompt 2.5:

- **Edisi 2026 TIDAK dapat dikonfirmasi keberadaannya.** Hasil pencarian hanya menampilkan edisi hingga **2025** (terbit 2025-02-28, data tahun 2024), plus edisi-edisi lama (2023, dst.).
- Terdapat satu hasil pencarian berupa unggahan Instagram bertajuk "[RILIS PUBLIKASI: KABUPATEN KUBU RAYA DALAM ...]" yang mungkin mengumumkan edisi lebih baru — **namun media sosial dilarang sebagai sumber fakta teknis** oleh §9 `PROJECT_CONTEXT.md`, sehingga ini TIDAK dihitung sebagai bukti.
- **Tindakan:** halaman daftar publikasi BPS Kubu Raya (`kuburayakab.bps.go.id/publication`) harus dibuka manual untuk memastikan apakah edisi 2026 sudah terbit. Sampai saat itu, **edisi 2025 tetap menjadi kandidat sumber statistik terbaru yang diketahui**, dengan status `unverified` dan `NEEDS_MANUAL_VERIFICATION`.
- Sesuai instruksi: bila edisi 2026 ternyata ada, edisi 2025 turun menjadi historical/reference dan tidak lagi otomatis menjadi primary source.

---

### D. Tabel Klasifikasi Lengkap — Authority, Verification, Claim Safety (§H, §K)

| EV | Kategori | source_authority | verification_status | proposal_usage_status |
|---|---|---|---|---|
| EV-001 | policy | A | unverified | `SAFE_AS_CONTEXT_ONLY` — hanya keberadaan program, **tanpa angka** |
| EV-002 | policy | A/C | unverified | **`DO_NOT_USE`** — angka USD 28,9 miliar belum diverifikasi (§A.1 melarang menambah angka investasi) |
| EV-003 | policy | C | unverified | **`DO_NOT_USE`** — angka kapasitas tahap tertentu, dilarang §A.1 |
| EV-004 | policy | A (via ringkasan sekunder) | unverified | `NEEDS_MANUAL_VERIFICATION` — dokumen primer belum dibuka |
| EV-005 | policy | C | unverified | `SAFE_AS_CONTEXT_ONLY` — status regulasi belum final |
| EV-006 | policy | C | unverified | `SAFE_AS_CONTEXT_ONLY` |
| EV-007 | policy | B (think-tank) | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-008 | methodology | B | unverified | `NEEDS_MANUAL_VERIFICATION` — **paling penting** (studi kasus Kalbar) |
| EV-009 – EV-013 | methodology | B | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-014 | methodology | B (sekunder) | **`verified_secondary`** | **`SAFE_TO_USE`** — satu-satunya, dengan label "ringkasan pihak ketiga atas DMBOK2" |
| EV-015 | methodology | B | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-016 | electricity | A | unverified | `SAFE_AS_CONTEXT_ONLY` — bukan problem statement utama (§3 PROJECT_CONTEXT) |
| EV-017, EV-018 | electricity | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-019 | electricity | A | unverified | **`DO_NOT_USE`** — provinsi lain (Kaltim), bukan Kalbar |
| EV-020 – EV-023 | solar | B | unverified | `NEEDS_MANUAL_VERIFICATION` — spesifikasi teknis wajib dikonfirmasi sebelum akuisisi |
| EV-024 – EV-027 | solar | B | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-028 – EV-031 | disaster | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-032 | disaster | A | unverified | `SAFE_AS_CONTEXT_ONLY` (konteks kabupaten) / **`DO_NOT_USE`** sebagai input skoring situs (CF-003) |
| EV-033 | disaster | C (melaporkan inisiatif pemerintah) | unverified | `SAFE_AS_CONTEXT_ONLY` |
| EV-034, EV-035 | disaster | C (akademik) | `DIFFERENT_METRIC` (bukan conflicting) | `NEEDS_MANUAL_VERIFICATION` — wajib berlabel metrik (bahaya vs risiko) |
| EV-036 | disaster | C | `historical` | `SAFE_WITH_HISTORICAL_LABEL` (data s.d. 2013) |
| EV-037 | disaster | B | unverified | `SAFE_AS_CONTEXT_ONLY` — hotspot dilarang jadi input skoring |
| EV-038 | existing_plts | A | unverified | `SAFE_AS_CONTEXT_ONLY` — keberadaan saja |
| EV-039 | existing_plts | A/C | `conflicting` | **`DO_NOT_USE`** — seluruh angka kapasitas &amp; KK |
| EV-040 | existing_plts | C | `historical` | `SAFE_WITH_HISTORICAL_LABEL` |
| EV-041 | existing_plts | A/C | unverified | **`DO_NOT_USE`** sebagai indikator status PLTS (program ekonomi, bukan kelistrikan) |
| EV-042 | existing_plts | A | unverified | `SAFE_AS_CONTEXT_ONLY` — jangan disajikan sebagai bukti PLTS gagal (itu inferensi) |
| EV-043 | existing_plts | C | unverified | `SAFE_AS_CONTEXT_ONLY` — konfirmasi nama desa |
| EV-044 | existing_plts/social | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-045 | existing_plts | C | `historical` | `SAFE_WITH_HISTORICAL_LABEL` — di luar 3 lokasi target |
| EV-046 | existing_plts | C | unverified | **`DO_NOT_USE`** — lokasi ambigu (CF-005) |
| EV-047 | facility | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-048 – EV-052 | facility | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-053 | social | A | unverified | `NEEDS_MANUAL_VERIFICATION` — cek dulu apakah ada edisi 2026 |
| EV-054 | social | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-055 | social | A | unverified | `NEEDS_MANUAL_VERIFICATION` |
| EV-056 – EV-060 | product_gap | A/B | unverified | `SAFE_AS_CONTEXT_ONLY` untuk fitur definisional; **`DO_NOT_USE`** untuk klaim ketiadaan fitur (lihat audit `COMPETITOR_TOOL_MATRIX.md`) |

---

### E. Ringkasan Verifikasi (diperbarui Prompt 2.6)

**Berdasarkan verification_method:**

| verification_method | Jumlah | Keterangan |
|---|---|---|
| `agent_verified` | **1** | EV-014 saja (GitHub) — satu-satunya domain yang lolos egress |
| `external_manual_verification` | **8** | EV-A s.d. EV-H — diverifikasi di luar environment agent ini |
| `snippet_only` | ~52 | Bagian II, dikurangi entri yang digantikan EV-A–EV-H |

**Berdasarkan verification_status:**

| verification_status | Prompt 2.5 | **Prompt 2.6** | Perubahan |
|---|---|---|---|
| `verified_primary` | 0 | **6** | EV-A, EV-B, EV-C, EV-F, EV-G, EV-H ⬆ |
| `verified_secondary` | 1 | **3** | + EV-D, EV-E ⬆ |
| `historical` | 5 | 5 | — |
| `conflicting` | 2 | 2 | CF-001 (EV-039) tetap; CF-006 baru dicatat sebagai `unverified`, bukan conflicting |
| `unverified` / `snippet_only` | 56 | ~52 | turun seiring penggantian ⬇ |

**Berdasarkan proposal_usage_status:**

| proposal_usage_status | Prompt 2.5 | **Prompt 2.6** |
|---|---|---|
| `SAFE_TO_USE` | 1 | **6** ⬆ |
| `SAFE_WITH_HISTORICAL_LABEL` | 4 | **6** ⬆ |
| `SAFE_AS_CONTEXT_ONLY` | 13 | 11 |
| `NEEDS_MANUAL_VERIFICATION` | 34 | ~31 |
| `DO_NOT_USE` | 8 | **8** (tidak berubah) |

**Kesimpulan ledger setelah Prompt 2.6:**

Fondasi sumber untuk seluruh komponen utama MVP kini memiliki jalur terverifikasi: kebijakan (EV-A), sosial (EV-B), bencana (EV-C), surya (EV-D primary, EV-E supporting), PLTS eksisting historis (EV-F), fasilitas pendidikan (EV-G) dan kesehatan (EV-H).

Namun **daftar `DO_NOT_USE` tidak berkurang sama sekali** — dan ini disengaja. Seluruh **angka numerik** tentang Kubu Raya (kapasitas PLTS, KK terlayani, skor IRBI, angka investasi program nasional, nilai GHI) **tetap tidak boleh dikutip**. Yang dinaikkan oleh Prompt 2.6 adalah **keberadaan sumber dan jalur datanya**, bukan isi angkanya. Pembedaan ini adalah inti dari gate "CONDITIONAL" pada Prompt 3.
