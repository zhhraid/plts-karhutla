# EXTERNAL_SOLAR_HAZARD_REQUESTS.md — Permintaan Akuisisi Solar &amp; Hazard

**Dibuat:** Prompt 3C, 2026-09-14.
**Alasan:** environment agent terkena `EGRESS_BLOCKED` untuk seluruh sumber solar dan hazard. Tidak ada data yang dibuat, tidak ada snippet yang dipakai mengisi nilai.

## Hasil Uji Akses (2026-09-14)

| Domain | Untuk | Hasil |
|---|---|---|
| `globalsolaratlas.info` | GHI + lisensi | ❌ EGRESS_BLOCKED |
| `inarisk.bnpb.go.id` | layer karhutla &amp; kekeringan | ❌ EGRESS_BLOCKED |
| `gis.bnpb.go.id` | ArcGIS REST services InaRISK | ❌ EGRESS_BLOCKED |

---

## 10 Titik Target

Seluruhnya `coordinate_quality = official_exact`, lolos validasi rentang dan bounding box sanity check.

| record_id | facility_name | latitude | longitude | district |
|---|---|---|---|---|
| EDU-001 | SMAN 1 SUNGAI RAYA | -0.0762 | 109.3758 | SUNGAI RAYA |
| EDU-002 | SMAN 1 SUNGAI KAKAP | -0.0565 | 109.2021 | SUNGAI KAKAP |
| EDU-003 | SMP NEGERI 1 TERENTANG | -0.3839 | 109.6277 | TERENTANG |
| EDU-004 | SMAN 1 KUBU | -0.4882 | 109.3812 | KUBU |
| EDU-005 | SD NEGERI 22 BATU AMPAR | -0.7245 | 109.5745 | BATU AMPAR |
| EDU-006 | SD NEGERI 07 BATU AMPAR | -0.7516 | 109.5388 | BATU AMPAR |
| EDU-007 | SMKN 1 BATU AMPAR | -0.7849 | 109.4548 | BATU AMPAR |
| HLT-001 | PUSKESMAS PADANG TIKAR | -0.68395 | 109.27088 | BATU AMPAR |
| HLT-002 | PUSKESMAS SUNGAI KERAWANG | -0.84319384 | 109.7554378 | BATU AMPAR |
| HLT-003 | PUSKESMAS KUBU | -0.50136262 | 109.3756266 | KUBU |

> ⚠️ **Koordinat HLT-001/002/003 berasal dari dataset Dinkes tahun 2021** (`coordinate_source_data_year = 2021`). Ekstraksi GHI/hazard pada titik-titik ini merepresentasikan lokasi per 2021. Catat konsekuensinya, jangan disajikan sebagai lokasi terkini.

> ⚠️ **Gunakan koordinat persis di atas.** Jangan membulatkan, jangan memakai centroid desa/kecamatan, jangan memakai titik alternatif dari layanan peta lain.

---

# REQ-SOL-01 — GHI per Titik Fasilitas (Global Solar Atlas)

**Prioritas:** TINGGI

### Exact data needed

Untuk **setiap** dari 10 titik di atas:

| Field | Catatan |
|---|---|
| `ghi_value` | Nilai GHI pada titik tersebut |
| `ghi_unit` | **Catat apa adanya dari sumber** (mis. kWh/m²/day). Jangan dikonversi |
| `spatial_resolution` | Resolusi data yang dipakai (diharapkan 9 arcsec / ~250 m) |
| `temporal_coverage` | Periode agregasi jangka panjang yang dinyatakan sumber |
| `data_year_or_period` | Periode data, mis. 1994–2024 — catat sebagaimana tertulis |
| `extraction_method` | Cara pengambilan: titik interaktif di peta, laporan PDF per-titik, atau ekstraksi dari GeoTIFF |
| `source_url` | URL persis halaman/dataset asal nilai |
| `retrieved_at` | Tanggal pengambilan |

### Preferred official source
Global Solar Atlas — `https://globalsolaratlas.info/` (World Bank/ESMAP/Solargis), `coordinate_source_type` setara `government_dataset`/authoritative technical (source_authority **B**).

### ⚠️ Verifikasi lisensi — bagian WAJIB dari request ini
Buka `https://globalsolaratlas.info/support/faq` dan halaman Terms/License, lalu catat verbatim: nama &amp; URL lisensi, izin penggunaan non-komersial/kompetisi, izin menyimpan **raster**, izin menyimpan **derived point values**, dan teks atribusi yang diwajibkan.
**Destination:** `data/raw/external_manual/<tanggal>/global_solar_atlas_license.md`
Sampai ini selesai: **raster tetap tidak boleh di-commit.**

### Acceptable fallback
- Laporan PDF per-titik dari GSA (menghasilkan nilai titik yang sama).
- Ekstraksi dari GeoTIFF resmi GSA menggunakan koordinat persis di atas, dengan metode ekstraksi dicatat.

### Unacceptable fallback
- ⛔ **NASA POWER sebagai pembeda spasial antar-site.** Resolusi parameter suryanya ~1°×1° (≈111 km) — seluruh Kubu Raya jatuh pada sel grid yang sama, sehingga nilainya **nol daya pembeda** antar fasilitas. Boleh dipakai hanya sebagai `supporting_time_series`.
- ⛔ Nilai GHI dari sumber sekunder/hasil pencarian.
- ⛔ Interpolasi manual, estimasi, atau nilai "rata-rata kabupaten" yang ditempelkan ke titik.
- ⛔ Centroid desa/kecamatan.

