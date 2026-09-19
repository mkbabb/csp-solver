#!/usr/bin/env node
/**
 * I3 — THE ONE GLASS CURVE HAS ONE MIRROR AND A NAMED DURATION EVERY TIME IT IS SPENT.
 * BORN HALF-RED.
 *
 * Two claims live in prose today and nothing checks either:
 *
 *   A. THE MIRROR. `MOTION.curves.drawerGlide` (pencilConfig.ts) and `--ease-glassGlide`
 *      (assets/index.css @theme §EASING) are declared "byte-identical control points".
 *      Nothing diffs them; a retune of one side would ship a two-speed house silently.
 *
 *   B. THE HOME. The drawer ruling says the glass curve is the house's one long-throw
 *      curve. It is spent at SIX durations across the product, of which only two resolve
 *      to a MOTION constant (`cardStepMs` 440 via `--card-step-ms`, `boardFoldMs` 520 via
 *      `useFlipGlide`). The rest — 200, 240, 280, 320 ms — are literals typed at the call
 *      site: the "incidental" class the owner named, wearing a named curve.
 *
 * Run: node i3-glass-curve-home.mjs
 *
 * READING AT HEAD (2026-09-17):
 *   A GREEN — both sides read `cubic-bezier(0.32, 0.72, 0, 1)`.
 *   B RED   — 6 distinct glass durations, 2 with a MOTION home, 4 homeless
 *             (200 App.vue deck-leave · 240 guard ribbon · 280 answer-key laminate ·
 *              320 the multiplayer player-row open/close).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const FE = resolve(process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend");
const SRC = join(FE, "src");

// ── A. the mirror ─────────────────────────────────────────────────────────
const ts = readFileSync(join(SRC, "pencil/config/pencilConfig.ts"), "utf8");
const css = readFileSync(join(SRC, "assets/index.css"), "utf8");
const tsCurve = /drawerGlide:\s*"([^"]+)"/.exec(ts)?.[1] ?? null;
const cssCurve = /^\s*--ease-glassGlide:\s*(cubic-bezier\([^;]+\));/m.exec(css)?.[1]?.trim() ?? null;
const mirrorOk = tsCurve !== null && cssCurve !== null && tsCurve === cssCurve;

// ── B. every duration spent on the glass curve ────────────────────────────
// A MOTION constant is a home; a raw `<n>ms` literal is not. `var(--card-step-ms, 440ms)`
// is a home: GameGallery publishes it from MOTION.cardStepMs.
const HOMED = new Set([
  "var(--card-step-ms, 440ms)", // MOTION.cardStepMs
]);
// MOTION's own band constants, not the CELEBRATION/BOIL tables further down the file.
const motionBlock = ts.slice(ts.indexOf("export const MOTION"), ts.indexOf("export function beatsFor"));
const MOTION_MS = [...motionBlock.matchAll(/^\s+([a-zA-Z]+Ms):\s*(\d+)/gm)].map((m) => ({ name: m[1], ms: +m[2] }));
// ── WIDENED (T9-W7 §13). The three band keys became rungs on one ladder, so a reader that
// only knows `<name>Ms: <n>` goes half-blind: it reported `beatMs=125` and lost the rest.
// Read `rungs: { … }` too, and treat `var(--motion-<rung>, <n>ms)` as a home exactly when
// the fallback is the rung's own number — the same test the ladder gate's B3 makes.
const rungBlock = /rungs:\s*\{([^}]*)\}/.exec(motionBlock)?.[1] ?? "";
const RUNGS = [...rungBlock.matchAll(/([a-zA-Z]+):\s*(\d+)/g)].map((m) => ({ name: `rungs.${m[1]}`, ms: +m[2] }));
for (const r of RUNGS) HOMED.add(`var(--motion-${r.name.slice(6)}, ${r.ms}ms)`);
MOTION_MS.push(...RUNGS);

function* walk(dir, ext = /\.(vue|css)$/) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "dev") continue;
      yield* walk(p, ext);
    } else if (ext.test(name)) yield p;
  }
}

const spends = [];
for (const file of walk(SRC)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (!line.includes("var(--ease-glassGlide)")) return;
    const dur =
      /(var\(--card-step-ms,\s*\d+ms\)|var\(--motion-[a-zA-Z]+,\s*\d+ms\)|\d+(?:\.\d+)?m?s)\s+var\(--ease-glassGlide\)/.exec(
        line,
      );
    spends.push({ at: `${relative(FE, file)}:${i + 1}`, dur: dur?.[1] ?? "?", line: line.trim().slice(0, 70) });
  });
}
// The WAAPI spends have no CSS line — they ride the glass curve through useFlipGlide. The
// original pinned ONE row naming `MOTION.boardFoldMs`, a key the ladder retires; a pinned
// name is a claim that rots silently. WIDENED: read every caller's own duration expression.
for (const file of walk(SRC, /\.(vue|ts)$/)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const m = /useFlipGlide\(\{\s*durationMs:\s*([^,}]+)/.exec(line);
    if (m) spends.push({ at: `${relative(FE, file)}:${i + 1}`, dur: m[1].trim(), line: line.trim().slice(0, 70) });
  });
}

const homeless = spends.filter((s) => !HOMED.has(s.dur) && !s.dur.startsWith("MOTION."));
const distinct = [...new Set(spends.map((s) => s.dur))];

console.log("A. THE MIRROR");
console.log(`   MOTION.curves.drawerGlide = ${tsCurve}`);
console.log(`   --ease-glassGlide         = ${cssCurve}`);
console.log(`   ${mirrorOk ? "GREEN" : "RED — the two layers have diverged"}`);
console.log("B. THE HOME");
console.log(`   MOTION duration constants : ${MOTION_MS.map((m) => `${m.name}=${m.ms}`).join(" ")}`);
console.log(`   distinct glass durations  : ${distinct.length} — ${distinct.join(", ")}`);
console.log(`   homeless spends           : ${homeless.length}`);
for (const h of homeless) console.log(`     · ${h.at.padEnd(52)} ${h.dur}`);
const red = !mirrorOk || homeless.length > 0;
console.log(red ? "RED" : "GREEN");
if (red) process.exit(1);
