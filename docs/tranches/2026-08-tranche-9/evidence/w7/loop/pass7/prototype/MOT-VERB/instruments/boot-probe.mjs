// boot-probe.mjs — the boot ruling vs the deal's wave, sampled post-paint (MessageChannel from rAF).
// node boot-probe.mjs <url> <engine> [runs] [scheme]
import { createRequire } from "node:module"; import os from "node:os";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [url, engine = "chromium", runs = "3", scheme = "light", prm = "no-preference", busy = ""] = process.argv.slice(2);
const browser = await pw[engine].launch();
for (let r = 0; r < +runs; r++) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme, reducedMotion: prm });
  if (busy) await ctx.addInitScript((b) => { const [ms, at] = b.split("@").map(Number); setTimeout(() => { const t = performance.now(); while (performance.now() - t < ms); window.__busyAt = t; }, at); }, busy);
  await ctx.addInitScript(() => {
    const w = window; w.__bp = []; w.__lt = [];
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) w.__lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: "longtask", buffered: true }); } catch {}
    const mc = new MessageChannel(); const q = []; mc.port1.onmessage = () => q.shift()?.();
    const read = () => {
      const lines = [...document.querySelectorAll(".board-wrapper path.grid-line")].filter((l) => !l.closest(".boil-frame-layer"));
      let ruled = 0, tot = 0, partial = 0;
      const per = [];
      for (const l of lines) { const L = parseFloat(l.style.strokeDasharray) || 0; const o = parseFloat(l.style.strokeDashoffset); const p = !L || l.style.strokeDasharray === "none" ? 1 : 1 - (isNaN(o) ? 0 : o) / L; ruled += Math.max(0, Math.min(1, p)); tot++; if (p > 0.001 && p < 0.999) partial++; per.push([l.classList.contains("frame-line") ? "f" : l.classList.contains("subgrid-line") ? "s" : "c", +p.toFixed(4)]); }
      const ink = document.querySelector(".board-wrapper .grid-ink") ? 1 : 0;
      const gl = [...document.querySelectorAll(".board-wrapper .glyph-svg path")];
      let inked = 0; for (const g of gl) { const d = g.style.strokeDasharray; const o = parseFloat(g.style.strokeDashoffset); const L = parseFloat(d); inked += !d || d === "none" ? 1 : Math.max(0, 1 - (isNaN(o) ? 0 : o) / L); }
      const ceil = document.querySelector(".hand-drawn-grid")?.getAttribute("data-hand-ceiling") ?? "";
      return { per, t: Math.round(performance.now()), ruled: tot ? ruled / tot : (ink ? 1 : 0), lines: tot, partial, bake: ink, digits: gl.length ? inked / gl.length : 0, ng: gl.length, ceil };
    };
    const tick = () => { q.push(() => w.__bp.push(read())); mc.port2.postMessage(0); if (performance.now() < 6000) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await page.goto(url); await page.waitForTimeout(6300);
  const bp = await page.evaluate(() => window.__bp); const lt = await page.evaluate(() => window.__lt);
  await ctx.close();
  const first = bp.find((f) => f.ruled > 0.001 && f.lines > 0); const drawn = bp.find((f) => f.bake);
  const r95 = bp.find((f) => f.ruled >= 0.95);
  const d5 = bp.find((f) => f.digits > 0.05);
  const bad = bp.filter((f) => f.ruled < 0.95 && f.digits > 0.05);
  let maxGap = 0, gt34 = 0, maxJump = 0;
  const win = bp.filter((f) => first && f.t >= first.t && (!r95 || f.t <= r95.t + 50));
  for (let i = 1; i < win.length; i++) { const g = win[i].t - win[i - 1].t; maxGap = Math.max(maxGap, g); if (g > 34) gt34++; maxJump = Math.max(maxJump, win[i].ruled - win[i - 1].ruled); }
  // per-line worst single-frame Δ by tier, max fronts, lines never seen partial
  const worst = { f: 0, s: 0, c: 0 }; let fronts = 0; const seenPartial = new Set(); let nLines = 0;
  for (let i = 0; i < bp.length; i++) { const per = bp[i].per; nLines = Math.max(nLines, per.length); let fr = 0;
    per.forEach(([k, p], j) => { if (p > 0.001 && p < 0.999) { fr++; seenPartial.add(j); } const q = bp[i - 1]?.per?.[j]?.[1]; if (q != null && bp[i - 1].per.length === per.length && q > 0 && p > q) worst[k] = Math.max(worst[k], p - q); });
    if (bp[i].ruled > 0.001 && bp[i].ruled < 0.999) fronts = Math.max(fronts, fr); }
  const neverPartial = nLines - seenPartial.size;
  const busyAt = await (async () => null)();
  const ltIn = lt.filter(([s]) => first && s >= first.t - 5 && (!r95 || s <= r95.t));
  console.log(`BOOT ${engine} ${scheme} ${prm}${busy ? " busy " + busy : ""} r${r} | worstΔ/frame f ${(worst.f * 100).toFixed(1)}% s ${(worst.s * 100).toFixed(1)}% c ${(worst.c * 100).toFixed(1)}% · max fronts ${fronts} · never partial ${neverPartial}/${nLines} | first stroke ${first?.t} · ruled95 ${r95?.t} · baked-layer ${drawn?.t} · digits>5% ${d5?.t} (ng ${d5?.ng}) · frames digits>5%&ruled<95% ${bad.length} (worst digits ${bad.length ? Math.max(...bad.map((b) => b.digits)).toFixed(3) : 0}) · in-draw: frames ${win.length} maxGap ${maxGap} >34 ${gt34} max ruled Δ/frame ${(maxJump * 100).toFixed(1)}% · longtasks in draw ${JSON.stringify(ltIn)} all ${JSON.stringify(lt.slice(0, 14))} · ceil '${bp.at(-1)?.ceil}' · errs ${errs.length} ${errs.slice(0, 2).join(" | ")} · load ${os.loadavg()[0].toFixed(1)}`);
}
await browser.close();
