#!/usr/bin/env node
// RUN: cd web/frontend && node <this file> --base http://127.0.0.1:4390 --out toggle-trace.jsonl
//
// Two readings the readiness matrix cannot take:
//
// (A) THE FIRST-TOGGLE RE-BAKE (T9-W8 §8.1's shaped suspect). The board's boil layers are
//     `<image class="boil-frame-bitmap">` siblings whose `href` is a blob: URL minted by the
//     pose bake (rasterPose). If the dark-mode toggle's FIRST invocation re-runs the bake,
//     every one of those hrefs is replaced. This records the href set before the toggle, the
//     set after, whether it changed, and the main-thread blocking (longtask) the toggle cost
//     on its FIRST invocation vs its SECOND — a first-only cost IS the re-bake.
//
// (B) TOTAL MAIN-THREAD BUSY to board-ready, from CDP Profiler samples rather than longtask.
//     `longtask` only sees tasks over 50 ms, so `busyToBoardReadyMs` in the readiness matrix
//     is a floor. The sampling profiler sees all of it.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { appendFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
const _pw = createRequire(pathToFileURL(process.cwd() + "/"))("playwright");
const { chromium } = _pw.default || _pw;
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg("--base", "http://127.0.0.1:4390");
const OUT = arg("--out", "toggle-trace.jsonl");
const N = Number(arg("--windows", 3));

const INIT = `(() => { window.__T = { lt: [], boardReady: null, taint: [] };
  const T = window.__T;
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lt.push({s:e.startTime,d:e.duration}); })
    .observe({ type:'longtask', buffered:true }); } catch(e) {}
  for (const ev of ['blur','visibilitychange']) addEventListener(ev, () => T.taint.push(ev), true);
  const vis = el => { if(!el) return false; const c=getComputedStyle(el);
    if (c.display==='none'||c.visibility==='hidden') return false;
    const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; };
  const ready = () => { const bg=[...document.querySelectorAll('.board-group')].find(vis); if(!bg) return false;
    const c=bg.querySelector('[class*="cell"]'); if(!c) return false;
    const r=c.getBoundingClientRect(); return r.width>0&&r.height>0; };
  const poll = () => { if (T.boardReady===null && ready()) { requestAnimationFrame(()=>{T.boardReady=performance.now();}); return; }
    requestAnimationFrame(poll); };
  requestAnimationFrame(poll);
})();`;

const HREFS = `[...document.querySelectorAll('.boil-frame-bitmap')].map(e => e.getAttribute('href') || e.href?.baseVal || '')`;

writeFileSync(OUT, "");
for (const vp of [
  { n: "desk", ctx: { viewport: { width: 1280, height: 800 } } },
  { n: "mob", ctx: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 } },
]) {
  for (const cpu of [1, 4]) {
    for (let w = 0; w < N; w++) {
      const b = await chromium.launch();
      try {
        const c = await b.newContext(vp.ctx);
        const p = await c.newPage();
        await p.addInitScript(INIT);
        const cdp = await c.newCDPSession(p);
        await cdp.send("Network.enable");
        await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
        if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
        // (B) profiler over the boot
        await cdp.send("Profiler.enable");
        await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
        await cdp.send("Profiler.start");
        await p.goto(BASE, { waitUntil: "commit" });
        await p.waitForFunction("window.__T && window.__T.boardReady !== null", { timeout: 30000 });
        const prof = await cdp.send("Profiler.stop");
        const boardReady = await p.evaluate("window.__T.boardReady");
        // busy = samples whose node is not (program)/(idle)/(garbage collector idle)
        const idleIds = new Set((prof.profile.nodes || [])
          .filter((n) => ["(idle)", "(program)"].includes(n.callFrame.functionName)).map((n) => n.id));
        const dt = prof.profile.timeDeltas || [];
        const ids = prof.profile.samples || [];
        let busyUs = 0, totalUs = 0;
        for (let i = 0; i < ids.length; i++) { const d = dt[i] || 0; totalUs += d; if (!idleIds.has(ids[i])) busyUs += d; }
        await p.waitForTimeout(3200); // let the bake land
        const before = await p.evaluate(HREFS);
        const ltBefore = await p.evaluate("window.__T.lt.length");
        // (A) FIRST toggle
        const tog = p.locator(".sun-moon-toggle").first();
        const t1 = await p.evaluate(() => performance.now());
        await tog.click({ timeout: 8000 });
        await p.waitForTimeout(1800);
        const after1 = await p.evaluate(HREFS);
        const lt1 = await p.evaluate(`window.__T.lt.filter(t => t.s >= ${t1}).reduce((s,t)=>s+t.d,0)`);
        const blk1 = await p.evaluate(`window.__T.lt.filter(t => t.s >= ${t1}).reduce((s,t)=>s+Math.max(0,t.d-50),0)`);
        // SECOND toggle — the same gesture, the bake now warm
        const t2 = await p.evaluate(() => performance.now());
        await tog.click({ timeout: 8000 });
        await p.waitForTimeout(1800);
        const after2 = await p.evaluate(HREFS);
        const lt2 = await p.evaluate(`window.__T.lt.filter(t => t.s >= ${t2}).reduce((s,t)=>s+t.d,0)`);
        const blk2 = await p.evaluate(`window.__T.lt.filter(t => t.s >= ${t2}).reduce((s,t)=>s+Math.max(0,t.d-50),0)`);
        const taint = await p.evaluate("window.__T.taint");
        const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
        appendFileSync(OUT, JSON.stringify({
          vp: vp.n, cpu, window: w + 1, boardReadyMs: Math.round(boardReady),
          profilerBusyToBoardReadyMs: Math.round(busyUs / 1000),
          profilerWallToBoardReadyMs: Math.round(totalUs / 1000),
          bakeLayersBefore: before.length,
          firstToggleRebaked: !same(before, after1),
          secondToggleRebaked: !same(after1, after2),
          hrefSampleBefore: (before[0] || "").slice(0, 34),
          hrefSampleAfter1: (after1[0] || "").slice(0, 34),
          firstToggleTaskMs: Math.round(lt1), firstToggleBlockingMs: Math.round(blk1),
          secondToggleTaskMs: Math.round(lt2), secondToggleBlockingMs: Math.round(blk2),
          tainted: taint.length > 0, taint,
          load: execSync("sysctl -n vm.loadavg").toString().trim(), at: new Date().toISOString(),
        }) + "\n");
        await c.close();
      } catch (e) {
        appendFileSync(OUT, JSON.stringify({ vp: vp.n, cpu, window: w + 1, error: String(e.message).slice(0, 180) }) + "\n");
      } finally { await b.close(); }
      process.stderr.write(`[A6] ${vp.n} ${cpu}x w${w + 1} done, load ${execSync("sysctl -n vm.loadavg").toString().trim()}\n`);
    }
  }
}
