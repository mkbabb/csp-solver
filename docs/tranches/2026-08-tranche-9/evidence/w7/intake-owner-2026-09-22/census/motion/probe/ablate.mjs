// census:motion v2 — clean re-measure (warm boot, reload guard, lite sampler) on MAIN 1e6cfbbf @ 127.0.0.1:4250
// node census.mjs toggle <engine> <view playing|gallery> <vw>x<vh> <scheme light|dark> <prm 0|1> <touch 0|1> <out.json> [shots 0|1]
// node census.mjs move   <engine> - <vw>x<vh> light <prm> <touch> <out.json> [shots]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [scenario, engine, view, vp, scheme, prmA, touchA, out, shotsA] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const prm = prmA === "1", touch = touchA === "1", wantShots = shotsA === "1" && engine === "chromium";
const BASE = "http://127.0.0.1:4250/";
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, reducedMotion: prm ? "reduce" : "no-preference", colorScheme: scheme, hasTouch: touch, isMobile: false });
await ctx.addInitScript(() => {
  window.__raster = [];
  const d = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) { const t = performance.now(); const r = d.apply(this, a); window.__raster.push({ t, dur: performance.now() - t, px: `${this.canvas.width}x${this.canvas.height}` }); return r; };
  window.__loaf = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__loaf.push({ t: e.startTime, dur: e.duration, sl: e.styleAndLayoutStart, scripts: (e.scripts || []).map((s) => `${(s.invoker || "").replace(/blob:[^"\]]+/, "blob:…").slice(0, 60)} ${(s.sourceURL || "").split("/").pop().split("?")[0]}:${s.sourceFunctionName || ""} ${s.duration.toFixed(0)}ms`) }); }).observe({ type: "long-animation-frame", buffered: false }); } catch {}
  window.__anims = [];
  const an = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    const r = this.getBoundingClientRect(); const slot = document.querySelector(".live-face-slot")?.getBoundingClientRect();
    const vpEl = document.querySelector(".gallery-viewport");
    window.__anims.push({ t: performance.now(), cls: String(this.className?.baseVal ?? this.className).split(" ")[0], from: Array.isArray(kf) ? kf[0]?.transform : undefined, to: Array.isArray(kf) ? kf[kf.length - 1]?.transform : undefined, dur: opts?.duration, easing: opts?.easing, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)), slot: slot ? [slot.x, slot.y, slot.width, slot.height].map((v) => +v.toFixed(1)) : null, scrollLeft: vpEl ? vpEl.scrollLeft : null });
    return an.call(this, kf, opts);
  };
  window.__loads = (window.__loads || 0) + 1;
});
const page = await ctx.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
let navs = 0; page.on("framenavigated", (f) => { if (f === page.mainFrame()) navs++; });

const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); };
async function boot(url) {
  await page.goto(url, { waitUntil: "load" }); // warm: vite dep reloads land here, not in the window
  await page.waitForTimeout(3000);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4 && document.querySelectorAll(".rest-moon img.rest-pose").length === 4, null, { timeout: 30000 }).catch(() => errors.push("celestial bake not observed"));
  if (url.includes("gallery")) await page.waitForSelector(".game-card", { timeout: 30000 });
  await page.waitForTimeout(3500);
}
// generic rAF sampler: spec = { key: [selector, kind] } kind: rect|warp|icon|vis|card|all-cards|scroll|posters
await ctx.addInitScript(() => {
  window.__sample = (spec, ms) => new Promise((res) => {
    const sc = (tf) => { if (!tf || tf === "none") return 1; const m = tf.match(/matrix\(([^)]+)\)/); if (!m) return null; const [a, b] = m[1].split(",").map(Number); return +Math.hypot(a, b).toFixed(4); };
    const R = (el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); };
    const frames = []; const t0 = performance.now(); window.__t0 = t0;
    const read = {
      rect: (el) => R(el),
      warp: (el) => sc(getComputedStyle(el).transform),
      icon: (el) => { const cs = getComputedStyle(el); return { op: +(+cs.opacity).toFixed(3), vis: cs.visibility[0], sc: cs.scale }; },
      vis: (el) => getComputedStyle(el).visibility[0],
      btn: (el) => getComputedStyle(el).scale,
      boardT: (el) => { const cs = getComputedStyle(el); return { r: R(el), tf: cs.transform === "none" ? "none" : cs.transform.slice(0, 60), inFace: !!el.closest(".live-face-slot") }; },
      cards: () => [...document.querySelectorAll(".game-card")].map((c) => { const cs = getComputedStyle(c); const img = c.querySelector("img"); return { r: R(c), tf: cs.transform.slice(0, 50), op: cs.opacity, src: img ? (img.currentSrc || img.src).slice(-18) : null }; }),
      scroll: (el) => el.scrollLeft,
      op: (el) => +(+getComputedStyle(el).opacity).toFixed(3),
      poseIdx: (el) => [...el.querySelectorAll("img.rest-pose")].findIndex((i) => i.classList.contains("is-pose-active")),
    };
    const tick = (now) => {
      const f = { t: +(now - t0).toFixed(1) };
      for (const [k, [sel, kind]] of Object.entries(spec)) { const el = sel ? document.querySelector(sel) : null; f[k] = sel && !el ? null : read[kind](el); }
      frames.push(f);
      if (now - t0 < ms) requestAnimationFrame(tick); else res(frames);
    };
    requestAnimationFrame(tick);
  });
});

