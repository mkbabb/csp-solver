/** Static SPA server for a built dist. `node serve.mjs <dir> <port>`. No deps, no network. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const [, , dir, port] = process.argv;
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".map": "application/json",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let p = join(dir, normalize(decodeURIComponent(url.pathname)));
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, "index.html");
  } catch {
    p = join(dir, "index.html"); // SPA fallback
  }
  try {
    const body = await readFile(p);
    res.writeHead(200, {
      "content-type": TYPES[extname(p)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (e) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("404");
  }
}).listen(Number(port), () => console.log(`serving ${dir} on ${port}`));
