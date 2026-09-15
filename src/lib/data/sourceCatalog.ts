/**
 * Catalogue of the data source families behind SURYA-SIAGA.
 *
 * Curated metadata — authority, limitations, licence — that the per-site
 * observation rows do not carry. The source NAMES and URLs here must match what
 * the dataset actually cites; `src/lib/data/__tests__/sourceCatalog.test.ts`
 * fails if a catalogue entry claims a source the canonical data does not use.
 *
 * `status` distinguishes what is IN the product from what is merely planned. A
 * planned source listed as if it were in use would misrepresent the evidence
 * base, so the distinction is a field rather than a footnote.
 */
export type SourceStatus = "in_canonical_data" | "planned_not_yet_available";

export type SourceAuthority = "A" | "B" | "C";

export interface CatalogEntry {
  readonly id: string;
  readonly name: string;
  /** A = primary official, B = authoritative technical, C = credible contextual. */
  readonly authority: SourceAuthority;
  readonly authorityNote: string;
  readonly usedFor: string;
  readonly spatialScope: string;
  readonly referencePeriod: string;
  readonly verificationStatus: string;
  readonly limitations: readonly string[];
  readonly licence: string | null;
  readonly attribution: string | null;
  readonly url: string | null;
  readonly status: SourceStatus;
  /** Source names as they appear in the dataset's per-site provenance rows. */
  readonly datasetSourceNames: readonly string[];
  /**
   * Where the "used on N sites" figure comes from.
   *
   * Most sources appear in per-site provenance rows. The existing-PLTS source
   * sits in the asset layer instead, and counting it against provenance rows
   * would report zero for a source that is genuinely in use.
   */
  readonly usageCountedFrom: "site_sources" | "existing_plts_context";
}

