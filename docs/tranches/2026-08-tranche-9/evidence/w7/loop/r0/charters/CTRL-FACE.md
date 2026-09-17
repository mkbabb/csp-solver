# PASS-1 CHARTER · CTRL-FACE · Printed and written

Section: §10 with §1 §2 §8 inside it · a TYPE LAW with zero geometry · marks M01 M03 M05
Lane port: 127.0.0.1:4234
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-FACE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

One semantic law for the two faces, applied estate-wide: Fraunces is what the sheet came
PRINTED with; Patrick Hand is what a PENCIL put there. PRINTED (Fraunces 800 lowercase):
every group name — all eight, one voice, one rung — the act verbs, the board's printed
furniture. WRITTEN (Patrick Hand): every option value, sublabel, tally, slug, margin note,
the solver's answers, your digits. SIZE stops being the hierarchy device; the FACE is. §1
resolves without picking a number, because a printed name and the pencilled value under it
are never confusable even at the phone's 1.0175 ratio — and then the ratio is floored at
the desk's own shipped 1.294 because it costs nothing. §8: `size` and `level` are printed
names, so the CAD-straight `text-decoration` underline on the tab head retires and only
the chosen OPTION carries the seeded scribble (a pencil mark belongs under a pencilled
word), closing the two-underline-grammars-40px-apart defect. §2 rides along: a printed
word is never boxed, a written word is never boxed, the ONLY boxed things are acts — which
is also M04's answer (the bar holds acts, so the bar is drawn; the wells hold settings, so
they are not).

This family moves NO geometry. Do not design a layout. Its whole substance is which
`@utility` a node reads plus one right-hand side per role token, on the seam W2 §2.6
landed for exactly this. What the washi tape becomes once it no longer carries a name
(decoration beside a printed name, the printed name set on the tape, or the tape retired
to its hover/center jobs) is the family's research variable, and it must be answered
without moving the tape's box.

## Substrate on this tree (verify first, cite file:line)

