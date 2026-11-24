import { brands as allBrands } from "@/data/brands";
import { categories as allCategories, collections as allCollections, groups as allGroups } from "@/data/categories";
import { products as allProducts } from "@/data/products";
import { fold } from "@/lib/format";
import type { Brand, Category, CategoryGroup, Collection, Gender, Product, Tag, TranslatedLocale } from "@/lib/types";
import type { Locale } from "./config";
import type { Dict } from "./dict";

type CatalogDict = Dict["catalog"];

export function localizeProduct(p: Product, locale: Locale): Product {
  if (locale === "az") return p;
  const o = p.i18n?.[locale as TranslatedLocale];
  if (!o) return p;
  return {
    ...p,
    title: o.title || p.title,
    description: o.description || p.description,
    material: o.material || p.material,
    color: o.color || p.color,
    subtype: o.subtype || p.subtype,
    option: p.option && o.optionLabel ? { ...p.option, label: o.optionLabel } : p.option,
  };
}

export function localizeBrand(b: Brand, locale: Locale): Brand {
  if (locale === "az") return b;
  const o = b.i18n?.[locale as TranslatedLocale];
  if (!o) return b;
  return { ...b, specialty: o.specialty || b.specialty, blurb: o.blurb || b.blurb };
}

/** All catalog data translated for one language. Structure (slugs, ids, prices) never changes. */
export function buildCatalog(locale: Locale, d: CatalogDict) {
  const groups: CategoryGroup[] = allGroups.map((g) => ({ ...g, ...(d.groups[g.slug] ?? {}) }));
  const categories: Category[] = allCategories.map((c) => ({ ...c, ...(d.categories[c.slug] ?? {}) }));
  const collections: Collection[] = allCollections.map((c) => ({ ...c, ...(d.collections[c.slug] ?? {}) }));
  const brands: Brand[] = allBrands.map((b) => localizeBrand(b, locale));
  const products: Product[] = allProducts.map((p) => localizeProduct(p, locale));

  const productBySlug = new Map(products.map((p) => [p.slug, p]));
  const productById = new Map(products.map((p) => [p.id, p]));
  const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  const genderLabels = d.genders as Record<Gender, string>;
  const tagLabels = d.tags as Record<Tag, string>;

  return {
    locale,
    groups,
    categories,
    collections,
    brands,
    products,
    genderLabels,
    tagLabels,
    regions: d.regions,
    getProduct: (slug: string) => productBySlug.get(slug),
    getProductById: (id: string) => productById.get(id),
    getBrand: (slug: string) => brandBySlug.get(slug),
    getCategory: (slug: string) => categoryBySlug.get(slug),
    getGroup: (slug: string) => groups.find((g) => g.slug === slug),
    getCollection: (slug: string) => collections.find((c) => c.slug === slug),
    categoriesOfGroup: (group: string) => categories.filter((c) => c.group === group),
    /** Free-text search over the localized title, brand, category and attributes. */
    search(query: string, list: Product[] = products): Product[] {
      const terms = fold(query).split(/\s+/).filter(Boolean);
      if (terms.length === 0) return [];
      return list.filter((p) => {
        const hay = fold(
          [
            p.title,
            brandBySlug.get(p.brandSlug)?.name,
            categoryBySlug.get(p.category)?.title,
            p.subtype,
            p.material,
            p.color,
            genderLabels[p.gender],
          ]
            .filter(Boolean)
            .join(" "),
        );
        return terms.every((t) => hay.includes(t));
      });
    },
  };
}

export type Catalog = ReturnType<typeof buildCatalog>;
