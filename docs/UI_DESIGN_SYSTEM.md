# UI DESIGN SYSTEM — SURYA-SIAGA

Status: scaffold (Prompt 5). Token dan primitif ditetapkan; komponen
spesifik-domain menyusul pada tahap UI.

---

## 1. Prinsip

1. **Warna tidak pernah menjadi satu-satunya pembawa makna.** Setiap penanda
   status memuat label teks. Antarmuka harus tetap terbaca dalam skala abu-abu
   dan oleh pembaca layar.
2. **Ketidakpastian ditampilkan, bukan disamarkan.** Ketiadaan data punya
   representasi visual sendiri yang tidak dapat dikelirukan dengan nilai nol.
3. **Angka tidak pernah berdiri sendiri.** Skor selalu muncul bersama status
   kelengkapannya.
4. **Fokus keyboard tidak pernah dihapus.** `:focus-visible` global di
   `globals.css`, tidak di-override di mana pun.

---

## 2. Token warna

Didefinisikan di `tailwind.config.ts`.

| Token | Nilai | Penggunaan |
|---|---|---|
| `primary` | `#15803d` | aksi utama, identitas (hijau — energi terbarukan) |
| `primary.subtle` / `.fg` | `#dcfce7` / `#052e16` | latar lunak, teks di atas latar lunak |
| `secondary` | `#1d4ed8` | tautan, ring fokus |
| `surface` | `#ffffff` | permukaan kartu |
| `surface.muted` | `#f8fafc` | latar halaman |
| `surface.sunken` | `#f1f5f9` | blok tenggelam, placeholder |
| `border` / `border.strong` | `#e2e8f0` / `#cbd5e1` | pemisah |
| `success` | `#15803d` | keadaan terverifikasi |
| `warning` | `#b45309` | perlu perhatian |
| `danger` | `#b91c1c` | kesalahan |
| `muted` / `muted.fg` | `#64748b` / `#475569` | teks sekunder |

### 2.1 Skala prioritas dan keyakinan — sengaja berbeda

| Kelompok | Token |
|---|---|
| `priority` | `high #b45309`, `medium #1d4ed8`, `low #64748b`, `unverified #7c3aed` |
| `confidence` | `high #15803d`, `medium #b45309`, `unverified #7c3aed` |

Dua skala ini **tidak berbagi palet**. Prioritas tinggi tidak berwarna hijau,
dan keyakinan tinggi tidak berwarna oranye. Jika keduanya memakai palet yang
sama, pembaca akan membaca "merah/oranye" sebagai satu makna tunggal dan
menggabungkan dua konsep yang seluruh metodologi ini justru memisahkannya.

`unverified` memakai ungu (`#7c3aed`) — di luar sumbu hijau–oranye–merah —
sehingga "belum dapat diperingkat" tidak terbaca sebagai titik pada skala
baik–buruk. Ketiadaan skor bukan skor buruk.

---

## 3. Tipografi

- Keluarga: `var(--font-sans)` → system UI stack. Tidak ada pemuatan font
  eksternal pada MVP.
- Judul halaman: `text-2xl font-semibold tracking-tight`.
- Judul kartu: `text-sm font-semibold uppercase tracking-wide text-muted-fg`.
- Teks isi: `text-sm`.
- Metadata: `text-xs text-muted-fg`.
- Seluruh angka dalam tabel dan daftar peringkat: `tabular-nums`, agar digit
  sejajar secara vertikal dan perbedaan besaran terbaca sebagai bentuk.

Bahasa antarmuka adalah Bahasa Indonesia. Format angka memakai locale `id-ID`
(pemisah desimal koma).

---

## 4. Primitif

| Komponen | Berkas | Peran |
|---|---|---|
| `Badge` | `src/components/ui/Badge.tsx` | chip status; enam tone; label teks wajib |
| `Card` | `src/components/ui/Card.tsx` | wadah konten dengan judul opsional |
| `MissingValue` | `src/components/ui/MissingValue.tsx` | satu-satunya tampilan untuk data hilang |
| `Placeholder` | `src/components/ui/Placeholder.tsx` | penanda rute yang belum dibangun |
| `PageHeader` | `src/components/layout/PageHeader.tsx` | judul + deskripsi |
| `Navbar` / `Footer` | `src/components/layout/` | shell global |

