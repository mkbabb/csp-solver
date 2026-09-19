# MRK-ABS · pass 1 (RESEARCH) — One visible hand

§5 the wobble law · §6 focus rings. Lane port 127.0.0.1:4239, `npx vite --strictPort` from
`web/frontend`. Everything below was taken on THIS tree (uncommitted W3/W6 included), chromium
+ webkit, 1280×800 and 393×699 dpr3, on `probe/pw.config.ts` (a copy of the estate's default
minus `webServer`/`globalSetup`). No product file was touched: the prototypes are a static page
under `proto/` and an `addStyleTag` overlay. Logs `logs/*.json`, instruments `probe/*`,
overlays `proto/*`, one frame `frames/ring-band-dpr3.png` (132 KB).

**Recommendation: ADJUST.** The idea's spine — an absolute band, reached by length compensation,
with one constant — is real and buildable, and pass 1 found the one line that makes the constant
a constant. But the RUNG the family chose kills it: at the mark rung (σ 1.443px) the ring stops
being a square at 9×9 and leaves its own cell in 237 of 256 cells at 16×16. The family survives
at the band FLOOR, not at the rung. §6 survives whole and comes back stronger than the charter
claimed: the token clears 3:1 on all four grounds in both engines, and pass 1 found five more
rings under the floor than the census did.

---

## 1 · Substrate, verified on this tree

| claim | verified | where |
|---|---|---|
| `maxDisplace = roughness × len × 0.015` | yes | `web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js:63` (`wobbleLinePoints`), v0.12.0 |
| overshoot rides the same knob | **yes, and the charter does not say so** — `overshoot = roughness × len × 0.003` | same file, `:64` |
| `wobbleRect` passes ONE options object to all four edges | yes | `path.js:142-156` |
| the ring is already `wobbleRect(0.4, 4 segments, jagged)` | yes | `src/pencil/grid/gridPaths.ts:59-67` |
| segments are board-dependent | **yes — `boardSize >= 16 ? 2 : 4`** | `gridPaths.ts:52` |
| cell rules roughness 0.4 / segments 4; frame 0.5 / 6; subgrid 0.7 / 5 | yes | `gridPaths.ts:481-490`, `:459-472` |
| the ghost svg's viewBox is the cell padded 15% each side | yes | `src/games/shared/useGameCell.ts:86-97` |
| the peer wash is a bare div | yes | `src/games/shared/DigitCell.vue:261-265`, `src/games/shared/gameCell.css:132` |
| `index.css:445` `@apply border-border outline-ring/50` in `@layer base` | yes | `src/assets/index.css:444-446` |
| `--color-focus-sketch: #3a7bc4`, **no dark arm** | yes — grep finds ONE definition, at `:219`; the dark block `:363-401` never redefines it | `src/assets/index.css:219` |
| six bespoke focus rects | yes | `DarkModeToggle.vue:740`, `HandwrittenLogo.vue:544`, `DrawerTab.vue:151`, `GameCard.vue:436`, `StagingBand.vue:431`, `GameGallery.vue:1450` |
| deck ring reach 6 vs air 9.6 → 3.6px headroom | yes, re-derived | `logs/deckring-token-*.json` |

Three numbers the census and the charter carry that MOVED, and one arithmetic slip:

1. **The board's px-per-unit is not one number.** Measured, both engines identical
   (`logs/scale-desktop-*.json`, `logs/scale-phone-*.json`): the board svg renders at
   **0.412** px/unit at 4×4 and **0.636** at 9×9 and 16×16 on desktop, and **0.365** at all
   three on the phone. The RING's own svg is the cell padded ×1.3, so the ring's px-per-unit is
   **0.3169 / 0.4892 / 0.4892** desktop and **0.2808** phone. The ring is drawn at exactly
   1/1.3 of the grid's scale on the same board.
2. **The charter's crop arithmetic divides px by user units.** "~1.3% of a 111-unit edge vs the
   rule's 0.15%" is `1.443 ÷ 111.1` and `1.443 ÷ 948`. Px against px
   (`logs/k-constant.json` `cropMath`): the grid rule's σ is **0.254%** of its own chord, the
   frame's **0.227%**, and a compensated ring at the mark rung is **1.82 / 2.66 / 4.72%** of its
   own edge at 4×4 / 9×9 / 16×16. The RATIO the charter reasoned from (≈8×) is right; the
   absolute fractions are 1.6–3.6× larger than stated, and they get worse as the board grows.
