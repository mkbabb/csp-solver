#!/usr/bin/env node
/**
 * PAL-WALK pass-2 RESEARCH — what the walk is COUPLED to.
 *
 * 1. PLR-COUNT's demand (≥30° for the first six) answered in degrees and in ΔE, on the painted
 *    bytes pass 1 banked.
 * 2. The reserved SET is not a constant: ACC-FIVE and ACC-SIX both RENAME the tokens
 *    `check-peer-arcs.mjs`'s regex reads. This prices what each rename does to the arcs, the
 *    span, the step and the room — under the gate EXACTLY AS WRITTEN.
 *
 * Reads only: HEAD's index.css, the two sibling diffs (pass-1 record, read-only), and
 * PAL-WALK's own banked painted bytes.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const REPO = join(HERE, "../../../../../../../../../..");
const CSS = join(REPO, "web/frontend/src/assets/index.css");
const P1 = join(REPO, "docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype");

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const oklab = (r8, g8, b8) => {
  const [r, g, b] = [r8, g8, b8].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const labOfHex = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return oklab((n >> 16) & 255, (n >> 8) & 255, n & 255);
};
const hueOf = (lab) => {
  const h = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
const dE = (A, B) => Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

// The gate's own regex, verbatim (scripts/check-peer-arcs.mjs:47-48, worktree -0fc-49).
const GATE_RE =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
// Every ink-shaped token, whatever it is called.
const ANY_RE = /(--color-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g;

const arcsAt = (guard, hues) => {
  const raw = [];
  for (const h of hues) {
    const a = h - guard,
      b = h + guard;
    if (a < 0) raw.push([a + 360, 360], [0, b]);
    else if (b > 360) raw.push([a, 360], [0, b - 360]);
    else raw.push([a, b]);
  }
  raw.sort((p, q) => p[0] - q[0]);
  const merged = [];
  for (const iv of raw) {
    const last = merged[merged.length - 1];
    if (last && iv[0] <= last[1] + 1e-9) last[1] = Math.max(last[1], iv[1]);
    else merged.push([...iv]);
  }
  return merged;
};
const openOf = (arcs) => {
  const open = [];
  let cut = 0;
  for (const [a, b] of arcs) {
    if (a > cut) open.push([cut, a]);
    cut = Math.max(cut, b);
  }
  if (cut < 360) open.push([cut, 360]);
  return open;
};
const spanOf = (o) => o.reduce((s, [a, b]) => s + (b - a), 0);
const walkOf = (open, n) => {
  const span = spanOf(open);
  const step = span * ((3 - Math.sqrt(5)) / 2);
  return Array.from({ length: n }, (_, i) => {
    let p = (((i * step) % span) + span) % span;
    for (const [a, b] of open) {
      if (p < b - a) return a + p;
      p -= b - a;
    }
    return open[open.length - 1][1];
  });
};
const minSep = (hs) => {
  let m = 360;
  for (let i = 0; i < hs.length; i++)
    for (let k = i + 1; k < hs.length; k++) m = Math.min(m, gap(hs[i], hs[k]));
  return m;
};
const roomAt = (open, floor) => {
  for (let n = 2; n <= 144; n++) if (minSep(walkOf(open, n)) < floor) return n - 1;
  return 144;
};

const css = readFileSync(CSS, "utf8");
const headGate = [...css.matchAll(GATE_RE)].map((m) => ({ name: m[1], hex: m[2] }));
const headHues = headGate.map((t) => hueOf(labOfHex(t.hex)));

console.log("# A · PLR-COUNT's demand — ≥30° over the first SIX, painted");
const bytes = {};
for (const e of ["chromium", "webkit"])
  for (const t of ["light", "dark"])
    bytes[`${e}-${t}`] = JSON.parse(
      readFileSync(join(P1, `PAL-WALK/readings/bytes-${e}-${t}.json`), "utf8"),
    );
for (const key of Object.keys(bytes)) {
  const b = bytes[key];
  const labs = b.painted.map((p) => oklab(...p.rgb.split(",").map(Number)));
  const hs = b.painted.map((p) => p.h);
  const line = [];
  for (const n of [2, 3, 4, 5, 6, 7, 8]) {
    let mh = 360,
      md = Infinity;
    for (let i = 0; i < n; i++)
      for (let k = i + 1; k < n; k++) {
        mh = Math.min(mh, gap(hs[i], hs[k]));
        md = Math.min(md, dE(labs[i], labs[k]));
      }
    line.push(`N=${n} ${mh.toFixed(2)}° / ΔE ${md.toFixed(4)}`);
  }
  console.log(`  ${key.padEnd(16)} ${line.join("   ")}`);
}
console.log(
  "  HEAD's walk for comparison (r0/r5 ink-census, requested): N=4 52.5° · N=8 32.5° · N=16 12.5°",
);
console.log(
  "  HEAD's PAINTED N=3 with self at #2563eb (PLR-COUNT critique §6): 12.7° webkit / 13.3° chromium",
);

console.log("\n# B · THE RESERVED SET IS NOT A CONSTANT — what each accent family does to it");
const GUARD = 13;
const report = (label, gateTokens, allTokens) => {
  const hues = gateTokens.map((t) => hueOf(labOfHex(t.hex)));
  const arcs = arcsAt(GUARD, hues);
  const open = openOf(arcs);
  const span = spanOf(open);
  const seen = new Set(gateTokens.map((g) => `--color-${g.name}`.replace(/^--color---color-/, "--color-")));
  const missed = allTokens.filter((t) => !seen.has(t.name.startsWith("--color-") ? t.name : `--color-${t.name}`));
  console.log(
    `  ${label.padEnd(34)} gate sees ${String(gateTokens.length).padStart(2)} tokens → ${arcs.length} arcs, span ${span.toFixed(2)}°, step ${(span * ((3 - Math.sqrt(5)) / 2)).toFixed(2)}°, room@12° ${roomAt(open, 12)}`,
  );
  if (missed.length)
    console.log(
      `      INVISIBLE TO THE GATE (${missed.length}): ${missed.map((m) => `${m.name} ${m.hex}`).join(", ")}`,
    );
  // what a walk built on the gate's set would do against the tokens it cannot see
  if (missed.length) {
    const w = walkOf(open, 40);
    let worst = 360,
      who = "",
      at = -1;
    for (let i = 0; i < 40; i++)
      for (const m of missed) {
        const d = gap(w[i], hueOf(labOfHex(m.hex)));
        if (d < worst) {
          worst = d;
          who = m.name;
          at = i;
        }
      }
    console.log(
      `      → the walk it produces comes within ${worst.toFixed(2)}° of ${who} at index ${at} (floor is 12°)`,
    );
  }
};

/** Apply a unified diff's index.css hunks to HEAD's ink table: `-` lines drop, `+` lines add. */
function afterDiff(diffPath) {
  const d = readFileSync(diffPath, "utf8");
  const inCss = [];
  let on = false;
  for (const line of d.split("\n")) {
    if (line.startsWith("diff --git")) on = /index\.css/.test(line);
    if (on) inCss.push(line);
  }
  const drop = new Set();
  const add = [];
  for (const line of inCss) {
    if (line.startsWith("-")) {
      const m = [...line.matchAll(ANY_RE)];
      for (const x of m) drop.add(`${x[1]}|${x[2]}`);
    } else if (line.startsWith("+")) {
      const m = [...line.matchAll(ANY_RE)];
      for (const x of m) add.push({ name: x[1], hex: x[2] });
    }
  }
  const headAll = [...css.matchAll(ANY_RE)].map((m) => ({ name: m[1], hex: m[2] }));
  const kept = headAll.filter((t) => !drop.has(`${t.name}|${t.hex}`));
  return [...kept, ...add];
}

