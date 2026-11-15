export type Gender = "qadin" | "kisi" | "uniseks";

export type ArtKind =
  | "perfume"
  | "ring"
  | "necklace"
  | "bracelet"
  | "earrings"
  | "jewelset"
  | "bag"
  | "watch"
  | "shoe"
  | "lipstick"
  | "palette"
  | "skincare"
  | "giftbox"
  | "wallet"
  | "tie"
  | "sunglasses";

export type Tone = "blush" | "champagne" | "ivory" | "taupe" | "cocoa" | "rose";

export type Tag = "yeni" | "cox-satilanlar" | "ekskluziv" | "hediyye" | "xususi";

export interface OptionValue {
  name: string;
  price?: number;
  salePrice?: number;
  /** units on hand for this variant (real catalog). Undefined = demo/unlimited. */
  stock?: number;
}

export interface ProductOption {
  label: string;
  values: OptionValue[];
}

export interface Product {
  id: string;
  slug: string;
  brandSlug: string;
  title: string;
  category: string;
  subtype?: string;
  gender: Gender;
  price: number;
  salePrice?: number;
  kind: ArtKind;
  tone: Tone;
  metal?: "gold" | "silver";
  tags: Tag[];
  option?: ProductOption;
  material?: string;
  color?: string;
  inStock: boolean;
  /** units on hand when the product has no options (real catalog) */
  stock?: number;
  /** uploaded product photos (first one is the cover); empty = illustrated fallback */
  images?: string[];
  /** lower = more prominent in "Tövsiyə olunan" */
  rank: number;
  /** higher = newer */
  added: number;
  description: string;
  specs: { label: string; value: string }[];
}

export interface Category {
  slug: string;
  title: string;
  group: string;
  blurb: string;
  kind: ArtKind;
  tone: Tone;
}

export interface CategoryGroup {
  slug: string;
  title: string;
  blurb: string;
}

export interface Collection {
  slug: string;
  title: string;
  blurb: string;
}

export interface Brand {
  slug: string;
  name: string;
  specialty: string;
  blurb: string;
  tone: Tone;
  kind: ArtKind;
}

export interface GiftOptions {
  /** gift wrapping requested */
  wrap: boolean;
  /** handwritten card text (max 160 chars) */
  message: string;
}

export interface CartLine {
  id: string;
  option?: string;
  qty: number;
}
