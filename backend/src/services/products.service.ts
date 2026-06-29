import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 300;

export async function getProducts(filters?: any) {
  const cacheKey = CacheKeys.products(filters || {});
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  let query = supabase.from("products").select("*, companies!inner(name, slug, logo_url)", { count: "exact" });
  if (filters?.category) query = query.eq("category", filters.category);

  const sortField = filters?.sort === "newest" ? "launch_date" : "upvotes";
  query = query.order(sortField, { ascending: filters?.sort === "newest" });

  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 100);
  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  const result = { data: data || [], meta: { total: count || 0, page, limit }, error: null };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, companies!inner(name, slug, logo_url, description)")
    .eq("slug", slug)
    .single();

  if (error) { if (error.code === "PGRST116") throw new Error("NOT_FOUND"); throw error; }

  return { data, meta: {}, error: null };
}
