"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Side = "right" | "left" | "bottom" | "top";

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: Side;
  children: ReactNode;
  /** extra classes for the panel */
  className?: string;
  hideClose?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PANEL: Record<Side, string> = {
  right: "right-0 top-0 h-full w-full max-w-[28rem] anim-right",
  left: "left-0 top-0 h-full w-full max-w-[24rem] anim-left",
  bottom: "bottom-0 left-0 right-0 max-h-[88dvh] rounded-t-2xl anim-up",
  top: "top-0 left-0 right-0 max-h-[100dvh] anim-drop",
};

/** Accessible modal panel: focus trap, Escape, scroll lock, focus return. */
export function Overlay({ open, onClose, label, side = "right", children, className = "", hideClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const autofocus = panel?.querySelector<HTMLElement>("[data-autofocus]");
    (autofocus ?? focusables()[0] ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="anim-fade absolute inset-0 bg-cocoa/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`absolute flex flex-col overflow-hidden bg-ivory shadow-[0_0_60px_-20px_rgba(52,46,44,.35)] outline-none ${PANEL[side]} ${className}`}
      >
        {!hideClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Bağla"
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full text-cocoa transition-colors hover:bg-linen"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
