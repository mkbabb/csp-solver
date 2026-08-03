/**
 * W7 residue — the CLOSED-drawer pose's overflow, measured before and after the height gate.
 *
 * The lane cured the OPEN pose (overflow-768.json) and disclosed the CLOSED one: closed, the
 * cap loosens `100dvh − 10rem → 9rem` and the masthead grows `--logo-scale: 1.05`, so the
 * assembly asks ~779px of a 768px page. This rig reads BOTH poses at five cells in both
 * engines, plus the ink probe on the closed 1366×768 top band, and writes one JSON.
 *
 * Settle is POLLED, never slept (the §2 law): fonts first, then two identical reads 250ms apart.
 *
 * Usage: node closed-pose-cure.mjs <before|after>      (BASE defaults to :4247)
 */
import { mkdirSync, writeFileSync } from "node:fs";

const PHASE = process.argv[2] || "after";
const BASE = process.env.BASE || "http://localhost:4247";
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const OUT = `${ROOT}/docs/tranches/2026-08-tranche-7/evidence/w7`;
const pw = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
const sharp = (await import(`${ROOT}/web/frontend/node_modules/sharp/dist/index.cjs`)).default;

const CELLS = [
  { w: 1366, h: 768 },
  { w: 1280, h: 720 },
  { w: 1024, h: 768 },
  { w: 1280, h: 800 },
  { w: 1024, h: 600 },
  { w: 1440, h: 900 }, // the TALL control — the grow must still apply here
  { w: 1920, h: 1080 },
];

const MEASURE = () => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: +b.top.toFixed(2), bottom: +b.bottom.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
  };
  const q = (s) => document.querySelector(s);
  const masthead = q(".masthead");
  const shell = q(".board-shell");
  const cells = q(".board-cells");
  const cs = masthead ? getComputedStyle(masthead) : null;
  const ss = shell ? getComputedStyle(shell) : null;
  return {
    vh: window.innerHeight,
    scrollHeight: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollHeight - window.innerHeight,
    closed: document.documentElement.classList.contains("drawer-closed"),
    masthead: r(masthead),
    board: r(shell),
    grid: r(cells),
    strip: r(q(".board-margin")),
    logoScale: cs ? cs.getPropertyValue("--logo-scale").trim() : null,
    capUsed: ss ? ss.maxWidth : null,
    cell: (() => {
      const c = q(".sudoku-cell");
      return c ? +c.getBoundingClientRect().width.toFixed(2) : null;
    })(),
  };
};

async function settled(page) {
  await page.evaluate(() => document.fonts.ready);
  let prev = await page.evaluate(MEASURE);
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(250);
    const next = await page.evaluate(MEASURE);
    if (JSON.stringify(next) === JSON.stringify(prev)) return next;
    prev = next;
  }
  return prev;
}

/** The lane's ink probe: the top `band` scanlines across the wordmark's own x-span, counting
 *  pixels under luminance 140. The BOX may hang above the fold; the drawn ink may not. */
async function inkProbe(page, box, band = 6) {
  const x = Math.max(0, Math.floor(box.left ?? 0));
  const w = Math.max(1, Math.ceil(box.w));
  const buf = await page.screenshot({ clip: { x, y: 0, width: w, height: band } });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let dark = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (l < 140) dark++;
  }
  return { band, xSpan: [x, x + w], darkPixels: dark };
}

const out = { phase: PHASE, base: BASE, captured: new Date().toISOString().slice(0, 10), engines: {} };

for (const engineName of ["chromium", "webkit"]) {
  const browser = await pw[engineName].launch();
  const eng = { closed: {}, open: {} };
  for (const pose of ["closed", "open"]) {
    for (const cell of CELLS) {
      const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h } });
      if (pose === "closed")
        await ctx.addInitScript(() => window.localStorage.setItem("csp-drawer-open", "0"));
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?game=sudoku&difficulty=EASY`);
      await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
      const m = await settled(page);
      const key = `${cell.w}x${cell.h}`;
      eng[pose][key] = m;
      // The masthead box's x-span, for the ink probe and the crops.
      if (pose === "closed" && cell.w === 1366 && cell.h === 768) {
        const span = await page.evaluate(() => {
          const b = document.querySelector(".masthead").getBoundingClientRect();
          return { left: b.left, w: b.width };
        });
        eng[pose][key].ink = await inkProbe(page, span);
        mkdirSync(`${OUT}`, { recursive: true });
        await page.screenshot({
          path: `${OUT}/closed-pose-cure-${PHASE}-1366x768-${engineName}.png`,
          clip: { x: 0, y: 0, width: 1366, height: 150 },
        });
      }
      await ctx.close();
    }
  }
  // ── THE BOUNDARY control — the derived 896 is only worth its ink if BOTH sides of the flip
  //    are clean. One px below the gate the closed pose must take the open pose's geometry;
  //    one px above it must take the grow whole. 1920×896 is the tightest cell the gate covers
  //    (widest type ⇒ tallest caption ⇒ 892.81 of demand against 896 of supply).
  eng.boundary = {};
  for (const cell of [
    { w: 1366, h: 895 },
    { w: 1366, h: 896 },
    { w: 1920, h: 895 },
    { w: 1920, h: 896 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h } });
    await ctx.addInitScript(() => window.localStorage.setItem("csp-drawer-open", "0"));
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?game=sudoku&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    eng.boundary[`${cell.w}x${cell.h}`] = await settled(page);
    await ctx.close();
  }

  // ── The shell-lg control (Sudoku's 16×16, `?size=4` — the raw subgrid selector). One
  //    condition governs all three rungs, and 56rem's own threshold is 1055.53, so this rung
  //    is the disclosure: cured below the gate, unchanged above it. Measured, not asserted.
  eng.lg = {};
  for (const cell of [
    { w: 1440, h: 900 },
    { w: 1366, h: 768 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h } });
    await ctx.addInitScript(() => window.localStorage.setItem("csp-drawer-open", "0"));
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?game=sudoku&size=4&difficulty=EASY`);
    await page.waitForSelector(".board-shell.shell-lg", { timeout: 30000 });
    eng.lg[`${cell.w}x${cell.h}`] = await settled(page);
    await ctx.close();
  }
  out.engines[engineName] = eng;
  await browser.close();
}

writeFileSync(`${OUT}/closed-pose-cure-${PHASE}.json`, JSON.stringify(out, null, 1));
console.log(`wrote closed-pose-cure-${PHASE}.json`);
for (const [e, v] of Object.entries(out.engines))
  for (const pose of ["closed", "open", "boundary", "lg"])
    for (const [k, m] of Object.entries(v[pose]))
      console.log(
        `${e.padEnd(9)} ${pose.padEnd(7)} ${k.padEnd(10)} overflow ${String(m.overflow).padStart(3)}  mastheadTop ${String(m.masthead.top).padStart(7)}  board ${m.board.w}x${m.board.h}  scale ${m.logoScale}`,
      );
