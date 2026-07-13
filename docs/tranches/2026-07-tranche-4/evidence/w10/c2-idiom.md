# T4-W10 · C2 — the idiom census (read-only, merged-HEAD truth)

Measured at **HEAD 766aa068** (`T4-WU` sealed). The spec's anchors were frozen at `65425697`; every one below is **re-located** here. This lane edits nothing under `src/` — it is the born-RED ledger the I-lanes cite. All greps run from `web/frontend/`.

---

## 0. Born-RED proof block (verbatim)

```
$ grep -rl defineModel src ; echo exit=$?
exit=1                              # (1 = no match) defineModel absent — RED

$ grep -rn ':ref="(el)' src/games/sudoku/SudokuBoard/SudokuBoard.vue \
                        src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue
src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue:647:          :ref="(el) => setCellApi(pos - 1, el)"
src/games/sudoku/SudokuBoard/SudokuBoard.vue:730:          :ref="(el) => setCellApi(pos - 1, el)"

$ grep -rn "flourish?: boolean" src
src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue:53:  flourish?: boolean;
src/games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue:55:  flourish?: boolean;
src/pencil/glyph/HandwrittenGlyph.vue:35:  flourish?: boolean;

$ grep -rn "provide(\|inject(" src ; echo exit=$?
exit=1                              # (1 = no match) provide/inject unused anywhere — RED

$ grep -n storageKey src/composables/useTheme.ts ; echo exit=$?
exit=1                              # (1 = no match) no storageKey → default vueuse-color-scheme — RED
```

Anchor drift, spec → merged HEAD: `useTheme.ts:4-10`→`3-14`; `AnswerKeyLaminate.vue:231-232`→(unmoved, see §5); `SudokuBoard.vue:583`→`730`; `FutoshikiBoard.vue:520`→`647`; `SudokuCell.vue:35`→`53`; `FutoshikiCell.vue:39`→`55`; `ControlPanel.vue:50/68/179`→ sudoku `54-77 / 89-117 / 296-304`.

---

## 1. defineModel adjudication — the candidate set is CLOSED

`grep -rln 'e: "update:' src` returns **exactly four** components. There are no other `update:*` pairs (every other `defineEmits` fires domain verbs — `change`, `toggle`, `erased`, `update`, `mark`, `cellFocus`, `deal`, `solve`, … — none is a `v-model` seam).

