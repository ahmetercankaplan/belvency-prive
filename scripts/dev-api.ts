/**
 * Local stand-in for Netlify Functions: serves server/api.ts on http://localhost:8888.
 * Usage: node scripts/dev-api.ts   (Node 24 runs TypeScript directly)
 */
import { createServer } from "node:http";
import { handle } from "../server/api.ts";

const port = Number(process.env.PORT ?? 8888);

createServer(async (nodeReq, nodeRes) => {
  const chunks: Buffer[] = [];
  for await (const c of nodeReq) chunks.push(c as Buffer);
  const body = Buffer.concat(chunks);
  const headers = new Headers();
  for (const [k, v] of Object.entries(nodeReq.headers)) if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  const origin = `http://${nodeReq.headers.host ?? `localhost:${port}`}`;
  const req = new Request(new URL(nodeReq.url ?? "/", origin), {
    method: nodeReq.method,
    headers,
    body: body.length && nodeReq.method !== "GET" && nodeReq.method !== "HEAD" ? body : undefined,
  });
  const res = await handle(req);
  const out: Record<string, string | string[]> = {};
  res.headers.forEach((v: string, k: string) => (out[k] = v));
  const cookies = res.headers.getSetCookie?.() ?? [];
  if (cookies.length) out["set-cookie"] = cookies;
  nodeRes.writeHead(res.status, out);
  nodeRes.end(Buffer.from(await res.arrayBuffer()));
}).listen(port, () => console.log(`dev api on http://localhost:${port}`));
