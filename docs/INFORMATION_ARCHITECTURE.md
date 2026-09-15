# INFORMATION ARCHITECTURE — SURYA-SIAGA

Status: scaffold (Prompt 5). Rute dan hierarki informasi ditetapkan; konten UI
final menyusul.

---

## 1. Prinsip penataan

Pengguna utama adalah perencana/analis di tingkat kabupaten yang perlu
menjawab satu pertanyaan: *fasilitas mana yang layak ditindaklanjuti dengan
asesmen teknis, dan seberapa kuat dasarnya?*

Dua pertanyaan itu tidak digabung. Setiap layar yang menampilkan skor prioritas
juga menampilkan keyakinan data, sebagai dua penanda terpisah. Skor tinggi di
atas bukti lemah bukan rekomendasi, dan tata letak tidak boleh membuatnya
tampak demikian.

---

## 2. Peta rute

| Rute | Nama navigasi | Pertanyaan yang dijawab | Status |
|---|---|---|---|
| `/` | Ringkasan | Kandidat mana yang teratas, dan seberapa kuat buktinya? | **Selesai** — hero, 5 kartu ringkas, 3 distribusi, peringkat |
| `/map` | Peta | Di mana kandidat berada secara geografis? | **Selesai** — MapLibre, 5 filter + reset, popup, legenda |
| `/sites/[id]` | — | Mengapa situs ini mendapat skor tersebut? | **Selesai** — hero metric, breakdown, why, observasi, sumber |
| `/compare` | Bandingkan | Bagaimana 2–4 kandidat berbeda? | **Selesai** — selektor, matriks, coverage, catatan deterministik |
| `/methodology` | Metodologi | Bagaimana skor dihitung, dan apa statusnya? | **Selesai** — 10 langkah, formula, batasan |
| `/data-sources` | Sumber Data | Dari mana angka ini berasal? | **Selesai** — katalog sumber, lisensi, atribusi |
| `/about` | Tentang | Apa yang sistem ini lakukan dan tidak lakukan? | Selesai |

Navigasi global berisi enam tautan. `/sites/[id]` tidak muncul di navigasi; ia
dicapai dari peringkat di `/` atau dari peta.

---

## 3. Hierarki per halaman

### 3.1 `/` — Ringkasan

1. Judul + satu kalimat yang menyatakan skor dan keyakinan dilaporkan terpisah.
2. Tiga kartu ringkas: jumlah situs dinilai, distribusi keyakinan data, status
   metodologi.
3. Daftar peringkat: peringkat padat, nama fasilitas, kecamatan, penanda seri,
   badge keyakinan, skor, pita prioritas.

Distribusi keyakinan data diletakkan **sebelum** daftar peringkat, bukan
sesudah. Pembaca melihat bahwa tidak satu pun situs berkeyakinan HIGH sebelum
ia membaca angka peringkat.

### 3.2 `/sites/[id]` — Detail situs

1. Identitas: nama, tipe, kecamatan, `record_id`.
2. Tiga badge sejajar: status skor, keyakinan data, tipe rekomendasi.
3. Skor prioritas **berdampingan** dengan kontribusi per dimensi — angka tunggal
   tidak pernah berdiri sendiri tanpa dekomposisinya.
4. Pernyataan cakupan bobot ("dihitung atas 70% dari total bobot baseline").
5. Dasar keyakinan data, sebagai kalimat penuh.
6. Cakupan spasial nilai bahaya, per jenis bahaya.
7. Keterbatasan.

Dimensi yang tidak tersedia ditampilkan sebagai baris eksplisit
"Tidak tersedia (dikeluarkan dari pembilang dan penyebut)" — bukan dihilangkan
dari daftar. Menyembunyikan dimensi yang hilang akan menyembunyikan bahwa skor
bertumpu pada basis yang lebih sempit.

### 3.3 `/compare`

Peringatan komparabilitas muncul di atas alat banding, bukan sebagai catatan
kaki, dan hanya bila dataset memang mengandung cakupan bobot yang berbeda.

### 3.4 `/methodology`

Urutan sengaja dimulai dari **status bobot**, bukan dari nilai bobot: pembaca
mengetahui bahwa bobot adalah asumsi desain MVP dan bukan hasil AHP
tervalidasi sebelum melihat angkanya.

### 3.5 `/data-sources`

Tabel cakupan sumber per situs. Tahun data terbaru ditampilkan per situs
sehingga data lama terlihat tanpa perlu membuka detail.

---

## 4. Penanganan ketiadaan data

Satu komponen, `MissingValue`, menangani seluruh kasus. Aturannya:

- teks eksplisit "Tidak tersedia", dalam huruf miring;
- opsional disertai alasan singkat dalam kurung;
- tidak pernah `0`, tidak pernah `-`, tidak pernah sel kosong.

Sel kosong dapat dibaca sebagai nol oleh pembaca yang terburu-buru. Itu persis
kekeliruan yang aturan NULL-never-zero ada untuk mencegah.

---

## 5. Cakupan spasial sebagai informasi kelas satu

Setiap nilai berskala non-situs disertai pernyataan cakupannya melalui
`SCOPE_LABEL`:

