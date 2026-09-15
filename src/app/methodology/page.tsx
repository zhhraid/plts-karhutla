import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { InfoTip } from "@/components/ui/InfoTip";
import { Callout, Formula, Section } from "@/features/methodology/Section";
import { getAllSites, getConfidenceSummary, getDataset } from "@/lib/data";
import { formatPercent, formatScore } from "@/lib/formatting";
import { DIMENSION_DESCRIPTIONS, DIMENSION_ORDER, BASELINE_LABELS } from "@/lib/scoring/dimensions";
import type { DecisionDimension } from "@/types";

export const metadata: Metadata = { title: "Metodologi" };

const DIMENSION_TERM: Readonly<Record<DecisionDimension, "solarSuitability" | "socialImpact" | "facilityCriticality" | "resilienceNeed">> = {
  solar: "solarSuitability",
  social: "socialImpact",
  criticality: "facilityCriticality",
  resilience: "resilienceNeed",
};

export default async function MethodologyPage() {
  const [{ meta }, sites, confidence] = await Promise.all([
    getDataset(),
    getAllSites(),
    getConfidenceSummary(),
  ]);

  const missingSolar = sites.filter((site) => site.missingData.includes("solar")).length;
  const profiles = [...new Set(sites.map((site) => site.coverageProfile))];
  const proxySite = sites.find((site) => site.karhutlaProxy.value !== null);

  return (
    <>
      <PageHeader
        title="Metodologi Penilaian"
        description="Bagaimana SURYA-SIAGA menghasilkan indikasi prioritas awal, apa yang dijamin angkanya, dan apa yang tidak. Ditulis agar dapat diikuti tanpa latar belakang data science."
      />

      <Callout>
        SURYA-SIAGA adalah sistem pendukung keputusan untuk{" "}
        <strong>pre-screening</strong>. Keluarannya bukan studi kelayakan, bukan
        perancangan teknis, bukan keputusan pembangunan, dan bukan mesin
        rekomendasi berbasis AI. Tidak ada model bahasa yang berjalan saat
        halaman ini dibuka.
      </Callout>

      <Section
        index={1}
        title="Input data"
        lead="Seluruh angka berasal dari data publik yang dapat ditelusuri, diproses menjadi satu berkas sebelum aplikasi dijalankan."
      >
        <ul className="list-disc space-y-1 pl-5">
          <li>Inventaris fasilitas publik berkoordinat terverifikasi (sekolah dan puskesmas).</li>
          <li>Jumlah penerima manfaat dari sumber primer, bila tersedia.</li>
          <li>Iradiasi surya (GHI) tingkat titik dari Global Solar Atlas — belum diekstraksi.</li>
          <li>Kelas bahaya karhutla tingkat kecamatan beserta rincian luas areanya.</li>
          <li>Konteks kekeringan tingkat kabupaten.</li>
          <li>Bukti PLTS historis 2021.</li>
        </ul>
        <p>
          Pipa data berjalan sebelum build: data interim → skoring → validator 12
          pemeriksaan → berkas aplikasi. Data analitik situs{" "}
          <strong>tidak bergantung pada API langsung mana pun</strong> saat
          halaman dibuka. Satu-satunya dependensi jaringan runtime pada produk ini
          adalah ubin peta dasar, yang merupakan konteks visual dan bukan sumber
          data analitik.
        </p>
      </Section>

      <Section
        index={2}
        title="Empat dimensi keputusan"
        lead="Setiap situs dinilai pada empat dimensi, masing-masing pada skala 0–100."
      >
        <ul className="space-y-3">
          {DIMENSION_ORDER.map((dimension) => (
            <li key={dimension} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="inline-flex items-center gap-1 font-medium">
                  {BASELINE_LABELS[dimension]}
                  <InfoTip term={DIMENSION_TERM[dimension]} />
                </span>
                <span className="text-sm tabular-nums text-muted-fg">
                  bobot baseline {meta.baselineWeights[dimension]}%
                </span>
              </div>
              <p className="mt-1 text-muted-fg">{DIMENSION_DESCRIPTIONS[dimension]}</p>
            </li>
          ))}
        </ul>
        <Callout>
          Bobot merupakan <strong>MVP design assumption</strong> dan belum
          merupakan hasil expert-validated AHP. Tidak ada pairwise comparison
          dari panel ahli yang mendasarinya.
        </Callout>
        <p>
          Metode yang dipakai adalah <strong>Weighted Multi-Criteria Decision
          Analysis (Weighted Sum Model)</strong>. Sistem ini{" "}
          <strong>tidak mengklaim AHP</strong>.
        </p>
      </Section>

      <Section
        index={3}
        title="Normalisasi"
        lead="Setiap dimensi dibawa ke skala 0–100 agar dapat dijumlahkan secara berbobot."
      >
        <p>
          <strong>Social Impact</strong> — {meta.socialNormalisation}. Log dipakai
          karena rentang nilai terukur mencapai sekitar 21 kali lipat; min-max
          linear akan membuat sekolah terkecil hampir tidak berkontribusi. Lantai
          10 dipakai agar nilai terkecil yang{" "}
          <em>terukur</em> tidak menjadi tepat 0 — dalam penjumlahan berbobot, 0
          tidak dapat dibedakan dari &ldquo;tidak ada data&rdquo;.
        </p>
        <p>
          <strong>Facility Criticality</strong> — aturan menurut tipe: Puskesmas
          100, Sekolah 70.
        </p>
        <p>
          <strong>Resilience Need</strong> — kelas bahaya ordinal: Rendah 33,
          Sedang 67, Tinggi 100.
        </p>
        <p>
          <strong>Solar Suitability</strong> — nilai GHI site-level diteruskan apa
          adanya. Saat ini belum tersedia.
        </p>
      </Section>

      <Section
        index={4}
        title="Weighted Sum Model"
        lead="Priority Score adalah rata-rata berbobot atas dimensi yang datanya tersedia."
      >
        <Formula>
{`P = himpunan dimensi yang TERSEDIA untuk situs tersebut

available_weight_sum      = Σ (bobot_i)            untuk i ∈ P
priority_score            = Σ (skor_i × bobot_i) / available_weight_sum
available_weight_fraction = available_weight_sum / Σ (seluruh bobot)`}
        </Formula>
        <p>Contoh nyata dari dataset ini (EDU-001, solar hilang):</p>
        <Formula>
{`available = 25 + 20 + 25 = 70          (fraction 0,70)
score     = (100×25 + 70×20 + 100×25) / 70
          = 6400 / 70
          = 91,43`}
        </Formula>
      </Section>

      <Section
        index={5}
        title="Penanganan nilai hilang — NULL bukan 0"
        lead="Aturan paling penting dalam sistem ini, dan yang paling mudah dilanggar tanpa disadari."
      >
        <p>{meta.missingValuePolicy}</p>
        <p>Bila sebuah dimensi tidak memiliki data, maka dimensi tersebut:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>tidak diberi nilai nol;</li>
          <li>tidak masuk pembilang;</li>
          <li>tidak masuk penyebut;</li>
          <li>bobot yang tersisa dinormalisasi ulang;</li>
          <li>kelengkapan bukti tetap ditampilkan sebagai <em>coverage</em>;</li>
          <li>memengaruhi Data Confidence;</li>
          <li>membuat skor berstatus provisional.</li>
        </ul>
        <Callout>
          Konsekuensinya harus disadari: dua situs dengan coverage berbeda{" "}
          <strong>tidak selalu adil untuk dibandingkan langsung</strong>, karena
          masing-masing dinilai hanya pada dimensi yang kebetulan dimilikinya.
          Karena itu halaman Bandingkan memperingatkan ketika profil cakupan
          berbeda, dan peringkat pada Ringkasan hanya berlaku di dalam kelompok
          cakupan yang sama.
        </Callout>
        <p>
          Dataset saat ini memuat {profiles.length} profil cakupan berbeda,
          sehingga <strong>tidak ada peringkat global</strong> yang diterbitkan.
        </p>
      </Section>

      <Section
        index={6}
        title="Priority Score dan statusnya"
        lead="Angka hanya diterbitkan bila cakupan minimumnya terpenuhi."
      >
        <Formula>
{`Skor numerik diterbitkan HANYA bila:
  |P| ≥ 2  DAN  "criticality" ∈ P

Jika tidak → priority_score = NULL, status = INSUFFICIENT_DATA.
Tidak ada angka yang diterbitkan sama sekali.`}
        </Formula>
        <p>
          Pita tampilan (Tinggi ≥ 75, Menengah 50–74,99, Rendah &lt; 50) adalah
          alat bantu baca atas satu angka, bukan dimensi kelima. Situs tanpa skor{" "}
          <strong>tidak pernah</strong> ditampilkan sebagai prioritas rendah —
          ketiadaan skor bukan skor rendah.
        </p>
      </Section>

      <Section
        index={7}
        title="Data Confidence — terpisah dari Priority Score"
        lead="Dua pertanyaan berbeda: seberapa tinggi indikasinya, dan seberapa kuat buktinya."
      >
        <p>
          <strong>Data Confidence tidak pernah menaikkan maupun menurunkan
          Priority Score.</strong> Keduanya disimpan di kolom terpisah dan
          pemisahannya diperiksa validator secara eksplisit.
        </p>
        <p>Enam dimensi bukti, maksimum 8 poin:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Source Authority</strong> — portal pemerintah atau sumber teknis otoritatif (+2)</li>
          <li><strong>Data Recency</strong> — koordinat dari profil resmi terkini (+1)</li>
          <li><strong>Data Completeness</strong> — 4 dimensi (+2), 3 dimensi (+1), ≤2 (0)</li>
          <li><strong>Verification Status</strong> — penerima manfaat terverifikasi primer dan bertanggal (+1)</li>
          <li><strong>Spatial Specificity</strong> — nilai bahaya per titik situs (+1)</li>
          <li><strong>Conflict / Variance</strong> — tidak ada variansi antar-view tercatat (+1)</li>
        </ul>
        <p>
          Kategori: <strong>HIGH</strong> (≥6) · <strong>MEDIUM</strong> (4–5) ·{" "}
          <strong>NEEDS_VERIFICATION</strong> (≤3).
        </p>
        <p>
          Spatial Specificity juga berfungsi sebagai <strong>plafon</strong>:
          selama input bahaya sebuah situs masih proksi kecamatan, situs itu tidak
          dapat mencapai HIGH, sebaik apa pun dimensi lainnya. Alasannya logika
          bukti, bukan kalkulasi poin — bila bukti bahaya bukan tentang lokasi
          situs itu sendiri, keyakinan tinggi pada rekomendasi situs tersebut
          tidak dapat dibenarkan.
        </p>
        <Callout>
          Akibatnya, saat ini <strong>{confidence.byLevel.HIGH} situs</strong>{" "}
          berkategori HIGH dari {confidence.total} situs.{" "}
          {confidence.spatiallyCapped} situs terkena plafon spesifisitas spasial.
          Ambang batas <strong>tidak diturunkan</strong> agar hasilnya terlihat
          lebih baik; angka ini adalah keadaan bukti yang sebenarnya.
        </Callout>
      </Section>

      <Section
        index={8}
        title="Logika rekomendasi"
        lead="Seluruh keluaran adalah rekomendasi untuk MENGKAJI, tidak satu pun untuk membangun."
      >
        <Formula>
{`1. Fasilitas terkait PLTS eksisting?
     hubungan ditetapkan     → EXPANSION_ASSESSMENT
     hubungan belum ditetapkan → NEEDS_DATA_VERIFICATION
2. Dimensi solar hilang?      → NEEDS_DATA_VERIFICATION
3. Selain itu                 → NEW_DEPLOYMENT_ASSESSMENT`}
        </Formula>
        <p>
          Kesamaan nama desa <strong>bukan</strong> bukti hubungan fisik atau
          operasional dengan instalasi PLTS. Sistem tidak pernah menyimpulkan
          kapasitas tambahan, dan tidak pernah menyatakan sebuah situs
          &ldquo;layak dibangun&rdquo;.
        </p>
      </Section>

      <Section
        index={9}
        title="Karhutla: proksi struktural tingkat kecamatan"
        lead="Apa yang diukur, dan yang lebih penting — apa yang tidak."
      >
        <p>
          Rincian luas area per kelas bahaya tersedia di tingkat kecamatan,
          sehingga proksi struktural berikut dapat dihitung dan diterbitkan:
        </p>
        <Formula>
{`karhutla_structural_proxy =
  ( 0,0 × low_area_ha
  + 0,5 × medium_area_ha
  + 1,0 × high_area_ha )
  / total_area_ha
  × 100`}
        </Formula>
        {proxySite === undefined ? null : (
          <p className="text-muted-fg">
            Contoh — {proxySite.facilityName} (Kec. {proxySite.district}):
            proksi {formatScore(proxySite.karhutlaProxy.value)}, sementara kelas
            mentahnya &ldquo;{proxySite.karhutla.rawClass}&rdquo;.
          </p>
        )}
        <Callout>
          Angka ini adalah <strong>district-level structural hazard proxy</strong>.
          Ia <strong>BUKAN</strong> probabilitas kebakaran, <strong>BUKAN</strong>{" "}
          risiko site-specific, <strong>BUKAN</strong> prediksi kebakaran, dan{" "}
          <strong>BUKAN</strong> skor hotspot langsung. Bahaya bukan risiko.
        </Callout>
        <p>
          Dimensi Resilience Need saat ini menilai{" "}
          <strong>kelas mentah ordinal</strong>, bukan proksi ini. Mengadopsi
          proksi sebagai input skor mengubah peringkat secara substansial
          (lihat analisis sensitivitas) dan merupakan perubahan metodologi inti
          yang memerlukan persetujuan manusia. Proksi diterbitkan untuk
          transparansi dan perbandingan; kelas mentah tetap ditampilkan.
        </p>
      </Section>

      <Section
        index={10}
        title="Konteks kekeringan, keterbatasan solar, dan sensitivitas"
        lead="Tiga hal yang membatasi seberapa jauh hasil ini boleh dibaca."
      >
        <div>
          <h3 className="font-medium">Kekeringan</h3>
          <p className="text-muted-fg">
            Data kekeringan saat ini hanya tersedia pada level kabupaten dan
            bernilai sama untuk setiap situs.{" "}
            <strong>Konteks kekeringan tidak membedakan antarsitus</strong> dan
            karena itu dikeluarkan dari skor. Tidak ada skor kekeringan
            site-specific yang dibuat-buat.
          </p>
        </div>

        <div>
          <h3 className="font-medium">Solar</h3>
          <p className="text-muted-fg">
            Global Solar Atlas 2.0 adalah sumber utama yang direncanakan, dan
            lisensinya sudah terverifikasi. Namun{" "}
            <strong>ekstraksi nilai per titik belum tersedia</strong> pada dataset
            MVP ini: GHI masih kosong pada {missingSolar} dari {sites.length}{" "}
            situs. Kriteria solar karena itu berstatus{" "}
            <em>pending</em>, dan seluruh skor situs bersifat provisional.{" "}
            <strong>Solar tidak pernah ditampilkan sebagai 0.</strong>
          </p>
        </div>

        <div>
          <h3 className="font-medium">Sensitivitas bobot</h3>
          <p className="text-muted-fg">
            Menggeser bobot baseline tidak mengubah urutan pada dataset saat ini.
            Itu <strong>bukan</strong> bukti bahwa metode ini kokoh — melainkan
            akibat kemiskinan data: dengan solar kosong di seluruh situs dan
            bahaya hanya dua kelas, tidak banyak yang tersisa untuk digeser.
            Sebaliknya, mengganti encoding bahaya dari kelas ordinal ke proksi
            area mengubah peringkat secara substansial.
          </p>
        </div>

        <div>
          <h3 className="font-medium">Keterbatasan yang tetap berlaku</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-fg">
            <li>
              {sites.length} situs berkoordinat terverifikasi — ini pre-screening,
              bukan sensus.
            </li>
            <li>
              Tidak ada situs yang skornya mencakup 100% bobot baseline; cakupan
              tertinggi saat ini{" "}
              {formatPercent(Math.max(...sites.map((site) => site.availableWeightFraction)))}.
            </li>
            <li>Bahaya karhutla hanya proksi kecamatan, bukan nilai piksel situs.</li>
            <li>Bobot masih asumsi desain MVP, bukan hasil AHP tervalidasi ahli.</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
