# STAGE F3 — THE CARRIER LANDS · pass-3 dossier

Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` — **MAIN**, base
`ca8bb001` (Lane A's stage close). **Two commits, nothing pushed:**

| commit | what |
|---|---|
| `3bd027ab` | a hold is a press that stays — the peek band learns its own slop |
| `5873a920` | mark 6 — the strip under the board keeps one tenant, and the board fits the screen |

Rig `…/pass3/rigF3/` · shots `…/pass3/shots/F3-*.png` · dists `…/pass3/dist-F3{base,head}`
(`dist-F3base` = `ca8bb001`, the pre-stage tree; `dist-F3head` = the committed tree). Every
figure below is single-tree: the last source edit, then one build, then one run of everything.
`frontend-design` invoked before the visual work — and it earned its keep twice (§4).

---

## 0 · THE RULING THAT SHAPED THE STAGE

The charter re-entered F3 as a carrier, not a family, and two facts settled what a carrier
could honestly deliver:

1. **There is no drawer below 1024** (blast §2.5). `#controls-drawer` is `v-if="rowRegime"`;
   `document.querySelector("#controls-drawer")` returns null on a phone — verified again this
   stage in both engines (§1, B1). Every pass-1 blocker but one is a defect of a mechanism the
   tree does not contain and this stage did not build.
2. **The stall lane's inherited constraint**: any substrate that changes the board's laid-out
   size across a gesture pays ~150ms desktop / ~300ms iPad, per gesture, in raster re-bake.

Together those retire the drag-sheet as a deliverable on the evidence rather than on time. A
detented bottom sheet has exactly two settings and both lose: it either changes the board's
laid-out size at every detent — and buys the owner's own perf campaign a ~300ms bill per drag —
or it leaves the board where it is, in which case the "board owns the viewport" headline
evaporates and what remains is pass 1's 257px of void. **No new sheet motion ships. What ships
is what a sheet was WANTED for: the mobile stack, cut where it is actually spent.**

---

## 1 · THE SIX BLOCKERS — interrogated on the shipped tree, not reasoned about

