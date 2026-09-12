# SCHEMA — Interim Facility Datasets

**Dibuat:** Prompt 3A (Acquisition: Facility Inventory), 2026-09-12.
**Status isi:** kedua CSV saat ini berisi **header saja, 0 record**. Ini disengaja — environment agent terkena `EGRESS_BLOCKED` dan **tidak ada data yang dikarang**. Lihat `research/MANUAL_ACQUISITION_REQUESTS.md`.

---

## Prinsip

1. **Satu baris = satu fasilitas.**
2. **Field yang tidak dapat diverifikasi diisi kosong (NULL), bukan ditebak.** Sel kosong dalam CSV berarti NULL.
3. **Verifikasi bersifat PER FIELD**, bukan per record. Tidak ada satu status global per baris.
4. **Koordinat tidak boleh diambil dari pusat desa/kecamatan** lalu diperlakukan sebagai koordinat fasilitas.
5. **Sumber non-primer wajib ditandai eksplisit** melalui `coordinate_source` dan `*_vstatus`.

## Kolom `*_vstatus` — nilai yang diizinkan

| Nilai | Arti |
|---|---|
| `verified_primary` | Diambil dari portal pemerintah resmi untuk fasilitas tersebut |
| `verified_secondary` | Dari sumber teknis/otoritatif non-pemerintah |
| `snippet_only` | Hanya dari hasil pencarian; **bukan bukti**, wajib diverifikasi ulang |
| `requires_verification` | Nilai ada tapi belum dikonfirmasi |
| `not_available` | Sumber diperiksa, field tersebut memang tidak tersedia |

Sel data kosong + `*_vstatus = not_available` berarti "sudah dicari, tidak ada".
Sel data kosong + `*_vstatus` kosong berarti "belum diperiksa sama sekali".

## Kolom `coordinate_source` — nilai yang diizinkan

| Nilai | Boleh dipakai? |
|---|---|
| `official_portal` | ✅ Prioritas utama — koordinat dari portal pemerintah |
| `geocoded_from_address` | ⚠️ Fallback — **wajib ditandai**, akurasi terbatas |
| `manual_digitization` | ⚠️ Fallback — **wajib ditandai**, hasil digitasi peta |
| `third_party_map` | ⚠️ Fallback terakhir — **hanya bila sumber pemerintah tidak menyediakan**, wajib ditandai |
| (kosong) | Tidak ada koordinat |

> ⚠️ Koordinat non-`official_portal` **tidak boleh** diperlakukan setara dengan koordinat resmi pada tahap scoring.

## Kolom QA

| Kolom | Arti |
|---|---|
| `potential_duplicate` | `true` bila record dicurigai duplikat. **Jangan merge otomatis berdasarkan kemiripan nama.** |
| `duplicate_of` | `record_id` kandidat pasangannya (hanya dugaan, bukan keputusan merge) |
| `coordinate_outlier` | `true` bila koordinat lolos validasi rentang tapi jatuh di luar perkiraan wilayah Kubu Raya. **Jangan hapus otomatis** — flag untuk investigasi |

## Aturan deduplikasi

- Gunakan identifier resmi lebih dulu: **NPSN** (sekolah), kode fasyankes/kode puskesmas (kesehatan).
- Kemiripan nama saja **tidak cukup** untuk merge — fasilitas dapat pindah lokasi, berganti nama, atau memiliki nama mirip namun berbeda entitas.
- Bila ragu: isi `potential_duplicate = true` dan biarkan kedua record hidup.

## Validasi geospasial

1. Rentang dasar: `latitude ∈ [-90, 90]`, `longitude ∈ [-180, 180]`.
2. Penyaring wilayah **sementara** (bounding box permisif): `latitude ∈ [-1,05; +0,80]`, `longitude ∈ [108,5; 110,0]`.

> ⚠️ Bounding box ini berstatus `snippet_only` dan hanya alat QA, **bukan data proyek**. Dua sumber pencarian memberi rentang berbeda untuk batas Kubu Raya, sehingga nilai di atas sengaja dibuat permisif (union) agar tidak menyaring record yang sah. **Wajib diganti** dengan point-in-polygon terhadap geometri batas administratif resmi (mis. dari BIG/Indonesia Geospasial) sebelum dipakai untuk keputusan apa pun.

Titik yang lolos rentang dasar tapi gagal penyaring wilayah → `coordinate_outlier = true`, **tidak dihapus**.

## Catatan kolom khusus

- `data_year` vs `retrieved_at`: `data_year` = tahun data yang direpresentasikan; `retrieved_at` = tanggal pengambilan. **Jangan disamakan** (aturan §G Prompt 2.5).
- `last_update` (sekolah): tanggal pembaruan yang ditampilkan portal Dapodik, bila ada.
- `facility_type` (kesehatan): mis. Puskesmas, Puskesmas Rawat Inap, Pustu, Klinik.
- `official_status` (kesehatan): status resmi yang dinyatakan portal, mis. rawat inap / non-rawat inap.
