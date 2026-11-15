/**
 * Ətir tapıcı üçün nümayiş profilləri.
 * Bunlar real ətirlərin təhlili deyil — yalnız dizayn nümayişi üçün uydurulmuş xarakteristikalardır.
 */
export type ScentFamily = "teravetli" | "cicekli" | "isti" | "odunsu";
export type Occasion = "gundelik" | "axsam" | "xususi";

export interface ScentProfile {
  family: ScentFamily;
  occasions: Occasion[];
}

export const scentProfiles: Record<string, ScentProfile> = {
  "nergiz-gecesi-etir-suyu": { family: "cicekli", occasions: ["axsam", "xususi"] },
  "enber-gun-batimi-etir-suyu": { family: "isti", occasions: ["axsam", "xususi"] },
  "lale-seheri-etir-suyu": { family: "teravetli", occasions: ["gundelik"] },
  "qara-enber-etir-suyu": { family: "odunsu", occasions: ["axsam", "xususi"] },
  "serin-deniz-kisi-etri": { family: "teravetli", occasions: ["gundelik"] },
};

export const familyLabels: Record<ScentFamily, string> = {
  teravetli: "təravətli",
  cicekli: "çiçəkli",
  isti: "isti və ədviyyəli",
  odunsu: "dərin və odunsu",
};

export const occasionLabels: Record<Occasion, string> = {
  gundelik: "gündəlik istifadə",
  axsam: "axşam",
  xususi: "xüsusi günlər",
};

export interface QuizOption {
  value: string;
  label: string;
  hint?: string;
}

export interface QuizQuestion {
  id: "for" | "family" | "when" | "budget";
  title: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    id: "for",
    title: "Ətri kim üçün axtarırsınız?",
    options: [
      { value: "qadin", label: "Özüm üçün", hint: "Qadın və unisex ətirlər" },
      { value: "kisi", label: "Özüm üçün", hint: "Kişi və unisex ətirlər" },
      { value: "hediyye", label: "Hədiyyə üçün", hint: "Bütün ətirlər" },
    ],
  },
  {
    id: "family",
    title: "Hansı əhval-ruhiyyə sizə daha yaxındır?",
    options: [
      { value: "teravetli", label: "Təravətli və yüngül", hint: "Sitrus, yaşıl yarpaq, dəniz duzu" },
      { value: "cicekli", label: "Yumşaq və çiçəkli", hint: "Nərgiz, yasəmən, lalə" },
      { value: "isti", label: "İsti və ədviyyəli", hint: "Kəhrəba, vanil, zəfəran" },
      { value: "odunsu", label: "Dərin və odunsu", hint: "Ud, dəri, sidr ağacı" },
    ],
  },
  {
    id: "when",
    title: "Əsasən nə vaxt istifadə edəcəksiniz?",
    options: [
      { value: "gundelik", label: "Gündəlik" },
      { value: "axsam", label: "Axşam" },
      { value: "xususi", label: "Xüsusi günlər" },
    ],
  },
  {
    id: "budget",
    title: "Büdcəniz nə qədərdir?",
    options: [
      { value: "220", label: "220 ₼-dək" },
      { value: "300", label: "300 ₼-dək" },
      { value: "any", label: "Fərq etmir" },
    ],
  },
];
