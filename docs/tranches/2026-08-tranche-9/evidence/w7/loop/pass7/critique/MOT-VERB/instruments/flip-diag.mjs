// flip-diag.mjs (critic): WebKit/chromium, freeze at +T L->D, list what still animates on the user digit and
// its computed ink; then the same flip UNFROZEN, the user digit's computed stroke/fill/color read post-paint per frame.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [engine, base, T = "200"] = process.argv.slice(2); const P = process.env.P;
const b = await pw[engine].launch();
async function open() {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, colorScheme: "light", reducedMotion: "no-preference" });
  const p = await ctx.newPage(); await p.goto(`${base}/?game=sudoku&board=${P}`);
  await p.locator(".board-cells").first().waitFor(); await p.waitForTimeout(4500);
  await p.locator('.board-cells [aria-label="Row 1, column 1, empty"]').tap(); await p.keyboard.press("5"); await p.waitForTimeout(800);
  return [ctx, p];
}
const inkOf = () => { const c = document.querySelector('.board-cells [aria-label^="Row 1, column 1"]'); const cr = c.getBoundingClientRect(); const path = [...document.querySelectorAll(".glyph-svg path")].find((q) => { const r = q.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; return x > cr.left && x < cr.right && y > cr.top && y < cr.bottom; }); const cs = path ? getComputedStyle(path) : null; const ccs = getComputedStyle(c); return { tag: path ? path.getAttribute("class") : null, stroke: cs?.stroke, fill: cs?.fill, color: cs?.color, cellBg: ccs.backgroundColor, paper: getComputedStyle(document.querySelector(".board-wrapper")).backgroundColor }; };
{ const [ctx, p] = await open();
  await p.evaluate((T) => { new MutationObserver((_, o) => { if (!document.documentElement.classList.contains("dark")) return; o.disconnect(); requestAnimationFrame(() => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = T; } window.__frozen = true; }); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); }, +T);
  await p.locator(".sun-moon-toggle").tap(); await p.waitForFunction(() => window.__frozen); await p.waitForTimeout(150);
  const info = await p.evaluate((ink) => { const c = document.querySelector('.board-cells [aria-label^="Row 1, column 1"]'); const cr = c.getBoundingClientRect(); const inCell = (t) => { const r = t.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; return x > cr.left && x < cr.right && y > cr.top && y < cr.bottom && r.width < cr.width; }; const mine = []; for (const a of document.getAnimations()) { const t = a.effect?.target; if (t && t.getBoundingClientRect && inCell(t)) mine.push(`${a.constructor.name}:${a.transitionProperty ?? a.animationName ?? ""} ct=${a.currentTime} dur=${a.effect.getTiming().duration} delay=${a.effect.getTiming().delay} on ${t.tagName}.${t.getAttribute("class")}`); } return { n: document.getAnimations().length, mine, ink: (new Function("return (" + ink + ")()"))() }; }, inkOf.toString());
  console.log(`FROZEN ${engine} +${T}: total ${info.n}; on the user cell: ${info.mine.join(" ; ") || "none"}; ink ${JSON.stringify(info.ink)}`);
  await ctx.close(); }
{ const [ctx, p] = await open();
  await p.evaluate((ink) => { const f = new Function("return (" + ink + ")()"); window.__r = []; const mc = new MessageChannel(); const q = []; mc.port1.onmessage = () => q.shift()?.(); let t0 = null; new MutationObserver((_, o) => { if (!document.documentElement.classList.contains("dark")) return; o.disconnect(); t0 = performance.now(); const tick = () => { q.push(() => window.__r.push([Math.round(performance.now() - t0), f()])); mc.port2.postMessage(0); if (performance.now() - t0 < 500) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); }, inkOf.toString());
  await p.locator(".sun-moon-toggle").tap(); await p.waitForTimeout(900);
  const r = await p.evaluate(() => window.__r);
  for (const [t, i] of r.filter((_, k) => k % 2 === 0).slice(0, 18)) console.log(`LIVE ${engine} +${t}: path ${i.tag} stroke ${i.stroke} fill ${i.fill} color ${i.color} paper ${i.paper}`);
  await ctx.close(); }
await b.close();
