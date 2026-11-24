"use client";

import Link from "@/i18n/link";
import { Overlay } from "@/components/ui/Overlay";
import { useUI } from "@/lib/ui-store";
import { useT } from "@/i18n/provider";

export function AccountPanel() {
  const { panel, closePanel } = useUI();
  const t = useT().chrome.account;
  return (
    <Overlay open={panel === "account"} onClose={closePanel} label={t.title} side="right">
      <div className="flex flex-1 flex-col justify-center px-8 pb-16">
        <h2 className="t-h2">{t.title}</h2>
        <p className="mt-4 max-w-[34ch] text-muted">{t.text}</p>
        <div className="mt-8 grid gap-3">
          <Link href="/sevimliler" onClick={closePanel} className="btn btn-ghost">
            {t.wishlist}
          </Link>
          <Link href="/sebet" onClick={closePanel} className="btn btn-ghost">
            {t.cart}
          </Link>
        </div>
      </div>
    </Overlay>
  );
}
