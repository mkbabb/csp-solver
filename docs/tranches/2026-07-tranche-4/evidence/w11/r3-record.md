# T4-W11 · Lane R3 — THE CELL-SHELL (spec Row 3, MED-HIGH — owner P0 perf)

Base HEAD `7d51f562` with R1 (SolverErrorNote fold) + R2 (control-shell) + RS (rust
`PuzzleClass`) already in-tree. The twin `Cell.vue` bodies (pencil-mark grid, native bounded
entry, long-press peek, selection/hover model, accessible-name derivation, the
`ghost-draw-on`/`marks-fade-in` keyframes, conflict-shake ghost tiers) lift to a THIN
COMPOSABLE + a shared scoped stylesheet — **NOT a wrapper component**: zero added vnode layers,
zero added reactivity depth on the cell hot path. CEN's live figures govern.

## The extraction shape (composable + shared scoped CSS, per-game furniture as functions)

- NEW `src/games/shared/useGameCell.ts` — the composable holding ALL twin cell script (refs,
  computeds, `handleInput`/`handleKeydown`, `useLongPress` wiring, engine + user marks). The same
  refs/computeds each cell already declared, defined once → **zero reactivity depth added**. The
  cell's opacity-0 native input is owned via Vue 3.5 `useTemplateRef("cellInput")`, so the thin
  cell declares no ref binding.
- NEW `src/games/shared/gameCell.css` — the shared `<style scoped>` block (proven byte-identical
  between the twins modulo the root class; `diff` showed ONLY comment-wording differences, every
  CSS rule/value identical). Keyed on a neutral `.game-cell` root class, consumed by each cell via
  **`<style scoped src="@/games/shared/gameCell.css">`** — the exact house pattern `scene.css`
  already ships (SudokuGame/FutoshikiGame). Each cell re-scopes the file to its OWN `data-v` hash,
  so the `marks-fade-in`/`ghost-draw-on` keyframes collapse to ONE source file while the
  compiled-per-component scoped specificity (which wins over `index.css:605`'s global
  `.sudoku-cell:focus-within` ring by the `[data-v]` bump) is preserved EXACTLY.
- Each `Cell.vue` → a thin component (its template + the WM-FROZEN `<input>` UNTOUCHED; root gains
  `game-cell` alongside its kept `sudoku-cell`/`futoshiki-cell` class): a defineProps/defineEmits
  stub + `useGameCell(props, emit, furniture)` + `defineExpose({ focus, position })`.
- **Furniture as per-game FUNCTIONS (KISS guard: never a config boolean):**
  - `ariaSuffix()` — futoshiki appends `constraintLabel` (F6 inequality); sudoku returns `""`,
    yielding the byte-identical accessible name.
  - `marksGridStyle()` — sudoku's subgrid-tick grid (`subgridSize`) vs futoshiki's ceil-√ rectangle.
  - `handleInput`'s digit-width clamp UNIFIED to `boardSize >= 10 ? 2 : 1` (the shared intersection;
    it reduces to futoshiki's single-digit slice on its 4..7 boards — proven by the unedited
    futoshiki unit tests). Not furniture: genuinely shared.
- The frozen contract preserved: both cells stay mountable by path with the same props (incl.
  `subgridSize`/`constraintLabel`), emits, root/descendant classes, and `defineExpose` — so the
  boards' `:ref="setCellApi"` idiom and the 24 cell unit tests pass UNEDITED.
- Root classes `sudoku-cell`/`futoshiki-cell` KEPT (load-bearing: `useKeyboardViewport.ts:25`
  querySelector, `index.css:605` focus rule, the unit tests). `FutoshikiCaret` + subgrid furniture
  are board-level slots, never in the cell — untouched.

## Born-RED probes (base, before the row)

| Probe | Command | RED result |
|---|---|---|
| doubled keyframes | `for k in marks-fade-in ghost-draw-on; do grep -rln "@keyframes $k" src; done` | **2 files each** (both `Cell.vue` twins) |
| twin reservoir (Cell) | `cen-census.sh` CORR filter | Cell **id=528** (A=607 / B=596) identical code lines |
| contract (composable) | `ls src/games/shared/useGameCell.ts` | ABSENT |

## GREEN after the row

| Probe | Result (after) |
|---|---|
| doubled keyframes | `marks-fade-in` → **1 file**, `ghost-draw-on` → **1 file** (both → `games/shared/gameCell.css`) |
| twin reservoir (Cell) | **id=228** (A=259 / B=255) — the residue is the near-identical template (undedupable without a forbidden vnode wrapper) + the thin script stubs; the shared bulk is single-copy |
| built-CSS scoping (π de-risk) | keyframes scoped per component in `dist/`: `marks-fade-in-8eb13fed` (sudoku) + `marks-fade-in-a532f1d6` (futoshiki), same for `ghost-draw-on`; all 10 `.game-cell` rules carry `[data-v]` (zero unscoped leak) |

## Net LOC delta (this row) — `cloc … --csv` SUM code

