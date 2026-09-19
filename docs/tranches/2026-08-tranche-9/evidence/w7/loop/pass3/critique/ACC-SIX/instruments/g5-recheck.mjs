// ACC-SIX pass-3 CRITIQUE — an independent re-run of G5 (the count) on the prototype's own
// dist, both engines, plus the one thing the prototype's unit rows cannot see: whether the
// drawn line UPDATES IN PLACE, as GameBoard.vue's comment claims, or is destroyed and rebuilt
// on every write because MarginNote binds `:key="meta"` to the very string that changes.
//
// Served from the prototype worktree's own `dist` (built 00:19 inside that tree) on :4237.
import { createRequire } from "node:module";
const require_ = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { chromium, webkit } = require_("@playwright/test");
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const DIST = process.argv[2];
const PORT = Number(process.argv[3] ?? 4237);
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let file = path.join(DIST, url);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

const strip = (page) =>
  page.evaluate(() => {
    const m = document.querySelector(".board-margin");
    const meta = document.querySelector(".margin-note-meta");
    const bar = document.querySelector('[role="progressbar"]');
    const board = document.querySelector(".board-wrapper");
    return {
      stripH: m ? +m.getBoundingClientRect().height.toFixed(2) : null,
      boardBottom: board ? +board.getBoundingClientRect().bottom.toFixed(2) : null,
      meta: meta ? meta.textContent.trim() : null,
      metaHidden: meta ? meta.getAttribute("aria-hidden") : null,
      metaProbe: meta ? (meta.dataset.probe ?? null) : null,
      valuetext: bar?.getAttribute("aria-valuetext") ?? null,
      valuenow: bar?.getAttribute("aria-valuenow") ?? null,
      valuemax: bar?.getAttribute("aria-valuemax") ?? null,
      label: bar?.getAttribute("aria-label") ?? null,
      anims: meta ? meta.getAnimations().map((a) => a.animationName ?? a.constructor.name) : [],
    };
  });

async function writeOne(page) {
  // The first EMPTY, writable cell input — givens are readOnly at the property level.
  const idx = await page.evaluate(() => {
    const all = [...document.querySelectorAll(".board-cells .sudoku-cell input")];
    return all.findIndex((i) => !i.readOnly && !i.disabled && i.value === "");
  });
  if (idx < 0) throw new Error("no writable empty cell");
  const input = page.locator(".board-cells .sudoku-cell input").nth(idx);
  await input.click({ force: true });
  await input.press("1");
  await page.waitForTimeout(260);
}

const out = {};
for (const [name, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  const ctx = await browser.newContext({ viewport: { width: 393, height: 699 }, deviceScaleFactor: 3, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, null, { timeout: 20000 });
  await page.waitForTimeout(1500);

  const rows = [];
  rows.push({ at: "fill 0", ...(await strip(page)) });

  // record every childList mutation inside the strip from here on
  await page.evaluate(() => {
    window.__mut = [];
    const t = document.querySelector(".board-margin");
    new MutationObserver((recs) => {
      for (const r of recs)
        if (r.type === "childList")
          window.__mut.push({
            added: [...r.addedNodes].map((n) => n.nodeName + ":" + (n.textContent ?? "").trim().slice(0, 30)),
            removed: [...r.removedNodes].map((n) => n.nodeName + ":" + (n.textContent ?? "").trim().slice(0, 30)),
          });
    }).observe(t, { childList: true, subtree: true });
  });

  await writeOne(page);
  rows.push({ at: "fill 1", ...(await strip(page)) });
  // tag the node that is showing now
  await page.evaluate(() => {
    const m = document.querySelector(".margin-note-meta");
    if (m) m.dataset.probe = "laid-at-fill-1";
  });

  await writeOne(page);
  rows.push({ at: "fill 2", ...(await strip(page)) });

  await writeOne(page);
  rows.push({ at: "fill 3", ...(await strip(page)) });

  await page.waitForTimeout(1200);
  rows.push({ at: "after lift", ...(await strip(page)) });

  out[name] = { rows, mutations: await page.evaluate(() => window.__mut) };
  await browser.close();
}

server.close();
console.log(JSON.stringify(out, null, 1));
