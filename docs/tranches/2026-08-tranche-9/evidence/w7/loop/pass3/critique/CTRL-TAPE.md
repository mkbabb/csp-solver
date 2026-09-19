# T9-W7 · pass 3 · CRITIQUE · CTRL-TAPE — the taped case

Adversarial, non-author. Everything below that says MEASURED was run by me against the
prototype worktree `.claude/worktrees/wf_f72f3b5a-83a-27`, served on 127.0.0.1:**4246**, with a
read-only `74a2b5d9` control on 127.0.0.1:**4247** (the MAIN tree, `src` frozen for that office).
Both killed **by recorded PID** — never by a path prefix, which is the incident the lane
reported — and 4246/4247 read free at return. My instruments, logs and readings:
`evidence/w7/loop/pass3/critique/CTRL-TAPE/`.

**Convergence: 74%.** Verdict **ADVANCE**. The section's two pieces are built and, where I
re-ran them, they hold to two decimals in both engines. What refuses the remaining 26 is not
taste: **two gates in this diff are RED on this tree and I have the numbers**, and two guards
were never built at all.

## 0 · What I re-ran, and what it said

| row | who | result |
|---|---|---|
| §2.5b five offsets, rail 1440×900 + dock 390×844 | **me**, chromium + webkit | **4/4 PASS**. `worstBelow` −1.20/−2.25 (wk −1.24/−2.28), overlaps `[]` at every offset; the in-run negative control (pin band back to 20px) puts `new game` on `16×16` at **2452.5px²** (wk 2449.2) and `pencils` on `Corner` at 1801. The row the lane wrote and did not run is GREEN, and its born-RED fires. |
| `zone-grammar` whole file | **me**, both engines | **22 passed, 2 failed** — both failures the lane's own new row (below). |
| the seal, iPad coarse | **me**, both engines | **RED. 1303.44 chromium / 1303.31 webkit against `SEAL = 1283.5`** — +19.94 / +19.81, the chair's figure to the hundredth. |
| W2 §2.2 reachability @ 844×390 + 812×375 | **me**, both engines | **4/4 PASS**. Tab 48×92 at `belowFold −144.26` / −136.76; `deal` 215.28 below the fold but reachable in one cued gesture. The chair's §6.2 ask is met — by a row that already existed, not by one this diff wrote. |
| the confirm's face, 390×844 coarse, light + dark | **me**, both engines | **Reproduces the lane's numbers exactly**: ribbon 390.00 / row 390.00; `keep` 48.36×44 stroke 1.5 len 218.2; `clear` 51.36×44 stroke 2.5 len 224.2 → ink 327.3 / 560.5, **ratio 1.713**; card `rgb(253,253,252)` / `rgb(19,18,17)`. |
| AA, computed by me from the hexes | — | `#D02A52` on `#FDFDFC` = **4.990**; `#FF5C7C` on `#131211` = **6.303**; `#737373` = 4.660; `#A8A69F` = 7.678. Every token ratio in the spec is honest. |
| deck π vs `74a2b5d9`, with a **correct** selector | **me**, both engines | the out-of-card tapes are identical: `new game` **65.39×19.63 @ 14.384px** on both trees, `size`/`level` axis labels **48×19.69 @ 16.4px** on both. Band, first card and board rects `same` at 1440×900 and 390×844, deck and board routes, both engines. **π holds.** |
| `check-copy-register` | **me**, bare | exit **0**, 0 em dashes, **0 admitted**, 0 unadmitted, lexicon 25, 138 files. |
| `vitest src/games/shared src/pencil/sheet` | **me** | **35 files / 436 tests, all passed.** |
| `npx vite build` | **me** | **exit 0** — the tree builds; `dist/assets/index-D4MnozLqwvkG.js`. The lane never ran it. |

## 1 · The two measured REDs

### 1.1 The seal is broken by +19.94 / +19.81 and the stamp was not moved

