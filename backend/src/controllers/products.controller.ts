import { Request, Response } from "express";
import { productFilterSchema } from "../validation";
import * as productService from "../services/products.service";

export async function fetchProducts(req: Request, res: Response) {
  try {
    const filters = productFilterSchema.parse(req.query);
    const result = await productService.getProducts(filters);
    res.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ data: null, meta: {}, error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching products" } });
  }
}

export async function fetchProduct(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const result = await productService.getProductBySlug(slug);
    res.json(result);
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Product not found" } });
    }
    res.status(500).json({ data: null, meta: {}, error: { code: "INTERNAL_ERROR", message: "Error fetching product" } });
  }
}
