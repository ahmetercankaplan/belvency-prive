/**
 * Post-build step for the static export (runs automatically after `next build`).
 *
 * Next writes each route's prefetch data as   <route>/__next.<a>/<b>/__PAGE__.txt
 * but the browser requests it as              <route>/__next.<a>.<b>.__PAGE__.txt
 * A plain static host cannot map one to the other, so every link click would 404 and fall back
 * to a full page reload. We add the dotted-name copy next to each nested file.
 * No-op when there is no `out/` folder (normal, non-export builds).
 */
import { copyFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

// NEXT_DIST_DIR moves the export output (used for local test builds)
const OUT = path.resolve(process.cwd(), process.env.NEXT_DIST_DIR || "out");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

if (!(await exists(OUT))) {
  console.log("fix-export: no out/ folder, nothing to do");
  process.exit(0);
}

let added = 0;
for await (const file of walk(OUT)) {
  if (!file.endsWith(".txt")) continue;
  // find the closest ancestor directory named "__next.<something>"
  const parts = path.relative(OUT, file).split(path.sep);
  const i = parts.findIndex((p) => p.startsWith("__next.") && p !== parts[parts.length - 1]);
  if (i === -1) continue;
  const dir = parts.slice(0, i); // route folder
  const nested = parts.slice(i); // __next.a, b, c.txt
  const flat = nested.join(".").replace(/\.txt$/, "") + ".txt";
  const dest = path.join(OUT, ...dir, flat);
  if (!(await exists(dest))) {
    await copyFile(file, dest);
    added++;
  }
}
console.log(`fix-export: added ${added} flat segment files`);
