import { describe, it, expect } from "vitest";
import { formatHintNote, formatGradeSignature } from "./techniqueVoice";

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
