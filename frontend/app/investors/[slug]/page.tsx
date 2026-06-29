"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Building2, DollarSign, Briefcase, MapPin, Target, Layers, TrendingUp, Users, ExternalLink, Globe, Shield } from "lucide-react";
import Link from "next/link";
import EntityLogo from "@/components/EntityLogo";
import { getInvestorBySlug, fundingRounds, companies, getCompanyById } from "@/lib/data";
import { useState } from "react";

function formatAUM(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(0)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  return `$${amount}`;
}

export default function InvestorDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const investor = getInvestorBySlug(slug);

  if (!investor) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Investor Not Found</h2>
        <p className="text-gray-400 mb-4">The investor you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/investors" className="text-indigo-400 hover:text-indigo-300">← Back to investors</Link>
      </div>
    );
  }

  // Get portfolio companies (those where this investor led a round)
  const portfolio = fundingRounds
    .filter(r => r.lead_investor_id === investor.id)
    .map(r => getCompanyById(r.company_id))
    .filter(Boolean);

  const sectorDistribution = investor.sector_focus.map((sector, i) => ({
    sector,
    percentage: Math.round(100 / investor.sector_focus.length * (investor.sector_focus.length - i)),
  }));

  return (
    <div className="space-y-6">
      <Link href="/investors" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Investors
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <EntityLogo name={investor.name} logoUrl={investor.logo_url} className="h-20 w-20 rounded-2xl" textClassName="text-xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{investor.name}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
              investor.type === "VC" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
              investor.type === "Angel" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            }`}>{investor.type}</span>
          </div>
          <p className="text-gray-400 mb-4">{investor.bio}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{investor.location}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatAUM(investor.aum)} AUM</span>
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />Fund {investor.fund_number}</span>
            <span className="flex items-center gap-1"><Target className="w-4 h-4" />${(investor.avg_check_size / 1e6).toFixed(0)}M avg check</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Portfolio Companies</div>
          <div className="text-2xl font-bold text-indigo-400">{investor.portfolio_count}</div>
          <div className="text-[10px] text-gray-500 mt-1">Across all funds</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">AUM</div>
          <div className="text-2xl font-bold">{formatAUM(investor.aum)}</div>
          <div className="text-[10px] text-gray-500 mt-1">Assets under management</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Avg Check Size</div>
          <div className="text-2xl font-bold text-cyan-400">${(investor.avg_check_size / 1e6).toFixed(0)}M</div>
          <div className="text-[10px] text-gray-500 mt-1">Per investment</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Fund</div>
          <div className="text-2xl font-bold text-purple-400">#{investor.fund_number}</div>
          <div className="text-[10px] text-gray-500 mt-1">Current fund</div>
        </div>
      </div>

      {/* Investment Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stage Focus */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Stage Focus
          </h3>
          <div className="flex flex-wrap gap-2">
            {investor.stage_focus.map((stage) => (
              <span key={stage} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {stage}
              </span>
            ))}
          </div>
        </div>

        {/* Sector Focus */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            Sector Focus
          </h3>
          <div className="flex flex-wrap gap-2">
            {investor.sector_focus.map((sector) => (
              <span key={sector} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {sector}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Concentration */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Portfolio Concentration
        </h3>
        <div className="space-y-3">
          {sectorDistribution.map((item) => (
            <div key={item.sector} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">{item.sector}</span>
                <span className="text-gray-500">{item.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Companies */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          Portfolio Companies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {portfolio.map((c) => c && (
            <Link key={c.id} href={`/companies/${c.slug}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <EntityLogo name={c.name} className="h-8 w-8 rounded-lg" textClassName="text-xs" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-xs text-gray-400">{c.category} · {c.stage}</div>
              </div>
              <span className="text-emerald-400 text-xs font-medium">{c.growth_score}</span>
            </Link>
          ))}
          {portfolio.length === 0 && <div className="col-span-full text-gray-500 text-sm">No portfolio companies found.</div>}
        </div>
      </div>

      {/* Recent Investments */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Investments</h3>
        <div className="space-y-3">
          {fundingRounds.filter(r => r.lead_investor_id === investor.id).slice(0, 5).map((round) => {
            const company = getCompanyById(round.company_id);
            return company ? (
              <div key={round.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <EntityLogo name={company.name} logoUrl={company.logo_url} className="h-8 w-8 rounded-lg" textClassName="text-xs" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{company.name}</div>
                  <div className="text-xs text-gray-400">{round.round_type} · {new Date(round.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${(round.amount / 1e6).toFixed(0)}M</div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
