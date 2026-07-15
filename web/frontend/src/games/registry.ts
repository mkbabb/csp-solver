/**
 * The named game contract (P12) — what a "game" IS to the shared shells.
 *
 * The T4-W11 shells (`GameBoard`/`GameScene`/`GameControlPanel`/`useGameCell`) are the
 * IMPLEMENTATION; this file names the TYPE they satisfy, declared as the intersection they
 * already consume so game #3 plugs in additively (W13's Thermo/Killer/KenKen). The absence
 * it fills is P12: no type said what a game was to the shell, and that silence is why the two
 * game dirs forked ~1,700 line-identical lines.
 *
 * KISS guard against a config-flag god-interface (the named failure mode): every field of
 * `GameDefinition` is a COMPONENT SLOT or a PER-GAME FUNCTION — not one boolean toggle. A
 * difference that wants a flag is a slot the contract missed. The Rust half is
 * `csp_solver::PuzzleClass` (same discipline: associated types + per-family methods, never
 * config flags).
 */
import type { Component } from "vue";
import type { ControlSection } from "@games/shared/GameControlPanel.vue";
import { sudokuGame } from "@games/sudoku/game";
import { futoshikiGame } from "@games/futoshiki/game";

/** The first-solution result — one shape across both games (the W6 stat-line payload). */
interface SolveResult {
  solved: boolean;
  values: Record<string, number>;
  budgetExceeded?: boolean;
  backtracks: number;
  nodesExplored: number;
  propagations: number;
  solutionCount: number;
  elapsedMs?: number;
}

/**
 * Solve/propagate thread the clue furniture ONLY when the game HAS clues (`TClue` ≠ `void`) —
 * the exact seam where Futoshiki's `inequalities` diverge from Sudoku's clue-free solve, and
 * the type-level analog of Rust `PuzzleClass::Clue`. The tuple wrap (`[TClue] extends [void]`)
 * keeps the condition non-distributive over a union clue type.
 */
type SolveFn<TClue> = [TClue] extends [void]
  ? (
      values: Record<string, number>,
      dim: number,
      nodeBudget?: number,
    ) => Promise<SolveResult>
  : (
      values: Record<string, number>,
      dim: number,
      clues: TClue,
      nodeBudget?: number,
    ) => Promise<SolveResult>;

type PropagateFn<TClue> = [TClue] extends [void]
  ? (values: Record<string, number>, dim: number) => Promise<Uint32Array>
  : (values: Record<string, number>, dim: number, clues: TClue) => Promise<Uint32Array>;

/** The solver request builders each game composes over W4's shared transport. */
interface SolverPayloads<TClue> {
  /** deal a fresh board at a dimension + difficulty tier; `values` is the only GUARANTEED
   *  field (a game returns its own furniture — inequalities, subgrid size — as extra keys).
   *  `difficulty` is the game's OWN tier string: the tiers stay per-game (shared/types.ts),
   *  so the contract erases them to `string` here rather than mint a fourth mirror — a method
   *  (not an arrow property) so the per-game `Difficulty` param is bivariance-compatible. */
  getRandomBoard(
    dim: number,
    difficulty: string,
  ): Promise<{ values: Record<string, number> }>;
  /** first-solution solve; throws a typed SolverError on failure. */
  solveBoard: SolveFn<TClue>;
  /** root AC-3/GAC propagation → per-cell surviving-candidate bitmasks. */
  propagateBoard: PropagateFn<TClue>;
}

/**
 * A game, as the shared shells consume it: a reactive model, the two furniture slots the
 * board renders, the control sections, and the solver payloads. `TBoard` is the reactive
 * model the shells wrap; `TCell` the cell component; `TClue` the on-board clue furniture
 * (Futoshiki `Inequality[]`, Sudoku `void`, Thermo a thermometer path) — the FE twin of
 * `PuzzleClass`'s three associated seams.
 */
export interface GameDefinition<TBoard, TCell extends Component, TClue> {
  /** the reactive game model the shells wrap — the game's `use<Game>` composable. */
  model: () => TBoard;
  /** the cell furniture rendered in `GameBoard`'s `#cells` slot (SudokuCell / FutoshikiCell). */
  cellFurniture: TCell;
  /** the clue furniture for `GameBoard`'s `#overlay` slot — Futoshiki's caret layer; `null`
   *  for a game with no on-board clue glyphs (Sudoku's subgrid ticks are drawn by the board
   *  from a `subgridSize` VALUE, not a slot — so the absence is `null`, never a boolean). */
  clueFurniture: Component | null;
  /** the 1..n OptionSelector sections the control-shell renders, built over the live model. */
  options: (model: TBoard) => ControlSection[];
  /** the solver request builders over the shared transport (W4 seam), by clue type. */
  solverPayloads: () => SolverPayloads<TClue>;
}

/**
 * The registration point — an identity function (à la `defineComponent`) that pins the
 * `GameDefinition` shape at each game dir's call site. `grep -rl defineGame` returns this
 * file plus the two game declarations: the P12 absence, now filled. Declared as a hoisted
 * `function` so the registry ↔ game-declaration import cycle resolves at module init.
 */
export function defineGame<TBoard, TCell extends Component, TClue>(
  def: GameDefinition<TBoard, TCell, TClue>,
): GameDefinition<TBoard, TCell, TClue> {
  return def;
}

/**
 * The registration table — both shipped games declared through the contract. W12's carousel
 * `GameCard` consumes this; W13 adds its third row with zero edits here. The registry MAY
 * import both concrete games: it lives at `games/registry.ts`, outside the four boundary globs
 * (`pencil/**`, `games/{sudoku,futoshiki}/**`, `games/shared/**`), so no eslint rule addition
 * is needed — it IS the registration point, not the game-agnostic shared floor.
 */
export const gameRegistry = {
  sudoku: sudokuGame,
  futoshiki: futoshikiGame,
} as const;
