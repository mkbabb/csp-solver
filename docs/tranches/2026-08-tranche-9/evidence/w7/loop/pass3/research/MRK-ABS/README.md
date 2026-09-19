# PASS-3 RESEARCH · MRK-ABS · The absolute ring (§5 §6)

Read-only on the product. Base `74a2b5d9` (the W7 execution fold — the chair's pass-3 control).
Server: 127.0.0.1:4239, private `cacheDir` under the session scratchpad, killed, port verified
clear (0 listeners). Both engines. One crop, 7.6 KB.

Probes `probe/`, readings `readings/`. Nothing under `r0/`, `pass1/`, `pass2/` touched.

---

## 0 · The headline

Pass 2's clearance model prices **one** rule — a cell line, stroke 5, sitting **on** the cell
boundary, drawn **straight**. The board paints three strokes at two positions and every one of
them wobbles. Corrected, the family's own law ("the ring never shares ink with the rule") is
**false at 9×9 and 16×16 on every edge cell**, and the pass-2 cure makes the 16×16 case slightly
worse than HEAD, not better. Measured live, both engines, to three decimals.

---

## 1 · The measured base (R4, `readings/r4-{chromium,webkit}.json`)

| reading | chromium | webkit |
|---|---|---|
| boardPx at 1280×800, 9×9 and 16×16 | **556** | **556** |
| boardPx at 4×4 | 412 | 412 |
| cellPx 16×16 | 34.75 | 34.735 |
| ghost viewBox 16×16 | `-9.375 -9.375 81.25 81.25` | same |
| ghost path screen scale (px per ghost unit) | **0.427692** = 556/1300 | **0.427692** |
| grid path screen scale | 0.556 = 556/1000 | 0.556 |
| `.cell-ghost-path` computed `filter` | `none` | `none` |
| live filter census (own filter ≠ none, display ≠ none) | **9** | **9** |
| `.cell-ghost-path` stroke / stroke-opacity / fill-opacity (tier 2) | `rgb(58,123,196)` / 0.9 / 0.08 | same |
| resident poses per rule at 16×16 | 96 cell-line + 24 subgrid-line paths (= 24×4 + 6×4) | same |

**π/scale row, MOVED:** pass 2 and the critic both price px at **boardPx 636**. On `74a2b5d9`
at 1280×800 the board is **556 px** at 9×9 and 16×16 (412 at 4×4, unchanged). Every px figure
in `pass2/prototype/MRK-ABS/README.md` §2 and `pass2/critique/MRK-ABS.md` §2.1 is 14.4 % too
generous. The RATIO `boardPx/1300` survives intact and is re-confirmed on both engines — it is
the model that holds, the constant that moved. **Charter item 13 (filterBudget both engines)
reads 9/9 at HEAD** and is the control the prototype's 9 must be re-read against.

## 2 · The three rules, not one (R1/R2 offline + R5 live)

`HandDrawnGrid.vue:339/353/366` declares three stroke weights and `gridPaths.ts:338-339` puts
the frame's **vertical** sides 12 board units INSIDE the first/last column:

| rule | stroke (board units) | position | half-band |
|---|---|---|---|
| `path.cell-line` | 5 | on the cell boundary | 2.5 |
| `path.subgrid-line` | 8 | on the cell boundary | 4.0 |
| `path.frame-line` top/bottom | 12 | `FRAME_Y_PAD 0` — flush | 6.0 |
| `path.frame-line` left/right | 12 | `FRAME_X_PAD 12` — **12 u inside column 0 / N−1** | 6.0 |

`clearance-p2.mjs` / `clearance-tiers.mjs` hard-code `RULE_HALF = (5/2)*1.3` and treat the rule
as its nominal coordinate. Both assumptions are load-bearing.

### 2.1 LIVE, both engines, identical to 3 dp (`readings/r5-*.json`)

16×16, light, 1280×800, `74a2b5d9`, tier 2 (`:has(input:focus-visible)`, stroke 7 → 2.994 px),
54 sampled ordinates per side, all four boil poses unioned:

| cell | the rule its LEFT side faces | rule stroke px | worst gap | median | ordinates overlapping |
|---|---|---|---|---|---|
| 0 (r0,c0) | **frame** | 6.672 | **−7.803 px** | −7.612 px | **100 %** |
| 20 (r1,c4) | subgrid | 4.448 | +0.208 px | +0.239 px | 0 % |
| 18 (r1,c2) | cell | 2.780 | +0.822 px | +0.855 px | 0 % |

`readings/crop1-corner-frame-light-16x16-head.png` (7.6 KB, dpr 3, LIGHT — the theme pass 2
never cropped) is that −7.6 px: the crayon ring's left and top strokes are painted over the
graphite frame, and the frame disappears behind them for the whole side.

### 2.2 The closed form, validated against that reading

Ring's outer ink, measured from the cell's own edge, in board units:

```
A(cs) = cs·((1−f)/2 + 0.15)/1.3  −  (W + hs)/1.3
         └── the ghost squeeze ──┘   └ wander + half-stroke ┘
```

`f` = inset factor, `W` = wander in ghost units, `hs` = half stroke in ghost units, `cs = 1000/N`.
At HEAD (`f = 1`, `W = 0.4·cs·0.015`, `hs = 3.5`), 16×16: A = 4.231 u; the left frame's inner
ink is at 18 u ⇒ gap **−13.77 u = −7.66 px** at boardPx 556. **R5 read −7.803 / −7.612.** The
0.15 px residue is the frame's own wobble. The form is trustworthy; the inputs were wrong.

### 2.3 The honest ceiling table (charter item 2 — worst TIER *and* worst RULE)

Largest whole board at which the gap reaches zero, at the prototype's `f = 0.86`, `W = 5.4`:

| rule faced | tier 2 (stroke 7) | tier 2×3 (stroke 10) |
|---|---|---|
| cell line | 18 | **16** ← pass 2's "B 18" is this column's wrong row |
| subgrid line | **15** | **14** |
| frame top/bottom (flush) | **13** | **12** |
| frame left/right (inset 12 u) | **6** | **6** |

Sudoku ships 4/9/16. `pencilConfig.ts`'s shipped comment ("board 24 on A, board 18 on B, board
38 on C") is tier 2 against a cell line only; the product's heaviest tier against the rule it
actually meets on a board edge ceilings at **6**.

### 2.4 The cure has a CROSSOVER and it is inside the shipped range

A(cs) is linear in `cs` for both geometries; they cross at

```
0.16923·cs − 6.846  =  0.110769·cs − 2.6923   ⇒   cs = 71.05   ⇒   N = 14.07
```

**For boards ≤ 14 the pass-2 inset improves clearance; at 15 and 16 it makes it worse.** At
16×16, tier 2, against a cell line: HEAD +1.731 u, prototype **+1.234 u**. The inset buys
`0.07·cs/1.3` = 3.365 u of margin at 16×16 and the wander spends 3.865 u of it. The family's
own gate reported this as a cure (RED → GREEN) because pass 1's geometry, not HEAD's, was the
comparison. Against the FRAME the prototype is 0.36 u deeper than HEAD (R2: −20.055 vs
−19.692 u).

### 2.5 Full sweep, `readings/r2-matched.txt`

Worst gap in board units, matched ordinate, all poses, all cells, tier 2 / tier 10:

| board | geometry | cell | subgrid | frame |
|---|---|---|---|---|
| 4×4 | proto | +30.15 / +29.00 | +26.43 / +25.28 | +14.97 / +13.81 |
| 4×4 | HEAD | +18.82 / +17.66 | +12.64 / +11.49 | +2.86 / +1.71 |
| 9×9 | proto | +4.52 / +3.36 | +1.78 / +0.62 | **−11.78 / −12.93** |
| 9×9 | HEAD | +1.94 / +0.79 | **−2.70 / −3.85** | **−14.38 / −15.54** |
| 16×16 | proto | **−3.20 / −4.36** | **−9.15 / −10.31** | **−20.06 / −21.21** |
| 16×16 | HEAD | **−3.53 / −4.69** | **−9.23 / −10.39** | **−19.69 / −20.85** |

`readings/r2-matched.txt`'s "straight" column reproduces pass 2 exactly (16×16 proto tier 2 cell
= **+0.783 px**, tier 10 = **+0.050 px** at boardPx 636) — the model is pass 2's, with the two
assumptions lifted.

