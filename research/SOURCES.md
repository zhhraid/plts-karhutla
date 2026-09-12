# SOURCES.md — Registry Sumber Riset SURYA-SIAGA

**Sifat dokumen:** Katalog seluruh sumber yang teridentifikasi selama riset Prompt 2. Ini adalah bibliografi/registry, bukan bukti berstruktur (lihat `EVIDENCE_LEDGER.md` untuk klaim per-fakta).

**Revisi:** Prompt 2.5 (Evidence Verification &amp; Research Repair), 2026-09-12.

## Hasil Uji Ulang Akses (Prompt 2.5)

Tujuh domain prioritas diuji ulang dengan WebFetch pada 2026-09-12. **Ketujuhnya ditolak** dengan `EGRESS_BLOCKED` — penolakan kebijakan egress organisasi, bukan kegagalan situs tujuan:

| Domain diuji | Hasil | Sumber terkait |
|---|---|---|
| `power.larc.nasa.gov` | ❌ EGRESS_BLOCKED | B-06 s.d. B-09 |
| `globalsolaratlas.info` | ❌ EGRESS_BLOCKED | B-01 |
| `www.esdm.go.id` | ❌ EGRESS_BLOCKED | A-01 |
| `inarisk.bnpb.go.id` | ❌ EGRESS_BLOCKED | A-07 s.d. A-10 |
| `kuburayakab.bps.go.id` | ❌ EGRESS_BLOCKED | A-14, A-16, A-17 |
| `arxiv.org` | ❌ EGRESS_BLOCKED | B-12 |
| `kalbar.bpk.go.id` | ❌ EGRESS_BLOCKED | A-20 |

Diagnostik proxy (`/__agentproxy/status`) menunjukkan proxy sehat (`enabled: true`, `recentRelayFailures: []`) — blokir berasal dari kebijakan egress, dan README proxy melarang mencoba menerobosnya. **WebSearch masih berfungsi**, tetapi sesuai prinsip Prompt 2.5, hasil pencarian bukan bukti verifikasi.

**Konsekuensi:** kolom "Akses Sesi Ini" di bawah tetap berlaku — tidak ada perubahan status akses dari Prompt 2 ke Prompt 2.5. **Keterbatasan ini sengaja dipertahankan sebagai catatan metodologis environment agent.**

---

## ✅ Pembaruan Prompt 2.6 — External Manual Verification

Sejumlah sumber kritis telah diverifikasi **di luar environment agent ini**, menggunakan environment lain yang dapat membuka halaman sumber asli. **Agent ini tidak membuka URL tersebut dan tidak mengklaim telah melakukannya.**

| Sumber | ID Evidence | source_authority | verification_status | verification_method |
|---|---|---|---|---|
| ESDM — Program PLTS 100 GWp | EV-A | A | `verified_primary` | `external_manual_verification` |
| BPS — Kubu Raya Dalam Angka **2026** | EV-B | A | `verified_primary` | `external_manual_verification` |
| InaRISK (BNPB) — layer &amp; pembedaan metrik | EV-C | A | `verified_primary` | `external_manual_verification` |
| Global Solar Atlas — FAQ/Data Outputs | EV-D | B | `verified_secondary` | `external_manual_verification` |
| NASA POWER — API docs | EV-E | B | `verified_secondary` | `external_manual_verification` |
| BPK Kalbar — hibah PLTS 3 desa (30 Des 2021) | EV-F | A | `verified_primary` | `external_manual_verification` |
| Kemendikdasmen — referensi satuan pendidikan | EV-G | A | `verified_primary` | `external_manual_verification` |
| Portal Puskesmas Kubu Raya + Kalbar Sehat | EV-H | A | `verified_primary` (data path) | `external_manual_verification` |

**Sumber baru yang masuk registry pada Prompt 2.6:**

