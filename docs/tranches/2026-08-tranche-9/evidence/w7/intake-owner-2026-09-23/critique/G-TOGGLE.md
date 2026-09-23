# G-TOGGLE: the adversarial critic's read (T9-M21, "the darkmode toggle story book needs improvement")

Critic: Opus, not the designer and not the prototyper. Subject: worktree `.claude/worktrees/wf_b6676cd9-8c6-14`
off main `1d0dc4fd`, 7 files at +328/−94 plus `storybook.test.ts`, and the built dists `dist-K6`/`dist-R6`
(final, v5) against `dist-base` (main's control). U-10 applies: this file retires nothing. The owner disposes
at the re-look.

**Verdict: ADVANCE at 60 (earned, not 80+).** The toggle half is real, and I re-measured it: the opacity law
holds, R's single body holds, the settle and the fence work, and the graphite digits hinge. But G4, which the
brief calls the board's own gate, is RED in five separate ways. The prototype read two of them (the grid and
the cold grid). I found three more:
- user ink, which by arithmetic no ink-only schedule can hold
- a cold flip followed by a reversal, which still blacks out the graphite digits in both arms
- a painted statistic that isn't the lawful one

The ballot frames f1/f2 also misreport K's instants, and the diff doesn't apply to the §13 tree that M21 says
the re-look reads.

## 0 · What I ran (independent instrument, not the prototype's)

- **Instrument.** `critique/G-TOGGLE/cprobe.mjs` plus the analyzer `can.mjs`, banked beside this file. It
  samples per rAF and reads:
  - both live bodies: opacity, visibility, warp scale, first star and dot opacity, filter
  - the rest-stack visibility
  - `html.dark` and `theme-turning`
  - `.page-root` and `.board-wrapper` computed backgrounds
  - one GIVEN digit's computed stroke
  - **one USER digit's computed stroke** (I typed a 4 into r0c2, the empty cell, before the first flip; the
    prototype's payload carried givens only)
  - the button's style-attribute mutations, at rest and through the gesture
- **Payload.** The prototype's `?board=` (`ATMu…079`), so the rows are comparable.
- **Serving.** `dist-K6` and then `dist-R6` on 127.0.0.1:4255, and `dist-base` on :4256, each with
  `--strictPort`. They were killed by recorded PIDs 77337, 94489 and 77338, and both ports read free after.
  I didn't touch 3001 or 4230–4249.
- **Matrix.** {base, K6, R6} × {chromium, WebKit headless} × {1280×800 fine, 4 flips from a light boot;
  390×844 hasTouch, 4 flips; 1280 fine "reverse", a second press about 200–260 ms after the first, 2 runs}.
  That's 18 runs and 60 flips. Per-flip numbers are in `critique/G-TOGGLE/per-flip-summary.txt` (a summary;
  no raw per-frame JSON is banked).
- **Box.** Load 43–134 through the run, so the box wasn't quiet. The chromium rAF median was 7.7–8.4 ms and
  WebKit's was 17–19 ms. Only the interleaved A/B discriminates. I made no frame-rate claims.
- **Also re-run bare on the worktree:** `lint:motion` exited 0 (35 specs) and `check-copy-register` exited 0.
  Both reproduce.
- **Integration check.** I extracted a scratch archive of `74a2b5d9`, applied MOT-VERB's
  `pass5/prototype/MOT-VERB/pass5.diff` to it (clean), then ran `git apply --check` of `g-toggle.diff`.
  The results are in §3.

## 1 · Claims re-measured (the prototype's numbers against mine)

Chromium numbers first, then WebKit (wk). "u3" means frames under 3:1.

