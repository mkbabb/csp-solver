/**
 * ACC-FIVE pass 5 · THE FRONT'S RATE, ALL THREE `poseFronts` CONSUMERS, ONE PAGE, ONE RUN.
 *
 * Pass-4 critique §3.1: the tally re-cut at 134.2/s beside the gauge's 51.8/s in the same page.
 * This counts `d` re-cut frames on `.progress-trace` (the fill gauge), `.dt-stroke` (the tally)
 * and `.join-pose path` (the join ring) in ONE page A, driven the product's own way: A deals
 * (the tally draws in when the grade lands), A takes three hints (the gauge), A presses the
 * invite verb and B opens A's URL in the same context (the join ring on A). `?wire=local` is
 * DEV-only, so this runs on the lane's dev server.
 *
 * The observer is installed by an init script that WAITS for the body (pass-4 critic's incident:
 * an init-script MutationObserver on a null body throws and the whole observer is lost).
 *
 * Statistics per selector: `d` records, instances, re-cut FRAMES (mutation clusters > 0.5 ms
 * apart), span first→last, RATE = frames / span (the pass-4 critic's form), and the interval
 * form (frames − 1) / span, plus the minimum gap between consecutive re-cut frames.
 *
 *   node p5-three-consumers.mjs <base> <out.json> [label]
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";

const { chromium, webkit } = pw;
const BASE = process.argv[2] ?? "http://127.0.0.1:4236";
const OUT = process.argv[3];
const LABEL = process.argv[4] ?? "";
if (!OUT) throw new Error("usage: node p5-three-consumers.mjs <base> <out.json> [label]");

const SELECTORS = { gauge: ".progress-trace", tally: ".dt-stroke", join: ".join-pose path" };

const OBSERVE = (selectors) => {
  const w = window;
  w.__rc = {};
  for (const k of Object.keys(selectors)) w.__rc[k] = { d: 0, times: [], els: new Set() };
  const seen = new WeakSet();
  const attach = () => {
    for (const [k, sel] of Object.entries(selectors))
      document.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        new MutationObserver((recs) => {
          const t = performance.now();
          const r = w.__rc[k];
          for (const m of recs) {
            if (m.attributeName !== "d") continue;
            r.d++;
            r.els.add(m.target);
            const last = r.times[r.times.length - 1];
            if (last === undefined || t - last > 0.5) r.times.push(t);
          }
        }).observe(el, { attributes: true, attributeFilter: ["d"] });
      });
  };
  const go = () => {
    attach();
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) go();
  else document.addEventListener("DOMContentLoaded", go, { once: true });
};

const HZ = () =>
  new Promise((res) => {
    const ts = [];
    const tick = (t) => {
      ts.push(t);
      if (ts.length < 40) requestAnimationFrame(tick);
      else {
        const d = [];
        for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1]);
        d.sort((a, b) => a - b);
        res(Math.round(1000 / d[Math.floor(d.length / 2)]));
      }
    };
    requestAnimationFrame(tick);
  });

const READ = () => {
  const out = {};
  for (const [k, r] of Object.entries(window.__rc)) {
    const t = r.times;
    const span = t.length > 1 ? t[t.length - 1] - t[0] : 0;
    // per-event spans: the gauge's three writes are separate events; the rate is taken over
    // each BURST (frames closer than 300 ms), then the worst burst is reported
    const bursts = [];
    let cur = [];
    for (const x of t) {
      if (cur.length && x - cur[cur.length - 1] > 300) {
        bursts.push(cur);
        cur = [];
      }
      cur.push(x);
    }
    if (cur.length) bursts.push(cur);
    const b = bursts
      .filter((q) => q.length > 2)
      .map((q) => {
        const s = q[q.length - 1] - q[0];
        let minGap = Infinity;
        for (let i = 1; i < q.length; i++) minGap = Math.min(minGap, q[i] - q[i - 1]);
        // gaps excluding the LAST one (the forced exact end may follow a gated commit closely)
        let minGapGated = Infinity;
        for (let i = 1; i < q.length - 1; i++) minGapGated = Math.min(minGapGated, q[i] - q[i - 1]);
        return {
          frames: q.length,
          spanMs: +s.toFixed(1),
          rate: +((q.length / s) * 1000).toFixed(1),
          intervalRate: +(((q.length - 1) / s) * 1000).toFixed(1),
          minGapMs: +minGap.toFixed(2),
          minGapGatedMs: +minGapGated.toFixed(2),
        };
      });
    const worst = b.reduce((a, q) => (!a || q.rate > a.rate ? q : a), null);
    out[k] = {
      dRecords: r.d,
      instances: r.els.size,
      frames: t.length,
      spanMs: +span.toFixed(1),
      bursts: b.length,
      worst,
    };
  }
  return out;
};

async function hint(page) {
  return page.evaluate(() => {
    const b = document.querySelector('[aria-label*="Hint" i]');
    if (!b || b.disabled) return false;
    b.click();
    return true;
  });
}

const rows = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "no-preference",
      viewport: { width: 1280, height: 800 },
    });
    await ctx.addInitScript(OBSERVE, SELECTORS);
    const a = await ctx.newPage();
    await a.goto(BASE + "/?wire=local&size=3&difficulty=EASY");
    await a.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await a.waitForTimeout(2500);
    const prm = await a.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
    const hz = await a.evaluate(HZ);
    const tallyAtLoad = await a.evaluate(() => window.__rc.tally.d);
    // if the tally drew nothing at load (the grade landed before the observer), re-deal once
    // is NOT done: a re-deal moves the board. The load draw-in is the row; zero is reported.
    // the hint control must be live before the gauge rows (webkit/light read 0 on a first run
    // under a loaded box: the hints fired before generation had settled)
    await a
      .waitForFunction(() => {
        const b = document.querySelector('[aria-label*="Hint" i]');
        return b && !b.disabled;
      }, null, { timeout: 30000 })
      .catch(() => {});
    for (let i = 0; i < 3; i++) {
      await hint(a);
      await a.waitForTimeout(700);
    }
    let joined = false;
    try {
      const verb = a.locator('button[aria-label="Play together on this board"]').first();
      await verb.waitFor({ state: "visible", timeout: 15000 });
      await verb.click();
      await a.waitForTimeout(1200);
      const invited = await a.evaluate(() => location.href);
      const b = await ctx.newPage();
      await b.goto(invited);
      await b.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await a.waitForTimeout(4000);
      joined = true;
    } catch (e) {
      joined = String(e).slice(0, 140);
    }
    const read = await a.evaluate(READ);
    const traces = await a.evaluate(() => document.querySelectorAll(".progress-trace").length);
    const grids = await a.evaluate(() => document.querySelectorAll("svg.hand-drawn-grid").length);
    rows.push({ label: LABEL, engine: name, scheme, prmMatches: prm, panelHz: hz, tallyAtLoad, joined, traces, grids, ...read });
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
for (const r of rows) {
  console.log(`${LABEL} ${r.engine}/${r.scheme} panel ${r.panelHz}Hz PRM=${r.prmMatches} joined=${r.joined} .progress-trace nodes ${r.traces} grids ${r.grids} tally-at-load d ${r.tallyAtLoad}`);
  for (const k of ["gauge", "tally", "join"]) {
    const q = r[k];
    const w = q.worst;
    console.log(
      `   ${k.padEnd(5)} d ${q.dRecords} inst ${q.instances} frames ${q.frames} bursts ${q.bursts}` +
        (w
          ? `  WORST burst: ${w.frames} frames / ${w.spanMs} ms = ${w.rate}/s (interval ${w.intervalRate}/s, min gap ${w.minGapMs} ms, gated min gap ${w.minGapGatedMs} ms)`
          : "  (no burst)"),
    );
  }
}
