import { Request, Response } from "express";
import * as feedService from "../services/feed.service";

export async function fetchFeed(req: Request, res: Response) {
  try {
    const result = await feedService.getFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching feed" } });
  }
}
