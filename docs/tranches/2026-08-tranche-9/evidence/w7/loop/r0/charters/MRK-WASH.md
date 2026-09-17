# PASS-1 CHARTER · MRK-WASH · The wash

Section: §5 the wobble law · §6 focus rings
Lane port: 127.0.0.1:4240
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-WASH/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Refuse to draw the selection as a LINE at all. Selection is not something you write on
the page — it is something you lay over it, and the house already has that vocabulary:
wax, tape, laminate. The selected cell becomes a CRAYON WASH, not a ring — a filled path
on the same seed at low opacity with a soft wax edge, pre-baked, zero filters (the
`ghost-draw-on` 180 ms becomes a wax fill-in) — and the wobble law never applies to it,
because a wash has no edge. Board marks get a three-term grammar: a WASH is where a hand
is (yours, or a peer's — the peer wash stays a wash, which retroactively makes it
correct rather than an exception), a RING is where an eye is (the peer cursor keeps its
ring, preserving the decided ranking and now carrying meaning), a LINE is structure (the
grid, the frame). Chrome focus takes the same law: a focused control gets a wax GROUND
rather than an outline — which also answers R1's "no authored focus ring" absence and the
hover fill that is a 2.9-point lightness step. Forced-colors keeps a real outline, as it
must.

The family's hidden cost is a rule about STATE, not drawing: the board already washes
cells for the unit (7% crayon-blue) and for a peer; a third wash makes three overlapping
translucent grounds on one cell, and the family must say whether the washes are mutually
exclusive or composited, and measure the composite.

## Substrate on this tree (verify first, cite file:line)

- `gameCell.css:120-300` the four ghost tiers and the 7% crayon-blue unit wash; `:132` `.cell-peer`; `:229-241` the peer cursor ring (stroke-opacity 0.55, fill 0.04 — a ring, lighter than yours); `:348-356` forced-colors.
- `DigitCell.vue:410-423` the ghost path (fill it instead of stroking it: same seed, same svg, no new node); `:261-265` the peer wash div.
- `gridPaths.ts:42-70` the seed; the pose-0 bake path for a "soft wax edge" without a filter (grain baked as `generateFrameTraceFrames` does it) — confirm zero filters.
- `GameControlPanel.vue:1964-1968` `.icon-btn:hover` (the 2.9-point fill) and `index.css:445` (`outline-ring/50`) — the wax ground replaces both; `--color-accent` hsl(48 8% 96.1%) over `--color-card` hsl(48 12% 99%).
- `e2e/a11y.spec.ts:536` (zero unnamed image nodes on a dealt board); `e2e/access.spec.ts:514` (chip/sublabel text 4.5:1 with the backdrop composited bottom-up — a wax ground under text changes the backdrop).

## What the family must answer

1. THE WASH'S CONTRAST — 1.4.11's 3:1 for a FILL measured on composited pixels: the washed cell vs its unwashed neighbour, both themes, both engines, AND vs the 7% unit wash on screen at the same time. If selection and unit wash are not separable at a glance, the family dies.
2. THREE GROUNDS ON ONE CELL — unit + selection + peer: composited and measured; the state rule (exclusive or stacked) written down; the digit's 4.5:1 through the stack.
3. THE GRAMMAR — wash / ring / line stated and shown in one crop with a peer cursor present (`?wire=local`, two pages).
4. CHROME FOCUS — the wax ground on a chip, a verb, the tongue, the toggle, a masthead link, the deck card: findable? ≥3:1 as a fill on four grounds; `access.spec.ts` 2.3's text through the ground; the subject-count guard; R3-e WHOLE (a ground has no reach — say so); the six bespoke rules and the hover fill retired.
5. BUDGET — 9/9/9, ghost filter `none`, no new node per cell; `FILTER_BUDGET_UNION_AREA` unmoved.
6. THE FILL-IN — the wax fill-in at 180 ms on the shared grammar (fill `backwards`; PRM same-frame); does a fill-in on every arrow press read as motion?
7. MODALITY — one mark for every pointer; R3-j/R3-i re-read.
8. FORCED-COLORS + A11Y — the real outline stays; `a11y.spec.ts:536` green; the peer ring's ranking preserved.

## First runnable prototype

