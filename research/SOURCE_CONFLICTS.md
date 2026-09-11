# SOURCE_CONFLICTS.md — Konflik Antar-Sumber SURYA-SIAGA

Sesuai `PROJECT_CONTEXT.md` §10 Aturan Integritas Data poin 6: **"Jangan memilih angka ketika dua sumber bertentangan tanpa mencatat konflik."** Dokumen ini mencatat seluruh konflik yang ditemukan selama riset Prompt 2. Tidak satu pun konflik di bawah ini diselesaikan/dipilih secara sepihak — semua menunggu verifikasi lanjutan atau keputusan eksplisit.

---

**CF-001**
- topic: Kapasitas PLTS Komunal 2018 di Kecamatan Batu Ampar (Sumber Agung/Muara Tiga/Sungai Kerawang)
- source_A: sintesis WebSearch mengutip kalbar.antaranews.com/berita/542859 (nilai kapasitas akhir "250")
- value_A: kapasitas awal 100 → bertambah menjadi 250 (satuan tidak eksplisit, kemungkinan kWp)
- data_year_A: tidak dipastikan
- source_B: sintesis WebSearch mengutip ebtke.esdm.go.id/post/2023/06/22/3515 (nilai kapasitas akhir "150")
- value_B: kapasitas awal 100 → bertambah menjadi 150 (satuan tidak eksplisit)
- data_year_B: 2023 (tanggal artikel, bukan tentu tahun data)
- possible_explanation: kemungkinan (a) definisi/cakupan berbeda — salah satu angka mungkin agregat 3 desa, yang lain per-desa; (b) revisi data antar waktu publikasi; (c) kesalahan pengutipan angka oleh salah satu outlet; (d) kedua sumber ini sebenarnya adalah ringkasan WebSearch dari halaman yang sama, sehingga perbedaan bisa jadi artefak proses ringkasan, bukan perbedaan sumber riil — **ini sendiri belum bisa dipastikan tanpa membuka kedua halaman asli**.
- recommended_action: buka langsung kalbar.bpk.go.id (sumber utama, EV-038) dan kedua URL di atas secara manual; jangan gunakan angka manapun sebagai fakta produksi sampai dikonfirmasi. Juga catat apakah "312 rumah tangga" adalah agregat 3 desa atau 1 desa saja.
- status: **OPEN — requires_verification**

**CF-002**
- topic: Klasifikasi risiko/bahaya karhutla Kabupaten Kubu Raya
- source_A: Wijaya, Akbar &amp; Romiyanto — jurnal GEOGRAPHY (UMMAT) (EV-034)
- value_A: kelas BAHAYA didominasi Sedang (52,25%) dan Tinggi (42,11%); Rendah hanya 5,64%
- data_year_A: tidak dikonfirmasi
- source_B: Muharrama &amp; Widjonarko (2023), Jurnal Teknik PWK UNDIP (EV-035)
- value_B: kelas RISIKO didominasi Rendah (44,60%)
- data_year_B: berbasis data kejadian 2015–2019, publikasi 2023
- possible_explanation: **definisi berbeda** — studi A mengukur BAHAYA (hazard: kondisi biofisik semata), studi B mengukur RISIKO (ancaman × kerentanan × kapasitas, sesuai definisi InaRISK di EV-028) — keduanya secara metodologis TIDAK mengukur hal yang sama meski topiknya sama-sama "karhutla Kubu Raya"; kemungkinan juga tahun data &amp; metodologi spasial (unit analisis KHG vs kabupaten) berbeda.
- recommended_action: JANGAN menggabungkan/merata-ratakan kedua angka ini sebagai "risiko karhutla Kubu Raya" tunggal. Jika kedua dipakai, harus ditampilkan terpisah dengan label jelas (bahaya vs risiko, tahun data masing-masing). Verifikasi metodologi lengkap kedua paper sebelum dipakai sebagai basis kriteria skoring.
- status: **OPEN — conflicting, bukan requires_verification biasa (definisi memang berbeda, bukan sekadar salah satu salah)**

