#!/usr/bin/env node
/**
 * MOT-VERB pass 4 — THE PER-SITE FIXED-t TABLE (charter row 4).
 *
 * Pass 3 shipped ~32 declarations whose painted CURVE moved and six whose LENGTH moved, with
 * ONE measurement between them, and neither π instrument could see either (a rect census reads
 * geometry at rest; the CSS set-diff excludes timing lines). This prices every one of them.
 *
 * The number is not a pixel — it is the DIFFERENCE IN PROGRESS at a fixed t between the curve
 * the control paints and the curve this tree paints, sampled every 5% of the declaration's own
 * duration, reported as the worst sample and as the time at which the two are furthest apart.
 * Multiply it by the declaration's own travel and you have the pixel; for opacity and colour it
 * IS the number, because progress is the value. A row reading 0.000 is a re-NAME and not a
 * re-curve, which is the claim this family has been making without the arithmetic under it.
 *
 * ARMS. `--arm=curves` (default) prices the curve moves. `--arm=lengths` prices the six length
 * rounds: the same curve, two durations, the biggest gap between the two progress traces on one
 * wall clock, and the wall-clock instant it happens at.
 *
 * SOURCES. The control's curve values are read from `git show 74a2b5d9:…/index.css`; the after
 * values from the work tree. Every declaration pair is listed here by hand with its file and
 * its site, because the point of the table is that someone looked at each one.
 */
import { execFileSync } from "node:child_process";

const WT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59";

/** Cubic-bezier progress: solve x(t)=p for t by bisection, return y(t). The UA's own method. */
function bezier(p1x, p1y, p2x, p2y) {
  const A = (a, b) => 3 * a - 3 * b + 1;
  const cx = (t, a, b) => ((A(a, b) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
  return (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let lo = 0,
      hi = 1,
      t = p;
    for (let i = 0; i < 60; i++) {
      const x = cx(t, p1x, p2x);
      if (Math.abs(x - p) < 1e-7) break;
      if (x < p) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return cx(t, p1y, p2y);
  };
}

const KEYWORDS = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
};

function curveOf(spec, tokens) {
  if (KEYWORDS[spec]) return KEYWORDS[spec];
  const tok = /var\((--[\w-]+)\)/.exec(spec)?.[1];
  const raw = tok ? tokens[tok] : spec;
  const m = /cubic-bezier\(([^)]*)\)/.exec(raw ?? "");
  if (!m) throw new Error(`no curve for ${spec} (${raw})`);
  return m[1].split(",").map((n) => Number(n.trim()));
}

/** Every `--ease-*` / `--verb-*-ease` declaration in a stylesheet, as a map. */
function tokensOf(css) {
  const out = {};
  for (const m of css.matchAll(/(--(?:ease|verb)-[\w-]+)\s*:\s*(cubic-bezier\([^)]*\))/g))
    out[m[1]] = m[2];
  return out;
}

const read = (rev, p) =>
  rev === "WT"
    ? execFileSync("cat", [`${WT}/${p}`], { encoding: "utf8" })
    : execFileSync("git", ["-C", WT, "show", `${rev}:${p}`], { encoding: "utf8" });

const CSS = "web/frontend/src/assets/index.css";
const before = tokensOf(read("74a2b5d9", CSS));
const after = tokensOf(read("WT", CSS));

// ── THE SITES. file :: what it is :: control curve :: this tree's curve :: its duration (ms).
const CURVES = [
  ["chrome/AttributionCard.vue", "the card's four rows", "var(--ease-standard)", "var(--verb-layDown-ease)", 150],
  ["chrome/GameGallery.vue", "the deck's three grounds", "var(--ease-standard)", "var(--verb-layDown-ease)", 150],
  ["chrome/GameGallery.vue", "the pip's arrival", "var(--ease-glassGlide)", "var(--verb-layDown-ease)", 250],
  ["chrome/GameCard.vue", "the card's step", "var(--ease-glassGlide)", "var(--verb-slide-ease)", 440],
  ["chrome/GameCard.vue", "the card's word", "var(--ease-standard)", "var(--verb-layDown-ease)", 150],
  ["games/GameControlPanel.vue", "the four control grounds", "var(--ease-standard)", "var(--verb-layDown-ease)", 150],
  ["games/DrawerTab.vue", "the tab's nudge", "ease-out", "var(--verb-layDown-ease)", 150],
  ["celestial/DarkModeToggle.vue", "the toggle's rest", "ease", "var(--verb-layDown-ease)", 200],
  ["chrome/CrayonHeart.vue", "the heart", "ease", "var(--verb-layDown-ease)", 250],
  ["sheet/SheetWashiLabel.vue", "the label", "ease", "var(--verb-layDown-ease)", 150],
  ["games/SolverErrorNote.vue", "the note's arrival", "var(--ease-noteWrite)", "var(--verb-layDown-ease)", 250],
  ["games/SolverErrorNote.vue", "the note's ground", "ease", "var(--verb-layDown-ease)", 150],
  ["chrome/HandwrittenLogo.vue", "the wordmark straightens", "var(--ease-noteWrite)", "var(--verb-layDown-ease)", 200],
  ["assets/index.css", "the gold stroke", "ease", "var(--verb-layDown-ease)", 520],
  ["assets/index.css", "the gold shadow", "ease", "var(--verb-layDown-ease)", 520],
  ["assets/index.css", "THE DUSK (five grounds)", "ease", "var(--verb-dusk-ease)", 350],
  ["games/scene.css", "the chrome leave", "var(--ease-fadeOut)", "var(--verb-lift-ease)", 200],
  ["games/scene.css", "beat 3, every scene mount", "var(--ease-drawOn)", "var(--verb-writeIn-ease)", 250],
  ["games/CaretOverlay.vue", "the caret leaves", "var(--ease-fadeOut)", "var(--verb-lift-ease)", 200],
  ["games/GameBoard.vue", "the board leaves", "var(--ease-fadeOut)", "var(--verb-lift-ease)", 200],
  ["games/ThermoTube.vue", "the tube leaves", "var(--ease-fadeOut)", "var(--verb-lift-ease)", 200],
  ["App.vue", "the deck's leave-only dissolve", "var(--ease-glassGlide)", "var(--verb-lift-ease)", 200],
  ["sheet/AnswerKeyLaminate.vue", "the laminate lifts (x2)", "var(--ease-accelIn)", "var(--verb-lift-ease)", 200],
  ["grid/HandDrawnGrid.vue", "the grid's dashoffset", "ease", "var(--verb-writeIn-ease)", 250],
  ["grid/HandDrawnGrid.vue", "the grid's opacity", "ease", "var(--verb-layDown-ease)", 520],
  ["chrome/MarginNote.vue", "the note's ink (x2)", "var(--ease-noteWrite)", "var(--verb-writeIn-ease)", 250],
  ["chrome/CompletionVignette.vue", "the vignette's ink", "var(--ease-noteWrite)", "var(--verb-writeIn-ease)", 250],
  ["chrome/icons/FillForcedIcon.vue", "the mark draws", "var(--ease-standard)", "var(--verb-layDown-ease)", 350],
  ["chrome/icons/SolveIcon.vue", "the check draws", "var(--ease-standard)", "var(--verb-layDown-ease)", 350],
];

