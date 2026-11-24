import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { indexable, live, siteUrl } from "@/lib/flags";
import { UIProvider } from "@/lib/ui-store";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { Toaster } from "@/components/layout/Toaster";
import { RouteArch } from "@/components/layout/RouteArch";
import { ChromeSwitch } from "@/components/layout/ChromeSwitch";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  title: {
    default: "Belvency Privé — Zövqlə seçilmiş lüks",
    template: "%s · Belvency Privé",
  },
  description:
    "Belvency Privé: ətir, zərgərlik, çanta, saat və aksesuarlardan ibarət seçilmiş lüks butik." +
    (live ? "" : " Dizayn nümayişi — real satış aparılmır."),
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject attributes into <body> before React hydrates */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <UIProvider>
          <ChromeSwitch
            top={
              <>
                <AnnouncementBar />
                <Header />
              </>
            }
            bottom={
              <>
                <Footer />
                <CartDrawer />
                <SearchOverlay />
                <MobileMenu />
                <AccountPanel />
                <Toaster />
                <RouteArch />
              </>
            }
          >
            {children}
          </ChromeSwitch>
        </UIProvider>
      </body>
    </html>
  );
}
