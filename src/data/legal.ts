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
  /** İş saatları (hər gün) */
  hoursFrom: "10:00",
  hoursTo: "20:00",
};

const HOURS = { az: "Hər gün {from} – {to}", en: "Daily {from} – {to}", ru: "Ежедневно {from} – {to}" } as const;

/** Çalışma saatları, dilə uyğun mətn. */
export const sellerHours = (locale: "az" | "en" | "ru") =>
  HOURS[locale].replace("{from}", seller.hoursFrom).replace("{to}", seller.hoursTo);

/** Çatdırılma müddətləri — real kuryer razılaşmasına görə dəyişin. */
export const delivery = {
  bakuMin: 1,
  bakuMax: 2,
  regionMin: 2,
  regionMax: 5,
};

/** Qaytarma şərtləri — təsdiqləyin və ya dəyişin. */
export const returns = {
  /** Qanunla nəzərdə tutulan dəyişdirmə müddəti (gün) */
  days: 14,
  /** Pulun geri qaytarılma müddəti (iş günü) */
  refundBusinessDays: 10,
  /** Keyfiyyətli məhsulun qaytarılmasında çatdırılma xərcini kim ödəyir */
  returnShippingPaidBy: "buyer" as "buyer" | "seller",
};

/** Hüquqi mətnlərin son yenilənmə tarixi (YYYY-MM-DD) */
export const legalUpdated = "2026-11-24";

export const REQUIRED = ["name", "form", "voen", "address", "phone", "email"] as const;

export const sellerMissing = REQUIRED.filter((k) => !seller[k].trim());
