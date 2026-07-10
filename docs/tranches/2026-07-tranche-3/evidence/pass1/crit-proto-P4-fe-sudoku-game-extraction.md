# Critique — proto-P4-fe-sudoku-game-extraction

**Lane:** `crit-proto-P4-fe-sudoku-game-extraction` · REFUTE-BY-DEFAULT
**Target report:** `proto-P4-fe-sudoku-game-extraction.md` — claim "GO. Extracted Sudoku scene from App.vue into games/sudoku/SudokuGame.vue (byte-mirroring FutoshikiGame.vue), shared useAnswerKeyPeek + scene.css via `<style scoped src>`, App.vue 371→177 LOC (−194, −52%)."
**Worktree audited:** `.claude/worktrees/wf_8f3bd831-d64-13` (branch `worktree-wf_8f3bd831-d64-13`; `git status`: M App.vue, M FutoshikiGame.vue, ?? useAnswerKeyPeek.ts, scene.css, SudokuGame.vue).
**Method:** re-derived every LOC from the tree, re-ran all four gates in the worktree, diffed the extracted scene against the original App.vue, inspected built CSS for scope-hash isolation.

---

## Verdict per material claim

### C1 — LOC: App.vue 371→177 (−194, −52%); Futoshiki 197→124 (−73). **CONFIRMED**
`wc -l` main tree: App.vue 371, FutoshikiGame 197. Worktree: App.vue 177, FutoshikiGame 124, SudokuGame 124 (new), useAnswerKeyPeek.ts 86 (new), scene.css 39 (new). −194 is exact; −52% is exact (194/371=52.3%). −73 exact.

### C2 — "SudokuGame.vue byte-mirroring FutoshikiGame.vue". **CORRECTED**
Both files are 124 LOC and structurally symmetric, but NOT byte-identical, and cannot be:
- different board component (`SudokuBoard` vs `FutoshikiBoard`) and props (`:size` + `:difficulty` + `:subgrid-size="sudoku.size.value"` vs `:subgrid-size="futoshiki.boardSize.value"`; `ControlPanel` `@update:size`/`@update:difficulty` vs `@update:board-size`) — `SudokuGame.vue:45-73,80-117` vs `FutoshikiGame.vue:50-77,84-117`.
- laminate import **static vs async**: `SudokuGame.vue:16` `defineAsyncComponent(() => import('@pencil/sheet/AnswerKeyLaminate.vue'))` vs `FutoshikiGame.vue:20` `import AnswerKeyLaminate from …`.
- composable call differs: SudokuGame passes no options (`:23-27`); FutoshikiGame passes `{ awaitTickBeforeActivate: true }` (`:33`).
The report's own body (§resisted-wiring #4) concedes the import asymmetry "does not byte-mirror." So the GO headline word "byte-mirroring" is loose shorthand for a **structural mirror**. Substance holds; wording must not be authored verbatim.

### C3 — shared `useAnswerKeyPeek` consumed by BOTH games. **CONFIRMED**
Both SFCs `import { useAnswerKeyPeek } from '@/composables/useAnswerKeyPeek'` and call it (`SudokuGame.vue:10,23`; `FutoshikiGame.vue:13,27`). The composable's `startPeek`/`endPeek`/`watch(peekActive→setMarksActive)`/`onKeydown`/mount-unmount listener (`useAnswerKeyPeek.ts:39-83`) is a faithful lift of the original App.vue block (`App.vue:81-133` in main tree) minus the two dissolved `game.value !== 'sudoku'` guards.

