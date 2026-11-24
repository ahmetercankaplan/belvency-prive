import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import Link from "@/i18n/link";
import { getDict } from "@/i18n/dict";
import { alternatesFor, getCatalog, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.catalog;
  return { title: d.crumb, description: d.description, alternates: alternatesFor(locale, "/kataloq") };
}

export default async function CatalogPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.catalog;
  const c = getCatalog(locale);
  return (
    <>
      <PageHeader crumbs={[{ label: d.crumb }]} title={d.title} intro={d.intro} art={{ kind: "perfume", tone: "blush" }}>
        <ul className="mt-6 flex flex-wrap gap-2">
          {c.categories.slice(0, 8).map((x) => (
            <li key={x.slug}>
              <Link
                href={`/kataloq/${x.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-sand px-4 text-sm transition-colors hover:border-garnet hover:bg-garnet hover:text-ivory"
              >
                {x.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>
      <div className="container-x mt-10">
        <CatalogView products={c.products} scopeKey="all" showCategoryFilter />
      </div>
    </>
  );
}
