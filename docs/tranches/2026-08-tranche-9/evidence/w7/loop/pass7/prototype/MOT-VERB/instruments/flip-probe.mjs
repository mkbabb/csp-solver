// flip-probe.mjs — the board's ink vs its paper across a theme flip, per frame, read POST-PAINT
// (computed colours, a MessageChannel task from each rAF). Inks: a given digit, a typed user digit,
// the grid (.boil-frame-bitmap background), the ghost ring. Paper: .board-wrapper background.
// node flip-probe.mjs <url> <engine> <w>x<h> <touch 0|1> [flips=2] [reversal 0|1]
import { createRequire } from "node:module"; import os from "node:os";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [url, engine = "chromium", vp = "1280x800", touch = "0", flips = "2", reversal = "0"] = process.argv.slice(2);
const [W, H] = vp.split("x").map(Number);
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, hasTouch: touch === "1", colorScheme: "light", reducedMotion: "no-preference" });
const page = await ctx.newPage();
await page.goto(url);
await page.locator(".board-cells").first().waitFor();
await page.waitForFunction(() => document.querySelector(".grid-ink") || document.querySelector(".boil-frame-bitmap"), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(3500);
// type a user digit into the first empty cell
const empty = page.locator('.board-cells [aria-label*="empty"]').first();
if (await empty.count()) { await empty.click(); await page.keyboard.press("4"); await page.waitForTimeout(600); }
const out = [];
for (let f = 0; f < +flips; f++) {
  await page.evaluate(() => {
    const parse = (c) => { const m = c.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const cr = (a, b) => { if (!a || !b) return null; const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const w = window; w.__fl = []; const mc = new MessageChannel(); const q = []; mc.port1.onmessage = () => q.shift()?.();
    const t0 = performance.now();
    const read = () => {
      const paper = parse(getComputedStyle(document.querySelector(".board-wrapper")).backgroundColor);
      const given = [...document.querySelectorAll(".board-cells .glyph-svg path")].find((p) => (p.getAttribute("stroke") || "").includes("foreground"));
      const user = [...document.querySelectorAll(".board-cells .glyph-svg path")].find((p) => (p.getAttribute("stroke") || "").includes("user-ink"));
      const grid = document.querySelector(".grid-ink .boil-frame-bitmap.is-active") ?? document.querySelector(".grid-ink .boil-frame-bitmap");
      return { t: Math.round(performance.now() - t0), dark: document.documentElement.classList.contains("dark"),
        given: given ? cr(parse(getComputedStyle(given).stroke), paper) : null, user: user ? cr(parse(getComputedStyle(user).stroke), paper) : null,
        grid: grid ? cr(parse(getComputedStyle(grid).backgroundColor), paper) : null, paper: paper?.join(",") };
    };
    const tick = () => { q.push(() => w.__fl.push(read())); mc.port2.postMessage(0); if (performance.now() - t0 < 700) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const btn = page.locator(".sun-moon-toggle, [aria-label*='dark' i], [aria-label*='light' i]").first();
  await btn.click();
  if (reversal === "1") { await page.waitForTimeout(220); await btn.click(); }
  await page.waitForTimeout(900);
  const fl = await page.evaluate(() => window.__fl);
  const stat = (k, floor) => { const v = fl.map((x) => x[k]).filter((x) => x != null); return v.length ? `${Math.min(...v).toFixed(2)} (${v.filter((x) => x < floor).length}f<${floor})` : "n/a"; };
  const dir = fl.at(-1)?.dark ? "light→dark" : "dark→light";
  out.push(`${dir}${reversal === "1" ? "+rev" : ""}: given ${stat("given", 3)} · user ${stat("user", 3)} · grid ${stat("grid", 3)} · frames ${fl.length}`);
  await page.waitForTimeout(1200);
}
console.log(`FLIP ${engine} ${vp} touch=${touch} | ${out.join(" | ")} | load ${os.loadavg()[0].toFixed(1)}`);
await browser.close();
