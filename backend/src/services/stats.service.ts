import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 600;

export async function getStats() {
  const cacheKey = CacheKeys.stats();
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const [companiesResult, investorsResult, fundingResult, newsResult] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("investors").select("id", { count: "exact", head: true }),
    supabase.from("companies").select("funding_total").not("funding_total", "is", null),
    supabase.from("news_articles").select("id", { count: "exact", head: true }),
  ]);

  const totalFunding = fundingResult.data?.reduce((sum, c) => sum + (c.funding_total || 0), 0) || 0;
  const unicornCount = (await supabase.from("companies").select("id", { count: "exact", head: true }).eq("is_unicorn", true)).count || 0;

  const stats = {
    total_companies: companiesResult.count || 0,
    total_investors: investorsResult.count || 0,
    total_funding: totalFunding,
    unicorn_count: unicornCount,
    total_news: newsResult.count || 0,
  };

  const result = { data: stats, meta: {}, error: null };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}
