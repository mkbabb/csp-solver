import { describe, it, expect } from "vitest";
import {
  formatHintNote,
  formatGradeSignature,
  describeTally,
  TALLY_TOTAL,
} from "./techniqueVoice";

// The technique layer's marginalia voice (T4-W7, lane E3) — the named-hint copy and the honest
// grade signature. Pure string formatting over the engine's own vocabulary; the display char is
// handed in (glyph-agnostic), so these units never touch the glyph registry.

describe("formatHintNote — the named-hint margin copy", () => {
  it("naked single points at the cell: 'only V fits here'", () => {
    expect(formatHintNote("naked-single", "4")).toBe("naked single — only 4 fits here");
  });

  it("hidden single names the house the argument turns on", () => {
    expect(formatHintNote("hidden-single", "7", "box")).toBe(
      "hidden single — 7 goes nowhere else in this box",
    );
    expect(formatHintNote("hidden-single", "3", "row")).toBe(
      "hidden single — 3 goes nowhere else in this row",
    );
    expect(formatHintNote("hidden-single", "5", "col")).toBe(
      "hidden single — 5 goes nowhere else in this column",
    );
  });

  it("takes the display char verbatim (16×16 hex rides through unchanged)", () => {
    expect(formatHintNote("naked-single", "G")).toBe("naked single — only G fits here");
  });

  it("the unnameable fallback is honest about revealing, not reasoning", () => {
    expect(formatHintNote("reveal", "2")).toBe("no one-step reason — here's 2");
  });
});

describe("formatGradeSignature — the honest difficulty signature", () => {
  // T5-W4 pass 6 (dt-name) — THE ROW THAT PINNED THE DEFECT, INVERTED. It used to assert that
  // "both single rungs collapse to it", which is precisely the collapse pass 5 measured as the
  // whole of F3-G3: two different techniques arriving at one sentence, on the only surface that
  // prints the difficulty. The signature names the step now, so the row asserts they are TOLD
  // APART — and it is written as an inequality as well as two equalities, because the equalities
  // alone would still pass if both strings changed to the same new word.
  it("the two single rungs are NAMED, and named apart", () => {
    expect(formatGradeSignature("naked-single", true)).toBe("needs a naked single");
    expect(formatGradeSignature("hidden-single", true)).toBe("needs a hidden single");
    expect(formatGradeSignature("naked-single", true)).not.toBe(
      formatGradeSignature("hidden-single", true),
    );
  });

  // The other seven come out BYTE-IDENTICAL to the table they replace, which is the control on
  // the composition: an article map plus one vocabulary must reproduce the phrases that were
  // written by hand, or the cure moved more voice than it was licensed to.
  it("every other rung is byte-identical to the retired phrase table", () => {
    expect(formatGradeSignature("naked-pair", true)).toBe("needs a naked pair");
    expect(formatGradeSignature("naked-triple", true)).toBe("needs a naked triple");
    expect(formatGradeSignature("box-line", true)).toBe("needs box-line");
  });

  it("names the hardest technique for graded intermediate/advanced boards", () => {
    expect(formatGradeSignature("naked-pair", true)).toBe("needs a naked pair");
    expect(formatGradeSignature("pointing", true)).toBe("needs pointing");
    expect(formatGradeSignature("x-wing", true)).toBe("needs an X-wing");
    expect(formatGradeSignature("inequality-forcing", true)).toBe(
      "needs inequality forcing",
    );
    expect(formatGradeSignature("inequality-chain", true)).toBe(
      "needs an inequality chain",
    );
  });

  it("a board the R1–R3 ladder could not finish is 'beyond these techniques' (never under-reported)", () => {
    // hardest reached is only a single, but the ladder stalled — the true difficulty is above it.
    expect(formatGradeSignature("hidden-single", false)).toBe(
      "beyond these techniques",
    );
    expect(formatGradeSignature(null, false)).toBe("beyond these techniques");
  });

  it("no signature (empty string) for a graded board that needed no step — falls back to the request voice", () => {
    expect(formatGradeSignature(null, true)).toBe("");
  });
});

// `formatTechniqueName` is retired with `TallyDescriptor.name`/`.expand` (pass 6, dt-name):
// it was the accessor for a field with no renderer, and its vocabulary is now read directly by
// the one surface that names a technique. The rows that pinned its output live on above, in
// `formatGradeSignature` — every proper name it published is still asserted, inside the
// sentence that actually reaches a reader.

describe("describeTally — the honesty spine, in one derivation", () => {
  it("gates the whole display on graded: an ungraded board inks NOTHING (no fabricated tier)", () => {
    const d = describeTally(false, "x-wing", true);
    expect(d.graded).toBe(false);
    expect(d.filled).toBe(0);
    expect(d.total).toBe(TALLY_TOTAL);
    // Even with a technique argument present, ungraded refuses to render it.
    expect(d.ariaLabel).not.toMatch(/x-wing/i);
  });

  it("singles board: 1 inked stroke, and the a11y label NAMES the step", () => {
    // The label is the tally's only voice, and until pass 6 it spoke the bucket: this exact
    // string read "difficulty — singles only (1 of 5)" for naked-single and hidden-single
    // alike. The count is still magnitude; the name is now the precise claim it always said
    // it was.
    const d = describeTally(true, "hidden-single", true);
    expect(d.filled).toBe(1);
    expect(d.ariaLabel).toBe("difficulty — needs a hidden single (1 of 5)");
    expect(describeTally(true, "naked-single", true).ariaLabel).toBe(
      "difficulty — needs a naked single (1 of 5)",
    );
  });

  it("pairs/pointing board: 2 inked strokes", () => {
    expect(describeTally(true, "naked-pair", true).filled).toBe(2);
    expect(describeTally(true, "pointing", true).filled).toBe(2);
    expect(describeTally(true, "inequality-forcing", true).filled).toBe(2);
  });

  it("X-wing board: 3 inked strokes, and the label is unmoved", () => {
    const d = describeTally(true, "x-wing", true);
    expect(d.filled).toBe(3);
    expect(d.ariaLabel).toBe("difficulty — needs an X-wing (3 of 5)");
  });

  it("inequality-chain (futoshiki tier 3) also inks 3", () => {
    expect(describeTally(true, "inequality-chain", true).filled).toBe(3);
  });

  it("a board the ladder could not finish inks the top stroke and names the honest ceiling — never a fabricated tier 4", () => {
    const d = describeTally(true, "hidden-single", false);
    expect(d.filled).toBe(TALLY_TOTAL);
    expect(d.ariaLabel).toBe("difficulty — beyond these techniques (5 of 5)");
  });

  it("a graded board that needed no step inks nothing but stays graded (no fake tier)", () => {
    const d = describeTally(true, null, true);
    expect(d.graded).toBe(true);
    expect(d.filled).toBe(0);
    expect(d.ariaLabel).toBe("difficulty — no technique needed");
  });
});
