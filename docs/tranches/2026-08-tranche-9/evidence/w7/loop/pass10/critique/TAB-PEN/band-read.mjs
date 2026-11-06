// a candidate band read: max ΔE over near∖core of each PNG to the analytic mix P − cov·(P − I). usage: node band-read.mjs <treeFE> <png>...
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { pathToFileURL } from "node:url";
const [FE, ...pngs] = process.argv.slice(2);
const G = await import(pathToFileURL(path.join(FE, "scripts/check-favicon.mjs")).href);
const { PEN, ARM, WIDTH } = await import(pathToFileURL(path.join(FE, "scripts/icons.mjs")).href);
const { deltaE } = await import(pathToFileURL(path.join(FE, "scripts/shape-census.mjs")).href);
const sharp = createRequire(path.join(FE, "package.json"))("sharp");
const N = 180, ras = G.raster(PEN[ARM], WIDTH), R = G.CUTS["e.png-reach"];
const near = new Uint8Array(N * N), core = new Uint8Array(N * N).fill(1);
for (let i = 0; i < N * N; i++) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
  const [x, y] = [(i % N) + dx, Math.floor(i / N) + dy]; const j = x >= 0 && y >= 0 && x < N && y < N ? y * N + x : -1;
  if (ras.cov[i] > 0 && j >= 0) near[j] = 1; if (j < 0 || ras.cov[j] !== 1) core[i] = 0; }
for (const f of pngs) {
  const raw = await sharp(fs.readFileSync(f)).removeAlpha().raw().toBuffer();
  const P = [251, 250, 249], I = [10, 10, 10]; let mx = 0, n = 0;
  for (let i = 0; i < N * N; i++) if (near[i] && !core[i]) { const w = P.map((p, c) => (p - ras.cov[i] * (p - I[c])) / 255);
    const e = deltaE({ rgb: w, a: 1 }, { rgb: [raw[i * 3] / 255, raw[i * 3 + 1] / 255, raw[i * 3 + 2] / 255], a: 1 }); mx = Math.max(mx, e); if (e > 10) n++; }
  console.log(`${path.basename(path.dirname(path.dirname(f)))}: band max ΔE to the analytic mix ${mx.toFixed(2)} · px > 10: ${n}`);
}
