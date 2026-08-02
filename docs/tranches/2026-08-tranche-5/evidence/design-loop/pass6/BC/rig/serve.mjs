/** Static server for the G4 rig page — same-origin so the Worker blob URL loads. */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.argv[3] ?? dirname(fileURLToPath(import.meta.url));
const port = +(process.argv[2] ?? 4243);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css" };

createServer((req, res) => {
  const p = resolve(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!p.startsWith(ROOT) || !existsSync(p)) {
    res.writeHead(404).end("nope");
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(p)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(readFileSync(p));
}).listen(port, () => console.log(`g4 rig server on :${port} root=${ROOT}`));
