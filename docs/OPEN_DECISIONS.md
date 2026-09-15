# OPEN_DECISIONS.md — Keputusan yang Menunggu Persetujuan

Dokumen ini mencatat perubahan yang **tidak** diterapkan secara sepihak oleh
agent, sesuai `PROJECT_CONTEXT.md` §17.1: perubahan arah produk atau metode
scoring inti harus didokumentasikan, dilaporkan, dan mendapat persetujuan
sebelum diterapkan.

---

## OD-001 — Mengadopsi karhutla structural proxy sebagai input skor Resilience

**Status:** TERBUKA — menunggu keputusan manusia.
**Dibuka pada:** Prompt 8.

### Keadaan sekarang

Dimensi **Resilience Need** menilai **kelas bahaya ordinal** tingkat kecamatan:

| Kelas | Skor |
|---|---|
| Rendah | 33 |
| Sedang | 67 |
| Tinggi | 100 |

Pada dataset saat ini hanya dua kelas yang muncul (Tinggi pada 1 situs, Sedang
pada 9 situs), sehingga dimensi ini hanya menghasilkan **dua nilai berbeda**.

### Alternatif yang kini dihitung dan diterbitkan

Rincian luas area per kelas bahaya tersedia, sehingga proksi struktural dapat
dihitung:

```
karhutla_structural_proxy =
  ( 0,0 × low_area_ha + 0,5 × medium_area_ha + 1,0 × high_area_ha )
  / total_area_ha × 100
```

Nilai per situs pada dataset saat ini:

| Situs | Kelas ordinal (skor) | Proksi struktural |
|---|---|---|
| EDU-001 | Tinggi (100) | 73,21 |
| EDU-004, HLT-003 | Sedang (67) | 72,37 |
| EDU-005, EDU-006, EDU-007, HLT-001, HLT-002 | Sedang (67) | 62,56 |
| EDU-003 | Sedang (67) | 59,68 |
| EDU-002 | Sedang (67) | 58,50 |

Proksi menghasilkan **5 nilai berbeda** dibanding 2 nilai dari kelas ordinal.

### Mengapa belum diadopsi

1. Mengganti input dimensi skor adalah **perubahan metode scoring inti**.
   `PROJECT_CONTEXT.md` §17.1 mewajibkan persetujuan sebelum diterapkan.
2. `research/SCORING_SENSITIVITY_ANALYSIS.md` §3 sudah mencatat bahwa mapping
   berbasis fraksi luas **mengubah peringkat secara substansial**. Perubahan
   ini bukan penyesuaian kosmetik.
3. Kedua-duanya tetap **proksi tingkat kecamatan**. Mengadopsi proksi tidak
   membuat bukti menjadi site-specific, sehingga **tidak** mengangkat plafon
   spesifisitas spasial pada Data Confidence. Manfaatnya adalah daya pembeda,
   bukan kekuatan bukti.

### Yang sudah dilakukan tanpa persetujuan

Proksi **dihitung, diterbitkan, dan ditampilkan** pada halaman situs, halaman
Bandingkan, dan halaman Metodologi — dengan label
`district-level structural hazard proxy` dan pernyataan eksplisit bahwa ia
**tidak dipakai dalam skor**. Menerbitkan angka turunan yang seluruh
komponennya berasal dari data nyata bukan perubahan metodologi; mengganti input
skor adalah.

### Yang diperlukan dari pemilik proyek

Keputusan salah satu dari:

- **(a)** pertahankan kelas ordinal sebagai input skor (status quo);
- **(b)** ganti ke proksi struktural — memerlukan pembaruan
  `docs/SCORING_FORMULA.md`, `docs/DECISION_METHODOLOGY.md`, rebuild dataset,
  dan pencatatan perubahan peringkat;
- **(c)** terbitkan keduanya sebagai dua skenario skor berdampingan.

---

## OD-002 — Ambang batas dan bobot rubrik Data Confidence

**Status:** TERBUKA (dibawa dari Prompt 4).

Pembobotan poin enam dimensi dan ambang HIGH/MEDIUM/NEEDS_VERIFICATION masih
**MVP design assumption**. Ambang **tidak diturunkan** meskipun hasilnya 0 situs
HIGH — menurunkannya hanya agar hasil terlihat lebih baik akan membuat kategori
kehilangan arti.

---

## OD-003 — Bobot baseline empat dimensi

**Status:** TERBUKA (dibawa dari Prompt 4).

Solar 30 · Social 25 · Criticality 20 · Resilience 25 adalah asumsi desain MVP,
bukan hasil AHP tervalidasi ahli. Tidak ada pairwise comparison dari panel ahli.
Sistem **tidak mengklaim AHP** di mana pun.
