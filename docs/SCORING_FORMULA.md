# SCORING_FORMULA.md — Formula Skoring SURYA-SIAGA

**Implementasi:** `scripts/build_master_dataset.py`. Dokumen ini harus selalu cocok dengan kode.

---

## 1. Bobot Baseline

| Dimensi | Bobot |
|---|---|
| Solar Suitability | 30% |
| Social Impact | 25% |
| Facility Criticality | 20% |
| Resilience Need | 25% |

> ⚠️ **MVP DESIGN ASSUMPTION, bukan hasil AHP tervalidasi ahli.** Configurable via `BASELINE_WEIGHTS`.

## 2. Normalisasi per Dimensi (skala 0–100)

### 2.1 Social Impact — log10 + min-max ke [10, 100]

```
social_score_i = 10 + (log10(v_i) − log10(v_min)) / (log10(v_max) − log10(v_min)) × 90
```
dihitung hanya atas nilai **canonical** yang tersedia.

**Mengapa log10, bukan min-max linear:** rentang nilai 46–994 (≈21×). Min-max linear membuat SDN 22 Batu Ampar (46 siswa) hampir tak berkontribusi sementara SMAN 1 Sungai Raya (994) mendominasi. Log memampatkan rentang sehingga perbedaan urutan besaran tetap terbaca tanpa satu sekolah besar menenggelamkan yang lain.

**Mengapa floor 10, bukan 0:** dengan min-max biasa, nilai terkecil menjadi **tepat 0**. Dalam weighted sum, 0 tidak dapat dibedakan dari "tidak ada data" — persis kebingungan yang ingin dicegah aturan NULL≠0. Floor 10 menjaga "terkecil yang terukur" tetap berbeda dari "tidak diketahui".

**Mengapa bukan percentile/rank:** dengan n=4, rank menghasilkan hanya 4 nilai diskret dan membuang besaran sebenarnya — 46 siswa dan 994 siswa hanya berjarak 3 peringkat.

Nilai aktual: EDU-001 = 100,00 · EDU-002 = 92,82 · EDU-006 = 67,71 · EDU-005 = 10,00.

### 2.2 Resilience Need — ordinal kelas bahaya

| Kelas | Skor |
|---|---|
| Rendah | 33 |
| Sedang | 67 |
| Tinggi | 100 |

Diterapkan hanya pada observasi dengan `scoring_eligibility = provisional_district_proxy`. Kekeringan (`context_only_not_site_scoring`) **tidak** masuk.

> Mapping alternatif berbasis fraksi luas area bahaya Tinggi diuji di `research/SCORING_SENSITIVITY_ANALYSIS.md` §3 dan mengubah peringkat secara substansial. Mapping tersebut **belum diadopsi** dan memerlukan keputusan manusia.

### 2.3 Facility Criticality — aturan tipe

Puskesmas = 100 · Sekolah = 70. Rasional di `docs/DECISION_METHODOLOGY.md` §5.

### 2.4 Solar Suitability — belum aktif

`solar_score = ghi_value` bila tersedia. Saat ini **NULL di 10/10 situs**.

> ⛔ **DILARANG:** menebak GHI, memperkirakan dari warna peta, mengganti dengan NASA POWER sebagai pembeda spasial, atau memberi skor 0.

## 3. Priority Score — Weighted Sum dengan Renormalisasi

Misal `P` = himpunan dimensi yang **tersedia** untuk situs tersebut:

```
available_weight_sum      = Σ_{i∈P} w_i
priority_score            = Σ_{i∈P} (score_i × w_i) / available_weight_sum
available_weight_fraction = available_weight_sum / Σ_{semua} w_i
```

Dimensi yang hilang **tidak masuk pembilang maupun penyebut**. Tidak pernah diisi 0.

### Minimum coverage

Skor numerik diterbitkan **hanya bila**:

```
|P| ≥ 2   DAN   "criticality" ∈ P
```

Jika tidak → `priority_score = NULL`, `score_status = INSUFFICIENT_DATA`. Tidak ada angka yang diterbitkan.

### Contoh terhitung

**EDU-001** (solar hilang; social 100, criticality 70, resilience 100):
```
available = 25 + 20 + 25 = 70   (fraction 0.70)
score = (100×25 + 70×20 + 100×25) / 70 = 6400 / 70 = 91.43
```

**HLT-001** (solar &amp; social hilang; criticality 100, resilience 67):
```
available = 20 + 25 = 45   (fraction 0.45)
score = (100×20 + 67×25) / 45 = 3675 / 45 = 81.67
```

### ⚠️ Konsekuensi yang harus disadari

Renormalisasi membuat situs dinilai **hanya pada dimensi yang kebetulan dimilikinya**. Akibatnya situs dengan nilai terukur rendah dapat berperingkat **di bawah** situs yang dimensinya sekadar tidak diketahui (kasus EDU-005 vs EDU-007). Skor dengan `available_weight_fraction` berbeda **tidak sepenuhnya sebanding** — kolom tersebut disediakan agar perbedaan basis ini terlihat, bukan tersembunyi.

## 4. Score Status

| Status | Kondisi |
|---|---|
| `FINAL_ENOUGH_FOR_MVP` | keempat dimensi tersedia |
| `PROVISIONAL_MISSING_SOLAR` | solar hilang, social tersedia |
| `PROVISIONAL_MISSING_SOCIAL` | social hilang, solar tersedia |
| `PROVISIONAL_LIMITED_HAZARD` | solar &amp; social tersedia, bahaya terbatas |
| `NEEDS_DATA_VERIFICATION` | solar **dan** social keduanya hilang |
| `INSUFFICIENT_DATA` | minimum coverage tidak terpenuhi → tanpa angka |

Distribusi saat ini: `PROVISIONAL_MISSING_SOLAR` = 4 · `NEEDS_DATA_VERIFICATION` = 6.

> Skor provisional **tidak boleh** ditampilkan sebagai hasil ilmiah final.

## 5. Yang Dijamin Validator

`scripts/validate_master_dataset.py` — 12 pemeriksaan, seluruhnya lolos:
record_id unik · semua situs berkoordinat · **tidak ada konversi NULL→0** · tidak ada dimensi bernilai tepat 0 · priority dalam 0–100 · enum confidence/recommendation/status valid · `missing_data` cocok dengan kolom skor kosong · skor numerik hanya saat minimum coverage terpenuhi · confidence terpisah dari priority · JSON dan CSV konsisten.