| gate · claim | prototype said | critic measured | holds? |
|---|---|---|---|
| G1 translucent body/star/sparkle frames | control 15–81, K 0, R 0 | control 18–50 cr, 8–27 wk. **K 0 and R 0 on every flip, both engines, including the reversals** | ✓ reproduced |
| G1 both live bodies up | R 0, K 4–25 (opaque) | R **0** on all 24 flips. K 8–47 (47 on a reversal). Control 0–28 | ✓ R. K's residue is as stated |
| G2 outgoing at the half-swap | R 0, K 0.92–0.95 | R **0** everywhere. K 0.93–0.95. Control 0.65–0.95 | ✓ |
| G2 crest − landing, R in [−60, +250] | R −30…+85 | R cr 0…+67. **R wk 1280 cold −400** (land +881, no injector) | ✗ on a natural cold WebKit flip; the prototype saw it only under the injector |
| G4 graphite (given) digits, computed | ≥ 4.06, 0 u3 | plain flips: K 4.11–5.09 and R 4.20–5.65, 0 u3, both engines, both viewports. Control 1.02–1.35, 1–14 u3 | ✓ on plain flips |
| G4 given digits, **cold flip then reversal** | "K v1 1.0–1.7, not re-read on v5" | **K v5 chromium 1.07 for 9 frames (+447…+527). R v6 chromium 1.01 for 8 frames (+672…+754).** The warm reversals read 0 u3. Control 1.03–1.05, 16–18 u3 | **✗ RED both arms** (better than control, not green) |
| G4 **user ink** (`--color-user-ink`, the player's own digits) | not measured (the payload had no user digit; R-4 "printed, not gated", never printed) | K chromium **1.07–1.64, 4–7 u3** on every plain flip. R chromium 1.11–1.31, **6–11 u3**. wk: K 1.11–1.54, 1–6 and R 1.17–1.95, 2–6. Control cr 1.01–1.37, 8–19 and wk 1.02–2.19, 1–8 | **✗ RED every flip, both arms, both engines** |
| G9 tap then settle, hasTouch | K none, control matrix(1.08) (chromium) | proto: none in every 390 cell, both engines. Control: **wk matrix(1.08); cr none** in my regime | ✓ discriminates on WebKit. Chromium's control doesn't reproduce the stick here, so the regime has to be witnessed |
| G10 flip after the click | R cr +151…+158, wk +193…+257 | R cr +154…+159 ✓. R wk +202…+247. K wk +62…+102. Control wk +40…+80 | The chromium row holds. As written, G10 can't pass in WebKit for ANY tree, control included (see §2.6) |
| v-bind writes | "static, written once at mount" | 0 button-style mutations at rest (3 s) and 0 through every gesture | ✓ |
| dS (the largest per-frame step of the incoming scale) | K 0.077–0.145, R 0.067–0.346 warm | K cr 0.08–0.38, R cr 0.07–0.43 (cold is the top). Control 0.04–0.28 | RED both arms. The control's cold flip is also > 0.08 |

## 2 · Findings (each one a gap; ranked)

1. **User ink can't be held by any ink-only hinge. This is arithmetic, and the painted reading follows it.**
   - The setup: `--color-user-ink` is #2563eb in light and #60a5fa in dark. `.board-wrapper` is
     rgb(253,253,252) in light and rgb(19,18,17) in dark. The dusk is `ease` over 350 ms.
   - For **89 ms going dark (+62…+150) and 94 ms going light (+68…+161)**, neither the old blue nor the new
     blue reaches 3:1 on the paper. The best any step instant can buy is **1.44:1** (at +104 dark, +102 light).
   - The hinge was derived for black and chalk. At 120 ms (to dark) it steps blue at the worst instant for
     the old ink (1.07) and the new ink reads only 1.90. At 87 ms (to light) the mirror holds: old 1.91, new
     1.06.
   - Measured: every plain flip is RED in both arms (above). K halves the control's u3 count in chromium; R
     doesn't beat it meaningfully (6–11 against 8–19).
   - The same arithmetic covers every mid-luminance ink on the board: the five player hues, the teacher-red
     conflict ink, `url(#solver-ink)` (a paint server that no `stroke` transition can hold), and the 0.5-opacity
     `.pencil-marks`. None of these was measured.
   - The adjudicator's §1 proof that "any continuous ink path must cross its paper" generalizes. **Any
     ink-only schedule fails for a mid-luminance ink**, because the paper passes through that ink's own
     luminance.
   - The only lawful holds are:
     - (d) the board's paper steps WITH its ink at the hinge, so the board is one sheet that cuts on one frame
       while the page grounds dusk around it. The price is the "lit rectangle" that the index.css ground-set
       comment warns about.
     - (e) a paper-coloured underlay stroke beneath coloured ink during `theme-turning`. That costs paint and a
       filterBudget-neutral second path.
   - Either arm is a ballot arm for T9-B23, not a lane's call.

2. **A cold flip followed by a reversal still blacks out the graphite digits in both arms.**
   - Measured: K chromium 1.07 × 9 frames and R chromium 1.01 × 8 frames, while the paper walks from about
     194 to 238 with the ink still chalk. Warm reversals read clean.
   - The mechanism is the prototype's own §3.5: the paper's dusk runs on the compositor, the ink's step runs
     on the main thread, and the cold flip's M15 re-bake stall sits between them. On R the flip is a timer, so
     the stall also delays the flip itself.
   - The v5 "0 of 27 flips" claim is true only for flips that nobody reverses. The re-press battery (GA9)
     was never run on v5. The cure has to be read painted, as §3.5 says itself.

3. **The painted G4 statistic isn't the lawful one.**
   - README §2 reads the board ink as "the top 0.2 % of WCAG contrast against the board's median paper".
     That's a maximum-type existence read.
   - CHAIR-RULINGS A.5.3 ("existence is not visibility") and §2.11 (as widened in A.4) require a painted
     **core median** over glyph-coverage-keyed pixels, with the fraction under the floor stated, and a
     FAINT-INK plant (≈ 0.15 opacity, about 1.2:1) that must RED it.
   - The FAINT-INK plant is the brief's own G4 plant, and it was not run.
   - The painted "0 frames under 3" rows stand as a max read only. They are not a G4 pass.

4. **The ballot frames misreport K's instants.**
   - f1's K row labels columns +250 and +375, but its bracketed paint times are **180 and 296**, and +950 is
     854. f2's K row labels +125 and +950, but the times are **54 and 745**.
   - The brief requires "K above R at the same instants". R's row is within 12 ms throughout.
   - The effect: f1 shows K's sun large and overlapped at "+375", when on K's own score it's cut by about
     +340 on the CSS clock. The pair overstates K's double exposure against R in exactly the ballot that
     T9-B24 asks the owner to judge.
   - f3 comes from the **reverted K2 build** (v2 grid form). Its grid row isn't the shipped v5 grid, whose
     warm window reads 1.20–1.87 over 2–7 frames painted.
   - Checklist: unverified gestalt, and a frame that argues for one arm.

5. **The diff lands on main, but M21's re-look reads the loop.**
   - The design-marks disposition says so: "M21 is read against the loop, not only against main."
   - On `74a2b5d9` + MOT-VERB pass5.diff, `git apply --check` of `g-toggle.diff` rejects **7 of 32 hunks**:
     4 in `DarkModeToggle.vue`, 2 in `HandDrawnGrid.vue` and 1 in `pencilConfig.ts`.
   - Several of these reject on bare `74a2b5d9` too, because main has moved since the loop's base (the W8
     fold). VERB's pass5 and LADDER's pass6 diffs touch the same four files.
   - Nobody has measured the composed tree, and the `inkDark` form may be moot there: VERB's row 36 turns
     the grid into a CSS `.grid-ink` step.

