"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The storefront chrome (header, footer, drawers) wraps every page except the admin panel.
 * Server-rendered pieces arrive as props, so nothing here needs to be a client import.
 */
export function ChromeSwitch({ top, bottom, children }: { top: ReactNode; bottom: ReactNode; children: ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");
  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a
        href="#esas"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cocoa focus:px-5 focus:py-3 focus:text-ivory"
      >
        Əsas məzmuna keç
      </a>
      {top}
      <main id="esas" className="flex-1 pb-20 md:pb-24">
        {children}
      </main>
      {bottom}
    </>
  );
}
