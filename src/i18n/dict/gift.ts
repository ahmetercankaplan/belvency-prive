type Q = { id: string; title: string; options: { value: string; label: string; hint?: string }[] };

const az = {
  quiz: { step: "Sual {n} / {total}", back: "Geri qayıt" },
  progress: "Hədiyyə sihirbazının irəliləyişi",
  questions: [
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
  ] as Q[],
  occasionNames: {
    sevgililer: "Sevgililər günü",
    mart8: "8 Mart",
    novruz: "Novruz",
    yeniil: "Yeni il",
    adgunu: "Ad günü",
    yubiley: "Yubiley və xüsusi tarixlər",
  } as Record<string, string>,
  wishes: {
    sevgililer: [
      "Sevgililər günün mübarək! Səninlə hər gün bayramdır.",
      "Səni sevmək ən gözəl seçimimdir.",
      "Bu gün və hər gün — yanındayam.",
    ],
    mart8: ["8 Mart bayramın mübarək! Həmişə gülümsə.", "Qadın olmaq gözəldir, sən isə ən gözəlisən.", "Sənə sağlamlıq, sevinc və zəriflik arzulayıram."],
    novruz: [
      "Novruz bayramın mübarək! Evinə bolluq, ürəyinə sevinc gəlsin.",
      "Yeni bahar sənə xoşbəxtlik gətirsin.",
      "Bayram süfrən bərəkətli, günlərin işıqlı olsun!",
    ],
    yeniil: ["Yeni ilin sənə sağlamlıq və uğur gətirsin!", "Yeni il, yeni arzular — hamısı çin olsun.", "Yeni ilin mübarək! Yanında olduğum üçün şadam."],
    adgunu: ["Ad günün mübarək! Həmişə belə gülümsə.", "Yeni yaşın sənə sevinc və uğur gətirsin.", "Sənə ən gözəl arzularımla, ad günün mübarək!"],
    yubiley: [
      "Bu xüsusi tarix mübarək! Sənə möhkəm can sağlığı arzulayıram.",
      "Hər yaşın əvvəlkindən də gözəl olsun.",
      "Bu önəmli gündə sənin yanındayam.",
    ],
  } as Record<string, string[]>,
  ui: {
    fallbackOccasion: "Hədiyyə",
    heading: "{occasion} üçün seçdiklərimiz",
    lead: "Yalnız stokda olan məhsulları seçdik. Hər birinin yanında niyə uyğun gəldiyini yazdıq.",
    pickMessage: "Kart mesajını seçin",
    ownMessage: "Mesajı özüm yazacağam (səbətdə)",
    none: "Bu seçimlərə uyğun hədiyyə tapılmadı. Başqa cavablarla yenidən cəhd edin.",
    addAsGift: "Hədiyyə kimi səbətə at",
    added: "Hədiyyə qablaşdırması və kart əlavə olundu",
    footnote: "Hədiyyə kimi əlavə etdikdə qablaşdırma seçilir və seçdiyiniz mesaj karta yazılır. Səbətdə dəyişə bilərsiniz.",
    restart: "Yenidən başla",
    changeLast: "Son cavabı dəyiş",
    allGifts: "Bütün hədiyyə seçimləri",
  },
  fit: { great: "Çox uyğun", good: "Yaxşı uyğun", alt: "Alternativ" },
  groups: { gozellik: "gözəllik", zerger: "zərgərlik", moda: "moda" } as Record<string, string>,
  reasons: {
    style: "Seçdiyiniz növdən: {group}",
    giftCollection: "Hədiyyə seçimləri kolleksiyasındandır",
    exclusive: "Eksklüziv kolleksiyadandır — xüsusi tarixlər üçün",
    inBudget: "Büdcənizə uyğundur ({price})",
    overBudget: "Büdcənizdən yuxarıdır ({price})",
    fallback: "Seçimlərinizə ən yaxın alternativdir",
  },
};

type S = typeof az;