## 3 · The ink ledger, recomputed from the declared tokens (R3, `readings/r3-ink.txt`)

Independent WCAG arithmetic over `index.css`'s own hex/hsl. It reproduces every figure the
critic verified (token 4.289/4.188 light, 7.696/7.863 dark; board ring 3.942 light / 7.041 dark
at 0.95) and adds three the passes never read:

1. **`--color-focus-sketch` has NO dark arm at HEAD.** Declared once, `index.css:219`; the
   `.dark` block (`:362-441`) does not redeclare it. **Live, both engines: the 16×16 board's
   focused ring computes `rgb(58,123,196)` with `document.documentElement.classList` carrying
   `dark`** (`r4-*.json .darkTokens.ringStroke`). `index.css:222`'s "Dark mode keeps crayon-blue
   (5.3:1, comfortable)" is false on the surface — the shipped dark ring is **3.690 : 1** over
   `--color-card`. The prototype's `.dark` alias takes it to **7.041** and makes the comment
   true. That is the family's largest unclaimed win.
2. **Ring-vs-rule separation is the one number where three sources disagree in DIRECTION.**
   Token arithmetic: HEAD light 4.101, HEAD dark 3.251; with the prototype's dark alias, light
   3.771 and dark **1.703** (the lighter `#6aabeb` collides with dark's light-grey rule
   `rgb(209,207,199)`, read live). The prototype's painted bytes said 1.39 light / 5.42 dark.
   The spec said 4.11 / 1.86 — which is exactly *HEAD light / aliased dark*, i.e. the spec mixed
   two geometries. Only one instrument can be the reader's truth, and the grid is grain-BAKED
   and boiled, so its painted ink never reaches its token (ACC-FIVE's critic's 1.4.11 painted-line
   law). **Pass 3 must price this off painted bytes with the ring's own band, in both themes,
   and strike the token arithmetic from the claim.**
