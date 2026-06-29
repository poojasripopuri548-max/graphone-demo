import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 180;

export async function search(query: string, type: string = "all", limit: number = 10) {
  const cacheKey = CacheKeys.search(`${query}:${type}:${limit}`);
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const searchTerm = `%${query}%`;
  const results: any = {
    companies: [],
    investors: [],
    founders: [],
    products: [],
  };

  if (type === "all" || type === "companies") {
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, slug, description, category, logo_url, growth_score")
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order("growth_score", { ascending: false })
      .limit(limit);
    results.companies = companies || [];
  }

  if (type === "all" || type === "investors") {
    const { data: investors } = await supabase
      .from("investors")
      .select("id, name, slug, type, bio, logo_url, portfolio_count")
      .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
      .order("portfolio_count", { ascending: false })
      .limit(limit);
    results.investors = investors || [];
  }

  if (type === "all" || type === "founders") {
    const { data: founders } = await supabase
      .from("founders")
      .select("id, name, slug, title, company_id, photo_url")
      .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
      .limit(limit);
    results.founders = founders || [];
  }

  if (type === "all" || type === "products") {
    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, description, category, logo_url, upvotes")
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order("upvotes", { ascending: false })
      .limit(limit);
    results.products = products || [];
  }

  const result = { data: results, meta: {}, error: null };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}