const en: S = {
  quiz: { step: "Question {n} / {total}", back: "Go back" },
  progress: "Gift wizard progress",
  questions: [
    {
      id: "for",
      title: "Who is the gift for?",
      options: [
        { value: "qadin", label: "A woman", hint: "Wife, mother, sister, friend" },
        { value: "kisi", label: "A man", hint: "Husband, father, brother, friend" },
      ],
    },
    {
      id: "occasion",
      title: "What is the occasion?",
      options: [
        { value: "sevgililer", label: "Valentine's Day" },
        { value: "mart8", label: "8 March" },
        { value: "novruz", label: "Novruz" },
        { value: "yeniil", label: "New Year" },
        { value: "adgunu", label: "Birthday" },
        { value: "yubiley", label: "Anniversary or special date" },
      ],
    },
    {
      id: "budget",
      title: "What is your budget?",
      options: [
        { value: "100", label: "Up to 100 ₼" },
        { value: "250", label: "Up to 250 ₼" },
        { value: "500", label: "Up to 500 ₼" },
        { value: "any", label: "Doesn't matter" },
      ],
    },
    {
      id: "style",
      title: "Which type of gift feels closest?",
      options: [
        { value: "gozellik", label: "Beauty and care", hint: "Perfume, makeup, skincare" },
        { value: "zerger", label: "Jewellery", hint: "Bracelet, necklace, ring, earrings" },
        { value: "moda", label: "Fashion and accessories", hint: "Bag, watch, wallet, tie" },
        { value: "any", label: "Doesn't matter", hint: "You choose the best fit" },
      ],
    },
  ],
  occasionNames: {
    sevgililer: "Valentine's Day",
    mart8: "8 March",
    novruz: "Novruz",
    yeniil: "New Year",
    adgunu: "a birthday",
    yubiley: "an anniversary or special date",
  },
  wishes: {
    sevgililer: ["Happy Valentine's Day! Every day with you is a celebration.", "Loving you is my best choice.", "Today and every day — I am by your side."],
    mart8: ["Happy 8 March! Keep smiling, always.", "It is wonderful to be a woman, and you are the most wonderful of all.", "I wish you health, joy and grace."],
    novruz: [
      "Happy Novruz! May abundance fill your home and joy fill your heart.",
      "May the new spring bring you happiness.",
      "May your holiday table be generous and your days bright!",
    ],
    yeniil: ["May the new year bring you health and success!", "New year, new dreams — may they all come true.", "Happy New Year! I am glad to be by your side."],
    adgunu: ["Happy birthday! Keep smiling like this always.", "May your new year of life bring you joy and success.", "With my warmest wishes, happy birthday!"],
    yubiley: [
      "Congratulations on this special date! I wish you strong health.",
      "May every year of yours be even better than the last.",
      "On this important day, I am with you.",
    ],
  },
  ui: {
    fallbackOccasion: "a gift",
    heading: "Our picks for {occasion}",
    lead: "We chose only products that are in stock, and next to each one we explain why it fits.",
    pickMessage: "Choose the card message",
    ownMessage: "I will write the message myself (in the cart)",
    none: "No gift matched these choices. Try again with different answers.",
    addAsGift: "Add to cart as a gift",
    added: "Gift wrapping and card added",
    footnote: "Adding it as a gift selects wrapping and writes your chosen message on the card. You can change it in the cart.",
    restart: "Start over",
    changeLast: "Change the last answer",
    allGifts: "All gift picks",
  },
  fit: { great: "Great match", good: "Good match", alt: "Alternative" },
  groups: { gozellik: "beauty", zerger: "jewellery", moda: "fashion" },
  reasons: {
    style: "From the type you chose: {group}",
    giftCollection: "From the Gift Picks collection",
    exclusive: "From the Exclusive collection — for special dates",
    inBudget: "Within your budget ({price})",
    overBudget: "Above your budget ({price})",
    fallback: "The closest alternative to your choices",
  },
};

