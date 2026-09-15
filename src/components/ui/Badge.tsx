import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "unverified";

const TONE_CLASS: Readonly<Record<BadgeTone, string>> = {
  neutral: "bg-surface-sunken text-muted-fg border-border-strong",
  success: "bg-success-subtle text-success border-success",
  warning: "bg-warning-subtle text-warning border-warning",
  danger: "bg-danger-subtle text-danger border-danger",
  info: "bg-secondary-subtle text-secondary border-secondary",
  unverified: "bg-violet-50 text-violet-700 border-violet-500",
};

interface BadgeProps {
  readonly tone?: BadgeTone;
  readonly children: ReactNode;
}

/**
 * Status chip. Colour is never the only signal — the label text always states
 * the status in words, so the badge still reads correctly in greyscale and to a
 * screen reader.
 */
export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

export type { BadgeTone };
