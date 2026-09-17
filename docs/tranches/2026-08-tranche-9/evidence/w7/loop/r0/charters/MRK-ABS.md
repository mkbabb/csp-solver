# PASS-1 CHARTER · MRK-ABS · One visible hand

Section: §5 the wobble law · §6 focus rings
Lane port: 127.0.0.1:4239
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-ABS/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

A reader judges wander in SCREEN PIXELS, not in fractions of an edge. So the house law
is an ABSOLUTE band — the grid's own measured [0.722, 2.886]px σ — and short marks are
drawn with more roughness to reach it: a length-compensated roughness, `roughness =
targetSigma / (len × 0.015 × k)`, computed per mark from its own length, so a call site
names a target in px and the library's proportional law is satisfied underneath. Every
mark on the page wanders the same visible amount because one hand drew them all. No new
primitive, no new beat; nothing boils that did not boil before. Every drawn mark declares
a target σ from a three-rung band taken from measurement: frame 1.145 · rule 1.443 · mark
1.443. The selection ring reaches the mark rung. The peer wash gains geometry for the
first time (a CSS box today, σ 0 by having none), drawn as a filled path on the existing
ghost seed at the same target.

Focus becomes a GRADED set stated as law rather than left as accident: the house hand on
the board (where the page is drawn), ONE designed token everywhere off it — `2px solid
var(--color-focus-sketch)`, offset 3px, both themes, with the dark arm the token lacks —
and the browser default nowhere. The six bespoke rects are deleted (the toggle keeps its
54px-offset ornament geometry with the token's stroke); `index.css:445`'s
`outline-ring/50` is replaced by a base-layer `:focus-visible` rule; the two 2.70:1 rings
are cured by the token (3.63 light / 6.42 dark). One mark for every pointer; the false
modality comment is deleted.

## Substrate on this tree (verify first, cite file:line)

- `node_modules/@mkbabb/pencil-boil/dist/path.js` `wobbleLinePoints` (`maxDisplace = roughness × len × 0.015`); `gridPaths.ts:42-70` `generateCellRects` (roughness 0.4, the seed); the measured lengths 111 / 948 user units and the ratios 7.5 / 15.7 / 8.2 (`r0/r3-marks/logs/wobble-4x4-*.json`, `wobble-16x16-*.json`).
- `DigitCell.vue:261-265` the peer wash div; `gameCell.css:132` `.cell-peer`.
- `index.css:445` (`outline-ring/50`), `:219-222` (`--color-focus-sketch`, no dark arm); the six bespoke rules (`DarkModeToggle.vue:740`, `HandwrittenLogo.vue:544`, `DrawerTab.vue:151`, `GameCard.vue:436`, `StagingBand.vue:431`, `GameGallery.vue:1450`); `gameCell.css:243-257`, `:348-356`.
- `e2e/spoken-gallery.spec.ts:200-262` (the deck ring WHOLE: reach 6 vs air 9.6 → 3.6px headroom).

## What the family must answer

1. THE CONSTANT — one `k` serving 4×4, 9×9 and 16×16: ring σ measured inside [0.722, 2.886] at all three by R3's sigma fit; if compensation needs a per-size table the family dies on that table.
2. THE EYE — the dpr3 crop of the compensated ring beside `frames/ring-on-grid.png` at the same scale: hand, or damage? (~1.3% of a 111-unit edge vs the rule's 0.15%). Say it.
3. THE WASH — a filled path on the ghost seed at the mark rung: its 3:1 as a fill vs the neighbour and vs the 7% unit wash; the peer-cursor ring's decided ranking (lighter, a ring) kept.
4. BUDGET — 9/9/9, ghost filter `none`, DOM population unchanged (16/81/256; no stack).
5. THE TOKEN RING — on every off-board control (chip, verb, tongue, toggle at its 54px offset, masthead links, deck card): ≥3:1 on four grounds both themes with the dark arm; the subject-count guard; R3-e WHOLE; `access.spec.ts` 2.1/2.2; `spoken-gallery` §3.7 one owner.
6. THE GRADED LAW — written down: what a focused thing looks like on the board vs off it, and why two idioms are one system.
7. MODALITY — one mark for every pointer; R3-j/R3-i re-read; the comment deleted.
8. THE ARMED VERB — under a still law, what marks it (weight? the ramp?) — say it, or say it is not this family's.

## First runnable prototype

A static SVG page under your evidence dir rendering the ring at the three board sizes with compensated roughness (import the library from `web/frontend/node_modules`), screenshotted at dpr3 and measured by R3's `wobble.probe.ts` sigma fit adapted to the page; the token ring as `addStyleTag` on your dev server (both engines, 1280×800 + 393×699 dpr3) with the six bespoke rules overridden; a 6-line `gameCell.css` `.diff` for the wash only if a static page cannot show it. Bank one dpr3 crop (the ring beside R3's) and nothing else.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r3-marks/probe/wobble.probe.ts` R3-a (ring σ inside [0.5×, 2.0×] the grid's; the wash likewise) — RED at HEAD both engines; R3-a2 (the length law at 4×4 / 16×16). Say what your family does to R3-a's LAW, not only its reading; add any new row beside it born-RED at HEAD.
- `r0/r3-marks/probe/budget.probe.ts` R3-h — 9/9/9 with the ghost's own filter `none`, plus the ghost's DOM population (16 / 81 / 256): must stay green and the population must not go +N².
- `r0/r3-marks/probe/marks2.probe.ts` R3-e (the deck ring WHOLE: `outlineOffset + outlineWidth ≤` the card's air, 3.6px of headroom) and R3-f (every ring's own 1.4.11 ratio) — both engines; the subject-count guard (≥3 controls reached) on any focus row.
- `r0/r3-marks/probe/click.probe.ts` R3-j and `mobile.probe.ts` R3-i — re-read under your change (which tier paints on click / tap / key; the phone at 393×699 dpr3).
- `web/frontend/e2e/spoken-gallery.spec.ts` §3.7 (one ring owner; `.gallery-viewport` outline none), `e2e/a11y.spec.ts:536` (zero unnamed image nodes on a dealt board — per-cell svgs stay `aria-hidden`), `e2e/access.spec.ts:232/:325/:514`, and the forced-colors arm (`gameCell.css:348-356`: a real `outline: 2px solid Highlight` stays) — run on your scratch config.
- A frame trace at 393×699 dpr3 during arrow-key traversal (rAF deltas, frames >33 ms) before and after.

## Kill conditions and risk

- The cell ring is a 111-unit edge; forcing 1.443px of wander onto it is ~1.3% of the edge against the grid rule's 0.15% — it will very likely read as a shaky box. The family is built to be killed by one crop; if it survives the crop, the constant is the next kill.
- A geometric rect ring on drawn chrome is what §6 was written against; the family must argue the graded law is one system, not a truce.
- The toggle's 54px-offset ornament ring stays odd under any token.

## Census ground (read before designing)

- `r0/r3-marks/R3-census.md` (+ `logs/wobble-*.json`, `logs/budget-chromium.json`, `logs/focus-*.json`, `logs/deckring-chromium.json`, `logs/click-*.json`, `logs/phone-*.json`, `frames/ring-on-grid.png`): grid rule σ 1.443px (band [0.722, 2.886]), frame 1.145, selection ring 0.092 (7.9× below the floor), peer wash 0 (a CSS box); the ring is already `wobbleRect(0.4, 4 segments, jagged)` — the cause is the library's length law `maxDisplace = roughness × len × 0.015` (a 111-unit cell edge vs a 948-unit rule) plus NO pose stack (the grid runs 4 poses at 150 ms; the ghost is one static path); ratios 7.5 / 15.7 / 8.2 at 4×4 / 9×9 / 16×16; the ghost svg+path is resident on EVERY cell (16 / 81 / 256 paths); live-filter census 9/9/9 with the ghost's own filter `none`; focus inventory: one house-hand affordance, six bespoke geometric rects, the UA default on `.ctrl-btn/.icon-btn/.info-btn/.attribution-trigger` and both masthead links; two rings UNDER 3:1 (`.logo-trigger` 2.70, the deck's `.game-card.is-center` 2.70); the deck ring's headroom 3.6px (reach 6 vs air 9.6); the modality gate is fiction (`<input type="text">` always matches `:focus-visible`; tier 2 paints on click, tap and key).
- `r0/r6-idiom-history/R6-census.md`: the ring is FROZEN, not straight (σ over time is zero); the pi-guard; no text boils; one shared beat at 125 ms; every verb fills `backwards`.
- `r0/r2-accent-family/census/focus-ring-*.json`: ten consecutive chromium tab stops on `outline-style: auto` in an achromatic ring; the dark focus-sketch has no arm.
- `web/frontend/src/games/shared/DigitCell.vue:410-423` (the ghost), `:261-265` (the peer wash div); `src/games/shared/gameCell.css:132, :180-238, :243-257, :300-303, :348-356`; `src/games/shared/GameBoard.vue:156`; `src/pencil/grid/gridPaths.ts:42-70, :338-370, :421-527`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:405-446`; `src/pencil/config/pencilConfig.ts:268-282` (BOIL_CONFIG); `src/pencil/config/filterBudget.ts:97-166, :214-225`; `node_modules/@mkbabb/pencil-boil/dist/path.js` (`wobbleLinePoints`); `e2e/spoken-gallery.spec.ts:200-262`; `e2e/a11y.spec.ts:536`; `e2e/access.spec.ts:232, :325, :514`.

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-ABS/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-ABS/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4239 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
