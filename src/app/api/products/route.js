import { fetchFullCatalog } from "@/lib/data-fetcher";
import { WEBSITE_ID } from "@/lib/catalog-utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const products = await fetchFullCatalog({ websiteId: WEBSITE_ID });
    return Response.json(
      { success: true, websiteId: WEBSITE_ID, products },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (error) {
    return Response.json(
      { success: false, products: [], error: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
