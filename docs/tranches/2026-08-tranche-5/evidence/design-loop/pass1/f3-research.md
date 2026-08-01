# F3 RESEARCH DOSSIER — "one sheet, every width"

Pass 1 · RESEARCH lane · read-only against `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`
Charter: `…/scratchpad/design-loop/charter-f3.md`. Every verdict below is codebase-sourced; web prior art is background only and marked as such.

---

## Q1 — The regime split as built

### The regime rule is a hard early-return, not a CSS-only gate

`src/games/shared/useControlsDrawer.ts:295`

```ts
if (!hasDom || !rowRegime.value) return; // §6 regime rule: defined no-op <1024
```

`rowRegime` is a module-level `matchMedia("(min-width: 1024px)")` ref (`useControlsDrawer.ts:98`), alongside `wideMargin` (1360) and `reducedMotion`. Three MQ refs, one shared-listener pattern, module singleton. F3 does not need a new listener — it needs `rowRegime` to stop being a *veto* and start being an *axis selector*. That is a ~3-line change at the entry point; the rest of the file is axis-agnostic except the mover geometry (see Q3).

### The three global classes and where they live

- `html.drawer-closed` — the settled tucked layout. Written by `applyLayout()` (`useControlsDrawer.ts:104-106`), read in **three** files: `scene.css:83` (rail park), `App.vue:534-541` (masthead centering + `--logo-scale: 1.05`), `GameBoard.vue:844-857` (the three `shell-*` grow rungs).
- `html.drawer-gesturing` — the promotion window. `scene.css:98-105`.
- `html.gallery-leaving` — beat 0, chrome fade. `scene.css:160-165`.

**All of the `drawer-closed` / `drawer-gesturing` consumers are inside `@media (min-width: 1024px)`.** `scene.css:56`, `App.vue:533`, `GameBoard.vue:843`. So at <1024 the classes are inert *by stylesheet*, not merely by the JS no-op. F3 must either hoist those blocks or mint an axis-parallel set (`html.sheet-detent-{closed,half,full}`).

### The doubled controls mount is real and it is 2× the same slot

`GameScene.vue:79-105` renders `<slot name="controls">` **twice** — once in `.mobile-board-width.lg:hidden` (line 80-86), once in `.scene-controls.hidden.lg:flex` (line 93-105) — with the regime handed in as a scoped-slot boolean (`:mobile="true"` / `:mobile="false"`). Both mounts are `HandDrawnOutline`-framed cards. The consequence: **every game mounts two live GameControlPanel instances at all times.** That is why `newGameId` exists at all:

`GameControlPanel.vue:238-241`

```
// T4-WU/U2 — a unique id per panel instance … (each game mounts two panels — mobile card +
// desktop rail — so a static id would collide; `useId` keeps each accessible-name reference
// unambiguous).
```

Collapsing to one sheet retires that whole hazard class.

### The `<lg` stacked card vs the ≥lg rail

- `.mobile-board-width { width: min(42rem, calc(100vw - 1.5rem)) }` — `scene.css:120-122`. Width-matched to the board, no height cap.
- `.controls-card { max-height: calc(min(42rem, 85vw, 100dvh - 10rem) - 2rem); overflow-y: auto; overscroll-behavior: contain; }` — `scene.css:41-46`. **Row regime only** (the class lives inside the `lg:flex` rail). This is the estate's *only* inner scroller, and it already carries `overscroll-behavior: contain` — the exact property a sheet's content pane needs.
- `@media (max-width: 1023px) { .app-layout { flex-direction: column; align-items: center; gap: 1.25rem } }` — `scene.css:125-132`.

### The T3 non-goal is on the record, verbatim

`useControlsDrawer.ts:18` — "A touch bottom-sheet is an explicit non-goal this wave." The charter's framing is accurate; it is a documented deferral, not an oversight.

---

## Q2 — The detent system: what fits where

### Measured content inventory (sudoku, the 2-section reference; §MEASUREMENTS has the arithmetic)

| stanza | interactive targets | derived height (coarse, <lg) |
|---|---|---|
| "New game" eyebrow (`h2.new-game-heading`) | 0 | 28px |
| Size/Difficulty tab row + 1 visible selector | 2 tabs + 3 options | 79px |
| Deal (`.deal-row > .deal-btn`) | 1 | 62px |
| peek divider (`.peek-hold-surface`) | 0 (gesture) | 46px |
| Marks (`PencilModeToggle`) | 3 | 70px |
| Check (`AssistSettings` row 1) | 3 | 70px |
| Candidates (`AssistSettings` row 2) | 3 (2 + the 8px group gap) | 78px |
| action row (Clear/Fill/Solve/Share) | 4 | 52px |
| play tools (Undo/Redo/Hint) — coarse only | 3 | 58px |
| **card total** (+ `mt-3` 12px, `py-1.5` 12px) | **21 tap targets** | **≈567px** |

Against an iPhone-16 visible band of ≈745px with a 369px-wide 9×9 board, the stacked scene needs ≈1072px (§MEASUREMENTS). **The controls card is entirely below the fold today; board and controls are never co-visible on a phone.** That is the quantified case for F3, and it is stronger than the charter states.

### The half-detent budget is ~240px — it holds two rows, not five

Board fully visible ⇒ the sheet may claim `745 − (369 board + 40 vignette/margin + 60 masthead + 24 attribution + 12 padding) ≈ 240px`. Minus a 44px tongue ⇒ **~196px of usable half-detent.** That buys exactly two of the rows above (e.g. play tools 58 + action row 52 = 110px, or play tools + Marks 70 = 128px) with air. It will **not** hold the 5 OptionSelector stanzas (318px). The detent ordering is therefore forced, not chosen:

