// touch.mjs — TAB-PEN pass 7, INTAKE-23 row 26: the touch icon PHOTOGRAPHED. The 180 × 180 PNG as an <img> at 180 CSS px
// on #ffffff and #000000 grounds, DPR 1 and 2, chromium and webkit. From each photograph: the paper (the tile's modal
// colour), the darkest ink pixel, paper-on-ground and ink-on-paper contrasts, the ink coverage against the light tokens,
// and the photograph's max Δ against the PNG's own decoded pixels (DPR 1). Writes one PNG per engine × DPR for the frame.
// usage: node touch.mjs <file://…/dir holding touch-<arm>.png> <arms csv> <shots dir> <out.txt>
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const sharp = require("sharp");
const [DIR, ARMS, SHOTS, OUT] = process.argv.slice(2);
mkdirSync(SHOTS, { recursive: true });
const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const L = (p) => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const PAPER = [251, 250, 249], INK = [10, 10, 10];
const arms = ARMS.split(",");
const html = `<!doctype html><html><body style="margin:0;background:#888">${arms.map((a, i) =>
  ["#ffffff", "#000000"].map((g, j) => `<div style="position:absolute;left:${(2 * i + j) * 200}px;top:0;width:200px;height:200px;background:${g}"><img src="touch-${a}.png" width="180" height="180" style="position:absolute;left:10px;top:10px;display:block"></div>`).join("")).join("")}</body></html>`;
const page0 = `${fileURLToPath(DIR)}/touch.html`;
writeFileSync(page0, html);
const lines = [];
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  for (const dpr of [1, 2]) {
    const ctx = await b.newContext({ viewport: { width: 400 * arms.length, height: 200 }, deviceScaleFactor: dpr });
    const p = await ctx.newPage();
    await p.goto(`${DIR}/touch.html`);
    await p.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth === 180));
    const file = `${SHOTS}/touch-${engine}-dpr${dpr}.png`;
    await p.screenshot({ path: file });
    const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const [i, arm] of arms.entries())
      for (const [j, ground] of [[0, "#ffffff"], [1, "#000000"]]) {
        const x0 = ((2 * i + j) * 200 + 10) * dpr, y0 = 10 * dpr, n = 180 * dpr;
        const px = [];
        for (let y = y0; y < y0 + n; y++) for (let x = x0; x < x0 + n; x++) { const k = (y * info.width + x) * 3; px.push([data[k], data[k + 1], data[k + 2]]); }
        const counts = new Map(); for (const q of px) { const key = q.join(","); counts.set(key, (counts.get(key) ?? 0) + 1); }
        const paper = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
        const dark = px.reduce((m, q) => (L(q) < L(m) ? q : m), px[0]);
        const cov = px.reduce((s, q) => s + Math.min(1, Math.max(0, (L(PAPER) - L(q)) / (L(PAPER) - L(INK)))), 0) / px.length;
        const g = ground === "#ffffff" ? [255, 255, 255] : [0, 0, 0];
        let delta = "-";
        if (dpr === 1) {
          const own = await sharp(readFileSync(`${fileURLToPath(DIR)}/touch-${arm}.png`)).removeAlpha().raw().toBuffer();
          delta = Math.max(...px.map((q, k) => Math.max(...q.map((v, c) => Math.abs(v - own[k * 3 + c])))));
        }
        lines.push(`${engine} dpr${dpr} ${arm} on ${ground}: paper (${paper}) · darkest (${dark}) · paper/ground ${cr(L(paper), L(g)).toFixed(2)}:1 · ink/paper ${cr(L(dark), L(paper)).toFixed(2)}:1 · coverage ${cov.toFixed(3)} · photo vs PNG max Δ ${delta}`);
      }
    await ctx.close();
  }
  await b.close();
}
writeFileSync(OUT, lines.join("\n") + "\n");
console.log(lines.join("\n"));
