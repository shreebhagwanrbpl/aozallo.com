import { WEBSITE_ID } from "./catalog-utils";
export const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  process.env.SQLITE_ADMIN_API_URL ||
  "https://admin.rajbiosis.app";

function buildUrl(pathname, params = {}) {
  const base = ADMIN_API_BASE_URL.replace(/\/+$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = new URL(`${base}${path}`);
  Object.entries({ websiteId: WEBSITE_ID, ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  return url;
}

export async function adminFetch(pathname, options = {}, params = {}) {
  const response = await fetch(buildUrl(pathname, params), {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!response.ok) {
    throw new Error(`Admin API ${response.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body;
}

export async function postAdminQuery(endpoint, payload) {
  return adminFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ websiteId: WEBSITE_ID, ...payload }),
  });
}

export async function fetchAdminSiteData(pageType) {
  return adminFetch("/api/site-data", {}, { pageType });
}
