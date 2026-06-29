-- Migration: Add data_confidence_score column to companies table
-- Run this in your Supabase SQL Editor if the column doesn't exist

-- Add the missing column
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS data_confidence_score DECIMAL(5, 2) DEFAULT 50;

-- Update existing rows to have a default value if NULL
UPDATE companies 
SET data_confidence_score = 50 
WHERE data_confidence_score IS NULL;
