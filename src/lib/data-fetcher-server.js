import {
  fetchFullCatalog as fetchFullCatalogRaw,
  fetchCategoriesTree as fetchCategoriesTreeRaw,
  fetchHomeData,
  fetchContactData,
  fetchServicesData,
  fetchDistrictData,
  fetchDistricts,
  fetchSitePage,
} from "./data-fetcher";

export const dynamic = "force-dynamic";

export async function fetchFullCatalog(options = {}) {
  return fetchFullCatalogRaw(options);
}
export async function fetchCategoriesTree(options = {}) {
  return fetchCategoriesTreeRaw(options);
}
export { fetchHomeData, fetchContactData, fetchServicesData, fetchDistrictData, fetchDistricts, fetchSitePage };
