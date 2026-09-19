/**
 * T9-W7 pass 3 · MRK-ABS RESEARCH · R1 — clearance against the RULE'S OWN PATH.
 *
 * Descended from pass-2's `clearance-p2.mjs` / the critic's `clearance-tiers.mjs`, with the two
 * assumptions those forms bake in taken OUT and made measurements:
 *
 *   1. `RULE_HALF = (5/2)*1.3` assumes every side of every cell faces a CELL line (stroke 5).
 *      `HandDrawnGrid.vue:339/353/366` declares THREE stroke weights — frame 12, subgrid 8,
 *      cell 5 — and `gridPaths.ts:338` puts the frame's vertical sides at x = 12 / 988, i.e.
 *      12 board units INSIDE the first/last column, not on the cell boundary.
 *   2. The rule is treated as a straight line at its nominal coordinate. It is not: every rule
 *      is `boilLineFrames(...)` with `maxDisplace = roughness * len * 0.015` over a 948-unit
 *      span (`pencil-boil/dist/path.js:63`) — 5.688 board units for a cell line at roughness
 *      0.4, which is larger than the whole clearance the gate reports.
 *
 * This form scores, per cell and per SIDE, the real polyline of the ring against the real
 * polyline of the rule that side faces, at the rule's own stroke, over the four poses the grid
 * ships. Lengths in BOARD units (viewBox 1000); px at boardPx/1000. The ring's own geometry is
 * authored in board units but PAINTED through the ghost viewBox, which is 1.3x the cell
 * (`useGameCell.ts:91`, pad = 0.15*cellSize per side), so a ring coordinate `u` lands on screen
 * at  c*cs + (u - c*cs + 0.15*cs)/1.3  and every ring length divides by 1.3.
 *
 * Run (from web/frontend, so @mkbabb/pencil-boil resolves):
 *   node docs/.../pass3/research/MRK-ABS/probe/r1-rulepath-clearance.mjs
 */
// NODE-ESM TRAP (registry-v2 §7): a bare specifier resolves from the SCRIPT's directory, not
// the cwd, so `node <this> ` run from web/frontend still cannot see `@mkbabb/pencil-boil`.
// Absolute file URL, named once.
const PB =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect, wobbleLinePoints, perturbPoints } = await import(PB);

const VB = 1000;
const GHOST_PAD = 0.15; // useGameCell.ts:91
const SEED = 42; // GameBoard.vue:158 (cell rects) and HandDrawnGrid's baseSeed
const SQUEEZE = 1.3; // 1 + 2*GHOST_PAD

// HandDrawnGrid.vue:339/353/366 — stroke widths in board units
const STROKE = { frame: 12, subgrid: 8, cell: 5 };
// gridPaths.ts:338-339, :448
const FRAME_X_PAD = 12,
  FRAME_Y_PAD = 0,
  LINE_PAD = 26;
// pencilConfig.ts:269-273
const BOIL = { frameCount: 4, frame: 1.2, subgrid: 0.6, cell: 0.3 };

// gameCell.css — the four declared ring strokes (ghost units)
const TIERS = [
  ["peer  .is-peer-cursor", 4],
  ["hover .cell-ghost-path", 5],
  ["focus :has(input:focus-visible)", 7],
  ["invalid .is-invalid", 9],
  ["invalid+focus", 10],
];

const BOARD_PX = { desk: { 4: 412, 9: 636, 16: 636 }, phone: { 4: 236, 9: 365, 16: 365 } };
const SUBGRID = { 4: 2, 9: 3, 16: 4 };

const parse = (d) => {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  return pts;
};

/** Every pose of one internal rule, as polylines. Mirrors gridPaths.ts:478-520. */
function rulePoses(x1, y1, x2, y2, roughness, segments, seed, boil) {
  const base = wobbleLinePoints(x1, y1, x2, y2, { roughness, segments, seed, jagged: true });
  const out = [base];
  for (let f = 1; f < BOIL.frameCount; f++)
    out.push(perturbPoints(base, x1, y1, x2, y2, boil, seed + f * 1013));
  return out;
}

