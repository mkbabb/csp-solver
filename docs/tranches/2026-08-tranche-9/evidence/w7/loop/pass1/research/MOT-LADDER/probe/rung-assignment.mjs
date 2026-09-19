#!/usr/bin/env node
/**
 * MOT-LADDER · THE ASSIGNMENT TABLE.
 *
 * `check-motion-bands.mjs` counts what I6 counts (77 declarations / 35 literals) so the two
 * readings are comparable. This probe is position-aware and honest about the three things
 * that count makes look worse than it is:
 *
 *   · THREE of the 77 are COMMENT TEXT, not rules (`index.css:990`, `scene.css:606`,
 *     `DarkModeToggle.vue:769` — prose quoting `animation: none !important`).
 *   · Some time values are DELAYS, not durations (a 5-tuple's second time). A ladder is a
 *     set of LENGTHS; delays are a separate axis and are reported separately.
 *   · `0s` / `0ms` / `0.01ms` are not lengths: `0s` is the visibility-swap idiom, `0.01ms`
 *     is the global PRM nuke (`index.css:746`).
 *
 * It then assigns every real DURATION to a rung under both arms of the fork:
 *
 *   ARM A — the shipped owner-ruled numbers, named:
 *           whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520
 *   ARM B — whole multiples of the 125ms beat:
 *           tick 125 · note 250 · step 375 · throw 500 · settle 750
 *           with step 440 (T4-W12 ballot row 4) and throw 520 (audit 4) as cited exceptions.
 *
 * A duration is assigned to the NEAREST rung; the shift it costs and the direction are
 * printed, so "nothing shortened as a fix" (the W8 QUALITY LAW) is checkable per row.
 *
 * Run: node rung-assignment.mjs            table
 *      node rung-assignment.mjs --json     machine form
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const ROOT = resolve(
  process.env.ROOT ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
);
const SRC = join(ROOT, "src");

/** Declarations that are PROSE, not rules — the regex's known false positives. */
const COMMENT_ARTIFACTS = new Set([
  "src/assets/index.css:990",
  "src/games/shared/scene.css:606",
  "src/pencil/celestial/DarkModeToggle.vue:769",
]);

/** Time values that are not lengths. */
const NOT_A_LENGTH = new Set(["0s", "0ms", "0.01ms"]);

const ARM_A = [
  { name: "whisper", ms: 150 },
  { name: "leave", ms: 200 },
  { name: "note", ms: 250 },
  { name: "dusk", ms: 350 },
  { name: "step", ms: 440 },
  { name: "throw", ms: 520 },
];
const ARM_B = [
  { name: "tick", ms: 125 },
  { name: "note", ms: 250 },
  { name: "step", ms: 375 },
  { name: "throw", ms: 500 },
  { name: "settle", ms: 750 },
];
/** Arm B's cited exceptions — owner rulings this wave has no standing to move. */
const ARM_B_EXCEPTIONS = [
  { name: "stepRuled", ms: 440, cite: "pencilConfig.ts:145 RATIFY-ME T4-W12 ballot row 4" },
  { name: "throwRuled", ms: 520, cite: "pencilConfig.ts:190 audit 4 (2026-07-11); useControlsDrawer.ts:84" },
];

const toMs = (s) => (s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000);

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "dev") continue; // the debug rig is not shipped design
      yield* walk(p);
    } else if (/\.(vue|css|ts)$/.test(name)) yield p;
  }
}

const DECL = /(transition|animation)([a-z-]*):\s*([^;]+);/g;
const TIME = /\b\d+(?:\.\d+)?m?s\b/g;

