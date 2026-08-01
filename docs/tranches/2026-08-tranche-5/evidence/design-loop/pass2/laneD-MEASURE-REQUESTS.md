# LANE D — MEASURE REQUESTS (for the later MEASURE stage / booted perf-rig-iphone16)

Lane D ran headless chromium + webkit only. No GUI Safari, no simulator — those belong to you.
Everything below is cheap; none of it needs a build, all of it runs on the deployed or preview app.
Each row names its **threshold** and its **negative control** (the thing that must be seen to fail,
or the measurement proves nothing).

---

## R1 · The Deal die at its designed size — the one visual claim that must hold on device

**Why:** the fix is a CSS source-order change (`.deal-btn` now follows `.icon-btn`). Headless
chromium and webkit agree, but the button's box is now content-sized on fine pointers, and iPad
Safari at `pointer: fine` is a regime neither of my engines is.

| pose | URL | capture | threshold |
|---|---|---|---|
| iPad Safari, landscape, drawer open | `/?game=sudoku&size=3&difficulty=EASY` | `#controls-drawer .deal-btn` + its `svg` rects | svg **28 × 28 ± 0.5**; button height **≥ 54**; nothing clipped |
| iPhone 16, portrait | same | visible `.deal-btn` | svg **28 × 28**, button **44 × 52.16** — must be **byte-identical to today** |

**Negative control:** the iPhone row IS the control. Coarse must not move. If the phone numbers
change at all, the fix leaked out of the fine regime and I want to know.
Pre-fix reference (real tree, both engines): fine `28 × 17.63`, coarse `28 × 28`.
Post-fix: fine `28 × 28`, coarse `28 × 28`. Raw JSON: `rig/die-before.json`, `rig/die-after.json`.

---

## R2 · The three AA closures, read on a real panel

**Why:** contrast is computed here from token values, not sampled from pixels. Grain filters, the
paper texture and Safari's colour handling all sit between the token and the eye.

Sample the **rendered pixel** colour and its immediate background at:

| element | where | floor |
|---|---|---|
| `.keyboard-legend` text | desktop drawer, fine pointer + hover only | **≥ 4.5:1** |
| `.legend-row kbd` border | same | **≥ 3.0:1** |
| `.icon-sublabel.is-armed` ("sure?") | arm Clear on a dirty board, coarse | **≥ 4.5:1** |
| `.margin-note`, `.completion-vignette` voice | any status note / on solve | **≥ 4.5:1** |
| `.dt-label`, `.dt-name` | board margin tally | **≥ 4.5:1** |

Both themes. **Negative control:** `git stash` the lane, re-sample the same six — every one must
come back **under** floor (expected light: 3.53 / 2.36 / 4.10 / 4.34 / 4.34 / 5.95). If the
pre-fix sample already clears, the sampling point is wrong, not the ledger.

`npm run lint:ink --self-test` asserts the token math and proves each gate fails on a known-bad
input; it cannot see paint. That is exactly the hole this row fills.

---

## R3 · The wrapper deletion — behavioural byte-identity on device

**Why:** `SudokuGame.vue` and `FutoshikiGame.vue` now mount `GameControlPanel` directly. 40/40
targeted e2e green headless, but the *boot order* is what changed and Safari's ESM evaluation is
the interesting case (see R3b).

Per game in `{sudoku, futoshiki, thermo, killer, kenken}`: open, confirm the drawer renders its
headings in order (`New game · Size|Board Size · Difficulty · Marks · Check · Candidates`), change
size, change difficulty, Deal, Undo, Redo, Hint, Clear.
**Threshold:** identical to today. **Negative control:** none needed — a regression here is a
crash or a missing section, both self-evident. Console must be **empty**.

## R3b · The TDZ boot cycle, on Safari specifically — **highest-value row here**

I detonated this cycle deliberately and it threw
`ReferenceError: Cannot access 'sudokuGame' before initialization` in chromium.
**Load the deployed app in real Safari (desktop + iOS) with the console open and confirm zero
module-init errors on a cold, uncached load** (`?game=sudoku`, then `?game=kenken`).
The hazard is documented at `SudokuGame.vue:38-46` and mapped in `blast-radius.md §1`; engines
differ in cyclic-ESM evaluation order, so a clean chromium boot is not proof for WebKit.
**Negative control:** none — but if any lane later adds `import { sudokuGame } from "./game"` to
`SudokuGame.vue`, this row must go red. Worth re-running after every lane merges.

---

## R4 · Font strategy — the owner's eye, on the owner's screen

`font-decision-row.md` is a **decision row, not a change**; nothing is applied. What I cannot do is
judge the register for the owner, and heading type on a retina phone is exactly where "low-res"
was reported.

Show the owner, on device, both themes:
- `laneD-shots/strip-{light,dark}-letterforms.png` — the four options, same word, same size
- `laneD-shots/mngap-{A-today,C-resubset}.png` — `thermo`'s `m` and `kenken`'s `n`, 96px

**Wanted back:** one of **A / B / B2 / C**. If the answer is B2 or C, also carry the §4 build note
(cut the subset from *rendered* text, not authored text) — without it the bug returns.

**Negative control for my own claim:** if the owner cannot see any difference between
`A-today` and `C-resubset` on device, my 14.6%-Fraunces finding is real but *perceptually*
irrelevant, and the whole row should be closed as "no action". Please report that outcome honestly
if that's what you see.

---

## R5 · Cheap regressions worth a glance while you're there

- Deal's coarse padding is still clobbered `.85rem → .5rem` by the later coarse `.icon-btn` block
  (pre-existing, untouched — `blast-radius.md §4`). If Deal looks cramped on the phone, that's why,
  and it's a design call, not a bug.
- `visual-regression.spec.ts:142` asserts the first `.icon-btn` is ≥36px. Deal is that button and
  is now 55.94 on fine. Green, but the row is now measuring Deal rather than a generic icon —
  worth re-pointing if anyone rearranges the action row.
