# T4-W9 — The progress border + displayed quality

**"Perhaps an overall progress bar deftly integrated into the border of the board" — and "better game quality with heuristics that are displayed" (owner, M9).** A second pencil pass retraces the board frame, arc-length-proportional to fill, boiling in lockstep with the frame it hugs and advancing only when the player writes a digit. One prop on `HandDrawnGrid`, both games inherit it for free. Zero steady-state raster by construction. And a displayed-quality tally that shows the board's difficulty as the hardest technique it requires — honest, discrete, defensible, never a fabricated tier. The whole wave rests on one honesty spine: **FILL ≠ DIFFICULTY ≠ CORRECTNESS — three signals, three labels, each measuring exactly one thing.**

**Dependencies**: ← W7 (the tally displays W7's `hardestTechnique`; Wave B-1 gates behind W7 R1). Wave A-1 is engine-independent — pure `values` derivation, shippable the moment W6's honesty seam settles. ← W6 (B-0 de-laundered the bucket to "you asked for medium"; W9-B1 supplies the measurement that replaces it). **Effort**: S/M (Fable design).

---

## The frame machinery, at anchors (what the border actually IS)

The board's visible border is **not** `HandDrawnOutline` (that frames the logo, error-note, drawer tab, deal cards — never the board square). **The board border is the closed `frame` path inside `HandDrawnGrid`** — its only CLOSED path (`HandDrawnGrid.vue:150-193`, transition frame `:157-166`; steady-state `:200-241`). This corrects x1's A4 anchor (r3 KILL-LIST #1, confirmed against `HandDrawnGrid.vue:151-159`). The constraints any progress design must honor:

- **One closed ring per pose, clockwise from arc-length 0 at the top-left corner** — `generateGridBoilFrames` emits `BOIL_CONFIG.frameCount` (=4, `pencilConfig.ts:164`) variants of a closed rect (`generateRectBoilFrames`, `gridPaths.ts:300-416`; side order top→right→bottom→left→`Z`, `:317-320`).
- **Steady-state raster is zero** — 4 sibling `boil-frame-layer` `<g>` bound to static `steadyFrames`; the beat toggles which sibling is `opacity:1` (`HandDrawnGrid.vue:256-267`), compositor-only, never a `SourceGraphic` invalidation (`:64-77,199-207`).
- **Completion recolors the whole frame gold** — `.solve-success .grid-line { stroke: var(--color-gold-star) !important }` (`index.css:352-353`). Any progress ink must **hand off** to this, never pre-empt it.
- **PRM freezes the beat** — the library gate force-clears the driver; every derived boil freezes (`boilBeat.ts:36-42`). A progress design must render statically under PRM with no tween.

---

## Part (a) — the progress border

### ROW 1 — the chosen mechanism (x5 A.3)

A dedicated **grain-baked filterless pose layer** mirroring the `HandDrawnOutline` grammar (`HandDrawnOutline.vue:63-78` → `generateRectBoilFrames(..., grain)`), NOT the `HandDrawnGrid` live-filter grammar: `frameCount` grain-**baked** copies of the frame ring (grain folded into geometry, `gridPaths.ts:159-256`), rendered as their own filterless sibling layer, opacity-swapped on the **same** `boilFrame` beat.

- **One prop, both games inherit it.** `HandDrawnGrid` gains `:progress` (number in `[0,1]`, default `0`). Each game computes the number from its own state and passes it down — the frame component owns the *render*, the game owns the *number*. Both mount `HandDrawnGrid` (`SudokuBoard.vue:556`, `FutoshikiBoard.vue:493`) with identical props; **the twin is automatic — there is no second implementation to keep in sync.**
- **The number** (pure `values`/`givenCells` derivation, both already board props — `SudokuBoard.vue:34-35`, `FutoshikiBoard.vue:44-45`):
  ```
  progress = clamp( filledFillable / max(1, totalCells − givens), 0, 1 )
  filledFillable = count of non-given cells whose value ≠ 0
  ```
  A `computed` — re-evaluates only when `values` mutates (a fill/clear), **never on the beat.**
- **The draw** — each baked pose path carries `pathLength="1000"` (normalises arc length across all 4 poses AND every board size), `stroke-dasharray="1000 1000"`, `:style="{ strokeDashoffset: 1000 * (1 - progress) }"` — draws arc-length `0 → progress·perimeter` clockwise from the top-left.
- **Motion** — `transition: stroke-dashoffset 240ms ease` gated behind `@media (prefers-reduced-motion: no-preference)`; the ink *advances* to the new fill-front on fill events only (a cheap paint). Under PRM the transition is absent → the offset snaps; the beat is already frozen (`boilBeat.ts:36-42`) → the layer freezes on pose 0 with the correct static offset. **PRM-safe by construction.**
- **The completion hand-off** — at the win the frame floods gold (`index.css:352`); progress is already 100%, redundant with the gold. Add `.solve-success .progress-trace { opacity: 0 }`: the trace bows out, the gold reward owns the frame. The trace *led the eye to* the gold; it never competes with it.

**Why zero steady-state raster**: the layer is filterless static geometry; the beat toggles opacity only (compositor-only, same as the frame). A fill event changes exactly one CSS custom-value (`strokeDashoffset`) on a plain stroked path — a cheap paint, not a filter-graph re-raster, and not a steady-state event. Baked grain means no live `filter=` to invalidate. The T3-W13 grain-in-geometry discipline reused verbatim (`gridPaths.ts:159-174`).

### ROW 2 — the ink decision (non-blue, contrast-proven) · r3 KILL-LIST #5

x5:55 proposed `--color-crayon-blue` and asserted "blue is unreserved." **It is not:** `--color-focus-sketch: #3A7BC4` (`index.css:177`) is *"keyboard focus ring — crayon-blue darkened one step"* — a focused board would show a blue focus ring co-occurring with a blue progress trace (r3 KILL-LIST #5). **The trace ink is NON-blue.** And the five crayons are each already spoken-for — green=easy, orange=medium, rose=hard/failure, gold=success, blue=focus (`index.css:130-132,143-147,174-177`). "Pick from the palette" therefore resolves to **repurpose graphite by weight, or mint a sixth ink** — decided here with a contrast ledger, not deferred:

| Candidate | Reads as | Trade | Contrast obligation |
|---|---|---|---|
| **Graphite-weight second pass** (no new token) | a darker/heavier pencil retracing the frame — quantity via *pressure*, not hue | zero palette growth; risk = a graphite-over-graphite trace reads as thickening, not a distinct second ink | width ≥ frame's 12? no — *under* it (~8) but a darker graphite tone (`color-mix` toward black); prove the delta is glanceable over `--grid-line-color` both themes |
| **Violet coloured-pencil** (mint `--color-progress-ink`, two-tier light/dark like every crayon) · **RECOMMENDED** | a *different* coloured pencil retracing the frame — the literal x5 fiction, hue-distinct from all five reserved crayons AND the focus ring | one new token pair; must earn AA-adjacent legibility over graphite on cream and on dark paper | light violet over `hsl(0 0% 15%)` on cream; dark violet over `hsl(48 10% 80%)` on dark paper — width ~8, opacity 0.95; contrast ledger recomputed at merged HEAD |

**Recommended: mint a violet `--color-progress-ink`** (two-tier, the doctrine of every crayon, `index.css:143-147` / `:230-234`) — it reads as a distinct second pencil, never collides with focus-blue, difficulty green/orange/rose, gold-success, or rose-failure, and honors the pencil idiom exactly. Graphite-weight is the no-new-token fallback if the owner declines a sixth ink. Either way the contrast ledger is **born RED** — recomputed at merged HEAD over the live paper tokens, never assumed.

### ROW 3 — honesty (A.4): the border is a FILL gauge, not a correctness gauge

The trace counts cells written, **including wrong ones** — honest for this app, which grades correctness only on Solve (`SudokuBoard.vue:185-189`, conflicts gated on `'failed'`). Labelling: the border shows *how full*, never *how right*. The a11y mirror: `role="progressbar"` on a visually-hidden node with `aria-valuenow`/`aria-valuetext` reading **"board 60% filled"** — never "60% correct." This is the same honesty spine as part (b).

---

## Part (b) — displayed quality heuristics

### ROW 4 — the tally meter + margin signature (depends: W7 R1)

x5 designs the DISPLAY over W7's engine output. The margin is PRIMARY (reuse the existing teacher voice — `freshBoardCopy`, `SudokuBoard.vue:437`); the carousel card face is SECONDARY (banked, B-2).

- **Not stars** — the owner killed the "preposterous star" (T3-8b). **Gate-five tally strokes** map to W7's five technique tiers: singles · pairs/pointing · X-wing · swordfish/XY-wing · beyond. Filled tallies = the tier the board's hardest step reached — countable at a glance, discrete (the tiers *are* discrete; no false precision of a percentage), drawn-in with the existing glyph draw-in grammar (`glyphAnimations.ts`), boiling with everything else. On expand/hover, the **name**: *"hardest step: hidden single."*
- **Rationale for tally over a percentage bar**: difficulty here is a *tier*, not a continuum — "73% hard" is a lie the grader can't defend. The tally shows exactly what the engine emits: a tier index, nothing more.
- **The margin signature** — replace the bucket word with the technique signature: *"a fresh 9×9 — singles only"* / *"— needs an X-wing."* Zero new UI surface; the teacher's voice already established.

### ROW 5 — the honesty spine (binding across both parts)

1. **Gate the display on `graded === true`.** If W7's engine hasn't run (a size it can't grade, a restored permalink, a hand-typed board), show **nothing** — a dashed "ungraded" placeholder, never a fabricated tier. (W6-B0 already de-laundered the bucket; W9 keeps the tally honest.)
2. **The tally = the exact `hardestTechnique` W7 emitted**, and the name must be retrievable (expand/hover). No tally without a defensible named step behind it.
3. **REQUEST ≠ MEASUREMENT.** The dropdown "MEDIUM" is what you *asked for*; the tally is what the board *is*. When they disagree (asked medium, grades singles-only), the display shows the *measurement* and the disagreement is itself a signal (a mislabelled bank puzzle). Never launder the requested bucket into a fake measured grade.
4. **Three signals, three labels.** FILL (the border trace, ROW 3) · DIFFICULTY (this tally) · CORRECTNESS (the Solve grade). Each measures one thing and is labelled for exactly that. The tally never implies correctness; the border never implies difficulty.

### Banked (named re-triggers)

- **Wave A-2 (BANK) — corner milestone ticks.** A tick-flourish as each quarter completes, layered on the trace. Re-trigger: owner requests the accent, or A-1 ships and the corners read empty. The continuous trace already satisfies M9.
- **Wave B-2 (BANK) — the carousel-card meter.** The B-1 tally on the game-select card face. Re-trigger: the W12 carousel lands a card surface. The B-1 component renders there unchanged; only the mount point is new.

---

## Gates

Verbatim. Born RED wherever the defect is live at this wave's base SHA.

| Gate | Value |
|---|---|
| Headline | the board border shows fill progress as a non-blue second-pencil trace, both games off one `:progress` prop, zero steady-state raster, PRM-static, handing off to gold at the win; the difficulty tally shows the hardest technique W7 needed, named, gated on `graded===true`; FILL/DIFFICULTY/CORRECTNESS stay three labelled signals |

Component checks:

| Gate | Value | π | DELTA |
|---|---|---|---|
| A-1a border shows fill (**born RED**) | today grep-confirms no board-fill indicator anywhere (`x1:33`, r3 x1:15 empty). After: at values→½-filled the trace covers half the perimeter | capture at ½-fill; measure dashoffset ≈ 500 at `pathLength=1000` | before = graphite frame only; after = frame + half violet trace |
| A-1b zero steady raster (**born RED**) | with the trace mounted at 60% idle 5s, 0 paints attributable to the trace layer (matches the frame's idle profile) | `rafInstrumentation.ts` / paint-flash trace over 5s idle at 60% | before-trace vs after-trace idle paint counts identical |
| A-1c twin is free (**born RED**) | both boards show the same trace with no second implementation | both boards side-by-side at 40% fill, identical trace | the diff adds prop wiring only in `FutoshikiBoard.vue`, zero new render code |
| A-1d PRM + hand-off (**born RED**) | PRM renders the trace static + correct; the win hides the trace, frame goes gold | PRM screenshot (frozen, correct offset) + solve screenshot (trace gone, frame gold) | before = no trace; after = static-under-PRM, gold-only at win |
| ink contrast (**born RED**) | the non-blue trace ink is legible over `--grid-line-color` in both themes AND never co-occurs as blue with the focus ring; contrast ledger recomputed at merged HEAD, not assumed | side-by-side light+dark capture of the trace over the frame; focused-board capture showing distinct trace vs focus ring | before = x5's blue (collides with focus ring); after = violet (or graphite-weight), contrast integers banked |
| B-1a difficulty named (**born RED**) | today no technique exists in the tree (`x3:11`, `x1:33`). After: a singles-only board shows 1 tally + "hidden single"; an X-wing board shows 3 + "X-wing" | singles-only board and X-wing board, tally + name captured | before = opaque bucket word; after = defensible tier + name |
| B-1b every tally has a name (**born RED**) | expand each tally → the technique W7 recorded for this exact board; no tally without a name | expand-state capture per tier | before = a label with no derivation; after = a tier with a trace behind every stroke |
| honesty spine | FILL never implies correctness (aria-valuetext "board N% filled"); an ungraded board shows no tally; REQUEST≠MEASUREMENT preserved | ungraded 16×16 capture (dashed placeholder, no tier) | before = bucket asserted as grade (W6-B0 fixed the copy); after = tally hidden until graded |

## Seeds

- `x/x5-progress-quality.md` — the frame-machinery audit (A.1, HandDrawnGrid not HandDrawnOutline), the three-candidate judgement (A.2), the chosen mechanism + the number + PRM-safety (A.3), the honesty tie (A.4), both themes (A.5), Wave A-1/A-2/B-0/B-1/B-2 with born-RED gates + π/DELTA (A.6, B.6), the tally-over-percentage rationale (B.3), the honesty rules (B.4), the phasing (B.5).
- `r3/r3-expansion-crit.md` §x5 + KILL-LIST #1 (frame = HandDrawnGrid, confirmed) + #5 (blue is reserved — `--color-focus-sketch` is crayon-blue-derived; the trace ink is non-blue).
- `x/x3-hint-heuristics.md` / T4-W7 — the technique engine whose `hardestTechnique` the B-1 tally displays.
- Anchors verified at base SHA: `HandDrawnGrid.vue:150-193,200-241,256-267,64-77`, `gridPaths.ts:159-256,300-416`, `pencilConfig.ts:164`, `boilBeat.ts:36-42`, `index.css:130-132,143-147,174-177,352-353`, `HandDrawnOutline.vue:63-78`, `SudokuBoard.vue:34-35,185-189,437,556`, `FutoshikiBoard.vue:44-45,493`.

## Residual risks

- **The ink decision is the wave's one open owner-facing choice** — the LANE recommends minting a violet `--color-progress-ink` (two-tier, contrast-proven); graphite-weight is the no-new-token fallback. Either is non-blue by construction. The contrast ledger is recomputed at merged HEAD over live paper tokens — a paper token that moved since re-reddens the gate.
- **A-1 ships engine-independent; B-1 waits on W7 R1** — sequence A-1 first (pure `values` derivation, the highest value/effort item across x1/x3/x5), then B-1 after W7's singles detector lands. B-0's honesty copy already shipped in W6; W9 does not re-book it.
- **Zero-steady-state-raster is the load-bearing perf invariant** — if the trace reintroduces a per-beat `SourceGraphic` invalidation (e.g. a live `filter=` slips in instead of baked grain), gate A-1b reddens. The design is filterless baked geometry precisely to avoid this; verify with the rAF instrumentation, don't assume.
- **The tally must never outrun the grader** — if W7 grades a board a tier the engine can't actually name (a defensive gap), B-1b reddens by design. No tally without a retrievable named step; ungraded boards show the dashed placeholder.
- **This is a Fable design wave** — every visual claim carries a golden capture + before/after DELTA banked in evidence; the contrast integers are computed, not asserted.
