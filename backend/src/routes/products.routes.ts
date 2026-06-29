import { Router } from "express";
import {
  fetchProducts,
  fetchProduct,
} from "../controllers/products.controller";

const router = Router();

router.get("/", fetchProducts);
router.get("/:slug", fetchProduct);

export default router;
