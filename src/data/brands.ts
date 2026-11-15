import type { Brand } from "@/lib/types";

/**
 * Bütün brendlər nümayiş üçün uydurulmuş adlardır.
 * Belvency Privé heç bir real brendlə rəsmi əməkdaşlıq iddiası etmir.
 */
export const brands: Brand[] = [
  {
    slug: "maison-nergiz",
    name: "Maison Nərgiz",
    specialty: "Ətirlər",
    blurb: "Çiçək və odunsu notlar üzərində qurulan yumşaq, uzunömürlü ətirlər.",
    tone: "blush",
    kind: "perfume",
  },
  {
    slug: "enber-parfums",
    name: "Ənbər Parfums",
    specialty: "Ətirlər",
    blurb: "Kəhrəba, ud və ədviyyə notları ilə dərin, isti ətir kolleksiyası.",
    tone: "champagne",
    kind: "perfume",
  },
  {
    slug: "rouge-aysel",
    name: "Rouge Aysel",
    specialty: "Makiyaj",
    blurb: "Məxmər teksturalı dodaq boyaları və işıltılı kölgələr.",
    tone: "rose",
    kind: "lipstick",
  },
  {
    slug: "nur-dermal",
    name: "Nur Dermal",
    specialty: "Dəri qulluğu",
    blurb: "Sadə tərkibli, gündəlik istifadə üçün nəzərdə tutulan qulluq xətti.",
    tone: "ivory",
    kind: "skincare",
  },
  {
    slug: "atelier-sevil",
    name: "Atelier Sevil",
    specialty: "Zərgərlik",
    blurb: "İncə xətlərlə işlənmiş qolbaq, üzük və sırğalar.",
    tone: "champagne",
    kind: "bracelet",
  },
  {
    slug: "orfevre-lale",
    name: "Orfèvre Lalə",
    specialty: "Zərgərlik",
    blurb: "Mirvari və daş detallı, xüsusi günlər üçün zərgərlik.",
    tone: "blush",
    kind: "necklace",
  },
  {
    slug: "pelle-banu",
    name: "Pelle Banu",
    specialty: "Çanta və ayaqqabı",
    blurb: "Təmiz xətli dəri çantalar və ayaqqabılar.",
    tone: "taupe",
    kind: "bag",
  },
  {
    slug: "tempo-nur",
    name: "Tempo Nur",
    specialty: "Saatlar",
    blurb: "Qadın və kişilər üçün sadə, oxunaqlı üzlü saatlar.",
    tone: "cocoa",
    kind: "watch",
  },
  {
    slug: "casa-zefer",
    name: "Casa Zəfər",
    specialty: "Kişi aksesuarları",
    blurb: "Pul qabıları, qalstuklar və gündəlik kişi aksesuarları.",
    tone: "cocoa",
    kind: "wallet",
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
