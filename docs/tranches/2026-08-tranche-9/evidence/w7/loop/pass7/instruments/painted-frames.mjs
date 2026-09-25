// painted-frames.mjs — THE painted-frame recorder, both engines (T9-W7 pass 7, chair's instruments;
// INTAKE-23 row 7 / M20 D7; registry-v6 §2.5; LAWS P6 §D). ONE copy: every motion row reads this.
//
// Three tracks, all timestamped on ONE epoch clock (ms since 1970, performance.timeOrigin-aligned):
//   T  the painted TIMELINE (both engines): a rAF loop records each rendering update's timestamp and
//      queues a POST-PAINT read (setTimeout 0 from the rAF — it runs after that frame's rendering
//      update, whatever order the product's rAFs ran in). A held frame is a rAF gap.
//   P  PHOTOGRAPHS: chromium = CDP Page.startScreencast (every compositor frame, metadata timestamp);
//      webkit = page.screencast (Playwright ≥1.61) — WebKit's capture is THROTTLED (~20/s on this box),
//      so its photographs are a coarse witness, never the frame clock (the self-test prints the rate).
//      Per photograph: the mean |Δ| of the ROI against the previous photograph (sharp-decoded, 8-bit
//      grey). The motion window = first..last changed photograph; a HELD interval = the time between
//      two consecutive CHANGED photographs inside the window.
//   L  the rAF-FROZEN PHOTOGRAPH LADDER (`ladder()`, either engine): replay the trigger K times; on
//      replay k every running animation is paused inside rAF k after the trigger and the ROI is
//      photographed — the painted pose at frame k with its currentTime. WebKit's first-frame rows use it.
//
// The box load (os.loadavg) and the SELF-TEST (a CSS spinner + a main-thread `left` mover on a blank
// page: photographs/s and rAF/s) are printed beside every reading. A painted clause counts only when
// the self-test clock ≥ 55/s on that engine (chromium: photographs; webkit: the rAF timeline).
//
// CLI:  node painted-frames.mjs --url <u> --engine chromium|webkit [--viewport 1280x800] [--dpr 1]
//         [--scheme light|dark] [--trigger click:<sel>|key:<k>|none] [--roi <sel>] [--subject <sel>]
//         [--window 1200] [--plant busy:<ms>@<delay>] [--held 50] [--selftest-only] [--out <json>]
//         [--ladder K]
// Exit: 0 GREEN (self-test ≥ 55 and no held interval ≥ --held ms inside the motion window);
//       (--held default 50 ms: three 60 Hz frames; every held interval is listed with its time)
//       1 RED (a held interval, or no motion seen — an EMPTY window is RED, never skipped);
//       2 the self-test clock < 55 (no painted clause counts on this box/engine).
import { createRequire } from "node:module";
import os from "node:os";
import fs from "node:fs";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const sharp = require("sharp");

export const load = () => os.loadavg().map((v) => +v.toFixed(2));

/** Page-side: the painted timeline. `sel` (optional) is read post-paint each frame. */
export function installTimeline(sel) {
  const w = window;
  const read = () => {
    if (!sel) return null;
    if (sel.startsWith("css:")) { // css:<selector>:<property> — a computed paint property, read post-paint
      const i = sel.lastIndexOf(":"); const el = document.querySelector(sel.slice(4, i));
      return el ? { x: getComputedStyle(el).getPropertyValue(sel.slice(i + 1)), y: 0, w: 0, h: 0, ct: null } : null;
    }
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const a = el.getAnimations?.().find((x) => x.playState === "running" || x.playState === "paused");
    return { x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), ct: a ? Number(a.currentTime ?? NaN) : null };
  };
  w.__pf = { rafs: [], post: [], on: true, origin: performance.timeOrigin };
  const tick = (ts) => {
    if (!w.__pf.on) return;
    const k = w.__pf.rafs.length;
    w.__pf.rafs.push({ k, ts });
    setTimeout(() => w.__pf.post.push({ k, t: performance.now(), r: read() }), 0);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

async function roiGrey(buf, roi) {
  let img = sharp(buf);
  if (roi) img = img.extract(roi);
  return img.greyscale().raw().toBuffer();
}
const meanAbs = (a, b) => { if (!a || !b || a.length !== b.length) return Infinity; let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };

/** Start the photograph track. Returns stop() → [{t (epoch ms), buf}]. */
export async function startPhotos(page, engine, size) {
  const frames = [];
  if (engine === "chromium") {
    const cdp = await page.context().newCDPSession(page);
    cdp.on("Page.screencastFrame", async (f) => {
      frames.push({ t: f.metadata.timestamp * 1000, buf: Buffer.from(f.data, "base64") });
      try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
    });
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, everyNthFrame: 1, maxWidth: size.width, maxHeight: size.height });
    return async () => { await cdp.send("Page.stopScreencast"); await cdp.detach().catch(() => {}); return frames; };
  }
  // WebKit's frame timestamp is a monotonic clock, not the epoch: align it by the least-delayed arrival.
  await page.screencast.start({ size, quality: 90, onFrame: ({ data, timestamp }) => frames.push({ ts: timestamp, arr: Date.now(), buf: data }) });
  return async () => {
    await page.screencast.stop();
    const off = Math.min(...frames.map((f) => f.arr - f.ts));
    return frames.map((f) => ({ t: f.ts + off, buf: f.buf }));
  };
}

