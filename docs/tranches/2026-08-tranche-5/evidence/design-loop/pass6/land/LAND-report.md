# PASS 6 · THE LAND LANE — the apotheosis on the tree

**Base** `abe533c4` (T5-W4 PASS 5 SEALED), MAIN tree, no git state changed.
**Artifacts** base dist `index-BNMQu01IbxTY.js` (served :4231) · head dist
`index-Cwxgaa3tBBf6.js` (served :4232). Both banked under `rig/dist-base`, `rig/dist-head`.
**Ports** 4231/4232 only, inside the assigned 4230–4260; `:3000` never touched (every e2e run
carries `PLAYWRIGHT_BASE_URL`). Servers killed at close.
**U-10 governs every sentence below: nothing here closes mark 3, 5 or 6.** What landed is the
work and the evidence; every mark stays conditional on the owner's re-look.

---

## 1 · THE COVIS GATE — born RED, then green

The row: `e2e/board-covisibility.spec.ts`, *"the case: at 390x664 the page is one viewport, and
the play verbs are in it"*. It asserts `pageVh ≤ 1.000` and `maxScroll === 0` at the shortest
live portrait cell, plus that the four play verbs are IN the fold and each clears 44px on both
axes.

| arm | chromium | webkit | log |
|---|---:|---:|---|
| **BORN RED** — `abe533c4`'s own built dist | **1.705** | **1.703** | `logs/covis-gate-BORN-RED.log` |
| **GREEN** — head | **1.000** | **1.000** | `logs/covis-gate-HEAD.log` (16/16) |

The red arm is the number pass 5 banked, reproduced rather than quoted. The gate carries two
controls in-run and they watch opposite directions: a 300px in-flow block must push the read
over the bound (a probe that cannot count a scroll would score anything green), and striking the
verbs band must empty it (a "cure" that parks the controls out of reach cannot pass here).

**The rig's base arm reproduces pass 5's banked nine cells exactly, both engines, before any
head figure was read** — `logs/fold-BASE-{chromium,webkit}.log`: 1.705 · 1.341 · 1.401 · 1.258 ·
1.212 · 2.882 · 1.013 · 1.000 · 1.177 (chromium), and pass 5's webkit column likewise.

### The nine cells at head (`logs/fold-HEAD-final.log`, `rig/out-fold-HEAD-*.json`)

| cell | base c/w | head c/w | disposition |
|---|---:|---:|---|
| **390×664 THE CASE** | 1.705 / 1.703 | **1.000 / 1.000** | the gate |
| 390×844 · 375×812 · 430×932 · 820×1180 | 1.341 / 1.401 / 1.258 / 1.212 | **1.000** each | maxScroll 0 |
| **844×390 landscape** | 2.882 / 2.882 | **2.631 / 2.631** | the MASTHEAD MOVE, §2 — the drawer-land alone held **2.882 identical**, measured before it (`logs/fold-HEAD-draweronly-*.log`) |
| 1280×800 · 1440×900 rails | 1.013/1.011 · 1.000/1.000 | **unchanged** | geometry identity proven field-by-field, both engines |
| 390×844 fine NEG-CTRL | 1.177 / 1.175 | **1.000** | **moves by design**, disclosed: the regime is width+orientation, not pointer |

Rail and landscape identity is asserted on the measured ledger, not on a screenshot hash: every
one of `pageVh · docScrollH · board.top · shellH · squareH · squareW · band.rectH ·
controlsTop/H/Bottom · chromeAboveBoard` is field-identical base→head at 844×390 (pre-masthead),
1280×800 and 1440×900, both engines. Screenshot hashes could not carry this claim — the board is
randomly dealt per load.

### Fold census at the case cell, head, both engines

masthead ends **132.22** chromium / **131.63** webkit · board **362×362** whole · reserved line
**21px** in flow · verbs band `#fold-tools` **55.75px** with every target ≥44 on both axes
(undo/redo/hint 44×50.16, peek chip 56.36×44) · tongue **92×48** at 616→664, clearing the
masthead · `docScrollH ≡ innerHeight`.

**Open state:** sheet top **216** (masthead whole, the top grid rows peek), interior scroll
**55px** — the price the cap derivation named, at the shortest cell only — and the board's rect
is **identical across the whole gesture**: `{x:14, y:132.22, w:362, h:362}` before, open and
after (webkit `y:131.63`, likewise identical). The no-relayout claim is written as a rect
identity, not as a phrase.

---

## 2 · THE MASTHEAD MOVE — the lead's landscape ratification, paid

