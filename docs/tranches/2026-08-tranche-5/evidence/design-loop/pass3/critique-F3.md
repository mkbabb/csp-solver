# CRITIQUE — pass-3 stage F3 (the carrier) · NON-AUTHOR ADVERSARIAL AUDIT · 2026-07-31

Subject: `pass3/f3-carrier-report.md` (the report is filed as `f3-carrier-report.md`, not
`stageF3-report.md` — no file by the ordered name exists). Order of record: `pass2-registry.md`
§2, the F3 carrier charter. Corroborating lane: `pass3/measure/RESULTS.md`.

**Everything below was re-derived on the tree, not read off the report.** What I ran, read-only,
against the repo at `5873a920` (clean before and after, nothing committed):

- `npx vitest run` → **332 passed / 31 files** — the report's number, exactly.
- `npx playwright test --list` → **101 tests in 14 files** — exactly.
- `npx vue-tsc --noEmit` → **0**; `npx knip` → **0**.
- The stage's own GATE-1, re-run by me: `dist-F3base` and `dist-F3head` served on :4931/:4932,
  `e2e/board-covisibility.spec.ts` against each. **4/4 green on head, 4/4 RED on base**, and the
  reds are the claimed reds — strip 51 (≤30), vignette `static` (≠`absolute`), landscape board
  672 vs 390, `.deal-row .difficulty-tally` count 0. This gate is not a decoration.
- Raw rig JSON (`rigF3/out-covis-*.json`) read directly: pageVh 1.750→1.705, band 51→21,
  `covisNeed` 260.13→229.73, `panelH` 558→558, landscape `squareH` 672→230 /
  `boardFits` false→true / `needChip` 399.27 against 390. Report §3.1–3.2 is faithful to disk.
- Two probes of my own (`scratchpad/probe-dealrow.mjs`, `probe-1280.mjs`), both engines, base vs
  head, 320/375/390/430/1280/1440 — the receipt-vs-verb question the report never measured, and
  the §4 rail claim it states without naming a cell.
- `stall-attribution-report.md:251` — the inherited constraint §0 leans on.
- The stage's own shots, looked at: `F3-head-land-844x390-page.png`, `F3-head-phone-664-well.png`.

Verdict: **the delivered work is real, well-gated, and independently reproducible. The ORDER is
not closed** — two charter rows were never touched and are not carried as open, the carrier's own
re-entry trigger is unmet by its own numbers, and the landscape rung ships a 3× regression on an
axis nobody instrumented.

---

## 1 · MARK 6 — the row assigned to me

**"The band DISSOLVED": NO. It shrank.** `out-covis-head-chromium.json` reports the band
`present: true`, `inFlow: true`, `h: 21` at every portrait cell (52→22 on iPad). The report's own
title says "keeps one tenant" and is correct; its §3 header ("the band dissolves") and the e2e
describe block (`mark 6 — the band dissolves`) are not. 30.4px of 51 left the page; a permanent
21px in-flow strip — MarginNote's reserved line — did not. The gate's ceiling (`offsetHeight ≤
30`) is a **one-tenant ceiling**, and it is the honest gate; only the prose around it overstates.

**"Co-visibility measured": YES, and thoroughly.** Nine cells, both engines, `regimeOk` from three
observables before any figure banks, a fine-pointer negative control that reports a different
number (1.177 vs 1.341), plus a real-MobileSafari arm in RESULTS §6.2 (1.711→1.621 on glass). The
verdict is stated as narrowly as the evidence allows, which is the register the loop asked for:
board + first tappable control on one screen is **met at every portrait cell and was already met
at base** (needDeal 624.13 → 593.73 against a 664 viewport — mark 6 widened the margin from 39.9
to 70.3px, it did not buy the property); the whole stack is **not met and not claimable** at 1.705
viewports; landscape misses by 9.27px.

**The tenants, checked one by one:**

