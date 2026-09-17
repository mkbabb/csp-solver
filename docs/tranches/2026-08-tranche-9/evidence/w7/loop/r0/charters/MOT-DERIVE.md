# PASS-1 CHARTER · MOT-DERIVE · Distance and material

Section: §13 the transition grammar · §12's drawer curve · marks M02 M09 (the design half)
Lane port: 127.0.0.1:4248
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-DERIVE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Nobody CHOOSES a duration. A duration is derived from how far the thing travels and what
it is made of: `ms = baseMs + travelPx / speed(material)`, one speed per material —
paper glides at one rate, tape lifts at another, and a longer throw takes longer because
it is longer. Two or three material constants live in MOTION (`paperSpeed`, `tapeSpeed`,
`baseMs`) with a `durationFor(materialKey, travelPx)` helper consumed by the FLIP
primitives, which already compute travel at gesture onset (`useFlipGlide`,
`useControlsDrawer`) and currently throw the number away. The dock's 628px throw and the
desk's shorter reciprocal throw stop sharing a number — R4's open question answered
without a second ruling. The deck's card step derives from its own travel. The dusk has
no travel, so it is not on this system at all and takes a stated constant, honestly
declared as the one non-derived duration. The owner's 520 is RE-DERIVED rather than
re-opened: `paperSpeed` is SET so the desk's measured travel lands on 520 — the family's
neatest property, and its trap.

The first prototype is ARITHMETIC, with no code: solve `paperSpeed` from the desk
drawer's travel and 520 ms, then PREDICT the dock's duration and the card step's. If the
predicted card step lands far from the owner-ruled 440, the model is wrong and the family
dies on arithmetic. If it lands close, implement `durationFor` behind the drawer's glide
by overlay and frame-trace both poses at 1× and 4×.

## Substrate on this tree (verify first, cite file:line)

