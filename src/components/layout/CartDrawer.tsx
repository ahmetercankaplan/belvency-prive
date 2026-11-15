"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { ProductArt } from "@/components/ui/ProductArt";
import { getBrand } from "@/data/brands";
import { getProductById } from "@/data/products";
import { site } from "@/data/site";
import { priceFor } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import { cartTotals, shop, useShop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart } = useShop();
  const { closePanel } = useUI();

  return (
    <ul className="divide-y divide-line">
      {cart.map((line) => {
        const p = getProductById(line.id);
        if (!p) return null;
        const pr = priceFor(p, line.option);
        return (
          <li key={`${line.id}|${line.option ?? ""}`} className="flex gap-4 py-5">
            <Link
              href={`/mehsul/${p.slug}`}
              onClick={closePanel}
              className={`block shrink-0 overflow-hidden ${compact ? "w-20" : "w-24 sm:w-28"}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <ProductArt kind={p.kind} tone={p.tone} metal={p.metal} label="" className="aspect-[4/5] w-full" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="t-small text-muted">{getBrand(p.brandSlug)?.name}</p>
              <Link href={`/mehsul/${p.slug}`} onClick={closePanel} className="font-display text-lg font-medium leading-snug hover:text-gold-deep">
                {p.title}
              </Link>
              {line.option && p.option && (
                <p className="t-small text-muted">
                  {p.option.label}: {line.option}
                </p>
              )}
              <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                <div className="flex items-center rounded-full border border-sand" role="group" aria-label={`${p.title} sayı`}>
                  <button
                    type="button"
                    aria-label="Sayı azalt"
                    onClick={() => shop.setQty(line.id, line.option, line.qty - 1)}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-linen"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Sayı artır"
                    disabled={line.qty >= 10}
                    onClick={() => shop.setQty(line.id, line.option, line.qty + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-linen disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[0.95rem] font-medium">{formatAZN(pr.current * line.qty)}</p>
                  <button
                    type="button"
                    onClick={() => shop.removeLine(line.id, line.option)}
                    className="mt-0.5 inline-flex min-h-8 items-center gap-1 text-[0.8rem] text-muted hover:text-cocoa"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Çıxar
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function DeliveryProgress({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, site.freeDeliveryFrom - subtotal);
  const pct = Math.min(100, (subtotal / site.freeDeliveryFrom) * 100);
  return (
    <div>
      <p className="text-sm">
        {left > 0 ? (
          <>
            Pulsuz çatdırılmaya <strong className="font-medium">{formatAZN(left)}</strong> qalıb
          </>
        ) : (
          "Sifarişiniz üçün çatdırılma pulsuzdur"
        )}
      </p>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label="Pulsuz çatdırılmaya qalan məbləğ"
      >
        <div className="h-full rounded-full bg-gold transition-[width] duration-700 ease-[var(--ease-soft)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { panel, closePanel } = useUI();
  const { cart } = useShop();
  const { count, subtotal } = cartTotals(cart);

  return (
    <Overlay open={panel === "cart"} onClose={closePanel} label="Səbət" side="right" hideClose>
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="t-h3">
          Səbət <span className="text-base font-normal text-muted">({count})</span>
        </h2>
        <button type="button" onClick={closePanel} className="link-u text-sm">
          Bağla
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-center px-6 pb-16">
          <p className="t-h2">Səbətiniz boşdur</p>
          <p className="mt-3 max-w-[32ch] text-muted">Bəyəndiyiniz məhsulu səbətə əlavə edin, o burada görünəcək.</p>
          <Link href="/kataloq" onClick={closePanel} className="btn btn-primary mt-7">
            Kataloqa keç
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6">
            <CartLines compact />
          </div>
          <div className="border-t border-line bg-linen/60 px-6 py-5">
            <DeliveryProgress subtotal={subtotal} />
            <div className="mt-5 flex items-baseline justify-between">
              <span>Ara cəm</span>
              <span className="text-xl font-medium">{formatAZN(subtotal)}</span>
            </div>
            <p className="t-small mt-1 text-muted">Çatdırılma haqqı ödəniş mərhələsində hesablanır.</p>
            <div className="mt-4 grid gap-2.5">
              <Link href="/odenis" onClick={closePanel} className="btn btn-primary">
                Sifarişi rəsmiləşdir
              </Link>
              <Link href="/sebet" onClick={closePanel} className="btn btn-ghost">
                Səbətə bax
              </Link>
            </div>
          </div>
        </>
      )}
    </Overlay>
  );
}
