"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import {
  defaultOption,
  isSale,
  matchesGender,
  priceCeiling,
  priceFor,
  searchProducts,
  sortLabels,
  sortProducts,
  type SortKey,
} from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import type { Gender, Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

interface Props {
  /** products already scoped by the page (category, brand, collection…) */
  products: Product[];
  /** show the category filter (only useful when scope spans several categories) */
  showCategoryFilter?: boolean;
  /** show the brand filter */
  showBrandFilter?: boolean;
  /** show the gender switch */
  showGenderFilter?: boolean;
  /** remounts filters when the scope changes */
  scopeKey: string;
  emptyHint?: string;
}

const GENDER_OPTIONS: { value: Gender | ""; label: string }[] = [
  { value: "", label: "Hamısı" },
  { value: "qadin", label: "Qadın" },
  { value: "kisi", label: "Kişi" },
];

const Check = ({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) => (
  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.95rem]">
    <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
    <span
      aria-hidden="true"
      className="grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-[3px] border border-gold bg-ivory transition-colors peer-checked:border-garnet peer-checked:bg-garnet peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-deep"
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-ivory">
          <path d="M2 6.5l2.6 2.6L10 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="flex-1">{label}</span>
    {count !== undefined && <span className="text-xs text-muted">{count}</span>}
  </label>
);

export function CatalogView(props: Props) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogUrlBridge {...props} />
    </Suspense>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[4/5]" />
          <div className="skeleton mt-4 h-3 w-1/3" />
          <div className="skeleton mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function CatalogUrlBridge(props: Props) {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim() ?? "";
  const cinsRaw = sp.get("cins");
  const cins: Gender | null = cinsRaw === "qadin" || cinsRaw === "kisi" ? cinsRaw : null;
  const maxParam = Number(sp.get("max"));
  const initialMax = Number.isFinite(maxParam) && maxParam > 0 ? Math.min(maxParam, priceCeiling) : priceCeiling;

  return <CatalogInner key={`${props.scopeKey}|${initialMax}`} {...props} q={q} cins={cins} initialMax={initialMax} />;
}

