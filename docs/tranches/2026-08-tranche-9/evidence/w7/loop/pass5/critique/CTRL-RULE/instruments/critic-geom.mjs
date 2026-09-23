// T9-W7 pass 5 · CRITIC · CTRL-RULE — the critic's own geometry probe (not a copy).
// Both arms on ONE encoded payload, prod-vs-prod (lane dist rebuilt by the critic from the work tree,
// index-BEfGHg9Q2Vmx.js; control = w7-control dist index-CubiZsMVSwTc.js at 74a2b5d9).
// Rows per cell: card overflow-x · masthead crossing · π rects+paint on unclaimed surfaces (control read
// twice → noise) · scroll-end blank below the last drawn line · card clientHeight · foot height.
// node critic-geom.mjs <chromium|webkit> <LANE> <CTRL> [light|dark]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, LANE, CTRL, THEME = "light"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = (process.env.CELLS || "1024x768f,1280x800f,1440x900f,1280x800c,390x844c,390x844f,320x568c,844x390c").split(",");
const SURF = { masthead: ".masthead", logo: "svg.handwritten-logo", tab: ".drawer-tab", cell0: ".sudoku-cell", grid: ".board-peek-host", toggle: "button.sun-moon-toggle", case: ".drawer-case", card: ".controls-card" };
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
async function read(base, w, h, touch) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: THEME, hasTouch: touch, isMobile: touch && ENGINE === "chromium" });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(2000);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1;
  for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? 0); if (Math.abs(t - last) < 0.01) break; last = t; }
  const r = await p.evaluate((S) => {
    const o = { coarse: matchMedia("(pointer: coarse)").matches, givens: [...document.querySelectorAll(".sudoku-cell")].map((c, i) => c.querySelector(".glyph-svg") ? i : -1).filter((i) => i >= 0).join(",") };
    for (const [k, sel] of Object.entries(S)) {
      const e = document.querySelector(sel); if (!e) { o[k] = null; continue; }
      const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
      o[k] = { tag: e.tagName, x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2), paint: [cs.fontFamily.slice(0, 30), cs.fontSize, cs.color, cs.backgroundColor, cs.opacity, cs.transform].join("|") };
    }
    const card = document.querySelector(".controls-card");
    o.overflowX = card.scrollWidth - card.clientWidth;
    o.clientH = card.clientHeight;
    const foot = document.getElementById("card-foot") || document.querySelector(".action-bar");
    o.footH = foot ? +foot.getBoundingClientRect().height.toFixed(2) : null;
    const mh = document.querySelector(".masthead")?.getBoundingClientRect(), cb = document.querySelector(".drawer-case").getBoundingClientRect();
    o.crossMasthead = mh ? +(mh.bottom - cb.top).toFixed(2) : null;
    // scroll END: the lowest painted thing in the card (any element with a box, not hidden) vs the scrollport bottom
    card.scrollTop = card.scrollHeight;
    const clipB = card.getBoundingClientRect().top + card.clientTop + card.clientHeight;
    let low = -1e9, lowName = "";
    for (const e of card.querySelectorAll("*")) {
      const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
      if (e.closest(".zone-hint")) continue;
      const b = e.getBoundingClientRect(); if (!b.width || !b.height) continue;
      if (b.bottom > low) { low = b.bottom; lowName = e.tagName.toLowerCase() + "." + String(e.className?.baseVal ?? e.className).split(" ")[0]; }
    }
    o.scrollEndBlank = +(clipB - low).toFixed(2); o.scrollEndLowest = lowName;
    card.scrollTop = 0;
    return o;
  }, SURF);
  await ctx.close();
  return r;
}
const out = { engine: ENGINE, theme: THEME, board: BOARD, lane: LANE, control: "74a2b5d9 w7-control index-CubiZsMVSwTc.js", cells: {} };
for (const key of CELLS) {
  const m = key.match(/(\d+)x(\d+)([fc])/); const w = +m[1], h = +m[2], touch = m[3] === "c";
  const a = await read(LANE, w, h, touch), b = await read(CTRL, w, h, touch), b2 = await read(CTRL, w, h, touch);
  const pi = {};
  for (const k of Object.keys(SURF)) {
    const x = a[k], y = b[k], z = b2[k]; if (!x || !y) { pi[k] = { lane: !!x, ctrl: !!y }; continue; }
    pi[k] = { dx: +(x.x - y.x).toFixed(2), dy: +(x.y - y.y).toFixed(2), dw: +(x.w - y.w).toFixed(2), dh: +(x.h - y.h).toFixed(2), paint: x.paint === y.paint, tag: x.tag === y.tag,
      noise: z ? +Math.max(Math.abs(z.x - y.x), Math.abs(z.y - y.y), Math.abs(z.w - y.w), Math.abs(z.h - y.h)).toFixed(2) : null };
  }
  out.cells[key] = { coarse: [a.coarse, b.coarse], sameGivens: a.givens === b.givens, nGivens: a.givens.split(",").length,
    overflowX: [a.overflowX, b.overflowX], crossMasthead: [a.crossMasthead, b.crossMasthead], clientH: [a.clientH, b.clientH], footH: [a.footH, b.footH],
    scrollEndBlank: [a.scrollEndBlank, b.scrollEndBlank], scrollEndLowest: [a.scrollEndLowest, b.scrollEndLowest], pi };
  console.log(ENGINE, THEME, key, JSON.stringify(out.cells[key]));
}
writeFileSync(join(OUT, `critic-geom-${ENGINE}-${THEME}.json`), JSON.stringify(out, null, 1));
await browser.close();
console.log("EXIT OK");
