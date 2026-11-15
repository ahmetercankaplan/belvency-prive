"use client";

import Link from "next/link";
import { useState } from "react";
import type { Order } from "../../../server/orders.ts";
import { ApiError, api, useApi } from "./api";
import { Card, Notice, Stat, StatusBadge, fmt, fmtDate } from "./ui";

interface Summary {
  orders: { total: number; new: number; today: number };
  revenue: number;
  revenueToday: number;
  products: { total: number; active: number };
  lowStock: { id: string; title: string; option?: string; stock: number }[];
  unnotified: number;
  telegram: boolean;
  publishConfigured: boolean;
}

export function OverviewView() {
  const sum = useApi<Summary>("/api/admin/summary");
  const orders = useApi<{ orders: Order[] }>("/api/admin/orders");
  const [publishMsg, setPublishMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const publish = async () => {
    setBusy(true);
    setPublishMsg(null);
    try {
      await api("POST", "/api/admin/publish", {});
      setPublishMsg({ ok: true, text: "Dərc etmə başladı. Dəyişikliklər saytda 1–3 dəqiqəyə görünəcək." });
    } catch (e) {
      setPublishMsg({ ok: false, text: e instanceof ApiError ? e.message : "Xəta baş verdi" });
    }
    setBusy(false);
  };

  const s = sum.data;
  const recent = orders.data?.orders.slice(0, 6) ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-[2.2rem] font-medium leading-tight">Ümumi baxış</h1>
      {sum.error && <div className="mt-4"><Notice tone="error">{sum.error}</Notice></div>}

      {s && (
        <>
          <div className="mt-6 space-y-3">
            {!s.telegram && (
              <Notice tone="warn">Telegram bildirişi qoşulmayıb — yeni sifarişlər barədə xəbər almayacaqsınız. Sifarişləri bu paneldən izləyin və ya Telegram məlumatlarını əlavə edin.</Notice>
            )}
            {s.unnotified > 0 && s.telegram && <Notice tone="warn">{s.unnotified} sifariş üçün Telegram bildirişi göndərilməyib. Sifarişlər bölməsinə baxın.</Notice>}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Yeni sifarişlər" value={String(s.orders.new)} tone={s.orders.new > 0 ? "alert" : "default"} />
            <Stat label="Bu gün sifariş" value={String(s.orders.today)} />
            <Stat label="Bu gün gəlir" value={fmt(s.revenueToday)} />
            <Stat label="Ümumi gəlir" value={fmt(s.revenue)} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card title="Son sifarişlər" action={<Link href="/admin/orders" className="link-u text-sm">Hamısına bax</Link>}>
              {recent.length === 0 ? (
                <p className="text-sm text-muted">Hələ sifariş yoxdur.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {recent.map((o) => (
                    <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <div>
                        <p className="font-medium">{o.id}</p>
                        <p className="text-sm text-muted">
                          {o.customer.name} {o.customer.surname} · {fmtDate(o.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{fmt(o.pricing.total)}</span>
                        <StatusBadge status={o.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <div className="space-y-6">
              <Card title="Az qalan stok">
                {s.lowStock.length === 0 ? (
                  <p className="text-sm text-muted">Hamısı kifayət qədərdir.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {s.lowStock.slice(0, 8).map((x) => (
                      <li key={`${x.id}${x.option ?? ""}`} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{x.title}{x.option ? ` (${x.option})` : ""}</span>
                        <span className={x.stock === 0 ? "font-medium text-garnet-bright" : "text-muted"}>{x.stock === 0 ? "Bitib" : `${x.stock} ədəd`}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/admin/products" className="link-u mt-4 inline-block text-sm">Məhsullara keç</Link>
              </Card>

              <Card title="Saytı yenilə">
                <p className="text-sm leading-relaxed text-muted">
                  Məhsul, qiymət və şəkil dəyişikliklərini saytda görünən etmək üçün dərc edin. Sifariş zamanı stok və qiymət həmişə canlı yoxlanılır.
                </p>
                <button type="button" onClick={publish} disabled={busy || !s.publishConfigured} className="btn btn-primary mt-4 w-full">
                  {busy ? "Göndərilir…" : "Dərc et"}
                </button>
                {!s.publishConfigured && <p className="mt-2 text-xs text-muted">Dərc etmə hələ qurulmayıb (build hook).</p>}
                {publishMsg && <div className="mt-3"><Notice tone={publishMsg.ok ? "ok" : "error"}>{publishMsg.text}</Notice></div>}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
