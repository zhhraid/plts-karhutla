"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";

import { GLOSSARY, type GlossaryKey } from "@/lib/glossary";

/**
 * Accessible definition popover.
 *
 * A real <button> with `aria-describedby`, toggled by click and by keyboard,
 * and dismissible with Escape. Hover-only tooltips are unreachable by keyboard
 * and by touch, which would put every definition here out of reach for part of
 * the audience.
 */
export function InfoTip({ term }: { readonly term: GlossaryKey }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const entry = GLOSSARY[term];

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={`Penjelasan: ${entry.term}`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="rounded-full p-0.5 text-muted-fg hover:text-slate-900"
      >
        <Info aria-hidden className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1 w-64 -translate-x-1/2 rounded-md border border-border bg-surface p-3 text-left text-xs font-normal leading-snug text-slate-900 shadow-lg"
        >
          <span className="mb-1 block font-semibold">{entry.term}</span>
          {entry.definition}
        </span>
      ) : null}
    </span>
  );
}
