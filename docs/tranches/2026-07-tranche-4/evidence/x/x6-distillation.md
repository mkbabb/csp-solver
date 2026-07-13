# LANE x6-distillation — THE DISTILLATION CENSUS

**Mandate rows:** M10 ("Better performance, and a distillation of code into its atomic precepts and concepts. How can we REDUCE code lines and complexity and maintain the full suite of facilities?"); serves M8/M9 by *producing* the clean game contract the expansion needs.
**Razor** KISS · **Law** the pencil idiom · **Bar** game-agnostic. **NO source edits** — all numbers are `cloc`/`comm`/`diff` probes, rerunnable.

Repo HEAD 65425697 (master). Measured with `cloc 2.08`, `comm`, `diff`. Ratios are code-only (comment + blank stripped, leading whitespace normalized) identical-line overlap via `comm -12` on sorted lines — a defensible lower/upper gauge, caveated where trivial-line inflation applies.

**Relation to r2-arch-transposition.md:** r2 owns the *architectural* verdicts (T1 solver seam, T2 barrel grammar, T3 pencil shed, T5 easing tokens, T6 boil-frame fork). This lane does NOT re-argue them — it (a) puts the **twin duplication under a ruler** at file grain, (b) names the **atomic precepts** and maps every place two implementations exist for one, (c) converts both into **wave-shaped rows with LOC deltas + facility-preservation obligations**. Where I extend a r2 row I say so; where I contradict r2 I flag it (the ControlPanel/Board "decline" is only half-right at the LOC grain).

---

## (a) THE MEASURE

### A1 — cloc by module (code lines, comments/blank excluded)

| Module | Files | Code | Note |
|---|---:|---:|---|
| `web/frontend/src/pencil` | 39 | **5,183** | the aesthetic layer (23 .vue / 16 .ts) |
| `web/frontend/src/games/sudoku` | 17 | **2,555** | twin A |
| `web/frontend/src/games/futoshiki` | 17 | **2,504** | twin B |
| `web/frontend/src/games/shared` | 13 | 762 | the extraction that already happened |
| `web/frontend/src` top-level (App/composables/lib) | 4 | 234 | App.vue 207 |
| `csp-solver/src` (excl wasm) | 52 | **4,515** | solver core |
| — of which `csp-solver/src/py` | 6 | 444 | py bindings (T3-3/T3-5 ballot territory) |
| — of which `csp-solver/src/puzzles` | 9 | 651 | sudoku 357 / futoshiki 294 |
| `csp-solver/wasm/src` | 5 | 483 | wasm surface |
| `pencil-boil/src` (sibling lib) | 8 | 778 | the animation lib |
| **FE src total** | ~90 | **~13,700** | |

**The gestalt:** the two game dirs are **5,059 code lines** (37% of FE src), the pencil layer **5,183**, the solver core **4,515**. The game dirs are where distillation has the highest leverage because they are near-twins (below).

### A2 — top-20 largest source files (code lines)

| Code | File |
|---:|---|
| 570 | `games/sudoku/ControlPanel/ControlPanel.vue` |
| 534 | `pencil/celestial/DarkModeToggle.vue` |
| 527 | `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` |
| 524 | `games/sudoku/SudokuBoard/SudokuBoard.vue` |
| 460 | `games/futoshiki/ControlPanel/ControlPanel.vue` |
| 434 | `pencil/grid/gridPaths.ts` |
| 389 | `pencil/dev/FilterTuner.vue` (dev-only tool — see D-row P1 below) |
| 372 | `csp-solver/src/solver/search.rs` |
| 345 | `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` |
| 333 | `assets/index.css` |
| 327 | `csp-solver/src/solver/gac/mod.rs` |
| 319 | `games/futoshiki/composables/useFutoshiki.ts` |
| 315 | `games/futoshiki/…/FutoshikiCell.vue` |
| 309 | `games/sudoku/composables/useSudoku.ts` |
| 309 | `games/sudoku/…/SudokuCell.vue` |
| 297 | `csp-solver/src/builder/assignment.rs` (bbnf-assignment consumer) |
| 275 | `pencil/config/pencilConfig.ts` |
| 245 | `pencil/glyph/glyphPaths.ts` |
| 230 | `pencil/glyph/HandwrittenGlyph.vue` |
| 227 | `games/shared/useControlsDrawer.ts` |

