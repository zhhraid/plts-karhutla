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
| `/` | Ringkasan | Kandidat mana yang teratas, dan seberapa kuat buktinya? | Scaffold fungsional — peringkat nyata dari dataset |
| `/map` | Peta | Di mana kandidat berada secara geografis? | Placeholder + daftar koordinat |
| `/sites/[id]` | — | Mengapa situs ini mendapat skor tersebut? | Scaffold fungsional — breakdown dimensi nyata |
| `/compare` | Bandingkan | Bagaimana dua kandidat berbeda? | Placeholder + peringatan komparabilitas |
| `/methodology` | Metodologi | Bagaimana skor dihitung, dan apa statusnya? | Scaffold fungsional — bobot dibaca dari dataset |
| `/data-sources` | Sumber Data | Dari mana angka ini berasal? | Scaffold fungsional — cakupan sumber per situs |
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

## 6. Disclosure permanen

Footer muncul di setiap halaman dan memuat dua pernyataan: status prototipe
independen (tanpa afiliasi Pemda/PLN/ESDM), dan batas kegunaan keluaran
(pre-screening, bukan studi kelayakan). Keduanya adalah fakta tentang
keseluruhan produk; menempatkannya hanya di satu halaman akan membiarkan
pembaca membawa asumsi yang salah ke halaman lain.
