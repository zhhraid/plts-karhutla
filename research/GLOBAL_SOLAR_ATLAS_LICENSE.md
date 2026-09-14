# GLOBAL_SOLAR_ATLAS_LICENSE.md — Status Lisensi &amp; Kebijakan Penyimpanan Data

**Dibuat:** Prompt 3C, 2026-09-14.
**Status:** ⚠️ **BELUM TERVERIFIKASI** — halaman lisensi tidak dapat diakses dari environment agent.

---

## Hasil Uji Akses (2026-09-14)

| URL | Hasil |
|---|---|
| `https://globalsolaratlas.info/support/faq` | ❌ EGRESS_BLOCKED |

Sesuai README proxy, penolakan kebijakan egress **tidak** diakali. Tidak ada upaya scraping alternatif.

## Yang Sudah Diketahui vs Belum

| Item | Status | Sumber |
|---|---|---|
| Parameter (GHI, DNI, DIF, GTI) | ✅ terverifikasi | EV-D, `external_manual_verification` |
| Resolusi 9 arcsec (~250 m) | ✅ terverifikasi | EV-D |
| CRS EPSG:4326 | ✅ terverifikasi | EV-D |
| Format unduhan GeoTIFF / AAIGRID | ✅ terverifikasi | EV-D |
| **Lisensi / terms of use** | ❌ **belum terverifikasi** | — |
| **Boleh dipakai non-komersial/kompetisi?** | ❌ belum terverifikasi | — |
| **Raster boleh disimpan di repository?** | ❌ belum terverifikasi | — |
| **Derived point values boleh disimpan?** | ❌ belum terverifikasi | — |
| **Attribution requirement** | ⚠️ hanya `snippet_only` | EV-021 |

**Catatan penting soal EV-021:** riset Prompt 2 sempat menemukan indikasi lisensi **CC BY 4.0** dengan atribusi *"© The World Bank, Source: Global Solar Atlas 2.0, Solar resource data: Solargis"*. Namun status evidence itu **`snippet_only`** — belum pernah dibuka dari halaman resmi oleh siapa pun. Paket verifikasi eksternal 2026-09-12 (EV-D) memverifikasi spesifikasi teknis GSA **tetapi tidak mencakup lisensi**. Jadi klaim CC BY 4.0 **tidak boleh** dijadikan dasar keputusan penyimpanan/redistribusi.

---

## KEPUTUSAN YANG BERLAKU SEKARANG

### ⛔ Raster TIDAK disimpan di repository

Sesuai instruksi §C Prompt 3C: *"Jika license tidak jelas: JANGAN commit raster."*

Tidak ada file GeoTIFF/AAIGRID yang diunduh maupun di-commit. `data/raw/` tidak memuat raster GSA apa pun.

### ⏸️ Derived point values: ditahan sampai lisensi diverifikasi

Meski instruksi mengizinkan menyimpan nilai per titik *"jika diperbolehkan atau dianggap aman dengan attribution"*, prasyarat itu **belum terpenuhi** — kita belum tahu apa yang diperbolehkan. Karena tidak ada nilai GHI yang berhasil diakuisisi sama sekali, pertanyaan ini **belum menjadi kendala praktis**: `solar_observations.csv` saat ini berisi NULL, bukan nilai yang tertahan.

Keputusan ini menjadi relevan saat paket eksternal masuk. Karena itu verifikasi lisensi dimasukkan sebagai **bagian wajib** dari REQ-SOL-01.

---

## Yang Harus Diverifikasi Manusia (bagian dari REQ-SOL-01)

Buka `https://globalsolaratlas.info/support/faq` (dan halaman Terms/License yang ditautkan), lalu catat **verbatim**:

1. Nama lisensi dan URL halaman lisensinya.
2. Apakah penggunaan non-komersial/kompetisi akademik diizinkan.
3. Apakah **raster** boleh diunduh dan disimpan/diredistribusi dalam repository publik.
4. Apakah **derived point values** (nilai GHI hasil ekstraksi per titik) boleh disimpan dan dipublikasikan.
5. Teks atribusi yang diwajibkan, **persis** sebagaimana tertulis.
6. `accessed_at`.

**Destination:** `data/raw/external_manual/<tanggal>/global_solar_atlas_license.md`

---

## Aturan yang Mengikat Sampai Verifikasi Selesai

1. ⛔ Jangan commit raster GSA dalam bentuk apa pun.
2. ⛔ Jangan menampilkan data GSA di UI publik tanpa teks atribusi yang terverifikasi.
3. ⚠️ Setiap nilai GHI yang kelak masuk `solar_observations.csv` **wajib** disertai `source_name`, `source_url`, dan atribusi — bahkan bila lisensinya ternyata permisif.
4. ⚠️ Ingat batasan GSA sendiri (EV-022): dokumentasi resmi menyatakan data ini **bukan untuk "bankable assessment"**, hanya pre-feasibility/screening. Ini selaras dengan positioning SURYA-SIAGA sebagai pre-screening tool (§4 `PROJECT_CONTEXT.md`) dan **harus tetap dinyatakan** saat nilai GHI ditampilkan.
