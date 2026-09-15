import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

/**
 * Shown when a view has nothing to render.
 *
 * Always says why the result is empty and what would change it. "No results"
 * on its own leaves a reader unable to tell a working filter from a broken page.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface p-8 text-center">
      <SearchX aria-hidden className="h-6 w-6 text-muted-fg" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted-fg">{description}</p>
      </div>
      {action}
    </div>
  );
}
