import axios from "axios";
import type { Company } from "./types";
import { sampleCompanies } from "./sampleCompanies";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const { data } = await axios.get<Company[]>(`${API_BASE_URL}/companies`, {
      timeout: 5000,
    });
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return sampleCompanies;
  } catch {
    // Backend not running / unreachable — fall back to bundled sample data
    // so the directory and every logo still render.
    return sampleCompanies;
  }
}
