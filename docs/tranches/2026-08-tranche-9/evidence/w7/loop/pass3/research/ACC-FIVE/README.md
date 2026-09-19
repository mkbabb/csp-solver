# ACC-FIVE — pass-3 RESEARCH

Five crayons at different pressures. §3 / §4 / §12, M07. Read-only on product files; nothing
under `loop/r0/`, `loop/pass1/` or `loop/pass2/` was written.

- **Control commit `74a2b5d9`** (the W7 execution fold), served read-only at
  `http://127.0.0.1:4236` from the frozen main tree with a private `cacheDir` in the session
  scratchpad (`probe/vite.head.mjs`). Server killed; **4236 verified free**. No crops minted —
  every claim below is a number.
- Probes `probe/`, readings `readings/`. `probe/oklch.COPY.mjs` is r0's converter, copied.
- The pass-2 diff (worktree `wf_8630d340-e56-41`, 7 files, +310/−83) was read whole but not
  replayed: every question this lane had to answer is answerable on HEAD, because the gauge's
  geometry and both of its grounds are identical there.

---

## 1 · THE CENTRAL FINDING: there is a corridor, it is 0.034 wide, and the pass-2 ink is outside it

The critic's row 1 is right and its scope is bigger than it looks. The trace has **two**
grounds, not one, and they pull in opposite directions:

| theme | painted frame line | painted paper | the trace must be |
|---|---|---|---|
| light | **(49,49,49)** (token `hsl(0 0% 15%)` = 38,38,38) | (253,253,252) | lighter than the line, darker than the paper |
| dark | **(199,197,190)** (token `hsl(48 10% 80%)` = 209,207,199) | (19,18,17) | **darker** than the line, **lighter** than the paper |

Both grounds read byte-identical in chromium and webkit (`readings/r4-adjacency*.json`). A
1-px-wide token never paints its own value: the 12-unit hand-drawn frame antialiases to
(49,49,49) / (199,197,190), and that painted value — not the token — is what a ratio is owed
against.

Solving both floors at once gives the **feasible painted-core luminance corridor**
(`readings/r1-window.json`):

```
light   coreL ∈ [0.19214 .. 0.29387]     width 0.1017
dark    coreL ∈ [0.11835 .. 0.15264]     width 0.0343      ← 3x narrower
```

`#7d6902` paints coreL **0.1584** — 0.006 above the dark ceiling. That is the whole defect:
not a wrong hue, a ceiling overshoot of about 4% of a luminance.

### The two grounds are BOTH adjacent, measured

Whether the line is an adjacent colour at all decides whether re-grounding to the card is
available. It is not available. Geometry, at HEAD, 1280×800:

| fact | value | source |
|---|---|---|
| board | **636 CSS px**, viewBox 1000 | `r2-paint.json` `geom` |
| frame line stroke | 12 units = **7.63 px** @ `stroke-opacity 0.95` | `HandDrawnGrid.vue:339` |
| progress trace stroke | 8 units = **5.09 px** @ `stroke-opacity 0.95` | `HandDrawnGrid.vue:472` |
| graphite flank left beside the gold | **1–2 px, in 24 of 24 sampled columns**, every engine, every theme | `r4-adjacency.json` `medianFlankPx`, `columnsWithNoFlank: 0` |
| trace path | **493 points × 4 poses**; live frame path 25 segments | `r2-paint.json`, bench `pointsPerPath` |

An 8-unit stroke laid inside a 12-unit stroke leaves (12−8)/2 = 2 units = **1.27 px of
graphite on each side**, and the paint agrees: the flank is never zero. The trace is a pencil
drawn *inside* a wider pencil line, so both the line and the paper are its neighbours, and
**both 3:1 arms bind by construction**. The card cannot be declared the operative ground; it
can only be declared the operative ground *as well*.

---

## 2 · THE SECOND LEVER NOBODY PRICED: `stroke-opacity`

`.progress-trace` paints at `stroke-opacity="0.95"` — so it blends 5% of **the very line it
must stay 3:1 below** into itself. Taking the stroke to 1 costs one attribute and buys more
than any hue does. Measured, modal core over 24 columns, **identical in chromium and webkit**:

