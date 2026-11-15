import Link from "next/link";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { ProductArt } from "@/components/ui/ProductArt";
import { categoriesFor, matchesGender } from "@/lib/catalog";
import { products } from "@/data/products";
import type { ArtKind, Gender, Tone } from "@/lib/types";

export function GenderLanding({
  gender,
  title,
  intro,
  art,
}: {
  gender: Exclude<Gender, "uniseks">;
  title: string;
  intro: string;
  art: { kind: ArtKind; tone: Tone };
}) {
  const cats = categoriesFor(gender);
  const scoped = products.filter((p) => matchesGender(p, gender));

  return (
    <>
      <PageHeader crumbs={[{ label: title }]} title={title} intro={intro} art={art} />

      <section className="container-x mt-12" aria-label="Kateqoriyalar">
        <ul className="rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 md:gap-6">
          {cats.map((c, i) => (
            <li key={c.slug} className="w-28 shrink-0 sm:w-36 lg:w-40">
              <Link href={`/kataloq/${c.slug}?cins=${gender}`} className="group block text-center">
                <span className={`arch block ${i % 2 ? "mt-4" : ""}`}>
                  <ProductArt
                    kind={c.kind}
                    tone={c.tone}
                    label=""
                    flat
                    className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block font-display text-lg font-medium">{c.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="container-x mt-16">
        <h2 className="t-h2 mb-8">Bütün məhsullar</h2>
        <CatalogView products={scoped} scopeKey={gender} showCategoryFilter showGenderFilter={false} />
      </div>
    </>
  );
}
