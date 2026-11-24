type Entry = { title: string; blurb: string };

const az = {
  genders: { qadin: "Qadın", kisi: "Kişi", uniseks: "Unisex" },
  sorts: { tovsiye: "Tövsiyə olunan", yeni: "Ən yeni", ucuz: "Qiymət: azdan çoxa", bahali: "Qiymət: çoxdan aza" },
  tags: { yeni: "Yeni", "cox-satilanlar": "Çox satılan", ekskluziv: "Eksklüziv", hediyye: "Hədiyyə", xususi: "Xüsusi təklif" },
  groups: {
    gozellik: { title: "Gözəllik", blurb: "Ətirlər, makiyaj və gündəlik qulluq — hər biri diqqətlə seçilib." },
    zerger: { title: "Zərgərlik", blurb: "Qolbaqlar, boyunbağılar, üzüklər və sırğalar." },
    moda: { title: "Moda", blurb: "Çantalar, saatlar, ayaqqabılar və aksesuarlar." },
  } as Record<string, Entry>,
  categories: {
    etirler: { title: "Ətirlər", blurb: "Gün boyu izini saxlayan ətir suları və kölnlər." },
    kosmetika: { title: "Kosmetika", blurb: "Kölgələr, palitralar və üz üçün incə detallar." },
    makiyaj: { title: "Makiyaj", blurb: "Dodaq boyaları, fondasiyalar və tamamlayıcılar." },
    qulluq: { title: "Dəri qulluğu", blurb: "Serumlar, kremlər və gündəlik qulluq rutinləri." },
    desti: { title: "Gözəllik dəstləri", blurb: "Hədiyyə qutusunda hazır gözəllik dəstləri." },
    bilezikler: { title: "Qolbaqlar", blurb: "Qızıl suyu və gümüş qolbaqlar, incə zəncirlər." },
    boyunbaglar: { title: "Boyunbağılar", blurb: "Kulonlar, mirvari və zəncir boyunbağılar." },
    uzukler: { title: "Üzüklər", blurb: "Solitaire, hörgü və gündəlik üzüklər." },
    sirgalar: { title: "Sırğalar", blurb: "Mirvari və damcı sırğalar." },
    "zerger-destleri": { title: "Zərgərlik dəstləri", blurb: "Bir-birini tamamlayan boyunbağı və sırğa dəstləri." },
    cantalar: { title: "Çantalar", blurb: "Çiyin, çarpaz və əl çantaları." },
    saatlar: { title: "Saatlar", blurb: "Qadın və kişi qol saatları." },
    ayaqqabilar: { title: "Ayaqqabılar", blurb: "Dabanlı və düz tabanlı dəri ayaqqabılar." },
    aksesuarlar: { title: "Aksesuarlar", blurb: "Günəş eynəkləri və tamamlayıcı detallar." },
    "pul-qabilari": { title: "Pul qabıları", blurb: "Dəri pul kisələri və kart tutacaqları." },
    qalstuklar: { title: "Qalstuklar", blurb: "İpək və toxunma qalstuklar." },
  } as Record<string, Entry>,
  collections: {
    "yeni-gelenler": { title: "Yeni Gələnlər", blurb: "Kolleksiyaya ən son əlavə olunan modellər." },
    "cox-satilanlar": { title: "Çox Satılanlar", blurb: "Müştərilərimizin ən çox seçdiyi məhsullar." },
    "ekskluziv-kolleksiya": { title: "Eksklüziv Kolleksiya", blurb: "Məhdud sayda təqdim olunan xüsusi seçimlər." },
    "hediyye-secimleri": { title: "Hədiyyə Seçimləri", blurb: "Sevdiklərinizə verməyə dəyər hədiyyələr." },
    "xususi-teklifler": { title: "Xüsusi Təkliflər", blurb: "Endirimdə olan seçilmiş məhsullar." },
  } as Record<string, Entry>,
  regions: ["Bakı", "Sumqayıt", "Gəncə", "Mingəçevir", "Şəki", "Lənkəran", "Quba", "Digər rayon"],
};

type S = typeof az;

