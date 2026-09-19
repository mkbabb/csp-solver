/**
 * PLR-COUNT G16 — THE INK FLOOR. Coverage-weighted painted ink on a strip, in CSS px².
 *
 * The 5↔6 swap replaces five coloured strokes with one written digit, and pass 2 measured that
 * the digit paints 85.4% less ink than five strokes and 33% less than ONE — a magnitude that
 * runs backwards at the moment the room grows. This reads that number off the real raster, so
 * the gate can be a FLOOR (`ink(6) >= ink(1)`) rather than an opinion.
 *
 * COVERAGE, not a pixel count: each pixel's ink is its manhattan distance from the strip's
 * ground divided by the strip's own darkest core, clamped to [0,1], so an antialiased edge
 * counts as the fraction of a pixel it actually covers. The sum is divided by dpr² to land in
 * CSS px², which is the unit the spec's table is written in.
 *
 * Run from web/frontend:  node <this> <label>=<strip.png> ... [--dpr 3]
 */
import { createRequire } from "node:module";
const require = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const sharp = require("sharp");

const args = process.argv.slice(2);
const dprAt = args.indexOf("--dpr");
const dpr = dprAt >= 0 ? Number(args[dprAt + 1]) : 3;
const files = args.filter((a, i) => a.includes("=") && i !== dprAt + 1);

async function ink(file) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();
  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [raw[i], raw[i + 1], raw[i + 2]];
  };
  // ground = the modal colour of the four corners' 6px squares (pixels.mjs's own rule)
  const counts = new Map();
  for (const [ox, oy] of [
    [0, 0],
    [width - 6, 0],
    [0, height - 6],
    [width - 6, height - 6],
  ])
    for (let y = oy; y < oy + 6; y++)
      for (let x = ox; x < ox + 6; x++) {
        const k = at(x, y).join(",");
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
  const ground = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])[0][0]
    .split(",")
    .map(Number);
  const dist = (p) =>
    Math.abs(p[0] - ground[0]) + Math.abs(p[1] - ground[1]) + Math.abs(p[2] - ground[2]);

  let core = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) core = Math.max(core, dist(at(x, y)));
  if (!core) return { file, ground, corePeak: 0, inkPx2: 0, litPx: 0 };

  let sum = 0;
  let lit = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const d = dist(at(x, y));
      if (d <= 8) continue; // paper noise floor, in manhattan bytes
      sum += Math.min(1, d / core);
      lit++;
    }
  return {
    file,
    ground,
    corePeak: core,
    devicePx: { width, height },
    litDevicePx: lit,
    inkPx2: +(sum / (dpr * dpr)).toFixed(2),
  };
}

const out = {};
for (const pair of files) {
  const [label, file] = pair.split("=");
  out[label] = await ink(file);
}
console.log(JSON.stringify({ dpr, marks: out }, null, 1));
