import type { Metadata } from "next";
import { GenderLanding } from "@/components/shop/GenderLanding";

export const metadata: Metadata = {
  title: "Qadın",
  description: "Qadınlar üçün ətir, zərgərlik, çanta, saat və ayaqqabı seçimləri.",
};

export default function WomenPage() {
  return (
    <GenderLanding
      gender="qadin"
      title="Qadın"
      intro="Ətir, zərgərlik, çanta və gündəlik aksesuarlar — nəzakətlə seçilmiş qadın kolleksiyası."
      art={{ kind: "perfume", tone: "blush" }}
    />
  );
}
