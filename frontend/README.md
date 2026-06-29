# GraphOne Frontend

The frontend for GraphOne - the intelligence layer for the AI economy. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- Pixel-perfect UI for 5 key screens (Companies, Company Detail, Investors, Investor Profile, Products)
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Reusable component library (Cards, Buttons, Tags)
- Real-time search and filtering
- Interactive data visualizations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── companies/          # Company pages
│   ├── investors/          # Investor pages
│   ├── products/           # Products page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
│   ├── CompanyCard.tsx
│   ├── InvestorCard.tsx
│   ├── ProductCard.tsx
│   ├── Navbar.tsx
│   └── Section.tsx
├── lib/                    # Utilities and data
│   ├── data.ts            # Mock data
│   └── utils.ts
├── types/                  # TypeScript types
│   └── index.ts
└── tailwind.config.ts      # Tailwind configuration
```

## Pages

### 1. AI Companies Home (`/`)
- Hero section with search
- Trending companies
- Fastest growing companies
- Emerging startups
- Browse by category
- All companies with filters

### 2. Company Detail (`/companies/[slug]`)
- Company overview with key metrics
- Funding history timeline
- Products showcase
- Team/founders
- News coverage
- Similar companies

### 3. Investors Discovery (`/investors`)
- Investor search and filters
- Most active investors
- Type-based filtering (VC, Angel, Corporate)
- Sector-based filtering

### 4. Investor Profile (`/investors/[slug]`)
- Investor overview and metrics
- Stage and sector focus
- Portfolio concentration
- Portfolio companies
- Recent investments

### 5. AI Products (`/products`)
- Product discovery
- Category filtering (Chat, Code, Image, Video, Audio)
- Popular products
- Upvotes and launch dates

## Deployment

### Vercel

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy automatically on push to main branch

### Environment Variables

No environment variables required for the frontend (currently using mock data). When connecting to the backend API, add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## What's Next

- Connect to backend API endpoints
- Implement real-time data fetching
- Add user authentication
- Build user dashboard
- Add dark mode toggle
- Implement keyboard shortcuts for search
