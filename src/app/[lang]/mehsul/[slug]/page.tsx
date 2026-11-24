import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { ChevronDown, Gift, RotateCcw, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ScentNotes } from "@/components/shop/ScentNotes";
import { products as baseProducts } from "@/data/products";
import { site } from "@/data/site";
import { relatedProducts } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";
import { returns } from "@/data/legal";
import { fmt, locales } from "@/i18n/config";
import { dayCount } from "@/i18n/format";
import { getDict } from "@/i18n/dict";
import { alternatesFor, getCatalog, resolveLocale } from "@/i18n/server";

type Params = { lang: string; slug: string };

export function generateStaticParams() {
  return locales.flatMap((lang) => baseProducts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const p = getCatalog(locale).getProduct(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: alternatesFor(locale, `/mehsul/${slug}`),
    ...(p.images?.[0] ? { openGraph: { images: [p.images[0]] } } : {}),
  };
}

function Detail({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-1">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-xl font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5 text-[0.95rem] leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const c = getCatalog(locale);
  const d = getDict(locale).pages.product;
  const product = c.getProduct(slug);
  if (!product) notFound();

  const brand = c.getBrand(product.brandSlug);
  const category = c.getCategory(product.category);
  const related = relatedProducts(product, 4).map((p) => c.getProductById(p.id) ?? p);
  const genderCrumb =
    product.gender === "kisi"
      ? { label: c.genderLabels.kisi, href: "/kisi" }
      : product.gender === "qadin"
        ? { label: c.genderLabels.qadin, href: "/qadin" }
        : { label: getDict(locale).pages.catalog.crumb, href: "/kataloq" };

  const lead = [
    ...(product.material ? [{ label: d.material, value: product.material }] : []),
    ...(product.color ? [{ label: d.color, value: product.color }] : []),
  ];

  // avoid repeating a label the product already lists in its own specs
  const noteOf = (label: string) => product.specs.find((s) => s.label === label)?.value;
  const scent =
    noteOf("Üst notlar") && noteOf("Ürək notları") && noteOf("Baza notları")
      ? { top: noteOf("Üst notlar")!, heart: noteOf("Ürək notları")!, base: noteOf("Baza notları")! }
      : null;
  const NOTE_LABELS = ["Üst notlar", "Ürək notları", "Baza notları"];
  const leadLabels = ["Material", "Rəng", d.material, d.color];
  const specs = [
    ...lead,
    ...product.specs.filter((s) => !leadLabels.includes(s.label) && !(scent && NOTE_LABELS.includes(s.label))),
  ];

  return (
    <>
      <div className="container-x pt-6">
        <Breadcrumbs
          items={[
            genderCrumb,
            { label: category?.title ?? d.category, href: `/kataloq/${product.category}` },
            { label: product.title },
          ]}
        />
      </div>

      <section className="container-x mt-6 grid gap-10 lg:grid-cols-[auto_minmax(0,30rem)] lg:justify-center lg:gap-14 xl:gap-20">
        <div>
          <ProductGallery product={product} />
        </div>

        <div>
          <div className="lg:sticky lg:top-28">
            <Link href={`/brendler/${product.brandSlug}`} className="link-u text-sm text-muted hover:text-cocoa">
              {brand?.name}
            </Link>
            <h1 className="t-h1 mt-3 !text-[clamp(1.9rem,2.5vw,2.4rem)]">{product.title}</h1>
            {product.subtype && <p className="mt-2 text-muted">{product.subtype}</p>}

            <div className="mt-6">
              <ProductPurchase product={product} />
            </div>

            <ul className="mt-9 space-y-3 text-[0.9rem] text-muted">
              <li className="flex items-center gap-3">
                <Truck className="h-[1.1rem] w-[1.1rem] shrink-0 text-gold-deep" aria-hidden="true" />
                {fmt(d.freeDelivery, { amount: formatAZN(site.freeDeliveryFrom) })}
              </li>
              <li className="flex items-center gap-3">
                <Gift className="h-[1.1rem] w-[1.1rem] shrink-0 text-gold-deep" aria-hidden="true" />
                {d.giftWrap}
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="h-[1.1rem] w-[1.1rem] shrink-0 text-gold-deep" aria-hidden="true" />
                {fmt(d.exchange, { days: dayCount(locale, returns.days) })}
              </li>
            </ul>

            <div className="mt-9 border-t border-line">
              <Detail title={d.description} open>
                <p>{product.description}</p>
              </Detail>
              {scent && (
                <Detail title={d.scentNotes} open>
                  <ScentNotes {...scent} />
                </Detail>
              )}
              <Detail title={d.specs}>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  {specs.map((s) => (
                    <div key={s.label} className="contents">
                      <dt className="text-cocoa">{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Detail>
              <Detail title={d.deliveryReturns}>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>{fmt(d.bakuDelivery, { amount: formatAZN(site.bakuDeliveryFee) })}</li>
                  <li>{fmt(d.regionDelivery, { amount: formatAZN(site.regionDeliveryFee) })}</li>
                  <li>{fmt(d.exchangeLine, { days: dayCount(locale, returns.days) })}</li>
                  <li>{d.hygiene}</li>
                </ul>
                {live ? (
                  <p className="mt-3 text-xs">
                    {d.moreBefore}
                    <Link href="/catdirilma" className="underline underline-offset-4">
                      {d.deliveryLink}
                    </Link>
                    {d.and}
                    <Link href="/qaytarma" className="underline underline-offset-4">
                      {d.returnsLink}
                    </Link>
                    {d.moreAfter}
                  </p>
                ) : (
                  <p className="mt-3 text-xs">{d.demoTerms}</p>
                )}
              </Detail>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x mt-24" aria-labelledby="related">
          <h2 id="related" className="t-h2">
            {d.related}
          </h2>
          <ProductGrid products={related} className="mt-8" />
        </section>
      )}
    </>
  );
}
