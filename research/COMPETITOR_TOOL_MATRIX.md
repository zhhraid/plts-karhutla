# COMPETITOR_TOOL_MATRIX.md — Product Gap Research SURYA-SIAGA

**Revisi:** Prompt 2.5 (Evidence Verification &amp; Research Repair), 2026-09-12.

---

## ⚠️ AUDIT PROMPT 2.5 — STATUS DI BAGIAN INI MENGGANTIKAN TABEL DI BAWAHNYA

Instruksi §J Prompt 2.5: *"pastikan fitur yang diberi YES atau NO benar-benar didukung dokumentasi. Jika belum dapat diperiksa: gunakan UNKNOWN bukan NO."*

Pada Prompt 2.5, WebFetch diuji terhadap `globalsolaratlas.info` dan `inarisk.bnpb.go.id` — **keduanya ditolak `EGRESS_BLOCKED`**. Tidak satu pun dokumentasi tool dapat dibaca langsung. Karena itu seluruh matriks di bawah diaudit ulang dengan aturan ketat berikut:

**Aturan audit yang diterapkan:**
1. **YES dipertahankan HANYA jika fitur tersebut adalah tujuan definisional tool itu sendiri** — yaitu hal yang tidak mungkin salah tanpa menyalahpahami identitas tool (mis. Global Solar Atlas menyediakan data potensi surya; InaRISK menyediakan data risiko bencana). Klaim semacam ini tidak kontestabel.
2. **Seluruh NO diturunkan menjadi UNKNOWN**, kecuali ketiadaan itu bersifat definisional dan tidak kontestabel (mis. InaRISK — platform risiko bencana nasional BNPB — tidak menyediakan data potensi radiasi surya).
3. **Seluruh PARTIAL yang bersandar pada penafsiran fitur UI diturunkan menjadi UNKNOWN**, karena UI tidak pernah dilihat.

### Ringkasan Penurunan Status

| Tool | Fitur | Status Prompt 2 | **Status Prompt 2.5** | Alasan |
|---|---|---|---|---|
| Global Solar Atlas | Public facility context | NO | **UNKNOWN** | Dokumentasi tidak dibaca; ketiadaan tidak terbukti |
| Global Solar Atlas | Facility criticality | NO | **UNKNOWN** | Idem |
| Global Solar Atlas | Explainable multi-criteria | NO | **UNKNOWN** | Idem |
| Global Solar Atlas | Disaster risk data | NO | **UNKNOWN** | Idem — meski kecil kemungkinannya, tidak terbukti |
| Global Solar Atlas | Data provenance | PARTIAL | **UNKNOWN** | Bersandar penafsiran UI yang tak pernah dilihat |
| Global Solar Atlas | Data freshness / uncertainty indicator | PARTIAL | **UNKNOWN** | Idem |
| Global Solar Atlas | Site comparison | YES | **UNKNOWN** | Hanya "ranking negara" — bukan site comparison dalam arti SURYA-SIAGA |
| Global Solar Atlas | Solar potential data | YES | **YES** (dipertahankan) | Definisional |
| Global Solar Atlas | New deployment assessment | YES | **PARTIAL** | "Screening/zoning" ≠ assessment rekomendasi; diturunkan |
| InaRISK | Solar potential data | NO | **NO** (dipertahankan) | Definisional — platform risiko bencana |
| InaRISK | Existing PLTS context | NO | **UNKNOWN** | Tidak terbukti |
| InaRISK | New/Expansion deployment assessment | NO | **NO** (dipertahankan) | Definisional — di luar domain platform |
| InaRISK | Disaster risk data | YES | **YES** (dipertahankan) | Definisional |
| InaRISK | Explainable multi-criteria prioritization | YES | **PARTIAL–UNKNOWN** | Metodologi berbobot terdokumentasi publik (kuat), tapi "explainable di level UI" tak pernah dilihat |
| InaRISK | Beneficiary/social impact | YES | **PARTIAL** | Kerentanan sosial = komponen indeks, bukan fitur dampak per-penerima manfaat |
| InaRISK | Data provenance / freshness / site comparison | PARTIAL | **UNKNOWN** | Bersandar penafsiran UI |
| ESDM One Map | Semua fitur selain "solar potential data" | UNKNOWN/PARTIAL | **UNKNOWN** | Tidak berubah — sudah konservatif |
| ESDM One Map | Solar potential data | YES | **YES** (dipertahankan) | Definisional (layer potensi surya EBTKE) |
| NREL RE Data Explorer | Solar potential data, new deployment, scoring | YES | **YES** (dipertahankan) | Definisional (technical potential tool) |
| NREL RE Data Explorer | Sisanya | PARTIAL/UNKNOWN | **UNKNOWN** | Bersandar penafsiran dokumentasi tak terbaca |

