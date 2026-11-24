import { ProductArt } from "@/components/ui/ProductArt";
import type { Product } from "@/lib/types";

/**
 * A product's real photo when one was uploaded in the admin panel, otherwise the house illustration.
 * `index` picks which photo (0 = cover); `view` only matters for the illustration fallback.
 */
export function ProductImage({
  product,
  index = 0,
  view,
  className = "",
  label = "",
  eager = false,
}: {
  product: Pick<Product, "kind" | "tone" | "metal" | "images" | "title">;
  index?: number;
  view?: 0 | 1 | 2 | 3;
  className?: string;
  label?: string;
  eager?: boolean;
}) {
  const src = product.images?.[index];
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, photos are served by the API
      <img
        src={src}
        alt={label || ""}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`${className} object-cover`}
      />
    );
  }
  return <ProductArt kind={product.kind} tone={product.tone} metal={product.metal} view={view} label={label} className={className} />;
}
