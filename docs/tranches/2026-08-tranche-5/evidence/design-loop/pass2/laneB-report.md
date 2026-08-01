# LANE B — F1 REBUILT · pass 2 dossier

**Worktree:** `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-2`
Nothing committed. Shots: `pass2/laneB-shots/`. Rig + raw JSON: `pass2/laneB-rig/`.
Every number below is a `getBoundingClientRect` or a rasterized pixel count taken from the app's
own `dist`, served on :5317 (Lane B build) and :5318 (an uncontaminated baseline `dist-base`
built from a `git stash` of the same tree). No mock exists in this lane.

---

## 0 · HEADLINE

| | |
|---|---|
| **The strip** | **DELETED.** Its pose was never affordable at 1024 — with the SHIPPED card the strip's left edge lands at **−18.5px**, off the page. The ticket widens the card and pushes the seam to **1280**. A pose half the desktop band can't hold, serving acts the same card already reaches by key, is machinery. Item 3 (no live filter under a scale tween) is satisfied by construction: nothing rides the scaled mover. |
| **The ticket** | **BUILT and shipping in-tree.** Row-regime card overflow **448–486px → 0px at every viewport, every game**; card scrollHeight **1024–1066 → 491–501**. Six display-caps eyebrows → two washi tags + five hand labels. |
| **Deal** | Dominant **by measured rendered ink mass**: 766.6 vs 502.5 for its loudest rival (1.52×), 2.78–9.71× every label it commits. Baseline: Deal 108.6 vs the DIFFICULTY heading's 1500.9 — the shipped card's quietest element, **13.8× under** the heading above it. |
| **Mobile** | Ruled **in-flow below the board**. The fixed tray is dead — but not for the reason pass 1 gave. |
| **Bonus, in-tree** | Every heading in the card was a **font chimera**. Fraunces' shipped subset holds three uppercase glyphs (B·D·S); `SIZE`/`DIFFICULTY`/`MARKS`/`CHECK`/`CANDIDATES`/`NEW GAME` each lost most of their letters to a system serif. The ticket ends `text-transform: uppercase` in the card entirely — **zero uppercase strings remain** (probe: `a11y-chromium.json`). Zero bytes. This is F5's estate-wide finding, confirmed first-party and cured here for free. |

Counts: **unit 307/307 · e2e 77/77 · vue-tsc green · prettier/eslint clean.**
**Mark-4 grep gate: 0 added lines containing `filter:`** (negative control: the same grep on the
removed side returns `- filter: url(#wobble-heart);`, so the gate can see them). Net **−1** live
filter reference.
**Net LOC: src −217 (+303 / −520) · e2e +15 (+30 / −15) · total −202.**

---

## 1 · THE ONE-HOUR DECIDER — and the critique's arithmetic is wrong too

The pass-1 prototype fabricated a `25×25` option and killed the ≥lg strip with it. The pass-1
critique corrected the labels and re-derived the geometry from a token model. **Both were built
on the same false premise**: that the card's width is set by a horizontal option row. It is not —
the shipped desktop `OptionSelector` is a *vertical column* (`OptionSelector.vue:28`), so no
option row ever set the card's width. Measured (`geom-chromium.json`):

| card content | critique's model | **measured, shipped** |
|---|---|---|
| sudoku (`4×4 9×9 16×16`) | 294 | **269.09** @1024 → **281** @1440 |
| futoshiki (`4×4 5×5 6×6 7×7`) | 298 | **269.09** — identical; four narrow options change nothing in a column |
| kenken (`4×4 5×5 6×6`) | — | **269.09** — identical |

The per-game divergence the work order asked me to re-derive **does not exist in the row regime**:
all five games render the same 269–281px card, because the width is set by the KeyboardLegend and
the action row, not by the selectors. The card is fluid with viewport (clamp-based type), which is
the only reason it moves at all.

### The strip's real clearance — NC-1, injected into the running app

`negctl2.mjs` builds the strip at F1's own designed pose (`right: calc(100% + 0.75rem)` on
`.board-peek-host`) out of the app's own `.icon-btn` geometry, in the real page. Gate: left edge ≥ 0.

| viewport | **SHIPPED card** bare-44 / sublabelled | **LANE B ticket** bare-44 / sublabelled |
|---|---|---|
| 1024×768 | **−18.5 / −27.3 FAIL** | **−42.7 / −51.4 FAIL** |
| 1180×900 | +25.3 / +15.8 pass | **+0.6 / −9.0 FAIL** |
| 1280×900 | +73.9 / +63.8 pass | +48.8 / +38.8 pass |
| 1440×900 | +151.5 / +140.6 pass | +126.0 / +115.1 pass |

