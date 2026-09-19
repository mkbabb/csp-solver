#!/usr/bin/env node
// RUN: cd web/frontend && node <this file> --mode ablate|gapsplit --base http://127.0.0.1:<port> --out x.jsonl [--windows 3]
// Refuter A6, lens 3. No src edit; both modes ablate/observe from outside the app.
//   ablate   — 3 arms, mobile 390x844 dpr3 / 4x CPU / cache off: base | defer (the gallery+poster
//              freight held 4000ms at the network layer) | abort (the same refused outright).
//   gapsplit — splits board-ready -> firstBake. HandDrawnGrid.vue:255-257 gates BOTH the baked
//              <image> siblings and the live `.boil-frame-layer` fallback on animState==='drawn',
//              so the first `.boil-frame-layer` timestamps draw-in completion and the bake cannot
//              start before it: leg1 = the draw-in transition, leg2 = the raster. CDP Profiler
//              samples price each leg's busy share rather than assuming it.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { appendFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
const { chromium } = createRequire(pathToFileURL(process.cwd() + "/"))("playwright");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const MODE = arg("--mode", "ablate"), BASE = arg("--base", "http://127.0.0.1:4257");
const OUT = arg("--out", MODE + ".jsonl"), N = Number(arg("--windows", 3));
const LOAD = () => execSync("sysctl -n vm.loadavg").toString().trim();
const FREIGHT = /(SudokuPoster|FutoshikiPoster|ThermoPoster|KillerPoster|KenKenPoster|PosterBoard|ThermoTube|CageOverlay|clue-|wire-)/;
const MOB = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 };
const DESK = { viewport: { width: 1280, height: 800 } };

const INIT = `(() => { window.__R = { lt: [], boardReady: null, drawn: null, bake: null, taint: [] };
  const R = window.__R;
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) R.lt.push({s:Math.round(e.startTime),d:Math.round(e.duration)}); })
    .observe({ type:'longtask', buffered:true }); } catch(e) {}
  for (const ev of ['blur','visibilitychange','pagehide']) addEventListener(ev, () => R.taint.push(ev), true);
  const vis = el => { if(!el) return false; const c=getComputedStyle(el);
    if (c.display==='none'||c.visibility==='hidden') return false;
    const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; };
  // board-ready, the one W8 definition
  const ready = () => { const bg=[...document.querySelectorAll('.board-group')].find(vis); if(!bg) return false;
    const c=bg.querySelector('[class*="cell"]'); if(!c) return false;
    const r=c.getBoundingClientRect(); return r.width>0&&r.height>0; };
  const poll = () => { if (R.boardReady===null && ready()) { requestAnimationFrame(()=>{R.boardReady=performance.now();}); return; }
    requestAnimationFrame(poll); };
  requestAnimationFrame(poll);
  const mo = new MutationObserver(() => {
    if (R.drawn===null && document.querySelector('.boil-frame-layer')) R.drawn = performance.now();
    if (R.bake===null && document.querySelector('.boil-frame-bitmap')) R.bake = performance.now(); });
  const arm = () => mo.observe(document.documentElement, { childList:true, subtree:true });
  if (document.documentElement) arm(); else addEventListener('DOMContentLoaded', arm);
})();`;

const busySplit = (prof, a, b) => {
  const idle = new Set((prof.profile.nodes || [])
    .filter((n) => ["(idle)", "(program)"].includes(n.callFrame.functionName)).map((n) => n.id));
  const dt = prof.profile.timeDeltas || [], ids = prof.profile.samples || [];
  let t = prof.profile.startTime, busy = 0, span = 0;
  for (let i = 0; i < ids.length; i++) {
    t += dt[i] || 0;
    const rel = (t - prof.profile.startTime) / 1000; // page t=0 ~ profile.startTime (goto-commit)
    if (rel < a || rel >= b) continue;
    const d = (dt[i] || 0) / 1000; span += d; if (!idle.has(ids[i])) busy += d;
  }
  return { busyMs: Math.round(busy), spanMs: Math.round(span) };
};

writeFileSync(OUT, "");
const plan = MODE === "gapsplit"
  ? [{ tag: "mob", ctx: MOB }, { tag: "desk", ctx: DESK }]
  : [{ tag: "base", ctx: MOB }, { tag: "defer", ctx: MOB }, { tag: "abort", ctx: MOB }];
for (const step of plan) {
  for (let w = 0; w < N; w++) {
    const b = await chromium.launch();
    try {
      const c = await b.newContext(step.ctx);
      const p = await c.newPage();
      await p.addInitScript(INIT);
      const cdp = await c.newCDPSession(p);
      await cdp.send("Network.enable");
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      let touched = 0;
      if (MODE === "ablate" && step.tag !== "base") {
        await p.route("**/assets/*", async (route) => {
          if (!FREIGHT.test(route.request().url())) return route.continue();
          touched++;
          if (step.tag === "abort") return route.abort();
          await new Promise((r) => setTimeout(r, 4000));
          return route.continue();
        });
      }
      const errs = [];
      p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
      let prof = null;
      if (MODE === "gapsplit") {
        await cdp.send("Profiler.enable");
        await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
        await cdp.send("Profiler.start");
      }
      await p.goto(BASE, { waitUntil: "commit" });
      if (MODE === "gapsplit") {
        await p.waitForFunction("window.__R && window.__R.bake !== null", { timeout: 25000 }).catch(() => {});
        prof = await cdp.send("Profiler.stop");
      } else await p.waitForTimeout(6000);
      const m = await p.evaluate("({br:window.__R.boardReady,dr:window.__R.drawn,bk:window.__R.bake,lt:window.__R.lt,taint:window.__R.taint})");
      const ltIn = (a, z) => Math.round(m.lt.filter((x) => x.s >= a && x.s < z).reduce((s, x) => s + x.d, 0));
      const row = { mode: MODE, step: step.tag, window: w + 1, routedRequests: touched,
        boardReadyMs: m.br && Math.round(m.br), drawnMs: m.dr && Math.round(m.dr),
        firstBakeMs: m.bk && Math.round(m.bk),
        tbt3000Ms: Math.round(m.lt.filter((t) => t.s < 3000).reduce((s, t) => s + Math.max(0, t.d - 50), 0)),
        longtaskCount: m.lt.length, pageErrors: errs.slice(0, 3),
        tainted: (m.taint || []).length > 0, load: LOAD(), at: new Date().toISOString() };
      if (m.br !== null && m.bk !== null) {
        row.ltBetweenReadyAndBake = ltIn(m.br, m.bk);
        if (m.dr !== null) {
          row.leg1DrawInMs = Math.round(m.dr - m.br); row.leg2BakeMs = Math.round(m.bk - m.dr);
          row.leg1LongtaskMs = ltIn(m.br, m.dr); row.leg2LongtaskMs = ltIn(m.dr, m.bk);
          if (prof) { row.leg1Busy = busySplit(prof, m.br, m.dr); row.leg2Busy = busySplit(prof, m.dr, m.bk); }
        }
      }
      appendFileSync(OUT, JSON.stringify(row) + "\n");
      await c.close();
    } catch (e) {
      appendFileSync(OUT, JSON.stringify({ mode: MODE, step: step.tag, window: w + 1, error: String(e.message).slice(0, 180) }) + "\n");
    } finally { await b.close(); }
    process.stderr.write(`[R-A6] ${MODE} ${step.tag} w${w + 1} load ${LOAD()}\n`);
  }
}
