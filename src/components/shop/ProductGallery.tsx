"use client";

import { useRef, useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { live } from "@/lib/flags";
import type { Product } from "@/lib/types";

const VIEWS = [
  { view: 0 as const, name: "Studiya görünüşü" },
  { view: 1 as const, name: "İsti fon" },
  { view: 2 as const, name: "Yaxın plan" },
  { view: 3 as const, name: "Işıq altında" },
];

export function ProductGallery({ product }: { product: Product }) {
  const photos = product.images ?? [];
  const real = photos.length > 0;
  const views = real ? photos.map((_, k) => ({ view: (k % 4) as 0 | 1 | 2 | 3, name: `Şəkil ${k + 1}` })) : VIEWS;
  const [i, setI] = useState(0);
  const frame = useRef<HTMLDivElement>(null);

  const track = (e: React.MouseEvent) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--zy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  const current = views[i];

  return (
    <div className="grid gap-3 md:grid-cols-[4.5rem_auto] md:justify-start md:gap-4">
      <div
        className="order-2 flex gap-2.5 overflow-x-auto md:order-1 md:flex-col md:overflow-visible rail"
        role="group"
        aria-label="Məhsul görüntüləri"
      >
        {views.map((v, idx) => (
          <button
            key={`${v.name}`}
            type="button"
            onClick={() => setI(idx)}
            aria-label={v.name}
            aria-current={idx === i}
            className={`w-[4.5rem] shrink-0 overflow-hidden border transition-all md:w-full ${
              idx === i ? "border-cocoa" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <ProductImage product={product} index={idx} view={v.view} className="aspect-[4/5] w-full" />
          </button>
        ))}
      </div>
      <div
        ref={frame}
        onMouseMove={track}
        className="group relative order-1 overflow-hidden bg-linen md:order-2 [@media(hover:hover)]:cursor-zoom-in md:aspect-[4/5] md:h-[clamp(26rem,calc(100dvh-14.5rem),44rem)] md:justify-self-start">
        <div
          className="h-full w-full transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[1.9]"
          style={{ transformOrigin: "var(--zx, 50%) var(--zy, 50%)" }}
        >
          <ProductImage
            key={`${current.name}-${i}`}
            product={product}
            index={i}
            view={current.view}
            eager
            label={`${product.title} — ${current.name}`}
            className="anim-fade aspect-[4/5] w-full md:aspect-auto md:h-full"
          />
        </div>
        {!live && !real && (
          <p className="t-small absolute bottom-3 left-4 rounded-full bg-ivory/85 px-3 py-1 text-muted backdrop-blur">
            Nümayiş təsviri
          </p>
        )}
      </div>
    </div>
  );
}