3. **The dark-arm comment is false in the sheet.** `index.css:219-222` says "Dark mode keeps
   crayon-blue (5.3:1, comfortable)". Measured in dark, `--color-focus-sketch` computes
   `#3a7bc4` (`logs/focus-head-dark-*.json`) — `gameCell.css:245`'s
   `var(--color-focus-sketch, var(--color-crayon-blue))` fallback can never fire because the
   token is defined. The dark board ring paints `rgb(58,123,196)` and reads **3.76** on the dark
   card, not 5.3.
4. **R3-f's ratios are hex arithmetic and they overstate the UA default by up to 10×.** See §4.

---

## 2 · §5 — THE CONSTANT (research question 1)

### 2.1 k at HEAD, over every cell instead of one

`probe/k-constant.mjs` runs R3's own sigma fit in pure node against the real library, over ALL
16 / 81 / 256 cells per size, with the measured per-size scale. k ≡ σpx ÷ (roughness × len ×
0.015 × pxPerUnit).

| board | segments (shipped) | σ mean px | σ CV | **k** |
|---|---|---|---|---|
| 4×4 | 4 | 0.151 | 0.32 | **0.3177** |
| 9×9 | 4 | 0.105 | 0.33 | **0.3232** |
| 16×16 | **2** | 0.042 | 0.60 | **0.2268** |

k is viewport-invariant by construction (it is defined past the scale) and the phone rows agree
to 4 decimal places. **k is NOT board-invariant at HEAD: 16×16 is 30% low.** The only thing that
differs there is `gridPaths.ts:52`.

### 2.2 The one line that makes k a constant

`probe/k-segments.mjs` sweeps segments 2/4/6/8/10 at each size (`logs/k-segments.json`):

| segments everywhere | k̄ | k spread | σ error vs the 1.443 target, 4×4 / 9×9 / 16×16 | cells in band |
|---|---|---|---|---|
| 4 | 0.3241 | **4.2%** | −1.9% / +1.4% / +7.5% | 0.938 / 0.951 / 0.922 |
| 6 | 0.4167 | **2.8%** | +0.7% / −1.3% / +2.1% | 0.875 / 0.926 / 0.953 |
| 8 | 0.4989 | **1.5%** | −0.8% / −2.9% / −6.3% | 1.000 / 0.975 / 0.965 |

**ANSWER: one k exists, and its price is one line.** Pin the ring's segment count instead of
deriving it from `boardSize`, and a single constant serves all three boards to 4.2% (segments 4)
or 1.5% (segments 8). The family does not need a per-size table; it needs a per-size table
DELETED. Cost, measured as path-string bytes per cell at 16×16: shipped (seg 2) 229 B, seg 4
446 B, seg 6 828 B, seg 8 896 B — at 256 cells that is 58.6 KB → 114 / 212 / 229 KB of `d`
attribute. Segments 4 is the cheapest constant.

The charter's formula as WRITTEN — `roughness = targetSigma / (len × 0.015 × k)` with no scale
term — misses the band at every size, because it divides a px target by a user-unit length:
σ comes back **0.502 / 0.793 / 0.551**px on desktop (band floor 0.722; cells in band 6.3% /
56.8% / 37.1%) and 0.445 / 0.455 / 0.316 on the phone (0% / 4.9% / 0%). The formula the family
needs is `roughness = targetSigma / (len × 0.015 × k × pxPerUnit)`.

### 2.3 The viewport the absolute band cannot carry

`pxPerUnit` is a render-time number and the roughness is a generate-time one, cached on
`["cellRects", boardSize, subgridSize, viewBoxSize, seed]` (`gridPaths.ts:45-48`) with no scale
term. Solve the roughness at the desktop rung and the SAME geometry reads, on the phone
(`logs/k-constant.json` `repairedLaw`): **1.406 / 0.945 / 0.639**px against a desktop 1.587 /
1.648 / 1.113. The grid's own σ falls by the same 0.574 factor, so the ring still matches the
hand — but the ABSOLUTE band [0.722, 2.886] was taken at 1280×800 and 16×16 falls out of it on
the phone. Either the target is restated in the board's own units (one number, cached as today,
px claim true at the reference viewport) or the roughness is re-solved per scale — which puts a
scale term in the cache key and regenerates 256 paths on every resize, into an LRU of cap 24.
**The family should take the first.** Its law then reads: one target, in board units, whose px
value at 1280×800 is the grid's own.

