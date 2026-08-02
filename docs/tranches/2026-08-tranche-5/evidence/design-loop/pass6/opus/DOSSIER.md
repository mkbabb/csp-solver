# PASS-6 · DESIGN LANE OPUS — THE DRAWER COMES DOWN TO PORTRAIT

**Angle: MINIMAL-DELTA EXTENSION.** The estate already owns a drawer. It is not brought down to
the phone by building a phone drawer — it is brought down by deleting the rule that said it
could not come. Every number below is re-derived on this lane's own build; the base arm
reproduces pass 5's banked table nine cells for nine before any head figure is believed.

**THE HEADLINE.** `pageVh` at 390×664: **1.705 → 1.000 chromium, 1.703 → 1.000 webkit.** Exactly
the price sheet's rung 5. Every portrait cell in the ladder reaches 1.000; the two rail cells are
byte-identical to base (1.013 / 1.000). The drawer-open cost on portrait is **0 bakes, 0 encodes,
0 ms blocked in the 600 ms window** — CH-61's mechanism is structurally absent below 1024, and
the desk gesture it governs is unmoved (300 ms head vs 310 ms base, overlapping ranges, n=19 each).

---

## 1 · THE COMPOSITION

### 1.1 The fold at rest — annotated, 390×664 chromium (webkit in parentheses where it differs)

```
 y=0    ┌──────────────────────────────────────────────┐
        │  @mbabb                            ☀ toggle  │   fixed corner chrome (unchanged)
 54.00  │                                              │
        │            s u d o k u   ⌄                   │   .masthead  h=78.22 (77.63)
132.22  ├──────────────────────────────────────────────┤   ← the sheet's ceiling, when open
(131.63)│ ┌──────────────────────────────────────────┐ │
        │ │                                          │ │
        │ │            THE WORKSHEET                 │ │   .board-cells  362 × 362
        │ │         9 × 9, 40.22px cell              │ │   (unchanged — the board never
        │ │                                          │ │    moves in this design)
        │ │                                          │ │
494.22  │ └──────────────────────────────────────────┘ │
504.61  │  a fresh 9×9 — singles only                  │   .board-margin  h=20.80
525.41  ├──────────────────────────────────────────────┤   board host bottom
        │                                              │
539.00  │  ↺      ↻      💡                            │   #fold-tools  h=50.16, at the
        │ Undo   Redo   Hint                           │   worksheet's LEFT corner
589.16  │                                              │
        │                 ← 74.84px of slack →         │
616.00  │                              ┌──────────┐    │   the case's tongue, poking up
        │                              │ controls │    │   from under the screen's edge
 664    └──────────────────────────────┴──────────┴────┘   .drawer-tab  92 × 48
                                                           ═══ pageVh 1.000 ═══
        #controls-drawer  position:fixed  top:664  h:480   ← parked, off-screen, card
                                                              hidden + inert
```

**Nothing here scrolls.** `docScrollH` is 664 against a 664 viewport, both engines.

### 1.2 The sheet, open

```
 y=0    ┌──────────────────────────────────────────────┐
 54.00  │            s u d o k u   ⌄                   │   masthead WHOLE — the cap's
132.22  │                                              │   own derivation, kept
        │ ┌────────────────────────────────┐           │
        │ │  the worksheet's top row peeks │           │   51.78px of grid (52.38 webkit)
184.00  ├─┴────────────────────────────┬───┴───────────┤
        │                              │  controls  │  │   the tongue rides the case:
        │  ╭ new game ─────────────────┴────────────╮ │   here it is the HANDLE
        │  │  Size          Difficulty              │ │
        │  │  4×4  [9×9]  16×16      Easy           │ │   .controls-card  h=472
        │  │        🎲 Deal        dealt ┃┃┃┃        │ │   content 527 → 55px of
        │  ╰────────────────────────────────────────╯ │   internal scroll (see §4)
        │  ──────────── hold to peek ─────────────    │
        │  ╭ pencils ───────────────────────────────╮ │
        │  │  marks   [Normal] Corner Center        │ │
        │  │  candidates  [Off]  On                 │ │
        │  ╰────────────────────────────────────────╯ │
        │  ╭ teacher's ─────────────────────────────╮ │
        │  │  Off  [Ask]  Live                      │ │
        │  │  board changed — ask again             │ │
        │  ╰────────────────────────────────────────╯ │
        │  ✏ Clear   ⊞ Fill   ✨ Solve   ↗ Share      │  (below the sheet's fold)
 664    └──────────────────────────────────────────────┘
```

