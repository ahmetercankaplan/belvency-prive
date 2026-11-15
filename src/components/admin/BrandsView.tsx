"use client";

import { useState } from "react";
import type { Brand } from "@/lib/types";
import { ApiError, api, useApi } from "./api";
import { Card, Field, Notice, inputCls } from "./ui";

const EMPTY = { name: "", specialty: "", blurb: "" };

export function BrandsView() {
  const { data, error, loading, reload } = useApi<{ brands: Brand[] }>("/api/admin/brands");
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (editing) await api("PUT", `/api/admin/brands/${editing}`, form);
      else await api("POST", "/api/admin/brands", form);
      setMsg({ tone: "ok", text: editing ? "Brend yeniləndi" : "Brend əlavə olundu" });
      setForm(EMPTY);
      setEditing(null);
      reload();
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof ApiError ? err.message : "Xəta baş verdi" });
    }
    setBusy(false);
  };

  const remove = async (b: Brand) => {
    if (!confirm(`“${b.name}” brendini silək?`)) return;
    try {
      await api("DELETE", `/api/admin/brands/${b.slug}`);
      setMsg({ tone: "ok", text: "Brend silindi" });
      reload();
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof ApiError ? err.message : "Xəta baş verdi" });
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-[2.2rem] font-medium leading-tight">Brendlər</h1>
      <p className="mt-2 max-w-[60ch] text-muted">Yalnız satmağa icazəniz olan brendləri əlavə edin. Məhsul yaratmazdan əvvəl brendi burada əlavə etmək lazımdır.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card title={`Brend siyahısı${data ? ` (${data.brands.length})` : ""}`}>
          {error && <Notice tone="error">{error}</Notice>}
          {loading && <p className="text-muted">Yüklənir…</p>}
          {data && data.brands.length === 0 && <p className="text-sm text-muted">Hələ brend yoxdur. Sağdakı formadan ilk brendi əlavə edin.</p>}
          <ul className="divide-y divide-line">
            {data?.brands.map((b) => (
              <li key={b.slug} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-muted">{b.specialty || "—"}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    className="min-h-10 rounded-lg px-3 text-sm hover:bg-linen"
                    onClick={() => { setEditing(b.slug); setForm({ name: b.name, specialty: b.specialty, blurb: b.blurb }); setMsg(null); }}
                  >
                    Redaktə
                  </button>
                  <button type="button" className="min-h-10 rounded-lg px-3 text-sm text-garnet-bright hover:bg-blush/50" onClick={() => remove(b)}>
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={editing ? "Brendi redaktə et" : "Yeni brend"}>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Brend adı">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60} required />
            </Field>
            <Field label="İxtisas" hint="Məsələn: Ətirlər, Zərgərlik">
              <input className={inputCls} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} maxLength={60} />
            </Field>
            <Field label="Qısa təsvir">
              <textarea className={inputCls} rows={3} value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} maxLength={300} />
            </Field>
            {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
            <div className="flex gap-3">
              <button type="submit" disabled={busy || !form.name.trim()} className="btn btn-primary">{editing ? "Yadda saxla" : "Brend əlavə et"}</button>
              {editing && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm(EMPTY); setMsg(null); }}>
                  Ləğv et
                </button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