### Expected format
CSV satu baris per site, kolom sesuai `data/interim/solar_observations.csv`, dapat dicocokkan ke `record_id` dan `solar_observation_id` (SOL-001…SOL-010).

### Destination file
```
data/raw/external_manual/<tanggal>/solar_observations_external.csv
```

---

# REQ-HAZ-01 — Layer Karhutla &amp; Kekeringan per Titik (InaRISK/BNPB)

**Prioritas:** TINGGI

### Exact data needed

Untuk **setiap** dari 10 titik, **dua observasi** (total 20):

| Field | Catatan |
|---|---|
| `hazard_type` | `karhutla` atau `kekeringan` |
| **`metric_type`** | **`hazard`** bila sumber menyediakan **BAHAYA**; **`risk`** bila menyediakan **RISIKO**. **WAJIB diisi.** |
| `raw_class` | Kelas sebagaimana ditampilkan sumber: Rendah / Sedang / Tinggi. **Simpan apa adanya** |
| `raw_value` | Nilai numerik bila sumber menampilkannya |
| `unit_or_scale` | Skala yang dipakai (mis. 0–1), sebagaimana dinyatakan sumber |
| `dataset_year` | Tahun data layer |
| `geometry_or_raster_type` | Raster atau poligon |
| `extraction_method` | Cara pengambilan nilai pada titik |
| `source_url` | URL persis layer/service |

### 🔴 Aturan paling penting: HAZARD ≠ RISK

Ini bukan formalitas. **Bahaya** = kondisi biofisik ancaman. **Risiko** = bahaya × kerentanan ÷ kapasitas. Suatu area dapat **berbahaya tinggi namun berisiko rendah**, dan sebaliknya.

- Jangan mencampur keduanya dalam satu kolom.
- Jangan mengambil sebagian titik dari layer bahaya dan sebagian dari layer risiko.
- Bila kedua layer tersedia, **ambil keduanya sebagai observasi terpisah** dan isi `metric_type` masing-masing.
- InaRISK sendiri membedakan Bahaya, Kerentanan, Kapasitas, dan Risiko (EV-C, terverifikasi).

### ⛔ Jangan konversi kelas menjadi angka
Rendah/Sedang/Tinggi disimpan sebagai teks di `raw_class`. Konversi ke skala numerik adalah keputusan **metodologi**, bukan akuisisi, dan belum diambil.

### Preferred official source
1. InaRISK WebGIS — `https://inarisk.bnpb.go.id/` (layer Kebakaran Hutan dan Lahan; layer Kekeringan).
2. ArcGIS REST Services — `https://gis.bnpb.go.id/server/rest/services/inarisk` (untuk ekstraksi titik terprogram).

### Acceptable fallback
Unduhan resmi InaRISK (`inarisk.bnpb.go.id/portal/Unduh`) lalu ekstraksi titik lokal, dengan metode dicatat.

### Unacceptable fallback
- ⛔ **Skor IRBI kabupaten sebagai nilai per-site.** IRBI adalah indeks level kabupaten — nilainya identik untuk seluruh 10 site sehingga **nol daya pembeda**, dan skalanya belum terverifikasi (CF-003). Boleh dicatat sebagai konteks kabupaten, **tidak boleh** masuk `hazard_observations.csv`.
- ⛔ **Hotspot harian / titik panas** (SIPONGI, NASA FIRMS) sebagai structural hazard. Itu kejadian near-real-time, bukan risiko struktural jangka panjang. Tempatnya di `contextual_disaster_events.csv`, bukan di dataset scoring.
- ⛔ Nilai dari studi akademik sebagai pengganti layer resmi (hasilnya berbeda metrik — lihat CF-002).
- ⛔ Centroid desa/kecamatan.

### Expected format
CSV satu baris per (site × layer) = 20 baris, kolom sesuai `data/interim/hazard_observations.csv`, dapat dicocokkan ke `hazard_observation_id` (HAZ-001…HAZ-020).

### Destination file
```
data/raw/external_manual/<tanggal>/hazard_observations_external.csv
```

---

# REQ-GEO-01 (lanjutan) — Geometri Batas Administratif

**Prioritas:** SEDANG — masih terbuka sejak Prompt 3A.1.

Dibutuhkan untuk mengganti `point_in_polygon_status = pending` dengan validasi sahih. Detail lengkap ada di `research/MANUAL_ACQUISITION_REQUESTS.md` § REQ-GEO-01.

> Catatan: ketiadaan polygon **tidak** menurunkan `coordinate_quality` dan **tidak** memblokir REQ-SOL-01 maupun REQ-HAZ-01.

---

# REQ-CTX-01 *(opsional, prioritas RENDAH)* — Contextual Disaster Events

Hanya bila mudah diperoleh dan tidak memakan waktu. Kejadian karhutla/kabut asap/status darurat di Kubu Raya, dengan tanggal kejadian dan sumber.

**Destination:** `data/interim/contextual_disaster_events.csv`
**⛔ Tidak boleh** masuk structural site scoring dataset dalam kondisi apa pun.

---

## Definition of Done

- [ ] REQ-SOL-01: GHI untuk ≥8 dari 10 site + hasil verifikasi lisensi;
- [ ] REQ-HAZ-01: karhutla **dan** kekeringan untuk ≥8 dari 10 site, dengan `metric_type` terisi pada setiap baris;
- [ ] Seluruh nilai menyertakan `source_url`, tahun data, dan metode ekstraksi;
- [ ] Tidak ada nilai yang berasal dari centroid, IRBI kabupaten, hotspot harian, atau NASA POWER sebagai pembeda spasial.
