import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** Horizontal snap-scroll on small screens, a clean 4-up grid on desktop. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  return (
    <ul
      aria-label={label}
      className="rail -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0"
    >
      {products.map((p) => (
        <li key={p.id} className="w-[46vw] max-w-[17rem] shrink-0 snap-start sm:w-[34vw] lg:w-auto lg:max-w-none">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
