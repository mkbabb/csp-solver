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

## SHARED BINDING CONSTRAINTS
- The pencil-notebook soul is non-negotiable; extend the estate's own vocabulary (HandDrawnOutline, washi, scribble underline, the hand + Fraunces registers), never import another.
- Extreme parsimony: prefer deletion; a family wins partly on net-LOC. Library-level question standing: does a fix belong in pencil-boil or `games/shared` rather than per-game?
- Safari/iOS first-class; T4-P1 perf campaign runs in parallel — NO new live-filter surfaces; pose-bake machinery for anything drawn (mark 4's cured pipeline is the only rasterizer).
- One live board invariant (Teleport projection); TypeScript ~6.0.3; the eslint pencil↛games boundary; `errorCheckMode` stays a manual prop+emit (the same-value re-emit is load-bearing).
- PRM paths and the a11y contracts (aria-expanded truth at click, focus reclaim, inert-at-rest, listbox-over-carousel) are inherited obligations, not optional.
