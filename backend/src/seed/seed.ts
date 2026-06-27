import { supabase } from "../config/supabase";
import { companies } from "./companies";

async function seedCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .insert(companies);

  if (error) {
    console.error("Error seeding companies:", error);
    return;
  }

  console.log("✅ Companies seeded successfully!");
  console.log(data);
}

seedCompanies();