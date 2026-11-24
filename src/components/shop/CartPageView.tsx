"use client";

import Link from "@/i18n/link";
import { CartLines, DeliveryProgress } from "@/components/layout/CartDrawer";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { cartTotals, giftFee, shop, useHydrated, useShop } from "@/lib/shop-store";
import { GiftOptionsPanel } from "./GiftOptionsPanel";
import { fmt } from "@/i18n/config";
import { useT } from "@/i18n/provider";

export function CartPageView() {
  const hydrated = useHydrated();
  const t = useT().shop.cartPage;
  const { cart, gift } = useShop();
  const { count, subtotal, savings } = cartTotals(cart);

  if (!hydrated) {
    return (
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem]" aria-busy="true" aria-label={t.loading}>
        <div className="space-y-5">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton aspect-[4/5] w-28" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="skeleton h-3 w-1/4" />
                <div className="skeleton h-5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="skeleton h-72" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mt-10 rounded-sm bg-linen px-6 py-20 text-center md:py-28">
        <p className="t-h2">{t.emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-[40ch] text-muted">{t.emptyText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/kataloq" className="btn btn-primary">
            {t.toCatalog}
          </Link>
          <Link href="/sevimliler" className="btn btn-ghost">
            {t.toWishlist}
          </Link>
        </div>
      </div>
    );
  }

  const delivery = subtotal >= site.freeDeliveryFrom ? 0 : site.bakuDeliveryFee;
  const fee = giftFee(cart, gift);

  return (
    <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_26rem]">
      <section aria-label={t.items}>
        <CartLines />
        <button type="button" onClick={() => shop.clearCart()} className="link-u mt-4 text-sm text-muted hover:text-cocoa">
          {t.clear}
        </button>
        <GiftOptionsPanel />
      </section>

      <aside className="bg-linen p-6 lg:sticky lg:top-28 md:p-8" aria-label={t.summaryAria}>
        <h2 className="t-h3">{t.summary}</h2>
        <dl className="mt-6 space-y-3 text-[0.95rem]">
          <div className="flex justify-between">
            <dt>{fmt(t.products, { n: count })}</dt>
            <dd>{formatAZN(subtotal + savings)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-garnet-bright">
              <dt>{t.discount}</dt>
              <dd>−{formatAZN(savings)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>{t.delivery}</dt>
            <dd>{delivery === 0 ? t.free : formatAZN(delivery)}</dd>
          </div>
          {fee > 0 && (
            <div className="flex justify-between">
              <dt>{t.giftWrap}</dt>
              <dd>{formatAZN(fee)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-sand pt-4 text-lg font-medium">
            <dt>{t.total}</dt>
            <dd className="text-2xl">{formatAZN(subtotal + delivery + fee)}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <DeliveryProgress subtotal={subtotal} />
        </div>
        <Link href="/odenis" className="btn btn-primary mt-7 w-full">
          {t.checkout}
        </Link>
        <p className="t-small mt-4 text-muted">{t.regionNote}</p>
      </aside>
    </div>
  );
}
