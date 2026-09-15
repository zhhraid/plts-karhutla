# PROJECT_CONTEXT.md

> **STATUS: SINGLE SOURCE OF TRUTH**
> Dokumen ini WAJIB dibaca oleh setiap agent/kontributor sebelum mengerjakan task apa pun pada proyek SURYA-SIAGA. Jika terjadi konflik antara instruksi task dan dokumen ini, STOP dan laporkan ketidaksesuaian — jangan menyelesaikannya sendiri secara diam-diam.

---

## 0. Cara Menggunakan Dokumen Ini

Sebelum memulai task apa pun, setiap agent WAJIB:

1. Membaca seluruh dokumen ini.
2. Memahami scope task yang diberikan dan memastikan task tersebut konsisten dengan positioning, prinsip data, dan status proyek di sini.
3. Tidak memperluas scope secara diam-diam.
4. Tidak membuat/mengarang data.
5. Tidak mengubah terminologi produk (nama fitur, nama skor, nama entitas) tanpa dokumentasi eksplisit.
6. Tidak mengubah metode scoring/bobot tanpa dokumentasi eksplisit dan persetujuan.
7. Tidak menghapus provenance (source_name, source_url, data_year, dll) dari data apa pun.
8. Tidak mengubah positioning produk dari Decision Support System menjadi engineering design software.
9. Meng-update dokumen ini apabila ada keputusan resmi baru (lihat §19 Unresolved Decisions — pindahkan item ke bagian "resolved" dengan referensi keputusan).
10. Jika ada ketidakpastian material (data, scope, metodologi) — **STOP dan laporkan**, jangan menebak.

---

## 1. Identitas Produk

| Item | Nilai |
|---|---|
| Nama | **SURYA-SIAGA** |
| Descriptor | Solar Resilience & Expansion Decision Support System |
| Deskripsi | Platform Prioritisasi Pengembangan PLTS Berbasis Potensi Surya, Dampak Sosial, dan Ketahanan Bencana |
| Kompetisi | INFINITERA 2.0 — Web Development Competition |
| Tema kompetisi | "Bridging Innovation and Sustainability to Create Meaningful Impact for Future Generations" |
| Subtema utama | SDG 9 — Industri, Inovasi, dan Infrastruktur |
| SDG pendukung | SDG 13 — Penanganan Perubahan Iklim |
| Pilot awal | Kabupaten Kubu Raya, Kalimantan Barat |

---

## 2. Visi Produk

SURYA-SIAGA adalah Decision Support System berbasis web yang membantu proses **pre-screening dan prioritisasi awal** pengembangan serta penguatan PLTS (Pembangkit Listrik Tenaga Surya).

**Pertanyaan inti sistem:**

> "Di mana pengembangan energi surya berpotensi memberikan dampak paling berarti?"

Sistem mempertimbangkan, sejauh data tersedia:

- potensi energi surya (mis. GHI — Global Horizontal Irradiance);
- criticality fasilitas (mis. puskesmas, sekolah, fasilitas publik kritis);
- penerima manfaat (jumlah & jenis beneficiary);
- kebutuhan resilience (ketahanan terhadap gangguan/bencana);
- paparan risiko bencana (mis. kebakaran hutan/lahan, kekeringan);
- keberadaan PLTS eksisting;
- gap energi (apabila data tersedia);
- kualitas dan keterkinian data (data confidence).

**Core principle:**

> "Bukan sekadar di mana PLTS dapat dibangun, tetapi di mana PLTS paling dibutuhkan."

---

## 3. Problem Positioning (Batasan Framing Masalah)

> **Ditambahkan sebagai amandemen pasca-audit (lihat `docs/PRODUCT_AUDIT.md`, `docs/PROPOSAL_STRENGTHENING.md`).**

SURYA-SIAGA **TIDAK boleh** diposisikan sebagai solusi semata-mata untuk rendahnya rasio elektrifikasi.

