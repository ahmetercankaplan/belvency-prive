import type { Metadata } from "next";
import { live } from "@/lib/flags";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { Toaster } from "@/components/layout/Toaster";
import { RouteArch } from "@/components/layout/RouteArch";
import { locales } from "@/i18n/config";
import { getClientDict, getDict } from "@/i18n/dict";
import { LocaleProvider } from "@/i18n/provider";
import { ogLocale, resolveLocale, type LangParams } from "@/i18n/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).chrome;
  return {
    title: { default: `Belvency Privé — ${d.tagline}`, template: "%s · Belvency Privé" },
    description: d.meta.description + (live ? "" : d.meta.demo),
    openGraph: { locale: ogLocale[locale], siteName: "Belvency Privé", type: "website" },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode } & LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);

  return (
    <LocaleProvider locale={locale} dict={getClientDict(locale)}>
      <a
        href="#esas"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cocoa focus:px-5 focus:py-3 focus:text-ivory"
      >
        {d.chrome.skip}
      </a>
      <AnnouncementBar locale={locale} />
      <Header />
      <main id="esas" className="flex-1 pb-20 md:pb-24">
        {children}
      </main>
      <Footer locale={locale} />
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu />
      <AccountPanel />
      <Toaster />
      <RouteArch />
    </LocaleProvider>
  );
}
