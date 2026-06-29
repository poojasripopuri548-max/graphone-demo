import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("[Error]", err);

  if (err instanceof ZodError) {
    const issues = (err as any).issues || (err as any).errors || [];
    return res.status(400).json({
      data: null,
      meta: {},
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: issues.map((e: any) => ({
          field: e.path?.join(".") || "unknown",
          message: e.message,
        })),
      },
    });
  }

  if (err.message === "NOT_FOUND") {
    return res.status(404).json({
      data: null,
      meta: {},
      error: {
        code: "NOT_FOUND",
        message: "Resource not found",
      },
    });
  }

  return res.status(500).json({
    data: null,
    meta: {},
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    data: null,
    meta: {},
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
    },
  });
}