### Dampak Audit terhadap Klaim Novelty

Ini adalah temuan paling material dari Prompt 2.5 untuk positioning produk:

> **Klaim "tidak ada tool lain yang punya fitur X" saat ini TIDAK dapat didukung sama sekali** — karena setelah audit, hampir seluruh status NO berubah menjadi UNKNOWN. Ketiadaan fitur pada tool pesaing **tidak terbukti**, hanya **tidak terlihat**.

Konsekuensi untuk proposal:
- Klaim yang **masih boleh** dibuat: *"SURYA-SIAGA mengintegrasikan potensi surya, risiko bencana, criticality fasilitas, dampak sosial, dan konteks PLTS eksisting dalam satu kerangka prioritisasi yang explainable"* — ini deskripsi **desain sendiri**, tidak memerlukan bukti tentang tool lain.
- Klaim yang **DILARANG**: *"belum ada platform seperti ini"*, *"pertama di Indonesia"*, *"tool lain tidak memiliki X"*, atau tabel perbandingan yang menampilkan kolom "tidak ada" untuk pesaing.
- Yang **dapat diverifikasi tanpa akses internet**: bahwa keempat tool ini **masing-masing memiliki tujuan definisional yang berbeda dari SURYA-SIAGA** (atlas sumber daya surya; platform risiko bencana; geoportal katalog peta; alat technical potential). Perbedaan **tujuan produk** ini adalah dasar diferensiasi yang jauh lebih aman daripada perbandingan fitur.

**Rekomendasi framing:** posisikan diferensiasi pada **tujuan dan unit analisis** ("tool lain menjawab 'berapa potensi surya di area ini' atau 'seberapa berisiko area ini'; SURYA-SIAGA menjawab 'fasilitas mana yang paling perlu dikaji lebih lanjut'"), bukan pada matriks centang fitur.

---

## (Isi di bawah ini adalah hasil Prompt 2 — dipertahankan sebagai jejak audit. Untuk status yang berlaku, gunakan tabel audit di atas.)

> ⚠️ Seluruh temuan di dokumen ini berstatus `unverified` (search-snippet-level) — WebFetch diblokir total di lingkungan riset ini untuk semua domain yang diuji. Status **UNKNOWN** dipakai secara sengaja dan luas di bawah, sesuai instruksi tugas: "JANGAN menggunakan NO jika sebenarnya hanya belum menemukan fitur tersebut." Status YES/PARTIAL/NO tetap dilaporkan apa adanya, termasuk ketika tool eksisting ternyata memiliki fitur yang mirip dengan SURYA-SIAGA — riset ini tidak memaksakan pencarian perbedaan.

Empat tool diperiksa: **Global Solar Atlas**, **InaRISK (BNPB)**, **ESDM One Map (layer EBTKE)**, **NREL RE Data Explorer / Technical Potential Tool**.

---

## 1. Global Solar Atlas (GSA 2.0)

| Field | Isi |
|---|---|
| tool_name | Global Solar Atlas 2.0 |
| provider | World Bank Group (didanai ESMAP), dikembangkan/dioperasikan Solargis |
| primary_purpose | Pre-feasibility screening potensi surya &amp; PV global (**bukan** untuk investment-grade/bankable analysis — dinyatakan eksplisit) |
| target_user | Pemerintah, pengembang (developer), akademisi, masyarakat umum |
| geographic_scope | Global |
| data_types | GHI, DNI, DIF, GTI, OPTA, PVOUT, suhu udara, elevasi terrain; rata-rata jangka panjang 1994–2024 |
| main_features | Peta interaktif, kalkulator hasil PV (profil 12×24 bulan×jam), unduhan GIS (GeoTIFF/AAIGrid), ranking &amp; perbandingan negara, factsheet negara, estimasi LCOE per negara |
| source_url | documents1.worldbank.org (Technical &amp; Validation Report), esmap.org, globalsolaratlas.info/global-pv-potential-study |

