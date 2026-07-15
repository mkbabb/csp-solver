# T4-W11 · Lane R1 — THE VERDICT-NOTE FOLD (spec Row 1, LOW)

Base HEAD `7d51f562`. Frontend-only row: the two `SolverErrorNote.vue` byte-twins
fold into ONE `games/shared/SolverErrorNote.vue`. The error *fiction*
(`classifyError`/`solverError`) was already shared at W4; this row folds only the
*presentation*. CEN's live figures govern over the spec's stale `65425697` census.

## The extraction shape

- NEW `web/frontend/src/games/shared/SolverErrorNote.vue` — the single game-agnostic
  note card. Imports only the pencil layer (`@pencil/grid/HandDrawnOutline.vue`) + vue
  → the `games/shared/**` three-home tripwire holds (imports NOTHING from
  `@games/sudoku` or `@games/futoshiki`; eslint green).
- Props/emit interface FROZEN, unchanged from the twins: `{ text: string; retryable?: boolean }`
  + `emit('retry')`. Both call sites (`SudokuBoard.vue:820`, `FutoshikiBoard.vue:745`)
  already passed exactly `:text` / `:retryable` / `@retry` — no call-site markup change,
  only the import path.
- **No slot added.** The spec allowed "any divergent on-board conflict rendering via
  slot" — there is NONE: the on-board conflict render (grid recolor + shake + conflict
  marks) lives in the Board/Cell, not in this note card. The two twins diverged ONLY in
  comments (docstring + 2 inline). A straight fold with zero config flags / zero unused
  slots is the KISS-correct shape (the god-interface guard: no speculative slot).
- DELETED `games/sudoku/SudokuBoard/SolverErrorNote.vue` +
  `games/futoshiki/FutoshikiBoard/SolverErrorNote.vue`.
- Re-pointed both board imports `./SolverErrorNote.vue` → `@games/shared/SolverErrorNote.vue`
  (matches the existing `@games/shared/DifficultyTally.vue` import style; no import-order
  rule in eslint.config.js, imports unsorted in-file).

### Rendered surface byte-identity (the "renders byte-identically" gate)

Diffed the shared file against the git-tracked (deleted) sudoku twin:

```
diff <template>…</style> region (incl. comments)  → 0 diff  (BYTE-IDENTICAL)
diff <script> code-only (props/emit/onMounted)     → 0 diff  (BYTE-IDENTICAL)
```

The template + full `<style>` block (keyframes, media query, every value) is
character-for-character the sudoku twin; the sudoku twin was itself identical to the
futoshiki twin in template+style. The scoped `data-v` hash changes (one component now,
not two) but a scoped-attribute selector changes no computed style or pixel. The global
unscoped rule `.error-note-retry { min-height }` (`src/assets/index.css:683`, coarse-pointer
tap floor) is class-based, not `data-v` — it keeps applying unchanged. Pixels are identical.

## Born-RED probes (base `7d51f562`, before the row)

| Probe | Command | RED result (before) |
|---|---|---|
| doubled keyframes | `for k in note-slide-in note-fade-in; do grep -rln "@keyframes $k" src; done` | **2 files each** (both `SolverErrorNote.vue` twins) |
| twin reservoir (this pair) | `cen-census.sh` (CORR) | SolverErrorNote **id=101** CORR / **103** RAW identical lines |

## GREEN after the row

| Probe | Result (after) |
|---|---|
| doubled keyframes | `note-slide-in` → **1 file**, `note-fade-in` → **1 file** (both → `games/shared/SolverErrorNote.vue`) |
| twin reservoir (this pair) | pair no longer exists → cross-dir identical = **0** (was 101 CORR) |

## Net LOC delta (this row) — `cloc web/frontend/src/games`

| Dir | before (`7d51f562`) | after | Δ |
|---|---:|---:|---:|
| games/sudoku | 4,309 | 4,207 | **−102** |
| games/futoshiki | 4,445 | 4,343 | **−102** |
| games/shared | 3,524 | 3,626 | **+102** |
| **games total** | **12,278** | **12,176** | **−102** |

Real deletion: **204 cloc code-lines removed** from the two game dirs, **102 added** to
shared → **net −102 cloc**. Spec est. was ≈ −95; CEN's live figure governs → the row
lands at −102 (each twin was 102 CORR / cloc-102 code-lines; 2×102 − 102 = 102 removed).
The added docstring is comments (cloc-excluded), so shared grew by exactly one body.

## Battery (all GREEN, unedited)

| Gate | Command | Result |
|---|---|---|
| types | `npx vue-tsc -b --force` | exit **0** |
| unit | `npm run test:unit` (vitest) | **271 passed / 21 files**, exit 0 |
| eslint | `npm run lint:eslint` | exit **0** (three-home tripwire holds) |
| knip | `npm run lint:knip` | exit **0** (no orphan; shared file consumed by both) |
| prettier | `npx prettier --check src/` | exit **0** ("All matched files use Prettier code style!") |
| build | `npm run build` | exit **0** (built in 353ms) |

## The invariant — vs the BUILT DIST (`npx vite preview --port 4588`, killed after)

Ran against the dist on `:4588` (owner's `:3000`/`:3001` untouched). The default config's
webServer is unconditional on `:3000`; ran the default suite via a TEMP webServer-free
mirror config (`playwright.r1-verify.config.ts`, extends `playwright.config.ts` with
`webServer: undefined`) — **created for the run, deleted after; no `src/` or `e2e/` edit,
no tracked config/spec touched.** Golden + throttle configs already skip/isolate their
own ports.

| Suite | Config | Result |
|---|---|---|
| **default e2e** | temp mirror of `playwright.config.ts`, `PLAYWRIGHT_BASE_URL=:4588` | **63 passed** (12.1s), exit 0 — incl. `sudoku-interaction` solve-failure error paths, `drawer` easing, `visual-regression` graceful-degradation (backend-off → the note path) |
| **visual goldens (π)** | `playwright-golden.config.ts`, `:4588` | **4/4 passed** (3.1s), exit 0 — `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` all byte-for-π (logo-light clean this run; CEN's ~13% base flake did not surface) |
| **throttled-void** | `playwright-throttle.config.ts` (self-isolated `:4188`) | **1 passed** (3.3s), exit 0 |

Full e2e census **68 = 63 + 4 + 1**, all green, no spec/config edited (the 15 CEN
SHA-256-stamped spec+config files untouched).

## Rust invariant

**R1 touched ZERO rust** — footprint is FE-only (see below). The rust suite is preserved
by construction; per house discipline ("Rust battery where touched") and CEN §0 ("V must
measure the rust invariant against clean `7d51f562`, never the RS-lane-dirty tree"), the
174-test baseline is unaffected by this row. The `csp-solver/**` diffs in the working tree
(`class.rs`, `puzzle_class.rs`, `lib.rs`, `puzzles*.rs`, `rng.rs`) are the concurrent RS
lane's additive `PuzzleClass` work (178 = 174 + 4, RS-stamped green), NOT R1's.

## Footprint (clean, additive, FE-only)

```
 M web/frontend/src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue   (import repoint)
 M web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue            (import repoint)
 D web/frontend/src/games/futoshiki/FutoshikiBoard/SolverErrorNote.vue  (twin deleted)
 D web/frontend/src/games/sudoku/SudokuBoard/SolverErrorNote.vue        (twin deleted)
?? web/frontend/src/games/shared/SolverErrorNote.vue                    (the fold)
```

Temp `playwright.r1-verify.config.ts` deleted, `dist-throttle/` build artifact removed,
`:4588` preview killed. No commit (team lead commits). Tree left additive.