| ID | Nama Sumber | Penerbit | URL | Tier |
|---|---|---|---|---|
| A-23 | Kabupaten Kubu Raya Dalam Angka **2026** | BPS Kabupaten Kubu Raya | kuburayakab.bps.go.id/id/publication/2026/02/27/c93f971b4b29eaf6005aa0e3/kubu-raya-regency-in-figures-2026.html | A |
| B-23 | Global Solar Atlas — FAQ / Data Outputs | World Bank / ESMAP / Solargis | globalsolaratlas.info/support/faq | B |
| B-24 | NASA POWER — API tutorial/docs | NASA POWER | power.larc.nasa.gov/docs/tutorials/service-data-request/api/ | B |

> ⚠️ **Catatan penting:** external verification **tidak** menghapus keterbatasan egress di atas. Ketiga kategori status berikut harus tetap dibedakan di seluruh dokumen: `agent_verified` (1 sumber), `external_manual_verification` (8 sumber), `snippet_only` (sisanya).

> ⚠️ **Catatan §H — source authority ≠ verification.** Tier A/B/C di bawah menunjukkan **otoritas sumber**, bukan status verifikasi. URL resmi Tier A yang belum berhasil dibuka **tetap `unverified`**. Kedua dimensi ini tidak boleh saling menggantikan.

---

> ⚠️ **CAVEAT METODOLOGIS WAJIB DIBACA:** Dalam sesi riset ini, tool WebFetch diblokir oleh egress proxy lingkungan untuk **hampir seluruh domain eksternal** (situs pemerintah `.go.id`, jurnal Elsevier/Springer/Nature, arXiv, ResearchGate, Wikipedia, World Bank, NASA, dll.) — hanya `github.com`/`raw.githubusercontent.com` yang berhasil diakses penuh. Akibatnya, **kolom "Akses" di bawah menunjukkan status akses SESI INI, bukan status akses sumber itu sendiri** — sumber-sumber ini kemungkinan besar bisa diakses normal oleh manusia/sesi lain dengan koneksi internet biasa. Setiap sumber bertanda "snippet-only" WAJIB dibuka langsung sebelum dianggap terverifikasi.

---

## TIER A — Primary/Official

