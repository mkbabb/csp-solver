// AUDIT rig · static server for the pass-6 non-author audit. SPA fallback to index.html.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.argv[2];
const port = Number(process.argv[3]);
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let p = join(root, url);
  if (!existsSync(p) || statSync(p).isDirectory()) p = join(root, "index.html");
  if (!existsSync(p)) {
    res.writeHead(404);
    return res.end("nope");
  }
  const body = readFileSync(p);
  res.writeHead(200, {
    "content-type": MIME[extname(p)] || "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(body);
}).listen(port, () => console.log(`AUDIT server ${root} :${port}`));