### 2.4 THE EYE (research question 2) — the crop

`frames/ring-band-dpr3.png` (dpr 3, chromium, light; generated by `proto/ring-crop.mjs` from the
product's own library with the product's own parameters and this tree's measured scales). Three
sizes × three rungs: HEAD, the band floor (σ 0.85px), the mark rung (σ 1.443px). Each panel is a
real 2×2 patch with the cell rules at their own seeds, and the ring's svg is `overflow: visible`
exactly as `DigitCell.vue:414` has it.

Said plainly, because the family asked to be killed by this: **at the mark rung the ring is
damage.** At 4×4 (r 3.75) it still reads as a hand-drawn square. At 9×9 (r 5.46) the top edge
peaks and the right edge bows across the rule — a squashed pentagon, not a square. At 16×16
(r 9.71) the corners have collapsed; it is a blob sitting over the grid line, and nothing about
it says "someone drew a box here". At the FLOOR rung (σ 0.85) 4×4 and 9×9 read as a hand and
16×16 reads as a lozenge with soft corners — survivable, not free.

### 2.5 The second kill, which the crop does not show and geometry does

`probe/clearance.mjs` walks every cell's whole closed path and asks whether the ink stays inside
the cell. The ring's drawn rect sits inside the cell with a margin of (cellPx − ringEdgePx)/2
and the ink reaches (max outward excursion + half the 7-unit stroke).

| board | margin px | ink reach at the mark rung | headroom | cells crossing their own box |
|---|---|---|---|---|
| 4×4 | 11.89 | 5.54 | +6.34 | 0 / 16 |
| 9×9 | 8.15 | 6.15 | +2.00 | 0 / 81 |
| **16×16** | **4.59** | **6.16** | **−1.58** | **237 / 256** |

Same at the phone rung (237/256). At segments 6 it is 216/256. **At 16×16 the compensated ring
paints into the neighbouring cell — over the neighbour's own ghost and over `.cell-peer`.** The
largest target 16×16 can carry without leaving its cell is σ ≈ **0.93px**, which is inside the
band and is not the rung.

### 2.6 BUDGET (research question 4) — clean

R3-h re-run unchanged on this tree, both engines (`logs/budget-chromium.json`): live-filter
census **9 / 9 / 9** at 4×4 / 9×9 / 16×16, the same four rows; `.cell-ghost-path`'s own computed
`filter` is `none` at every size; ghost svgs and paths **16 / 81 / 256**, unchanged. A roughness
change is a parameter, not a node: nothing here moves. The pose stack the family explicitly does
not build would have taken it to 64 / 324 / 1024 (`hypotheticalPosePaths`, same log).

### 2.7 THE WASH (research question 3) — measured, and it is the weakest limb

`probe/wash-forced-frames.probe.ts` MA-4, painted bytes from empty cells at the 22% inset corner
(the first pass of this probe read digit ink and returned 1.00 and 18.04 for the same surface in
two engines — the centre of a cell is a glyph):

| theme | wash painted | neighbour painted | ratio |
|---|---|---|---|
| light | `[240,245,249]` | `[253,253,252]` | **1.08** |
| dark | `[25,29,33]` | `[19,18,17]` | **1.10** |

Both engines identical. The wash's edge against its neighbour carries **1.08:1**. Give that edge
σ 1.443px of wander and no one can see it: the wander is only visible where the boundary is, and
the boundary is 8% of a contrast step. **A wobble nobody can see is not a wobble.** If the wash
is to gain geometry the reason has to be that it gains VISIBILITY too — which is §3's accent
question, not this family's, and the family should say so rather than claim a σ it cannot spend.

Population, if it is drawn anyway: the wash is `v-if="isPeer"` today and the peer count is 7 /
20 / 39 at the three sizes (`logs/budget-chromium.json`). A wash path on the existing ghost svg,
kept peer-resident, takes 81 → **101** paths at 9×9 and 256 → **295** at 16×16. Made resident on
every cell it is 162 and 512 — the +N² R3-h forbids. **Peer-resident or not at all.**

---

## 3 · §5's other rows

- **R3-a's LAW, not just its reading.** R3-a asserts the ring's σ lies in [0.5×, 2.0×] the
  grid's, and the wash's likewise. This family does not change the law; it changes the UNIT the
  law is stated in, from a ratio to an absolute, and then discovers the two are the same law
  because the band is derived from the grid. What the family SHOULD change is the law's second
  half: the wash clause is unsatisfiable at 1.08:1 and should be retired or re-aimed, not met.
- **R3-a re-run at HEAD: still RED, both engines** (`logs/wobble-*.json`) — ring σ 0.092 vs floor
  0.722, wash 0. Every R3 number reproduces to 3 dp on this tree: grid 1.443, frame 1.145,
  ratios 7.47 (4×4) and 8.19 (16×16), scales 0.412 / 0.636 / 0.636.
- **New rows this lane would add beside R3-a, both born-RED at HEAD:**
  `MA-1` the ring's own px-per-unit is measured, not assumed (GREEN by construction, it is a
  reading); `MA-K` k is one constant across the three boards within 5% (RED at HEAD: 0.318 /
  0.323 / 0.227, spread 30%); `MA-C` no cell's ring ink crosses its own box (GREEN at HEAD,
  and it is the row that reds a cure at the wrong rung — it must be written BEFORE the cure).
