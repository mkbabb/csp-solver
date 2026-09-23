// T9-W7 pass 5 · CTRL-RULE — the four crops (each a REPLACEMENT naming the pass-4 crop it retires).
// Every arm deals ONE encoded payload (below); each pair differs by ONE variable.
//  f1  T9-B13 the form, chromium · light · 1280×800 · fine · card at its scroll END: arm (b) this tree's
//      one drawn top rule (:4233) | arm (a) a closed HandDrawnOutline 1.5/4/3/0 + the pad it needs (:4234)
//  f2  T9-B13 the form, webkit · light · 390×844 · coarse (hasTouch, witnessed) · scroll END, same two arms
//  f3  the rule weight, chromium · light · 390×844 · coarse · rest: 3px (shipped) | 2px (injected on the path)
//  f4  deal's question in its own row, webkit · dark · 390×844 · coarse, armed on a dirty board
// node p5-frames.mjs
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "frames");
mkdirSync(OUT, { recursive: true });
const B = "http://127.0.0.1:4233/", A = "http://127.0.0.1:4234/";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
async function shot(E, base, { w, h, touch, theme, pose, css, dirty, arm, crop }) {
  const b = await E.launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: touch, isMobile: touch && E === chromium, colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.waitForTimeout(2000);
  const givens = await p.evaluate(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length);
  if (touch && !(await p.evaluate(() => matchMedia("(pointer: coarse)").matches))) throw new Error("coarse not witnessed");
  if (dirty) {
    const blank = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")));
    await p.locator(".sudoku-cell").nth(blank).click({ force: true });
    await p.evaluate((i) => { const input = document.querySelectorAll(".sudoku-cell input")[i];
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1"); input.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
    await p.waitForTimeout(400);
  }
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; }
  if (css) await p.addStyleTag({ content: css });
  if (pose === "end") await p.evaluate(() => { const c = document.querySelector(".controls-card"); c.scrollTop = c.scrollHeight; });
  if (arm) { await p.locator(arm).first().scrollIntoViewIfNeeded(); await p.locator(arm).first().click(); await p.waitForTimeout(400); }
  await p.waitForTimeout(500);
  const r = await p.evaluate((crop) => { const cs = document.querySelector(".drawer-case").getBoundingClientRect();
    const t = crop === "foot" ? Math.max(cs.top, cs.bottom - 230) : crop === "deal" ? document.querySelector(".deal-row").getBoundingClientRect().top - 60 : cs.top;
    const bottom = crop === "deal" ? document.querySelector(".deal-row").getBoundingClientRect().bottom + 60 : crop === "rest" ? Math.min(innerHeight, cs.top + 330) : Math.min(innerHeight, cs.bottom + 6);
    return { x: Math.max(0, cs.left - 6), y: Math.max(0, t), width: Math.min(innerWidth, cs.right + 6) - Math.max(0, cs.left - 6), height: bottom - Math.max(0, t) }; }, crop);
  const buf = await p.screenshot({ clip: r });
  await b.close();
  return { buf, givens };
}
async function twoUp(name, a, b) {
  const ma = await sharp(a).metadata(), mb = await sharp(b).metadata();
  const H = Math.max(ma.height, mb.height), gap = 16;
  const img = sharp({ create: { width: ma.width + mb.width + gap, height: H, channels: 3, background: { r: 128, g: 128, b: 128 } } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: ma.width + gap, top: 0 }]);
  await img.png({ palette: true, quality: 80, compressionLevel: 9 }).toFile(join(OUT, name));
}
const f1 = [await shot(chromium, B, { w: 1280, h: 800, touch: false, theme: "light", pose: "end", crop: "foot" }), await shot(chromium, A, { w: 1280, h: 800, touch: false, theme: "light", pose: "end", crop: "foot" })];
await twoUp("f1-b13-form-rule-vs-frame-chromium-light-1280x800-fine-scrollend.png", f1[0].buf, f1[1].buf);
const f2 = [await shot(webkit, B, { w: 390, h: 844, touch: true, theme: "light", pose: "end", crop: "foot" }), await shot(webkit, A, { w: 390, h: 844, touch: true, theme: "light", pose: "end", crop: "foot" })];
await twoUp("f2-b13-form-rule-vs-frame-webkit-light-390x844-coarse-scrollend.png", f2[0].buf, f2[1].buf);
const f3 = [await shot(chromium, B, { w: 390, h: 844, touch: true, theme: "light", pose: "rest", crop: "rest" }), await shot(chromium, B, { w: 390, h: 844, touch: true, theme: "light", pose: "rest", crop: "rest", css: ".ruled-line path { stroke-width: 2 !important; }" })];
await twoUp("f3-rule-weight-3px-vs-2px-chromium-light-390x844-coarse-rest.png", f3[0].buf, f3[1].buf);
const f4 = await shot(webkit, B, { w: 390, h: 844, touch: true, theme: "dark", pose: "rest", dirty: true, arm: '.controls-card button[aria-label="Deal a new board"]', crop: "deal" });
await sharp(f4.buf).png({ palette: true, quality: 80, compressionLevel: 9 }).toFile(join(OUT, "f4-deal-asks-in-its-row-webkit-dark-390x844-coarse-armed.png"));
console.log("givens", [...f1, ...f2, ...f3, f4].map((x) => x.givens).join(","));
console.log("EXIT OK");
