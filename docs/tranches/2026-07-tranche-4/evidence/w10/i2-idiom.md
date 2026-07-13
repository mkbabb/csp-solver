# T4-W10 · I2 — the script layer (Vue idiom)

Lane I2 of workflow T4-W10. Implements C2's adjudicated work order (`c2-idiom.md`) at merged
HEAD `766aa068`. Ran second in the collision order (I1 landed the `<style>`-layer `--ease-*`
tokens first); every collision file was re-read at edit time. Port 4489, killed on completion;
owner listeners on :3000/:3001 untouched.

The lane is byte-neutral to render: it hoists ref churn, swaps a prop-drill for provide/inject,
collapses manual v-model pairs to defineModel (preserving every write-side transform + the one
same-value re-emit that must NOT be swallowed), and namespaces the theme storage key.

---

## 1. `:ref` discipline — inline closure → stable bound handler (both boards)

**Before** (born-RED, `c2-idiom.md §0`): both boards bound a fresh arrow per render.

- `SudokuBoard.vue:730` · `:ref="(el) => setCellApi(pos - 1, el)"`
- `FutoshikiBoard.vue:647` · `:ref="(el) => setCellApi(pos - 1, el)"`

with `setCellApi(pos, el)` keyed on the closure-captured index (delete-on-null via the captured
`pos`). Every re-render allocated N arrows and forced Vue to unbind(null)→rebind(instance) every
cell ref.