3. **The rings the family replaces are under the floor and the replacement clears it by 1.6×.**
   `color-mix(--color-foreground 40%)` reads **2.705** light / 3.423 dark over `--color-card`
   (the 45 % variants, `.staging-face`/`.guard-face`: 3.152 / 4.014). The one token reads
   **4.289 / 7.696**. This is the family's thesis and it survives an independent recompute.

## 4 · The surfaces and tokens this family touches, at `74a2b5d9`

| file:line | what is there now |
|---|---|
| `src/assets/index.css:219` | `--color-focus-sketch: #3a7bc4` — **2 consumers** (`gameCell.css:246,248`), no dark arm |
| `src/assets/index.css:445` | `@layer base { * { @apply border-border outline-ring/50 } }` — the universal outline colour the family deletes |
| `src/assets/index.css:727-732` | `.sudoku-cell:focus-within { background … ; outline: 1px solid color-mix(--color-ring 30%) ; outline-offset: -1px ; border-radius: 2px }` — **the charter's ":779" is `:727` on this base** |
| `src/games/shared/gameCell.css:189-197` | tier 1 `.cell-ghost-path` stroke 5 / opacity 0.65 |
| `gameCell.css:229-240` | tier 4 peer stroke 4 / opacity **0.55** ← registry §2.5 rules this to 0.80 under §6's leader |
| `gameCell.css:245-258` | tier 2 stroke 7 / opacity 0.9; `fill:`/`stroke: var(--color-focus-sketch, var(--color-crayon-blue))` — the fallback that cannot fire |
| `gameCell.css:273-279` | tier 3 stroke 9 |
| `gameCell.css:286-292` | tier 2×3 stroke **10** — the unmeasured tier |
| `gameCell.css:294-303` | `.game-cell:focus-within { background: transparent; outline: none }` — **exists only to neutralise `index.css:727`; it dies with it** |
| `gameCell.css:319-327` | PRM: `animation:none`, `stroke-dashoffset: 0` |
| `gameCell.css:330-341` | `prefers-contrast: more` — 0.9 / 1 / 0.8 |
| `gameCell.css:352-356` | `forced-colors` — `outline: 2px solid Highlight; outline-offset: -2px` |
| `gameCell.css:7` and `:10-11` | prose that certifies `index.css`'s `:focus-within` ring **preserved**; `DigitCell.vue:33-34` says the same |
| `src/games/shared/useGameCell.ts:85-96` | the ghost viewBox — `pad = cellSize * 0.15`, the 1.3 squeeze |
| `src/games/shared/GameBoard.vue:156-158` | `VIEWBOX_SIZE = 1000`, `generateCellRects(N, sg, 1000, 42)` |
| `src/pencil/grid/gridPaths.ts:42-70` | `generateCellRects` — `roughness: 0.4`, `segments: boardSize >= 16 ? 2 : 4`, `seed: 42+500+pos*7`, `jagged` |
| `gridPaths.ts:338-339` | `FRAME_X_PAD 12`, `FRAME_Y_PAD 0` — shared with the W9 violet trace "in registration" |
| `gridPaths.ts:448` | internal rules run `pad 26 … 1000-26` |
| `gridPaths.ts:478-520` | rule roughness 0.4 (cell) / 0.7 (subgrid), segments 4 / 5 |
| `pencilConfig.ts:269-273` | `frameCount 4`, `intervalMs 150`, `frameBoil 1.2 / subgridBoil 0.6 / cellBoil 0.3` |
| `pencil/config/filterBudget.ts:171-185` | `FILTER_BUDGET_TOTAL` = 9, ceiling 14 |
| `HandwrittenLogo.vue:544-548` | `2px solid color-mix(foreground 40%)`, offset 4, **`border-radius: 0.35rem` (5.6 px)** |
| `GameCard.vue:436-440` | the deck ring — 40 %, offset 4, `border-radius: 0.5rem` |
| `GameGallery.vue:1193-1195` | `.gallery-viewport:focus-visible { outline: none }` |
| `GameGallery.vue:1446-1453` | `.guard-btn` → `.guard-face` 45 %, offset 4 |
| `StagingBand.vue:427-434` | `.staging-btn` → `.staging-face` 45 %, offset 4 |
| `DrawerTab.vue:151-154` | `2px dashed currentColor`, offset 3 |
| `DarkModeToggle.vue:740-743` | `2px solid var(--color-ring)`, `offset: calc(2px − var(--toggle-bleed,0px))` |
| `SheetWashiLabel.vue:121` · `GameControlPanel.vue:1611,2162` · `DifficultyTally.vue:357` | `:focus-visible` used as a REVEAL state, not a ring — these must not be swept |

