// T9-W7 pass 5 · CRITIC · CTRL-RULE — the foot's drawn rule, PAINTED, with the CORE statistic (not the
// lane's per-column best pixel). DPR 2, card at scroll END (fade off), rest pose. Per column over the
// central 90 % of the rule: core_X = mean luminance of the band's pixels whose ink ≥ X % of the
// column's max ink (X = 50/70/90/100; 100 = the lane's best pixel), contrast vs the ground the stroke
// ABUTS, read on BOTH sides (median of a strip 3–6 css above the band / 2–3 css below it). Rows: worst
// column, p10, median, fraction < 3.0, per X, per side. Both themes, 390×844 coarse + 1280×800 fine.
// node critic-foot-rule.mjs <chromium|webkit> <BASE>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, BASE] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const q = (a, f) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(f * s.length))]; };
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const rows = [];
for (const theme of ["light", "dark"]) for (const [w, h, touch] of [[390, 844, true], [1280, 800, false]]) {
  const DPR = +(process.env.DPR || 2);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: DPR, hasTouch: touch, isMobile: touch && ENGINE === "chromium", colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; }
  await p.evaluate(() => { const c = document.querySelector(".controls-card"); c.scrollTop = c.scrollHeight; });
  await p.waitForTimeout(600);
  const bb = await p.evaluate(() => {
    const path = document.querySelector("#card-foot svg.ruled-line path"); if (!path) return null;
    const m = path.getScreenCTM(), b = path.getBBox();
    const a = new DOMPoint(b.x, b.y).matrixTransform(m), c = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(m);
    return { l: Math.min(a.x, c.x), r: Math.max(a.x, c.x), t: Math.min(a.y, c.y), b: Math.max(a.y, c.y), sw: getComputedStyle(path).strokeWidth, stroke: getComputedStyle(path).stroke, op: getComputedStyle(path).strokeOpacity };
  });
  if (!bb) { rows.push({ theme, cell: `${w}x${h}`, err: "no foot rule" }); await ctx.close(); continue; }
  const pad = 3, top = Math.max(0, Math.floor(bb.t - 8)), bot = Math.ceil(bb.b + 5);
  const png = await p.screenshot({ clip: { x: bb.l, y: top, width: bb.r - bb.l, height: bot - top } });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => { const i = (y * info.width + x) * info.channels; return Lum(data[i], data[i + 1], data[i + 2]); };
  const bandT = Math.round((bb.t - top - 1) * DPR), bandB = Math.round((bb.b - top + 1) * DPR);
  const aboveT = Math.max(0, Math.round((bb.t - top - 6) * DPR)), aboveB = Math.max(1, Math.round((bb.t - top - 3) * DPR));
  const belowT = Math.min(info.height - 2, Math.round((bb.b - top + 2) * DPR)), belowB = Math.min(info.height, Math.round((bb.b - top + 3) * DPR));
  const x0 = Math.floor(info.width * 0.05), x1 = Math.ceil(info.width * 0.95);
  const res = {};
  for (const side of ["above", "below"]) for (const X of [0.5, 0.7, 0.9, 1.0]) {
    const col = [];
    for (let x = x0; x < x1; x++) {
      const g = []; const [gt, gb] = side === "above" ? [aboveT, aboveB] : [belowT, belowB];
      for (let y = gt; y < gb; y++) g.push(px(x, y));
      const ground = q(g, 0.5);
      const band = []; for (let y = Math.max(0, bandT); y < Math.min(info.height, bandB); y++) band.push(px(x, y));
      const ink = band.map((l) => Math.abs(l - ground)); const mx = Math.max(...ink);
      if (mx <= 0) { col.push(1); continue; }
      const core = band.filter((l, i) => ink[i] >= X * mx - 1e-9);
      const lm = core.reduce((s, v) => s + v, 0) / core.length;
      col.push(CR(lm, ground));
    }
    res[`${side}@${X * 100}`] = { worst: +Math.min(...col).toFixed(3), p10: +q(col, 0.1).toFixed(3), median: +q(col, 0.5).toFixed(3), under3: +(col.filter((c) => c < 3).length / col.length).toFixed(3) };
  }
  // ground luminance printed so the reader can see what the stroke sits on
  const gA = [], gB = []; for (let x = x0; x < x1; x += 7) { for (let y = aboveT; y < aboveB; y++) gA.push(px(x, y)); for (let y = belowT; y < belowB; y++) gB.push(px(x, y)); }
  rows.push({ theme, cell: `${w}x${h}${touch ? " coarse" : " fine"}`, strokeWidth: bb.sw, stroke: bb.stroke, strokeOpacity: bb.op, groundAbove: [+Math.min(...gA).toFixed(3), +Math.max(...gA).toFixed(3)], groundBelow: [+Math.min(...gB).toFixed(3), +Math.max(...gB).toFixed(3)], ...res });
  console.log(ENGINE, theme, w, JSON.stringify(rows.at(-1)));
  await ctx.close();
}
writeFileSync(join(OUT, `critic-foot-rule-${ENGINE}-dpr${process.env.DPR || 2}.json`), JSON.stringify({ engine: ENGINE, board: BOARD, rows }, null, 1));
await browser.close();
console.log("EXIT OK");
