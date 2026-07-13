import { describe, it, expect } from "vitest";
import {
  gradeSudoku,
  fillForcedSudoku,
  hintSudoku,
  createSudokuAdapter,
  sudokuHouses,
} from "./sudokuTechnique";
import { popcount, findStep } from "@games/shared/techniqueEngine";
import { TEMPLATE_BANK } from "../data/templates";

// The sudoku ladder (T4-W7) end-to-end, over the SELF-COMPUTED basic-elimination substrate.
// Fixtures were synthesized offline against this very engine + a brute-force oracle: the
// singles board is dug to stay singles-solvable; the X-wing board is a minimal-unique board
// that fully solves iff the X-wing rung fires (verified `!solvesWithoutXWing`). Both are real
// 9×9 puzzles with a unique solution.

// A gentle 9×9 solvable by naked/hidden singles alone (honest grade: tier 1). 0 = empty.
const SINGLES_BOARD = [
  8, 7, 6, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 2, 0, 0, 5, 8, 0, 0, 3,
  4, 0, 1, 0, 8, 0, 0, 2, 1, 0, 0, 6, 9, 0, 0, 0, 0, 0, 0, 3, 0, 5, 0, 7, 0, 0, 0, 0, 0,
  0, 0, 6, 0, 0, 0, 4, 0, 0, 7, 6, 9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 4, 0,
];

// A hard 9×9 whose solve REQUIRES an X-wing on value-7 (honest grade: tier 3). Removing the
// X-wing rung strands the ladder before completion — this is a genuine X-wing gate.
const XWING_BOARD = [
  2, 0, 0, 0, 6, 0, 0, 1, 0, 1, 8, 0, 0, 4, 0, 7, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0,
  5, 0, 0, 0, 1, 2, 0, 6, 7, 0, 9, 2, 0, 4, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 0, 8, 0, 0, 0, 0, 5, 3, 0, 0, 0, 1, 0, 6, 7, 0,
];
const XWING_SOLUTION = [
  2, 5, 4, 7, 6, 9, 8, 1, 3, 1, 8, 6, 5, 4, 3, 7, 9, 2, 7, 3, 9, 1, 8, 2, 5, 4, 6, 8, 4,
  5, 6, 3, 7, 1, 2, 9, 6, 7, 3, 9, 2, 1, 4, 5, 8, 9, 1, 2, 4, 5, 8, 3, 6, 7, 5, 6, 7, 3,
  9, 4, 2, 8, 1, 4, 2, 1, 8, 7, 6, 9, 3, 5, 3, 9, 8, 2, 1, 5, 6, 7, 4,
];

describe("the sudoku ladder grades by hardest-technique-required", () => {
  it("a singles-only board grades tier 1 and solves", () => {
    const grade = gradeSudoku(SINGLES_BOARD, 3);
    expect(grade.solved).toBe(true);
    expect(grade.tier).toBe(1);
    expect(
      grade.hardestTechnique === "naked-single" ||
        grade.hardestTechnique === "hidden-single",
    ).toBe(true);
  });

  it("an X-wing board grades tier 3 with X-wing as the hardest technique", () => {
    const grade = gradeSudoku(XWING_BOARD, 3);
    expect(grade.solved).toBe(true);
    expect(grade.tier).toBe(3);
    expect(grade.hardestTechnique).toBe("x-wing");
    expect(grade.values).toEqual(XWING_SOLUTION);
  });

  it("accepts the composables' row-major record shape too", () => {
    const record: Record<string, number> = {};
    XWING_BOARD.forEach((v, i) => (record[String(i)] = v));
    expect(gradeSudoku(record, 3).tier).toBe(3);
  });
});

