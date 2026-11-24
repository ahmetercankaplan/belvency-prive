import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Gift, RotateCcw, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ScentNotes } from "@/components/shop/ScentNotes";
import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import { site } from "@/data/site";
import { relatedProducts } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";
import { returns } from "@/data/legal";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.title, description: p.description };
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
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const brand = getBrand(product.brandSlug);
  const category = getCategory(product.category);
  const related = relatedProducts(product, 4);

  const genderCrumb =
    product.gender === "kisi"
      ? { label: "Kişi", href: "/kisi" }
      : product.gender === "qadin"
        ? { label: "Qadın", href: "/qadin" }
        : { label: "Kataloq", href: "/kataloq" };

  const lead = [
    ...(product.material ? [{ label: "Material", value: product.material }] : []),
    ...(product.color ? [{ label: "Rəng", value: product.color }] : []),
  ];
  // avoid repeating a label the product already lists in its own specs
  const noteOf = (label: string) => product.specs.find((s) => s.label === label)?.value;
  const scent =
    noteOf("Üst notlar") && noteOf("Ürək notları") && noteOf("Baza notları")
      ? { top: noteOf("Üst notlar")!, heart: noteOf("Ürək notları")!, base: noteOf("Baza notları")! }
      : null;
  const NOTE_LABELS = ["Üst notlar", "Ürək notları", "Baza notları"];
  const specs = [
    ...lead,
    ...product.specs.filter((s) => !lead.some((l) => l.label === s.label) && !(scent && NOTE_LABELS.includes(s.label))),
  ];

  return (
    <>
      <div className="container-x pt-6">
        <Breadcrumbs
          items={[
            genderCrumb,
            { label: category?.title ?? "Kateqoriya", href: `/kataloq/${product.category}` },
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
                {formatAZN(site.freeDeliveryFrom)} və yuxarı sifarişlərdə pulsuz çatdırılma
              </li>
              <li className="flex items-center gap-3">
                <Gift className="h-[1.1rem] w-[1.1rem] shrink-0 text-gold-deep" aria-hidden="true" />
                Hədiyyə qablaşdırması mövcuddur
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="h-[1.1rem] w-[1.1rem] shrink-0 text-gold-deep" aria-hidden="true" />
                14 gün ərzində dəyişdirmə imkanı
              </li>
            </ul>

            <div className="mt-9 border-t border-line">
              <Detail title="Təsvir" open>
                <p>{product.description}</p>
              </Detail>
              {scent && (
                <Detail title="Ətir notları" open>
                  <ScentNotes {...scent} />
                </Detail>
              )}
              <Detail title="Xüsusiyyətlər">
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  {specs.map((s) => (
                    <div key={s.label} className="contents">
                      <dt className="text-cocoa">{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Detail>
              <Detail title="Çatdırılma və qaytarma">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Bakı daxilində çatdırılma: {formatAZN(site.bakuDeliveryFee)}</li>
                  <li>Rayonlara çatdırılma: {formatAZN(site.regionDeliveryFee)}</li>
                  <li>İstifadə olunmamış məhsulu {returns.days} gün ərzində dəyişdirə bilərsiniz.</li>
                  <li>Açılmış ətir və gözəllik məhsulları gigiyena səbəbindən qaytarılmır.</li>
                </ul>
                {live ? (
                  <p className="mt-3 text-xs">
                    Ətraflı: <Link href="/catdirilma" className="underline underline-offset-4">çatdırılma</Link> və{" "}
                    <Link href="/qaytarma" className="underline underline-offset-4">qaytarma</Link> şərtləri.
                  </p>
                ) : (
                  <p className="mt-3 text-xs">Bu şərtlər nümayiş məqsədlidir və real mağaza şərtləri deyil.</p>
                )}
              </Detail>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x mt-24" aria-labelledby="related">
          <h2 id="related" className="t-h2">
            Bunlar da xoşunuza gələ bilər
          </h2>
          <ProductGrid products={related} className="mt-8" />
        </section>
      )}
    </>
  );
}
