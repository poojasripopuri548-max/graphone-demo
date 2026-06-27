import { Router } from "express";
import {
  fetchCompanies,
  fetchCompany,
  fetchTrending,
} from "../controllers/companies.controller";

const router = Router();

router.get("/", fetchCompanies);
router.get("/trending", fetchTrending);
router.get("/:slug", fetchCompany);

export default router;