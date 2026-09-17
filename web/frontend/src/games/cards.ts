/**
 * THE TABLE — the gallery's cards list, and the only one (T5-W2 2.1).
 *
 * The estate carried two registration tables: `gameRegistry` (a 2-of-5 parallel map with zero
 * production consumers) and `GAMES` (the five rows the carousel actually reads). The first was
 * the fiction; this is the one that was always true. A game is a row here plus a `GameSpec` —
 * nothing else, nowhere else.
 *
 * IMPORT DIRECTION, load-bearing: `spec → defineGame` and `cards → spec`, never `spec → cards`.
 * `games/shared/defineGame.ts` imports nothing from this file, so the cycle the old registry
 * closed (`scene → game → registry → scene`) has no edge to form on. The eager row may
 * therefore import its spec STATICALLY — the main-chunk ride — with no TDZ to dodge.
 *
 * The two slots that stay on the ROW rather than in the spec body are here for measured
 * reasons, not taste:
 *   · `poster` — a separate lazy module, so the gallery draws five thumbnails without
 *     `load()`ing five specs (and their models, and their solver clients).
 *   · `persistKey` — the staging ledger's cold-start backfill reads five boards off disk
 *     without mounting five games. The migrated row NAMES its spec's own key rather than
 *     mirroring the string, so there is still exactly one source.
 */
import type { Component } from "vue";
import type { AnyGameSpec } from "@games/shared/defineGame";
// The bands come from the SHARED vocabulary, never from a game: a lazy row must name what it
// deals at without dragging that game's spec (and its model, and its solver client) into the
// main chunk. Thermo/Killer ARE Sudoku variants and stage off the same boxed band.
import type { SelectorBand } from "@games/shared/selectors";
import {
  difficultyOptions,
  subgridSizes,
  latinSizes,
  cagedLatinSizes,
} from "@games/shared/selectors";
import { sudokuSpec } from "@games/sudoku/spec";

/** One staging axis as the PICKER renders it — the game's own selector band, erased to
 *  presentation data (T4-P1 F4). `colorClass` rides through now (T6 mark 7): the crayon
 *  utilities left `GameControlPanel`'s scoped block for `assets/index.css`, so the tints the
 *  drawer writes its difficulty heading in are the tints the picker writes its own in. */
interface StagingAxis {
  label: string;
  options: { value: number | string; label: string; colorClass?: string }[];
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
  /** what the picker STAGES for this game — the same bands its drawer selectors render. */
  staging: CardStaging;
  /** the game's OWN `localStorage` board key — the ledger backfill's source (see the header). */
  persistKey: string;
  /** the static, non-interactive, boil-alive-capable poster (a read-only mini-board). */
  poster: () => Promise<Component>;
  /**
   * How the row MOUNTS — one slot, two shapes, and the shape IS the chunking (T9-W6 §6.1).
   * A spec means the main chunk; a thunk means that game's own lazy chunk. `GameShell` takes
   * it from there: one arm, five games.
   *
   * THIS REPLACES A SLOT AND A BOOLEAN THAT DISAGREED WITH EACH OTHER. The row used to carry
   * `load: () => Promise<AnyGameSpec>` beside `eager?: boolean`, and App picked between them:
   * an eager row's `load` was never called — sudoku's `() => Promise.resolve(sudokuSpec)` had
   * ZERO consumers in the product — because App read `eager` and then mounted a spec it had
   * imported ITSELF, reaching around the table it was iterating. So the estate had a loader
   * nothing loaded, a boolean four of five rows did not carry, and a mount path that did not
   * go through the registry at all. One total slot ends all three: there is no dead arm to
   * call, no second claim about chunking to drift, and App reads the row rather than the
   * module beside it. The eager row's spec is still a STATIC import here — the main-chunk
   * ride, one per table, which `scripts/tdz-probe.mjs` counts.
   */
  mount: AnyGameSpec | (() => Promise<AnyGameSpec>);
}

/** The three tiers, erased to presentation data. Every game carries the same three, so the
 *  mapper is written once and each card names its own source band. */
const tiers = (band: SelectorBand) =>
  band.map((o) => ({
    value: o.value as number | string,
    label: o.label,
    colorClass: o.colorClass,
  }));

// The three Sudoku-family rows stage off the BOXED band (the ratified variant reuse —
// Thermo/Killer ARE Sudoku); futoshiki and kenken name their own. Every row reads the SHARED
// vocabulary, which is the one source a game's drawer sections read too, so the picker and the
// drawer cannot drift apart. `default` mirrors each composable's own default size, the value a
// never-played game deals at.
//
// T9-W6 §6.1 — these three used to read `sudokuSpec.deal.sizes` / `.difficulty` instead. That
// was the estate's ONLY read of those two slots, which every one of the five games carried and
// four could not have honoured: naming a lazy game's spec from this table would drag it out of
// its own chunk to fetch a constant the shared module already holds. A contract slot one game
// in five can use is not a contract, so the slots retired and this row joined the other four.
const sudokuStaging: CardStaging = {
  size: { label: "size", options: tiers(subgridSizes), default: 3 },
  difficulty: {
    label: "level",
    options: tiers(difficultyOptions),
    default: "EASY",
  },
};

