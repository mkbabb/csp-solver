import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");
const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
for (const f of process.argv.slice(2)) {
  const { data, info } = await sharp(f).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  // r1c1: the user 5 sits in x 40..95, y 40..100 (device px of the crop); paper = the mode of that box
  const px = [];
  for (let y = 44; y < 96; y++) for (let x = 44; x < 92; x++) { const i = (y * W + x) * 3; px.push([data[i], data[i + 1], data[i + 2]]); }
  const key = (p) => p.join(",");
  const counts = new Map(); for (const p of px) counts.set(key(p), (counts.get(key(p)) ?? 0) + 1);
  const paper = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const Lp = L(...paper);
  const ratios = px.map((p) => { const l = L(...p); return (Math.max(l, Lp) + 0.05) / (Math.min(l, Lp) + 0.05); }).sort((a, b) => b - a);
  const core = ratios[Math.floor(ratios.length * 0.02)];
  console.log(`${f.split("/").pop()}: paper rgb(${paper}) · user-5 core contrast (p98 of the cell) ${core.toFixed(2)}:1 · max ${ratios[0].toFixed(2)}`);
}
