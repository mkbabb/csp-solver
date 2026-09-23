# prototype:G-INFO — T9-M16 "The 'i' button clicking does not properly scroll the panel"

The mark stays the owner's (U-10). Nothing here retires it. This is the adjudicated apotheosis
(`adjudicate/G-INFO.md`) built from source for the first time and measured against the HEAD control
in the same runs. It becomes pass-5 charter rows for CTRL-FACE, CTRL-TAPE/RULE, MOT-VERB/LADDER and
MRK-ABS.

- **Tree:** worktree `.claude/worktrees/wf_3b66f064-970-17`, cut from `b9ba5c42`. That commit is
  docs-only on top of `1e6cfbbf`: `git diff --stat 1e6cfbbf b9ba5c42 -- web csp-solver` is empty.
  Nothing was committed. The source diff is `prototype.diff` in this folder.
- **Served:** both arms are built dists under `vite preview` on 127.0.0.1 with `--strictPort` and a
  private cacheDir (`web/frontend/.intake/build.mts`):
  - the prototype `dist-proto` on 4255, listener PID 17795;
  - the HEAD control `dist-base` on 4256, listener PID 17796. It was built before the first edit.

  Both listeners were killed by those PIDs before return.
- **Box:** loaded throughout. Load average was 18–42 for the desk battery and 6–13 for the final
  rate read. Other projects' Playwright workers were running. Nothing was read on a quiet box.

## What was built (web/frontend)

`src/games/shared/GameControlPanel.vue`:

1. **Row A.** `#keys-fold` moves out of the card body and becomes `.action-bar`'s first child, with
   `grid-column: 1 / -1`. The fold's CSS stays as it was: `0fr→1fr`, `clip-path: inset(0)`,
   200 ms `var(--ease-drawOn)`, and `transition: none` under PRM. The bar's grid becomes
   `1fr` (the trailing track dies).
2. **toggleKeys.** It is now the `keysOpen` flip alone. `nextTick → scrollIntoView` is deleted,
   along with the `nextTick` import. The false comment at `:143–146` is rewritten.
3. **Ballot 1, default arm (Row B).** The "i" becomes a fifth `.icon-btn` inside `.action-verbs`:
   - glyph "i" in `--font-hand`, set in the `--icon-verb` box;
   - sublabel "keys";
   - `SheetWashiLabel` note "what each key does" on seed 89. Seeds 23/43/37/71 are the verbs and
     73 is the berth note.
   - The `.info-glyph` ring rules are deleted.
   - Open state: `--color-foreground`, plus `scribbleUnderline(107, ink)` as an out-of-flow
     `::after` under "keys". It moves no box, so the bar height holds.
   - The `(hover:hover) and (pointer:fine)` gate and `v-if="!mobile"` are kept.
4. **Ballot 1, alt arm, behind the `?keys-ring` query flag.** This is PROTOTYPE SCAFFOLD. The flag
   dies with one arm at the ballot. The trailing `1fr auto` track is kept, and the ring is
   `HandDrawnOutline` with stroke 1.5, outset 2, radius 14, pose 0. It was framed only (c3).
5. **The press cure (found by this lane, not in the brief).**
   `.action-bar .info-btn:active { transform: none }` and `> :not(.washi-label) { transform:
   scale(.93) }`. The 0.93 is unchanged; it now lands on the children rather than the box. See
   §Finding.

Also changed:

- `src/pencil/chrome/KeyboardLegend.vue:63`: the comment now reads "inside the strip, above the
  verbs".
- `src/games/shared/GameControlPanel.test.ts`: one new row (G7). The fold is the bar's first child
  and a press makes 0 `scrollIntoView` calls. It is **born RED on HEAD's source**, verified by
  mounting HEAD's `.vue` under the same row: `expected '' to be 'keys-fold'`. The share helper
  now excludes `.info-btn`.
- `e2e/share-truth.spec.ts:54`: "Share is the last verb" is re-addressed as
  `…button.icon-btn:not(.info-btn)`.
- `scripts/check-font-coverage.mjs`: "what each key does" and "keys" are declared in the hand
  corpus. The derivation gate had red on the new tape, and neither string needs a re-cut.

Not built, per the brief: M18's edge, slab widening, `#card-foot`, `scene.css:264`, and any
re-time or re-curve.

## Gates: numbers first

The full grid:

- engines: chromium + webkit;
- fine rungs: 1280×800, 1024×768, 1440×900, 1280×720, each × light, from the top and from the
  end, pointer click and keyboard Enter;
- plus 1280×800 dark and 1280×800 PRM (both starts × both modes), and 1728×1117 (top, pointer);
- DPR 2.

