import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/flags";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Until NEXT_PUBLIC_INDEXABLE=1 the whole site (preview, staging, pre-launch) is closed to crawlers.
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", ...["az", "en", "ru"].flatMap((l) => [`/${l}/sebet`, `/${l}/odenis`, `/${l}/sevimliler`])] }],
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
