# KUBU_RAYA_PILOT_JUSTIFICATION.md

> **Pembaruan aktif Prompt 3 — 2026-09-14:** bagian lama berikut adalah riwayat riset. Keputusan MVP ada di [laporan final](PROMPT_3_FINAL_DATA_ACQUISITION_REPORT.md) dan [readiness](PROMPT_4_READINESS.md). Pool 10 official_exact dikunci; beneficiary FROZEN FOR MVP (4 canonical, 6 NULL). Request student_count/population proxy lama tidak aktif. Lisensi GSA CC BY 4.0 verified via external_manual_verification; gate lisensi tidak perlu dibuka ulang. [Permintaan nilai aktif](EXTERNAL_SOLAR_HAZARD_REQUESTS.md). Pernyataan lama “koordinat belum tersedia”, “lisensi belum verified”, atau “proxy boleh menjadi beneficiary” tidak berlaku untuk 10 kandidat MVP.

**Revisi:** Prompt 2.5 (Evidence Verification & Research Repair), 2026-09-12.
**Metode penilaian:** sesuai §I Prompt 2.5 — dinilai berdasarkan **kualitas evidence**, bukan jumlah sumber. Status pilot TIDAK dinaikkan hanya karena banyak sumber ditemukan.

> ⚠️ **Kondisi verifikasi:** WebFetch ditolak `EGRESS_BLOCKED` untuk seluruh 7 domain prioritas yang diuji. **Nol evidence terverifikasi primer.** Seluruh penilaian di bawah adalah penilaian atas evidence yang belum terverifikasi, dan karenanya **status pilot di §9 bersifat PROVISIONAL.**

---

## 1. Tujuan Pilot

Menilai apakah Kabupaten Kubu Raya, Kalimantan Barat cukup relevan dan data-supported untuk digunakan sebagai **proof-of-concept metodologi prioritisasi SURYA-SIAGA** — bukan untuk membuktikan Kubu Raya sebagai "lokasi PLTS terbaik di Indonesia" (§6 `PROJECT_CONTEXT.md`).

---

## Temuan Struktural yang Membingkai Seluruh Penilaian

Verification pass ini memunculkan satu pola yang tidak terlihat pada Prompt 2, dan pola ini lebih menentukan daripada penilaian per-dimensi mana pun:

> **Evidence terkuat yang dimiliki proyek ini berada pada level KABUPATEN, sedangkan data yang benar-benar dibutuhkan MVP berada pada level SITUS — dan justru level situs itulah yang paling kosong.**

- Evidence kuat (IRBI kekeringan "tinggi", prioritas karhutla nasional, momentum PLTS 100 GWp) semuanya **berlaku identik untuk seluruh kandidat di dalam Kubu Raya**, sehingga **nol daya pembeda** dalam skoring antar-fasilitas. Evidence ini membenarkan *pemilihan wilayah*, bukan *prioritisasi di dalamnya*.
- Data yang memberi daya pembeda antar-situs — koordinat fasilitas, jumlah penerima manfaat per fasilitas, kapasitas PLTS per lokasi — berstatus `NOT_AVAILABLE` atau `DO_NOT_USE`.

Implikasinya: kekuatan justifikasi wilayah **tidak otomatis menjadi kekuatan dataset pilot**. Keduanya harus dinilai terpisah, dan itulah yang dilakukan di bawah.

---

## 2. Solar Resource Data Availability

| Aspek | Penilaian |
|---|---|
| Ketersediaan sumber | Global Solar Atlas mencakup Kubu Raya secara otomatis (cakupan global). NASA POWER juga, tapi sudah direklasifikasi `NOT_REQUIRED` untuk screening spasial. |
| Kualitas evidence | **LEMAH.** Spesifikasi (satuan, resolusi, CRS, lisensi) seluruhnya `unverified`. **Tidak ada satu pun nilai GHI Kubu Raya aktual** yang pernah diambil atau diverifikasi. |
| Catatan fisik penting | Bahkan bila terverifikasi, GHI di kabupaten dataran rendah seperti Kubu Raya didorong oleh tutupan awan skala regional, bukan topografi lokal — sehingga **variasi antar-kandidat kemungkinan kecil**. Daya pembeda dimensi ini terhadap prioritisasi antar-situs patut dipertanyakan sejak awal. |
| Status | `MANUAL_VERIFICATION_REQUIRED` (MA-01) |

