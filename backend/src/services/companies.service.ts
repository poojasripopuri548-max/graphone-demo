import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 300;

export async function getCompanies(filters?: any) {
  const cacheKey = CacheKeys.companies(filters || {});
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  let query = supabase.from("companies").select("*", { count: "exact" });
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.stage) query = query.eq("stage", filters.stage);
  if (filters?.country) query = query.eq("hq_country", filters.country);

  const sortMap: Record<string, string> = { trending: "growth_score", funded: "funding_total", new: "founded_year", name: "name" };
  query = query.order(sortMap[filters?.sort || "trending"] || "growth_score", { ascending: false });

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

export async function getCompanyBySlug(slug: string) {
  const cacheKey = CacheKeys.company(slug);
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase.from("companies").select("*").eq("slug", slug).single();
  if (error) { if (error.code === "PGRST116") throw new Error("NOT_FOUND"); throw error; }

  const result = { data, meta: {}, error: null };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}

export async function getTrendingCompanies() {
  const cacheKey = CacheKeys.trending();
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase.from("companies").select("*").order("growth_score", { ascending: false }).limit(10);
  if (error) throw error;

  const result = { data: data || [], meta: {}, error: null };
  appCache.set(cacheKey, result, 60);
  return result;
}

export async function getCompanyFunding(slug: string) {
  const { data: company } = await supabase.from("companies").select("id").eq("slug", slug).single();
  if (!company) throw new Error("NOT_FOUND");
  const { data, error } = await supabase.from("funding_rounds").select("*").eq("company_id", company.id).order("date", { ascending: false });
  if (error) throw error;
  return { data: data || [], meta: {}, error: null };
}

export async function getCompanyProducts(slug: string) {
  const { data: company } = await supabase.from("companies").select("id").eq("slug", slug).single();
  if (!company) throw new Error("NOT_FOUND");
  const { data, error } = await supabase.from("products").select("*").eq("company_id", company.id).order("upvotes", { ascending: false });
  if (error) throw error;
  return { data: data || [], meta: {}, error: null };
}

export async function getCompanyGraph(slug: string) {
  const cacheKey = CacheKeys.graph(slug);
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const { data: company } = await supabase.from("companies").select("id, name, slug, category, logo_url, growth_score").eq("slug", slug).single();
  if (!company) throw new Error("NOT_FOUND");

  const { data: similar } = await supabase.from("companies").select("id, name, slug, category, logo_url, growth_score").eq("category", company.category).neq("slug", slug).order("growth_score", { ascending: false }).limit(5);

  const { data: fundingRounds } = await supabase.from("funding_rounds").select("lead_investor_id, co_investors").eq("company_id", company.id);
  const investorIds = new Set<string>();
  fundingRounds?.forEach((fr: any) => { if (fr.lead_investor_id) investorIds.add(fr.lead_investor_id); fr.co_investors?.forEach((ci: string) => investorIds.add(ci)); });

  const { data: investors } = investorIds.size > 0
    ? await supabase.from("investors").select("id, name, slug, type, logo_url").in("id", Array.from(investorIds))
    : { data: [] };

  const { data: relationships } = await supabase
    .from("company_relationships")
    .select("id, related_company_id, relationship_type, strength")
    .eq("company_id", company.id)
    .order("strength", { ascending: false });

  const relatedIds = (relationships || []).map((relationship: any) => relationship.related_company_id);
  const { data: relatedCompanies } = relatedIds.length > 0
    ? await supabase.from("companies").select("id, name, slug, category, logo_url, growth_score").in("id", relatedIds)
    : { data: [] };

  const relatedById = new Map((relatedCompanies || []).map((related: any) => [related.id, related]));
  const relationshipNodes = (relationships || [])
    .map((relationship: any) => relatedById.get(relationship.related_company_id))
    .filter(Boolean);

  const nodes = [
    { ...company, node_type: "company", is_origin: true },
    ...relationshipNodes.map((related: any) => ({ ...related, node_type: "company", is_origin: false })),
    ...(investors || []).map((investor: any) => ({ ...investor, node_type: "investor" })),
  ];

  const edges = [
    ...(relationships || []).map((relationship: any) => ({
      id: relationship.id,
      source: company.id,
      target: relationship.related_company_id,
      type: relationship.relationship_type,
      strength: relationship.strength,
    })),
    ...(investors || []).map((investor: any) => ({
      id: `investor-${investor.id}`,
      source: company.id,
      target: investor.id,
      type: "invested_in",
      strength: 0.75,
    })),
  ];

  const result = {
    data: {
      company,
      competitors: relationshipNodes.length > 0 ? relationshipNodes : similar || [],
      investors: investors || [],
      nodes,
      edges,
    },
    meta: {},
    error: null,
  };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}

export async function createCompany(body: any) {
  const { data, error } = await supabase.from("companies").insert({ ...body, last_scraped_at: new Date().toISOString(), data_confidence_score: body.data_confidence_score || 50, growth_score: body.growth_score || 50 }).select().single();
  if (error) throw error;
  appCache.del("companies:");
  appCache.del(CacheKeys.trending());
  return { data, meta: {}, error: null };
}

export async function claimCompany(slug: string, body: any) {
  const { data: company } = await supabase.from("companies").select("id, name, slug").eq("slug", slug).single();
  if (!company) throw new Error("NOT_FOUND");

  const { data, error } = await supabase
    .from("company_claims")
    .insert({
      company_id: company.id,
      claimant_name: body.claimant_name,
      claimant_email: body.claimant_email,
      claimant_role: body.claimant_role,
      company_url: body.company_url,
      evidence_url: body.evidence_url || null,
      note: body.note || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  return {
    data: {
      claim: data,
      company,
      message: "Claim submitted for review",
    },
    meta: {},
    error: null,
  };
}
