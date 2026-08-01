# Consumer truth — declared surface ⇄ real consumer, both directions

**Repo** `CSC411_HW2_ProgrammingQuestion` · **commit** `71456713d9f7361af80f09e1a456fc9787507e78` (master, clean) · **audited** 2026-08-01
**Question** Does every declared surface have a real consumer, and does every consumer use the declared surface?
**Rows** 159 across six sweeps. Every row carries a `file:line`, a commit SHA, or a command+output excerpt. `UNKNOWN` where the evidence is out of tree.

**Method.** Static extraction, read-only. Import lists parsed out of `src/**`, `e2e/**`, `scripts/**` (regex over `import … from "<pkg>"`); Rust paths grepped as `csp_solver::<sym>`; `npx knip` (6.26.0) run as a cross-check on the JS half.

**Consumer classes used below.** `PROD` — reachable from `src/main.ts` in a production build. `TEST` — only `*.test.ts` / `e2e/**`. `CONFIG` — a build/lint config or an npm script. `DEV-GATED` — `import.meta.env.DEV`-fenced and shake-proven. `NONE` — no consumer anywhere in tree.

---

## §1 — `defineGame` registry ⇄ router/carousel (17 rows)

There's no `vue-router` in this app (`README.md:62` — "no router, no state library"). The route IS `?game=<id>`, parsed at `src/App.vue:84-88`, validated against `GAMES` at `src/App.vue:87` and `src/App.vue:124`, mounted through `sceneFor()` at `src/App.vue:51-68`, and rendered by `<GameGallery :cards="GAMES">` at `src/App.vue:506`. So "route" ≡ "GAMES row" by construction.

### 1A — every registered game reachable (5 rows)

| # | `GAMES` row | declared | `?game=` reachable | poster loader | scene loader | persistKey ⇄ real `STORAGE_KEY` |
|---|---|---|---|---|---|---|
| 1 | `sudoku` | `registry.ts:215-226` | ✅ default + explicit (`App.vue:87`) | `registry.ts:221` | `registry.ts:224` (eager, static `registry.ts:24`) | ✅ `useUrlState.ts:4` |
| 2 | `futoshiki` | `registry.ts:228-245` | ✅ | `registry.ts:241` | `registry.ts:244` | ✅ `futoshiki/composables/useUrlState.ts:15` |
| 3 | `thermo` | `registry.ts:249-257` | ✅ | `registry.ts:255` | `registry.ts:256` | ✅ `thermoUrlState.ts:36` |
| 4 | `killer` | `registry.ts:260-268` | ✅ | `registry.ts:266` | `registry.ts:267` | ✅ `killerUrlState.ts:37` |
| 5 | `kenken` | `registry.ts:271-286` | ✅ | `registry.ts:284` | `registry.ts:285` | ✅ `kenkenUrlState.ts:37` |

All paths relative to `web/frontend/src/games/`. Zero orphan rows: every card's `id` resolves, every `poster`/`scene` loader points at a file that exists, every `persistKey` string equals the `STORAGE_KEY` its own game writes.

### 1B — every reachable game registered (5 rows)

| # | game dir | scene component | `GAMES` row | worker |
|---|---|---|---|---|
| 1 | `src/games/sudoku/` | `SudokuGame.vue` | ✅ #1 | `sudoku/solver/solver.worker.ts` |
| 2 | `src/games/futoshiki/` | `FutoshikiGame.vue` | ✅ #2 | `futoshiki/solver/solver.worker.ts` |
| 3 | `src/games/thermo/` | `ThermoGame.vue` | ✅ #3 | `thermo/solver/solver.worker.ts` |
| 4 | `src/games/killer/` | `KillerGame.vue` | ✅ #4 | `killer/solver/solver.worker.ts` |
| 5 | `src/games/kenken/` | `KenKenGame.vue` | ✅ #5 | `kenken/solver/solver.worker.ts` |

`src/games/shared/` is the shell floor, not a game. **Both directions close: 5 ⇄ 5, no orphan route, no unregistered game.**

### 1C — the `GameDefinition` contract, field by field (5 rows)

`GameDefinition` is declared at `src/games/registry.ts:100-113` with five slots. Only one of them is read in production.

| # | field | declared | PROD consumers | TEST consumers | verdict |
|---|---|---|---|---|---|
| 1 | `options` | `registry.ts:110` | 4 — `ThermoGame.vue:39`, `KillerGame.vue:34`, `KenKenGame.vue:35`, `FutoshikiGame.vue:37` | 9 | **CONSUMED (4/5 scenes)** |
| 2 | `model` | `registry.ts:102` | 0 | 9 | **TEST-ONLY** |
| 3 | `cellFurniture` | `registry.ts:104` | 0 | 0 by property access; set at 5 `game.ts` sites (`sudoku/game.ts:27`, `futoshiki/game.ts:29`, `thermo/game.ts:33`, `killer/game.ts:34`, `kenken/game.ts:36`) | **WRITE-ONLY** |
| 4 | `clueFurniture` | `registry.ts:108` | 0 | 4 | **TEST-ONLY** |
| 5 | `solverPayloads` | `registry.ts:112` | 0 | 3 | **TEST-ONLY** |

