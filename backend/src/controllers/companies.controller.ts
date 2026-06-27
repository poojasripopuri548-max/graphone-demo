import { Request, Response } from "express";
import {
  getCompanies,
  getCompanyBySlug,
  getTrendingCompanies,
} from "../services/companies.service";

export async function fetchCompanies(req: Request, res: Response) {
  try {
    const companies = await getCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies" });
  }
}

export async function fetchCompany(
  req: Request<{ slug: string }>,
  res: Response
) {
  try {
    const company = await getCompanyBySlug(req.params.slug);
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company" });
  }
}
export async function fetchTrending(req: Request, res: Response) {
  try {
    const companies = await getTrendingCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trending companies" });
  }
}