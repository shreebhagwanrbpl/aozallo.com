import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  const product = allProducts.find((p) => p.slug === slug) || null;

  const fallbackName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const productName = product?.title || fallbackName;
  const categoryName = product?.category ? ` | ${product.category}` : "";
  const brandName = product?.brand ? ` (${product.brand})` : "";

  const title = `${productName}${brandName}${categoryName} Manufacturer & Exporter | Raj Biosis`;

  const rawDescription = product?.desc || product?.description || "";
  const description = rawDescription
    ? `${rawDescription.slice(0, 150)}... Buy ${productName} from Raj Biosis - trusted biomedical & laboratory equipment supplier in India.`
    : `Buy ${productName} at best price from Raj Biosis. Trusted manufacturer, supplier & exporter of ${productName} for hospitals, laboratories & diagnostic centers in India. Contact for quote.`;

  const url = `https://aozallo.com/items/${slug}`;
  const ogImages = product?.image
    ? [{ url: product.image, alt: productName }]
    : product?.images?.length
    ? product.images.map((img) => ({ url: img, alt: productName }))
    : [{ url: "/logo.png", alt: "Raj Biosis" }];

  return {
    title,
    description,

    keywords: [
      productName,
      `${productName} Supplier`,
      `${productName} Dealer`,
      `${productName} Distributor`,
      `${productName} Manufacturer`,
      `${productName} Exporter`,
      `${productName} Price in India`,
      `${productName} Specification`,
      `Biomedical ${productName}`,
      "Biomedical Equipment India",
      "Raj Biosis",
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
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
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

    metadataBase: new URL("https://aozallo.com"),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  const product = allProducts.find((p) => p.slug === slug) || null;

  return <ProductDetails slug={slug} product={product} />;
}