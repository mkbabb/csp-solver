// T9-W7 pass 1 · CTRL-TAPE — THE OVERLAY PROXY.
//
// The estate's own instruments (`e2e/access.spec.ts`, `r0/.../heading-voice.spec.ts`) have no
// hook for an overlay, and the charter says they are RE-RUN, never re-written. So the overlay
// is served rather than injected: this proxy pipes the lane's dev server (4230) and splices the
// prototype's stylesheet and DOM patch into the HTML document on its way out. The instruments
// then run byte-unchanged against an overlaid product.
//
//   node overlay-proxy.mjs           # 4231 → 4230, overlay ON
//   node overlay-proxy.mjs --off     # 4231 → 4230, pass-through (the control)
//
// Read-only on the product: nothing under `src/` is touched, and the injection lives entirely
// in the response body.

import { createServer } from "node:http";
import { OVERLAY_CSS, DOM_PATCH } from "./overlay.mjs";

const UP = { host: "127.0.0.1", port: 4230 };
const PORT = 4233;
const ON = !process.argv.includes("--off");

const BOOT = `
<style id="ctrl-tape-overlay">${OVERLAY_CSS}</style>
<script>
(() => {
  const patch = ${DOM_PATCH.toString()};
  let last = 0;
  const run = () => {
    const card = document.querySelector(".controls-card");
    if (!card) return;
    // idempotent: only patch a card that has not been patched (the mobile/desk twins remount)
    if (card.querySelector("h2.washi-tag") && card.querySelector("h2.tape-host")) return;
    if (Date.now() - last < 120) return;
    last = Date.now();
    try { window.__ctrlTapePatch = patch(); } catch (e) { window.__ctrlTapeErr = String(e); }
  };
  const tick = () => { run(); requestAnimationFrame(tick); };
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", tick);
  else tick();
})();
</script>
`;

createServer((req, res) => {
  const opts = { host: UP.host, port: UP.port, path: req.url, method: req.method, headers: { ...req.headers, host: `${UP.host}:${UP.port}`, "accept-encoding": "identity" } };
  import("node:http").then(({ request }) => {
    const up = request(opts, (ur) => {
      const type = ur.headers["content-type"] || "";
      if (!ON || !type.includes("text/html")) {
        res.writeHead(ur.statusCode, ur.headers);
        return ur.pipe(res);
      }
      const chunks = [];
      ur.on("data", (c) => chunks.push(c));
      ur.on("end", () => {
        let body = Buffer.concat(chunks).toString("utf8");
        body = body.includes("</body>") ? body.replace("</body>", `${BOOT}</body>`) : body + BOOT;
        const h = { ...ur.headers };
        delete h["content-length"];
        delete h["content-encoding"];
        res.writeHead(ur.statusCode, h);
        res.end(body);
      });
    });
    up.on("error", (e) => { res.writeHead(502); res.end(String(e)); });
    req.pipe(up);
  });
}).listen(PORT, "127.0.0.1", () => console.log(`overlay proxy on 127.0.0.1:${PORT} (overlay ${ON ? "ON" : "OFF"}) → ${UP.host}:${UP.port}`));
