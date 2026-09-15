# DECISION_ENGINE_IMPLEMENTATION.md — SURYA-SIAGA

Status: Prompt 6. Data layer, decision engine dan unit test terimplementasi.

Dokumen ini menjelaskan **bagaimana** metodologi diimplementasikan di
TypeScript. Metodologinya sendiri tetap didefinisikan di
`docs/DECISION_METHODOLOGY.md`, `docs/SCORING_FORMULA.md`,
`docs/DATA_CONFIDENCE_METHOD.md`, dan `docs/RECOMMENDATION_LOGIC.md`. Tidak ada
formula baru yang diperkenalkan di sini.

---

## 1. Pipeline data aplikasi

```
data/interim/*.csv
   → scripts/build_master_dataset.py     (scoring, satu-satunya produsen angka)
   → scripts/validate_master_dataset.py  (12 pemeriksaan; gagal = berhenti)
   → scripts/sync-app-data.mjs           (salin ke public/data/)
   → src/lib/data/staticFileSource.ts    (adapter)
   → src/lib/data/index.ts               (satu titik binding)
   → Server Components & API routes
```

Satu perintah: `npm run data:build`. Sinkronisasi hanya berjalan setelah
validator lolos, sehingga aplikasi tidak pernah menyajikan dataset yang belum
tervalidasi.

**Tidak ada data yang di-hardcode di komponen React.** Seluruh angka pada
seluruh halaman berasal dari satu berkas
`public/data/site_master_dataset.json`.

### 1.1 Field baru pada dataset

Build script kini juga menuliskan fakta-fakta yang menjadi **input** rubrik
Data Confidence dan aturan rekomendasi:

| Field | Asal |
|---|---|
| `coordinate_quality`, `coordinate_source_data_year` | inventaris fasilitas |
| `beneficiary_verification_status`, `beneficiary_variance_recorded` | observasi beneficiary |
| `karhutla_scoring_eligibility` | observasi bahaya |
| `existing_asset_linked`, `existing_asset_village`, `existing_asset_link_established` | aset energi eksisting |
| `confidence_points` | poin rubrik (diagnostik) |

Tidak ada nilai baru yang dibuat — seluruhnya disalin apa adanya dari lapis
interim. Tujuannya dua: aplikasi dapat **menjelaskan** kategori confidence
alih-alih meminta pengguna memercayainya, dan uji paritas (§6) dapat
membuktikan kedua implementasi sepakat.

---

## 2. Data access layer

`src/lib/data/index.ts` — titik masuk tunggal.

| Fungsi | Keterangan |
|---|---|
| `getAllSites()` | seluruh situs (`getSites` = alias) |
| `getSiteById(id)` | satu situs, atau `null` |
| `getSitesByDistrict(d)` | perbandingan kecamatan case-insensitive |
| `getSitesByFacilityType(t)` | Sekolah / Puskesmas |
| `querySites(filters, sort)` | filter lalu sort |
| `getPrioritySummary(filters)` | ringkasan prioritas |
| `getConfidenceSummary(filters)` | ringkasan keyakinan data |
| `getDistricts()` | daftar kecamatan unik |
| `getRankedSites()` | dense ranking |

Predikat murni berada di `src/lib/data/query.ts`, terpisah dari I/O, sehingga
adapter database di masa depan dapat mendorong predikat yang sama ke SQL tanpa
mengubah pemanggil mana pun.

### 2.1 Determinisme

Seluruh operasi deterministik. Setiap comparator memiliki **total order**:
kunci yang sama selalu jatuh ke `recordId`, sehingga hasil tidak pernah
bergantung pada urutan masukan. Diuji dengan menyortir masukan dan
kebalikannya, lalu membandingkan hasilnya.

Filter kosong berarti "tanpa batasan", bukan "tidak cocok apa pun" — kekeliruan
yang akan membuat UI menampilkan nol hasil ketika pengguna belum memilih apa-apa.

---

## 3. Decision engine

`src/lib/scoring/engine.ts`. Konstanta di `src/lib/scoring/constants.ts`.

| Fungsi | Keluaran saat data hilang |
|---|---|
| `calculateSolarScore(ghi)` | `null` |
| `calculateSocialScore(value, cohort)` | `null` |
| `calculateCriticalityScore(type)` | `null` untuk tipe tak dikenal |
| `calculateResilienceScore(class, eligibility)` | `null` bila tidak eligible |
| `calculatePriorityScore(dims, weights?)` | `value: null` bila coverage minimum tidak terpenuhi |
| `calculateDataConfidence(input)` | kategori + poin + alasan |
| `determineRecommendation(input)` | tipe + alasan |
| `generateReasonFactors(input)` | faktor positif + keterbatasan |
| `bandFor(score)` | `NEEDS_VERIFICATION` untuk `null` |

