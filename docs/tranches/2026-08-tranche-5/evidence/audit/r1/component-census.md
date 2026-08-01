# Component census — web/frontend

Commit `71456713d9f7361af80f09e1a456fc9787507e78` (branch master, clean tree). Read-only census, 2026-08-01.
All paths are repo-relative to `web/frontend/` unless prefixed otherwise. Census truth only — no proposals.

## 0. Method + provenance

| Instrument | What it did | Where |
|---|---|---|
| `graph.mjs` | resolved every static/dynamic/`new URL(...)`/`@import` specifier through the three tsconfig aliases; forward + reverse edges; reachability from `src/main.ts` + `src/App.vue` | scratchpad, reproduced below |
| `dup.mjs` | line-LCS over comment-stripped, game-name-neutralized sources | §2 |
| `pair.sh` | `diff` over comment-stripped, name-neutralized pairs — CODE-diff-lines | §2 |
| `props.mjs` | `defineProps`/`defineEmits`/`<slot>` extraction vs. all parent bind sites | §3 |
| `tokens.mjs` / `css.mjs` | `@theme` token declarations vs. `var()` + Tailwind-utility references; CSS class selectors vs. all of `src/`, `index.html`, `e2e/` | §4 |
| `exports.mjs` | every named export vs. all consumers, prod-only and test-inclusive | §5 |
| `npx knip` (v6.26.0) | repo's own dead-code gate | exit `0`, no output |

`knip` is green. Every row below that `knip` does not report is a row `knip`'s reachability model
(which includes `e2e/**` and `*.test.ts` as entries, and counts same-file use as use) does not look for.
Both facts are true at once; where they disagree the disagreement is named.

### Corpus

```
$ find src -name '*.vue' | wc -l        60
$ find src -name '*.ts'  | wc -l       125   (31 of them *.test.ts)
$ find src -name '*.css' | wc -l         4
$ find src \( -name '*.vue' -o -name '*.ts' -o -name '*.css' \) | xargs wc -l | tail -1
                                     34223 total
$ ... ! -name '*.test.ts'            29381 total  (non-test)
$ ls e2e/*.spec.ts | wc -l              20
```

| Directory | .vue | .ts (non-test) | .test.ts | .css | LOC (non-test) |
|---|---:|---:|---:|---:|---:|
| `src/pencil` | 30 | 17 | 1 | 0 | 10,877 |
| `src/games/shared` | 8 | 29 | 13 | 2 | 8,619 |
| `src/games/futoshiki` | 5 | 9 | 4 | 0 | 2,160 |
| `src/games/sudoku` | 4 | 10 | 5 | 0 | 1,767 |
| `src/games/kenken` | 4 | 9 | 2 | 0 | 1,324 |
| `src/games/killer` | 4 | 8 | 2 | 0 | 1,269 |
| `src/games/thermo` | 4 | 8 | 2 | 0 | 1,224 |
| `src/assets` | 0 | 0 | 0 | 2 | 1,121 |
| `src/composables` | 0 | 1 | 1 | 0 | 41 |
| `src/lib` | 0 | 1 | 0 | 0 | 13 |

Two thirds of non-test LOC (19,496 / 29,381) sits in `pencil` + `games/shared`. The five game
dirs together are 7,744 LOC — 26%.

---

## 1. IMPORT GRAPH

Entry points: `index.html` → `src/main.ts:9-12` → `src/App.vue`. No router exists (`useGameGallery.ts:8`
states the no-router invariant). The `defineGame` registry (`src/games/registry.ts:121`) is reached from
`App.vue` via `import { GAMES } from "@games/registry"`.

- Modules in graph: **189**
- Reachable from `main.ts` + `App.vue`: **156**
- Not reachable: **33** — 31 `*.test.ts`, plus the two rows below.

### 1.1 Orphans (nothing reachable from an app entry imports them)

| File | Status | Evidence |
|---|---|---|
| `src/pencil/config/filterBudget.ts` (218 LOC) | Not in the app graph at all. Its only importer is a Playwright spec. | `e2e/filter-census.spec.ts:7-13` imports `FILTER_BUDGET, FILTER_BUDGET_AREA_TOLERANCE, FILTER_BUDGET_CEILING, FILTER_BUDGET_TOTAL, FILTER_BUDGET_UNION_AREA, PER_CELL_SCOPE` from `../src/pencil/config/filterBudget`. Zero `src/**` importers (`grep -rn filterBudget src` returns only prose references: `pencilConfig.ts:238`, `SvgFilters.test.ts:38`, `HandwrittenGlyph.vue:58`). |
| `src/games/shared/gameCell.css`, `src/games/shared/scene.css` | Reached only through Vue SFC `<style scoped src=…>`, which no specifier resolver sees. | `SudokuCell.vue:294`, `FutoshikiCell.vue:293` (`gameCell.css`); `GameScene.vue:120` (`scene.css`). `knip.json:4` explicitly ignores both — the tool has the same blind spot and it was papered over rather than resolved. |

**No true orphan .vue exists.** Every one of the 60 `.vue` files is reachable.

### 1.2 Single-consumer modules

**77 of 189 modules (41%) have exactly one non-test importer.** Full list emitted by `graph.mjs`.
The load-bearing subsets:

*Fan-out-1 leaves owned by one shell* — `GameControlPanel.vue` alone is the sole importer of 11 modules:
`CheckStatus.vue`, `DifficultyTally.vue`, `useButtonAnimation.ts`, `BoilDivider.vue`, `KeyboardLegend.vue`,
`SheetWashiLabel.vue`, and 7 of the 8 icons (`EraserIcon`, `FillForcedIcon`, `HintIcon`, `RedoIcon`,
`ShareIcon`, `SolveIcon`, `UndoIcon` — `DiceIcon` has 2).
`GameBoard.vue` is the sole importer of 5: `SolverErrorNote.vue`, `solveTally.ts`, `CelebrationHeart.vue`,
`CompletionVignette.vue`, `HandDrawnGrid.vue`.

*Registry-only components* — 9 modules are imported by `registry.ts` and nothing else:
`FutoshikiGame.vue`, `KenKenGame.vue`, `KillerGame.vue`, `ThermoGame.vue`, `sudoku/game.ts`,
and all five `*Poster.vue`.

*Per-game chains, 1-in/1-out, ×5* — `<Game>.vue → <Game>Board.vue`, `use<Game>.ts → <game>UrlState.ts`,
`useSolver.ts → solver.worker.ts`, `useSolver.ts → <game>Wire.ts`. Every link is single-consumer by
construction; see §2.

### 1.3 Fan-in leaders (non-test importers)

```
23  src/pencil/config/pencilConfig.ts        10  src/games/shared/useUserMarks.ts
14  src/games/sudoku/types.ts                 9  src/games/shared/solver/solverError.ts
12  src/games/futoshiki/types.ts              8  kenken/killer/thermo types.ts (8 each)
10  src/games/shared/techniqueEngine.ts       7  src/games/registry.ts, boilBeat.ts, HandDrawnOutline.vue
```

### 1.4 Re-export shells

Only two, both partial (they also declare their own types):

| File | Re-export | Evidence |
|---|---|---|
| `src/games/sudoku/types.ts` | 2 non-comment lines: one local `Difficulty`, one `export type { SolveState, SolveStats } from "../shared/types"` | `types.ts:10`, `types.ts:14` |
| `src/games/futoshiki/types.ts` | 4 non-comment lines, same shape | `types.ts:18` (re-export), `:28`, `:30`, `:39` |

