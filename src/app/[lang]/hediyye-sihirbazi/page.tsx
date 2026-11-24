import type { Metadata } from "next";
import { GiftFinder } from "@/components/shop/GiftFinder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.giftWizard;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/hediyye-sihirbazi") };
}

export default async function GiftWizardPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.giftWizard;
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: d.crumbPicks, href: "/kataloq/hediyye-secimleri" }, { label: d.title }]} />
      <div className="mx-auto mt-10 max-w-4xl md:mt-14">
        <GiftFinder />
      </div>
    </div>
  );
}
