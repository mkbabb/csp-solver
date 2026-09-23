# critique:G-MOTION — T9-M15 (the toggle's storybook flip) + T9-M19 (the board-selection glide)

Adversarial critic (Opus), non-author of the design and the prototype. The marks stay the owner's
(U-10); nothing here retires M15 or M19. Verdict **ADVANCE as pass-5 charter rows**, convergence
**64**. The M19 half is the real thing and it reproduces. The M15 half cures the cold flip it was
built for, but arm A fails its own guard (GB3) in a way the eye can see: the wordmark loses its
anti-aliasing in Chromium. The return also leaves out three things it moved: a horizontally
pannable page during the fold, six e2e specs rather than four, and a hold-first-frame on the unfold
that the apotheosis confined to the fold.

## What I read and re-ran

- The diff in `.claude/worktrees/wf_3b66f064-970-16` (8 files, +335/−100) and its untracked
  evidence: README, `prototype.diff`, the four crops c1–c4, the instruments and `numbers/`.
- **I rebuilt the dist from the worktree's source into my scratchpad. It came out byte-identical
  to the lane's `dist-proto`** (`diff -rq` exit 0, `index-BctY8-ppV5as.js`), so the served
  prototype is the source on disk. The control is the lane's `dist-base` (`index-ChSrVSqM0j8q.js`,
  built 19:04, before any edit).
- I served proto on 4253 (PID 21922) and base on 4254 (PID 21923), both on 127.0.0.1 with
  `--strictPort`. Both were killed by PID and no listener remains. The owner's 3001 (PID 20354)
  was untouched, and so were 4230–4249.
- Load averaged 12–17 throughout. **Nothing below was read on a quiet box.**
- Instruments were my own, not forks of the lane's:
  - `exit.mjs`: GA5/GA6 per rAF, measuring the card height, the board rect, the leave's position,
    scrollTop and encodes;
  - `ink.mjs` + `cmp.mjs`: GB3 at rest at PRM pose 0, painted bytes plus ink mass; GB2 on a cold
    first flip, counting `createObjectURL` image blobs, `href` mutations and **`style` mutations on
    `.boil-frame-bitmap`**, which closes the hole A2 opens in the lane's href-only counter;
  - `lift.mjs` + `pan.mjs`: the scrollport lift at a non-zero deck index, and whether the page
    pans during the fold.
- Every run used one encoded `?board=` payload, the lane's own (`ATMuNTMw…`, classic 9×9 codec
  v1). `lift.mjs` also ran `?game=futoshiki` and `?game=kenken`.

## Re-measured (numbers first)

