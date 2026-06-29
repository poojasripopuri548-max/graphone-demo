"use client";

import { useState } from "react";
import Image from "next/image";
import type { Company } from "@/lib/types";

function formatFunding(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

function faviconFromWebsite(website: string): string {
  try {
    const domain = new URL(website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
  }
}

export default function CompanyCard({ company }: { company: Company }) {
  const fallbackLogo = faviconFromWebsite(company.website);
  // 0 = company.logo_url, 1 = favicon fallback, 2 = initial-letter avatar
  const [logoStage, setLogoStage] = useState<0 | 1 | 2>(
    company.logo_url ? 0 : fallbackLogo ? 1 : 2
  );
  const logoSrc =
    logoStage === 0 ? company.logo_url : logoStage === 1 ? fallbackLogo : "";

  const handleLogoError = () => {
    setLogoStage((stage) => (stage === 0 && fallbackLogo ? 1 : 2));
  };

  return (
    <a
      href={company.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-indigo-400/50 hover:bg-white/[0.06]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white">
          {logoSrc ? (
            <Image
              key={logoSrc}
              src={logoSrc}
              alt={`${company.name} logo`}
              width={48}
              height={48}
              className="h-full w-full object-contain p-1.5"
              onError={handleLogoError}
              unoptimized
            />
          ) : (
            <span className="text-lg font-semibold text-zinc-900">
              {company.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">{company.name}</h3>
          <p className="truncate text-xs text-zinc-400">{company.category}</p>
        </div>
        <span className="ml-auto rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-300">
          {company.growth_score}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-zinc-400">
        {company.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span>{company.stage}</span>
        <span>·</span>
        <span>{company.headquarters}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
        <div>
          <p className="text-sm font-semibold text-white">
            {formatFunding(company.funding_amount)}
          </p>
          <p className="text-[11px] text-zinc-500">Funding</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {company.employee_count.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500">Employees</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {company.founded_year}
          </p>
          <p className="text-[11px] text-zinc-500">Founded</p>
        </div>
      </div>
    </a>
  );
}
