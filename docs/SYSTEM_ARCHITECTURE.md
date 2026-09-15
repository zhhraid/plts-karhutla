# SYSTEM ARCHITECTURE — SURYA-SIAGA

Status: scaffold (Prompt 5). Dokumen ini menetapkan arsitektur sistem dan
struktur proyek. UI final belum dibangun pada tahap ini.

---

## 1. Ringkasan

SURYA-SIAGA adalah aplikasi web statis yang menyajikan hasil pre-screening
prioritas PLTS. Seluruh perhitungan skor terjadi **di luar aplikasi**, pada
pipeline data berbasis Python. Aplikasi web hanya membaca artefak build yang
sudah tervalidasi dan menampilkannya.

Konsekuensi arsitektural yang disengaja: **aplikasi tidak dapat menghasilkan
angka baru.** Tidak ada perhitungan skor di sisi klien maupun server runtime.
Jika sebuah angka muncul di layar, angka itu berasal dari
`data/processed/site_master_dataset.json` yang telah lolos
`scripts/validate_master_dataset.py`.

---

## 2. Stack

| Lapis | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components menjaga logika baca data di server; static export penuh untuk 19 halaman |
| Bahasa | TypeScript (`strict`, `noUncheckedIndexedAccess`) | Kontrak data dipaksakan pada waktu kompilasi; `any` dilarang |
| Styling | Tailwind CSS 3 | Token desain terpusat di `tailwind.config.ts` |
| Peta | MapLibre GL JS 4 | Open-source, tanpa kunci API berbayar, tanpa vendor lock-in |
| Ikon | lucide-react | Konsisten, tree-shakeable |
| Grafik | Recharts | Untuk breakdown dimensi pada tahap UI |
| Pipeline data | Python 3 (stdlib saja) | Tanpa dependensi eksternal; dapat diaudit baris per baris |

Tidak ada database pada MVP. Tidak ada panggilan API eksternal pada jalur
request. Dataset berjumlah 10 record.

---

## 3. Arsitektur data

```
data/raw/          IMMUTABLE — tidak pernah diedit
      |
      v
data/interim/      observasi per-lapis + koreksi (SCHEMA.md)
      |            education_facilities.csv, health_facilities.csv,
      |            beneficiary_observations.csv, solar_observations.csv,
      |            hazard_observations.csv, existing_energy_assets.csv
      v
scripts/build_master_dataset.py      (scoring: WSM + renormalisasi)
      |
      v
data/processed/site_master_dataset.{csv,json}
      |
      v
scripts/validate_master_dataset.py   (12 pemeriksaan; build gagal jika ada yang merah)
      |
      v
scripts/sync-app-data.mjs            (salin, bukan symlink)
      |
      v
public/data/site_master_dataset.json
      |
      v
src/lib/data/staticFileSource.ts     (adapter)
      |
      v
src/lib/data/index.ts                (satu titik binding)
      |
      v
Server Components
```

Perintah tunggal: `npm run data:build` menjalankan build → validate → sync
secara berurutan. Sinkronisasi hanya terjadi setelah validator lolos, sehingga
aplikasi tidak pernah menyajikan dataset yang belum tervalidasi.

### 3.1 Lapis abstraksi data

`src/lib/data/source.ts` mendefinisikan port `SiteDataSource`:

```ts
interface SiteDataSource {
  readonly name: string;
  getDataset(): Promise<SiteDataset>;
  getSites(): Promise<readonly Site[]>;
  getSiteById(recordId: string): Promise<Site | null>;
}
```

Tidak ada komponen yang membaca berkas, `fetch`, atau klien SQL secara
langsung. Semua halaman mengimpor dari `src/lib/data/index.ts`.

**Migrasi ke Supabase/PostgreSQL** dilakukan dengan:
1. menambahkan `src/lib/data/supabaseSource.ts` yang mengimplementasikan
   `SiteDataSource`;
2. mengubah satu baris di `src/lib/data/index.ts`
   (`const source: SiteDataSource = ...`).

Tidak ada komponen UI yang perlu diubah.

### 3.2 Normalisasi

`src/lib/data/normalise.ts` adalah satu-satunya tempat di aplikasi yang
mengetahui bentuk snake_case keluaran build script. Modul ini:

- memetakan record mentah ke model domain bertipe;
- **tidak pernah** mengisi nilai default untuk pengukuran yang hilang — `null`
  tetap `null` sampai ke layar;
- **gagal keras** (`throw`) bila menemukan nilai enum yang tidak dikenal.
  Memaksakan nilai tak dikenal menjadi label terdekat akan menerbitkan status
  yang salah seolah-olah terverifikasi.

### 3.3 Decision engine (Prompt 6)

`src/lib/scoring/engine.ts` memuat port TypeScript dari metodologi, agar
aplikasi dapat menghitung ulang dan menjelaskan skor tanpa memanggil Python.
Pipeline Python tetap menjadi produsen angka yang diterbitkan; halaman membaca
skor dari dataset, bukan menghitungnya.

