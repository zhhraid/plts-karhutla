import Link from "next/link";
import { Sun } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Ringkasan" },
  { href: "/map", label: "Peta" },
  { href: "/compare", label: "Bandingkan" },
  { href: "/methodology", label: "Metodologi" },
  { href: "/data-sources", label: "Sumber Data" },
  { href: "/about", label: "Tentang" },
] as const;

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold">
          <Sun aria-hidden className="h-5 w-5 text-primary" />
          <span>SURYA-SIAGA</span>
        </Link>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-1 py-1 text-muted-fg hover:text-slate-900"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