- **closed** — tongue only (44–48px).
- **half** — the per-move row: play tools (Undo/Redo/Hint) + the action row (Clear/Fill/Solve/Share). Marks is the contested third.
- **full** — everything, with the staged New-game zone as the headline (mark 1).

### DOM reorder vs reveal — the code answers this

**Reveal, not reorder.** Three independent reasons in the estate:

1. `errorCheckMode` is a manual prop+emit whose *same-value re-emit* re-arms the on-demand snapshot (`GameControlPanel.vue:98-100`, `AssistSettings.vue:19-21`). Reordering by re-rendering a different tree risks unmount/remount around that seam.
2. `expandedPanel` is component-local `ref` state (`GameControlPanel.vue:150`); a DOM reorder that remounts the panel loses the open tab.
3. The load-bearing one: `.control-panel-filtered` carries a 3-pass stroke filter *and* `will-change: transform` specifically so a **move** is a compositor offset (`GameControlPanel.vue:719-728`). Any detent implemented as a *height/layout* change re-rasters that filter. So detents must be a `translateY` of a **full-height sheet** whose contents never relayout — the same discipline as the crit kill ("the filtered board's SIZE is never tweened", `useFlipGlide.ts:22-24`).

Corollary: content that "lives at the half detent" must be *positioned* at the sheet's top, not conditionally rendered. Today the play-tools row is **last** in both templates (`GameControlPanel.vue:497-525`, `678-706`) and the staged zone is **first**. The half-detent ordering inverts the current source order — which is a one-time DOM reorder at build, not a per-detent one.

---

## Q3 — Engine: can `useFlipGlide` drive a drag-following sheet?

**No, not as it stands — three structural blocks.** (Read `useFlipGlide.ts:95-184` in full.)

1. **No scrub surface.** The controller is `{ run, reverse, settle, active }` (`useFlipGlide.ts:80-93`). There is no `pause()`, no `seek(t)`, no `currentTime` passthrough. WAAPI *can* be scrubbed, but exposing it means editing the file the codebase itself flags as the wave's named risk: "the drawer is the four-times-owner-audited surface, so the extraction is a strict no-behavior-change refactor" (`useFlipGlide.ts:9-11`).
2. **`fill: none` + `composite: replace` are load-bearing and anti-drag.** `useFlipGlide.ts:145-150`. A paused animation with `fill:none` at progress *p* holds the transform only while it exists; the whole point of the setting is that there is no "previous committed style" to capture (`useFlipGlide.ts:20-22`). A drag needs a *persistent* transform between frames — the opposite contract.
3. **FLIP lands the target layout at gesture ONSET.** `useControlsDrawer.ts:200` — `applyLayout(toOpen); // the ONE layout step — at onset, not settle`. A drag does not know its target until release. Either you pre-commit a layout you may not reach (wrong), or you drag transform-only over the *current* layout and apply the target at settle — which re-introduces exactly the layout+re-raster at settle that W12's crit kill removed.

### The verdict: split the gesture in two, both already precedented in-estate

- **Drag phase — direct `element.style.transform` writes on `pointermove`.** Not `useFlipGlide`, not CSS vars. The estate already has the pointer machine: `useLongPress.ts` (105 lines) is a slop-and-timer recognizer over `pointerdown/move/up/cancel`, deliberately **capture-free** ("no `setPointerCapture` fighting the native tap-to-focus", `useLongPress.ts:15-17`) and self-disposing via `onScopeDispose` (`:102`). A `useSheetDrag` is that shape with a `translateY` accumulator instead of a timer. Background prior art agrees on the *mechanism*: vaul moved off CSS custom properties precisely because "changing them will cause style recalculation for all children" and settled on direct `transform: translateY(${d}px)` writes.
- **Settle phase — `useFlipGlide` unchanged, one `run()` per release.** Measure the mid-drag pose with `getBoundingClientRect()` (which returns the *transformed* rect, so a drag-interrupted pose reads correctly), hand it as `from`, the detent rest pose as `to`. `run()` already "supersedes any in-flight glide silently" (`useFlipGlide.ts:81-83`), so a flick during a settle is free.

**`reverse()` cannot serve three detents.** `retarget()` is a strict binary flip — `targetOpen = !targetOpen` (`useControlsDrawer.ts:266`) then `glideCtl.reverse()`. Mid-glide *closed→full* while a *closed→half* glide runs is not a reversal; it needs a fresh `run()` from the live pose. This is the one place the drawer's proven mechanism genuinely does not generalize.

### Scroll-snap substrate: viable, but it costs the estate's only "no inner scroller" invariant

`useCarouselGlide.ts` is the in-estate proof that native snap and the glass curve can share one truth (`scrollLeft`): native inertia for touch (`GameGallery.vue:430` `scroll-snap-type: x mandatory`), and for programmatic steps it **suspends snap → writes scrollLeft once → FLIPs the delta onto the track's translateX → re-arms snap on the next frame** (`useCarouselGlide.ts:108-123`, `147-191`). That pattern maps cleanly onto a vertical sheet.

But two costs:

