import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/CheckoutView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDict } from "@/i18n/dict";
import { resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getDict(locale).pages.checkout.title, robots: { index: false, follow: true } };
}

export default async function CheckoutPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.checkout;
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: d.crumbCart, href: "/sebet" }, { label: d.crumbPay }]} />
      <h1 className="t-h1 mt-8">{d.title}</h1>
      <CheckoutView />
    </div>
  );
}
