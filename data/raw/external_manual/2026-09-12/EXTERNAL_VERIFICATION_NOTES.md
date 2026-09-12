# EXTERNAL FACILITY VERIFICATION PACKAGE
## SURYA-SIAGA — Prompt 3A External Acquisition

Tanggal verifikasi eksternal: 2026-09-12

## Verification Method

Data pada package ini diperoleh melalui external research environment
karena environment coding agent mengalami EGRESS_BLOCKED.

Agent penerima TIDAK boleh menyatakan bahwa URL diverifikasi oleh
environment-nya sendiri.

Gunakan metadata:

verification_method = external_manual_verification

---

## Education Facilities

Seluruh record EDU-001 sampai EDU-007 bersumber dari portal resmi
Kemendikdasmen Referensi Data Pendidikan.

Koordinat ditampilkan secara eksplisit pada halaman profil masing-masing
satuan pendidikan.

Coordinate quality:

official_exact

Coordinate source type:

government_portal

Tidak dilakukan geocoding.

Tidak dilakukan digitasi manual.

Tidak digunakan administrative centroid.

---

## Health Facilities

HLT-001 sampai HLT-003 menggunakan koordinat dari dataset:

"Kondisi Bangunan dan Fasilitas Puskesmas di Kabupaten Kubu Raya Tahun 2021"

Sumber:
Dinas Kesehatan Kabupaten Kubu Raya
melalui portal Satu Data Kabupaten Kubu Raya.

Coordinate quality:

official_exact

Namun:

coordinate_source_data_year = 2021

Current official portal digunakan hanya untuk melakukan cross-check
identitas/alamat fasilitas.

Historical coordinate tidak boleh dipresentasikan sebagai
"koordinat diperbarui tahun 2026".

---

## Important Interpretation Rules

1. NULL lebih baik daripada data hasil tebakan.
2. Sumber listrik sekolah tidak sama dengan reliability.
3. "PLN" tidak berarti listrik selalu tersedia.
4. "Diesel" tidak otomatis berarti lokasi prioritas PLTS.
5. "Tidak Ada" pada profil sekolah harus diperlakukan sebagai field resmi
   yang masih dapat membutuhkan verifikasi kondisi terkini,
   bukan otomatis sebagai bukti final bahwa sekolah benar-benar tanpa listrik.
6. Puskesmas coordinate year 2021 harus tetap dipertahankan.
7. Jangan menggunakan beneficiary/student data pada tahap Prompt 3A.
8. Jangan menghitung score.
9. Jangan memilih final pilot candidate.
10. Jangan mengubah spelling source silently.

---

## Current Package Size

Education facilities:
7

Health facilities:
3

Total:
10

All 10 have:

- traceable identity
- district
- latitude
- longitude
- coordinate_quality = official_exact

Dengan demikian package memenuhi minimum facility acquisition gate
sebanyak 8–10 coordinate-valid facility records.

Gate berikutnya tetap membutuhkan import validation oleh coding agent.
