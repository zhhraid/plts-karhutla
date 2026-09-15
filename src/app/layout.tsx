import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SURYA-SIAGA — Pre-screening Prioritas PLTS Kabupaten Kubu Raya",
    template: "%s — SURYA-SIAGA",
  },
  description:
    "Decision Support System untuk pre-screening prioritas pengembangan PLTS pada fasilitas publik di Kabupaten Kubu Raya. Prototipe independen berbasis data publik.",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Lompat ke konten utama
        </a>
        <Navbar />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