`SudokuGame.vue` — the eager, default, most-trafficked scene — consumes **none** of the five. Its control sections are hand-inlined, with the reason recorded in-file: a static `import { sudokuGame }` would evaluate `gameRegistry = { sudoku: sudokuGame }` inside that const's TDZ and kill the app at boot (`SudokuGame.vue:40-55`, and the twin note at `registry.ts:20-24`). So the contract's own reference game routes around the contract.

### 1D — `gameRegistry` (2 rows)

| # | key | declared | PROD consumers | TEST consumers |
|---|---|---|---|---|
| 1 | `sudoku` | `registry.ts:135` | 0 | `registry.test.ts:97,99,101,129` |
| 2 | `futoshiki` | `registry.ts:136` | 0 | `registry.test.ts:97,100,102,130` |

`grep -rn "gameRegistry" src/` returns the declaration, its own doc-comments, and `registry.test.ts` — nothing else. The map holds 2 of the 5 shipped games, and `registry.test.ts:131` asserts the absence of the other three as intended (`expect(gameRegistry).not.toHaveProperty("thermo")`). It is a **declared surface with zero production consumers**, kept alive by its own test.

---

## §2 — `@mkbabb/pencil-boil` 0.10.1 (44 rows)

Installed at `web/frontend/node_modules/@mkbabb/pencil-boil` (`package.json` version `0.10.1`, matching the `^0.10.1` range at `web/frontend/package.json:38`). Source-shipped TypeScript (`"main": "./src/index.ts"`), `exports` map is `{".", "./package.json"}` only.

**Public surface = 44 names** re-exported by `src/index.ts:1-53`. **24 consumed, 20 not.** No `src/**` file imports a pencil-boil subpath (grep for `@mkbabb/pencil-boil/` → zero hits) — every consumer goes through the declared `.` entry, so the consumer→surface direction is clean.

### 2A — consumed (24 rows)

| # | export | origin | first consumer | sites |
|---|---|---|---|---|
| 1 | `mulberry32` | `random.ts` | `games/shared/GameBoard.vue:22` | 7 |
| 2 | `usePrefersReducedMotion` | `vue.ts:320` | `App.vue:12` | 12 |
| 3 | `heldFrameCount` | `boilHoldGate.ts:45` | `pencil/chrome/BoilDivider.vue:3` | 7 |
| 4 | `createSequenceSubscription` | `vue.ts:647` | `pencil/glyph/glyphAnimations.ts:15` | 7 |
| 5 | `easeOutCubic` | `easings.ts` | `pencil/glyph/glyphAnimations.ts:15` | 5 |
| 6 | `SequenceHandle` (type) | `vue.ts:642` | `pencil/grid/HandDrawnGrid/usePathAnimation.ts:3` | 6 |
| 7 | `serializePoseSvg` | `raster.ts:58` | `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:3` | 3 |
| 8 | `useRasterStack` | `vue.ts:482` | `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:3` | 3 |
| 9 | `createBoilTicker` | `vue.ts:606` | `pencil/composables/boilBeat.ts:22` | 2 |
| 10 | `acquireHold` | `boilHoldGate.ts:24` | `pencil/sheet/AnswerKeyLaminate.vue:23` | 1 |
| 11 | `releaseHold` | `boilHoldGate.ts:31` | `pencil/sheet/AnswerKeyLaminate.vue:23` | 1 |
| 12 | `resolveEasing` | `easings.ts:26` | `pencil/grid/HandDrawnGrid/usePathAnimation.ts:3` | 1 |
| 13 | `linear` | `easings.ts` | `pencil/glyph/glyphAnimations.ts:15` | 1 |
| 14 | `schedulerDebugInfo` | `vue.ts:743` | `pencil/dev/rafInstrumentation.ts:20` | 1 (DEV-GATED) |
| 15 | `useBoilCache` | `frames.ts:66` | `pencil/grid/gridPaths.ts:5` | 1 (2 call sites: `:48`, `:435`) |
| 16 | `WobbleOptions` (type) | `path.ts:3` | `pencil/grid/gridPaths.ts:5` | 1 |
| 17 | `pointsToLinear` | `path.ts:56` | `pencil/grid/gridPaths.ts:5` | 1 |
| 18 | `wobbleLinePoints` | `path.ts:69` | `pencil/grid/gridPaths.ts:5` | 1 |
| 19 | `perturbPoints` | `path.ts:115` | `pencil/grid/gridPaths.ts:5` | 1 |
| 20 | `wobbleRect` | `path.ts:194` | `pencil/grid/gridPaths.ts:5` | 1 |
| 21 | `boilLineFrames` | `path.ts:228` | `pencil/grid/gridPaths.ts:5` | 1 |
| 22 | `wobbleDiamond` | `celestial.ts:4` | `pencil/celestial/DarkModeToggle.vue:332` | 1 |
| 23 | `wobbleStarPolygon` | `celestial.ts:22` | `pencil/celestial/DarkModeToggle.vue:332` | 1 |
| 24 | `generateSunRays` | `celestial.ts:45` | `pencil/celestial/DarkModeToggle.vue:332` | 1 |

