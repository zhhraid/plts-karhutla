import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="text-sm text-muted-fg">
        Situs yang diminta tidak ada dalam dataset yang diterbitkan.
      </p>
      <Link href="/" className="rounded-md text-sm font-medium text-secondary">
        Kembali ke ringkasan
      </Link>
    </div>
  );
}
