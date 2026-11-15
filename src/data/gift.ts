import type { QuizQuestionDef } from "@/components/shop/QuizFlow";

export const giftQuestions: QuizQuestionDef[] = [
  {
    id: "for",
    title: "Hədiyyə kimə üçündür?",
    options: [
      { value: "qadin", label: "Qadına", hint: "Həyat yoldaşı, ana, bacı, dost" },
      { value: "kisi", label: "Kişiyə", hint: "Həyat yoldaşı, ata, qardaş, dost" },
    ],
  },
  {
    id: "occasion",
    title: "Hansı münasibətlə?",
    options: [
      { value: "sevgililer", label: "Sevgililər günü" },
      { value: "mart8", label: "8 Mart" },
      { value: "novruz", label: "Novruz" },
      { value: "yeniil", label: "Yeni il" },
      { value: "adgunu", label: "Ad günü" },
      { value: "yubiley", label: "Yubiley və ya xüsusi tarix" },
    ],
  },
  {
    id: "budget",
    title: "Büdcəniz nə qədərdir?",
    options: [
      { value: "100", label: "100 ₼-dək" },
      { value: "250", label: "250 ₼-dək" },
      { value: "500", label: "500 ₼-dək" },
      { value: "any", label: "Fərq etmir" },
    ],
  },
  {
    id: "style",
    title: "Hansı hədiyyə növü daha yaxındır?",
    options: [
      { value: "gozellik", label: "Gözəllik və qulluq", hint: "Ətir, makiyaj, dəri qulluğu" },
      { value: "zerger", label: "Zərgərlik", hint: "Qolbaq, boyunbağı, üzük, sırğa" },
      { value: "moda", label: "Moda və aksesuar", hint: "Çanta, saat, pul qabısı, qalstuk" },
      { value: "any", label: "Fərq etmir", hint: "Ən uyğununu siz seçin" },
    ],
  },
];

export const occasionNames: Record<string, string> = {
  sevgililer: "Sevgililər günü",
  mart8: "8 Mart",
  novruz: "Novruz",
  yeniil: "Yeni il",
  adgunu: "Ad günü",
  yubiley: "Yubiley və xüsusi tarixlər",
};

/** Card wishes (max 160 characters each) the customer can pick or edit. */
export const wishes: Record<string, string[]> = {
  sevgililer: [
    "Sevgililər günün mübarək! Səninlə hər gün bayramdır.",
    "Səni sevmək ən gözəl seçimimdir.",
    "Bu gün və hər gün — yanındayam.",
  ],
  mart8: [
    "8 Mart bayramın mübarək! Həmişə gülümsə.",
    "Qadın olmaq gözəldir, sən isə ən gözəlisən.",
    "Sənə sağlamlıq, sevinc və zəriflik arzulayıram.",
  ],
  novruz: [
    "Novruz bayramın mübarək! Evinə bolluq, ürəyinə sevinc gəlsin.",
    "Yeni bahar sənə xoşbəxtlik gətirsin.",
    "Bayram süfrən bərəkətli, günlərin işıqlı olsun!",
  ],
  yeniil: [
    "Yeni ilin sənə sağlamlıq və uğur gətirsin!",
    "Yeni il, yeni arzular — hamısı çin olsun.",
    "Yeni ilin mübarək! Yanında olduğum üçün şadam.",
  ],
  adgunu: [
    "Ad günün mübarək! Həmişə belə gülümsə.",
    "Yeni yaşın sənə sevinc və uğur gətirsin.",
    "Sənə ən gözəl arzularımla, ad günün mübarək!",
  ],
  yubiley: [
    "Bu xüsusi tarix mübarək! Sənə möhkəm can sağlığı arzulayıram.",
    "Hər yaşın əvvəlkindən də gözəl olsun.",
    "Bu önəmli gündə sənin yanındayam.",
  ],
};
