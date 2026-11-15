import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { fail, isHttps, type Env } from "./http.ts";
import type { Store } from "./store.ts";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const COOKIE = "bm_session";
const SESSION_SECONDS = 60 * 60 * 12;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 32);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, saltHex, hashHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const got = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

const sign = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("base64url");

export function createSession(secret: string, now = Date.now()): string {
  const exp = Math.floor(now / 1000) + SESSION_SECONDS;
  const body = `${exp}.${randomBytes(9).toString("base64url")}`;
  return `${body}.${sign(secret, body)}`;
}

export function checkSession(value: string | undefined, secret: string, now = Date.now()): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const expected = sign(secret, `${exp}.${nonce}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Math.floor(now / 1000);
}

export function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

export function sessionCookie(req: Request, value: string, maxAge = SESSION_SECONDS): string {
  return [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
    isHttps(req) ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function requireAdmin(req: Request, env: Env, now = Date.now()) {
  const secret = env.SESSION_SECRET;
  if (!secret || secret.length < 24) fail(500, "Server düzgün qurulmayıb (SESSION_SECRET)");
  if (!checkSession(readCookie(req, COOKIE), secret, now)) fail(401, "Daxil olmaq lazımdır");
}

/** Fixed-window rate limiter backed by the store. Returns false when the caller is over the limit. */
export async function rateLimit(
  store: Store,
  bucket: string,
  limit: number,
  windowSeconds: number,
  now = Date.now(),
): Promise<boolean> {
  let allowed = true;
  await store.update<{ n: number; until: number }>(`rl/${bucket}`, (cur) => {
    allowed = true;
    if (!cur || cur.until <= now) return { n: 1, until: now + windowSeconds * 1000 };
    if (cur.n >= limit) {
      allowed = false;
      return cur;
    }
    return { n: cur.n + 1, until: cur.until };
  });
  return allowed;
}