**Kekuatan dimensi: LEMAH** — bukan karena data tidak ada, tapi karena belum ada apa pun yang diverifikasi, dan relevansi diskriminatifnya belum terbukti.

## 3. Existing PLTS Evidence

| Aspek | Penilaian |
|---|---|
| Keberadaan (3 desa Batu Ampar) | **SEDANG.** Dikorroborasi sumber Tier A (BPK Kalbar) dan beberapa sumber lain, konsisten lintas pencarian. Ini evidence existing-PLTS terbaik yang dimiliki proyek. |
| Atribut kuantitatif | **SANGAT LEMAH.** Kapasitas `conflicting` → NULL (CF-001). KK terlayani `conflicting`. Rincian per-desa `NOT_AVAILABLE`. Koordinat `NOT_AVAILABLE`. |
| Kondisi terkini | **TIDAK ADA.** Tidak satu pun sumber menjelaskan status 2026 — padahal jalur rekomendasi "Expansion Assessment" (§12 `PROJECT_CONTEXT.md`) bergantung pada ini. |
| Konsistensi dengan PROJECT_CONTEXT | ⚠️ Angka di §11 `PROJECT_CONTEXT.md` (329/402 KK) **tidak cocok** dengan angka riset (312 KK). Belum jelas mana yang benar. |

**Kekuatan dimensi: SEDANG untuk keberadaan, SANGAT LEMAH untuk atribut.** Cukup untuk menyatakan "Kubu Raya punya PLTS eksisting", tidak cukup untuk menilai satu pun dari ketiganya.

## 4. Public Facility Data Availability

| Aspek | Penilaian |
|---|---|
| Keberadaan platform | **SEDANG.** Portal puskesmas kabupaten, fasyankes provinsi, dan referensi Kemendikdasmen semuanya eksis dan tampak aktif. |
| Field yang dibutuhkan | **LEMAH.** `latitude`/`longitude` **tidak terkonfirmasi tersedia di mana pun** (NA-01). Kelengkapan antar-fasilitas tidak seragam (sebagian halaman disebut "masih dalam proses pengumpulan data"). |
| Dampak | Koordinat adalah **prasyarat mutlak** untuk Solar Resilience Map dan seluruh operasi geospasial. Tanpa itu, fitur MVP #1 tidak dapat dibangun. |

**Kekuatan dimensi: LEMAH** — platform ada, tapi field paling kritis belum terbukti tersedia.

## 5. Social/Demographic Data Availability

| Aspek | Penilaian |
|---|---|
| Keberadaan | **KUAT.** BPS Kubu Raya menerbitkan secara berkala dan terstruktur (kabupaten + kecamatan), arsip multi-tahun. |
| Granularitas vs kebutuhan | **LEMAH.** Maksimum kecamatan; `beneficiary_count` per fasilitas `NOT_AVAILABLE` (NA-02). |
| Risiko metodologis | Menggunakan populasi kecamatan sebagai penerima manfaat satu fasilitas akan melanggar aturan proyek sendiri kecuali dilabeli proxy secara eksplisit. |
| Keterkinian | Edisi 2026 **tidak terkonfirmasi ada**; edisi terbaru yang diketahui 2025 (data 2024). |

**Kekuatan dimensi: KUAT untuk ketersediaan, LEMAH untuk granularitas yang dibutuhkan produk.**

## 6. Disaster/Resilience Relevance

| Aspek | Penilaian |
|---|---|
| Kekeringan (IRBI BNPB) | **SEDANG-KUAT sebagai konteks kabupaten** — disebut eksplisit, konsisten 2 tahun terbitan, dari lembaga resmi. **Tapi `NOT_REQUIRED` sebagai input skoring situs** (NR-03): skala belum terverifikasi DAN nilainya identik untuk semua kandidat. |
| Karhutla (inisiatif pemerintah 2025–2026) | **SEDANG.** Kubu Raya disebut eksplisit sebagai 1 dari 3 kabupaten prioritas. Namun petanya masih finalisasi — belum tentu tersedia saat MVP dibangun. |
| Karhutla (3 paper akademik) | **SEDANG.** Ketiganya spesifik Kubu Raya dan sub-kabupaten (ada daya pembeda spasial). Direklasifikasi dari "conflicting" menjadi `DIFFERENT_METRIC` — bukan konflik, tapi **produk harus memutuskan dulu apakah `wildfire_risk` berarti bahaya atau risiko** (keputusan ini belum diambil). |