- **THE ARMED VERB (research question 8).** Not this family's. Under a still law the only
  channels left are weight and ink, and both belong to §2's button system and §3's accent
  family. This family should decline it in one sentence rather than annex it.
- **MODALITY (research question 7).** Re-read on this tree, both engines
  (`logs/click-*.json`, `logs/phone-*.json`): a mouse click, a click with the pointer moved
  away, an arrow key and a phone tap ALL paint tier 2 (`rgb(58,123,196)`, 7px, 0.9). The comment
  at `gameCell.css:243-244` — "a mouse click keeps the instant graphite tier and only keyboard
  focus gets the drawn-on ring" — is false at HEAD, in both engines, on the desk and on the
  phone, because the focus target is `<input type="text">` and a text input always matches
  `:focus-visible`. One mark for every pointer is already the truth; the family's job is to
  DELETE the comment, not to build the gate it describes.

---

## 4 · §6 — the focus rings, from painted bytes

`probe/token-ring.probe.ts`. Every ratio below is read off the engine's own pixels: the ring's
ink is the pixel that moved furthest when focus arrived, searched only inside the ring's own
annulus, and its ground is that same pixel before. (The annulus matters: without it the
strongest change on this product is the washi tooltip a focused icon button reveals —
`SheetWashiLabel.vue:120-122` — and the number comes back describing a tooltip.)

### 4.1 HEAD — five more rings under 3:1 than the census found

| subject | indicator | chromium light | chromium dark | webkit light | webkit dark |
|---|---|---|---|---|---|
| `.ctrl-btn` | UA default | 3.72 | 18.71 | **2.15** | **1.78** |
| `.icon-btn` | UA default | 3.72 | 18.71 | **2.15** | **1.78** |
| `.attribution-trigger` | UA default | 3.69 | 19.12 | **2.12** | **1.78** |
| `.logo-trigger` | rect, 40% mix | **2.70** | 3.39 | **2.69** | 3.39 |
| `.drawer-tab` | rect, dashed | 18.99 | 16.18 | 18.99 | 16.18 |
| `.sun-moon-toggle` | rect, 54px offset | 19.62 | 13.13 | 19.62 | 13.13 |
| `.game-cell` | house hand | 3.68 | **3.76** | 3.69 | **3.76** |

R3-f read the UA default at ~20 by compositing the DECLARED `outline-color` as if it were
solid. The engine does not paint it solid. Chromium paints a 1px light-grey ring
(`[131,131,131]` on the card) and **WebKit paints a 3px blue-grey one that fails 1.4.11 in both
themes** (`[126,178,248]` light → 2.15; `[9,61,130]` dark → 1.78). So the count is not "two
rings under 3:1"; it is **the logo in both engines, the deck card, and the whole UA-default set
in Safari, light and dark**. §6's case is stronger than the census stated it.

### 4.2 THE TOKEN (research question 5) — clears four grounds, both engines

Overlay `proto/token-ring.css`, applied with `addStyleTag`. `2px solid var(--color-focus-sketch)`,
`outline-offset: 3px`, plus the dark arm `#6aabeb`.

| ground | painted | token ink | ratio |
|---|---|---|---|
| `--color-card` light | `[253,253,252]` | `[58,123,196]` | **4.29** |
| `--color-background` light | `[251,250,249]` | `[58,123,196]` | **4.19** |
| `--color-card` dark | `[19,18,17]` | `[106,171,235]` | **7.70** |
| `--color-background` dark | `[17,15,14]` | `[106,171,235]` | **7.86** |

