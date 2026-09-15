import { NOT_AVAILABLE } from "@/lib/formatting";

/**
 * Renders an absent measurement.
 *
 * Exists so that "no data" has exactly one appearance across the product, and
 * so that no screen can ever fall back to rendering a missing number as 0.
 */
export function MissingValue({ why }: { readonly why?: string }) {
  return (
    <span className="text-muted-fg">
      <span className="italic">{NOT_AVAILABLE}</span>
      {why === undefined ? null : (
        <span className="ml-1 text-xs">({why})</span>
      )}
    </span>
  );
}
