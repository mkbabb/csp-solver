/**
 * The technique layer's marginalia voice (T4-W7, lane E3) — the one prose string the technique
 * engine feeds the margin. Kept out of the engine (which stays pure geometry) and shared by
 * every game so the phrasing never drifts. Derivation-free by the MarginNote contract: it
 * returns a finished string, tone owned upstream.
 *
 *  - `formatHintNote` — what to write, and why, in the reader's own words: *"only 4 fits
 *    here"* / *"7 goes nowhere else in this box"*. The caller passes the display character
 *    (sudoku's hex for 16×16, futoshiki's plain digit), so this stays glyph-agnostic.
 *
 * ── T8-W6 · M16, THE COPY LAW ──────────────────────────────────────────────────────────────
 * The solver's own vocabulary is GONE from every string a reader can reach. `TECHNIQUE_NAME`
 * (nine proper names: "naked single", "X-wing", "box-line", "inequality forcing", …) and
 * `formatGradeSignature`, which published them to the board caption and the tally's a11y label,
 * are deleted rather than reworded: "'a naked single'--what?" is not a phrasing defect, it is a
 * register the product does not get to speak. `TechniqueId` stays what it always was — an
 * ENGINE identifier, never display — and the tally still carries the measurement it earned, as
 * a count out of five, which is the same claim without the jargon. No em dash survives here.
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
      return `only ${valueChar} fits here`;
    case "hidden-single": {
      const where = (houseAxis && HOUSE_WORD[houseAxis]) ?? "house";
      return `${valueChar} goes nowhere else in this ${where}`;
    }
    case "reveal":
      // No one-step deduction places this cell yet, so the hint gives the answer and says
      // nothing about its own reasoning.
      return `the answer is ${valueChar}`;
  }
}

/**
 * ── T8-W6 · M16 — THE TECHNIQUE VOCABULARY LEAVES THE PRODUCT ────────────────────────────
 *
 * `TECHNIQUE_NAME` (the nine proper names) and `formatGradeSignature` (which published them
 * to the board caption and to this file's tally label) stood here. They are DELETED, not
 * reworded: the owner's mark names the exemplar and generalizes it — solver jargon is not a
 * register the product speaks, in ink or in an accessible name. Nothing replaces them at the
 * caption, and the tally's label below carries the same measurement as a plain count.
 *
 * What survives is the ENGINE's own `TechniqueId` and `TECHNIQUE_TIER`, which never faced a
 * reader: the tier is how many strokes the tally inks, and that is the whole of its reach.
 */

// ── The displayed-quality tally (T4-W9-B1) ───────────────────────────────────────────────
// FIVE gate strokes for the engine's five ascending tiers. The ladder reaches tiers 1–3 and
// reports "not solved" past its ceiling; tier 4 is a rung it cannot yet emit, so a graded board
// inks 1, 2, 3, or 5 strokes — the count is the tier REACHED (cumulative, magnitude). Since
// T8-W6 the count is ALSO the whole claim: the exact hardest step is the engine's business and
// no reader's. The display gates on `graded`: an ungraded board (unsupported size, restored
// permalink, hand-typed — the engine never ran) inks NOTHING and reads the dashed placeholder,
// never a fabricated tier (ROW 5 honesty spine).

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
   *  T8-W6 M16: it is the COUNT, and only the count — `difficulty 3 of 5`. It used to name the
   *  hardest technique, which put the solver's vocabulary into an accessible name, where a
   *  reader has even less recourse than at the caption. The number is the measurement; the
   *  name was the register. */
  ariaLabel: string;
}

/**
 * `name` AND `expand` ARE GONE, and their own trigger is what retired them.
 *
 * They were kept through pass 5 with the reason written at their renderer: "the restoration
 * cost of options (b) and (c)" — the two ways the exact step might have been given a visible
 * surface. Option (c) LANDED at T5-W4 pass 6 (the margin signature named the step), so no
 * option was left to restore, and the trigger's own words were "if the exact step gets its
 * surface, `name`, `expand` and the five rows retire in that same change". That was the change.
 * T8-W6 then retired the signature itself under M16, which closes the row from the other end:
 * there is no surface for the exact step, because the step is not the product's to name. The
 * retirement stands on either reason.
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
 *  - ungraded → nothing inked, dashed placeholder, "not graded yet" (never a fabricated tier);
 *  - graded but the ladder stalled (`!solved`) → the board needs strictly more than the
 *    engine's ceiling, so ink the top stroke — never fabricate tier 4;
 *  - graded + solved + a hardest step → ink `TECHNIQUE_TIER[hardest]` strokes;
 *  - graded + solved + no step (a board that arrived complete) → nothing inked, no fake tier.
 * T8-W6 M16: every branch says the SAME thing in the same shape — a count out of five — so
 * there is one sentence to read and no vocabulary to learn. The stalled board tops out at 5 of
 * 5, which is the honest reading of "strictly more than we can name" and reports no more than
 * the strokes already do.
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
      ariaLabel: "difficulty not graded yet",
    };
  }
  const filled = !solved
    ? TALLY_TOTAL
    : hardestTechnique === null
      ? 0
      : TECHNIQUE_TIER[hardestTechnique];
  return {
    graded: true,
    filled,
    total: TALLY_TOTAL,
    ariaLabel: `difficulty ${filled} of ${TALLY_TOTAL}`,
  };
}
