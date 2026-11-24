/** Section of a legal page. Text may contain [label](/path) links, rendered by <Rich>. */
type Sec = { title: string; p?: string[]; ul?: string[]; after?: string };

const az = {
  updated: "Son yenilənmə: {date}",
  translationNote: "",
  pending: "doldurulmalıdır",
  sellerRows: {
    seller: "Satıcı",
    form: "Hüquqi forma",
    voen: "VÖEN",
    registry: "Dövlət qeydiyyatı",
    address: "Ünvan",
    phone: "Telefon",
    email: "E-poçt",
    hours: "İş saatları",
  },
  units: {
    day: ["gün"],
    bizDay: ["iş günü"],
    payer: { buyer: "alıcı", seller: "satıcı" },
  },
  terms: {
    crumb: "Satış şərtləri",
    title: "Satış şərtləri və istifadə qaydaları",
    description: "Belvency Privé onlayn mağazasından alış-verişin şərtləri: sifariş, qiymət, ödəniş, çatdırılma və məsuliyyət.",
    intro:
      "Bu sənəd {name} onlayn mağazasından alış-verişin qaydalarını müəyyən edir. Saytda sifariş verməklə bu şərtlərlə razılaşmış olursunuz. Şərtlər Azərbaycan Respublikasının “İstehlakçıların hüquqlarının müdafiəsi haqqında” və “Elektron ticarət haqqında” qanunlarına uyğun tərtib olunub.",
    seller: { title: "Satıcı", p: "Saytdakı bütün məhsulların satıcısı yuxarıda göstərilən şəxsdir. Əlaqə vasitələri üçün [Əlaqə](/elaqe) səhifəsinə də baxa bilərsiniz." },
    products: {
      title: "Məhsullar və qiymətlər",
      ul: [
        "Qiymətlər Azərbaycan manatı (₼) ilə göstərilir.",
        "Çatdırılma haqqı və hədiyyə qablaşdırması haqqı ({fee}) məhsulun qiymətinə daxil deyil; sifarişi təsdiqləməzdən əvvəl səbətdə ayrıca göstərilir.",
        "Foto və təsvirlər məhsulu mümkün qədər dəqiq göstərir; ekran parametrlərinə görə rəng cüzi fərqlənə bilər.",
        "Qiymət və ya stok məlumatında açıq texniki səhv aşkarlansa, sifarişi təsdiqləməzdən əvvəl sizinlə əlaqə saxlayıb düzəlişi razılaşdırırıq.",
      ],
    },
    ordering: {
      title: "Sifarişin verilməsi və təsdiqi",
      ul: [
        "Məhsulu səbətə əlavə edin, ödəniş səhifəsində ad, telefon və çatdırılma ünvanını yazın və sifarişi göndərin.",
        "Sifariş göndərildikdən sonra sizə sifariş nömrəsi göstərilir. Sifariş operatorumuz sizinlə əlaqə saxlayıb təsdiqlədikdən sonra qəti hesab olunur.",
        "Stok qalmadıqda və ya məhsul təmin edilə bilmədikdə sizi məlumatlandırırıq; ödəniş artıq edilibsə, məbləğ tam geri qaytarılır.",
        "Yanlış və ya natamam məlumat verilməsi nəticəsində yaranan gecikməyə və xərclərə satıcı məsuliyyət daşımır.",
      ],
    },
    payment: {
      title: "Ödəniş",
      cash: "Sifarişin ödənişi çatdırılma zamanı kuryerə nağd edilir.",
      card: "Sifarişin ödənişi çatdırılma zamanı nağd və ya bank kartı ilə onlayn edilə bilər. Kartla ödəniş lisenziyalı ödəniş xidməti vasitəsilə aparılır; kart məlumatları bizim saytda saxlanılmır.",
      after: "Ətraflı məlumat: [Çatdırılma və ödəniş](/catdirilma).",
    },
    shipReturns: {
      title: "Çatdırılma, qaytarma və dəyişdirmə",
      p: "Çatdırılma qaydaları [Çatdırılma və ödəniş](/catdirilma), məhsulun qaytarılması və dəyişdirilməsi isə [Qaytarma və dəyişdirmə](/qaytarma) səhifəsində izah olunur. Bu səhifələr satış şərtlərinin ayrılmaz hissəsidir.",
    },
    gift: {
      title: "Hədiyyə xidməti",
      p: "Hədiyyə qablaşdırması və əl yazısı kart mesajı istəyə bağlıdır. Kartda qiymət yazılmır. Kart mesajının məzmununa görə sifarişçi məsuliyyət daşıyır.",
    },
    ip: {
      title: "Əqli mülkiyyət",
      p: "Saytdakı mətn, dizayn, loqo və digər materiallar satıcıya və ya müvafiq hüquq sahiblərinə məxsusdur; icazəsiz kopyalana, yayıla və ya kommersiya məqsədilə istifadə edilə bilməz.",
    },
    liability: {
      title: "Məsuliyyət",
      p: "Satıcı satdığı məhsulun keyfiyyətinə və təsvirə uyğunluğuna qanunvericiliyə əsasən cavabdehdir. Satıcının nəzarətindən kənar hallar (texniki nasazlıq, internet bağlantısı, fors-major) səbəbindən saytın müvəqqəti əlçatmaz olmasına görə məsuliyyət daşımırıq.",
    },
    disputes: {
      title: "Mübahisələrin həlli",
      p: "Şikayət və mübahisələr əvvəlcə danışıqlar yolu ilə həll olunur. Razılıq əldə olunmazsa, mübahisəyə Azərbaycan Respublikasının qüvvədə olan qanunvericiliyinə uyğun olaraq səlahiyyətli dövlət orqanında və ya məhkəmədə baxılır.",
    },
    changes: {
      title: "Şərtlərin dəyişdirilməsi",
      p: "Bu şərtlər yenilənə bilər. Dəyişiklik sayta yerləşdirildiyi andan qüvvəyə minir; sifariş verdiyiniz tarixdə qüvvədə olan şərtlər sizə tətbiq olunur.",
    },
  },
  privacy: {
    crumb: "Məxfilik siyasəti",
    title: "Məxfilik siyasəti",
    description: "Belvency Privé sifariş zamanı hansı şəxsi məlumatları toplayır, nə üçün istifadə edir və necə qoruyur.",
    intro:
      "{name} şəxsi məlumatlarınızı Azərbaycan Respublikasının “Fərdi məlumatlar haqqında” Qanununa uyğun toplayır və qoruyur. Bu səhifə hansı məlumatları nə üçün istifadə etdiyimizi izah edir.",
    collect: {
      title: "Hansı məlumatları toplayırıq",
      ul: [
        "Sifariş zamanı verdiyiniz ad, soyad, telefon nömrəsi, e-poçt (könüllü), şəhər/rayon və çatdırılma ünvanı;",
        "sifarişin tərkibi, məbləği, hədiyyə seçimləri, kart mesajı və kuryer üçün qeydiniz;",
        "sizinlə yazışma və zənglər zamanı bizə verdiyiniz məlumat.",
      ],
      after: "Saytda hesab yaratmaq tələb olunmur. Sifariş üçün lazım olmayan məlumat istəmirik.",
    },
    use: {
      title: "Nə üçün istifadə edirik",
      ul: [
        "sifarişi qəbul etmək, təsdiqləmək, hazırlamaq və çatdırmaq;",
        "sizinlə sifariş barədə əlaqə saxlamaq;",
        "qaytarma, şikayət və müraciətlərə cavab vermək;",
        "uçot, vergi və digər qanuni öhdəlikləri yerinə yetirmək.",
      ],
      after: "Məlumatlarınızı razılığınız olmadan reklam və marketinq məqsədilə istifadə etmirik və üçüncü tərəflərə satmırıq.",
    },
    share: {
      title: "Kimlərə ötürülə bilər",
      courier: "çatdırılmanı həyata keçirən kuryer xidmətinə (yalnız ad, telefon və ünvan);",
      card: "kartla ödəniş edildikdə lisenziyalı ödəniş xidməti provayderinə (kart məlumatlarını yalnız provayder görür);",
      authorities: "qanunvericiliyin tələb etdiyi hallarda səlahiyyətli dövlət orqanlarına;",
      tech: "saytı və sifariş qeydlərini saxlayan texniki xidmət təchizatçılarına: sayt xarici serverlərdə (Netlify) yerləşir, daxili sifariş bildirişləri isə mesajlaşma xidməti (Telegram) vasitəsilə komandamıza çatdırılır.",
      after: "Bu xidmət təchizatçıları məlumatlardan yalnız bizim tapşırığımızla xidmətin göstərilməsi üçün istifadə edir. Bu səbəbdən məlumatlarınız Azərbaycandan kənara ötürülə bilər.",
    },
    retention: {
      title: "Saxlama müddəti və təhlükəsizlik",
      p: "Sifariş məlumatları qanunvericiliyin uçot və vergi üçün tələb etdiyi müddət ərzində, sonra isə yalnız zəruri olduqda saxlanılır. Məlumatlara yalnız səlahiyyətli işçilər parolla qorunan idarəetmə panelindən çıxış edir; əlaqə şifrələnmiş (HTTPS) kanal üzərindən aparılır.",
    },
    cookies: {
      title: "Cookie və brauzer yaddaşı",
      p: "Sayt səbətinizi, sevimlilərinizi və hədiyyə seçimlərinizi yalnız sizin brauzerinizin yaddaşında saxlayır; bu məlumat bizə ötürülmür. Reklam və izləmə cookie-ləri və üçüncü tərəf analitika vasitələri istifadə etmirik. İdarəetmə panelinə giriş üçün yalnız işçilərə verilən texniki sessiya cookie-si istifadə olunur.",
    },
    rights: {
      title: "Hüquqlarınız",
      ul: [
        "haqqınızda hansı məlumatın saxlandığını öyrənmək;",
        "yanlış məlumatın düzəldilməsini tələb etmək;",
        "qanunvericiliyin icazə verdiyi hallarda məlumatların silinməsini və ya istifadəsinin dayandırılmasını tələb etmək.",
      ],
      after: "Müraciət üçün [Əlaqə](/elaqe) səhifəsindəki ünvana yazın. Sorğunuza qanunvericiliklə müəyyən olunmuş müddətdə cavab veririk.",
    },
    updates: { title: "Siyasətin yenilənməsi", p: "Bu siyasət dəyişə bilər. Yenilənmiş variant bu səhifədə dərc olunduğu andan qüvvəyə minir." },
  },
  delivery: {
    crumb: "Çatdırılma və ödəniş",
    title: "Çatdırılma və ödəniş",
    description: "Belvency Privé çatdırılma ərazisi, müddəti, haqqı və ödəniş üsulları.",
    intro: "Sifarişinizi necə, nə vaxt və nə qədərə çatdırdığımızı, ödənişin necə aparıldığını burada açıq yazırıq.",
    area: {
      title: "Çatdırılma ərazisi və haqqı",
      ul: ["Bakı daxilində: {baku}", "Digər şəhər və rayonlara: {region}", "{free} və yuxarı məhsul sifarişlərində çatdırılma pulsuzdur."],
      after: "Dəqiq çatdırılma haqqı ödəniş səhifəsində şəhər/rayon seçildikdən sonra göstərilir; sifarişi təsdiqləməzdən əvvəl yekun məbləğ görünür.",
    },
    time: {
      title: "Çatdırılma müddəti",
      ul: ["Bakı: {baku}", "Digər şəhər və rayonlar: {region}"],
      after: "Müddət sifarişin operator tərəfindən təsdiqləndiyi gündən hesablanır. Stokda olmayan məhsul və ya qeyri-iş günləri müddəti uzada bilər; bu halda sizinlə əlaqə saxlayırıq.",
    },
    handover: {
      title: "Çatdırılma zamanı",
      ul: [
        "Kuryer çatdırılmadan əvvəl sizə zəng edir; nömrənin düzgün və əlçatan olması vacibdir.",
        "Bağlamanı kuryerin yanında açıb məhsulun sifarişə uyğunluğunu və zədəsiz olmasını yoxlayın.",
        "Zədə və ya uyğunsuzluq görsəniz, bunu dərhal kuryerə bildirin və bizimlə əlaqə saxlayın.",
        "Alıcı yoxdursa, kuryer təkrar çatdırılma üçün sizinlə razılaşır.",
      ],
    },
    pay: {
      title: "Ödəniş üsulları",
      cash: ["Çatdırılma zamanı kuryerə nağd ödəniş."],
      card: ["Çatdırılma zamanı kuryerə nağd ödəniş.", "Bank kartı ilə onlayn ödəniş (Visa, Mastercard)."],
      after: "Bütün məbləğlər Azərbaycan manatı (₼) ilədir.",
    },
    cardSecurity: {
      title: "Kartla ödənişin təhlükəsizliyi",
      p: [
        "Kartla ödəniş lisenziyalı ödəniş xidmətinin təhlükəsiz səhifəsində aparılır. Kart nömrəsi, son istifadə tarixi və CVV kodunu biz görmürük və saxlamırıq.",
        "Ödəniş uğursuz olarsa və ya sifariş ləğv edilərsə, məbləğ ödənişin edildiyi karta geri qaytarılır. Bankın emal müddəti bank tərəfindən asılı olaraq bir neçə iş günü çəkə bilər.",
      ],
    },
    cancel: {
      title: "Sifarişin ləğvi",
      p: "Sifarişi kuryerə təhvil verilənə qədər telefon və ya e-poçt ilə ləğv edə bilərsiniz. Çatdırılmadan sonra məhsulun qaytarılması [Qaytarma və dəyişdirmə](/qaytarma) qaydalarına əsasən aparılır.",
    },
  },
  returns: {
    crumb: "Qaytarma və dəyişdirmə",
    title: "Qaytarma və dəyişdirmə",
    description: "Belvency Privé məhsulunun qaytarılması, dəyişdirilməsi və pulun geri ödənilməsi qaydaları.",
    intro: "Alış-verişdən razı qalmasanız, Azərbaycan qanunvericiliyinə uyğun olaraq məhsulu {days} ərzində dəyişdirmək və ya şərtlər daxilində qaytarmaq hüququnuz var.",
    good: {
      title: "Keyfiyyətli məhsulun dəyişdirilməsi və qaytarılması",
      p: "Məhsulu aldığınız gündən {days} ərzində müraciət edə bilərsiniz. Bunun üçün aşağıdakılar gözlənilir:",
      ul: [
        "məhsul istifadə olunmayıb, görünüşü və istehlak xüsusiyyətləri qorunub;",
        "orijinal qablaşdırma, etiket və aksesuarlar yerindədir;",
        "sifariş nömrəsi və ya alış sənədi təqdim olunur.",
      ],
    },
    excluded: {
      title: "Dəyişdirilməyən və qaytarılmayan məhsullar",
      ul: [
        "gigiyena və təhlükəsizlik səbəbindən qablaşdırması açılmış və ya istifadə edilmiş ətir, kosmetika, makiyaj və dəri qulluğu məhsulları;",
        "alıcının istəyinə görə fərdi sifarişlə hazırlanmış və ya üzərində fərdi yazı olan məhsullar;",
        "Azərbaycan qanunvericiliyi ilə dəyişdirilməyən və qaytarılmayan mallar siyahısına daxil olan digər məhsullar.",
      ],
      after: "Bu məhsullar keyfiyyətsiz çıxdıqda isə aşağıdakı bənd tətbiq olunur.",
    },
    defective: {
      title: "Keyfiyyətsiz və ya yanlış məhsul",
      p: "Məhsul qüsurlu, zədəli gəlibsə və ya sifarişinizə uyğun deyilsə, bunu aşkar etdiyiniz gün bizə bildirin və mümkünsə foto göndərin. Bu halda siz məhsulun keyfiyyətli məhsulla əvəzlənməsini, qiymətin uyğun azaldılmasını və ya sifarişin ləğvi ilə pulun geri qaytarılmasını tələb edə bilərsiniz. Çatdırılma xərci də bizim tərəfimizdən ödənilir.",
    },
    how: {
      title: "Müraciət qaydası",
      ul: [
        "[Əlaqə](/elaqe) səhifəsindəki telefon və ya e-poçt vasitəsilə sifariş nömrənizi və səbəbi bildirin.",
        "Operatorumuz sizə məhsulun necə təqdim olunacağını izah edəcək.",
        "Məhsul qəbul edilib yoxlandıqdan sonra qərar bildirilir.",
      ],
      after: "Məhsul keyfiyyətli olduqda qaytarma üçün çatdırılma xərcini {payer} ödəyir.",
    },
    refund: {
      title: "Pulun geri qaytarılması",
      p1: "Qaytarma təsdiqləndikdən sonra məbləğ məhsul bizə təhvil verildiyi gündən {refundDays} ərzində geri ödənilir. Ödəniş nağd edilibsə, pul sizin göstərdiyiniz üsulla qaytarılır{cardPart}.",
      cardPart: "; kartla ödənilibsə, məbləğ eyni karta qaytarılır və bank tərəfindən emal müddəti əlavə ola bilər",
      p2: "İlkin çatdırılma haqqı yalnız məhsul qüsurlu və ya yanlış olduqda və ya sifariş bizim səbəbimizlə ləğv edildikdə geri qaytarılır.",
    },
  },
  contact: {
    crumb: "Əlaqə",
    title: "Əlaqə və satıcı məlumatları",
    description: "Belvency Privé satıcısının rekvizitləri, əlaqə vasitələri və müraciət qaydası.",
    intro: "Sifariş, çatdırılma, qaytarma və ya hər hansı sualınız üçün bizimlə əlaqə saxlaya bilərsiniz.",
    how: {
      title: "Müraciət necə edilir",
      p: [
        "Zəng və ya e-poçt göndərərkən sifariş nömrənizi (məsələn, BM-261124-ABCD) yazın. Bu, sizə daha tez cavab verməyimizə kömək edir.",
        "E-poçt və ya yazılı müraciətlərə mümkün qədər tez, adətən 1–2 iş günü ərzində cavab veririk.",
      ],
    },
    unresolved: {
      title: "Razılıq əldə olunmadıqda",
      p: [
        "Satıcı ilə mübahisəni əvvəlcə danışıqlar yolu ilə həll etməyə çalışırıq. Razılıq əldə olunmazsa, istehlakçı hüquqlarının müdafiəsi üzrə səlahiyyətli dövlət orqanına (Rəqabət və İstehlak Bazarına Nəzarət Dövlət Agentliyi) və ya məhkəməyə müraciət etmək hüququnuz var.",
      ],
    },
  },
};