const en: S = {
  genders: { qadin: "Women", kisi: "Men", uniseks: "Unisex" },
  sorts: { tovsiye: "Recommended", yeni: "Newest", ucuz: "Price: low to high", bahali: "Price: high to low" },
  tags: { yeni: "New", "cox-satilanlar": "Bestseller", ekskluziv: "Exclusive", hediyye: "Gift", xususi: "Special offer" },
  groups: {
    gozellik: { title: "Beauty", blurb: "Perfumes, makeup and daily care, each one carefully chosen." },
    zerger: { title: "Jewellery", blurb: "Bracelets, necklaces, rings and earrings." },
    moda: { title: "Fashion", blurb: "Bags, watches, shoes and accessories." },
  },
  categories: {
    etirler: { title: "Perfumes", blurb: "Eaux de parfum and colognes that linger all day." },
    kosmetika: { title: "Cosmetics", blurb: "Eyeshadows, palettes and fine details for the face." },
    makiyaj: { title: "Makeup", blurb: "Lipsticks, foundations and finishing touches." },
    qulluq: { title: "Skincare", blurb: "Serums, creams and daily care routines." },
    desti: { title: "Beauty sets", blurb: "Ready-made beauty sets in gift boxes." },
    bilezikler: { title: "Bracelets", blurb: "Gold-plated and silver bracelets, delicate chains." },
    boyunbaglar: { title: "Necklaces", blurb: "Pendants, pearl and chain necklaces." },
    uzukler: { title: "Rings", blurb: "Solitaire, braided and everyday rings." },
    sirgalar: { title: "Earrings", blurb: "Pearl and drop earrings." },
    "zerger-destleri": { title: "Jewellery sets", blurb: "Necklace and earring sets that complement each other." },
    cantalar: { title: "Bags", blurb: "Shoulder, crossbody and hand bags." },
    saatlar: { title: "Watches", blurb: "Women's and men's wristwatches." },
    ayaqqabilar: { title: "Shoes", blurb: "Heeled and flat leather shoes." },
    aksesuarlar: { title: "Accessories", blurb: "Sunglasses and finishing details." },
    "pul-qabilari": { title: "Wallets", blurb: "Leather purses and card holders." },
    qalstuklar: { title: "Ties", blurb: "Silk and knitted ties." },
  },
  collections: {
    "yeni-gelenler": { title: "New Arrivals", blurb: "The latest models added to the collection." },
    "cox-satilanlar": { title: "Bestsellers", blurb: "The products our customers choose most." },
    "ekskluziv-kolleksiya": { title: "Exclusive Collection", blurb: "Special selections offered in limited numbers." },
    "hediyye-secimleri": { title: "Gift Picks", blurb: "Gifts worth giving to the people you love." },
    "xususi-teklifler": { title: "Special Offers", blurb: "Selected products on sale." },
  },
  regions: ["Baku", "Sumgait", "Ganja", "Mingachevir", "Sheki", "Lankaran", "Guba", "Other region"],
};

const ru: S = {
  genders: { qadin: "Женщинам", kisi: "Мужчинам", uniseks: "Унисекс" },
  sorts: { tovsiye: "Рекомендуемые", yeni: "Сначала новые", ucuz: "Цена: по возрастанию", bahali: "Цена: по убыванию" },
  tags: { yeni: "Новинка", "cox-satilanlar": "Хит продаж", ekskluziv: "Эксклюзив", hediyye: "Подарок", xususi: "Спецпредложение" },
  groups: {
    gozellik: { title: "Красота", blurb: "Парфюмерия, макияж и ежедневный уход — всё тщательно отобрано." },
    zerger: { title: "Украшения", blurb: "Браслеты, колье, кольца и серьги." },
    moda: { title: "Мода", blurb: "Сумки, часы, обувь и аксессуары." },
  },
  categories: {
    etirler: { title: "Парфюмерия", blurb: "Парфюмерные воды и одеколоны, стойкие в течение всего дня." },
    kosmetika: { title: "Косметика", blurb: "Тени, палетки и тонкие детали для лица." },
    makiyaj: { title: "Макияж", blurb: "Помады, тональные средства и завершающие штрихи." },
    qulluq: { title: "Уход за кожей", blurb: "Сыворотки, кремы и ежедневные ритуалы ухода." },
    desti: { title: "Наборы для красоты", blurb: "Готовые наборы для красоты в подарочной коробке." },
    bilezikler: { title: "Браслеты", blurb: "Позолоченные и серебряные браслеты, тонкие цепочки." },
    boyunbaglar: { title: "Колье и подвески", blurb: "Подвески, жемчужные колье и цепочки." },
    uzukler: { title: "Кольца", blurb: "Кольца с солитером, плетёные и на каждый день." },
    sirgalar: { title: "Серьги", blurb: "Жемчужные серьги и серьги-капли." },
    "zerger-destleri": { title: "Комплекты украшений", blurb: "Колье и серьги, дополняющие друг друга." },
    cantalar: { title: "Сумки", blurb: "Сумки на плечо, кросс-боди и ручные сумки." },
    saatlar: { title: "Часы", blurb: "Женские и мужские наручные часы." },
    ayaqqabilar: { title: "Обувь", blurb: "Кожаная обувь на каблуке и на плоской подошве." },
    aksesuarlar: { title: "Аксессуары", blurb: "Солнцезащитные очки и завершающие детали образа." },
    "pul-qabilari": { title: "Кошельки", blurb: "Кожаные кошельки и картхолдеры." },
    qalstuklar: { title: "Галстуки", blurb: "Шёлковые и вязаные галстуки." },
  },
  collections: {
    "yeni-gelenler": { title: "Новинки", blurb: "Последние модели, добавленные в коллекцию." },
    "cox-satilanlar": { title: "Хиты продаж", blurb: "Товары, которые клиенты выбирают чаще всего." },
    "ekskluziv-kolleksiya": { title: "Эксклюзивная коллекция", blurb: "Особые позиции в ограниченном количестве." },
    "hediyye-secimleri": { title: "Подарки", blurb: "Подарки, которые приятно дарить близким." },
    "xususi-teklifler": { title: "Спецпредложения", blurb: "Избранные товары со скидкой." },
  },
  regions: ["Баку", "Сумгаит", "Гянджа", "Мингечевир", "Шеки", "Ленкорань", "Губа", "Другой район"],
};

export const catalog = { az, en, ru };
