"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LANG_KEY, localeNames, localeShort, locales, splitLocale, type Locale } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/provider";

/** Same page, other language. A full navigation keeps it simple: cart and wishlist live in localStorage. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const { rest } = splitLocale(usePathname() ?? "/");

  const go = (e: React.MouseEvent<HTMLAnchorElement>, l: Locale) => {
    e.preventDefault();
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* storage blocked: the URL still carries the language */
    }
    window.location.href = `/${l}${rest === "/" ? "" : rest}${window.location.search}${window.location.hash}`;
  };

  return (
    <details className={`group relative ${className}`}>
      <summary
        className="flex h-11 cursor-pointer list-none items-center gap-1 rounded-full px-3 text-[0.85rem] transition-colors hover:bg-linen [&::-webkit-details-marker]:hidden"
        aria-label={t.chrome.header.language}
      >
        {localeShort[locale]}
        <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="anim-drop absolute right-0 top-full z-10 mt-1 w-44 rounded-xl border border-line bg-ivory p-1.5 text-sm shadow-lg">
        {locales.map((l) => (
          <li key={l}>
            <a
              href={`/${l}${rest === "/" ? "" : rest}`}
              hrefLang={l}
              lang={l}
              onClick={(e) => go(e, l)}
              aria-current={l === locale ? "true" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-linen ${
                l === locale ? "bg-linen" : ""
              }`}
            >
              {localeNames[l]}
              {l === locale && <span className="sr-only">({t.chrome.header.selected})</span>}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
