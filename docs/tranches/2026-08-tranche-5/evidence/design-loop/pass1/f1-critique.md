# F1 "CADENCE STRATA" — ADVERSARIAL CRITIQUE (pass 1)

Non-author lane. Read: `charter-f1.md`, `f1-research.md`, `f1-spec.md`, `f1-proto/MANIFEST.md`
and every artifact under `f1-proto/`. Verified read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`. No dev server,
no port touched, nothing written outside `pass1/`.

**Verdict: ~35% converged.** One stratum of three is built. The family's headline measured
correction — the one it calls "THE ONE KILL" — is an artifact of a fabricated option label in
its own mock, and re-deriving it against the shipped constants very likely reverses it. Three
of the owner's five marks have **zero artifact**: the prototype's own screenshots show the Deal
affordance and the stanza stack exactly as they are today.

---

## 0 · WHAT IS ACTUALLY TRUE HERE (verified, so the rest reads fairly)

The research dossier is the best thing in this family and its citations hold. I spot-checked
eleven; all eleven are accurate:

| Claim | Cited | Verified |
|---|---|---|
| desktop `OptionSelector` is a vertical column | `OptionSelector.vue:28` | ✓ exact, `mobile ? 'options-row' : 'flex flex-col …'` |
| host mover is translate **+ scale** | `useControlsDrawer.ts:211-216` | ✓ `flipTransform(firstH,lastH)` |
| the tab needs a counter-scale mover because of it | `:228-236` | ✓ (`if (tab)` at 229) |
| `.in-live-face :deep(.drawer-tab){display:none}` precedent | `GameScene.vue:126-128` | ✓ byte-exact |
| `.controls-card` cap is row-regime only | `scene.css:38-46` | ✓ and `GameScene.vue:96,101` confirm `hidden lg:flex` |
| mobile card has no cap/overflow | `scene.css:120-122` | ✓ |
| `setErrorCheckMode` arms `checkArmed`; every edit disarms | `useAssists.ts:42-46,63` | ✓ — **CONTRADICTION 1 is real and is the best insight in the family** |
| `ERROR_CHECK_CYCLE`/`cycleErrorCheckMode`/`toggleCandidates` dead in `src/` | `useAssists.ts:34,47,70` | ✓ (consumed only by `useAssists.test.ts:55,57,59,72`) |
| `MarginNote` is `pointer-events:none` + `role=status aria-live=polite` | `MarginNote.vue:52-56,85-87` | ✓ — the charter's suggested host is correctly refused |
| `share-truth.spec.ts:57` = `.controls-card button.icon-btn` `.nth(4)` | | ✓ and its own comment confirms Undo/Redo/Hint sit **after** Share, so `nth(4)` survives their removal |
| panel branch spans 330–526 / 529–710 | | ✓ exact (`v-if="mobile"` at 330, `v-else` at 529, `</template>` 711) |

The MANIFEST also self-corrects the spec honestly in two places (AssistSettings −46 → −26,
GameControlPanel −520 → −302) and reports its own parsimony failure rather than burying it.
That is real intellectual honesty and it should be preserved in agglomeration.

Everything below is what breaks.

---

## 1 · THE LEAD FINDING — "THE ONE KILL" IS AN ARTIFACT OF A FABRICATED OPTION LABEL

`mock/f1-mock.js:13-17`:

```js
// ── OptionSelector option fill (labels are the real ones) ───────────────────
const LABELS = { 4: ["4×4", "9×9", "16×16", "25×25"], 3: ["easy","medium","hard"], 2: ["Off","On"] };
```

**"the real ones" is false.** The shipped constants:

- `src/games/sudoku/ControlPanel/constants.ts:4-8` — **three** sizes: `4×4`, `9×9`, `16×16`. There is no `25×25`.
- `src/games/futoshiki/ControlPanel/constants.ts:14-19` — four, but all narrow: `4×4 5×5 6×6 7×7`.
- thermo/killer/kenken import sudoku's three (`thermo/game.ts:18`, `killer/game.ts:19`).

**No shipped game renders a `25×25` option, and it is the widest glyph in the mock.**

The card's width is set by its widest row. Modelling Fira Code at `md:text-[1.25rem]`
(0.6em advance = 12px/char), `.ctrl-btn` `px-3` = 24px, `gap: .25rem` = 4px, card
`p-5` ×2 + 3px border ×2 = 46px chrome:

| card content | modelled width | measured |
|---|---|---|
| mock (`4×4 9×9 16×16 25×25`) | **346.0** | **346.0** (`results-chromium.json` `rowsOff+horiz.cardW`) |
| real sudoku (`4×4 9×9 16×16`; difficulty binds) | **294** | — |
| real futoshiki (`4×4 5×5 6×6 7×7`) | **298** | — |

The model reproduces the mock to 0.0px, so it can be trusted forward. Now re-run the strip
geometry the MANIFEST §3 killed the ≥lg pose on (row = board + `gap:3.5rem` + card, centered;
strip needs 66.3 + 12px gutter = 78.3):

| viewport, drawer OPEN | card 346 (their mock) | card 294 (real sudoku) |
|---|---|---|
| 1024×768 — strip left edge | **−71.3** (they measured −69.9) | **−45.3** |
| 1024×768 — with the 4.25rem host gutter | **−3.3** (they measured −8.8) | **+22.7 ✓ CLEARS** |
| 1180×820 — strip left edge | **−19.3** (they measured −18.8) | **+6.7 ✓ CLEARS bare** |

The model lands within 1.4px of all three of their own measurements, which is the strongest
available evidence that the only variable that moved is the phantom `25×25`.

**Consequences, all blocking:**

1. The MANIFEST's §3 headline — *"Spec decision 3's ≥lg pose is dead … the strip's media query becomes `@media (min-width: 1280px)`"* — is unsupported. With the real option set, 1180 clears bare and 1024 clears with the 4.25rem gutter the family explicitly rejected ("*a gutter wide enough for 1024 pushes the row past the viewport*" — it does not; at card 294 the row is 960 of 1024).
2. Therefore the **fixed viewport tray on desktops from 1024 to 1279** — the family's ugliest consequence, and the thing `GameToolbar.vue` now hard-codes at `@media (min-width: 1280px)` with a 12-line derivation comment — is probably unnecessary machinery bought with a bad number.
3. The `position === "absolute"` gate in `useControlsDrawer.f1.ts:52`, justified as "*load-bearing, not defensive*" purely because of the 1024↔1280 gap, likewise.
4. `results-b-chromium.json`, `results-d-chromium.json` and the §3 table are all downstream of `cardW = 346` and must be re-run per game.

Secondary contamination in the same block: the mock's Marks row and Check row both render
`["easy","medium","hard"]` (`data-n="3"` → `LABELS[3]`), not `Normal/Corner/Center` and
`Off/Ask/Live`. Those rows are ON in the **baseline** variant, so the baseline overflow
figures (+430 / +371) and `baseline_mobileCardH = 571.5` are measured against a card whose
widest rows are wrong. Height-wise the error is small (one row is one row); width-wise the
whole `cardW` axis is fiction.

---

## 2 · FAILURE-MODE CHECKLIST — ROW BY ROW, WITH EVIDENCE

### 2.1 Vacuous convergence — **PRESENT, structural**

`MANIFEST §1` labels six artifacts **"SPEC-COMPLETE CODE"** and then states they were never
built: *"Not type-checked — the slice deliberately never enters the project tree, so `vue-tsc`
can't see it."* `MANIFEST §2` then reports four falsification tests as **PASSES**. Those tests
did not run the code. They ran `mock/f1-mock.html` — a 135-line hand-written static replica with
**no Vue**, and `mock/f1-mock.js:2-5` says so: *"The glide is the SHIPPED engine, **transcribed**."*

So `results-c-*.json`'s `"movers": 5` asserts that `mock/f1-mock.js:63` pushed five specs — it
says nothing about `useControlsDrawer.f1.ts`. The `PASSES` verdicts are about the transcription's
fidelity to itself.

**This is not hypothetical — it hid a real defect.** See 2.3.

### 2.2 Spec-cites-itself circularity — **partially present**

`GameToolbar.vue:20-22` and `:164-176` cite "the prototype measured" as the authority for the
1280 seam; `useControlsDrawer.f1.ts:50-51` cites "MEASURED: max |1 − (host × strip)| = 0.19%".
Both are the mock citing the mock. The research dossier does **not** do this — every number
there is token arithmetic or a repo-recorded figure, labelled ANALYTIC/RECORDED. The circularity
enters only at the prototype layer, where a first-party check (the shipped constants) was
available and skipped.

### 2.3 Gates that cannot fail — **PRESENT, three instances**

**(i) Falsification (d), the gallery-face vanish, is un-failable and it masked a real bug.**
The rig has no Vue, hence no scoped-CSS attribute rewriting. In the real tree:

- `scene.css` is consumed by exactly ONE component — `GameScene.vue:109`, `<style scoped src>`. I grepped: no other file imports it, and `SudokuGame.vue` has **no `<style>` block at all**.
- `scene.f1.css` adds `.game-toolbar` as a bare selector to all three fade lists (`controls-fade-in`, `.scene-leaving`, `html.gallery-leaving`). Scoped, those compile to `.game-toolbar[data-v-<GameScene>]`.
- `GameToolbar` is rendered from **`SudokuGame.vue`'s `#toolbar` slot** (`SudokuGame.diff:23-32`). Slot content is compiled in the *providing* parent's scope; a child's plain scoped selector cannot reach it — Vue 3 requires `::v-slotted()` for exactly this case.

