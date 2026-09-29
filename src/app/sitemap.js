import { SITE_URL } from "@/lib/seo";
import { fetchFullCatalog, fetchDistricts } from "@/lib/data-fetcher";
import { WEBSITE_ID } from "@/lib/catalog-utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://aozallo.com";

export default async function sitemap() {
  const [products, districts] = await Promise.all([
    fetchFullCatalog({ websiteId: WEBSITE_ID }),
    fetchDistricts({ websiteId: WEBSITE_ID }).catch(() => []),
  ]);

  const now = new Date();
  const urls = [
    { url: BASE_URL, lastModified: now },
    { url: `${BASE_URL}/about`, lastModified: now },
    { url: `${BASE_URL}/services`, lastModified: now },
    { url: `${BASE_URL}/contact`, lastModified: now },
    { url: `${BASE_URL}/items`, lastModified: now },
  ];

  const seen = new Set(urls.map((item) => item.url));
  for (const district of districts) {
    const slug = district.slug || district.id;
    if (!slug) continue;
    const base = `${BASE_URL}/${slug}`;
    for (const suffix of ["", "/about", "/services", "/contact", "/items"]) {
      const url = `${base}${suffix}`;
      if (!seen.has(url)) {
        seen.add(url);
        urls.push({ url, lastModified: now });
      }
    }
  }

  for (const product of products) {
    if (!product.slug) continue;
    const url = `${BASE_URL}/items/${product.slug}`;
    if (!seen.has(url)) {
      seen.add(url);
      urls.push({ url, lastModified: now });
    }
    for (const district of districts) {
      const districtSlug = district.slug || district.id;
      if (!districtSlug) continue;
      const districtUrl = `${BASE_URL}/${districtSlug}/items/${product.slug}`;
      if (!seen.has(districtUrl)) {
        seen.add(districtUrl);
        urls.push({ url: districtUrl, lastModified: now });
      }
    }
  }

  return urls;
}