All consumer paths relative to `web/frontend/src/`.

### 2B — declared, never imported (20 rows)

| # | export | origin | class | note |
|---|---|---|---|---|
| 25 | `useLineBoil` | `vue.ts:364` | RETIRED-DOCUMENTED | `BoilDivider.vue:14-16` records the migration off it onto the unified scheduler |
| 26 | `useFilterParamBoil` | `vue.ts:399` | RETIRED-DOCUMENTED | `SvgFilters.vue:23` — "the Visini-method per-beat `baseFrequency` write is RETIRED" |
| 27 | `createStrokeDrawIn` | `vue.ts:693` | **SHADOWED** | see §7-S1 |
| 28 | `boilRectFrames` | `path.ts:262` | **SHADOWED** | see §7-S2 |
| 29 | `ellipsePoints` | `path.ts:296` | **SHADOWED (partial)** | see §7-S3 |
| 30 | `useBoilFrames` | `frames.ts:92` | UNCONSUMED | array specialization of `useBoilCache`; both `gridPaths` call sites cache non-array values (`Record<number,string>` at `:48`, `BoilFrames` struct at `:435`) — genuinely inapplicable |
| 31 | `rasterizePose` | `raster.ts:149` | UNCONSUMED (internal) | reached through `useRasterStack` |
| 32 | `rasterizePoseStack` | `raster.ts:187` | UNCONSUMED (internal) | reached through `useRasterStack` |
| 33 | `isSelfContainedSvg` | `raster.ts:80` | UNCONSUMED (internal) | the self-contained guard runs inside `rasterizePose` |
| 34 | `isBoilHeld` | `boilHoldGate.ts:22` | UNCONSUMED | the frontend takes the derived `heldFrameCount` instead — the raw predicate is never read |
| 35 | `catmullRomToBezier` | `path.ts:27` | UNCONSUMED | the app serializes with `pointsToLinear` throughout; no smoothing consumer |
| 36 | `perturbPointsClosed` | `path.ts:152` | UNCONSUMED (internal) | used by `ellipsePoints` |
| 37 | `wobbleLine` | `path.ts:179` | UNCONSUMED | the app takes the points-first `wobbleLinePoints` |
| 38 | `easeInCubic` | `easings.ts` | REACHED-BY-STRING | the erase family passes the literal `"easeInCubic"` through `resolveEasing` (`usePathAnimation.ts:169`, table at `easings.ts:28`) — capability consumed, name not |
| 39 | `easeInOutCubic` | `easings.ts` | REACHED-BY-STRING | same route; only named in CSS prose (`ScribbleLoader.vue:84`) |
| 40 | `Easing` (type) | `easings.ts` | UNCONSUMED | the app types easings as `string` and resolves late |
| 41 | `BoilHandle` (type) | `vue.ts:326` | UNCONSUMED | its two producers (`useLineBoil`, `useFilterParamBoil`) are both retired |
| 42 | `RasterStackHandle` (type) | `vue.ts:465` | UNCONSUMED | `useRasterStack`'s return is inferred, never annotated |
| 43 | `PoseSvgParts` (type) | `raster.ts:25` | UNCONSUMED | `serializePoseSvg` args built inline |
| 44 | `RasterStackOptions` (type) | `raster.ts:85` | UNCONSUMED | `useRasterStack` options built inline |

---

## §3 — `@mkbabb/csp-solver-wasm` 0.6.0, `file:`-linked (31 rows)

`web/frontend/package.json:37` → `file:../../csp-solver/wasm/pkg`. Package version `0.6.0` (`csp-solver/wasm/pkg/package.json`), built by `Makefile:20` with `wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features`. Declared surface = 31 top-level exports in `csp_solver_wasm.d.ts`.

### 3A — functions (17 rows)

| # | export | d.ts | worker consumer |
|---|---|---|---|
| 1 | `init` (default) | `:432` | all 5 workers (`sudoku:26`, `futoshiki:14`, `thermo:12`, `killer:12`, `kenken:12`) |
| 2 | `generateSudoku` | `:411` | `sudoku/solver/solver.worker.ts:27` |
| 3 | `propagateSudoku` | `:511` | `sudoku/solver/solver.worker.ts:98` |
| 4 | `solveSudoku` | `:585` | `sudoku/solver/solver.worker.ts:72` |
| 5 | `generateFutoshiki` | `:379` | `futoshiki/solver/solver.worker.ts:15` |
| 6 | `propagateFutoshiki` | `:456` | `futoshiki/solver/solver.worker.ts:89` |
| 7 | `solveFutoshiki` | `:542` | `futoshiki/solver/solver.worker.ts:56` |
| 8 | `generateThermo` | `:421` | `thermo/solver/solver.worker.ts:13` |
| 9 | `propagateThermo` | `:525` | `thermo/solver/solver.worker.ts:71` |
| 10 | `solveThermo` | `:598` | `thermo/solver/solver.worker.ts:42` |
| 11 | `generateKiller` | `:400` | `killer/solver/solver.worker.ts:13` |
| 12 | `propagateKiller` | `:484` | `killer/solver/solver.worker.ts:71` |
| 13 | `solveKiller` | `:567` | `killer/solver/solver.worker.ts:42` |
| 14 | `generateKenKen` | `:390` | `kenken/solver/solver.worker.ts:13` |
| 15 | `propagateKenKen` | `:470` | `kenken/solver/solver.worker.ts:71` |
| 16 | `solveKenKen` | `:554` | `kenken/solver/solver.worker.ts:42` |
| 17 | `initSync` | `:701` | **NONE** — wasm-bindgen boilerplate; every worker takes the async `init(wasmUrl)` path |