type S = typeof az;

const en: S = {
  updated: "Last updated: {date}",
  translationNote: "This page is a translation provided for convenience. If it differs from the Azerbaijani version, the Azerbaijani version prevails.",
  pending: "to be filled in",
  sellerRows: {
    seller: "Seller",
    form: "Legal form",
    voen: "Tax ID (VÖEN)",
    registry: "State registration",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Working hours",
  },
  units: {
    day: ["day", "days"],
    bizDay: ["business day", "business days"],
    payer: { buyer: "the buyer", seller: "the seller" },
  },
  terms: {
    crumb: "Terms of sale",
    title: "Terms of sale and use",
    description: "Terms for shopping at the Belvency Privé online store: ordering, prices, payment, delivery and liability.",
    intro:
      "This document sets out the rules for shopping at the {name} online store. By placing an order on the site you agree to these terms. They have been drawn up in line with the Laws of the Republic of Azerbaijan “On Protection of Consumer Rights” and “On Electronic Commerce”.",
    seller: { title: "Seller", p: "The seller of all products on the site is the person named above. For contact details, see also the [Contact](/elaqe) page." },
    products: {
      title: "Products and prices",
      ul: [
        "Prices are shown in Azerbaijani manat (₼).",
        "The delivery fee and the gift wrapping fee ({fee}) are not included in the product price; they are shown separately in the cart before you confirm the order.",
        "Photos and descriptions show the product as accurately as possible; colours may differ slightly depending on your screen.",
        "If an obvious technical error is found in a price or stock figure, we will contact you and agree on a correction before confirming the order.",
      ],
    },
    ordering: {
      title: "Placing and confirming an order",
      ul: [
        "Add the product to the cart, enter your name, phone number and delivery address on the checkout page, and send the order.",
        "After the order is sent, you are shown an order number. The order becomes final once our operator has contacted you and confirmed it.",
        "If the item is out of stock or cannot be supplied, we will inform you; if payment has already been made, the amount is refunded in full.",
        "The seller is not responsible for delays and costs caused by incorrect or incomplete information.",
      ],
    },
    payment: {
      title: "Payment",
      cash: "The order is paid in cash to the courier on delivery.",
      card: "The order can be paid in cash on delivery or online by bank card. Card payments are processed by a licensed payment service; card details are not stored on our site.",
      after: "More information: [Delivery and payment](/catdirilma).",
    },
    shipReturns: {
      title: "Delivery, returns and exchanges",
      p: "Delivery rules are explained on the [Delivery and payment](/catdirilma) page, and returns and exchanges on the [Returns and exchanges](/qaytarma) page. These pages are an integral part of the terms of sale.",
    },
    gift: {
      title: "Gift service",
      p: "Gift wrapping and a handwritten card message are optional. Prices are not written on the card. The sender is responsible for the content of the card message.",
    },
    ip: {
      title: "Intellectual property",
      p: "The text, design, logo and other materials on the site belong to the seller or the respective rights holders and may not be copied, distributed or used commercially without permission.",
    },
    liability: {
      title: "Liability",
      p: "The seller is responsible, under the law, for the quality of the products sold and their conformity with the description. We are not liable for the site being temporarily unavailable due to circumstances beyond the seller's control (technical failure, internet connection, force majeure).",
    },
    disputes: {
      title: "Dispute resolution",
      p: "Complaints and disputes are first resolved through negotiation. If no agreement is reached, the dispute is considered by the competent state authority or court in accordance with the legislation of the Republic of Azerbaijan in force.",
    },
    changes: {
      title: "Changes to the terms",
      p: "These terms may be updated. A change takes effect when it is posted on the site; the terms in force on the date you place your order apply to you.",
    },
  },
  privacy: {
    crumb: "Privacy policy",
    title: "Privacy policy",
    description: "What personal data Belvency Privé collects when you order, what it is used for and how it is protected.",
    intro:
      "{name} collects and protects your personal data in accordance with the Law of the Republic of Azerbaijan “On Personal Data”. This page explains what data we use and why.",
    collect: {
      title: "What data we collect",
      ul: [
        "Your first name, last name, phone number, email (optional), city/region and delivery address provided when ordering;",
        "the contents and amount of the order, gift options, card message and your note for the courier;",
        "information you give us in correspondence and calls.",
      ],
      after: "You do not need to create an account on the site. We do not ask for information that is not needed for the order.",
    },
    use: {
      title: "What we use it for",
      ul: [
        "to accept, confirm, prepare and deliver the order;",
        "to contact you about the order;",
        "to respond to returns, complaints and enquiries;",
        "to meet accounting, tax and other legal obligations.",
      ],
      after: "We do not use your data for advertising or marketing without your consent, and we do not sell it to third parties.",
    },
    share: {
      title: "Who it may be passed to",
      courier: "the courier service that delivers the order (only name, phone and address);",
      card: "when paying by card, the licensed payment service provider (only the provider sees your card details);",
      authorities: "competent state authorities where the law requires it;",
      tech: "technical service providers that host the site and order records: the site runs on servers abroad (Netlify), and internal order notifications reach our team through a messaging service (Telegram).",
      after: "These service providers use the data only to provide the service on our instructions. For this reason your data may be transferred outside Azerbaijan.",
    },
    retention: {
      title: "Retention and security",
      p: "Order data is kept for the period required by accounting and tax law and afterwards only where necessary. Only authorised staff access it, through a password-protected admin panel; communication takes place over an encrypted (HTTPS) channel.",
    },
    cookies: {
      title: "Cookies and browser storage",
      p: "The site keeps your cart, wishlist and gift choices only in your own browser's storage; this information is not sent to us. We do not use advertising or tracking cookies or third-party analytics tools. Only a technical session cookie issued to staff is used to sign in to the admin panel.",
    },
    rights: {
      title: "Your rights",
      ul: [
        "to find out what data is stored about you;",
        "to request correction of incorrect data;",
        "to request deletion of your data or restriction of its use where the law allows.",
      ],
      after: "To make a request, write to the address on the [Contact](/elaqe) page. We respond to your request within the period set by law.",
    },
    updates: { title: "Updates to this policy", p: "This policy may change. The updated version takes effect when it is published on this page." },
  },
  delivery: {
    crumb: "Delivery and payment",
    title: "Delivery and payment",
    description: "Belvency Privé delivery area, timing, fees and payment methods.",
    intro: "Here we state openly how, when and at what price we deliver your order, and how payment works.",
    area: {
      title: "Delivery area and fees",
      ul: ["Within Baku: {baku}", "To other cities and regions: {region}", "Delivery is free for product orders of {free} and above."],
      after: "The exact delivery fee is shown on the checkout page once you select a city/region; the final amount is visible before you confirm the order.",
    },
    time: {
      title: "Delivery time",
      ul: ["Baku: {baku}", "Other cities and regions: {region}"],
      after: "The time is counted from the day the order is confirmed by an operator. Out-of-stock items or non-working days may extend it; in that case we will contact you.",
    },
    handover: {
      title: "At delivery",
      ul: [
        "The courier calls you before delivery; it is important that your number is correct and reachable.",
        "Open the parcel in front of the courier and check that the product matches the order and is undamaged.",
        "If you notice damage or a mismatch, tell the courier immediately and contact us.",
        "If nobody is available to receive it, the courier will agree a new delivery with you.",
      ],
    },
    pay: {
      title: "Payment methods",
      cash: ["Cash payment to the courier on delivery."],
      card: ["Cash payment to the courier on delivery.", "Online payment by bank card (Visa, Mastercard)."],
      after: "All amounts are in Azerbaijani manat (₼).",
    },
    cardSecurity: {
      title: "Security of card payments",
      p: [
        "Card payments are made on the secure page of a licensed payment service. We do not see or store the card number, expiry date or CVV code.",
        "If a payment fails or an order is cancelled, the amount is returned to the card it was paid with. Depending on the bank, processing may take several business days.",
      ],
    },
    cancel: {
      title: "Cancelling an order",
      p: "You can cancel an order by phone or email until it is handed to the courier. After delivery, returning a product follows the [Returns and exchanges](/qaytarma) rules.",
    },
  },
  returns: {
    crumb: "Returns and exchanges",
    title: "Returns and exchanges",
    description: "Rules for returning and exchanging a Belvency Privé product and for refunds.",
    intro: "If you are not satisfied with your purchase, under Azerbaijani law you have the right to exchange the product within {days}, or return it under certain conditions.",
    good: {
      title: "Exchanging or returning a product of good quality",
      p: "You can apply within {days} of the day you received the product. The following is expected:",
      ul: [
        "the product has not been used, and its appearance and consumer properties are preserved;",
        "the original packaging, labels and accessories are intact;",
        "the order number or proof of purchase is provided.",
      ],
    },
    excluded: {
      title: "Products that cannot be exchanged or returned",
      ul: [
        "perfume, cosmetics, makeup and skincare products whose packaging has been opened or that have been used, for hygiene and safety reasons;",
        "products made to the buyer's individual order or bearing a personal inscription;",
        "other products on the list of goods that cannot be exchanged or returned under Azerbaijani law.",
      ],
      after: "If these products turn out to be defective, the next section applies.",
    },
    defective: {
      title: "Defective or wrong product",
      p: "If the product arrived defective or damaged, or does not match your order, tell us on the day you discover it and send a photo if you can. In that case you may ask for the product to be replaced with a good one, for the price to be reduced accordingly, or for the order to be cancelled with a refund. The delivery cost is also paid by us.",
    },
    how: {
      title: "How to apply",
      ul: [
        "State your order number and the reason by phone or email shown on the [Contact](/elaqe) page.",
        "Our operator will explain how to hand the product over.",
        "The decision is communicated after the product has been received and inspected.",
      ],
      after: "For a product of good quality, {payer} pays the cost of delivery for the return.",
    },
    refund: {
      title: "Refunds",
      p1: "Once the return is approved, the amount is refunded within {refundDays} of the day the product is handed over to us. If you paid in cash, the money is returned by the method you specify{cardPart}.",
      cardPart: "; if you paid by card, the amount is returned to the same card and the bank may add processing time",
      p2: "The original delivery fee is refunded only if the product is defective or wrong, or the order is cancelled for a reason on our side.",
    },
  },
  contact: {
    crumb: "Contact",
    title: "Contact and seller details",
    description: "The seller's details, contact channels and how to submit a request.",
    intro: "You can contact us about orders, delivery, returns or any other question.",
    how: {
      title: "How to get in touch",
      p: [
        "When you call or email, state your order number (for example, BM-261124-ABCD). It helps us reply faster.",
        "We reply to emails and written requests as soon as possible, usually within 1–2 business days.",
      ],
    },
    unresolved: {
      title: "If no agreement is reached",
      p: [
        "We first try to resolve any dispute with the seller through negotiation. If no agreement is reached, you have the right to apply to the competent state authority for consumer rights protection (the Competition and Consumer Market Control State Agency) or to a court.",
      ],
    },
  },
};

