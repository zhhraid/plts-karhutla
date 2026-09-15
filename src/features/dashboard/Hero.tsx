import { Sun } from "lucide-react";

export function Hero() {
  return (
    <section className="rounded-lg border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-2 text-primary">
        <Sun aria-hidden className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase tracking-widest">
          Kabupaten Kubu Raya, Kalimantan Barat
        </span>
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        SURYA-SIAGA
      </h1>
      <p className="mt-1 text-base font-medium text-slate-700 sm:text-lg">
        Solar Resilience &amp; Expansion Decision Support System
      </p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-fg">
        Platform pre-screening prioritas pengembangan dan penguatan PLTS
        berdasarkan potensi surya, dampak sosial, criticality fasilitas,
        resilience context, dan kualitas data.
      </p>
    </section>
  );
}