Identical in both engines. The charter predicted 3.63 / 6.42; measured from pixels it is
**4.29 / 4.19 light and 7.70 / 7.86 dark** — the charter's numbers were the ring's stroke at
opacity 0.9, and a solid 2px outline is a full-alpha mark. The subject-count guard passed at
every arm: ≥3 controls painted a ring (7–8 of 8 subjects, both themes, both engines). The two
2.70:1 rings are cured: `.logo-trigger` 2.70 → **4.19**, the deck card 2.70 → **4.19**. And the
dark arm lifts the BOARD's own ring from **3.76 → 6.53**, which is the strongest single argument
for adding it.

### 4.3 Two traps the overlay found, and both are spec instructions

1. **A blanket token silently out-ranks every bespoke geometry rule in the product.**
   `:is(button, a, [tabindex]):not(…):not(…):focus-visible` computes to specificity **(0,4,0)** —
   `:is()` takes its widest arm, each `:not()` adds its own. That beats `.sun-moon-toggle:focus`
   (0,2,0) and even `:root .sun-moon-toggle:focus` (0,3,0). Measured consequence: with the token
   at `outline-offset: 3px` the light toggle painted **ZERO changed pixels in both engines** —
   the ring landed inside the art and the rest stack covered it, which is exactly the defect
   T9-W2 §2.4 was written to cure. **The token must be authored as a low-specificity base-layer
   rule that bespoke geometry can still override** (`@layer base { :focus-visible { … } }`,
   which is also what `index.css:445` already reaches for), never as a blanket `!important`
   sweep.
2. **A blanket `[tabindex]` token reds `spoken-gallery` §3.7.** `.gallery-viewport` carries a
   tabindex, so the sweep gave the scrollport an outline and made TWO ring owners. Measured
   before the exemption: `viewportOutline: "solid"`. The law needs `.gallery-viewport` written
   into it as an exemption, beside `.cell-native-input`.

### 4.4 The floors, all green on this tree

- **Deck ring (§3.7, R3-e).** HEAD reach 6, air `[9.6, 713.6, 24, 24]`, headroom **3.6**, WHOLE.
  Under the token (offset 3 + width 2) reach **5**, headroom **4.6**, WHOLE, `.gallery-viewport`
  `outline-style: none`. Both engines (`logs/deckring-token-*.json`). The token SPENDS LESS air
  than HEAD — the one geometric argument for offset 3 over 4.
- **`e2e/spoken-gallery.spec.ts`** — 16/16 green at HEAD, both engines, on the lane's port.
- **`e2e/access.spec.ts` 2.1 / 2.2** and **`e2e/a11y.spec.ts` 3.5** — green at HEAD, both
  engines. The token changes no layout and mints no image node, so none of the three is at risk;
  re-running them UNDER the overlay needs a source patch and belongs to pass 2.
- **Forced colors** (`logs/forcedcolors-chromium.json`): with the emulation active the focused
  cell still computes `2px solid …` at `outline-offset: -2px` — `gameCell.css:348-356` survives,
  and any ring law must keep it, house-hand or token.
- **The phone's frames** (MA-6, the before half): 24 arrow presses at 393×699 dpr3 —
  chromium median **8.3 ms**, p95 9.6, max 10.3, **0 frames over 33 ms**; webkit median
  **17.0 ms**, p95 19.0, max 21.0, **0 over 33**. A roughness change is one static path with a
  longer `d`; the after half must match these.

### 4.5 THE GRADED LAW (research question 6), written down

> On the board, a focused thing is DRAWN: the pencil goes round the square it is on, in the
> board's own hand, in crayon blue. Off the board, a focused thing is RINGED: one 2px line in
> the same blue, three pixels clear of the control, the same in light and in dark. The browser's
> own ring is used nowhere.
>
> The two are one system because they are the same INK doing the same JOB at the same WEIGHT —
> `--color-focus-sketch`, 2px of visible line, ≥3:1 on every ground — and they differ only where
> the page differs. The board is a drawn surface, so the mark is drawn. The chrome is a built
> surface, so the mark is built. A rect on a drawn board would be a foreign hand; a drawn ring
> on a button would be a costume.

