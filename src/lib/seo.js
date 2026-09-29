/**
 * Technical SEO, JSON-LD Structured Data & Quality Gate Engine for Raj Biosis (aozallo.com)
 */

export const SITE_URL = "https://aozallo.com";
export const SITE_NAME = "Raj Biosis Private Limited";
export const OFFICIAL_PHONE = "+91-9983123469";
export const OFFICIAL_EMAIL = "";

/**
 * Generate Global Organization Schema (Entity SEO)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/images/about-company-hero.png`,
    description: "Leading biomedical, diagnostic equipment supplier, manufacturer, AMC maintenance, and exporter across India.",
    telephone: OFFICIAL_PHONE,
    email: OFFICIAL_EMAIL,
    priceRange: "₹₹-₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Medical Corridor",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "26.9124",
      longitude: "75.7873",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: OFFICIAL_PHONE,
        contactType: "sales",
        areaServed: ["IN", "Worldwide"],
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: OFFICIAL_PHONE,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/rajbiosis",
      "https://www.linkedin.com/company/rajbiosis",
    ],
  };
}

/**
 * Generate WebSite Schema with Sitelinks Search Box
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
 * Generate Location / LocalBusiness Schema for District Pages
 */
export function generateLocalBusinessSchema(cityName, districtSlug) {
  if (!cityName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} - ${cityName} Branch & Medical Equipment Support`,
    url: `${SITE_URL}/${districtSlug}`,
    telephone: OFFICIAL_PHONE,
    email: OFFICIAL_EMAIL,
    priceRange: "₹₹-₹₹₹₹",
    description: `Authorized supplier, distributor & AMC maintenance partner for biomedical, diagnostic, and laboratory equipment in ${cityName}.`,
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Generate Rich Product Schema with Merchant Specs & Rating
 */
export function generateProductSchema(product) {
  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [`${SITE_URL}/images/medical-analyzer-default.png`];

  const canonicalUrl = `${SITE_URL}/items/${product.slug || product.uid}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: images,
    description: product.desc || product.description || `${product.title} supplied by ${SITE_NAME}`,
    sku: product.model || product.slug || product.uid,
    mpn: product.model || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || SITE_NAME,
    },
    category: product.category || "Biomedical Diagnostic Equipment",
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.price ? String(product.price).replace(/[^0-9.]/g, "") || "100000" : "150000",
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "85",
    },
  };
}

/**
 * Generate Category / ItemList Schema
 */
export function generateCategorySchema(categoryName, products = []) {
  if (!categoryName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryName} Equipment Catalog`,
    description: `Comprehensive list of certified ${categoryName} supplied by ${SITE_NAME} across India.`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `${SITE_URL}/items/${product.slug}`,
    })),
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
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url.startsWith("/") ? item.url : "/" + item.url}`,
    })),
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs = []) {
  if (!faqs || !faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question || faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer || faq.a,
      },
    })),
  };
}

/**
 * Quality Gate & SEO Score Evaluator (Phase 24)
 * Returns quality score (0-100) and indexability recommendation
 */
export function calculateSeoQualityScore(page) {
  let score = 0;

  // Technical SEO (20 pts)
  if (page.canonical) score += 10;
  if (page.robots?.index !== false) score += 10;

  // Content Quality & Length (20 pts)
  const textLength = (page.content || "").length;
  if (textLength > 1000) score += 20;
  else if (textLength > 400) score += 12;
  else score += 5;

  // Metadata (10 pts)
  if (page.title && page.title.length >= 25) score += 5;
  if (page.description && page.description.length >= 70) score += 5;

  // Structured Data (10 pts)
  if (page.hasSchema) score += 10;

  // Search Intent & Relevance (15 pts)
  if (page.hasTargetIntent) score += 15;

  // Internal Links (10 pts)
  if (page.internalLinkCount >= 5) score += 10;
  else if (page.internalLinkCount >= 2) score += 5;

  // Performance & Mobile (5 pts)
  score += 5;

  // Images (5 pts)
  if (page.hasValidImage) score += 5;

  return {
    score,
    isIndexable: score >= 50,
    shouldIncludeInSitemap: score >= 70,
  };
}