1. `e2e/mobile-platform.spec.ts:54-61` asserts, on iPhone geometry, that `<html>` is the scroller and `overscroll-behavior-y === "contain"`, with the reasoning inline: *"The app is an h-screen scene with no inner scroll container → `<html>` is the scroller."* Also stated in `src/assets/index.css:388-390`. A scroll-snap sheet introduces the app's **first** inner scroller at <1024. The assertion stays green, but the premise under it changes; the sheet's own scroller needs `overscroll-behavior: contain` added (`.controls-card` already has it — `scene.css:44`).
2. Background prior art flags a Safari-specific requirement: scroll-snap targets need a real `height: 1px` box to snap to, and the initial-snap selection needs an `@keyframes` trick that toggles `scroll-snap-type` mid-animation as an explicit "iOS Safari fix". That is machinery the transform path does not need.

**Recommendation to SYNTHESIZE:** transform-drag + `useFlipGlide` settle. It keeps one animation brain (the covenant), keeps the drag compositor-only, and needs no new scroller. Reserve scroll-snap as the fallback if drag-following proves untenable on the real rig.

---

## Q4 — The tab generalizes: one concrete blocker

### The 48px floor and the aria contract carry over cleanly

`DrawerTab.vue:56-58` — `width: 3rem` (48px) `height: 5.75rem` (92px), documented "48×92px ≥ the 44px floor" (`:12`). `aria-expanded` + `aria-controls="controls-drawer"` at `:34-35`. `e2e/drawer.spec.ts:37` and `mobile-platform.spec.ts:304-308` both assert the ≥44px target. Rotating to the bottom edge: `left: calc(100% - 0.5rem)` → `top: calc(100% - 0.5rem)`; `writing-mode: vertical-rl` → horizontal; `border-radius: 0 .75rem .75rem 0` → `0 0 .75rem .75rem`; the `clip-path` polygon (`:107`) transposes. All cosmetic.

### BLOCKER — `z-index: -1` breaks at <1024 because `.board-peek-host` is not a stacking context there

`DrawerTab.vue:52-56`

```css
left: calc(100% - 0.5rem);
top: 50%;
z-index: -1;
```

The negative z works at ≥1024 only because `scene.css:62-64` gives `.board-peek-host { z-index: 20 }` **inside `@media (min-width: 1024px)`**, making it a stacking context that contains the -1. Below 1024, `.board-peek-host` is `position: relative` with `z-index: auto` (`scene.css:110-113`) → **not** a stacking context. The tongue's `z-index: -1` then escapes to the root stacking context, where it paints in the negative-z layer — *beneath* the in-flow block background of `App.vue`'s root `<div class="bg-background …">` (`App.vue:374`). **The tongue would be invisible.**

Fix is one line: give `.board-peek-host` a `z-index` at <1024 too. Flagging it because it is exactly the kind of silent break the `scene.css:8-14` class-name contract warns about ("there is no build-time link between this file and the templates").

### The tab already rides the Teleport correctly

The tab lives inside `.board-peek-host` (`GameScene.vue:75`), which is the Teleport mover into the gallery card face (`GameScene.vue:65-77`), and `GameScene.vue:126-128` already hides it there (`.in-live-face :deep(.drawer-tab) { display: none }`). No new work for gallery coexistence.

### The gallery coexistence question is already answered by `v-show`

`App.vue:396` — `<div class="board-group" v-show="view === 'playing'">`. The mobile card and the rail both live inside `.board-group`, so in gallery view they are `display: none` while the *board alone* teleports out. A sheet that stays inside `.board-group` inherits that gating for free. **A sheet moved to a body-level Teleport or `position: fixed` App-level mount loses it and needs explicit `view` gating.**

---

## Q5 — Keyboard avoidance: the family's hardest Safari question

### What exists

`useKeyboardViewport.ts` (159 lines), installed once from `App.vue:34`. It publishes `--keyboard-inset` on `<html>` (`:82-85`) computed as `max(0, round(layoutHeight − (vvHeight + vvOffsetTop)))` (`:32-38`), and scrolls the focused cell clear of the band (`:87-98`). The composable is explicit that this is the only cross-engine path:

`useKeyboardViewport.ts:11-14`

```
… WebKit ships neither the `interactive-widget` viewport key nor the VirtualKeyboard API
(r3 rows 2b/2c, both hard refusals) — so a focused board cell below the keyboard fold is
eclipsed with nothing to push it up. `visualViewport` is the one cross-engine path (r3 row 2d)
```

### What consumes it: exactly one rule, and it is useless to a sheet

`App.vue:552-561`

```css
@media (max-width: 1023px) {
  .board-group {
    align-items: center;
    padding-bottom: var(--keyboard-inset, 0px);
  }
}
```

That is the **only** consumer in `src/` (grep-verified). It buys bottom *scroll-room* for the in-flow stacked card. A `position: fixed` sheet is anchored to the **layout** viewport, which iOS does not shrink — so the sheet would sit **under** the keyboard and `padding-bottom` on an ancestor would do nothing. **F3 must mint the second consumer.**

### The shape of the fix, and why the estate's own idiom already solves the collision

Background prior art converges on one recipe for iOS: do **not** use `bottom: 0`; anchor with `top: <visualViewport.height>` and pull up with `translateY(-100%)`, driven off `visualViewport` resize. Vaul does the height variant (`height = visualViewportHeight − OFFSET`, `position = max(diffFromInitial, 0)`). `env(keyboard-inset-height)` is the CSS-native answer but it is VirtualKeyboard-API-gated → **0 on Safari**, exactly the refusal `useKeyboardViewport.ts:11-14` already records.

