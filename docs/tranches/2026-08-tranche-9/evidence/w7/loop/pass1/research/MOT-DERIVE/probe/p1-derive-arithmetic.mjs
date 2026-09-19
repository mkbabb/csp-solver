#!/usr/bin/env node
// T9-W7 pass-1 · MOT-DERIVE · THE ARITHMETIC, and it runs before any code.
//
// The family's claim: nobody chooses a duration — ms = baseMs + travelPx / speed(material).
// This script reads the round-zero animate() census (r0/r4-transition-grammar/data/r4-probe3.json:
// every Element.prototype.animate call with target, keyframes and options at 390x844 and
// 1440x900 against a built dist) and does four things:
//
//   1. TRAVEL CENSUS  — every mover's translate magnitude beside its declared duration.
//   2. THE SOLVE      — paperSpeed from the desk drawer's travel and 520ms, at three choices
//                       of baseMs, then the PREDICTION for the dock (628px) and the card step.
//   3. THE PAIRINGS   — every two-point fit of (baseMs, speed) and what it does to the third
//                       point. Two unknowns, three ruled facts: the model is over-determined.
//   4. LEAST SQUARES  — the best single (baseMs, speed) over all three, with residuals.
//
// Read-only. No product file is touched. No server needed.
//
//   node p1-derive-arithmetic.mjs [path/to/r4-probe3.json]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import process from "node:process";

const here = dirname(fileURLToPath(import.meta.url));
const PROBE3 =
  process.argv[2] ??
  resolve(here, "../../../../r0/r4-transition-grammar/data/r4-probe3.json");

const probe = JSON.parse(readFileSync(PROBE3, "utf8"));

// ── 1. THE TRAVEL CENSUS ────────────────────────────────────────────────────────────────
// A mover's keyframe is the FLIP's inverted delta: [{transform: FROM}, {transform: "identity"}].
// FROM's translate IS the travel the primitive computed at gesture onset and threw away.

const NUM = "(-?[\\d.e+-]+)px";
const reTranslate = new RegExp(`translate\\(\\s*${NUM}\\s*,\\s*${NUM}\\s*\\)`);
const reTranslateX = new RegExp(`translateX\\(\\s*${NUM}\\s*\\)`);
const reTranslateY = new RegExp(`translateY\\(\\s*(-?[\\d.]+)%\\s*\\)`);
const reScale = /scale\(\s*([\d.]+)\s*\)/;

function parseFrom(kfJson) {
  const kf = JSON.parse(kfJson);
  const from = kf[0]?.transform ?? "";
  let dx = 0;
  let dy = 0;
  const t = reTranslate.exec(from);
  if (t) {
    dx = Number(t[1]);
    dy = Number(t[2]);
  } else {
    const tx = reTranslateX.exec(from);
    if (tx) dx = Number(tx[1]);
  }
  const s = reScale.exec(from);
  return {
    from,
    dx,
    dy,
    travel: Math.hypot(dx, dy),
    scale: s ? Number(s[1]) : 1,
    percentOnly: !t && !reTranslateX.exec(from) && !!reTranslateY.exec(from),
  };
}

const rows = [];
for (const [vp, bag] of Object.entries(probe)) {
  let mark = "(none)";
  for (const m of bag.movers) {
    if (m.mark) {
      mark = m.mark;
      continue;
    }
    const opts = JSON.parse(m.opts);
    const f = parseFrom(m.kf);
    rows.push({
      vp,
      mark,
      target: `${m.tag}.${m.cls.split(" ")[0]}`,
      travel: f.travel,
      scale: f.scale,
      ms: opts.duration,
      easing: opts.easing,
      percentOnly: f.percentOnly,
    });
  }
}

const f1 = (n) => n.toFixed(1);
const f3 = (n) => n.toFixed(3);

console.log("=".repeat(96));
console.log("1. THE TRAVEL CENSUS — every mover the product creates, its travel, its duration");
console.log("=".repeat(96));
console.log(
  ["viewport", "gesture", "target", "travel px", "scale", "ms", "px/ms"].join("\t"),
);
for (const r of rows) {
  console.log(
    [
      r.vp,
      r.mark,
      r.target,
      f1(r.travel),
      f3(r.scale),
      r.ms,
      r.travel === 0 ? "—" : f3(r.travel / r.ms),
    ].join("\t"),
  );
}

