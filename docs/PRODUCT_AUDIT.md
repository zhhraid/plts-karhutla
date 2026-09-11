# PRODUCT_AUDIT.md — Product & Competition Readiness Audit

**Proyek:** SURYA-SIAGA
**Kompetisi:** INFINITERA 2.0 — Web Development Competition
**Sumber:** Audit ini disusun murni berdasarkan `PROJECT_CONTEXT.md` (dibaca penuh) dan penalaran produk/metodologi. **Tidak ada klaim numerik atau faktual baru yang ditambahkan** — semua kekurangan bukti secara eksplisit ditandai `requires_verification`, sesuai Aturan Integritas Data di `PROJECT_CONTEXT.md` §8.
**Sifat dokumen:** Audit, bukan keputusan. Tidak ada perubahan pada positioning, terminologi, atau metodologi yang dilakukan lewat dokumen ini.

---

## Ringkasan Eksekutif

Kerangka konseptual SURYA-SIAGA (positioning, prinsip integritas data, pemisahan Data Confidence dari Priority Score) **sudah kuat dan disiplin** dibanding kebanyakan proyek DSS kompetisi mahasiswa. Namun, ada **gap signifikan antara kerangka konseptual dan bahan yang dibutuhkan untuk proposal kompetisi yang defensible**: urgensi belum bersumber, novelty belum diverifikasi terhadap tool eksisting, primary user belum didefinisikan, dan beberapa parameter inti (bobot, formula Data Confidence) masih terbuka. Ini bukan cacat desain — ini adalah pekerjaan riset/dokumentasi yang belum dilakukan. Lihat §11 (Blocking Issues) di bagian akhir.

---

## 1. Problem–Solution Fit

**Problem yang diklaim:** proses prioritisasi pengembangan/penguatan PLTS di Indonesia (khususnya wilayah seperti Kubu Raya) tidak dilakukan dengan kerangka eksplisit yang menggabungkan potensi surya, criticality fasilitas, dan risiko bencana/resilience.

**Solution:** DSS geospasial yang mengagregasi kriteria tersebut menjadi skor yang explainable dan traceable.

**Penilaian fit:** Secara logis konsisten — jika premis masalah benar, solusi yang diusulkan (agregasi multi-kriteria + explainability + confidence) memang menjawabnya secara langsung, bukan tangensial.

**Namun:** premis masalah ("proses prioritisasi PLTS saat ini tidak sistematis/tidak berbasis data gabungan") **belum didukung sumber apa pun** di `PROJECT_CONTEXT.md`. Ini adalah klaim yang harus dibuktikan, bukan diasumsikan — juri kompetisi serius akan menantang ini. Lihat §2.

---

## 2. Apakah Masalah Ini Nyata?

Untuk menyatakan masalah ini nyata (bukan asumsi tim), proposal memerlukan salah satu atau kombinasi bukti berikut — **belum ada satu pun yang tercantum/diverifikasi di `PROJECT_CONTEXT.md`**:

- Data rasio elektrifikasi/desa belum terlistrik penuh di Kubu Raya atau Kalimantan Barat (sumber potensial: Kementerian ESDM, PLN Wilayah Kalbar, BPS).
- Bukti bahwa keputusan lokasi PLTS/PLTS komunal selama ini dilakukan tanpa kerangka multi-kriteria terdokumentasi (sumber potensial: laporan evaluasi program EBT ESDM, Bappenas, atau studi akademik).
- Bukti kondisi kelistrikan fasilitas kritis (puskesmas/sekolah terpencil) yang bermasalah (sumber potensial: Kemenkes, Kemendikdasmen, Dinkes/Dinas Pendidikan Kubu Raya).

**Status:** `requires_verification`. Tanpa ini, "urgensi" dalam proposal akan generik ("energi terbarukan itu penting") alih-alih spesifik-lokal — kelemahan yang mudah diserang di sesi Q&A.

---

## 3. Apakah Website Benar-Benar Dibutuhkan (vs. Spreadsheet/GIS Biasa)?

Ini pertanyaan jujur yang harus dijawab tim sendiri, bukan diasumsikan sebagai "tentu saja butuh web app".

