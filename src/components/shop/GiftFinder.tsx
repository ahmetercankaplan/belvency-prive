"use client";

import Link from "@/i18n/link";
import { useState } from "react";
import { Gift } from "lucide-react";
import { fmt } from "@/i18n/config";
import { useCatalog } from "@/i18n/use-catalog";
import { useT } from "@/i18n/provider";
import { defaultOption } from "@/lib/catalog";
import { recommendGifts, type GiftAnswers } from "@/lib/gift";
import { shop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import { GiftCardPreview } from "./GiftCardPreview";
import { ProductCard } from "./ProductCard";
import { QuizFlow, type QuizContext } from "./QuizFlow";

function GiftResults({ answers, restart, back, headingRef }: QuizContext) {
  const { notify, openPanel } = useUI();
  const t = useT().gift;
  const catalog = useCatalog();
  const a = answers as unknown as GiftAnswers;
  const options = t.wishes[a.occasion] ?? [];
  const [wish, setWish] = useState(options[0] ?? "");
  const picks = recommendGifts(a, catalog, t);

  const addAsGift = (id: string, option: string | undefined) => {
    shop.addToCart(id, option, 1);
    shop.setGift({ wrap: true, message: wish });
    notify(t.ui.added);
    openPanel("cart");
  };

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
        {fmt(t.ui.heading, { occasion: t.occasionNames[a.occasion] ?? t.ui.fallbackOccasion })}
      </h2>
      <p className="mt-3 max-w-[54ch] text-muted">
        {t.ui.lead}
      </p>

      <div className="mt-10 grid gap-10 border border-sand bg-linen/60 p-6 md:grid-cols-[1fr_auto] md:p-8">
        <fieldset>
          <legend className="t-h3">{t.ui.pickMessage}</legend>
          <div className="mt-4 space-y-2">
            {options.map((w) => (
              <label
                key={w}
                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  wish === w ? "border-garnet bg-ivory" : "border-sand hover:border-garnet"
                }`}
              >
                <input
                  type="radio"
                  name="wish"
                  checked={wish === w}
                  onChange={() => setWish(w)}
                  className="mt-1 h-4 w-4 accent-[#7b1d3a]"
                />
                <span className="font-display text-[1.1rem] italic leading-snug">{w}</span>
              </label>
            ))}
            <label
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                wish === "" ? "border-garnet bg-ivory" : "border-sand hover:border-garnet"
              }`}
            >
              <input
                type="radio"
                name="wish"
                checked={wish === ""}
                onChange={() => setWish("")}
                className="h-4 w-4 accent-[#7b1d3a]"
              />
              <span>{t.ui.ownMessage}</span>
            </label>
          </div>
        </fieldset>
        <GiftCardPreview message={wish} />
      </div>

      {picks.length === 0 ? (
        <p className="mt-10">{t.ui.none}</p>
      ) : (
        <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((r) => (
            <li key={r.product.id}>
              <ProductCard product={r.product} />
              <p className="mt-4 inline-block rounded-full bg-garnet px-3 py-1 text-[0.78rem] text-ivory">{r.fit}</p>
              <ul className="mt-3 space-y-1.5 text-[0.9rem] text-muted">
                {r.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {reason}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => addAsGift(r.product.id, defaultOption(r.product))}
                className="btn btn-ghost mt-4 w-full"
              >
                <Gift className="h-4 w-4" aria-hidden="true" />
                {t.ui.addAsGift}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="t-small mt-6 text-muted">
        {t.ui.footnote}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={restart} className="btn btn-primary">
          {t.ui.restart}
        </button>
        <button type="button" onClick={back} className="btn btn-ghost">
          {t.ui.changeLast}
        </button>
        <Link href="/kataloq/hediyye-secimleri" className="btn btn-ghost">
          {t.ui.allGifts}
        </Link>
      </div>
    </div>
  );
}

export function GiftFinder() {
  const t = useT().gift;
  return (
    <QuizFlow
      questions={t.questions}
      progressLabel={t.progress}
      renderResults={(ctx) => <GiftResults {...ctx} />}
    />
  );
}
