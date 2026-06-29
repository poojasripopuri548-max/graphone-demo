import { Router } from "express";
import { fetchFeed } from "../controllers/feed.controller";

const router = Router();

router.get("/", fetchFeed);

export default router;
