# Lane x5 — the progress border + displayed quality heuristics (DESIGN)

Tranche-IV formulation. Fable + the frontend-design skill (invoked). NO source edits — audit of the frame machinery + a wave-shaped design spec with RED gates and π/DELTA obligations.

Answers, verbatim, two clauses of owner row **M9**:
- **(a)** *"perhaps an overall progress bar deftly integrated into the border of the board"*
- **(b)** *"better game quality with heuristics that are displayed."*

Feeds: **x1** (market assay — border-progress = A4, difficulty display = A6) and **x3** (hint/technique engine — part b consumes its grade output). Both read and reconciled below; one correction to x1's anchor folded.

Razor: KISS. Design law: the pencil idiom. Architecture bar: game-agnostic. Steady-state cost bar: **zero raster** (the baked-pose grammar — progress changes only on entry events).

---

## Part (a) — THE PROGRESS BORDER

### A.1 The frame machinery, at anchors (what the border actually IS)

The board's visible border is **not** `HandDrawnOutline`. That component frames the logo, the error-note card, the drawer tab, and the deal cards (`HandwrittenLogo.vue:203`, `SolverErrorNote.vue:38`, `DrawerTab.vue:38`, `SudokuGame.vue:150/193`) — never the board square. **The board border is the closed `frame` path inside `HandDrawnGrid`.** This corrects x1's A4 ("draw as a boil-ink border fill on `HandDrawnOutline`", `x1-market-assay.md:72,95`) — the correct host is `HandDrawnGrid`.

The frame's exact grammar (the constraints any progress design must honor):

- **One closed ring per pose.** `generateGridBoilFrames` (`gridPaths.ts:456-579`) emits `BOIL_CONFIG.frameCount` (=4, `pencilConfig.ts:164`) variants of a single closed rect path (`generateRectBoilFrames`, `gridPaths.ts:300-416`) — top edge L→R, right T→B, bottom R→L, left B→T, `Z` (`gridPaths.ts:317-320`). Arc-length is walkable start-to-finish; **arc-length 0 sits at the top-left corner, and the ring runs clockwise.**
- **Rendered as static filterless-of-motion siblings, opacity-swapped on the shared beat.** At steady state (`animState === 'drawn'`) the transition `<g>` unmounts and 4 sibling `<g class="boil-frame-layer">` render, each bound to the *static* `steadyFrames` geometry (`HandDrawnGrid.vue:200-241`); the beat (`boilFrame`, `useBeatFrame` on the app-wide beat, `HandDrawnGrid.vue:45-48` → `boilBeat.ts:63`) only toggles which sibling is `opacity:1` (`:256-267`). **Steady-state raster is zero** — the opacity toggle is compositor-only, never a `SourceGraphic` invalidation (`HandDrawnGrid.vue:64-77,199-207`).
- **Theme-driven stroke.** `stroke="var(--grid-line-color, currentColor)"` (`HandDrawnGrid.vue:161,213`) — light `hsl(0 0% 15%)`, dark `hsl(48 10% 80%)` (`index.css:197,249`). Stroke-width 12 in the 1000×1000 viewBox (`:215`), opacity 0.95.
- **Completion recolors the whole frame gold.** `.solve-success .grid-line { stroke: var(--color-gold-star) !important }` (`index.css:352-353`) — the frame floods gold at the win. Any progress ink must **hand off** to this, never pre-empt it.
- **PRM freezes the beat in place.** The central library gate force-clears the driver; the beat stops and every derived boil freezes (`boilBeat.ts:36-42`, doc `:13-19`). A progress design must render statically under PRM with no tween.

### A.2 The candidates, judged

The owner named three. Judged against the four bars (glanceable · never fights the boil · zero steady-state raster · has a futoshiki twin):

| Candidate | Verdict | Why |
|---|---|---|
| **Frame graphite darkens/thickens along the perimeter ∝ fill** | **Reject as primary** | A stroke that gets darker toward the fill-front reads as *lighting*, not *quantity* — you can't judge "how far" from a gradient at a glance. SVG can't cheaply gradient-stroke a hand-drawn polyline along arc length; it needs a per-pose gradient bake, which fights the grain and re-rasters. Fails glanceable + zero-cost. |
| **A second ink traces over the boil frame arc-length-proportionally** | **CHOSEN** | Reads instantly (how far the second pencil pass has travelled = progress); costs zero steady-state raster (dash offset changes only on fill events); is the pencil grammar exactly (a coloured-pencil second pass retracing the frame); theme-trivial; game-agnostic by construction. |
| **Corner ticks accrue** | **Bank as an optional accent** | Only 4 states — too coarse to read as a *bar*. Good as a milestone flourish (a tick-flourish as each quarter completes) layered *on top of* the trace, but not the continuous read. BANK behind an owner-taste trigger. |

