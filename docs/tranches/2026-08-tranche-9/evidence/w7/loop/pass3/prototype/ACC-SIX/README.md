# ACC-SIX — pass-3 PROTOTYPE (it RUNS)

Worktree `.claude/worktrees/wf_f72f3b5a-83a-45`, branch `master`, base `74a2b5d9`, uncommitted
(14 files, +722/−104 at the last read). Prototype dist on `127.0.0.1:4239`, HEAD control dist on
`127.0.0.1:4240` (`git archive 74a2b5d9` into the scratchpad, built with its own `cacheDir`, the
untracked puzzle bank symlinked in). Both built INSIDE their own trees, build and serve never
sharing a cacheDir. Both servers killed at return; 4230–4249 reads free. Every board colour below
is PIXELS through a `sharp` byte read-back off a real screenshot; every computed style waits out
the tweens.

## The replay

`git` aimed at the pass-2 worktree is refused by this session's isolation (the chair's stated
fallback). Route taken: `git archive a8fee1f5 web/frontend` into the scratchpad, `diff -u` against
the pass-2 worktree file by file, headers rewritten to `a/` `b/`, `git apply`. The 11-file figure
is 10 on this measure — `check-copy-register.mjs` is byte-identical to `a8fee1f5` in the pass-2
worktree, so pass 2 never touched it.

**Carried: 10 files, +492/−80, applied cleanly.** `vue-tsc` exit 0 on the replay before any
pass-3 edit.

