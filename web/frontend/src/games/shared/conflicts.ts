/**
 * Conflict derivation for the teacher's red pencil (design-refinement.md §1.4) — the
 * game-agnostic core, with per-game adjacency as data (T4-W11 R4).
 *
 * A pure derivation over `values`: the cells participating in a duplicate within any
 * row or column (the Latin-square core both games share), PLUS whatever extra units a
 * game's structure adds — Sudoku's sub-grid boxes (`subgridSize`) and Futoshiki's
 * inequality-pair violations (`extra`). The solver's UNSAT verdict is the authority on
 * solvability; this circles the *visible* repeats, feeding both the `aria-invalid`
 * conflict marks (§4.2 red ghost tier) and the marginalia row ("not quite — check row N").
 *
 * The pencil layer never sees this — it receives an already-erased `Set` of positions.
 */

export interface Conflicts {
  /** Every 0-based position (as a string key, matching `values`) in ≥1 duplicate/violation. */
  positions: Set<string>;
  /** 1-based row of the earliest conflicting cell, or null when there are none. */
  firstRow: number | null;
}

/** Per-game adjacency — the units/violations beyond the shared row+col Latin-square core. */
export interface Adjacency {
  /** Sub-grid edge length → adds box units (Sudoku's 3×3 bands). Omit for a plain Latin
   *  square (Futoshiki) — the one structural divergence between the two games. */
  subgridSize?: number;
  /** Extra violations the units don't catch (Futoshiki's printed `>`/`<` clues). Receives
   *  the value lookup and an `add(pos)` sink; pushes every conflicting position. Runs after
   *  the unit sweep, so a pair already flagged by a row/col dup is idempotently re-added. */
  extra?: (values: Record<string, number>, add: (pos: number) => void) => void;
}

const EMPTY: Conflicts = { positions: new Set(), firstRow: null };

/**
 * @param values     `Record<positionString, number>` (0 = empty), as `use<Game>` holds it.
 * @param boardSize  the board edge length N — rows and cols are N wide.
 * @param adjacency  per-game extra structure (Sudoku boxes / Futoshiki inequalities).
 */
export function findConflicts(
  values: Record<string, number>,
  boardSize: number,
  adjacency: Adjacency = {},
): Conflicts {
  if (boardSize <= 0) return EMPTY;
  const { subgridSize, extra } = adjacency;

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
  const boxes: Map<number, number[]>[] | null = subgridSize
    ? Array.from({ length: boardSize }, () => new Map())
    : null;

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
    push(rows[row], val, pos);
    push(cols[col], val, pos);
    if (boxes && subgridSize) {
      const box =
        Math.floor(row / subgridSize) * subgridSize + Math.floor(col / subgridSize);
      push(boxes[box], val, pos);
    }
  }

  const positions = new Set<string>();
  const units = boxes ? [...rows, ...cols, ...boxes] : [...rows, ...cols];
  for (const unit of units) {
    for (const bucket of unit.values()) {
      if (bucket.length > 1) for (const pos of bucket) positions.add(String(pos));
    }
  }

  // Extra per-game violations (Futoshiki inequality pairs), after the unit sweep.
  extra?.(values, (pos) => positions.add(String(pos)));

  if (positions.size === 0) return EMPTY;

  let firstRow = Infinity;
  for (const key of positions) {
    firstRow = Math.min(firstRow, Math.floor(Number(key) / boardSize));
  }
  return { positions, firstRow: firstRow + 1 }; // 1-based for humans
}
