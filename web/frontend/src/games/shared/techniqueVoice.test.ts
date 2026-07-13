import { describe, it, expect } from "vitest";
import {
  formatHintNote,
  formatGradeSignature,
  formatTechniqueName,
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
  it("singles-only boards read 'singles only' (both single rungs collapse to it)", () => {
    expect(formatGradeSignature("naked-single", true)).toBe("singles only");
    expect(formatGradeSignature("hidden-single", true)).toBe("singles only");
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

describe("formatTechniqueName — the expand/hover proper name", () => {
  it("names every rung, X-wing capitalised", () => {
    expect(formatTechniqueName("naked-single")).toBe("naked single");
    expect(formatTechniqueName("hidden-single")).toBe("hidden single");
    expect(formatTechniqueName("naked-pair")).toBe("naked pair");
    expect(formatTechniqueName("pointing")).toBe("pointing");
    expect(formatTechniqueName("inequality-chain")).toBe("inequality chain");
    expect(formatTechniqueName("x-wing")).toBe("X-wing");
  });
});

describe("describeTally — the honesty spine, in one derivation", () => {
  it("gates the whole display on graded: an ungraded board inks NOTHING (no fabricated tier)", () => {
    const d = describeTally(false, "x-wing", true);
    expect(d.graded).toBe(false);
    expect(d.filled).toBe(0);
    expect(d.total).toBe(TALLY_TOTAL);
    expect(d.name).toBe("");
    expect(d.expand).toBe("not yet graded");
    // Even with a technique argument present, ungraded refuses to render it.
    expect(d.ariaLabel).not.toMatch(/x-wing/i);
  });

  it("singles-only board: 1 inked stroke, 'hardest step: hidden single'", () => {
    const d = describeTally(true, "hidden-single", true);
    expect(d.filled).toBe(1);
    expect(d.name).toBe("hidden single");
    expect(d.expand).toBe("hardest step: hidden single");
    expect(d.ariaLabel).toBe("difficulty — singles only (1 of 5)");
  });

  it("pairs/pointing board: 2 inked strokes", () => {
    expect(describeTally(true, "naked-pair", true).filled).toBe(2);
    expect(describeTally(true, "pointing", true).filled).toBe(2);
    expect(describeTally(true, "inequality-forcing", true).filled).toBe(2);
  });

  it("X-wing board: 3 inked strokes, 'hardest step: X-wing'", () => {
    const d = describeTally(true, "x-wing", true);
    expect(d.filled).toBe(3);
    expect(d.expand).toBe("hardest step: X-wing");
    expect(d.ariaLabel).toBe("difficulty — needs an X-wing (3 of 5)");
  });

  it("inequality-chain (futoshiki tier 3) also inks 3", () => {
    expect(describeTally(true, "inequality-chain", true).filled).toBe(3);
  });

  it("a board the ladder could not finish inks the top stroke and names the honest ceiling — never a fabricated tier 4", () => {
    const d = describeTally(true, "hidden-single", false);
    expect(d.filled).toBe(TALLY_TOTAL);
    expect(d.name).toBe("beyond these techniques");
    expect(d.expand).toBe("beyond these techniques");
  });

  it("a graded board that needed no step inks nothing but stays graded (no fake tier)", () => {
    const d = describeTally(true, null, true);
    expect(d.graded).toBe(true);
    expect(d.filled).toBe(0);
    expect(d.expand).toBe("no step needed");
  });
});