describe("the corrupted-substrate tripwire (r3 KILL-LIST #3) — permanent", () => {
  // The load-bearing invariant: the engine grades over SELF-COMPUTED basic candidates, never
  // over propagateBoard's post-full-GAC masks. GAC over-prunes — at full strength a served
  // board collapses to all-singleton domains (sudoku.rs:186-188), so every empty cell reads
  // as a naked single and the grade collapses to tier-1. This board grades tier-3 honestly;
  // if the engine ever read the GAC substrate it would grade tier-1. The two substrates MUST
  // differ, and this test fails the instant a rung starts reading the GAC masks.
  const adapter = createSudokuAdapter(3);
  const selfComputed = adapter.computeCandidates(XWING_BOARD);

  // Model propagateBoard's GAC collapse: a uniquely-solvable board's full-GAC fixpoint pins
  // every empty cell to a singleton — its solution value (sudoku.rs:186-188). Filled cells: 0.
  const gacCollapsed = new Uint32Array(81);
  for (let c = 0; c < 81; c++)
    gacCollapsed[c] = XWING_BOARD[c] !== 0 ? 0 : 1 << XWING_SOLUTION[c];

  it("self-computed candidates are NOT equal to the GAC-collapsed masks", () => {
    expect(selfComputed).not.toEqual(gacCollapsed);
  });

  it("GAC over-prunes past the human sequence: cells self-computed as ambiguous, GAC as singletons", () => {
    let overpruned = 0;
    let allGacSingleton = true;
    for (let c = 0; c < 81; c++) {
      if (XWING_BOARD[c] !== 0) continue; // only the empty cells the human still reasons over
      if (popcount(gacCollapsed[c]) !== 1) allGacSingleton = false;
      if (popcount(selfComputed[c]) >= 2 && popcount(gacCollapsed[c]) === 1)
        overpruned++;
    }
    expect(allGacSingleton).toBe(true); // GAC left every empty cell a singleton
    expect(overpruned).toBeGreaterThan(0); // basic elimination did not — the substrate diverges
  });

  it("the substrate choice is load-bearing: self-computed grades tier-3, GAC-collapsed collapses to tier-1", () => {
    // Honest grade over the self-computed substrate: this board needs an X-wing.
    expect(gradeSudoku(XWING_BOARD, 3).tier).toBe(3);
    // Had the engine read the GAC masks, the cheapest step on the untouched board is already a
    // naked single — every empty cell is a singleton — so the grade would collapse to tier-1.
    const gacStep = findStep({
      n: adapter.n,
      candidates: gacCollapsed,
      houses: adapter.houses,
    });
    expect(gacStep!.technique).toBe("naked-single");
    expect(gacStep!.tier).toBe(1);
  });
});

describe("fill-all-forced (W7 owns the detector; W8 wires the button)", () => {
  it("fills exactly the current naked+hidden singles in one sweep, correct and on empty cells", () => {
    const solution = gradeSudoku(SINGLES_BOARD, 3).values; // the singles board solves fully
    const { placements } = fillForcedSudoku(SINGLES_BOARD, 3);

    expect(placements.length).toBeGreaterThan(0);
    expect(placements.every((p) => SINGLES_BOARD[p.cell] === 0)).toBe(true); // never a given
    expect(placements.every((p) => p.value === solution[p.cell])).toBe(true); // never wrong
    expect(
      placements.every(
        (p) => p.technique === "naked-single" || p.technique === "hidden-single",
      ),
    ).toBe(true);

    // "exactly the forced cells": the placed set equals the set of cells that are a naked or
    // hidden single on the original board (an independent re-derivation from the candidates).
    const forced = forcedCellSet(SINGLES_BOARD);
    expect(new Set(placements.map((p) => p.cell))).toEqual(forced);
  });

  it("one sweep, no cascade: it stops with cells still empty, and a second sweep makes more progress", () => {
    const first = fillForcedSudoku(SINGLES_BOARD, 3);
    expect(first.values.some((v) => v === 0)).toBe(true); // did NOT solve the whole board
    const second = fillForcedSudoku(first.values, 3);
    expect(second.placements.length).toBeGreaterThan(0); // cells forced only AFTER the first sweep
  });

  it("fills nothing when no cell is forced", () => {
    // A deadly rectangle: cells (r0c2,r0c4,r1c2,r1c4) hold the swap 4/6/6/4, spanning two
    // boxes. Blank all four and each can take either 4 or 6 — no naked or hidden single
    // remains, so the sweep must place NOTHING.
    const board = XWING_SOLUTION.slice();
    for (const cell of [2, 4, 11, 13]) board[cell] = 0;
    const { placements, values } = fillForcedSudoku(board, 3);
    expect(placements).toEqual([]);
    expect(values).toEqual(board); // board untouched
  });
});