| theme | ink | α | vs frame line | vs paper | worst |
|---|---|---|---|---|---|
| dark | `#7d6902` (pass 2) | 0.95 | **2.916** | 3.715 | **2.916 ✗** |
| dark | `#7d6902` | 1 | 3.123 | 3.469 | 3.123 ✓ |
| dark | **`#79650f`** (corridor) | 0.95 | 3.081 | 3.517 | 3.081 |
| dark | **`#79650f`** | **1** | **3.303** | **3.280** | **3.280 ✓** |
| dark | `#75662c` (balanced) | 1 | 3.292 | 3.291 | 3.291 ✓ |
| light | `#a47903` (pass 2) | 0.95 | 3.098 | 4.126 | 3.098 |
| light | `#a47903` | 1 | 3.292 | 3.882 | 3.292 |
| light | **`#a87e13`** (corridor) | **1** | **3.505** | **3.646** | **3.505 ✓** |

Both candidates hold kinship on the **painted** core: dark `#79650f` reads h 94.5–95.2°
(Δ 0.01–0.72° from crayon-gold's 95.2°), light `#a87e13` reads h 83.9–84.8° (Δ 0.23–1.14° from
83.7°). OKLCH: `#79650f` = L 0.512 / C 0.100 / h 94.5; `#a87e13` = L 0.618 / C 0.122 / h 83.9.

**The chroma ceiling is real and it is the design cost.** In dark, nothing at C ≥ 0.12 clears
both floors — the best C 0.12 candidate scores 2.317. The night gauge can be gold at
**C ≤ 0.10**, and no more. Light is unconstrained to C 0.126.

---

## 3 · THE HEAD ROW THE RECORD NEVER MEASURED (critic row 3)

The violet at HEAD, painted on the same grounds, both engines:

| theme | HEAD `#8b5cf6`/`#7c3aed` @0.95 | pass-2 gold @0.95 | **recommended** (corridor @α1) |
|---|---|---|---|
| light | **2.876** ✗ | 3.098 ✓ (+0.222) | **3.505** (+0.629) |
| dark | **3.139** ✓ | **2.916 ✗ (−0.223)** | **3.303** (+0.164) |

So the spec's sentence — *"the worst of the four arms rises 3.35 → 3.57 light and 3.05 → 3.18
dark"* — is, on painted bytes, **a rise in light and a fall in dark**, and neither pair of
numbers is the pair the comment states. HEAD itself fails 1.4.11 in light (2.876): the hue
move is not only defensible, it cures a standing defect — in one theme, and only with the
corridor ink.

**Provenance (critic row 2), stated so the comment can be written true.** No painted read
produces 3.59 / 3.22: those are token arithmetic against the *token* grid line. The honest
forms are either (a) token arithmetic, named as such — `#a47903` vs `hsl(0 0% 15%)` at 0.95 —
or (b) the painted figures in §2, which are what a person sees. They differ by ~0.5 of a ratio
and the painted one is always the smaller. Carry the painted pair, name the engine-agnostic
instrument, and drop "read off the painted bytes" from any line that is arithmetic.

---

## 4 · THE WIN HAS ITS OWN CONTRAST ROW, AND THE DEAD RULE IS ITS CURE

At the win the trace lifts to `--color-gold-star`. On the same painted grounds:

| theme | wax vs frame line | wax vs paper |
|---|---|---|
| light `#c99a2e` | 5.046 | **2.533** (the number already booked for the owner) |
| dark `#e5c74d` | **1.037** | 11.234 |

In dark the won gauge is **1.037:1 against the graphite it is drawn inside** — it disappears
into the line unless the line itself turns gold. The rule that would turn it —
`.solve-success .grid-line { stroke: var(--color-gold-star) }` (`index.css:588`) — is exactly
the rule pass 2 measured at **0 painted px** under the bake and kept "for print". So critic row
13 and the win's own legibility are one row, not two: the frame's gold is not dead weight, it
is the missing half of the hand-off, and it is dead because the bake hides the vector stack.
Three dispositions worth costing: recolour the BAKED stack at the win; keep the trace at ink
pressure and let the wax arrive only on the frame; or accept 1.037 with a stated reason (at
100% the gauge no longer carries a boundary, so no fill state is being read).

---

