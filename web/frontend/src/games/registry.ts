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
// The eager default game rides the main chunk (a STATIC import, resolved by its card's
// `scene` loader) — today's Sudoku-eager / Futoshiki-lazy asymmetry, preserved (P4 #4).
// Registry is tree-shaken out of the app build until App.vue consumes GAMES (W12 Wave B),
// so this import lands in the main chunk only once the gallery seam is wired — never before.
import SudokuGame from "@games/sudoku/SudokuGame.vue";
import {
  sizeOptions,
  difficultyOptions as sudokuDifficultyOptions,
} from "@games/sudoku/ControlPanel/constants";
import {
  boardSizeOptions,
  difficultyOptions as futoshikiDifficultyOptions,
} from "@games/futoshiki/ControlPanel/constants";
// KenKen's own selector band (4/5/6) — a game never depends on another's ControlPanel
// constants for its own range sub-line. Thermo/Killer ARE Sudoku variants, so they reuse the
// sudoku `sizeOptions` above (already imported for sudokuCard).
import {
  sizeOptions as kenkenSizeOptions,
  difficultyOptions as kenkenDifficultyOptions,
} from "@games/kenken/ControlPanel/constants";

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

/**
 * The CARD FACE of the registration (T4-W12) — the presentation half of a game, over the
 * SAME registry the `gameRegistry` mechanics live in. `GameCard` is NOT a parallel game
 * declaration: `id` names the registered game (matches a `gameRegistry` key by convention +
 * drives `?game=`, aria, keys), and everything else is what the carousel needs to DRAW and
 * MOUNT it — the wordmark/glyph, the size sub-line (derived from the game's OWN selector
 * constants, never a fresh mirror), the static poster loader, and the playable scene loader.
 *
 * THE DROP-IN CONTRACT (Wave A's born-RED gate): a third game is complete when it (1) pushes
 * one `GameCard` to `GAMES`, (2) ships a `poster` (a static mini-board — `PosterBoard` with a
 * canned givens snapshot), (3) ships a `scene` loader. `id` is a plain `string` — NOT
 * `keyof typeof gameRegistry` — precisely so game #3 drops in with ZERO edits outside `GAMES`
 * (a stricter id would force a `gameRegistry` edit too, defeating the invariant). W13's Thermo
 * lands as a real row here; nothing else in the app changes.
 */
/** One staging axis as the PICKER renders it — the game's own selector constants, erased to
 *  presentation data (T4-P1 F4). `colorClass` is deliberately absent: the crayon tints are
 *  scoped inside `GameControlPanel.vue`, so they are inert anywhere else until the AA ledger
 *  is re-verified against `--color-card` (a standalone ship, not this seam's). */
interface StagingAxis {
  label: string;
  options: { value: number | string; label: string }[];
  /** the value a game with no saved board is dealt at (its own composable's default). */
  default: number | string;
}

/** The two axes every game in the estate carries. Not an `n`-axis schema: the shells have
 *  exactly these two, and a third would be a slot the contract missed, not a config array. */
interface CardStaging {
  size: StagingAxis;
  difficulty: StagingAxis;
}

export interface GameCard {
  /** URL token + stable id; drives `?game=`, aria, and v-for keys. */
  id: string;
  /** lowercase wordmark register; rendered as a live `<text>` when no `glyph`. */
  name: string;
  /** optional bespoke name glyph; absent → the wordmark `<text>`. */
  glyph?: Component;
  /** the size/difficulty sub-line, in the game's own vocabulary. */
  range: { label: string; levels: string[] };
  /** what the picker STAGES for this game — the same constants its drawer selectors render. */
  staging: CardStaging;
  /** the game's OWN `localStorage` board key. The staging ledger's cold-start backfill reads
   *  the five boards through these (T4-P1 F4): the picker cannot ask five games whether they
   *  have a board without importing five games, and the bridge may not import this file at all
   *  (the §1 TDZ cycle), so the id⇄key map lives HERE, with every other id⇄thing map, and App
   *  hands it across. A drop-in game that omits it simply never backfills — it publishes its
   *  own row the first time it mounts. */
  persistKey: string;
  /** the static, non-interactive, boil-alive-capable poster (a read-only mini-board). */
  poster: () => Promise<Component>;
  /** the playable scene loader (the `defineGame` mount target). */
  scene: () => Promise<Component>;
  /** the default game rides the main chunk (Sudoku); others stay lazy. */
  eager?: boolean;
}

/** The three tiers, erased to presentation data. Every game carries the same three, so the
 *  mapper is written once and each card names its own source constant. */
