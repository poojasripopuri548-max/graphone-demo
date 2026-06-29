# GraphOne Backend API

The backend API for GraphOne - the intelligence layer for the AI economy. Built with Node.js, Express, TypeScript, and Supabase.

## Features

- RESTful API with consistent JSON responses
- Supabase (PostgreSQL) database with optimized schema
- Zod validation on all inputs
- Rate limiting (100 req/min per IP)
- In-memory caching with node-cache
- Comprehensive seed data (50+ companies, 20+ investors, 100+ news)
- Trending Score algorithm for company ranking
- Background job support for re-ranking trending companies

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Caching**: node-cache
- **Rate Limiting**: express-rate-limit

## Setup Instructions

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000

# API Key for write operations
API_KEY=your_secure_api_key_here
```

### 3. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration file in the Supabase SQL Editor:
   - Open `supabase-schema.sql`
   - Copy and paste into Supabase SQL Editor
   - Execute the migration

### 4. Seed Data

```bash
npm run seed
```

This will populate the database with:
- 50+ real AI companies
- 23 investors (VC firms, Corporate VCs, Angels)
- 100+ news articles

### 5. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Companies

- `GET /api/companies` - List companies with filters
- `GET /api/companies/trending` - Top 10 trending companies
- `GET /api/companies/:slug` - Full company profile
- `GET /api/companies/:slug/funding` - Funding rounds timeline
- `GET /api/companies/:slug/products` - Company's products
- `GET /api/companies/:slug/graph` - Ecosystem graph (1-hop)
- `POST /api/companies/:slug/claim` - Submit a verified ownership claim with URL validation
- `POST /api/companies` - Create new company (requires API key)

### Investors

- `GET /api/investors` - List investors with filters
- `GET /api/investors/most-active` - Most active investors
- `GET /api/investors/:slug` - Full investor profile
- `GET /api/investors/:slug/investments` - Investment history
- `GET /api/investors/:slug/co-investors` - Syndication patterns

### Products

- `GET /api/products` - List products with filters
- `GET /api/products/:slug` - Product detail

### News

- `GET /api/news` - Paginated news feed
- `GET /api/news/trending` - Most read in last 24h

### Search & Utility

- `GET /api/search?q=` - Cross-entity search
- `GET /api/feed` - Ranked activity feed
- `GET /api/stats` - Platform aggregate stats
- `GET /api/founders/:slug` - Founder profile

## Response Format

All API responses follow this structure:

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  },
  "error": null
}
```

Error responses:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

## Trending Score Formula

The Trending Score measures a company's current momentum in the AI ecosystem. It combines multiple signals into a 0-100 score:

### Formula

```
Score = (Funding Recency × 0.25) + 
        (Employee Growth × 0.20) + 
        (News Volume × 0.20) + 
        (Product Upvotes × 0.15) + 
        (Base Relevance × 0.20)
```

### Components

1. **Funding Recency (0-100)**
   - Based on days since last funding round
   - 100 = funding within last 30 days
   - Decays to 0 over 365 days
   - Uses exponential decay function

2. **Employee Growth (0-100)**
   - Based on % headcount increase in last 6 months
   - 100 = >100% growth
   - Scaled logarithmically to reward rapid expansion

3. **News Volume (0-100)**
   - Based on news article count in last 7 days
   - 100 = 10+ articles
   - Scaled logarithmically

4. **Product Upvotes (0-100)**
   - Based on total upvotes across all products
   - 100 = 5000+ upvotes
   - Scaled logarithmically

5. **Base Relevance (0-100)**
   - Based on data confidence score and entity completeness
   - Rewards companies with complete, high-quality data

### Implementation

The trending score is calculated in `src/utils/trendingScore.ts` and persisted by the scheduled reranker in `src/utils/trendingReranker.ts`. The reranker runs shortly after server startup and then hourly by default, updating `companies.growth_score` and `last_scraped_at`. Companies are ranked by this score in descending order.

