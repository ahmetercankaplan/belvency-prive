"use client";

import Link from "next/link";
import { Overlay } from "@/components/ui/Overlay";
import { useUI } from "@/lib/ui-store";

export function AccountPanel() {
  const { panel, closePanel } = useUI();
  return (
    <Overlay open={panel === "account"} onClose={closePanel} label="Hesab" side="right">
      <div className="flex flex-1 flex-col justify-center px-8 pb-16">
        <h2 className="t-h2">Hesab</h2>
        <p className="mt-4 max-w-[34ch] text-muted">
          Giriş və qeydiyyat növbəti mərhələdə əlavə olunacaq. Hələlik səbətiniz və sevimliləriniz bu cihazda saxlanılır.
        </p>
        <div className="mt-8 grid gap-3">
          <Link href="/sevimliler" onClick={closePanel} className="btn btn-ghost">
            Sevimlilərim
          </Link>
          <Link href="/sebet" onClick={closePanel} className="btn btn-ghost">
            Səbətim
          </Link>
        </div>
      </div>
    </Overlay>
  );
}
