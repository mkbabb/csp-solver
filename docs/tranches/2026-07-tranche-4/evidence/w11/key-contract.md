# T4-W11 · lane KEY — THE KEYSTONE: `defineGame` + the registry + the acceptance stub

Base HEAD `7d51f562`, atop R1 (SolverErrorNote fold) + R2 (control-shell) + R3 (cell-shell) +
R4 (board/scene-shell) + RS (rust `PuzzleClass`) — all in-tree. The four shells are the
IMPLEMENTATION; this lane names the TYPE they satisfy (P12), declares both games through it, and
lands the born-RED acceptance stub (a third game that compiles against the contract with ZERO
shell edits). Additive only — the shells, scenes, and shipped-game components are BYTE-UNTOUCHED.

Port 4592. CEN's live figures govern the spec's stale `65425697` census.

---

## 1. THE CONTRACT SURFACE — `web/frontend/src/games/registry.ts` (NEW; the P12 absence, filled)

```ts
export interface GameDefinition<TBoard, TCell extends Component, TClue> {
  model: () => TBoard;                         // the reactive game model the shells wrap (use<Game>)
  cellFurniture: TCell;                        // the #cells slot component (SudokuCell / FutoshikiCell)
  clueFurniture: Component | null;             // the #overlay slot (Futoshiki caret; null for Sudoku)
  options: (model: TBoard) => ControlSection[]; // the 1..n control-shell sections, over the live model
  solverPayloads: () => SolverPayloads<TClue>;  // the W4-seam request builders, by clue type
}
export function defineGame<TBoard, TCell extends Component, TClue>(def): GameDefinition<…> { return def }
export const gameRegistry = { sudoku: sudokuGame, futoshiki: futoshikiGame } as const;
```

- **Every field is a component slot or a per-game function — NOT ONE boolean toggle** (the KISS
  guard against the config-flag god-interface, the named failure mode). `clueFurniture: Component |
  null` is a SLOT whose absence is `null` — Sudoku genuinely has no on-board clue glyphs (its
  subgrid ticks are drawn by the board from a `subgridSize` VALUE), so the absence is the missing
  slot, never a `hasClues: false` flag.
- **`TClue` is the load-bearing generic** — the FE twin of Rust `PuzzleClass::Clue`. It threads
  ONLY through `solveBoard`/`propagateBoard` (`SolveFn<TClue>`/`PropagateFn<TClue>`, a tuple-guarded
  `[TClue] extends [void]` conditional), the exact seam where Futoshiki's `inequalities` diverge from
  Sudoku's clue-free solve. Sudoku `void`, Futoshiki `Inequality[]`, Thermo a thermometer path.
- **The contract is the INTERSECTION THE SHELLS ALREADY NEED, not speculative**: `SolveResult` is the
  W6 stat-line payload both `useSolver`s already return; `ControlSection` is R2's exported shell type
  both `ControlPanel` adapters already build; `cellFurniture`/`clueFurniture` are R4's `#cells`/
  `#overlay` slots; `model` is the composable the scenes already call. Nothing invented.
- **The difficulty tiers are NOT mirrored** (see §4): `getRandomBoard(dim, difficulty: string)` erases
  the per-game `Difficulty` to `string` at the game-agnostic boundary (a METHOD, so the per-game
  `Difficulty` param is bivariance-compatible) — the tiers stay per-game per `shared/types.ts`.

## 2. BOTH GAMES DECLARED THROUGH IT (`grep -rl defineGame` → registry + both games, born RED)

- **`web/frontend/src/games/sudoku/game.ts`** (NEW): `sudokuGame = defineGame<ReturnType<typeof
  useSudoku>, typeof SudokuCell, void>({ model: useSudoku, cellFurniture: SudokuCell, clueFurniture:
  null, options: (m) => [size, difficulty], solverPayloads: useSolver })`. `TClue = void`.
- **`web/frontend/src/games/futoshiki/game.ts`** (NEW): `futoshikiGame = defineGame<ReturnType<typeof
  useFutoshiki>, typeof FutoshikiCell, Inequality[]>({ … clueFurniture: FutoshikiCaret, options: (m)
  => [boardSize, difficulty], solverPayloads: useSolver })`. `TClue = Inequality[]`.
