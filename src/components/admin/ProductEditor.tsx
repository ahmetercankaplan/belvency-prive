"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2, X } from "lucide-react";
import { groups } from "@/data/categories";
import type { Brand } from "@/lib/types";
import type { StoredProduct } from "../../../server/catalog.ts";
import { ApiError, api, photoToDataUrl } from "./api";
import { Field, Notice, inputCls } from "./ui";

const TAGS: { value: string; label: string }[] = [
  { value: "yeni", label: "Yeni" },
  { value: "cox-satilanlar", label: "Çox satılan" },
  { value: "ekskluziv", label: "Eksklüziv" },
  { value: "hediyye", label: "Hədiyyə" },
  { value: "xususi", label: "Xüsusi təklif" },
];

interface VariantRow {
  name: string;
  price: string;
  salePrice: string;
  stock: string;
}

type TextKey = "title" | "description" | "optionLabel" | "material" | "color" | "subtype";
type Translation = Record<TextKey, string>;
const emptyT = (): Translation => ({ title: "", description: "", optionLabel: "", material: "", color: "", subtype: "" });

interface Form {
  i18n: { en: Translation; ru: Translation };
  title: string;
  slug: string;
  brandSlug: string;
  category: string;
  subtype: string;
  gender: string;
  price: string;
  salePrice: string;
  hasOptions: boolean;
  stock: string;
  optionLabel: string;
  variants: VariantRow[];
  tags: string[];
  material: string;
  color: string;
  description: string;
  specs: { label: string; value: string }[];
  images: string[];
  active: boolean;
}

const blank = (brand = "", category = ""): Form => ({
  i18n: { en: emptyT(), ru: emptyT() },
  title: "", slug: "", brandSlug: brand, category, subtype: "", gender: "qadin", price: "", salePrice: "",
  hasOptions: false, stock: "0", optionLabel: "Ölçü", variants: [{ name: "", price: "", salePrice: "", stock: "0" }],
  tags: [], material: "", color: "", description: "", specs: [], images: [], active: true,
});

function fromProduct(p: StoredProduct): Form {
  return {
    i18n: { en: { ...emptyT(), ...p.i18n?.en }, ru: { ...emptyT(), ...p.i18n?.ru } },
    title: p.title, slug: p.slug, brandSlug: p.brandSlug, category: p.category, subtype: p.subtype ?? "", gender: p.gender,
    price: String(p.price), salePrice: p.salePrice ? String(p.salePrice) : "",
    hasOptions: !!p.option, stock: String(p.stock ?? 0), optionLabel: p.option?.label ?? "Ölçü",
    variants: p.option?.values.map((v) => ({ name: v.name, price: v.price ? String(v.price) : "", salePrice: v.salePrice ? String(v.salePrice) : "", stock: String(v.stock ?? 0) }))
      ?? [{ name: "", price: "", salePrice: "", stock: "0" }],
    tags: p.tags, material: p.material ?? "", color: p.color ?? "", description: p.description,
    specs: p.specs.map((s) => ({ ...s })), images: p.images ?? [], active: p.active,
  };
}

const n = (v: string) => (v.trim() === "" ? undefined : Number(v.replace(",", ".")));

function toPayload(f: Form) {
  return {
    title: f.title, slug: f.slug || undefined, brandSlug: f.brandSlug, category: f.category, subtype: f.subtype,
    gender: f.gender, price: n(f.price), salePrice: n(f.salePrice),
    ...(f.hasOptions
      ? { option: { label: f.optionLabel, values: f.variants.map((v) => ({ name: v.name, price: n(v.price), salePrice: n(v.salePrice), stock: n(v.stock) })) } }
      : { stock: n(f.stock) }),
    tags: f.tags, material: f.material, color: f.color, description: f.description,
    specs: f.specs.filter((s) => s.label.trim() || s.value.trim()), images: f.images, active: f.active,
    i18n: f.i18n,
  };
}

