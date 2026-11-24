"use client";

import { formatAZN } from "@/lib/format";
import { useT } from "@/i18n/provider";

export function Price({
  price,
  salePrice,
  className = "",
  size = "md",
}: {
  price: number;
  salePrice?: number;
  className?: string;
  size?: "md" | "lg";
}) {
  const t = useT().chrome.price;
  const big = size === "lg" ? "text-2xl" : "text-[0.95rem]";
  if (salePrice && salePrice < price) {
    return (
      <p className={`flex flex-wrap items-baseline gap-x-2.5 ${className}`}>
        <span className="sr-only">{t.sale}</span>
        <span className={`${big} font-medium text-garnet-bright`}>{formatAZN(salePrice)}</span>
        <span className="sr-only">{t.was}</span>
        <span className="text-[0.85rem] text-muted line-through">{formatAZN(price)}</span>
      </p>
    );
  }
  return <p className={`${big} font-medium ${className}`}>{formatAZN(price)}</p>;
}
