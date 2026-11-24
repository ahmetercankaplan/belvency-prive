import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { handle } from "./api.ts";
import { hashPassword } from "./auth.ts";
import { FileStore } from "./store.ts";
import type { Env } from "./http.ts";

const ORIGIN = "http://shop.test";
const PASSWORD = "correct-horse-battery";

let dir: string;
let store: FileStore;
let env: Env;
let cookie = "";
const sent: { url: string; text: string }[] = [];

const fakeFetch = (async (url: string | URL | Request, init?: RequestInit) => {
  const body = JSON.parse(String(init?.body ?? "{}"));
  sent.push({ url: String(url), text: body.text });
  return new Response("{}", { status: 200 });
}) as typeof fetch;

async function call(method: string, p: string, body?: unknown, o: { cookie?: string | null; origin?: string | null; ip?: string; env?: Env } = {}) {
  const headers: Record<string, string> = { "x-nf-client-connection-ip": o.ip ?? "1.1.1.1" };
  if (body !== undefined) headers["content-type"] = "application/json";
  const origin = o.origin === undefined ? ORIGIN : o.origin;
  if (origin) headers.origin = origin;
  const c = o.cookie === undefined ? cookie : o.cookie;
  if (c) headers.cookie = c;
  const res = await handle(new Request(`${ORIGIN}${p}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), {
    store,
    env: o.env ?? env,
    fetch: fakeFetch,
    now: () => new Date("2026-11-20T10:00:00Z"),
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* binary */
  }
  return { status: res.status, data, res, text };
}

const customer = { name: "Aysel", surname: "Məmmədova", phone: "050 123 45 67", email: "", region: "Bakı", address: "Nizami küç. 10, m. 5", note: "" };

before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "belvency-"));
  store = new FileStore(dir);
  env = {
    ADMIN_PASSWORD_HASH: await hashPassword(PASSWORD),
    SESSION_SECRET: "x".repeat(40),
    TELEGRAM_BOT_TOKEN: "123:abc",
    TELEGRAM_CHAT_ID: "999",
  };
});
after(() => rm(dir, { recursive: true, force: true }));

describe("auth", () => {
  it("rejects admin routes without a session", async () => {
    assert.equal((await call("GET", "/api/admin/summary", undefined, { cookie: null })).status, 401);
  });

  it("refuses login from a foreign or missing origin (CSRF)", async () => {
    assert.equal((await call("POST", "/api/auth/login", { password: PASSWORD }, { origin: "http://evil.test", ip: "9.9.9.1" })).status, 403);
    assert.equal((await call("POST", "/api/auth/login", { password: PASSWORD }, { origin: null, ip: "9.9.9.1" })).status, 403);
  });

  it("rejects a wrong password, accepts the right one and sets a hardened cookie", async () => {
    assert.equal((await call("POST", "/api/auth/login", { password: "nope" }, { ip: "9.9.9.2" })).status, 401);
    const ok = await call("POST", "/api/auth/login", { password: PASSWORD }, { ip: "9.9.9.2" });
    assert.equal(ok.status, 200);
    const set = ok.res.headers.get("set-cookie") ?? "";
    assert.match(set, /HttpOnly/);
    assert.match(set, /SameSite=Strict/);
    cookie = set.split(";")[0];
    assert.equal((await call("GET", "/api/auth/me")).data.admin, true);
    assert.equal((await call("GET", "/api/auth/me", undefined, { cookie: null })).data.admin, false);
  });

  it("rejects a tampered or expired session", async () => {
    const forged = cookie.slice(0, -3) + "AAA";
    assert.equal((await call("GET", "/api/admin/summary", undefined, { cookie: forged })).status, 401);
  });

  it("rate-limits repeated login attempts", async () => {
    let last = 0;
    for (let i = 0; i < 10; i++) last = (await call("POST", "/api/auth/login", { password: "bad" }, { ip: "7.7.7.7" })).status;
    assert.equal(last, 429);
  });

  it("refuses to run when the server is not configured", async () => {
    const bad = await call("POST", "/api/auth/login", { password: PASSWORD }, { env: {}, ip: "9.9.9.3" });
    assert.equal(bad.status, 500);
  });
});

describe("catalog admin", () => {
  it("creates a brand and validates products", async () => {
    assert.equal((await call("POST", "/api/admin/brands", { name: "Test Brend", specialty: "Ətir" })).status, 201);
    assert.equal((await call("POST", "/api/admin/brands", { name: "Test Brend" })).status, 409);

    const base = { title: "Test ətir", brandSlug: "test-brend", category: "etirler", gender: "qadin", price: 100, stock: 5, description: "Sınaq" };
    assert.equal((await call("POST", "/api/admin/products", { ...base, brandSlug: "yoxdur" })).status, 400);
    assert.equal((await call("POST", "/api/admin/products", { ...base, salePrice: 120 })).status, 400);
    assert.equal((await call("POST", "/api/admin/products", { ...base, stock: -1 })).status, 400);
    assert.equal((await call("POST", "/api/admin/products", { ...base, category: "x" })).status, 400);
    assert.equal((await call("POST", "/api/admin/products", { ...base, images: ["javascript:alert(1)"] })).status, 400);
    assert.equal((await call("POST", "/api/admin/products", { ...base, price: 0 })).status, 400);

    const ok = await call("POST", "/api/admin/products", base);
    assert.equal(ok.status, 201);
    assert.equal(ok.data.product.slug, "test-etir");
    assert.equal(ok.data.product.inStock, true);
    assert.equal((await call("POST", "/api/admin/products", base)).status, 409, "duplicate slug");
  });

  it("public catalog hides admin-only fields and inactive products", async () => {
    const created = await call("POST", "/api/admin/products", {
      title: "Gizli məhsul", brandSlug: "test-brend", category: "etirler", gender: "kisi", price: 50, stock: 1, active: false,
    });
    assert.equal(created.status, 201);
    const cat = await call("GET", "/api/catalog", undefined, { cookie: null });
    assert.equal(cat.status, 200);
    const titles = cat.data.products.map((p: any) => p.title);
    assert.ok(titles.includes("Test ətir"));
    assert.ok(!titles.includes("Gizli məhsul"));
    for (const p of cat.data.products) assert.ok(!("active" in p) && !("createdAt" in p));
    assert.equal(cat.data.brands[0].slug, "test-brend");
  });

  it("stores variant stock and derives inStock", async () => {
    const r = await call("POST", "/api/admin/products", {
      title: "Üzük", brandSlug: "test-brend", category: "uzukler", gender: "qadin", price: 200,
      option: { label: "Ölçü", values: [{ name: "16", stock: 0 }, { name: "17", stock: 2, price: 220 }] },
    });
    assert.equal(r.status, 201);
    assert.equal(r.data.product.inStock, true);
    const none = await call("POST", "/api/admin/products", {
      title: "Boş üzük", brandSlug: "test-brend", category: "uzukler", gender: "qadin", price: 200,
      option: { label: "Ölçü", values: [{ name: "16", stock: 0 }] },
    });
    assert.equal(none.data.product.inStock, false);
    assert.equal((await call("POST", "/api/admin/products", { title: "Təkrar", brandSlug: "test-brend", category: "uzukler", gender: "qadin", price: 1, option: { label: "Ölçü", values: [{ name: "16", stock: 1 }, { name: "16", stock: 1 }] } })).status, 400);
  });

  it("will not delete a brand that still has products", async () => {
    assert.equal((await call("DELETE", "/api/admin/brands/test-brend")).status, 409);
  });
});

describe("images", () => {
  const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16]), Buffer.alloc(40, 1)]);

  it("stores a real image and serves it with long-lived caching", async () => {
    const up = await call("POST", "/api/admin/images", { dataUrl: `data:image/jpeg;base64,${jpeg.toString("base64")}` });
    assert.equal(up.status, 201);
    assert.match(up.data.url, /^\/api\/image\/[a-f0-9]{12}$/);
    const got = await call("GET", up.data.url, undefined, { cookie: null });
    assert.equal(got.status, 200);
    assert.equal(got.res.headers.get("content-type"), "image/jpeg");
    assert.match(got.res.headers.get("cache-control") ?? "", /immutable/);
  });

  it("rejects non-images, oversized files and anonymous uploads", async () => {
    const fake = Buffer.from("<script>alert(1)</script>".padEnd(40, " "));
    assert.equal((await call("POST", "/api/admin/images", { dataUrl: `data:image/jpeg;base64,${fake.toString("base64")}` })).status, 400);
    const big = Buffer.concat([jpeg, Buffer.alloc(950_000, 2)]);
    assert.equal((await call("POST", "/api/admin/images", { dataUrl: `data:image/jpeg;base64,${big.toString("base64")}` })).status, 413);
    assert.equal((await call("POST", "/api/admin/images", { dataUrl: "data:image/jpeg;base64,AAAA" }, { cookie: null })).status, 401);
    assert.equal((await call("GET", "/api/image/zzzzzzzzzzzz", undefined, { cookie: null })).status, 404);
  });
});

describe("orders", () => {
  let pid: string;
  let ringId: string;

  before(async () => {
    const list = await call("GET", "/api/admin/products");
    pid = list.data.products.find((p: any) => p.slug === "test-etir").id;
    ringId = list.data.products.find((p: any) => p.slug === "uzuk").id;
  });

  const place = (lines: unknown[], extra: Record<string, unknown> = {}, ip = "2.2.2.2") =>
    call("POST", "/api/orders", { lines, customer, gift: { wrap: false, message: "" }, method: "cod", ...extra }, { cookie: null, ip });

  it("computes totals on the server and ignores client-sent prices", async () => {
    const r = await place([{ id: pid, qty: 2, price: 0.01, unitPrice: 1 }], { total: 1 });
    assert.equal(r.status, 201);
    assert.equal(r.data.pricing.subtotal, 200);
    assert.equal(r.data.pricing.delivery, 0, "free over the threshold");
    assert.equal(r.data.total, 200);
    assert.match(r.data.id, /^BM-261120-[A-Z0-9]{4}$/);
  });

  it("charges delivery by region and adds the gift fee", async () => {
    const baku = await place([{ id: pid, qty: 1 }], { gift: { wrap: true, message: "Ad günün mübarək!" } }, "2.2.2.3");
    assert.deepEqual(baku.data.pricing, { subtotal: 100, delivery: 5, giftFee: 4, total: 109 });
    const rayon = await place([{ id: pid, qty: 1 }], { customer: { ...customer, region: "Gəncə" } }, "2.2.2.4");
    assert.equal(rayon.data.pricing.delivery, 8);
  });

  it("applies variant pricing and notifies Telegram with the order details", async () => {
    sent.length = 0;
    const r = await place([{ id: ringId, option: "17", qty: 1 }], {}, "2.2.2.5");
    assert.equal(r.status, 201);
    assert.equal(r.data.pricing.subtotal, 220);
    assert.equal(sent.length, 1);
    assert.match(sent[0].url, /api\.telegram\.org\/bot123:abc\/sendMessage/);
    assert.match(sent[0].text, new RegExp(r.data.id));
    assert.match(sent[0].text, /Aysel Məmmədova/);
    assert.match(sent[0].text, /\+994 50 123 45 67/);
    assert.match(sent[0].text, /Üzük/);
  });

  it("still saves the order when Telegram is not configured", async () => {
    const r = await call("POST", "/api/orders", { lines: [{ id: pid, qty: 1 }], customer, gift: { wrap: false, message: "" }, method: "cod" }, { cookie: null, ip: "2.2.2.6", env: { ...env, TELEGRAM_BOT_TOKEN: undefined } });
    assert.equal(r.status, 201);
    const orders = await call("GET", "/api/admin/orders");
    assert.equal(orders.data.orders.find((o: any) => o.id === r.data.id).notified, false);
  });

  it("validates the customer and blocks bots and the card method", async () => {
    assert.equal((await place([{ id: pid, qty: 1 }], { customer: { ...customer, phone: "123" } }, "3.3.3.1")).status, 400);
    assert.equal((await place([{ id: pid, qty: 1 }], { customer: { ...customer, region: "Mars" } }, "3.3.3.2")).status, 400);
    assert.equal((await place([{ id: pid, qty: 1 }], { website: "http://spam" }, "3.3.3.3")).status, 400);
    assert.equal((await place([{ id: pid, qty: 1 }], { method: "card" }, "3.3.3.4")).status, 400, "card is off until a gateway exists");
    assert.equal((await place([], {}, "3.3.3.5")).status, 400);
    assert.equal((await place([{ id: pid, qty: 99 }], {}, "3.3.3.6")).status, 400);
    assert.equal((await place([{ id: "nope", qty: 1 }], {}, "3.3.3.7")).status, 409);
    assert.equal((await call("POST", "/api/orders", { lines: [{ id: pid, qty: 1 }], customer, method: "cod" }, { cookie: null, origin: "http://evil.test", ip: "3.3.3.8" })).status, 403);
  });

  it("checks stock, decrements it, and rolls back partial reservations", async () => {
    const before = (await call("GET", "/api/admin/products")).data.products;
    const stockOf = (slug: string) => before.find((p: any) => p.slug === slug).stock;
    const startStock = stockOf("test-etir");

    // first line fits, second does not → nothing may stay reserved
    const r = await place([{ id: pid, qty: 1 }, { id: ringId, option: "16", qty: 1 }], {}, "4.4.4.1");
    assert.equal(r.status, 409);
    assert.match(r.data.error, /stok yoxdur/);
    const after = (await call("GET", "/api/admin/products")).data.products;
    assert.equal(after.find((p: any) => p.slug === "test-etir").stock, startStock, "first reservation was rolled back");
  });

  it("never oversells under concurrent orders", async () => {
    const p = await call("POST", "/api/admin/products", { title: "Son 3", brandSlug: "test-brend", category: "etirler", gender: "qadin", price: 10, stock: 3 });
    const id = p.data.product.id;
    const results = await Promise.all(Array.from({ length: 10 }, (_, i) => place([{ id, qty: 1 }], {}, `5.5.5.${i}`)));
    assert.equal(results.filter((r) => r.status === 201).length, 3);
    assert.equal(results.filter((r) => r.status === 409).length, 7);
    const final = (await call("GET", "/api/admin/products")).data.products.find((x: any) => x.id === id);
    assert.equal(final.stock, 0);
    assert.equal(final.inStock, false);
  });

  it("rate-limits a single address", async () => {
    let last = 0;
    for (let i = 0; i < 8; i++) last = (await place([{ id: pid, qty: 1 }], {}, "6.6.6.6")).status;
    assert.equal(last, 429);
  });
});

describe("order management", () => {
  it("updates status with history and restores stock on cancellation", async () => {
    const made = await call("POST", "/api/admin/products", { title: "İdarə testi", brandSlug: "test-brend", category: "etirler", gender: "qadin", price: 40, stock: 10 });
    const id = made.data.product.id;
    const stock0 = 10;

    const placed = await call("POST", "/api/orders", { lines: [{ id, qty: 2 }], customer, gift: { wrap: false, message: "" }, method: "transfer" }, { cookie: null, ip: "8.8.8.8" });
    assert.equal(placed.status, 201);
    const mid = (await call("GET", "/api/admin/products")).data.products.find((p: any) => p.id === id).stock;
    assert.equal(mid, stock0 - 2);

    const approved = await call("PATCH", `/api/admin/orders/${placed.data.id}`, { status: "tesdiqlendi", adminNote: "Zəng edildi" });
    assert.equal(approved.data.order.status, "tesdiqlendi");
    assert.equal(approved.data.order.history.length, 2);

    const cancelled = await call("PATCH", `/api/admin/orders/${placed.data.id}`, { status: "legv" });
    assert.equal(cancelled.data.order.status, "legv");
    const back = (await call("GET", "/api/admin/products")).data.products.find((p: any) => p.id === id).stock;
    assert.equal(back, stock0, "stock restored");

    assert.equal((await call("PATCH", `/api/admin/orders/${placed.data.id}`, { status: "yeni" })).status, 409, "cannot revive a cancelled order");
    assert.equal((await call("PATCH", `/api/admin/orders/${placed.data.id}`, { status: "hack" })).status, 400);
    assert.equal((await call("PATCH", "/api/admin/orders/BM-000000-XXXX", { status: "yeni" })).status, 404);
  });

  it("summarises the day for the dashboard", async () => {
    const s = (await call("GET", "/api/admin/summary")).data;
    assert.ok(s.orders.total >= 5);
    assert.ok(s.orders.today >= 5);
    assert.ok(s.revenue > 0);
    assert.equal(s.telegram, true);
    assert.ok(Array.isArray(s.lowStock));
    assert.ok(s.lowStock.some((x: any) => x.title === "Son 3"), "out-of-stock item is flagged");
  });

  it("cannot trigger publishing without a configured build hook", async () => {
    assert.equal((await call("POST", "/api/admin/publish", {})).status, 501);
    let hit = "";
    const hooked = { ...env, BUILD_HOOK_URL: "https://hooks.test/abc" };
    const res = await handle(new Request(`${ORIGIN}/api/admin/publish`, { method: "POST", headers: { origin: ORIGIN, cookie, "content-type": "application/json" }, body: "{}" }), {
      store, env: hooked, now: () => new Date("2026-11-20T10:00:00Z"), fetch: (async (u: string | URL | Request) => { hit = String(u); return new Response("ok"); }) as typeof fetch,
    });
    assert.equal(res.status, 200);
    assert.equal(hit, "https://hooks.test/abc");
  });
});
