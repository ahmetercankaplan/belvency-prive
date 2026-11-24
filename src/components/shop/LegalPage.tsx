import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { legalUpdated, seller } from "@/data/legal";

export interface LegalSection {
  title: string;
  /** paragraphs */
  p?: ReactNode[];
  /** bullet list */
  ul?: ReactNode[];
  /** closing paragraph after the list */
  after?: ReactNode;
}

const PENDING = <span className="rounded bg-champagne/60 px-1.5 text-garnet-deep">doldurulmalıdır</span>;

/** Seller identity block required by the e-commerce law; empty fields are flagged until filled in src/data/legal.ts. */
export function SellerCard() {
  const rows: [string, string][] = [
    ["Satıcı", seller.name],
    ["Hüquqi forma", seller.form],
    ["VÖEN", seller.voen],
    ["Dövlət qeydiyyatı", seller.registry],
    ["Ünvan", seller.address],
    ["Telefon", seller.phone],
    ["E-poçt", seller.email],
    ["İş saatları", seller.hours],
  ];
  return (
    <dl className="grid max-w-xl grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 border border-line bg-linen p-6 text-[0.95rem]">
      {rows
        .filter(([k, v]) => v || k !== "Dövlət qeydiyyatı")
        .map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd>{v || PENDING}</dd>
          </div>
        ))}
    </dl>
  );
}

export function LegalPage({
  title,
  crumb,
  intro,
  sections,
  children,
}: {
  title: string;
  crumb: string;
  intro: ReactNode;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <div className="container-x pt-6 pb-4">
      <Breadcrumbs items={[{ label: crumb }]} />
      <div className="mx-auto mt-10 max-w-3xl md:mt-14">
        <h1 className="t-h1">{title}</h1>
        <p className="mt-3 text-sm text-muted">Son yenilənmə: {legalUpdated}</p>
        <p className="t-lead mt-6 !max-w-none">{intro}</p>
        {children && <div className="mt-8">{children}</div>}
        <ol className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <li key={s.title}>
              <h2 className="t-h3">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-cocoa/90">
                {s.p?.map((x, k) => (
                  <p key={k}>{x}</p>
                ))}
                {s.ul && (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {s.ul.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                )}
                {s.after && <p>{s.after}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
