#!/usr/bin/env node
/**
 * probe-server.mjs — the L1 real-Safari probe host. ZERO npm deps (node stdlib only).
 *
 *   (a) serves web/frontend/dist statically on PORT 4894 (correct MIME for js/css/wasm/woff2),
 *       SPA-falling-back to index.html for non-asset paths;
 *   (b) INJECTS <script src="/__probe.js"></script> into index.html AT SERVE TIME — the dist
 *       on disk is never touched;
 *   (c) serves /__probe.js from this rig dir (no-store, so an edit lands on the next load);
 *   (d) collects POST /__metrics as JSON lines under runs/<runId>.jsonl;
 *   (e) GET /__runs/<runId> hands the collected lines back so a driver can await {done:true}.
 *
 * Usage: node probe-server.mjs [--port 4894] [--dist <path>]
 */
import { createServer } from "node:http";
import { readFile, appendFile, mkdir, stat } from "node:fs/promises";
import { join, extname, resolve, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { Buffer } from "node:buffer";

const RIG_DIR = fileURLToPath(new URL(".", import.meta.url));
const RUNS_DIR = join(RIG_DIR, "runs");

const argv = process.argv.slice(2);
function arg(flag, fallback) {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const PORT = Number(arg("--port", "4894"));
// The rig lives at web/frontend/perf-rig/, so the dist it measures is its own sibling — no
// absolute path, no assumption about where the checkout sits.
const DIST = resolve(arg("--dist", join(RIG_DIR, "..", "dist")));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const NO_STORE = "no-store, no-cache, must-revalidate";

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Cache-Control": NO_STORE,
    "Access-Control-Allow-Origin": "*",
    ...headers,
  });
  res.end(body);
}

async function exists(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

/** The one mutation: a classic (non-deferred) probe tag right before </head>, so probe.js
 *  runs BEFORE the app's deferred module — early enough to inject ablation CSS. */
function injectProbe(html) {
  const tag = '<script src="/__probe.js"></script>';
  if (html.includes(tag)) return html;
  return html.includes("</head>")
    ? html.replace("</head>", `    ${tag}\n  </head>`)
    : `${tag}\n${html}`;
}

async function serveIndex(res) {
  const html = await readFile(join(DIST, "index.html"), "utf8");
  send(res, 200, injectProbe(html), { "Content-Type": MIME[".html"] });
}

function readBody(req) {
  return new Promise((ok, fail) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")));
    req.on("error", fail);
  });
}

const safeRunId = (s) => (s || "").replace(/[^A-Za-z0-9._-]/g, "").slice(0, 120);

