"use client";

import { useMemo, useState } from "react";
import { Search, Filter, ArrowLeft } from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import { companies } from "@/lib/data";
import Link from "next/link";

const categories = ["AI Agents", "AI Coding", "AI Search", "AI Video", "AI Infrastructure", "AI Image", "AI Audio", "AI Research", "Robotics AI", "Healthcare AI"];

export default function CompaniesPage() {
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold">All AI Companies</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === "All"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{filtered.length} companies</p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 outline-none focus:border-emerald-500/50"
          >
            <option value="trending">Trending</option>
            <option value="funded">Most Funded</option>
            <option value="new">Newest</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No companies found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
