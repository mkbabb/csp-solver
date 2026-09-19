/**
 * T9-W7 pass 3 · MRK-ABS RESEARCH · R2 — the HONEST clearance: matched ordinate.
 *
 * R1 compares the ring's global extreme against the rule's global extreme over the cell's span,
 * which over-counts (the ring's leftmost point need not sit at the y where the rule is
 * rightmost). This form walks the shared ordinate: at every sampled y (left/right sides) or x
 * (top/bottom), it takes the ring's outermost ink at THAT ordinate and the rule's innermost ink
 * at THAT ordinate, and reports min over the ordinate. That is the number the law
 * "the ring never shares ink with the rule" is actually about.
 *
 * Also reports the same walk with the rule taken as a STRAIGHT line at its nominal coordinate,
 * which is pass 2's model — so the two columns show exactly what the rule's own wobble costs.
 *
 * Board units (viewBox 1000). Run from web/frontend.
 */
const PB =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect, wobbleLinePoints, perturbPoints } = await import(PB);

const VB = 1000,
  GHOST_PAD = 0.15,
  SQUEEZE = 1.3,
  SEED = 42;
const STROKE = { frame: 12, subgrid: 8, cell: 5 };
const FRAME_X_PAD = 12,
  FRAME_Y_PAD = 0,
  LINE_PAD = 26;
const BOIL = { frameCount: 4, frame: 1.2, subgrid: 0.6, cell: 0.3 };
const SUBGRID = { 4: 2, 9: 3, 16: 4 };
const BOARD_PX = { desk: { 4: 412, 9: 636, 16: 636 }, phone: { 4: 236, 9: 365, 16: 365 } };
const TIERS = [
  ["peer", 4],
  ["hover", 5],
  ["focus", 7],
  ["invalid", 9],
  ["invalid+focus", 10],
];
const STEP = 0.25; // board units along the shared ordinate

const parse = (d) => {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  return pts;
};

/** extreme coordinate (dir=+1 max, -1 min) on `axis` among segments of `pts` crossing ordinate s on `sAxis`; null if none */
function atOrdinate(pts, closed, axis, sAxis, s, dir) {
  let best = null;
  const n = pts.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i],
      b = pts[(i + 1) % n];
    const s0 = a[sAxis],
      s1 = b[sAxis];
    if (s0 === s1) continue;
    const t = (s - s0) / (s1 - s0);
    if (t < 0 || t > 1) continue;
    const v = a[axis] + (b[axis] - a[axis]) * t;
    if (best === null || dir * v > dir * best) best = v;
  }
  return best;
}

function rulePoses(x1, y1, x2, y2, roughness, segments, seed, boil) {
  const base = wobbleLinePoints(x1, y1, x2, y2, { roughness, segments, seed, jagged: true });
  const out = [base];
  for (let f = 1; f < BOIL.frameCount; f++)
    out.push(perturbPoints(base, x1, y1, x2, y2, boil, seed + f * 1013));
  return out;
}

function buildRules(N) {
  const cs = VB / N,
    sg = SUBGRID[N];
  const vert = {},
    horz = {};
  let so = 100;
  for (let i = 1; i < N; i++) {
    const isSub = i % sg === 0;
    vert[i] = {
      kind: isSub ? "subgrid" : "cell",
      nominal: i * cs,
      poses: rulePoses(i * cs, LINE_PAD, i * cs, VB - LINE_PAD, isSub ? 0.7 : 0.4, isSub ? 5 : 4, SEED + so++, isSub ? BOIL.subgrid : BOIL.cell),
    };
  }
  for (let i = 1; i < N; i++) {
    const isSub = i % sg === 0;
    horz[i] = {
      kind: isSub ? "subgrid" : "cell",
      nominal: i * cs,
      poses: rulePoses(LINE_PAD, i * cs, VB - LINE_PAD, i * cs, isSub ? 0.7 : 0.4, isSub ? 5 : 4, SEED + so++, isSub ? BOIL.subgrid : BOIL.cell),
    };
  }
  const x = FRAME_X_PAD,
    y = FRAME_Y_PAD,
    w = VB - 2 * FRAME_X_PAD,
    h = VB - 2 * FRAME_Y_PAD;
  const frame = {
    top: { kind: "frame", nominal: y, poses: rulePoses(x, y, x + w, y, 0.5, 6, SEED, BOIL.frame) },
    right: { kind: "frame", nominal: x + w, poses: rulePoses(x + w, y, x + w, y + h, 0.5, 6, SEED + 1, BOIL.frame) },
    bottom: { kind: "frame", nominal: y + h, poses: rulePoses(x + w, y + h, x, y + h, 0.5, 6, SEED + 2, BOIL.frame) },
    left: { kind: "frame", nominal: x, poses: rulePoses(x, y + h, x, y, 0.5, 6, SEED + 3, BOIL.frame) },
  };
  return { vert, horz, frame };
}

