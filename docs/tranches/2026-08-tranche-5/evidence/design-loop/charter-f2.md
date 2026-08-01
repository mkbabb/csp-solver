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


## FAMILY 2 — THE PENCIL-CASE TRAY

**Center**: the drawer's fiction ("the pencil case tucked under the worksheet" — `useControlsDrawer.ts`'s own doc) is currently told by the motion but betrayed by the content, which is a settings form. Commit fully: the drawer content becomes the case's TRAY — compartments holding drawn objects whose rendered size and ink weight equal their rank. Nothing moves surfaces; everything re-renders.

**Substrate**: visual/object grammar of the drawer content + within-drawer micro-motion.

**Charter**:
- Study the existing object vocabulary: `DiceIcon.vue` (Deal), `EraserIcon.vue`, the icon set in `src/pencil/chrome/icons/`, `HandDrawnOutline.vue` (frames), `SheetWashiLabel.vue` (washi chips), `BoilDivider.vue` (the ruled line). The tray extends this vocabulary, it doesn't import a new one.
- Design the compartment grammar: what does a compartment look like in pencil (a drawn tray-well? a washi-taped region? ruled sub-sheets)? How do compartments replace the stanza stack in `GameControlPanel.vue` — the New-game well (Deal as a BIG die resting in its own compartment, size/difficulty pencilled beside it), the pencils well (Marks: three drawn pencils, one picked up), the teacher's well (Check as the red grading pen — the crayon-rose already exists as `--color-red-ink`).
- The Check integration question (the owner's sorest point): does rendering Check as the teacher's red pen — an object you take out, not a mode you set — make Off/Ask/Live read natural (pen away / pen on the desk / pen in hand)?
- Within-drawer choreography: contents settle as the case opens — a ≤120ms stagger INSIDE the existing 520ms glide window (`GLIDE_MS`, `MOTION.curves.drawerGlide`), riding `useFlipGlide` movers or one-shot `sequence` subscribers (the `GameGallery.vue` deal-beat pattern). The glide engine itself is untouched.
- Constraint discipline (mark 4): every new drawn object is a pre-baked pose stack (the grid-boil path-swap pattern; `rasterPose.ts`) — feTurbulence never runs live. Budget: how many new pose bakes does the tray cost on iOS?
- Mobile: the same tray grammar compresses into the stacked card — compartments in a 2-column flow instead of a stack. The tab-toggle (`mobile-heading-row`) dies; compartments are self-labelling.
- Prior art: Procreate's brush tray, physical pencil-case compartments, Tinybop/toca-style toy object grammars, board-game companion apps (dice given physical weight), the app's own AttributionCard/CrayonHeart as proof the estate can render objects.

**What it refuses**: relocating any control to another surface (the drawer keeps staging AND preferences); changing drawer regimes or the glide mechanism; touching the gallery beyond card-frame consistency; any typographic-only fix.

**Mark coverage**: 5 — the core (weight-by-rank through object size; Check naturalized as an object). 2 — the animation gains an interior life (contents settle in the case) without touching the engine. 1 — the NEW GAME compartment is the refined panel; the carousel cards inherit the tray's frame consistency. 3 — the mobile card becomes a tray, not a form. Mark 4: hardest-constrained family — all objects pose-baked, counted, and banded.

## SHARED BINDING CONSTRAINTS
- The pencil-notebook soul is non-negotiable; extend the estate's own vocabulary (HandDrawnOutline, washi, scribble underline, the hand + Fraunces registers), never import another.
- Extreme parsimony: prefer deletion; a family wins partly on net-LOC. Library-level question standing: does a fix belong in pencil-boil or `games/shared` rather than per-game?
- Safari/iOS first-class; T4-P1 perf campaign runs in parallel — NO new live-filter surfaces; pose-bake machinery for anything drawn (mark 4's cured pipeline is the only rasterizer).
- One live board invariant (Teleport projection); TypeScript ~6.0.3; the eslint pencil↛games boundary; `errorCheckMode` stays a manual prop+emit (the same-value re-emit is load-bearing).
- PRM paths and the a11y contracts (aria-expanded truth at click, focus reclaim, inert-at-rest, listbox-over-carousel) are inherited obligations, not optional.
