# CTRL-TAPE · pass-5 adversarial critique (§10 controls: the tape, the band, the foot)

The pass-5 critic wrote neither the charter nor the prototype. Every number here that isn't credited to the lane
was taken by the critic on 2026-09-22, in chromium and webkit, on the critic's own servers.

**The rig.**

- **Proto.** The critic built the work tree `wf_f72f3b5a-83a-27` itself, with the build config and `outDir` outside the tree and a private cacheDir. It reproduced the lane's final identity **`index-T6edeNHCmbrz.js`**. Served by `vite preview` on **:4232**.
- **Control.** The shared `w7-control` dist, `index-CubiZsMVSwTc.js` (`74a2b5d9`), served on **:4233**.
- **Identity.** Both ports were verified by asset hash, and both arms are prod builds.
- **Payload.** Every browser row dealt `?board=ATMuNTA4…MDAw` (PINNED_GIVENS), and the givens read back `0:5,2:8,11:3,18:6,20:9` on every arm.
- **Clean-up.** The servers were killed by recorded PID (48677, 48679 and the npx parents 48622, 48623). The scratch PW config `.ctrl-tape-critic/` was deleted.
- **The tree afterwards.** `git status` shows product files only, still 24 files +2548/−674 plus the two untracked files. Nothing was committed, and the control tree was never edited or built.

Instruments are in `critique/CTRL-TAPE/instruments/` and the summarised readings in `readings/critic-readings.txt`. No
frame is banked. The family's crop cap is spent on the lane's three replacements, which I looked at.

**Verdict: ADVANCE. Convergence 81% (up from 78).**

- **What pass 5 did.** It closed the pass-4 critic's flagship red. On this tree W2 §2.5 now holds at **0 of 101 scroll poses** in both engines at both cells, where HEAD carries the class at **48/101** (rail) and **10–11/101** (dock). M18's edge is landed in the house hand, and the foot provably stands on a REAL inset.
- **What holds the number down:**
  - the only CI witness of the edge (`check-tape-foot`) goes GREEN on **7 of 8** real breaks;
  - an undeclared regression hangs keyboard notes **12–33 css outside the case** at iPad-class coarse ≥1024;
  - the clipped wells' side strokes fuse into the lip's top stroke with **0 css** of daylight at every offset but the scroll end;
  - the charter's COST graft rows are mostly unlanded;
  - a long tail of declared-open rows remains.

---

## 0 · What I re-ran myself

| row | lane's claim | critic, both engines | verdict |
|---|---|---|---|
| **viewport-law, whole file**, final dist | 28/32 on the PRE-slab build `CtiSx`; 4 reds = §2.6 | **28 passed / 4 failed, EXIT 1** on the FINAL `T6edeNHCmbrz`. The four reds are §2.6 × {rail 1440×900, drawer 375×667} × 2 engines | reproduced; the lane's viewport-law run was on the wrong dist, and now it isn't |
| §2.5 clipped + NEG-1 | clipped `[]`, unclipped 1486.9/1486.2 | clipped `[]`; unclipped `pencils × Clear the board` **1486.9 / 1486.2**, `× Fill` **688.8 / 689.5** | to the tenth |
| §2.5b + NEG + NEG-2 | forgiven 3279.4, below −1.2; NEG 22.66; NEG-2 22.8 | forgiven `new game × 9×9` **3279.4 / 3279.3**, below **−1.2 / −1.24**; NEG **22.66 / 22.62**; NEG-2 **22.8 / 22.76** | reproduced |
| zone-grammar, whole file, final dist | 30/30 | **30 passed, EXIT 0** | reproduced |
| access, whole file | 14/14 on **dev** `?wire=local` | **14 passed, EXIT 0** on the **dist** | reproduced, stronger rig |
| M18 lip at 390×844 hasTouch, dark and light | coverage 1.00; NEG 0.00; 0 border | my own differential: top-side coverage **1.000** on proto in both themes and both engines; **0.000** with `.card-foot` unpositioned (NEG). Max border in the bar's subtree **0**; bar background `rgba(0,0,0,0)` (the slab is dead). Control: 0 lip paths, slab `rgb(19,18,17)` dark / `rgb(253,253,252)` light | reproduced |
| foot pad computed at 390×844 hasTouch | 12px | **12px**, `relative/45`, in both engines | reproduced |
| **the inset arm, which the lane called unmeasurable** ("Playwright resolves env() to 0") | — | chromium CDP `Emulation.setSafeAreaInsetsOverride {bottom: 34}` makes `env()` read **34**:<br>• foot `padding-bottom` **34px**<br>• the bar rises 832 → **810**, verbs' bottoms 829.61 → **807.61**<br>• the case still ends at 844 = innerHeight, so the pass-3 overflow (verbs 9.77 below the viewport) does NOT recur<br>Control under the same inset: verbs at **835.61**, i.e. 25.6 css inside the home-indicator band | **new, closes gap 20 for chromium** |
| π, prod-vs-prod, 3 cells × 2 engines | board, cell and wordmark identical | board and wordmark rect + paint **identical** at rail1440, dock390 and land844. Case: dock h 628 → 590.77 (declared); rail webkit h −0.02 (declared). **The drawer tab at 844×390: y 166.59 → 245.74 / 245.64 (+79.1)**, not in pass 5's π table (see §3.6) | holds, one row unlisted |
| filterBudget | filter-census 12/12 | computed `filter ≠ none` **25 = 25** and SVG `<filter>` **15 = 15**, proto vs control, every cell, both engines: unmoved | holds |
| M16 | check-copy-register 0 | `check-copy-register` bare **0** (0 em/en dashes, 0 unadmitted) | holds |
| static battery | all 0 | `lint:lanes` **0**, `lint:theme-tokens` **0**, `lint:sleep` **0**, `test:e2e:projects` **0** (34 specs / 561), `lint:tape-foot` **0**, `eslint .` **0**, `npm run lint` (the scoped prettier) **0**, vitest `src/games/shared` **34 files / 429 tests** | reproduced |

