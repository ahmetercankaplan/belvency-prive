import type { Metadata } from "next";
import { GenderLanding } from "@/components/shop/GenderLanding";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.women;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/qadin") };
}

export default async function WomenPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.women;
  return <GenderLanding locale={locale} gender="qadin" title={d.title} intro={d.intro} art={{ kind: "perfume", tone: "blush" }} />;
}
