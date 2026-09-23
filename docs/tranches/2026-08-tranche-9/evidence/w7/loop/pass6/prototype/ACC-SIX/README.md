# ACC-SIX · pass 6 prototype: the balanced rung, the count that yields, the front through the gate

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45`
(base `74a2b5d9`, advanced in place, nothing committed). Control = `74a2b5d9`, the shared `w7-control`
dist `index-CubiZsMVSwTc.js` (served read-only on :4238 from its own `.vite-control.config.ts`, never
built, never git-touched). **Lane dist = `index-DGB-edb6nfWg.js`** (43 files, 912 KB), built from the
tree into scratch outside it. It was rebuilt after the last product edit and is byte-identical (`diff -rq`
clean, dist1 vs dist3), so every painted row below reads the tree as it stands. Every browser row
identifies both arms by asset hash.

Payloads (all through the product codec, given-set read back on every arm):
- **P1**: `?board=ATMuNTMwMDcwMDAwNjAwMTk1…MDc5` (pass 5's classic deal, 51 writable).
- **P2**: P1 with rows 1 and 9 blanked (57 writable). Used for G0's second payload.
- **P16**: a real 16×16 payload (`\x01` + `4.` + 256 cells). It's a valid band-pattern solution with 86 seeded givens, 170 writable. It isn't unique, and the product's own hint engine speaks real hints on it.

The pass-6 number is the critic's.

## Gaps first

1. **The dark trace on the card's 2 px edge is still 2.575, and no colour can fix it.** Over the three painted dark grounds, the window is EMPTY:
   - the line (199) needs Y ≤ .1570;
   - the edge (44,43,41) needs Y ≥ .1727;
   - the best byte of any hue reaches **2.893** (33,120,165).

   The only other fix is to move the trace off the edge. That's FRAME_PAD, the chair's §6.2 row, and it isn't built here. So the claim is scoped: T9-B-ACC6-2 arm (b) carries the 2.893 as a stated number, and the ledger in `index.css` writes the impossibility down. HEAD reads 2.441 on the same edge.
2. **What the yield costs, and it's a design fork, not a cure.** When the voice needs the whole strip, the count gives up its line: it paints 0 px. That happens:
   - at 393×699 portrait with any hint up (9×9 or 16×16);
   - at 812×375 with a 16×16 column hint.

   So during those hints the lesson line is gone. How often that happens in real play isn't measured.
3. **The yield's edge cases aren't read.** Not tested: forced-colours, print, 200 % zoom, RTL. Also unread is whether the block's bottom-edge clip trims anything that paints below the block while the count is up. The one plausible case is the gold star on a 4×4 deal that solves inside the count's three writes.
4. **G10 WebKit is not shown over ≥ 5 runs.** A.6's mechanism lives in the grafted primitive (the forced end-write lands within 16 ms of the last gated commit). My three WebKit gated runs are green (worst 49.1–56.0/s), but I didn't measure the minimum gap. The cure is the leader's product row (A.6), and this tree carries the leader's `frontGate` verbatim.
5. **filter-census dark is 4/16 red on both arms**, inherited. It's `svg.crayon-heart.idle ⟨saturate(0.85)⟩` ×2 in G3.1d/G3.3d, both engines. Light is 12/12 on both. The deletion is the chair's first fold pick (chair §1.3).
6. **`check-pw-projects` / `test:e2e:projects` exit 1 on check 8 only** (filter-census floor 6 vs live 8, both engines). The control reads 0. It's declared: the chair restamps once at the fold. Check 6 was red too until this pass registered `front-rate.spec.ts` in `SPEC_MANIFEST`, as the leader's tree does.
7. **The undefined-token census exits 1 on one STALE ledger row** (`--refuse-dur`, §13's). It does the same on the control. A.1 ruling 4 says to read it as 0 findings + 1 declared, which is GREEN.
8. **Arm A is still an injected clone**, not a source arm. It's priced below, now with digits written.
9. **The #8f61f6 rung sits 0.7° off HEAD's hue** (293.4° vs #8b5cf6's 292.7°). The window holds an equal-minimum byte at 292.5°, `#8c64f1`, at lower chroma (C .202 vs .213). The lane took the charter's byte. It's stated here, not argued.
10. **Not read this pass:**
    - the count line's glyph-text AA (the §2.11 estate row, T9-R6 loop-local);
    - the r0 law-probe (R1–R3, L1–L6);
    - G0 anywhere but 1280×800 desk.