| row | prototype (critic's read) | HEAD control, same run | verdict |
|---|---|---|---|
| **GA6** centre-card height while the deck leaves, webkit·dark·390×844·coarse(hasTouch), ×2 | **357.8 constant** (n=27/28) | min **130.3** from 357.8 | **REPRODUCED** |
| GA6 board-centre steps > 20 px after frame 1, same cells | **0**, max step 5.0 / 5.5 | **1**, **135.6 / 135.5 px** | **REPRODUCED** (the 135 px drop is gone) |
| GA6 chromium·light·1280×800·fine, ×2 | **407.9 constant** | min **104** | **REPRODUCED** |
| **GA5** exit, the first frame that moves vs the painted face | webkit 390: dCy **+9.8** / dW **+21.6**, both on the curve's direction at ≈8 % progress. chromium 1280: dCx +7.1/+9.5, dCy +2.4/+3.3, dW +14.9/+19.9, all ≈6 % along the face→rest vector | webkit 390: dCy **−38.1/−38.4**, dW **+53.8/+54.2** (against the curve). chromium: dCy **−32.6/−32.0**, dW **+37.8/+39.8** | **REPRODUCED**: HEAD pops, the prototype doesn't. My detector reads the first *changed* frame, so the prototype's frame 1 (= the face) is inferred from continuity, not read |
| exit frames > 34 ms (rAF) | 0 in all 4 runs, max dt 34 | 0, max dt 22 | parity |
| **GB2** cold first flip, 1280×800, encodes / href mutations / bitmap `style` mutations in +0…+1100 | **0 / 0 / 0** in all four cells (chromium + webkit × light + dark) | **16 / 8** / 0 in all four cells | **REPRODUCED**. My counter takes every `image/*` blob, so HEAD reads 16 here where the census, counting png and webp only, read 8 |
| GB1 (rAF, secondary) cold first flip max interval +0…+900 | chromium **18.5 / 10.7** ms · webkit **20 / 24** ms, 0 over 34 | chromium **141.2 / 165.4** · webkit **44 / 291** | **REPRODUCED** (cold only; warm and PRM not re-read) |
| **GB3** grid at rest, max channel Δ / px > 1 / px > 4 | chromium light **2 / 74 / 0**, dark **2 / 21 / 0**; webkit light **9 / 138,923 / 586**, dark **2 / 2 / 0** | reference | **REPRODUCED to the pixel. RED** against ≤ 1. The WebKit light grid is a whole-grid tone shift (ink mass −0.85 %), not edge noise |
| **GB3** wordmark at rest | chromium light **75 / 7,222 / 5,945** (px > 16: 2,668), dark **73 / 7,800 / 6,479** (px > 16: 4,325); webkit **14** both | reference | **REPRODUCED. RED, and VISIBLE** (k1): the same ink mass (ratio 0.9999) with stair-stepped edges. The lane's AA count 3,471 → 2,321 is the edge loss |
| **NEW · π** document `scrollWidth` during the enter fold | **1,872** at chromium 1280 (sudoku) · **1,603** at webkit 390 and at chromium 390 | **1,280 / 390** | **UNDECLARED MOVE** |
| NEW · the page pans during the fold (`scrollTo(400,0)` each fold frame, chromium·390×844·coarse) | **scrollX reaches 400** over 67 fold frames, then snaps back to 0 at the settle | scrollX 0 (not scrollable) | **RED**: a horizontal page scroll exists for 520 ms |
| NEW · the lift at a non-zero index (kenken, chromium 390 coarse) | scroll event at scrollLeft **0** at +296; centre card unchanged (kenken); scrollLeft restored to 1,217 | scroll event at 1,217 | benign **by construction**: `restingIndex` reads `targetScrollLeft` off rects the track translate holds still, so `syncFromScroll` sees the same index. At futoshiki and sudoku the gallery rests at scrollLeft 0, so the lift is a no-op there, which is every cell the lane measured |

The frames match their claims. c2 (chromium·light·1280·fine) shows the whole board over the card
and the staging band at +282. c3 (webkit·dark·390·coarse) shows the card holding at 358 px while
HEAD's collapses to 130. c1 (chromium·light→dark·1280·fine) shows HEAD's grid gone mid-flip at
+270 while the prototype's is already inked. c4's WebKit light panel shows **px > 1 = 138,923**
printed on the crop itself, while the README's table cites only "px over 4 ≤ 586". The crop is
more honest than the table.

## Checklist hits

1. **The constraint it forgot: M09 / quality.** Arm A's wordmark mask costs the wordmark its
   anti-aliasing in Chromium at rest: max Δ 73–75, 4,325 px over 16/255 in dark, stair-stepped
   edges visible at 3× (k1).
   - This is the logo LOW-RES family the owner marked on 2026-07-31, re-opened by a motion cure.
   - GB3 was the arm's own guard, and the brief's rung plan said that if A2 still reads RED, "the
     warm seam waits on 0.12.1". The lane shipped the logo on A1 anyway, because A2 "paints
     unmasked" on an SVG rect in WebKit.
2. **The pixel it moves that it did not declare (π).** The scrollport lift (`overflow: visible` on
   the x-scroller) turns the track's width into the DOCUMENT's scrollable overflow for the fold's
   520 ms: 1,280 → 1,872 and 390 → 1,603.
   - On a phone, a swipe that lands in the fold pans the page sideways, and it snaps back at the
     settle (measured scrollX 400 → 0).
   - On a desktop with classic scrollbars, a horizontal bar flashes and the viewport's height
     reflows mid-fold. That second part is not measured: headless hides scrollbars.
   - GC4 cannot see this, because it reads at rest.
3. **Undeclared deltas.**
   - `runFold` (the unfold) also runs `holdFirstFrame`. The apotheosis confined the pending start
     "for the fold only". On the exit, the first moving frame lands 34–39 ms later than HEAD's
     (chromium 99–102 vs 67–68 ms; webkit 116–117 vs 78 ms). One frame of that is my detector:
     the prototype's frame 1 sits on the face by design, so it doesn't register as a change. The
     remainder (about 26 ms at chromium's ~7.5 ms frames, about 22 ms at webkit's 16.7 ms) is
     latency the exit never asked for, read by rAF only.
   - The spec blast radius is **six**, not four: `visual-regression.spec.ts` (`image.boil-frame-bitmap`,
     ×5 sites) and `multiplayer.spec.ts:476,533` (`image.logo-pose-bmp`) are missing from the
     lane's list.
   - `src/probe/devicePaint.ts` (W8's boot-seam instrument) now counts HTML divs where it counted
     SVG images: its semantics moved silently.
4. **Masked fallback.** `Number(el.style.getPropertyValue("--live-fit")) || 1` (App.vue, the
   fold) is the JS twin of the `var(--live-fit, 1)` that GC1 deleted from CSS.
   - If the fit never landed, the division runs by 1 and the census's 92.7 px centre jump returns
     silently.
   - The @property law's point is that the failure is visible. The fold should refuse to run (the
     cut) on an unset fit, not fall back.
5. **Gates that cannot fail / void instruments.** Of the three NEW instruments the design
   demanded, two are void or vacuous by the lane's own admission:
   - GA7 does not discriminate at 1280;
   - GA8 never scrolls at 390×844 or 390×560;
   - the painted GA2 reads 1.0 on HEAD too.
   GA3's painted read exists for Chromium only (`GA3_painted: null` in every WebKit row), and the
   gate names both engines. The lane's GB2 "0 href swaps" cannot fail for the grid under A2,
   because the url lives in `style`. My `style`-mutation count closes that one (0 on the flip).
6. **Unverified gestalt.** Several reads are one engine only or not taken:
   - no WebKit painted-frame read of the fold (recordVideo was not analysed);
   - the unfold's wordmark rides a 0.72-size held bake up 1.39× for 520 ms and then re-bakes at
     the settle (4 encodes at +515 in one WebKit read). Neither the softness nor the landing frame
     was measured;
   - GB4's "filters during the fold" were recorded for the prototype only (13/15, equal to its own
     gallery rest), with no HEAD during-fold row to prove parity.