| ID | Nama Sumber | Penerbit | URL | Tipe | Topik | Akses Sesi Ini |
|---|---|---|---|---|---|---|
| A-01 | Media Center ESDM — Program PLTS 100 GWp | Kementerian ESDM RI | esdm.go.id/id/media-center/arsip-berita/dari-gilimanuk-hingga-pulau-rengit-program-plts-100-gwp-dorong-kemandirian-energi-nasional | Berita resmi | policy | snippet-only |
| A-02 | Materi Paparan RUPTL PLN 2025–2034 | Ditjen Ketenagalistrikan ESDM (gatrik.esdm.go.id) | gatrik.esdm.go.id/assets/uploads/download_index/files/4ec39-materi-paparan-ruptl-2025-2034.pdf | Dokumen PDF resmi | policy | snippet-only (PDF tidak terbuka) |
| A-03 | Rasio Desa Berlistrik &amp; Rasio Elektrifikasi Triwulan III 2024 | Ditjen Ketenagalistrikan ESDM | gatrik.esdm.go.id/berita/?slug=meningkat-rasio-desa-berlistrik-dan-rasio-elektrifikasi-triwulan-iii-2024-ditetapkan | Berita/statistik resmi | electricity | snippet-only |
| A-04 | Dataset "Rasio Elektrifikasi" (nasional &amp; per kab/kota) | Satu Data Indonesia (data.go.id) | data.go.id/dataset/dataset/rasio-elektrifikasi ; katalog.data.go.id/id/dataset/rasio-elektrifikasi-berdasarkan-kabupaten-kota1 | Dataset portal resmi | electricity | snippet-only (isi belum dibaca) |
| A-05 | Data ESDM Kalbar — rasio elektrifikasi &amp; PLTS per kab/kota | Satu Data Provinsi Kalimantan Barat (data.kalbarprov.go.id) | data.kalbarprov.go.id/organization/dinas-energi-dan-sumber-daya-mineral-prov-kalbar | Portal data provinsi | electricity, existing_plts | snippet-only |
| A-06 | BNPB — pengumuman Perpres PLTS 100 GWp (belum final) | ANTARA News (mengutip Dirjen EBTKE) | antaranews.com/berita/5710828/pemerintah-persiapkan-perpres-untuk-plts-100-gwp | Berita | policy | snippet-only |
| A-07 | InaRISK — halaman metodologi | BNPB | inarisk.bnpb.go.id/metodologi | Dokumentasi resmi | disaster | snippet-only |
| A-08 | InaRISK — Indeks Risiko Bencana Indonesia (IRBI) 2023 | BNPB | inarisk.bnpb.go.id/IRBI-2023/files/basic-html/page306.html | Publikasi resmi | disaster | snippet-only |
| A-09 | InaRISK — IRBI 2024 | BNPB | inarisk.bnpb.go.id/IRBI-2024/files/basic-html/page308.html | Publikasi resmi | disaster | snippet-only |
| A-10 | InaRISK — dokumen KRB Provinsi Jawa Barat (contoh metodologi kelas) | BNPB | inarisk.bnpb.go.id/pdf/Jawa%20Barat/Dokumen%20KRB%20Prov.%20Jawa%20Barat_final%20draft.pdf | Dokumen resmi | disaster | snippet-only — **bukan Kalbar, hanya contoh metodologi** |
| A-11 | InaRISK — ArcGIS REST Services | BNPB (gis.bnpb.go.id) | gis.bnpb.go.id/server/rest/services/inarisk | Layanan data spasial | disaster | snippet-only |
| A-12 | Portal Puskesmas Kabupaten Kubu Raya | Pemkab Kubu Raya | puskesmas.kuburayakab.go.id | Portal fasilitas kesehatan | facility | snippet-only |
| A-13 | Platform Fasyankes Provinsi Kalbar | Dinas Kesehatan Prov. Kalbar (kalbarsehat.kalbarprov.go.id) | kalbarsehat.kalbarprov.go.id/fasyankes/ | Portal fasilitas kesehatan | facility | snippet-only |
| A-14 | BPS Kubu Raya — tabel jumlah fasilitas kesehatan per kecamatan | BPS Kabupaten Kubu Raya | kuburayakab.bps.go.id/id/statistics-table/3/... | Statistik resmi | facility | snippet-only |
| A-15 | Referensi Data Kemendikdasmen (Dapodik) — Kubu Raya | Kemendikdasmen RI | referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/131300/2/jf/5/all | Portal data pendidikan resmi | facility | snippet-only |
| A-16 | BPS — "Kabupaten Kubu Raya Dalam Angka 2025" | BPS Kabupaten Kubu Raya | kuburayakab.bps.go.id/en/publication/2025/02/28/b6bb9b4a2ce61ee62e955ec3/kabupaten-kubu-raya-dalam-angka-2025.html | Publikasi statistik resmi | social | snippet-only |
| A-17 | BPS — "Kecamatan Sungai Raya/Kubu Dalam Angka 2025" | BPS Kabupaten Kubu Raya | kuburayakab.bps.go.id | Publikasi statistik resmi | social | snippet-only |
| A-18 | Buku Data Statistik Sektoral Kabupaten Kubu Raya 2024 | Diskominfo Kubu Raya | kominfo.kuburaya.go.id | Dokumen PDF resmi | social | snippet-only |
| A-19 | Open Data Kubu Raya (tag pendidikan) | Pemkab Kubu Raya | opendata.kuburaya.go.id | Portal open data | facility | snippet-only |
| A-20 | BPK Perwakilan Kalbar — hibah PLTS 3 desa Batu Ampar | BPK RI Perwakilan Kalbar | kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/ | Berita/laporan lembaga negara | existing_plts | snippet-only |
| A-21 | ESDM One Map — layer EBTKE (potensi surya, PLTS Terapung) | Kementerian ESDM (P3TKEBTKE) | onemap.esdm.go.id/map/ebtke.html ; onemap.esdm.go.id/news/pemutakhiran_p3tekebtke.html | WebGIS resmi | product_gap, solar | snippet-only |
| A-22 | Dataset kependudukan Desa Sungai Kerawang 31 Des 2020 | Satu Data Provinsi Kalimantan Barat | data.kalbarprov.go.id | Dataset resmi | social, existing_plts | snippet-only (isi belum dibaca) |

