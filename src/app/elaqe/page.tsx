import type { Metadata } from "next";
import { LegalPage, SellerCard } from "@/components/shop/LegalPage";

export const metadata: Metadata = {
  title: "Əlaqə və satıcı məlumatları",
  description: "Belvency Privé satıcısının rekvizitləri, əlaqə vasitələri və müraciət qaydası.",
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Əlaqə və satıcı məlumatları"
      crumb="Əlaqə"
      intro="Sifariş, çatdırılma, qaytarma və ya hər hansı sualınız üçün bizimlə əlaqə saxlaya bilərsiniz."
      sections={[
        {
          title: "Müraciət necə edilir",
          p: [
            "Zəng və ya e-poçt göndərərkən sifariş nömrənizi (məsələn, BM-261124-ABCD) yazın. Bu, sizə daha tez cavab verməyimizə kömək edir.",
            "E-poçt və ya yazılı müraciətlərə mümkün qədər tez, adətən 1–2 iş günü ərzində cavab veririk.",
          ],
        },
        {
          title: "Razılıq əldə olunmadıqda",
          p: [
            "Satıcı ilə mübahisəni əvvəlcə danışıqlar yolu ilə həll etməyə çalışırıq. Razılıq əldə olunmazsa, istehlakçı hüquqlarının müdafiəsi üzrə səlahiyyətli dövlət orqanına (Rəqabət və İstehlak Bazarına Nəzarət Dövlət Agentliyi) və ya məhkəməyə müraciət etmək hüququnuz var.",
          ],
        },
      ]}
    >
      <SellerCard />
    </LegalPage>
  );
}