function sideGaps(ringPts, rule, axis, sAxis, lo, hi, hsRing, hsRule, ringDir) {
  // ringDir: -1 = the ring's LOW-coordinate edge faces a rule below it (left/top)
  const gapsWobbled = [];
  const gapsStraight = [];
  for (let s = lo; s <= hi + 1e-9; s += STEP) {
    const ring = atOrdinate(ringPts, true, axis, sAxis, s, ringDir);
    if (ring === null) continue;
    const ringInk = ring + ringDir * hsRing;
    let ruleInk = null;
    for (const pts of rule.poses) {
      const v = atOrdinate(pts, false, axis, sAxis, s, -ringDir);
      if (v === null) continue;
      const ink = v - ringDir * hsRule;
      if (ruleInk === null || -ringDir * ink > -ringDir * ruleInk) ruleInk = ink;
    }
    const straightInk = rule.nominal - ringDir * hsRule;
    // gap > 0 = clean paper. LEFT/TOP (ringDir -1): the rule is below the ring, gap = ringInk -
    // ruleInk. RIGHT/BOTTOM (+1): gap = ruleInk - ringInk. One expression: ringDir*(ruleInk-ringInk).
    if (ruleInk !== null) gapsWobbled.push(ringDir * (ruleInk - ringInk));
    gapsStraight.push(ringDir * (straightInk - ringInk));
  }
  return { gapsWobbled, gapsStraight };
}

function run(N, f, wander, hsGhost, headRough) {
  const cs = VB / N,
    size = f * cs,
    pad = ((1 - f) / 2) * cs;
  const roughness = headRough ?? wander / (0.015 * size);
  const rules = buildRules(N);
  const agg = {};
  const add = (kind, w, st) => {
    const a = (agg[kind] ??= { wMin: Infinity, stMin: Infinity, n: 0, neg: 0 });
    for (const v of w) {
      if (v < a.wMin) a.wMin = v;
      a.n++;
      if (v < 0) a.neg++;
    }
    for (const v of st) if (v < a.stMin) a.stMin = v;
  };
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N),
      c = pos % N;
    const x = c * cs + pad,
      y = r * cs + pad;
    const raw = parse(
      wobbleRect(x, y, size, size, {
        roughness,
        segments: N >= 16 && headRough ? 2 : 4,
        seed: SEED + 500 + pos * 7,
        jagged: true,
      }),
    );
    // project ring coords into painted board coords through the ghost viewBox
    const ox = c * cs,
      oy = r * cs;
    const proj = raw.map(([px, py]) => [
      ox + (px - ox + GHOST_PAD * cs) / SQUEEZE,
      oy + (py - oy + GHOST_PAD * cs) / SQUEEZE,
    ]);
    const hsR = hsGhost / SQUEEZE;
    const jobs = [
      ["L", 0, 1, oy, oy + cs, -1, c === 0 ? rules.frame.left : rules.vert[c]],
      ["R", 0, 1, oy, oy + cs, +1, c === N - 1 ? rules.frame.right : rules.vert[c + 1]],
      ["T", 1, 0, ox, ox + cs, -1, r === 0 ? rules.frame.top : rules.horz[r]],
      ["B", 1, 0, ox, ox + cs, +1, r === N - 1 ? rules.frame.bottom : rules.horz[r + 1]],
    ];
    for (const [, axis, sAxis, lo, hi, dir, rule] of jobs) {
      const { gapsWobbled, gapsStraight } = sideGaps(proj, rule, axis, sAxis, lo, hi, hsR, STROKE[rule.kind] / 2, dir);
      add(rule.kind, gapsWobbled, gapsStraight);
    }
  }
  return agg;
}

const pxOf = (u, bp) => (u * bp) / VB;
const p = (v, n = 3, w = 9) => v.toFixed(n).padStart(w);

console.log("T9-W7 pass 3 · MRK-ABS R2 — matched-ordinate clearance, ring ink vs rule ink");
console.log("worst = min over every sampled ordinate of every side of every cell, over all 4 poses.");
console.log("'straight' = pass-2's model (rule at its nominal coordinate); 'wobbled' = the rule's real path.\n");
for (const N of [4, 9, 16]) {
  for (const [label, f, wander, headRough] of [
    ["PROTO f=0.86 w=5.4", 0.86, 5.4, null],
    ["HEAD  f=1.00 r=0.4", 1.0, null, 0.4],
  ]) {
    console.log(`### ${N}x${N} · ${label}`);
    console.log("  tier            kind     worst_u(wobbled) worst_px_desk  neg%   | worst_u(straight) px_desk");
    for (const [name, sw] of TIERS) {
      const agg = run(N, f, wander, sw / 2, headRough);
      for (const kind of ["cell", "subgrid", "frame"]) {
        const a = agg[kind];
        if (!a || !a.n) continue;
        const wW = a.wMin,
          wS = a.stMin;
        const neg = (100 * a.neg) / a.n;
        console.log(
          `  ${name.padEnd(15)} ${kind.padEnd(8)} ${p(wW)}  ${p(pxOf(wW, BOARD_PX.desk[N]))}  ${neg.toFixed(1).padStart(5)}%  | ${p(wS)}  ${p(pxOf(wS, BOARD_PX.desk[N]))}`,
        );
      }
    }
    console.log("");
  }
}
