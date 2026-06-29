export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  category: string;
  stage: string;
  hq_city: string;
  hq_country: string;
  website: string;
  founded_year: number;
  employee_count: number;
  funding_total: number;
  is_unicorn: boolean;
  valuation: number;
  growth_score: number;
  data_confidence_score: number;
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
}