**Note:** the top-5 by size are 4 game-twin files + the DarkModeToggle. Nine of the top-20 are twin-paired (the two ControlPanels, two Boards, two Cells, two use<Game>s, and futoshiki's board again). Every twin pair below is measured against its sibling.

### A3 — THE TWIN CENSUS (the headline distillation datum)

16 file-pairs exist in **both** game dirs by shape (basename with the `Sudoku`/`Futoshiki` prefix stripped):
`Board.vue · Cell.vue · SolverErrorNote.vue · conflicts.ts · ControlPanel.vue · ControlPanel/constants.ts · Game.vue · composables/use<Game>.ts · composables/useUrlState.ts · solver/{classifyError,protocol,solver.worker,solverError,useSolver}.ts · types.ts` (+ README.md).

Code-only identical-line overlap (`comm -12`, sorted, comment/blank stripped):

| Twin pair | code A | code B | identical lines | % of smaller | verdict |
|---|---:|---:|---:|---:|---|
| `ControlPanel.vue` | 610 | 491 | **453** | **92%** | shell-extractable (contradicts r2 "decline") |
| `SolverErrorNote.vue` | 105 | 101 | **95** | **94%** | near-total; the error fiction is shared |
| `protocol.ts` | 66 | 75 | 59 | 89% | envelope shared, payloads diverge (r2-T1) |
| `Cell.vue` | 360 | 360 | **320** | **88%** | shell-extractable (contradicts r2 "decline") |
| `use<Game>.ts` | 374 | 361 | 300 | 83% | state-machine shared, domain ops diverge |
| `Board.vue` | 610 | 593 | **455** | **76%** | shell-extractable |
| `useSolver.ts` | 212 | 192 | 129 | 67%* | *transport 100% identical (r2-T1); diff is payload builders + doc comments |
| `Game.vue` (scene shell) | 175 | 165 | 104 | 63% | scene scaffold shared |
| `conflicts.ts` | 62 | 65 | 39 | 62% | conflict-marking shared |
| `useUrlState.ts` | 203 | 205 | 111 | 54% | codec shared (r2-T1 InitSource), encode/decode diverge |
| `solverError.ts` | 35 | 33 | — | **code byte-identical** (r2-T1; diff = doc comment only) |
| `classifyError.ts` | 54 | 43 | — | **code byte-identical** (r2-T1; diff = doc comment only) |
| `constants.ts` | 11 | 14 | 1 | 9% | genuinely divergent (option *values*) — NOT a twin |

**Aggregate:** roughly **~2,100–2,200 lines** in one game dir are line-identical to their twin in the other (sum of the identical-line column, with `solverError`+`classifyError` code counted whole). Discount ~15–20% for trivial structural lines (`}`, `</div>`, `return`) and the honest floor is **~1,700 lines of pure twin duplication** — about **34% of the 5,059-line game-dir mass duplicated verbatim.** This is the single largest reduction reservoir in the product.

**The r2 correction (contradiction, load-bearing):** r2-arch-transposition's "Non-transpositions — DECLINED" section rejects a shared `Board` and shared `ControlPanel` as "vanity DRY … the two diverge on essential domain." At the whole-file grain that's right — you can't merge the *files*. But at the LOC grain the divergence is **localized**, not pervasive:
- **ControlPanel (92% identical):** the *only* real divergence is (i) Sudoku's difficulty section (~40 lines) and (ii) the mobile tab-toggle (`expandedPanel` size/difficulty) that exists *only because Sudoku has 2 sections*. The **action-button row, the hold-to-peek `BoilDivider`, the drawer wiring, and all `<style>` (incl. the doubled `sharePop`/`eraserScrub` keyframes)** — ~450 lines — are verbatim. That is a `<GameControlPanel>` **shell** taking section-slots, not a lossy merge. r2 declined the wrong shape.
- **Cell (88%) / Board (76%):** the divergence is the caret/inequality furniture (futoshiki-only `FutoshikiCaret`) and subgrid lines (sudoku-only). The pencil-mark render, the `ghost-draw-on`/`marks-fade-in` keyframes, the conflict-shake, the reveal animation, the cell-selection model — verbatim. Extract the **CellShell** (mark grid + boil + reveal) and the **BoardShell** (grid scaffold + completion vignette + error-note mount + drawer host); leave the furniture as game slots.

### A4 — CSS duplication (independent of the twin files)

6 `@keyframes` are defined **twice**, once in each twin: `sharePop`, `eraserScrub` (both ControlPanels), `note-slide-in`, `note-fade-in` (both SolverErrorNotes), `marks-fade-in`, `ghost-draw-on` (both Cells). These ride inside the twin files above (already counted) but confirm the duplication is *animation-idiom* deep, not just markup. They fold when the shells extract. Separately, r2-T5 (untokenized easing: 9 house `cubic-bezier` curves × 39 inline literals, zero `--ease-*` CSS vars) is the *token* half of the same CSS-debt family — folds in the same idiom wave.

### A5 — pencil-layer internal duplication (checked — mostly CLEAN)

The pose-stack / boil machinery is **centralized**, not repeated per surface: `poseStack`/`boilFrames`/`usePathAnimation` live only in `pencil/grid/{gridPaths.ts, HandDrawnGrid/*, HandDrawnOutline.vue, index.ts}` + `BoilDivider.vue` + `pencilConfig.ts`. Surfaces *consume* it (App.vue, DigitPad.vue) rather than reimplement it. **No per-surface pose-stack fork inside the app.** The one real boil duplication is *cross-repo* (r2-T6: `gridPaths.ts` forked pencil-boil's `boilLineFrames`/`boilRectFrames`, already drifted `+997` vs `+1013`) — that's r2's wave, I don't re-book it. Net: the pencil layer's 5,183 lines are NOT a twin-style reduction reservoir; its distillation is the T3/T6 shed to the library + the T5 easing tokens, already owned by r2.

### A6 — the invariant (facility-preservation proof obligation)

The suite that MUST stay green across every distillation wave (the "keep every facility" gate):
- **55 e2e cases** across 10 Playwright specs (`e2e/{affordances,digit-pad,drawer,futoshiki,permalink,sudoku-interaction,throttled-void,visual-regression}.spec.ts` + global-setup) — the user-facing facility census.
- **174 Rust tests** (`csp-solver/src` + `tests/`) — the solver-facility census.
- The visual-regression π/DELTA goldens (boil, completion vignette, toggle) — the *aesthetic* facility census; any shell extraction must reproduce them byte-for-π.

Every reduction row below carries this as its born-RED→GREEN obligation: **extract, then the identical 55+174 suite + the visual goldens pass unchanged.** No test edits permitted inside a distillation wave except deletions of tests that assert the *duplication itself* (none found — the suite tests behavior, not structure).

---

## (b) THE ATOMIC PRECEPTS

The irreducible concepts this product is made of. For each: the ONE canonical implementation site, and **every place a second implementation exists for the same precept** (each such place is a distillation row).

| # | Precept (the concept) | Canonical site | Duplicate implementation(s) → distillation |
|---|---|---|---|
| P1 | **THE DEAL** — generate a unique-solution board | `puzzles/{sudoku,futoshiki}/generate.rs` (seed→hole-dig→uniqueness-check) | Recipe identical, 33% line-overlap; the *pipeline* is one precept forked per game. The shared skeleton (`solve empty → shuffle → dig → keep-if-still-unique`) wants a generic `generate_by_digging<C: PuzzleClass>()` in `puzzles/` core; each game supplies only clue-furniture placement. (x2-engine-fit confirms this is THE reuse that unlocks the third game.) |
| P2 | **THE ENTRY** — the URL codec (share/restore a board) | `lib/base64url.ts` (neutral, dual-consumed ✓) | but `useUrlState.ts` twin (54%) re-implements encode/decode per game + `InitSource` dual-copied (r2-T1 P3). The *codec* is single; the *state-glue* is twinned. |
| P3 | **THE MARKS** — pencil-mark candidates in a cell | `games/shared/usePencilMarks.ts` ✓ + `propagate*` wasm (free for any AllDifferent game, per x2) | the *rendering* of marks is twinned inside `Cell.vue` (the `marks-fade-in`/`ghost-draw-on` grid) — CellShell extraction. |
| P4 | **THE REVEAL** — solve→animate the answer in | `useSolver.ts` transport (byte-identical, r2-T1) + `SolveState` machine (`shared/types.ts` ✓) + cell reveal keyframes (twinned in Cell.vue) | transport → `games/shared/solver/` factory (r2-T1); reveal animation → CellShell. |
| P5 | **THE VERDICT** — the two failure fictions (teacher-red vs paper-note) | `classifyError.ts` + `solverError.ts` (**code byte-identical across games**) + `SolverErrorNote.vue` (94%) | pure duplication on a misstated boundary (r2-T1); the whole fiction machinery is ONE precept implemented twice. |
| P6 | **THE BOIL POSE** — hand-drawn line wobble | `pencil/grid/gridPaths.ts` + `HandDrawnGrid` (centralized ✓) | forked from pencil-boil's `boilLineFrames`/`boilRectFrames`, drifted (r2-T6). One precept, two repos. |
| P7 | **THE BEAT** — the motion cadence/easing grammar | `pencilConfig.ts MOTION` (TS) | 38/39 curve occurrences are inline CSS literals, un-tokenized; the easing precept lives in NEITHER hub (r2-T5). |
| P8 | **THE CHROME PIECE** — a named aesthetic component | `pencil/chrome/*` + subdir barrels | dual import-grammar (barrel vs deep-import), stale barrel missing `CelebrationHeart` (r2-T2). |
| P9 | **THE CHORE (control shell)** — heading + selector(s) + action row + peek | `OptionSelector`/`DigitPad`/`DrawerTab` extracted ✓ | but the *shell* wrapping them (action-button row + peek divider + drawer host + CSS) is 92% twinned in `ControlPanel.vue` — GameControlPanel shell (NEW row, r2 declined). |
| P10 | **THE STAGE (scene shell)** — board + logo + drawer choreography + completion | `useControlsDrawer.ts` (shared ✓) + `Game.vue` | `Game.vue` scene scaffold 63% twinned; the board/logo centering + completion-vignette mount is one precept twinned. |
| P11 | **THE BOARD (grid furniture)** — cells laid in a grid + conflicts | `Board.vue` + `conflicts.ts` | 76%/62% twinned; grid scaffold + conflict-marking is one precept, furniture (subgrid vs inequality) is the genuine per-game slot. |
| P12 | **THE GAME CONTRACT** — what a "game" IS to the shell | *implicit* — no interface exists; each game is a bespoke dir wired by convention | **THE central distillation deliverable.** The shell's contract (a game = `{ board model, cell model, solver client, clue-furniture renderer, option config }`) is nowhere declared as a type; it's re-satisfied ad hoc per game. Distillation must PRODUCE `defineGame<TBoard, TCell, TClue>()` so game #3 (x2/x4) plugs in, not forks. |

**Where the code exceeds the precepts:** P4/P5 (solver transport + failure fiction) are the cleanest violations — byte-identical code implemented twice on a boundary rule that the repo's own `lib/base64url.ts` contradicts. P9/P10/P11 (control shell, scene shell, board shell) are localized-divergence twins that r2 mis-declined. P1 (the deal) is a forked pipeline. P12 (the contract) is the *absence* that forces all the others to fork.

---

## (c) THE REDUCTION PLAN

Wave-shaped rows, each with a LOC-delta estimate, risk, and the facility-preservation proof obligation. Ordered so the **game contract (P12) is produced, not fought** — the KISS razor says extract the shell *as an interface* so game #3 is additive. Rows marked (⊇r2) extend/subsume an r2-arch row; rows marked (NEW) are this lane's at the LOC grain.

| Wave | Row | Precepts | LOC delta (est.) | Risk | Born-RED gate |
|---|---|---|---:|---|---|
| **W-solver-seam** (⊇r2-T1) | `games/shared/solver/`: `createSolverClient<Req,Res>()` factory + shared `SolverError`/`classifyError`/`classifyCode` + generic `SolverEnvelope`; each game supplies worker URL + payload builders + marshalling | P4,P5 | **−320 to −380** (useSolver transport ~180, solverError 2×~30, classifyError 2×~45, protocol envelope ~40) | LOW — transport is per-instance either way; only the depth lint gains a `games/shared/solver` allow (same class as base64url, already legal) | The 55 e2e (esp. `throttled-void`, `sudoku-interaction` error paths) + solve-fiction assertions pass unchanged; worker chunk-split unaffected (worker URL stays game-local) |
| **W-verdict-note** (NEW) | Fold `SolverErrorNote.vue` (94% twin) into one `SolverErrorNote` in `games/shared/`, game supplies the on-board conflict renderer via slot; kills `note-slide-in`/`note-fade-in` dup | P5 | **−95** | LOW | `affordances.spec` note-card + role="alert" a11y; visual golden of the note card |
| **W-control-shell** (NEW; contradicts r2-decline) | `games/shared/GameControlPanel.vue`: heading-slot(s) + action-button row + hold-to-peek `BoilDivider` + drawer host + CSS. Sudoku passes 2 sections (size+difficulty) + tab-toggle; Futoshiki passes 1. Kills `sharePop`/`eraserScrub` dup | P9 | **−400 to −450** (of the 453 identical lines) | **MED** — the mobile `expandedPanel` tab affordance is Sudoku-only; the shell must accept 1..n sections and only render tabs at n≥2 (KISS: n-section-generic). Prove no behavior drift on the single-section path | `digit-pad`, `drawer`, `affordances` specs; visual goldens of both panels; peek-hold timing |
| **W-cell-shell** (NEW) | `games/shared/GameCell.vue` (or a `useCell` composable): pencil-mark grid + `ghost-draw-on`/`marks-fade-in`/reveal keyframes + conflict-shake + selection model. Furniture (FutoshikiCaret, subgrid ticks) stays a per-game slot | P3,P4,P11 | **−280 to −320** (of the 320 identical) | **MED-HIGH** — cells are the hottest render path; the shell must not add reactivity depth (perf is an owner P0, E7). Extract as a *thin* composable + slotted furniture, not a wrapper component that adds a vnode layer | `sudoku-interaction`, `futoshiki`, `digit-pad` specs; **visual-regression cell goldens byte-for-π**; the boil FPS probe (idle 0-paint invariant) |
| **W-board-scene-shell** (NEW) | `games/shared/GameBoard.vue` + `GameScene.vue`: grid scaffold + completion-vignette mount + error-note host + drawer choreography + logo/board centering. Furniture (subgrid lines vs inequality glyphs) = slot; conflicts.ts → `games/shared/conflicts.ts` generic + per-game adjacency | P10,P11 | **−450 to −520** (Board 455 + Game shell 104 + conflicts 39, minus slot glue) | **HIGH** — this is the completion-choreography + drawer surface the owner audited 4× (E2/E3/E4); the extraction MUST reproduce the drawer easing + golden-board reveal exactly | Full 55 e2e incl. `drawer.spec` easing; **all visual goldens** (completion vignette, golden board, drawer glide); the idle-FPS/OOM probe |
| **W-deal** (NEW; enables M8) | `puzzles/` core: generic `generate_by_digging<C: PuzzleClass>()` (seed→dig→uniqueness). Each game impls `PuzzleClass` (base CSP + clue-furniture placement). Sudoku/futoshiki generate.rs shrink to their `PuzzleClass` impl | P1,P12 | **−120 to −160** rust (of the forked pipeline) + **PRODUCES** the third-game seam | MED — trajectory-dependence under Ac3 is documented; the uniqueness check (`max_solutions:2`) is the invariant to preserve exactly | 174 rust tests; generation-uniqueness property tests; x2/x4's third-game plugs into `PuzzleClass` |
| **W-game-contract** (NEW; the keystone, P12) | Declare `defineGame<TBoard,TCell,TClue>()` (FE) + `PuzzleClass` (Rust) as the *named* game interface that all shells above consume. This is the agglomeration of W-control/cell/board-scene: the shells become the contract's implementation, a game dir becomes `{ model, cell-furniture, clue-furniture, options, solver payloads }` | P12 (all) | net **structural** (no new deletion beyond the shells; converts implicit convention → explicit type) | MED — the risk is over-abstraction (a lossy god-interface). KISS guard: the contract is only the intersection the shells already need; anything game-specific stays a slot/impl, never a config flag | A **third game stub** (x2's Thermo-Sudoku, S-effort) compiles against the contract with zero shell edits = the acceptance proof |
| **W-idiom** (⊇r2-T2,T5) | Barrel = sole pencil crossing grammar (add `CelebrationHeart`, drop dead re-exports, tighten depth lint) + easing → `--ease-*` CSS vars (9 curves, 38 literals) | P7,P8 | **−30 to −60** (dead barrel re-exports + literal dedup) | LOW | `lint:eslint` + `lint:knip` clean; visual goldens (easing is zero-runtime) |
| **W-library** (⊇r2-T3,T6) | Shed generic boil/pose from `pencil/grid` → pencil-boil 0.9.0 (`grain`/`radius` params, reconcile `+997`/`+1013`); pencil/ becomes thin product-chrome | P6 | **−250** app (`gridPaths.ts` forked generators) | MED (cross-repo minor + file:-link bump + re-bank boil goldens) | boil visual goldens after the `+997/+1013` reconcile |
| **W-excise-PWA** (NEW; M7 "abrogate PWA") | Remove the PWA notion: `e2e/pwa-offline-smoke.mjs` + any manifest/service-worker/workbox config + vite-pwa plugin. (Owner M7 verbatim: "Why do we have any notion of PWA—this is to be abrogated.") | — | **−?** (measure the manifest+SW+plugin surface; the smoke test alone is one file) | LOW — pure deletion; confirm no offline facility is *advertised* to users before removing | the smoke test deletes with the facility; remaining e2e green |
| **W-dev-tool** (NEW, P3) | `pencil/dev/FilterTuner.vue` (389 LOC) is a dev-only tuner — confirm it's tree-shaken from prod bundle; if shipped, gate behind dev-only import or excise | — | **−389** if excisable from ship | LOW | bundle-size probe (the lean 86,746 B budget); confirm no prod route mounts it |

### Reduction total (conservative floor)

| Bucket | LOC removed (floor) |
|---|---:|
| Solver seam + verdict note (P4/P5) | ~415 |
| Control shell (P9) | ~400 |
| Cell shell (P3/P4/P11) | ~280 |
| Board + scene shell (P10/P11) | ~450 |
| The deal (P1, rust) | ~120 |
| Idiom + library (P6/P7/P8) | ~280 |
| PWA + dev-tool excision | ~389+ |
| **TOTAL (floor)** | **~2,300 lines** |

Against ~13,700 FE + solver lines that's a **~15–17% net reduction** while **every facility is preserved** (the 55 e2e + 174 rust + visual goldens are the invariant, unedited). The bulk (~1,600) comes from the twin shells (P9/P10/P11/P4/P5) — collapsing the ~1,700-line twin-duplication reservoir A3 measured.

### The game-agnostic dividend (why distillation ≠ DRY-for-its-own-sake)

The KISS/game-agnostic bar (M8/M9, x2/x4) is **satisfied by the reduction, not traded against it**: every shell wave (W-control/cell/board-scene) + W-deal + W-game-contract *produces* the very seam a third game needs. A game #3 (Thermo-Sudoku, x2's S-effort NAME-IT candidate) becomes: one `PuzzleClass` impl (Rust) + one worker payload builder + one clue-furniture slot component — it inherits the shell, the drawer, the pencil-marks, the solver transport, the completion choreography, and the generator **for free**. Today a third game would *fork all sixteen twin files*. The distillation is the precondition for the expansion, not its competitor.

### Ordering / risk note

Run **W-solver-seam → W-verdict-note → W-idiom** first (LOW risk, mechanical, ~600 LOC, no visual surface). Then **W-control-shell** (MED). Defer **W-cell-shell → W-board-scene-shell** to last within the tranche — they touch the owner-audited hot paths (perf E7, drawer E2-E4, completion) and carry the heaviest visual-golden obligation; they need the full π/DELTA gate born RED. **W-game-contract** agglomerates after the three shells land (it *is* their union). **W-deal** is independent (Rust) and can run parallel. **W-excise-PWA / W-dev-tool** are pure-deletion, any time.

---

## Probes (rerunnable)

```sh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
# module cloc
cloc web/frontend/src/games/sudoku web/frontend/src/games/futoshiki --quiet
# twin overlap (code-only identical lines)
cd web/frontend/src
codeonly(){ sed -E '/^\s*\/\//d;/^\s*\*/d;/^\s*\/\*/d;/^\s*$/d' "$1"|sed 's/^[[:space:]]*//'; }
comm -12 <(codeonly games/sudoku/ControlPanel/ControlPanel.vue|sort) \
         <(codeonly games/futoshiki/ControlPanel/ControlPanel.vue|sort)|wc -l   # 453
# solver code byte-identity (r2-T1)
cstrip(){ sed -E '/^\s*\*/d;/^\s*\/\*/d;/^\s*\/\//d'; }
diff <(cstrip<games/sudoku/solver/classifyError.ts) <(cstrip<games/futoshiki/solver/classifyError.ts)  # EMPTY
# doubled keyframes
for k in sharePop eraserScrub note-slide-in note-fade-in marks-fade-in ghost-draw-on; do grep -rln "@keyframes $k" .; done
# invariant suites
grep -rc "test(\|it(" e2e | awk -F: '{s+=$2}END{print s" e2e"}'   # 55
```

family_hint: `twin-duplication-reservoir` (P4/P5/P9/P10/P11 — one precept, two implementations on the game boundary); secondary `absent-game-contract` (P12).
