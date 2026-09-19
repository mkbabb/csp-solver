# PASS-1 CRITIQUE · MRK-ABS · One visible hand

Adversarial critic. Did not write the spec or the prototype. Read the diff in its worktree,
looked at its frames, re-ran on my own server from the prototype's worktree
(`127.0.0.1:4241`, chromium + webkit, 1280×800 and 393×699), recomputed the contrast off the
token hexes, re-derived the shape constant off the library, and ran the copy/theme/ink/motion
lints. Instruments and logs: `critique/MRK-ABS/probe/`, `critique/MRK-ABS/logs/`.

**Convergence: 62. Verdict: ADVANCE.** The family is alive, cheap and mostly right; it is not
banked. Three of the six rules it rewrites are measured nowhere, one central claim is
measurably false, and one guard measures the wrong boundary.

---

## 1 · What I reproduced (the family's real ground)

| claim | my reading | agrees |
|---|---|---|
| token 4.19 bg / 4.29 card light, 7.86 / 7.70 dark | computed from `#3a7bc4` / `#6aabeb` over the four grounds: **4.19 / 4.29 / 7.86 / 7.70** | yes |
| board ring 3.68 light / 6.53 dark | ink at `stroke-opacity 0.9` over card: **3.62 / 6.44** | yes (painted vs modelled) |
| `outline-style: auto` nowhere | real Tab walk, 14 stops chromium: **0 auto**. Control (a HEAD-parity worktree on :4242): **7 stops `auto`** | yes |
| filterBudget 9/9/9, ghosts 16/81/256 | **9/9/9**, **16/81/256**, both engines | yes |
| dark arm is an alias, zero new hex | `diff` of `hue-census-proto.txt` against r0's HEAD census: **exit 0, byte-identical** | yes |
| clearance headroom 9.071 / 3.809 / 0.233 px desktop | re-derived off `@mkbabb/pencil-boil` directly: **identical to 3 dp** | yes |
| no rendered strings | `lint:copy` (M16), `lint:theme-tokens`, `lint:theme-selectors`, `lint:ink`, `lint:motion` all **green** | yes |

Law 23 is honoured (the dark arm is `var(--color-crayon-blue)`, no hex minted). AA holds on
both themes for every value I could compute, including the fade's start colour (below).

---

## 2 · What I found that the pass did not report

### 2.1 The token ring is not same-frame. It fades in over 150 ms, both engines.

`probe/verify2.probe.ts` samples `.ctrl-btn`'s computed outline at 0/30/80/150/250/400/700 ms
after focus (`logs/crit-arrival-*.json`):

```
chromium   1ms rgb(115,115,115) · 30ms rgb(110,116,123) · 81ms rgb(70,121,178) · 150ms rgb(58,123,196)
webkit     1ms rgb(115,115,115) · 31ms rgb(114,115,116) · 80ms rgb(79,120,166) · 150ms rgb(59,123,195)
```

`transition-property` on the button is Tailwind v4's colour list — it **includes
`outline-color`** — at `transition-duration: 0.15s`. So §2.5's "the token ring appears
same-frame (outlines do not transition; PRM identical)" is false on the real surface in both
engines, and the ring's ink is grey for the first ~80 ms.

The prototype named this as a gap but mis-cited its cause: it blamed
`GameControlPanel.vue:190`'s `transition-colors duration-250`, and that utility is on the
section **heading**, not the button — the file's own comment at :2424 says so. The duration is
150 ms, not 250. The carrier is un-named, so the "one-line decision" is not yet a decision
anyone can take.

AA survives the fade (grey `rgb(115,115,115)` is 4.66 on card, 4.55 on background; the 80 ms
midpoint 4.45), so this is a truth defect, not a contrast defect.

### 2.2 G-ABS-4's "one colour" is a property of the settle, not of the design.

A real Tab walk sampling 40 ms after each press reads **five** painted outline colours in
chromium on the prototype (`logs/crit-tabwalk-chromium.json`):
`rgb(102,117,133)` (`.tuner-toggle`), `rgb(105,116,129)` (`.ctrl-btn`), `rgb(106,116,127)`,
`rgb(110,116,122)` (`.attribution-trigger`), and the token `rgb(58,123,196)`. The prototype's
own census reads one because it settles 400 ms first. The gate must carry its settle in its
wording or it is measuring the instrument.

Two useful side-readings from the same walk: the masthead links **do** take the token
(`2px solid rgb(58,123,196)` at 3px, both links) — the pass listed them as unmeasured — and
`.tuner-toggle` reads offset `1px` mid-transition, so the offset animates too.