// The six LENGTH rounds: file :: what it is :: control ms :: this tree's ms :: the shared curve.
const LENGTHS = [
  ["assets/index.css", "the completion stroke sweep", 500, 520, "var(--verb-layDown-ease)"],
  ["assets/index.css", "the completion box-shadow", 500, 520, "var(--verb-layDown-ease)"],
  ["grid/HandDrawnGrid.vue", "the grid's opacity", 500, 520, "var(--verb-layDown-ease)"],
  ["chrome/CrayonHeart.vue", "the heart's opacity", 240, 250, "var(--verb-layDown-ease)"],
  ["chrome/GameGallery.vue", "the pip's transform", 240, 250, "var(--verb-layDown-ease)"],
  ["chrome/GameGallery.vue", "the pip's opacity", 240, 250, "var(--verb-layDown-ease)"],
];

const arm = process.argv.find((a) => a.startsWith("--arm="))?.slice(6) ?? "curves";
const SAMPLES = 21; // every 5% of the declaration's own duration

if (arm === "curves") {
  console.log("PER-SITE FIXED-t TABLE — the curve moves, priced");
  console.log("worst |Δprogress| over 21 samples, and the t it happens at (0..1 of the duration)\n");
  console.log(
    "site".padEnd(34) + "what".padEnd(32) + "ms".padStart(5) + "  worstΔ   at t   verdict",
  );
  let worst = 0;
  const rows = [];
  for (const [file, what, from, to, ms] of CURVES) {
    const a = bezier(...curveOf(from, before));
    const b = bezier(...curveOf(to, after));
    let wd = 0,
      wt = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1);
      const d = Math.abs(b(t) - a(t));
      if (d > wd) {
        wd = d;
        wt = t;
      }
    }
    worst = Math.max(worst, wd);
    rows.push({ file, what, ms, worst: wd, at: wt });
    console.log(
      file.padEnd(34) +
        what.padEnd(32) +
        String(ms).padStart(5) +
        "  " +
        wd.toFixed(4).padStart(6) +
        "   " +
        wt.toFixed(2) +
        "   " +
        (wd < 0.005 ? "a RE-NAME" : wd < 0.05 ? "a nudge" : "A RE-CURVE"),
    );
  }
  const big = rows.filter((r) => r.worst >= 0.05);
  console.log(
    `\nsites ${rows.length} · worst |Δprogress| ${worst.toFixed(4)} · ` +
      `re-names (<0.005) ${rows.filter((r) => r.worst < 0.005).length} · ` +
      `nudges ${rows.filter((r) => r.worst >= 0.005 && r.worst < 0.05).length} · ` +
      `re-curves (>=0.05) ${big.length}`,
  );
  if (big.length) {
    console.log("\nTHE RE-CURVES, which are the rows that need the owner's eye:");
    for (const r of big.sort((x, y) => y.worst - x.worst))
      console.log(`  ${r.worst.toFixed(4)} at t=${r.at.toFixed(2)}  ${r.file} — ${r.what} (${r.ms}ms)`);
  }
} else {
  console.log("THE SIX LENGTH ROUNDS, priced on one wall clock");
  console.log("worst |Δprogress| between the two traces, and the millisecond it happens at\n");
  console.log("site".padEnd(28) + "what".padEnd(30) + "from→to   worstΔ    at ms");
  for (const [file, what, from, to, curve] of LENGTHS) {
    const f = bezier(...curveOf(curve, after));
    let wd = 0,
      wms = 0;
    for (let ms = 0; ms <= Math.max(from, to); ms += 1) {
      const d = Math.abs(f(Math.min(1, ms / to)) - f(Math.min(1, ms / from)));
      if (d > wd) {
        wd = d;
        wms = ms;
      }
    }
    console.log(
      file.padEnd(28) +
        what.padEnd(30) +
        `${from}→${to}`.padEnd(10) +
        wd.toFixed(4).padStart(6) +
        "   " +
        wms +
        "ms",
    );
  }
}
