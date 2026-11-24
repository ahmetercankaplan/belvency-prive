import raw from "@/data/catalog.snapshot.json";
import type { Brand, Product } from "@/lib/types";

/**
 * Build-time switches (set as environment variables in Netlify).
 *
 *  NEXT_PUBLIC_INDEXABLE=1   let search engines in. Leave unset until the shop is really open.
 *  NEXT_PUBLIC_SITE_URL      canonical origin, e.g. https://belvency.az (no trailing slash)
 */
export const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "1";
/** Card checkout switch (must match CARD_PAYMENTS=on on the server). Legal pages describe card payment only when on. */
export const cardPayments = process.env.NEXT_PUBLIC_CARD_PAYMENTS === "on";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

/** Written by scripts/snapshot-catalog.ts before every dev/build. */
export const snapshot = raw as { source: "demo" | "live"; products?: Product[]; brands?: Brand[]; generatedAt?: string };
/** true = the real shop (admin catalog); false = design demo. */
export const live = snapshot.source === "live";
