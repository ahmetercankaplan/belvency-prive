"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { Price } from "@/components/ui/Price";
import { getBrand } from "@/data/brands";
import { defaultOption, priceFor, searchProducts } from "@/lib/catalog";
import { useUI } from "@/lib/ui-store";
import { ProductImage } from "@/components/ui/ProductImage";

const SUGGESTIONS = ["ətir", "qolbaq", "çanta", "saat", "mirvari", "hədiyyə"];

function SearchBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const trimmed = q.trim();
  const results = trimmed.length >= 2 ? searchProducts(trimmed) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onClose();
    router.push(`/kataloq?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="container-x w-full max-w-[60rem] py-6 md:py-10">
      <form onSubmit={submit} role="search" className="relative pr-12">
        <label htmlFor="site-search" className="sr-only">
          Məhsul, brend və ya kateqoriya axtar
        </label>
        <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id="site-search"
          data-autofocus
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ətir, qolbaq, çanta, brend…"
          className="w-full border-0 border-b border-sand bg-transparent py-3 pl-9 font-display text-[1.6rem] font-light outline-none placeholder:text-muted/70 focus-visible:border-gold-deep md:text-[2.2rem]"
        />
      </form>

      <div className="mt-7" aria-live="polite">
        {trimmed.length < 2 ? (
          <div>
            <p className="t-small text-muted">Tez-tez axtarılanlar</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
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
            <p className="t-h3">“{trimmed}” üçün nəticə tapılmadı</p>
            <p className="mt-2 max-w-[44ch] text-muted">
              Yazılışı yoxlayın və ya daha ümumi söz yazın, məsələn “ətir” və ya “çanta”.
            </p>
            <Link href="/kataloq" onClick={onClose} className="link-u mt-4 inline-block text-sm font-medium">
              Bütün kataloqa bax
            </Link>
          </div>
        ) : (
          <>
            <p className="t-small text-muted">{results.length} nəticə</p>
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
                Bütün {results.length} nəticəyə bax
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
  const open = panel === "search";
  return (
    <Overlay open={open} onClose={closePanel} label="Axtarış" side="top" className="items-center">
      {/* remounts on each open so the field starts empty */}
      <SearchBody onClose={closePanel} />
    </Overlay>
  );
}
