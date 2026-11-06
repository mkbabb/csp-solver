// CTRL-TAPE pass-10 critic probe: one browser per run, a new context per cell, all closed in finally.
// BASE=http://127.0.0.1:PORT node probe10.mjs <chromium|webkit> [cells comma list]
import { createRequire } from "node:module";
const require = createRequire(process.env.FE + "/package.json");
const pw = require("@playwright/test");
const engine = process.argv[2], want = (process.argv[3] ?? "tape,reload,hint,hintreload").split(",");
const BASE = process.env.BASE;
// DIST=<dir>: no server; every request to BASE's origin is fulfilled from that dist on disk (SPA fallback index.html)
import fs from "node:fs"; import path from "node:path";
const DIST = process.env.DIST;
const MIME = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".html": "text/html", ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".txt": "text/plain" };
async function serveDist(ctx) {
  if (!DIST) return;
  const origin = new URL(BASE).origin, prefix = new URL(BASE).pathname.replace(/\/$/, "");
  await ctx.route(origin + "/**", async (route) => {
    let p = decodeURIComponent(new URL(route.request().url()).pathname);
    if (prefix && p.startsWith(prefix)) p = p.slice(prefix.length);
    let f = path.join(DIST, p);
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, "index.html");
    await route.fulfill({ status: 200, body: fs.readFileSync(f), contentType: MIME[path.extname(f)] ?? "application/octet-stream" });
  });
}
const out = { engine, base: BASE, cells: {} };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function load(page) {
  await page.goto(BASE + "/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  for (let i = 0; i < 60 && !(await page.locator(".sudoku-cell .glyph-svg").count()); i++) await sleep(250);
  // settle: two equal reads of the bar's rect 300 ms apart
  let prev = "";
  for (let i = 0; i < 40; i++) {
    const r = await page.evaluate(() => JSON.stringify(document.querySelector(".action-bar")?.getBoundingClientRect() ?? null));
    if (r === prev) break;
    prev = r; await sleep(300);
  }
}
const empties = (page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].filter((i) => !i.value).length);
const firstEmpty = (page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].findIndex((i) => !i.value));
const ribbon = (page) => page.locator(".confirm-ribbon").count();
async function press(page, label) {
  await page.locator(`button[aria-label="${label}"]`).first().click();
  let n = 0; for (let i = 0; i < 8; i++) { n = await ribbon(page); if (n) break; await sleep(150); }
  return n > 0;
}
async function saved(page, at, v) {
  for (let i = 0; i < 30; i++) {
    const ok = await page.evaluate(([i, v]) => Object.keys(localStorage).some((k) => { try { return JSON.parse(localStorage.getItem(k) ?? "null")?.values?.[String(i)] === v; } catch { return false; } }), [at, v]);
    if (ok) return true; await sleep(200);
  }
  return false;
}
const browser = await pw[engine].launch({ headless: true });
try {
  for (const cell of want) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    await serveDist(ctx);
    const page = await ctx.newPage();
    const r = {};
    try {
      await load(page);
      if (cell === "tape") {
        Object.assign(r, await page.evaluate(() => {
          const v = document.querySelector(".action-verbs")?.getBoundingClientRect(), f = document.getElementById("card-foot")?.getBoundingClientRect();
          return { barInFoot: !!document.querySelector("#card-foot .action-bar"), verbsTop: v?.top, verbsBottom: v?.bottom, footTop: f?.top, footBottom: f?.bottom, footH: f?.height, vh: innerHeight };
        }));
      } else if (cell === "reload" || cell === "hintreload" || cell === "hint") {
        const at = await firstEmpty(page);
        r.at = at; r.empties0 = await empties(page);
        await page.locator(".sudoku-cell input").nth(at).click();
        if (cell === "reload") await page.keyboard.type("5");
        else { // a fine pointer has no hint button (the play-controls are coarse-only, 0×0 at 1440): the board's bare 'h' key
          await page.keyboard.press("h");
        }
        await sleep(600);
        r.written = await page.locator(".sudoku-cell input").nth(at).inputValue();
        r.saved = await saved(page, at, Number(r.written));
        if (cell !== "hint") { await page.reload(); await load(page); r.restored = await page.locator(".sudoku-cell input").nth(at).inputValue(); }
        r.clearAsked = await press(page, "Clear the board");
        r.afterClearPress = await page.locator(".sudoku-cell input").nth(at).inputValue();
        if (r.clearAsked) {
          await page.locator(".confirm-ribbon").getByRole("button", { name: "clear", exact: true }).click();
          await sleep(500); r.afterAnswer = await page.locator(".sudoku-cell input").nth(at).inputValue();
          r.solveAsked = await press(page, "Solve puzzle");
          for (let i = 0; i < 40 && (await empties(page)); i++) await sleep(250);
          r.emptiesAfterSolve = await empties(page);
        }
      }
    } catch (e) { r.error = String(e.message).slice(0, 200); }
    finally { await ctx.close(); }
    out.cells[cell] = r;
    console.log(cell, JSON.stringify(r));
  }
} finally { await browser.close(); }
console.log("PROBE-JSON " + JSON.stringify(out));
