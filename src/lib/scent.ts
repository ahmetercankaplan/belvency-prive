import { familyLabels, occasionLabels, scentProfiles, type Occasion, type ScentFamily } from "@/data/scent";
import { products } from "@/data/products";
import { defaultOption, matchesGender, priceFor } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import type { Product } from "@/lib/types";

export interface Answers {
  for: "qadin" | "kisi" | "hediyye";
  family: ScentFamily;
  when: Occasion;
  budget: "220" | "300" | "any";
}

export interface Recommendation {
  product: Product;
  score: number;
  overBudget: boolean;
  fit: "Tam uyğun" | "Yaxşı uyğun" | "Alternativ";
  reasons: string[];
}

const noteOf = (p: Product, label: string) => p.specs.find((s) => s.label === label)?.value;

export function recommend(a: Answers): Recommendation[] {
  const gender = a.for === "hediyye" ? null : a.for;
  const maxPrice = a.budget === "any" ? Infinity : Number(a.budget);

  const scored = products
    .filter((p) => p.category === "etirler" && matchesGender(p, gender))
    .map((p) => {
      const profile = scentProfiles[p.slug];
      const price = priceFor(p, defaultOption(p)).current;
      const reasons: string[] = [];
      let score = 0;
      const overBudget = price > maxPrice;

      if (profile?.family === a.family) {
        score += 4;
        const heart = noteOf(p, "Ürək notları");
        reasons.push(`Axtardığınız ${familyLabels[a.family]} xarakter${heart ? ` — ürək notları: ${heart.toLowerCase()}` : ""}`);
      }
      if (profile?.occasions.includes(a.when)) {
        score += 2;
        reasons.push(`${occasionLabels[a.when][0].toUpperCase()}${occasionLabels[a.when].slice(1)} üçün uyğundur`);
      }
      if (!overBudget) {
        score += 1;
        if (a.budget !== "any") reasons.push(`Büdcənizə uyğundur (${formatAZN(price)})`);
      } else {
        // a perfect scent match must never outrank in-budget options without saying so
        score -= 6;
        reasons.push(`Büdcənizdən yuxarıdır (${formatAZN(price)})`);
      }
      return { product: p, score, overBudget, reasons };
    })
    .sort((x, y) => y.score - x.score || x.product.rank - y.product.rank)
    .slice(0, 3);

  return scored.map((r) => ({
    ...r,
    fit: r.overBudget ? "Alternativ" : r.score >= 6 ? "Tam uyğun" : r.score >= 3 ? "Yaxşı uyğun" : "Alternativ",
    reasons: r.reasons.length ? r.reasons : ["Seçimlərinizə tam uyğun gəlməsə də, ən yaxın alternativdir"],
  }));
}
