import { fetchFullCatalog, fetchCategoriesTree, fetchContactData } from "@/lib/data-fetcher-server";
import { WEBSITE_ID, COMPANY_ID } from "@/lib/catalog-utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const BASE_URL = "https://aozallo.com";

function contactValue(contactInfo, labels = []) {
  const normalized = labels.map((x) => x.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const list = Array.isArray(contactInfo) ? contactInfo : Object.entries(contactInfo || {}).map(([label, value]) => ({ label, value }));
  return list.find((item) => normalized.includes(String(item?.label || "").toLowerCase().replace(/[^a-z0-9]/g, "")))?.value || "";
}

export async function GET() {
  try {
    const [products, categories, contact] = await Promise.all([
      fetchFullCatalog({ websiteId: WEBSITE_ID }),
      fetchCategoriesTree({ websiteId: WEBSITE_ID }),
      fetchContactData(),
    ]);

    const info = contact?.contactInfo || [];
    const phone = contactValue(info, ["Phone", "Phone Number", "Mobile", "Mobile Number", "Contact"]);
    const email = contactValue(info, ["Email", "Email Address", "Mail"]);
    const address = contactValue(info, ["Address", "Office Address"]);

    let text = `# Biomedical Equipment Catalogue
- Website: ${BASE_URL}
- Company ID: ${COMPANY_ID}
- Website ID: ${WEBSITE_ID}
- Total Visible Products: ${products.length}
- Total Visible Categories: ${categories.length}

## Product Categories
`;

    categories.forEach((cat) => {
      const name = cat.name || cat.category || cat.id || "";
      if (!name) return;
      text += `\n### ${name}\n`;
      if (cat.description) text += `${cat.description}\n`;
      (cat.subcategories || []).forEach((sub) => {
        const subName = sub.name || sub.subCategory || sub.id || "";
        if (subName) text += `- ${subName} (${sub.productsCount || 0} products)\n`;
      });
    });

    text += `\n## Products\n`;
    products.forEach((product, index) => {
      const title = product.title || product.name || "";
      if (!title) return;
      text += `\n### ${index + 1}. ${title}\n`;
      text += `- URL: ${BASE_URL}/items/${product.slug || ""}\n`;
      if (product.category) text += `- Category: ${product.category}\n`;
      if (product.subCategory) text += `- Subcategory: ${product.subCategory}\n`;
      if (product.brand) text += `- Brand: ${product.brand}\n`;
      if (product.model) text += `- Model: ${product.model}\n`;
      if (product.description) text += `- Description: ${String(product.description).slice(0, 300)}\n`;
    });

    text += `\n## Contact\n`;
    if (phone) text += `- Phone: ${phone}\n`;
    if (email) text += `- Email: ${email}\n`;
    if (address) text += `- Address: ${address}\n`;

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("llms.txt generation failed:", error);
    return new Response("# Catalogue\nUnable to generate the live catalogue.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}
