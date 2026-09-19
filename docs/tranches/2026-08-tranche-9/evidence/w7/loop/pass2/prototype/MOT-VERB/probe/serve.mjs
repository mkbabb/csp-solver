import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import process from "node:process";

const ROOT = process.argv[2];
const PORT = Number(process.argv[3]);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".wasm": "application/wasm", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon" };
createServer((req, rq) => {
  const u = new URL(req.url, "http://x");
  let p = join(ROOT, decodeURIComponent(u.pathname));
  if (!existsSync(p) || u.pathname === "/") p = join(ROOT, "index.html");
  if (!existsSync(p)) p = join(ROOT, "index.html");
  try {
    const b = readFileSync(p);
    rq.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream", "cache-control": "no-store" });
    rq.end(b);
  } catch {
    rq.writeHead(404);
    rq.end();
  }
}).listen(PORT, "127.0.0.1", () => console.log(`serving ${ROOT} on ${PORT}`));