- Rasio elektrifikasi atau akses listrik **boleh digunakan sebagai evidence tambahan** apabila tersedia dan relevan, tetapi **BUKAN syarat utama** dari problem statement produk.
- **Core problem tetap:** data yang relevan untuk pre-screening pengembangan/penguatan PLTS tersebar pada beberapa sumber dan memiliki dimensi yang berbeda-beda, sementara proses prioritisasi membutuhkan pertimbangan lebih dari sekadar potensi radiasi matahari.

SURYA-SIAGA mengintegrasikan:

- potensi surya;
- dampak sosial;
- facility criticality;
- resilience;
- existing solar infrastructure;
- data quality/freshness;

untuk membantu prioritisasi awal secara transparan.

**Larangan eksplisit:** jangan mengubah proyek menjadi aplikasi "elektrifikasi daerah tertinggal". Framing elektrifikasi sebagai problem statement utama mempersempit produk secara keliru dan tidak konsisten dengan core principle di §2.

---

## 4. Positioning

### SURYA-SIAGA ADALAH:

- Decision Support System (DSS);
- pre-screening tool;
- platform prioritisasi;
- aplikasi geospasial;
- explainable multi-criteria decision support system.

### SURYA-SIAGA **BUKAN**:

- engineering design software;
- feasibility study final;
- software load flow;
- software proteksi;
- software EPC;
- sistem dispatch PLN;
- pengganti engineer;
- sistem yang mengambil keputusan kebijakan secara otomatis.

### Aturan Framing Output

Semua rekomendasi yang ditampilkan ke pengguna **WAJIB** menggunakan framing berikut (atau setara):

- *preliminary assessment*;
- *priority indication*;
- *further assessment recommendation*.

Dilarang memberikan instruksi teknis final seperti "Bangun PLTS 200 kWp" kecuali tersedia kajian teknis yang benar dan didokumentasikan sebagai sumber.

---

## 5. Primary User, Stakeholder Roles & Partnership Status

> **Ditambahkan sebagai amandemen pasca-audit** untuk menutup gap "primary user belum didefinisikan" pada `docs/PRODUCT_AUDIT.md` §6.

### 5.1 Primary User

**Primary User** SURYA-SIAGA adalah **perencana daerah/analis pemerintah** yang melakukan proses pre-screening dan prioritisasi awal pengembangan infrastruktur energi — misalnya fungsi perencanaan pada **Bappeda**, **bidang energi pemerintah daerah**, atau **unit perencanaan infrastruktur** terkait.

> ⚠️ **Catatan penting:** nama-nama instansi di atas (Bappeda, bidang energi pemda, unit perencanaan infrastruktur) adalah **TARGET PERSONA** — gambaran jenis pengguna yang dituju, **BUKAN** pernyataan bahwa instansi tersebut telah menggunakan produk ini.

### 5.2 Secondary User

- pemerintah desa/BUMDes;
- pengelola fasilitas publik seperti puskesmas dan sekolah.

### 5.3 Supporting/Evaluator User

- peneliti;
- evaluator;
- juri kompetisi.

### 5.4 Partnership Status

Pada tahap kompetisi, **SURYA-SIAGA merupakan prototype independen yang dikembangkan menggunakan data publik.**

**Belum boleh diklaim** adanya, dengan Pemda Kubu Raya, PLN, Dinas ESDM, Bappeda, atau institusi lainnya:

- kerja sama resmi;
- endorsement;
- validasi institusional;
- implementasi resmi;

kecuali bukti nyata diberikan kemudian.

**Semua penyebutan instansi dalam persona (§5.1–§5.3) hanya menunjukkan *potential user*, bukan *existing partner*.** Materi proposal, UI, maupun komunikasi publik tidak boleh menyiratkan sebaliknya.

---

## 6. Wilayah Pilot

Pilot awal: **Kabupaten Kubu Raya**, Kalimantan Barat.

**DILARANG** mengklaim:

> ❌ "Kubu Raya adalah lokasi PLTS terbaik di Indonesia."