## 5 · PRIMITIVES TO REUSE — named, with lines

| need | primitive that already exists | where |
|---|---|---|
| token → sRGB through `var()` aliases, per theme scope | `colorOf(scope, token)`, `themesOf()`, `parseColor`, `mixOf`, `over()` | `scripts/check-ink-pressure.mjs:215–300` |
| a contrast LADDER with floors and a negative control | `LADDER` + `--self-test` | `check-ink-pressure.mjs:94–97` |
| **the alias-only census G8 asks for** | already computed and printed as `strays` — "ALIAS-ONLY (live through a live token, kept)" | `scripts/check-theme-tokens.mjs` (tail) |
| gate grammar (`--self-test` mints a negative control or exit 2) | every `lint:*` script | `package.json` scripts, `.github/workflows/ci.yml:944–1062` |
| OKLCH both directions, in-gamut flag, hue distance | r0's converter | `loop/r0/r2-accent-family/probe/oklch.ts` → `probe/oklch.COPY.mjs` |
| the ring geometry and its arc-length cut | `generateFrameTraceFrames`, `poseLengths`, `poseFronts` | `gridPaths.ts:340–455` (pass-2 diff) |
| the π rect census | `rect-census-fold.mjs` (ENGINE env, permalink-pinned board, PRM emulated) | `evidence/w7/exec/integrate/rect-census-fold.mjs` |
| a second `poseLengths` consumer (critic row 16) | `DifficultyTally.vue:230–232` still carries `pathLength="100"` + a CSS dash on a ~100-segment arc | `src/games/shared/DifficultyTally.vue` |

**G1's kinship gate does not need a new file.** `check-ink-pressure.mjs` already resolves a
token to sRGB per theme and already carries the self-test grammar; a KIN table
(`--color-progress-ink` → `--color-crayon-gold`, `--color-user-ink` → `--color-crayon-blue`)
plus ~20 lines of OKLCH is a committed instrument that reds on a two-degree edit. **G8's gate
is ten lines**: assert `strays ⊆ allowlist` in `check-theme-tokens.mjs` and exit 1 otherwise —
the census that finds them is already written and already printing.

**G9's term (critic row 10), re-stated so it can fail.** The in-family band 40–115° carries
30,794 of 33,938 chromatic px light and 22,425 of 24,563 dark (`pass2 board-ink.json` bins) —
91% either way, because the estate's warm chrome lives there. A term that answers *are the
accents kin* is per-anchor, not per-band: **every pixel at C ≥ 0.05 lies within KIN_DEG 5° of
one of the five crayon anchors, or inside a named exception ledger** (solver rainbow, the peer
walk, the difficulty crayons), with the ledger's share reported and capped. Born-RED control:
move one anchor 6° and the census must red. KIN_DEG 5 and the anchors are r0's
(`loop/r0/r2-accent-family/README.md:258`, `census/kinship-*.json`).

---

## 6 · MOTION — the tween is affordable, and the number is measured

Four ~490-point `d` rewrites per frame, rAF loop, 60 frames, against a no-rewrite control on
the same page (`r2-paint.json` `bench`):

| engine | control median / p95 / >20 ms | rewriting median / p95 / >20 ms |
|---|---|---|
| chromium | 8.3 / 9.3 / 0 | **8.3 / 8.8 / 0** |
| webkit | 17.0 / 18.0 / 1 | **17.0 / 22.0 / 3** |

The median frame does not move in either engine; WebKit's tail grows ~4 ms and gains two long
frames in sixty. So "tween the FRACTION on the boil scheduler and re-cut `poseFronts` per
frame" is **not** a perf refusal — at a 240–520 ms band that is 15–30 re-cuts, inside budget —
and the paint-cost assertion of pass 2 (critic row 12) is now a reading rather than a claim.
The duration is a `--motion-*` rung (registry §2.1): note that **no `--motion-*` token exists
in `index.css` today** — the rungs live in `pencilConfig.ts` `MOTION` and reach CSS by
`v-bind`, which is the route the pass-2 diff already used for `traceWinMs`. The same route
retires the `transition: filter 200ms` literal in `GameControlPanel.vue:2086` (critic row 18);
`lint:motion` will not catch it — `check-motion-contract.mjs` gates PRM declarations in e2e
specs, not timing literals, so this is a discipline row, not a gate row.

