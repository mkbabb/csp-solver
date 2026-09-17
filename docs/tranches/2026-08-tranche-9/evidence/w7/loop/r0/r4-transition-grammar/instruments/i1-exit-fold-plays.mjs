#!/usr/bin/env node
/**
 * I1 — THE GALLERY EXIT'S BOARD FOLD MUST PLAY.  BORN RED.
 *
 * App.vue's exit (`unfoldToBoard` → `runFold`) declares the board the exit's protagonist:
 * "the chosen card unfolds back to a full board", a 520 ms glass FLIP on `.board-peek-host`.
 * The mover is CREATED — `Element.animate` is called with the right keyframes — and then
 * lands `playState: "finished"` at `currentTime: 520` before its first frame paints, so the
 * board CUTS to full size while the wordmark glides beside it for the whole 520 ms.
 *
 * WHAT THIS ASSERTS
 *   1. the exit creates a mover on `.board-peek-host` (it does today), AND
 *   2. that mover is observed `running` for at least MIN_RUNNING frames, AND
 *   3. the host's computed transform is not `none` while it runs.
 *
 * Checks 2 and 3 are the RED. Run it against a BUILT dist (goldens discipline), e.g.
 *   npx vite build --outDir /tmp/dist && (cd /tmp/dist && python3 -m http.server 4231)
 *   BASE=http://127.0.0.1:4231/ node i1-exit-fold-plays.mjs
 * ENGINE=webkit switches engines; VW/VH set the viewport (default the phone, 390x844).
 *
 * READING AT HEAD (2026-09-17, tree carrying W1/W2/W4/W5 + uncommitted W3/W6):
 *   390x844 chromium  RED — .board-peek-host finished/520 at t+11.6 ms, transform `none`
 *   1440x900 chromium RED — finished/520 at t+14.1 ms
 *   390x844 webkit    RED — finished/520 at t+22 ms
 *   the ENTER's twin mover plays 0→520 normally in all three, which is the control.
 */
import { createRequire } from "node:module";
import process from "node:process";

// This instrument lives under docs/, so playwright is resolved out of the frontend's own
// node_modules (FE overrides the path). It is CJS — `require`, not a dynamic import.
const FE = process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const { chromium, webkit } = createRequire(FE + "/package.json")("playwright");

const BASE = process.env.BASE ?? "http://127.0.0.1:4231/";
const VW = Number(process.env.VW ?? 390);
const VH = Number(process.env.VH ?? 844);
const MIN_RUNNING = 3; // frames; a 520 ms mover owes far more, this is the floor

const WATCH = `
window.__A = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  const a = orig.call(this, kf, opts);
  let cls = null;
  try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')); } catch {}
  window.__A.push({ a, el: this, cls: String(cls || '') });
  return a;
};
window.__Aclear = () => { window.__A = []; };
window.__Awatch = (ms) => new Promise((res) => {
  const t0 = performance.now(); const rec = new Map();
  const step = () => {
    for (const r of window.__A) {
      const row = rec.get(r) ?? { cls: r.cls, running: 0, states: [], transforms: new Set() };
      row.states.push(r.a.playState);
      if (r.a.playState === 'running') { row.running++; try { row.transforms.add(getComputedStyle(r.el).transform); } catch {} }
      rec.set(r, row);
    }
    if (performance.now() - t0 < ms) requestAnimationFrame(step);
    else res([...rec.values()].map((v) => ({ cls: v.cls, running: v.running, first: v.states[0], transforms: [...v.transforms].slice(0, 3) })));
  };
  requestAnimationFrame(step);
});
`;

const engine = process.env.ENGINE === "webkit" ? webkit : chromium;
const browser = await engine.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: VW < 1024 ? 3 : 2,
  hasTouch: VW < 1024,
  isMobile: VW < 1024,
});
const page = await ctx.newPage();
await page.addInitScript(WATCH);
await page.goto(BASE + "?size=3&difficulty=EASY");
await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => document.activeElement?.blur?.());

// ENTER (the control — this fold is known to play)
await page.evaluate("window.__Aclear()");
let w = page.evaluate("window.__Awatch(800)");
await page.keyboard.press("g");
const enter = await w;
await new Promise((r) => setTimeout(r, 2200));

// EXIT (the subject)
await page.evaluate("window.__Aclear()");
w = page.evaluate("window.__Awatch(800)");
await page.keyboard.press("Escape");
const exit = await w;
await browser.close();

const pick = (rows) => rows.find((r) => /board-peek-host/.test(r.cls));
const e = pick(enter);
const x = pick(exit);
const fails = [];
if (!e || e.running < MIN_RUNNING) fails.push(`CONTROL BROKEN: the ENTER's board fold did not run (${JSON.stringify(e)})`);
if (!x) fails.push("the EXIT created no mover on .board-peek-host at all");
else {
  if (x.running < MIN_RUNNING)
    fails.push(`the EXIT's board fold ran for ${x.running} frames (floor ${MIN_RUNNING}); first observed state "${x.first}"`);
  if (x.transforms.length && x.transforms.every((t) => t === "none"))
    fails.push(`the EXIT's board fold never put a transform on the host (saw ${JSON.stringify(x.transforms)})`);
}

console.log(`engine=${process.env.ENGINE ?? "chromium"} viewport=${VW}x${VH}`);
console.log("  ENTER .board-peek-host:", JSON.stringify(e));
console.log("  EXIT  .board-peek-host:", JSON.stringify(x));
if (fails.length) {
  console.log("RED");
  for (const f of fails) console.log("  · " + f);
  process.exit(1);
}
console.log("GREEN");
