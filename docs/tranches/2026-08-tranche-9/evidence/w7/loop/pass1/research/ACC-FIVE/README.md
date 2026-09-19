# ACC-FIVE — five crayons, no sixth · pass 1 (RESEARCH)

T9-W7 §3 the accent family · §4 the fill meter · §12 multiplayer chrome · §15 the confirm's
face · mark M07. One family, developed alone; no sibling was read.

Measured on this tree (HEAD `7b0610cc` + the uncommitted W3/W6/W7-evidence work), 2026-09-17,
on `http://127.0.0.1:4236` — a dev server this lane started — chromium and webkit, light and
dark, 1280×800. **Read-only on the product: nothing under `src/`, `e2e/` or `scripts/` was
touched.** The prototype is one injected stylesheet (`proto/five-crayons.css`); the two r0
instruments were re-run with a two-hunk env hook each (`proto/*.diff`) and nothing else.

Recommendation up front: **DEVELOP, with two adjustments and one discovered blocker that is
not this family's to fix.** The reasoning is §9.

---

## 0. The idea, and what survived contact

Every interactive accent becomes an alias into the five crayons, hue-locked within 5°, with
contrast bought by LIGHTNESS alone — the exact move `red-ink` / `green-ink` / `orange-ink` /
`gold-ink` already model four times over. The violet dies. The pen becomes crayon-blue's ink
tier. Progress becomes gold.

| the idea said | this lane measured | verdict |
|---|---|---|
| the pen is crayon-blue's ink tier at ≥4.5:1 | `#026fc4` light / `#47a7ff` dark — 5.065 / 7.341 on `--color-card` against today's **5.078 / 7.360** | **stands**, and the digit's weight moves by 0.013 of a ratio |
| pen and ring separate by chroma, ~0.20 vs 0.13 | **C 0.20 is not reachable.** At crayon-blue's hue the sRGB gamut caps chroma at **0.164** for any blue that still clears AA on the light papers; the pick ships **0.156**, so the available ΔC is **0.025** | **REFUTED as stated**; the separation is real but it is 0.025 of chroma plus the ring's drawn geometry, not 0.07 |
| `--color-progress-ink` → crayon-gold light / gold dark | **the wax dies on both arms.** crayon-gold light at 0.95 reads **2.41:1** on the light card; crayon-gold dark reads **1.07:1** over the dark frame line. Neither existing gold token can carry the trace | **ADJUST**: gold needs its own ink tier, two new hexes, and they exist |
| the trace becomes the solved frame at 100% | true in token terms to **0.3° (light) / 0.6° (dark)** of hue — and **false in paint**: at the win the frame band has **zero** chromatic pixels, at HEAD and under the overlay alike | **blocker, discovered, not this family's** (§6) |
| focus-sketch gains its dark arm, 6.42:1 | measured **6.38 chromium / 6.44 webkit** against today's 3.66 / 3.67 | **stands** |
| the sparkle glow → crayon-gold at .3/.6 | both engines now paint `color(srgb 0.788235 0.603922 0.180392 / 0.3)`, which is the gold token at 0.3, to the byte | **stands** |
| the confirm's face → red-ink | red ink over the ribbon's own 8% ground reads **4.35 / 4.36** — under AA | **ADJUST**: the ground drops to 5% and it reads 4.56 |
| chrome stays achromatic | the heading's tint retires, the chip keeps it | **stands** |

---

## 1. Substrate, verified on this tree