Both files document the shell as deliberate ("re-exported here so every existing consumer is untouched
(ballot Q3, one home)" — `sudoku/types.ts:12-13`). `thermo/types.ts`, `killer/types.ts`, `kenken/types.ts`
did **not** get the same shell — they import `Difficulty` cross-game instead (§5.1).

### 1.5 Alias surface

`tsconfig.json:16-20` and `vite.config.ts:203-207` declare three aliases. Usage:

- `@pencil/*`, `@games/*` — the two boundary aliases, in wide use.
- `@/*` — **10 import sites total**, of which 6 are `@/composables/useTheme` and 2 are
  `@/lib/base64url`: `OptionSelector.vue:2`, `GameCard.vue:33`, `HandwrittenLogo.vue:10`,
  `DarkModeToggle.vue:342`, `HandDrawnGrid.vue:14`, `sudoku/useUrlState.ts:1`,
  `futoshiki/useUrlState.ts:12`, `HandwrittenLogo.vue:25` (`?inline` font), plus 2 in tests.
  `@/` exists to reach exactly two leaf modules that sit outside both `pencil/` and `games/`.
- Zero `../../` deep-traversal imports anywhere in `src/` (`grep -rn 'from "\.\./\.\./' src` → empty).
  The alias grammar is uniform; that is a clean row.

---

## 2. DUPLICATION across the five games

Method: strip block/line comments and blank lines, replace every game-name token
(`sudoku|futoshiki|thermo|killer|kenken`, all cases) with `G`, then `diff`. **CODE-diff-lines** counts
`<` plus `>` lines — a one-line substitution shows as 2.

### 2.1 The near-clone table

| Family | Pair | code LOC each | CODE-diff-lines | Verdict |
|---|---|---:|---:|---|
| `Game.vue` | thermo ↔ killer | 119 / 119 | **2** | drift-identical |
| `Game.vue` | killer ↔ kenken | 119 / 117 | **4** | drift-identical |
| `solver/protocol.ts` | thermo ↔ killer | 61 / 61 | **6** | drift-identical |
| `<g>UrlState.ts` | thermo ↔ killer | 74 / 74 | **6** | drift-identical |
| `game.ts` | thermo ↔ killer | 35 / 35 | **8** | drift-identical |
| `solver/solver.worker.ts` | thermo ↔ killer | 99 / 96 | **13** | near-identical |
| `Board.vue` | thermo ↔ killer | 207 / 207 | **14** | near-identical |
| `<g>UrlState.ts` | killer ↔ kenken | 74 / 74 | **14** | near-identical |
| `game.ts` | thermo ↔ kenken | 35 / 35 | 20 | near-identical |
| `Cage.vue` | killer ↔ kenken | 131 / 133 | 22 | near-identical |
| `solver/useSolver.ts` | thermo ↔ killer | 123 / 123 | 24 | near-identical |
| `Cell.vue` | sudoku ↔ futoshiki | 259 / 255 | 56 | diverged |
| `Board.vue` | thermo ↔ kenken | 207 / 176 | 65 | diverged |
| `useUrlState.ts` | sudoku ↔ futoshiki | 218 / 258 | 130 | diverged |

### 2.2 The two-line clone — `ThermoGame.vue` vs `KillerGame.vue`

After name neutralization these 119-code-line components differ by exactly one substitution:

```
- :Gmeters="G.Gmeters.value"        (src/games/thermo/ThermoGame.vue:104)
+ :cages="G.cages.value"            (src/games/killer/KillerGame.vue:94)
```

`KillerGame.vue` vs `KenKenGame.vue` differ by two substitutions (`ThermoGame.vue:155`,
`KillerGame.vue:145`, `KenKenGame.vue:144` raw LOC):

```
- :size="G.size.value"  /  :difficulty="G.difficulty.value"  /  :subgrid-size="G.size.value"
+ :subgrid-size="G.boardSize.value"
```

### 2.3 `ThermoBoard.vue` vs `KillerBoard.vue` — 14 diff-lines, 7 substitutions, **4 of them prose**

The full code delta (255 raw LOC each, 207 code lines each):

| Kind | thermo | killer |
|---|---|---|
| import | `import GTube from "./GTube/GTube.vue"` (`ThermoBoard.vue:15`) | `import GCage from "./GCage/GCage.vue"` (`KillerBoard.vue:15`) |
| type import | `import type { GLine } from "./types"` (`:20`) | `import type { GCage as GCageClue } from "./types"` (`:20`) |
| prop | `Gmeters: GLine[]` (`:34`) | `cages: GCageClue[]` (`:34`) |
| overlay | `<GTube :Gmeters="Gmeters" :board-size="boardSize" />` (`:227`) | `<GCage :cages="cages" :board-size="boardSize" />` (`:227`) |
| comments | `:7-10`, `:96-98`, `:223-224`, `:234-235`, `:245` | same lines, cage wording |

Every other line — grid scaffold, reveal wave, roving-tabindex ARIA, marginalia machine, completion
vignette, paper-note host, drawer voice, draw/erase state machine, scoped CSS — is byte-identical after
neutralization. The divergence is **one slot name and one type name**.

`thermoUrlState.ts` ↔ `killerUrlState.ts` is the same story at 74 code lines:

```
- import type { GLine } from "../types"  /  Gmeters: GLine[]  /  Gmeters: (p.Gmeters as GLine[]) ?? []
+ import type { GCage } from "../types"  /  cages: GCage[]    /  cages: (p.cages as GCage[]) ?? []
```

`thermo/solver/protocol.ts` ↔ `killer/solver/protocol.ts`, 61 code lines, differs in **3 lines**, all the
same substitution: `Gmeters: Uint32Array;` → `cages: Uint32Array;` (thrice, once per frame in the union).

### 2.4 Similarity matrix vs. the family base (whole-family LCS, name-neutralized)

| Family | futoshiki | thermo | killer | kenken | base |
|---|---:|---:|---:|---:|---|
| `Game.vue` | 88.0% | 81.7% | 81.7% | 78.5% | `SudokuGame.vue` (143) |
| `Board.vue` | 63.9% | **92.8%** | **92.8%** | 79.2% | `SudokuBoard.vue` (176) |
| `solver/protocol.ts` | 87.6% | **95.0%** | **95.0%** | 86.0% | `sudoku/solver/protocol.ts` (59) |
| `solver/solver.worker.ts` | 83.0% | 88.2% | 89.6% | 85.9% | `sudoku/.../solver.worker.ts` (87) |
| `solver/useSolver.ts` | 67.2% | 79.8% | 79.8% | 69.7% | `sudoku/solver/useSolver.ts` (115) |
| `game.ts` | 68.7% | 82.4% | 82.4% | 61.8% | `sudoku/game.ts` (33) |
| `use<Game>.ts` | 51.2% | 64.9% | 64.3% | 39.1% | `useSudoku.ts` (52) |
| `urlState` | 72.7% | 20.5% | 20.5% | 19.2% | `sudoku/useUrlState.ts` (218) |
| `Poster.vue` | 9.0% | 23.1% | 25.0% | 21.4% | `SudokuPoster.vue` (24) |

### 2.5 Diverged for a reason vs. diverged by drift

**Diverged for a reason** (a named, structural cause is visible in the code):

| Pair | Reason | Evidence |
|---|---|---|
| `sudoku/useUrlState.ts` (302) vs the three `<g>UrlState.ts` (108/109/109) | The Sudoku/Futoshiki pair carry a full `?board=` permalink codec (base64url + version byte + v0 ratchet); thermo/killer/kenken carry persistence only. | `sudoku/useUrlState.ts:1` imports `@/lib/base64url`; `thermo/thermoUrlState.ts` has no such import. `sudoku/useUrlState.ts:100` "digit-led legacy body → ≥ 0x30. Either way, version 0." |
| `FutoshikiBoard.vue` (317) vs `SudokuBoard.vue` (218) | Caret furniture layer + inequality geometry. | `FutoshikiBoard.vue` imports `FutoshikiCaret.vue`; 63.9% similarity is the lowest in the Board family. |
| `FutoshikiPoster.vue` (136) vs the other four Posters (36/38/42/45) | Renders carets inline rather than delegating to a furniture component. | `FutoshikiPoster.vue:102-108` inlines `HandwrittenGlyph` props; `KillerPoster.vue:33-36` delegates to `<KillerCage>` in the `#overlay` slot. 9.0% similarity to base. |
| `KenKenBoard.vue` (222) vs `ThermoBoard.vue` (255) | KenKen is a plain Latin square (no subgrid bands), so it loses the box-line block. | `KenKenGame.vue:112` binds `:subgrid-size="kenken.boardSize.value"` where killer binds `killer.size.value`. |

**Diverged by drift** (no cause in the code; the delta is a name):

- `ThermoGame.vue` / `KillerGame.vue` / `KenKenGame.vue` — §2.2.
- `ThermoBoard.vue` / `KillerBoard.vue` — §2.3. 4 of the 7 substitutions are comment prose.
- `thermoUrlState.ts` / `killerUrlState.ts` / `kenkenUrlState.ts` — §2.3; 6 and 14 diff-lines.
- `thermo|killer|kenken/solver/protocol.ts` — 6 diff-lines thermo↔killer, all one rename.
- `ControlPanel/constants.ts` × 3 — the `difficultyOptions` array is **byte-identical** in all three
  (`sudoku/ControlPanel/constants.ts:11-19`, `futoshiki/…:16-31`, `kenken/…:24-31`): same
  `EASY/MEDIUM/HARD` values, same labels, same `crayon-green/orange/rose` colorClass.
  `kenken/ControlPanel/constants.ts:22-23` calls itself "twin of the sudoku/futoshiki
  `ControlPanel/constants.ts`" in its own docstring.

### 2.6 Aggregate

Summing the five-way families at their per-family base LOC, the *neutralized-identical* mass across
`Game.vue` + `Board.vue` + `protocol.ts` + `solver.worker.ts` + `useSolver.ts` + `game.ts` +
`use<Game>.ts` + `urlState` is **≈1,970 of 3,395 non-base code lines** (58%). The thermo/killer pair
alone contributes ~740 code lines that differ in 73 diff-lines total across 7 files.

---

## 3. OVERFIT / CONTRIVED candidates

### 3.1 Dead props — declared, bound by every caller, never read

| Row | Evidence |
|---|---|
| **`AnswerKeyLaminate.vue:29` `subgridSize: number`** — a **required** prop. Bound by all five callers. The component never references it: the only `props.` reads in the file are `props.active` (`:65`), `props.boardSize` (`:111`), `props.originalGivenCells` (`:116`), `props.solution` (`:120`). | Bind sites: `SudokuGame.vue:189`, `FutoshikiGame.vue:146`, `ThermoGame.vue:123`, `KillerGame.vue:113`, `KenKenGame.vue:112`. `grep -n subgridSize src/pencil/sheet/AnswerKeyLaminate.vue` → line 29 only. |
| **`GameBoard.vue:81` `cornerMarks?`, `GameBoard.vue:82` `centerMarks?`** — declared, bound by all five Boards, never referenced anywhere else in `GameBoard.vue`. The Boards *also* bind the same data straight onto the cell, which is the path that actually renders. | Declared `GameBoard.vue:81-82`. Bound onto `<GameBoard>` at `SudokuBoard.vue:166-167`, `FutoshikiBoard.vue:221-222`, `ThermoBoard.vue:170-171`, `KillerBoard.vue:170-171`, `KenKenBoard.vue:137-138`. The live path is the sibling bind onto the cell: `SudokuBoard.vue:207-208`, `FutoshikiBoard.vue:262-263`, `ThermoBoard.vue:211-212`, `KillerBoard.vue:211-212`, `KenKenBoard.vue:178-179`. `grep -n 'cornerMarks\|centerMarks' src/games/shared/GameBoard.vue` → 81, 82 only. |

Checked and **not** dead (recorded so the row is not re-opened):
`SudokuCell.vue:41` / `FutoshikiCell.vue:45` `pencilMode` reaches `useGameCell.ts:142` via `props`;
`*Game.vue` `leaving` is bound at `App.vue:498` through `<component :is>`; `PosterBoard.vue:48` `label`
is read at `:94-96`.

### 3.2 Emits and slots

Zero unfilled slots. Zero declared-but-never-emitted events. `props.mjs` produced two candidates, both
false positives on inspection: `GameControlPanel.vue` `update` is the `update:errorCheckMode` v-model
seam (`GameControlPanel.vue:125`); `GameGallery.vue` `payload` is a type-level parameter name inside the
`defineEmits<{}>` signature (`GameGallery.vue:82`), not an event.

### 3.3 Config surfaces with exactly one caller

Four exports of `pencilConfig.ts` have exactly one consumer, and it is the same dev-only component:

| Export | Sole consumer |
|---|---|
| `resetBoilConfig` (`pencilConfig.ts:224`) | `src/pencil/dev/FilterTuner.vue` |
| `resetPreset` (`pencilConfig.ts:370`) | `src/pencil/dev/FilterTuner.vue` |
| `resetAllPresets` (`pencilConfig.ts:375`) | `src/pencil/dev/FilterTuner.vue` |
| `DEFAULT_PRESETS` (`pencilConfig.ts:381`) | `src/pencil/dev/FilterTuner.vue` |

`FilterTuner.vue` is itself dev-gated (`App.vue:77` `const FilterTuner = import.meta.env.DEV ? … : null`;
mounted at `App.vue:461`), so this is a four-export config surface whose entire reason for existing is a
component absent from production builds.

Two more single-consumer config exports: `revealStaggerMs` (`pencilConfig.ts:493`) ← `GameBoard.vue`;
`wavefrontStepMs` (`pencilConfig.ts:505`) ← `HandwrittenGlyph.vue`. `FilterPreset` (`pencilConfig.ts:90`)
← `SvgFilters.vue` alone.

### 3.4 Dead config sub-keys

`PENCIL` (`pencilConfig.ts:6-13`) has 6 keys. **One is used**: `fruitOutline`, at
`CrayonHeart.vue:76`. Dead: `gridFrame` (`:8`), `gridSubgrid` (`:9`), `gridCell` (`:10`),
`logoText` (`:11`), `vine` (`:12`) — `grep -rn -F "PENCIL.gridFrame" src e2e` and the four siblings all
return empty. (The identically-named `DRAW_IN_PRESETS.gridFrame/gridSubgrid/gridCell` at
`pencilConfig.ts:417/424/431` *are* live via `usePathAnimation.ts` — a name collision that makes the dead
`PENCIL.*` keys read as used at a glance.)

`YOSHI_COLORS` (`pencilConfig.ts:17-60`) has 8 top-level keys. Live: `outlineBlack`, `heart`, `leaf.fill`,
`celestial`. Dead: **`apple` (`:31`), `banana` (`:32`), `grapes` (`:33`), `flower` (`:34`),
`vine` (`:36`)** — zero references in `src/` or `e2e/`. `leaf.vein` (`:35`) is dead
(`grep -rn '\.vein\b' src` excluding pencilConfig → empty); only `leaf.fill` is read, at
`CrayonHeart.vue:121`.

Consumers of `YOSHI_COLORS`: `CrayonHeart.vue:63`, `CelebrationStar.vue:25`, `DarkModeToggle.vue:357-358`
— three files reading `heart.*`, `leaf.fill`, `outlineBlack`, `celestial.sun.*`, `celestial.moon.*`.
A 44-line mascot-fruit palette survives to feed one heart.

### 3.5 Components doing one trivial thing

| Component | LOC | What it does |
|---|---:|---|
| `SudokuPoster.vue` | 36 | a 9×9 literal + a 5-line row/col→key loop + `<PosterBoard :board-size="9" :subgrid-size="3" :values="values" />` (`:35`) |
| `KillerPoster.vue` | 38 | a 3-entry `values` literal + an 8-entry `CAGES` literal + `<PosterBoard>` with one `#overlay` (`:33-37`) |
| `ThermoPoster.vue` | 42 | same shape |
| `KenKenPoster.vue` | 45 | same shape |
| `useButtonAnimation.ts` | 14 | `ref(false)` + a `setTimeout` that flips it back. Sole consumer `GameControlPanel.vue`. |
| `useLiveFace.ts` | 36 | one module-level `ref<HTMLElement|null>` + a setter + a getter. 22 of the 36 lines are the docblock. |
| `src/games/shared/constants.ts` | 8 | one string: `export const BOARD_CELLS_CLASS = "board-cells"` (`:8`). 7 lines of docblock. |
| `src/pencil/types.ts` | 1 | `export type AnimationState = "hidden" \| "drawing" \| "drawn" \| "erasing"` |
| `src/games/thermo/types.ts` | 15 | one line of type (`export type ThermoLine = number[]`, `:15`), 14 of docblock |
| `src/lib/base64url.ts` | 13 | the whole of `@/lib` — 2 consumers |
| `src/composables/useTheme.ts` | 41 | the whole of `src/composables/` — the only module in the tree that is neither `pencil/` nor `games/`, reached by 5 `pencil` files through the `@/` alias |

### 3.6 Indirection depth

The solver path is 6 layers deep per game, ×5:

```
<Game>.vue → composables/use<Game>.ts → solver/useSolver.ts → shared/solver/transport.ts
                                      → solver/protocol.ts  → solver/solver.worker.ts
                                      → solver/<g>Wire.ts   (thermo/killer/kenken only)
```

Every hop except `transport.ts` (5 consumers) and `shared/solver/protocol.ts` (6) is single-consumer.
`shared/solver/protocol.ts` is 31 lines carrying 3 interfaces (`PingRequest:18`, `PingResponse:25`,
`SolverErrorResponse:31`); each per-game `protocol.ts` (75–83 lines) composes its union from them.

### 3.7 Residual directories

`src/games/{sudoku,futoshiki,kenken}/ControlPanel/` each contain **exactly one file, `constants.ts`** —
there is no `ControlPanel.vue` anywhere in the tree (the panel is `src/games/shared/GameControlPanel.vue`).
`thermo/` and `killer/` have no `ControlPanel/` directory at all; they import sudoku's
(`thermo/game.ts:18`, `killer/game.ts:19`). A 3-of-5 folder convention named after a component that
does not live in it.

---

## 4. UI-LIBRARY RESIDUE

### 4.1 shadcn-style patterns — none

```
$ grep -rn "\bcn(\|clsx\|tailwind-merge\|twMerge\|cva(\|class-variance\|data-slot\|@radix\|shadcn\|forwardRef" src/
(no matches)
```

No `cn()`/`clsx` helper, no `class-variance-authority` variant system, no copied primitive components,
no `data-slot` attributes, no Radix. `package.json` dependencies are 6: `@mkbabb/csp-solver-wasm`,
`@mkbabb/pencil-boil`, `@tailwindcss/vite`, `@vueuse/core`, `tailwindcss`, `vue`. No UI kit is installed.
This section is clean except for §4.2.

### 4.2 Unused Tailwind theme tokens — the shadcn default palette, unwired

`src/assets/index.css:104` opens `@theme` with 59 distinct custom properties. **15 have zero `var()`
reference and zero Tailwind-utility reference anywhere in `src/**`, `index.html`, or `e2e/**`:**

| index.css:line | Token | Dark twin |
|---|---|---|
| `:137` | `--color-card-foreground` | `:368` |
| `:139` | `--color-popover-foreground` | `:370` |
| `:140` | `--color-primary` | `:371` |
| `:141` | `--color-primary-foreground` | `:372` |
| `:142` | `--color-secondary` | `:373` |
| `:143` | `--color-secondary-foreground` | `:374` |
| `:147` | `--color-accent-foreground` | `:377` |
| `:148` | `--color-destructive` | `:379` |
| `:149` | `--color-destructive-foreground` | `:380` |
| `:151` | `--color-input` | `:382` |
| `:129` | `--font-serif` | — |
| `:159` | `--color-easy` | — |
| `:160` | `--color-medium` | — |
| `:161` | `--color-hard` | — |
| `:268` | `--ink-press-firm` | — |

Ten of the fifteen (`card-foreground`, `popover-foreground`, `primary`, `primary-foreground`,
`secondary`, `secondary-foreground`, `accent-foreground`, `destructive`, `destructive-foreground`,
`input`) are the shadcn/ui default token names with shadcn's default HSL values —
e.g. `--color-destructive: hsl(0 84.2% 60.2%)` (`:148`) is shadcn's literal light-mode destructive.
They are declared twice each (light + `.dark`), so **25 declaration lines** carry them.
`--radius: 0.625rem` (`:105`) is shadcn's default radius; the corpus uses `rounded-*` utilities so it is
recorded as reachable, not dead.

`--color-easy` / `--color-medium` / `--color-hard` (`:159-161`) alias the crayon vars but nothing reads
them — the difficulty colors reach the DOM through the `colorClass: "crayon-green|orange|rose"` strings in
`ControlPanel/constants.ts`, not through these aliases. `index.css:385` carries a comment explaining why
they have no dark override; the comment outlived the consumer.

UNKNOWN: whether Tailwind 4.3's `@theme` emits unreferenced variables into `dist/`. Not measured — no
build was run (read-only discipline). The source declaration is dead regardless.

Single-use tokens (18 of 59) are listed by `tokens.mjs`; the notable cluster is
`--color-solver-ink-1..5` (`index.css:206-210`), all five read only by `SvgFilters.vue`.

### 4.3 Dead CSS selectors — none

`css.mjs` cross-referenced every class selector in all four stylesheets against `src/**`, `index.html`,
and `e2e/**`:

| Stylesheet | distinct classes | with no reference |
|---|---:|---:|
| `src/assets/index.css` | 45 | **0** |
| `src/assets/typography.css` | 2 | **0** |
| `src/games/shared/gameCell.css` | 16 | **0** |
| `src/games/shared/scene.css` | 12 | **0** |

### 4.4 Style dual-paths

No global/scoped duplicate found. The two shared stylesheets are consumed exclusively through
`<style scoped src=…>` (`SudokuCell.vue:294`, `FutoshikiCell.vue:293`, `GameScene.vue:120`) — the
scoping attribute is applied per-consumer, so the rules exist once on disk and once per scope in the
build. `gameCell.css:4` and `scene.css:3` both document this as the intended single-source mechanism.

One recorded quirk, not a duplicate: `AttributionCard.vue:105` documents a `font-family: inherit` that
Vue's `[data-v-*]` scoping attribute defeated.

---

## 5. LEGACY / DUAL-PATH

### 5.1 The cross-game boundary is enforced for 2 of 20 ordered pairs

`eslint.config.js` declares four boundary configs (`:196-199`): `pencilMayNotImportGames`,
`sudokuMayNotImportFutoshiki` (`:57`), `futoshikiMayNotImportSudoku` (`:81`), `sharedMayNotImportGames`.
The rule messages state the invariant flatly — "games never import each other"
(`eslint.config.js:78`, `:105`).

There is **no rule for thermo, killer, or kenken.** Twenty cross-game imports exist:

*thermo → sudoku (7):*
`thermo/composables/useThermo.ts:24` (`@games/sudoku/technique/sudokuTechnique`),
`thermo/game.ts:16` (`SudokuCell.vue`), `thermo/game.ts:18` (`@games/sudoku/ControlPanel/constants`),
`thermo/game.ts:19`, `thermo/ThermoBoard.vue:14`, `thermo/ThermoBoard.vue:19`,
`thermo/composables/thermoUrlState.ts:13`, `thermo/solver/useSolver.ts:13`.

*killer → sudoku (6):*
`killer/game.ts:17`, `killer/game.ts:19`, `killer/game.ts:20`,
`killer/composables/useKiller.ts:25`, `killer/KillerBoard.vue:14`, `killer/KillerBoard.vue:19`,
`killer/composables/killerUrlState.ts:14`, `killer/solver/useSolver.ts:13`.

*kenken → futoshiki (6):*
`kenken/KenKenBoard.vue:15` (`FutoshikiCell.vue`), `kenken/composables/kenkenUrlState.ts:14`,
`kenken/game.ts:18`, `kenken/game.ts:21`, `kenken/ControlPanel/constants.ts:1`,
`kenken/composables/useKenken.ts:27`, `kenken/solver/useSolver.ts:14`.

Two direct contradictions between a stated rule and the code at the same commit:

1. `registry.ts:33-35`: *"a game never depends on another's ControlPanel constants for its own range
   sub-line."* — `thermo/game.ts:18` and `killer/game.ts:19` both
   `import { sizeOptions, difficultyOptions } from "@games/sudoku/ControlPanel/constants"`.
2. `kenken/ControlPanel/constants.ts:5-6`: *"own file (games never depend on another game's
   ControlPanel constants for their own selector data)"* — the same file's line 1 is
   `import type { Difficulty } from "@games/futoshiki/types"`.

