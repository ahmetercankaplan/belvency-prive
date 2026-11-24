export const locales = ["az", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";
/** localStorage key remembering the visitor language choice */
export const LANG_KEY = "belvency-lang";

export const isLocale = (v: string | undefined | null): v is Locale => !!v && (locales as readonly string[]).includes(v);

export const localeNames: Record<Locale, string> = {
  az: "Azərbaycan dili",
  en: "English",
  ru: "Русский",
};

export const localeShort: Record<Locale, string> = { az: "AZ", en: "EN", ru: "RU" };

/** Top-level paths that are never language-prefixed. */
const UNPREFIXED = new Set(["admin", "api", "images", "_next", "robots.txt", "sitemap.xml", "icon.svg"]);

/** "/kataloq?x=1" -> "/ru/kataloq?x=1"; leaves external, hash, mailto and already-prefixed links alone. */
export function withLocale(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const first = href.slice(1).split(/[/?#]/)[0];
  if (isLocale(first) || UNPREFIXED.has(first)) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/?") || href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

/** "/ru/kataloq/etirler" -> { locale: "ru", rest: "/kataloq/etirler" } */
export function splitLocale(pathname: string): { locale: Locale | null; rest: string } {
  const m = pathname.match(/^\/([^/]+)(\/.*)?$/);
  if (m && isLocale(m[1])) return { locale: m[1], rest: m[2] || "/" };
  return { locale: null, rest: pathname || "/" };
}

/** Replaces {name} placeholders. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Pick the right plural form. az/en: [one, other]; ru: [one, few, many]. */
export function plural(locale: Locale, n: number, forms: string[]): string {
  if (locale === "ru") {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1] ?? forms[0];
    return forms[2] ?? forms[1] ?? forms[0];
  }
  return n === 1 ? forms[0] : (forms[1] ?? forms[0]);
}
