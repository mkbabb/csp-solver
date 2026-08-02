/**
 * The clue seam's acceptance proof (T5-W2 F2) — Futoshiki's whole divergence from a plain
 * Latin square, pinned.
 *
 * These four behaviours had no test before: they lived inside `FutoshikiBoard`'s script
 * block, reachable only by mounting a board, and the poster carried a hand-copy of the first
 * one that nothing compared against. They are pure functions now, so the geometry the
 * overlay draws, the clauses AT reads, the pairs the teacher's red pencil circles, and the
 * shape the worker receives are each asserted directly — and the poster's carets are the
 * same figures by construction, not by inspection.
 */
import { describe, it, expect } from "vitest";
import {
  caretFigures,
  constraintLabels,
  inequalityViolations,
  encodeInequalities,
  decodeInequalities,
  futoshikiClue,
} from "./clue";
import type { Inequality } from "./types";

// A 5×5 board. Positions are row-major: 0..4 is the top row, 5 sits under 0.
const N = 5;
const CELL = 100 / N; // one cell as a percentage of the board box

describe("caret figures — a mark on the shared edge, opening toward the greater value", () => {
  it("puts a horizontal pair's caret on the column boundary, mid-row", () => {
    // 0 > 1: adjacent in the top row, greater on the LEFT.
    const [c] = caretFigures([[0, 1]], N);
    expect(c.glyph).toBe(">");
    expect(c.rotation).toBe(0);
    expect(c.leftPct).toBeCloseTo(CELL); // the boundary between col 0 and col 1
    expect(c.topPct).toBeCloseTo(CELL * 0.5); // the middle of row 0
    expect(c.sizePct).toBeCloseTo(CELL * 0.5);
  });

  it("flips the mark, not the place, when the greater cell is on the right", () => {
    const [greaterLeft] = caretFigures([[0, 1]], N);
    const [greaterRight] = caretFigures([[1, 0]], N);
    expect(greaterRight.glyph).toBe("<");
    // Same edge — a caret belongs to the PAIR, so the pair's order changes only the mark.
    expect(greaterRight.leftPct).toBeCloseTo(greaterLeft.leftPct);
    expect(greaterRight.topPct).toBeCloseTo(greaterLeft.topPct);
  });

  it("rotates the one `>` glyph for a vertical pair, both ways", () => {
    // 0 > 5: greater on TOP → ∨ (+90). 5 > 0: greater on the bottom → ∧ (−90).
    const [down] = caretFigures([[0, 5]], N);
    const [up] = caretFigures([[5, 0]], N);
    expect(down.rotation).toBe(90);
    expect(up.rotation).toBe(-90);
    // Both sit on the row boundary between them, centred on the shared column.
    for (const c of [down, up]) {
      expect(c.glyph).toBe(">"); // the four-way vocabulary reuses two drawn marks
      expect(c.topPct).toBeCloseTo(CELL);
      expect(c.leftPct).toBeCloseTo(CELL * 0.5);
    }
  });

  it("scales with the board and keys every caret distinctly", () => {
    const pairs: Inequality[] = [
      [0, 1],
      [1, 2],
      [0, 4],
    ];
    const four = caretFigures(pairs, 4);
    expect(four[0].sizePct).toBeCloseTo((100 / 4) * 0.5);
    expect(new Set(four.map((c) => c.key)).size).toBe(pairs.length);
    // The variant hash separates neighbours, so adjacent carets never draw the same stroke.
    expect(new Set(four.map((c) => c.hash)).size).toBe(pairs.length);
  });

  it("prints nothing for a board with no printed furniture", () => {
    expect(caretFigures([], N)).toEqual([]);
  });
});

describe("constraint labels — the clue folded into both endpoints' accessible names", () => {
  it("reads the same constraint from each side, in that cell's own direction", () => {
    const labels = constraintLabels([[0, 1]], N);
    expect(labels.get(0)).toBe("greater than the cell to the right");
    expect(labels.get(1)).toBe("less than the cell to the left");
  });

  it("names the vertical directions off the board size, not off a guess", () => {
    const labels = constraintLabels([[0, 5]], N);
    expect(labels.get(0)).toBe("greater than the cell below");
    expect(labels.get(5)).toBe("less than the cell above");
  });

  it("joins both clauses on a cell two carets touch", () => {
    const labels = constraintLabels(
      [
        [6, 5],
        [6, 1],
      ],
      N,
    );
    expect(labels.get(6)).toBe(
      "greater than the cell to the left and greater than the cell above",
    );
    // A cell no caret touches carries no clause — its name is the bare cell name.
    expect(labels.has(2)).toBe(false);
  });
});

describe("inequality violations — the extra the red pencil circles", () => {
  const flag = (inequalities: Inequality[], values: Record<string, number>) => {
    const hit: number[] = [];
    inequalityViolations(inequalities)(values, (pos) => hit.push(pos));
    return hit.sort((a, b) => a - b);
  };

  it("circles BOTH endpoints when the printed `>` doesn't hold", () => {
    expect(flag([[0, 1]], { "0": 2, "1": 5 })).toEqual([0, 1]);
    expect(flag([[0, 1]], { "0": 3, "1": 3 })).toEqual([0, 1]); // equal breaks a strict `>`
  });

  it("says nothing about a satisfied pair", () => {
    expect(flag([[0, 1]], { "0": 5, "1": 2 })).toEqual([]);
  });

  it("waits for both endpoints — an unfilled cell is not yet wrong", () => {
    expect(flag([[0, 1]], { "0": 1 })).toEqual([]);
    expect(flag([[0, 1]], { "1": 9 })).toEqual([]);
    expect(flag([[0, 1]], {})).toEqual([]);
  });
});

describe("the wire head — one pair of functions for the worker and the seam", () => {
  it("round-trips the printed furniture through a flat buffer", () => {
    const pairs: Inequality[] = [
      [0, 1],
      [7, 6],
      [5, 10],
    ];
    const flat = encodeInequalities(pairs);
    expect(flat).toBeInstanceOf(Uint32Array);
    expect(flat.length).toBe(pairs.length * 2);
    expect(Array.from(flat)).toEqual([0, 1, 7, 6, 5, 10]);
    expect(decodeInequalities(flat)).toEqual(pairs);
  });

  it("carries an empty furniture set as an empty buffer, not as an absence", () => {
    expect(encodeInequalities([]).length).toBe(0);
    expect(decodeInequalities(new Uint32Array())).toEqual([]);
  });

  it("drops a trailing half-pair rather than inventing an endpoint", () => {
    expect(decodeInequalities(new Uint32Array([3, 4, 9]))).toEqual([[3, 4]]);
  });

  // The codec pair `spec.clues` spreads and the pair the solver client is handed are the SAME
  // functions, by identity — not two homes that agree today. `games/shared`'s own parity unit
  // stubs its codecs (it may not import a game), so this identity is where the real pair meets
  // the real seam.
  it("is the ONE pair the spec spreads and the solver client is handed", () => {
    expect(futoshikiClue.encode).toBe(encodeInequalities);
    expect(futoshikiClue.decode).toBe(decodeInequalities);
  });
});