Pixels: `laneB-shots/negctl-chromium-strip-1024.png` — the strip hangs off the left page edge,
clipped to a sliver. The gate demonstrably passes at 1280 and fails at 1024, so it discriminates.

**Closed-form bound, for audit.** The row is centered: `gutter = (V − boardW − 56 − cardW) / 2`.
At 1024 with `boardW = 608`, a 44px target plus 12px of air needs `gutter ≥ 56`, i.e.
**`cardW ≤ 248`** — 21px narrower than the *shipped* card and 69px narrower than the ticket. No
ticket design reaches it; the 4.25rem gutter hack buys `G/2 = 34px`, landing at +15.5 with a
knife-edge that vanishes on any card growth.

### RULING

Delete the ≥lg strip, and with it the `@media (min-width: 1280px)` seam, the
`position === "absolute"` gate, the fifth counter-scale `FlipMover`, the
`.in-live-face :deep(.game-toolbar)` kill rule, and the three fade-list additions. Zero lines
shipped. Grounds, in order:

1. **It is unaffordable across half the band it serves** (1024–1279).
2. **It has no user.** At ≥lg fine, undo/redo/hint/peek/pencil are keyboard acts and the
   `KeyboardLegend` inside the card is their visible contract. At ≥lg coarse (iPad landscape) the
   `.play-controls` row already renders in the card — e2e `mobile-platform.spec.ts:304` covers it.
3. **It was bought to escape the card's overflow.** The overflow is cured in the card (§2), so the
   escape is unmotivated.
4. **Item 3 is answered in its strongest form.** No element sits under the host's 520ms
   translate+scale mover, so no live filter can. The rule stands recorded for any revival:
   `useControlsDrawer.ts:222-226` is the house precedent — the rail's mover is translate-only.

---

## 2 · THE TICKET — built, measured, on both engines