**CF-003**
- topic: Skala/satuan skor risiko kekeringan Kubu Raya di IRBI BNPB
- source_A: Buku IRBI 2023/2024 (EV-032) — skor Kubu Raya 34,21 (2024) / 36,00 (2023)
- value_A: skor pada skala yang tidak disebutkan secara eksplisit di snippet (tampak seperti skala 0–100)
- data_year_A: 2023, 2024
- source_B: halaman metodologi umum InaRISK (EV-030) — kelas risiko dijelaskan pada skala 0–1 (Rendah 0–0,3; Sedang 0,3–0,6; Tinggi 0,6–1,0)
- value_B: skala 0–1
- data_year_B: tidak spesifik tahun (metodologi umum)
- possible_explanation: kemungkinan IRBI (indeks komposit multi-bahaya per kabupaten) memakai skala agregat berbeda dari skala kelas per-bahaya individual yang dijelaskan di dokumen metodologi umum — ATAU salah satu angka salah kutip oleh proses ringkasan WebSearch.
- recommended_action: buka langsung Buku IRBI 2023/2024 halaman yang dikutip (page306/page308) untuk memastikan skala dan definisi "kelas TINGGI" yang dipakai, sebelum angka 34,21/36,00 dipakai sebagai input skoring apa pun.
- status: **OPEN — requires_verification**

**CF-004**
- topic: Satuan parameter NASA POWER ALLSKY_SFC_SW_DWN
- source_A: sebagian ringkasan WebSearch menyebut Wh/m²
- source_B: konvensi umum yang sering dipakai untuk API harian NASA POWER adalah kWh/m²/day
- possible_explanation: kemungkinan sumber A merujuk pada representasi horaria/API tertentu, sumber B pada API harian (temporal daily) — NASA POWER memang punya beberapa temporal API (horaria/harian/bulanan/tahunan) yang bisa memiliki satuan berbeda.
- recommended_action: buka langsung power.larc.nasa.gov/docs/methodology/ dan parameter dictionary resmi untuk memastikan satuan pasti sebelum dipakai dalam perhitungan apa pun.
- status: **OPEN — requires_verification**

**CF-005**
- topic: Lokasi "PLTS Kubu" yang disebut dalam artikel Mongabay 2016
- source_A: judul artikel Mongabay "PLTS Kubu, Proyek Ambisius yang Kini Tidak Terurus" (EV-046) — mengindikasikan lokasi di area bernama "Kubu"
- source_B: Kecamatan Kubu adalah kecamatan nyata di Kabupaten Kubu Raya, berbeda dari Kecamatan Batu Ampar (lokasi 3 desa PLTS 2018 hibah, EV-038)
- possible_explanation: tidak dapat dipastikan apakah "PLTS Kubu" di artikel ini merujuk pada proyek di Kecamatan Kubu, atau proyek berbeda yang kebetulan memakai kata "Kubu" (mis. nama pendek "Kubu Raya"), atau proyek yang sama sekali berbeda dari 3 desa Batu Ampar.
- recommended_action: buka artikel asli (URL di EV-046) untuk memastikan lokasi persis sebelum dianggap sebagai preseden historis "PLTS terbengkalai" yang relevan dengan Kubu Raya.
- status: **OPEN — NOT_FOUND/ambiguous, bukan konflik nilai tapi konflik identifikasi lokasi**

---

## Ringkasan

5 konflik/ambiguitas ditemukan, seluruhnya berstatus **OPEN** — tidak ada satu pun yang diselesaikan secara sepihak dalam riset ini. CF-001 dan CF-002 paling material karena berkaitan langsung dengan dua kandidat data historis (existing PLTS &amp; karhutla) yang kemungkinan besar dipakai di dataset pilot MVP nanti.
