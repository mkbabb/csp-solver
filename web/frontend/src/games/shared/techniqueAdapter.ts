/**
 * THE BOARD ADAPTER for the shared technique engine — one module, both geometries.
 *
 * The engine (`techniqueEngine.ts`) is game-agnostic: it grades, fills and hints over houses and
 * a candidate substrate. What it cannot know is the board's SHAPE. The estate answered that
 * twice — `sudoku/technique/sudokuTechnique.ts` and `futoshiki/technique/futoshikiTechnique.ts`
 * — and then three families imported a sibling's copy across the boundary (`thermo`/`killer`
 * read sudoku's, `kenken` read futoshiki's: three of the twelve violations T5-W2 2.5 closes).
 *
 * The two adapters differed in exactly what `BoardGrammar.geometry` already names:
 *
 *   · **boxed** (sudoku, thermo, killer) — houses are rows + cols + BOXES. `n` is the SUB-GRID
 *     side, so a 9×9 board is `n = 3` and the board edge is `n²`.
 *   · **latin** (futoshiki, kenken) — houses are rows + cols only; a plain N×N Latin square with
 *     no boxes. `n` IS the board edge. Pointing needs two cells to share a second house, and
 *     rows and cols meet in a single cell, so that rung falls silent on its own — no
 *     special-casing, then or now.
 *
 * Everything else was byte-for-byte the same peer-set sweep. So geometry is a parameter, the
 * inequality furniture is an argument, and the twin dies.
 *
 * ── THE LOAD-BEARING INVARIANT (r3 KILL-LIST #3, both geometries) ────────────────────────────
 * `computeCandidates` does ONLY basic all-different elimination — a cell's candidates =
 * `1..side minus the values already filled in its houses`. It folds in NO inequality bound and
 * NEVER reads `propagateBoard`'s GAC masks. Those masks are post-full-AC over BOTH the
 * all-different AND the inequality constraints — strictly stronger, and over-pruned for
 * grading: a board a human solves by the endpoint rule arrives with that reduction already
 * applied, so every cell reads as a naked single and the grade collapses to tier 1. The
 * inequality reasoning is carried entirely by the engine's two `inequality-*` rungs — gradeable,
 * named steps. Both test files pin this with the substrate tripwire.
 */
import {
  fullDomainMask,
  type Constraint,
  type House,
  type TechniqueAdapter,
} from "@games/shared/techniqueEngine";

/** The two grid families — the same axis `BoardGrammar.geometry` carries on every spec. */
export type BoardGeometry = "boxed" | "latin";

/** The board edge length. `boxed` counts in sub-grids (`n = 3` ⇒ 9×9); `latin` counts in cells.
 *  Module-private: a caller already knows which axis its `n` is on — that is what `geometry` says. */
const sideOf = (geometry: BoardGeometry, n: number): number =>
  geometry === "boxed" ? n * n : n;

/**
 * The houses of a board, axis-tagged so the fish rung can pick base and cover. Rows and cols
 * always; boxes only where the geometry has them.
 */
export function boardHouses(geometry: BoardGeometry, n: number): House[] {
  const side = sideOf(geometry, n);
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
  if (geometry === "boxed") {
    for (let br = 0; br < n; br++) {
      for (let bc = 0; bc < n; bc++) {
        const cells: number[] = [];
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) cells.push((br * n + r) * side + (bc * n + c));
        }
        houses.push({ cells, axis: "box" });
      }
    }
  }
  return houses;
}

/**
 * The printed `[greater, lesser]` furniture, lifted into the engine's `Constraint` vocabulary.
 * `cell[greater] > cell[lesser]`, matching both the on-grid caret and the wasm wire. Typed
 * structurally rather than against `@games/futoshiki/types` — the shared floor stays
 * game-agnostic, and a pair of cell indices needs no game to name it.
 */
export function inequalityConstraints(
  inequalities: readonly (readonly [number, number])[],
): Constraint[] {
  return inequalities.map(([greater, lesser]) => ({
    kind: "inequality",
    greater,
    lesser,
  }));
}

/**
 * The technique adapter for a board. Precomputes houses + per-cell peer lists once, so
 * `computeCandidates` is a tight OR over filled peers on every re-derive — basic all-different
 * elimination and NOTHING stronger (see the header's invariant).
 *
 * `inequalities` is the caret furniture where a family prints it and `[]` everywhere else; the
 * engine's `inequality-*` rungs go silent on an empty constraint list, which is exactly how a
 * kenken board grades on the latin geometry it shares with futoshiki.
 */
export function createBoardAdapter(
  geometry: BoardGeometry,
  n: number,
  inequalities: readonly (readonly [number, number])[] = [],
): TechniqueAdapter {
  const side = sideOf(geometry, n);
  const totalCells = side * side;
  const houses = boardHouses(geometry, n);
  const full = fullDomainMask(side);

  // Peers[cell] = the unique union of its house mates (excluding itself). The substrate the
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

  // A family with no printed inequalities supplies NONE, not an empty list: the engine's
  // `inequality-*` rungs short-circuit on `!constraints`, and that is the arm the three
  // constraint-free families have always taken.
  const constraints = inequalities.length
    ? inequalityConstraints(inequalities)
    : undefined;
  return { n: side, totalCells, houses, constraints, computeCandidates };
}
