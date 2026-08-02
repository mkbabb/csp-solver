/**
 * Static server for a built `dist` — SPA fallback, no-store, correct wasm/font mime.
 * Ports live in the LAND lane's assigned 4230–4260 band. `node serve.mjs <port> <root>`.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, extname } from "node:path";

const port = +(process.argv[2] ?? 4231);
const ROOT = resolve(process.argv[3] ?? "dist");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
};

createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
  let p = resolve(ROOT, rel || "index.html");
  if (!p.startsWith(ROOT)) return void res.writeHead(403).end("no");
  if (existsSync(p) && statSync(p).isDirectory()) p = resolve(p, "index.html");
  // SPA fallback — every non-asset route is the app shell.
  if (!existsSync(p)) p = resolve(ROOT, "index.html");
  res.writeHead(200, {
    "content-type": TYPES[extname(p)] ?? "application/octet-stream",
    "cache-control": "no-store",
    // The wasm solver runs in a Worker; keep the isolation headers the app expects.
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-embedder-policy": "require-corp",
    "cross-origin-resource-policy": "cross-origin",
  });
  res.end(readFileSync(p));
}).listen(port, () => console.log(`land rig server on :${port} root=${ROOT}`));