That is the argument the family owes, and pass 1 thinks it holds — on one condition the crop
made plain: it holds only while the board's ring stays legible as a drawn square. Push the
wander to the mark rung and the board's half stops being "the pencil went round the square" and
becomes "something smudged here", and then the two halves are no longer one system, they are a
drawn mess beside a clean rect.

---

## 5 · Kill conditions — met, cleared, and one new

| condition | verdict |
|---|---|
| the crop reads as a shaky box | **MET at the mark rung**, 9×9 and 16×16 (`frames/ring-band-dpr3.png`); cleared at the band floor for 4×4 and 9×9 |
| the constant needs a per-size table | **CLEARED** — one k to 4.2% once `gridPaths.ts:52`'s segment table is deleted (`logs/k-segments.json`) |
| a rect on drawn chrome is a truce | **CLEARED** — §4.5's argument, plus the numbers: the token is the same ink, the same weight, and the board keeps its hand |
| the toggle's 54px ring stays odd | **STANDS**, and pass 1 found it is worse than odd: a blanket token buries it entirely (§4.3) |
| **NEW — the ring leaves its cell** | **MET at 16×16**: 237/256 cells cross their own box at the mark rung, 216/256 at segments 6 (`logs/clearance.json`) |
| **NEW — the absolute band is not viewport-portable** | **MET as stated**; cleared if the target is restated in board units (§2.3) |

## 6 · What pass 2 should carry forward

1. **The rung is the research variable now, not the constant.** Sweep σ ∈ [0.72, 1.00] against
   the crop and against `clearance.mjs`; the ceiling is 0.93px, set by 16×16.
2. **Pin the ring's segments** (`gridPaths.ts:52` for the cellRects path only — the grid's own
   line segments are a separate call and should not move). Cheapest constant: 4.
3. **Restate the target in board units.** One number in `pencilConfig`, whose px value at
   1280×800 is the grid's own σ; the cache key does not change.
4. **Buy 16×16 the room, or let it keep a lower rung.** Two levers exist and both are cheap:
   draw the ring at 0.86 × cellSize (the margin goes 4.59 → 7.4px) or take the stroke from 7 to
   5 units at that size. Pass 2 should price them against the crop.
5. **Write `MA-C` (no ring crosses its own cell) BEFORE the cure.** It is green at HEAD and it
   is the row that reds the wrong rung.
6. **Author the token in `@layer base`, with two exemptions named** (`.cell-native-input`,
   `.gallery-viewport`) and the toggle's ornament rule left able to win. Delete
   `index.css:445`'s `outline-ring/50`, add the `#6aabeb` dark arm, delete the false modality
   comment at `gameCell.css:243-244`, and correct the `index.css:219-222` comment while the
   token is being touched.
7. **The wash should be argued on visibility, not on σ.** At 1.08:1 no geometry it is given can
   be seen. If it stays, it stays as a CSS box and the family says why.

---

## 7 · Files

- `probe/pw.config.ts` · `probe/package.json` — the scratch config, port 4239, both engines.
- `probe/scale.probe.ts` — MA-1, the px-per-unit table (desktop + phone, both engines).
- `probe/k-constant.mjs` — k over every cell; the charter's formula vs the repaired one.
- `probe/k-segments.mjs` — the segment sweep that makes k a constant, with byte costs.
- `probe/clearance.mjs` — the ring-leaves-its-cell kill.
- `probe/token-ring.probe.ts` — §6, painted-byte ratios, four grounds, both themes/engines.
- `probe/wash-forced-frames.probe.ts` — MA-4 wash, MA-5 forced colors, MA-6 phone frames.
- `probe/crop.probe.ts` — the one dpr3 crop.
- `proto/ring-crop.mjs` → `proto/ring-crop.html` — the static page (library-generated, real
  parameters, real scales).
- `proto/token-ring.css` — the overlay, replayable with `page.addStyleTag({ path })`.
- `logs/*.json` — every reading. R3's own instruments were re-run UNCHANGED from
  `r0/r3-marks/probe/`; their output is banked here under a `rerun-` prefix
  (`rerun-wobble-*`, `rerun-budget-*`, `rerun-click-*`, `rerun-phone-*`) so it can never be
  mistaken for r0's own files. Every other log is this lane's own instrument.
- `frames/ring-band-dpr3.png` — 132 KB, dpr 3, the only frame this lane banks.

The dev server on :4239 and the scratch run directory are disposable; nothing under
`web/frontend` was modified.
