/**
 * meter-symmetry.mjs — is the fill gauge inset the same on all four sides?
 *
 * R3's census recorded the meter's top stripe OVERHANGING the board box, because the frame
 * rect it retraces shipped `FRAME_X_PAD 12 / FRAME_Y_PAD 0`: pulled in on the sides, flush
 * top and bottom. The number this asks for is one subtraction — |top inset - left inset| in
 * CSS pixels, measured on the painted geometry, at the desk width and on the phone.
 *
 * It reads the trace path's own client rect against the board SVG's, so the wobble and the
 * stroke width are inside the measurement rather than argued around. The gauge is driven to
 * 100% first (every blank filled) so all four sides exist to measure.
 *
 *   ARM=proto node probe/meter-symmetry.mjs     (writes readings/meter-symmetry-<ARM>.json)
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT;
const ARM = process.env.ARM || "proto";

const VIEWPORTS = [
  { name: "desk-1280x800", width: 1280, height: 800, dsf: 1 },
  { name: "phone-393x699", width: 393, height: 699, dsf: 3 },
];

const out = { arm: ARM, rows: [] };
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      colorScheme: "light",
      reducedMotion: "reduce",
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
      isMobile: vp.dsf > 1,
      hasTouch: vp.dsf > 1,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(800);

    // drive the gauge to 100% so every side of the ring is drawn
    const n = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly && !i.value,
        ).length,
    );
    for (let k = 0; k < n + 4; k++) {
      const done = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly,
        );
        const e = ins.findIndex((i) => !i.value);
        if (e < 0) return true;
        ins[e].focus();
        return false;
      });
      if (done) break;
      await page.keyboard.type("1");
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(700);

    const m = await page.evaluate(() => {
      const svg = document.querySelector("svg.hand-drawn-grid");
      const trace = document.querySelector(".progress-pose.is-active .progress-trace");
      if (!svg || !trace) return null;
      const s = svg.getBoundingClientRect();
      const t = trace.getBoundingClientRect();
      // the geometric rect, stroke excluded: getBBox is in viewBox units
      const bb = trace.getBBox();
      const vb = svg.viewBox.baseVal;
      const unit = s.width / vb.width; // CSS px per viewBox unit
      return {
        boardPx: +s.width.toFixed(2),
        boardHeightPx: +s.height.toFixed(2),
        unitPx: +unit.toFixed(5),
        clientInsets: {
          left: +(t.left - s.left).toFixed(2),
          right: +(s.right - t.right).toFixed(2),
          top: +(t.top - s.top).toFixed(2),
          bottom: +(s.bottom - t.bottom).toFixed(2),
        },
        bboxUnits: {
          left: +bb.x.toFixed(2),
          top: +bb.y.toFixed(2),
          right: +(vb.width - (bb.x + bb.width)).toFixed(2),
          bottom: +(vb.height - (bb.y + bb.height)).toFixed(2),
        },
        strokeWidthPx: +(
          parseFloat(getComputedStyle(trace).strokeWidth || "8") * unit
        ).toFixed(2),
        progress: document
          .querySelector('[role="progressbar"]')
          ?.getAttribute("aria-valuenow"),
      };
    });
    if (m) {
      const cl = m.clientInsets;
      m.asymmetryPx = +Math.abs(cl.top - cl.left).toFixed(2);
      m.asymmetryUnits = +Math.abs(m.bboxUnits.top - m.bboxUnits.left).toFixed(2);
    }
    out.rows.push({ engine, viewport: vp.name, ...(m || { error: "no trace" }) });
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/meter-symmetry-${ARM}.json`, JSON.stringify(out, null, 2));
for (const r of out.rows)
  console.log(
    r.engine.padEnd(9),
    r.viewport.padEnd(14),
    "board",
    String(r.boardPx).padStart(7),
    "insets L/T/R/B",
    JSON.stringify(r.clientInsets),
    "|top-left|",
    String(r.asymmetryPx).padStart(6),
    "px   bbox units",
    JSON.stringify(r.bboxUnits),
    "progress",
    r.progress,
  );