export const SOURCE_CATALOG: readonly CatalogEntry[] = [
  {
    id: "kemendikdasmen",
    name: "Kemendikdasmen — Referensi Data Pendidikan & Data Induk Pendidikan",
    authority: "A",
    authorityNote: "Portal resmi kementerian",
    usedFor:
      "Identitas sekolah, koordinat fasilitas, dan jumlah peserta didik (dimensi Social Impact).",
    spatialScope: "Titik fasilitas (site-level)",
    referencePeriod: "Diakses 2026; tanggal rujukan per-situs bervariasi",
    verificationStatus: "verified_primary pada sebagian situs; requires_verification pada sisanya",
    limitations: [
      "Sebagian situs tidak memiliki tanggal rujukan, sehingga jumlah peserta didik tidak dapat dinyatakan bertanggal.",
      "Terdapat variansi antar-view sumber pada sebagian situs; dicatat sebagai variansi, bukan konflik.",
    ],
    licence: null,
    attribution: null,
    url: "https://referensi.data.kemendikdasmen.go.id/",
    status: "in_canonical_data",
    usageCountedFrom: "site_sources",
    datasetSourceNames: [
      "Kemendikdasmen - Referensi Data Pendidikan",
      "Kemendikdasmen - Residu Data Induk Pendidikan (tabel wilayah)",
      "Kemendikdasmen",
    ],
  },
  {
    id: "dinkes-kubu-raya",
    name: "Dinas Kesehatan Kabupaten Kubu Raya & portal resmi UPTD Puskesmas",
    authority: "A",
    authorityNote: "Dinas daerah dan portal resmi unit pelaksana",
    usedFor: "Identitas dan koordinat puskesmas.",
    spatialScope: "Titik fasilitas (site-level)",
    referencePeriod: "Dataset koordinat 2021",
    verificationStatus: "verified_primary",
    limitations: [
      "Koordinat berasal dari dataset 2021, bukan lokasi terverifikasi terkini — ditandai Historical Data.",
      "Tidak tersedia jumlah penerima manfaat site-level untuk puskesmas, sehingga dimensi Social Impact kosong.",
    ],
    licence: null,
    attribution: null,
    url: null,
    status: "in_canonical_data",
    usageCountedFrom: "site_sources",
    datasetSourceNames: [
      "Dinas Kesehatan Kabupaten Kubu Raya",
      "Portal Resmi UPTD Puskesmas Kubu",
      "Portal Resmi UPTD Puskesmas Padang Tikar",
      "Portal Resmi UPTD Puskesmas Sungai Kerawang",
    ],
  },
  {
    id: "global-solar-atlas",
    name: "Global Solar Atlas 2.0",
    authority: "B",
    authorityNote: "Sumber teknis otoritatif internasional",
    usedFor:
      "Iradiasi surya (GHI) tingkat titik untuk dimensi Solar Suitability — sumber utama yang direncanakan.",
    spatialScope: "Titik fasilitas (site-level), setelah ekstraksi",
    referencePeriod: "Lisensi diverifikasi 2026-09-14; periode data belum ditetapkan",
    verificationStatus: "requires_point_extraction — nilai belum diambil",
    limitations: [
      "Ekstraksi nilai per titik belum tersedia pada dataset MVP ini; GHI masih kosong untuk seluruh situs.",
      "Dimensi Solar karena itu berstatus pending dan tidak pernah dinilai 0.",
      "MVP hanya menyimpan derived point values; raster tidak disimpan maupun ditampilkan.",
    ],
    licence: "CC BY 4.0",
    attribution:
      "Global Solar Atlas 2.0; World Bank Group; ESMAP; Solargis. Derived point values under CC BY 4.0.",
    url: "https://globalsolaratlas.info/",
    status: "in_canonical_data",
    usageCountedFrom: "site_sources",
    datasetSourceNames: ["Global Solar Atlas 2.0"],
  },
  {
    id: "karhutla-structural",
    name: "Wijaya, Akbar & Romiyanto (2024) — Tabel 10 Kelas Bahaya Bencana Karhutla",
    authority: "C",
    authorityNote: "Sumber sekunder terpublikasi; proksi struktural",
    usedFor:
      "Kelas bahaya karhutla tingkat kecamatan untuk dimensi Resilience Need, serta rincian luas area untuk proksi struktural.",
    spatialScope: "Kecamatan (district-level structural proxy)",
    referencePeriod: "Hasil pengolahan data 2023; dipublikasikan 2024",
    verificationStatus: "verified_secondary",
    limitations: [
      "District-level structural hazard proxy — bukan probabilitas kebakaran, bukan risiko site-specific, bukan prediksi, bukan skor hotspot langsung.",
      "Karena bukan nilai di titik situs, seluruh situs terkena plafon spesifisitas spasial pada Data Confidence.",
      "Bahaya bukan risiko: kelas ini menyatakan paparan, bukan konsekuensi maupun kerentanan.",
    ],
    licence: null,
    attribution: null,
    url: null,
    status: "in_canonical_data",
    usageCountedFrom: "site_sources",
    datasetSourceNames: [
      "Wijaya, Akbar & Romiyanto (2024) - Tabel 10 Kelas Bahaya Bencana Karhutla",
    ],
  },
  {
    id: "kajian-risiko-bencana",
    name: "Dokumen Kajian Risiko Bencana Kabupaten Kubu Raya 2026–2030 (salinan sekunder)",
    authority: "C",
    authorityNote: "Salinan sekunder; memerlukan konfirmasi resmi",
    usedFor: "Konteks bahaya kekeringan tingkat kabupaten.",
    spatialScope: "Kabupaten (konteks saja)",
    referencePeriod: "2026–2030 (periode kajian)",
    verificationStatus: "secondary_copy_requires_official_confirmation",
    limitations: [
      "Bernilai sama untuk setiap situs, sehingga tidak memiliki daya pembeda antarsitus dan dikeluarkan dari skor.",
      "Salinan sekunder; konfirmasi dari dokumen resmi belum diperoleh.",
    ],
    licence: null,
    attribution: null,
    url: null,
    status: "in_canonical_data",
    usageCountedFrom: "site_sources",
    datasetSourceNames: [
      "Dokumen Kajian Risiko Bencana Kabupaten Kubu Raya 2026-2030 (secondary copy)",
    ],
  },
  {
    id: "bpk-plts-2021",
    name: "BPK Perwakilan Provinsi Kalimantan Barat — hibah PLTS tiga desa (2021)",
    authority: "B",
    authorityNote: "Lembaga negara; pemberitaan resmi",
    usedFor:
      "Historical Existing PLTS Evidence — konteks aset PLTS historis di Kecamatan Batu Ampar.",
    spatialScope: "Desa",
    referencePeriod: "2021 (serah terima aset)",
    verificationStatus: "Historical Data; status operasional terkini memerlukan verifikasi",
    limitations: [
      "Bukti historis, bukan bukti PLTS aktif. Status operasional saat ini belum diverifikasi.",
      "Kapasitas (capacity_kwp) dan tahun komisioning masih belum terselesaikan dan karena itu tidak ditampilkan di mana pun.",
      "Serah terima aset 2021 tidak sama dengan tahun komisioning.",
      "Keterkaitan dengan fasilitas kandidat hanya berdasarkan kesamaan nama desa — bukan bukti hubungan fisik atau operasional.",
    ],
    licence: null,
    attribution: null,
    url: "https://kalbar.bpk.go.id/tiga-desa-terjauh-di-kubu-raya-terima-hibah-plts/",
    status: "in_canonical_data",
    usageCountedFrom: "existing_plts_context",
    datasetSourceNames: ["BPK Perwakilan Provinsi Kalimantan Barat"],
  },
  {
    id: "inarisk-bnpb",
    name: "InaRISK / BNPB",
    authority: "A",
    authorityNote: "Portal resmi badan nasional",
    usedFor:
      "Direncanakan untuk ekstraksi nilai bahaya per titik situs, yang akan mengangkat plafon spesifisitas spasial pada Data Confidence.",
    spatialScope: "Piksel/titik (setelah ekstraksi)",
    referencePeriod: "Belum ditetapkan",
    verificationStatus: "Belum masuk canonical data",
    limitations: [
      "Tidak ada nilai InaRISK dalam dataset canonical saat ini. Akses terhambat dan ekstraksi titik belum dilakukan.",
      "Dicantumkan di sini sebagai sumber yang direncanakan, bukan sumber yang dipakai.",
    ],
    licence: null,
    attribution: null,
    url: "https://inarisk.bnpb.go.id/",
    status: "planned_not_yet_available",
    usageCountedFrom: "site_sources",
    datasetSourceNames: [],
  },
];

/** Basemap tiles are visual context, never an analytical data source. */
export const BASEMAP_ATTRIBUTION = {
  name: "OpenStreetMap",
  role: "Ubin peta dasar — konteks visual pada halaman Peta.",
  licence: "Open Database License (ODbL)",
  attribution: "© OpenStreetMap contributors",
  url: "https://www.openstreetmap.org/copyright",
} as const;