/** The frame rect's poses (gridPaths.ts:359-372 + the boil loop), as polylines. */
function framePoses() {
  const x = FRAME_X_PAD,
    y = FRAME_Y_PAD,
    w = VB - 2 * FRAME_X_PAD,
    h = VB - 2 * FRAME_Y_PAD;
  const sides = {
    top: rulePoses(x, y, x + w, y, 0.5, 6, SEED, BOIL.frame),
    right: rulePoses(x + w, y, x + w, y + h, 0.5, 6, SEED + 1, BOIL.frame),
    bottom: rulePoses(x + w, y + h, x, y + h, 0.5, 6, SEED + 2, BOIL.frame),
    left: rulePoses(x, y + h, x, y, 0.5, 6, SEED + 3, BOIL.frame),
  };
  return sides;
}

/** Build every rule the board paints, keyed by axis+index. */
function buildRules(N) {
  const cs = VB / N;
  const sg = SUBGRID[N];
  const vert = {},
    horz = {};
  let seedOffset = 100;
  for (let i = 1; i < N; i++) {
    const isSub = i % sg === 0;
    vert[i] = {
      kind: isSub ? "subgrid" : "cell",
      poses: rulePoses(
        i * cs,
        LINE_PAD,
        i * cs,
        VB - LINE_PAD,
        isSub ? 0.7 : 0.4,
        isSub ? 5 : 4,
        SEED + seedOffset++,
        isSub ? BOIL.subgrid : BOIL.cell,
      ),
    };
  }
  for (let i = 1; i < N; i++) {
    const isSub = i % sg === 0;
    horz[i] = {
      kind: isSub ? "subgrid" : "cell",
      poses: rulePoses(
        LINE_PAD,
        i * cs,
        VB - LINE_PAD,
        i * cs,
        isSub ? 0.7 : 0.4,
        isSub ? 5 : 4,
        SEED + seedOffset++,
        isSub ? BOIL.subgrid : BOIL.cell,
      ),
    };
  }
  return { vert, horz, frame: framePoses() };
}

/**
 * The extreme ink edge of a polyline over a span, on one axis.
 * `axis` 0 = x (a vertical rule), 1 = y. `dir` +1 = the rule's largest coordinate
 * (its edge facing a cell on its RIGHT/BELOW), -1 = its smallest.
 */
function ruleEdge(poses, axis, dir, spanAxis, lo, hi, halfStroke) {
  let best = -Infinity;
  for (const pts of poses) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i],
        b = pts[i + 1];
      // clip the segment to [lo, hi] on the span axis
      const s0 = a[spanAxis],
        s1 = b[spanAxis];
      const tLo = s1 === s0 ? 0 : (lo - s0) / (s1 - s0);
      const tHi = s1 === s0 ? 1 : (hi - s0) / (s1 - s0);
      let t0 = Math.min(tLo, tHi),
        t1 = Math.max(tLo, tHi);
      t0 = Math.max(0, t0);
      t1 = Math.min(1, t1);
      if (!(t1 >= t0)) continue;
      for (const t of [t0, t1]) {
        const v = a[axis] + (b[axis] - a[axis]) * t;
        best = Math.max(best, dir * v);
      }
    }
  }
  return best === -Infinity ? null : dir * best + dir * halfStroke;
}

/** The ring's painted edge on one side, in BOARD coords. */
function ringEdge(pts, axis, dir, origin, cs, halfStrokeGhost) {
  let best = -Infinity;
  for (const p of pts) best = Math.max(best, dir * p[axis]);
  const u = dir * best; // extreme ring coordinate in ghost/board-authoring units
  const screen = origin + (u - origin + GHOST_PAD * cs) / SQUEEZE;
  return screen + dir * (halfStrokeGhost / SQUEEZE);
}

