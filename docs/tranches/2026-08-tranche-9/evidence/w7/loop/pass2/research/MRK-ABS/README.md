# PASS-2 RESEARCH · MRK-ABS · One visible hand

§5 the wobble law · §6 focus rings. Read-only on the product. HEAD tree served at
`127.0.0.1:4238` (private vite cacheDir in the scratchpad, `--strictPort`, killed on return),
chromium + webkit, 1280×800 and 393×699. The geometry is computed OFFLINE off the shipped
`@mkbabb/pencil-boil` so the law can be stated in closed form rather than fitted; every offline
figure below is checked against pass 1's own DOM readings and reproduces them to 3 dp.

**Zero crops.** Everything here is a number, a file:line or a closed form. The wave's 2 MB cap
is carrying pass 1's 207 PNGs; this lane adds none.

---

## 0 · The seven things a synthesizer should read first

1. **The wobble is size-invariant by construction.** `maxDisplace = roughness × len × 0.015`
   and the cure sets `roughness = σ/(cellSize × 0.015 × k)`, so `maxDisplace = σ/k` **exactly**,
   independent of `cellSize`. The ring's shape in board units is the same distribution at 4×4,
   9×9 and 16×16. The critic's "residual monotone in board size ⇒ systematic model error" is
   refuted: offline, at the product's own seeds, the same window reads **1.7145 / 1.7562 /
   1.8228** — pass 1's DOM read 1.715 / 1.756 / 1.823 — while the 4096-cell population reads
   **1.7749 at CV 34.6 %**. The 6.14 % spread is the sampling error of a CV-35 % statistic at
   n = 16/81/256, not a model defect.
2. **`ringK` is the shape constant of a WINDOW, and it is computable, not fittable.** Four
   windows, one geometry: r0's `0.02–0.22` chord-fit window k = **0.3287**; whole perimeter
   0.4045; the critic's 5-node polyline 0.4306; a declared four-edge middle-80 % window 0.4430.
   The shipped 0.3241 is **1.4 % low for r0's window** and 27 % low for the window the critic
   used. Both readings were right; they measured different windows.
3. **MA-C scores a boundary 3.25 ghost-units inside the one a reader sees.** In closed form the
   three candidate boundaries are the cell's nominal box (A), the rule's inner painted edge (B)
   and the neighbour's true boundary, the rule's outer edge (C). At 16×16: **A +0.233 px,
   B −1.357 px, C +1.823 px**. Re-cut against B the guard goes RED at 16×16 — and **no σ inside
   the grid's own band clears it**; only insetting the ring does.
4. **The outline fade has exactly two shipped carriers**, and pass 1 named neither correctly:
   `OptionSelector.vue:52` (`.ctrl-btn`, 150 ms) and `AttributionCard.vue:45`
   (`.attribution-trigger`, 200 ms). Measured arrival with the token injected, both engines:
   **150 ms and 250 ms**; 7 of 11 stops arrive same-frame.
5. **The deck's route is `?view=gallery`** (`useGameGallery.ts:47`, `:66` — a URL-truth param,
   not a router route; there is no router). On it, `.staging-face` reads **3.14 light / 3.97
   dark** (chromium; webkit 3.18 / 4.00) — both already clear 3:1, so those two stops are an
   IDIOM row, not a contrast row, and G-ABS-3 is not red on them.
6. **The deck's HEAD arm is now a measurement**: reach 6, airLeft **9.59**, headroom **3.59**,
   WHOLE, one ring owner, `.gallery-viewport` `outline-style: none`. Under the token reach 5 →
   headroom **4.59**.
7. **The painted-bytes instrument can be fixed, and the fix is measured.** On `.info-btn`,
   pass 1's "max change in the annulus" returns **18.10** (chromium) / **17.61** (webkit) —
   the washi tooltip, 32 px right of the box edge. Sampling the outline's own painted band
   returns **3.72** (chromium, the UA grey) and **2.15** (webkit) — and 2.15 is exactly r0's
   independently-measured WebKit UA figure. The instrument is banked.

---

## 1 · The surfaces and tokens this family touches, with their lines

### Geometry (§5)

| what | where | value at HEAD |
|---|---|---|
| ghost path generator | `src/pencil/grid/gridPaths.ts:41-70` | `wobbleRect(x, y, cellSize, cellSize, {roughness: 0.4, segments: boardSize >= 16 ? 2 : 4, seed: seed+500+pos*7, jagged: true})` |
| LRU key | `gridPaths.ts:48-49` | `["cellRects", boardSize, subgridSize, viewBoxSize, seed]` — no ring term |
| ghost viewBox (the 15 % pad) | `src/games/shared/useGameCell.ts:86-97` | `pad = cellSize * 0.15`; viewBox = cell box + pad on four sides |
| ghost svg | `src/games/shared/DigitCell.vue:415-421` | `absolute inset-0`, `preserveAspectRatio="xMidYMid meet"`, `pathLength="1"` |
| tier 2 (selection) | `src/games/shared/gameCell.css:245-259` | `stroke-width: 7`, `stroke-opacity: 0.9`, `fill-opacity: 0.08`, `ghost-draw-on 180ms` |
| tier 1 / 3 / 4 | `gameCell.css:189-198` / `:273` / `:229-241` | stroke 5 / 9 / 4 |
| cell rule (the grid) | `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:366`, `:442` | `stroke-width="5"` board units (subgrid 8, frame 12) |
| the library's law | `node_modules/@mkbabb/pencil-boil/dist/path.js:63-64` | `maxDisplace = roughness*len*0.015`, `overshoot = roughness*len*0.003` |
| the constants' home | `src/pencil/config/pencilConfig.ts:268-282` | `DEFAULT_BOIL_CONFIG` → `BOIL_CONFIG = reactive({...})`, `resetBoilConfig()` at `:284` |

