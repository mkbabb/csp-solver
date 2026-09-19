# MOT-VERB — pass 1, SYNTHESIS · the pencil verbs

T9-W7 §13 the transition grammar · §7's exit · §12's motion half · M02 / M09 (design half).
Synthesized from `../research/MOT-VERB/README.md` (DEVELOP, adjusted) and re-read against the
tree at `aab67b92`. Read-only on product files; nothing here closes (U-10). Method: the
frontend-design two-pass (plan → tell review → specify); the plan and the review are §0.

Three departures from the research diff, each with its reason: (1) the dusk keeps `ease`'s own
control points under a name instead of borrowing `--ease-standard`'s; (2) RUB OUT needs no
`fill: forwards` and no `FILL_ALLOWLIST` row; (3) `--ease-accelIn` does NOT retire—the research
called it orphan-free and it isn't (`index.css:1036`, `ScribbleLoader.vue:98` spend it as a
per-step `animation-timing-function`). Only `--ease-fadeOut` folds whole.

---

## 0. The plan, and the review against the tells

**Subject.** A pencil-and-paper puzzle. Motion in this product is what a hand does on paper; a
transition that isn't one of those acts is undefined, which is M09's word for it.

**The token system (motion, not colour).**
- Six RUNGS, the estate's own histogram given travel names: page 520 · step 440 · sheet 280 ·
  mark 250 · breath 200 · touch 150.
- Six hand VERBS plus one light verb: LAY DOWN · LIFT · TURN · SLIDE · WRITE IN · RUB OUT · DUSK.
  A verb owns its curve, its property set, its fill arm, its PRM arm and the rungs it may
  spend. It owns no number; DUSK is the one verb with its own `ms`, and the gate counts that.
- Two layers, one source: `MOTION.rungs` / `MOTION.verbs` in TS, published to `@theme` as
  `--rung-*` / `--verb-*-ease` / `--verb-dusk-ms` by a generator; a gate diffs them byte for
  byte (I3-A widened from 1 row to 14).
- PRM is a VALUE of the ladder, not a discipline per file: under `prefers-reduced-motion:
  reduce` every rung and `--verb-dusk-ms` reads `0ms` at `:root`, stated once.

**Type / copy.** No rendered string is minted or changed. M16 binds the gate's messages and the
comments only; zero woff2 re-cut (`check-font-coverage` must read unchanged).

**Layout (of the grammar).** SHAPE and TIMING are two layers already: T6's motion vocabulary
(`index.css:954`) names what geometry does and says "NUMBERS DO NOT LIVE HERE"; the pencil
verbs name how long, on which curve, with which fill. A shape verb consumes a timing verb. Each
head comment points at the other; nothing is called "the verbs" twice.

**Principles.** Name what ships, retune nothing (51/61 rows change curve; 31/57 keep their
number exactly; 10 visible retimes, 4 of them admitted as signatures rather than snapped). One
new animation in the whole family (RUB OUT); zero removed. The set closes by a count the gate
reads, not by prose.

