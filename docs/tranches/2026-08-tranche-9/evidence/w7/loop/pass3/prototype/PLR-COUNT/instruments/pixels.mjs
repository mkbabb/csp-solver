/**
 * PLR-COUNT pass-1 — THE PAINTED BYTES. Reads the strips the probe screenshots at dpr3 and
 * answers the two questions a contrast ratio cannot:
 *
 *   1. DOES THE COUNT SURVIVE — per row, the number of separated ink runs across the strip
 *      (the machine's own count of objects) against N, and the minimum ground-coloured gap
 *      between adjacent marks in device px.
 *   2. DOES THE COLOUR SURVIVE — per mark, the painted core converted to OKLCH: the chroma
 *      actually achieved against the nominal 0.11, and the minimum pairwise hue distance
 *      among the marks AS PAINTED (not as specified).
 *
 * PROMOTED to pass 3 with ONE repair (pass-2 critique gap 12): the bare `import sharp` could
 * not resolve from under `docs/`, and node 26's ESM resolver ignores NODE_PATH, so the banked
 * probe could not be re-run as its own README documented. `createRequire` against the
 * frontend's package.json is the cure — the instrument now runs from anywhere.
 *
 * node <this> <strip.png> ...
 */
import { createRequire } from "node:module";
const sharp = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
)("sharp");

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
function rgbToOklch(r, g, b) {
  const R = srgbToLinear(r / 255), G = srgbToLinear(g / 255), B = srgbToLinear(b / 255);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, Bb);
  let h = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}
const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

async function analyse(file) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();
  const at = (x, y) => { const i = (y * width + x) * 4; return [raw[i], raw[i + 1], raw[i + 2]]; };

  // ground = the modal colour of the four corners' 6px squares
  const counts = new Map();
  for (const [ox, oy] of [[0, 0], [width - 6, 0], [0, height - 6], [width - 6, height - 6]])
    for (let y = oy; y < oy + 6; y++) for (let x = ox; x < ox + 6; x++) {
      const k = at(x, y).join(","); counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  const ground = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const dist = (p) => Math.abs(p[0] - ground[0]) + Math.abs(p[1] - ground[1]) + Math.abs(p[2] - ground[2]);
  const INK = 24; // manhattan bytes: anything above this is ink, not antialiased paper

  // horizontal bands
  const rowHit = [];
  for (let y = 0; y < height; y++) {
    let c = 0;
    for (let x = 0; x < width; x++) if (dist(at(x, y)) > INK) c++;
    rowHit.push(c);
  }
  const bands = [];
  let start = -1;
  for (let y = 0; y <= height; y++) {
    const on = y < height && rowHit[y] > 0;
    if (on && start < 0) start = y;
    if (!on && start >= 0) { if (y - start >= 4) bands.push([start, y - 1]); start = -1; }
  }

  const rows = bands.map((b, bi) => {
    const [y0, y1] = b;
    const colHit = [];
    for (let x = 0; x < width; x++) {
      let c = 0;
      for (let y = y0; y <= y1; y++) if (dist(at(x, y)) > INK) c++;
      colHit.push(c);
    }
    const runs = [];
    let s = -1;
    for (let x = 0; x <= width; x++) {
      const on = x < width && colHit[x] > 0;
      if (on && s < 0) s = x;
      if (!on && s >= 0) { runs.push([s, x - 1]); s = -1; }
    }
    const gaps = [];
    for (let i = 1; i < runs.length; i++) gaps.push(runs[i][0] - runs[i - 1][1] - 1);
    const cores = runs.map(([x0, x1]) => {
      let best = null, bd = -1;
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
        const p = at(x, y), d = dist(p);
        if (d > bd) { bd = d; best = p; }
      }
      const o = rgbToOklch(best[0], best[1], best[2]);
      return { rgb: best, L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1), widthPx: x1 - x0 + 1 };
    });
    let minHue = 360;
    for (let i = 0; i < cores.length; i++) for (let j = i + 1; j < cores.length; j++)
      minHue = Math.min(minHue, hueDist(cores[i].h, cores[j].h));
    return {
      n: bi + 1,
      runs: runs.length,
      minGapPx: gaps.length ? Math.min(...gaps) : null,
      gapsPx: gaps,
      runWidthsPx: runs.map(([a, c]) => c - a + 1),
      minPaintedHueSep: cores.length > 1 ? +minHue.toFixed(1) : null,
      chroma: { min: +Math.min(...cores.map((c) => c.C)).toFixed(4), max: +Math.max(...cores.map((c) => c.C)).toFixed(4) },
      cores,
    };
  });
  return { file, width, height, ground, bands: bands.length, rows };
}

const out = {};
for (const f of process.argv.slice(2)) out[f.split("/").pop()] = await analyse(f);
console.log(JSON.stringify(out, null, 1));