const ru: S = {
  quiz: { step: "Вопрос {n} / {total}", back: "Назад" },
  progress: "Прогресс помощника по подаркам",
  questions: [
    {
      id: "for",
      title: "Для кого подарок?",
      options: [
        { value: "qadin", label: "Для женщины", hint: "Жена, мама, сестра, подруга" },
        { value: "kisi", label: "Для мужчины", hint: "Муж, отец, брат, друг" },
      ],
    },
    {
      id: "occasion",
      title: "По какому поводу?",
      options: [
        { value: "sevgililer", label: "День святого Валентина" },
        { value: "mart8", label: "8 Марта" },
        { value: "novruz", label: "Новруз" },
        { value: "yeniil", label: "Новый год" },
        { value: "adgunu", label: "День рождения" },
        { value: "yubiley", label: "Юбилей или особая дата" },
      ],
    },
    {
      id: "budget",
      title: "Каков ваш бюджет?",
      options: [
        { value: "100", label: "До 100 ₼" },
        { value: "250", label: "До 250 ₼" },
        { value: "500", label: "До 500 ₼" },
        { value: "any", label: "Не важно" },
      ],
    },
    {
      id: "style",
      title: "Какой вид подарка вам ближе?",
      options: [
        { value: "gozellik", label: "Красота и уход", hint: "Парфюмерия, макияж, уход за кожей" },
        { value: "zerger", label: "Украшения", hint: "Браслет, колье, кольцо, серьги" },
        { value: "moda", label: "Мода и аксессуары", hint: "Сумка, часы, кошелёк, галстук" },
        { value: "any", label: "Не важно", hint: "Выберите самое подходящее" },
      ],
    },
  ],
  occasionNames: {
    sevgililer: "День святого Валентина",
    mart8: "8 Марта",
    novruz: "Новруз",
    yeniil: "Новый год",
    adgunu: "День рождения",
    yubiley: "Юбилей и особые даты",
  },
  wishes: {
    sevgililer: ["С Днём святого Валентина! С тобой каждый день — праздник.", "Любить тебя — мой лучший выбор.", "Сегодня и каждый день — я рядом."],
    mart8: ["С 8 Марта! Пусть улыбка не сходит с твоего лица.", "Быть женщиной прекрасно, а ты — самая прекрасная.", "Желаю тебе здоровья, радости и изящества."],
    novruz: [
      "С праздником Новруз! Пусть в твой дом придёт достаток, а в сердце — радость.",
      "Пусть новая весна принесёт тебе счастье.",
      "Пусть праздничный стол будет щедрым, а дни — светлыми!",
    ],
    yeniil: ["Пусть Новый год принесёт тебе здоровье и успех!", "Новый год, новые мечты — пусть все они сбудутся.", "С Новым годом! Я рад быть рядом с тобой."],
    adgunu: ["С днём рождения! Пусть улыбка всегда будет такой же.", "Пусть новый год жизни принесёт тебе радость и удачу.", "С самыми тёплыми пожеланиями — с днём рождения!"],
    yubiley: [
      "С этой особой датой! Желаю тебе крепкого здоровья.",
      "Пусть каждый твой год будет лучше предыдущего.",
      "В этот важный день я с тобой.",
    ],
  },
  ui: {
    fallbackOccasion: "подарок",
    heading: "Наш выбор: {occasion}",
    lead: "Мы выбрали только товары, которые есть в наличии, и рядом с каждым объяснили, почему он подходит.",
    pickMessage: "Выберите текст для открытки",
    ownMessage: "Напишу сообщение сам (в корзине)",
    none: "По этим ответам подходящих подарков не нашлось. Попробуйте другие ответы.",
    addAsGift: "В корзину как подарок",
    added: "Подарочная упаковка и открытка добавлены",
    footnote: "При добавлении в виде подарка выбирается упаковка, а выбранное сообщение печатается на открытке. Изменить можно в корзине.",
    restart: "Начать заново",
    changeLast: "Изменить последний ответ",
    allGifts: "Все подарки",
  },
  fit: { great: "Отлично подходит", good: "Хорошо подходит", alt: "Альтернатива" },
  groups: { gozellik: "красота", zerger: "украшения", moda: "мода" },
  reasons: {
    style: "Из выбранного вами вида: {group}",
    giftCollection: "Из коллекции «Подарки»",
    exclusive: "Из эксклюзивной коллекции — для особых дат",
    inBudget: "Укладывается в бюджет ({price})",
    overBudget: "Выше вашего бюджета ({price})",
    fallback: "Ближайшая альтернатива вашему выбору",
  },
};

export const gift = { az, en, ru };