---

## 1 · The gate that cannot fail: `check-tape-foot` goes GREEN on 7 of 8 breaks

CI is browserless (O-12). This script is therefore the ONLY thing in CI that holds T9-M18's edge, the inset and the
slab's death; the e2e rows that read paint are local instruments. I imported its exported `check()` and fed it
in-memory copies of the three files it reads (the tree untouched):

| break (a real regression, one line each) | gate | what the regression does on screen |
|---|---|---|
| B1 `max(0rem, env(safe-area-inset-bottom))` | **GREEN** | the foot's stroke lies on the viewport edge on every flat phone. The lane's own pad sweep: 0.5rem already gave 0–0.5 css |
| B2 `.bar-frame { visibility: hidden }` | **GREEN** | the owner's edge is gone |
| B3 `v-if="false"` on the lip's `<HandDrawnOutline>` | **GREEN** | the owner's edge is gone |
| B4 `.action-bar { border-block-start: 2.5px solid }` | **GREEN** | a CSS border, the exact L5 fault RULE was struck for, in its logical spelling |
| B5 `.action-bar { box-shadow: inset 0 2px 0 currentColor }` | **GREEN** | a CSS-drawn rule, same class |
| B6 `.card-foot { z-index: 0 }` | RED (clause 2) | — |
| B7 `.action-bar { background-image: linear-gradient(var(--color-card) …) }` | **GREEN** | the slab is back |
| B8 `.bar-frame :deep(path) { stroke-width: 0 }` | **GREEN** | the edge has no ink |

Its `--self-test` passes (8 plants red, live green), and that proves only that each plant was keyed on one literal
the gate already knew. Clause 3 compares the lip's four props to the wells', but that holds the SHAPE of a
declaration, not the existence of ink. Clause 4's regex covers `border(-top|-right|-bottom|-left)?(-width)?` and
`background`/`background-color` only. Clause 1 checks for `max(…env(…))` and never reads the pad, which the lane's
own comment calls the number that is "READ, NOT CHOSEN".

Per registry §2.10 the gate is struck until it is re-cut, and each clause must ship with the break above that reds it
(B1–B5, B7, B8 as self-test plants), in the same batch:

- **clause 1** holds the pad's value as ≥ the swept floor (0.75rem dock / 1.125rem landscape);
- **clause 3** reds on `visibility|display|opacity|v-if` on the lip, and on a stroke override;
- **clause 4** covers `border-(block|inline)(-start|-end)?`, `box-shadow`, `outline`, `background-image` and the shorthand `border` with a width.

