# impl-A — the pad abrogation + native bounded entry (T4-WM §1)

**Lane A of T4-WM.** Charge (spec §1): excise the custom keypad whole (dead code, not
`display:none`; knip clean after), true the per-cell native `<input>` to iOS-congruent bounded
numeric entry on both games, keep desktop physical-keyboard entry byte-identical, re-home the pad
spec's coarse-affordance asserts. Text-first; every command + output banked. Working tree carries
concurrent lanes (W6 generation-truth on the wasm/worker; the §4 perf lane on `rasterPose.ts` /
`HandDrawnGrid.vue`; a chrome lane on `DarkModeToggle.vue` / `HandwrittenLogo.vue`) — their reds are
demarcated below and are NOT this lane's.

## What changed

- **Excised whole**: `src/games/shared/DigitPad.vue` (248 L) + `e2e/digit-pad.spec.ts` (deleted).
  The twin wiring came out of both games (`DigitPad` import, `useCoarsePointer`/`useStackedLayout`
  imports, `isCoarse`/`isStacked`/`padActive`/`boardRef`/`cellFocused`, the `:pad-active` +
  `@cell-focus-change` props, the `<DigitPad>` template block), both boards (`padActive` prop,
  `cellFocusChange` emit, `cellsEl` ref + `@focusin`/`@focusout` reporters, `enterValue` +
  `defineExpose`), and both cells (`suppressVirtualKeyboard` prop, the `:inputmode` conditional).
- **The native input, trued** (both cells, D16 twins): `type="text" inputmode="numeric"
  pattern="[0-9]*" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done"`,
  a `.cell-native-input { font-size: 16px }` zoom floor (the input is opacity-0 — the floor is
  structural, never `maximum-scale`). `inputmode` is now a static `numeric` (was
  `suppressVirtualKeyboard ? 'none' : 'numeric'` → `'none'` on coarse).
- **`useStackedLayout.ts` DELETED** — see the census-correction note below.
- **Re-home**: `e2e/mobile-affordances.spec.ts` (new) carries the retired digit-pad.spec test 3's
  coarse-affordance asserts (peek washi ≥44px, icon sublabels, Clear confirm) — never pad-specific —
  plus the new native-entry e2e (iPhone-13 coarse, both games + 16×16 two-digit + 16px floor).
- **Born-RED unit contracts** (new, colocated): `SudokuCell.test.ts`, `FutoshikiCell.test.ts`.

## The maxlength decision (the load-bearing call)

Spec §1 reads `maxlength` "sized (1; 2 for N=16 — the existing handleInput clamp already owns
semantics)." Taken as a literal attribute value, `maxlength=1` is **incompatible with in-place
override** and with the spec's own iOS discipline. Proof:

- With `maxlength=1` and a filled cell, a keystroke on the full field is UA-blocked — override dies.
- The two rescue idioms both fail here: **select-on-focus** is defeated by the pointer mouseup
  (deselects) and, decisively, by the spec's own coming `user-select:none` cell discipline (you
  cannot select unselectable text); **clear-on-focus** is undone by Vue's reactive `:value` patch,
  which re-fills the input on the `isFocused` re-render (`patchDOMProp` compares DOM value vs
  `displayValue` and rewrites).
- A keydown-clear touches the key handlers — forbidden ("desktop keyboard byte-identical").

The only override mechanism that is user-select-none-compatible, re-render-safe, and handler-free is
the **existing append-then-slice**: the input admits digit-width **+ 1** char, `handleInput` slices
to the digit width. So `maxlength` stays board-sized to width+1 (`boardSize>=10?3:2` sudoku; `2`
futoshiki), and **`handleInput`'s clamp is the effective bound** — exactly what "the existing
handleInput clamp already owns semantics" defers to. The "(1; 2 for N=16)" is the effective digit
width the clamp enforces, not the raw attribute. Desktop override is therefore **byte-identical**
(the mechanism is untouched). Confirmed no e2e keyboard test type-overrides a filled cell (all
`keyboard.type` sites target blank cells; programmatic overrides use the native setter, which
bypasses maxlength) — so nothing regressed.

## Gate rows: born-RED → close