**Argumen yang valid untuk web app:**
- Explainable Priority Score dengan breakdown interaktif per kriteria sulit dikomunikasikan secara efektif lewat spreadsheet statis ke stakeholder non-teknis (kepala dinas, pengambil kebijakan).
- Layer geospasial (GHI raster, zona risiko, titik fasilitas) yang dapat di-toggle dan di-zoom memberi nilai komunikasi yang tidak dimiliki peta statis/QGIS export.
- Site Insight & Site Comparison sebagai UX terstruktur (bukan tabel mentah) menurunkan friksi bagi pengguna non-GIS.
- Traceability (klik data point → sumber) lebih natural sebagai hyperlink web daripada catatan kaki spreadsheet.

**Argumen yang harus diakui secara jujur (bukan overclaim):**
- Untuk **skala data MVP (10–15 lokasi)**, perhitungan Priority Score itu sendiri **secara matematis** bisa sepenuhnya dilakukan di spreadsheet atau QGIS tanpa web app apa pun. Nilai tambah web app pada tahap ini **bukan** karena kebutuhan komputasi, melainkan **usability, komunikasi ke non-teknis, dan skalabilitas ke jumlah lokasi/pengguna yang lebih besar di masa depan**.
- Proposal sebaiknya menyatakan ini secara eksplisit dan jujur, bukan mengklaim "spreadsheet tidak mampu melakukan ini" (klaim yang salah dan mudah dipatahkan juri teknis).

**Rekomendasi framing:** "Pada skala pilot, perhitungan bisa dilakukan manual; nilai platform web terletak pada explainability interaktif, aksesibilitas multi-stakeholder, dan kesiapan skala — bukan pada kompleksitas komputasi semata."

---

## 4. Diferensiasi dari Tools Eksisting

| Tool pembanding | Fokus tool tersebut | Perbedaan SURYA-SIAGA |
|---|---|---|
| **Global Solar Atlas** | Data potensi radiasi surya (GHI/DNI) global, berbasis raster. Tidak ada dimensi sosial, fasilitas, atau risiko bencana. | SURYA-SIAGA menggunakan GHI sebagai *salah satu* input, bukan output akhir — output akhirnya adalah prioritas per-fasilitas yang menggabungkan kebutuhan sosial & risiko. |
| **InaRISK** | Peta risiko multi-bencana nasional (termasuk karhutla, kekeringan). Tidak menggabungkan dengan potensi energi atau prioritisasi infrastruktur energi. | SURYA-SIAGA memakai data risiko bencana sebagai *satu kriteria* dalam skor gabungan yang berorientasi keputusan investasi PLTS, bukan sebagai peta risiko berdiri sendiri. |
| **Dashboard PLTS umum (mis. capaian EBT ESDM/PLN)** | Umumnya bersifat monitoring/pelaporan capaian agregat (kapasitas terpasang, progres proyek). | SURYA-SIAGA berorientasi *pre-screening lokasi baru/ekspansi*, bukan pelaporan capaian yang sudah berjalan. |
| **Peta risiko bencana umum** | Single-domain (risiko saja), tanpa keterkaitan ke keputusan investasi energi spesifik. | SURYA-SIAGA mengintegrasikan risiko sebagai komponen Resilience Need Score yang memengaruhi prioritas, bukan sekadar visualisasi. |
| **Solar calculator (mis. PVWatts-type tools)** | Estimasi output energi teknis untuk *satu* lokasi yang sudah ditentukan (sizing/engineering). | SURYA-SIAGA beroperasi *sebelum* tahap sizing — membantu memilih *lokasi mana* yang layak dikaji lebih lanjut, bukan menghitung output sistem yang sudah dipilih. |

**Catatan penting:** Tabel di atas adalah **analisis konseptual berdasarkan deskripsi umum tool-tool tersebut**, bukan hasil studi literatur/pasar sistematis. Sebelum tabel ini dipakai di proposal sebagai bukti diferensiasi, tim **wajib melakukan pengecekan langsung** (situs resmi masing-masing tool, dokumentasi fitur terbaru) karena tool-tool ini bisa saja sudah menambahkan fitur yang mengurangi klaim diferensiasi. Status: `requires_verification`.

