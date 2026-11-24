"use client";

import { useMemo } from "react";
import { buildCatalog, type Catalog } from "./catalog";
import { useLocale, useT } from "./provider";

const cache = new Map<string, Catalog>();

/** The catalog (products, brands, categories…) translated for the language of the current page. */
export function useCatalog(): Catalog {
  const locale = useLocale();
  const t = useT();
  return useMemo(() => {
    let c = cache.get(locale);
    if (!c) {
      c = buildCatalog(locale, t.catalog);
      cache.set(locale, c);
    }
    return c;
  }, [locale, t.catalog]);
}