| tenant | claim | my finding |
|---|---|---|
| tally → ticket | panel 558 → 558, "deleted, not moved" | **TRUE.** `panelH` 558 on both dists at every phone cell; the receipt rides Deal's grid cell, so the row's height is Deal's. The best move in the stage. |
| tally line → voice's line | `.margin-note-meta` loses its −0.2rem, block → baseline flex | **TRUE**, and it's 4 lines of CSS. |
| celebration → the board | `static` → `absolute`, docGrowth/ctrlPush 109.18 → 0 | **TRUE** — and I reproduced the base red myself (`static`, page moves >50px) inside the gate's own control. |
| height arm loses `lg:` | board 672 → 230, `boardFits` false → true | **TRUE, and see §2.1 — the price is unpriced.** |

---

## 2 · GAPS

### 2.1 BLOCKING — the landscape rung ships a 3× shrink on an axis nobody instrumented

`GameBoard.vue:211-217` unprefixes `max-w-[calc(100dvh-10rem)]`. Measured by me, both dists,
chromium, 844×390:

```
base  844x390  cell 74.22 × 74.22   board 672
head  844x390  cell 25.11 × 25.11   board 230
```

A 25.11px board cell. The estate's own coarse floor is 44px — Lane C spent a gate on it
(RESULTS §2: "smallest chip, coarse 390 → 44.0 / 44.0 GREEN") — and the report's fourth e2e row
gates `boardFits` while the thing inside the board that a finger has to hit drops **66%**. Portrait
cells are 40.22 on both dists, so the estate already tolerates sub-44 board cells; 25.11 is a
different order and it is **new this stage**. The report presents the rung as an unqualified win
("a board it can see, not one it must scroll") and prices nothing: no tap-target reading, no
legibility reading, no shot compared against base. Its own render
(`F3-head-land-844x390-page.png`) shows the trade plainly — a wordmark taller than a third of the
viewport above a board shrunk to fit under it, and the page still 2.533 viewports.

The alternative the stage did not weigh: at 844×390 the masthead, not the board, is what does not
fit. §5 half-concedes this ("landscape wants the ROW regime it has never had") and then ships the
board-shrink anyway, ungated on the axis it degrades.

### 2.2 BLOCKING — two charter rows untouched, and absent from "what is open, plainly"