Two drawn compartments and a live-verb row. A well is `HandDrawnOutline :stroke-width="2"
:outset="6" :radius="4" :pose="0"` (F2's graft) — frozen, filterless, zero beat enrolment — wearing
a persistent `SheetWashiLabel` on its drawn top edge. Inside, `ControlSection[]` renders as
**docket lines**: `label | options` on one baseline, right-ragged.

The design move that carries marks 1 and 2 at once: **the card's display-caps register is not
deleted, it is re-assigned.** Six eyebrows spoke in 25.9px Fraunces 800 caps; the ticket has none,
and the one Fraunces voice left in the card is `Deal`. The eyebrows become the pencil hand at
`--type-small`, lowercase, on the F5 graphite rung (68% — 5.23:1 light / 6.06:1 dark), with the
difficulty row keeping its data-driven crayon ink.

### Real estate (baseline → Lane B, chromium; webkit in `geom-final-webkit.json`)

| game | viewport | card W | page gutter | card overflow | card scrollHeight |
|---|---|---|---|---|---|
| sudoku | 1024×768 | 269.09 → **317.38** | 45.45 → **21.31** | 448 → **0** | 1024 → **491** |
| sudoku | 1440×900 | 281 → **331.95** | 215.5 → **190.02** | 388 → **0** | 1028 → **501** |
| futoshiki | 1024×768 | 269.09 → **317.38** | 45.45 → **21.31** | **486 → 0** | 1062 → **491** |
| kenken | 1024×768 | 269.09 → **317.38** | 141.45 → **117.31** | 448 → **0** | 1024 → **491** |

WebKit: card 319.86 @1024 / 334.63 @1440, overflow **0**. The `.controls-card` max-height cap in
`scene.css:41-46` is now a floor nothing touches — **the row-regime card no longer scrolls at any
tested viewport, in either engine.**

### Deal dominant, by MEASURED ink weight — not asserted

`ink.mjs` rasterizes each element at DSF 2 and sums `max(0, (paper − pixel)/255)` against the
card's own paper (95th-percentile luma inside the box), reported in CSS-px equivalents of full
black. Blank paper contributes 0, so the metric is total ink, not box area.

| | **BASELINE** ink (ratio vs Deal) | **LANE B** ink (ratio vs Deal) |
|---|---|---|
| **DEAL** | **108.6** (1.00×) | **766.6** (1.00×) |
| its die | 54.0 — renders **28×18**, not 28×28 | 207.6 — renders **34×34** |
| its verb | 54.0 (caption sublabel) | 558.4 (√φ heading rung) |
| `Difficulty` heading/label | 1500.9 — **Deal is 0.07× of it** | 275.5 — Deal is **2.78×** |
| `New game` heading | 1399.7 — Deal is 0.08× | *(deleted — washi tag)* |
| `Candidates` | 895.3 — 0.12× | 152.3 — **5.03×** |
| `Size` | 656.2 — 0.17× | 106.6 — **7.19×** |
| `Marks` | 537.6 — 0.20× | 81.8 — **9.37×** |
| `Check` | 468.6 — 0.23× | 78.9 — **9.71×** |
| selected `Easy` | 639.5 — 0.17× | 502.5 — **1.52×** |
| selected `Normal` | 552.4 — 0.20× | 488.9 — **1.57×** |
| selected `9×9` | 435.1 — 0.25× | 387.7 — **1.98×** |

**Deal is the loudest ink in the card, and every other element is monotone beneath it.**
WebKit agrees within 2% (`ink-f1-webkit.json`: Deal 752.7, min ratio 1.37×).
**G6 monotonicity over ALL rungs, old and new** — checked per row, not just at the top:
`size 106.6 < 9×9 387.6`, `difficulty 275.5 < Easy 502.5`, `marks 81.8 < Normal 488.9`,
`check 78.9 < Ask 238.3`, `candidates 152.3 < Off 222.2`. No inversion relocated.

**Negative control for this gate:** the identical instrument, identical code path, run on the
shipped card returns **0.07×** — the gate fails loudly on real input.

Two mechanisms the numbers exposed, both fixed in the ticket:
- The **die**: `deal.die` measures **28×18** in the shipped app. A column-flex `.icon-btn` makes
  the SVG a main-axis flex item and it shrinks. `.icon-btn.deal-btn > svg { flex: 0 0 auto }` is
  what makes 34 mean 34. (Independent in-tree confirmation of F5's `28×17.63`.)
- The **button box**: `.deal-btn`'s `width: auto` **never applied** — `.icon-btn`'s `width: 2.75rem`
  has equal specificity and wins on source order, so the shipped Deal is a 44×44 hit area its own
  contents overflow. Two-class (`.icon-btn.deal-btn`) fixes it and also outranks the
  `@media (pointer: coarse)` column override, making the pose one decision instead of a cascade
  accident. Measured after: **128.1×44**.

### n-section-generic, honestly

`assistSections` is a shell-owned `ControlSection[]` (marks / check / candidates) in exactly the
shape the games supply, so **one `v-for` draws both wells**. That is what let
`PencilModeToggle.vue` (47) and `AssistSettings.vue` (91) delete outright: each was a heading plus
an `OptionSelector` — a `ControlSection` written as a component. The tab machinery (`showTabs`,
`expandedPanel`, `valueLabel`, `headingClass`, `.mobile-heading-*`, `.heading-value`, `useId`) and
the entire mobile/desktop template fork go with them. No legacy aliases, no gated branches.

`check` keeps its manual `emit`, called straight from `onChange` — the load-bearing same-value
re-emit (`useAssists.ts:42-46`) survives verbatim. **Verified live:** re-picking "Ask" leaves it
selected and re-fires; picking "Hard" does **not** re-deal (givens 61 → 61, arm-not-live holds).

---

## 3 · THE MOBILE RULING — and pass 1's two mobile facts do not reproduce

Ruling: **in-flow below the board.** No fixed surface ships. Occlusion is therefore 0 in both
dimensions *by construction*, which is only worth saying because the instrument that returns 0
here returns non-zero elsewhere.

### D1 · board — real 2-D rect intersection, swept across scroll

| | tray width @390 | fits viewport X | worst visible board occlusion, scrollY 0→700 |
|---|---|---|---|
| F1's 7-item sublabelled tray | **346.0** | **yes** (22px each side) | **0 px² ≈ 0 cells** |
| F1's 7-item bare-44 tray | 340.0 | yes | 0 px² |
| 4-item tray | 196.0 | yes | 0 px² |
| **Lane B (in-flow card)** | — | — | **0 px²** (`fixedInCard: 0` — no fixed/sticky node exists) |

**Both pass-1 mobile facts are refuted by the shipped app.** The "~409px vs 390" overrun is not
reproducible — against the app's own `.icon-btn` geometry the seven-item sublabelled tray is
**346px** and fits with 22px each side; 409 came from the mock's own button metrics. The "4-item
tray occludes ~8 board cells" is not reproducible either — the board is page-top and a
bottom-fixed tray is viewport-bottom, so **they never share a band at any scroll position.**

### D2 · keypad

| | inside the simulated 336px keypad band |
|---|---|
| every tray roster, 390×664 and 375×667 | **100% of its 52–54px height — yes** |
| Lane B | n/a — nothing is fixed |

A `bottom:`-anchored fixed tray sits *under* the OS keypad in the exact moment it exists for.
Curing that needs F3's banked `top: var(--vv-height)` visual-viewport anchor — i.e. the tray costs
a sheet-class primitive before it works at all.

### The tray dies on cost, not on overflow

It permanently consumes **52–54px of a 664px viewport (7.8–8.1%)**, duplicates the
`.play-controls` row the card already renders at coarse, and is keypad-occluded. In-flow wins.

### What the ticket actually buys on mobile — stated against Lane B, not for it

| | baseline | Lane B |
|---|---|---|
| control card height @390×664 | 614.9 | **558.5** (−56.4) |
| document height | 1195 | **1138** (−57) |
| page in viewports | 1.800 | **1.714** |
| board-bottom → Deal (co-visibility need) | 225.8 | **205.1** — fits one 664px viewport |

The mobile branch already used horizontal option rows, so the −305px the desktop won is
desktop-only. **−4.8% of stack, while also revealing a section the tabs used to hide.** That is
honest, and it is not a cure: **Lane B does not close mark 3.** F3's re-entry trigger (b) — "the
owner's ALL-mobile-interfaces mark survives pass 2 uncured" — remains live, and Lane B's ticket
composes cleanly onto F3's sheet substrate if the adjudicator wants the carrier.

---

## 4 · RIG HONESTY

**In-tree Vue mount, real scoped-CSS compilation.** Everything measured is the built app; the
lane owns no mock. `vue-tsc -b` green, `vite build` green, prettier + eslint clean.

**The fade, proven — after two instruments failed their own controls.** Recorded because the
failures are the point:

1. *Own computed opacity* — could not fail: a child of a 0-opacity ancestor still reports 1.
2. *Ink mass in a fixed clip box* — **failed its negative control**: the gallery fold MOVES the
   elements, so the "unfaded" drawer tab lost 33–42% of its ink too. The control caught it.
3. *Effective opacity* (the product of the element's own and every ancestor's) — motion-immune,
   and it discriminates.

Result over a real `html.gallery-leaving` beat (`fade3-chromium.json`):
`well / washi / deal-verb` all **1 → 0** together across ~216ms; **negative control** — the drawer
tab, which `scene.css` deliberately never fades — **holds at 1.0000 in the same frames.**
WebKit: 1 → 0.3536 at 199ms, same trajectory. Pixels: `laneB-shots/fade-*-B-leave-mid.png`.

Structurally there was never a scoping question: the wells are DOM descendants of `.scene-controls`
/ `.mobile-board-width`, which *are* the fade targets — **Lane B adds nothing to those selector
lists**, which is precisely how pass 1's three dead `::v-slotted` rules are avoided. *Honest limit:*
the mount fade (`controls-fade-in`) had already completed before the sampler attached, so the
IN direction is argued structurally (same ancestor, same rule) and proven only in the OUT
direction. Not claimed as measured.

**Both pointer regimes.** Fine: 1024/1180/1280/1440 desktop, chromium + webkit. Coarse:
390×664, 375×667, 430×739 with `hasTouch`, plus the shipped `mobile-affordances` /
`mobile-platform` e2e suites (iPhone 13 descriptor, iPad portrait, iPad landscape, landscape
phone) — all green.

**Every gate has a control shown able to fail:** strip clearance (fails at 1024, passes at 1280) ·
Deal ink dominance (0.07× on the shipped card) · fade (drawer tab holds) · mark-4 grep (fires on
the removed line) · tray occlusion (0 for the board, 100% for the keypad band).

**a11y to contract** (`a11y-chromium.json`):
- `role="group"` on both wells and on every docket row. Names: `New game` / `Teacher's marks and
  checks`; rows `Size`, `Difficulty`, `Pencil marks`, `Check for errors`, `Show candidate marks`.
- **Visible-label-in-name holds** everywhere: the washi reads "new game" / "teacher's"; the row
  labels are their own names (rows carry `ariaLabel` where it must be longer than the visible
  word, and the visible word is contained in it).
- Labels are `aria-hidden="true"` inside a named group, so no label doubles a group name to AT.
- **`aria-orientation`: deliberately absent.** It is not valid on `role="group"`, and the strip
  that would have needed `role="toolbar"` no longer exists. Roving tabindex likewise: these are
  plain buttons in document order, which the order permits ("roving tabindex OR `role=group`").
- **DOM order = visual order** at ≥lg for every rendered control (probe dump in §rig). The only
  DOM-after-visual rows are the `.play-controls` buttons, which are `display: none` on a fine
  pointer — not an order break.
- Deal's tap target measures **128.1×44** (was a 44×44 box its contents overflowed).

---

## 5 · LOC LEDGER + BLAST RADIUS — re-priced, including the rows pass 1 missed

| file | + | − | note |
|---|---|---|---|
| `src/games/shared/GameControlPanel.vue` | 286 | 373 | one template; two wells; assistSections; tab machinery + fork deleted |
| `src/games/shared/AssistSettings.vue` | 0 | **91** | DELETED — absorbed as two ControlSections |
| `src/games/shared/PencilModeToggle.vue` | 0 | **47** | DELETED — absorbed as one ControlSection |
| `src/pencil/chrome/OptionSelector/OptionSelector.vue` | 13 | 8 | vertical branch + `mobile` prop deleted; one fluid rung |
| `src/games/shared/GameScene.vue` | 4 | 1 | card `p-5 → p-4` |
| **src subtotal** | **303** | **520** | **−217** |
| `e2e/mobile-affordances.spec.ts` | 8 | 5 | Deal's name is `.deal-verb`, not `.icon-sublabel` (2 sites) |
| `e2e/visual-regression.spec.ts` | 22 | 10 | `.ctrl-btn` font-size ≥19 → target box + ≥17; `.icon-btn` read scoped to the visible card |
| **e2e subtotal** | **30** | **15** | **+15** |
| **TOTAL** | **333** | **535** | **−202** |

**Blast radius, walked rather than assumed:**
- `useAssists.ts` **untouched** → `useAssists.test.ts` (which consumes
  `ERROR_CHECK_CYCLE`/`cycleErrorCheckMode`/`toggleCandidates`) costs **0 rows**. Pass 1's ledger
  priced a deletion this lane didn't need.
- `share-truth.spec.ts:57` — `.controls-card button.icon-btn` `.nth(4)` — **green unedited**.
  Measured DOM order: `Deal · Clear · Fill · Solve · Share · Undo · Redo · Hint`; nth(4) resolves
  to "Share board link".
- 4 × `.mobile-control-panel` e2e locators: the class name is **kept verbatim** — renaming it
  would have cost four spec edits for no design.
- `OptionSelector` consumers after this change: `GameControlPanel` only (`GameCard.vue` imports
  `scribbleUnderline`, not the component).
- Goldens: `visual-golden.spec.ts` runs under its own config and is not run here — the panel
  goldens **will** need one re-baseline from the runner artifact at tranche end. **Named, not
  hidden.** `test:golden:bytes` and `throttled-void` likewise unrun.
- Two e2e assertion edits are genuine design costs, both argued in-file: Deal's name is no longer
  a caption, and the option rung is the sheet's `--type-body` (17.5px @1024 → 18.6px @1440) rather
  than a hard-coded 1.25rem — which is what lets a docket line fit the rail. The row those
  assertions guard ("Bigger touch targets") is now measured as a box, which is what it meant.

---

## 6 · OPEN, HANDED ON, AND WHAT I DID NOT DO

1. **Mark 3 is not closed.** −4.8% of mobile stack. F3 re-entry trigger (b) stands.
2. **The option labels are still chimeras.** Fira Code's subset lacks `N o C n t l O A k L v`:
   `Normal`, `Corner`, `Center`, `Off`, `Ask`, `Live`, `On` all paint per-glyph fallbacks today and
   still do. The *headings* chimera is cured; the *options* one is a Lane D owner row (re-subset
   three woff2s, or restrict labels to covered glyphs). Ranges verified in-tree at
   `src/assets/index.css:39-71`.
3. **F1's Check split is NOT shipped here.** Mode-vs-act needs a per-move surface, and Lane B just
   ruled the ≥lg strip out. The diagnosis stands and is the strongest idea in the family; it wants
   a home Lane A's picker or F3's sheet may provide. Check lives in the teacher's well meanwhile,
   one row, same-value re-emit intact.
4. **F5's pressure ladder** is grafted at three rungs (Deal foreground / selected option / 68%
   graphite label) and verified monotone. The AA closures for `legend 3.53` and `kbd border 2.36`
   are untouched Lane D rows.
5. **F3's channel split** is not consumed — Lane B ships no fixed mobile pose, so there is no
   translate/transform channel to split. It stays banked, and is the first thing the tray needs if
   anyone revives it.
6. The `4.25rem` host gutter is **refuted**, not deferred: it buys `G/2 = 34px` and still leaves a
   knife edge, for a pose with no user.