---

## 7 · THE PHONE, AND WHAT THE COMPRESSION DOES (critic row 15)

393×699 dpr3, both engines, HEAD (`r2-paint.json` `phone`):

| reading | value |
|---|---|
| board | **365 CSS px** (1095 device px) |
| trace stroke | **2.92 CSS px** (8.76 device px) |
| frame stroke | **4.38 CSS px** (13.1 device px) |
| graphite flank per side | **0.73 CSS px = 2.2 device px** |

The flank survives the phone — the two grounds still both bind — but at 0.73 CSS px it is an
antialiased sliver, so the *perceived* ground at phone scale is closer to a blend of line and
paper than either. Two consequences for the spec: the corridor is if anything tighter on a
phone, and any `prefers-contrast: more` arm should be specified against the phone's blend, not
the desktop's. (The phone rows' own ground values in `r2-paint.json` are contaminated — see §9;
the geometry above is not.)

---

## 8 · SKETCHES

**(a) The corridor, in painted luminance.** Everything the ink must satisfy, at once:

```
DARK                                                     LIGHT
paper 19,18,17    L .006                                 line 49,49,49   L .031
   |                                                        |
   |  vsPaper >= 3  ->  coreL >= .1184                      |  vsLine >= 3 -> coreL >= .1921
   v                                                        v
   [=========== CORRIDOR .1184 - .1526 ===========]         [====== CORRIDOR .1921 - .2939 ======]
        ^ #79650f .1341        ^ #7d6902 .1584 OUT               ^ #a87e13 .2329   ^ #a47903 .2000
   ^                                                        ^
   |  vsLine >= 3  ->  coreL <= .1526                       |  vsPaper >= 3 -> coreL <= .2939
line 199,197,190  L .558                                 paper 253,253,252 L .975
```

**(b) The crossing, at 636 px (why both grounds bind).** One column of paint, top edge:

```
untraced                       traced
  paper  . . . . .               paper  . . . . .
  line   #### 7.63px             gold   ~~~~~ 5.09px   <- 8 units
  paper  . . . . .               line   #  1.27px      <- (12-8)/2, measured 1-2px, 24/24 cols
                                 paper  . . . . .
```

**(c) The three gold tiers as pressures, with the measured floor each one answers.**

```
  WAX   --color-crayon-gold   #c99a2e / #e5c74d   the sticker, the won frame   (vs paper 2.53 light)
  INK   --color-progress-ink  #a87e13 / #79650f   the gauge, mid-work          (>= 3.0 on BOTH grounds)
  TEXT  --color-gold-ink      #8c691d / (= wax)   the verdict line             (>= 4.5 on card)
        ^ the win is the lift INK -> WAX on one rect, one seed, one hue
```

---

## 9 · INSTRUMENTS — rows MOVED, and this lane's own defects named

1. **`hue-census.mjs` (r0) — MOVED already by pass 2**; this lane did not re-run it. The
   kinship claim it serves should stop being a lane-local copy and become the
   `check-ink-pressure.mjs` arm described in §5. Nothing under `loop/r0/` was written.
2. **The "trace core = most chromatic pixel" reading is not stable** (`r2-paint.mjs`). Two inks
   are not compared at the same pixel, and the two instruments disagree by 0.07–0.09 of a ratio
   on the same paint (webkit dark `#7d6902`: 2.834 max-chroma vs 2.916 modal). `r4` replaces it
   with the **modal value of the ink's own run, per column, over 24 columns**, which reproduces
   token arithmetic exactly at α=1 and agrees between engines to the byte. Any pass-3 spec
   should quote the modal reading and say so.
3. **"The frame line = the achromatic extreme of a strip" is contaminated** and it is what
   produced the chromium/dark (237,236,233) and chromium/light (10,10,10) grounds in
   `r2-paint.json`: a 26 px strip that starts 10 px above the board catches the card's own edge.
   `r4` reads the line from the SAME COLUMN of a `progress === 0` screenshot, where
   `HandDrawnGrid` mounts no trace at all (`traceNodesAtProgressZero: 0`, all four cells) — an
   uncontaminated ground by construction rather than by argument. **The r2 sweep's ratio columns
   are superseded by r4; the r2 geometry, bench and phone rows stand.**
