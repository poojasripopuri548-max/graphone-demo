import { Request, Response, NextFunction } from "express";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      data: null,
      meta: {},
      error: {
        code: "UNAUTHORIZED",
        message: "Missing X-API-Key header",
      },
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      data: null,
      meta: {},
      error: {
        code: "FORBIDDEN",
        message: "Invalid API key",
      },
    });
  }

  next();
}