import { supabase } from "../config/supabase";
import { companies } from "./companies";
import { investors } from "./investors";
import { news } from "./news";

async function seedCompanies() {
  console.log("Seeding companies...");
  const { data, error } = await supabase
    .from("companies")
    .insert(companies)
    .select();

  if (error) {
    console.error("Error seeding companies:", error);
    return;
  }

  console.log(`${data?.length || 0} companies seeded successfully.`);
  return data;
}

async function seedInvestors() {
  console.log("Seeding investors...");
  const { data, error } = await supabase
    .from("investors")
    .insert(investors)
    .select();

  if (error) {
    console.error("Error seeding investors:", error);
    return;
  }

  console.log(`${data?.length || 0} investors seeded successfully.`);
  return data;
}

async function seedNews() {
  console.log("Seeding news...");
  const { data, error } = await supabase
    .from("news_articles")
    .insert(news)
    .select();

  if (error) {
    console.error("Error seeding news:", error);
    return;
  }

  console.log(`${data?.length || 0} news articles seeded successfully.`);
  return data;
}

function tagSlug(companySlug: string, value: string) {
  return `${companySlug}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

async function seedGraphData(seededCompanies: any[] | undefined) {
  if (!seededCompanies || seededCompanies.length === 0) return;

  console.log("Seeding tags and company relationships...");

  const bySlug = new Map(seededCompanies.map((company) => [company.slug, company]));
  const tags = seededCompanies.flatMap((company) => [
    {
      name: company.category,
      slug: tagSlug(company.slug, company.category),
      entity_type: "company",
      entity_id: company.id,
    },
    {
      name: company.stage,
      slug: tagSlug(company.slug, company.stage),
      entity_type: "company",
      entity_id: company.id,
    },
  ]);

  const relationshipPairs: Array<[string, string, string, number]> = [
    ["openai", "anthropic", "llm_competitor", 0.95],
    ["openai", "google-deepmind", "research_peer", 0.9],
    ["anthropic", "cohere", "llm_competitor", 0.86],
    ["hugging-face", "replicate", "model_distribution", 0.82],
    ["perplexity-ai", "you-com", "search_competitor", 0.88],
    ["midjourney", "stability-ai", "image_generation_competitor", 0.9],
    ["cursor", "replit", "developer_tool_peer", 0.84],
    ["mistral-ai", "cohere", "enterprise_llm_peer", 0.8],
  ];

  const relationships = relationshipPairs
    .map(([sourceSlug, targetSlug, relationshipType, strength]) => {
      const source = bySlug.get(sourceSlug as string);
      const target = bySlug.get(targetSlug as string);
      if (!source || !target) return null;
      return {
        company_id: source.id,
        related_company_id: target.id,
        relationship_type: relationshipType,
        strength,
      };
    })
    .filter((relationship): relationship is {
      company_id: string;
      related_company_id: string;
      relationship_type: string;
      strength: number;
    } => relationship !== null);

  const { error: tagError } = await supabase.from("tags").insert(tags);
  if (tagError) console.error("Error seeding tags:", tagError);

  const { error: relationshipError } = await supabase.from("company_relationships").insert(relationships);
  if (relationshipError) console.error("Error seeding company relationships:", relationshipError);
}

async function seedAll() {
  console.log("Starting seed process...\n");

  const seededCompanies = await seedCompanies();
  await seedInvestors();
  await seedNews();
  await seedGraphData(seededCompanies);

  console.log("\nSeed process completed.");
}

seedAll();