### 2.3 The clearance guard measures a boundary the grid rule already crosses.

`logs/crit-ring-vs-rule-16-*.json`, 16×16 at 1280×800, both engines, identical:

```
cell box 39.75 px · ring scale 0.4892 px/unit · ring ink rect 37.14 × 36.82 px
nominal margin 4.587 px  (this is what MA-C scores against)
nearest cell-line: stroke 3.18 px · bbox overlap with the ring's ink −4.011 px
```

The ring's ink comes within **0.233 px** of the cell's nominal box. The rule is centred on that
box with a 3.18 px stroke, so it reaches **1.59 px inside** it before any wander at all:
a **1.36 px guaranteed ink-on-ink overlap**, arithmetic, no measurement error. The pass's own
crop (`prototype/MRK-ABS/frames/ring-16x16-1280-light-chromium.png`) shows the blue ring
sitting on the dark rule. "0/256 crossing" is true and cannot fail on the thing the crop shows,
because the hazard it names (painting over the neighbour's ghost) is not the hazard a reader
sees (fusing with the rule).

### 2.4 `ringK` is fitted and verified by the same sampling window.

`probe/k-refit.mjs` draws the same geometry with the same library at the same roughnesses and
takes σ off the node polyline of the first edge instead of arc-length 0.02–0.22:

```
σ_units mean   4×4 2.206 · 9×9 2.374 · 16×16 2.381   (target 1.75 → +26% / +36% / +36%)
spread 7.92 %   (the pass measured 6.1 %; the synthesis predicted 4.2 %)
per-cell CV 0.28–0.29 at every size; excursion max 5.379 / 5.379 / 5.399 units — constant
```

σ_units is window-dependent, and `ringK = 0.3241` is the constant that makes ONE window read
1.75. The gate then checks that window. Whatever the number becomes, the window has to become
part of the law, in the gate and in the comment, or G-ABS-2 is circular.

Two structural readings fall out of the same run. The residual is **monotone in board size**,
so the "one shape constant" model has a systematic error, not noise. And the excursion is
constant in units (≈5.4) while the margin is `0.15 × cellSize`: headroom in units is
`0.15·cellSize − 8.9`, zero at cellSize 59.2 — **board size 17**. The law has no room for a
larger board and does not say so, and the 0.15 pad is owned by `useGameCell.ts`, not by this
family.

### 2.5 The diff mints three comments its own pass contradicts.

The family's virtue is deleting two false comments. It lands three:

- `pencilConfig.ts` — "spread 4.2%" (this pass measured 6.1%, I measure 7.9%).
- `pencilConfig.ts` — "against the grid rule's own 1.443 / 1.031 / 0.631 — inside [0.5×, 2.0×]".
  Those are r0's **n=1** figures, which this pass itself refuted; widened they are
  0.813 / 1.070 / 1.262 and the whole ratio row changes.
- `gridPaths.ts` — "58.6 KB → 114 KB" against a measured 111.6 KiB.

### 2.6 Two of the six rewritten rules are measured by nobody, and the deck's control is not a control.

`.staging-face` and `.guard-face` are "not sampled" in r0's census, appear in **zero**
pass-1 logs (`grep -c staging-face\|guard-face logs/*.json` → nothing), and I could not reach
them either: `./` renders no deck at all — `.gallery-viewport`, `.game-card`, `.staging-btn`,
`.guard-btn` all absent, both engines (`logs/crit-gallery-*.json`).

For the third, `token-ring.probe.ts:334` reads the **same prototype tree twice, 250 ms apart**,
and banks the first read as `head`. `logs/deckring-token-*.json` duly shows both arms with the
token's own `2px solid rgb(58,123,196)` at offset 3px. So "reach 6 → 5, headroom 3.6 → 4.6" is
arithmetic off the old CSS, not a measurement — and it is filed as one.

### 2.7 WebKit's keyboard story is untested.

A real Tab walk in PW-WebKit reaches **exactly one stop** — a cell input — at 1280×800 and at
393×699 (macOS "Full Keyboard Access" off by default). Every WebKit chrome reading in this
family, at r0 and here, comes from programmatic `.focus()`. "The UA ring appears nowhere, both
engines" is a claim about computed style, not about a WebKit keyboard user.

### 2.8 What the phone actually does (better than the pass claimed, and still short).

My phone walk (393×699, chromium, `logs/crit-phone-chromium.json`) reaches 7 stops and the
token paints on the masthead links, `.logo-trigger`, `.drawer-tab` (the portrait-shut tongue,
box `[289,540,92,48]`, in viewport) and `.sun-moon-toggle` (ornament offset 12 px at this
viewport). That closes more of §2.4 than the pass's own logs did — the pass's only phone log
carrying the token is the **board ghost**, not a chrome outline. What is still unmeasured: the
dock sheet **open** (it slides; settle ~700 ms), and therefore the token's ground and clipping
on W2's landed sheet.

### 2.9 Small, real, undeclared.

- `HandwrittenLogo.vue:544`'s deletion also drops `border-radius: 0.35rem` from the focus
  state, while `GameCard.vue:436` keeps `border-radius: 0.5rem`. One idiom, one surviving
  bespoke geometry property, undeclared either way.
- `.info-btn`'s "17.78 / 14.31" is the washi tooltip focus reveals, not the ring — a
  painted-bytes diff counts every pixel focus changes, so any stop that reveals art returns a
  ratio that is not its ring's. The method needs an annulus mask before it can be a gate.
- `gameCell.css:246`'s `var(--color-focus-sketch, var(--color-crayon-blue))` fallback — the one
  R6 §4 names as unable to fire — survives the diff.

---

## 3 · The checklist, judged

- **gates that cannot fail** — MA-C (§2.3): the clearance guard scores the nominal cell box,
  which the rule's own painted band already crosses.
- **spec-cites-itself circularity** — `ringK` and G-ABS-2 (§2.4): the constant is fitted by the
  probe that then verifies it.
- **vacuous convergence / a rewording** — G-ABS-2 was born as "spread within 5% across the
  three boards", measured 6.1%, and is re-worded to "±5% of target" in the same return. A gate
  re-worded to pass is not a gate that passed.
- **the pixel it moves that it did not declare (π)** — the 150 ms outline-colour fade (§2.1),
  and the logo trigger's focus radius (§2.9). The π rect census is otherwise clean at 0.000 px.
- **the constraint it forgot** — §2.5's motion claim ("PRM identical", "outlines do not
  transition") against the measured transition; W2's dock sheet unmeasured.
- **unverified gestalt** — 16×16 is a soft lozenge in the pass's own crop while the family's
  memorable claim is "a visibly hand-drawn SQUARE"; `.staging-face` / `.guard-face` never
  screenshotted or read; the tongue's portrait-shut arc asserted (I measured its computed
  outline but not its painted arc under the paper).
