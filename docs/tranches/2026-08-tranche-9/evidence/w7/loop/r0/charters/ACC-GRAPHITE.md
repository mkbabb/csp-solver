# PASS-1 CHARTER · ACC-GRAPHITE · Graphite for state

Section: §3 the accent family · §4 the fill meter · §12 multiplayer chrome · mark M07
Lane port: 127.0.0.1:4237
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/ACC-GRAPHITE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Refuse to grow the wheel. Colour in this product means exactly ONE thing — who or what
made this mark — and every UI STATE is carried by graphite: ink pressure (the
`--ink-press-*` ramp, already gated across light, dark and print), stroke weight, dash,
hatch, and the drawn mark's own form. Chromatic, and nothing else is: the five crayons
(difficulty, the puzzle's own property), the solver rainbow (the machine wrote it),
teacher-red (it is wrong), gold (it is done), the peer inks (a person wrote it).
Achromatic, all of it: focus, selection, hover, disabled, the armed guard, and the fill
meter — which retraces the board's OWN frame and is therefore the board's own ink at a
heavier pressure, distinguishing itself by FORM alone (which makes the FRAME_Y_PAD 0
asymmetric overhang the real thing to fix). `--color-user-ink` retires: your digits are
graphite on a solo board (which is what a pencil does) and take your room ink only when
another hand is present — so colour on the board MEANS more than one of us is here.
`--color-focus-sketch` and `--color-progress-ink` retire; the sparkle literals go. No new
hexes anywhere in the estate.

The family must carry its own findability: an achromatic selection ring on a graphite
board is the hardest mark in the wave to find, and the family names what carries it
(weight, dash, form, pressure, or a motion of its own) and measures it.

## Substrate on this tree (verify first, cite file:line)

- `index.css` the `--ink-press-*` ramp (rule 55% = 3.53:1 light; quiet 68% = 5.23:1 light / 6.06:1 dark on `--color-card`; 60% measured 4.10:1 and fails) and `scripts/check-ink-pressure.mjs` (three scopes); `:249-256` the ruling that `--color-muted-foreground` is deliberately off the ramp.
- `gameCell.css:180-257` the four ghost tiers (tier 1 graphite on hover only; tier 2 crayon-blue on focus for every pointer); `:348-356` forced-colors.
- `HandDrawnGrid.vue:461-480` the trace (stroke 8 viewBox units, opacity 0.95) — the "heavier pressure" arm; `gridPaths.ts:338` FRAME_Y_PAD 0.
- The 24 `--color-user-ink` consumers across 13 files (`r0/r2-accent-family/census/consumers.json`); `index.css:894-937` print inks user-ink to #000 already (the family's own argument); the multiplayer seam that binds a room ink (`useSession.ts:537 mint()`, `playerIdentity.ts:69`) — verify what a solo board binds today (nothing) and what a room binds.
- The decided ranking of the peer cursor ring (lighter than yours on every axis: stroke 4 vs 5, opacity 0.55) — an achromatic YOUR ring must stay heavier than a coloured peer ring; say how.

## What the family must answer

1. FINDABILITY — a blind five-second read of the selected cell on a full graphite 9×9 board at 1280 and 393×699 dpr3, both themes: the family's kill condition. State what carries it and measure that carrier (stroke weight vs the grid's rules; dash; pressure) — the ring's own 1.4.11 ratios on four grounds (graphite on `--color-card` is ~5:1 light: show it).
2. THE PIXEL CENSUS — off-family chromatic share on touch must fall from 14.52% light / 20.81% dark toward the resting figure; report rest / focused / mid-board both themes.
3. YOUR DIGITS — graphite solo; how a digit you wrote is told from a given (the clue) when both are graphite: weight? pressure? form? Measure the two on the page and in the accessible name (`clue N` vs `entry N` already speak it).
4. THE ROOM — colour arrives on your own hand only when another hand is present: prove the solo board binds nothing (byte-identical) and the room binds `k[self]`; say what the roster shows.
5. THE METER — the board's own ink at heavier pressure: its 3:1 over `--grid-line-color` (a graphite trace over a graphite rule is the second kill); the overhang fixed; what shows at 0%; how a reader knows it is a gauge.
6. THE GUARD — achromatic by ruling (today's zero-chroma guard becomes deliberate): show the destructive verb told apart by weight and words alone at 4.5:1.
7. RETIREMENTS — focus-sketch, progress-ink, user-ink, the sparkle literals: the consumer map after; print and forced-colors arms intact.
8. WHAT STAYS CHROMATIC — the five jobs listed with their tokens; the kinship probe's reading under the family (every remaining accent is a crayon, a verdict or an exception).

## First runnable prototype

`addStyleTag` on your dev server: the fill trace at `--ink-press-quiet` stroke 8; the focus ring on the ramp (heavier stroke); `--color-user-ink` re-pointed to graphite; the sparkle literals to a graphite value. 1280×800 and 393×699 dpr3, light and dark, both engines. Re-run the pixel census, the four ratios, the kinship probe; the five-second read banked as two crops (light, dark) of one selected cell and its neighbours at dpr3, beside R3's `ring-on-grid.png`.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r2-accent-family/probe/accent-kinship.probe.ts` rows 1–5 — RED 4 / GREEN 1 at HEAD, both engines. Rows 1/2/4 must green under your overlay; row 5 (the tolls) must stay green; the subject-count guard on row 3 (≥3 controls reached; webkit reaches 0 by Tab) stands. If your family widens the anchor set or the EXCEPTED set, record the ruling IN the probe's own file and say so; KIN_DEG = 5° is a constraint on cures, not a dial.
- `r0/r2-accent-family/probe/hue-census.probe.ts` — the pixel census re-run under the same band and chroma floor, rest / focused / mid-board, both themes, both engines: report the off-family share before and after.
- The four 1.4.11 ratios re-derived on the painted bytes: the board focus ring light/dark on `--color-card` (3.63 / 3.69 at HEAD); the progress trace over `--grid-line-color` (3.36 / 3.46) and over `--color-card` (3.85 / 3.07 — 0.07 of headroom in dark). Every hue move re-derives all four.
- AA 4.5:1 on every ink tier you touch, both themes, on `--color-card` and `--color-background`; the print (#000) and forced-colors (CanvasText) arms unchanged, proven by emulation.
- `r0/r2-accent-family/probe/digest.mjs` / `consumers.mjs` — the consumer map after your token moves (no token left with zero consumers and a hex; no third name for a colour that already has two).

## Kill conditions and risk

- The board is already almost entirely graphite and R3's census says the ring's problem is that it does not read as different from the grid; this family doubles down on exactly that. If the achromatic ring is not findable in a blind five-second look, the family dies there.
- A graphite trace over a graphite rule may fall under 3:1.
- Your digit vs a clue: both graphite — if the only difference is the accessible name, the board has lost authorship in the visible layer, which is M07's own subject.
- Retiring `--color-user-ink` is a real change to 24 sites and to the solo board the owner has read for nine tranches; measure, then say it plainly.

## Census ground (read before designing)

- `r0/r2-accent-family/README.md` (+ `census/digest.json`, `census/consumers.json`, `census/kinship-*.json`, `census/focus-ring-*.json`, `census/states-*.json`, `frames/board-corner-{light,dark}.png`): resting chromatic content 93.21% light / 87.04% dark in the warm band (OKLCH 40–115°, C ≥ 0.012), off-family share tripling on touch (to 43.21% mid-board in dark); the 122.8° hole between crayon-blue 251.4° and crayon-rose 14.2° with `--color-progress-ink` at 292.7°/293.0° inside it; the two blues 9.6° apart in OKLCH; eleven of twenty-two inks verbatim Tailwind, zero of the five crayons; focus is three idioms and one is the browser's; the dark focus ring is #3a7bc4 at 3.69:1 because `.dark` never redefines `--color-focus-sketch`; the armed guard has zero chromatic content; consumers: progress-ink 1, focus-sketch 2, user-ink 24 across 13 files; the sparkle's two inline `rgba(196,181,253,…)` literals; the peer walk at C 0.110 vs mean crayon C 0.166.
- `r0/r6-idiom-history/R6-census.md` + `hue-census-HEAD.txt`: dark `--color-progress-ink` #7c3aed ≡ light `--color-solver-ink-2` byte-identical; the crayon dark-mode law (hue ±3°, L +0.06..0.10, chroma may RISE, never desaturate); wax for strokes/washes/fills, hue-locked darkened INK for verdict text; the rainbow is board content only; the three ink families never compete; a semantic state token is an alias with zero new hexes; `--color-muted-foreground` is deliberately off the ramp.
- `r0/r3-marks/R3-census.md` §fill meter: 8 viewBox units = 5.09 CSS px at 1280 / 2.96 on the phone; the top stripe overhangs the board box (FRAME_Y_PAD 0); not rendered at 0%; one keystroke paints ~126 CSS px; no visible label (an sr-only progressbar 'board fill'); `HandDrawnGrid.vue:461-480, :569-592`.
- `web/frontend/src/assets/index.css:107-359` (`@theme`), `:362-441` (`.dark`), `:151 :219 :267-278 :372 :407` (user-ink, focus-sketch, progress-ink and their comments), `:191-222` (the ink tiers' measured ratios), `:894-952` (print and forced-colors arms); `src/games/shared/gameCell.css:120-300` (the ghost tiers and the 7% unit wash), `:246, :248`; `src/games/shared/GameControlPanel.vue:2081, :2087` (the sparkle literals); `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:471`; `src/pencil/grid/gridPaths.ts:338-370` (FRAME_X_PAD/FRAME_Y_PAD, `generateFrameTraceFrames`).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/ACC-GRAPHITE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/ACC-GRAPHITE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4237 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
