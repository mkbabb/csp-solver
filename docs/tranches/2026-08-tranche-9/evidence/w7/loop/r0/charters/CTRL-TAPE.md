# PASS-1 CHARTER · CTRL-TAPE · The taped case

Section: §10 the controls system, with §1 §2 §8 §14 §15 inside it · marks M01 M03 M04 M05 M12 M13
Lane port: 127.0.0.1:4230
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-TAPE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The washi tape is the ONE heading voice, and rank is carried by WHERE the tape is stuck,
never by typeface: a group's tape sits astride its compartment's top edge; a row's tape
lies flat inside the compartment, left-aligned, in the same tuple. The card stays what it
already is, a pencil case of drawn compartments, and the stroke ladder (case 3 · tongue
2.5 · well 1.5 · a 1px row rule) is the whole delineation. Eight names, one tuple, eight
document headings. Washi is neutral paper by law, so the selected tier's tint leaves the
heading and lives on the chip alone.

Under the same centre: three button treatments (BOXED = the primary act `deal`, a pose-0
outline at the tongue's 2.5, the only boxed control in the card; BARE = verbs and tools,
glyph rank + word, no ground, no border, `.info-glyph` loses its 1.5px ring and
`.players-leave` becomes a bare word; CHIP = options on the seeded scribble). Radii: 0 on
anything drawn, 8px on invisible hit boxes. Hover is the ink lift alone (the 2.9-point
fill retires). Focus: the tongue's own ring (`2px dashed currentColor`, offset 3) on every
control; the board keeps its drawn ring. The mobile tabs (§8) become two row-tapes side by
side under the group's tape: the selected one PRESSED (0° tilt, full ink), the other LIFTED
(±1.5°, 68%) with its value word riding its right end; the CSS `text-decoration` underline
dies. The bar (M04) is a FIFTH compartment drawn at 1.5 with its own flow height reserved
at the card's foot (the `scene.css` handle precedent) so it buries nothing, sticky in all
three scrollports. The tongue's quick set (§14): a strip of three tongues under one
outline — `undo · redo · controls` — on the board's bottom edge in portrait and vertical
on the right flank in landscape. The confirm (§15): the two-tap sublabel the owner has
already passed twice (`sure?` in `--color-red-ink` w600, disarm on any other tap or after
4 s) extended to `fill` and `solve`. The 390 seam: `--sheet-chrome` gains the wordmark's
band + 8px.

The sticky law this family proposes is the HALF-LIFE law: the tape's sticky containing
block is a box spanning the top half of its well (`position: absolute; inset: 0 0 50% 0`,
the tape `sticky; top: 0` inside it), so a tape unpins when its group is half gone and
never pins over another group's options.

## Substrate on this tree (verify first, cite file:line)

- `SheetWashiLabel.vue` `anchor="tag"` exists (sticky, in-flow, net flow height zero by construction at :171-173 — it must stay zero); the family adds an anchor `row` (flat, inside, left, same tuple). Read the component whole before overlaying.
- `typography.css:119-124` role tokens; :133-137 the `--type-group-title` two arms; :146-168 `--type-option`'s four width arms (the phone arm 20px is what collapsed the ratio to 1.0175). The family re-points `--type-tag` → `--type-heading` (1.618rem) and `--type-group-title` → `--type-tag`. Verify the computed tuple at 390 and 1280 both engines.
- `GameControlPanel.vue:786-793` the `display: contents` heading host the mobile tab heads already use — the shape for the eight `<h2>` hosts; :19-38 and :415-417 the one-string law (`aria-labelledby`; casing is CSS only).
- `DrawerTab.vue:151-154` the tongue's dashed focus ring; :76 `.drawer-tab`; :13-40 W2 §2.7's one-law-three-edges tuck.
- `GameControlPanel.vue:2096-2104` `.action-bar` (no border, `::before` fade, `::after` skirt 56px desk / 6px dock); :2173 the sticky key missing `(max-width: 1023.98px) and (orientation: landscape)`; :506-530 / :542-566 the Deal/Clear two-tap arms (coarse + dirty).
- `scene.css:468` `--sheet-chrome`; `GameScene.vue:183` `.outline-svg` (outset −4, stroke 3).

## What the family must answer

