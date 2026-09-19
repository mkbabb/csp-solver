# MOT-LADDER — pass 1 · the duration ladder

T9-W7 §13 (the transition grammar) · §12's motion half · marks M02 / M09, design half.
Lane port 4246 (before-dist on 4248). Read-only on the main tree; every product edit lives
in a throwaway `git worktree` under the scratchpad, banked here as `proto/mot-ladder.diff`
and removed after the run. Zero frames banked — every claim below is a number.

**Recommendation: DEVELOP, with one arm killed and two rows added.** The fork resolves on
measured numbers: **arm (a) lives, arm (b) dies.** The prototype greens i2 whole, kills
`transition: all`, publishes the ladder to both layers, brings `GLIDE_MS` home and costs no
frame. It also turned up a defect nobody had named: **at HEAD, under reduced motion, the
drawer gesture still tweens a property** — the same-frame swap the house law claims is not
one. §8 has the measurement.

---

## 1 · The gate, written first and run at HEAD

`probe/check-motion-bands.mjs` — four checks, in the shape of the estate's own
`check-motion-contract.mjs` (same collect/check/self-test spine, same `--self-test` canary).
Scope mirrors R7's I6 exactly so the two readings are comparable.

| check | asserts | at HEAD |
| --- | --- | --- |
| B1 NAMED | every duration in a shipped transition/animation declaration resolves to a rung (`var(--motion-*)`, a `v-bind` off MOTION, a `MOTION.*` read); a bare literal reds unless ADMITTED with a cite | **RED — 76 of 77** |
| B2 CLOSED | the ladder is a short closed set (≤8) and every rung carries a ruling | GREEN (four documented bands) |
| B3 MIRROR | every rung reaches CSS from ONE publisher, byte-identical with TS | **RED — 6** (1 duration reaches CSS in the whole estate) |
| B4 NO-ALL | `transition: all` is banned in shipped source | **RED — 1** (`GameControlPanel.vue:2082`) |

Headline, re-derived on this tree at `aab67b92`:

```
MOTION BANDS — 77 declarations carry a duration (73 shipped, 4 dev rig); 35 distinct
literals; 1 reads a named rung; MOTION names 4 durations
  top literals: 150ms×21, 200ms×16, 250ms×9, 500ms×6, 240ms×5, 350ms×4
```

**77 / 35 / 4 — I6's reading exactly** (`r0/r7-owners-eye/instruments/readings-at-head.json`).
The gate is born-RED at the measured count, not at a number of its own. Self-test: all five
sabotages turn their check RED (`data/gate-at-head.txt`). ADMITTED is empty at HEAD, and
deliberately so — there is no ladder yet, so nothing can be excepted from one.

**Three corrections to the census numbers, each measured** (`probe/rung-assignment.mjs`):

1. **Three of the 77 are prose, not rules.** `index.css:990`, `scene.css:606`,
   `DarkModeToggle.vue:769` are doc comments quoting `animation: none !important`. I6 and
   this gate both count them; the design must not.
2. **`transition: all` is ONE shipped site, not three.** R4 §5 reads "3 shipped (+2 dev)";
   on this tree `grep -rn "transition: all" src/` returns `GameControlPanel.vue:2082` and
   four `FilterTuner.vue` rows. The number moved — say so.
3. **Durations and delays are different axes.** Position-aware: **78 duration positions
   across 66 declarations spelling 23 distinct LENGTHS**, plus 11 delay positions (9
   distinct) and 6 values that are not lengths at all (`0s` visibility swaps; `0.01ms`, the
   global PRM nuke at `index.css:746`). A ladder is a set of lengths. **23, not 35**, is the
   number it has to cover.

---

## 2 · The fork, answered: arm (a) lives, arm (b) dies

The charter's question is what the rungs ARE. The answer is a measurement, not a taste.
A ladder can only earn a length by pulling it; the question is how far a pull may go before
it is itself a retune this wave has no standing to make. Sweep the tolerance
(`data/rung-assignment.txt`); a length outside it is off-ladder and owes a ruling.

