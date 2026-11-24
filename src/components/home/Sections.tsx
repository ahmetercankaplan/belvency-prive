import Image from "next/image";
import Link from "@/i18n/link";
import { Gift, Phone, RotateCcw, Truck } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductRail } from "@/components/shop/ProductRail";
import { ProductArt } from "@/components/ui/ProductArt";
import { Price } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { returns, sellerHours } from "@/data/legal";
import { defaultOption, priceFor } from "@/lib/catalog";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";
import type { Product } from "@/lib/types";
import { fmt, type Locale } from "@/i18n/config";
import { dayCount } from "@/i18n/format";
import { getDict } from "@/i18n/dict";
import { getCatalog } from "@/i18n/server";

const byAdded = (a: Product, b: Product) => b.added - a.added;

/** Demo: hand-picked slugs. Real shop: the same slot is filled from the real catalog (newest first). */
function picker(locale: Locale) {
  const c = getCatalog(locale);
  const pick = (slugs: string[], fallback: (p: Product) => boolean, n = slugs.length) =>
    live ? c.products.filter(fallback).sort(byAdded).slice(0, n) : slugs.map(c.getProduct).filter((p): p is Product => !!p);
  const inGroup = (group: string) => (p: Product) => c.getCategory(p.category)?.group === group;
  return { c, pick, inGroup };
}