15/15 game entry points consumed, one per family per verb. No solve verb is declared and unused; no worker calls a verb that isn't declared.

### 3B — enums + classes (11 rows)

| # | export | d.ts | consumer |
|---|---|---|---|
| 18 | `SudokuDifficulty` | `:238` | type-imported by `sudoku:30`, `thermo:16`, `killer:16` |
| 19 | `FutoshikiDifficulty` | `:11` | type-imported by `futoshiki:18`, `kenken:16` |
| 20 | `SudokuSolveResult` | `:251` | structural — 8/8 fields read (`sudoku/solver/solver.worker.ts:74-89`) |
| 21 | `FutoshikiSolveResult` | `:48` | structural — 8/8 fields read (`futoshiki:64-79`) |
| 22 | `ThermoSolveResult` | `:329` | structural — 8/8 fields read (`thermo:50-65`) |
| 23 | `KillerSolveResult` | `:196` | structural — 8/8 fields read (`killer:50-65`) |
| 24 | `KenKenSolveResult` | `:129` | structural — 8/8 fields read (`kenken:50-65`) |
| 25 | `FutoshikiPuzzleData` | `:22` | 3/3 fields read (`futoshiki:110-113`) |
| 26 | `KenKenPuzzleData` | `:106` | 3/3 fields read (`kenken:89-99`) |
| 27 | `ThermoPuzzleData` | `:306` | 2/3 — `board`+`thermometers` read (`thermo:89-90`); **`n` never read** |
| 28 | `KillerPuzzleData` | `:173` | 2/3 — `board`+`cages` read (`killer:89-90`); **`n` never read** |

### 3C — init plumbing types (3 rows)

| # | export | d.ts | consumer |
|---|---|---|---|
| 29 | `InitInput` | `:600` | **NONE** |
| 30 | `InitOutput` | `:602` | **NONE** |
| 31 | `SyncInitInput` | `:691` | **NONE** |

### 3D — consumer→surface direction

Five workers import `@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url` (`sudoku:37`, `futoshiki:23`, `thermo:18`, `killer:18`, `kenken:18`). The pkg `package.json` declares **no `exports` map**, so that deep path resolves only by legacy filesystem fallback. It's inside `files`, so it ships — but the subpath is not a declared entry point. Adding an `exports` map to the pkg without a `"./csp_solver_wasm_bg.wasm"` row would break all five workers.

### 3E — the `assignment` layer

`csp-solver/wasm/src/lib.rs:39-51` gates `AssignmentRequest`, `AssignmentResponse`, `assignment_sentinel`, `solve_assignment_cop` behind `#[cfg(feature = "assignment")]`. The feature is crate-default-on (`wasm/Cargo.toml`, `default = ["assignment"]`) but the ship recipe is `--no-default-features` (`Makefile:20`), so the four names are **absent from the shipped `pkg/`** — confirmed: they do not appear in `csp_solver_wasm.d.ts`. The declared consumer is bbnf-buddy, out of tree — **UNKNOWN** from here.

---

## §4 — `web/api` (FastAPI) (1 row)

| # | surface | status | evidence |
|---|---|---|---|
| 1 | `web/api` FastAPI service, `/api/v1/*` | **DOES NOT EXIST AT HEAD** | `ls web/` → `frontend` only; `git ls-files web/api` → 0 files |

Deleted at `98fe2562211de4d58d95c45b6e29390c0f4d72a7` (2026-07-10) — *"T2-W2: abrogation — the server, docker, and nginx go; wasm is the product"*. That is the last commit to touch the path. There are therefore **zero routes**, and the question "which routes have zero callers" is vacuous.

**Documented, not silent.** `README.md:3` — "there's no HTTP service here: no server ever touches a puzzle." `README.md:113` — "Solving and generation never leave the visitor's browser, so there's no server-side solve path to secure." The repo does not claim an Option-A reference posture; it claims abrogation, which is what the tree shows. The two agree.

**Residue.** Fifteen source comments still name the dead surface as an absence — e.g. `sudoku/solver/solver.worker.ts:13` "Zero fetch, zero `/api/v1/*` dependency of any kind", and the same clause in `futoshiki:7`, `thermo:6`, `killer:6`, `kenken:6`, plus five `useSolver.ts` headers and five `use<Game>.ts` headers. They're negative claims about a phantom: true, but they reference a route family no reader can find. Not a defect; a naming debt.

