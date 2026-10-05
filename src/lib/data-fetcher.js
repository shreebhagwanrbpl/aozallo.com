import {
  COMPANY_ID,
  WEBSITE_ID,
  makeSlug,
  isItemVisibleOnWebsite,
} from "./catalog-utils";
import {
  adminFetch,
  fetchCatalogFromAdmin,
} from "./admin-api";

export { makeSlug };

function normalizeProduct(p = {}, fallbackIdx = 0) {
  const title = p.title || p.name || "Biomedical Equipment";
  const images = Array.isArray(p.images) && p.images.length
    ? p.images
    : (p.image ? [p.image] : (p.imageUrl ? [p.imageUrl] : (p.imgUrl ? [p.imgUrl] : [])));

  return {
    ...p,
    id: p.id || p.uid || p.productId || `${makeSlug(title)}-${fallbackIdx}`,
    productId: p.productId || p.id || p.uid || `${makeSlug(title)}-${fallbackIdx}`,
    uid: p.uid || p.id || p.productId || `${makeSlug(title)}-${fallbackIdx}`,
    title,
    name: title,
    slug: p.slug || makeSlug(title),
    price: p.price ?? "",
    desc: p.desc ?? p.description ?? "",
    description: p.description ?? p.desc ?? "",
    category: p.category || "Diagnostic & Laboratory Equipment",
    categoryId: p.categoryId || makeSlug(p.category || "diagnostic"),
    subCategory: p.subCategory || p.subcategory || p.category || "General",
    subcategoryId: p.subcategoryId || p.subCategoryId || makeSlug(p.subCategory || p.subcategory || "general"),
    companyId: p.companyId || COMPANY_ID,
    images,
    image: images[0] || p.image || "",
    video: p.video || "",
    pdf: p.pdf || "",
    brand: p.brand || "",
    model: p.model || "",
    capacity: p.capacity || "",
    throughput: p.throughput || "",
    instrument: p.instrument || "",
    usage: p.usage || "",
    parameters: p.parameters || "",
    automation: p.automation || "",
    availability: p.availability || "",
    size: p.size || "",
    isPublished: p.isPublished !== false,
    websiteIds: Array.isArray(p.websiteIds) ? p.websiteIds : p.websiteIds,
  };
}

export async function fetchFullCatalog({ websiteId = WEBSITE_ID } = {}) {
  try {
    const raw = await fetchCatalogFromAdmin();
    if (!Array.isArray(raw)) return [];

    return raw
      .filter((item) => isItemVisibleOnWebsite(item, websiteId))
      .map((item, idx) => normalizeProduct(item, idx));
  } catch (error) {
    console.error("Admin MongoDB catalog fetch failed:", error);
    return [];
  }
}

export async function fetchCategoriesTree({ websiteId = WEBSITE_ID, catalog = null } = {}) {
  const products = catalog || (await fetchFullCatalog({ websiteId }));
  const map = new Map();

  for (const product of products) {
    const catId = product.categoryId || makeSlug(product.category || "general");
    const catName = product.category || catId;

    if (!map.has(catId)) {
      map.set(catId, {
        id: catId,
        name: catName,
        category: catName,
        slug: makeSlug(catName),
        products: [],
        subcategories: new Map(),
      });
    }

    const cat = map.get(catId);
    cat.products.push(product);

    const subId = product.subcategoryId || makeSlug(product.subCategory || "general");
    const subName = product.subCategory || subId;

    if (!cat.subcategories.has(subId)) {
      cat.subcategories.set(subId, {
        id: subId,
        name: subName,
        subCategory: subName,
        slug: makeSlug(subName),
        products: [],
        productsCount: 0,
      });
    }

    const sub = cat.subcategories.get(subId);
    sub.products.push(product);
    sub.productsCount += 1;
  }

  return Array.from(map.values()).map((cat) => ({
    ...cat,
    subcategories: Array.from(cat.subcategories.values()),
    totalProductsCount: cat.products.length,
  }));
}

export async function fetchSitePage(pageType, websiteId = WEBSITE_ID) {
  try {
    const json = await adminFetch("/api/site-data", {}, {
      type: pageType,
      pageType,
      websiteId,
      companyId: COMPANY_ID,
    });
    return json?.data ?? json?.pages ?? null;
  } catch (error) {
    console.error(`Admin MongoDB ${pageType} fetch failed:`, error);
    return null;
  }
}

export async function fetchHomeData() {
  return fetchSitePage("home");
}

export async function fetchContactData() {
  return fetchSitePage("contact");
}

export async function fetchServicesData() {
  return fetchSitePage("services");
}

export async function fetchDistrictData(district) {
  if (!district) return null;

  try {
    const json = await adminFetch("/api/site-data", {}, {
      type: "district",
      pageType: "district",
      district,
      websiteId: WEBSITE_ID,
      companyId: COMPANY_ID,
    });
    return json?.data ?? json?.pages ?? null;
  } catch (error) {
    console.error("Admin MongoDB district fetch failed:", error);
    return null;
  }
}

export async function fetchDistricts({ websiteId = WEBSITE_ID } = {}) {
  try {
    const json = await adminFetch("/api/site-data", {}, {
      type: "districts",
      pageType: "districts",
      websiteId,
      companyId: COMPANY_ID,
    });
    const data = json?.data ?? json?.districts ?? json;

    if (!Array.isArray(data)) return [];

    return data.map((d, idx) => ({
      id: d.id || d.slug || `dist-${idx}`,
      ...d,
      slug: d.slug || d.id || makeSlug(d.district || d.name || `dist-${idx}`),
    }));
  } catch (error) {
    console.error("Admin MongoDB districts fetch failed:", error);
    return [];
  }
}
