"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Section from "@/components/Section";
import StatsCard from "@/components/StatsCard";
import CompanyCard from "@/components/CompanyCard";
import { fetchCompanies } from "@/lib/api";
import type { Company } from "@/lib/types";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchCompanies()
      .then((data) => {
        if (active) setCompanies(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const trending = useMemo(
    () =>
      [...companies]
        .sort((a, b) => b.growth_score - a.growth_score)
        .slice(0, 4),
    [companies]
  );

  const totalFunding = useMemo(
    () => companies.reduce((sum, c) => sum + c.funding_amount, 0),
    [companies]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-4 pt-20 text-center">
        <Image
          src="/graphone-logo.svg"
          alt="GraphOne logo"
          width={64}
          height={64}
          priority
          className="mx-auto"
        />
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The directory of the world&apos;s top AI companies
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
          GraphOne tracks funding, growth, and momentum across the companies
          building the future of artificial intelligence.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-10 sm:grid-cols-3">
        <StatsCard label="Companies tracked" value={`${companies.length}`} />
        <StatsCard
          label="Total funding"
          value={`$${(totalFunding / 1_000_000_000).toFixed(1)}B`}
        />
        <StatsCard
          label="Categories"
          value={`${new Set(companies.map((c) => c.category)).size}`}
        />
      </section>

      {loading ? (
        <p className="py-20 text-center text-zinc-500">Loading companies…</p>
      ) : (
        <>
          <Section
            id="trending"
            title="Trending now"
            subtitle="Highest growth scores across the directory"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((company) => (
                <CompanyCard key={company.slug} company={company} />
              ))}
            </div>
          </Section>

          <Section
            id="companies"
            title="All companies"
            subtitle={`${companies.length} companies in the directory`}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.slug} company={company} />
              ))}
            </div>
          </Section>
        </>
      )}

      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        Built with GraphOne · Next.js + Express
      </footer>
    </div>
  );
}
