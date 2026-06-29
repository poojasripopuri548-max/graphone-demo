import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 300;

export async function getNews(filters?: any) {
  const cacheKey = CacheKeys.news(filters || {});
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  let query = supabase.from("news_articles").select("*", { count: "exact" });
  if (filters?.tag) query = query.eq("tag", filters.tag);

  query = query.order("published_at", { ascending: false });

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

export async function getTrendingNews() {
  const cacheKey = "news:trending";
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  // Get news from last 24 hours, sorted by relevance
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .gte("published_at", twentyFourHoursAgo)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) throw error;

  const result = { data: data || [], meta: {}, error: null };
  appCache.set(cacheKey, result, 60);
  return result;
}