Shots: `shots/AFTER-fold-*.png`, `shots/AFTER-sheet-*.png`, before/after against
`shots/BEFORE-stacked-*.png`. All ≤ 150 KB, DPR 1, one viewport at rest.

### 1.3 The census — what lives in the fold, and why

| tenant | selector | rect at 390×664 | in the fold? | why it is there |
|---|---|---:|:--:|---|
| masthead / game picker | `.masthead` | 54 → 132.22 | ✔ | the page's identity and its only navigation |
| the worksheet | `.board-cells` | 132.22 → 494.22 | ✔ | the thing being played |
| solve-status events | `.board-margin` | 504.61 → 525.41 | ✔ | **charter constraint** — mark 6's dissolution stands, event-not-region |
| play tools | `#fold-tools` | 539.00 → 589.16 | ✔ | undo / redo / hint are PLAY acts; a fine pointer reaches them by ⌘Z / ⇧⌘Z / H and a finger has no keyboard |
| the ONE affordance | `.drawer-tab` | 616 → 664 | ✔ | the case's tongue — summons everything else |
| everything else | `#controls-drawer` | 664 → 1144 | ✘ (fixed) | settings, not play |

The split is the charter's own question answered from first principles: **the fold holds the
board, what the board just said, the acts you perform ON the board, and one door.** Deal,
difficulty, size, marks, candidates, check, clear, fill, solve, share are all *changes of state
you make between moves*, and they go behind the door.

Log: `logs/24-FINAL-census-390x664.log`.

### 1.4 Component-level plan — what is re-used, verbatim

| component | change |
|---|---|
| `GameControlPanel.vue` | **re-used verbatim.** Its `mobile` arm renders unchanged, in the drawer instead of in flow. One `<Teleport defer>` wraps the existing `.play-controls` div — no logic, no props, no emits moved. |
| `DrawerTab.vue` | **same component, same word, same ARIA.** A media block swaps the axis: 48×92 tucked at the board's right edge on the desk, 92×48 riding the case on the phone. |
| `useControlsDrawer.ts` | **same state, same persistence, same FLIP glide, same focus contract, same Esc.** The `≥1024` early-return is deleted; the default becomes regime-aware; one crossing watcher; one mover gated on the host actually scaling. No new curve, no new listener, no branch inside `glide()`. |
| `HandDrawnOutline`, `SheetWashiLabel`, `OptionSelector`, `BoilDivider`, `CheckStatus`, `DifficultyTally` | untouched. |
| `GameScene.vue` | the stacked twin is **deleted**; the rail becomes unconditional. Net **−1** code line. |
| `useFlipGlide.ts` | untouched. The portrait slide is the same engine: `firstR → lastR` on the rail, and the host's identity delta makes its mover a no-op by arithmetic. |

**The composition inside the drawer is the `mobile` arm, not the rail arm — and that is
deliberate.** Mark 5's critique ("stacked section headers… bolted-on rather than composed") is a
critique of the RAIL's composition: `.staged-section` stanzas each with a bare `<h2
class="section-heading">`, and `zone-row-stacked` putting captions over selectors
(`GameControlPanel.vue`, the `!mobile` branches). The phone arm never had that shape — it has
washi-taped trays, a tab-toggle that shows one section at a time, and captions beside their
selectors. Bringing the drawer down to portrait imports the arm the owner did **not** mark. The
open shot is the evidence.

---

## 2 · THE MECHANISM, IN FIVE MOVES

1. **The regime rule dies.** `#controls-drawer` loses `v-if="rowRegime"`; the `<lg`
   `.mobile-board-width` card is deleted. `rowRegime` survives for one job: `:mobile="!rowRegime"`,
   which picks the composition. P1-W4's "one twin, never both" is not relaxed — there is only one
   card now, so the question is retired.
