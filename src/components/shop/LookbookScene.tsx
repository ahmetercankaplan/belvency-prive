"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useEffect, useId, useState } from "react";
import { Plus, X } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { ProductArt } from "@/components/ui/ProductArt";
import { getBrand } from "@/data/brands";
import { getProduct } from "@/data/products";
import { defaultOption, priceFor } from "@/lib/catalog";
import { shop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";

export interface Spot {
  slug: string;
  /** position inside the photo, in percent */
  x: number;
  y: number;
}

interface Props {
  src: string;
  alt: string;
  /** natural photo size — keeps hotspot percentages exact */
  width: number;
  height: number;
  spots: Spot[];
  priority?: boolean;
}

export function LookbookScene({ src, alt, width, height, spots, priority }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const { notify } = useUI();
  const baseId = useId();

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="arch-ring">
      <div className="arch relative" style={{ aspectRatio: `${width} / ${height}` }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 52vw, 92vw"
          className="object-cover"
        />

        {spots.map((s, i) => {
          const p = getProduct(s.slug);
          if (!p) return null;
          const open = active === i;
          const leftSide = s.x > 55;
          const below = s.y < 45;
          return (
            <div key={s.slug} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${baseId}-${i}`}
                aria-label={`${p.title} — bu görünüşə yaxın seçim`}
                onClick={() => setActive(open ? null : i)}
                className="group absolute -left-[1.375rem] -top-[1.375rem] grid h-11 w-11 place-items-center rounded-full"
              >
                <span className="absolute h-7 w-7 animate-ping rounded-full bg-ivory/60 motion-reduce:hidden" aria-hidden="true" />
                <span
                  className={`relative grid h-7 w-7 place-items-center rounded-full border border-ivory bg-garnet text-ivory shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 ${open ? "rotate-45" : ""}`}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>

              {open && (
                <div
                  id={`${baseId}-${i}`}
                  role="group"
                  aria-label={p.title}
                  className={`anim-drop absolute z-20 w-[15.5rem] rounded-2xl bg-ivory p-3 text-cocoa shadow-[0_24px_50px_-18px_rgba(0,0,0,0.6)] ${
                    leftSide ? "right-5" : "left-5"
                  } ${below ? "top-5" : "bottom-5"}`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    aria-label="Bağla"
                    className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full hover:bg-linen"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="flex gap-3">
                    <span className="block w-16 shrink-0 overflow-hidden">
                      <ProductArt kind={p.kind} tone={p.tone} metal={p.metal} label="" className="aspect-[4/5] w-full" />
                    </span>
                    <div className="min-w-0 pr-5">
                      <p className="t-small text-muted">{getBrand(p.brandSlug)?.name}</p>
                      <p className="font-display text-[1.05rem] font-medium leading-tight">{p.title}</p>
                      <Price
                        price={priceFor(p, defaultOption(p)).price}
                        salePrice={priceFor(p, defaultOption(p)).salePrice}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[0.72rem] text-muted">Fotodakı parçaya yaxın kataloq seçimi</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/mehsul/${p.slug}`} className="btn btn-ghost min-h-10 flex-1 px-3 text-[0.82rem]">
                      Məhsula bax
                    </Link>
                    {!p.option && p.inStock && (
                      <button
                        type="button"
                        onClick={() => {
                          shop.addToCart(p.id, undefined, 1);
                          notify("Səbətə əlavə olundu");
                          setActive(null);
                        }}
                        className="btn btn-primary min-h-10 flex-1 px-3 text-[0.82rem]"
                      >
                        Səbətə at
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
