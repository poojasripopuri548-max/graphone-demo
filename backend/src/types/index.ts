export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  stage: string;
  funding_total: number;
  employee_count: number;
  founded_year: number;
  hq_city: string;
  hq_country: string;
  logo_url: string;
  website: string;
  is_unicorn: boolean;
  valuation: number;
  growth_score: number;
  last_scraped_at: string;
  data_confidence_score: number;
  created_at: string;
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: "VC" | "Angel" | "Corporate";
  bio: string;
  aum: number;
  portfolio_count: number;
  stage_focus: string[];
  sector_focus: string[];
  location: string;
  logo_url: string;
  avg_check_size: number;
  fund_number: number;
  created_at: string;
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: string;
  amount: number;
  currency: string;
  date: string;
  lead_investor_id: string;
  co_investors: string[];
  created_at: string;
}

export interface Founder {
  id: string;
  name: string;
  slug: string;
  title: string;
  company_id: string;
  bio: string;
  twitter: string;
  linkedin: string;
  location: string;
  photo_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description: string;
  category: string;
  launch_date: string;
  upvotes: number;
  website_url: string;
  logo_url: string;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: string;
  tag: string;
  related_company_ids: string[];
  summary: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export interface CompanyRelationship {
  id: string;
  company_id: string;
  related_company_id: string;
  relationship_type: string;
  strength: number;
  created_at: string;
}

export interface FeedItem {
  id: string;
  type: "news" | "funding_round" | "new_company";
  title: string;
  description: string;
  url: string;
  published_at: string;
  source: string;
  relevance_score: number;
  related_entity_id: string;
  related_entity_type: string;
  created_at: string;
}

export interface TrendingScoreInput {
  funding_recency: number;
  employee_growth: number;
  news_mentions: number;
  product_upvotes: number;
  foundation_weight: number;
}

export interface ApiResponse<T> {
  data: T | null;
  meta: {
    total?: number;
    page?: number;
    limit?: number;
    next_cursor?: string;
  };
  error: {
    code: string;
    message: string;
  } | null;
}

export interface SearchResult {
  companies: Company[];
  investors: Investor[];
  founders: Founder[];
  products: Product[];
}