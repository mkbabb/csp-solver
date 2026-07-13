/**
 * The futoshiki adapter for the shared technique engine (T4-W7, lane E2). The twin of the sudoku
 * adapter: it supplies the two things the game-agnostic engine can't know — the SELF-COMPUTED
 * basic-elimination candidate substrate and the game's structure — and NEVER re-implements the
 * ladder. Futoshiki differs from sudoku in exactly two places, both expressed as data the engine
 * already understands:
 *
 *   1. Houses are rows + cols only (a plain N×N Latin square, no sub-grid boxes). Pointing needs
 *      two cells to share a second house; rows and cols meet in a single cell, so that rung is
 *      naturally silent — no special-casing.
 *   2. The printed `[greater, lesser]` inequalities become `view.constraints`, read by the two
 *      appended `inequality-*` rungs (endpoint forcing + positional chains).
 *
 * ── THE LOAD-BEARING INVARIANT (r3 KILL-LIST #3, futoshiki twin) ─────────────────────────────
 * `computeCandidates` does ONLY basic all-different elimination — a cell's candidates =
 * `1..N minus the values already filled in its row and col`. It folds in NO inequality bound. The
 * wasm's `propagateBoard` masks are post-AC-3 over BOTH the all-different AND the inequality
 * constraints — strictly stronger, and (like sudoku's GAC masks) over-pruned for grading: a board
 * that a human solves by the endpoint rule arrives with that reduction already applied, so every
 * cell reads as a naked single and the grade collapses to tier-1. So the inequality reasoning is
 * carried entirely by the engine's two `inequality-*` rungs — gradeable, named steps — never by
 * this candidate function. `futoshikiTechnique.test.ts` pins this with the futoshiki twin of the
 * substrate tripwire (self-computed candidates asserted NOT equal to the AC-pruned masks on a
 * board where AC over-prunes past the human sequence).
 *
 * `gradeFutoshiki` / `fillForcedFutoshiki` are the per-deal API the composable calls (lane E3
 * wires the hint UX; this lane owns the detectors), mirroring `gradeSudoku` / `fillForcedSudoku`.
 *
 * Geometry: `boardSize` is the board edge length N directly (4..7) — never sudoku's sub-grid
 * `size`. `totalCells = N²`.
 */
import {
  gradeBoard,
  fillAllForced,
  findHint,
  fullDomainMask,
  type House,
  type Constraint,
  type TechniqueAdapter,
  type GradeResult,
  type FillForcedResult,
  type HintResult,
} from "@games/shared/techniqueEngine";
import type { Inequality } from "../types";

/** Build the row + col houses for an N×N futoshiki board, axis-tagged. No boxes. */
export function futoshikiHouses(boardSize: number): House[] {
  const houses: House[] = [];
  for (let r = 0; r < boardSize; r++) {
    const cells: number[] = [];
    for (let c = 0; c < boardSize; c++) cells.push(r * boardSize + c);
    houses.push({ cells, axis: "row" });
  }
  for (let c = 0; c < boardSize; c++) {
    const cells: number[] = [];
    for (let r = 0; r < boardSize; r++) cells.push(r * boardSize + c);
    houses.push({ cells, axis: "col" });
  }
  return houses;
}

/**
 * The `[greater, lesser]` furniture the board carries, lifted into the engine's `Constraint`
 * vocabulary. `cell[greater] > cell[lesser]`, matching both the on-grid caret and the wasm wire.
 */
export function inequalityConstraints(inequalities: Inequality[]): Constraint[] {
  return inequalities.map(([greater, lesser]) => ({
    kind: "inequality",
    greater,
    lesser,
  }));
}

/**
 * The futoshiki technique adapter for a given `boardSize` + inequality furniture. Precomputes
 * houses + per-cell row/col peer lists once, so `computeCandidates` is a tight OR over filled
 * peers on every re-derive — basic all-different elimination and NOTHING stronger (see header).
 */
export function createFutoshikiAdapter(
  boardSize: number,
  inequalities: Inequality[],
): TechniqueAdapter {
  const totalCells = boardSize * boardSize;
  const houses = futoshikiHouses(boardSize);
  const constraints = inequalityConstraints(inequalities);
  const full = fullDomainMask(boardSize);

  // Peers[cell] = the union of its row + col mates (excluding itself). The substrate the
  // invariant names: candidates = full domain minus these peers' filled values, and nothing
  // stronger (the inequality edges live in `constraints`, consumed by the rungs, not here).
  const peerSets: Set<number>[] = Array.from(
    { length: totalCells },
    () => new Set<number>(),
  );
  for (const house of houses) {
    for (const cell of house.cells) {
      for (const other of house.cells) if (other !== cell) peerSets[cell].add(other);
    }
  }
  const peers: number[][] = peerSets.map((s) => [...s]);

  function computeCandidates(values: number[]): Uint32Array {
    const cands = new Uint32Array(totalCells);
    for (let cell = 0; cell < totalCells; cell++) {
      if (values[cell] !== 0) {
        cands[cell] = 0;
        continue;
      }
      let used = 0;
      for (const peer of peers[cell]) {
        const pv = values[peer];
        if (pv !== 0) used |= 1 << pv;
      }
      cands[cell] = full & ~used;
    }
    return cands;
  }

  return { n: boardSize, totalCells, houses, constraints, computeCandidates };
}

/** Grade a dealt futoshiki board — the hardest technique the ladder needed IS the difficulty. */
export function gradeFutoshiki(
  values: number[] | Record<string, number>,
  boardSize: number,
  inequalities: Inequality[],
): GradeResult {
  return gradeBoard(createFutoshikiAdapter(boardSize, inequalities), values);
}

/** Fill every naked+hidden single currently on a futoshiki board in one sweep, then stop. */
export function fillForcedFutoshiki(
  values: number[] | Record<string, number>,
  boardSize: number,
  inequalities: Inequality[],
): FillForcedResult {
  return fillAllForced(createFutoshikiAdapter(boardSize, inequalities), values);
}

/** The cheapest named single to surface as a futoshiki hint (lane E3) — prefers `preferredCell`. */
export function hintFutoshiki(
  values: number[] | Record<string, number>,
  boardSize: number,
  inequalities: Inequality[],
  preferredCell?: number,
): HintResult | null {
  return findHint(
    createFutoshikiAdapter(boardSize, inequalities),
    values,
    preferredCell,
  );
}
