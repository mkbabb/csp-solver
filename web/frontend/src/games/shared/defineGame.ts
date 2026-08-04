/**
 * THE UNION `GameSpec` (T5-W2 §1) — what a game IS, whole, in eight slots.
 *
 * This module **imports nothing from the table**. That single fact is what severs the TDZ:
 * `spec → defineGame` and `cards → spec`, never `spec → cards`, so the cycle
 * `scene → game → registry → scene` — the one that threw
 * `ReferenceError: Cannot access 'sudokuGame' before initialization` and forced SudokuGame
 * to hand-inline its own control sections — has no edge left to close on. The workaround
 * dies with the cycle, not beside it.
 *
 * The eight slots are the adjudicated union of BETA's five declared slots (the floor the
 * five games actually pass today) and ALPHA's 8-slot census: `model · grammar · clues ·
 * furniture · solver · urlCodec · poster · deal`. `poster` lives on the CARD row, not in
 * the spec body — forced by chunking (the gallery draws five thumbnails without loading
 * five specs, five models and five solver clients), measured, not taste.
 *
 * KISS guard, inherited from the contract this replaces: every slot is a COMPONENT, a
 * FUNCTION, or a named datum the shell renders — never a config boolean. A difference that
 * wants a flag is a slot the union missed. `BoardGrammar` is the discipline made concrete:
 * the two grid families and the three render facts that CORRELATE with them are carried as
 * data on one record, so divergence never forks a component.
 */
import type { Component, Ref } from "vue";
import type { ControlSection } from "@games/shared/GameControlPanel.vue";
import type { SelectorBand } from "@games/shared/selectors";
import type { SolveState, SolveStats } from "@games/shared/types";
import type { HintResult } from "@games/shared/techniqueEngine";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { ErrorCheckMode } from "@games/shared/useAssists";
import type { TallyDescriptor } from "@games/shared/techniqueVoice";

/**
 * A ref the shell only ever READS. Declared read-only on purpose: a game's own tier union
 * (`Ref<"EASY"|"MEDIUM"|"HARD">`) is not assignable to `Ref<string>` — `Ref` is invariant —
 * but it is assignable to this. The relaxation is what lets ONE shell type accept five
 * differently-tiered models without erasing each game's tier at its own call sites.
 */
interface ReadRef<T> {
  readonly value: T;
}

/**
 * The model surface the shell consumes — `useGameState`'s pass-through slots under the
 * common public names every game already exposes. This is a READ CONTRACT, not a second
 * declaration: each game's composable returns a structural superset (plus its own re-labelled
 * size ref and its own furniture), and the shell binds exactly what is listed here.
 */
export interface GameModel {
  boardSize: ReadRef<number>;
  totalCells: ReadRef<number>;
  values: ReadRef<Record<string, number>>;
  givenCells: ReadRef<Set<string>>;
  originalGivenCells: ReadRef<Set<string>>;
  overriddenCells: ReadRef<Set<string>>;
  animatingCells: ReadRef<Set<string>>;
  solveState: Readonly<Ref<SolveState>>;
  solvedValues: ReadRef<Record<string, number>>;
  solveStats: ReadRef<SolveStats | null>;
  boardGeneration: ReadRef<number>;
  /** the game's OWN tier, read as a word — see `ReadRef`. */
  difficulty: ReadRef<string>;
  loading: ReadRef<boolean>;
  errorCode: ReadRef<string>;
  linkError: ReadRef<boolean>;
  isDirty: ReadRef<boolean>;
  hintReasoning: ReadRef<HintResult | null>;
  gradeTally: ReadRef<TallyDescriptor>;
  pencilMarks: ReadRef<Record<string, number[]>>;
  cornerMarks: ReadRef<Record<string, number[]>>;
  centerMarks: ReadRef<Record<string, number[]>>;
  pencilMode: ReadRef<PencilMode>;
  errorCheckMode: ReadRef<ErrorCheckMode>;
  proactiveCheck: ReadRef<boolean>;
  candidatesPinned: ReadRef<boolean>;
  /** T6 mark 13 — per-cell `--color-user-ink` rebindings for the cells a PEER authored.
   *  Empty off-session, which is what makes a solo board byte-identical. */
  authorInk: ReadRef<Record<string, Record<string, string>>>;
  /** T8-W3 M1 — WHO wrote each cell, by name, `self` flagged. The naming half of the same
   *  clock `authorInk` colours from, and a separate slot for the same reason those two are
   *  separate consumers: a style binding and a word are not one thing wearing two hats.
   *  Empty off-session. */
  cellAuthors: ReadRef<Record<string, { slug: string; self: boolean }>>;