That recipe puts the sheet's *rest pose* on the transform channel — colliding head-on with the drag, which also owns transform. **The estate already solved this exact collision once:**

`scene.css:76-82`

```
The parked pose rides the `translate:` CHANNEL, never `transform` — no mover animates
translate, so no animation or transition can ever capture it as a start base (the F1
phantom's raw material, removed …)
```

So: **sheet rest/keyboard pose on `translate:`, drag + settle on `transform:`.** Two independent channels, composed by the compositor, zero interference, and it is a documented house idiom rather than an import. This is the dossier's strongest synthesis input.

Height must **not** be the yield mechanism: shrinking the sheet relayouts `.control-panel-filtered` and re-rasters its 3-pass filter (`GameControlPanel.vue:721-726`). Yield by translate; cap reachable content with `max-height: calc(<detent> − var(--keyboard-inset, 0px))` on the *inner scroller*, not the sheet.

### Two real-rig risks (test on `perf-rig-iphone16`, not the simulator)

1. **iOS 26 `visualViewport.offsetTop` does not reset to 0 on keyboard dismiss** (background: Apple Developer Forums thread 800125 and multiple write-ups). `computeKeyboardInset` *subtracts* `offsetTop` (`useKeyboardViewport.ts:37`), so a stuck non-zero offsetTop makes the inset **too small** → the sheet under-yields. Today this is masked because `onFocusOut` eagerly writes `--keyboard-inset: 0px` (`:139`). A sheet reading the inset continuously would not be masked.
2. `useKeyboardViewport.ts:104` tracks the keyboard mid-animation with `ensureVisible("auto")` on every resize. A sheet that also translates on every resize will compose with a `window.scrollBy` on the same frames. Needs an explicit ordering rule.
3. Also worth noting: `safe-area-inset-bottom` is **never** used in the estate — only `-top` and `-right`, both on `.corner-right` (`App.vue:458-459`). A bottom sheet is the first surface that needs `env(safe-area-inset-bottom)`, and `viewport-fit=cover` is already set (`index.html:12`), so the inset will be real on notched hardware.

---

## Q6 — Safari/iOS drag discipline: compositor-only is achievable, with two named traps

### What is already right

- `html.drawer-gesturing` arms **no transitions** — it only promotes (`scene.css:91-105`, and the same note at `useControlsDrawer.ts:41-43`). The class is the correct model for a drag window: add on `pointerdown`, remove at settle.
- `.control-panel-filtered { filter: v-bind(panelFilter); will-change: transform }` with the measurement on the record (`GameControlPanel.vue:721-726`): "Layerized, a move is a compositor offset and boil-tick invalidations stop sharing tiles with the filter (measured −57% switch raster vs unlayered)." A translate-only drag over this layer is safe. A *scale* or a *height* change is not.
- The `BoilDivider` inside the sheet is the app's ONE remaining live-filtered pose stack — 4 static sibling `<g>`s, each `will-change: opacity`, opacity-swap steady state (`BoilDivider.vue:19-49`, `110-115`), ~0.26 MB. Opacity swaps do not fight a parent translate.

### Trap 1 — `will-change: transform` on `.board-peek-host` becomes a containing block mid-gesture

`scene.css:98-100` sets `will-change: transform` on `.board-peek-host` for the gesture's duration. `will-change: transform` creates a containing block for `position: fixed` descendants. **If the sheet is `position: fixed` and mounted inside `.board-peek-host` (to ride the board's glide the way `DrawerTab` does), its containing block changes at gesture onset and reverts at settle — a guaranteed jump.** Either mount the sheet outside `.board-peek-host`, or make it `absolute` in a stable ancestor.

### Trap 2 — the peek gesture and the sheet drag collide on the same 44px band

`GameControlPanel.vue:412-421` / `587-596`: the `BoilDivider` wrapper takes `pointerdown/up/leave/cancel` for a **350ms** press-and-hold (`PEEK_HOLD_MS`, `:157`) and carries `touch-action: none; user-select: none` (`.peek-hold-surface`, `:842-846`) — padded to `padding-block: 1rem` (a ~46px band) on coarse (`:874-877`). This band is the **zone separator sitting mid-panel**, i.e. precisely where a half-detent boundary or a drag handle would go.

`touch-action: none` on that element means the browser hands *all* pointer movement to JS there — so a downward drag started on the divider will never scroll, and *will* be interpreted by whichever recognizer wins. Two recognizers, one 46px band, one press. This must be adjudicated explicitly; the vaul-style rule ("only drag when the content is scrolled to top", plus a ~100ms post-scroll drag lockout) is the background analogue, but the estate's peek is a *hold*, not a scroll, so slop-vs-time arbitration is the actual question. `useLongPress.ts:73-80` already implements slop cancellation (`slopPx` default 10) — the machinery exists; the two owners do not yet know about each other.

### Trap 3 — the drag handle must not be the tongue alone

`DrawerTab.vue:36` binds `@click.stop="$emit('toggle')"` — a click, not a pointer sequence. A drag that begins on the tongue must suppress the trailing click, or every drag also fires a toggle. `GameControlPanel.vue:161-179` shows the estate's precedent for hold/click arbitration and explicitly notes it needs none because "the divider has no click action" — the tab *does*.

---

## MEASUREMENTS

### LOC (`wc -l`, all under `web/frontend/src`)

