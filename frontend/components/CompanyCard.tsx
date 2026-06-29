"use client";

import Link from "next/link";
import { MapPin, TrendingUp, DollarSign, Users } from "lucide-react";
import type { Company } from "@/types";
import { motion } from "framer-motion";
import EntityLogo from "./EntityLogo";

function formatFunding(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount}`;
}

const stageColors: Record<string, string> = {
  "Seed": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Early Stage": "bg-blue-50 text-blue-700 border-blue-200",
  "Growth": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Late Stage": "bg-purple-50 text-purple-700 border-purple-200",
  "Public": "bg-orange-50 text-orange-700 border-orange-200",
};

const categoryColors: Record<string, string> = {
  "Large Language Models": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Infrastructure": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Image Generation": "bg-pink-50 text-pink-700 border-pink-200",
  "Video Generation": "bg-rose-50 text-rose-700 border-rose-200",
  "Code Generation": "bg-green-50 text-green-700 border-green-200",
  "AI Search": "bg-sky-50 text-sky-700 border-sky-200",
  "Audio Generation": "bg-violet-50 text-violet-700 border-violet-200",
  "Conversational AI": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Research": "bg-gray-50 text-gray-700 border-gray-200",
  "Defense AI": "bg-red-50 text-red-700 border-red-200",
  "Robotics AI": "bg-amber-50 text-amber-700 border-amber-200",
  "Healthcare AI": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Agents": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "Legal AI": "bg-slate-50 text-slate-700 border-slate-200",
  "3D Generation": "bg-orange-50 text-orange-700 border-orange-200",
  "Productivity": "bg-lime-50 text-lime-700 border-lime-200",
  "Content Generation": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/companies/${company.slug}`}
        className="group card card-hover block p-5 rounded-xl border border-gray-200 bg-white"
      >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <EntityLogo name={company.name} logoUrl={company.logo_url} className="h-12 w-12 rounded-xl" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 truncate transition-colors group-hover:text-emerald-600">
              {company.name}
            </h3>
            {company.is_unicorn && (
              <span className="badge bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                UNICORN
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {company.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${categoryColors[company.category] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
              {company.category}
            </span>
            <span className={`badge ${stageColors[company.stage] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
              {company.stage}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              {company.hq_city}, {company.hq_country}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-gray-500" />
              {formatFunding(company.funding_total)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              {company.employee_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-600">{company.growth_score}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