```
 tol    ARM A (150·200·250·350·440·520)      ARM B (125·250·375·500·750 + 440,520 cited)
        lengths on/off · sites on/off · shortened
  0ms    5/18 · 45/33 ·  0                    3/20 · 15/63 ·  0
 10ms    9/14 · 52/26 ·  2                    7/16 · 23/55 ·  2
 20ms   11/12 · 60/18 ·  2                    7/16 · 23/55 ·  2
 30ms   15/8  · 69/9  ·  6                   12/11 · 50/28 · 24
 55ms   18/5  · 73/5  ·  8                   19/4  · 74/4  · 30
  any   23/0  · 78/0  · 13                   23/0  · 78/0  · 34
```

**Arm (b) dies on four numbers, any one of which is enough.**

1. **It needs a THIRD cited exception.** `200ms` is 14 sites — the second most-used length
   in the estate, and it is `MOTION.chromeLeaveMs`, an owner-ruled band carrying BOTH
   declared twins (`scene.css:617/:629` and `App.vue:1142`). The nearest beat multiple is
   250, a +50ms stretch of the leave. So arm (b)'s three most-visible rungs — leave, step,
   throw — are all exceptions. That is the charter's own kill: *a ladder read mostly through
   its exceptions is a weak law.*
2. **It shortens 24 sites at tol 30 against arm (a)'s 6**, and the biggest block is `150ms`
   — 18 sites, the single most-used length in the product — pulled to 125. That is a retune
   of the whole whisper class, and the W8 QUALITY LAW forbids shortening as a tidy-up.
3. **Coverage: 50 of 78 duration positions (64%) against arm (a)'s 69 (88.5%)** at the same
   tolerance.
4. **The 125ms beat is not a transition clock.** `pencilConfig.ts:122` names it as "the one
   beat window every perpetual boil swap lands on (~8Hz)" — a raster-swap cadence for the
   boil scheduler, quantised by `beatsFor` at the consumer (`:200`). Nothing in its ruling
   says a page transition owes it a multiple; borrowing it would be a new law wearing an old
   law's name.

**Arm (a), at tolerance ≤30ms, is the ladder** — and its shape is better than "nearest rung":

| rung | ms | sites | ruling |
| --- | --- | --- | --- |
| whisper | 150 | 18 + 160ms×1 | the estate's most-used length; no prior ruling, so the ladder ratifies what shipped |
| leave | 200 | 14 + 180ms×2 | `MOTION.chromeLeaveMs` (`pencilConfig.ts:163`), the scene-leaving fade |
| note | 250 | 7 + 240ms×4 + 260×1 + 280×3 | the note-write family (`MarginNote.vue:149/:180`) |
| dusk | 350 | 4 + 320ms×3 + 340×1 + 380×1 | the theme's colour turn (`index.css:667`, T3-W10 disposition keep) |
| step | 440 | 2 | `MOTION.cardStepMs` — **RATIFY-ME T4-W12 ballot row 4**, auditioned 380/440/520 |
| throw | 520 | 500ms×6 | `MOTION.boardFoldMs` + the drawer (**audit 4, 2026-07-11**, auditioned 480/520/560) |

**Not on the ladder — five LONG-FORM lengths, declared, each keeping its value:**

| ms | site | why it is not a rung |
| --- | --- | --- |
| 600 | `index.css:679` `refuse-shake 0.6s linear` | a refusal shake, not a transition |
| 800 | `DarkModeToggle.vue:810` the bloom | auditioned as itself; the toggle's protagonist |
| 1000 | `ScribbleLoader.vue:81` `infinite` | a LOOP cadence, not a gesture length |
| 1010 | `DarkModeToggle.vue:843` plush-land | the toggle's own landing |
| 1200 | `HandwrittenLogo.vue:560` clip write-on | the wordmark writing itself |