Risiko dua implementasi ditahan oleh uji paritas yang menghitung ulang seluruh
dataset dan gagal pada perbedaan sekecil apa pun. Rinciannya di
`docs/DECISION_ENGINE_IMPLEMENTATION.md`.

`src/lib/scoring/interpret.ts` tetap berisi interpretasi murni: label, pita
tampilan, pengurutan, dan peringkat padat (dense ranking).

`bandFor(null)` mengembalikan `NEEDS_VERIFICATION`, bukan `LOW`. Ketiadaan skor
bukan skor rendah.

`rankSites()` menggunakan dense ranking sehingga skor seri berbagi peringkat
yang sama. Pada dataset saat ini terdapat dua kelompok skor identik
(81,67 pada tiga Puskesmas; 68,33 pada tiga sekolah). Memecah seri berdasarkan
urutan daftar akan mengarang presedensi yang tidak didukung data.

---

## 4. Rendering

Seluruh halaman adalah React Server Components. Tidak ada `"use client"` pada
scaffold ini. Dataset dibaca di server, dimemoisasi per proses, dan seluruh
19 halaman diprerender sebagai HTML statis pada waktu build (7 rute + 10
halaman situs + not-found + shared).

Klien hanya akan dibutuhkan untuk peta interaktif (MapLibre) dan kontrol
banding, yang akan diisolasi sebagai komponen klien pada tahap UI.

---

## 5. Struktur proyek

```
src/
  app/                    App Router — satu direktori per rute
    layout.tsx            shell: skip-link, navbar, main, footer
    page.tsx              / — ringkasan & peringkat
    map/page.tsx          /map
    sites/[id]/page.tsx   /sites/:id (generateStaticParams)
    compare/page.tsx      /compare
    methodology/page.tsx  /methodology
    data-sources/page.tsx /data-sources
    about/page.tsx        /about
    not-found.tsx
    globals.css
  components/
    layout/               Navbar, Footer, PageHeader
    ui/                   Badge, Card, MissingValue, Placeholder
  features/               dashboard/, map/, site/, compare/ (tahap UI)
  lib/
    data/                 source.ts, staticFileSource.ts, normalise.ts, index.ts
    scoring/              dimensions.ts, interpret.ts
    formatting/           index.ts
  types/
    index.ts              kontrak data tunggal, tanpa `any`
public/data/              artefak yang disinkronkan
scripts/                  build_master_dataset.py, validate_master_dataset.py,
                          sync-app-data.mjs
```

Pemisahan `components/` dan `features/`: `components/` berisi primitif yang
tidak mengetahui domain; `features/` akan berisi komposisi spesifik-domain.

---

## 6. Aturan integritas yang ditegakkan oleh kode

| Aturan | Ditegakkan di |
|---|---|
| NULL tidak pernah menjadi 0 | `normalise.ts` (tanpa default), `formatting/index.ts` (`NOT_AVAILABLE`), `MissingValue.tsx` |
| Nilai hilang punya satu tampilan | `components/ui/MissingValue.tsx` |
| Cakupan spasial selalu dinyatakan | `SCOPE_LABEL` + `readScope()` |
| Skor dengan cakupan bobot berbeda tidak sebanding | `sharesEvidenceBase()`, peringatan pada `/compare` |
| Enum tak dikenal = kegagalan build | `readEnum()` di `normalise.ts` |
| Bobot yang ditampilkan = bobot yang dipakai menghitung | bobot dibaca dari `dataset.meta`, tidak di-hardcode di UI |
| Keyakinan data terpisah dari skor prioritas | dua bidang berbeda, dua badge berbeda, tidak pernah digabung |

---

## 7. Perbaikan yang dilakukan pada tahap ini

`latest_data_year` pada seluruh 10 record berisi string `"Hasi"`.
Penyebabnya: `dataset_year` karhutla bernilai
`"Hasil pengolahan data 2023; published 2024"`, sementara build script membaca
`.split(";")[0].strip()[:4]`.

Perbaikan: fungsi `first_year()` mengekstraksi tahun 4-digit pertama yang
dinyatakan dalam teks. Default lama `or "2026"` dihapus — tahun yang tidak
diketahui bukanlah tahun berjalan. Setelah perbaikan, nilai menjadi 2023
(tahun pengolahan data karhutla) atau 2026 (tanggal rujukan beneficiary yang
memang tercatat). Validator: 12/12 lolos.

---

## 8. Batasan yang diketahui

- Dataset MVP berisi 10 situs dengan koordinat terverifikasi, dari 30 baris
  inventaris fasilitas. Ini adalah pre-screening, bukan sensus.
- Dimensi Solar (bobot baseline terbesar, 30) belum tersedia untuk satu situs
  pun; seluruh `ghi_value` bernilai `null`. Tidak ada situs yang skornya
  mencakup 100% bobot baseline.
- Bahaya karhutla hanya tersedia sebagai proksi kecamatan. Konsekuensinya,
  tidak ada situs yang mencapai keyakinan data HIGH (langit-langit spesifisitas
  spasial).
- Kekeringan hanya konteks kabupaten dan dikeluarkan dari skor.
