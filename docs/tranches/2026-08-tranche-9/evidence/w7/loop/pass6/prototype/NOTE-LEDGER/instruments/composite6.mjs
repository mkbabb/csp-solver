/**
 * NOTE-LEDGER pass 6 — the T9-B-LEDGER ballot frame, re-shot on the shipping `inherit` dists.
 * One PNG per cell from `ledger6.mjs` (frames mode) on ONE encoded board: rows = the arm (the one
 * variable), columns = P1 ask·answer · P2 +next write · P4 ask·answer·ask·answer, light, and P4
 * dark. Usage: node composite6.mjs <panels dir> <engine> <out.png> <scale>
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { join } from "node:path";
import { statSync } from "node:fs";

const [dir, eng, out, scaleArg] = process.argv.slice(2);
const scale = Number(scaleArg ?? 1);
const ARMS = ["hold", "age", "step", "tint"];
const COLS = [["P1", "light", "P1 · ask, answer"], ["P2", "light", "P2 · + next write"], ["P4", "light", "P4 · ask, answer, ask, answer"], ["P4", "dark", "P4 · dark"]];
const LABEL = 70, GAP = 6, HEAD = 26;
const tiles = [];
for (const a of ARMS)
  for (const [ci, [p, s]] of COLS.entries()) {
    const img = sharp(join(dir, `${eng}-${p}-${s}-${a}.png`));
    const m = await img.metadata();
    const w = Math.round(m.width * scale), h = Math.round(m.height * scale);
    tiles.push({ a, ci, w, h, buf: await img.resize(w, h).png().toBuffer() });
  }
const W = Math.max(...tiles.map((t) => t.w)), H = Math.max(...tiles.map((t) => t.h));
const width = LABEL + COLS.length * (W + GAP), height = HEAD + ARMS.length * (H + GAP);
const text = (x, y, s, size = 14) => `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="${size}" fill="#333">${s}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${COLS.map(([, , l], i) => text(LABEL + i * (W + GAP) + 4, 18, l)).join("")}
  ${ARMS.map((a, i) => text(6, HEAD + i * (H + GAP) + H / 2 + 5, a.toUpperCase(), 15)).join("")}
</svg>`;
await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
  .composite([{ input: Buffer.from(svg), left: 0, top: 0 }, ...tiles.map((t) => ({ input: t.buf, left: LABEL + t.ci * (W + GAP), top: HEAD + ARMS.indexOf(t.a) * (H + GAP) }))])
  .png({ compressionLevel: 9, palette: true, colors: 96 })
  .toFile(out);
const m = await sharp(out).metadata();
console.log(`${out} ${m.width}x${m.height} ${statSync(out).size} B`);