This is the finding the naive snap exposes and the reason to state it in the config rather
than leave it implied: **nearest-rung over all 78 positions shortens the wordmark's write-on
by 680ms** (arm a) **or 450ms** (arm b). A ladder that swallows a deliberate length to make
a law tidy is the QUALITY LAW's exact failure mode. Three more (`100`, `300`, `400`) sit
inside the band but near no rung; each is a beat INSIDE a keyframed character gesture (the
toggle's star tuck, its icon rise, the eraser scrub) — the ladder governs the gesture's
length, the keyframe governs its interior.

Prior art, background only: the industry's motion-token ramps split the same way — an
ordinal ramp of pure values (`--step-1…12`) versus a named ramp with a USE column, whose own
literature warns that *"without the use column a developer picks a value that feels right
and you end up with six durations instead of five."* The estate already answered this for
curves: `--ease-*` are ROLE names on shared curves, and `index.css:340-344` says so in
writing (`--ease-accelIn` "mints as ONE role token, not a laminate-scoped mis-name"). The
ladder is the same idiom one axis over: a name that says what the length FEELS like, never a
rule about who may spend it. That is exactly the charter's "lengths, not meanings", said in
the house's own words.

---

## 3 · The prototype

`proto/mot-ladder.diff` (+ `proto/apply-ladder.mjs`, the replayable applier). 14 files,
**+110 / −29**. Applied only in `scratchpad/mot-ladder-wt`, a detached worktree at `aab67b92`
(`git status --porcelain -- web/frontend/src` is empty at HEAD, so the worktree is the
product byte-for-byte). Built there twice: `dist-before` from clean HEAD, `dist-after` from
the patch.

```
                  MOTION                      index.css @theme          call site
  HEAD      beatMs 125                        --ease-* ×10          transition: opacity 150ms
            cardStepMs 440 ──► --card-step-ms ────────────────────► var(--card-step-ms, 440ms)
            boardFoldMs 520      (the ONE                             ← the only rung that
            chromeLeaveMs 200     publisher,                            ever reached CSS
                                  one component)
            GLIDE_MS 520  ✗ module literal, useControlsDrawer.ts:86

  PROTO     const RUNGS = { whisper 150, leave 200, note 250,
                            dusk 350, step 440, throw 520 }
                    │
                    ├─ cardStepMs / boardFoldMs / chromeLeaveMs / drawerGlideMs  (aliases,
                    │    values UNCHANGED — nothing the owner ruled moves)
                    │
                    └─ publishMotionRungs(document.documentElement)   ← ONE publisher,
                            writes --motion-whisper … --motion-throw    before mount
                                          │
                            transition: opacity var(--motion-whisper, 150ms) var(--ease-standard)
                                                 └─ rung ──────────┘  └─ fallback = the same
                                                                        number, so a missed
                                                                        publish is a no-op
```

What it does: the ladder + one publisher; `GLIDE_MS = MOTION.drawerGlideMs`; all 16
incidental sites given a `--ease-*` token and a rung; `transition: all` narrowed; the twins
put on one curve; PRM arms on the three unarmed files; the dusk homed.

`vue-tsc --noEmit` **0**. `node scripts/check-motion-contract.mjs` (`lint:motion`) **GREEN**
(34 specs). Build green; `index-*.js` 215.29 → 215.55 kB (**+260 B**, gzip 74.32 → 74.44 kB).

---

## 4 · The publisher

One function in `pencilConfig.ts`, called once from `main.ts` before `mount`, writing every
rung onto `document.documentElement`. Read back off the built dist at runtime
(`data/prm-after.json`):

```
HEAD  : {"whisper":"","leave":"","note":"","dusk":"","step":"","throw":""}
PROTO : {"whisper":"150ms","leave":"200ms","note":"250ms","dusk":"350ms","step":"440ms","throw":"520ms"}
```

**Why the document root and not the app root.** The dusk's five narrowed selectors include
`html.theme-turning body` (`index.css:663`). `body` is ABOVE `.page-root`, so a property
published on the app root never reaches the rule that needs it. One publisher means one
element that everything inherits from, and that element is `documentElement`.

**Why a runtime publisher and not a second `@theme` block.** A duplicate in `@theme` is a
second home, and the two-layer rule (`pencilConfig.ts:164-181`) only tolerates a duplicate
where a gate holds it byte-identical — which is precisely why `--ease-glassGlide` needs i3's
check A. Publishing removes the second copy instead of policing it. The cost is one
`style.setProperty` loop before mount and a `var()` fallback at each site — and the fallback
is not a concession, it is the shipped idiom verbatim (`var(--card-step-ms, 440ms)`,
`GameCard.vue:411`).

---

## 5 · The drawer

`GLIDE_MS = 520` leaves `useControlsDrawer.ts:86` for `MOTION.drawerGlideMs`. The number does
not move; its ruling comment travels with it. R4's open question 2 is answered.

**Does the dock's 628px throw want a rung of its own?** On this evidence, no — and the
reason is a velocity, not a preference:

| pose | travel | clock | px/s |
| --- | --- | --- | --- |
| dock sheet, 390×844 (R4 §2.2 D5) | 628 px | 520 ms | **1208** |
| desk case, chromium (R7 drawer trace) | 604.6 px | 481.5 ms settle | **1256** |
| desk case, webkit (R7 drawer trace) | 576.4 px | 481.0 ms settle | **1198** |

Within 5% of each other. The dock inherits `throw` because at 628px it is already moving at
the desk's speed; giving it a shorter clock would make the phone FASTER than the desk at a
LONGER travel. The charter permits per-pose durations inside one engine, and that door stays
open — but it should be opened by W8's device reading, not by this bench. Locally the dock
runs one compositor-only mover and zero frames over 33 ms (§7).

---

## 6 · The dusk, the twins, `transition: all`

**The dusk.** `background-color 350ms ease, color 350ms ease !important` →
`var(--motion-dusk, 350ms) var(--ease-standard)`. **The five narrowed selectors are
untouched** — same list, same `!important`, same `html.theme-turning` window, same
`no-preference` gate. `useTheme.ts:35` `disableTransition: true` and its +23.5 fps stand
unmodified; P1-W3 is not reopened, because nothing was re-blanketed. Read off the engine:

```
HEAD : background-color, color  0.35s, 0.35s  ease, ease
PROTO: background-color, color  0.35s, 0.35s  cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1)
```

**The twins.** G1 (chrome leave, `scene.css:617/:629`) rides `--ease-fadeOut`; G7 (deck
leave, `App.vue:1142`) rode `--ease-glassGlide`. The house names the answer: `--ease-fadeOut`
is easeInCubic and `scene.css:606` calls it "things leave the page"; `--ease-glassGlide`'s
job is a sheet ARRIVING, and its scope fence (`pencilConfig.ts:191`) says the drawer's ruling
is the drawer's. **The leave curve is `fadeOut`, and G7 takes it.** Observed on the built
dist during a real exit (`data/theme-*-4x.json`, EXIT roster):

```
HEAD : opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)  · gallery-fade-leave-active
PROTO: opacity 200ms cubic-bezier(0.32, 0, 0.67, 0)  · gallery-fade-leave-active
                                                       ← now byte-identical to .scene-controls'
```

**`transition: all`.** The single shipped site is `.sparkle-icon`
(`GameControlPanel.vue:2082`). The only property that ever moves there is the hover
`drop-shadow` (`:2086-2088`), so it narrows to `filter`. That is not housekeeping — see §8.

**The zone disclosure** (`GameControlPanel.vue:2284`, `grid-template-rows 200ms
var(--ease-drawOn)`): KEEP, and name it as the estate's one layout tween. It already carries
a house curve and its 200 already equals `leave`; it wants the rung and a sentence saying it
is the exception, not a re-home. The controls re-cut (§10) is about to touch that surface
anyway, and moving it here would be two waves editing one rule.

---

## 7 · Frames — 15 gestures, 390×844, built dist, before and after

R4's rig re-run unchanged (`probe/frame-probe.mjs` — `r4-frame-probe.mjs` with `BASE` from
env, nothing else touched). `data/frames-before-1x.json` / `data/frames-after-1x.json`.