| claim | site | reading |
|---|---|---|
| the ink-tier move (hue lock + lightness step + measured ratio) | `index.css:178-197` | four worked examples; the loosest lock is `orange-ink` at 4.5°, which is where KIN_DEG 5 comes from |
| the pen | `index.css:151` `#2563eb`, `:372` `#60a5fa` | 24 `var()` consumers across 13 files (`readings/control/consumers.json`) |
| the focus ring | `index.css:219-222`; `gameCell.css:246, :248` | **2** consumers. `.dark` never redefines it, so the dark ring paints `#3a7bc4` at 3.66:1 while the comment claims crayon-blue at "5.3:1" |
| the fill meter | `index.css:278` / `:407`; `HandDrawnGrid.vue:471` | **1** consumer. One line moves the meter's hue |
| "gold comes to the page only when the work is done" | `index.css:174` | the law §5 is weighed against |
| the crayon dark law (hue ±3°, L +0.06…0.10) | `index.css:164-169` | **crayon-gold breaks it**: 83.7° → 95.2° is **11.5°** in OKLCH. Every other crayon moves 1.3–3.1°. Gold is the estate's own outlier and it is the crayon this family hands progress to |
| print / forced-colors | `index.css:932-936`, `:948-952` | print re-points `--color-user-ink` to `#000` unlayered and LAST; forced-colors forces `.glyph-svg path` to `CanvasText` inside `@layer base` |
| the trace's geometry | `gridPaths.ts:338-370`, `HandDrawnGrid.vue:461-480` | FRAME_X_PAD 12 / FRAME_Y_PAD 0 on a 1000-unit viewBox (`HandDrawnGrid.vue:52`) — perimeter **3,952 units**, shared with the graphite frame, so the trace retraces it in registration |
| the win's hand-off | `index.css:588-600`, `HandDrawnGrid.vue:569-592` | `.solve-success .grid-line { stroke: var(--color-gold-star) }` + `.solve-success .progress-trace { opacity: 0 }`, 500 ms |
| the 7% unit wash and the ghost tiers | `gameCell.css:120-300`, `:246`, `:248` | the wash is `crayon-blue` at 7% — already kin, unchanged by this family |
| the sparkle's literals | `GameControlPanel.vue:2081, :2087` | `rgba(196,181,253,…)` = Tailwind violet-300, spelled inline |
| the heading's tint | `GameControlPanel.vue:186-192`, `OptionSelector.vue:56` | one `colorClass` paints BOTH the `h2` and the selected chip |
| the confirm's face | `GameGallery.vue:1399-1462` | `.guard-leave .guard-face` is an 8% foreground ground and nothing else; `rgb(10,10,10)`, chroma **0** |

---

## 2. What the family proposes, with every number it rests on

Four token names, six declarations. `proto/five-crayons.css` is the running form.

```
:root {
  --color-blue-ink: #026fc4;                  /* crayon-blue 251.4° · round-trip 251.2° (Δ0.17°) */
  --color-user-ink: var(--color-blue-ink);    /* 24 consumers stand */
  --color-progress-ink: #a47903;              /* crayon-gold 83.7° · round-trip 83.6° (Δ0.12°) */
}
.dark {
  --color-blue-ink: #47a7ff;                  /* crayon-blue 249.3° · Δ0.07° */
  --color-user-ink: var(--color-blue-ink);
  --color-focus-sketch: var(--color-crayon-blue);   /* the comment at :222, made true */
  --color-progress-ink: #7d6902;              /* crayon-gold dark 95.2° · Δ0.59° */
}
```

plus three rules that are not tokens: the sparkle's glow to `color-mix(… crayon-gold 30% …)`
and 60% on hover; `.guard-leave .guard-face` to `--color-red-ink` on a **5%** (not 8%) ground;
the difficulty tint off `h2.section-heading`.

### 2.1 How the two hexes were found (`probe/search-inks.mjs`, `probe/separation.mjs`)

The house's ink-tier move as an algorithm: hold the crayon's OKLCH hue, take as much chroma as
the sRGB gamut allows there, walk lightness until the floor is cleared. Run over grounds read
off the live page in both engines (`readings/grounds.json`; the two engines agree byte-for-byte).

**Blue.** Feasible window on the light papers: OKLCH L ≤ **0.558**. Two picks matter.

| pick | hex | L | C | on `--color-card` | on `--color-background` | ΔC vs the ring |
|---|---|---|---|---|---|---|
| today (`blue-600`) | `#2563eb` | 0.546 | 0.215 | 5.078 | 4.958 | 0.097 |
| **weight-preserving** | **`#026fc4`** | 0.536 | 0.156 | **5.065** | **4.945** | 0.039 |
| max chroma at AA | `#0075cf` | 0.558 | 0.164 | 4.641 | 4.531 | 0.033 |

The weight-preserving pick is the recommendation: it buys kinship (11.5° → **0.2°**) for
**0.013** of contrast. The max-chroma pick costs 0.44 of contrast to buy 0.008 of chroma —
a bad trade, and it is the arithmetic that kills the charter's "pen ~0.20 vs ring 0.13".

