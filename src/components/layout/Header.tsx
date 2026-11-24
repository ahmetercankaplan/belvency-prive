"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { mainNav } from "@/data/site";
import { groups } from "@/data/categories";
import { categoriesFor } from "@/lib/catalog";
import { cartTotals, useHydrated, useShop } from "@/lib/shop-store";
import { useUI } from "@/lib/ui-store";
import { Logo } from "@/components/ui/Logo";
import { ProductArt } from "@/components/ui/ProductArt";
import type { Gender } from "@/lib/types";
import { live } from "@/lib/flags";

type MenuKey = "qadin" | "kisi";

function MegaMenu({ gender, onNavigate }: { gender: MenuKey; onNavigate: () => void }) {
  const cats = categoriesFor(gender as Gender);
  const art =
    gender === "qadin"
      ? ({ kind: "perfume", tone: "blush", label: "Qadın kolleksiyası" } as const)
      : ({ kind: "watch", tone: "cocoa", label: "Kişi kolleksiyası" } as const);
  const title = gender === "qadin" ? "Qadın kolleksiyası" : "Kişi kolleksiyası";

  return (
    <div className="anim-drop absolute inset-x-0 top-full border-t border-line bg-ivory shadow-[0_30px_50px_-30px_rgba(52,46,44,.25)]">
      <div className="container-x grid grid-cols-12 gap-8 py-10">
        <div className="col-span-8 grid grid-cols-3 gap-8">
          {groups.map((g) => {
            const list = cats.filter((c) => c.group === g.slug);
            if (list.length === 0) return null;
            return (
              <div key={g.slug}>
                <p className="font-display text-xl font-medium">{g.title}</p>
                <ul className="mt-3 space-y-1">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/kataloq/${c.slug}?cins=${gender}`}
                        onClick={onNavigate}
                        className="inline-block py-1 text-[0.95rem] text-muted transition-colors hover:text-cocoa"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="col-span-4 flex items-center gap-6">
          <div className="arch w-32 shrink-0">
            <ProductArt {...art} flat className="aspect-[4/5] w-full" />
          </div>
          <div>
            <p className="t-h3">{title}</p>
            <p className="mt-2 text-sm text-muted">Bu mövsümün seçilmiş modellərinə baxın.</p>
            <Link href={`/${gender}`} onClick={onNavigate} className="link-u mt-4 inline-block text-sm font-medium">
              Hamısına bax
            </Link>
            {!live && (
              <>
                <br />
                <Link href="/etir-tapici" onClick={onNavigate} className="link-u mt-3 inline-block text-sm font-medium text-garnet-bright">
                  Ətir tapıcı
                </Link>
                <br />
                <Link href="/lookbook" onClick={onNavigate} className="link-u mt-3 inline-block text-sm font-medium">
                  Lookbook
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { cart, wishlist } = useShop();
  const hydrated = useHydrated();
  const { openPanel } = useUI();
  const pathname = usePathname();
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const { count } = cartTotals(cart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const open = (k: MenuKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMenu(k);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 140);
  };

  // close the mega menu whenever the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(null);
  }

  const iconBtn =
    "relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-linen";

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || menu ? "border-line bg-ivory/92 backdrop-blur-md" : "border-transparent bg-ivory"
      }`}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node | null)) setMenu(null);
      }}
    >
      <div className="container-x grid h-[3.9rem] grid-cols-[1fr_auto_1fr] items-center md:h-[4.4rem]">
        {/* left */}
        <div className="flex items-center">
          <button
            type="button"
            className={`${iconBtn} -ml-2 lg:hidden`}
            aria-label="Menyunu aç"
            onClick={() => openPanel("menu")}
          >
            <Menu className="h-[1.35rem] w-[1.35rem]" aria-hidden="true" />
          </button>
          <nav aria-label="Əsas menyu" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {mainNav.map((item) => (
                <li key={item.href} onMouseEnter={() => ("menu" in item && item.menu ? open(item.menu) : setMenu(null))}>
                  {"menu" in item && item.menu ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={menu === item.menu}
                        aria-controls={`menu-${item.menu}`}
                        onClick={() => setMenu(menu === item.menu ? null : item.menu!)}
                        className={`flex items-center gap-1 py-2 text-[0.95rem] tracking-[0.02em] transition-colors ${
                          menu === item.menu ? "text-garnet-bright" : "hover:text-garnet-bright"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${menu === item.menu ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      {menu === item.menu && (
                        <div id={`menu-${item.menu}`}>
                          <MegaMenu gender={item.menu} onNavigate={() => setMenu(null)} />
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-2 text-[0.95rem] tracking-[0.02em] transition-colors hover:text-garnet-bright"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* center */}
        <Logo />

        {/* right */}
        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          <details className="group relative hidden md:block">
            <summary
              className="flex h-11 cursor-pointer list-none items-center gap-1 rounded-full px-3 text-[0.85rem] transition-colors hover:bg-linen [&::-webkit-details-marker]:hidden"
              aria-label="Dil seçimi"
            >
              AZ
              <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="anim-drop absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-line bg-ivory p-1.5 text-sm shadow-lg">
              <li>
                <span className="flex items-center justify-between rounded-lg bg-linen px-3 py-2" aria-current="true">
                  Azərbaycan dili <span className="sr-only">(seçilib)</span>
                </span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 text-muted">
                English <span className="text-xs">tezliklə</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 text-muted">
                Русский <span className="text-xs">tezliklə</span>
              </li>
            </ul>
          </details>
          <button type="button" className={iconBtn} aria-label="Axtarış" onClick={() => openPanel("search")}>
            <Search className="h-[1.3rem] w-[1.3rem]" aria-hidden="true" />
          </button>
          <button type="button" className={`${iconBtn} hidden sm:grid`} aria-label="Hesab" onClick={() => openPanel("account")}>
            <User className="h-[1.3rem] w-[1.3rem]" aria-hidden="true" />
          </button>
          <Link href="/sevimliler" className={iconBtn} aria-label={`Sevimlilər${hydrated ? `, ${wishlist.length} məhsul` : ""}`}>
            <Heart className="h-[1.3rem] w-[1.3rem]" aria-hidden="true" />
            {hydrated && wishlist.length > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-garnet-bright px-1 text-[0.65rem] font-medium leading-none text-ivory">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={iconBtn}
            aria-label={`Səbət${hydrated ? `, ${count} məhsul` : ""}`}
            onClick={() => openPanel("cart")}
          >
            <ShoppingBag className="h-[1.3rem] w-[1.3rem]" aria-hidden="true" />
            {hydrated && count > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-garnet px-1 text-[0.65rem] font-medium leading-none text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
