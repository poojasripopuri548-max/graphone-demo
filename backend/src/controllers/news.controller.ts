import { Request, Response } from "express";
import { newsFilterSchema } from "../validation";
import * as newsService from "../services/news.service";

export async function fetchNews(req: Request, res: Response) {
  try {
    const filters = newsFilterSchema.parse(req.query);
    const result = await newsService.getNews(filters);
    res.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching news" } });
  }
}

export async function fetchTrendingNews(req: Request, res: Response) {
  try {
    const result = await newsService.getTrendingNews();
    res.json(result);
  } catch (error) {
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching trending news" } });
  }
}
