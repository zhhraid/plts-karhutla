import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";

export default function SiteNotFound() {
  return (
    <EmptyState
      title="Situs tidak ditemukan"
      description="Kode situs yang diminta tidak ada dalam dataset yang diterbitkan. Situs yang tidak memiliki koordinat terverifikasi memang tidak masuk ke himpunan kandidat."
      action={
        <Link
          href="/"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-muted"
        >
          Kembali ke ringkasan
        </Link>
      }
    />
  );
}