`logs/masthead-move.log`, `rig/out-mast-{BASE,HEAD}-*.json`. Referent named at every figure,
because the record carried three numbers for one quantity for a whole pass.

| 844×390 | BASE chromium | BASE webkit | HEAD chromium | HEAD webkit |
|---|---:|---:|---:|---:|
| fold overflow, `.board-wrapper` (the drawn frame) | **88.58** | **87.98** | **0** | **0** |
| fold overflow, `.board-cells` | 86.58 | 85.98 | 0 | 0 |
| fold overflow, `.board-shell` | 119.06 | 118.44 | 20.48 | 20.45 |
| chrome above the board | 114.58 | 113.98 | **16** | **16** |
| masthead box | 349.67 × 98.58 | 348.14 × 97.98 | 155.66 × 41.80 | 154.6 × 41.4 |
| **whole board above the fold** | false | false | **TRUE** | **TRUE** |
| **cell width (the ratified rung)** | 40.22 | 40.22 | **40.22** | **40.22** |
| pageVh | 2.882 | 2.882 | 2.631 | 2.631 |

**The base arm reproduces pass 5's F3-G2 re-derivation to the hundredth on both engines** —
88.58 / 87.98 at `.board-wrapper` — and does NOT reproduce the pass-4 registry's 90.58 / 89.98
at any of the three boxes. That number is re-verified as wrong for the third time; the referent
is now named in the shipped comment, in the gate and in this table.

**The move, and why it is a move rather than a shrink.** A landscape phone is wide and short:
the board takes 366 of 844 and the gutters do nothing. The wordmark docks into the left gutter,
vertically centred against the board — the DESK's own grammar, read in the one orientation with
width to spare. `--logo-scale` is the estate's existing knob (already 1.05 for the closed-desk
pose), and the value is derived: the room is `.board-group` at x 86 to `.board-wrapper` at x 239
= **153px**, so the scale that fits 141 of gap-adjusted room is `0.68 × 141 / 249.52 = 0.384`
→ **0.38**, landing 155.66 × 41.80 with the board's left edge clear.

**A correction this lane made against itself, by a shot.** The first cut took the gutter as half
the viewport (239) rather than the page gutter to the board's edge (153), scaled to 0.68, and
the wordmark lay across four columns of the grid. Nothing numeric caught it — `overflow 0`,
`cellW 40.22` and `wholeAboveFold true` all read correct with the wordmark on top of the board.
The DELTA crop caught it. That is the campaign's proxy≠surface family once more, on this lane's
own work, and it is recorded rather than smoothed.

**pageVh at this cell moves 2.882 → 2.631 and that movement is the charter's, not a leak.** The
drawer-land alone held landscape byte-identical at 2.882 (banked, both engines, before the
masthead touched the tree). The lead ratified the shipped RUNG — the cap, the cell, the 40.22 —
and chartered the masthead separately; the rung is untouched to the hundredth, the masthead's
own vertical spend is what moved.

**CH-39's owner eye remains this row's closure leg.** Two headless engines agreeing that a board
is whole above a 390px fold is geometry, not glass; there are still ZERO on-device landscape
cells. Nothing here closes CH-39.

---

## 3 · dt-name — DISPOSED, and the root with it

The adjudicator's bound: route a REAL technique name to an existing visible surface at zero new
chrome, or remove `TallyDescriptor.name`+`.expand` with the alternatives priced. Parsimony rules;
no new standing surface. **Both halves land, because doing the first made the second mandatory.**

F3-G3's measurement, re-read at citation: the estate ran TWO vocabularies — `GRADE_PHRASE`
bucketed the tier ("singles only" for BOTH single rungs) and `TECHNIQUE_NAME` held the step —
and every surface a reader could reach was built from the bucket.

**What landed.** `GRADE_PHRASE` is DELETED. `formatGradeSignature` now composes from
`TECHNIQUE_NAME` plus a per-technique article, so there is one vocabulary where there were two —
the root the defect grew from, not its symptom. **Zero new pixels**: the margin's reserved line
was already drawn and already read on every deal. Measured on the built dist at 390×664
(~~`shots/case-390x664-AFTER-*.png`~~ — **CORRECTED at pass 7, L6-G3: those files were never
banked in this lane's `shots/`, which holds `case-fold-band-*` and `case-open-seam-*` only.
The shot now exists and is banked one pass along: `pass7/F3/shots/case-390x664-AFTER-{chromium,
webkit}.png`, with the legible crop `case-390x664-dtname-crop-*.png` and the strings recorded
beside the pixels in `pass7/F3/logs/dtname-strings.json`. The measurement below was always
sound — the pass-6 audit re-derived it independently on the live head dist — so what is
corrected is the citation, not the finding**): the line reads
**`a fresh 9×9 — needs a naked single`** where it read `a fresh 9×9 — singles only`, and the
tally's `aria-label` reads **`difficulty — needs a naked single (1 of 5)`** where it read
`difficulty — singles only (1 of 5)`.

