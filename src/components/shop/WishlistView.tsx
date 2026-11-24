"use client";

import Link from "@/i18n/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { useCatalog } from "@/i18n/use-catalog";
import { fmt } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/provider";
import { shop, useHydrated, useShop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

/** Shared lists travel in the URL as ?s=p001,p004 — no account or backend needed. */
function parseShared(param: string | null, getProductById: (id: string) => Product | undefined): Product[] {
  if (!param) return [];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const id of param.split(",").slice(0, 24)) {
    const p = getProductById(id.trim());
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

export function WishlistView() {
  const hydrated = useHydrated();
  const t = useT().shop.wishlistPage;
  const { getProductById } = useCatalog();
  const { wishlist } = useShop();
  const { notify } = useUI();
  const locale = useLocale();
  const sp = useSearchParams();
  const shared = parseShared(sp.get("s"), getProductById);
  const [shareUrl, setShareUrl] = useState("");

  if (!hydrated) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4" aria-busy="true" aria-label={t.loading}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5]" />
            <div className="skeleton mt-4 h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const items = wishlist.map(getProductById).filter((p): p is Product => !!p);
  const missing = shared.filter((p) => !wishlist.includes(p.id));

  const share = async () => {
    const url = `${window.location.origin}/${locale}/sevimliler?s=${items.map((p) => p.id).join(",")}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      notify(t.copied);
    } catch {
      notify(t.copyBelow);
    }
  };

  const addShared = () => {
    missing.forEach((p) => shop.toggleWishlist(p.id));
    notify(fmt(t.addedShared, { n: missing.length }));
  };

  return (
    <>
      {shared.length > 0 && (
        <section className="mt-10 border border-sand bg-linen/60 p-6 md:p-8" aria-labelledby="shared-title">
          <h2 id="shared-title" className="t-h2">
            {t.sharedTitle}
          </h2>
          <p className="mt-2 text-muted">{fmt(t.sharedText, { n: shared.length })}</p>
          <ProductGrid products={shared} className="mt-8" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={addShared} disabled={missing.length === 0} className="btn btn-primary">
              {missing.length === 0 ? t.allInList : fmt(t.addAll, { n: missing.length })}
            </button>
            <Link href="/sevimliler" className="link-u text-sm">
              {t.closeShared}
            </Link>
          </div>
        </section>
      )}

      {items.length === 0 ? (
        shared.length === 0 && (
          <div className="mt-10 rounded-sm bg-linen px-6 py-20 text-center md:py-28">
            <p className="t-h2">{t.emptyTitle}</p>
            <p className="mx-auto mt-3 max-w-[42ch] text-muted">
              {t.emptyText}
            </p>
            <Link href="/kataloq" className="btn btn-primary mt-8">
              {t.toCatalog}
            </Link>
          </div>
        )
      ) : (
        <>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-muted" aria-live="polite">
              {fmt(t.count, { n: items.length })}
            </p>
            <button type="button" onClick={share} className="btn btn-ghost min-h-11 px-5 text-sm">
              <Link2 className="h-4 w-4" aria-hidden="true" />
              {t.share}
            </button>
          </div>

          {shareUrl && (
            <div className="anim-fade mt-4">
              <label htmlFor="share-url" className="mb-1.5 block text-sm text-muted">
                {t.shareLabel}
              </label>
              <input
                id="share-url"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="field text-sm"
              />
            </div>
          )}

          <ProductGrid products={items} className="mt-8" />
        </>
      )}
    </>
  );
}
