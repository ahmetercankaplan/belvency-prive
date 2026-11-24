import type { Metadata } from "next";
import Link from "@/i18n/link";
import { PageHeader } from "@/components/shop/PageHeader";
import { ProductArt } from "@/components/ui/ProductArt";
import { live } from "@/lib/flags";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { alternatesFor, getCatalog, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.brands;
  return { title: d.crumb, description: d.description, alternates: alternatesFor(locale, "/brendler") };
}

export default async function BrandsPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.brands;
  const c = getCatalog(locale);
  return (
    <>
      <PageHeader
        crumbs={[{ label: d.crumb }]}
        title={d.title}
        intro={live ? d.introLive : d.introDemo}
        art={{ kind: "bag", tone: "taupe" }}
      />

      <section className="container-x mt-14" aria-label={d.list}>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {c.brands.map((b, i) => {
            const count = c.products.filter((p) => p.brandSlug === b.slug).length;
            return (
              <li key={b.slug} className={i % 2 ? "md:mt-10" : ""}>
                <Link href={`/brendler/${b.slug}`} className="group block">
                  <span className="arch block">
                    <ProductArt
                      kind={b.kind}
                      tone={b.tone}
                      label=""
                      flat
                      className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-4 block font-display text-2xl font-medium">{b.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {b.specialty} · {fmt(d.count, { n: count })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
