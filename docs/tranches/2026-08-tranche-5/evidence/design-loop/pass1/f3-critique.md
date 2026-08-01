# F3 ADVERSARIAL CRITIQUE — "one sheet, every width"

Pass 1 · CRITIQUE lane (non-author). Read: `charter-f3.md`, `f3-research.md`, `f3-spec.md`,
`f3-proto/MANIFEST.md` + every artifact under `f3-proto/`. Verified read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.

**Verdict: 34% converged.** The center is sound and the research dossier is the best in the
portfolio. But the *measured* artifact is a mock that structurally disagrees with the *shipped*
artifact on every load-bearing point, three of four falsifiers are constructed so they cannot
fire, the one spec claim the charter explicitly ordered this lane to attack (D7, two recognizers
one band) is **false against the code**, and the spike silently corrupts the four-times-audited
≥1024 surface it claims to leave untouched.

---

## 0 · WHAT SURVIVES CONTACT (state it first, so the rest lands)

These are real and worth cross-pollinating regardless of F3's fate:

1. **The channel split** — rest pose on `translate:`, gesture on `transform:`. Verified against
   `scene.css:76-82`, which is exactly this idiom at ≥1024. Individual `translate` applies before
   `transform`, so the drag writes a pure delta and never reads the rest pose. This is why the
   measured onset discontinuity is 0.00px and why `--sheet-rest` is discrete by construction
   (1 distinct value across 40 frames) rather than by discipline. Estate-native, not imported.
2. **The anchor idiom** — `top: var(--vv-height)` + translate-up, never `bottom: 0`, never a
   height yield. The right answer to iOS `position: fixed` vs the visual viewport, and it needs
   one new publish line in a composable that already owns the listener.
3. **`f3-spike.diff` applies clean** — `git apply --check` exit 0 against the live tree. A real
   artifact at real paths, not a sketch.
4. **The ≥1024 byte-identity audit is a gate that CAN fail and didn't** — `loc.json` string-
   compares the `@media (min-width: 1024px)` block (2,063 B) between `.orig` and `.f3`. Verified:
   real `scene.css:56-106` is untouched. `useFlipGlide.ts` and `useControlsDrawer.ts` never opened.
   This is the one mechanical gate in the whole prototype with teeth. (It also happens to be the
   gate that misses the actual ≥1024 regression — see §2.1.)
5. **The prior-art find is the cheapest possible win** — `MOTION.curves.drawerGlide`
   (`pencilConfig.ts:185`) is byte-identical to vaul's `cubic-bezier(0.32, 0.72, 0, 1)`. The sheet
   needs no new curve, no new named timing, no ratify row. Verified in `pencilConfig`/`useFlipGlide`.
6. **The MANIFEST's own honesty** — it falsified its author's half-detent arithmetic (224→248),
   corrected the spec's `mobile`-prop count (13 files/47 refs → 15 files/24 refs; my grep lands
   ~27 prop-shaped refs, so the MANIFEST is the closer number), refused to claim the spec's net-LOC
   ("plausible, not proven"), and listed its own evidence limits. Rare and creditable.
7. **`useFlipGlide` is reproduced faithfully in the mock** — I diffed the mock's vanilla
   re-implementation against the real `useFlipGlide.ts:95-184`: generation token, `clearGuard`,
   `teardown`, one pinned `startTime`, `composite:replace`, `fill:none`, guard at `+220`. Nothing
   invented. The engine claims rest on an honest stand-in.

Everything below is what breaks.

---

## 1 · THE MOCK IS NOT THE APP, AND THE DIVERGENCES ARE THE LOAD-BEARING ONES

Every number in `results.json` comes from `measure.mjs:13` → `mock/f3-sheet.html`. The MANIFEST
discloses the substitution and three of its limits (no webfonts, no paint timeline, `env()`→0).
It does **not** disclose that the mock's DOM differs from the real DOM in exactly the places the
falsifiers probe. Enumerated, each verified against the tree:

### 1.1 `.control-panel-filtered` wraps the wrong subtree — F-a's subject is invented
Real `GameControlPanel.vue:336` opens `.control-panel-filtered` **inside** `.new-game-zone` (:335)
and closes it before the peek surface at :407. The filter wraps the **staged zone only** — heading,
size/difficulty selectors, Deal. Marks, assists, play tools and the action row are all *outside*
it. Same in the desktop half (:538).

The mock (`f3-sheet.html:345`) puts `#filtered` around **everything** — zone-play + divider +
zone-stage + zone-prefs. So the measured filtered box (335.81×545.28) is roughly 3× the real one's
area, sits at the top of the sheet rather than the middle, and at the half detent the *real*
filtered element isn't revealed at all. F-a's premise — "dragging over `.control-panel-filtered`" —
does not describe the geometry it claims to test.

### 1.2 `HandDrawnOutline` is absent, and it is the sheet's real structure
Real diff nests: `.scene-controls` → `HandDrawnOutline` (`.outline-container`) → `.controls-card`.
The mock has no HandDrawnOutline; `.controls-card` is a direct flex child of `.scene-controls`
with a 3px CSS border standing in. Two consequences, §2.2 and §2.5.

