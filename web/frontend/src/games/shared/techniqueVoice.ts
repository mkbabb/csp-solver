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
