# T4-W11 · Lane R4 — THE BOARD-SCENE-SHELL (spec Row 4, HIGH — four-times-audited completion + drawer)

Base HEAD `7d51f562` with R1 (SolverErrorNote fold) + R2 (control-shell) + R3 (cell-shell) +
RS (rust `PuzzleClass`) already in-tree. The twin `Board.vue` bodies (grid scaffold, reveal-wave
stagger, conflict/peer highlight, roving-tabindex ARIA grid, marginalia status machine, completion
vignette + celebration heart, paper-note host, drawer margin voice, draw/erase animation state
machine) lift to ONE game-agnostic `GameBoard.vue` shell; the twin `Game.vue` scene scaffolds
(`.app-layout` row, `.board-peek-host` + pull-tab, doubled controls card, drawer registration) lift
to ONE `GameScene.vue`; the twin `conflicts.ts` collapse to ONE generic `conflicts.ts` + per-game
adjacency. Furniture (subgrid ticks / inequality caret, box-band / Latin-square adjacency, difficulty
voice, UI-13) stays a per-game slot or function — NEVER a config boolean (the god-interface guard).
CEN's live figures govern.

## The extraction shape

- **NEW `src/games/shared/conflicts.ts`** — generic `findConflicts(values, boardSize, adjacency)`:
  the shared Latin-square row/col core, plus `adjacency.subgridSize` → box units (Sudoku) and
  `adjacency.extra(values, add)` → extra violations (Futoshiki inequality pairs). Each per-game board
  closes over its adjacency and passes a `conflictsFn`. The two per-game `conflicts.ts` are DELETED.
- **NEW `src/games/shared/GameBoard.vue`** — the shell. Owns ALL shared board script + the full
  scaffold template + ALL board `<style scoped>`. Two slots + six furniture props (all per-game
  functions/values, no booleans):
  - `#cells` scoped slot — the shell owns the `.board-cells` grid container (ARIA, roving tabindex,
    focus tracking); the game fills it with its own cell component, fed the shell's per-cell derived
    state (`conflicts`, `peerCells`, `hintBecause`, `noiseDelays`, `cellRects`, `marksFor`,
    `focusedPos`, `isRevealed`, `setCellApi`, `onCellUpdate/onMark/onCellFocus/onPeekStart/onPeekEnd`).
  - `#overlay` slot — Futoshiki's caret layer (empty for Sudoku).
  - furniture: `subgridSize` (grid + ghost; Sudoku `size` / Futoshiki `boardSize`), `gridLabel`,
    `conflictsFn`, `peersFn`, `freshBoardCopy`, `idleGradeHint?` (Sudoku-only UI-13).
