import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap() {
  const baseUrl = "https://aozallo.com";
  const urls = [];
  const now = new Date();

  // 1. Core Static Pages
  urls.push(
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/items`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    }
  );

  try {
    // 2. Dynamic Products
    const products = await fetchFullCatalog();
    const seenSlugs = new Set();

    products.forEach((product) => {
      if (!product.slug || seenSlugs.has(product.slug)) return;
      seenSlugs.add(product.slug);

      urls.push({
        url: `${baseUrl}/items/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });

    // 3. District Pages (Cleaned without product duplication)
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
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
  }

  return urls;
}