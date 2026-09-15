# SCORING_SENSITIVITY_ANALYSIS.md

**Dibuat:** Prompt 4, 2026-09-15. **Dataset:** 10 situs, `data/processed/site_master_dataset.csv`.

> ⚠️ Seluruh skor bersifat **PROVISIONAL**. GHI site-level belum tersedia untuk satu pun situs, dan bahaya karhutla masih proksi kecamatan. Analisis ini menguji **kestabilan metode**, bukan memvalidasi kebenaran hasil.

---

## 1. Peringkat Baseline

| # | record_id | Fasilitas | Priority | Coverage | Status |
|---|---|---|---|---|---|
| 1 | EDU-001 | SMAN 1 Sungai Raya | **91.43** | 0.70 | PROVISIONAL_MISSING_SOLAR |
| 2 | HLT-001 | Puskesmas Padang Tikar | **81.67** | 0.45 | NEEDS_DATA_VERIFICATION |
| 2 | HLT-002 | Puskesmas Sungai Kerawang | **81.67** | 0.45 | NEEDS_DATA_VERIFICATION |
| 2 | HLT-003 | Puskesmas Kubu | **81.67** | 0.45 | NEEDS_DATA_VERIFICATION |
| 5 | EDU-002 | SMAN 1 Sungai Kakap | 77.08 | 0.70 | PROVISIONAL_MISSING_SOLAR |
| 6 | EDU-003 | SMPN 1 Terentang | **68.33** | 0.45 | NEEDS_DATA_VERIFICATION |
| 6 | EDU-004 | SMAN 1 Kubu | **68.33** | 0.45 | NEEDS_DATA_VERIFICATION |
| 6 | EDU-007 | SMKN 1 Batu Ampar | **68.33** | 0.45 | NEEDS_DATA_VERIFICATION |
| 9 | EDU-006 | SDN 07 Batu Ampar | 68.11 | 0.70 | PROVISIONAL_MISSING_SOLAR |
| 10 | EDU-005 | SDN 22 Batu Ampar | 47.50 | 0.70 | PROVISIONAL_MISSING_SOLAR |

**Hanya 6 skor berbeda dari 10 situs.** Tiga puskesmas identik persis; tiga sekolah identik persis.

---

## 2. Uji Bobot ±20%

Setiap bobot divariasikan ±20%, total dinormalisasi kembali ke 100. Delapan skenario.

| Skenario | Top-3 | Perubahan peringkat |
|---|---|---|
| solar +20% / −20% | EDU-001, HLT-001, HLT-002 | **NONE** |
| social +20% / −20% | EDU-001, HLT-001, HLT-002 | **NONE** |
| criticality +20% / −20% | EDU-001, HLT-001, HLT-002 | **NONE** |
| resilience +20% / −20% | EDU-001, HLT-001, HLT-002 | **NONE** |

**Total pergerakan peringkat di seluruh 8 skenario: 0.**

### ⚠️ Ini BUKAN bukti model yang robust

Hasil nol-perubahan ini **tidak boleh** disajikan sebagai "metodologi terbukti stabil". Penyebab sebenarnya adalah **kemiskinan informasi dalam dataset**:

1. **Bobot solar (30%, terbesar) saat ini sepenuhnya inert.** GHI NULL di semua 10 situs, sehingga dimensi solar dikeluarkan dari setiap pembilang dan penyebut. Menggeser bobot solar ±20% tidak mengubah satu pun skor — bobot terbesar dalam metodologi ini saat ini tidak melakukan apa-apa.
2. **Hanya tiga variabel yang benar-benar membedakan situs:** tipe fasilitas (2 nilai), kelas karhutla (2 nilai yang muncul: Sedang/Tinggi), dan jumlah peserta didik (4 dari 10 situs). Dengan ragam sekecil itu, perubahan bobot moderat tidak dapat membalik urutan.

Kesimpulan yang jujur: **uji bobot belum informatif sampai GHI tersedia.** Uji ini perlu diulang setelah dimensi solar aktif.

---

## 3. Uji Mapping Alternatif — temuan paling material

Sumber karhutla (Wijaya et al. 2024, Tabel 10) memuat **luas area per kelas bahaya** per kecamatan, bukan hanya kelasnya. Itu memungkinkan mapping kontinu sebagai alternatif dari ordinal 33/67/100.

Alternatif yang diuji: `resilience_score` = min-max dari **fraksi luas kecamatan berkelas bahaya Tinggi**.

| record_id | Baseline (ordinal) | Alternatif (fraksi area) | Peringkat |
|---|---|---|---|
| HLT-003 | 81.67 | **92.30** | 4 → **1** |
| EDU-001 | 91.43 | 91.43 | 1 → 2 |
| EDU-004 | 68.33 | **78.97** | 7 → **3** |
| HLT-001 | 81.67 | 74.59 | 2 → 4 |
| HLT-002 | 81.67 | 74.59 | 3 → 5 |
| EDU-006 | 68.11 | 63.56 | 9 → 6 |
| EDU-007 | 68.33 | 61.26 | 8 → 7 |
| EDU-002 | 77.08 | **56.72** | 5 → **8** |
| EDU-003 | 68.33 | 46.32 | 6 → 9 |
| EDU-005 | 47.50 | 42.95 | 10 → 10 |

