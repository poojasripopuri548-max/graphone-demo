-- GraphOne Supabase Schema Migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  stage VARCHAR(50),
  funding_total DECIMAL(18, 2) DEFAULT 0,
  employee_count INT DEFAULT 0,
  founded_year INT,
  hq_city VARCHAR(100),
  hq_country VARCHAR(100),
  logo_url TEXT,
  website TEXT,
  is_unicorn BOOLEAN DEFAULT FALSE,
  valuation DECIMAL(18, 2) DEFAULT 0,
  growth_score DECIMAL(5, 2) DEFAULT 50,
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  data_confidence_score DECIMAL(5, 2) DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(category);
CREATE INDEX IF NOT EXISTS idx_companies_stage ON companies(stage);
CREATE INDEX IF NOT EXISTS idx_companies_growth_score ON companies(growth_score DESC);

-- Investors Table
CREATE TABLE IF NOT EXISTS investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) CHECK (type IN ('VC', 'Angel', 'Corporate')),
  bio TEXT,
  aum DECIMAL(18, 2) DEFAULT 0,
  portfolio_count INT DEFAULT 0,
  stage_focus TEXT[] DEFAULT '{}',
  sector_focus TEXT[] DEFAULT '{}',
  location VARCHAR(100),
  logo_url TEXT,
  avg_check_size DECIMAL(18, 2) DEFAULT 0,
  fund_number INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investors_slug ON investors(slug);
CREATE INDEX IF NOT EXISTS idx_investors_type ON investors(type);
CREATE INDEX IF NOT EXISTS idx_investors_portfolio_count ON investors(portfolio_count DESC);

-- Funding Rounds Table
CREATE TABLE IF NOT EXISTS funding_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  round_type VARCHAR(50) NOT NULL,
  amount DECIMAL(18, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  date DATE NOT NULL,
  lead_investor_id UUID REFERENCES investors(id) ON DELETE SET NULL,
  co_investors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_company_id ON funding_rounds(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_lead_investor_id ON funding_rounds(lead_investor_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_date ON funding_rounds(date DESC);

-- Founders Table
CREATE TABLE IF NOT EXISTS founders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  bio TEXT,
  twitter TEXT,
  linkedin TEXT,
  location VARCHAR(100),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_founders_slug ON founders(slug);
CREATE INDEX IF NOT EXISTS idx_founders_company_id ON founders(company_id);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  launch_date DATE,
  upvotes INT DEFAULT 0,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_upvotes ON products(upvotes DESC);

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(100),
  tag VARCHAR(50),
  related_company_ids UUID[] DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_tag ON news_articles(tag);

-- Tags Table (for flexible entity tagging)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_entity ON tags(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Company Relationships Table (for graph-like modeling)
CREATE TABLE IF NOT EXISTS company_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  related_company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL,
  strength DECIMAL(3, 2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, related_company_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_company_relationships_company_id ON company_relationships(company_id);
CREATE INDEX IF NOT EXISTS idx_company_relationships_related_company_id ON company_relationships(related_company_id);
CREATE INDEX IF NOT EXISTS idx_company_relationships_type ON company_relationships(relationship_type);

-- Company Claims Table (for verified profile ownership requests)
CREATE TABLE IF NOT EXISTS company_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  claimant_name VARCHAR(255) NOT NULL,
  claimant_email VARCHAR(255) NOT NULL,
  claimant_role VARCHAR(120) NOT NULL,
  company_url TEXT NOT NULL,
  evidence_url TEXT,
  note TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_company_claims_company_id ON company_claims(company_id);
CREATE INDEX IF NOT EXISTS idx_company_claims_status ON company_claims(status);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