7. **The elegant-reduction trap.** "Ink is paint" is the right thesis for the grid, where the
   Chromium grid holds 2/255. But the hard part is the wordmark in both engines at once: A1 costs
   Chromium its AA, and A2 doesn't paint on an SVG rect in WebKit. That hard part was deferred by
   choosing A1, not solved.
8. **WebKit trade not claimed as a cost.** The warm theme flip in WebKit is about 5 ms worse than
   HEAD (36–37 vs 30–32 ms, 1 frame over 34 per flip), and PRM flips read 37–48 ms on *every*
   flip against HEAD's warm 32–35 (lane's numbers, not re-read).
   - The owner's device is Safari. Arm A buys the cold flip with a standing per-flip cost in the
     engine the owner audits on. That is the M15-b row, and it belongs in the ballot text, not
     only a gap line.

## Strengths (earned, reproduced)

- **The exit is cured.** The pinned leave (`position: fixed` at the rect read before the state
  flip) holds the centre card exactly, at 357.8 and 407.9 px, where HEAD collapses to 130.3 and 104.
  HEAD's 135 px drop at 390 coarse is gone, and the negative control (the leave in flow) brings it
  back. That's one mechanism with a working ablation.
- **The fold's geometry is right by construction.** Dividing the translate by the ancestor scale
  gives frame 1 at 0/0 in Chromium in every cell (lane) and a smooth first change in my reads.
  The drawer path is byte-identical at `parentScale = 1`, and drawer.spec reads 8/8 in both engines.
- **The cold flip is cured at the cause.** 16 encodes and 8 href swaps per cold flip go to 0, with
  no pencil-boil change, and the first flip's worst frame goes from 44–291 ms to 10–24 ms in both
  engines, reproduced.
- **The grid's A2 rung is honest engineering.** It measured WebKit's in-SVG mask re-render (idle
  worst frame 36 ms) and moved the grid to a CSS mask layer, which holds Chromium at 2/255 and
  WebKit dark at 2/255.
- **The code gates hold.**
  - `@property --live-fit` is registered in the first static stylesheet with initial 0, and the
    ablation shows an empty face.
  - The deal stagger and the gallery leave are homed on `MOTION`.
  - Zero rendered strings changed; lint:copy and lint:motion pass bare.
  - The fold z-order defect was found by the prototyper and cured fold-only.
- **The evidence discipline is good.** The source rebuilds byte-identical, PIDs were recorded and
  killed, and the crops name engine · theme · viewport · pointer. c4 prints the number that
  convicts it.

## Open gaps (exact, for the pass-5 charter)