The `pencilDepthPattern` depth guard (`eslint.config.js:26-32`) applies to `@pencil/*` only, so
`@games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue` (depth 3 into another game's private subtree,
`thermo/game.ts:16`, `killer/game.ts:17`, `thermo/ThermoBoard.vue:14`, `killer/KillerBoard.vue:14`) is
unguarded. `src/games/shared` is clean — zero `@games/<game>` imports.

### 5.2 Migration shims / fallback branches

| Row | Evidence |
|---|---|
| **v0 permalink ratchet** — the `?board=` codec tolerates a body with no version byte. Live dual-path. | `sudoku/composables/useUrlState.ts:100` "Empty payload → NaN; a digit-led legacy body → ≥ 0x30. Either way, version 0."; `futoshiki/composables/useUrlState.ts:127` identical. Test coverage at `sudoku/composables/useUrlState.test.ts:82`. |
| **Futoshiki pre-difficulty boards** — a saved board from before difficulty was persisted is tolerated by falling back to a tier. | `futoshiki/composables/useUrlState.ts:90` "Tolerate a legacy board saved before difficulty was persisted (or a corrupt tier)". |
| **Excised sudoku template tiers** — `TEMPLATE_BANK[size]?.[…] ?? []` masks a whole missing bank subtree; the build plugin writes `[]` for any tier whose directory is absent. | `vite.config.ts:45-52` (`if (!existsSync(dir)) { bank[n][d] = []; continue }`). `templates.ts:7` ships `"3":{"easy":[],"medium":[],"hard":[…]}` — two empty tiers on disk today. |
| **`__resetStagingBridge`** — a test-only escape hatch exported from a production module, name-prefixed to mark it. | `src/games/shared/useStagingBridge.ts:254`. Sole consumer `useStagingBridge.test.ts`. |
| Empty `catch {}` | Exactly one in the tree, in the dev-only tuner: `src/pencil/dev/FilterTuner.vue:234`. |

