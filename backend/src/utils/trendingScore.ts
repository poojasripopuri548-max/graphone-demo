/**
 * GraphOne Trending Score Formula
 * 
 * The trending score measures a company's current momentum in the AI ecosystem.
 * It combines multiple signals into a 0-100 score:
 * 
 * Score = (Funding Recency × 0.25) + (Employee Growth × 0.20) + 
 *         (News Volume × 0.20) + (Product Upvotes × 0.15) + 
 *         (Base Relevance × 0.20)
 * 
 * - funding_recency: 0-100 based on how recent the last funding round was
 *   (100 = within last 30 days, decays to 0 over 365 days)
 * - employee_growth: 0-100 based on % headcount increase in last 6 months
 *   (100 = >100% growth, scaled logarithmically)
 * - news_mentions: 0-100 based on news article count in last 7 days
 *   (100 = 10+ articles, scaled logarithmically)
 * - product_upvotes: 0-100 based on total upvotes across all products
 *   (100 = 5000+ upvotes, scaled logarithmically)
 * - foundation_weight: 0-100 based on data confidence and entity completeness
 *   (100 = complete data with high confidence score)
 */

export interface TrendingSignalInput {
  daysSinceLastFunding: number;
  employeeGrowthPercent: number;
  newsMentionCount7d: number;
  totalProductUpvotes: number;
  dataConfidenceScore: number;
}

export function calculateTrendingScore(input: TrendingSignalInput): number {
  const fundingRecencyScore = normalizeDecay(input.daysSinceLastFunding, 365, 30);
  const employeeGrowthScore = normalizeLog(input.employeeGrowthPercent, 100, 2);
  const newsMentionScore = normalizeLog(input.newsMentionCount7d, 10, 1.5);
  const upvoteScore = normalizeLog(input.totalProductUpvotes, 5000, 1.5);
  const baseScore = input.dataConfidenceScore;

  const score =
    fundingRecencyScore * 0.25 +
    employeeGrowthScore * 0.20 +
    newsMentionScore * 0.20 +
    upvoteScore * 0.15 +
    baseScore * 0.20;

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Decay function: score decreases from 100 to 0 as days increase
 * plateauDays: days before decay starts
 * totalDecayDays: days until score reaches 0
 */
function normalizeDecay(value: number, totalDecayDays: number, plateauDays: number): number {
  if (value <= plateauDays) return 100;
  if (value >= totalDecayDays) return 0;
  const decayed = ((totalDecayDays - value) / (totalDecayDays - plateauDays)) * 100;
  return Math.round(decayed);
}

/**
 * Logarithmic scaling: maps value to 0-100 scale
 * value: raw input
 * maxReference: the value at which score reaches 100
 * base: logarithm base (higher = slower growth)
 */
function normalizeLog(value: number, maxReference: number, base: number): number {
  if (value <= 0) return 0;
  if (value >= maxReference) return 100;
  const score = (Math.log(value) / Math.log(maxReference)) * 100;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Ranks an array of companies by their trending score in descending order.
 * Companies with equal scores are sub-sorted by data confidence.
 */
export function rankByTrending(
  companies: Array<{ growth_score: number; data_confidence_score: number }>
): Array<{ growth_score: number; data_confidence_score: number; rank: number }> {
  return companies
    .map((c) => ({ ...c, rank: 0 }))
    .sort((a, b) => {
      if (b.growth_score !== a.growth_score) return b.growth_score - a.growth_score;
      return (b.data_confidence_score || 0) - (a.data_confidence_score || 0);
    })
    .map((c, i) => ({ ...c, rank: i + 1 }));
}