# MOT-VERB — pass 1, RESEARCH

T9-W7 §13 the transition grammar · §7's exit · §12's motion half · marks M02 / M09 (design half).
Lane port 4248 (the charter's 4247 was held by another lane; next free in the band, `--strictPort`).
Read-only on the product tree. The prototype lives in two throwaway worktrees under the
scratchpad, built and served as two dists: **BEFORE** = HEAD `aab67b92` on :4246, **AFTER** =
HEAD plus `proto/mot-verb-pass1.diff` on :4248. Both worktrees removed at close.

Recommendation up front: **DEVELOP, adjusted.** The idea survives its own kill conditions and
lands the two things it promised — one verb over the declared twins, and the note's missing exit
— at zero frame cost on both engines. Three clauses of the charter do not survive contact and
are named below: the gate cannot be a widening, the celebration's keyframes are already verbs at
another layer, and a verb cannot own a single duration.

---

## 1. Substrate, verified on this tree

Every cite re-derived here, not carried.

| claim | cite | reading |
|---|---|---|
| MOTION holds four durations and one curve | `pencilConfig.ts:121-199`; `:196` `drawerGlide` | beatMs 125 · cardStepMs 440 · boardFoldMs 520 · chromeLeaveMs 200 · `cubic-bezier(0.32, 0.72, 0, 1)` |
| the two layers mirror | I3 check A re-run | GREEN, both sides `cubic-bezier(0.32, 0.72, 0, 1)` (`data/i3-HEAD.txt`) |
| ten `--ease-*` tokens | `index.css:349-358` | ten, and `--ease-glassGlide` is the tenth |
| 77 declarations spell 35 literal durations | `probe/p1-declaration-census.mjs` | **77 / 35 exactly**, I6's number reproduced row by row (`data/p1-declaration-census-HEAD.txt`) |
| 16 incidental transitions | I2 re-run | **16 of 39** (`data/i2-HEAD.txt`) |
| 8 homeless glass spends | I3 check B re-run | **8**, six distinct durations (`data/i3-HEAD.txt`) |
| the exit's board fold is dead | I1 re-run against the AFTER dist | **RED** — ENTER runs 59 frames, EXIT runs **0**, first state `finished` |
| `GLIDE_MS = 520` is a module literal | `useControlsDrawer.ts:86` | confirmed, with the covenant quoted three lines above it |
| the dusk is narrowed to five selectors | `index.css:628-670` | confirmed; `useTheme.ts:35` `disableTransition: true` still stands |
| the three WAAPI movers fill `none` | `useFlipGlide.ts:164`, `useCarouselGlide.ts:328` | `composite: "replace", fill: "none"` both |

**Two things the censuses do not say, and a spec needs.**

1. **The duration histogram.** 150ms ×21, 200ms ×16, 250ms ×9 are **43.8% of every literal in
   `src/`**; the first six values are 68.6%. The estate already has a ladder — it is simply
   unnamed. 440 appears twice as a literal and **520 appears zero times** (it lives only in
   MOTION and JS). Any rung set that is not this histogram is a retune wearing a grammar.
2. **A motion vocabulary already exists.** `index.css:954` declares "§THE MOTION VOCABULARY
   (marks 14, 15)" — a closed, named verb list in three families (COMPLETE / KIN / ERROR),
   twelve keyframes, with its own two disciplines (fill, PRM) and one stated law:
   **"NUMBERS DO NOT LIVE HERE. Every duration and delay arrives as a bound custom property
   from `CELEBRATION`."** The house has already accepted this family's *shape*. What it has not
   accepted is a verb that owns a number.

---

## 2. The assignment table — 81 rows, one verb each

`probe/p2-assignment.mjs` holds the table as data so the next pass replays rather than retypes it.
It prices two laws: STRICT (one verb, one duration) and LADDER (the verb owns curve + fill +
properties + PRM arm absolutely; the duration is a **named rung**, and the rungs are the histogram
above given names — page 520 · step 440 · sheet 280 · mark 250 · breath 200 · touch 150).

```
SET: 6 verbs — LAY DOWN · LIFT · TURN · SLIDE · WRITE IN · RUB OUT
rows 81 | in-set 61 | RESIST 15 | the DUSK test 1 | dev-rig out 4 | UNASSIGNED 0

STRICT   44/57 timed rows RETIMED
LADDER   26/57 timed rows RETIMED   ← the law that survives
  exact                  31/57
  <=1 frame (invisible)   4/57      → 35 of 57 rows do not move to an eye
  <=50ms (marginal)      12/57
  VISIBLE                10/57
```

**Every row has a verb and nothing needed a seventh.** The near-miss was HOVER: eleven rows at
150–240ms whose job is "a pointer is over this", and no hand does anything there. The set refuses
the seventh verb on the house's own words — R6 law 14 already says a hover affordance is one of
three forms, *ink lift · a drawn mark · a ground*, which are LIFT, WRITE IN and LAY DOWN. The
estate had the verbs before this family did.

**The fifteen rows that resist, honestly.** Ten are `@keyframes` SHAPE verbs that the T6
vocabulary already owns (`refuse-shake`, `cell-reveal`, `toggle-squash`, `plush-land`, the five
icon keyframes, the celebration crest window). Two are property sets no verb can own
(`GameControlPanel.vue:2082` `transition: all`, `:2284` `grid-template-rows` — the estate's one
layout animation). One is a LOOP, not a gesture (`ScribbleLoader.vue:81`). One is the global PRM
duration kill. One is the celebration's bound window.

### The fork, answered with a number

| | exact rows | invisible | marginal | VISIBLE retimes |
|---|---|---|---|---|
| **SIX** (LAY DOWN · LIFT · TURN · SLIDE · WRITE IN · RUB OUT) | **31/57** | 4 | 12 | **10** |
| FOUR (LAY DOWN · LIFT · WRITE · DUSK) | 18/57 | 5 | 12 | **22** |

Four verbs cost **twelve more visible retimes** than six, and every one of them is a hover row
being slowed from 150ms to 250ms because LAY DOWN has to cover both a tape arriving and a ground
appearing under a pointer. **Six.** (`data/p2-assignment-SIX.txt`, `data/p2-assignment-FOUR.txt`.)

### The celebration's keyframes

Not a fork. They are verbs **already**, at a different layer: the T6 vocabulary names SHAPE
(what the geometry does), MOT-VERB names TIMING (how long, on which curve, with which fill). A
shape verb *consumes* a timing verb; it is not one. This also retires a naming collision the
charter would otherwise mint — two closed sets in one product both called "the verbs". Call
this family's set **the pencil verbs** and the T6 set stays **the motion vocabulary**, with one
sentence at each head pointing at the other.

---

## 3. The five questions, measured

### 3.1 LIFT — the declared twins are not twins, and one verb fixes it

`App.vue:1141` calls the deck's leave "the twin of BEAT 0's chrome-leave, on the same clock".
Read off the **cascade** on a built dist, both engines, 390×844 (`probe/p5-verbs-live.mjs`):

| | duration | curve | opacity at the window's midpoint |
|---|---|---|---|
| chrome leave (`scene.css:617/:629`) | 0.2s | `cubic-bezier(0.32, 0, 0.67, 0)` | **0.872** |
| deck leave (`App.vue:1142`) | 0.2s | `cubic-bezier(0.32, 0.72, 0, 1)` | **0.045** |

**At 100 ms into a shared 200 ms window, one twin is 87% on the page and the other is 4.5% on the
page — a 19.3× difference, identical in chromium and webkit.** That is the measurement M09's
"not properly defined" deserves, and it is not a matter of taste: `--ease-glassGlide` is
front-loaded (AUC 0.812, half spent by t=0.161) and the leave family is back-loaded (AUC 0.251,
half spent by t=0.794). One of the twins is not a leave at all.

Under the diff, both read `cubic-bezier(0.32, 0, 0.67, 0)` at 0.2s: **`oneVerb: true`, ratio
19.3 → 1.00**, chromium and webkit alike.

**`--ease-fadeOut` or `--ease-accelIn`?** Neither, and that is the finding. Sampled
(`probe/p3-curve-shape.mjs`): fadeOut AUC **0.251**, t(p=0.5) **0.794**; accelIn AUC **0.270**,
t(p=0.5) **0.779**. They are the same leave within 2% of area and 1.5% of midpoint — two tokens
for one decision. And their consumer sets are *both entirely LIFT*: fadeOut runs the chrome
leave, the caret, the board chrome and the thermo tube; accelIn runs the laminate's lift-away and
the toggle's wring-down, which is the icon being taken off the page. So LIFT absorbs both tokens
whole, with **no orphaned consumer**, and the two collapse into `--verb-lift-ease`. The value
taken is fadeOut's control points (the marginally longer hold — the erase reading, and the
laminate's own "erase-family asymmetry" ruling preserved by construction rather than by prose).

### 3.2 RUB OUT — §7's hole, given a tuple and shown on the live note

At HEAD the probe reports `native: false`: the product has **no** `.margin-note-ink` exit. Under
the diff it reports `native: true` and the verb plays on the real note, real class, real scoped
cascade, both engines:

| reading | chromium | webkit |
|---|---|---|
| distinct glyph boxes across 14 frames | **1** | **1** |
| font unchanged through the erase | true | true |
| clip retreats | `inset(0px 0px 0px 100%)` | same |
| opacity held at end | 0 | 0 |
| PRM same frame | `animation: none`, opacity 0 | same |

**The text does not boil.** The tuple: `clip-path` + `opacity`, `--rung-breath` 200ms,
`--verb-rubOut-ease`, `fill: forwards` (the one place forwards is load-bearing — the end pose is
*gone*, which the cascade does not otherwise say), PRM cut. It is the write-in run backwards under
an accelerating hand, so the mark leaves the way it arrived, from the same edge. **Which acts
erase a note is not designed here** (NOTE-ERASE's question, and U-10's).

One wrinkle for the spec: `fill: forwards` collides with R6 law 6 ("every verb fills
`backwards`") and would need a `FILL_ALLOWLIST` row with its ruling — `.margin-note-ink` is
gesture-scoped and the class comes off when the note next speaks, the same shape as
`toggle-squash`'s admitted row.

### 3.3 DUSK — a verb, with its own number, and the ablation that proves it

Six alternating flips, 4× CPU, built dist, 390×844:

| dist | first flip max | worst warm frame | warm median fps | painted colour steps |
|---|---|---|---|---|
| BEFORE (350ms, bare `ease`) | 276.8 ms | **31.0 ms** | **117.1** | 17 |
| AFTER, DUSK at the `page` rung (520ms) | 266.0 ms | **48.5 ms** | **113.2** | 33 |
| AFTER, DUSK keeping **350ms** | 264.8 ms | **33.9 ms** | **116.3** | 16 |

WebKit agrees: 58.8 → 59.5 fps, one frame over 33ms either way.

**DUSK is a verb, and its duration is its own.** Snapping it to a shared rung cost 3.9 fps of
warm median and pushed the worst warm frame from 31 to 48.5 ms — a new long frame bought for
nothing, which is exactly the trade M09 forbids. Kept at 350, the verb changes only the curve
(bare `ease` → `--verb-dusk-ease`) and every number holds. P1-W3's +23.5 fps is untouched: the
five narrowed selectors are not widened, `disableTransition` is not re-blanketed, and the flip
still paints ~16 colour steps rather than tweening 46 selectors.

This is the closed-set test passed, and it forces the **law** the set has to state: *a verb owns
its curve, its properties, its fill and its PRM arm absolutely; its duration is a named rung
unless the verb has no sibling on the ladder, in which case the verb carries its own `ms` and
says why.* DUSK is the only such verb today. That clause is what keeps the set closed instead of
making the ladder open.

### 3.4 The drawer

`GLIDE_MS = 520` (`useControlsDrawer.ts:86`) becomes TURN's `page` rung — the owner's audit-4
tuple carried whole, curve and duration both, scope fence intact (no other surface re-eases under
it because TURN's only other consumer is the board fold, which already rides it). The dock's
throw and the desk's sheet are the same verb at the same rung; the census's question 1 — does a
628px phone throw want its own band — is a **rung** question, not a verb question, and this lane
does not answer it (MOT-LADDER's, or the owner's at the re-look). What the verb law permits,
stated: **a verb may spend more than one rung; it may not spend more than one curve, fill,
property set or PRM arm.** That is what makes the drawer's ruling survive contact.

### 3.5 The exit fold's dead mover

Recorded, not cured. I1 re-run against the AFTER dist is still **RED**: ENTER's
`.board-peek-host` runs 59 frames, EXIT runs **0** and its first observed state is `finished`.
The curve this family would give it once `App.vue:447`'s restore ordering is cured is **TURN at
the `page` rung** — the same tuple the entry already plays, which is the whole point: the fold
out is the fold in, reversed, and it has never been seen.

---

## 4. Instruments — before and after

| instrument | at HEAD | under the diff | note |
|---|---|---|---|
| I1 exit fold plays | RED (0 running frames) | **RED, unchanged** | not this family's cure |
| I2 incidental transitions | RED, 16 of 39 | **RED, 19 of 39 — WORSE** | see below |
| I3-A the mirror | GREEN | **GREEN** | must stay, and does |
| I3-B glass durations homed | RED, 8 homeless | **RED, 7 homeless** | `App.vue:1142` left the glass curve for LIFT |
| I6 (R7) every duration named | RED, 77/35 vs 4 | RED | reproduced exactly at HEAD |
| `npm run lint:motion` | GREEN, 34 specs | **GREEN, 34 specs** | untouched, and that is the finding |
| P4 publisher gate (new) | **RED by construction** | **GREEN, 13 rows, 0 divergent** | |
| P6 every declaration names a verb (new) | **RED, 70** | **RED, 65** | the diff cures 5; 65 is the real size of the job |
| live filter count, 1280×800 | 25 | **25** | π identity on a surface this pass does not claim |

**I2 must be retired, and the verb grammar is what retires it.** I2 asserts every `transition:`
carries `var(--ease-*)`. A verb-named transition carries `var(--verb-lift-ease)`, which I2's
regex refuses — so curing three sites took I2 from 16 offenders to **19**. I2 encodes the token
spelling, not the law, and under this family it is anti-correlated with the thing it was written
to protect.

**I2 carries a second defect, reproduced in two files** (`data/i2-i3-AFTER.txt`): it has no
block-comment state, so a `transition:` sentence inside a CSS `/* … */` comment counts as a
shipped declaration. Minimal repro — a four-line stylesheet whose only real rule is house-curved
reports `1 INCIDENTAL` at the comment's line. Whatever replaces I2 must blank comments first;
P6 does.

**The gate cannot be a widening.** `scripts/check-motion-contract.mjs` reads `e2e/*.spec.ts`
heads and its three checks are about a spec's declared PRM state; nothing in it reads `src/`
(its own banner says so at :14-31). `npm run lint:motion` is GREEN under the diff *because it
cannot see the change*. So the verb law needs its own script beside it —
`probe/p6-every-declaration-names-a-verb.mjs` is that shape, born-RED at 70, with a closed-both-
ways admission ledger (the `check-copy-register` precedent) and the comment strip I2 lacks.

**The publisher.** Two layers, byte-identical, from one place: `MOTION.verbs` / `MOTION.rungs`
in TS is canonical, a generator emits the `@theme` rows, and P4 diffs the tree's CSS against what
the generator would emit — thirteen rows, zero divergent. This is I3 check A widened from one
curve to the whole set, which is the only honest form of the "widen the gate" clause: today the
two-layer rule is enforced on 1/13 of itself. A runtime `:style` publisher was rejected: R6's own
argument against v-binding static curves applies, and `--card-step-ms` is the one exception
because it is genuinely reactive.

---

## 5. The frame trace — nothing bought with quality

Fifteen gestures, 390×844, 1× CPU, built dist, chromium (`data/frames-before-1x.json`,
`frames-after-1x.json`):

```
                          maxB    maxA    dmax  >33B  >33A
idle-control              10.4    10.3    -0.1     0     0
dock-open-1               16.7    17.9    +1.2     0     0
dock-close-1/2            10.3    10.3    +0.0     0     0
theme-1-to-dark          158.3   133.6   -24.7     2     2   (cold bake, unchanged in kind)
theme-3-to-dark-warm      33.4    16.6   -16.8     1     0
gallery-enter-1           33.3    25.1    -8.2     0     0
card-step-1              191.6   141.7   -49.9     4     4   (cold bake, unchanged in kind)
gallery-exit-select       16.5    10.3    -6.2     0     0
gallery-exit-cancel       16.6    16.8    +0.2     0     0

TOTAL frames >33ms   BEFORE 7   AFTER 6   NEW LONG FRAMES: 0
```

Nothing was shortened as a fix: the diff retimes not one shipped duration. The only duration it
touches is the dusk's, and it keeps it at 350. PRM is armed on every surface the diff touches,
proven by emulation on both engines: chrome leave 0s, deck leave 0s, dusk 0s, RUB OUT
`animation: none` with the end pose in the same frame.

---

## 6. Kill conditions

| condition | verdict |
|---|---|
| "a seventh verb the set cannot refuse" | **cleared.** Hover was the candidate; R6 law 14's three forms are LIFT, WRITE IN and LAY DOWN. 61 in-set rows, 0 unassigned. |
| "DUSK re-enabling a page tween P1-W3 killed" | **cleared, with the number.** The five narrowed selectors are unchanged, `disableTransition` stands, and DUSK at 350 costs 0.8 fps of warm median against HEAD's 117.1. At 520 it cost 3.9 fps and a 48.5 ms frame — which is why the rung law has the clause it has. |
| "the glass curve serves six durations and three jobs; one verb per job may leave a job with no verb" | **cleared by splitting the jobs, not the curve.** The glass curve's three jobs are LAY DOWN, SLIDE and TURN; all three keep it. LIFT is the job that was wrongly wearing it (`App.vue:1142`) and it leaves. |
| "taxonomies grow" | **partly conceded.** The set is closed at six; the LADDER is what grows, and the spec must fence it — six rungs, and a verb may carry its own `ms` only where it has no sibling (DUSK, one row today). Ten rows still land a visible retime, four of them signature durations (the wordmark's 1.2s wipe, the bloom's 800, the plush's 1010, the star pops' 640/720) which want admitting as ruled exceptions rather than snapping. |

---

## 7. What a synthesizer needs

**Surfaces:** `pencilConfig.ts` MOTION (the set's home) · `index.css` @theme §EASING (the
published half) + `:628-670` (the dusk) · `scene.css:617/:629` · `App.vue:1142` ·
`MarginNote.vue:147-150,:180` · `useControlsDrawer.ts:86` · `useFlipGlide.ts:164` ·
`useCarouselGlide.ts:328` · `AnswerKeyLaminate.vue:224/:236`.

**Tokens to mint:** `--rung-{page,step,sheet,mark,breath,touch}` and
`--verb-{layDown,lift,turn,slide,writeIn,rubOut,dusk}-ease`, plus `--verb-dusk-ms`.
**Tokens to retire:** `--ease-fadeOut` and `--ease-accelIn` both fold into `--verb-lift-ease`
(their whole consumer sets are LIFT; no orphan).

**Numbers to hit:** twins ratio 1.00 (from 19.3) · dusk warm median ≥116 fps at 4× and worst warm
frame ≤34 ms · zero new frames over 33 ms across the fifteen gestures · P4 13/13 byte-identical ·
P6 0 unadmitted · I3-A GREEN · live filter count unmoved.

**Primitives to reuse:** `--draw-dur`/`--draw-delay` (the one duration variable that already
exists — the publisher's precedent), the T6 motion vocabulary's head comment (the precedent for a
closed named set with stated disciplines), `FILL_ALLOWLIST` (the admission shape for RUB OUT's
`forwards`), `check-copy-register`'s closed-both-ways ledger (the admission shape for P6).

**Collisions:** R6 law 6 (`fill: backwards` always) vs RUB OUT's `forwards`, and vs the three
WAAPI movers' `fill: none` — **fill is a property of the MECHANISM, not of the verb**, and the
tuple must say so in three arms (transition: no fill · WAAPI: `none` · keyframe: `backwards`,
one admitted `forwards`). R6 law 4 (no timing constant outside pencilConfig) vs the ten owner-
auditioned per-surface durations. R6 law 3 (two-layer partition) is *satisfied*, and P4 is the
first thing that enforces it.

### Sketches

```
THE TUPLE — what a verb owns, and what it does not

   LIFT ────────────────────────────────────────────────
     ease      cubic-bezier(0.32, 0, 0.67, 0)   ABSOLUTE   one curve, no exception
     props     opacity, transform               ABSOLUTE
     prm       same-frame cut                   ABSOLUTE
     fill      by mechanism: — / none / backwards  (three arms, stated)
     ms        a RUNG: breath 200 · mark 250 · touch 150
               └─ a verb with no sibling on the ladder may carry its own ms
                  and say why.  Today: DUSK 350, and only DUSK.
```

```
THE TWINS, AT t = 100ms OF A SHARED 200ms WINDOW        (measured, both engines)

  BEFORE                                  AFTER
  chrome leave  ████████████████████ .872  chrome leave  ████████████████████ .872
  deck leave    █                    .045  deck leave    ████████████████████ .872
                └ 19.3x apart, called twins             └ one verb.  ratio 1.00
```

```
THE LADDER — the estate's own histogram, named
  touch  150  ████████████████████  x21 ─┐
  breath 200  ███████████████       x16  ├─ 43.8% of every literal in src/
  mark   250  █████████             x 9 ─┘
  sheet  280  ███                   x 3
  step   440  ██                    x 2      (MOTION.cardStepMs)
  page   520  (zero literals)       x 0      (MOTION.boardFoldMs, JS only)
  ────────────────────────────────────────
  the tail: 35 distinct values, 31 of them used three times or fewer
```

---

## 8. Recommendation

**DEVELOP, adjusted.** The centre holds and it is measurable: the two declared twins ride
opposite curves and one verb makes them one, 19.3× → 1.00 on both engines with zero new long
frames; the margin note's missing exit becomes a verb that plays on the live note without the
text boiling, PRM armed in the same frame; the dusk joins the set as a verb of its own and keeps
every number P1-W3 bought. Three adjustments are not optional. **One** — a verb cannot own a
single duration: 44 of 57 rows would be retimed, so the verb owns curve, properties, fill and
PRM absolutely and spends a *named rung*, with one clause for a verb that has no sibling. **Two**
— the gate is a new script, not a widening: `check-motion-contract.mjs` cannot see `src/`, I2 is
anti-correlated with the law and carries a comment-blindness defect, and the two-layer rule is
enforced today on one of its thirteen rows. **Three** — the celebration's keyframes are not a
fork: they are already a closed named set one layer up, and this family's set should say so at
its head rather than mint a second thing called the verbs. The count is **six**, and it is six
because four costs twelve more visible retimes on rows the owner never asked to move.

---

## Files

- `probe/p1-declaration-census.mjs` — I6's static arm, row-wise (77/35 reproduced)
- `probe/p2-assignment.mjs` — the assignment table as data; `--four` prices the fork's other arm
- `probe/p3-curve-shape.mjs` — every house curve's AUC and midpoint (LIFT's curve, decided)
- `probe/p4-verb-publisher-gate.mjs` — I3-A widened to the whole set; born-RED, GREEN under the diff
- `probe/p5-verbs-live.mjs` — twins · dusk six-flip at 4× · RUB OUT on the live note · PRM; both engines
- `probe/p6-every-declaration-names-a-verb.mjs` — the law's own gate, born-RED at 70
- `probe/r4-frame-probe.mjs` — R0's probe, re-run unchanged but for a `BASE` env read
- `proto/mot-verb-pass1.diff` — the whole prototype, 5 files, +93/−6
- `data/` — every reading above, before and after, both engines

Running them: the static probes (p1–p4, p6) run from anywhere and take `SRC=` / `FE=` to point
at a tree. The browser probes (p5, `r4-frame-probe`) import `playwright`, which node resolves
from the SCRIPT's directory — copy them next to a `node_modules` (the scratchpad worktree, or
`web/frontend`) before running, and pass `BASE=http://127.0.0.1:<port>/`. No frames banked: every
claim here is a number or a file:line.
