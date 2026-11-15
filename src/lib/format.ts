/** Deterministic (server === client) AZN formatting: 1 289 ₼, 49,90 ₼ */
export function formatAZN(value: number): string {
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(2);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped}${dec ? "," + dec : ""} ₼`;
}

const MOBILE_PREFIXES = ["10", "50", "51", "55", "60", "70", "77", "99"];

/** Returns national 9-digit number (e.g. 501234567) or null when invalid. */
export function parseAzPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("994")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 9) return null;
  if (!MOBILE_PREFIXES.includes(digits.slice(0, 2))) return null;
  return digits;
}

export function formatAzPhone(national: string): string {
  return `+994 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5, 7)} ${national.slice(7, 9)}`;
}

/** Lower-cases and folds Azerbaijani letters so "ətir" matches "etir". */
export function fold(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ß/g, "ss");
}

export function discountPercent(price: number, salePrice?: number): number | null {
  if (!salePrice || salePrice >= price) return null;
  return Math.round((1 - salePrice / price) * 100);
}