| gesture | BEFORE max / >33ms | AFTER max / >33ms | anims B→A |
| --- | --- | --- | --- |
| idle control | 10.3 / 0 | 10.2 / 0 | 0 → 0 |
| **dock open 1** | 25.8 / 0 | 16.7 / 0 | **2 → 1** |
| **dock close 1** | 10.2 / 0 | 10.4 / 0 | **2 → 1** |
| **dock open 2** | 10.4 / 0 | 10.3 / 0 | **2 → 1** |
| **dock close 2** | 10.4 / 0 | 10.1 / 0 | **2 → 1** |
| theme → dark (1st) | 116.5 / 2 | 124.8 / 2 | 26 → 34 |
| theme → light (2nd) | 10.1 / 0 | 10.2 / 0 | 34 → 34 |
| theme → dark (3rd) | 10.8 / 0 | 10.1 / 0 | 34 → 34 |
| theme → light (4th) | 10.3 / 0 | 10.3 / 0 | 34 → 34 |
| gallery enter (1st) | 16.7 / 0 | 16.9 / 0 | 3 → 3 |
| card step (1st) | 133.4 / 4 | 141.6 / 4 | 7 → 7 |
| card step (2nd) | 10.3 / 0 | 10.0 / 0 | 7 → 7 |
| gallery exit (select) | 16.7 / 0 | 10.1 / 0 | 6 → 6 |
| gallery enter (warm) | 10.3 / 0 | 16.6 / 0 | 3 → 3 |
| gallery exit (cancel) | 10.3 / 0 | 10.3 / 0 | 5 → 5 |

