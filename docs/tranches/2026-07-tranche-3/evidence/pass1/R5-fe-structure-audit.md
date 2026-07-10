# LANE R5 — Frontend Structure Audit (post-W8), tranche-III Pass 1

Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`
Scope: `web/frontend/src` in full against the re-affirmed recursive-colocation edict (satellites with their families; shared dirs only for justified true-globals; long dirs broken + encapsulated). Read-only. Every claim cited file:line.

The W8 manifest (`docs/tranches/2026-07-tranche-2/evidence/execution/T2-W8-manifest.md`) claimed `pencil/chrome` and the shared dirs "already satisfy." This re-audit finds that claim **half-true**: the game/*/solver colocation (W8's headline) is genuinely clean, but `pencil/chrome`, the two shared-composable homes, the App.vue dual-role, and the god-composables all carry drift the manifest under-counted.

---

## 1. Directory inventory — file counts + roles

Line counts from `wc -l` over 66 `.vue`/`.ts`/`.css` files (11,889 LOC total).

### Root
| Path | LOC | Role |
|---|---|---|
| `src/App.vue` | 371 | **Dual-role**: app shell + `?game=` selector **and** the entire Sudoku scene orchestrator |
| `src/main.ts` | 13 | mount |

### `src/assets/` (3 files + `fonts/`)
| Path | LOC | Role |
|---|---|---|
| `assets/index.css` | 454 | global stylesheet — fonts + theme tokens + utilities + print + tap-targets |
| `assets/typography.css` | 269 | the √φ type ladder (imported by index.css:2) |
| `assets/fonts/*.woff2` | — | 3 self-hosted subsets |

### `src/composables/` (1 file)
| Path | LOC | Role |
|---|---|---|
| `composables/useTheme.ts` | 15 | `useDark` global; consumed by **games AND pencil** (true global) |

### `src/games/{sudoku,futoshiki}/` — the W8 colocation (clean)
Per game: `ControlPanel/` (`.vue`+`constants.ts`), `{Sudoku,Futoshiki}Board/` (board + `Cell/` subdir + `SolverErrorNote.vue` + `conflicts.ts`), `composables/` (`use{Sudoku,Futoshiki}.ts` + `useUrlState.ts`), `solver/` (5 files), `types.ts`, `README.md`. Sudoku adds `data/templates.ts`; Futoshiki adds `FutoshikiGame.vue` + `FutoshikiBoard/FutoshikiCaret/`.

| Notable | LOC |
|---|---|
| `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` | 575 |
| `games/sudoku/SudokuBoard/SudokuBoard.vue` | 502 |
| `games/sudoku/ControlPanel/ControlPanel.vue` | 485 |
| `games/sudoku/composables/useSudoku.ts` | 482 |
| `games/futoshiki/composables/useFutoshiki.ts` | 472 |
| `games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue` | 406 |
| `games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue` | 398 |
| `games/{sudoku,futoshiki}/composables/useUrlState.ts` | 236 / 227 |
| `games/{sudoku,futoshiki}/solver/*` | 5 files each (`apiError`, `protocol`, `solver.worker`, `solverError`, `useSolver`) |

The `solver/` dir is the W8 win — a well-encapsulated 5-file family; keep as-is (one naming defect, D3 below).

### `src/pencil/` (9 subdirs + one top-level file)
| Subdir | Entries | Role |
|---|---|---|
| `pencil/celestial/` | 1 (`DarkModeToggle.vue` 300) | theme toggle mascot |
| `pencil/chrome/` | **10** (3 subdirs + 7 loose `.vue`) | grab-bag — see L3 |
| `pencil/composables/` | 2 (`celebration.ts`, `useButtonAnimation.ts`) | shared composables (both cross games+pencil) |
| `pencil/config/` | 1 (`pencilConfig.ts` 311) | config hub — 8 export bands |
| `pencil/dev/` | 2 (`FilterTuner.vue` 440, `rafInstrumentation.ts`) | dev-only, env-gated |
| `pencil/glyph/` | 4 loose (`HandwrittenGlyph.vue` + `glyphPaths/Animations/Registry.ts`) | glyph family, un-subdir'd |
| `pencil/grid/` | `HandDrawnGrid/` subdir + `HandDrawnOutline.vue` + `gridPaths.ts` | grid family |
| `pencil/sheet/` | 2 (`AnswerKeyLaminate.vue` 242, `SheetWashiLabel.vue`) | stationery |
| `pencil/types.ts` | 1 line (`AnimationState`) | true-global type, top-level |

`pencil/chrome/` subdirs (each a properly encapsulated satellite family — the W8 pattern done right): `AttributionCard/` (`.vue`+`CrayonHeart.vue`+`useHoverCard.ts`), `HandwrittenLogo/` (`.vue`+`useGameMenu.ts`), `OptionSelector/` (`.vue`+`scribbleUnderline.ts`).

### `e2e/` (flat)
5 specs (`affordances`, `futoshiki`, `permalink`, `round9`, `sudoku-interaction`) + `pwa-offline-smoke.mjs` + `screenshots/` (3 committed PNGs). Mixed naming register (`round9` is a round-number; the rest feature-named).

---

## 2. Drift rows (edict violations / residue), ranked

### D1 — App.vue is a god-file: app shell + selector **and** the whole Sudoku scene (HIGH)
`App.vue` is not just the shell. It instantiates `useSudoku()` (`App.vue:65`), owns the entire Sudoku peek/laminate/keyboard/marks orchestration (`App.vue:77-132`), and renders the full Sudoku board+controls template inline (`App.vue:170-251`). Meanwhile Futoshiki's identical scene is a self-contained component, `FutoshikiGame.vue` (197 LOC), mounted behind one `v-if` (`App.vue:255`).

**Asymmetry**: there is a `FutoshikiGame.vue` but **no `SudokuGame.vue`** — Sudoku's scene is smeared across the shell. The edict ("each game's scene colocated in its own dir") is satisfied for Futoshiki and violated for Sudoku.
**Cohesion argument**: everything at `App.vue:65,77-132,170-251` references only `sudoku.*` and Sudoku-specific peek gating (`App.vue:86` "Futoshiki owns its own peek"). Extract to `games/sudoku/SudokuGame.vue`, byte-mirroring `FutoshikiGame.vue`. App.vue then drops to a pure shell (SvgFilters, attribution, dark toggle, masthead selector, two `v-if` game mounts) — the two games become symmetric siblings.

### D2 — App.vue ↔ FutoshikiGame.vue twin duplication (HIGH, unlocked by D1)
The peek/laminate/keyboard/share/marks wiring is duplicated near-verbatim: `App.vue:81-132` vs `FutoshikiGame.vue:27-83` (`peekActive`/`peekTouched`/`startPeek`/`endPeek`/`onKeydown`/`onShare`/`watch(peekActive)`). The code itself flags the twinning: `FutoshikiGame.vue:53` comment "Twin of App.vue's Sudoku wiring (D16)". The scene CSS is also duplicated: `.app-layout`/`.board-peek-host`/`.controls-card`/`.mobile-board-width` at `App.vue:282-370` vs `FutoshikiGame.vue:166-186`.
**Cohesion argument**: after D1 extracts `SudokuGame.vue`, the two scenes are structurally identical modulo the board component + prop set. Candidate shared satellite: a `useAnswerKeyPeek(game)` composable (in `pencil/composables/` or a `games/` shared home) absorbing `peekActive`/`startPeek`/`endPeek`/`onKeydown`/`watch`, plus a shared `.app-layout`/scene CSS partial. This is the single largest de-duplication in the tree.

### D3 — `apiError.ts` vestigial naming, both games (MEDIUM — post-excision residue)
`games/sudoku/solver/apiError.ts` and `games/futoshiki/solver/apiError.ts` no longer touch any API. The file header itself says it renders "the client Worker's SolverError" (`games/sudoku/solver/apiError.ts:1-2`); a `grep` for `/api/`/`fetch`/`API` inside it returns **zero** matches. The exports are `classifyError`/`classifyCode`. The name is a fossil of the FastAPI server excised in tranche-2.
**Fix**: rename → `errorFiction.ts` (the file's own vocabulary — "two failure FICTIONS", `apiError.ts:2`) or `classifyError.ts`. Applies symmetrically to both games.

### D4 — Byte-identical base64url codec duplicated across the two `useUrlState.ts` (MEDIUM)
`toBase64Url`/`fromBase64Url` at `games/sudoku/composables/useUrlState.ts:73-81` are **byte-identical** to `games/futoshiki/composables/useUrlState.ts:73-81` (verified by `diff`). These are pure, game-agnostic string transforms — a **justified true-global**. The rest of each codec (`encodeBoard`/`decodeBoardParam`, sudoku `useUrlState.ts:83-139`, futoshiki `:83-156`) is board-shaped and correctly stays per-game.
**Fix**: hoist the two functions to a shared `src/lib/base64url.ts` (or `pencil`-adjacent util). This is the one place the "games never import each other" rule warrants a shared module — a codec primitive, not domain logic. (SolverErrorNote diffs 22 lines, `solverError.ts` 22, `protocol.ts` 39, `apiError.ts` 47 — those are game-shaped enough to stay forked; base64url is the only byte-identical block.)

### D5 — Two homes for shared composables, no rule (MEDIUM)
`src/composables/useTheme.ts` (consumed by games + pencil, `ControlPanel.vue:11`, `OptionSelector.vue:2`, `HandwrittenLogo.vue:4`, `DarkModeToggle.vue:102`) lives in a top-level `composables/` dir holding **exactly one file**. Yet `celebration.ts` and `useButtonAnimation.ts` — also cross-cutting true-globals (both consumed by games boards/panels + pencil, e.g. `useButtonAnimation` at both `ControlPanel.vue`s + `pencil/composables/`) — live in `pencil/composables/`. Same category, two directories, no stated rule.
**Fix**: consolidate. Either all shared composables under `src/composables/` (pencil is a subtree, games already import across it), or all three co-located and the singleton `src/composables/` retired. A one-file top-level dir is precisely the thin-shared-dir shape the edict discourages.

### D6 — `pencil/types.ts` is a 1-line top-level file (LOW)
`pencil/types.ts` holds only `export type AnimationState` (1 line). It is a genuine true-global (consumed by both boards + `HandDrawnGrid.vue` — the drawing state vocabulary), so it earns shared status, but a 1-line file floating at `pencil/` root is un-colocated. It is the grid/glyph draw-lifecycle enum — belongs with its consumers (a `pencil/grid/` or `pencil/animation/` home), not as a bare `pencil/types.ts`.

### D7 — `pencil/` has no README; both games do (LOW)
`games/sudoku/README.md` and `games/futoshiki/README.md` exist; `pencil/` — the largest subsystem (9 subdirs, the shared aesthetic core) — has none (`find` over `web/frontend` returns only root + two game READMEs). Documentation colocation is asymmetric across the two top-level subtrees.

---

## 3. Long-dir / god-file break candidates (with cohesion arguments)

### L1 — `useSudoku.ts` (482) / `useFutoshiki.ts` (472): god-composables bundling 6 satellites (HIGH)
`useSudoku.ts` bundles distinct, named sub-machines:
- core board state + `applyCellValue`/`setCell` (`:44-165`)
- **Bounded undo/redo** — a self-contained `{pos,prev,next}[]` machine (`:67-97`), the comment marks it a W6 satellite
- **peek + hint** (`:250-293`)
- **Engine-domains pencil marks** — a debounced worker-round-trip machine keyed on `values`/`boardGeneration` (`:295-355`)
- persistence (`:373-385`) + share (`:387-394`)

**Cohesion**: the undo machine couples to the rest only via one `applyCellValue` callback (`:90,96`); the marks machine only via `api.propagateBoard` + `values`/`boardGeneration`. Both are **generic across the two games** — `useFutoshiki.ts` carries byte-parallel twins (undo `:63-97`, marks `:289+`, the code labeling marks "D16 twin" at `useFutoshiki.ts:289`).
**Break**: extract `useUndoHistory(applyValue)`, `usePencilMarks(propagateFn, values, gen)`, `usePeek(...)` — and, because the twins are near-identical, these can be **shared** composables (D5's home), not per-game forks. Each composable becomes independently testable; the two god-files shrink to board-state + wiring.

### L2 — `assets/index.css` (454): six concerns in one stylesheet (MEDIUM)
Distinct bands: `@font-face` (`:39-65`), theme tokens `@theme` (`:75-176`), dark tokens (`:179-219`), utility layer — cartoon shadows/laminate/solve-states/keyframes/focus/font-utils/reduced-motion (`:230-380`), R3 tap-targets (`:389-401`), W6 print (`:414-454`). It is a true-global stylesheet (stays in `assets/`), but the single-file mixing is exactly the "long dir/file, break + encapsulate" target. `typography.css` already sits as an `@import`'d sibling (`index.css:2`) — the pattern exists.
**Break**: `@import` partials — `theme.css` (tokens + dark), `animations.css` (keyframes + utility layer), `print.css`. Leaves `index.css` a thin manifest of `@import`s + `@font-face`. (This is the "C1/C2 held rows" residue the lane flags.)

### L3 — `pencil/chrome/` (10 entries): 3 clean families + 7 loose grab-bag (MEDIUM)
The 3 subdirs are model encapsulation. The 7 loose `.vue` are a grab-bag with sub-families hiding in it:
- **Icons**: `DiceIcon.vue` + `SolveIcon.vue` — both consumed by both `ControlPanel.vue`s (`ControlPanel.vue:4-5`), a clear 2-member family → `pencil/chrome/icons/`.
- **Filter defs**: `SvgFilters.vue` (`App.vue:7`) defines the filter IDs (`grain-static`, `wobble-*`) that `pencil/dev/FilterTuner.vue` tunes — the two halves of one filter subsystem are split across `chrome/` and `dev/`. Candidate `pencil/filters/` home (SvgFilters + FilterTuner + `rafInstrumentation`).
- Remaining loose: `BoilDivider.vue`, `ScribbleLoader.vue`, `MarginNote.vue`, `CelebrationStar.vue` — legitimately atomic chrome widgets; fine loose OR grouped as `chrome/widgets/`.
The W8 manifest's "chrome already satisfies" does not hold for these 7.

### L4 — `pencil/glyph/` (4 loose) vs `pencil/grid/HandDrawnGrid/` pattern inconsistency (LOW)
`pencil/grid/` gives its component a subdir with the colocated composable (`HandDrawnGrid/{HandDrawnGrid.vue, usePathAnimation.ts}`), but `pencil/glyph/` leaves `HandwrittenGlyph.vue` + `glyphAnimations.ts` (its analog composable) + `glyphPaths.ts`/`glyphRegistry.ts` (data) all loose. For consistency with the grid pattern: `glyph/HandwrittenGlyph/{HandwrittenGlyph.vue, glyphAnimations.ts}` with `glyphPaths`/`glyphRegistry` as glyph-level shared data. Optional — the current single-dir family is already cohesive.

### L5 (note) — `pencilConfig.ts` (311): 8 export bands, defensibly one file
`MOTION`/`PENCIL`/`YOSHI_COLORS`/`SVG Filter presets`/`BOIL_CONFIG`/`FILTER_PRESETS`/`DRAW_IN_PRESETS`/`GLYPH_ANIM` (`pencilConfig.ts:37,63,74,95,159,221,253,262`). A single config hub is a defensible pattern (one import site, MEMORY names it "the config hub"); flagged only for completeness. Splitting is optional and lower-value than L1–L3.

---

## 4. What genuinely already satisfies (skeptical confirmation)
- `games/*/solver/` — the W8 5-file family is clean encapsulation (one rename, D3). ✓
- `games/*/{ControlPanel,Board,Cell}/` component-families with colocated `constants.ts`/`conflicts.ts`. ✓
- `pencil/chrome/{AttributionCard,HandwrittenLogo,OptionSelector}/` — textbook satellite colocation. ✓
- `pencil/dev/` — clean env-gated dev subtree. ✓
- `pencil/grid/HandDrawnGrid/` — component + colocated composable. ✓

## 5. Priority for Pass-2 spec authoring
1. **D1+D2** (extract `SudokuGame.vue`; de-twin the peek/scene wiring) — largest structural + dedup win, restores game symmetry.
2. **L1** (break the two god-composables into shared undo/marks/peek composables) — feeds D5's home decision.
3. **D5** (settle the one-vs-two shared-composable-home rule).
4. **D3+D4** (rename `apiError`; hoist base64url) — cheap, mechanical, post-excision hygiene.
5. **L2, L3** (index.css partials; chrome/icons + filters regrouping).
6. **D6, D7, L4** (thin-file/README/consistency polish).