describe("hintSudoku — the cheapest named single (lane E3, the two-press hint's first press)", () => {
  const solution = gradeSudoku(SINGLES_BOARD, 3).values; // the singles board solves fully

  it("names a single on an empty cell, carrying the true forced value + becauseCells", () => {
    const hint = hintSudoku(SINGLES_BOARD, 3);
    expect(hint).not.toBeNull();
    expect(["naked-single", "hidden-single"]).toContain(hint!.technique);
    expect(SINGLES_BOARD[hint!.cell]).toBe(0); // never a given/filled cell
    expect(hint!.value).toBe(solution[hint!.cell]); // the forced value IS the answer
    expect(hint!.becauseCells.length).toBeGreaterThan(0);
  });

  it("a naked single cites just its cell; a hidden single cites its house + axis", () => {
    const hint = hintSudoku(SINGLES_BOARD, 3)!;
    if (hint.technique === "naked-single") {
      expect(hint.becauseCells).toEqual([hint.cell]);
      expect(hint.houseAxis).toBeUndefined();
    } else {
      expect(hint.becauseCells).toContain(hint.cell);
      expect(["row", "col", "box"]).toContain(hint.houseAxis);
    }
  });

  it("prefers the focused cell when it is itself a forced single", () => {
    const cands = createSudokuAdapter(3).computeCandidates(SINGLES_BOARD);
    const forced = SINGLES_BOARD.findIndex(
      (v, i) => v === 0 && popcount(cands[i]) === 1,
    );
    expect(forced).toBeGreaterThanOrEqual(0); // the fixture has at least one
    const hint = hintSudoku(SINGLES_BOARD, 3, forced)!;
    expect(hint.cell).toBe(forced);
    expect(hint.technique).toBe("naked-single");
    expect(hint.value).toBe(solution[forced]);
  });

  it("returns null when the board affords no single (the answer-key-reveal fallback case)", () => {
    expect(hintSudoku(new Array(81).fill(0), 3)).toBeNull();
  });

  it("accepts the composables' row-major record shape too", () => {
    const record: Record<string, number> = {};
    SINGLES_BOARD.forEach((v, i) => (record[String(i)] = v));
    const hint = hintSudoku(record, 3);
    expect(hint).not.toBeNull();
    expect(hint!.value).toBe(solution[hint!.cell]);
  });
});

describe("deal-time grade latency on the live-dug 9×9 path", () => {
  it("grades the dealt 9×9 hard bank well within a frame", () => {
    const boards = TEMPLATE_BANK[3].hard; // 20 real dug 9×9 puzzles (the deal-time input)
    expect(boards.length).toBeGreaterThan(0);

    const ITERS = 20;
    let total = 0;
    let worst = 0;
    for (let i = 0; i < ITERS; i++) {
      for (const board of boards) {
        const t0 = performance.now();
        gradeSudoku(board, 3);
        const dt = performance.now() - t0;
        total += dt;
        if (dt > worst) worst = dt;
      }
    }
    const mean = total / (ITERS * boards.length);
    // Reported in the wave figures; the bound is generous (deal-time grade is pure TS, no
    // search, no wasm) so the test documents latency without flaking on a loaded CI box.
    console.info(
      `[T4-W7] deal-time grade latency (9×9 hard, n=${ITERS * boards.length}): mean ${mean.toFixed(3)}ms, worst ${worst.toFixed(3)}ms`,
    );
    expect(mean).toBeLessThan(50);
  });
});

describe("sudoku house geometry", () => {
  it("builds 3·side houses (rows + cols + boxes), axis-tagged, covering every cell side times", () => {
    const houses = sudokuHouses(3);
    expect(houses.length).toBe(27);
    expect(houses.filter((h) => h.axis === "row").length).toBe(9);
    expect(houses.filter((h) => h.axis === "col").length).toBe(9);
    expect(houses.filter((h) => h.axis === "box").length).toBe(9);
    expect(houses.every((h) => h.cells.length === 9)).toBe(true);
    // box 0 is the top-left 3×3 block.
    expect(houses.find((h) => h.axis === "box")!.cells).toEqual([
      0, 1, 2, 9, 10, 11, 18, 19, 20,
    ]);
  });
});

// ── test-local helpers ──────────────────────────────────────────────────────────────────

/** The set of cells that are a naked or hidden single on `board`'s basic candidates —
 *  an independent re-derivation of "forced", for the fill-all-forced precision check. */
function forcedCellSet(board: number[]): Set<number> {
  const adapter = createSudokuAdapter(3);
  const cands = adapter.computeCandidates(board);
  const set = new Set<number>();
  for (let c = 0; c < cands.length; c++)
    if (cands[c] !== 0 && popcount(cands[c]) === 1) set.add(c);
  for (const house of adapter.houses) {
    for (let v = 1; v <= adapter.n; v++) {
      let only = -1;
      let count = 0;
      for (const cell of house.cells) {
        if (cands[cell] & (1 << v)) {
          only = cell;
          if (++count > 1) break;
        }
      }
      if (count === 1 && popcount(cands[only]) > 1) set.add(only);
    }
  }
  return set;
}