/** Analyse photographs: per-frame ROI Δ, the motion window, held intervals. `scale` maps CSS px → frame px. */
export async function analysePhotos(frames, roiCss, scale = 1, eps = 0.35, t0 = -Infinity, t1 = Infinity) {
  const roi = roiCss ? { left: Math.max(0, Math.round(roiCss.x * scale)), top: Math.max(0, Math.round(roiCss.y * scale)), width: Math.max(1, Math.round(roiCss.w * scale)), height: Math.max(1, Math.round(roiCss.h * scale)) } : null;
  const rows = []; let prev = null;
  for (const f of frames.filter((x) => x.t >= t0 - 60 && x.t <= t1 + 60)) {
    let g; try { g = await roiGrey(f.buf, roi); } catch { g = null; }
    rows.push({ t: f.t, d: prev && g ? +meanAbs(prev, g).toFixed(3) : null });
    if (g) prev = g;
  }
  const changed = rows.filter((r) => r.d != null && r.d > eps && r.t >= t0 && r.t <= t1 + 40);
  const gaps = rows.slice(1).map((r, i) => r.t - rows[i].t);
  let maxHeld = 0, heldAt = null; const intervals = [];
  for (let i = 1; i < changed.length; i++) { const h = changed[i].t - changed[i - 1].t; intervals.push([changed[i - 1].t, changed[i].t]); if (h > maxHeld) { maxHeld = h; heldAt = changed[i - 1].t; } }
  return { photos: rows.length, changed: changed.length, windowMs: changed.length ? +(changed.at(-1).t - changed[0].t).toFixed(1) : 0, firstChange: changed[0]?.t ?? null,
    gapMs: stat(gaps), maxHeldMs: +maxHeld.toFixed(1), heldAt, intervals, deltas: rows.map((r) => [+(r.t - (rows[0]?.t ?? 0)).toFixed(1), r.d]) };
}
export function stat(a) { if (!a.length) return null; const s = [...a].sort((p, q) => p - q); return { n: s.length, min: +s[0].toFixed(1), median: +s[s.length >> 1].toFixed(1), p95: +s[Math.floor(s.length * 0.95)].toFixed(1), max: +s.at(-1).toFixed(1) }; }

/** Timeline analysis inside [t0, t1] (epoch ms): rAF gaps, max held gap, post-paint reads. */
export function analyseTimeline(pf, t0, t1) {
  const rafs = pf.rafs.map((r) => ({ ...r, e: pf.origin + r.ts })).filter((r) => r.e >= t0 && r.e <= t1);
  const gaps = rafs.slice(1).map((r, i) => r.e - rafs[i].e);
  let maxGap = 0, at = null; const intervals = [];
  for (let i = 1; i < rafs.length; i++) { const g = rafs[i].e - rafs[i - 1].e; intervals.push([rafs[i - 1].e, rafs[i].e]); if (g > maxGap) { maxGap = g; at = rafs[i - 1].e; } }
  return { rafs: rafs.length, gapMs: stat(gaps), maxGapMs: +maxGap.toFixed(1), at, intervals };
}

