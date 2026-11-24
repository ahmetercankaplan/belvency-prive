import type { Metadata } from "next";
import { LegalPage, SellerCard } from "@/components/shop/LegalPage";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.contact;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/elaqe") };
}

export default async function ContactPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.contact;

  return (
    <LegalPage
      locale={locale}
      title={d.title}
      crumb={d.crumb}
      intro={d.intro}
      sections={[
        { title: d.how.title, p: d.how.p },
        { title: d.unresolved.title, p: d.unresolved.p },
      ]}
    >
      <SellerCard locale={locale} />
    </LegalPage>
  );
}
