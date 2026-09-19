# ACC-FIVE — five crayons, no sixth · PASS 2 RESEARCH

T9-W7 §3 accent family · §4 fill meter · §12 multiplayer chrome · §15 the confirm's face ·
mark M07. Read-only on product files. U-10: nothing here closes a mark.

Measured 2026-09-17/18 on `http://127.0.0.1:4236` — this lane's own dev server in the pass-1
worktree `.claude/worktrees/wf_e58b4764-0fc-42` (scratch vite config, private `cacheDir` in the
scratchpad, `--strictPort`, **killed before this return**), chromium + webkit headless, light
and dark, 1280x800, `reducedMotion: reduce`. Four probes, four readings, **zero crops** — every
claim below is a number or a source cite.

| probe | reading | what it settles |
|---|---|---|
| `probe/cascade-ablate.mjs` | `readings/cascade-ablate.json` | row 1 — the centre gate, with an ablation that BITES |
| `probe/dash-law.mjs` | `readings/dash-law.json` | row 12 — the WebKit dash law on THIS gauge |
| `probe/peer-hue-sweep.mjs` | `readings/peer-hue-sweep.json` | row 3 — 40 indices vs five reserved accents, painted |
| `probe/confirm-shipped.mjs` | `readings/confirm-shipped.json` | row 9 — the confirm as it paints, box included |

---

## 0. THE HEADLINE — the gauge is not a gauge in WebKit, and it never was

`probe/dash-law.mjs`, both themes, both engines. The gauge's dash driven to
p ∈ {0.05, 0.25, 0.50, 0.75, 1.00} on the real surface; painted ink counted by 1,440
arc-length samples round the ring against one screenshot.

| p (board fill) | chromium runs · inked share | **webkit runs · inked share** |
|---|---|---|
| 0.05 | 1 · 0.029 | **4 · 0.189** |
| 0.25 | 1 · 0.228 | **4 · 0.921** |
| 0.50 | 1 · 0.479 | **1 · 0.956** |
| 0.75 | 1 · 0.729 | **1 · 0.956** |
| 1.00 | 1 · 0.955 | 1 · 0.956 |

Identical light and dark; run lengths at p=0.25 webkit are `[331, 364, 365, 266]` — four fronts,
one per side of the ring. **On WebKit the fill meter reads 92% full at a quarter-full board and
is saturated from half.** It is not this family's defect: the mechanism is HEAD's, unchanged by
the pass-1 diff — `HandDrawnGrid.vue:476-478` (progress) and `:509-511` (join) are
`pathLength="1000"` + `stroke-dasharray="1000 1000"` + `strokeDashoffset`, a dash PERIOD of 2000
against a path of 1000. Geometry read live: one subpath (`1 M`, `1 Z`), `getTotalLength()`
**3915.1**, `stroke-dasharray` computed `1000px, 1000px`, stroke-width 8.

This is ACC-GRAPHITE's dash law (`pass1/prototype/ACC-GRAPHITE/README.md §3.1`: period > path →
1 run chromium, 4 runs webkit) landing on the surface it was handed to untested. Three
consequences the synthesizer must carry:

1. **§4's whole premise — "the fill meter explained" — is false on Safari/iOS** before any
   colour question. A meter that cannot be read is not explained by relabelling it.
2. **The a11y mirror and the picture disagree.** `.progress-trace-a11y`
   (`HandDrawnGrid.vue:304-316`) publishes `role="progressbar"`, `aria-valuenow` and
   `aria-valuetext="board N% filled"` off the same `progress`. At N=25 WebKit paints 92%. The
   programmatic value and the visible one are different facts about the same object.
3. **The win is SAFE.** At p=1.00 both engines read 1 run at share 0.956. ACC-FIVE's centre —
   the trace becoming the solved frame at 100% — is unaffected by the defect, in both engines.
   The family can claim its centre and must not claim the gauge below 100%.

The cure is ACC-GRAPHITE's other graft: **cut, don't dash** — `tickMarksAlong` walks the pose's
own point list by arc length and emits real subpaths, no `pathLength`, no dasharray, no offset.
For a continuous front that means emitting ONE subpath of length `p · P` per fill event rather
than dashing a whole ring; the frame poses are already generated per fill in `traceFrames`
(`gridPaths.generateFrameTraceFrames`), so the seam exists.

---

## 1. Row 1 — the centre gate, and the ablation that never fired

### 1.1 The pass-1 evidence of record is a NO-OP

`critique/ACC-FIVE/probe/handoff-ablate.mjs:30` injects the killing rule **unlayered**:

```js
const ABLATE = `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important; }`;
```