The chair ruled (§6.1): *"the seal restamps by the measured +19.9 as a DECLARED delta in the
return (W2's row, cited)"*. The diff stamps `SEAL = 1283.5` — **pass 1's number** — and the
comment above it prices the card with pass 1's ablation table, citing
`evidence/w7/loop/pass1/prototype/CTRL-TAPE/readings/ablate.json` and the measurement
"1280.81 chromium / 1280.68 webkit". Pass 2 measured 1303.44 / 1303.31 against that bound. I
measured **1303.44 / 1303.31** again, on this tree, both engines. Nothing moved, in either
direction: the card did not shrink and the stamp did not rise. A shipped assertion that reds the
moment anyone runs it is worse than the gap the lane declared, because the lane's return calls it
"not re-measured" when it is in fact **measured RED at the value it ships**.

### 1.2 `no desk rung spends --sheet-chrome` fails in both engines — for two separate reasons

```
Error: the walk found no rule spending --sheet-chrome
expect(received).toBeGreaterThan(expected)   Expected: > 0   Received: 0
```
chromium and webkit, at `zone-grammar.spec.ts:465`. The row's own anti-vacuity guard is what
saved it, and it is the single best thing in the diff — but the row is red, and it is red twice.

**Cause A — the branch order.** `CSSStyleRule` implements `CSSGroupingRule` since CSS nesting, so
`"cssRules" in rule` is **true for every style rule** (I measured `styleRuleHasCssRules: true` in
both engines). The walk tests that branch *before* `rule instanceof CSSStyleRule`, so every style
rule is recursed into and none is ever examined. The `catch` beneath it says "a cross-origin sheet
cannot be walked" — a masked fallback that would have swallowed the error had there been one. With
the branch order reversed my probe finds the rules immediately
(`instruments/crit-sheetchrome2.mjs`).

**Cause B — and this one outlives the fix.** With the walk corrected there are **four** spenders,
identical in both engines, and the fourth is not under a `max-width` condition:

| selector | at-rule chain |
|---|---|
| `.scene-controls[data-v-bd4ba1ef]` | `@media (max-width: 1023.98px)` |
| `.controls-card[data-v-bd4ba1ef]` | `@media (max-width: 1023.98px)` |
| `.scene-controls[data-v-bd4ba1ef]` | `@media (max-width: 1023.98px) and (orientation: landscape) …` |
| **`:root, :host`** | **`CSSLayerBlockRule > CSSSupportsRule(((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and …))`** |

That fourth rule is **this lane's own `@property` block's down-level twin** — the build emits
`--masthead-foot: 0px; --case-offset: 0px; --sheet-chrome: 0px; --card-foot-h: 0px; …` at the root
for engines without `@property`. So the assertion as written contradicts the registration shipped
in the same diff. The row must either scope itself to *readers* (`var(--sheet-chrome)`) or exempt a
declaration whose value is the registered initial — and it must say which, because the choice is
the law's meaning.

There is a quieter consequence worth a line: that same emitted fallback means **`THE REGISTRATION
TOOK` cannot discriminate `@property` from the down-level block** on an engine where the `@supports`
condition matches. Both test engines fall outside it, so the row is honest today; it is one
browserslist move from being vacuous, and the row should read `getPropertyValue` *and*
`CSS.registeredProperty`-shaped evidence, or say in its comment why it does not.

## 2 · What the lane got right, and I could not shake

- **The foot on the inset, and the defect the row caught.** The `ResizeObserver` watching the BAR
  while publishing the FOOT, cured by adding the foot to the observed subjects *and* taking
  `box: "border-box"` — a content-box observation never fires on a padding change. That is the
  kind of finding a probe produces and a reading never does, and the arithmetic (+34.00 / −34.00 /
  0.00, six cells × two engines) is the chair's §6.3c condition paid in full.
- **The three defects the face's own rows caught in the lane's build** — the `HandDrawnOutline`
  with no `inset: 0` container painting nothing (so the weight ladder, the face's only non-colour
  channel, was absent); `@click="onClear()"` swallowing the event so `e.detail === 0` never
  discriminated a keyboard arm; Escape bound where it cannot be heard once the pressed control
  unmounts. Each was found by a row failing. This is the control group working.
- **The `--washi-tag-rung` amendment is real and I checked its evidence.** `r-rung-ring.json`
  banks `deckBefore` 14.384px / 65.39×19.63 → `deckAfter` **14px / 64.00×19.63** on the deck's own
  out-of-card tape. An absolute initial cannot stand for a viewport clamp; the name is rightly OUT.
  The spec was amended by a number.
- **`--type-option` at 20px is correct, and the lane under-claimed it** (see §3.3).
- **The merge watch is landed, not asserted.** `--pin-band` computes 43.8656px from one
  declaration with three readers (I read `padTop: 43.87` at every offset and both cells in the
  §2.5b run), and four `armed` refs plus four timers collapsed to one `askingAct` that is also the
  ribbon's prop. YES on both halves, with the diff to show for it.

## 3 · The findings the lane did not report

### 3.1 A §14 mechanic rides in this diff, unnamed by the spec, the plan and the return

`DrawerTab.vue` (+122) carries **THE QUICK SET (§14, M13)**: a `.tongue-strip` wrapper, a
`#quick-set` teleport berth under its own `HandDrawnOutline`, and a landscape-flank arm; and
`GameControlPanel.vue:909` teleports `.play-controls` to `"#quick-set"` on that flank. The spec is
§10's leader and its PLAN names seven steps, none of them `DrawerTab.vue`; the return's fifteen
measurements never mention it. The charter's fence is explicit — *"W2's mechanics are LANDED —
design the voice on top of them, never new mechanics"* — and a new berth on the landscape flank is
a mechanic. It also lands on **exactly the cell the chair told every §10 lane to assert**
(§6.2, 844×390). The row passes (I ran it) but it passes by the drawer tab, and nobody measured
what the strip does to the flank. Either it is declared and priced, or it comes out of §10's diff.

### 3.2 The π instrument reads the wrong tape — the conclusion survives, the instrument does not

`p3-pi.mjs:21` takes `document.querySelector(".washi-tag, .staging-axis-label")`, which on
`/?view=gallery` is **index 0: the controls card's own hidden tape** (`inCard: true`, box 0×0). So:

- "tape span **Δ 0.00**" compares **0 to 0** at all eight cells — vacuous;
- `tapeFont` in the lane's own banks **differs** at all eight cells (proto 25.888px vs head
  14.384 / 14.048 / 12.179 / 13.25) while the return says "**Δ 0.00** on every reading";