function run(N, f, wanderUnits, halfStrokeGhost, ringRoughnessHead) {
  const cs = VB / N;
  const size = f * cs;
  const pad = ((1 - f) / 2) * cs;
  const roughness = ringRoughnessHead ?? wanderUnits / (0.015 * size);
  const rules = buildRules(N);
  const rows = [];
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N),
      c = pos % N;
    const x = c * cs + pad,
      y = r * cs + pad;
    const pts = parse(
      wobbleRect(x, y, size, size, {
        roughness,
        segments: N >= 16 ? (ringRoughnessHead ? 2 : 4) : 4,
        seed: SEED + 500 + pos * 7,
        jagged: true,
      }),
    );
    const ox = c * cs,
      oy = r * cs;
    const sides = [];
    // LEFT
    {
      const ring = ringEdge(pts, 0, -1, ox, cs, halfStrokeGhost);
      let kind, edge;
      if (c === 0) {
        kind = "frame";
        edge = ruleEdge(rules.frame.left, 0, +1, 1, oy, oy + cs, STROKE.frame / 2);
      } else {
        kind = rules.vert[c].kind;
        edge = ruleEdge(rules.vert[c].poses, 0, +1, 1, oy, oy + cs, STROKE[kind] / 2);
      }
      sides.push({ side: "L", kind, gap: ring - edge });
    }
    // RIGHT
    {
      const ring = ringEdge(pts, 0, +1, ox, cs, halfStrokeGhost);
      let kind, edge;
      if (c === N - 1) {
        kind = "frame";
        edge = ruleEdge(rules.frame.right, 0, -1, 1, oy, oy + cs, STROKE.frame / 2);
      } else {
        kind = rules.vert[c + 1].kind;
        edge = ruleEdge(rules.vert[c + 1].poses, 0, -1, 1, oy, oy + cs, STROKE[kind] / 2);
      }
      sides.push({ side: "R", kind, gap: edge - ring });
    }
    // TOP
    {
      const ring = ringEdge(pts, 1, -1, oy, cs, halfStrokeGhost);
      let kind, edge;
      if (r === 0) {
        kind = "frame";
        edge = ruleEdge(rules.frame.top, 1, +1, 0, ox, ox + cs, STROKE.frame / 2);
      } else {
        kind = rules.horz[r].kind;
        edge = ruleEdge(rules.horz[r].poses, 1, +1, 0, ox, ox + cs, STROKE[kind] / 2);
      }
      sides.push({ side: "T", kind, gap: ring - edge });
    }
    // BOTTOM
    {
      const ring = ringEdge(pts, 1, +1, oy, cs, halfStrokeGhost);
      let kind, edge;
      if (r === N - 1) {
        kind = "frame";
        edge = ruleEdge(rules.frame.bottom, 1, -1, 0, ox, ox + cs, STROKE.frame / 2);
      } else {
        kind = rules.horz[r + 1].kind;
        edge = ruleEdge(rules.horz[r + 1].poses, 1, -1, 0, ox, ox + cs, STROKE[kind] / 2);
      }
      sides.push({ side: "B", kind, gap: edge - ring });
    }
    rows.push({ pos, r, c, sides });
  }
  return rows;
}

const pxOf = (u, bp) => (u * bp) / VB;
const fmt = (v, n = 3) => (v === null ? "  n/a" : v.toFixed(n));

function report(label, N, f, wander, headRough) {
  console.log(`\n### ${label} · ${N}x${N} · f=${f} ${headRough ? "(HEAD roughness 0.4)" : `wander ${wander}u`}`);
  console.log("  tier                              kind     worst_u   worst_px(desk) worst_px(phone)  neg/total");
  for (const [name, sw] of TIERS) {
    const rows = run(N, f, wander, sw / 2, headRough);
    const byKind = {};
    for (const row of rows)
      for (const s of row.sides) {
        (byKind[s.kind] ??= []).push(s.gap);
      }
    for (const kind of ["cell", "subgrid", "frame"]) {
      const a = byKind[kind];
      if (!a) continue;
      const worst = Math.min(...a);
      const neg = a.filter((v) => v < 0).length;
      console.log(
        `  ${name.padEnd(33)} ${kind.padEnd(8)} ${fmt(worst).padStart(8)}  ` +
          `${fmt(pxOf(worst, BOARD_PX.desk[N])).padStart(12)}  ` +
          `${fmt(pxOf(worst, BOARD_PX.phone[N])).padStart(13)}   ${neg}/${a.length}`,
      );
    }
  }
}

console.log("T9-W7 pass 3 · MRK-ABS R1 — ring vs the RULE'S OWN PATH, per side, per rule kind");
console.log("gap > 0 = clean paper between the two inks; gap < 0 = the two inks overlap, in BOARD units.");
for (const N of [4, 9, 16]) {
  report("PROTOTYPE (pass 2 shipped)", N, 0.86, 5.4, null);
  report("HEAD 74a2b5d9", N, 1.0, null, 0.4);
}
