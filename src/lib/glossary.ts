/**
 * Plain-language definitions for the terms this product coins.
 *
 * One definition per term, used by every tooltip and by the methodology page,
 * so a term can never be explained one way on one screen and another way
 * elsewhere.
 */
export interface GlossaryEntry {
  readonly term: string;
  readonly definition: string;
}

export const GLOSSARY = {
  priorityScore: {
    term: "Priority Score",
    definition:
      "Indikasi prioritas awal pada skala 0–100, dari penjumlahan berbobot atas dimensi yang datanya tersedia. Bukan penilaian kelayakan teknis dan bukan keputusan pembangunan.",
  },
  provisionalPriority: {
    term: "Provisional Priority",
    definition:
      "Skor yang belum lengkap dimensinya. Masih dapat berubah ketika data yang hilang tersedia, sehingga tidak boleh dibaca sebagai hasil akhir.",
  },
  dataConfidence: {
    term: "Data Confidence",
    definition:
      "Kekuatan bukti di balik sebuah skor, dinilai terpisah dari skor itu sendiri. Keyakinan data tidak pernah menaikkan maupun menurunkan Priority Score.",
  },
  solarSuitability: {
    term: "Solar Suitability",
    definition:
      "Potensi iradiasi surya di titik fasilitas, dari nilai GHI site-level. Bobot baseline terbesar (30), namun belum tersedia untuk satu situs pun pada MVP ini.",
  },
  socialImpact: {
    term: "Social Impact",
    definition:
      "Besaran manfaat sosial, diproksikan dari jumlah penerima manfaat terverifikasi di fasilitas. Dinormalisasi log10 ke rentang 10–100 relatif terhadap kohort.",
  },
  facilityCriticality: {
    term: "Facility Criticality",
    definition:
      "Kekritisan layanan bila pasokan listrik terputus, berbasis aturan menurut tipe fasilitas: Puskesmas 100, Sekolah 70.",
  },
  resilienceNeed: {
    term: "Resilience Need",
    definition:
      "Kebutuhan ketahanan terhadap bahaya karhutla, dari kelas bahaya tingkat kecamatan. Bahaya, bukan risiko — tidak menyatakan konsekuensi maupun kerentanan.",
  },
  availableWeight: {
    term: "Available Weight",
    definition:
      "Porsi bobot baseline yang benar-benar didukung data. Dimensi yang hilang dikeluarkan dari pembilang dan penyebut, lalu sisanya dinormalisasi ulang. Ini ukuran kelengkapan bukti, bukan ukuran kualitas situs.",
  },
  coverageProfile: {
    term: "Coverage Profile",
    definition:
      "Himpunan dimensi yang menyusun sebuah skor. Dua situs hanya sebanding langsung bila profil cakupannya sama.",
  },
  needsVerification: {
    term: "Needs Verification",
    definition:
      "Bukti belum cukup untuk menentukan jalur tindak lanjut. Bukan penilaian negatif terhadap situs — pernyataan tentang datanya, bukan tentang tempatnya.",
  },
  karhutlaProxy: {
    term: "Karhutla Structural Proxy",
    definition:
      "Proksi bahaya struktural tingkat kecamatan dari pembobotan luas area per kelas bahaya. Bukan probabilitas kebakaran, bukan risiko site-specific, bukan prediksi, bukan skor hotspot langsung.",
  },
} as const satisfies Record<string, GlossaryEntry>;

export type GlossaryKey = keyof typeof GLOSSARY;
