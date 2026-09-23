// critic probe (independent of the prototype's): per-rAF toggle bodies + page + board inks.
// node cprobe.mjs <port> <engine> <vw>x<vh> <scheme> <touch 0|1> <mode plain|reverse> <flips> <out.json>
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [port, engine, vp, scheme, touchA, mode, flipsA, out] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const touch = touchA === "1";
const PAYLOAD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const URL = `http://127.0.0.1:${port}/?board=${PAYLOAD}`;
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, colorScheme: scheme, hasTouch: touch, reducedMotion: "no-preference" });
await ctx.addInitScript(() => {
  window.__clicks = [];
  window.__styleMut = 0;
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest(".sun-moon-toggle")) window.__clicks.push(performance.now()); }, true);
  window.__sample = (ms) => new Promise((res) => {
    const q = (s) => document.querySelector(s);
    const sc = (tf) => { if (!tf || tf === "none") return 1; const m = tf.match(/matrix\(([^)]+)\)/); if (!m) return null; const [a, b] = m[1].split(",").map(Number); return +Math.hypot(a, b).toFixed(4); };
    const body = (sel) => { const el = q(sel); if (!el) return null; const cs = getComputedStyle(el); const w = el.querySelector(".warp"); const st = el.querySelector(".twinkle-star"); const dot = el.querySelector(".dot-star"); return { op: +(+cs.opacity).toFixed(3), v: cs.visibility === "visible" ? 1 : 0, s: w ? sc(getComputedStyle(w).transform) : null, st: st ? +(+getComputedStyle(st).opacity).toFixed(3) : null, dot: dot ? +(+getComputedStyle(dot).opacity).toFixed(3) : null, f: el.getAttribute("filter") }; };
    const rest = (sel) => { const el = q(sel); if (!el) return null; return getComputedStyle(el).visibility === "visible" ? 1 : 0; };
    const frames = []; const t0 = performance.now(); window.__t0 = t0;
    const tick = (now) => {
      const btn = q(".sun-moon-toggle");
      const paths = [...document.querySelectorAll(".glyph-svg path")];
      const given = paths.find((p) => (p.getAttribute("stroke") || "").includes("foreground"));
      const user = paths.find((p) => (p.getAttribute("stroke") || "").includes("user-ink"));
      const ga = q(".boil-frame-bitmap.is-active");
      frames.push({ t: +(now - t0).toFixed(1), sun: body(".toggle-sun"), moon: body(".toggle-moon"), rs: rest(".rest-sun"), rm: rest(".rest-moon"), turning: btn.classList.contains("is-turning"), btf: getComputedStyle(btn).transform, dark: document.documentElement.classList.contains("dark"), tt: document.documentElement.classList.contains("theme-turning"), pr: getComputedStyle(q(".page-root")).backgroundColor, bw: getComputedStyle(q(".board-wrapper")).backgroundColor, gv: given ? getComputedStyle(given).stroke : null, us: user ? getComputedStyle(user).stroke : null, gk: ga ? (ga.getAttribute("href") || "").slice(-6) : null });
      if (now - t0 < ms) requestAnimationFrame(tick); else res(frames);
    };
    requestAnimationFrame(tick);
  });
});
const page = await ctx.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(2500);
await page.goto(URL, { waitUntil: "load" });
await page.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4, null, { timeout: 30000 }).catch(() => errors.push("no bake"));
await page.waitForFunction(() => document.querySelectorAll(".glyph-svg path").length >= 20, null, { timeout: 30000 }).catch(() => errors.push("no digits"));
await page.waitForTimeout(2500);
// enter ONE user digit into row 0 col 2 (empty in the payload), so user ink is on the board
const cells = page.locator(".game-cell");
try { if (touch) await cells.nth(2).tap(); else await cells.nth(2).click(); await page.keyboard.press("4"); } catch (e) { errors.push("entry " + String(e).slice(0, 80)); }
await page.waitForTimeout(1500);
// click somewhere neutral so focus leaves the cell
await page.mouse.click(5, vh - 5).catch(() => {});
await page.waitForTimeout(1500);
const userInk = await page.evaluate(() => [...document.querySelectorAll(".glyph-svg path")].filter((p) => (p.getAttribute("stroke") || "").includes("user-ink")).length);
// style-attribute mutations on the button at REST (v-bind vars) over 3s
const restMut = await page.evaluate(() => new Promise((res) => { const el = document.querySelector(".sun-moon-toggle"); let n = 0, nTree = 0; const o = new MutationObserver((ms) => { for (const m of ms) { if (m.target === el && m.attributeName === "style") n++; else nTree++; } }); o.observe(el, { attributes: true, subtree: true }); setTimeout(() => { o.disconnect(); res({ btnStyle: n, subtree: nTree, style: el.getAttribute("style") }); }, 3000); }));
const result = { port, engine, vp, scheme, touch, mode, userInk, restMut, runs: [] };
for (let i = 0; i < +flipsA; i++) {
  await page.evaluate(() => window.__clicks.splice(0));
  const p = page.evaluate(() => window.__sample(1800));
  await page.waitForTimeout(120);
  const press = () => (touch ? page.tap(".sun-moon-toggle", { force: true }) : page.click(".sun-moon-toggle", { force: true }));
  // count style mutations on the button DURING the gesture
  await page.evaluate(() => { const el = document.querySelector(".sun-moon-toggle"); window.__gm = 0; window.__go = new MutationObserver((ms) => { for (const m of ms) if (m.target === el && m.attributeName === "style") window.__gm++; }); window.__go.observe(el, { attributes: true }); });
  await press();
  if (mode === "reverse") { await page.waitForTimeout(200); await press(); }
  const frames = await p;
  const gm = await page.evaluate(() => { window.__go.disconnect(); return window.__gm; });
  const clicks = await page.evaluate(() => window.__clicks.map((c) => c - window.__t0));
  const settleTf = await page.evaluate(() => getComputedStyle(document.querySelector(".sun-moon-toggle")).transform);
  result.runs.push({ i, clicks, frames, gestureBtnStyleMut: gm, settleTf });
  await page.waitForTimeout(1500);
}
result.errors = errors;
writeFileSync(out, JSON.stringify(result));
await browser.close();
console.log("ok", out, "userInk", userInk, "restMut", JSON.stringify(restMut).slice(0, 200), errors.join("|"));
