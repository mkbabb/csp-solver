# Round-Zero Portfolio — the owner's five marks, 2026-07-31

Minted from the real estate (read, not imagined): `src/games/shared/GameControlPanel.vue` (the drawer's whole content, both regimes), `useControlsDrawer.ts` + `useFlipGlide.ts` + `scene.css` (the glide engine + regimes), `DrawerTab.vue`, `GameScene.vue` (the scaffold + class contract), `src/pencil/chrome/GameGallery/{GameGallery,GameCard}.vue` + `useCarouselGlide.ts` (the picker), `OptionSelector/OptionSelector.vue` (the one segmented-control primitive), `AssistSettings.vue` + `PencilModeToggle.vue` (the CHECK/MARKS stanzas), `App.vue` (breakpoints + fold orchestration), `pencilConfig.ts` (MOTION + `curves.drawerGlide`), `assets/typography.css` (the √φ ladder). All paths below are absolute from `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/`.

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

---

## FAMILY 1 — THE CADENCE STRATA

**Center**: where a control lives is decided by its use-frequency — per-move, per-game, per-preference — and each cadence gets its own home on the page. The drawer stops being the home of everything.

**Substrate**: information architecture / component composition. The drawer's stanza stack is decomposed; the board's own geography (margins, edges) becomes a control surface.

**Charter** (runnable standalone):
- Inventory every control in `src/games/shared/GameControlPanel.vue` and classify by cadence: per-move (undo/redo/hint/marks-mode), per-game (Deal + size/difficulty staging, clear, solve, share), per-preference (Check, Candidates — `AssistSettings.vue`). Verify the classification against actual interaction: marks-mode flips mid-solve constantly; Check flips maybe once a session.
- Design the per-move stratum as a slim toolbar at the board's edge — marginalia on the worksheet, in the pencil hand. Investigate: does it live inside `.board-peek-host` (rides the drawer glide and the gallery fold for free — see `GameScene.vue`'s Teleport) or outside? What happens to it when the board teleports into the gallery's live face (`.in-live-face` already kills the `DrawerTab` — precedent at `GameScene.vue:126`)?
- Design the per-game stratum as ONE composed "next board" ticket — size/difficulty/Deal as a single object with Deal as its dominant verb, replacing the `new-game-zone` stanza stack. The sections arrive as data (`ControlSection[]` from the thin per-game panels, e.g. `src/games/sudoku/ControlPanel/ControlPanel.vue`) — the ticket must stay n-section-generic.
- Design the per-preference retreat: where do Check/Candidates go that reads natural, not exiled? Candidates: a corner of the ticket, a margin note (`MarginNote.vue` exists), a flip-side of the panel.
- Mobile: the per-move toolbar becomes the thumb-reach row (bottom of board, above the fold); measure whether the remaining mobile card shrinks enough to kill its scroll (`scene.css` `.controls-card` max-height cap).
- Prior art: NYT Games' sudoku toolbar (marks toggle at thumb), Procreate's edge toolbars, Figma's toolbar-vs-inspector split, HUD design frequency-placement doctrine, Apple HIG toolbar/settings separation.
- Parsimony question: how much of `GameControlPanel.vue`'s 1000 lines dissolves? The family wins only if net LOC falls.

**What it refuses**: skeuomorphic object rendering (controls stay typographic/segmented); moving staging into the gallery (the ticket lives in the playing scene); new sheet/gesture mechanics; touching carousel internals.

**Mark coverage**: 5 — the core (the stack dissolves into strata; Deal dominates its ticket; Check retreats). 1 — the ticket IS the refined NEW GAME panel. 3 — mobile gets thumb geography instead of a tall card. 2 — the drawer shrinks (less freight), so the existing 520ms glide reads cleaner without retuning. Mark 4 interaction: the toolbar's icons are existing baked assets; no new filter surfaces.

---

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

---

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

---

## FAMILY 4 — THE DEALER'S RITUAL

**Center**: a new game is ONE transaction, currently amputated across two surfaces. Fuse it in the picker: each carousel worksheet carries its own staging — size/difficulty pencilled in the card's margin, a Deal stamp as the card's dominant act — and dealing happens FROM the picker, riding the existing deal/fold beats. The drawer's staged zone dissolves to a "new game" shortcut that opens the gallery.

