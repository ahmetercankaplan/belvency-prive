/**
 * Customer-facing error messages of the order endpoint, in the language the visitor is browsing in.
 * (Admin-panel errors stay Azerbaijani.) No imports, so the server can load it directly.
 */
export type Lang = "az" | "en" | "ru";

export const parseLang = (v: unknown): Lang => (v === "en" || v === "ru" ? v : "az");

const M = {
  rejected: { az: "Sorğu qəbul edilmədi", en: "The request was not accepted", ru: "Запрос не принят" },
  emptyCart: {
    az: "Səbət boşdur və ya çox böyükdür",
    en: "The cart is empty or too large",
    ru: "Корзина пуста или слишком велика",
  },
  duplicate: {
    az: "Eyni məhsul səbətdə təkrarlanır",
    en: "The same product appears twice in the cart",
    ru: "Один и тот же товар повторяется в корзине",
  },
  phone: {
    az: "Telefon nömrəsi düzgün deyil (məsələn: 050 123 45 67)",
    en: "The phone number is not valid (for example: 050 123 45 67)",
    ru: "Номер телефона указан неверно (например: 050 123 45 67)",
  },
  email: { az: "E-poçt ünvanı düzgün deyil", en: "The email address is not valid", ru: "Адрес электронной почты указан неверно" },
  region: { az: "Şəhər / rayon yanlışdır", en: "The city / region is not valid", ru: "Город / район указан неверно" },
  unavailable: {
    az: "Səbətdəki məhsullardan biri artıq satışda deyil. Səbəti yeniləyin.",
    en: "One of the products in your cart is no longer on sale. Please refresh your cart.",
    ru: "Один из товаров в корзине больше не продаётся. Обновите корзину.",
  },
  badOption: {
    az: "“{title}” üçün seçim yanlışdır",
    en: "The selected option for “{title}” is not valid",
    ru: "Выбранный вариант для «{title}» недоступен",
  },
  noStock: {
    az: "“{item}” üçün kifayət qədər stok yoxdur",
    en: "There is not enough stock for “{item}”",
    ru: "Недостаточно товара «{item}» в наличии",
  },
  noId: {
    az: "Sifariş nömrəsi yaradıla bilmədi, yenidən cəhd edin",
    en: "The order number could not be created, please try again",
    ru: "Не удалось создать номер заказа, попробуйте ещё раз",
  },
} as const;

export type MessageKey = keyof typeof M;

export function msg(lang: Lang, key: MessageKey, vars: Record<string, string> = {}): string {
  return M[key][lang].replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}
