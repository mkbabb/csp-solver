# PASS-1 CHARTER · MOT-VERB · The pencil verbs

Section: §13 the transition grammar · §7's exit · §12's motion half · marks M02 M09 (the design half)
Lane port: 127.0.0.1:4247
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-VERB/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Motion is named by what a HAND DOES ON PAPER, not by how long it takes. A CLOSED set of
verbs, each owning its whole tuple — duration, curve, properties, fill, PRM arm — lives
in `MOTION.verbs`, consumed by JS directly and published to CSS as a custom-property set,
both layers byte-identical; every animation in the product names one verb or is refused
by lint; a duration is a consequence of the verb, never a number a call site picks. The
drawer keeps its owner-ruled curve and duration as its verb's tuple, scope-fenced as it
already is. LIFT unifies the two declared twins (the chrome-leave and the deck's leave-
only dissolve) by construction — the erase asymmetry (`--ease-accelIn`) the laminate
already proves. The margin note's arrival is WRITE (250 ms, `--ease-noteWrite`); its
missing exit shows up as a verb with no implementation (RUB OUT), which is §7's hole made
visible. The dark toggle's eleven timing values collapse onto the set. Incidental easings
are ASSIGNED, never retuned.

The family's research fork is HOW MANY VERBS the closed set needs: four (LAY DOWN ·
LIFT · WRITE · DUSK) or six (LAY DOWN · LIFT · TURN · SLIDE · WRITE IN · RUB OUT). The
DARK TOGGLE is the closed-set test: a change of LIGHT over the whole page is not a lay-
down, a lift, a turn or a slide — either DUSK is a verb of its own (and its narrowed
selectors keep the +23.5 fps) or it is the one declared exception, and the set must say
which. The first prototype is on paper: R4's 35-row inventory assigned verb by verb, no
row needing one more. The gallery exit's board fold plays LAY DOWN once the restore
ordering (`App.vue:447`) is cured — a mechanism row this family notes and does not cure.

## Substrate on this tree (verify first, cite file:line)