/* ───────────── Categories: staggered arch tiles ───────────── */
export function CategoryArches({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.categories;
  const { c } = picker(locale);
  const slugs = ["etirler", "makiyaj", "qulluq", "bilezikler", "uzukler", "cantalar", "saatlar", "ayaqqabilar"];
  const have = new Set(c.products.map((p) => p.category));
  const list = live ? c.categories.filter((x) => have.has(x.slug)).slice(0, 8) : slugs.map((s) => c.getCategory(s)!);
  if (list.length === 0) return null;
  return (
    <section className="container-x" aria-labelledby="cats">
      <div className="flex items-end justify-between gap-6">
        <h2 id="cats" className="t-h2">
          {d.title}
        </h2>
        <Link href="/kataloq" className="link-u text-sm font-medium">
          {d.all}
        </Link>
      </div>
      <ul className="rail -mx-4 mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-5 lg:overflow-visible lg:px-0">
        {list.map((x, i) => (
          <li key={x.slug} className="w-32 shrink-0 sm:w-40 lg:w-auto">
            <Link href={`/kataloq/${x.slug}`} className={`group block text-center ${i % 2 ? "lg:mt-10" : ""}`}>
              <span className="arch block">
                <ProductArt
                  kind={x.kind}
                  tone={x.tone}
                  label=""
                  flat
                  className="aspect-[3/4] w-full transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-105"
                />
              </span>
              <span className="mt-3 block font-display text-[1.15rem] font-medium">{x.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── New arrivals ───────────── */
export function NewArrivals({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.newArrivals;
  const { c } = picker(locale);
  const list = c.products.filter((p) => p.tags.includes("yeni")).sort(byAdded).slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section className="container-x" aria-labelledby="new">
      <div className="flex items-end justify-between gap-6">
        <h2 id="new" className="t-h2">
          {d.title}
        </h2>
        <Link href="/kataloq/yeni-gelenler" className="link-u text-sm font-medium">
          {d.viewAll}
        </Link>
      </div>
      <div className="mt-9">
        <ProductRail products={list} label={d.rail} />
      </div>
    </section>
  );
}

/* ───────────── Perfume editorial ───────────── */
export function PerfumeEditorial({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.perfume;
  const { pick } = picker(locale);
  const list = pick(["nergiz-gecesi-etir-suyu", "enber-gun-batimi-etir-suyu", "lale-seheri-etir-suyu"], (p) => p.category === "etirler", 3);
  if (list.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-blush" aria-labelledby="perfume">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-0.2em] left-[var(--gutter)] hidden select-none font-display text-[clamp(10rem,21vw,19rem)] font-light leading-none tracking-tight text-rose/55 lg:block"
      >
        {d.big}
      </span>
      <div className="container-x relative grid items-center gap-14 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="perfume" className="t-h1">
            {d.title}
          </h2>
          <p className="t-lead mt-5">{d.lead}</p>
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
            {d.cta}
          </Link>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="relative mx-auto flex max-w-[34rem] items-end justify-center gap-4 lg:max-w-none lg:justify-end">
            <div className="arch relative w-[44%] translate-y-8">
              <ProductArt kind="perfume" tone="champagne" label="" flat className="aspect-[3/4.6] w-full" />
            </div>
            <div className="arch relative w-[56%]">
              <ProductArt kind="perfume" tone="rose" label="" flat className="aspect-[3/5] w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Jewelry editorial (dark band) ───────────── */
export function JewelryEditorial({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.jewelry;
  const { pick, inGroup } = picker(locale);
  const list = pick(["ay-isigi-qolbaq", "damla-mirvari-boyunbagi", "solitaire-uzuk"], inGroup("zerger"), 3);
  if (list.length === 0) return null;
  return (
    <section className="on-dark bg-garnet-deep text-ivory" aria-labelledby="jewel">
      <div className="container-x py-14 md:py-24">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pb-6">
            <h2 id="jewel" className="t-h1 text-champagne">
              {d.title}
            </h2>
            <p className="mt-5 max-w-[38ch] text-[1.05rem] leading-relaxed text-ivory/80">{d.lead}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/kataloq/zerger" className="btn btn-light">
                {d.cta}
              </Link>
              {!live && (
                <Link href="/lookbook" className="link-u text-sm text-champagne">
                  {d.complete}
                </Link>
              )}
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <div className="flex items-end justify-center gap-3 sm:gap-5 lg:justify-end">
              <div className="arch-ring w-[27%]">
                <div className="arch">
                  <ProductArt kind="earrings" tone="blush" label="" flat className="aspect-[3/4.2] w-full" />
                </div>
              </div>
              <div className="arch-ring w-[44%]">
                <div className="arch relative aspect-[3/4.7]">
                  <Image
                    src="/images/pearls-lipstick.jpg"
                    alt={d.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 44vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 45%" }}
                  />
                </div>
              </div>
              <div className="arch-ring w-[27%]">
                <div className="arch">
                  <ProductArt kind="bracelet" tone="ivory" label="" flat className="aspect-[3/3.8] w-full" />
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
export function BeautyEditorial({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.beauty;
  const { c, pick, inGroup } = picker(locale);
  const cats = c.categoriesOfGroup("gozellik");
  const list = pick(["mexmer-dodaq-boyasi", "isiltili-kolge-paleti", "hialuron-nem-serumu", "uc-addim-qulluq-seti"], inGroup("gozellik"), 4);
  if (list.length === 0) return null;
  return (
    <section className="container-x" aria-labelledby="beauty">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <h2 id="beauty" className="t-h1">
            {d.title}
          </h2>
          <p className="t-lead mt-5">{d.lead}</p>
          <ul className="mt-9 border-t border-line">
            {cats.map((x) => {
              const n = c.products.filter((p) => p.category === x.slug).length;
              return (
                <li key={x.slug} className="border-b border-line">
                  <Link
                    href={`/kataloq/${x.slug}`}
                    className="group flex min-h-16 items-baseline justify-between py-3 font-display text-[1.9rem] font-light transition-[padding,color] duration-500 hover:pl-3 hover:text-gold-deep"
                  >
                    {x.title}
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
export function Handbags({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.bags;
  const { pick } = picker(locale);
  const list = pick(["arxa-ciyin-cantasi", "mektub-cantasi", "mini-carpaz-canta"], (p) => p.category === "cantalar", 3);
  if (list.length === 0) return null;
  return (
    <section className="container-x" aria-labelledby="bags">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="bags" className="t-h2">
            {d.title}
          </h2>
          <p className="mt-3 max-w-[44ch] text-muted">{d.lead}</p>
        </div>
        <Link href="/kataloq/cantalar" className="link-u text-sm font-medium">
          {d.all}
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
export function MenSection({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.men;
  const { pick } = picker(locale);
  const list = pick(["xronoqraf-kisi-saati", "deri-pul-kisesi", "qara-enber-etir-suyu", "ipek-qalstuk"], (p) => p.gender === "kisi", 4);
  if (list.length === 0) return null;
  return (
    <section className="bg-linen" aria-labelledby="men">
      <div className="container-x grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <h2 id="men" className="t-h1">
            {d.title}
          </h2>
          <p className="t-lead mt-5">{d.lead}</p>
          <Link href="/kisi" className="btn btn-primary mt-9">
            {d.cta}
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
export function BrandsStrip({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.brands;
  const { c } = picker(locale);
  if (c.brands.length === 0) return null;
  return (
    <section className="container-x" aria-labelledby="brands">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="brands" className="t-h2">
          {d.title}
        </h2>
        {!live && <p className="t-small text-muted">{d.demo}</p>}
      </div>
      <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-8 md:gap-x-14">
        {c.brands.map((b) => (
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
export function GiftGuide({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.gifts;
  const tiles = [
    { href: "/kataloq/hediyye-secimleri?max=100", tone: "blush" as const, kind: "lipstick" as const },
    { href: "/kataloq/hediyye-secimleri?max=250", tone: "champagne" as const, kind: "wallet" as const },
    { href: "/kataloq/hediyye-secimleri", tone: "rose" as const, kind: "giftbox" as const },
  ];
  return (
    <section className="container-x" aria-labelledby="gifts">
      <div className="max-w-xl">
        <h2 id="gifts" className="t-h2">
          {d.title}
        </h2>
        <p className="mt-3 text-muted">{d.text}</p>
        <Link href="/hediyye-sihirbazi" className="link-u mt-4 inline-block text-sm font-medium text-garnet-bright">
          {d.wizard}
        </Link>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
        {tiles.map((t, i) => (
          <li key={t.href}>
            <Link href={t.href} className="group flex items-center gap-5 bg-linen p-5 transition-colors hover:bg-blush md:flex-col md:items-start md:gap-6 md:p-6">
              <span className="arch block w-24 shrink-0 md:w-32">
                <ProductArt kind={t.kind} tone={t.tone} label="" flat className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-105" />
              </span>
              <span>
                <span className="block font-display text-[1.8rem] font-medium leading-tight">{d.tiles[i].title}</span>
                <span className="mt-1 block text-[0.95rem] text-muted">{d.tiles[i].text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────── Service strip ───────────── */
export function ServiceStrip({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.services;
  const items = [
    { icon: Truck, title: d.freeTitle, text: fmt(d.freeText, { amount: formatAZN(site.freeDeliveryFrom) }) },
    { icon: Gift, title: d.wrapTitle, text: d.wrapText },
    { icon: RotateCcw, title: d.easyTitle, text: fmt(d.easyText, { days: dayCount(locale, returns.days) }) },
    { icon: Phone, title: d.supportTitle, text: sellerHours(locale) },
  ];
  return (
    <section className="container-x" aria-label={d.label}>
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
export function ScentTeaser({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.scent;
  const pos = ["left-[-6%] top-[14%]", "right-[-8%] top-[42%]", "left-[-2%] bottom-[16%]"];
  return (
    <section className="container-x" aria-labelledby="finder">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-garnet px-6 py-12 text-ivory md:px-14 md:py-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="on-dark">
          <h2 id="finder" className="t-h1">
            {d.title}
          </h2>
          <p className="mt-5 max-w-[44ch] text-[1.05rem] leading-relaxed text-ivory/80">{d.lead}</p>
          <Link href="/etir-tapici" className="btn btn-gold mt-8">
            {d.cta}
          </Link>
        </div>
        <div className="relative mx-auto w-[min(15rem,60%)] lg:w-[16rem]">
          <div className="arch-ring">
            <div className="arch">
              <ProductArt kind="perfume" tone="champagne" label="" flat className="aspect-[3/4] w-full" />
            </div>
          </div>
          {d.chips.map((text, i) => (
            <span
              key={text}
              className={`absolute ${pos[i]} rounded-full bg-ivory px-3.5 py-1.5 text-[0.85rem] font-medium text-garnet-deep shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)]`}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
