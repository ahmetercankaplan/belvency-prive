"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductRail } from "@/components/shop/ProductRail";
import { getCategory, groups } from "@/data/categories";
import type { Product } from "@/lib/types";

export function BestSellers({ products }: { products: Product[] }) {
  const [group, setGroup] = useState<string>("hamisi");

  const shown = useMemo(() => {
    const list = group === "hamisi" ? products : products.filter((p) => getCategory(p.category)?.group === group);
    return list.slice(0, 4);
  }, [group, products]);

  const tabs = [{ slug: "hamisi", title: "Hamısı" }, ...groups.map((g) => ({ slug: g.slug, title: g.title }))];

  return (
    <section className="container-x" aria-labelledby="bestsellers">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <h2 id="bestsellers" className="t-h2">
          Çox satılanlar
        </h2>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Kateqoriyaya görə süz">
          {tabs.map((t) => (
            <button
              key={t.slug}
              type="button"
              aria-pressed={group === t.slug}
              onClick={() => setGroup(t.slug)}
              className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                group === t.slug ? "border-garnet bg-garnet text-ivory" : "border-sand hover:border-cocoa"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-9">
        {shown.length > 0 ? (
          <ProductRail products={shown} label="Çox satılan məhsullar" />
        ) : (
          <p className="py-10 text-muted">Bu bölmədə hələ çox satılan məhsul yoxdur.</p>
        )}
      </div>
      <Link href="/kataloq/cox-satilanlar" className="link-u mt-8 inline-block text-sm font-medium">
        Bütün çox satılanlara bax
      </Link>
    </section>
  );
}
