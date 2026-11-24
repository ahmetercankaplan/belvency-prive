/**
 * Runs before `next dev` / `next build`. Writes src/data/catalog.snapshot.json.
 *
 *  CATALOG_SOURCE unset  -> demo catalog (local design work)
 *  CATALOG_SOURCE=live   -> real catalog from the admin store (Netlify Blobs on Netlify, .data/ locally).
 *                           If there is no active product the build STOPS: we never publish an empty or demo shop.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { listBrands, listProducts } from "../server/catalog.ts";
import { openStore } from "../server/store.ts";

import { sellerMissing } from "../src/data/legal.ts";

const out = fileURLToPath(new URL("../src/data/catalog.snapshot.json", import.meta.url));

if (process.env.CATALOG_SOURCE === "live" && sellerMissing.length) {
  const msg = `satıcı məlumatları boşdur: ${sellerMissing.join(", ")} (src/data/legal.ts)`;
  if (process.env.NEXT_PUBLIC_INDEXABLE === "1") {
    console.error(`
[legal] DAYANDIRILDI: ${msg}.
Rəsmi açılışdan əvvəl bu məlumatlar doldurulmalıdır (Elektron ticarət qanunu, kart ödənişi üçün də tələb olunur).
`);
    process.exit(1);
  }
  console.warn(`[legal] XƏBƏRDARLIQ: ${msg}. Rəsmi açılışda (NEXT_PUBLIC_INDEXABLE=1) build bunun üçün dayanacaq.`);
}

if (process.env.CATALOG_SOURCE !== "live") {
  writeFileSync(out, JSON.stringify({ source: "demo" }));
  console.log("[catalog] demo katalog (CATALOG_SOURCE=live deyil)");
} else {
  const store = await openStore(process.env as Record<string, string | undefined>);
  const [all, brands] = await Promise.all([listProducts(store), listBrands(store)]);
  const products = all
    .filter((p) => p.active)
    .map((p) => {
      const pub: Record<string, unknown> = { ...p };
      for (const k of ["active", "createdAt", "updatedAt"]) delete pub[k];
      return pub;
    });
  if (products.length === 0) {
    console.error(
      "\n[catalog] DAYANDIRILDI: admin panelində aktiv (saytda görünən) məhsul yoxdur.\n" +
        "Boş mağaza yayımlanmır. Panelə məhsul əlavə edin və yenidən yayımlayın.\n",
    );
    process.exit(1);
  }
  const used = new Set(products.map((p) => p.brandSlug as string));
  writeFileSync(out, JSON.stringify({ source: "live", generatedAt: new Date().toISOString(), products, brands: brands.filter((b) => used.has(b.slug)) }));
  console.log(`[catalog] real katalog: ${products.length} məhsul, ${used.size} brend`);
}