**Drift note (out of tree).** The user's `MEMORY.md` still asserts "FastAPI at web/api (7-code taxonomy, DI)" and "the API is the Option-A reference (owner's EC2 box)". That claim is 3 weeks stale against `98fe2562`. Repo docs are correct; the memory file is not.

---

## §5 — `package.json` dependencies (25 rows)

`web/frontend/package.json`. **6 dependencies, 19 devDependencies. Zero UNCONSUMED.** Cross-checked: `npx knip` (6.26.0, config `web/frontend/knip.json` with `dependencies`/`devDependencies`/`unlisted` all at `error`) exits 0 with no output.

### 5A — dependencies (6 rows)

| # | dep | range | consumed at |
|---|---|---|---|
| 1 | `@mkbabb/csp-solver-wasm` | `file:../../csp-solver/wasm/pkg` | 5 workers — `sudoku/solver/solver.worker.ts:31` +4 (§3) |
| 2 | `@mkbabb/pencil-boil` | `^0.10.1` | 24 exports across 20 files (§2A) |
| 3 | `@tailwindcss/vite` | `^4.3.2` | `vite.config.ts:4` |
| 4 | `tailwindcss` | `^4.3.2` | `src/assets/index.css:1` (`@import "tailwindcss"`) |
| 5 | `@vueuse/core` | `^14.3.0` | `composables/useTheme.ts:1`, `HandwrittenLogo.vue:9`, `DarkModeToggle.vue:341`, `HandDrawnOutline.vue:3`, `HandDrawnGrid.vue:4` |
| 6 | `vue` | `^3.5.39` | 74 files import from `"vue"` |

### 5B — devDependencies (19 rows)

| # | dep | consumed at | class |
|---|---|---|---|
| 7 | `@eslint/js` | `eslint.config.js:2` | CONFIG |
| 8 | `eslint` | `package.json:19` (`lint:eslint`) + `eslint.config.js` | CONFIG |
| 9 | `typescript-eslint` | `eslint.config.js:3` | CONFIG |
| 10 | `eslint-plugin-vue` | `eslint.config.js:4`, applied `:164` | CONFIG |
| 11 | `globals` | `eslint.config.js:5`, applied `:167` | CONFIG |
| 12 | `vue-eslint-parser` | **no direct reference** — required peer of `eslint-plugin-vue@10` (`peerDependencies: {"vue-eslint-parser":"^10.3.0"}`); the parser is installed by `pluginVue.configs['flat/essential']` at `eslint.config.js:164` | CONFIG (peer-activated) |
| 13 | `prettier` | `package.json:18` (`lint`) | CONFIG |
| 14 | `prettier-plugin-tailwindcss` | `.prettierrc.json:5` | CONFIG |
| 15 | `typescript` | `tsconfig.json` + `vue-tsc` | CONFIG |
| 16 | `vue-tsc` | `package.json:16` (`build`) | CONFIG |
| 17 | `vite` | `package.json:15,16` + `vite.config.ts` | CONFIG |
| 18 | `@vitejs/plugin-vue` | `vite.config.ts:3`, `vitest.config.ts:2` | CONFIG |
| 19 | `esbuild` | **no direct import** — optional peer of `vite@8.1.4` (`peerDependenciesMeta.esbuild.optional: true`); activated by `vite.config.ts:258` `minify: 'esbuild'`. Vite 8 ships rolldown, not esbuild, so this dep is the *only* thing that makes that minifier resolvable | CONFIG (peer-activated) |
| 20 | `vitest` | `package.json:22` + `vitest.config.ts` | CONFIG |
| 21 | `jsdom` | `vitest.config.ts:25` | CONFIG |
| 22 | `@vue/test-utils` | `CheckStatus.test.ts:2` +8 | TEST |
| 23 | `@playwright/test` | `playwright.config.ts:1`, `playwright-golden.config.ts:1`, `playwright-throttle.config.ts:1`, 22 e2e specs | TEST |
| 24 | `knip` | `package.json:20` + `knip.json` | CONFIG |
| 25 | `wrangler` | `package.json:32` (`deploy`) | CONFIG |

**Knip scope caveat.** `knip.json:3` sets `project: ["src/**/*.{ts,vue,css}"]`. `scripts/*.mjs`, `e2e/**` (beyond the plugin entry), and root configs are outside the project glob — knip's silence covers `src/**` and the plugin-known configs, not those. And knip counts `*.test.ts` as a consumer, which is exactly why §1D's `gameRegistry` passes knip while having no production consumer. Knip proves reachability, not production reachability.

---

## §6 — `csp-solver` Rust crate ⇄ wasm + py bindings (41 rows)

Crate version `0.6.0` (`csp-solver/Cargo.toml`), wasm sibling `0.6.0`, `pyproject.toml:7` `0.6.0` — the three are in lockstep at this commit.

### 6A — `lib.rs` public re-exports (16 rows)

Counts are `csp_solver::<sym>` path hits, plus `crate::<sym>` for the in-crate py module.

