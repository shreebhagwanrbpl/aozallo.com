/**
 * Structured Data (JSON-LD) and Metadata helpers for Raj Biosis (aozallo.com)
 */

export const SITE_URL = "https://aozallo.com";
export const SITE_NAME = "Raj Biosis";

/**
 * Generate Global Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "Leading biomedical and diagnostic equipment supplier, manufacturer, and distributor in India.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9983123469",
      contactType: "sales & technical support",
      areaServed: ["IN", "Worldwide"],
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.facebook.com/rajbiosis",
      "https://www.linkedin.com/company/rajbiosis",
    ],
  };
}

/**
 * Generate Global WebSite Schema with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/items?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Product Schema
 */
export function generateProductSchema(product) {
  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: images,
    description: product.desc || product.description || `${product.title} supplied by ${SITE_NAME}`,
    sku: product.model || product.slug || product.uid,
    brand: {
      "@type": "Brand",
      name: product.brand || SITE_NAME,
    },
    category: product.category || "Biomedical Equipment",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/items/${product.slug}`,
      priceCurrency: "INR",
      price: product.price || "Contact for Price",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
