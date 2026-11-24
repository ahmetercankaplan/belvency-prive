"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useEffect, useRef } from "react";
import { formatAZN } from "@/lib/format";
import { useT } from "@/i18n/provider";

interface Props {
  featured: { href: string; title: string; price: number };
}

/**
 * One tall arch, one round detail, one product tag.
 * The three layers drift at different depths with the pointer.
 */
export function HeroArches({ featured }: Props) {
  const t = useT().home.hero;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-[74%] max-w-[26rem] sm:w-[60%] lg:mx-auto lg:w-[min(27rem,calc((100dvh-11.5rem)*0.733))]"
    >
      {/* main arch */}
      <div className="parallax" style={{ "--depth": 12 } as React.CSSProperties}>
        <Link href="/kataloq/zerger" className="group block" aria-label={t.jewelryAria}>
          <span className="arch-ring block">
            <span className="arch anim-arch relative block aspect-[11/15]" style={{ animationDelay: "0.1s" }}>
              <Image
                src="/images/jewelry-model.jpg"
                alt={t.jewelryAlt}
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 70vw"
                className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                style={{ objectPosition: "56% 38%" }}
              />
            </span>
          </span>
        </Link>
      </div>

      {/* round detail */}
      <div
        className="parallax absolute -left-[17%] bottom-[9%] w-[38%]"
        style={{ "--depth": 26 } as React.CSSProperties}
      >
        <Link href="/kataloq/makiyaj" className="group block" aria-label={t.makeupAria}>
          <span
            className="anim-scale relative block aspect-square overflow-hidden rounded-full shadow-[0_0_0_6px_var(--color-garnet),0_0_0_7px_var(--color-gold),0_18px_40px_-12px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "0.7s" }}
          >
            <Image
              src="/images/lipstick-white.jpg"
              alt={t.makeupAlt}
              fill
              sizes="(min-width: 1024px) 10rem, 28vw"
              className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-110"
            />
          </span>
        </Link>
      </div>

      {/* product tag */}
      <div
        className="parallax anim-fade absolute -right-[7%] bottom-[5%] max-w-[15rem]"
        style={{ "--depth": 18, animationDelay: "1.1s" } as React.CSSProperties}
      >
        <Link
          href={featured.href}
          className="flex flex-col rounded-2xl bg-ivory px-4 py-3 text-garnet-deep shadow-[0_18px_40px_-14px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-translate-y-1"
        >
          <span className="font-display text-[1.15rem] font-medium leading-tight">{featured.title}</span>
          <span className="mt-0.5 text-sm font-medium text-garnet-bright">{formatAZN(featured.price)}</span>
        </Link>
      </div>
    </div>
  );
}
