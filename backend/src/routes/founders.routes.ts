import { Router } from "express";
import { fetchFounder } from "../controllers/founders.controller";

const router = Router();

router.get("/:slug", fetchFounder);

export default router;
