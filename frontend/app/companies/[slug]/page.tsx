"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Calendar, TrendingUp, Globe, ExternalLink, Clock, Award, Target, GitBranch } from "lucide-react";
import Link from "next/link";
import EntityLogo from "@/components/EntityLogo";
import { getCompanyBySlug, getProductsByCompany, getFundingByCompany, getFoundersByCompany, getNewsByCompany, getCompanyInvestors, companies } from "@/lib/data";
import { useState } from "react";

function formatFunding(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount}`;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const company = getCompanyBySlug(slug);
  const [activeTab, setActiveTab] = useState("overview");

  if (!company) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
        <p className="text-gray-400 mb-4">The company you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300">← Back to companies</Link>
      </div>
    );
  }

  const products = getProductsByCompany(company.id);
  const fundingRounds = getFundingByCompany(company.id);
  const founders = getFoundersByCompany(company.id);
  const news = getNewsByCompany(company.id);
  const investors = getCompanyInvestors(company.id);
  const similarCompanies = companies.filter(c => c.category === company.category && c.id !== company.id).slice(0, 4);
  const totalFunding = fundingRounds.reduce((sum, r) => sum + r.amount, 0);
  const latestRound = fundingRounds[0];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "funding", label: "Funding" },
    { id: "products", label: `Products (${products.length})` },
    { id: "team", label: `Team (${founders.length})` },
    { id: "news", label: `News (${news.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <EntityLogo name={company.name} logoUrl={company.logo_url} className="h-20 w-20 rounded-2xl" textClassName="text-xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            {company.is_unicorn && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-amber-400 to-rose-400 text-black">UNICORN</span>
            )}
          </div>
          <p className="text-gray-400 text-lg mb-4">{company.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{company.hq_city}, {company.hq_country}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Founded {company.founded_year}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatFunding(totalFunding)} raised</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{company.employee_count.toLocaleString()} employees</span>
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
              <Globe className="w-4 h-4" />Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Trending Score</div>
          <div className="text-2xl font-bold text-emerald-400">{company.growth_score}</div>
          <div className="text-[10px] text-gray-500 mt-1">Growth momentum</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Valuation</div>
          <div className="text-2xl font-bold">{formatFunding(company.valuation)}</div>
          <div className="text-[10px] text-gray-500 mt-1">Estimated</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Stage</div>
          <div className="text-2xl font-bold text-cyan-400">{company.stage}</div>
          <div className="text-[10px] text-gray-500 mt-1">{company.category}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-xs text-gray-500 mb-1">Data Confidence</div>
          <div className="text-2xl font-bold text-purple-400">{company.data_confidence_score}%</div>
          <div className="text-[10px] text-gray-500 mt-1">Entity completeness</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Latest Funding */}
            {latestRound && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Latest Funding Round</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{formatFunding(latestRound.amount)}</div>
                    <div className="text-sm text-gray-400">{latestRound.round_type} — {new Date(latestRound.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Investors */}
            {investors.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Key Investors</h3>
                <div className="flex flex-wrap gap-3">
                  {investors.map((inv) => (
                    <Link key={inv.id} href={`/investors/${inv.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <EntityLogo name={inv.name} className="h-6 w-6 rounded" textClassName="text-[10px]" />
                      <span className="text-sm text-gray-300">{inv.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Founders */}
            {founders.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Founders & Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {founders.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm">
                        {f.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{f.name}</div>
                        <div className="text-xs text-gray-400">{f.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Companies */}
            {similarCompanies.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Similar Companies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {similarCompanies.map((sc) => (
                    <Link key={sc.id} href={`/companies/${sc.slug}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <EntityLogo name={sc.name} className="h-8 w-8 rounded-lg" textClassName="text-xs" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{sc.name}</div>
                        <div className="text-xs text-gray-400">{sc.category}</div>
                      </div>
                      <span className="text-emerald-400 text-sm font-medium">{sc.growth_score}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "funding" && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Funding History</h3>
            <div className="space-y-4">
              {fundingRounds.map((round) => (
                <div key={round.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{round.round_type}</div>
                    <div className="text-sm text-gray-400">{new Date(round.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatFunding(round.amount)}</div>
                    <div className="text-xs text-gray-400">{round.currency}</div>
                  </div>
                </div>
              ))}
              {fundingRounds.length === 0 && <div className="text-gray-500 text-sm">No funding rounds recorded.</div>}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-start gap-3">
                  <EntityLogo name={product.name} logoUrl={product.logo_url} className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-400">{product.category}</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{product.upvotes.toLocaleString()} upvotes</span>
                      <span>Launched {new Date(product.launch_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="col-span-full text-gray-500 text-sm">No products listed.</div>}
          </div>
        )}

        {activeTab === "team" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {founders.map((f) => (
              <div key={f.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold">
                    {f.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-sm text-gray-400">{f.title}</div>
                    <div className="text-xs text-gray-500">{f.location}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-3 line-clamp-2">{f.bio}</p>
              </div>
            ))}
            {founders.length === 0 && <div className="col-span-full text-gray-500 text-sm">No team members listed.</div>}
          </div>
        )}

        {activeTab === "news" && (
          <div className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1">{article.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">{article.summary}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{article.source}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{article.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {news.length === 0 && <div className="text-gray-500 text-sm">No recent news.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