**The same hole is in the chair's r0 R3** (`/\bborder(?:-(?:top|right|bottom|left))?(?:-width)?/`): B4 greens R3
too. This is cross-pollination for the chair and not a lane edit, since the file is frozen.

---

## 2 · The regression the return does not contain: keyboard notes fall out of the case at coarse ≥1024

Pass 5 moved the note berth into the foot and narrowed it: `max(3.5rem, env())` now applies only under
`(min-width:1024px) and (hover:hover) and (pointer:fine)`. The notes themselves did not narrow:

- they MOUNT on the row regime (`v-if="!mobile"`, any pointer);
- they REVEAL on `.group:focus-visible` (any pointer).

At iPad-class coarse 1280×800 the berth is therefore 12px, and a keyboard-focused verb's note hangs far past it.
Measured by focus-visible on each foot verb, notes at opacity 1:

| cell | arm | note bottom − foot bottom | note bottom − **case** bottom | what is under the note's centre |
|---|---|---|---|---|
| coarse 1280×800 | **proto**, chromium | +17.30 / +37.26 / +16.26 | **+13.30 / +33.25 / +12.26** | `DIV.app-layout` (the page, outside the case) |
| coarse 1280×800 | **proto**, webkit | +17.39 / +37.26 / +16.28 | **+13.39 / +33.26 / +12.28** | `DIV.app-layout` |
| coarse 1280×800 | control `74a2b5d9` | — | **−24.31 / −4.35** chromium, **−41.22 / −21.35** webkit | inside the case |
| fine 1440×900 and 1024×768 | proto, both engines | −26.1 … −5.7 | inside | `DIV.card-foot` (the berth works) |

Pass 4 kept the berth under `@media (min-width: 1024px)` with any pointer, so this is new in pass 5 and not declared.
Registry law: "a regime is keyed on the space the surface has". Here the berth, the mount and the reveal are keyed
on three different predicates. The cure is one line: key the berth on the mount's regime, or refuse the reveal where
there is no berth. Either way, a coarse-≥1024 row belongs in the M18 describe.

**Also measured, intake row 21 (the lane left it open).** At fine 1440/1024 every verb's note straddles the lip's
bottom stroke. The note tops sit at 756.05–757.11 against a stroke centre of ~762.2, so the stroke runs 5–6 css inside
each note. The scene.css comment declares this as intended ("astride the frame's bottom stroke"), so the row is
MEASURED and by design. It stays the owner's eye.

---

## 3 · Findings the lane did not report

### 3.1 The clipped wells' side strokes fuse into the lip's top stroke (0 css daylight at every pose but the end)

The lane read the rhythm at the scroll END only (box gap 15.3–16.33, painted daylight 17.5–21). At every other offset
the card's scrollport clips the last visible well mid-body. Its side strokes stand at the lip's side x (|dx| ≤ 0.24,
by design), and they end ~3 css above the lip's top stroke. I read it painted in dark at DPR 2, with the lip hidden vs
shown and the wells hidden vs shown. The measure is the daylight between the lowest well ink and the lip's top ink in
the same column:

| cell | pose | columns with well ink over the lip | min daylight | columns ≤ 1 css (chromium / webkit) |
|---|---|---|---|---|
| dock 390×844 | rest (frac 0) and frac 0.5 | 8 / 11 | **0 css** | 7 / 6 and 7 / 5 |
| landscape 844×390 | rest and frac 0.5 | 8 / 8 | **0 css** | 6 / 6 and 5 / 5 |

The lane's own c1 shows it: the pencils well's sides run straight into the lip's corners and read as one tall frame.
The frame is uncaptioned, and the bottom double line IS captioned. This is the "4 css of daylight" law the lane
applied to the case's stroke, broken at the lip's other side. It is unverified gestalt on the frame the owner will
be shown. Name it for the B13 re-look, or give the lip daylight above the clip edge: the card's 0.5rem pad-b against
outset 4 + ½ stroke leaves ~3 css, and the wells' side strokes reach the clip edge.

### 3.2 The inset: under a real inset the pad vanishes and the lip's ink sits 7 css inside the safe area

`max(pad, env())` does not stack the pad on the inset. That is the stated intent, and it holds for the bar's box: the
bar's bottom lands exactly on the inset line, 810. The drawn lip, though, hangs outset 4 + wobble below that box.

