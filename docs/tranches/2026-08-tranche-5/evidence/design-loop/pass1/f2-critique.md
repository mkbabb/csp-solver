# F2 — THE PENCIL-CASE TRAY · ADVERSARIAL CRITIQUE (pass 1)

Lane: CRITIQUE (non-author). Read-only against `web/frontend` at HEAD `32198688` (re-confirmed).
Every number below is either re-derived from the real dist, re-measured in F2's own mock, or
cited to a file:line. My own probes and shots live in
`/private/tmp/.../design-loop/pass1/f2-critique-verify/`:
`regime-probe.mjs` → `out-regime.json` (the shipped dist), `mock-probe.mjs` → `out-mock.json`
(F2's mock), `coarse-shots.mjs` → `coarse-{f2,base}-mobile.png`, `coarse-f2-desktop.png`.

**Verdict up front.** F2 genuinely cures ONE of the five marks it is charged with (drawer
grammar), pays for it decisively on desktop, and is the most rigorous blast-radius artifact in
the round. It also carries one falsified hard rule, one entirely uncovered mark, four new a11y
defects, and its single new motion — the whole of its mark-2 coverage — is unmeasured on the
engine the parallel perf campaign exists for. **Honest convergence: 54%.**

---

## 0. THE HEADLINE — THE HEIGHT GATES WERE RUN IN A REGIME NO PHONE IS IN

Not one measurement script in `f2-proto/measure/` sets `hasTouch` or `isMobile`. Every one calls
`browser.newPage({ viewport, deviceScaleFactor: 2 })`, which is `pointer: fine` /
`hover: hover`. The panel's CSS branches hard on `@media (pointer: coarse)`:
`.play-controls { display: none }` → `flex` (`GameControlPanel.vue:916-927`), `.icon-sublabel`
→ `display: block` (`:1045`), `.peek-hold-surface { padding-block: 1rem }` (`:875`), and
`.icon-btn` loses its fixed `2.75rem` box for `height: auto` (`:879-887`).

I re-ran the same probe against the same shipped dist in both regimes (`out-regime.json`):

| cell | `.controls-card` scrollH | `.mobile-board-width` scrollH | `.deal-btn svg` | `.play-controls` h |
|---|---:|---:|---:|---:|
| 1280×800 **fine** | **1026** | — | **17.97** | 0 |
| 1280×800 **coarse** (iPad row regime) | **1138** | — | **28** | 52.03 |
| 390×844 **fine** | — | **476** | 19.84 | 0 |
| 390×844 **COARSE** (every phone) | — | **619** | **28** | 50.16 |

The banked 1026 / 476 that every F2 gate is set against are *fine-pointer* numbers. A real phone
carries **619 px**, 143 px (+30%) more, and a real iPad at 1280 carries **1138 px**, 112 px more.

Then I ran F2's own mock in both regimes (`out-mock.json`), which removes the harness variable
entirely — same mock, same fonts, only the pointer media query changes:

| cell | base | F2 | Δ |
|---|---:|---:|---:|
| desktop 1280×800 fine | 976 | 737 | **−239** |
| desktop 1280×800 **coarse** | 998 | 787 | **−211** |
| mobile 390×844 fine | 464 | 443 | **−21** |
| mobile 390×844 **COARSE** | 568 | **575** | **+7** |

**D8's hard rule — "measured mobile scrollHeight at 390×844 ≤ the banked ~476px … the 2-col
recovery must beat the toggle's height saving or the family's mobile promise is false" —
inverts under the only pointer regime a phone is ever in.** Applying the family's own
drift-correction method to the coarse cells (dist 619 − mock base 568 = +51) puts F2 at **626 px
against a real gate of 619**. By F2's own stated test, the mobile promise is false.

The mechanism is legible and it is the die. At coarse, `.icon-btn { height: auto }` wins, so the
deal button grows with its glyph: base 52.16 px → **F2 80.16 px**. That +28 px is exactly the
cost the fine-pointer harness hid, and it is what tips the gate.

Desktop, by contrast, is genuinely and decisively payable — **−211 px in the harder regime**, on
a card that was +418 px over its own cap. That result survives every correction I can apply and
is the family's strongest evidenced claim. Credit it fully.

---

## 1. SPOT-CHECKS AGAINST THE REAL CODE (5+ file→change claims)

| # | claim | verdict |
|---|---|---|
| 1 | `GameControlPanel.vue` is 1025 LOC; tab-toggle machinery at 125–127 / 338–374 / CSS 936–973 = 83 LOC | **TRUE**. `wc -l` 1025; `showTabs` at :127, `mobile-heading-row` at :338-363, n=1 dead branch :365-374, CSS `.mobile-heading-row/.mobile-heading-btn/.heading-value/.is-active` :936-973. |
| 2 | `AssistSettings.vue` 91 LOC / `PencilModeToggle.vue` 47 LOC, both pure heading+`OptionSelector` shells | **TRUE**. Both confirmed; both `role="group"` + a `section-heading` + `OptionSelector`, zero domain state. |
| 3 | `useAssists.ts` — `checkArmed` is a real 4th state, cleared by any value mutation, never plumbed to the UI | **TRUE**. `:40` `checkArmed`, `:44` set on entering *or re-tapping* on-demand, `:63` `watch(values, …)` clears it; `AssistSettings.vue:22-28` receives only mode + candidatesPinned. `proactiveCheck` at `:54-58`. |
| 4 | `share-truth.spec.ts:57` `.controls-card button.icon-btn` **nth(4)** = Share holds unedited | **TRUE**. Verified at `e2e/share-truth.spec.ts:52-57`. In `GameControlPanel.f2.vue` the deal button keeps `class="icon-btn deal-btn"` and is first in card DOM; the new controls use `.object-btn` / `.pen-zone` / `.chip-btn`, never `.icon-btn`. |
| 5 | `drawer.spec.ts:150` mover-count 4 is safe — the collector self-matches only rail/tab/masthead/peek-host | **TRUE**. `e2e/drawer.spec.ts:96-103` filters `getAnimations()` to `target.matches('.board-peek-host, #controls-drawer, .drawer-tab')` or `.masthead`. And the settle writes per-rAF inline styles, not WAAPI, so `getAnimations()` never sees it at all. |
| 6 | `visual-regression.spec.ts:150` reads `.ctrl-btn` first font-size ≥19 off a Size option | **TRUE** (`:149-153`). F2 keeps `OptionSelector :mobile="mobile"` with the same first-in-DOM Size row. |
| 7 | No e2e test depends on the deleted labels (`Marks`/`Check`/`Candidates`/`Normal`/`Corner`/`Center`/`Ask`/`Live`) or on `.deal-row`/`.section-heading`/`.new-game-zone`/`assist-settings`/`pencil-mode` | **TRUE** — I re-ran the grep independently across all of `e2e/`: **zero hits**. |
| 8 | `HandDrawnOutline` accepts `strokeWidth`/`outset`/`radius`/`pose`; `:pose` present ⇒ zero beat enrolment, decided once at setup | **TRUE** (`:28-46`, `:64-72`). |
| 9 | `SheetWashiLabel` has `anchor="center"` + `persistent`; blur-0, static | **TRUE** (`:14-29`, `:56-58`). |
| 10 | `createSequenceSubscription` is a real pencil-boil export with `delayMs`; `scribbleUnderline` is exported from `OptionSelector/scribbleUnderline.ts` | **TRUE** (`node_modules/@mkbabb/pencil-boil/src/index.ts:36`; `scribbleUnderline.ts:46`). |
| 11 | D7′ — `drawerPhase` is a module-scope `ref` and `useControlsDrawer()` is a pure accessor | **TRUE** (`useControlsDrawer.ts:84`, exported at `:347`; the export function registers nothing). D7′ is strictly less blast radius than the spec's `GameScene` +2. Good deviation. |
| 12 | The `proactive-check` plumbing diff anchors are real, 7 files / +12/−1 | **TRUE**. The diff's anchors match the live files; sudoku + futoshiki do carry thin `ControlPanel/ControlPanel.vue` relays. F-4's correction of the spec's "+5" is right. |
| 13 | 0 new `useRasterStack` consumers | **TRUE**. Still 3 components / 4 stacks at HEAD (`HandwrittenLogo:166`, `DarkModeToggle:538,544`, `HandDrawnGrid:172`); F2's diff adds none. |

Thirteen for thirteen on structure and coupling. **This is the most carefully verified blast
radius in the round and it should be cross-pollinated as a method.** The failures below are all
about *what was measured*, not about what was claimed of the code.

---

## 2. RE-DERIVED PROTOTYPE NUMBERS (3+)

1. **Rank 2.163:1** — 56 / 25.888 = 2.1632 ✓. Mobile 56 / 20.352 = 2.7516 ✓. Base 17.97 /
   25.888 = 0.6941 ✓.
2. **F-1's "the brief's 1.08:1 is wrong"** — half right. At `pointer: fine` the die really does
   render **17.97 px** (I reproduced it on the dist, `out-regime.json`), and the mechanism is
   exact: `.deal-btn { height: auto }` sits at `GameControlPanel.vue:757`, `.icon-btn
   { height: 2.75rem }` at `:804` — equal specificity, later wins, so the column-flex box is
   pinned at 44 px and the 28 px `<svg>` flex-shrinks to fit. But at `pointer: coarse` the
   media-query `.icon-btn { height: auto }` (`:879`) wins and the die renders a full **28 px** —
   which makes the *brief's* 1.08:1 the correct figure for every touch device. F-1 and the brief
   are each right in one regime and neither says so.
3. **Settle 40 + 3×40 + 200 = 360 ms** ✓, and the trigger really is at glide onset:
   `useControlsDrawer.ts:188` sets `drawerPhase = "opening"` *before* `applyLayout` and the
   FLIP read, so the watcher fires within a tick of t=0. 360 < 520 ✓ — the arithmetic is sound.
4. **Net-LOC +413** ✓: `GameControlPanel` +113 (1025→1138) + `TeacherPen` 260 + `PencilObject`
   167 − 91 − 47 + 11. Against the spec's booked **+26 ±50** that is 8× outside the stated band.
5. **Drift correction** — desktop base 976 vs banked 1026 ⇒ −50, F2 737+50 = 787 ✓ arithmetically.
   The method itself is fine (same-harness delta + calibration), but it was only ever applied to
   the fine-pointer cells. Applied honestly to coarse it produces the 626-vs-619 failure in §0.
6. **`.section-heading` 6 → 2** ✓ — the dist shows 6 in both panels; the F2 template emits one
   `<h2 class="section-heading">` per section (n=2 across all five shipped games).
7. **Live-filtered elements 11 → 16** ✓ by inspection of the F2 template (`.teacher-pen`,
   `.cand-chip`, 3× `.pencil-object`).

---

## 3. THE FAILURE-MODE CHECKLIST, ROW BY ROW

### 3.1 Vacuous convergence — **FOUND, two instances**

- **Mark 1 (picker hierarchy) is claimed and delivered at zero.** `charter-f2.md:32`: "1 — the
  NEW GAME compartment is the refined panel; the carousel cards inherit the tray's frame
  consistency." Nothing in `f2-spec.md`, the change inventory, the diffs, or the MANIFEST touches
  `GameGallery.vue` or `GameCard.vue`. No artifact exists that could have failed. The family's
  own refusal ("touching the gallery beyond card-frame consistency") is honored by doing nothing
  at all, which is not the same as covering the mark.
- **Mark 2 (drawer choreography) is coded and excluded from falsification.** `f2-spec.md:124`:
  "The settle stagger is excluded: C7 is resolved on paper and cannot falsify the center."
  Family-success row 6 ("last compartment settle ≤ 520ms from glide start; PRM path snaps with no
  tween") was therefore never run. The MANIFEST reports `settleLastMs: 364` — measured in the
  mock's own replay button with no drawer, no glide, no `GLIDE_MS`, and no PRM path exercised
  (MANIFEST §7 says so). The one mark whose substrate is *motion* has no motion evidence.

### 3.2 Spec-cites-itself circularity — **FOUND**

The D4 Check gate — the owner's sorest point and the family's most-argued decision — is verified
against a **vanilla-JS reimplementation of both the component and the state machine**, inside the
same file that asserts the mapping:

```
mock/f2-tray.html:1247  function teacherPen(mode, proactive, width) {
mock/f2-tray.html:1248    const pose = mode === "off" ? "slot" : mode === "live" ? "clipped" : proactive ? "in-hand" : "desk";
mock/f2-tray.html:1403    errorCheckMode: "on-demand", checkArmed: true,
mock/f2-tray.html:1409    const proactiveCheck = () => state.errorCheckMode === "live" || (…on-demand && checkArmed);
```

`TeacherPen.vue` was never rendered. `measure/sfc-check.mjs` runs `@vue/compiler-sfc` and reports
`errors: []` — a *parse*, not a render and not a type-check; MANIFEST §7 concedes `vue-tsc` was
not run. So `penMatrix` proves that two hand-written lines agree with each other. It does not
prove that `TeacherPen.vue` + `useAssists.ts` do. (Mitigating: I checked, and
`TeacherPen.vue:53-57`'s `pose` computed *is* the same mapping, and it does match `useAssists.ts`
semantics. The claim is probably true; it is simply not evidenced by the artifact offered.)

### 3.3 Gates that cannot fail — **FOUND, two**

- The height gates, per §0: run in a harness where `.play-controls` measures **0 px** and the
  peek surface 14 px instead of 46 px. The gate cannot fail *for the reason it exists* because
  the regime under test is not the regime under complaint (the owner's mark is "ALL mobile
  interfaces").
- Family-success row 4, "`grep -rln useRasterStack src/` = 3 files", is a tautology for a design
  that by construction writes no raster code. It is a true statement, not a gate.

Row 5 (blast radius) is the counter-example and deserves saying: it is a real gate, it could have
failed, and it passes — I re-verified 4 of its 5 legs independently.

### 3.4 The elegant-reduction trap ("and then the hard part") — **FOUND**

MANIFEST §7 defers: real-Safari-on-device paints (the T4-P1 rig, which is BOOTED), the goldens,
`vue-tsc`, the settle in situ, and the PRM path. That is **four of the six family-success rows**.
The most consequential deferral is the settle's WebKit paint cost, because F2 puts a 200 ms
transform tween on `.tray-well`, which is an ancestor of *both* `.control-panel-filtered` (a
3-pass `feTurbulence`+`feDisplacementMap` chain, `GameControlPanel.vue:719-728`) and
`HandDrawnOutline`'s own inline SVG. MANIFEST §4 asserts "a compositor offset, never a descendant
transform." That is the Chromium story. The repo's own ledger says otherwise for the other engine:

> `BoilDivider.vue:42-47` — "WebKit paints SVG content unlayered — `will-change: opacity` on an
> inner `<g>` earns no compositor layer there … measured ~10 fps steady-state on desktop Safari."

`idle-paints.mjs` measured **idle**, on **Chromium CDP**, with nothing moving. The one new motion
F2 adds, on the one engine the T4-P1 campaign is about, is unmeasured. This is the family's
largest unretired risk and it sits precisely on the campaign's fault line.

The prototype self-reports a smaller instance of the same class and leaves the spec unamended:
**F-3** finds `PencilObject`'s 150 ms lift is a transitioned transform *on* a filtered element
(`PencilObject.vue:145-157`: `transition: transform 150ms` alongside `filter: url(#grain-static)`
on the same `.pencil-object` root), 3 nodes in both engines. That directly falsifies spec **D6**
("Pose swaps are `v-show` opacity flips on STATE"), and D6 was never corrected.

### 3.5 Legacy aliases — **CLEAN**

`AssistSettings.vue` and `PencilModeToggle.vue` are deleted outright, not kept alive beside the
wells. `cycleErrorCheckMode` is explicitly not adopted; the manual prop+emit seam is preserved
verbatim (`errorCheckMode` stays a prop + `emit('update:errorCheckMode', …)` on every click,
including same-value). `useId` is dropped rather than shadowed. No alias found. Best row in the
family.

### 3.6 Masked fallbacks — **FOUND, one real**

`settleStyle()` returning `undefined` at `t ≥ 1` is correct and fail-visible (no residual layer);
not a mask. The real mask is the die:

**The 56 px glyph renders outside its own 44 px control and nothing errors.** In
`GameControlPanel.f2.vue`, `.deal-btn { height: auto }` is at **:809** and `.icon-btn
{ height: 2.75rem }` at **:969** — F2 reproduces the exact cascade order that caused F-1, and
adds `.deal-btn > svg { flex: 0 0 auto }` (`:827`) so the die can no longer shrink to fit. I
measured it in F2's own mock (`out-mock.json`, `f2_desktop_fine`):

```
dealBtn  { h: 44,  top: 578.19, bottom: 622.19 }
dealSvg  { h: 56,  top: 563.97, bottom: 619.97 }   ← 14.22px ABOVE the button's top edge
btnCS    { height: "44px", overflow: "visible" }
```

Two consequences the prototype reported as two separate passes (`dieRenderedPx: 56` ✓ and
`minTargetPx: 44` ✓) rather than as one defect: (a) the affordance is 12 px taller than the hit
target, so the top of the die is not clickable — an inverted tap-target, on the card's most
consequential verb; (b) the layout books the deal row at 44 px while painting 56, so the fine
desktop height ledger under-counts the die by ~28 px. At coarse the button correctly grows to
80–82 px, which is exactly where the mobile gate goes negative (§0). The fix is one declaration
(`height: auto` after `.icon-btn`, or scope the die's box) — but it is unfound, and it means
D2's "the button keeps `class="icon-btn"` and its DOM position" was taken as a *free* move when
it is not.

### 3.7 Unverified gestalt — **FOUND, four**

- **Ink weight was never measured or looked at.** The charter's center is "rendered size **and
  ink weight** equal their rank" (`charter-f2.md:17`). The rank gate is a bounding-box ratio
  only. In `out/f2-desktop-light.png` and my `coarse-f2-mobile.png`, the 56 px die is a hairline
  mid-grey stroke glyph sitting under "SIZE" and "DIFFICULTY" in heavy Fraunces display caps and
  a bold "Medium" — **it still reads lighter than the three things it commits.** Half of the
  family's center is unaddressed and unremarked.
- **The die is still orphaned.** The owner's original words are "a tiny ~24px glyph floating over
  dead space, label beneath, orphaned between the difficulty list and the divider." In the F2
  shots it is a *larger* glyph floating over dead space with the label beneath, now orphaned
  inside a well instead of between two zones. Bigger is not integrated.
- **The three frozen wells were never rendered inside the card's own boiling frame.** The wells
  bind `:pose="0"` (no beat, frozen); the card they sit in is a `HandDrawnOutline :stroke-width="3"`
  with *no* `:pose` (`GameScene.vue:88,100`), so it boils on the shared beat. The mock omits the
  card's outer outline entirely — my `coarse-base-mobile.png` shows content with no drawn card
  frame. So the composition actually shipped — one boiling frame containing three frozen frames
  of the same hand at a similar scale — has never been looked at, and the research's own **open
  Q5** ("Confirm with CRITIQUE that a fully static tray does not read dead against a boiling
  grid") is still open. I cannot close it from static PNGs either; it needs a real render.
- **Two of four pen poses do not read as a pen.** F-7 flags `slot`; by eye `clipped`
  (`out/pen-pose-4-clipped.png`, and at size in the shots) reads as a *sheet of ruled paper*,
  not as a pen clipped to one. Only `desk` and `in-hand` are unmistakably a red pen. So D4's
  four-pose grammar is legible in two poses and inferable-from-caption in two — which is the
  segmented control it replaced, wearing a picture. The prototype flagged one of the two.

The prototype's own findings F-2 (four objects reading as one four-place row: `away · desk ·
clipped · hidden`) and F-6 (paired wells with mismatched bottoms) are both confirmed by eye in my
coarse shots — the left column carries ~120 px of dead space and "hidden" wraps onto its own row
*inside* the teacher's well, where it reads as a fourth pen pose. Both were found, both were
written up with a fix, **neither was applied**, and both are cheap. That the prototype found them
is to its credit; that the artifact still ships them is what CRITIQUE has to score.

### 3.8 Consumer-less substrate — **CLEAN**

Every new component has a mount. `TeacherPen`'s exported `PenPose` type is unconsumed outside the
file — trivial. No machinery without a surface.

---

## 4. A11Y CONTRACTS — FOUR NEW DEFECTS, ALL SELF-INFLICTED

The charter binds: "PRM paths and the a11y contracts … are inherited obligations, not optional."
Today's shipped controls are honest — `role="group"` + plain buttons whose accessible name *is*
their visible text (`AssistSettings.vue:54`, `PencilModeToggle.vue:33`, `OptionSelector.vue:29-40`).
F2 replaces that with a stronger-sounding pattern it does not implement.

1. **WCAG 2.5.3 Label in Name — 4 controls fail.** The visible text is `aria-hidden` and the
   accessible name is a different sentence (`GameControlPanel.f2.vue:167-177`):

   | visible | accessible name | contains? |
   |---|---|---|
   | `write` | "Normal — a digit is a value" | **no** |
   | `away` | "Check off — the pen stays in the case" | **no** |
   | `clipped` | "Check as you go — the pen stays on the sheet" | **no** |
   | `hidden` / `shown` | "Show candidate marks" | **no** |

   Voice-control users cannot say what they see. Today this cannot happen because
   `OptionSelector` renders the label as the button's text content.

2. **`role="radiogroup"` + `role="radio"` with no roving tabindex and no arrow-key handler**
   (`:500-519`, `:545-560`). AT announces "radio, 1 of 3" and the pattern's own keyboard contract
   (ARIA APG: one tab stop, arrows move and select) is absent — all three stay in the tab order
   and arrows do nothing. Announcing a pattern you don't implement is worse than the honest
   `role="group"` it replaces.

3. **`checkArmed` is still invisible to assistive tech — D4's central claim is sighted-only.**
   The pen is an `aria-hidden` SVG; `aria-checked` on the `desk` zone reads `true` whether the
   snapshot is armed or decayed (`penMatrix.aria` in `out/mock-measurements.json` shows three
   static labels + a boolean). So the load-bearing same-value re-emit remains a silent no-op for
   a screen-reader user — the exact defect D4 says it cures, uncured for the users who most need
   the state named. No `aria-live`, no state-dependent accessible name.

4. **Inverted tap target on Deal** (§3.6): 56 px affordance, 44 px target, at fine pointers.

Unbooked copy changes ride along: `Normal → write`, `Center → centre` (British spelling in a
US-English estate that writes `anchor="center"` and `"center"` mode values), `Off/Ask/Live →
away/desk/clipped`. The MANIFEST correctly proves no *test* depends on them (I re-verified), but
they are user-facing copy the spec never books.

---

## 5. PERF LEDGER — WHAT'S SOLID AND WHAT'S ASSERTED

**Solid, and worth taking:** zero new `useRasterStack` consumers (re-verified at HEAD: 3
components / 4 stacks, F2 adds none), zero new beat enrolments (`:pose="0"` decides enrolment
once at setup, `HandDrawnOutline.vue:64-72`), no per-beat filter parameter writes, and idle paints
0/0/0 over 3 s on Chromium with the drawer open. F2 correctly refuses to bake, and the research's
C1 correction — mark 4 is *diagnosed, not cured* at 0.9.2, so "zero bakes" is the right posture,
not "bakes are safe" — is the sharpest single insight in the round.

**Asserted, not measured, and material:**

- The settle's WebKit paint cost during motion (§3.4). Unmeasured on the booted `perf-rig-iphone16`.
- **Live filter instances in the card go 11 → 16 (+45%)**, all static `#grain-static`, all inside
  the panel whose *repaint-on-move* is the repo's own measured cost centre ("~+125 ms of
  size-switch raster past the p3 class," `GameControlPanel.vue:721-727`). Static params do not
  make a filter free to re-raster; they make it free to *not re-parameterize*. No size-switch
  raster measurement was taken.
- **+6 `HandDrawnOutline` instances per scene** (3 wells × 2 panel mounts), taking app-wide
  outline mounts from 6 to 12+. Each carries its own `useResizeObserver` (`HandDrawnOutline.vue:53`)
  and recomputes 4 poses of perturbed, grain-baked geometry on every resize. The panel resizes on
  every board-size switch. "Enrols no beat" is true and orthogonal to the path that actually costs.
- `retarget()` (`useControlsDrawer.ts:268`) sets `drawerPhase = "opening"` on a mid-glide
  reversal, so a re-click replays the whole settle over a partial glide; and a close during a
  settle never stops it (the watcher only acts on `"opening"`). Minor, unhandled.

---

## 6. MARK COVERAGE — DOES F2 CURE WHAT IT CLAIMS?

| mark | claim | verdict |
|---|---|---|
| **Drawer grammar** (brief 2) | 7 near-identical stanzas → 3 named wells | **CURED.** 6 `.section-heading` → 2; three washi-tagged compartments that read instantly ("new game / pencils / teacher's"); staging, play and preference finally look like three different kinds of thing. This is the round's clearest single improvement and it costs zero new machinery. |
| **Deal weight** (brief 1) | 28→56 px, 2.16:1 | **PARTIAL.** The box ratio is real; the ink weight (the other half of the charter's own center) is unaddressed and visibly fails; the glyph overflows its 44 px target at fine; and the "orphaned over dead space" complaint survives at a larger size. |
| **CHECK integration** (brief 3) | the pen as an object you take out | **PARTIAL.** The state-machine mapping is right and the *idea* — make `checkArmed` visible so the re-emit narrates itself — is the best conceptual move any lane has made. But 2 of 4 poses don't read as a pen, the four-object row regroups wrong (F-2, unfixed), the whole cure is sighted-only, and the gate was run against a reimplementation. |
| **Mobile geography** (brief 6) | 2-col object tray fits | **FAILS.** +7 px vs today under the correct pointer regime; 626 vs a real 619 gate after drift correction; mismatched paired-well heights with ~120 px of dead space; "hidden" orphaned to its own row. The tab-toggle's height saving was not recovered. |
| **Picker hierarchy** (brief 7) | cards inherit tray frame consistency | **NOT ADDRESSED.** Zero artifacts. |
| Mark 4 (perf constraint) | zero bakes | **HELD on the bake axis**, unmeasured on the filter/resize/settle axes. |

---

## 7. PARSIMONY

+413 LOC raw / +334 code-only against a spec band of **+26 ±50** — 8× outside. The research
predicted this honestly ("F2 is roughly LOC-neutral, not a clear net-LOC winner"), the spec then
booked +26, and the prototype found +413 and said so plainly (F-5). The root cause is disclosed
and structural: the research established there is **no pen and no pencil object in the estate**,
so the charter's "the tray extends this vocabulary, it doesn't import a new one" was false at
issue — `TeacherPen` (260) + `PencilObject` (167) are two new object families, 427 LOC, and they
are the family. On a loop where "a family wins partly on net-LOC" and "prefer deletion," F2 is
the most additive candidate. It must be argued on rank legibility and state visibility alone,
which is exactly what F-5 says.

Genuine subtraction inside it: the T′ two-branch template collapse (−155 lines) and the 83-line
tab-toggle deletion. Both are portable to any family.

---

## 8. GAPS, BY SEVERITY

**BLOCKING**
1. Mobile height gate measured at `pointer: fine`; under coarse F2 is **+7 px vs today** (575 vs
   568 in-harness, 626 vs a 619 dist gate). D8's own hard rule fails. Re-measure everything with
   `hasTouch: true` before any further F2 arithmetic is trusted.
2. The settle — the entirety of mark-2 coverage and F2's only new motion — is unmeasured on
   WebKit during motion, on a transform ancestor of a 3-pass filter chain and an inline SVG,
   while T4-P1 is live. The `perf-rig-iphone16` is booted; there is no excuse for this row.

**MAJOR**
3. The 56 px die overflows its 44 px `.icon-btn` box at fine pointers (`.f2.vue:809` vs `:969`);
   inverted tap target on the card's most consequential verb, and a 28 px under-count in the
   desktop height ledger.
4. Ink weight — half the charter's stated center — never measured; the die visibly reads lighter
   than the headings it commits.
5. WCAG 2.5.3 Label in Name fails on 4 new controls.
6. `role="radiogroup"`/`role="radio"` announced without roving tabindex or arrow-key operation —
   a regression against today's honest `role="group"`.
7. `checkArmed` remains invisible to AT; D4's central cure is sighted-only.
8. The D4 gate is verified against a vanilla-JS reimplementation of `TeacherPen` + `useAssists`;
   neither real component was rendered, and `vue-tsc` was never run on a 1139-line SFC.
9. Mark 1 (picker hierarchy) claimed in the charter's coverage, delivered at zero.
10. Net-LOC +413 vs a booked +26 ±50.
11. +5 live filter instances and +6 `HandDrawnOutline`/`ResizeObserver` mounts per scene inside
    the panel whose resize path is the repo's measured cost centre — unmeasured.
12. Spec D6 is falsified by the prototype's own F-3 and was never amended.

**MINOR**
13. F-2 (four objects read as one four-place row) found, fix written, not applied.
14. F-6 (mismatched paired wells, ~120 px dead space) found, one-declaration fix, not applied.
15. `clipped` reads as a notepad, not a pen — a second illegible pose the prototype missed;
    `slot` (F-7) reads as a bracket.
16. Frozen `:pose="0"` wells never rendered inside the card's own boiling frame; research open Q5
    is still open.
17. Unbooked copy: `Normal→write`, `Center→centre` (British spelling), `Off/Ask/Live→away/desk/clipped`.
18. `retarget()` replays the settle mid-glide; a close during a settle doesn't stop it.
19. Goldens unverified (honestly flagged by the lane).
20. F-1's mobile half is regime-blind — the die already renders 28 px on every touch device.

---

## 9. STRENGTHS WORTH CROSS-POLLINATING

1. **`HandDrawnOutline :pose="0"` + `SheetWashiLabel persistent anchor="center"` is the estate's
   free compartment primitive** — zero raster, zero beat, px-native at any size, soul gate already
   passed at SSIM 0.996. It works: "new game / pencils / teacher's" reads instantly in every shot.
   Any family that needs a named region should use exactly this.
2. **6 `.section-heading` → 2.** Naming zones with washi tape instead of display caps is the
   single most legible change in the round and is orthogonal to everything else F2 does.
3. **The desktop height budget is decisively payable — −211 px in the harder regime** on a card
   that was +418 px over its cap. Deletion-as-currency is proven; the donors (eyebrow heading,
   Marks stanza, Check+Candidates stanzas) are portable.
4. **F-1 is a live product defect independent of F2**: the shipped Deal die renders 17.97 px, not
   28, on every fine-pointer desktop, because `.icon-btn`'s fixed `2.75rem` beats `.deal-btn`'s
   `height: auto`. Worth landing as a standalone fix whichever family wins.
5. **The T′ two-branch template collapse (−155 lines)** — one tree driven by `mobile` instead of
   two parallel trees. Pure parsimony, any family can take it.
6. **The settle arithmetic**: `createSequenceSubscription` at onset 40 / step 40 / duration 200
   → 360 ms, inside `GLIDE_MS` 520. The gallery's 350 ms draw genuinely overshoots to 688 ms;
   the short-draw correction is the reusable result. Plus the mechanism disambiguation itself —
   `useFlipGlide` pins every mover to one `document.timeline.currentTime` and cannot stagger.
7. **D7′ — read `drawerPhase` straight off the module-level composable** instead of plumbing a
   prop through `GameScene` and five games. Strictly less blast radius; reusable by any family
   that wants the drawer phase inside the panel.
8. **The research's C1 correction**: mark 4 is diagnosed, not cured, at pencil-boil 0.9.2, so the
   correct posture for every family is *never bake*, tiers 0–2 only. And **C8**: the shipped rule
   is "no per-beat filter parameter writes and no animated transform on a descendant of a
   filtered element," not "no filters" — this is what lets any family use static `#grain-static`
   at zero cost, and it should be restated in the shared constraints.
9. **D9's rose discipline** — exactly one *filled* `--color-red-ink` host per card, verified by
   node count. A checkable rule for a hue that already carries three meanings.
10. **The blast-radius method**: positional-coupling grep (`share-truth` nth(4)), collector-scope
    reasoning (`drawer.spec` self-match), and an exhaustive label grep across `e2e/`. I re-verified
    all four independently and all four hold. Every lane should do this.

---

## 10. WHAT WOULD CLOSE F2

In order: (a) re-run every measurement with `hasTouch: true` and re-decide D8 against 619, not
476 — the family's mobile promise stands or falls there; (b) size the deal button to its glyph
and re-book the height; (c) put the settle on the booted iPhone rig with a paint trace; (d) fix
the four a11y defects (they are cheap: text-content labels instead of `aria-hidden` spans,
`role="group"` instead of an unimplemented radiogroup, an armed-state suffix on the desk zone's
accessible name); (e) apply F-2 and F-6, which the lane already solved; (f) render the wells
inside the card's real boiling frame and look at it; (g) either cover mark 1 or drop it from the
charter's coverage claim.

Nothing in that list is fatal. The center — *rank by rendered object, zones named as objects* —
survives adversarial contact on desktop and is the round's best answer to brief item 2. It has
not survived contact on mobile, and it has not been asked the Safari question at all.
