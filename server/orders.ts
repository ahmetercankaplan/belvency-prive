import { regions, site } from "../src/data/site.ts";
import { formatAZN, formatAzPhone, parseAzPhone } from "../src/lib/format.ts";
import { hasStock, priceFor, unitsAvailable } from "../src/lib/pricing.ts";
import { productKey, type StoredProduct } from "./catalog.ts";
import { fail, num, oneOf, str, type Env } from "./http.ts";
import type { Store } from "./store.ts";
import { notifyTelegram } from "./telegram.ts";

export const ORDER_STATUSES = ["yeni", "tesdiqlendi", "gonderildi", "catdirildi", "legv"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const PAYMENT_METHODS = ["cod", "transfer", "card"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const statusLabels: Record<OrderStatus, string> = {
  yeni: "Yeni",
  tesdiqlendi: "Təsdiqləndi",
  gonderildi: "Göndərildi",
  catdirildi: "Çatdırıldı",
  legv: "Ləğv edildi",
};
export const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Çatdırılmada nağd",
  transfer: "Bank köçürməsi",
  card: "Bank kartı",
};

export interface OrderLine {
  productId: string;
  title: string;
  option?: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; surname: string; phone: string; email: string; region: string; address: string; note: string };
  lines: OrderLine[];
  pricing: { subtotal: number; delivery: number; giftFee: number; total: number };
  gift: { wrap: boolean; message: string };
  payment: { method: PaymentMethod; status: "gozlenir" | "odenilib" };
  adminNote: string;
  notified: boolean;
  history: { at: string; status: OrderStatus }[];
}

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const orderKey = (id: string) => `order/${id}`;

function newOrderId(now: Date) {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rnd = crypto.getRandomValues(new Uint8Array(4));
  return `BM-${d}-${Array.from(rnd, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join("")}`;
}

/** Takes `qty` units out of stock if (and only if) they are still available. */
export async function reserve(store: Store, id: string, option: string | undefined, qty: number): Promise<boolean> {
  let ok = false;
  await store.update<StoredProduct>(productKey(id), (cur) => {
    ok = false;
    if (!cur || !cur.active) return cur;
    if (unitsAvailable(cur, option) < qty) return cur;
    const next = structuredClone(cur);
    if (next.option) {
      const v = next.option.values.find((x) => x.name === option);
      if (v && v.stock !== undefined) v.stock -= qty;
    } else if (next.stock !== undefined) {
      next.stock -= qty;
    }
    next.inStock = hasStock(next);
    ok = true;
    return next;
  });
  return ok;
}

export async function release(store: Store, id: string, option: string | undefined, qty: number) {
  await store.update<StoredProduct>(productKey(id), (cur) => {
    if (!cur) return cur;
    const next = structuredClone(cur);
    if (next.option) {
      const v = next.option.values.find((x) => x.name === option);
      if (v && v.stock !== undefined) v.stock += qty;
    } else if (next.stock !== undefined) {
      next.stock += qty;
    }
    next.inStock = hasStock(next);
    return next;
  });
}

interface OrderInput {
  lines: { id: string; option?: string; qty: number }[];
  customer: Order["customer"];
  gift: Order["gift"];
  method: PaymentMethod;
}

export function parseOrderInput(raw: Record<string, unknown>, env: Env): OrderInput {
  if (typeof raw.website === "string" && raw.website.trim() !== "") fail(400, "Sorğu qəbul edilmədi");

  if (!Array.isArray(raw.lines) || raw.lines.length < 1 || raw.lines.length > 12) fail(400, "Səbət boşdur və ya çox böyükdür");
  const seen = new Set<string>();
  const lines = raw.lines.map((l) => {
    const r = (l ?? {}) as Record<string, unknown>;
    const id = str(r.id, "Məhsul", { min: 1, max: 40 });
    const option = r.option === undefined || r.option === null || r.option === "" ? undefined : str(r.option, "Seçim", { max: 40 });
    const key = `${id}|${option ?? ""}`;
    if (seen.has(key)) fail(400, "Eyni məhsul səbətdə təkrarlanır");
    seen.add(key);
    return { id, option, qty: num(r.qty, "Say", { min: 1, max: 10, int: true }) };
  });

  const c = (raw.customer ?? {}) as Record<string, unknown>;
  const phone = parseAzPhone(str(c.phone, "Telefon", { min: 1, max: 30 }));
  if (!phone) fail(400, "Telefon nömrəsi düzgün deyil (məsələn: 050 123 45 67)");
  const email = str(c.email, "E-poçt", { max: 120, optional: true });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail(400, "E-poçt ünvanı düzgün deyil");
  const region = str(c.region, "Şəhər / rayon", { min: 1, max: 40 });
  if (!regions.includes(region)) fail(400, "Şəhər / rayon yanlışdır");

  const g = (raw.gift ?? {}) as Record<string, unknown>;
  const message = str(g.message, "Kart mesajı", { max: site.giftMessageMax, optional: true });

  const allowed = PAYMENT_METHODS.filter((m) => m !== "card" || env.CARD_PAYMENTS === "on");
  return {
    lines,
    customer: {
      name: str(c.name, "Ad", { min: 2, max: 60 }),
      surname: str(c.surname, "Soyad", { min: 2, max: 60 }),
      phone: formatAzPhone(phone),
      email,
      region,
      address: str(c.address, "Ünvan", { min: 8, max: 240 }),
      note: str(c.note, "Qeyd", { max: 300, optional: true }),
    },
    gift: { wrap: g.wrap === true, message },
    method: oneOf(raw.method, "Ödəniş üsulu", allowed),
  };
}

