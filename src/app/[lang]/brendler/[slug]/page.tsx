import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { brands } from "@/data/brands";
import { locales } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { alternatesFor, getCatalog, resolveLocale } from "@/i18n/server";

type Params = { lang: string; slug: string };

export function generateStaticParams() {
  return locales.flatMap((lang) => brands.map((b) => ({ lang, slug: b.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const b = getCatalog(locale).getBrand(slug);
  return b ? { title: b.name, description: b.blurb, alternates: alternatesFor(locale, `/brendler/${slug}`) } : {};
}

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const c = getCatalog(locale);
  const brand = c.getBrand(slug);
  if (!brand) notFound();
  const list = c.products.filter((p) => p.brandSlug === slug);
  const d = getDict(locale).pages.brands;

  return (
    <>
      <PageHeader
        crumbs={[{ label: d.crumb, href: "/brendler" }, { label: brand.name }]}
        title={brand.name}
        intro={brand.blurb}
        art={{ kind: brand.kind, tone: brand.tone }}
      />
      <div className="container-x mt-10">
        <CatalogView products={list} scopeKey={slug} showBrandFilter={false} showCategoryFilter />
      </div>
    </>
  );
}
