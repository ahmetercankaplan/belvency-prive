import { seller } from "./legal.ts";

export const site = {
  name: "BELVENCY",
  descriptor: "Privé",
  fullName: "Belvency Privé",
  tagline: "Zövqlə seçilmiş lüks",
  /** Demonstration shipping rules — replace once real logistics exist. */
  freeDeliveryFrom: 150,
  bakuDeliveryFee: 5,
  regionDeliveryFee: 8,
  giftWrapFee: 4,
  giftMessageMax: 160,
  // single source of truth: src/data/legal.ts
  supportPhone: seller.phone,
  supportEmail: seller.email,
};

export const mainNav = [
  { href: "/qadin", key: "women" as const, menu: "qadin" as const },
  { href: "/kisi", key: "men" as const, menu: "kisi" as const },
  { href: "/brendler", key: "brands" as const },
  { href: "/kataloq/hediyye-secimleri", key: "gift" as const },
  { href: "/kataloq/xususi-teklifler", key: "offers" as const },
] as { href: string; key: "women" | "men" | "brands" | "gift" | "offers"; menu?: "qadin" | "kisi" }[];

/** Region ids stay Azerbaijani (the server prices delivery by them); the label comes from i18n catalog.regions. */
export const regions = ["Bakı", "Sumqayıt", "Gəncə", "Mingəçevir", "Şəki", "Lənkəran", "Quba", "Digər rayon"];
