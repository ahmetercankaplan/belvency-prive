import { categories } from "../src/data/categories.ts";
import {
  COOKIE,
  createSession,
  rateLimit,
  requireAdmin,
  sessionCookie,
  verifyPassword,
  checkSession,
  readCookie,
} from "./auth.ts";
import {
  deleteBrand,
  deleteProduct,
  listBrands,
  listProducts,
  saveBrand,
  saveProduct,
} from "./catalog.ts";
import { HttpError, assertSameOrigin, clientIp, fail, json, randomId, readJson, str, type Env } from "./http.ts";
import { createOrder, listOrders, updateOrder, ORDER_STATUSES } from "./orders.ts";
import { openStore, type Store } from "./store.ts";

export interface Deps {
  store?: Store;
  env?: Env;
  fetch?: typeof fetch;
  now?: () => Date;
}

const IMAGE_MAX_BYTES = 900_000;

function detectImage(buf: Buffer): string | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length > 12 && buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "image/webp";
  return null;
}

export async function handle(req: Request, deps: Deps = {}): Promise<Response> {
  const env = deps.env ?? (process.env as Env);
  const now = deps.now ?? (() => new Date());
  const fetchImpl = deps.fetch ?? fetch;
  try {
    const store = deps.store ?? (await openStore(env));
    return await route(req, { store, env, now, fetchImpl });
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, { status: e.status });
    console.error("API xətası:", e);
    return json({ error: "Gözlənilməz xəta baş verdi. Bir az sonra yenidən cəhd edin." }, { status: 500 });
  }
}

interface Ctx {
  store: Store;
  env: Env;
  now: () => Date;
  fetchImpl: typeof fetch;
}