- `rungAblation` in `r-pi-proto.json` reads `before 25.888 → after 25.888, w 0, h 0` at every
  cell — the ablation measured **nothing**, and the numbers the README prints for it come from a
  different instrument (`r-rung-ring.json`, which is correct).

I re-read it with `:not(.controls-card)` and the deck is **identical on both trees** (§0). The
claim is true. The evidence banked for it is not. Re-point the selector and re-report.

### 3.3 The "dock ratio 1.618" gap is an instrument artifact, not a design gap

The return books "the spec's 1.2945 every cell holds on three of four; the dock is 1.618". It is
not the dock — it is the **probe's pointer**. `typography.css:176` has a
`@media (max-width: 767.98px) and (pointer: coarse)` arm at 20px. Measured by me at 390×844:

| context | `--type-option` | coarse | chip | name | ratio |
|---|---|---|---|---|---|
| no touch emulation | 1rem | false | 16px | 25.888px | 1.618 |
| `hasTouch: true` | **1.25rem** | true | **20px** | 25.888px | **1.2944** |
| `hasTouch` + `isMobile` | 1.25rem | true | 20px | 25.888px | 1.2944 |

chromium and webkit both. **The dock reads 1.2944 on a thumb.** The honest residue is smaller and
should be stated as what it is: a *fine* pointer at phone width (a narrowed desktop window) still
reads 1.618, so `typography.css:161`'s "the ratio is 1.2945 at EVERY cell" is an overclaim by one
cell, not by one regime.

### 3.4 Two shipped comments assert numbers the lane's own readings refute — and that is a class

- `index.css:~385`: *"the ring paints the tongue's dashed `currentColor` (4.59:1 at its worst on
  four painted grounds, measured)"*. The lane's own `r-rung-ring.json` reads the painted ring as
  `oklab(0.144521 …/0.5)` — 50% of `--color-foreground`, **not** `currentColor` (the 4×4 chip's own
  colour is `rgb(115,115,115)`), unattributable to any matched `outline` rule. The comment states a
  paint the lane measured as not happening. (The value itself clears the bar: the 50% mix against
  the card computes **3.70:1** light and **4.74:1** dark, over the 3:1 non-text floor — so the
  defect is the claim, not the ink.)
- `typography.css:161`: "the ratio is 1.2945 at EVERY cell" — §3.3.

Per the T2–T4 rule (*class invariant on the second occurrence*), this is the second occurrence in
one diff: **a comment in shipped source is a claim, and a claim whose own reading sits in this
lane's `readings/` must match it.** Worth a standing note in the fold.

### 3.5 The confirm's red frame is a three-channel design shipping as two-and-a-half

The spec: "the verb DRAWN 2.5 with `--color-red-ink` **word**". `.confirm-go { color: var(--color-red-ink) }`
and `HandDrawnOutline` strokes in `currentColor`, so the **frame is red too** — I measured
`frameStroke: rgb(208,42,82)` light / `rgb(255,92,124)` dark, both engines. The lane reports it as a
reading rather than smoothing it, which is right. But the consequence is not neutral: the red now
carries *the frame and the word*, which is the loudest thing on a bare card, and crop (2) shows a
boxed red `clear` beside a boxed white `keep` — two boxes, one red, at 14px. That reads closer to a
destructive *button* than to the case's weight ladder. Either the frame takes `--color-foreground`
explicitly (one line, and the ladder carries the rank alone), or the spec's sentence changes to say
the answer is red. It cannot stay as a reading.

### 3.6 Two gates whose greens are cheaper than they look

