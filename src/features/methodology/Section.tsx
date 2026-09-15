import type { ReactNode } from "react";

/**
 * A numbered methodology step.
 *
 * Numbered because the sections read as a pipeline: a juror or planner should
 * be able to follow input to output in order without cross-referencing.
 */
export function Section({
  index,
  title,
  lead,
  children,
}: {
  readonly index: number;
  readonly title: string;
  readonly lead?: string;
  readonly children: ReactNode;
}) {
  return (
    <section
      id={`langkah-${index}`}
      className="rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary-fg"
        >
          {index}
        </span>
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="sr-only">Langkah {index}: </span>
          {title}
        </h2>
      </div>
      {lead === undefined ? null : (
        <p className="mt-2 text-sm leading-relaxed text-muted-fg">{lead}</p>
      )}
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function Formula({ children }: { readonly children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-surface-sunken p-3 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export function Callout({
  tone = "warning",
  children,
}: {
  readonly tone?: "warning" | "info";
  readonly children: ReactNode;
}) {
  const classes =
    tone === "warning"
      ? "border-warning bg-warning-subtle text-warning"
      : "border-secondary bg-secondary-subtle text-secondary-fg";
  return (
    <p className={`rounded-md border px-3 py-2 text-sm leading-snug ${classes}`}>
      {children}
    </p>
  );
}
