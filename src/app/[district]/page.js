import Home from "@/app/page";
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const slug = district || "jaipur";
  const city = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const canonicalUrl = `${SITE_URL}/${slug}`;

  return {
    title: `Biomedical Equipment & Diagnostic Solutions in ${city} | Raj Biosis`,
    description: `Authorized supplier, dealer & maintenance partner of laboratory equipment, CBC hematology analyzers, ICU monitors & diagnostic machinery in ${city}. Fast delivery & AMC support.`,
    keywords: [
      `Biomedical Equipment Supplier in ${city}`,
      `Laboratory Equipment ${city}`,
      `Diagnostic Machines ${city}`,
      `Pathology Equipment Supplier ${city}`,
      `ICU Monitor Price in ${city}`,
      `Biomedical AMC Maintenance ${city}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Biomedical Equipment Supplier in ${city} | Raj Biosis`,
      description: `Leading diagnostic & laboratory equipment supplier in ${city}. Certified devices, AMC maintenance & express installation.`,
      url: canonicalUrl,
      type: "website",
      siteName: "Raj Biosis",
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

export default async function DistrictPage({ params }) {
  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const localSchema = generateLocalBusinessSchema(city, district);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: `Biomedical Equipment in ${city}`, url: `/${district}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Home city={city} district={district} />
    </>
  );
}