2. **The parked pose rotates a quarter turn.** `≥1024` keeps `right: 3rem; top: 50%` (the audit-4
   fiction, untouched to the pixel). `<1024` gets `position: fixed; top: var(--vv-height);
   translate: 0 -100%`, closed at `translate: 0 0`. `fixed` is out of flow by construction — a
   fixed box contributes nothing to `scrollHeight`, which is the whole of the 0.705 saving.
3. **The anchor is `--vv-height`, not `bottom: 0`** — see §3, the standing trigger.
4. **The play tools teleport to the fold.** `<Teleport defer to="#fold-tools">` — same nodes, same
   emits, same instance, out of the drawer's inert subtree. `defer` is load-bearing and born of a
   red (`logs/03-HEAD-fold-chromium.log`: `.play-controls present=false` without it).
5. **The tongue rides the case, not the board.** Also born of a red — see §5.

---

## 3 · THE STANDING TRIGGER, FIRED AND MEASURED

`useKeyboardViewport.ts:44-48` carried a clause binding on the next hand:

> the first `position:fixed` surface that mounts below 1024 must anchor on
> `top: var(--vv-height)` with the rest pose on `translate:` — publish the var HERE, in this same
> resize handler, vars before `ensureVisible`.

**This design is that surface.** The clause is honoured to the letter, and then tested with an
ablation rather than cited (`rig/keypad.mjs`, the fake visualViewport of
`mobile-platform.spec.ts:218` driven at the same measured 296px band):

| arm | `--vv-height` | band edge | sheet bottom | deepest chip bottom | clear? |
|---|---:|---:|---:|---:|:--:|
| rest (no keyboard) | 664 | 664 | 664 | 616.92 | ✔ |
| **risen (keypad 296)** | **368** | **368** | **368** | **320.92** | **✔, zero scroll** |
| **ablate** (`bottom: 0` restored) | 368 | 368 | **664** | **616.92** | **✘ occluded** |

Both engines, identical. The ablation reproduces lane B's G4 defect exactly — a
layout-viewport-anchored tray sitting under the keypad — so the anchor is shown *necessary*, not
merely present. And the property it buys is **stronger than the one it replaces**: the shipped
tree seats a control clear of the keypad by spending `--keyboard-inset` as scroll-room and then
scrolling; the sheet seats clear by *riding the visual viewport*, at `scrollY 0`.

Logs: `logs/30-keypad-trigger-chromium.log`, `logs/31-keypad-trigger-webkit.log`.

---

## 4 · THE MEASURED NUMBERS

### 4.1 pageVh — the charter's row

Instrument: `rig/fold.mjs`, metric identical by shape to pass 5's `f3/rig/covis.mjs:112`.
**The base arm reproduces pass 5's banked table in all nine cells before any head figure is read.**

| cell | base cr | base wk | **head cr** | **head wk** |
|---|---:|---:|---:|---:|
| **390×664 THE CASE** | 1.705 | 1.703 | **1.000** | **1.000** |
| 390×844 | 1.341 | 1.340 | **1.000** | **1.000** |
| 375×812 | 1.401 | 1.400 | **1.000** | **1.000** |
| 430×932 | 1.258 | 1.258 | **1.000** | **1.000** |
| 820×1180 iPad P | 1.212 | 1.211 | **1.000** | **1.000** |
| 844×390 land | 2.882 | 2.882 | 1.472 | 1.469 |
| 1280×800 rail | 1.013 | 1.011 | 1.013 | 1.011 | ← unchanged |
| 1440×900 rail | 1.000 | 1.000 | 1.000 | 1.000 | ← unchanged |
| 390×844 fine NEGCTRL | 1.177 | 1.175 | **1.000** | **1.000** |