| Fitur | Status | Alasan &amp; Sumber |
|---|---|---|
| Solar potential data | **YES** | Fungsi inti — GHI/DNI/PVOUT dsb. |
| Disaster risk data | **NO** | Dokumentasi teknis/validasi hanya membahas parameter iklim-surya, tanpa hazard layer. |
| Public facility context (puskesmas/sekolah) | **NO** | Tidak ada satu pun sumber menyebut layer fasilitas publik. |
| Beneficiary/social impact | **PARTIAL** | Cross-correlation dengan indikator sosio-ekonomi &amp; LCOE per negara — level agregat negara, bukan per-penerima manfaat. |
| Facility criticality assessment | **NO** | Tidak relevan/tidak ditemukan. |
| Existing PLTS context/data | **UNKNOWN** | Tidak ditemukan bukti layer "PLTS eksisting" pada GSA sendiri. |
| New deployment assessment | **YES** | Dideskripsikan eksplisit sebagai alat "initial zoning and site identification"/"screening and comparison". |
| Expansion assessment | **UNKNOWN** | Tidak ada fitur spesifik untuk menilai ekspansi PLTS eksisting yang teridentifikasi. |
| Explainable multi-criteria prioritization | **NO** | Menyajikan parameter resource tunggal/paralel, bukan skor komposit lintas-kriteria heterogen dengan breakdown kontribusi. |
| Scoring/ranking | **YES** | Ranking &amp; perbandingan negara berdasarkan PVOUT dan LCOE. |
| Data provenance | **PARTIAL** | Sumber data (NOAA, EUMETSAT, ECMWF, NASA) terdokumentasi lengkap di laporan teknis terpisah; belum terverifikasi tampil inline di UI peta. |
| Data freshness indicator | **PARTIAL** | Cakupan diperbarui berkala (hingga 2024); indikator freshness inline di UI belum terverifikasi. |
| Site comparison | **YES** (level negara) | Ranking &amp; factsheet perbandingan negara; perbandingan titik individual tidak terverifikasi. |
| Uncertainty/data confidence indicator | **PARTIAL** | Uncertainty terukur kuantitatif (±4–14%) di Validation Report — level laporan teknis agregat, belum terverifikasi sebagai indikator interaktif per-lokasi. |

---

## 2. InaRISK (BNPB) / IRBI

| Field | Isi |
|---|---|
| tool_name | InaRISK Portal / IRBI (Indeks Risiko Bencana Indonesia) |
| provider | BNPB, berkolaborasi kementerian/lembaga terkait |
| primary_purpose | Diseminasi kajian risiko bencana &amp; pemantauan penurunan indeks risiko bencana nasional |
| target_user | Pemerintah pusat/daerah, BPBD, stakeholder, masyarakat umum |
| geographic_scope | Indonesia (nasional/provinsi/kabupaten-kota) |
| data_types | 12 jenis bahaya (termasuk kekeringan &amp; karhutla); sub-indeks kerentanan sosial/fisik/ekonomi (termasuk jumlah fasilitas kritis dari BIG &amp; Podes); sub-indeks kapasitas |
| main_features | WebGIS per-hazard, dashboard per provinsi, publikasi tahunan IRBI dengan ranking wilayah, dokumen Kajian Risiko Bencana (KRB) per daerah, InaRISK Personal, portal unduh data spasial |
| source_url | inarisk.bnpb.go.id/irbi, /metodologi, direktoripb.bnpb.go.id/produk/inarisk |