**Gold.** The trace is squeezed between two grounds that invert with the theme, so its
lightness lives in a band, not at a floor (`readings/ink-search.json` → `luminanceBands`):

    light   relative luminance must be ≥ 0.1581 (vs the frame) and ≤ 0.2939 (vs the paper)
    dark    relative luminance must be ≤ 0.1743 (vs the frame) and ≥ 0.1183 (vs the paper)

The feasible OKLCH-L windows at the locked hue are **[0.558, 0.650]** light (93 rows) and
**[0.507, 0.542]** dark (36 rows). The picks maximise the smaller of the two ratios:

| arm | hex | L | C | over `--grid-line-color` | over `--color-card` |
|---|---|---|---|---|---|
| light | `#a47903` | 0.603 | 0.123 | 3.59 | 3.59 |
| dark | `#7d6902` | 0.524 | 0.107 | 3.22 | 3.25 |

No existing gold token fits: `crayon-gold` light reads 2.41 on the card, `gold-ink` light reads
2.83 over the frame, and in dark both collapse to the wax at **1.07** over the frame. A dual
token that serves the trace AND the verdict-text floor exists in light only, three rows wide
(`#946d03`, 3.03 over the frame — 0.03 of headroom), and does not exist in dark at all. So the
estate spends two new hexes, and it spends them replacing two it already has.

### 2.2 The dark pen is a live trade, and pass 1 does not close it

Giving the ring its proper dark arm raises it from 3.66 to 6.42 — and pushes it into the pen's
lightness. Measured pen-versus-ring-composite ratio, dark: **2.01 today → 1.14** under the
recommended pen. Three priced alternatives at the same locked hue (`readings/separation.json`):

| dark pen | on `--color-card` | pen vs ring | ΔL | ΔC |
|---|---|---|---|---|
| `#47a7ff` (weight-preserving, the prototype) | 7.34 | 1.14 | +0.036 | 0.052 |
| `#0189e8` | 5.12 | 1.25 | −0.056 | 0.067 |
| `#0180d8` | 4.53 | **1.42** — the light arm's own separation | −0.087 | 0.057 |

Iso-luminance in dark is structural, not a mistake: on a near-black paper both the pen and the
ring have to be light to clear their floors. The separation that is actually available is
chroma plus FORM — the ring is a 7-unit wobbled ghost drawn around the cell over 180 ms, the
pen is a hand-drawn glyph inside it. **U-10: this is the owner's pick, and the numbers for all
three are banked.**

---

## 3. The instruments, before and after

### 3.1 R2's `accent-kinship.probe.ts`, re-run unchanged

Two hunks added, both banked as `proto/accent-kinship.probe.diff`: an `ACC_FIVE_OUT` env for
the output dir and `if (OVERLAY) await page.addStyleTag(...)` in `boot()`. KIN_DEG, the anchor
set, the accent list, the exception list and every assertion are untouched.

| row | HEAD (control) | under the overlay |
|---|---|---|
| 1 · kin, light | **RED** — `user-ink` 11.5°, `progress-ink` 41.3° | **GREEN** both engines |
| 2 · kin, dark | **RED** — `user-ink` 5.3°, `progress-ink` 43.7° | **GREEN** both engines |
| 3 · a control's focus ring | RED both engines | **RED, unchanged — not this family's row** (§7) |
| 4 · off-token literals | RED both engines | **RED, and it cannot be otherwise** (§3.3) |
| 5 · the exceptions pay their toll | GREEN both engines | **GREEN** both engines |

The FIVE-anchor set is unchanged and KIN_DEG is still 5. Under the overlay the cured tokens
read (chromium, `readings/overlay/kinship-*.json`):

    light   user-ink   rgb(2,111,196)   h 251.2  Δ0.2° from crayon-blue   KIN
            progress   rgb(164,121,3)   h  83.4  Δ0.3° from crayon-gold   KIN
    dark    user-ink   rgb(71,167,255)  h 249.4  Δ0.0°                    KIN
            progress   rgb(125,105,2)   h  95.8  Δ0.6°                    KIN

### 3.2 Six new rows beside them (`probe/acc-five.probe.ts`)

