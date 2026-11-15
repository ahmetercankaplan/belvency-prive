import { getCategory } from "@/data/categories";
import { products } from "@/data/products";
import { defaultOption, matchesGender, priceFor } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
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
  fit: "Çox uyğun" | "Yaxşı uyğun" | "Alternativ";
  reasons: string[];
}

const groupName: Record<string, string> = { gozellik: "gözəllik", zerger: "zərgərlik", moda: "moda" };

export function recommendGifts(a: GiftAnswers): GiftPick[] {
  const maxPrice = a.budget === "any" ? Infinity : Number(a.budget);

  const scored = products
    .filter((p) => p.inStock && matchesGender(p, a.for))
    .map((p) => {
      const price = priceFor(p, defaultOption(p)).current;
      const group = getCategory(p.category)?.group ?? "";
      const reasons: string[] = [];
      let score = 0;
      const overBudget = price > maxPrice;

      if (a.style !== "any" && group === a.style) {
        score += 4;
        reasons.push(`Seçdiyiniz növdən: ${groupName[a.style]}`);
      }
      if (p.tags.includes("hediyye")) {
        score += 3;
        reasons.push("Hədiyyə seçimləri kolleksiyasındandır");
      }
      if (a.occasion === "yubiley" && p.tags.includes("ekskluziv")) {
        score += 1;
        reasons.push("Eksklüziv kolleksiyadandır — xüsusi tarixlər üçün");
      }
      if (!overBudget) {
        score += 1;
        if (a.budget !== "any") reasons.push(`Büdcənizə uyğundur (${formatAZN(price)})`);
      } else {
        // never present an over-budget gift as a perfect match
        score -= 6;
        reasons.push(`Büdcənizdən yuxarıdır (${formatAZN(price)})`);
      }
      return { product: p, score, overBudget, reasons };
    })
    .sort((x, y) => y.score - x.score || x.product.rank - y.product.rank)
    .slice(0, 3);

  return scored.map((r) => ({
    ...r,
    fit: r.overBudget ? "Alternativ" : r.score >= 7 ? "Çox uyğun" : r.score >= 4 ? "Yaxşı uyğun" : "Alternativ",
    reasons: r.reasons.length ? r.reasons : ["Seçimlərinizə ən yaxın alternativdir"],
  }));
}