6. **G10 as written can't pass in WebKit, for any tree.**
   - The first rAF after a click lands 40–102 ms late in headless WebKit, and that's true of the control too
     (+40…+80). This is the isDark path's cost, M21-a.
   - So "K and PRM at +0" and "R at whisper ± 1 frame" both RED in WebKit by construction.
   - The prototype re-described its WebKit R row as "whisper + ~70–100" instead of calling it RED. Under A.1
     that re-wording isn't allowed, and under A.6 a row that's green in one engine and red in the other is a
     defect in the other engine.
   - The chair should restate G10 relative to the interleaved control's click-to-frame latency, or keep it
     and book WebKit's latency as M21-a's RED.

7. **G11 was re-worded to pass.**
   - The brief's G11 is "0 timing literals outside MOTION (the squash's 120 declared in characters)".
   - The SFC keeps `transition: transform 200ms ease` (the hover, `DarkModeToggle.vue:787`), and
     `storybook.test.ts` enshrines it: `toEqual(["200ms"])`. The test's timing scan also counts only
     `setTimeout` calls whose argument is a numeric literal.
   - `lint:verbs` rule 8, `lint:bands`, `check-property-block` and the undefined-token census weren't run
     (none exists on main). G11 is not bare.

8. **Two homes and a consumer-less token.**
   - `--motion-hinge-dark/-light` and `--motion-beat` are typed literals in `:root`, mirrored from TS and held
     by a vitest. LADDER's publisher was the brief's form.
   - `--motion-beat` is registered and has **0 consumers**.
   - `MOTION.curves.springPop` is a TS copy of `--ease-springPop`, and `MOTION.dusk.curve` is a TS literal
     the test compares to a string typed in the test, not to CSS. That's the spec citing itself.
   - `MOTION.rungs` re-homes four of LADDER's rungs on a tree that has no LADDER.
   - `index.css:793` still says "DarkModeToggle keeps a 200ms opacity fade", which the PRM cut made false.
     The brief's step 8 asked for the false comments to be corrected.
   - `FilterTuner.vue:38` still tunes `wobble-celestial`'s base def, which has no consumer now (dev-only).