/** The self-test: a CSS spinner (compositor) + a main-thread `left` mover on a blank page. */
export async function selfTest(browser, engine, viewport = { width: 800, height: 600 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.setContent(`<style>body{margin:0;background:#fff}.s{position:absolute;left:300px;top:200px;width:80px;height:80px;border:8px solid #333;border-top-color:transparent;border-radius:50%;animation:r .6s linear infinite}.m{position:absolute;top:400px;width:40px;height:40px;background:#333;animation:m 1s linear infinite alternate}@keyframes r{to{transform:rotate(360deg)}}@keyframes m{from{left:0}to{left:700px}}</style><div class="s"></div><div class="m"></div>`);
  await page.evaluate(installTimeline, null);
  await page.waitForTimeout(300);
  const stop = await startPhotos(page, engine, viewport);
  const t0 = Date.now();
  await page.waitForTimeout(1200);
  const frames = await stop();
  const pf = await page.evaluate(() => window.__pf);
  await ctx.close();
  const w = frames.filter((f) => f.t >= frames[0].t + 100 && f.t <= frames[0].t + 1100);
  const tl = analyseTimeline(pf, t0 + 100, t0 + 1100);
  return { photosPerSec: w.length, photoGapMs: stat(w.slice(1).map((f, i) => f.t - w[i].t)), rafPerSec: tl.rafs, rafGapMs: tl.gapMs, load: load() };
}

/** One recording. opts: url, viewport, dpr, scheme, trigger, roi, subject, windowMs, plant {busyMs, delayMs}. */
export async function record(browser, engine, o) {
  const ctx = await browser.newContext({ viewport: o.viewport, deviceScaleFactor: o.dpr ?? 1, colorScheme: o.scheme ?? "light", reducedMotion: "no-preference", hasTouch: !!o.touch });
  const page = await ctx.newPage();
  const onLoad = o.trigger === "load"; // the page's own boot motion (the draw-in, M20): record from navigation
  let roi = null, stop, tTrig;
  if (onLoad) {
    await page.addInitScript(installTimeline, o.subject ?? null);
    if (o.plant?.busyMs) await page.addInitScript(({ busyMs, delayMs }) => { setTimeout(() => { const t = performance.now(); while (performance.now() - t < busyMs); window.__plantRan = performance.timeOrigin + t; }, delayMs); }, o.plant);
    await page.goto("about:blank");
    stop = await startPhotos(page, engine, o.viewport);
    tTrig = Date.now();
    await page.goto(o.url);
    if (o.ready) await page.locator(o.ready).first().waitFor({ timeout: 30000 });
    const roiBox = o.roi ? await page.locator(o.roi).first().boundingBox() : null;
    roi = roiBox ? { x: roiBox.x, y: roiBox.y, w: roiBox.width, h: roiBox.height } : null;
  } else {
  await page.goto(o.url);
  if (o.ready) await page.locator(o.ready).first().waitFor({ timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(o.settleMs ?? 1500);
  const roiBox = o.roi ? await page.locator(o.roi).first().boundingBox() : null;
  roi = roiBox ? { x: roiBox.x, y: roiBox.y, w: roiBox.width, h: roiBox.height } : null;
  await page.evaluate(installTimeline, o.subject ?? null);
  stop = await startPhotos(page, engine, o.viewport);
  await page.waitForTimeout(250);
  if (o.plant?.busyMs) await page.evaluate(({ busyMs, delayMs }) => { window.__plantArm = () => setTimeout(() => { const t = performance.now(); while (performance.now() - t < busyMs); window.__plantRan = performance.timeOrigin + t; }, delayMs); }, o.plant);
  tTrig = Date.now();
  if (o.plant?.busyMs) await page.evaluate(() => window.__plantArm());
  }
  if (onLoad) {} else if (o.trigger?.startsWith("key:")) await page.keyboard.press(o.trigger.slice(4));
  else if (o.trigger?.startsWith("click:")) await page.locator(o.trigger.slice(6)).first().click();
  await page.waitForTimeout(o.windowMs ?? 1200);
  const frames = await stop();
  const pf = await page.evaluate(() => { window.__pf.on = false; return { ...window.__pf, plantRan: window.__plantRan ?? null }; });
  await ctx.close();
  // The motion window: trigger → the last post-paint frame whose subject read moved (+1 frame). With no
  // subject, trigger → trigger + window. Idle beats after the motion (the boil's ~125 ms step) are outside.
  // The SUBJECT track (post-paint reads): the frames where the subject's read changed, with the read
  // before the first change as its origin. Intervals between consecutive changes are the painted
  // timeline's held intervals (webkit's primary track; chromium prints it beside the photographs).
  let tEnd = tTrig + (o.windowMs ?? 1200), tStart = tTrig, moved = 0; const mv = [];
  if (o.subject) {
    const reads = pf.post.map((p) => ({ e: pf.origin + p.t, r: p.r })).filter((p) => p.e >= tTrig && p.r);
    let first = null, last = null; for (let i = 1; i < reads.length; i++) { const a = reads[i - 1].r, b = reads[i].r; if (a.x !== b.x || a.y !== b.y || a.w !== b.w || a.h !== b.h) { if (first == null) { first = reads[i - 1].e; mv.push(first); } mv.push(reads[i].e); last = reads[i].e; moved++; } }
    tStart = first ?? tTrig; tEnd = last ?? tTrig;
  }
  const subjIv = mv.slice(1).map((t, i) => [mv[i], t]);
  const subjMax = subjIv.reduce((m, [a, b]) => Math.max(m, b - a), 0);
  // chromium CDP photographs arrive at the viewport's CSS size (maxWidth = viewport) → scale 1.
  const ph = await analysePhotos(frames, roi, 1, 0.35, tStart, tEnd);
  const tl = analyseTimeline(pf, tStart, tEnd);
  const heldList = (iv, floor) => iv.filter(([a, b]) => b - a >= floor).map(([a, b]) => [+(a - tTrig).toFixed(1), +(b - a).toFixed(1)]);
  const plantAt = pf.plantRan ? pf.plantRan - tTrig : null;
  const seen = (iv) => plantAt != null && iv.some(([a, b]) => b - a >= 0.9 * o.plant.busyMs && a - tTrig <= plantAt + 20 && b - tTrig >= plantAt + o.plant.busyMs - 20);
  const floor = o.heldMs ?? 50;
  return { engine, trigger: o.trigger, roi, held: { photo: heldList(ph.intervals, floor), rAF: heldList(tl.intervals, floor), subject: heldList(subjIv, floor) }, subjectMaxMs: +subjMax.toFixed(1), plantSeen: o.plant ? { photo: seen(ph.intervals), rAF: seen(tl.intervals), subject: seen(subjIv) } : null, subjectMovedFrames: moved, motionMs: +(tEnd - tStart).toFixed(1), latencyMs: +(tStart - tTrig).toFixed(1), plant: o.plant ?? null, plantRanAt: pf.plantRan ? +(pf.plantRan - tTrig).toFixed(1) : null, photos: { ...ph, intervals: undefined }, timeline: { ...tl, intervals: undefined }, load: load() };
}

/** The rAF-frozen photograph ladder: replay, pause every animation in rAF k after the trigger, photograph. */
export async function ladder(browser, o, K = 4) {
  const out = [];
  for (let k = 1; k <= K; k++) {
    const ctx = await browser.newContext({ viewport: o.viewport, deviceScaleFactor: o.dpr ?? 1, colorScheme: o.scheme ?? "light", reducedMotion: "no-preference", hasTouch: !!o.touch });
    const page = await ctx.newPage();
    await page.goto(o.url);
    if (o.ready) await page.locator(o.ready).first().waitFor({ timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(o.settleMs ?? 1500);
    await page.evaluate(({ k, sel }) => {
      const w = window; w.__lad = null; let n = 0;
      // frame 1 = the first rAF in which the SUBJECT carries a running scripted/any animation (the trigger's
      // latency is not counted); with no subject, the first rAF after the trigger.
      // a HELD first frame is a paused animation that exists: it counts (VERB's hold paints frame 1 paused at ct 0)
      const live = () => { if (!sel) return true; const el = document.querySelector(sel); return !!el?.getAnimations().some((a) => a.playState === "running" || a.playState === "paused"); };
      const arm = () => requestAnimationFrame(function f() {
        if (!live() && n === 0) return requestAnimationFrame(f);
        if (++n < k) return requestAnimationFrame(f);
        const anims = document.getAnimations(); anims.forEach((a) => a.pause());
        const el = sel ? document.querySelector(sel) : null; const r = el?.getBoundingClientRect();
        w.__lad = { k, anims: anims.length, ct: anims.map((a) => Number(a.currentTime ?? NaN)).slice(0, 4), rect: r ? [r.left, r.top, r.width, r.height].map((v) => +v.toFixed(2)) : null };
      });
      addEventListener("keydown", arm, { once: true, capture: true }); addEventListener("pointerdown", arm, { once: true, capture: true });
    }, { k, sel: o.subject ?? null });
    if (o.trigger?.startsWith("key:")) await page.keyboard.press(o.trigger.slice(4));
    else if (o.trigger?.startsWith("click:")) await page.locator(o.trigger.slice(6)).first().click();
    await page.waitForFunction(() => window.__lad, null, { timeout: 5000 }).catch(() => {});
    const lad = await page.evaluate(() => window.__lad);
    const shot = o.roi ? await page.locator(o.roi).first().screenshot().catch(() => null) : await page.screenshot();
    out.push({ ...lad, shotBytes: shot?.length ?? 0, shotSha: shot ? (await import("node:crypto")).createHash("sha1").update(shot).digest("hex").slice(0, 10) : null });
    await ctx.close();
  }
  return out;
}

// ---- CLI -------------------------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const A = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => { if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] == null ? "1" : all[i + 1]]); return acc; }, []));
  const engine = A.engine ?? "chromium";
  const [vw, vh] = (A.viewport ?? "1280x800").split("x").map(Number);
  const browser = await pw[engine].launch();
  const st = await selfTest(browser, engine);
  const clock = engine === "chromium" ? st.photosPerSec : st.rafPerSec;
  console.log(`SELFTEST ${engine} photos/s ${st.photosPerSec} (gap ${JSON.stringify(st.photoGapMs)}) rAF/s ${st.rafPerSec} (gap ${JSON.stringify(st.rafGapMs)}) clock ${clock} ${clock >= 55 ? "OK" : "BELOW 55"} load ${st.load.join(" ")}`);
  let exit = clock >= 55 ? 0 : 2;
  if (!A["selftest-only"]) {
    const plant = A.plant ? (([b, d]) => ({ busyMs: +b, delayMs: +d }))(A.plant.replace(/^busy:/, "").split("@")) : null;
    const o = { heldMs: +(A.held ?? 50), url: A.url, viewport: { width: vw, height: vh }, dpr: +(A.dpr ?? 1), scheme: A.scheme, trigger: A.trigger, roi: A.roi, subject: A.subject, windowMs: +(A.window ?? 1200), plant, ready: A.ready, touch: A.touch === "1" };
    const runs = +(A.runs ?? 1); const held = +(A.held ?? 50); const res = [];
    for (let i = 0; i < runs; i++) {
      const r = await record(browser, engine, o); res.push(r);
      const photoHeld = r.photos.maxHeldMs, tlHeld = r.timeline.maxGapMs;
      // PRIMARY track: chromium = photographs (every compositor frame); webkit = the rAF timeline
      // (its photographs are throttled). The other track is printed beside, never gated.
      const primary = engine === "chromium" ? photoHeld : (o.subject ? r.subjectMaxMs : tlHeld);
      const empty = engine === "chromium" ? r.photos.changed < 2 : (o.subject ? r.subjectMovedFrames < 1 : r.timeline.rafs < 2);
      const red = empty || primary >= held;
      console.log(`RECORD ${engine} run${i + 1} ${A.trigger} plant=${A.plant ?? "none"} plantAt+${r.plantRanAt ?? "-"}ms motion ${r.motionMs}ms from +${r.latencyMs}ms (${r.subjectMovedFrames} moved) | photos ${r.photos.photos} changed ${r.photos.changed} window ${r.photos.windowMs}ms photoGap ${JSON.stringify(r.photos.gapMs)} maxHeld(photo) ${photoHeld}ms | rAF ${r.timeline.rafs} gap ${JSON.stringify(r.timeline.gapMs)} maxGap(rAF) ${tlHeld}ms | load ${r.load.join(" ")} | ${red ? "RED" : "GREEN"}${empty ? " (EMPTY motion window)" : ""} primary=${engine === "chromium" ? "photo" : o.subject ? "subject" : "rAF"} | held≥${held}ms [+at,dur] photo ${JSON.stringify(r.held.photo)} subject ${JSON.stringify(r.held.subject)} rAF ${JSON.stringify(r.held.rAF)}${r.plantSeen ? ` | PLANT SEEN photo ${r.plantSeen.photo ? "YES" : "NO"} subject ${r.plantSeen.subject ? "YES" : "NO"} rAF ${r.plantSeen.rAF ? "YES" : "NO"}` : ""}`);
      if (exit === 0 && red) exit = 1;
    }
    if (A.ladder) { const L = await ladder(browser, o, +A.ladder); for (const l of L) console.log(`LADDER ${engine} ${JSON.stringify(l)}`); }
    if (A.out) fs.writeFileSync(A.out, JSON.stringify({ selftest: st, runs: res.map((r) => ({ ...r, photos: { ...r.photos, deltas: r.photos.deltas.slice(0, 200) } })) }, null, 0));
  }
  await browser.close();
  process.exit(exit);
}
