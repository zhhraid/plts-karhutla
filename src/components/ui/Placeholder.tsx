import { Construction } from "lucide-react";

/**
 * Scaffold marker for a route whose UI is not built yet.
 *
 * States plainly that the view is unfinished. A half-built screen that looks
 * finished is worse than an empty one, because a reader cannot tell which
 * numbers are real.
 */
export function Placeholder({ children }: { readonly children: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed border-border-strong bg-surface-sunken p-4 text-sm text-muted-fg">
      <Construction aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-medium">Belum dibangun pada tahap ini. </span>
        {children}
      </p>
    </div>
  );
}