**WAJIB** menggunakan framing:

> ✅ "Kubu Raya digunakan sebagai pilot untuk menguji metode prioritisasi SURYA-SIAGA."

---

## 7. Target MVP (Cakupan Data)

- Gunakan sekitar **10–15 lokasi nyata**.
- Komposisi ideal:
  - beberapa lokasi PLTS eksisting;
  - ±5 puskesmas;
  - ±5 sekolah/fasilitas publik.
- Prinsip: **lebih baik 10 lokasi dengan data kuat daripada 500 lokasi dengan data lemah.**

Status Prompt 3 (2026-09-14): candidate pool MVP dikunci menjadi **10 fasilitas** (EDU-001..007, HLT-001..003), semua official_exact. Nilai solar/hazard belum lengkap; lihat §21 dan research/PROMPT_4_READINESS.md. Komposisi ideal di atas bukan kuota wajib pilot ini.

---

## 8. Model Data Inti

Setiap lokasi (facility) sebisa mungkin memiliki field-field berikut. **Field boleh NULL apabila informasi tidak tersedia — NULL lebih baik daripada angka buatan.**

```
facility_id
facility_name
facility_type

village
district
regency
province

latitude
longitude

beneficiary_count
beneficiary_type

ghi
ghi_unit

wildfire_risk
drought_risk

existing_plts
existing_plts_capacity_kwp
commissioning_year

existing_bess
bess_capacity_kwh

historical_served_households
historical_total_households
reported_energy_constraint

data_year
source_name
source_url
accessed_at

verification_status
data_confidence
notes
```

Skema database final **BELUM ditentukan** — model data ini adalah kontrak konseptual minimum, bukan skema tabel final.

---

## 9. Sumber Data

### Tier 1 (utamakan)
Lembaga pemerintah, dataset/portal data resmi, dokumen pemerintah, regulator: PLN, BPS, BNPB, InaRISK, Kementerian ESDM, Kementerian Kesehatan, Kemendikdasmen, Pemerintah Daerah.

### Tier 2
Lembaga internasional kredibel: World Bank, Global Solar Atlas, NASA, jurnal peer-reviewed.

### Tier 3
Media nasional kredibel — **hanya untuk konteks kejadian**, bukan sumber utama nilai teknis apabila data primer tersedia.

### Dilarang digunakan sebagai sumber:
- blog tanpa sumber;
- artikel SEO;
- posting media sosial sebagai fakta teknis;
- angka dari AI lain;
- data yang tidak dapat dilacak asalnya.

---

## 10. Aturan Integritas Data (MUTLAK)

1. Jangan pernah membuat data agar dataset terlihat lengkap.
2. Jangan menebak nilai numerik.
3. Jangan mengubah data historis menjadi seolah data terkini.
4. Jangan menyebut proxy sebagai nilai aktual.
5. Jangan menggabungkan dua sumber berbeda tanpa dokumentasi.
6. Jangan memilih angka ketika dua sumber bertentangan tanpa mencatat konflik.
7. Semua angka penting harus memiliki sumber.
8. Semua data historis harus mempunyai `data_year`.
9. Setiap data turunan harus dapat ditelusuri ke raw data.
10. Setiap transformasi harus terdokumentasi.

Jika fakta tidak dapat diverifikasi: gunakan **`NULL`** atau tandai **`requires_verification`**.

---

## 11. Konteks Khusus: PLTS Desa Sumber Agung, Batu Ampar

Terdapat informasi historis yang **pernah dilaporkan** (belum diverifikasi ulang ke sumber primer) terkait PLTS Desa Sumber Agung, Batu Ampar:

- PLTS komunal;
- kapasitas historis sekitar 100 kWp;
- beroperasi sekitar 2018;
- data historis menyebut sekitar 329 KK terlayani;
- total sekitar 402 KK;
- terdapat gap sekitar 73 KK pada saat laporan;
- terdapat laporan mengenai keterbatasan kapasitas/baterai.

