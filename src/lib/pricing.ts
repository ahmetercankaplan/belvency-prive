import type { Product } from "./types.ts";

/**
 * Pure pricing + stock rules shared by the storefront and the server.
 * Keep this file free of path aliases and data imports so Node can load it directly.
 */

export interface Price {
  price: number;
  salePrice?: number;
  /** the price the customer actually pays */
  current: number;
}

/** Resolves price for a product and an optional selected option value. */
export function priceFor(product: Product, optionName?: string): Price {
  const value = optionName ? product.option?.values.find((v) => v.name === optionName) : undefined;
  const price = value?.price ?? product.price;
  const salePrice = value ? (value.salePrice ?? (value.price ? undefined : product.salePrice)) : product.salePrice;
  const sale = salePrice && salePrice < price ? salePrice : undefined;
  return { price, salePrice: sale, current: sale ?? price };
}

/**
 * Units available for a product (and option). Infinity = demo product with no tracked stock.
 */
export function unitsAvailable(product: Product, optionName?: string): number {
  if (product.option) {
    const v = optionName ? product.option.values.find((x) => x.name === optionName) : undefined;
    if (!v) return 0;
    if (v.stock === undefined) return product.inStock ? Infinity : 0;
    return Math.max(0, v.stock);
  }
  if (product.stock === undefined) return product.inStock ? Infinity : 0;
  return Math.max(0, product.stock);
}

/** True when at least one purchasable variant has stock. */
export function hasStock(product: Product): boolean {
  if (product.option) return product.option.values.some((v) => unitsAvailable(product, v.name) > 0);
  return unitsAvailable(product) > 0;
}