### 5.3 Feature flags

Two `import.meta.env.DEV` gates, both statically inlined and both real (they toggle between builds,
not between one value):

- `src/main.ts:5` → `void import("@pencil/dev/rafInstrumentation")`
- `src/App.vue:77` → `const FilterTuner = import.meta.env.DEV ? … : null`, mounted `App.vue:461`

No boolean feature flag pinned to one value was found. `GameScene.vue:93` and `:113` pass
`:mobile="true"` / `:mobile="false"` on the same named slot — that is the two-arm row-regime split
(`GameScene.vue:48` `useRowRegime()`), not a pinned flag; both arms are live and the panel reads it
(`GameControlPanel.vue:91`, `showTabs` at `:128`).

### 5.4 Exports never imported

37 named exports have **zero production consumers**. `knip` reports none of them because it counts
same-file use and treats `e2e/**` + `*.test.ts` as entry points. Split three ways:

**(a) Widened type surface — `export` where a file-local declaration would do. Used only in the
declaring file. 18 rows:**

| Declaration | self-refs |
|---|---:|
| `src/games/kenken/composables/kenkenUrlState.ts:18` `KenKenPersisted` | 4 |
| `src/games/killer/composables/killerUrlState.ts:18` `KillerPersisted` | 4 |
| `src/games/thermo/composables/thermoUrlState.ts:17` `ThermoPersisted` | 4 |
| `src/games/shared/conflicts.ts:23` `Adjacency` | 2 |
| `src/games/shared/solver/classifyError.ts:30` `PaperNoteVariant` | 5 |
| `src/games/shared/solver/transport.ts:23` `SolverTransportOptions` | 2 |
| `src/games/shared/solver/transport.ts:32` `SolverTransport` | 2 |
| `src/games/shared/useAnswerKeyPeek.ts:16` `AnswerKeyPeekTarget` | 2 |
| `src/games/shared/useFlipGlide.ts:53` `FlipRect` | 4 |
| `src/games/shared/useFlipGlide.ts:85` `FlipGlideOptions` | 2 |
| `src/games/shared/useFlipGlide.ts:98` `FlipGlideController` | 2 |
| `src/games/shared/useGameCell.ts:26` `GameCellProps` | 2 |
| `src/games/shared/useGameCell.ts:48` `GameCellEmit` | 2 |
| `src/games/shared/useGameCell.ts:60` `GameCellFurniture` | 2 |
| `src/games/shared/useGameState.ts:103` `GameStateDomain` | 3 |
| `src/games/shared/useStagingBridge.ts:57` `StagedLedgerEntry` | 8 |
| `src/games/shared/useStagingBridge.ts:63` `LedgerSource` | 2 |
| `src/games/sudoku/data/templates.ts:5` `TemplateBank` | 2 |
| `src/pencil/config/pencilConfig.ts:199` `BoilConfig` | 3 |
| `src/pencil/glyph/glyphPaths.ts:22` `GlyphVariants` | 2 |
| `src/pencil/config/filterBudget.ts:54` `FilterBudgetRow` | 6 |
| `src/pencil/config/filterBudget.ts:202` `FillAllowRow` | 2 |
| `src/games/shared/useStagingBridge.ts:34` `StagedPair` | 8 |