**Kekuatan dimensi: PALING KUAT di antara keenam dimensi** — ini satu-satunya dimensi dengan evidence spesifik-Kubu Raya dari lembaga resmi. Namun sebagian besar kekuatannya berada di level kabupaten (konteks), bukan level situs (skoring).

## 7. Traceable Data Availability

| Aspek | Penilaian |
|---|---|
| Rantai provenance | **KUAT.** Setiap evidence memiliki URL, penerbit, tier otoritas, dan status verifikasi yang tercatat. Fitur MVP #6 (Data Confidence & Traceability) memiliki bahan nyata untuk ditampilkan. |
| Kualitas isi yang dilacak | **LEMAH.** Traceability yang baik terhadap konten yang belum terverifikasi tetap tidak menghasilkan fakta. Rantai lengkap, ujungnya belum dibuka. |
| Nilai produk | Secara tak terduga, kondisi ini justru **mendemonstrasikan nilai fitur Data Confidence**: proyek ini sendiri saat ini akan diberi label `NEEDS VERIFICATION` oleh sistemnya sendiri. |

**Kekuatan dimensi: KUAT untuk struktur, LEMAH untuk isi.**

---

## 8. Limitations

1. **Nol evidence terverifikasi primer** — seluruh penilaian bersandar pada evidence `unverified`. Ini keterbatasan lingkungan riset (blokir egress), bukan bukti bahwa datanya salah.
2. **Koordinat fasilitas `NOT_AVAILABLE`** — blocker struktural untuk seluruh fitur geospasial.
3. **`beneficiary_count` per fasilitas `NOT_AVAILABLE`** — memaksa penggunaan proxy berlabel atau pengumpulan data primer.
4. **Seluruh angka kuantitatif PLTS eksisting `DO_NOT_USE`** — jalur "Expansion Assessment" saat ini tidak punya dasar data.
5. **Evidence terkuat tidak memiliki daya pembeda antar-situs** (level kabupaten).
6. **Ketidaksesuaian angka dengan `PROJECT_CONTEXT.md` §11** belum terselesaikan.
7. **Keputusan metrik `wildfire_risk` (bahaya vs risiko) belum diambil** — konsekuensi langsung dari reklasifikasi CF-002.

### Mengapa keterbatasan ini TIDAK otomatis berarti pilot yang salah

Poin penting untuk penilaian jujur: keterbatasan #2, #3, dan #7 adalah **karakteristik umum ekosistem data publik Indonesia**, bukan kelemahan khusus Kubu Raya. Berpindah ke kabupaten lain **kemungkinan besar tidak menyelesaikannya** — dan akan mengorbankan satu-satunya keunggulan nyata Kubu Raya (PLTS eksisting terdokumentasi + relevansi bencana yang disebut eksplisit oleh BNPB). Karena itu keterbatasan ini dinilai sebagai **biaya yang harus dikelola**, bukan alasan mengganti pilot.

---

## 9. Kesimpulan

> ## ✅ VIABLE PILOT WITH STRONG DATA PATHWAYS
> **(diperbarui Prompt 2.6 berdasarkan `external_manual_verification`)**
>
> Tidak mengklaim Kubu Raya sebagai lokasi PLTS terbaik. Yang dinyatakan: **jalur sumber data untuk seluruh komponen utama MVP kini terverifikasi tersedia.**

### Dasar perubahan status (Prompt 2.5 → 2.6)

Enam dari tujuh dimensi kini memiliki **jalur sumber terverifikasi** — diverifikasi di environment lain (`external_manual_verification`), bukan oleh environment agent ini:

| Dimensi | Prompt 2.5 | **Prompt 2.6** | Evidence |
|---|---|---|---|
| Solar resource | LEMAH | ✅ **KUAT** — GSA ditetapkan primary spatial screening source (9 arcsec ≈250 m, EPSG:4326, GeoTIFF) | EV-D, EV-E |
| Existing PLTS | SEDANG (keberadaan) / SANGAT LEMAH (atribut) | ✅ **KUAT untuk keberadaan** (`verified_primary`, ketiga desa disebut eksplisit oleh BPK) / **tetap SANGAT LEMAH untuk atribut** | EV-F |
| Public facility | LEMAH | ✅ **SEDANG-KUAT** — portal pendidikan terverifikasi termasuk **jalur koordinat**; portal kesehatan terverifikasi sebagai data path | EV-G, EV-H |
| Social/demographic | KUAT (ketersediaan) / LEMAH (granularitas) | ✅ **KUAT untuk ketersediaan** — edisi 2026 terverifikasi terbit / **granularitas tetap kecamatan** | EV-B |
| Disaster/resilience | PALING KUAT (konteks) | ✅ **KUAT** — layer karhutla &amp; kekeringan terverifikasi ada; pembedaan hazard/risk dikonfirmasi BNPB | EV-C |
| Traceable data | KUAT (struktur) / LEMAH (isi) | ✅ **KUAT** — kini ada isi terverifikasi pada ujung rantai provenance, bukan hanya struktur | EV-A – EV-H |

**Yang TIDAK berubah, dan ini penting:** seluruh **angka** tentang Kubu Raya tetap tidak boleh dipakai. Yang naik adalah **keberadaan sumber dan jalur datanya**, bukan isi angkanya. `capacity_kwp` tetap NULL (CF-001), `commissioning_year` tetap NULL (CF-006), skor IRBI tetap dilarang sebagai input skoring situs (CF-003), dan `beneficiary_count` per fasilitas tetap tidak tersedia.

**Temuan struktural dari Prompt 2.5 sebagian terjawab:** kekhawatiran "evidence kuat hanya di level kabupaten, kosong di level situs" kini berkurang — EV-G memberi jalur **koordinat per sekolah** dan EV-D memberi raster **250 m** yang secara teknis dapat membedakan titik. Namun daya pembeda riil GHI antar-titik di kabupaten dataran rendah masih harus dibuktikan secara empiris saat akuisisi, dan koordinat puskesmas belum punya jalur terverifikasi.

**Mengapa masih ada kualifikasi "with limitations" pada substansinya:** seluruh angka kuantitatif tentang PLTS eksisting tetap `DO_NOT_USE`; `beneficiary_count` per fasilitas tetap tidak tersedia; koordinat puskesmas belum terverifikasi; dan **kelayakan FINAL dataset kandidat belum terbukti sampai Prompt 3–4 selesai.** Status ini menyatakan bahwa **jalur datanya kuat**, bukan bahwa datanya sudah ada di tangan.

**Mengapa bukan `WEAK PILOT — RECONSIDER`:** tidak satu pun temuan mengindikasikan Kubu Raya adalah pilihan buruk. Kabupaten ini memiliki PLTS eksisting yang kini **terverifikasi secara primer** di tiga desa (langka dan berharga untuk menguji jalur Expansion Assessment), memiliki layer bencana resmi yang relevan, dan ekosistem data publiknya (BPS 2026, Dapodik, portal kesehatan) terverifikasi aktif.

### Kondisi yang akan MENURUNKAN status ini menjadi WEAK PILOT — RECONSIDER

Status ini harus diturunkan apabila verifikasi manual menghasilkan salah satu dari:

1. Keberadaan PLTS komunal di ketiga desa Batu Ampar **tidak terkonfirmasi** oleh sumber primer; **atau**
2. Koordinat fasilitas publik terbukti **tidak dapat diperoleh** bahkan melalui permintaan langsung ke dinas terkait; **atau**
3. Klasifikasi risiko kekeringan/karhutla Kubu Raya **tidak terkonfirmasi** di dokumen resmi BNPB; **atau**
4. Tidak ada sumber mana pun yang dapat memberi data pembeda antar-situs di dalam kabupaten (sehingga prioritisasi menjadi latihan kosong).

### Kondisi yang akan MENAIKKAN status ini menjadi STRONG PILOT CANDIDATE

1. Enam item blocker `MANUAL_VERIFICATION_REQUIRED` prioritas 1 terkonfirmasi; **dan**
2. Koordinat fasilitas diperoleh untuk minimal 10 kandidat; **dan**
3. CF-001 terselesaikan sehingga minimal satu situs PLTS eksisting memiliki kapasitas terverifikasi; **dan**
4. Minimal satu sumber data risiko bencana dengan **daya pembeda sub-kabupaten** terkonfirmasi dapat diunduh.