**Six long frames before, six after, on the same two gestures** — the first dark toggle and
the first card step, both cold bakes with named owners (`HandwrittenLogo.vue:343`,
`HandDrawnGrid.vue:216`; W8 §8.1). **No new long frame. Nothing shortened as a fix: of the 16
re-pointed sites, 11 keep their exact length and 5 LENGTHEN (+10 to +50 ms); none shortens.**

**Six alternating flips at 4× CPU**, because the dusk moved (`probe/theme-flip-probe.mjs`):

| flip | 0 dark | 1 light | 2 dark | 3 light | 4 dark | 5 light |
| --- | --- | --- | --- | --- | --- | --- |
| BEFORE max ms | **233.2** | 34.6 | 41.7 | 31.4 | 67.9 | 42.2 |
| AFTER max ms | **199.2** | 31.6 | 32.2 | 50.2 | 68.1 | 58.5 |

The first flip's cold bake is unchanged in kind (6 long frames both sides; it is W8's, not
the ladder's). Flips 1-5 sit in a 31-68 ms band on both sides with **no frame over 100 ms on
either**, which is noise on a 4×-throttled bench, not a signal. Homing the dusk on
`--ease-standard` costs nothing.

---

## 8 · PRM — and the defect this turned up

`probe/prm-arms.mjs` reads the ENGINE's computed `transition-duration` under
`newContext({ reducedMotion: 'reduce' })` — the route that lands (CH-65: `test.use` is void).

**At HEAD, the reduced-motion drawer gesture is not a same-frame swap.**

```
HEAD, PRM reduce, one dock tap:
  dock gesture roster: 1 animation(s)
      visibility 200ms ease · sparkle-icon          ← still tweening
PROTO, PRM reduce, one dock tap:
  dock gesture roster: 0 animation(s)
```

`GameControlPanel.vue:2082`'s `transition: all` catches `visibility` when the gesture flips
`.drawer-case` (R4 §2.2 measured it at no-preference; **this lane measures that it survives
PRM too**, because that rule sits outside every `no-preference` block). R6's law — *PRM
collapses every named gesture to a same-frame swap* — is violated at HEAD on the exact
gesture M02 names. The narrowing to `filter` closes it. **This is what the owner's eye gains
that naming alone would not: on a phone with reduced motion on, the drawer stops animating a
property nobody asked it to.**

The three unarmed files, at HEAD and after:

| site | HEAD @ PRM reduce | PROTO @ PRM reduce |
| --- | --- | --- |
| `DrawerTab.vue:144` | `transform 0.15s ease-out` | `none 0s` |
| `SheetWashiLabel.vue:109` | `opacity 0.15s ease` | `none 0s` |
| `CrayonHeart.vue:329` | armed in source; not in the DOM at the probe's pose | armed in source |
| the dusk | `all 0s` (the global kill) | `all 0s` |

**RESIDUE, stated rather than buried: `.sparkle-icon` reads `filter 0.2s` under PRM even
after the narrowing.** Narrowing `all` fixed the leak, not the arm. The synthesizer must add
a reduce block for that rule; this lane did not, and says so.

---

## 9 · Instruments, before and after