| row | asserts | HEAD | overlay |
|---|---|---|---|
| 6 | the painted glow IS a resolved token, to the byte | **RED** — painted `[237,233,254]`, no token matches | **GREEN** both |
| 7 | the four 1.4.11 ratios on painted bytes, both themes | GREEN (they already clear 3:1) | **GREEN**, and better (§3.4) |
| 8 | print (#000) and forced-colors (`CanvasText`) survive the alias | GREEN | **GREEN** both |
| 9 | the destructive verb wears the danger ink at AA on its own ground | **RED** — `rgb(10,10,10)`, chroma **0** | **GREEN** at a 5% ground (4.56); RED at 8% (4.35) |
| 10 | the pen is kin AND at AA on both papers | **RED** — 11.46° / 5.29° | **GREEN** both, both themes |
| 11 | the heading is achromatic and the chip is not | **RED** both engines | **GREEN** both |

Row 9 also closes a hole R2 declared: R2 reached the guard ribbon in **chromium only** and
banked `refusalNote: null` for webkit. This row reaches it in **both** engines by polling the
`g` → staging-deal → ribbon path instead of sleeping at it.

### 3.3 R2's row 4 is unsatisfiable, and that is a finding

Row 4's claim is "no interactive surface paints a colour no token names". Its test is
`/drop-shadow\([^)]*(rgb|rgba|color)\(/` — which matches **any** colour. Under this family's
overlay the glow computes to `color(srgb 0.788235 0.603922 0.180392 / 0.3)`, which is
`--color-crayon-gold` at 0.3 in both engines, and row 4 still fails. **The row can only go
green by deleting the glow.** Row 6 asserts the claim instead: resolve the painted colour and
every candidate token through the same 1×1 canvas and require a byte match.

### 3.4 The four 1.4.11 ratios, on painted bytes, before and after

Canvas read-back at each mark's own stroke-opacity — R2's peer-walk technique, so a
`color-mix()` is priced through the gamut mapping the stroke itself receives.
`readings/{control,overlay}/row7-ratios-*.json`.

| ratio | HEAD chromium / webkit | overlay chromium / webkit |
|---|---|---|
| focus ring @0.9 over `--color-card`, light | 3.63 / 3.62 | 3.63 / 3.62 (unchanged) |
| focus ring @0.9 over `--color-card`, **dark** | 3.66 / 3.67 | **6.38 / 6.44** |
| trace @0.95 over `--grid-line-color`, light | 3.35 / 3.35 | **3.60 / 3.60** |
| trace @0.95 over `--color-card`, light | 3.85 / 3.85 | 3.57 / 3.58 |
| trace @0.95 over `--grid-line-color`, dark | 3.44 / 3.48 | 3.18 / 3.23 |
| trace @0.95 over `--color-card`, **dark** | 3.05 / 3.07 | **3.23 / 3.26** |

The number that binds is the **worst of the four**, because the trace has to clear both grounds
at once: light **3.35 → 3.57**, dark **3.05 → 3.18**. The family's first kill is cleared and the
incumbent's own headroom improves in both themes. (A fifth ratio was taken and is not in the
charter's list: the trace over `--color-background`, 3.48–3.53 light / 3.28–3.33 dark.)

### 3.5 The pixel census, re-run and then re-run properly

R2's `hue-census.probe.ts` re-runs clean under the overlay, 4/4 green in both arms. But the
URL carries no puzzle seed, so two CONTROL runs of the same cell dealt different boards and
`chromaticPixels` moved **16,499 → 14,515** on chromium/dark/mid-board by themselves.
Comparing arms across deals prices the deal. `probe/census-paired.mjs` therefore takes ONE
page to each state, censuses it, injects the overlay on the same pixels, and censuses again.
R2's band (OKLCH 40–115°) and chroma floor (0.012) are carried verbatim.

| engine | theme | state | off-family % before → after | violet px → | gold px → |
|---|---|---|---|---|---|
| chromium | light | rest | 6.79 → **3.35** | 25 → 16 | 2,580 → 2,683 |
| chromium | light | focused | 14.50 → **11.57** | 25 → 16 | 2,580 → 2,683 |
| chromium | light | mid-board | 21.25 → **15.22** | 811 → 16 | 2,580 → 3,435 |
| chromium | dark | rest | 12.96 → **6.49** | 43 → 16 | 4,576 → 4,774 |
| chromium | dark | focused | 20.81 → **15.29** | 43 → 16 | 4,556 → 4,754 |
| chromium | dark | mid-board | 36.54 → **16.52** | 2,375 → 16 | 4,564 → 6,370 |
| webkit | light | mid-board | 32.66 → **7.58** | 6,123 → 16 | 2,650 → 8,690 |
| webkit | dark | mid-board | 56.56 → **11.08** | 9,004 → 16 | 4,474 → 10,886 |

Full table `readings/census-paired.json`.

**Read this honestly.** The census's band contains exactly two crayons — orange 68.7° and gold
83.7°. crayon-blue (251.4°), crayon-green (147.0°) and crayon-rose (14.2°) are all OFF-band. So
"off-family" in this instrument means *not warm*, not *not kin*, and **the blue move does not
shift this number by one pixel**. Every point above is the violet dying. The blue's win is
measured by the kinship rows, not here. A residue of **16** violet pixels survives in every state and both themes, unchanged by the
overlay and by the board's fill: a fixed, tiny, board-independent mark, which is the shape of
the chrome sparkle's own `#sparkle-rainbow` stop (`SvgFilters.vue:168`). This lane did not
locate those pixels on the page and does not claim more than the number.

### 3.6 The consumer map after the moves (`probe/consumers.mjs`, re-run)

Reproduces R2's exactly. `--color-user-ink` 24 VAR / 0 CLASS; `--color-progress-ink` **1**;
`--color-focus-sketch` **2**; `--color-crayon-blue` 5 VAR / 13 CLASS; `--color-red-ink` 3.
Nothing is left with a hex and zero consumers: `--color-blue-ink` is minted with one consumer
(`--color-user-ink`) on the day it is minted, and `--color-progress-ink` keeps its name and its
one consumer. No colour gets a third name — the three golds that result (`crayon-gold` wax,
`gold-ink` verdict text, `progress-ink` trace) are three lightness tiers with three jobs and
three distinct measured floors, which is the ink-tier pattern, not an alias with no consumer.

**One thing the alias does break, and it is one line.** `HandwrittenGlyph.vue:85` spells
`var(--color-user-ink, #2563eb)`. After the move that fallback is a stale Tailwind blue-600 —
it fires only if the token is undefined, but it is a lie the moment the token moves. It goes to
`#026fc4` or it goes away.

---

## 4. Print, forced colours, and the one place the prototype is not the cure

`addStyleTag` appends after `index.css`, so an overlay declaring `--color-user-ink` would beat
the print block at `index.css:932-936` on source order — the reverse of the real cure, where
the alias sits at `:151` and print wins. The overlay therefore re-states the print arm at its
foot, and row 8 measures the cure's behaviour:

    print         --color-user-ink → rgb(0,0,0);  .glyph-svg path stroke → rgb(0,0,0)   both engines
    forced-colors .glyph-svg path stroke === CanvasText                                 both engines

Both arms hold at HEAD and under the overlay. The alias is transparent to both.

---

## 5. The contradiction, shown

`index.css:174`: *gold is earned light; it comes to the page only when the work is done.* A
gold stripe at 5% fill is gold on the page before the work is done. Stated as arithmetic
(`readings/guard-and-meter.json`):

| fill | arc drawn | ink area | share of the board |
|---|---|---|---|
| 0% | nothing rendered at all (`traceNodes` 0) | 0 | 0 |
| 5% (one keystroke on a 20-blank deal) | **126 CSS px** of a 2,513 px ring | 640 px² | **0.16%** |
| 50% | 1,257 px | 6,397 px² | 1.6% |
| 100% | 2,513 px | 12,794 px² | 3.2% |

`frames/meter-strip.png` (33,915 B) — four panels, chromium light, under the overlay:
`aria-valuenow` 5 / 50 / 100 / 100-and-solved.

**The answer this lane gives: the meter is the celebration arriving, not gold spent early, and
the distinction is the tier the house itself already draws.** What appears at 5% is the gold
INK (L 0.603, C 0.123) — a pressed pencil. What arrives at the win is the gold WAX (L 0.712,
C 0.131), one lightness tier up. The trace is 126 px of ink covering 0.16% of the board; the
win floods the whole frame with the crayon. Measured at the hand-off (`readings/handoff.json`):

    light   trace h 83.4°  →  solved frame h 83.7°   Δ 0.3°,  ΔL +0.110
    dark    trace h 95.8°  →  solved frame h 95.2°   Δ 0.6°,  ΔL +0.309

That is the strongest sentence this family can say: **the trace and the celebration are the
same hue at two pressures, on the same rect, from the same seed** (`gridPaths.ts:338-370`
builds both from one source). The violet could never say it. But see §6 — today the second
half of that sentence does not paint.

A reader learns the gauge exists the way the tree already teaches it: nothing at 0%, then 126
px of ink appears on the frame at the first digit. No label; the only `progressbar` is the
1×1 sr-only div at `HandDrawnGrid.vue:299-307`. That is §4's own question and this lane does
not close it — it only says the hue no longer needs one.

---

## 6. The blocker this lane found, and it is not this family's

The family's centre — "the trace becomes the solved frame" — assumes the solved frame paints
gold. It does not.

`probe/solved-frame-paint.mjs` samples a 22 × 246 px band across the board's LEFT frame edge,
before and after the win, at 900 / 1800 / 2700 / 3600 / 5000 ms, both themes. At HEAD, with no
overlay at all:

    before the win   1,433 chromatic px, median hue 293.0  (light)   ← the violet trace, painting
                     1,418 chromatic px, median hue 294.1  (dark)
    after the win    0 chromatic px, every sample, both themes, through 5 s

`.solve-success` is on and `.grid-line` computes `rgb(201,154,46)`. It never reaches paint:
`bakedHidden 4`, `bitmaps 4` — the live vector stack is `display: none` under the grid bake
(`HandDrawnGrid.vue:560-564`) and the recolour lands on hidden nodes while pre-baked graphite
bitmaps hold the surface. `frames/handoff-light.png` (6,427 B) shows it: left, the gold trace
at 100%; right, the same corner at the win, frame graphite, trace gone.

This is a pre-existing estate defect, true of the violet exactly as much as of the gold, and it
is a computed-style-versus-paint trap — R2's own states census recorded the solved frame as
`rgb(201,154,46)` by reading `getComputedStyle`. **It does not change this family's verdict**
(every ratio above is measured on marks that do paint) but it must be named, because the
family's best sentence is unprovable on screen until the bake is invalidated at the win.
Scope: the substrate, a W7/W8 row, not a token.

Two more numbers from the same neighbourhood, both pre-existing: the solved frame's gold wax
measures **2.53:1** on the light card (under the 3:1 non-text floor), and the dark grid line
`rgb(209,207,199)` is itself OKLCH hue **95.2°** at chroma 0.0111 — the dark graphite frame is
a warm near-gold grey sitting just under the census's own chroma floor. The gold trace and the
frame it retraces are the same hue in dark; only pressure separates them.

---

## 7. What this family does NOT claim

- **Row 3, the control focus ring.** Every control still renders `outline-style: auto` in
  `--color-ring` at 50% — the Tailwind preflight's ring at `index.css:445`, which nobody chose.
  That is a focus-IDIOM decision (§6 of the wave), not a token alias, and this family leaves it
  RED and untouched. Its cure is an authored `outline` on controls; its gate must keep R2's
  subject-count guard, because PW-WebKit reaches **0** controls by Tab.
- **The peer palette.** §8 below hands over the hole; PLR-* designs the palette.
- **The meter's form** (symmetric inset versus the straddle, the ~126 px first stroke, the
  first-run whisper). This lane priced it and hands the numbers on; §4's form question is not a
  hue question.