Logs: `logs/01-BASE-fold-chromium.log`, `logs/02-BASE-fold-webkit.log`,
`logs/22-FINAL2-fold-chromium.log`, `logs/23-FINAL2-fold-webkit.log`.
JSON: `rig/out-fold-{BASE,HEAD}-{chromium,webkit}.json`.

**Landscape 844×390 falls 2.882 → 1.472 as a side effect, and the lane claims nothing by it.**
The lead's charter HOLDS the shipped rung ratified; no cap moved here. The drop is the controls
leaving the flow, on the same board geometry. CH-39's owner eye remains that row's closure leg.

### 4.2 Drawer-open cost — the CH-61 constraint

Instrument: `rig/open.mjs`, pass-5 `BC/rig/stall5.mjs`'s method ported verbatim in behaviour
(same instrument, same arm shape, same four statistics, same DPR 2), with one addition: a CELL
argument, so the portrait number and the desk number are taken in the SAME harness on the SAME
build in the same session — the cross-harness lesson that file's own header states.

| arm | n | worstGap min/med/max (ms) | blocked600 med | bakes | PNG encodes | board size across gesture |
|---|--:|---:|---:|--:|--:|---|
| DESK base (control) | 19 | 289 / **310** / 343 | 310 | 8 | 8 | 666² → 650² |
| DESK head | 19 | 276 / **300** / 333 | 300 | 8 | 8 | 666² → 650² |
| **PORTRAIT head chromium** | 14 | 10.2 / **11.1** / 15 | **0** | **0** | **0** | **366×393 → 366×393** |
| **PORTRAIT head webkit** | 19 | 12 / **15** / 34 | **0** | **0** | **0** | **366×393 → 366×393** |

**Not worsened: the desk arms interleave and cross** (round 1: head 297 / base 292; round 2:
head 284 / base 310), so the ±10 ms between medians is session noise, and the load-bearing
invariants — 8 bakes, 8 encodes, identical shell and logo transitions, identical open geometry —
are equal to the digit.

**Portrait is free, and it is free by construction, not by luck.** Pass 3 attributed ~98 % of the
stall to the grid's raster-stack RE-BAKE, triggered by the board changing size across the
gesture. Those rules (`html.drawer-closed .board-shell.shell-*`) are `@media (min-width: 1024px)`,
so on portrait the board's size is invariant — measured, `366×393 → 366×393`, with the bake and
encode counters reading a literal zero rather than an assumption.

Logs: `logs/25-…`/`26-…`/`27-…`/`28-…`, pooled at `logs/29-FINAL-open-POOLED.log`. Runs: `runs/*.jsonl`.

### 4.3 The open sheet's height — priced as a ladder, not asserted

`rig/capladder.mjs`, `!important` injections on the ONE built artifact (the ladder discipline
pass 4 used for the landscape cap). Engine-identical; chromium shown.

| rung | cap | card top | **tongue top** | internal scroll | grid visible | masthead clear of the CASE | **pageVh (open)** |
|---|---|---:|---:|---:|---:|:--:|---:|
| do nothing (desk formula) | `min(42rem,85vw,100dvh−10rem)−2rem` | 356.50 | 308.50 | 227 | 224.28 (62 %) | ✔ | **1.000** |
| **THIS DESIGN** | `calc(100dvh − 12rem)` | 184.00 | **136.00** | **55** | 51.78 (14 %) | **✔** (3.78 px) | **1.000** |
| masthead-only 9rem | `calc(100dvh − 9rem)` | 136.00 | **88.00** | 7 | 3.78 (1 %) | **✘ the tongue strikes the wordmark** | **1.000** |
| board-half | `calc(100dvh − 22rem)` | 344.00 | 296.00 | 215 | 211.78 (58 %) | ✔ | **1.000** |
| 60dvh | `60dvh` | 257.61 | 209.61 | 129 | 125.39 (35 %) | ✔ | **1.000** |