**WAJIB:**

- Verifikasi kembali ke sumber primer sebelum data ini dimasukkan ke canonical dataset.
- Informasi tersebut **TIDAK boleh** dianggap merepresentasikan kondisi 2026.
- Beri label eksplisit pada data ini:
  - `Historical Data`
  - `Current Status Requires Verification`

---

## 12. Decision Model (Konseptual)

Pendekatan: **Multi-Criteria Decision Analysis (MCDA)**.

Kemungkinan metode: **AHP + Weighted Scoring** — namun ini adalah kandidat metode, bukan keputusan final.

> ⚠️ **BOBOT FINAL BELUM DITENTUKAN.** Agent DILARANG membuat bobot permanen secara sembarangan.

Sistem secara konseptual memiliki komponen berikut (nama-nama ini adalah terminologi resmi produk — jangan diubah tanpa dokumentasi):

1. **Solar Suitability Score**
2. **Resilience Need Score**
3. **Priority Score**
4. **Data Confidence**

> ⚠️ **Data Confidence TIDAK otomatis menjadi bagian dari Priority Score.** Keduanya ditampilkan terpisah kecuali ada keputusan eksplisit yang mengubah ini.

### 12.1 Data Confidence — Core Product Concept (Rubrik Belum Final)

> **Ditambahkan sebagai amandemen pasca-audit** untuk menutup gap yang diidentifikasi di `docs/PROPOSAL_STRENGTHENING.md` §8: Data Confidence sudah menjadi bagian model data (§8) dan komponen konseptual di atas, namun definisi kualitatifnya belum pernah didokumentasikan secara eksplisit sebelum amandemen ini.

**Definisi konseptual:** Data Confidence menunjukkan **tingkat keandalan bukti** yang mendasari informasi/rekomendasi suatu kandidat lokasi — bukan seberapa baik lokasi tersebut secara substantif (itu peran Priority Score).

**Dimensi yang akan dievaluasi nantinya** (daftar konseptual, belum berbobot):

- Source Authority (otoritas/tier sumber data);
- Data Recency (kebaruan data relatif terhadap `data_year`);
- Data Completeness (kelengkapan field untuk kandidat tersebut);
- Verification Status (`verification_status` per §8);
- Unresolved Source Conflict (ada/tidaknya konflik antar sumber yang belum terselesaikan, sesuai §10 poin 6).

**Kategori konseptual** (label kualitatif, bukan skala numerik):

- `HIGH CONFIDENCE`
- `MEDIUM CONFIDENCE`
- `NEEDS VERIFICATION`

> ⚠️ **Larangan tegas pada tahap ini:**
> - JANGAN membuat bobot numerik untuk dimensi Data Confidence di atas.
> - JANGAN membuat formula final penghitungan Data Confidence.
> - JANGAN menggabungkan Data Confidence ke dalam Priority Score secara otomatis (menegaskan kembali aturan di atas).

Rubrik final (termasuk bobot per dimensi, jika ada, dan threshold tiap kategori) **baru akan ditentukan setelah karakteristik dataset pilot nyata diketahui** — lihat §19 Unresolved Decisions.

### Jenis Rekomendasi (MVP)

- **New Deployment Assessment**
- **Expansion Assessment**
- **Needs Data Verification**

Dilarang memberikan instruksi engineering final (mis. "Bangun PLTS 200 kWp") kecuali tersedia kajian teknis yang benar dan terdokumentasi sebagai sumber.

---

## 13. Fitur

### Fitur MVP

1. Solar Resilience Map
2. Explainable Priority Score
3. Site Insight
4. Site Comparison
5. Deployment / Expansion Assessment
6. Data Confidence & Traceability

### Fitur Pasca-MVP (JANGAN diimplementasikan kecuali disetujui kemudian)

- Budget Scenario Planner
- Portfolio optimization
- Preliminary PLTS+BESS sizing
- Live hotspot
- Multi-provinsi
- Automatic data ingestion
- Sensitivity simulator
- Expert weighting interface
- Report generator

