import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Rich } from "@/components/ui/Rich";
import { legalUpdated, sellerHours, seller } from "@/data/legal";
import { fmt, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import type { Sec } from "@/i18n/dict/legal";

const DATE_TAG: Record<Locale, string> = { az: "az-AZ", en: "en-GB", ru: "ru-RU" };

function formatLegalDate(locale: Locale) {
  return new Date(`${legalUpdated}T00:00:00Z`).toLocaleDateString(DATE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Seller identity block required by the e-commerce law; empty fields are flagged until filled in src/data/legal.ts. */
export function SellerCard({ locale }: { locale: Locale }) {
  const d = getDict(locale).legal;
  const pending = <span className="rounded bg-champagne/60 px-1.5 text-garnet-deep">{d.pending}</span>;
  const rows: [string, string, boolean][] = [
    [d.sellerRows.seller, seller.name, true],
    [d.sellerRows.form, seller.form, true],
    [d.sellerRows.voen, seller.voen, true],
    [d.sellerRows.registry, seller.registry, false],
    [d.sellerRows.address, seller.address, true],
    [d.sellerRows.phone, seller.phone, true],
    [d.sellerRows.email, seller.email, true],
    [d.sellerRows.hours, sellerHours(locale), true],
  ];
  return (
    <dl className="grid max-w-xl grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 border border-line bg-linen p-6 text-[0.95rem]">
      {rows
        .filter(([, v, required]) => v || required)
        .map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd>{v || pending}</dd>
          </div>
        ))}
    </dl>
  );
}

export function LegalPage({
  locale,
  title,
  crumb,
  intro,
  sections,
  children,
}: {
  locale: Locale;
  title: string;
  crumb: string;
  intro: string;
  sections: Sec[];
  children?: ReactNode;
}) {
  const d = getDict(locale).legal;
  return (
    <div className="container-x pt-6 pb-4">
      <Breadcrumbs items={[{ label: crumb }]} />
      <div className="mx-auto mt-10 max-w-3xl md:mt-14">
        <h1 className="t-h1">{title}</h1>
        <p className="mt-3 text-sm text-muted">{fmt(d.updated, { date: formatLegalDate(locale) })}</p>
        {d.translationNote && <p className="mt-2 text-sm text-muted">{d.translationNote}</p>}
        <p className="t-lead mt-6 !max-w-none">
          <Rich text={intro} />
        </p>
        {children && <div className="mt-8">{children}</div>}
        <ol className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <li key={s.title}>
              <h2 className="t-h3">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-cocoa/90">
                {s.p?.map((x, k) => (
                  <p key={k}>
                    <Rich text={x} />
                  </p>
                ))}
                {s.ul && (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {s.ul.map((x, k) => (
                      <li key={k}>
                        <Rich text={x} />
                      </li>
                    ))}
                  </ul>
                )}
                {s.after && (
                  <p>
                    <Rich text={s.after} />
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