9. **R runs on two clocks.** R's flip is a JS timer, while the fold and the stand-up are CSS transitions
   from the press. Under the natural WebKit cold stall (no injector), the page lands at +881 while the moon
   crested at +481 (−400). K doesn't show this. R's G7 residue (2 of 34) and this come from one mechanism,
   and neither cure (arming the backstop and the flip from the transitions' first frame) is built.

10. **Carried REDs, confirmed by the prototype's own numbers and not re-run here:**
    - G4's grid half: both arms, warm 1.20–1.87 on 2–7 frames painted; cold, M15's bake.
    - G6's chromium hand-off: mean Δ 1.00/1.44 against 0.5.
    - G13 dS: my reading is above; the step-off-curve read wasn't computed.
    - G14: 8 cold bakes, and WebKit's cold max frame of 370–665 ms.
    - The dark-boot filter census at rest is 11, not 9 (crayon-heart ×2). The prototype observed it in
      both trees, and nobody has claimed it.

## 3 · Constraint audit

- **M16 copy:** bare 0 ✓. No string changed. The aria-label reads `isDark`, which lags the press by the
  whisper in R (150 ms); not measured by AT.
- **filterBudget 9:** the population is unchanged. The matcher widens by string (law 9, the chair's row).
  The dark boot's 11 is pre-existing.
- **AA from painted bytes:** ✗. Findings 1–3, plus the grid.
- **π:** the prototype's census reads 0 unclaimed at rest. I didn't re-run it. I did read 0 style writes at
  rest and in the gesture ✓. The hinge rule's `transition` shorthand at `!important` replaces EVERY transition
  on `.glyph-svg path`, `.pencil-marks` and `.cell-ghost-path` for 475 ms (K) or 625 ms (R) after a press.
  Any state change inside that window (the hover ring, the invalid ring, the peer cursor) loses its own
  transition. That's undeclared π, unmeasured.
- **W2's mechanics:** untouched ✓.
- **R6 law 1 (the drawer curve):** untouched ✓.
- **The @property law:** registered in the first static stylesheet, inherits, 0ms initial, no fallbacks ✓.
  `--motion-beat` has no consumer ✗.
- **M09:** K keeps the owner's beats. R's rate price reds dS. Both are framed ✓.
- **PRM a cut:** ✓ for the toggle. The chromium grid still lands 1–4 frames late in both trees (carried).
- **Hygiene:** no rm, no git writes, main untouched. The lane left 13 dists and `.gt/` in its worktree, which
  is lawful under the no-rm law and the chair's to clear.

## 4 · Charter rows (pass 7) this critique adds or sharpens

- **MOT-VERB P7-M21-1 (hinge), sharpened.**
  - G4 is re-cut to cover EVERY board ink: given, user (all five hues), conflict, solver-ink and pencil
    marks.
  - The statistic is the §2.11 painted core median plus the fraction under, over two photographs, with the
    FAINT-INK plant.
  - A cold-flip-then-reversal row, both engines.
  - The composed tree (§13 plus row 36), not main.
- **The chair: T9-B23 gains arm (d), the board turns as one sheet** (paper and ink step on one frame at the
  hinge; the price is the lit rectangle inside the dusking page), **and (e), the underlay.** Both are
  printed against (c) on user ink. Under LAWS P5 a firing default may not lose to the control on the named
  statistic. On user ink, (c) in arm R does not beat the control (6–11 against 8–19 u3).
- **MOT-VERB P7-M21-2 (score):**
  - Re-cut f1/f2 so K's frames sit within one frame of the column instant, or print the column at the true
    instant.
  - Mint f3 from the shipped grid form.
  - R arms its flip and backstop from the transitions' first frame; its cold-WebKit c−l goes into G2's
    reading.
- **MOT-LADDER × VERB P7-M21-6:** publish the three tokens, delete the TS mirrors or bind them by
  derivation, consume or drop `--motion-beat`, and home the hover's 200 ms in MOTION.
- **The chair:** restate G10 against the control's click-to-frame latency, per engine. Book WebKit's 40–102 ms
  first-frame latency as M21-a's RED.

## 5 · Strengths (earned)

- The opacity law is real and I re-measured it: 0 translucent frames across 40 prototype flips, both
  engines, reversals included, against the control's 8–50.
- R's single body holds with 0 double exposures, and the outgoing body reads 0 at the half-swap on every
  flip.
- The graphite digits hold ≥ 4.1:1 on every plain flip, both engines, where the control dips to 1.02.
- The settle (getAnimations plus a generation guard) hands off at 1.000 on every flip I ran.
- The hover fence cures WebKit's sticky 1.08.
- The v-bind publication writes nothing per beat.
- The prototype is honest about its REDs, its box, its dropped frames and its five grid forms, and every
  plant it ran is born RED.
