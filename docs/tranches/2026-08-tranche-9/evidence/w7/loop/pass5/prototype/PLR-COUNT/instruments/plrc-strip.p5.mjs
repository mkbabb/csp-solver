// PASS-5 COPY of pass4/prototype/PLR-COUNT/instruments/plrc-strip.mjs, unchanged but for this line: the crops come from p5-strip.spec.ts (argv), the reading goes to stdout.
/**
 * PLR-COUNT pass-4 — THE STRIP, READ OFF PAINTED BYTES. One instrument for four rows:
 *
 *   G1  runs      separated ink runs across the crop (ink = manhattan > 24 bytes from the
 *                 ground; pixels.mjs's rule) — the machine's own count of objects.
 *   G2  contrast  per run, the WCAG ratio of its CORE (the pixel farthest from the ground) on
 *                 the ground, plus the THRESHOLD-SENSITIVITY row the LAWS ask of any painted-
 *                 contrast gate: slice the run across its length (one scanline = one slice),
 *                 weigh each slice by its ink mass, and report the worst slice peak among the
 *                 slices holding >= 50/70/90/100 % of the median mass, and the fraction of
 *                 slices (mass >= 50 % median) whose peak is under 3:1.
 *   G16 ink       INK WEIGHT, DEFINED ONCE: Σ over pixels with d > 8 of min(1, d / D), in CSS
 *                 px² (÷ dpr²), where d is a pixel's manhattan distance from the crop's ground
 *                 and D is ONE normaliser for the whole run of crops (the largest core d found
 *                 in any of them). Pass 3 normalised each crop by its OWN core, which scores a
 *                 pale stroke and a dark one alike; one D makes the rows comparable.
 *   hue           per run, the painted core in OKLCH, and the minimum pairwise hue separation.
 *
 * ground = the modal colour of the four corners' 6 px squares (pixels.mjs's rule).
 * node plrc-strip.mjs --dpr 3 <label>=<png> ...
 */
import { createRequire } from "node:module";
const sharp = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
)("sharp");

const args = process.argv.slice(2);
const dprAt = args.indexOf("--dpr");
const dpr = dprAt >= 0 ? Number(args[dprAt + 1]) : 3;
const pairs = args.filter((a) => a.includes("="));

const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const wcag = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
function oklchHue([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { C: +Math.hypot(A, Bb).toFixed(4), h: +h.toFixed(1) };
}
const hueDist = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

async function load(file) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();
  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [raw[i], raw[i + 1], raw[i + 2]];
  };
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
  const ground = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const dist = (p) =>
    Math.abs(p[0] - ground[0]) + Math.abs(p[1] - ground[1]) + Math.abs(p[2] - ground[2]);
  let core = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) core = Math.max(core, dist(at(x, y)));
  return { file, width, height, at, ground, dist, core };
}

const crops = [];
for (const p of pairs) {
  const [label, file] = p.split("=");
  crops.push({ label, ...(await load(file)) });
}
const D = Math.max(...crops.map((c) => c.core));

const out = { dpr, normaliserD: D, rows: {} };
for (const c of crops) {
  const { width, height, at, dist, ground } = c;
  const INK = 24;
  const colOn = [];
  for (let x = 0; x < width; x++) {
    let on = false;
    for (let y = 0; y < height && !on; y++) if (dist(at(x, y)) > INK) on = true;
    colOn.push(on);
  }
  const runs = [];
  let s = -1;
  for (let x = 0; x <= width; x++) {
    const on = x < width && colOn[x];
    if (on && s < 0) s = x;
    if (!on && s >= 0) {
      runs.push([s, x - 1]);
      s = -1;
    }
  }
  const perRun = runs.map(([x0, x1]) => {
    let best = null;
    let bd = -1;
    const slices = [];
    for (let y = 0; y < height; y++) {
      let mass = 0;
      let peak = null;
      let pd = -1;
      for (let x = x0; x <= x1; x++) {
        const p = at(x, y);
        const d = dist(p);
        if (d > 8) mass += Math.min(1, d / D);
        if (d > pd) {
          pd = d;
          peak = p;
        }
        if (d > bd) {
          bd = d;
          best = p;
        }
      }
      if (mass > 0) slices.push({ mass, contrast: wcag(peak, ground) });
    }
    const masses = slices.map((q) => q.mass).sort((a, b) => a - b);
    const median = masses.length ? masses[Math.floor(masses.length / 2)] : 0;
    const sens = {};
    for (const pct of [50, 70, 90, 100]) {
      const held = slices.filter((q) => q.mass >= (pct / 100) * median);
      sens[pct] = held.length ? +Math.min(...held.map((q) => q.contrast)).toFixed(3) : null;
    }
    const body = slices.filter((q) => q.mass >= 0.5 * median);
    const under = body.filter((q) => q.contrast < 3).length;
    return {
      x: [x0, x1],
      core: best,
      coreContrast: +wcag(best, ground).toFixed(3),
      hue: oklchHue(best),
      sensitivity: sens,
      fracUnder3: body.length ? +(under / body.length).toFixed(3) : null,
    };
  });
  let ink = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const d = dist(at(x, y));
      if (d > 8) ink += Math.min(1, d / D);
    }
  let minHue = null;
  for (let i = 0; i < perRun.length; i++)
    for (let j = i + 1; j < perRun.length; j++) {
      const h = hueDist(perRun[i].hue.h, perRun[j].hue.h);
      minHue = minHue === null ? h : Math.min(minHue, h);
    }
  out.rows[c.label] = {
    ground,
    runs: runs.length,
    inkPx2: +(ink / (dpr * dpr)).toFixed(2),
    worstCoreContrast: perRun.length ? Math.min(...perRun.map((r) => r.coreContrast)) : null,
    minPaintedHueSep: minHue === null ? null : +minHue.toFixed(1),
    perRun,
  };
}
console.log(JSON.stringify(out, null, 1));
