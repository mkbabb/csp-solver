#!/usr/bin/env node
/**
 * blank-bake-server.mjs — T5-W1 row 1.6's FORCED-BLANK ablation host.
 *
 * Reconstructs 71456713's "forced blank" arm as a serve-time injection, so the ablation
 * touches neither the dist on disk nor the spec under test. Modelled on the in-tree
 * perf-rig/probe-server.mjs seam (a classic <script> before </head>, ahead of the app's
 * deferred module).
 *
 * TWO ARMS, one binary, one flag — so the arms differ ONLY in the ablation:
 *   --blank   every `svg.handwritten-logo image.logo-pose-bmp` href is replaced, as it is
 *             minted, by a VALID, CORRECTLY-SIZED, ENTIRELY TRANSPARENT PNG at the pose's
 *             own measured intrinsic. That is the runner's signature verbatim (71456713:
 *             "272-313 bytes at the label's own measured intrinsic … fonts.status: loaded").
 *             The grid bake is NOT touched — in the real incident it painted.
 *   (absent)  plain static serve: the inked arm.
 *
 * Usage: node blank-bake-server.mjs --dist <path> [--port 4189] [--blank]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve, normalize } from "node:path";
import process from "node:process";

const argv = process.argv.slice(2);
const arg = (flag, fallback) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const PORT = Number(arg("--port", "4189"));
const DIST = resolve(arg("--dist", "dist"));
const BLANK = argv.includes("--blank");

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
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * THE ABLATION. Installed before the app boots; re-fires on every re-mint, so the blank is
 * TERMINAL the way the runner's was (`useRasterStack` re-bakes on cacheKey/cssSize/dpr/mount,
 * and each re-bake is blanked again — no poll and no retry can clear it).
 */
const ABLATION = `
(function () {
  var MARK = "data-canary-blanked";
  var SEL = "image.logo-pose-bmp";
  function blank(img) {
    if (!img.closest || !img.closest("svg.handwritten-logo")) return;
    var href = img.getAttribute("href");
    if (!href) return;
    if (img.getAttribute(MARK) === href) return;   // already ours
    var probe = new Image();
    probe.onload = function () {
      var c = document.createElement("canvas");
      c.width = probe.naturalWidth || 1;
      c.height = probe.naturalHeight || 1;
      // The 2d context is never drawn into: every pixel stays alpha 0. A valid, correctly
      // sized, entirely transparent PNG — the runner's blob, byte-shape and all.
      c.toBlob(function (b) {
        if (!b) return;
        var url = URL.createObjectURL(b);
        img.setAttribute(MARK, url);
        img.setAttribute("href", url);
        (window.__canaryBlanks = window.__canaryBlanks || []).push({
          w: c.width, h: c.height, bytes: b.size
        });
      }, "image/png");
    };
    probe.src = href;
  }
  function sweep(root) {
    if (!root || !root.querySelectorAll) return;
    var n = root.querySelectorAll(SEL);
    for (var i = 0; i < n.length; i++) blank(n[i]);
    if (root.matches && root.matches(SEL)) blank(root);
  }
  new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === "attributes") blank(r.target);
      for (var j = 0; j < r.addedNodes.length; j++) sweep(r.addedNodes[j]);
    }
  }).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: ["href"]
  });
  sweep(document);
  document.addEventListener("DOMContentLoaded", function () { sweep(document); });
})();
`;

const injectAblation = (html) =>
  html.includes("</head>")
    ? html.replace("</head>", `    <script>${ABLATION}</script>\n  </head>`)
    : `<script>${ABLATION}</script>\n${html}`;

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
};

const isFile = async (p) => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

const server = createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://localhost:${PORT}`);
  } catch {
    return send(res, 400, "bad url");
  }
  const path = decodeURIComponent(url.pathname);
  try {
    const rel = normalize(path).replace(/^(\.\.[/\\])+/, "");
    const abs = join(DIST, rel);
    if (!abs.startsWith(DIST)) return send(res, 403, "forbidden");

    if (path === "/" || !(await isFile(abs))) {
      // SPA fallback (and "/") — the only path the ablation is injected into.
      const html = await readFile(join(DIST, "index.html"), "utf8");
      return send(res, 200, BLANK ? injectAblation(html) : html, {
        "Content-Type": MIME[".html"],
      });
    }
    if (extname(abs) === ".html") {
      const html = await readFile(abs, "utf8");
      return send(res, 200, BLANK ? injectAblation(html) : html, {
        "Content-Type": MIME[".html"],
      });
    }
    const body = await readFile(abs);
    return send(res, 200, body, {
      "Content-Type": MIME[extname(abs)] || "application/octet-stream",
    });
  } catch (e) {
    return send(res, 500, String(e));
  }
});

server.listen(PORT, () => {
  process.stdout.write(
    `blank-bake-server: dist=${DIST} port=${PORT} ablation=${BLANK ? "FORCED-BLANK" : "none (inked arm)"}\n`,
  );
});
