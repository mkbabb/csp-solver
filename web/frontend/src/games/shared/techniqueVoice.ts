/**
 * The technique layer's marginalia voice (T4-W7, lane E3) — the two prose strings the
 * technique engine feeds the margin. Kept out of the engine (which stays pure geometry) and
 * shared by both games so the phrasing never drifts (SudokuBoard/FutoshikiBoard both call it).
 * Derivation-free by the MarginNote contract: it returns a finished string, tone owned upstream.
 *
 *  - `formatHintNote` — the named-hint copy: *"naked single — only 4 fits here"* /
 *    *"hidden single — 7 goes nowhere else in this box"*. The caller passes the display
 *    character (sudoku's hex for 16×16, futoshiki's plain digit), so this stays glyph-agnostic.
 *  - `formatGradeSignature` — the honest difficulty signature: *"singles only"* / *"needs an
 *    X-wing"*, keyed to the hardest technique the deal-time grade needed. This replaces W6's
 *    opaque bucket word ("you asked for medium") ONCE a board is graded; W6's request voice
 *    stays the pre-grade/fallback (a restored permalink, a hand-typed board — no measurement).
 */
import type { HintResult, TechniqueId } from "./techniqueEngine";
import { TECHNIQUE_TIER } from "./techniqueEngine";

/** House-axis → the word the hidden-single copy points with. */
const HOUSE_WORD: Record<string, string> = {
  row: "row",
  col: "column",
  box: "box",
};

/**
 * The named-hint margin copy. `valueChar` is the already-display-mapped glyph (hex A–G at
 * 16×16, a plain digit otherwise) so this never touches the glyph registry.
 */
export function formatHintNote(
  technique: HintResult["technique"],
  valueChar: string,
  houseAxis?: string,
): string {
  switch (technique) {
    case "naked-single":
      return `naked single — only ${valueChar} fits here`;
    case "hidden-single": {
      const where = (houseAxis && HOUSE_WORD[houseAxis]) ?? "house";
      return `hidden single — ${valueChar} goes nowhere else in this ${where}`;
    }
    case "reveal":
      // The unnameable fallback: no one-step deduction places this cell yet, so the hint
      // is honest about revealing rather than reasoning.
      return `no one-step reason — here's ${valueChar}`;
  }
}

/** The hardest-technique phrase, ascending — the measured half of the margin signature. */
const GRADE_PHRASE: Record<TechniqueId, string> = {
  "naked-single": "singles only",
  "hidden-single": "singles only",
  "naked-pair": "needs a naked pair",
  "naked-triple": "needs a naked triple",
  pointing: "needs pointing",
  "box-line": "needs box-line",
  "inequality-forcing": "needs inequality forcing",
  "inequality-chain": "needs an inequality chain",
  "x-wing": "needs an X-wing",
};

/**
 * The honest difficulty signature — the hardest technique the deal-time grade needed.
 * `solved` false means the R1–R3 ladder stalled before completion, so the true difficulty is
 * strictly above anything it could name: say so rather than under-report. An empty string
 * (never graded, or a board that needed no step) means "no signature" — the board falls back
 * to W6's request voice.
 */
export function formatGradeSignature(
  hardestTechnique: TechniqueId | null,
  solved: boolean,
): string {
  if (!solved) return "beyond these techniques";
  return hardestTechnique ? GRADE_PHRASE[hardestTechnique] : "";
}

// ── The displayed-quality tally (T4-W9-B1) ───────────────────────────────────────────────
// The glyph twin of the grade signature: FIVE gate strokes for the engine's five ascending
// tiers — 1 singles · 2 pairs/pointing · 3 X-wing · 4 swordfish/XY-wing · 5 beyond. The
// engine names tiers 1–3 and reports "not solved" past its X-wing ceiling; tier 4 (swordfish/
// XY-wing) is a labelled rung the ladder cannot yet emit, so a graded board inks 1, 2, 3, or 5
// strokes — the count is the tier REACHED (cumulative, magnitude), the name is the EXACT
// hardest step (the precise claim). The whole display gates on `graded`: an ungraded board
// (unsupported size, restored permalink, hand-typed — the engine never ran) inks NOTHING and
// reads the dashed placeholder, never a fabricated tier (ROW 5 honesty spine).