| # | re-export | `lib.rs` | wasm | py bindings | tests/benches/examples | verdict |
|---|---|---|---|---|---|---|
| 1 | `SolveConfig` | `:37` | 6 files | 4 | 30 | CONSUMED |
| 2 | `Pruning` | `:37` | 5 | 4 | 31 | CONSUMED |
| 3 | `SolveStats` | `:37` | 3 | 3 | 0 | CONSUMED |
| 4 | `Csp` | `:37` (`config.rs:130`) | 0 | 1 (`py/csp.rs`) | via `crate::` | CONSUMED |
| 5 | `CspError` | `:39` | 1 | 4 | 2 | CONSUMED |
| 6 | `PuzzleClass` | `:40` | 0 | 0 | 2 | CONSUMED (tests only) |
| 7 | `sudoku` (module) | `:41` | 1 (`wasm/src/sudoku.rs:26`) | 0 | 5 | CONSUMED |
| 8 | `Unsatisfiable` | `:38` | 0 | 1 | 4 | CONSUMED |
| 9 | `CancelToken` | `:36` | 0 | 3 (`py/config.rs:7`) | 0 | CONSUMED (py only) |
| 10 | `assignment` | `:33` | 2 (feature-gated out of ship) | 0 | 16 | CONSUMED |
| 11 | `AssignmentBuilder` | `:33` | 2 (gated) | 0 | 3 | CONSUMED |
| 12 | `AssignmentSolution` | `:33` | 1 (gated) | 0 | 1 | CONSUMED |
| 13 | `AssignmentError` | `:33` | 1 (gated) | 0 | 1 | CONSUMED |
| 14 | `SENTINEL` | `:33` | 1 (gated) | 0 | 2 | CONSUMED |
| 15 | `OptimizationMode` | `:37` | 0 | 0 | 3 | CONSUMED (tests only) |
| 16 | `PropagationStrategy` | `:37` | 0 | 0 | **0** | **UNCONSUMED outside the crate** |

`PropagationStrategy` and its only public entry point `Csp::propagate_with` (`src/csp/solve.rs:25`) have zero callers in wasm, py, tests, benches, or examples. Every in-tree path goes through `Csp::propagate()` (`src/csp/solve.rs:21`), which hard-codes `PropagationStrategy::Auto`. The strategy enum's variants are dispatched only from inside `propagate_with`'s own recursion (`solve.rs:30-51`). Its declared external consumer is bbnf-lang's six IR passes — `docs/bbnf-integration.md:14` says those "call `propagate()` without calling `finalize()`" and rely on the *auto-selection*, i.e. they don't name the enum either. Whether any bbnf call site names `PropagationStrategy` is **UNKNOWN** from this repo; the sync gate's structural tripwires are described at `docs/bbnf-integration.md:8` as a trait-surface allow-list plus a `SolveConfig`/`SolveStats` field-set comparison — neither covers this enum.

### 6B — `lib.rs` public modules (10 rows)

| # | `pub mod` | `lib.rs` | wasm path hits | py (`crate::`) | tests/benches/examples | verdict |
|---|---|---|---|---|---|---|
| 17 | `domain` | `:24` | 5 | 1 | 34 | CONSUMED |
| 18 | `ordering` | `:26` | 5 | 2 | 27 | CONSUMED |
| 19 | `puzzles` | `:27` | 4 | 0 | 19 | CONSUMED |
| 20 | `variable` | `:31` | 1 | 0 | 3 | CONSUMED |
| 21 | `constraint` | `:22` | 0 | 0 | 16 | CONSUMED (tests only) |
| 22 | `solver` | `:30` | 0 | 0 | 6 | CONSUMED (tests only) |
| 23 | `error` | `:25` | 1 | 5 | 0 | CONSUMED |
| 24 | `py` | `:29` (`cfg(feature="py")`) | n/a | self | n/a | CONSUMED (maturin entry) |
| 25 | `builder` | `:19` | 0 by module path | 0 | 0 | CONSUMED only via the `assignment` re-export (row 10) — the module path itself has no consumer |
| 26 | `cancel` | `:20` | 0 by module path | 0 | 0 | CONSUMED only via the `CancelToken` re-export (row 9) — the module path itself has no consumer |

Rows 25–26 are surface duplication, not dead code: both modules are `pub` *and* flattened into the root, and every consumer takes the flat name. `pub(crate) mod bitscan/config/csp` (`lib.rs:18,21,23`) are correctly private.

### 6C — PyO3 `__all__` ⇄ `tests-py` (15 rows)

The stub `csp-solver/csp_solver.pyi:16-32` declares 15 names, kept in lockstep with `src/py/` by a flag-free `mypy.stubtest` contract (`csp_solver.pyi:8-11`), so stub↔binding drift in *either* direction fails loud. The consumer side:

| # | name | `.pyi` | consumers in `tests-py/` |
|---|---|---|---|
| 27 | `Ordering` | `:44` | 64 hits, first `test_wheel_contracts.py:31` |
| 28 | `Pruning` | `:37` | 58, first `test_wheel_contracts.py:30` |
| 29 | `SolveConfig` | `:69` | 52, first `test_panic_contract.py:60` |
| 30 | `Csp` | `:100` | 39, first `test_panic_contract.py:51` |
| 31 | `create_sudoku_csp` | `:120` | 20, first `test_bench_compare.py:23` |
| 32 | `solve_sudoku` | `:123` | 13, first `test_bench_compare.py:25` |
| 33 | `SudokuDifficulty` | `:50` | 10, first `test_rust_backend.py:13` |
| 34 | `InvalidInputError` | `:134` | 5, first `test_rust_backend.py:90` |
| 35 | `CancelToken` | `:62` | 5, first `test_wheel_contracts.py:117` |
| 36 | `create_random_board` | `:124` | 4, first `test_rust_backend.py:13` |
| 37 | `UnsatisfiableError` | `:132` | 4, first `test_wheel_contracts.py:210` |
| 38 | `BudgetExceededError` | `:133` | 2, first `test_wheel_contracts.py:11` |
| 39 | `CspTimeoutError` | `:135` | 2, first `test_wheel_contracts.py:11` |
| 40 | `SolveStats` | `:85` | 0 by name — consumed structurally via `csp.stats.budget_exceeded` / `.cancelled` (`test_wheel_contracts.py:105,155,156,197`) |
| 41 | `SudokuCSP` | `:114` | 0 by name — consumed structurally as `create_sudoku_csp`'s return; both properties read (`.solutions` `test_rust_backend.py:78`, `.backtrack_count` `test_bench_compare.py:27`) |

Both directions close: 15 declared, 15 reached; no `tests-py` symbol imports something absent from `__all__`. Rows 40–41 are name-unconsumed but field-consumed — correct for return types.

---

## §7 — UNCONSUMED / SHADOWED

### U — declared surface, no consumer

| id | surface | site | class | risk |
|---|---|---|---|---|
| U1 | `gameRegistry` (2 of 5 games) | `web/frontend/src/games/registry.ts:134-137` | TEST-ONLY | A registration table that registers nothing production reads, and holds 40% of the estate. Its own test asserts the 3 absences (`registry.test.ts:131`). Either fold the 5 games in and give it a consumer, or delete it and keep `GAMES` as the sole table. |
| U2 | `GameDefinition.model` / `.cellFurniture` / `.clueFurniture` / `.solverPayloads` | `registry.ts:102,104,108,112` | TEST-ONLY / WRITE-ONLY | 4 of 5 contract slots are asserted by tests and read by nothing. The contract's compile-time proof is real; its runtime consumption is `options` alone. |
| U3 | `sudokuGame` in `SudokuGame.vue` | `SudokuGame.vue:40-55` | BYPASSED | The default game hand-inlines its sections. The TDZ reason is recorded, but the effect is that the reference implementation of the contract doesn't use the contract, and a `sudokuGame.options` change silently diverges from what ships. |
| U4 | 20 pencil-boil exports | §2B rows 25–44 | 45% of the dep's surface | Includes 2 retired-by-design (`useLineBoil`, `useFilterParamBoil`), 4 lib internals that need not be public, 3 shadowed (S1–S3), 5 unused types. |
| U5 | `initSync`, `InitInput`, `InitOutput`, `SyncInitInput` | `csp_solver_wasm.d.ts:701,600,602,691` | wasm-bindgen boilerplate | Not authored here; not removable without a bindgen flag. Noted for completeness. |
| U6 | `ThermoPuzzleData.n`, `KillerPuzzleData.n` | `csp_solver_wasm.d.ts:306+,173+` | dead getters | Both workers echo `req.n` back instead of reading the generator's answer (`thermo:89-90`, `killer:89-90`). Two wasm-side getters exist so the boundary can disagree with itself silently. |
| U7 | `PropagationStrategy` + `Csp::propagate_with` | `csp-solver/src/lib.rs:37`, `src/csp/solve.rs:25` | zero in-tree callers | The only public knob with no caller anywhere in this repo. External (bbnf) consumption **UNKNOWN**; the vendor sync gate's tripwires (`docs/bbnf-integration.md:8`) don't cover it. |
| U8 | `csp_solver::builder` / `csp_solver::cancel` module paths | `csp-solver/src/lib.rs:19,20` | duplicate surface | Both are `pub mod` *and* flattened; 100% of consumers take the flat re-export. The module paths are a second way to say the same thing, with no user. |
| U9 | `web/api` FastAPI routes | — | surface absent | Zero routes exist. Documented as abrogated at `README.md:3` and `README.md:113`; the repo and the tree agree. The 15 in-source "zero `/api/v1/*`" comments cite a path no longer findable in tree. |
| U10 | `"sideEffects": ["./snippets/*"]` | `csp-solver/wasm/pkg/package.json` | dead config | `csp-solver/wasm/pkg/snippets` does not exist (`ls` → No such file or directory). A side-effect carve-out for a directory the lean build never emits. |

### S — frontend re-implementations shadowing library capability

