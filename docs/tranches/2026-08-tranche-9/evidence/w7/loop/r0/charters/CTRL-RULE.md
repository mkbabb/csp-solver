# PASS-1 CHARTER · CTRL-RULE · The ruled page

Section: §10 the controls system, with §1 §2 §8 §14 §15 inside it · marks M01 M03 M04 M05 M12 M13
Lane port: 127.0.0.1:4231
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-RULE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The compartment dies. The card is a ruled page: delineation is ONE drawn graphite rule
between groups, in pencil geometry (a draw-on path at `--ink-press-rule`, wobbled like
every other rule on the page), never a CSS hairline. Every group name is set in one voice
at one fixed rung on every viewport, and rank below the name is carried by ink weight
alone. Nothing nests, nothing is hidden on any pose: the mobile tabs die because `size`
and `level` are simply two groups like the others (three chips each), so the 0×0 inactive
panel is cured by not hiding anything and `level` drops from three taps to two. Acts are
the ONLY boxed things (a pose-0 outline at stroke 2; the guard-ribbon precedent, zero
filters); `.info-glyph` loses its border; options are bare words with the seeded scribble
for the chosen one; hover is the ink lift. The bar's border (M04) is one drawn TOP RULE,
the page's foot margin, sticky in all three scrollports, with the last group ending above
it by reserved padding so the 89.6% overlap is cured as a layout row.

The family's research fork is WHERE THE NAME SITS, and it must be tested both ways:
(a) ABOVE its content, sitting on its rule — a section header; sticky by the push law
(each group its own containing block, header `sticky; top: 0`, the next header pushes the
previous off); no group taller than ~200px so the "5% on screen" state cannot occur;
(b) BESIDE its content, in a left margin column — a two-column card `[name]
clamp(88px, 22%, 132px) [field] 1fr`, so the name never leaves its own content and sticky
becomes unnecessary rather than fixed. The name's face and rung are the family's to pick
(one voice at one rung is the law; which voice is a finding), but the same tuple must
hold at 390 and 1280.

The confirm (§15) has two candidate faces inside this family; test both: the guard
ribbon lifted from the gallery (`GameGallery.vue:1003-1065`) into the bar's one note
berth (W2 §2.5's `.berth-note` seam), `clear this board?` / `keep · clear`, the
destructive face stroked and worded in `--color-red-ink`; or the armed verb keeping its
box and its place, the word inside becoming `sure?` with a bare `no` beside it in the
same band, so nothing reflows. Either way one mechanism serves deal · clear · fill ·
solve. The quick set (§14): the between-moves set — `hint` and the pencil MODE (a chip
that steps `normal → corner → center` showing the current word; the deepest well's
most-changed setting); never `deal` or `clear`; `fill` only if it carries its guard. In
landscape the ribbon turns on as a vertical strip on the left flank (a media-key re-cut of
`scene.css:394`). The 390 seam: the masthead's own band (8px under the wordmark's box).

## Substrate on this tree (verify first, cite file:line)

- `GameControlPanel.vue:769, :952, :1006, :1042` the four `.tray-well`s and their `HandDrawnOutline`s (retire); :826, :789 the two `<h2>`s; :959, :980 the two `.zone-row-label`s; :841-848 the inactive panel's `display: none`; :2284 the zone disclosure's `grid-template-rows` tween (the product's only layout animation — say what happens to it).
- `typography.css:133-137` `--type-group-title`'s two arms — this family drops the 768 arm (one right-hand side); :146-168 `--type-option`.
- The rule primitive: `pencil-draw-on` geometry (`pathLength="1"`, `--draw-dur`) as the board's rules use it, or `scribbleUnderline.ts`'s seeded generator as a static data-URI; `--ink-press-rule` 55% = 3.53:1 light (non-text AA), already `.info-glyph`'s weight. Confirm no live filter is involved and `filterBudget` reads 9 on the overlay.
- `GameGallery.vue:1003-1065, :1395-1465` the guard ribbon (`<Transition name="guard-ribbon">`, faces pose-0 at 2 and 2.5, twice owner-passed); `GameControlPanel.vue:506-566` the Deal/Clear two-tap arms.
- `GameControlPanel.vue:2096-2104, :2173` `.action-bar` and its sticky key; `scene.css:394, :551` the ribbon's display keys; `scene.css:466` the landscape dock.
- W2 §2.5's note berth (`.berth-note`), W2 §2.6's sticky tag (`SheetWashiLabel.vue:164-181`): this family retires the tag as a NAME; say what the tape is still for (hover and `center` tapes).

## What the family must answer

1. VOICE — the tuple (face · size · weight · transform) for the six-or-eight names and where it lands on the √φ ladder; ROW 1/2/3 at four cells. Do `new game` and `pencils` survive as names when there is no compartment to name (a page with `size · level · deal` under one rule reads how)? Count the names and defend the count.
2. NAME POSITION — arm (a) vs arm (b), measured: content height vs scrollport at 390×844, 900×500, 1280×800; the desk rail is 324px wide and a 88px margin at 390 leaves 278px for three 20px options — does the field wrap? R7 I3 at five scroll states under arm (a); under arm (b) show the name at visFrac 1.0 at every offset.
3. THE RULE — its wobble σ against the board's rules (R3's method), its draw-on cost at mount, its contrast (3:1 non-text on four grounds); a CSS hairline is a kill.
4. BUTTONS — the graded set applied to all seven censused controls; radii; the act outline's stroke against the case's 3 and the tongue's 2.5; the focus ring you choose, measured ≥3:1 on four grounds.
5. TABS DIE — the phone's card with `size` and `level` as two open groups: content height at 390×844 and 900×500; tap count for `level` (must be 2).
6. THE BAR — one top rule; R7 I2 green; sticky in the landscape scrollport; the reserved padding above it; the ribbon (if chosen) reachable while the bar's verbs are inert (`access.spec.ts` 2.2).
7. CONFIRM — both faces prototyped on `clear` and `fill`; zero layout shift for the in-place face (`getBoundingClientRect` before/after, Δ = 0 on four sides); R7 I4 green.
8. QUICK SET + THE 390 SEAM — the mode chip + hint on the tongue (fits 92×48? what does the tongue look like with a value word on it?); the masthead band's clearance at 390/375/430 ≥ two stroke widths at 375; the masthead-to-board gap you leave.