| Fitur | Status | Alasan &amp; Sumber |
|---|---|---|
| Solar potential data | **NO** | Platform murni risiko bencana. |
| Disaster risk data | **YES** | Fungsi inti — **overlap langsung** dengan dimensi risiko bencana SURYA-SIAGA. |
| Public facility context | **PARTIAL** | Kerentanan memasukkan "jumlah fasilitas kritis" &amp; data Podes sebagai input agregat wilayah, bukan layer titik individual yang bisa dijelajahi user. |
| Beneficiary/social impact | **YES** | Kerentanan sosial (populasi terpapar) adalah komponen inti metodologi. |
| Facility criticality assessment | **PARTIAL** | Hanya hitungan jumlah fasilitas kritis sebagai variabel exposure, bukan penilaian per-fasilitas individual. |
| Existing PLTS context/data | **NO** | Tidak ditemukan bukti terkait data energi terbarukan. |
| New deployment assessment | **NO** | Tidak relevan dengan platform ini. |
| Expansion assessment | **NO** | Sama seperti di atas. |
| Explainable multi-criteria prioritization | **YES (untuk risiko bencana, BUKAN siting energi)** | IRBI = f(Bahaya, Kerentanan, Kapasitas), sub-indeks berbobot dengan kelas rendah/sedang/tinggi terdokumentasi publik. |
| Scoring/ranking | **YES** | IRBI menghasilkan skor &amp; ranking provinsi/kabupaten-kota. |
| Data provenance | **PARTIAL** | Dokumen metodologi mengutip sumber spesifik (Podes/BPS, BIG, metodologi JICA 2015) di PDF pendamping; belum terverifikasi tampil inline di WebGIS. |
| Data freshness indicator | **PARTIAL** | Edisi tahunan terdokumentasi (2020–2023); indikator "data as of" per layer di peta live belum terverifikasi. |
| Site comparison | **PARTIAL** | Ranking antar-wilayah jelas ada; perbandingan dua titik spesifik pilihan pengguna tidak terkonfirmasi. |
| Uncertainty/data confidence indicator (terpisah dari skor) | **UNKNOWN** | Tidak ditemukan bukti indikator confidence eksplisit terpisah dari skor risiko — dokumentasi tidak dibaca penuh, sehingga tidak dinyatakan NO. |

---

## 3. ESDM One Map (layer EBTKE)

| Field | Isi |
|---|---|
| tool_name | ESDM One Map Indonesia (konten tematik EBTKE) |
| provider | Kementerian ESDM RI — dikelola P3TKEBTKE, Badan Litbang ESDM |
| primary_purpose | Geoportal WebGIS publik &gt;100 peta tematik sektor energi &amp; SDM, termasuk potensi EBT |
| target_user | Investor, stakeholder, akademisi, masyarakat umum |
| geographic_scope | Indonesia (nasional) |
| data_types | Peta potensi energi surya, peta potensi PLTS Terapung (lokasi, potensi MW, danau/waduk terkait), peta potensi angin/hidro/sampah kota, puluhan peta tematik ESDM lain |
| main_features | WebGIS interaktif &gt;100 layer (17 khusus EBTKE), fitur metadata per peta, berita pemutakhiran berkala |
| source_url | onemap.esdm.go.id/map/ebtke.html, /news/pemutakhiran_p3tekebtke.html |

