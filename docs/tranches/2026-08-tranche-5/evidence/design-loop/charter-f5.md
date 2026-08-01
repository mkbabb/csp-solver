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

## SHARED BINDING CONSTRAINTS
- The pencil-notebook soul is non-negotiable; extend the estate's own vocabulary (HandDrawnOutline, washi, scribble underline, the hand + Fraunces registers), never import another.
- Extreme parsimony: prefer deletion; a family wins partly on net-LOC. Library-level question standing: does a fix belong in pencil-boil or `games/shared` rather than per-game?
- Safari/iOS first-class; T4-P1 perf campaign runs in parallel — NO new live-filter surfaces; pose-bake machinery for anything drawn (mark 4's cured pipeline is the only rasterizer).
- One live board invariant (Teleport projection); TypeScript ~6.0.3; the eslint pencil↛games boundary; `errorCheckMode` stays a manual prop+emit (the same-value re-emit is load-bearing).
- PRM paths and the a11y contracts (aria-expanded truth at click, focus reclaim, inert-at-rest, listbox-over-carousel) are inherited obligations, not optional.
