// G-MOTION instrument — census:motion's probe (census.mjs) extended for the prototype gates.
// node motion.mjs <scenario> <engine> <port> <vw>x<vh> <scheme> <prm 0|1> <touch 0|1> <out.json> [shots 0|1]
// scenarios: toggle | move | poster | ga8 | ga9 | idle | ga7neg
// Loads ONE encoded ?board= payload (the classic 9x9, codec v1, rawSize 3) on every arm.
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [scenario, engine, port, vp, scheme, prmA, touchA, out, shotsA] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const prm = prmA === "1", touch = touchA === "1";
const wantShots = shotsA === "1";
export const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const BASE = `http://127.0.0.1:${port}/?board=${BOARD}`;
const browser = await pw[engine].launch();
const shotDir = out.replace(/\.json$/, "-shots");
const ctxOpts = { viewport: { width: vw, height: vh }, deviceScaleFactor: 2, reducedMotion: prm ? "reduce" : "no-preference", colorScheme: scheme, hasTouch: touch, isMobile: false };
if (wantShots && engine === "webkit") { mkdirSync(shotDir, { recursive: true }); ctxOpts.recordVideo = { dir: shotDir, size: { width: vw, height: vh } }; }
const ctx = await browser.newContext(ctxOpts);
await ctx.addInitScript(() => {
  window.__raster = []; window.__enc = []; window.__href = 0; window.__marks = 0;
  const d = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) { const t = performance.now(); const r = d.apply(this, a); window.__raster.push({ t, dur: performance.now() - t, px: `${this.canvas.width}x${this.canvas.height}` }); return r; };
  const cu = URL.createObjectURL;
  URL.createObjectURL = function (b) { if (b && /image\/png|image\/webp/.test(b.type || "")) window.__enc.push({ t: performance.now(), type: b.type, size: b.size }); return cu.call(URL, b); };
  window.__loaf = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__loaf.push({ t: e.startTime, dur: e.duration, scripts: (e.scripts || []).map((s) => `${(s.invoker || "").replace(/blob:[^"\]]+/, "blob:…").slice(0, 60)} ${(s.sourceURL || "").split("/").pop().split("?")[0]}:${s.sourceFunctionName || ""} ${s.duration.toFixed(0)}ms`) }); }).observe({ type: "long-animation-frame", buffered: false }); } catch {}
  window.__anims = [];
  const an = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    const r = this.getBoundingClientRect();
    window.__anims.push({ t: performance.now(), cls: String(this.className?.baseVal ?? this.className).split(" ")[0], from: Array.isArray(kf) ? kf[0]?.transform : undefined, to: Array.isArray(kf) ? kf[kf.length - 1]?.transform : undefined, dur: opts?.duration, easing: opts?.easing, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)) });
    return an.call(this, kf, opts);
  };
  document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver((ms) => { for (const m of ms) if (m.attributeName === "href") window.__href++; }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["href"] });
  });
  // clip-aware visible fraction of an element's rect (every overflow-clipping ancestor + viewport)
  window.__visFrac = (el) => {
    const r = el.getBoundingClientRect(); let [x0, y0, x1, y1] = [r.left, r.top, r.right, r.bottom];
    const area = (x1 - x0) * (y1 - y0); if (area <= 0) return 0;
    for (let a = el.parentElement; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      const cx = cs.overflowX !== "visible", cy = cs.overflowY !== "visible";
      if (!cx && !cy) continue;
      const q = a.getBoundingClientRect();
      if (cx) { x0 = Math.max(x0, q.left); x1 = Math.min(x1, q.right); }
      if (cy) { y0 = Math.max(y0, q.top); y1 = Math.min(y1, q.bottom); }
    }
    x0 = Math.max(x0, 0); y0 = Math.max(y0, 0); x1 = Math.min(x1, innerWidth); y1 = Math.min(y1, innerHeight);
    return +(Math.max(0, x1 - x0) * Math.max(0, y1 - y0) / area).toFixed(3);
  };
  window.__filters = () => { let n = 0; for (const e of document.querySelectorAll("*")) { const cs = getComputedStyle(e); if (cs.filter !== "none" && cs.display !== "none") n++; } return n; };
  window.__sample = (spec, ms) => new Promise((res) => {
    const sc = (tf) => { if (!tf || tf === "none") return 1; const m = tf.match(/matrix\(([^)]+)\)/); if (!m) return null; const [a, b] = m[1].split(",").map(Number); return +Math.hypot(a, b).toFixed(4); };
    const R = (el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); };
    const frames = []; const t0 = performance.now(); window.__t0 = t0;
    const read = {
      rect: (el) => R(el),
      warp: (el) => sc(getComputedStyle(el).transform),
      icon: (el) => { const cs = getComputedStyle(el); return { op: +(+cs.opacity).toFixed(3), vis: cs.visibility[0] }; },
      vis: (el) => getComputedStyle(el).visibility[0],
      op: (el) => +(+getComputedStyle(el).opacity).toFixed(3),
      boardT: (el) => ({ r: R(el), inFace: !!el.closest(".live-face-slot"), vis: window.__visFrac(el) }),
      scrollTop: () => document.scrollingElement.scrollTop,
      marks: () => document.querySelectorAll(".is-folding,.is-unfolding").length,
      filters: () => window.__filters(),
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
const page = await ctx.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
async function boot(url) {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4 && document.querySelectorAll(".rest-moon img.rest-pose").length === 4, null, { timeout: 30000 }).catch(() => errors.push("celestial bake not observed"));
  if (url.includes("gallery")) await page.waitForSelector(".game-card", { timeout: 30000 });
  else await page.waitForSelector(".game-cell", { timeout: 30000 });
  if (process.env.ABL) await page.addStyleTag({ content: process.env.ABL }); // ablation arm (instrument only)
  await page.waitForTimeout(3500);
}
// Painted recorder (chromium): CDP screencast. A 3px magenta outline is injected on the board
// host for the move scenarios so the painted board is locatable in every frame.
async function screencast() {
  if (!wantShots || engine !== "chromium") return { stop: async () => [] };
  const cdp = await ctx.newCDPSession(page); const shots = [];
  cdp.on("Page.screencastFrame", async (f) => { shots.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1, maxWidth: vw, maxHeight: vh });
  return { stop: async () => { await cdp.send("Page.stopScreencast"); return shots; } };
}
async function drain() { return page.evaluate(() => ({ raster: window.__raster.splice(0), enc: window.__enc.splice(0), loaf: window.__loaf.splice(0), anims: window.__anims.splice(0), href: (() => { const h = window.__href; window.__href = 0; return h; })(), t0: window.__t0, origin: performance.timeOrigin })); }
const result = { scenario, engine, port, view: scenario, vp, scheme, prm, touch, dpr: 2, board: "classic 9x9 codec v1 rawSize 3 (" + BOARD.slice(0, 12) + "…)", runs: [] };
if (wantShots) mkdirSync(shotDir, { recursive: true });
async function measure(label, spec, ms, act, mid) {
  await drain();
  const sc = await screencast();
  await page.waitForTimeout(150);
  const p = page.evaluate(([s, m]) => window.__sample(s, m), [spec, ms]);
  await page.waitForTimeout(60);
  const actAt = await page.evaluate(() => performance.now() - window.__t0);
  await act();
  if (mid) await mid();
  const frames = await p;
  await page.waitForTimeout(200);
  const shots = await sc.stop();
  const d = await drain();
  const rel = (t) => +(t - d.t0).toFixed(1);
  const run = { label, actAt: +actAt.toFixed(1), frames, hrefSwaps: d.href, enc: d.enc.map((e) => ({ at: rel(e.t), size: e.size })), raster: d.raster.map((r) => ({ at: rel(r.t), dur: +r.dur.toFixed(1), px: r.px })).filter((r) => r.px !== "16x16" && r.px !== "24x24"), loaf: d.loaf.filter((l) => l.dur > 30).map((l) => ({ at: rel(l.t), dur: +l.dur.toFixed(1), scripts: l.scripts })), anims: d.anims.map((a) => ({ ...a, t: rel(a.t) })) };
  if (shots.length) run.shots = shots.map((s, i) => { const t = +(s.ts - d.origin - d.t0).toFixed(1); const f = `${shotDir}/${label}-${String(i).padStart(3, "0")}-t${Math.round(t)}.png`; writeFileSync(f, Buffer.from(s.data, "base64")); return { t, f }; });
  result.runs.push(run);
  return run;
}
const MOVE_SPEC = { board: [".board-peek-host", "boardT"], card: [".game-card.is-center", "rect"], face: [".game-card.is-center .game-card-face", "rect"], deck: [".game-gallery", "rect"], galOp: [".game-gallery", "op"], word: [".masthead .handwritten-logo", "rect"], scroll: [null, "scrollTop"], marks: [null, "marks"] };
const OUTLINE = ".board-peek-host{outline:3px solid #ff00ff !important;outline-offset:0 !important}";
async function focusDeck() { await page.focus('[role="listbox"]').catch(() => {}); }

