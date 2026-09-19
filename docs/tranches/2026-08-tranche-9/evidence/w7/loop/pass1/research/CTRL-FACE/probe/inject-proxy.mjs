#!/usr/bin/env node
/**
 * CTRL-FACE pass-1 — THE OVERLAY DELIVERY SEAM.
 *
 * The family's pass/fail is `r0/r1-controls/probe/heading-voice.spec.ts` run UNCHANGED (md5
 * 9f3f07e2de9aa25a22dbfb259225e32a, byte-identical beside this file). That spec injects
 * nothing and takes no fixture, so the prototype cannot reach it through Playwright: the only
 * seam it exposes is `process.env.PLAYWRIGHT_BASE_URL`.
 *
 * So the overlay is served, not injected. This is a transparent HTTP proxy in front of the
 * lane's vite dev server; on an HTML document response it splices ONE <style> block (read from
 * disk per request, so an arm swap needs no restart) immediately before </head>. Every other
 * byte passes through untouched. Nothing under `src/` is written.
 *
 *   ARM=proto/arm-b.css UPSTREAM=4234 PORT=4235 node probe/inject-proxy.mjs
 *   ARM=            (empty) → passthrough, the control arm
 */
import http from "node:http";
import { readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const UP = Number(process.env.UPSTREAM || 4234);
const PORT = Number(process.env.PORT || 4235);
const ARM = process.env.ARM || "";

http
  .createServer((req, res) => {
    const up = http.request(
      { host: "127.0.0.1", port: UP, path: req.url, method: req.method, headers: req.headers },
      (ur) => {
        const type = String(ur.headers["content-type"] || "");
        if (!ARM || !type.includes("text/html")) {
          res.writeHead(ur.statusCode, ur.headers);
          ur.pipe(res);
          return;
        }
        const chunks = [];
        ur.on("data", (c) => chunks.push(c));
        ur.on("end", () => {
          let html = Buffer.concat(chunks).toString("utf8");
          // ARM is a comma-separated list of sheets, spliced in order: the core face law
          // first, then whichever ratio arm is under test.
          const css = ARM.split(",")
            .map((f) => f.trim())
            .filter(Boolean)
            .map((f) => {
              try {
                return `/* ── ${f} ── */\n` + readFileSync(join(ROOT, f), "utf8");
              } catch (e) {
                return `/* ARM ${f} unreadable: ${e.message} */`;
              }
            })
            .join("\n");
          /* THE OVERLAY MUST BE LAST IN HEAD. Vite's dev server injects every component's CSS
             at module-eval time by APPENDING <style> to document.head, so a tag spliced into
             the served HTML sits earlier in the document than the app's own rules and loses
             every specificity TIE. Measured: at equal specificity the overlay's font-weight
             and text-transform landed while font-family and font-size did not, because
             `.zone-row-label[data-v-…]` (0,2,0) ties `.controls-card .zone-row-label` (0,2,0)
             and the later sheet won. The keeper re-appends the overlay whenever head changes,
             so the prototype wins on document order and NOT on `!important` — which would be a
             cheat that hides exactly this class of collision from the spec that follows. */
          const keeper =
            `<script>(function(){var o=document.getElementById('ctrl-face-overlay');` +
            `function last(){if(o&&document.head.lastElementChild!==o)document.head.appendChild(o);}` +
            `new MutationObserver(last).observe(document.head,{childList:true});` +
            `last();document.addEventListener('DOMContentLoaded',last);addEventListener('load',last);` +
            `})();<\/script>`;
          const tag = `<style id="ctrl-face-overlay" data-arm="${ARM}">\n${css}\n</style>${keeper}`;
          html = html.includes("</head>")
            ? html.replace("</head>", `${tag}\n</head>`)
            : tag + html;
          const headers = { ...ur.headers };
          delete headers["content-length"];
          res.writeHead(ur.statusCode, headers);
          res.end(html);
        });
      },
    );
    up.on("error", (e) => {
      res.writeHead(502);
      res.end(String(e));
    });
    req.pipe(up);
  })
  .listen(PORT, "127.0.0.1", () =>
    console.log(`ctrl-face proxy :${PORT} → :${UP}  arm=${ARM || "(passthrough)"}`),
  );