**The scale identity everything turns on.** The ghost element is `cellPx` wide and its viewBox is
`1.3 × cellSize` wide, so its px-per-unit is `cellPx / (1.3 × cellSize) = boardPx / 1300` — the
**same scalar at every board size**. The board SVG's own scalar is `boardPx / 1000`. So one ghost
unit = 1/1.3 board unit, and the cell rule's 5 board units of stroke are **6.5 ghost units**
(half-band **3.25**). Measured: ghost scale 0.489 vs grid scale 0.636 at `boardPx` 636
(`r0/r3-marks/logs/wobble-*.json`), and 0.636/1.3 = 0.48923. ✓

### Focus (§6)

| stop | rule | HEAD value | measured |
|---|---|---|---|
| base sweep | `src/assets/index.css:445` | `* { @apply border-border outline-ring/50 }` | paints nothing; sets `outline-color` on every node |
| `.logo-trigger` | `HandwrittenLogo.vue:544-548` | 2px `color-mix(fg 40%)`, offset 4, **`border-radius: 0.35rem`** | 2.70 (arith; = deck card's 2.69 painted) |
| `.game-card.is-center` | `GameCard.vue:436-440` | 2px `color-mix(fg 40%)`, offset 4, **`border-radius: 0.5rem`** | **2.69** painted, reach 6, headroom **3.59**, WHOLE |
| `.staging-face` | `StagingBand.vue:431-434` | 2px `color-mix(fg 45%)`, offset 4 | **3.14** light / **3.97** dark (webkit 3.18 / 4.00) |
| `.guard-face` | `GameGallery.vue:1450-1453` | same declaration, same offset | same arithmetic (identical mix + ground family) |
| `.drawer-tab` | `DrawerTab.vue:151-154` | 2px **dashed** currentColor, offset 3 | `2px dashed rgb(10,10,10)` |
| `.sun-moon-toggle` | `DarkModeToggle.vue:740-743` | 2px `var(--color-ring)`, offset `calc(2px − bleed)` | desk **54 px**, phone **12 px** offset |
| `.gallery-viewport` | `GameGallery.vue:1193` | `outline-style: none` | confirmed, both themes |
| everything else | UA | `outline: auto` | chromium ring band **3.72**, webkit **2.15** |
| ink token | `index.css:219` light, no dark arm | `--color-focus-sketch: #3a7bc4` | 4.29 card / 4.19 bg light; **4.29 / 4.38** on DARK grounds without an arm |

Dark crayon-blue is `#6aabeb` (`index.css:381`); the alias buys **7.70 / 7.86** token and
**6.44** board ring (vs 3.71 with no arm). Arithmetic validated against painted bytes on two
stops this pass: predicted 2.70 / 3.14, measured 2.69 / 3.14.

---

## 2 · §5 — the window IS the law (`probe/k-window.mjs`, `logs/k-window.txt`)

```
ringSigmaUnits 1.75 · ringK 0.3241 · maxDisplace = σ/k = 5.3996 units (EXACT, size-free)

size   n      W1 r0 (0.02–0.22, chord)   W2 perimeter      W3 nodes×5        W4 declared      excursion
4×4    16     1.7145  (CV 32.1%)         2.1914 (12.4%)    2.2064 (27.9%)    2.4007 (12.5%)   5.379
9×9    81     1.7562  (CV 33.0%)         2.1704 (14.3%)    2.3737 (27.9%)    2.3784 (14.4%)   5.379
16×16  256    1.8228  (CV 33.9%)         2.2063 (14.0%)    2.3811 (29.0%)    2.4154 (14.2%)   5.399
pop    4096   1.7749  (CV 34.6%)         2.1843 (14.1%)    2.3252 (29.3%)    2.3922 (14.3%)   5.400

k_w = σ_measured / maxDisplace:   W1 0.3287 · W2 0.4045 · W3 0.4306 · W4 0.4430
spread across the three boards:   W1 6.14% · W2 1.64% · W3 7.53% · W4 1.54%
```

Pass 1's DOM read 1.715/1.756/1.823 and the critic's refit read 2.206/2.374/2.381. **Both are
reproduced here to 3 dp, offline, from the library alone.** They are not a disagreement; W1 is
r0's window (33 samples over 20 % of the perimeter, residual to the CHORD between the first and
last sample — `r0/r3-marks/probe/wobble.probe.ts:48-99`), W3 is the five nodes of one edge.

Three consequences for the spec:

- **`ringK` must be derived, not fitted.** For r0's window the population constant is
  **0.3287**; ship that and the rendered σ reads 1.75 at the population, not 1.7749. A unit test
  on the primitive (4096 cells, offline, tolerance 0.5 %) is the honest home for that number —
  it has no viewport, no engine and no flake, and it makes the constant falsifiable by anyone.
- **The window belongs in the gate's own words and in the comment.** "σ_units 1.75 ± 5 %" is
  meaningless without "measured over arc-length 0.02–0.22 of the closed path, 33 samples,
  residual to the chord". Either wording is fine; the silent one is not.
- **G-ABS-2's tolerance must be the estimator's, not a wish.** At CV 34.6 %, the standard error
  of a per-board mean is 8.7 % (n=16), 3.8 % (n=81), 2.2 % (n=256). A ±5 % per-board gate is
  **inside the noise at 4×4** and will flake. W4 (all four edges, middle 80 % of each, residual
  to the nominal line, pooled) has CV 14.3 % → SE 3.6 / 1.6 / 0.9 % and a 1.54 % spread: a ±5 %
  gate on W4 is a gate; on W1 at 4×4 it is a coin. **Recommendation: author k on W1 (0.3287) if
  the ratio row must stay comparable with r0's grid readings, and gate on W4 with its own k
  (0.4430) — or move both to W4 and re-take the grid's σ with the same window in the same
  commit.** What cannot stand is one window for the fit and another for the verdict.

---

## 3 · §5 — MA-C re-cut, in closed form (`probe/clearance.mjs`, `logs/clearance.txt`)

