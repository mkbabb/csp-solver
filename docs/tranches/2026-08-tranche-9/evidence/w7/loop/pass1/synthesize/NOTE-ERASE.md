# NOTE-ERASE · THE ERASER — pass-1 design spec

T9-W7 §7, the hint note's lifecycle. Synthesized from the pass-1 lane record
(`../research/NOTE-ERASE/README.md`) and the r0 laws (`../../r0/r6-idiom-history/R6-census.md`).
This is a spec, not a cut: the product is untouched, nothing closes (U-10).

The research settled the fork. Arm (a), the clock on the hint, died on three numbers (the note
and the armed model are two objects; a rubbed-out sentence leaves `becauseCells` lit and turns
the next H press into a silent reveal; the erase frees zero layout because the strip reserves its
line). Arm (b) is what this spec designs: a note that leaves only when what it said stops being
true, that quiets after eight beats, and that is rubbed out, never faded.

The one memorable thing on this surface is the rub-out itself: the line leaving from its END
backward, one beat, the write-in's mirror. Everything else is quiet by construction, because the
settle is a change of pressure and nothing more.

---

## 1 · Tokens (nothing minted; every value is a house value re-derived on this tree)

| role | token | light | dark | note |
|---|---|---|---|---|
| paper (the note's real backdrop) | `--color-background` | `hsl(48 15% 98%)` = #fbfaf9 | `hsl(24 8% 6%)` = #110f0e | not `--color-card`; the ramp's comment at `index.css:236-247` is priced on the card, the note is painted on the page |
| ink, full pressure (a fresh note) | `--color-pencil-graphite` → `--grid-line-color` | `hsl(0 0% 15%)` = #262626 · 14.52:1 | `hsl(48 10% 80%)` = #d1cfc7 · 12.25:1 | unchanged |
| ink, quiet (a settled note) | `--ink-press-quiet` (graphite 68%) | painted core #6b6a6a · **5.17:1** | painted core #93928c · **6.07:1** (webkit 6.13) | AA at 16px, DPR 1 and 3, both engines; the rung exists, it gains a consumer |
| teacher-red (refusal, conflict) | `--color-red-ink` | #d02a52 · 4.87:1 | #ff5c7c · 6.44:1 | full pressure only, never settles (68% = 3.04:1 light) |
| gold (solved) | `--color-gold-ink` | #8c691d · 4.85:1 | #e5c74d · 11.48:1 | full pressure only, never settles (68% = 2.70:1 light) |
| the beat | `MOTION.beatMs` | 125 | 125 | `pencilConfig.ts:123` |
| the write-in curve | `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | same | `index.css:349`, unchanged |
| the rub-out curve | `--ease-accelIn` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | same | the laminate's lift-away; 5 sites today, 6 after. If MOT-VERB folds it into `--verb-lift-ease` (fadeOut's points), the rub-out reads that token instead; the two curves are within 2% of area and the frame trace cannot tell them apart |
| the settle curve | `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | same | a colour step, nothing geometric |

Type is untouched: `--font-hand` at `--type-body` (16px at 390, 18.176px at 1280), leading
`--type-leading-caption` 1.3, tracking 0.02em, lowercase by the strings' own construction.

### 1.1 The motion home — a `note` band in MOTION, in beats

R6 law 4 (no timing constant outside `pencilConfig`) is already broken by the note's own
`250ms` literal at `MarginNote.vue:149`. This family brings that number home and adds its own
beside it, all as beat counts so the constant IS the beat:

```ts
// pencilConfig.ts, inside MOTION — the margin note's life, in beats of MOTION.beatMs (125)
note: {
  writeInBeats: 2,       // 250ms — the incumbent write-in, named (MarginNote.vue:149)
  rubOutBeats: 1,        // 125ms — the exit; half the arrival, the erase asymmetry
  settleAfterBeats: 8,   // 1000ms after a graphite note arrives, it stops being the loudest ink
  settleBeats: 4,        // 500ms colour step, full → --ink-press-quiet
  refusalHoldBeats: 24,  // 3000ms from the LAST refusal, then rub out. BALLOT: 24–40 (U-10)
},
```

Published to the stylesheet by the `--card-step-ms` precedent (`GameGallery.vue:930`): MarginNote
v-binds `--note-write-ms`, `--note-rub-ms`, `--note-settle-ms` on its root from
`MOTION.note.* × MOTION.beatMs`. The refusal hold is a JS timer in GameBoard and never reaches
CSS. If MOT-LADDER or MOT-VERB lands first, `writeInBeats`/`rubOutBeats` become the WRITE IN /
RUB OUT rungs and the beat counts stay; the agglomerator reconciles the names, not the numbers.

**Where this collides with MOT-VERB and why the eraser's shape wins the fill question.** MOT-VERB's
RUB OUT tuple (its §3.2) is 200ms on `fill: forwards` with a new `FILL_ALLOWLIST` admission.
This spec's exit is a Vue `<Transition>` leave: the node is REMOVED when the verb ends, so there
is no end pose to retain, no fill at all, and law 6 ("`backwards`, never `forwards`") stays whole
with no admission row. Duration: one beat, traced at 16 distinct clip states on chromium and 9
on webkit's 60Hz (`../research/NOTE-ERASE/logs/e2-wipe-*.json`); 180ms is the traced fallback,
and 200 (MOT-VERB's breath rung) sits inside the same traced band with no filter and no glyph
transform either way. The agglomerator picks the number; the mechanism is this one.

---

## 2 · Components and states

### 2.1 `MarginNote.vue` — the keyed ink span gains an exit and an age

```
<Transition name="note" mode="out-in">
  <span v-if="text" :key="text" class="margin-note-ink" :data-note-age="age">…</span>
</Transition>
```

| state | class / attribute | what paints | motion |
|---|---|---|---|
| **writing** (arrival) | `.note-enter-active` on `.margin-note-ink` | clip `inset(0 100% 0 0)` → `inset(0)` | `ink-write-in var(--note-write-ms) var(--ease-noteWrite) backwards` — the incumbent keyframe (`index.css:1115`), unchanged |
| **fresh** (0–8 beats) | no attribute | full pressure, the tone's own ink | none |
| **settled** (8 beats on, graphite only) | `data-note-age="settled"` | `color: var(--ink-press-quiet)` | `transition: color var(--note-settle-ms) var(--ease-standard)`; PRM: `transition: none` (a step) |
| **rubbing out** (exit) | `.note-leave-active` | clip `inset(0)` → `inset(0 100% 0 0)` AND opacity 1 → 0 (the twin hides the anti-aliased tail) | `ink-rub-out var(--note-rub-ms) var(--ease-accelIn)` + `ink-rub-out-fade`, same duration and curve; NO fill; node removed by Vue when the computed duration elapses |
| **replaced** | old leaves, new enters | `mode="out-in"`: 1 beat out, then 2 beats in, 375ms total | the live region gets two mutations, which is what the repeat cure (§4) needs |
| **PRM** | `index.css:1157-1171` puts `animation: none !important` on `.margin-note-ink` | the exit has no computed duration, so Vue's leave resolves same-frame and the node goes with it | measured: `animationend` NEVER fires under PRM on either engine, so the removal may not be gated on it. `<Transition>` reads computed durations, and that is why it is the idiom and a listener is forbidden |
| **quiet** (`is-quiet`, the celebration) | unchanged | sr-only clip on the voice | unchanged; the settle timer keeps running and is harmless in an sr-only box |

The keyframes, added beside `ink-write-in` at `index.css:1115` and named as its mirror:

```css
@keyframes ink-rub-out       { from { clip-path: inset(0 0 0 0) } to { clip-path: inset(0 100% 0 0) } }
@keyframes ink-rub-out-fade  { from { opacity: 1 }                to { opacity: 0 } }
```

Only the graphite tone settles. `data-note-age` is set by a timer inside MarginNote (it owns the
rendering of age the way it owns the write-in), armed on every `text` change, cleared on the
next, and gated on `tone === "graphite"`; the verdict tones are pinned at full pressure because
68% of teacher-red is 3.04:1 light and 68% of gold is 2.70:1 light (the family's own table,
`logs/e9-grammar-*.json`). The tally (`.margin-note-meta`) is already at the quiet rung and is
untouched.

### 2.2 `GameBoard.vue` — the three lives, stated as what retracts each

Four writers, one strip, unchanged in number. What changes is the refusal's clock and the
repeat, both in the board's own file:

| voice | tone | arrives | retracted by (each → rub-out, 1 beat) | ages |
|---|---|---|---|---|
| hint | graphite | first H press | your write · the second H press · deal · clear · fill · solve · a PEER's write only on `{hint.cell} ∪ becauseCells` (the `is-because` set the board already highlights; 1 cell for a naked single, 9 for a hidden single) · a newer note (out-in) | settles at 8 beats, then waits for an act; NO clock |
| conflict verdict | teacher-red | a failed solve | the grade reverting to idle (`GameBoard.vue:750`, unchanged) | never (a grade you can barely read is a grade you doubt) |
| solved | gold | a solve | the grade reverting (same arm) | never |
| refusal | teacher-red | a keystroke on a given | your ink that LANDS · deal · fill · **24 beats after the LAST refusal** (`lastRefusal.seq` bumps per attempt, so the second refusal restarts the clock) · a peer's write: never | never settles (red at 68% fails); it LEAVES instead |
| receipts (`the board is clear`, `still solving…`) | graphite | clear / a slow solve | the next writer | settle at 8 beats like any graphite line |

The refusal clock is the ONE timer in this family and the one number without a measurement
behind it: 24 beats = 3.0s, the house's ratified "moment" (CELEBRATION's ≤3.2s crest), banded to
40 beats (5.0s, what a reading-time heuristic gives a four-word line) for the owner's eye at the
re-look. It does not pause on hover or focus: the strip is `pointer-events: none` at two levels,
the estate has no pause idiom, and the message is not one the reader must act on — the given is
still a given, the cell still wears the shake, and pressing the key again re-says it. The live
region's announcement is not retracted by the rub-out; the ink is. That is the whole of the
WCAG 2.2.1 answer, stated once.

### 2.3 `useGameState.ts` — the authorship seam (W1's file; specified, handed, not cut here)

`../research/NOTE-ERASE/proto/authorship-seam.diff`, as written: `WriteOrigin = "self" | "peer"`,
a defaulted third parameter on BOTH write primitives (`applyCellValue` at :474 AND `applyHintInk`
at :537, because a peer's REVEAL on the named cell is a write too and today nulls nothing),
supplied at the one call site that knows (`sessionSource.applyValue`, :374-375):

```
if (origin === "self" || armedHintTurnsOn(pos)) hintReasoning.value = null;
if (origin === "self")                          lastRefusal.value  = null;
```

Half of it (applyCellValue alone) ships half a cure. The five unit rows it earns are named in
the diff and belong to W1's suite.

---

## 3 · Desktop and mobile, light and dark

There is one construction at every width: the strip keeps its single reserved line
(`.margin-note-block { min-height: 1.3em }`), and nothing this family does changes a layout
box. The exit is clip + opacity on the span; the settle is colour. Measured `filter: none` and
`transform: none` on the span and every ancestor through the whole verb, both engines, 390×844
and 1280×800 (`dirtyAncestors: []` in all eight cells).

| surface | 390×844 (in-flow strip, 258px line) | 1280×800 (overlay strip) |
|---|---|---|
| fresh note | 16px, full graphite, 20.80px line at y 594.13 | 18.176px, 23.63px line |
| settled note | same box, ink #6b6a6a light / #93928c dark | same |
| rub-out | 125ms, 16 clip states chromium / 9 webkit | 125ms, 16 / 9 |
| board displacement | 0 | 0 |

Light and dark differ only in the tokens' theme arms; the settle rung clears AA in both by
painted bytes, and the two banked crops (`../research/NOTE-ERASE/frames/note-quiet-{light,dark}-
chromium.png`) are the only frames this family needs.

## 4 · Copy

No string is minted, moved or re-rendered. `check-copy-register.mjs` (0 dashes, 0 unadmitted)
and `check-font-coverage.mjs` (Patrick Hand 46 codepoints / 4312 B) do not move.

One behaviour that LOOKS like copy is cured for free: refusing the same given twice writes the
same string, `:key="text"` never changes, the write-in never replays and the atomic live region
announces nothing (measured: 0 animationstarts, 0 mutations, both engines). `setMargin` takes
the board's own `announce()` idiom (`GameBoard.vue:659`): when the incoming text equals the
standing text, write `""` first and the text on the next flush. With `mode="out-in"` that is a
rub-out and a fresh write-in — two region mutations where there were none.

## 5 · What this family does NOT do, so the next pass does not re-mint it

- No dismiss control. A hand-drawn page does not get an ✕; the strip passes pointers through
  and a 44px target is chrome a note has not earned.
- No clock on the hint. Any N over ~20 beats is unobservable (every act that would restart it
  also retracts the note), and the only regime where it shows is the long think.
- No new rung on the ink ramp, no new fill admission, no new filter, no new string.
- No retraction on "Escape to the gallery": Escape is the deck's key and does nothing from a
  board; `g` and the wordmark park the whole layout at `display: none` (the note is neither
  painted nor in the a11y tree) and cancelling returns the same board with the same still-true
  sentence. That row becomes one assertion in a suite, not a mechanism.

---

## PLAN — files, order, what dies

1. `src/pencil/config/pencilConfig.ts` — add `MOTION.note` (§1.1). Nothing else reads it yet.
2. `src/assets/index.css` — add `ink-rub-out` + `ink-rub-out-fade` beside `ink-write-in` (:1115);
   the PRM block at :1157 already covers `.margin-note-ink` and needs no edit. The `--ease-accelIn`
   comment gains its sixth consumer by name.
3. `src/pencil/chrome/MarginNote.vue` — wrap the keyed span in `<Transition name="note"
   mode="out-in">`; move the write-in onto `.note-enter-active` (the bare `.margin-note-ink`
   animation dies with it); add `.note-leave-active` with the rub-out; add the settle timer,
   `data-note-age`, and its colour rule; v-bind the three `--note-*-ms` from MOTION. `.margin-
   note-meta` keeps its own write-in unchanged.
4. `src/games/shared/GameBoard.vue` — `setMargin` gains the repeat clause (§4); the refusal watch
   arms a `refusalHoldBeats × beatMs` timer keyed on `r.seq`, cleared by every writer through
   `setMargin`, firing `setMargin("", "graphite")` only while `refusalNoteLive`.
5. `src/games/shared/useGameState.ts` — the seam, by W1, from the banked diff, with its five unit
   rows. This spec can land before it (rows 4–5 of the gates stay RED until it does) but not
   without naming it.
6. `src/pencil/config/filterBudget.ts` — untouched; the gate proves it (no fill, no filter).

Dies: the `250ms` literal at `MarginNote.vue:149` (comes home as `writeInBeats: 2`); the class
of notes that never leave (R4's M2 row); the peer-anywhere wipe (`useGameState.ts:487-488`
reached from :375); the refusal that stands for the rest of the session; the silent repeat.

Order matters once: step 3 must land with step 2 in the same commit (the leave class needs its
keyframe, or Vue computes a 0ms leave and the exit is a cut).

## PROTOTYPE BRIEF — the smallest runnable build on the real surface

Build steps 1–4 above on a throwaway worktree under the scratchpad (never the main tree;
`git worktree remove` when done), plus the seam diff applied in that worktree only, so the
peer rows can be measured. Dev server from `web/frontend`: `npx vite --host 127.0.0.1 --port
4249 --strictPort` (the lane's port; next free in 4230–4249 if taken). Scratch playwright config
(`../research/NOTE-ERASE/probe/pw.config.ts`, baseURL only), chromium + webkit headless,
390×844 dsf3 and 1280×800, light and dark, PRM off and on. Copy `probe/` to a scratch dir
carrying a `node_modules` symlink to `web/frontend/node_modules` before running.

**Poses to screenshot** (crops ≤150 KB, ≤6 total, both engines where the pair differs):

1. the settled hint at 8 beats + 1, light and dark, 390×844 (one crop per theme — the claim a
   number could be doubted on; the two banked crops are the control)
2. the rub-out at t = 62ms (mid-verb), 390×844 chromium, one crop: the line visibly shorter from
   its END, not dimmer from everywhere
3. a replacement mid out-in at t = 200ms (old gone, new half written), 1280×800

**Measurements that mean success** (`erase.probe.ts` E1–E9 re-run under the build, plus the
new rows):

- E2 frame trace: `filter: none`, `transform: none` on the span and every ancestor across the
  verb; distinct clip states ≥ 9 (webkit) / ≥ 12 (chromium) at 125ms; the span is ABSENT from
  the DOM at ended + 1 frame (the no-fill trap, §2.1); under PRM the span is absent on the same
  frame as the retraction and `animationName` reads `none`
- E3/E3b: painted contrast of the settled note ≥ 4.5 both themes, DPR 1 and 3 (expect 5.17 /
  6.07); the verdict tones at 8 beats + 1 unchanged from full pressure (expect 4.87 / 6.44 red,
  4.85 / 11.48 gold)
- E4 on `?wire=local`: join → stands; peer elsewhere → stands; peer on `hint.cell` → rubbed out;
  peer on a `becauseCells` member → rubbed out; peer REVEAL on `hint.cell` → rubbed out; peer
  anywhere → the refusal stands
- E6: the refusal absent at 24 beats + 1 frame and present at 23 beats; a second refusal at
  beat 12 keeps it present at beat 30 and absent at beat 37
- E9 repeatRefusal: 2 animationstarts, 2 live-region mutations (was 0 / 0)
- E7 (the arm-(a) control): with the note settled and the model still armed, the next H press
  INKS THE DIGIT — that is correct under arm (b) and the row stays, so nobody re-opens the clock

**Censuses to re-run unchanged** (π on every surface this family does not claim):

- `r0/r3-marks/probe/marks.probe.ts` R3-d and `marks2.probe.ts` R3-g — 15/15 rows reproduce
  except the ones this family changes by design (30s idle: now settled, still standing; any digit:
  now rubbed out over one beat, still `""` after)
- `r0/r3-marks/probe/wobble.probe.ts` + `budget.probe.ts` — ring σ and live-filter count 9,
  unmoved
- `r0/r2-accent-family/probe/hue-census.probe.ts` — no new chromatic token (the census row count
  is unchanged at 29)
- `r0/r1-controls/probe/heading-voice.spec.ts` — unmoved (a control; §7 touches no heading)
- `e2e/filter-census.spec.ts` G3.2 — `FILL_ALLOWLIST` equals the authored forwards sites, still
  one row; `npm run lint:ink` (`check-ink-pressure.mjs`) — ladder unchanged, all three scopes;
  `check-copy-register.mjs` / `check-font-coverage.mjs` — unmoved; `GameBoard.receipt.test.ts`
  — green untouched; goldens 4/4 unmoved (DELTA: none declared; the note is in no golden)

## GATES — born-RED instruments this family lands with

Written before the cure, run at HEAD, each with its exact expected/received:

1. **the exit exists** — retract a hint (type a digit) and the `.margin-note-ink` span reports a
   computed leave animation of `rubOutBeats × beatMs` and is gone at ended + 1 frame. HEAD:
   RED (the span is removed same-frame with no verb; R4 M2).
2. **the settle** — a graphite note at 8 beats + 1 paints at ≥ 4.5:1 and ≤ 7:1 (the quiet rung,
   not full pressure), both themes, painted bytes. HEAD: RED (14.52 / 12.25).
3. **verdicts never settle** — teacher-red and gold at 8 beats + 1 paint at full pressure. HEAD:
   GREEN by construction; kept as the negative control that catches a settle applied to `.margin-
   note` instead of the graphite tone.
4. **the peer rows** (needs the seam) — elsewhere stands / named cell erases / because-cell erases
   / reveal on the named cell erases / refusal untouched. HEAD: RED / green-for-the-wrong-reason /
   green-for-the-wrong-reason / RED / RED.
5. **the refusal leaves** — absent at 24 beats + 1 frame; a second refusal restarts. HEAD: RED
   (standing at 30s).
6. **the repeat speaks** — the same refusal twice yields 2 live-region mutations. HEAD: RED (0).
7. **PRM immortality guard** — under PRM the retraction removes the span on the same frame.
   HEAD: GREEN (there is no verb to wait on); it exists to catch an `animationend` listener.
8. **no fill, no filter** — G3.2 exact match with the allowlist unchanged; filterBudget 9 exact
   both engines, both regimes. HEAD: GREEN; a guard.
9. **the note cannot outlive its board** — `g` from a board, then cancel: the same sentence at
   the same box; `g`, then deal: `""`. HEAD: GREEN; one assertion, no mechanism.