`rigF3/blockers.mjs`, built dist, both engines, **with the failing cohort's own profile
installed** (`localStorage["csp-drawer-open"] = "0"` — B2's whole premise). Both engines report
identical rows.

| # | blocker (pass-1 §) | disposition | the reading that says so |
|---|---|---|---|
| **1** | ≥1024 handler leak (§2.1) | **DEAD — no such handler exists** | A full synthetic drag on `#controls-drawer` at 1440×900 (down, 2 moves past 100px, up): `transform: none → none`, inline transform `""`, `html` class unchanged at `drawer-closed`. At 390 the rail is absent outright. |
| **2** | inert dead-end (§2.2) | **DEAD — the opener was never inside the inert node** | 1440: `inert` is on `#controls-drawer`; `.drawer-tab` is `display: block`, `tabInsideInert: false` (it lives in `.board-peek-host`). 390: **no inert node at all**, no drawer, `.mobile-board-width .control-panel-wrap` in flow — reachable with no opener to trap. |
| **3** | peek/drag D7 (§2.3) | **REAL, AND CURED THIS STAGE** | The one blocker that was a fact about the shipped tree, not about the spike. §2 below. |
| **4** | pane scroll (§2.5) | **DEAD — the card scrolls and its tail is reachable** | Rail: `.controls-card` 640/1076, overflow **436**, `overflow-y: auto`, scrolls to end, and the LAST control is inside the card's box at max scroll. Phone: the card is in flow (582/586) and the page carries it. |
| **5** | m1 regression (§4.1) | **REFUTED BY CONTENT ORDER** | Wells in DOM order: **`[new game, pencils, teacher's]`**, `newGameIndex: 0`, Deal inside the first well. Pass 1 sank NEW GAME to the middle stanza; on this tree it is first, and reveal-order doctrine is dead by charter. |
| **6** | item-2 reproduction (§4.3) | **ANSWERED IN-TREE BY LANE C** | Census by rank: **2 eyebrow / 3 tape / 2 caption** — `new game`(tape) · `Size`(eyebrow) · `Difficulty`(eyebrow) · `pencils`(tape) · `marks`(caption) · `candidates`(caption) · `teacher's`(tape). Not three identical display-caps eyebrows under one divider. |

Blockers 1, 2 and 4 are disposed of as **dead by construction, with a reading each** — not
"fixed". That distinction is the honest one and it is the whole reason this stage did not
re-open the spike.

---

## 2 · BLOCKER 3 — the recognizer's missing half

`GameControlPanel.vue:161-179` was `pointerdown` + a bare `setTimeout(…, 350)`, with
`pointerup`/`pointerleave`/`pointercancel` as its escapes. **`pointerleave` is not an escape on
touch**: the first `pointermove` gives the band implicit pointer capture, so a finger that
presses the divider and travels 200px still owns the event stream and still trips the timer.
A deliberate drag over the band flashed the answer key mid-gesture.

F3's own spec closed this question by citing *"the `useLongPress` idiom"*. The peek does not use
`useLongPress` — that composable has exactly one consumer, `useGameCell.ts` — and there was no
`pointermove` handler anywhere in the peek. The critique called it a spec-cites-itself
circularity and it was.

The cure is the recognizer's missing half, not an arbiter above it: `PEEK_SLOP_PX = 10`, a
`pointermove` past it cancels the pending hold and ends a live peek. **+18 code lines, both
branches.** The band yields to any gesture that begins on it — which is the arbitration D7
asserted already existed.

**Gate, with its control.** `GameControlPanel.test.ts`, two rows: a 60px drag emits no
`peek-start`; a still press **and a hand's own 4px tremor** both still peek. jsdom keeps
`clientX/clientY` read-only on `MouseEvent`, so the gesture is dispatched as a real event —
`trigger`'s options silently drop them and the probe would have measured a pointer that never
moved. **GATE-1:** the two `@pointermove` bindings removed (the exact prior defect) → the slop
row **RED**, the tremor row green; restored → both green.

---

## 3 · MARK 6 — the band dissolves. Before and after, on Lane B's own metrics

Metrics are Lane B's verbatim (`pass2/laneB-report` §3, `MEASURE-REQUESTS` G3), so the stage
reads against a banked number instead of a fresh one: **page in viewports** =
`document.scrollHeight / innerHeight`, and **co-visibility need** = board-bottom → Deal. The
1.800 case is **390×664** — 390 wide by the visual viewport a real MobileSafari leaves under
its two bars. Both engines agree on every row to ≤0.03px.

### 3.1 The headline cell — 390×664

| | base `ca8bb001` | head | Δ |
|---|---|---|---|
| **page in viewports** | **1.750** | **1.705** | **−0.045** |
| document height | 1162 | 1132 | −30 |
| **in-flow band** (`.board-margin`) | **51** | **21** | **−30.0** |
| **board-bottom → Deal** | **260.13** | **229.73** | **−30.40** |
| board-top → first tappable chip | 562.38 | 531.98 | −30.40 |
| board-top → controls card | 443.58 | 413.19 | −30.39 |
| control panel height | 558 | **558** | **0** |
| **celebration's push on the card** | **109.18** | **0** | **−109.18** |

The panel row is the one that matters most: **the receipt cost the ticket nothing.** It shares
the deal row's cell, so the 30.4px left the page rather than moving down it.

### 3.2 Every cell, both engines (`rigF3/out-covis-*.json`)

| cell | page vh base → head | band base → head | board-bottom→Deal |
|---|---|---|---|
| 390×664 **THE CASE** | 1.750 → **1.705** | 51 → **21** | 260.13 → **229.73** |
| 390×844 | 1.377 → 1.341 | 51 → 21 | 260.13 → 229.73 |
| 375×812 | 1.438 → 1.401 | 51 → 21 | 260.09 → 229.70 |
| 430×932 | 1.291 → 1.258 | 51 → 21 | 260.22 → 229.83 |
| 820×1180 iPad portrait | 1.237 → 1.212 | 52 → 22 | 264.19 → 233.80 |
| **844×390 landscape** | **3.746 → 2.533** | 52 → 22 | 264.36 → 233.97 |
| 1280×800 rail | 1.050 → 1.012 | 54 → 24 (overlay) | — |
| 1440×900 rail | 1.007 → 1.000 | 55 → 24 (overlay) | — |
| 390×844 **fine NEG CTRL** | 1.212 → 1.177 | — | — |

The negative-control row is the pattern, kept: same build, same viewport, `hasTouch` off, and
the page reports 1.177 where the real regime reports 1.341. A number without its regime is not
a number.

### 3.3 The three tenants, each with its own reading

**The tally → the ticket.** `DifficultyTally` left `.board-margin` for `.deal-row`, labelled
`dealt` — the well's `Difficulty` eyebrow is two rows up, and the same name at two ranks is not
a name; "dealt" also draws the distinction the well needs, between the tier you ASK for and the
tier the board you were dealt reached. `descriptor.ariaLabel` is untouched, so the honesty spine
travels with it. The hover reveal of the technique name is suppressed **inside the ticket
only**, and for a stated reason: the well is a `HandDrawnOutline`, so a child that changes its
own box on hover changes the well's — the stall lane's own re-bake mechanism. In the margin the
reveal had an empty margin to open into; in a compartment it has a neighbour.

Prop route: 5 scenes moved `:grade-tally` from board to panel; `GameBoard` and the five
per-game boards dropped the prop and its type import. **vue-tsc 0, knip green** — no dead relay
survived the move.

**The tally line → the voice's line.** `.margin-note-block` is a baseline-aligned wrapping flex
row, `.margin-note-meta` loses its `−0.2rem` pull-up. A solve no longer grows the strip by a
whole caption line.

**The celebration → the board.** `CompletionVignette` was `position: static` below 1024 — the
last in-flow rung, and the biggest number in the mark. Forced visible in page against its own
base control (`rigF3/vignette.mjs`): base **docGrowth 109 / ctrlPush 109.18**; head **0 / 0**,
`position: absolute`, ink landing **7.68px inside** the page's right edge. It takes the row
regime's own `−2.1rem` rise, measured against its neighbours rather than picked: at 390×664 the
star sits 96 → 165.4 against a board top of 130.2 (straddling the frame) and clears the fixed
z-60 sun's ink, which ends at 67, by **29px**; at 820×1180 the star's ink stops at x 726.4
against a sun starting at x 740.

**Disclosed, not narrated:** the sticker's verdict line lands over the board's first two rows of
digits. That is the pose the row regime ratified in T3-W12 and it is accepted here for the same
reason — the board is solved at that moment. The alternatives were measured and both fail: a
further rise puts the star under the z-60 sun at iPad portrait, and anchoring above the frame
collides with the masthead.

### 3.4 The height arm loses its `lg:` — the rung pass 1's critique named and left undesigned

`GameBoard.vue:211-217`. The stacked shell carried `w-[min(42rem, 100vw−1.5rem)]` and **no
height bound at all**; the `100dvh − 10rem` arm was fenced behind `lg:`. At 844×390 that asked
for a **672px board inside a 390px viewport** — `boardFits: false`, 3.746 page-viewports, the
worst mobile number in the estate.

Unprefixed, the estate's own constant binds only where the viewport is shorter than the board
wants, and is **inert at every portrait cell measured** (390×844: 684 vs 366; iPad portrait:
1020 vs 672). Landscape: board **672 → 230**, `boardFits: true`, page **3.746 → 2.533**. The
golden viewport's board is **640 before and after**, so the rung is invisible at ≥1024.

A media cap is not a gesture — it bakes at load and rotate, so it costs nothing against the
stall lane's per-gesture bill. That is why this was buildable and a detent was not.

---

## 4 · WHAT THE RENDER CAUGHT THAT THE ASSERTIONS DID NOT

`frontend-design`'s calibration here was restraint — the estate owns the aesthetic and the
deliverable is placement. It paid twice, and both were caught by looking, not by a gate:

1. **The verdict inside a 7rem sticker was set at 1.5rem** and wrapped to two lines. The row
   regime learned this at 8rem and dropped to 1.05; the narrower sticker inherits it, and the
   ≥1024 override folds away.
2. **A centred flex row is not a centred verb.** With the receipt beside it,
   `justify-content: center` slides Deal ~43px off the well's own spine — the axis its staged
   chips are centred on.

And the cure for (2) had its own defect, which a **golden** caught:

> `grid-template-columns: 1fr auto 1fr` holds the spine, but under the rail's shrink-to-fit
> MAX-CONTENT sizing the two `1fr` tracks resolve equal, so the **empty left track mirrors the
> receipt's width**. Row max-content became verb + 2× receipt: rail **276.25 → 283.14**, and the
> centred `.app-layout` walked the board **3.45px left** — a sub-pixel phase change under
> `cell-light`, a committed golden, which went red and STAYED red across runs while it reds
> nowhere on the base.

Cured by sharing **one grid cell** with two alignments (Deal `justify-self: center`, the receipt
`justify-self: end`), so the receipt's width sits outside the rail's max-content. Re-measured:
rail **276.25**, board left **153.875** — byte-identical to base — and `cell-light` +
`grid-corner-light` pass every run. **Nothing was re-baselined.** The falsified form and its
numbers are written into the CSS comment at the site, so the next hand does not re-try it.

This is the stage's own G6 lesson: the gate that found it was one nobody in the pass expected to
be in the blast radius. Blast §0 said no pass-3 work order touches a golden subject; a 3.45px
layout shift two elements away did.

---

## 5 · CO-VISIBILITY — the verdict, stated as narrowly as the evidence allows

**Board + the first tappable control, one screen, portrait: MET at every cell, and it was
already met before this stage.** 390×664 needs 531.98 of 664. The stage widened the margin from
101.6px to 132.0px, and widened board+Deal from 39.9px to 70.3px. That is the honest shape of
the win: **mark 6 did not buy co-visibility — Lanes B and C had already bought it — mark 6 bought
back 30.4px of standing height and 109.18px of celebration jolt.**

**The whole stack in one screen: NOT met, and not claimable.** 1.705 viewports at 390×664. The
card's second half is a scroll. Closing that needs the ~558px panel to halve, which is Lane C's
uncashed T′ collapse (the well markup written twice, once per template branch), not a layout
move.

**Landscape 844×390: the board now fits — co-visibility does not, by 9.27px.** `needChip`
399.27 against a 390 viewport. The residue is named rather than squeezed: buying those 9.27px
costs 11rem of allowance, which shrinks the golden viewport's board 640 → 624 and moves a
committed golden for a scroll nobody asked to delete. **Landscape wants the ROW regime it has
never had** — board beside controls, the layout `useRowRegime` fences at 1024 — and that is a
design row, open, not a constant to retune.

---

## 6 · GATES — one run, on the committed tree, after the last edit

vue-tsc **0** · vitest **332 / 31 files** (+2: the peek's slop and its tremor control) ·
eslint · knip · prettier(`src/`) · `test:font-coverage` 28 codepoints / 13,788 B ·
`lint:ink` exit 0 · **default e2e 101 / 101** (was 97 — four added rows) · **built-dist lane
14 / 14** (filter-census 3 — **zero new filtered surfaces**, theme-bake ×4, wordmark 6,
throttled-void 1) · `test:golden:bytes` PASS · `npm run build` green.

Ports: default suite on **:5312** (vite dev, `PLAYWRIGHT_BASE_URL` explicit — :3000 is squatted
by a foreign palette-api); built-dist lane on **:4188** (no orphan preceded it; killed after);
rig static servers **:4903/:4904**. `:4894`/`:4895`/`:3000`/`:3001`/`:4288` untouched.

### The new gate: `e2e/board-covisibility.spec.ts`, 4 rows, every one with its control

| row | claim | control INSIDE the run | vs the pre-stage dist |
|---|---|---|---|
| the tally files with the deal | `.deal-row .difficulty-tally` = 1, label `dealt`, aria-label non-empty, `.board-margin` = 0 | a tally is cloned back into `.board-margin` and the probe must see it | **RED** (0 in the ticket) |
| the strip is one reserved line | `.board-margin` offsetHeight ≤ 30 | a tenant is cloned back and the same probe must exceed 30 | **RED** (51) |
| the grade never moves the page | vignette `absolute`, docGrowth 0, ctrlPush 0, ink inside the page | `position: static !important` and the probe must see the page move >50px | **RED** (`static`) |
| the board fits its viewport | `.board-wrapper` height ≤ innerHeight at 844×390 | `max-width: none !important` and the board must overflow | **RED** (672 vs 390) |

Every coarse row asserts its regime from three independent observables before banking a figure.
**4/4 RED against `dist-F3base`, 4/4 green on head** — GATE-1 at the source, not in page only.

`e2e/mobile-platform.spec.ts`'s landscape row lost the parenthetical "(the tall board scrolls
vertically)": it described a tree that no longer exists. Its own charge — no horizontal
overflow — is unchanged and green.

### The goldens — the standing trap, characterised again with a matched control

`cell-light` and `grid-corner-light` — the only subjects this stage could plausibly move —
**pass every run on both dists.** The two POSE-STACK subjects behave on head exactly as on base:

| dist | runs | `logo-light` | `toggle-crest-dark` |
|---|---|---|---|
| base `ca8bb001` | 3 | ✘ ✘ ✘ | ✓ ✓ ✘ |
| head (committed) | 3 | ✘ ✘ ✓ | ✓ ✘ ✓ |

Non-deterministic on an unchanged dist in both directions — Lane B's §7 finding, reproduced with
a matched-pairs control across two builds. **Nothing re-baselined**; routed to the standing traps
ledger and the team-lead row that owns the sun-crest clause.

---

## 7 · LOC — code-only, same stripper both sides, against `ca8bb001`

| file | + | − | net |
|---|---|---|---|
| `GameControlPanel.vue` | 28 | 3 | **+25** |
| `DifficultyTally.vue` | 8 | 2 | +6 |
| `MarginNote.vue` | 5 | 1 | +4 |
| `GameBoard.vue` | 3 | 6 | **−3** |
| `CompletionVignette.vue` | 10 | 17 | **−7** |
| 5 per-game boards | 0 | 15 | **−15** |
| 5 scenes (prop re-route) | 5 | 5 | 0 |
| **product total** | **59** | **49** | **+10** |
| `board-covisibility.spec.ts` (new — 4 rows, 4 controls) | 110 | 0 | +110 |
| `GameControlPanel.test.ts` (2 rows + the dispatch helper) | 33 | 1 | +32 |
| `mobile-platform.spec.ts` (a stale claim in a test name) | 1 | 3 | −2 |
| **total** | **203** | **53** | **+150** |

All-lines, for the record: **+386 / −79** across 18 files — the gap is comment, and the comments
are where the falsified alternatives are written down.

**+10 product lines** for 30.4px of standing height, 109.18px of celebration jolt, a 442px
landscape board, and a recognizer that no longer fires through a drag. Two of the five product
files come out NEGATIVE, and the largest single cure in the stage — the height arm — is **three
`lg:` prefixes deleted**.

---

## 8 · WHAT IS OPEN, PLAINLY

1. **The whole stack is still 1.705 viewports at 390×664.** Mark 6 was worth 0.045 of it. The
   remaining lever is Lane C's uncashed T′ collapse, not layout.
2. **Landscape co-visibility misses by 9.27px** (§5) and wants a row regime, not a constant.
   Measured, named, unbuilt.
3. **The sticker's verdict overlays two rows of solved digits** (§3.3). The ratified pose, the
   alternatives measured and refuted, the trade disclosed.
4. **No on-device cell in this lane.** Two headless engines agreeing to 0.03px is geometry, which
   is the class headless carries; M5 stands as the standing reminder that it is not evidence
   about Safari. The `−2.1rem` sun clearance especially wants one real iPhone frame.
5. **The drag-sheet is retired on evidence, not deferred** (§0). If the adjudicator wants it
   back, the row it must answer first is the ~300ms/gesture iPad bill, not the detent geometry.
6. **The two pose-stack goldens still do not converge on darwin** (§6). Not this stage's,
   re-characterised with a control, nothing re-baselined.