| # | File | prop (decl) | emit (decl) | write site | Ruling |
|---|------|-------------|-------------|------------|--------|
| 1 | `games/shared/PencilModeToggle.vue` | `mode: PencilMode` (:13) | `update:mode` (:14) | :23 `emit("update:mode", v as PencilMode)` | **TRANSFORM-ON-WRITE** — `as PencilMode` cast; driven by OptionSelector `@change`, not a native input. Adopt `defineModel<PencilMode>('mode')`, keep the cast at the assignment (`model.value = v as PencilMode`). SAFE (no same-value dependence). |
| 2 | `games/shared/AssistSettings.vue` | `errorCheckMode: ErrorCheckMode` (:18) | `update:errorCheckMode` (:23) | :38 `emit(…, v as ErrorCheckMode)` | **LEAVE — DO NOT ADOPT.** Same-value re-emit is load-bearing (see §1a). `defineModel`'s set dedupes `hasChanged`, suppressing the re-tap that re-arms the on-demand snapshot. The `as ErrorCheckMode` cast is incidental; the emit-on-every-click is the contract. |
| 3 | `games/shared/AssistSettings.vue` | `candidatesPinned: boolean` (:19) | `update:candidatesPinned` (:24) | :41 `emit(…, v === "on")`; read-side `:selected="candidatesPinned ? 'on' : 'off'"` (:78) | **TRANSFORM-ON-WRITE** — REAL runtime boolean↔string map, not a cast. Adopt `defineModel<boolean>('candidatesPinned')`, keep `v === "on"` at the write and the `? 'on' : 'off'` at the template read. SAFE (a standing preference, no re-arm on same value — `useAssists.test.ts` "survives a board edit"). |
| 4 | `games/sudoku/ControlPanel/ControlPanel.vue` | `size: number` (:55) | `update:size` (:90) | :296-299 `emit("update:size", val as number)` **+ `triggerBoil()`** | **TRANSFORM-ON-WRITE** — `as number` cast **plus a `triggerBoil()` side effect**. Adopt `defineModel<number>('size')` only if the side effect stays in `onSizeChange` (`size.value = val as number; triggerBoil()`). `triggerBoil` lives OUTSIDE the model set, so same-value re-taps still boil. SAFE. |
| 5 | `games/sudoku/ControlPanel/ControlPanel.vue` | `difficulty: Difficulty` (:56) | `update:difficulty` (:91) | :301-304 `emit("update:difficulty", val as Difficulty)` **+ `triggerBoil()`** | **TRANSFORM-ON-WRITE** — the spec's named `as Difficulty` case, **plus `triggerBoil()`**. Same shape as #4. Adopt with the cast + boil preserved in `onDifficultyChange`. SAFE. |
| 6 | `games/sudoku/ControlPanel/ControlPanel.vue` | `pencilMode: PencilMode` (:67) | `update:pencilMode` (:113) | template relay :421/:615 `@update:mode="emit('update:pencilMode', $event)"` | **PLAIN two-way** — pure pass-through (no transform at the panel level). Adopt `defineModel<PencilMode>('pencilMode')`; both relay sites collapse to `v-model:mode="pencilMode"`. SAFE. |
| 7 | `games/sudoku/ControlPanel/ControlPanel.vue` | `errorCheckMode: ErrorCheckMode` (:71) | `update:errorCheckMode` (:115) | template relay :430/:622 | **LEAVE — DO NOT ADOPT.** Same-value dependence propagates through this relay (§1a); collapsing it to a model assignment dedupes the re-tap. Keep the manual relay. |
| 8 | `games/sudoku/ControlPanel/ControlPanel.vue` | `candidatesPinned: boolean` (:72) | `update:candidatesPinned` (:116) | template relay :431/:623 | **PLAIN two-way relay** — adopt `defineModel<boolean>('candidatesPinned')`; both sites → `v-model:candidates-pinned`. SAFE. |
| 9 | `games/futoshiki/ControlPanel/ControlPanel.vue` | `boardSize: number` (:61) | `update:boardSize` (:84) | :286-289 `emit("update:boardSize", val as number)` **+ `triggerBoil()`** | **TRANSFORM-ON-WRITE** — twin of #4. Adopt with cast + boil in `onBoardSizeChange`. SAFE. |
| 10 | `games/futoshiki/ControlPanel/ControlPanel.vue` | `difficulty: Difficulty` (:62) | `update:difficulty` (:85) | :291-294 `emit(…, val as Difficulty)` **+ `triggerBoil()`** | **TRANSFORM-ON-WRITE** — twin of #5. Adopt with cast + boil. SAFE. |
| 11 | `games/futoshiki/ControlPanel/ControlPanel.vue` | `pencilMode` (:73) | `update:pencilMode` (:105) | relay :409/:599 | **PLAIN two-way relay** — twin of #6. Adopt. SAFE. |
| 12 | `games/futoshiki/ControlPanel/ControlPanel.vue` | `errorCheckMode` (:76) | `update:errorCheckMode` (:107) | relay :418/:606 | **LEAVE** — twin of #7 (§1a). |
| 13 | `games/futoshiki/ControlPanel/ControlPanel.vue` | `candidatesPinned` (:77) | `update:candidatesPinned` (:108) | relay :419/:607 | **PLAIN two-way relay** — twin of #8. Adopt. SAFE. |
| — | `pencil/chrome/OptionSelector/OptionSelector.vue` | `selected` (:9) | `change` (:15) — **not** `update:*` | template :32 `@click="emit('change', opt.value)"` | **NOT-V-MODEL** — one-way `@change`, spec-confirmed. LEAVE. It is the primitive every row above wraps; it emits on **every** click unconditionally (the same-value source in §1a). |

**Adopt: 10 of 13** — #1,3,4,5,6,8,9,10,11,13. **Leave: 3** — #2,7,12 (the two `errorCheckMode` seams + its OptionSelector base). The parent side (`SudokuGame.vue:195-203`, `FutoshikiGame.vue`) binds explicit `:prop` + `@update:X` handlers, **not** `v-model` — so every adopted model still emits `update:X` identically and the parent handlers are byte-unchanged. The staged-zone asymmetry (`@update:size="pendingSize = $event"` writes a DIFFERENT ref than `:size` reads) is a parent concern and does not alter any child ruling.

### 1a. Why errorCheckMode must NOT become a defineModel (the load-bearing caveat)

`useAssists.ts:42-45`:

```ts
function setErrorCheckMode(mode: ErrorCheckMode) {
  errorCheckMode.value = mode;
  // Entering (or re-tapping) on-demand IS the check act; off/live carry no snapshot.
  checkArmed.value = mode === "on-demand";
}
```