> **Pass-7 restamp, same row.** This paragraph originally quoted the tally as
> `difficulty — needs a hidden single (1 of 5)`. **The deal is random per load and the
> technique tracks it**, so the tally's step is a per-deal value and no single phrase can be
> quoted as though it were fixed. Both the pass-6 audit and the pass-7 bank drew a
> naked-single board and read `difficulty — needs a naked single (1 of 5)` on both engines.
> The claim the row actually makes is the INVARIANT, and it is the one the unit rows gate:
> the margin line and the tally's `aria-label` name **the same exact step as each other**,
> from one vocabulary, whatever the deal. **Seven of the nine phrases come out byte-identical** to the hand-written table they
replace; the two that change are exactly the two the bucket conflated — asserted as an
inequality as well as two equalities, so a cure that renamed both to one new word would still red.

**`TallyDescriptor.name` and `.expand` are retired on their own written trigger** ("if the exact
step gets its surface, `name`, `expand` and the five rows retire in that same change"), with
`formatTechniqueName` — the accessor for a field with no renderer — retired with them. The
alternatives are priced in one paragraph at the deletion site: (a) restore the hover, rejected
on arithmetic at −103.53px of verb clearance and a hover grammar besides; (b) a second permanent
line, ≈17px at every width, spending the exact currency the covis row was short of; (c) the
margin voice, TAKEN, zero pixels and no standing surface; (d) tap-to-reveal, which re-mints the
tab stop a11y r1 L12 had just retired.

---

## 4 · WHAT LANDED — the estate change

| file | what |
|---|---|
| `games/shared/GameScene.vue` | stacked twin DELETED; `#controls-drawer` unconditional; `#fold-tools` + `#drawer-handle` berths minted; the tongue teleports to the CASE on the dock; `inert` splits by regime |
| `games/shared/scene.css` | three poses of ONE drawer — rail (byte-untouched), portrait fixed sheet (`top: var(--vv-height)`, rest on `translate:`, cap `calc(100dvh − 12rem)`), landscape in-flow static; `.controls-card`'s cap scoped to the row regime where its own comment always said it belonged; `.mobile-board-width` deleted |
| `games/shared/DrawerTab.vue` | portrait axis-swap 48×92 → 92×48, same word, same ARIA pair, positive z (the desk's `−1` is the tuck's fiction and has no meaning on the dock) |
| `games/shared/useControlsDrawer.ts` | the `≥1024` early-return replaced by a three-posed regime rule; **portrait always lands closed** and never writes the desk's key; a crossing watcher parks a desk-open non-persistently; **every host-derived mover gated on the host actually moving** |
| `games/shared/useKeyboardViewport.ts` | the standing trigger FIRED — `--vv-height` published in the same handler, vars before `ensureVisible`, clamped to the layout viewport |
| `games/shared/GameControlPanel.vue` | `<Teleport defer to="#fold-tools" :disabled="!portraitDock">` around the play verbs; the **peek chip**; the divider's portrait stand-down + one-string label |
| `App.vue` | the masthead move (§2) |
| `assets/index.css` | print list `.mobile-board-width` → `.fold-tools` |
| `games/shared/techniqueVoice.ts` + `DifficultyTally.vue` | dt-name (§3) |

**Diff:** src +777 / −251, tests +465 / −88 across 25 files. No new component, no new
composable, no new curve, no new persisted key, no new live filter.

**Two mechanism notes that were found by reds, not by reading.**
`defer` on the fold-tools Teleport is load-bearing — the berth is minted later in `GameScene`'s
own template, so without it the target resolves null and the play tools leave the tree; six unit
rows red, and two of them (fill-forced, the fine-pointer Clear) never touch a play verb — the
render crashed downstream. `--vv-height` needed clamping to the layout viewport, and the
emulated-keypad row is what found it: a stand-in `visualViewport` reported 1669 against a 664
layout and the sheet went with it. `--keyboard-inset` was immune by its own `Math.max(0, …)`,
which is why nothing had reddened before there was a second consumer.

---

## 5 · DRAWER-OPEN COST — measured on the rig method, before and after

`rig/opencost.mjs` is lane BC's `stall6.mjs` verbatim with three parameters opened (viewport,
regime guard, which tongue it drives) — same instrument, same statistics, same pose census, same
π byte-identity comparison — so these numbers and BC's sit in one column. **Measured against
whatever is on the tree: BC landed +0 product code here and `web/frontend/package.json` still
reads `^0.11.0`**, so both arms are 0.11.0. WebKit, DPR 2, 2 reps × 3 gestures.

