import type { ReactNode } from "react";

/**
 * A single headline figure.
 *
 * `value` is a string so the caller decides how absence is rendered; this
 * component never formats a number and so can never turn a missing one into 0.
 */
export function StatCard({
  label,
  value,
  caption,
  icon,
}: {
  readonly label: string;
  readonly value: string;
  readonly caption: string;
  readonly icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-fg">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs leading-snug text-muted-fg">{caption}</p>
    </div>
  );
}
