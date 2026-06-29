import { Router } from "express";
import {
  fetchInvestors,
  fetchInvestor,
  fetchMostActive,
  fetchInvestorInvestments,
  fetchCoInvestors,
} from "../controllers/investors.controller";

const router = Router();

router.get("/", fetchInvestors);
router.get("/most-active", fetchMostActive);
router.get("/:slug", fetchInvestor);
router.get("/:slug/investments", fetchInvestorInvestments);
router.get("/:slug/co-investors", fetchCoInvestors);

export default router;
