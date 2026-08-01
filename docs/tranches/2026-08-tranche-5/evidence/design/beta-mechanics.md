# DESIGNER BETA — mechanics-first apotheosis of `web/frontend/src/games`

**Tree** `71456713d9f7361af80f09e1a456fc9787507e78` (master, clean) · **written** 2026-08-01 · **NO source edits**
**Bias** smallest-risk transformation, byte-identical renders provable per step. **No shims, no dual paths, no aliases** — each wave lands whole.
**Method** every absorption number is dup-matrix `§3`'s normalized-LOC ledger (×1.40 for raw); every kill carries a census row.

**Non-goals, stated up front so no design-loop cure is fought (design-loop-open-rows §6).**
`GameControlPanel.vue` internals are **UNTOUCHED** — the T′ branch collapse is BC's to cash (`pass1/f2-proto/MANIFEST.md:141-149`; C4). `GameGallery.vue` is UNTOUCHED — the guard's two names (9a) and the inert-flank listbox (C2) are the A wave's. `useAnswerKeyPeek.ts`'s modifier guard is F3's (C3) — this design only collapses its **five call sites to one**, so C3's cure lands once. No geometry moves: `pageVh 1.705` (§2 of the open rows) must read **unchanged** after every wave, and that is a banked obligation below, not an assumption.

---

## 1 · TARGET STRUCTURE

