/**
 * Local conflict derivation for the teacher's red pencil, Futoshiki flavour.
 *
 * A pure derivation over `values` + `inequalities`. Futoshiki is a plain N×N Latin
 * square (no subgrid boxes — that's the one structural divergence from Sudoku's
 * `findConflicts`), PLUS the inequality clues: a filled pair that violates its
 * printed `>`/`<` is a visible mistake the teacher circles too.
 *
 * Feeds both the `aria-invalid` conflict marks (§4.2 red ghost tier) and the
 * marginalia row ("not quite — check row N"). The pencil layer never sees this —
 * it receives an already-erased `Set` of positions.
 */
import type { Inequality } from "../types";

export interface Conflicts {
  /** Every 0-based position (as a string key, matching `values`) in ≥1 duplicate/violation. */
  positions: Set<string>;
  /** 1-based row of the earliest conflicting cell, or null when there are none. */
  firstRow: number | null;
}

const EMPTY: Conflicts = { positions: new Set(), firstRow: null };

/**
 * @param values        `Record<positionString, number>` (0 = empty), as `useFutoshiki` holds it.
 * @param boardSize     the board edge length N (4..7) — rows and cols are N wide.
 * @param inequalities  the printed `[greater, lesser]` clue pairs (board furniture).
 */
export function findConflicts(
  values: Record<string, number>,
  boardSize: number,
  inequalities: Inequality[],
): Conflicts {
  if (boardSize <= 0) return EMPTY;

  const rows: Map<number, number[]>[] = Array.from(
    { length: boardSize },
    () => new Map(),
  );
  const cols: Map<number, number[]>[] = Array.from(
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
    push(rows[Math.floor(pos / boardSize)], val, pos);
    push(cols[pos % boardSize], val, pos);
  }

  const positions = new Set<string>();
  for (const unit of [...rows, ...cols]) {
    for (const bucket of unit.values()) {
      if (bucket.length > 1) for (const pos of bucket) positions.add(String(pos));
    }
  }

  // Inequality violations: both endpoints filled but the printed `>` doesn't hold.
  for (const [gt, lt] of inequalities) {
    const a = values[String(gt)] ?? 0;
    const b = values[String(lt)] ?? 0;
    if (a !== 0 && b !== 0 && a <= b) {
      positions.add(String(gt));
      positions.add(String(lt));
    }
  }

  if (positions.size === 0) return EMPTY;

  let firstRow = Infinity;
  for (const key of positions) {
    firstRow = Math.min(firstRow, Math.floor(Number(key) / boardSize));
  }
  return { positions, firstRow: firstRow + 1 }; // 1-based for humans
}