const rows = [];
for (const file of walk(SRC)) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(DECL)) {
    const [, kind, suffix, body] = m;
    const line = text.slice(0, m.index).split("\n").length;
    const rel = `${relative(ROOT, file)}:${line}`;
    if (COMMENT_ARTIFACTS.has(rel)) continue;
    // split a shorthand list on commas: each clause has its own duration/delay pair
    for (const clause of body.split(",")) {
      const times = clause.match(TIME);
      if (!times) continue;
      const isDelayProp = /delay/.test(suffix);
      times.forEach((t, i) => {
        const role = isDelayProp || i > 0 ? "delay" : "duration";
        rows.push({
          rel,
          kind,
          role,
          raw: t,
          ms: toMs(t),
          clause: clause.replace(/\s+/g, " ").trim().slice(0, 78),
          notALength: NOT_A_LENGTH.has(t),
        });
      });
    }
  }
}

const durations = rows.filter((r) => r.role === "duration" && !r.notALength);
const delays = rows.filter((r) => r.role === "delay" && !r.notALength);

const nearest = (ms, rungs) =>
  rungs.reduce((best, r) => (Math.abs(r.ms - ms) < Math.abs(best.ms - ms) ? r : best));

const assign = (rungs, exceptions = []) => {
  const all = [...rungs, ...exceptions];
  const out = new Map();
  for (const d of durations) {
    const r = nearest(d.ms, all);
    const key = `${d.ms}`;
    if (!out.has(key))
      out.set(key, { ms: d.ms, rung: r.name, rungMs: r.ms, shift: r.ms - d.ms, sites: [] });
    out.get(key).sites.push(d.rel);
  }
  return [...out.values()].sort((a, b) => a.ms - b.ms);
};

const a = assign(ARM_A);
const b = assign(ARM_B, ARM_B_EXCEPTIONS);

const summary = (label, rows, rungs, exceptions = []) => {
  const moved = rows.filter((r) => r.shift !== 0);
  const shortened = moved.filter((r) => r.shift < 0);
  const onException = rows.filter((r) => exceptions.some((e) => e.name === r.rung));
  const sitesOnException = onException.reduce((n, r) => n + r.sites.length, 0);
  return {
    label,
    rungs: rungs.length + exceptions.length,
    exceptions: exceptions.length,
    distinctDurations: rows.length,
    sites: rows.reduce((n, r) => n + r.sites.length, 0),
    unmoved: rows.length - moved.length,
    moved: moved.length,
    shortened: shortened.length,
    maxShift: rows.reduce((m, r) => Math.max(m, Math.abs(r.shift)), 0),
    sitesOnException,
    worst: moved
      .slice()
      .sort((x, y) => Math.abs(y.shift) - Math.abs(x.shift))
      .slice(0, 6)
      .map((r) => `${r.ms}→${r.rungMs} (${r.rung}, ${r.sites.length} site${r.sites.length > 1 ? "s" : ""})`),
  };
};

const sa = summary("ARM A · shipped numbers named", a, ARM_A);
const sb = summary("ARM B · quantised to the 125ms beat", b, ARM_B, ARM_B_EXCEPTIONS);

/* ── THE TOLERANCE SWEEP ────────────────────────────────────────────────────────
 * A ladder that swallows every length in the estate shortens the four long-form verbs
 * (the wordmark's 1.2s clip write-on, the bloom's 800ms, plush-land's 1010ms, the loader's
 * 1000ms infinite cycle) — the W8 QUALITY LAW forbids exactly that. So the honest question
 * is not "which rung is nearest" but "how far may a rung pull a shipped length before the
 * pull is itself a retune the wave has no standing to make". Sweep it and read the cost.
 */
function sweep(rungs, exceptions = []) {
  const all = [...rungs, ...exceptions];
  const lengths = [...new Set(durations.map((d) => d.ms))].sort((x, y) => x - y);
  const siteCount = (ms) => durations.filter((d) => d.ms === ms).length;
  const out = [];
  for (const tol of [0, 10, 20, 30, 40, 55, 999]) {
    let onLadder = 0,
      offLadder = 0,
      onSites = 0,
      offSites = 0,
      shortenedSites = 0;
    const off = [];
    for (const ms of lengths) {
      const r = nearest(ms, all);
      const shift = r.ms - ms;
      if (Math.abs(shift) <= tol) {
        onLadder++;
        onSites += siteCount(ms);
        if (shift < 0) shortenedSites += siteCount(ms);
      } else {
        offLadder++;
        offSites += siteCount(ms);
        off.push(ms);
      }
    }
    out.push({ tol, onLadder, offLadder, onSites, offSites, shortenedSites, off });
  }
  return out;
}
const sweepA = sweep(ARM_A);
const sweepB = sweep(ARM_B, ARM_B_EXCEPTIONS);

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      { summary: [sa, sb], sweepA, sweepB, armA: a, armB: b, durations, delays },
      null,
      1,
    ),
  );
  process.exit(0);
}

