import type { Metadata } from "next";
import { GenderLanding } from "@/components/shop/GenderLanding";

export const metadata: Metadata = {
  title: "Kişi",
  description: "Kişilər üçün saat, ətir, pul qabısı, qalstuk və aksesuar seçimləri.",
};

export default function MenPage() {
  return (
    <GenderLanding
      gender="kisi"
      title="Kişi"
      intro="Saat, ətir, dəri pul qabıları və gündəlik aksesuarlar — sadə və yadda qalan seçimlər."
      art={{ kind: "watch", tone: "cocoa" }}
    />
  );
}
