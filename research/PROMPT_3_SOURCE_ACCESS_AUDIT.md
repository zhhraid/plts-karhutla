# Prompt 3 — source access audit

Tanggal pemeriksaan: 2026-09-14. Catatan ini membedakan handoff eksternal, akses metadata oleh agent, dan akuisisi nilai. Hasil akses lama tidak dianggap hasil uji baru.

| Sumber / operasi | Hasil aktual pada pass ini | Implikasi |
|---|---|---|
| [BPK Kalbar — hibah PLTS tiga desa](https://kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/) | Web open: HTTP 403 Forbidden | Tidak membaca isi artikel. Gunakan EV-F dan handoff Prompt 3, `external_manual_verification`. |
| [GSA FAQ](https://globalsolaratlas.info/support/faq) | Web open: HTML tanpa teks yang dapat dibaca (0 baris) | Tidak memverifikasi lisensi melalui akses agent; gunakan handoff Prompt 3. Tidak ada GHI diperoleh. |
| [Direktori InaRISK](https://gis.bnpb.go.id/server/rest/services/inarisk) | Direktori layanan terbaca melalui web tool | Akses metadata sekarang sebagian berhasil; jangan ulangi klaim semua domain tetap EGRESS_BLOCKED. |
| [Indeks bahaya karhutla](https://gis.bnpb.go.id/server/rest/services/inarisk/INDEKS_BAHAYA_KARHUTLA/ImageServer) | Metadata terbaca: ImageServer, F32, 1 band, CRS 3395, pixel 100 × 100; tahun data tidak tercantum | Statistik minimum/maksimum/mean layanan bukan nilai titik fasilitas dan tidak diimpor. |
| [Indeks bahaya kekeringan](https://gis.bnpb.go.id/server/rest/services/inarisk/INDEKS_BAHAYA_KEKERINGAN/ImageServer) | Metadata terbaca: ImageServer, F32, 1 band, CRS 3395, pixel 100 × 100; tahun data tidak tercantum | Resolusi ini milik kedua service tersebut; jangan diterapkan otomatis ke kandidat layer lain. |
| Identify kedua ImageServer, titik EDU-001 | Web tool menolak URL: `not safe to open (non-retryable error)` | Tidak ada respons nilai. Tidak mengklaim endpoint berhasil, tidak mengakali penolakan, tidak mengimpor nilai. |

Parameter uji identify: `geometry=109.3758,-0.0762`, `geometryType=esriGeometryPoint`, `sr=4326`, `returnGeometry=false`, `returnCatalogItems=false`, `f=pjson`. Ini catatan percobaan gagal, bukan metode ekstraksi yang sudah menghasilkan observasi. Paket eksternal harus menyatakan CRS koordinat secara eksplisit dan membuktikan hasil query pada titik yang benar.

## Handoff pengguna yang diadopsi

Sumber handoff: instruksi pengguna **PROMPT 3 — COMPLETE DATA ACQUISITION & DATA READINESS AUDIT**, diterima 2026-09-14. Tanggal ini adalah tanggal penerimaan instruksi, bukan tanggal akses sumber asli yang tidak disediakan. Tidak ada file paket solar/hazard atau salinan artikel baru yang disertakan.

- Lisensi GSA: Creative Commons Attribution 4.0 International / CC BY 4.0; `verification_method = external_manual_verification`; atribusi menyebut Global Solar Atlas 2.0, World Bank Group, ESMAP, Solargis. MVP hanya menyimpan derived point values, tanpa commit raster.
- Kapabilitas InaRISK: hazard candidates `INDEKS_BAHAYA_KARHUTLA`, `INDEKS_BAHAYA_KEKERINGAN`, `layer_bahaya_kebakaran_hutan_dan_lahan`, `layer_bahaya_kekeringan`; risk candidates `layer_risiko_kebakaran_hutan_dan_lahan`, `layer_risiko_kekeringan`. Handoff memakai `external_manual_verification`; pembacaan metadata agent adalah bukti tambahan terpisah.
- PLTS: pengguna menyebut serah terima tiga desa pada 2021-12-30. EV-F sebelumnya mendukung penyerahan pada 2021 dan mencatat tanggal publikasi 2021-12-30. Tanggal peristiwa lengkap diadopsi dari handoff eksplisit ini, **tidak dihitung dari tanggal publikasi**. BUMDes tetap pengelola yang disebut/direncanakan pada konteks 2021, bukan pengelola terkini yang diverifikasi.

Tidak ada nilai numerik GHI atau hazard dalam handoff ini. Keberadaan layanan dan verifikasi lisensi tidak meningkatkan coverage nilai.
