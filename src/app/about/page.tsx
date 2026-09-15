import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Tentang" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Tentang SURYA-SIAGA"
        description="Decision Support System untuk pre-screening prioritas pengembangan PLTS pada fasilitas publik di Kabupaten Kubu Raya, Kalimantan Barat."
      />

      <Card title="Apa yang dilakukan sistem ini">
        <p className="text-sm">
          Menyaring fasilitas publik menjadi daftar kandidat terperingkat untuk
          ditindaklanjuti dengan asesmen teknis, berdasarkan data publik yang
          dapat ditelusuri.
        </p>
      </Card>

      <Card title="Apa yang tidak dilakukan sistem ini">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Bukan perangkat lunak perancangan teknis PLTS.</li>
          <li>Bukan studi kelayakan dan bukan pengganti survei lapangan.</li>
          <li>Tidak menghitung ukuran sistem, biaya, atau hasil energi.</li>
          <li>Tidak mengklaim dukungan atau kerja sama instansi mana pun.</li>
        </ul>
      </Card>
    </>
  );
}
