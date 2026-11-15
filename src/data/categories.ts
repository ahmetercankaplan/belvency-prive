import type { Category, CategoryGroup, Collection, Gender } from "@/lib/types";

export const groups: CategoryGroup[] = [
  {
    slug: "gozellik",
    title: "Gözəllik",
    blurb: "Ətirlər, makiyaj və gündəlik qulluq — hər biri diqqətlə seçilib.",
  },
  {
    slug: "zerger",
    title: "Zərgərlik",
    blurb: "Qolbaqlar, boyunbağılar, üzüklər və sırğalar.",
  },
  {
    slug: "moda",
    title: "Moda",
    blurb: "Çantalar, saatlar, ayaqqabılar və aksesuarlar.",
  },
];

export const categories: Category[] = [
  { slug: "etirler", title: "Ətirlər", group: "gozellik", blurb: "Gün boyu izini saxlayan ətir suları və kölnlər.", kind: "perfume", tone: "blush" },
  { slug: "kosmetika", title: "Kosmetika", group: "gozellik", blurb: "Kölgələr, palitralar və üz üçün incə detallar.", kind: "palette", tone: "champagne" },
  { slug: "makiyaj", title: "Makiyaj", group: "gozellik", blurb: "Dodaq boyaları, fondasiyalar və tamamlayıcılar.", kind: "lipstick", tone: "rose" },
  { slug: "qulluq", title: "Dəri qulluğu", group: "gozellik", blurb: "Serumlar, kremlər və gündəlik qulluq rutinləri.", kind: "skincare", tone: "ivory" },
  { slug: "desti", title: "Gözəllik dəstləri", group: "gozellik", blurb: "Hədiyyə qutusunda hazır gözəllik dəstləri.", kind: "giftbox", tone: "blush" },

  { slug: "bilezikler", title: "Qolbaqlar", group: "zerger", blurb: "Qızıl suyu və gümüş qolbaqlar, incə zəncirlər.", kind: "bracelet", tone: "champagne" },
  { slug: "boyunbaglar", title: "Boyunbağılar", group: "zerger", blurb: "Kulonlar, mirvari və zəncir boyunbağılar.", kind: "necklace", tone: "blush" },
  { slug: "uzukler", title: "Üzüklər", group: "zerger", blurb: "Solitaire, hörgü və gündəlik üzüklər.", kind: "ring", tone: "ivory" },
  { slug: "sirgalar", title: "Sırğalar", group: "zerger", blurb: "Mirvari və damcı sırğalar.", kind: "earrings", tone: "blush" },
  { slug: "zerger-destleri", title: "Zərgərlik dəstləri", group: "zerger", blurb: "Bir-birini tamamlayan boyunbağı və sırğa dəstləri.", kind: "jewelset", tone: "ivory" },

  { slug: "cantalar", title: "Çantalar", group: "moda", blurb: "Çiyin, çarpaz və əl çantaları.", kind: "bag", tone: "taupe" },
  { slug: "saatlar", title: "Saatlar", group: "moda", blurb: "Qadın və kişi qol saatları.", kind: "watch", tone: "champagne" },
  { slug: "ayaqqabilar", title: "Ayaqqabılar", group: "moda", blurb: "Dabanlı və düz tabanlı dəri ayaqqabılar.", kind: "shoe", tone: "blush" },
  { slug: "aksesuarlar", title: "Aksesuarlar", group: "moda", blurb: "Günəş eynəkləri və tamamlayıcı detallar.", kind: "sunglasses", tone: "taupe" },
  { slug: "pul-qabilari", title: "Pul qabıları", group: "moda", blurb: "Dəri pul kisələri və kart tutacaqları.", kind: "wallet", tone: "cocoa" },
  { slug: "qalstuklar", title: "Qalstuklar", group: "moda", blurb: "İpək və toxunma qalstuklar.", kind: "tie", tone: "cocoa" },
];

export const collections: Collection[] = [
  { slug: "yeni-gelenler", title: "Yeni Gələnlər", blurb: "Kolleksiyaya ən son əlavə olunan modellər." },
  { slug: "cox-satilanlar", title: "Çox Satılanlar", blurb: "Müştərilərimizin ən çox seçdiyi məhsullar." },
  { slug: "ekskluziv-kolleksiya", title: "Eksklüziv Kolleksiya", blurb: "Məhdud sayda təqdim olunan xüsusi seçimlər." },
  { slug: "hediyye-secimleri", title: "Hədiyyə Seçimləri", blurb: "Sevdiklərinizə verməyə dəyər hədiyyələr." },
  { slug: "xususi-teklifler", title: "Xüsusi Təkliflər", blurb: "Endirimdə olan seçilmiş məhsullar." },
];

export const genderLabels: Record<Gender, string> = {
  qadin: "Qadın",
  kisi: "Kişi",
  uniseks: "Unisex",
};

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getGroup = (slug: string) => groups.find((g) => g.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const categoriesOfGroup = (group: string) => categories.filter((c) => c.group === group);
