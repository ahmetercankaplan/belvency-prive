"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, splitLocale } from "@/i18n/config";
import { chrome } from "@/i18n/dict/chrome";

/** Global 404. It sits outside [lang], so the language is read from the URL. */
export default function NotFound() {
  const locale = splitLocale(usePathname() ?? "/").locale ?? defaultLocale;
  const t = chrome[locale].notFound;
  return (
    <div className="container-x flex min-h-[55vh] flex-col items-start justify-center py-20">
      <h1 className="t-h1">{t.title}</h1>
      <p className="t-lead mt-4">{t.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <NextLink href={`/${locale}`} className="btn btn-primary">
          {t.home}
        </NextLink>
        <NextLink href={`/${locale}/kataloq`} className="btn btn-ghost">
          {t.catalog}
        </NextLink>
      </div>
    </div>
  );
}
