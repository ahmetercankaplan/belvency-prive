import type { Metadata } from "next";
import { LegalPage, SellerCard } from "@/components/shop/LegalPage";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { cardPayments } from "@/lib/flags";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.terms;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/sertler") };
}

export default async function TermsPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.terms;
  const fee = formatAZN(site.giftWrapFee);

  return (
    <LegalPage
      locale={locale}
      title={d.title}
      crumb={d.crumb}
      intro={fmt(d.intro, { name: site.fullName })}
      sections={[
        { title: d.seller.title, p: [d.seller.p] },
        { title: d.products.title, ul: d.products.ul.map((x) => fmt(x, { fee })) },
        { title: d.ordering.title, ul: d.ordering.ul },
        { title: d.payment.title, p: [cardPayments ? d.payment.card : d.payment.cash], after: d.payment.after },
        { title: d.shipReturns.title, p: [d.shipReturns.p] },
        { title: d.gift.title, p: [d.gift.p] },
        { title: d.ip.title, p: [d.ip.p] },
        { title: d.liability.title, p: [d.liability.p] },
        { title: d.disputes.title, p: [d.disputes.p] },
        { title: d.changes.title, p: [d.changes.p] },
      ]}
    >
      <SellerCard locale={locale} />
    </LegalPage>
  );
}
