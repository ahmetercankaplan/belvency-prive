import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shop/PageHeader";
import { ProductArt } from "@/components/ui/ProductArt";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { live } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Brendlər",
  description: "Belvency Privé kolleksiyasındakı nümayiş brendləri.",
};

export default function BrandsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Brendlər" }]}
        title="Seçilmiş brendlər"
        intro={live ? "Kolleksiyamızda təqdim olunan brendlər." : "Bu səhifədəki brendlər dizayn nümayişi üçün uydurulub və real şirkətlərlə əlaqəsi yoxdur."}
        art={{ kind: "bag", tone: "taupe" }}
      />
      <section className="container-x mt-14" aria-label="Brend siyahısı">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {brands.map((b, i) => {
            const count = products.filter((p) => p.brandSlug === b.slug).length;
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
                    {b.specialty} · {count} məhsul
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
