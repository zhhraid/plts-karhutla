# SOURCE_CONFLICTS.md — Konflik Antar-Sumber SURYA-SIAGA

**Revisi:** Prompt 2.5 (Evidence Verification & Research Repair), 2026-09-12.
**Perubahan utama:** setiap konflik direklasifikasi menggunakan taksonomi baru — konflik nyata dipisahkan dari perbedaan definisi/metrik/scope/tahun dan dari kemungkinan artefak ringkasan pencarian.

Sesuai `PROJECT_CONTEXT.md` §10 poin 6: **"Jangan memilih angka ketika dua sumber bertentangan tanpa mencatat konflik."** Tidak satu pun konflik di bawah diselesaikan secara sepihak.

> ⚠️ **Status verifikasi pass Prompt 2.5:** WebFetch tetap diblokir oleh kebijakan egress organisasi untuk seluruh domain yang diuji (7/7 gagal, termasuk `kalbar.bpk.go.id`, `inarisk.bnpb.go.id`, `power.larc.nasa.gov`). **Tidak satu pun konflik dapat diselesaikan oleh environment agent ini.** Catatan keterbatasan ini sengaja dipertahankan.
>
> ✅ **Pembaruan Prompt 2.6 (external verification):** sebagian sumber telah diverifikasi **di luar environment agent ini** (`verification_method: external_manual_verification`). Dampaknya terhadap konflik: **CF-002 dikonfirmasi** sebagai `DIFFERENT_METRIC` oleh BNPB sendiri; **CF-004 sebagian terselesaikan**; **CF-006 baru ditemukan**. CF-001, CF-003, dan CF-005 **tetap terbuka**.

---

## Taksonomi Klasifikasi Konflik

| Klasifikasi | Arti |
|---|---|
| `TRUE_CONFLICT` | Dua sumber membahas metrik, scope, dan tahun yang SAMA tapi memberi nilai berbeda. Ini konflik nyata. |
| `DIFFERENT_METRIC` | Nilai mengukur hal berbeda (mis. bahaya vs risiko). **Tidak directly comparable** — bukan konflik numerik. |
| `DIFFERENT_SCOPE` | Cakupan geografis/unit berbeda (mis. satu desa vs agregat tiga desa). |
| `DIFFERENT_YEAR` | Nilai berbeda karena periode berbeda. |
| `METHODOLOGY_DIFFERENCE` | Metode pengukuran/perhitungan berbeda. |
| `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` | Perbedaan mungkin berasal dari proses ringkasan mesin pencari, belum tentu ada di sumber asli. Belum boleh dianggap konflik sumber. |
| `UNRESOLVED` | Belum cukup bukti untuk mengklasifikasi secara definitif. |

---

## CF-001 — Kapasitas PLTS Komunal 2018, Kecamatan Batu Ampar

| Field | Isi |
|---|---|
| **Klasifikasi (Prompt 2.5)** | `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` + kandidat `DIFFERENT_SCOPE` → status akhir **`UNRESOLVED`** |
| **Klasifikasi sebelumnya (Prompt 2)** | "OPEN — requires_verification" (tanpa pembedaan jenis konflik) |

- **topic:** Kapasitas PLTS Komunal 2018 di Sumber Agung / Muara Tiga / Sungai Kerawang
- **source_A:** ringkasan WebSearch mengutip `kalbar.antaranews.com/berita/542859` → kapasitas awal 100, bertambah menjadi **250**
- **data_year_A:** tidak diketahui
- **source_B:** ringkasan WebSearch mengutip `ebtke.esdm.go.id/post/2023/06/22/3515` → kapasitas awal 100, bertambah menjadi **150**
- **data_year_B:** artikel 2023 (tahun data tidak diketahui)
- **satuan:** **tidak diketahui pada kedua sumber** — angka muncul tanpa satuan eksplisit di snippet. Dugaan kWp belum terkonfirmasi.