| arm | bakes | encodes (`toBlob`) | revokes | blocked600 ms | capture box |
|---|---:|---:|---:|---|---|
| **DESK before** (:4231, 1280×810) | 8 / gesture | 8 | 16 | 268.3 – 346 | 666→650 |
| **DESK after** (:4232, same) | 8 / gesture | 8 | 16 | 274 – 302.1 | 666→650 |
| **PORTRAIT DOCK after** (390×664) | **0** | **0** | **0** | **0, every gesture** | **366×393 → 366×393, unmoved** |

**The desk control arm is unmoved in both directions** — identical bake/encode/revoke counts,
identical total pose bytes (1,156,004), overlapping blocked600 ranges. A desk number that had
IMPROVED would have been as much a finding as one that regressed; neither happened. CH-61 stays
lane BC's chartered row, not worsened and not claimed, and the desk arm should re-run once the
lead sequences BC's 0.12.0 election.

**The dock's zero is structural, and the rig is what checks it rather than asserts it:** the
board's re-fit rules are `≥1024`-scoped, so a portrait open moves no capture box — and a capture
box that does not move is a bake that does not happen. `logs/opencost-*.log`,
`runs/oc-*.jsonl`. **There is no BEFORE arm for the dock and the log says so** rather than
inventing one: on `abe533c4` no tongue exists below 1024.

Harness limit, kept from BC because pass 5 made it load-bearing: Playwright's WebKit, not real
Safari. Absolute milliseconds do not transfer; the counts and the within-session deltas do.

---

## 6 · FLOORS, BATTERIES, π, DELTA

| gate | result | log |
|---|---|---|
| **a11y.spec.ts** (W3 floor: 3.2 guardTitle · 3.3 options 5/5 · 3.4 k-peek) | **30/30 both engines** | `logs/floors-final.log` |
| **zone-grammar.spec.ts** | **20/20** | `logs/floors-final.log` |
| **built-dist lane, all six projects** (filter-census ×2, wordmark-integrity, theme-bake ×2, throttled-void) | **39/39** | `logs/built-dist-lane.log`, `logs/floors-final.log` |
| **vitest full** | **445/445, 41 files** | `logs/vitest.log` |
| **default e2e, both engines** | **278/279** — the one red is `affordances.spec.ts:155` webkit, the estate's known contention flake, which passes 20/20 re-run alone on the same dist | `logs/e2e-HEAD-final.log`, `logs/e2e-affordances-flake-recheck.log` |
| **covis spec** | **16/16** | `logs/covis-gate-HEAD.log` |
| vue-tsc · prettier · eslint · lint:boundary · knip · ink · catch · tdz | **all PASS** | `logs/gates-estate.log` |

**π — NOTHING RE-BASELINED.** `goldens 4/4` and `golden:bytes` PASS at head, and
`git status --porcelain e2e/goldens/` is **empty**: not one golden byte moved. No golden was
minted. Disclosed honestly: in one batched sweep run back-to-back with the throttle lane's 39
tests, the logo golden red once and left no diff artifact; it then passed 4/4 on three
consecutive isolated runs and again serially in the banked log. It was NOT re-baselined and the
red is recorded rather than erased (`logs/goldens.log`).

**DELTA — 14 crops, both engines, DPR 1, at rest, largest 61,019 B against a 150 KB ceiling,
457,263 B in total.** `shots/`: the case's FOLD BAND before/after, the case OPEN at the sheet's
seam (after only — there is no such pose before, and the rig parks rather than fakes it),
landscape before/after, the 1280 rail band before/after.

**They are cropped to the pixels under audit, and the first cut was not.** The whole-viewport
version came to 1.1 MB and put the design-loop wave over its 2 MB band —
`scripts/check-evidence-policy.mjs` FAILED on it, which is the gate lane D grew this pass doing
exactly its job on this lane's own evidence. The recrop is the policy's own instruction
("text-first for anything a number can state"): the whole-page claims those cuts carried ARE
numbers — `docScrollH ≡ innerHeight`, `maxScroll 0`, the fold census, the field-by-field
geometry identity — and they are stated as numbers in §1. What a number cannot state is what
these bands hold. The policy check now reads **PASS — every image, every wave and every banked
dist within policy**, with both dists banked as `.tar.gz` + md5 (`rig/dist-{base,head}.tar.gz`,
`.md5` beside each) rather than as loose directories.