| Dir | before (R2-folded) | after | Δ |
|---|---:|---:|---:|
| games/sudoku | 3,506 | 3,204 | **−302** |
| games/futoshiki | 3,642 | 3,336 | **−306** |
| games/shared | 4,383 | 4,778 | **+395** |
| **games total** | **11,531** | **11,318** | **−213** |

Two cells: **1,060 → 452 cloc** (shed **608**); shared gained **395** (composable 203 + css 192)
→ **net −213** real deletion (not relocation into a fatter shell: 395 landed < 608 removed). The
template stays per-game by mandate (a shared marks/template component = a forbidden vnode layer on
the cell hot path), so a composable-only extraction floors here; the ≥1,600 cumulative floor
(CEN-rebased) lands with R4's board-scene-shell. Running R1–R3: 12,278 → **11,318 = −960**.

## THE PERF DELTA — idle-0-paint invariant (owner P0), CEN recipe verbatim

`cell-shell-idle-paints.json` banked. Ran `cen-idle-paint.mjs` vs the R3 dist on `:4590`.

| Metric (dealt board) | Sudoku (5s) | Futoshiki clean (5s) | CEN baseline |
|---|---:|---:|---|
| **main-thread paints (trace)** | **0** | **0** | 0 |
| Layout events / `LayoutCount` Δ | 0 / 0 | 0 / 0 | 0 |
| `RecalcStyleCount` Δ | **40** | **40–41** | ~40 (tripwire floor) |
| boil beats/sec · class-mut | 15.98 · 160 | 15.98 · 160 | 16 · 160 |
| liveCount (grain-hoist layers) | 4 | 4 | 4 |

- **Sudoku (same composable, same `<style scoped src>`) is cleanly 0 paints EVERY run**, RecalcΔ=40
  exactly — proving the composable form holds the invariant with zero added vnode/reactivity depth.
- **Futoshiki 2/5 clean at 0 paints / RecalcΔ40 / boilMut160** — a byte-match to CEN's steady
  state. The 3/5 leaks (paints 32–34, boilMut still 160) are the CEN-DOCUMENTED Worker deal-tail
  (auto-randomize, "~16–34, 2 of 6 runs; re-run/lengthen settle"), NOT a regression — CEN's own
  json shows the identical pattern (line 9: paints=32). The composable did not raise the
  steady-state RecalcΔ above 40.

## Battery (all GREEN, unedited)

| Gate | Command | Result |
|---|---|---|
| types | `npx vue-tsc -b --force` | exit **0** |
| unit | `npm run test:unit` | **271 passed / 21 files** (the 24 cell twin tests UNEDITED) |
| eslint | `npm run lint:eslint` | exit **0** (three-home tripwire holds; shell imports only `@pencil`/`@/`/`@games/shared`) |
| knip | `npm run lint:knip` | exit **0** (`gameCell.css` registered in `ignore` — the scene.css precedent for `<style scoped src>` assets; knip doesn't parse style-src) |
| prettier | `npx prettier --check src/` | exit **0** |
| build | `npm run build` | exit **0** (built 463ms) |

## The invariant — vs the BUILT DIST (`vite preview --port 4590`, killed after)

Default suite via a TEMP webServer-free mirror (`playwright.r3-verify.config.ts` = `{...base,
webServer: undefined}`, deleted after) so Playwright never touched the owner's `:3000`/`:3001`
(left up + untouched). Golden self-skipped its `:3000`; throttle self-built `dist-throttle` on
isolated `:4188` from my source (removed after).

| Suite | Config | Result |
|---|---|---|
| **default e2e** | temp mirror, `:4590` | **63 passed** (13.5s) — incl. long-press peek (sudoku + futoshiki), native bounded entry, `sudoku-interaction` error paths, `drawer`/`mobile-*` affordances, `visual-regression` |
| **visual goldens (π)** | `playwright-golden.config.ts`, `:4590` | **4/4 passed** (2.7s) — **`cell-light` (single cell + given glyph) and `grid-corner-light` BYTE-FOR-π**, `logo-light`+`toggle-crest-dark` clean |
| **throttled-void** | `playwright-throttle.config.ts` (isolated `:4188`) | **1 passed** (3.5s) |

Full census **68 = 63 + 4 + 1**, all green, no spec/config edited (the 15 CEN SHA-256-stamped
spec+config files untouched).

## Rust invariant

**R3 touched ZERO rust** — FE-only footprint. The 174-test baseline is preserved by construction;
per CEN §0, V measures rust against clean `7d51f562` (or the sealed row SHA). The `csp-solver/**`
diffs in the tree are RS's additive `PuzzleClass` work, NOT R3's.

## Footprint (clean, additive)

```
 M web/frontend/knip.json                                              (ignore += gameCell.css — scene.css precedent)
 M web/frontend/src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue      (→ thin cell)
 M web/frontend/src/games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue  (→ thin cell)
?? web/frontend/src/games/shared/useGameCell.ts                        (the cell-shell composable)
?? web/frontend/src/games/shared/gameCell.css                          (the shared scoped stylesheet)
```

Temp `playwright.r3-verify.config.ts` + `dist-throttle/` removed, `:4590` killed, `:3000`/`:3001`
never touched. No commit (team lead commits). Tree left additive.
