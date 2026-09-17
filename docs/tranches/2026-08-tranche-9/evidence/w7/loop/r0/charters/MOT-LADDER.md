# PASS-1 CHARTER · MOT-LADDER · The duration ladder

Section: §13 the transition grammar · §12's motion half · marks M02 M09 (the design half)
Lane port: 127.0.0.1:4246
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-LADDER/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

MOTION gains a named DURATION LADDER — a short closed set of LENGTHS, not meanings —
and every shipped transition and animation reads a rung; what a rung is used for is the
call site's business. Durations reach CSS as `--motion-*` (or `--dur-*`) from ONE
publisher, lifted from the `--card-step-ms` precedent to the App root, byte-identical to
the TS side the way the glass curve already lives in both layers. `GLIDE_MS = 520` leaves
`useControlsDrawer.ts` for MOTION as the named drawer duration (R4's open question
answered). The 16 incidental easings take a `--ease-*` token; `transition: all` is banned
by lint; the two declared twins ride one curve (G7 → `--ease-fadeOut`); the three
PRM-less files are armed; the dusk (350 ms on a bare `ease`, disabled by `useTheme`'s
`disableTransition`) is homed without re-blanketing the page (its five narrowed selectors
keep the +23.5 fps). A static gate in the shape of the estate's existing gates is written
FIRST and run at HEAD: it must be RED at the count R7 measured (35 distinct literals vs 4
named), and green when the ladder lands.

The family's research fork is WHAT THE RUNGS ARE: (a) the shipped, owner-ruled numbers
named — whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520 — so nothing
the owner ruled moves; or (b) whole multiples of the shared 125 ms beat — tick 125 · note
250 · step 375 · throw 500 · settle 750 — with the owner-ruled 520 (drawer) and 440 (card
step) carried as cited exceptions, or moved (which this wave has no standing to do).
Measure what quantisation buys (a law with a reason) and what it costs (a ladder whose two
most-visible rungs are exceptions).

## Substrate on this tree (verify first, cite file:line)

