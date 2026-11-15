import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kataloq",
  description: "Belvency Privé-nin bütün məhsulları: ətir, zərgərlik, çanta, saat və aksesuarlar.",
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Kataloq" }]}
        title="Bütün kolleksiya"
        intro="Ətirdən zərgərliyə qədər seçilmiş məhsulları bir yerdə nəzərdən keçirin."
        art={{ kind: "perfume", tone: "blush" }}
      >
        <ul className="mt-6 flex flex-wrap gap-2">
          {categories.slice(0, 8).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/kataloq/${c.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-sand px-4 text-sm transition-colors hover:border-garnet hover:bg-garnet hover:text-ivory"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>
      <div className="container-x mt-10">
        <CatalogView products={products} scopeKey="all" showCategoryFilter />
      </div>
    </>
  );
}