- **Measured** in chromium under the CDP override: lowest lip ink **y 817** with a 34px inset. That is **7 css INSIDE the safe-area band**.
- **At inset 0** it is 5 css above the viewport, which matches the lane's 4.5–5.5.
- **The proposed RUNSHEET line** reads "lip ink ≥ 2 css above the home indicator" (the pill itself, ~8 css off the bottom). It would pass while the ink stands in the inset. The line should read against `env(safe-area-inset-bottom)`, not the pill.
- **The underlying cause.** The pass-3 `--safe-b` mirror (an arithmetic witness: set the inset, read the foot growing by it) was deleted in pass 5 with no replacement. So the env arm had no in-engine row at all until this critique. The CDP override is that replacement for chromium, and it belongs in the inset describe beside the 0.5rem NEG.

### 3.3 §2.5b: five sampled poses, and a `pinned` predicate that includes tapes in transit

The row claims "no pinned tape leaves the pin band **at any scroll offset**" and samples 5 offsets. I swept 101 poses
per cell, each after 2 rAF + 20 ms, with the row's own predicate (`sticky && !data-released && top ≤ band + 0.5`):

- **Proto, rail.** The predicate reads **19–32.2 css below the band at 10/101 poses** (scrollTop 7 … the 89th pose), in chromium and webkit.
- **Proto, dock.** **12/101** poses read below, **33.6 css** at worst.
- **Stuck.** None of those tapes is stuck (`|top − stickyTop| ≥ 0.5` at every one): they are tapes riding up through the band line before they stick.
- **So the row would red on its own predicate at poses it never samples.** The cure is to key "pinned" on STUCK and sweep ≥101 poses. With that predicate the proto reads **0/101 stuck-out** at both cells, both engines: the design holds, and the row as written does not prove it.
- **The FACE critic's class is confirmed.** §2.5's own pose sampling misses what HEAD carries: the clipped §2.5 predicate on the CONTROL reads overlaps at **48/101** poses (rail) and **10–11/101** (dock), while viewport-law §2.5 is green there. On this tree the same predicate reads **0/101**. That is the strongest number in this family's history, and it belongs in the row, not just in a critique.

### 3.4 §2.6: the release lags exactly one painted frame, and the chair's copy was not run

A rAF ladder after the jump scroll, pencils tag, both engines, rail1440 and drawer375:

| sync | rAF1 | rAF2 | rAF3–4 | +600 ms |
|---|---|---|---|---|
| static / released / vis 0 | static / released / vis 0 | sticky / held / **vis 1** | sticky / 1 | sticky / 1 |

That is one painted frame of tag loss on every jump scroll (focus scroll, keyboard page moves). The chair lands the
settle at the fold, so the row goes green, but the frame stays; it is the owner's to accept as the price of an
IO-driven pose. The chair ordered "every §10 lane runs the copy under `pass5/prototype/<id>/instruments/`". The
lane's copy is a SCHEMATIC hunk, "not git-applyable", so it was not run as the row. The four reds it would cure stand
as reds on this tree.

### 3.5 The census names no target for the dock's two heading buttons

§2.5b's forgiven rows at the dock read `target: ""` at 1395.2 and 938.4 px². They are `.mobile-heading-btn` (size,
difficulty), named only by `aria-labelledby`. The census reads `aria-label || textContent`. LAWS: name the occluder;
a forgiven row without its target's name is unreadable to the chair.

### 3.6 π: the landscape tab's +79.1 css is not in pass 5's table

At 844×390 coarse with the drawer shut, `.drawer-tab` moves from y 166.59 to 245.74 / 245.64 in both engines. It is
the quick set's flank (pass 4 priced +158.3 px; half of that is the centre shift), and c3 frames it. But pass 5's π
table lists only "6 tag deltas at the rail" for the quick set, so the pixel is declared a pass ago and missing from
this pass's row.

---

## 4 · Constraints, checked