/** Proper display names — the expand/hover label ("hardest step: hidden single"). One home
 *  for the technique vocabulary; the tally never forks a second naming voice. */
const TECHNIQUE_NAME: Record<TechniqueId, string> = {
  "naked-single": "naked single",
  "hidden-single": "hidden single",
  "naked-pair": "naked pair",
  "naked-triple": "naked triple",
  pointing: "pointing",
  "box-line": "box-line",
  "inequality-forcing": "inequality forcing",
  "inequality-chain": "inequality chain",
  "x-wing": "X-wing",
};

/** The proper display name of a technique (the expand/hover label). */
export function formatTechniqueName(technique: TechniqueId): string {
  return TECHNIQUE_NAME[technique];
}

/** The five gate strokes in the tally scale. */
export const TALLY_TOTAL = 5;

/** The measured-difficulty tally, fully derived — the component is a pure renderer of this. */
export interface TallyDescriptor {
  /** Did the engine grade this board (a dealt, supported board)? Gates the whole display. */
  graded: boolean;
  /** Inked gate strokes, 0..TALLY_TOTAL — the tier the hardest step reached (cumulative). */
  filled: number;
  /** Strokes in the scale (always TALLY_TOTAL). */
  total: number;
  /** The exact hardest technique's name, the honest ceiling phrase, or "" when ungraded. */
  name: string;
  /** The expand/hover line — "hardest step: hidden single" / "beyond these techniques" /
   *  "not yet graded". */
  expand: string;
  /** The always-on a11y label for the DIFFICULTY signal (distinct from FILL + CORRECTNESS). */
  ariaLabel: string;
}

/**
 * Derive the tally from the raw grade state. The honesty spine, in one function:
 *  - ungraded → nothing inked, dashed placeholder, "not yet graded" (never a fabricated tier);
 *  - graded but the ladder stalled (`!solved`) → the board needs strictly more than X-wing, so
 *    ink the top stroke and name the ceiling — never fabricate tier 4;
 *  - graded + solved + a named hardest step → ink `TECHNIQUE_TIER[hardest]` strokes, name it;
 *  - graded + solved + no step (a board that arrived complete) → nothing inked, no fake tier.
 * The a11y phrase reuses `formatGradeSignature` so the tally and the margin never drift.
 */
export function describeTally(
  graded: boolean,
  hardestTechnique: TechniqueId | null,
  solved: boolean,
): TallyDescriptor {
  if (!graded) {
    return {
      graded: false,
      filled: 0,
      total: TALLY_TOTAL,
      name: "",
      expand: "not yet graded",
      ariaLabel: "difficulty not yet measured — deal a board to grade it",
    };
  }
  if (!solved) {
    return {
      graded: true,
      filled: TALLY_TOTAL,
      total: TALLY_TOTAL,
      name: "beyond these techniques",
      expand: "beyond these techniques",
      ariaLabel: `difficulty — beyond these techniques (${TALLY_TOTAL} of ${TALLY_TOTAL})`,
    };
  }
  if (hardestTechnique === null) {
    return {
      graded: true,
      filled: 0,
      total: TALLY_TOTAL,
      name: "no step needed",
      expand: "no step needed",
      ariaLabel: "difficulty — no technique needed",
    };
  }
  const filled = TECHNIQUE_TIER[hardestTechnique];
  const name = TECHNIQUE_NAME[hardestTechnique];
  return {
    graded: true,
    filled,
    total: TALLY_TOTAL,
    name,
    expand: `hardest step: ${name}`,
    ariaLabel: `difficulty — ${formatGradeSignature(hardestTechnique, true)} (${filled} of ${TALLY_TOTAL})`,
  };
}