**Substrate**: the picker (GameGallery/GameCard) + the defineGame registry contract.

**Charter**:
- Study the transaction as built: the gallery selects a game id only (`GameGallery.vue` `@select` → `App.vue` `onGallerySelect` → `setGame`); size/difficulty live in the drawer's staged zone (`GameControlPanel.vue` `new-game-zone`; sections supplied per-game, e.g. `src/games/sudoku/ControlPanel/constants.ts`); the URL params already carry board/size/difficulty (`App.vue` strips them on switch). The fold choreography (BEAT 0 chrome-leave, BEAT 1 board fold, BEAT 2 the deal — `MOTION.chromeLeaveMs`/`boardFoldMs`) is the ritual's ready-made stage.
- Registry question: `ControlSection[]` is currently supplied by per-game ControlPanel components inside the playing scene. Moving staging to the picker requires the registry (`src/games/registry.ts`, `GalleryCard` in `GameGallery/types.ts`) to carry the staging schema — cards already carry `range: {label, levels}` (displayed as a dead caption on `GameCard.vue`!). The dead caption becoming the live control is the family's parsimony jewel: the data's already there.
- Design the card-margin staging: pencilled size/difficulty on the centered card only (flanks stay quiet — the soul gate: one boiling card, `pose 0` flanks + `inert`); the Deal stamp big, in the card's own grammar (`HandDrawnOutline`, washi). How does staging interact with the live center face (the current game's card face IS the live board — `isLive`, Teleport)?
- The mid-game guard (`guardIndex`, the keep/leave ribbon) already gates dirty switches — dealing from the picker must ride the same guard, not grow a second confirm.
- The drawer afterward: the staged zone (`new-game-zone`, `deal-row`, the tab-toggle) deletes from `GameControlPanel.vue`; what remains is live tools only — measure the resulting drawer height at both regimes (does the mobile card stop scrolling?).
- Interrogate the failure mode: does mid-game re-deal ("same game, harder") now cost open-gallery + deal — more taps than today's drawer Deal? Design the shortcut: the wordmark already opens the gallery (`enterGallery`); a re-deal affordance on the board's margin may be needed. This question decides the family.
- Prior art: Solitaire/Balatro deal choreography, tarot-spread UIs, NYT Games' puzzle picker (difficulty chosen per-card at entry), Apple News+ puzzles entry flow.

**What it refuses**: keeping SIZE/DIFFICULTY/Deal in the drawer (the amputation is the defect); redesigning live-tool rendering (Marks/Check rows stay as-is this family); new drawer mechanics or regimes.

**Mark coverage**: 1 — the core (the NEW GAME panel and the carousel become one surface; the picker is the transaction). 5 — by subtraction: the drawer loses its most contrived half and Deal's weight problem dies with its exile (the stamp on the card is huge by construction). 2 — the deal-from-picker rides and extends the existing fold/deal beats; the drawer glide itself is untouched. 3 — mobile gains most: the tall card halves; the picker's swipe grammar is already mobile-native. Mark 4: card staging text is live DOM text (no new bakes); the Deal stamp must be pose-baked if drawn.

---

## FAMILY 5 — THE PROPORTION LEDGER

**Center**: nothing moves, nothing is added — the defect is that every control sits on the SAME rung. Mint an affordance-rank ladder in the token layer: rank 1 verbs at display scale, rank 2 modes at body, rank 3 preferences at caption with eyebrow headings, spacing on a rhythm unit — and re-set every marked surface to the ladder. The extreme-parsimony family: CSS + tokens, near-zero component surgery.

**Substrate**: design-token/config layer (`assets/typography.css` registers, `pencilConfig.ts`, component classes).

