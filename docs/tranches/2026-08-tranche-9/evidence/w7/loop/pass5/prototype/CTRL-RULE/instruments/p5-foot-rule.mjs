// T9-W7 pass 5 · CTRL-RULE — THE FOOT'S OWN RULE, PAINTED (INTAKE row 27: arm (b)'s 1.4.11).
// The intake read "1.638/1.651 light" for a top rule on main; this tree's rule is the page's own
// RuledLine at 3px on `--ink-press-rule`. Per column across the central 90 % of the rule: the
// most-contrasting pixel in the stroke band against the GROUND THE STROKE ABUTS (the foot's own
// paper, sampled as the median of a 6-device-px strip starting 4 css px under the band), rest
// pose, the card at its scroll END (fade off). The sensitivity row: worst / p10 / p30 / median of
// the column distribution, and the fraction of columns under 3:1. DPR 2.
// node p5-foot-rule.mjs <chromium|webkit> <BASE> <arm>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
mkdirSync(OUT, { recursive: true });
const [ENGINE = "chromium", BASE = "http://127.0.0.1:4233/", ARM = "proto"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const rows = [];
for (const theme of ["light", "dark"]) for (const [w, h, touch] of [[1280, 800, false], [390, 844, true]]) {
  const DPR = 2;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: DPR, hasTouch: touch, isMobile: touch && ENGINE === "chromium", colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.waitForTimeout(1800);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; }
  await p.evaluate(() => { const c = document.querySelector(".controls-card"); c.scrollTop = c.scrollHeight; });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const s = document.querySelector(".action-bar > svg.ruled-line");
    if (s) { const b = s.getBoundingClientRect(); return { mode: "rule", x: b.left, y: b.top, w: b.width, h: b.height }; }
    // ARM A (T9-B13, the closed frame): the frame's TOP edge. The svg is outset 4 css around the bar;
    // the band is svg-top − 4 (the path's bbox rises 2.5 css ABOVE its svg box, plus the stroke's
    // half-width) .. bar-top+3, the ground the 3 css strip at bar-top+4.5 (the bar's first
    // buttons start at bar-top+8, read on the arm-A dist at 1280x800).
    const f = document.querySelector(".action-bar > .bar-frame svg"), bar = document.querySelector(".action-bar");
    if (!f || !bar) return null;
    const b = f.getBoundingClientRect(), t = bar.getBoundingClientRect().top;
    return { mode: "frame", x: b.left, y: b.top, w: b.width, h: t + 3 - b.top, barTop: t };
  });
  if (!r) { rows.push({ theme, cell: `${w}x${h}`, error: "no foot rule" }); await ctx.close(); continue; }
  const frame = r.mode === "frame";
  // RULE MODE's ground is the strip ABOVE the band (2..5 css over the svg box). The first cut sampled 4 css
  // UNDER the band and, at 390 wide, landed on the verbs' own grey frames (their tops sit 10 css under the
  // svg's top) — 23 % of webkit's columns read "under 3:1" against a grey button edge, not the paper.
  const clipY = frame ? Math.floor(r.y - 4) : Math.floor(r.y - 2 - 5);
  const clip = { x: Math.round(r.x + r.w * 0.05), y: clipY, width: Math.round(r.w * 0.9), height: Math.ceil(r.h + 4 + 4 + 3 + (frame ? 4 : 0)) };
  const buf = await p.screenshot({ clip });
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => { const i = (y * info.width + x) * 3; return L(data[i], data[i + 1], data[i + 2]); };
  const b0 = frame ? 0 : Math.round(5 * DPR); // the band's first row in the clip
  const bandH = frame ? Math.round((r.barTop + 3 - clipY) * DPR) : Math.round((r.h + 4) * DPR); // the stroke band: the svg box ± 2 css
  const g0 = frame ? Math.round((r.barTop + 4.5 - clipY) * DPR) : 0; // ground strip: frame = inside the bar; rule = 5..2 css above the band
  const cols = [], gl = [];
  for (let x = 0; x < info.width; x++) {
    const ground = []; for (let y = g0; y < Math.min(info.height, g0 + 6); y++) ground.push(px(x, y)); ground.sort((a, b) => a - b);
    const Lg = ground[Math.floor(ground.length / 2)];
    gl.push(Lg);
    let m = 1; for (let y = b0; y < b0 + bandH; y++) m = Math.max(m, CR(px(x, y), Lg));
    cols.push(m);
  }
  cols.sort((a, b) => a - b);
  const q = (f) => +cols[Math.min(cols.length - 1, Math.floor(cols.length * f))].toFixed(3);
  rows.push({ theme, cell: `${w}x${h}`, mode: r.mode, worst: q(0), p10: q(0.1), p30: q(0.3), median: q(0.5), fracUnder3: +(cols.filter((c) => c < 3).length / cols.length).toFixed(3), n: cols.length,
    groundL: [+Math.min(...gl).toFixed(3), +Math.max(...gl).toFixed(3)] });
  await ctx.close();
}
writeFileSync(join(OUT, `p5-foot-rule-${ARM}-${ENGINE}.json`), JSON.stringify({ engine: ENGINE, base: BASE, rows }, null, 1));
for (const r of rows) console.log(JSON.stringify(r));
await browser.close();
console.log("EXIT OK");