- Both `options` reuse the game's OWN `constants.ts` selector data (`sizeOptions`/`boardSizeOptions`
  + `difficultyOptions`) and read/write the model's `pendingSize`/`pendingBoardSize`/`difficulty`
  refs — the exact shape the R2 `ControlPanel` adapters build inline. Both `solverPayloads` are the
  game's `useSolver` factory, assignable to `() => SolverPayloads<TClue>` (verified: `getRandomBoard`
  return `⊇ {values}`, `solveBoard`/`propagateBoard` thread the concrete clue).
- **Behavior byte-identical**: the live scenes mount `SudokuBoard`/`ControlPanel`/`useSudoku`
  DIRECTLY (App.vue → the scenes); the registry graph is NOT reachable from App.vue, so `vite build`
  tree-shakes it OUT of the dist — **191 modules transformed, identical to the R1–R4 dist** (grep of
  `dist/` for `gameRegistry`/`defineGame` → empty). The contract is a DECLARATION layer W12/W13
  consume; W11 pixels + behavior are the R1–R4 dist, unchanged.

## 3. THE ACCEPTANCE STUB (born RED: no third game compiled today) — ZERO shell edits

A minimal **Thermo-Sudoku** third game, homed as dead-by-design in the gates' accepted place:

- **FE — `web/frontend/src/games/registry.test.ts`** (a vitest unit test = a knip entry, so the
  registry + both declarations stay non-orphan and the stub is accepted dead code). It declares
  `thermoGame = defineGame<ThermoModel, typeof ThermoCell, ThermoLine[]>({…})` with a **NOVEL clue
  type** — `ThermoLine = number[]` (a thermometer path), neither Sudoku's `void` nor Futoshiki's
  `Inequality[]`. The `defineGame<…, ThermoLine[]>(…)` call TYPE-CHECKING (vue-tsc exit 0) IS the
  acceptance proof: the contract is the intersection, generic over clue furniture, not a fork point.
  Furniture are `defineComponent` stubs (arbitrary slots accepted); it ships no UI and registers in
  no app (un-mounted, un-imported by App.vue). W13 lands the real game.
