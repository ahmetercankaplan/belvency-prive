"use client";

import { Check } from "lucide-react";
import { useUI } from "@/lib/ui-store";

export function Toaster() {
  const { toasts } = useUI();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-drop pointer-events-auto flex items-center gap-2.5 rounded-full bg-cocoa px-5 py-3 text-sm text-ivory shadow-xl"
        >
          <Check className="h-4 w-4 text-champagne" aria-hidden="true" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