**(b) Test-only exports in production modules — the module is production, the export's only reader is a
spec:**

`src/games/registry.ts:100` `GameDefinition` (readers: `registry.test.ts`, `kenken/game.test.ts`,
`killer/game.test.ts`, `thermo/game.test.ts`);
`src/games/shared/techniqueEngine.ts` `popcount`, `candidateValues`, `PuzzleView`, `Elimination`,
`Deduction`, `findStep`, `ForcedPlacement`;
`src/games/shared/techniqueVoice.ts` `formatTechniqueName`;
`src/games/shared/useKeyboardViewport.ts` `computeKeyboardInset`, `computeScrollDelta`;
`src/games/sudoku/technique/sudokuTechnique.ts` `sudokuHouses`, `createSudokuAdapter`;
`src/games/futoshiki/technique/futoshikiTechnique.ts` `futoshikiHouses`, `inequalityConstraints`,
`createFutoshikiAdapter`;
`src/games/shared/useStagingBridge.ts:254` `__resetStagingBridge`.

**(c) e2e-only module** — all 8 exports of `src/pencil/config/filterBudget.ts` (§1.1).

---

## 6. Row index

| § | Rows | Headline number |
|---|---:|---|
| 1.1 Orphans | 3 | 1 app-orphan module (`filterBudget.ts`, 218 LOC, e2e-only); 2 CSS files invisible to every resolver and knip-ignored |
| 1.2 Single-consumer | 77 | 41% of the 189-module graph has exactly one non-test importer |
| 1.4 Re-export shells | 2 | `sudoku/types.ts`, `futoshiki/types.ts` |
| 1.5 Aliases | 3 | `@/*` serves 10 sites, 8 of them 2 leaf modules; zero `../../` imports |
| 2 Duplication | 14 pairs | `ThermoGame.vue`↔`KillerGame.vue` = **2** code-diff-lines at 119 LOC each |
| 3.1 Dead props | 3 | `AnswerKeyLaminate.vue:29` (required, 5 bind sites, 0 reads); `GameBoard.vue:81-82` |
| 3.3 One-caller config | 7 | 4 of them consumed only by dev-gated `FilterTuner.vue` |
| 3.4 Dead config keys | 11 | 5 of 6 `PENCIL.*`; `YOSHI_COLORS.{apple,banana,grapes,flower,vine}` + `leaf.vein` |
| 3.5 Trivial components | 11 | 4 Posters ≤45 LOC; `constants.ts` = 1 string in 8 lines |
| 3.7 Residual dirs | 3 | `ControlPanel/` holds only `constants.ts`; no `ControlPanel.vue` exists |
| 4.1 shadcn residue | 0 | no `cn`/`clsx`/`cva`/`data-slot`/Radix; no UI kit in `package.json` |
| 4.2 Unused tokens | 15 | 10 are shadcn's default palette at shadcn's default values, 25 declaration lines |
| 4.3 Dead CSS | 0 | 75 distinct classes across 4 stylesheets, all referenced |
| 5.1 Boundary gap | 20 imports | cross-game rule covers 2 of 20 ordered pairs; 2 stated invariants contradicted at the same commit |
| 5.2 Dual paths | 5 | v0 permalink ratchet; futoshiki pre-difficulty fallback; empty template tiers |
| 5.3 Feature flags | 2 | both real `import.meta.env.DEV` gates; none pinned |
| 5.4 Dead exports | 37 | 23 widened type surfaces, 13 test-only, 8 e2e-only (overlapping) |

**Total census rows: 213.**

## 7. UNKNOWN

- Whether Tailwind 4.3.2 emits the 15 unreferenced `@theme` tokens into `dist/`. No build was run.
- Whether the `.dark` twins of the 10 shadcn tokens are stripped independently of their light halves.
- Runtime cost of the dead `subgridSize` / `cornerMarks` / `centerMarks` prop bindings (a Vue prop bind
  is a reactivity edge, but no measurement was taken).

ROW-COMPLETE