**Charter**:
- Audit the current uniformity with numbers: `section-heading` (the √φ eyebrow — `typography.css` `--type-subheading` 1.272rem) heads Size, Difficulty, New game, Marks, Check, and Candidates identically; `OptionSelector` renders all six option rows at the same `1.375rem`/`1.25rem` Fira Code rung; Deal/Clear/Solve/Share/Undo icons all sit at 26–28px. Produce the rank table: which control deserves which rung, argued from use-frequency and consequence (Deal = commit+destructive-adjacent = rank 1; Check = set-once = rank 3).
- Design the ladder as tokens: `--affordance-1..4` mapping to the existing √φ rungs (`--type-title`/`--type-body`/`--type-caption`) + icon-size stops + ink-pressure stops (the `heading-value`'s 68% graphite precedent — `GameControlPanel.vue` — shows pressure is already a hierarchy channel; formalize it). Respect the AA ledger (the crayon-ink derivations documented in the same file).
- Deal at rank 1: the `DiceIcon :size` prop and `.deal-btn` scale to the title rung (~48–56px die + the label in the display register) — pure prop/CSS change. Verify the icon's stroke system survives 2× scale (it's an inline SVG, unaffected by mark 4's raster pinning — confirm no baked pose is involved).
- Check/Candidates at rank 3: demote to one shared caption-tier row (two inline utility selectors under one hairline, or an eyebrow-less compact form) — CSS-first inside `AssistSettings.vue`; the OptionSelector gains a `size` variant rather than a second component.
- The rhythm unit: stanza spacing is currently ad-hoc (`my-3` hr, `gap-2`, `mt-3`, `margin-top: 0.6rem`); set a base unit and multiples so zone breaks (divider) get 2–3 units and intra-stanza gets 1 — the "spatial rhythm off" defect answered by arithmetic.
- Apply the same ladder to the picker (card name > range caption > pips) and mobile (the tab-toggle headings vs values) — one ledger, three surfaces.
- Prior art: modular-scale doctrine (the estate's own √φ ladder file is half-built prior art), Müller-Brockmann's grid arithmetic, Vignelli's few-sizes canon, calligraphic weight ranks (Johnston), ink-pressure hierarchies in hand lettering.

**What it refuses**: moving any control anywhere; new components or objects; new motion (mark 2 is addressed only insofar as proportion makes the existing glide's freight read composed — the family concedes the animation mark and says so); layout-regime changes.

**Mark coverage**: 5 — the core (weight-by-rank, spacing-by-rhythm; Deal big by token, Check quiet by token). 1 — the picker re-set to the same ledger. 3 — mobile re-set (the tall card gets shorter through demotion, not relocation). 2 — weakest; explicitly conceded. Mark 4: zero interaction — no new drawn surfaces at all (its virtue).

---

## ORTHOGONALITY LEDGER

| pair | why they can't merge without a center dying |
|---|---|
| 1×2 | 1 relocates controls; 2 forbids relocation (recomposition in place) |
| 1×3 | 1 dissolves the drawer into strata; 3 makes the drawer the universal home |
| 1×4 | both split the drawer, but staging lands in the playing scene (1) vs the picker (4) — contradictory homes |
| 1×5 | 1 moves things; 5 forbids movement (proportion only) |
| 2×3 | 2 refuses regime/mechanism change; 3 refuses content re-rendering — a merged "objects in a universal sheet" violates both refusal sets |
| 2×4 | 2 keeps staging in the drawer as an object; 4 exiles staging to the picker |
| 2×5 | 2 mints new object forms; 5 forbids new components/objects |
| 3×4 | 3 keeps staging in the (universal) drawer; 4 removes it |
| 3×5 | 3 is mechanism + gesture; 5 forbids motion/layout change |
| 4×5 | 4 relocates; 5 forbids relocation |

## SHARED BINDING CONSTRAINTS (every lane)
- The pencil-notebook soul is non-negotiable; extend the estate's own vocabulary (HandDrawnOutline, washi, scribble underline, the hand + Fraunces registers), never import another.
- Extreme parsimony: prefer deletion; a family wins partly on net-LOC. Library-level question standing: does a fix belong in pencil-boil or `games/shared` rather than per-game?
- Safari/iOS first-class; T4-P1 perf campaign runs in parallel — NO new live-filter surfaces; pose-bake machinery for anything drawn (mark 4's cured pipeline is the only rasterizer).
- One live board invariant (Teleport projection); TypeScript ~6.0.3; the eslint pencil↛games boundary; `errorCheckMode` stays a manual prop+emit (the same-value re-emit is load-bearing).
- PRM paths and the a11y contracts (aria-expanded truth at click, focus reclaim, inert-at-rest, listbox-over-carousel) are inherited obligations, not optional.
