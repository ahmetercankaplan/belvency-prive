import type { Locale } from "../config";
import { catalog } from "./catalog";
import { chrome } from "./chrome";
import { home } from "./home";
import { shop } from "./shop";
import { pages } from "./pages";
import { checkout } from "./checkout";
import { gift } from "./gift";
import { legal } from "./legal";

/**
 * One file per area, each with an az / en / ru object of the SAME shape (TypeScript enforces it).
 * Text is plain strings with {placeholders} so a dictionary can be sent from server to client components.
 */
const all = { chrome, catalog, home, shop, pages, checkout, gift, legal };

export type Dict = { [K in keyof typeof all]: (typeof all)[K]["az"] };

/** Namespaces only server components read; they are not shipped to the browser. */
const SERVER_ONLY = ["pages", "legal"] as const satisfies readonly (keyof Dict)[];
export type ClientDict = Omit<Dict, (typeof SERVER_ONLY)[number]>;

const cache = new Map<Locale, Dict>();

export function getDict(locale: Locale): Dict {
  let d = cache.get(locale);
  if (!d) {
    d = Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v[locale]])) as Dict;
    cache.set(locale, d);
  }
  return d;
}

export function getClientDict(locale: Locale): ClientDict {
  const d: Partial<Dict> = { ...getDict(locale) };
  for (const k of SERVER_ONLY) delete d[k];
  return d as ClientDict;
}