- `pencilConfig.ts:121-199` MOTION (`curves.drawerGlide`; the covenant; the two-layer rule); `index.css:358` and the ten other `--ease-*` rows (`--ease-fadeOut`, `--ease-accelIn`, `--ease-noteWrite`, `--ease-drawOn`, `--ease-standard` …): read their consumers.
- `r0/r4-transition-grammar/census.md` §2 (the inventory: name · trigger · duration · curve · properties · HOME · PRM) — the paper prototype's rows; `data/r4-probe3.json` (every `animate()` call with keyframes) for the runnable half.
- `scene.css:617/:629` (chrome-leave, `--ease-fadeOut` 200) and `App.vue:1141-1142` (deck-leave, `--ease-glassGlide` 200) — LIFT's two consumers; `AnswerKeyLaminate.vue:237-238` (the laminate's lift, the asymmetry precedent).
- `MarginNote.vue:147-150, :180` (WRITE; no exit); `DarkModeToggle.vue:671-882` (eleven values; `:658` its PRM arm); `index.css:628-670` (the dusk's five selectors); `useTheme.ts:35`.
- `useControlsDrawer.ts:86, :423`; `useFlipGlide.ts`; `useCarouselGlide.ts:293` (the FLIP discipline every verb lands inside); `scripts/check-motion-contract.mjs`.

## What the family must answer

1. THE ASSIGNMENT TABLE — every one of R4's 35 named transitions AND the remaining shipped declarations (77 total) → one verb, with the tuple it inherits and the delta from what ships; the rows that resist named honestly.
2. THE COUNT — four or six: which rows force the fifth and sixth; whether the celebration's keyframes (squash, plush) are verbs or a declared class outside the set.
3. THE DARK TOGGLE — DUSK as a verb (tuple named; the narrowed selectors; six alternating flips at 4× on a built dist, +23.5 fps kept) or the one exception (cited); the eleven values collapsed with each mapped.
4. LIFT — implemented as one tuple over both twins by overlay; R4's animate-hook probe confirms one curve, one duration; `--ease-fadeOut` vs `--ease-accelIn`: which is LIFT's curve and why.
5. RUB OUT — the tuple defined (the write-in reversed? clip-path retreat?) and demonstrated over the live margin note by injection: text must not boil; PRM same-frame. Do not design the note's LIFE (which acts erase) — only the verb.
6. THE DRAWER — SLIDE / LAY DOWN keeps the owner-ruled tuple; the dock's throw under the same verb (per-pose duration allowed? say what the verb law permits).
7. LINT + PUBLISHER — `check-motion-contract.mjs` widened to 'every declaration names a verb'; `--verb-*` published from one place; i2/i3-B/I6 green; the exceptions ADMITTED with rulings.
8. THE FRAME TRACE — the 15 gestures at 390×844 on a built dist before/after: no new long frame; nothing shortened as a fix.

## First runnable prototype

On paper first (the assignment table in your README); then a `.diff` (MOTION.verbs + the publisher + LIFT over both twins + RUB OUT on `MarginNote.vue` + DUSK's tuple if a verb) applied only in a throwaway worktree under the scratchpad, built and served on your port; R4's instruments and probes; the six-flip trace. Zero frames.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r4-transition-grammar/instruments/i2-incidental-transition-census.mjs` — every shipped `transition:` carries a `var(--ease-*)` token; RED at HEAD (16 incidental). Must green under your family's overlay/diff, or the family says which sites it leaves and why.
- `r0/r4-transition-grammar/instruments/i3-glass-curve-home.mjs` — A: `MOTION.curves.drawerGlide` byte-identical to `--ease-glassGlide` (GREEN, must stay); B: every duration spent on the glass curve resolves to a MOTION constant (RED: 6 durations, 8 homeless sites).
- `r0/r4-transition-grammar/instruments/i1-exit-fold-plays.mjs` — the exit's board mover observed running (RED at HEAD, three-for-three). Do NOT cure it; record that your family assumes it cured and note any curve you would give it.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I6 — every transition duration is a named decision (RED: 35 literals vs 4 named).
- `r0/r4-transition-grammar/data/*.mjs` — the frame-trace, animate-hook and playback probes: re-run the 390×844 frame trace against a BUILT dist (`npm run build` into your scratchpad, served on your port) before and after; a re-timing that costs a long frame has bought nothing. Six alternating theme flips at 4× if the dusk moves.
- `npm run lint:motion` (`check-motion-contract.mjs`) on any `.diff` you write; the PRM arm for every gesture you touch, proven by `prefers-reduced-motion` emulation.
- The π-guard: no bake dropped, no boil thinned, no transition shortened as a "fix" (W8 QUALITY LAW).

## Kill conditions and risk

- Taxonomies grow; if the dark toggle, the boil beat or the celebration need verbs of their own, the closed set was never closed — say it.
- DUSK as a verb re-enables a page tween that P1-W3 killed for +23.5 fps; W8 must prove it on device, and this lane must prove it on the built dist.
- The glass curve serves six durations and three jobs today; one verb per job may leave a job with no verb.

## Census ground (read before designing)

- `r0/r4-transition-grammar/census.md` (+ `data/r4-frames-1x.json`, `r4-frames-4x.json`, `r4-probe2-4x.json`, `r4-probe3.json`, `r4-probe4*.json`): MOTION exposes four durations (beatMs 125, cardStepMs 440, boardFoldMs 520, chromeLeaveMs 200) and one curve; 73 live declarations, 28 distinct literal durations, exactly ONE duration reaches CSS from config (`--card-step-ms`); the glass curve is spent at 200/240/280/320/440/520 with eight homeless call sites; 16 of 39 `transition:` declarations carry no `--ease-*` token (the dusk at `index.css:667` among them); `GLIDE_MS = 520` is a module literal at `useControlsDrawer.ts:86`; the dock rides ONE compositor mover (translate ±628px, 520 ms glass) with zero frames >33 ms at 1× locally; the first dark toggle is a cold bake (145.7 ms at 1×, 247.8 at 4×; theme-keyed rasterPose caches at `HandwrittenLogo.vue:343`, `HandDrawnGrid.vue:216`); the first card step is a cold bake too; two declared twins ride two curves (chrome-leave `--ease-fadeOut` at `scene.css:617/:629`, deck-leave `--ease-glassGlide` at `App.vue:1142`); the only layout animation is the zone disclosure (`GameControlPanel.vue:2284`); `transition: all` leaks `visibility` during the drawer gesture (`:2082`); three user-visible transitions have no PRM arm (`DrawerTab.vue:144`, `CrayonHeart.vue:329`, `SheetWashiLabel.vue:109`); the dark toggle spends eleven timing values; THE GALLERY EXIT'S BOARD FOLD DOES NOT PLAY (`App.vue:447 restoreBoardAnims` finishes the host's own mover) — a MECHANISM row, assumed cured before any curve is judged.
- `r0/r7-owners-eye/r7-owners-eye.md` M09: 77 declarations spell 35 distinct literal durations against 4 named; `useTheme.ts:35` `disableTransition: true` kills the dusk (its comment: narrow the 46 tweening selectors, never re-blanket); the drawer trace acquits nothing (real-iOS law binds).
- `r0/r6-idiom-history/R6-census.md`: the drawer curve `cubic-bezier(0.32, 0.72, 0, 1)` @ 520 ms is the owner's ruling (audit 4) and no other surface re-eases under it; the two-layer easing partition by CONSUMER (TS `MOTION.curves` vs CSS `--ease-*`, the glass curve byte-identical in both); no timing constant outside pencilConfig; every verb fills `backwards`; one shared beat at 125 ms; PRM collapses every named gesture to a same-frame swap; `transition: none` under PRM must not be blanketed back (the +23.5 fps of `disableTransition` stands; the dusk's five narrowed selectors at `index.css:628-670` out-rank it).
- `web/frontend/src/pencil/config/pencilConfig.ts:121-199` (MOTION, the covenant at :149, the two-layer rule at :164-181); `src/assets/index.css:358, :628-670` (`--ease-*`, the dusk); `src/games/shared/useControlsDrawer.ts:14-27, :86, :277, :423`; `src/pencil/chrome/GameGallery/GameGallery.vue:930, :1474-1475`; `src/App.vue:447, :612, :633-639, :1141-1142`; `src/pencil/celestial/DarkModeToggle.vue:658, :671-882`; `src/pencil/chrome/MarginNote.vue:147-150, :180`; `web/frontend/scripts/check-motion-contract.mjs` (`npm run lint:motion`, the PRM-declaration gate).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-VERB/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-VERB/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4247 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
