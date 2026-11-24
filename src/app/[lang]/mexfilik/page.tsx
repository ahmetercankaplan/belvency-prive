import type { Metadata } from "next";
import { LegalPage } from "@/components/shop/LegalPage";
import { site } from "@/data/site";
import { cardPayments } from "@/lib/flags";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.privacy;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/mexfilik") };
}

export default async function PrivacyPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).legal.privacy;

  return (
    <LegalPage
      locale={locale}
      title={d.title}
      crumb={d.crumb}
      intro={fmt(d.intro, { name: site.fullName })}
      sections={[
        { title: d.collect.title, ul: d.collect.ul, after: d.collect.after },
        { title: d.use.title, ul: d.use.ul, after: d.use.after },
        {
          title: d.share.title,
          ul: [d.share.courier, ...(cardPayments ? [d.share.card] : []), d.share.authorities, d.share.tech],
          after: d.share.after,
        },
        { title: d.retention.title, p: [d.retention.p] },
        { title: d.cookies.title, p: [d.cookies.p] },
        { title: d.rights.title, ul: d.rights.ul, after: d.rights.after },
        { title: d.updates.title, p: [d.updates.p] },
      ]}
    />
  );
}
