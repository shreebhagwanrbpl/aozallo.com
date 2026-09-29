/**
 * Single source of truth for this website's catalog identity.
 * Change WEBSITE_ID only in this file when cloning this migration to another site.
 */
export const WEBSITE_ID = "aozallocom";
export const COMPANY_ID = process.env.NEXT_PUBLIC_COMPANY_ID || process.env.COMPANY_ID || "rajbiosis";

export function normalizeDomainId(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[.\-\s]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function isExactWebsiteMatch(itemWebsiteId, targetWebsiteId = WEBSITE_ID) {
  const a = normalizeDomainId(itemWebsiteId);
  const b = normalizeDomainId(targetWebsiteId);
  return a === b;
}

export function isItemVisibleOnWebsite(item, targetWebsiteId = WEBSITE_ID) {
  if (!item || typeof item !== "object") return false;

  if (item.isPublished === false) return false;
  if (["inactive", "draft"].includes(String(item.status || "").toLowerCase())) return false;

  if (Array.isArray(item.websiteIds)) {
    if (item.websiteIds.length === 0) return false;
    if (item.websiteIds.some((id) => normalizeDomainId(id) === "all")) return true;
    return item.websiteIds.some((id) => isExactWebsiteMatch(id, targetWebsiteId));
  }

  // Legacy records without websiteIds remain visible unless explicitly hidden.
  return true;
}

export const isItemVisibleForWebsite = isItemVisibleOnWebsite;
export const normalizeId = normalizeDomainId;

export function makeSlug(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
