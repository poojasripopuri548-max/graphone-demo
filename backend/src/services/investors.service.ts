import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 300;

export async function getInvestors(filters?: any) {
  const cacheKey = CacheKeys.investors(filters || {});
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  let query = supabase.from("investors").select("*", { count: "exact" });
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.stage_focus) query = query.contains("stage_focus", [filters.stage_focus]);
  if (filters?.sector) query = query.contains("sector_focus", [filters.sector]);

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

export async function getInvestorBySlug(slug: string) {
  const cacheKey = CacheKeys.investor(slug);
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase.from("investors").select("*").eq("slug", slug).single();
  if (error) { if (error.code === "PGRST116") throw new Error("NOT_FOUND"); throw error; }

  const result = { data, meta: {}, error: null };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}

export async function getMostActiveInvestors() {
  const cacheKey = "investors:most-active";
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  // Get investors sorted by portfolio_count as a proxy for activity
  const { data, error } = await supabase
    .from("investors")
    .select("*")
    .order("portfolio_count", { ascending: false })
    .limit(20);
  
  if (error) throw error;

  const result = { data: data || [], meta: {}, error: null };
  appCache.set(cacheKey, result, 60);
  return result;
}

export async function getInvestorInvestments(slug: string, filters?: any) {
  const { data: investor } = await supabase.from("investors").select("id").eq("slug", slug).single();
  if (!investor) throw new Error("NOT_FOUND");

  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 100);
  const from = (page - 1) * limit;

  // Get funding rounds where this investor is lead or co-investor
  const { data: leadRounds } = await supabase
    .from("funding_rounds")
    .select("*, companies!inner(id, name, slug, logo_url, category)")
    .eq("lead_investor_id", investor.id)
    .order("date", { ascending: false })
    .range(from, from + limit - 1);

  const { data: coRounds } = await supabase
    .from("funding_rounds")
    .select("*, companies!inner(id, name, slug, logo_url, category)")
    .contains("co_investors", [investor.id])
    .order("date", { ascending: false });

  // Combine and deduplicate
  const allRounds = [...(leadRounds || []), ...(coRounds || [])];
  const uniqueRounds = allRounds.filter((round, index, self) => 
    index === self.findIndex((r) => r.id === round.id)
  );

  return { data: uniqueRounds.slice(from, from + limit), meta: { page, limit }, error: null };
}

export async function getCoInvestors(slug: string) {
  const cacheKey = CacheKeys.coInvestors(slug);
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const { data: investor } = await supabase.from("investors").select("id").eq("slug", slug).single();
  if (!investor) throw new Error("NOT_FOUND");

  // Get all funding rounds where this investor participated
  const { data: rounds } = await supabase
    .from("funding_rounds")
    .select("lead_investor_id, co_investors")
    .or(`lead_investor_id.eq.${investor.id},co_investors.cs.{${investor.id}}`);

  if (!rounds || rounds.length === 0) {
    return { data: [], meta: {}, error: null };
  }

  // Count co-investor occurrences
  const coInvestorCounts = new Map<string, number>();
  rounds.forEach((round) => {
    if (round.lead_investor_id && round.lead_investor_id !== investor.id) {
      coInvestorCounts.set(round.lead_investor_id, (coInvestorCounts.get(round.lead_investor_id) || 0) + 1);
    }
    round.co_investors?.forEach((coId: string) => {
      if (coId !== investor.id) {
        coInvestorCounts.set(coId, (coInvestorCounts.get(coId) || 0) + 1);
      }
    });
  });

  // Get investor details for top co-investors
  const topCoInvestorIds = Array.from(coInvestorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  const { data: coInvestors } = await supabase
    .from("investors")
    .select("id, name, slug, type, logo_url, portfolio_count")
    .in("id", topCoInvestorIds);

  const result = {
    data: (coInvestors || []).map((inv) => ({
      ...inv,
      syndication_count: coInvestorCounts.get(inv.id) || 0,
    })),
    meta: {},
    error: null,
  };

  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}