function CatalogInner({
  products,
  showCategoryFilter,
  showBrandFilter = true,
  showGenderFilter = true,
  emptyHint,
  q,
  cins,
  initialMax,
}: Props & { q: string; cins: Gender | null; initialMax: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [sort, setSort] = useState<SortKey>("tovsiye");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [brandSel, setBrandSel] = useState<string[]>([]);
  const [catSel, setCatSel] = useState<string[]>([]);
  const [matSel, setMatSel] = useState<string[]>([]);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [sheet, setSheet] = useState(false);

  const base = useMemo(() => {
    let list = q ? searchProducts(q, products) : products;
    list = list.filter((p) => matchesGender(p, cins));
    return list;
  }, [products, q, cins]);

  // facets are computed from the scoped list so counts are always honest
  const facets = useMemo(() => {
    const count = (keyFn: (p: Product) => string | undefined) => {
      const m = new Map<string, number>();
      base.forEach((p) => {
        const k = keyFn(p);
        if (k) m.set(k, (m.get(k) ?? 0) + 1);
      });
      return [...m.entries()];
    };
    return {
      brands: count((p) => p.brandSlug).sort((a, b) => (getBrand(a[0])?.name ?? "").localeCompare(getBrand(b[0])?.name ?? "", "az")),
      cats: count((p) => p.category).sort((a, b) => (getCategory(a[0])?.title ?? "").localeCompare(getCategory(b[0])?.title ?? "", "az")),
      materials: count((p) => p.material?.split(",")[0].trim()).sort((a, b) => b[1] - a[1]),
    };
  }, [base]);

  const filtered = useMemo(() => {
    const list = base.filter((p) => {
      const cur = priceFor(p, defaultOption(p)).current;
      if (cur < minPrice || cur > maxPrice) return false;
      if (brandSel.length && !brandSel.includes(p.brandSlug)) return false;
      if (catSel.length && !catSel.includes(p.category)) return false;
      if (matSel.length && !matSel.includes(p.material?.split(",")[0].trim() ?? "")) return false;
      if (onlyStock && !p.inStock) return false;
      if (onlySale && !isSale(p)) return false;
      return true;
    });
    return sortProducts(list, sort);
  }, [base, minPrice, maxPrice, brandSel, catSel, matSel, onlyStock, onlySale, sort]);

  const activeCount =
    brandSel.length +
    catSel.length +
    matSel.length +
    (onlyStock ? 1 : 0) +
    (onlySale ? 1 : 0) +
    (minPrice > 0 || maxPrice < priceCeiling ? 1 : 0);

  const reset = () => {
    setMinPrice(0);
    setMaxPrice(priceCeiling);
    setBrandSel([]);
    setCatSel([]);
    setMatSel([]);
    setOnlyStock(false);
    setOnlySale(false);
  };

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const panel = (
    <div className="space-y-8">
      {showGenderFilter && (
        <fieldset>
          <legend className="font-display text-xl font-medium">Kimin üçün</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((g) => {
              const active = (cins ?? "") === g.value;
              return (
                <button
                  key={g.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setParam("cins", g.value)}
                  className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                    active ? "border-garnet bg-garnet text-ivory" : "border-sand hover:border-cocoa"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="font-display text-xl font-medium">Qiymət</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs text-muted">
            Min. (₼)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={priceCeiling}
              value={minPrice || ""}
              placeholder="0"
              onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))}
              className="field mt-1"
            />
          </label>
          <label className="text-xs text-muted">
            Maks. (₼)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={priceCeiling}
              value={maxPrice >= priceCeiling ? "" : maxPrice}
              placeholder={String(priceCeiling)}
              onChange={(e) => setMaxPrice(e.target.value ? Math.max(0, Number(e.target.value)) : priceCeiling)}
              className="field mt-1"
            />
          </label>
        </div>
      </fieldset>

      {showCategoryFilter && facets.cats.length > 1 && (
        <fieldset>
          <legend className="font-display text-xl font-medium">Kateqoriya</legend>
          <div className="mt-2">
            {facets.cats.map(([slug, n]) => (
              <Check key={slug} checked={catSel.includes(slug)} onChange={() => toggle(catSel, setCatSel, slug)} label={getCategory(slug)?.title ?? slug} count={n} />
            ))}
          </div>
        </fieldset>
      )}

      {showBrandFilter && facets.brands.length > 1 && (
        <fieldset>
          <legend className="font-display text-xl font-medium">Brend</legend>
          <div className="mt-2">
            {facets.brands.map(([slug, n]) => (
              <Check key={slug} checked={brandSel.includes(slug)} onChange={() => toggle(brandSel, setBrandSel, slug)} label={getBrand(slug)?.name ?? slug} count={n} />
            ))}
          </div>
        </fieldset>
      )}

      {facets.materials.length > 1 && (
        <fieldset>
          <legend className="font-display text-xl font-medium">Material</legend>
          <div className="mt-2">
            {facets.materials.map(([m, n]) => (
              <Check key={m} checked={matSel.includes(m)} onChange={() => toggle(matSel, setMatSel, m)} label={m} count={n} />
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="font-display text-xl font-medium">Mövcudluq</legend>
        <div className="mt-2">
          <Check checked={onlyStock} onChange={() => setOnlyStock(!onlyStock)} label="Yalnız stokda olanlar" />
          <Check checked={onlySale} onChange={() => setOnlySale(!onlySale)} label="Yalnız endirimdə olanlar" />
        </div>
      </fieldset>
    </div>
  );

  const removable: { key: string; label: string; clear: () => void }[] = [
    ...(q ? [{ key: "q", label: `“${q}”`, clear: () => setParam("q", "") }] : []),
    ...(cins ? [{ key: "cins", label: cins === "qadin" ? "Qadın" : "Kişi", clear: () => setParam("cins", "") }] : []),
    ...catSel.map((s) => ({ key: `c${s}`, label: getCategory(s)?.title ?? s, clear: () => toggle(catSel, setCatSel, s) })),
    ...brandSel.map((s) => ({ key: `b${s}`, label: getBrand(s)?.name ?? s, clear: () => toggle(brandSel, setBrandSel, s) })),
    ...matSel.map((s) => ({ key: `m${s}`, label: s, clear: () => toggle(matSel, setMatSel, s) })),
    ...(minPrice > 0 || maxPrice < priceCeiling
      ? [{ key: "price", label: `${formatAZN(minPrice)} – ${formatAZN(maxPrice)}`, clear: () => (setMinPrice(0), setMaxPrice(priceCeiling)) }]
      : []),
    ...(onlyStock ? [{ key: "stock", label: "Stokda var", clear: () => setOnlyStock(false) }] : []),
    ...(onlySale ? [{ key: "sale", label: "Endirimdə", clear: () => setOnlySale(false) }] : []),
  ];

  return (
    <div className="grid gap-x-12 lg:grid-cols-[16rem_1fr] xl:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label="Süzgəclər">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-8 pr-2">{panel}</div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-muted" aria-live="polite">
            {filtered.length} məhsul
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="btn btn-ghost min-h-11 px-4 text-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Süzgəclər{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only sm:not-sr-only text-muted">Sırala:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="field min-h-11 w-auto py-2 pr-8 text-sm"
              >
                {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {sortLabels[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {removable.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Aktiv süzgəclər">
            {removable.map((r) => (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={r.clear}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-linen px-3.5 text-[0.8rem] transition-colors hover:bg-blush"
                  aria-label={`${r.label} süzgəcini sil`}
                >
                  {r.label}
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </li>
            ))}
            {activeCount > 0 && (
              <li>
                <button type="button" onClick={reset} className="link-u ml-1 text-[0.8rem]">
                  Hamısını təmizlə
                </button>
              </li>
            )}
          </ul>
        )}

        <div className="mt-8">
          {filtered.length > 0 ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="rounded-sm bg-linen px-6 py-16 text-center md:py-24">
              <p className="t-h2">Uyğun məhsul tapılmadı</p>
              <p className="mx-auto mt-3 max-w-[44ch] text-muted">
                {emptyHint ?? "Seçdiyiniz süzgəclərə uyğun məhsul yoxdur. Bəzi süzgəcləri silin və ya qiymət aralığını genişləndirin."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => { reset(); if (q) setParam("q", ""); }} className="btn btn-primary">
                  Süzgəcləri təmizlə
                </button>
                <Link href="/kataloq" className="btn btn-ghost">
                  Bütün kataloq
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Overlay open={sheet} onClose={() => setSheet(false)} label="Süzgəclər" side="bottom" hideClose>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="t-h3">Süzgəclər</h2>
          <button type="button" onClick={() => setSheet(false)} className="link-u text-sm">
            Bağla
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{panel}</div>
        <div className="flex gap-3 border-t border-line bg-ivory px-6 py-4">
          <button type="button" onClick={reset} className="btn btn-ghost flex-1">
            Təmizlə
          </button>
          <button type="button" onClick={() => setSheet(false)} className="btn btn-primary flex-[2]">
            {filtered.length} məhsula bax
          </button>
        </div>
      </Overlay>
    </div>
  );
}