- **Rust — `csp-solver/tests/thermo_acceptance.rs`** (NEW; a test crate, never in the built lib):
  `struct ThermoClass; impl PuzzleClass for ThermoClass { type Clue = Thermometer (= Vec<usize>);
  type Puzzle = (Vec<u32>, Vec<Thermometer>); … }` — the third family plugs into the RS trait with a
  clue kind neither `()` (sudoku) nor `(usize,usize)` (futoshiki), ZERO trait edits. A local
  `deal_via_trait<C: PuzzleClass>` (W13's `generate_by_digging<C>` shape) drives every seam;
  `#[test]` asserts the seed is dense/0-free and the dealt puzzle carries its `Vec<Thermometer>`.

**Compile proof**: `vue-tsc -b --force` → exit 0 with EVERY shell + both shipped declarations
byte-unchanged; `cargo build` → exit 0 (the trait compiles); `cargo test --workspace` → the
`thermo_sudoku_plugs_into_the_contract_unchanged` test GREEN. The stub required editing **zero**
existing files — only NEW files.

## 4. BOUNDARY NOTES

- **ESLint grammar allows the registry to import both games — NO rule addition needed.** The four
  scoped `no-restricted-imports` globs are `pencil/**`, `games/sudoku/**`, `games/futoshiki/**`,
  `games/shared/**`. `games/registry.ts` sits OUTSIDE all four (it is the registration point, not the
  game-agnostic shared floor), so its `import { sudokuGame } from "@games/sudoku/game"` +
  `futoshikiGame` are unrestricted. The `games/shared/**` three-home tripwire is untouched — the
  contract does NOT live in `shared/`, so the shared floor stays game-agnostic. eslint → exit 0.
- **The difficulty-mirror lesson (the invariant caught it).** My first draft minted `type
  GameDifficulty = "EASY" | "MEDIUM" | "HARD"` in registry.ts — a FOURTH difficulty mirror, exactly
  the D10c/T8 anti-pattern `csp-solver/tests/difficulty_parity.rs` guards (its scanner flagged
  `registry.ts`). Distilling means NOT adding duplication, so the fix was at the SOURCE — erase the
  tiers to `string` at the contract boundary (they stay per-game per `shared/types.ts`), NOT register
  a new mirror in the parity test. `difficulty_parity` passes **2/2 UNEDITED**.
- **The registry ↔ game-declaration import cycle is benign**: `defineGame` is a hoisted `function`, so
  it resolves at module init; the cycle exists only in the test graph (vitest/vue-tsc tolerate it) —
  the registry is tree-shaken from the app build, so it never reaches Rollup.

## 5. GATES

| Gate | Probe | Result |
|---|---|---|
| contract exists (FE) | `grep -rl defineGame src` | **registry.ts + sudoku/game.ts + futoshiki/game.ts** (+ the test stub) — was EMPTY, born RED → GREEN |
| stub compiles, zero shell edits | `vue-tsc -b --force` ; `git diff --stat -- games/shared/` | vue-tsc **exit 0**; games/shared diff **EMPTY** (KEY modified no tracked shell; shell mtimes 19:52–20:59 all predate KEY's 21:26–21:34 writes) |
| rust stub compiles | `cargo build` ; `cargo test` (thermo) | `cargo build` **exit 0**; `thermo_sudoku_plugs_into_the_contract_unchanged` **ok** |
| **battery — types** | `vue-tsc -b --force` | exit **0** |
| **battery — unit** | `npm run test:unit` | **273 passed / 22 files** (the 271 baseline UNEDITED + 2 additive acceptance tests) |
| **battery — eslint** | `npm run lint:eslint` | exit **0** (registry outside the 4 boundary globs; no rule addition) |
| **battery — knip** | `npm run lint:knip` | exit **0** (registry + both game.ts consumed by the test entry; stub is dead-by-design in a `.test.ts`) |
| **battery — prettier** | `npx prettier --check src/` | exit **0** ("All matched files use Prettier code style!") |
| **battery — build** | `npm run build` | exit **0**, **191 modules** (registry tree-shaken out — dist byte-identical to R1–R4) |
| **invariant — e2e** | default suite, `PLAYWRIGHT_BASE_URL=:4592`, temp webServer-free mirror | **63 passed** (12.9s), UNEDITED |
| **invariant — goldens (π)** | `npm run test:golden`, `:4592` | **4/4 passed** (3.4s) — `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` byte-for-π (logo-light clean) |
| **invariant — rust** | `cargo fmt --check` · `cargo clippy --workspace --all-targets -- -D warnings` · `cargo test --workspace` | fmt clean · clippy **exit 0** (the `proc-macro-error2` future-incompat is RS's pre-existing transitive note) · **ALL green** — 174 baseline UNEDITED + RS's 4 (`puzzle_class`) + KEY's 1 (`thermo_acceptance`); `difficulty_parity` 2/2 unedited |

Full e2e census **68 = 63 default + 4 golden + 1 throttle**; the 15 CEN SHA-256-stamped spec/config
files untouched. No existing test edited (the invariant passes UNEDITED — x6 A6). Temp
`playwright.key-verify.config.ts` deleted, `:4592` preview killed, `:3000`/`:3001` never touched.

## Footprint (clean, additive — NEW files only)

```
?? web/frontend/src/games/registry.ts                 (the contract: GameDefinition + defineGame + gameRegistry)
?? web/frontend/src/games/registry.test.ts            (FE acceptance stub — Thermo defineGame + contract asserts)
?? web/frontend/src/games/sudoku/game.ts              (sudokuGame = defineGame<…, void>)
?? web/frontend/src/games/futoshiki/game.ts           (futoshikiGame = defineGame<…, Inequality[]>)
?? csp-solver/tests/thermo_acceptance.rs              (rust acceptance stub — impl PuzzleClass for ThermoClass)
```

No commit (team lead commits). Tree left additive. The keystone is a DECLARATION layer — it removes
no LOC (the ≥1,600 floor is R1–R4's; R4's record notes the structural `use<Game>` residual); it names
the contract the four shells produce, so W12's `GameCard` and W13's third game are additive.