---

## 5. Novelty yang Defensible

Novelty SURYA-SIAGA **bukan** pada komponen individual (GHI, data risiko bencana, MCDA — semuanya sudah ada dan mapan), melainkan pada **desain integrasi dan tata kelola keputusan**:

1. **Kombinasi domain pada level fasilitas spesifik** — solar potential + criticality fasilitas + beneficiary + risiko bencana + PLTS eksisting digabung menjadi satu skor per-lokasi, bukan per-wilayah administratif umum.
2. **Pemisahan eksplisit Data Confidence dari Priority Score** — desain yang secara sengaja tidak mencampur "seberapa baik lokasi ini" dengan "seberapa yakin kita pada datanya". Ini adalah keputusan desain yang relatif jarang ditemukan di dashboard sejenis, yang sering menyembunyikan ketidakpastian data.
3. **Explainability sebagai fitur inti, bukan tambahan** — skor tidak ditampilkan sebagai angka tunggal, melainkan dengan breakdown kontribusi per kriteria dan tautan ke sumber data mentah.

**Yang TIDAK boleh diklaim sebagai novelty:**
- "Algoritma baru" — MCDA/AHP adalah metode yang sudah mapan sejak lama.
- "Pertama di Indonesia" atau "tidak ada yang seperti ini" — klaim ini **belum diverifikasi** (lihat §4) dan sangat berisiko dipatahkan juri yang mengetahui tool serupa lain.
- "Data eksklusif/proprietary" — semua sumber data yang direncanakan adalah data publik/Tier 1–2.

**Rekomendasi:** proposal menempatkan novelty pada *level desain keputusan dan tata kelola data* (poin 1–3 di atas), bukan pada klaim keunikan absolut di pasar.

---

## 6. Primary User

**Temuan audit:** `PROJECT_CONTEXT.md` **tidak mendefinisikan primary user secara eksplisit**. Ini adalah gap struktural, bukan detail kecil — tanpa primary user yang jelas, klaim "decision support system" tidak memiliki objek: *mendukung keputusan siapa, untuk apa?*

Kandidat yang masuk akal berdasarkan konteks (bukan keputusan final, harus dikonfirmasi/dipilih oleh tim):
- Dinas ESDM Kabupaten/Provinsi (perencana teknis energi daerah).
- Bappeda (perencana pembangunan daerah, lintas sektor).
- PLN Wilayah/UP3 setempat (operator kelistrikan).
- Lembaga donor/NGO program EBT (pendana proyek PLTS komunal).
- Peneliti/akademisi (sebagai alat riset metodologi, bukan operasional).

**Rekomendasi:** proposal harus memilih **satu primary user utama** (yang lain bisa jadi secondary user) dan menulis persona singkat: peran, keputusan yang mereka ambil, dan bagaimana output sistem masuk ke alur kerja mereka. Tanpa ini, juri akan bertanya "buat siapa sebenarnya ini?" dan tim berisiko menjawab tidak konsisten.

---

## 7. Decision yang Dibantu Sistem

Berdasarkan §10 `PROJECT_CONTEXT.md`, tiga jenis rekomendasi MVP:

- **New Deployment Assessment** → membantu keputusan: "apakah lokasi ini layak masuk daftar kajian lanjutan untuk PLTS baru?"
- **Expansion Assessment** → membantu keputusan: "apakah PLTS eksisting di lokasi ini layak dikaji untuk penguatan/ekspansi kapasitas?"
- **Needs Data Verification** → membantu keputusan: "apakah data lokasi ini cukup andal untuk dijadikan dasar keputusan, atau perlu verifikasi lapangan dulu?"

Ini adalah kerangka yang jelas dan konsisten dengan positioning "pre-screening", bukan "keputusan akhir". Kekuatan utama: kategori ketiga (Needs Data Verification) secara struktural mencegah sistem memberi rekomendasi definitif atas data yang lemah — ini nilai jual yang baik untuk narasi integritas data, dan sebaiknya ditonjolkan di proposal.

---

## 8. Output Decision Support

