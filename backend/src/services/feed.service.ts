import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "../utils/cache";

const CACHE_TTL = 120;

export async function getFeed() {
  const cacheKey = CacheKeys.feed();
  const cached = appCache.get(cacheKey);
  if (cached) return cached;

  const feedItems: any[] = [];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get recent news
  const { data: news } = await supabase
    .from("news_articles")
    .select("*")
    .gte("published_at", sevenDaysAgo)
    .order("published_at", { ascending: false })
    .limit(20);

  news?.forEach((item) => {
    feedItems.push({
      id: `news-${item.id}`,
      type: "news",
      title: item.title,
      description: item.summary,
      url: item.url,
      published_at: item.published_at,
      source: item.source,
      relevance_score: 80,
      related_entity_id: item.related_company_ids?.[0] || null,
      related_entity_type: "company",
    });
  });

  // Get recent funding rounds
  const { data: funding } = await supabase
    .from("funding_rounds")
    .select("*, companies!inner(name, slug)")
    .gte("date", sevenDaysAgo)
    .order("date", { ascending: false })
    .limit(15);

  funding?.forEach((item) => {
    feedItems.push({
      id: `funding-${item.id}`,
      type: "funding_round",
      title: `${item.companies.name} raised ${formatCurrency(item.amount)} in ${item.round_type}`,
      description: `${item.companies.name} secured funding round`,
      url: `/companies/${item.companies.slug}`,
      published_at: item.date,
      source: "Funding",
      relevance_score: 90,
      related_entity_id: item.company_id,
      related_entity_type: "company",
    });
  });

  // Get recently added companies (based on created_at)
  const { data: newCompanies } = await supabase
    .from("companies")
    .select("*")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(10);

  newCompanies?.forEach((item) => {
    feedItems.push({
      id: `company-${item.id}`,
      type: "new_company",
      title: `New company: ${item.name}`,
      description: item.description,
      url: `/companies/${item.slug}`,
      published_at: item.created_at,
      source: "New Addition",
      relevance_score: 70,
      related_entity_id: item.id,
      related_entity_type: "company",
    });
  });

  // Sort by relevance_score and published_at
  feedItems.sort((a, b) => {
    if (b.relevance_score !== a.relevance_score) {
      return b.relevance_score - a.relevance_score;
    }
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  const result = { data: feedItems.slice(0, 50), meta: {}, error: null };
  appCache.set(cacheKey, result, CACHE_TTL);
  return result;
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount}`;
}
