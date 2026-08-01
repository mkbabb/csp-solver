---

## PROBLEM BRIEF (shared by every lane)

1. **Deal affordance weight ≪ its rank**: the sole commit verb of the staged zone is a 28px `DiceIcon` + caption sublabel, visually subordinate to the option lists it commits (`GameControlPanel.vue` `.deal-row`/`.deal-btn`).
2. **The drawer has no composition grammar**: ~7 near-identical stanzas — display-caps `section-heading` + `OptionSelector` row — give staging (Size/Difficulty), play (Marks), and preference (Check/Candidates) identical visual weight; zones are marked only by one divider + placement.
3. **CHECK + CANDIDATES are preference-cadence controls holding play-cadence real estate** — the owner's "contrived, not naturally integrated" (`AssistSettings.vue`, mounted mid-panel in both regimes).
4. **New-game staging is split across two surfaces** with no connective tissue: the carousel picks the game; the drawer stages size/difficulty and deals.
5. **The drawer choreography exists only ≥1024** (`useControlsDrawer.ts` regime rule); the tab is a static tongue; contents are frozen freight during the 520ms glide — the case moves, nothing inside it lives.
6. **Mobile is a compressed desktop**: the full panel stacks below the board as one tall scroll card (`GameScene.vue` `.mobile-board-width`); no thumb geography, no drawer, tab-toggles standing in for hierarchy.
7. **Picker hierarchy is flat**: generic dot pips, estimated name boxes (`GameCard.vue` `nameViewBox`), a deal beat but no graded weight between center and flanks beyond scale.
8. **Binding constraint (mark 4, solved engineering)**: every drawn/filtered surface rides the pose-bake pipeline — intrinsic = capture px, opsz pinned, subset over all five labels; **no new live-filter surfaces**; Safari/iOS first-class. This constrains all families; it needs no lane.


## FAMILY 3 — ONE SHEET, EVERY WIDTH

**Center**: the drawer is the right idea implemented at one breakpoint. Universalize the mechanism: the pencil case tucks under the board's right edge ≥1024 (as today) and under the board's BOTTOM edge <1024 — a gesture-driven under-sheet with detents replacing the stacked mobile card. One grammar, one engine, every width.

**Substrate**: layout system + input model (gesture/detent), motion grammar.

**Charter**:
- Study the regime split as built: `useControlsDrawer.ts` (regime rule — `toggleDrawer` no-ops <1024; `rowRegime` mediaRef), `scene.css` (the `<lg` stacked card vs the ≥lg rail; `html.drawer-closed`/`html.drawer-gesturing` global classes), `GameScene.vue` (the doubled controls mount — mobile card + desktop rail, `slot name="controls" :mobile`). The bottom-sheet was an explicit T3 non-goal ("a touch bottom-sheet is an explicit non-goal this wave") — this family re-opens it deliberately.
- Design the detent system: closed (tab tongue only — board takes the full viewport, the mobile win), half (per-move tools row — the thumb detent), full (everything). Which contents live at which detent, and does the DOM reorder or just reveal?
- Engine question: can `useFlipGlide` drive a drag-following sheet, or does dragging need a scroll-snap substrate (the `GameGallery.vue` viewport pattern — CSS scroll-snap for touch, WAAPI for programmatic) with the FLIP glide reserved for tap-toggles? Prior art in-estate: `useCarouselGlide.ts` already marries native snap + glass-curve glide.
- The tab generalizes: `DrawerTab.vue`'s tongue rotates to the board's bottom edge <1024 — the "controls" washi label grammar kept. The 44px floor and `aria-expanded` contract carry over.
- Keyboard-avoidance collision: `useKeyboardViewport.ts` publishes `--keyboard-inset` and the stacked scene pads for it (`App.vue`) — how does a bottom sheet coexist with the OS keyboard on iOS (the sheet must yield, never stack under the keyboard)? This is the family's hardest Safari question; test on the real rig, not simulators alone.
- Safari/iOS discipline (mark 4 + the parallel perf campaign): the sheet's drag must be transform-only over promoted layers (the `html.drawer-gesturing` pattern); the filtered `control-panel-filtered` card must not re-raster during drag (its `will-change: transform` layerization is load-bearing — see the R3 note in `GameControlPanel.vue`).
- Prior art: iOS `UISheetPresentationController` detents, Google Maps' sheet, vaul (Emil Kowalski) for web-drawer physics, Material bottom-sheet spec, scroll-snap sheet implementations.

**What it refuses**: re-homing controls off the drawer (the sheet is the one home — content may reorder per detent but never emigrates); object skeuomorphism; touching the picker beyond how the sheet coexists with the gallery view.

**Mark coverage**: 3 — the core (mobile wholesale: the tall card dies, the board owns the viewport, controls come to the thumb). 2 — the animation refinement IS the generalized glide: drag-following, detent settle on the one glass curve, tab counter-motion. 5 — indirect: detent ordering forces a frequency ranking of content (half-detent = the important row). 1 — the NEW GAME zone becomes the full-detent's headline. Mark 4: no new filter surfaces; drag choreography must stay compositor-only.

## SHARED BINDING CONSTRAINTS
- The pencil-notebook soul is non-negotiable; extend the estate's own vocabulary (HandDrawnOutline, washi, scribble underline, the hand + Fraunces registers), never import another.
- Extreme parsimony: prefer deletion; a family wins partly on net-LOC. Library-level question standing: does a fix belong in pencil-boil or `games/shared` rather than per-game?
- Safari/iOS first-class; T4-P1 perf campaign runs in parallel — NO new live-filter surfaces; pose-bake machinery for anything drawn (mark 4's cured pipeline is the only rasterizer).
- One live board invariant (Teleport projection); TypeScript ~6.0.3; the eslint pencil↛games boundary; `errorCheckMode` stays a manual prop+emit (the same-value re-emit is load-bearing).
- PRM paths and the a11y contracts (aria-expanded truth at click, focus reclaim, inert-at-rest, listbox-over-carousel) are inherited obligations, not optional.
