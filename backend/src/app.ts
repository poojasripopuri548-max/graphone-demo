import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import companiesRoutes from "./routes/companies.routes";
import investorsRoutes from "./routes/investors.routes";
import productsRoutes from "./routes/products.routes";
import newsRoutes from "./routes/news.routes";
import searchRoutes from "./routes/search.routes";
import feedRoutes from "./routes/feed.routes";
import statsRoutes from "./routes/stats.routes";
import foundersRoutes from "./routes/founders.routes";

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    data: null,
    meta: {},
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later.",
    },
  },
});

app.use(cors());
app.use(express.json());
app.use(limiter);

// Health check
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "GraphOne API is running 🚀",
  });
});

// API routes
app.use("/api/companies", companiesRoutes);
app.use("/api/investors", investorsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/founders", foundersRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;