# T4-W9 — consolidated gate table (VERIFY lane)

Adversarial re-run of every gate against the **built dist** (`vite preview` :4189), the merged
working tree (base `7e03c5dc`, committed HEAD `ae2517c2`). Every π measured here by the VERIFY
lane, not trusted from P1/P2. Born-RED confirmed at base (`git grep` for
`progress-trace|progress-ink|--color-progress|progressbar|filledFillable|generateFrameTraceFrames|DifficultyTally|describeTally|gradeTally`
over `src/` at `7e03c5dc` → empty).

## Battery (merged HEAD, working tree)

| Check | Result |
|---|---|
| `vue-tsc -b --force` | **0** (the W8 dirty-ControlPanel tsc errors P2 flagged are resolved) |
| `test:unit` | **244/244** (incl. `describeTally`/`formatTechniqueName` specs) |
| `lint:eslint` | **0** |
| `lint:knip` | **0** |
| `prettier --check src/` | **clean** |
| `build` | **0** (main 188.16 kB / gzip 67.83 kB) |
| golden (darwin, vs dist) | **3/4** — `grid-corner-light` (W9 board frame) ✓, `cell-light` ✓, `toggle-crest-dark` ✓; **`logo-light` FAILS (0.26 diff) — NOT W9, see OUT-2** |
| default e2e (vs dist) | **55/61** — **6 fail, NOT W9, see OUT-1** (layout overflow clips the wordmark at 1280×800) |

## Part (a) — the progress border

