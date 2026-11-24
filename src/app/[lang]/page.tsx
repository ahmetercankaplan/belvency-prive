import type { Metadata } from "next";
import { BestSellers } from "@/components/home/BestSellers";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import {
  BeautyEditorial,
  BrandsStrip,
  CategoryArches,
  GiftGuide,
  Handbags,
  JewelryEditorial,
  MenSection,
  NewArrivals,
  PerfumeEditorial,
  ScentTeaser,
  ServiceStrip,
} from "@/components/home/Sections";
import { live } from "@/lib/flags";
import { getDict } from "@/i18n/dict";
import { alternatesFor, getCatalog, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).chrome;
  return { title: { absolute: `Belvency Privé — ${d.tagline}` }, alternates: alternatesFor(locale, "/") };
}

export default async function HomePage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const best = getCatalog(locale).products.filter((p) => p.tags.includes("cox-satilanlar"));
  const gap = "mt-20 md:mt-28";

  return (
    <div className="-mb-20 md:-mb-24">
      <Hero locale={locale} />
      <div className={gap}>
        <CategoryArches locale={locale} />
      </div>
      <div className={gap}>
        <NewArrivals locale={locale} />
      </div>
      <div className={gap}>
        <PerfumeEditorial locale={locale} />
      </div>
      {(!live || best.length > 0) && (
        <div className={gap}>
          <BestSellers products={best} />
        </div>
      )}
      <div className={gap}>
        <JewelryEditorial locale={locale} />
      </div>
      <div className={gap}>
        <BeautyEditorial locale={locale} />
      </div>
      <div className={gap}>
        <Handbags locale={locale} />
      </div>
      <div className={gap}>
        <MenSection locale={locale} />
      </div>
      {!live && (
        <div className={gap}>
          <ScentTeaser locale={locale} />
        </div>
      )}
      <div className={gap}>
        <BrandsStrip locale={locale} />
      </div>
      <div className={gap}>
        <GiftGuide locale={locale} />
      </div>
      <div className={gap}>
        <ServiceStrip locale={locale} />
      </div>
      {!live && (
        <div className={gap}>
          <Newsletter />
        </div>
      )}
    </div>
  );
}
