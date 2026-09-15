# External solar / hazard package ? permintaan siap isi

Tanggal: 2026-09-14. **WAITING_FOR_EXTERNAL_SOLAR_HAZARD_PACKAGE**.
Paket nilai belum diserahkan. Metadata InaRISK dapat dibaca pada pass ini, tetapi query nilai gagal; riwayat akses ada di [audit akses](PROMPT_3_SOURCE_ACCESS_AUDIT.md). Lisensi GSA telah terverifikasi via handoff manual, sehingga tidak perlu membuka gate lisensi ulang.

## Daftar target dan tujuan

| record_id | facility_name | latitude | longitude | required_solar_parameter | required_hazard_layer_1 | required_hazard_layer_2 | preferred_metric_type | expected_format | destination_path |
|---|---|---|---|---|---|---|---|---|---|
| EDU-001 | SMAN 1 SUNGAI RAYA | -0.0762 | 109.3758 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| EDU-002 | SMAN 1 SUNGAI KAKAP | -0.0565 | 109.2021 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| EDU-003 | SMP NEGERI 1 TERENTANG | -0.3839 | 109.6277 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| EDU-004 | SMAN 1 KUBU | -0.4882 | 109.3812 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| EDU-005 | SD NEGERI 22 BATU AMPAR | -0.7245 | 109.5745 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| EDU-006 | SD NEGERI 07 BATU AMPAR | -0.7516 | 109.5388 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| EDU-007 | SMKN 1 BATU AMPAR | -0.7849 | 109.4548 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| HLT-001 | PUSKESMAS PADANG TIKAR | -0.68395 | 109.27088 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| HLT-002 | PUSKESMAS SUNGAI KERAWANG | -0.84319384 | 109.7554378 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |
| HLT-003 | PUSKESMAS KUBU | -0.50136262 | 109.3756266 | GHI | karhutla | kekeringan | hazard | CSV UTF-8 (SOL + HAZ) | data/raw/external_manual/<date>/ (nama file di bawah) |

Koordinat WGS84 / EPSG:4326, desimal latitude/longitude. Gunakan digit persis CSV fasilitas, bukan centroid atau geocoding. Ketiga HLT memakai koordinat Dinkes 2021; tahun pengambilan bukan tahun koordinat. Point-in-polygon pending tidak menurunkan official_exact.

Destination SOL: `data/raw/external_manual/<date>/solar_observations_external.csv`.
Destination HAZ: `data/raw/external_manual/<date>/hazard_observations_external.csv`.
`<date>` adalah tanggal penyerahan YYYY-MM-DD. Kedua path berlaku untuk **setiap baris** tabel di atas.
Sertakan `EXTRACTION_NOTES.md` dan `CHECKSUMS.sha256` di folder paket. Jangan menimpa paket lama. Interim saat ini dapat disalin sebagai template di luar raw; jangan menyerahkan placeholder seolah nilai terverifikasi.

## REQ-SOL-01

Global Solar Atlas sebagai primary solar spatial screening source. Ambil satu GHI per site (target 10), `ghi_unit` dari sumber apa adanya, URL persis dataset/laporan titik, nama/version dataset, authority B, resolusi, temporal coverage, data period, metode ekstraksi, tanggal pengambilan, status/method verifikasi. Jangan menyamakan tanggal akses dengan periode data.

`license = Creative Commons Attribution 4.0 International / CC BY 4.0`; `attribution_required = true`; atribusi memuat Global Solar Atlas 2.0, World Bank Group, ESMAP, Solargis. `license_verification_method = external_manual_verification` (EV-P3-GSA). `source_url_role` harus menjadi `acquired_dataset_or_point_report` bila nilai ada.

Gunakan peta/laporan titik resmi atau ekstraksi titik dari raster resmi di lingkungan pengambil. **Jangan sertakan/commit raster GSA.** Catat dataset ID, CRS, resolusi, resampling (mis. nearest pixel), band GHI, nodata, dan checksum raster di manifest bila memakai raster, tanpa menyimpan raster di repo. Jangan menginterpolasi manual. NASA POWER hanya supporting time-series / rough cross-check, tidak menggantikan GSA.

Header lengkap yang diterima (kolom tambahan boleh, tidak membuang provenance):

```csv
solar_observation_id,record_id,facility_name,latitude,longitude,ghi_value,ghi_unit,source_name,source_url,source_dataset,source_authority,source_role,spatial_resolution,temporal_coverage,data_year_or_period,extraction_method,point_in_polygon_status,retrieved_at,verification_method,verification_status,why_null,notes,license,attribution_required,attribution_text,license_verification_method,license_verification_status,source_url_role,request_created_at
```

## REQ-HAZ-01

Target dua observasi per site (20), `hazard_type` = `karhutla` / `kekeringan`, **prioritas metric_type = hazard**.

Hazard candidates (handoff `external_manual_verification`, EV-P3-INA):
- `INDEKS_BAHAYA_KARHUTLA`
- `INDEKS_BAHAYA_KEKERINGAN`
- `layer_bahaya_kebakaran_hutan_dan_lahan`
- `layer_bahaya_kekeringan`