1. VOICE — is the tape's rung the heading's (25.89px Patrick Hand 500) at every width, and does a 25.9px tape read as a tape or as a banner? Measure the overhang above its well (14px today; ~22 predicted) against the dock card's 3.75px top clearance and the desk's 11.26px. ROW 3 on the phone: 25.89/20.00 = 1.294 by construction; if the tape must be smaller, say whether `--type-option`'s phone arm drops instead and what M01 loses.
2. STICKY — implement the half-life container by DOM patch and read R7 I3 at all five desk scroll states and the 1280 "Medium" residual; state what the card's top shows between groups.
3. BUTTONS — the three treatments applied to every one of the seven censused controls; radii set; the hover ink lift measured for contrast; the dashed ring measured at 3:1 on four grounds for the ring's own colour (currentColor on the quiet rung?).
4. MOBILE TABS — two row-tapes pressed/lifted: 44×44 both dimensions each, per-dimension negative control; the inactive panel's 0×0 options (W2's one-panel mechanic unchanged) — say how a reader learns the lifted tape is a tab.
5. THE BAR — the fifth compartment's reserved flow height at the card's foot; R7 I2 must green; the sticky key with the landscape arm; the skirt as outset; the z-ladder position stated (1 < 30 < 35 < 50 < 60).
6. QUICK SET — three tongues under one outline: does it read as a second toolbar (M13's own fence)? Measure at 390 (274px free), 844×390 and 900×500; every act's tap count from the playing view.
7. CONFIRM — the two-tap sublabel on `fill` and `solve`; R7 I4 green (Fill writes 0 on the first tap on a dirty board); the sublabel's 4.5:1 in red-ink.
8. THE 390 SEAM — `--sheet-chrome` + wordmark band + 8px: measured clearance at 390, 375, 430; ≥ two stroke widths at 375. State the masthead-to-board gap you leave.

## First runnable prototype

A Playwright `addStyleTag` + `page.evaluate` overlay against your dev server, 390×844 and 1280×800 (add 900×500 sheet-up for the bar), chromium + webkit: re-point the two role tokens; `.section-heading { display: none }` with the eight names hosted as `<h2>` tapes (DOM patch); restyle `.mobile-heading-btn` as a tape by borrowing `.washi-tag`'s clip-path and tilt, pressed/lifted states; inject a pose-0 outline SVG (stroke 1.5) around `.action-bar` and reserve its flow height; add the half-life sticky container with a ~12-line DOM patch; the dashed ring on `:focus-visible` for every control. Re-run ROW 1/2/3 and R7 I2/I3 against the overlaid page; bank two crops (the 390 sheet; the 1440 rail at scrollTop 500 beside R7's `p7`).

## Instruments (re-run unchanged; add rows beside them)

- `r0/r1-controls/probe/heading-voice.spec.ts` ROW 1 (one voice tuple) · ROW 2 (every group name a document heading) · ROW 3 (group title ÷ option ≥ 1.23) — RED at HEAD at 4 cells (desk 1280×800, dock 390×844 × chromium, webkit). Must green under your overlay without weakening a row.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I2 (the bar carries chrome of its own and covers no option group) · I3 (a pinned tape names a group ≥ half on screen at every scroll state) · I4 (every destructive verb asks before it acts on a dirty board) — RED at HEAD.
- `web/frontend/e2e/access.spec.ts` 2.1 (no control focuses into a ≥96% burial) · 2.2 (no covered control in the drawer subtree stays tabbable) · 2.3 (sublabel/chip text 4.5:1 light and dark) — run against your overlay on your own config.
- The 44×44 floor with a per-dimension negative control on every tab/target you re-cut (precedent: `e2e/zone-grammar.spec.ts`'s pair-branch row).
- Content height vs scrollport at 390×844, 900×500 (sheet up, settled) and 1280×800, before and after.

## Kill conditions and risk

- The F12 clip returns if a 25.9px tape's overhang exceeds the dock card's 3.75px top clearance — measure; if the card's top padding must move, say what the iPad coarse seal (0.23px headroom, `visual-regression.spec.ts` test 10) and the two goldens that walk on 6px of card width (`cell-light`, `grid-corner-light`) pay.
- Three tongues on one edge reading as a toolbar is M13's own fence; if it does, the family's quick set is dead, not the family.
- The tape astride every compartment is the same silhouette as the generic "label above every block" tell. The family survives that only because the tape IS the accessible name and the house's own tape; prove it by the size ratio and the drawn compartment beneath it, not by assertion.
- A dashed `currentColor` ring on a quiet-rung control may fall under 3:1 — measure on four grounds.

## Census ground (read before designing)

- `r0/r1-controls/README.md` (+ `census-*.json`, `chrome2-*.json`, `structural-map-*.txt`, `born-red-head.txt`): three heading voices (Fraunces 25.89/800 · Patrick Hand 14.05/500 washi tag · Patrick Hand 14.05/400 zone caption at 68%); 2 of 8 names are document headings; phone ratio heading/option 1.0175 vs desk 1.294; seven button treatments; five radii; one drawn border (`.info-glyph`); no authored focus ring (chromium 1px auto / webkit 3px auto); hover fill 2.9 lightness points; the bar has no edge and is not sticky at <1024 landscape; tap counts (level = 3 taps; the `i` crib unreachable on touch); 274px free on the board's bottom edge; the card overflows at every cell (43% desk / 58% landscape below the fold).
- `r0/r7-owners-eye/r7-owners-eye.md` (+ frames, `instruments/readings-at-head.json`): the bar lays over 89.6% of the players well (23,585px²); only `new game` ever pins and at three of five desk scroll states its group is under half on screen; the 390 case-stroke/wordmark seam (−2.73/−3.02px) and 375's 5.5px margin; Deal/Clear arm `sure?`, Fill writes 52–57 cells on one tap, Solve neither; M13 untouched (the tongue is the only control at 844×390); the masthead-to-board gap is 4.4px at 900 and at 390.
- `r0/r6-idiom-history/R6-census.md`: the 48-row law list (one box grammar = HandDrawnOutline; text never boils; one hover affordance per interactive text surface; washi is neutral; the type ladder is √φ and a role reads a rung; casing is CSS only; the role seam `--type-act/verb/tool/tag/group-title` landed computed-identical at W2 §2.6 so a voice re-cut is one right-hand side per role).
- `web/frontend/src/assets/typography.css:98-170` (the role tokens and W2's "THE NUMBERS ARE W7'S" comment), `web/frontend/src/games/shared/GameControlPanel.vue` (the card), `src/pencil/sheet/SheetWashiLabel.vue` (the tape), `src/games/shared/DrawerTab.vue` (the tongue), `src/games/shared/scene.css` (dock/sheet/ribbon keys).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-TAPE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-TAPE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4230 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