- `site_point` → "Nilai pada titik fasilitas"
- `kecamatan_proxy` → "Proksi tingkat kecamatan — bukan nilai di titik fasilitas"
- `kabupaten_context_only` → "Konteks tingkat kabupaten — tidak membedakan antarsitus"
- `unknown` → "Cakupan spasial tidak tercatat"

Kelas bahaya karhutla pada dataset ini seluruhnya `kecamatan_proxy`. Tanpa
pernyataan ini, pembaca akan membaca "Tinggi" sebagai pengukuran di fasilitas.

---

## 5.1 Keterlacakan per lapis data (Prompt 7)

Halaman situs memuat satu baris provenance untuk **setiap lapis data** yang
benar-benar memiliki sumber: identitas fasilitas, koordinat, penerima manfaat,
GHI, bahaya karhutla, bahaya kekeringan. Lapis tanpa catatan interim tidak
menghasilkan baris sama sekali — baris kosong akan terbaca seolah-olah ada
sumber. HLT-002, misalnya, tidak memiliki baris penerima manfaat.

Setiap baris menyebut nama sumber (tertaut bila ada URL), tahun/rujukan,
status verifikasi, dan cakupan spasial. Tiga badge, masing-masing dari kondisi
eksplisit, bukan penilaian subjektif:

| Badge | Kondisi |
|---|---|
| **Historical Data** | tahun rujukan sumber lebih lama dari tahun data terbaru situs ini |
| **Provisional Proxy** | cakupan bukan tingkat situs (kecamatan/kabupaten), atau observasi ditandai provisional |
| **Menunggu verifikasi** | lapis sumber sendiri menyatakan nilainya belum terverifikasi |

Angka "jumlah lapis sumber" pada ringkasan keterlacakan dihitung dari baris
yang benar-benar ditampilkan, sehingga tidak dapat berbeda dari daftar di
sebelahnya.

## 5.2 Dua jenis ketiadaan data dibedakan

Pada score breakdown, dimensi tanpa nilai memakai salah satu dari dua label:

- **Pending verification** — nilainya ada tetapi belum dikonfirmasi (Solar/GHI
  menunggu ekstraksi per titik);
- **Data belum tersedia** — nilainya belum diperoleh sama sekali.

Keduanya keadaan berbeda dan tidak boleh disamakan. Tidak satu pun dirender
sebagai 0, dan barisnya tetap ditampilkan lengkap dengan bobot baseline yang
tidak ikut dihitung.

## 5.3 Aturan kesetaraan perbandingan (Prompt 8)

> **Tidak ada peringkat global yang diterbitkan selama situs dinilai atas
> himpunan dimensi yang berbeda.**

Dataset memuat tiga bidang yang menegakkan aturan ini:

| Bidang | Isi |
|---|---|
| `coverage_profile` | himpunan dimensi yang menyusun skor, mis. `criticality+resilience+social` |
| `available_dimension_count` | 2, 3, atau 4 |
| `global_rank_eligible` | benar hanya bila keempat dimensi tersedia |

Saat ini terdapat **dua profil cakupan** (4 situs pada 3/4 dimensi, 6 situs pada
2/4) dan **0 situs** yang `global_rank_eligible`.

Konsekuensinya terhadap UI:

- **Ringkasan** mengelompokkan peringkat per profil cakupan. Peringkat `#1`
  hanya berlaku di dalam kelompoknya; dua situs dapat sama-sama `#1` pada
  kelompok berbeda, dan keduanya tidak saling mengklaim lebih tinggi.
- **Bandingkan** menampilkan peringatan *"Nilai tidak sepenuhnya sebanding
  karena kelengkapan dimensinya berbeda"* ketika profil berbeda, dan
  **menahan** catatan "skor provisional lebih tinggi" sepenuhnya dalam kasus
  itu.
- Tidak ada layar yang menampilkan "situs terbaik", "pemenang", atau "paling
  direkomendasikan". Diuji oleh audit bahasa di
  `src/lib/__tests__/no-overclaim.test.ts`.

## 5.4 Catatan perbandingan bersifat deterministik

Catatan pada halaman Bandingkan diturunkan dengan aturan tetap dari nilai yang
benar-benar ada (`src/lib/compare/insights.ts`). **Tidak ada model bahasa yang
berjalan saat halaman dibuka.** Dua aturan mengikat seluruh modul:

1. Tidak ada pernyataan yang dibuat dari nilai kosong. Nilai yang hilang
   menghasilkan pengamatan "belum tersedia" secara eksplisit, atau tidak
   menghasilkan pernyataan sama sekali — tidak pernah nilai rendah yang
   tersirat.
2. Tidak ada pernyataan yang menyebut pemenang atau situs terbaik, dan tidak
   ada perbandingan skor yang dibuat ketika basis buktinya berbeda.

## 6. Disclosure permanen

Footer muncul di setiap halaman dan memuat dua pernyataan: status prototipe
independen (tanpa afiliasi Pemda/PLN/ESDM), dan batas kegunaan keluaran
(pre-screening, bukan studi kelayakan). Keduanya adalah fakta tentang
keseluruhan produk; menempatkannya hanya di satu halaman akan membiarkan
pembaca membawa asumsi yang salah ke halaman lain.
