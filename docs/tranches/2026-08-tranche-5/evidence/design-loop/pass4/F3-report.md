# STAGE F3 — THE CARRIER, PRICED · pass-4 dossier

Tree: MAIN `/Users/mkbabb/…/CSC411_HW2_ProgrammingQuestion`, base `3969f512` (Lane A's pass-4
close), **head `52ef014a`, five commits, clean, nothing pushed**:

| commit | subject |
|---|---|
| `2791d437` | the solve tally gets one home, and it is never neither |
| `1095bd6b` | the landscape cap priced against the ladder, and paid for in cells |
| `ba2d39e3` | two rows for the two cures, each red on the build beside it |
| `f40399e3` | the receipt's hover reveal is retired in the open, not in a scope |
| `52ef014a` | the four banked assets and the keypad band, disposed row by row |

Rig `pass4/rigF3/` · shots `pass4/shots-F3/` · dists `pass4/dist-{F3base,F3head,noopCTRL,curveCTRL}`
· **every gate log banked** under `pass4/logs/F3/` (the final single-tree set in
`logs/F3/final/`, taken after the last edit on `52ef014a`). `frontend-design` invoked before
the visual work; its calibration here was restraint — the estate owns the aesthetic and the
deliverable is two constants and a mount rule.

---

## 1 · WORK-ORDER ROW 1 — THE LANDSCAPE RUNG, PRICED

**Shipped in the honest form, not reverted.** The ladder, on a built dist, both engines
identical to 0.00px, regime asserted from three observables (`rigF3/landladder.mjs`,
`logs/F3/landladder.log`). Candidate caps injected as `!important` on `.board-shell`, so every
row is the same build and only the constant moves. At **844×390**:

| cap | board | cell | fits | pageVh | board-top→first chip |
|---|---|---|---|---|---|
| none (pre-pass-3) | 672 | 74.22 | **false** | 3.667 | 841.27 |
| `100dvh − 10rem` (pass 3) | 230 | **25.11** | true | 2.533 | 399.27 |
| `100dvh − 4rem` | 326 | 35.77 | true | 2.779 | 495.27 |
| **`100dvh − 1.5rem` (SHIPS)** | **366** | **40.22** | true | 2.882 | 535.27 |
| `100dvh` | 390 | 42.88 | true | 2.944 | 559.27 |

*(The "none" row is faithful to the pre-pass-3 tree BELOW 1024 only — that tree kept the cap
behind `lg:`, so at ≥1024 it read 640, not 672.)*

**The 44px question, answered as asked.** ≥44px cells are **unreachable at 844×390 by any
cap**: a 9×9 at 44px is a 400px board and the viewport is 390 tall. Even `100dvh` — the whole
short edge — lands 42.88. The floor is a CONTROL tap-target rule (`.ctrl-btn` coarse
min-height) and has never bound a board cell; this estate ships 40.22 at 390 portrait and 32.44
at 320. It IS met where the device allows: 926×428 lands **44.44** at the shipped cap.

**What landscape co-visibility costs.** The chip needs the board under **220.73px → a 24.08px
cell**, 45% under the coarse floor and 40% under portrait parity. Pass 3's "misses by 9.27px"
was a near-miss *only because the board had already been shrunk to 230*. Bought at any usable
cell size, it is not available at 844×390 at all.

**Why `1.5rem` is the honest form and not another tuned number.** It is the page's own gutter —
the constant the WIDTH arm already spends. The rule reads: *the board is the short edge minus
the gutter, capped at the rung*, so a rotation cannot change the cell. 844×390 → 40.22, byte
identical to that phone's portrait cell; 740×360 → 36.88, its own portrait cell; 926×428 →
44.44. Inert at every portrait cell measured (390×844, 390×664, 320×568, 820×1180 read
identically with the cap on or off). `lg:` restores the row regime's 10rem verbatim — the
golden viewport's board is **640 with it and 672 without**, so ≥1024 is a golden subject and is
untouched.

