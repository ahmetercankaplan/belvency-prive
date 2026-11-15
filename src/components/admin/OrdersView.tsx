"use client";

import { useMemo, useState } from "react";
import type { Order } from "../../../server/orders.ts";
import { ApiError, api, useApi } from "./api";
import { Notice, STATUS_LABEL, StatusBadge, fmt, fmtDate, inputCls } from "./ui";

const FILTERS = ["hamisi", "yeni", "tesdiqlendi", "gonderildi", "catdirildi", "legv"] as const;
const PAY_LABEL: Record<string, string> = { cod: "Çatdırılmada nağd", transfer: "Bank köçürməsi", card: "Bank kartı" };

function OrderCard({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const [note, setNote] = useState(order.adminNote);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const patch = async (body: Record<string, unknown>) => {
    setBusy(true);
    setErr("");
    try {
      await api("PATCH", `/api/admin/orders/${order.id}`, body);
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Xəta baş verdi");
    }
    setBusy(false);
  };

  const cancelled = order.status === "legv";
  const phoneDigits = order.customer.phone.replace(/\D/g, "");

  return (
    <details className="group rounded-2xl border border-line bg-white/60 open:shadow-[0_18px_40px_-26px_rgba(74,14,34,0.45)]">
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-4 md:grid-cols-[9rem_1fr_7rem_9rem_auto] md:px-5 [&::-webkit-details-marker]:hidden">
        <span className="font-medium">{order.id}</span>
        <span className="col-span-2 order-last text-sm text-muted md:order-none md:col-span-1">
          {order.customer.name} {order.customer.surname} · {fmtDate(order.createdAt)}
        </span>
        <span className="text-right font-medium md:text-left">{fmt(order.pricing.total)}</span>
        <span className="hidden text-sm text-muted md:block">{PAY_LABEL[order.payment.method]}</span>
        <span className="flex items-center gap-2">
          {!order.notified && <span title="Telegram bildirişi göndərilməyib" className="h-2 w-2 rounded-full bg-garnet-bright" aria-label="Bildiriş göndərilməyib" />}
          <StatusBadge status={order.status} />
        </span>
      </summary>

      <div className="grid gap-6 border-t border-line px-4 py-5 md:grid-cols-2 md:px-5">
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Müştəri</p>
            <p>{order.customer.name} {order.customer.surname}</p>
            <p>
              <a href={`tel:+${phoneDigits}`} className="underline underline-offset-4">{order.customer.phone}</a>
              {" · "}
              <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">WhatsApp</a>
            </p>
            {order.customer.email && <p>{order.customer.email}</p>}
            <p className="mt-1">{order.customer.region}, {order.customer.address}</p>
            {order.customer.note && <p className="mt-1 text-muted">Qeyd: {order.customer.note}</p>}
          </div>
          {(order.gift.wrap || order.gift.message) && (
            <div className="rounded-xl bg-blush/50 p-3">
              <p className="font-medium">Hədiyyə</p>
              {order.gift.wrap && <p>Hədiyyə qablaşdırması</p>}
              {order.gift.message && <p className="mt-1 font-display text-[1.05rem] italic">“{order.gift.message}”</p>}
            </div>
          )}
          <div>
            <p className="font-medium">Tarixçə</p>
            <ul className="text-muted">
              {order.history.map((h) => (
                <li key={h.at + h.status}>{fmtDate(h.at)} — {STATUS_LABEL[h.status]}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Məhsullar</p>
            <ul className="mt-1 divide-y divide-line">
              {order.lines.map((l) => (
                <li key={l.productId + (l.option ?? "")} className="flex justify-between gap-3 py-1.5">
                  <span>{l.title}{l.option ? ` (${l.option})` : ""} × {l.qty}</span>
                  <span>{fmt(l.unitPrice * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-0.5 text-muted">
              <div className="flex justify-between"><dt>Çatdırılma</dt><dd>{order.pricing.delivery ? fmt(order.pricing.delivery) : "Pulsuz"}</dd></div>
              {order.pricing.giftFee > 0 && <div className="flex justify-between"><dt>Qablaşdırma</dt><dd>{fmt(order.pricing.giftFee)}</dd></div>}
              <div className="flex justify-between font-medium text-cocoa"><dt>Cəmi</dt><dd>{fmt(order.pricing.total)}</dd></div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block font-medium">Status</span>
              <select
                value={order.status}
                disabled={busy || cancelled}
                onChange={(e) => {
                  if (e.target.value === "legv" && !confirm("Sifarişi ləğv edək? Stok geri qaytarılacaq və bu əməliyyat geri alına bilməz.")) return;
                  patch({ status: e.target.value });
                }}
                className={inputCls}
              >
                {Object.entries(STATUS_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block font-medium">Ödəniş</span>
              <select
                value={order.payment.status}
                disabled={busy}
                onChange={(e) => patch({ paymentStatus: e.target.value })}
                className={inputCls}
              >
                <option value="gozlenir">Gözlənilir</option>
                <option value="odenilib">Ödənilib</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block font-medium">Daxili qeyd</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={inputCls} maxLength={500} />
          </label>
          <button type="button" disabled={busy || note === order.adminNote} onClick={() => patch({ adminNote: note })} className="btn btn-ghost min-h-10 px-5 text-sm">
            Qeydi saxla
          </button>
          {err && <Notice tone="error">{err}</Notice>}
        </div>
      </div>
    </details>
  );
}

export function OrdersView() {
  const { data, error, loading, reload } = useApi<{ orders: Order[] }>("/api/admin/orders");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("hamisi");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const all = data?.orders ?? [];
    const needle = q.trim().toLowerCase();
    return all.filter(
      (o) =>
        (filter === "hamisi" || o.status === filter) &&
        (!needle ||
          o.id.toLowerCase().includes(needle) ||
          `${o.customer.name} ${o.customer.surname}`.toLowerCase().includes(needle) ||
          o.customer.phone.replace(/\D/g, "").includes(needle.replace(/\D/g, "") || "§")),
    );
  }, [data, filter, q]);

  const count = (s: string) => (data?.orders ?? []).filter((o) => s === "hamisi" || o.status === s).length;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-[2.2rem] font-medium leading-tight">Sifarişlər</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Statusa görə süz">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${filter === f ? "border-garnet bg-garnet text-ivory" : "border-sand hover:border-garnet"}`}
          >
            {f === "hamisi" ? "Hamısı" : STATUS_LABEL[f]} <span className="opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 max-w-sm">
        <label htmlFor="oq" className="sr-only">Sifariş axtar</label>
        <input id="oq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nömrə, ad və ya telefon" className={inputCls} />
      </div>

      {error && <div className="mt-4"><Notice tone="error">{error}</Notice></div>}
      <div className="mt-6 space-y-3">
        {loading && <p className="text-muted">Yüklənir…</p>}
        {!loading && list.length === 0 && <p className="rounded-2xl bg-linen px-5 py-10 text-center text-muted">Bu filtrə uyğun sifariş yoxdur.</p>}
        {list.map((o) => (
          <OrderCard key={o.id + o.status + o.adminNote + o.payment.status} order={o} onChanged={reload} />
        ))}
      </div>
    </div>
  );
}
