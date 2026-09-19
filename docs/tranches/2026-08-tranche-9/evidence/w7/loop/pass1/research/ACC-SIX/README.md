# ACC-SIX — THE SIXTH CRAYON · pass-1 research record

T9-W7 convergent design loop, pass 1 (RESEARCH), family ACC-SIX alone.
Owns W7 §3 (the accent family) · §4 (the fill meter) · §12 (multiplayer chrome) · §15 (the
confirm's danger ink) · mark M07.

Measured on this tree at `7b0610cc` + the uncommitted W7-loop files, 2026-09-17, on
`http://127.0.0.1:4235` (lane-started `npx vite --host 127.0.0.1 --port 4235 --strictPort`),
chromium and webkit, 1280×800 and 393×699. **Read-only on the product**: nothing under
`web/frontend/src`, `e2e/` or `scripts/` was opened for writing, and the prototype is an
`addStyleTag` overlay (`proto/overlay.ts`), never a patch. No worktree was needed.

---

## 0. THE ANSWER, FIRST

**The fork resolves on a number, not a taste.** Arm (a) — the sixth as WAX, a crayon with an
ink tier under the crayon dark law — **DIES**, and it dies in dark mode at the one place the
colour exists to be seen: the fill trace over the frame line it retraces reads **1.93:1 on
painted bytes** (1.84 by arithmetic) against WCAG 1.4.11's 3:1 non-text floor, where HEAD
reads 3.48. Arm (b) — the sixth as the ANSWER's material — **LIVES**, moves not one violet
pixel, and greens rows 1, 2 and 4 in both engines.

The reason arm (a) cannot be tuned out of its grave is the geometry, not the hex. The trace
crosses **two grounds in each theme, and the two swap sides between themes**:

|  | the frame line it retraces | the card it overhangs |
|---|---|---|
| light | `--grid-line-color` `#262626` — **dark** | `--color-card` `#fdfdfc` — **near-white** |
| dark | `--grid-line-color` `#d1cfc7` — **light** | `--color-card` `#131211` — **near-black** |

So the trace's lightness is squeezed from both sides in each theme, and the two windows do
not meet (`probe/sixth-window.mjs`, `census/sixth-window.json`):

    light window   L 0.558 … 0.666   (at hue 293, any chroma in sRGB)
    dark  window   L 0.510 … 0.576
    ONE-HEX window (all four grounds at once): **0 members** — swept 0.45 ≤ L ≤ 0.80,
                                               0.06 ≤ C ≤ 0.30, step 0.002 / 0.005

**The crayon dark law says the dark arm must be LIGHTER (+0.06…+0.10 L).** The dark window's
ceiling is L 0.576 and the wax's light arm already sits at L 0.606. A lawful wax dark arm
lands at L 0.666–0.706 — 0.09 above the ceiling — and the frame-line ratio collapses. That
is why `--color-progress-ink`'s own comment (`index.css:267-277`) says it "INVERTS the crayon
glow-brighter-at-night doctrine on purpose": the inversion is not a lapse, it is the only
lightness pair the two grounds allow.

**Recommendation: DEVELOP arm (b), with one restatement.** The sixth is not a third
exception. It is a **sixth ANCHOR** — ink-only, no wax tier, no dark law — and naming it
*shrinks* the exception list rather than growing it, because solver stop 2 leaves the
excepted set and becomes kin by name. The law afterwards, stated in one line:

> An accent is kin when its OKLCH hue sits within 5° of one of **six** house anchors — five
> crayons (wax, with the crayon dark law) and one answer-hue (ink only, three rungs, no dark
> law). The declared exceptions remain two: the peer walk, and the **four** rainbow stops that
> are not the sixth.

---

## 1. SUBSTRATE VERIFIED ON THIS TREE

Every cite opened and read; the charter's substrate list reproduces with two corrections.

| claim | this tree | note |
|---|---|---|
| `--color-solver-ink-2` light = `--color-progress-ink` dark = `#7c3aed` | `index.css:205` / `:407` — byte-identical | ✔ the sixth's hex is already in the tree, twice, under two names |
| `--color-progress-ink` light `#8b5cf6` | `index.css:278` | ✔ |
| `--color-user-ink` `#2563eb` / `#60a5fa` | `index.css:151` / `:372` | ✔ Tailwind blue-600 / blue-400 |
| `--color-focus-sketch` `#3a7bc4`, dark comment false | `index.css:219-222`; `.dark` never redefines it | ✔ measured 3.63 light / 3.69 dark at α0.9 on `--color-card`, painted 3.67 / 3.72 |
| the crayon dark law "hue ±3°, L +0.06…+0.10" | **the five shipped crayons do not obey it** | ✖ see §2 |
| sparkle literals | `GameControlPanel.vue:2081, :2087` — `rgba(196,181,253,…)` | ✔ |
| the meter's one consumer | `HandDrawnGrid.vue:471` (`stroke="var(--color-progress-ink)"`) | ✔ 1 VAR, re-derived |
| focus-sketch's two consumers | `gameCell.css:246, :248` | ✔ 2 VAR, re-derived |
| `FRAME_X_PAD 12 / FRAME_Y_PAD 0` | `gridPaths.ts:338-339`, **read by BOTH** `generateFrameTraceFrames` (`:360-363`) and `generateGridBoilFrames`' frame (`:451-452`) | ✔ and that shared read is §4's whole problem — see §5 |
| the guard's colourless face | `GameGallery.vue` (`src/pencil/chrome/GameGallery/`) `.guard-leave .guard-face` = `color-mix(foreground 8%)`, text `--color-foreground` | ✔ measured 18.99:1, achromatic |
| "digits in Patrick Hand are unverified in the subset" | **refuted** — `index.css:94-96` declares `U+0030-0039` and the coverage gate asserts range ≡ cmap both ways | ✖ see §6 |

Consumer map re-derived on this tree (`probe/consumers.mjs` → `census/consumers.json`): it
reproduces R2's exactly — `--color-user-ink` 24 VAR across 13 files, `--color-focus-sketch`
**2**, `--color-progress-ink` **1**, `--color-solver-ink-1…5` 1 each.

---

## 2. THE CRAYON DARK LAW IS NOT WHAT `index.css` SAYS IT IS

Re-derived from the five shipped crayons (`probe/sixth-math.mjs` → `census/sixth-math.json`
`crayonLaw`):

| crayon | light | dark | ΔL | Δhue | ΔC |
|---|---|---|---|---|---|
| green | `#2dc653` | `#3dd968` | **+0.055** | 1.27° | +0.001 |
| orange | `#f4a236` | `#f5b35c` | **+0.036** | 3.06° | −0.022 |
| rose | `#e8315b` | `#ff5c7c` | +0.084 | 2.01° | −0.018 |
| blue | `#4a90d9` | `#6aabeb` | +0.083 | 2.09° | −0.016 |
| gold | `#c99a2e` | `#e5c74d` | **+0.121** | **11.56°** | +0.011 |

The stated band is ΔL +0.06…+0.10 and Δhue ≤3°. **Three of five crayons fall outside the
lightness band and one falls 8.6° outside the hue lock.** The law as shipped is ΔL
+0.036…+0.121, Δhue ≤11.6°, chroma may fall as well as rise. This matters twice: a pass that
derives a sixth wax "to the letter of the law" derives it to a letter nothing else obeys, and
a gate written on the stated band would be born red on `crayon-gold`.

Arm (a)'s wax pair was nonetheless built to the **stated** law exactly — `#886adb` → `#a083f6`,
ΔL +0.080, Δhue 0.13°, ΔC −0.001 — so that its death could not be blamed on a sloppy
derivation. It still reads **1.84:1** over the dark frame line.

Two further arm-(a) facts, both from `census/sixth-math.json` `candidates`:

- Every wax dark arm at the violet's **native** chroma (0.219) is **out of sRGB**: `#9d6dff`,
  `#a374ff`, `#a97aff` all clip, so they are not the hue or the chroma they claim. Only the
  wax-MEAN chroma 0.166 survives the gamut, which is why arm (a) shipped at 0.166.
- Naming the wheel's hole closes it: after a sixth anchor at 293.0° the largest gap falls from
  **122.8°** (blue→rose) to **104.4°** (green→blue), and the new arcs are 81.2° (sixth→rose)
  and 41.6° (blue→sixth).

---

## 3. THE INSTRUMENTS, BEFORE AND AFTER

`probe/acc-six.kinship.probe.ts` is R2's instrument **re-run, not re-written**: KIN_DEG stays
**5°**, the five crayon anchors stay, the exception list is not grown. The ruling this lane
records — in the probe's own file, at its head — is the SIXTH ANCHOR at OKLCH 293.0° and the
removal of solver stop 2 from the excepted set. Rows 3 (the control focus ring) belongs to
§6's focus idiom, not to this family; it is not in this probe and stays red under every arm.

The pixel census is R2's **method** re-run — same chroma floor 0.012, same warm band 40–115°,
same screenshot→OKLCH→10° bins — re-implemented inside this lane's probe rather than R2's file
invoked, because the reading has to be taken under an `addStyleTag` overlay and beside a second
classification R2's file does not carry (§3). Its HEAD numbers reproduce R2's to the byte at
rest (light 6.79% off-family, dark 12.96%), which is the control that says the re-implementation
is the same instrument. `probe/consumers.mjs` and `probe/oklch.ts` ARE R2's files, re-run and
imported unchanged but for the output path.

Two rows were re-cut for vacuity, and both re-cuts made the instrument harder to pass:

- **row 4 (off-token literals)** asserted "no `rgb(` inside the computed filter". A tokenised
  glow still serialises as a colour, so that assertion cannot see a cure. It now resolves the
  painted glow AND `--color-sparkle-glow` through the engine's own canvas and asserts the
  **same device bytes**. A first attempt to read the CSSOM instead found **0 matching rules in
  PW-WebKit** — a vacuous pass, refused.
- **the census's `mid` state** was 12 keystrokes, which reaches a different cell count on every
  deal (HEAD dark reached progress 10 where arm b reached 20, and the census moved with the
  fill, not with the arm). It is now **full board** — every writable cell written, progress
  100 by construction.

### Rows, both engines

| row | HEAD | arm (a) | arm (b) |
|---|---|---|---|
| 1 kin (light) | **RED** — `user-ink` 11.5° off, `progress-ink` 41.3° off | GREEN | GREEN |
| 2 kin (dark) | **RED** — `user-ink` 5.3°, `progress-ink` 43.7° | GREEN | GREEN |
| 4 off-token literals | **RED** — `rgba(196,181,253,0.3)`, no token | GREEN webkit; chromium flaky (§7) | GREEN |
| 5 exceptions pay their toll | GREEN | GREEN | GREEN |
| **green of 8 (4 rows × 2 engines)** | **2** | **7** | **8** |

Arm (b)'s rows, resolved live (`census/kinship-b-chromium-{light,dark}.json`):

    light   user-ink      rgb(47,118,189)  h 251.4  →  crayon-blue   0.0°   kin
            focus-sketch  rgb(47,118,189)  h 251.4  →  crayon-blue   0.0°   kin
            progress-ink  rgb(139,92,246)  h 292.7  →  the sixth     0.3°   kin
            solver-ink-2  rgb(124,58,237)  h 293.0  →  the sixth     0.0°   kin
    dark    user-ink      rgb(106,171,235) h 249.3  →  crayon-blue   0.0°   kin
            focus-sketch  rgb(106,171,235) h 249.3  →  crayon-blue   0.0°   kin
            progress-ink  rgb(124,58,237)  h 293.0  →  the sixth     0.0°   kin
            solver-ink-2  rgb(196,181,253) h 293.6  →  the sixth     0.6°   kin

The exception toll is unmoved and still green: rainbow **5.40 / 5.60 / 6.21 / 5.39 / 5.29** on
`--color-card`, peer walk worst **5.36** over 40 indices.

### The four ratios, re-derived on painted bytes

Screenshot → `sharp` raw → the most chromatic pixel in the violet arc is the trace core, the
extreme achromatic pixel within 22px of the board box is the un-traced frame line, and an
achromatic pixel well inside the board is the card. Hex arithmetic is printed beside it as a
witness, never as the claim (`census/surfaces-*-{light,dark}.json`).

| ratio (WCAG 1.4.11 floor 3:1) | HEAD painted / arith | arm (a) | arm (b) |
|---|---|---|---|
| trace over frame line, light | 3.28 / 3.36 | 3.42 / 3.47 | **3.28 / 3.36** |
| trace over card, light | 3.90 / 3.85 | 3.73 / 3.71 | **3.90 / 3.85** |
| trace over frame line, dark | 3.48 / 3.46 | **1.93 / 1.84 ✗** | **3.48 / 3.46** |
| trace over card, dark | 3.11 / 3.07 | 5.63 / 5.79 | **3.11 / 3.07** |
| focus ring over card, light | 3.67 / 3.63 | **4.01 / 3.89** | **4.01 / 3.89** |
| focus ring over card, dark | 3.72 / 3.69 | **6.47 / 6.42** | **6.47 / 6.42** |
| your digit as text, light card / background | 5.08 / 4.96 | 4.64 / 4.53 | 4.64 / 4.53 |
| your digit as text, dark card / background | 7.36 / 7.52 | **7.70 / 7.86** | **7.70 / 7.86** |

**The dark trace over the card stands at 3.07 under arm (b) — it does not fall, because not one
violet byte moves.** Arm (a) raises it to 5.79 and pays for that with the frame line.

### The pixel census, re-run — and the band that cannot see the cure

R2's band (warm 40–115°, chroma floor 0.012) is kept verbatim, and a second reading is added
beside it, because **R2's warm arc excludes two of its own five anchors**: `crayon-green`
147.0° and `crayon-blue` 251.4° are both outside 40–115°. A blue that becomes perfectly kin to
`crayon-blue` therefore stays "off-family" by that band. The added reading is **off-ANCHOR
share** — the share of chromatic pixels more than 15° from every anchor in the arm's own set.

| engine · theme · state | off-WARM HEAD → (a) → (b) | **off-ANCHOR HEAD → (a) → (b)** |
|---|---|---|
| chromium light rest | 6.79 → 7.08 → **6.79%** | 54.99 → 54.65 → **54.85%** |
| chromium light full board | 54.77 → 54.76 → **54.79%** | **64.29 → 26.97 → 26.83%** |
| chromium dark rest | 12.96 → 13.85 → **12.96%** | 1.16 → 0.66 → **0.74%** |
| chromium dark full board | 69.60 → 69.44 → **69.42%** | **49.15 → 0.64 → 1.08%** |
| webkit light full board | 54.01 → 53.78 → **53.73%** | **64.56 → 27.09 → 27.00%** |
| webkit dark full board | 69.48 → 69.44 → **69.43%** | **49.26 → 0.60 → 1.10%** |

**The off-family share on touch does not fall, and the charter's requirement that it must is
the wrong instrument for this family.** It cannot fall: the trace is still violet and your
digit is still blue, and neither is warm. What falls — by 37 points in light and 48 in dark,
in both engines — is the share of painted colour that belongs to no named anchor. That is the
cure, and it is legible only once the band is the law's band.

**Where the sixth sits in the bins.** The 290–300° bin carries **36.8%** of all chromatic
pixels at full board in light and **47.3%** in dark (chromium; webkit 37.3 / 47.3). Under arm
(b) not one of those pixels changes value; they change **name**. Under arm (a) the resting
violet grows (light rest 0.10% → 0.39%, dark rest 0.32% → 1.12%) because the lighter wax lifts
the sparkle glow over the chroma floor.

---

## 4. BLUE — ONE JOB, AND WHICH TOKEN DIES

The charter's arm-(b) sub-idea "pens at ~0.20 chroma vs the wax's 0.166" **dies in sRGB**, and
the number is flat (`census/sixth-window.json` `gamutCeiling`, maximum in-gamut chroma at hue,
by lightness):

| hue | L 0.500 | L 0.545 | L 0.606 | L 0.641 |
|---|---|---|---|---|
| crayon-gold 83.7° | 0.102 | 0.112 | 0.124 | 0.131 |
| crayon-orange 68.7° | 0.109 | 0.119 | 0.132 | 0.140 |
| **crayon-blue 251.4°** | **0.147** | **0.160** | **0.178** | **0.188** |
| user-ink 262.9° | 0.250 | 0.252 | 0.214 | 0.192 |
| the sixth 293.0° | 0.278 | 0.281 | 0.237 | 0.213 |

A pen at chroma 0.20 **hue-locked to crayon-blue does not exist** at any AA lightness; the
ceiling is 0.188. Tailwind blue-600 reaches 0.215 only by sitting 11.5° off the crayon, at
262.9°, where the gamut is wider. **The estate's stock blue is more saturated than its own
crayon-blue can physically be**, and that — not taste — is the whole of the 9.6° gap.

So blue becoming one job is a **desaturation**, priced: your digit goes C 0.215 → 0.131 in
light and 0.143 → 0.115 in dark. Against that, everything else improves.

`--color-blue-ink` is derived, not chosen: `crayon-blue` hue-locked at 251.4°, darkened until
it clears AA as TEXT on **both** light papers. The shallowest darkening that clears is
**L 0.555 at C 0.131 → `#2f76bd`**, 4.64:1 on `--color-card`, 4.53:1 on `--color-background`.
Dark **collapses into the wax** — `var(--color-crayon-blue)` — which is the estate's own
dark-mode ink rule (`index.css:386-394`) and is, for the first time, exactly what
`--color-focus-sketch`'s comment has always claimed ("Dark mode keeps crayon-blue"): measured
**6.42:1** at α0.9, **7.70:1** opaque.

**Which token dies: `--color-focus-sketch`.** It has **2** consumers (`gameCell.css:246,:248`)
— the cheapest accent re-cut in the estate — and its `.dark` arm has never existed, so nothing
is lost by folding it. `--color-user-ink` **must survive as the alias**, because it is the
peer-rebinding seam: `playerIdentity.ts:69` writes `--color-user-ink` onto each `.game-cell`
and `HandwrittenGlyph.vue:85` strokes with it, so its 24 sites and the whole multiplayer
authorship mechanism ride that name.

**The trap, stated so the synthesizer does not fall into it.** The focus ring must point at
`--color-blue-ink`, **never** at `--color-user-ink`. `gameCell.css:246` selects
`.game-cell:has(input:focus-visible) .cell-ghost-path` — inside the cell that carries the peer
rebinding — so a ring drawn in `user-ink` would take a *peer's* colour on a peer's square.

Token arithmetic after the move: **two hexes die** (`#2563eb`, `#3a7bc4`; plus `#60a5fa` in
the dark block), **one is born** (`#2f76bd`), one name dies (`focus-sketch`), one is born
(`blue-ink`). Net −1 name, net −2 hexes, and Tailwind blue-600/blue-400 leave the estate —
which is the direct answer to M07's one-sentence census finding.

Residue: `HandwrittenGlyph.vue:85`'s hardcoded fallback `var(--color-user-ink, #2563eb)`
becomes a stale stock blue. It must move or go.

---

## 5. THE METER — PLACEMENT AND FORM, AND WHY THE OVERHANG IS NOT A ONE-LINE FIX

Measured at 1280×800, **identical to the byte in chromium and webkit**
(`census/meter-HEAD-*.json`):

    board svg box   636 × 636 at (131.89, 124.45)       scale 0.636
    trace stroke    8 viewBox units = 5.088 CSS px      stroke-opacity 0.95, round cap
    overhang        top  +3.22 px OUTSIDE the box
                    bottom +1.72 px OUTSIDE
                    left  −2.78 px (inside)
                    right −2.68 px (inside)
    at 0%           traceNodes 0 — the meter does not exist
                    aria-label "board fill", aria-valuetext "board 0% filled"
    phone 393×699   board 365 px, scale 0.365, stroke 2.92 CSS px

So the stripe is **6.00 px more outboard on the top than on the left**, on a 636 px board.
It does not straddle and it does not hug; it overhangs two sides and hides inside the other two.

**The single-constant cure and its price.** `FRAME_Y_PAD` is read by `generateFrameTraceFrames`
(`gridPaths.ts:361`) **and** by `generateGridBoilFrames`' own frame (`gridPaths.ts:452`), and
the file says why at `:333-337`: one source, so "the violet trace provably hugs the frame
(A-1c)". Therefore:

| option | what changes | cost |
|---|---|---|
| `FRAME_Y_PAD 0 → 12` (symmetric, ~2.7 px inside on all four sides) | the **graphite frame** gains 12 units of top/bottom inset: rect 976×1000 → 976×976, perimeter 3,952 → 3,904 units (−1.21%), 7.63 CSS px at 1280 / 4.38 px on the phone | a π DELTA on every board golden, declared |
| `FRAME_X_PAD 12 → 0` (deliberately astride on all four sides) | frame rect → the full viewBox, perimeter 3,952 → 4,000 (+1.21%), sides move 7.63 px outward | same DELTA, and the ink then sits outside the card on four sides |
| give the trace its own pads | nothing visible moves on the graphite | **breaks A-1c** — two magic numbers that can drift out of registration, which is the exact defect the shared constant was introduced to prevent |

There is no free option. The honest recommendation is the first, with the DELTA declared and
both crops banked.

**What shows at 0%: nothing, and it should stay nothing.** A low-opacity "track" ring is a
second continuous stroke on the frame, and the inward offset it would want is already occupied
— `.join-pose` retraces the same rect at `scale(0.984)` (`HandDrawnGrid.vue:604-611`), and its
own comment records that two strokes at one hue "fuse into one fringed band and the fill gauge
is simply gone". If the zero state must be legible, the **label** carries it, not more ink.

**The ~126 px first stroke is not a geometry problem.** 3,952 units × 0.636 = 2,513 CSS px of
path; one keystroke on a 20-cell deal is 5% = 125.7 px, and under the symmetric rect it is
124.1 px. Geometry cannot move it; the existing `240ms ease` dash tween is the whole of the
answer, and it is already there (`HandDrawnGrid.vue:585-590`).

### The label, priced — and the charter's own risk refuted

`probe/tape-cost.mjs` reads the Patrick Hand `unicode-range` out of `index.css:94-96` (46
codepoints; `scripts/check-font-coverage.mjs` asserts range ≡ cmap in **both** directions and
passes at HEAD, so the declared range *is* the cut):

    FREE    "3 of 20 filled"        FREE    "12 of 81 filled"     FREE  "0 of 20 filled"
    FREE    "3 of 20 written"       FREE    "half filled"         FREE  "filled"
    RE-CUT  "board 40% filled"      missing "%"  U+0025
    RE-CUT  "3/20 filled"           missing "/"  U+002F

**A count tape costs zero woff2 bytes** — `U+0030-0039` is already in the cut. What is NOT in
the cut is `%` and `/`, so the visible string must say "of", never a percent or a slash. (The
sr-only `aria-valuetext` "board N% filled" is unrendered and pays nothing.)

Rendered and measured (`census/meter-*.json` `tape`): Patrick Hand 14.05 px, **75.06 × 22.66 px**
at the desk, 12.19 px / **66.8 × 19.9 px** on the phone — **18.3% of the phone board's width**,
which fits at the frame's head without crowding it.

**The collision is real and measured.** The control panel's own words on the same screen are
`"Fill"` (the FILL-FORCED button's sublabel) and `"fill the cells that have only one digit left"`
(its washi tooltip). A tape reading "…filled" sits a few hundred px from a button named "Fill"
that does something else. Two ways out, and they are a decision, not a preference: put the
tape at the board's **top-left frame head** (farthest from the controls card, which is on the
right at the desk rail), or write the tape in a word the button does not own — "3 of 20
written" is free in the cut too. Law 33 (one name per act: drawn word ≡ `aria-label` ≡ spoken
utterance) then binds `aria-valuetext` to whichever literal wins, which is a W3 gate row
(`scripts/check-live-regions.mjs`), not a free choice.

