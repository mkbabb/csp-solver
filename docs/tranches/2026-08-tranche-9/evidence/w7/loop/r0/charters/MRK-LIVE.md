# PASS-1 CHARTER · MRK-LIVE · The living mark

Section: §5 the wobble law · §6 focus rings
Lane port: 127.0.0.1:4238
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-LIVE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The library's law is right and the census's stated cause is wrong. `maxDisplace =
roughness × len × 0.015` is a real hand: a short mark wanders less because a short stroke
wanders less, so the ring's σ of 0.092px is CORRECT for a 111-unit edge. What the ring
lacks is not amplitude but LIFE: the grid breathes at four poses / 150 ms and the ring is
one frozen path. The house law becomes: wobble is PROPORTIONAL; LIVENESS is the state
axis. A mark that is alive is a mark the reader is touching. STILL: every resting mark.
LIVING: the focused cell's ring, the armed destructive verb's box, the boiling grid.

The ring becomes a four-pose stack on the ACTIVE cell only — one stack, four paths,
mounting and unmounting with selection, riding the shared beat (`BOIL_CONFIG` 4 frames /
150 ms; never a second cadence), poses from `boilRectFrames` / `perturbPointsClosed` with
grain baked as `generateFrameTraceFrames` does it: zero filters. The peer wash becomes a
filled path on the same seed (no stroke). Off the board there is ONE drawn ring idiom
estate-wide — the house ghost drawn as an SVG ring on whatever has focus (a
`FocusRing.vue` singleton positioned by the focused element's rect on `focusin`, or a
per-control ring; test which survives Teleport and the sliding sheet) — replacing six
bespoke rects and the UA default; recognisable not by its colour but because it is the
only thing moving under the reader's hand. The two rings under 3:1 (`.logo-trigger`, the
deck card) take the house ring at the ramp's rule pressure; the deck ring's 3.6px
headroom binds the outset; forced-colors keeps its real outline. One mark for every
pointer: the false modality comment at `gameCell.css:243` is deleted.

Amplitude stays proportional by default; a modest rebase is a secondary knob the centre
may not depend on. The family carries a first-class question it must answer with a
measurement: does the ring STOP breathing after N beats (a selection is user-triggered;
the breathing after it is not).

## Substrate on this tree (verify first, cite file:line)

- `gridPaths.ts:42-70` `generateCellRects` (`wobbleRect(roughness 0.4, segments 4, jagged)`, seeded `42 + 500 + pos*7`); `:421-527` `generateGridBoilFrames` and the exported `perturbPointsClosed` / `boilRectFrames` grammar; `:338-370` `generateFrameTraceFrames` (grain baked in).
- `DigitCell.vue:410-423` the ghost (one static path, resident on every cell); `:261-265` the peer wash div; `GameBoard.vue:156` `cellRects`.
- `HandDrawnGrid.vue:405-446` the grid's pose stack and the beat subscription (`boilFrame`); `pencilConfig.ts:268-282` BOIL_CONFIG.
- `gameCell.css:243-257` tier 2 and the false modality comment; `:229-241` the peer cursor ring's decided ranking (lighter on every axis; a RING, never a wash); `:348-356` forced-colors.
- The six bespoke rects: `DarkModeToggle.vue:740` (offset 54px = the ornament edge, W2 §2.4), `HandwrittenLogo.vue:544`, `DrawerTab.vue:151`, `GameCard.vue:436`, `StagingBand.vue:431`, `GameGallery.vue:1450`; `index.css:445`'s `outline-ring/50` (colour only; chromium supplies the geometry).
- `e2e/spoken-gallery.spec.ts:200-262` (one ring owner, WHOLE); the Teleport projection of the one live board and the dock sheet's 700 ms slide (a floating ring's two lag sources).

## What the family must answer

1. LIVENESS — the stack on the active cell: R3-a's law re-based to proportional (say what the new row asserts); a born-RED σ-over-TIME row (zero at HEAD) that greens; σ over SPACE stays ~0.092.
2. BUDGET — 9/9/9 with the ghost's own filter `none` at 4×4 / 9×9 / 16×16; DOM +3 paths, never +N²; `FILTER_BUDGET_UNION_AREA` unmoved.
3. COST — a frame trace at 393×699 dpr3 during arrow-key traversal at 16×16 (a stack mounted and unmounted per keypress): frames >33 ms before/after; if it costs a long frame the family adjusts (pre-mount? one stack re-seeded?) or dies.
4. AMBIENT MOTION — the "stops breathing after N beats" arm measured: what N, what the ring looks like when it settles (pose 0? the quiet rung?), and whether a settled ring still reads as the selection.
5. THE WASH — a filled wobble path on the same seed: its 3:1 as a FILL against the unwashed neighbour and against the 7% unit wash, both themes.
6. ONE RING OFF THE BOARD — singleton vs per-control: the ring on the tongue, a chip, the toggle (54px offset ornament), a masthead link, the deck card; lag measured across the sheet's slide and a Teleport; R3-e WHOLE (≤3.6px more reach); every ring ≥3:1 on four grounds with the subject-count guard; the six bespoke rules deleted in the overlay; forced-colors outline stays.
7. MODALITY — one mark for every pointer, R3-j/R3-i re-read; the comment deleted.
8. THE ARMED VERB — "living" includes the armed destructive box: show it breathing on the shared beat at zero filter cost, or drop the claim.

## First runnable prototype

