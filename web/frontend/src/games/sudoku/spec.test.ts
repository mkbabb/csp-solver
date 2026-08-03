/**
 * Sudoku's `GameSpec` acceptance (T5-W2 2.1b) — the PROOF GAME's own row.
 *
 * Three of the five families carried this suite; the two that shipped first did not, which is
 * the shape of the defect the charter's 2.1b names — the games most likely to be edited were
 * the ones with no acceptance on their slots. Same assertion classes as thermo/killer/kenken's,
 * no invented surface: the eight slots carry sudoku's OWN facts, and each member of the seam is
 * pinned against the module the rest of the game already uses.
 *
 * Sudoku is where `clues: null` is asserted as a STATED ABSENCE rather than inferred from a
 * missing field — the null is what makes the shell's overlay branch honest for the four games
 * that do print furniture.
 */
import { describe, it, expect } from "vitest";
import { sudokuSpec } from "./spec";
import DigitCell from "@games/shared/DigitCell.vue";
import { nodeBudgetForSize, persistence } from "./composables/useSudoku";

describe("sudoku — the eight slots (T5-W2 §1)", () => {
  it("declares the boxed grammar with sudoku's OWN render facts", () => {
    expect(sudokuSpec.id).toBe("sudoku");
    expect(sudokuSpec.grammar).toEqual({
      geometry: "boxed",
      noun: "sudoku board",
      requestVoice: true,
      gradeHint: true,
    });
  });

  it("mounts THE cell and THE model, never a per-game twin", () => {
    expect(sudokuSpec.furniture.cell).toBe(DigitCell);
    expect(typeof sudokuSpec.model).toBe("function");
  });

  it("names the ONE node-budget table and the ONE board key", () => {
    // The spec NAMES what the model already reads; a mirrored literal here would be a second
    // source for a fact that has one.
    expect(sudokuSpec.solver.nodeBudget).toBe(nodeBudgetForSize);
    expect(sudokuSpec.solver.nodeBudget(3)).toBe(2_000_000);
    expect(Object.keys(sudokuSpec.solver)).toEqual(["nodeBudget"]);
    expect(sudokuSpec.urlCodec.key).toBe(persistence.key);
    expect(sudokuSpec.urlCodec.key).toBe("sudoku-board-state");
  });

  it("deals off the two shared selector bands", () => {
    expect(sudokuSpec.deal.sizes.map((o) => o.label)).toEqual(["4×4", "9×9", "16×16"]);
    expect(sudokuSpec.deal.difficulty.map((o) => o.value)).toEqual([
      "EASY",
      "MEDIUM",
      "HARD",
    ]);
  });

  it("builds a size + difficulty section over the LIVE model", () => {
    // The since-deleted `SudokuGame.vue` HAND-INLINED this row, because the TDZ cycle made
    // reading it off the declaration throw. The cycle is gone, the slot read lives in
    // `GameShell`, and the eager game reads its own `deal.options` like every other.
    const sections = sudokuSpec.deal.options(sudokuSpec.model());
    expect(sections.map((s) => s.key)).toEqual(["size", "difficulty"]);
  });
});

describe("sudoku — the clue seam's STATED ABSENCE", () => {
  it("declares `clues: null` — a game with no on-board clue glyphs, never a boolean", () => {
    // `null` is the whole assertion: not `undefined` (a slot someone forgot), not `false` (a
    // flag), not an empty object (a seam with nothing in it). The sub-grid ticks sudoku does
    // draw come from `grammar.geometry`, which is why they are not a clue.
    expect(sudokuSpec.clues).toBeNull();
    expect("clues" in sudokuSpec).toBe(true);
  });
});
