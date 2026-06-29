import { Router } from "express";
import {
  fetchNews,
  fetchTrendingNews,
} from "../controllers/news.controller";

const router = Router();

router.get("/", fetchNews);
router.get("/trending", fetchTrendingNews);

export default router;
