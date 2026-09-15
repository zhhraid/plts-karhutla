/**
 * The comparison matrix, defined once as data.
 *
 * Both the desktop table and the mobile stacked cards render from this list,
 * so the two layouts cannot drift apart in which fields they show or how an
 * absent value is worded.
 */
import type { GlossaryKey } from "@/lib/glossary";
import type { Site } from "@/types";

/** How a value is rendered when it is absent — the semantics differ. */
export type AbsenceKind =
  | "not_available" // never obtained
  | "pending_verification" // exists, unconfirmed
  | "not_applicable"; // meaningless for this site

export interface CompareCell {
  readonly text: string;
  /** Null when the value is present. */
  readonly absence: AbsenceKind | null;
  /** Secondary line, e.g. the spatial scope of the value above. */
  readonly note?: string;
}

export interface CompareRow {
  readonly key: string;
  readonly label: string;
  readonly group: CompareGroup;
  readonly term?: GlossaryKey;
  readonly cell: (site: Site) => CompareCell;
}

export type CompareGroup =
  | "identity"
  | "result"
  | "dimensions"
  | "observations"
  | "coverage"
  | "context";

export const GROUP_LABEL: Readonly<Record<CompareGroup, string>> = {
  identity: "Identitas",
  result: "Hasil penilaian",
  dimensions: "Skor per dimensi",
  observations: "Observasi dasar",
  coverage: "Kelengkapan bukti",
  context: "Konteks",
};

export const ABSENCE_LABEL: Readonly<Record<AbsenceKind, string>> = {
  not_available: "Data belum tersedia",
  pending_verification: "Pending verification",
  not_applicable: "Tidak berlaku",
};

export function present(text: string, note?: string): CompareCell {
  return note === undefined ? { text, absence: null } : { text, absence: null, note };
}

export function absent(kind: AbsenceKind, note?: string): CompareCell {
  return note === undefined
    ? { text: ABSENCE_LABEL[kind], absence: kind }
    : { text: ABSENCE_LABEL[kind], absence: kind, note };
}
