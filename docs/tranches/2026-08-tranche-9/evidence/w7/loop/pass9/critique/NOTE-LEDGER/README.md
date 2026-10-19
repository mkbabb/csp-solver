# NOTE-LEDGER · pass 9 · CRITIQUE (§7 the note's life)

Critic: non-author, pass 9. Base and π control `74a2b5d9`. The lane's bank is read from its files; every number
below marked **re-derived** was read by this critic on this box, this pass, from scratch under the critic's durable
dir (`.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/`, not banked). Ports: tree :4249, control :4248, both started
and stopped by this critic by recorded PID.

## 0 · Mechanics (re-derived)

| check | result |
|---|---|
| `pass9.diff` sha1 | `ffae10c5…` = BANKED.txt |
| `pass9.delta.on-WAVE.diff` sha1 | `41138e29…` = BANKED.txt |
| `git apply -v --check pass9.diff` on a fresh archive of `74a2b5d9` | **0, 28 paths checked** |
| on-WAVE delta `--check` on `acb9c08e` (base + `WAVE.diff`) | **0, 4 paths** |
| on-WAVE delta `--check` on `f1c9c3fe` (base + `s13-s7-s3.diff`, §7's integrated tree) | **0, 4 paths** |
| on-WAVE delta on `acde977b` + ERASE9 (`1a9c822a`): check, then applied for real | **0 · 0** |
| the work tree vs `74a2b5d9` + `pass9.diff` applied | **28/28 `cmp`-equal** |
| the 13 home paths in the bank vs `74a2b5d9` + `homes.diff` (`1f70cfda`) | **13/13 equal: residual home edits 0** |
| interdiff over `pass8.diff` (homes excluded) | 4 files **+325 / −14** (spec +142/−1, lint:ink +112/−10, GameBoard.vue +15/−3, notes test +56/−0): matches the lane |
| union builds from scratch (`git init` boundary, private cacheDir) | with delta `index-GFP_WfYlF9vC.js`, without `index-Bi2HreEzQtjZ.js`, CSS 108,093 B each: **the lane's identities reproduce** |
| tree build | `index-CLMHqVE-evo7.js`: **reproduces** |

Scratch applies ran with `GIT_CEILING_DIRECTORIES` at the critic's dir, so no apply could silently skip paths as a
sub-directory of main's repo (every `-v` log counts its paths). No git ran on main or in the control tree; the
archives were cut from the lane's worktree.

## 1 · Rows 2/4, the source law: the pass-8 plants FIRST, then the class (re-derived)

`lint:ink` BARE (`node scripts/check-ink-pressure.mjs`, exit written by the runner) on a scratch copy of the bank's
`src/ scripts/ package.json`, each plant an overlay on `MarginNote.vue`'s bytes. The lane's plant generator
(`instruments/nplant.mjs`) for N3–F2/NN5, the critic's own `cplant.mjs` for C1–C6. Load 59.6 → 22.3 across the run.

| plant | lint:ink | the line it prints |
|---|---|---|
| clean | **0** | — |
| N3 `--seat: inherit` via var | **1** | R2 `⊥inherit(--seat)` |
| N4 `> p:first-child { font-size: 40px }` | **1** | R4 20.80 under 52.00 |
| N5 seat in `@supports (display: nonsense)` | **1** | R3 holds in [] |
| N6 seat in `@container (min-width: 5000px)` | **1** | R3 holds in [] |
| N7 seat `:not([role])` | **1** | R1 0 sites |
| **N19** `> p:first-child:has(.margin-note-ink) { line-height: 2.2 }` | **1** | R4 20.80 under 35.20 |
| N19b `:not(:empty)` twin | **1** | R4 20.80 under 35.20 |
| M10 dead `@supports` zero on the block | **0** (pass 8's false RED dies) | — |
| F1 voice line-height deleted | **1** | R4 UNRESOLVED |
| F2 voice font-size deleted | **1** | R4 UNRESOLVED |
| NN5 seat in a live `@supports (display: grid)` | **0** (correct) | — |

Every pass-8 plant the charter re-cuts reds at source on the bank's bytes. **The lane's table reproduces.**

Literal sabotage (the critic's, `sed` on a copy of `check-ink-pressure.mjs`, restored `cmp`-equal after):
`on("R4-element")` → `false`: N19 **0**, N4 **0** (the clause is load-bearing for both); the R4 bound `line - 0.5` →
`line - 15`: N19 **0** (the threshold is load-bearing). The lane's 16/16 switch battery and 6/6 literal battery are
its own; this critic re-ran the shipped `--self-test --plants --sabotage-battery` bare (§3).

### 1.1 · THE CLASS IS NOT CURED AT CI (the class law, registry-v8 §2.12)

N19's species is "a rule that grows the voice's line only once it holds ink". R4-element reads `font-size` and
`line-height` on the voice's OWN element. The charter's row 6 makes `lint:ink` CI's ONLY reserve arm (the spec is a
local instrument under O-12, chair p9 §11). Six one-rule plants of the same species, each appended to
`MarginNote.vue`'s `<style scoped>`, read **`lint:ink` 0 (GREEN)**:

| plant | rule | lint:ink |
|---|---|---|
| C1pad | `.margin-note-ink { padding-block: 6px }` (the ink is `inline-block`) | **0** |
| C2inkfs | `.margin-note-ink { font-size: 30px }` | **0** |
| C3voicepad | `.margin-note:has(.margin-note-ink) { padding-top: 8px }` | **0** |
| C4spanmargin | `.margin-note-block > p > span { margin-top: 10px }` | **0** |
| C5valign | `.margin-note-ink { vertical-align: 12px }` | **0** |
| **C6inklh** | `.margin-note-ink { line-height: 2.2 }` — N19's own declaration, one element deeper | **0** |

C6 is the sharpest: the same `line-height: 2.2` N19 carries, moved from the `<p>` to its only child (an `inline-block`
whose line box IS the voice's line), is GREEN at source. Their paint is read in §2.1.

## 2 · Row 1, REST = SPOKEN, served beside the control (re-derived, both engines)

The lane's own `e2e/note-reserve.spec.ts -g "rest = spoken"` (spec sha `26c40911`), the critic's scratch Playwright
config (chromium + webkit, 2 workers). Tree `index-CLMHqVE-evo7.js` on :4249, control `index-CubiZsMVSwTc.js` on
:4248. Δ = spoken − rest.

| cell | tree clean Δstrip · ΔboardTop (light, dark; cr, wk) | tree N19 `double` | tree edge-in · edge-out | control clean Δstrip (docH) |
|---|---|---|---|---|
| 390×844 coarse | 0.00 · 0.00 | +14.39 · −7.20 | 0.39 · 0.59 | 0.00 (844) |
| 844×390 coarse | 0.00 · 0.00 | +15.30 cr / +15.27 wk, docH 410→426 | 0.39/0.36 · 0.59/0.56 | **+1.30 cr / +1.27 wk (409→410)** |
| 360×800 coarse | 0.00 · 0.00 | +14.39 · −7.19/−7.20 | 0.39 · 0.59 | 0.00 (800) |
| 1280×800 fine | 0.00 · 0.00 | +16.34 · 0.00, docH 800→811 | 0.38 · 0.58 | **+2.81 (800)** |

- Tree: **8 passed, exit 0** (1.5 min, load 26.6 → 27.7). Control: the row reds at 844×390 and 1280 on the clean
  page (the π the tree cures at rest) and is still at 390/360. **The lane's row-1 table reproduces to the hundredth.**
- π, read here: the tree's REST strip is the control's SPOKEN strip (844×390 22.09 vs 20.80, +1.29; 1280 23.63 vs
  20.80, +2.83). That is a pixel the tree moves at rest, declared by the lane and by pass 8; it is the cure's price,
  not a hidden move.
- The bound is pinned both sides (edge-in 0.36–0.39 still, edge-out 0.56–0.59 moved). One nit: at 844×390 the
  in-bound edge-in arm moves `docH` 410 → 411 while the row reads still. The row bounds the strip, not the document;
  a 0.39 px growth that rounds the page's scroll height up by a whole pixel passes.
- Control exit beside it: `rest = spoken` **4 failed, 4 passed, exit 1** (1.5 min, load 22.3): RED at 844×390 and
  1280 in both engines, GREEN at 390 and 360.

## 3 · Row 13, share-truth on the union (re-derived, both engines, born-RED in-run)

The lane's port-free probe (`instruments/notice-probe.mjs`, dists from disk through `context.route`, 1280×800, every
animation frame for 6 s after `?board=Zm9vYmFyYmF6`), with ONE critic change: beside the DOM-text count it counts a
frame only when the ink span is VISIBLE (computed opacity > 0.05 and a non-zero width; LAWS P8 §D's visibility key —
the lane's count is DOM text, which an `opacity: 0` or `backwards`-filled ink would also pass). The union dists are the
critic's own builds (`acde977b` + ERASE9 with and without this delta, identities equal to the lane's).

| arm (visible / frames) | cr sudoku | cr futoshiki | wk sudoku | wk futoshiki |
|---|---|---|---|---|
| control `74a2b5d9` | 746 / 755 | 763 / 772 | 514 / 526 | 533 / 537 |
| union + ERASE9, NO LEDGER9 (born-RED) | **0 / 753** | **0 / 737** | **0 / 525** | **0 / 547** |
| **union + ERASE9 + LEDGER9** | **713 / 722** | **707 / 715** | **527 / 542** | **549 / 552** |
| tree (pass 9) | 720 / 728 | 714 / 723 | 544 / 547 | 550 / 554 |

Visible = DOM-text on every arm (the sentence is never present and unpainted). Probe exit 0 both engines, load
22–30. **The cure reproduces on the union with its born-RED in the same run.** The locus reading (`GameBoard.vue`
`spokeThisFlush`, set by the 0→N arm, cleared on `nextTick`) is sound for the measured path. Its reach is ONE flush:
a first board whose generation bump lands a tick after its givens (an awaited arrival) would still be written over;
no shipped path was found doing that, and the unit rows price the re-deal arm (the lane's 18/18 and both ablations
are its own; not re-run here).

## 4 · Frames (LOOKED AT)

The lane spent no crop (headroom 120,378 B untouched; the evidence policy is its claim, not re-run here). The one
frame the ballot carries is pass 8's, frozen:
`pass8/prototype/NOTE-LEDGER/T9-B-LEDGER-union+homes+ERASE8+LEDGER8-fenced-HOLD-AGE-STEP-TINT-P4-cr+wk-light+dark-390x844-coarse-dpr2-at-0.5+1280x800-fine-dpr1-left460.png`.
Read on the image: the STEP row is indistinguishable from HOLD in all eight panels (light and dark, both engines, 390
and 1280). The lane STRIKES STEP to its numbers in its README — the right call under LAWS P8 §C — but the owner-facing
frame still shows STEP as an arm. A strike that lives only in a README beside a frame that still presents the arm is
a declaration, not a cure. The dark theme is framed at P4 rest +2.6 s only (no +100 ms dark panel) and the 1280 panel
is light only; both are now declared, not framed. Row 7 stays OPEN until the ballot's own frame (or its caption file
the chair folds) carries three arms, not four.

## 5 · Row 11, @property C4 / TIMING 4 (re-derived, port-free)

Pass 6's `check-property-block.mjs` and `undefined-token-census.mjs` run from the critic's scratch, bare:
tree (`74a2b5d9` + `pass9.diff`) **cpb-source 1 · cpb-dist 1 · census 1**; union (`acde977b` + ERASE9 + LEDGER9)
**0 · 0 · 1**. Load 29. The lane's table reproduces: the tree still breaches through §13's borrowed `motionRungs.ts`,
the on-union delta carries no stub. Declared the fold's, as the charter allowed; the tree is not a shippable bank on
its own and only the on-WAVE delta should ride.

### 2.1 · The class plants in PAINT (re-derived, the lane's row with the critic's arms)

A scratch copy of the lane's spec (`note-crit.spec.ts`, ARMS replaced, light only; plant CSS assembled at run time),
tree on :4249, both engines. Δstrip spoken − rest (ΔboardTop):

| plant | 390×844 | 844×390 | 360×800 | 1280×800 (docH) | lint:ink (§1.1) |
|---|---|---|---|---|---|
| N19 `double` (the lane's negative) | +14.39 (−7.20) | +15.30 / +15.27 | +14.39 | +16.34 (800→811) | 1 |
| C1pad | **+12.00** (−6.00) | **+12.00 / +11.97** (410→422) | **+12.00** | **+11.98** (→806) | **0** |
| C2inkfs | **+18.20** (−9.11) | **+16.91** (410→427) | **+18.20** | **+15.38** (→810) | **0** |
| C3voicepad | **+8.00** (−4.00) | **+8.00 / +7.97** (410→418) | **+8.00** | **+7.98** (→803 cr / →802 wk) | **0** |
| C6inklh | **+14.39** (−7.20) | **+15.30 / +15.27** (410→426) | **+14.39** | **+16.34** (→811) | **0** |
| C7trans `.note-swap-enter-active { padding-bottom: 12px }` | 0.00 | 0.00 | 0.00 | 0.00 | 0 |

So: the LOCAL paint row sees C1–C6 (every one moves the strip by 8–18 px, both engines, the same as or near N19),
and CI's only arm (`lint:ink`) sees none of them. C6 paints IDENTICALLY to N19 (+14.39 / +15.30 / +16.34 class) and
is GREEN at source. Row 2's "N19 caught at source" is true of N19's spelling, not of its species, and row 6's reason
for building no browserless pin ("N19 is now caught at source by R4-element") does not hold for the class. Under the
class law this is OPEN.

C7 is the row's own blind spot: a growth that lives only while the ink enters is still at both read instants (rest,
and spoken + 1.6 s). §2.2 reads whether it moves the strip in between.

## 6 · Row 9, the control's dark arm (re-derived)

`note-reserve.spec.ts -g "the empty voice holds"` on the control :4248, both engines: every cell prints BOTH themes
(chromium and WebKit, 390×844 / 360×800 `height 0` under line 20.80; 844×390 `height 0` under line 22.10, reserve
20.80), **6 failed, exit 1** (load 23.4). The dark arm is read. **CLOSED, reproduces.**

## 7 · The charter's rows, the critic's ledger

| row | lane says | critic |
|---|---|---|
| 1 REST = SPOKEN | CLOSED tree + union | **CLOSED** on the tree (re-derived §2, the control's exit beside it). Its two blind spots are §2.1–2.2's, booked under row 2/6 and the new row below. |
| 2 R4 element-keyed + condition context + reach + css-wide var | CLOSED in the bank's composition | **OPEN by the class law.** Every named plant reds (re-derived §1). The species does not: C1–C6 GREEN at source, C6 is N19's own declaration on the voice's only child. |
| 3 ONE reader | PROPOSED | **OPEN.** Two compositions still ship; the collapse is uncached (6.5 s per read, ~17 min self-test against 64 s). PROPOSED diffs apply 0 (critic: on homes v2, 2 paths; both on the tree, 3 paths). Not a closure. |
| 4 masked fallbacks | CLOSED | **CLOSED at lint:ink** (F1/F2 RED, R4-unresolved literal deletion RED per the lane; F1/F2 RED re-derived §1). The home's own `fsOf → 16`/`lhOf → 1.2×` stay masked until the PROPOSED `r4-unresolved` folds. |
| 5 MUST_CLOSE keyed on the verdict | not touched | **OPEN** (bytes equal pass 8's: interdiff 0 on `check-font-coverage.mjs`). |
| 6 O-12 head | the head says local | **MET as worded** (chair p9 §11 ratified). Its stated reason ("N19 caught at source") is true of N19's spelling only (§1.1): CI has no arm for the species. |
| 7 the composite | STEP struck to numbers, dark/1280 declared | **OPEN** (§4): the owner's frame still presents STEP. |
| 8 the 2lh seat | re-measured numbers | **OPEN as an owner item.** Numbers are the lane's (not re-derived here); the ballot is unframed; the berth's booking is absent in CHAIR-RULINGS p9 and registry v8, as the lane says. |
| 9 the control's dark arm | CLOSED | **CLOSED** (§6). |
| 10 glyph-text 4.357 | OPEN | **OPEN**, untouched; `p6aa.ts` was never in the product (correct), so the deletion half is vacuous and the statistic half is owed. |
| 11 @property C4 | the fold's | **Declared, reproduces** (§5). |
| 12 rows cited | ERASE's fence 58/58 on the union | The ghost-name plant is RED in-run on the union (the lane's read; ERASE's critic re-derived the fence). ERASE's critic finds two NEW spellings (`animation-timeline: scroll(root)` among them) still holding line two 162–168 ms: §7 on the union still ships the double-paint species. Not this lane's to cure; it caps §7. |
| 13 share-truth | CURED | **CURED** on the union with its born-RED in-run (re-derived §3, visibility-keyed). |

### 2.2 · The row's temporal blind spot (re-derived, the critic's whole-window sampler)

The critic's sampler reads `.board-margin`'s height on EVERY animation frame for 2.5 s from the `h` keypress, at
390×844 coarse DPR 2, light, tree :4249:

| arm | chromium: max \|Δ\| · frames moved > 0.5 | WebKit |
|---|---|---|
| clean (the shipped tree) | **0.00 · 0 / 313** | **0.00 · 0 / 246** |
| C7trans (`.note-swap-enter-active { padding-bottom: 12px }`) | **12.00 · 32 / 311** | **12.00 · 25 / 246** |
| N19 `double` | 14.39 · 324 / 324 | (same species) |

Two readings. (a) The shipped tree is still through the WHOLE window in both engines, not only at the two instants:
a positive the lane did not claim and this critic did. (b) The shipped row cannot see a growth that lives only while
the ink enters: C7 jumps the strip +12 px for ~0.5 s (a double layout shift under the board) and the row prints still
(0.00 at rest and at spoken + 1.6 s, every cell, both engines, §2.1). The row keys two instants, not the window. It
is a local instrument, so this is a gap in the paint arbiter, not a CI hole on top of §1.1's.

## 8 · Constraints

- **π vs `74a2b5d9`:** the tree's rest strip = the control's spoken strip (+1.29 at 844×390, +2.83 at 1280; 0 at 390
  and 360), re-derived §2; declared by the lane. The share-truth cure restores the control's sentence (§3). No other
  pixel was read moving.
- **CSS identity (T9-R6):** the lane's "the tree's served class-selector set equals the control's" is **false as
  worded**: the tree's index CSS carries 430 distinct class selectors against the control's 419; the 11 extra are all
  `MarginNote.vue`'s own scoped classes from pass 8 (`.margin-note-previous`, `.is-hidden`, `.is-spent`, the
  `note-swap`/`note-rub`/`note-previous` transition classes). No Tailwind utility is minted and none is control-only, so
  the T9-R6 law holds; the claim needs correcting, not the code.
- **AA, filterBudget 9, M16:** no ink token, colour, filter or product string moves in this pass's interdiff (+325/−14
  over four files: a spec, a lint script, a unit test, and GameBoard's flush guard). The lane's `check-copy-register`
  0 is its own; not re-run here. No painted-AA claim is made, and none is owed for a no-colour delta.
- **The @property law:** tree 1 · 1 (the fold's stub), union 0 · 0 (§5).
- **Instruments:** `check-ink-pressure.mjs` imports `./shape-census.mjs` (relative, homes v2 by sha, 13/13 equal);
  the spec imports `@playwright/test` only. No import from `docs/`. No residual home edit.
- **The batch gate (pass9/CHAIR-RULINGS §6):** this delta touches no `frontGate`/`frontTween` (grep 0 in both banks).
  ERASE's ghost-name plant RED in-run: the lane's read and ERASE's critic's. FIVE's D10 window-minimum cap and TAB-PEN's
  apply checks: met per their critics. Nothing in this lane's gate list is unmet.

## 9 · Gaps first, the number, the verdict

**The critic's number: NOTE-LEDGER 92 (held). §7 on the WAVE union: 91 (held).** **Verdict: ADVANCE.** Not converged.

Why held and not raised: the two batch-1 blockers are really closed (row 1 REST = SPOKEN on the tree, both engines,
N19 red in-run, the control's exit beside it; row 13 share-truth cured on the union with born-RED, visibility-keyed),
and row 9 closes. Against that: row 2's "N19 caught at source" is a cure of its plants, not its class (six one-rule
spoken-half growths GREEN at CI's only reserve arm, one of them N19's own declaration one element deeper), rows 3, 5,
7, 10 are untouched or PROPOSED, row 8 is an owner item in numbers only, and the paint row keys two instants. §7 on
the union stays at 91 because the union still ships ERASE's double-paint species through spellings its fence does not
key (ERASE's critic), whatever this lane cured.

Open gaps, exact:
1. **CLASS (new, rows 2 and 6):** `lint:ink`'s R4 reads only `font-size`/`line-height` on the voice element. C1
   `.margin-note-ink { padding-block: 6px }`, C2 `.margin-note-ink { font-size: 30px }`, C3
   `.margin-note:has(.margin-note-ink) { padding-top: 8px }`, C4 `.margin-note-block > p > span { margin-top: 10px }`,
   C5 `.margin-note-ink { vertical-align: 12px }`, C6 `.margin-note-ink { line-height: 2.2 }` all read **lint:ink 0**,
   and C1/C2/C3/C6 paint +8.00 to +18.20 px on speech in every cell, both engines. The cure is either R4 reading the
   voice's whole line box (the voice element AND its descendants, every box-growing property: padding, border,
   margin on the inline-block ink, `vertical-align`, the ink's font and line), or the browserless rest=spoken pin row 6
   offered. Owed with C1–C6 as plants.
2. **Paint row (row 1's instrument):** keys rest and spoken + 1.6 s only. C7 `.note-swap-enter-active { padding-bottom:
   12px }` jumps the strip +12 px for 32 (cr) / 25 (wk) frames and reads still. A whole-window max |Δ| (the shipped tree
   reads 0.00 over 313/246 frames) closes it. The row also bounds the strip, not `docH`: edge-in's +0.39 moves the
   document 410 → 411 at 844×390 and reads still.
3. **Row 3:** the ONE reader is PROPOSED; two compositions ship; the collapse needs a per-file cache (6.5 s per read,
   64 s → ~17 min self-test). The 6/6 literal-deletion read on the ONE reader is owed to the fold.
4. **Row 5:** MUST_CLOSE still keyed on the `/^margin/` extractor name; the narrowing plant reds through the vacuity
   row, not the pin.
5. **Row 7:** the owner's frame still shows STEP (= HOLD on every panel); dark only at rest; 1280 light only.
6. **Row 8:** the 2lh seat is numbers only (lane's, not re-derived); unframed; the berth unbooked.
7. **Row 10:** glyph-text 4.357 through glyph-pop at its home not run; 8/8 union cell-runs and the WebKit pop-49 read
   owed.
8. **Row 11:** the tree's C4 breach (the fold's stub); only the on-WAVE delta is a shippable bank.
9. **Row 12 (ERASE's):** the union's §7 double paint survives through un-keyed spellings (ERASE's critic); ≥ 5
   runs/engine still owed there.
10. **Row 13's reach** is one flush: an awaited first board whose generation lands a tick after its givens would be
    written over. No shipped path found; no plant exercises it.
11. **The lane's CSS-identity sentence** is false as worded (+11 scoped selectors), the law it serves holds.

## 10 · The battery this critic ran (exits read bare from files the runs wrote; the control's beside)

| row | tree / union | control `74a2b5d9` | load (1-min) |
|---|---|---|---|
| `pass9.diff` apply on `74a2b5d9` · on-WAVE delta on `acb9c08e` / `f1c9c3fe` / `acde977b`+ERASE9 | 0 · 0 / 0 / 0 | — | — |
| `lint:ink` bare, clean + 11 lane plants + 6 critic plants + 3 literal sabotages | clean 0; N3–N7, N19, N19b, F1, F2 → 1; M10, NN5 → 0; C1–C6 → **0**; sabotages → 0 (each GREENs its plant) | — | 59.6 → 22.3 |
| `lint:ink --self-test --plants --sabotage-battery` | **0**, 34 plant rows ok, 16/16 clauses RED (57 s) | — | 22.1 → 28.4 |
| `note-reserve.spec.ts -g "rest = spoken"` | **8 passed, exit 0** | **4 failed, 4 passed, exit 1** | 26.6 · 22.3 |
| `note-reserve.spec.ts -g "the empty voice holds"` | **6 passed, exit 0** | **6 failed, exit 1**, both themes read | 24.8 · 23.4 |
| critic class spec (C1–C3, C6, C7, N19) | 8 failed, exit 1 = the C7 arm reads still where it must move (every cell, both engines); C1–C3, C6 moved | — | 24.4 |
| critic whole-window sampler | 6 passed, exit 0 (readings in §2.2) | — | 22.0 |
| share-truth probe, 4 dists × 2 games × 2 engines | exit 0 / 0 (table §3) | in the same run | 22–30 |
| `check-property-block` src · dist · census | tree 1·1·1, union 0·0·1 | (lane: 0·0·1) | 29.3 |

Not re-run by this critic (the lane's own, cited as such): vitest 852/852 and 960/960, the unit ablations, vue-tsc,
typecheck:e2e, eslint, prettier, knip, lint:copy, check-copy-register, font-coverage, check-pw-projects, theme-tokens,
the PROPOSED collapse's ~17 min battery, the 2lh seat readings, ERASE's drop-clock 58/58, the evidence policy.

## 11 · Incidents (self-declared)

1. The first Playwright battery exited 1 on all three rows in < 2 s: the scratch config could not resolve
   `@playwright/test` (the worktree's `node_modules` is a symlink to main's; a config outside it resolves nothing).
   Cured by a `node_modules` symlink in the critic's scratch dir; the three logs moved to `trash/batt1-r1/`; every row
   above is from the re-run.
2. The second battery (`batt2.sh`) was launched with a shell `&` from a foreground call, not `run_in_background`. It
   ran to completion (its `.done` marker and exits are in its logs).
3. `git init` ran in two scratch copies (`waveE`, `wE0`) as a Tailwind boundary, the lane's incident-1 cure. No commit,
   commit-tree, update-ref, stash or push anywhere; no git on main or in the control tree. Archives were cut from the
   lane's worktree.
4. Foreign Playwright workloads (other repositories) shared the box throughout; the 1-min load stayed 20–60 on every
   row, under the 120 law.
5. Some responses carried two shell steps in one Bash call; one tool call per response held.
6. Servers :4249 (listener 37188, wrapper 37132) and :4248 (37260, 37217) were started and stopped by recorded PID,
   cwd and served identity checked; both ports read free at return.

## 12 · Replay

Scratch `.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/` (scripts copied to `instruments/`): `mk.sh` (archives +
apply checks), `mk2.sh` (tree/homes equality, interdiff), `crun.sh t9` (lint:ink plants + sabotage), `st.sh`,
`mk3.sh` (union builds), `notice.sh`, `prop.sh`, the lane's `serve.sh` re-pointed, `batt1.sh`/`batt2.sh` with
`pw.sh` and `note-crit.spec.ts.txt` (rename to `.ts`, a `node_modules` symlink beside the config).
