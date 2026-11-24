"use client";

import { useEffect } from "react";
import { LANG_KEY, defaultLocale, isLocale, localeNames, locales } from "@/i18n/config";

/** "/" has no content of its own: send the visitor to /az, /en or /ru (saved choice, else browser language). */
export default function RootRedirect() {
  useEffect(() => {
    let pick: string = defaultLocale;
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (isLocale(saved)) pick = saved;
      else {
        const nav = (navigator.languages?.[0] ?? navigator.language ?? "").slice(0, 2).toLowerCase();
        if (nav === "ru") pick = "ru";
      }
    } catch {
      /* storage blocked: default language */
    }
    window.location.replace(`/${pick}${window.location.search}${window.location.hash}`);
  }, []);

  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="font-display text-3xl">Belvency Privé</p>
      <ul className="flex gap-5">
        {locales.map((l) => (
          <li key={l}>
            <a href={`/${l}`} className="underline underline-offset-4">
              {localeNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