if (scenario === "toggle") {
  await boot(BASE + (vw >= 1024 && scheme === "gallery" ? "" : ""));
  const spec = { sunW: [".toggle-sun .warp", "warp"], moonW: [".toggle-moon .warp", "warp"], sun: [".toggle-sun", "icon"], moon: [".toggle-moon", "icon"], restSun: [".rest-sun", "vis"], restMoon: [".rest-moon", "vis"], restSunOp: [".rest-sun", "op"], restMoonOp: [".rest-moon", "op"] };
  for (let i = 0; i < 4; i++) {
    const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    const run = await measure(`flip${i}`, spec, 1500, () => page.click(".sun-moon-toggle", { force: true }));
    run.direction = `${before ? "dark" : "light"}->${(await page.evaluate(() => document.documentElement.classList.contains("dark"))) ? "dark" : "light"}`;
    await page.waitForTimeout(1200);
  }
} else if (scenario === "togglegallery") {
  await boot(BASE.replace("?", "?view=gallery&"));
  const spec = { sunW: [".toggle-sun .warp", "warp"], moonW: [".toggle-moon .warp", "warp"], sun: [".toggle-sun", "icon"], moon: [".toggle-moon", "icon"], restSun: [".rest-sun", "vis"], restMoon: [".rest-moon", "vis"], restSunOp: [".rest-sun", "op"], restMoonOp: [".rest-moon", "op"] };
  for (let i = 0; i < 4; i++) {
    const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    const run = await measure(`flip${i}`, spec, 1500, () => page.click(".sun-moon-toggle", { force: true }));
    run.direction = `${before ? "dark" : "light"}->${(await page.evaluate(() => document.documentElement.classList.contains("dark"))) ? "dark" : "light"}`;
    await page.waitForTimeout(1200);
  }
} else if (scenario === "move" || scenario === "ga7neg") {
  await boot(BASE);
  if (wantShots) await page.addStyleTag({ content: OUTLINE });
  if (scenario === "ga7neg") await page.addStyleTag({ content: ".game-gallery.gallery-fade-leave-active{z-index:2 !important}" });
  const pre = await page.evaluate(() => { const r = document.querySelector(".board-peek-host").getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
  result.restBoard = pre;
  await measure("enter", { ...MOVE_SPEC, filters: [null, "filters"] }, 1400, () => page.keyboard.press("g"));
  await page.waitForTimeout(1500);
  result.galleryRest = await page.evaluate(() => { const q = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)); }; return { board: q(".board-peek-host"), face: q(".game-card.is-center .game-card-face"), card: q(".game-card.is-center"), slotOverflow: document.querySelector(".live-face-slot") ? getComputedStyle(document.querySelector(".live-face-slot")).overflow : null, marks: document.querySelectorAll(".is-folding,.is-unfolding").length, filters: window.__filters(), fit: document.querySelector(".live-face-fit")?.style.getPropertyValue("--live-fit") }; });
  await focusDeck();
  await measure("exit", MOVE_SPEC, 1400, () => page.keyboard.press("Enter"));
  await page.waitForTimeout(1200);
  result.playRest = await page.evaluate(() => { const r = document.querySelector(".board-peek-host").getBoundingClientRect(); return { board: [r.x, r.y, r.width, r.height], marks: document.querySelectorAll(".is-folding,.is-unfolding").length, gallery: !!document.querySelector(".game-gallery"), filters: window.__filters() }; });
} else if (scenario === "poster") {
  await boot(BASE);
  await page.keyboard.press("g");
  await page.waitForTimeout(1800);
  await focusDeck();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1500);
  await measure("exitPoster", MOVE_SPEC, 1600, () => page.keyboard.press("Enter"));
  await page.waitForTimeout(1500);
} else if (scenario === "ga8") {
  // 390 scrolled to the deck; negative control = the in-flow leave (?neg)
  await boot(BASE);
  if (process.env.NEG === "1") await page.addStyleTag({ content: ".game-gallery.gallery-fade-leave-active{position:static !important;width:auto !important;height:auto !important}" });
  await page.keyboard.press("g");
  await page.waitForTimeout(1800);
  await page.evaluate(() => { document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight; });
  await page.waitForTimeout(300);
  result.scroll = await page.evaluate(() => ({ top: document.scrollingElement.scrollTop, max: document.scrollingElement.scrollHeight - innerHeight }));
  await focusDeck();
  await page.evaluate(() => { document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight; });
  await measure("exitScrolled", MOVE_SPEC, 1200, () => page.keyboard.press("Enter"));
} else if (scenario === "ga9") {
  await boot(BASE);
  // A: fold interrupted by the exit
  await page.keyboard.press("g");
  await page.waitForTimeout(MOTION_MID());
  await focusDeck();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1500);
  result.afterFoldInterrupted = await stillRead();
  // B: unfold interrupted by a re-enter
  await page.keyboard.press("g");
  await page.waitForTimeout(1800);
  await focusDeck();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
  await page.keyboard.press("g");
  await page.waitForTimeout(1800);
  result.afterUnfoldInterrupted = await stillRead();
} else if (scenario === "idle") {
  const url = process.env.VIEW === "gallery" ? BASE.replace("?", "?view=gallery&") : BASE;
  await boot(url);
  await page.waitForTimeout(1500);
  result.idle = await page.evaluate(() => new Promise((res) => { const ts = []; const t0 = performance.now(); const tick = (n) => { ts.push(n); if (n - t0 < 3000) requestAnimationFrame(tick); else { const d = ts.slice(1).map((t, i) => t - ts[i]); res({ frames: d.length, fps: +(d.length / ((ts[ts.length - 1] - ts[0]) / 1000)).toFixed(1), long33: d.filter((x) => x > 33.4).length, long50: d.filter((x) => x > 50).length, worst: +Math.max(...d).toFixed(1), filters: window.__filters() }); } }; requestAnimationFrame(tick); }));
  const enc = await page.evaluate(() => window.__enc.length);
  result.idle.encodesSinceBoot = enc;
}
function MOTION_MID() { return 330; }
async function stillRead() {
  return page.evaluate(() => new Promise((res) => {
    let muts = 0;
    const targets = [...document.querySelectorAll(".game-card, .board-group, .game-gallery, .live-face-slot, .live-face-fit")];
    const mo = new MutationObserver((ms) => { muts += ms.length; });
    for (const t of targets) mo.observe(t, { attributes: true, attributeFilter: ["class", "style"] });
    const snap = () => targets.map((t) => { const cs = getComputedStyle(t); const r = t.getBoundingClientRect(); return [cs.overflow, cs.position, cs.zIndex, cs.transform, r.x.toFixed(1), r.y.toFixed(1), r.width.toFixed(1)].join("|"); }).join(";");
    const s = []; requestAnimationFrame(() => { s.push(snap()); requestAnimationFrame(() => { s.push(snap()); requestAnimationFrame(() => { s.push(snap()); mo.disconnect();
      const slot = document.querySelector(".live-face-slot");
      res({ view: document.querySelector(".game-gallery") ? "gallery" : "playing", marks: document.querySelectorAll(".is-folding,.is-unfolding").length, pinned: document.querySelector(".game-gallery")?.style.position || "", slotOverflow: slot ? getComputedStyle(slot).overflow : null, anims: document.getAnimations().filter((a) => a.id === "flip-glide").length, styleWrites3Frames: muts, stillFrames: s[0] === s[1] && s[1] === s[2] }); }); }); });
  }));
}
result.errors = errors;
writeFileSync(out, JSON.stringify(result));
await ctx.close();
await browser.close();
console.log("ok", out, result.runs.map((r) => `${r.label}${r.direction ? "(" + r.direction + ")" : ""}:${r.frames.length}f${r.shots ? "/" + r.shots.length + "shots" : ""}`).join(" "), errors.length ? "errors:" + errors.join("|") : "");