| constraint | verdict |
|---|---|
| M16 plain copy | **PASS**: check-copy-register bare 0, 0 unadmitted (critic) |
| filterBudget 9, built dist | **PASS**: filtered elements 25 = 25 and `<filter>` 15 = 15 vs control, every cell, both engines (critic); the lane's filter-census 12/12 |
| AA from painted bytes | **PARTIAL**. The lip is 17.36/17.20 light and 14.31 dark; my coverage read agrees on its presence. The ring is 4.289/4.286 core median, but the **card ground is ABSENT**, the tape ground was read at dock390 only, and `fracUnder` reaches **0.176**, so up to 17.6 % of core pixels sit under 3:1 on some ground. The lane's reading, not re-run; the ground is unnamed in the README |
| π vs `74a2b5d9` from computed paint | **PASS** with one unlisted row (§3.6) |
| W2's landed mechanics | **QUESTIONED**: §2.6 red ×4 (the chair's, one frame of real lag, §3.4); the note berth regressed at coarse ≥1024 (§2) |
| decided history, r0/R6 | **PASS**: no r0 path written; §2.5, §2.5b and §2.6 are reported MOVED with PROPOSED diffs; R3 reads green on this tree only through a probe that also greens B4 (§1) |
| @property law | **PASS**: two dead registrations struck (`--card-pad-b`, `--card-pad-x`); the discriminator asserts the inherited 7px from a stated ancestor |
| undefined-token census | **PASS**: `--card-pad-x`, `--card-pad-t` and `--safe-b` survive only in comments; `--card-pad-b` is declared on `.controls-card` and consumed by its own `::after` and `scroll-padding-bottom`; `--pin-band` and `--card-foot-h` have in-scope declarations |
| the dock sheet SLIDES | **PASS**: polled to rest in every row (theirs and mine) |
| ballot pairs, one variable | **PASS for c3** (`.quick-frame` display only). **c1/c2 are proto-vs-HEAD, more than one variable** (pin band, foot, the "i" ring), which is right for a T9-B13 "form" frame but must be captioned as such. RULE's arm (b) is not framed here |

---

## 5 · Checklist

