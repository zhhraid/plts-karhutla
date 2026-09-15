/**
 * Selection rules for the comparison view.
 *
 * Pure functions over record ids, so the constraints are testable without a
 * browser and cannot drift between the UI and whatever enforces them.
 */
export const MIN_COMPARE = 2;
export const MAX_COMPARE = 4;

export type SelectionRejection = "duplicate" | "at_capacity" | "not_found";

export interface SelectionResult {
  readonly selection: readonly string[];
  readonly rejected: SelectionRejection | null;
}

/**
 * Adds a site to the selection.
 *
 * A duplicate or an over-capacity add is refused and says which it was, rather
 * than silently doing nothing — the UI has to be able to explain the refusal.
 */
export function addToSelection(
  selection: readonly string[],
  recordId: string,
  knownIds: ReadonlySet<string>,
): SelectionResult {
  if (!knownIds.has(recordId)) {
    return { selection, rejected: "not_found" };
  }
  if (selection.includes(recordId)) {
    return { selection, rejected: "duplicate" };
  }
  if (selection.length >= MAX_COMPARE) {
    return { selection, rejected: "at_capacity" };
  }
  return { selection: [...selection, recordId], rejected: null };
}

export function removeFromSelection(
  selection: readonly string[],
  recordId: string,
): readonly string[] {
  return selection.filter((id) => id !== recordId);
}

export function canCompare(selection: readonly string[]): boolean {
  return selection.length >= MIN_COMPARE && selection.length <= MAX_COMPARE;
}

export function isAtCapacity(selection: readonly string[]): boolean {
  return selection.length >= MAX_COMPARE;
}