async function route(req: Request, ctx: Ctx): Promise<Response> {
  const { store, env } = ctx;
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/(\.netlify\/functions\/api|api)\/?/, "").split("/").filter(Boolean);
  const method = req.method.toUpperCase();
  const [a, b, c] = parts;
  const mutating = method !== "GET" && method !== "HEAD";

  /* ───────── public ───────── */
  if (a === "catalog" && method === "GET") {
    const [products, brands] = await Promise.all([listProducts(store), listBrands(store)]);
    const pub = products.filter((p) => p.active).map((p) => {
      const copy: Record<string, unknown> = { ...p };
      delete copy.active;
      delete copy.createdAt;
      delete copy.updatedAt;
      return copy;
    });
    return json({ products: pub, brands }, { headers: { "cache-control": "public, max-age=30" } });
  }

  if (a === "image" && b && method === "GET") {
    if (!/^[a-f0-9]{12}$/.test(b)) fail(404, "Tapılmadı");
    const img = await store.get<{ ct: string; b64: string }>(`image/${b}`);
    if (!img) fail(404, "Tapılmadı");
    return new Response(Buffer.from(img.b64, "base64"), {
      headers: { "content-type": img.ct, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" },
    });
  }

  if (a === "orders" && !b && method === "POST") {
    assertSameOrigin(req);
    if (!(await rateLimit(store, `order/${clientIp(req)}`, 6, 600, ctx.now().getTime()))) {
      fail(429, "Çox sayda sorğu göndərildi. Bir neçə dəqiqə sonra yenidən cəhd edin.");
    }
    const order = await createOrder(store, await readJson(req, 20_000), env, ctx.fetchImpl, ctx.now());
    return json(
      { id: order.id, total: order.pricing.total, pricing: order.pricing, status: order.status },
      { status: 201 },
    );
  }

  /* ───────── auth ───────── */
  if (a === "auth") {
    if (b === "login" && method === "POST") {
      assertSameOrigin(req);
      const stored = env.ADMIN_PASSWORD_HASH;
      const secret = env.SESSION_SECRET;
      if (!stored || !secret || secret.length < 24) fail(500, "Server düzgün qurulmayıb");
      if (!(await rateLimit(store, `login/${clientIp(req)}`, 8, 900, ctx.now().getTime()))) {
        fail(429, "Çox sayda uğursuz cəhd. 15 dəqiqə sonra yenidən cəhd edin.");
      }
      const body = await readJson(req, 2_000);
      const ok = await verifyPassword(str(body.password, "Parol", { min: 1, max: 200 }), stored);
      if (!ok) fail(401, "Parol yanlışdır");
      return json({ ok: true }, { headers: { "set-cookie": sessionCookie(req, createSession(secret, ctx.now().getTime())) } });
    }
    if (b === "logout" && method === "POST") {
      assertSameOrigin(req);
      return json({ ok: true }, { headers: { "set-cookie": sessionCookie(req, "", 0) } });
    }
    if (b === "me" && method === "GET") {
      const secret = env.SESSION_SECRET ?? "";
      return json({ admin: secret.length >= 24 && checkSession(readCookie(req, COOKIE), secret, ctx.now().getTime()) });
    }
    fail(404, "Tapılmadı");
  }

  /* ───────── admin (cookie session) ───────── */
  if (a === "admin") {
    requireAdmin(req, env, ctx.now().getTime());
    if (mutating) assertSameOrigin(req);

    if (b === "summary" && method === "GET") {
      const [orders, products] = await Promise.all([listOrders(store), listProducts(store)]);
      const today = ctx.now().toISOString().slice(0, 10);
      const live = orders.filter((o) => o.status !== "legv");
      type Low = { id: string; title: string; option?: string; stock: number };
      const lowStock = products
        .filter((p) => p.active)
        .flatMap((p): Low[] =>
          p.option
            ? p.option.values.filter((v) => (v.stock ?? 0) <= 3).map((v) => ({ id: p.id, title: p.title, option: v.name, stock: v.stock ?? 0 }))
            : (p.stock ?? 0) <= 3
              ? [{ id: p.id, title: p.title, option: undefined, stock: p.stock ?? 0 }]
              : [],
        );
      return json({
        orders: { total: orders.length, new: orders.filter((o) => o.status === "yeni").length, today: orders.filter((o) => o.createdAt.startsWith(today)).length },
        revenue: Math.round(live.reduce((s, o) => s + o.pricing.total, 0) * 100) / 100,
        revenueToday: Math.round(live.filter((o) => o.createdAt.startsWith(today)).reduce((s, o) => s + o.pricing.total, 0) * 100) / 100,
        products: { total: products.length, active: products.filter((p) => p.active).length },
        lowStock,
        unnotified: orders.filter((o) => !o.notified).length,
        telegram: !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
        publishConfigured: !!env.BUILD_HOOK_URL,
      });
    }

    if (b === "products") {
      if (!c && method === "GET") return json({ products: await listProducts(store), categories: categories.map(({ slug, title, group }) => ({ slug, title, group })) });
      if (!c && method === "POST") return json({ product: await saveProduct(store, await readJson(req, 60_000)) }, { status: 201 });
      if (c && method === "PUT") return json({ product: await saveProduct(store, await readJson(req, 60_000), c) });
      if (c && method === "DELETE") {
        await deleteProduct(store, c);
        return json({ ok: true });
      }
    }

    if (b === "brands") {
      if (!c && method === "GET") return json({ brands: await listBrands(store) });
      if (!c && method === "POST") return json({ brand: await saveBrand(store, await readJson(req)) }, { status: 201 });
      if (c && method === "PUT") return json({ brand: await saveBrand(store, await readJson(req), c) });
      if (c && method === "DELETE") {
        await deleteBrand(store, c);
        return json({ ok: true });
      }
    }

    if (b === "orders") {
      if (!c && method === "GET") return json({ orders: await listOrders(store), statuses: ORDER_STATUSES });
      if (c && method === "PATCH") return json({ order: await updateOrder(store, c, await readJson(req), ctx.now()) });
    }

    if (b === "images" && method === "POST") {
      const body = await readJson(req, 1_500_000);
      const m = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(body.dataUrl ?? ""));
      if (!m) fail(400, "Şəkil formatı yanlışdır (JPEG, PNG və ya WebP)");
      const buf = Buffer.from(m[1], "base64");
      if (buf.length > IMAGE_MAX_BYTES) fail(413, "Şəkil çox böyükdür (maksimum ~900 KB)");
      const ct = detectImage(buf);
      if (!ct) fail(400, "Fayl şəkil deyil");
      const id = randomId("", 6);
      await store.set(`image/${id}`, { ct, b64: buf.toString("base64"), size: buf.length, createdAt: ctx.now().toISOString() });
      return json({ url: `/api/image/${id}` }, { status: 201 });
    }

    if (b === "publish" && method === "POST") {
      if (!env.BUILD_HOOK_URL) fail(501, "Dərc etmə (build hook) hələ təyin olunmayıb");
      const res = await ctx.fetchImpl(env.BUILD_HOOK_URL, { method: "POST" });
      if (!res.ok) fail(502, "Dərc etmə başladıla bilmədi");
      return json({ ok: true });
    }
  }

  fail(404, "Tapılmadı");
}
