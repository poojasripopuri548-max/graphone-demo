import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import companiesRoutes from "./routes/companies.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "GraphOne API is running 🚀",
  });
});

app.use("/api/companies", companiesRoutes);

export default app;