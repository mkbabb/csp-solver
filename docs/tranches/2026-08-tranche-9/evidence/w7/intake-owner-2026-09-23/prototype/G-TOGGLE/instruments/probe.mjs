// G-TOGGLE prototype probe — census:toggle's probe.mjs (T9-M21) extended:
//   · one encoded ?board= payload (every frame, every tree)
//   · per frame: a GIVEN digit's computed stroke, the grid's active pose href, both bodies'
//     live filter + warp + opacity, the first star/sparkle's opacity + scale per body
//   · modes: plain | inject (300 ms busy loop at +100) | repress (second press at +80)
// node probe.mjs <port> <engine> <vw>x<vh> <scheme> <prm 0|1> <touch 0|1> <out.json> [shots 0|1] [mode] [flips]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [port, engine, vp, scheme, prmA, touchA, out, shotsA, mode = "plain", flipsA = "4"] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const prm = prmA === "1", touch = touchA === "1", wantShots = shotsA === "1" && engine === "chromium";
const FLIPS = +flipsA;
const PAYLOAD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const BASE = `http://127.0.0.1:${port}/?board=${PAYLOAD}`;
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, reducedMotion: prm ? "reduce" : "no-preference", colorScheme: scheme, hasTouch: touch, isMobile: false });
await ctx.addInitScript(() => {
  window.__raster = [];
  window.__clicks = [];
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest(".sun-moon-toggle")) window.__clicks.push(performance.now()); }, true);
  const d = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) { const t = performance.now(); const r = d.apply(this, a); window.__raster.push({ t, dur: performance.now() - t, px: `${this.canvas.width}x${this.canvas.height}` }); return r; };
  window.__sample = (ms) => new Promise((res) => {
    const mx = (tf) => { if (!tf || tf === "none") return { s: 1, r: 0 }; const m = tf.match(/matrix\(([^)]+)\)/); if (!m) return { s: null, r: null }; const [a, b] = m[1].split(",").map(Number); return { s: +Math.hypot(a, b).toFixed(4), r: +(Math.atan2(b, a) * 180 / Math.PI).toFixed(1) }; };
    const q = (s) => document.querySelector(s);
    const star = (el) => { if (!el) return null; const cs = getComputedStyle(el); return { op: +(+cs.opacity).toFixed(3), sc: cs.scale }; };
    const icon = (sel) => { const el = q(sel); if (!el) return null; const cs = getComputedStyle(el); const w = el.querySelector(".warp"); const wm = w ? mx(getComputedStyle(w).transform) : { s: null, r: null }; return { op: +(+cs.opacity).toFixed(3), vis: cs.visibility[0], sc: cs.scale, f: el.getAttribute("filter") || "", ws: wm.s, wr: wm.r, st: star(el.querySelector(".twinkle-star")), dot: star(el.querySelector(".dot-star")) }; };
    const rest = (sel) => { const el = q(sel); if (!el) return null; const cs = getComputedStyle(el); return { vis: cs.visibility[0], op: +(+cs.opacity).toFixed(3), pose: [...el.querySelectorAll("img.rest-pose")].findIndex((i) => i.classList.contains("is-pose-active")) }; };
    const bg = (sel) => { const el = q(sel); return el ? getComputedStyle(el).backgroundColor : null; };
    const gridKey = () => { const all = [...document.querySelectorAll(".boil-frame-bitmap")]; if (!all.length) return null; return all.map((e) => (e.getAttribute("href") || "").slice(-4)).join(","); };
    const digit = () => { const e = document.querySelector(".glyph-svg path"); return e ? getComputedStyle(e).stroke : null; };
    const frames = []; const t0 = performance.now(); window.__t0 = t0;
    const tick = (now) => {
      const btn = q(".sun-moon-toggle");
      frames.push({ t: +(now - t0).toFixed(1), sun: icon(".toggle-sun"), moon: icon(".toggle-moon"), rs: rest(".rest-sun"), rm: rest(".rest-moon"), btn: btn ? getComputedStyle(btn).scale : null, btf: btn ? getComputedStyle(btn).transform : null, turning: btn ? btn.classList.contains("is-turning") : null, dark: document.documentElement.classList.contains("dark"), tt: document.documentElement.classList.contains("theme-turning"), pr: bg(".page-root"), bw: bg(".board-wrapper"), grid: gridKey(), gA: (() => { const e = q(".boil-frame-bitmap.is-active"); return e ? (e.getAttribute("href") || "").slice(-4) : null; })(), dig: digit() });
      if (now - t0 < ms) requestAnimationFrame(tick); else res(frames);
    };
    requestAnimationFrame(tick);
  });
});
const page = await ctx.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
async function boot(url) {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4 && document.querySelectorAll(".rest-moon img.rest-pose").length === 4, null, { timeout: 30000 }).catch(() => errors.push("celestial bake not observed"));
  await page.waitForFunction(() => document.querySelectorAll(".glyph-svg path").length >= 20, null, { timeout: 30000 }).catch(() => errors.push("digits not observed"));
  await page.waitForTimeout(3500);
}
async function screencast() {
  if (!wantShots) return { stop: async () => [] };
  const cdp = await ctx.newCDPSession(page); const shots = [];
  cdp.on("Page.screencastFrame", async (f) => { shots.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1, maxWidth: vw, maxHeight: vh });
  return { stop: async () => { await cdp.send("Page.stopScreencast"); return shots; } };
}
const drain = () => page.evaluate(() => ({ raster: window.__raster.splice(0), clicks: window.__clicks.splice(0), t0: window.__t0, origin: performance.timeOrigin }));
const result = { port, engine, vp, scheme, prm, touch, mode, dpr: 2, runs: [] };
const shotDir = out.replace(/\.json$/, "-shots"); if (wantShots) mkdirSync(shotDir, { recursive: true });
await boot(BASE);
result.boardBox = await page.evaluate(() => { const r = document.querySelector(".board-wrapper").getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); });
result.toggleBox = await page.evaluate(() => { const r = document.querySelector(".sun-moon-toggle .toggle-icon").getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); });
result.digits = await page.evaluate(() => document.querySelectorAll(".glyph-svg path").length);
for (let i = 0; i < FLIPS; i++) {
  const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await drain();
  const sc = await screencast();
  await page.waitForTimeout(150);
  const p = page.evaluate((m) => window.__sample(m), 1700);
  await page.waitForTimeout(60);
  const actAt = await page.evaluate(() => performance.now() - window.__t0);
  if (mode === "inject") await page.evaluate(() => setTimeout(() => { const e = performance.now() + 300; while (performance.now() < e) {} }, 100));
  if (touch) await page.tap(".sun-moon-toggle", { force: true }); else await page.click(".sun-moon-toggle", { force: true });
  let reAt = null;
  if (mode === "repress") { await page.waitForTimeout(80); reAt = await page.evaluate(() => performance.now() - window.__t0); if (touch) await page.tap(".sun-moon-toggle", { force: true }); else await page.click(".sun-moon-toggle", { force: true }); }
  const frames = await p;
  await page.waitForTimeout(300);
  const shots = await sc.stop();
  const d = await drain();
  const rel = (t) => +(t - d.t0).toFixed(1);
  const after = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  const run = { label: `flip${i}`, direction: `${before ? "dark" : "light"}->${after ? "dark" : "light"}`, actAt: +actAt.toFixed(1), reAt, clicks: d.clicks.map(rel), frames,
    raster: d.raster.map((r) => ({ at: rel(r.t), dur: +r.dur.toFixed(1), px: r.px })).filter((r) => r.px !== "16x16" && r.px !== "24x24") };
  // settle probe: style writes over three still frames after the gesture (GA9)
  run.still = await page.evaluate(() => new Promise((res) => { const el = document.querySelector(".sun-moon-toggle"); const snap = () => [...el.querySelectorAll("*"), el].map((e) => e.getAttribute("class") + "|" + (e.getAttribute("style") || "") + "|" + (e.getAttribute("filter") || "")).join(";"); const a = snap(); requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => res({ same: snap() === a, anims: el.getAnimations({ subtree: true }).length, btnTransform: getComputedStyle(el).transform })))); }));
  if (wantShots) { const c0 = d.clicks.length ? d.clicks[0] - d.t0 : actAt; run.shots = shots.map((s, k) => ({ t: +(s.ts - d.origin - d.t0).toFixed(1), k, s })).filter((x) => x.t >= c0 - 50 && x.t <= c0 + 1150).map(({ t, k, s }) => { const f = `${shotDir}/${run.label}-${String(k).padStart(3, "0")}-t${Math.round(t)}.png`; writeFileSync(f, Buffer.from(s.data, "base64")); return { t, f }; }); }
  result.runs.push(run);
  await page.waitForTimeout(1200);
}
result.errors = errors;
writeFileSync(out, JSON.stringify(result));
await browser.close();
console.log("ok", out, `digits=${result.digits}`, result.runs.map((r) => `${r.label}(${r.direction}):${r.frames.length}f${r.shots ? "/" + r.shots.length + "shots" : ""}`).join(" "), errors.length ? "errors:" + errors.join("|") : "");
