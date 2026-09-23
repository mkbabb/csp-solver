# G-DRAWIN prototype (T9-M20): the hand on the boot

Opus prototyper. The worktree is `.claude/worktrees/wf_b6676cd9-8c6-13`, cut from main `1d0dc4fd`. Nothing is committed.
The product diff is `prototype.diff`: seven tracked files plus two new ones (`bootHand.ts`, `handStroke.test.ts`),
about 660 insertions and 136 deletions. The brief costed it at about 250 lines. The overrun comes from comments and
from arm B being built. The control is main's dist `index-ChSrVSqM0j8q.js`, the census's own build.

Arms are build-time consts: `VITE_HAND_ORDER` and `VITE_HAND_LAYER` feed `MOTION.hand.order` and `MOTION.hand.layer`.
Each dist was grepped to confirm the const folded:
- A×Q: `order:"serial",layer:"mask"`
- F: `order:"front",layer:"mask"`
- B: `order:"serial",layer:"crossfade"`

Serving: lane ports 4253 and 4254 only. 4255 and 4256 were already bound by other lanes, so the arms took turns on 4253.
Every server was killed by its recorded PID.

Load and box: the box was shared, with load 57–243 through the run (`uptime` 200/243/210 at 12:54). The chromium rAF
clock ran at 120.5 Hz and WebKit at 58.8 Hz. Cells below are min/median/max.

Instrument: the census `init2.js`, extended as `instruments/init3.js`. It samples post-rAF and pre-paint. Its readers:

- per-line dash progress through the mask
- visible tips
- `image.hand-pose`
- the wordmark mask front `x2`
- live-filter groups
- `.scene-controls` opacity
- canvas `drawImage`/`toBlob` stamps
- LoAF

Photographs are rAF-frozen: `shoot.mjs` holds every page rAF callback, so all JS motion stops, and pauses CSS
animations for the crossfade shot. They are taken at DPR2 or DPR3, two reps (A.5.7).

Payload: every arm and the control load ONE encoded `?board=` payload (`ATMuNTMw…`). The `-DEF` and `-DEAL` cells are the
default worker boot, which is the only boot with a reveal wave. A `?board=` restore mounts the givens whole.

Arm A×Q was measured on three builds. **AQ** is the first build. **AQ2** adds two fixes:
- the ruling waits for the wordmark's pose 0 too
- the boot-deal rule "blank at mount, first bump" replaces the 0→1 rule

F and B were built with the wordmark wait.

## Gates (numbers first)