The rule it must defeat is `@layer utilities` (`index.css:557` opens the layer, `:662` is the
rule) and is itself `!important`. For important declarations layer order inverts and unlayered
counts as the last layer, so the injection loses. The banked readings prove it: in
`handoff-ablate.json` **all four** `*ablated` arms report the same post-win stroke
(`rgb(201,154,46)` / `rgb(229,199,77)`) and the same `medianL` (0.692 / 0.832–0.833) as their
`live` twins. The critique's §1 table reports ablated post-win figures — `rgb(164,121,3)`,
L 0.588 / 0.540 — that appear nowhere in its own readings; they are the `before` row. The
critique's PROSE states the trap correctly (its cross-pollination #2); its banked instrument
does not carry the fix.

### 1.2 Re-measured with both arms, on the real win

`readings/cascade-ablate.json`. Five samples (900/1800/2700/3600/5000 ms) per cell; every sample
in a cell is identical, so one row each.

| engine · theme | arm | post-win stroke | band median L (pre → post) | ΔL | old gate | restated gate |
|---|---|---|---|---|---|---|
| chromium light | live | `rgb(201,154,46)` | 0.588 → **0.692** | **+0.104** | GREEN | **GREEN** |
| chromium light | unlayered ablate | `rgb(201,154,46)` | 0.588 → 0.692 | +0.104 | GREEN | GREEN *(no-op)* |
| chromium light | **layered ablate** | `rgb(164,121,3)` | 0.588 → **0.588** | **0.000** | **GREEN** | **RED** |
| chromium dark | live | `rgb(229,199,77)` | 0.540 → **0.832** | **+0.292** | GREEN | **GREEN** |
| chromium dark | **layered ablate** | `rgb(125,105,2)` | 0.540 → 0.540 | 0.000 | **GREEN** | **RED** |
| webkit light | live | `rgb(201,154,46)` | 0.588 → 0.692 | +0.104 | GREEN | GREEN |
| webkit light | **layered ablate** | `rgb(164,121,3)` | 0.588 → 0.588 | 0.000 | **GREEN** | **RED** |
| webkit dark | live | `rgb(229,199,77)` | 0.540 → **0.833** | **+0.293** | GREEN | GREEN |
| webkit dark | **layered ablate** | `rgb(125,105,2)` | 0.540 → 0.540 | 0.000 | **GREEN** | **RED** |

**The critique's verdict is CONFIRMED, now by an ablation that bites**: the pass-1 gate
(">0 chromatic px, median hue within 5° of gold") is GREEN in all eight arms, including the
three where the win is deleted. Under the working ablation the dark arm's post-win median hue is
96.6° — 1.4° from gold — so the hue test cannot separate the win from its own absence.

**The restated gate discriminates in all four engine x theme cells.** Write it as two
conjuncts, both measured at the same sample:

> The band's median chromatic-pixel OKLCH L rises **≥ 0.09** across the win
> (light 0.588 → 0.692, dark 0.540 → 0.832–0.833) **AND** the post-win computed stroke of
> `.progress-pose.is-active .progress-trace` resolves byte-for-byte to `--color-gold-star`
> (resolved through the cascade, not parsed from a hex).

Floor arithmetic: the smallest live ΔL is 0.104 (light, both engines); the largest ablated ΔL is
0.000. A floor of 0.09 leaves 0.014 of headroom below the live reading and 0.09 above the dead
one. **Keep the layered ablation arm IN the probe** — `probe/cascade-ablate.mjs` runs live,
unlayered and layered, so the no-op trap stays visible instead of being quietly fixed.

### 1.3 One caveat on my own numbers

Every band figure above came off the pass-1 build, which carries `FRAME_Y_PAD 12`. Chair §6.2
strikes that move (§6 below), so the prototype pass must re-read the band at `FRAME_Y_PAD 0`.
The geometry says it will hold: the band is 22 px wide starting 8 px LEFT of the board box, and
the left-edge inset is governed by `FRAME_X_PAD` (12, untouched) — pass 1's own paired control
measured the trace's left inset at **2.78 px** at pad 0 against **3.15 px** at pad 12. Both sit
inside the band. Re-measure anyway; do not carry my figure.

---

## 2. Row 3 — the 40-index peer sweep, painted (and the collision is not the one pass 1 named)

`probe/peer-hue-sweep.mjs` → `readings/peer-hue-sweep.json`. `playerIdentity.ts:68`:
`inkFor(i) = { "--color-user-ink": "oklch(var(--peer-ink-l) 0.11 ((i*137.5)%360)deg)" }`, no
avoid-list. `--peer-ink-l` = **0.5** light (`index.css:162`), **0.8** dark (`index.css:375`).
Every colour resolved to sRGB BYTES through a 1x1 canvas — `getComputedStyle().color` hands back
`oklch(...)` verbatim in both engines, and a probe that string-parses it measures nothing.
(My first run did exactly that and read every index at ~264°; the corrected run is the one
banked. **Trap for every lane touching `oklch()`.**)

