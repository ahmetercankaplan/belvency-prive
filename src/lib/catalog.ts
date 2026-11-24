import { brands, getBrand } from "@/data/brands";
import { categories, genderLabels, getCategory } from "@/data/categories";
import { products } from "@/data/products";
import { fold } from "@/lib/format";
import type { Category, Gender, Product, Tag } from "@/lib/types";

export type SortKey = "tovsiye" | "yeni" | "ucuz" | "bahali";

export const sortLabels: Record<SortKey, string> = {
  tovsiye: "Tövsiyə olunan",
  yeni: "Ən yeni",
  ucuz: "Qiymət: azdan çoxa",
  bahali: "Qiymət: çoxdan aza",
};

import { priceFor, type Price } from "@/lib/pricing";
export { priceFor };
export type { Price };

export function defaultOption(product: Product): string | undefined {
  return product.option?.values[0]?.name;
}

export function isSale(product: Product) {
  return priceFor(product, defaultOption(product)).salePrice !== undefined;
}

export function matchesGender(product: Product, gender?: Gender | null) {
  if (!gender) return true;
  return product.gender === gender || product.gender === "uniseks";
}

export function productsByTag(tag: Tag) {
  return products.filter((p) => p.tags.includes(tag));
}

export function searchProducts(query: string, list: Product[] = products): Product[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return list.filter((p) => {
    const brand = getBrand(p.brandSlug)?.name ?? "";
    const cat = getCategory(p.category)?.title ?? "";
    const hay = fold(
      [p.title, brand, cat, p.subtype, p.material, p.color, genderLabels[p.gender]].filter(Boolean).join(" "),
    );
    return terms.every((t) => hay.includes(t));
  });
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  const cur = (p: Product) => priceFor(p, defaultOption(p)).current;
  switch (sort) {
    case "yeni":
      return copy.sort((a, b) => b.added - a.added);
    case "ucuz":
      return copy.sort((a, b) => cur(a) - cur(b));
    case "bahali":
      return copy.sort((a, b) => cur(b) - cur(a));
    default:
      return copy.sort((a, b) => a.rank - b.rank);
  }
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCat = products.filter((p) => p.id !== product.id && p.category === product.category);
  const sameGender = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      matchesGender(p, product.gender === "uniseks" ? null : product.gender),
  );
  return [...sameCat, ...sameGender].slice(0, limit);
}

export const priceCeiling = Math.ceil(Math.max(...products.map((p) => p.price)) / 50) * 50;

export { brands, categories };

/** Categories that actually contain products for the given gender (drives menus). */
export function categoriesFor(gender: Gender, list: Category[] = categories) {
  const slugs = new Set(products.filter((p) => matchesGender(p, gender)).map((p) => p.category));
  return list.filter((c) => slugs.has(c.slug));
}