| file | LOC |
|---|---|
| `games/shared/GameControlPanel.vue` | 1025 |
| `pencil/chrome/GameGallery/GameGallery.vue` | 613 |
| `App.vue` | 570 |
| `pencil/chrome/GameGallery/GameCard.vue` | 433 |
| `games/shared/useControlsDrawer.ts` | 353 |
| `pencil/chrome/GameGallery/useCarouselGlide.ts` | 226 |
| `games/shared/useFlipGlide.ts` | 184 |
| `games/shared/scene.css` | 175 |
| `games/shared/useKeyboardViewport.ts` | 159 |
| `games/shared/GameScene.vue` | 129 |
| `games/shared/DrawerTab.vue` | 126 |
| `pencil/chrome/OptionSelector/OptionSelector.vue` | 114 |
| `pencil/chrome/BoilDivider.vue` | 118 |
| `pencil/chrome/KeyboardLegend.vue` | 107 |
| `games/shared/useLongPress.ts` | 105 |
| `games/shared/useGameGallery.ts` | 103 |
| `games/shared/AssistSettings.vue` | 91 |
| **subtotal (charter-named surface)** | **4550** |

### The duplication prize — the mobile/desktop template fork

`GameControlPanel.vue` `<template>` spans lines 328–711 (384 lines) and is a straight `v-if="mobile"` / `v-else` fork:

- mobile block `330–526` → **171** non-blank, non-comment lines
- desktop block `529–710` → **158** non-blank, non-comment lines
- `diff` between the two, comments stripped: **56 removed / 43 added = 99 differing lines** ⇒ **≈115 lines byte-identical across the fork.**

The five substantive divergences, exhaustively:

1. mobile has the `showTabs` tab-toggle + `heading-value` closed-tab readout; desktop shows all sections with `<hr class="border-border/50 my-3 w-full">` separators.
2. desktop adds 5 `SheetWashiLabel` hover chips (Deal seed 11, Clear 23, fill-forced 43, Solve 37, share 71) + `group relative` on those buttons.
3. desktop appends `<KeyboardLegend />` (107 LOC component, fine-pointer only).
4. the `mobile` flag threaded to `OptionSelector` / `PencilModeToggle` / `AssistSettings` (font-size + row-vs-column).
5. spacing: `mt-3` on the mobile wrap, `my-2` on the desktop peek surface.

**`mobile` prop reach: 13 files, 47 occurrences** in the control chain — `GameControlPanel.vue`, `GameScene.vue`, `AssistSettings.vue`, `PencilModeToggle.vue`, `OptionSelector.vue`, `AttributionCard.vue`, and all five `*Game.vue` + the two `ControlPanel.vue` section-suppliers.

