# critique:G-INFO — T9-M16 "The 'i' button clicking does not properly scroll the panel"

Adversarial critic (Opus), non-author of the design and the prototype. The mark stays the owner's
(U-10); nothing here retires it. Verdict **ADVANCE as pass-5 charter rows**, convergence **74**, not
the prototype's implied "every gate green": G6 is unresolved and leans RED under load, and three of
the rows the prototype calls cured are local patches over estate-wide mechanisms.

## What I read and re-ran

- Diff in `.claude/worktrees/wf_3b66f064-970-17` (5 files, +164/−69) and its untracked evidence.
  The four crops c1–c4 plus m18. **I rebuilt the dist from the worktree's source into my scratchpad.
  It came out byte-identical to the lane's `dist-proto` (`index-et6XdBl4Bv9b.js`, `diff -rq` empty)**,
  so the served prototype is the source on disk.
- Served `dist-critic` on 4255 (listener PID 12552) and the lane's `dist-base` (built 19:04:20,
  before the first edit at 19:06) on 4256 (PID 12545). Both were killed by PID. The owner's 3001 was
  untouched. Load was 8–33 throughout, with one spike to 109. **Nothing below was read on a quiet
  box.**
- Instruments were my own, not forks of the lane's: `crit.mjs` (hit-test G1, G2, G3 rects on open
  AND close, π), `rest.mjs` (the Row B rest pose, held-press lift and note re-home), `ro.mjs` and
  `ro-ablate.mjs` (what the rung drives per frame, and frames per open).

## Re-measured (numbers first)