The `tongue top` column is not decoration. The rig's first cut read the CARD's top alone and
scored the 9rem rung "masthead clear" while its tongue was striking the wordmark's last glyph
clean off — a metric that cannot see the defect it exists to catch, which is this campaign's
proxy≠surface family in miniature. The column that governs is the case's topmost painted edge,
and the shot is what caught the first one.

**`pageVh` is 1.000 at every rung.** The charter's number is won by the card leaving the flow, not
by the cap — so this election is a taste question the owner may re-cut without reopening the row
it closes. That is the single most useful fact in this dossier.

The elected cap has a derivation and not a tuning: **the sheet, tongue included, stops below the
masthead.** 12rem = 9rem (the measured chrome band, 132.22 chromium / 131.63 webkit) + 3rem (the
tongue's own 48 px, which rides 48 px proud of the case). Its price is 55 px of internal scroll at
390×664 — the shortest phone in the ladder; 390×844 and every taller cell fit whole.

Logs: `logs/16-capladder-chromium.log`, `logs/17-capladder-webkit.log`.

### 4.4 Floors and suites

| gate | result |
|---|---|
| **a11y — the 30-row floor** | **30 / 30, both engines**, on the final tree (`logs/34-floors-a11y-FINAL.log`). Includes 3.3 options 5/5 and 3.4 k-peek. |
| **guardTitle one-string** | untouched — no guard rides along (§6). |
| **44px coarse floor, both dimensions** | green INSIDE the sheet (`zone-grammar.spec.ts:462`). |
| **unit suite** | **444 / 444**, 41 files. |
| **e2e suite** | **267 passed / 6 failed** (3 specs × 2 engines) — down from 28 at first contact. §7 names each. |
| `vue-tsc -b` | 0 |
| `vite build` | 0 |
| prettier | clean |

---

## 5 · TWO DEFECTS THIS LANE FOUND IN ITS OWN DESIGN

Recorded because a dossier that only reports what worked cannot be rebuilt from.

**(a) The teleport with no target.** `<Teleport to="#fold-tools">` resolved against a document the
scene had not been inserted into yet; the target came back null and the play tools vanished from
the tree entirely — `present: false`, measured in `logs/03-HEAD-fold-chromium.log`. Cure:
`defer` (Vue 3.5), which exists for precisely this case. The same absence red the unit suite six
rows deep, and the unit fix now mints the berth and reads the tools from it.

**(b) The tongue under the board could not close the sheet.** With the tongue left in the fold at
the board's bottom edge, an open sheet covered it and there was **no way to close the drawer by
touch at all** — found by `mobile-affordances.spec.ts` timing out on the tap
("subtree intercepts pointer events"), not by inspection. The asymmetry is real and worth stating:
on the desk the case slides AWAY from the board, so a board-anchored tongue is never covered; on a
phone the case slides OVER it, so it always is. **Cure: below 1024 the tongue belongs to the case.**
It teleports into a `.drawer-handle` berth at the case's top-right — closed, that berth is the
48 px poking up from under the screen's bottom edge; open, it is the handle on the risen sheet.
This also forced `inert` to split by regime (an inert rail is an unopenable drawer) and the cap to
pay the tongue's 3rem (§4.3), and it surfaced a latent bug: the tab's counter-scale mover was
injecting the desk's `translateY(-50%)` where the host never scales, so it is now gated on the host
actually scaling — a measurement, not a regime flag.

---

## 6 · a11y — what changed and what deliberately did not

- **The portrait drawer is NOT a modal dialog.** No `aria-modal`, no focus trap, no scrim, no
  `alertdialog`. It stays `role="region" aria-label="controls"`, the same landmark as the desk,
  with the same `aria-expanded` / `aria-controls` pair on the same button and the same Esc close.
  The charter's "drawer alertdialog semantics **if the guard rides along**" is answered: the guard
  does not ride along, so the 30 a11y rows are untouched and bank green unchanged.
- **`inert` splits by regime, and the contract is identical either way.** ≥1024: the rail is inert
  and hidden at closed-idle (shipped behaviour, byte-untouched). <1024: the CARD is inert and
  hidden, the rail is not — because the rail carries the tongue. At closed-idle the only reachable
  thing inside `#controls-drawer` is the tongue, which is the only thing that should be (W11 UI-6).
- **Focus.** `focusPanel()` on open-settle lands on `.mobile-heading-btn` (the first section tab) —
  measured in the open-cost rig's `focusInPanel: true`. Close returns focus to the tongue, whose
  DOM home moved but whose ref did not.
- **One consequence to disclose:** below 1024 the `controls` region is present in the AX tree at
  rest (it was absent before). It is named, and it contains exactly one named button. A screen
  reader hears "controls region, controls button" rather than "controls button". This is a real
  change and it is the price of the tongue being reachable; it is the owner's to accept.

---

## 7 · THE EXACT ESTATE DIFF SHAPE

### 7.1 Product code — comments stripped from both sides, then diffed (`logs/33-loc-ledger-stripped.log`)

| file | +code | −code | net | what |
|---|---:|---:|---:|---|
| `src/games/shared/scene.css` | 52 | 13 | **+39** | the portrait parked pose, the handle berth, the fold band, the cap arm; `.mobile-board-width` deleted |
| `src/games/shared/DrawerTab.vue` | 26 | 9 | **+17** | the rotated pose + the radius/writing-mode swap |
| `src/games/shared/useControlsDrawer.ts` | 19 | 5 | **+14** | regime early-return deleted; regime-aware default; crossing watcher; mover gate |
| `src/games/shared/useKeyboardViewport.ts` | 5 | 0 | **+5** | `--vv-height` published + cleaned up |
| `src/games/shared/GameControlPanel.vue` | 31 | 29 | **+2** | one `<Teleport defer>` wrapper (the rest is re-indent) |
| `src/games/shared/GameScene.vue` | 13 | 14 | **−1** | stacked twin deleted; rail unconditional; berths added |
| `src/assets/index.css` | 1 | 1 | **0** | print list: `.mobile-board-width` → `.fold-tools` |
| **TOTAL** | **147** | **71** | **+76** | six files, no new component, no new composable |

Raw diff including prose: `+391 / −112` on src (`logs/32-loc-ledger.log`) — the estate's comment
budget, deliberate.

### 7.2 Tests — what the LAND lane must carry

**Already written and green in this worktree** (+90 / −46 code lines):

| file | change | rows |
|---|---|---|
| `e2e/zone-grammar.spec.ts` | `.mobile-board-width` → `#controls-drawer`; `openDrawer()` helper | 3 × 2 ✔ |
| `e2e/mobile-affordances.spec.ts` | play-tool rows → `#fold-tools` (no open); setting rows → `openDrawer()`; one close-then-play step | 4 × 2 ✔ |
| `e2e/visual-regression.spec.ts` | two-regime selector collapses to `.controls-card`; phone arm opens the drawer | 1 × 2 ✔ |
| `e2e/board-covisibility.spec.ts` | ticket selector; `#fold-tools` as the in-flow referent; negative control re-derived | 3 × 2 ✔ |
| `src/games/shared/GameControlPanel.test.ts` | berth minted in `mountPanel`; play-tool rows read the berth | 6 ✔ |

**Owed — three specs, genuine rewrites, not selector churn:**

| spec | why it reds | what the replacement must assert |
|---|---|---|
| `e2e/drawer.spec.ts:281` "<1024: no tab, stacked panel in flow exactly as today" | **it IS the retired rule.** Asserts `.drawer-tab` hidden and `.mobile-board-width` visible below 1024 | the new rule: the tongue is visible and tappable, `#controls-drawer` is `position: fixed`, the card is hidden+inert at rest, a persisted-closed drawer still lands closed, and a persisted-OPEN desk choice does not carry across the crossing |
| `e2e/font-census.spec.ts:207` "the ledger holds BOTH directions" | 4 ledger rows now produce no cell — the mobile card is hidden at rest, so its fonts are uncounted | open the drawer for the mobile cells; the census itself is unchanged |
| `e2e/mobile-platform.spec.ts:307` the 296 px keypad band | `roomAfter − roomBefore` = 221 where ≥288 was required. **221 + 74.84 (the fold's slack) = 295.84 ≈ 296** — the room is still the full band, part of it was simply already there | the metric moves from *doc growth* to *the control seats clear of the band*, and it now passes by ANCHOR at `scrollY 0` rather than by scroll-room. `rig/keypad.mjs` is the measurement and the born-RED ablation ready to become that spec |

### 7.3 Not in the diff, and deliberately

`useFlipGlide.ts`, `App.vue`, `GameBoard.vue`, `useCoarsePointer.ts`, `pencilConfig.ts`, every
`games/*/`, every pencil component. No new component, no new composable, no new curve, no new
listener, no new persisted key.

### 7.4 Scratch file to drop

`web/frontend/playwright.pass6.config.ts` — this lane's ports-rule config (no `webServer`,
baseURL 4231). Not part of the design; the LAND lane does not carry it.

---

## 8 · RISKS, RANKED

1. **RISKIEST — the open sheet is a mode: it leaves 51.78 px of grid (14 %) and you cannot touch
   the board while it is up.** Measured, and written into `mobile-affordances.spec.ts` as a
   close-then-play step rather than left as prose. The defence: the fold keeps the board, the
   status strip and the three play acts, so *playing* never needs the sheet; the sheet holds
   settings, which are things you change between moves. The mitigation is priced, not hypothetical
   — §4.3's ladder buys 58 % of the board back for 215 px of internal scroll, at unchanged
   `pageVh 1.000`. **This is the owner's call and the one I would put in front of them first.**
2. **55 px of internal scroll at 390×664** puts the action row (Clear / Fill / Solve / Share) one
   short swipe below the sheet's fold. Only at the shortest cell; taller phones fit whole.
3. **The `controls` region is now present in the AX tree at rest below 1024** (§6). A real change,
   small, disclosed.
4. **Drawer open + OS keyboard up** drives the sheet's top to −112 (it is taller than the 368 px
   band that remains). Nothing is occluded — the measured claim — but the sheet's top is off-screen.
   Rare combination; the drawer is closed while typing.
