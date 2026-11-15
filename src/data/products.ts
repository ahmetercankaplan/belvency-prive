import type { Product } from "@/lib/types";

/**
 * NÜMAYİŞ KATALOQU — bütün məhsullar, brendlər, qiymətlər və stok məlumatları
 * dizayn nümayişi üçün uydurulub. Real məhsul və ya real stok məlumatı deyil.
 */

type Seed = Omit<Product, "id" | "rank" | "added" | "inStock" | "tags" | "specs"> & {
  tags?: Product["tags"];
  inStock?: boolean;
  specs: [string, string][];
};

const seeds: Seed[] = [
  // ───────── Ətirlər
  {
    slug: "nergiz-gecesi-etir-suyu", brandSlug: "maison-nergiz", title: "Nərgiz Gecəsi ətir suyu",
    category: "etirler", gender: "qadin", price: 289, kind: "perfume", tone: "blush",
    tags: ["yeni", "cox-satilanlar", "hediyye"],
    option: { label: "Həcm", values: [{ name: "50 ml" }, { name: "100 ml", price: 429 }] },
    description: "Ağ nərgiz, kəhrəba və sandal ağacı notlarından qurulan axşam ətri. Dəridə yumşaq açılır və saatlarla qalır.",
    specs: [["Növ", "Eau de Parfum"], ["Üst notlar", "Bergamot, armud"], ["Ürək notları", "Ağ nərgiz, yasəmən"], ["Baza notları", "Kəhrəba, sandal"]],
  },
  {
    slug: "enber-gun-batimi-etir-suyu", brandSlug: "enber-parfums", title: "Ənbər Gün Batımı ətir suyu",
    category: "etirler", gender: "uniseks", price: 349, kind: "perfume", tone: "champagne",
    tags: ["ekskluziv", "cox-satilanlar"],
    option: { label: "Həcm", values: [{ name: "50 ml" }, { name: "100 ml", price: 520 }] },
    description: "İsti kəhrəba və ədviyyə notları, sonda yumşaq vanil. Həm qadın, həm kişi üçün uyğundur.",
    specs: [["Növ", "Eau de Parfum"], ["Üst notlar", "Zəfəran, portağal"], ["Ürək notları", "Kəhrəba, qızılgül"], ["Baza notları", "Vanil, ud"]],
  },
  {
    slug: "lale-seheri-etir-suyu", brandSlug: "maison-nergiz", title: "Lalə Səhəri ətir suyu",
    category: "etirler", gender: "qadin", price: 219, salePrice: 179, kind: "perfume", tone: "rose",
    tags: ["xususi", "hediyye"],
    option: { label: "Həcm", values: [{ name: "30 ml", price: 219, salePrice: 179 }, { name: "50 ml", price: 289, salePrice: 239 }] },
    description: "Təzə lalə, yaşıl yarpaq və ağ müşk. Gündəlik istifadə üçün yüngül və təmiz ətir.",
    specs: [["Növ", "Eau de Parfum"], ["Üst notlar", "Yaşıl yarpaq, limon"], ["Ürək notları", "Lalə, şəkər çiçəyi"], ["Baza notları", "Ağ müşk"]],
  },
  {
    slug: "qara-enber-etir-suyu", brandSlug: "enber-parfums", title: "Qara Ənbər kişi ətri",
    category: "etirler", gender: "kisi", price: 319, kind: "perfume", tone: "cocoa",
    tags: ["cox-satilanlar", "hediyye"],
    option: { label: "Həcm", values: [{ name: "60 ml" }, { name: "100 ml", price: 459 }] },
    description: "Qara istiot, dəri və ənbər notlarından ibarət dərin kişi ətri.",
    specs: [["Növ", "Eau de Parfum"], ["Üst notlar", "Qara istiot, sitrus"], ["Ürək notları", "Dəri, vetiver"], ["Baza notları", "Ənbər, ud"]],
  },
  {
    slug: "serin-deniz-kisi-etri", brandSlug: "enber-parfums", title: "Sərin Dəniz kişi ətri",
    category: "etirler", gender: "kisi", price: 259, kind: "perfume", tone: "taupe",
    tags: ["yeni"],
    option: { label: "Həcm", values: [{ name: "60 ml" }, { name: "100 ml", price: 369 }] },
    description: "Dəniz duzu, mandarin və sidr ağacı. Yay üçün təravətli seçim.",
    specs: [["Növ", "Eau de Toilette"], ["Üst notlar", "Mandarin, dəniz duzu"], ["Ürək notları", "Adaçayı"], ["Baza notları", "Sidr ağacı"]],
  },

  // ───────── Makiyaj / kosmetika / qulluq / dəstlər
  {
    slug: "mexmer-dodaq-boyasi", brandSlug: "rouge-aysel", title: "Məxmər dodaq boyası",
    category: "makiyaj", gender: "qadin", price: 59, kind: "lipstick", tone: "rose",
    tags: ["cox-satilanlar"],
    option: { label: "Çalar", values: [{ name: "Gül qurusu" }, { name: "Mərcan" }, { name: "Şərab" }] },
    color: "Çəhrayı", description: "Məxmər örtüklü, dodaqları qurutmayan dodaq boyası. Bir qat da kifayətdir.",
    specs: [["Tekstura", "Məxmər"], ["Çəki", "3,5 q"], ["Örtük", "Orta–yüksək"]],
  },
  {
    slug: "isiltili-kolge-paleti", brandSlug: "rouge-aysel", title: "İşıltılı kölgə paleti",
    category: "kosmetika", gender: "qadin", price: 84, kind: "palette", tone: "champagne",
    tags: ["yeni", "hediyye"], color: "Bej",
    description: "Gündəlik və axşam görünüşü üçün altı isti çalar. Mat və işıltılı teksturalar bir yerdə.",
    specs: [["Çalar sayı", "6"], ["Tekstura", "Mat və işıltılı"], ["Çəki", "9 q"]],
  },
  {
    slug: "tonal-fondasiya", brandSlug: "rouge-aysel", title: "Tonal fondasiya",
    category: "makiyaj", gender: "qadin", price: 72, kind: "palette", tone: "ivory",
    option: { label: "Çalar", values: [{ name: "Fil sümüyü" }, { name: "Bej" }, { name: "Qum" }, { name: "Bal" }] },
    color: "Bej", description: "Dərinin təbii görünüşünü saxlayan yüngül örtüklü tonal baza.",
    specs: [["Örtük", "Yüngül–orta"], ["Həcm", "30 ml"], ["Bitmə", "Təbii parlaq"]],
  },
  {
    slug: "hialuron-nem-serumu", brandSlug: "nur-dermal", title: "Hialuron nəm serumu",
    category: "qulluq", gender: "qadin", price: 98, salePrice: 79, kind: "skincare", tone: "ivory",
    tags: ["yeni", "xususi"],
    description: "Dərini gün boyu nəmləndirən yüngül serum. Səhər və axşam təmiz dəriyə tətbiq olunur.",
    specs: [["Həcm", "30 ml"], ["Əsas tərkib", "Hialuron turşusu"], ["Dəri tipi", "Bütün dəri tipləri"]],
  },
  {
    slug: "gece-berpa-kremi", brandSlug: "nur-dermal", title: "Gecə bərpa kremi",
    category: "qulluq", gender: "qadin", price: 112, kind: "skincare", tone: "blush",
    description: "Yatmazdan əvvəl istifadə olunan zəngin tekstura. Səhər dəri yumşaq və nəm hiss olunur.",
    specs: [["Həcm", "50 ml"], ["Tekstura", "Zəngin krem"], ["İstifadə", "Axşam"]],
  },
  {
    slug: "uc-addim-qulluq-seti", brandSlug: "nur-dermal", title: "Üç addım qulluq seti",
    category: "desti", gender: "qadin", price: 189, kind: "giftbox", tone: "blush",
    tags: ["hediyye", "ekskluziv"],
    description: "Təmizləyici, serum və krem — hədiyyə qutusunda tam gündəlik rutin.",
    specs: [["Tərkib", "Təmizləyici, serum, krem"], ["Qablaşdırma", "Hədiyyə qutusu"]],
  },
  {
    slug: "mini-etir-hediyye-seti", brandSlug: "maison-nergiz", title: "Mini ətir hədiyyə seti",
    category: "desti", gender: "qadin", price: 165, kind: "giftbox", tone: "champagne",
    tags: ["hediyye", "cox-satilanlar"],
    description: "Üç fərqli ətirin mini variantı. Kimə hansı ətir uyğundur deyə düşünənlər üçün.",
    specs: [["Tərkib", "3 × 10 ml"], ["Qablaşdırma", "Hədiyyə qutusu"]],
  },

  // ───────── Zərgərlik
  {
    slug: "ay-isigi-qolbaq", brandSlug: "atelier-sevil", title: "Ay İşığı qolbaq",
    category: "bilezikler", gender: "qadin", price: 459, kind: "bracelet", tone: "champagne",
    tags: ["yeni", "cox-satilanlar"], metal: "gold", material: "Qızıl suyu",
    option: { label: "Material", values: [{ name: "Qızıl suyu" }, { name: "925 gümüş", price: 389 }] },
    description: "İncə hörgülü qolbaq, ortada kiçik aypara detalı. Gündəlik və xüsusi günlər üçün.",
    specs: [["Material", "Qızıl suyu çəkilmiş / 925 gümüş"], ["Uzunluq", "17 + 3 sm"], ["Bağlama", "Karabin"]],
  },
  {
    slug: "ince-zencir-bilerzik", brandSlug: "atelier-sevil", title: "İncə zəncir bilərzik",
    category: "bilezikler", gender: "qadin", price: 189, salePrice: 149, kind: "bracelet", tone: "taupe",
    tags: ["xususi"], metal: "silver", material: "925 gümüş",
    description: "Dəriyə yüngül oturan incə gümüş zəncir. Digər qolbaqlarla qatlanmağa uyğundur.",
    specs: [["Material", "925 gümüş"], ["Uzunluq", "16 + 4 sm"], ["Bağlama", "Karabin"]],
  },
  {
    slug: "damla-mirvari-boyunbagi", brandSlug: "orfevre-lale", title: "Damla mirvari boyunbağı",
    category: "boyunbaglar", gender: "qadin", price: 379, kind: "necklace", tone: "blush",
    tags: ["ekskluziv", "hediyye"], metal: "gold", material: "Qızıl suyu, şirin su mirvarisi",
    description: "Zərif zəncirdən asılan tək mirvari damla. Açıq yaxalıqlarla xüsusilə yaraşır.",
    specs: [["Material", "Qızıl suyu, şirin su mirvarisi"], ["Zəncir", "42 + 5 sm"], ["Mirvari", "10 mm"]],
  },
  {
    slug: "kicik-ulduz-kulon", brandSlug: "orfevre-lale", title: "Kiçik Ulduz kulon",
    category: "boyunbaglar", gender: "qadin", price: 129, kind: "necklace", tone: "ivory",
    tags: ["hediyye"], metal: "gold", material: "Qızıl suyu", inStock: false,
    description: "Gündəlik taxılan kiçik ulduz kulonu. Hədiyyə üçün sevilən seçimlərdən biridir.",
    specs: [["Material", "Qızıl suyu çəkilmiş"], ["Zəncir", "40 + 5 sm"]],
  },
  {
    slug: "solitaire-uzuk", brandSlug: "orfevre-lale", title: "Solitaire üzük",
    category: "uzukler", gender: "qadin", price: 520, kind: "ring", tone: "ivory",
    tags: ["ekskluziv", "yeni"], metal: "silver", material: "925 gümüş, sirkon",
    option: { label: "Ölçü", values: [{ name: "15" }, { name: "16" }, { name: "17" }, { name: "18" }, { name: "19" }] },
    description: "Tək daşlı klassik üzük. Sirkon daş işığı hər bucaqdan əks etdirir.",
    specs: [["Material", "925 gümüş, sirkon"], ["Daş", "6 mm"]],
  },
  {
    slug: "horgu-uzuk", brandSlug: "atelier-sevil", title: "Hörgü üzük",
    category: "uzukler", gender: "qadin", price: 149, kind: "ring", tone: "champagne",
    metal: "gold", material: "Qızıl suyu",
    option: { label: "Ölçü", values: [{ name: "15" }, { name: "16" }, { name: "17" }, { name: "18" }] },
    description: "Üç xəttin hörülməsindən yaranan sadə üzük. Tək də, qatlanmış da yaraşır.",
    specs: [["Material", "Qızıl suyu çəkilmiş"], ["Eni", "3 mm"]],
  },
  {
    slug: "mirvari-sirga", brandSlug: "orfevre-lale", title: "Mirvari sırğa",
    category: "sirgalar", gender: "qadin", price: 199, kind: "earrings", tone: "blush",
    tags: ["cox-satilanlar"], metal: "gold", material: "Qızıl suyu, şirin su mirvarisi",
    description: "Yüngül, üzün konturunu vurğulayan mirvari sırğalar.",
    specs: [["Material", "Qızıl suyu, şirin su mirvarisi"], ["Uzunluq", "3,2 sm"]],
  },
  {
    slug: "damci-sirgalar", brandSlug: "atelier-sevil", title: "Damcı sırğalar",
    category: "sirgalar", gender: "qadin", price: 169, salePrice: 135, kind: "earrings", tone: "champagne",
    tags: ["xususi"], metal: "gold", material: "Qızıl suyu",
    description: "Damla formalı yüngül sırğalar. Gündüzdən axşama keçid üçün uyğundur.",
    specs: [["Material", "Qızıl suyu çəkilmiş"], ["Uzunluq", "2,8 sm"]],
  },
  {
    slug: "mirvari-zergerlik-desti", brandSlug: "orfevre-lale", title: "Mirvari zərgərlik dəsti",
    category: "zerger-destleri", gender: "qadin", price: 689, kind: "jewelset", tone: "ivory",
    tags: ["ekskluziv", "hediyye"], metal: "gold", material: "Qızıl suyu, şirin su mirvarisi",
    description: "Boyunbağı və sırğadan ibarət dəst, xüsusi qutuda təqdim olunur.",
    specs: [["Tərkib", "Boyunbağı, sırğa"], ["Material", "Qızıl suyu, şirin su mirvarisi"], ["Qablaşdırma", "Hədiyyə qutusu"]],
  },

  // ───────── Moda
  {
    slug: "arxa-ciyin-cantasi", brandSlug: "pelle-banu", title: "Arxa çiyin çantası",
    category: "cantalar", subtype: "Çiyin çantası", gender: "qadin", price: 649, kind: "bag", tone: "taupe",
    tags: ["yeni", "cox-satilanlar"], material: "Təbii dəri",
    option: { label: "Rəng", values: [{ name: "Qum" }, { name: "Kakao" }] }, color: "Qum",
    description: "Təmiz xətli, ağır olmayan çiyin çantası. Gündəlik əşyalar üçün kifayət qədər yer verir.",
    specs: [["Material", "Təbii dəri"], ["Ölçü", "28 × 20 × 9 sm"], ["Qapanma", "Maqnit"]],
  },
  {
    slug: "mini-carpaz-canta", brandSlug: "pelle-banu", title: "Mini çarpaz çanta",
    category: "cantalar", subtype: "Çarpaz çanta", gender: "qadin", price: 429, salePrice: 359, kind: "bag", tone: "blush",
    tags: ["xususi"], material: "Təbii dəri", color: "Pudra",
    description: "Telefon, kart və kiçik əşyalar üçün kompakt çarpaz çanta. Qayış tənzimlənir.",
    specs: [["Material", "Təbii dəri"], ["Ölçü", "18 × 13 × 6 sm"], ["Qayış", "Tənzimlənən"]],
  },
  {
    slug: "mektub-cantasi", brandSlug: "pelle-banu", title: "Məktub əl çantası",
    category: "cantalar", subtype: "Əl çantası", gender: "qadin", price: 780, kind: "bag", tone: "champagne",
    tags: ["ekskluziv"], material: "Təbii dəri", color: "Konyak",
    description: "Məktub zərfini xatırladan qapaqlı əl çantası. Qızılı qapaq detalı ilə.",
    specs: [["Material", "Təbii dəri"], ["Ölçü", "26 × 18 × 8 sm"], ["Qapanma", "Metal qapaq"]],
  },
  {
    slug: "ay-fazasi-qadin-saati", brandSlug: "tempo-nur", title: "Ay Fazası qadın saatı",
    category: "saatlar", gender: "qadin", price: 560, kind: "watch", tone: "champagne",
    tags: ["yeni", "ekskluziv"], metal: "gold", material: "Paslanmayan polad",
    description: "Sədə ağ üzlü, qızılı korpuslu qadın saatı. Dəri qayışla təqdim olunur.",
    specs: [["Korpus", "32 mm, paslanmayan polad"], ["Mexanizm", "Kvars"], ["Suya davamlılıq", "3 ATM"]],
  },
  {
    slug: "klassik-gumus-saat", brandSlug: "tempo-nur", title: "Klassik gümüş saat",
    category: "saatlar", gender: "qadin", price: 480, kind: "watch", tone: "ivory",
    metal: "silver", material: "Paslanmayan polad",
    description: "Metal bilərzikli, incə korpuslu klassik qadın saatı.",
    specs: [["Korpus", "30 mm, paslanmayan polad"], ["Mexanizm", "Kvars"], ["Suya davamlılıq", "3 ATM"]],
  },
  {
    slug: "deri-dabanli-ayaqqabi", brandSlug: "pelle-banu", title: "Dəri dabanlı ayaqqabı",
    category: "ayaqqabilar", gender: "qadin", price: 310, kind: "shoe", tone: "blush",
    tags: ["cox-satilanlar"], material: "Təbii dəri", color: "Pudra",
    option: { label: "Ölçü", values: [{ name: "36" }, { name: "37" }, { name: "38" }, { name: "39" }, { name: "40" }] },
    description: "Ayağı uzadan sivri burunlu, orta hündürlükdə dabanlı ayaqqabı.",
    specs: [["Material", "Təbii dəri"], ["Daban", "7 sm"], ["Astar", "Dəri"]],
  },
  {
    slug: "sade-balet-ayaqqabisi", brandSlug: "pelle-banu", title: "Sadə balet ayaqqabısı",
    category: "ayaqqabilar", gender: "qadin", price: 240, salePrice: 199, kind: "shoe", tone: "ivory",
    tags: ["xususi"], material: "Təbii dəri", color: "Qum",
    option: { label: "Ölçü", values: [{ name: "36" }, { name: "37" }, { name: "38" }, { name: "39" }, { name: "40" }] },
    description: "Bütün gün rahat gəzmək üçün yumşaq dəri balet ayaqqabısı.",
    specs: [["Material", "Təbii dəri"], ["Taban", "Düz"], ["Astar", "Dəri"]],
  },
  {
    slug: "klassik-gunes-eynayi", brandSlug: "pelle-banu", title: "Klassik günəş eynəyi",
    category: "aksesuarlar", gender: "uniseks", price: 175, kind: "sunglasses", tone: "taupe",
    metal: "gold", color: "Qara",
    description: "Yuvarlaq çərçivəli, UV qoruyucu şüşəli günəş eynəyi.",
    specs: [["Şüşə", "UV400"], ["Çərçivə", "Metal"], ["Qutu", "Daxildir"]],
  },

  // ───────── Kişi
  {
    slug: "xronoqraf-kisi-saati", brandSlug: "tempo-nur", title: "Xronoqraf kişi saatı",
    category: "saatlar", gender: "kisi", price: 740, kind: "watch", tone: "cocoa",
    tags: ["cox-satilanlar", "ekskluziv"], metal: "gold", material: "Paslanmayan polad",
    description: "Üç alt-çevirmə və tarix göstəricisi olan xronoqraf. Dəri qayışla.",
    specs: [["Korpus", "42 mm, paslanmayan polad"], ["Mexanizm", "Kvars xronoqraf"], ["Suya davamlılıq", "5 ATM"]],
  },
  {
    slug: "minimal-deri-qayisli-saat", brandSlug: "tempo-nur", title: "Minimal dəri qayışlı saat",
    category: "saatlar", gender: "kisi", price: 420, salePrice: 349, kind: "watch", tone: "taupe",
    tags: ["xususi"], metal: "silver", material: "Paslanmayan polad",
    description: "Sadə üzlü, hər geyimlə uyğun gələn gündəlik kişi saatı.",
    specs: [["Korpus", "40 mm, paslanmayan polad"], ["Mexanizm", "Kvars"], ["Suya davamlılıq", "3 ATM"]],
  },
  {
    slug: "deri-pul-kisesi", brandSlug: "casa-zefer", title: "Dəri pul kisəsi",
    category: "pul-qabilari", gender: "kisi", price: 165, kind: "wallet", tone: "cocoa",
    tags: ["cox-satilanlar", "hediyye"], material: "Təbii dəri", color: "Kakao",
    description: "Altı kart yuvası və iki əsas bölməsi olan ikiqat pul kisəsi.",
    specs: [["Material", "Təbii dəri"], ["Ölçü", "11 × 9 sm"], ["Kart yuvası", "6"]],
  },
  {
    slug: "kart-tutacagi", brandSlug: "casa-zefer", title: "Kart tutacağı",
    category: "pul-qabilari", gender: "kisi", price: 89, kind: "wallet", tone: "taupe",
    tags: ["hediyye"], material: "Təbii dəri", color: "Qum",
    description: "Cibə rahat yerləşən nazik kart tutacağı.",
    specs: [["Material", "Təbii dəri"], ["Ölçü", "10 × 7 sm"], ["Kart yuvası", "4"]],
  },
  {
    slug: "ipek-qalstuk", brandSlug: "casa-zefer", title: "İpək qalstuk",
    category: "qalstuklar", gender: "kisi", price: 95, kind: "tie", tone: "cocoa",
    tags: ["hediyye"], material: "İpək", color: "Bordo",
    description: "Dar ipək qalstuk. Rəsmi görüşlər və xüsusi günlər üçün.",
    specs: [["Material", "100% ipək"], ["Eni", "7 sm"], ["Uzunluq", "148 sm"]],
  },
  {
    slug: "gumus-kisi-uzuyu", brandSlug: "atelier-sevil", title: "Gümüş kişi üzüyü",
    category: "uzukler", gender: "kisi", price: 210, kind: "ring", tone: "cocoa",
    metal: "silver", material: "925 gümüş",
    option: { label: "Ölçü", values: [{ name: "19" }, { name: "20" }, { name: "21" }, { name: "22" }] },
    description: "Mat səthli sadə gümüş üzük.",
    specs: [["Material", "925 gümüş"], ["Eni", "6 mm"]],
  },
  {
    slug: "kisi-zenciri", brandSlug: "atelier-sevil", title: "Gümüş kişi zənciri",
    category: "boyunbaglar", gender: "kisi", price: 260, kind: "necklace", tone: "taupe",
    metal: "silver", material: "925 gümüş",
    description: "Orta qalınlıqlı, gündəlik taxıla bilən gümüş zəncir.",
    specs: [["Material", "925 gümüş"], ["Uzunluq", "50 sm"]],
  },
  {
    slug: "pilot-gunes-eynayi", brandSlug: "casa-zefer", title: "Pilot günəş eynəyi",
    category: "aksesuarlar", gender: "kisi", price: 185, kind: "sunglasses", tone: "cocoa",
    metal: "gold", color: "Qara",
    description: "Klassik pilot formalı, UV qoruyucu günəş eynəyi.",
    specs: [["Şüşə", "UV400"], ["Çərçivə", "Metal"], ["Qutu", "Daxildir"]],
  },
];

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `p${String(i + 1).padStart(3, "0")}`,
  tags: s.tags ?? [],
  inStock: s.inStock ?? true,
  rank: i,
  // "added" is a fixed demonstration ordering, not a real date.
  added: ((i * 7) % seeds.length) + (s.tags?.includes("yeni") ? 100 : 0),
  specs: s.specs.map(([label, value]) => ({ label, value })),
}));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