**What it costs, disclosed and measured, not discovered later** (`logs/F3/masthead-844x390.log`,
shots `F3-p4-{base,head}-land-844x390.png`): pass 3's 230px board sat WHOLE above the fold
(bottom 342.58 of 390); this one overflows by **88.58px** — the last two rows a scroll away at
rest — and the page goes 2.533 → 2.882 viewports. Taken deliberately: the stack is a scroll at
both caps (neither shows board + controls), so the smaller board bought the board's own
whole-visibility at 15.11px per cell on the surface a finger spends the session on. And the
loss has a named cure that is not a cap: chrome above the board measures **114.58px, of which
the masthead is 98.58** — hand back 88.58 and portrait parity is whole above the fold too.
Landscape's defect is the masthead. Pass 3 §5 said that in words; it now has pixels.

**Gated**: `board-covisibility.spec.ts` — *turning the phone does not shrink the cell a finger
has to hit* (read at 844×390, rotate to 390×844, the two must agree; control re-injects pass
3's rung and the same probe must see the rotation cost cells). The landscape row is **renamed**
to what it proves: "a board no larger than the screen it is drawn on" — the old name claimed
more than `height ≤ innerHeight` ever said, and at this cap it is not true.

---

## 2 · WORK-ORDER ROW 2 — THE FOUR BANKED ASSETS + THE 296px BAND, ROW BY ROW

Every row disposed **in the tree, where the next hand reads it** — not in this file.

| row | disposition | where | witness |
|---|---|---|---|
| **296px keypad band** | **CLOSED, GREEN** | `useKeyboardViewport.ts` + `mobile-platform.spec.ts` | measured, below |
| `--vv-height` anchor | **RETIRED, trigger named** | `useKeyboardViewport.ts` | no fixed surface exists <1024 (blast §2.5); the sheet that needed it is retired |
| channel split | **BANKED, no consumer, trigger named** | `useFlipGlide.ts` | no gesture moves any element over a parked rest pose |
| `run()`-per-release | **CONSUMED — and never new** | `useFlipGlide.ts` | it is this engine's own contract (`run()` supersedes in flight) |
| `drawerGlide ≡ vaul` | **CONSUMED, now gated** | `visual-regression.spec.ts` | falsifiability proven, below |

**The keypad band needed no device.** The sim's soft keypad is not the mechanism —
`--keyboard-inset` is. Driven at the measured 296 through the visualViewport fake, composable
and all, on the built dist, both engines (`rigF3/assets.mjs`, `logs/F3/assets-base.log`):
page 1132 → 1424 chromium / 1131 → 1423 webkit (**+292 of the 296**, the 4px shortfall under
the 8px seating margin); the commit verb seats **fully visible** above the band with +8.05px;
the DEEPEST control seats clear too. Lane B's G4 charge — the verb 8.9px under the keypad at
max scroll — was a property of a FIXED tray; this tree's panel is in flow, so the band is a
scroll question and the scroll-room answers it. The gate's control stops the scene spending the
inset and the deepest control strands under the band. **This row is green on BOTH dists** — it
characterizes, it does not cure, and it says so.

**The glass curve's gate is falsifiable and was shown to fail.** `--ease-glassGlide` read off
the shipped cascade must equal `MOTION.curves.drawerGlide` (compared as numbers — engines
re-serialise `0.32` to `.32`, which is what the first cut of this row red on). Control: a copy
of the head dist with the CSS literal re-timed to `cubic-bezier(.4,.1,.2,1)` — the row **REDS**,
naming both values (`logs/F3/gate1-curve-control.log`).

---

## 3 · WORK-ORDER ROW 3 — THE SUB-1280 TALLY LINE: **RESTORED**

Two correct silences composed into a content deletion. `.vignette-meta` went `display:none`
outside the ≥1280 margin rung (right: a 7rem corner sticker would lay the tally across live
digits) while the strip went sr-only WHOLE on the gold path (right: the sticker is speaking).
One string, no mount left, at every width below 1280.

**The rule is one ref now, not two languages.** `vignetteHasTally` (= the margin vignette exists
and is undocked) decides which mount receives `meta`; the vignette's `display:none` /
`@media 1280 { display:block }` pair is deleted, because the prop decides and the CSS need not
say it a second time. `quiet` clips the **voice**, not the block, so the tally stays on the line
the strip already reserves — and that reservation moves to the block, so the strip is now the
**same height before and after the grade**, where it used to collapse at the crest and grow
back after it.

**Gated**: *a solved board prints its tally exactly ONCE, at every width* — a real solve, then
the paints are counted in both regimes (390×664 → `["strip"]`, resize to 1440×900 → `["vignette"]`),
plus the strip-height equality, plus an injected second copy as the control. The count gates
both directions: printing it twice fails the same assertion as printing it never.

The probe's own defect is worth recording, because it is the failure mode this loop keeps
naming: the first cut counted a rect wider than 1px, and the sr-only pattern leaves the child's
rect at full size — **it scored the exact defect it exists for as a pass**. It now intersects
the area against every clipping ancestor. GATE-1 on base: **0 paints where 1 is demanded**.
Visual witness: `F3-p4-base-phone-390x664-solved.png` (no line under the board) beside
`F3-p4-head-…` ("0 backtracks — 1ms" on its reserved line).

---

## 4 · WORK-ORDER ROW 4 — THE `dt-name` REMOVAL, RE-WORDED TO ITS TRUE ESTATE

**Decided in the open: the hover reveal is RETIRED, estate-wide, desktop included** — which is
what pass 3 shipped and called "suppressed inside the ticket only". `.deal-row` is the tally's
only mount, so a rule scoped to it was never a scope.

**The reading that decides it**, measured at the 1440 rail, both engines, reveal expanded to its
old 16ch (`logs/F3/assets-base.log`): verb→receipt clearance **+7.53px → −103.53px**. The name
lies across Deal. The rail does NOT move (card 281 / board left 215.5, byte-identical) — the
shared grid cell holds — so this is occlusion, **not** the max-content walk the pass-3 §4
comment would have predicted, and the report says the hypothesis it falsified. In the board
margin the reveal had an empty margin to open into; mark 6 moved the tally out of the margin.

The dead markup goes with the ruling: the span, its transition, its three-selector hover rule,
its PRM arm, the `:deep` suppression. The exact hardest step still names itself at **every
width with no gesture at all**, in the tally's `aria-label`. `TallyDescriptor.expand` keeps its
tested home in `techniqueVoice.ts` and has, from here, **no renderer** — stated where the markup
used to be, because an undisclosed consumer-less field is how this loop got here.

**Gated as a durability bound, not a red/green** (there is no behaviour change to gate): the
receipt keeps off the verb at rest AND on hover, and the receipt's own width does not change.
Its control injects a growing child under a **neutral class**, so it fires on the pre-retirement
build too — a control the old `display:none` would have swallowed proves nothing.

---

## 5 · MARK 6's SPIRIT — THE BAND STAYS DISSOLVED, CO-VISIBILITY RE-PUBLISHED ON THE FINAL TREE

`rigF3/covis.mjs`, the stage's own metric set, both dists, both engines
(`logs/F3/covis-p4{base,head}.log`). **Every cell is byte-identical to the pass-3 close except
the one this stage touches.**

| cell | pageVh base → head | band | board | board-top→chip | co-visible |
|---|---|---|---|---|---|
| 390×664 THE CASE | 1.705 → **1.705** | 21 flow | 366 | 531.98 | YES |
| 390×844 | 1.341 → 1.341 | 21 flow | 366 | 531.98 | YES |
| 375×812 | 1.401 → 1.401 | 21 flow | 351 | 516.98 | YES |
| 430×932 | 1.258 → 1.258 | 21 flow | 406 | 571.98 | YES |
| 820×1180 iPad P | 1.212 → 1.212 | 22 flow | 672 | 841.14 | YES |
| **844×390 land** | **2.533 → 2.882** | 22 flow | **230 → 366** | **399.27 → 535.27** | no (both) |
| 1280×800 rail | 1.012 → 1.012 | 24 ovl | **640 → 640** | 129.45 | YES |
| 1440×900 rail | 1.000 → 1.000 | 24 ovl | 672 | 123.45 | YES |
| 390×844 fine NEG CTRL | 1.177 → 1.177 | 21 flow | 366 | 517.38 | YES |

The band is 21/22px and in flow at every portrait cell, both trees — **dissolved to its one
reserved line and it stays there**, now carrying the tally on that line rather than collapsing.
The iPad coarse card (1280×800, panelH 1068) is untouched by this stage; the pass-3 deploy
gate's ≤1098.25 row is not mine to move and I did not move it.

---

## 6 · GATES — one run each, on `52ef014a`, after the last edit (`logs/F3/final/`)

vue-tsc **0** · vitest **332 / 32 files** · eslint **0** · knip **0** · prettier(`src/`) **0** ·
`test:font-coverage` **0** (2 faces: Fraunces 28cp, Patrick Hand 46cp) · `lint:ink` **0** ·
`test:golden:bytes` **0** · `npm run build` **0**.

**GATE-1** (`dist-F3base` :4903 vs `dist-F3head` :4904, the three specs this stage touches):
**base 2 RED / 25 green · head 27 / 27**. The two reds are the two cures, at the numbers this
stage banked — 0 paints where 1 is demanded, 25.11 against 40.22.

**Default e2e** (vite preview :5313, built dist, `PLAYWRIGHT_BASE_URL` explicit): **114 / 115**.

> **The one red is inherited, and the attribution was run, not asserted.**
> `gallery-deal.spec.ts:432` ("a same-game deal issued BEFORE the scene mounts") fails on
> `.futoshiki-cell` count 25 where 0 is demanded — its "still resolving" precondition does not
> hold on this machine. Control: the tree stashed back to `3969f512`, rebuilt, served through
> the same vite preview — **the same row fails identically** (`logs/F3/e2e-galleryrace-basetree-preview.log`),
> and it fails on both static-server ports too. **Lane A's row, routed, not mine.**

**Built-dist lane** (:4188, orphans killed before and after): **16 / 16** — filter-census 3
(zero new filtered surfaces), theme-bake-freshness ×4, wordmark, throttled-void.

**Goldens** (built dist only, never re-baselined): `cell-light`, `grid-corner-light`,
`logo-light` **green on every run of every tree** — Lane D's darwin re-mint holds and my board
cap is invisible at the golden viewport. `toggle-crest-dark`, the standing non-convergent
pose-stack subject, interleaved this session:

| tree | red / runs |
|---|---|
| base `dist-F3base` (pass-3 close) | **0 / 7** |
| **no-op control** — the pre-edit tree + ONE comment byte in `scene.css` | **3 / 14** |
| head `dist-F3head` | **5 / 14** |

The no-op arm is the one that decides it: a tree whose semantics are **identical to base** reds
the subject 3/14, so the red is not attributable to any semantic change, and head's 9 greens
prove the baseline is reachable on head (no structural pose shift; the diffs run ~0.03 of
pixels against a 0.017 darwin soul floor — a captured beat phase, not a pose). Nothing
re-baselined. Routed to the team-lead row that owns the sun-crest clause, **now with rates
instead of a single red**.

Ports: rig static servers :4903/:4904/:4905/:4907, vite preview :5313, built-dist lane :4188
(killed before and after). **:4894 / :4895 / :3000 / :3001 / :4288 untouched.** Nothing pushed,
nothing deployed.

---

## 7 · LOC

Product code −40 / +18 net **−22** across six files (`DifficultyTally` −26, `GameControlPanel`
−6, `CompletionVignette` −4, `MarginNote` +2, `useControlsDrawer` +4, `GameBoard` +2 —
the landscape cure is **three Tailwind tokens**); tests +198 (three new rows, four controls,
one extraction that removes a 25-line copy before it is made). Everything else is comment, and
the comments are where the falsified alternatives and the prices live.

---

## 8 · WHAT IS OPEN, PLAINLY

1. **Landscape's board overflows the fold by 88.58px** against a 98.58px masthead — the cure is
   the masthead, not a cap, and it is now a number rather than a wish. Open, ledgered at the
   cap's site.
2. **The whole stack is still 1.705 viewports at 390×664.** Unmoved by this stage — the lever
   is Lane C's uncashed T′ collapse, and trigger (b) does not close on my account.
3. **`toggle-crest-dark`** — rates above; team-lead row, sun-crest clause.
4. **`gallery-deal.spec.ts:432`** — inherited red, attribution run, Lane A's row.
5. **`TallyDescriptor.expand` now has no renderer** — disclosed at the site. A later hand may
   delete it from `techniqueVoice.ts` (5 unit rows move with it); I did not widen a CSS ruling
   into five games' shared voice.
6. **No on-device cell in this lane.** Two headless engines agreeing to 0.00px is geometry. The
   landscape cell especially wants one real rotated iPhone — owner row 2 in the registry, third
   pass carrying it.