// MIGRATED (F1, the proof game). Its spec is imported STATICALLY — the eager main-chunk ride,
// byte-for-byte the shape the old `scene: () => Promise.resolve(SudokuGame)` row had, minus
// the cycle it used to dodge.
const sudokuCard: GameCard = {
  id: "sudoku",
  name: "sudoku",
  range: { label: "size", levels: subgridSizes.map((o) => o.label) },
  staging: sudokuStaging,
  persistKey: sudokuSpec.urlCodec.key,
  poster: () => import("@games/sudoku/SudokuPoster.vue").then((m) => m.default),
  // The spec ITSELF, not a thunk that resolves to it: this row is the main-chunk ride, and
  // saying so with the value is the whole of saying so.
  mount: sudokuSpec,
};

// MIGRATED (F2). Lazy, as it has always been: the spec pulls the model, the clue seam and
// the solver client, so `() => import(…/spec)` is byte-for-byte the dynamic chunk the old
// `scene` loader cut — the same modules behind it, minus a scene and a board adapter.
const futoshikiCard: GameCard = {
  id: "futoshiki",
  name: "futoshiki",
  range: { label: "size", levels: latinSizes.map((o) => o.label) },
  staging: {
    size: { label: "size", options: tiers(latinSizes), default: 5 },
    difficulty: {
      label: "level",
      options: tiers(difficultyOptions),
      default: "EASY",
    },
  },
  // The ledger's backfill key stays a LITERAL on a lazy row, where sudoku's names its spec's
  // `urlCodec.key`. The asymmetry is chunking, not sloppiness: sudoku's spec is already in
  // the main chunk (eager), so naming it is free, while reaching into futoshiki's codec
  // module from the table would drag it out of the lazy chunk to read one string. It
  // resolves for all five at 2.2, when the one `persistence.ts` owns the keys.
  persistKey: "futoshiki-board-state",
  poster: () => import("@games/futoshiki/FutoshikiPoster.vue").then((m) => m.default),
  mount: () => import("@games/futoshiki/spec").then((m) => m.futoshikiSpec),
};

// MIGRATED (F2). A Sudoku variant → reuses sudoku's own size band for its range sub-line.
// Lazy: the spec (model + tube furniture + solver client) rides the dynamic chunk its scene
// used to, downloaded only on select — the chunking is byte-for-byte what it was.
// `persistKey` stays a literal here, unlike sudoku's: naming `thermoSpec.urlCodec.key` would
// mean a STATIC import, which drags a lazy game's spec into the main chunk. The key has one
// source inside the game (`composables/useThermo.persistence.key`, which the spec names);
// this row's copy is the pre-existing one and dies at F4 with the ledger's cold-start read.
const thermoCard: GameCard = {
  id: "thermo",
  name: "thermo",
  range: { label: "size", levels: subgridSizes.map((o) => o.label) },
  staging: sudokuStaging,
  persistKey: "thermo-board-v1",
  poster: () => import("@games/thermo/ThermoPoster.vue").then((m) => m.default),
  mount: () => import("@games/thermo/spec").then((m) => m.thermoSpec),
};

// MIGRATED (F2). A Sudoku variant → reuses sudoku's own size band. LAZY, so unlike sudoku's
// row this one spells its board key rather than reading it off the spec: the ledger's
// cold-start backfill must read five boards WITHOUT pulling five specs (and their models and
// solver clients) into the main chunk — the same measured reason `poster` lives on the row.
// The spec asserts the two agree (`cards.test.ts`, every migrated row).
const killerCard: GameCard = {
  id: "killer",
  name: "killer",
  range: { label: "size", levels: subgridSizes.map((o) => o.label) },
  staging: sudokuStaging,
  persistKey: "killer-board-v1",
  poster: () => import("@games/killer/KillerPoster.vue").then((m) => m.default),
  mount: () => import("@games/killer/spec").then((m) => m.killerSpec),
};

// MIGRATED (F2). A Latin family with its OWN 4/5/6 band. LAZY, so like killer's row this one
// spells its board key rather than reading it off the spec: the ledger's cold-start backfill
// must read five boards WITHOUT pulling five specs (and their models and solver clients) into
// the main chunk — the same measured reason `poster` lives on the row. The spec asserts the two
// agree (`cards.test.ts`, every migrated row).
const kenkenCard: GameCard = {
  id: "kenken",
  name: "kenken",
  range: { label: "size", levels: cagedLatinSizes.map((o) => o.label) },
  staging: {
    size: { label: "size", options: tiers(cagedLatinSizes), default: 4 },
    difficulty: {
      label: "level",
      options: tiers(difficultyOptions),
      default: "EASY",
    },
  },
  persistKey: "kenken-board-v1",
  poster: () => import("@games/kenken/KenKenPoster.vue").then((m) => m.default),
  mount: () => import("@games/kenken/spec").then((m) => m.kenkenSpec),
};

/**
 * The table the carousel reads. A sixth game drops in HERE and nowhere else: one row, one
 * spec, its own residue — never a five-fold copy.
 */
export const GAMES: readonly GameCard[] = [
  sudokuCard,
  futoshikiCard,
  thermoCard,
  killerCard,
  kenkenCard,
];