- **Gates that cannot fail**: **HIT**. `check-tape-foot` goes green on 7 of 8 breaks (§1). §2.5b samples 5 of the offsets its title claims, on a predicate that includes in-transit tapes (§3.3).
- **The constraint it forgot**: **HIT**. The regime key: berth hover-fine, mount row, reveal focus-visible (§2).
- **The pixel it moves that it did not declare**: **HIT, twice**. Notes land on the page at coarse ≥1024 (§2); the landscape tab's +79.1 is missing from this pass's π (§3.6).
- **Unverified gestalt**: **HIT**. The top junction (0 css daylight) is visible in c1 and unmentioned (§3.1).
- **The elegant-reduction trap**: **HIT**. "The foot stands on the inset" was proven only at env = 0; under a real inset the ink stands 7 css in the band (§3.2).
- **Masked fallback**: **NARROW HIT**. `max()` silently drops the pad the lane's own comment calls load-bearing, exactly on the phones the row is for (§3.2).
- **Vacuous convergence / spec cites itself**: not hit. The §2.5 clip was break-tested (1486.9 px² with it struck), and the 101-pose sweep confirms it is load-bearing.
- **Legacy aliases / consumer-less substrate**: not hit, actively cured (`--card-pad-x` was a 0px lie, `--card-pad-b`'s publisher, the `--safe-b` mirror, `.action-bar` in the dusk list).
- **The generic default**: not hit.

---

## 6 · Strengths (reproduced)

- **W2 §2.5 closed at every pose**: 0/101 in both engines at rail and dock, against HEAD's 48/101 and 10–11/101. The clip is load-bearing (1486.9 px² with it struck), and NEG-2 proves the clipped predicate still sees paint.
- **M18 landed in the house hand.** The lip is on four sides (top coverage 1.000, and 0.000 with the foot unpositioned), there are no CSS borders, the slab is dead, the ink is the wells' own and the pen is theirs.
- **The foot on the inset is correct for the box.** It is proved for the first time under a real `env()` (34px) in chromium: the bar rises 22, the case stays inside the viewport, and the control's verbs sit 25.6 css in the band.
- **Two latent pass-4 defects found and cured by the lane**: `--card-pad-x` read 0px everywhere, and the foot painted under the card.
- **The pass-4 critic's gate repairs landed**: `.some`, BAR_IN_FRAME over the document with an over-board NEG, the @property sentence, and the seal's margin rule stated (1304.07, not restamped).
- **T9-D1** now has a Tab-walk row with an in-run control: access 14/14 on the dist.
- **π holds** on board, wordmark and filters, prod-vs-prod.

---

## 7 · Open gaps, each closable, for pass 6

1. **Re-cut `check-tape-foot`** so that B1, B2, B3, B4, B5, B7 and B8 each red, as self-test plants in the same batch (§1). Add the logical-border, box-shadow and background-image clauses to the chair's r0 R3 in the chair's file.
2. **Re-key the note berth to the note's own regime**, or suppress the reveal where there is no berth. Add a coarse-1280×800 focus-visible row that reds today at +12.3…+33.3 css past the case (§2).
3. **Give the lip daylight above the clip edge**, or state and frame the fusion for T9-B13. The row: painted daylight between the clipped wells' side ink and the lip's top ink ≥ 4 css at rest and mid-scroll, dock and landscape, today 0 (§3.1).
4. **Add a CDP-inset arm to the inset describe** (chromium `Emulation.setSafeAreaInsetsOverride {bottom: 34}`: pad 34px, bar bottom = innerHeight − 34, case ≤ innerHeight). Then either keep the lip's lowest ink out of the inset band (today −7 css) or rule that decoration may stand there. Re-word the RUNSHEET line against `env()`, not the pill (§3.2).
5. **Re-cut §2.5b's `pinned` as STUCK** (`|top − stickyTop| < 0.5`) and sweep ≥101 poses. Today the as-written predicate reads 19–33.6 below at 10–12/101 unsampled poses, and the stuck predicate reads 0/101. Put the 0/101 vs HEAD's 48/101 in the row (§3.3).
6. **§2.6.** Make the settle an applyable diff, run it as the chair ordered (4 reds → green with a NEG), and put the one-painted-frame lag before the owner, or build a release pose that lands in the jump's own frame (§3.4).
7. **Name the §2.5b targets** by `aria-labelledby` text (§3.5), and add the landscape tab's +79.1 to the π table (§3.6).
8. **COST's grafts**, charter row 14. Still unlanded: ARMED as the berth's third summoning path, the input split, and the pointer-agnostic ask (fine 1440 clears in one click). Land them or carry each as a W1/U-10 row with its number. "The face is the button's air" is N/A on this tree (no `.act-face`), and the README should say so as a ruling request.
9. **The ring on the card ground** (absent) and **the tape ground off dock390**; name the ground behind `fracUnder` 0.176.
10. **The first tape** still lies −4.42 / −4.41 below its frame. Land LIFT a or b (seal Δ0) or ballot it.
11. **Open, as the lane declared:** a coarse-landscape seal; FACE's case-wide gate on this tree; the G2 leak sweep; DPR 3; the /8 fresh reader; M16's foot arm (crib not on this tree); the RULE↔TAPE arming merge watch; intake row 22 (G4's box clause fails off the rail, 16 vs 8); `landscapeFlank` as a per-mount query; G-INFO's co-sign on `.legend-fold { contain: layout }`; T9-B14's "i" landing with its winner.
12. **The content-view price is large and goes to the owner as a number**: landscape 296 → 173 (−122.87), dock −87.1/−88.1 and −71.1, rail −80 of which 56 is an always-empty note berth (visible in c2 as blank paper under the lip). RULE's foot costs 11–29.

---

## 8 · Cross-pollination

- **Every lane with an `env()` row** (RULE's foot, MOT-VERB, `mobile-platform.spec`, the W8 RUNSHEET): chromium's `Emulation.setSafeAreaInsetsOverride` makes the inset measurable in-engine. "Playwright resolves env() to 0" is false for chromium.
- **The chair (r0 R3) and every L5 gate**: a border regex without `border-(block|inline)*`, `box-shadow`, `outline` and `background-image` passes the fault it names.
- **FACE, RULE and W2**: the 101-pose sweep with a STUCK predicate. The clipped §2.5 reads 48/101 on HEAD; that is FACE's critic's class, measured.
- **FACE (the crib), MRK-ABS (`.info-btn`), RULE**: a berth, a mount and a reveal keyed on three predicates. Key all three on one regime.
- **RULE (a drawn top rule at the same clip edge) and FACE's c3 H5**: a drawn edge at a scrollport's clip line meets the clipped content's strokes with 0 daylight unless the pad clears outset + stroke.
- **MOT-\* and the chair's §2.6 settle**: a rAF ladder turns "latency" into a frame count (1 painted frame here).
