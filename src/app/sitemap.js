import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap() {
  const baseUrl = SITE_URL;
  const urls = [];
  const now = new Date();

  // 1. Core Static Authority Pages
  const corePages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "daily" },
    { url: `${baseUrl}/items`, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/services`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: "monthly" },
  ];

  corePages.forEach((page) => {
    urls.push({
      url: page.url,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  });

  try {
    // 2. Fetch Catalog Products & Categories
    const products = await fetchFullCatalog();
    const seenProductSlugs = new Set();
    const categoriesSet = new Set();

    products.forEach((product) => {
      // Products
      if (product.slug && !seenProductSlugs.has(product.slug)) {
        seenProductSlugs.add(product.slug);
        urls.push({
          url: `${baseUrl}/items/${product.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.9,
        });
      }

      // Categories
      if (product.category) {
        const catSlug = product.category
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
        if (catSlug && !categoriesSet.has(catSlug)) {
          categoriesSet.add(catSlug);
          urls.push({
            url: `${baseUrl}/category/${catSlug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    });

    // 3. Serviceable Location / District Pages
    const districtSnap = await getDocs(
      collection(db, "websites", "aozallocom", "districts")
    );

    districtSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const slug = data.slug || docSnap.id;
      if (!slug) return;

      urls.push({
        url: `${baseUrl}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
  }

  return urls;
}