export function orderToText(o: Order): string {
  const head = [
    `🛍 Yeni sifariş ${o.id}`,
    `${o.customer.name} ${o.customer.surname} · ${o.customer.phone}`,
    `${o.customer.region}, ${o.customer.address}`,
    o.customer.note ? `Qeyd: ${o.customer.note}` : "",
  ].filter(Boolean);
  const items = o.lines.map((l) => `• ${l.title}${l.option ? ` (${l.option})` : ""} × ${l.qty} — ${formatAZN(l.unitPrice * l.qty)}`);
  const totals = [
    `Məhsullar: ${formatAZN(o.pricing.subtotal)}`,
    `Çatdırılma: ${o.pricing.delivery === 0 ? "pulsuz" : formatAZN(o.pricing.delivery)}`,
    o.pricing.giftFee ? `Hədiyyə qablaşdırması: ${formatAZN(o.pricing.giftFee)}` : "",
    `CƏMİ: ${formatAZN(o.pricing.total)}`,
    `Ödəniş: ${paymentLabels[o.payment.method]}`,
    o.gift.message ? `Kart mesajı: “${o.gift.message}”` : "",
  ].filter(Boolean);
  return [head.join("\n"), items.join("\n"), totals.join("\n")].join("\n\n");
}

export async function createOrder(
  store: Store,
  raw: Record<string, unknown>,
  env: Env,
  fetchImpl: typeof fetch = fetch,
  now = new Date(),
): Promise<Order> {
  const input = parseOrderInput(raw, env);

  // authoritative prices and stock come from the store, never from the browser
  const priced: OrderLine[] = [];
  for (const l of input.lines) {
    const p = await store.get<StoredProduct>(productKey(l.id));
    if (!p || !p.active) fail(409, "Səbətdəki məhsullardan biri artıq satışda deyil. Səbəti yeniləyin.");
    if (p.option && !p.option.values.some((v) => v.name === l.option)) fail(400, `“${p.title}” üçün seçim yanlışdır`);
    priced.push({ productId: p.id, title: p.title, option: l.option, qty: l.qty, unitPrice: priceFor(p, l.option).current });
  }

  const reserved: OrderLine[] = [];
  try {
    for (const l of priced) {
      if (!(await reserve(store, l.productId, l.option, l.qty))) {
        fail(409, `“${l.title}${l.option ? ` (${l.option})` : ""}” üçün kifayət qədər stok yoxdur`);
      }
      reserved.push(l);
    }

    const subtotal = Math.round(priced.reduce((s, l) => s + l.unitPrice * l.qty, 0) * 100) / 100;
    const base = input.customer.region === "Bakı" ? site.bakuDeliveryFee : site.regionDeliveryFee;
    const delivery = subtotal >= site.freeDeliveryFrom ? 0 : base;
    const giftFee = input.gift.wrap ? site.giftWrapFee : 0;

    const order: Order = {
      id: "",
      createdAt: now.toISOString(),
      status: "yeni",
      customer: input.customer,
      lines: priced,
      pricing: { subtotal, delivery, giftFee, total: Math.round((subtotal + delivery + giftFee) * 100) / 100 },
      gift: input.gift,
      payment: { method: input.method, status: "gozlenir" },
      adminNote: "",
      notified: false,
      history: [{ at: now.toISOString(), status: "yeni" }],
    };

    let saved = false;
    for (let i = 0; i < 6 && !saved; i++) {
      order.id = newOrderId(now);
      await store.update<Order>(orderKey(order.id), (cur) => {
        saved = !cur;
        return cur ?? order;
      });
    }
    if (!saved) fail(500, "Sifariş nömrəsi yaradıla bilmədi, yenidən cəhd edin");

    const res = await notifyTelegram(env, orderToText(order), fetchImpl);
    if (res.sent) {
      order.notified = true;
      await store.set(orderKey(order.id), order);
    }
    return order;
  } catch (e) {
    for (const l of reserved) await release(store, l.productId, l.option, l.qty).catch(() => undefined);
    throw e;
  }
}

export async function listOrders(store: Store): Promise<Order[]> {
  const keys = await store.keys("order/");
  const all = await Promise.all(keys.map((k) => store.get<Order>(k)));
  return all.filter((o): o is Order => !!o).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 500);
}

export async function updateOrder(
  store: Store,
  id: string,
  patch: Record<string, unknown>,
  now = new Date(),
): Promise<Order> {
  const current = await store.get<Order>(orderKey(id));
  if (!current) fail(404, "Sifariş tapılmadı");

  const status = patch.status === undefined ? current.status : oneOf(patch.status, "Status", ORDER_STATUSES);
  if (current.status === "legv" && status !== "legv") fail(409, "Ləğv edilmiş sifariş bərpa oluna bilməz");
  const adminNote = patch.adminNote === undefined ? current.adminNote : str(patch.adminNote, "Qeyd", { max: 500, optional: true });
  const paymentStatus =
    patch.paymentStatus === undefined ? current.payment.status : oneOf(patch.paymentStatus, "Ödəniş statusu", ["gozlenir", "odenilib"] as const);

  const next: Order = {
    ...current,
    status,
    adminNote,
    payment: { ...current.payment, status: paymentStatus },
    history: status === current.status ? current.history : [...current.history, { at: now.toISOString(), status }],
  };
  await store.set(orderKey(id), next);

  if (status === "legv" && current.status !== "legv") {
    for (const l of current.lines) await release(store, l.productId, l.option, l.qty);
  }
  return next;
}

