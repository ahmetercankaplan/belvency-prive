"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, LogOut, Package, ShoppingBag, Tag } from "lucide-react";
import { ArchMark } from "@/components/ui/Logo";
import { api, useApi } from "./api";
import { Notice, inputCls } from "./ui";

const NAV = [
  { href: "/admin", label: "Ümumi baxış", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Sifarişlər", icon: ShoppingBag },
  { href: "/admin/products", label: "Məhsullar", icon: Package },
  { href: "/admin/brands", label: "Brendlər", icon: Tag },
];

function LoginForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("POST", "/api/auth/login", { password });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-ivory px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-line bg-white/70 p-8 shadow-[0_30px_60px_-30px_rgba(74,14,34,0.35)]">
        <ArchMark className="h-8 w-8 text-garnet" />
        <h1 className="mt-4 font-display text-[1.9rem] font-medium leading-tight">İdarə paneli</h1>
        <p className="mt-1 text-sm text-muted">Belvency Privé</p>
        <label htmlFor="pw" className="mt-7 block text-sm font-medium">
          Parol
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputCls} mt-1`}
        />
        {error && (
          <div className="mt-4">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
        <button type="submit" disabled={busy || !password} className="btn btn-primary mt-6 w-full">
          {busy ? "Yoxlanılır…" : "Daxil ol"}
        </button>
      </form>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const me = useApi<{ admin: boolean }>("/api/auth/me");
  const pathname = usePathname();

  if (me.loading) return <div className="grid min-h-dvh place-items-center text-muted">Yüklənir…</div>;
  if (me.error) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <Notice tone="error">Server ilə əlaqə yoxdur: {me.error}</Notice>
      </div>
    );
  }
  if (!me.data?.admin) return <LoginForm onDone={me.reload} />;

  const logout = async () => {
    await api("POST", "/api/auth/logout", {});
    me.reload();
  };

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-dvh bg-ivory md:grid md:grid-cols-[14.5rem_1fr]">
      <aside className="border-b border-line bg-linen/70 md:sticky md:top-0 md:h-dvh md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:flex-col md:items-start md:px-5 md:py-6">
          <div className="flex items-center gap-2.5">
            <ArchMark className="h-6 w-6 text-garnet" />
            <div className="leading-tight">
              <p className="font-display text-[1.15rem] font-medium tracking-[0.18em]">BELVENCY</p>
              <p className="text-xs text-muted">İdarə paneli</p>
            </div>
          </div>
          <button type="button" onClick={logout} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-white/70 hover:text-cocoa md:hidden">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Çıxış
          </button>
        </div>
        <nav aria-label="İdarə menyusu" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg px-3 text-[0.95rem] transition-colors ${
                active(href) ? "bg-garnet text-ivory" : "hover:bg-white/70"
              }`}
            >
              <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-3 pt-6 md:block">
          <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/70 hover:text-cocoa">
            Mağazaya bax
          </Link>
          <button type="button" onClick={logout} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-white/70 hover:text-cocoa">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Çıxış
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