**Analisis reklasifikasi:**
1. **Mengapa `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` didahulukan:** kedua "sumber" ini tidak pernah dibuka. Keduanya berasal dari ringkasan mesin pencari yang mungkin merangkum halaman yang sama, atau salah membaca angka dari tabel/kalimat yang sama. Menyebut ini "dua sumber kredibel yang bertentangan" saat ini **belum dapat dibuktikan** — belum tentu ada konflik di sumber aslinya.
2. **Mengapa `DIFFERENT_SCOPE` adalah kandidat kuat:** program ini mencakup **tiga desa**. Angka 150 dan 250 bisa jadi merujuk pada agregat berbeda (mis. 2 desa vs 3 desa), atau satu desa vs total. Angka "312 rumah tangga" juga tidak jelas apakah agregat 3 desa atau satu desa.
3. **Mengapa BUKAN `TRUE_CONFLICT`:** syarat TRUE_CONFLICT adalah metrik, scope, dan tahun yang sama — **tidak satu pun dari ketiganya diketahui** untuk kedua angka ini.

**Keputusan sesuai instruksi §C Prompt 2.5:**
> Tidak memilih 150 maupun 250. **`existing_plts_capacity_kwp` tetap `NULL`** dalam acquisition plan dan dalam dataset apa pun sampai sumber asli dibuka dan berhasil menjawab: angka merujuk pada apa, satuannya apa, desa mana, individual atau agregat, tahun berapa, dan apakah itu kapasitas terpasang atau angka lain (mis. nilai hibah, jumlah panel, daya per unit).

- **recommended_action:** buka `kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/` (sumber Tier A utama) secara manual, lalu kedua URL di atas. Catat kutipan verbatim beserta satuan dan cakupannya.
- **status:** **UNRESOLVED** — `proposal_usage_status: DO_NOT_USE` untuk seluruh angka kapasitas.

---

## CF-002 — Klasifikasi karhutla Kabupaten Kubu Raya

| Field | Isi |
|---|---|
| **Klasifikasi final (Prompt 2.6)** | ✅ **`DIFFERENT_METRIC — NOT DIRECTLY COMPARABLE`** — dikonfirmasi external verification |
| **Klasifikasi (Prompt 2.5)** | `DIFFERENT_METRIC` (primer) + `METHODOLOGY_DIFFERENCE` + `DIFFERENT_YEAR` (sekunder) |
| **Klasifikasi sebelumnya (Prompt 2)** | "conflicting" — **klasifikasi ini KELIRU dan diperbaiki** |

> ✅ **Konfirmasi eksternal (EV-C, `external_manual_verification`):** InaRISK/BNPB **secara eksplisit membedakan Bahaya, Kerentanan, Kapasitas, dan Risiko** pada platformnya sendiri. Reklasifikasi Prompt 2.5 — yang saat itu hanya berupa inferensi analitis — kini **didukung oleh pernyataan lembaga sumbernya**. Aturan yang berlaku: **HAZARD ≠ RISK**; jangan membandingkan atau menggabungkan angka bahaya dan risiko seolah metrik yang sama. Ini **bukan** `TRUE_CONFLICT`.

- **source_A:** Wijaya, Akbar &amp; Romiyanto — jurnal GEOGRAPHY (UMMAT) → **BAHAYA (hazard)**: Rendah 5,64%, Sedang 52,25%, Tinggi 42,11% (unit analisis: Kesatuan Hidrologis Gambut/KHG)
- **source_B:** Muharrama &amp; Widjonarko (2023), Jurnal Teknik PWK UNDIP → **RISIKO (risk)**: didominasi kelas Rendah 44,60% (data kejadian 2015–2019)

**Analisis reklasifikasi (sesuai instruksi §D):**

Kedua angka ini **TIDAK mengukur hal yang sama** dan karenanya **tidak directly comparable**:

- **Bahaya (hazard)** = probabilitas/intensitas ancaman berdasarkan kondisi biofisik semata (kedalaman gambut, tutupan lahan, elevasi). Tidak memasukkan manusia atau kapasitas penanggulangan.
- **Risiko (risk)** = fungsi dari Bahaya × Kerentanan × (1/Kapasitas), sesuai kerangka InaRISK (EV-028). Suatu area bisa **berbahaya tinggi tapi berisiko rendah** apabila kerentanannya rendah (sedikit penduduk/aset terpapar) atau kapasitas penanggulangannya tinggi.

Karena itu, temuan "bahaya tinggi 42%" (A) dan "risiko dominan rendah 44,6%" (B) **dapat sepenuhnya benar secara bersamaan** — tidak ada kontradiksi logis. Menyebut ini "konflik" pada Prompt 2 adalah kesalahan klasifikasi yang diperbaiki di revisi ini.

Faktor sekunder yang juga membedakan: unit analisis berbeda (KHG vs wilayah administratif), periode data berbeda, dan skema kelas berbeda.

- **recommended_action:** JANGAN menggabungkan/merata-ratakan. Jika keduanya dipakai, tampilkan **terpisah dengan label metrik eksplisit** ("bahaya karhutla" vs "risiko karhutla") beserta tahun data dan unit analisisnya. Baca metodologi lengkap kedua paper sebelum salah satunya dipakai sebagai basis kriteria.
- **implikasi produk:** SURYA-SIAGA harus memutuskan secara eksplisit apakah kriteria `wildfire_risk` di model data §8 `PROJECT_CONTEXT.md` mengacu pada **bahaya** atau **risiko** — keduanya tidak bisa dipertukarkan. Keputusan ini belum diambil dan masuk unresolved decisions.
- **status:** **DIFFERENT_METRIC — bukan konflik numerik.** Tetap `UNRESOLVED` untuk pemilihan metrik mana yang dipakai produk.

---

## CF-003 — Skala indeks IRBI vs skala layer InaRISK

| Field | Isi |
|---|---|
| **Klasifikasi (Prompt 2.5)** | **`DIFFERENT_METRIC`** (dugaan kuat) + `UNRESOLVED` (dokumentasi belum dapat diverifikasi) |
| **Klasifikasi sebelumnya (Prompt 2)** | "OPEN — requires_verification" |

- **source_A:** Buku IRBI 2023/2024 (BNPB) → skor Kubu Raya **34,21** (2024) / **36,00** (2023), kelas "TINGGI"
- **source_B:** metodologi umum InaRISK → kelas risiko pada skala **0–1** (Rendah 0–0,3; Sedang 0,3–0,6; Tinggi 0,6–1,0)

**Analisis reklasifikasi (sesuai instruksi §E):**

> ⚠️ **Larangan eksplisit:** JANGAN berasumsi 34,21 = 0,3421 atau bentuk transformasi apa pun. Kesamaan digit antara "34,21" dan rentang 0,3–0,6 adalah kebetulan yang menggoda dan **tidak boleh dijadikan dasar konversi**. Perlu dicatat juga bahwa jika transformasi naif itu dilakukan, 0,3421 justru akan jatuh di kelas **"Sedang"**, bukan "Tinggi" seperti yang dilaporkan IRBI — indikasi tambahan bahwa kedua skala ini memang bukan skala yang sama.

Dugaan (belum terverifikasi): IRBI adalah **indeks komposit multi-bahaya pada level kabupaten/kota** yang dihitung dan dikelaskan dengan skala sendiri, sedangkan layer InaRISK adalah **indeks per-bahaya pada level spasial (piksel/area)** dengan skala 0–1. Keduanya adalah produk berbeda dari lembaga yang sama.

**Hal yang harus diverifikasi manual sebelum IRBI dipakai sama sekali:**
1. Definisi indeks IRBI dan rumusnya;
2. Range/skala resmi (0–100? 0–300? lainnya);
3. Level analisis (kabupaten? kecamatan?);
4. Batas kategori Rendah/Sedang/Tinggi pada skala tersebut;
5. Hubungan formal antara IRBI dan layer InaRISK.