const headAll = [...css.matchAll(ANY_RE)].map((m) => ({ name: m[1], hex: m[2] }));
// Only chromatic tokens matter to a hue law; the greys and papers are near-achromatic. Keep the
// filter honest: anything the ANY_RE found whose OKLCH chroma clears 0.04.
const chromatic = (ts) =>
  ts.filter((t) => {
    const lab = labOfHex(t.hex);
    return Math.hypot(lab[1], lab[2]) > 0.04;
  });

report("HEAD", headGate, chromatic(headAll));
for (const [label, p] of [
  ["+ ACC-FIVE's pass-1 diff", join(P1, "ACC-FIVE/proto/acc-five-proto.diff")],
  ["+ ACC-SIX's pass-1 diff", join(P1, "ACC-SIX/proto/acc-six-proto.diff")],
]) {
  const after = afterDiff(p);
  const gate = after.filter((t) => {
    GATE_RE.lastIndex = 0;
    return new RegExp(GATE_RE.source).test(`${t.name}: ${t.hex}`);
  });
  report(label, gate, chromatic(after));
}

console.log("\n# C · SENSITIVITY — one more reserved hue, placed where it hurts most");
const worstAdd = () => {
  let best = null;
  for (let h = 0; h < 360; h += 0.5) {
    const open = openOf(arcsAt(GUARD, [...headHues, h]));
    const r = roomAt(open, 12);
    const s = spanOf(open);
    if (!best || r < best.r || (r === best.r && s < best.s)) best = { h, r, s };
  }
  return best;
};
const w = worstAdd();
console.log(
  `  a 30th reserved hue at ${w.h}° → span ${w.s.toFixed(2)}°, room@12° ${w.r} (HEAD: span 137.25°, room 8)`,
);
