import { supabase } from "../config/supabase";

export async function getFounderBySlug(slug: string) {
  const { data, error } = await supabase
    .from("founders")
    .select("*, companies!inner(name, slug, logo_url)")
    .eq("slug", slug)
    .single();

  if (error) { if (error.code === "PGRST116") throw new Error("NOT_FOUND"); throw error; }

  return { data, meta: {}, error: null };
}
