# ACC-SIX — the sixth crayon · PASS-2 research record

T9-W7 convergent design loop, pass 2 (RESEARCH), family ACC-SIX alone. §3 accent family · §4 fill
meter · §12 multiplayer chrome · §15 danger ink · M07.

Measured 2026-09-17/18 on `a8fee1f5` against the **BUILT dist** (`dist/assets/index-9rZPzI5DEcpe.js`
— the artifact W8 §8.1 holds fixed; **no build was run**), previewed on `127.0.0.1:4237`
(`--strictPort`, private `cacheDir`), chromium + webkit, light + dark, 1280×800 + 393×699. Server
killed before return. Read-only on the product: nothing under `src/`, `e2e/` or `scripts/` was
opened for writing, and the two pad arms are produced by **calling the exported generator with
different pads**, never by editing `gridPaths.ts`.

Chair's rulings read first. Two rows left this family and are honoured throughout: **FRAME_PAD**
(§6.2 — its own row; this family ships at HEAD's value) and the **focus-ring token** (§6.1 — §6
owns it; read here, never written).

Evidence 288 KB. Two cited crops. Everything else is numbers.

---

## 0. THE FOUR THINGS THIS PASS FOUND THAT PASS 1 DID NOT

1. **The shipped fill gauge is broken in WebKit, on the artifact that deploys.** One write of
   twenty paints **5.5 % of the ring in one arc in Chromium** and **21.1 % in FOUR arcs, one per
   side, in WebKit** (§2). It is not a design risk; it is a live defect on `sudoku.babb.dev`
   today, and §4 is the section that owns it.
2. **The masthead row cannot be cured by re-wording the gate as an ink test.** The masthead's
   bottom edge is the board's top edge **to 0.000 px** in both engines at every viewport (that is
   M18's landed law, `e2e/masthead-alignment.spec.ts`), so a straddling tape intersects the
   masthead's *box* by construction — and it intersects the masthead's *painted boxes* too, by
   664 px² desk-chromium / 694 desk-webkit / 190 phone. At `lift = 0` both readings are **0.0**.
   The cure is geometric, not lexical: the tape does not straddle (§3).
3. **The 1.3 px in the meter-symmetry row is found, and it is the hand.** The per-pose asymmetry
   of the pad-symmetric ring is **1.980 / 2.710 / 2.830 / 2.430 viewBox units** = 1.259 / 1.724 /
   **1.800** / 1.546 CSS px at the 636 px desk board. Pass 1's live 1.80 (chromium) and 1.54
   (webkit) are poses 2 and 3 of that stack, to the hundredth. The gate did not miss by 1.3 px; it
   was written against a number the wobble cannot reach (§4).
4. **The font-coverage gate's "cannot fail" is half wrong, and the other half is worse than
   stated.** `check-font-coverage.mjs:466-471` already reds on an empty derivation, so a template
   edit does **not** pass silently. What does pass is a template that still matches while
   rendering a glyph the hard-coded constant never mentions (§7).

---

## 1. THE FRAME, DECLARED — and the numbers that go beside the goldens

**The claim is reversed and the delta is declared: FRAME_PAD moves the frame 12.000 viewBox units
= 7.632 CSS px at the 636 px desk board, 4.380 px on the 365 px phone board**, on the top and
bottom edges of every board in five games in both themes. Pass 1's prototype record said the frame
did not move; it did. Per chair §6.2 this family **ships FRAME_PAD at HEAD's value** and carries
none of the pads — what follows is handed to the FRAME_PAD row.

`instruments/frame-geometry.entry.ts` → `readings/frame-geometry.txt`, run on the shipped call
(`generateFrameTraceFrames(1000, 42, BOIL_CONFIG.frameCount=4, BOIL_CONFIG.frameBoil=1.2,
FILTER_PRESETS["grain-static"].grain)`), all four poses:

| pose-0 bbox, viewBox units | HEAD (12, 0) | pads (12, 12) | Δ |
|---|---|---|---|
| fill trace y0 | **−5.060** | **+6.940** | +12.000 |
| fill trace y1 | **1002.700** | **990.490** | −12.210¹ |
| grid frame y0 | **−4.761** | +7.239² | +12.000 |
| grid frame y1 | **1001.827** | 989.827² | −12.000 |
| fill trace x0 / x1 | 4.370 / 995.780 | 4.960 / 995.720 | +0.590 / −0.060 |

¹ the flank RNG walk changes with the rect's height, so the bottom moves 12 ± the wobble.
² from the pass-1 critique's grid run, which reproduces my HEAD numbers to the byte.

**A correction the record needs.** The critique's trace row (`−6.187 → +5.813`) was produced by
`generateFrameTraceFrames(1000, 4, 12345, 0.5)` — argument order `(viewBoxSize, baseSeed,
frameCount, frameBoil, grain)`, so that call ran seed 4, frameCount 12345, no grain. Its **Δ of
12.000 is right**; its absolute numbers are not the shipped trace's. Its grid row (`−4.761`) *is*
the shipped call and reproduces exactly. Any assertion minted from those numbers must use this
table's, not that one's.

### The geometric assertion, written so a thin line cannot move unseen

The goldens are blind here by arithmetic: `grid-corner` is a 180×180 CSS clip at DPR2 = 129,600
device px; a ~3-device-px line relocating 15 device px dirties ≈ 2×360×3 = 2,160 px ≈ **1.7 %**
against `maxDiffPixelRatio: 0.02`. So the assertion goes **beside** the bitmap, in viewBox units,
where 12 units is 12× the noise:

