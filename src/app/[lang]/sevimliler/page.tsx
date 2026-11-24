import type { Metadata } from "next";
import { Suspense } from "react";
import { WishlistView } from "@/components/shop/WishlistView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDict } from "@/i18n/dict";
import { resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getDict(locale).pages.wishlist.title, robots: { index: false, follow: true } };
}

export default async function WishlistPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.wishlist;
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: d.title }]} />
      <h1 className="t-h1 mt-8">{d.title}</h1>
      <Suspense fallback={null}>
        <WishlistView />
      </Suspense>
    </div>
  );
}