const at520 = rows.filter((r) => r.ms === 520 && r.travel > 0).map((r) => r.travel);
const at440 = rows.filter((r) => r.ms === 440).map((r) => r.travel);
console.log("");
console.log(
  `520ms is declared on ${at520.length} moving targets, travel ${f1(Math.min(...at520))} … ${f1(
    Math.max(...at520),
  )} px  (span ${f1(Math.max(...at520) / Math.min(...at520))}x)`,
);
console.log(
  `440ms is declared on ${at440.length} moving target(s), travel ${at440.map(f1).join(", ")} px`,
);
const zeroTravel = rows.filter((r) => r.travel === 0);
console.log(
  `movers with ZERO translate (pure scale) inside a moving gesture: ${zeroTravel.length} — ${zeroTravel
    .map((r) => `${r.target}@${r.ms}ms`)
    .join(", ")}`,
);

// ── 2. THE ANCHORS ──────────────────────────────────────────────────────────────────────
// Three ruled facts. Every one is a product duration the estate declares today, beside the
// travel its own primitive measured. The card step's desk travel is the slot width the
// stylesheet resolves at 1440 (GameGallery.vue:1291, min(22rem, (100vw-3rem)/3) = 352px);
// probe3 logs NO mover for the desk's 0->1 step because the deck's rest position is the same
// for cards 0 and 1 at the three-slot rung (useCarouselGlide.ts:172) — the step moves the
// highlight and not the track. Measured separately by p2.

const A = { id: "desk drawer (1440, .scene-controls)", travel: Math.hypot(209, 2.8125), ms: 520 };
const B = { id: "dock sheet  ( 390, .scene-controls)", travel: 628, ms: 520 };
const C = { id: "card step   ( 390, .gallery-track)", travel: 304, ms: 440 };
const Cdesk = { id: "card step   (1440, .gallery-track)", travel: 352, ms: 440 };
const anchors = [A, B, C];

console.log("");
console.log("=".repeat(96));
console.log("2. THE SOLVE — paperSpeed from the desk drawer, then predict the rest");
console.log("=".repeat(96));
for (const a of [A, B, C, Cdesk]) console.log(`  ${a.id}  travel ${f1(a.travel)} px  ruled ${a.ms} ms`);

function report(label, base, speed, predictFor) {
  console.log("");
  console.log(`— ${label}`);
  console.log(`  baseMs = ${f1(base)} ms   paperSpeed = ${f3(speed)} px/ms (${f1(speed * 1000)} px/s)`);
  for (const p of predictFor) {
    const ms = base + p.travel / speed;
    const d = ms - p.ms;
    console.log(
      `  ${p.id}: predicted ${f1(ms)} ms vs ruled ${p.ms} → miss ${d >= 0 ? "+" : ""}${f1(d)} ms (${
        d >= 0 ? "+" : ""
      }${f1((d / p.ms) * 100)}%)`,
    );
  }
}

// 2a. The charter's own instruction: solve paperSpeed from the desk drawer and 520ms.
for (const base of [0, 120, 200]) {
  if (base >= A.ms) continue;
  const speed = A.travel / (A.ms - base);
  report(
    `ANCHOR = the desk drawer, baseMs = ${base}`,
    base,
    speed,
    [B, C, Cdesk],
  );
}

// 2b. The mirror: anchor on the dock instead.
for (const base of [0, 120, 200]) {
  const speed = B.travel / (B.ms - base);
  report(`ANCHOR = the dock sheet, baseMs = ${base}`, base, speed, [A, C, Cdesk]);
}

// ── 3. THE PAIRINGS — two unknowns against three ruled facts ────────────────────────────
console.log("");
console.log("=".repeat(96));
console.log("3. THE PAIRINGS — fit (baseMs, speed) to two ruled facts, predict the third");
console.log("=".repeat(96));

function fit2(p, q) {
  const dms = p.ms - q.ms;
  const dtr = p.travel - q.travel;
  if (Math.abs(dms) < 1e-9)
    return { degenerate: `equal durations (${p.ms}ms) on ${f1(dtr)}px of travel difference` };
  const speed = dtr / dms; // px per ms
  const base = p.ms - p.travel / speed;
  return { speed, base };
}

