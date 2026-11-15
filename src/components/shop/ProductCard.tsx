"use client";

import Link from "next/link";
import { getBrand } from "@/data/brands";
import { defaultOption, priceFor } from "@/lib/catalog";
import { discountPercent } from "@/lib/format";
import { shop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import type { Product } from "@/lib/types";
import { Price } from "@/components/ui/Price";
import { ProductArt } from "@/components/ui/ProductArt";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  void priority;
  const { notify } = useUI();
  const brand = getBrand(product.brandSlug);
  const opt = defaultOption(product);
  const pr = priceFor(product, opt);
  const off = discountPercent(pr.price, pr.salePrice);
  const quickAdd = !product.option && product.inStock;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        <ProductArt
          kind={product.kind}
          tone={product.tone}
          metal={product.metal}
          label=""
          className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
        <ProductArt
          kind={product.kind}
          tone={product.tone}
          metal={product.metal}
          view={1}
          label=""
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 ease-[var(--ease-soft)] group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
        />
        {off && (
          <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-2.5 py-1 text-[0.75rem] font-semibold text-garnet-bright">
            −{off}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-cocoa/85 px-3 py-1 text-[0.75rem] text-ivory">
            Stokda yoxdur
          </span>
        )}
        <WishlistButton productId={product.id} title={product.title} className="absolute right-2.5 top-2.5 z-10" />
        {quickAdd && (
          <button
            type="button"
            onClick={() => {
              shop.addToCart(product.id, undefined, 1);
              notify("Səbətə əlavə olundu");
            }}
            className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-2 rounded-full bg-ivory/95 py-2.5 text-sm font-medium opacity-0 backdrop-blur transition-all duration-300 hover:bg-cocoa hover:text-ivory focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:block"
          >
            Səbətə at
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <p className="t-small text-muted">{brand?.name}</p>
        <h3 className="font-display text-[1.2rem] font-medium leading-snug">
          <Link
            href={`/mehsul/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-gold-deep"
          >
            {product.title}
          </Link>
        </h3>
        <Price price={pr.price} salePrice={pr.salePrice} className="mt-0.5" />
        {product.option && product.option.values.length > 1 && (
          <p className="t-small text-muted">
            {product.option.values.length} {product.option.label.toLowerCase()} seçimi
          </p>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  className = "",
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 ${className}`}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