4. **A chromatic-pixel run catches the pen.** `r4` run 1 read the typed digit's `#2563EB` glyph
   as the gauge in chromium/light (core 37,99,235). Cured with a 45° hue window around the ink
   under test; the light arm was re-run whole (`readings/r4-adjacency-light.json`) and both
   engines then agree to the byte. Named rather than quietly re-run.
5. **Not measured by this lane, and still open:** the π rect census (instrument named in §5, not
   run), a golden or unit row that renders a USER digit (the four goldens are `cell-light`,
   `grid-corner-light`, `logo-light`, `toggle-crest-dark`; `cell-light` renders a given, and
   chair §6.4 forbids a re-mint inside the loop — so the cheap route is a unit row asserting the
   glyph's resolved stroke for a user digit vs a given, not a bitmap), and `poseFronts` as
   applied to `DifficultyTally`.

---

## 10 · WHAT A SPEC MUST SAY (the numbers it has to hit)

1. `--color-progress-ink` **`#a87e13` light / `#79650f` dark**, with `.progress-trace`
   `stroke-opacity` **1** — worst painted arm **3.505 light / 3.280 dark**, both engines, both
   grounds, ≥0.28 of margin over the floor. Second-best pair, if the alpha is refused:
   `#a87e13` / `#79650f` at 0.95 → 3.302 / 3.081, which is the floor with no margin at all.
2. The dark ink may not exceed **C 0.10** in OKLCH. State it, because it is the design cost.
3. The 1.4.11 ledger in `index.css` carries the **painted** pair per theme with the engine and
   the instrument named (modal-of-run, 24 columns), or it carries token arithmetic and says so.
4. Law 25 is the chair's and **stands** (§6.7). The re-statement that fits the measurements:
   the law reserves *gold light* for the finish, and the gauge writes in gold at **pencil**
   pressure — painted relative luminance 0.134 dark / 0.233 light against the wax's 0.580 /
   0.357. The light still arrives only at the win; what arrives with the work is a pencil.
   Strike the amendment at `index.css:189–195`; carry the ask to the chair as registry §6.7
   directs.
5. The kinship gate lands **in `check-ink-pressure.mjs`** with a self-test that moves a token
   6° and reds; `check-theme-tokens.mjs` gains the alias-only assertion. Neither is a new file.
6. G9's term is per-anchor at C ≥ 0.05 with a named exception ledger, not a 40–115° band.
7. `FRAME_X_PAD 12 / FRAME_Y_PAD 0` stay at HEAD (`gridPaths.ts:346–347`, chair §6.2);
   `--color-focus-sketch` (`index.css:219`) is read, never written (chair §6.1). This palette
   survives every §6 candidate: both pen arms sit at 249–251°, the ring at 212°, and the gauge
   at 83–95°, so no §6 value can collide with a gold.

## 11 · RISKS

1. **The corridor is 0.034 wide in dark.** Any future move of `--grid-line-color` or
   `--color-card` re-opens the row; the gate should assert the corridor, not the hex.
2. **α=1 is a visual change, not only a number.** The gauge stops letting the graphite show
   through; the frame line is 0.95 and the trace would be the only opaque stroke on the board.
   It is exactly "one pressure harder", but it is an owner-visible change (U-10).
3. **The win in dark reads 1.037 against the line it lifts from** (§4). Whatever is decided
   there, decide it explicitly.
4. **The modal-core instrument could be called generous.** It reads the stroke's interior, not
   its darkest antialiased pixel; a critic who reads the extreme will find 0.07–0.09 less.
   Margin ≥0.25 is what makes the choice survive either instrument — the recommended pair has
   it, the pass-2 pair at α=1 (3.123) does not.
5. **Nothing here was measured on the pass-2 tree.** The transfer rests on the geometry being
   identical at HEAD (stroke widths, opacities, grounds, 493-point poses — all verified). If the
   prototype changes a stroke width, every number in §2 must be re-read.
6. **The phone's 0.73 px flank** means the desktop reading is the optimistic one for the
   line arm; a `prefers-contrast: more` arm should be specified from the phone.
