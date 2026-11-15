import type { Metadata } from "next";
import { GiftFinder } from "@/components/shop/GiftFinder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Hədiyyə sihirbazı",
  description: "4 sualda hədiyyə seçin: kimə, hansı münasibətlə, büdcə və növ. Kart mesajı ilə birlikdə.",
};

export default function GiftWizardPage() {
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Hədiyyə seçimləri", href: "/kataloq/hediyye-secimleri" }, { label: "Hədiyyə sihirbazı" }]} />
      <div className="mx-auto mt-10 max-w-4xl md:mt-14">
        <GiftFinder />
      </div>
    </div>
  );
}
