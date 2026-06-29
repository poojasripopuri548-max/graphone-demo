"use client";

import { useMemo, useState } from "react";
import { Search, Zap, Filter, ChevronRight, Sparkles, TrendingUp, Users, Package, Newspaper } from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import EntityLogo from "@/components/EntityLogo";
import Section from "@/components/Section";
import { companies, investors, products, news } from "@/lib/data";
import type { Company } from "@/types";
import Link from "next/link";

const categories = ["AI Agents", "AI Coding", "AI Search", "AI Video", "AI Infrastructure", "AI Image", "AI Audio", "AI Research", "Robotics AI", "Healthcare AI"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");

  const filtered = useMemo(() => {
    let result = [...companies];
    if (activeCategory !== "All") result = result.filter((c) => c.category === activeCategory);
    if (searchQuery) result = result.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === "trending") result.sort((a, b) => b.growth_score - a.growth_score);
    else if (sortBy === "funded") result.sort((a, b) => b.funding_total - a.funding_total);
    else if (sortBy === "new") result.sort((a, b) => b.founded_year - a.founded_year);
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [activeCategory, sortBy, searchQuery]);

  const trending = useMemo(() => [...companies].sort((a, b) => b.growth_score - a.growth_score).slice(0, 5), []);
  const fastestGrowing = useMemo(() => [...companies].sort((a, b) => b.employee_count - a.employee_count).slice(0, 5), []);
  const emerging = useMemo(() => companies.filter((c) => c.stage === "Early Stage" || c.stage === "Seed").sort((a, b) => b.growth_score - a.growth_score).slice(0, 5), []);
  const latestNews = useMemo(() => [...news].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 3), []);

  return (
    <div className="space-y-12 pb-12">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 via-transparent to-cyan-50 p-8 md:p-16">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            GraphOne Intelligence Layer
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Discover the world&apos;s most innovative{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              AI companies
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
            Explore startups, investors, products, and the latest AI headlines in one place.
          </p>

          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies, categories, investors, or news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card card-hover rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Trending companies</span>
          </div>
          <p className="mt-4 text-4xl font-bold text-gray-900">{companies.length}</p>
          <p className="text-sm text-gray-600 mt-1">Tracked across AI infrastructure, models, and tooling.</p>
        </div>
        <div className="card card-hover rounded-2xl p-5">
          <div className="flex items-center gap-2 text-cyan-600">
            <Users className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Active investors</span>
          </div>
          <p className="mt-4 text-4xl font-bold text-gray-900">{investors.length}</p>
          <p className="text-sm text-gray-600 mt-1">Venture, angel, and corporate groups closing deals.</p>
        </div>
        <div className="card card-hover rounded-2xl p-5">
          <div className="flex items-center gap-2 text-amber-600">
            <Newspaper className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Fresh news</span>
          </div>
          <p className="mt-4 text-4xl font-bold text-gray-900">{news.length}</p>
          <p className="text-sm text-gray-600 mt-1">Real-time updates for the AI ecosystem.</p>
        </div>
      </div>

      <div className="card rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Featured company logos</h2>
            <p className="text-sm text-gray-600 mt-1">A quick visual snapshot of the brands shaping AI.</p>
          </div>
          <Link href="/companies/" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {companies.slice(0, 6).map((company) => (
            <Link key={company.id} href={`/companies/${company.slug}`} className="card-hover flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <EntityLogo name={company.name} logoUrl={company.logo_url} className="h-11 w-11 rounded-lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{company.name}</p>
                <p className="truncate text-xs text-gray-500">{company.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Section
        title="Trending AI Companies"
        description="The most watched AI companies right now."
        action={<Link href="/companies/" className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">View all <ChevronRight className="h-4 w-4" /></Link>}
      >
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {trending.map((company, index) => (
            <TrendingCard key={company.id} company={company} rank={index + 1} />
          ))}
        </div>
      </Section>

      <Section
        title="Fastest Growing"
        description="Companies showing strong momentum across growth signals."
        action={<Link href="/companies/" className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">View all <ChevronRight className="h-4 w-4" /></Link>}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {fastestGrowing.map((company) => (
            <GrowthCard key={company.id} company={company} />
          ))}
        </div>
      </Section>

      <Section
        title="Latest AI News"
        description="The newest stories from the industry."
        action={<Link href="/news" className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300">Open news <ChevronRight className="h-4 w-4" /></Link>}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {latestNews.map((article) => {
            const company = companies.find((item) => item.id === article.related_company_ids[0]);
            return (
              <Link key={article.id} href={article.url} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  {company ? <EntityLogo name={company.name} logoUrl={company.logo_url} className="h-10 w-10 rounded-lg" /> : <Newspaper className="h-5 w-5 text-amber-600" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-500">{company?.name ?? article.source}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section
        title="Browse by Category"
        description="Explore companies by what they are building."
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat} category={cat} count={companies.filter((c) => c.category === cat).length} />
          ))}
        </div>
      </Section>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900">All Companies</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="card rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="trending">Trending</option>
              <option value="funded">Most Funded</option>
              <option value="new">Newest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card rounded-2xl py-16 text-center text-gray-500">No companies match your filters. Try a different combination.</div>
        )}
      </div>
    </div>
  );
}

function TrendingCard({ company, rank }: { company: Company; rank: number }) {
  return (
    <Link href={`/companies/${company.slug}`} className="group block">
      <div className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md">
        <div className="absolute right-3 top-3 text-xs font-bold text-emerald-600">#{rank}</div>
        <EntityLogo name={company.name} logoUrl={company.logo_url} className="mb-3 h-12 w-12 rounded-xl" />
        <h3 className="mb-1 text-base font-semibold text-gray-900 transition group-hover:text-emerald-600">{company.name}</h3>
        <p className="mb-2 text-xs text-gray-600">{company.category}</p>
        <p className="line-clamp-2 text-xs text-gray-500">{company.description}</p>
        <div className="mt-3 text-xs text-gray-600">
          <span className="font-medium text-emerald-600">{company.growth_score}</span> trending score
        </div>
      </div>
    </Link>
  );
}

function GrowthCard({ company }: { company: Company }) {
  const bars = [38, 54, 46, 68, 59, 82, 74].map((base, index) => {
    const offset = (company.growth_score + company.employee_count + index * 13) % 18;
    return Math.min(96, base + offset);
  });

  return (
    <Link href={`/companies/${company.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-300 hover:bg-gray-100">
        <div className="mb-3 flex items-center gap-3">
          <EntityLogo name={company.name} logoUrl={company.logo_url} className="h-10 w-10 rounded-lg" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 transition group-hover:text-emerald-600">{company.name}</h3>
            <p className="text-xs text-gray-600">{company.category}</p>
          </div>
        </div>
        <div className="flex h-8 items-end gap-1">
          {bars.map((height, i) => (
            <div key={i} className="flex-1 rounded-t bg-emerald-500/20" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({ category, count }: { category: string; count: number }) {
  return (
    <Link href="#" className="group block rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-300 hover:bg-gray-100">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-cyan-100">
        <Zap className="h-5 w-5 text-emerald-600" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-900 transition group-hover:text-emerald-600">{category}</h3>
      <p className="text-xs text-gray-600">{count} companies</p>
    </Link>
  );
}
