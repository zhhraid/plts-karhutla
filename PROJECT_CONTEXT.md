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
9. Meng-update dokumen ini apabila ada keputusan resmi baru (lihat §12 Unresolved Decisions — pindahkan item ke bagian "resolved" dengan referensi keputusan).
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

## 3. Positioning

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

## 4. Wilayah Pilot

Pilot awal: **Kabupaten Kubu Raya**, Kalimantan Barat.

**DILARANG** mengklaim:

> ❌ "Kubu Raya adalah lokasi PLTS terbaik di Indonesia."

**WAJIB** menggunakan framing:

> ✅ "Kubu Raya digunakan sebagai pilot untuk menguji metode prioritisasi SURYA-SIAGA."

---

## 5. Target MVP (Cakupan Data)

- Gunakan sekitar **10–15 lokasi nyata**.
- Komposisi ideal:
  - beberapa lokasi PLTS eksisting;
  - ±5 puskesmas;
  - ±5 sekolah/fasilitas publik.
- Prinsip: **lebih baik 10 lokasi dengan data kuat daripada 500 lokasi dengan data lemah.**

Status saat ini: kandidat fasilitas dan dataset pilot **BELUM final** (lihat §11 Status Proyek).

---

## 6. Model Data Inti

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

## 7. Sumber Data

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

## 8. Aturan Integritas Data (MUTLAK)

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

## 9. Konteks Khusus: PLTS Desa Sumber Agung, Batu Ampar

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

## 10. Decision Model (Konseptual)

Pendekatan: **Multi-Criteria Decision Analysis (MCDA)**.

Kemungkinan metode: **AHP + Weighted Scoring** — namun ini adalah kandidat metode, bukan keputusan final.

> ⚠️ **BOBOT FINAL BELUM DITENTUKAN.** Agent DILARANG membuat bobot permanen secara sembarangan.

Sistem secara konseptual memiliki komponen berikut (nama-nama ini adalah terminologi resmi produk — jangan diubah tanpa dokumentasi):

1. **Solar Suitability Score**
2. **Resilience Need Score**
3. **Priority Score**
4. **Data Confidence**

> ⚠️ **Data Confidence TIDAK otomatis menjadi bagian dari Priority Score.** Keduanya ditampilkan terpisah kecuali ada keputusan eksplisit yang mengubah ini.

### Jenis Rekomendasi (MVP)

- **New Deployment Assessment**
- **Expansion Assessment**
- **Needs Data Verification**

Dilarang memberikan instruksi engineering final (mis. "Bangun PLTS 200 kWp") kecuali tersedia kajian teknis yang benar dan terdokumentasi sebagai sumber.

---

## 11. Fitur

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

## 12. Tech Stack Preferensi

| Layer | Pilihan |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Maps | MapLibre GL JS atau Leaflet |
| Database | Supabase PostgreSQL |
| GIS | PostGIS (apabila memang diperlukan) |
| Data processing | Python, Pandas, GeoPandas, Rasterio, QGIS (validasi manual) |
| Deployment | Vercel + Supabase |

---

## 13. Prinsip Engineering

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

## 14. Prinsip Utama Produk

> **TRANSPARANSI LEBIH PENTING DARIPADA PRESISI PALSU.**

- Jika data lama → katakan lama.
- Jika data proxy → katakan proxy.
- Jika data hilang → katakan tidak tersedia.
- Jika rekomendasi awal → katakan preliminary.

---

## 15. Aturan bagi Semua Agent Berikutnya

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

---

## 16. Status Proyek (Saat Ini BELUM Final)

Item-item berikut **belum final** — jangan berasumsi sudah ditentukan:

- Kandidat fasilitas (daftar lokasi pilot);
- Dataset pilot (nilai-nilai aktual per fasilitas);
- Final weights (bobot AHP/scoring);
- Formula Priority Score;
- Final UI;
- Final database schema.

---

## 17. Unresolved Decisions (Log)

Daftar keputusan yang masih terbuka. Ketika sebuah keputusan dibuat secara resmi, pindahkan entrinya ke bagian "Resolved" dengan tanggal dan referensi (commit/PR/diskusi), dan update bagian terkait di dokumen ini.

### Open

- [ ] Metode MCDA final: apakah benar AHP + Weighted Scoring, atau metode lain?
- [ ] Bobot final untuk Solar Suitability Score, Resilience Need Score, dan Priority Score.
- [ ] Formula matematis Priority Score (apakah linear weighted sum, atau non-linear?).
- [ ] Apakah dan bagaimana Data Confidence ditampilkan di UI relatif terhadap Priority Score.
- [ ] Daftar final 10–15 lokasi pilot beserta sumber data untuk masing-masing field.
- [ ] Skema database final (tabel, relasi, constraint) di Supabase PostgreSQL.
- [ ] Apakah PostGIS benar-benar diperlukan untuk MVP atau cukup lat/long sederhana.
- [ ] Status verifikasi data historis PLTS Desa Sumber Agung, Batu Ampar (belum diverifikasi ke sumber primer).
- [ ] Desain UI final untuk peta, site insight, dan site comparison.
- [ ] Definisi kuantitatif "wildfire_risk" dan "drought_risk" (skala, sumber, metodologi — kemungkinan dari InaRISK atau sumber Tier 1 lain).

### Resolved

_(belum ada — akan diisi seiring keputusan resmi dibuat)_

---

## 18. Asumsi yang Masih Perlu Diverifikasi

- Ketersediaan dan aksesibilitas data GHI untuk Kubu Raya dari Global Solar Atlas atau NASA POWER.
- Ketersediaan data fasilitas kesehatan (puskesmas) dan pendidikan (sekolah) di Kubu Raya dengan koordinat yang dapat diverifikasi (sumber: Kemenkes, Kemendikdasmen, atau Pemda Kubu Raya).
- Ketersediaan data risiko bencana (kebakaran hutan/lahan, kekeringan) tingkat kecamatan/desa untuk Kubu Raya dari BNPB/InaRISK.
- Kebenaran dan status terkini seluruh angka historis PLTS Desa Sumber Agung, Batu Ampar (lihat §9) — harus ditelusuri ke sumber primer sebelum digunakan.
- Apakah PLN memiliki data PLTS eksisting/kapasitas yang dapat diakses publik untuk wilayah pilot.

---

*Dokumen ini adalah living document. Setiap perubahan pada positioning, model data, metode scoring, atau status proyek WAJIB direfleksikan di sini sebelum agent lain melanjutkan pekerjaan.*
