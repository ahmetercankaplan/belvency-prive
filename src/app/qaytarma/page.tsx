import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/shop/LegalPage";
import { returns } from "@/data/legal";
import { cardPayments } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Qaytarma və dəyişdirmə",
  description: "Belvency Privé məhsulunun qaytarılması, dəyişdirilməsi və pulun geri ödənilməsi qaydaları.",
};

const link = "underline underline-offset-4";

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Qaytarma və dəyişdirmə"
      crumb="Qaytarma və dəyişdirmə"
      intro={`Alış-verişdən razı qalmasanız, Azərbaycan qanunvericiliyinə uyğun olaraq məhsulu ${returns.days} gün ərzində dəyişdirmək və ya şərtlər daxilində qaytarmaq hüququnuz var.`}
      sections={[
        {
          title: "Keyfiyyətli məhsulun dəyişdirilməsi və qaytarılması",
          p: [`Məhsulu aldığınız gündən ${returns.days} gün ərzində müraciət edə bilərsiniz. Bunun üçün aşağıdakılar gözlənilir:`],
          ul: [
            "məhsul istifadə olunmayıb, görünüşü və istehlak xüsusiyyətləri qorunub;",
            "orijinal qablaşdırma, etiket və aksessuarlar yerindədir;",
            "sifariş nömrəsi və ya alış sənədi təqdim olunur.",
          ],
        },
        {
          title: "Dəyişdirilməyən və qaytarılmayan məhsullar",
          ul: [
            "gigiyena və təhlükəsizlik səbəbindən qablaşdırması açılmış və ya istifadə edilmiş ətir, kosmetika, makiyaj və dəri qulluğu məhsulları;",
            "alıcının istəyinə görə fərdi sifarişlə hazırlanmış və ya üzərində fərdi yazı olan məhsullar;",
            "Azərbaycan qanunvericiliyi ilə dəyişdirilməyən və qaytarılmayan mallar siyahısına daxil olan digər məhsullar.",
          ],
          after: "Bu məhsullar keyfiyyətsiz çıxdıqda isə aşağıdakı bənd tətbiq olunur.",
        },
        {
          title: "Keyfiyyətsiz və ya yanlış məhsul",
          p: [
            "Məhsul qüsurlu, zədəli gəlibsə və ya sifarişinizə uyğun deyilsə, bunu aşkar etdiyiniz gün bizə bildirin və mümkünsə foto göndərin. Bu halda siz məhsulun keyfiyyətli məhsulla əvəzlənməsini, qiymətin uyğun azaldılmasını və ya sifarişin ləğvi ilə pulun geri qaytarılmasını tələb edə bilərsiniz. Çatdırılma xərci də bizim tərəfimizdən ödənilir.",
          ],
        },
        {
          title: "Müraciət qaydası",
          ul: [
            <>
              <Link href="/elaqe" className={link}>
                Əlaqə
              </Link>{" "}
              səhifəsindəki telefon və ya e-poçt vasitəsilə sifariş nömrənizi və səbəbi bildirin.
            </>,
            "Operatorumuz sizə məhsulun necə təqdim olunacağını izah edəcək.",
            "Məhsul qəbul edilib yoxlandıqdan sonra qərar bildirilir.",
          ],
          after: `Məhsul keyfiyyətli olduqda qaytarma üçün çatdırılma xərcini ${returns.returnShippingPaidBy} ödəyir.`,
        },
        {
          title: "Pulun geri qaytarılması",
          p: [
            `Qaytarma təsdiqləndikdən sonra məbləğ məhsul bizə təhvil verildiyi gündən ${returns.refundBusinessDays} iş günü ərzində geri ödənilir. Ödəniş nağd edilibsə, pul sizin göstərdiyiniz üsulla qaytarılır${
              cardPayments ? "; kartla ödənilibsə, məbləğ eyni karta qaytarılır və bank tərəfindən emal müddəti əlavə ola bilər" : ""
            }.`,
            "İlkin çatdırılma haqqı yalnız məhsul qüsurlu və ya yanlış olduqda və ya sifariş bizim səbəbimizlə ləğv edildikdə geri qaytarılır.",
          ],
        },
      ]}
    />
  );
}
