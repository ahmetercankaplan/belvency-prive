"use client";

import { Gift } from "lucide-react";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { shop, useShop } from "@/lib/shop-store";
import { GiftCardPreview } from "./GiftCardPreview";
import { fmt } from "@/i18n/config";
import { useT } from "@/i18n/provider";

export function GiftOptionsPanel() {
  const { gift } = useShop();
  const t = useT().shop.giftPanel;
  const left = site.giftMessageMax - gift.message.length;

  return (
    <section aria-labelledby="gift-title" className="mt-10 border border-sand bg-linen/60 p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2 id="gift-title" className="t-h3 flex items-center gap-2.5">
            <Gift className="h-5 w-5 text-garnet-bright" aria-hidden="true" />
            {t.title}
          </h2>

          <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={gift.wrap}
              onChange={(e) => shop.setGift({ wrap: e.target.checked })}
              className="h-[1.15rem] w-[1.15rem] accent-[#7b1d3a]"
            />
            <span>
              {t.wrap} <span className="text-muted">(+{formatAZN(site.giftWrapFee)})</span>
            </span>
          </label>

          <div className="mt-3">
            <label htmlFor="gift-msg" className="mb-1.5 block text-sm">
              {t.message} <span className="text-muted">{t.optional}</span>
            </label>
            <textarea
              id="gift-msg"
              rows={4}
              maxLength={site.giftMessageMax}
              value={gift.message}
              onChange={(e) => shop.setGift({ message: e.target.value })}
              placeholder={t.placeholder}
              className="field resize-none"
              aria-describedby="gift-msg-count"
            />
            <p id="gift-msg-count" className="mt-1.5 text-[0.8rem] text-muted" aria-live="polite">
              {fmt(t.left, { n: left })}
            </p>
          </div>
          <p className="t-small mt-3 text-muted">{t.note}</p>
        </div>

        <GiftCardPreview message={gift.message} />
      </div>
    </section>
  );
}