### A.3 The chosen mechanism — spec

**A second pencil pass that retraces the board frame, arc-length-proportional to fill.** It boils in lockstep with the frame it hugs, and it advances only when the player writes a digit.

**Where it lives — one prop on `HandDrawnGrid`, both games inherit it for free.** `HandDrawnGrid` gains `:progress` (a number in `[0,1]`, default `0`). Each game computes the number from its own state and passes it down. Game-agnostic by construction: the frame component owns the *render*, the game owns the *number*. Sudoku and futoshiki both mount `HandDrawnGrid` (`SudokuBoard.vue:556`, `FutoshikiBoard.vue:493`) with identical props — **the twin is automatic; there is no second implementation to keep in sync.**

**The number.**
```
progress = clamp( filledFillable / max(1, totalCells − givens), 0, 1 )
filledFillable = count of non-given cells whose value ≠ 0
```
Derived purely over `values` + `givenCells` (both already board props — `SudokuBoard.vue:34-35`, `FutoshikiBoard.vue:44-45`). A `computed`; re-evaluates only when `values` mutates (a fill/clear), **never on the beat.**

**The render — a dedicated grain-baked pose layer, filterless.** Mirror the `HandDrawnOutline` grammar (`HandDrawnOutline.vue:63-78` → `generateRectBoilFrames(..., grain)`), not the `HandDrawnGrid` live-filter grammar: generate `frameCount` grain-**baked** copies of the frame ring (grain folded into geometry, `gridPaths.ts:159-256`) and render them as their own filterless sibling layer, opacity-swapped on the **same** `boilFrame` beat. Each pose path carries:
- `pathLength="1000"` — normalises arc length to a fixed scale, so a single dash formula works identically across all 4 boiling poses **and** every board size.
- `stroke-dasharray="1000 1000"`, `:style="{ strokeDashoffset: 1000 * (1 - progress) }"` — draws arc-length `0 → progress·perimeter` from the top-left corner, clockwise.
- Stroke: `var(--color-crayon-blue)` (`index.css:146` light `#4A90D9`, `:233` dark `#6AABEB`), width ~8 (under the frame's 12 — reads as a coloured-pencil pass hugging the graphite, not replacing it). Blue is unreserved: gold=success, rose=failure, green/orange=the difficulty buckets (`index.css:130-132`) — blue reads honestly as "in progress, not yet rewarded."

**Why this is zero steady-state raster.** The layer is filterless static geometry; the beat toggles opacity only (compositor-only, same as the frame — `HandDrawnGrid.vue:256-267`). A fill event changes exactly one CSS custom-value (`strokeDashoffset`) on a plain stroked path — a cheap paint, **not** a filter-graph re-raster, and not a steady-state event. Baked grain means no live `filter=` to invalidate. This is the T3-W13 grain-in-geometry discipline reused verbatim (`gridPaths.ts:159-174`).

**The completion hand-off.** At the win the frame floods gold (`index.css:352`). Progress is already 100% (full ring) — redundant with the gold. Add `.solve-success .progress-trace { opacity: 0 }`: the blue trace bows out, the gold reward owns the frame. The trace *led the eye to* the gold; it never competes with it.

**Motion.** `transition: stroke-dashoffset 240ms ease` gated behind `@media (prefers-reduced-motion: no-preference)` — the ink *advances* to the new fill-front (fires on fill events only, cheap). Under PRM the transition is absent → the dashoffset snaps instantly; the beat is already frozen (`boilBeat.ts:36-42`), so the layer freezes on pose 0 with the correct static offset. **PRM-safe by construction — no code path animates under PRM.**

### A.4 Honesty (this ties part a to part b)

The border is a **fill gauge, not a correctness gauge.** It counts cells written, including wrong ones — which is honest for this app: it grades correctness only on Solve (`SudokuBoard.vue:185-189`, conflicts gated on `'failed'`). Labelling: the border shows *how full the board is*, never *how right*. The a11y mirror: an `aria-valuenow`/`aria-valuetext` on a visually-hidden `role="progressbar"` reading "board 60% filled" (never "60% correct"). This distinction is the same honesty spine as part (b) — three signals (fill / difficulty / correctness) kept separate and each labelled for exactly what it measures.

### A.5 Both themes · PRM (the design-completeness bar)

- **Light:** blue `#4A90D9` over graphite `hsl(0 0% 15%)` on cream — the trace reads as coloured pencil over lead. Contrast sufficient at width 8, opacity 0.95.
- **Dark:** blue `#6AABEB` over `hsl(48 10% 80%)` on dark paper — the moon-lit twin; the dark blue token is already tuned brighter (`index.css:233`).
- **PRM:** static, frozen pose 0, instant offset — covered in A.3.

### A.6 Waves (a), RED gates, π/DELTA

**Wave A-1 — the border progress trace (sudoku + futoshiki, one prop).**
- Deliverable: `HandDrawnGrid` `:progress` prop + the grain-baked filterless trace layer; both games compute + pass `progress`; `role="progressbar"` a11y mirror; completion hand-off; PRM-static; both themes.
- **Gate A-1a (born RED):** *"the board border shows fill progress."* Fails today — grep-confirmed no board-fill indicator anywhere (`x1-market-assay.md:33`). **π:** capture the board at values→½-filled; the blue trace covers half the perimeter (dashoffset≈500 at `pathLength=1000`), measured. **DELTA:** before = graphite frame only; after = frame + half-blue trace.
- **Gate A-1b (born RED):** *"steady-state raster stays zero with the trace mounted."* **π:** a paint-flash / rAF-instrumentation trace (the repo ships `rafInstrumentation.ts`) over 5s idle at 60% progress — 0 paints attributable to the trace layer (matches the frame's own idle profile). **DELTA:** before-trace vs after-trace idle paint counts identical.
- **Gate A-1c (born RED):** *"the twin is free — futoshiki shows the same trace with no second implementation."* **π:** both boards side-by-side at 40% fill, identical trace. **DELTA:** the diff adds the prop wiring only in `FutoshikiBoard.vue`, zero new render code.
- **Gate A-1d (born RED):** *"PRM renders the trace static + correct; completion hands off to gold."* **π:** PRM screenshot (frozen, correct offset) + a solve screenshot (blue gone, frame gold). **DELTA:** before = no trace; after = static trace under PRM, gold-only at win.

**Disposition:** **FOLD** — owner-named (M9), pure `values` derivation, one prop, both themes, zero steady-state cost. Highest value/effort in this lane. `family_hint: market-gap-progress-border`.

**Wave A-2 (BANK) — corner milestone ticks.** A tick-flourish as each quarter completes, layered on the trace. **BANK — re-trigger:** owner requests the accent, or A-1 ships and the corners read empty. Not on the critical path (the continuous trace already satisfies M9).

---

## Part (b) — DISPLAYED QUALITY HEURISTICS

### B.1 The dependency (read x3 first)

x3 (`x3-hint-heuristics.md`) establishes the substrate: **we have no technique heuristics today** — "difficulty" is a static bucket the user picks, graded once at bake time by machine **backtrack count**, and **only for N=3** (`generate.rs:157-159` early-returns ungraded for 4×4/16×16; `x3:33-36`). x3 designs the *engine* (a TS technique engine over the candidate masks `propagateBoard` already returns; R1-R3 grade by *hardest technique required* — the accepted metric, `x3:64-99`). **This lane designs the DISPLAY contract** over that engine's output. The two are complementary: x3 makes the grade *defensible*; x5 makes it *visible + honest*.

### B.2 Where it lives — judged

| Home | Verdict | Why |
|---|---|---|
| The difficulty **selector** (`OptionSelector`, EASY/MEDIUM/HARD) | **Keep as the REQUEST — do not overload** | The dropdown is what you *ask for*, not what the board *is*. Conflating request with measurement is the honesty bug (B.4). |
| The board **margin** (`MarginNote`) | **PRIMARY — reuse the existing voice** | The margin already speaks the dealt board — *"a fresh 9×9, medium"* (`SudokuBoard.vue:437`, `freshBoardCopy`). Replace the bucket word with the technique signature: *"a fresh 9×9 — singles only"* / *"a fresh 9×9 — needs an X-wing."* Zero new UI surface, in the teacher's voice already established. |
| The **carousel / deal card** (M9 Wii-shop select — a sibling lane's surface) | **SECONDARY — the glanceable meter home** | When browsing games/deals, a small hand-drawn technique meter on the card face gives the grade at a glance. Design the meter here; it renders wherever a card face exists. |

Primary = the margin voice (KISS: one line of copy, existing surface). Secondary = the tally meter on the card (glanceable browse).

### B.3 The pencil grammar — the tally meter

**Not stars** — the owner killed the "preposterous star" (T3-8b, `owner-prompts.md:22`). The pencil-native, honest form:

**Gate-five tally strokes (`𝍩𝍪𝍫𝍬 ̸`).** Five tally positions map to the five technique tiers (x3's ladder, `x3:66-75`):
1. singles (naked/hidden) · 2. pairs/pointing · 3. X-wing · 4. swordfish/XY-wing · 5. beyond.
Filled tallies = the tier the board's hardest step reached. Countable at a glance, discrete (honest — the tiers *are* discrete, no false precision of a percentage), drawn-in with the existing glyph draw-in grammar (`glyphAnimations.ts`), boils with everything else. Beneath/aside, on expand or hover, the **name**: *"hardest step: hidden single."* Alternative form if tallies read too austere on a card: a short boiling pencil "ruler" — a hand-drawn underline with N ticks filled to the tier — same semantics.

**Rationale for tally over a percentage bar:** difficulty here is a *tier*, not a continuum. A percentage would imply precision the grader can't defend ("this puzzle is 73% hard" is a lie). Tallies show exactly what the engine emits — a tier index — and nothing more.

### B.4 Honesty rules (binding — "never show a number the grader cannot defend")

1. **Gate the display on `graded === true`.** If the engine hasn't run (a size it can't grade yet, a restored permalink, a hand-typed board), show **nothing** — a dashed "ungraded" placeholder, never a fabricated tier. This directly retires x3's N=3-only-backtracks defect at the *display* layer: the UI refuses to present an ungraded board as graded (`x3:33-36`).
2. **The tally = the exact `hardestTechnique` the engine emitted**, and the technique **name** must be retrievable (expand/hover). Every filled tally maps to a named step the engine actually applied to *this* board. No tally without a defensible name behind it.
3. **Distinguish REQUEST from MEASUREMENT.** The dropdown "MEDIUM" is what you asked for; the tally is what the board IS. When they disagree (asked medium, grades singles-only), the display shows the *measurement* and the disagreement is itself a signal — a latent quality defect (the bank mislabelled the puzzle). Never launder the requested bucket into a fake measured grade.
4. **Three signals, three labels (shared spine with part a).** Fill (the border trace, A.4) · difficulty (this tally) · correctness (the Solve grade). Each measures one thing and is labelled for exactly that. The tally never implies correctness; the border never implies difficulty.

### B.5 Phasing — honest at every rung (each independently shippable)

The display is gated behind x3's engine, but honesty *improves at phase 0* regardless:

- **Phase 0 (no engine dependency, ship immediately):** stop presenting the bucket label as a *measured* grade. The margin says the honest thing — *"you asked for medium"* — and the tally is hidden (ungraded). This alone retires the "opaque bucket masquerading as a grade" defect (`x1-market-assay.md:47`, `x3:35`).
- **Phase 1 (x3 R1 lands — singles):** the engine grades singles-tier boards; tally shows 1-2 with defensible names; margin reads *"singles only."*
- **Phase 2 (x3 R3 lands — X-wing):** full 1-5 tally, technique name on expand, margin reads the signature. This is M9's "heuristics that are displayed," done honestly.

### B.6 Waves (b), RED gates, π/DELTA

**Wave B-0 — de-launder the bucket (no engine dep).**
- Deliverable: margin copy distinguishes request from measurement; tally slot renders "ungraded" until a grade exists.
- **Gate B-0 (born RED):** *"the UI never presents an ungraded board as graded."* Fails today — the fresh-board copy states the bucket as fact (`SudokuBoard.vue:437`, "a fresh 9×9, medium"). **π:** a 16×16 board (never graded, `generate.rs:157-159`) shows "ungraded," not a tier. **DELTA:** before = "medium" asserted; after = "you asked for medium," tally empty.
- **Disposition:** **FOLD** — honesty fix, zero engine dependency.

**Wave B-1 — the tally meter + margin signature (depends: x3 R1).**
- Deliverable: the gate-five tally component (card + margin); technique name on expand; grade-on-deal wiring to x3's engine output.
- **Gate B-1a (born RED):** *"the board's difficulty is shown as the hardest technique it requires, named."* Fails today — no technique exists anywhere in the tree (`x3:11`, `x1:33`). **π:** a singles-only board shows 1 tally + "hidden single"; an X-wing board shows 3 + "X-wing." **DELTA:** before = opaque bucket word; after = defensible tier + name.
- **Gate B-1b (born RED):** *"every filled tally maps to a named step the engine applied."* **π:** expand each tally → the technique the engine recorded for this exact board; no tally without a name. **DELTA:** before = a label with no derivation; after = a tier with a trace behind every stroke.
- **Disposition:** **FOLD (own wave, gated behind x3 R1)** — this is the "heuristics that are displayed" the owner named. `family_hint: market-gap-technique-layer` (shared with x3).

**Wave B-2 (BANK) — the carousel-card meter.** The tally on the game-select carousel card face. **BANK — re-trigger:** the carousel lane (M9 Wii-shop) lands a card surface. The component from B-1 renders there unchanged; only the mount point is new.

---

## Cross-lane notes for the tranche author

- **Fold the x1 anchor correction:** A4's "`HandDrawnOutline`" is wrong; the board border is `HandDrawnGrid`'s `frame` path. The clean architecture is a `:progress` prop on `HandDrawnGrid` (both games inherit) — not a per-game reimplementation.
- **Part (a) is engine-independent** — pure `values` derivation, shippable now; the highest value/effort item across x1/x3/x5.
- **Part (b) B-0 is engine-independent** (honesty fix); **B-1 gates behind x3's R1** technique engine. Sequence: A-1 ∥ B-0 first, then B-1 after x3 R1.
- **No wasm/Rust/release/vendored-sync touch** for A-1, B-0 (frontend-only). B-1 consumes x3's TS engine (also frontend-only per `x3:122`). No `csp-solver` bump, no `npx-packument-OOM`/deploy trap in scope until a later rung.
- **All four owner bars met:** KISS (one prop / one line of copy / one tally component), pencil idiom (second-pencil-pass trace; gate-five tally), game-agnostic (the frame component owns render, games own the number), zero steady-state raster (grain-baked filterless pose layer, opacity-only beat, dash-offset on fill events).

## Evidence index (every OUR-code claim anchored)
- Board border = `HandDrawnGrid` frame, NOT `HandDrawnOutline`: `HandDrawnGrid.vue:150-193` (transition frame `:157-166`), `:200-241` (steady frame `:210-217`); `HandDrawnOutline` frames logo/cards/tab only — `HandwrittenLogo.vue:203`, `SolverErrorNote.vue:38`, `DrawerTab.vue:38`, `SudokuGame.vue:150/193`.
- Closed ring, clockwise from top-left, 4 poses: `gridPaths.ts:300-416` (`:317-320` side order), `pencilConfig.ts:164` (`frameCount:4`).
- Opacity-swap on shared beat, zero steady-state raster: `HandDrawnGrid.vue:45-48,64-77,199-207,256-267`; `boilBeat.ts:63-77`.
- Theme stroke tokens: `index.css:197,249` (`--grid-line-color`), `:146,233` (`--color-crayon-blue`), `:130-132` (difficulty buckets reserve green/orange/rose), `:352-353` (solve-success gold recolor).
- Grain-in-geometry bake grammar (reuse target): `gridPaths.ts:159-256`; `HandDrawnOutline.vue:63-78`.
- PRM freezes the beat: `boilBeat.ts:36-42`, doc `:13-19`.
- Progress source props on both boards: `SudokuBoard.vue:34-35,556`; `FutoshikiBoard.vue:44-45,493`.
- Margin voice / fresh-board copy (the difficulty-display home): `SudokuBoard.vue:437`; conflict grading gated on `'failed'`: `:185-189`.
- No board-fill indicator, no technique names today: `x1-market-assay.md:33`; `x3-hint-heuristics.md:11`.
- Difficulty = backtracks at bake, N=3-only: `generate.rs:157-159` (via `x3:33-36`).

## Market citations (every market claim cited)
- Border/in-puzzle progress is a market norm; M9 wants it border-integrated: [sudoku.com daily challenges](https://sudoku.com/challenges/daily-sudoku) (via `x1-market-assay.md:49`).
- Transparent, technique-based difficulty is best-in-class: [sudoku.coach difficulty](https://sudoku.coach/en/learn/sudoku-difficulty), [sudoku.coach solver](https://sudoku.coach/en/solver) (via `x1:47`, `x3:75`).
- Difficulty by hardest-technique-required, not clue/backtrack count: [arXiv 1403.7373](https://arxiv.org/pdf/1403.7373) (via `x3:36,75`).
- Technique-graded step hints name the technique: [sudojo](https://sudojo.com/en/), [St. Olaf Sudoku Assistant](https://www.stolaf.edu/people/hansonr/sudoku/explain.htm); futoshiki analogue [tomwhite/futoshiki-hints](https://github.com/tomwhite/futoshiki-hints) (via `x1:41`, `x3:89`).

## Family hints
- `market-gap-progress-border` — owner-named board-fill affordance absent; attaches to `HandDrawnGrid`, not `HandDrawnOutline` (x1 anchor corrected).
- `market-gap-technique-layer` — the displayed grade has no defensible substrate until x3's technique engine exists; the DISPLAY must gate on `graded===true` and refuse to launder the requested bucket into a measurement (shared with x3, x1).
