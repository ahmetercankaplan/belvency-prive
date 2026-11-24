"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { ClientDict } from "./dict";

interface Ctx {
  locale: Locale;
  t: ClientDict;
}

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ locale, dict, children }: { locale: Locale; dict: ClientDict; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: dict }}>{children}</LocaleContext.Provider>;
}

function useCtx() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale/useT must be used inside <LocaleProvider>");
  return ctx;
}

export const useLocale = () => useCtx().locale;
export const useT = () => useCtx().t;
