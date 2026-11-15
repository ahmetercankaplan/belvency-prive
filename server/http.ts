export type Env = Record<string, string | undefined>;

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...(init.headers ?? {}) },
  });
}

export function fail(status: number, message: string): never {
  throw new HttpError(status, message);
}

export async function readJson(req: Request, maxBytes = 64_000): Promise<Record<string, unknown>> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) fail(415, "JSON formatı gözlənilir");
  const text = await req.text();
  if (text.length > maxBytes) fail(413, "Sorğu çox böyükdür");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    fail(400, "JSON oxunmadı");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) fail(400, "Obyekt gözlənilir");
  return parsed as Record<string, unknown>;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

export function isHttps(req: Request): boolean {
  return req.headers.get("x-forwarded-proto") === "https" || new URL(req.url).protocol === "https:";
}

/**
 * State-changing requests must come from our own pages (CSRF defence on top of SameSite=Strict).
 */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) fail(403, "Mənbə yoxlanıla bilmədi");
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return fail(403, "Mənbə yoxlanıla bilmədi");
  }
  const allowed = [req.headers.get("host"), req.headers.get("x-forwarded-host"), new URL(req.url).host].filter(Boolean);
  if (!allowed.includes(host)) fail(403, "Mənbə icazə verilmir");
}

/* ───────── tiny validators ───────── */

export function str(v: unknown, name: string, o: { min?: number; max?: number; optional?: boolean } = {}): string {
  const { min = 0, max = 200, optional = false } = o;
  if (v === undefined || v === null || v === "") {
    if (optional) return "";
    if (min === 0) return "";
    fail(400, `${name} boş ola bilməz`);
  }
  if (typeof v !== "string") fail(400, `${name} mətn olmalıdır`);
  const t = v.trim();
  if (t.length < min) fail(400, `${name} ən azı ${min} simvol olmalıdır`);
  if (t.length > max) fail(400, `${name} ən çox ${max} simvol ola bilər`);
  return t;
}

export function num(v: unknown, name: string, o: { min?: number; max?: number; int?: boolean } = {}): number {
  const { min = 0, max = 1_000_000, int = false } = o;
  if (typeof v !== "number" || !Number.isFinite(v)) fail(400, `${name} rəqəm olmalıdır`);
  if (int && !Number.isInteger(v)) fail(400, `${name} tam ədəd olmalıdır`);
  if (v < min || v > max) fail(400, `${name} ${min} ilə ${max} arasında olmalıdır`);
  return int ? v : Math.round(v * 100) / 100;
}

export function oneOf<T extends string>(v: unknown, name: string, allowed: readonly T[]): T {
  if (typeof v !== "string" || !allowed.includes(v as T)) fail(400, `${name} yanlışdır`);
  return v as T;
}

const AZ: Record<string, string> = { ə: "e", ı: "i", ö: "o", ü: "u", ç: "c", ş: "s", ğ: "g" };
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[əıöüçşğ]/g, (c) => AZ[c] ?? c)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function randomId(prefix: string, bytes = 6): string {
  const b = crypto.getRandomValues(new Uint8Array(bytes));
  return prefix + Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