Risk candidates: `layer_risiko_kebakaran_hutan_dan_lahan`, `layer_risiko_kekeringan`.
Sumber: https://inarisk.bnpb.go.id/ dan https://gis.bnpb.go.id/server/rest/services/inarisk.

Pakai risk **hanya bila hazard tidak dapat diekstrak**, dengan alasan kegagalan hazard di EXTRACTION_NOTES dan `metric_type = risk`. Untuk satu hazard_type, utamakan satu dataset/year/metric yang konsisten di semua site. Jangan mengisi sebagian site dengan hazard dan sebagian dengan risk sebagai satu seri pembanding. Bila fallback hanya tersedia sebagian, simpan sebagai seri observasi terpisah dengan ID berbeda dan kelompok metrik eksplisit; tandai seri utama yang belum lengkap. Tidak boleh overwrite/mengganti nama risk menjadi hazard.

`raw_value` hanya angka asli sumber; `raw_class` hanya kelas sumber apa adanya. Salah satu boleh NULL jika sumber hanya menyediakan yang lain. Jangan membuat kelas dari threshold sendiri atau mengubah Rendah/Sedang/Tinggi ke angka. Sertakan unit/skala/legend resmi, tahun/version layer, URL persis service/layer, authority A, CRS raster dan titik, geometri/raster, resolusi, band, metode sampling, nodata serta retrieved_at. Pilih raw pixel/index, bukan warna peta atau nilai hasil rendering yang dianggap indeks. Metadata service yang sempat terbaca belum menyediakan tahun data; pengambil perlu mencari metadata pendamping, bukan memakai 2026 secara otomatis.

Dilarang: IRBI kabupaten, hotspot harian, proxy centroid, studi sekunder sebagai pengganti InaRISK. Kejadian asap/karhutla hanya konteks dengan used_for_scoring=false.

Header lengkap:

```csv
hazard_observation_id,record_id,facility_name,latitude,longitude,hazard_type,metric_type,raw_value,raw_class,unit_or_scale,source_name,source_url,source_authority,dataset_year,geometry_or_raster_type,extraction_method,point_in_polygon_status,retrieved_at,verification_method,verification_status,why_null,notes,source_url_role,request_created_at
```

## Penerimaan paket dan validasi sebelum import

1. Preserve byte raw, catat SHA-256 file asli **sebelum** parsing. Validasi checksum yang diberikan; jangan mengubah line endings atau raw untuk membuat checksum lolos. Catat checksum Git terpisah jika Git melakukan normalisasi.
2. CSV UTF-8, delimiter koma, desimal titik, tanggal ISO. Empty cell = NULL (bukan 0). Header wajib sesuai minimum SCHEMA; ID observasi unik, record_id hanya 10 target. Nama dan koordinat harus sama dengan target, tanpa penggantian identitas/centroid.
3. GHI harus finite, bukan NaN/Infinity/nodata. Sanity envelope untuk rerata harian kWh/m?/day: 0 < GHI <= 12; untuk kWh/m?/year: 0 < GHI <= 4392. Ini hanya pemeriksaan kewajaran luas, bukan rentang lokal terverifikasi, normalisasi, atau skor. Nilai di luar/bersatuan lain ditahan untuk penjelasan sumber; simpan unit asli, jangan konversi diam-diam.
4. Setiap nilai solar harus memiliki sumber, periode, resolusi, extraction method, retrieved_at, license dan attribution. Metadata lisensi boleh merujuk EV-P3-GSA; angka tetap perlu bukti ekstraksi tersendiri.
5. Hazard_type harus karhutla/kekeringan; metric_type hazard/risk; nilai finite dan sesuai skala sumber, kategori apa adanya. Pisahkan seri hazard/risk. Nodata tetap NULL dengan why_null, bukan nol atau kelas Rendah. Tahun yang tidak tersedia dicatat NULL dan requires_verification; jangan dihitung memenuhi gate penuh sampai provenance minimum teratasi.
6. Tolak/karantina paket atau baris bermasalah dengan log alasan sebelum import. Paket parsial boleh diimpor hanya untuk baris yang lolos; placeholder target lain tetap NULL. Jangan menyatakan 10/20 terisi hanya karena jumlah baris cukup.
7. Catat mapping raw?interim, checksum, jumlah accepted/rejected, alasan dan verifikasi per-field di IMPORT_LOG. Audit ulang matriks dan readiness setelah import.

## Definition of done

Target 10 GHI + 20 hazard. **READY_FOR_PROMPT_4** membutuhkan setidaknya **8 site yang sama** memiliki identity, coordinate, beneficiary atau documented NULL, GHI, karhutla, kekeringan, serta source provenance. Jangan menghitung 8 solar dan 8 hazard dari himpunan site berbeda sebagai lolos.

REQ-GEO-01: batas administratif resmi beserta tahun, CRS, license tetap pending, lihat MANUAL_ACQUISITION_REQUESTS. REQ-CTX-01 opsional dan dilewati untuk fast-track. Tidak ada permintaan student_count baru: beneficiary FROZEN FOR MVP.
