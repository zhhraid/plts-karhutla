import { NextResponse } from "next/server";

import { getAllSites, getSiteById } from "@/lib/data";

/**
 * GET /api/sites/[id]
 *
 * A record id that is not in the published dataset returns 404. It is never
 * answered with an empty or partially populated record, which a consumer could
 * mistake for a site with no data.
 */
export const dynamic = "force-static";

export async function generateStaticParams() {
  const sites = await getAllSites();
  return sites.map((site) => ({ id: site.recordId }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const site = await getSiteById(id);

  if (site === null) {
    return NextResponse.json(
      { error: `Situs "${id}" tidak ada dalam dataset yang diterbitkan.` },
      { status: 404 },
    );
  }

  return NextResponse.json({ site });
}