- **record can't verify the record** — the mislabelled deck "head" arm (§2.6) and three
  comments the pass's own numbers contradict (§2.5).
- **elegant reduction / "and then the hard part"** — the two named cures for 16×16 (ring at
  0.86 × cellSize, stroke 7 → 5 at that size) are unpriced, and either moves MA-C's 0.233 px.
- **clear**: legacy aliases (nothing kept under a new name), masked fallbacks (the exemptions
  are named, not defaults), consumer-less substrate (`--focus-ring` has eight consumers on the
  walk I took), the generic default (the ink is the house crayon's ink tier, the offset is the
  tongue's own 3, the board is exempt — this is not the Tailwind ring), M16 (zero strings),
  filterBudget (9, unmoved), AA (every value ≥3:1 on both themes), law 23 (alias, zero hex).

---

## 4 · Strengths

1. A **running** prototype, ten product files, nothing committed, and every born-RED gate moved
   on the real surface rather than in the spec.
2. The cure **deletes**: one board-size branch, two bespoke focus rules, the `outline-ring/50`
   sweep, two false comments. Nothing new is mounted, no filter, no keyframe, no string.
3. The (0,1,0)-inside-`@layer base` authoring is the right call and it is *proved* — the
   (0,4,0) `:is()/:not()` sweep is shown to bury the toggle's ring to zero painted pixels.
4. The pass corrected its own spec's central table (ring÷grid) instead of confirming it, and
   the correction makes the law easier to satisfy.
5. The units-not-pixels amplitude law is the right abstraction: the ratio is viewport-invariant
   to 3 dp on desktop and phone, which is exactly what a units law should buy.
6. The dark arm closes a born-RED R6 finding (`--color-focus-sketch` had no dark arm) at the
   cost of zero hexes.

---

## 5 · Verdict

**ADVANCE.** No constraint is violated — AA holds on both themes, filterBudget is 9, M16 is
zero strings, π is 0.000 px on the numeric leaves, law 23 is honoured — so this is not RETIRE.
No missing primitive is as hard as the problem; every open item is a probe, a window, a
comment or a line — so this is not BLOCK. But the "one visible hand" does not yet hold at
16×16, does not yet arrive in one frame, and is unmeasured on three of the six surfaces it
rewrites — so this is not BANK either.