- **"ribbon ∩ the card's live controls 0.00"**: the ribbon *replaces* the verb row while the
  question stands (crop 2 — no verbs under it), so the intersection is 0 by construction. True,
  and close to unfalsifiable. The discriminating read is the one live control *outside* the row
  that a thumb can reach while the question stands; say which it is.
- **crop (3) does not show its claim.** Banked as "1440×900 rail at scrollTop 0.5, the pinned tape
  inside the band, first chip clear" and as the fresh-reader artifact for "which of these eight
  names are groups?" — the PNG is 346×260 of the `Hard` value and the deal box, with **no washi
  tape and no name in it**. The U-10 protocol cannot be run on it. Both `c1` crops also carry
  `FilterTuner`'s `fx` toggle sitting on `share`; DEV-only and shipped nowhere, but it is in the
  gestalt the owner would be shown.

## 4 · Constraints, checked

| constraint | verdict |
|---|---|
| **AA both themes** | **PASS** — computed: 4.990 / 6.303 / 4.660 / 7.678, all at or above their stated ratios. Ring 3.70 light / 4.74 dark ≥ 3:1 non-text. |
| **M16** | **PASS** — `check-copy-register` exit 0, **0 admitted**, run by me. Four new sentences, all plain, no em dashes, no metaphor. |
| **filterBudget 9** | **UNVERIFIED** — no filter census on a dist, by the lane or by me. `filterBudget.ts` reads 9 statically; the gate is an exact-match against the built artifact. The build now exists (I ran it, exit 0), so the census is one command away. |
| **goldens 4/4** | **UNVERIFIED**, same reason. No re-mint attempted — correct under §6.4. |
| **π on unclaimed surfaces** | **PASS**, re-measured by me with a correct selector (§0, §3.2). The `.section-heading` face narrowing is safe: `.staging-axis-label` is byte-identical on both trees. |
| **W2's landed mechanics** | **PASS** for sticky tag / dock / bottom tab / tap floor (44 on both dimensions, measured). **QUESTIONED** by §3.1 — a new berth is not "on top of" them. |
| **decided history (r0/R6)** | Lane ran the law-probe COPY: L1 = 9, L2–L6 GREEN, R3 MOVED. Not re-run by me; no r0 path was written (I checked — every write is under `pass3/`). |
| **the record is frozen** | **PASS** — nothing under `r0/` or an earlier pass dir was touched by either of us. |

## 5 · The checklist

- **masked fallbacks** — HIT: the `catch` under the `styleSheets` walk (§1.2 cause A) is a masked
  fallback whose comment names a case that is not the case it swallows.
- **gates that cannot fail** — HIT, twice: the ribbon's ∩-0 (§3.6), and `THE REGISTRATION TOOK`'s
  one-browserslist-move-from-vacuous shape (§1.2).
- **the pixel it moves that it did not declare** — HIT: `DrawerTab.vue`'s quick set (§3.1).
- **spec-cites-itself circularity** — HIT: the seal's comment prices this tree from pass 1's
  `ablate.json` and pass 1's measurement, on a tree where the number is 22.6px larger (§1.1).
- **unverified gestalt** — HIT: crop (3) does not show the pin band it is captioned with, and the
  fresh-reader protocol that depends on it was not run (§3.6).
- **the elegant-reduction trap** — NOT HIT. The reductions here (four timers → one `askingAct`,
  two publishers → one `--pin-band`) are landed, and each has a reading.
- **legacy aliases / consumer-less substrate** — NOT HIT, and actively cured: `MOTION.inkLiftMs`
  deleted for having zero importers, `--ring-ink`'s duplicate mint struck, `headingClass` deleted
  with its two inks. The lane's refusal to re-point the 150ms literal at a rung nothing publishes
  is the right call, and it says so.
- **the generic default** — NOT HIT. Patrick Hand at 25.888 on neutral washi, a weight ladder for
  rank, no eyebrow caps, no cards, no arrows.
- **the constraint it forgot** — HIT: filterBudget and goldens were never exercised (§4).

## 6 · For the adjudicator, in order

1. **The seal, measured RED at 1303.44 / 1303.31 against the 1283.5 it ships.** The chair's §6.1
   already says how to pay it: restamp by the measured delta, declared, W2's row cited. The lever
   stays refused. This is the single item standing between this family and the low 90s.
2. **The `--sheet-chrome` row's two causes** (§1.2) — the branch order is a five-line fix; the
   `:root, :host` spender is a decision about what the law means.
3. **The quick set** (§3.1) — declare and price it, or take it out of §10's diff.
4. **The red frame** (§3.5) — one line either way, but the spec and the paint must agree.
5. Run the build's two guards and the I2/I3/I4 triple; re-point `p3-pi.mjs`'s tape selector;
   re-cut crop (3) so the fresh reader can be asked the question it was banked for.