### 1.3 The tongue in the mock is not the tongue in the diff
Mock: `.sheet-tongue` containing a real `<button class="drawer-tab" aria-expanded aria-controls>`
with the washi "controls" label. Diff: `<div class="sheet-grabber lg:hidden" aria-hidden="true" />`
— a pill, no label, no role, no `tabindex`, no `aria-expanded`. Success-test item 6's a11y
assertions (`ariaExpandedClosed: "false"` → `ariaExpandedHalf: "true"`, `drawerTabs: 1`) are all
measured on a component the shipped artifact does not contain. In the diff there is **no
accessible control at any width <1024** that can open the sheet.

### 1.4 The peek surface has no handlers in the mock
Mock `f3-sheet.html:371`: `<div class="boil-divider peek-hold-surface" aria-hidden="true">` — one
static path, no `pointerdown`, no `BoilDivider` pose stack, no `SheetWashiLabel text="hold to peek"`.
The real surface (`GameControlPanel.vue:412-421`) carries four pointer handlers and a persistent
coarse washi label. D7 designates this band as drag surface #3 and the mock cannot see the collision.

### 1.5 The mock's keyboard is a hand-injected variable, not the real code path
`useKeyboardViewport.f3.ts:anchorPx()` = `round(min(layoutHeight(), vv.offsetTop + vv.height))`.
The mock's (`f3-sheet.html:557-561`) = `round(raw − fakeKeyboardPx)`. Different function. In
headless WebKit `vv.height` never shrinks, so the real function returns `layoutHeight()` always —
the real anchor path is never exercised. See §3.2 for why this makes F-b an identity.

### 1.6 Also missing from the mock, all of which occupy sheet-adjacent space
`.corner-right` (fixed, `z-index: 60`, `will-change: transform`, the 4–5rem mobile sun —
`App.vue:442-482`); the in-flow mobile `AttributionCard` (`App.vue:398`); `HandwrittenLogo` (the
real drawn masthead); the root `h-screen py-1` + `.main-content` paddings; the `SheetWashiLabel`
hover chips; `KeyboardLegend`. Composition at `full` (sheet top 117, `z-index: 45`) puts the sheet
under the z-60 sun with no analysis.

**Net:** the mock proves a *design*. It is not the design in `f3-spike.diff`, and the deltas are
concentrated in the filter subject, the drag surface, the accessible control, the keyboard path
and the flex chain — i.e. in all four falsifiers.

---

## 2 · DEFECTS VERIFIED AGAINST THE REAL TREE

### 2.1 BLOCKING — the spike corrupts the ≥1024 audited surface
`GameScene.f3.vue:232-240` binds `@pointerdown/@pointermove/@pointerup/@pointercancel` on
`#controls-drawer` **unconditionally**. Grep for a guard: `rowRegime`, `matchMedia`, `1024`,
`innerWidth` appear nowhere in the spike's script (verified). `onSheetDown` opens
`if (!railEl.value) return;` — width is never consulted.

Failure scenario: at 1280px wide, a user presses a button inside the rail and drifts 10px (trivial
— every drag-select, every slightly-sloppy tap). `onSheetMove` arms, writes
`el.style.transform = translateY(-Npx)` on `.scene-controls` — which *is* the drawer's second FLIP
mover (`useControlsDrawer.ts:222-226`) — then `onSheetUp` calls `landRest()` (writes `--sheet-rest`
+ `data-sheet` on the rail) and fires a 520ms `sheetGlide.run()`. Two glide controllers now own the
same element's transform channel. Because both use `fill: none`, the drawer's own glide releases to
whatever inline transform the stray drag left behind: the pencil case ends up parked off its tuck.

`loc.json`'s `desktopIdentity` audit compares CSS bytes and a Tailwind class list. It cannot see a
JS handler, which is why "≥1024 IS UNTOUCHED (mechanically audited)" is asserted while the audited
surface is reachable from the new code. One `if (!rowRegime.value) return;` fixes it; the point is
that the gate was built where it couldn't fail.

### 2.2 BLOCKING — `drawerInert` locks the sheet shut, permanently, for a real user cohort
The diff keeps `:inert="drawerInert"` on `#controls-drawer` (`GameScene.f3.vue:232`) and mounts the
sole drag surface *inside* that node (:242). `drawerInert = !drawerOpen && phase === 'idle'`
(`useControlsDrawer.ts:324`); `drawerOpen = localStorage['csp-drawer-open'] !== "0"` (:68).

Failure scenario: a user tucks the pencil case on desktop (persists `"0"`), then opens the site on
a phone. `drawerOpen === false`, phase `idle` → `inert` on the sheet → the grabber takes no pointer
events. `toggleDrawer` early-returns <1024 (:295), so `drawerOpen` can never flip back. The
controls are unreachable for the rest of that browser profile's life. Today this is masked because
`hidden` makes the rail `display: none` <1024; F3 removes `hidden` and unmasks it.