Output MVP (§11): Solar Resilience Map, Explainable Priority Score, Site Insight, Site Comparison, Deployment/Expansion Assessment, Data Confidence & Traceability.

**Penilaian:** set fitur ini koheren dan saling melengkapi (peta untuk triase cepat → skor untuk prioritisasi → site insight untuk detail → comparison untuk keputusan relatif → assessment label untuk rekomendasi bertingkat → confidence untuk kehati-hatian). Tidak ada fitur yang terasa tempelan.

**Yang perlu dipastikan saat implementasi (bukan pada tahap audit ini):** setiap output harus secara konsisten memakai framing hedged (*preliminary*, *priority indication*, dst. sesuai §3) — termasuk label, tooltip, dan copy di UI, bukan hanya di dokumen internal.

---

## 9. Risiko Overclaim

Titik-titik risiko overclaim yang teridentifikasi (semua harus dijaga aktif, bukan hanya dicatat sekali):

1. Menyajikan Priority Score sebagai kesimpulan final, bukan indikasi — bertentangan langsung dengan §3.
2. Menampilkan data historis PLTS Sumber Agung (§9) tanpa label `Historical Data` / `Current Status Requires Verification` yang mencolok di UI — risiko tinggi karena datanya konkret dan mudah diperiksa juri/publik.
3. Mengklaim sistem sudah "tervalidasi" atau "akurat" tanpa studi validasi (belum ada dan belum direncanakan di `PROJECT_CONTEXT.md`).
4. Mengklaim "tidak ada tool serupa" tanpa riset pasar/literatur (lihat §4–§5).
5. Menyajikan bobot skoring sebagai hasil ilmiah objektif padahal **bobot final belum ditentukan** (§10, §17) — jika kompetisi menuntut demo dengan angka, bobot yang dipakai harus dilabeli eksplisit sebagai *illustrative/provisional*, bukan final.
6. Implikasi bahwa sistem "siap dipakai" oleh PLN/Pemda tanpa keterlibatan/validasi nyata dari instansi tersebut (lihat §10 & §11 audit ini soal implementasi dunia nyata).
7. Causal framing ("PLTS akan menyelesaikan masalah listrik di lokasi X") vs korelasional/indikatif yang seharusnya dipakai ("lokasi X terindikasi prioritas tinggi untuk kajian lebih lanjut").

---

## 10. Kelayakan MVP untuk Kompetisi

**Sisi software:** dengan stack yang direncanakan (Next.js/TS/Tailwind, MapLibre/Leaflet, Supabase) dan cakupan data kecil (10–15 lokasi, §5), implementasi fitur MVP (§11) secara teknis **layak** diselesaikan dalam jangka waktu kompetisi yang umum, *dengan syarat* keputusan-keputusan terbuka di §17 `PROJECT_CONTEXT.md` diselesaikan lebih dulu.

**Sisi data — ini risiko terbesar, bukan software:** mengumpulkan dan memverifikasi data 10–15 fasilitas nyata dengan sumber Tier 1/2 yang benar (koordinat, GHI, risiko bencana, beneficiary, PLTS eksisting) sesuai standar §7–§8 **biasanya memakan waktu lebih lama daripada membangun aplikasinya**. Tim harus mengalokasikan waktu riset data secara proporsional, bukan menganggapnya pekerjaan sampingan yang cepat.

**Rekomendasi urutan kerja:** kunci dataset pilot (lokasi + sumber) dan formula/bobot provisional **sebelum** investasi besar di UI final — mengubah skema data di tengah jalan setelah UI dibangun akan lebih mahal daripada sebaliknya.

---

## 11. Potensi Kelemahan saat Q&A Juri

Pertanyaan yang kemungkinan besar muncul, dan kesiapan jawaban saat ini:

| Pertanyaan juri | Kesiapan saat ini |
|---|---|
| "Bagaimana bobot skor ditentukan? Berdasarkan apa?" | **Belum siap** — bobot final belum ada (§17). Jawaban jujur harus: metode (AHP pairwise comparison) + status saat ini (provisional/illustrative) — jangan berpura-pura sudah final. |
| "Bagaimana Anda tahu skor ini valid/akurat?" | **Belum siap** — tidak ada studi validasi. Jawaban jujur: ini adalah keterbatasan yang diakui (masuk bagian Limitations), MVP menguji *metode* bukan *akurasi tervalidasi*. |
| "Kenapa cuma 10–15 lokasi? Bagaimana skalanya ke seluruh Indonesia?" | **Cukup siap** — §5 sudah punya prinsip "kualitas data > kuantitas lokasi"; roadmap ke multi-provinsi sudah eksplisit sebagai fitur pasca-MVP (§11). |
| "Apa bedanya dari Global Solar Atlas/InaRISK?" | **Sebagian siap** — argumen konseptual ada (§4 audit ini), tapi belum diverifikasi terhadap fitur real tool tersebut saat ini. |
| "Data PLTS Sumber Agung itu valid tidak?" | **Siap secara sikap** — §9 `PROJECT_CONTEXT.md` sudah eksplisit menandainya historis & butuh verifikasi. Ini justru bisa jadi contoh kekuatan tim (disiplin data), asalkan UI benar-benar menampilkan label tersebut. |
| "Siapa yang akan pakai ini di dunia nyata?" | **Belum siap** — primary user belum didefinisikan (§6 audit ini). |
| "Sudahkah bicara dengan Pemda/PLN Kubu Raya?" | **Tidak boleh dijawab "sudah" kecuali benar terjadi** — status ini harus dikonfirmasi ke tim, jangan diasumsikan (lihat §12 blocking issues). |
| "Bagaimana kalau dua sumber data bertentangan?" | **Siap** — aturan integritas data §8 poin 6 sudah eksplisit mewajibkan pencatatan konflik, bukan memilih sepihak. Ini nilai jual yang baik, tonjolkan di proposal/demo. |

---

## 12. Blocking Issues (Ringkasan untuk Ditindaklanjuti)

Item berikut **memblokir kesiapan proposal/kompetisi** dan memerlukan keputusan atau riset tambahan sebelum proposal final ditulis:

1. **Urgensi belum bersumber** — tidak ada data terverifikasi tentang kondisi elektrifikasi/kelistrikan fasilitas kritis di Kubu Raya (§2 audit ini).
2. **Novelty/diferensiasi belum diverifikasi** — perbandingan dengan Global Solar Atlas/InaRISK/dashboard sejenis masih analisis konseptual internal, belum dicek terhadap fitur real tool tersebut (§4–§5).
3. **Primary user belum didefinisikan** — tanpa ini, narasi decision support dan implementasi dunia nyata tidak punya objek yang jelas (§6).
4. **Bobot & formula Priority Score belum final** — sudah tercatat sebagai open decision di `PROJECT_CONTEXT.md` §17, tapi ini juga blocking langsung untuk demo/Q&A kompetisi.
5. **Rubrik/formula Data Confidence belum didefinisikan** — bagaimana `data_confidence` dihitung dari kombinasi source tier, recency, kelengkapan, dan status verifikasi belum ada di `PROJECT_CONTEXT.md` sama sekali (bukan hanya belum final — belum dibahas). Ini perlu ditambahkan sebagai item baru ke §17 Unresolved Decisions.
6. **Dataset pilot final (10–15 lokasi + sumber per field) belum ada** — prasyarat fundamental untuk MVP maupun proposal (§17 `PROJECT_CONTEXT.md`).
7. **Alasan spesifik pemilihan Kubu Raya belum didokumentasikan dengan sumber** — perlu data konkret (karhutla, elektrifikasi, GHI) bukan hanya framing "pilot" (lihat detail di `PROPOSAL_STRENGTHENING.md`).
8. **Status hubungan dengan Pemda/PLN Kubu Raya tidak boleh diasumsikan** — jika belum ada komunikasi nyata dengan instansi terkait, proposal tidak boleh menyiratkan validasi/dukungan pihak tersebut.

Tidak ada item di atas yang menghalangi *audit* ini selesai — tetapi semuanya harus ditindaklanjuti sebelum proposal final dan sebelum UI/demo dianggap kompetisi-ready. Lihat `docs/PROPOSAL_STRENGTHENING.md` untuk rencana perbaikan per bagian proposal.