---

## 6. PRINT AND FORCED COLOURS — A DEFECT THIS FAMILY OWNS

The charter asks for the two arms to be *preserved*. They are, and the measurement found
something else (`census/print-forced-*.json`, **both engines, all three arms**):

    @media print          glyph stroke → rgb(0,0,0) ✔   grid line → rgb(0,0,0) ✔
                          .progress-trace → **rgb(139, 92, 246)** ✗
    forced-colors: active glyph stroke → rgb(0,0,0) ✔
                          .progress-trace → **rgb(139, 92, 246)** ✗

`index.css:894-952` blackens `.grid-line` and `.glyph-svg path` and re-points
`--grid-line-color` / `--color-user-ink`, but it never touches `--color-progress-ink` or
`.progress-trace`. **A printed worksheet carries a violet ring around the board, and a
high-contrast reader is handed one too.** The forced-colors block's own comment
(`index.css:945-951`) makes the argument verbatim — "browsers force `color` and
`background-color` but leave SVG `stroke` alone" — and then applies it to the glyph only. This
is the print rule's *second* missing twin, and it is one selector in each arm.

---

## 7. THE SPARKLE, THE GUARD, AND ONE ENGINE TRAP

**The sparkle.** Both literals tokenise cleanly. The mix is banked in `:root`
(`--sparkle-glow-soft` / `--sparkle-glow-strong`, the `--ink-press-rule` / `--ink-press-quiet`
shape at `index.css:259-266`) rather than spelled at the call site, because **Chromium
resolved `color-mix(in srgb, var(--x) 30%, transparent)` inside `filter: drop-shadow()` to
`rgba(1, 0, 0, 0.3)` in 2 of 5 consecutive runs** (webkit 5 of 5 correct; not reproducible in
an isolated page). Banking the mix reduced but did not eliminate it. This is most likely an
artifact of the overlay's late injection — the real cure lands the property in `index.css`,
parsed with the sheet — but a gate written on the computed filter will flake in Chromium
wherever the property is set late, and the next pass must re-measure it once the token is in
the sheet. `SvgFilters.vue:168`'s `#c4b5fd` (the `#sparkle-rainbow` stop) is the same hex and
is documented as deliberately unthemed; this family names the collision and leaves it.