async function screencast() {
  if (!wantShots) return { stop: async () => [] };
  const cdp = await ctx.newCDPSession(page); const shots = [];
  cdp.on("Page.screencastFrame", async (f) => { shots.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
  return { stop: async () => { await cdp.send("Page.stopScreencast"); return shots; } };
}
async function drain() { return page.evaluate(() => { const o = { raster: window.__raster.splice(0), loaf: window.__loaf.splice(0), anims: window.__anims.splice(0), t0: window.__t0, origin: performance.timeOrigin }; return o; }); }

const result = { scenario, engine, view, vp, scheme, prm, touch, dpr: 2, runs: [] };
const shotDir = out.replace(/\.json$/, "-shots"); if (wantShots) mkdirSync(shotDir, { recursive: true });

async function measure(label, spec, ms, act) {
  await drain();
  const sc = await screencast();
  await page.waitForTimeout(150);
  const navs0 = navs;
  const p = page.evaluate(([s, m]) => window.__sample(s, m), [spec, ms]);
  await page.waitForTimeout(60);
  const actAt = await page.evaluate(() => performance.now() - window.__t0);
  await act();
  const frames = await p;
  await page.waitForTimeout(200);
  const shots = await sc.stop();
  const d = await drain();
  const rel = (t) => +(t - d.t0).toFixed(1);
  const run = { label, actAt: +actAt.toFixed(1), reloaded: navs !== navs0, frames, raster: d.raster.map((r) => ({ at: rel(r.t), dur: +r.dur.toFixed(1), px: r.px })).filter((r) => r.px !== "16x16" && r.px !== "24x24"), loaf: d.loaf.filter((l) => l.dur > 30).map((l) => ({ at: rel(l.t), dur: +l.dur.toFixed(1), scripts: l.scripts })), anims: d.anims.map((a) => ({ ...a, t: rel(a.t) })) };
  if (wantShots) { run.shots = shots.map((s, i) => { const t = +(s.ts - d.origin - d.t0).toFixed(1); const f = `${shotDir}/${label}-${String(i).padStart(3, "0")}-t${Math.round(t)}.png`; writeFileSync(f, Buffer.from(s.data, "base64")); return { t, f }; }); }
  result.runs.push(run);
  return run;
}

if (scenario === "ablate") {
  await boot(BASE + (view === "gallery" ? "?view=gallery" : ""));
  const spec = { sunW: [".toggle-sun .warp", "warp"], moonW: [".toggle-moon .warp", "warp"], sun: [".toggle-sun", "icon"], moon: [".toggle-moon", "icon"], restSun: [".rest-sun", "vis"], restMoon: [".rest-moon", "vis"], restSunOp: [".rest-sun", "op"], restMoonOp: [".rest-moon", "op"], btn: [".sun-moon-toggle", "btn"], btnR: [".sun-moon-toggle", "rect"] };
  // two warm-up flips so every theme raster is cached (the cold-bake stall is measured elsewhere)
  for (let i = 0; i < 2; i++) { await page.click(".sun-moon-toggle", { force: true }); await page.waitForTimeout(2500); }
  const arms = {
    A_asis: async () => {},
    B_liveFilterOff: async () => page.evaluate(() => document.querySelectorAll("svg.toggle-icon").forEach((s) => s.removeAttribute("filter"))),
    C_noGesture: async () => page.evaluate(() => { document.querySelectorAll("svg.toggle-icon").forEach((s) => s.setAttribute("filter", "url(#wobble-celestial)")); const st = document.createElement("style"); st.id = "abl"; st.textContent = "svg.toggle-icon{display:none!important}"; document.head.append(st); }),
  };
  for (const [arm, prep] of Object.entries(arms)) {
    await prep(); await page.waitForTimeout(800);
    for (let i = 0; i < 2; i++) {
      const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      const run = await measure(`${arm}-${i}`, spec, 1400, () => page.click(".sun-moon-toggle", { force: true }));
      run.direction = `${before ? "dark" : "light"}->${before ? "light" : "dark"}`;
      await page.waitForTimeout(1500);
    }
  }
}
result.errors = errors;
writeFileSync(out, JSON.stringify(result));
await browser.close();
console.log("ok", out, result.runs.map((r) => `${r.label}${r.direction ? "(" + r.direction + ")" : ""}:${r.frames.length}f${r.reloaded ? " RELOADED" : ""}${r.shots ? "/" + r.shots.length + "shots" : ""}`).join(" "), errors.length ? "errors:" + errors.join("|") : "");
