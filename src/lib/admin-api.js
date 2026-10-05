import { WEBSITE_ID, COMPANY_ID } from "./catalog-utils";

export const ADMIN_API_BASE_URL = (
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  "https://admin.rajbiosis.app"
).replace(/\/+$/, "");

function buildUrl(pathname, params = {}) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = new URL(`${ADMIN_API_BASE_URL}${path}`);
  Object.entries({ websiteId: WEBSITE_ID, companyId: COMPANY_ID, ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
}

export async function adminFetch(pathname, options = {}, params = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(buildUrl(pathname, params), {
      ...options,
      cache: "no-store",
      signal: options.signal || controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    if (!response.ok || body?.success === false || body?.ok === false) {
      throw new Error(
        `Admin API ${response.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`
      );
    }

    return body;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function postAdminQuery(endpoint, payload) {
  return adminFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ websiteId: WEBSITE_ID, companyId: COMPANY_ID, ...payload }),
  });
}

export async function fetchAdminSiteData(pageType, district = "") {
  return adminFetch("/api/site-data", {}, { type: pageType, pageType, district });
}

export async function fetchCatalogFromAdmin() {
  const json = await adminFetch("/api/catalog");
  return Array.isArray(json?.products)
    ? json.products
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];
}
