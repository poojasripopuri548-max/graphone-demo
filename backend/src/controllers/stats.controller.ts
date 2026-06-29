import { Request, Response } from "express";
import * as statsService from "../services/stats.service";

export async function fetchStats(req: Request, res: Response) {
  try {
    const result = await statsService.getStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching stats" } });
  }
}
