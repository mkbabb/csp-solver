# Prototype P4 — Sudoku scene extraction + peek de-twin

**Lane key:** `proto-P4-fe-sudoku-game-extraction`
**Worktree:** `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8f3bd831-d64-13`
**Verdict: GO (shape-refined).** Every gate item passed. One deliberate non-mirror (import strategy) and one latent simplification (the `nextTick` option) are flagged for the critique pass.

---

## The one question

Can the Sudoku scene be extracted from `App.vue` into `games/sudoku/SudokuGame.vue` (mirroring
`FutoshikiGame.vue`), with a shared `useAnswerKeyPeek` composable absorbing the twin
peek/keyboard/watch wiring (`App.vue:81-132` ≡ `FutoshikiGame.vue:27-83`), and the duplicated
scene CSS shared — at **zero behavior change**? App.vue must reduce to a pure shell.

## What I built

Four edits + three new files (all in the isolated worktree; nothing ships):

| File | Before | After | Δ |
|---|---|---|---|
| `src/App.vue` | 371 LOC | 177 LOC | **−194 (−52%)** |
| `src/games/futoshiki/FutoshikiGame.vue` | 197 LOC | 124 LOC | −73 |
| `src/games/sudoku/SudokuGame.vue` | — | 124 LOC | new (byte-mirrors FutoshikiGame) |
| `src/composables/useAnswerKeyPeek.ts` | — | 86 LOC | new (shared) |
| `src/games/scene.css` | — | 39 LOC | new (shared) |

Two-file diffstat: **26 insertions, 293 deletions**.

- **`useAnswerKeyPeek(target, options?)`** — owns `peekActive`/`peekTouched`/`peekSolutionValues`,
  `startPeek`/`endPeek`, the `watch(peekActive → setMarksActive)` marks mirror, and the K/Esc
  `onKeydown` + mount/unmount listener. `target` is a structural `{ solveState, peekSolution,
  setMarksActive }`; both `useSudoku`/`useFutoshiki` returns satisfy it unchanged.
- **`SudokuGame.vue`** — the Sudoku scene lifted verbatim from `App.vue:170-251` (template) +
  the peek/share wiring, consuming the composable and the shared CSS via
  `<style scoped src="@/games/scene.css">`.
- **`FutoshikiGame.vue`** — now consumes the same composable + same shared CSS; its bespoke
  peek block and its duplicate scoped `.app-layout`/`.board-peek-host`/`.controls-card`/
  `.mobile-board-width` rules are gone.
- **`App.vue`** — pure shell: `SvgFilters`, dev `FilterTuner`, desktop/mobile `AttributionCard`,
  `DarkModeToggle`, masthead `HandwrittenLogo` selector, and two `v-if` game mounts. No
  `useSudoku`, no board/controls/laminate imports, no peek state.

**CSS sharing mechanism.** `<style scoped src="@/games/scene.css">` — Vue applies the SFC's own
scope hash to the imported file, so this is **source de-duplication with scoped isolation
intact**, not a global sheet. This sidesteps the live C1/C2 global-`@layer` hold entirely (no rule
enters the global cascade). Verified by an existing e2e computed-style assertion (below).

## Gate result (quoted)

```
$ npx vue-tsc -b --force
VUE_TSC_EXIT=0

$ npx eslint .            # boundary rules: pencil↛games, sudoku↮futoshiki
ESLINT_EXIT=0

$ npm run build          # vue-tsc -b && vite build
✓ 1894 modules transformed.  ✓ built in 917ms   BUILD_EXIT=0
  dist/assets/index-*.js            108.39 kB   ← SudokuGame folds in (eager, default game)
  dist/assets/FutoshikiGame-*.js     31.94 kB   ← still a lazy chunk
  dist/assets/AnswerKeyLaminate-*.js  2.21 kB   ← still a shared lazy chunk
```

Bundle shape is **byte-preserved**: Sudoku scene stays in the main `index` chunk (it lived in
App.vue before), Futoshiki stays lazy, the laminate stays a separate on-first-peek chunk.

```
$ npx playwright test
  33 passed (15.8s)   E2E_EXIT=0
```
Includes the charter-named specs: `affordances.spec.ts` (K-peek exemption, marks-gesture
show/clear, permalink share+reload, the **futoshiki-twin** composed-keyboard test at :345),
all of `permalink.spec.ts` (board-only URL, mismatch fall-closed, **game-switch leaves no foreign
params**, randomize drops `?board=`), and `round9.spec.ts` light/dark which asserts
`getComputedStyle('.app-layout').alignItems === 'center'` — a direct proof the shared
`<style scoped src>` resolves through the scope hash.

**Pixel parity (before/after, both games, both themes, 1280×800).** Boil animation randomizes
stroke jitter per load, so no two renders are byte-identical; I bounded it with a same-code
control:

