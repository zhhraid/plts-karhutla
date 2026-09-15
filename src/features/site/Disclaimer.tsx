import { Info } from "lucide-react";

export function Disclaimer() {
  return (
    <aside className="flex items-start gap-3 rounded-lg border border-warning bg-warning-subtle p-4 text-sm text-warning">
      <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        Rekomendasi SURYA-SIAGA merupakan hasil pre-screening awal dan bukan
        keputusan pembangunan atau studi kelayakan teknis final.
      </p>
    </aside>
  );
}
