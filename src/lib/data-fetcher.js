import {
  COMPANY_ID,
  WEBSITE_ID,
  makeSlug,
  isItemVisibleOnWebsite,
} from "./catalog-utils";
import {
  readDocument,
  readDocumentsWhereCollection,
} from "./sqliteDb";
export { makeSlug };

function normalizeProduct(p = {}, catId = "", catName = "", subId = "", subName = "", fallbackIdx = 0) {
  const title = p.title || p.name || "";
  const images = Array.isArray(p.images) && p.images.length
    ? p.images
    : (p.image ? [p.image] : (p.originalImages || []));

  return {
    ...p,
    id: p.id || p.productId || `${catId}-${subId}-${fallbackIdx}`,
    productId: p.productId || p.id || `${catId}-${subId}-${fallbackIdx}`,
    uid: p.uid || p.id || p.productId || `${catId}-${subId}-${fallbackIdx}`,
    title,
    name: title,
    slug: p.slug || makeSlug(title),
    price: p.price ?? "",
    desc: p.desc ?? p.description ?? "",
    description: p.description ?? p.desc ?? "",
    category: catName || p.category || catId,
    categoryId: p.categoryId || catId || "",
    subCategory: subName || p.subCategory || subId,
    subcategoryId: p.subcategoryId || subId || "",
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

function categoryPath(categoryId) {
  return `companies/${COMPANY_ID}/categories/${categoryId}`;
}

function subcategoryPath(categoryId) {
  return `${categoryPath(categoryId)}/subcategories`;
}

export async function fetchFullCatalog({ companyId = COMPANY_ID, websiteId = WEBSITE_ID } = {}) {
  const allProducts = [];
  const categories = readDocumentsWhereCollection(`companies/${companyId}/categories`);

  const visibleCategoryIds = new Set();
  const visibleCategoryNames = new Set();
  const visibleSubcategoryIds = new Set();
  const visibleSubcategoryNames = new Set();

  for (const row of categories) {
    const cat = { id: row.doc_id, ...row.data };
    if (!isItemVisibleOnWebsite(cat, websiteId)) continue;

    visibleCategoryIds.add(cat.id);
    const categoryName = cat.name || cat.category || cat.id;
    visibleCategoryNames.add(String(categoryName).toLowerCase().replace(/[^a-z0-9]/g, ""));

    // Products embedded in category document.
    if (Array.isArray(cat.products)) {
      cat.products.forEach((product, idx) => {
        if (isItemVisibleOnWebsite(product, websiteId)) {
          allProducts.push(normalizeProduct(
            product, cat.id, categoryName, product.subcategoryId || "", product.subCategory || "", `cat-${idx}`
          ));
        }
      });
    }

    const subs = readDocumentsWhereCollection(subcategoryPath(cat.id));
    for (const subRow of subs) {
      const sub = { id: subRow.doc_id, ...subRow.data };
      if (!isItemVisibleOnWebsite(sub, websiteId)) continue;

      visibleSubcategoryIds.add(`${cat.id}/${sub.id}`);
      const subName = sub.name || sub.subCategory || sub.id;
      visibleSubcategoryNames.add(String(subName).toLowerCase().replace(/[^a-z0-9]/g, ""));

      if (Array.isArray(sub.products)) {
        sub.products.forEach((product, idx) => {
          if (isItemVisibleOnWebsite(product, websiteId)) {
            allProducts.push(normalizeProduct(
              product, cat.id, categoryName, sub.id, subName, `embedded-${idx}`
            ));
          }
        });
      }

      const subProducts = readDocumentsWhereCollection(
        `${categoryPath(cat.id)}/subcategories/${sub.id}/products`
      );
      subProducts.forEach((productRow, idx) => {
        const product = { id: productRow.doc_id, ...productRow.data };
        if (isItemVisibleOnWebsite(product, websiteId)) {
          allProducts.push(normalizeProduct(
            product, cat.id, categoryName, sub.id, subName, `sqlite-${idx}`
          ));
        }
      });
    }
  }

  // Master / standalone products. Category and subcategory hierarchy is also verified.
  const masterProducts = readDocumentsWhereCollection(`companies/${companyId}/products`);
  masterProducts.forEach((row, idx) => {
    const product = { id: row.doc_id, ...row.data };
    if (!isItemVisibleOnWebsite(product, websiteId)) return;

    const categoryId = product.categoryId || product.categoryID || "";
    const subcategoryId = product.subcategoryId || product.subCategoryId || "";

    if (categoryId && !visibleCategoryIds.has(categoryId)) return;
    if (!categoryId && product.category && visibleCategoryNames.size) {
      const categoryKey = String(product.category).toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!visibleCategoryNames.has(categoryKey)) return;
    }
    if (subcategoryId && categoryId && !visibleSubcategoryIds.has(`${categoryId}/${subcategoryId}`)) return;
    if (!subcategoryId && product.subCategory && visibleSubcategoryNames.size) {
      const subKey = String(product.subCategory).toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!visibleSubcategoryNames.has(subKey)) return;
    }

    allProducts.push(normalizeProduct(
      product,
      categoryId || "master",
      product.category || "General Products",
      subcategoryId || "general",
      product.subCategory || "General Products",
      `master-${idx}`
    ));
  });

  // De-duplicate products while preserving first occurrence.
  const unique = [];
  const seen = new Set();
  for (const product of allProducts) {
    const key = product.id || product.productId || product.slug;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(product);
  }
  return unique;
}

export async function fetchCategoriesTree({ companyId = COMPANY_ID, websiteId = WEBSITE_ID } = {}) {
  const categories = readDocumentsWhereCollection(`companies/${companyId}/categories`);
  const result = [];

  for (const row of categories) {
    const category = { id: row.doc_id, ...row.data };
    if (!isItemVisibleOnWebsite(category, websiteId)) continue;

    const subcategories = [];
    const subs = readDocumentsWhereCollection(subcategoryPath(category.id));

    for (const subRow of subs) {
      const sub = { id: subRow.doc_id, ...subRow.data };
      if (!isItemVisibleOnWebsite(sub, websiteId)) continue;

      const embedded = Array.isArray(sub.products)
        ? sub.products.filter((p) => isItemVisibleOnWebsite(p, websiteId))
        : [];

      const childProducts = readDocumentsWhereCollection(
        `${categoryPath(category.id)}/subcategories/${sub.id}/products`
      ).map((p) => ({ id: p.doc_id, ...p.data }))
       .filter((p) => isItemVisibleOnWebsite(p, websiteId));

      subcategories.push({
        ...sub,
        products: [...embedded, ...childProducts],
        productsCount: embedded.length + childProducts.length,
      });
    }

    result.push({
      ...category,
      subcategories,
      totalProductsCount: subcategories.reduce((sum, s) => sum + (s.productsCount || 0), 0),
    });
  }

  return result;
}

export async function fetchSitePage(pageType, websiteId = WEBSITE_ID) {
  return readDocument(`websites/${COMPANY_ID}/${websiteId}/pages/${pageType}`)?.data || null;
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
  return readDocument(`websites/${COMPANY_ID}/${WEBSITE_ID}/districts/${district}`)?.data || null;
}

export async function fetchDistricts({ companyId = COMPANY_ID, websiteId = WEBSITE_ID } = {}) {
  const rows = readDocumentsWhereCollection(`websites/${companyId}/${websiteId}/districts`);
  return rows.map((r) => ({ id: r.doc_id, ...r.data }));
}
