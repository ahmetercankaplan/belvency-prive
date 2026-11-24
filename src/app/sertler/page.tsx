import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, SellerCard } from "@/components/shop/LegalPage";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { cardPayments } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Satış şərtləri və istifadə qaydaları",
  description: "Belvency Privé onlayn mağazasından alış-verişin şərtləri: sifariş, qiymət, ödəniş, çatdırılma və məsuliyyət.",
};

const link = "underline underline-offset-4";

export default function TermsPage() {
  return (
    <LegalPage
      title="Satış şərtləri və istifadə qaydaları"
      crumb="Satış şərtləri"
      intro={
        <>
          Bu sənəd {site.fullName} onlayn mağazasından alış-verişin qaydalarını müəyyən edir. Saytda sifariş verməklə bu
          şərtlərlə razılaşmış olursunuz. Şərtlər Azərbaycan Respublikasının “İstehlakçıların hüquqlarının müdafiəsi haqqında”
          və “Elektron ticarət haqqında” qanunlarına uyğun tərtib olunub.
        </>
      }
      sections={[
        {
          title: "Satıcı",
          p: [
            <>
              Saytdakı bütün məhsulların satıcısı yuxarıda göstərilən şəxsdir. Əlaqə vasitələri üçün{" "}
              <Link href="/elaqe" className={link}>
                Əlaqə
              </Link>{" "}
              səhifəsinə də baxa bilərsiniz.
            </>,
          ],
        },
        {
          title: "Məhsullar və qiymətlər",
          ul: [
            "Qiymətlər Azərbaycan manatı (₼) ilə göstərilir.",
            `Çatdırılma haqqı və hədiyyə qablaşdırması haqqı (${formatAZN(site.giftWrapFee)}) məhsulun qiymətinə daxil deyil; sifarişi təsdiqləməzdən əvvəl səbətdə ayrıca göstərilir.`,
            "Foto və təsvirlər məhsulu mümkün qədər dəqiq göstərir; ekran parametrlərinə görə rəng cüzi fərqlənə bilər.",
            "Qiymət və ya stok məlumatında açıq texniki səhv aşkarlansa, sifarişi təsdiqləməzdən əvvəl sizinlə əlaqə saxlayıb düzəlişi razılaşdırırıq.",
          ],
        },
        {
          title: "Sifarişin verilməsi və təsdiqi",
          ul: [
            "Məhsulu səbətə əlavə edin, ödəniş səhifəsində ad, telefon və çatdırılma ünvanını yazın və sifarişi göndərin.",
            "Sifariş göndərildikdən sonra sizə sifariş nömrəsi göstərilir. Sifariş operatorumuz sizinlə əlaqə saxlayıb təsdiqlədikdən sonra qəti hesab olunur.",
            "Stok qalmadıqda və ya məhsul təmin edilə bilmədikdə sizi məlumatlandırırıq; ödəniş artıq edilibsə, məbləğ tam geri qaytarılır.",
            "Yanlış və ya natamam məlumat verilməsi nəticəsində yaranan gecikməyə və xərclərə satıcı məsuliyyət daşımır.",
          ],
        },
        {
          title: "Ödəniş",
          p: [
            cardPayments
              ? "Sifarişin ödənişi çatdırılma zamanı nağd və ya bank kartı ilə onlayn edilə bilər. Kartla ödəniş lisenziyalı ödəniş xidməti vasitəsilə aparılır; kart məlumatları bizim saytda saxlanılmır."
              : "Sifarişin ödənişi çatdırılma zamanı kuryerə nağd edilir.",
          ],
          after: (
            <>
              Ətraflı məlumat:{" "}
              <Link href="/catdirilma" className={link}>
                Çatdırılma və ödəniş
              </Link>
              .
            </>
          ),
        },
        {
          title: "Çatdırılma, qaytarma və dəyişdirmə",
          p: [
            <>
              Çatdırılma qaydaları{" "}
              <Link href="/catdirilma" className={link}>
                Çatdırılma və ödəniş
              </Link>
              , məhsulun qaytarılması və dəyişdirilməsi isə{" "}
              <Link href="/qaytarma" className={link}>
                Qaytarma və dəyişdirmə
              </Link>{" "}
              səhifəsində izah olunur. Bu səhifələr satış şərtlərinin ayrılmaz hissəsidir.
            </>,
          ],
        },
        {
          title: "Hədiyyə xidməti",
          p: ["Hədiyyə qablaşdırması və əl yazısı kart mesajı istəyə bağlıdır. Kartda qiymət yazılmır. Kart mesajının məzmununa görə sifarişçi məsuliyyət daşıyır."],
        },
        {
          title: "Əqli mülkiyyət",
          p: ["Saytdakı mətn, dizayn, loqo və digər materiallar satıcıya və ya müvafiq hüquq sahiblərinə məxsusdur; icazəsiz kopyalana, yayıla və ya kommersiya məqsədilə istifadə edilə bilməz."],
        },
        {
          title: "Məsuliyyət",
          p: [
            "Satıcı satdığı məhsulun keyfiyyətinə və təsvirə uyğunluğuna qanunvericiliyə əsasən cavabdehdir. Satıcının nəzarətindən kənar hallar (texniki nasazlıq, internet bağlantısı, fors-major) səbəbindən saytın müvəqqəti əlçatmaz olmasına görə məsuliyyət daşımırıq.",
          ],
        },
        {
          title: "Mübahisələrin həlli",
          p: [
            "Şikayət və mübahisələr əvvəlcə danışıqlar yolu ilə həll olunur. Razılıq əldə olunmazsa, mübahisəyə Azərbaycan Respublikasının qüvvədə olan qanunvericiliyinə uyğun olaraq səlahiyyətli dövlət orqanında və ya məhkəmədə baxılır.",
          ],
        },
        {
          title: "Şərtlərin dəyişdirilməsi",
          p: ["Bu şərtlər yenilənə bilər. Dəyişiklik sayta yerləşdirildiyi andan qüvvəyə minir; sifariş verdiyiniz tarixdə qüvvədə olan şərtlər sizə tətbiq olunur."],
        },
      ]}
    >
      <SellerCard />
    </LegalPage>
  );
}
