"use client";

import { useSyncExternalStore } from "react";
import { getProductById } from "@/data/products";
import { priceFor } from "@/lib/catalog";
import { site } from "@/data/site";
import type { CartLine, GiftOptions } from "@/lib/types";

/**
 * Tiny external store for cart + wishlist, persisted in localStorage.
 * Built on useSyncExternalStore so server render and first client render match.
 */

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  gift: GiftOptions;
}

const KEY = "belvency:shop:v1";
const NO_GIFT: GiftOptions = { wrap: false, message: "" };
const EMPTY: ShopState = { cart: [], wishlist: [], gift: NO_GIFT };

let state: ShopState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): ShopState {
  const out: ShopState = { cart: [], wishlist: [], gift: NO_GIFT };
  if (!raw || typeof raw !== "object") return out;
  const r = raw as Partial<ShopState>;
  if (Array.isArray(r.cart)) {
    for (const l of r.cart) {
      if (l && typeof l.id === "string" && getProductById(l.id) && Number.isInteger(l.qty) && l.qty > 0) {
        out.cart.push({ id: l.id, option: typeof l.option === "string" ? l.option : undefined, qty: Math.min(l.qty, 10) });
      }
    }
  }
  if (Array.isArray(r.wishlist)) {
    out.wishlist = r.wishlist.filter((id): id is string => typeof id === "string" && !!getProductById(id));
  }
  if (r.gift && typeof r.gift === "object") {
    const g = r.gift as Partial<GiftOptions>;
    out.gift = {
      wrap: g.wrap === true,
      message: typeof g.message === "string" ? g.message.slice(0, site.giftMessageMax) : "",
    };
  }
  return out;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

function commit(next: ShopState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / privacy mode */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    try {
      state = e.newValue ? sanitize(JSON.parse(e.newValue)) : EMPTY;
    } catch {
      state = EMPTY;
    }
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

const getServerSnapshot = () => EMPTY;

export function useShop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** false during SSR and the hydration pass, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const sameLine = (l: CartLine, id: string, option?: string) => l.id === id && (l.option ?? "") === (option ?? "");

export const shop = {
  addToCart(id: string, option: string | undefined, qty = 1) {
    load();
    const existing = state.cart.find((l) => sameLine(l, id, option));
    const cart = existing
      ? state.cart.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
      : [...state.cart, { id, option, qty: Math.min(qty, 10) }];
    commit({ ...state, cart });
  },
  setQty(id: string, option: string | undefined, qty: number) {
    load();
    if (qty <= 0) return shop.removeLine(id, option);
    commit({ ...state, cart: state.cart.map((l) => (sameLine(l, id, option) ? { ...l, qty: Math.min(qty, 10) } : l)) });
  },
  removeLine(id: string, option?: string) {
    load();
    commit({ ...state, cart: state.cart.filter((l) => !sameLine(l, id, option)) });
  },
  clearCart() {
    load();
    commit({ ...state, cart: [], gift: NO_GIFT });
  },
  setGift(patch: Partial<GiftOptions>) {
    load();
    const next = { ...state.gift, ...patch };
    next.message = next.message.slice(0, site.giftMessageMax);
    commit({ ...state, gift: next });
  },
  toggleWishlist(id: string): boolean {
    load();
    const has = state.wishlist.includes(id);
    commit({ ...state, wishlist: has ? state.wishlist.filter((w) => w !== id) : [...state.wishlist, id] });
    return !has;
  },
};

/** Gift wrapping is only charged when something is actually in the cart. */
export function giftFee(cart: CartLine[], gift: GiftOptions) {
  return gift.wrap && cart.length > 0 ? site.giftWrapFee : 0;
}

export function cartTotals(cart: CartLine[]) {
  let count = 0;
  let subtotal = 0;
  let savings = 0;
  for (const line of cart) {
    const p = getProductById(line.id);
    if (!p) continue;
    const pr = priceFor(p, line.option);
    count += line.qty;
    subtotal += pr.current * line.qty;
    savings += (pr.price - pr.current) * line.qty;
  }
  return { count, subtotal, savings };
}
