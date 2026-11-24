import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/shop/LegalPage";
import { site } from "@/data/site";
import { cardPayments } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Məxfilik siyasəti",
  description: "Belvency Privé sifariş zamanı hansı şəxsi məlumatları toplayır, nə üçün istifadə edir və necə qoruyur.",
};

const link = "underline underline-offset-4";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Məxfilik siyasəti"
      crumb="Məxfilik siyasəti"
      intro={`${site.fullName} şəxsi məlumatlarınızı Azərbaycan Respublikasının “Fərdi məlumatlar haqqında” Qanununa uyğun toplayır və qoruyur. Bu səhifə hansı məlumatları nə üçün istifadə etdiyimizi izah edir.`}
      sections={[
        {
          title: "Hansı məlumatları toplayırıq",
          ul: [
            "Sifariş zamanı verdiyiniz ad, soyad, telefon nömrəsi, e-poçt (könüllü), şəhər/rayon və çatdırılma ünvanı;",
            "sifarişin tərkibi, məbləği, hədiyyə seçimləri, kart mesajı və kuryer üçün qeydiniz;",
            "sizinlə yazışma və zənglər zamanı bizə verdiyiniz məlumat.",
          ],
          after: "Saytda hesab yaratmaq tələb olunmur. Sifariş üçün lazım olmayan məlumat istəmirik.",
        },
        {
          title: "Nə üçün istifadə edirik",
          ul: [
            "sifarişi qəbul etmək, təsdiqləmək, hazırlamaq və çatdırmaq;",
            "sizinlə sifariş barədə əlaqə saxlamaq;",
            "qaytarma, şikayət və müraciətlərə cavab vermək;",
            "uçot, vergi və digər qanuni öhdəlikləri yerinə yetirmək.",
          ],
          after: "Məlumatlarınızı razılığınız olmadan reklam və marketinq məqsədilə istifadə etmirik və üçüncü tərəflərə satmırıq.",
        },
        {
          title: "Kimlərə ötürülə bilər",
          ul: [
            "çatdırılmanı həyata keçirən kuryer xidmətinə (yalnız ad, telefon və ünvan);",
            ...(cardPayments ? ["kartla ödəniş edildikdə lisenziyalı ödəniş xidməti provayderinə (kart məlumatlarını yalnız provayder görür);"] : []),
            "qanunvericiliyin tələb etdiyi hallarda səlahiyyətli dövlət orqanlarına;",
            "saytı və sifariş qeydlərini saxlayan texniki xidmət təchizatçılarına: sayt xarici serverlərdə (Netlify) yerləşir, daxili sifariş bildirişləri isə mesajlaşma xidməti (Telegram) vasitəsilə komandamıza çatdırılır.",
          ],
          after: "Bu xidmət təchizatçıları məlumatlardan yalnız bizim tapşırığımızla xidmətin göstərilməsi üçün istifadə edir. Bu səbəbdən məlumatlarınız Azərbaycandan kənara ötürülə bilər.",
        },
        {
          title: "Saxlama müddəti və təhlükəsizlik",
          p: [
            "Sifariş məlumatları qanunvericiliyin uçot və vergi üçün tələb etdiyi müddət ərzində, sonra isə yalnız zəruri olduqda saxlanılır. Məlumatlara yalnız səlahiyyətli işçilər parolla qorunan idarəetmə panelindən çıxış edir; əlaqə şifrələnmiş (HTTPS) kanal üzərindən aparılır.",
          ],
        },
        {
          title: "Cookie və brauzer yaddaşı",
          p: [
            "Sayt səbətinizi, sevimlilərinizi və hədiyyə seçimlərinizi yalnız sizin brauzerinizin yaddaşında saxlayır; bu məlumat bizə ötürülmür. Reklam və izləmə cookie-ləri və üçüncü tərəf analitika vasitələri istifadə etmirik. İdarəetmə panelinə giriş üçün yalnız işçilərə verilən texniki sessiya cookie-si istifadə olunur.",
          ],
        },
        {
          title: "Hüquqlarınız",
          ul: [
            "haqqınızda hansı məlumatın saxlandığını öyrənmək;",
            "yanlış məlumatın düzəldilməsini tələb etmək;",
            "qanunvericiliyin icazə verdiyi hallarda məlumatların silinməsini və ya istifadəsinin dayandırılmasını tələb etmək.",
          ],
          after: (
            <>
              Müraciət üçün{" "}
              <Link href="/elaqe" className={link}>
                Əlaqə
              </Link>{" "}
              səhifəsindəki ünvana yazın. Sorğunuza qanunvericiliklə müəyyən olunmuş müddətdə cavab veririk.
            </>
          ),
        },
        {
          title: "Siyasətin yenilənməsi",
          p: ["Bu siyasət dəyişə bilər. Yenilənmiş variant bu səhifədə dərc olunduğu andan qüvvəyə minir."],
        },
      ]}
    />
  );
}
