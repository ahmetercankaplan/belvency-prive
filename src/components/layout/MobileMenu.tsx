"use client";

import Link from "@/i18n/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, User } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { Logo } from "@/components/ui/Logo";
import { categoriesFor } from "@/lib/catalog";
import { sellerHours, seller } from "@/data/legal";
import { useCatalog } from "@/i18n/use-catalog";
import { useLocale, useT } from "@/i18n/provider";
import { useUI } from "@/lib/ui-store";
import { live } from "@/lib/flags";

function Section({ gender, label, onNavigate }: { gender: "qadin" | "kisi"; label: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const t = useT().chrome;
  const { groups, categories } = useCatalog();
  const cats = categoriesFor(gender, categories);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex min-h-[3.75rem] w-full items-center justify-between font-display text-[1.9rem] font-light"
      >
        {label}
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="anim-drop pb-5">
          <Link href={`/${gender}`} onClick={onNavigate} className="block py-2.5 text-[0.95rem] font-medium">
            {t.mobile.viewAll}
          </Link>
          {groups.map((g) => {
            const list = cats.filter((c) => c.group === g.slug);
            if (!list.length) return null;
            return (
              <div key={g.slug} className="mt-3">
                <p className="t-small text-muted">{g.title}</p>
                <ul className="mt-1 grid grid-cols-2 gap-x-4">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/kataloq/${c.slug}?cins=${gender}`}
                        onClick={onNavigate}
                        className="block py-2.5 text-[0.95rem]"
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
      )}
    </div>
  );
}

export function MobileMenu() {
  const { panel, closePanel, openPanel } = useUI();
  const t = useT().chrome;
  const locale = useLocale();
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (panel === "menu") closePanel();
  }

  const link = "flex min-h-[3.75rem] items-center border-b border-line font-display text-[1.9rem] font-light";

  return (
    <Overlay open={panel === "menu"} onClose={closePanel} label={t.mobile.menu} side="left" hideClose>
      <div className="flex items-center justify-between px-5 pt-4">
        <Logo stacked={false} />
        <button type="button" onClick={closePanel} className="grid h-11 w-11 place-items-center rounded-full hover:bg-linen" aria-label={t.mobile.closeMenu}>
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        </button>
      </div>
      <nav aria-label={t.mobile.nav} className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
        <Section gender="qadin" label={t.nav.women} onNavigate={closePanel} />
        <Section gender="kisi" label={t.nav.men} onNavigate={closePanel} />
        <Link href="/brendler" onClick={closePanel} className={link}>
          {t.mobile.brands}
        </Link>
        <Link href="/kataloq/hediyye-secimleri" onClick={closePanel} className={link}>
          {t.mobile.giftPicks}
        </Link>
        {!live && (
          <Link href="/etir-tapici" onClick={closePanel} className={link}>
            {t.mobile.scentFinder}
          </Link>
        )}
        <Link href="/hediyye-sihirbazi" onClick={closePanel} className={link}>
          {t.mobile.giftWizard}
        </Link>
        {!live && (
          <Link href="/lookbook" onClick={closePanel} className={link}>
            {t.mobile.lookbook}
          </Link>
        )}
        <Link href="/kataloq/xususi-teklifler" onClick={closePanel} className={link}>
          {t.mobile.offers}
        </Link>
      </nav>
      <div className="border-t border-line bg-linen px-5 py-5">
        <div className="flex gap-3">
          <Link href="/sevimliler" onClick={closePanel} className="btn btn-ghost flex-1">
            <Heart className="h-4 w-4" aria-hidden="true" /> {t.mobile.wishlist}
          </Link>
          <button type="button" onClick={() => openPanel("account")} className="btn btn-ghost flex-1">
            <User className="h-4 w-4" aria-hidden="true" /> {t.mobile.account}
          </button>
        </div>
        <p className="t-small mt-4 text-muted">
          {seller.phone} · {sellerHours(locale)}
        </p>
      </div>
    </Overlay>
  );
}
