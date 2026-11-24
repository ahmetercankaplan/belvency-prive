import type { ReactNode } from "react";
import Link from "@/i18n/link";

const LINK = /\[([^\]]+)\]\((\/[^)]*)\)/g;

/** Renders dictionary text that contains [label](/path) links. */
export function Rich({ text, linkClassName = "underline underline-offset-4" }: { text: string; linkClassName?: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <Link key={at} href={m[2]} className={linkClassName}>
        {m[1]}
      </Link>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
