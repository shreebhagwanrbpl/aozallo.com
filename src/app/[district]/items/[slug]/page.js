import ProductDetails from "@/app/items/[slug]/ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug, district } = await params;
  const allProducts = await fetchFullCatalog();
  const product = allProducts.find((p) => p.slug === slug) || null;

  const city = district
    ? district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "India";

  const productName = product?.title || slug?.replace(/-/g, " ");

  // Canonical tag MUST point to the primary authoritative product URL to prevent duplicate content penalty
  const canonicalUrl = `${SITE_URL}/items/${slug}`;

  return {
    title: `${productName} Supplier & Price in ${city} | Raj Biosis`,
    description: `Buy ${productName} in ${city}. Official biomedical equipment supplier offering installation, warranty, and AMC service in ${city}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function LocationProductPage({ params }) {
  const { slug, district } = await params;

  return <ProductDetails slug={slug} district={district} />;
}