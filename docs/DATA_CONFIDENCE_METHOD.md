# DATA_CONFIDENCE_METHOD.md — Metode Data Confidence

**Implementasi:** fungsi `confidence()` di `scripts/build_master_dataset.py`.

---

## Prinsip Pemisahan

> **Data Confidence TIDAK PERNAH menaikkan Priority Score.**

Keduanya menjawab pertanyaan berbeda:

- **Priority Score** — seberapa tinggi indikasi prioritas situs ini?
- **Data Confidence** — seberapa kuat bukti di balik indikasi itu?

Sebuah situs dapat berprioritas tinggi dengan confidence rendah (indikasi kuat, bukti lemah) maupun sebaliknya. Keduanya disimpan di kolom terpisah dan tidak pernah saling memengaruhi. Validator memeriksa pemisahan ini secara eksplisit.

## Enam Dimensi

| # | Dimensi | Poin | Kriteria |
|---|---|---|---|
| 1 | **Source Authority** | +2 | Portal pemerintah / sumber teknis otoritatif |
| 2 | **Data Recency** | +1 | Koordinat dari profil resmi terkini; **0** bila dari dataset 2021 |
| 3 | **Data Completeness** | +2 / +1 / 0 | 4 dimensi tersedia / 3 tersedia / ≤2 tersedia |
| 4 | **Verification Status** | +1 | Beneficiary `verified_primary` dan bertanggal |
| 5 | **Spatial Specificity** | +1 | Nilai bahaya per titik situs; **0** bila hanya proksi kecamatan |
| 6 | **Source Conflict / Variance** | +1 | Tidak ada variansi antar-view yang tercatat |

**Maksimum: 8 poin.**

## Pemetaan ke Kategori

| Poin | Kategori |
|---|---|
| ≥ 6 | `HIGH` |
| 4–5 | `MEDIUM` |
| ≤ 3 | `NEEDS_VERIFICATION` |

### Plafon Spatial Specificity

Dimensi 5 bukan hanya penambah poin — ia juga **plafon**:

> Selama input bahaya sebuah situs masih **proksi kecamatan**, situs itu **tidak dapat mencapai HIGH**, sebaik apa pun dimensi lainnya.

Alasannya bukan kalkulasi poin melainkan logika bukti: bila bukti bahaya bukan tentang lokasi situs itu sendiri, keyakinan tinggi pada rekomendasi situs tersebut tidak dapat dibenarkan.

**Konsekuensi saat ini: 0 situs berkategori HIGH**, karena seluruh 10 situs memakai proksi kecamatan. Ini kondisi yang benar, bukan kekurangan implementasi. Setelah ekstraksi titik InaRISK tersedia, plafon terangkat otomatis.

## Distribusi Saat Ini

| Kategori | Jumlah |
|---|---|
| HIGH | **0** |
| MEDIUM | 6 |
| NEEDS_VERIFICATION | 4 |

Empat situs `NEEDS_VERIFICATION`: HLT-001, HLT-002, HLT-003 (koordinat 2021 + beneficiary tidak tersedia) dan EDU-004 (variansi antar-view beneficiary belum direkonsiliasi).

## Penyajian di UI

Kategori adalah tampilan utama. `confidence_score` numerik internal bersifat diagnostik dan **tidak** disajikan sebagai presisi ilmiah.

`data_confidence_reason` memuat alasan per dimensi dalam kalimat yang dapat dibaca pengguna — bukan teks generatif, melainkan turunan langsung dari kondisi yang dievaluasi kode.

## Catatan Desain

Rubrik ini mengoperasionalkan §12.1 `PROJECT_CONTEXT.md`, yang mendefinisikan Data Confidence secara kualitatif dan **melarang** pembuatan bobot numerik final maupun penggabungan otomatis ke Priority Score.

Pembobotan poin di atas adalah **MVP design assumption** dan sengaja dibuat kasar: dengan hanya 10 situs dan cakupan data yang timpang, rubrik yang lebih halus akan menyiratkan presisi yang tidak dimiliki buktinya. Threshold final dan bobot per dimensi tetap berstatus open decision.
