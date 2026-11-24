import { defaultOption, matchesGender, priceFor } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import { fmt } from "@/i18n/config";
import type { Catalog } from "@/i18n/catalog";
import type { Dict } from "@/i18n/dict";
import type { Product } from "@/lib/types";

export interface GiftAnswers {
  for: "qadin" | "kisi";
  occasion: string;
  budget: "100" | "250" | "500" | "any";
  style: "gozellik" | "zerger" | "moda" | "any";
}

export interface GiftPick {
  product: Product;
  score: number;
  overBudget: boolean;
  fit: string;
  reasons: string[];
}

/** Gift suggestions from the (already translated) catalog; reasons are written in the visitor's language. */
export function recommendGifts(a: GiftAnswers, c: Catalog, t: Dict["gift"]): GiftPick[] {
  const maxPrice = a.budget === "any" ? Infinity : Number(a.budget);

  const scored = c.products
    .filter((p) => p.inStock && matchesGender(p, a.for))
    .map((p) => {
      const price = priceFor(p, defaultOption(p)).current;
      const group = c.getCategory(p.category)?.group ?? "";
      const reasons: string[] = [];
      let score = 0;
      const overBudget = price > maxPrice;

      if (a.style !== "any" && group === a.style) {
        score += 4;
        reasons.push(fmt(t.reasons.style, { group: t.groups[a.style] }));
      }
      if (p.tags.includes("hediyye")) {
        score += 3;
        reasons.push(t.reasons.giftCollection);
      }
      if (a.occasion === "yubiley" && p.tags.includes("ekskluziv")) {
        score += 1;
        reasons.push(t.reasons.exclusive);
      }
      if (!overBudget) {
        score += 1;
        if (a.budget !== "any") reasons.push(fmt(t.reasons.inBudget, { price: formatAZN(price) }));
      } else {
        // never present an over-budget gift as a perfect match
        score -= 6;
        reasons.push(fmt(t.reasons.overBudget, { price: formatAZN(price) }));
      }
      return { product: p, score, overBudget, reasons };
    })
    .sort((x, y) => y.score - x.score || x.product.rank - y.product.rank)
    .slice(0, 3);

  return scored.map((r) => ({
    ...r,
    fit: r.overBudget ? t.fit.alt : r.score >= 7 ? t.fit.great : r.score >= 4 ? t.fit.good : t.fit.alt,
    reasons: r.reasons.length ? r.reasons : [t.reasons.fallback],
  }));
}
