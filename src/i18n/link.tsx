"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { withLocale } from "./config";
import { useLocale } from "./provider";

type Props = ComponentProps<typeof NextLink>;

/** next/link that keeps the visitor in their language: href="/kataloq" becomes "/ru/kataloq". */
export default function Link({ href, ...rest }: Props) {
  const locale = useLocale();
  const to = typeof href === "string" ? withLocale(locale, href) : href;
  return <NextLink href={to} {...rest} />;
}
