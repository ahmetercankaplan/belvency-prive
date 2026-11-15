import Image from "next/image";
import Link from "next/link";
import { Gift, Phone, RotateCcw, Truck } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductRail } from "@/components/shop/ProductRail";
import { ProductArt } from "@/components/ui/ProductArt";
import { Price } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { brands } from "@/data/brands";
import { categories, categoriesOfGroup } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import { site } from "@/data/site";
import { defaultOption, priceFor, productsByTag } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import type { Product } from "@/lib/types";

const byAdded = (a: Product, b: Product) => b.added - a.added;
const pick = (slugs: string[]) => slugs.map(getProduct).filter((p): p is Product => !!p);

/* ───────────── Categories: staggered arch tiles ───────────── */
export function CategoryArches() {
  const slugs = ["etirler", "makiyaj", "qulluq", "bilezikler", "uzukler", "cantalar", "saatlar", "ayaqqabilar"];
  const list = slugs.map((s) => categories.find((c) => c.slug === s)!);
  return (
    <section className="container-x" aria-labelledby="cats">
      <div className="flex items-end justify-between gap-6">
        <h2 id="cats" className="t-h2">
          Kateqoriyalar
        </h2>
        <Link href="/kataloq" className="link-u text-sm font-medium">
          Bütün kataloq
        </Link>
      </div>
      <ul className="rail -mx-4 mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-5 lg:overflow-visible lg:px-0">
        {list.map((c, i) => (
          <li key={c.slug} className="w-32 shrink-0 sm:w-40 lg:w-auto">
            <Link href={`/kataloq/${c.slug}`} className={`group block text-center ${i % 2 ? "lg:mt-10" : ""}`}>
              <span className="arch block">
                <ProductArt
                  kind={c.kind}
                  tone={c.tone}
                  label=""
                  flat
                  className="aspect-[3/4] w-full transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-105"
                />
              </span>
              <span className="mt-3 block font-display text-[1.15rem] font-medium">{c.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── New arrivals ───────────── */
export function NewArrivals() {
  const list = productsByTag("yeni").sort(byAdded).slice(0, 4);
  return (
    <section className="container-x" aria-labelledby="new">
      <div className="flex items-end justify-between gap-6">
        <h2 id="new" className="t-h2">
          Yeni gələnlər
        </h2>
        <Link href="/kataloq/yeni-gelenler" className="link-u text-sm font-medium">
          Hamısına bax
        </Link>
      </div>
      <div className="mt-9">
        <ProductRail products={list} label="Yeni gələn məhsullar" />
      </div>
    </section>
  );
}

/* ───────────── Perfume editorial ───────────── */
export function PerfumeEditorial() {
  const list = pick(["nergiz-gecesi-etir-suyu", "enber-gun-batimi-etir-suyu", "lale-seheri-etir-suyu"]);
  return (
    <section className="relative overflow-hidden bg-blush" aria-labelledby="perfume">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-0.2em] left-[var(--gutter)] hidden select-none font-display text-[clamp(10rem,21vw,19rem)] font-light leading-none tracking-tight text-rose/55 lg:block"
      >
        Ətir
      </span>
      <div className="container-x relative grid items-center gap-14 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="perfume" className="t-h1">
            Ətir kolleksiyası
          </h2>
          <p className="t-lead mt-5">
            Üç xarakter: çiçəkli, isti və təravətli. Hər ətrin notları məhsul səhifəsində yazılıb.
          </p>
          <ul className="mt-9 divide-y divide-rose/80 border-y border-rose/80">
            {list.map((p) => {
              const pr = priceFor(p, defaultOption(p));
              return (
                <li key={p.id}>
                  <Link
                    href={`/mehsul/${p.slug}`}
                    className="group flex min-h-16 items-center justify-between gap-4 py-3 transition-[padding] duration-500 hover:pl-3"
                  >
                    <span className="font-display text-[1.35rem] font-medium">{p.title.replace(" ətir suyu", "")}</span>
                    <Price price={pr.price} salePrice={pr.salePrice} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/kataloq/etirler" className="btn btn-primary mt-9">
            Bütün ətirlərə bax
          </Link>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="relative mx-auto flex max-w-[34rem] items-end justify-center gap-4 lg:max-w-none lg:justify-end">
            <div className="arch relative w-[44%] translate-y-8">
              <ProductArt kind="perfume" tone="champagne" label="Ənbər Gün Batımı ətir suyu" flat className="aspect-[3/4.6] w-full" />
            </div>
            <div className="arch relative w-[56%]">
              <ProductArt kind="perfume" tone="rose" label="Nərgiz Gecəsi ətir suyu" flat className="aspect-[3/5] w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Jewelry editorial (dark band) ───────────── */
export function JewelryEditorial() {
  const list = pick(["ay-isigi-qolbaq", "damla-mirvari-boyunbagi", "solitaire-uzuk"]);
  return (
    <section className="on-dark bg-garnet-deep text-ivory" aria-labelledby="jewel">
      <div className="container-x py-14 md:py-24">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pb-6">
            <h2 id="jewel" className="t-h1 text-champagne">
              Zərgərlik
            </h2>
            <p className="mt-5 max-w-[38ch] text-[1.05rem] leading-relaxed text-ivory/80">
              İncə xətlər, mirvari və qızıl suyu. Gündəlik taxmaq üçün sadə, xüsusi günlər üçün zərif.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/kataloq/zerger" className="btn btn-light">
                Zərgərliyə bax
              </Link>
              <Link href="/lookbook" className="link-u text-sm text-champagne">
                Görünüşü tamamla
              </Link>
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <div className="flex items-end justify-center gap-3 sm:gap-5 lg:justify-end">
              <div className="arch-ring w-[27%]">
                <div className="arch">
                  <ProductArt kind="earrings" tone="blush" label="Mirvari sırğa" flat className="aspect-[3/4.2] w-full" />
                </div>
              </div>
              <div className="arch-ring w-[44%]">
                <div className="arch relative aspect-[3/4.7]">
                  <Image
                    src="/images/pearls-lipstick.jpg"
                    alt="İnci boyunbağı, qızıl zəncir və dodaq boyası güzgü üzərində, toxunma ağ parçada"
                    fill
                    sizes="(min-width: 1024px) 22vw, 44vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 45%" }}
                  />
                </div>
              </div>
              <div className="arch-ring w-[27%]">
                <div className="arch">
                  <ProductArt kind="bracelet" tone="ivory" label="Qolbaq" flat className="aspect-[3/3.8] w-full" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-2 border-t border-ivory/20 pt-2 md:grid-cols-3">
          {list.map((p) => {
            const pr = priceFor(p, defaultOption(p));
            return (
              <li key={p.id}>
                <Link href={`/mehsul/${p.slug}`} className="group flex min-h-20 items-center justify-between gap-4 py-4">
                  <span className="font-display text-[1.3rem] leading-snug transition-colors group-hover:text-champagne">
                    {p.title}
                  </span>
                  <span className="shrink-0 text-[0.95rem] text-ivory/80">{formatAZN(pr.current)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Beauty: typographic index + products ───────────── */
export function BeautyEditorial() {
  const cats = categoriesOfGroup("gozellik");
  const list = pick(["mexmer-dodaq-boyasi", "isiltili-kolge-paleti", "hialuron-nem-serumu", "uc-addim-qulluq-seti"]);
  return (
    <section className="container-x" aria-labelledby="beauty">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <h2 id="beauty" className="t-h1">
            Gözəllik
          </h2>
          <p className="t-lead mt-5">Makiyajdan dəri qulluğuna qədər gündəlik rutinin hər addımı.</p>
          <ul className="mt-9 border-t border-line">
            {cats.map((c) => {
              const n = products.filter((p) => p.category === c.slug).length;
              return (
                <li key={c.slug} className="border-b border-line">
                  <Link
                    href={`/kataloq/${c.slug}`}
                    className="group flex min-h-16 items-baseline justify-between py-3 font-display text-[1.9rem] font-light transition-[padding,color] duration-500 hover:pl-3 hover:text-gold-deep"
                  >
                    {c.title}
                    <span className="font-sans text-sm text-muted">{n}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5">
            {list.map((p, i) => (
              <li key={p.id} className={i % 2 ? "sm:mt-12" : ""}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Handbags ───────────── */
export function Handbags() {
  const list = pick(["arxa-ciyin-cantasi", "mektub-cantasi", "mini-carpaz-canta"]);
  return (
    <section className="container-x" aria-labelledby="bags">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="bags" className="t-h2">
            Çantalar
          </h2>
          <p className="mt-3 max-w-[44ch] text-muted">Çiyin, çarpaz və əl çantaları — hamısı təmiz xətli və gündəlik istifadəyə uyğun.</p>
        </div>
        <Link href="/kataloq/cantalar" className="link-u text-sm font-medium">
          Bütün çantalar
        </Link>
      </div>
      <ul className="mt-10 grid grid-cols-2 items-end gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-[1.45fr_1fr_1fr]">
        {list.map((p, i) => (
          <li key={p.id} className={i === 0 ? "col-span-2 lg:col-span-1" : ""}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── Men ───────────── */
export function MenSection() {
  const list = pick(["xronoqraf-kisi-saati", "deri-pul-kisesi", "qara-enber-etir-suyu", "ipek-qalstuk"]);
  return (
    <section className="bg-linen" aria-labelledby="men">
      <div className="container-x grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <h2 id="men" className="t-h1">
            Kişilər üçün seçim
          </h2>
          <p className="t-lead mt-5">Saat, ətir və dəri aksesuarlar — sadə, yadda qalan və uzun ömürlü.</p>
          <Link href="/kisi" className="btn btn-primary mt-9">
            Kişi kolleksiyası
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:col-span-8 xl:grid-cols-4">
          {list.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Brands: wordmark list ───────────── */
export function BrandsStrip() {
  return (
    <section className="container-x" aria-labelledby="brands">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="brands" className="t-h2">
          Seçilmiş brendlər
        </h2>
        <p className="t-small text-muted">Nümayiş üçün uydurulmuş brendlər</p>
      </div>
      <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-8 md:gap-x-14">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/brendler/${b.slug}`}
              className="inline-block py-1 font-display text-[1.7rem] font-light tracking-wide text-muted transition-colors hover:text-cocoa md:text-[2.1rem]"
            >
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── Gift guide ───────────── */
export function GiftGuide() {
  const tiles = [
    { href: "/kataloq/hediyye-secimleri?max=100", title: "100 ₼-dək", text: "Kiçik, amma düşünülmüş hədiyyələr", tone: "blush" as const, kind: "lipstick" as const },
    { href: "/kataloq/hediyye-secimleri?max=250", title: "250 ₼-dək", text: "Ətir, zərgərlik və dəri aksesuarlar", tone: "champagne" as const, kind: "wallet" as const },
    { href: "/kataloq/hediyye-secimleri", title: "Xüsusi gün üçün", text: "Dəstlər və hədiyyə qutuları", tone: "rose" as const, kind: "giftbox" as const },
  ];
  return (
    <section className="container-x" aria-labelledby="gifts">
      <div className="max-w-xl">
        <h2 id="gifts" className="t-h2">
          Hədiyyə seçimləri
        </h2>
        <p className="mt-3 text-muted">Büdcəyə görə seçin. Hədiyyə qablaşdırması mövcuddur.</p>
        <Link href="/hediyye-sihirbazi" className="link-u mt-4 inline-block text-sm font-medium text-garnet-bright">
          Hədiyyə sihirbazını sına
        </Link>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
        {tiles.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="group flex items-center gap-5 bg-linen p-5 transition-colors hover:bg-blush md:flex-col md:items-start md:gap-6 md:p-6">
              <span className="arch block w-24 shrink-0 md:w-32">
                <ProductArt kind={t.kind} tone={t.tone} label="" flat className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-105" />
              </span>
              <span>
                <span className="block font-display text-[1.8rem] font-medium leading-tight">{t.title}</span>
                <span className="mt-1 block text-[0.95rem] text-muted">{t.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── Service strip ───────────── */
export function ServiceStrip() {
  const items = [
    { icon: Truck, title: "Pulsuz çatdırılma", text: `${formatAZN(site.freeDeliveryFrom)} və yuxarı sifarişlərdə` },
    { icon: Gift, title: "Hədiyyə qablaşdırması", text: "Sifarişə əlavə edilir" },
    { icon: RotateCcw, title: "Asan dəyişdirmə", text: "14 gün ərzində" },
    { icon: Phone, title: "Dəstək", text: site.hours },
  ];
  return (
    <section className="container-x" aria-label="Xidmətlər">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-10 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-4">
            <Icon className="mt-1 h-[1.35rem] w-[1.35rem] shrink-0 text-gold-deep" strokeWidth={1.4} aria-hidden="true" />
            <div>
              <p className="font-display text-[1.2rem] font-medium leading-snug">{title}</p>
              <p className="mt-1 text-[0.88rem] text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── Scent finder teaser ───────────── */
export function ScentTeaser() {
  const chips = [
    { text: "bergamot", pos: "left-[-6%] top-[14%]" },
    { text: "kəhrəba", pos: "right-[-8%] top-[42%]" },
    { text: "sandal", pos: "left-[-2%] bottom-[16%]" },
  ];
  return (
    <section className="container-x" aria-labelledby="finder">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-garnet px-6 py-12 text-ivory md:px-14 md:py-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="on-dark">
          <h2 id="finder" className="t-h1">
            Sizə uyğun ətri 4 sualda tapın
          </h2>
          <p className="mt-5 max-w-[44ch] text-[1.05rem] leading-relaxed text-ivory/80">
            Əhval-ruhiyyə, istifadə vaxtı və büdcəni seçin — hər tövsiyənin yanında niyə uyğun gəldiyini yazırıq.
          </p>
          <Link href="/etir-tapici" className="btn btn-gold mt-8">
            Ətir tapıcını başlat
          </Link>
        </div>
        <div className="relative mx-auto w-[min(15rem,60%)] lg:w-[16rem]">
          <div className="arch-ring">
            <div className="arch">
              <ProductArt kind="perfume" tone="champagne" label="Ətir şüşəsi" flat className="aspect-[3/4] w-full" />
            </div>
          </div>
          {chips.map((c) => (
            <span
              key={c.text}
              className={`absolute ${c.pos} rounded-full bg-ivory px-3.5 py-1.5 text-[0.85rem] font-medium text-garnet-deep shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)]`}
            >
              {c.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
