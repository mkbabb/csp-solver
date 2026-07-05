# fe-colocation-manifest — Pass 4 closure: recursive frontend colocation under `src/pencil` + `src/games/{sudoku,futoshiki}`

**Agent**: fe-colocation-manifest · **Pass**: 4 (closure) · **Scope**: `web/frontend/src` path topology only — no new feature code, no build re-verification beyond what's cited.

**Owner edict under execution**: recursive colocation everywhere; the animation layer is named `src/pencil` (not `skin` — "one UI, no multiple skins"); decoupled from `src/games/{sudoku,futoshiki}` via `@pencil/*`/`@games/*` aliases; games import pencil, never the reverse, never each other.

**Verdict up front**: the two-layer prototype (`sudoku/`+`skin/`, flat-ish buckets) is a correct and gate-verified *substrate*, but its naming and nesting depth do not match the owner's binding rename. This manifest **replaces** that prototype's topology decisions (naming + a `games/` parent + several deeper nestings its own author didn't have grounds to make yet) while **re-landing** 100% of its and the mandatory-chain's verified content via a mechanical path rewrite — the same class of transformation `fe-composition.md` already proved safe twice (pure `sed` retarget where only the root moved, hand reconciliation where import specifiers also drifted). Every claim below is checked against the actual repository, not just against the prose reports: I reset this worktree to `91bb8b0` (the known-stale-worktree defect, confirmed and corrected), applied `composed-frontend.diff` for real to inspect the composed tree first-hand, grepped every colocation candidate's actual consumer set rather than trusting each prototype's own description, read the union diff's literal `AttributionCard.vue`/`skin.ts` bodies to confirm what "adopt-partial" cuts in practice, and reverted the worktree to a clean `91bb8b0` afterward (this report requires no code change, only a plan).

---

## 0. Method, worktree state, and the evidence run

```
$ git log -1 --oneline                     # before any action
bc37f4dc docs: fix version strings, ...    # STALE — 73 commits behind master, unrelated lineage

$ git merge-base --is-ancestor bc37f4dc 91bb8b0d && echo yes
yes                                        # confirms bc37f4dc IS an ancestor of 91bb8b0d — this
                                            # worktree's branch ref was simply never advanced

$ git status --short | wc -l
0                                          # clean — safe to hard-reset own branch ref

$ git reset --hard 91bb8b0d
$ git log -1 --oneline
91bb8b0d docs: constellation grand-audit fold (2026-06-03)   # corrected
```

Then, to see the real post-composition tree rather than reason from prose alone:

```
$ git apply --check pass3/composed-frontend.diff   # exit 0
$ git apply pass3/composed-frontend.diff           # exit 0
$ find web/frontend/src -type f | sort             # 36 files — matches two-layer-frontend-tree.txt exactly
$ git checkout -- web/frontend/ && rm -rf web/frontend/src/{skin,sudoku} web/frontend/{eslint.config.js,measure-chains.cjs}
$ git status --short | wc -l
0                                                   # worktree left clean, as required for a planning-only pass
```

Direct greps against the applied tree (not the reports' prose) settled every consumer-count claim below — e.g. `grep -rln "useReducedMotion" web/frontend/src` found it still has **2 real consumers** post-composition (`usePathAnimation.ts`, `HandwrittenLogo.vue`) even though `glyphAnimations.ts` and `DarkModeToggle.vue` had already migrated to the new `boilScheduler.ts`-internal `usePrefersReducedMotion()` — a partial migration `fe-composition.md §4a`'s "explicitly retires `useReducedMotion.ts`" line does not fully capture. This kind of first-hand check is what the manifest below is built on, not a copy of the prose.

Inputs read in full: `pass3/fe-composition.md`, `pass2/two-layer-frontend.md` (+ `two-layer-frontend-tree.txt`), `pass3/synthesis-pass3.md` §3/§4, `pass3/futoshiki-wave-spec.md` §2.4/§3, `pass3/union-verdict.md`, plus direct reads of `composed-frontend.diff` / `composed-frontend-with-union.diff` hunks for `AttributionCard.vue`, `skin.ts`, `eslint.config.js`, `tsconfig.json`, `vite.config.ts`.

---

## 1. Full old → new path manifest

Legend: **L** = landed content, gate-verified under the old `sudoku/`+`skin/` naming (`fe-composition.md §5`), renamed/re-nested here. **P** = planned, no code exists yet (Futoshiki). **X** = excised, no destination.

### 1.1 `src/pencil/` — the one animation/aesthetic layer

| Old path (`91bb8b0`, flat) | Landed-as (two-layer, `skin/`) | **New canonical path** | Notes |
|---|---|---|---|
| `src/lib/types.ts` | `src/skin/types.ts` | `src/pencil/types.ts` | `AnimationState` — pencil-owned contract type; `games/sudoku` imports it one-directionally (legal, see §3) |
| `src/lib/pencilConfig.ts` | `src/skin/config/pencilConfig.ts` | `src/pencil/config/pencilConfig.ts` | Unchanged content |
| `src/lib/gridPaths.ts` | `src/skin/components/grid/gridPaths.ts` | `src/pencil/grid/gridPaths.ts` | **Stays flat at bucket root** — 3+ consumers (`HandDrawnGrid.vue`, `HandDrawnOutline.vue`, `usePathAnimation.ts`) plus the accepted cross-boundary straddle `games/sudoku/.../SudokuBoard.vue` calling `generateGridPaths` directly (see §5) |
| `src/components/custom/HandDrawnOutline.vue` | `src/skin/components/grid/HandDrawnOutline.vue` | `src/pencil/grid/HandDrawnOutline.vue` | Flat sibling of `gridPaths.ts`; no private sub-parts of its own |
| `src/components/custom/HandDrawnGrid.vue` | `src/skin/components/grid/HandDrawnGrid.vue` | `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | **Nested one level deeper** than the prototype — see §7 attack |
| `src/composables/usePathAnimation.ts` | `src/skin/composables/usePathAnimation.ts` | `src/pencil/grid/HandDrawnGrid/usePathAnimation.ts` | Nested with it — verified single consumer (`HandDrawnGrid.vue` only), no documented future 2nd consumer (Futoshiki reuses the whole `HandDrawnGrid.vue` component per `futoshiki-wave-spec §2.4`, never imports the composable directly) |
| `src/lib/glyphs/glyphPaths.ts` | `src/skin/components/glyph/glyphPaths.ts` | `src/pencil/glyph/glyphPaths.ts` | **Stays flat** — `futoshiki-wave-spec §2.4` plans a 2nd consumer (caret glyph variants) |
| `src/lib/glyphs/glyphRegistry.ts` | `src/skin/components/glyph/glyphRegistry.ts` | `src/pencil/glyph/glyphRegistry.ts` | Same — planned `FutoshikiCaret` reuse of `pickVariantIndex`/`cellHash` |
| `src/lib/animation/glyphAnimations.ts` | `src/skin/components/glyph/glyphAnimations.ts` | `src/pencil/glyph/glyphAnimations.ts` | Same — `createGlyphWiggle` explicitly planned for caret reuse |
| `src/components/custom/HandwrittenGlyph.vue` | `src/skin/components/glyph/HandwrittenGlyph.vue` | `src/pencil/glyph/HandwrittenGlyph.vue` | Flat sibling in the same bucket, by the same reasoning |
| `src/components/custom/DarkModeToggle.vue` | `src/skin/components/chrome/DarkModeToggle.vue` | `src/pencil/celestial/DarkModeToggle.vue` | **New top-level bucket**, not a chrome sub-item — see §7 for why it isn't decomposed further |
| `src/components/custom/DiceIcon.vue` | `src/skin/components/chrome/DiceIcon.vue` | `src/pencil/chrome/DiceIcon.vue` | Flat — single-file icon, no sub-parts |
| `src/components/custom/SolveIcon.vue` | `src/skin/components/chrome/SolveIcon.vue` | `src/pencil/chrome/SolveIcon.vue` | Flat |
| — (new, extracted) | `src/skin/components/chrome/BoilDivider.vue` | `src/pencil/chrome/BoilDivider.vue` | Extracted from `ControlPanel.vue` by two-layer (§3 of that report); pure aesthetic, zero domain data |
| `src/components/custom/OptionSelector.vue` | `src/skin/components/chrome/OptionSelector.vue` | `src/pencil/chrome/OptionSelector/OptionSelector.vue` | **Nested** — see next row |
| `src/lib/scribbleUnderline.ts` | `src/skin/components/chrome/scribbleUnderline.ts` | `src/pencil/chrome/OptionSelector/scribbleUnderline.ts` | Single consumer (`OptionSelector.vue`), no documented 2nd — genuine recursion opportunity the prototype left flat |
| `src/components/custom/AttributionCard.vue` | `src/skin/components/chrome/AttributionCard/AttributionCard.vue` | `src/pencil/chrome/AttributionCard/AttributionCard.vue` | **Union a11y fix lands here** (see §4); `isUnion` import + vellum branch stripped |
| `src/components/decorative/CrayonHeart.vue` | `.../chrome/AttributionCard/CrayonHeart.vue` | `src/pencil/chrome/AttributionCard/CrayonHeart.vue` | Single consumer, already nested by the prototype — kept |
| `src/composables/useHoverCard.ts` | `src/skin/composables/useHoverCard.ts` | `src/pencil/chrome/AttributionCard/useHoverCard.ts` | **Nested further than the prototype** — verified single consumer (`AttributionCard.vue`), and that consumer is itself pencil-owned (not a game reaching in), so nesting is safe |
| `src/components/decorative/HandwrittenLogo.vue` | `src/skin/components/decorative/HandwrittenLogo.vue` | `src/pencil/chrome/HandwrittenLogo.vue` | **Folded from a dropped `decorative/` bucket** — see §7 |
| `src/components/decorative/SvgFilters.vue` | `src/skin/components/decorative/SvgFilters.vue` | `src/pencil/chrome/SvgFilters.vue` | Same fold — most contestable placement in this manifest, see §7 |
| `src/components/custom/FilterTuner.vue` | `src/skin/components/dev/FilterTuner.vue` | `src/pencil/dev/FilterTuner.vue` | DEV-gated via `import.meta.env.DEV` + `defineAsyncComponent` (two-layer §6); confirmed 0 bytes in prod bundle |
| — (new) | `src/skin/components/dev/rafInstrumentation.ts` | `src/pencil/dev/rafInstrumentation.ts` | Same bucket as `FilterTuner.vue` — "gated, non-shipping tooling" precedent |
| `src/composables/useButtonAnimation.ts` | `src/skin/composables/useButtonAnimation.ts` | `src/pencil/composables/useButtonAnimation.ts` | **Stays flat/global** despite single current consumer (`ControlPanel.vue`, a *games* file) — concern-test, see §6 |
| `src/composables/useReducedMotion.ts` | `src/skin/composables/useReducedMotion.ts` | `src/pencil/composables/useReducedMotion.ts` | **Not dead** — 2 real remaining consumers verified by direct grep (see §0); stays until a follow-up finishes the `boilScheduler.ts` migration |
| — (new) | `src/skin/composables/boilScheduler.ts` | `src/pencil/composables/boilScheduler.ts` | Unified rAF chain; owns `usePrefersReducedMotion()`, the eventual full successor |
| — (new, union) | `src/skin/composables/boilHoldGate.ts` | `src/pencil/composables/boilHoldGate.ts` | Renamed from union's colliding `boilScheduler.ts` (`fe-composition.md §7a`) |
| — (new, union) | `src/skin/components/sheet/SheetWashiLabel.vue` | `src/pencil/sheet/SheetWashiLabel.vue` | ADOPTED union piece — see §4 |
| — (new, union) | `src/skin/components/sheet/AnswerKeyLaminate.vue` | `src/pencil/sheet/AnswerKeyLaminate.vue` | ADOPTED union piece, **PRT-opaque-render defect still open and blocking** (`synthesis-pass3.md §3` item 2) — see §4 |

### 1.2 `src/games/sudoku/` — Sudoku domain layer

| Old path | Landed-as (two-layer, `sudoku/components/...`) | **New canonical path** | Notes |
|---|---|---|---|
| `src/composables/useSudoku.ts` | `src/sudoku/composables/useSudoku.ts` | `src/games/sudoku/composables/useSudoku.ts` | + `peekSolution()`/cache from union adopt-partial |
| `src/composables/useApi.ts` | `src/sudoku/composables/useApi.ts` | `src/games/sudoku/composables/useApi.ts` | Hardcodes `/board/random/{size}/{difficulty}` + `/board/solve` — confirmed Sudoku-only, not reusable |
| `src/composables/useUrlState.ts` | `src/sudoku/composables/useUrlState.ts` | `src/games/sudoku/composables/useUrlState.ts` | Hardcodes `sudoku-board-state` key, `Difficulty`-shaped `PersistedBoard` — confirmed Sudoku-only |
| — (new) | `src/sudoku/types.ts` | `src/games/sudoku/types.ts` | `Difficulty`/`SolveState` — breaks the `useSudoku`↔`useApi`/`useUrlState` type cycle (two-layer §4) |
| `src/components/custom/SudokuBoard.vue` | `src/sudoku/components/SudokuBoard/SudokuBoard.vue` | `src/games/sudoku/SudokuBoard/SudokuBoard.vue` | Retains its accepted `gridPaths`/`mulberry32` straddle (§5) |
| `src/components/custom/SudokuCell.vue` | `src/sudoku/components/SudokuBoard/SudokuCell.vue` | `src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue` | Nested one level deeper than the prototype, per owner's explicit "SudokuCell/ nested" instruction |
| `src/components/custom/ControlPanel.vue` | `src/sudoku/components/ControlPanel/ControlPanel.vue` | `src/games/sudoku/ControlPanel/ControlPanel.vue` | Hold-to-peek gesture on both Solve buttons is now unconditional (no `isUnion` gate) |
| — (new) | `src/sudoku/components/ControlPanel/constants.ts` | `src/games/sudoku/ControlPanel/constants.ts` | `sizeOptions`/`difficultyOptions`, extracted (two-layer §3) |

**No "components/" wrapper level** at either `pencil/` or `games/sudoku/` root — a deliberate flattening relative to the two-layer prototype's `sudoku/components/{...}` / `skin/components/{...}`, matching the owner's own literal enumeration in the assignment ("`pencil/ (grid/, glyph/, chrome/, celestial/, dev/, config, composables...)`", "`games/sudoku/ (SudokuBoard/ ..., ControlPanel/ ..., composables ...)`" — no `components/` segment named in either).

### 1.3 `src/games/futoshiki/` — planned skeleton (per `futoshiki-wave-spec.md §2.4`, not yet built)

| Planned path | Status | Notes |
|---|---|---|
| `src/games/futoshiki/types.ts` | **P** | Own shape — `board_size`, NO `Difficulty` (F3: v1 ships without difficulty tiers), `inequalities: Array<[number,number]>` never participates in given/overridden bookkeeping (F-spec §2.4 row 5) |
| `src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` | **P** | ~90% copy of `SudokuBoard.vue`'s structure; reuses `pencil/grid/gridPaths.ts`'s existing subgrid-degenerate-to-Latin-square behavior verbatim (zero-cost reuse, confirmed by reading the loop logic, not yet run) |
| `src/games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue` | **P** | Nested under `FutoshikiBoard/`, mirroring `SudokuCell/`'s nesting |
| `src/games/futoshiki/FutoshikiBoard/FutoshikiCaret/FutoshikiCaret.vue` | **P** | **Sibling to `FutoshikiCell/`, not nested inside it** — a caret belongs to a cell-boundary pair, not to any one cell (positioned via `gridPaths.ts`'s existing `cellSize` math); domain-owned wrapper around `pencil/glyph/HandwrittenGlyph.vue`, mirroring how `SudokuCell.vue` wraps it today |
| `src/games/futoshiki/ControlPanel/ControlPanel.vue` | **P** | Own file — **not shared** with `games/sudoku/ControlPanel.vue` (games never import each other; F5 flags `size` vs `board_size` as a live footgun against any shared-panel temptation) |
| `src/games/futoshiki/ControlPanel/constants.ts` | **P** | `board_size` options only, no difficulty options (F3) |
| `src/games/futoshiki/composables/useFutoshiki.ts` | **P** | ~70% copy of `useSudoku.ts`'s state shape + `inequalities` field |
| `src/games/futoshiki/composables/useApi.ts` | **P** | **Own file, own endpoints** (`GET /futoshiki/random/{board_size}` per F3) — confirmed `games/sudoku/useApi.ts`'s literal hardcoded paths are not reusable |
| `src/games/futoshiki/composables/useUrlState.ts` | **P** | **Own file** — `PersistedBoard`'s shape diverges materially (no `difficulty`, no `overriddenCells`/`originalGivenCells` semantics per F-spec §2.4) |
| `pencil/glyph/glyphPaths.ts`, `pencil/glyph/glyphRegistry.ts` | **P** (content-only) | Gain new `<`/`>` variant entries — no new file, an edit to the existing pencil files already flat-bucketed for exactly this reuse (§1.1) |

### 1.4 Excised — no destination (dead code, corroborated by two independent Pass-2 prototypes)

| Path | Why |
|---|---|
| `src/components/decorative/VineBorder.vue`, `DoodleAccents.vue`, `src/lib/vineGenerator.ts`, `vineShapes.ts`, `doodleShapes.ts` | Zero reachable imports from `App.vue`; imported the removed `Animation` keyframes.js export |
| `src/lib/scribbleFill.ts` | Zero consumers anywhere |
| `src/lib/utils.ts` | Dead shadcn `cn()` helper, zero consumers |
| `web/frontend/components.json`, `web/frontend/tailwind.config.ts` | Dead shadcn-vue scaffold / dead v3-style config never loaded by the v4 CSS-first pipeline |
| `src/skin/skin.ts` (union `?skin=union` A/B flag) | **Excised in this pass, not merely renamed** — see §4 |

---

## 2. Union adopt-partial placement — pencil, not games/sudoku

Per `synthesis-pass3.md §3`: ADOPT washi tooltip + hold-to-peek (no `backdrop-filter`), KEEP the `AttributionCard` a11y `<button>` fix as pure-pencil, CUT the vellum `ControlPanel` + vellum-lifted attribution styling, DEFER sticker gleam.

**Decision: `pencil/sheet/`, not `games/sudoku/`.** Reasoning, cross-checked against the actual diff bodies:

- `SheetWashiLabel.vue` is a pure presentational tooltip decoration — its only current call site is `games/sudoku/ControlPanel.vue`'s desktop tooltips (`fe-composition.md §7`: "SheetWashiLabel swap on desktop tooltips"), but it carries zero Sudoku-specific data (takes `text`/`seed` props per the real diff). A future Futoshiki `ControlPanel.vue` needing the same tooltip treatment would otherwise have to duplicate it or reach across the forbidden games↔games boundary — pencil is the only legal shared home.
- `AnswerKeyLaminate.vue` is explicitly board-shape-agnostic in its own spec (`futoshiki-wave-spec.md §2.4` row 9: "reads `cellRects`, not a Sudoku-specific shape... should work unmodified for a Futoshiki board's `peekSolution()`"). Domain-specific only in what data is *passed in* (via props from `SudokuBoard.vue`/eventually `FutoshikiBoard.vue`), not in its own logic — same games→pencil edge as everything else in this manifest.
- Confirmed the direction is legal by construction: `games/sudoku/ControlPanel.vue` and `SudokuBoard.vue` importing FROM `pencil/sheet/*` is precisely the sanctioned "games import pencil" direction, never the reverse.

**Gesture logic itself stays in the game layer.** The press-and-hold handler that calls `peekSolution()` lives in `games/sudoku/ControlPanel.vue` (domain event wiring); only the *rendered artifact* (the laminate, the washi label) is pencil. `App.vue`'s peek state + keydown handler + `cardClass` (root-level orchestration, per `fe-composition.md §7`) stay at `src/App.vue` — an expected root bridge, same category as its existing skin+domain imports.

**`boilHoldGate.ts` → `pencil/composables/`** (not nested under any one component) — it wraps whichever scheduler is active to freeze frame count; consumed by both `ControlPanel.vue` (games) and `BoilDivider.vue` (pencil), so it must sit at the layer-global composables level, not inside either consumer's private folder.

**`skin.ts` is excised, not relocated — this is the one genuinely new call in this pass.** Read its own doc-comment verbatim from the diff:

```ts
/**
 * Skin flag — `?skin=union` opts into the storybook-glass union treatment;
 * anything else (default) is pure pencil, the incumbent end-state.
 *
 * Read once at load: the flag is a build/preview switch for side-by-side
 * evaluation, not a runtime toggle. ...
 */
```

Its own author calls it evaluation scaffolding ("a build/preview switch for side-by-side evaluation, not a runtime toggle"), not a shipped feature. `synthesis-pass3`'s adopt-partial verdict is exactly the decision that scaffolding existed to produce; once rendered, the comparison is over. The owner edict is explicit — "one UI, no multiple skins" — which forecloses shipping a permanent `?skin=` branch point. Concretely, this means every `isUnion` conditional guarding an ADOPTED piece becomes unconditional, and every one guarding a CUT piece is deleted outright:

- `ControlPanel.vue`: `:aria-label="isUnion ? '...(hold to peek...)' : '...'"` → the peek-capable label always (hold-to-peek is now a permanent feature, not a variant); `<SheetWashiLabel v-if="isUnion" .../>` → drop the `v-if`.
- `AttributionCard.vue`: `import { isUnion } from '@skin/skin'` removed; `:class="[{ 'is-open': isOpen }, isUnion ? 'union' : '']"` → `:class="{ 'is-open': isOpen }"`; the entire `.hover-card.union` / `.hover-card.union::after` / `@media (prefers-reduced-transparency)` CSS block (~34 lines, confirmed by direct read of the diff hunk) is deleted along with it — that block is exactly the vellum styling `synthesis-pass3` cuts. The real `<button type="button">` + `aria-expanded` markup (the actual a11y fix) is the only part of that file's union-authored diff that survives.
- `App.vue`: `import { isUnion } from '@skin/skin'`; `cardClass = isUnion ? 'sheet-vellum' : 'bg-card'` and the `if (!isUnion) return` early-exits in the peek handlers — the `cardClass` ternary is deleted (vellum cut, `cardClass` reverts to a plain constant), the peek early-exits are deleted (peek is now unconditional).

**Blocking residual, inherited, not resolved by this pass**: `AnswerKeyLaminate.vue` still carries the PRT (prefers-reduced-transparency) incomplete-answer-key defect (`synthesis-pass3.md §3` item 2, `prt-light-held-board.png` evidence) — a content bug in the file that lands at the path above, not a placement question. It must be fixed (render the full solution when the laminate is opaque) before this feature ships; the path is settled regardless.

---

## 3. The truly-global shortlist — attacked, not rubber-stamped

The assignment names three candidates for a genuinely shared, non-recursive location. I resolved each by grepping actual consumers rather than assuming symmetry:

| Candidate | Verdict | Evidence |
|---|---|---|
| **`useTheme.ts`** | **PROMOTE to `src/composables/useTheme.ts`** (root, sibling to `pencil/` and `games/`) | Real cross-layer consumer today: `pencil/celestial/DarkModeToggle.vue` (`isDark`/`toggleDark`) **and** `games/sudoku/ControlPanel.vue` (`useTheme` per `fe-composition.md §3`'s own import-list finding). A future `games/futoshiki/ControlPanel.vue` needs the identical dark-mode read. Neither layer owns "which theme is active" — it's an app-wide cross-cutting concern, the textbook case for the one exception to full recursion. Kept to exactly one file — not a re-grown flat `lib/`. |
| **`useReducedMotion` successor** | **REJECT as global — stays pencil-internal** | Direct grep of the composed tree: **zero** non-pencil consumers, now or planned. All 8 historical consumers (`usePathAnimation.ts`, `glyphAnimations.ts`, `DarkModeToggle.vue`, `SvgFilters.vue`, `HandwrittenLogo.vue`, plus the 3 excised vine/doodle files) are pencil-owned. `games/sudoku`'s own reduced-motion handling is pure CSS `@media (prefers-reduced-motion: reduce)` in scoped `<style>` blocks — no composable needed there at all. The assignment's framing invited treating this as global by analogy with `useTheme`; the evidence refutes the analogy. |
| **`types`** | **REJECT a monolithic global `types.ts` — stays split per-layer/per-game** | `AnimationState` (pencil) is consumed one-directionally by `games/sudoku/SudokuBoard.vue` — legal under "games import pencil," so no promotion is needed just because it crosses the boundary once. `Difficulty`/`SolveState` (`games/sudoku/types.ts`) and the planned `games/futoshiki/types.ts` are domain-owned and, per F3/F5 of `futoshiki-wave-spec.md`, **actively divergent** (Futoshiki has no `Difficulty` at all, and `size` vs `board_size` is flagged as a live footgun against sharing). Manufacturing a shared `games/types.ts` "just in case" before a second game exists to need it would be exactly the contrivance the owner's precept warns against — revisit only if a second real sharing need materializes. |

---

## 4. ESLint boundary ruleset

Base config (`eslint.config.js`, flat config, `eslint-plugin-vue`'s `essential` tier — unchanged from the already-verified two-layer setup) gains three boundary blocks in place of the prototype's single `skinMayNotImportSudoku`:

```js
// @pencil never imports @games — the animation layer renders whatever
// generic, already-erased data it's handed; it never reaches into domain
// state/types. The reverse (games -> pencil) is expected, unrestricted.
const pencilMayNotImportGames = {
  files: ['src/pencil/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['@games/*', '@games', '**/games/*', '**/src/games/*'],
        message: 'src/pencil/** must not import from src/games/** (the domain layer). ' +
                  'Pencil components take generic data via props.',
      }],
    }],
  },
}

// games/sudoku and games/futoshiki never import each other — two
// independently-evolving products sharing only pencil.
const sudokuMayNotImportFutoshiki = {
  files: ['src/games/sudoku/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{ group: ['@games/futoshiki/*', '**/games/futoshiki/*'],
        message: 'src/games/sudoku/** must not import src/games/futoshiki/** — games never import each other.' }],
    }],
  },
}
const futoshikiMayNotImportSudoku = {
  files: ['src/games/futoshiki/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{ group: ['@games/sudoku/*', '**/games/sudoku/*'],
        message: 'src/games/futoshiki/** must not import src/games/sudoku/** — games never import each other.' }],
    }],
  },
}
```

Verification method (once files physically exist): reuse the exact three-probe pattern `two-layer-frontend.md §7` already validated — inject a banned import (alias form), confirm `exit 1`; inject the relative-path traversal escape (`../../games/futoshiki/...`), confirm the glob still catches it; confirm the legal direction (`games/sudoku/**` importing `@pencil/*`) stays `exit 0`. Not re-run here since `games/futoshiki` doesn't exist yet — booked as a gate for whoever lands the rename.

**Where enforcement stops — KISS vs. contrivance, judged explicitly.** I recommend enforcing exactly these **two** real boundaries (pencil↔games, sudoku↔futoshiki) and **nothing finer-grained**. Specifically, do **not** add a rule preventing, say, `pencil/chrome/DiceIcon.vue` from importing `pencil/chrome/OptionSelector/scribbleUnderline.ts` (a sibling's private nested helper). Reasoning:

1. **Blast radius differs by an order of magnitude.** Pencil↔games is a whole-layer, whole-product coupling — if it's violated, an "aesthetic-only" layer silently starts depending on domain business logic (or vice versa), and every future game inherits the coupling. A sibling private-helper reach-in inside one bucket is a single awkward import, caught by a normal code review, trivially reverted — not a systemic risk.
2. **The tooling cost is real and would scale badly.** Enforcing "every nested folder is private to its own parent" mechanically needs either a bespoke import-boundary plugin (`eslint-plugin-boundaries` with a zone per component folder) or dozens of narrow, per-folder `no-restricted-imports` blocks that must be hand-maintained every time a folder gets one level deeper. That's the literal shape of the contrivance the owner's precept names.
3. **The folder name already does the enforcement that matters.** A helper sitting inside `OptionSelector/` or `AttributionCard/` reads, to any reviewer, as "private to that component" — the recursive-colocation convention itself is the signal; a lint rule policing it adds mechanical weight for a mistake class that's cheap to make and cheap to fix, unlike a whole-layer violation, which is expensive both to make (usually silent, e.g. a type-only import with no runtime symptom until a bundler tree-shakes wrong) and to unwind once other code has grown to depend on it.

So: two boundaries, three rule blocks, stop there.

---

## 5. Alias + tsconfig/vite changes

Current baseline (`91bb8b0`, verified by direct read):

```jsonc
// tsconfig.json
"paths": { "@/*": ["src/*"] }
```
```ts
// vite.config.ts
resolve: { alias: { '@': path.resolve(__dirname, './src') } }
```

Target — add two prefixes, keep `@/*` for the handful of genuinely root-level files (`App.vue`, `main.ts`, `assets/`, the one promoted global composable):

```jsonc
// tsconfig.json
"paths": {
  "@pencil/*": ["src/pencil/*"],
  "@games/*": ["src/games/*"],
  "@/*": ["src/*"]
}
```
```ts
// vite.config.ts
resolve: {
  alias: {
    '@pencil': path.resolve(__dirname, './src/pencil'),
    '@games': path.resolve(__dirname, './src/games'),
    '@': path.resolve(__dirname, './src'),
  },
},
```

**Small correction to the prototype's own claim, worth carrying forward**: `two-layer-frontend.md §5` says its aliases were "ordered before the existing `@/*`... defensive." The *actual* landed `tsconfig.json` diff (verified by reading it directly) puts `@/*` first, `@sudoku`/`@skin` after — the reverse of what the prose claims. It doesn't matter either way: `@pencil`/`@games` and `@` don't overlap as prefixes (a specifier has to literally start with `@pencil/` or `@games/` to match those keys; `@/*` only matches things starting with `@/`), so there is no real collision risk regardless of key order in either `tsconfig.json`'s `paths` or Vite's `resolve.alias`. Recorded here so the actual implementer doesn't need to re-derive this from scratch or trust the (here, cosmetically wrong) prose.

---

## 6. Wave sequencing — this manifest **replaces** the two-layer wave's topology, and **re-lands** its content

**Decision: replaces, not "lands atop."** The two-layer prototype's own directory names (`sudoku/`, `skin/`) and nesting depth (a uniform `components/` wrapper, flat `chrome/` bucket with no further recursion) are superseded outright by the owner's binding rename and the recursion instruction — they are not a foundation to build a second layer on top of, they are the thing being renamed.

**But 100% of its underlying code content re-lands**, via the same mechanical-rename-plus-targeted-hand-reconciliation method `fe-composition.md §3`/`§4` already exercised twice successfully (pure path retarget where only the root moved; import-specifier reconciliation where content also needed updating). Concretely, in order:

1. Author (or re-author, from the existing verified diffs) the two-layer prototype's content directly at the `pencil/`/`games/sudoku/` paths in this manifest — since the destination paths are already known and differ from the prototype's own output, doing this in one motion is strictly cheaper than landing the prototype's own diff verbatim and then mass-renaming afterward.
2. Retarget `grain-static-overlay.diff` to `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` (one level deeper than `fe-composition.md §3`'s own retarget target, per §1.1 above) — still a pure path substitution, zero content change, per that report's own finding that the file's logic was untouched by the move.
3. Hand-reconcile `unified-boil-scheduler.diff` against the new `@pencil/*` import specifiers (mechanical retargeting alone is insufficient here, exactly as `fe-composition.md §4b` found); place `boilScheduler.ts`/`rafInstrumentation.ts` per §1.1; migrate `BoilDivider.vue` onto the unified scheduler (the move-created 4th rAF chain `fe-composition.md §4c` flags — still invisible to any file list that isn't read end-to-end).
4. Land the union adopt-partial pieces directly (not the full union diff) per §2 above: `SheetWashiLabel.vue`/`AnswerKeyLaminate.vue` under `pencil/sheet/`, `boilHoldGate.ts` under `pencil/composables/`, the `AttributionCard.vue` a11y fix with `isUnion`/vellum stripped, `ControlPanel.vue`'s hold-to-peek unconditional, `App.vue`'s peek wiring unconditional, `skin.ts` excised, vellum CSS deleted outright.
5. Layer the ESLint config (§4) and aliases (§5) once the files are in their final homes.
6. `games/futoshiki/` slots into the already-built `games/` parent later, with **zero further renaming** — this is exactly the forcing function `futoshiki-wave-spec.md F8` names ("if the topology lands first, new Futoshiki files should target `src/futoshiki/`+`src/skin/`... **the `@sudoku` alias name itself is puzzle-specific, not domain-generic**... this wave is the forcing function that should settle that naming question, not inherit it as an afterthought"). Landing `games/`+`pencil/` now, before Futoshiki code exists, is precisely how that forcing function gets answered proactively instead of by a second disruptive rename after Futoshiki has already shipped against `@sudoku`/`@skin`.

This sequencing must land **before** any Futoshiki wave work starts, matching F8's own stated dependency, and independent of the kernel-soundness (R1) / trait-bound (R2) blockers in `synthesis-pass3.md §4` — those gate whether the *tranche document* can be authored, not whether this frontend rename is safe to execute.

---

## 7. Attack on my own manifest — contestable placements, named, with the tiebreak used

1. **`pencil/chrome/SvgFilters.vue`, `pencil/chrome/HandwrittenLogo.vue`** — the single most contestable call in this manifest. The owner's assignment enumerates `pencil/`'s sub-buckets as exactly `grid/, glyph/, chrome/, celestial/, dev/, config, composables` — no `decorative/`. `SvgFilters.vue` in particular is not really "chrome" in the interactive-UI-furniture sense; it's global SVG `<filter>` plumbing that everything else (grid, glyph, chrome, celestial) references by ID string, closer in spirit to `config/pencilConfig.ts` than to `DiceIcon.vue`. A defensible alternative is a bare `pencil/SvgFilters.vue` at the layer root. **Tiebreak used**: when the owner's enumerated bucket list has no obvious slot for a cross-cutting infra file, fold it into the most general enumerated bucket (`chrome` — "general UI furniture, not grid/glyph/celestial-specific") rather than inventing an unrequested bucket; inventing buckets ad hoc is a bigger process violation than an imperfect fit inside a real one. A different, equally reasonable integrator could put it at the pencil root — flagging explicitly rather than silently picking.

2. **`pencil/grid/HandDrawnGrid/usePathAnimation.ts` vs. flat `pencil/grid/usePathAnimation.ts`** — genuinely a judgment call. Verified single current consumer, no documented future 2nd consumer (unlike `glyphPaths`/`glyphRegistry`/`glyphAnimations`, whose future 2nd consumer — `FutoshikiCaret` — is explicitly written down in `futoshiki-wave-spec.md §2.4`). **Tiebreak rule stated once, applied consistently across this whole manifest**: nest a helper one level under a single-file bucket only when (a) exactly one consumer exists today, **and** (b) no documented future second consumer is named anywhere in the tranche's own specs. Where (b) fails (glyph family), stay flat even with today's single consumer. This is the same rule that produced `scribbleUnderline.ts`'s and `useHoverCard.ts`'s nesting and `useButtonAnimation.ts`'s non-nesting (next item) — a reviewer preferring uniform bucket depth over evidence-driven depth would keep everything flat, matching the two-layer prototype's own (shallower) choice.

3. **`useButtonAnimation.ts` stays flat in `pencil/composables/`, not nested inside `games/sudoku/ControlPanel/`, despite its sole current consumer being `ControlPanel.vue`.** This is the sharpest test of "consumer count vs. concern ownership": naive single-consumer nesting would put it inside the games folder, which is actually *impossible* without violating the pencil/games boundary in the other direction (a pencil-owned animation primitive cannot live inside a games/ folder while pencil is barred from importing games — and games importing a nested pencil file two levels inside a games-owned folder makes no sense either). **Tiebreak**: ownership is decided by what *domain of concern* a module encodes (animation timing vs. game state), not by who currently calls it. `useHoverCard.ts` nests because its sole consumer (`AttributionCard.vue`) is itself pencil-owned; `useButtonAnimation.ts` does not, because its sole consumer lives across the boundary.

4. **`SudokuCell/` as a single-file folder** (`games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue`) — arguably contrived on its own (one file, no colocated constants/composables today) under a strict "don't nest until there's something to nest with" rule. **Tiebreak**: the owner's assignment text explicitly names this exact nesting ("SudokuBoard/ with SudokuCell/ nested"), which overrides my own KISS instinct here — an explicit instruction beats a general heuristic. Flagging the tension rather than silently complying without noting it existed.

5. **`pencil/celestial/DarkModeToggle.vue` left as one 287-line file, not decomposed into `SunIcon.vue`/`MoonIcon.vue` sub-components.** Recursive colocation could plausibly extract the two SVG branches. **Tiebreak**: the sun/moon halves aren't independently reusable or independently animated — they share one `isDark` toggle, one composable call, one CSS transition system (both icons fade/rotate/scale in lockstep as complementary faces of a single control). 287 lines is a coherent single render surface, not a "long-running flat dir" in the sense the owner's precept targets (that precept is about directories accreting many unrelated single-consumer files, not about one component's own line count). Splitting it would be exactly the "without contrivance" case named in the owner edict — noted as a candidate, not executed.

6. **`AnswerKeyLaminate.vue`/`SheetWashiLabel.vue` in `pencil/sheet/` vs. `games/sudoku/` — see §2 for the full reasoning; the contestable part is specifically whether `AnswerKeyLaminate.vue`'s current single real consumer (`SudokuBoard.vue`) should outweigh its documented puzzle-agnostic design.** Resolved in favor of the documented design (`futoshiki-wave-spec.md §2.4` explicitly, not speculatively, calls this out) — the same rule as item 2, applied to a component instead of a composable.

---

## 8. Residual items this manifest inherits but does not resolve

- **PRT-opaque-render defect in `AnswerKeyLaminate.vue`** (§2) — blocking before the peek feature ships; a content bug, not a path question.
- **`useReducedMotion.ts`'s partial migration** — 2 of its historical consumers (`usePathAnimation.ts`, `HandwrittenLogo.vue`) still use the old composable rather than `boilScheduler.ts`'s `usePrefersReducedMotion()`. Not this pass's job to finish, but the file cannot be excised as "retired" until it is — flagged so a future prototype doesn't rediscover this from scratch.
- **`SudokuBoard.vue`'s accepted `gridPaths`/`mulberry32` straddle** (fe-csp-decoupling F6, "partially resolved") carries forward unchanged into `games/sudoku/SudokuBoard/SudokuBoard.vue` — legal under the ESLint direction rule, still an architectural smell (reaching past `HandDrawnGrid.vue`'s component surface into raw geometry) worth a future prototype's attention, not fabricated as fixed here.
- **R1 (kernel-soundness-closure) / R2 (constraint-trait-bound-spike)** from `synthesis-pass3.md §4` — unrelated to this frontend manifest, but they are the reason `readyToAuthor` is still `false` at the tranche level; this deliverable does not change that.

---

## 9. Convergence assessment

High confidence in the path manifest itself: every consumer-count claim was verified by direct grep against a physically-applied composed tree (§0), every union "adopt-partial" boundary was checked against the literal diff hunks (not summaries), and the naming/bucket decisions are traceable to either the owner's explicit enumeration or a stated, consistently-applied tiebreak rule (§7). What keeps this short of full convergence: (a) two placements (`SvgFilters.vue`'s bucket, `HandDrawnGrid`'s nesting depth) are genuinely taste-adjacent judgment calls, named as such rather than resolved to false certainty; (b) the renamed tree itself has never been built — the underlying *content* is gate-verified under the old `sudoku/`/`skin/` names (`vue-tsc -b`, `eslint .`, `vite build`, Playwright smoke all green per `fe-composition.md §5`/`§7`), but nobody has yet run those same gates against `@pencil/*`/`@games/*` — that is the natural next step for whoever executes this manifest, explicitly out of scope for a naming-only pass; (c) `games/futoshiki/` is 100% planned, by design, not a convergence deduction beyond flagging it plainly throughout.