## Numbers

### Row 1 · the light trace's byte (§2.1): #8f61f6 @1 SHIPS, #8b5cf6 is the ballot's other arm

I searched the window before minting (`instruments/p6-window.mjs`, `readings/window.txt`; arithmetic on the painted grounds):
- **Light band for 3.0:** Y ∈ [.1921, .2301].
- **Light band for 3.10:** Y ∈ [.2002, .2210].
- **#8b5cf6** sits at Y .1980, just under the 3.10 band.
- **#8f61f6** is the band's balanced byte at Y .2104: line 3.227, edge 3.226.

Painted by differencing (`instruments/p6-trace.mjs`, the critic's c5-trace copied):
- Each pixel is read against itself with the trace hidden. Noise is **0 px in all 24 reads**.
- 8 legal writes, 1280×800, chromium + webkit, dpr 1 and 3.
- A second bare photograph per arm gave the same minima.

Results are the k 1 median, then (k .9 worst column, fraction of the k .9 core under 3.0), for the line / edge / paper grounds. Summaries are in `readings/trace-*-summary.txt` and `readings/trace-sensitivity.txt`.

| arm | chromium dpr1 | chromium dpr3 | webkit dpr1 | webkit dpr3 |
|---|---|---|---|---|
| **tree #8f61f6 @1** | 3.227 (3.024, 0) / 3.226 (.004) / 3.867 | 3.227 (3.006, 0) / 3.226 / 3.867 | 3.227 (3.013, 0) / 3.226 / 3.867 | 3.273 (3.198, 0) / 3.226 / 3.867 |
| #8b5cf6 @1 (arm, same page) | 3.072 (2.876, .051) / 3.388 / 4.062 | 3.072 (2.866, .164) / 3.388 / 4.062 | 3.072 (2.876, .046) / 3.388 / 4.062 | 3.117 (3.043, .008) / 3.388 / 4.062 |
| control #8b5cf6 @.95 | 2.876 (2.709, 1.0) / 3.177 / 3.760 | 2.876 (2.709, 1.0) / 3.177 / 3.760 | 2.883 (2.702, 1.0) / 3.170 / 3.751 | 2.946 (2.893, 1.0) / 3.170 / 3.751 |

**Sensitivity row, line ground, chromium dpr1.** Each cell is the fraction of the core under 3.10:

| k | #8f61f6 | #8b5cf6 |
|---|---|---|
| .5 | .356 | 1.0 |
| .7 | .221 | 1.0 |
| .9 | .031 | 1.0 |
| 1 | 0 | 1.0 |

- The antialiasing tail at k .5 is the same shape on both arms: .336 vs .369 of the core under 3.0.
- The edge fringe under 3.0 at k .9 is .002–.006 on every arm.

**The default does not lose to the control on the named statistic.** At the line median, the tree reads 3.227 and HEAD 2.876.

The ledger sentence "the ONE arm over 3.0" is **struck**. `--color-answer-mid` is #8f61f6, and its ledger row carries these painted numbers. The dark column of that row is arithmetic, labelled as such: the rung never ships at night.

**Dark, the tree ships the same rung as HEAD** (`answer-deep` #7c3aed), now @1:

| ground | tree | control |
|---|---|---|
| line | 3.275–3.299 (worst column 2.686–2.811) | 3.106–3.148 |
| edge | **2.575** | 2.441 |
| paper | 3.355 | 3.139 |

### Row 2 · T9-B-ACC6-1's second arm (§2.2)

`#9b74f7` (2.695 on the card's edge) is no longer offered. The second arm is `#8b5cf6` @1, which clears every ground over 3.0 at the median; its line reads 3.072. c1 is re-shot on the same payload and page, with one variable (the token), and it retires pass-5's c1.

### Row 3 · the dark edge (§2.3)

Written into the ledger (`index.css`, the WINDOW paragraph):
- the empty dark band (Y ≤ .1570 against Y ≥ .1727);
- 2.893, the best byte of any hue;
- the pointer to FRAME_PAD (chair §6.2) as the only geometric exit.

T9-B-ACC6-2 arm (b) carries it (chair §1.4). The dark-side crop is c2 (see Frames).

### Row 4 · the reserve is DELETED; the count YIELDS, keyed on the space (§2.4)

**The mechanism** (`MarginNote.vue`, prop `metaYields`; `GameBoard.vue` passes `!tally`):
- The meta line has **height 0**. Its text overflows a zero box and stays baseline-seated on the voice's row.
- The block has `clip-path: inset(-100vh -100vw 0 -100vw)`. That's flush with its bottom edge and open on the other three sides.
- When the pair fits, both show on one line.
- When it doesn't, the count wraps to a zero-height second row, the clip hides it, and the strip stays one line.
- The solve tally (DEBUG) keeps its old wrap.
- The portrait `min-height` reserve and its 9.1 px price are gone.

**The π, whole-DOM** (`instruments/p6-pi.mjs`; LAWS P5):
- Every element with a box is keyed by semantic ancestry and read for its y/x/h and computed paint. The in-run control-vs-control floor is **0 moved, 0 paint** at every cell and pose.
- Cells: 393×699, 812×375 and 844×390 coarse (`hasTouch`, coarse witnessed), and 1280×800 fine. Both engines, fill 0 and fill 2, payload P1. `logs/pi.log`.

What the lane moves against the control:

| surface | measured | owner |
|---|---|---|
| the column (`.masthead` … `.play-controls`, `.drawer-tab`, `.board-voice`) | **0 moved at every cell**. Pass 5 read −9.1/+9.1 at the phone | the deleted reserve |
| `SPAN.washi-label` ×8–14 | dy −0.44…+0.08, dh −1.13…+0.88 | the tape seed re-roll, declared in pass 4 at `SheetWashiLabel.vue` |
| `path.progress-trace` ×4 | geometry dh −348…−638 at fill 2; paint rgb(143,97,246)@1 vs rgb(139,92,246)@.95 | claimed: the front is geometry; the rung |
| `path.` ×2 (user-ink glyphs) | paint rgb(47,118,189) vs rgb(37,99,235) | claimed: blue has one job (pass 1) |
| `svg.sparkle-icon` ×1 | computed `drop-shadow(color(srgb .7686 .7098 .9922 / .3))` vs `rgba(196,181,253,.3)` | the same colour, serialized through `color-mix` (LAWS P4) |
| `P.margin-note-meta` | +1 node at fill 2 | claimed: the count |

**The yield, on P16** (`instruments/p6-yield.mjs`, `logs/yield.log`):
- Each run reads rest, then a hint write (the count lays down, "1 of 170 on the board"), then the product's REAL next hint with the count still up, then the widest pair emulated ("G goes nowhere else in this column" + "3 of 170 on the board").
- Every read is settled, and the floor between the two rest reads is 0.
- "px" is the meta's own paint: shown minus hidden, over its text rect.

| cell (both engines) | strip / tab, tree = control at every pose | count alone | real pair | widest pair |
|---|---|---|---|---|
| 393×699 coarse | 20.8 / 508.73 (webkit 508.42) | 1829 / 1782 px | **0 px**, second row, strip 20.8 | 0 px, strip 20.8 |
| 812×375 coarse | 21.97 / 159.67 at the voice (control identical) | 1829 / 1782 | **0 px**, second row | 0 px |
| 844×390 coarse | 22.09 / 167.23 (identical) | 1829 / 1782 | fits: 1828 / 1832 px | fits: 1882 / 1865 |
| 1280×800 fine | 23.61 / 398.45 (identical) | 573 / 579 | fits: 573 / 577 | fits: 591 / 595 |

The only elements that move from rest to the voice are 14, the same 14 on tree and control: the voice's own line.

**Born-RED, same run family** (`ABLATE=1`, `logs/yield-ablated.log`): the lane's own dist with the yield's two rules undone in-page.
- 393×699: the strip grows 20.8 → **38.98** and the tab moves −9.10 (1,516 / 1,644 elements move).
- 812×375: the strip grows 20.8 → **40.16** and the tab moves +9.10 past the control's 159.67.

This reproduces the critic's wrap (40.16) on a real 16×16 payload, and the yield is what holds it.

**The 6.4 px, reconciled under §7's ONE seating.**
- SIX's pass-4 `2lh` read the block's inherited line-height: 24 px (16 × 1.5 from `body`) against the voice's 20.8 (`--type-body` × `--type-leading-caption`). 2 × (24 − 20.8) = **6.4**. This is NOTE-ERASE's pass-6 row 8 as well.
- SIX's reserve is now **0 px** in every regime. The count asks the seating for nothing, which agrees with LEDGER's refusal of an in-flow reserve.

### Row 5 · the font census reads the five shapes (§2.5)

`check-font-coverage.mjs`, check 4:
- Tags are resolved, never read as written: HTML comments are stripped, a kebab tag becomes PascalCase, and the consumer's `import X from "….vue"` map turns an alias into its file.
- Unquoted values bind.
- A non-literal `v-bind="obj"` and a dynamic `v-bind:[k]` / `:[k]` red on any sink that paints one of its declared props, until pinned. A sink whose props can't be enumerated counts as painting.

`--self-test` has **12 red plants** (the six from pass 5, plus alias, kebab, non-literal `v-bind`, unquoted, `v-bind:[k]`, `:[k]`) and **5 green controls** (a commented binding, and non-painting sinks under alias and `v-bind`). Live discovery holds: `StagingBand :safe-verb / :saved-pair` true / true. It exits 0. On the tree, the census holds 21 pins, WRITEABLE == the hand cut, and it exits 0.

**Break test on the REAL file** (`instruments/p6-gate-plants.sh`: the critic's plants on a scratch mirror, run after prettier; `logs/gate-plants.log`):

| plant in `GameGallery.vue` | pass-6 exit | pass-5 script (the negative control) |
|---|---|---|
| CONTROL `<StagingBand :safe-verb>` | 1 | 1 |
| alias import `<Band>` | **1** | 0 |
| kebab `<staging-band>` | **1** | 0 |
| `v-bind="plantedProps"` | **1** | 0 |
| unquoted `:safe-verb=planted` | **1** | 0 |
| `v-bind:[plantedKey]` | **1** | 0 |
| CONTROL-GREEN, a commented binding | **0** | 1 (a false red, now cured) |

The mirror as it stands exits 0, and the restore is sha-checked.

### Row 6 · law 20's three doors (§2.6)

`check-theme-tokens.mjs`, the url arm:
- **(a)** A gradient `href` / `xlink:href="#solver-ink"` anywhere in src reds: a paint server wearing the answer's stops under another id.
- **(b)** A DYNAMIC `url(#${…})` on a paint property (`fill` / `stroke`, attribute, binding or CSS) reds. The estate's own dynamic ids are all `filter=` and stay green.
- **(c)** Every count runs on text with its comments stripped (`/* */`, `//`, `<!-- -->`), length-preserving so line numbers hold.

`--self-test`:
- 10 red url plants, on the REAL files for (a), (a′), (b) and (c): SvgFilters, GameControlPanel, HandwrittenGlyph.
- 4 green controls: the logo's dynamic `filter=`, the gradient file, the admitted file, and an e2e selector.
- It exits 0. The tree reads 0 offences.

Break test on the mirror (pass-6 exit · pass-5 script's exit):

| plant | pass 6 | pass 5 |
|---|---|---|
| CONTROL, panel re-aimed | 1 | 1 |
| A, href inheritance | **1** | 0 |
| B, `:stroke="`url(#${inkId})`"` | **1** | 0 |
| C, a comment keeps the count | **1** | 0 |

### Row 7 · the co-landing, PAID (registry-v5 §2.3)

**The graft is the leader's code, byte for byte.**
- `DifficultyTally.vue`, `gridPaths.poseFronts.test.ts`, `e2e/front-rate.spec.ts` and `e2e/rate-clock.ts` are sha-identical to ACC-FIVE's tree (`wf_f72f3b5a-83a-41`): 9c7899ca / 3c559e26 / f358ed02 / 145ec491.
- `gridPaths.ts` is FIVE's file with two comment words set back to "violet" (718/718 lines).
- `HandDrawnGrid.vue` takes FIVE's fill tween, `fillGate`, `joinGate` and `joinFront` by hand. The ink stays violet, with none of FIVE's gold, and it's the violet as this family ships it, not HEAD's.

**G10, bare, both engines, on the lane's dev server**, with the ablation in the same batch (`instruments/p6-g10-battery.sh`, `logs/g10-*.log`). Worst re-cuts per second, gauge / tally / join:

| arm | chromium | webkit |
|---|---|---|
| gated · driven 125 Hz | **0** · 126.6 Hz · 55.2 / 49.9 / 49.6 (tally 10.51 d/frame) | **0** · 125.0 Hz · 51.2 / 52.9 / 49.4 (9.38 d/frame) |
| gated · CLOCK=60 (negative control) | **1**: precondition, 59.9 Hz | **1**: precondition, 58.8 Hz |
| FRONT_MIN_MS → 0 · driven | **1**: 125.2 / 125.9 / 125.0 | **1**: 125.5 / 120.8 / 122.6 |
| FRONT_MIN_MS → 0 · 60 · PRECOND=0 (the pass-5 hole, shown) | 0: 60.2 / 60.3 / 60.1 | 0: 61.4 / 58.0 / 60.0 |

- The two extra gated·driven runs per engine are all exit 0: chromium 51.0/49.4/49.6 and 49.2/47.1/50.4; webkit 55.8/52.2/56.0 and 49.1/51.1/55.8 (`logs/g10-extra-runs.log`).
- The ablation edited `gridPaths.ts` in place. A trap restored it, and the sha1 check reads OK.

**The progressbar contract is ONE** (`instruments/p6-aria.mjs`, `logs/aria.log`, both engines):

| arm | fill 0 | fill 2 |
|---|---|---|
| tree | min 0 · max 100 · now 0 · text "0 of 51 on the board" | now 4 · "2 of 51 on the board" |
| control | "board 0% filled" | now 4 · "board 4% filled" |

### Row 8 · G0, run on two payloads (`instruments/p6-g0.mjs`, `readings/g0*-summary.txt`)

The instrument walks the gauge up the board's own writable count, at 1280×800 light, both engines, dpr 1 and 3, and reads the painted violet share against the requested fraction. The bound is ≤ 2 points, and the two engines within 2.

| payload | worst Δ | engine spread | stops |
|---|---|---|---|
| P1 | **+1.28 pts** (chromium dpr3, 75 %) | ≤ 1.1 pts | 1/13/26/38/51 of 51 |
| P2 | **+1.31 pts** | ≤ 1.15 pts | 1/14/29/43/57 of 57 |

- Every front is ONE subpath, with 11 → 494 segments, no `pathLength`, and dash `none`.
- `aria-valuenow` reads the percent (2/25/51/75/100).
- The CSS-form control (`pathLength=100` + `25 100` dash) paints 24.9–25.2 % in chromium and **97.8 %** in webkit. The falsified form, reproduced on this tree.
- The last stop is the win. There, the injected `opacity: 1` holds HEAD's 0.5 s bow-out so the ring can be counted.
- The copy's "4-subpath control" reads the live path and plants nothing, so it is **struck as a control**. The multi-subpath guard is the grafted unit (`gridPaths.poseFronts.test.ts`).

### Row 9 · Arm A with digits written (`instruments/p6-armA.mjs`, `readings/armA-summary.txt`)

The solution's digits are written in cells 72 and 73 (fill 2, count showing), then in 74 and 75. Prices are box intersections for the two count strings, "2 of 51" and the widest, "51 of 51 on the board" (ranges span them):

| cell | cells hit | cell-equivalents | glyph-box px², 2 written | glyph-box px², 4 written |
|---|---|---|---|---|
| 1280×800 fine | 72, 73 | 0.59–0.62 | 1,059–1,119 | 1,059–1,119 |
| 393×699 coarse | 72–75 | 1.79–1.87 | 910–917 | 1,365–1,386 |
| 844×390 coarse | 72–75 | 1.82–1.90 | 905–912 | 1,358–1,397 |

The numbers hold in both engines, within 2 px² (`readings/armA-summary.txt`). Pass 5's 0 px² was an empty-cell artifact. The margin line occludes 0 by construction.

### Row 10 · R6's heading census and R3's wobble: RUN, a third pass closed

The r0 probes were copied with OUT re-pointed (`instruments/r6-idiom.probe.ts`, `instruments/wobble.probe.ts`) and run on the tree and the control, both engines (`readings/r0-compare.txt`).

**R3 wobble:** all six JSON readings (9×9, 4×4, 16×16 × two engines) are **IDENTICAL** to the control's. R3-a reds identically on both arms (ring σ 0.092 px outside the band [0.722, 2.886]). That's §6's born-RED law, not this family's.

**R6 heading census:** everything is identical except two things.
- The four `.washi-tag` boxes differ by ≤ 0.7 px (the declared seed re-roll).
- In one chromium run, "Level" had a different colour. The probe deals its own unpinned board, and three more runs per arm read the colour following the dealt tier on BOTH arms (tree: orange / green / orange; control: orange / green / rose). That's a payload artifact, not a move.

### Row 11 · declared, not this lane's

- `filter-census` dark (gap 5): tree 4 failed / 12 passed, exit 1; control the same (`logs/filter-census-*.log`).
- Check 8 (gap 6).

### Units, types, copy

- **vitest, chunked by directory:**
  - pencil 9/83;
  - games 58/751;
  - composables 3/16.

  That's 70 files and 850 tests, 0 failed, each chunk exit 0 (`logs/unit.log`).
- **vue-tsc:** app 0, e2e 0. knip 0. check-property-block 0.
- **`check-copy-register` bare:** 0 on tree and control. This pass adds no product string.

### Pre-return battery (bare; `instruments/p6-battery.sh`, `logs/battery-EXITS.log`)

| gate | tree | control 74a2b5d9 |
|---|---|---|
| check-copy-register · lint-copy | 0 · 0 | 0 · 0 |
| test-font-coverage · lint-theme-tokens (self-tests) | 0 · 0 | 0 · 0 |
| lint-lanes · lint-sleep · lint-motion · lint-ink · lint-live-regions · lint-theme-selectors | 0 ×6 | 0 ×6 |
| test-e2e-projects · check-pw-projects | **1 · 1** (check 8 only, declared) | 0 · 0 |
| check-property-block (the chair's copy) | 0 | 0 |
| undefined-token census (the chair's copy, `--self-test`) | 1 (one STALE `--refuse-dur`, declared: net GREEN) | 1 (the same) |
| `eslint .` | **0** after scratch moved out (first run 1: see incident 1) | 0 |
| scoped prettier (`npm run lint`'s form, named) | 0 | 0 |
| vue-tsc app · e2e · knip | 0 · 0 · 0 | 0 · 0 · 0 |
| the WHOLE spec files the rows live in | `filter-census.spec.ts` 1 (dark, inherited) · `front-rate.spec.ts` 0/0 gated, both engines | filter-census 1 (the same) |

## Ballot rows (U-10, the owner disposes; both frames on one payload, one variable)

- **T9-B-ACC6-1 · the light trace's byte.** It's `#8f61f6` @1 (the default, ships) against `#8b5cf6` @1.

  | | line | edge | paper | line core under 3.10 at k .9 |
  |---|---|---|---|---|
  | `#8f61f6` | 3.227–3.273 | 3.226 | 3.867 | 0–.031 |
  | `#8b5cf6` | 3.072–3.117 | 3.388 | 4.062 | 1.0 (webkit dpr3 .014) |

  The default beats the control's 2.876. Frame: **c1**.
- **T9-B-ACC6-2 · the claim's scope.**
  - Arm (a): claim both themes, and carry the dark edge as open.
  - Arm (b): scope the claim to light plus dark line and paper, with the impossibility stated. The dark card edge reads 2.575 and no colour of any hue can exceed **2.893** there.

  Frame: **c2**, dark. Top is the shipped `answer-deep`. Bottom is the window's best byte, #2178a5. The best a colour can do still reads under 3.0, and it isn't violet.
- **T9-B-ACC6-3 · the count's place.**
  - The margin line (ships): 0 occlusion by construction. It yields its line when the strip is too narrow for the voice beside it.
  - Arm A, the bottom-left tag tape (injected): 0.59–1.90 cell-equivalents and 905–1,397 glyph-box px² once cells 72–75 hold digits.

  Frame: **c3**.
- **Fork (no frame; numbers): the count's yield against the pass-5 portrait reserve.**

  | | yield (ships) | pass 5's reserve |
  |---|---|---|
  | π at the phone | 0 | a standing +9.1 / −9.1 on every portrait session |
  | 812×375 with the widest pair | 0 | not reserved there; +18.2 on the strip |
  | cost | the count is invisible while a hint that doesn't fit is up | none named |

  The ablated arm of the same dist reproduces the reserve-less wrap: 38.98 / 40.16.

## Frames (3 crops, each ≤ 150 KB, each looked at by the author; one page and one variable per pair)

- `c1-T9-B-ACC6-1-arc-8f61f6-vs-8b5cf6-desk-light-chromium-fine.png`: 25,874 B · chromium · light · 1280×800 dpr2 · fine · P1, 8 legal writes.
  - Top is #8f61f6 @1; bottom is #8b5cf6 @1.
  - Seen: two near-identical violet arcs. The top reads a shade lighter.
  - **Retires** `prototype/ACC-SIX/c1-T9-B-ACC6-1-arc-shipped-vs-escape-desk-light-chromium-fine.png`.
- `c2-T9-B-ACC6-2-arc-deep-vs-best-any-byte-desk-dark-chromium-fine.png`: 24,693 B · chromium · dark · 1280×800 dpr2 · fine · P1.
  - Top is `answer-deep` #7c3aed @1; bottom is #2178a5.
  - Seen: violet against a steel blue on the same dark card edge.
  - **Retires** `prototype/ACC-SIX/c2-count-under-the-board-phone-light-webkit-coarse.png`, per the charter's "c2 retired".
- `c3-count-place-margin-vs-armA-digits-72-73-phone-light-webkit-coarse.png`: 51,730 B · webkit · light · 393×699 dpr3 · coarse (`hasTouch`, witnessed) · P1, with 3 and 4 written in cells 72 and 73.
  - Top is the margin line, "2 of 51 on the board". Bottom is Arm A injected, with the margin line hidden.
  - Seen: the tape sits over the written 3 and 4.
  - **Retires** `prototype/ACC-SIX/c3-count-place-margin-vs-armA-injected-phone-light-webkit-coarse.png`.

## r0 rows MOVED (PROPOSED diffs, never applied)

- **`r0/r6-idiom-history/hue-census.mjs`, the `--color-progress-ink` row.** The census reads a literal hex, and on this tree the token names its rung (`var(--color-answer-mid)`). So the literal read returns **NULL** in both themes and the census silently DROPS the token; the control reads #8b5cf6 / #7c3aed. The fix resolves one alias level: `instruments/r0-hue-census.PROPOSED.diff` (with `instruments/r0-hue-census.MOVED.mjs`, the copy it produces). With it, the tree reads:
  - light: #8f61f6, L .617, C .213, h 293.4;
  - dark: #7c3aed, h 293.0.

  **A correction to pass 5:** its README said r0's progress-ink rows "read the same hexes again". They didn't. The pass-5 tree carried the same `var()` shape, so the census dropped the row there too.
- **The r0 r2 hue-census anchors** (the sixth anchor): carried unchanged from `pass4/prototype/ACC-SIX/instruments/r0-hue-census.anchors.PROPOSED.diff`.
- **L19 / L21 (R6):** PROPOSED amendments, the chair's (pass4/CHAIR-RULINGS §1.3). Carried, unchanged.
- **Checked unmoved:**
  - the r0 R3 wobble probe: identical;
  - the R6 heading census: unmoved except the declared tape seed;
  - `r3-marks` probes: they read `.margin-note` / `.margin-note-ink`, and the count is `.margin-note-meta`.

## Replay route

None: the tree was advanced in place. At open, `git diff --stat` matched the pass-5 README's file list (16 files +1437/−111 + 1 untracked, `GameBoard.count.test.ts`).

At return it's **17 files +1900/−146 + 4 untracked**:
- `GameBoard.count.test.ts`;
- `gridPaths.poseFronts.test.ts`;
- `e2e/front-rate.spec.ts`;
- `e2e/rate-clock.ts`.

The new tracked file is `scripts/check-pw-projects.mjs` (one `SPEC_MANIFEST` line). The leader's files were copied (not merged) and checked by sha1 and line count as listed in row 7; FIVE's shas are unchanged from the moment of copy. `git status` at return shows product files only. Scratch (`.acc6p6/`, `.vite-cache-acc6p6-dev/`) was `mv`'d to `<scratchpad>/trash-acc6p6-1/`. The pre-existing ignored `test-results/` dates from Sep 19.

## Incidents

1. **`eslint .` read my scratch.** I placed the lane's vite `cacheDir` under `web/frontend/` rather than the worktree root, and `eslint .` read it: 172 errors, all in `.vite-cache-acc6p6-dev/deps/*`, plus the r0 probe copy in `.acc6p6/`. It was re-run bare after the scratch was moved out: exit 0.
2. **The G10 ablation edited the tree in place.** It set `FRONT_MIN_MS` 16 → 0 in `gridPaths.ts` on the lane's own dev server (FIVE's battery form). A trap restored it, and `shasum -c` reads OK.
3. **A dev port was taken.** The dev server first tried :4239, which was held by lane `wf_f72f3b5a-83a-39`. It bound :4243 instead.
4. **I edited `p6-yield.mjs` while its first run was executing.** That run was unclamped, with no row-2 flag. It is struck and re-run whole; its log was kept in scratch only.
5. **The first mirror break test ran on the pre-prettier scripts.** It was re-run on a fresh mirror after prettier, with the same exits.
6. **The first heading-census diff showed a colour change**, which turned out to be the unpinned deal (row 10). It was proven over three more runs per arm.
7. **I served the control dist on :4238** (preview only, its own config). No git was run in the control.
8. **Load averages were 47–67** during every browser row. G10's clock precondition held at 125–128 Hz on every driven run.
9. **Servers were killed by recorded PID:**
   - :4237 preview: 15038 / 15218
   - :4238 control: 15040 / 15246
   - :4243 dev: 19340 / 19408

   The band re-scan shows them free. No `rm` was used anywhere, and no `pkill`.

## Instruments (`instruments/`)

- `p6-common.mjs`: P1, P2 and P16, and the aria-label read.
- `p6-window.mjs`: the window, with Y bands.
- `p6-trace.mjs`: three grounds, differencing, a second photograph.
- `p6-pi.mjs`: whole-DOM π with a floor.
- `p6-yield.mjs`: the yield on P16, plus the ABLATE negative control.
- `p6-g0.mjs`: G0 on two payloads.
- `p6-armA.mjs`: Arm A with digits written.
- `p6-aria.mjs`: the progressbar contract.
- `p6-g10-battery.sh`: G10 and its controls.
- `p6-gate-plants.sh`: the critic's plants, re-pointed, with a pass-5 negative control.
- `p6-battery.sh`: the pre-return battery.
- `p6-crops.mjs`: the three crops.
- `p6-r0-compare.mjs`, `r6-idiom.probe.ts`, `wobble.probe.ts`: row 10.
- `r0-hue-census.MOVED.mjs`, `r0-hue-census.PROPOSED.diff`: the MOVED row.
- `oklch.COPY.mjs`.

Raw JSON stayed in scratch; `readings/` holds the classified summaries.