| id | lib export (unconsumed) | frontend shadow | assessment |
|---|---|---|---|
| S1 | `createStrokeDrawIn` — `node_modules/@mkbabb/pencil-boil/src/vue.ts:693` | `createGlyphDrawIn` — `src/pencil/glyph/glyphAnimations.ts:44`; and the inline dashoffset tween at `src/pencil/grid/HandDrawnGrid/usePathAnimation.ts:70-79` | **Straight duplication.** Both implement the same four steps in the same order: PRM early-return painting the solid end state (lib `:713-717` / app `:53-58`), set `strokeDasharray = length` + `strokeDashoffset = length`, tween offset through one `createSequenceSubscription`, then clear `strokeDasharray = 'none'` on completion. Both carry the *same* rationale comment for that final clear — the approximate-`pathLength` dash-gap-at-rest defect (lib `:697-699`, app `:36-42`). The lib version even accepts an explicit `pathLength` "when the geometry's measured length is unreliable (hand-authored glyph paths)" — precisely `glyphPaths.ts`'s case. Two implementations of one fix. |
| S2 | `boilRectFrames` — `path.ts:262` | `generateRectBoilFrames` — `src/pencil/grid/gridPaths.ts:213` | **Justified fork, stale lib row.** The local adds `radius` (jittered corner arcs, T3-W10 F1) and `grain` (baked displacement, T3-W13 §1-P2); at `radius = 0, grain = undefined` it reproduces the lib's four-`boilLineFrames`-joined output. The capability belongs upstream — as it stands, `boilRectFrames` is a lib export that this repo's own use case outgrew and left behind. |
| S3 | `ellipsePoints` — `path.ts:296` | `arcBoilPoints` — `src/pencil/grid/gridPaths.ts:180-199` | **Partial shadow.** Same body: seeded `mulberry32` rng, `amp` proportional to radius, sample loop pushing `[cx + cos(a)*(r+j), cy + sin(a)*(r+j)]` (lib `:305-310` / app `:193-197`). The local sweeps an arc `a0→a1` with step count derived from arc length; the lib sweeps a closed ring with a hand-circled overshoot. One generalizing parameter apart. |
| S4 | `useFilterParamBoil` — `vue.ts:399` / `useLineBoil` — `vue.ts:364` | `useBeatFrame` — `src/pencil/composables/boilBeat.ts:63`, over one module-level `createBoilTicker` driver (`:32`) | **Deliberate supersession, recorded.** The app coalesced N independent subscribers into one shared beat (`boilBeat.ts:1-19`) and retired the per-beat filter write (`SvgFilters.vue:23`) and the divider's own line-boil (`BoilDivider.vue:14-16`). Not a defect — but it leaves 2 exports, the `BoilHandle` type they return, and the whole per-consumer-subscriber model as surface the app has ruled against. |
| S5 | `easeInCubic` / `easeInOutCubic` / `Easing` — `easings.ts` | string literals through `resolveEasing` (`usePathAnimation.ts:169` passes `"easeInCubic"`; table at `easings.ts:26-38`) | **Late-bound by choice, typed loosely.** `usePathAnimation`'s spec types easing as `string` (`:55`), so a typo falls through `resolveEasing`'s `default:` to `easeOutCubic` — an erase silently animating on the enter curve, no error. The typed exports exist and would catch it. |

### Direction check: consumers using undeclared surface

| id | consumer | undeclared surface used | evidence |
|---|---|---|---|
| D1 | 5 solver workers | `@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url` | pkg `package.json` has no `exports` map; the subpath resolves by legacy fallback only (`sudoku:37`, `futoshiki:23`, `thermo:18`, `killer:18`, `kenken:18`). Shipped via `files`, but not a declared entry point. |
| D2 | `eslint.config.js` | `vue-eslint-parser` | consumed transitively through `pluginVue.configs['flat/essential']` (`:164`); declared as a direct devDependency with no direct reference. Correct as a peer pin — invisible as a consumer link. |
| D3 | `vite.config.ts:258` | `esbuild` | `minify: 'esbuild'` is a string, not an import. Vite 8.1.4 has no `esbuild` dependency (deps: `lightningcss, picomatch, postcss, rolldown, tinyglobby`); it's an *optional* peer. The devDependency is the only thing making that config line resolvable, and nothing in tree states so. |

---

## Verdict

Both directions close cleanly on the two seams that carry traffic: the **5⇄5 game registry ↔ route** mapping (§1A/1B, zero orphans either way) and the **15/15 wasm solve entry points** (§3A, every declared verb consumed, every worker call declared). Dependencies are clean at 25/25 (§5), and the py binding surface is 15/15 (§6C).

The failures are in the *mechanical* contract, not the shipped product. `gameRegistry` and 4 of 5 `GameDefinition` slots exist for their own tests (U1, U2), the eager reference game bypasses the contract it was written to demonstrate (U3), and 45% of the pencil-boil surface has no consumer here, three exports of it shadowed by hand-rolled twins in `src/pencil/` (S1–S3). `PropagationStrategy` is the one Rust public knob with no in-tree caller and no sync-gate coverage (U7). `web/api` is absent and honestly documented as absent (U9).

ROW-COMPLETE
