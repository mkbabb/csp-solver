/**
 * T9-W7 · CTRL-RULE pass 2 — THE SEED SWEEP (the σ row's cure, computed not chosen).
 *
 * Pass 1 shipped eight seeds and two of them read σ 0.549 / 0.555 — under R3's grid band
 * [0.722, 2.886]. The cure the spec names is to PICK the seeds: sweep 1..64 through the very
 * generator the component calls and pin seven whose σ lies inside the band with ≥0.1 of
 * headroom on each side.
 *
 * σ = RMS perpendicular residual off the chord (start→end of the generated path), 33 samples,
 * which is `r0/r3-marks/probe/wobble.probe.ts`'s own method. The rule's svg is
 * `preserveAspectRatio="none"` with its CSS height equal to the viewBox's height, so Y is
 * unscaled at every width: the σ generated here is the σ the browser paints, whatever the rule
 * resolves to. Swept at BOTH chords — the component's own nominal 300 and the spec's 284.67 —
 * and a seed is only pinned if it clears at both.
 *
 * Run: node seed-sweep.mjs
 */
import { createRequire } from "node:module";

const require = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { wobbleLine } = require("@mkbabb/pencil-boil");

const BAND = [0.722, 2.886];
const HEADROOM = 0.1;
const CHORDS = [300, 284.67];
const SAMPLES = 33;

/** Parse an `M … C …` chain into cubic segments. */
function parse(d) {
  const nums = (s) => s.trim().split(/[\s,]+/).map(Number);
  const mv = /M([^C]*)/.exec(d);
  let [cx, cy] = nums(mv[1]);
  const segs = [];
  for (const m of d.matchAll(/C([^CM]*)/g)) {
    const v = nums(m[1]);
    for (let i = 0; i + 5 < v.length; i += 6) {
      segs.push([cx, cy, v[i], v[i + 1], v[i + 2], v[i + 3], v[i + 4], v[i + 5]]);
      cx = v[i + 4];
      cy = v[i + 5];
    }
  }
  return { segs, start: nums(mv[1]), end: [cx, cy] };
}

const bez = (p, t) => {
  const u = 1 - t;
  const b = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [
    b[0] * p[0] + b[1] * p[2] + b[2] * p[4] + b[3] * p[6],
    b[0] * p[1] + b[1] * p[3] + b[2] * p[5] + b[3] * p[7],
  ];
};

function sigma(d) {
  const { segs, start, end } = parse(d);
  const pts = [];
  for (let i = 0; i < SAMPLES; i++) {
    const g = (i / (SAMPLES - 1)) * segs.length;
    const s = Math.min(segs.length - 1, Math.floor(g));
    pts.push(bez(segs[s], g - s));
  }
  const [ax, ay] = start;
  const [bx, by] = end;
  const L = Math.hypot(bx - ax, by - ay);
  const res = pts.map(
    ([x, y]) => Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / L,
  );
  const rms = Math.sqrt(res.reduce((a, r) => a + r * r, 0) / res.length);
  return { sigma: rms, max: Math.max(...res) };
}

const rows = [];
for (let seed = 1; seed <= 64; seed++) {
  const r = { seed };
  let ok = true;
  for (const chord of CHORDS) {
    const d = wobbleLine(0, 2.5, chord, 2.5, { roughness: 0.4, segments: 8, seed });
    const { sigma: s, max } = sigma(d);
    r[`sigma@${chord}`] = +s.toFixed(4);
    r[`max@${chord}`] = +max.toFixed(4);
    if (s < BAND[0] + HEADROOM || s > BAND[1] - HEADROOM) ok = false;
  }
  r.ok = ok;
  rows.push(r);
}

const pass = rows.filter((r) => r.ok);
const chosen = pass.slice(0, 8).map((r) => r.seed);

console.log(
  JSON.stringify(
    {
      method: "RMS perpendicular residual off chord, 33 samples (r0/R3's own)",
      band: BAND,
      headroom: HEADROOM,
      chords: CHORDS,
      swept: rows.length,
      passing: pass.length,
      chosen,
      chosenRows: pass.slice(0, 8),
      rows,
    },
    null,
    2,
  ),
);