**All three fade rules are dead selectors.** Result: the toolbar pops in with no fade on scene
mount, stays fully opaque through the 200ms `scene-leaving` fade while every other piece of
chrome dissolves, and stays opaque through `html.gallery-leaving` beat 0 until `.in-live-face`
snaps it to `display:none`. The kill rule *does* work — `GameScene.f1.vue:50` uses `:deep()`,
which drops scoping. So the family shipped one selector that works and three that don't, and
its rig verified the one that works.

**(ii) The occlusion instrument is one-dimensional.** `measure-d.mjs:18-19`:

```js
occludesCard: +(Math.max(0, r.card.rect.bottom - r.toolbar.top)).toFixed(1),
occludesMarginVoice: +(Math.max(0,(r.board.bottom+28) - r.toolbar.top)).toFixed(1)
```

No horizontal term. It cannot distinguish "does not overlap" from "does not overlap
vertically". The MANIFEST §3's clearing table ("occludes the controls card — 0px, 0px, 0px, 0px")
rests entirely on it. The same file's own 1280×800 row records `"occludesCard": 355,
"occludesMarginVoice": 454.4` — meaningless numbers for a strip parked 400px to the left, which
is precisely the point: the metric is noise, and the row is silently omitted from the MANIFEST's
table. Conclusion happens to be right for the tray; the instrument cannot establish it.

**(iii) The keypad test assumes its own conclusion.** `measure.mjs` sets
`keypadPx: 336` directly. §7 concedes it: *"the keypad inset is simulated … What is **not**
proven is that iOS Safari publishes a truthful inset mid-entry."* But `f1-spec.md` §Prototype
slice 4(a) named that as the killer: *"if `--keyboard-inset` fails the tray in real Safari, the
mobile claim DIES (fallback to test: board top-edge row; if that's also occluded, the family
folds)."* The `perf-rig-iphone16` sim is BOOTED. The one test that could fold the family was
replaced by a test that cannot.

### 2.4 The elegant-reduction trap ("and then the hard part") — **PRESENT, and it is the biggest gap**

`MANIFEST §5`, verbatim: *"The slice itself is additive by construction — it adds the toolbar and
scaffolds the measurement **without paying the panel rewrite**."*

The panel rewrite **is** the family. Marks 1 and 2 — the owner's Deal weight and the drawer's
composition grammar — live entirely in the ticket, and the ticket has:

- no component, no diff, no mock, no measurement;
- a `−302` line budget derived from spans, and nothing else;
- one prose paragraph (`f1-spec.md` lines 12-16).

Look at what the family's own artifact renders. `shots/f1-1440x900-stripPose.png`, the *F1*
shot, not the baseline:

- the eyebrow `NEW GAME` in display caps, then `SIZE` in display caps, then `DIFFICULTY` in display caps — **the stanza stack, intact** (mark 2 uncured);
- Deal as a ~10px glyph with a caption sublabel, the smallest and faintest element on the card, subordinate to the three headings and to every option word it commits — **mark 1 uncured, and visibly so**;
- the four `.icon-btn`s (Clear/Fill/Solve/Share) still a flat undifferentiated row;
- the `KeyboardLegend` still listing `K peek` and `P pencil` for controls the design has moved to a toolbar that does not carry them in this slice.

The family produced a picture of the problem and labelled it the solution's prototype.

Also deferred inside the built stratum: the roster is **7** in `f1-spec.md`; `GameToolbar.vue`
ships **4** and says the other three are "additive rows against the same skeleton". They are not
— see 3.1.

### 2.5 Legacy aliases — **ABSENT (clean)**

`OptionSelector.f1.vue` deletes the `mobile` prop outright rather than defaulting it;
`PencilModeToggle.vue` is deleted, not deprecated; the vertical branch is removed, not gated.
The one thing kept alive beside its replacement — the double controls-card mount — is a
deliberate, argued decision (35 e2e locators' disambiguation premise), not an alias. Good.

### 2.6 Masked fallbacks — **PRESENT**

The ≥lg pose failed measurement and the family did not fail with it — it silently fell back to
the other pose across the whole 1024–1279 band. `shots/f1-1024x768-trayPose.png` is what that
renders: a mobile thumb-tray floating in the dead seam between the board and the controls card,
centered on the **viewport** (512) while the board is centered at 311 and the card at ~845 —
anchored to nothing on screen, 200px right of the object it serves. The MANIFEST clears it on
arithmetic alone (§3: "*honest in the row regime too*") and never looks at it. `results-d`'s
`trayW: 220` for four items; the designed seven would make it ~409 wide, i.e. wider than the
1024-viewport board's own margin gap.

### 2.7 Unverified gestalt — **PRESENT**

Nine screenshots were rendered and **not one composition judgement appears anywhere** in the
MANIFEST. The shots are cited only as geometric evidence (`shots/f1-1024x768.png` is cited once,
inside a CSS comment, to prove a masthead collision). Three things the shots show that the prose
never engages:

1. **Two grammars for one component, 100px apart.** `GameToolbar.vue:247-256` makes `.icon-sublabel` *persistent at every pointer*; `GameControlPanel.vue:851-859` keeps it `display:none` on fine pointers (the hover-washi carries the name there). At 1440 the strip therefore writes "Undo Redo Hint" under its icons while the card's Clear/Fill/Solve/Share sit as bare glyphs a few inches away. Visible in `f1-1440x900-stripPose.png`. The spec's claim that `.icon-btn` is "reused verbatim" is false in the same file: the toolbar always uses the *coarse* column shape (`min-width/min-height` + `flex-direction: column`), the panel uses that only under `@media (pointer: coarse)` (`GameControlPanel.vue:874-892`).
2. **The strip reads as an orphan, not as marginalia.** At 1440 it is a rounded paper pill in the page's empty left gutter, unattached to the sheet, competing with the `controls` tongue on the opposite flank at ~2.3× the tongue's visual mass. Whether it reads as "in the pencil hand" is exactly the question the charter posed and the artifact does not answer.
3. **The mock's mobile geometry does not match the app.** In `f1-390x664-keypad.png` the board is left-flush at x=0 and ~334px wide (real: 366, centered with 12px margins per `.mobile-board-width`/`GameBoard.vue:217`), and the margin voice sits in a right-hand column rather than below the board. Every mobile figure (`f1_pageViewports 1.061`, `f1_mobileCardH 281.1`) inherits that layout.

### 2.8 Consumer-less substrate — **ABSENT, narrowly**

`useControlsDrawer.f1.ts`'s fifth mover has exactly one consumer (`GameToolbar`) and it is gated
off when unused. `GameScene.f1.vue`'s `#toolbar` slot is `null`-safe for games that mount
nothing. `.toolbar-slot { width:0; height:0 }` is genuinely careful work: it keeps the flex host
shrink-wrapped so `AnswerKeyLaminate`'s `inset: 0` stays aligned — the research's Q2 cost #2,
correctly paid. No orphan machinery. Credit where due.

