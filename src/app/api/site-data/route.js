import { fetchSitePage } from "@/lib/data-fetcher";
import { WEBSITE_ID } from "@/lib/catalog-utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageType = searchParams.get("pageType") || "home";
  const district = searchParams.get("district");

  try {
    const data = district ? await (await import("@/lib/data-fetcher")).fetchDistrictData(district) : await fetchSitePage(pageType, WEBSITE_ID);
    return Response.json({ success: true, websiteId: WEBSITE_ID, pageType, data }, { headers });
  } catch (error) {
    console.error("site-data GET failed:", error);
    return Response.json(
      { success: false, error: error.message, data: null },
      { status: 500, headers }
    );
  }
}
