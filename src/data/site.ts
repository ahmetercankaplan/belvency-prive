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
  supportPhone: "+994 12 000 00 00",
  supportEmail: "salam@belvency.example",
  hours: "Hər gün 10:00 – 20:00",
};

export const mainNav = [
  { href: "/qadin", label: "Qadın", menu: "qadin" as const },
  { href: "/kisi", label: "Kişi", menu: "kisi" as const },
  { href: "/brendler", label: "Brendlər" },
  { href: "/kataloq/hediyye-secimleri", label: "Hədiyyə" },
  { href: "/kataloq/xususi-teklifler", label: "Təkliflər" },
];

export const regions = [
  "Bakı",
  "Sumqayıt",
  "Gəncə",
  "Mingəçevir",
  "Şəki",
  "Lənkəran",
  "Quba",
  "Digər rayon",
];
