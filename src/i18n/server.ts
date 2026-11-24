import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildCatalog, type Catalog } from "./catalog";
import { isLocale, locales, defaultLocale, type Locale } from "./config";
import { getDict } from "./dict";
import { siteUrl } from "@/lib/flags";

const cache = new Map<Locale, Catalog>();

export function getCatalog(locale: Locale): Catalog {
  let c = cache.get(locale);
  if (!c) {
    c = buildCatalog(locale, getDict(locale).catalog);
    cache.set(locale, c);
  }
  return c;
}

/** Resolves the [lang] route param; unknown languages 404. */
export async function resolveLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export type LangParams = { params: Promise<{ lang: string }> };

/** Canonical + hreflang alternates for a path such as "/kataloq/etirler" ("/" = home). */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const rest = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}${rest}`;
  languages["x-default"] = `/${defaultLocale}${rest}`;
  return { canonical: `/${locale}${rest}`, languages };
}

export const ogLocale: Record<Locale, string> = { az: "az_AZ", en: "en_US", ru: "ru_RU" };

export { siteUrl };
