/**
 * ACC-FIVE pass 7 · INTAKE-23 row 21 / T9-B26 arm (b′): the deal's reveal wave on the hand's clock, read against
 * arm (a) (the wall clock, `createStrokeDrawIn`), POST-PAINT. The census's GV columns (INTAKE-23 census/drawin
 * README "Given glyphs and the tally"): wave window (first ink → all inked), painted frames in it, dt max, the
 * worst MEAN-progress Δ in one painted frame. NOT ONE PAYLOAD: the wave is born only on a fresh deal
 * (`useGameState.ts:596` marks the dealt givens `animatingCells`); a `?board=` payload restores with no
 * re-animation (`:940`). Every run is a fresh `?size=3&difficulty=EASY` deal, its given count printed (`n`).
 *
 * Page side: a rAF loop from navigation queues a MessageChannel task per frame (it runs after the frame's
 * rendering update — the chair's postpaint.mjs read), and each read takes the mean draw progress over every
 * glyph path the wave ever dashed (1 − dashoffset / dasharray; a settled path = 1).
 * PLANT `stall`: one main-thread busy block of STALL ms, STALL_AT ms after the wave's first ink — the stall the
 * census saw on WebKit (4–8 painted frames, worst Δ 62–69 % at load 214–224). Arm (a) lands the stalled time
 * in the next frame; arm (b′) may advance at most `MOTION.hand.stepMs` (17 ms) of clock per frame.
 *
 *   node p7-reveal-arm.mjs <armA> <armB> [runs=3] [stallMs=240] [stallAt=250] [shotDir]
 * shotDir: chromium · light · 1280×800 · fine · DPR2, the stall plant, the board photographed on the first frame
 * after the stall in each arm (the frame where the arms differ).
 */
import { chromium, webkit } from "./p7-lib.mjs";
import os from "node:os";

const [A, B, RUNS = "3", STALL = "240", STALL_AT = "250", SHOT] = process.argv.slice(2);
const Q = "/?size=3&difficulty=EASY";
console.log(`fresh deals ${Q} · runs ${RUNS} · stall ${STALL} ms @ +${STALL_AT} ms`);

const INIT = ({ stallMs, stallAt }) => {
  const w = window;
  w.__rv = { frames: [], stall: null };
  const seen = new Set();
  const mc = new MessageChannel();
  const q = [];
  mc.port1.onmessage = () => q.shift()?.();
  const read = (tl) => {
    let sum = 0, n = 0, fly = 0;
    for (const p of document.querySelectorAll(".sudoku-cell .glyph-svg path")) {
      const da = p.style.strokeDasharray;
      if (da && da !== "none") seen.add(p);
      if (!seen.has(p)) continue;
      n++;
      if (!da || da === "none") { sum += 1; continue; }
      fly++;
      const L = parseFloat(da), off = parseFloat(p.style.strokeDashoffset) || 0;
      sum += L > 0 ? 1 - off / L : 1;
    }
    return { tl, t: performance.now(), n, fly, mean: n ? sum / n : null };
  };
  const tick = (tl) => {
    q.push(() => {
      const f = read(tl);
      w.__rv.frames.push(f);
      if (stallMs > 0 && !w.__rv.stall && f.mean > 0) {
        w.__rv.stall = { armedAt: f.t };
        setTimeout(() => {
          const s = performance.now();
          while (performance.now() - s < stallMs) {}
          w.__rv.stall.from = s; w.__rv.stall.to = performance.now();
        }, stallAt);
      }
    });
    mc.port2.postMessage(0);
    if (w.__rv.frames.length < 4000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

function summarise(fr, stall) {
  const on = fr.findIndex((f) => f.mean > 0);
  if (on < 0) return { empty: true };
  let end = fr.findIndex((f, i) => i > on && f.mean >= 1 - 1e-9 && f.fly === 0);
  if (end < 0) end = fr.length - 1;
  const w = fr.slice(on, end + 1);
  let painted = 0, worst = 0, dtMax = 0, worstAt = null;
  for (let i = 1; i < w.length; i++) {
    const d = w[i].mean - w[i - 1].mean;
    if (Math.abs(d) > 1e-9) painted++;
    if (d > worst) { worst = d; worstAt = +(w[i].t - w[0].t).toFixed(0); }
    dtMax = Math.max(dtMax, w[i].t - w[i - 1].t);
  }
  return { n: w[0].n, win: [+w[0].t.toFixed(0), +w[w.length - 1].t.toFixed(0)], ms: +(w[w.length - 1].t - w[0].t).toFixed(0), painted, dtMax: +dtMax.toFixed(1), worstPct: +(worst * 100).toFixed(1), worstAt, stallMs: stall?.to ? +(stall.to - stall.from).toFixed(0) : 0 };
}

async function run(browser, base, stallMs, shot) {
  const ctx = await browser.newContext({ colorScheme: "light", viewport: { width: 1280, height: 800 }, deviceScaleFactor: shot ? 2 : 1 });
  await ctx.addInitScript(INIT, { stallMs, stallAt: Number(STALL_AT) });
  const page = await ctx.newPage();
  await page.goto(base + Q);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  if (shot) {
    await page.waitForFunction(() => window.__rv.stall?.to, null, { timeout: 15000, polling: "raf" });
    await page.locator(".board-wrapper").screenshot({ path: shot, animations: "allow" });
  }
  await page.waitForFunction(() => { const f = window.__rv.frames; const l = f[f.length - 1]; return l && l.n > 0 && l.fly === 0 && l.mean >= 1 - 1e-9; }, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(200);
  const { frames, stall } = await page.evaluate(() => window.__rv);
  await ctx.close();
  return summarise(frames, stall);
}

const load = () => os.loadavg()[0].toFixed(1);
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const stallMs of [0, Number(STALL)]) {
    for (let r = 0; r < Number(RUNS); r++) {
      for (const [arm, base] of [["a", A], ["b'", B]]) {
        const s = await run(browser, base, stallMs, null);
        console.log(`${name} ${stallMs ? `stall${stallMs}` : "clean"} r${r} arm ${arm} · ${JSON.stringify(s)} · load ${load()}`);
      }
    }
  }
  if (SHOT && name === "chromium") {
    for (const [arm, base] of [["a", A], ["b", B]]) {
      const path = `${SHOT}/p7-row21-reveal-arm-${arm}-first-frame-after-${STALL}ms-stall-chromium-light-1280x800-fine-dpr2.png`;
      const s = await run(browser, base, Number(STALL), path);
      console.log(`SHOT ${arm} ${path} · ${JSON.stringify(s)}`);
    }
  }
  await browser.close();
}
console.log("ALLDONE");