### Rationale

This formula balances:
- **Recency**: Recent funding and news indicate current momentum
- **Growth**: Employee expansion shows company health
- **Engagement**: Product upvotes show user interest
- **Quality**: Data confidence ensures reliable ranking

The weights prioritize funding recency (25%) as the strongest signal of current activity, while maintaining a balanced view across all dimensions.

## Caching Strategy

The API uses in-memory caching with node-cache for frequently accessed endpoints:

- **TTL**: 5 minutes (300 seconds) for most endpoints
- **Trending endpoint**: 1 minute (60 seconds) for freshness
- **Stats endpoint**: 10 minutes (600 seconds) for aggregate data

Cached endpoints:
- `/api/companies` (with filters)
- `/api/companies/trending`
- `/api/companies/:slug`
- `/api/companies/:slug/graph`
- `/api/investors` (with filters)
- `/api/investors/:slug`
- `/api/investors/:slug/co-investors`
- `/api/products` (with filters)
- `/api/news` (with filters)
- `/api/news/trending`
- `/api/search`
- `/api/feed`
- `/api/stats`

Cache is automatically invalidated on write operations (create/update/delete).

## Background Jobs

The backend starts a lightweight cron-style reranking job from `src/index.ts`. It recalculates trending scores from recent funding, news mentions, product upvotes, a headcount momentum proxy, and data confidence. Configure it with:

- `TRENDING_RERANK_INTERVAL_MS` - override the default hourly interval
- `DISABLE_TRENDING_CRON=true` - disable the job for tests or one-off scripts

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Window**: 1 minute (rolling)
- **Response**: 429 status with error message when exceeded

## Authentication

Write operations (POST, PUT, DELETE) require an API key:

```http
X-API-Key: your_secure_api_key
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (Supabase)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware (auth, rate limit, error handler)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── seed/            # Database seed data
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (cache, trending score)
│   ├── validation/      # Zod schemas
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Server entry point
├── supabase-schema.sql  # Database migration
├── package.json
├── tsconfig.json
└── .env                 # Environment variables (not committed)
```

## Development

### Run in development mode with auto-reload:

```bash
npm run dev
```

### Build for production:

```bash
npm run build
```

### Run production build:

```bash
npm start
```

## Deployment

### Railway

1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts to configure

## Testing

Test the API using the provided endpoints or import the Postman collection (if available).

Example curl command:

```bash
curl http://localhost:5000/api/companies/trending
```

## What Would I Build Next With 2 More Days?

Given 2 more days, I would prioritize:

1. **Background Job System**
   - Implement a cron job to automatically re-calculate trending scores every hour
   - Use node-cron or a serverless cron solution
   - This ensures trending rankings stay fresh without manual intervention

2. **WebSocket Support for Real-Time Updates**
   - Add WebSocket endpoints for real-time feed updates
   - Push new funding rounds, news, and company additions instantly
   - Enhance the "feed" experience with live updates

3. **Advanced Search with Vector Embeddings**
   - Integrate OpenAI embeddings for semantic search
   - Allow users to search by concept, not just keywords
   - Implement similarity search for "companies like X"

4. **Analytics Dashboard**
   - Build an internal dashboard to track API usage
   - Monitor cache hit rates and popular endpoints
   - Track trending score distribution over time

5. **GraphQL API Layer**
   - Add GraphQL endpoint alongside REST
   - Allow clients to query exactly the data they need
   - Reduce over-fetching and improve performance

6. **Enhanced Co-Investor Analysis**
   - Build more sophisticated syndication pattern detection
   - Identify investment clusters and networks
   - Visualize investor relationships with graph algorithms

7. **API Documentation with Swagger/OpenAPI**
   - Auto-generate interactive API documentation
   - Provide try-it-now functionality
   - Improve developer experience

These additions would significantly enhance the platform's capabilities while maintaining the solid foundation already established.