| row | prototype (critic's read) | HEAD control, same run | verdict |
|---|---|---|---|
| **G2** scrollTop Δ · scrollIntoView calls, open | **0 · 0** in 40/40 cells (chromium + webkit; 1280×800 and 1024×768 light, 1440×900 dark webkit; top and end; click and Enter) | top **+534/535** (1280), **+563/564** (1024), **+505** (1440 dark); end 0; **1 call every press** | **REPRODUCED** |
| **G1, independent** (elementFromPoint at every kbd/dd centre inside the scrollport) | **19/19** in 40/40; dl bottom **8.00 px** above the verbs | **0/19** in 40/40: the centres hit `.action-verbs` and its svgs, so the crib lies under the bar; dl bottom 84.6–92.9 px *below* the verbs row | **REPRODUCED**, and it closes a hole in the lane's own G1 (see H1) |
| **G3** verbs + "i" rect Δ, open **and close** (close unmeasured by the lane and the adjudication) | open 0–0.36 · close 0–0.36 px; close scrollTop Δ **0** in 40/40 | 0–0.36 (HEAD's own sticky settle from the end) | **REPRODUCED**. Close is now measured: the same stillness, and the "same clock reversed" claim holds for rects |
| **G4** π fine: card width / board-left | chromium 324.22/131.89 · 315.59/24.2; webkit 332.31/127.84 · 323.59/20.2 · 338/189 | identical to the hundredth | **REPRODUCED** at 1280, 1024 and 1440 (not 720 or 1728, and not coarse) |
| **G6** WebKit frames > 17.5 ms per open (pure rAF, no layout reads), 1280×800, interleaved, load 8–19 | median **1** (0–2), max dt median **20 ms**, n=8 | median **0** (0–2), max dt median **12 ms** | the lane's boundary read reproduced exactly. **Not green; see H2** |
| G6 under a load spike (109), n=10 | median **7** (0–9), **13** frames/300 ms, max dt median **66 ms** | median **2** (0–9), **28** frames/300 ms, max dt **28 ms** | **RED under load**: the pattern of Opus's 8-vs-3 comes back |
| rung's driver: `--action-bar-h` `setProperty` calls per open | **18–20** (webkit) · **25–26** (chromium) | **0** | **NEW**: an undeclared per-frame consumer (H2) |
| partial ablation (the card's three custom-property writes dropped after the press; publishFold's reads left in), same spike run | median **5** long frames, **22** frames/300 ms | — | the publisher is part of the cost, not all of it. Indicative only |
| webkit intermediate fold heights in the 200 ms rung (layout-reading sampler) | **5–15** (median ≈ 8 light; 13–14 dark 1440) | **13–17** | proto delivers about half the frames of the control in the same run |
| press cure: held press on "keys", card overflow-x · sticky bar lift | **0 · 0** both engines and themes | n/a | **REPRODUCED** |
| HEAD's latent note re-home (the lane's "source reading, unmeasured") | proto's Share note jumps **+60.6 (chromium) / +62.4 (webkit) px** on a held press | HEAD's Share note jumps **+79.1 / +81.9 px** | **NOW MEASURED**, and still live on the prototype's four siblings (H3) |
| viewport-law.spec (W2's six-row spine incl. §2.5 "no washi tape covers any interactive element" @1440, §2.2 short landscape) | **14/14** chromium, **14/14** webkit | 14/14, 14/14 | green. The lane never ran it (it ran only share-truth, zone-grammar, access and a11y 3.4) |
| copy register · font coverage (bare, worktree) | exit 0 · exit 0 | — | green |
| G7 source (`git grep scrollIntoView`) | one hit, a comment at :148 | — | green |

Row B at rest, the default ballot arm's closed pose, was **unframed by the lane**: all of c1, c2 and c4
show it open. It is now framed: `G-INFO-k1-webkit-light+dark-1280x800-fine-rowB-rest-vs-head-2x.png`
(webkit · light over dark · 1280×800 · fine · 2×, strip only; HEAD above each prototype strip). The "i"
sits in the verbs' grammar: 30 px in the hand, `--color-muted-foreground`, with the same ink as its
siblings in both themes (rgb 115,115,115 / 168,166,159). The box is 46×56 vs HEAD's 32×32. The
strip is still borderless in both arms; that is M18's row, not this lane's.

## Holes (checklist hits)

- **H1 · A gate that can't fail, for the prototype arm.** The lane's G1 reference is the same
  in-situ differencing after `scrollTop = scrollHeight`. For the strip arm, that scroll is a no-op:
  the crib rides the sticky bar. So the proto ratio compares the crib to itself 350 ms later. A crib
  that sits uniformly under an overlay (a bracket, a fade, a tape) would still read 1.0. HEAD's
  0.000 is honest, but the prototype's 0.995–1.026 proves stability, not visibility. The critic's
  hit-test (19/19 vs 0/19) is the independent reading. The e2e port CTRL-FACE writes must carry the
  hit-test, not the self-referenced ratio.
- **H2 · The pixel it moves that it didn't declare, and a gate read on its kindest box.** The
  move puts a 200 ms height tween inside the bar that `useResizeObserver(actionBarEl)` watches.
  Every frame of the rung now:
  - writes `--card-pad-b`, `--action-bar-h` and `--card-pad-t` onto `.controls-card`, which
    invalidates the style of the whole card;
  - runs `publishFold()`, a `querySelectorAll('.washi-tag')` walk with rect reads and a
    `getComputedStyle`.

  That's 18–26 publishes per open against 0 on HEAD, and neither the apotheosis nor the prototype
  names it. The lane's G6 "GREEN at the boundary" (1 vs 0) is the lightest-load read. The same
  instrument under load reads 7 vs 2, with half the frames delivered. **G6 is open and leans RED.**
  Before M1 (MOT-VERB's transform slide, a new mechanism) is escalated, the cheaper cure is a
  **settle-only publisher**. `scroll-padding-bottom` and the tag fold only have to be true at rest,
  so don't publish while `#keys-fold` is transitioning, and publish once on `transitionend`. The
  ablation above says that recovers part of the cost, not all of it. The residue (layout of an
  in-flow grow inside a sticky box, and WebKit's re-raster of the bar) is M1's case to answer on a
  quiet box.
- **H3 · Local patch over an estate mechanism (the elegant-reduction trap).** The press cure is
  `.action-bar .info-btn:active { transform: none }` plus children-scale, scoped to the fifth verb
  alone. The mechanism is every `.icon-btn:active`: a transformed button becomes its note's
  containing block. Measured on HEAD, Share's note jumps 79–82 px while pressed, and on the
  prototype it still jumps 60–62 px on the four uncured siblings. The ballot sells "a fifth verb in
  the strip's own grammar", but now its press differs from its siblings': the hover plate doesn't
  shrink on "keys", and it does on the other four. The cure belongs at `.action-verbs .icon-btn:active`
  for all five. That moves pixels on four verbs, so it's a declared π row for CTRL-FACE and
  MOT-VERB, not a silent exemption.
- **H4 · Consumer-less scaffold in shipped source.** `keysRingArm` reads `location.search` at
  component setup. There's a `.ring-arm` class on the bar, a second `<button class="info-btn">`, and
  ~30 lines of ring-arm CSS. The alt arm has π, AA, filter census and G8 all **unmeasured**
  (framed only, c3), and in c3 its open state is a colour shift alone, with no mark. The flag and
  one arm die at ballot 1. Until then this is not a foldable diff.
- **H5 · The constraint it forgot to order: G15 is visible, not only a number.** c2 (webkit · dark
  · 1280×800 · fine, open from the end) shows the next well's 4 px-outset brackets drawn beside
  the open crib's H/D/⌘ rows, reading as a frame around the crib. The right flank grows 41.6–64.8
  → 146.8–170.6 px. **Row A cannot land alone.** The TAPE/RULE slab-cover row is a precondition
  (the adjudication said "with or before"; the critic makes it an order, not a preference).
- **H6 · Instrument looser than the gate text.** G3 asks for "max per-frame step ≤ 1.35× the drawOn
  curve's *predicted* step". `probe.mjs` bounds each step by the curve's **peak** slope
  (`1/0.33 × h × dt / 200`) at every frame. That's a constant ceiling, so a late-rung jump at the
  flat end of the ease passes. The first battery's unexplained chromium reads (4.3–5.0 in the
  key-mode cells, 13.64 at 1024 end/key, 23.64 at 1440 top/mouse) exceed even that loose bound. The
  final-build 0.92–0.97 is 16 cells on a different load. The honest G3 is per-frame predicted step
  from the rAF timestamp against `cubic-bezier(0.33,1,0.68,1)` evaluated at t.
- **H7 · Copy has two sentences for one control.** The aria-label is "what the keys do", the hover
  note "what each key does", and the visible name "keys". Label-in-name holds, and both strings
  are plain (M16). But the parsimony rule says one sentence. That's the chair's or CTRL-FACE's pick,
  not a block.
- **H8 · The gate text vs the reading.** G11 was written "filters 9/9"; the lane read the route
  census 6/6 + 6/6, equal to the control. Identity holds; the gate's number is the budget total,
  not what a route mints. Re-word G11 to "route census = control, total ≤ 9".
- **H9 · Coverage the lane claims and didn't run.** The owner-facing e2e estate beyond the three
  touched specs: `a11y.spec` (only 3.4 ran), `affordances`, `drawer`, `masthead-alignment`,
  `visual-regression`. viewport-law is now green (14/14 ×2, above). The rest are unrun. Neither
  lane ran G5, G8, G10, G13 or coarse G4; the critic re-read none of them either, so they rest on
  the lane's single reading.

## Strengths (earned, not granted)

- The defect is cured at its mechanism, not its symptom. The critic reproduced it on both engines,
  from the top and from the end, by click and by Enter: HEAD 0/19 visible, +505…+564 scroll and 1
  call; prototype 19/19, 0 and 0. The source row is born RED on HEAD.
- π holds to the hundredth at 1024, 1280 and 1440 on both engines, from an independent
  instrument. Close is as still as open.
- The dist is byte-identical to the source. The lane found and attributed a new WebKit defect of
  its own make (the 17 px sticky lift) and reported the latent HEAD sibling honestly as
  unmeasured. It is now measured.
- It left no mechanic invented beyond the mark: the fold is moved verbatim, with no re-time or
  re-curve, and W2's publisher, berth and sticky are all untouched in formula.

## Open gaps (exact)

1. **G6 open, RED-leaning.** 1 vs 0 at load 8–19; 7 vs 2 at load 109. Never read on a quiet box.
   The settle-only publisher ablation comes before M1.
2. **Per-frame publisher.** 18–26 `--action-bar-h` writes plus `publishFold` walks per open, 0 on
   HEAD. Undeclared.
3. **Press cure scoped to one verb.** The estate note re-home is measured at 79–82 px on HEAD and
   60–62 on the prototype's siblings. The cure should sit on all five as a declared π row.
4. **`?keys-ring` scaffold in shipped source.** The alt arm's π, AA, filters and G8 are unmeasured,
   and its open cue is colour-only.
5. **The G15 bracket-beside-crib is visible (c2).** TAPE/RULE's slab-cover must precede Row A.
6. **G1's proto-arm reference is self-referential.** The e2e must carry the hit-test.
7. **G3's step bound is the peak slope, not the predicted step.** The first battery's chromium
   4.3–23.6 is unexplained.
8. **The B8 `#card-foot` arm is unbuilt,** so G1–G5 there are unread.
9. **No real Safari or iOS (M19).** Only headless WebKit.
10. **Coarse DOM delta:** a DOM or rendered tag-list ruling is owed by the chair.
11. **One control, two sentences:** aria "what the keys do" vs note "what each key does".
12. **G5, G8, G10, G13 and coarse G4 rest on one reading each.** a11y beyond 3.4, affordances,
    drawer and masthead-alignment are unrun.
13. **Ballot 2:** the owner's word was "scroll", and the prototype answers "no scroll". The owner
    disposes at the re-look.

## Charter rows this critique adds

- **CTRL-FACE:**
  - port the hit-test G1 and the open+close G3 into the e2e, with the publisher-blinded negative
    control;
  - kill `?keys-ring` with ballot 1;
  - move the press cure to `.action-verbs .icon-btn:active` as a declared π row (all five verbs);
  - one sentence for the control.
- **MOT-VERB / MOT-LADDER:**
  - a settle-only `--action-bar-h` publisher ablation as G6's first cure, re-read with the
    control in the same run on a quiet box;
  - M1 only if the residue stays above control median + 1;
  - G3 re-instrumented against the predicted per-frame step.
- **CTRL-TAPE / RULE:** the slab-cover row ORDERED before Row A (c2 is the frame); the foot-arm
  re-read.
- **Chair:** the kbd exemption; DOM vs rendered tag list; G11's wording.

## Hygiene

No commits, no stash, no install, no main-tree src/e2e/scripts writes. Ports 4255/4256 only, both
listeners killed by recorded PID. The one crop banked here is 31.6 KB. Raw JSON stays in the
critic's scratchpad and is not banked.
