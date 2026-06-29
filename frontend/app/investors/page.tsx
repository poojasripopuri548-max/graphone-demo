"use client";

import { useState, useMemo } from "react";
import { Users, Search, Filter, TrendingUp, DollarSign, Briefcase, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import EntityLogo from "@/components/EntityLogo";
import { investors } from "@/lib/data";
import type { Investor } from "@/types";

function formatAUM(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(0)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  return `$${amount}`;
}

const typeColors: Record<string, string> = {
  VC: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Angel: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Corporate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function InvestorsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");

  const types = ["All", "VC", "Angel", "Corporate"];
  const sectors = ["All", "AI", "Enterprise", "Consumer", "Fintech", "Health", "Security", "Climate", "Bio"];

  const filtered = useMemo(() => {
    let result = [...investors];
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.bio.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "All") result = result.filter(i => i.type === typeFilter);
    if (sectorFilter !== "All") result = result.filter(i => i.sector_focus.includes(sectorFilter));
    return result;
  }, [search, typeFilter, sectorFilter]);

  const mostActive = useMemo(() => [...investors].sort((a, b) => b.portfolio_count - a.portfolio_count).slice(0, 5), []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 p-8 md:p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Investor Intelligence
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            AI{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Investors
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-6">
            Track 6,000+ investors, their portfolios, investment thesis, and syndication patterns.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-2xl font-bold text-white">{investors.length}</span>
              <span className="text-gray-400">Investors</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-2xl font-bold text-white">{investors.filter(i => i.type === "VC").length}</span>
              <span className="text-gray-400">VC Firms</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-2xl font-bold text-white">${(investors.reduce((s, i) => s + i.aum, 0) / 1e9).toFixed(0)}B</span>
              <span className="text-gray-400">Combined AUM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Active */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Most Active Investors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {mostActive.map((inv) => (
            <Link key={inv.id} href={`/investors/${inv.slug}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <EntityLogo name={inv.name} logoUrl={inv.logo_url} className="h-8 w-8 rounded-lg" textClassName="text-xs" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{inv.name}</div>
                <div className="text-xs text-gray-400">{inv.portfolio_count} investments</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search investors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}>{t}</button>
          ))}
          <span className="w-px h-6 bg-white/10 mx-1 self-center" />
          {sectors.map((s) => (
            <button key={s} onClick={() => setSectorFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sectorFilter === s ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Investor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inv) => (
          <Link key={inv.id} href={`/investors/${inv.slug}`} className="group p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
            <div className="flex items-start gap-4">
              <EntityLogo name={inv.name} logoUrl={inv.logo_url} className="h-12 w-12 rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">{inv.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${typeColors[inv.type] || ""}`}>{inv.type}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{inv.bio}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {inv.sector_focus.slice(0, 3).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-400">{s}</span>
                  ))}
                  {inv.sector_focus.length > 3 && <span className="text-[10px] text-gray-500">+{inv.sector_focus.length - 3}</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatAUM(inv.aum)} AUM</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{inv.portfolio_count} companies</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{inv.location.split(",")[0]}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No investors match your filters.</div>
      )}
    </div>
  );
}