| gate | born-RED (at HEAD) | close |
|---|---|---|
| **pad-gone** | `grep -rE 'DigitPad\|padActive\|suppressVirtualKeyboard\|inputmode="none"' src e2e` → **37 matches** | → **0 matches** (grep exit 1); residual wiring symbols (`enterValue`/`cellFocusChange`/`cellsEl`/`boardRef`/`isCoarse`/`isStacked`) → none; knip clean |
| **native-entry** (unit) | `SudokuCell.test.ts`/`FutoshikiCell.test.ts` → **5 failed / 6 passed** then **2 failed / 12 passed** (the attribute set — `pattern`/`autocorrect`/`autocapitalize`/`spellcheck`/`enterkeyhint` — absent → `undefined`) | → **14 passed (2 files)**: attr set present, `inputmode` static numeric, maxlength board-sized (2/3), handleInput clamp overrides in place, two-digit at 16×16, Backspace erase, write-path preserved |
| **native-entry** (e2e) | retired `digit-pad.spec.ts:77` asserted `inputmode="none"` on coarse — the red codification of the old pad regime | `e2e/mobile-affordances.spec.ts` (chromium, iPhone-13 coarse descriptor) — **smoke-run against a vite-preview build on `127.0.0.1:5273`: 3 passed, 1 blocked (17.3s)**. PASS: sudoku 9×9 (coarse `inputmode="numeric"` + full attr set + font ≥16px + write path verified end-to-end), sudoku 16×16 (two-digit 10–16 enter whole), re-homed coarse affordances. BLOCKED: futoshiki twin — the futoshiki lazy-scene bake throws `InvalidStateError: drawImage … image source is detached` (the §4 perf lane's in-flight `rasterPose.ts` OffscreenCanvas rework closing an ImageBitmap before `drawImage`), so no board generates and the load-gate never resolves. NOT this lane; the futoshiki cell's identical native-entry contract is proven at the unit layer (`FutoshikiCell.test.ts` green) and its sudoku D16 twin passes e2e |
| **re-home** | test 3 lived in the deleted pad spec | moved verbatim (peek washi ≥44px / icon sublabels / Clear confirm) into `mobile-affordances.spec.ts`; asserts the mobile control card, which survives the abrogation |

## Battery (this lane green; concurrent-lane reds demarcated)

```
npx vue-tsc -b --force   → my files CLEAN; sole error is W6's src/games/futoshiki/solver/solver.worker.ts(101,24)
                            TS2554 (generateFutoshiki call passes 2 args; W6's rebuilt wasm binding now expects 3) — NOT this lane
npm run test:unit        → 91 passed (10 files); incl. the 14 new native-entry contracts
npm run lint:eslint      → clean (exit 0)
npm run lint:knip        → clean (exit 0)  [after deleting the dead useStackedLayout.ts]
npx prettier --check src → my 9 modified src files CLEAN; the 2 dirty files (pencil/composables/rasterPose.ts,
                            pencil/grid/HandDrawnGrid/HandDrawnGrid.vue) are the concurrent §4 perf lane's mid-edit
npx vite build           → ✓ built in 1.14s, 164 modules (the app bundles; `npm run build`'s vue-tsc prefix is
                            blocked only by the W6 worker TS error above)
e2e smoke (mobile spec)  → against vite-preview on 127.0.0.1:5273 (ephemeral, IPv4-explicit — :5199 was held
                            by the user's IPv6 glass-ui server): 3 passed, 1 blocked by the §4 rasterPose bake bug
e2e smoke (desktop parity)→ affordances.spec.ts "composed keyboard: K-peek from cell focus + roving + undo" →
                            ✓ 1 passed (2.1s): the full desktop keyboard model (roving tabindex, Ctrl+Home/End,
                            K-peek, type '5', undo/redo) is byte-identical against the excision
```

## Notes / outstanding

- **Census correction (useStackedLayout).** r2 §1 row 10 called `useStackedLayout` a survivor
  ("co-consumed by drawer + ControlPanels") against sealed HEAD `7393e7df`. That is **stale**: W4's
  excision refactored `useControlsDrawer` to its own module-level `mediaRef` (`rowRegime =
  mediaRef("(min-width:1024px)")`) and dropped the import — it now only *mentions* the name in a
  comment. With the pad gone, `useStackedLayout`'s only live consumers (`padActive`) vanished, so
  knip flagged it as an unused file. Per "dead code goes, not display:none" + the knip-clean gate, it
  was **deleted** (and the stale comment in `useControlsDrawer.ts` fixed). `useCoarsePointer`
  genuinely survives (both `ControlPanel.vue`s import it) and stays.
- **Focus styling is already congruent** — the cells' existing `:has(input:focus-visible)`
  crayon-blue ghost is the `:focus-visible` baseline the spec asks for (tap = no ring, hardware
  keyboard = ring). Lane B refines the look; this lane preserves the semantics + baseline.
- **Not this lane** (other WM lanes): keyboard-avoidance (`visualViewport`), the broader iOS
  discipline set (tap-highlight, `user-select:none`, safe-area, overscroll), hint/undo/redo touch
  surfaces, long-press peek + haptics, the DPR2 perf cap. §1's input semantics are landed; those
  ride their own lanes.
- **Goldens untouched** — the four committed goldens capture cell/grid/logo/toggle only; no golden
  captures the DigitPad or the mobile control card, so the excision is golden-safe (verified by
  reading the visual-golden/visual-regression capture targets).