const ru: S = {
  updated: "Последнее обновление: {date}",
  translationNote: "Эта страница является переводом, приведённым для удобства. При расхождениях с азербайджанской версией приоритет имеет азербайджанская версия.",
  pending: "требуется заполнить",
  sellerRows: {
    seller: "Продавец",
    form: "Правовая форма",
    voen: "ИНН (VÖEN)",
    registry: "Государственная регистрация",
    address: "Адрес",
    phone: "Телефон",
    email: "Эл. почта",
    hours: "Часы работы",
  },
  units: {
    day: ["день", "дня", "дней"],
    bizDay: ["рабочий день", "рабочих дня", "рабочих дней"],
    payer: { buyer: "покупатель", seller: "продавец" },
  },
  terms: {
    crumb: "Условия продажи",
    title: "Условия продажи и правила использования",
    description: "Условия покупки в интернет-магазине Belvency Privé: заказ, цены, оплата, доставка и ответственность.",
    intro:
      "Настоящий документ определяет правила покупки в интернет-магазине {name}. Оформляя заказ на сайте, вы соглашаетесь с этими условиями. Условия составлены в соответствии с законами Азербайджанской Республики «О защите прав потребителей» и «Об электронной торговле».",
    seller: { title: "Продавец", p: "Продавцом всех товаров на сайте является лицо, указанное выше. Контактные данные также см. на странице [Контакты](/elaqe)." },
    products: {
      title: "Товары и цены",
      ul: [
        "Цены указываются в азербайджанских манатах (₼).",
        "Стоимость доставки и подарочной упаковки ({fee}) не входит в цену товара; она отдельно показывается в корзине до подтверждения заказа.",
        "Фотографии и описания максимально точно показывают товар; цвет может незначительно отличаться в зависимости от настроек экрана.",
        "Если в цене или данных об остатках обнаружится явная техническая ошибка, мы свяжемся с вами и согласуем исправление до подтверждения заказа.",
      ],
    },
    ordering: {
      title: "Оформление и подтверждение заказа",
      ul: [
        "Добавьте товар в корзину, на странице оформления укажите имя, телефон и адрес доставки и отправьте заказ.",
        "После отправки заказа вам показывается номер заказа. Заказ считается окончательным после того, как наш оператор свяжется с вами и подтвердит его.",
        "Если товара нет в наличии или его невозможно поставить, мы сообщим вам; если оплата уже внесена, сумма возвращается полностью.",
        "Продавец не отвечает за задержки и расходы, вызванные указанием неверных или неполных данных.",
      ],
    },
    payment: {
      title: "Оплата",
      cash: "Заказ оплачивается наличными курьеру при доставке.",
      card: "Заказ можно оплатить наличными при доставке или онлайн банковской картой. Оплата картой проходит через лицензированный платёжный сервис; данные карты на нашем сайте не хранятся.",
      after: "Подробнее: [Доставка и оплата](/catdirilma).",
    },
    shipReturns: {
      title: "Доставка, возврат и обмен",
      p: "Правила доставки изложены на странице [Доставка и оплата](/catdirilma), а возврат и обмен товара — на странице [Возврат и обмен](/qaytarma). Эти страницы являются неотъемлемой частью условий продажи.",
    },
    gift: {
      title: "Подарочный сервис",
      p: "Подарочная упаковка и рукописное сообщение на открытке предоставляются по желанию. Цена на открытке не указывается. За содержание сообщения на открытке отвечает заказчик.",
    },
    ip: {
      title: "Интеллектуальная собственность",
      p: "Тексты, дизайн, логотип и другие материалы на сайте принадлежат продавцу или соответствующим правообладателям и не могут копироваться, распространяться или использоваться в коммерческих целях без разрешения.",
    },
    liability: {
      title: "Ответственность",
      p: "Продавец в соответствии с законодательством отвечает за качество проданного товара и его соответствие описанию. Мы не несём ответственности за временную недоступность сайта по причинам, не зависящим от продавца (технический сбой, интернет-соединение, форс-мажор).",
    },
    disputes: {
      title: "Разрешение споров",
      p: "Жалобы и споры сначала разрешаются путём переговоров. Если согласие не достигнуто, спор рассматривается в компетентном государственном органе или суде в соответствии с действующим законодательством Азербайджанской Республики.",
    },
    changes: {
      title: "Изменение условий",
      p: "Настоящие условия могут обновляться. Изменение вступает в силу с момента размещения на сайте; к вам применяются условия, действовавшие на дату оформления заказа.",
    },
  },
  privacy: {
    crumb: "Политика конфиденциальности",
    title: "Политика конфиденциальности",
    description: "Какие персональные данные Belvency Privé собирает при заказе, для чего их использует и как защищает.",
    intro:
      "{name} собирает и защищает ваши персональные данные в соответствии с Законом Азербайджанской Республики «О персональных данных». На этой странице объясняется, какие данные и для чего мы используем.",
    collect: {
      title: "Какие данные мы собираем",
      ul: [
        "Имя, фамилия, номер телефона, эл. почта (по желанию), город/район и адрес доставки, указанные при заказе;",
        "состав и сумма заказа, подарочные опции, сообщение на открытке и ваш комментарий для курьера;",
        "информация, которую вы сообщаете нам при переписке и звонках.",
      ],
      after: "Создавать аккаунт на сайте не требуется. Мы не запрашиваем данные, не нужные для заказа.",
    },
    use: {
      title: "Для чего мы их используем",
      ul: [
        "чтобы принять, подтвердить, подготовить и доставить заказ;",
        "чтобы связаться с вами по поводу заказа;",
        "чтобы отвечать на запросы о возврате, жалобы и обращения;",
        "чтобы выполнять учётные, налоговые и иные обязательства, предусмотренные законом.",
      ],
      after: "Мы не используем ваши данные в рекламных и маркетинговых целях без вашего согласия и не продаём их третьим лицам.",
    },
    share: {
      title: "Кому они могут передаваться",
      courier: "курьерской службе, доставляющей заказ (только имя, телефон и адрес);",
      card: "при оплате картой — лицензированному поставщику платёжных услуг (данные карты видит только поставщик);",
      authorities: "компетентным государственным органам в случаях, предусмотренных законом;",
      tech: "техническим поставщикам услуг, обеспечивающим работу сайта и хранение записей о заказах: сайт размещён на зарубежных серверах (Netlify), а внутренние уведомления о заказах доставляются нашей команде через мессенджер (Telegram).",
      after: "Эти поставщики используют данные только для оказания услуги по нашему поручению. Поэтому ваши данные могут передаваться за пределы Азербайджана.",
    },
    retention: {
      title: "Срок хранения и безопасность",
      p: "Данные о заказах хранятся в течение срока, установленного законодательством об учёте и налогах, а затем — только при необходимости. Доступ к данным имеют только уполномоченные сотрудники через защищённую паролем панель управления; связь осуществляется по зашифрованному каналу (HTTPS).",
    },
    cookies: {
      title: "Cookie и память браузера",
      p: "Сайт хранит вашу корзину, избранное и подарочные настройки только в памяти вашего браузера; эта информация нам не передаётся. Мы не используем рекламные и отслеживающие cookie, а также сторонние средства аналитики. Для входа в панель управления используется только технический сессионный cookie, выдаваемый сотрудникам.",
    },
    rights: {
      title: "Ваши права",
      ul: [
        "узнать, какие данные о вас хранятся;",
        "потребовать исправления неверных данных;",
        "в случаях, допускаемых законом, потребовать удаления данных или прекращения их использования.",
      ],
      after: "Для обращения напишите по адресу, указанному на странице [Контакты](/elaqe). Мы отвечаем на ваш запрос в срок, установленный законом.",
    },
    updates: { title: "Обновление политики", p: "Настоящая политика может изменяться. Обновлённая версия вступает в силу с момента публикации на этой странице." },
  },
  delivery: {
    crumb: "Доставка и оплата",
    title: "Доставка и оплата",
    description: "Зона, сроки, стоимость доставки и способы оплаты Belvency Privé.",
    intro: "Здесь мы открыто пишем, как, когда и за какую цену доставляем заказ и как проходит оплата.",
    area: {
      title: "Зона и стоимость доставки",
      ul: ["По Баку: {baku}", "В другие города и районы: {region}", "При заказе товаров на {free} и более доставка бесплатна."],
      after: "Точная стоимость доставки показывается на странице оформления после выбора города/района; итоговая сумма видна до подтверждения заказа.",
    },
    time: {
      title: "Срок доставки",
      ul: ["Баку: {baku}", "Другие города и районы: {region}"],
      after: "Срок отсчитывается со дня подтверждения заказа оператором. Отсутствие товара в наличии или нерабочие дни могут увеличить срок; в этом случае мы свяжемся с вами.",
    },
    handover: {
      title: "При получении",
      ul: [
        "Курьер звонит вам перед доставкой; важно, чтобы номер был указан верно и был доступен.",
        "Вскройте посылку при курьере и проверьте, что товар соответствует заказу и не повреждён.",
        "Если вы заметили повреждение или несоответствие, немедленно сообщите курьеру и свяжитесь с нами.",
        "Если получателя нет на месте, курьер согласует с вами повторную доставку.",
      ],
    },
    pay: {
      title: "Способы оплаты",
      cash: ["Оплата наличными курьеру при доставке."],
      card: ["Оплата наличными курьеру при доставке.", "Онлайн-оплата банковской картой (Visa, Mastercard)."],
      after: "Все суммы указаны в азербайджанских манатах (₼).",
    },
    cardSecurity: {
      title: "Безопасность оплаты картой",
      p: [
        "Оплата картой проходит на защищённой странице лицензированного платёжного сервиса. Номер карты, срок действия и CVV-код мы не видим и не храним.",
        "Если платёж не прошёл или заказ отменён, сумма возвращается на карту, с которой была произведена оплата. В зависимости от банка обработка может занять несколько рабочих дней.",
      ],
    },
    cancel: {
      title: "Отмена заказа",
      p: "Заказ можно отменить по телефону или электронной почте до передачи курьеру. После доставки возврат товара осуществляется по правилам [Возврат и обмен](/qaytarma).",
    },
  },
  returns: {
    crumb: "Возврат и обмен",
    title: "Возврат и обмен",
    description: "Правила возврата и обмена товара Belvency Privé и возврата денежных средств.",
    intro: "Если вы остались недовольны покупкой, в соответствии с законодательством Азербайджана вы вправе обменять товар в течение {days} или вернуть его на определённых условиях.",
    good: {
      title: "Обмен и возврат товара надлежащего качества",
      p: "Обратиться можно в течение {days} со дня получения товара. При этом ожидается следующее:",
      ul: [
        "товар не использовался, сохранены его внешний вид и потребительские свойства;",
        "оригинальная упаковка, этикетки и аксессуары на месте;",
        "предъявлен номер заказа или документ о покупке.",
      ],
    },
    excluded: {
      title: "Товары, не подлежащие обмену и возврату",
      ul: [
        "парфюмерия, косметика, макияж и средства по уходу за кожей со вскрытой упаковкой или бывшие в употреблении — по гигиеническим причинам и соображениям безопасности;",
        "товары, изготовленные по индивидуальному заказу покупателя или с персональной надписью;",
        "другие товары, входящие в перечень товаров, не подлежащих обмену и возврату по законодательству Азербайджана.",
      ],
      after: "Если эти товары окажутся ненадлежащего качества, применяется следующий раздел.",
    },
    defective: {
      title: "Товар ненадлежащего качества или не тот товар",
      p: "Если товар пришёл с дефектом, повреждённым или не соответствует заказу, сообщите нам в день обнаружения и по возможности пришлите фото. В этом случае вы можете потребовать заменить товар на качественный, соразмерно уменьшить цену или отменить заказ с возвратом денег. Стоимость доставки также оплачиваем мы.",
    },
    how: {
      title: "Порядок обращения",
      ul: [
        "Сообщите номер заказа и причину по телефону или электронной почте, указанным на странице [Контакты](/elaqe).",
        "Наш оператор объяснит, как передать товар.",
        "Решение сообщается после получения и проверки товара.",
      ],
      after: "При возврате товара надлежащего качества стоимость обратной доставки оплачивает {payer}.",
    },
    refund: {
      title: "Возврат денежных средств",
      p1: "После одобрения возврата сумма возвращается в течение {refundDays} со дня передачи товара нам. Если оплата была наличными, деньги возвращаются указанным вами способом{cardPart}.",
      cardPart: "; если оплата была картой, сумма возвращается на ту же карту, а банк может добавить время на обработку",
      p2: "Стоимость первоначальной доставки возвращается только если товар оказался с дефектом или не тот, либо заказ отменён по нашей вине.",
    },
  },
  contact: {
    crumb: "Контакты",
    title: "Контакты и данные продавца",
    description: "Реквизиты продавца, способы связи и порядок обращения.",
    intro: "Вы можете связаться с нами по вопросам заказа, доставки, возврата или любому другому вопросу.",
    how: {
      title: "Как обратиться",
      p: [
        "При звонке или письме укажите номер заказа (например, BM-261124-ABCD). Это поможет нам ответить быстрее.",
        "На письма и письменные обращения мы отвечаем как можно скорее, обычно в течение 1–2 рабочих дней.",
      ],
    },
    unresolved: {
      title: "Если согласие не достигнуто",
      p: [
        "Мы сначала стараемся решить спор с продавцом путём переговоров. Если согласие не достигнуто, вы вправе обратиться в компетентный государственный орган по защите прав потребителей (Государственное агентство по контролю за конкуренцией и потребительским рынком) или в суд.",
      ],
    },
  },
};

export type { Sec };
export const legal = { az, en, ru };
