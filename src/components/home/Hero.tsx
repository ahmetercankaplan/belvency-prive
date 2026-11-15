import Link from "next/link";
import { getProduct } from "@/data/products";
import { defaultOption, priceFor } from "@/lib/catalog";
import { HeroArches } from "./HeroArches";

const lines = ["Zövqlə", "seçilmiş", "lüks"];

export function Hero() {
  const p = getProduct("ay-isigi-qolbaq");
  const featured = p
    ? { href: `/mehsul/${p.slug}`, title: p.title, price: priceFor(p, defaultOption(p)).current }
    : { href: "/kataloq", title: "Yeni kolleksiya", price: 0 };

  return (
    <section className="on-dark relative overflow-hidden bg-garnet text-ivory">
      {/* warm spotlight behind the arch */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_70%_at_72%_52%,rgb(179_38_79/0.5),transparent_70%)]"
      />
      {/* nested arch outlines — the house's windows */}
      <svg
        viewBox="0 0 600 700"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMaxYMax meet"
        className="pointer-events-none absolute bottom-0 right-[2%] hidden h-[115%] w-auto text-gold/45 md:block"
      >
        <path d="M60 700V300a240 240 0 0 1 480 0v400" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M120 700V300a180 180 0 0 1 360 0v400" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M180 700V300a120 120 0 0 1 240 0v400" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-x relative grid items-center gap-14 pb-16 pt-10 md:pb-20 md:pt-12 lg:grid-cols-12 lg:gap-8 lg:py-14">
        <div className="lg:col-span-5">
          <h1 className="t-hero">
            {lines.map((l, i) => (
              <span key={l} className="line">
                <span style={{ "--d": `${0.15 + i * 0.14}s` } as React.CSSProperties}>{l}</span>
              </span>
            ))}
          </h1>
          <p className="t-lead anim-fade mt-7 !text-ivory/80" style={{ animationDelay: "0.75s" }}>
            Ətir, zərgərlik, çanta və aksesuarlar — Bakıdan başlayaraq Azərbaycanın hər yerinə çatdırılma ilə.
          </p>
          <div className="anim-fade mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.9s" }}>
            <Link href="/kataloq/yeni-gelenler" className="btn btn-gold">
              Kolleksiyaya bax
            </Link>
            <Link href="/kataloq/hediyye-secimleri" className="btn btn-ghost-light">
              Hədiyyə seçimləri
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <HeroArches featured={featured} />
        </div>
      </div>
    </section>
  );
}