| Fitur | Status | Alasan &amp; Sumber |
|---|---|---|
| Solar potential data | **YES** | Peta potensi energi surya &amp; PLTS Terapung dengan angka MW eksplisit. |
| Disaster risk data | **UNKNOWN** | ESDM/Badan Geologi punya produk peta bahaya geologi terpisah, belum terkonfirmasi terintegrasi di One Map. |
| Public facility context | **UNKNOWN** | Satu ringkasan pencarian menyinggung kemungkinan layer fasilitas publik, tapi tampak sebagai inferensi mesin pencari, bukan kutipan langsung — **tidak dianggap terverifikasi, ditandai UNKNOWN bukan YES**. |
| Beneficiary/social impact | **UNKNOWN** | Portal tampak sebagai katalog peta aset/potensi sumber daya, bukan dashboard dampak sosial. |
| Facility criticality assessment | **UNKNOWN** | Tidak ada bukti. |
| Existing PLTS context/data | **PARTIAL** | Peta PLTS Terapung menampilkan lokasi &amp; potensi di badan air eksisting — menunjukkan lokasi potensi, belum tentu = katalog komprehensif PLTS yang SUDAH beroperasi (ground-mount/atap) secara nasional. |
| New deployment assessment | **PARTIAL** | Peta potensi disebut "mendukung kebijakan pengembangan EBT" — mengarah ke perencanaan lokasi baru, tapi berupa peta potensi mentah, bukan mesin rekomendasi/ranking otomatis. |
| Expansion assessment | **UNKNOWN** | Tidak ditemukan bukti fitur khusus untuk menilai ekspansi PLTS eksisting. |
| Explainable multi-criteria prioritization | **UNKNOWN** | Tampak sebagai katalog peta tematik terpisah-pisah, bukan mesin skor komposit; situs tidak dibaca penuh sehingga tidak diklaim NO. |
| Scoring/ranking | **UNKNOWN** | Tidak ditemukan bukti. |
| Data provenance | **PARTIAL** | FAQ menyebut fitur "melihat metadata peta" per layer, peta diatribusikan ke unit penyusun. |
| Data freshness indicator | **PARTIAL** | Ada berita "pemutakhiran" peta EBT dengan tanggal terbit tertentu. |
| Site comparison | **UNKNOWN** | Tidak ditemukan bukti. |
| Uncertainty/data confidence indicator | **UNKNOWN** | Tidak ditemukan bukti. |

---

## 4. NREL RE Data Explorer / Technical Potential Tool (re-explorer.org)

| Field | Isi |
|---|---|
| tool_name | Renewable Energy (RE) Data Explorer — termasuk Technical Potential Tool (model reV) |
| provider | NREL (DOE, AS), didukung USAID |
| primary_purpose | Analisis geospasial potensi energi terbarukan untuk mendukung keputusan kebijakan/investasi/deployment di negara berkembang |
| target_user | Pengembang, pembuat kebijakan, perencana energi, sektor swasta negara berkembang |
| geographic_scope | Global, dataset unggulan Asia Tenggara (termasuk Indonesia), Afrika, dll. |
| data_types | Irradiance/angin resolusi tinggi (Asia Tenggara: 3km/15-menit, 15 tahun rekaman), technical potential (MW, GWh, luas lahan) untuk angin/PV/CSP, layer exclusion lahan (kawasan lindung, tutupan lahan, kemiringan, badan air, area budaya), layer kedekatan infrastruktur, supply-curve LCOE+transmisi (model reV) |
| main_features | Technical Potential Tool interaktif dengan filter/exclusion custom, unduhan dataset, ranking site via reV supply curve, "Ask an Expert" |
| source_url | re-explorer.org/about, /technical-potential-tool, docs.nrel.gov/docs/fy19osti/72995.pdf |
| catatan currency | API resmi (developer.nrel.gov/docs/energy-optimization/rede-technical-potential/) ditandai **"deprecated"** oleh NREL Developer Network meski situs re-explorer.org masih mempromosikan tool ini — isu status/currency tool perlu dicatat. |