The on-demand check re-arms on a **same-value** re-tap: after a board edit clears `checkArmed` (`:60-61`, "a board mutation invalidates the on-demand snapshot"), the user taps **Ask** again — mode is *already* `"on-demand"`, so the tap emits `update:errorCheckMode("on-demand")` (same value) and `setErrorCheckMode` re-sets `checkArmed = true`. `OptionSelector` emits on every click unconditionally (`:32`, no changed-guard), so today that re-emit flows. Vue's `defineModel`/`useModel` setter guards the emit behind `hasChanged` — a set to the current value **returns without emitting**. Adopting a model at either the AssistSettings hop (#2) or the ControlPanel relay (#7/#12) would swallow the re-tap → **the on-demand re-check silently stops re-arming.** This is precisely the spec's "over-adopting a pair with write-side logic silently drops the transform" — here the dropped behavior is the same-value re-emit. `candidatesPinned`, `pencilMode`, `size`, `difficulty` carry **no** same-value semantics (boil fires outside the model set; the rest are idempotent), so they adopt cleanly.

---

## 2. `:ref` census + registry shape (the hoist must fill identical slots)

Two inline closures, both cell-loops (born-RED §0). Loose-variant grep surfaces two non-targets: `HandwrittenLogo.vue:260 :ref="setTextRef"` (**already** a stable bound handler) and a comment mention in `HandwrittenGlyph.vue:38` — neither is a closure. Targets are exactly:

- `SudokuBoard.vue:730` — `:ref="(el) => setCellApi(pos - 1, el)"`
- `FutoshikiBoard.vue:647` — `:ref="(el) => setCellApi(pos - 1, el)"`

Registry — **byte-identical** in both boards (`SudokuBoard.vue:326-333`, `FutoshikiBoard.vue:307-314`):

```ts
const cellApi = new Map<number, { focus: () => void }>();
function setCellApi(pos: number, el: unknown) {
  if (el && typeof (el as { focus?: unknown }).focus === "function") {
    cellApi.set(pos, el as { focus: () => void });
  } else {
    cellApi.delete(pos);
  }
}
```

- **Slots**: keys `0 … totalCells-1` (the `pos - 1` 0-index), values = the cell instance's exposed `{ focus }`. Sole consumer: `focusCell` → `cellApi.get(clamped)?.focus()` (`:337` / `:318`).
- **Identical-fill invariant**: the hoisted stable handler must key by the same 0-index. The v-for already passes `:key="pos - 1"` and `:position="pos - 1"` (`SudokuBoard.vue:729/731`, `FutoshikiBoard.vue:646/648`).
- **Index-recovery constraint (I2 must handle)**: both cells `defineExpose({ focus: focusInput })` **only** (`SudokuCell.vue:267`, `FutoshikiCell.vue:258`) — the instance does **not** expose `position`. A bare `:ref="setCellApi"` receives only `el`, so the handler cannot read the index off the exposed proxy as-is. I2 must recover the 0-index by one of: also `defineExpose({ position })` and key on `el.position`; read `el.$el.dataset`; or a keyed template-ref collection. The `HandwrittenLogo.setTextRef` precedent (`:120-121`) is the single-ref shape, not the indexed-map shape — it is a pattern reference, not a drop-in. Whatever the mechanism, the map must end with the same `{0..N-1} → {focus}` slots; that is the AE=0 / focus-parity bound.

---

## 3. Flourish prop-drill trace (board → cell → glyph, both games)

The glyph that must **inject** is the shared `pencil/glyph/HandwrittenGlyph.vue`.

**Sudoku:** `SudokuBoard.vue:286` `const celebrating = computed(…)` → `:751` `:flourish="celebrating"` (board→cell, inside the v-for) → `SudokuCell.vue:53` `flourish?: boolean` prop (declared **only to forward**, comment :51) → `:452` `:flourish="flourish"` (cell→glyph) → `HandwrittenGlyph.vue:35` `flourish?: boolean` → **use at `:231` `if (props.flourish) scheduleFlourish();`** (the sole consumer, gated by `if (props.isSolved)` at :230).

**Futoshiki (twin):** `FutoshikiBoard.vue:278` `celebrating` → `:668` `:flourish="celebrating"` → `FutoshikiCell.vue:55` prop (comment :53) → `:439` `:flourish="flourish"` → same glyph `:35`/`:231`.

Shape: `provide('flourish', celebrating)` at each board; the two cells **drop** the `flourish` prop declaration **and** the `:flourish="flourish"` forward; the glyph replaces `props.flourish` with `inject('flourish', …)`. Scoped to the celebration flag only — the cells keep their own props.