Per-game files **65 → 22**. `games/shared` **37 → 49**. Whole games tree **103 → 72** non-test files; **16,663 → ≈12,500 raw LOC** (`wc -l` over `games/**` non-test at HEAD = 16,663; delete = dup-matrix's 2,966 norm × 1.40 ≈ 4,150 raw).

```
src/games/
  registry.ts                       the ONE table: GAMES[] = card face + lazy load(): Promise<GameDefinition>
  shared/
    defineGame.ts             NEW   GameDefinition + defineGame + BoardGrammar + SolverPayloads — the contract, off the table
    GameShell.vue             NEW   the universal scene: board + panel + laminate + peek, over one GameDefinition prop
    GameBoard.vue             ←     absorbs the 5 Board adapters: grammar-driven peers/conflicts/marginalia + clue slot
    GameCell.vue              NEW   absorbs SudokuCell ≡ FutoshikiCell (2.7% divergent) over the existing useGameCell
    CageOverlay.vue           NEW   absorbs KillerCage ≈ KenKenCage over a neutral { cells, label }[] shape
    GamePoster.vue            NEW   absorbs the 5 Poster scaffolds; renders PosterBoard + the game's own clue component
    GameScene.vue             =     scaffold, unchanged
    GameControlPanel.vue      =     UNTOUCHED (BC owns it)
    selectors.ts              NEW   difficultyOptions (one home) + the three size bands + difficultySection(model)
    persist.ts                NEW   the one persistence + `?board=` codec, clue-generic, single version, no ratchet
    types.ts                  ←     + Difficulty (one home; the 2-copy declaration dies)
    technique/
      engine.ts  voice.ts     ←     was techniqueEngine.ts / techniqueVoice.ts (colocated)
      boxed.ts                ←     was sudoku/technique/sudokuTechnique.ts — row/col/box houses, game-agnostic
      latin.ts                ←     was futoshiki/technique/futoshikiTechnique.ts — row/col houses + relation constraints
    solver/
      defineSolverClient.ts   NEW   absorbs the 5 useSolver: toFlat/toRecord/transport/3 verbs over a clue codec
      solver.worker.ts        NEW   the ONE worker — 15 wasm verbs behind a dispatch table; the ONE `?url` site
      protocol.ts             ←     the whole generic union (was 3 frames); `dim` + `clue: Uint32Array`, five names → two
      wire.ts                 NEW   packGroups/unpackGroups(width) — absorbs thermoWire/killerWire/kenkenWire, guard ALWAYS on
      transport.ts describeError.ts classifyError.ts solverError.ts     =  unchanged
    useGameState.ts useGameCell.ts gameCell.css scene.css conflicts.ts … =  unchanged (the floor that already works)
  sudoku/     game.ts  model.ts  poster.ts  templates.ts(generated)                    4
  futoshiki/  game.ts  model.ts  clue.ts  FutoshikiClue.vue  poster.ts                 5
  thermo/     game.ts  model.ts  clue.ts  ThermoClue.vue     poster.ts                 5
  killer/     game.ts  model.ts  clue.ts  poster.ts                                    4
  kenken/     game.ts  model.ts  clue.ts  poster.ts                                    4
```

### Per-file charters (the new/changed ones)

| file | charter (one line) |
|---|---|
| `shared/defineGame.ts` | the contract, and nothing else — moving it off `registry.ts` is what severs the cycle that causes the TDZ |
| `shared/GameShell.vue` | one scene for five games: `<GameShell :def="def" :leaving>` — reads all five contract slots, mounts the laminate async, prewarms iff `def.eager` |
| `shared/GameBoard.vue` | one board: `grammar` drives `subgridSize`/`peersFn`/`conflictsFn`/marginalia; `def.clueFurniture` + `def.clueProps` fill `#overlay`; `def.cellFurniture` fills `#cells` |
| `shared/GameCell.vue` | the one cell — `markCols` and `maxlength` derive from `grammar` + `boardSize`; `ariaSuffix` stays the existing `GameCellFurniture` function seam (`useGameCell.ts:60`) |
| `shared/CageOverlay.vue` | boundary path + corner-cell selection + label, over `{ cells: number[]; label: string }[]` + one `labelScale` number — game-agnostic by construction |
| `shared/GamePoster.vue` | `PosterBoard` + the game's own clue component over `poster()`'s canned data; five 36–136-LOC files become five data modules |
| `shared/selectors.ts` | the one `difficultyOptions` (SHA `f9e17c23ce02` ×3), the three size bands as named exports, and `difficultySection(m)` — the 6-line section that is name-only identical ×5 |
| `shared/persist.ts` | one localStorage codec + one `?board=` codec parameterized by clue; **one version byte, no v0 ratchet**, invalid ⇒ `boardLink:"invalid"` and the existing rendered clause |
| `shared/solver/defineSolverClient.ts` | `{ game, geometry, encodeClue, decodeClue }` → `{ getRandomBoard, solveBoard, propagateBoard, prewarm }`; the FAIL-EXPLICIT home for the template-tier table |
| `shared/solver/solver.worker.ts` | one worker, one `ensureInit` (SHA `b6608ca40eab` ×5), one dispatch table over the 15 wasm verbs, one `catch { describeError }` tail |
| `shared/solver/wire.ts` | length-prefixed `Uint32Array` group codec at a declared prefix width; kenken's truncation guard (`kenkenWire.ts:38`) becomes universal |
| `<game>/game.ts` | the whole game: `defineGame({ grammar, model, cellFurniture, clueFurniture, clueProps, options, solver, persist, poster, eager })` |
| `<game>/model.ts` | the `useGameState` adapter (was `use<Game>.ts`) — the ~20 domain slots, unchanged in shape |
| `<game>/clue.ts` | the clue's wire head/label mapping — the FOR-REASON residue, as data |

### The declared parameters (divergence as data, never as a fork)

```ts
interface BoardGrammar {
  geometry: "boxed" | "latin";   // sudoku|thermo|killer  vs  futoshiki|kenken
  noun: string;                  // "sudoku board" | "futoshiki board" | …  (the grid a11y label)
  requestVoice: boolean;         // the "— you asked for medium" clause
  gradeHint: boolean;            // UI-13 idle whisper
}
```

`geometry` is **one axis with four uses**, which is why the SUDOKU-GEOMETRY/LATIN split (dup-matrix §1) collapses to a single field:

| use | `boxed` | `latin` | today's five copies |
|---|---|---|---|
| `boardSizeOf(raw)` | `raw ** 2` | `raw` | `useThermo.ts:50` and 4 twins |
| `subgridSize` | `raw` | `boardSize` | `ThermoGame.vue:163` vs `KenKenGame.vue:112` (census 2.2) |
| `peersFn` box band | present | absent | `ThermoBoard.vue:109-115` vs `KenKenBoard.vue:98` |
| `findConflicts` adjacency | `{ subgridSize }` | `{}` | `ThermoBoard.vue:100` vs `KenKenBoard.vue` |
| solve slice `subarray(0, cells)` | `raw ** 4` | `raw ** 2` | `thermo/useSolver.ts:121` vs kenken's `toFlatBoard` |
| `markCols` on the cell | `subgridSize` | `ceil(√boardSize)` | census 2.12's 6-line delta |

`requestVoice` and `gradeHint` are **separate booleans on purpose**: they correlate with `geometry` today, but they are *rendered strings* (`ThermoBoard.vue:126-129`, `:138-146`) and folding a render difference into a geometry name would smuggle a DELTA behind a rename. Two booleans, two call sites each, honest.

---

## 2 · ABSORPTION MAP

dup-matrix §3, regrouped by wave. Normalized LOC; `shell` = the one retained copy, `kill` = duplicate copies destroyed, `residue` = what a shell provably cannot absorb.

| wave | classes | Σ norm | shell | **kill** | residue | residue lands in |
|---|---|---:|---:|---:|---:|---|
| **W1 contract** | `game.ts` (part) | — | — | — | — | (no LOC — a graph edge moves) |
| **W2 solver** | `useSolver` · `worker` · `protocol` · `*Wire` | 1,483 | 243 | **922** | 308 | `<game>/clue.ts` + the sudoku tier table |
| **W3 board/cell** | `Board` · cell/furniture | 1,794 | 510 | **1,031** | 244 | `FutoshikiClue.vue` (101) · `ThermoClue.vue` (77) · kenken 11 · killer 9 · sudoku 1 |
| **W4 scene** | `Game.vue` · `Poster.vue` · `CP/constants` | 884 | 133 | **503** | 247 | `<game>/poster.ts` (175 canned data) · size bands (13) · Game residue (59→**26**, see below) |
| **W5 state/url** | `UrlState` · `use<Game>` · `game.ts` · `types.ts` | 1,133 | 251 | **510** | 372 | `<game>/model.ts` slots (139) · codec clue bodies (158) · clue types (17) |
| | | **5,294** | **1,137** | **2,966** | **1,171** | |

Identity holds: 1,137 + 2,966 + 1,171 = 5,294 ✔ (dup-matrix §3). Raw impact **≈4,150 lines deleted**, shell ≈1,590 raw.

### The named twins, and exactly where each lands

| twin | copies | evidence | destination |
|---|---:|---|---|
| Board `defineEmits` block | ×5 | SHA `48fa3d289643` (`SudokuBoard.vue:59-70`) | deleted — `GameBoard.vue` already declares the surface; the adapters existed only to forward |
| `peersFn` row/col loop | ×5 | `SudokuBoard.vue:97-104` ≡ 4 twins | `GameBoard.vue`, `grammar.geometry`-gated box band |
| `freshBoardCopy` + `linkErrorPending` | ×5 | `SudokuBoard.vue:118-131` ≡ `KillerBoard.vue:122-135` | `GameBoard.vue`, `grammar.requestVoice`-gated clause |
| `idleGradeHint` | ×3 | `ThermoBoard.vue:138-146` ≡ sudoku ≡ killer | `GameBoard.vue`, `grammar.gradeHint`-gated |
| `flourish` provide | ×5 | SHA `e99e20a0cccf` (`SudokuBoard.vue:72-74`) | `GameBoard.vue` — the scoping fact survives because the `#cells` slot content is now authored **in the same component that provides** (DELTA-gated, §6 risk 3) |
| `toRecord` | ×5 | SHA `82412ac0756f` | `defineSolverClient.ts` |
| `toFlat` / `toFlatBoard` | ×5 | identical ×4; kenken's differs by geometry | `defineSolverClient.ts`, `geometry`-derived |
| `SolveResponse` interface | ×5 | SHA `08a0463a440f` ×3 | `shared/solver/protocol.ts` |
| worker `ensureInit` + wasm URL | ×5 | SHA `b6608ca40eab`; `?url` at `thermo:18`,`sudoku:37`,`futoshiki:23`,`killer:18`,`kenken:18` (verified, 5 hits) | `shared/solver/solver.worker.ts` — **5 resolution sites → 1**, which is the whole of N2's blast radius |
| worker `ping` / `default` / `catch` tail | ×5 | `sudoku/solver/solver.worker.ts:61-68,129-143` | same file |
| `createSolverTransport({…})` block | ×5 | name-only | `defineSolverClient.ts` |
| `difficultyOptions` | ×3 | SHA `f9e17c23ce02`; verified 3 homes | `shared/selectors.ts` |
| `NODE_BUDGET_BY_SIZE` | ×3 | SHA `7abc64aa6f7d` (`useThermo.ts:29-36`) | `shared/selectors.ts`, keyed by `geometry` band |
| `game.ts` difficulty section | ×5 | `thermo/game.ts:44-50` and twins | `shared/selectors.ts` `difficultySection(m)` |
| `AnswerKeyLaminate` mount | ×5 | `ThermoGame.vue:118-125` and twins | `GameShell.vue`, once, async, with the dead `subgridSize` bind gone |
| V1-stub `persistBoard`/`clearPersistedBoard`/`dropBoardParam`/`writeShareUrl` | ×3 | SHA `8fb12bd9c9f8` (thermo≡killer), `aad956abbf29` (kenken); the no-ops at `thermoUrlState.ts:82,105,108` | `shared/persist.ts` — and the three **empty-body no-ops die**, because the wire merge hands the codec a universal `Uint32Array` clue |
| `Difficulty` declaration | ×2 | `sudoku/types.ts:10`, `futoshiki/types.ts:39` | `shared/types.ts` |
| cage theme-CSS quartet | ×2 | `KillerCage.vue:150-180` ≡ `KenKenCage.vue:155-185` | `CageOverlay.vue`; the 0.26/0.24 split becomes one `labelScale` prop (render preserved) |
| `mediaRef` `(pointer:coarse)` MQL | ×2 | `useCoarsePointer.ts:8-22` ≡ `useHoverCard.ts:9-16`, cause stated at `useHoverCard.ts:3-6` | `src/lib/mediaQuery.ts` — the third neutral module the boundary demands (`@/lib` already exists, 2 consumers) |
| futoshiki poster ↔ board caret math | ×1 intra-game | `FutoshikiPoster.vue:33-35` re-implements `FutoshikiBoard.vue:128-172` | one `FutoshikiClue.vue`, consumed by board **and** poster — ~55 norm LOC |

### The three known walls, discharged

dup-matrix §5's "load-bearing caveat" names three constraints any shell inherits. All three dissolve rather than survive:

1. **`SudokuGame.vue:38-56` — the eager-game ESM cycle → local `sections` (17 residue).** Dissolved at W1: `defineGame` moves to `shared/`, so `sudoku/game.ts` no longer imports `registry.ts` and the cycle `scene → game → registry → scene` has no `game→registry` edge. Sudoku's 33-line Game residue drops to **~9** (poster data only); the tree-wide Game.vue residue drops 59 → **26**.
2. **`SudokuBoard.vue:72-74` — provide/inject scoping → per-adapter `flourish`.** Dissolved by co-authorship: the shared board provides *and* renders the `#cells` slot content, so the injection resolves against the providing component. DELTA-gated (celebration crop, five games).
3. **`thermo/solver/useSolver.ts:46-49` — knip forbids a dead `prewarm` export.** Dissolved: `prewarm` already exists on the shared transport (`transport.ts:41,128,154`); the per-game files are pure re-exports (`sudoku/useSolver.ts:81`, `futoshiki:68`). `defineSolverClient` returns it for all five and `GameShell` calls it iff `def.eager` — one live consumer, zero dead exports, three verbatim NOTE blocks deleted.

---

## 3 · REGISTRY VERDICT — **MAKE-TRUE**, and the merge is what makes it true

**Verdict.** `defineGame`/`GameDefinition` become the **running architecture, 5/5 games, all five slots live on every route**. `gameRegistry` (the 2-of-5 map) is **retired wholesale**. `GAMES` becomes the sole table and each row *is* the definition behind a lazy loader.

**Why make-true rather than retire — mechanically, not rhetorically.** The contract's five slots are exactly the five things a universal scene needs: a model, a cell, a clue, control sections, and solver payloads. Today there is no consumer because there are five hand-written consumers instead; collapse them to one and the slots are read **by construction**, not by discipline. Production reads go **4 → 25** (5 slots × 5 games). Retiring the type would score a kill-list win and leave 2,966 removable lines standing, re-paying the P12 absence five times over (`x6-distillation.md:126` — "P12 is the *absence* that forces all the others to fork").

**What changes, precisely.**

| row | today | target |
|---|---|---|
| `gameRegistry` | `registry.ts:134-137`, 2 of 5 games, **0 production readers**, ratified incomplete by its own test (`registry.test.ts:131`) | **DELETED** (consumer-truth U1; verify-arch-fiction I1a/I1b CONFIRMED) |
| `defineGame` + `GameDefinition` | `registry.ts:100-121`, in the table's own module — that co-location is the cycle | `shared/defineGame.ts`; games import the contract, never the table |
| the table | `GAMES: readonly GameCard[]` (`registry.ts:294-300`) — carries the whole route; the definitions ride a separate, unread map | `GAMES: readonly GameSpec[]`, one row per game = card face + `load(): Promise<GameDefinition>` |
| `options` | read by 4/5 (`ThermoGame.vue:39` +3) | read by 5/5, in `GameShell.vue` |
| `model`/`cellFurniture`/`clueFurniture`/`solverPayloads` | **0 production reads**, written at 5 sites | read by `GameShell.vue` / `GameBoard.vue`, 5/5 |
| `sudokuGame` | **315 unreferenced bytes** in the 239,693-byte main chunk; 1 identifier occurrence = its own declaration (verify-arch-fiction N1) | referenced by `GAMES`' sudoku row and by `GameShell` at mount |
| the TDZ | CONFIRMED by reproduction — `ReferenceError: Cannot access 'sudokuGame' before initialization` | **structurally impossible**: no game imports `registry.ts`, and no scene is statically imported by it |

**Chunking is preserved, not assumed.** `load()` is `() => import("./game")` for the four lazy games and `() => Promise.resolve(sudokuGame)` for the eager one — the byte-for-byte shape `registry.ts:224` already uses for `sudokuCard.scene`. The universal scene rides the main chunk (it always did, in five copies); what stays lazy is each game's *definition module* — its model, solver client, clue component. The poster stays a **separate** lazy module (`poster: () => import("./poster")`) so the gallery does not pull five solvers to draw five thumbnails.

**`defineGame` stays a hoisted `function`** (`registry.ts:121`, self-documented at `:119`). It no longer needs to be — the cycle is gone — but a hoisted identity function costs nothing and removes a class of future re-entry.

---

## 4 · KILL LIST

### 4.1 Files (per-game 65 → 22)

| # | dies | count | census row |
|---|---|---:|---|
| K1 | `{Sudoku,Futoshiki,Thermo,Killer,KenKen}Game.vue` | 5 | dup-matrix 2.1 — T–Ki **0.8 %**, Ki–Ke 1.7 %, T–Ke 2.5 %; census 2.2 — thermo↔killer **2 code-diff-lines** at 119 LOC |
| K2 | `{Sudoku,Futoshiki,Thermo,Killer,KenKen}Board.vue` | 5 | dup-matrix 2.2 — T–Ki 2.0 % (13 changed lines, **11 inside comments**); census 2.3 |
| K3 | `SudokuCell.vue`, `FutoshikiCell.vue` | 2 | dup-matrix 2.12 — S–F **2.7 %**, 220 of 225/227 lines shared, genuine delta **6 lines** |
| K4 | `KillerCage.vue`, `KenKenCage.vue` | 2 | dup-matrix 2.12 — Ki–Ke 7.9 %, 116/252 shared, CSS quartet identical mod class name |
| K5 | `FutoshikiCaret.vue` (folds into `FutoshikiClue.vue`) | 1 | dup-matrix §0 note (75 raw, out of the matrix) |
| K6 | 5 × `*Poster.vue` | 5 | census 3.5 — 36/38/42/45 LOC "one trivial thing"; dup-matrix 2.11 |
| K7 | 5 × `solver/useSolver.ts` | 5 | dead-code S6; dup-matrix 2.4 |
| K8 | 5 × `solver/solver.worker.ts` | 5 | dup-matrix 2.5 — the tightest class, **DIVERGED×0** |
| K9 | 5 × `solver/protocol.ts` | 5 | dup-matrix 2.6; census 3.6 — 75–83 LOC each composing off a 31-line shared frame |
| K10 | `thermoWire.ts`, `killerWire.ts`, `kenkenWire.ts` | 3 | dup-matrix 2.13 |
| K11 | 5 × `composables/*UrlState.ts` | 5 | dup-matrix 2.7 — T–Ki **4.1 %** SHA `8fb12bd9c9f8` |
| K12 | 5 × `types.ts` | 5 | dup-matrix 2.9 — 17 norm lines over 5 files; census 1.4 (two are re-export shells) |
| K13 | 3 × `ControlPanel/constants.ts` **and the 3 dirs** | 3 | census 3.7 — "a 3-of-5 folder convention named after a component that does not live in it" |
| | **total removed** | **51** | (22 survive/are created: `game.ts` ×5, `model.ts` ×5, `clue.ts` ×4, `Clue.vue` ×2, `poster.ts` ×5, `templates.ts` ×1) |

### 4.2 Exports, props, config, tokens

| # | dies | evidence |
|---|---|---|
| K14 | `gameRegistry` | `registry.ts:134-137`; consumer-truth U1; verify-arch-fiction I1a/I1b |
| K15 | `AnswerKeyLaminate.vue:29 subgridSize` — a **required** prop, 5 bind sites, 0 reads | census 3.1; binds at `ThermoGame.vue:123` +4 |
| K16 | `GameBoard.vue:81 cornerMarks`, `:82 centerMarks` — bound by all 5 boards, never read | census 3.1; live path is the sibling cell bind (`ThermoBoard.vue:211-212`) |
| K17 | 15 unreferenced `@theme` tokens = **25 declaration lines**; 10 are shadcn defaults at shadcn values (`--color-destructive: hsl(0 84.2% 60.2%)`, `index.css:148`) | census 4.2 |
| K18 | `PENCIL.{gridFrame,gridSubgrid,gridCell,logoText,vine}` | census 3.4 — `pencilConfig.ts:8-12`, 5 of 6 keys dead |
| K19 | `YOSHI_COLORS.{apple,banana,grapes,flower,vine}` + `leaf.vein` | census 3.4 — `pencilConfig.ts:31-36`; "a 44-line mascot-fruit palette survives to feed one heart" |
| K20 | `__resetStagingBridge` (`useStagingBridge.ts:254`) — test-only seam, shipped, un-gated | dead-code S7; replaced by injecting the store into the test, not exporting a reset |
| K21 | 23 widened type exports → file-local | census 5.4(a) |
| K22 | `sudokuMayNotImportFutoshiki` + `futoshikiMayNotImportSudoku` (`eslint.config.js:57,81`) | census 5.1 — 2 of 20 ordered pairs; replaced by **one** rule over `src/games/*/**` |

### 4.3 Dual paths and masks (FAIL-EXPLICIT structural answers, not patches)

| # | dies | structural answer |
|---|---|---|
| K23 | `TEMPLATE_BANK[size]?.[…] ?? []` (`sudoku/solver/useSolver.ts:106`) — collapses **three** states into one | the vite plugin emits `TIER_SOURCE: Record<size, Record<tier,"bank"\|"livegen">>` beside the bank; the client **indexes it** and throws on a missing key. The excision becomes a declaration; a lost directory reds in the plugin (dead-code S1's own cure) |
| K24 | 3 × empty-body `syncToUrl`/`dropBoardParam`/`writeShareUrl` (`thermoUrlState.ts:82,105,108`) | deleted — the wire merge gives the codec a universal `Uint32Array` clue, so the permalink is real for all five |
| K25 | the **v0 permalink ratchet** (`sudoku/composables/useUrlState.ts:100`, `futoshiki:127`) | one version byte, required; unknown/absent ⇒ `boardLink:"invalid"` and the already-rendered clause "this shared link couldn't be read" (`ThermoBoard.vue:132`). **Owner ratification row** — §6 risk 1 |
| K26 | futoshiki pre-difficulty fallback (`futoshiki/useUrlState.ts:90`) | same — a blob without a tier is invalid, not silently re-tiered |
| K27 | **11** `try { h.stop() } catch {}` — 6 files, verified count 11 | one `pencil/composables/stopSequence.ts` with **zero** catches, plus a contract test that double-stops and stops-after-unmount. If `stop()` can throw we learn on a runner, not in silence (dead-code S2) |
| K28 | `catch { return {} }` / `catch { return null }` (`useStagingBridge.ts:154,242`) | clear the key + record the fact; a corrupt ledger may never read as first-run (S3) |
| K29 | 3 × "fail quietly" (`useGameState.ts:652`, `useAnswerKeyPeek.ts:37`, `usePencilMarks.ts:40`) | route through `classifyError` — the instrument the same file already uses at `:459`/`:538` (S5) |
| K30 | `rasterPose.ts:21,23,27` — three failures, one `""` | split "not yet" (hold the live filter, the stated intent at `:18`) from "broken" (throw in dev) (S4) |
| K31 | 2 × MQL `?.` sub-floor guards (`useCoarsePointer.ts:15`, `useHoverCard.ts:13`, "Safari <14") | one `SUPPORT_FLOOR` constant stating Safari 26.4 / iOS 19 (`filterBudget.ts:32`), guards dropped (S8) |
| K32 | `App.vue:188` `card.scene().catch(() => {})` | record the preload failure; the only zero-arg swallow in production source (S9) |

### 4.4 The boundary, closed 20/20 by construction

Today: 20 cross-game imports, rule coverage 2 of 20 ordered pairs, **two stated invariants contradicted at the same commit** (`registry.ts:33-35` vs `thermo/game.ts:18`; `kenken/ControlPanel/constants.ts:5-6` vs its own line 1) — census 5.1.

After: **nothing a game needs lives in a sibling.** `SudokuCell`→`shared/GameCell.vue`; `sudoku/ControlPanel/constants`→`shared/selectors.ts`; `sudoku|futoshiki/types`→`shared/types.ts`; `sudokuTechnique`/`futoshikiTechnique`→`shared/technique/{boxed,latin}.ts`. Then **one** rule replaces two:

```js
{ files: ['src/games/*/**/*.{ts,vue}'],
  rules: { 'no-restricted-imports': ['error', { patterns: [
    { group: ['@games/sudoku/**','@games/futoshiki/**','@games/thermo/**','@games/killer/**','@games/kenken/**',
              '**/games/*/*'],
      message: 'games never import each other — everything shared lives in @games/shared.' },
    pencilDepthPattern ] }] } }
```

Games reach their own files relatively (there are **zero** `../../` imports in `src/`, census 1.5), so the alias-form ban catches all 20 ordered pairs without blocking self-reference. `sharedMayNotImportGames` widens from 2 named games to all five. Per lessons-from-t2-t4, the rule lands **in the same commit** as the last import it forbids (W5).

---

## 5 · LANDING ORDER — 5 waves, each whole

Every gate is **born-RED where the defect is live**, with the exact failing probe named. Every wave carries π (golden) or DELTA (before/after crop) obligations. Goldens on disk: **4** — `cell-light-webkit-darwin.png`, `grid-corner-light-webkit-darwin.png`, `logo-light-webkit-darwin.png`, `toggle-crest-dark-webkit-darwin.png`. Per design-loop §4 row 8, **no π claim rests on `toggle-crest-dark`** (three rates, one host, one day: 0/8 · 5/11 · 5/14) and **no re-baseline of any golden** is authorized by this design. `cell-light` + `grid-corner-light` are the load-bearing pair; `logo-light` is a watch-row under the sun-crest clause.

### W1 — THE CONTRACT (the cycle dies)
**Lands:** `defineGame`/`GameDefinition`/`SolverPayloads` → `shared/defineGame.ts`. `gameRegistry` deleted. `GAMES` rows gain `load()`. `SudokuGame.vue` imports `./game` and reads `sudokuGame.options` — the 17-line hand-inlined `sections` and its 19-line apologia die. No component merges. Diff is small on purpose: this is the wave that proves the fiction was structural, not necessary.

| gate | probe | born-RED because |
|---|---|---|
| **G1.1 contract is read** | `registry.test.ts` rewritten: `GAMES.length === 5`; for each row, `await row.load()` yields all five slots non-`undefined` | `load` does not exist; today `registry.test.ts:131` asserts `expect(gameRegistry).not.toHaveProperty("thermo")` — the test that **ratifies** the incompleteness |
| **G1.2 no dead definition bytes** | `scripts/check-prod-shake.mjs` extended: the main chunk's `sudokuGame` identifier must occur **>1** time | today exactly **1** occurrence in 239,693 bytes (verify-arch-fiction N1) |
| **G1.3 no cycle** | a committed module-graph assertion: no file under `src/games/*/` imports `@games/registry` | 5 game.ts files do today (`thermo/game.ts:13` +4) |
| **G1.4 boot on the engine that matters** | the built dist served to real MobileSafari with the pre-module `<head>` error trap — the exact rig `SudokuGame.vue:47-53` records | negative control: the pre-W1 tree with `import { sudokuGame }` added throws `ReferenceError: Cannot access 'sudokuGame' before initialization` (reproduced, verify-arch-fiction TDZ) |

**π:** all 4 goldens byte-identical (`test:golden:bytes` PASS) — this wave renders nothing new. **DELTA:** the sudoku controls card, before/after — `game.test.ts:69-72` already asserts shape parity, the crop asserts pixels. **Banked:** `covis` pageVh at 390×664 must read **1.705**.

### W2 — THE SOLVER ESTATE
**Lands:** one `protocol.ts` (`dim` + `clue: Uint32Array` replace `n`/`boardSize` and the five clue names), one `solver.worker.ts`, one `wire.ts` (guard always on), `defineSolverClient`, `TIER_SOURCE`. Kills **922 norm / ≈1,290 raw**.

| gate | probe | born-RED because |
|---|---|---|
| **G2.1 one wasm seam** | `scripts/check-wasm-seam.mjs` over the **built dist**: exactly one chunk imports `csp_solver_wasm_bg.wasm` | 5 worker chunks do today (verified: 5 `?url` sites) — this is N2's blast radius, measured |
| **G2.2 tier truth** | unit: `tierSource(3,"easy") === "livegen"`, `tierSource(3,"hard") === "bank"`; plugin negative control — remove `data/sudoku_puzzles/3/hard/` and the **build throws** | `tierSource` does not exist; today `vite.config.ts:50-53` guarantees a dropped dir and a deliberate excision emit byte-identical output |
| **G2.3 wire guard universal** | unit: a truncated group buffer **throws** for thermo, killer **and** kenken | only kenken guards today (`kenkenWire.ts:38`) — thermo and killer red |
| **G2.4 five games still solve** | `sudoku-interaction.spec.ts` + `futoshiki.spec.ts` + a deal-and-solve cell per remaining game, built-dist | — |

**π:** 4 goldens byte-identical. **DELTA:** with the deal seed pinned through a test hook, the dealt board crop for **all five** games must be byte-identical before/after (`seed: Date.now()` at `thermo/useSolver.ts:81` is the thing the hook overrides). **Banked:** main-chunk and per-game chunk byte sizes, before/after — the worker merge moves chunk topology and the number must be published, not assumed (§6 risk 2).

### W3 — BOARD · CELL · CLUE
**Lands:** the 5 Board adapters collapse into `shared/GameBoard.vue` behind `grammar`; `GameCell.vue`; `CageOverlay.vue`; `FutoshikiClue.vue`/`ThermoClue.vue`; `killer|kenken/clue.ts` label mappers. `cornerMarks`/`centerMarks` deleted. Kills **1,031 norm / ≈1,443 raw**.

| gate | probe | born-RED because |
|---|---|---|
| **G3.1 dead props gone** | unit over the compiled SFC: `GameBoard.props` contains neither `cornerMarks` nor `centerMarks` | both declared at `GameBoard.vue:81-82` and bound by all five boards |
| **G3.2 one cell, one cage** | module-graph assertion: exactly one module exports a game cell component; exactly one exports a cage overlay | 2 and 2 today (K3, K4) |
| **G3.3 clue slot is the contract** | unit: for each of the five definitions, `clueFurniture === null` **iff** the game draws no overlay (sudoku), and `clueProps(clue, n)` type-checks | no `clueProps` exists |
| **G3.4 a11y surface preserved** | `affordances.spec.ts` + `zone-grammar.spec.ts` on built dist; grid label, roving tabindex, constraint labels unchanged | — |

**π:** `cell-light` and `grid-corner-light` are **exactly** the surfaces this wave rewrites — both byte-identical at the darwin soul floor 0.017, no re-baseline. `logo-light`/`toggle-crest-dark` reported, not claimed. **DELTA (five crops, mandatory):** futoshiki carets · thermo tubes · killer cage boundary+sum · kenken cage boundary+target · sudoku plain grid — plus a **celebration crop per game** (the `flourish` provide/inject move, §6 risk 3) and a `.board-leaving` erase-frame crop (the scoped-CSS move, risk 4).

### W4 — SCENE · CONTROLS · POSTER
**Lands:** `GameShell.vue` (one scene, five games), `GamePoster.vue` + five `poster.ts`, `shared/selectors.ts`, the laminate mounted once and async for all five. `ControlPanel/` dirs deleted. Kills **503 norm / ≈704 raw**.

| gate | probe | born-RED because |
|---|---|---|
| **G4.1 one scene** | `App.vue`'s `<component :is>` resolves one component for all five ids; module-graph: zero `*Game.vue` under `src/games/*/` | 5 today (census 1.2, "registry-only components") |
| **G4.2 laminate prop dead** | unit: `AnswerKeyLaminate.props` lacks `subgridSize` | required prop at `:29`, 5 binds, 0 reads |
| **G4.3 one selector home** | module-graph: exactly one module exports `difficultyOptions` | **3** today (verified) |
| **G4.4 gallery still lazy** | built-dist: selecting a poster loads no solver chunk | — (regression guard on the poster split) |

**π:** 4 goldens. **DELTA:** the controls card at 3 viewports × both regimes (`GameScene.vue:93`/`:113`, `:mobile` true/false — both arms live, census 5.3), five games — and the drawer at ≥1024 and <1024. **Explicit:** `GameControlPanel.vue` byte-unchanged (`git diff --stat` = 0 on that file), so BC's T′ ledger is untouched. **Banked:** pageVh **1.705** re-measured; this is F3's denominator, not this wave's claim.

### W5 — STATE · URL · BOUNDARY · TOKENS · FAIL-EXPLICIT
**Lands:** `shared/persist.ts` (one codec, one version, no ratchet), `model.ts` ×5, `Difficulty` one home, technique adapters to `shared/technique/`, the single boundary rule, K17–K19 tokens + the token gate, K27–K32 catches. Kills **510 norm / ≈714 raw** plus 25 token lines.

| gate | probe | born-RED because |
|---|---|---|
| **G5.1 boundary 20/20** | `eslint .` with the one rule | banked RED at W1 against the W0 tree: **20 errors**; the rule ships in the same commit as the last import it forbids |
| **G5.2 no dead theme tokens** | `scripts/check-theme-tokens.mjs`: every `@theme` custom property has ≥1 `var()` or utility reference in `src/**`, `index.html`, `e2e/**` | **15** violations today; the gate also resolves census §7's UNKNOWN by reading `dist/assets/*.css` for each token string before/after |
| **G5.3 permalink is one path** | `permalink.spec.ts` + `share-truth.spec.ts`: a v0-shaped body renders `boardLink:"invalid"` and the clause; a v2 body round-trips **for all five games** | today `sudoku/composables/useUrlState.test.ts:82` asserts the v0 body **succeeds**; thermo/killer/kenken have no permalink at all |
| **G5.4 zero stop-catches** | contract unit: double-stop and stop-after-unmount on a real `SequenceHandle` throw nothing; **negative control** — a build patched so `stop()` throws must surface it, not swallow it | 11 catches today, verified by `grep -B2 '\.stop();' \| grep -c 'try {'` → 11 |
| **G5.5 estate green** | `vue-tsc -b` 0 · `vitest` · `eslint .` · `knip` 0 · `test:e2e` · `test:golden` · `test:golden:bytes` · `test:prod-shake` · `test:font-coverage` | — |

**π:** all 4 goldens, final. **DELTA:** share → reload → identical board crop, five games; the invalid-link marginalia clause. **Banked:** final pageVh at 390×664 and the seven-width tally line — both must read the pass-4 numbers (1.705; 1 paint at seven widths, both engines).

**Ordering is forced, not preferred.** W1 first because every later merge takes the definition as its argument. W2 before W5 because the universal `?board=` clue payload is a *consequence* of the wire merge — without it, the codec would need five bodies and the three no-ops could not die. W3 before W4 because the scene binds the board. W5 last because the boundary rule is only enforceable once nothing needs a sibling.

---

## 6 · RISKS, AND THE ALTERNATIVE I REJECTED

| # | risk | mitigation / disposition |
|---|---|---|
| 1 | **Permalink break.** Killing the v0 ratchet (K25) and going to one codec version invalidates links minted before the version byte and before the clue block. | **OWNER RATIFICATION ROW.** The failure surface is already built and rendered (`ThermoBoard.vue:132`), and G5.3 gates it both ways. This is a product call, not an engineering one; it is the single disclosed behaviour break in the design. |
| 2 | **Chunk topology moves.** One worker + one scene changes what rides the main chunk (five scenes leave, sudoku's poster stays lazy, the universal scene enters). | Byte sizes **banked before/after at W2 and W4**, per `check-prod-shake.mjs`. Not asserted here. The lean-wasm CI band (127,500 B) is unaffected — it measures the wasm, not the JS. |
| 3 | **`flourish` provide/inject scoping** (`SudokuBoard.vue:72-74`) — the census calls it a Vue scoping fact, not drift. | The shared board both provides and authors the `#cells` slot content, so the injection resolves against the provider. **Celebration DELTA crop per game at W3** is the proof; if a crop moves, the provide splits back to the clue component and the wave does not land. |
| 4 | **Scoped-CSS `data-v` hash moves.** `ThermoBoard.vue:236-238` states the clue layer's scope is deliberate; `.board-leaving .thermo-clue-layer` selects an ancestor class from the child scope. | The layer element **moves into** `ThermoClue.vue`/`FutoshikiClue.vue` — where its CSS already conceptually lives. Gated by the `.board-leaving` erase-frame DELTA at W3. |
| 5 | **Golden flake.** `toggle-crest-dark` reads 0/8 · 5/11 · 5/14 across one host, one day. | No π claim rests on it; **no re-baseline is authorized** (design-loop §7.3). `cell-light` + `grid-corner-light` carry every load-bearing visual claim, and they are the two surfaces W3 actually rewrites. |
| 6 | **Design-loop collision.** BC owns `GameControlPanel.vue` and T′; A owns `GameGallery.vue`; F3 owns the keypad band and `useAnswerKeyPeek`. | Three files are declared **byte-unchanged** by this design and gated as such (`git diff --stat` = 0 at W4). The structural dividend runs the other way: five scenes → one means every BC/A/F3 cure lands **once**, and C3's peek guard gets one call site instead of five. |
| 7 | **N2 stands, narrowed.** An unpinned `wasm-pack` owns the resolution contract for the wasm subpath. | The design cuts the exposed surface **5 sites → 1** and puts a built-dist gate on it (G2.1). It does not pin `wasm-pack` — that is a CI row, out of this design's scope, and it stays open. |

**The alternative I rejected: retire `defineGame` wholesale, keep `GAMES` as the sole table, and leave the five scenes as five files.** It is the cheaper diff and it would have satisfied the letter of the registry edict — the fiction dies, `knip` stays green, the 315 dead bytes go. I rejected it because it treats the symptom as the disease: the contract has no consumer precisely *because* five hand-written consumers re-satisfy it by convention, which is the P12 absence the contract was chartered to fill (`x6-distillation.md:124`, `:126`), and that absence is what the dup-matrix measures as 2,966 removable lines and 58 % neutralized-identical mass. Deleting the type would leave every one of those lines standing, would leave the TDZ intact (it is a property of `registry.ts:18` + `:24`, not of the type), would leave the boundary unenforceable at 2 of 20 pairs, and would guarantee that the sixth game forks again — the exact failure the wave that produced `defineGame` was written to prevent. Make-true costs one more wave and buys the whole estate.

---

ROW-COMPLETE
