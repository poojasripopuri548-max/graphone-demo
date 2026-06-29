import { Request, Response } from "express";
import { investorFilterSchema } from "../validation";
import * as investorService from "../services/investors.service";

export async function fetchInvestors(req: Request, res: Response) {
  try {
    const filters = investorFilterSchema.parse(req.query);
    const result = await investorService.getInvestors(filters);
    res.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching investors" } });
  }
}

export async function fetchInvestor(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await investorService.getInvestorBySlug(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Investor not found" } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching investor" } });
  }
}

export async function fetchMostActive(req: Request, res: Response) {
  try {
    const result = await investorService.getMostActiveInvestors();
    res.json(result);
  } catch (error) {
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching most active investors" } });
  }
}

export async function fetchInvestorInvestments(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const filters = { page: parseInt(req.query.page as string) || 1, limit: parseInt(req.query.limit as string) || 20 };
    const result = await investorService.getInvestorInvestments(slug, filters);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Investor not found" } });
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching investments" } });
  }
}

export async function fetchCoInvestors(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await investorService.getCoInvestors(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Investor not found" } });
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching co-investors" } });
  }
}