### 3.1 Skor tidak dihitung di UI

Pipeline Python tetap menjadi **produsen angka yang diterbitkan**. Engine
TypeScript ada agar aplikasi dapat menghitung ulang, menjelaskan, dan
mengeksplorasi skenario bobot tanpa memanggil Python. Halaman tidak memanggil
engine untuk menghasilkan skor yang ditampilkan — skor dibaca dari dataset.

### 3.2 Social score bersifat kohort-relatif

`calculateSocialScore` memerlukan seluruh kohort nilai canonical, karena
normalisasi log10 + min-max didefinisikan relatif terhadap rentang kohort.
Sebuah jumlah penerima manfaat tidak memiliki skor dalam isolasi. Situs tanpa
nilai canonical dikeluarkan dari kohort: ia tidak mendapat skor dan tidak
menggeser skor orang lain.

---

## 4. Metadata skor (§E)

`calculatePriorityScore` mengembalikan:

| Field | Isi |
|---|---|
| `value` | skor, atau `null` bila coverage minimum tidak terpenuhi |
| `status` | `ScoreStatus` |
| `band` | pita tampilan |
| `availableCriteria` | dimensi yang benar-benar dinilai |
| `missingCriteria` | dimensi yang hilang |
| `effectiveWeight` | bobot ternormalisasi per dimensi (jumlah = 100%) |
| `coverage` | fraksi bobot baseline yang didukung data, 0–1 |
| `breakdown` | keempat dimensi, termasuk yang hilang |

`coverage` tetap dilaporkan meski skor `null`, sehingga situs
`INSUFFICIENT_DATA` masih dapat menyatakan seberapa banyak data yang dimilikinya.

---

## 5. Aturan NULL ≠ 0

Ditegakkan di empat lapis dan diuji secara langsung:

1. **Engine** — dimensi hilang dikeluarkan dari pembilang *dan* penyebut.
2. **Normalisasi** — tanpa nilai default; enum tak dikenal → `throw`.
3. **Integritas** — `missing_data` harus cocok dengan kolom skor kosong.
4. **Formatting** — `null` selalu dirender `"Tidak tersedia"`, tidak pernah `0`.

Uji yang membedakan absen dari nol secara eksplisit:

- `calculateSolarScore(null)` → `null`; `calculateSolarScore(0)` → `0`.
  Nol adalah pengukuran dan harus bertahan.
- Sorting `beneficiary_desc` menempatkan nilai tak diketahui **terakhir**, bukan
  terendah. Situs tanpa data bukan situs dengan penerima manfaat paling sedikit.
- Floor sosial 10 memastikan kohort terkecil tidak pernah bernilai tepat 0.

---

## 6. Uji paritas: menjinakkan dua implementasi

Dua implementasi satu metodologi adalah risiko drift yang nyata. Risiko itu
ditahan oleh `src/lib/scoring/__tests__/parity.test.ts`, yang **menghitung
ulang seluruh dataset yang diterbitkan** dengan engine TypeScript dan gagal bila
ada satu nilai pun yang berbeda dari yang ditulis pipeline Python: skor
prioritas, status, coverage, skor per dimensi, kategori dan poin confidence,
tipe dan alasan rekomendasi, serta string penjelasan.

Bila uji ini gagal, salah satu implementasi berubah dan yang lain tidak.
**Jangan menyesuaikan ekspektasi agar lolos** — rekonsiliasikan kedua
implementasi.

### 6.1 Divergensi yang ditemukan uji ini pada eksekusi pertama

Uji paritas langsung menemukan dua ketidaksesuaian nyata:

