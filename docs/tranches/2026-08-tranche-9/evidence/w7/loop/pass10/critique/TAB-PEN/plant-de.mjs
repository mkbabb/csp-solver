// max and mean ΔE (shape-census deltaE) of each crit10 plant's moved pixels vs the shipped PNG
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module"; import { pathToFileURL } from "node:url";
const [D, FE] = process.argv.slice(2);
const { deltaE } = await import(pathToFileURL(path.join(FE, "scripts/shape-census.mjs")).href);
const sharp = createRequire(path.join(FE, "package.json"))("sharp");
const raw0 = await sharp(fs.readFileSync(path.join(FE, "public/apple-touch-icon.png"))).removeAlpha().raw().toBuffer();
const c = (b, i) => ({ rgb: [b[i] / 255, b[i + 1] / 255, b[i + 2] / 255], a: 1 });
for (const p of fs.readdirSync(D).filter((f) => /^C/.test(f)).sort()) {
  const raw = await sharp(fs.readFileSync(path.join(D, p, "public/apple-touch-icon.png"))).removeAlpha().raw().toBuffer();
  let [n, mx, sum] = [0, 0, 0];
  for (let i = 0; i < raw.length; i += 3) if (raw[i] !== raw0[i] || raw[i + 1] !== raw0[i + 1] || raw[i + 2] !== raw0[i + 2]) { const e = deltaE(c(raw0, i), c(raw, i)); n++; mx = Math.max(mx, e); sum += e; }
  console.log(`${p}: ${n} px moved, ΔE max ${mx.toFixed(1)} mean ${(sum / n).toFixed(1)}`);
}
