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

## SHARED BINDING CONSTRAINTS
- The pencil-notebook soul is non-negotiable; extend the estate's own vocabulary (HandDrawnOutline, washi, scribble underline, the hand + Fraunces registers), never import another.
- Extreme parsimony: prefer deletion; a family wins partly on net-LOC. Library-level question standing: does a fix belong in pencil-boil or `games/shared` rather than per-game?
- Safari/iOS first-class; T4-P1 perf campaign runs in parallel — NO new live-filter surfaces; pose-bake machinery for anything drawn (mark 4's cured pipeline is the only rasterizer).
- One live board invariant (Teleport projection); TypeScript ~6.0.3; the eslint pencil↛games boundary; `errorCheckMode` stays a manual prop+emit (the same-value re-emit is load-bearing).
- PRM paths and the a11y contracts (aria-expanded truth at click, focus reclaim, inert-at-rest, listbox-over-carousel) are inherited obligations, not optional.
