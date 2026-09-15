import type { ReactNode } from "react";

interface CardProps {
  readonly title?: string;
  readonly children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      {title === undefined ? null : (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-fg">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