**Keputusan sesuai instruksi §E:**
> Karena kelima poin di atas belum jelas, **IRBI TIDAK BOLEH digunakan sebagai site-level scoring input.**

**Catatan tambahan yang berdiri sendiri dari isu verifikasi:** meskipun nanti terverifikasi penuh, IRBI adalah indeks **level kabupaten**. Seluruh kandidat fasilitas SURYA-SIAGA berada **di dalam satu kabupaten yang sama** (Kubu Raya), sehingga nilai IRBI akan identik untuk semua kandidat dan **secara matematis tidak memiliki daya pembeda apa pun** dalam skoring antar-lokasi. Perannya yang tepat adalah **konteks kabupaten**, bukan input skoring per-situs — ini berlaku terlepas dari hasil verifikasi.

- **status:** **UNRESOLVED** — `proposal_usage_status: SAFE_AS_CONTEXT_ONLY` (setelah verifikasi manual), `DO_NOT_USE` sebagai input skoring per-situs.

---

## CF-004 — Satuan parameter NASA POWER `ALLSKY_SFC_SW_DWN`

| Field | Isi |
|---|---|
| **Klasifikasi (Prompt 2.5)** | **`POSSIBLE_SEARCH_SUMMARY_ARTIFACT`** + kandidat `DIFFERENT_METRIC` → **`UNRESOLVED`** |

- **source_A:** sebagian ringkasan pencarian menyebut Wh/m²
- **source_B:** konvensi umum untuk API harian menyebut kWh/m²/day

**Analisis:** NASA POWER menyediakan beberapa temporal API (hourly/daily/monthly/climatology) yang memang dapat memiliki satuan berbeda untuk parameter yang sama — sehingga ini kemungkinan besar `DIFFERENT_METRIC` (endpoint berbeda), bukan kontradiksi. Namun karena kedua "sumber" berasal dari ringkasan pencarian dan bukan dari parameter dictionary resmi, `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` didahulukan.

- **recommended_action:** buka parameter dictionary resmi NASA POWER dan catat satuan per endpoint temporal.
- **status:** **UNRESOLVED** — satuan tidak boleh diasumsikan dalam perhitungan apa pun. (Catatan: NASA POWER sudah direklasifikasi sebagai sumber validasi time-series, bukan sumber spasial — lihat `DATA_ACQUISITION_PLAN.md`, sehingga dampak konflik ini berkurang.)

---

## CF-005 — Lokasi "PLTS Kubu" (artikel Mongabay 2016)

| Field | Isi |
|---|---|
| **Klasifikasi (Prompt 2.5)** | **`UNRESOLVED`** (ambiguitas identifikasi, bukan konflik nilai) |

- Judul artikel menyebut "PLTS Kubu"; "Kubu" dapat merujuk pada **Kecamatan Kubu** (kecamatan nyata di Kabupaten Kubu Raya, berbeda dari Kecamatan Batu Ampar) atau bentuk pendek "Kubu Raya", atau lokasi lain.
- Halaman gagal dibuka pada Prompt 2 maupun Prompt 2.5.
- **status:** **UNRESOLVED** — `proposal_usage_status: DO_NOT_USE` sampai lokasi dipastikan. Jika nanti terkonfirmasi berada di Kubu Raya, ini berpotensi menjadi preseden historis penting ("PLTS terbengkalai") yang justru memperkuat argumen perlunya assessment pra-deployment — tapi tidak boleh dipakai sebelum dipastikan.

---

## CF-006 — Tahun operasi (2018) vs tahun penyerahan aset (2021), PLTS Batu Ampar

**(Konflik baru, ditemukan Prompt 2.6)**

| Field | Isi |
|---|---|
| **Klasifikasi** | `DIFFERENT_METRIC` (dugaan kuat: dua peristiwa berbeda) → **`UNRESOLVED`** |

- **source_A:** EV-F, BPK Perwakilan Kalbar, terbit **30 Desember 2021** — `verified_primary` via `external_manual_verification`. Memverifikasi **penyerahan hibah aset PLTS** kepada tiga desa pada **2021**.
- **source_B:** EV-038/039, `snippet_only` — menyebut program PLTS Komunal "sejak **2018**".