```
// born-RED against any FRAME_PAD move; unit-level, no browser, no DPR, no threshold.
const poses = generateFrameTraceFrames(1000, 42, BOIL_CONFIG.frameCount,
                                       BOIL_CONFIG.frameBoil, FILTER_PRESETS["grain-static"].grain);
const y0 = poses.map(bboxTop);            // HEAD: −5.060 −4.130 −4.310 −4.840
expect(Math.max(...y0)).toBeLessThan(-3.5);   // envelope amp is 0.930 u; a 12 u move overshoots 13x
expect(Math.min(...y0)).toBeGreaterThan(-6.0);
// and the registration invariant A-1c, which is the reason the pads are shared at all:
expect(gridFrameTop(0) - traceTop(0)).toBeCloseTo(0.299, 1);   // HEAD −4.761 vs −5.060
```

Envelope over the four poses at HEAD (the tolerance's source): y0 amp **0.930**, y1 amp **1.770**,
x0 amp **1.750**, x1 amp **0.490**. Perimeter: nominal 3,952 units at HEAD → 3,904 at (12,12),
**−1.21 %**.

---

## 2. §4's REAL DEFECT — the WebKit dash law, on the shipped gauge

`HandDrawnGrid.vue:476-478` paints `pathLength="1000"`, `stroke-dasharray="1000 1000"`, driven
`stroke-dashoffset`. `getTotalLength()` on the shipped poses is **3965.63 / 3963.11** user units,
so the pathLength scale factor is **3.966** — and that number, not a constant, is the "four".

**On the live board, built dist, after ONE real write of twenty**
(`instruments/dash-paint-census.mjs`, 960 samples walked round the frame rect):

| engine | painted | runs | top / right / bottom / left | verdict |
|---|---|---|---|---|
| chromium | **5.5 %** | **1** | 21 % / 0 / 0 / 1 % | the truth: 1 of 20 = 5 %, one front from the top-left |
| webkit | **21.1 %** | **4** (5 with wrap) | 21 % / 20 % / 22 % / 22 % | **3.84× the truth, one arc on each side** |

Crops: `frames/gauge-1of20-chromium.png`, `frames/gauge-1of20-webkit.png` (one write, light,
1280×800). This is the one claim a number could not carry alone — the shape of the error is four
corner ticks, not a longer front.

**Controlled sweep on the estate's own pose-0 `d`** (`probe/acc-six-dash.probe.ts` +
`instruments/dash-sweep-census.mjs`, 720 perimeter samples; webkit's ceiling for a fully-painted
ring is 91.1 %, so read its column against that):

| dasharray @ offset 750 | chromium painted | webkit painted |
|---|---|---|
| `1000 1000` (the shipped gauge, 25 % asked) | **24.0 %** | **89.3 %** (98 % of ceiling) |
| `1000 1000` @ offset 500 (50 % asked) | 49.0 % | 89.3 % |
| `500 500` | 50.1 % | **3.6 %** |
| `250 250` | 50.8 % | **4.0 %** |
| `1000 0` (solid) | 98.3 % | 91.1 % (ceiling) |

Every row fits one mechanism: **WebKit applies the `pathLength` scale to `stroke-dasharray` and
`stroke-dashoffset` one time too many.** Predicted painted fraction for `250 250`@750 under a
doubled scale is 0.9 %; measured 4.0 % with cap/AA noise. For `1000 1000`@750 it is 99.1 %;
measured 89.3 % against a 91.1 % ceiling.

**The cure, and it is a deletion.** Drop `pathLength` from the dash and express the dash in real
user units per pose. The four poses differ by **2.52 units in 3965** (0.064 %), so a per-pose real
length is *strictly better* normalisation than one nominal 1000 — and the length is computable at
bake time from the pose's own polyline, with no DOM read and no layout:

```
// gridPaths.ts — beside generateFrameTraceFrames, a pure sibling.
export function poseLengths(frames: string[]): number[]   // polyline arc length per pose
// HandDrawnGrid: :stroke-dasharray="`${L[f]} ${L[f]}`"  :style="{ strokeDashoffset: L[f]*(1-progress) }"
```

It also un-breaks the **join trace** (`HandDrawnGrid.vue:509-511`, same `pathLength`/dasharray
pair, seed 91) and it is the arc-length primitive ACC-GRAPHITE's `tickMarksAlong` wants. Born-RED
gate: the painted census above, asserting chromium ≈ webkit within 2 points at progress 0.05 /
0.25 / 0.50 — RED at HEAD in webkit by 15.6 points.

