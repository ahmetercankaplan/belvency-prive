"use client";

import Link from "@/i18n/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { Price } from "@/components/ui/Price";
import { defaultOption, priceFor } from "@/lib/catalog";
import { fmt, withLocale } from "@/i18n/config";
import { useCatalog } from "@/i18n/use-catalog";
import { useLocale, useT } from "@/i18n/provider";
import { useUI } from "@/lib/ui-store";
import { ProductImage } from "@/components/ui/ProductImage";

function SearchBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const t = useT().chrome.search;
  const locale = useLocale();
  const { getBrand, search } = useCatalog();
  const [q, setQ] = useState("");
  const trimmed = q.trim();
  const results = trimmed.length >= 2 ? search(trimmed) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onClose();
    router.push(withLocale(locale, `/kataloq?q=${encodeURIComponent(trimmed)}`));
  };

  return (
    <div className="container-x w-full max-w-[60rem] py-6 md:py-10">
      <form onSubmit={submit} role="search" className="relative pr-12">
        <label htmlFor="site-search" className="sr-only">
          {t.label}
        </label>
        <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id="site-search"
          data-autofocus
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.placeholder}
          className="w-full border-0 border-b border-sand bg-transparent py-3 pl-9 font-display text-[1.6rem] font-light outline-none placeholder:text-muted/70 focus-visible:border-gold-deep md:text-[2.2rem]"
        />
      </form>

      <div className="mt-7" aria-live="polite">
        {trimmed.length < 2 ? (
          <div>
            <p className="t-small text-muted">{t.popular}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border border-sand px-4 py-2 text-sm transition-colors hover:border-garnet hover:bg-garnet hover:text-ivory"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <div className="py-6">
            <p className="t-h3">{fmt(t.noResults, { q: trimmed })}</p>
            <p className="mt-2 max-w-[44ch] text-muted">{t.noResultsHint}</p>
            <Link href="/kataloq" onClick={onClose} className="link-u mt-4 inline-block text-sm font-medium">
              {t.viewCatalog}
            </Link>
          </div>
        ) : (
          <>
            <p className="t-small text-muted">{fmt(t.results, { n: results.length })}</p>
            <ul className="mt-3 divide-y divide-line">
              {results.slice(0, 6).map((p) => {
                const pr = priceFor(p, defaultOption(p));
                return (
                  <li key={p.id}>
                    <Link href={`/mehsul/${p.slug}`} onClick={onClose} className="flex items-center gap-4 py-3 transition-colors hover:bg-linen/60">
                      <span className="block w-14 shrink-0 overflow-hidden">
                        <ProductImage product={p} className="aspect-[4/5] w-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="t-small block text-muted">{getBrand(p.brandSlug)?.name}</span>
                        <span className="block truncate font-display text-lg font-medium">{p.title}</span>
                      </span>
                      <Price price={pr.price} salePrice={pr.salePrice} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            {results.length > 6 && (
              <button type="button" onClick={submit} className="link-u mt-4 text-sm font-medium">
                {fmt(t.viewAll, { n: results.length })}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function SearchOverlay() {
  const { panel, closePanel } = useUI();
  const t = useT().chrome.search;
  const open = panel === "search";
  return (
    <Overlay open={open} onClose={closePanel} label={t.title} side="top" className="items-center">
      {/* remounts on each open so the field starts empty */}
      <SearchBody onClose={closePanel} />
    </Overlay>
  );
}