That's 50 cells per arm (`desk-*`). A 16-cell subset per arm was re-read on the final build after
the press cure (`desk2-*`). Every row below ran the HEAD control in the same script.

| gate | prototype | HEAD control (same run) | verdict |
|---|---|---|---|
| **G1** crib `<dl>` painted-visible fraction at press+700 ms (paintedExtent differencing: shown vs `visibility:hidden` in situ, over the same differencing with the crib scrolled fully into view) | **0.995–1.026** in 66/66 cells, both engines (see note a); dl bottom **7.99–8.01 px above** the verbs row | **0** painted px in every non-PRM cell (0/9703 … 0/12808); dl bottom 84.5–96.5 px *below* the verbs row. PRM: 1.000 (census ablation reproduced) | GREEN |
| **G2** panel scrollTop Δ · `scrollIntoView` calls | **0.00** in 66/66 · **0** | top: +534/535 (1280×800), +563/564 (1024), +504/505 (1440), +614/615 (720), +507/508 (1728), chromium/webkit; end: 0; PRM +636/641 · **1** per press | GREEN |
| **G3** verbs + "i" rect Δ per frame · top-edge trace | final build: **0–0.16 px**; trace monotone, **0 px reversal**; settle **168–205 ms** after the press (budget 200 + 2 frames ≈ 233); max step ≤ **0.64–0.97×** the drawOn peak-slope step in every webkit cell and every final-build chromium cell. PRM: **0 intermediate heights**, settle 2–62 ms | rects 0–0.36 (HEAD's own sticky settle from the end); trace n/a (grows under the bar) | GREEN, with notes b and c |
| **G4** π, fine | card width, card left and board left **Δ 0.00** at all 10 fine cells: chromium 324.22/131.89 · 315.59/24.2 · 330/193 · 324.22/171.89 · 339.69/332.16; webkit 332.31/127.84 · 323.59/20.2 · 338/189 · 332.31/167.84 · 347.81/328.09. Closed bar 64.81/64.28/65.16/65.75 identical | same numbers | GREEN (1024 and 1728 now measured) |
| **G4** π, coarse (1280×800 `hasTouch`; 390×844 and 430×932 `hasTouch`, dock sheet open and polled settled ≥ 700 ms) | rendered strip tag list **equal**, computed paint delta **0** over 17 properties × 40/35/35 nodes, both engines; bar **64.81 / 66.77 / 66.77** | same | GREEN on rendered nodes. The unrendered DOM differs by construction: on the coarse rail, the 0 px fold and its `<dl>` now live inside the bar, and `button.info-btn` carries `icon-btn group`. Both are `display:none` or 0 px there. |
| **G5** Tab walk over the card body, crib open | **0/16** in 14/14 cells; `scroll-padding-bottom` = published `--action-bar-h` (223 / 227 / 220 / 223 / 225 / 229 / 233 = ceil(open bar + 56 px pad)) | 0/16 | GREEN. Negative control with the publisher blinded (spb pinned to the closed 121/122): **5–8/16** occluded |
| **G6** WebKit frames > 16.7 ms per open (Opus's counting: dt > 17.5 over 1.2 s), presses interleaved arm by arm, n=12 webkit / 10 chromium, final build | webkit median **1** (0–2); > 25 ms 0; longest median 19 ms. chromium 0 (0–1) | webkit median **0** (0–3); longest median 13 ms. chromium 0 (0–1) | **GREEN at the boundary** (1 ≤ 0 + 1), on a box at load 6–13, **not quiet**. See note d. |
| **G7** source | `toggleKeys` = the flip; the only `scrollIntoView` left in the file is inside a comment (`:148`); `#keys-fold` is the bar's first child; comment rewritten | — | GREEN (unit row born RED on HEAD) |
| **G8** CSS borders inside `.action-bar` | only `kbd` × 12 (1 px chromium / 1.5 px webkit computed): the named exemption | `.info-glyph` 1 px chromium / 1.5 px webkit | GREEN with the exemption (the chair's row). The ring arm isn't censused. |
| **G9** a11y 3.4 (`-g "3.4"`, 2 tests) | **2/2 chromium, 2/2 webkit** | 2/2, 2/2 | GREEN. `aria-controls="keys-fold"` resolves (unit row + DOM) |
| **G10** painted AA at 2× (modal bg, median ink) | dd **5.16 / 5.24** light, **5.96 / 6.07** dark; kbd **3.53** light, **4.35–4.36** dark; "keys" at rest **4.66** light / **7.68** dark; open **19.22–19.45** / **15.84**; "i" at rest 4.66 / 7.68 | ringed "i" at rest: median 3.30 (chromium) / 3.53 (webkit) light, 4.35 / 4.36 dark | GREEN. "keys" at rest clears 4.5 by 0.16, the same ink as the four sibling sublabels (4.66). |
| **G11** filter census (`filter-census-{chromium,webkit}`, served dist) | **6/6 + 6/6** (G3.1 equals `filterBudget.ts` exactly, area and all) | 6/6 + 6/6 | GREEN |
| **G12** `check-copy-register` bare | exit 0 (0 dashes, 0 unadmitted jargon); self-test 0 | — | GREEN |
| **G13** content band, crib open (sticky arm: clientHeight − open bar) | 1280×800 **441.39 / 437.39**; 1024×768 **412.86 / 409.00**; 1440×900 **471.11 / 467.19**; 1728×1117 467.2 / 463.2; **1280×720 361.39 / 357.39 (reported)** | closed 543.19 / 511.72 / 574.84 / 463.19 | GREEN at ≥ 400; 720 is reported, not thresholded |
| **G14** Row B density, real rects + real hover | min verb gap **7.59 / 8.92 px** at 1024×768; **9.03 / 10.38** at 1280×800. Hover-note overlap with any verb box **0 px²**, all 5 verbs, both engines; every note in the viewport | 11.91 / 13.52 (1024), 13.64 / 15.25 (1280) | GREEN (≥ 4; the arithmetic 4.93 was pessimistic) |
| **G15** coupling for TAPE/RULE | ink in an 8 px band beside the bar, crib open vs shut: right flank **41.6–64.8 → 146.8–170.6 px**; left flank 0–42.1 → 0–65.8 px (grows by ≈ the crib's height) | unchanged shut/open | a number, not this lane's gate. The d-stillness half needs M18's edge, which isn't built. |

Notes:

- **(a) Reference noise.** The reference is the same differencing at the card's new end. Values
  above 1 (1.014–1.026 at 1024 and 1440) are that reference reading ≤ 2.6 % lower at another
  raster phase. They are not extra ink. A clone-on-fixed-host reference was tried first and read
  0.972–0.974 on a crib that was visibly whole, so it was dropped as biased.
- **(b) Chromium key-mode step ratio.** On the first battery, 4 chromium keyboard-Enter cells read
  a step-ratio of 4.3–4.8 against the curve's peak step, and the first chromium-light chunk
  (before the probe switched from the callback clock to the rAF timestamp) read up to 23.6. The
  final-build re-read gives 0.92–0.97 in all 16 cells. Unreproduced, and no reversal in any cell.
  It's logged as an instrument/headless input-frame suspicion, **not proven**.
- **(c) PRM settle.** 62 ms in one webkit PRM cell: the first frame after a long frame. It still
  had 0 intermediate heights.
- **(d) G6 other readings.** On the old build under load 18–42 the rate read was 0 vs 0 (both
  engines). The layout-forcing desk sampler's 650 ms window reads webkit prototype median 5 vs
  control 1 (first battery, loaded) and 1.5 vs 0 (final build). So the in-flow grow does cost
  WebKit about one long frame per open whenever layout is forced. That doesn't reproduce Opus's
  8 vs 3, and it isn't clean. M1 (MOT-VERB's transform slide) remains the escalation row if a
  quiet-box re-read reads > median + 1.

## Finding: the fifth verb's press lifted the whole strip 17 px in WebKit (found, attributed, cured)

- **Symptom.** 2 of 36 WebKit prototype cells showed a 17 px verbs-rect Δ and a 17 px top-edge
  reversal. On repeat (`probe/glitch.mjs`), 4 of 10 WebKit clicks on the new verb lifted the
  sticky bar 17 px for the frame(s) `:active` held. A held press (`probe/active.mjs`) held the
  lift for 6–19 frames.
- **Specificity.** The lift happened on 0 of 9 held presses on HEAD's Fill, Solve and Share, and
  on 0 on the prototype's Fill and Share.
- **Mechanism.** `.icon-btn:active { transform: scale(0.93) }` makes the pressed button the
  containing block of its own `SheetWashiLabel`. The note leaves the bar's berth (`left: 50%`
  of the bar) and centres on the button. For the strip's last verb, that puts about 15 rem of tape
  past the card's right edge. The card then overflows sideways by **17 px (webkit) / 15 px
  (chromium)** (`cardOverflowX`). WebKit's classic scrollbar steals 17 px of the scrollport and
  the sticky bar rides up by the same amount. Chromium overflows too, but its overlay scrollbar
  hides the lift.
- **Cure.** The press scales the children, not the box.
- **After the cure** (final build): 0 px overflow and 0 lifted frames over 5 webkit + 5 chromium
  held presses on the keys verb, plus 10 webkit clicks. The desk2 re-read gives verbs Δ 0–0.16
  and 0 reversal.
- **Latent on HEAD (read from source, unmeasured).** Every verb's hover note re-centres on its
  button while pressed, for the same containing-block reason. For HEAD's four verbs no overflow
  was measured (Share 0). This is a MOT-VERB / CTRL-FACE row, not this lane's.

## Mechanical

- **vue-tsc:** `vue-tsc -b` exit 0 on the final source.
- **Unit battery** (`probe/unit.sh`, two chunks): 57 files / 742 tests plus 12 files / 106
  tests, which is **69 files / 848 tests** green. That's main's 847 plus the new G7 row.
- **Font coverage:** `check-font-coverage` exit 0.
- **Unit tests:** `GameControlPanel.test.ts` 35/35.
- **Style and lint:** prettier clean on every touched file; eslint and `lint:boundary` exit 0;
  `lint:copy` bare 0; `lint:motion` bare 0 (35 specs).
- **Touched e2e** (`share-truth`, `zone-grammar`, `access`), on the prototype and the control:
  - chromium 22/22 on both;
  - webkit 21 passed + 1 skipped on both. The skip is the same pre-existing one on the control.

## Crops (four, palette PNG, all under 35 KB)

- `c1-chromium-light-1280x800-fine-open-from-top.png` (chromium · light · 1280×800 · fine): Row B
  open from the top. The crib sits on the strip's paper directly above the verbs, "keys" is
  inked and scribbled, and the fade rides the crib's top edge over "Hard".
- `c2-webkit-dark-1280x800-fine-open-from-end.png` (webkit · dark · 1280×800 · fine): open from
  the end. It shows **G15's coupling**: the next well's 4 px-outset brackets paint beside the
  open crib's flanks (TAPE/RULE's slab-cover row).
- `c3-chromium-light+dark-1280x800-fine-ring-arm-strip-rest-open-2x.png` (chromium · light and
  dark · 1280×800 · fine, 2×, strip only): ballot 1's alt arm, the drawn ring. Rest on the left,
  open on the right. Light is the top row and dark the bottom.
- `c4-chromium-light-1024x768-fine-open-density.png` (chromium · light · 1024×768 · fine): five
  verbs at 7.59 px gaps with the crib open.

## Gaps (a gap is a gap)

1. **G6 has not been read on a quiet box.** The final read was at load 6–13 with foreign
   Playwright workers on the box. The prototype sits at the gate's boundary (median 1 vs 0).
2. **The ring arm (c3)** was framed only. Its π, AA, filter census and G8 are unmeasured, and it
   exists behind a prototype query flag.
3. **The B8 `#card-foot` arm is unbuilt anywhere,** so G1–G5 in the foot arm remain TAPE/RULE's
   re-read.
4. **G15's d-stillness** is unmeasurable until M18's edge exists. The flank number counts any ink
   in an 8 px band; it isn't attributed per well.
5. **No real Safari or iOS** (M19). Playwright WebKit headless only, and WebKit's classic
   scrollbar is what made the press finding visible. Real Safari with overlay scrollbars would
   have hidden the lift, but not the overflow.
6. **The G3 step-ratio artifact** in 4 chromium keyboard cells (note b) is unreproduced but
   unexplained.
7. **The coarse DOM delta:** the unrendered fold and `<dl>` now sit inside the bar on the coarse
   rail. The paint delta is 0, but the node order changed. The chair decides if "tag list" means
   the DOM or the rendered tree.
8. **HEAD's latent press re-home of every verb's note** is a source reading, unmeasured.
9. **The π cells ran at the default deal.** Each arm dealt its own board (no `?board=` payload,
   per the chair's `1e6cfbbf` addendum). The card and board numbers matched to the hundredth
   anyway.

## Instruments (`probe/`)

| file | what it measures |
|---|---|
| `probe.mjs` | the desk cell (G1/2/3/5/8/13/15) |
| `sum.mjs` | summaries of the desk cells |
| `rate.mjs` | G6 |
| `coarse.mjs` | G4 coarse |
| `density.mjs` | G14 |
| `aa.mjs` | G10 |
| `glitch.mjs` + `active.mjs` | the press finding |
| `crops.mjs` | the crops |
| `battery.sh`, `rate.sh`, `rest.sh`, `reverify.sh`, `final.sh`, `a11y.sh`, `e2e-touched.sh`, `unit.sh` | the runners |

Raw per-frame JSON stays in the worktree's `web/frontend/.intake/out/` and is not banked.
