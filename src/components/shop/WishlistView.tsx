"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { getProductById } from "@/data/products";
import { shop, useHydrated, useShop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

/** Shared lists travel in the URL as ?s=p001,p004 — no account or backend needed. */
function parseShared(param: string | null): Product[] {
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
  const { wishlist } = useShop();
  const { notify } = useUI();
  const sp = useSearchParams();
  const shared = parseShared(sp.get("s"));
  const [shareUrl, setShareUrl] = useState("");

  if (!hydrated) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4" aria-busy="true" aria-label="Sevimlilər yüklənir">
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
    const url = `${window.location.origin}/sevimliler?s=${items.map((p) => p.id).join(",")}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      notify("Keçid kopyalandı");
    } catch {
      notify("Keçidi aşağıdan kopyalayın");
    }
  };

  const addShared = () => {
    missing.forEach((p) => shop.toggleWishlist(p.id));
    notify(`${missing.length} məhsul sevimlilərə əlavə olundu`);
  };

  return (
    <>
      {shared.length > 0 && (
        <section className="mt-10 border border-sand bg-linen/60 p-6 md:p-8" aria-labelledby="shared-title">
          <h2 id="shared-title" className="t-h2">
            Sizinlə paylaşılan siyahı
          </h2>
          <p className="mt-2 text-muted">{shared.length} məhsul. Bəyəndiklərinizi öz siyahınıza əlavə edə bilərsiniz.</p>
          <ProductGrid products={shared} className="mt-8" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={addShared} disabled={missing.length === 0} className="btn btn-primary">
              {missing.length === 0 ? "Hamısı artıq siyahınızdadır" : `Hamısını sevimlilərə əlavə et (${missing.length})`}
            </button>
            <Link href="/sevimliler" className="link-u text-sm">
              Paylaşılan siyahını bağla
            </Link>
          </div>
        </section>
      )}

      {items.length === 0 ? (
        shared.length === 0 && (
          <div className="mt-10 rounded-sm bg-linen px-6 py-20 text-center md:py-28">
            <p className="t-h2">Hələ heç nə seçməmisiniz</p>
            <p className="mx-auto mt-3 max-w-[42ch] text-muted">
              Məhsul kartındakı ürək işarəsinə toxunun — bəyəndikləriniz burada saxlanılacaq.
            </p>
            <Link href="/kataloq" className="btn btn-primary mt-8">
              Kataloqa keç
            </Link>
          </div>
        )
      ) : (
        <>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-muted" aria-live="polite">
              {items.length} məhsul
            </p>
            <button type="button" onClick={share} className="btn btn-ghost min-h-11 px-5 text-sm">
              <Link2 className="h-4 w-4" aria-hidden="true" />
              Siyahını paylaş
            </button>
          </div>

          {shareUrl && (
            <div className="anim-fade mt-4">
              <label htmlFor="share-url" className="mb-1.5 block text-sm text-muted">
                Bu keçidi göndərin — hesab tələb olunmur
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
