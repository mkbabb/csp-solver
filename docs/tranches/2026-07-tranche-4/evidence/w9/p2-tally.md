# T4-W9 · P2 (B-1) — the displayed-quality tally · evidence

Lane P2 (Part (b), ROWs 4–5 — the difficulty tally + the honesty spine). Base SHA `ae2517c2`.
Battery: `vue-tsc -b` clean on every P2-touched file (the only errors in the tree are the
concurrent T4-W8 wave's dirty `ControlPanel.*`/`AssistSettings.vue` — `errorCheckMode`,
`candidatesPinned`, unused `AssistSettings` — none P2's) · `test:unit` **244/244** · `lint:eslint`
0 · `lint:knip` 0 · `prettier --check` (every P2 file clean) · `vite build` 0. Tier captures against
the **built dist** (`vite preview` :4191); the all-tiers gallery (the tier-3/tier-4 the deal banks
never produce) against the dev server :4192 — the component render is build-invariant (grain-baked
geometry, one CSS-token surface), the discipline P1 used for its DEV-gated rAF probe.

## The mechanism (as shipped)

- **`techniqueVoice.ts` — `describeTally(graded, hardestTechnique, solved)`** (the honesty spine in
  one pure, unit-tested derivation; NOT a second voice — it reuses `formatGradeSignature` for the
  a11y phrase and the same `TECHNIQUE_TIER` the engine grades on). Returns a `TallyDescriptor`:
  `{ graded, filled 0..5, total 5, name, expand, ariaLabel }`. Gate-five tiers: 1 singles · 2
  pairs/pointing · 3 X-wing/inequality-chain · 4 swordfish/XY-wing · 5 beyond. Filled = the tier
  REACHED (cumulative); the name is the EXACT hardest step.
- **`DifficultyTally.vue` (games/shared)** — one game-agnostic component both boards mount. The
  gate-five glyph (four uprights + a binding slash) as `frameCount` grain-BAKED filterless pose
  siblings (`generateLineBoilFrames` + grain-static — the T3-W13 grain-in-geometry discipline),
  opacity-swapped on the SHARED boil beat (`useBeatFrame`). Inked strokes count the tier; ghost
  strokes hold the empty scale. Draw-in via the glyph grammar (`createSequenceSubscription`,
  easeOutCubic, `DRAW_IN_PRESETS.glyph`) driving a reactive stroke-dashoffset reveal across the
  four poses. The exact hardest step is named on hover/focus; always in the `role="img"` aria-label.
- **Composable gate** — both `useSudoku`/`useFutoshiki` gained a `graded` ref (true ONLY after the
  engine ran on a dealt board; false at `clearGrade` — init/clear/restore) and a `gradeTally`
  computed = `describeTally(graded, hardestTechnique, gradeSolved)`. `graded` is a SEPARATE signal
  from `hardestTechnique === null`, which a genuinely hard board (no basic step available first)
  also reads — that board IS graded, just past the ladder.
- **Wiring** — both games pass `:grade-tally`; both boards forward it to `<DifficultyTally>` in the
  `.board-margin`, beside the prose signature ("a fresh 9×9 — needs a naked pair"): the DIFFICULTY
  signal, glyph + prose, one labelled home.

## Born-RED grep (base SHA `ae2517c2` — no difficulty tally exists)

`git show HEAD` → `describeTally`/`TallyDescriptor` count **0** in `techniqueVoice.ts`;
`DifficultyTally.vue` **does not exist**; no `gradeTally`/`DifficultyTally`/`describeTally` token
anywhere in `web/frontend/src`. The opaque bucket word was the only prior difficulty display
(W6-B0 de-laundered it to "you asked for medium"; W7 added the measured signature; W9 adds the glyph).

## The honesty spine (ROW 5, binding) — as satisfied

1. **Display gates on `graded === true`.** An ungraded board (restored permalink, hand-typed,
   unsupported size — the engine never ran) shows the dashed placeholder, never a fabricated tier.
   Captured live: a restored 9×9 permalink AND a restored 16×16 permalink both read
   `is-ungraded` / aria `"difficulty not yet measured — deal a board to grade it"` (`filled 0`).
2. **The tally = the EXACT `hardestTechnique`, named.** `filled = TECHNIQUE_TIER[hardest]`; the
   expand/hover line is `"hardest step: <name>"`, retrievable per tier (captured for every tier).
   A stalled ladder inks the top stroke and names the honest ceiling ("beyond these techniques") —
   never a fabricated tier 4.
3. **REQUEST ≠ MEASUREMENT.** The dropdown is the request; the tally is the measurement. The live
   deal-distribution sweep is the proof (below): EASY/MEDIUM (backtrack buckets) grade almost
   entirely tier-1 singles — the requested bucket does NOT equal the measured tier.
4. **FILL / DIFFICULTY / CORRECTNESS — three labelled signals.** The tally carries a `"difficulty"`
   label and never implies correctness or fill; FILL is P1's border trace (aria "board N% filled"),
   CORRECTNESS the solve verdict. The board-in-context capture shows all three co-existing.

## REQUEST ≠ MEASUREMENT — the deal-distribution sweep (deterministic, `Date.now`-seeded)

The backtrack-defined difficulty buckets do not map to technique tiers — measured across the real
in-browser deal banks (storage cleared per load; one deterministic fresh deal per seed):

| game / request | measured tier histogram (n) |
|---|---|
| sudoku EASY (55) | tier-1 **55** |
| sudoku MEDIUM (55) | tier-1 **54**, beyond **1** |
| sudoku HARD (55) | tier-1 **10**, tier-2 (naked pair) **18**, beyond **27** |
| futoshiki 5/6/7 MEDIUM+HARD (240) | tier-1 **240** |

Findings, all honest and on the record: EASY/MEDIUM sudoku grades singles-only; only HARD reaches
tier-2; **tier-3 (X-wing) and tier-4 (swordfish) never occur** in either bank, and every futoshiki
deal grades singles. The tally shows the MEASUREMENT, so a "HARD" board that grades singles shows 1
stroke — the disagreement is the signal (a mislabelled bank puzzle), exactly ROW 5.3.

## Gate table — born-RED → CLOSED

| Gate | born-RED | measured close | capture |
|---|---|---|---|
| **B-1a** difficulty named | no technique in the tree (`x3:11`); opaque bucket only | singles-only board → **1** stroke + "hardest step: naked single" (aria "singles only (1 of 5)"); naked-pair board → **2** strokes + "needs a naked pair"; X-wing → **3** strokes + "hardest step: X-wing" (aria "needs an X-wing (3 of 5)") | `p2-tier1-sudoku-{tally,board}.png`, `p2-tier2-sudoku-{tally,board}.png`, `p2-tier3-xwing-gallery.png` |
| **B-1b** every tally has a name | a label with no derivation | expand/hover reveals the exact recorded step per tier — naked single, naked pair, X-wing, inequality chain, "beyond these techniques"; no tally without a name | `p2-expand-tier1-sudoku.png`, `p2-expand-tier2-sudoku.png`, `p2-expand-tier3-xwing-gallery.png`, `p2-gallery-all-tiers.png` |
| **honesty spine** | bucket asserted as grade | ungraded (restored permalink) 9×9 AND 16×16 → dashed placeholder, `is-ungraded`, aria "not yet measured", `filled 0`; REQUEST≠MEASUREMENT preserved (sweep above) | `p2-ungraded-9x9-sudoku-{tally,board}.png`, `p2-ungraded-16x16-sudoku-{tally,board}.png` |
| **twin is free** (game-agnostic mount) | — | both games mount the SAME `DifficultyTally` off one `:grade-tally` prop; the Futoshiki diff is prop wiring + the twin `graded`/`gradeTally` only | `p2-tier1-futoshiki-{tally,board}.png` |
| **zero steady-state raster** (standing constraint, instrumented) | — | across all 8 rendered tiers **withFilter = 0** (no live `filter=` attr or computed filter anywhere in the tally subtree); boil is 4 grain-baked pose siblings with exactly **1 `is-active`** at a time (opacity swap = compositor-only). A fill re-inks via one transient draw-in; at rest the reveal is constant → only opacity toggles | measured in `p2-gallery-all-tiers.png` run + every dist capture |

## Cumulative gate-five, read at a glance

1 singles → one upright · 2 pairs/pointing → two uprights · 3 X-wing/chain → three uprights ·
5 beyond → the diagonal binds the four (the classic gate-five completes). Tier-4 (swordfish/XY-wing)
is a labelled rung the ladder cannot yet emit, so a graded board inks 1, 2, 3, or 5 — never a
fabricated 4; the name carries the precise claim, the strokes the magnitude.

## Captures (all < 250 KB)

- `p2-gallery-all-tiers.png` — the real component across every tier + ungraded (the tier-3/4 the
  banks never deal), grain-baked graphite gate-five, dashed placeholder for ungraded
- `p2-tier{1,2}-sudoku-{tally,board}.png` — real dealt boards; board shot shows tally + prose
  signature + P1's border trace co-existing (three signals)
- `p2-beyond-sudoku-{tally,board}.png` — a HARD board past the ladder → all five inked, "beyond these techniques"
- `p2-tier3-xwing-gallery.png` + `p2-expand-tier3-xwing-gallery.png` — 3 strokes + "hardest step: X-wing"
- `p2-expand-tier{1,2}-sudoku.png` — the hover name reveal on real dealt boards
- `p2-ungraded-{9x9,16x16}-sudoku-{tally,board}.png` — restored permalinks → dashed placeholder
- `p2-tier1-futoshiki-{tally,board}.png` — the free twin, same component
