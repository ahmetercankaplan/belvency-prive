import type { NextConfig } from "next";

/**
 * Netlify serves the storefront as a static export (STATIC_EXPORT=1 is set in netlify.toml);
 * orders and the admin API run as Netlify Functions. Locally nothing changes.
 */
const exporting = process.env.STATIC_EXPORT === "1";

/** Storefront routes that used to live at the site root before /az, /en, /ru existed. */
const OLD_PATHS = ["kataloq", "mehsul", "brendler", "qadin", "kisi", "sebet", "odenis", "sevimliler", "hediyye-sihirbazi", "etir-tapici", "lookbook", "haqqimizda", "sertler", "mexfilik", "catdirilma", "qaytarma", "elaqe"];

const nextConfig: NextConfig = {
  ...(exporting ? { output: "export" as const, images: { unoptimized: true } } : {}),
  // lets a second dev server run side by side (NEXT_DIST_DIR=.next-test)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Local testing only: API_PROXY=http://localhost:8888 forwards /api/* to scripts/dev-api.ts.
  // On Netlify the /api/* path is served by netlify/functions/api.ts (static export has no rewrites).
  ...(!exporting && process.env.API_PROXY
    ? { rewrites: async () => [{ source: "/api/:path*", destination: `${process.env.API_PROXY}/api/:path*` }] }
    : {}),
  // Local dev: the old unprefixed addresses go to the Azerbaijani pages (Netlify does this in netlify.toml)
  ...(!exporting
    ? {
        redirects: async () =>
          OLD_PATHS.map((p) => ({ source: `/${p}`, destination: `/az/${p}`, permanent: false })).concat(
            OLD_PATHS.map((p) => ({ source: `/${p}/:rest*`, destination: `/az/${p}/:rest*`, permanent: false })),
          ),
      }
    : {}),
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