console.log(
  `REAL DURATIONS: ${durations.length} duration positions across ` +
    `${new Set(durations.map((d) => d.rel)).size} declarations, ` +
    `${new Set(durations.map((d) => d.ms)).size} distinct lengths.`,
);
console.log(
  `DELAYS (a separate axis): ${delays.length} positions, ` +
    `${new Set(delays.map((d) => d.ms)).size} distinct.`,
);
console.log(
  `NOT LENGTHS (excluded): ${rows.filter((r) => r.notALength).length} ` +
    `(0s visibility swaps, the 0.01ms PRM nuke at index.css:746).`,
);

for (const [s, table, exceptions] of [
  [sa, a, []],
  [sb, b, ARM_B_EXCEPTIONS],
]) {
  console.log(`\n══ ${s.label} — ${s.rungs} rungs (${s.exceptions} exception) ══`);
  console.log(
    `   ${s.distinctDurations} distinct lengths → ${s.rungs} rungs; ${s.unmoved} land EXACTLY, ` +
      `${s.moved} move (${s.shortened} shortened), worst shift ${s.maxShift}ms; ` +
      `${s.sitesOnException} site(s) on an exception rung`,
  );
  console.log(`   ms   →  rung        shift   sites`);
  for (const r of table) {
    const ex = exceptions.some((e) => e.name === r.rung) ? " *" : "";
    console.log(
      `   ${String(r.ms).padStart(5)} → ${(r.rung + ex).padEnd(12)} ${String(r.shift > 0 ? "+" + r.shift : r.shift).padStart(6)}  ` +
        `${String(r.sites.length).padStart(2)}  ${r.sites.slice(0, 3).join(" ")}${r.sites.length > 3 ? " …" : ""}`,
    );
  }
  console.log(`   worst moves: ${s.worst.join(" · ")}`);
}

console.log(
  `\n══ THE TOLERANCE SWEEP — how far may a rung pull a shipped length? ══\n` +
    `   (a length beyond the tolerance is NOT on the ladder: it keeps its value and owes a ` +
    `ruling)\n   tol   ARM A: lengths on/off · sites on/off · sites shortened      ` +
    `ARM B: same`,
);
for (let i = 0; i < sweepA.length; i++) {
  const A = sweepA[i],
    B = sweepB[i];
  console.log(
    `   ${String(A.tol === 999 ? "any" : A.tol + "ms").padStart(5)}  ` +
      `${String(A.onLadder).padStart(2)}/${String(A.offLadder).padEnd(2)} · ` +
      `${String(A.onSites).padStart(2)}/${String(A.offSites).padEnd(2)} · ${String(A.shortenedSites).padStart(2)}` +
      `                                  ` +
      `${String(B.onLadder).padStart(2)}/${String(B.offLadder).padEnd(2)} · ` +
      `${String(B.onSites).padStart(2)}/${String(B.offSites).padEnd(2)} · ${String(B.shortenedSites).padStart(2)}`,
  );
}
console.log(`   ARM A off-ladder at 30ms: ${sweepA.find((s) => s.tol === 30).off.join(", ")}`);
console.log(`   ARM B off-ladder at 30ms: ${sweepB.find((s) => s.tol === 30).off.join(", ")}`);
console.log(`   ARM A off-ladder at 0ms:  ${sweepA.find((s) => s.tol === 0).off.join(", ")}`);
console.log(`   ARM B off-ladder at 0ms:  ${sweepB.find((s) => s.tol === 0).off.join(", ")}`);