---

## 14. Tech Stack Preferensi

| Layer | Pilihan |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Maps | MapLibre GL JS atau Leaflet |
| Database | Supabase PostgreSQL |
| GIS | PostGIS (apabila memang diperlukan) |
| Data processing | Python, Pandas, GeoPandas, Rasterio, QGIS (validasi manual) |
| Deployment | Vercel + Supabase |

---

## 15. Prinsip Engineering

- TypeScript strict.
- Reusable components.
- Pisahkan UI, business logic, dan data access.
- Pisahkan scoring engine dari frontend.
- Raw data tidak boleh tercampur dengan derived data.
- Gunakan validation schema.
- Jangan menambahkan dependency tanpa alasan.
- Hindari microservice yang tidak perlu.
- Hindari overengineering.

---

## 16. Prinsip Utama Produk

> **TRANSPARANSI LEBIH PENTING DARIPADA PRESISI PALSU.**

- Jika data lama → katakan lama.
- Jika data proxy → katakan proxy.
- Jika data hilang → katakan tidak tersedia.
- Jika rekomendasi awal → katakan preliminary.

---

## 17. Aturan bagi Semua Agent Berikutnya

Sebelum setiap task:

1. Baca `PROJECT_CONTEXT.md`.
2. Pahami task.
3. Jangan memperluas scope diam-diam.
4. Jangan membuat data.
5. Jangan mengubah terminologi produk.
6. Jangan mengubah metode scoring tanpa dokumentasi.
7. Jangan menghapus provenance.
8. Jangan mengubah positioning DSS menjadi engineering software.
9. Update dokumentasi ini apabila keputusan resmi berubah.
10. Jika terdapat ketidakpastian material, **STOP dan laporkan**.

### 17.1 Prioritas Evidence vs. Perubahan Arah Produk

> **Ditambahkan sebagai amandemen pasca-audit.**

Jika penelitian/riset berikutnya menghasilkan fakta yang **bertentangan** dengan asumsi awal di `PROJECT_CONTEXT.md`, **evidence yang lebih kuat harus diprioritaskan** di atas asumsi awal.

Namun, **perubahan product direction yang material** (mis. mengubah problem statement, mengganti primary user, mengubah positioning, mengubah metode scoring inti) **harus**:

1. **didokumentasikan** — alasan dan evidence pendukung dicatat secara eksplisit;
2. **dilaporkan** — disampaikan secara jelas kepada pemilik proyek/pengguna, bukan diterapkan diam-diam;
3. **mendapat persetujuan sebelum diterapkan** — agent tidak boleh mengubah arah produk secara sepihak hanya karena menemukan evidence baru, sekuat apa pun evidence tersebut.

---

## 18. Status Proyek (Saat Ini BELUM Final)

Item-item berikut **belum final** — jangan berasumsi sudah ditentukan:

- Nilai solar/hazard kandidat (candidate pool telah dikunci pada Prompt 3);
- Dataset pilot (nilai-nilai aktual per fasilitas);
- Final weights (bobot AHP/scoring);
- Formula Priority Score;
- Final UI;
- Final database schema.

---

## 19. Unresolved Decisions (Log)

Daftar keputusan yang masih terbuka. Ketika sebuah keputusan dibuat secara resmi, pindahkan entrinya ke bagian "Resolved" dengan tanggal dan referensi (commit/PR/diskusi), dan update bagian terkait di dokumen ini.

> **Catatan pasca-audit:** seluruh item di bawah ini memang belum final secara sengaja dan akan diselesaikan pada **tahap research/methodology** berikutnya — bukan pada tahap dokumentasi ini. Jangan mencoba menyelesaikannya di luar tahap yang ditentukan.

### Open