## TIER B — Authoritative Technical/Research

| ID | Nama Sumber | Penerbit | URL | Tipe | Topik | Akses Sesi Ini |
|---|---|---|---|---|---|---|
| B-01 | Global Solar Atlas — halaman download &amp; metadata | World Bank / Solargis | globalsolaratlas.info/download | Situs teknis resmi | solar | snippet-only |
| B-02 | Global Solar Atlas 2.0 — Technical Report | World Bank | documents1.worldbank.org/curated/en/529431592893043403/pdf/Global-Solar-Atlas-2-0-Technical-Report.pdf | Laporan teknis resmi | solar | snippet-only |
| B-03 | Global Solar Atlas 2.0 — Validation Report | World Bank | documents1.worldbank.org/curated/en/507341592893487792/pdf/Global-Solar-Atlas-2-0-Validation-Report.pdf | Laporan validasi resmi | solar | snippet-only |
| B-04 | ESMAP — Global Photovoltaic Power Potential by Country | World Bank/ESMAP | esmap.org/Global%20Photovoltaic%20Power%20Potential%20by%20Country | Laporan resmi | solar | snippet-only |
| B-05 | World Bank Data Catalog — World High Resolution Solar Resource | World Bank (energydata.info) | energydata.info/dataset/world-high-resolution-solar-resource-ghi-dif-gti-dni-gis-data-global-solar-atlas | Metadata dataset | solar | snippet-only |
| B-06 | NASA POWER — Methodology | NASA Langley (power.larc.nasa.gov) | power.larc.nasa.gov/docs/methodology/ | Dokumentasi teknis resmi | solar | snippet-only |
| B-07 | NASA POWER — Solar FAQ | NASA Langley | power.larc.nasa.gov/docs/faqs/solar/ | Dokumentasi teknis resmi | solar | snippet-only |
| B-08 | NASA POWER — Temporal Daily API docs | NASA Langley | power.larc.nasa.gov/docs/services/api/temporal/daily/ | Dokumentasi API resmi | solar | snippet-only |
| B-09 | NASA POWER — API services docs | NASA Langley | power.larc.nasa.gov/docs/services/api/ | Dokumentasi API resmi | solar | snippet-only |
| B-10 | NREL RE Data Explorer — About | NREL (DOE, didukung USAID) | re-explorer.org/about ; re-explorer.org/technical-potential-tool | Situs teknis resmi | product_gap, methodology | snippet-only |
| B-11 | NREL Developer Network — RE Data Explorer API (ditandai deprecated) | NREL | developer.nrel.gov/docs/energy-optimization/rede-technical-potential/ | Dokumentasi API resmi | product_gap | snippet-only |
| B-12 | GIS-AHP MCDA — SolarBoost, Kalimantan Barat (arXiv 2007.15351) | Ruiz, Sunarso, Ibrahim-Bathis, et al. | arxiv.org/abs/2007.15351 ; sciencedirect.com/science/article/pii/S2352484720316243 | Paper akademik | methodology | snippet-only |
| B-13 | GIS-AHP Solar PV Saudi Arabia | Al Garni &amp; Awasthi, Applied Energy 2017 | sciencedirect.com/science/article/abs/pii/S030626191731437X | Paper akademik | methodology | snippet-only |
| B-14 | GIS-AHP Pakistan solar/wind siting | Raza et al., Renewable Energy 2023 | sciencedirect.com/science/article/abs/pii/S0960148123001520 | Paper akademik | methodology | snippet-only |
| B-15 | GIS-AHP-MCDA Bangladesh solar siting | Islam et al., Renewable Energy 2024 | sciencedirect.com/science/article/abs/pii/S0960148123015100 | Paper akademik | methodology | snippet-only |
| B-16 | RRMCDMR — resilience/risk MCDM renewable siting (Iran) | Environmental Science and Pollution Research 2023 | link.springer.com/article/10.1007/s11356-023-25223-1 | Paper akademik | methodology | snippet-only |
| B-17 | Sensitivity analysis in MCDA — systematic review | Więckowski &amp; Sałabun, Applied Soft Computing 2023 | sciencedirect.com/science/article/pii/S156849462300933X ; doi.org/10.1016/j.asoc.2023.110915 | Paper akademik | methodology | snippet-only |
| B-18 | FAIR Guiding Principles | Wilkinson et al., Scientific Data 2016 | nature.com/articles/sdata201618 | Paper akademik | methodology | snippet-only |
| B-19 | DAMA-DMBOK2 Data Quality — ringkasan | Repositori pihak ketiga (androchentw) | github.com/androchentw/DAMA-DMBOK2-Data-Quality | Ringkasan pihak ketiga di GitHub | methodology | **verified_secondary — satu-satunya halaman yang berhasil dibuka penuh** |
| B-20 | DAMA International — halaman resmi DMBOK | DAMA International | dama.org/dama-dmbok-revision/ | Situs resmi organisasi | methodology | snippet-only (halaman resmi belum terbuka) |
| B-21 | NASA FIRMS — peta hotspot kebakaran | NASA (firms.modaps.eosdis.nasa.gov) | firms.modaps.eosdis.nasa.gov/map/ ; earthdata.nasa.gov/data/tools/firms | Layanan data satelit resmi | disaster | snippet-only |
| B-22 | IESR — Beyond 443 GW: Indonesia's Infinite Renewable Energy Potentials | Institute for Essential Services Reform | iesr.or.id/wp-content/uploads/2021/10/IESR-Beyond-443-GW-Indonesias-Infinite-Renewable-Energy-Potentials.pdf | Laporan riset lembaga think-tank | policy | snippet-only |

