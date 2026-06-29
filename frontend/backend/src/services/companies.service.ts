import { supabase } from "../config/supabase";

export async function getCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCompanyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getTrendingCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("growth_score", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}