**The guard.** Armed through R2's own path (dirty board → `button.logo-trigger` →
`.gallery-viewport` `d`), measured (`census/guard-*.json`) — and **reached in BOTH engines**,
which closes R2 §4.3's chromium-only holdout on this surface: the two agree to 0.01 of ratio.

| | HEAD | with `--color-red-ink` on the face |
|---|---|---|
| destructive verb ("deal") | `rgb(10,10,10)` — **18.99:1, zero chroma** | `rgb(208,42,82)` |
| …on the plain card | 18.99 | **4.87:1 — AA** |
| …on an 8% **red-tinted** ground | 16.03 | **4.31 chromium / 4.32 webkit — under AA** |
| the "keep" verb | 18.99 | 18.99 (unmoved) |

**The ruling this hands §15: put red-ink on the WORD and leave the 8% ground NEUTRAL.** Tinting
the ground with the same red buys nothing and costs 0.56 of ratio, dropping the one word that
must be read below the AA floor. The stroke-weight mark that already distinguishes the verb
stays, so a reader who sees neither colour nor weight still sees one verb marked.

---

## 8. THE KILL CONDITIONS

**"A plum within 5° of solver stop 2 that cannot be told from a revealed answer by form."**
Met at **0.0°** by construction — the sixth *is* stop 2 — so form carries the whole separation.
Measured (`census/kill-form-b-chromium.json`), after a real solve:

| | the fill trace | a revealed answer |
|---|---|---|
| form | one closed rect on the board **frame** | glyph shapes, 9.0–22.1 × 30.6–39.0 CSS px |
| weight | 5.088 px, α 0.95, round cap, continuous | 5 px strokes, broken, inside a cell |
| place | ON the box edge (+3.22 px outside it) | **≥ 15.6 px inside** the box, all 12 samples |
| colour | flat `--color-progress-ink` | `url(#solver-ink)` — a **five-stop diagonal gradient**, applied per glyph, so no revealed digit is flatly violet anywhere; the violet is one band at the 25% offset of each digit's own box (`SvgFilters.vue:179-185`) |

**Cleared, on three independent separators.** The collision the charter feared is a collision
of *names*, and the product already separates them by form, weight and place.

**"The dark law failing over warm-dark paper."** This is the kill that fires, and it fires on
arm (a): 1.93:1 painted. Recorded in §0.

**"The exception list bent without a stated law."** Not bent — the list **shrinks** from five
rainbow stops to four, the anchor set grows by one, and the law afterwards is written out in
§0 and in the probe's own head comment.

**"Chroma 0.20 at L 0.5 clips some hues out of sRGB."** Confirmed and quantified in §4: it
clips at four of the six anchors, `crayon-blue` among them.