| instrument | at HEAD | on the prototype |
| --- | --- | --- |
| `check-motion-bands.mjs` B1 NAMED | RED 76 | RED **57** (the ~50 sites already carrying a curve are outside this diff's scope) |
| … B2 CLOSED | GREEN | GREEN (7 keys: 6 rungs + `beatMs`) |
| … B3 MIRROR | RED 6 | RED **2** (`beatMs` and the alias rows — a scheduler cadence is arguably not a rung; the synthesizer should rule) |
| … B4 NO-ALL | RED 1 | **GREEN** |
| `i2-incidental-transition-census.mjs` | RED — 16 of 39 | **GREEN — 39 of 39** |
| `i3-glass-curve-home.mjs` A (the mirror) | GREEN | **GREEN** (unmoved, as required) |
| `i3-glass-curve-home.mjs` B (the home) | RED — 6 durations, 8 homeless | RED — 5 durations, **7 homeless** (`App.vue:1142` left the glass curve for the leave curve) |
| `i1-exit-fold-plays.mjs` | RED ×3 | **RED — 0 running frames, first state `finished`** (NOT cured here; see §10) |
| `owners-eye` I6 | RED — 77 / 35 / 4 | shape unchanged by construction (I6 counts literals, and a `var()` fallback is literal text) |
| `check-motion-contract.mjs` (`lint:motion`) | GREEN | **GREEN** |
| `vue-tsc --noEmit` | 0 | **0** |

**A collision worth the synthesizer's attention.** `i3` and `I6` both parse
`pencilConfig.ts` for `key: <number>` pairs. When the four bands become aliases
(`cardStepMs: RUNGS.step`), i3's check B goes half-blind: it reports
`MOTION duration constants : beatMs=125` and loses the other three. The instruments are
re-run, not re-written (charter), so this is recorded, not cured. Two ways out, and the
choice belongs to the cure lane: widen i3 to resolve the alias, or keep the four bands as
literal numbers with a dev-time assertion that each equals its rung. The second keeps every
existing literal-reading instrument honest at the price of writing the number twice.

---

## 10 · The mechanism row, not cured

`App.vue:447 restoreBoardAnims` still finishes the exit's own board mover. i1 on the
prototype's dist: `.board-peek-host` EXIT `running: 0`, first state `finished`, against an
ENTER control of 61 running frames. The EXIT roster at 4× shows `logo-menu` gliding its full
520 ms with no `board-peek-host` beside it. **This family assumes it cured before any curve
of its is judged.** If it is asked what curve the revived fold should take: `throw` (520) on
the glass curve — the same rung its twin already rides, and the rung its own
`MOTION.boardFoldMs` already is. Whether 520 is still right for a fold nobody has seen is
R4's question 8, and it is an AUDITION, not a naming.

---

## 11 · Kill conditions

| kill | verdict |
| --- | --- |
| "naming moves nothing the owner SEES" | **CLEARED, on one measured row.** The dock gesture goes from 2 animations to 1, and from 1 to 0 under reduced motion; the twins' two curves become one on the exit he watches; the dusk stops riding the browser's default. The rest of the family is a law, and the law's value is that the next length lands on a rung instead of beside one. |
| "arm (b) carries permanent exceptions at its two most-visible values" | **CONFIRMED, and worse — three.** `chromeLeaveMs 200` joins 440 and 520. Arm (b) is dead. |
| "re-homing the dusk re-opens the P1-W3 cure" | **CLEARED.** The five narrowed selectors are byte-identical; only the curve token changed. Six flips at 4× on the built dist show no frame over 100 ms after the cold first, both sides. |
| "a ladder read mostly through its exceptions" | **CLEARED for arm (a):** 69 of 78 duration positions land on six rungs; the 5 off-ladder rows are one declared class (long form) and 3 are keyframe interiors. |

## 12 · What pass 2 must decide

1. **`beatMs` — rung or not?** B3 currently reds it. A scheduler cadence is not a transition
   length; either exempt it in the gate with a cite or publish it too.
2. **The remaining 57.** This diff re-points the 16 incidental sites and the twins. The ~50
   sites that already carry a curve but type their length still red B1. They are mechanical
   (each is a table row in `data/rung-assignment.json`) but they are 5 shortenings of ≤30 ms
   — `280→250` ×3, `260→250`, `160→150`, `380→350`. Each needs an eye, not a script.
3. **The `.sparkle-icon` PRM arm** (§8 residue).
4. **The i3 / I6 alias blindness** (§9).
5. **`--motion-*` versus `--dur-*`.** This lane used `--motion-*`; it reads as the namespace
   of `MOTION` and sits beside `--ease-*` without colliding. No measurement decides it.

---

## Files

- `probe/check-motion-bands.mjs` — the gate (`--list`, `--inventory`, `--self-test`); `ROOT` env
- `probe/rung-assignment.mjs` — the assignment table + the tolerance sweep (`--json`)
- `probe/frame-probe.mjs` · `probe/theme-flip-probe.mjs` — R4's rigs, `BASE` from env, otherwise verbatim
- `probe/prm-arms.mjs` — the engine's own computed durations under both media states
- `proto/mot-ladder.diff` · `proto/apply-ladder.mjs` — the patch, and the script that replays it
- `data/` — gate at HEAD and on the proto, the inventory, the assignment sweep, frames before/after at 1×, six flips at 4× before/after, PRM before/after