- **The rainbow.** It stays, and it is now the only violet in the product.

### The violet's death, and what it costs the "one family" claim

After this family, violet paints in exactly two places, both declared: solver stop 2
(`#7c3aed` light / `#c4b5fd` dark, `SvgFilters.vue:180-184`) and the `#sparkle-rainbow` chrome
gradient stop at `SvgFilters.vue:168`. The census sees them as **16 pixels** at rest. So "one
family plus one declared exception" is true at the token level and true to sixteen pixels on
screen. The instrument records it the right way: those tokens carry `except: "discriminability"`
in the kinship rows and are collected by row 5 at the AA text floor (5.29–6.21:1), so the
exception is never a pass, it is a bill.

---

## 8. The peer anchor set — the arcs a per-player palette must clear

Union over both themes, each job's hues ± KIN_DEG 5° (`readings/reserved-arcs.json`):

| job | reserved arc | width |
|---|---|---|
| danger (`crayon-rose`, `red-ink`) | 7.2° – 19.2° | 12.0° |
| difficulty medium (`crayon-orange`, `orange-ink`) | 59.2° – 76.8° | 17.6° |
| **celebration + progress** (`crayon-gold`, `gold-ink`, the new trace) | 77.4° – 100.8° | 23.4° |
| difficulty easy (`crayon-green`, `green-ink`) | 142.0° – 153.3° | 11.3° |
| **selection + focus + authorship — YOURS** (`crayon-blue`, `focus-sketch`, `blue-ink`) | 244.3° – 258.3° | 14.0° |

