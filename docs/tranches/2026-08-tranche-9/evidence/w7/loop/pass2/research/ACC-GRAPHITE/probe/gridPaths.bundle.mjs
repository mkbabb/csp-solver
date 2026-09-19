// ../../../../../web/frontend/node_modules/@mkbabb/pencil-boil/dist/random.js
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = seed + 1831565813 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ../../../../../web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js
function toFinite(value, fallback) {
  if (typeof value !== "number" || Number.isNaN(value))
    return fallback;
  return Number.isFinite(value) ? value : fallback;
}
function toPositiveInt(value, fallback, minimum = 1) {
  const normalized = Math.floor(toFinite(value, fallback));
  return Math.max(minimum, normalized);
}
function catmullRomToBezier(points) {
  if (points.length < 2)
    return "";
  if (points.length === 2) {
    return `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`;
  }
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}
function pointsToLinear(points) {
  if (points.length < 2)
    return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i][0]},${points[i][1]}`;
  }
  return d;
}
function wobbleLinePoints(x1, y1, x2, y2, options = {}) {
  const roughness = toFinite(options.roughness, 1);
  const segments = toPositiveInt(options.segments, 8, 2);
  const seed = Math.floor(toFinite(options.seed, 42));
  const rng = mulberry32(seed);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len === 0)
    return [[x1, y1], [x2, y2]];
  const perpX = -dy / len;
  const perpY = dx / len;
  const maxDisplace = roughness * len * 0.015;
  const overshoot = roughness * len * 3e-3;
  const sx = x1 - dx / len * overshoot * (0.5 + rng() * 0.5);
  const sy = y1 - dy / len * overshoot * (0.5 + rng() * 0.5);
  const ex = x2 + dx / len * overshoot * (0.5 + rng() * 0.5);
  const ey = y2 + dy / len * overshoot * (0.5 + rng() * 0.5);
  const points = [[sx, sy]];
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const mx = x1 + dx * t;
    const my = y1 + dy * t;
    const offset = (rng() - 0.5) * 2 * maxDisplace;
    points.push([mx + perpX * offset, my + perpY * offset]);
  }
  points.push([ex, ey]);
  return points;
}
function perturbPoints(points, x1, y1, x2, y2, amount, seed) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len === 0)
    return points.map((p) => [p[0], p[1]]);
  if (points.length <= 2 || amount === 0)
    return points.map((p) => [p[0], p[1]]);
  const perpX = -dy / len;
  const perpY = dx / len;
  const rng = mulberry32(seed);
  const den = points.length - 1;
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1)
      return [point[0], point[1]];
    const t = index / den;
    const taper = Math.pow(Math.sin(Math.PI * t), 0.9);
    const offset = (rng() - 0.5) * 2 * amount * taper;
    return [point[0] + perpX * offset, point[1] + perpY * offset];
  });
}
function wobbleLine(x1, y1, x2, y2, options = {}) {
  const { jagged = false } = options;
  const points = wobbleLinePoints(x1, y1, x2, y2, options);
  return jagged ? pointsToLinear(points) : catmullRomToBezier(points);
}
function wobbleRect(x, y, w, h, options = {}) {
  const s = options.seed ?? 42;
  const top = wobbleLine(x, y, x + w, y, { ...options, seed: s });
  const right = wobbleLine(x + w, y, x + w, y + h, { ...options, seed: s + 1 });
  const bottom = wobbleLine(x + w, y + h, x, y + h, { ...options, seed: s + 2 });
  const left = wobbleLine(x, y + h, x, y, { ...options, seed: s + 3 });
  return top + " " + right.replace(/^M[^ ]+/, "") + " " + bottom.replace(/^M[^ ]+/, "") + " " + left.replace(/^M[^ ]+/, "") + " Z";
}
function boilLineFrames(x1, y1, x2, y2, frameCount, boilAmount, options = {}) {
  const frames = toPositiveInt(frameCount, 4, 1);
  const amount = toFinite(boilAmount, 0);
  const jagged = options.jagged ?? false;
  const seed = Math.floor(toFinite(options.seed, 42));
  const base = wobbleLinePoints(x1, y1, x2, y2, options);
  const serialize = (pts) => jagged ? pointsToLinear(pts) : catmullRomToBezier(pts);
  const out = [];
  for (let f = 0; f < frames; f++) {
    const pts = f === 0 ? base : perturbPoints(base, x1, y1, x2, y2, amount, seed + f * 1013);
    out.push(serialize(pts));
  }
  return out;
}

// ../../../../../web/frontend/node_modules/@mkbabb/pencil-boil/dist/frames.js
var BOIL_CACHE = /* @__PURE__ */ new Map();
var BOIL_DISPOSERS = /* @__PURE__ */ new Map();
var DEFAULT_MAX_ENTRIES = 24;
function normKey(parts) {
  return parts.map((p) => typeof p === "number" && !Number.isInteger(p) ? p.toFixed(4) : String(p)).join("|");
}
function evictOldest() {
  const oldest = BOIL_CACHE.keys().next().value;
  if (oldest === void 0)
    return;
  const evicted = BOIL_CACHE.get(oldest);
  BOIL_CACHE.delete(oldest);
  const dispose = BOIL_DISPOSERS.get(oldest);
  if (dispose) {
    BOIL_DISPOSERS.delete(oldest);
    dispose(evicted);
  }
}
function useBoilCache(cacheKeyParts, compute, maxEntries = DEFAULT_MAX_ENTRIES, onEvict) {
  const key = normKey(cacheKeyParts);
  if (BOIL_CACHE.has(key)) {
    const cached = BOIL_CACHE.get(key);
    BOIL_CACHE.delete(key);
    BOIL_CACHE.set(key, cached);
    return cached;
  }
  const value = compute();
  BOIL_CACHE.set(key, value);
  if (onEvict)
    BOIL_DISPOSERS.set(key, onEvict);
  if (BOIL_CACHE.size > maxEntries)
    evictOldest();
  return value;
}

// src/pencil/grid/gridPaths.ts
function generateCellRects(boardSize, subgridSize, viewBoxSize, seed = 42) {
  return useBoilCache(
    ["cellRects", boardSize, subgridSize, viewBoxSize, seed],
    () => {
      const cellSize = viewBoxSize / boardSize;
      const cellSegments = boardSize >= 16 ? 2 : 4;
      const cellRects = {};
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          const pos = r * boardSize + c;
          const x = c * cellSize;
          const y = r * cellSize;
          cellRects[pos] = wobbleRect(x, y, cellSize, cellSize, {
            roughness: 0.4,
            segments: cellSegments,
            seed: seed + 500 + pos * 7,
            jagged: true
          });
        }
      }
      return cellRects;
    }
  );
}
var RETRACE_INSET = 10;
function generateCellRetraceRects(boardSize, viewBoxSize, seed = 42) {
  return useBoilCache(
    ["cellRetraceRects", boardSize, viewBoxSize, seed],
    () => {
      const cellSize = viewBoxSize / boardSize;
      const cellSegments = boardSize >= 16 ? 2 : 4;
      const inset = Math.min(RETRACE_INSET, cellSize / 4);
      const rects = {};
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          const pos = r * boardSize + c;
          rects[pos] = reverseLinearPath(
            wobbleRect(
              c * cellSize + inset,
              r * cellSize + inset,
              cellSize - inset * 2,
              cellSize - inset * 2,
              {
                roughness: 0.4,
                segments: cellSegments,
                seed: seed + 500 + pos * 7 + 3,
                jagged: true
              }
            )
          );
        }
      }
      return rects;
    }
  );
}
function reverseLinearPath(d) {
  const points = d.match(/-?\d[\d.e+-]*,-?\d[\d.e+-]*/g);
  if (!points || points.length < 2) return d;
  return `M${points.reverse().join(" L")} Z`;
}
function linearPoints(d) {
  const raw = d.match(/-?\d[\d.e+-]*,-?\d[\d.e+-]*/g) ?? [];
  return raw.map((p) => {
    const [x, y] = p.split(",");
    return [Number(x), Number(y)];
  });
}
function tickMarksAlong(d, k, slots, duty = 0.57) {
  const pts = linearPoints(d);
  if (k <= 0 || slots <= 0 || pts.length < 2) return "";
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = cum[cum.length - 1];
  if (total <= 0) return "";
  const pitch = total / slots;
  const ink = pitch * duty;
  const at = (s) => {
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (cum[mid] < s) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const seg = cum[i] - cum[i - 1] || 1;
    const t = Math.min(1, Math.max(0, (s - cum[i - 1]) / seg));
    return {
      p: [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t
      ],
      next: i
    };
  };
  const out = [];
  for (let m = 0; m < Math.min(k, slots); m++) {
    const a = m * pitch;
    const b = Math.min(total, a + ink);
    const start = at(a);
    const end = at(b);
    const mid = pts.slice(start.next, end.next);
    const chain = [start.p, ...mid, end.p].map((p) => `${+p[0].toFixed(2)},${+p[1].toFixed(2)}`).join(" L");
    out.push(`M${chain}`);
  }
  return out.join(" ");
}
function grainLattice(seed, octave, i) {
  return mulberry32(
    (seed | 0) ^ Math.imul(octave + 1, 2246822507) ^ Math.imul(i | 0, 668265263) | 0
  )();
}
function grainNoise(t, grain, seed) {
  const octaves = Math.max(1, Math.floor(grain.numOctaves));
  let sum = 0;
  let norm = 0;
  let amp = 1;
  let freq = grain.baseFrequency;
  for (let o = 0; o < octaves; o++) {
    const x = t * freq;
    const i = Math.floor(x);
    const f = x - i;
    const a = grainLattice(seed, o, i);
    const b = grainLattice(seed, o, i + 1);
    const s = f * f * (3 - 2 * f);
    sum += amp * (a + (b - a) * s);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm * 2 - 1;
}
function subdividePolyline(points, maxStep) {
  if (points.length < 2) return points.map((p) => [p[0], p[1]]);
  const out = [[points[0][0], points[0][1]]];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / maxStep));
    for (let k = 1; k <= n; k++) {
      out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]);
    }
  }
  return out;
}
var round2 = (v) => Math.round(v * 100) / 100;
function bakeGrainPoints(points, grain, seed) {
  const wavelength = 1 / grain.baseFrequency;
  const pts = subdividePolyline(points, wavelength / 3);
  const amp = grain.scale / 2;
  const out = [];
  let t = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) {
      t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    }
    const d = grainNoise(t, grain, seed) * amp;
    out.push([round2(pts[i][0] + d), round2(pts[i][1] + d)]);
  }
  return out;
}
function grainFrameSeed(grain, pathSeed, f) {
  return (grain.seed | 0) + Math.imul(pathSeed | 0, 101) + f * 7919;
}
function arcBoilPoints(cx, cy, r, a0, a1, roughness, seed) {
  const steps = Math.max(2, Math.round(Math.abs(a1 - a0) * r / 6));
  const rng = mulberry32(Math.floor(seed));
  const amp = Math.max(roughness * r * 0.06, 0.75);
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * i / steps;
    const j = (rng() - 0.5) * 2 * amp;
    points.push([cx + Math.cos(a) * (r + j), cy + Math.sin(a) * (r + j)]);
  }
  return points;
}
function generateRectBoilFrames(x, y, w, h, opts, boilAmount, frameCount, radius = 0, grain) {
  const safeFrameCount = Math.max(2, Math.floor(frameCount));
  const s = opts.seed ?? 42;
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  const sides = r === 0 ? [
    { x1: x, y1: y, x2: x + w, y2: y, seed: s },
    { x1: x + w, y1: y, x2: x + w, y2: y + h, seed: s + 1 },
    { x1: x + w, y1: y + h, x2: x, y2: y + h, seed: s + 2 },
    { x1: x, y1: y + h, x2: x, y2: y, seed: s + 3 }
  ] : [
    { x1: x + r, y1: y, x2: x + w - r, y2: y, seed: s },
    { x1: x + w, y1: y + r, x2: x + w, y2: y + h - r, seed: s + 1 },
    { x1: x + w - r, y1: y + h, x2: x + r, y2: y + h, seed: s + 2 },
    { x1: x, y1: y + h - r, x2: x, y2: y + r, seed: s + 3 }
  ];
  const HALF_PI = Math.PI / 2;
  const corners = [
    { cx: x + w - r, cy: y + r, a0: -HALF_PI, a1: 0 },
    { cx: x + w - r, cy: y + h - r, a0: 0, a1: HALF_PI },
    { cx: x + r, cy: y + h - r, a0: HALF_PI, a1: Math.PI },
    { cx: x + r, cy: y + r, a0: Math.PI, a1: Math.PI + HALF_PI }
  ];
  const roughness = opts.roughness ?? 1;
  const sideBasePoints = sides.map(
    (side) => wobbleLinePoints(side.x1, side.y1, side.x2, side.y2, {
      ...opts,
      seed: side.seed
    })
  );
  const frames = [];
  for (let f = 0; f < safeFrameCount; f++) {
    const sidePoints = f === 0 ? sideBasePoints : sideBasePoints.map(
      (pts, i) => perturbPoints(
        pts,
        sides[i].x1,
        sides[i].y1,
        sides[i].x2,
        sides[i].y2,
        boilAmount,
        sides[i].seed + f * 997
      )
    );
    if (r === 0) {
      if (grain) {
        const ring2 = [...sidePoints[0]];
        for (let si = 1; si < 4; si++) ring2.push(...sidePoints[si].slice(1));
        frames.push(
          pointsToLinear(bakeGrainPoints(ring2, grain, grainFrameSeed(grain, s, f))) + " Z"
        );
        continue;
      }
      let d = pointsToLinear(sidePoints[0]);
      for (let si = 1; si < 4; si++) {
        d += " " + pointsToLinear(sidePoints[si]).replace(/^M[^ ]+/, "");
      }
      d += " Z";
      frames.push(d);
      continue;
    }
    const ring = [];
    for (let si = 0; si < 4; si++) {
      ring.push(...sidePoints[si]);
      const c = corners[si];
      const arc = arcBoilPoints(
        c.cx,
        c.cy,
        r,
        c.a0,
        c.a1,
        roughness,
        s + 10 + si + f * 997
      );
      const prevEnd = sidePoints[si][sidePoints[si].length - 1];
      const nextStart = sidePoints[(si + 1) % 4][0];
      if (arc.length >= 2 && prevEnd && nextStart) {
        arc[0] = prevEnd;
        arc[arc.length - 1] = nextStart;
      }
      ring.push(...arc);
    }
    frames.push(
      pointsToLinear(
        grain ? bakeGrainPoints(ring, grain, grainFrameSeed(grain, s, f)) : ring
      ) + " Z"
    );
  }
  return frames;
}
var FRAME_X_PAD = 12;
var FRAME_Y_PAD = 0;
function generateFrameTraceFrames(viewBoxSize, baseSeed, frameCount, frameBoil, grain) {
  return generateRectBoilFrames(
    FRAME_X_PAD,
    FRAME_Y_PAD,
    viewBoxSize - FRAME_X_PAD * 2,
    viewBoxSize - FRAME_Y_PAD * 2,
    { roughness: 0.5, segments: 6, seed: baseSeed, jagged: true },
    frameBoil,
    frameCount,
    0,
    grain
  );
}
function generateLineBoilFrames(x1, y1, x2, y2, opts, boilAmount, frameCount, grain) {
  const safeFrameCount = Math.max(2, Math.floor(frameCount));
  if (!grain) {
    return boilLineFrames(x1, y1, x2, y2, safeFrameCount, boilAmount, opts);
  }
  const pathSeed = opts.seed ?? 42;
  const basePoints = wobbleLinePoints(x1, y1, x2, y2, opts);
  const frames = [];
  for (let f = 0; f < safeFrameCount; f++) {
    let pts = f === 0 ? basePoints : perturbPoints(basePoints, x1, y1, x2, y2, boilAmount, pathSeed + f * 1013);
    pts = bakeGrainPoints(pts, grain, grainFrameSeed(grain, pathSeed, f));
    frames.push(pointsToLinear(pts));
  }
  return frames;
}
function generateGridBoilFrames(boardSize, subgridSize, viewBoxSize, baseSeed = 42, frameCount = 4, frameBoil = 2, subgridBoil = 1.5, cellBoil = 1) {
  const safeFrameCount = Math.max(2, Math.floor(frameCount));
  return useBoilCache(
    [
      boardSize,
      subgridSize,
      viewBoxSize,
      baseSeed,
      safeFrameCount,
      frameBoil,
      subgridBoil,
      cellBoil
    ],
    () => {
      const cellSize = viewBoxSize / boardSize;
      const pad = 26;
      const frameXPad = FRAME_X_PAD;
      const frameYPad = FRAME_Y_PAD;
      const frame = generateRectBoilFrames(
        frameXPad,
        frameYPad,
        viewBoxSize - frameXPad * 2,
        viewBoxSize - frameYPad * 2,
        {
          roughness: 0.5,
          segments: 6,
          seed: baseSeed,
          jagged: true
        },
        frameBoil,
        safeFrameCount
      );
      const subgridLines = [];
      const cellLines = [];
      let seedOffset = 100;
      for (let i = 1; i < boardSize; i++) {
        const x = i * cellSize;
        const isSubgrid = i % subgridSize === 0;
        const opts = {
          roughness: isSubgrid ? 0.7 : 0.4,
          segments: isSubgrid ? 5 : 4,
          seed: baseSeed + seedOffset++,
          jagged: true
        };
        const frames = boilLineFrames(
          x,
          pad,
          x,
          viewBoxSize - pad,
          safeFrameCount,
          isSubgrid ? subgridBoil : cellBoil,
          opts
        );
        if (isSubgrid) subgridLines.push(frames);
        else cellLines.push(frames);
      }
      for (let i = 1; i < boardSize; i++) {
        const y = i * cellSize;
        const isSubgrid = i % subgridSize === 0;
        const opts = {
          roughness: isSubgrid ? 0.7 : 0.4,
          segments: isSubgrid ? 5 : 4,
          seed: baseSeed + seedOffset++,
          jagged: true
        };
        const frames = boilLineFrames(
          pad,
          y,
          viewBoxSize - pad,
          y,
          safeFrameCount,
          isSubgrid ? subgridBoil : cellBoil,
          opts
        );
        if (isSubgrid) subgridLines.push(frames);
        else cellLines.push(frames);
      }
      return { frame, subgridLines, cellLines };
    }
  );
}
export {
  generateCellRects,
  generateCellRetraceRects,
  generateFrameTraceFrames,
  generateGridBoilFrames,
  generateLineBoilFrames,
  generateRectBoilFrames,
  tickMarksAlong
};