```
headroom(units) = 0.15·cellSize + inset − σ/k − strokeWidth/2 − boundaryTerm      [ghost units]
   boundary A (the cell's nominal box, what pass 1 scores)      boundaryTerm = 0
   boundary B (the rule's INNER painted edge — first ink)       boundaryTerm = +3.25
   boundary C (the NEIGHBOUR's edge — the rule's outer edge)    boundaryTerm = −3.25

MODEL CHECK vs pass 1's measured MA-C:  4×4 9.064 px (measured 9.071) · 9×9 3.800 (3.809) · 16×16 0.233 (0.233)

  N     cellSize  margin_u  A_units  A_px     B_units  B_px      C_units  C_px
  4     250.00    37.500    28.600    9.064   25.350    8.034    31.850   10.094
  9     111.11    16.667     7.767    3.800    4.517    2.210    11.017    5.390
  16     62.50     9.375     0.475    0.233   −2.775   −1.357     3.725    1.823
  17     58.82     8.824    −0.076   −0.037   −3.326   −1.627     3.174    1.553

ZERO AT:  A cellSize 59.33 → board 16.85 (largest whole board 16)
          B cellSize 81.00 → board 12.35 (largest whole board 12)
          C cellSize 37.66 → board 26.55 (largest whole board 26)
```

**The headroom limit, stated (charter row 9).** On boundary A the law's ceiling is **board 16** —
16×16 is the last board it fits, with 0.475 units (0.233 px) to spare, and board 17 is negative
by 0.076 units. That sentence belongs beside the target in `pencilConfig`, in units, because the
px figure is a viewport consequence: `px = units × boardPx/1300`.

**The levers, priced on boundary B (charter row 8).** Deficit at 16×16: 2.774 units / 1.357 px.

