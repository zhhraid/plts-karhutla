/**
 * Data source port.
 *
 * The UI never reads a file, a fetch or a SQL client directly. It depends on
 * this interface only, so a Supabase/PostgreSQL adapter can be added later by
 * implementing `SiteDataSource` and swapping the binding in `index.ts` — with
 * no change to any component.
 */
import type { Site, SiteDataset } from "@/types";

export interface SiteDataSource {
  readonly name: string;
  getDataset(): Promise<SiteDataset>;
  getSites(): Promise<readonly Site[]>;
  getSiteById(recordId: string): Promise<Site | null>;
}