**After**: a single STABLE handler, no inline wrapper. The cell now exposes its own `position`
(the census's index-recovery constraint — cells previously exposed `{ focus }` only), so the map
keys off the instance, not a captured index. Ref identity is stable across renders.

- `SudokuBoard.vue:752` / `FutoshikiBoard.vue:667` · `:ref="setCellApi"`
- `SudokuBoard.vue:338` / `FutoshikiBoard.vue:317` · `function setCellApi(el)` reads
  `el.position` + `el.focus`, sets `cellApi.set(inst.position, inst)`.
- `SudokuCell.vue:268` / `FutoshikiCell.vue:258` · `defineExpose({ focus: focusInput, position: props.position })`
  (position is invariant per instance — `:key === :position`, both `pos - 1`).

**Identical-slot invariant.** Vue calls a stable ref with `null` on unmount, which carries no
index — so a board SHRINK cannot delete the specific slot through the callback. A `watch(() =>
props.totalCells)` prunes keys `≥ N` (never `0..N-1`, which are reused instances with valid
proxies), keeping the map exactly `{0..totalCells-1} → {focus}` — the AE=0 / focus-parity bound.
`focusCell` clamps to `[0, totalCells-1]`, so the consumer path is byte-identical.

**Probe** (post-wave):

```
$ grep -rn ':ref="(el)' src/games/*/*/*.vue ; echo exit=$?
exit=1                              # zero inline closures — was 2 (RED)
$ grep -rn ':ref="setCellApi"' src/games
…SudokuBoard.vue:752:          :ref="setCellApi"
…FutoshikiBoard.vue:667:          :ref="setCellApi"
```

**Focus-parity evidence** (e2e vs dist, :4489): `affordances.spec.ts` composed-keyboard tests —
"K-peek from cell focus + roving tabindex (Ctrl+Home/End) + undo in one session" (sudoku) and its
futoshiki twin — BOTH pass. Roving-tabindex focus (`cellApi.get(clamped)?.focus()`) navigates
identically after the hoist. `size switching: 4×4/5×5/6×6/7×7` (futoshiki) passes — the prune
holds the map clean across shrink/grow.

---

## 2. `flourish` → provide/inject (both games)

**Before** (born-RED): `celebrating` prop-drilled board→cell→glyph. The cell declared a
pass-through prop it only forwarded:

- `SudokuCell.vue:53` / `FutoshikiCell.vue:55` · `flourish?: boolean` (declared only to forward)
- `SudokuCell.vue:452` / `FutoshikiCell.vue:439` · `:flourish="flourish"` (cell→glyph)
- `SudokuBoard.vue:751` / `FutoshikiBoard.vue:668` · `:flourish="celebrating"` (board→cell)
- `HandwrittenGlyph.vue:35` · `flourish?: boolean` → `:231` `if (props.flourish)`

**After**: board-level provide + glyph-level inject; the intermediate cell declares NO
pass-through prop (every OTHER cell prop stays a prop). Scoped to the celebration flag only.

- `SudokuBoard.vue:293` / `FutoshikiBoard.vue:285` · `provide("flourish", celebrating)` (after
  the `celebrating` computed).
- `HandwrittenGlyph.vue:40` · `const flourish = inject("flourish", ref(false))` → `:235`
  `if (flourish.value) scheduleFlourish()`.
- cells: `flourish` prop declaration + `:flourish` forward both DROPPED; board `:flourish`
  binding DROPPED.

**Multi-context inject default is load-bearing** (`c2-idiom.md §3`): the glyph has 6 renderers.
Chrome consumers (logo, dark-toggle) are NOT board descendants → they take the `ref(false)`
default. `FutoshikiCaret`'s glyph IS a board descendant and now DOES receive `celebrating` — but
it binds `:is-solved="false"`, and the flourish is gated behind `if (props.isSolved)`
(`HandwrittenGlyph.vue:234`, UNTOUCHED). The injected `celebrating=true` can never fire
`scheduleFlourish` for a caret. Correctness rides that gate — it was not removed.

**Probe** (post-wave):

```
$ grep -rn "flourish?: boolean" src ; echo exit=$?
exit=1                              # zero flourish props — was 3 (2 cells + glyph, RED)
$ grep -rn ':flourish=' src ; echo exit=$?
exit=1                              # zero forwards — was 3 (RED)
$ grep -rn 'provide("flourish"\|inject("flourish"' src
…SudokuBoard.vue:293:provide("flourish", celebrating);
…FutoshikiBoard.vue:285:provide("flourish", celebrating);
…HandwrittenGlyph.vue:40:const flourish = inject("flourish", ref(false));
```

**Celebration-path evidence** (e2e vs dist): `sudoku-interaction` "valid solution: randomize →
solve → success state" + `futoshiki` "solve: a fresh generated board solves to solve-success"
pass — the solve→`celebrating` composition (CelebrationHeart / CompletionVignette `:active`) is
intact. `visual-regression` dark + light DOM-contract tests pass. The completion-vignette
per-OS golden (both games) is the runner's pixel gate; the change is provide/inject-transparent
(the glyph reads the same boolean, sourced by inject not prop), so it is AE=0 by construction and
neutral under the K38 reduced-motion parity bound (flourish frozen under PRM).

---

## 3. defineModel adoptions — EXACTLY C2's ruling (10 of 13 seams, 4 files)

Adopted `#1,3,4,5,6,8,9,10,11,13`; LEFT `#2,7,12` (the two `errorCheckMode` relays + its
OptionSelector base). Every adopted seam uses `{ required: true }` to preserve the original
non-optional prop contract. Parents bind `:prop + @update:X` (NOT v-model — verified
`SudokuGame.vue:189-246`, `FutoshikiGame.vue:175-230`), and each `:size`/`:board-size`
reads/writes the SAME `pending*` ref, so every adopted model still emits `update:X` identically
and the parent handlers are byte-unchanged.

| # | File · line | Ruling | Adopted shape |
|---|---|---|---|
| 1 | `PencilModeToggle.vue:16` | transform-on-write | `defineModel<PencilMode>('mode')`; cast at assignment `mode.value = v as PencilMode` |
| 3 | `AssistSettings.vue:22` | transform-on-write | `defineModel<boolean>('candidatesPinned')`; keeps `v === 'on'` write + `? 'on':'off'` read |
| 2 | `AssistSettings.vue` errorCheckMode | **LEFT** | manual prop+emit — §1a same-value re-arm |
| 4 | `sudoku ControlPanel.vue:60` | transform-on-write | `defineModel<number>('size')`; `size.value = val as number` + `triggerBoil()` in `onSizeChange` |
| 5 | `sudoku ControlPanel.vue:61` | transform-on-write | `defineModel<Difficulty>('difficulty')`; cast + boil in `onDifficultyChange` |
| 6 | `sudoku ControlPanel.vue:62` | plain relay | `defineModel<PencilMode>('pencilMode')`; child → `v-model:mode` |
| 8 | `sudoku ControlPanel.vue:63` | plain relay | `defineModel<boolean>('candidatesPinned')`; child → `v-model:candidates-pinned` |
| 7 | `sudoku ControlPanel.vue` errorCheckMode | **LEFT** | manual prop+emit — §1a |
| 9 | `futoshiki ControlPanel.vue:66` | transform-on-write | `defineModel<number>('boardSize')`; cast + boil in `onBoardSizeChange` |
| 10 | `futoshiki ControlPanel.vue:67` | transform-on-write | `defineModel<Difficulty>('difficulty')`; cast + boil |
| 11 | `futoshiki ControlPanel.vue:68` | plain relay | `defineModel<PencilMode>('pencilMode')` |
| 13 | `futoshiki ControlPanel.vue:69` | plain relay | `defineModel<boolean>('candidatesPinned')` |
| 12 | `futoshiki ControlPanel.vue` errorCheckMode | **LEFT** | manual prop+emit — §1a |

**The load-bearing caveat, honored (§1a).** `errorCheckMode` stays manual at BOTH hops (the
AssistSettings decl + the two ControlPanel relays). `useAssists.setErrorCheckMode` re-arms
`checkArmed` on a SAME-value re-tap of "Ask"; OptionSelector emits on every click unconditionally,
so today that re-emit flows. `defineModel`'s setter guards emit behind `hasChanged` — adopting it
would swallow the re-tap and silently stop the on-demand re-check. `size`/`difficulty`/`boardSize`
carry no same-value semantics (their `triggerBoil()` lives OUTSIDE the model, so a same-value
re-tap still boils); `pencilMode`/`candidatesPinned` are idempotent standing preferences.

**Probe** (post-wave):

```
$ grep -rl defineModel src        # was empty (RED)
src/games/shared/PencilModeToggle.vue
src/games/shared/AssistSettings.vue
src/games/sudoku/ControlPanel/ControlPanel.vue
src/games/futoshiki/ControlPanel/ControlPanel.vue
# 10 `defineModel<…>(…)` occurrences across the 4 files (grep -rn "defineModel<")
$ grep -rn "emit('update:pencilMode'|emit('update:candidatesPinned'|emit(\"update:size\"|…" <panels> ; echo exit=$?
exit=1                            # zero residual relay emits for the adopted seams
$ grep -rn "emit('update:errorCheckMode'" <both panels>    # 4 sites (2/panel) — PRESERVED
```

**Drive-parity evidence** (e2e vs dist): `futoshiki` "size switching 4×4/5×5/6×6/7×7 each change
the board cell count" + `visual-regression` "size switching 4x4/9x9/16x16 all render grid lines"
(sudoku) pass — the size/boardSize models drive board regen identically. Undo/redo/hint/fill and
mobile play-tools tests pass — the panel's non-model emits (still on `emit`) flow unchanged.
`vue-tsc -b` exit 0 (no double-declared prop/emit; no orphan emit).

---

## 4. Theme-key namespacing

**Before** (born-RED): `useTheme.ts` called `useDark({...})` with NO `storageKey` → vueuse wrote
the default `vueuse-color-scheme`, which any other vueuse app on the origin collides on.

**After**: `useTheme.ts:9` · `storageKey: "sudoku-color-scheme"`.

```
$ grep -n storageKey src/composables/useTheme.ts
9:    storageKey: "sudoku-color-scheme",
```

**The one-time reset (NAMED, per gate 4).** The fresh key has no stored value, so the FIRST load
after the rename defaults to system — which IS the default. This is correct behavior, not a
regression; it is a single, silent reset that never recurs. Any user who had explicitly chosen a
theme under the old key sees it revert to system exactly once on the first post-rename load, then
persists their next choice under the namespaced key normally.

**Persistence evidence** (transient e2e probe vs dist, run + deleted): toggling the theme writes
the choice under `sudoku-color-scheme`, leaves `vueuse-color-scheme` `null`, and a reload
reproduces the choice — 1 passed.

### 4a. Cross-lane consequence — visual-golden dark-boot harness (a FINDING, fixed)

`e2e/visual-golden.spec.ts:83` boots dark mode via `localStorage.setItem('vueuse-color-scheme',
'dark')` — the OLD default key — and then asserts `html.dark` at `:97`. The theme-key rename
makes that init script inert (the app reads the namespaced key now), so the dark golden would
boot LIGHT and fail the `toHaveClass(/dark/)` assertion BEFORE any capture. This is the sole
external coupling on the old key name (`grep -rn "vueuse-color-scheme" src e2e` → only the boot
script + my own explanatory comment in `useTheme.ts`).

Fixed in-place, hand-matched to the file's single-quote style: `:83` now sets
`'sudoku-color-scheme'`, and the `:78` comment updated ("namespaced storage key, T4-W10"). This
is a harness key-string update, NOT a golden re-baseline — the dark PNG pixels are unchanged once
dark boots correctly. `visual-golden` runs under `playwright-golden.config.ts` (per-OS, on the
linux runner); it is `testIgnore`'d by the default darwin suite, so it was not run here — the fix
is verified by `eslint .` (exit 0, covers e2e) and by the reasoning above. **Flagged so the
golden lane / runner seal knows the dark-boot key moved with the app.** `visual-regression`'s
`setDarkMode` clicks the toggle (key-independent) — unaffected.

---

## 5. Battery (full, vs dist on :4489; owner :3000/:3001 untouched, port killed)

| Gate | Result |
|---|---|
| `vue-tsc -b --force` | **exit 0** |
| `npm run test:unit` | **271 passed / 21 files** |
| `npm run lint:eslint` (covers e2e) | **exit 0** |
| `npm run lint:knip` | **exit 0** |
| `npx prettier --check src/` | **exit 0** (2 boards `--write`'d for the one-line vue import reflow, src-only) |
| `npm run build` | **exit 0** (index 193.87 kB / gzip 69.82 kB) |
| e2e `affordances` + `mobile-affordances` + `sudoku-interaction` + `futoshiki` | **31 passed** (roving-tabindex focus both games; futoshiki size-switch drive) |
| e2e `visual-regression` | **7 passed** (dark+light DOM contract; sudoku size-switch drive) |
| e2e theme-key probe (transient) | **1 passed** (namespaced key persist; legacy key null; reload persists) |

**Not run here (per-OS goldens, runner's domain):** `visual-golden` (theme-boot key fixed, §4a)
and the K38 reduced-motion AE=0 parity capture — both run under their own configs on the linux
runner. The idiom sweep is render-neutral, so AE=0 holds by construction.

## Files touched (all under `web/frontend/`)

- `src/composables/useTheme.ts` — storageKey
- `src/pencil/glyph/HandwrittenGlyph.vue` — inject flourish, drop prop
- `src/games/sudoku/SudokuBoard/SudokuBoard.vue` — :ref hoist + prune, provide, drop `:flourish`
- `src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` — same
- `src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue` — drop flourish prop+forward, expose position
- `src/games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue` — same
- `src/games/shared/PencilModeToggle.vue` — defineModel #1
- `src/games/shared/AssistSettings.vue` — defineModel #3 (errorCheckMode LEFT)
- `src/games/sudoku/ControlPanel/ControlPanel.vue` — defineModel #4,5,6,8 (errorCheckMode LEFT)
- `src/games/futoshiki/ControlPanel/ControlPanel.vue` — defineModel #9,10,11,13 (errorCheckMode LEFT)
- `e2e/visual-golden.spec.ts` — dark-boot key follows the rename (§4a finding, hand-matched)
