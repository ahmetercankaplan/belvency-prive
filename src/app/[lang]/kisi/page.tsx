import type { Metadata } from "next";
import { GenderLanding } from "@/components/shop/GenderLanding";
import { getDict } from "@/i18n/dict";
import { alternatesFor, resolveLocale, type LangParams } from "@/i18n/server";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.men;
  return { title: d.title, description: d.description, alternates: alternatesFor(locale, "/kisi") };
}

export default async function MenPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale).pages.men;
  return <GenderLanding locale={locale} gender="kisi" title={d.title} intro={d.intro} art={{ kind: "watch", tone: "cocoa" }} />;
}
