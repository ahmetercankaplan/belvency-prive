/**
 * Build-time switches (set as environment variables in Netlify).
 *
 *  NEXT_PUBLIC_INDEXABLE=1   let search engines in. Leave unset until the shop is really open.
 *  NEXT_PUBLIC_SITE_URL      canonical origin, e.g. https://belvency.az (no trailing slash)
 */
export const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "1";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