Primitives available with no new substrate: `wobbleRect`, `wobbleLinePoints`, `perturbPoints`,
`perturbPointsClosed`, `boilLineFrames`, `boilRectFrames`, `ellipsePoints`, `useBoilCache`
(`@mkbabb/pencil-boil@0.12.0`, `dist/path.js`). The amplitude law is one line, `path.js:63`:
`maxDisplace = roughness * len * 0.015`, with `overshoot = roughness * len * 0.003` at the ends
— so the prototype's inversion also pins the corner overshoot at exactly `0.2 × wanderUnits`
= 1.08 units, a constant nothing has named.

**No `@property` exists anywhere in `src/` at HEAD** — MRK-LIVE's `--focus-ring-outset` graft is
new substrate for the whole wave, and chair §6.5 makes `initial-value` + no-fallback the law.

## 5 · σ in the reader's px (charter item 3)

σ (W4 population, prototype's own measurement) = 2.3922 ghost units, constant by construction.
At this base's measured boardPx:

| board | px/unit | σ px | drawn edge px (f=0.86) | σ ÷ edge | σ ÷ cell |
|---|---|---|---|---|---|
| 4×4 | 0.31692 | **0.758** | 68.14 | 1.113 % | 0.736 % |
| 9×9 | 0.42769 | **1.023** | 40.87 | 2.504 % | 1.657 % |
| 16×16 | 0.42769 | **1.023** | 22.99 | **4.451 %** | 2.944 % |

(Pass 2's 1.170 px at 16×16 was boardPx 636; on `74a2b5d9` it is 1.023.) The reader's quantity
is **σ ÷ drawn edge**: constant in units, 4.00× wider at 16×16 than at 4×4.

**G-ABS-1's band, derived (charter item 4).** The estate already owns both poles, in
`r0/r3-marks/R3-census.md`:
- the CAD pole — `:57` ring σ 0.092 px against `:55` rule σ 1.443 px, ratio **0.064**, which the
  census itself calls the defect;
- the house's own spread — `:55-57` frame σ 1.145 vs cell-rule σ 1.443 px (0.794 within one
  board) and `:72-76` cell-rule σ 1.031 / 1.443 / 0.631 px across boards, i.e. the grid's own
  rules already differ from each other by 0.437× … 2.287×.

So `[0.5, 2.0]` is **"inside the spread the grid's own hand already shows"**, rounded in from
[0.437, 2.287] — a derivation the gate can state and cite, with the floor ≥ 7× the CAD pole. The
gate must also say **which quantity**: the ratio is dimensionless only if both σ come from ONE
run (`k-window-p2.mjs` does; the gate's prose does not say so).

## 6 · Instrument findings pass 3 inherits

1. **Scope every grid query to ONE `.board-shell`.** R4's first run read `path.frame-line` with a
   bare `document.querySelector` and returned a −97.97 px "gap" that is an artifact (its
   "left quintile" filter selected the TOP edge's second vertex at board x 174.7). `r4-*.json`'s
   `bands.gapLeftPx` is **STRUCK**; `r5-*.json` is the reading. Any lane comparing a cell-scoped
   mark to the grid must scope both sides and say it did.
2. **Node ESM resolves from the SCRIPT's directory, not the cwd** — running a probe in `docs/`
   from `web/frontend` still cannot see `@mkbabb/pencil-boil`. Import the absolute `dist` path
   (`probe/r1-*.mjs:16`) or set `NODE_PATH` (what the Playwright runs here use). Extends
   registry §7's scratch-config trap to plain node.
3. **`Math.min(...arr)` blows the stack** at 16×16×4 sides×sampled ordinates; fold instead.
4. **WebKit's Tab reaches form controls only** (the critic's §2.4) — every reading in R4/R5 uses
   programmatic `.focus()` plus one `Shift` press to set keyboard modality, which gives
   `:focus-visible` on the cell input in **both** engines. That recipe closes charter item 7 for
   any stop whose element is focusable; it does **not** make a Tab-ORDER census executable in
   WebKit, so a whole-surface walk stays chromium-only unless it is re-cut as a DOM walk.

## 7 · The risks, named

- **The frame overlap is not a regression and cannot be cured by the inset.** Clearing the
  left/right frame at 16×16 needs the ring's edge ≥ 24.85 board units from the cell edge = 39.8 %
  of the cell per side, i.e. a ring ~20 % of the cell wide. The lawful moves are (a) scope the
  law to cell+subgrid rules and declare the frame case measured and accepted, (b) move
  `FRAME_X_PAD` to 0 — which drags the W9 violet progress trace with it (`gridPaths.ts:333-339`
  states the shared-constant contract), or (c) make the ring's inset per-side. Every one of
  these is a §6-leader decision, not this family's alone.
- **Deleting `index.css:727` is a four-site edit**: the rule, `gameCell.css:294-303` (dead
  without it), and the two prose contracts (`gameCell.css:7`/`:10-11`, `DigitCell.vue:33-34`).
  `.sudoku-cell` itself is load-bearing (`useKeyboardViewport.ts:61 CELL_SELECTOR`,
  `DigitCell.test.ts:344`, six e2e specs) — delete the RULE, never the class.
- **The peer ring's 0.55 → 0.80 (registry §2.5) lands in this family's sheet** and raises tier 4's
  ink toward tier 1's; the tier ladder's whole argument (`gameCell.css:203-205`) is that a peer
  presses lighter. Whoever lands it must re-argue that comment or the ladder's reason dies.
- **`cellSegments` is `boardSize >= 16 ? 2 : 4` at HEAD** (`gridPaths.ts:53`); the prototype makes
  it a constant 4. That is a real bytes/geometry delta on the biggest board (pass 2 measured
  58,761 → 119,894 B) and it is the reason the 16×16 ring gets more vertices to wobble.
- **`--color-focus-sketch`'s missing dark arm means the hex census cannot see the fix** (a hex
  census is blind to a `var()` arm, which is why pass 2 extended it). ACC-GRAPHITE retires
  `--color-crayon-blue` on its own tree (chair §6.11) — if the dark arm aliases onto it, the two
  lanes collide on one token and the accent fold decides.
- **Crops, cap.** `evidence/w7/` was 41 MB at pass 2. This lane banks ONE 7.6 KB PNG.