Patch `ghostPath` from outside (`page.evaluate`, replacing the active cell's path with a four-pose stack driven by the page's own `boilFrame`), or a `.diff` (~30 lines in `gridPaths.ts` + `DigitCell.vue`; a ~60-line `FocusRing.vue` mounted in `App.vue`) applied only in a throwaway worktree under the scratchpad. Re-run `wobble.probe.ts` (R3-a as re-based, the new time row), `budget.probe.ts`, `marks2` R3-e/R3-f, `click.probe.ts`, `mobile.probe.ts`; the traversal frame trace; one dpr3 crop of the living ring mid-beat beside `ring-on-grid.png` (two poses side by side is a number's job — prefer the σ-over-time table).

## Instruments (re-run unchanged; add rows beside them)

- `r0/r3-marks/probe/wobble.probe.ts` R3-a (ring σ inside [0.5×, 2.0×] the grid's; the wash likewise) — RED at HEAD both engines; R3-a2 (the length law at 4×4 / 16×16). Say what your family does to R3-a's LAW, not only its reading; add any new row beside it born-RED at HEAD.
- `r0/r3-marks/probe/budget.probe.ts` R3-h — 9/9/9 with the ghost's own filter `none`, plus the ghost's DOM population (16 / 81 / 256): must stay green and the population must not go +N².
- `r0/r3-marks/probe/marks2.probe.ts` R3-e (the deck ring WHOLE: `outlineOffset + outlineWidth ≤` the card's air, 3.6px of headroom) and R3-f (every ring's own 1.4.11 ratio) — both engines; the subject-count guard (≥3 controls reached) on any focus row.
- `r0/r3-marks/probe/click.probe.ts` R3-j and `mobile.probe.ts` R3-i — re-read under your change (which tier paints on click / tap / key; the phone at 393×699 dpr3).
- `web/frontend/e2e/spoken-gallery.spec.ts` §3.7 (one ring owner; `.gallery-viewport` outline none), `e2e/a11y.spec.ts:536` (zero unnamed image nodes on a dealt board — per-cell svgs stay `aria-hidden`), `e2e/access.spec.ts:232/:325/:514`, and the forced-colors arm (`gameCell.css:348-356`: a real `outline: 2px solid Highlight` stays) — run on your scratch config.
- A frame trace at 393×699 dpr3 during arrow-key traversal (rAF deltas, frames >33 ms) before and after.

## Kill conditions and risk

- A ring that boils under the reader's own cursor at 8 Hz for as long as a cell is selected is ambient motion nobody asked for (the restraint law refuses it); the N-beats arm decides whether the family is a cure or a cursor blink.
- A floating ring lags Teleport and the 700 ms sliding sheet; a per-control ring is the six bespoke rules re-spelled — say which and why.
- A stack per arrow press at 16×16 is a mount per keystroke.
- The proportional law leaves R3-a RED as written; re-base it in the open and say what the new law asserts.

## Census ground (read before designing)

- `r0/r3-marks/R3-census.md` (+ `logs/wobble-*.json`, `logs/budget-chromium.json`, `logs/focus-*.json`, `logs/deckring-chromium.json`, `logs/click-*.json`, `logs/phone-*.json`, `frames/ring-on-grid.png`): grid rule σ 1.443px (band [0.722, 2.886]), frame 1.145, selection ring 0.092 (7.9× below the floor), peer wash 0 (a CSS box); the ring is already `wobbleRect(0.4, 4 segments, jagged)` — the cause is the library's length law `maxDisplace = roughness × len × 0.015` (a 111-unit cell edge vs a 948-unit rule) plus NO pose stack (the grid runs 4 poses at 150 ms; the ghost is one static path); ratios 7.5 / 15.7 / 8.2 at 4×4 / 9×9 / 16×16; the ghost svg+path is resident on EVERY cell (16 / 81 / 256 paths); live-filter census 9/9/9 with the ghost's own filter `none`; focus inventory: one house-hand affordance, six bespoke geometric rects, the UA default on `.ctrl-btn/.icon-btn/.info-btn/.attribution-trigger` and both masthead links; two rings UNDER 3:1 (`.logo-trigger` 2.70, the deck's `.game-card.is-center` 2.70); the deck ring's headroom 3.6px (reach 6 vs air 9.6); the modality gate is fiction (`<input type="text">` always matches `:focus-visible`; tier 2 paints on click, tap and key).
- `r0/r6-idiom-history/R6-census.md`: the ring is FROZEN, not straight (σ over time is zero); the pi-guard; no text boils; one shared beat at 125 ms; every verb fills `backwards`.
- `r0/r2-accent-family/census/focus-ring-*.json`: ten consecutive chromium tab stops on `outline-style: auto` in an achromatic ring; the dark focus-sketch has no arm.
- `web/frontend/src/games/shared/DigitCell.vue:410-423` (the ghost), `:261-265` (the peer wash div); `src/games/shared/gameCell.css:132, :180-238, :243-257, :300-303, :348-356`; `src/games/shared/GameBoard.vue:156`; `src/pencil/grid/gridPaths.ts:42-70, :338-370, :421-527`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:405-446`; `src/pencil/config/pencilConfig.ts:268-282` (BOIL_CONFIG); `src/pencil/config/filterBudget.ts:97-166, :214-225`; `node_modules/@mkbabb/pencil-boil/dist/path.js` (`wobbleLinePoints`); `e2e/spoken-gallery.spec.ts:200-262`; `e2e/a11y.spec.ts:536`; `e2e/access.spec.ts:232, :325, :514`.

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-LIVE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-LIVE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4238 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