- [ ] Evidence untuk pemilihan Kubu Raya sebagai wilayah pilot (data karhutla/elektrifikasi/GHI yang menjustifikasi lokasi — lihat `docs/PROPOSAL_STRENGTHENING.md` §4).
- [ ] Kelengkapan solar/hazard per-site untuk pool 10 fasilitas yang dikunci; menunggu external package (Prompt 3).
- [ ] Factual comparison dengan existing tools (Global Solar Atlas, InaRISK, dashboard PLTS umum, solar calculator) — verifikasi langsung terhadap fitur real tool tersebut, bukan hanya analisis konseptual (lihat `docs/PRODUCT_AUDIT.md` §4).
- [ ] Final criteria — daftar akhir kriteria yang masuk ke Solar Suitability Score dan Resilience Need Score.
- [ ] Normalization — metode normalisasi nilai kriteria yang heterogen (kuantitatif/kualitatif, satuan berbeda) sebelum digabung menjadi skor.
- [ ] Metode MCDA final: apakah benar AHP + Weighted Scoring, atau metode lain?
- [ ] Bobot final (AHP/MCDA weights) untuk Solar Suitability Score, Resilience Need Score, dan Priority Score.
- [ ] Formula matematis Priority Score (apakah linear weighted sum, atau non-linear?).
- [ ] **Data Confidence rubric final** — formula/kombinasi dimensi (§12.1) menjadi kategori HIGH/MEDIUM/NEEDS VERIFICATION.
- [ ] **Threshold setiap Data Confidence level** — batas kuantitatif/kualitatif yang memisahkan HIGH, MEDIUM, dan NEEDS VERIFICATION.
- [ ] **Perlakuan terhadap conflicting sources** dalam perhitungan Data Confidence (bagaimana "Unresolved Source Conflict" memengaruhi kategori akhir).
- [ ] Apakah dan bagaimana Data Confidence ditampilkan di UI relatif terhadap Priority Score.
- [ ] Skema database final (tabel, relasi, constraint) di Supabase PostgreSQL.
- [ ] Apakah PostGIS benar-benar diperlukan untuk MVP atau cukup lat/long sederhana.
- [ ] Status verifikasi data historis PLTS Desa Sumber Agung, Batu Ampar (belum diverifikasi ke sumber primer).
- [ ] Desain UI final untuk peta, site insight, dan site comparison.
- [ ] Definisi kuantitatif "wildfire_risk" dan "drought_risk" (skala, sumber, metodologi — kemungkinan dari InaRISK atau sumber Tier 1 lain).

### Resolved

- [x] **Pool dan kebijakan akuisisi MVP Prompt 3 (2026-09-14)** — 10 kandidat resmi, beneficiary frozen, GSA primary dengan CC BY 4.0 tanpa raster, InaRISK hazard prioritas, tiga PLTS sebagai konteks historis. Rujukan: instruksi pengguna Prompt 3, §21, research/PROMPT_3_FINAL_DATA_ACQUISITION_REPORT.md. Kelengkapan nilai dan metodologi tetap open.

- [x] **Primary user** — perencana daerah/analis pemerintah (persona: Bappeda/bidang energi pemda/unit perencanaan infrastruktur), dengan secondary user (pemerintah desa/BUMDes, pengelola fasilitas publik) dan supporting/evaluator user (peneliti, evaluator, juri kompetisi). Lihat §5. *(Amandemen PROMPT 1.5 — instansi yang disebut adalah target persona, bukan existing partner.)*
- [x] **Partnership status** — SURYA-SIAGA adalah prototype independen berbasis data publik pada tahap kompetisi; tidak ada klaim kerja sama/endorsement/validasi institusional/implementasi resmi dengan pihak mana pun kecuali bukti nyata diberikan kemudian. Lihat §5.4. *(Amandemen PROMPT 1.5.)*
- [x] **Problem positioning** — core problem adalah fragmentasi data multi-dimensi untuk pre-screening PLTS, bukan semata-mata rasio elektrifikasi; rasio elektrifikasi hanya evidence tambahan opsional. Lihat §3. *(Amandemen PROMPT 1.5.)*
- [x] **Status konseptual Data Confidence sebagai core product concept** — didefinisikan secara kualitatif (dimensi + kategori), rubrik kuantitatif tetap open decision. Lihat §12.1. *(Amandemen PROMPT 1.5.)*

