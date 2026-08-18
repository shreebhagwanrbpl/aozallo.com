import ProductCard from "@/components/ProductCard";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import {
  generateCategorySchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SITE_URL,
} from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Microscope, Award } from "lucide-react";

export async function generateMetadata({ params }) {
  const { "category-slug": categorySlug } = await params;
  const categoryName = categorySlug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${categoryName} Equipment Supplier & Prices in India | Raj Biosis`;
  const description = `Browse high precision ${categoryName} supplied by Raj Biosis. Trusted manufacturer, dealer & AMC partner for clinical laboratories, ICUs, and hospitals across India.`;
  const canonicalUrl = `${SITE_URL}/category/${categorySlug}`;

  return {
    title,
    description,
    keywords: [
      `${categoryName} Supplier`,
      `${categoryName} Equipment`,
      `${categoryName} Price in India`,
      `${categoryName} Dealer`,
      `Biomedical ${categoryName}`,
      "Pathology Equipment Supplier",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Raj Biosis",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function CategoryPage({ params }) {
  const { "category-slug": categorySlug } = await params;
  const categoryName = categorySlug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const allProducts = await fetchFullCatalog();
  const categoryProducts = allProducts.filter((p) => {
    const pCatSlug = p.category
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return pCatSlug === categorySlug || p.category?.toLowerCase() === categoryName.toLowerCase();
  });

  const displayProducts = categoryProducts.length > 0 ? categoryProducts : allProducts.slice(0, 6);

  const categorySchema = generateCategorySchema(categoryName, displayProducts);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Catalog", url: "/items" },
    { name: categoryName, url: `/category/${categorySlug}` },
  ]);

  const categoryFaqs = [
    {
      question: `What are the key applications of ${categoryName}?`,
      answer: `${categoryName} is designed for medical diagnostic laboratories, hospital ICUs, pathology centers, and clinical research units requiring high precision and compliance.`,
    },
    {
      question: `Does Raj Biosis provide installation and AMC service for ${categoryName}?`,
      answer: `Yes! Every ${categoryName} purchase includes pan-India installation, engineer training, and options for Annual Maintenance Contracts (AMC/CMC).`,
    },
  ];
  const faqSchema = generateFAQSchema(categoryFaqs);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
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

      {/* Banner */}
      <PageBanner
        title={`${categoryName} Equipment`}
        subtitle={`Certified high-throughput ${categoryName} engineered for pathology laboratories, ICUs, and healthcare institutions across India.`}
      />

      <div className="container-custom mt-12">
        {/* Category Overview & Buying Guide Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Topical Category Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            About {categoryName} Machinery & Diagnostics
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
            {categoryName} plays a critical role in modern clinical decision-making. At Raj Biosis, we supply certified, ISO-compliant {categoryName} hardware equipped with advanced sensor technology, high throughput operational reliability, and comprehensive post-sale AMC technical service.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <span>100% Genuine OEM Hardware</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Microscope size={16} />
              </div>
              <span>NABL Traceable Calibration</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Award size={16} />
              </div>
              <span>Pan-India On-Site Engineer Support</span>
            </div>
          </div>
        </div>

        {/* Product List Grid */}
        <SectionTitle
          badge="Category Catalog"
          title={`Available ${categoryName} Products`}
          description={`Explore our top-rated ${categoryName} models with itemized specification brochures and custom quote requests.`}
        />

        <div className="mt-8 space-y-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.uid || product.slug} product={product} />
          ))}
        </div>

        {/* Internal Link Navigation */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Need Custom Quotation or Installation in Your City?</h3>
            <p className="text-xs text-slate-300 mt-1">Our biomedical engineers issue itemized quotations within 2 to 4 business hours.</p>
          </div>
          <Link href="/contact">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition text-xs sm:text-sm flex items-center gap-2">
              Request Category Quote
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