---

## 3 · WHAT THE REAL CODE SAYS ABOUT THE SPEC'S CLAIMS

### 3.1 The designed 7-item tray does not fit a phone — **re-derived from their own measurement**

`results-d-chromium.json` gives the 4-item tray at `trayW: 220`, which decomposes exactly as
`3×44 (icons) + 48.1 (Check chip, from MANIFEST §2a) + 3×5.6 (gap .35rem) + 16 (padding) + 6
(outline) = 219.0`. Adding the three specified-but-unbuilt items at the same
`min-width: 2.75rem` floor and ~6.4px/char for the hand font at `--type-small`:

| item | width |
|---|---|
| Peek (4 ch, floor binds) | 44 |
| Marks (5 ch) | ~48 |
| Candidates (10 ch) | ~80 |
| + 3 gaps | 16.8 |
| **7-item tray** | **≈ 409** |

**iPhone 16 portrait is 390 CSS px. iPhone 13 mini / SE is 375.** The full roster overflows by
~19px and ~34px respectively — before the `HandDrawnOutline` `:outset="3"` on each side. The
"additive rows against the same skeleton" claim is false for the pose the family's whole mobile
case rests on. Marks is additionally a *cycle chip* whose label changes (`off/corner/center`),
so its width — and the whole tray's centering — jitters on every `P`.

