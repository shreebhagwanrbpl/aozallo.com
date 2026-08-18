import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SITE_URL,
} from "@/lib/seo";
import { getProductImage } from "@/lib/image-utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  const product = allProducts.find((p) => p.slug === slug) || null;

  const fallbackName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const productName = product?.title || fallbackName;
  const brandName = product?.brand ? ` by ${product.brand}` : "";
  const categoryName = product?.category ? ` - ${product.category}` : "";

  // Title Formula aligned with Phase 3 & 4 SEO specifications
  const title = `${productName}${brandName} | Biomedical Equipment Supplier in India`;

  const rawDescription = product?.desc || product?.description || "";
  const description = rawDescription
    ? `${rawDescription.slice(0, 140)}... Buy ${productName} at best price with installation & AMC warranty from Raj Biosis.`
    : `Buy ${productName}${categoryName} at best price from Raj Biosis. Authorized manufacturer, supplier & distributor of biomedical & laboratory equipment in India. Request an itemized quotation today.`;

  const url = `${SITE_URL}/items/${slug}`;
  const mainImage = getProductImage(product, "/images/medical-analyzer-default.png");
  const absoluteImageUrl = mainImage.startsWith("http") ? mainImage : `${SITE_URL}${mainImage.startsWith("/") ? mainImage : "/" + mainImage}`;

  return {
    title,
    description,
    keywords: [
      productName,
      `${productName} Supplier`,
      `${productName} Dealer`,
      `${productName} Distributor`,
      `${productName} Manufacturer`,
      `${productName} Price`,
      `${productName} Quotation`,
      `${productName} Specifications`,
      `Biomedical ${productName}`,
      "Biomedical Equipment Supplier India",
      "Laboratory Diagnostics Supplier",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Raj Biosis",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: absoluteImageUrl,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  const product = allProducts.find((p) => p.slug === slug) || null;

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Equipment Catalog", url: "/items" },
    { name: product?.title || slug, url: `/items/${slug}` },
  ]);

  const productFaqs = [
    {
      q: `What is ${product?.title || "this equipment"} used for?`,
      a: `${product?.title || "This equipment"} is an advanced biomedical diagnostic unit engineered for high precision performance in clinical laboratories and hospital settings.`,
    },
    {
      q: `How can I request a price quotation for ${product?.title || "this product"}?`,
      a: `Submit an online enquiry or call +91 9983123469 to receive an itemized official quotation including installation and warranty packages.`,
    },
  ];
  const faqSchema = generateFAQSchema(productFaqs);

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ProductDetails slug={slug} product={product} />
    </>
  );
}