const tiers = (opts: readonly { value: string; label: string }[]) =>
  opts.map((o) => ({ value: o.value as number | string, label: o.label }));

// The three Sudoku-family rows stage off sudoku's OWN selector constants (the ratified variant
// reuse — Thermo/Killer ARE Sudoku); futoshiki and kenken carry their own bands. `default`
// mirrors each composable's own default size, the value a never-played game deals at.
const sudokuStaging: CardStaging = {
  size: { label: "size", options: sizeOptions, default: 3 },
  difficulty: {
    label: "level",
    options: tiers(sudokuDifficultyOptions),
    default: "EASY",
  },
};

const sudokuCard: GameCard = {
  id: "sudoku",
  name: "sudoku",
  range: { label: "size", levels: sizeOptions.map((o) => o.label) },
  staging: sudokuStaging,
  persistKey: "sudoku-board-state",
  poster: () => import("@games/sudoku/SudokuPoster.vue").then((m) => m.default),
  // Eager: the scene is already in the main chunk (the static import above), so its loader
  // resolves instantly — the byte-for-byte twin of App.vue's static `import SudokuGame`.
  scene: () => Promise.resolve(SudokuGame),
  eager: true,
};

const futoshikiCard: GameCard = {
  id: "futoshiki",
  name: "futoshiki",
  range: { label: "size", levels: boardSizeOptions.map((o) => o.label) },
  staging: {
    size: { label: "size", options: boardSizeOptions, default: 5 },
    difficulty: {
      label: "level",
      options: tiers(futoshikiDifficultyOptions),
      default: "EASY",
    },
  },
  persistKey: "futoshiki-board-state",
  poster: () => import("@games/futoshiki/FutoshikiPoster.vue").then((m) => m.default),
  // Lazy: the whole Futoshiki scene (board + controls + useFutoshiki + its Worker) stays a
  // dynamic chunk that downloads only on select — today's chunking, unchanged.
  scene: () => import("@games/futoshiki/FutoshikiGame.vue").then((m) => m.default),
};

// W13 ROW 1 — Thermo-Sudoku. A Sudoku variant → reuses the sudoku `sizeOptions` for its range
// sub-line. Lazy (only sudoku is eager): the poster + scene download only on select.
const thermoCard: GameCard = {
  id: "thermo",
  name: "thermo",
  range: { label: "size", levels: sizeOptions.map((o) => o.label) },
  staging: sudokuStaging,
  persistKey: "thermo-board-v1",
  poster: () => import("@games/thermo/ThermoPoster.vue").then((m) => m.default),
  scene: () => import("@games/thermo/ThermoGame.vue").then((m) => m.default),
};

// W13 ROW 3 — Killer-Sudoku. A Sudoku variant → reuses the sudoku `sizeOptions`. Lazy.
const killerCard: GameCard = {
  id: "killer",
  name: "killer",
  range: { label: "size", levels: sizeOptions.map((o) => o.label) },
  staging: sudokuStaging,
  persistKey: "killer-board-v1",
  poster: () => import("@games/killer/KillerPoster.vue").then((m) => m.default),
  scene: () => import("@games/killer/KillerGame.vue").then((m) => m.default),
};

// W13 ROW 4 — KenKen / Calcudoku. A Latin family with its OWN 4/5/6 band. Lazy.
const kenkenCard: GameCard = {
  id: "kenken",
  name: "kenken",
  range: { label: "size", levels: kenkenSizeOptions.map((o) => o.label) },
  staging: {
    size: { label: "size", options: kenkenSizeOptions, default: 4 },
    difficulty: {
      label: "level",
      options: tiers(kenkenDifficultyOptions),
      default: "EASY",
    },
  },
  persistKey: "kenken-board-v1",
  poster: () => import("@games/kenken/KenKenPoster.vue").then((m) => m.default),
  scene: () => import("@games/kenken/KenKenGame.vue").then((m) => m.default),
};

/**
 * The registration TABLE the carousel reads. Game #3+ drop in HERE, nowhere else (the
 * drop-in invariant). W13 lands its Thermo/Killer/KenKen rows — every id matches the
 * `game.ts` registration-by-convention (loose `id: string`, zero `gameRegistry` edit); every
 * row is lazy so the poster + scene download only on select (sudoku's eager asymmetry, P4 #4).
 */
export const GAMES: readonly GameCard[] = [
  sudokuCard,
  futoshikiCard,
  thermoCard,
  killerCard,
  kenkenCard,
];
