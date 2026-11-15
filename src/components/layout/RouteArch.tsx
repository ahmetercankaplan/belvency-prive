"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A garnet curtain that gathers into an arch and lifts after every page change.
 * Skipped on first load and for reduced-motion users (CSS hides it).
 */
export function RouteArch() {
  const pathname = usePathname();
  const [last, setLast] = useState(pathname);
  const [plays, setPlays] = useState(0);

  if (last !== pathname) {
    setLast(pathname);
    setPlays((n) => n + 1);
  }

  if (plays === 0) return null;
  return <div key={plays} aria-hidden="true" className="route-arch" />;
}