- `typography.css:98-100` W2's own comment ("THE NUMBERS ARE W7'S … W7 re-cuts them HERE"); :106-170 the role tokens (`--type-act/verb/tool/tag/group-title`, `--type-option`'s width arms) all computed-identical today; the two `@utility` families for the faces. Verify with a computed-style read at 390 and 1280 which nodes read which utility.
- `index.css:15` and the P1-W3 ruling B2: Patrick Hand's cut has capitals {C, R, S} only; `.washi-tag` and `.icon-sublabel` are `lowercase` — the printed face's subset is cut from RENDERED text too. `scripts/check-font-coverage.mjs` is the guard; run it against the rendered strings your overlay produces (new letters in Fraunces are a re-cut).
- `GameControlPanel.vue:826, :789` the two Fraunces `<h2>`s (the voice's incumbent); :2414-2418 the tab head's `text-decoration` underline (retires); `OptionSelector.vue:123-126, :62-73` the seeded scribble (stays); :188-191 the tier tint on `level` derived from data (say whether a printed name carries a data tint).
- `SheetWashiLabel.vue:164-181` the sticky tag: unchanged mechanics; the family says what its literal is once the name is printed elsewhere (the one-string law: the tape IS the well's name via `aria-labelledby` — a second literal is forbidden).
- The masthead: `HandwrittenLogo.vue` is Fraunces 800 lowercase at the wordmark's size; eight names in the same voice sit 4.4px below it.

## What the family must answer

1. THE STYLESHEET — one injected sheet re-pointing the role tokens and the two utilities; R1's `heading-voice.spec.ts` UNCHANGED must green ROW 1 and ROW 3 at all four cells with no other change; ROW 2 (document headings) is W3's half — say what the sheet cannot do.
2. THE RATIO — `--type-group-title` at `--type-subheading` (<768) / `--type-heading` (≥768) = 20.35 / 25.89 and `--type-option` held at ≤ title ÷ 1.294 at every arm (15.7 / 20.0): measured, and what M01 loses if the phone chip drops from 20 to 15.7.
3. THE TAPE — its three futures prototyped and measured: which keeps the one-string law, which keeps net flow height zero, which the reader still reads as a name.
4. THE FONT — `check-font-coverage.mjs` on the overlay's rendered strings: the Fraunces subset's new letters and bytes; a lighter Fraunces weight for names (the "shouting" mitigation) priced as a second subset.
5. THE MASTHEAD — six-to-eight small copies of the wordmark's voice inside the card: does the masthead flatten? Show the head and the card in one crop at 390 and 1280; state what makes the wordmark still the wordmark (size alone?).
6. THE UNDERLINE — the tab head's `text-decoration` retired; the option's scribble kept; the `level` heading's data tint kept or dropped, with the reason.
7. THE BOX LAW — printed never boxed, written never boxed, acts boxed: list every censused control and its box under the law; the bar drawn (a pose-0 outline) and the wells not — R7 I2's chrome half; the radii that remain.
8. COMPOSABILITY — state explicitly which layout facts the family depends on (none is the claim) and prove it by running the same sheet at the shut dock, the open dock, the desk rail and 900×500.

## First runnable prototype

The cheapest in the wave: a Playwright run against your dev server injecting ONE stylesheet (the role-token re-point + the two utility re-points + the underline retirement), screenshotting the four crops the owner's Frames A/B show, and running R1's `heading-voice.spec.ts` unchanged; then `node scripts/check-font-coverage.mjs` against the rendered text. Both engines, 390×844 and 1280×800 (+ 900×500 for composability). Bank at most four crops.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r1-controls/probe/heading-voice.spec.ts` ROW 1 / ROW 3 unchanged — the family's pass/fail; ROW 2 recorded, not claimed.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I1 (one typographic voice at 1440×900) and I2's chrome half.
- `web/frontend/scripts/check-font-coverage.mjs` over the overlay's rendered strings.
- `web/frontend/e2e/access.spec.ts` 2.3 (text 4.5:1 light and dark) on the re-faced names.
- The 44×44 floor is untouched by this family; say so by measurement, not assumption.

## Kill conditions and risk

- Fraunces 800 lowercase at 14–20px is a display cut doing caption work; it may read as shouting inside a tape and it is the skill's own tell (a high-contrast serif display everywhere). The family survives only if the printed voice stays rare enough to read as a RANK; count the printed nodes on one screen and defend the count.
- The wordmark is the same face at the same weight: if six small copies flatten the masthead, a lighter weight is a second woff2 subset and its bytes are the price.
- A data tint on a printed name (the crayon-green `level`) is a fourth axis in one voice; decide it.
- The tape's new job must not mint a second literal for the well's name.

## Census ground (read before designing)

- `r0/r1-controls/README.md` (+ `census-*.json`, `chrome2-*.json`, `structural-map-*.txt`, `born-red-head.txt`): three heading voices (Fraunces 25.89/800 · Patrick Hand 14.05/500 washi tag · Patrick Hand 14.05/400 zone caption at 68%); 2 of 8 names are document headings; phone ratio heading/option 1.0175 vs desk 1.294; seven button treatments; five radii; one drawn border (`.info-glyph`); no authored focus ring (chromium 1px auto / webkit 3px auto); hover fill 2.9 lightness points; the bar has no edge and is not sticky at <1024 landscape; tap counts (level = 3 taps; the `i` crib unreachable on touch); 274px free on the board's bottom edge; the card overflows at every cell (43% desk / 58% landscape below the fold).
- `r0/r7-owners-eye/r7-owners-eye.md` (+ frames, `instruments/readings-at-head.json`): the bar lays over 89.6% of the players well (23,585px²); only `new game` ever pins and at three of five desk scroll states its group is under half on screen; the 390 case-stroke/wordmark seam (−2.73/−3.02px) and 375's 5.5px margin; Deal/Clear arm `sure?`, Fill writes 52–57 cells on one tap, Solve neither; M13 untouched (the tongue is the only control at 844×390); the masthead-to-board gap is 4.4px at 900 and at 390.
- `r0/r6-idiom-history/R6-census.md`: the 48-row law list (one box grammar = HandDrawnOutline; text never boils; one hover affordance per interactive text surface; washi is neutral; the type ladder is √φ and a role reads a rung; casing is CSS only; the role seam `--type-act/verb/tool/tag/group-title` landed computed-identical at W2 §2.6 so a voice re-cut is one right-hand side per role).
- `web/frontend/src/assets/typography.css:98-170` (the role tokens and W2's "THE NUMBERS ARE W7'S" comment), `web/frontend/src/games/shared/GameControlPanel.vue` (the card), `src/pencil/sheet/SheetWashiLabel.vue` (the tape), `src/games/shared/DrawerTab.vue` (the tongue), `src/games/shared/scene.css` (dock/sheet/ribbon keys).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-FACE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-FACE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4234 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
