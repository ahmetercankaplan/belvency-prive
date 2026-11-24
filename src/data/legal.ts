/**
 * SATICI MƏLUMATLARI — tək doldurulacaq yer.
 *
 * "Elektron ticarət haqqında" Qanuna görə satıcının adı/ünvanı, əlaqə məlumatları və
 * (varsa) dövlət qeydiyyatı sayt üzərində açıq göstərilməlidir. Ödəniş xidməti (kart) qoşulması
 * üçün də bu səhifələr yoxlanılır.
 *
 * Boş sahələr saytda "doldurulmalıdır" kimi görünür. NEXT_PUBLIC_INDEXABLE=1 (rəsmi açılış)
 * ilə build edərkən aşağıdakı REQUIRED sahələr boşdursa build DAYANIR.
 * Bu fayl heç bir import etmir ki, build skripti birbaşa oxuya bilsin.
 */
export const seller = {
  /** Fərdi sahibkar: ad, soyad, ata adı. Şirkət: tam hüquqi ad (məs. “Belvency MMC”). */
  name: "",
  /** “Fərdi sahibkar” və ya “Məhdud Məsuliyyətli Cəmiyyət” */
  form: "",
  /** Vergi ödəyicisinin eyniləşdirmə nömrəsi */
  voen: "",
  /** Dövlət qeydiyyatı / reyestr məlumatı (varsa) */
  registry: "",
  /** Hüquqi ünvan */
  address: "",
  phone: "",
  email: "",
  hours: "Hər gün 10:00 – 20:00",
};

/** Çatdırılma müddətləri — real kuryer razılaşmasına görə dəyişin. */
export const delivery = {
  bakuDays: "1–2 iş günü",
  regionDays: "2–5 iş günü",
};

/** Qaytarma şərtləri — təsdiqləyin və ya dəyişin. */
export const returns = {
  /** Qanunla nəzərdə tutulan dəyişdirmə müddəti (gün) */
  days: 14,
  /** Pulun geri qaytarılma müddəti (iş günü) */
  refundBusinessDays: 10,
  /** Keyfiyyətli məhsulun qaytarılmasında çatdırılma xərcini kim ödəyir */
  returnShippingPaidBy: "alıcı",
};

export const legalUpdated = "24 noyabr 2026";

export const REQUIRED = ["name", "form", "voen", "address", "phone", "email"] as const;

export const sellerMissing = REQUIRED.filter((k) => !seller[k].trim());
