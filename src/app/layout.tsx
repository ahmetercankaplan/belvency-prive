import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { indexable, siteUrl } from "@/lib/flags";
import { UIProvider } from "@/lib/ui-store";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  title: {
    default: "Belvency Privé",
    template: "%s · Belvency Privé",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

/** The page language comes from the first URL segment (/az, /en, /ru); set it before first paint. */
const LANG_SCRIPT = `(function(){var m=location.pathname.match(/^\\/(az|en|ru)(\\/|$)/);document.documentElement.lang=m?m[1]:"az"})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject attributes into <body> before React hydrates */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
