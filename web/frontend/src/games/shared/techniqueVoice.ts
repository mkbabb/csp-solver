/**
 * The technique layer's marginalia voice (T4-W7, lane E3) — the two prose strings the
 * technique engine feeds the margin. Kept out of the engine (which stays pure geometry) and
 * shared by both games so the phrasing never drifts (SudokuBoard/FutoshikiBoard both call it).
 * Derivation-free by the MarginNote contract: it returns a finished string, tone owned upstream.
 *
 *  - `formatHintNote` — the named-hint copy: *"naked single — only 4 fits here"* /
 *    *"hidden single — 7 goes nowhere else in this box"*. The caller passes the display
 *    character (sudoku's hex for 16×16, futoshiki's plain digit), so this stays glyph-agnostic.
 *  - `formatGradeSignature` — the honest difficulty signature: *"needs a hidden single"* /
 *    *"needs an X-wing"*, keyed to the hardest technique the deal-time grade needed and NAMING
 *    it (T5-W4 pass 6, dt-name: it used to bucket the tier, so two techniques shared one
 *    sentence — see the disposition below). This replaces W6's opaque bucket word ("you asked
 *    for medium") ONCE a board is graded; W6's request voice stays the pre-grade/fallback (a
 *    restored permalink, a hand-typed board — no measurement).
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

/** THE technique vocabulary — one home, and now one home only. Every surface that names a
 *  technique reads this table: the margin's difficulty signature (`formatGradeSignature`
 *  above composes it with an article) and the tally's a11y label through it. The parallel
 *  bucket table that used to sit beside it is what pass 5's F3-G3 was about, and it is gone. */
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

/**
 * ── T5-W4 PASS 6 · dt-name, DISPOSED — THE ESTATE STOPS RUNNING TWO VOCABULARIES ──────────
 *
 * There was a `GRADE_PHRASE` table here, and its first two rows both read "singles only".
 * That is the whole of pass 5's F3-G3: the estate spoke the difficulty in TIER BUCKETS while
 * `TECHNIQUE_NAME` (above) held the exact step, and the two never met — so naked-single and
 * hidden-single were indistinguishable everywhere a reader could look, in ink and in the
 * a11y label alike, and pass 4's claim that the exact step "still names itself at every width"
 * was true of no surface at all (measured: zero visible text nodes, zero aria-labels).
 *
 * The adjudicator's ruling was to route the REAL name to an EXISTING visible surface at zero
 * new chrome. The surface was already there and already drawn on every deal: the margin's own
 * reserved line, which prints `a fresh 9×9 — <signature>`. So the signature names the step.
 *
 * And the table goes with it, which is the part worth having. A second vocabulary is what
 * produced the defect; keeping it in sync would only have deferred the next one. The phrase is
 * now COMPOSED from `TECHNIQUE_NAME` — one vocabulary, one home — with the only thing the
 * frame actually needed that a name cannot carry: the article. Seven of the nine phrases come
 * out byte-identical to the table they replace; the two that change are exactly the two the
 * bucket conflated ("singles only" → "needs a naked single" / "needs a hidden single").
 *
 * The register question F3 handed up is answered by the frame, not by the jargon: "needs a
 * hidden single" is the same plain-spoken sentence the other seven tiers have always said.
 */
const TECHNIQUE_ARTICLE: Record<TechniqueId, string> = {
  "naked-single": "a ",
  "hidden-single": "a ",
  "naked-pair": "a ",
  "naked-triple": "a ",
  pointing: "",
  "box-line": "",
  "inequality-forcing": "",
  "inequality-chain": "an ",
  "x-wing": "an ",
};

/**
 * The honest difficulty signature — the hardest technique the deal-time grade needed, NAMED.
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
  if (!hardestTechnique) return "";
  return `needs ${TECHNIQUE_ARTICLE[hardestTechnique]}${TECHNIQUE_NAME[hardestTechnique]}`;
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
  /** The always-on a11y label for the DIFFICULTY signal (distinct from FILL + CORRECTNESS).
   *  It carries the EXACT hardest step now, through `formatGradeSignature`, which is the
   *  other half of the dt-name disposition: `difficulty — needs a hidden single (1 of 5)`
   *  where it used to read `singles only` for two different techniques. */
  ariaLabel: string;
}

/**
 * `name` AND `expand` ARE GONE, and their own trigger is what retired them.
 *
 * They were kept through pass 5 with the reason written at their renderer: "the restoration
 * cost of options (b) and (c)" — the two ways the exact step might have been given a visible
 * surface. Option (c) has now LANDED (the margin signature names the step, above), so there is
 * no option left to restore, and the trigger's own words were "if the exact step gets its
 * surface, `name`, `expand` and the five rows retire in that same change". This is that change.
 *
 * The alternatives, priced, in one paragraph, because a deletion should record what it closed:
 * (a) RESTORE THE HOVER REVEAL — measured and rejected on arithmetic, verb→receipt clearance
 * +7.53 → −103.53px at the 1440 rail, both engines: the name lies across Deal, and it is a
 * hover grammar besides, so it was never a route on the phone the campaign is about.
 * (b) A SECOND PERMANENT LINE under the tally — ≈17px per card at the body rung, at every
 * width, spending the exact currency the covis row was short of. (c) THE MARGIN VOICE, taken:
 * zero new pixels, a composition change at one call site, on a line already reserved, already
 * drawn and already read on every deal. (d) TAP-TO-REVEAL on the tally — a new interactive
 * control on a `role="img"` graphic, which is the tab stop a11y r1 L12 had just retired, with
 * a gesture on it. (c) is the only one that charges nothing and adds no standing surface.
 */

/**
 * Derive the tally from the raw grade state. The honesty spine, in one function:
 *  - ungraded → nothing inked, dashed placeholder, "not yet graded" (never a fabricated tier);
 *  - graded but the ladder stalled (`!solved`) → the board needs strictly more than X-wing, so
 *    ink the top stroke and name the ceiling — never fabricate tier 4;
 *  - graded + solved + a named hardest step → ink `TECHNIQUE_TIER[hardest]` strokes, name it;
 *  - graded + solved + no step (a board that arrived complete) → nothing inked, no fake tier.
 * The a11y phrase reuses `formatGradeSignature`, so the tally and the margin cannot drift —
 * and since pass 6 that phrase carries the exact step rather than the tier bucket, which is
 * where two different techniques used to arrive at one sentence.
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
      ariaLabel: "difficulty not yet measured — deal a board to grade it",
    };
  }
  if (!solved) {
    return {
      graded: true,
      filled: TALLY_TOTAL,
      total: TALLY_TOTAL,
      ariaLabel: `difficulty — beyond these techniques (${TALLY_TOTAL} of ${TALLY_TOTAL})`,
    };
  }
  if (hardestTechnique === null) {
    return {
      graded: true,
      filled: 0,
      total: TALLY_TOTAL,
      ariaLabel: "difficulty — no technique needed",
    };
  }
  const filled = TECHNIQUE_TIER[hardestTechnique];
  return {
    graded: true,
    filled,
    total: TALLY_TOTAL,
    ariaLabel: `difficulty — ${formatGradeSignature(hardestTechnique, true)} (${filled} of ${TALLY_TOTAL})`,
  };
}
