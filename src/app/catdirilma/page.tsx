import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/shop/LegalPage";
import { delivery } from "@/data/legal";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { cardPayments } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Çatdırılma və ödəniş",
  description: "Belvency Privé çatdırılma ərazisi, müddəti, haqqı və ödəniş üsulları.",
};

const link = "underline underline-offset-4";

export default function DeliveryPage() {
  return (
    <LegalPage
      title="Çatdırılma və ödəniş"
      crumb="Çatdırılma və ödəniş"
      intro="Sifarişinizi necə, nə vaxt və nə qədərə çatdırdığımızı, ödənişin necə aparıldığını burada açıq yazırıq."
      sections={[
        {
          title: "Çatdırılma ərazisi və haqqı",
          ul: [
            `Bakı daxilində: ${formatAZN(site.bakuDeliveryFee)}`,
            `Digər şəhər və rayonlara: ${formatAZN(site.regionDeliveryFee)}`,
            `${formatAZN(site.freeDeliveryFrom)} və yuxarı məhsul sifarişlərində çatdırılma pulsuzdur.`,
          ],
          after: "Dəqiq çatdırılma haqqı ödəniş səhifəsində şəhər/rayon seçildikdən sonra göstərilir; sifarişi təsdiqləməzdən əvvəl yekun məbləğ görünür.",
        },
        {
          title: "Çatdırılma müddəti",
          ul: [`Bakı: ${delivery.bakuDays}`, `Digər şəhər və rayonlar: ${delivery.regionDays}`],
          after: "Müddət sifarişin operator tərəfindən təsdiqləndiyi gündən hesablanır. Stokda olmayan məhsul və ya qeyri-iş günləri müddəti uzada bilər; bu halda sizinlə əlaqə saxlayırıq.",
        },
        {
          title: "Çatdırılma zamanı",
          ul: [
            "Kuryer çatdırılmadan əvvəl sizə zəng edir; nömrənin düzgün və əlçatan olması vacibdir.",
            "Bağlamanı kuryerin yanında açıb məhsulun sifarişə uyğunluğunu və zədəsiz olmasını yoxlayın.",
            "Zədə və ya uyğunsuzluq görsəniz, bunu dərhal kuryerə bildirin və bizimlə əlaqə saxlayın.",
            "Alıcı yoxdursa, kuryer təkrar çatdırılma üçün sizinlə razılaşır.",
          ],
        },
        {
          title: "Ödəniş üsulları",
          ul: cardPayments
            ? [
                "Çatdırılma zamanı kuryerə nağd ödəniş.",
                "Bank kartı ilə onlayn ödəniş (Visa, Mastercard).",
              ]
            : ["Çatdırılma zamanı kuryerə nağd ödəniş."],
          after: "Bütün məbləğlər Azərbaycan manatı (₼) ilədir.",
        },
        ...(cardPayments
          ? [
              {
                title: "Kartla ödənişin təhlükəsizliyi",
                p: [
                  "Kartla ödəniş lisenziyalı ödəniş xidmətinin təhlükəsiz səhifəsində aparılır. Kart nömrəsi, son istifadə tarixi və CVV kodunu biz görmürük və saxlamırıq.",
                  "Ödəniş uğursuz olarsa və ya sifariş ləğv edilərsə, məbləğ ödənişin edildiyi karta geri qaytarılır. Bankın emal müddəti bank tərəfindən asılı olaraq bir neçə iş günü çəkə bilər.",
                ],
              },
            ]
          : []),
        {
          title: "Sifarişin ləğvi",
          p: [
            <>
              Sifarişi kuryerə təhvil verilənə qədər telefon və ya e-poçt ilə ləğv edə bilərsiniz. Çatdırılmadan sonra məhsulun qaytarılması{" "}
              <Link href="/qaytarma" className={link}>
                Qaytarma və dəyişdirmə
              </Link>{" "}
              qaydalarına əsasən aparılır.
            </>,
          ],
        },
      ]}
    />
  );
}