**REFUSED: `scripts/check-font-coverage.mjs`.** The fold's +34 rewrote the exact region the
pass-2 hunk targets (`washiTapes`' extractor). Resolved TOWARD the fold per the chair, and the
hunk re-cut by hand in pass 3 (§below). It is the only FOLDMOVED file; the other fold-touched
files (`GameControlPanel.vue` +7, `GameBoard.vue`'s `hoveredAuthor`/`isCoarse`/`focusout`,
`check-copy-register.mjs` +937) took the pass-2 hunks at the fold's offsets with no conflict, and
`git diff 74a2b5d9` shows the fold's twelve picks intact.

**NOT replayed, on the spec's own order:** the pass-2 count TAPE (`countTape.test.ts`, the
`SheetWashiLabel` `anchor="head"` substrate, `.count-tape`'s rules), `MOTION.tapeRestMs` /
`traceFillMs` / `traceWinMs` (`pencilConfig.ts` reverted WHOLE — a second motion ladder is
registry §2.1's tell, and ACC-FIVE reverted the same file for the same reason), and pass-2's
`poseLengths` (superseded by ACC-FIVE's, below).

## What pass 3 changed on top of the replay

| # | file | what |
|---|---|---|
| 1 | `gridPaths.ts` | ACC-FIVE's pass-3 `posePoints` / `poseLengths` / `poseFronts` **copied verbatim** from worktree `-41` (the merge watch's condition met: nothing re-minted, one scanner); pass-2's own `poseLengths` deleted; `FRAME_X_PAD` un-exported (its only consumer was the dead tape — knip) |
| 2 | `index.css` | the answer's three rungs named over bytes already in the tree; `solver-ink-2` and `progress-ink` bound to them per theme; **the escape rung `--color-answer-ink #9b74f7` minted, because the number said so** (§G2); `#8b5cf6` deleted with its one job; the PAINTED ledger replaces the arithmetic one; `--sparkle-glow-*`; the print/forced arms incl. `.attribution-tape`; `.count-tape`'s PRM row struck |
| 3 | `HandDrawnGrid.vue` | the tape deleted whole; `poseFronts` consumed at both traces; `pathLength` + both dashes gone; `stroke-opacity` 1; `aria-valuetext` = the count's own literal, `valuenow`/`valuemax` = count/writable |
| 4 | `GameBoard.vue` | `boardKey`, `fillsShown = min(3, writable)`, `showCount`, `taught`, `countLine`, the `:meta` binding, `.board-margin { min-height: 2lh }`; the fold's rows untouched |
| 5 | `MarginNote.vue` | `aria-hidden` on the meta line (the progressbar speaks it) — one attribute, the tenth product file, declared |
| 6 | `DifficultyTally.vue` | ACC-FIVE's pass-3 file copied (hygiene, `poseFronts`) |
| 7 | `SheetWashiLabel.vue` | the text term leaves the seed; the `head` anchor struck with the tape |
| 8 | `check-copy-register.mjs` | `aria-valuetext` in `RENDERED_ATTRS` + a born-RED colour and its positive control |
| 9 | `check-font-coverage.mjs` | a `countLine` extractor over the template's static segments; the bound census generalised from `<SheetWashiLabel :text>` to a tag+attribute pin, so `<MarginNote :meta>` can be pinned |
| 10 | `check-theme-tokens.mjs` | law 20's direction arm with three plants, and G9's alias law with an exit code and a fourth plant |
| 11 | `GameBoard.count.test.ts` | NEW — 12 rows: the literal, the lifecycle, and four of the pass-2 critique's findings as the reader's own sequence |

## The numbers

### G2 · THE LIGHT TRACE — the escape fired, and the rule was written before the run

The spec's rule: ship `#8b5cf6` at α 1, and mint a fourth rung only if the painted modal core
reads under 3.10 on either engine. Measured on the dist, modal-of-run core over 24/24 columns:

| arm | modal painted | vs frame line | vs paper | worst |
|---|---|---|---|---|
| `#8b5cf6` @ α1, light, **both engines** | `rgb(139,92,246)` h 292.7 | 3.072 | 4.160 | **3.072** ✗ (<3.10) |
| the same at HEAD's α 0.95 | `rgb(134,89,235)` / `(134,89,236)` | 2.876 / 2.883 | 4.444 / 4.433 | **2.876 — FAILS 1.4.11** |
| **`#9b74f7` @ α1, light, SHIPPED** | `rgb(155,116,247)` h 294.4 | 5.878 chromium · 4.781 webkit | 3.309 | **3.309** |
| `#7c3aed` @ α1, dark, both engines | `rgb(124,58,237)` h 293.0 | 4.824 chromium · 3.299 webkit | 3.284 | **3.284** |
| the same at HEAD's α 0.95 | `rgb(128,65,235)` | 4.589 / 3.139 | 3.451 | 3.139 |

The spec predicted the escape at 3.86 line / 3.31 paper, worst 3.31 — **3.309 measured, exact**.
The 2.876 HEAD light reading reproduces ACC-FIVE's to the thousandth on an independently built
control. Margin light **0.309**, dark **0.284**. Hue 294.4°, 1.4° off the anchor, inside ±2°.

### G0 · THE SEGMENT LAW — closed, and the control is 74 points red

Painted share of the ring (violet pixels at fraction *p* over violet pixels at *p*=1), one
declaration form, live gauge, both engines, dpr 1 and 3:

| | p 0.05 | p 0.25 | p 0.50 |
|---|---|---|---|
| prototype chromium (dpr1 / dpr3) | 5.13 / 5.13 | 24.79 / 25.19 | 49.83 / 50.68 |
| prototype webkit (dpr1 / dpr3) | 5.15 / 5.11 | 24.86 / 25.10 | 50.28 / 50.19 |
| **engine spread** | **0.45 pt** | **0.56 pt** | **0.85 pt** |
| HEAD chromium @ a requested 25% | — | 24.74 / 25.16 | 100 |
| **HEAD webkit @ the same 25%** | — | **99.07 / 99.22** | 100 |

The bound was 2 points. HEAD's two engines are **74.33 points apart on identical DOM**; the
prototype's are within 0.85. `pathLength` and both `stroke-dasharray`s are gone from the served
tree (`computedDash: none`, `hasPathLength: false`), and the trace's `d` carries 50 commands at
2/20 against 493 at HEAD — the front is geometry.

### G5 · THE COUNT

- Laid at fill 1, both engines, both themes, desk and phone: drawn `1 of 20 on the board`,
  `aria-valuetext` the **same literal**, `aria-valuenow` 1, `aria-valuemax` 20, `aria-label`
  `board fill`, and `aria-hidden="true"` on the drawn line. HEAD: no line at all, and
  `board 5% filled` / `valuemax` 100.
- Occlusion at 1280×800 and 393×699 dpr3, both engines: **0 px² of the painted trace and 0 px²
  summed over all 81 cell boxes**, by construction.
- The strip's height at 393×699 dpr3 is **48.00 px at fill 0, 1, 3 and after the lift** — both
  engines, to the hundredth — so nothing below it moves across the count's whole life. Δ 0.00 px.
- The line is gone ~700 ms after the third fill (one 250 ms write-in band + `chromeLeaveMs` 200),
  and `aria-valuetext` keeps saying `3 of 20 on the board`.
- 12 unit rows green, including the four the pass-2 critique opened: the leashed 3-writable deal
  shows three and lifts, undo-to-empty does not re-teach, a restored two-fill session gets no
  line, and a new deal of the same size gets the lesson again.

### G1 · KINSHIP, on the SIX-anchor ruling (r0's row, MOVED, never edited)

Non-kin tokens at C ≥ 0.05, KIN_DEG 5, anchors read off the tree in each theme:

| tree | not kin |
|---|---|
| prototype | `solver-ink-1` (15.2° / 26.2°), `-3` (10.5°, light), `-4` (18.6° / 16.7°) — the declared rainbow exception, **and nothing else** |
| HEAD `74a2b5d9` | the same three **plus `--color-user-ink`, 11.5° light / 5.3° dark** |

`--color-user-ink` painted: `rgb(47,118,189)` h 251.4, **Δ 0.01° from crayon-blue**, **4.640 on
the cell ground** (chromium light); dark `rgb(105,170,234)` h 249.3, Δ 0.05°, 7.608. HEAD:
`#2563eb` h 262.9 Δ 11.48 at 5.078, `#60a5fa` h 254.6 Δ 5.33 at 7.275. The pen desaturates
C .215 → .131 and pays 0.44 of contrast for the lock — U-10.

**The exception list SHRANK by one**: `--color-solver-ink-2` is kin at 0.0° the moment the sixth
anchor is declared, which is the whole reason to declare it.

### G3 · print / forced — born-RED proven

| | prototype | HEAD |
|---|---|---|
| `.progress-trace` under `print` | `rgb(0,0,0)` ×4 cells | `rgb(139,92,246)` / `rgb(124,58,237)` |
| the same under `forced-colors: active` | `rgb(0,0,0)` light, `rgb(255,255,255)` chromium dark | the violet, unchanged |
| `.attribution-tape` rule on the sheet | present | present (the pass-2 replay's) |

### G10 / G11 · the glow and the stock hex

The sparkle's filter resolves to `color(srgb 0.768627 0.709804 0.992157 / 0.3)` — `#c4b5fd` at
α .3, **byte-exact**, in 4/4 cells; `transition: filter 0.2s cubic-bezier(0.4,0,0.2,1)` where HEAD
carried `transition: 0.2s` (`all`) and an inline `rgba(196,181,253,0.3)`. `#2563eb`, `#60a5fa`
and both `rgba(196,181,253,…)` literals are absent from the tree.

### G9 / G7 · the gates that can now fail

`check-theme-tokens --self-test`: 5 plants, all as required — the shadcn negative control RED, a
chrome rule naming a STOP RED, the same rule naming a RUNG GREEN, `#sparkle-rainbow` admitted by
name GREEN, an undeclared alias-only token RED. Three alias-only tokens print with their reason
and a fourth (the escape rung, before it was declared) **actually redded the gate**, which is how
its allowlist entry got written. `check-copy-register --self-test`: the `aria-valuetext` plant
RED, its bound-identifier control GREEN, bare run 0 offences / 0 admissions.
`check-font-coverage`: 46 codepoints (**no re-cut**), 23 declared strings over 5 groups, 4 bound
tapes pinned.

### π · the rect census, prototype vs HEAD `74a2b5d9`

`.board-wrapper`, `.sudoku-cell` ×81, `.icon-btn` ×9, `.controls-card`, `.masthead`, `.logo-text`
×5, `.board-voice` — **max delta 0.00 px, every selector, all four engine×theme cells.** The desk
board is 636.00 px on both trees.

### G12 · the filter census, on the dist

`e2e/filter-census.spec.ts` under a scratch config with no `webServer`, pointed at :4239:
**12/12 passed, both engines** — G3.1 (the population equals `filterBudget.ts` exactly, area and
all, row regime), G3.3 (the coarse regime below 1024), G3.5 (no `:hover` mints a filter, board
and picker), G3.2 (no retained fill supplies a computed transform; the source `forwards|both`
sites equal `FILL_ALLOWLIST`). So `filterBudget` 9 and the union areas 45,572 / 6,673 hold on
this dist unmoved — the spec's own assertion, enforced by the estate's own instrument rather
than re-derived here.

### The twelve bare gates, in the worktree

`lint:copy` · `lint:live-regions` · `lint:ink` · `lint:theme-selectors` · `lint:theme-tokens` ·
`lint:motion` · `test:font-coverage` · `test:support-floor` · `test:prod-shake` ·
`test:golden:bytes` · `lint:knip` · `lint:eslint` — **all exit 0.**

## THE GAPS, and then the hard part

1. **G8 is UNPROVEN and my instrument is the reason.** I ran a whole-viewport pixel census at
   C ≥ 0.05 against six anchors and got 76.76 % off-anchor light / 75.18 % dark on the prototype
   against 79.70 / 75.25 at HEAD (chromium) — nowhere near the charter's ≤30 / ≤5, and nowhere
   near its 64.29 / 49.15 HEAD baselines either. The dominant off-anchor hues are **45–55° light
   and 95–100° dark**: the warm paper and the dark theme's warm greys, which are GROUND, not
   accent. r0's own census (`loop/r0/r2-accent-family/probe/hue-census.probe.ts`) runs at
   `CHROMA_FLOOR = 0.012` over a different subject. The moved-anchor negative control confirms
   the instrument is blind here — moving the violet 6° changes the share by 0.39 points. **The
   number this family can defend is the token-level kinship above; the pixel-share claim needs
   r0's own floor and its own subject, and I did not reconcile them.**
2. **The `2lh` reserve costs 13.6 px of BOARD at the phone.** Strip height 20.8 → 48.00 px at
   393×699, and the board's bottom moves 512.73 → 499.13 (chromium) / 512.42 → 498.83 (webkit).
   Zero shift within the count's life is bought, and the spec's "no board pixel moves" is TRUE at
   the desk (636.00 both trees) and **FALSE at the phone**. `2lh` reserves two lines of the
   strip's own font for one line of caption type; a reserve at the meta line's own rung would
   cost less. Owner disposes (U-10); the agglomerator should price it against NOTE-LEDGER's
   shared row before either lands it.
3. **The seed's declared π is wrong by ~8×.** All **14** washi instances (not 16) re-tear once —
   `clip-path` moved on 14/14 and `--washi-tilt` on 14/14, as intended — but the bounding boxes
   move up to **4.60 px chromium / 4.82 px webkit**, against the spec's declared ≤ 0.55. The
   cause is mechanical: `--washi-tilt` feeds a `rotate()`, and a ±1.5° re-roll on a ~120 px tape
   moves its rotated box by several px. The pass-2 critique's 0.55 was measured on the four
   `.washi-tag` instances only. The fix is a decision (pin the tilt as well as the tear, or
   declare 4.8 px), not a measurement.
4. **The G6 seed arm did not reach the fold's attribution tape across two peers.** It needs a
   live relay session; I measured the 14 static instances instead and the unit rows prove the
   byte-equality across a text change directly. The fold's own tape is the FIX's motivating
   consumer and remains unmeasured on the real surface.
5. **The ground-line extraction is deal-dependent.** The strip the probe reads is 26 px tall at
   the board's top edge, and on some deals a given's glyph (`#0a0a0a`) lands in it, so the
   "darkest achromatic pixel" reads 10–49 across runs. The PAPER ground is stable to the byte and
   is the binding ground for the shipped rung, so `worst` is unaffected — but the `vs line`
   column swings 3.94 → 5.88 between runs and should not be quoted without its ground.
6. **The step price is declared, not paid.** With the dash gone the front advances in `d`, which
   does not transition: ~31 px per digit at 9×9, ~158 at 4×4. ACC-FIVE's pass-3 tween on the boil
   scheduler is the section's answer and I consumed only the geometry, per §5 ("this family mints
   no motion"). The two must land together or the fill visibly steps.
7. **`--color-answer-mid` was deleted**, because the escape took its one consumer and an alias
   with no consumer is what T5-W2 2.3 killed. The ramp is still three rungs, but the spec's
   "zero new violet bytes" is now "one new byte in, one old byte out" and the owner should hear
   it that way.
8. **Not run:** the 16×16 arm; the 844×390 landscape arm; Arm A (the bottom-left tape) was NOT
   built, so its cell-occlusion px² is undeclared and crop 3 does not exist — the margin line's
   zero-occlusion-by-construction made the comparison moot to me, which is a judgement the owner
   may not share; `check-golden` visual goldens (only `test:golden:bytes` ran); the
   `visual-golden` goldens (only `test:golden:bytes` ran, green — `cell-light`'s declared pen
   delta and `grid-corner-light`'s 0 px are therefore **unmeasured**, and the brief asked for
   them).
9. **Ports.** This lane opened :4239 and :4240 and killed both; the band reads free at them.
   **:4243 is still listening and is NOT mine** — a concurrent lane's, reported rather than
   killed.
10. **The `.board-margin` reserve lives in `GameBoard.vue`'s scoped sheet**, not `index.css` —
   stated as the spec allows, but it means NOTE-LEDGER's shared row has to be written there too.

## Crops (2 of the 4 allowed, both cited)

- `frames/1-count-under-the-board-phone-light-chromium.png` — 33.4 KB, 330×120 dpr3. The board's
  bottom edge and the margin strip at one write, phone light: the count sits UNDER the board with
  the ring's first arc whole above it. This is the claim no corner of the board could meet.
- `frames/2-solved-corner-desk-light-chromium.png` — 18.5 KB, 240×150 dpr2. The solved board's
  top-left corner: the answer's violet as the revealed digits and as the trace at once — the
  kill-by-form the six-anchor ruling is for.