| lever | A px | B px | verdict |
|---|---|---|---|
| as pass 1 ships it (f = 1.00, stroke 7, σ 1.75) | 0.233 | −1.357 | RED |
| stroke 7 → 5 at 16×16 | 0.722 | −0.868 | RED |
| σ → 1.476 (the ring at the grid band's 0.722 px floor) | 0.646 | −0.944 | RED |
| stroke 5 **and** σ at the band floor | 1.135 | −0.455 | RED |
| ring at **0.911 × cellSize** (the minimum that clears B) | 1.593 | 0.003 | GREEN |
| ring at 0.90 × cellSize | 1.761 | 0.171 | GREEN |
| ring at 0.88 × cellSize | 2.067 | 0.477 | GREEN |
| ring at **0.86 × cellSize** (pass 1's named lever) | 2.373 | 0.783 | GREEN |
| 0.86 + stroke 5 | 2.862 | 1.272 | GREEN |

**No σ inside the grid's own band clears boundary B, and neither does the stroke.** Insetting the
ring is the only lever that works, and it is the lever that also answers the lozenge: at 0.86 the
ring stops being the cell's edge and becomes a mark inside it, which is what a hand-drawn ring
around a square actually looks like. Its cost at the other two boards, as an inset in px at
1280×800: f=0.86 → 5.55 px (4×4), 3.81 px (9×9), 2.14 px (16×16); f=0.90 → 3.96 / 2.72 / 1.53.

Phone (393×699, `boardPx` 365): A = 8.030 / 2.181 / 0.133 px (pass 1 measured 8.036 / 2.186 /
0.134 ✓), B = 7.118 / 1.268 / **−0.779**.

**The overlap is not only a gestalt question — it is an adjacency question, and dark fails it**
(`probe/adjacency.mjs`, `logs/adjacency.txt`). Where the ring's ink lands on the rule's ink, the
rule is the ring's adjacent colour:

```
                        ring vs paper    ring vs the RULE's ink    ring painted OVER the rule
   light                    3.62                4.11                       3.08
   dark  (alias #6aabeb)    6.44                1.86  ← under 3:1          1.49
   (--grid-line-color: hsl(0 0% 15%) light, hsl(48 10% 80%) dark; the rule reads 14.87 / 11.99 on paper)
```

In light the ring keeps 4.11 against the rule it touches. **In dark it keeps 1.86** — a light
blue crayon on an 80 %-light graphite rule — so for the 1.357 px of its width that overlaps, the
ring's edge dissolves into the rule at 16×16. This is a perceptual/adjacency reading rather than
a formal 1.4.11 verdict (the indicator's outer boundary against paper still reads 6.44), but it
is the reason "the ring may touch the rule" cannot simply be declared in the law: at 16×16, in
dark, touching means merging. It is also a reason to prefer the inset lever over the declaration
even if the guard is re-cut to boundary C.

**The third disposition, and the cheapest.** Score boundary **C** and say so: the hazard a
clearance guard exists for is a ring painting into the NEIGHBOUR's cell, and the neighbour begins
where the rule's ink ends. On C the guard is green at every board to 26×26 (16×16: **+1.823 px**),
the law gains the sentence "the ring may share ink with the rule, and does — it is the same hand
pressing twice", and MA-C is renamed to what it scores. What must not survive is a guard named
"no ring leaves its own cell" that scores a line the rule already crossed by 1.59 px before the
ring moved at all.

---

## 4 · §5 — the price of the pin, exactly (`probe/dbytes.mjs`, `logs/dbytes.txt`)

```
4×4    HEAD (segments 4)   6,685 B  ·  pinned 4    6,664 B  (417 B/cell, 17 nodes)  ·  segs 6  13,075 B
9×9    HEAD (segments 4)  49,928 B  ·  pinned 4   49,864 B  (616 B/cell, 17 nodes)  ·  segs 6  74,958 B
16×16  HEAD (segments 2)  58,761 B  ·  pinned 4  114,263 B  (446 B/cell, 17 nodes)  ·  segs 6 212,050 B
```

Pass 1's DOM read 6,664 / 49,864 / 114,263 B — identical. So the true sentence is **58,761 B →
114,263 B (57.4 KiB → 111.6 KiB)**, resident `d` strings, generated once per deal into the LRU.
Segments 6 is 207.1 KiB for a spread gain the population run says is 0 (the spread is seed noise).

---

## 5 · §6 — the fade, its carriers and its arrival (charter row 1)

**The library fact.** Tailwind v4.3.2's `transition-colors` is `color, background-color,
border-color, **outline-color**, text-decoration-color, fill, stroke`
(`node_modules/tailwindcss/dist/lib.mjs`). `transition` (`all`) includes it too.

**The carrier census, both engines** (`logs/transition-*.json`): of 15 distinct tab-stop classes,
10 list outline-color; **4 have a non-zero duration**:

| stop | file:line | duration | ships? |
|---|---|---|---|
| `.ctrl-btn` | `OptionSelector.vue:52` | **150 ms** | yes |
| `.attribution-trigger` | `AttributionCard.vue:45` | **200 ms** | yes |
| `.tuner-toggle` | `FilterTuner.vue:434` (`transition: all 200ms`) | 200 ms | DEV only (`App.vue:124`) |
| DebugToggle link | `DebugToggle.vue:29` | 200 ms | DEV only |

Pass 1 blamed `GameControlPanel.vue:190` — that utility is on a section **heading**
(`duration-250`), and `StagingBand.vue:154` carries the same heading utility. Neither is a tab
stop. **`.attribution-trigger` was never named by anyone.** The six `all @ 0s` stops
(`.logo-trigger`, `.drawer-tab`, `.info-btn`, `.cell-native-input`, two masthead links) are safe
today and one duration away from not being.

**Arrival, measured by me, both engines** (`instruments/arrival.probe.ts`, `logs/arrival-*.json`
— HEAD + the token injected exactly as the cure authors it): 11 stops, **4 late**, identical in
chromium and webkit — `.ctrl-btn` **150 ms**, the other three **250 ms** (a 200 ms carrier
sampled on a 150/250 grid). The trajectory is an oklab interpolation with rising alpha:
chromium `.ctrl-btn` 1 ms `oklab(0.1445 … /0.5)` → 30 ms `oklab(0.2856 … /0.598)` → 80 ms
`oklab(0.5399 … /0.923)` → 150 ms `rgb(58,123,196)`. (My arm keeps the `*` sweep, so the START
is the 50 %-alpha inherited colour; on the prototype, which deletes the sweep, the start is the
button's own `currentColor` — the critic measured `rgb(115,115,115)`, 4.66:1 on card. Same
arrival time either way: the carrier decides it.)

**The late set is exactly the carrier set** — no stop fades whose `transition-property` omits
`outline-color`, and none that lists it at 0s. `.icon-btn` transitions `background-color, color`
only (0.15 s) and takes the token in frame 1; `.sun-moon-toggle` transitions `transform` only.
Three of the seven early stops (`.logo-trigger`, `.drawer-tab`, `.sun-moon-toggle`) read early in
my arm because their own bespoke rule still out-ranks an injected (0,1,0) base token — exactly as
the prototype intends. Under the cure, which deletes two of those rules and rewrites the third,
they fall to the token and their own carriers (`all @ 0s`, `all @ 0s`, `transform @ 0.2s`) keep
them same-frame. Nothing in the cure creates a new late stop.

**The cure, and why one of the two options is not available.** `transition-property` cannot be
subtracted in CSS; Tailwind v4 ships no colours-minus-outline utility. So:

- **(a) exclude it at the carrier** — swap two class strings to
  `transition-[color,background-color]` (`OptionSelector.vue:52`, `AttributionCard.vue:45`).
  Two lines, no new constant, and it is the option the estate's own covenant prefers ("no new
  timing constants outside `pencilConfig`", `pencilConfig.ts:137-163`).
- **(b) declare it** — the fade becomes a named band in `MOTION` with a consumer. Note that
  `npm run lint:motion` does **not** police CSS transitions: it is the e2e per-file `PRM:`
  contract (`scripts/check-motion-contract.mjs`), so "declare it as motion" here means the
  `MOTION` ledger and a spec that asserts the duration, not a lint that already exists.
- A base-layer `:focus-visible { transition: … }` is NOT a cure: the shorthand resets the stop's
  other transitions, and (0,1,0) loses to the utility's own specificity anyway.

**G-ABS-4's wording.** With (a), "one settled colour" can become "one colour, same-frame", and
the gate should name `arrival.probe.ts` and assert `arrivalMs <= 1` for every stop. Without (a),
the gate must say "one colour after a 400 ms settle" and carry the four late stops as declared.

---

## 6 · §6 — the two faces nobody measured, and the route that mounts them (row 5)

**The route.** There is no router (`main.ts` mounts `App.vue`; `useGameGallery.ts:1-25` says so
outright). The deck is a VIEW over the same app, reached by the URL-truth param **`?view=gallery`**
(`useGameGallery.ts:44-50` parse, `:57-64` write, `:66-72` open). `.staging-face` mounts inside it
under `v-if="activeCard && activePick"` (`GameGallery.vue:983-984`). `.guard-face` mounts under
`v-if="guardCard"` (`GameGallery.vue:1005`), which needs a **dirty** board AND a select of a
DIFFERENT game (`:156`, `:656`). Pass 1 probed `/` and found neither — the elements are real,
the route was wrong.

**Measured at HEAD** (`logs/deck-chromium.json`, `logs/faces-*.json`), 1280×800, both themes,
both engines:

| subject | computed | painted ratio (annulus) | painted ratio (ring band) |
|---|---|---|---|
| `.staging-safe .staging-face` | `2px solid color(srgb .039 .039 .039 / .45)`, offset 4, radius 4.8 px | 3.14 light / 3.97 dark | **3.14 / 3.97** (agree) |
| `.staging-deal .staging-face` | same; ground `fg 8 %` | 3.14 / 3.97 | 3.14 / 3.97 |
| webkit, both | same | 3.18 / 4.00 | 3.18 / 4.00 |

Both faces **already clear 3:1 on both themes in both engines.** So the §2.3 row for them is an
idiom row (one ink, one offset, one hand) and not a floor row — and G-ABS-3's "RED at HEAD" is
carried by the UA stops, the logo and the deck card, not by these two. Under the token they go
to **4.29 light / 7.70 dark** (arithmetic; the method is validated on these very stops, above).

`.guard-face` could not be armed in this lane's automation (dirty board + cross-game select; my
three arming paths all landed in `select` instead of the guard). Its declaration is
**byte-identical** to `.staging-face`'s (`GameGallery.vue:1450-1453` vs `StagingBand.vue:431-434`,
same mix, same offset, same 0.3 rem face radius) and its ground is `bg-popover` vs the slip's
card, so its ratio is within 0.05 of the staging face's on both themes. **A prototype lane must
still arm it once** — the arming recipe that works by hand: write a digit, open the deck from the
wordmark, arrow to another game, Enter.

---

## 7 · §6 — the deck's HEAD arm, as a measurement (row 6)

`logs/deck-chromium.json`, HEAD tree, `?view=gallery`, `.gallery-viewport` focused:

```
activeDescendant gallery-card-0 · viewport outline-style none · cards 5 · owners with a ring 1
centre card  outline 2px solid color(srgb .039 .039 .039 / .4)  offset 4px  border-radius 8px
             reach 6 · airLeft 9.59 · airRight 713.59 · headroom 3.59 · WHOLE
dark         outline 2px solid color(srgb .928 .9248 .912 / .4) — same geometry
```

Pass 1 filed "reach 6 → 5, headroom 3.6 → 4.6" as a measurement when its probe had read the same
prototype tree twice. The HEAD arm is now real: **reach 6, headroom 3.59** (the card at index 0
rests at the left rung, 9.59 px of air). Under the token (2 + 3): reach **5**, headroom **4.59**.
The arithmetic pass 1 asserted is correct to 0.01 px — it just was not measured. It is now.

---

## 8 · §6 — the dock sheet, opened and settled (row 7)

393×699, `.drawer-tab` clicked, **900 ms settle** (`logs/dock-chromium.json`,
`logs/sheet-clipper-chromium.json`):

```
shut   .drawer-case [0, 699, 393, 483]   transform none (parked below the fold)
open   .drawer-case [0, 216, 393, 483]   overflow VISIBLE   ground transparent
22 focusable nodes inside · 18 reached by a real Tab walk · 3 are display:none (offsetParent null)
the real clipper is .controls-card (overflow: AUTO), not the case
```

Four readings a spec needs:

1. **Nothing clips the ring at the sheet's edge.** `.drawer-case` computes `overflow: visible`,
   so the token's 5 px reach is never cut by the sheet. The clipping ancestor is
   `.controls-card` (`overflow: auto`), and against ITS box the tightest ordinary control is the
   icon-button row at **8.39 px** — the token fits with 3.39 px to spare.
2. **One control already overruns its own scroller**: the full-width `.icon-btn`
   `[16, 681.03, 361, 50.17]` sits **32.2 px past** the clipper's bottom edge (it is the sticky
   act; the card scrolls under it). Its ring is clipped today, at HEAD, by the UA ring's 1 px
   just as it would be by the token's 5 px. That is W2's mechanic, not §6's ink — but §6's gate
   must not assert WHOLE on it.
3. **Three stops are 0×0** (`Easy`/`Medium`/`Hard` of the hidden tab) — and they are
   `offsetParent: null`, so a real Tab walk reaches **none** of them (40 presses, chromium).
   No zero-size ring hazard. A clean negative, worth banking so the next lane does not re-chase it.
4. **The toggle's ornament offset is viewport-dependent**: 54 px at 1280×800, **12 px** at
   393×699. §6's "one offset, plus the toggle's declared exception" must say the exception is a
   RANGE, not a number.

The portrait tab order with the sheet open, for the census's wording: 18 stops inside the sheet
(1 heading button, 11 `.ctrl-btn`, 6 `.icon-btn`), then the page chrome (`tuner-toggle`,
`attribution-trigger`, 2 links, DebugToggle, `sun-moon-toggle`, `logo-trigger`, `drawer-tab`).
**Two of those chrome stops are DEV-ONLY** (`App.vue:124` gates `FilterTuner`), so a "107 stops"
census taken on a dev server counts two stops production never paints. Run the census against a
built preview, or subtract them by name.

---

## 9 · §6 — the ring instrument, fixed and validated (row 14)

Pass 1's window is "the pixel that moved furthest inside the annulus". On `.info-btn` the washi
tooltip (`SheetWashiLabel.vue:104-120`, `opacity 0 → 1` over 150 ms, anchored to the button's own
box) lands inside that annulus.

```
.info-btn, HEAD, light            annulus max-change          outline's own painted band
chromium   outline 1px auto       18.10   ink [255,255,255]   3.72   ink [131,131,131]  (27/44 samples changed)
                                  at (+32, −1) from the box
webkit     outline 3px auto       17.61   ink [253,253,252]   2.15   ink [126,178,248]  (44/44)
                                  at (+32, −6)
```

2.15 is r0's own WebKit UA figure, recovered by a different method — and 126,178,248 is WebKit's
blue ring. The instrument, stated so another family can take it:

> **RING BAND.** Sample the outline's own painted band: four strips, one per side, on the band's
> mid-line (`outline-offset + outline-width/2` outward from the border box), 11 points along the
> middle 60 % of each side. Keep only samples whose ΔRGB > 12 between the unfocused and focused
> frames; the ink is the median of those, the ground is the median of the same pixels before.
> Report `changed/sampled` as the confidence. A row is the ring only if the ink matches the
> computed `outline-color` **composited over the measured ground at its own alpha** within
> ΔRGB ≤ 24.

**Run as banked** (`instruments/ring-band.probe.ts`, `logs/ring-band-*.json`), HEAD, 1280×800
light — this is G-ABS-3's born-RED census taken from the ring's own band rather than from
whatever moved most:

| stop | chromium | webkit | isTheRing | verdict vs 3:1 |
|---|---|---|---|---|
| `.info-btn` (UA) | 3.72 | **2.15** | null (a UA ring has no authored colour to match) | webkit RED |
| `.icon-btn` (UA) | 3.72 | **2.15** | null | webkit RED |
| `.ctrl-btn` (UA) | 3.67 | **2.15** | null | webkit RED |
| `.drawer-tab` (2px dashed) | 4.48 | 4.42 | true | green |
| `.logo-trigger` (40 % mix) | **2.70** | **2.69** | true | **RED both engines** |
| `.staging-face` / `.guard-face` (45 % mix) | 3.14 / 3.97 dark | 3.18 / 4.00 | — | green |
| `.game-card.is-center` (40 % mix) | 2.69 | — | — | **RED** |

So G-ABS-3's red set is precisely: **every UA stop in WebKit (2.15), the wordmark (2.70) and the
deck card (2.69)**. The dashed tongue and the two drawn faces already clear the floor — they are
in the cure for one hand, not for contrast. A dashed ring also declares itself in the reading:
only 16–25 of 44 band samples change, against 33/44 for a solid one.

Two implementation notes, both measured here: (i) the alpha composite is not optional — a
`color-mix(fg 45%)` ring computes `color(srgb .039 .039 .039 / .45)` and paints `[144,144,143]`,
so a raw comparison fails by ΔRGB 401; (ii) median over ALL samples fails on a ring that is
clipped on some sides (the deck card inside its scrollport returned 1.04) — median over CHANGED
samples is the version that works. Both fixes are in `probe/faces.probe.ts` / the `.info-btn`
run; the band form in `infobtn` is the correct one.

---

### 9.1 · What the ratio in G-ABS-3 actually is (background, not verdict)

WCAG 2.2 SC 2.4.13 (Focus Appearance, AAA) asks for two things: an indicator at least as large as
a **2 CSS px perimeter** of the unfocused component (`outline-offset` counts in CSS px, and a
solid 2 px outline is the canonical way to satisfy it), and **3:1 between the focused and
unfocused states at the same pixels** — a change-of-state ratio, explicitly *not* an adjacency
ratio. SC 1.4.11 (Non-text Contrast, AA) is the adjacency one.

So: the estate's painted-bytes method — ink vs ground **at the same coordinates**, before and
after focus — is by construction the **2.4.13** measurement, and the token's `2px solid` at
`outline-offset: 3px` is the canonical 2.4.13 geometry. The "≥3:1" the family has been writing
into G-ABS-3 is therefore a 2.4.13 number wearing a 1.4.11 citation. Both floors are 3:1, so no
verdict moves — but the gate should cite the criterion it measures, and the 1.86:1 dark reading
in §3 is the 1.4.11 half, which nothing in this family measures yet.

Sources: [W3C Understanding SC 2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html),
[wcag22aa.org · Focus Appearance](https://wcag22aa.org/new-criteria/focus-appearance/).

## 10 · §6 — the radius rule, declared (row 15)

**Exactly two focus rules in the estate mint a radius** (`grep -rn -A5 "focus-visible {" src/`):

- `HandwrittenLogo.vue:547` — `border-radius: 0.35rem`; the trigger has `border: none; padding: 0`
  and no base radius, so deleting the rule gives the wordmark's ring square corners.
- `GameCard.vue:439` — `border-radius: 0.5rem`; **`.game-card` has no base radius** (the file's
  other radii are `:460 inherit`, `:519 0.9rem`, `:619 50%`). So this declaration rounds the
  card's own box on focus — and `.live-face-slot` (`GameCard.vue:455-461`) is
  `overflow: hidden; border-radius: inherit`, so **the projected live board's clip corners round
  by 8 px the moment the deck takes focus**. That is a real pixel, undeclared by anyone, in the
  file the family is already editing.

The rule to write, in one sentence: **an outline traces its element's own `border-radius`; a
focus rule may not mint one.** Under it, the logo's 0.35 rem dies with the rest of its rule
(correct — nothing else about the wordmark is rounded), and the card's 0.5 rem MOVES to
`.game-card`'s base rule as a declared π delta with the live-face clip named, or dies. Both are
one-line edits and both are in the diff already.

---

## 11 · The three comments, with the numbers they should carry (row 4)

| comment | shipped in the pass-1 diff | what this pass measures |
|---|---|---|
| `pencilConfig.ts` "spread 4.2%" | 4.2 % | **6.14 %** on W1 at the product's seeds; **0 %** in the geometry (size-invariant); 1.54 % on W4 |
| `pencilConfig.ts` "against the grid rule's own 1.443 / 1.031 / 0.631 — inside [0.5×, 2.0×]" | r0's n=1 figures, per-size **mismatched** (1.443 is 9×9's, printed in 4×4's slot) | widened n=16/48/96: **0.813 / 1.070 / 1.262 px**; ring 0.543 / 0.859 / 0.892 px; ratios **0.668 / 0.803 / 0.707**; bands [0.406,1.626] / [0.535,2.140] / [0.631,2.524] |
| `gridPaths.ts` "58.6 KB → 114 KB" | 58.6 → 114 | **58,761 B → 114,263 B (57.4 KiB → 111.6 KiB)** |
| `pencilConfig.ts` "1.75 is the band FLOOR … ~0.93px of clearance" | 0.93 px | the clearance is **0.233 px on boundary A**, **−1.357 px on B**; the sentence should name the boundary and the board-16 ceiling |

---

## 12 · The two constants and the reactive object (row 10)

`BOIL_CONFIG` is `reactive({...DEFAULT_BOIL_CONFIG})` (`pencilConfig.ts:282`) with
`resetBoilConfig()` at `:284`. Its consumers are seven components reading `frameCount`,
`frameBoil`, `subgridBoil`, `cellBoil`, `intervalMs`, `outlineBoilPx`; **`FilterTuner.vue`
exposes sliders for five of those and none for `ringSigmaUnits`/`ringK`** (`:346`, `:357`,
`:368`, `:382`, `:396`). The ring geometry is read inside `useBoilCache(["cellRects", boardSize,
subgridSize, viewBoxSize, seed], …)` (`gridPaths.ts:48`), so a mutation or a
`resetBoilConfig()` can never reach a cached board.

**Cure: a frozen module const, exported from `pencilConfig.ts`.** It deletes two interface
fields, two object entries and the reactivity edge; `gridPaths.ts` keeps the value import it
already gained. It also removes a type obligation: every future `BoilConfig` literal would
otherwise have to carry two constants that no tuner can move.

---

## 13 · The grafts, and the chair's question

- **pose 0 IS the shipped artifact** (MRK-LIVE). This family's ring is a *static* path, not a
  pose stack — `generateCellRects` is not `boilRectFrames`, there is no frame index and no
  scheduler subscriber. The graft lands as the still-frame guard's SHAPE: assert the resident
  `d` of a focused cell equals `wobbleRect(...)` recomputed offline with the same seed — which
  `probe/k-window.mjs` already does for all 4096 seeds. A DOM-vs-library identity test is the
  cheapest possible "the artifact is the thing we designed".
- **`@property` registration** (MRK-LIVE). Nothing to register: the estate has **zero**
  `@property` rules and exactly two JS reads of custom properties, `--deck-slots` and `--edge`
  (`useCarouselGlide.ts:95`, `:159`), neither this family's. `--focus-ring`, `--focus-offset`
  and `--color-focus-sketch` are consumed by CSS only. **Caution if a later lane registers
  `--color-focus-sketch` as `<color>`: a registered custom property becomes interpolable, which
  would ADD a transition on the very property this family is removing one from.**
- **digit headroom / one-ground rank / stroke-opacity 0.95** (MRK-WASH). The one-ground rank
  touches this family at tier 2's FILL (`fill-opacity: 0.08`), which is the "selection body" the
  chair's §6.11 gate 2 scores against. `stroke-opacity 0.95` on the ring is a +0.06 change in
  the painted ratio (3.62 → ~3.68 light, 6.44 → ~6.52 dark, arithmetic) — inside the band, no
  clearance cost (opacity is not geometry).
- **THE CHAIR'S QUESTION, answered** (`probe/darkarm.mjs`, `logs/darkarm.txt`). Does the dark
  alias change §6.11's gate 2?

  ```
  selection body = focus ink at fill-opacity 0.08 over the card
    light                [237,243,248]   rim 50% teacher-red 2.04:1   rim 100% 3.74:1
    dark, HEAD (#3a7bc4) [ 22, 26, 31]   rim 50%             2.36:1   rim 100% 5.89:1
    dark, ALIAS (#6aabeb)[ 26, 30, 34]   rim 50%             2.33:1   rim 100% 5.65:1
  ```

  **The alias moves gate 2's reading by −0.03 in dark and not at all in light, and changes no
  verdict**: a 50 % teacher-red rim fails 3:1 on both dark arms (2.36 → 2.33) and fails harder
  in light (2.04); a 100 % rim passes in dark (5.89 → 5.65) and passes in light (3.74). The
  binding constraint on §6.11's rim is the LIGHT theme, which this family does not move.

---

## 14 · What the synthesizer must decide (the forks, each with its number)

1. **The boundary.** A (nominal box, 16×16 +0.233 px, ceiling board 16) · B (the rule's first
   ink, 16×16 −1.357 px, ceiling board 12) · C (the neighbour, 16×16 +1.823 px, ceiling board 26).
   Picking B forces lever `f ≤ 0.911`. Picking C is free and needs one sentence in the law — but
   that sentence has to survive the dark adjacency reading (ring vs rule **1.86:1**), so the
   honest cheap answer is C *plus* an inset that keeps the two marks apart at 16×16.
2. **The window.** W1 with k **0.3287** (comparable with r0's grid readings, CV 34.6 %, ±8.7 %
   SE at 4×4) or W4 with k **0.4430** (CV 14.3 %, ±3.6 % SE at 4×4, spread 1.54 %) with the
   grid's σ re-taken in the same window in the same commit.
3. **The fade.** Exclude at the two carriers (2 class strings) and say "same-frame" with
   `arrival.probe.ts` as the gate; or declare 150/200 ms and word G-ABS-4 with its settle.
4. **The radius.** Token-wide "an outline traces its element's own radius" (then `GameCard`'s
   0.5 rem moves or dies, with the `.live-face-slot` clip declared) or per-rule (then the logo
   keeps 0.35 rem and the family's deletion shrinks by one line).
5. **The constants' home.** Frozen const (deletes) or LRU key term (adds). The cache-hit hazard
   is real either way.

---

## 15 · Sketches

**(a) The three boundaries, at 16×16 — all figures in px at boardPx 636.**

```
        the ring's nominal rect                     the cell's edge = the rule's centre
                |                                              |
   ┌────────────┴───────────────────────────────────┐          |
   │                                    4.587 px    │          |
   │  ring ink outermost  ────────────────────────► │          ▼
   │  (excursion 2.642 + half-stroke 1.712 = 4.354) │      ░░░░█░░░░   ← rule, 3.18 px wide
   │                                                │      ░░░░█░░░░
   └───────────────────────────────── A ────────────┤          |
                          headroom A = +0.233 px    │          |
                                                    │   ◄─1.59─┤ rule's inner painted edge
                              headroom B = −1.357 px│          |
                              headroom C = +1.823 px│          ├─1.59─► rule's outer edge
                                                               ▲
                                       the NEIGHBOUR's cell starts here
```

**(b) What the lever buys (16×16, one cell, the ring inset to f·cellSize).**

```
   f = 1.00                     f = 0.86
   ┌─────────────┐              ┌─────────────┐      the rule
   │╔═══════════╗│              │             │      is the box edge
   │║  ring on  ║│  ink on ink  │  ╔═══════╗  │      the ring
   │║ the edge  ║│  1.36 px     │  ║ ring  ║  │      clears it
   │╚═══════════╝│              │  ╚═══════╝  │      by 0.78 px
   └─────────────┘              └─────────────┘
    B: −1.357 px  RED            B: +0.783 px  GREEN
    reads: a lozenge             reads: a drawn mark inside a ruled square
```

**(c) Who fades, and for how long (both engines, measured).**

```
   focus lands
   │
   ├─ 7 stops ────────────────────────────────────────────► token, frame 1
   │   .icon-btn (background-color,color @ .15s — not outline)
   │   .info-btn .logo-trigger .drawer-tab (all @ 0s)
   │   .sun-moon-toggle (transform @ .2s)  masthead link  cell input (exempt)
   │
   ├─ .ctrl-btn ──────────────► token at 150 ms      carrier OptionSelector.vue:52
   │   oklab .144/α.5 → .286/α.60 → .540/α.92 → rgb(58,123,196)
   │
   └─ .attribution-trigger ──────────► token at ~200 ms   carrier AttributionCard.vue:45
       (+ 2 DEV-only stops: .tuner-toggle, DebugToggle — never in a production tab order)
```

---

## 16 · Risks

1. **Re-cutting MA-C to boundary B reds the family's own 16×16 rung**, and the only cure is a
   geometry change (`f ≤ 0.911`) that touches every board's look. Choosing B without the lever
   is choosing to ship a red gate.
2. **`ringK` 0.3287 is right only for r0's window.** If the gate later moves to any other window
   without moving the constant, σ reads 27–35 % high and the "one visible hand" becomes a
   different hand. Constant and window must land in the same commit, named in both.
3. **A ±5 % per-board gate on W1 flakes at 4×4** (SE 8.7 %). Born-RED is not enough; a gate must
   also be born STABLE.
4. **Excluding `outline-color` at `OptionSelector.vue:52` changes a shipped hover feel** — the
   same utility carries the chip's colour lift. `transition-[color,background-color]` keeps it;
   a bare `transition-none` would not.
5. **`GameCard.vue:439`'s radius is load-bearing through `border-radius: inherit`.** Moving or
   deleting it moves the live board's clip corners — a π delta on a surface this wave has not
   claimed, and the goldens are unlikely to catch an 8 px corner (`maxDiffPixelRatio` 0.02, the
   chair's §6.2 reasoning about thin-line moves applies here too).
6. **The dock sheet's full-width act already overruns its scroller by 32.2 px.** Any §6 gate that
   asserts WHOLE across the sheet's stops will red on a mechanic W2 landed, not on this family's
   ink.
7. **Two DEV-only stops inflate every tab-order census** taken on a dev server. "107 stops",
   "26 painted", "one colour" all carry them.
8. **`.guard-face` is still unmeasured on a live surface** by anyone. Its declaration is
   byte-identical to `.staging-face`'s, so the arithmetic is safe — but the mount condition is
   the one surface in this family that no automation in two passes has reached, and a prototype
   lane must reach it before the row closes.
9. **The band instrument returns a number even when the ring is clipped** unless the changed-only
   median is used; a lane that copies the annulus form will report a tooltip and not know it.

---

## 17 · Files

All under this directory; nothing written outside it, nothing under `loop/r0/` or `loop/pass1/`.

- `probe/k-window.mjs` + `logs/k-window.txt` — four windows × three boards × 4096-cell
  population, off the shipped library. Reproduces pass 1's DOM σ and the critic's refit.
- `probe/clearance.mjs` + `logs/clearance.txt` — MA-C in closed form on three boundaries, the
  board-size ceilings, every lever priced, desktop and phone. Checked against pass 1's MA-C.
- `probe/dbytes.mjs` + `logs/dbytes.txt` — resident `d` bytes, HEAD vs pinned vs segments 6.
- `probe/darkarm.mjs` + `logs/darkarm.txt`, `logs/darkarm-gate2.txt` — the token over four
  grounds, the fade's start, the chair's §6.11 gate-2 answer.
- `probe/adjacency.mjs` + `logs/adjacency.txt` — the ring against the rule it overlaps, both
  themes (the 1.86:1 dark reading).
- `instruments/ring-band.probe.ts` + `logs/ring-band-*.json` — the banked ring instrument, run
  in both engines over five stops.
- `probe/census.probe.ts` + `logs/transition-*.json`, `deck-chromium.json`, `dock-chromium.json`,
  `tabwalk-chromium.json` — carriers, deck, dock, tab walk.
- `probe/faces.probe.ts` + `logs/faces-*.json`, `guard-chromium.json`,
  `sheet-clipper-chromium.json`, `zero-stops-chromium.json`, `scrollport-chromium.json` — the
  two faces, the sheet's real clipper, the zero-size negative, the scrollport negative.
- `probe/pw.config.ts` — the scratch config (the estate's default minus `webServer` and
  `globalSetup`, pointed at 127.0.0.1:4238). `probe/vite.*.config.mjs` — the two scratch vite
  configs (private `cacheDir`).
- `instruments/arrival.probe.ts` — THE ARRIVAL-TIME INSTRUMENT, banked for every family that
  claims same-frame. `INJECT_TOKEN=1` makes it runnable on a tree that has not landed the token.
- `instruments/r3a-wash-clause.diff` — r0's R3-a wash clause struck as a proposed diff, the row
  reported **MOVED**, with the 1.08/1.10 edge reading that strikes it.

Servers: `127.0.0.1:4238` (HEAD) started and killed by this lane. `:4239` was attempted for the
pass-1 prototype worktree and refused to boot (vite resolves a scratch config's own plugin
imports from the config file's nearest `node_modules`, which for an evidence-dir config is
`~/node_modules`). Every prototype-side reading here is therefore arithmetic from the diff plus
pass 1's banked logs, and is labelled as such; a prototype lane replaying the diff into a fresh
worktree gets the real surface back.