| gate | prototype | HEAD control | verdict |
|---|---|---|---|
| **G-D1** the hand pauses (150 ms busy loop at stroke+200). Worst single-frame Δ, frame % of perimeter / subgrid % / cell % | **AQ chromium** 3.8–5.3 / 8.5–15.9 / 13.9–25.5 (n5). **AQ2 WebKit** 7.1–7.5 / 16.0–16.1 / 26.2–26.3 (n5). **F** chromium 5.6–10.5 / 15.9–16.1 / 10.5–19.9, WebKit 9.7–10.7 / 15.9–16.1 / 19.9–20.0. **300 ms arm**: AQ chromium 3.8–4.1 / 8.4 / 14.5–14.6, AQ2 WebKit 7.3–7.5 / 15.7–16.0 / 26.3. Lines never seen partial: 0 in every prototype run | INJ150 chromium 41.0–47.5 / 75.2–87.5 / 80.6–100, 3–13 lines never partial. INJ150 WebKit 15–17 of 17 lines never partial | **GREEN** under the computed caps (Q 7.8/16.3/27.1, F 11.6/16.3/20.3). WebKit sits AT the bound: at 60 Hz the cap binds on every frame. The negative control (`stepMs` unset, same curve) was not built: gap |
| **G-D2** 0 encodes from the rubbing's first frame to the wave's last stroke | **AQ2** 0 in 21/21 WebKit motion runs. AQ, F and B: 0 in every chromium run. F and B: 0 in WebKit | 12–16 per run | **GREEN on AQ2/F/B.** The AQ build (no wordmark wait) put the wordmark's pose-0 encode (762 px) under the hand in 9/21 WebKit runs; the wait cured it. The negative control (`poseCount` = n at mount) was not built: gap |
| **G-D3** the order | Q: max fronts 2, max tips 2 (every run). F: 15 in flight, monotone by construction (jitterFrac 0.2/0.3 < 0.5) | 15 (9–14 under injection) | **GREEN**, after a fix: lift-only serial put **3** fronts on the page at every tier change (frame→subgrid, subgrid→cell). The adjudication's "≤ 2" did not hold arithmetically. The next line now waits for max(lift, the line-before's end) |
| **G-D4** velocity | fraction drawn at 20 % of its time (sampled, median per run): AQ 14.0–17.8 %, F 15.9–17.2 %. The analytic curve: 0.14× at t=0, peak 2.394× at 0.286, 18.0 % at 20 % (unit test `handStroke.test.ts`, 41 samples to 1e-4) | sampled 17.6–43.4 %, analytic 48.8 % | **GREEN** on the per-line clauses. The frame's 3 corner minima and the rubbing's one bell hold by construction (jointed and handStroke) and were not measured frame by frame: gap |
| **G-D5** the point (frozen DPR2, 2 reps) | frame tip cross-section/body 1.33–1.60, density 1.049–1.055, core contrast 12.25–14.52, all 4 engine × theme cells. Cell tip ink/body 1.375, contrast 11.5–12.0 (WebKit dark). At line end +110 ms all 17 tips computed opacity 0 | ratio 0.94–1.00 (no tip) | **GREEN** (≥ 1.25 / ≥ 1.15 / ≥ 3.0). The FAINT-INK 0.15 and widthK 1.0 plants were not run: gap |
| **G-D6** no handoff step (last drawing vs first settled, board band) | **arm A WebKit**: median 0, p95 0, p99 0; 47–72 of ~311 k px > 16/255 (light and dark). **arm A chromium**: median 0, **p95 25–29, p99 33–37, 52–62 k px > 16**, ink ratio 1.002–1.005. **arm B**: mid-crossfade ink 1.17× rest (never under); at the stand-ins' unmount p99 145–201, ink 0.946–0.96 | p99 150, ink 0.96 (crisp → grain in one frame) | WebKit **GREEN**. Chromium passes the literal median clause but shows a **line-EDGE resample step**: the masked `<image>` is softened by about ¼ device px against the composited steady bitmap (a subpixel board origin). **Honest reading: partial RED** (c4). Arm B moves the census step to the end of its fade: a declared loss, as the adjudication said |
| **G-D6b** mask cost (decides the layer) | proxy only (painted intervals in the draw; no paint-time instrument). WebKit AQ2 light: frames > 34 ms 0/1/4, dt max 33/37/116. AQ2 dark: 1/4/13, 42/86/87. B light: 0/0/1, 28/31/43. B dark: 0/0/1, 26/29/40. Chromium: 9.3 ms vs 9.3 ms, no difference | — | **UNDECIDED; the proxy leans against arm A on WebKit.** AQ2 ran at the LOWER box load and still had more long frames than B. A real per-frame paint-time read is owed |
| **G-D7** no live filter on the boot | 0 live-filter samples (grid `sl` / wordmark live stack unclipped), every prototype run: motion + PRM, both engines | motion: wordmark live 11–32 samples; PRM: 18–24 grid + wordmark | **GREEN** |
| **G-D8** written once (worker delay 1.5 s / 3.5 s) | **AQ2** DEAL1500 0 erases (3/3), DEAL3500 0 (3/3). Positive control (Clear after settle): erases once (2/2) | 1 erase per run (6/6); positive control once (2/2) | **GREEN** on AQ2. The first build's 0→1 rule failed at DEAL3500: `initBoard` bumps the generation before mount, so the deal is 1→2, and the page turned. The counter reads 2 on arm A because masked paths read "whole" before priming. The trace shows one real erase |
| **G-D9** the wordmark uncut | horizontal 5–95 % front span 0.34 em. Lean 105° by construction (gradient vector 17.58 × 4.71 units, 15.0°). Worst advance per painted frame 4.5–8.3 % of the width (chromium), 8.6–9.2 % (WebKit 60 Hz). 0 live-filter samples | a hard cut, 99 % at 822–846 ms (census) | **GREEN on eye** (c3). The measured span is 0.01 em under the 0.35 em clause at the 5/95 thresholds. The photographic slant estimator is broken (47.6°): gap |
| **G-D10** tempo (REPORTED) | see §Tempo | — | reported |
| **G-D11** continuity | chromium: dt max in draw 9.3–25 ms, 0 frames > 34 ms, every line partial in ≥ 2 frames. **WebKit AQ2: 0–17 frames > 34 ms per draw (dt max 33–168)**, every line partial in ≥ 2 frames | WebKit dt max 487–778, 15–17 lines never partial | chromium **GREEN**. **WebKit RED** on the ≤ 34 ms clause, attribution partial (A.6 says it is a defect to find). The encodes are no longer in the window, and B shows fewer long frames, so the mask is the first suspect |
| **G-D12** price guard | not measured | — | gap |
| **G-D13** PRM is a cut | 0 partial lines, 0 tips, the wordmark clip only 0 → 1 (hidden until pose 0 is resident, then at rest), 0 live-filter frames | — | **GREEN** except the same-frame crisp → stack cut, which was not photographed: gap |
| **π-1** settled bytes | SHA-256 of the last grid stack (1272 px) and wordmark stack (762/765 px): equal as sets in all 4 engine × theme cells | — | **GREEN**. The 416 px stack (the toggle, source untouched) differed on chromium under the "last 4" slice. Instrument limitation, unverified |
| **π-2** filters | painted live-filter elements at rest 7 = 7 in all 4 cells (this lane's DOM walk) | — | GREEN on this read. `filterBudget.ts`'s own census of 9 was not run: gap |
| **π-3** unnamed surfaces | 1093 = 1093 elements; one signature delta: `svg.handwritten-logo` class `is-drawn`→`is-resident`, clip-path `inset(0 0% 0 0)`→`none` (a named surface). Source: GameGallery, erase, tally, glyph untouched. `controls-fade-in` 250/+150/`--ease-drawOn` verbatim, paused in its delay by `html.hand-pending` until the first stroke; the chrome fade now starts about 165 ms after the first stroke | — | **GREEN** |
| **π-4** copy | `check-copy-register` bare: 0 hits; no rendered string changed | — | GREEN |
| **π-5** @property | none added. `check-property-block` does not exist on main | — | GREEN (nothing to run) |
| **P-1** 60 Hz precondition | chromium 120.5 Hz: the 17 ms cap never engages on a healthy frame, so the injector is the witness. WebKit 58.8 Hz is below 93.75, so the cap engages on every frame over 17 ms: the natural witness. DRIVEN_CLOCK not built | — | printed |

Also run: `vue-tsc` 0; unit 70 files / 851 tests (incl. the new curve test); `check-motion-contract` OK; prettier
`src/` clean; ESLint on the changed files clean.

## Tempo (G-D10, ms from navigation, 9×9, d cold light unless noted)

| arm × engine | rubbing onset | first ruling stroke (h) | ruling drawn | last given (worker boot) | boil start (full stack) |
|---|---|---|---|---|---|
| AQ2 chromium | 352–442 | 686–767 | 2794–2875 | 1679–1719 (AQ-DEF) | 3322–3411 |
| AQ2 WebKit | 463–668 | 813–1041 | 3151–3499 | 1453–1984 (DEF) | 3747–4187 |
| AQ2 chromium m 390 / WebKit m | 259–288 / 548–594 | 584–613 / 946–980 | 2695–2729 / 3263–4066 | — | 3118–3138 / 3808–4549 |
| F chromium / WebKit | 518–621 / 676–871 | 851–947 / 1027–1271 | 1409–1505 / 1685–1981 | — | 2126–2289 / 2289–2604 |
| B chromium / WebKit | 398–735 / 607–949 | 723–1060 / 958–1315 | 2831–3168 / 3138–3563 (incl. the 350 fade) | — | 3706–4168 / 4157–4539 |
| HEAD chromium / WebKit | — (1.2 s wipe) | 78–116 / 312–507 | 645–682 / 814–1305 | 996–1678 | 670–700 / 1199–1762 |
| PRM AQ2 chromium / WebKit (boil) | — | — | — | — | 587–743 / 956–1146 (HEAD 452–694) |

Serial schedule, computed: 9×9 is 2120 ms from the first stroke to the last line's lift, plus the 150 ms dry. The
frame→subgrid and subgrid→cell waits add about 100 ms to the adjudication's 2052. 16×16 is about 3.6 s, computed and
not run.

## Findings the adjudication did not carry (charter rows)

1. **The deal's reveal wave is not gated on the ruling.** On main it starts at the deal (~540 ms) and overlaps the grid's
   tail. Under ONE HAND the digits finish (1.5–2.0 s) while the ruling runs to 2.8–3.5 s: the digits are inked on an
   unruled page. The adjudication's order ("the last lift → the wave") does not exist on main. Proposed row, **D15**
   (MOT-VERB, a W1 crossing): the wave waits for the last lift. It is a new mechanic, NOT built here. It is ballot
   B-DRAWIN-1's hidden price and belongs in the ballot text.
2. **Every deal redraws at the chosen tempo.** A New Game or Clear erases, then rules again. On arm Q that is about
   2.5 s to settle, per deal (positive-control trace 6166 → 8682 ms). The ballot's price must say "every deal", not
   "the boot".
3. **The lift alone gives three fronts** at tier changes. It is fixed in the prototype (`lastEnd` in `schedule`).
4. **The first deal is 1→2 on a default boot** (`initBoard` bumps before mount). The provenance that works is "blank at
   mount, first bump": `GameBoard.vue` `bootDealPending`.
5. **WebKit bakes the wordmark's pose 0 after the grid's.** The ruling has to wait for both, which
   `wordmarkResident` does. It costs about 60–170 ms of h on WebKit.
6. **Chromium's masked `<image>` is not pixel-identical to the composited steady bitmap** (a ¼ px edge resample; c4).
   The "no handoff frame" claim holds on WebKit only.

## Crops (4, all ≤ 36 KB)

- `c1-chromium-light-1280x800-fine-frame-midside-AQ-vs-HEAD.jpg`: the frame at p = 0.38 with the bead (left) beside
  HEAD at p = 0.41 (right). Frozen at t = 860 / 462 ms.
- `c2-webkit-dark-1280x800-fine-two-fronts-lift-and-land-AQ.jpg`: two cell fronts at a lift-and-land, the lifted line's
  nub drying (t = 1805 ms).
- `c3-chromium-light-390x844-coarse-rubbing-midword-AQ.jpg`: "sud" rubbed in through the 105° feathered front
  (t = 455 ms) above the word at rest. HEAD's crop 2 (census) is the control: a hard vertical cut.
- `c4-chromium-light-1280x800-fine-handoff-diff-AQ.jpg`: the last drawing frame and |last − first settled| × 8. The
  residue is line EDGES only (band median 0, p95 29).

## Gaps (a gap is a gap)

- G-D6b has no paint-time instrument. The proxy leans against arm A on WebKit.
- G-D11 WebKit is RED (0–17 frames over 34 ms per draw) and unattributed.
- G-D6 chromium shows an edge resample step.
- Negative controls not built: `stepMs` unset, `poseCount` = n, the two G-D5 plants and feather 0. HEAD stands in as
  the RED reading where it can.
- Not measured: G-D12, and the PRM same-frame cut photograph.
- The painted-frame recorder (CDP screencast / recordVideo) was NOT the primary read. Every "painted" number is the
  post-rAF sampler plus rAF-frozen photographs. Row 40's recorder is still owed.
- Not run: 16×16, the other games, the :3001 profile (the worker-delay shim stands in), real iOS.
- The box was loaded (57–243). No number here is a quiet-box floor.
- The AQ chromium battery and photos predate the wordmark wait. AQ2 re-ran chromium lite and WebKit full; its numbers
  match AQ.
- The final source differs from the measured dists in three ways, none behavioural: `useId()` in place of module
  counters for the mask ids, the dead `handNow` export removed, and formatting. Re-verified by `vue-tsc` and the unit
  battery.
- Ballot 2 (glyph timing) was not built. The reveal path (`HandwrittenGlyph` `setupReveal`) is shared with hint/solve
  write-in through `createStrokeDrawIn`, so arm (b) reaches them unless the reveal branch takes its own easing.
- The owner's :3001 was not touched.
- Nothing retires T9-M20 (U-10).
