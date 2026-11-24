import { categories } from "../src/data/categories.ts";
import { hasStock } from "../src/lib/pricing.ts";
import type { Brand, BrandI18n, Gender, Product, ProductI18n, ProductOption, Tag, Tone, TranslatedLocale } from "../src/lib/types.ts";
import { fail, num, oneOf, randomId, slugify, str } from "./http.ts";
import type { Store } from "./store.ts";

export interface StoredProduct extends Product {
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const GENDERS = ["qadin", "kisi", "uniseks"] as const satisfies readonly Gender[];
const TAGS = ["yeni", "cox-satilanlar", "ekskluziv", "hediyye", "xususi"] as const satisfies readonly Tag[];
const TONES = ["blush", "champagne", "ivory", "taupe", "cocoa", "rose"] as const satisfies readonly Tone[];
const METALS = ["gold", "silver"] as const;
const IMAGE_URL = /^(\/api\/image\/[a-f0-9]{12}|https:\/\/[^\s"'<>]{4,300})$/;

export const productKey = (id: string) => `product/${id}`;
export const brandKey = (slug: string) => `brand/${slug}`;

export async function listProducts(store: Store): Promise<StoredProduct[]> {
  const keys = await store.keys("product/");
  const all = await Promise.all(keys.map((k) => store.get<StoredProduct>(k)));
  return all.filter((p): p is StoredProduct => !!p).sort((a, b) => a.rank - b.rank || b.added - a.added);
}

export async function listBrands(store: Store): Promise<Brand[]> {
  const keys = await store.keys("brand/");
  const all = await Promise.all(keys.map((k) => store.get<Brand>(k)));
  return all.filter((b): b is Brand => !!b).sort((a, b) => a.name.localeCompare(b.name, "az"));
}

const TRANSLATED = ["en", "ru"] as const satisfies readonly TranslatedLocale[];

/** Optional English / Russian wording. Only filled-in fields are kept; the page falls back to Azerbaijani for the rest. */
function parseTranslations<T extends Record<string, number>>(raw: unknown, fields: T): Partial<Record<TranslatedLocale, Partial<Record<keyof T, string>>>> | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "object") fail(400, "Tərcümə məlumatı yanlışdır");
  const out: Partial<Record<TranslatedLocale, Partial<Record<keyof T, string>>>> = {};
  for (const lang of TRANSLATED) {
    const src = ((raw as Record<string, unknown>)[lang] ?? {}) as Record<string, unknown>;
    const entry: Partial<Record<keyof T, string>> = {};
    for (const [key, max] of Object.entries(fields)) {
      const v = str(src[key], `${lang.toUpperCase()}: ${key}`, { max, optional: true });
      if (v) entry[key as keyof T] = v;
    }
    if (Object.keys(entry).length) out[lang] = entry;
  }
  return Object.keys(out).length ? out : undefined;
}

const PRODUCT_I18N_FIELDS = { title: 120, description: 1500, optionLabel: 30, material: 120, color: 60, subtype: 40 } satisfies Record<keyof ProductI18n, number>;
const BRAND_I18N_FIELDS = { specialty: 60, blurb: 300 } satisfies Record<keyof BrandI18n, number>;

function parseOption(raw: unknown): ProductOption | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "object") fail(400, "Seçim (variant) məlumatı yanlışdır");
  const o = raw as { label?: unknown; values?: unknown };
  const label = str(o.label, "Seçim adı", { min: 1, max: 30 });
  if (!Array.isArray(o.values) || o.values.length < 1 || o.values.length > 16) fail(400, "Seçim üçün 1–16 dəyər lazımdır");
  const seen = new Set<string>();
  const values = o.values.map((v) => {
    const r = (v ?? {}) as Record<string, unknown>;
    const name = str(r.name, "Seçim dəyəri", { min: 1, max: 40 });
    if (seen.has(name)) fail(400, `“${name}” dəyəri təkrarlanır`);
    seen.add(name);
    const price = r.price === undefined || r.price === null || r.price === "" ? undefined : num(r.price, "Variant qiyməti", { min: 0.01, max: 100000 });
    const salePrice = r.salePrice === undefined || r.salePrice === null || r.salePrice === "" ? undefined : num(r.salePrice, "Variant endirimli qiyməti", { min: 0.01, max: 100000 });
    if (price !== undefined && salePrice !== undefined && salePrice >= price) fail(400, `“${name}”: endirimli qiymət əsas qiymətdən aşağı olmalıdır`);
    const stock = num(r.stock, `“${name}” stoku`, { min: 0, max: 100000, int: true });
    return { name, ...(price !== undefined ? { price } : {}), ...(salePrice !== undefined ? { salePrice } : {}), stock };
  });
  return { label, values };
}