- `r0/r4-transition-grammar/data/r4-probe3.json` — every `Element.prototype.animate` call the product makes across drawer open/close, gallery enter, card step and both exit verbs, at 390×844 AND 1440×900, with target class, keyframes and options: the travel numbers are in the keyframes.
- `useControlsDrawer.ts` (the FLIP: explicit [from, to] keyframes, travel computed at onset; `:86` GLIDE_MS; `:277` the `hostMoved` guard), `useFlipGlide.ts`, `useCarouselGlide.ts` (the card step's travel: one slot at what width?); `pencilConfig.ts:121-199` (cardStepMs 440, boardFoldMs 520, chromeLeaveMs 200).
- `r0/r7-owners-eye/probe-r7b.json` (the drawer's measured travel 576.4 / 604.6 px and settle ~481 ms in the two engines — note travel differs by engine; what does a derived duration do with that?).
- `App.vue:447` (the dead exit fold — its travel exists in the keyframes; its duration would be derived; note, do not cure).

## What the family must answer

1. THE SOLVE — `paperSpeed` from the desk drawer (travel, 520 ms, `baseMs` chosen and defended); the prediction for the dock (628 px) and for the card step (its travel at 1440 and 390); the miss against 440 in ms and %.
2. THE VERDICT ON PAPER — one material or two; if two, say plainly whether the second was chosen to fit a number.
3. THE ENGINE DELTA — travel differs by engine (576 vs 605 px): a derived duration then differs by engine; is that a feature (the same speed) or a defect (two products)?
4. THE NON-DERIVED — the dusk and every zero-travel transition (opacity fades, the note's write-in, the tape's whisper): how many declarations are off the system, and what governs them (a stated constant each? then the system covers what fraction of the 77?).
5. THE DOCK — the derived number vs the inherited 520; the per-pose duration inside one engine (allowed) — and whether the owner's ruling (the curve AND 520 ms) is honoured or only its curve.
6. THE RUNNABLE HALF (only if the arithmetic lands) — `durationFor` behind the drawer glide by overlay; frame trace at 390×844 and 1440×900 at 1× and 4× on a built dist; PRM same-frame swap unchanged.
7. THE LINT — what a static gate can even check under this family (no literal durations in FLIP call sites?); i3-B's reading after.
8. THE FRAME TRACE — no new long frame; nothing shortened as a fix.

## First runnable prototype

A script under your evidence dir reading `r4-probe3.json` and printing the solve, the predictions and the misses (both viewports, both engines where banked); the README's verdict; only then the overlay on your dev server and the traces. Zero frames.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r4-transition-grammar/instruments/i2-incidental-transition-census.mjs` — every shipped `transition:` carries a `var(--ease-*)` token; RED at HEAD (16 incidental). Must green under your family's overlay/diff, or the family says which sites it leaves and why.
- `r0/r4-transition-grammar/instruments/i3-glass-curve-home.mjs` — A: `MOTION.curves.drawerGlide` byte-identical to `--ease-glassGlide` (GREEN, must stay); B: every duration spent on the glass curve resolves to a MOTION constant (RED: 6 durations, 8 homeless sites).
- `r0/r4-transition-grammar/instruments/i1-exit-fold-plays.mjs` — the exit's board mover observed running (RED at HEAD, three-for-three). Do NOT cure it; record that your family assumes it cured and note any curve you would give it.
- `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` I6 — every transition duration is a named decision (RED: 35 literals vs 4 named).
- `r0/r4-transition-grammar/data/*.mjs` — the frame-trace, animate-hook and playback probes: re-run the 390×844 frame trace against a BUILT dist (`npm run build` into your scratchpad, served on your port) before and after; a re-timing that costs a long frame has bought nothing. Six alternating theme flips at 4× if the dusk moves.
- `npm run lint:motion` (`check-motion-contract.mjs`) on any `.diff` you write; the PRM arm for every gesture you touch, proven by `prefers-reduced-motion` emulation.
- The π-guard: no bake dropped, no boil thinned, no transition shortened as a "fix" (W8 QUALITY LAW).

## Kill conditions and risk

- Two ruled durations (520 drawer, 440 card step) must both fall out of one speed constant and almost certainly will not; two materials fitted to two numbers is a formula that has learned the answer — the worst kind of system, because it looks derived and is not. The family is built to die on arithmetic; let it, if it does.
- Most of the estate's 77 declarations have zero travel; a system that governs the minority is a rule for two gestures.

## Census ground (read before designing)

- `r0/r4-transition-grammar/census.md` (+ `data/r4-frames-1x.json`, `r4-frames-4x.json`, `r4-probe2-4x.json`, `r4-probe3.json`, `r4-probe4*.json`): MOTION exposes four durations (beatMs 125, cardStepMs 440, boardFoldMs 520, chromeLeaveMs 200) and one curve; 73 live declarations, 28 distinct literal durations, exactly ONE duration reaches CSS from config (`--card-step-ms`); the glass curve is spent at 200/240/280/320/440/520 with eight homeless call sites; 16 of 39 `transition:` declarations carry no `--ease-*` token (the dusk at `index.css:667` among them); `GLIDE_MS = 520` is a module literal at `useControlsDrawer.ts:86`; the dock rides ONE compositor mover (translate ±628px, 520 ms glass) with zero frames >33 ms at 1× locally; the first dark toggle is a cold bake (145.7 ms at 1×, 247.8 at 4×; theme-keyed rasterPose caches at `HandwrittenLogo.vue:343`, `HandDrawnGrid.vue:216`); the first card step is a cold bake too; two declared twins ride two curves (chrome-leave `--ease-fadeOut` at `scene.css:617/:629`, deck-leave `--ease-glassGlide` at `App.vue:1142`); the only layout animation is the zone disclosure (`GameControlPanel.vue:2284`); `transition: all` leaks `visibility` during the drawer gesture (`:2082`); three user-visible transitions have no PRM arm (`DrawerTab.vue:144`, `CrayonHeart.vue:329`, `SheetWashiLabel.vue:109`); the dark toggle spends eleven timing values; THE GALLERY EXIT'S BOARD FOLD DOES NOT PLAY (`App.vue:447 restoreBoardAnims` finishes the host's own mover) — a MECHANISM row, assumed cured before any curve is judged.
- `r0/r7-owners-eye/r7-owners-eye.md` M09: 77 declarations spell 35 distinct literal durations against 4 named; `useTheme.ts:35` `disableTransition: true` kills the dusk (its comment: narrow the 46 tweening selectors, never re-blanket); the drawer trace acquits nothing (real-iOS law binds).
- `r0/r6-idiom-history/R6-census.md`: the drawer curve `cubic-bezier(0.32, 0.72, 0, 1)` @ 520 ms is the owner's ruling (audit 4) and no other surface re-eases under it; the two-layer easing partition by CONSUMER (TS `MOTION.curves` vs CSS `--ease-*`, the glass curve byte-identical in both); no timing constant outside pencilConfig; every verb fills `backwards`; one shared beat at 125 ms; PRM collapses every named gesture to a same-frame swap; `transition: none` under PRM must not be blanketed back (the +23.5 fps of `disableTransition` stands; the dusk's five narrowed selectors at `index.css:628-670` out-rank it).
- `web/frontend/src/pencil/config/pencilConfig.ts:121-199` (MOTION, the covenant at :149, the two-layer rule at :164-181); `src/assets/index.css:358, :628-670` (`--ease-*`, the dusk); `src/games/shared/useControlsDrawer.ts:14-27, :86, :277, :423`; `src/pencil/chrome/GameGallery/GameGallery.vue:930, :1474-1475`; `src/App.vue:447, :612, :633-639, :1141-1142`; `src/pencil/celestial/DarkModeToggle.vue:658, :671-882`; `src/pencil/chrome/MarginNote.vue:147-150, :180`; `web/frontend/scripts/check-motion-contract.mjs` (`npm run lint:motion`, the PRM-declaration gate).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-DERIVE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/MOT-DERIVE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4248 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
