import type { MetadataRoute } from "next";
import { brands } from "@/data/brands";
import { categories, collections, groups } from "@/data/categories";
import { products } from "@/data/products";
import { indexable, siteUrl } from "@/lib/flags";
import { defaultLocale, locales } from "@/i18n/config";

export const dynamic = "force-static";

/** Every public page in every language, each entry pointing at its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable || !siteUrl) return [];

  const paths = [
    "",
    "/kataloq",
    "/qadin",
    "/kisi",
    "/brendler",
    "/hediyye-sihirbazi",
    "/haqqimizda",
    "/catdirilma",
    "/qaytarma",
    "/sertler",
    "/mexfilik",
    "/elaqe",
    ...categories.map((c) => `/kataloq/${c.slug}`),
    ...groups.map((g) => `/kataloq/${g.slug}`),
    ...collections.map((c) => `/kataloq/${c.slug}`),
    ...brands.map((b) => `/brendler/${b.slug}`),
    ...products.map((p) => `/mehsul/${p.slug}`),
  ];

  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${siteUrl}/${l}${path}`,
      changeFrequency: "weekly" as const,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((x) => [x, `${siteUrl}/${x}${path}`])),
          "x-default": `${siteUrl}/${defaultLocale}${path}`,
        },
      },
    })),
  );
}
