"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Info } from "lucide-react";
import { ProductArt } from "@/components/ui/ProductArt";
import { GiftCardPreview } from "./GiftCardPreview";
import { getProductById } from "@/data/products";
import { regions, site } from "@/data/site";
import { priceFor } from "@/lib/catalog";
import { formatAZN, formatAzPhone, parseAzPhone } from "@/lib/format";
import { cartTotals, giftFee, shop, useHydrated, useShop } from "@/lib/shop-store";
import type { CartLine } from "@/lib/types";

interface Values {
  name: string;
  surname: string;
  phone: string;
  email: string;
  region: string;
  address: string;
  note: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const INITIAL: Values = { name: "", surname: "", phone: "", email: "", region: "Bakı", address: "", note: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Adınızı yazın";
  if (v.surname.trim().length < 2) e.surname = "Soyadınızı yazın";
  if (!parseAzPhone(v.phone)) e.phone = "Düzgün nömrə yazın, məsələn: 050 123 45 67";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "E-poçt ünvanı düzgün deyil";
  if (v.address.trim().length < 8) e.address = "Küçə, bina və mənzili göstərin";
  return e;
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8rem] text-[#a3392f]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8rem] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface Placed {
  number: string;
  lines: CartLine[];
  total: number;
  name: string;
  phone: string;
  wrapped: boolean;
  message: string;
}

export function CheckoutView() {
  const hydrated = useHydrated();
  const { cart, gift } = useShop();
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [placed, setPlaced] = useState<Placed | null>(null);

  const { subtotal, savings } = cartTotals(cart);
  const baseFee = values.region === "Bakı" ? site.bakuDeliveryFee : site.regionDeliveryFee;
  const delivery = subtotal >= site.freeDeliveryFrom ? 0 : baseFee;
  const fee = giftFee(cart, gift);
  const total = subtotal + delivery + fee;

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Values) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };
  const show = (k: keyof Values) => (touched[k] ? errors[k] : undefined);
  const aria = (k: keyof Values) => ({
    "aria-invalid": show(k) ? (true as const) : undefined,
    "aria-describedby": show(k) ? `${k}-err` : undefined,
    onBlur: blur(k),
    onChange: set(k),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, surname: true, phone: true, email: true, address: true });
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    const national = parseAzPhone(values.phone)!;
    setPlaced({
      // demonstration reference only — not a real order number
      number: `DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
      lines: cart,
      total,
      name: values.name.trim(),
      phone: formatAzPhone(national),
      wrapped: fee > 0,
      message: gift.message.trim(),
    });
    shop.clearCart();
  };

  if (!hydrated) {
    return <div className="skeleton mt-10 h-96" aria-busy="true" aria-label="Yüklənir" />;
  }

  if (placed) {
    return (
      <div className="mt-10 max-w-2xl bg-linen p-8 md:p-12" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa text-ivory">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="t-h2 mt-6">Nümayiş sifarişi qeyd olundu</h2>
        <p className="mt-3 text-muted">
          {placed.name}, bu dizayn nümayişidir — real sifariş yaradılmadı, ödəniş götürülmədi və sizinlə əlaqə saxlanılmayacaq.
        </p>
        <dl className="mt-6 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.95rem]">
          <dt className="text-muted">Nümayiş kodu</dt>
          <dd className="font-medium">{placed.number}</dd>
          <dt className="text-muted">Telefon</dt>
          <dd>{placed.phone}</dd>
          <dt className="text-muted">Məhsul sayı</dt>
          <dd>{placed.lines.reduce((s, l) => s + l.qty, 0)}</dd>
          {placed.wrapped && (
            <>
              <dt className="text-muted">Qablaşdırma</dt>
              <dd>Hədiyyə qablaşdırması</dd>
            </>
          )}
          <dt className="text-muted">Cəmi</dt>
          <dd className="font-medium">{formatAZN(placed.total)}</dd>
        </dl>
        {placed.message && (
          <div className="mt-8">
            <p className="text-sm text-muted">Hədiyyə kartı</p>
            <div className="mt-3">
              <GiftCardPreview message={placed.message} />
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/kataloq" className="btn btn-primary">
            Alış-verişə davam et
          </Link>
          <Link href="/" className="btn btn-ghost">
            Ana səhifə
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mt-10 rounded-sm bg-linen px-6 py-20 text-center md:py-28">
        <p className="t-h2">Sifariş üçün məhsul yoxdur</p>
        <p className="mx-auto mt-3 max-w-[40ch] text-muted">Əvvəlcə səbətə məhsul əlavə edin.</p>
        <Link href="/kataloq" className="btn btn-primary mt-8">
          Kataloqa keç
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1fr_26rem] xl:gap-20">
      <form onSubmit={submit} noValidate className="space-y-12">
        <div className="flex gap-3 border border-sand bg-champagne/30 p-4 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
          <p>
            <strong className="font-medium">Nümayiş rejimi.</strong> Bu forma real sifariş yaratmır və kart ödənişi götürmür.
          </p>
        </div>

        <fieldset>
          <legend className="t-h3">Əlaqə məlumatları</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Ad" error={show("name")}>
              <input id="name" autoComplete="given-name" value={values.name} className="field" {...aria("name")} />
            </Field>
            <Field id="surname" label="Soyad" error={show("surname")}>
              <input id="surname" autoComplete="family-name" value={values.surname} className="field" {...aria("surname")} />
            </Field>
            <Field id="phone" label="Mobil nömrə" error={show("phone")} hint="Operator kodu ilə: 050, 051, 055, 070, 077, 099">
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+994 50 123 45 67"
                value={values.phone}
                className="field"
                {...aria("phone")}
              />
            </Field>
            <Field id="email" label="E-poçt (könüllü)" error={show("email")}>
              <input id="email" type="email" autoComplete="email" value={values.email} className="field" {...aria("email")} />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="t-h3">Çatdırılma</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="region" label="Şəhər / rayon">
              <select id="region" value={values.region} onChange={set("region")} className="field">
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <div className="hidden sm:block" />
            <div className="sm:col-span-2">
              <Field id="address" label="Ünvan" error={show("address")}>
                <input id="address" autoComplete="street-address" value={values.address} className="field" {...aria("address")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="note" label="Kuryer üçün qeyd (könüllü)">
                <textarea id="note" rows={3} value={values.note} onChange={set("note")} className="field" />
              </Field>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="t-h3">Ödəniş</legend>
          <div className="mt-5 space-y-3">
            <label className="flex min-h-14 cursor-pointer items-center gap-3 border border-cocoa px-4">
              <input type="radio" name="pay" defaultChecked className="h-4 w-4 accent-[#7b1d3a]" />
              Çatdırılma zamanı nağd ödəniş
            </label>
            <label className="flex min-h-14 items-center justify-between gap-3 border border-line px-4 text-muted" aria-disabled="true">
              <span className="flex items-center gap-3">
                <input type="radio" name="pay" disabled className="h-4 w-4" />
                Bank kartı ilə onlayn ödəniş
              </span>
              <span className="text-xs">növbəti mərhələdə</span>
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-72">
          Nümayiş sifarişini göndər
        </button>
      </form>

      <aside className="bg-linen p-6 lg:sticky lg:top-28 md:p-8" aria-label="Sifarişin xülasəsi">
        <h2 className="t-h3">Sifariş</h2>
        <ul className="mt-5 divide-y divide-sand/60">
          {cart.map((line) => {
            const p = getProductById(line.id);
            if (!p) return null;
            const pr = priceFor(p, line.option);
            return (
              <li key={`${line.id}|${line.option ?? ""}`} className="flex gap-3 py-3">
                <span className="block w-14 shrink-0 overflow-hidden">
                  <ProductArt kind={p.kind} tone={p.tone} metal={p.metal} label="" className="aspect-[4/5] w-full" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-medium leading-snug">{p.title}</span>
                  <span className="text-muted">
                    {line.option ? `${line.option} · ` : ""}
                    {line.qty} ədəd
                  </span>
                </span>
                <span className="text-sm font-medium">{formatAZN(pr.current * line.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-4 space-y-2.5 border-t border-sand pt-4 text-[0.95rem]">
          <div className="flex justify-between">
            <dt>Ara cəm</dt>
            <dd>{formatAZN(subtotal)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-garnet-bright">
              <dt>Qənaət</dt>
              <dd>{formatAZN(savings)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Çatdırılma</dt>
            <dd>{delivery === 0 ? "Pulsuz" : formatAZN(delivery)}</dd>
          </div>
          {fee > 0 && (
            <div className="flex justify-between">
              <dt>Hədiyyə qablaşdırması</dt>
              <dd>{formatAZN(fee)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-sand pt-3 text-lg font-medium">
            <dt>Cəmi</dt>
            <dd className="text-2xl">{formatAZN(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
