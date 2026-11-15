import { getStore } from "@netlify/blobs";
import type { Store } from "./store.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Production driver: Netlify Blobs with optimistic concurrency (etag compare-and-set). */
export class BlobStore implements Store {
  private s = getStore({ name: "belvency", consistency: "strong" });

  async get<T>(key: string): Promise<T | null> {
    return ((await this.s.get(key, { type: "json" })) as T | null) ?? null;
  }

  async set(key: string, value: unknown) {
    await this.s.setJSON(key, value);
  }

  async del(key: string) {
    await this.s.delete(key);
  }

  async keys(prefix: string) {
    const { blobs } = await this.s.list({ prefix });
    return blobs.map((b) => b.key).sort();
  }

  async update<T>(key: string, fn: (current: T | null) => T | null): Promise<T | null> {
    for (let attempt = 0; attempt < 8; attempt++) {
      const cur = await this.s.getWithMetadata(key, { type: "json" });
      const current = (cur?.data as T | undefined) ?? null;
      const next = fn(current);
      if (next === current) return current;
      if (next === null) {
        await this.s.delete(key);
        return null;
      }
      const res = cur
        ? await this.s.setJSON(key, next, { onlyIfMatch: cur.etag })
        : await this.s.setJSON(key, next, { onlyIfNew: true });
      if (res.modified) return next;
      await sleep(25 * (attempt + 1) + Math.floor(Math.random() * 25));
    }
    throw new Error("Eyni anda çox sorğu gəldi, yenidən cəhd edin");
  }
}
