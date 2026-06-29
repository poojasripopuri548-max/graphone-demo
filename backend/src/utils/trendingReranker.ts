import { supabase } from "../config/supabase";
import { appCache, CacheKeys } from "./cache";
import { calculateTrendingScore } from "./trendingScore";

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function rerankTrendingCompanies() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("id, employee_count, data_confidence_score");

  if (error) throw error;
  if (!companies || companies.length === 0) return { updated: 0 };

  let updated = 0;

  for (const company of companies) {
    const [{ data: latestFunding }, { count: newsMentionCount7d }, { data: products }] = await Promise.all([
      supabase
        .from("funding_rounds")
        .select("date")
        .eq("company_id", company.id)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("news_articles")
        .select("id", { count: "exact", head: true })
        .contains("related_company_ids", [company.id])
        .gte("published_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase
        .from("products")
        .select("upvotes")
        .eq("company_id", company.id),
    ]);

    const daysSinceLastFunding = latestFunding?.date
      ? Math.floor((Date.now() - new Date(latestFunding.date).getTime()) / (24 * 60 * 60 * 1000))
      : 365;
    const employeeGrowthProxy = Math.min(100, Math.log10((company.employee_count || 0) + 1) * 22);
    const totalProductUpvotes = (products || []).reduce((sum: number, product: any) => sum + (product.upvotes || 0), 0);

    const growthScore = calculateTrendingScore({
      daysSinceLastFunding,
      employeeGrowthPercent: employeeGrowthProxy,
      newsMentionCount7d: newsMentionCount7d || 0,
      totalProductUpvotes,
      dataConfidenceScore: company.data_confidence_score || 50,
    });

    const { error: updateError } = await supabase
      .from("companies")
      .update({ growth_score: growthScore, last_scraped_at: new Date().toISOString() })
      .eq("id", company.id);

    if (updateError) throw updateError;
    updated += 1;
  }

  appCache.del(CacheKeys.trending());
  appCache.del("companies:");

  return { updated };
}

export function startTrendingReranker() {
  if (process.env.DISABLE_TRENDING_CRON === "true") return;

  const run = async () => {
    try {
      const result = await rerankTrendingCompanies();
      console.log(`Trending reranker updated ${result.updated} companies`);
    } catch (error) {
      console.error("Trending reranker failed:", error);
    }
  };

  setTimeout(run, 5000);
  setInterval(run, Number(process.env.TRENDING_RERANK_INTERVAL_MS) || ONE_HOUR_MS);
}
