import app from "./app";
import { startTrendingReranker } from "./utils/trendingReranker";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startTrendingReranker();
});