- **G-M1 (M09, BLOCKS the logo arm)**: wordmark rest identity. Chromium max Δ 73–75 and px > 16 =
  2,668 / 4,325, with visible edge loss. Cure: find a wordmark ink path that holds ≤ 1/255 in both
  engines. Candidates are a mask sized in device px, a mask `<image>` with an explicit resolution,
  and the warm() seam on 0.12.1. Until one does, the wordmark keeps HEAD's theme-keyed bake and
  only the grid takes A2.
- **G-M2 (GB3 grid)**: WebKit light grid Δ 9 over 138,923 px, a tone shift of −0.85 % ink mass.
  Either earn ≤ 1 or take the tolerance to the chair as a ruled number. Nobody gets to pick the
  px > 4 threshold that makes it quiet.
- **G-M3 (π, undeclared)**: horizontal page overflow during the fold. `scrollWidth` goes
  1,280 → 1,872 and 390 → 1,603, and the page pans to scrollX 400. Cure candidate: `overflow-x: clip`
  on the lifted viewport (y left visible), in place of `overflow: visible` + `clip-path`. Gate: the
  document's `scrollWidth` equals `innerWidth` on every fold frame, both engines, 390 coarse. Add
  classic-scrollbar Chromium as a regime.
- **G-M4**: `holdFirstFrame` on the unfold. Either confine it to the fold (the apotheosis) or
  read the added exit latency (rAF says 22–26 ms beyond one frame) on painted frames and justify it.
- **G-M5**: the `|| 1` JS fallback on `--live-fit`. Remove it; an unset fit takes the cut.
- **G-M6**: the spec estate. Six specs select `image.*`: visual-golden, visual-regression, gallery
  CH-67, wordmark-integrity, multiplayer, and theme-bake-freshness (20 fails, which needs a
  painted-ink rewrite).
  - Patched copies are not the estate; the fold has to land its spec updates in the same commit.
  - devicePaint.ts's census semantics need a W8 row.
- **G-M7 (instruments)**: the missing and void reads.
  - GA3 painted in WebKit (recordVideo) is missing.
  - GA7 needs a discriminating metric at 1280.
  - GA8 needs a regime that actually scrolls: 844×390 landscape or the 568×320 floor, or a content
    height forced by a planted row.
  - GB4 needs its during-fold parity with HEAD.
  - The raster union ± 2 % during the fold was never measured.
  - GB6's stall injector was never built (carried).
- **G-M8**: the unfold's wordmark held bake. Measure its softness during the 520 ms (painted
  crop, max Δ vs its rest raster at matched scale) and the landing frame of the settle's 4 encodes,
  both engines.
- **G-M9 (M15-b, carried)**: the WebKit warm flip is +5 ms and the PRM flip is 37–48 ms on every
  flip. It goes in T9-B11/B12's ballot text as arm A's price, measured, and onto the W8 RUNSHEET
  as an owner-run iPhone row.
- **G-M10 (chair)**: the beyond-brief deltas, which are the scrollport lift and the fold z-order
  cure, and A2's structural tag change (grid `<image>` ×4 → `div.grid-ink` + 4 divs outside the
  svg; logo `<image>` → `<mask><image/></mask>` + `<rect>`).
- **G-M11**: vue-tsc and vitest last ran before the z-order cure (CSS only). Re-run them bare on
  the fold tree.
- **Not cured, pre-existing**: the poster exit (1 mover, a 632 px cut) is RED in both arms.
- **Scope of this read**: headless WebKit is not Safari, and no osascript was used.

## Convergence

**64.** The design points the right way and the M19 verbs are near-converged: GA1, GA5 and GA6
are reproduced, and GA2 is reproduced by the lane. M15's cold flip is cured and reproduced. It
isn't higher for these reasons:
- The arm's own guard (GB3) is RED, and in the wordmark the regression is visible and in the
  owner's estate (M09).
- One undeclared π move (page overflow) and one undeclared deviation (the unfold hold) survived
  the lane's own π gate, because that gate reads at rest.
- Two of the three new instruments are void, and GA3 is Chromium-only.
- The spec blast radius is under-counted.
- GB5, GB6 and M15-b are carried.

It isn't lower because every headline number I re-ran reproduced to within the load's noise, and
the ablations fire.

## Verdict

**ADVANCE**, as charter rows to MOT-VERB (the verbs: G-M3, G-M4, G-M5, G-M7, G-M8), MOT-LADDER
(`--live-fit` stays in the one @property block; G-M5), W6 (G-M1, G-M2, G-M9, the warm seam) and W2
(G-M3, the lift is W2's gallery mechanics). The logo half of arm A is **BLOCKED** until G-M1 reads
≤ 1/255 in both engines. The fold, the unfold and the grid's A2 advance.