**"A count tape is a new rendered string."** Confirmed, and it is **free** — §6.

---

## 9. THE SIX-ANCHOR RESERVED SET (§12 hands this to the palette; this lane does not design it)

The set the per-player palette must clear, with the arcs stated rather than assumed:

    crayon-rose     14.2°      crayon-green    147.0°
    crayon-orange   68.7°      crayon-blue     251.4°   ← your hand, after the cure
    crayon-gold     83.7°      the sixth       293.0°   ← the answer

Cost of reserving ±R against the shipped walk `hue = i × 137.5°`, first 40 indices
(`census/sixth-window.json` `walkVsReserved`):

| ±R | blocked, in theory | collide / 40, five anchors | collide / 40, **six** | the sixth's own cost |
|---|---|---|---|---|
| 5° | 16.7% | 4 | 5 | **1** |
| 8° | 26.7% | 6 | 7 | 1 |
| 10° | 33.3% | 10 | 12 | 2 |
| 12° | 40.0% | 12 | 15 | 3 |
| 15° | 50.0% | 15 | 18 | 3 |

Nearest collisions, measured: peer **i=10** sits at 295.0°, **2.0° from the sixth** — a tenth
player is dealt the answer's colour. Peer **i=8** at 20.0° is 5.8° from the teacher's red.
Peer **i=28** at 250.0° is 1.4° from crayon-blue, which after the cure is *your* hand (it was
0.4° from `user-ink` before the cure, so the cure does not fix this and does not worsen it).