---

## 20. Asumsi yang Masih Perlu Diverifikasi

- Ketersediaan dan aksesibilitas data GHI untuk Kubu Raya dari Global Solar Atlas atau NASA POWER.
- Ketersediaan data fasilitas kesehatan (puskesmas) dan pendidikan (sekolah) di Kubu Raya dengan koordinat yang dapat diverifikasi (sumber: Kemenkes, Kemendikdasmen, atau Pemda Kubu Raya).
- Ketersediaan data risiko bencana (kebakaran hutan/lahan, kekeringan) tingkat kecamatan/desa untuk Kubu Raya dari BNPB/InaRISK.
- Kebenaran dan status terkini seluruh angka historis PLTS Desa Sumber Agung, Batu Ampar (lihat §11) — harus ditelusuri ke sumber primer sebelum digunakan.
- Apakah PLN memiliki data PLTS eksisting/kapasitas yang dapat diakses publik untuk wilayah pilot.
- Apakah terdapat komunikasi/keterlibatan nyata dengan Pemda Kubu Raya, PLN, Dinas ESDM, atau Bappeda — **tidak boleh diasumsikan ada** kecuali dikonfirmasi eksplisit (lihat §5.4 Partnership Status).

---

*Dokumen ini adalah living document. Setiap perubahan pada positioning, model data, metode scoring, atau status proyek WAJIB direfleksikan di sini sebelum agent lain melanjutkan pekerjaan.*

## 21. Keputusan resmi Prompt 3 — 2026-09-14

Instruksi pengguna Prompt 3 mengunci pool EDU-001..007 dan HLT-001..003. Semua official_exact; 20 HF identity-only tetap audit, tanpa merge/scoring. Facility gate PASS. Koordinat HLT bersumber 2021; point-in-polygon pending.

Beneficiary PASS WITH DOCUMENTED LIMITATION dan FROZEN FOR MVP: EDU-001=994@2026-09-10, EDU-002=778@2026-09-05, EDU-005=46@2026-08-30, EDU-006=330@2026-08-30. Enam canonical lain NULL. Secondary bukan canonical; tidak memakai district population proxy. NULL bukan nol atau hukuman criticality kesehatan.

GSA primary solar spatial screening; CC BY 4.0 verified via external_manual_verification. Atribusi Global Solar Atlas 2.0 / World Bank Group / ESMAP / Solargis wajib. Tidak commit raster. NASA POWER supporting time-series / rough cross-check saja.

InaRISK hazard karhutla/kekeringan prioritas akuisisi; risk hanya fallback berlabel terpisah. IRBI kabupaten dan hotspot harian bukan discriminator site. Ini kebijakan akuisisi; kriteria/bobot/metode scoring final belum diputuskan.

Konteks PLTS diperluas menjadi Sumber Agung, Sungai Kerawang, Muara Tiga, Batu Ampar: historical existence dan serah terima 2021-12-30 (EV-F + handoff Prompt 3); BUMDes disebut/direncanakan 2021. Angka tentatif §11 tidak masuk canonical: capacity_kwp/commissioning_year/battery/current operation/current grid NULL; CF-001/CF-006 unresolved. Tidak ada hubungan suplai ke kandidat terverifikasi.

Status akhir **READY_WITH_LIMITATIONS**, alasan **WAITING_FOR_EXTERNAL_SOLAR_HAZARD_PACKAGE**. Prompt 4 boleh merancang metodologi dengan caveat; belum siap scoring/ranking berbasis nilai lengkap. Tidak ada normalisasi, AHP, MCDA final, Priority Score, Data Confidence atau coding aplikasi pada Prompt 3. Laporan: research/PROMPT_3_FINAL_DATA_ACQUISITION_REPORT.md.