### C4 — behavioral parity: guards dissolve, setGame endPeek removed, nextTick preserved. **CONFIRMED**
- Original App.vue guarded `startPeek` (`App.vue:90` `if (game.value !== 'sudoku') return`) and `onKeydown` (`App.vue:117`). Both correctly gone — a `v-if`-mounted scene only carries its listener while selected (mirrors Futoshiki's pre-existing situation).
- Original `setGame` had `if (next !== 'sudoku') endPeek()` (`App.vue:47`) — correctly removed; `onUnmounted` teardown (`useAnswerKeyPeek.ts:83`) replaces it.
- Original Sudoku peek did NOT await nextTick (`App.vue:98` "lay the laminate down immediately"); preserved by default `awaitTickBeforeActivate=false`. Original FutoshikiGame DID (`await nextTick()` + static laminate import); preserved by `{awaitTickBeforeActivate:true}`. Byte-preserved per game.

### C5 — shared scene CSS via `<style scoped src>`, source-dedup with scope-hash isolation, sidesteps C1/C2 global-cascade hold. **CONFIRMED**
Both SFCs end with `<style scoped src="@/games/scene.css">` (`:124` each). Built output proves per-SFC scope hashes and **no global leak**:
- `dist/assets/index-*.css`: `.app-layout[data-v-64d84186]`, `.board-peek-host[data-v-64d84186]` (Sudoku scope).
- `dist/assets/FutoshikiGame-*.css`: `.app-layout[data-v-2ef7bab9]`, `.board-peek-host[data-v-2ef7bab9]` (Futoshiki scope).
- grep for an unscoped `.app-layout` → **zero** hits. No rule enters the global `@layer` cascade, so the C1/C2 hold is genuinely sidestepped. The 39 lines are duplicated across two CSS chunks (once per hash) — this is source-dedup only, and the report says exactly that ("source de-duplication"). Honest.

### C6 — App.vue reduced to a pure shell. **CONFIRMED**
`App.vue` (worktree) imports only chrome (`SvgFilters`, `DarkModeToggle`, `HandwrittenLogo`, `AttributionCard`, dev `FilterTuner`) + `SudokuGame` (static) + `FutoshikiGame` (async), holds only `game`/selector/`closeAll` state, and mounts two `v-if` scenes (`App.vue:98-99`). No `useSudoku`, no board/controls/laminate imports, no peek state. Extracted Sudoku template matches original `App.vue:169-251` verbatim.

### C7 — Gates. **CONFIRMED (with one count CORRECTION)**
Re-ran in the worktree (`web/frontend`, real `node_modules` present):
- `npx vue-tsc -b --force` → **EXIT 0**. ✓
- `npx eslint .` → **EXIT 0** (pencil↛games, sudoku↮futoshiki boundaries intact; `<style src>` is not a JS import so boundaries don't fire on it). ✓
- `npm run build` → **EXIT 0**, `1894 modules transformed`; chunk shape matches to the byte: `index-*.js 108.39 kB` (SudokuGame folds in, eager), `FutoshikiGame-*.js 31.94 kB` (lazy), `AnswerKeyLaminate-*.js 2.21 kB` (separate lazy). ✓ **all three chunk figures reproduced exactly.**
- `npx playwright test` → **EXIT 0**, but observed **32 passed, 1 skipped** — NOT the report's "33 passed". **CORRECTED**: the gate is green (zero failures across affordances/permalink/round9/sudoku-interaction/futoshiki specs), but the "33 passed" count is off; actual is 32 passed + 1 skipped in this environment. Non-blocking, but the number must not be authored verbatim.

---

## Open questions / shape doubts (convergence deductions)

**D1 — `awaitTickBeforeActivate` is likely a no-op → unresolved overengineering seam. UNVERIFIABLE-as-necessary.**
`AnswerKeyLaminate`'s activation watch is `{ immediate: true }` (`AnswerKeyLaminate.vue:86`), with the comment "the async component can mount with active already true on the very first peek — without this the initial lay-down is missed" (`:84`). That is the precise condition the old Futoshiki `nextTick` existed to avoid — so the `nextTick`/option is arguably dead. The report self-flags this. The composable's ONLY behavioral branch is of uncertain necessity: if provably a no-op, it's overengineering to author; if there's an async-resolution race, it needs a truthful comment (the current comment at `useAnswerKeyPeek.ts:22-31` already hedges). **Must be resolved before authoring, not shipped as a speculative seam.**

**D2 — `solveState: Readonly<Ref<string>>` string-widening vs a shared `SolveState` union. OPEN.**
Both games define an identical union `'idle' | 'solving' | 'solved' | 'failed' | 'error'` (`games/sudoku/types.ts:11`, `games/futoshiki/types.ts:16`). The composable widens to `string` (`useAnswerKeyPeek.ts:15`), discarding type safety for a helper that only tests `=== 'solving'`. The tranche's SOTA/encapsulation mandate makes hoisting a shared union the expected call; left unresolved.

**D3 — `scene.css` home placement. OPEN.**
Sits at games-root (`src/games/scene.css`), imported by both scenes. The recursive-colocation edict wants long dirs broken into encapsulated modules and synthesis §1.5.4 wants a shared home; whether the shared CSS + the shared composable (`src/composables/useAnswerKeyPeek.ts`, currently a different root) co-locate under `src/games/shared/` is exactly the modularization decision this tranche must settle. Unresolved.

**D4 — `.board-cells` magic-string guard + class-name lockstep drift. MINOR-OPEN.**
The K-peek exemption hardcodes `.board-cells` inside the composable (`useAnswerKeyPeek.ts:75`); both boards carry it today (`SudokuBoard.vue:372`, `FutoshikiBoard.vue:421`). Likewise scene.css class names (`.app-layout`/`.board-peek-host`/`.controls-card`/`.mobile-board-width`) must stay in lockstep across both scenes — a rename in one silently no-ops the shared sheet for it. No shared constant/contract. Minor structural debt for a modularization wave.

---

## Convergence

Core extraction is real, all four gates reproduce green, behavior is byte-preserved, and scope-hash isolation is proven in the built artifact — the mechanics are settled. Deductions are for wording overreach and four unresolved shape decisions:

- −3% C2 "byte-mirroring" is imprecise (structural mirror; different board/props/import strategy).
- −1% C7 "33 passed" is actually "32 passed, 1 skipped".
- −8% D1 `awaitTickBeforeActivate` necessity unresolved (likely no-op given `{immediate:true}`) — the sole behavioral branch is speculative.
- −5% D2 string-widening vs shared `SolveState` union (identical unions confirmed) — type-structure decision open.
- −6% D3 shared-CSS / shared-composable home placement open (the exact colocation question this tranche must answer).
- −3% D4 `.board-cells` magic string + class-name lockstep, no shared constant.

**Convergence: 74%.** GO is sound and the diff is safe, but it is NOT author-it-now-verbatim: the CSS/composable home, the `awaitTick` seam, and the shared-union hoist are the modularization decisions the wave exists to make.

## kill_list
- `"byte-mirroring FutoshikiGame.vue"` — structural mirror, not byte-identical (SudokuBoard vs FutoshikiBoard, differing props, static vs async laminate import, `awaitTickBeforeActivate` option). Reword to "structurally mirroring."
- `"33 passed"` — actual is "32 passed, 1 skipped" in a fresh worktree run.
- The implicit claim that `awaitTickBeforeActivate` is a load-bearing behavioral seam — given `AnswerKeyLaminate.vue:86` `{immediate:true}`, it is likely a no-op; must not be authored as a necessary option without resolving D1.
