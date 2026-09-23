/**
 * NOTE-LEDGER pass 5 — the ballot frame: one PNG per cell, a grid of panels shot by
 * `ledger.probe.ts` (frames row) on ONE encoded board. Rows = the arm (the one variable),
 * columns = the pose (P1 ask·answer, P2 ask·answer·next write). A label gutter names each row;
 * nothing else is drawn. Usage: node composite.mjs <panels dir> <rig> <out.png> <scale>
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { join } from "node:path";

const [dir, rig, out, scaleArg] = process.argv.slice(2);
const scale = Number(scaleArg ?? 1);
const ARMS = ["hold", "age", "step", "tint"];
const POSES = ["P1", "P2"];
const LABEL = 96;
const GAP = 6;

const tiles = [];
for (const a of ARMS)
  for (const p of POSES) {
    const img = sharp(join(dir, `${rig}-${p}-${a}.png`));
    const m = await img.metadata();
    const w = Math.round(m.width * scale);
    const h = Math.round(m.height * scale);
    tiles.push({ a, p, w, h, buf: await img.resize(w, h).png().toBuffer() });
  }
const W = Math.max(...tiles.map((t) => t.w));
const H = Math.max(...tiles.map((t) => t.h));
const width = LABEL + POSES.length * (W + GAP);
const height = 28 + ARMS.length * (H + GAP);
const text = (x, y, s, size = 15) =>
  `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="${size}" fill="#333">${s}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${text(LABEL + 4, 19, "P1 · ask, answer")}
  ${text(LABEL + W + GAP + 4, 19, "P2 · ask, answer, next write")}
  ${ARMS.map((a, i) => text(8, 28 + i * (H + GAP) + H / 2 + 5, a.toUpperCase(), 16)).join("")}
</svg>`;
await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
  .composite([
    { input: Buffer.from(svg), left: 0, top: 0 },
    ...tiles.map((t) => ({
      input: t.buf,
      left: LABEL + POSES.indexOf(t.p) * (W + GAP),
      top: 28 + ARMS.indexOf(t.a) * (H + GAP),
    })),
  ])
  .png({ compressionLevel: 9, palette: true, colors: 128 })
  .toFile(out);
const m = await sharp(out).metadata();
console.log(`${out} ${m.width}x${m.height} ${(await import("node:fs")).statSync(out).size} B`);