**π note.** This moves painted pixels on a surface this family claims (§4), in Chromium too
(0.064 % of the front's position). It is declared, it is not FRAME_PAD, and it is the only pixel
this family asks for.

---

## 3. §4's PLACEMENT — the masthead and the occlusion, closed together

### The masthead row is a geometry row (`readings/ink-*.json`)

`masthead.bottom − board.top` = **0.000** px: chromium desk, webkit desk, chromium phone, webkit
phone. That is M18's landed law (`e2e/masthead-alignment.spec.ts`: "the board's top edge is the
row's rule and the rule is the masthead's own bottom edge"). **A box-intersection gate can only
read zero when the tape's lift is zero.** Pass 1's 1,073 px² (desk chromium) reproduces exactly:
93.3 wide × 11.5 of lift.

The ink test does not rescue the straddle. The masthead's painted boxes are the wordmark svg
(`svg.handwritten-logo`) and the `@mbabb` glyph, and their bottom sits only **4.39 px** (desk
chromium), **4.06 px** (desk webkit), **5.24 px** (phone) above the board's top edge:

| tape pose (93.3 × 23.0 desk / 82.7 × 20.1 phone) | lift | vs masthead INK, desk chr / desk wk / phone |
|---|---|---|
| straddle, `top: -h/2` (pass 1's) | 11.5 / 10.05 | **664 / 694 / 190 px²** |
| **flush, `top: 0`** | 0 | **0 / 0 / 0** |
| seated inside, `top: +2` | −2 | 0 / 0 / 0 |
| bottom-left head | −613 | 0 / 0 / 0 |

A 23 px tape needs 11.5 px of air to straddle at half; there are 4.06.

### The occlusion row, and the one pose that closes both

The trace's perimeter is 3,952 units × 0.636 = **2,513.5 CSS px** at the desk, 1,442.5 px on the
phone. The first fill of twenty draws **125.7 px** (desk) / **72.1 px** (phone), clockwise from the
top-left, starting at `+7.63 px` along the top edge. A top-left tape 93.3 px wide starting at
`+7.48` covers:

| | trace drawn at fill 1 | tape covers | occluded |
|---|---|---|---|
| desk 636 px | 125.7 px | 93.15 px | **74.1 %** |
| phone 365 px | 72.1 px | 72.1 px | **100 %** |

**Ruling: the tape is RIGHT-ALIGNED at the board's top-right, flush (`lift = 0`).** The trace runs
clockwise and reaches the top-right corner only at `620.7 / 2513.5` = **24.7 % fill** — five of
twenty. The tape is up for fills 1–3 (≤ 15 %). **The trace never reaches the tape while the tape is
up: occlusion is zero for its whole life, at every viewport, by arithmetic rather than by tuning.**
And the right-aligned box at the desk starts at x = board.right − 100.78 = 667.1, while the
masthead's ink ends at x = 549.0 — so the masthead question is answered twice over.

Cost: the tape no longer marks where the trace *begins*. That is the trade, and it is the right one
— a label that hides the thing it explains for the entire window in which it is up is not a label.

### The seed, pinned (and the warning handed on)

`SheetWashiLabel.vue:56` — `mulberry32(props.seed * 2654435761 + props.text.charCodeAt(0))` — and
`charCodeAt(0)` is the **leading digit** of the count, so the six-point torn clip-path and the
±1.5° tilt (`:70`) re-roll on `1 of 20` → `2 of 20` → `3 of 20`. The fix is one argument, in the
call site, not in the component: pass a text-independent `seed` and stop the text entering the RNG.
Component-level cure (cheaper, and it fixes every future caller):

```
-  const rng = mulberry32(props.seed * 2654435761 + props.text.charCodeAt(0));
+  const rng = mulberry32(props.seed * 2654435761);
```

`props.seed`'s own docstring at `:16` already says "stable per-button seed so a given label's tear
+ tilt never re-roll" — the text term contradicts the prop's stated contract. **Handed on, as the
charter directs: CTRL-TAPE, PLR-COUNT and MRK-LIVE all inherit a tape whose geometry re-tears on
every text change until this lands.** Any lane whose washi label carries a changing string is
affected; a label whose text never changes is not.

---

## 4. THE SYMMETRY ROW — the 1.3 px, named

Per-pose `|top inset − left inset|` of the pad-symmetric ring, in viewBox units and in CSS px at
636 (`readings/frame-geometry.txt`):

| pose | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| units | 1.980 | 2.710 | **2.830** | 2.430 |
| CSS px @636 | 1.259 | 1.724 | **1.800** | 1.546 |

Pass 1 read **1.80 chromium / 1.54 webkit** live. Those are poses 2 and 3. The boil beat swaps the
four poses at 8 Hz, so a live bbox read samples whichever pose is active — the "engine difference"
was a phase difference.

**Ruling (ACC-FIVE's graft: measure the thing that MOVES).** The symmetry claim is about a
CONSTANT, and the constant is `FRAME_X_PAD ≡ FRAME_Y_PAD` in `gridPaths.ts:338-339`. Assert *that*,
in viewBox units, unit-level:

```
expect(FRAME_X_PAD).toBe(FRAME_Y_PAD);                      // the ruling, exactly
expect(Math.max(...poses.map(asym))).toBeLessThan(3.0);     // the hand's own floor: 2.830 u
```

Neither number is the family's to re-cut after the shot: the 3.0-unit floor is the measured
envelope of a shipped generator, and the ≤0.5 px painted gate is struck because it asserts against
the wobble the house's whole idiom exists to have. The row travels with FRAME_PAD (chair §6.2), not
with the palette.

---

## 5. §3 — the palette, unchanged, and the ONE ratio ledger

`instruments/ratios.mjs` → `readings/ratios.txt`. Every ground in it is validated against painted
bytes on the built dist, both engines, both themes (`readings/head-*.json`): card `rgb(253,253,252)`
/ `rgb(19,18,17)`, background `rgb(251,250,249)` / `rgb(17,15,14)`, grid-line `rgb(38,38,38)` /
`rgb(209,207,199)`, accent `rgb(246,246,244)` / `rgb(40,38,36)`, foreground `rgb(10,10,10)` /
`rgb(237,236,233)` — each one reproduces its `hsl()` declaration to the byte.

**This table is the only one. The charter's, the pass-1 research's, the pass-1 spec's and the old
`--color-answer-mid` comment are all superseded; the synthesizer mints it once, in `index.css`,
beside the tokens, and deletes the rest.**

| row | light | dark | floor |
|---|---|---|---|
| trace @0.95 over grid-line | **3.36** | **3.46** | 3.0 (1.4.11) |
| trace @0.95 over card | **3.85** | **3.07** | 3.0 |
| solver-ink-2 as text on card | 5.60 | 10.14 | 4.5 |
| blue-ink `#2f76bd` as text on card / background | **4.64 / 4.53** | — | 4.5 |
| crayon-blue-dark `#6aabeb` as text on card / background | — | **7.70 / 7.86** | 4.5 |
| ring `#2f76bd` @0.9 over card | **3.89** | — | 3.0 |
| ring `#6aabeb` @0.9 over card | — | **6.42** | 3.0 |
| ring HEAD `#3a7bc4` @0.9 over card | 3.63 | 3.69 | 3.0 |
| red-ink on bare card | **4.99** | **6.30** | 4.5 |
| red-ink on the HOVER ground `--color-accent` | **4.69** | **5.08** | 4.5 |
| red-ink on a 5 % neutral ground | **4.49** | 5.68 | 4.5 |
| red-ink on an 8 % neutral ground | 4.20 | 5.26 | 4.5 |
| red-ink chroma / hue (OKLCH) | C 0.1997 h 13.6 | C 0.1980 h 12.2 | — |

**3.89, not 4.01 and not 3.91** — the light ring number is corrected wherever quoted. The dark
gate re-cuts from "≥6.4" (two hundredths under the answer) to **≥6.0**, which is 0.42 of headroom
and still 1.6× the 1.4.11 floor.

**The 5 % ground dies on arithmetic, not on taste: 4.49 against a 4.5 floor.** Painted it reads
4.38 (pass 1, both engines). The verb sits on the bare card; the mark of arming stays stroke
weight. This is the same answer CTRL-COST (4.22 on 8 %), CTRL-TABS (4.20) and ACC-FIVE (4.42/4.63)
reached independently — registry §7 row 4's candidate wave law is confirmed a fifth time here.

### Anchors, for the kinship instrument (OKLCH h)

rose 14.2 · orange 68.7 · gold 83.7 · green 147.0 · **blue 251.4** · **the sixth 293.0**.
`blue-ink #2f76bd` is **251.4** — hue-locked to crayon-blue exactly. The three answer rungs are
293.6 / 292.7 / 293.0.

### The focus-ring token — READ, never written (chair §6.1)

`--color-focus-sketch` resolves to `rgb(58,123,196)` on `:root` in **both themes and both
engines** on the shipped dist: R6's law-probe R1 reconfirmed on the artifact that deploys.

**Which of §6's candidates this palette survives on: all three.** The token's hue is **253.3°** —
**1.9° from crayon-blue**, inside KIN_DEG 5 — so the accent law never required its deletion. What
the pass-1 deletion bought was contrast and name-thrift (3.63 → 3.89 light, 3.69 → 6.42 dark), not
kinship. Explicitly:

| §6 candidate | hue vs an anchor | this palette |
|---|---|---|
| MRK-LIVE: keep `#3a7bc4` unthemed, opaque, 4.19–4.38 on four grounds | 253.3° → 1.9° off crayon-blue | **survives** |
| MRK-ABS: dark aliases crayon-blue (`#6aabeb`) | 249.3° → 2.1° off | **survives** |
| ACC-FIVE: a dark arm at 6.4 (`#6aabeb` @0.9 = 6.42) | same | **survives** |
| any ring at HEAD's `--color-user-ink` `#2563eb` | 262.9° → **11.5° off** | **reds the kinship row** |
| any ring in the answer's violet | 293° | **reds kill-by-form** — the ring would be the answer's colour |

**The trap §6 must carry, whatever value it mints.** `gameCell.css:246,:248` declares
`var(--color-focus-sketch, var(--color-crayon-blue))` **inside** `.game-cell:has(input:focus-visible)`
— the very cell `playerIdentity.ts:69` rebinds `--color-user-ink` on. A ring pointed at
`--color-user-ink` takes a *peer's* colour on a peer's square. Note also that the existing
fallback means a bare deletion of the token silently lands on `crayon-blue` (`#4a90d9` light), not
on nothing: the re-point must be explicit in the same diff.

---

## 6. §15 — the red verb, and the hover rule that eats it

`GameGallery.vue:1459` is `.guard-leave .guard-face { background: color-mix(foreground 8%) }` —
**no `color` at HEAD**; the family's diff adds the red there. `:1431-1436` is
`@media (hover: hover) { .guard-btn:hover .guard-face { background: var(--color-accent); color:
var(--color-foreground) } }`.

Specificity: `.guard-btn:hover .guard-face` = **(0,3,0)**; `.guard-leave .guard-face` = **(0,2,0)**.
The hover rule wins, so the family's one chromatic signal is absent in the state a mouse user is in
at the moment of the act. Confirmed at the markup: `:1049` is `class="guard-btn guard-leave"` —
both classes on **one element**, so the cure is a compound selector, not a descendant one:

```
.guard-btn.guard-leave:hover .guard-face { color: var(--color-red-ink); }   /* (0,4,0) */
```

Measured on the hover ground: red-ink over `--color-accent` = **4.69 light / 5.08 dark**, chroma
**0.1997 / 0.1980**. AA clears in both themes with 0.19 and 0.58 of headroom, and the chroma is the
family's, unmoved. The hover pose keeps `--color-accent` as its ground — the estate's one hover
idiom (`.staging-face`, `.icon-btn`) is not forked.

The `@media (hover: hover)` wrapper must be kept on the cure too, or a coarse pointer gets a stuck
red on a `:hover` that never clears.

**`GameGallery.vue:1455-1458`'s comment** ("the heavier ink … **plus the 8 % ground, exactly as
`deal` wears it in the band**") is *correct at HEAD* and becomes self-contradicting the moment the
ground is deleted. It is the same block that would announce the deletion. One clause goes with the
ground.

---

## 7. THE GATE THE PATCH WRITES — what is actually wrong with it

`check-font-coverage.mjs` contract (`:35-41`): `derive` names extractors that read the AUTHORED
construct; the check is `DERIVED ⊆ DECLARED`.

**The critique's stated failure mode does not fire.** `:466-471` already reds on an empty
derivation — *"extractor `X` found NOTHING. An empty derivation contains anything, so this check
would pass on a blind read — the construct was renamed, or the file moved."* A template edit that
stops matching therefore REDS. That guard is the estate's, it predates this family, and the record
should say so.

**What IS wrong survives the correction.** The `countTape` extractor emits a hard-coded
`"0123456789 of 0123456789 written"` on a match: the regex is a claim about the *template* and the
constant is a claim about the *rendered alphabet*, and the two are only joined by the author's
hand. A template that still matches while rendering a glyph outside the constant is invisible, and
that is exactly T8's ransom-note shape. The charter's cure is right and closes it in one line:

```
const M = /`\$\{[^}]*\}([^`]*)\$\{[^}]*\}([^`]*)`/.exec(src);   // anchored to the tapeText computed
return M ? [{ s: "0123456789" + M[1] + "0123456789" + M[2], where: "<file>:tapeText" }] : [];
```

Now a copy edit changes the derived set and `⊆` does the work; and because any two-hole template
matches, the empty-derivation guard still covers a rename.

**The second row this gate owns**: `:494-497`, the BOUND CENSUS — `:text="expr"` cannot be read
statically, so the set of bindings is pinned and *a new binding reds until someone declares its
register*. `:text="tapeText"` must be added to that pin in the same diff.

### The cut, exactly — and what the copy may not say

`index.css:94-96`, Patrick Hand's `unicode-range`:
`U+0020-0021, U+0027, U+002D-002E, U+0030-0039, U+003F, U+0043, U+0052, U+0053, U+0061-0069,
U+006B-0077, U+0079-007A, U+00D7, U+2014, U+2026`.

space `!` `'` `-` `.` `0-9` `?` `C` `R` `S` `a-i` `k-w` `y-z` `×` `—` `…`

- **`%` (U+0025) and `/` (U+002F) are NOT in the cut** — never a percent, never a slash.
- **`j` (U+006A) and `x` (U+0078) are NOT in the cut** — no word carrying them.
- `written`, `filled`, `of`, `on the board`, `you`, `left`, `to go` are all free. **Zero re-cut.**

---

## 8. THE LIFECYCLE ROWS — one ruling each, with the mechanism named

**"Gone by fill 4" vs the spec.** The spec's own timer starts on the third fill, so a fourth write
inside `tapeRestMs` is shown. Pick the spec, and write the gate to the mechanism: *the tape is gone
`tapeRestMs + chromeLeaveMs` after the THIRD fill, and a write during the rest window does not
extend it.* Pass 1 measured that behaviour green in every viewport and both engines; only the
gate's sentence was wrong.

**Undo-to-empty, and the resumed board.** `fillProgress` (`GameBoard.vue:353-361`) is a pure
derivation with no memory, so `n === 0` after an undo is byte-identical to a fresh deal. There is no
board-id prop on `GameBoard` — but there is an identity already in its props: **`givenCells`**. The
component already watches `props.givenCells.size` at `:782`. A stable digest of that set is a board
key that costs no plumbing:

```
const boardKey = computed(() => [...props.givenCells].sort().join());   // changes iff the deal does
watch(boardKey, () => { taught.value = false; tape.value = "off"; });   // a new board may teach
// lay down ONLY on the 0 → 1 transition while !taught; set taught after the third fill's rest.
```

Undo to empty leaves `taught === true` → no resurrection. A session restored at two fills mounts
with no 0→1 transition → no tape mid-board. Both rows close on one computed.

**Multiplayer (§12).** `fillProgress` counts every non-given cell that has a value — **peers
included** (`GameBoard.vue:355-356`). So a peer's three writes lay *your* tape and speak in *your*
progressbar. Per-cell authorship does exist (`playerIdentity.ts:77`: "authorship — `ledger.clock`
keys authors by id") but is not plumbed to `GameBoard`. **Ruling: the tape counts the BOARD and the
literal says so.** `3 of 20 written` becomes ambiguous in a room; `3 of 20 on the board` is
board-truthful, plain (M16), free in the cut, and agrees with the existing `aria-label="board fill"`
— which is already a board-level name. Counting only your own writes is a §12 plumbing row, not a
copy row, and it should not be smuggled into a colour family.

**`noteWriteMs` — drop the mint, reuse the keyframe.** `MarginNote.vue:149,:180` and
`CompletionVignette.vue:133` each open-code `animation: ink-write-in 250ms var(--ease-noteWrite)
backwards`. `@keyframes ink-write-in` is **global** (`index.css:1115`) and `--ease-noteWrite` is a
global token (`index.css:349`). The tape can therefore wear the existing idiom verbatim and mint
**nothing**: no fourth literal, no three `v-bind` conversions, no new name. `MOTION`'s covenant
("no new timing constants outside pencilConfig", stated at `pencilConfig.ts` `cardStepMs` /
`chromeLeaveMs`) is then satisfied by reuse rather than by a ledger with one consumer. Only
`tapeRestMs` is genuinely new, and it lands in `MOTION`.

---

## 9. THE FILTER CENSUS, on the artifact that deploys

Run with the estate's own counting rule (`e2e/filter-census.spec.ts`: own computed `filter` ≠
`none` AND own computed `display` ≠ `none`; scanline union of the counted population's boxes)
against the built dist, both engines, both themes:

| regime | count | union | the budget | verdict |
|---|---|---|---|---|
| 1280×800 chromium | **9** | **45,500** | `FILTER_BUDGET_TOTAL` 9, `UNION_AREA.row` **45,572**, tol 0.02 → [44,661, 46,483] | **GREEN** |
| 1280×800 webkit | **9** | **45,524** | same | **GREEN** |
| 393×699 chromium | **9** | **6,601** | `UNION_AREA.coarse` **6,673** → [6,539, 6,807] | **GREEN** |
| 393×699 webkit | **9** | 6,601–6,625 | same | **GREEN** |

The population, named (identical both engines): `#wobble-heart` ×2 (the hover card), 
`#wobble-celestial` ×2 (the toggle, 43,264 px² each — 95 % of the union), `#grain-static` ×4 (the
divider poses), and **one** `drop-shadow(rgba(196,181,253,0.3) 0 0 2px)` at **900 px²** — the
sparkle, on the shipped bundle, wearing the literal this family tokenises.

**So the row closes green and the family's change is free**: replacing that literal with
`--sparkle-glow-soft` changes neither the count (9) nor the area (900). Pass 1's "8 elements,
90,778 px²" was a dev-server reading of a different population and is superseded.

Caveat stated rather than hidden: the coarse arm was taken at a 393×699 viewport on the desktop
device descriptor (dsf 1, fine pointer), not the mobile descriptor the estate's own config uses —
count and union both land inside the budget anyway, and a prototype lane should still run
`npm run test:e2e:throttle -- --project=<engine> filter-census` for the ratified reading. That
command **builds into `dist-throttle/` and previews on :4188** — it does not touch `dist/`, so it
is safe beside W8, but two lanes must not run it at once.

---

## 10. THE LAWS CROSSED, as proposed R6 amendments

Verbatim from `r0/r6-idiom-history/R6-census.md` (frozen; these are diffs to propose, never edits):

- **:99 law 19** — *"Wax for strokes/washes/fills; hue-locked darkened INK for verdict TEXT."* The
  family puts an INK tier on a **stroke** (the ring at light) and lets the same job take **wax** at
  dark. AMEND: *"…; the exception is a stroke that must clear 1.4.11 on both papers, which takes the
  ink tier on the light paper and the wax on the dark — one hue, three pressures, separation by
  form."* Named as a departure, with the reason measured (3.63 → 3.89).
- **:100 law 20** — *"The solver rainbow is BOARD CONTENT ONLY — never chrome, never a metadata
  tone."* `--color-solver-ink-2` and `--sparkle-glow-*` resolve through one named rung. No pixel
  moves (`#c4b5fd` is what HEAD paints), but the seam was policed by name. AMEND: *"…the rainbow's
  STOPS are board content; the ANCHOR HUE they are drawn from may be named and shared, and chrome
  that carries it names the rung, never the stop."*
- **:125 law 39** — *"…and the board's drawn `--color-focus-sketch` ring at stroke-width 7 /
  opacity 0.9 drawn on over 180 ms."* Under chair §6.1 this family no longer proposes the deletion;
  the amendment is **§6's to make** when it disposes the token, and law 39 must be re-worded in the
  same commit as whatever name replaces it. Stated here so the row is not lost between sections.

**`HandwrittenGlyph.vue:85`** — `var(--color-user-ink, #2563eb)`. `--color-user-ink` is
unconditionally declared in both themes (`index.css:151`, `:372`), so the fallback is dead. Pass 1
renamed it (`var(--color-user-ink, var(--color-blue-ink))`) and called it a death. **Drop it
entirely**: `return "var(--color-user-ink)"`. The DIES list then says what happened.

**The `.washi-tag` / `.washi-head` refactor's π.** Four compartment tags ride
`GameControlPanel.vue` (`.tray-well :deep(.washi-tag)` `:1523`, with `--washi-tag-lift 3px`,
`--washi-tag-gap 0.1rem`, `--washi-tag-inset 0.35rem`, `--washi-tag-top` `:1484-1500`). Rather than
spend a crop, prove it with numbers: a computed-style census over the four nodes — box, the four
custom properties, `font`, `transform`, `clip-path` — before and after, asserted equal to the
hundredth in both engines. Zero bytes, stronger than a crop, and it survives an evidence cap. If
the synthesizer will not run it, the claim ships as **declaration-level** and says so.

---

## 11. THE HAND-OFFS (plan steps 9 and 10)

**Step 9 — the six-anchor ruling, as a MOVED diff.** `r0/r2-accent-family/probe/accent-kinship.probe.ts`
is FROZEN. The proposal belongs at
`pass2/<stage>/ACC-SIX/instruments/accent-kinship.six-anchor.diff` and the r0 row is reported
**MOVED**. Its substance: `KIN_DEG` stays **5** (`:67` — re-derived from the house's own 4.5° hue
lock, not a taste number); `ANCHORS` (`:69`) grows by one, `the sixth` at **293.0°**; the exception
list **shrinks** — solver stop 2 leaves it, because at 0.0° from the sixth it is kin by name.
Exceptions after: the peer walk, and rainbow stops 1/3/4/5.

**Step 10a — the reserved arcs, to PAL-TIN.** Six anchors at ±5°: rose 14.2 · orange 68.7 · gold
83.7 · green 147.0 · blue 251.4 · **the sixth 293.0**. Against the shipped walk `hue = i × 137.5°`
over the first 40 indices: **5 collisions at ±5°** (4 with five anchors), and the sixth's own cost
is **1** — peer **i = 10 at 295.0°, 2.0° from the answer's violet**: the tenth player is dealt the
colour the board uses for the answer. Two further facts PAL-TIN needs: peer i = 28 at 250.0° is
**1.4° from crayon-blue**, which after this family's cure is *your* hand; and the walk's declared
chroma 0.110 is **gamut-clipped at 9 of the first 40 indices** (worst i = 25, painted 0.0868 — 21 %
flatter than the formula claims), all in the 80–230° arc.

**Step 10b — the mark's live colour, to PLR-SELF.** The player mark's "nice blue" when a session is
live is **`--color-blue-ink`**, your own ink — not a fourth blue. The constraint that makes it a
ruling rather than a preference: the mark sits in chrome, so it must clear AA as a *mark* on the
page ground, and `#2f76bd` reads 4.53 on `--color-background` at light and collapses to
`crayon-blue` (7.86) at dark.

---

## 12. WHAT THE SYNTHESIZER MUST WRITE — the concrete surfaces

| file:line | change | why, with the number |
|---|---|---|
| `index.css:151,:172-173,:184,:205,:219-222,:278,:396,:407` | the three `answer-*` rungs, `blue-ink`, `user-ink` as its alias; **ONE ratio ledger** (§5) as the comment block | zero new violet bytes; two Tailwind hexes leave; every quoted ratio re-derived here |
| `index.css:94-96` | untouched | the tape is free in the cut; `%` `/` `j` `x` are not in it |
| `index.css:894-952` | `.progress-trace` gains its `@media print` (`stroke: #000`) and `forced-colors: active` (`stroke: CanvasText`) arms | HEAD paints `rgb(139,92,246)` under both, both engines — a live defect, not a refinement |
| `index.css` (`--sparkle-glow-soft/-strong`) + `GameControlPanel.vue:2081,:2087` | the two `rgba(196,181,253,…)` literals become the tokens; `transition: all` narrows to `filter` | census unmoved: count 9, that row 900 px², measured on the dist |
| `gameCell.css:246,:248` | **NOT this family's** (chair §6.1). State the trap: never `--color-user-ink`; a bare deletion falls back to `crayon-blue` | the selector sits inside the cell `playerIdentity.ts:69` rebinds |
| `HandDrawnGrid.vue:476-478, :509-511` | drop `pathLength` from the dash; per-pose real-unit dasharray + offset from a new pure `poseLengths()` in `gridPaths.ts` | webkit paints 21.1 % in 4 arcs where the truth is 5.5 % in 1 |
| `HandDrawnGrid.vue:300-307` | `aria-valuetext` → the tape's literal; `aria-valuemax` → the writable count; `aria-valuenow` → the count | law 33: one name per act, drawn ≡ spoken |
| `HandDrawnGrid.vue` (new) | the tape: `SheetWashiLabel` in a `head` anchor, **top-RIGHT, flush**, `z-index: 3`, `pointer-events: none`, `aria-hidden` | occlusion 0 for the tape's whole life; masthead ink 0 at every viewport |
| `SheetWashiLabel.vue:56` | drop `+ props.text.charCodeAt(0)` | the tear and tilt re-roll on every count today, against the prop's own docstring at `:16` |
| `GameGallery.vue:1459` + `:1431-1436` | red on the word, ground deleted; `.guard-btn.guard-leave:hover .guard-face` carries the red | 4.49 on 5 % is under AA; 4.99 bare; 4.69 on the hover ground |
| `GameGallery.vue:1455-1458` | delete the "plus the 8 % ground" clause | it contradicts the block that deletes the ground |
| `HandwrittenGlyph.vue:85` | `var(--color-user-ink)` — the fallback goes, not moves | dead in both themes |
| `pencilConfig.ts MOTION` | **`tapeRestMs: 2400` only** | `ink-write-in` + `--ease-noteWrite` are already global; mint nothing else |
| `scripts/check-font-coverage.mjs` | the template-capturing `countTape` (§7) **and** the `:text="tapeText"` pin in the bound census | the constant must stop being hand-typed |
| unit | `fillCount` / `boardKey` / the one-ground lay-down (§8) | undo-to-empty and the resumed board |

---

## 13. SKETCHES

### (i) the tape moves to the corner the trace reaches last

```
  TODAY'S PROPOSAL (top-left)                THE MEASURED ANSWER (top-right, flush)
   ┌ 3 of 20 ┐                                                      ┌ 3 of 20 ┐
  ═╪═════════╪══════════════════            ═══════════════════════╪═════════╪═
  ║  ▓▓▓▓▓▓▓▓▓ ← 74% of fill 1               ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓        ║         ║
  ║   hidden under the tape                  ║  the front is visible ║        ║
  ║                     ║                    ║  all the way to 24.7% ║        ║
                                             the tape lifts at 15%

  desk  tape 93.3 px   trace at fill 1 = 125.7 px   →  93.15 px occluded  (74.1%)
  phone tape 82.7 px   trace at fill 1 =  72.1 px   →  72.1  px occluded  (100%)
  top edge = 620.7 px of a 2513.5 px perimeter → the front reaches the right corner at 24.7%
```

### (ii) the masthead has 4.06 px of air, and the tape wants 11.5

```
        masthead INK bottom  ────────────────────  y = 120.07   (desk, chromium)
                                     ↕ 4.39 px of paper
        masthead BOX bottom ═ BOARD TOP ═════════  y = 124.45   (M18: Δ = 0.000 px)
   straddle, top = −h/2  ┌───────────────┐         y = 112.95   → 664 px² on the wordmark
   flush,    top =  0    ┌───────────────┐         y = 124.45   → 0 px², both engines, both vps
```

### (iii) one write of twenty, two engines

```
  CHROMIUM                              WEBKIT
   ▓▓▓▓░░░░░░░░░░░░░░░░                  ▓▓▓▓░░░░░░░░░░░░░░░░
  ░                    ░                ▓                    ▓
  ░     5.5% painted   ░                ▓   21.1% painted    ▓   pathLength 1000
  ░     ONE run        ░                ▓   FOUR runs        ▓   totalLength 3965.63
  ░                    ░                ▓                    ▓   ratio 3.966  ← "four"
   ░░░░░░░░░░░░░░░░░░░░                  ░░░░░░░░░▓▓▓▓░░░░░░░
```

---

## 14. RISKS, NAMED

1. **The dash cure moves pixels in both engines.** Per-pose real lengths change the front's
   position by 0.064 % (1.6 px on a 2,513 px perimeter). It is a declared π on a claimed surface,
   and the alternative is shipping a gauge that lies in Safari. If the wave will not take the
   pixel, the fallback is `pathLength` equal to each pose's own rounded length — same result, more
   attribute churn.
2. **The tape's new corner is on the controls side at the desk rail.** The controls card sits right
   at 1280; the tape at the board's top-right is nearer the card's own word `Fill`. The copy
   ruling (`written` / `on the board`, never `filled`) is what keeps them apart, and it is now
   load-bearing rather than decorative.
3. **`3 of 20 on the board` is four characters longer** — 93.3 px becomes ~118 px at the desk,
   ~105 px on the phone (28.7 % of a 365 px board). It still clears the trace at the right corner
   (620.7 px of top edge), but the phone number should be re-measured, not assumed.
4. **The seed fix changes every washi label's geometry once.** Dropping the text term re-rolls the
   tear and tilt of the four compartment tags on the controls card — a one-time π on an unclaimed
   surface. Either pin the seed arithmetic so existing labels keep their current roll, or declare
   it. **This is the row most likely to be missed.**
5. **The `boardKey` digest over `givenCells` is O(n log n) on a watch.** 256 cells at 16×16 is
   nothing, but it must not sit in the boil path; it is a `computed` on props, re-evaluated on a
   deal, never on the beat.
6. **The coarse filter-census arm here is not the estate's regime** (§9). Green on both, but the
   ratified reading comes from `test:e2e:throttle`.
7. **Two engines agreed on every number in this record except the dash** — which is the point. Any
   gate this family writes must run in both, or it will not see the only real defect in the
   section.

---

## 15. INSTRUMENTS BANKED

| path | what it does | output |
|---|---|---|
| `instruments/frame-geometry.entry.ts` | the shipped generator's bbox per pose, both pad arms, without editing a source | `readings/frame-geometry.txt` |
| `instruments/ratios.mjs` | the ONE ratio ledger: WCAG 1.4.3/1.4.11 + OKLCH, pure arithmetic | `readings/ratios.txt` |
| `probe/acc-six-head.probe.ts` | the estate's filter-census counting rule + board/masthead geometry + resolved tokens, built dist, 2 engines × 2 themes × 2 viewports | `readings/head-*.json` |
| `probe/acc-six-ink.probe.ts` | masthead ink per-rect, and four tape poses priced against box and ink | `readings/ink-*.json` |
| `probe/acc-six-dash.probe.ts` + `instruments/dash-*-census.mjs` | the dash sweep on the estate's own pose 0, and the painted census on the live board | `readings/dash-*.json`, `readings/live-dash-*.json` |
| `probe/pose0.d.txt` | the shipped pose-0 `d` (6,952 B), so the sweep runs without the app | — |
| `probe/vite.scratch.config.ts` | preview-only, private `cacheDir`, port 4237 | — |

Re-run: `ln -s web/frontend/node_modules <this dir>/node_modules`, start the preview
(`npx vite preview --config probe/vite.scratch.config.ts` from `web/frontend`), then
`npx playwright test --config probe/acc-six-head.config.ts`. **Kill 4237 afterwards.** The
scratch vite config deliberately does **not** spread `vite.config.ts`: loading it from outside
`web/frontend` resolves `@tailwindcss/vite` through a foreign root and throws before the server
binds, and a static preview optimises no deps, so the private `cacheDir` still satisfies the law's
purpose.
