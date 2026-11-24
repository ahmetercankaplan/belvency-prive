import type { Metadata } from "next";
import Link from "@/i18n/link";
import { ArchMark } from "@/components/ui/Logo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductArt } from "@/components/ui/ProductArt";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.about;
  return { title: d.crumb, description: d.description, alternates: alternatesFor(locale, "/haqqimizda") };
}

export default async function AboutPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.about;

  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: d.crumb }]} />

      <section className="mt-10 grid items-center gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="t-h1 max-w-[16ch]">{d.h1}</h1>
          <p className="t-lead mt-6 !max-w-[46ch]">{fmt(d.lead, { name: site.fullName })}</p>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{d.p2}</p>
        </div>
        <div className="lg:col-span-5">
          <div className="arch-ring mx-auto w-[min(100%,22rem)]">
            <div className="arch">
              <ProductArt kind="perfume" tone="blush" label={d.artLabel} flat className="aspect-[3/4.2] w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 md:mt-32" aria-labelledby="principles">
        <h2 id="principles" className="t-h2">
          {d.principlesTitle}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {d.principles.map((p) => (
            <li key={p.title} className="border-t border-gold/60 pt-6">
              <ArchMark className="h-8 w-8 text-garnet-bright" />
              <h3 className="t-h3 mt-4">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{fmt(p.text, { amount: formatAZN(site.freeDeliveryFrom) })}</p>
            </li>
          ))}
        </ul>
      </section>

      {!live && (
        <section className="mt-24 bg-linen px-6 py-10 md:mt-32 md:px-12 md:py-14" aria-labelledby="demo">
          <h2 id="demo" className="t-h3">
            {d.demoTitle}
          </h2>
          <p className="mt-3 max-w-[64ch] leading-relaxed text-muted">{d.demoText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/kataloq" className="btn btn-primary">
              {d.demoCta}
            </Link>
            <Link href="/lookbook" className="btn btn-ghost">
              {d.demoLookbook}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