**The review against the tells.** The generic version of this brief is a Material-shaped
duration scale (xs/sm/md/lg) with `standard` / `decelerate` / `accelerate` curves. Three things
in the research diff leaned that way and are revised here:
1. DUSK wearing `--ease-standard` (0.4, 0, 0.2, 1)—Material's own curve under Material's own
   name—was a retune dressed as an assignment. CSS defines `ease` as `cubic-bezier(0.25, 0.1,
   0.25, 1)` exactly, so the dusk's curve becomes `--verb-dusk-ease: cubic-bezier(0.25, 0.1,
   0.25, 1)`: byte-identical paint to HEAD, and the memorable thing about the dusk is that it
   doesn't move at all, it gets a name and a home.
2. RUB OUT's `fill: forwards` broke law 6 and wanted an allowlist row. T6's own discipline
   answers it: make the class's cascade rest pose EQUAL the keyframe's `to`, and the fill is
   `backwards` like every other verb, the PRM cut is free (`animation: none` shows the rest
   pose, which is the end pose), and `FILL_ALLOWLIST` is untouched. One accessory removed.
3. The rungs are not a scale. They're the histogram (150 ×21, 200 ×16, 250 ×9 = 43.8% of every
   literal; 280 ×3; 440 and 520 are MOTION's own), named for what travels that far. A seventh
   rung is a diff review, not a design freedom.

---

## 1. The tokens

### 1.1 Rungs (`MOTION.rungs` → `--rung-*`)

| rung | ms | what travels that far | histogram at HEAD |
|---|---|---|---|
| `page` | 520 | a whole sheet or the whole board turns over | 0 literals (MOTION + JS only) |
| `step` | 440 | one slot along a rail | 2 |
| `sheet` | 280 | a sheet is laid on the page | 3 |
| `mark` | 250 | a mark is made or unmade | 9 |
| `breath` | 200 | a thing stops being there | 16 |
| `touch` | 150 | the page answers a pointer | 21 |

The four existing constants stay as names and become derived: `boardFoldMs: rungs.page`,
`cardStepMs: rungs.step`, `chromeLeaveMs: rungs.breath` (zero consumer churn this pass; the
three aliases die the pass after, with their consumers renamed). `beatMs` is the boil's clock,
not a rung, and stays where it is.

### 1.2 Verbs (`MOTION.verbs` → `--verb-<name>-ease`)

| verb | the hand | ease (control points) | shape | props | fill arm | rungs it may spend |
|---|---|---|---|---|---|---|
| `layDown` | puts a thing on the page and it stays | `cubic-bezier(0.32, 0.72, 0, 1)` | front-loaded, AUC 0.812 | opacity, transform | by mechanism | page · sheet · mark · touch |
| `lift` | takes a thing off the page | `cubic-bezier(0.32, 0, 0.67, 0)` | back-loaded, AUC 0.251, t(½) 0.794 | opacity, transform | by mechanism | breath · mark · touch |
| `turn` | the page itself turns; what was here is now there | `cubic-bezier(0.32, 0.72, 0, 1)` | as layDown | transform | none (WAAPI) | page |
| `slide` | a thing travels its rail and stays itself | `cubic-bezier(0.32, 0.72, 0, 1)` | as layDown | transform | none (WAAPI) / by mechanism | page · step · sheet · touch |
| `writeIn` | ink arrives the way a hand writes it | `cubic-bezier(0.22, 1, 0.36, 1)` | front-loaded, AUC 0.830 | clip-path, stroke-dashoffset, opacity | backwards | mark · breath · touch |
| `rubOut` | ink leaves the way a hand erases it | `cubic-bezier(0.32, 0, 0.67, 0)` | as lift | clip-path, opacity | backwards | breath · mark |
| `dusk` | the light over the page changes | `cubic-bezier(0.25, 0.1, 0.25, 1)` (= `ease`, named) | AUC 0.669 | background-color, color | none (transition) | its own `ms: 350`, and only it |

Three verbs share the glass curve and two share the leave curve; the token names the VERB, not
the curve, and that's the point: TURN is fenced to `page` and SLIDE isn't, which is a rule the
gate can read (a fold is never shorter than a page). Law 1 and law 2 hold by construction: the
drawer's curve and 520 are TURN at `page`, verbatim, and no surface re-eases INTO the glass
curve that wasn't on it (LIFT is the job that was wrongly wearing it at `App.vue:1142`, and it
leaves).

**The fill arm is a property of the mechanism, three arms, stated in the tuple:** a
`transition:` has no fill; a WAAPI mover is `composite: "replace", fill: "none"`
(`useFlipGlide.ts:164`, `useCarouselGlide.ts:328`, unchanged); a keyframe fills `backwards`
(law 6) and its `to` equals the consumer's cascade rest pose (T6 discipline 1). No verb fills
`forwards`. `FILL_ALLOWLIST` is untouched; G3.2 reads exactly what it reads today.

**What retires.** `--ease-fadeOut` (five consumers, all LIFT timing rows: `scene.css:617/:629`,
`GameBoard.vue:1265`, `ThermoTube.vue:114`, `CaretOverlay.vue:64`; its control points become
`--verb-lift-ease`). `GLIDE_MS` at `useControlsDrawer.ts:86`. The I2 instrument (superseded, see
§6). **What stays:** every other `--ease-*` token, now the SHAPE layer's vocabulary
(`animation-timing-function` inside `@keyframes` and the T6 set); `--ease-accelIn` keeps its
two shape consumers and loses its two timing consumers (`AnswerKeyLaminate.vue:225-226`,
`DarkModeToggle.vue:795`) to `--verb-lift-ease` (within 2% AUC—invisible). `--ease-glassGlide`
stays byte-identical to `drawerGlide` so I3-A never moves; it's the shape layer's copy.

### 1.3 The published block (generated, never hand-edited)

```css
/* THE PENCIL VERBS, PUBLISHED (T9-W7 §13). Written by scripts/publish-verbs.mjs from
   MOTION.rungs / MOTION.verbs; lint:verbs diffs the two layers byte for byte. */