## First runnable prototype

The overlay rig on your dev server, both engines, 390×844 / 900×500 / 1280×800: `.tray-well .outline-svg, .washi-tag { display: none }`; the rung re-point; a `::before` rule under (or beside) each name from a static data-URI wobble line (one seed per name); `.mobile-heading-row { display: none }` with both `OptionSelector`s shown; arm (b) as a `display: grid` on the card with the names moved into column 1 by DOM patch; the act outline as an injected pose-0 SVG; the bar's top rule; both confirm faces by DOM patch. Re-run ROW 1/2/3, R7 I2/I3/I4, `access.spec.ts` 2.1/2.2 against the overlay; bank the 1440 rail at scrollTop 500 beside R7's `p7`, and the 390 sheet.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r1-controls/probe/heading-voice.spec.ts` ROW 1 (one voice tuple) · ROW 2 (every group name a document heading) · ROW 3 (group title ÷ option ≥ 1.23) — RED at HEAD at 4 cells (desk 1280×800, dock 390×844 × chromium, webkit). Must green under your overlay without weakening a row.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I2 (the bar carries chrome of its own and covers no option group) · I3 (a pinned tape names a group ≥ half on screen at every scroll state) · I4 (every destructive verb asks before it acts on a dirty board) — RED at HEAD.
- `web/frontend/e2e/access.spec.ts` 2.1 (no control focuses into a ≥96% burial) · 2.2 (no covered control in the drawer subtree stays tabbable) · 2.3 (sublabel/chip text 4.5:1 light and dark) — run against your overlay on your own config.
- The 44×44 floor with a per-dimension negative control on every tab/target you re-cut (precedent: `e2e/zone-grammar.spec.ts`'s pair-branch row).
- Content height vs scrollport at 390×844, 900×500 (sheet up, settled) and 1280×800, before and after.

## Kill conditions and risk

- HEIGHT is the kill: six-to-eight headings at a heading rung in a 324px rail add ~6×(26 + rule) to a card already 43% below the fold; if the only cure is names BESIDE chips at ≥1024, that is arm (b) and the family must say so rather than ship a split grammar (B6 fired against split grammars).
- WIDTH is arm (b)'s kill: if the margin must collapse on the phone, arm (b) has collapsed into a pure type law and you must say so.
- The broadsheet tell (hairline rules, zero radius, dense columns) and the settings-form tell (label column | field column) are both one step from this family; the rule must be visibly pencil and the margin must read as a worksheet's margin. Show it in a crop, then measure it.
- The ribbon under the bar must be reachable while the bar's verbs are inert; the in-place face must not push the band's height.

## Census ground (read before designing)

- `r0/r1-controls/README.md` (+ `census-*.json`, `chrome2-*.json`, `structural-map-*.txt`, `born-red-head.txt`): three heading voices (Fraunces 25.89/800 · Patrick Hand 14.05/500 washi tag · Patrick Hand 14.05/400 zone caption at 68%); 2 of 8 names are document headings; phone ratio heading/option 1.0175 vs desk 1.294; seven button treatments; five radii; one drawn border (`.info-glyph`); no authored focus ring (chromium 1px auto / webkit 3px auto); hover fill 2.9 lightness points; the bar has no edge and is not sticky at <1024 landscape; tap counts (level = 3 taps; the `i` crib unreachable on touch); 274px free on the board's bottom edge; the card overflows at every cell (43% desk / 58% landscape below the fold).
- `r0/r7-owners-eye/r7-owners-eye.md` (+ frames, `instruments/readings-at-head.json`): the bar lays over 89.6% of the players well (23,585px²); only `new game` ever pins and at three of five desk scroll states its group is under half on screen; the 390 case-stroke/wordmark seam (−2.73/−3.02px) and 375's 5.5px margin; Deal/Clear arm `sure?`, Fill writes 52–57 cells on one tap, Solve neither; M13 untouched (the tongue is the only control at 844×390); the masthead-to-board gap is 4.4px at 900 and at 390.
- `r0/r6-idiom-history/R6-census.md`: the 48-row law list (one box grammar = HandDrawnOutline; text never boils; one hover affordance per interactive text surface; washi is neutral; the type ladder is √φ and a role reads a rung; casing is CSS only; the role seam `--type-act/verb/tool/tag/group-title` landed computed-identical at W2 §2.6 so a voice re-cut is one right-hand side per role).
- `web/frontend/src/assets/typography.css:98-170` (the role tokens and W2's "THE NUMBERS ARE W7'S" comment), `web/frontend/src/games/shared/GameControlPanel.vue` (the card), `src/pencil/sheet/SheetWashiLabel.vue` (the tape), `src/games/shared/DrawerTab.vue` (the tongue), `src/games/shared/scene.css` (dock/sheet/ribbon keys).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-RULE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/CTRL-RULE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4231 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
