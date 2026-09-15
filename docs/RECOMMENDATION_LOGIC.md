# RECOMMENDATION_LOGIC.md — Logika Rekomendasi

**Implementasi:** blok rekomendasi di `scripts/build_master_dataset.py`.

---

## Jenis Rekomendasi

| Tipe | Arti |
|---|---|
| `NEW_DEPLOYMENT_ASSESSMENT` | Layak dikaji lebih lanjut untuk PLTS baru |
| `EXPANSION_ASSESSMENT` | Layak dikaji untuk penguatan/ekspansi PLTS eksisting |
| `NEEDS_DATA_VERIFICATION` | Data belum cukup untuk menentukan jalur mana pun |
| `MONITOR_CONTEXT_ONLY` | Hanya konteks, bukan kandidat aktif |

Semuanya adalah rekomendasi **untuk mengkaji**, bukan untuk membangun. Tidak satu pun menyiratkan keputusan pembangunan.

## Urutan Aturan

```
1. Fasilitas terkait PLTS eksisting?
   → hubungan jelas    : EXPANSION_ASSESSMENT
   → hubungan tidak jelas: NEEDS_DATA_VERIFICATION
2. Dimensi solar hilang?
   → NEEDS_DATA_VERIFICATION
3. Selain itu
   → NEW_DEPLOYMENT_ASSESSMENT
```

### Aturan 1 — PLTS eksisting

Bila ada PLTS eksisting terverifikasi pada situs/konteks terkait, **jangan otomatis merekomendasikan deployment baru**. `EXPANSION_ASSESSMENT` hanya bila hubungan fasilitas dengan aset eksisting **cukup jelas**; bila tidak, `NEEDS_DATA_VERIFICATION`.

**Tidak pernah menyimpulkan kapasitas tambahan.** `capacity_kwp` aset eksisting masih NULL (CF-001 terbuka) dan tahun operasinya belum terverifikasi (CF-006 terbuka).

### Aturan 2 — solar hilang

Solar Suitability memegang bobot terbesar (30%). Bila GHI site-level tidak tersedia, dimensi utama tidak dapat dinilai sama sekali — rekomendasi deployment positif akan melampaui bukti yang ada.

## Hasil Saat Ini: 10/10 `NEEDS_DATA_VERIFICATION`

Uniform, dan itu **jawaban yang jujur**. Dua sebab independen:

**Sebab A — solar hilang di semua situs.** GHI NULL 10/10, jadi Aturan 2 berlaku universal.

**Sebab B — HLT-002 memiliki alasan kedua yang berdiri sendiri.** Puskesmas Sungai Kerawang berada di desa bernama sama dengan salah satu dari tiga desa penerima hibah PLTS 2021 (Sumber Agung, Sungai Kerawang, Muara Tiga). Kesamaan nama desa **bukan** bukti hubungan fisik atau operasional dengan instalasi PLTS tersebut. Karena itu HLT-002 tetap `NEEDS_DATA_VERIFICATION` lewat Aturan 1, dan akan tetap demikian meski GHI tiba — sampai keterkaitannya diverifikasi.

Fasilitas lain di Kecamatan Batu Ampar (EDU-005, EDU-006, EDU-007, HLT-001) berada di desa yang **berbeda** dari ketiga desa PLTS. Konteks kecamatan dicatat di `existing_plts_context`, tetapi tidak diperlakukan sebagai keterkaitan fasilitas.

## Setelah GHI Tiba

| Situs | Rekomendasi yang diharapkan |
|---|---|
| 9 situs tanpa keterkaitan PLTS | `NEW_DEPLOYMENT_ASSESSMENT` |
| HLT-002 | Tetap `NEEDS_DATA_VERIFICATION` sampai keterkaitan desa diverifikasi; kemudian `EXPANSION_ASSESSMENT` atau `NEW_DEPLOYMENT_ASSESSMENT` |

Logika di atas sudah diimplementasikan penuh — data saat ini yang membuat cabang 1 dan 3 belum aktif, bukan kodenya yang belum ada.

## Explainability

Setiap situs membawa empat field turunan-data (bukan teks generatif):

| Field | Isi |
|---|---|
| `top_positive_factors` | Faktor yang benar-benar menaikkan skor, mis. criticality tertinggi, kelas karhutla Tinggi, jumlah peserta didik besar |
| `limitations` | Selalu memuat keterbatasan bahaya proksi kecamatan dan pengeluaran kekeringan; ditambah koordinat 2021 dan konteks PLTS kecamatan bila berlaku |
| `missing_data` | Daftar dimensi yang hilang, konsisten dengan kolom skor kosong (diverifikasi validator) |
| `recommendation_reason` | Alasan konkret dari aturan mana yang memicu rekomendasi |

**Tidak ada evidence yang dikarang.** Setiap frasa merujuk pada nilai yang benar-benar ada di dataset.

Contoh (`EDU-001`):
> *top_positive_factors:* kecamatan berkelas bahaya karhutla Tinggi; jumlah peserta didik relatif besar (994)
> *limitations:* bahaya karhutla hanya proksi kecamatan, bukan nilai piksel situs; kekeringan hanya konteks kabupaten sehingga dikeluarkan dari skor
> *recommendation_reason:* GHI site-level belum tersedia, sehingga dimensi Solar Suitability (bobot terbesar) tidak dapat dinilai. Rekomendasi deployment belum dapat diberikan.

## Larangan

- ⛔ Menyatakan sebuah situs "layak dibangun".
- ⛔ Menyimpulkan kapasitas PLTS tambahan.
- ⛔ Memperlakukan kesamaan nama desa sebagai keterkaitan aset.
- ⛔ Menyajikan rekomendasi provisional sebagai hasil final.
- ⛔ Menurunkan rekomendasi dari `electricity_source` ("Diesel" ≠ prioritas PLTS; "Tidak Ada" ≠ bukti final tanpa listrik).
