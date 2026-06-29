import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().min(1).max(2000),
  category: z.string().min(1).max(100),
  stage: z.enum(["Seed", "Early Stage", "Growth", "Late Stage", "Public"]),
  funding_total: z.number().min(0).default(0),
  employee_count: z.number().min(0).default(0),
  founded_year: z.number().int().min(1900).max(2030),
  hq_city: z.string().min(1).max(100),
  hq_country: z.string().min(1).max(100),
  logo_url: z.string().url("Invalid logo URL"),
  website: z.string().url("Invalid website URL"),
  is_unicorn: z.boolean().default(false),
  valuation: z.number().min(0).default(0),
});

export const claimCompanySchema = z.object({
  claimant_name: z.string().min(1, "Claimant name is required").max(255),
  claimant_email: z.string().email("Invalid claimant email"),
  claimant_role: z.string().min(1).max(120),
  company_url: z.string().url("Invalid company URL"),
  evidence_url: z.string().url("Invalid evidence URL").optional(),
  note: z.string().max(1000).optional(),
});

export const createInvestorSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  type: z.enum(["VC", "Angel", "Corporate"]),
  bio: z.string().min(1).max(2000),
  aum: z.number().min(0),
  portfolio_count: z.number().int().min(0),
  stage_focus: z.array(z.string()),
  sector_focus: z.array(z.string()),
  location: z.string().min(1).max(100),
  logo_url: z.string().url(),
  avg_check_size: z.number().min(0),
  fund_number: z.number().int().min(1),
});

export const createFundingRoundSchema = z.object({
  company_id: z.string().uuid(),
  round_type: z.enum(["Seed", "Series A", "Series B", "Series C", "Series D", "Series E", "IPO", "Debt", "Grant"]),
  amount: z.number().min(0),
  currency: z.string().default("USD"),
  date: z.string().datetime(),
  lead_investor_id: z.string().uuid(),
  co_investors: z.array(z.string().uuid()).default([]),
});

export const createProductSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  category: z.enum(["Chat", "Code", "Image", "Video", "Audio", "Data", "Other"]),
  launch_date: z.string().datetime(),
  upvotes: z.number().int().min(0).default(0),
  website_url: z.string().url(),
  logo_url: z.string().url().optional(),
});

export const createNewsSchema = z.object({
  title: z.string().min(1).max(500),
  url: z.string().url(),
  published_at: z.string().datetime(),
  source: z.string().min(1).max(100),
  tag: z.string().min(1).max(50),
  related_company_ids: z.array(z.string().uuid()).default([]),
  summary: z.string().min(1).max(2000),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(["companies", "investors", "founders", "products", "all"]).default("all"),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const companyFilterSchema = z.object({
  category: z.string().optional(),
  stage: z.string().optional(),
  country: z.string().optional(),
  sort: z.enum(["trending", "funded", "new", "name"]).default("trending"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const investorFilterSchema = z.object({
  type: z.enum(["VC", "Angel", "Corporate"]).optional(),
  stage_focus: z.string().optional(),
  sector: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const productFilterSchema = z.object({
  category: z.enum(["Chat", "Code", "Image", "Video", "Audio", "Data", "Other"]).optional(),
  sort: z.enum(["popular", "newest"]).default("popular"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const newsFilterSchema = z.object({
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