for (const [p, q, third] of [
  [A, B, C],
  [B, C, A],
  [A, C, B],
]) {
  console.log("");
  console.log(`— fit on {${p.id.trim()}} + {${q.id.trim()}}`);
  const r = fit2(p, q);
  if (r.degenerate) {
    console.log(`  NO FINITE SOLUTION: ${r.degenerate}.`);
    console.log(
      "  The only model consistent with both is speed = infinity, i.e. travel contributes ZERO ms",
    );
    console.log("  and the 'derived' duration collapses to the constant it was meant to replace.");
    continue;
  }
  console.log(`  baseMs = ${f1(r.base)} ms   paperSpeed = ${f3(r.speed)} px/ms`);
  if (r.speed < 0)
    console.log("  SPEED IS NEGATIVE — under this fit a longer throw takes LESS time.");
  const share = ((r.base / p.ms) * 100).toFixed(1);
  console.log(`  the constant's share of the ${p.ms}ms it explains: ${share}%`);
  const ms = r.base + third.travel / r.speed;
  const d = ms - third.ms;
  console.log(
    `  → ${third.id}: predicted ${f1(ms)} ms vs ruled ${third.ms} → miss ${
      d >= 0 ? "+" : ""
    }${f1(d)} ms (${d >= 0 ? "+" : ""}${f1((d / third.ms) * 100)}%)`,
  );
}

// ── 4. LEAST SQUARES over all three ─────────────────────────────────────────────────────
console.log("");
console.log("=".repeat(96));
console.log("4. LEAST SQUARES — the best single (baseMs, speed) the estate's own numbers allow");
console.log("=".repeat(96));
{
  const n = anchors.length;
  const mt = anchors.reduce((s, a) => s + a.travel, 0) / n;
  const mm = anchors.reduce((s, a) => s + a.ms, 0) / n;
  const sxy = anchors.reduce((s, a) => s + (a.travel - mt) * (a.ms - mm), 0);
  const sxx = anchors.reduce((s, a) => s + (a.travel - mt) ** 2, 0);
  const k = sxy / sxx; // ms per px
  const base = mm - k * mt;
  const speed = 1 / k;
  console.log(`  baseMs = ${f1(base)} ms   paperSpeed = ${f3(speed)} px/ms (${f1(speed * 1000)} px/s)`);
  let ss = 0;
  for (const a of anchors) {
    const ms = base + a.travel * k;
    const d = ms - a.ms;
    ss += d * d;
    console.log(
      `  ${a.id}: predicted ${f1(ms)} ms vs ruled ${a.ms} → ${d >= 0 ? "+" : ""}${f1(d)} ms (${
        d >= 0 ? "+" : ""
      }${f1((d / a.ms) * 100)}%)   [travel term ${f1(a.travel * k)} ms]`,
    );
  }
  console.log(`  RMS miss ${f1(Math.sqrt(ss / n))} ms`);
  const span = anchors.map((a) => a.travel * k);
  console.log(
    `  the travel term across a ${f1(Math.max(...anchors.map((a) => a.travel)) / Math.min(...anchors.map((a) => a.travel)))}x travel range spans ${f1(
      Math.max(...span) - Math.min(...span),
    )} ms — ${f1((Math.max(...span) - Math.min(...span)) / 16.7)} frames at 60Hz.`,
  );
  console.log(
    `  the constant's share of the mean duration: ${f1((base / mm) * 100)}% — the system is a constant with a rounding error attached.`,
  );
}

// ── 5. THE ENGINE DELTA ─────────────────────────────────────────────────────────────────
// r0/r7-owners-eye/probe-r7b.json: the same dock gesture, the same build, .drawer-case's
// rect sampled every frame — webkit 576.4px, chromium 604.6px (390x844, both settle ~481ms).
console.log("");
console.log("=".repeat(96));
console.log("5. THE ENGINE DELTA — one gesture, two travels");
console.log("=".repeat(96));
{
  const webkit = 576.4;
  const chromium = 604.6;
  console.log(`  measured dock travel: webkit ${webkit} px · chromium ${chromium} px (probe-r7b.json)`);
  console.log(`  declared keyframe travel at the same viewport: 628 px (probe3, .scene-controls)`);
  for (const [label, base, speed] of [
    ["least-squares fit", 469.3, 15.804],
    ["(dock+card) two-point fit", 364.9, 4.05],
    ["desk-anchored, base 0", 0, Math.hypot(209, 2.8125) / 520],
  ]) {
    const w = base + webkit / speed;
    const c = base + chromium / speed;
    console.log(
      `  ${label}: webkit ${f1(w)} ms · chromium ${f1(c)} ms → the two engines differ by ${f1(
        c - w,
      )} ms (${f1(((c - w) / w) * 100)}%)`,
    );
  }
}
console.log("");
console.log("done.");
