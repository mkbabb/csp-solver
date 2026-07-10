# A22 — Module Structure (FE): deduped restructure rows

Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`, verified at HEAD `3b75eca2` (matches both source lanes — no drift since pass-1).
Sources consumed: `scratchpad/tranche3/pass1/R5-fe-structure-audit.md` (pass-1 R5) and `scratchpad/tranche3/audit32/A12-wave-reaudit-w8-edict.md` (skeptical W8 re-audit). This lane re-verified every load-bearing claim directly against the tree (`wc -l`, `grep -n`, `find`) rather than trusting either source blind — all confirmed live. Scope per assignment: **App.vue orchestrator extraction, pencil/ break-up depth, e2e organization** — the three beyond-W8 axes, deduped across R5+A12 (R5's D1/D2 ≡ A12's Δ6; R5's D5 ≡ A12's Δ4; R5's L3 icon row ≡ A12's Δ5; A12's Δ1/Δ2/Δ3 are e2e-only and R5 never reached them).

---

## Row 1 — App.vue is not a shell, it's the Sudoku scene (HIGH, top priority)

**Dedup note**: R5 D1+D2 and A12 Δ6 are the same finding; A12 additionally verifies R5's byte citations and confirms it as "the deepest asymmetry never on W8's table" since W8 scoped only `solver/` + `chrome/` + `index.css`.

Verified live: `App.vue` is 371 LOC; `FutoshikiGame.vue` is 197 LOC (`wc -l`, this session). `App.vue:3` imports `useSudoku`, `App.vue:65` instantiates it (`const sudoku = useSudoku()`), `App.vue:86` and `:114` carry explicit self-aware comments — `// Futoshiki owns its own peek (FutoshikiGame.vue)` and `// Futoshiki's K/Esc is handled in FutoshikiGame.vue` (confirmed via `grep -n`, this session). Futoshiki's identical scene (peek/laminate/keyboard/share/marks + board+controls template) is self-contained in `FutoshikiGame.vue`, mounted behind one `v-if` in App.vue. There is no `SudokuGame.vue`. The two games are structurally asymmetric: one is a sibling component, the other is smeared into the app shell.

`FutoshikiGame.vue:53` names the twin explicitly: `// marks can never outlive the gesture. Twin of App.vue's Sudoku wiring (D16).` (confirmed via `grep`, this session) — the duplication is acknowledged in-code, not merely inferred.

**Fix, in order**:
1. Extract `games/sudoku/SudokuGame.vue`, byte-mirroring `FutoshikiGame.vue`'s shape (peek/laminate/keyboard/share/marks wiring + inline board+controls template). App.vue drops to a pure shell: `SvgFilters`, attribution, dark toggle, masthead selector, two symmetric `v-if` game mounts.
2. Once both scenes are siblings, the near-verbatim duplication between them (`App.vue:81-132` vs `FutoshikiGame.vue:27-83` for peek state/handlers; `.app-layout`/`.board-peek-host`/`.controls-card`/`.mobile-board-width` CSS duplicated `App.vue:282-370` vs `FutoshikiGame.vue:166-186`) becomes extractable into a shared `useAnswerKeyPeek(game)` composable + shared scene-CSS partial. This is the single largest de-duplication opportunity in the FE tree, but it is *gated on* step 1 — you cannot cleanly share what isn't yet symmetric.

This is the #1 pass-2 authoring target per both source lanes independently.

---

## Row 2 — pencil/ break-up depth: three distinct sub-findings, don't conflate

**Dedup note**: R5 enumerates these as L1/L3/L4/D6; A12 confirms L3 as under-scoped by W8's own reasoning (Δ5) and leaves L1/L4/D6 to R5 without re-deriving. Consolidated here as one axis with three depths.