The charter (registry §2) names four banked assets the carrier must consume — **`--vv-height`
anchor (flagged NECESSARY by B's G4 control, the fixed tray 100% occluded), the channel split,
`run()`-per-release, `drawerGlide ≡ vaul`** — and one measured constant, **the 296px keypad band,
not the 336 pass 1 assumed**. The report mentions none of the five. Not disposed, not refused —
absent. `grep` over the tree finds `useKeyboardViewport` already publishing `--keyboard-inset`
from T4-WM (App.vue:42), which is the pre-existing anchor, not a consumption by this stage.

The keypad question does not depend on a sheet: below 1024 the soft keypad occludes the control
surface whether or not anything glides. RESULTS §6.4 carries it — **NOT MEASURABLE this session,
the sim's keypad would not rise, the negative control vacuous** — and routes it to the owner. F3's
§8 "WHAT IS OPEN, PLAINLY" lists six rows and **not one of them is the keypad**. A section that
claims plainness must contain its own order's open rows; the measure lane should not be where a
stage's charter debt first appears.

### 2.3 BLOCKING — the trigger that re-entered F3 is still firing

Trigger (b) was the owner's ALL-mobile mark, uncured by every pass-2 lane. The carrier bought
**0.045 of a 0.705-viewport gap** at 390×664 (1.750 → 1.705; 1.800 → 1.705 against the seal). §5
and §8.1 say so honestly, and name the remaining lever as Lane C's uncashed T′ collapse. That
candour is worth a great deal and it does not close the row: the stage exists because the mark was
uncured, and the mark is uncured. Landscape co-visibility misses by 9.27px, also measured, also
unbuilt.

### 2.4 MAJOR — the solve tally now renders nowhere below 1280

Two independent edits compose into an undisclosed content deletion:

- `GameBoard.vue:767` — `MarginNote :quiet="celebrating"`, and `.margin-note-block.is-quiet` is
  `position:absolute; width:1px; clip-path: inset(50%)`. On the gold path the strip is sr-only.
  Pre-existing.
- `CompletionVignette.vue` — `.vignette-meta { display: none }` moves into the **base** rule this
  stage, restored only at `@media (min-width: 1280px) .completion-vignette:not(.is-docked)`.

Before 5873a920 the stacked rung's in-flow vignette displayed `meta` ("0 backtracks — 1ms").
After it, at every width below 1280 after a solve, the voice is clipped and the vignette's meta is
`display:none` — **the tally line is visible nowhere.** AT still gets it (MarginNote keeps its live
region), so it is not an a11y regression; it is a visual removal on exactly the mobile surface the
mark is about, and it is in neither the report, the commit message, nor a gate.

### 2.5 MAJOR — "suppressed inside the ticket only" describes a total removal

`.deal-row :deep(.dt-name) { display: none }`, and §3.3: *"the hover reveal of the technique name
is suppressed inside the ticket only."* The tally has no other mount — the diff deletes it from
`.board-margin` at **all** widths and adds it to both panel branches. `.deal-row` is its only
scope, so "inside the ticket only" is the whole estate, desktop included. The rationale (a child
that changes its box on hover re-bakes the `HandDrawnOutline`) is sound and inherited from the
stall lane; the scoping language is not, and it is the kind of softening the checklist calls a
masked fallback.

### 2.6 MAJOR — the single-tree claim is falsified by its own timestamps

The report's opening: *"Every figure below is single-tree: the last source edit, then one build,
then one run of everything."* On disk:

```
20:04:03  rigF3/out-vignette-head-{chromium,webkit}.json
20:09:55  dist-F3head/        (build-f3.log, same second)
20:11:17  rigF3/out-covis-head-chromium.json
```

The §3.3 celebration figures (`docGrowth 109 / ctrlPush 109.18` → `0 / 0`, the 7.68px inset) were
taken **5m52s before the artifact they are attributed to was built**. This is the named pass-2
offense verbatim (A's 05:53:45 edit after its 05:53:11 gate). The numbers survive — MEASURE re-ran
the probe at 20:35 on the final dist and got them back (RESULTS §6.1) — but they survive because
another lane rescued them, not because the stage's discipline held. Related, lighter: base covis
ran 19:42 and head 20:11, separate server sessions, not interleaved; geometry, so low risk, and I
reproduced the layout figures myself — but "interleave to split drift" is this pass's own rule.

### 2.7 MAJOR — blocker 5 is discharged on half its text

Pass-1 blocker 5 reads *"Mark 1 is not cured and D4's reorder regresses it."* §1 marks it
**REFUTED BY CONTENT ORDER** on `newGameIndex: 0`. That refutes the second clause — reveal-order
is dead by charter, so nothing can regress mark 1 by reordering. The first clause is live and the
pass's own measure lane confirms it: RESULTS §3.3, **Deal ranks 8th of 13 by rendered ink mass in
both engines**, the `difficulty` eyebrow 3.56× louder, F1's "dominant at 1.52–1.54×" refuted. F3's
table reads as if the charter's first line is fully closed. It isn't; the residue belongs to the
adjudicator and F3's report doesn't hand it over.

### 2.8 MAJOR — the rank census the stage's own shot contradicts

Blocker 6 is disposed with a census: *"2 eyebrow / 3 tape / 2 caption."* Open
`shots/F3-head-phone-664-well.png`: `size` is graphite, medium; `difficulty` is **green, visibly
larger and heavier**. Two eyebrows at one rank is the claim; two registers and two weights is the
render. RESULTS §8 names it and routes it to the adjudicator ("a rank claim that renders as two
registers"); F3, which shot the frame, does not.

### 2.9 MINOR — §4's rail numbers name no cell, and the red they narrate isn't banked

§4 cites `276.25 → 283.14`, a board walking `3.45px left`, and `board left 153.875`, with no
viewport and no element named, and `rigF3/railw.mjs` has no `out-*.json` beside it — the golden
red it describes is narrated, never written down. I reproduced the endpoints by guessing the cell:
at **1280×800**, `.controls-card` = 276.25 and `.board-shell.left` = 153.875, **byte-identical
base and head**, both engines; at 1440, 281.00 / 231.50, also identical; `scrollWidth == clientWidth`
everywhere. **The claim holds** — the shared-cell cure really does keep the receipt out of the
rail's max-content — but a reader can't check it without re-deriving the cell.

### 2.10 MINOR — two figures that don't agree with their own CSS comment

Report §3.3: ink lands *"7.68px inside the page's right edge."* `CompletionVignette.vue`, same
subject: *"lands inside the page (measured −5.76px)."* And the comment's *"clears the fixed z-60
sun's ink by 29px and 62px"* at 390×664 and 820×1180 has no counterpart in the report, which gives
a horizontal 726.4-vs-740 reading at iPad portrait instead. Different axes and different cells,
probably — but the pass's rule is that a number carries its regime.

### 2.11 MINOR — "detents GREEN by construction" is grep as sole witness on a vacuous gate

RESULTS §6.3 disposes sheet detents with `grep -rniE "detent|snapPoint|…|vaul"` returning zero,
and §9 books it GREEN. Nothing could have introduced detent machinery — no lane built any — so
the gate cannot fail, and grep-as-sole-filter-witness is a named pass-2 offense retired in
registry §4. Harmless in substance, and it is the measure lane's row rather than F3's, but F3's
retirement rests on it.

---

## 3 · WHAT IS GENUINELY STRONG

1. **GATE-1 on the new e2e spec is real, and I proved it rather than took it.** 4/4 red on
   `dist-F3base` with the exact expected reds; 4/4 green on head. Every row carries its control
   *inside* the run (clone a tenant back, pin the vignette `static`, strip the height arm), and
   the coarse rows assert three observables before banking. This is the pattern the estate wanted
   and the cleanest instance of it in the pass.
2. **Blocker 3 is the best small piece of engineering in the stage.** The defect was real and
   subtle — `pointerleave` never fires once the first `pointermove` grants implicit capture, so a
   200px drag over the divider still tripped the 350ms timer and flashed the answer key. The cure
   is the recognizer's missing half, 12 lines, both template branches. The unit gate dispatches
   real `MouseEvent`s **because** `trigger`'s options silently drop `clientX/clientY` in jsdom —
   the probe would otherwise have measured a pointer that never moved. One row is the control (a
   4px tremor still peeks). And it closes a spec-cites-itself circularity the pass-1 critique
   named: F3's own spec had settled the question by citing "the `useLongPress` idiom" for code
   with one consumer, `useGameCell.ts`, and no `pointermove` handler anywhere.
3. **The §0 retirement is honestly sourced, not invented.** Both legs check out: `#controls-drawer`
   is `v-if="rowRegime"` and absent below 1024 (I see it in the blockers JSON and in RESULTS'
   device row), and the per-gesture bill is the stall lane's own words —
   `stall-attribution-report.md:251`: *"any sheet substrate that changes the board's rendered size
   across a gesture re-bakes the grid and pays 150 ms on desktop, ~300 ms on an iPad, per
   gesture."* Retiring a deliverable on an inherited measured constraint is a legitimate ruling.
4. **The receipt costs nothing, and I checked the risk the report didn't.** One grid cell, two
   alignments: Deal `justify-self:center`, receipt `justify-self:end`. Measured base vs head, both
   engines: `.deal-row` width identical at every cell (264 / 319 / 334 / 374 / 225.03), card width
   identical, board left identical, no horizontal scroll — and verb-to-receipt clearance is
   **positive everywhere**, 37.5px at 320×568 down to 7.53px at the 1440 rail. The report never
   measured overlap; it holds anyway, including at 320 where nobody tested.
5. **No legacy aliases.** The `gradeTally` relay is deleted from `GameBoard` and all five per-game
   boards, the type import with it, five scenes re-routed, `vue-tsc 0` and `knip 0` verified by me.
   Two of five product files come out negative; the largest cure is three deleted `lg:` prefixes.
6. **The falsified alternatives are written into the CSS at the site** — the centred flex row's
   43px slide and `1fr auto 1fr`'s mirrored empty track, with their numbers, in `.deal-row`'s
   comment. That is the loop's own G6 lesson landing where the next hand will read it.

---

## 4 · FAILURE-MODE CHECKLIST

| mode | verdict |
|---|---|
| vacuous convergence | **PARTIAL HIT.** Blockers 1/2/4 are "dead by construction" — true readings of a tree that never contained the mechanism they describe. The report labels them honestly ("not fixed"), then counts the charter's first line as disposed without the substrate they were about. |
| spec-cites-itself | **CLEARED, and inverted.** The stage found the pass-1 spec's `useLongPress` circularity and cured the code it papered over. |
| gates that cannot fail | **CLEARED for the new spec** — I ran its negative control myself, 4/4 red. **HIT** for RESULTS §6.3's grep-only detent row. |
| elegant-reduction | **HIT.** The hard part — halving the 558px panel, or the landscape row regime — is named and deferred; what shipped is the 30px that was cheap. Named openly, still deferred. |
| legacy aliases | **CLEAR.** Verified: no dead prop, no orphan mount, knip + vue-tsc green. |
| masked fallbacks | **HIT (soft).** "Suppressed inside the ticket only" for an estate-wide removal (§2.5); "the band dissolves" for 51→21 (§1). No assertion was loosened — the one test-name edit (`mobile-platform.spec.ts`) changed a name and left both charges intact, which is the right way to do it. |
| unverified gestalt | **HIT.** The landscape rung shipped on `boardFits: true` with no reading of what a 25.11px cell is (§2.1); the two-eyebrow rank claim is contradicted by the stage's own shot (§2.8). |
| consumer-less substrate | **CLEAR by construction** — nothing was built. The inverse bites instead: the charter's four banked substrate assets have no consumer and no disposition (§2.2). |

---

## 5 · CONVERGENCE

Counted against the stage's own order — registry §2's carrier charter, eleven items, no averaging:

| item | state |
|---|---|
| blocker 1 ≥1024 handler leak | closed (dead by construction, with a reading) |
| blocker 2 inert dead-end | closed (same) |
| blocker 3 peek/drag D7 | **closed, cured, gated with a control** |
| blocker 4 pane scroll | closed (measured: 640/1076, overflow 436, tail reachable) |
| blocker 5 m1 regression | **half** — F3-specific clause void; "mark 1 not cured" live (RESULTS §3.3) |
| blocker 6 item-2 reproduction | **half** — census green, render shows two ranks (§2.8) |
| substrate carries B's ticket grammar / C's wells | **quarter** — not built; retired on inherited evidence, and the substitute carries §2.1 and §2.4 unpriced |
| consumes banked assets (`--vv-height`, channel split, run()-per-release, drawerGlide≡vaul) | **open, unaddressed** |
| keypad band 296px MEASURED | **open, unaddressed** (RESULTS: unmeasurable this session) |
| no new sheet motion until the ~280ms stall is attributed | closed — attributed by its lane, zero motion shipped |
| trigger (b): the owner's ALL-mobile mark | **quarter** — measured on glass and headless, 0.045 of 0.705 bought, not claimable |

**6.5 / 11 = 58%.** Banked at 34% entering pass 3, so the carrier moved — on the strength of one
genuine cure, one excellent gate, and an honest retirement. It is not a clean pass: three blocking
rows are open, two of them are charter items the report does not carry, and one is a shipped
regression the report does not know it made.

**For the adjudicator, in order:** (1) price the 25.11px landscape cell or fence the height arm to
portrait; (2) put the keypad band and the four banked assets on the open ledger where §8 should
have carried them; (3) rule on whether a carrier that buys 0.045 viewports has answered the mark it
re-entered for; (4) route §2.4's invisible tally and §2.5's estate-wide hover removal to whoever
owns the celebration's content.
