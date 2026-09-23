/**
 * ACC-GRAPHITE pass 6 — the §2.12 / LAWS-P5 painted-contrast rows for the band, your digit and the
 * wash, from PAINTED bytes, both themes, both engines, DPR 1 and 2, tree vs control on ONE payload.
 *   band  (a ring): ring-ON minus ring-OFF (`.cell-ghost` hidden) on the focused cell; every changed
 *         pixel against its own ground; core = pixels whose luminance move ≥ 50/70/90/100 % of the
 *         p98 move; core median + fraction of core pixels < 3.0 + worst column, per sensitivity rung.
 *         TWO bare photographs; the minimum is the lower worst column of the two.
 *   digit (TEXT): the glyph-text statistic — glyph-ON minus glyph-OFF (`.glyph-svg` hidden) on the
 *         cell holding YOUR digit; the population is every changed pixel (glyph coverage), core
 *         median ≥ 4.5 and the fraction < 4.5 STATED beside the control's own fraction; a given
 *         digit read the same way is the estate's own reference.
 *   wash  (a GROUND): wash-ON minus wash-OFF (`.cell-peer` hidden) over the glyph-free, rule-free
 *         pixels of the reach (OFF pixel within 6 levels of the card's paper): the median step and
 *         its p10/p90 — no floor (a ground ranks against grounds, check-ink-pressure's rank).
 * Coefficients: coreContrast is CTRL-TAPE's pass-6 helper (p6-lib.mjs), copied verbatim.
 *   node aa6.mjs <treeBase> <controlBase> <outJson>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
import { writeFileSync } from "node:fs";

const [TREE, CONTROL, OUT] = process.argv.slice(2);
// mintBoard(3, 30), the pass-5 payload (band-lib.ts), pre-encoded by the app's own codec.
const PAYLOAD = process.env.PAYLOAD;
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s.length ? +s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))].toFixed(3) : null; };

async function shot(page, clip) {
  const { data, info } = await sharp(await page.screenshot({ clip, caret: "hide" })).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
async function differential(page, clip, hideCss) {
  const on = await shot(page, clip), on2 = await shot(page, clip);
  const tag = await page.addStyleTag({ content: hideCss });
  await page.waitForTimeout(200);
  const off = await shot(page, clip);
  await tag.evaluate((n) => n.remove());
  await page.waitForTimeout(150);
  const mask = new Uint8Array(on.w * on.h);
  for (let i = 0; i < on.w * on.h; i++) { const o = i * 4; if (Math.max(...[0, 1, 2].map((k) => Math.abs(on.data[o + k] - off.data[o + k]))) > 24) mask[i] = 1; }
  return { on, on2, off, mask, w: on.w, h: on.h };
}
function coreContrast(d, on, floor) {
  const { off, mask, w, h } = d;
  const moves = [];
  for (let i = 0; i < w * h; i++) { if (!mask[i]) continue; const o = i * 4; const lo = lum(on.data[o], on.data[o + 1], on.data[o + 2]), lg = lum(off.data[o], off.data[o + 1], off.data[o + 2]); moves.push({ i, move: Math.abs(lo - lg), r: ratio(lo, lg) }); }
  if (!moves.length) return null;
  const sm = moves.map((m) => m.move).sort((a, b) => a - b);
  const maxMove = sm[Math.floor(0.98 * (sm.length - 1))];
  const sens = {};
  for (const pct of [0.5, 0.7, 0.9, 1.0]) {
    const core = moves.filter((m) => m.move >= pct * maxMove * 0.999);
    const cols = new Map();
    for (const m of core) { const x = m.i % w; cols.set(x, Math.max(cols.get(x) ?? 0, m.r)); }
    const cv = [...cols.values()];
    sens[`${pct * 100}%`] = { n: core.length, median: q(core.map((m) => m.r), 0.5), fracUnder: +(core.filter((m) => m.r < floor).length / core.length).toFixed(3), worstCol: cv.length ? +Math.min(...cv).toFixed(3) : null, fracColsUnder: cv.length ? +(cv.filter((v) => v < floor).length / cv.length).toFixed(3) : null };
  }
  const all = moves.map((m) => m.r);
  return { changed: moves.length, median: q(all, 0.5), fracUnder: +(all.filter((v) => v < floor).length / all.length).toFixed(3), sens };
}
function washStep(d) {
  const { on, off, w, h } = d;
  const Lp = (im, i) => 0.2126 * im.data[i * 4] + 0.7152 * im.data[i * 4 + 1] + 0.0722 * im.data[i * 4 + 2];
  const Ls = []; for (let i = 0; i < w * h; i++) Ls.push(Lp(off, i));
  const paper = q(Ls, 0.5);
  const steps = [];
  for (let i = 0; i < w * h; i++) { if (Math.abs(Lp(off, i) - paper) > 6) continue; const o = i * 4; steps.push(ratio(lum(on.data[o], on.data[o + 1], on.data[o + 2]), lum(off.data[o], off.data[o + 1], off.data[o + 2]))); }
  return { n: steps.length, median: q(steps, 0.5), p10: q(steps, 0.1), p90: q(steps, 0.9) };
}

const rows = [];
for (const [ename, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch(ename === "chromium" ? { args: ["--force-color-profile=srgb"] } : {});
  for (const theme of ["light", "dark"]) for (const dpr of [1, 2]) for (const [arm, base] of [["tree", TREE], ["control", CONTROL]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: theme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${PAYLOAD}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60000 });
    await page.waitForTimeout(2500);
    const idx = await page.evaluate(() => { const ins = [...document.querySelectorAll(".game-cell input")]; const g = ins.map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")); for (const i of [30, 31, 39, 40, 41, 48, 49, 32]) if (!g[i] && i % 9 > 0 && !g[i - 1]) return i; return 40; });
    const givenIdx = await page.evaluate(() => [...document.querySelectorAll(".game-cell input")].findIndex((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
    // your digit in the neighbour, then the ring on idx by a real key
    await page.locator(".game-cell input").nth(idx - 1).focus();
    await page.keyboard.type("5");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1200);
    const fv = await page.evaluate(() => document.activeElement?.matches(":focus-visible") ?? false);
    const box = async (i) => { const b = await page.locator(".game-cell").nth(i).boundingBox(); return { x: Math.round(b.x - 8), y: Math.round(b.y - 8), width: Math.round(b.width + 16), height: Math.round(b.height + 16) }; };
    const cellBox = async (i) => { const b = await page.locator(".game-cell").nth(i).boundingBox(); return { x: Math.round(b.x + 1), y: Math.round(b.y + 1), width: Math.round(b.width - 2), height: Math.round(b.height - 2) }; };
    // mark the three subject cells (the cells are not one parent's children, so no :nth-child)
    const givenIdx0 = givenIdx;
    await page.evaluate(([a, b, g]) => { const c = document.querySelectorAll(".game-cell"); c[a]?.setAttribute("data-aa", "ring"); c[b]?.setAttribute("data-aa", "digit"); c[g]?.setAttribute("data-aa", "given"); }, [idx, idx - 1, givenIdx0]);
    const R = await differential(page, await box(idx), `[data-aa="ring"] .cell-ghost{visibility:hidden !important}`);
    const band1 = coreContrast(R, R.on, 3.0), band2 = coreContrast(R, R.on2, 3.0);
    const D = await differential(page, await cellBox(idx - 1), `[data-aa="digit"] .glyph-svg{visibility:hidden !important}`);
    const digit1 = coreContrast(D, D.on, 4.5), digit2 = coreContrast(D, D.on2, 4.5);
    const G = await differential(page, await cellBox(givenIdx), `[data-aa="given"] .glyph-svg{visibility:hidden !important}`);
    const given = coreContrast(G, G.on, 4.5);
    // the wash: a washed cell in the focused cell's row, away from the ring
    const washIdx = await page.evaluate((f) => { const cells = [...document.querySelectorAll(".game-cell")]; for (const [i, c] of cells.entries()) if (i !== f && i !== f - 1 && c.querySelector(".cell-peer") && !c.querySelector(".glyph-svg")) return i; return -1; }, idx);
    const wash = washIdx >= 0 ? washStep(await differential(page, await cellBox(washIdx), `.cell-peer{visibility:hidden !important}`)) : null;
    const nthOk = await page.evaluate(() => ({ ringCellIsFocused: !!document.querySelector('[data-aa="ring"]')?.contains(document.activeElement), digitCellHasGlyph: !!document.querySelector('[data-aa="digit"] .glyph-svg'), givenHasGlyph: !!document.querySelector('[data-aa="given"] .glyph-svg') }));
    const row = { engine: ename, theme, dpr, arm, fv, idx, washIdx, nthOk, band: { p1: band1, p2: band2 }, digit: { p1: digit1, p2: digit2 }, given, wash };
    rows.push(row);
    const s = (c, k) => c ? `${c.sens[k].median}/${c.sens[k].fracUnder}/${c.sens[k].worstCol}` : "—";
    console.log(`AA ${ename} ${theme} dpr${dpr} ${arm} fv=${fv} nth=${JSON.stringify(nthOk)} · band med ${band1?.median} frac<3 ${band1?.fracUnder} [50% ${s(band1, "50%")} · 70% ${s(band1, "70%")} · 90% ${s(band1, "90%")} · 100% ${s(band1, "100%")}] worstCol p1/p2 ${band1?.sens["50%"].worstCol}/${band2?.sens["50%"].worstCol} · digit med ${digit1?.median} frac<4.5 ${digit1?.fracUnder} [50% ${s(digit1, "50%")}] p2 med ${digit2?.median} · given med ${given?.median} frac<4.5 ${given?.fracUnder} · wash ${wash ? `${wash.median} [p10 ${wash.p10} p90 ${wash.p90}] n ${wash.n}` : "—"}`);
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows));