Reserved set, resolved live on the cured tree:

| token | light rgb / h | dark rgb / h |
|---|---|---|
| `--color-progress-ink` | `164,121,3` · 83.41° | `125,105,2` · 95.79° |
| `--color-gold-star` | `201,154,46` · 83.67° | `229,199,77` · 95.23° |
| `--color-user-ink` | `2,111,196` · 251.23° | `71,167,255` · 249.37° |
| `--color-focus-sketch` | `58,123,196` · 253.28° | `106,171,235` · 249.33° |
| `--color-red-ink` | `208,42,82` · 13.55° | `255,92,124` · 12.15° |

**The sweep, 40 indices, minimum hue separation to any reserved accent:**

| theme | min | `< 5°` | `< 10°` | `< 17.7°` (the estate's own collision precedent) |
|---|---|---|---|---|
| light (band 0.5) | **1.19°** | `[28]` | `[7, 8, 15, 19, 21, 28, 32]` | 11 of 40 |
| dark (band 0.8) | **0.44°** | `[19, 21, 28]` | `[6, 7, 8, 19, 21, 28]` | 12 of 40 |

The four rows that matter:

- **i = 28 is your own pen.** Painted 250.04° light — **1.19° from `--color-user-ink`**, 3.24°
  from `--color-focus-sketch`; painted 248.89° dark — **0.44° from `--color-focus-sketch`**,
  0.48° from `--color-user-ink`. A peer whose ink is indistinguishable in hue from the LOCAL
  player's pen breaks authorship, which is the one thing the peer ink exists to carry. Pass 1
  did not find this; it is worse than the gauge collision.
- **i = 19 is the gauge**, and worse against the wax than against the ink: painted 92.94° dark —
  **2.29° from `--color-gold-star`**, 2.85° from `--color-progress-ink`; 90.94° light — 7.27° /
  7.53°. Pass 1's "2.7° from the dark trace's 95.2°" reproduces (the 95.2 it names is the wax,
  not the ink).
- **i = 21 is the teacher's red**: 4.47° from `--color-red-ink` in dark, 6.38° light. On a board
  where red means conflict, a peer writing in it is a semantic collision, not a taste one.
  (i = 0 reproduces ACC-GRAPHITE's finding independently: 14.05° light / 12.61° dark from
  red-ink.)
- **Inside ACC-FIVE's own reserved arc 77.4–100.8°: i = 19 and i = 32**, both themes.

Cross-engine identity: light rows are byte-identical chromium/webkit; dark differs on two
indices by ONE byte → ≤ **0.60°**, inside PAL-WALK's 0.96° 8-bit round-trip margin.

Gamut, for PAL-\*: chroma 0.11 is held to 0.087–0.111 light (worst held 0.79 at i=25) and
0.102–0.111 dark; hue rotation from nominal reaches **4.50°** light (i=33) and 1.60° dark. **A
gate written on the NOMINAL hue is wrong by up to 4.5°** — this is why the sweep is painted.

**The gate to write** (and hand to PLR-SELF / PLR-PLACE / PAL-TIN):