**Inject default is mandatory (glyph is multi-context).** `HandwrittenGlyph` has 6 renderers: the two cells (board descendants — get the provide), plus `FutoshikiCaret.vue:45`, `HandwrittenLogo.vue`, `DarkModeToggle.vue`, and the non-Vue anim modules. Of these, **`FutoshikiCaret` is itself a descendant of `FutoshikiBoard`** (`FutoshikiBoard.vue:680`), so a board-level `provide` **will reach the caret's glyph** — a behavior surface the prop drill never touched. It is safe **only** because the caret binds `:is-solved="false"` (`FutoshikiCaret.vue:49`) and the flourish is gated behind `if (props.isSolved)` (:230): the injected `celebrating=true` can never fire `scheduleFlourish` for a caret. The correctness rides on the `isSolved` gate, not on flourish being absent — I2 must not remove that gate. The chrome consumers (logo, dark-toggle) are **not** board descendants → they take the `inject('flourish', ref(false))` default. `provide/inject` is unused everywhere today (§0), so this is a clean first use.

---

## 4. Theme key

`composables/useTheme.ts:3-14` — `createGlobalState(() => useDark({ selector:'html', attribute:'class', valueDark:'dark', valueLight:'', disableTransition:false }))` with **no `storageKey`** (born-RED §0). vueuse therefore writes the default key `vueuse-color-scheme` to `localStorage`. Fix is single-line: add `storageKey: 'sudoku-color-scheme'`. One-time reset on first load after the rename (fresh key defaults to system — which IS the default), behavior-preserving thereafter. Anchor: **`src/composables/useTheme.ts:4`** (the `useDark({` options object).

---

## 5. Collision map — I1 (style-layer) ∩ I2 (script/template)

**I1 turf** = the 21 files carrying inline `cubic-bezier` (`grep -rl cubic-bezier src`) → `--ease-*` var conversion, plus `assets/index.css` (mint the vars, RED-empty today), `AnswerKeyLaminate.vue` (re-point the overshoot), `pencilConfig.ts` (two-layer rule / `drawerGlide` stays TS).

**I2 turf** = §1 defineModel files + §2 boards + §3 flourish files + §4 `useTheme.ts`.

**Both lanes edit the same FILE (different blocks — I1 `<style scoped>`, I2 `<script setup>`+`<template>`):**

| File | I1 (style) | I2 (script / template) |
|------|-----------|------------------------|
| `games/sudoku/SudokuBoard/SudokuBoard.vue` | cubic-bezier → `--ease-*` in `<style>` | `:ref` hoist (:730 + :326-333); flourish `provide` + drop `:flourish="celebrating"` (:751) |
| `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` | cubic-bezier → `--ease-*` | `:ref` hoist (:647 + :307-314); flourish `provide` + drop `:flourish` (:668) |
| `games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue` | cubic-bezier → `--ease-*` | drop `flourish` prop (:53) + drop forward (:452) |
| `games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue` | cubic-bezier → `--ease-*` | drop `flourish` prop (:55) + drop forward (:439) |

**No collision (single-lane files):** I2-only — `PencilModeToggle.vue`, `AssistSettings.vue`, both `ControlPanel.vue` (neither carries `cubic-bezier`), `HandwrittenGlyph.vue` (no `cubic-bezier`; I2 adds the inject), `useTheme.ts`. I1-only — `AnswerKeyLaminate.vue`, `pencilConfig.ts`, `assets/index.css`, and the remaining 12 chrome/`.css` files (`DifficultyTally.vue`, `scene.css`, both `SolverErrorNote.vue`, `DarkModeToggle.vue`, `AttributionCard.vue`, `CompletionVignette.vue`, `HandwrittenLogo.vue`, `MarginNote.vue`, `ScribbleLoader.vue`, the three icon files, `FilterTuner.vue`).

**Sequencing note for the orchestrator:** the four collision files are edited in disjoint SFC blocks, so line anchors do not overlap — but whichever of I1/I2 runs second **must re-read the file** before editing (the first lane shifts line numbers within the shared file). If I2 runs first, its `<script>`/`<template>` edits push I1's `<style>` `cubic-bezier` lines down; if I1 runs first, its `<style>` edits leave I2's script/template anchors stable (style block is last), so **I1→I2 is the lower-churn order** for these four.

---

## 6. Cross-lane note (drift the frozen spec undercounts)

The spec's easing count (C1's lane, not mine) reads "9 curves / 40 occurrences" from `65425697`. At merged HEAD `grep -rho 'cubic-bezier([^)]*)' src | sort | uniq -c` returns **10 distinct curves / 42 occurrences** (the overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)` now appears **8×**, not solely at the laminate). Flagged for `c1-easing.md`; recorded here so the idiom lane's own numbers trace to this HEAD.