| Gate | π (VERIFY-measured, live @ :4189) | Verdict |
|---|---|---|
| **A-1a** border shows fill | 9×9: filled 29/58 non-given (exactly half) → `strokeDashoffset` **500** at `pathLength=1000`, `dasharray "1000 1000"`; aria `board 50% filled`, `aria-valuenow=50`. Init 0% → offset 1000, `board 0% filled`. 4 pose siblings. | **PASS** |
| **A-1b** zero steady raster | Trace `filter: none`, no `filter=` attr on pose `<g>` or `.progress-trace`. Over 5 s idle at 50%: the 4 pose `d`-strings **byte-identical** t0↔t5 (no geometry recompute), `strokeDashoffset` **constant**, `anyFilter=false`. The beat rotates the 4 poses (samples `[1,3,0,2,3,1,3,0,2,0,1,3]`, distinct=4) — a compositor opacity-swap only, no filter re-raster, no `d` mutation. A fill mutates the one `strokeDashoffset` custom value (a `computed` over `values`, not the beat). | **PASS** |
| **A-1c** twin is free | Futoshiki 5×5: filled 5/10 (half) → `strokeDashoffset` **500**, `pathLength=1000`, `dasharray "1000 1000"`, stroke `rgb(139,92,246)` (identical violet), `filter: none`, 4 poses, aria `board 50% filled` — behaviourally identical to Sudoku. Diff in `FutoshikiBoard.vue` = the `fillProgress` computed (twin of Sudoku's, verbatim) + `:progress` wiring; same `HandDrawnGrid`, zero new render code. | **PASS** |
| **A-1d** PRM + hand-off | PRM (`reducedMotion:'reduce'`): trace `transition-duration` **0s**, `transition-property all` (the no-preference gate correctly withholds the tween), offset snaps to **500** (correct static), beat frozen (`is-active` `[0×10]`, distinct=1). Gold hand-off (real Solve): `.solve-success` present, `.progress-trace` computed `opacity` **0** (bows out), aria `board 100% filled` — the gold owns the frame. | **PASS** |
| **ink contrast** | Recomputed WCAG (relative-luminance) over the browser-resolved live tokens, opaque / composited @0.95, both themes: **light** `#8b5cf6` (resolved `rgb(139,92,246)`, hue **258**) vs `--grid-line-color` **3.57 / 3.36**, vs `--color-card` **4.16 / 3.85**; **dark** `#7c3aed` (resolved `rgb(124,58,237)`, hue **262**) vs grid-line **3.65 / 3.46**, vs card **3.28 / 3.07**. All 8 figures ≥3:1. Non-blue: ink 258°/262° vs `--color-focus-sketch` `#3a7bc4` hue **212** (46–50° apart) — a focused board can't show two blues (focus token blue, ink violet; verified distinct). Filterless in both themes. | **PASS** |

## Part (b) — displayed quality

| Gate | π (VERIFY-measured, live @ :4189) | Verdict |
|---|---|---|
| **B-1a** difficulty named | Dealt boards grade to a named tier live: `inked=1` + expand `hardest step: naked single`, aria `difficulty — singles only (1 of 5)` (1 inked + 4 ghost = the 5-scale). `TECHNIQUE_TIER` maps singles→1, pairs/pointing/box-line/inequality-forcing→2, X-wing/inequality-chain→3 (`techniqueEngine.ts:120`). X-wing→3 (+name) proven by unit test — the generators never deal an X-wing board (OUT-4). | **PASS** |
| **B-1b** every tally has a name | Every graded tally carries its exact `hardestTechnique` name (expand + always the aria-label); a stalled ladder inks 5 and names the honest ceiling `beyond these techniques (5 of 5)` — never a fabricated tier 4. `role=img`. | **PASS** |
| **honesty spine** | FILL is `role=progressbar`, aria-valuetext **`board N% filled`** at 0/50/100% — never "correct" (FILL counts wrong `1`-spam; the app grades correctness only on Solve). Ungraded (Clear) → `is-ungraded`, **5 dashed placeholder** strokes (`stroke-dasharray "2.5px,3.5px"`), aria **`difficulty not yet measured — deal a board to grade it`**, `filled=0` — no fabricated tier. REQUEST≠MEASUREMENT shown both ways: requested **Hard** measured **naked single** (tier 1), and requested Hard measured **beyond** — the display shows the measurement. Three labelled signals held: FILL (progressbar) · DIFFICULTY (`role=img` tally) · CORRECTNESS (`.solve-success`). | **PASS** |

## Attribution of the two non-W9 failures

Both failures were proven **not attributable to W9** and reproduced/isolated independent of it.

- **OUT-1 — 6 e2e fail (W8 layout overflow, NOT W9).** At 1280×**800** the working tree's
  `board-group` is **1055 px** (clean HEAD: 759 px), overflowing its vertically-centred parent
  (`main-content`, `justify/align:center`) and clipping `button.logo-trigger` to **y=-127** (clean
  HEAD: y=+20). Every failing spec (drawer, futoshiki ×4, permalink) switches games via the
  wordmark, which is off-viewport. The growth is entirely `control-panel-wrap` **455→896 px**
  (`control-panel-filtered` unchanged at 323 px) — W8's new panel surface `Marks/Check/Candidates/Fill`
  (`useAssists`/`AssistSettings.vue`/`PencilModeToggle.vue`, the new W8 files). W9's `.difficulty-tally`
  is a **24 px** board-margin element on the shorter board column, which never sets the row height.
  Proof: clean-HEAD worktree (`ae2517c2`) dist passes `futoshiki.spec.ts` 4/4; the wordmark is
  visible (y=48) at a 1150 px-tall viewport. **Team-lead:** W8 owns this — the panel must fit or the
  layout must not overflow at 800 px. W8 is concurrently editing (likely mid-flight).

- **OUT-2 — `logo-light` darwin golden move (NOT W9).** 0.26 pixel-ratio diff on the logo wordmark.
  W9 touches nothing logo: `HandwrittenLogo.vue` is absent from the working-tree diff and no logo
  CSS token changed (`index.css` working delta = the 28 W9 lines only). The WM logo recut re-minted
  only the **linux** golden (`098de1c9`, `3b587b86`); the darwin baseline is stale and renders
  identically at committed HEAD. **Flagged, NOT re-baselined** — needs a reviewed
  `test:golden:update` on darwin.

## Team-lead outstanding

1. **OUT-1** — W8 desktop layout overflow at 1280×800 clips the wordmark, reds 6 e2e specs. Not W9.
2. **OUT-2** — darwin `logo-light` golden stale (WM re-minted linux only). Not W9. Flag, don't re-baseline.
3. **Ink ratification (owner-facing)** — P1 minted the spec's RECOMMENDED violet `--color-progress-ink`
   (contrast ledger above, all ≥3:1). The graphite-weight no-new-token fallback stays available. The
   wave's one open owner choice.
4. **Tier-3/4 never dealt** — the generators produce no X-wing/swordfish board (P2 sweep). The tier-3
   render is unit-test-proven (`describeTally` X-wing→3+name); no product code fabricates a tier. A
   real REQUEST≠MEASUREMENT reality, not a defect.
5. **Not committed** — the team lead commits; W9 is surgical over the concurrent W8 tree, battery green.