This is not merely a spike omission. **D6 and D10 are mutually unsatisfiable as written**: D6 mounts
the tab inside `.scene-controls` (to contain its `z-index: -1` and dissolve C6); D10 puts `inert` on
the sheet at the closed detent. An `inert` container inerts its own opener. The mock dodges it by
putting `inert` on `#pane` instead — a third structure, in neither the spec nor the diff.

### 2.3 BLOCKING — D7 is false against the code: the peek has no slop cancellation
D7's whole argument: *"Arbitration needs **zero changes to the peek code** — the hold already
self-cancels at 10px slop (`useLongPress` idiom); the sheet drag arms at the same 10px."*

The peek does not use `useLongPress`. `GameControlPanel.vue:161-179` is a hand-rolled
`setTimeout(…, PEEK_HOLD_MS)` bound to `pointerdown/pointerup/pointerleave/pointercancel`
(template :412-421). **There is no `pointermove` handler and no slop check anywhere in it.** Its own
comment says so: *"a shorter press does nothing (the divider has no click action, so no
click-suppression bookkeeping is needed)."* `useLongPress` is consumed only by `useGameCell.ts:214`
(board cells) — verified by grep across `src/`.

Failure scenario: user presses the divider band and drags up to open the sheet. A deliberate drag
routinely exceeds 350ms. At 350ms `onDividerHoldStart`'s timer fires → `emit("peek-start")` → the
answer-key laminate flashes over the board *while the sheet is mid-drag*. On release,
`onDividerHoldEnd` emits `peek-end` and `onSheetUp` snaps a detent. Worse: with implicit pointer
capture for touch, `pointerleave` is suppressed until release, so moving the finger off the band
does not cancel the hold either.

