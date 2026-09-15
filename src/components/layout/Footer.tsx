/**
 * Standing disclosure.
 *
 * Present on every page, not only where a score is shown: the product's status
 * as an independent prototype is a fact about the whole tool, and burying it on
 * one page would let a reader carry the wrong assumption everywhere else.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs text-muted-fg">
        <p>
          SURYA-SIAGA adalah prototipe independen untuk pre-screening prioritas
          PLTS. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak mewakili
          Pemerintah Kabupaten Kubu Raya, PLN, atau Kementerian ESDM.
        </p>
        <p>
          Keluaran sistem ini adalah penyaringan awal berbasis data publik, bukan
          studi kelayakan teknis dan bukan dasar tunggal untuk keputusan investasi.
          Diperlukan survei lapangan dan asesmen teknis sebelum keputusan diambil.
        </p>
      </div>
    </footer>
  );
}
