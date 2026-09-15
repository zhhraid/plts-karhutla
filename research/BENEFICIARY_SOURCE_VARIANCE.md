# BENEFICIARY_SOURCE_VARIANCE.md — Log Variansi Antar-View Sumber Beneficiary

**Dibuat:** Prompt 3B.2, 2026-09-14.

## Mengapa ini bukan `SOURCE_CONFLICT`

Data Induk Pendidikan bersifat **dinamis/real-time**. Dua view resmi yang dibaca pada waktu berbeda — atau satu view bertanggal snapshot vs satu view tanpa tanggal — **tidak sedang mengklaim nilai yang sama untuk waktu dan definisi yang sama**. Karena itu klasifikasinya:

> **`TEMPORAL_OR_VIEW_VARIANCE`** — bukan `TRUE_CONFLICT`, bukan pula kesalahan pada salah satu sumber.

Sesuai `research/SOURCE_CONFLICTS.md`, `TRUE_CONFLICT` hanya berlaku bila metrik, scope, **dan** waktu sama tetapi nilainya berbeda. Tidak satu pun entri di bawah memenuhi syarat itu.

---

## VAR-001 — EDU-001 / NPSN 30101104 / SMAN 1 SUNGAI RAYA

| Field | Isi |
|---|---|
| `source_view_A` | Residu Data Induk Pendidikan — tabel wilayah `131310/3?jenjang=Dikmen` |
| `value_A` | **994** |
| `date_A` | **2026-09-10** (snapshot eksplisit) |
| `source_view_B` | Residu Data Induk Pendidikan — detail satuan pendidikan `30101104` |
| `value_B` | 997 |
| `date_B` | *(tidak ditampilkan)* |
| Selisih | 3 peserta didik (≈0,30%) |
| `classification` | `TEMPORAL_OR_VIEW_VARIANCE` |
| `canonical_choice` | **994** (view A) |
| `rationale` | View A memiliki tanggal snapshot eksplisit sehingga **reproducible**; view B tidak. Kebijakan §A/§B: canonical harus dapat direproduksi bersama reference date-nya. Selisih 3 konsisten dengan pergerakan data harian pada sistem dinamis, bukan indikasi salah satu view keliru. |

## VAR-002 — EDU-002 / NPSN 30101107 / SMAN 1 SUNGAI KAKAP

| Field | Isi |
|---|---|
| `source_view_A` | Residu Data Induk Pendidikan — tabel wilayah `131305/3` |
| `value_A` | **778** |
| `date_A` | **2026-09-05** (snapshot eksplisit) |
| `source_view_B` | Residu Data Induk Pendidikan — detail satuan pendidikan `30101107` |
| `value_B` | 777 |
| `date_B` | *(tidak ditampilkan)* |
| Selisih | 1 peserta didik (≈0,13%) |
| `classification` | `TEMPORAL_OR_VIEW_VARIANCE` |
| `canonical_choice` | **778** (view A) |
| `rationale` | Sama seperti VAR-001. Catatan tambahan: paket raw 2026-09-14 mencatat 777 — **sama dengan view B**, mengindikasikan nilai raw kemungkinan berasal dari detail page meski raw mencantumkan URL wilayah. Ini memperkuat alasan memakai snapshot bertanggal sebagai canonical. |

## VAR-003 — EDU-006 / NPSN 30101619 / SD NEGERI 07 BATU AMPAR

| Field | Isi |
|---|---|
| `source_view_A` | Residu Data Induk Pendidikan — tabel wilayah `131311/3?jenjang=Dikdas` |
| `value_A` | **330** |
| `date_A` | **2026-08-30** (snapshot eksplisit) |
| `source_view_B` | Paket raw external 2026-09-14 (URL wilayah yang sama, tanpa reference date terpisah) |
| `value_B` | 333 |
| `date_B` | *(tidak terpisah dari `retrieved_at`)* |
| Selisih | 3 peserta didik (≈0,91%) |
| `classification` | `TEMPORAL_OR_VIEW_VARIANCE` |
| `canonical_choice` | **330** (view A) |
| `rationale` | Hanya view A yang memiliki reference date eksplisit. Raw **tidak diubah** (checksum diverifikasi tetap utuh); koreksi hanya di lapisan interim. Selisih terbesar secara relatif di antara ketiga variance, tetapi tetap dalam rentang pergerakan wajar data dinamis. |

## VAR-004 — EDU-004 / NPSN 30101121 / SMAN 1 KUBU *(belum terselesaikan)*

| Field | Isi |
|---|---|
| `source_view_A` | View resmi Kemendikdasmen (tidak dirinci dalam handoff) |
| `value_A` | *(tidak dilaporkan)* |
| `date_A` | — |
| `source_view_B` | View resmi Kemendikdasmen lain |
| `value_B` | *(tidak dilaporkan)* |
| `date_B` | — |
| `classification` | `TEMPORAL_OR_VIEW_VARIANCE` — **belum direkonsiliasi** |
| `canonical_choice` | **NULL** |
| `rationale` | Paket raw menyatakan terdapat variasi antar view resmi namun **tidak melaporkan nilai spesifik masing-masing view**, sehingga variance tidak dapat dianalisis maupun direkonsiliasi. Canonical tetap NULL — lebih baik kosong daripada memilih salah satu tanpa dasar. Bila kelak direkonsiliasi, entri ini perlu diisi dengan kedua nilai beserta tanggalnya. |

---

## Entri tanpa variance

| record_id | Catatan |
|---|---|
| EDU-005 | Nilai raw (46) **sama** dengan dated snapshot; hanya reference date yang dikoreksi. Tidak ada variance. |
| EDU-003 | Hanya satu observasi (272, tanpa reference date). Tidak ada view kedua untuk dibandingkan — ini **ketiadaan tanggal**, bukan variance. |
| EDU-007 | Hanya satu observasi (158, detail page tanpa tanggal). Idem. |
| HLT-001/002/003 | Tidak ada nilai sama sekali. |

---

## Pola yang terlihat

Ketiga variance yang dapat diukur berada di rentang **0,13%–0,91%** — kecil, satu arah tidak konsisten (view detail lebih tinggi pada EDU-001, lebih rendah pada EDU-002), dan sesuai dengan sistem yang diperbarui terus-menerus. **Tidak ada indikasi kesalahan sistematis pada salah satu view.**

Implikasi Prompt 4: dampak variance terhadap metodologi atau peringkat **belum dinilai**. Tidak ada normalisasi, scoring, atau asumsi bahwa selisih kecil pasti tidak mengubah hasil. Canonical tetap snapshot bertanggal; VAR-004 belum direkonsiliasi.