5. **A persisted-open desk choice crossing into portrait** is parked by a watcher, non-persisting,
   so rotating back restores the desk's own choice. Not exercised on a real rotating device.
6. **Landscape 2.882 → 1.472** is unclaimed and unratified here. The lead HOLDS the shipped rung;
   CH-39's owner eye is still that row's closure leg.
7. **U-10 — nothing in this dossier closes mark 3 or mark 6.** Both close only on the owner's
   re-look. Every "reaches", "holds", "is not worsened" above is a measurement on this lane's
   build, not a cure of record.

---

## 9 · REBUILD INSTRUCTIONS FOR THE LAND LANE

1. Apply §7.1's six files. `GameScene.vue` and `scene.css` are the load-bearing pair — the class
   contract at the head of `scene.css` names every class the templates must carry.
2. `defer` on both Teleports is not optional (§5a).
3. The tongue must be teleported into `.drawer-handle`, and `inert` must split by regime (§5b),
   or the drawer cannot be closed by touch.
4. Carry §7.2's five green spec files; write the three owed ones.
5. Re-derive every number at citation: `rig/fold.mjs`, `rig/open.mjs`, `rig/capladder.mjs`,
   `rig/keypad.mjs` all take `<baseURL> <engine>` and print their own tables. The base arm of
   `fold.mjs` must reproduce pass 5's nine cells before any head figure is banked.
6. Banked artifact: `dist-head.tar.gz` (366,394 B, md5 `f1bf4e5faa0a75c07be1a168cdc8e4a5`) with
   the 39-row file manifest at `dist-head.md5` — the pass-5 §2 policy, honoured.
