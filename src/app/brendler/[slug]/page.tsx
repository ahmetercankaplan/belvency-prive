import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { brands, getBrand } from "@/data/brands";
import { products } from "@/data/products";

type Params = { slug: string };

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBrand(slug);
  return b ? { title: b.name, description: b.blurb } : {};
}

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const list = products.filter((p) => p.brandSlug === slug);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Brendlər", href: "/brendler" }, { label: brand.name }]}
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
