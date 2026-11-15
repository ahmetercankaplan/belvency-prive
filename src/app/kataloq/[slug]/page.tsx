import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { categories, categoriesOfGroup, collections, getCategory, getCollection, getGroup, groups } from "@/data/categories";
import { products } from "@/data/products";
import { isSale } from "@/lib/catalog";
import type { Product, Tag } from "@/lib/types";

type Params = { slug: string };

const COLLECTION_TAG: Record<string, Tag | "sale"> = {
  "yeni-gelenler": "yeni",
  "cox-satilanlar": "cox-satilanlar",
  "ekskluziv-kolleksiya": "ekskluziv",
  "hediyye-secimleri": "hediyye",
  "xususi-teklifler": "sale",
};

function resolve(slug: string) {
  const cat = getCategory(slug);
  if (cat) {
    return {
      title: cat.title,
      intro: cat.blurb,
      art: { kind: cat.kind, tone: cat.tone },
      list: products.filter((p) => p.category === slug),
      crumbs: [{ label: "Kataloq", href: "/kataloq" }, { label: cat.title }],
      multiCategory: false,
    };
  }
  const group = getGroup(slug);
  if (group) {
    const slugs = categoriesOfGroup(slug).map((c) => c.slug);
    const first = categoriesOfGroup(slug)[0];
    return {
      title: group.title,
      intro: group.blurb,
      art: { kind: first.kind, tone: first.tone },
      list: products.filter((p) => slugs.includes(p.category)),
      crumbs: [{ label: "Kataloq", href: "/kataloq" }, { label: group.title }],
      multiCategory: true,
    };
  }
  const col = getCollection(slug);
  if (col) {
    const key = COLLECTION_TAG[slug];
    const list: Product[] = key === "sale" ? products.filter(isSale) : products.filter((p) => p.tags.includes(key));
    const lead = list[0];
    return {
      title: col.title,
      intro: col.blurb,
      art: { kind: lead?.kind ?? "giftbox", tone: lead?.tone ?? "blush", metal: lead?.metal },
      list,
      crumbs: [{ label: "Kataloq", href: "/kataloq" }, { label: col.title }],
      multiCategory: true,
    };
  }
  return null;
}

export function generateStaticParams() {
  return [...categories.map((c) => c.slug), ...groups.map((g) => g.slug), ...collections.map((c) => c.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const r = resolve(slug);
  return r ? { title: r.title, description: r.intro } : {};
}

export default async function CatalogSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();

  return (
    <>
      <PageHeader crumbs={r.crumbs} title={r.title} intro={r.intro} art={r.art}>
        {slug === "hediyye-secimleri" && (
          <Link href="/hediyye-sihirbazi" className="btn btn-primary mt-6">
            Hədiyyə sihirbazını sına
          </Link>
        )}
      </PageHeader>
      <div className="container-x mt-10">
        <CatalogView products={r.list} scopeKey={slug} showCategoryFilter={r.multiCategory} />
      </div>
    </>
  );
}
