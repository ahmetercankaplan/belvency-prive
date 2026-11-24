"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { WishlistButton } from "./WishlistButton";
import { priceFor } from "@/lib/catalog";
import { unitsAvailable } from "@/lib/pricing";
import { shop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import type { Product } from "@/lib/types";
import { live } from "@/lib/flags";

export function ProductPurchase({ product }: { product: Product }) {
  const { openPanel, notify } = useUI();
  // start on the first variant that is actually in stock
  const firstOption = product.option?.values.find((v) => unitsAvailable(product, v.name) > 0)?.name ?? product.option?.values[0]?.name;
  const [option, setOption] = useState<string | undefined>(firstOption);
  const [qty, setQty] = useState(1);
  const units = unitsAvailable(product, option);
  const available = units > 0;
  const maxQty = Math.min(10, Number.isFinite(units) ? units : 10);
  const pr = priceFor(product, option);

  const addRef = useRef<HTMLButtonElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  // Mobile: show a compact buy bar while the main button is out of view
  // (hidden again once the footer appears so it never covers page content).
  useEffect(() => {
    const btn = addRef.current;
    if (!btn || typeof IntersectionObserver === "undefined") return;
    let buttonVisible = true;
    let footerVisible = false;
    const sync = () => setBarVisible(!buttonVisible && !footerVisible);
    const io = new IntersectionObserver((e) => {
      buttonVisible = e[0].isIntersecting;
      sync();
    });
    io.observe(btn);
    const footer = document.querySelector("footer");
    const fo = footer
      ? new IntersectionObserver((e) => {
          footerVisible = e[0].isIntersecting;
          sync();
        })
      : null;
    if (footer && fo) fo.observe(footer);
    return () => {
      io.disconnect();
      fo?.disconnect();
    };
  }, []);

  const add = () => {
    if (!available) return;
    shop.addToCart(product.id, option, Math.min(qty, maxQty));
    notify(qty > 1 ? `${qty} ədəd səbətə əlavə olundu` : "Səbətə əlavə olundu");
    openPanel("cart");
  };

  return (
    <div>
      <Price price={pr.price} salePrice={pr.salePrice} size="lg" />

      {product.option && (
        <fieldset className="mt-8">
          <legend className="text-[0.95rem]">
            {product.option.label}: <span className="font-medium">{option}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.option.values.map((v) => {
              const active = v.name === option;
              const out = unitsAvailable(product, v.name) <= 0;
              return (
                <label key={v.name} className={out ? "cursor-pointer opacity-60" : "cursor-pointer"}>
                  <input
                    type="radio"
                    name="option"
                    value={v.name}
                    checked={active}
                    onChange={() => {
                      setOption(v.name);
                      setQty(1);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-flex min-h-11 min-w-12 items-center justify-center rounded-full border px-5 text-[0.92rem] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-deep ${
                      active ? "border-garnet bg-garnet text-ivory" : "border-sand hover:border-cocoa"
                    }`}
                  >
                    <span className={out ? "line-through" : ""}>{v.name}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className="mt-6 flex items-center gap-2 text-sm" role="status">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${available ? "bg-[#5f8a63]" : "bg-[#a3392f]"}`}
        />
        {!available
          ? product.option ? "Bu seçim üçün stok yoxdur" : "Hazırda stokda yoxdur"
          : Number.isFinite(units) && units <= 3 ? `Son ${units} ədəd` : "Stokda var"}
        {!live && <span className="text-muted">· nümayiş məlumatı</span>}
      </p>

      <div className="mt-7 flex flex-wrap items-stretch gap-3">
        <div className="flex items-center rounded-full border border-sand" role="group" aria-label="Say">
          <button
            type="button"
            aria-label="Sayı azalt"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center rounded-full hover:bg-linen disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Sayı artır"
            disabled={qty >= maxQty}
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="grid h-12 w-12 place-items-center rounded-full hover:bg-linen disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <button ref={addRef} type="button" onClick={add} disabled={!available} className="btn btn-primary min-w-[14rem] flex-1">
          <ShoppingBag className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
          Səbətə at
        </button>
      </div>
      <WishlistButton productId={product.id} title={product.title} variant="full" className="mt-3 w-full" />

      {barVisible && (
        <div
          className="anim-up fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-ivory/95 px-4 py-3 shadow-[0_-12px_30px_-18px_rgba(74,14,34,0.4)] backdrop-blur md:hidden"
          role="region"
          aria-label="Sürətli satın alma"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[1.05rem] font-medium leading-tight">{product.title}</p>
            <div className="flex items-baseline gap-2">
              <Price price={pr.price} salePrice={pr.salePrice} />
              {option && <span className="truncate text-xs text-muted">{option}</span>}
            </div>
          </div>
          <button type="button" onClick={add} disabled={!available} className="btn btn-primary shrink-0 px-5">
            {available ? "Səbətə at" : "Stokda yoxdur"}
          </button>
        </div>
      )}
    </div>
  );
}