/** Validates admin input and returns the editable part of a product. */
export function parseProductInput(raw: Record<string, unknown>, brandSlugs: Set<string>) {
  const title = str(raw.title, "Ad", { min: 2, max: 120 });
  const category = str(raw.category, "Kateqoriya", { min: 1 });
  const cat = categories.find((c) => c.slug === category);
  if (!cat) fail(400, "Kateqoriya yanlışdır");
  const brandSlug = str(raw.brandSlug, "Brend", { min: 1 });
  if (!brandSlugs.has(brandSlug)) fail(400, "Brend tapılmadı — əvvəlcə brendi əlavə edin");
  const gender = oneOf(raw.gender, "Kimin üçün", GENDERS);
  const price = num(raw.price, "Qiymət", { min: 0.01, max: 100000 });
  let salePrice: number | undefined;
  if (raw.salePrice !== undefined && raw.salePrice !== null && raw.salePrice !== "") {
    salePrice = num(raw.salePrice, "Endirimli qiymət", { min: 0.01, max: 100000 });
    if (salePrice >= price) fail(400, "Endirimli qiymət əsas qiymətdən aşağı olmalıdır");
  }

  const option = parseOption(raw.option);
  let stock: number | undefined;
  if (!option) stock = num(raw.stock, "Stok", { min: 0, max: 100000, int: true });

  const tags = Array.isArray(raw.tags) ? raw.tags.map((t) => oneOf(t, "Etiket", TAGS)) : [];
  const specs = Array.isArray(raw.specs)
    ? raw.specs.slice(0, 14).map((s) => {
        const r = (s ?? {}) as Record<string, unknown>;
        return { label: str(r.label, "Xüsusiyyət adı", { min: 1, max: 40 }), value: str(r.value, "Xüsusiyyət dəyəri", { min: 1, max: 160 }) };
      })
    : [];
  const images = Array.isArray(raw.images) ? raw.images.slice(0, 8).map((u) => str(u, "Şəkil", { min: 1, max: 320 })) : [];
  for (const u of images) if (!IMAGE_URL.test(u)) fail(400, "Şəkil ünvanı yanlışdır");

  const tone = raw.tone ? oneOf(raw.tone, "Rəng tonu", TONES) : cat.tone;
  const metal = raw.metal ? oneOf(raw.metal, "Metal", METALS) : undefined;
  const subtype = str(raw.subtype, "Alt növ", { max: 40, optional: true });
  const material = str(raw.material, "Material", { max: 120, optional: true });
  const color = str(raw.color, "Rəng", { max: 60, optional: true });
  const i18n = parseTranslations(raw.i18n, PRODUCT_I18N_FIELDS);

  const base: Omit<StoredProduct, "id" | "createdAt" | "updatedAt" | "rank" | "added" | "inStock"> = {
    slug: "", // set by caller (needs uniqueness check)
    brandSlug,
    title,
    category,
    ...(subtype ? { subtype } : {}),
    gender,
    price,
    ...(salePrice !== undefined ? { salePrice } : {}),
    kind: cat.kind,
    tone,
    ...(metal ? { metal } : {}),
    tags: [...new Set(tags)],
    ...(option ? { option } : {}),
    ...(stock !== undefined ? { stock } : {}),
    ...(material ? { material } : {}),
    ...(color ? { color } : {}),
    images,
    description: str(raw.description, "Təsvir", { max: 1500, optional: true }),
    specs,
    ...(i18n ? { i18n } : {}),
    active: raw.active === undefined ? true : raw.active === true,
  };
  const slugInput = str(raw.slug, "Slug", { max: 80, optional: true });
  return { base, slug: slugify(slugInput || title) };
}

export async function saveProduct(store: Store, raw: Record<string, unknown>, id?: string): Promise<StoredProduct> {
  const brandSlugs = new Set((await listBrands(store)).map((b) => b.slug));
  const { base, slug } = parseProductInput(raw, brandSlugs);
  if (!slug) fail(400, "Slug yaradıla bilmədi");

  const all = await listProducts(store);
  if (all.some((p) => p.slug === slug && p.id !== id)) fail(409, "Bu slug başqa məhsulda istifadə olunur");

  const now = new Date().toISOString();
  const existing = id ? all.find((p) => p.id === id) : undefined;
  if (id && !existing) fail(404, "Məhsul tapılmadı");

  const draft: StoredProduct = {
    ...base,
    slug,
    id: existing?.id ?? randomId("p_"),
    rank: existing?.rank ?? (all.length ? Math.min(...all.map((p) => p.rank)) - 1 : 0),
    added: existing?.added ?? Math.floor(Date.now() / 1000),
    inStock: false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  draft.inStock = hasStock(draft);
  await store.set(productKey(draft.id), draft);
  return draft;
}

export async function deleteProduct(store: Store, id: string) {
  if (!(await store.get(productKey(id)))) fail(404, "Məhsul tapılmadı");
  await store.del(productKey(id));
}

export function parseBrandInput(raw: Record<string, unknown>, existingSlug?: string): Brand {
  const name = str(raw.name, "Brend adı", { min: 2, max: 60 });
  const slug = existingSlug ?? slugify(str(raw.slug, "Slug", { max: 60, optional: true }) || name);
  if (!slug) fail(400, "Slug yaradıla bilmədi");
  const i18n = parseTranslations(raw.i18n, BRAND_I18N_FIELDS);
  return {
    slug,
    name,
    specialty: str(raw.specialty, "İxtisas", { max: 60, optional: true }),
    blurb: str(raw.blurb, "Təsvir", { max: 300, optional: true }),
    tone: raw.tone ? oneOf(raw.tone, "Rəng tonu", TONES) : "blush",
    kind: "perfume",
    ...(i18n ? { i18n } : {}),
  };
}

export async function saveBrand(store: Store, raw: Record<string, unknown>, existingSlug?: string): Promise<Brand> {
  const brand = parseBrandInput(raw, existingSlug);
  const current = await store.get<Brand>(brandKey(brand.slug));
  if (!existingSlug && current) fail(409, "Bu brend artıq mövcuddur");
  if (existingSlug && !current) fail(404, "Brend tapılmadı");
  // keep the illustration kind that was derived from the brand's first product category (editable later)
  await store.set(brandKey(brand.slug), { ...brand, kind: current?.kind ?? brand.kind });
  return brand;
}

export async function deleteBrand(store: Store, slug: string) {
  const used = (await listProducts(store)).some((p) => p.brandSlug === slug);
  if (used) fail(409, "Bu brendə aid məhsullar var — əvvəlcə onları silin və ya başqa brendə keçirin");
  await store.del(brandKey(slug));
}
