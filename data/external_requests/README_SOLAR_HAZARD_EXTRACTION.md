# SURYA-SIAGA — Instruksi Ekstraksi Eksternal Solar dan Hazard

Bundle ini menyiapkan pengambilan nilai per titik untuk 10 kandidat MVP Kubu Raya. Bundle ini tidak berisi nilai GHI/hazard dan tidak mengubah readiness sampai hasil eksternal diimpor dan diaudit melalui Prompt 3.2.

## Berkas bundle

- `solar_hazard_target_sites.csv`: satu-satunya allowlist lokasi. Gunakan 10 baris ini saja.
- `solar_observations_external_TEMPLATE.csv`: salin menjadi `solar_observations_external.csv`, lalu isi satu baris per target.
- `hazard_observations_external_TEMPLATE.csv`: salin menjadi `hazard_observations_external.csv`, lalu isi dua baris per target.

Jangan mengubah `record_id`, nama, atau koordinat target. Semua koordinat menggunakan WGS84/EPSG:4326 dan `official_exact`. Jangan mengganti titik dengan centroid, geocode, atau titik peta lain. Koordinat HLT-001 sampai HLT-003 berasal dari dataset Dinkes 2021; pertahankan caveat tahun tersebut.

## 1. Ekstraksi GHI

1. Baca 10 site dari `solar_hazard_target_sites.csv`.
2. Ambil GHI per titik dari **Global Solar Atlas** sebagai primary solar spatial screening source.
3. Simpan hanya derived point values. Jangan menyerahkan atau commit raster Global Solar Atlas.
4. Catat `ghi_unit` apa adanya dari sumber. Jangan mengonversi unit diam-diam.
5. Catat dataset/version, URL sumber nilai, resolusi spasial, cakupan temporal, periode data, metode ekstraksi, dan tanggal retrieval.
6. Isi satu baris per target pada `solar_observations_external.csv`, dengan ID `SOL-001` sampai `SOL-010` mengikuti urutan target CSV.
7. Gunakan `source_name = Global Solar Atlas`, `source_authority = B`, `verification_method = external_manual_verification`, dan `verification_status = verified_secondary` bila nilai berhasil diverifikasi.
8. Gunakan `license = CC BY 4.0` dan `attribution_required = true`.
9. Attribution harus menyebut **Global Solar Atlas 2.0, World Bank Group, ESMAP, dan Solargis**.

Jika nilai tidak tersedia, kosongkan `ghi_value`; jangan isi 0. Isi `why_null` secara spesifik dan gunakan status yang menjelaskan bahwa nilai belum diperoleh. NULL lebih baik daripada nilai palsu.

## 2. Ekstraksi hazard InaRISK/BNPB

1. Ambil dua observasi per target: `karhutla` dan `kekeringan`.
2. Prioritaskan layer bahaya dan isi `metric_type = hazard`.
3. Layer risiko hanya boleh dipakai jika layer hazard tidak tersedia. Jika demikian, isi `metric_type = risk` dan jelaskan kegagalan memperoleh hazard pada `notes`.
4. Jangan mencampur hazard dan risk dalam satu seri. Untuk satu jenis bahaya, gunakan dataset/metric yang konsisten pada semua site sejauh tersedia.
5. Catat `raw_value` apa adanya jika sumber menyediakan angka dan `raw_class` apa adanya jika sumber menyediakan kelas. Salah satu boleh NULL bila memang tidak disediakan sumber.
6. Jangan mengubah Rendah/Sedang/Tinggi menjadi angka. Jangan membuat threshold atau normalisasi.
7. Catat URL layer persis, source authority, tahun/version dataset, unit/skala, metode ekstraksi, dan tanggal retrieval.
8. Isi `hazard_observations_external.csv` dengan `HAZ-001` sampai `HAZ-020`, dua baris berurutan per target: karhutla lalu kekeringan.
9. Gunakan `source_name = InaRISK / BNPB`, `source_authority = A`, dan `verification_method = external_manual_verification`.

Jangan memakai IRBI kabupaten sebagai nilai site. Jangan memakai hotspot/asap/status harian sebagai structural hazard. Jangan mengambil angka dari warna peta tanpa nilai/legend resmi. Nodata tetap NULL dengan `why_null`, bukan nol atau kelas Rendah.

## 3. Pemeriksaan sebelum penyerahan

- Kedua CSV harus UTF-8, delimiter koma, desimal titik, dan tanggal ISO `YYYY-MM-DD`.
- Solar harus memiliki tepat satu baris per `record_id`; hazard harus memiliki tepat dua baris per `record_id`.
- Semua `record_id`, nama, latitude, dan longitude harus cocok persis dengan target CSV.
- Tidak boleh ada `HF-*`, identity-only record, `approximate`, atau `missing` coordinate.
- Nilai numerik harus finite; jangan memakai NaN, Infinity, sentinel nodata, atau nilai dummy.
- Setiap nilai harus memiliki provenance yang dapat diaudit.
- Jika suatu nilai tidak tersedia, biarkan sel nilai kosong dan isi `why_null`.
- Jangan melakukan scoring, normalisasi, AHP, MCDA, Data Confidence final, atau ranking.

## 4. Paket penyerahan

Serahkan empat berkas berikut dalam folder bertanggal `data/raw/external_manual/<YYYY-MM-DD>/`:

1. `solar_observations_external.csv`;
2. `hazard_observations_external.csv`;
3. `EXTRACTION_NOTES.md`, berisi sumber/layer, CRS, resolusi, band, nodata, metode sampling, dan caveat;
4. `CHECKSUMS.sha256`, dihitung atas tiga berkas sebelumnya sebelum diserahkan.

Jangan menimpa paket raw lama. Setelah kedua CSV terisi, repository siap menjalankan draft Prompt 3.2 di `research/PROMPT_3_2_IMPORT_SOLAR_HAZARD_PACKAGE_DRAFT.md` untuk validasi dan import. Pembuatan bundle ini sendiri belum menjalankan Prompt 3.2.
