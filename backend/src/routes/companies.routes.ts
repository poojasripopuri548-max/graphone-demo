import { Router } from "express";
import {
  fetchCompanies,
  fetchCompany,
  fetchTrending,
  fetchCompanyFunding,
  fetchCompanyProducts,
  fetchCompanyGraph,
  createCompanyHandler,
  claimCompanyHandler,
} from "../controllers/companies.controller";
import { requireApiKey } from "../middleware/auth";

const router = Router();

router.get("/", fetchCompanies);
router.get("/trending", fetchTrending);
router.get("/:slug", fetchCompany);
router.get("/:slug/funding", fetchCompanyFunding);
router.get("/:slug/products", fetchCompanyProducts);
router.get("/:slug/graph", fetchCompanyGraph);
router.post("/:slug/claim", claimCompanyHandler);
router.post("/", requireApiKey, createCompanyHandler);

export default router;