--rung-page: 520ms;  --rung-step: 440ms;  --rung-sheet: 280ms;
--rung-mark: 250ms;  --rung-breath: 200ms;  --rung-touch: 150ms;
--verb-layDown-ease: cubic-bezier(0.32, 0.72, 0, 1);
--verb-lift-ease:    cubic-bezier(0.32, 0, 0.67, 0);
--verb-turn-ease:    cubic-bezier(0.32, 0.72, 0, 1);
--verb-slide-ease:   cubic-bezier(0.32, 0.72, 0, 1);
--verb-writeIn-ease: cubic-bezier(0.22, 1, 0.36, 1);
--verb-rubOut-ease:  cubic-bezier(0.32, 0, 0.67, 0);
--verb-dusk-ease:    cubic-bezier(0.25, 0.1, 0.25, 1);
--verb-dusk-ms:      350ms;
```

### 1.4 PRM, at the ladder

```css
@media (prefers-reduced-motion: reduce) {
  :root { --rung-page: 0ms; --rung-step: 0ms; --rung-sheet: 0ms; --rung-mark: 0ms;
          --rung-breath: 0ms; --rung-touch: 0ms; --verb-dusk-ms: 0ms; }
}
```

Every `transition:` that spends a rung collapses to a same-frame swap (law 43) with no per-file
block, which arms the three unarmed sites (`DrawerTab.vue:144`, `CrayonHeart.vue:329`,
`SheetWashiLabel.vue:109`) by naming a rung and nothing else. Keyframes are already zeroed by
the global rule at `index.css:746`; WAAPI movers keep their JS `reducedMotion` cut
(`App.vue:169/:612/:647`, `useControlsDrawer.ts:423`). Nothing in `src/` awaits
`transitionend` (grepped; only `animationend`, on keyframes the global rule already handles).
The existing per-file PRM blocks are left in place this pass (redundant, harmless) and are the
pass-after's deletion. **One behaviour this changes, for the owner:** the toggle's rest-stack
crossfade under PRM (`DarkModeToggle.vue:976`, a 200ms opacity fade that IS the reduced-motion
fallback) would read 0ms if it spent `--rung-breath`. It's admitted with its own literal instead
(§3), so nothing changes there unless the owner says the fallback should be a cut too.

---

## 2. The surfaces—one memorable thing each, desktop and mobile, light and dark

Motion is theme-blind; the dusk is the theme's own verb and runs both ways. Every row below is
the same on `--color-card` and `--color-background`, light and dark; AA is untouched because no
colour moves.

### 2.1 The gallery, in and out (M09's "into and out of game selection")

| beat | mover | verb @ rung | home today | delta |
|---|---|---|---|---|
| in, BEAT 0 | chrome leaves (`scene.css:617/:629`) | LIFT @ breath | `200ms --ease-fadeOut` | curve identical, number named |
| in, BEAT 1 | board folds into the card + wordmark (`App.vue:376`, WAAPI) | TURN @ page | `boardFoldMs 520` glass | none (alias) |
| out | board unfolds + wordmark (`App.vue:639`) | TURN @ page | declared, **never plays** (I1 RED) | the same tuple as the entry, reversed—once `App.vue:447`'s restore ordering is cured |
| out | the deck's leave-only dissolve (`App.vue:1142`) | LIFT @ breath | `200ms --ease-glassGlide` | **the visible fix**: at t=100ms of the shared window the deck is at 0.045 and the chrome at 0.872 (19.3×). Under LIFT both read 0.872. |
| in | controls fade-in (`scene.css:612`) | WRITE IN @ mark, delay touch | `250ms --ease-drawOn 150ms` | curve drawOn → writeIn (AUC 0.749 → 0.830, front-loaded both) |
| step | card step (`useCarouselGlide.ts`) | SLIDE @ step | `cardStepMs 440` glass | none (alias) |
| guard | ribbon arm/retire (`GameGallery.vue:1473`) | LAY DOWN @ mark | `240ms glass` | +10ms (invisible) |

**The memorable thing:** the two declared twins finally are. The chrome and the deck leave on
one curve, holding legible for most of the breath and going together at its end; and the fold
out is the fold in run backwards, which nobody has seen because it has never painted a frame.
The exit-fold cure is a mechanism row (`restoreBoardAnims` walks `getAnimations({subtree:
true})`, which includes the host's own mover, and finishes it): this family assigns the tuple
and the prototype MUST include the cure so TURN is judged on a fold that plays (research risk
7). Whose row it is, the agglomerator says; the tuple is decided here.

### 2.2 The controls drawer, desk and dock (M02)

| pose | movers | verb @ rung | delta |
|---|---|---|---|
| desk ≥1024 | sheet · case · masthead · tab counter-scale, one clock (`useControlsDrawer.ts`) | TURN @ page | **none.** `GLIDE_MS = 520` dies; the mover reads `MOTION.verbs.turn` + `MOTION.rungs.page`. Law 1/2 verbatim. |
| dock <1024 | the sheet alone, `translate(0, ±628px)` | SLIDE @ page | **none** in pixels. The census's question (does a 628px phone throw want its own length) is a RUNG question; this family declines to answer it and the owner disposes at the re-look. The only lawful shorter answer is `step` (440), never a new number. |
| bottom tab tongue (W2 §2.7, landed) | the 1.4° → 0° straighten on hover (`DrawerTab.vue:144`) | LAY DOWN @ touch | curve `ease-out` → glass (both front-loaded, AUC 0.626 → 0.812); gains a PRM arm by the ladder |
| zone disclosure (`GameControlPanel.vue:2284`) | `grid-template-rows` | ADMITTED (layout) | the estate's one layout animation; §10's re-cut owns the surface |
| sparkle icon (`:2082`) | `transition: all 200ms` | cure: `filter, transform` LAY DOWN @ breath; or ADMIT | `all` is what leaks `visibility` into the dock gesture (R4 D8); naming the set is the cure and §10 touches the file anyway |

**The memorable thing:** nothing moves. The owner's audit-4 ruling is carried whole and the
frame trace reads byte-for-byte the same; what changes is that the number finally lives where
the covenant three lines above it says it must. M02's jank did not reproduce on this rig (R4
§4); W8 owns the device reading and the verb law gives it a fixed tuple to read.

### 2.3 The dusk (M09's "darkmode toggling")

`index.css:667` becomes `background-color var(--verb-dusk-ms) var(--verb-dusk-ease), color
var(--verb-dusk-ms) var(--verb-dusk-ease) !important`. The five narrowed selectors are
unchanged; `disableTransition: true` stands; the `!important` specificity cure stands. Paint is
byte-identical to HEAD because the named points ARE `ease`. The ablation's numbers at 4× (warm
median 117.1 fps, worst warm frame 31.0ms, 17 colour steps) are therefore the spec's floor, not
a target—and the 520 rung is refused on that ablation (48.5ms, 113.2 fps: a long frame bought
for nothing, the trade M09 forbids).

The toggle's own gesture (`DarkModeToggle.vue:769-891`, eleven values) is assigned, not
retuned: outgoing icon fade → LIFT @ touch (100 → 150, marginal); incoming rise → LAY DOWN @
sheet (300 → 280, marginal); wring-down → LIFT @ mark (340 → 250, **visible**, and the one row
of the eleven this spec asks the owner to look at); hover → LAY DOWN @ breath (curve only); star
tuck-in → LIFT @ touch; the bloom 800 / plush 1010 / star pops 640 · 720 and `toggle-squash`
120 are ADMITTED (§3). Three verbs and four admissions replace eleven literals.

### 2.4 The margin note's exit (§7's hole)

```css
.margin-note-ink { display: inline-block;
  animation: ink-write-in var(--rung-mark) var(--verb-writeIn-ease) backwards; }

