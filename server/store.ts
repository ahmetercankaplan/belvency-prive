import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Env } from "./http.ts";

/**
 * Minimal key/value store. Two drivers share this interface:
 *  - FileStore: local development and tests (JSON files)
 *  - BlobStore: Netlify Blobs in production (see blob-store.ts)
 */
export interface Store {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  keys(prefix: string): Promise<string[]>;
  /**
   * Atomic read-modify-write. `fn` receives the current value and returns the next one
   * (return the same object to leave it unchanged, or null to delete). `fn` may run more
   * than once when concurrent writers collide, so it must be free of side effects other than
   * assigning to local variables.
   */
  update<T>(key: string, fn: (current: T | null) => T | null): Promise<T | null>;
}

export class FileStore implements Store {
  private dir: string;
  private chain: Promise<unknown> = Promise.resolve();

  constructor(dir: string) {
    this.dir = dir;
  }

  private file(key: string) {
    return path.join(this.dir, `${encodeURIComponent(key)}.json`);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return JSON.parse(await readFile(this.file(key), "utf8")) as T;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  }

  async set(key: string, value: unknown) {
    await mkdir(this.dir, { recursive: true });
    const f = this.file(key);
    const tmp = `${f}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
    await writeFile(tmp, JSON.stringify(value));
    await rename(tmp, f);
  }

  async del(key: string) {
    await rm(this.file(key), { force: true });
  }

  async keys(prefix: string) {
    let files: string[];
    try {
      files = await readdir(this.dir);
    } catch {
      return [];
    }
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => decodeURIComponent(f.slice(0, -5)))
      .filter((k) => k.startsWith(prefix))
      .sort();
  }

  update<T>(key: string, fn: (current: T | null) => T | null): Promise<T | null> {
    const run = async () => {
      const cur = await this.get<T>(key);
      const next = fn(cur);
      if (next === null) await this.del(key);
      else if (next !== cur) await this.set(key, next);
      return next;
    };
    const p = this.chain.then(run, run);
    this.chain = p.catch(() => undefined);
    return p;
  }
}

export async function openStore(env: Env): Promise<Store> {
  const driver = env.STORE_DRIVER ?? (env.NETLIFY || env.NETLIFY_BLOBS_CONTEXT ? "blobs" : "file");
  if (driver === "blobs") {
    const { BlobStore } = await import("./blob-store.ts");
    return new BlobStore();
  }
  return new FileStore(env.DATA_DIR ?? path.join(process.cwd(), ".data"));
}
