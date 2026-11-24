import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { categories, collections, groups } from "@/data/categories";
import { isSale } from "@/lib/catalog";
import type { Product, Tag } from "@/lib/types";
import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { alternatesFor, getCatalog, resolveLocale } from "@/i18n/server";

type Params = { lang: string; slug: string };

const COLLECTION_TAG: Record<string, Tag | "sale"> = {
  "yeni-gelenler": "yeni",
  "cox-satilanlar": "cox-satilanlar",
  "ekskluziv-kolleksiya": "ekskluziv",
  "hediyye-secimleri": "hediyye",
  "xususi-teklifler": "sale",
};

function resolve(locale: Locale, slug: string) {
  const c = getCatalog(locale);
  const crumb = getDict(locale).pages.catalog.crumb;
  const cat = c.getCategory(slug);
  if (cat) {
    return {
      title: cat.title,
      intro: cat.blurb,
      art: { kind: cat.kind, tone: cat.tone },
      list: c.products.filter((p) => p.category === slug),
      crumbs: [{ label: crumb, href: "/kataloq" }, { label: cat.title }],
      multiCategory: false,
    };
  }
  const group = c.getGroup(slug);
  if (group) {
    const cats = c.categoriesOfGroup(slug);
    const slugs = cats.map((x) => x.slug);
    const first = cats[0];
    return {
      title: group.title,
      intro: group.blurb,
      art: { kind: first.kind, tone: first.tone },
      list: c.products.filter((p) => slugs.includes(p.category)),
      crumbs: [{ label: crumb, href: "/kataloq" }, { label: group.title }],
      multiCategory: true,
    };
  }
  const col = c.getCollection(slug);
  if (col) {
    const key = COLLECTION_TAG[slug];
    const list: Product[] = key === "sale" ? c.products.filter(isSale) : c.products.filter((p) => p.tags.includes(key));
    const lead = list[0];
    return {
      title: col.title,
      intro: col.blurb,
      art: { kind: lead?.kind ?? "giftbox", tone: lead?.tone ?? "blush", metal: lead?.metal },
      list,
      crumbs: [{ label: crumb, href: "/kataloq" }, { label: col.title }],
      multiCategory: true,
    };
  }
  return null;
}

export function generateStaticParams() {
  const slugs = [...categories.map((c) => c.slug), ...groups.map((g) => g.slug), ...collections.map((c) => c.slug)];
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const r = resolve(locale, slug);
  return r ? { title: r.title, description: r.intro, alternates: alternatesFor(locale, `/kataloq/${slug}`) } : {};
}

export default async function CatalogSlugPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const r = resolve(locale, slug);
  if (!r) notFound();
  const d = getDict(locale).pages.catalog;

  return (
    <>
      <PageHeader crumbs={r.crumbs} title={r.title} intro={r.intro} art={r.art}>
        {slug === "hediyye-secimleri" && (
          <Link href="/hediyye-sihirbazi" className="btn btn-primary mt-6">
            {d.giftWizard}
          </Link>
        )}
      </PageHeader>
      <div className="container-x mt-10">
        <CatalogView products={r.list} scopeKey={slug} showCategoryFilter={r.multiCategory} />
      </div>
    </>
  );
}
