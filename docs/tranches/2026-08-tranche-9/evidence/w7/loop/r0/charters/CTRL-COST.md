# PASS-1 CHARTER · CTRL-COST · The consequence ladder

Section: §10 the controls system, with §15 at its centre; §1 §2 §8 §14 inside it · marks M01 M03 M04 M05 M12 M13
Lane port: 127.0.0.1:4233
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-COST/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The card is ordered and drawn by WHAT AN ACT COSTS, not by topic. Three tiers replace
five compartments: `looking` (changes only what you see: marks · what fits · checking ·
size · level), `writing` (changes the board reversibly: hint · fill · undo · redo, all on
W1's widened undo spine), `starting over` (throws the board away: deal · clear, both
guarded). Weight tracks consequence: tier 1 = a bare word, no box, the chosen option on
the seeded scribble; tier 2 = `HandDrawnOutline :pose="0"` at stroke 2; tier 3 = the same
outline at stroke 2.5 (the guard ribbon's own leave-verb weight, twice owner-passed) with
a reserved second line inside the band. The eight-node heading census collapses at the
source: three band names, one voice.

The confirm (§15) is this family's centre, not an appendix: tier-3 controls are laid out
at their ARMED size from the start, so arming swaps the words inside a box that never
moves (`deal` → `sure?` with a bare `no` beside it) and M12's "simply, without contrivance
or large modals" is satisfied by nothing appearing. The bar (M04) is answered by
DELETION: `clear` leaves it for tier 3, `fill` and `solve` go to tier 2, `share` is not a
board act and moves beside the players' acts — there is no orphan strip left to give a
border to. The quick set (§14): tier-2 acts only, by law; never a tier-3 act one tap from
a tool. The mobile tabs (§8) die because `size` and `level` are two tier-1 rows.

## Substrate on this tree (verify first, cite file:line)

- `GameControlPanel.vue:506-530, :542-566` the Deal/Clear two-tap arms (coarse + dirty), `:517-533, :552-567` W1 §1.5's arm; R7 I4's reading (Fill writes 52–57 cells with no arm; Solve neither arms nor writes in 4 s) — the family guards fill and solve as tier 2 by UNDO, not by asking: verify that `fill` and `solve` are on the undo spine on this tree (`useGameState.ts`, the W1 §1.4 widen) and say what "reversible" means for solve.
- Verify `size` and `level` are a STAGED ask (R1: they caption a staged ask that `deal` commits) in every flow, including the gallery's card step and `?s=` joins; if changing level deals a board anywhere, tier 1 must shed them.
- `GameGallery.vue:1395-1465` the guard ribbon's leave-verb weight (2.5) and its colourless chrome (R2: zero chromatic content on the armed guard; `--color-red-ink` exists).
- `GameControlPanel.vue:2096-2104, :2173` `.action-bar` (deleted by this family: say what the sticky key, the `::after` skirt and the z-ladder rung 60 leave behind); `:1382-1430` `#fold-tools` (undo/redo/hint/peek in the portrait ribbon — are they tier 2's home on the phone?).
- `typography.css:119-124` role tokens for the three band names.

## What the family must answer

1. THE TAXONOMY — every one of the censused acts and options placed in a tier with its reason; the `size`/`level` honesty check; where `share`, `peek`, `play together` and `leave` land; whether the tiers are three or four.
2. VOICE — three band names in one tuple; ROW 1/2/3 at four cells (ROW 2: three document headings); the names' font re-cut priced (`looking` / `writing` / `starting over` are new rendered strings).
3. ZERO REFLOW — `getBoundingClientRect` on the tier-3 band before/after arming, Δ = 0 on four sides, both engines, 390 and 1280; the armed word's 4.5:1 in red-ink; disarm on any other tap or after 4 s (the accepted grammar) or state a different rule.
4. R7 I4 GREEN — on a dirty board, one tap on deal/clear writes 0; fill and solve write and are undoable in one press (prove the undo).
5. HEIGHT — content vs scrollport at 390×844, 900×500, 1280×800: does cost-ordering shorten the card (58% below the fold at 900×500 today)? Does the desk rail still read every setting at a glance?
6. THE BAR DELETED — what the phone's shut-sheet pose shows (the ribbon's four acts stay?); the sticky key's landscape hole becomes moot — prove nothing is unreachable at 844×390 and 900×500.
7. QUICK SET — tier-2 acts on the tongue (which two or three? by use); the landscape rescue; every act's tap count.
8. BUTTONS + THE 390 SEAM — the weight ladder applied to all seven censused controls (stroke 0 / 2 / 2.5; radii stated; hover = ink lift; the focus ring you choose at 3:1); the seam cure you choose measured at 390/375/430.

## First runnable prototype

A static page under your evidence dir rendering the three tiers with the product's real control set and live arm/disarm on `deal` and `clear` (and the tier-2 undo on `fill`), at 390×844 and 1280×800, served on your port and measured on your scratch config; plus an overlay on the live app re-grouping the existing controls by DOM patch to read height and tap counts honestly. Probes: (3) zero layout shift; (4) I4; (5) height; bank two crops (390 armed vs resting; 1280 rail).

## Instruments (re-run unchanged; add rows beside them)

- `r0/r1-controls/probe/heading-voice.spec.ts` ROW 1 (one voice tuple) · ROW 2 (every group name a document heading) · ROW 3 (group title ÷ option ≥ 1.23) — RED at HEAD at 4 cells (desk 1280×800, dock 390×844 × chromium, webkit). Must green under your overlay without weakening a row.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I2 (the bar carries chrome of its own and covers no option group) · I3 (a pinned tape names a group ≥ half on screen at every scroll state) · I4 (every destructive verb asks before it acts on a dirty board) — RED at HEAD.
- `web/frontend/e2e/access.spec.ts` 2.1 (no control focuses into a ≥96% burial) · 2.2 (no covered control in the drawer subtree stays tabbable) · 2.3 (sublabel/chip text 4.5:1 light and dark) — run against your overlay on your own config.
- The 44×44 floor with a per-dimension negative control on every tab/target you re-cut (precedent: `e2e/zone-grammar.spec.ts`'s pair-branch row).
- Content height vs scrollport at 390×844, 900×500 (sheet up, settled) and 1280×800, before and after.

## Kill conditions and risk

- It re-sorts a taxonomy the owner has read for four tranches. The desk rail's value is the at-a-glance state of every setting; if cost-ordering scatters the settings' states, say so.
- If `level` deals a board in any flow, tier 1 is a lie and the ladder is four tiers.
- Reserving a second line inside tier 3 at rest spends height on every pose to save a reflow on one act; measure what it costs at 390.
- "Reversible by undo" is a claim about W1's spine: if `solve` is not one undo away, it is not tier 2.

## Census ground (read before designing)

- `r0/r1-controls/README.md` (+ `census-*.json`, `chrome2-*.json`, `structural-map-*.txt`, `born-red-head.txt`): three heading voices (Fraunces 25.89/800 · Patrick Hand 14.05/500 washi tag · Patrick Hand 14.05/400 zone caption at 68%); 2 of 8 names are document headings; phone ratio heading/option 1.0175 vs desk 1.294; seven button treatments; five radii; one drawn border (`.info-glyph`); no authored focus ring (chromium 1px auto / webkit 3px auto); hover fill 2.9 lightness points; the bar has no edge and is not sticky at <1024 landscape; tap counts (level = 3 taps; the `i` crib unreachable on touch); 274px free on the board's bottom edge; the card overflows at every cell (43% desk / 58% landscape below the fold).
- `r0/r7-owners-eye/r7-owners-eye.md` (+ frames, `instruments/readings-at-head.json`): the bar lays over 89.6% of the players well (23,585px²); only `new game` ever pins and at three of five desk scroll states its group is under half on screen; the 390 case-stroke/wordmark seam (−2.73/−3.02px) and 375's 5.5px margin; Deal/Clear arm `sure?`, Fill writes 52–57 cells on one tap, Solve neither; M13 untouched (the tongue is the only control at 844×390); the masthead-to-board gap is 4.4px at 900 and at 390.
- `r0/r6-idiom-history/R6-census.md`: the 48-row law list (one box grammar = HandDrawnOutline; text never boils; one hover affordance per interactive text surface; washi is neutral; the type ladder is √φ and a role reads a rung; casing is CSS only; the role seam `--type-act/verb/tool/tag/group-title` landed computed-identical at W2 §2.6 so a voice re-cut is one right-hand side per role).
- `web/frontend/src/assets/typography.css:98-170` (the role tokens and W2's "THE NUMBERS ARE W7'S" comment), `web/frontend/src/games/shared/GameControlPanel.vue` (the card), `src/pencil/sheet/SheetWashiLabel.vue` (the tape), `src/games/shared/DrawerTab.vue` (the tongue), `src/games/shared/scene.css` (dock/sheet/ribbon keys).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-COST/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-COST/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4233 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
