/**
 * Conflict derivation for the teacher's red pencil (design-refinement.md §1.4) — the
 * game-agnostic core, with per-game adjacency as data (T4-W11 R4).
 *
 * A pure derivation over `values`: the cells participating in a duplicate within any
 * row or column (the Latin-square core every game shares), PLUS whatever extra units a
 * game's structure adds — the boxed games' sub-grid bands (`subgridSize`), futoshiki's
 * printed inequalities, killer/kenken cage arithmetic, thermo's chain order (`extra`). The
 * solver's UNSAT verdict is the authority on solvability; this circles the *visible* repeats,
 * feeding both the `aria-invalid` conflict marks (§4.2 red ghost tier) and the marginalia row.
 *
 * ── T9-W1 §1.2 — THE UNIT SURVIVES THE SWEEP ────────────────────────────────────────────────
 * The per-unit buckets below were built, read for `positions`, and then thrown away for
 * `firstRow = min(row(pos))` — so a board broken in nothing but a COLUMN was reported as
 * "check row N" against a row with nothing wrong in it (proved live on both engines: the
 * `aria-invalid` marks landed on the right cells while the note pointed somewhere else). The
 * buckets reach the caller now, as ONE named `unit`: the violation the earliest circled cell
 * belongs to. `firstRow` is deleted rather than kept beside it — a second way to say where the
 * fault is, one of them wrong, is the dual path the no-legacy edict forbids.
 *
 * The vocabulary is the BOARD's, never the solver's: row, column, box, and the three pieces of
 * printed furniture a family can break. `techniqueVoice.formatConflictNote` turns one into a
 * sentence; nothing here formats.
 *
 * The pencil layer never sees this — it receives an already-erased `Set` of positions.
 */

/** A game's own printed furniture, as the note names it. */
export type ExtraUnit = "inequality" | "cage" | "thermometer";

/** What a duplicate broke. `row`/`column`/`box` carry a 1-based index a reader can count to. */
export interface ConflictUnit {
  kind: "row" | "column" | "box" | ExtraUnit;
  /** 1-based for the countable units; null for the printed furniture, which has no ordinal. */
  index: number | null;
}

export interface Conflicts {
  /** Every 0-based position (as a string key, matching `values`) in ≥1 duplicate/violation. */
  positions: Set<string>;
  /** The unit the earliest circled cell breaks, or null when there are none. */
  unit: ConflictUnit | null;
}

/**
 * A game's extra violation sweep. Receives the value lookup and an `add(pos)` sink; pushes
 * every conflicting position. Runs after the unit sweep, so a cell already flagged by a
 * row/col dup is idempotently re-added.
 */
export type ConflictSink = (
  values: Record<string, number>,
  add: (pos: number) => void,
) => void;

/** Per-game adjacency — the units/violations beyond the shared row+col Latin-square core. */
export interface Adjacency {
  /** Sub-grid edge length → adds box units (the boxed games' 3×3 bands). Omit for a plain
   *  Latin square (futoshiki, kenken) — the one structural divergence between the families. */
  subgridSize?: number;
  /** Violations the row/column/box units cannot see: futoshiki's printed `>`/`<` clues,
   *  killer/kenken cage arithmetic, thermo's bulb-to-tip order. */
  extra?: ConflictSink;
  /** The ONE word `extra`'s violations answer to. Travels WITH the sink: a sweep whose
   *  findings have no name cannot be reported, so the note stays silent rather than
   *  inventing a unit the board does not print. */
  extraUnit?: ExtraUnit;
}

const EMPTY: Conflicts = { positions: new Set(), unit: null };

/** One broken unit, kept whole: what it is called, and which cells it holds. */
interface Violation {
  unit: ConflictUnit;
  cells: number[];
}

/**
 * @param values     `Record<positionString, number>` (0 = empty), as `use<Game>` holds it.
 * @param boardSize  the board edge length N — rows and cols are N wide.
 * @param adjacency  per-game extra structure (boxes / inequalities / cages / thermometers).
 */
export function findConflicts(
  values: Record<string, number>,
  boardSize: number,
  adjacency: Adjacency = {},
): Conflicts {
  if (boardSize <= 0) return EMPTY;
  const { subgridSize, extra, extraUnit } = adjacency;

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

  // The buckets, KEPT. Row band before column before box, which is the tie-break order below.
  const violations: Violation[] = [];
  const sweep = (band: Map<number, number[]>[], kind: ConflictUnit["kind"]) => {
    band.forEach((unit, i) => {
      for (const cells of unit.values()) {
        if (cells.length > 1) violations.push({ unit: { kind, index: i + 1 }, cells });
      }
    });
  };
  sweep(rows, "row");
  sweep(cols, "column");
  if (boxes) sweep(boxes, "box");

  // Extra per-game violations, after the unit sweep. ONE sink, one violation: the sweep is the
  // game's own and reports whatever its furniture makes wrong, so the whole of it is that unit.
  // A sink handed no word marks its cells and names nothing — the note keeps its peace rather
  // than pointing at a unit the board does not print.
  const extraCells: number[] = [];
  extra?.(values, (pos) => extraCells.push(pos));
  if (extraCells.length > 0 && extraUnit) {
    violations.push({ unit: { kind: extraUnit, index: null }, cells: extraCells });
  }

  const positions = new Set<string>();
  for (const v of violations) for (const pos of v.cells) positions.add(String(pos));
  for (const pos of extraCells) positions.add(String(pos));
  if (positions.size === 0) return EMPTY;

  // THE NOTE POINTS WHERE THE EYE LANDS. Of every broken unit, name the one holding the
  // earliest circled cell — a strict generalization of the row this replaced, which took the
  // minimum row over the same set. Ties keep the sweep's own order (row, column, box, then the
  // game's furniture), so the same board always reads the same way.
  let named: Violation | null = null;
  let earliest = Infinity;
  for (const v of violations) {
    const first = Math.min(...v.cells);
    if (first < earliest) {
      earliest = first;
      named = v;
    }
  }
  return { positions, unit: named?.unit ?? null };
}