**78.3° reserved, 21.8% of the wheel; 281.7° free.** Two notes the palette designer needs:
this family WIDENS the gold arc (the trace's dark arm at 95.8° pushes the union to 100.8°) and
it does not widen the blue arc at all — `blue-ink` lands inside the arc `crayon-blue` and
`focus-sketch` already reserved. And R6 law 21 stands on top of this: no player is ever
assigned wax or a rainbow stop. Today's walk is `oklch(var(--peer-ink-l) 0.11 i×137.5°)` at
chroma 0.11 against a mean crayon chroma of 0.166.

---

## 9. Kill conditions, and the recommendation

| kill the charter named | result |
|---|---|
| gold's dark arm under 3:1 over `--grid-line-color` — *the first kill* | **CLEARED, after the stated move died.** crayon-gold dark reads **1.07:1** there; the ink tier `#7d6902` reads **3.22 / 3.23**. The wax cannot carry the trace in either theme |
| a gold stripe at 5% against the gold law | **SHOWN, and answered**: 126 CSS px, 0.16% of the board, in the INK tier, against a win that floods the frame in the WAX one tier up, at Δhue 0.3°/0.6°. Not gold spent early — gold at pencil pressure |
| blue-ink darker than blue-600 changes the digit's weight | **CLEARED with a number**: `#026fc4` is 5.065 against 5.078 on the card and 4.945 against 4.958 on the background. Δ **0.013** |
| the alias breaking print / forced-colors | **CLEARED**, both arms, both engines, by emulation (row 8) |
| *(new)* the charter's own pen/ring separation, 0.20 vs 0.13 | **REFUTED**: 0.20 chroma is outside the sRGB gamut at crayon-blue's hue for any AA blue. Available ΔC is 0.025 light / 0.052 dark |
| *(new)* the confirm's face at AA | **RED at 8%, GREEN at 5%** — the ground and the ink cannot both be there at today's red |

**DEVELOP.** The family's central claim is measured and it holds in both engines and both
themes: the two accents that broke the wheel become kin (11.5° → 0.2°, 41.3° → 0.3°) with the
kinship rows green, the anchor set unchanged, KIN_DEG unmoved, and the worst of the four 1.4.11
ratios IMPROVING in both themes (3.35 → 3.57 light, 3.05 → 3.18 dark) rather than being spent.
The dark focus ring nearly doubles, 3.66 → 6.38/6.44, and the comment at `index.css:222`
becomes true. Off-family pixel content falls by half at rest and by more than half mid-board,
and every point of that is the violet. Print and forced colours are untouched. The blast radius
is one alias, one value, one dark arm, two CSS rules, and one stale fallback hex.

**Two adjustments the synthesizer must carry.** First, the charter's gold move is wrong in its
own terms — `--color-progress-ink` cannot alias the wax, in either theme, and the cure is a
gold ink tier at `#a47903` / `#7d6902`. Second, the pen/ring separation cannot be bought with
chroma at the stated figures; pass 2 should pick one of the three priced dark pens (§2.2) and
lean the separation on form, and the confirm's ground drops 8% → 5% or the destructive verb
goes bare.

**One thing that is not a verdict but blocks the family's best sentence.** The solved frame's
gold does not paint while the grid bake is live (§6). That is the estate's, not this family's,
and it is true at HEAD. If it is not cured, "the trace becomes the solved frame" remains a
token claim and a crop cannot show it.

Nothing here closes a mark. U-10.

---

## 10. Files, and how to re-run

    probe/oklch.ts            R2's converter, carried verbatim
    probe/oklch.mjs           the same, plus the OKLCH→sRGB inverse the search needs
    probe/grounds.mjs         every ground and anchor, off the live page, both engines/themes
    probe/search-inks.mjs     the ink search + the feasible windows + the luminance bands
    probe/separation.mjs      the weight-preserving blue, pen-vs-ring, the gold "sliver"
    probe/guard-and-meter.mjs the confirm's five priced options; the meter's arithmetic
    probe/reserved-arcs.mjs   §8
    probe/glow.mjs            the sparkle's glow under four spellings, both engines
    probe/accent-kinship.probe.ts   R2's, + two hunks (proto/accent-kinship.probe.diff)
    probe/hue-census.probe.ts       R2's, + two hunks (proto/hue-census.probe.diff)
    probe/acc-five.probe.ts   rows 6–11
    probe/census-paired.mjs   the paired pixel census
    probe/crops.mjs           the three banked frames
    probe/handoff.mjs         the 100% → solved hand-off, measured
    probe/solved-frame-paint.mjs    §6
    proto/five-crayons.css    the overlay
    readings/…                every number above, raw

Runs (from `web/frontend`, with a dev server on 4236; the probes resolve `@playwright/test`
out of `web/frontend/node_modules`, so they execute from a scratchpad copy of `probe/` with
that directory symlinked beside it — R2's own arrangement, no product file and no
`package.json` touched):

    ACC_FIVE_OUT=<here>/readings/control  npx playwright test --config <copy>/pw.config.ts -g "§3 kinship|ACC-FIVE"
    ACC_FIVE_OUT=<here>/readings/overlay ACC_FIVE_OVERLAY=<here>/proto/five-crayons.css  … same …
    node probe/grounds.mjs && node probe/search-inks.mjs && node probe/separation.mjs
    node probe/census-paired.mjs && node probe/crops.mjs && node probe/handoff.mjs

**Frames** — 56,535 B total, four files, each cited above:
`frames/board-corner-light.png` 5,030 B · `frames/board-corner-dark.png` 5,131 B (330×210 at
the board's top-left, under the overlay, to be read beside R2's two at HEAD) ·
`frames/meter-strip.png` 33,915 B (§5) · `frames/handoff-light.png` 6,427 B and
`frames/handoff-dark.png` 6,032 B (§6).

**One omission, stated.** R2's `hue-census.probe.ts` was re-run in both arms, both engines,
both themes, 4/4 green each time; its raw per-arm JSON (8 files, 288 KB) is NOT banked, because
`census-paired.mjs` supersedes it on the same question with a paired board and this lane would
otherwise be the heaviest in the bucket. `readings/census-unpaired-digest.json` keeps the
headline figures, and the command above regenerates the raw in about 15 s per arm.

---

## 11. Traps this lane hit, for whoever writes the gate

1. **The colour tween.** `.sparkle-icon` carries `transition: all 200ms`
   (`GameControlPanel.vue:2082`) and the section heading carries `transition-colors
   duration-250` (`:190`). A computed-style read taken before those settle returns a frame of
   the tween — measured once as `drop-shadow(rgba(12,10,14,0.3) …)` on the sparkle and
   `rgb(95,118,101)` on the heading, colours that are in neither the before nor the after. Kill
   the transition or settle 600 ms, or the gate reports a colour nothing declared.
2. **Computed style is not paint.** §6: `.grid-line` computes gold at the win and paints
   nothing, because the node is `display: none` under the bake. Any colour gate on the board's
   structure must read pixels.
3. **Scoped SFC specificity.** `.guard-leave .guard-face` is `(0,2,1)` with its `[data-v-…]`.
   An overlay at `(0,2,0)` wins `color` and silently loses `background` — the first run of row
   9 priced red ink over the incumbent grey ground because of it.
4. **The deal is not seeded.** Two control runs of the same census cell differ by ~2,000
   chromatic pixels. Any before/after on this product must be paired on one board.
5. **An injected `<style>` does not survive a reload.** One arm of §6 silently reverted to the
   incumbent violet mid-run; the tell was hue 294.1° appearing under a gold overlay. Assert the
   overlay's presence at every sample, or use `addInitScript`.
6. **`.guard-*` needs polling, not sleeping.** The `g` → deal → ribbon path missed in chromium
   with a click and in webkit with the shortcut, on different runs. Row 9 polls each stage and
   reaches both engines.