### 3.2 The mobile tray occludes the board it serves, exactly during entry

`f1-390x664-keypad.png` (the artifact the family calls a PASS) shows the tray painted **over the
grid**, covering ~57px of board height across ~214px of its 366px width — roughly 8 cells —
because `z-index: 55` puts it above `.board-margin`'s 50 and above the board. The `+8px keypad
clearance` figure is true and irrelevant: the clearance measured is to the *keypad*, never to
the *board*. At the 7-item width (409 > 366) the tray would span the board edge to edge.

Compounding it, MANIFEST §4 residual 1 concedes that `computeScrollDelta(cell, band, gap = 24)`
(`useKeyboardViewport.ts:47-51`, verified) seats the focused cell 24px above the band bottom —
i.e. **into the tray**. The proposed fix, `gap = 24 + trayHeight ≈ 66`, is a magic constant
coupling a composable to another component's rendered height, is untested, and at 390×664 with
a 336px keypad leaves a 238px usable band for a 366px board.

The charter asked for "the thumb-reach row (bottom of board, above the fold)". What was
delivered is a floating pill over the playing surface.

### 3.3 A live filter gets size-tweened for 520ms — a direct T4-P1 hazard

`GameToolbar.vue:219`: `.icon-btn { filter: url(#grain-static); }` — copied from
`GameControlPanel.vue:816`. `#grain-static` is a real live SVG filter
(`pencilConfig.ts:233`: *"feTurbulence + feDisplacementMap chattering stroke"*).

In the shipped app those filtered buttons live in the **rail**, whose mover is
**translate-only** (`useControlsDrawer.ts:222-226`). They are never scaled. F1's strip is
`scale()`-animated for the full 520ms by mover 5 — so 3 (designed: 7) live-filtered elements
re-rasterize their filter region every frame of every drawer gesture. That contradicts the
drawer engine's own stated invariant three lines above the mover it clones
(`useControlsDrawer.ts:207-210`: *"it rasters at its FINAL size from frame one (the crit kill —
the filtered board's SIZE is never tweened)"*), and it is precisely the class of defect the
active T4-P1 Safari campaign exists to remove. `BoilDivider.vue:44` records the house's own
prior measurement of a related composition: *"grain-static pose through the surrounding card's
filter chain: measured ~10 fps."*

`MANIFEST §7` confirms this could not have been caught: *"The mock also carries no live SVG
filters, no boil beat, and no Vue."* The spec's assertion (`f1-spec.md:57`) that reuse means
"no new filter surface" conflates *frozen filter value* with *no new filtered surface*; the
constraint in play is a rasterization constraint. **The DrawerTab precedent does not cover
this** — I checked: `DrawerTab.vue` carries no `filter` at all.

(By contrast the `HandDrawnOutline` frame is fine: `pose`-less enrolment gives pre-baked
opacity-swapped sibling paths, steady-state raster zero — `HandDrawnOutline.vue:23-25,79-83`.
One extra beat subscriber per scene, no rasterizer.)

### 3.4 `role="toolbar"` is an unimplemented ARIA contract

`GameToolbar.vue:73-75` declares `role="toolbar" aria-label="Play tools"
aria-orientation="horizontal"`. There is no roving `tabindex`, no arrow-key handler. The ARIA
APG toolbar pattern is a *single tab stop* with arrow-key traversal; declaring the role without
it tells AT one thing and behaves as another. There is **no `role="toolbar"` anywhere in the
existing tree** (grepped `src/` and `e2e/`) — this is a new pattern with no house precedent to
inherit from. Separately, `aria-orientation="horizontal"` is hard-coded while the ≥1280 pose is
`flex-direction: column` (`:189-193`) — a static lie in the very pose the family calls its
center.

The charter binds "the a11y contracts … are inherited obligations, not optional."

### 3.5 Focus order inverts visual order at ≥1280

DOM order inside `.board-peek-host` becomes board → `DrawerTab` → `.toolbar-slot`. At ≥1280 the
strip renders **left** of the board (`right: calc(100% + 0.75rem)`) but is tabbed **after** all
81 cells and after the right-edge tab. WCAG 1.3.2 / 2.4.3. Not mentioned anywhere.

### 3.6 The desktop-scroll PASS is a proxy measurement, not F1's card

`results-chromium.json` `rowsOff+horiz` = the *current* panel with three rows `v-if="false"` and
horizontal selectors. F1's designed card is a different object: it *deletes* the stanza headings,
the peek-hold surface and the tab machinery, and it *adds* a dominant Deal (`DiceIcon :size="34"`
+ a written verb at `--type-subheading`, per `f1-spec.md:57`) and a **check-mode footnote row**
that the measurement scaffold had switched off entirely. So the F1 card was never measured.

The good news, from their own data: `clientH` is 486 at 1024×768 against a 570 cap — 84px of
headroom, comfortably enough to absorb a caption-register footnote. So success test 1 is
*plausible*; it is not *evidenced*. Note also `clientH 570` vs. the token-derived cap 576, and
`634` vs. 640 — a consistent 6px offset from the mock putting a 3px border on `.controls-card`
itself where the real app wraps it in `HandDrawnOutline`. Small, but it confirms the mock is a
replica, not the thing.

Independently: `OptionSelector.f1.vue:47` adds `flex-wrap: wrap` as "the honest overflow". A
wrapped 4-option row is a two-line row — i.e. the vertical stacking the family just deleted,
reintroduced as an unmeasured fallback path. Nobody measured a card in which it fires.

### 3.7 Net-LOC: the family's own binding gate is RED and was deferred to me

Charter: *"a family wins partly on net-LOC … The family wins only if net LOC falls."*
Spec success test 5: *"net LOC ≤ −150."* MANIFEST §5 measures **+71**, and even after two
speculative recoveries lands at **≈ −6** — then writes: *"**CRITIQUE must rule on whether F1's
real-estate and reachability wins justify a net-neutral LOC family.**"*

**Ruling: no, not as scoped.** Not because net-neutral is disqualifying in principle, but
because the ledger is not yet a real ledger. Three costs are missing from it:

- `useAssists.test.ts:55,57,59,72` consume the three "dead" exports; deleting them edits a unit test (the −11 assumes free).
- the e2e row is booked at `~±0`. Verified affected: `mobile-affordances.spec.ts:161-190` scopes undo/redo/hint to `.mobile-control-panel` and asserts `.icon-sublabel` text (6 `icon-sublabel` refs in that file alone); the `.peek-hold-surface` ≥44 assertion (`:268,283-284`) loses its element entirely when the peek surface dissolves; three `.controls-card` visual goldens (`visual-regression.spec.ts:138,193,216`) re-baseline under the standing "one deliberate act at tranche end, from the runner artifact" rule.
- `OptionSelector`'s `mobile` prop deletion touches 7 call sites (the diff says so); `PencilModeToggle.vue:17,43` is one of them and is deleted anyway, but the count is asserted, not enumerated.

Fix the ledger first; the honest number is probably worse than +71 before the recoveries and
around break-even after. The MANIFEST's two named recoveries (comment-density parity, collapsing
the 5× mount into `GameScene` behind a `toolbar?: false` opt-out) are both sound and the second
is a genuine improvement to the design, not just to the count — it should be adopted regardless.

---

## 4 · MARK-BY-MARK: DOES F1 CURE WHAT IT CLAIMS?

The charter claims marks **5, 1, 3, 2**.

| Mark | Claim | Reality |
|---|---|---|
| **5 — Check/Candidates contrived** | "the core" | **Best-decided item in the family, weakest-built.** The cadence *split* (`useAssists.ts:42-46` proves "Ask" is a per-move verb in preference clothing) is a genuine discovery and the Check chip's same-value re-emit is the correct, verified mechanism. But the mode's demotion to a card footnote has no artifact, `AssistSettings.vue`'s edit is unwritten, and Candidates' pin chip is unbuilt (and pushes the tray over 390px, §3.1). **Decided ≈ 65%, built ≈ 25%.** |
| **1 — Deal weight ≪ rank** | "the ticket IS the refined NEW GAME panel" | **Zero artifact.** The prototype's own F1 shot shows today's 28px dice + caption sublabel unchanged. **≈ 10%.** |
| **3 — mobile is a compressed desktop** | "thumb geography instead of a tall card" | Page 1.49 → 1.061 viewports is a real, measured win — on a proxy card, in a mock whose mobile board geometry is wrong, with the reserve pushing it back to 1.163 (over the family's own ≤1.15). The tray occludes the board (§3.2), the 7-item roster doesn't fit (§3.1), and real Safari was never opened. **≈ 40%.** |
| **2 — drawer has no composition grammar** | "the drawer shrinks, so the 520ms glide reads cleaner without retuning" | The *structural* claim (centre-anchored translate-only rail mover ⇒ no retune) is verified and correct (`useControlsDrawer.ts:222-226`, `scene.css:83-89`). The *grammar* — the thing the owner marked — is untouched: the stanza stack, the display-caps headings, the flat action row all render identically in the F1 shot. **≈ 20%.** |
| 4 — pose-bake / no new live filters | binding constraint | **Violated in spirit and probably in fact** (§3.3): live-filtered elements enter a 520ms scale tween. |
| 7 — picker hierarchy | not claimed | correctly out of scope; nothing lost. |

---

## 5 · DID THE FAMILY HONOR ITS OWN REFUSALS?

- *No skeuomorphic object rendering* — **honored.** Icons + typographic chips + the estate's own `HandDrawnOutline`.
- *No moving staging into the gallery* — **honored.**
- *No new sheet/gesture mechanics* — **honored** (the 350ms peek hold is moved verbatim, not invented).
- *No touching carousel internals* — **honored.** I checked the risk: `OptionSelector` is not consumed by `GameCard.vue` (that file imports only `scribbleUnderline` from the same directory), so the horizontal-only rewrite cannot reach the picker.
- *Extreme parsimony / net-LOC falls* — **VIOLATED** (§3.7).
- *Safari-first, no new live-filter surfaces* — **VIOLATED** (§3.3), and untested on Safari for the one pose that needed it (§2.3 iii).
- *a11y contracts inherited* — **VIOLATED** (§3.4, §3.5).
- *`errorCheckMode` stays manual prop+emit* — **honored, elegantly.** `GameToolbar.vue:63-66` is the best three lines in the family.

---

## 6 · OPEN QUESTIONS THE RESEARCH RAISED AND NOTHING ANSWERED

Q1 (`Fill forced`'s stratum) — the spec rules by doctrine ("the toolbar is the player's pencil;
the card is the dealer's/solver's hand"), which is a good sentence and an unverified claim.
Q2 (peek's host once the divider dissolves) — the toolbar takes it in the roster and the 350ms
gesture is never prototyped on a 44px chip. Q3 (handedness for a left-flank strip) — banked
without data. Q4 (the double mount) — kept, correctly, and the MANIFEST's `toolbar?: false`
recovery is the beginning of the right answer. Q6 (nothing measured in a browser) — still true
of the real app; only the replica was measured.

---

## 7 · WHAT TO CARRY FORWARD (cross-pollination)

1. **The Check split.** Cadence-splitting a *segmented control that fuses two cadences* is a
   generalizable move, it is proved from shipped code (`useAssists.ts:42-46,63`), and it costs
   nothing — the same-value re-emit is preserved verbatim. Any family should take this.
2. **The keyboard map as the cadence oracle.** `KeyboardLegend.vue:19-35` enumerates exactly
   five acts and every one is per-move. First-party, falsifiable, free.
3. **The vertical `OptionSelector` as the real-estate root cause,** with the conjunctive finding
   (neither the row deletions nor the horizontal rewrite clears 1024 alone). That measurement is
   sound whatever else fails, and −240px at 1024 is the largest single term any family has found.
4. **The `.toolbar-slot` zero-box + `firstElementChild` registration** — the correct way to hang
   an absolutely-positioned sibling inside the shrink-wrapping peek host without de-aligning
   `AnswerKeyLaminate`.
5. **The MANIFEST's disclosure discipline** — §4 RESIDUALS, §5's self-reported parsimony failure,
   §7 WHAT THE MOCK IS NOT. That is how a prototype should report itself, and it is the only
   reason this critique could be precise. Keep the form; fix the rig.
6. **`toolbar?: false` opt-out mounting in `GameScene`** rather than 5× per-game mounts — right
   for LOC and right for the design.

---

## 8 · WHAT WOULD MOVE F1 FORWARD (ordered, cheapest first)

1. Fix `LABELS` to the shipped constants and re-run `measure-b`/`measure-d` **per game**. If the
   seam returns to 1024 (with or without the 4.25rem gutter), delete the tray-on-desktop band,
   the 1280 breakpoint and the `position` gate's justification. One hour, and it decides the
   family's whole pose story.
2. Build the ticket. It is marks 1 and 2. Until it exists as pixels the family has not addressed
   the two marks it calls its core.
3. Render the F1 card — ticket + footnote + dominant Deal — and re-measure the scroll against the
   84px of real headroom.
4. Drop `filter: url(#grain-static)` from the strip's buttons, or drop mover 5 and let the strip
   sit outside the host. Then measure on real Safari.
5. Either implement roving-tabindex + arrow keys for `role="toolbar"`, or use `role="group"` and
   stop claiming a contract the code does not keep. Make `aria-orientation` follow the pose.
6. Convert the fade rules to `::v-slotted(.game-toolbar)`, or move them into `GameToolbar.vue`'s
   own scoped block keyed off `html.gallery-leaving` / an `.app-layout.scene-leaving` ancestor.
7. Open the iPhone 16 sim. The spec named the test that could fold the family; run it.
8. Re-price the LOC ledger with the test and e2e edits enumerated.
