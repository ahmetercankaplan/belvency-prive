"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { ProductArt } from "@/components/ui/ProductArt";
import type { Brand } from "@/lib/types";
import type { StoredProduct } from "../../../server/catalog.ts";
import { useApi } from "./api";
import { Notice, fmt, inputCls } from "./ui";
import { ProductEditor } from "./ProductEditor";

function stockLabel(p: StoredProduct) {
  if (p.option) {
    const total = p.option.values.reduce((s, v) => s + (v.stock ?? 0), 0);
    return { total, text: `${total} ədəd · ${p.option.values.length} variant` };
  }
  const total = p.stock ?? 0;
  return { total, text: `${total} ədəd` };
}

export function ProductsView() {
  const products = useApi<{ products: StoredProduct[]; categories: { slug: string; title: string; group: string }[] }>("/api/admin/products");
  const brands = useApi<{ brands: Brand[] }>("/api/admin/brands");
  const [editing, setEditing] = useState<StoredProduct | "new" | null>(null);
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(false);

  const brandName = (slug: string) => brands.data?.brands.find((b) => b.slug === slug)?.name ?? slug;
  const catName = (slug: string) => products.data?.categories.find((c) => c.slug === slug)?.title ?? slug;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (products.data?.products ?? []).filter((p) => !needle || `${p.title} ${p.slug}`.toLowerCase().includes(needle));
  }, [products.data, q]);

  const ready = products.data && brands.data;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[2.2rem] font-medium leading-tight">Məhsullar</h1>
        <button type="button" disabled={!ready} onClick={() => { setSaved(false); setEditing("new"); }} className="btn btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" /> Yeni məhsul
        </button>
      </div>

      {(products.error || brands.error) && <div className="mt-4"><Notice tone="error">{products.error ?? brands.error}</Notice></div>}
      {saved && <div className="mt-4"><Notice tone="ok">Yadda saxlanıldı. Dəyişikliklərin saytda görünməsi üçün “Ümumi baxış” bölməsində “Dərc et” düyməsinə basın.</Notice></div>}
      {brands.data && brands.data.brands.length === 0 && (
        <div className="mt-4"><Notice tone="warn">Məhsul əlavə etmək üçün əvvəlcə “Brendlər” bölməsində brend yaradın.</Notice></div>
      )}

      <div className="mt-6 max-w-sm">
        <label htmlFor="pq" className="sr-only">Məhsul axtar</label>
        <input id="pq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Məhsul axtar" className={inputCls} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white/60">
        {products.loading && <p className="p-6 text-muted">Yüklənir…</p>}
        {products.data && list.length === 0 && (
          <p className="px-6 py-14 text-center text-muted">{products.data.products.length === 0 ? "Hələ məhsul yoxdur. İlk məhsulu “Yeni məhsul” düyməsi ilə əlavə edin." : "Axtarışa uyğun məhsul yoxdur."}</p>
        )}
        <ul className="divide-y divide-line">
          {list.map((p) => {
            const st = stockLabel(p);
            return (
              <li key={p.id}>
                <button type="button" onClick={() => { setSaved(false); setEditing(p); }} className="grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-linen/60 md:grid-cols-[3.5rem_1fr_9rem_9rem_7rem]">
                  <span className="block w-14 overflow-hidden rounded-md bg-linen">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt="" className="aspect-[4/5] w-full object-cover" />
                    ) : (
                      <ProductArt kind={p.kind} tone={p.tone} metal={p.metal} label="" className="aspect-[4/5] w-full" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.title}</span>
                    <span className="block truncate text-sm text-muted">{brandName(p.brandSlug)} · {catName(p.category)}</span>
                  </span>
                  <span className="text-right md:text-left">
                    <span className="block font-medium">{fmt(p.salePrice ?? p.price)}</span>
                    {p.salePrice && <span className="block text-xs text-muted line-through">{fmt(p.price)}</span>}
                  </span>
                  <span className={`hidden text-sm md:block ${st.total === 0 ? "font-medium text-garnet-bright" : "text-muted"}`}>{st.total === 0 ? "Stok bitib" : st.text}</span>
                  <span className="hidden md:block">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs ${p.active ? "bg-[#dfeee0] text-[#2f5d33]" : "bg-line text-muted"}`}>{p.active ? "Saytda" : "Gizli"}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {ready && editing && (
        <ProductEditor
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? null : editing}
          brands={brands.data!.brands}
          categories={products.data!.categories}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setSaved(true); products.reload(); }}
        />
      )}
    </div>
  );
}