/* RUB OUT: the write-in run backwards under an accelerating hand. The rest pose IS the
   end pose, so the fill is backwards like every other verb and PRM shows it at once. */
.margin-note-ink.is-rubbing-out { opacity: 0; clip-path: inset(0 0 0 100%);
  animation: ink-rub-out var(--rung-breath) var(--verb-rubOut-ease) backwards; }
@keyframes ink-rub-out { from { clip-path: inset(0 0 0 0); opacity: 1; }
                         to   { clip-path: inset(0 0 0 100%); opacity: 0; } }
```

`ink-rub-out` joins the T6 vocabulary's KIN family beside `ink-write-in` (it lives in
`index.css` §THE MOTION VOCABULARY, not the SFC, for the same scoped-hash reason). One clip-path
and one opacity on an inline-block that's already its own paint: the glyphs never re-lay out,
the text never boils (law 13), and the mark leaves from the edge it arrived at. The verb is
defined here; WHICH acts erase a note is NOTE-ERASE's and the owner's (`.is-rubbing-out` is the
hook that family sets). Both themes: the ink is `currentColor`, nothing chromatic moves.

**The memorable thing:** a note that arrived as handwriting leaves as an erasure, 200ms, same
edge, and the letters hold their shape to the last frame.

### 2.5 The hover rows (eleven, 150–240ms)

No HOVER verb. Law 14's three forms are the verbs: ink lift = LIFT @ touch, a drawn mark = WRITE
IN @ touch, a ground = LAY DOWN @ touch. The 240ms wink crossfade (`CrayonHeart.vue:329`) is
LAY DOWN @ mark (+10ms) and gains its PRM arm by the ladder.

### 2.6 The assignment, whole

`../research/MOT-VERB/probe/p2-assignment.mjs` holds the 81-row table as data: 61 in-set, 15
resist, 1 dusk, 4 dev-rig. The spec ADOPTS that table as the first draft and does not retype
it here. It is an argued assignment, not a measurement (research risk 9): **the critique lane
re-assigns from source independently before the prototype spends a row**, and any row the two
readings disagree on is listed in the prototype's record with both verbs and the delta each
would cost.

---

## 3. The admission ledger, day one (19 rows, closed both ways)

The gate's budget is 0 unadmitted, 0 stale, and the ledger's size is exact-matched like
`FILL_ALLOWLIST`: adding a row is a diff review with a ruling. By kind:

| kind | rows | ruling |
|---|---|---|
| `shape` (T6 vocabulary spends a raw ms at the shorthand) | `index.css:679` refuse-shake · `:721/:722` cell-reveal + its delay · `DarkModeToggle.vue:822` toggle-squash · `:843` plush-land · `DiceIcon.vue:113/:134` · `FillForcedIcon.vue:72` · `SolveIcon.vue:55/:70` — 10 | a SHAPE verb; T6's own law says its number must arrive bound. Cure path: bind from `CELEBRATION` (the `--draw-dur` precedent) in the pass that touches each file; admitted until then |
| `signature` (owner-auditioned duration) | `HandwrittenLogo.vue:560` 1.2s wipe · `DarkModeToggle.vue:810` bloom 800 · `:888` 640 · `:891` 720 — 4 | decided rows; "assigned, never retuned". Permanent unless the owner retunes at a re-look |
| `layout` | `GameControlPanel.vue:2284` grid-template-rows — 1 | no verb owns a layout property; §10's re-cut disposes the surface |
| `loop` | `ScribbleLoader.vue:81` 1000ms linear infinite — 1 | a loop is not a gesture |
| `prm` | `index.css:746` the global kill — 1 · `DarkModeToggle.vue:976` the toggle's reduced-motion crossfade — 1 | the arm itself; the ladder reads 0 there, so the fallback carries its own breath |
| `all` | `GameControlPanel.vue:2082` — 1, **or cured** (§2.2) | admitted only if the prototype finds the property set is not `filter, transform` |

52 of the 70 born-RED rows cure by assignment; 18 or 19 admit. The `shape` kind is the one that
should shrink: its cure is mechanical and lands file by file.

---

## 4. Copy

None rendered. The verbs and rungs are code names, never product strings; no `aria`, no
utterance, no tape changes. The gate's own messages obey M16 (plain English, no em dash): e.g.
`src/App.vue:1142 spends 200ms with no rung. Name a verb and a rung, or admit it with a
ruling.`

---

## 5. Motion, homed

Every tuple above lives in `pencilConfig.ts` MOTION as `rungs` and `verbs`; the CSS is
published from it; the JS movers read it by name. A helper of four lines keeps WAAPI call sites
honest without plumbing:

```ts
/** A WAAPI mover spends a verb at a rung; it never types a number or a curve. */
export const spend = (verb: keyof typeof MOTION.verbs, rung: keyof typeof MOTION.rungs) =>
  ({ duration: MOTION.rungs[rung], easing: MOTION.verbs[verb].ease, fill: "none", composite: "replace" }) as const;
