import { Request, Response } from "express";
import { searchQuerySchema } from "../validation";
import * as searchService from "../services/search.service";

export async function searchHandler(req: Request, res: Response) {
  try {
    const { q, type, limit } = searchQuerySchema.parse(req.query);
    const result = await searchService.search(q, type, limit);
    res.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error performing search" } });
  }
}
