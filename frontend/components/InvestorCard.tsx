"use client";

import Link from "next/link";
import { MapPin, Briefcase, TrendingUp } from "lucide-react";
import type { Investor } from "@/types";
import { motion } from "framer-motion";
import EntityLogo from "./EntityLogo";

function formatAUM(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(0)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  return `$${amount.toLocaleString()}`;
}

function formatCheckSize(amount: number): string {
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount}`;
}

const typeColors: Record<string, string> = {
  "VC": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Angel": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Corporate": "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export default function InvestorCard({ investor }: { investor: Investor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/investors/${investor.slug}`}
        className="group card card-hover block p-5 rounded-xl border border-gray-200 bg-white"
      >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <EntityLogo name={investor.name} logoUrl={investor.logo_url} className="h-12 w-12 rounded-xl" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 truncate transition-colors group-hover:text-emerald-600">
              {investor.name}
            </h3>
            <span className={`badge ${typeColors[investor.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
              {investor.type}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {investor.bio}
          </p>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-gray-500" />
              {investor.portfolio_count} portfolio
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
              {formatAUM(investor.aum)} AUM
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              {investor.location}
            </span>
          </div>

          {/* Focus Areas */}
          {investor.sector_focus && investor.sector_focus.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {investor.sector_focus.slice(0, 3).map((sector) => (
                <span key={sector} className="badge bg-gray-50 text-gray-600 border border-gray-200">
                  {sector}
                </span>
              ))}
              {investor.sector_focus.length > 3 && (
                <span className="badge bg-gray-50 text-gray-500">
                  +{investor.sector_focus.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