- `pencilConfig.ts:121-199` MOTION (four durations, one curve; the covenant at :149; the two-layer rule :164-181); `GameGallery.vue:930` / `GameCard.vue:411` the one duration published to CSS; `useControlsDrawer.ts:86` GLIDE_MS.
- `r0/r4-transition-grammar/census.md` §2 (the 35-row inventory) and §5 (the 16 incidental sites verbatim); `r0/r7-owners-eye` M09 (35 distinct literals across 77 declarations).
- `index.css:358` (`--ease-glassGlide`), `:628-670` (the dusk's narrowed selectors), `:667` (the dusk's bare `ease`); `useTheme.ts:35` `disableTransition: true` and its comment.
- `scene.css:617/:629` and `App.vue:1142` (the twins); `GameControlPanel.vue:2082` (`transition: all`), `:2284` (the layout tween); `DrawerTab.vue:144`, `CrayonHeart.vue:329`, `SheetWashiLabel.vue:109` (no PRM arm).
- `scripts/check-motion-contract.mjs` (the gate to widen, or the shape to copy); `App.vue:447` (the dead exit mover — a mechanism row; note it, don't cure it).

## What the family must answer

1. THE GATE FIRST — `check-motion-bands.mjs` (or a widened `check-motion-contract.mjs`) under your evidence dir, run at HEAD: RED with the measured count; its ADMITTED shape with a cited ruling per exception.
2. THE RUNGS — arm (a) vs arm (b): the full assignment table (every one of the 77 declarations → a rung, both layers), with the exceptions listed and their rulings cited; how many literals each arm leaves.
3. THE PUBLISHER — one place writes `--motion-*`; TS and CSS byte-identical; i3-A stays green; i3-B and i2 green; I6 green.
4. THE DRAWER — GLIDE_MS into MOTION; the dock's 628px throw inherits the rung or gets a per-pose rung (allowed: one engine, per-pose durations; not allowed: a second engine or a re-eased curve).
5. THE DUSK — homed at its rung on a house curve; the five narrowed selectors kept; six alternating theme flips at 4× on a built dist: the first-flip cold bake unchanged (it is W8's), later flips within noise; PRM.
6. THE TWINS + `transition: all` — one curve for chrome-leave and deck-leave; the `.sparkle-icon` site narrowed to the properties that move (which?); the zone disclosure's `grid-template-rows` tween: keep, re-home, or name as the one layout tween.
7. PRM ARMS — the three files armed; every gesture you touch collapses to a same-frame swap under emulation.
8. THE FRAME TRACE — 390×844 against a built dist before/after, 15 gestures (R4's rig): no new long frame; nothing shortened as a fix (the QUALITY LAW).

## First runnable prototype

A `.diff` under your evidence dir (MOTION rungs + publisher + the 16 re-pointed sites + GLIDE_MS + the twins + PRM arms) applied only in a throwaway worktree under the scratchpad, built there, served on your port; the gate run at HEAD (this tree, read-only) and on the worktree; R4's i2/i3, R7's I6, the frame trace and the six-flip theme trace on the built dist. Zero frames.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r4-transition-grammar/instruments/i2-incidental-transition-census.mjs` — every shipped `transition:` carries a `var(--ease-*)` token; RED at HEAD (16 incidental). Must green under your family's overlay/diff, or the family says which sites it leaves and why.
- `r0/r4-transition-grammar/instruments/i3-glass-curve-home.mjs` — A: `MOTION.curves.drawerGlide` byte-identical to `--ease-glassGlide` (GREEN, must stay); B: every duration spent on the glass curve resolves to a MOTION constant (RED: 6 durations, 8 homeless sites).
- `r0/r4-transition-grammar/instruments/i1-exit-fold-plays.mjs` — the exit's board mover observed running (RED at HEAD, three-for-three). Do NOT cure it; record that your family assumes it cured and note any curve you would give it.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I6 — every transition duration is a named decision (RED: 35 literals vs 4 named).
- `r0/r4-transition-grammar/data/*.mjs` — the frame-trace, animate-hook and playback probes: re-run the 390×844 frame trace against a BUILT dist (`npm run build` into your scratchpad, served on your port) before and after; a re-timing that costs a long frame has bought nothing. Six alternating theme flips at 4× if the dusk moves.
- `npm run lint:motion` (`check-motion-contract.mjs`) on any `.diff` you write; the PRM arm for every gesture you touch, proven by `prefers-reduced-motion` emulation.
- The π-guard: no bake dropped, no boil thinned, no transition shortened as a "fix" (W8 QUALITY LAW).

## Kill conditions and risk

- Naming moves nothing the owner SEES; M09 is smoothness on a device (W8's), and the family must say plainly what the owner's eye gains.
- Arm (b) carries permanent exceptions at its two most-visible values; a ladder read mostly through its exceptions is a weak law.
- Re-homing the dusk re-opens the P1-W3 cure unless the tween set stays the five narrowed selectors; prove the fps on the built dist.

## Census ground (read before designing)

- `r0/r4-transition-grammar/census.md` (+ `data/r4-frames-1x.json`, `r4-frames-4x.json`, `r4-probe2-4x.json`, `r4-probe3.json`, `r4-probe4*.json`): MOTION exposes four durations (beatMs 125, cardStepMs 440, boardFoldMs 520, chromeLeaveMs 200) and one curve; 73 live declarations, 28 distinct literal durations, exactly ONE duration reaches CSS from config (`--card-step-ms`); the glass curve is spent at 200/240/280/320/440/520 with eight homeless call sites; 16 of 39 `transition:` declarations carry no `--ease-*` token (the dusk at `index.css:667` among them); `GLIDE_MS = 520` is a module literal at `useControlsDrawer.ts:86`; the dock rides ONE compositor mover (translate ±628px, 520 ms glass) with zero frames >33 ms at 1× locally; the first dark toggle is a cold bake (145.7 ms at 1×, 247.8 at 4×; theme-keyed rasterPose caches at `HandwrittenLogo.vue:343`, `HandDrawnGrid.vue:216`); the first card step is a cold bake too; two declared twins ride two curves (chrome-leave `--ease-fadeOut` at `scene.css:617/:629`, deck-leave `--ease-glassGlide` at `App.vue:1142`); the only layout animation is the zone disclosure (`GameControlPanel.vue:2284`); `transition: all` leaks `visibility` during the drawer gesture (`:2082`); three user-visible transitions have no PRM arm (`DrawerTab.vue:144`, `CrayonHeart.vue:329`, `SheetWashiLabel.vue:109`); the dark toggle spends eleven timing values; THE GALLERY EXIT'S BOARD FOLD DOES NOT PLAY (`App.vue:447 restoreBoardAnims` finishes the host's own mover) — a MECHANISM row, assumed cured before any curve is judged.
- `r0/r7-owners-eye/r7-owners-eye.md` M09: 77 declarations spell 35 distinct literal durations against 4 named; `useTheme.ts:35` `disableTransition: true` kills the dusk (its comment: narrow the 46 tweening selectors, never re-blanket); the drawer trace acquits nothing (real-iOS law binds).
- `r0/r6-idiom-history/R6-census.md`: the drawer curve `cubic-bezier(0.32, 0.72, 0, 1)` @ 520 ms is the owner's ruling (audit 4) and no other surface re-eases under it; the two-layer easing partition by CONSUMER (TS `MOTION.curves` vs CSS `--ease-*`, the glass curve byte-identical in both); no timing constant outside pencilConfig; every verb fills `backwards`; one shared beat at 125 ms; PRM collapses every named gesture to a same-frame swap; `transition: none` under PRM must not be blanketed back (the +23.5 fps of `disableTransition` stands; the dusk's five narrowed selectors at `index.css:628-670` out-rank it).
- `web/frontend/src/pencil/config/pencilConfig.ts:121-199` (MOTION, the covenant at :149, the two-layer rule at :164-181); `src/assets/index.css:358, :628-670` (`--ease-*`, the dusk); `src/games/shared/useControlsDrawer.ts:14-27, :86, :277, :423`; `src/pencil/chrome/GameGallery/GameGallery.vue:930, :1474-1475`; `src/App.vue:447, :612, :633-639, :1141-1142`; `src/pencil/celestial/DarkModeToggle.vue:658, :671-882`; `src/pencil/chrome/MarginNote.vue:147-150, :180`; `web/frontend/scripts/check-motion-contract.mjs` (`npm run lint:motion`, the PRM-declaration gate).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-LADDER/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-LADDER/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4246 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