```

`useFlipGlide` takes `spend("turn", "page")`; `useCarouselGlide` takes `spend("slide",
"step")`; `useControlsDrawer` takes `spend("turn", "page")` on the desk and `spend("slide",
"page")` on the dock. `GLIDE_MS` dies. The three constants become aliases of rungs.

---

## 6. Instruments: what turns, what's retired, what's born

| instrument | HEAD | under this spec | note |
|---|---|---|---|
| **P6 `check-pencil-verbs.mjs`** (born-RED) | 70 unadmitted | 0 unadmitted · 19 admitted · 0 stale | replaces I2; blanks comments first; also checks rung ∈ verb's rung set |
| **P4 publisher gate** (born-RED) | set absent | 14 rows, 0 divergent; own-ms verbs = 1 (dusk) | I3-A subsumed and kept GREEN |
| **P5 twins** (born-RED) | midpoint ratio 19.3 | 1.00, both engines | cascade read on a built dist, 390×844 |
| **RUB OUT live** (born-RED) | `native: false` | `native: true`, 1 glyph box / 14 frames, PRM same frame | both engines, both themes |
| **PRM at the ladder** (born-RED) | `DrawerTab:144` / `CrayonHeart:329` / `SheetWashiLabel:109` read 150/240/150ms under PRM emulation | all read 0s | one probe, three sites, both engines |
| I1 exit fold plays | RED ×3 | GREEN if the prototype carries the mechanism cure; else RED and the grammar is unproven on the exit | the honest gate on §2.1 |
| I3-B glass durations homed | RED, 8 | GREEN | every glass spend names a rung |
| I6 every duration named (R7) | RED, 35 vs 4 | GREEN | |
| I2 incidental transitions | RED 16 | **SUPERSEDED**—reads 19 under any verb cure (token-spelling regex) and counts commented prose | mark in the r0 record so no later pass reads it as a regression |
| dusk six-flip at 4× (guard) | 31.0ms / 117.1 fps / 17 steps | ≤34ms / ≥116 fps / ≤17 steps | parity by construction; the number is the floor |
| fifteen-gesture frame trace (guard) | 7 frames >33ms | ≤7, zero NEW | nothing shortened as a fix |
| filter census (π) | 9 | 9 | |
| goldens 4/4 (π) | | unmoved; no DELTA declared (no golden is mid-transition) | |
| r0 heading / hue / wobble instruments (π) | as banked | identical readings | this family claims none of those surfaces |
| `check-font-coverage` (π) | | unchanged | zero rendered strings |

CI: `lint:verbs` joins the existing lint job's chain; O-12's sixteen lanes stay sixteen.

---

## 7. Plan—files, order, what dies

1. `src/pencil/config/pencilConfig.ts` — `MOTION.rungs`, `MOTION.verbs` (with `rungs` sets and
   `fill` arms), `spend()`; `boardFoldMs`/`cardStepMs`/`chromeLeaveMs` become aliases. Head
   comment names the set "the pencil verbs" and points at T6's motion vocabulary.
2. `scripts/publish-verbs.mjs` (`--write` emits the `@theme` block; `--check` diffs) +
   `scripts/check-pencil-verbs.mjs` (P6 + P4 + the rung-set check + the ledger) →
   `package.json` `lint:verbs`. Born-RED before step 3.
3. `src/assets/index.css` — the published block under §EASING; `--ease-fadeOut` dies; the dusk
   row (:667) names its verb; the PRM-at-the-ladder rule; `ink-rub-out` joins §THE MOTION
   VOCABULARY's KIN family with one head sentence pointing at the pencil verbs.
4. The mechanism cure for the exit fold (`App.vue:447`, snapshot-after-arm or exclude the host's
   own mover from the finish walk) — assigned by the agglomerator; the prototype carries it.
5. LIFT over the twins: `scene.css:617/:629`, `App.vue:1142`, `GameBoard.vue:1265`,
   `ThermoTube.vue:114`, `CaretOverlay.vue:64`, `AnswerKeyLaminate.vue:224-226`,
   `DarkModeToggle.vue:795`.
6. RUB OUT: `MarginNote.vue:149` (write-in named) + the `.is-rubbing-out` rule; the keyframe in
   `index.css`. `FILL_ALLOWLIST` untouched.
7. The movers: `useControlsDrawer.ts` (`GLIDE_MS` dies), `useFlipGlide.ts`,
   `useCarouselGlide.ts` read `spend()`.
8. The sweep: the remaining ~40 in-set rows per the (critiqued) assignment table; the three
   unarmed files just name a rung; `:2082` names its set or admits.
9. The r0 record: I2 marked superseded, with the 16 → 19 reading and the comment repro cited.

Dies: `--ease-fadeOut` · `GLIDE_MS` · the deck leave's glass curve · `transition: all` at :2082
(cured or admitted) · the I2 instrument. Stays this pass, dies the next: the three duration
aliases, the per-file PRM blocks the ladder now covers.

---

## 8. Prototype brief

Throwaway worktree under the scratchpad at HEAD + the diff; `npx vite build`; served on
127.0.0.1:4247 (or the next free in 4230–4249, `--strictPort`); the control dist at HEAD on a
second port; a scratch Playwright config; chromium + webkit headless; 390×844 dsf3 touch and
1280×800; both themes. No product file touched; worktrees removed at close.

Build, in this order: steps 1–3 (the gate is RED before the CSS lands and GREEN after: bank both
readings), step 4 (I1 GREEN or the record says the exit is unproven), steps 5–7, then the sweep.

**What proves it (numbers first, crops few):**
1. P5 twins — cascade-read opacity of `.scene-controls` and `.gallery-fade-leave-active` at
   t=100ms of the exit: ratio 1.00 both engines (from 19.3). ONE crop, 390×844 dark, the deck
   and the chrome side by side at t=100ms, before/after (≤150 KB each).
2. TURN on the exit — I1: `.board-peek-host` `running` ≥3 frames with a non-`none` transform on
   the EXIT, both engines both widths; the entry's frame count as the control. No crop.
3. RUB OUT on the live note — inject `.is-rubbing-out` on a real hint note: 1 distinct glyph box
   across 14 frames, font unchanged, clip retreats to `inset(0 0 0 100%)`, opacity 0 held;
   under PRM emulation the end pose in the same frame with `animation: none`. ONE crop per
   theme at t=100ms (the half-erased word), 390×844.
4. Dusk — six alternating flips at 4×: warm median ≥116 fps, worst warm frame ≤34ms, colour
   steps ≤17; webkit ≥58 fps. Byte-compare the painted `background-color` sequence against the
   control dist (expected identical: the curve is `ease` under a name).
5. Drawer/dock — the frame at t=260ms of a dock open and a desk open, pixel-diffed against the
   control dist: 0 differing pixels (π identity on the owner's ruling).
6. PRM at the ladder — under `reduce`, computed `transition-duration` at `DrawerTab:144`,
   `CrayonHeart:329`, `SheetWashiLabel:109` = 0s, and the deck leave, chrome leave and dusk 0s.
7. The fifteen-gesture frame trace at 1×: frames >33ms ≤7, zero new; live filter count 25 → 25
   at 1280×800.
8. Instruments: P6 0/19/0 · P4 14/14 · I3-A/B GREEN · I6 GREEN · I2 recorded superseded ·
   filter census 9 · goldens 4/4 · r0 heading/hue/wobble instruments re-run with identical
   readings · `check-font-coverage` unchanged · `lint:motion` GREEN (34 specs).
9. The critique lane's independent re-assignment: rows where it disagrees with p2, each with
   both verbs and the ms delta, banked before the sweep.

Evidence: ≤4 crops, ≤600 KB total, every one cited in the record; everything else numbers.

---

## 9. What the owner disposes at the re-look (U-10)

- The deck's leave on LIFT (the one visible change on the gallery).
- The wring-down at `mark` (340 → 250, the one visible retime among the toggle's eleven).
- The dock's rung: `page` (as shipped) or `step`—a rung, never a number.
- The toggle's reduced-motion crossfade: keep the 200ms fallback (admitted, default) or cut.
- The four signature admissions stay signatures unless the owner says otherwise.