export function ProductEditor({
  product,
  brands,
  categories,
  onClose,
  onSaved,
}: {
  product: StoredProduct | null;
  brands: Brand[];
  categories: { slug: string; title: string; group: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState<Form>(() => (product ? fromProduct(product) : blank(brands[0]?.slug ?? "", categories[0]?.slug ?? "")));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 8 - f.images.length)) {
        const dataUrl = await photoToDataUrl(file);
        const res = await api<{ url: string }>("POST", "/api/admin/images", { dataUrl });
        urls.push(res.url);
      }
      setF((s) => ({ ...s, images: [...s.images, ...urls] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Şəkil yüklənmədi");
    }
    setUploading(false);
  };

  const move = (i: number, d: number) =>
    setF((s) => {
      const imgs = [...s.images];
      const j = i + d;
      if (j < 0 || j >= imgs.length) return s;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...s, images: imgs };
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (product) await api("PUT", `/api/admin/products/${product.id}`, toPayload(f));
      else await api("POST", "/api/admin/products", toPayload(f));
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xəta baş verdi");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!product || !confirm(`“${product.title}” məhsulunu həmişəlik silək? Gizlətmək üçün “Saytda göstər” seçimini söndürə bilərsiniz.`)) return;
    setBusy(true);
    try {
      await api("DELETE", `/api/admin/products/${product.id}`);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xəta baş verdi");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-cocoa/40" onClick={onClose} aria-hidden="true" />
      <form
        onSubmit={save}
        role="dialog"
        aria-modal="true"
        aria-label={product ? "Məhsulu redaktə et" : "Yeni məhsul"}
        className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-ivory shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-[1.5rem] font-medium">{product ? "Məhsulu redaktə et" : "Yeni məhsul"}</h2>
          <button type="button" onClick={onClose} aria-label="Bağla" className="grid h-10 w-10 place-items-center rounded-full hover:bg-linen">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
          {brands.length === 0 && <Notice tone="warn">Əvvəlcə “Brendlər” bölməsində ən azı bir brend əlavə edin.</Notice>}

          <fieldset className="space-y-4">
            <legend className="font-display text-[1.2rem] font-medium">Əsas məlumat</legend>
            <Field label="Məhsulun adı">
              <input ref={firstField} className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} maxLength={120} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brend">
                <select className={inputCls} value={f.brandSlug} onChange={(e) => set("brandSlug", e.target.value)} required>
                  {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Kateqoriya">
                <select className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)} required>
                  {groups.map((g) => (
                    <optgroup key={g.slug} label={g.title}>
                      {categories.filter((c) => c.group === g.slug).map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label="Kimin üçün">
                <select className={inputCls} value={f.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="qadin">Qadın</option>
                  <option value="kisi">Kişi</option>
                  <option value="uniseks">Unisex</option>
                </select>
              </Field>
              <Field label="Alt növ" hint="Məsələn: Çiyin çantası">
                <input className={inputCls} value={f.subtype} onChange={(e) => set("subtype", e.target.value)} maxLength={40} />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-[1.2rem] font-medium">Qiymət və stok</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Qiymət (₼)">
                <input className={inputCls} inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} required />
              </Field>
              <Field label="Endirimli qiymət (₼)" hint="Boş buraxsanız endirim olmur">
                <input className={inputCls} inputMode="decimal" value={f.salePrice} onChange={(e) => set("salePrice", e.target.value)} />
              </Field>
            </div>

            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" checked={f.hasOptions} onChange={(e) => set("hasOptions", e.target.checked)} className="h-[1.1rem] w-[1.1rem] accent-[#7b1d3a]" />
              <span className="text-sm">Variantları var (ölçü, həcm, rəng…) — hər variantın öz stoku olur</span>
            </label>

            {f.hasOptions ? (
              <div className="space-y-3 rounded-xl border border-line bg-white/50 p-4">
                <Field label="Variantın adı" hint="Məsələn: Ölçü, Həcm, Rəng">
                  <input className={inputCls} value={f.optionLabel} onChange={(e) => set("optionLabel", e.target.value)} maxLength={30} />
                </Field>
                <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-2 px-1 text-xs text-muted sm:grid">
                  <span>Dəyər</span><span>Qiymət (ixtiyari)</span><span>Endirimli</span><span>Stok</span><span className="w-10" />
                </div>
                {f.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
                    <input aria-label="Dəyər" placeholder="50 ml" className={`${inputCls} col-span-2 sm:col-span-1`} value={v.name} onChange={(e) => setF((s) => ({ ...s, variants: s.variants.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} />
                    <input aria-label="Variant qiyməti" placeholder="Qiymət" inputMode="decimal" className={inputCls} value={v.price} onChange={(e) => setF((s) => ({ ...s, variants: s.variants.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)) }))} />
                    <input aria-label="Variant endirimli qiyməti" placeholder="Endirimli" inputMode="decimal" className={inputCls} value={v.salePrice} onChange={(e) => setF((s) => ({ ...s, variants: s.variants.map((x, j) => (j === i ? { ...x, salePrice: e.target.value } : x)) }))} />
                    <input aria-label="Variant stoku" placeholder="Stok" inputMode="numeric" className={inputCls} value={v.stock} onChange={(e) => setF((s) => ({ ...s, variants: s.variants.map((x, j) => (j === i ? { ...x, stock: e.target.value } : x)) }))} />
                    <button type="button" aria-label="Variantı sil" disabled={f.variants.length === 1} onClick={() => setF((s) => ({ ...s, variants: s.variants.filter((_, j) => j !== i) }))} className="grid h-11 w-10 place-items-center rounded-lg text-muted hover:bg-blush/50 disabled:opacity-30">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setF((s) => ({ ...s, variants: [...s.variants, { name: "", price: "", salePrice: "", stock: "0" }] }))} className="flex min-h-10 items-center gap-1.5 text-sm text-garnet hover:underline">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Variant əlavə et
                </button>
              </div>
            ) : (
              <Field label="Stok (ədəd)" className="max-w-[12rem]">
                <input className={inputCls} inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value)} required />
              </Field>
            )}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-[1.2rem] font-medium">Şəkillər</legend>
            <p className="text-sm text-muted">İlk şəkil əsas şəkildir. Şəkillər avtomatik kiçildilir. Yalnız hüququ sizə məxsus şəkilləri yükləyin.</p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {f.images.map((src, i) => (
                <li key={src} className="relative overflow-hidden rounded-xl border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Şəkil ${i + 1}`} className="aspect-[4/5] w-full object-cover" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-garnet px-2 py-0.5 text-[0.65rem] text-ivory">Əsas</span>}
                  <div className="flex justify-between bg-white/95 px-1 py-0.5">
                    <button type="button" aria-label="Sola çək" disabled={i === 0} onClick={() => move(i, -1)} className="grid h-8 w-8 place-items-center disabled:opacity-25"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                    <button type="button" aria-label="Şəkli sil" onClick={() => setF((s) => ({ ...s, images: s.images.filter((_, j) => j !== i) }))} className="grid h-8 w-8 place-items-center text-garnet-bright"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                    <button type="button" aria-label="Sağa çək" disabled={i === f.images.length - 1} onClick={() => move(i, 1)} className="grid h-8 w-8 place-items-center disabled:opacity-25"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                </li>
              ))}
            </ul>
            {f.images.length < 8 && (
              <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gold bg-white/40 px-4 text-sm hover:bg-white/70">
                {uploading ? "Yüklənir…" : "Şəkil seç (JPG, PNG, WebP)"}
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={uploading} onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} />
              </label>
            )}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-[1.2rem] font-medium">Təsvir və xüsusiyyətlər</legend>
            <Field label="Təsvir">
              <textarea className={inputCls} rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} maxLength={1500} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material"><input className={inputCls} value={f.material} onChange={(e) => set("material", e.target.value)} maxLength={120} /></Field>
              <Field label="Rəng"><input className={inputCls} value={f.color} onChange={(e) => set("color", e.target.value)} maxLength={60} /></Field>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Əlavə xüsusiyyətlər</p>
              {f.specs.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
                  <input aria-label="Xüsusiyyət adı" placeholder="Həcm" className={inputCls} value={s.label} onChange={(e) => setF((st) => ({ ...st, specs: st.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) }))} />
                  <input aria-label="Xüsusiyyət dəyəri" placeholder="50 ml" className={inputCls} value={s.value} onChange={(e) => setF((st) => ({ ...st, specs: st.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) }))} />
                  <button type="button" aria-label="Xüsusiyyəti sil" onClick={() => setF((st) => ({ ...st, specs: st.specs.filter((_, j) => j !== i) }))} className="grid h-11 w-10 place-items-center rounded-lg text-muted hover:bg-blush/50"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                </div>
              ))}
              {f.specs.length < 14 && (
                <button type="button" onClick={() => setF((s) => ({ ...s, specs: [...s.specs, { label: "", value: "" }] }))} className="flex min-h-10 items-center gap-1.5 text-sm text-garnet hover:underline">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Xüsusiyyət əlavə et
                </button>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-[1.2rem] font-medium">Tərcümələr (könüllü)</legend>
            <p className="text-xs text-muted">
              İngilis və rus səhifələrində göstərilən mətn. Boş buraxılan xana Azərbaycan dilində görünür. Qiymət və stok bütün dillərdə eynidir.
            </p>
            {([
              ["en", "English"],
              ["ru", "Русский"],
            ] as const).map(([lang, name]) => {
              const t = f.i18n[lang];
              const setT = (k: TextKey, v: string) => setF((s) => ({ ...s, i18n: { ...s.i18n, [lang]: { ...s.i18n[lang], [k]: v } } }));
              return (
                <details key={lang} className="rounded-xl border border-line bg-white/50 px-4 py-3" open={Object.values(t).some(Boolean)}>
                  <summary className="cursor-pointer font-medium">{name}</summary>
                  <div className="mt-4 space-y-4">
                    <Field label={`Ad (${name})`}>
                      <input className={inputCls} value={t.title} onChange={(e) => setT("title", e.target.value)} maxLength={120} lang={lang} />
                    </Field>
                    <Field label={`Təsvir (${name})`}>
                      <textarea className={inputCls} rows={4} value={t.description} onChange={(e) => setT("description", e.target.value)} maxLength={1500} lang={lang} />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={`Alt növ (${name})`}>
                        <input className={inputCls} value={t.subtype} onChange={(e) => setT("subtype", e.target.value)} maxLength={40} lang={lang} />
                      </Field>
                      <Field label={`Material (${name})`}>
                        <input className={inputCls} value={t.material} onChange={(e) => setT("material", e.target.value)} maxLength={120} lang={lang} />
                      </Field>
                      <Field label={`Rəng (${name})`}>
                        <input className={inputCls} value={t.color} onChange={(e) => setT("color", e.target.value)} maxLength={60} lang={lang} />
                      </Field>
                      {f.hasOptions && (
                        <Field label={`Variantın adı (${name})`} hint="Məsələn: Size, Volume">
                          <input className={inputCls} value={t.optionLabel} onChange={(e) => setT("optionLabel", e.target.value)} maxLength={30} lang={lang} />
                        </Field>
                      )}
                    </div>
                  </div>
                </details>
              );
            })}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-[1.2rem] font-medium">Görünüş</legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Etiketlər">
              {TAGS.map((t) => {
                const on = f.tags.includes(t.value);
                return (
                  <button key={t.value} type="button" aria-pressed={on} onClick={() => set("tags", on ? f.tags.filter((x) => x !== t.value) : [...f.tags, t.value])} className={`min-h-10 rounded-full border px-4 text-sm ${on ? "border-garnet bg-garnet text-ivory" : "border-sand hover:border-garnet"}`}>
                    {t.label}
                  </button>
                );
              })}
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} className="h-[1.1rem] w-[1.1rem] accent-[#7b1d3a]" />
              <span className="text-sm">Saytda göstər (söndürsəniz məhsul gizlənir, silinmir)</span>
            </label>
          </fieldset>
        </div>

        <footer className="space-y-3 border-t border-line bg-ivory px-5 py-4">
          {error && <Notice tone="error">{error}</Notice>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {product ? (
              <button type="button" onClick={remove} disabled={busy} className="min-h-11 rounded-lg px-3 text-sm text-garnet-bright hover:bg-blush/50">Məhsulu sil</button>
            ) : <span />}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn btn-ghost">Ləğv et</button>
              <button type="submit" disabled={busy || uploading || brands.length === 0} className="btn btn-primary">{busy ? "Saxlanılır…" : "Yadda saxla"}</button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  );
}