**A second §12 fact the census did not have.** The walk declares chroma 0.110 at every hue and
sRGB does not have it at every hue: **9 of the first 40 indices are gamut-clipped**, worst
i=25 (declared 0.110, painted **0.0868** — 21% flatter than the formula says), all of them in
the 80–230° arc. The walk's "one formula, one chroma" claim is already false on the page.

Two shapes are available and the owner picks: leave the walk crossing the anchors, or make it
a **reject-sampler** over the six reserved arcs — still cap-free, still deterministic, at the
cost of index ≠ hue (about 44 raw draws to seat 24 players at ±12°).

---

## 10. WHAT A SYNTHESIZER SHOULD WRITE

    ── the sixth, arm (b): one hue, three rungs, ZERO new hexes ──────────────────
    :root {
      --color-answer-pale: #c4b5fd;   /* L .811  C .101  h 293.6 */
      --color-answer-mid:  #8b5cf6;   /* L .606  C .219  h 292.7 */
      --color-answer-deep: #7c3aed;   /* L .541  C .247  h 293.0 */
      --color-solver-ink-2: var(--color-answer-deep);   /* the verdict rung on white paper */
      --color-progress-ink: var(--color-answer-mid);    /* the ONLY rung the light trace fits */
      --color-sparkle-glow: var(--color-answer-pale);
    }
    .dark {
      --color-solver-ink-2: var(--color-answer-pale);   /* pastel on black paper */
      --color-progress-ink: var(--color-answer-deep);   /* the ONLY rung the dark trace fits */
      --color-sparkle-glow: var(--color-answer-pale);
    }

