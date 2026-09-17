# PASS-1 CHARTER · ACC-FIVE · Five crayons, no sixth

Section: §3 the accent family · §4 the fill meter · §12 multiplayer chrome · §15 the confirm's danger ink · mark M07
Lane port: 127.0.0.1:4236
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/ACC-FIVE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Every interactive accent is an alias into the FIVE crayons, hue-locked within 5° (the
house's own loosest shipped lock, `orange-ink` at 4.5°), with contrast bought by
LIGHTNESS alone — the exact move `red-ink` / `green-ink` / `orange-ink` / `gold-ink`
already model. The violet dies. Your pen becomes crayon-blue's ink tier
(`--color-blue-ink`, darkened to ≥4.5:1 on `--color-card`, with `--color-user-ink`
aliased to it so 24 consumers stand), one hue with the unit wash and the focus ring,
separated from focus by chroma and weight (pen ~0.20 vs ring 0.13). Progress is GOLD,
because gold is earned light: the trace becomes the solved frame at 100%, so the meter's
form is the celebration arriving; no label; the graphite frame is the empty gauge, so
nothing renders at 0% by design. `--color-progress-ink` → crayon-gold light / gold dark
(one consumer). `--color-focus-sketch` gains its dark arm (crayon-blue dark, 6.42:1; the
comment made true). The sparkle glow → `var(--color-crayon-gold)` at .3/.6. The rainbow
stays the ONE declared exception. The confirm's destructive face → `--color-red-ink`.
Chrome stays achromatic: the active heading's crayon-green tint retires to the chip.

## Substrate on this tree (verify first, cite file:line)

- `index.css:191-207` the ink-tier move (hue lock, lightness step, measured ratios) — copy it for blue; `:151`/`:372` user-ink; `:219-222` focus-sketch; `:278`/`:407` progress-ink; `:174` ("gold comes to the page only when the work is done"); `:164-169` the crayon dark law; `:894-952` print/forced-colors.
- `HandDrawnGrid.vue:461-480, :569-592` the trace (poses, dash tween, `.solve-success` fade to pose 0) — the gold trace becoming the solved frame needs the solved frame's own token and timing: read the celebration (`pencilConfig.ts` CELEBRATION) before claiming continuity.
- `GameControlPanel.vue:2081, :2087` the sparkle literals; `:188-191` the tier tint on `level` (retires from the heading).
- `gameCell.css:120-300` the 7% crayon-blue unit wash and the four ghost tiers; `:246, :248`.
- `r0/r2-accent-family/census/consumers.json` for every token you alias or retire (no hex left with zero consumers; no third name for a colour that already has two).

## What the family must answer

1. BLUE-INK — the hex in both themes; ≥4.5:1 on card and background; hue within 5° of crayon-blue; the pen/ring separation by chroma measured; the unit wash, the ring and the digit co-visible in a 330×210 crop, light and dark; print and forced-colors preserved.
2. GOLD PROGRESS — the four 1.4.11 ratios: gold's dark arm is LIGHT over a light warm-grey frame; the trace over `--grid-line-color` and over `--color-card` in dark (3.07 today with 0.07 of headroom) must clear 3:1 — this is the family's first kill.
3. THE CONTRADICTION — a gold stripe at 5% against "gold comes to the page only when the work is done": show the trace at 5%, 50%, 100% and the solved frame in one strip; say whether the meter is the celebration arriving or gold spent early.
4. THE METER'S FORM — symmetric inset or deliberate straddle; what a reader sees at 0% (nothing, by design — say how they learn the gauge exists); the ~126 CSS px first stroke.
5. KINSHIP — rows 1–4 green with the FIVE-anchor set unchanged; row 5 green; the census's off-family share on touch falls (report the numbers both themes).
6. CHROME ACHROMATIC — the active heading's tint retired; the sparkle in gold at .3/.6 measured; the confirm's face in red-ink at 4.5:1.
7. THE VIOLET'S DEATH — rainbow stop 2 stays (board content only) and is now the only violet: say what that costs the "one family" claim and how the instrument records it.
8. THE PEER ANCHOR SET — the reserved arcs the per-player palette must clear under this family (five crayons + their ink tiers + red/gold verdicts); do not design the palette.

## First runnable prototype

`addStyleTag` overriding the six tokens in both themes on your dev server, 1280×800 and 393×699 dpr3, both engines; re-run the kinship probe (rows 1–4 must green, row 5 stays), the pixel census, the four ratios by canvas read-back; two 330×210 board-corner crops beside R2's, plus one strip of the meter at 5/50/100%.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r2-accent-family/probe/accent-kinship.probe.ts` rows 1–5 — RED 4 / GREEN 1 at HEAD, both engines. Rows 1/2/4 must green under your overlay; row 5 (the tolls) must stay green; the subject-count guard on row 3 (≥3 controls reached; webkit reaches 0 by Tab) stands. If your family widens the anchor set or the EXCEPTED set, record the ruling IN the probe's own file and say so; KIN_DEG = 5° is a constraint on cures, not a dial.
- `r0/r2-accent-family/probe/hue-census.probe.ts` — the pixel census re-run under the same band and chroma floor, rest / focused / mid-board, both themes, both engines: report the off-family share before and after.
- The four 1.4.11 ratios re-derived on the painted bytes: the board focus ring light/dark on `--color-card` (3.63 / 3.69 at HEAD); the progress trace over `--grid-line-color` (3.36 / 3.46) and over `--color-card` (3.85 / 3.07 — 0.07 of headroom in dark). Every hue move re-derives all four.
- AA 4.5:1 on every ink tier you touch, both themes, on `--color-card` and `--color-background`; the print (#000) and forced-colors (CanvasText) arms unchanged, proven by emulation.
- `r0/r2-accent-family/probe/digest.mjs` / `consumers.mjs` — the consumer map after your token moves (no token left with zero consumers and a hex; no third name for a colour that already has two).

## Kill conditions and risk

- The dark gold trace over the frame may fall under 3:1 — the family dies on that number if no lightness step within the hue lock cures it.
- Gold at 5% contradicts the house's own gold law; if the strip shows gold spent early, say it.
- Blue-ink at ≥4.5:1 is darker than today's 5.08:1 blue-600; the digit's weight on the page changes — measure the digit's contrast and show it.
- The alias must keep the print (#000) and forced-colors (CanvasText) arms.

## Census ground (read before designing)

- `r0/r2-accent-family/README.md` (+ `census/digest.json`, `census/consumers.json`, `census/kinship-*.json`, `census/focus-ring-*.json`, `census/states-*.json`, `frames/board-corner-{light,dark}.png`): resting chromatic content 93.21% light / 87.04% dark in the warm band (OKLCH 40–115°, C ≥ 0.012), off-family share tripling on touch (to 43.21% mid-board in dark); the 122.8° hole between crayon-blue 251.4° and crayon-rose 14.2° with `--color-progress-ink` at 292.7°/293.0° inside it; the two blues 9.6° apart in OKLCH; eleven of twenty-two inks verbatim Tailwind, zero of the five crayons; focus is three idioms and one is the browser's; the dark focus ring is #3a7bc4 at 3.69:1 because `.dark` never redefines `--color-focus-sketch`; the armed guard has zero chromatic content; consumers: progress-ink 1, focus-sketch 2, user-ink 24 across 13 files; the sparkle's two inline `rgba(196,181,253,…)` literals; the peer walk at C 0.110 vs mean crayon C 0.166.
- `r0/r6-idiom-history/R6-census.md` + `hue-census-HEAD.txt`: dark `--color-progress-ink` #7c3aed ≡ light `--color-solver-ink-2` byte-identical; the crayon dark-mode law (hue ±3°, L +0.06..0.10, chroma may RISE, never desaturate); wax for strokes/washes/fills, hue-locked darkened INK for verdict text; the rainbow is board content only; the three ink families never compete; a semantic state token is an alias with zero new hexes; `--color-muted-foreground` is deliberately off the ramp.
- `r0/r3-marks/R3-census.md` §fill meter: 8 viewBox units = 5.09 CSS px at 1280 / 2.96 on the phone; the top stripe overhangs the board box (FRAME_Y_PAD 0); not rendered at 0%; one keystroke paints ~126 CSS px; no visible label (an sr-only progressbar 'board fill'); `HandDrawnGrid.vue:461-480, :569-592`.
- `web/frontend/src/assets/index.css:107-359` (`@theme`), `:362-441` (`.dark`), `:151 :219 :267-278 :372 :407` (user-ink, focus-sketch, progress-ink and their comments), `:191-222` (the ink tiers' measured ratios), `:894-952` (print and forced-colors arms); `src/games/shared/gameCell.css:120-300` (the ghost tiers and the 7% unit wash), `:246, :248`; `src/games/shared/GameControlPanel.vue:2081, :2087` (the sparkle literals); `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:471`; `src/pencil/grid/gridPaths.ts:338-370` (FRAME_X_PAD/FRAME_Y_PAD, `generateFrameTraceFrames`).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/ACC-FIVE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/ACC-FIVE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4236 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
