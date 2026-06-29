import { Request, Response } from "express";
import { claimCompanySchema, companyFilterSchema, createCompanySchema } from "../validation";
import * as companyService from "../services/companies.service";

export async function fetchCompanies(req: Request, res: Response) {
  try {
    const filters = companyFilterSchema.parse(req.query);
    const result = await companyService.getCompanies(filters);
    res.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching companies" } });
  }
}

export async function fetchCompany(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await companyService.getCompanyBySlug(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Company not found" } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching company" } });
  }
}

export async function fetchTrending(req: Request, res: Response) {
  try {
    const result = await companyService.getTrendingCompanies();
    res.json(result);
  } catch (error) {
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching trending" } });
  }
}

export async function fetchCompanyFunding(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await companyService.getCompanyFunding(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Company not found" } });
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching funding" } });
  }
}

export async function fetchCompanyProducts(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await companyService.getCompanyProducts(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Company not found" } });
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching products" } });
  }
}

export async function fetchCompanyGraph(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await companyService.getCompanyGraph(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Company not found" } });
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching graph" } });
  }
}

export async function createCompanyHandler(req: Request, res: Response) {
  try {
    const body = createCompanySchema.parse(req.body);
    const result = await companyService.createCompany(body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: error.message } });
  }
}

export async function claimCompanyHandler(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const body = claimCompanySchema.parse(req.body);
    const result = await companyService.claimCompany(slug, body);
    res.status(202).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Company not found" } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: error.message } });
  }
}