## TIER C — Contextual (media)

| ID | Nama Sumber | Penerbit | URL | Tipe | Topik | Akses Sesi Ini |
|---|---|---|---|---|---|---|
| C-01 | CNBC Indonesia — target tambahan kapasitas PLTS+BESS PLN | CNBC Indonesia | cnbcindonesia.com/news/20260702170705-4-747622/pln-akan-ada-tambahan-kapasitas-plts-pakai-baterai-46-gw-di-2027 | Berita | policy | snippet-only |
| C-02 | ANTARA News — seleksi lahan pemerintah untuk PLTS | ANTARA News | antaranews.com/berita/5702961/pln-seleksi-lahan-pemerintah-untuk-proyek-plts-dan-penyimpanan-energi | Berita | policy | snippet-only |
| C-03 | CNN Indonesia — ESDM kantongi 9.000 hektare lahan PLTS 30 GW | CNN Indonesia | cnnindonesia.com/ekonomi/20260819143604-85-1394004/esdm-kantongi-9000-hektare-lahan-untuk-kejar-plts-30-gw | Berita | policy | snippet-only |
| C-04 | Kompas (lestari.kompas.com) — peta risiko karhutla gambut Kalbar 2026 | Kompas | lestari.kompas.com/read/2026/07/31/082802186/pemerintah-dan-ykan-susun-peta-risiko-karhutla-gambut-di-kalbar | Berita | disaster | snippet-only — **menyebut Kubu Raya eksplisit** |
| C-05 | ANTARA News — Kalbar percontohan peta risiko karhutla gambut nasional | ANTARA News | antaranews.com/berita/5672457/kemenhut-kalbar-jadi-percontohan-peta-risiko-karhutla-gambut-nasional | Berita | disaster | snippet-only — **menyebut Kubu Raya eksplisit** |
| C-06 | ANTARA Kalbar — Desa Sumber Agung harapkan bantuan pemerintah (historis) | ANTARA Kalbar | kalbar.antaranews.com/berita/336593/... | Berita (historis) | existing_plts | snippet-only, **historical** |
| C-07 | Mongabay — "PLTS Kubu, Proyek Ambisius yang Kini Tidak Terurus" (2016) | Mongabay Indonesia | mongabay.co.id/2016/05/01/plts-kubu-proyek-ambisius-yang-kini-tidak-terurus/ | Berita investigatif | existing_plts | **halaman gagal dibuka, lokasi ambigu — NOT_FOUND terverifikasi** |
| C-08 | Wikipedia ID — Desa Sungai Kerawang, Batu Ampar, Kubu Raya | Wikipedia bahasa Indonesia | id.wikipedia.org/wiki/Sungai_Kerawang,_Batu_Ampar,_Kubu_Raya | Ensiklopedia | existing_plts | snippet-only — **dipakai hanya untuk konfirmasi nama desa, BUKAN sumber teknis** |
| C-09 | kuburaya.go.id — 5 puskesmas rawat inap baru | Pemkab Kubu Raya | kuburaya.go.id | Berita pemerintah daerah | facility | snippet-only |
| C-10 | kuburaya.go.id — Batu Ampar jadi desa wisata, listrik langkah awal | Pemkab Kubu Raya | kuburaya.go.id | Berita pemerintah daerah | electricity | snippet-only |
| C-11 | Jurnal GEOGRAPHY (UMMAT) — pemetaan bahaya karhutla KHG Kubu Raya | Wijaya, Akbar, Romiyanto | journal.ummat.ac.id/index.php/geography/article/view/20988 | Paper akademik | disaster | snippet-only |
| C-12 | Jurnal Teknik PWK UNDIP — risiko karhutla gambut Kubu Raya | Muharrama &amp; Widjonarko, 2023, DOI 10.14710/tpwk.2023.32816 | ejournal3.undip.ac.id/index.php/pwk/article/view/32816 | Paper akademik | disaster | snippet-only |
| C-13 | Jurnal Hutan Lestari UNTAN — zonasi rawan karhutla Kubu Raya | Jawad, Nurdjali, Widiastuti, 2015 | jurnal.untan.ac.id/index.php/jmfkh/article/view/9244 | Paper akademik | disaster | snippet-only |
| C-14 | J-ABDIPAMAS — instalasi PLTS rumah tangga Sepok Keladi, Sungai Kakap | Wahyuni, Syaifurrahman, Islami (UNTAN), 2019 | — (jurnal pengabdian masyarakat) | Paper akademik/pengabdian | existing_plts | snippet-only, **historical (2019), skala kecil, di luar 3 lokasi target** |

---

## Sumber yang DILARANG dipakai / ditemukan tapi ditolak sebagai sumber

- Scribd "Daftar Sekolah di Kubu Raya dan Mempawah" — unggahan pihak ketiga tanpa provenance resmi, **tidak dipakai sebagai sumber data sekolah**.

## Ringkasan Status Akses

Dari 43 sumber di atas, **hanya 1 (B-19, GitHub)** yang berhasil diakses penuh (WebFetch berhasil) di sesi ini. Sisanya (42 sumber) berstatus snippet-only — teridentifikasi via WebSearch tapi halaman aslinya belum dibuka/dikonfirmasi. Ini bukan indikasi sumber tidak valid — ini keterbatasan akses jaringan sesi riset ini (lihat `RESEARCH_FINDINGS.md` §Critical Risks).
