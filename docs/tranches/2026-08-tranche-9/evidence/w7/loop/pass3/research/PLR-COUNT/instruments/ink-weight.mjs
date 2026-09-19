/**
 * PLR-COUNT pass-3 RESEARCH — THE 5↔6 LOOK, AS INK.
 *
 * The pass-2 critic's gap 11: "the 5↔6 swap is declared as geometry and never judged as a
 * look". Geometry says the width goes 72.92 → 44 and the head line does not step. Neither
 * number is what a reader sees, which is HOW MUCH INK the mark is made of. This counts it.
 *
 * Reads the banked pass-2 head strip (READ-ONLY; nothing under pass2/ is written), finds the
 * horizontal bands, and for each band measures — to the RIGHT of the @mbabb wordmark only —
 * the painted ink: coverage-weighted area (1 − normalised distance to the ground, so an
 * antialiased edge counts for what it paints), the bounding box, and the run count.
 *
 * Coverage weight rather than a hard threshold, because the whole question is magnitude: a
 * hairline digit and a 2.6px stroke both clear any binary INK cut-off and read nothing alike.
 *
 *   node <this> <strip.png> [xCut]     (xCut default 150 device px — right of @mbabb)
 */
/*
 * THE RESOLVER, BANKED (pass-2 gap 12, and the charter's "bank NODE_PATH" corrected at the
 * measurement): `NODE_PATH` is a CommonJS mechanism and node's ESM resolver IGNORES it —
 * `NODE_PATH=<frontend>/node_modules node <this>.mjs` still dies `ERR_MODULE_NOT_FOUND`
 * (reproduced on node v26.0.0 today). Nothing above `docs/` resolves `node_modules`, so an
 * instrument banked in the evidence tree reaches the estate's packages through a `require`
 * created AT the frontend's own package.json, which walks from there. One line, no env var,
 * no copy of the file into `src/`.
 */
import { createRequire } from "node:module";
const FRONTEND =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json";
const sharp = createRequire(FRONTEND)("sharp");

const file = process.argv[2];
const X_CUT = Number(process.argv[3] ?? 150);

const img = sharp(file);
const { width, height } = await img.metadata();
const raw = await img.ensureAlpha().raw().toBuffer();
const at = (x, y) => {
  const i = (y * width + x) * 4;
  return [raw[i], raw[i + 1], raw[i + 2]];
};

// Ground = the modal colour of the four corners' 6px squares (pixels.mjs's own rule).
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
const INK = 24; // pixels.mjs's cut: above this is ink, not antialiased paper
/** Coverage: 0 at the ground, 1 at full separation. 255 is the practical full-ink distance. */
const cover = (p) => Math.min(1, dist(p) / 255);

// Bands over the WHOLE strip (the wordmark anchors every row, so bands are stable).
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
  if (!on && start >= 0) {
    if (y - start >= 4) bands.push([start, y - 1]);
    start = -1;
  }
}

const out = { file, width, height, ground, xCut: X_CUT, bands: [] };
for (const [y0, y1] of bands) {
  let area = 0,
    hard = 0,
    minX = Infinity,
    maxX = -1,
    minY = Infinity,
    maxY = -1;
  const colHit = new Array(width).fill(0);
  for (let y = y0; y <= y1; y++)
    for (let x = X_CUT; x < width; x++) {
      const p = at(x, y);
      if (dist(p) <= INK) continue;
      area += cover(p);
      hard++;
      colHit[x]++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  // separated vertical runs (the object count a reader takes)
  let runs = 0,
    on = false;
  for (let x = X_CUT; x < width; x++) {
    if (colHit[x] > 0 && !on) {
      runs++;
      on = true;
    } else if (colHit[x] === 0) on = false;
  }
  out.bands.push({
    band: [y0, y1],
    inkAreaPx2: Math.round(area * 100) / 100,
    hardPx: hard,
    runs,
    box:
      maxX < 0
        ? null
        : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
  });
}
console.log(JSON.stringify(out, null, 1));
