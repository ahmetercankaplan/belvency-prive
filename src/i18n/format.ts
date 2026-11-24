import { plural, type Locale } from "./config";
import { getDict } from "./dict";

/** "14 days" / "14 дней" / "14 gün" — correct plural for the language. Server-side only (reads the legal units). */
export function dayCount(locale: Locale, n: number): string {
  return `${n} ${plural(locale, n, getDict(locale).legal.units.day)}`;
}

export function bizDayCount(locale: Locale, n: number): string {
  return `${n} ${plural(locale, n, getDict(locale).legal.units.bizDay)}`;
}

/** "1–2 business days": the unit agrees with the upper bound. */
export function bizDayRange(locale: Locale, min: number, max: number): string {
  return `${min}–${max} ${plural(locale, max, getDict(locale).legal.units.bizDay)}`;
}