| Fitur | Status | Alasan &amp; Sumber |
|---|---|---|
| Solar potential data | **YES** | Data irradiance &amp; technical potential PV/CSP resolusi tinggi, termasuk Asia Tenggara/Indonesia eksplisit. |
| Disaster risk data | **UNKNOWN** (cenderung tidak ada) | Layer exclusion fokus pada kendala fisik/lahan, bukan peta bahaya bencana; dokumentasi tidak dibaca penuh. |
| Public facility context | **UNKNOWN** | Tidak ditemukan bukti layer fasilitas kesehatan/pendidikan. |
| Beneficiary/social impact | **PARTIAL** | Ekosistem NREL/USAID/World Bank punya tool terkait (Global Electrification Platform) — tampak sebagai inisiatif TERPISAH, belum terverifikasi terintegrasi langsung ke RE Data Explorer. |
| Facility criticality assessment | **UNKNOWN** | Tidak ditemukan bukti. |
| Existing PLTS context/data | **UNKNOWN** (cenderung tidak ada) | Tool didesain untuk menilai potensi lahan belum dikembangkan, bukan katalog pembangkit beroperasi. |
| New deployment assessment | **YES** | Fungsi inti — Technical Potential Tool + reV mengestimasi kapasitas/lahan sesuai untuk penempatan baru dengan filter/exclusion user-defined. |
| Expansion assessment | **UNKNOWN** (cenderung tidak ada) | Tidak ditemukan fitur untuk menilai ekspansi pembangkit eksisting. |
| Explainable multi-criteria prioritization | **PARTIAL** | Filter/exclusion terlihat &amp; transparan ke user, reV supply-curve mengurutkan lokasi berdasar LCOE+akses transmisi — belum terverifikasi ada breakdown kontribusi per-kriteria per lokasi seperti dimaksud SURYA-SIAGA. |
| Scoring/ranking | **YES** | reV supply curve eksplisit "sorts developable sites based on both LCOE and transmission access". |
| Data provenance | **PARTIAL** | Ada dokumen "RE Data Standard" &amp; user guide teknis; belum terverifikasi tampil inline di UI web tool. |
| Data freshness indicator | **UNKNOWN** | Tidak ditemukan bukti. |
| Site comparison | **PARTIAL** | Supply-curve ranking lintas banyak kandidat memungkinkan perbandingan; UI perbandingan dua-lokasi eksplisit tidak terkonfirmasi. |
| Uncertainty/data confidence indicator | **UNKNOWN** | Tidak ditemukan bukti. |

---

## Ringkasan Jujur Lintas-Tool

**Fitur yang TERBUKTI sudah ada di tool lain (tidak disembunyikan):**
- Skor/ranking komposit multi-kriteria yang terdokumentasi &amp; explainable — **InaRISK/IRBI sudah punya ini secara solid** (Risiko = f(Bahaya, Kerentanan, Kapasitas), sub-indeks berbobot terdokumentasi publik), meski untuk domain risiko bencana wilayah, bukan prioritisasi PLTS.
- Data provenance &amp; metodologi terdokumentasi lengkap — lazim di keempat tool, meski umumnya di dokumen pendamping terpisah, bukan inline UI.
- Scoring/ranking lokasi — ada di 3 dari 4 tool (GSA: ranking negara; InaRISK: ranking wilayah; RE Data Explorer: ranking site via supply curve).
- Data surya — sudah matang &amp; bebas akses di GSA, ESDM One Map, RE Data Explorer.
- Data risiko bencana (termasuk kekeringan &amp; karhutla) — sudah matang &amp; granular di InaRISK.
- Dimensi kerentanan sosial/populasi — komponen inti InaRISK.
- Uncertainty di level dataset/produk — sudah dikuantifikasi ilmiah di GSA (±4–14%).

**Kombinasi yang TIDAK ditemukan di tool manapun yang diperiksa** (ditandai hati-hati sebagai UNKNOWN, bukan kepastian negatif, kecuali dinyatakan tegas NO di atas):
- Tidak satu pun tool menggabungkan solar potential + disaster risk + facility criticality (puskesmas/sekolah) + beneficiary/social impact + existing-PLTS context dalam SATU skor prioritas tunggal.
- Tidak ditemukan bukti eksplisit "data confidence indicator" yang secara sadar dipisahkan dari skor keputusan (bukan sekadar uncertainty statistik dataset) di keempat tool.
- Tidak ditemukan bukti fitur "expansion assessment" (menilai kelayakan ekspansi PLTS eksisting, bukan penempatan baru) yang eksplisit di tool manapun.
- Tidak ditemukan bukti breakdown kontribusi per-kriteria yang ditampilkan ke pengguna secara visual/interaktif (explainability level-UI, bukan hanya di dokumen metodologi PDF) di keempat tool.

**Keterbatasan riset yang menentukan kekuatan kesimpulan ini:** karena WebFetch diblokir, banyak status di atas adalah UNKNOWN karena dokumentasi tidak terbaca penuh — bukan karena fitur dipastikan tidak ada. Klaim novelty final (lihat `RESEARCH_FINDINGS.md`) harus tetap berbasis "integration value" (SURYA-SIAGA mengintegrasikan...) dan bukan "tidak ada tool serupa" secara mutlak, sampai verifikasi manual dilakukan.