`Placeholder` menyatakan secara eksplisit bahwa sebuah tampilan belum selesai.
Layar setengah jadi yang tampak selesai lebih buruk daripada layar kosong,
karena pembaca tidak dapat membedakan mana angka yang nyata.

---

## 5. Formatting

`src/lib/formatting/index.ts` adalah satu-satunya jalur formatting.

| Fungsi | Perilaku pada `null` |
|---|---|
| `formatNumber` | `"Tidak tersedia"` |
| `formatScore` | `"Tidak tersedia"` |
| `formatPercent` | `"Tidak tersedia"` |
| `formatCoordinate` | `"Tidak tersedia"` |
| `formatYear` | `"Tidak tersedia"` |

`formatScore(0)` menghasilkan `"0,00"`. Nol adalah nilai terukur dan harus
terlihat berbeda dari ketidaktahuan.

---

## 6. Aksesibilitas

- `<html lang="id">`.
- Skip-link ke `#main` sebagai elemen fokusable pertama.
- `:focus-visible` global: ring 2px `secondary` dengan offset.
- `<nav aria-label="Navigasi utama">`.
- Ikon dekoratif memakai `aria-hidden`; makna selalu ada di teks.
- Tabel memakai `<th scope="col">`.
- Semantik daftar: peringkat memakai `<ol>`, bukan `<div>` bernomor.

---

## 6.1 Encoding peta — warna bukan satu-satunya pembawa makna

Penanda peta memakai **dua kanal visual yang saling bebas**:

| Kanal | Membawa | Nilai |
|---|---|---|
| Bentuk penanda | Tipe fasilitas | bulat = Sekolah · kotak = Puskesmas |
| Simbol di dalam penanda | Pita prioritas | ▲ Tinggi · ● Menengah · ▬ Rendah · ? Belum dapat diperingkat |
| Warna | penguat, bukan pembawa | mengikuti token `priority` |

Peta tetap terbaca benar tanpa membedakan warna sama sekali. Setiap penanda
juga merupakan `<button>` sungguhan dengan `aria-label` yang menyebutkan nama
fasilitas, tipe, dan pita prioritas dalam kata — peta yang satu-satunya cara
pakainya adalah klik tetikus pada titik berwarna tidak dapat digunakan oleh
sebagian audiens.

## 6.2 Komponen tahap UI (Prompt 7)

| Komponen | Berkas | Peran |
|---|---|---|
| `StatCard` | `components/ui/StatCard.tsx` | satu angka utama; `value` bertipe string sehingga komponen ini tidak pernah memformat angka dan tidak dapat mengubah nilai hilang menjadi 0 |
| `DistributionBar` | `components/ui/DistributionBar.tsx` | distribusi hitungan; setiap baris menuliskan angkanya sendiri, bar bukan satu-satunya cara membacanya |
| `EmptyState` | `components/ui/EmptyState.tsx` | selalu menyebut sebab kosong dan apa yang mengubahnya |
| `StatusBadges` | `components/ui/StatusBadges.tsx` | chip prioritas, keyakinan, status skor, rekomendasi, tipe fasilitas |

## 7. Layout dan responsivitas

- Lebar konten maksimum `max-w-6xl`, padding sisi `px-4` pada seluruh lebar
  layar.
- Grid memakai `sm:` dan `md:` untuk menumpuk pada layar sempit.
- Breakpoint tambahan `xs: 480px` tersedia di konfigurasi Tailwind.
- Body memakai `flex min-h-screen flex-col` sehingga footer selalu berada di
  bawah, termasuk pada halaman berkonten pendek.

Diverifikasi pada 390px (ponsel), 834px (tablet), dan 1440px (desktop):
`scrollWidth - clientWidth = 0` pada seluruh halaman, tanpa error JavaScript.
Tangkapan layar di `docs/screenshots/`.

Kartu popup peta berlabuh ke bawah pada layar sempit dan ke kanan-atas pada
layar lebar. Balon yang ditambatkan ke titik akan menutupi peta atau jatuh ke
luar layar pada ponsel; kartu berlabuh tidak.
