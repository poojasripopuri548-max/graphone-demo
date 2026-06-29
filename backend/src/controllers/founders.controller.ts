import { Request, Response } from "express";
import * as foundersService from "../services/founders.service";

export async function fetchFounder(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await foundersService.getFounderBySlug(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Founder not found" } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching founder" } });
  }
}
