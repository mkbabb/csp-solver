import { describe, it, expect } from "vitest";
import { formatHintNote, describeTally, TALLY_TOTAL } from "./techniqueVoice";
import { TECHNIQUE_TIER, type TechniqueId } from "./techniqueEngine";

// The technique layer's marginalia voice (T4-W7, lane E3) — the named-hint copy, and the tally
// descriptor beside it. Pure string formatting; the display char is handed in (glyph-agnostic),
// so these units never touch the glyph registry.
//
// T8-W6 · M16 — THE ROWS ARE INVERTED, BECAUSE THE DEFECT IS NOW THE STRING COMING BACK.
// `formatGradeSignature` and `TECHNIQUE_NAME` published nine solver proper names to the board
// caption and the tally's a11y label; the owner's mark abrogates that register outright. So the
// assertions that used to pin those names in place now pin their ABSENCE, over every id the
// engine can emit rather than over a hand-picked few — the enumeration is what makes the
// absence a claim about the vocabulary instead of about three examples.

/** Every technique the engine can name — the enumeration the absence rows sweep. */
const EVERY_TECHNIQUE = Object.keys(TECHNIQUE_TIER) as TechniqueId[];

/** The solver's own words, as a reader would meet them. */
const JARGON = /naked|hidden single|x-wing|swordfish|pointing|box-line|forcing|chain/i;
/** The banned character, in both its widths, plus the spaced hyphen that poses as one. */
const DASHY = /[—–]| - /;

describe("formatHintNote — what to write, in the reader's words", () => {
  it("a lone candidate says only that, with no technique named", () => {
    expect(formatHintNote("naked-single", "4")).toBe("only 4 fits here");
  });

  it("a value with one home names the house, and nothing about the deduction's class", () => {
    expect(formatHintNote("hidden-single", "7", "box")).toBe(
      "7 goes nowhere else in this box",
    );
    expect(formatHintNote("hidden-single", "3", "row")).toBe(
      "3 goes nowhere else in this row",
    );
    expect(formatHintNote("hidden-single", "5", "col")).toBe(
      "5 goes nowhere else in this column",
    );
  });

  it("takes the display char verbatim (16×16 hex rides through unchanged)", () => {
    expect(formatHintNote("naked-single", "G")).toBe("only G fits here");
  });

  it("the fallback gives the answer and says nothing about its own reasoning", () => {
    expect(formatHintNote("reveal", "2")).toBe("the answer is 2");
  });

  // The purge, asserted rather than remembered: every hint the engine can produce, over both
  // house axes and the unnameable arm, carrying neither the vocabulary nor the character.
  it("no hint carries solver jargon or an em dash, over every arm the engine emits", () => {
    const notes = [
      formatHintNote("reveal", "9"),
      ...(["row", "col", "box", undefined] as const).map((axis) =>
        formatHintNote("hidden-single", "6", axis),
      ),
      formatHintNote("naked-single", "1"),
    ];
    for (const note of notes) {
      expect(note).not.toMatch(JARGON);
      expect(note).not.toMatch(DASHY);
    }
  });
});

describe("describeTally — the honesty spine, in one derivation", () => {
  it("gates the whole display on graded: an ungraded board inks NOTHING (no fabricated tier)", () => {
    const d = describeTally(false, "x-wing", true);
    expect(d.graded).toBe(false);
    expect(d.filled).toBe(0);
    expect(d.total).toBe(TALLY_TOTAL);
    expect(d.ariaLabel).toBe("level not graded yet");
  });

  it("singles board: 1 inked stroke, and the label is the COUNT — never the step", () => {
    // Until T8-W6 this exact string read "difficulty — hidden single (1 of 5)". The magnitude
    // is unchanged and the proper name is gone; the two single rungs read alike now, which is
    // the point rather than a regression — a reader was never owed the distinction.
    const d = describeTally(true, "hidden-single", true);
    expect(d.filled).toBe(1);
    expect(d.ariaLabel).toBe("level 1 of 5");
    expect(describeTally(true, "naked-single", true).ariaLabel).toBe("level 1 of 5");
  });

  it("pairs/pointing board: 2 inked strokes", () => {
    expect(describeTally(true, "naked-pair", true).filled).toBe(2);
    expect(describeTally(true, "pointing", true).filled).toBe(2);
    expect(describeTally(true, "inequality-forcing", true).filled).toBe(2);
  });

  it("X-wing board: 3 inked strokes", () => {
    const d = describeTally(true, "x-wing", true);
    expect(d.filled).toBe(3);
    expect(d.ariaLabel).toBe("level 3 of 5");
  });

  it("inequality-chain (futoshiki tier 3) also inks 3", () => {
    expect(describeTally(true, "inequality-chain", true).filled).toBe(3);
  });

  it("a board the ladder could not finish inks the top stroke — never a fabricated tier 4", () => {
    const d = describeTally(true, "hidden-single", false);
    expect(d.filled).toBe(TALLY_TOTAL);
    expect(d.ariaLabel).toBe("level 5 of 5");
  });

  it("a graded board that needed no step inks nothing but stays graded (no fake tier)", () => {
    const d = describeTally(true, null, true);
    expect(d.graded).toBe(true);
    expect(d.filled).toBe(0);
    expect(d.ariaLabel).toBe("level 0 of 5");
  });

  // The absence, swept over the whole vocabulary and every gating arm — nine techniques × the
  // graded/stalled/ungraded branches, plus the two step-free arms. This is the row that reds if
  // any name finds its way back into the one label the tally speaks.
  it("no label, on any branch, carries solver jargon or an em dash", () => {
    const labels = [
      describeTally(false, null, false).ariaLabel,
      describeTally(true, null, true).ariaLabel,
      ...EVERY_TECHNIQUE.flatMap((t) => [
        describeTally(true, t, true).ariaLabel,
        describeTally(true, t, false).ariaLabel,
        describeTally(false, t, true).ariaLabel,
      ]),
    ];
    expect(labels.length).toBe(2 + EVERY_TECHNIQUE.length * 3);
    for (const label of labels) {
      expect(label).not.toMatch(JARGON);
      expect(label).not.toMatch(DASHY);
      expect(label).toMatch(/^level (not graded yet|\d of \d)$/);
    }
  });
});
