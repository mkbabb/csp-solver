// run: cd web/frontend && node ../../docs/tranches/2026-08-tranche-9/evidence/w8/attribution/A4/gesture-geometry.mjs --engine chromium --regime mobile --port 4253 --out <file.jsonl>
//
// A4 · IS THE MOTION CONTINUOUS? A frame census says whether frames LANDED; it cannot say
// whether what they drew moved smoothly. This samples the movers' own rects once per rAF
// across the open and the close, and reports the biggest single-frame jump of each — the
// number that separates a CURVE verdict (a discontinuity the frames rendered perfectly) from
// a FRAMES verdict (a mechanism defect).
//
// Movers sampled: `.scene-controls` (the case/sheet — the WAAPI mover), `.drawer-tab` (the
// tongue, which TELEPORTS berths on the same state flip), `.board-peek-host` (the worksheet,
// desk only — `hostMoved` is false on the fixed mobile sheet).
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/";
const pw = createRequire(FE + "package.json")("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => (argv.indexOf("--" + k) === -1 ? d : argv[argv.indexOf("--" + k) + 1]);
const ENGINE = arg("engine", "chromium");
const REGIME = arg("regime", "mobile");
const PORT = arg("port", "4253");
const OUT = arg("out", null);
const CYCLES = Number(arg("cycles", "3"));
const V = {
  desk: { viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
}[REGIME];

const isVisible = `(el) => { if (!el) return false; const r = el.getClientRects(); if (!r.length) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.01; }`;
const BOARD_READY = `async () => {
  const vis = ${isVisible};
  const t0 = performance.now();
  while (performance.now() - t0 < 30000) {
    const bg = document.querySelector(".board-group");
    const c = document.querySelector(".board-cells .game-cell");
    if (vis(bg) && c && c.getBoundingClientRect().width > 0 && vis(c)) {
      await new Promise((r) => requestAnimationFrame(r));
      return performance.now();
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  throw new Error("board-ready timeout");
}`;

// samples for `ms` from NOW, one rect set per rAF, then clicks the tongue on frame 1.
const SAMPLE = `async (ms) => {
  const sel = [".scene-controls", ".drawer-tab", ".board-peek-host"];
  const vis = ${isVisible};
  const out = [];
  const t0 = performance.now();
  const el = Array.from(document.querySelectorAll(".drawer-tab")).filter(vis)[0];
  let clicked = false;
  await new Promise((done) => {
    (function tick(t) {
      const row = { t: +(t - t0).toFixed(2) };
      for (const s of sel) {
        const e = document.querySelector(s);
        if (!e) { row[s] = null; continue; }
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        row[s] = [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2), cs.visibility === "hidden" ? 0 : 1];
      }
      row.parent = document.querySelector(".drawer-tab")?.parentElement?.id ?? null;
      out.push(row);
      if (!clicked) { clicked = true; el.click(); }
      if (t - t0 < ms) requestAnimationFrame(tick); else done();
    })(performance.now());
  });
  return out;
}`;

function jumps(rows, key) {
  // per-frame delta of the rect's top-left; a visible→hidden or berth change is flagged.
  let max = 0,
    maxAt = null,
    disc = [];
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1][key],
      b = rows[i][key];
    if (!a || !b) continue;
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (a[4] !== b[4]) disc.push({ frame: i, t: rows[i].t, kind: "visibility " + a[4] + "->" + b[4] });
    if (d > max) {
      max = d;
      maxAt = { frame: i, t: rows[i].t, from: [a[0], a[1]], to: [b[0], b[1]] };
    }
  }
  for (let i = 1; i < rows.length; i++)
    if (rows[i - 1].parent !== rows[i].parent)
      disc.push({ frame: i, t: rows[i].t, kind: "berth " + rows[i - 1].parent + "->" + rows[i].parent });
  return { maxJumpPx: +max.toFixed(2), maxAt, discontinuities: disc };
}

const browser = await pw[ENGINE].launch();
const ctx = await browser.newContext(V);
const page = await ctx.newPage();
await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, { waitUntil: "load" });
await page.evaluate(`(${BOARD_READY})()`);
await page.waitForTimeout(400);

for (let c = 0; c < CYCLES; c++) {
  for (const phase of ["open", "close"]) {
    const rows = await page.evaluate(`(${SAMPLE})(760)`);
    const row = {
      lane: "A4",
      probe: "gesture-geometry",
      engine: ENGINE,
      regime: REGIME,
      cpu: "1x",
      network: "unthrottled",
      cycle: c,
      phase,
      frames: rows.length,
      sheet: jumps(rows, ".scene-controls"),
      tongue: jumps(rows, ".drawer-tab"),
      worksheet: jumps(rows, ".board-peek-host"),
      firstSheetY: rows[0][".scene-controls"]?.[1] ?? null,
      lastSheetY: rows[rows.length - 1][".scene-controls"]?.[1] ?? null,
    };
    console.log(JSON.stringify(row));
    if (OUT) {
      mkdirSync(dirname(OUT), { recursive: true });
      appendFileSync(OUT, JSON.stringify(row) + "\n");
    }
    await page.waitForTimeout(500);
  }
}
await browser.close();
