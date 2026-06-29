"use client";

import Link from "next/link";
import { ExternalLink, ThumbsUp, Calendar } from "lucide-react";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import EntityLogo from "./EntityLogo";

function formatUpvotes(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

const categoryColors: Record<string, string> = {
  "Chat": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Code": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Image": "bg-pink-50 text-pink-700 border-pink-200",
  "Video": "bg-rose-50 text-rose-700 border-rose-200",
  "Audio": "bg-violet-50 text-violet-700 border-violet-200",
  "Data": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Other": "bg-gray-50 text-gray-700 border-gray-200",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={product.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group card card-hover block p-5 rounded-xl border border-gray-200 bg-white"
      >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <EntityLogo name={product.name} logoUrl={product.logo_url} className="h-12 w-12 rounded-xl" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 truncate transition-colors group-hover:text-emerald-600">
              {product.name}
            </h3>
            <ExternalLink className="w-3 h-3 text-gray-500 shrink-0" />
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`badge ${categoryColors[product.category] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
              {product.category}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-600">{formatUpvotes(product.upvotes)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(product.launch_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
