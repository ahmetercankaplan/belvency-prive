"use client";

import Link from "@/i18n/link";
import { site } from "@/data/site";
import { fmt } from "@/i18n/config";
import { useT } from "@/i18n/provider";

/** Small arch outline — the house's window. */
export function ArchMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} focusable="false">
      <path d="M4.5 21V11a7.5 7.5 0 0 1 15 0v10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 21v-9a3 3 0 0 1 6 0v9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}

export function Logo({ tone = "dark", stacked = true }: { tone?: "dark" | "light"; stacked?: boolean }) {
  const t = useT().chrome;
  const aria = fmt(t.homeAria, { name: site.fullName });
  const light = tone === "light";
  const color = light ? "text-ivory" : "text-cocoa";
  const accent = light ? "text-champagne" : "text-gold-deep";

  if (!stacked) {
    return (
      <Link href="/" aria-label={aria} className={`inline-flex items-center gap-2.5 ${color}`}>
        <ArchMark className={`h-6 w-6 ${light ? "text-champagne" : "text-gold"}`} />
        <span className="font-display text-[1.3rem] font-medium leading-none tracking-[0.26em]">{site.name}</span>
        <span className={`font-display text-[1rem] italic leading-none ${accent}`}>{site.descriptor}</span>
      </Link>
    );
  }

  return (
    <Link href="/" aria-label={aria} className={`inline-flex flex-col items-center ${color}`}>
      <span className="pl-[0.26em] font-display text-[1.2rem] font-medium leading-none tracking-[0.26em] sm:text-[1.45rem] md:text-[1.6rem] md:tracking-[0.3em] md:pl-[0.3em]">
        {site.name}
      </span>
      <span className={`mt-1.5 flex items-center gap-2 font-display text-[0.8rem] italic leading-none md:text-[0.9rem] ${accent}`}>
        <span aria-hidden="true" className="h-px w-4 bg-gold/70 md:w-6" />
        {site.descriptor}
        <span aria-hidden="true" className="h-px w-4 bg-gold/70 md:w-6" />
      </span>
    </Link>
  );
}