  setCell: (position: number, value: number) => void;
  toggleUserMark: (position: number, value: number) => void;
  cyclePencilMode: () => void;
  setPencilMode: (mode: PencilMode) => void;
  setErrorCheckMode: (mode: ErrorCheckMode) => void;
  setCandidatesPinned: (pinned: boolean) => void;
  setMarksActive: (active: boolean) => void;
  peekSolution: () => Promise<Record<string, number>>;
  shareBoard: () => Promise<void>;
  /** the share act with a room on it — mints `?s=` and joins before copying the link. */
  shareSession: () => Promise<void>;
  deal: () => Promise<void> | void;
  clearBoard: () => void;
  solve: () => Promise<void> | void;
  fillForced: () => void;
  hintCell: (position: number) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * The two grid families, and the three render facts that correlate with them but are not
 * them. One flat record, never a tagged union: `noun`/`requestVoice` are
 * RENDERED STRINGS, and folding a render difference into a geometry name smuggles a real
 * divergence behind a rename.
 *
 *   boxed — sudoku · thermo · killer (a sub-grid band; peers include the box)
 *   latin — futoshiki · kenken      (a plain Latin square; no box band)
 */
interface BoardGrammar {
  geometry: "boxed" | "latin";
  /** the grid's a11y label — "sudoku board", "kenken board". */
  noun: string;
  /** does the fresh-board margin carry the "— medium" difficulty clause? */
  requestVoice: boolean;
}

/**
 * The clue seam, whole: what the board draws, how the board props it, and how the wire and
 * the permalink carry it. `null` is sudoku's STATED absence — a game with no on-board clue
 * glyphs — never a boolean. Keeping the codec pair HERE is what makes one `persistence.ts`
 * and one `protocol.ts` possible; separating them would re-fork the axis.
 */
interface ClueSeam<TModel, TClue> {
  /**
   * The LIVE clue, read off the model the shell instantiated.
   *
   * AMENDMENT to the fixed table (§1.2), requested by the F2 thermo lane 2026-08-01 with its
   * cause, landed at F3 with the rest of that lane's barrier: the clue is a live MODEL value,
   * the shell is what instantiates the model, and the seam is the only place that knows which
   * field it is — `thermometers` / `inequalities` / `cages` / `cages`. Without it the slot was
   * declared and unreadable, which is §1.3's own rule ("a slot the shell doesn't read is
   * deleted from the type") running in reverse. A shell that had to know the field name would
   * be five branches wearing one name.
   */
  from: (model: TModel) => TClue;
  overlay: Component;
  props: (clue: TClue, dim: number) => Record<string, unknown>;
  encode: (clue: TClue) => Uint32Array;
  decode: (buf: Uint32Array, dim: number) => TClue;
}

/**
 * What a game is dealt at: the two bands the picker and the drawer both render, and the live
 * sections built over the model. The bands are constants the gallery can name WITHOUT loading
 * a game, which is how the card keeps its range sub-line without `load()`.
 *
 * AMENDMENT, T5-W2 F1 (named cause, dated): §1.2 also fixed a `prewarm?: boolean` here, as
 * `GameCard.eager`'s new home. It is NOT here, because it had no reader `eager` did not
 * already serve. Every mounted scene warms its own worker on its first idle tick — the eager
 * game at app mount, a lazy game on select — so a per-spec flag would have carried one value
 * for all five games while `eager` (which App reads to pick the main-chunk ride, and the
 * gallery's warm loop reads to skip it) carried the real fact. A boolean with one value is
 * the config-flag disease this contract's own KISS guard names.
 */
interface DealSpec<TModel> {
  sizes: SelectorBand;
  difficulty: SelectorBand;
  options: (model: TModel) => ControlSection[];
}

/**
 * The per-game solver residue — what a game alone knows about its own search.
 *
 * AMENDMENT DISCHARGED, T5-W2 F3: F1 amended this slot to `{ nodeBudget, prewarm }` with a
 * named cause — the scenes were gone, so there was no per-game module left for `GameShell` to
 * import a cold-start warm from, and the verb rode the slot. That amendment scheduled its own
 * death at 2.2, and 2.2 collected: there is ONE Worker over the one wasm binary now, so there
 * is one warm, imported from `@games/shared/solver/client` by the shell that performs it.
 * Asking each of five games for a handle onto one act would have been the fiction this wave
 * exists to kill. The slot is back to the charter's §1.2 shape, unamended.
 */
interface SolverSpec {
  /** size-scaled cap on search effort — the game's own table, keyed to its RAW selector size. */
  nodeBudget: (rawSize: number) => number;
}

/** The eight slots, seven of them here and `poster` on the card row (see the header). */
export interface GameSpec<TModel, TClue> {
  /** matches its `cards.ts` row; drives `?game=`, aria and keys. */
  id: string;
  model: () => TModel;
  grammar: BoardGrammar;
  clues: ClueSeam<TModel, TClue> | null;
  furniture: { cell: Component };
  solver: SolverSpec;
  urlCodec: { key: string };
  deal: DealSpec<TModel>;
}

/**
 * The type-erased spec the TABLE and the SHELL traffic in.
 *
 * Both parameters are the GAME's own business, and both sit in contravariant position — the
 * model is `deal.options`' argument, the clue is `clues.props`'/`clues.encode`'s — so a
 * concrete spec is not assignable to any narrowing of them. Erasure at the boundary is
 * therefore the only sound shape, and it costs nothing: `defineGame` below CONSTRAINS
 * `TModel extends GameModel` at every declaration site, so a spec that failed the shell's
 * read contract could never have been written in the first place. The check moved from the
 * consumer to the author, which is where it belonged.
 */
export type AnyGameSpec = GameSpec<any, any>;

/**
 * Identity function, hoisted, and the ONE place a game's model is proved to satisfy the
 * shell's read contract. It no longer NEEDS to be hoisted — the cycle is gone — but a
 * hoisted identity costs nothing and forecloses a class of future re-entry.
 */
export function defineGame<TModel extends GameModel, TClue>(
  spec: GameSpec<TModel, TClue>,
): GameSpec<TModel, TClue> {
  return spec;
}