> For every index 0..39, in both themes, on painted bytes: the OKLCH hue distance to each of
> `{progress-ink, gold-star, user-ink, focus-sketch, red-ink}` is ≥ 17.7° — the estate's own
> collision figure, taken from `HandDrawnGrid.vue:601` (HEAD) / `:618` (cured) (`.join-pose`: index 2 at 275° against
> the violet's 292.7° = 17.72°, "it read as ONE ring"). Born-RED: 11 of 40 fail light, 12 of 40
> fail dark, worst 0.44°.

ACC-FIVE cannot green that gate by moving its own five tokens — the failures are against the
pen and the teacher's red as much as the gauge. **The reserved-arc law belongs to PAL-TIN's
charter row; ACC-FIVE states the arcs and cites it.** The arcs this family reserves:
gold **77.4–100.8°** (both progress arms ±5 plus the theme spread) and blue **244.4–258.3°**
(user-ink and focus-sketch, both themes, ±5).

---

## 3. Row 9 — the confirm as it PAINTS

`probe/confirm-shipped.mjs` → `readings/confirm-shipped.json`, the guard armed on the deck,
crop = the `.guard-leave .guard-face` box inset 3 px.

| | chromium light | webkit light | chromium dark | webkit dark |
|---|---|---|---|---|
| computed `color` | `rgb(208,42,82)` | same | `rgb(255,92,124)` | same |
| computed `background` | `color(srgb 0.815686 0.164706 0.321569 / 0.05)` | same | `color(srgb 1 0.360784 0.486275 / 0.05)` | same |
| **painted 5% ground** | `250,240,242` (61.0% of the face) | `249,240,242` (60.1%) | `30,20,20` (61.0%) | `30,20,20` (60.3%) |
| painted word core | `208,42,82` | `208,42,82` | `255,92,124` | `255,92,124` |
| **word / its own ground** | **4.549** | **4.540** | **6.070** | **6.070** |
| box stroke (`stroke` attr) | `rgb(208,42,82)` (**`currentColor`**, 2.5 px) | same | `rgb(255,92,124)` | same |
| box / ground · box / card | 4.549 · 4.990 | 4.540 · 4.990 | 6.070 · 6.303 | 6.070 · 6.303 |

Two answers the charter asked for:

1. **The red box is real and it CLEARS.** `HandDrawnOutline` strokes `currentColor`, so
   `.guard-leave .guard-face { color: var(--color-red-ink) }` recolours the drawn frame as well
   as the word — measured, `stroke` attribute `currentColor`, both engines, both themes. It
   reads **4.99:1 on card** light and **6.30:1** dark against a 3:1 non-text floor (1.4.11).
   **Declare it, do not fix it** — and rewrite the sentence: it is not "one red word on a faint
   red ground", it is *the verb and its box in the teacher's red, on that red at 5%*. That is
   arguably the better design and it is certainly the one that ships.
2. **The shipped ratio is 4.54–4.55, not 4.63.** Three numbers were in circulation — the spec's
   4.55/4.58, the source comment's 4.56, the critique's composite 4.631. The painted word on the
   painted ground reads **4.549 chromium / 4.540 webkit**. AA is 4.5. **The margin is 0.04–0.05
   of a ratio**, and the engines differ by 0.009. Write the gate at the painted floor (**≥ 4.5,
   measured on painted bytes, both engines**) and say out loud that the 5% ground is chosen to
   clear AA by four hundredths — because the incumbent 8% ground reads 4.424 (pass-1 critique,
   independently derived), under the floor. A designer who later nudges the ground to 6% breaks
   it, and only a painted gate catches that.

---

## 4. Rows 2 and 10 — `--color-blue-ink`, and what the estate's own instruments say

**The estate's gate ACCEPTS the pair.** Run on the cured worktree, bare:

```
$ node scripts/check-theme-tokens.mjs
@theme declared: 55
unreferenced (corpus only):     1
unreferenced (transitive rule): 0
ALIAS-ONLY (live through a live token, kept):
  --color-blue-ink
check-theme-tokens: 0 unreferenced @theme tokens
```

So the instrument has a category for exactly this shape and keeps it. The tension is with the
COMMENT four lines above the mint — `index.css:143-148` (HEAD and cured tree alike), the T5-W2
2.3 ruling: *"an alias with no consumer is a third name for a colour that already has two."*
**Gate says fine; law says third name.** That is a chair question, not a measurement, and it
should be put as one.

The measured facts the decision needs:

- `--color-blue-ink` has exactly **one** consumer, `--color-user-ink`, in each theme
  (`index.css:159-160` light, `:411-412` dark). Nothing in `src/`, `e2e/` or `scripts/` reads it.
- **Every one of `--color-user-ink`'s 24 consumers WANTS the rebinding.** I checked the ones
  that look like chrome and they are not: `GameControlPanel.vue:1666` (the roster row — "THE
  SLUG IS IN THEIR INK"), `:1687` (`.player-swatch` — "the digit's own ink, not a legend for
  it"), `GameBoard.vue:1213` (the attribution tape — "their ink, on their name"),
  `GameCard.vue:620` (the deck swatch), `gameCell.css:230,232`
  (`var(--color-peer-cursor-ink, var(--color-user-ink))`), `HandDrawnGrid.vue:504` (the join
  ring). There is **no landed surface that wants the CONSTANT rather than the BINDING.**
- The §12/§11 candidate — M14's player icon, "coloured … when a multiplayer session is active"
  — is **not landed**; it is §11's design obligation and PLR-SELF / PAL-TIN's surface.

So the row resolves one of three ways, and the synthesizer should pick explicitly rather than
inherit:

- **(a) COLLAPSE** (parsimonious, and what the critique's own wording defaults to): spell
  `--color-user-ink: #026fc4` / `#47a7ff` and delete `--color-blue-ink`. The family's sentence
  ("your pen is crayon-blue's ink tier") survives as the comment it already is. Costs nothing
  measured; loses the naming parallel.
- **(b) KEEP, on the house's own tier law**: the estate already names ink tiers
  `--color-green-ink` / `--color-orange-ink` / `--color-red-ink` / `--color-gold-ink`, and
  already pairs a tier with a semantic alias (`--color-teacher-red: var(--color-crayon-rose)`).
  `--color-blue-ink` is the tier; `--color-user-ink` is the binding. The parallel is real but
  **incomplete**: every other ink tier has a direct consumer and this one does not.
- **(c) KEEP AND LAND THE CONSUMER** — only honest if §11's mark lands in the same commit, which
  is another family's surface. Do not promise it from here.

**Instruments (row 10).** Both static probes are blind to the mint, and one is blind for a
second, pre-existing reason. Proposals as diffs in `instruments/README.md`, r0 rows reported
**MOVED**, nothing re-cut in place:

- `r0/r6-idiom-history/hue-census.mjs` — `TOKENS` (`:52-70`) has no `--color-blue-ink`; `read()`
  (`:72-75`) matches `#hex` only so the pen's LIGHT row vanishes when the arm becomes
  `var(--color-blue-ink)`; and `const dark = src.slice(darkAt)` (`:49`) runs to EOF, swallowing
  the `@media print` arm (`index.css:1008`, `--color-user-ink: #000`) — which is why the census
  prints `--color-user-ink,dark,#000`. The third defect is PRE-EXISTING and fires at HEAD for
  any token redeclared under print.
- `consumers.mjs` — fixed `TOKENS` (`:36`), plus an `OUT` that defaults to an ABSOLUTE pass-1
  path (`:23-26`): a lane that forgets `ACC_FIVE_OUT` writes into the frozen record.
- `handoff-ablate.mjs:30` — the unlayered ablation above (§1.1). **MOVED, and the reason is that
  its banked arm measured nothing.**

---

## 5. Rows 4 and 5 — the five doc sites, each with its line and its falsehood

Line numbers given HEAD / cured-worktree where they differ.

| # | site | what it says | why it is false |
|---|---|---|---|
| 4 | `index.css:174-176` / `:183-185` | "Gold is **earned light**: it lives in the sky and comes to the page only when the work is done." | The trace paints `--color-progress-ink` (gold) from the FIRST digit — measured 1,398–1,403 chromatic px in the band before the win. The diff rewrote the tier comment immediately below and left the law standing. **Amend it in the same commit or the family is a rewording of a law it breaks.** The amendment is available and true: gold now has two moments — *the work in progress is gold ink, the work done is gold wax* — which is exactly the ΔL the restated gate measures. |
| 5a | `HandDrawnGrid.vue:27-31` / `:32-36` | the `solveSuccess` prop cites `.solve-success .progress-trace { opacity: 0 }` and "the 500 ms bow-out … has nothing left to fade" | that rule was DELETED by this prototype; the pin now exists to hold the stack for a stroke swap, not a fade. Untouched in the pass-1 diff. |
| 5b | `GameControlPanel.vue:8` | "the difficulty heading's crayon tone is derived from the selected option's `colorClass`" | `activeColorClass` was deleted; `:187` (cured) says the heading is muted always. The header comment was left. |
| 5c | `index.css:147` | "the headings write in the hue-locked INK tier below" | the tier's subject moved to the PEN; the headings are muted. |
| 5d | `index.css:200-209` (cured) | "The Difficulty section-heading writes in the difficulty crayon" + four measured heading ratios | false after the same deletion; the ratios now describe nothing that paints. |
| 5e | `HandDrawnGrid.vue:601` / `:618` | `.join-pose`: "index 2 lands at 275deg, a hand's breadth from `--color-progress-ink` … it read as ONE ring" | **true of the violet, false of gold, and now measured**: index 2 paints 275.45° light / 274.67° dark; distance to `--color-progress-ink` is **167.96°** light / **178.88°** dark. Its real nearest reserved accent is `--color-focus-sketch` at 22.17° (light) / `--color-user-ink` at 25.30° (dark). The offset retrace should keep its 0.984 scale and take a new reason — the sweep gives it one: i=28 at 0.44°. |

The "17.7°" the estate treats as a collision is this comment's own arithmetic: 275.0 nominal
against the violet's OKLCH 292.72 = **17.72°**. Keep the number, move its subject.

---

## 6. Rows 6, 7 and 11 — what the chair's rulings take off this family's plate

**FRAME_PAD is struck (chair §6.2).** `gridPaths.ts:338-339` — `FRAME_X_PAD 12` (untouched),
`FRAME_Y_PAD 0` at HEAD, moved to 12 by pass 1. Pass 2 ships the palette **at HEAD's value** and
cites the ruling. Four consequences, all of which change what the family may claim:

1. **The meter-symmetry row is VOID for ACC-FIVE.** At pad 0 the painted insets are pass-1's own
   control run: L 2.78 · T **−3.22** · R 2.68 · B −1.72 → |T−L| **6.00 px** at 1280 and 3.45 px
   at 393 dpr3. The 1.26 px / 0.72 px readings belong to the struck move. Do **not** restate the
   ≤0.5 px gate at 1.26; hand the whole overhang, the wobble jitter (bbox L 4.96 · T 6.94 ·
   R 4.28 · B 9.51 off four equal pads) and the ≤0.5 px question to the FRAME_PAD row.
2. **Only ONE board golden should move.** `grid-corner-light`'s 6,858 px was the pad; with the
   pad at HEAD only `cell-light` (2,292 px, the pen's ink) is a declared delta, and
   `logo-light` / `toggle-crest-dark` stay at 0. Verify, don't assume — and re-mint only after
   the FRAME_PAD row is settled (chair §6.2), darwin off a built dist, linux off the runner
   artifact.
3. **R3's frame-wobble σ delta disappears** (1.145 → 1.199 px was the chord shortening
   503.651 → 497.537 px under the pad move). π gets stronger, not weaker.
4. **Re-read the band at pad 0** (§1.3).

**The focus-ring token is struck (chair §6.1).** ACC-FIVE reads it, never writes it. The dark
arm for `--color-focus-sketch` stands as a proposal handed to §6. **State which of §6's
candidate values the palette survives on**: the family's kinship is bought against
`--color-crayon-blue` at 251.4°, and every candidate on the table (MRK-LIVE's single 4.19–4.38
value, MRK-ABS's dark alias of crayon-blue, this family's 6.424 dark arm) is a BLUE in the same
arc, so the five-crayon claim survives all three. What does NOT survive is a ring outside
244.4–258.3°: that would put a sixth accent on the board and break the centre. Say so as a
condition, not a preference.

**Row 11, reported beside, not cured.** (a) kinship row 3 — a control's focus ring — stays RED,
untouched; §6's row, and its gate must keep the subject-count guard (PW-WebKit reaches 0
controls by Tab, so the row would green with no subject). (b) The solved frame's own gold still
does not paint: `bakedHidden 4 / bitmaps 4`, `.solve-success .grid-line` (`index.css:640-643`)
lands on the live vector stack which is `display:none` under the bake. Routed around, not cured;
a W7/W8 substrate row. The rule stays for print, where the bitmaps drop.

---

## 7. Row 7's other two gates, restated with their reasons

- **The paired census, chromium dark mid 20.58 / 20.70% against ≤17%.** The instrument's band is
  OKLCH 40–115°, which contains exactly two crayons (orange 68.7°, gold 83.7°); "off-family"
  there means *not warm*. crayon-blue sits at 251.4° and is off-band whether it is kin or not —
  **10.0 of the 20.58 points are the 240–270° bin**, i.e. the pen and the ring doing what the
  family asked. Restate as a DECLARED TERM: *off-family = chromatic pixels outside 40–115°
  **excluding** the 240–270° bin, which the kinship rows own*, with the blue bin reported as its
  own number beside. The threshold was set from one deal and the instrument is deal-sensitive by
  its own admission (R2 trap 4: the deal is not seeded) — so the gate should also name the deal
  or run paired, as it already does.
- **The ring gate ≥6.4 against painted 6.38 chromium / 6.44 webkit.** 6.42 is the two-engine
  mean cited back as a floor — the spec-cites-itself shape the critic flagged. Set the floor at
  the painted worst with headroom: **≥6.3**, with the painted pair reported. It is 3.66 → 6.38
  against a 3:1 requirement; nothing is at risk and the gate should stop pretending to be tight.

---

## 8. Row 8 — the post-win trace at 2.53:1, booked for the owner

Measured (pass-1 critique part A, and unchanged here): the wax over card reads **2.533 light**,
11.234 dark. The solved board holds that state for as long as it is on screen. The 1.4.11
exemption the family claims is by analogy to the shipped solved frame — but that frame was never
a gauge carrying a live `.progress-trace-a11y` value, and `role="progressbar"` with
`aria-valuenow` is a UI component, not decoration.

**Book it, do not claim it.** The owner's question, in one line: *at the win the fill gauge turns
to gold wax at 2.53:1 on the light card and stays there; it is celebration, and it is also still
a progressbar. Exempt it, or hold the post-win stroke at the ink tier's 3.57:1 and let only the
box-shadow celebrate?* U-10 — do not close it here. The cheap hedge exists and should be priced
beside the question: `prefers-contrast: more` could hold the post-win stroke at the ink tier,
which costs one rule and no pixels for anyone who has not asked for it.

---

## 9. THE SURFACES AND TOKENS THIS FAMILY TOUCHES — the synthesizer's map

**Tokens written** (7 files, +209/−69 in pass 1; drop step 6, so **6 files**):

| token | light | dark | painted h (OKLCH) | who reads it |
|---|---|---|---|---|
| `--color-blue-ink` *(new, see §4)* | `#026fc4` | `#47a7ff` | 251.2 / 249.4 | `--color-user-ink` only |
| `--color-user-ink` | alias | alias | — | 24 VAR consumers, all peer-rebindable |
| `--color-progress-ink` | `#a47903` | `#7d6902` | 83.4 / 95.8 | 1 (`HandDrawnGrid.vue:484`, cured) |
| `--color-focus-sketch` | `#3a7bc4` | `var(--color-crayon-blue)` **(§6 owns this)** | 253.3 / 249.3 | `gameCell.css:246,248` |
| `--sparkle-glow-soft` / `-strong` | new | new | gold | `GameControlPanel.vue` |
| `--color-red-ink` (consumers, not value) | `#d02a52` | `#ff5c7c` | 13.6 / 12.2 | 3 → 7 |

**Surfaces:** the board's frame ring (`HandDrawnGrid` `.progress-pose` / `.progress-trace`), the
digits (`HandwrittenGlyph`, `--color-user-ink`), the board's keyboard ring (`gameCell.css`), the
solver button's glow (`GameControlPanel`), the deck's guard ribbon
(`GameGallery.vue:1467-1479` CSS, cured), and — by inheritance only — the join ring
(`HandDrawnGrid.vue:509-511`) and the roster row / swatch / attribution tape.

**Primitives to reuse, by name:**

- `tickMarksAlong` (`gridPaths`, ACC-GRAPHITE) — arc-length cutting instead of dashing. **This
  is the answer to §0.**
- `generateFrameTraceFrames` (`gridPaths.ts:359`, cured) — the grain-baked pose ring the gauge already
  rides; zero filters, zero re-raster.
- `HandDrawnOutline` (`:stroke-width`, `:outset`, `:pose`) — the one box grammar; strokes
  `currentColor`, which is why §3's box is red.
- `pencil-draw-on` (`index.css`) — `pathLength="1"` + `--draw-dur`, the estate's global stroke
  reveal. **Same dash family as §0's defect — audit it on WebKit before reusing it.**
- `MOTION.traceFillMs` / `traceWinMs` (`pencilConfig.ts:169`, `:175`, cured) — the two bands, already
  v-bound; no timing literal outside `pencilConfig`.
- `scribbleUnderline` (mulberry32 seeded retrace, offset ≈ 1 stroke width) — the house's retrace
  idiom the `.join-pose` 0.984 scale already copies.
- The **ink-tier algorithm** (this family's, graftable): hold the crayon's OKLCH hue, take the
  maximum chroma sRGB allows there, walk lightness until the floor clears; when the mark sits
  between two grounds that swap with the theme, solve for the lightness BAND, not a floor.

---

## 10. ASCII — three things a number cannot say

### A. The dash law, one ring, two engines (p = 0.25)

```
        CHROMIUM (1 run, 0.228)                 WEBKIT (4 runs, 0.921)
        start
        v                                       v        v
      ==========-------------+               ===========-------+
      |                      |               |                 |
      -                      |               =                 =
      -                      |               =                 =
      -                      |               =                 =
      |                      |               |                 |
      +----------------------+               +======-----=======+
      ^ inked   ^ paper                      every side restarts the phase
      the front advances once round          four fronts; reads ~full at a quarter
```

### B. The two moments of gold — what the restated gate reads

```
   band median OKLCH L of the chromatic pixels in the 22x246 strip

   L 0.83 |                                        o  dark, after   (wax)
   L 0.69 |                        o                   light, after (wax)
          |
   L 0.59 |  o---------------------                    light, before (ink)
   L 0.54 |  o---------------------                    dark,  before (ink)
          +---------------------------------------------------------
             0%      50%      99%   | WIN |   +900ms ... +5000ms
                                    ^
             hue is 83.6-83.7 the whole way across  <- the old gate reads THIS
             L moves +0.104 / +0.292 only HERE      <- the new gate reads THIS
             ablated (layered): L moves 0.000       <- and this is what reds it
```

### C. The peer walk against the reserved arcs (light, painted)

```
   0°        60°      83.4/83.7      120°       180°      251.2/253.3     300°     360°
   |----------|-----------||-----------|----------|-----------||-----------|--------|
   ^i0 14.1   ^i8 6.1     ^^ GOLD ARC  ^i22       ^i25        ^^ BLUE ARC  ^i2      ^i34
   ^i21 6.4              i19 7.3 i32 5.2                  i28 1.19  i7 8.9 i15 9.4
     RED ARC              77.4 - 100.8                      244.4 - 258.3
                          (the gauge + the wax)             (your pen + the ring)

   40 indices, no avoid-list. 11 land inside 17.7 deg of a reserved accent.
   The worst is not the gauge -- it is i28, 1.19 deg from YOUR OWN PEN.
```

---

## 11. RISKS, in the order they can sink the pass

1. **§0 is bigger than this family.** Curing the WebKit dash means changing how the gauge is
   drawn (cut, not dashed), which touches `gridPaths` and `HandDrawnGrid` geometry — ACC-GRAPHITE
   and MOT-\* territory, and it moves the board goldens a second time. The alternative is to
   REPORT it and route around: ACC-FIVE claims the win (safe in both engines) and books the
   intermediate gauge as a W7/W8 row. **Routing around is the right scope; not stating it is
   not.** Whoever takes it must also check `pencil-draw-on` (`pathLength="1"`) and the join ring,
   which are the same mechanism.
2. **Building a dist can collide with W8.** The filter-census and the goldens must run off a
   BUILT dist (`e2e/filter-census.spec.ts`'s own header; pass 1 ran both on `:4236` dev, so the
   12/12 and the two board deltas are indicative only). W8 §8.1 has the main tree's dist PINNED
   at `index-9rZPzI5DEcpe.js` — **never `npm run build` in the main tree while that lane flies**.
   Build inside the family's own worktree, and check the W8 flight first.
3. **Every band number I banked is a pad-12 reading** (§1.3). Re-measure at `FRAME_Y_PAD 0`.
4. **`oklch()` cannot be read with a string parse.** `getComputedStyle().color` returns
   `oklch(...)` verbatim in both engines. Any gate that reads a peer ink, a `color-mix`, or a
   relative colour must go through a canvas byte read-back. My first sweep run had this bug and
   reported every index at ~264°; a lane that does not notice will gate on fiction.
5. **The 4.54 confirm margin is four hundredths.** Any later change to the ground's percentage,
   the paper, or the red token breaks AA silently. The gate must be painted, both engines.
6. **The peer sweep cannot be greened by this family.** It fails against the pen and the
   teacher's red, not only the gauge. If ACC-FIVE ships the sweep as its own gate it ships a red
   gate; the sweep belongs to PAL-TIN with ACC-FIVE's arcs cited. **Do not re-word it to pass.**
7. **`--color-blue-ink` is a chair question, not a measurement** (§4). Pick (a), (b) or (c)
   explicitly. Inheriting the ambiguity is how a "third name" survives another tranche.
8. **Three doc sites are outside this family's own files** (`GameControlPanel.vue:8`,
   `HandDrawnGrid.vue:601`, `index.css:200-209`). Fixing them is comment-only and π-neutral, but
   it widens the blast radius the critique praised; state the file count honestly.
9. **The dark grid line is hue 95.2° at chroma 0.011** — in dark the trace and the frame it
   retraces are ONE hue and only pressure separates them. The band census says it reads; whether
   it reads WELL is an eye question for the owner (U-10).

---

## 12. Couplings, stated not resolved

- F1 "the board keeps your blue": ACC-FIVE sits with PLR-COUNT, PLR-PLACE and both PAL-\*.
- The **ink-tier algorithm** is grafted to ACC-GRAPHITE, ACC-SIX and PAL-\*.
- The **40-index sweep** (§2) is written here and consumed by PLR-SELF / PLR-PLACE / PAL-TIN.
- The **WebKit dash law** came from ACC-GRAPHITE and is returned here with its first measurement
  on a shipped gauge (§0) — it condemns HEAD, not a design.
- The **layered-ablation trap** (§1.1) is owed to every family that ablates a `@layer` rule.
- The **`oklch()` read-back trap** (risk 4) is owed to every family that measures a computed
  colour.

## 13. Files

```
probe/vite.lane.config.ts     the lane's scratch vite config (private cacheDir; server killed)
probe/package.json            {"type":"module"} so vite loads the config as ESM, not CJS
probe/cascade-ablate.mjs      §1 — live / unlayered / layered, both engines, both themes
probe/dash-law.mjs            §0 — the sweep at 0.05/0.25/0.50/0.75/1.00
probe/peer-hue-sweep.mjs      §2 — 40 indices, painted bytes, five reserved accents
probe/confirm-shipped.mjs     §3 — the armed guard, face crop, box stroke
readings/*.json               every number above, raw
instruments/README.md         three MOVED proposals as diffs (§4)
```

Re-run from a rig with `web/frontend/node_modules` symlinked beside them and a
`{"type":"module"}` `package.json`, against a dev server in the family's worktree:

```
BASE=http://127.0.0.1:4236 OUT=<readings> node cascade-ablate.mjs
BASE=http://127.0.0.1:4236 OUT=<readings> node dash-law.mjs
BASE=http://127.0.0.1:4236 OUT=<readings> node peer-hue-sweep.mjs
BASE=http://127.0.0.1:4236 OUT=<readings> node confirm-shipped.mjs
```