**The three rungs are forced, not preferred.** Of the three violets already in the tree,
exactly one sits in the light trace's window (MID, L 0.606 ∈ [0.558, 0.666]) and exactly one
sits in the dark trace's window (DEEP, L 0.541 ∈ [0.510, 0.576]); PALE sits in neither and is
the rainbow's dark arm and the glow. After the move, `#7c3aed` has **one hex name and two
semantic aliases**, which is the estate's own rule (a semantic state token is an alias, zero
new hexes) rather than "a third name for a colour that already has two".

    ── blue, one job ─────────────────────────────────────────────────────────────
    :root { --color-blue-ink: #2f76bd;                    /* 4.64 card · 4.53 bg */
            --color-user-ink: var(--color-blue-ink); }    /* 24 sites + the peer seam stand */
    .dark { --color-blue-ink: var(--color-crayon-blue);   /* ink collapses into wax */
            --color-user-ink: var(--color-blue-ink); }
    /* --color-focus-sketch DIES; gameCell.css:246,:248 → var(--color-blue-ink), NOT user-ink */

    ── the four selectors this family still owes ─────────────────────────────────
    GameControlPanel.vue:2081,:2087   delete the literals, use --sparkle-glow-soft/-strong
    GameGallery .guard-leave          color: var(--color-red-ink); ground stays NEUTRAL 8%
    @media print                      .progress-trace { stroke: #000 !important }
    @media (forced-colors: active)    .progress-trace { stroke: CanvasText }

    ── the meter ─────────────────────────────────────────────────────────────────
    gridPaths.ts:339   FRAME_Y_PAD 0 → 12, DELTA declared on the board goldens
    the label          "N of M filled" at the frame's top-left head; free in the cut;
                       aria-valuetext re-cut to the same literal (law 33, a W3 gate row)

---

## 10b. THREE SKETCHES

### (i) the wheel, before and after the naming

    before — five anchors, one 122.8° hole with three unrelated things in it
        rose 14.2 ──── orange 68.7 ─ gold 83.7 ────── green 147.0 ─────── blue 251.4
        └──────────────────────── 122.8° ────────────────────────┘
                     · progress-ink 292.7   · solver stop 2 293.0   · sparkle glow 293.6
                       (three names, one hue, nothing saying so)

    after — six anchors; the hole is named, the largest gap is now green→blue 104.4°
        rose 14.2 ── orange 68.7 ─ gold 83.7 ─── green 147.0 ──── blue 251.4 ── SIXTH 293.0
                                                 └──── 104.4° ────┘  └─41.6─┘  └── 81.2 ──┘
        the sixth is INK ONLY: no wax tier, no crayon dark law, three rungs

### (ii) the sixth's three rungs, and which ground picks which

                       L .811  PALE  #c4b5fd ── dark rainbow stop 2 · the sparkle glow
      ONE HUE 293°     L .606  MID   #8b5cf6 ── the LIGHT trace  (only rung in [.558,.666])
                       L .541  DEEP  #7c3aed ── the DARK trace   (only rung in [.510,.576])
                                               ── the LIGHT rainbow stop 2

        light theme            dark theme
        card  ██ near-white    card  ░░ near-black      the two grounds SWAP sides,
        frame ░░ dark          frame ██ light          so no single rung serves both

### (iii) the meter — the overhang today, symmetric, and where the tape goes

    today (FRAME_Y_PAD 0)                    cured (FRAME_Y_PAD 12)
      ▁▁▁▁▁▁▁▁▁▁▁▁▁  ← 3.22px OUTSIDE          ┌───────────┐
    ┌─┼───────────┼─┐  the board box           │ ▁▁▁▁▁▁▁▁▁ │  ← ~2.7px inside, four sides
    │ │           │ │                          │ ┃       ┃ │
    │ ┃  board    ┃ │  ← sides 2.78px INSIDE   │ ┃ board ┃ │
    │ │           │ │                          │ ▔▔▔▔▔▔▔▔▔ │
    └─┼───────────┼─┘                          └───────────┘
      ▔▔▔▔▔▔▔▔▔▔▔▔▔  ← 1.72px outside          cost: the GRAPHITE frame moves with it
                                                     (shared constant) → π DELTA declared

    the tape, at the frame's head — farthest from the controls card and its own word "Fill"
      ┌ 3 of 20 filled ┐            free in the Patrick Hand cut (digits are in it)
      ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁       75 × 23 px desk · 67 × 20 px phone (18.3% of the board)
    ┃                       ┃       at 0% the trace does not exist — the TAPE is the zero state

---

## 11. FRAMES

Three crops, 330×210 at the board's top-left corner, chromium, full-board fill. R2's
`r0/r2-accent-family/frames/board-corner-{light,dark}.png` are the "before".

- `frames/board-corner-b-light.png` (13,974 B) — arm (b) in light: the trace is the same violet
  it always was, and the digits beside it are `blue-ink`, one step off the unit wash they sit in.
- `frames/board-corner-b-dark.png` (14,758 B) — arm (b) in dark, the cell §3 above calls the
  tightest: the trace at 3.11:1 over the card, unmoved from HEAD.
- `frames/board-corner-a-dark.png` (16,456 B) — **the kill.** Arm (a)'s lawful wax dark arm on
  the light warm-grey frame line: 1.93:1. The number is the claim; this is what it looks like.

Lane total 400 KB of JSON + 45 KB of PNG. Note for the wave's evidence policy:
`evidence/w7` already stands at **9.1 MB**, so the charter's "bucket holds ~555 KB" is stale
and the 2 MB cap has been passed by other lanes before this one arrived.

---

## 12. RECOMMENDATION

**DEVELOP arm (b), restated as a sixth ANCHOR rather than a third exception; KILL arm (a) on
1.93:1.**

The sixth colour is not a colour to invent — it is a colour to *name*. `#7c3aed` is already in
the tree twice under two names, the wheel's 122.8° hole is already occupied by three unrelated
things, and the meter's two hexes are not sloppiness but the only lightness pair its two
grounds permit in each theme. Naming the hue as an ink-only anchor moves zero pixels, greens
rows 1, 2 and 4 in both engines, drops off-anchor painted colour by 37 points in light and 48
in dark, keeps every one of the four 1.4.11 ratios byte-identical to HEAD, and *shrinks* the
instrument's exception list. Arm (a) asks the same hue to be wax, and wax must glow at night —
which, over a frame line that is a light warm grey at night, is the one thing this colour may
not do. The wax arm is not mis-tuned; it is pointed the wrong way, and the estate already wrote
that down at `index.css:267-277` before anyone measured it.

Blue's one job rides with either arm and should ride: it costs your digit 0.44 of contrast in
light (5.08 → 4.64, still AA) and buys the focus ring its missing dark arm (3.72 → 6.47), its
first honest comment, a 9.6° gap closed to 0°, and two stock Tailwind hexes out of the estate.
The one thing it cannot buy is saturation — `crayon-blue`'s hue physically cannot hold
Tailwind blue-600's chroma in sRGB, and that trade is the owner's to dispose (U-10).

Four small selectors fall out of this family and are worth landing whatever the fork decides:
the sparkle's two literals, the confirm's word in red-ink on a neutral ground, and the progress
trace's missing print and forced-colors arms — the last of which is a live defect, not a
refinement.
