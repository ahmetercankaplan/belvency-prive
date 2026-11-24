"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { shop, useShop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import { fmt } from "@/i18n/config";
import { useT } from "@/i18n/provider";

interface Props {
  productId: string;
  title: string;
  /** "icon" = small round button on a card; "full" = labelled button */
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({ productId, title, variant = "icon", className = "" }: Props) {
  const { wishlist } = useShop();
  const { notify } = useUI();
  const t = useT().shop.wishlistBtn;
  const active = wishlist.includes(productId);
  const [pulse, setPulse] = useState(0);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = shop.toggleWishlist(productId);
    setPulse((n) => n + 1);
    notify(added ? t.added : t.removed);
  };

  const icon = (
    <Heart
      key={pulse}
      className={`h-[1.15rem] w-[1.15rem] ${pulse ? "anim-pop" : ""} ${active ? "fill-garnet-bright text-garnet-bright" : ""}`}
      aria-hidden="true"
    />
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        className={`btn btn-ghost ${className}`}
      >
        {icon}
        {active ? t.inWishlist : t.add}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={fmt(active ? t.removeAria : t.addAria, { title })}
      className={`grid h-11 w-11 place-items-center rounded-full bg-ivory/85 text-cocoa backdrop-blur transition-colors hover:bg-ivory ${className}`}
    >
      {icon}
    </button>
  );
}
