import type { Metadata } from "next";
import { LegalPage } from "@/components/shop/LegalPage";
import { delivery } from "@/data/legal";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { cardPayments } from "@/lib/flags";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { bizDayRange } from "@/i18n/format";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.delivery;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/catdirilma") };
}

export default async function DeliveryPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.delivery;
  const baku = bizDayRange(locale, delivery.bakuMin, delivery.bakuMax);
  const region = bizDayRange(locale, delivery.regionMin, delivery.regionMax);

  return (
    <LegalPage
      locale={locale}
      title={d.title}
      crumb={d.crumb}
      intro={d.intro}
      sections={[
        {
          title: d.area.title,
          ul: d.area.ul.map((x) =>
            fmt(x, { baku: formatAZN(site.bakuDeliveryFee), region: formatAZN(site.regionDeliveryFee), free: formatAZN(site.freeDeliveryFrom) }),
          ),
          after: d.area.after,
        },
        { title: d.time.title, ul: d.time.ul.map((x) => fmt(x, { baku, region })), after: d.time.after },
        { title: d.handover.title, ul: d.handover.ul },
        { title: d.pay.title, ul: cardPayments ? d.pay.card : d.pay.cash, after: d.pay.after },
        ...(cardPayments ? [{ title: d.cardSecurity.title, p: d.cardSecurity.p }] : []),
        { title: d.cancel.title, p: [d.cancel.p] },
      ]}
    />
  );
}
