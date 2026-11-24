"use client";

import Link from "@/i18n/link";
import { ChevronRight } from "lucide-react";
import { useT } from "@/i18n/provider";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const t = useT().chrome.breadcrumbs;
  const all: Crumb[] = [{ label: t.home, href: "/" }, ...items];
  return (
    <nav aria-label={t.label} className={`t-small text-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-cocoa hover:underline underline-offset-4">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-cocoa" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
