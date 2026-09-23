// T9-W7 pass 5 · CTRL-RULE — copied from pass4/…/pi-width.mjs, OUT re-pointed. Pass-5 changes: the
// toggle selector names the real button (`button.sun-moon-toggle`, the pass-4 selector matched
// nothing), TOUCH=1 reads the coarse regime (hasTouch), and the CONTROL is read TWICE so every
// row prints its own noise floor (control vs control) beside the prototype's delta (LAWS P4).
// T9-W7 pass 4 · CTRL-RULE — π ON THE UNCLAIMED SURFACES + THE CARD'S WIDTH (chair §6.4).
// Pass-3 critique §2: the margin column took the desk card +49.28 px and moved the wordmark, the
// masthead and the drawer tab 24.64 px — surfaces this family does not claim. This probe reads
// both arms on ONE encoded board (pass-4 chair addendum), fine pointer, drawer open, and compares
// rects AND computed paint (font, size, line-height, colour, tag) per surface.
// node pi-width.mjs <chromium|webkit> <PROTO> <CONTROL> <W> <H> [theme]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
mkdirSync(OUT, { recursive: true });
const [ENGINE = "chromium", PROTO = "http://127.0.0.1:4231/", CTRL = "http://127.0.0.1:4232/", W = "1280", H = "800", THEME = "light"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const SURF = {
  masthead: ".masthead", logo: "svg.handwritten-logo", tab: ".drawer-tab", board: ".sudoku-cell",
  grid: ".board-peek-host", case: ".drawer-case", card: ".controls-card", toggle: "button.sun-moon-toggle",
};
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
async function read(base) {
  const TOUCH = process.env.TOUCH === "1";
  const ctx = await browser.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: 1, colorScheme: THEME, hasTouch: TOUCH });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").first().click({ force: true });
    await p.waitForTimeout(1100);
  }
  const r = await p.evaluate((S) => {
    const o = {};
    for (const [k, sel] of Object.entries(S)) {
      const e = document.querySelector(sel);
      if (!e) { o[k] = null; continue; }
      const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
      o[k] = { tag: e.tagName, x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2),
               paint: [cs.fontFamily.slice(0, 24), cs.fontSize, cs.lineHeight, cs.color, cs.backgroundColor].join(" | ") };
    }
    o.givens = document.querySelectorAll(".sudoku-cell .glyph-svg").length;
    o.boardKept = new URLSearchParams(location.search).has("board");
    return o;
  }, SURF);
  await ctx.close();
  return r;
}
const proto = await read(PROTO), ctrl = await read(CTRL), ctrl2 = await read(CTRL);
const rows = Object.keys(SURF).map((k) => {
  const a = proto[k], b = ctrl[k];
  if (!a || !b) return { k, proto: !!a, ctrl: !!b };
  const n = ctrl2[k];
  return { k, dx: +(a.x - b.x).toFixed(2), dy: +(a.y - b.y).toFixed(2), dw: +(a.w - b.w).toFixed(2), dh: +(a.h - b.h).toFixed(2),
           paintSame: a.paint === b.paint, tagSame: a.tag === b.tag, protoW: a.w, ctrlW: b.w,
           noise: n ? Math.max(Math.abs(n.x - b.x), Math.abs(n.y - b.y), Math.abs(n.w - b.w), Math.abs(n.h - b.h)) : null };
});
const out = { engine: ENGINE, viewport: [+W, +H], theme: THEME, control: "74a2b5d9 (w7-control dist, index-CubiZsMVSwTc.js)", board: BOARD,
  givens: [proto.givens, ctrl.givens], boardKept: [proto.boardKept, ctrl.boardKept], rows };
for (const r of rows) console.log(ENGINE, `${W}x${H}`, JSON.stringify(r));
writeFileSync(join(OUT, `pi-width-${ENGINE}-${W}x${H}-${THEME}${process.env.TOUCH === "1" ? "-coarse" : ""}.json`), JSON.stringify(out, null, 1));
await browser.close();
console.log("EXIT OK");