The research dossier stated this correctly ("the machinery exists; the two owners do not yet know
about each other" — a claim about the *composable*). The spec upgraded "the machinery exists" into
"zero changes needed" and closed the question. The prototype then removed the handlers from the
mock, so nothing could catch it. This is the one failure mode the charter named for this lane by
name (OQ1: *"CRITIQUE must include a 'two recognizers, one band' failure mode"*) and it is live.

### 2.4 MAJOR — the spike drags from the content pane, which the spec explicitly refuses
D7: *"The content pane keeps native scroll (`pan-y`); drag-down from the pane only when
`scrollTop === 0` is deferred to a later slice — **v1 doesn't drag from the pane at all**."*

The diff binds the pointer handlers on the sheet **root**, with no target filter. Every
`pointerdown` inside the pane bubbles to them. The mock binds them on `tongue` only
(`f3-sheet.html:528-531`) — so the measured artifact implements the refusal and the shipped artifact
violates it.

Failure scenario: user swipes up inside the pane to scroll to Preferences. `onSheetDown` runs;
two `pointermove`s past 10px arm the drag, add `html.sheet-gesturing` and write a transform; the
browser then claims the gesture for the `pan-y` scroll and fires `pointercancel`; `onSheetUp` (bound
to `pointercancel`) computes `pickDetent(liveRest, velocity)` from the partial delta and glides to a
different detent. The pane scrolls and the sheet jumps in the same gesture.

### 2.5 MAJOR — the pane cannot scroll in the real tree; the full detent's content is unreachable
`scene.f3.css:197-201`:
```css
.scene-controls .controls-card { flex: 1 1 auto; max-height: none; overflow-y: auto; … }
```
with the comment *"Its max-height is the sheet's box minus the tongue."* It isn't. `.controls-card`
is **not** a flex item of `.scene-controls` — `HandDrawnOutline`'s root `div.outline-container` is
(`HandDrawnOutline.vue:106`, `position: relative`, no `display: contents`). So `flex: 1 1 auto` is
inert, and `max-height: none` deletes the only working cap — the ungated base rule at
`scene.css:41-46`, `max-height: calc(min(42rem, 85vw, 100dvh − 10rem) − 2rem)`.

Result: `.outline-container` sizes to content with `min-height: auto`, so it cannot shrink; the flex
column overflows `.scene-controls`' `max-height`; `.scene-controls` declares no `overflow`, so the
overflow is `visible` and spills below the anchor, off-screen, with no scroller. At the `full`
detent `--sheet-rest` = `railEl.offsetHeight` = the *clamped* height, so the reveal stops at the cap
and the tail — Preferences, the zone F3 deliberately sinks to the bottom — is unreachable on a phone.

Note the spec's D8 gets this right (an explicit `max-height` arm); the prototype substituted a
mechanism that only works in the mock's flatter DOM. Spec and prototype disagree, and the measured
one is the wrong one.

### 2.6 MAJOR — `restFor("full")` forces a synchronous layout on every `pointermove`
Spec D2 promises the settle's `from` is *"the live drag delta (the accumulator, **no rect read**)"*
and D3 promises *"no per-frame var writes."* Both hold. But `onSheetMove` ends with:
```ts
liveRest = Math.min(Math.max(startRest + dy, CLOSED_PX), restFor("full"));
```
and `restFor("full")` is `railEl.value?.offsetHeight ?? HALF_PX`. That's a layout flush **per
pointermove**, immediately after the previous frame wrote `transform` — the textbook write→read
thrash, on the surface of the live T4-P1 Safari perf campaign, inside a filtered, layerized card.
`offsetHeight` is detent-invariant here (translate doesn't change it), so the read is also pure
waste: hoist it to `pointerdown`. Same defect in the mock (`fullPx()`), so the 70.5 fps figure
includes it — see §3.1 for why that figure can't show the cost.

### 2.7 MAJOR — D3 forbids the height yield that D3's own CSS performs
D3: *"Never `bottom: 0`, never height-yield — a height change relayouts `.control-panel-filtered`
and re-rasters its 3-pass filter."* The sheet's own rule (`scene.f3.css:167`) is
`max-height: calc(var(--vv-height, 100dvh) − 4rem)`. When the keyboard opens, `--vv-height` goes
745→409, so the sheet's box goes from 628 (content-bound) to 345 (cap-bound) — a **283px height
change**, on the element whose subtree the rule exists to protect. `results.json` records it:
`fullWithKb.revealed: 345` against `zones.sheetFull: 628`. F-b asserted `translateUnchanged` and
`revealedHeightPreserved` and never asserted box-height stability, so its own data carries the
contradiction unflagged.

In the real tree this also drives `HandDrawnOutline`'s `useResizeObserver`
(`HandDrawnOutline.vue:53-59`) → the `frames` computed re-runs `generateRectBoilFrames` for **every**
pose in `BOIL_CONFIG.frameCount`, grain-baked, on **every** `visualViewport` resize — and
`onViewportChange` fires repeatedly through the keyboard's animation. That is a layout-size bake
storm during the most latency-sensitive moment on iOS, which is the owner's mark-4 root-cause
hypothesis reproduced on a new surface. HandDrawnOutline isn't in the mock, so nothing saw it.

### 2.8 MAJOR — D8's pane formula double-subtracts the keyboard
D8: `max-height: calc(var(--vv-height, 100dvh) − var(--keyboard-inset, 0px) − 6rem)`.
By D3's own definition `--vv-height` = `min(layoutHeight, vv.offsetTop + vv.height)` — it already
excludes the keyboard. `--keyboard-inset` = `layoutHeight − (vv.height + vv.offsetTop)` — the same
band. At the harness's own 336px keyboard: `409 − 336 − 96 = −23px` → clamps to 0. **The pane
collapses to zero height whenever the keyboard is up.** Re-derived from the spec's two definitions;
never evaluated because the spike used the (differently broken) §2.5 rule instead.

### 2.9 MODERATE — the 248px half detent is wrong on real hardware
`env(safe-area-inset-bottom)` resolves to 0 in headless WebKit (MANIFEST discloses). On iPhone 16
the home-indicator inset is 34px, and the sheet's `padding-bottom: env(safe-area-inset-bottom)`
consumes it from the revealed band. Measured slack at 248px is `playZoneOverflowPx: −6.5` — so with
the real inset the action row overflows by ~27.5px and Clear/Fill/Solve/Share fall under the home
indicator. `shot-light-half.png` shows those four sublabels already flush to the frame edge.
Corrected floor ≈ 282px (17.6rem), which then wants re-checking against the board's co-visibility.
Compounding: the mock has no Fraunces/Patrick Hand faces, so every row height is a fallback-font
measurement. The single number this prototype claims to have *decided* is undecided twice over.

Also worth recording: the MANIFEST's per-row defence ("the estimate was good; only the tongue
accounting was wrong") doesn't hold. Spec D4's rows were 70/58/52; measured 48/45/45 — off by
22/13/7 individually. They agree in *sum* (180 vs `zonePlay` 179) only because the measured zone
total folds in the "Marks" heading and gaps that the inflated row estimates had absorbed.

### 2.10 MODERATE — `zones.sheetFull: 628` is mislabelled as a clamp
MANIFEST: *"full detent **628** (= `--vv-height − 4rem` clamp)."* `745 − 64 = 681`, not 628. 628 is
the **content** height (I reconstruct ~636 from the zone rows + card padding + borders). The clamp
never bound at this geometry. It matters because "full = min(content, cap)" being content-bound is
what makes the `full` composition in §4.2 what it is.

### 2.11 MODERATE — `html.sheet-gesturing { overflow: hidden }` is an iOS scroll-reset trap
`scene.f3.css:212-214` toggles `overflow: hidden` on `<html>` for the gesture window. WebKit resets
`documentElement.scrollTop` to 0 when overflow goes hidden and does not restore it on removal.
Failure scenario: `ensureVisible` (`useKeyboardViewport.ts:87-98`) has just `window.scrollBy`'d to
lift a focused cell clear of the keyboard; the user then drags the sheet; the scroll resets and the
focused cell drops back under the keyboard — defeating the composable F3 is extending. The mock
never scrolls, so this is invisible there. Also bites landscape and any tall-board state.

### 2.12 MODERATE — the mock's Trap-3 click suppression is broken, and untested
```js
tongue.addEventListener("pointerup", () => { consumed = M.armSlop > 0 && !down ? true : consumed; }, true);
```
`M.armSlop` is set on the first armed move and **never reset**, so after one drag in the session
`M.armSlop > 0` forever. Any subsequent `pointerup` on the tongue latches `consumed = true`, and the
next genuine tab click is swallowed by `if (consumed) { … e.stopPropagation(); return; }` without
toggling. The tap-toggle path — the only non-gesture route to the detents, and the a11y route — is
dead after the first drag. The harness never exercises it: every detent change in `measure.mjs`
goes through `window.__f3.toDetent()`, which bypasses the click handler entirely. The diff doesn't
implement the suppression at all (D6 budgets ~5 LOC, deferred).

### 2.13 MODERATE — `aria-expanded` cannot express three detents
D10: `aria-expanded = detent !== closed`. The mock's toggle cycles closed→half→full→closed
(`f3-sheet.html:537`). A screen-reader user at `half` presses the tab, lands at `full`, and hears
"expanded" both times — no announced change, no `aria-valuenow`, no live region. Three-state control
on a boolean attribute. The spec files a11y under "inherited obligations" and never resolves it. And
D6's `aria-controls="controls-drawer"` now points at the tab's own **ancestor** (D6 mounts the tab
inside `.scene-controls`), which is a different relationship from today's sibling reference.

### 2.14 MINOR — D9's codec makes the family's headline non-default for every existing user
D9: `"0"`→closed, `"full"`→full, *anything else*→half. Every returning user's stored value is `"1"`
(the default-open drawer) → their first mobile visit opens a **half** sheet over the board. The
family's headline win — board owns the viewport, zero scroll — is the default for nobody who has
used the site before. Separately, one key with two decoders is a legacy alias by construction:
writing `"full"` on a phone reads as "open" on a tablet at ≥1024, which D9 presents as compatibility
rather than as cross-regime bleed.

---

## 3 · FALSIFIERS THAT CANNOT FIRE

The spec's falsifier list is the right instinct — "any one kills or recuts the family". Three of the
four are constructed so that no possible run of the artifact fires them.

### 3.1 F-a cannot fire
Verdict predicate (`measure.mjs:245`):
`filteredBoxStable && filteredAttrMutations === 0 && distinctTranslates === 1`.

- `filteredBoxStable` compares only `fr.width` / `fr.height` (:112) under a parent **translateY**.
  A translate cannot change a descendant's width or height. Invariant by arithmetic.
- `filteredAttrMutations` observes `{attributes:true, childList:false, subtree:false}` on
  `#filtered` (`f3-sheet.html:575-576`), while every write goes to `#controls-drawer`. Zero by
  construction.
- `distinctTranslates === 1` because the drag writes `transform`, not `translate`. True by design.

All three are restatements of "the implementation is what it says it is." The stated risk — *"the
3-pass filter re-rasters"* — is never probed. The MANIFEST says so ("channel half", "the rig owns
the paint-timeline half") and still records **SURVIVES**, which is the vacuous-convergence pattern:
a claim badged as tested by an artifact that could not have failed.

The 70.5 fps figure is likewise self-referential: `dragPaced` awaits one `requestAnimationFrame` per
`pointermove` (`f3-sheet.html:614-621`) while the sampler is also one-per-rAF. Frames-per-second
therefore measures the harness's own pacing. A long frame makes the loop wait; it cannot show a drop.

### 3.2 F-b is an algebraic identity
Predicate: `revealedClearsKeyboard = anchor <= kbTop + 0.5 && r1.top >= 0` where
`anchor = round(min(745, 745) − k)` (the mock's `anchorPx`, k = `fakeKeyboardPx`) and
`kbTop = innerHeight − k`. So the assertion is `(745 − k) ≤ (745 − k) + 0.5` — true for every k.
`translateUnchanged` is true because nothing writes `translate` on a keyboard event.
`anchorResetsClean` is true because `setKeyboard(0)` restores the same variable. Three tautologies.

What F-b was specified to test — *"the sheet fails to track `--vv-height` (eclipsed, **or lags beyond
the keyboard's own animation**)"* — has no lag term in the harness at all, and the real `anchorPx()`
(which depends on iOS actually shrinking `vv.height`, promptly) is never called (§1.5).

### 3.3 F-c measures the wrong path
F-c is specified as *"`run()` settle **from a live drag pose**"*. `measure.mjs:145-152` does
`window.__f3.toDetent("closed")` → wait 700ms → `toDetent("half")`. That's the **programmatic
tap-toggle** path from a settled rest pose. The recorded keyframes confirm it:
`["translateY(200px)","translateY(0px)"]` with `restBefore: "48px"` → `restAfter: "248px"` — a full
200px closed→half toggle, not a drag residual. The drag-release path *is* exercised (test 3, which
logs `settle: {target:"full", delta:-80, velocity:1.136}`) but its pose track is never sampled.

So the seam that carries the actual risk — accumulator `liveRest` vs the painted pose at release,
under clamping and under `pointercancel` — is unmeasured, and the F-c badge belongs to a different
transition. The measured result is real and good; it just isn't F-c.

### 3.4 F-d is honestly reported as unmeasurable
No complaint. Correctly routed to owner E-row 4 / `perf-rig-iphone16`.

### 3.5 The artifact ledger's "RUNS" is overstated
`check-sfc.mjs` runs `parse` + `compileScript` + `compileTemplate` + `ts.createSourceFile` and reads
**`parseDiagnostics` only** — syntax, no semantic pass. No `vue-tsc`, no bundle, no mount, no test
run. `GameScene.f3.vue` and `useKeyboardViewport.f3.ts` are badged **RUNS (compiles)**; they parse.
`scene.f3.css` badged **RUNS (parsed + transpiled)**; postcss+lightningcss accept it — which is
exactly the gate that cannot see §2.5's inert `flex: 1 1 auto`. Three of five "RUNS" rows are
syntax gates.

---

## 4 · DOES IT CURE THE OWNER'S MARKS? (the ground truth)

### 4.1 Mark 1 — Deal weight ≪ its rank: **NOT CURED. D4 makes it worse.**
F3's claim: *"the NEW-GAME headline is the detent transition's own marginal reveal (mark 1)"* /
*"the NEW GAME zone becomes the full-detent's headline."*

`shot-light-full.png` is the refutation. At `full`: **MARKS** sits at the top under the tongue,
then the play tools and action row, then the divider, then **NEW GAME** in the *middle* of the sheet,
then **PREFERENCES**. NEW GAME is the second of three stanzas, visually subordinate to MARKS. And
Deal is still a lone 28px `DiceIcon` with a "Deal" sublabel floating under two option rows — the
change inventory touches no `.deal-btn`/`DiceIcon` (verified: real `GameControlPanel.vue:389-404`,
`:757-769`, untouched by the spec).

Today the staged zone is **first** in the panel. D4 sinks it to second. So the family's answer to
"Deal's affordance weight is below its rank" is to *lower its rank*. That's a regression the spec
banks as coverage. "Reveal order = weight" is asserted, never rendered-and-looked-at, and the one
render available contradicts it.

### 4.2 Mark 2 — drawer grammar: **half-cured, and the owner's specific complaint is entrenched**
Brief item 5 has two halves. The drawer-only-≥1024 half: cured, that's the family's thesis. The
other half — *"contents are frozen freight during the 520ms glide — the case moves, nothing inside
it lives"* — is not addressed at all. The sheet translates as one rigid block. D4 makes the rigidity
**doctrine**: "reveal, never per-detent reorder," justified by the filtered card's move-not-resize
covenant. So the exact thing the owner objected to is now load-bearing architecture. C1 also
established that tab counter-motion already ships (`useControlsDrawer.ts:228-236`), so F3's genuinely
new motion is drag-following + detent settle — real, but narrower than the charter's mark-2 claim.

### 4.3 Mark 2/brief item 2 — no composition grammar: **the indicted pattern is reproduced**
Brief item 2: *"~7 near-identical stanzas — display-caps `section-heading` + `OptionSelector` row —
give staging, play and preference identical visual weight; zones are marked only by **one divider +
placement**."*

`shot-light-full.png`: **MARKS**, **NEW GAME**, **PREFERENCES** — three identical display-caps
`section-heading` eyebrows, same size, same weight, same centring, separated by one wavy divider and
one dashed rule. F3's answer to "zones are marked only by one divider + placement" is three wrapper
divs, one divider and one rule — i.e. one divider plus placement, plus one more rule. No grammar was
invented. The estate's own comment already says the quiet part: `.new-game-zone` is *"structural
grouping only — the zone reads 'provisional' by PLACEMENT + its heading; no box grammar is
invented"* (`GameControlPanel.vue:730-732`). F3 inherits that and calls it the cure.

### 4.4 Mark 3 — CHECK/CANDIDATES contrived: **partially cured, and under-priced**
Sinking prefs to the bottom behind an `<hr>` is a defensible partial. But the mock invents a control
pattern the spec never specifies: `.pref-row` — label left, segmented control right
(`f3-sheet.html:400-405`, `:251`). Today `AssistSettings.vue` (91 LOC) renders `OptionSelector`
rows. So (a) the spec's "+~15 for three zone wrappers" doesn't cover rewriting AssistSettings, and
(b) the invented pattern makes Preferences the *most* visually differentiated zone in the sheet —
inverting the intended sink. An unattributed, unbudgeted, un-adjudicated design decision sitting
inside the evidence.

### 4.5 Mark 5 — picker hierarchy: **zero, and the charter mis-maps it**
The family legitimately refuses the picker. But the charter's coverage line reads *"5 — indirect:
detent ordering forces a frequency ranking of content."* Mark 5 is the **game picker** — GameCard
dot pips, `nameViewBox` estimated name boxes, graded weight between centre and flanks. Content
frequency-ranking inside the sheet is a different object. The claim is a category error, not
indirect coverage.

### 4.6 Mark 6 / mobile geography: **the real prize, well-argued, thinly evidenced**
The quantified case is the dossier's best work: ~1,072px of stack against a ~745px band ⇒ the
controls card is *never* co-visible with the board on a phone today. That's a genuine finding and
the sheet is the right shape of answer.

But the delivered "mobile win" is not what the charter promised. Charter: *"closed (tab tongue only
— board takes the full viewport, the mobile win)."* `shot-light-closed.png` shows a 369px board with
**257.4px of blank paper** below it — a third of the viewport — and the tongue orphaned at the
bottom edge. C2 called this exactly (the `html.drawer-closed` grow rungs are ≥1024-only,
`GameBoard.vue:843-857`; <1024 the board is width-bound at `min(42rem, 100vw − 1.5rem)` with no
height arm). The spec's D8 answers with a `max-width` **guard** — a cap that shrinks the board on
short viewports — not a grow rung. So reclaiming 567px of vertical space delivers the board nothing;
it converts a scroll into a void. The MANIFEST reports the 257.4px as a neutral fact and concludes
the guard "earns its keep on short/landscape viewports only." A `<lg` board-grow rung (the analogue
of the ≥1024 `shell-*` rungs) is required, undesigned and unbudgeted.

### 4.7 Mark 4 / no-new-live-filter: **honored in letter, breached in spirit**
No new filter surface — correct, verified. But §2.7's HandDrawnOutline re-bake on every
`visualViewport` resize is a new layout-size bake trigger on the pose-bake pipeline, which is
mark 4's own root-cause hypothesis. And the sheet's box is now viewport-reactive by design.

### 4.8 Safari-first
The two Safari-specific mechanisms (anchor idiom, channel split) are the right ones and are
estate-native. But every Safari claim is headless-WebKit-on-macOS against a mock: no paint timeline,
no `env()`, no real keyboard, no `offsetTop` regression, no hardware. Four owner rows, and the
`perf-rig-iphone16` run — which is booted and available — was not used.

### 4.9 Parsimony / net-LOC: **undecided, and honestly so**
`loc.json`: the spike is **+180 code lines, +252 all lines**, additive-only. The MANIFEST projects
−80…+20 and refuses to claim the spec's "≤0" ("plausible, not proven"). Correct. But the entire
deletion case rides `GameControlPanel.vue`'s fork (−228) which was **not attempted**, and the
unification's real cost is unpriced: coarse font-size/row-vs-column media branches, `@media
(hover: hover)` gates for 5 `SheetWashiLabel` chips + `KeyboardLegend` (107 LOC), the invented
`.pref-row` rewrite of `AssistSettings.vue`, three zone wrappers, plus `useSheetDetents.ts` at +160
against the spike's ~103. I'd put the honest band at **−80 … +80**, i.e. the sign is unknown.

---

## 5 · FAILURE-MODE CHECKLIST — row by row

| row | verdict | evidence |
|---|---|---|
| **Vacuous convergence** | **HIT, severe** | F-a badged SURVIVES on three tautologies (§3.1); F-b on an identity (§3.2); F-c badged on a different transition than specified (§3.3). Three "RUNS" rows are parse gates (§3.5). "≥1024 IS UNTOUCHED (mechanically audited)" while the audited element is reachable from unguarded new handlers (§2.1). |
| **Spec-cites-itself circularity** | **HIT** | D7 closes the peek-vs-drag question by citing "the `useLongPress` idiom" for code that doesn't use `useLongPress` (§2.3) — the dossier's true statement about the composable is re-read as a statement about the peek. `scene.f3.css:196`'s comment asserts "Its max-height is the sheet's box minus the tongue" over CSS that sets `max-height: none` (§2.5). D3 forbids height-yield; D3's own rule performs one (§2.7). |
| **Gates that cannot fail** | **HIT, severe** | §3.1, §3.2 — five of the six boolean predicates behind F-a and F-b are true for every possible input. The byte-identity gate is real but scoped to CSS bytes, so it cannot see the JS regression it is cited to exclude (§2.1). |
| **Elegant-reduction trap** | **HIT** | "Reveal, never reorder" is elegant and it *defers the hard part*: making Deal read as the commit verb (mark 1) is handed to reveal-order and reveal-order makes it worse (§4.1); giving the three zones distinct weight (item 2) is handed to three wrapper divs and reproduces the indicted pattern (§4.3); making the sheet's contents *live* during the glide (item 5) is refused on principle (§4.2). D5 (the single template, where every deletion and the whole parsimony case lives) is "and then the hard part" in its entirety — unbuilt. |
| **Legacy aliases** | **HIT** | The stacked mount survives as `v-if="false"` with its `lg:hidden` class intact; `:mobile="false"` still passed to the slot; `.mobile-board-width` still in `scene.f3.css` (:120) **and** still named in the class-name contract header (:11) and in three F6 fade rules (:225, :230, :243). D9 keeps one storage key with two decoders and reads mobile-written values on desktop (§2.14). Two independent "is the controls surface open" truths — `drawerOpen` and `sheetDetent` — coexist with `toggleDrawer` still a defined no-op <1024. |
| **Masked fallbacks** | **HIT** | `restFor()` falls back `?? HALF_PX` — if `railEl` is null, `full` silently equals `half` and `pickDetent` collapses two rows onto one number with no signal. `useKeyboardViewport`'s `--vv-height` falls back to `100dvh` in CSS, so a composable that fails to install yields a sheet anchored to the layout viewport that renders *plausibly* and sits under the keyboard — silent, not loud. `anchorPx()`'s `min(layoutHeight, …)` clamp is load-bearing and, by design, unobservable when it fires. |
| **Unverified gestalt** | **HIT** | The compositions *were* rendered (7 PNGs, both themes — creditable, and more than the sibling lanes did). But the renders contradict the claims and nobody said so: `full` shows NEW GAME as the middle stanza with a 28px Deal (§4.1) and three identical caps eyebrows (§4.3); `closed` shows 257px of void where "the board takes the full viewport" was promised (§4.6); `half` shows the action row flush to the frame with no home-indicator room (§2.9). Never rendered at all: the real components, `HandDrawnOutline`, the washi chips, the "hold to peek" label, the z-60 sun, landscape, iPad portrait. |
| **Consumer-less substrate** | **HIT, partial** | `useSheetDetents.ts` (+160) specified, no consumer built. The diff's `sheet-grabber` is `aria-hidden` with no role/tabindex, and the diff has **no** tap-toggle, keyboard path or DrawerTab variant — so the mock's click-suppression, `aria-expanded` and Esc machinery have no consumer in the shipped artifact. `--vv-height` is published at every width; only the `<lg` block reads it. |

---

## 6 · OPEN GAPS

**Blocking**
1. Unguarded pointer handlers corrupt the ≥1024 audited drawer (§2.1).
2. `drawerInert` + the opener-inside-the-inert-container makes the sheet permanently unopenable for
   any profile with `csp-drawer-open === "0"`; D6 and D10 are mutually unsatisfiable (§2.2).
3. D7's arbitration is false against the code — the peek has no slop cancellation; peek and drag
   both fire on the divider band (§2.3).
4. The pane cannot scroll in the real DOM; the `full` detent's tail is unreachable (§2.5).
5. Mark 1 is not cured and D4's reorder regresses it (§4.1).
6. Brief item 2 (no composition grammar) is reproduced rather than answered (§4.3).

**Major**
7. F-a, F-b and F-c do not test what they claim; no falsifier can fire (§3.1–3.3).
8. Every measurement is against a mock whose divergences are concentrated in the falsifiers'
   subjects (§1).
9. The spike drags from the pane in violation of D7's own refusal (§2.4).
10. `restFor("full")` forces a layout per `pointermove` (§2.6).
11. D3's `max-height` performs the height-yield D3 forbids; HandDrawnOutline re-bakes the full pose
    stack on every keyboard resize (§2.7).
12. D8's pane formula collapses the pane to 0px with the keyboard up (§2.8).
13. The "mobile win" needs a `<lg` board-grow rung that is undesigned and unbudgeted; 257px of void
    at closed (§4.6).
14. D5 — the single template, the whole parsimony case — unbuilt; net-LOC sign unknown (§4.9).
15. Landscape and iPad-portrait <1024 unmeasured and unrendered; landscape is where a fixed bottom
    sheet is most hostile and where today's board has no height cap at all.
16. No scrim, no tap-outside dismiss, no board `inert` at the `full` detent, which occludes ~5/6 of
    the board while leaving the visible strip interactive.

**Minor**
17. The 248px half is wrong by ~34px on notched hardware and is a fallback-font measurement (§2.9).
18. `zones.sheetFull: 628` mislabelled as a clamp; it's content-bound (§2.10).
19. `html.sheet-gesturing { overflow: hidden }` resets iOS document scroll mid-gesture (§2.11).
20. The mock's click-suppression latches permanently after one drag, and is never exercised (§2.12).
21. `aria-expanded` can't express three detents; `aria-controls` now names an ancestor (§2.13).
22. D9 makes the family's headline the default for no returning user (§2.14).
23. `perf-rig-iphone16` is booted and was not used; four owner rows outstanding.

---

## 7 · WHAT TO CROSS-POLLINATE REGARDLESS

1. **The `translate:` / `transform:` channel split** for any gesture over a rest pose. Estate-native
   (`scene.css:76-82`), and the reason the FLIP settle lands at 0.00px onset discontinuity.
2. **`top: var(--vv-height)` + translate-up** as the iOS fixed-bottom idiom, with `--vv-height`
   published from the existing `useKeyboardViewport` listener, vars before `ensureVisible`.
3. **`run()`-per-release instead of `reverse()`** — supersession gives flick-during-settle for free
   and never engages the binary-flip limit. Applies to any multi-state glide in the estate.
4. **The prior-art convergence**: the glass curve *is* the iOS/vaul sheet curve. Any family adding
   sheet-like motion inherits a ratified curve at zero cost.
5. **The mechanical byte-identity audit** (`loc.mjs`) as a pattern for "I did not touch the audited
   surface" — with the lesson that it must cover behaviour, not only bytes.
6. **The dossier's quantified mobile case** (~1,072px stack vs ~745px band; controls never
   co-visible with the board) is the strongest single piece of evidence produced in pass 1 and
   belongs in whatever family wins.
7. **The prototype lane's willingness to falsify its own spec** (224→248) and to refuse its own
   net-LOC claim. That norm is worth more than the artifact.