**Analisis:** kedua tahun ini kemungkinan besar **tidak bertentangan** melainkan menandai **dua peristiwa berbeda** dalam siklus hidup aset yang sama: pembangunan/operasi (2018) dan serah terima aset ke pemerintah desa/BUMDes (2021). Pola ini lazim dalam proyek infrastruktur pemerintah. Namun kemungkinan lain belum tertutup — misalnya angka 2018 dari snippet memang keliru, atau kedua sumber merujuk program yang berbeda.

**Konsekuensi untuk model data:**
- `asset_handover_year = 2021` → **`verified_primary`**, boleh dipakai dengan label historis.
- `commissioning_year` → **tetap `unverified`**, tidak boleh diisi 2018 tanpa verifikasi terpisah. Field ini **`NULL`** sampai ada sumber primer yang menyatakan tahun mulai operasi.
- **Jangan** menyajikan 2021 sebagai tahun operasi, dan **jangan** menyajikan 2018 sebagai fakta.

**recommended_action:** cari dokumen pengadaan/serah terima atau laporan program ESDM/Pemkab yang menyatakan tahun operasi secara eksplisit.

**status:** **UNRESOLVED**

---

## Ringkasan Reklasifikasi

| ID | Klasifikasi Prompt 2 | Klasifikasi Prompt 2.5 | **Status Prompt 2.6** |
|---|---|---|---|
| CF-001 | "conflicting" | `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` + kandidat `DIFFERENT_SCOPE` | ❌ **UNRESOLVED** — `capacity_kwp` tetap **NULL**. Diperkuat: EV-F memverifikasi artikel BPK **tanpa** memuat angka 150/250, memperkuat dugaan artefak ringkasan |
| CF-002 | "conflicting" | `DIFFERENT_METRIC` (koreksi) | ✅ **DIFFERENT_METRIC — NOT DIRECTLY COMPARABLE**, dikonfirmasi EV-C |
| CF-003 | "requires_verification" | `DIFFERENT_METRIC` (dugaan) | ❌ **UNRESOLVED** — IRBI tetap **dilarang** sebagai site-level scoring input pada MVP |
| CF-004 | "requires_verification" | `POSSIBLE_SEARCH_SUMMARY_ARTIFACT` | ⚠️ **SEBAGIAN** — resolusi terkoreksi (EV-E: parameter surya ~1°×1°, parameter meteorologis berbeda; angka lama 0,5°×0,625° adalah grid meteorologis). **Satuan masih terbuka** |
| CF-005 | "NOT_FOUND/ambiguous" | `UNRESOLVED` (ambiguitas identifikasi) | ❌ **UNRESOLVED** |
| **CF-006** | — | — | ❌ **UNRESOLVED (baru)** — `commissioning_year` (2018?) vs `asset_handover_year` (2021, terverifikasi) |

### Temuan lintas-pass

1. **Nol `TRUE_CONFLICT` terkonfirmasi.** Setelah dua pass audit, tidak satu pun "konflik" terbukti sebagai dua sumber kredibel yang benar-benar bertentangan pada metrik, scope, dan tahun yang sama. Yang ada: perbedaan metrik (CF-002, CF-004, CF-006), perbedaan scope, dan artefak ringkasan pencarian.
2. **External verification mengurangi konflik, bukan menambah.** CF-002 dikonfirmasi bukan konflik; CF-004 sebagian terselesaikan. Satu konflik baru (CF-006) muncul justru karena verifikasi eksternal memberi **tanggal yang lebih presisi** (30 Desember 2021) — ini pertanda kualitas riset naik, bukan turun.
3. **Yang masih benar-benar terbuka dan material: CF-001** (kapasitas) **dan CF-006** (tahun operasi). Keduanya menyangkut PLTS eksisting, dan keduanya berakibat sama: **field tersebut `NULL` sampai terverifikasi.**
