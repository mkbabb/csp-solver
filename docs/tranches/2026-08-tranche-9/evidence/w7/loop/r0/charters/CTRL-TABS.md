# PASS-1 CHARTER · CTRL-TABS · The index tabs

Section: §10 the controls system, with §1 §2 §8 §14 §15 inside it · marks M01 M03 M04 M05 M12 M13
Lane port: 127.0.0.1:4232
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-TABS/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The card stops scrolling. Its compartments become INDEX TABS on the card's edge, one
tray face-up at a time; the heading IS the tab (the tab is the document heading and the
tray's accessible name, so the one-string law holds by construction); the acts are the
tray's FLOOR, a pose-0 outline at 2.5 holding `clear · fill · solve · share`, drawn as
ONE piece with the tab strip's lid around the open tray; hierarchy is EDGE (tab) vs
INSIDE (row) vs FLOOR (act). The overflow (43% of the desk card, 58% of the landscape
card below the fold) is cured by not showing everything: the tallest tray (`new game`:
two rows + deal, ~260px) must fit every cell including 900×500's 284px. One tablist on
every platform (`role="tablist"` / `tab` / `tabpanel`, roving tabindex, APG), replacing
four `aria-labelledby` wells — the phone's `size`/`level` tabs go away as a special case
because the whole card is tabs. `size` and `level` are two rows inside `new game`, never
tabs. Sticky is moot. W2's dock and sheet mechanics are unchanged: the sheet still rises;
inside it nothing scrolls.

The family's research fork is the TAB'S DRAWN FORM, and it must be tested both ways:
(a) the drawer tongue's own idiom — `HandDrawnOutline` 2.5 / outset 3, `--color-card`, the
washi word w600 letter-spacing .06em, a one-sided radius — a `role="tablist"` of four
tongues, the raised one continuous with the tray; (b) the washi TAPE promoted — the four
tapes re-anchored to the case's top edge, the selected tape at full ink pulled out at its
±1.5° tilt, the others at the 68% quiet rung and flat. And on the desk: tabs on the top
edge, or down the rail's LEFT edge in vertical writing-mode facing the board (index tabs on
a notebook's side, with the board-flank tongue then one of the same family).

The quick set (§14) under this centre is ONE TOOL HOME: `undo · redo · hint` move onto
the tongue strip at the board's edge on every mobile pose and the portrait ribbon
(`#fold-tools`) RETIRES, which cures the 844×390 hole with the same move; `peek` moves to
the floor beside `share`. The confirm (§15): the guard ribbon replaces the tab strip's
row while armed (the one always-visible band); `keep` returns the strip; one mechanism
for deal · clear · fill · solve. `.info-glyph` becomes a fifth tab `keys` on the desk.

## Substrate on this tree (verify first, cite file:line)

- `DrawerTab.vue:76, :151-154, :13-40` the tongue (outline 2.5, dashed ring, W2 §2.7 tuck) — the idiom for arm (a).
- `SheetWashiLabel.vue` (`anchor="tag"`, the tilt, the clip-path) — the idiom for arm (b); its net-flow-height-zero construction at :171-173 no longer applies once the tape is a tab: say what replaces it.
- `GameControlPanel.vue:786-793` the `display: contents` heading host (generalise to four); :769, :952, :1006, :1042 the wells; :841-848 the inactive panel; :1382-1430 `#fold-tools` (four acts, portrait only); `scene.css:394, :551` its display keys.
- `GameGallery.vue:1003-1065, :1395-1465` the guard ribbon; `GameControlPanel.vue:506-566` the two-tap arms it replaces.
- `scene.css:466` the landscape dock; `scene.css:468` `--sheet-chrome`; the sheet at 900×500 gives the card 284px — measure the tallest tray against it.
- `e2e/spoken-gallery.spec.ts` for the roving-tabindex precedent the deck already carries; `e2e/a11y.spec.ts` for the tablist roles' spoken rows.

## What the family must answer

1. NO SCROLL — card `scrollHeight ≤ clientHeight` at 390×844, 900×500 (sheet up, settled) and 1280×800 for every tray, both engines; the tallest tray named with its height.
2. THE TAB — arm (a) vs arm (b) prototyped; each tab ≥44×44 in both dimensions with a per-dimension negative control (the `.mobile-heading-btn` 44×44 trap); four tabs + seams inside 358px at 390 — state what the fifth tab (`keys` on the desk) does to the row; the selected tab's continuity with the tray in a crop; the quiet-rung tab word at 4.5:1.
3. VOICE — four tab words + the inside row names in ONE tuple (ROW 1/2/3 at four cells); the tab word's rung vs the row tape's.
4. REACH — every option row and every act reachable in ≤2 taps from the playing view; the tab count from `level`'s 3 taps today.
5. HIDDEN TRAYS — `access.spec.ts` 2.1/2.2 against the three hidden trays (inert, not tabbable); `a11y.spec.ts`'s tablist rows; what a screen reader hears at the strip.
6. THE FLOOR — the bar as the floor drawn as one piece with the lid: R7 I2 green (nothing buried); its stroke 2.5 against the case's 3; sticky is moot — prove it at 900×500.
7. ONE TOOL HOME — `undo · redo · hint · controls` on the tongue strip: fits at 390 (274px free), 844×390 and 900×500; the strip must not read as a second toolbar; every act's tap count.
8. CONFIRM + THE 390 SEAM — the ribbon replacing the strip row while armed: R7 I4 green; `keep` restores focus to the armed verb (M19); the seam cure you choose (sheet cap · masthead band · stroke) measured at 390/375/430.

## First runnable prototype

Overlay-first: `addStyleTag` hiding all but one `.tray-well` (CSS `display: none` on the others), the four tapes/tongues floated to the case's top edge by DOM patch with `role="tablist"` and a roving `tabindex` script (~40 lines in `page.evaluate`), the floor as an injected pose-0 SVG. If the tablist cannot be driven honestly without template changes, write the ~80-line `GameControlPanel.vue` patch (`v-show` per tray keyed to the tablist) as a `.diff` and apply it ONLY in a throwaway worktree under the scratchpad. Measure (1)–(8); bank three crops (390 strip + tray; 900×500; 1280 rail with side tabs).

## Instruments (re-run unchanged; add rows beside them)

- `r0/r1-controls/probe/heading-voice.spec.ts` ROW 1 (one voice tuple) · ROW 2 (every group name a document heading) · ROW 3 (group title ÷ option ≥ 1.23) — RED at HEAD at 4 cells (desk 1280×800, dock 390×844 × chromium, webkit). Must green under your overlay without weakening a row.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I2 (the bar carries chrome of its own and covers no option group) · I3 (a pinned tape names a group ≥ half on screen at every scroll state) · I4 (every destructive verb asks before it acts on a dirty board) — RED at HEAD.
- `web/frontend/e2e/access.spec.ts` 2.1 (no control focuses into a ≥96% burial) · 2.2 (no covered control in the drawer subtree stays tabbable) · 2.3 (sublabel/chip text 4.5:1 light and dark) — run against your overlay on your own config.
- The 44×44 floor with a per-dimension negative control on every tab/target you re-cut (precedent: `e2e/zone-grammar.spec.ts`'s pair-branch row).
- Content height vs scrollport at 390×844, 900×500 (sheet up, settled) and 1280×800, before and after.

## Kill conditions and risk

- Four of five groups hidden at rest is the formation's own "0×0 until discovered" defect generalised; the drawn tab names are the only argument against it, and the desk rail loses its at-a-glance read of every setting. Say plainly what a reader loses.
- A fifth compartment does not fit in 358px at 44px per tab.
- Tabs on the rail's left flank widen the row and walk the board 3px into `cell-light` / `grid-corner-light` (two committed goldens; the iPad coarse seal had 0.23px of headroom).
- This is the largest mechanics debt in the section: W2's sticky mechanics have no job and the Teleport ribbon berth retires. Name every W2 surface you orphan.
- Arm (b) must show that a tape lying flat on a surface is not a tab (tabs stick out or they are not tabs); arm (a) must show four tongues do not read as four drawers.

## Census ground (read before designing)

- `r0/r1-controls/README.md` (+ `census-*.json`, `chrome2-*.json`, `structural-map-*.txt`, `born-red-head.txt`): three heading voices (Fraunces 25.89/800 · Patrick Hand 14.05/500 washi tag · Patrick Hand 14.05/400 zone caption at 68%); 2 of 8 names are document headings; phone ratio heading/option 1.0175 vs desk 1.294; seven button treatments; five radii; one drawn border (`.info-glyph`); no authored focus ring (chromium 1px auto / webkit 3px auto); hover fill 2.9 lightness points; the bar has no edge and is not sticky at <1024 landscape; tap counts (level = 3 taps; the `i` crib unreachable on touch); 274px free on the board's bottom edge; the card overflows at every cell (43% desk / 58% landscape below the fold).
- `r0/r7-owners-eye/r7-owners-eye.md` (+ frames, `instruments/readings-at-head.json`): the bar lays over 89.6% of the players well (23,585px²); only `new game` ever pins and at three of five desk scroll states its group is under half on screen; the 390 case-stroke/wordmark seam (−2.73/−3.02px) and 375's 5.5px margin; Deal/Clear arm `sure?`, Fill writes 52–57 cells on one tap, Solve neither; M13 untouched (the tongue is the only control at 844×390); the masthead-to-board gap is 4.4px at 900 and at 390.
- `r0/r6-idiom-history/R6-census.md`: the 48-row law list (one box grammar = HandDrawnOutline; text never boils; one hover affordance per interactive text surface; washi is neutral; the type ladder is √φ and a role reads a rung; casing is CSS only; the role seam `--type-act/verb/tool/tag/group-title` landed computed-identical at W2 §2.6 so a voice re-cut is one right-hand side per role).
- `web/frontend/src/assets/typography.css:98-170` (the role tokens and W2's "THE NUMBERS ARE W7'S" comment), `web/frontend/src/games/shared/GameControlPanel.vue` (the card), `src/pencil/sheet/SheetWashiLabel.vue` (the tape), `src/games/shared/DrawerTab.vue` (the tongue), `src/games/shared/scene.css` (dock/sheet/ribbon keys).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-TABS/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-TABS/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4232 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
