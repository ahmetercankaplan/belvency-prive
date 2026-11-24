import Link from "@/i18n/link";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHeader } from "@/components/shop/PageHeader";
import { ProductArt } from "@/components/ui/ProductArt";
import { categoriesFor, matchesGender } from "@/lib/catalog";
import type { ArtKind, Gender, Tone } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { getCatalog } from "@/i18n/server";

export function GenderLanding({
  locale,
  gender,
  title,
  intro,
  art,
}: {
  locale: Locale;
  gender: Exclude<Gender, "uniseks">;
  title: string;
  intro: string;
  art: { kind: ArtKind; tone: Tone };
}) {
  const d = getDict(locale).shop.gender;
  const c = getCatalog(locale);
  const cats = categoriesFor(gender, c.categories);
  const scoped = c.products.filter((p) => matchesGender(p, gender));
  return (
    <>
      <PageHeader crumbs={[{ label: title }]} title={title} intro={intro} art={art} />
      <section className="container-x mt-12" aria-label={d.categories}>
        <ul className="rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 md:gap-6">
          {cats.map((x, i) => (
            <li key={x.slug} className="w-28 shrink-0 sm:w-36 lg:w-40">
              <Link href={`/kataloq/${x.slug}?cins=${gender}`} className="group block text-center">
                <span className={`arch block ${i % 2 ? "mt-4" : ""}`}>
                  <ProductArt
                    kind={x.kind}
                    tone={x.tone}
                    label=""
                    flat
                    className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block font-display text-lg font-medium">{x.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="container-x mt-16">
        <h2 className="t-h2 mb-8">{d.all}</h2>
        <CatalogView products={scoped} scopeKey={gender} showCategoryFilter showGenderFilter={false} />
      </div>
    </>
  );
}
