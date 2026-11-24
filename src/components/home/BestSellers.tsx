"use client";

import Link from "@/i18n/link";
import { useMemo, useState } from "react";
import { ProductRail } from "@/components/shop/ProductRail";
import { useCatalog } from "@/i18n/use-catalog";
import { useT } from "@/i18n/provider";
import type { Product } from "@/lib/types";

export function BestSellers({ products }: { products: Product[] }) {
  const t = useT().home.best;
  const { getCategory, groups } = useCatalog();
  const [group, setGroup] = useState<string>("hamisi");

  const shown = useMemo(() => {
    const list = group === "hamisi" ? products : products.filter((p) => getCategory(p.category)?.group === group);
    return list.slice(0, 4);
  }, [group, products, getCategory]);

  const tabs = [{ slug: "hamisi", title: t.all }, ...groups.map((g) => ({ slug: g.slug, title: g.title }))];

  return (
    <section className="container-x" aria-labelledby="bestsellers">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <h2 id="bestsellers" className="t-h2">
          {t.title}
        </h2>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.filter}>
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              aria-pressed={group === tab.slug}
              onClick={() => setGroup(tab.slug)}
              className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                group === tab.slug ? "border-garnet bg-garnet text-ivory" : "border-sand hover:border-cocoa"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-9">
        {shown.length > 0 ? <ProductRail products={shown} label={t.rail} /> : <p className="py-10 text-muted">{t.empty}</p>}
      </div>
      <Link href="/kataloq/cox-satilanlar" className="link-u mt-8 inline-block text-sm font-medium">
        {t.viewAll}
      </Link>
    </section>
  );
}
