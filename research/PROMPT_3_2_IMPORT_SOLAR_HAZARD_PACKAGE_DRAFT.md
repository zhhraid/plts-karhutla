# PROMPT 3.2 — IMPORT EXTERNAL SOLAR/HAZARD PACKAGE

> **DRAFT — JANGAN DIJALANKAN PADA PROMPT 3.1**

Baca `PROJECT_CONTEXT.md`, seluruh laporan Prompt 3/3.1, schema interim, bundle di `data/external_requests/`, serta paket eksternal terbaru di `data/raw/external_manual/<date>/`.

## Tujuan

Validasi dan import `solar_observations_external.csv` serta `hazard_observations_external.csv` ke dataset interim tanpa scoring, normalisasi, AHP, MCDA, Priority Score, Data Confidence final, atau ranking kandidat.

## A. Preserve raw package

1. Perlakukan seluruh file pada folder paket bertanggal sebagai immutable.
2. Jangan memperbaiki encoding, line ending, header, nilai, atau nama file pada raw.
3. Inventarisasikan nama file, byte size, dan waktu penerimaan.
4. Hitung SHA-256 setiap file dan validasi terhadap `CHECKSUMS.sha256` bila tersedia.
5. Catat hash raw byte persis sebelum parsing. Jika Git mengubah line ending, bedakan hash raw dari Git blob dan jangan mengubah raw agar hash cocok.

## B. Validate package structure

1. Wajib ada `solar_observations_external.csv` dan `hazard_observations_external.csv`.
2. Validasi UTF-8, CSV parse, header wajib, delimiter, jumlah kolom, ID observasi unik, dan tanggal ISO.
3. Validasi seluruh `record_id` terhadap allowlist 10 target pada `data/external_requests/solar_hazard_target_sites.csv`.
4. Tolak `HF-*`, record di luar allowlist, duplikat site-layer, serta koordinat/nama yang tidak cocok dengan target.
5. Jangan memasukkan identity-only, approximate, missing coordinate, atau centroid.

## C. Validate solar observations

1. Maksimal satu observasi utama per target; target lengkap adalah 10 baris.
2. `ghi_value` harus numeric finite jika terisi. Jangan menerima 0 sebagai pengganti missing, NaN, Infinity, atau nodata sentinel.
3. Lakukan sanity check berdasarkan unit asli: untuk `kWh/m²/day`, `0 < GHI <= 12`; untuk `kWh/m²/year`, `0 < GHI <= 4392`. Rentang ini hanya QA luas, bukan normalisasi atau rentang lokal terverifikasi.
4. Unit lain harus ditahan untuk pemeriksaan metadata; jangan konversi diam-diam.
5. Nilai non-NULL wajib memiliki `source_name`, `source_url`, `source_dataset`, `source_authority`, `spatial_resolution`, `temporal_coverage`, `data_year_or_period`, `extraction_method`, `retrieved_at`, `verification_method`, dan `verification_status`.
6. Validasi `license = CC BY 4.0` atau nama lengkap ekuivalen, `attribution_required = true`, dan attribution kepada Global Solar Atlas 2.0, World Bank Group, ESMAP, serta Solargis pada notes/manifest.
7. Pastikan tidak ada raster Global Solar Atlas yang akan di-commit. Hanya derived point values yang boleh masuk interim.
8. Baris tanpa nilai harus mempunyai `why_null`; jangan menghitungnya sebagai coverage.

## D. Validate hazard observations

1. Target lengkap adalah dua baris per target: satu `karhutla` dan satu `kekeringan`.
2. `hazard_type` hanya `karhutla` atau `kekeringan`.
3. `metric_type` hanya `hazard` atau `risk`. Prioritaskan `hazard`; `risk` diterima hanya bila kegagalan memperoleh hazard dijelaskan.
4. Jangan menggabungkan atau menimpa seri hazard dengan risk. Jangan mencampur metric/dataset/year antar-site dalam satu seri pembanding tanpa flag dan dokumentasi.
5. `raw_value` harus numeric finite bila terisi dan konsisten dengan unit/skala sumber. `raw_class` harus disimpan apa adanya.
6. Jangan mengubah kelas Rendah/Sedang/Tinggi menjadi angka dan jangan membuat threshold sendiri.
7. Nilai/class non-NULL wajib memiliki URL layer, authority, dataset year/version, unit/skala atau penjelasan ketiadaannya, extraction method, retrieval date, verification method/status, serta metadata CRS/resolusi/band/nodata dalam notes atau manifest.
8. Tolak IRBI kabupaten, hotspot harian, contextual event, warna render tanpa nilai resmi, centroid, dan sumber non-BNPB sebagai pengganti utama.
9. Baris nodata harus tetap NULL dengan `why_null` dan tidak dihitung sebagai coverage.

## E. Import decision

1. Buat validation report berisi accepted/rejected rows dan alasan per baris.
2. Paket gagal checksum atau tidak dapat diparse tidak boleh diimpor.
3. Paket parsial boleh menghasilkan import parsial hanya untuk baris yang lolos; placeholder target lain tetap NULL dan terdokumentasi.
4. Pertahankan raw apa adanya. Lakukan mapping hanya pada interim dan catat transformasi raw-to-interim dalam `data/interim/IMPORT_LOG.md`.
5. Import nilai solar yang lolos ke `data/interim/solar_observations.csv` dan hazard yang lolos ke `data/interim/hazard_observations.csv`.
6. Jangan menghapus provenance atau menandai nilai sebagai verified hanya karena baris tersedia.

## F. Post-import audit

1. Revalidasi ID, koordinat, nilai, unit, metric separation, provenance, license, dan missingness pada interim.
2. Update `data/interim/acquisition_quality_matrix.csv` secara deskriptif tanpa completeness score.
3. Update `research/SOLAR_HAZARD_ACQUISITION_REPORT.md`, `research/EVIDENCE_LEDGER.md`, `research/SOURCES.md`, dan report import.
4. Update `research/PROMPT_4_READINESS.md` menggunakan site intersection: `READY_FOR_PROMPT_4` hanya bila sedikitnya 8 site yang sama memiliki identity, coordinate, beneficiary atau documented NULL, GHI, karhutla, kekeringan, dan source provenance.
5. Bila kurang dari 8 site lengkap tetapi dataset stabil dan missingness tetap auditable, pertahankan `READY_WITH_LIMITATIONS` dengan alasan spesifik.
6. Jalankan structural validation dan `git diff --check`, lalu commit jika diminta.

## Larangan

- Jangan membuat nilai dummy atau mengubah NULL menjadi 0.
- Jangan scoring atau ranking.
- Jangan normalisasi atau mengonversi kelas hazard.
- Jangan menetapkan bobot/AHP/MCDA.
- Jangan menghitung Priority Score atau Data Confidence final.
- Jangan memilih kandidat final atau membuat aplikasi.
