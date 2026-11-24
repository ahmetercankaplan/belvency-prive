import type { Metadata } from "next";
import { LegalPage } from "@/components/shop/LegalPage";
import { returns } from "@/data/legal";
import { cardPayments } from "@/lib/flags";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { bizDayCount, dayCount } from "@/i18n/format";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.returns;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/qaytarma") };
}

export default async function ReturnsPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const all = getDict(locale).legal;
  const d = all.returns;
  const days = dayCount(locale, returns.days);
  const refundDays = bizDayCount(locale, returns.refundBusinessDays);

  return (
    <LegalPage
      locale={locale}
      title={d.title}
      crumb={d.crumb}
      intro={fmt(d.intro, { days })}
      sections={[
        { title: d.good.title, p: [fmt(d.good.p, { days })], ul: d.good.ul },
        { title: d.excluded.title, ul: d.excluded.ul, after: d.excluded.after },
        { title: d.defective.title, p: [d.defective.p] },
        { title: d.how.title, ul: d.how.ul, after: fmt(d.how.after, { payer: all.units.payer[returns.returnShippingPaidBy] }) },
        {
          title: d.refund.title,
          p: [fmt(d.refund.p1, { refundDays, cardPart: cardPayments ? d.refund.cardPart : "" }), d.refund.p2],
        },
      ]}
    />
  );
}
