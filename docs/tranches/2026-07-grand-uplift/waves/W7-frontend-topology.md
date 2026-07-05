# W7 — Frontend topology: `src/pencil` + `src/games/{sudoku,futoshiki}`

**The owner's binding rename, executed.** [`fe-colocation-manifest.md`](../evidence/fe-colocation-manifest.md) is the path authority—**pencil/games naming is CANONICAL**. The gate-verified composed diffs were authored under the *superseded* `sudoku/`+`skin/` prototype naming; 100% of their content re-lands via the rename mapping below. Independent of every Rust wave.

**Dependencies**: ← W0 (clean tree, CI lanes). Must land **before** W10 (Futoshiki targets these paths—the F8 forcing function answered proactively). **Effort**: M (2–3 days).

---

## The rename mapping (superseded → canonical)

The composed diffs ([`../artifacts/composed-frontend.diff.gz`](../artifacts/composed-frontend.diff.gz), [`composed-frontend-with-union.diff.gz`](../artifacts/composed-frontend-with-union.diff.gz)) use the two-layer prototype's naming. Translate on authoring—**cheaper to author directly at canonical paths than to land + mass-rename** (manifest §6.1):

| Superseded (composed diffs) | Canonical (this wave) |
|---|---|
| `src/skin/**` | `src/pencil/**` |
| `src/sudoku/**` | `src/games/sudoku/**` |
| `@skin/*` alias | `@pencil/*` |
| `@sudoku/*` alias | `@games/sudoku/*` (under one `@games` root) |
| `skin/components/{grid,glyph,chrome,decorative,dev,sheet}/...` | **no `components/` wrapper**—`pencil/{grid,glyph,chrome,celestial,dev,sheet}/...` |
| `sudoku/components/...` | `games/sudoku/...` (no wrapper) |
| ESLint `skinMayNotImportSudoku` (1 block) | 3 blocks: pencil↛games, sudoku↛futoshiki, futoshiki↛sudoku |

Plus the manifest's deeper nestings (its §1.1/§1.2 tables are the per-file authority—54 rows; consult them, not this summary): `HandDrawnGrid/` gains `usePathAnimation.ts` nested; `OptionSelector/` gains `scribbleUnderline.ts`; `AttributionCard/` gains `CrayonHeart.vue` + `useHoverCard.ts`; `SudokuCell/` nests under `SudokuBoard/` (owner-named); `DarkModeToggle.vue` → new `pencil/celestial/`; `HandwrittenLogo.vue` + `SvgFilters.vue` fold into `pencil/chrome/` (OD-2 blesses or moves `SvgFilters.vue`).

## Scope (file-level)

1. **Re-author the two-layer content directly at canonical paths** (manifest §6 step 1)—the underlying content is gate-verified (`vue-tsc` 0, `eslint` 0, vite build, Playwright smoke 81/81 glyphs) under the old names ([`fe-composition.md`](../evidence/fe-composition.md) §5); the rename is the same class of transformation that report proved safe twice.
2. **Excisions** (manifest §1.4, doubly-evidenced in Pass 2): `VineBorder.vue`, `DoodleAccents.vue`, `vineGenerator.ts`, `vineShapes.ts`, `doodleShapes.ts`, `scribbleFill.ts`, `lib/utils.ts`, `components.json`, `tailwind.config.ts`. **`skin.ts` is never authored**—the `?skin=` A/B flag was evaluation scaffolding; the owner edict ("one UI") forecloses a permanent variant branch (manifest §2).
3. **Aliases** (manifest §5): tsconfig `paths` + vite `resolve.alias` gain `@pencil`/`@games`; `@/*` stays for root files. Key order is cosmetic—the prefixes can't collide (recorded so nobody re-derives it).
4. **ESLint boundary** (manifest §4): the three `no-restricted-imports` blocks, alias + relative-traversal patterns. Enforce exactly the two real boundaries—**nothing finer-grained** (per-folder privacy rules are the contrivance the edict warns against; the folder convention is the signal).
5. **`useTheme.ts` promoted to `src/composables/useTheme.ts`** (root)—the one true cross-layer concern (pencil's `DarkModeToggle` + games' `ControlPanel`, future Futoshiki panel). `useReducedMotion` successor and a monolithic `types.ts` both REJECTED as global (manifest §3—evidence refuted the analogy).
6. New file `games/sudoku/types.ts` (`Difficulty`/`SolveState`—breaks the type cycle); `ControlPanel/constants.ts` extraction; `BoilDivider.vue` extraction (its scheduler migration is W8's).
7. `games/futoshiki/` is **planned skeleton only** (manifest §1.3)—W10 fills it with zero further renaming.

## Acceptance gates

| Gate | Value | Evidence for the bar |
|---|---|---|
| Types/lint/build | `vue-tsc` 0 · `eslint .` 0 · `vite build` green | [`fe-composition.md`](../evidence/fe-composition.md) §5 (the same gates, old names) |
| Boundary 3-probe | banned alias import → exit 1; relative-traversal escape (`../../games/...`) → caught; legal games→pencil → exit 0 | `pass2/two-layer-frontend.md` §7 (the validated probe pattern) |
| Smoke | Playwright: 81/81 glyphs, boil ticking, dark toggle (chains gate arrives with W8) | [`fe-composition.md`](../evidence/fe-composition.md) §5 |
| FilterTuner | 0 bytes in prod chunks (`import.meta.env.DEV` + `defineAsyncComponent`) | `pass2/two-layer-frontend.md` §6 |
| Lockfile | reconciled once (prototypes 8+11 carried overlapping deltas—Pass-2 D10d) | `pass2/lockfile-delta-summary.txt` |

## Seed artifacts

- [`../artifacts/composed-frontend.diff.gz`](../artifacts/composed-frontend.diff.gz) — the mandatory-chain content source. **Re-derive paths** via the mapping; the *content* re-applies. (Its grain/scheduler hunks belong to W8—apply this wave's subset: the two-layer move + excisions.)
- `pass2/two-layer-frontend.md` + `two-layer-frontend-tree.txt` — the 36-file landed tree the manifest re-maps.
- The manifest §1.1/§1.2 tables — the authoritative 54-row old→new listing.

## Residual risks

- **The renamed tree has never been gate-run**—the content is verified under old names; nobody has run `vue-tsc`/`eslint`/build against `@pencil`/`@games` (manifest §9). The gates above are the closing act, not a formality.
- `useReducedMotion.ts` is NOT dead—2 real consumers remain (`usePathAnimation.ts`, `HandwrittenLogo.vue`) after the partial `boilScheduler` migration; it stays until W8 finishes or explicitly carries it (manifest §0/§8).
- `SudokuBoard.vue`'s accepted `gridPaths`/`mulberry32` straddle carries forward—legal under the direction rule, still a flagged smell for a future pass (manifest §8).
- Two taste-adjacent placements (OD-2 `SvgFilters.vue`; `HandDrawnGrid` nesting depth) are flagged, not false-certain—owner may re-point them cheaply at review time.
