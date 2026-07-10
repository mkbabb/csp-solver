# T3-W7 — FE structure

**App.vue stops being the Sudoku scene. The three-home rule lands as ratified law (ballot Q3), the god-composables shed their twins, and every gate the pass-2 prototype proved at AE=0 re-runs at merged HEAD.** This is the structural wave the two design waves stand on — it moves the board and scene files W9/W10 then paint, so it lands first (K17: structural mirror, never byte-mirror).

**Dependencies**: ← W2 (the ballot is pre-folded; this wave is independent of the Rust chain). Feeds W8 (shared files), W9/W10 (board+scene files). **Effort**: L.

---

## Scope

### The extraction — App.vue → pure shell (A22 Row 1, P2-L5 final plan)

`App.vue` is 371 LOC and *is* the Sudoku scene — `useSudoku` at `:3`/`:65`, the scene template at `:169-251`, peek state/handlers at `:77-132`, scene `<style>` at `:282-370` — while Futoshiki's identical scene is a self-contained 197-LOC sibling behind one `v-if` (`App.vue:255`). The asymmetry is acknowledged in-code (`FutoshikiGame.vue:53`: *"Twin of App.vue's Sudoku wiring (D16)"*).

- **New `src/games/sudoku/SudokuGame.vue`** — structural mirror of `FutoshikiGame.vue`: peek/laminate/keyboard/share/marks wiring + inline board+controls template. **Async laminate preserved** (`defineAsyncComponent`, current `App.vue:14`); `onShare` stays local (`sudoku.shareBoard()`).
- **App.vue → ~177-LOC shell**: `SvgFilters`, attribution, dark toggle, masthead selector, two symmetric `v-if` mounts — `SudokuGame` **eager/static**, `FutoshikiGame` **async** (the eager/lazy asymmetry is ratified, P4 #4: the default game rides the main chunk).
- `awaitTickBeforeActivate` is a **proven no-op** (P2-L5 §R6(a), decisive at the code level): `{immediate:true}` covers the async-resolution hard case that ships in Sudoku today; both scenes adopt the synchronous `peekTouched=true; peekActive=true` pattern. **Delete** the option, `AnswerKeyPeekOptions`, the `options` param, the `nextTick` import and its guard line — the composable ships **branch-free** (K19→UNNECESSARY; the stale `FutoshikiGame.vue:17-21` comment dies with the extraction).

### The three-home rule — ballot Q3, ratified (DISCHARGED → ADOPT)

The owner voted the recommended option (three-home rule + relocate + eslint tripwire). It closes the C2/K35/K39 contradiction (P2-L5 refuted the one-home collapse on a fresh consumer census). Land it exactly:

| Home | Charter | Members (post-wave) |
|---|---|---|
| `src/composables/` | app-global cross-domain (games ∩ pencil), not aesthetic substrate | `useTheme.ts` (stays — genuine app-global, 5 consumers spanning both games + pencil) |
| `src/pencil/composables/` | aesthetic/animation substrate (owns pencil-boil/pencilConfig state) | `celebration.ts` **stays** (census-proven pencil-domain — imports pencil-boil + `CELEBRATION`, consumed by `HandwrittenGlyph.vue:10`; K35), `useButtonAnimation.ts` |
| `src/games/shared/` **(NEW)** | cross-game logic consumed by **both games only**, never pencil | `useAnswerKeyPeek.ts`, `scene.css`, `types.ts`, `constants.ts`, **+ relocate `useUndoHistory` + `usePencilMarks`** here (per ballot Q3, superseding P2-L6's `src/composables/` prototype placement) |

- **`useButtonAnimation` follows the rule into `games/shared/`** (games-only consumer set; the rule illuminates it — P2-L5 flagged it out-of-charter, the ballot folds it in).
- **The ~10-line eslint tripwire** (ratified): `src/games/shared/** ↛ @games/{sudoku,futoshiki}*` — keeps the shared layer game-agnostic. Nothing violates it today (`useAnswerKeyPeek` takes a structural `target`), so it is a **tripwire, not a fix**; its negative control (a deliberate violating import erroring, then passing on removal) is a gate below.
- **Composable-home documentation (Q7)**: the three-home rule table above **IS** the documented rule — DISCHARGED, no separate README prose row.

### God-composable extractions + subdir barrels (A22 Row 2a/2c, P2-T5/K37/K41)

- `useUndoHistory(applyValue)` (50 LOC) + `usePencilMarks(propagate, values, boardSize, totalCells)` (81 LOC) pulled from the 482/472-line twins → `useSudoku.ts` 482→409, `useFutoshiki.ts` 472→395 (indicative; re-measure in-wave per K10/K18). `usePencilMarks`'s per-game propagate wire is a `propagate: () => Promise<Uint32Array>` thunk; `marksActive` is **returned** so each game keeps its identical `watch([values, boardGeneration], …, {deep:true})` byte-preserved (the guard is NOT moved inside — that would alter timer-set behavior).
- **Subdir barrels** `@pencil/chrome` (15) + `@pencil/grid` (7) — **NOT a root barrel** (K41: a root `pencil/index.ts` is bundle-risky — it would defeat the lazy `AnswerKeyLaminate` chunk; proven at chunk-shape parity in the P2-L6 worktree).
- **Depth lint** `no-restricted-imports` glob `['@pencil/*/*/*', '@pencil/*/*/*/**']` scoped to `src/games/**` + `App.vue`/`main.ts`; **6 external 3-level sites** routed through the barrels (K37: "11" was dead — it counted pencil-internal imports the rule correctly ignores). **Flat-config append discipline** (P2-T5): append the depth pattern into each existing game rule's `patterns` array — a naive second config block silently clobbers the cross-game boundary (real finding, correctly handled).

### Mechanical renames + hoists

- **`apiError.ts` → `classifyError.ts`** (`git mv` both games; 4 import sites + 3 doc-comment refs) + **K1b four-variant prune** (the unreachable server-taxonomy copy: TIMEOUT/RATE_LIMITED/NOT_FOUND/INTERNAL). *(K1a `'UNSATISFIABLE'`→`'UNSAT'` ×2 rides W3's mechanical batch, not here.)*
- **base64url hoist** `toBase64Url`/`fromBase64Url` → `src/lib/base64url.ts` (14 LOC), local defs deleted from both `useUrlState.ts`.
- **`.board-cells` → shared constant** `BOARD_CELLS_CLASS` in `games/shared/constants.ts` with the contract comment (*"every board's cell-grid container MUST carry this class or the K-peek focus-exemption silently breaks"*); both boards bind `class="grid" :class="BOARD_CELLS_CLASS"` (rendered value unchanged → scoped `.board-cells {}` rules unaffected); the peek guard consumes it. `scene.css` gets a class-contract header comment for `.app-layout`/`.board-peek-host`/`.controls-card`/`.mobile-board-width`.
- **`SolveState`/`SolveStats` twins** → `games/shared/types.ts` with per-game re-exports (zero consumer churn, no cycle); `Difficulty`/`Inequality`/`BoardSize` stay per-game.
- **Icons regroup** `pencil/chrome/icons/{Dice,Solve}Icon.vue` (A22-2c, mechanical). **Filter-subsystem `chrome/`+`dev/` merge REJECTED** (R-2j: the `dev/` boundary is env-gated and load-bearing — KISS ledger).

### L25-19 gridPaths straddle re-point (G3-5)

`useBoilFrames`/`useBoilCache` shipped at pencil-boil 0.7.0 (the pinned rev, G3 §2d) are the supply side for the hand-rolled frame-cache/`mulberry32` discipline across the board components. Re-point onto the library primitives; the app consumes zero of them today (`grep useBoilFrames|useBoilCache src/` → 0). *(Shares the boardpath surface with W8's cellRects work — sequence W7 before W8.)*

### e2e sweep (A22 Row 3, A12 Δ1-Δ3)

- `round9.spec.ts` → a feature register (`visual-regression.spec.ts`); artifact names `round11-*` → `*-9x9.png`/`*-light.png`/`*-dark.png` (two dev-round numbers baked into permanent names — the exact legacy register the mandate targets).
- The `.mjs` outlier (`pwa-offline-smoke.mjs`, different runner) noted; the flat 6-entry dir is structurally fine at this size.
- **The D3 throttled-void gate (G10 exhibit).** F6's chunk-preload beat needs a codified guard: under CDP throttle (30 KB/s, 500 ms latency), assert a `ScribbleLoader` **or** a mounted `board-shell` within N ms of first futoshiki select. The reproduction is `g10-shots/first-select-void-400ms.png` (wordmark over pure empty paper); locally the void is ~14 ms (invisible — why it survived), on any real network it is the F6 spec's case.

### `:3000`/HMR hardening (R-11b, G10 §0/§6)

`:3000` is **not the app** — it is Vite's HMR socket (`vite.config.ts:206-209` pins `hmr.port: 3000`; it answers a plain GET with `426`). Playwright's `baseURL`+`reuseExistingServer` latches onto it when the app runs elsewhere (0/33 observed, then 33/33 at `:3210`). Pin `server.port` or assert the target serves the SPA (title check), and put the `hmr.port: 3000` pin into this hygiene sweep — it exists only to fix HMR on a port and **desyncs from `--port` overrides by construction** (K46). **Process rider**: lane briefs name the app port explicitly (or say "the running Vite instance — check `lsof`").

### index.css — DROP, HELD-again (ballot Q4, DISCHARGED)

The owner voted drop again. **`index.css` stays monolithic**; the HELD-again record lands in this wave (net-zero runtime benefit, one new silent-404 footgun class, under the long-dirs threshold). The byte-identity bundle + built font-URL guard are **banked** (all four SHAs confirmed by crit-be, P2-T7); the hold **re-opens on the same trigger**. No authoring either way — this is a recorded disposition.

### Polish tier (A22-2d) — last or defer

Glyph/grid pattern consistency, `pencil/types.ts` colocation, `pencil/README.md`. Do last in the wave or defer.

## Gates

| Gate | Value |
|---|---|
| Types | `vue-tsc -b` → exit 0 |
| Boundaries | `eslint .` → exit 0; the three-home tripwire **negative control** re-run (a deliberate `@games/shared/** → @games/sudoku*` import errors, passes on removal); depth-lint negative control re-run (reintroduced 3-level pencil import errors, passes on restore) |
| Chunk shape | build chunk **set** + lazy boundaries unchanged; the ±1 kB eager/lazy shift is de-dup working (undo/marks fold into the eager `index` chunk, `FutoshikiGame` shrinks by the copy it drops) — no chunk merged, no lazy chunk collapsed |
| e2e | full green (33 + the new throttled-void spec + the renamed visual-regression spec) |
| Parity | **reduced-motion AE=0** on all four game×theme pairs (K38: `reducedMotion:'reduce'` freezes boil → deterministic; control AE=0 ⇒ before-vs-after AE=0 — the definitive bound, not P4's single animated control) |
| Void | under CDP throttle, a loader or mounted shell appears within N ms of first futoshiki select (G10's exhibit is the reproduction) |

## Seeds

- `pass2/P2-L5.md` — the final W-E file plan (branch-free peek, three-home ruling, `.board-cells` constant, D4 contract note).
- `pass2/P2-L6.md` + `p2l6shots/` (animated) + `p2l6shots-rm/` (the definitive reduced-motion set, AE=0) — the god-composable + barrel + rename prototype, all five rows gated in-worktree.
- `audit32/A22-module-structure-fe.md` — Row 1/2a/2c/3 with live-verified `wc -l`/`grep` anchors.
- `pass3/G10-design-reprobe.md` §0/§6 + `g10-shots/first-select-void-400ms.png` — the `:3000` mechanism + the throttled-void exhibit.
- `pass3/G3-pencil-boil-pin.md` §2d — `useBoilFrames`/`useBoilCache` shipped at 0.7.0 (the L25-19 supply).

## Residual risks

- Every LOC and e2e count above is indicative (K10/K18) — re-measure in-wave; green/AE=0 are the load-bearing facts, not the integers.
- The `useButtonAnimation` relocation is new to the ratified plan (P2-L5 left it out-of-charter); it is a games-only 11-line press-flag timer, low blast radius — verify both ControlPanel consumers after the move.
- The index.css HELD-again is a **record**, not a change: the same-trigger reopen clause means a future partial-split proposal re-enters against the banked byte-identity proof, not from zero.
- The L25-19 re-point shares the board frame-cache surface with W8's cellRects LRU — land W7's re-point first so W8 measures against the library primitives, not the hand-rolled cache.
