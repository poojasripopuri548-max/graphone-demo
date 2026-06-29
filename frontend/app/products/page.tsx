"use client";

import { useState, useMemo } from "react";
import { Package, TrendingUp, MessageSquare, Code, Image, Video, Music, Sparkles, ArrowRight, ThumbsUp, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import EntityLogo from "@/components/EntityLogo";
import { products, getCompanyById } from "@/lib/data";

const categoryIcons: Record<string, LucideIcon> = {
  Chat: MessageSquare,
  Code: Code,
  Image: Image,
  Video: Video,
  Audio: Music,
};

const categoryColors: Record<string, string> = {
  Chat: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Code: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Image: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Video: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Audio: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const categories = ["All", "Chat", "Code", "Image", "Video", "Audio"];

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    if (sortBy === "popular") result.sort((a, b) => b.upvotes - a.upvotes);
    else if (sortBy === "newest") result.sort((a, b) => new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime());
    return result;
  }, [activeCategory, sortBy]);

  const popularNow = useMemo(() => [...products].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5), []);
  const mostLiked = useMemo(() => [...products].sort((a, b) => b.upvotes - a.upvotes).slice(0, 8), []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5 p-8 md:p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">
              AI Product Discovery
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            AI{" "}
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-6">
            Discover the best AI products across Chat, Code, Image, Video, and Audio categories.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-2xl font-bold text-white">{products.length}</span>
              <span className="text-gray-400">Products</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-2xl font-bold text-white">{products.reduce((s, p) => s + p.upvotes, 0).toLocaleString()}</span>
              <span className="text-gray-400">Total Upvotes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Right Now */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Popular Right Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {popularNow.map((p) => {
            const company = getCompanyById(p.company_id);
            const Icon = categoryIcons[p.category] || Package;
            return (
              <div key={p.id} className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3 h-3 text-gray-400" />
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryColors[p.category] || "bg-white/5 text-gray-400"}`}>{p.category}</span>
                </div>
                <div className="text-sm font-medium truncate">{p.name}</div>
                {company && <div className="text-xs text-gray-500 truncate">{company.name}</div>}
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <ThumbsUp className="w-3 h-3" />{p.upvotes.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Products</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-pink-500/50"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat !== "All" ? (categoryIcons[cat] || Package) : null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const company = getCompanyById(product.company_id);
          const Icon = categoryIcons[product.category] || Package;
          return (
            <div key={product.id} className="group p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <EntityLogo name={product.name} logoUrl={product.logo_url || company?.logo_url} className="h-10 w-10 rounded-xl" textClassName="text-xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold truncate group-hover:text-pink-400 transition-colors">{product.name}</h3>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryColors[product.category] || "bg-white/5 text-gray-400"}`}>{product.category}</span>
                  </div>
                  {company && (
                    <Link href={`/companies/${company.slug}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                      {company.name}
                    </Link>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{product.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 text-pink-400" />
                  <span className="text-pink-400 font-medium">{product.upvotes.toLocaleString()}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(product.launch_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No products match your filters.</div>
      )}
    </div>
  );
}