const server = createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://localhost:${PORT}`);
  } catch {
    return send(res, 400, "bad url");
  }
  const path = decodeURIComponent(url.pathname);

  try {
    // ── rig endpoints ────────────────────────────────────────────────────
    if (path === "/__ping") return send(res, 200, "ok");

    // The display's rAF ceiling with NO app on the page — the denominator every app number
    // is read against ("83 fps" means nothing without it). Same sampler shape, empty page.
    if (path === "/__ceiling") {
      const runId = safeRunId(url.searchParams.get("__run") || "ceiling");
      const ms = Number(url.searchParams.get("__ms") || 3000);
      return send(
        res,
        200,
        `<!doctype html><meta charset="utf-8"><title>rAF ceiling</title>
<body style="background:#111;color:#eee;font:14px system-ui">measuring the rAF ceiling…
<script>
var d=[],last=performance.now(),t0=last;
function step(now){d.push(now-last);last=now;
 if(now-t0<${ms})requestAnimationFrame(step);else finish(now-t0);}
requestAnimationFrame(step);
function finish(wall){
 var t=d.slice(1),s=t.slice().sort(function(a,b){return a-b});
 var body={runId:"${runId}",scenario:"rafCeiling",frames:d.length,wallMs:Math.round(wall),
  fps:Math.round(d.length/(wall/1000)*100)/100,p50:s[Math.floor(s.length/2)],
  p95:s[Math.floor(s.length*0.95)],worstMs:s[s.length-1],
  long50:t.filter(function(x){return x>50}).length,long33:t.filter(function(x){return x>33.4}).length,
  jankMs:0,hadFocus:document.hasFocus(),displayHzEst:Math.round(1000/s[Math.floor(s.length/2)]),
  ua:navigator.userAgent,dpr:devicePixelRatio};
 document.body.textContent="ceiling "+body.fps+" fps (p50 "+body.p50+"ms → ~"+body.displayHzEst+"Hz)";
 fetch("/__metrics?run=${runId}",{method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify(body),keepalive:true}).then(function(){
  return fetch("/__metrics?run=${runId}",{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({runId:"${runId}",done:true}),keepalive:true});
 }).then(function(){document.title="PROBE DONE ${runId}"});
}
</script></body>`,
        { "Content-Type": MIME[".html"] },
      );
    }

    if (path === "/__probe.js") {
      const js = await readFile(join(RIG_DIR, "probe.js"), "utf8");
      return send(res, 200, js, { "Content-Type": MIME[".js"] });
    }

    if (path === "/__metrics") {
      if (req.method === "OPTIONS")
        return send(res, 204, "", {
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
      if (req.method !== "POST") return send(res, 405, "post only");
      const raw = await readBody(req);
      let obj;
      try {
        obj = JSON.parse(raw);
      } catch {
        obj = { parseError: true, raw: raw.slice(0, 2000) };
      }
      const runId = safeRunId(obj.runId || url.searchParams.get("run") || "unknown");
      obj.serverTs = new Date().toISOString();
      await mkdir(RUNS_DIR, { recursive: true });
      await appendFile(join(RUNS_DIR, `${runId}.jsonl`), `${JSON.stringify(obj)}\n`);
      process.stdout.write(
        `[metrics ${runId}] ${obj.kind || obj.scenario || (obj.done ? "done" : "?")}` +
          (obj.fps != null ? ` fps=${obj.fps} long50=${obj.long50} worst=${obj.worstMs}` : "") +
          (obj.error ? ` ERROR: ${String(obj.error).slice(0, 200)}` : "") +
          "\n",
      );
      return send(res, 204, "");
    }

    if (path.startsWith("/__runs/")) {
      const runId = safeRunId(path.slice("/__runs/".length));
      const file = join(RUNS_DIR, `${runId}.jsonl`);
      const body = (await exists(file)) ? await readFile(file, "utf8") : "";
      return send(res, 200, body, { "Content-Type": "application/x-ndjson; charset=utf-8" });
    }

    // ── static dist ──────────────────────────────────────────────────────
    if (path === "/" || path === "/index.html") return serveIndex(res);

    const rel = normalize(path).replace(/^(\.\.[/\\])+/, "").replace(/^\/+/, "");
    const file = join(DIST, rel);
    if (!file.startsWith(DIST)) return send(res, 403, "nope");

    if (await exists(file)) {
      const ext = extname(file).toLowerCase();
      const buf = await readFile(file);
      const isHashed = /-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/.test(rel);
      return send(res, 200, buf, {
        "Content-Type": MIME[ext] || "application/octet-stream",
        // hashed assets may sit in the memory cache across runs; html/probe never do
        "Cache-Control": isHashed ? "public, max-age=300" : NO_STORE,
      });
    }

    // SPA fallback: anything without a file extension is a route
    if (!extname(path)) return serveIndex(res);
    return send(res, 404, "not found");
  } catch (err) {
    return send(res, 500, `rig error: ${err && err.message}`);
  }
});

await mkdir(RUNS_DIR, { recursive: true });
server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(
    `probe-rig up: http://localhost:${PORT}  dist=${DIST}  runs=${RUNS_DIR}\n`,
  );
});