```
                        before-vs-after     after-vs-after2 (control, same code)
sudoku-light     AE =   26123 (2.55%)       33909 (3.31%)
sudoku-dark      AE =   24369 (2.38%)       37753 (3.69%)
futoshiki-light  AE =   18945 (1.85%)       32109 (3.14%)
futoshiki-dark   AE =   17594 (1.72%)       30077 (2.94%)
```
The before/after delta is **smaller** than the same-code two-load control on every cell — the
entire pixel difference is boil jitter that varies between any two loads regardless of code.
**Pixel-comparable: yes.** Screenshots in
`scratchpad/tranche3/p4shots/{before,after,after2}-{sudoku,futoshiki}-{light,dark}.png`.

## Wiring that resisted symmetric extraction

1. **Async-vs-static laminate timing → absorbed as one option.** Sudoku lazy-loads
   `AnswerKeyLaminate` (`defineAsyncComponent`; the chunk-load latency supplies the
   mount-before-activate delay). Futoshiki imports it statically and did `await nextTick()`
   between mounting (`peekTouched=true`) and activating (`peekActive=true`)
   (old `FutoshikiGame.vue:35`). Captured as `useAnswerKeyPeek(..., { awaitTickBeforeActivate })`
   — `false` for Sudoku (default), `true` for Futoshiki. This byte-preserves each game's existing
   ordering. **BUT** `AnswerKeyLaminate`'s activation watch is `{ immediate: true }`
   (`AnswerKeyLaminate.vue:86`), which makes Futoshiki's `nextTick` arguably a no-op today — the
   old `FutoshikiGame.vue:20-21` comment that justified it ("watch isn't immediate") is stale.
   The option preserves behavior conservatively; collapsing it is a live simplification (see below).

2. **The `game.value !== 'sudoku'` guards DISSOLVE (asymmetry removed, not relocated).** App.vue's
   `startPeek` (old `:86`) and `onKeydown` (old `:114`) guarded on the active game because Sudoku
   lived in the always-mounted App shell. A `v-if`-mounted `SudokuGame` only exists — and only has
   its keydown listener — while Sudoku is selected, exactly Futoshiki's situation. Both guards are
   gone; neither game's composable carries a game-id check.

3. **`setGame`'s manual `endPeek()` (old `App.vue:46`) is gone.** Unmount teardown
   (`onUnmounted` removing the listener, the peek dying with `peekActive`) replaces the explicit
   cross-game cleanup.

4. **The import-strategy asymmetry that STAYS — and is correct.** App.vue imports `SudokuGame`
   **statically** but `FutoshikiGame` **async**. This is the one thing that does not byte-mirror
   FutoshikiGame's own lazy self-load, and it is deliberate: Sudoku is the default game (must ride
   the main chunk / eager first paint), Futoshiki is opt-in (lazy). The build output confirms the
   pre-extraction bundle shape is preserved exactly. Making SudokuGame lazy too would add a
   first-paint async hop to the default game — a real regression against "zero behavior change".

## What the critique pass should attack

- **Collapse `awaitTickBeforeActivate`.** Given `AnswerKeyLaminate`'s `{ immediate: true }` watch
  (`:86`), does the `nextTick` ever matter? If provably not, drop the option and fully unify the
  two paths; if there's a race (the async component resolving mid-gesture), document it and keep
  the option with a truthful comment. This is the only behavioral seam left in the composable.
- **`solveState: Readonly<Ref<string>>` widening.** The composable accepts any string ref. Both
  games define an *identical* `SolveState` union (`games/sudoku/types.ts:11`,
  `games/futoshiki/types.ts:16`) — hoist it to a shared type and type the composable against it
  (via a generic `<S extends string>` or the shared union), or is string-widening acceptable for a
  helper that only reads `=== 'solving'`?
- **`src/games/scene.css` home.** It sits at the games root, imported by both scenes. Synthesis
  §1.5.4 wants one shared-*composables* home; does a shared-*CSS* asset belong beside it, under
  `src/games/shared/`, or is the games-root fine? Confirm the eslint boundary rules are content
  with a neutral cross-game CSS asset (they passed — `<style src>` isn't a JS import — but ratify
  the intent).
- **Ratify the eager-SudokuGame call** over a literal full mirror (§ resisted-wiring #4). The
  charter says "byte-mirroring FutoshikiGame"; I let the default-game first-paint constraint win.
- **The `.board-cells` guard string** is now hardcoded inside the composable
  (`useAnswerKeyPeek.ts` keydown). Both boards must keep that class or K-peek exemption silently
  breaks — worth a shared constant / documented contract?
- **Scene CSS drift risk.** `scene.css` and each game's board markup must keep the class names
  (`.app-layout`/`.board-peek-host`/`.controls-card`/`.mobile-board-width`) in lockstep; a rename
  in one game now silently no-ops the shared sheet for it. Acceptable given both scenes are
  byte-mirrors, but note it.
```