---

## 7 · THE TEST ESTATE'S RE-CUTS — every one definitional, each named

- `drawer.spec.ts:281` — the old row asserted a world (*"<1024: no tab, stacked panel in flow"*)
  that is now half RATIFIED and half gone. Split in two: a LANDSCAPE row that keeps the claim
  verbatim in meaning and carries the orientation-guard ablation as its control, and a PORTRAIT
  row (tongue tappable, sheet fixed, case inert+hidden at rest, board rect identical across the
  gesture, always lands closed, a persisted-open desk choice does not carry the crossing). Both
  born RED on `abe533c4`: below 1024 no tongue exists there.
- `mobile-platform.spec.ts:307` — the metric moves from doc-growth to *the control seats clear of
  the 296px band at `scrollY 0`*, because the mechanism it measured no longer exists (the page
  does not scroll). The RED arm is the charter's own ablation: `bottom: 0` in place of the
  anchor strands the deepest chip with no scroll to redeem it. Both vars are gated in one read.
- `board-covisibility.spec.ts` — the celebration row's in-flow witness swaps from
  `.mobile-board-width` to `#fold-tools` (same office, the surface that is still in flow below
  the board). Its `docGrowth` control arm is now CLAMPED by the fold — a page that is exactly
  one viewport absorbs the first `innerHeight − content` px of anything arriving in flow — so
  that arm drops to a floor of `> 0` (measured 41 against 109 of real push) while `ctrlPush`
  keeps its meaning and its magnitude unchanged. Written down, not quietly re-cut.
- `font-census.spec.ts:207` — the phone arm OPENS the drawer. Unopened, the census reads the
  fold alone and the BACKWARD direction retires every ledger row the card owns as stale.
- `zone-grammar` (3 rows), `mobile-affordances` (4), `visual-regression` (2) — selector swap to
  the one card, plus `openCard`/`openDrawer` where the row probes a between-moves control. The
  play-tools rows move to `#fold-tools`, which is an assertion and not a relocation: they must
  be reachable with the sheet SHUT.
- `GameControlPanel.test.ts` — the berth is minted in `mountPanel` and the verbs are read FROM
  it; a wrapper query would have stopped watching the thing the row is for. One row added: the
  peek chip's visible word IS its accessible name (no `aria-label` to drift from the ink).
- `mobile-affordances`' peek row asserts BOTH halves — the chip exists and clears 44px on both
  axes, AND the divider takes no pointer events and its label carries no hold promise.

---

## 8 · RISKS AND DISCLOSURES, carried up, none smoothed

1. **The mode** (the apotheosis's R1, the owner's call): the open sheet leaves ~84px of grid and
   the board cannot be touched while it is up. The defence is measured, not asserted — the fold
   keeps board, status line and all four play verbs, so *playing* never needs the sheet. The cap
   is a taste the owner may re-cut without reopening the row: pageVh is 1.000 at every rung.
2. **The AX tree below 1024 gains the named `controls` region at rest, holding one button.**
   Disclosed, the owner's to accept.
3. **The fine-portrait NEG-CTRL cell moves by design** (1.177 → 1.000): the regime is width +
   orientation, not pointer, so a narrow fine window folds with a tongue-only band.
4. **No OS keyboard has ever risen against this tree.** The keypad row is CHARACTERIZED on a
   driven fake visual viewport; the 0-bake claim on the dock is structural. Real Safari has seen
   neither arm — E8 and CH-39 stay the closure legs.
5. **Rotation on a real device** (persisted-pose parking across a live orientation flip) is
   sim-only; the watcher is unit-visible and e2e-visible, not device-visible.
6. **The masthead's landscape scale (0.38) has been seen by two headless engines and by this
   lane's eye, never on glass.** It is a taste the owner may re-cut; the derivation is written at
   the rule so a re-cut does not have to re-find the gutter.
7. **`affordances.spec.ts:155` webkit** stays flake-classed, not absorbed — 20/20 alone.
8. **BC6-G1** (the wordmark's 2-device-pixel key jitter) is untouched by this lane and still the
   lead's to route; it is visible in the desk arm's 16 revokes per gesture.

**U-10, verbatim and last: nothing in this lane's work closes mark 3, mark 5 or mark 6.** The
mobile arm the sheet now hosts is pass 5's cure, which the owner has not re-marked; the drawer
came down to portrait and the number the price sheet named is on the tree; every mark stays
conditional on the owner's re-look, and the wave record quotes the owner's words per mark at
closure.