### 2a — God-composables: `useSudoku.ts` (482 LOC) / `useFutoshiki.ts` (472 LOC) bundle 6 sub-machines each (HIGH)
Not literally under `pencil/` but the same "break + encapsulate" clause applies, and R5 frames it as feeding the pencil-composable-home decision (2b below). Each file bundles: core board state, a self-contained bounded undo/redo machine, peek+hint, a debounced engine-domains pencil-marks machine, persistence, and share — coupled to the rest only through narrow interfaces (one `applyCellValue` callback for undo; `values`/`boardGeneration` for marks). Both machines are byte-parallel twins across the two games (Futoshiki's own code labels its marks machine "D16 twin"). **Fix**: extract `useUndoHistory(applyValue)`, `usePencilMarks(propagateFn, values, gen)`, `usePeek(...)` as shared composables — testable independently, resolves the twin duplication at the composable layer the same way Row 1 resolves it at the scene layer.

### 2b — Shared-composable home split across two directories, no stated rule (MEDIUM)
`src/composables/` holds exactly one file (`useTheme.ts`, 5 consumers spanning both games + pencil). `src/pencil/composables/` holds two more cross-cutting true-globals (`celebration.ts`, 3 consumers; `useButtonAnimation.ts`, 2 consumers) that are equally consumed by games and pencil (verified live: `find web/frontend/src/composables web/frontend/src/pencil/composables -type f` returns exactly these three files across the two dirs, this session). A12's Δ4 extends R5's D5 by naming the *latent* rule that would explain the split — pencil-aesthetic composables live under `pencil/`, app-global non-aesthetic state lives top-level — but notes it is nowhere documented, and a 1-file top-level `composables/` dir is itself the thin-shared-dir anti-shape the edict discourages in the opposite direction. **Fix**: either write the aesthetic-vs-app-global rule into the frontend README, or collapse to one `src/composables/` home and let `pencil/` import up.

### 2c — `pencil/chrome/` (10 entries): 3 clean satellite families + 7 loose members with sub-families hiding in the grab-bag (MEDIUM)
Verified live (`find web/frontend/src/pencil/chrome -maxdepth 1`, this session): 3 subdirs (`AttributionCard/`, `HandwrittenLogo/`, `OptionSelector/` — each a properly encapsulated component+composable satellite, the W8 pattern done right) plus 7 loose `.vue` files: `MarginNote.vue`, `CelebrationStar.vue`, `DiceIcon.vue`, `ScribbleLoader.vue`, `SolveIcon.vue`, `BoilDivider.vue`, `SvgFilters.vue`. Two sub-families are identifiable inside the loose set:
- **Icon pair**: `DiceIcon.vue` + `SolveIcon.vue` have identical cross-game consumer sets (both `ControlPanel.vue`s, nothing else). W8's manifest §2 dispositioned these "stay flat — single-file, no owned satellite," testing *ownership*; A12's Δ5 argues the edict's colocate-family clause tests *cohesion*, and two siblings sharing both consumers are a family regardless of internal file count. **Fix**: `pencil/chrome/icons/{DiceIcon,SolveIcon}.vue`.
- **Filter subsystem split across two directories**: `SvgFilters.vue` (defines filter IDs `grain-static`, `wobble-*`, consumed at `App.vue:7`) and `pencil/dev/FilterTuner.vue` (tunes those same IDs) are the two halves of one subsystem, currently split across `chrome/` and `dev/`. **Fix candidate**: `pencil/filters/{SvgFilters.vue, FilterTuner.vue, rafInstrumentation.ts}`. Flagged as real but nuanced in both source lanes — `dev/` is intentionally env-gated and merging may blur that boundary; needs owner adjudication, not a mechanical move.
- Remaining loose (`BoilDivider.vue`, `ScribbleLoader.vue`, `MarginNote.vue`, `CelebrationStar.vue`): legitimately atomic widgets, no further family structure found. Fine either loose or under a catch-all `chrome/widgets/`.

W8's manifest claim "chrome already satisfies" (wave doc §2) holds for the 3 subdirs but not for these 7 — both source lanes agree this is a genuine gap, not scope-creep.

### 2d — Minor consistency/thinness nits, lowest priority (LOW)
- `pencil/glyph/` (4 loose files: component + composable + 2 data files) vs `pencil/grid/HandDrawnGrid/` (same shape, but subdir'd) — inconsistent pattern application. Optional; the loose form is already cohesive.
- `pencil/types.ts` — a genuine true-global (1 line, `AnimationState`, consumed by both boards + `HandDrawnGrid.vue`) floating at `pencil/` root rather than colocated with its grid/glyph consumers.
- `pencil/` itself has no README while both `games/sudoku/` and `games/futoshiki/` do — documentation colocation asymmetry across the two top-level subtrees.

---

## Row 3 — e2e organization: the one FE directory W8 never touched (MEDIUM)

**Dedup note**: R5 flags the mixed-register naming in passing (§1); A12's Δ1/Δ2/Δ3 supersede it with a live-verified correction and two additional findings. Use A12 as the source of record here — this lane re-verified A12's correction directly.

- **R5 correction (A12 Δ1, re-verified live)**: R5 states e2e's `screenshots/` dir holds "3 committed PNGs." This is **false** — `find web/frontend/e2e -maxdepth 1 -type f` (this session) returns 6 spec/mjs files and no `screenshots/` entry at all; the PNGs are untracked runtime output, not committed artifacts. R5's structural conclusion (mixed register) stands; the "committed" characterization does not — do not carry it into pass-2 spec authoring.
- **Round-number leak into permanent artifact names**: `web/frontend/e2e/round9.spec.ts` writes screenshots named `round11-light.png`, `round11-dark.png`, `round11-9x9.png` (confirmed live: `grep -n "round11" web/frontend/e2e/round9.spec.ts` → lines 172, 196, 323, this session). Two different dev-round numbers (9 in the filename, 11 in the artifact names) are baked into permanent names — exactly the "no legacy code" register the owner mandate targets. **Fix**: rename spec to a feature register (e.g. `visual-regression.spec.ts`) and artifacts to match (e.g. `*-9x9.png`, `*-light.png`, `*-dark.png`).
- **Flat dir, mixed extension**: `web/frontend/e2e/` is flat — 4 `.spec.ts` files (`affordances`, `futoshiki`, `permalink`, `sudoku-interaction` — feature-named, clean) plus the round-numbered outlier plus one `.mjs` (`pwa-offline-smoke.mjs`) on a different test runner (confirmed live via `find`, this session). A flat 6-entry dir is structurally defensible (no break-up needed at this size), but it's the one FE directory the recursive-colocation edict binds ("ALL file directories") that W8's src-focused scope never reached. Low churn; bundle with Row 2's mechanical renames rather than treating as its own wave.

---

## Priority ranking for pass-2 authoring (deduped, single list)

1. **Row 1** — extract `SudokuGame.vue`, byte-mirror `FutoshikiGame.vue`, reduce App.vue to a pure shell. Largest structural + symmetry win; gates the peek/scene-CSS de-duplication.
2. **Row 2a** — break `useSudoku.ts`/`useFutoshiki.ts` into shared `useUndoHistory`/`usePencilMarks`/`usePeek` composables. Feeds Row 2b's home decision.
3. **Row 2b** — settle the one-vs-two shared-composable-home rule (document the aesthetic-vs-app-global split, or consolidate to one `src/composables/`).
4. **Row 2c** — `pencil/chrome/icons/` regroup (mechanical); filter subsystem `chrome/`+`dev/` merge (needs adjudication, not mechanical).
5. **Row 3** — e2e naming/register sweep (mechanical, low churn, the one skipped W8 directory).
6. **Row 2d** — glyph/grid pattern consistency, `pencil/types.ts` colocation, `pencil/README.md` — polish tier, do last or defer.

## Explicitly out of this lane's scope (per assignment)
Not re-derived here (see R5/A12 directly): `apiError.ts` naming (D3, standing known-deferred item, not new drift), base64url codec duplication in `useUrlState.ts` (D4, mechanical hoist), `index.css` partial-splitting L2/Δ7 (the C1/C2 CSS-ownership hold is an honest, gate-justified defer per A12, not a structure-row omission), and the already-clean rows (`games/*/solver/`, `games/*/{ControlPanel,Board,Cell}/`, `pencil/chrome/{AttributionCard,HandwrittenLogo,OptionSelector}/`, `pencil/dev/`, `pencil/grid/HandDrawnGrid/`) which both source lanes independently confirm satisfy the edict as-is.