- **NEW `src/games/shared/GameScene.vue`** — the scene scaffold. Owns `.app-layout`, `.board-peek-host`
  + `DrawerTab`, the doubled `HandDrawnOutline` controls card, the drawer scene registration + Esc
  wiring, and `<style scoped src="@/games/shared/scene.css">`. `#board` slot (game's board + laminate)
  + `#controls` scoped slot rendered in BOTH cards, told the regime by `:mobile` (true stacked / false
  row) — collapsing the mobile+desktop controls-card duplication to one markup per game.
- **Thin `SudokuBoard.vue` / `FutoshikiBoard.vue`** — forward props/emits to the shell, supply the
  furniture, `provide('flourish', celebrating)` (kept GAME-side: slotted cells/caret resolve
  `inject` against the scene, not the shell that renders the outlet), fill `#cells`/`#overlay`,
  re-expose `hintFocusedCell`. The prop/emit interface is unchanged → the scenes' mounts are byte-safe.
- **Thin `SudokuGame.vue` / `FutoshikiGame.vue`** — keep the game-specific script (peek/share/candidate
  glimpse/prewarm), fill `#board`/`#controls`. Drawer refs + registration moved to the shell.

### Correctness decisions that keep pixels + behavior EXACT

- **`provide('flourish')` stays game-side.** Vue resolves a slotted component's `inject` against the
  slot OWNER (the game), not the outlet renderer (the shell). Moving the provide to the shell would
  strip flourish from the cell glyph + caret. The shell keeps its own `celebrating` for its scaffold.
- **Marks idle gate unified into the shell, but Futoshiki binds `:marks` DIRECTLY** from `pencilMarks`
  (its exact former binding) — ZERO behavior change. Sudoku uses the shell's `marksFor` (unchanged).
- **`boardSizeClasses` is the 3-rung Sudoku form in the shell**; on boards ≤9 (Futoshiki's whole 4–7
  range) it yields byte-identical classes to Futoshiki's former 2-rung. The `.shell-lg` CSS is dead
  for Futoshiki (never reaches the lg rung), harmless.
- **`.caret-layer` CSS stays in the Futoshiki thin board** (the element renders in its `#overlay`
  slot → its own `data-v`); `.board-leaving .caret-layer` matches via the shell's ancestor class.
- **`#controls` desktop passes `:mobile="false"`** ≡ the former no-attr (GameControlPanel gates the
  mobile card on `v-if="mobile"`, purely truthy — verified).
- The class-name contract binds unchanged: `.board-shell/.board-wrapper/.board-cells/.board-margin`
  (shell), `.app-layout/.board-peek-host/.controls-card/.scene-controls/.mobile-board-width` +
  `#controls-drawer` (scene). W9's progress border (`fillProgress` → `HandDrawnGrid :progress`) kept.

## Born-RED probes (base, post-R3, before the row)

| Probe | Command | RED result |
|---|---|---|
| twin reservoir (Board) | `cen-census.sh` CORR | Board **id=529** (A=674 / B=648) |
| twin reservoir (Game scene) | CORR | Game **id=96** (A=200 / B=192) |
| twin reservoir (conflicts) | CORR | conflicts **id=40** (A=53 / B=53) |
| contract absent (board) | `ls games/shared/GameBoard.vue GameScene.vue` | **ABSENT** |
| use<Game> twin (out of scope) | CORR | **id=544** — the unextracted twin (see floor note) |

The board twins carry **NO `@keyframes`** (the leave beat is `--ease-fadeOut` transitions), so R4 has
no doubled-keyframe gate — those were R1 (`note-*`), R2 (`sharePop/eraserScrub`), R3 (`marks-*/ghost-*`).

## GREEN after the row

| Probe | Result (after) |
|---|---|
| twin reservoir (Board) | **id=142** (A=179 / B=267) — residue is the two thin boards' near-identical prop/emit forwarding + `#cells` slot bindings (undedupable per-game: different cell component + furniture prop); the ~500-line shared machine is single-copy |
| twin reservoir (Game scene) | **id=52** (A=125 / B=122) — residue is the near-identical board/controls slot bindings; the scaffold + drawer registration are single-copy |
| conflicts | one generic `games/shared/conflicts.ts`; both per-game files deleted |
| contract present | `GameBoard.vue` (633 cloc) + `GameScene.vue` + `conflicts.ts` (61 cloc) exist, consumed by both games |

## Net LOC delta (this row) — `cloc … --csv` SUM code

| Dir | before (post-R3) | after | Δ |
|---|---:|---:|---:|
| games/sudoku | 3,204 | 2,641 | **−563** |
| games/futoshiki | 3,336 | 2,861 | **−475** |
| games/shared | 4,778 | 5,472 | **+694** |
| **games total** | **11,318** | **10,974** | **−344** |

Board files: base pair **1,322 → 1,079** (shell 633 + 2 thin 446) = **−243**. Scene files:
**−72**. conflicts: **−29**. Real deletion (694 landed in shared < 1,038 removed from the game dirs).
**Running R1–R4: 12,278 → 10,974 = −1,304 cumulative.**

## The ≥1,600 floor — RED as literally stated, but STRUCTURALLY unreachable in R1–R4 scope

The floor gate (`cloc(games/**) ≤ 10,678`) is **RED**: at R4 games/** = **10,974** (−296 short).
This is structural, NOT an extraction shortfall:

- **`use<Game>.ts` is a 544-CORR-identical twin (93.5%) that NO extraction row owns.** Rows are
  R1 (SolverErrorNote 101), R2 (ControlPanel 781), R3 (Cell 528), R4 (Board 529 + Game 96 +
  conflicts 40). Assigned reservoir = **2,075 mult**; CEN's full-reservoir **2,619 mult** — the basis
  of the ~1,617 (≈1,600) floor — INCLUDES the unassigned 544-mult `use<Game>` twin.
- **CEN's own discount formula on the ASSIGNED reservoir**: `2,075 × 0.66 (measured trivial discount)
  × 0.935 (codeonly→cloc) ≈ 1,281 cloc`. **Delivered −1,304 — I EXCEEDED CEN's formula prediction
  for the reservoir R1–R4 actually cover** (by 23 cloc).
- The **−296 floor gap ≈ the unextracted `use<Game>` twin** (544 mult × 0.66 × 0.935 ≈ 336 cloc),
  out of every row's scope. Even at R1–R3's proven 0.68 efficiency, R4's 665-mult reservoir tops out
  at ~−452 → cumulative ~−1,412 (games/** ≈ 10,866), still above 10,678: **the floor as stated is not
  reachable without extracting `use<Game>`.**

R4's own spec estimate was −450/520; the delivered −344 reflects the Board being the MOST-divergent
twin (81.6% vs CP 92% / Cell 88%) + the scene being 50% — more genuine furniture (caret, box band,
difficulty voice, UI-13) means more slot/function overhead, hence lower dedup efficiency. The
load-bearing facts CEN names — the **green unedited suite + byte-for-π goldens + idle-0-paint** — are
all GREEN (below); the floor's residual is the structural `use<Game>` gap.

## Battery (all GREEN, unedited)

| Gate | Command | Result |
|---|---|---|
| types | `npx vue-tsc -b --force` | exit **0** |
| unit | `npm run test:unit` | **271 passed / 21 files** (unedited) |
| eslint | `npm run lint:eslint` | exit **0** (three-home tripwire holds; shell imports only `@pencil`/`@/`/`@games/shared`) |
| knip | `npm run lint:knip` | exit **0** (GameBoard/GameScene/conflicts consumed by both games) |
| prettier | `npx prettier --check src/` | exit **0** |
| build | `npm run build` | exit **0** (370ms) |

## The invariant — vs the BUILT DIST (`vite preview --port 4591`, killed after)

Default suite via a TEMP webServer-free mirror (`playwright.r4-verify.config.ts`, deleted after) so
Playwright never touched the owner's `:3000`/`:3001` (left up + untouched). Golden self-skipped its
`:3000`; throttle self-built `dist-throttle` on isolated `:4188` (removed after).

| Suite | Config | Result |
|---|---|---|
| **default e2e** | temp mirror, `:4591` | **63 passed** (12.4s) — incl. `sudoku-interaction` solve/failure/conflict paths, `visual-regression` DOM contract (light+dark, size-switch 4×4/9×9/16×16), `mobile-*` affordances, long-press peek (both games), native bounded entry |
| **drawer.spec** (explicit — the audited surface) | temp mirror, `:4591` | **6 passed** — close glides transform-only + board grows ≥24px + centers + persists; open focuses first control + Esc closes + returns focus to tab; PRM instant swap; keyboard shortcuts with drawer closed; default-open aria; `<1024` stacked no-tab |
| **visual goldens (π)** | `playwright-golden.config.ts`, `:4591` | **4/4 passed** — `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` **BYTE-FOR-π** (the completion vignette + golden-board reveal + celebration heart reproduce exactly) |
| **throttled-void** | `playwright-throttle.config.ts` (isolated `:4188`) | **1 passed** |

Full census **68 = 63 + 4 + 1**, all green, no spec/config edited (the 15 CEN SHA-256-stamped
spec+config files untouched).

## THE PERF DELTA — idle-0-paint invariant (owner P0), CEN recipe verbatim

`r4-idle-paints.json` banked. `cen-idle-paint.mjs` vs the R4 dist on `:4591`:

| Metric (dealt board, 5s) | Sudoku | Futoshiki (clean) | CEN baseline |
|---|---:|---:|---|
| **main-thread paints (trace)** | **0** | **0** | 0 |
| Layout events / `LayoutCount` Δ | 0 / 0 | 0 / 0 | 0 |
| `RecalcStyleCount` Δ | **40** | **40** | ~40 (tripwire floor) |
| boil beats/sec · class-mut | 15.97 · 160 | 15.97 · 160 | 16 · 160 |
| liveCount (grain-hoist layers) | 4 | 4 | 4 |

Both games hit the CEN steady state — **0 paints, RecalcΔ = 40 exactly** — so the board shell added
NO vnode/reactivity depth on the boil path (the cells stay the same components, slotted, not wrapped).
Futoshiki's leak runs (paints 32–34) are the CEN-documented Worker auto-randomize deal-tail
(“~16–34, 2 of N runs; re-run/lengthen settle”), not a regression — the clean run byte-matches CEN.

## Rust invariant

**R4 touched ZERO rust** — FE-only footprint. The 174-test baseline is preserved by construction; per
CEN §0, V measures rust against clean `7d51f562` (or the sealed row SHA). The `csp-solver/**` diffs in
the tree are the concurrent RS lane's additive `PuzzleClass` work, NOT R4's.

## Footprint (clean, additive, FE-only)

```
 M web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue          (→ thin adapter over GameBoard)
 M web/frontend/src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue (→ thin adapter over GameBoard)
 M web/frontend/src/games/sudoku/SudokuGame.vue                       (→ thin scene over GameScene)
 M web/frontend/src/games/futoshiki/FutoshikiGame.vue                 (→ thin scene over GameScene)
 D web/frontend/src/games/sudoku/SudokuBoard/conflicts.ts             (→ shared generic)
 D web/frontend/src/games/futoshiki/FutoshikiBoard/conflicts.ts       (→ shared generic)
?? web/frontend/src/games/shared/GameBoard.vue                        (the board-scene shell)
?? web/frontend/src/games/shared/GameScene.vue                        (the scene scaffold shell)
?? web/frontend/src/games/shared/conflicts.ts                         (generic conflict derivation)
```

Temp `playwright.r4-verify.config.ts` deleted, `dist-throttle/` removed, `:4591` killed,
`:3000`/`:3001` never touched. No commit (team lead commits). Tree left additive.
