// census:toggle (T9-M21) — the Bloom per frame, main 1d0dc4fd (:4251) vs MOT-VERB pass5 bank on 74a2b5d9 (:4259)
// node probe.mjs <port> <engine> <vw>x<vh> <scheme light|dark> <prm 0|1> <touch 0|1> <out.json> [shots 0|1]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [port, engine, vp, scheme, prmA, touchA, out, shotsA] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const prm = prmA === "1", touch = touchA === "1", wantShots = shotsA === "1" && engine === "chromium";
const BASE = `http://127.0.0.1:${port}/`;
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, reducedMotion: prm ? "reduce" : "no-preference", colorScheme: scheme, hasTouch: touch, isMobile: false });
await ctx.addInitScript(() => {
  window.__raster = [];
  const d = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) { const t = performance.now(); const r = d.apply(this, a); window.__raster.push({ t, dur: performance.now() - t, px: `${this.canvas.width}x${this.canvas.height}` }); return r; };
  window.__loaf = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__loaf.push({ t: e.startTime, dur: e.duration, scripts: (e.scripts || []).map((s) => `${(s.invoker || "").replace(/blob:[^"\]]+/, "blob:…").slice(0, 60)} ${(s.sourceURL || "").split("/").pop().split("?")[0]}:${s.sourceFunctionName || ""} ${s.duration.toFixed(0)}ms`) }); }).observe({ type: "long-animation-frame", buffered: false }); } catch {}
  window.__sample = (ms) => new Promise((res) => {
    const mx = (tf) => { if (!tf || tf === "none") return { s: 1, r: 0 }; const m = tf.match(/matrix\(([^)]+)\)/); if (!m) return { s: null, r: null }; const [a, b] = m[1].split(",").map(Number); return { s: +Math.hypot(a, b).toFixed(4), r: +(Math.atan2(b, a) * 180 / Math.PI).toFixed(1) }; };
    const q = (s) => document.querySelector(s);
    const icon = (sel) => { const el = q(sel); if (!el) return null; const cs = getComputedStyle(el); const w = el.querySelector(".warp"); const wm = w ? mx(getComputedStyle(w).transform) : { s: null, r: null }; return { op: +(+cs.opacity).toFixed(3), vis: cs.visibility[0], sc: cs.scale, f: (el.getAttribute("filter") || "") + "|" + (cs.filter === "none" ? "" : cs.filter.slice(0, 24)), ws: wm.s, wr: wm.r }; };
    const rest = (sel) => { const el = q(sel); if (!el) return null; const cs = getComputedStyle(el); return { vis: cs.visibility[0], op: +(+cs.opacity).toFixed(3), pose: [...el.querySelectorAll("img.rest-pose")].findIndex((i) => i.classList.contains("is-pose-active")) }; };
    const bg = (sel) => { const el = q(sel); return el ? getComputedStyle(el).backgroundColor : null; };
    const gridKey = () => { const all = [...document.querySelectorAll(".boil-frame-bitmap")]; if (!all.length) return null; if (all[0].tagName.toLowerCase() === "image") return "href:" + all.map((e) => (e.getAttribute("href") || "").slice(-4)).join(","); return "ink:" + getComputedStyle(all[0]).backgroundColor; };
    const logoKey = () => [...document.querySelectorAll(".logo-pose-bmp")].map((i) => (i.getAttribute("href") || "").slice(-4)).join(",");
    const frames = []; const t0 = performance.now(); window.__t0 = t0;
    const tick = (now) => {
      const btn = q(".sun-moon-toggle");
      frames.push({ t: +(now - t0).toFixed(1), sun: icon(".toggle-sun"), moon: icon(".toggle-moon"), rs: rest(".rest-sun"), rm: rest(".rest-moon"), btn: btn ? getComputedStyle(btn).scale : null, turning: btn ? btn.classList.contains("is-turning") : null, dark: document.documentElement.classList.contains("dark"), pr: bg(".page-root"), bw: bg(".board-wrapper"), grid: gridKey(), gA: (() => { const e = q(".boil-frame-bitmap.is-active"); return e ? (e.tagName.toLowerCase() === "image" ? (e.getAttribute("href") || "").slice(-4) : getComputedStyle(e).backgroundColor) : null; })(), logo: logoKey() });
      if (now - t0 < ms) requestAnimationFrame(tick); else res(frames);
    };
    requestAnimationFrame(tick);
  });
});
const page = await ctx.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
let navs = 0; page.on("framenavigated", (f) => { if (f === page.mainFrame()) navs++; });
async function boot(url) {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4 && document.querySelectorAll(".rest-moon img.rest-pose").length === 4, null, { timeout: 30000 }).catch(() => errors.push("celestial bake not observed"));
  await page.waitForTimeout(3500);
}
async function screencast() {
  if (!wantShots) return { stop: async () => [] };
  const cdp = await ctx.newCDPSession(page); const shots = [];
  cdp.on("Page.screencastFrame", async (f) => { shots.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1 });
  return { stop: async () => { await cdp.send("Page.stopScreencast"); return shots; } };
}
const drain = () => page.evaluate(() => ({ raster: window.__raster.splice(0), loaf: window.__loaf.splice(0), t0: window.__t0, origin: performance.timeOrigin }));
const result = { port, engine, vp, scheme, prm, touch, dpr: 2, runs: [] };
const shotDir = out.replace(/\.json$/, "-shots"); if (wantShots) mkdirSync(shotDir, { recursive: true });
const tbox = await (async () => { await boot(BASE); return page.evaluate(() => { const r = document.querySelector(".sun-moon-toggle .toggle-icon").getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); }); })();
result.toggleBox = tbox;
for (let i = 0; i < 4; i++) {
  const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await drain();
  const sc = await screencast();
  await page.waitForTimeout(150);
  const navs0 = navs;
  const p = page.evaluate((m) => window.__sample(m), 1500);
  await page.waitForTimeout(60);
  const actAt = await page.evaluate(() => performance.now() - window.__t0);
  if (touch) await page.tap(".sun-moon-toggle", { force: true }); else await page.click(".sun-moon-toggle", { force: true });
  const frames = await p;
  await page.waitForTimeout(200);
  const shots = await sc.stop();
  const d = await drain();
  const rel = (t) => +(t - d.t0).toFixed(1);
  const run = { label: `flip${i}`, direction: `${before ? "dark" : "light"}->${(await page.evaluate(() => document.documentElement.classList.contains("dark"))) ? "dark" : "light"}`, actAt: +actAt.toFixed(1), reloaded: navs !== navs0, frames,
    raster: d.raster.map((r) => ({ at: rel(r.t), dur: +r.dur.toFixed(1), px: r.px })).filter((r) => r.px !== "16x16" && r.px !== "24x24"),
    loaf: d.loaf.filter((l) => l.dur > 30).map((l) => ({ at: rel(l.t), dur: +l.dur.toFixed(1), scripts: l.scripts })) };
  if (wantShots) run.shots = shots.map((s, k) => { const t = +(s.ts - d.origin - d.t0).toFixed(1); const f = `${shotDir}/${run.label}-${String(k).padStart(3, "0")}-t${Math.round(t)}.jpg`; writeFileSync(f, Buffer.from(s.data, "base64")); return { t, f }; });
  result.runs.push(run);
  await page.waitForTimeout(1200);
}
result.errors = errors;
writeFileSync(out, JSON.stringify(result));
await browser.close();
console.log("ok", out, result.runs.map((r) => `${r.label}(${r.direction}):${r.frames.length}f${r.reloaded ? " RELOADED" : ""}${r.shots ? "/" + r.shots.length + "shots" : ""}`).join(" "), errors.length ? "errors:" + errors.join("|") : "");
