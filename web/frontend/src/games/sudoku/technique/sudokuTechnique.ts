/**
 * The sudoku adapter for the shared technique engine (T4-W7). Supplies the two things the
 * game-agnostic engine can't know: the SELF-COMPUTED basic-elimination candidate substrate
 * (a cell's candidates = `1..side minus the values already filled in its row/col/box`) and
 * the house structure (rows, cols, boxes, axis-tagged so the fish rung can pick base/cover).
 *
 * This is the "per-game adapter" the zero-wasm gate expects: pure TypeScript over the values
 * + geometry the frontend already has. It NEVER reads `propagateBoard`'s GAC masks — those
 * are post-full-GAC and collapse the grade (see `techniqueEngine.ts` header + the tripwire
 * test). `gradeSudoku` / `fillForcedSudoku` are the per-deal API the composables call (lane
 * E3 wires the UX; this lane owns the detectors).
 *
 * Geometry: `size` is the sub-grid side (the same `size` the composables carry) — a 9×9 board
 * is `size` 3. `side = size²`, `totalCells = side²`.
 */
import {
  gradeBoard,
  fillAllForced,
  findHint,
  fullDomainMask,
  type House,
  type TechniqueAdapter,
  type GradeResult,
  type FillForcedResult,
  type HintResult,
} from "@games/shared/techniqueEngine";

/** Build the row/col/box houses for a sudoku of sub-grid side `size`, axis-tagged. */
export function sudokuHouses(size: number): House[] {
  const side = size * size;
  const houses: House[] = [];
  for (let r = 0; r < side; r++) {
    const cells: number[] = [];
    for (let c = 0; c < side; c++) cells.push(r * side + c);
    houses.push({ cells, axis: "row" });
  }
  for (let c = 0; c < side; c++) {
    const cells: number[] = [];
    for (let r = 0; r < side; r++) cells.push(r * side + c);
    houses.push({ cells, axis: "col" });
  }
  for (let br = 0; br < size; br++) {
    for (let bc = 0; bc < size; bc++) {
      const cells: number[] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          cells.push((br * size + r) * side + (bc * size + c));
        }
      }
      houses.push({ cells, axis: "box" });
    }
  }
  return houses;
}

/**
 * The sudoku technique adapter for a given sub-grid `size`. Precomputes houses + per-cell
 * peer lists once so `computeCandidates` is a tight OR over filled peers on every re-derive.
 */
export function createSudokuAdapter(size: number): TechniqueAdapter {
  const side = size * size;
  const totalCells = side * side;
  const houses = sudokuHouses(size);
  const full = fullDomainMask(side);

  // Peers[cell] = the unique union of its row/col/box mates (excluding itself). The
  // substrate the load-bearing invariant names: candidates = full domain minus these peers'
  // filled values, and NOTHING stronger. Built once from the houses via a per-cell set.
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

  return { n: side, totalCells, houses, computeCandidates };
}

/** Grade a dealt sudoku board — the hardest technique the ladder needed IS the difficulty. */
export function gradeSudoku(
  values: number[] | Record<string, number>,
  size: number,
): GradeResult {
  return gradeBoard(createSudokuAdapter(size), values);
}

/** Fill every naked+hidden single currently on a sudoku board in one sweep, then stop. */
export function fillForcedSudoku(
  values: number[] | Record<string, number>,
  size: number,
): FillForcedResult {
  return fillAllForced(createSudokuAdapter(size), values);
}

/** The cheapest named single to surface as a sudoku hint (lane E3) — prefers `preferredCell`. */
export function hintSudoku(
  values: number[] | Record<string, number>,
  size: number,
  preferredCell?: number,
): HintResult | null {
  return findHint(createSudokuAdapter(size), values, preferredCell);
}
