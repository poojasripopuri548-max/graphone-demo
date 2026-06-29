export interface Company {
  id?: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  category: string;
  stage: string;
  headquarters: string;
  website: string;
  founded_year: number;
  employee_count: number;
  funding_amount: number;
  growth_score: number;
  created_at?: string;
}