**Skor berbeda: 6/10 → 9/10.** Perubahan peringkat hingga **4 posisi**.

### Implikasi

> **Peringkat jauh lebih sensitif terhadap cara bahaya dikodekan daripada terhadap bobot.** Menggeser bobot ±20% tidak mengubah apa pun; mengganti ordinal menjadi fraksi area mengubah pemuncak peringkat.

Penyebabnya terlihat jelas pada data: kelas ordinal menutupi variasi besar di dalam kelas "Sedang". Fraksi luas kelas Tinggi di kecamatan-kecamatan berkelas Sedang berkisar **18,1% (Sungai Kakap) hingga 47,6% (Kubu)** — Kubu hampir menyamai Sungai Raya yang berkelas Tinggi (52,9%). Mapping ordinal memberi ketiganya angka yang sama (67), membuang informasi yang sudah tersedia di sumber.

### Mengapa baseline tetap memakai ordinal

Instruksi metodologi menetapkan mapping ordinal sebagai default. Mapping alternatif **tidak** diterapkan secara sepihak; ia didokumentasikan di sini sebagai temuan dan **memerlukan keputusan manusia**. Perlu dicatat juga bahwa keduanya sama-sama **tetap berada pada level kecamatan** — fraksi area bukan peningkatan spesifisitas spasial, hanya pemanfaatan informasi yang lebih penuh dari sumber yang sama.

### Verifikasi konsistensi sumber

Sebelum dipakai, konsistensi internal tabel sumber diperiksa: untuk kesepuluh situs, `raw_class` **selalu** sama dengan kelas berluas dominan, dan `low + medium + high` selalu menjumlah tepat ke `total_area_ha`. Sumbernya konsisten secara internal.

---

## 4. Artefak Metodologis: Punya Data Justru Menurunkan Skor

Temuan yang harus diperbaiki sebelum hasil dipublikasikan:

| record_id | Kecamatan | Tipe | Karhutla | Beneficiary | Priority |
|---|---|---|---|---|---|
| EDU-007 | Batu Ampar | Sekolah | Sedang | **tidak ada data** | **68.33** |
| EDU-005 | Batu Ampar | Sekolah | Sedang | **46 siswa (terverifikasi)** | **47.50** |

Kedua sekolah identik pada setiap dimensi lain. Satu-satunya perbedaan: EDU-005 **memiliki** data beneficiary, dan nilainya kecil. Akibatnya EDU-005 turun 21 poin dan menjadi peringkat terakhir, sedangkan EDU-007 — yang beneficiary-nya tidak diketahui sama sekali — berada di peringkat 6.

**Ini konsekuensi struktural dari kebijakan renormalisasi**, bukan bug: mengeluarkan dimensi yang hilang dari penyebut berarti situs tanpa data dinilai hanya pada dimensi yang kebetulan menguntungkannya. Efeknya adalah **insentif terbalik** — mengukur beneficiary dapat merugikan peringkat sebuah fasilitas.

Implikasi praktis: **skor dengan `available_weight_fraction` berbeda tidak sepenuhnya sebanding.** Membandingkan situs coverage 0,70 dengan situs coverage 0,45 adalah membandingkan dua hal yang diukur pada basis berbeda. Kolom `available_weight_fraction` disediakan tepat agar hal ini terlihat.

**Opsi mitigasi (belum diputuskan, perlu keputusan manusia):**
1. Memeringkat hanya dalam kelompok coverage yang sama.
2. Menampilkan coverage berdampingan dengan skor di UI, dan tidak menyajikan peringkat tunggal lintas-coverage.
3. Menunda peringkat sampai cakupan data merata — pilihan paling konservatif.

---

## 5. Kesimpulan

| Pertanyaan | Jawaban |
|---|---|
| Kandidat stabil terhadap perubahan bobot? | Semua — tetapi karena data terlalu miskin untuk bobot berpengaruh, bukan karena metode terbukti kokoh |
| Kandidat sensitif? | Terhadap **encoding bahaya**: HLT-003 (4→1), EDU-004 (7→3), EDU-002 (5→8), EDU-003 (6→9) |
| Apakah peringkat layak dipublikasikan sebagai hasil? | **Belum.** Bobot terbesar inert, 4 dari 10 situs berbagi skor kembar, dan ada artefak yang menghukum ketersediaan data |
| Uji apa yang harus diulang? | Seluruh uji bobot, setelah GHI site-level dan bahaya per-titik tersedia |

**Tidak ada klaim validasi yang dibuat.** Analisis ini menunjukkan metodologi berjalan dan dapat diaudit; ia **tidak** menunjukkan bahwa peringkat saat ini benar.
