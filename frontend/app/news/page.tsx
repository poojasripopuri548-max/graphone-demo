"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, Newspaper, Search, Sparkles } from "lucide-react";
import { companies, news, getCompanyById } from "@/lib/data";

export default function NewsPage() {
  const [query, setQuery] = useState("");

  const filteredNews = useMemo(() => {
    const sorted = [...news].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    if (!query.trim()) return sorted;

    const q = query.toLowerCase();
    return sorted.filter((item) => {
      const company = getCompanyById(item.related_company_ids[0] ?? "");
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        company?.name.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400">
            <Newspaper className="h-3.5 w-3.5" />
            Trending AI News
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Follow the latest stories shaping the
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> AI economy</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Track product launches, funding rounds, partnerships, and breakthrough moments from the companies driving AI forward.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-2xl font-semibold text-white">{news.length}</span>
              <span className="ml-2 text-gray-400">Stories</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-2xl font-semibold text-white">{companies.length}</span>
              <span className="ml-2 text-gray-400">Tracked Companies</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 md:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news, sources, or companies..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-amber-500/50"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Brand logos in the news</h2>
            <p className="text-sm text-gray-400">Spotlight the companies behind the stories.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {companies.slice(0, 6).map((company) => (
            <div key={company.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain p-1.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{company.name}</p>
                <p className="truncate text-xs text-gray-500">{company.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredNews.map((article) => {
          const relatedCompany = getCompanyById(article.related_company_ids[0] ?? "");
          return (
            <article key={article.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-white/10 hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {relatedCompany?.logo_url ? (
                      <img src={relatedCompany.logo_url} alt={relatedCompany.name} className="h-full w-full object-contain p-1.5" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{article.source}</p>
                    <p className="text-sm font-medium text-white">{relatedCompany?.name ?? "AI ecosystem"}</p>
                  </div>
                </div>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
                  {article.tag}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white transition group-hover:text-amber-400">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">{article.summary}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-amber-400 transition hover:text-amber-300"
                >
                  Read story
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center text-gray-500">
          No news matched your search yet.
        </div>
      )}
    </div>
  );
}
