/**
 * Local conflict derivation for the teacher's red pencil (design-refinement.md §1.4).
 *
 * A pure derivation over `values`: the cells that participate in a duplicate within
 * any row, column, or sub-grid box. The solver's UNSAT verdict is the authority on
 * whether the board is solvable at all, but a real teacher circles the *visible*
 * repeats — so this finds them, feeding both the `aria-invalid` conflict marks
 * (§4.2's red ghost tier) and the marginalia row ("not quite — check row N").
 *
 * Belongs in `games/sudoku/` (domain): it reasons about sudoku unit structure, and
 * the pencil layer never sees it — it receives an already-erased `Set` of positions.
 */

export interface Conflicts {
  /** Every 0-based position (as a string key, matching `values`) in ≥1 duplicate. */
  positions: Set<string>;
  /** 1-based row of the earliest conflicting cell, or null when there are none. */
  firstRow: number | null;
}

const EMPTY: Conflicts = { positions: new Set(), firstRow: null };

/**
 * @param values     `Record<positionString, number>` (0 = empty), as `useSudoku` holds it.
 * @param boardSize  the full edge length (N², e.g. 9 for a 3×3-subgrid board).
 * @param subgridSize the sub-grid edge length (N, e.g. 3) — box bands are this wide.
 */
export function findConflicts(
  values: Record<string, number>,
  boardSize: number,
  subgridSize: number,
): Conflicts {
  if (boardSize <= 0) return EMPTY;

  // For each unit (row / col / box) map value → the positions holding it; any value
  // held by ≥2 positions marks all of them.
  const rows: Map<number, number[]>[] = Array.from(
    { length: boardSize },
    () => new Map(),
  );
  const cols: Map<number, number[]>[] = Array.from(
    { length: boardSize },
    () => new Map(),
  );
  const boxes: Map<number, number[]>[] = Array.from(
    { length: boardSize },
    () => new Map(),
  );

  const push = (unit: Map<number, number[]>, val: number, pos: number) => {
    const bucket = unit.get(val);
    if (bucket) bucket.push(pos);
    else unit.set(val, [pos]);
  };

  const total = boardSize * boardSize;
  for (let pos = 0; pos < total; pos++) {
    const val = values[String(pos)] ?? 0;
    if (val === 0) continue;
    const row = Math.floor(pos / boardSize);
    const col = pos % boardSize;
    const box =
      Math.floor(row / subgridSize) * subgridSize + Math.floor(col / subgridSize);
    push(rows[row], val, pos);
    push(cols[col], val, pos);
    push(boxes[box], val, pos);
  }

  const positions = new Set<string>();
  for (const unit of [...rows, ...cols, ...boxes]) {
    for (const bucket of unit.values()) {
      if (bucket.length > 1) for (const pos of bucket) positions.add(String(pos));
    }
  }

  if (positions.size === 0) return EMPTY;

  let firstRow = Infinity;
  for (const key of positions) {
    firstRow = Math.min(firstRow, Math.floor(Number(key) / boardSize));
  }
  return { positions, firstRow: firstRow + 1 }; // 1-based for humans
}