**Net-LOC estimate for F3:** delete ≈171 (one template half) + ≈13 (`GameScene`'s doubled mount) + ≈20 (prop plumbing) ≈ **204 lines**; add a `useSheetDetent` + drag recognizer at **≈120–180 lines** (`useLongPress` at 105 is the size precedent) plus ~40 lines of `scene.css`. **Plausibly net-negative or break-even — and it removes the dual-panel-instance hazard entirely (`useId` at `GameControlPanel.vue:241`).**

### Control inventory (sudoku reference, `sizeOptions` 3 × `difficultyOptions` 3)

- `h2.section-heading` rendered per panel: **6** (New game eyebrow, Size, Difficulty, Marks, Check, Candidates). Charter's brief says "~7 near-identical stanzas"; measured **6 headings / 5 `OptionSelector` rows**.
- `OptionSelector` instances per panel: **5** (Size, Difficulty, Marks, Check, Candidates) — 3+3+3+3+2 = **14 option buttons**.
- Icon buttons: Deal (1) + action row (4: Clear/Fill/Solve/Share) + play tools (3: Undo/Redo/Hint, coarse-gated) = **8**.
- Section tabs (mobile, n≥2): **2**.
- Gesture-only surfaces: **1** (`.peek-hold-surface`, 350ms hold).
- **Coarse <lg total: 21 simultaneous tap targets + 1 gesture band.** Fine ≥lg: 19 + `KeyboardLegend`.
- Zone markers total: **1 `BoilDivider` + 1 `<hr>` per extra section** (desktop only). Confirms brief item 2.

### Size / scale numbers

| quantity | value | source |
|---|---|---|
| drawer regime threshold | 1024px | `useControlsDrawer.ts:98` |
| wide-margin threshold | 1360px | `useControlsDrawer.ts:99` |
| glide duration | **520ms** | `useControlsDrawer.ts:61` (`GLIDE_MS`) |
| settle guard | duration + 220ms = 740ms | `useFlipGlide.ts:97` |
| the ONE glass curve | `cubic-bezier(0.32, 0.72, 0, 1)` | `pencilConfig.ts:185` |
| card-step glide | 440ms | `pencilConfig.ts:142` |
| board⇄card fold | 520ms | `pencilConfig.ts:149` |
| chrome-leave (beat 0) | 200ms | `pencilConfig.ts:155` |
| beat window | 125ms (~8 Hz) | `pencilConfig.ts:119` |
| tab tongue | 48 × 92px (`3rem × 5.75rem`) | `DrawerTab.vue:56-57` |
| tab tuck under the sheet | `left: calc(100% - 0.5rem)`, `z-index: -1` | `DrawerTab.vue:54-55` |
| parked case inset | `right: 3rem`, `top: 50%`, `translate: 0 -50%` | `scene.css:83-89` |
| row-regime gap | `3.5rem` (air for the 48px tongue) | `scene.css:59` |
| stacked gap | `1.25rem` | `scene.css:129` |
| mobile card width | `min(42rem, 100vw − 1.5rem)` | `scene.css:121` |
| ≥lg card max-height | `min(42rem, 85vw, 100dvh − 10rem) − 2rem` | `scene.css:42` |
| board widths (shell-sm/md/lg) | `min(26rem\|42rem\|52rem, 100vw − 1.5rem)` | `GameBoard.vue:217-220` |
| board grow when closed (≥1024 only) | 28rem / 46rem / 56rem, `max-w: 100dvh − 9rem` | `GameBoard.vue:844-857` |
| tap floor | 44px; `icon-btn` min 2.75rem | `GameControlPanel.vue:879-887` |
| peek hold | 350ms; coarse band `padding-block: 1rem` (~46px) | `GameControlPanel.vue:157`, `875-877` |
| long-press default | 450ms, slop 10px | `useLongPress.ts:40-41` |
| coarse two-tap arm window | 2500ms (Deal + Clear) | `GameControlPanel.vue:262`, `296` |
| `.controls-card` z | 45; `.corner-right` z | 60 | `scene.css:117`, `App.vue:446` |
| section-heading type | `--type-subheading` 1.272rem (20.4px, √φ) | `typography.css:253`, `:36` |
| BoilDivider | 14px CSS tall, 4 poses ≈ 0.26 MB | `BoilDivider.vue:98`, `:29` |

### Derived scene height (iPhone 16, 393 CSS px wide, ~745px visible band under Safari chrome)

Board `min(672, 393−24) = 369px` wide; 9×9 grid is square ⇒ ~369px tall. Scene stack:
`369 board + ~40 vignette/margin + ~60 masthead + ~24 mobile attribution + 12 main padding + 567 controls card ≈ 1072px`.
⇒ **≈330px of forced scroll; the controls card never shares the fold with the board.**
Half-detent room with the board fully visible: `745 − 505 ≈ 240px`, minus a 44px tongue ⇒ **≈196px usable.**

### Test surface F3 must re-cut

- `e2e/drawer.spec.ts` — 295 lines, 8 tests, **12 `.drawer-tab` references, 2 `.mobile-board-width` references**. The `drawer below the row regime` describe (`:278-295`, `viewport 900×800`) asserts the *exact* behaviour F3 deletes: `.drawer-tab` hidden, `.mobile-board-width` visible, `#controls-drawer` hidden, and hidden again after a persisted-closed reload.
- `e2e/mobile-platform.spec.ts` — 317 lines. `iPad portrait (<1024, coarse, stacked)` (`:283-296`) and `keyboard-avoid (emulated visualViewport)` (`:162+`, which stubs `window.visualViewport` with a controllable fake and notes *"Nothing else in the app (or pencil-boil) consumes visualViewport — grep-verified"* — **a sheet that reads `visualViewport` invalidates that grep-verified claim**).
- `e2e/mobile-affordances.spec.ts` — 369 lines, 10 tests over the coarse control surface (44px targets, sublabels, Clear/Deal arm beats, persistent peek washi). All of it lives in the sheet after F3.
- **Goldens: 8 files, none mobile/stacked/drawer** (`cell`, `grid-corner`, `logo`, `toggle-crest` × darwin/linux). F3 breaks **no** golden. Notable and favourable.
- Unit: no `useControlsDrawer` test exists. `useKeyboardViewport.test.ts` (69 lines) covers the two pure functions only.

---

## CONTRADICTIONS — what the charter/brief assumes that the code says otherwise

**C1 — "the tab is a static tongue" (brief item 5) is false. The tab is already the drawer's fourth WAAPI mover, and tab counter-motion is already shipped.**
`useControlsDrawer.ts:228-236` builds a dedicated mover so the tongue counter-scales the host's ride:
```ts
const hostScale = firstH.width / lastH.width;
specs.push({ el: tab, from: `translateY(-50%) scale(${1 / hostScale})`, to: "translateY(-50%) scale(1)" });
```
`DrawerTab.vue:74-79` documents it: *"the tongue counter-scales as the composable's fourth WAAPI mover (same glass curve, same clock — W13 §3-S3′), so its 48px never pops."* The charter's mark-2 coverage claims "tab counter-motion" as an F3 deliverable; **it exists at ≥1024 and only needs porting to the bottom axis.** F3's genuinely new motion is *drag-following* and *detent settle*, not counter-motion.

**C2 — the closed detent will not make the board grow at <1024. The "mobile win" is scroll elimination, not board growth.**
The charter says closed = "board takes the full viewport, the mobile win." But the `html.drawer-closed` grow rungs are gated `@media (min-width: 1024px)` (`GameBoard.vue:843-857`), and at <1024 the board is already **width**-bound at `min(42rem, 100vw − 1.5rem)` (`GameBoard.vue:219`) with **no height cap** — the `max-w-[calc(100dvh-10rem)]` arm is `lg:`-prefixed. Reclaiming 567px of vertical space therefore gives the board nothing to grow into unless F3 *also* mints a `<lg` height-driven arm. Two design consequences: (a) the closed-detent win must be stated as "board and masthead centred in the fold, zero scroll", which is true and large; (b) a `<lg` height cap is new scope the charter does not name.

**C3 — `--keyboard-inset` has exactly one consumer, and it is structurally useless to a fixed sheet.**
The charter says "the stacked scene pads for it (`App.vue`)" — correct, and that is *all* it does: `.board-group { padding-bottom: var(--keyboard-inset, 0px) }` inside `@media (max-width: 1023px)` (`App.vue:552-561`), the sole consumer in `src/`. Ancestor padding cannot move a `position: fixed` child, and iOS does not shrink the layout viewport. F3 must add a second consumer on the sheet itself; the existing rule is not reusable, only precedent for the custom-property idiom.

**C4 — `useFlipGlide`'s controller has no scrub surface, so "can `useFlipGlide` drive a drag-following sheet?" answers *no* without editing the file the codebase designates as its named risk.**
`useFlipGlide.ts:80-93` exposes only `run/reverse/settle/active`; `fill: none` + `composite: replace` (`:145-150`) are the anti-phantom contract, not incidental. And FLIP's target layout lands at *onset* (`useControlsDrawer.ts:200`) — a drag has no known target at onset. The charter frames this as an open engine question; the code closes it. The workable answer is the split (direct transform writes for the drag, `useFlipGlide` for the settle), which the charter does not enumerate as an option.

**C5 — `reverse()` cannot retarget among three detents.**
`retarget()` is `targetOpen = !targetOpen` (`useControlsDrawer.ts:266`), a binary flip. Three detents need a fresh `run()` from the live (transformed) pose. The proven mid-glide re-click path does not generalize to the detent count the charter asks for.

**C6 — the tongue's `z-index: -1` renders it invisible at <1024 as the CSS stands.**
`.board-peek-host` gets `z-index: 20` only inside `@media (min-width: 1024px)` (`scene.css:62-64`); below that it is `position: relative; z-index: auto` (`scene.css:110-113`), so `DrawerTab`'s `z-index: -1` (`DrawerTab.vue:55`) escapes to the root stacking context and paints beneath the app root's `bg-background` block background (`App.vue:374`). The charter treats the tab port as cosmetic; it is cosmetic **plus** one stacking-context line.

**C7 — a bottom sheet contradicts an asserted architectural premise, not just a non-goal.**
Beyond `useControlsDrawer.ts:18` ("a touch bottom-sheet is an explicit non-goal this wave"), `index.css:388-390` and `e2e/mobile-platform.spec.ts:56` both assert *"the app is an h-screen scene with no inner scroll container."* Any sheet with a scrollable content pane makes that sentence false at <1024. The assertion (`overscroll-behavior-y === "contain"` on `documentElement`) stays green, but the comment and the reasoning need re-cutting, and the sheet's pane needs its own `overscroll-behavior: contain`.

**C8 — the brief's "~7 near-identical stanzas" measures as 6 headings / 5 selector rows.** `GameControlPanel.vue` renders `h2.section-heading` six times (New game, Size, Difficulty, Marks, Check, Candidates) over five `OptionSelector` rows. The claim's *substance* holds — five rows are visually interchangeable — but the count should be stated as measured.

**C9 — NOT a contradiction, recorded to prevent a false one.** `useKeyboardViewport.ts:25` is `CELL_SELECTOR = ".sudoku-cell,.futoshiki-cell"`, only two classes against five shipped games. It is nonetheless complete: killer and thermo mount `SudokuCell` (`KillerBoard.vue:14`, `ThermoBoard.vue:14` → `SudokuCell.vue:93` carries `sudoku-cell`) and kenken mounts `FutoshikiCell` (`KenKenBoard.vue:15` → `FutoshikiCell.vue:98`). Coverage is total by component reuse.

---

## PRIOR ART — the one finding that changes the design

**The estate is already running the industry-standard bottom-sheet curve, at the industry-standard duration, by independent convergence.**

- `pencilConfig.ts:185` — `drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)"`, chosen by the owner's audit-4 ruling after auditioning three glass variants against the shipped spring, at **520ms**, described as "the iOS-sheet class … the reference class won verbatim" (`pencilConfig.ts:176-184`).
- vaul (Emil Kowalski) ships **`cubic-bezier(0.32, 0.72, 0, 1)` at 500ms**, sourced from the Ionic Framework, explicitly to reproduce Apple's iOS sheet feel.

Byte-identical control points. **F3 needs no new curve, no new named timing, and no ratify-me row for the sheet's motion** — the glass curve *is* the sheet curve, and `MOTION.curves.drawerGlide` is already its canonical TS home with a documented two-layer rule (`pencilConfig.ts:156-173`). This is the cheapest possible answer to "extend the estate's own vocabulary, never import another."

Secondary background findings, all mechanism-level and consistent with estate discipline:
- Drag must be direct `element.style.transform` writes, **not** CSS custom properties — vaul moved off `--swipe-amount` because "changing them will cause style recalculation for all children." Matches `GameControlPanel.vue:721-726`'s layerization rationale exactly.
- Momentum/flick beats threshold-dragging; snap to the nearest detent by position **plus** velocity.
- `shouldDrag` gate: only allow sheet drag when the content pane is scrolled to top, with a ~100ms post-scroll lockout. Directly relevant to Trap 2.
- iOS fixed-bottom cure: `top: <visualViewport.height>` + `translateY(-100%)`, JS-driven — purely-CSS approaches are documented as ineffective. `env(keyboard-inset-height)` is VirtualKeyboard-gated ⇒ 0 on Safari, corroborating `useKeyboardViewport.ts:11-14`.
- iOS 26 regression: `visualViewport.offsetTop` fails to reset to 0 after keyboard dismissal.
- The pure-CSS scroll-snap sheet alternative exists and works on iOS 11+, but needs `height: 1px` snap-target boxes, an `@keyframes` `scroll-snap-type` toggle as an explicit "iOS Safari fix", and IntersectionObserver to detect Firefox/Safari re-snap after layout changes. More machinery than the transform path.
- `UISheetPresentationController` ships only `.medium()` (half) and `.large()` (full) as first-class detents; arbitrary custom detents are a workaround. The three-detent closed/half/full shape the charter proposes is the platform's own, not an invention.

Sources: [Building a drawer component — Emil Kowalski](https://emilkowal.ski/ui/building-a-drawer-component) · [vaul](https://github.com/emilkowalski/vaul) · [Native-like bottom sheets on the web — viliket](https://viliket.github.io/posts/native-like-bottom-sheets-on-the-web/) · [Customize and resize sheets in UIKit (WWDC21)](https://developer.apple.com/videos/play/wwdc2021/10063/) · [Presenting sheets with UISheetPresentationController — SwiftLee](https://www.avanderlee.com/swift/presenting-sheets-uikit-uisheetpresentationcontroller/) · [Prevent content hidden under the virtual keyboard — Bram.us](https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/) · [Fixed elements on top of the iOS keyboard — mathix.dev](https://mathix.dev/blog/fix-html-elements-on-top-of-the-ios-keyboard-using-html-css-js) · [Apple Developer Forums 800125](https://developer.apple.com/forums/thread/800125)

---

## OPEN QUESTIONS (for SYNTHESIZE / PROTOTYPE / CRITIQUE)

1. **Peek-vs-drag adjudication.** The 46px `.peek-hold-surface` band (`touch-action: none`, 350ms hold) sits mid-panel where the half-detent boundary wants to be. Options: move the peek to a dedicated handle; arbitrate by slop-before-time (the `useLongPress.ts:73-80` idiom); or make the drag handle the tongue + a dedicated grabber and leave the divider alone. **CRITIQUE must include a "two recognizers, one band" failure mode.**
2. **Does the tongue survive at the bottom edge, or does the sheet get a grabber?** iOS sheets use a centred grabber pill, not a lateral tab. The charter *requires* the washi "controls" label grammar. A bottom-edge washi tongue with a horizontal label is the estate-faithful read; whether it reads as draggable is a PROTOTYPE question.
3. **Detent persistence codec.** `STORAGE_KEY = "csp-drawer-open"` stores `"1"`/`"0"` and `readStored()` returns `!== "0"` (`useControlsDrawer.ts:56`, `:65-72`). Three detents need a widened codec; any non-`"0"` legacy value must map to a sane detent (half, probably) rather than reading as "open ⇒ full".
4. **Does the ≥1024 axis stay horizontal, or does one grammar mean one axis?** The charter says the case tucks right ≥1024 and bottom <1024 — *one grammar, two axes*. That keeps two mover geometries in `glide()` (`useControlsDrawer.ts:206-247`). A genuinely single mechanism would make the sheet bottom-anchored at every width, which contradicts the four-times-audited ≥1024 fiction (`scene.css:48-55`) and the masthead/board grow that rides it. **This is the family's central scope decision and it is not settled by the charter text.**
5. **Half-detent contents.** ~196px. Play tools + action row (110px) is the frequency-honest answer, but the charter's mark-5 note says "detent ordering forces a frequency ranking" — is Marks a per-move tool (⇒ half) or a preference (⇒ full)? `PencilModeToggle` is arguably the most-touched control in solving.
6. **Where does the sheet mount in the tree?** Inside `.board-group` inherits gallery `v-show` gating for free (`App.vue:396`) but sits under `.board-peek-host`'s mid-gesture `will-change` containing block (Trap 1). App-level/`position: fixed` needs explicit `view === 'playing'` gating **and** re-homes `#controls-drawer`, which 12 e2e references target.
7. **`KeyboardLegend` (107 LOC, fine-pointer only) and the 5 `SheetWashiLabel` hover chips in a unified sheet.** Both are pointer-media-gated presentation. Do they survive as `@media (hover: hover)` branches inside one template (the estate's existing pattern — `GameControlPanel.vue:798-802`, `874-892`), or does F3 delete the washi chips now that the sublabels are unconditional on Deal (`:767-769`)?
8. **Real-rig verification, not simulator.** iOS 26 `offsetTop` non-reset (item C3/Q5) and the `visualViewport` resize ordering against `window.scrollBy` (`useKeyboardViewport.ts:104`) both need `perf-rig-iphone16` *hardware*. `e2e/mobile-platform.spec.ts:162+` stubs `visualViewport` with a fake — it can never catch either.
9. **Library-level question (standing directive).** A drag-to-detent recognizer is generic: `pencil-boil`, `games/shared`, or per-scene? `useLongPress.ts` and `useFlipGlide.ts` both live in `games/shared` despite being pencil-generic, and the eslint pencil↛games boundary forbids pencil importing them. If the sheet is pencil chrome, the recognizer must be pencil-side.
10. **Does the mobile section tab-toggle die?** `showTabs` (`GameControlPanel.vue:127`) exists purely because the stacked card lacked vertical room. A full detent has room for both selectors with `<hr>` separators, desktop-style — deleting `showTabs`, `expandedPanel`, `valueLabel`, `.mobile-heading-row`, `.mobile-heading-btn`, `.heading-value` and the UI-12 closed-tab readout (≈45 LOC + 3 CSS blocks). That is the largest single deletion F3 can bank, and it is a **behaviour** change (UI-12 was a deliberate fix), so it needs an owner row.
