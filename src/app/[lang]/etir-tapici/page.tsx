import type { Metadata } from "next";
import { ScentFinder } from "@/components/shop/ScentFinder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { notFound } from "next/navigation";
import { live } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Ətir tapıcı",
  description: "4 sualda sizə uyğun ətri tapın: əhval-ruhiyyə, istifadə vaxtı və büdcəyə görə seçim.",
};

export default function ScentFinderPage() {
  if (live) notFound();
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Ətir tapıcı" }]} />
      <div className="mx-auto mt-10 max-w-4xl md:mt-14">
        <ScentFinder />
      </div>
    </div>
  );
}
