import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const req = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend/package.json");
const { chromium, webkit } = req("playwright");
const sharp = req("sharp");
const URL0 = "http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local";
const out = {};

const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const oklab = ([R, G, B]) => {
  const [r, g, b] = [R, G, B].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708*r + 0.5363325363*g + 0.0514459929*b);
  const m = Math.cbrt(0.2119034982*r + 0.6806995451*g + 0.1073969566*b);
  const s = Math.cbrt(0.0883024619*r + 0.2817188376*g + 0.6299787005*b);
  return [0.2104542553*l+0.793617785*m-0.0040720468*s,
          1.9779984951*l-2.428592205*m+0.4505937099*s,
          0.0259040371*l+0.7827717662*m-0.808675766*s];
};
const dE = (a, b) => { const [x,y]=[oklab(a),oklab(b)]; return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]); };
const lum = ([r,g,b]) => 0.2126*lin(r/255)+0.7152*lin(g/255)+0.0722*lin(b/255);
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

for (const [name, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  await page.goto(URL0, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, null, { timeout: 60000 });

  for (const theme of ["light", "dark"]) {
    await page.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

    // ---- canvas-oracle census over 144, my own token collection ----
    const census = await page.evaluate(async () => {
      const m = await import(/* @vite-ignore */ "/src/games/shared/playerIdentity.ts");
      const cs = getComputedStyle(document.documentElement);
      const band = cs.getPropertyValue("--peer-ink-l").trim();
      const inks = Array.from({ length: 144 }, (_, i) => m.inkFor(i)["--color-user-ink"]);
      const c = document.createElement("canvas"); c.width = c.height = 1;
      const g = c.getContext("2d", { willReadFrequently: true });
      const paint = (ground, css, alpha) => {
        g.globalAlpha = 1; g.globalCompositeOperation = "copy"; g.fillStyle = ground; g.fillRect(0,0,1,1);
        g.globalCompositeOperation = "source-over"; g.globalAlpha = alpha; g.fillStyle = css; g.fillRect(0,0,1,1);
        const d = g.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]];
      };
      const names = new Set();
      for (const s of document.styleSheets) { let rules; try { rules = s.cssRules; } catch { continue; }
        for (const r of rules) for (const mm of r.cssText.matchAll(/(--[a-z0-9-]+):/g)) names.add(mm[1]); }
      const resolved = inks.map((s) => paint("#808080", s.replace("var(--peer-ink-l)", band), 1));
      const tokens = [...names].map((n) => ({ n, v: cs.getPropertyValue(n).trim() }))
        .filter((t) => /^(#|rgb|hsl|oklch|color\()/i.test(t.v))
        .map((t) => ({ n: t.n, rgb: paint("#808080", t.v, 1) }));
      const grounds = {
        background: cs.getPropertyValue("--color-background").trim(),
        card: cs.getPropertyValue("--color-card").trim(),
        popover: cs.getPropertyValue("--color-popover").trim(),
      };
      const groundRgb = Object.fromEntries(Object.entries(grounds).map(([k,v]) => [k, paint(v, "rgba(0,0,0,0)", 0)]));
      // the ring: read the PRODUCT's own stroke-opacity out of the sheet
      let ringOp = null, fillOp = null;
      for (const s of document.styleSheets) { let rules; try { rules = s.cssRules; } catch { continue; }
        for (const r of rules) { const t = r.cssText || ""; if (t.includes("cell-ghost-path") && t.includes("stroke-opacity")) {
          ringOp = (/stroke-opacity:\s*([\d.]+)/.exec(t)||[])[1]; fillOp = (/fill-opacity:\s*([\d.]+)/.exec(t)||[])[1]; } } }
      return { band, inks, resolved, tokens, groundRgb, ringOp, fillOp, nTokens: tokens.length };
    });

    const chromatic = census.tokens.filter((t) => { const [,A,B] = oklab(t.rgb); return Math.hypot(A,B) > 0.06; });
    let nearest = { dE: Infinity, i: -1, token: "" }, under = 0;
    for (let i = 0; i < 144; i++) {
      let best = { dE: Infinity, token: "" };
      for (const t of chromatic) { const d = dE(census.resolved[i], t.rgb); if (d < best.dE) best = { dE: d, token: t.n }; }
      if (best.dE < 0.0764) under++;
      if (best.dE < nearest.dE) nearest = { dE: best.dE, i, token: best.token };
    }
    const aa = {};
    for (const [gname, grgb] of Object.entries(census.groundRgb)) {
      let worst = { r: Infinity, i: -1 };
      for (let i = 0; i < 144; i++) { const r = ratio(census.resolved[i], grgb); if (r < worst.r) worst = { r, i }; }
      aa[gname] = worst;
    }
    const pvp = {};
    for (const n of [3,4,8,16]) { let mn = Infinity;
      for (let i=0;i<n;i++) for (let k=i+1;k<n;k++) mn = Math.min(mn, dE(census.resolved[i], census.resolved[k]));
      pvp[n] = mn; }

    // ---- REAL SURFACE: paint a digit with the ink and read the glyph's own pixels ----
    const real = [];
    for (const idx of [0, 1, 35, 112, 115]) {
      const cellIdx = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].findIndex((i) => !i.value));
      await page.evaluate((ink) => document.documentElement.style.setProperty("--color-user-ink", ink), census.inks[idx]);
      const input = page.locator(".sudoku-cell input").nth(cellIdx);
      await input.click(); await input.fill("5");
      await page.waitForTimeout(400);
      const cell = page.locator(".sudoku-cell").nth(cellIdx);
      const buf = await cell.screenshot();
      const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const px = []; for (let p = 0; p < info.width*info.height; p++) px.push([data[p*4],data[p*4+1],data[p*4+2]]);
      const bg = census.groundRgb.card;
      let core = px[0], best = -1;
      for (const q of px) { const d = dE(q, bg); if (d > best) { best = d; core = q; } }
      real.push({ i: idx, requested: census.inks[idx], canvas: census.resolved[idx], glyphCore: core,
        dE_core_vs_canvas: dE(core, census.resolved[idx]), aa_core_vs_card: ratio(core, bg) });
      await input.fill("");
      await page.evaluate(() => document.documentElement.style.removeProperty("--color-user-ink"));
      await page.waitForTimeout(150);
    }
    out[`${name}/${theme}`] = { band: census.band, nTokens: census.nTokens, nChromatic: chromatic.length,
      nearest, under, aa, pvp, ringOp: census.ringOp, fillOp: census.fillOp, real };
    console.log(name, theme, JSON.stringify({ band: census.band, nearest, under, aa, pvp, ring: census.ringOp, fill: census.fillOp }));
    for (const r of real) console.log("  REAL", r.i, "canvas", r.canvas.join(","), "glyph", r.glyphCore.join(","), "dE", r.dE_core_vs_canvas.toFixed(4), "AAcore", r.aa_core_vs_card.toFixed(2));
  }
  await browser.close();
}
writeFileSync("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PAL-WALK-probe/independent-readings.json", JSON.stringify(out, null, 1));
console.log("DONE");