1. **Alasan rekomendasi HLT-002.** Python menyebut nama desa secara spesifik
   ("Desa fasilitas ini (Sungai Kerawang) bernama sama dengan desa penerima
   hibah PLTS 2021..."); port TypeScript awal memakai kalimat generik. Versi
   Python lebih informatif dan dipertahankan; engine TypeScript diperbaiki agar
   menerima `linkedAssetVillage` dan menghasilkan kalimat yang sama.

2. **Cabang `EXPANSION_ASSESSMENT` tidak ada di Python.**
   `docs/RECOMMENDATION_LOGIC.md` menyatakan logika Aturan 1 "sudah
   diimplementasikan penuh", padahal build script selalu mengembalikan
   `NEEDS_DATA_VERIFICATION` untuk setiap aset terkait — cabang ekspansi belum
   pernah ditulis. Kini kedua implementasi memuat kedua cabang, dikendalikan
   oleh penanda eksplisit:

   ```python
   LINK_ESTABLISHED_MARKER = "hubungan_terverifikasi"
   ```

   Sebuah keterkaitan dianggap **ditetapkan** hanya bila catatan interim
   menyatakannya secara positif dengan penanda ini. Defaultnya "tidak
   ditetapkan": kesamaan nama desa bukan bukti hubungan fisik/operasional, dan
   ketiadaan pernyataan bukanlah verifikasi. Tidak ada baris yang memuat
   penanda ini saat ini, sehingga `EXPANSION_ASSESSMENT` **terimplementasi
   tetapi belum dapat dicapai** sampai seorang manusia memverifikasi keterkaitan
   dan mencatatnya. Hasil rekomendasi tidak berubah (tetap 10/10
   `NEEDS_DATA_VERIFICATION`).

---

## 7. Integritas dataset di sisi aplikasi

`src/lib/data/integrity.ts` berjalan sebelum record mana pun dipetakan:

- `record_id` unik dan tidak kosong;
- koordinat ada dan berada dalam rentang sah;
- `priority_score` `null` atau berada dalam 0–100;
- `missing_data` cocok persis dengan kolom skor kosong.

Seluruh masalah dilaporkan sekaligus, bukan berhenti pada yang pertama — orang
yang memperbaiki dataset rusak membutuhkan daftar lengkapnya.

Dataset yang gagal **ditolak seluruhnya**, bukan ditampilkan sebagian. Layar
yang menampilkan sebagian record dari dataset rusak lebih berbahaya daripada
layar kosong, karena pembaca tidak dapat mengetahui bagian mana yang hilang.

---

## 8. API routes

| Route | Keterangan |
|---|---|
| `GET /api/sites` | mendukung seluruh filter dan sort; mengembalikan `summary`, `count`, `sites` |
| `GET /api/sites/[id]` | satu situs; `404` bila tidak ada |

Nilai filter yang tidak dikenal ditolak dengan **400**, bukan diabaikan
diam-diam: filter yang dibuang tanpa pemberitahuan mengembalikan himpunan yang
lebih besar daripada yang diminta, dan pemanggil tidak punya cara mendeteksinya.

Ringkasan disertakan bersama hasil agar konsumen tidak menghitung ulang di atas
subset yang berbeda dan melaporkan gambaran yang berbeda dari UI.

Kedua route bersifat statis (`force-static`) dan diprerender saat build.

---

## 9. Filter dan sorting

**Filter:** `facilityType`, `district`, `priorityBand`, `dataConfidence`,
`recommendationType`, `search` (nama/kecamatan/id). Konjungtif.

**Sorting:** `priority_desc`, `confidence_desc`, `beneficiary_desc`,
`facility_name_asc`. Nilai tidak diketahui selalu terakhir pada setiap kunci.

**Penandaan provisional:** `isProvisional(site)` bernilai true untuk setiap
`scoreStatus` selain `FINAL_ENOUGH_FOR_MVP` — saat ini **10 dari 10 situs**.
Setiap daftar yang menampilkan skor wajib dapat menandainya.

`getPrioritySummary` sengaja **tidak melaporkan rata-rata**. Merata-ratakan
skor yang dihitung atas basis renormalisasi berbeda menghasilkan angka tanpa
makna terdefinisi. Yang dilaporkan adalah ekstrem, distribusi pita, jumlah
provisional, dan `fullyComparable`.

---

## 10. Hasil uji

`npm run test` — **138 uji, seluruhnya lolos**, pada 7 berkas:

| Berkas | Uji | Cakupan |
|---|---|---|
| `scoring/__tests__/parity.test.ts` | 54 | paritas TS ↔ Python atas 10 record |
| `data/__tests__/query.test.ts` | 21 | filter, sorting, ringkasan, determinisme |
| `scoring/__tests__/scoring.test.ts` | 19 | rentang skor, renormalisasi, coverage minimum, pita |
| `data/__tests__/integrity.test.ts` | 15 | record invalid, `record_id` duplikat, enum tak dikenal |
| `scoring/__tests__/recommendation.test.ts` | 12 | urutan aturan, larangan overstatement |
| `scoring/__tests__/confidence.test.ts` | 9 | kategori, plafon spasial, pemisahan dari prioritas |
| `scoring/__tests__/missing-values.test.ts` | 8 | NULL ≠ 0 |

Gate penuh: `npm run verify` = lint → typecheck → test → build.

---

## 11. Batasan yang tetap berlaku

- Solar `null` pada 10/10 situs; tidak ada situs dengan coverage 100%.
- Bahaya karhutla hanya proksi kecamatan; **0 situs** dapat mencapai confidence
  `HIGH` (plafon spesifisitas spasial).
- Seluruh 10 situs `NEEDS_DATA_VERIFICATION`; tidak ada rekomendasi deployment
  positif yang dapat diberikan atas bukti saat ini.
- Bobot tetap asumsi desain MVP, bukan hasil AHP tervalidasi ahli.