Inject the wash over the tier-2 ring on the live board (`addStyleTag` filling `.cell-ghost-path` and dropping its stroke; a wax ground on `:focus-visible` for chrome), 1280×800 + 393×699 dpr3, light and dark, both engines; a second page on `?wire=local` for the peer arms. Measure (1)–(8); bank one light and one dark 330×210 crop of a selected cell inside a washed unit with a peer's wash adjacent.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r3-marks/probe/wobble.probe.ts` R3-a (ring σ inside [0.5×, 2.0×] the grid's; the wash likewise) — RED at HEAD both engines; R3-a2 (the length law at 4×4 / 16×16). Say what your family does to R3-a's LAW, not only its reading; add any new row beside it born-RED at HEAD.
- `r0/r3-marks/probe/budget.probe.ts` R3-h — 9/9/9 with the ghost's own filter `none`, plus the ghost's DOM population (16 / 81 / 256): must stay green and the population must not go +N².
- `r0/r3-marks/probe/marks2.probe.ts` R3-e (the deck ring WHOLE: `outlineOffset + outlineWidth ≤` the card's air, 3.6px of headroom) and R3-f (every ring's own 1.4.11 ratio) — both engines; the subject-count guard (≥3 controls reached) on any focus row.
- `r0/r3-marks/probe/click.probe.ts` R3-j and `mobile.probe.ts` R3-i — re-read under your change (which tier paints on click / tap / key; the phone at 393×699 dpr3).
- `web/frontend/e2e/spoken-gallery.spec.ts` §3.7 (one ring owner; `.gallery-viewport` outline none), `e2e/a11y.spec.ts:536` (zero unnamed image nodes on a dealt board — per-cell svgs stay `aria-hidden`), `e2e/access.spec.ts:232/:325/:514`, and the forced-colors arm (`gameCell.css:348-356`: a real `outline: 2px solid Highlight` stays) — run on your scratch config.
- A frame trace at 393×699 dpr3 during arrow-key traversal (rAF deltas, frames >33 ms) before and after.

## Kill conditions and risk

- Three overlapping translucent grounds on one cell is where this fails; if exclusivity is needed, the family has become a state rule and must say so.
- A wax ground under chip text changes the backdrop `access.spec.ts` 2.3 composites — measure every chip.
- The peer wash and your wash are the same material; the only remaining difference is hue — under an accent law that retires your blue, they collide. State the dependency.

## Census ground (read before designing)

- `r0/r3-marks/R3-census.md` (+ `logs/wobble-*.json`, `logs/budget-chromium.json`, `logs/focus-*.json`, `logs/deckring-chromium.json`, `logs/click-*.json`, `logs/phone-*.json`, `frames/ring-on-grid.png`): grid rule σ 1.443px (band [0.722, 2.886]), frame 1.145, selection ring 0.092 (7.9× below the floor), peer wash 0 (a CSS box); the ring is already `wobbleRect(0.4, 4 segments, jagged)` — the cause is the library's length law `maxDisplace = roughness × len × 0.015` (a 111-unit cell edge vs a 948-unit rule) plus NO pose stack (the grid runs 4 poses at 150 ms; the ghost is one static path); ratios 7.5 / 15.7 / 8.2 at 4×4 / 9×9 / 16×16; the ghost svg+path is resident on EVERY cell (16 / 81 / 256 paths); live-filter census 9/9/9 with the ghost's own filter `none`; focus inventory: one house-hand affordance, six bespoke geometric rects, the UA default on `.ctrl-btn/.icon-btn/.info-btn/.attribution-trigger` and both masthead links; two rings UNDER 3:1 (`.logo-trigger` 2.70, the deck's `.game-card.is-center` 2.70); the deck ring's headroom 3.6px (reach 6 vs air 9.6); the modality gate is fiction (`<input type="text">` always matches `:focus-visible`; tier 2 paints on click, tap and key).
- `r0/r6-idiom-history/R6-census.md`: the ring is FROZEN, not straight (σ over time is zero); the pi-guard; no text boils; one shared beat at 125 ms; every verb fills `backwards`.
- `r0/r2-accent-family/census/focus-ring-*.json`: ten consecutive chromium tab stops on `outline-style: auto` in an achromatic ring; the dark focus-sketch has no arm.
- `web/frontend/src/games/shared/DigitCell.vue:410-423` (the ghost), `:261-265` (the peer wash div); `src/games/shared/gameCell.css:132, :180-238, :243-257, :300-303, :348-356`; `src/games/shared/GameBoard.vue:156`; `src/pencil/grid/gridPaths.ts:42-70, :338-370, :421-527`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:405-446`; `src/pencil/config/pencilConfig.ts:268-282` (BOIL_CONFIG); `src/pencil/config/filterBudget.ts:97-166, :214-225`; `node_modules/@mkbabb/pencil-boil/dist/path.js` (`wobbleLinePoints`); `e2e/spoken-gallery.spec.ts:200-262`; `e2e/a11y.spec.ts:536`; `e2e/access.spec.ts:232, :325, :514`.

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-WASH/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MRK-WASH/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4240 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
