import { fetchFullCatalog, fetchCategoriesTree } from "@/lib/data-fetcher";
import { COMPANY_ID, WEBSITE_ID } from "@/lib/catalog-utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get("websiteId") || WEBSITE_ID;

  try {
    const [products, categories] = await Promise.all([
      fetchFullCatalog({ companyId: COMPANY_ID, websiteId }),
      fetchCategoriesTree({ companyId: COMPANY_ID, websiteId }),
    ]);

    return Response.json(
      { success: true, companyId: COMPANY_ID, websiteId, products, categories },
      { headers }
    );
  } catch (error) {
    console.error("catalog GET failed:", error);
    return Response.json(
      { success: false, products: [], categories: [], error: error.message },
      { status: 500, headers }
    );
  }
}
