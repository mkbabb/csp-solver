# NOTE-ERASE · THE ERASER — pass-3 design spec

T9-W7 §7, the hint note's lifecycle. Synthesized from the pass-3 research
(`../research/NOTE-ERASE/README.md`, four-arm lab on the estate's Vue 3.5.39, both engines), the
pass-2 spec and critique, the chair's rulings (`../CHAIR-RULINGS.md`) and the frontend-design
method's two passes. A spec, not a cut; nothing closes (U-10). Incompatible with NOTE-LEDGER by
construction; the agglomerator decides.

**What pass 3 changes, in one paragraph.** The settled note's exit was two defects, not one: a
wrong DROP CLOCK (Vue takes `max(transition, animation)` off the leaving node, so the 350 ms colour
settle outranks the 150 ms rub-out) and a wrong REST POSE (`ink-rub-out` has no fill, so at 150 ms
the cascade stands the line back up). Arm D cures both: **`.note-leave-to` is the load-bearing
half** (the rest pose IS where the keyframe ends, the house's own fill discipline satisfied by
deletion, and it survives any transition a palette lane later puts on the element) and the
compound selector is the honest clock. The PRM arm comes home to the site in the shape of the
three `<Transition>`s the estate already ships. The repeat's hole becomes one BEAT, timed from
Vue's own `@after-leave`, in ONE helper shared with `announce()` (whose own hole is a microtask,
so W3's is the class's second occurrence). The rungs are consumed bare under chair §6.5, which
makes gate 13 satisfiable as first written. The memorable thing is unchanged: the line leaves
from its end backward.

---

## 1 · Tokens (nothing minted; three rungs consumed bare, clocks in beats)

| role | token | light | dark | note |
|---|---|---|---|---|
| paper | `--color-background` | #fbfaf9 | #110f0e | |
| ink, fresh | `--color-pencil-graphite` | #262626 · 14.52:1 | #d1cfc7 · 12.25:1 | unchanged |
| ink, settled | `--ink-press-quiet` (68 %) | painted **5.19:1** | painted **6.14:1** | ≥ 4.5 both themes; `gateNote` (NOTE-LEDGER's seat) |
| teacher-red (refusal, conflict) | `--color-red-ink` | #d02a52 · 4.87:1 | #ff5c7c · 6.44:1 | full pressure only; never settles |
| gold (solved) | `--color-gold-ink` | #8c691d · 4.85:1 | #e5c74d · 11.48:1 | full pressure only; the painted witness is the vignette's node |
| the write-in | `--motion-note` | 250 ms | | **`var(--motion-note)` bare** — no fallback (§6.5) |
| the rub-out | `--motion-whisper` | 150 ms | | bare; frame bar 18 chromium / 8 webkit |
| the settle step | `--motion-dusk` | 350 ms | | bare; a colour step, nothing geometric |
| write-in curve | `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | | |
| rub-out curve | `--ease-accelIn` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | | the laminate's lift-away; sixth surface |
| settle curve | `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | | |

Type untouched: `--font-hand` at `--type-body`, leading 1.3, tracking 0.02em.

### 1.1 The motion home — the ladder is §13's; this family owns two clocks and no rung

```ts
// pencilConfig.ts — clocks in BEATS of MOTION.beatMs (125); cadences, never verbs.
note: {
  settleAfterBeats: 8,     // 1000 ms after a graphite note lands it stops being the loudest ink
  refusalHoldBeats: 24,    // 3000 ms from the LAST refusal. BALLOT 24–40, both ends derived (§2.4)
},
```

The verbs read §13's rungs (`note`, `whisper`, `dusk`) — this family's `MOTION.rungs`,
`publishMotionRungs()` and the `main.ts` call **all die** (§2.1; the byte-equal-fallback SHAPE
was grafted to the ladder and is now superseded by §6.5's `@property` + no-fallback). The
registration is §13's, with `initial-value: 0ms` (MOT-LADDER's pass-3 row E): an absent
publisher then reads every rung as instant and the exit gate reds. Under PRM the ladder publishes
0 ms and this family's site arm says so a second time.

**The failure mode, declared.** Registered at 0 ms, an unpublished `--motion-whisper` makes the
rub-out a 0 s animation: the note vanishes with no exit. Unregistered, `animation: ink-rub-out
var(--motion-whisper) …` is invalid at computed-value time (`animation-name: none`, MOT-LADDER
row I): the same vanish. Either way LOUD, and gate 1 catches it. Louder than pass 2 shipped, and
said here.

`+ 17` dies. The one wait in this family is a BEAT (`MOTION.beatMs`, R6 law 4 satisfied with zero
new constants), and MOT-VERB's delay fence applies: a wait is never a rung.

---

## 2 · Components and states

### 2.1 `MarginNote.vue` — the keyed span gains an exit with a rest pose

```
<Transition name="note" mode="out-in" @after-leave="$emit('left')">
  <span v-if="text" :key="seq" class="margin-note-ink" :data-note-age="age">…</span>
</Transition>
```

```css
.note-enter-active { animation: ink-write-in var(--motion-note) var(--ease-noteWrite) backwards; }
.margin-note-ink[data-note-age="settled"] {
  color: var(--ink-press-quiet);
  transition: color var(--motion-dusk) var(--ease-standard);
}
/* The exit. Two halves, and the -to is the belt: it is the cascade's rest pose while the leave
   runs, so when the keyframe releases nothing moves (index.css:985-990, as `bloom-out`). The
   compound selector is the honest clock: Vue reads max(transition, animation) off the leaving
   node, and the settle's colour transition must not outrank the rub-out. (0,4,0) with the scope
   attribute beats the age rule's (0,3,0). */
.note-leave-active {
  animation: ink-rub-out var(--motion-whisper) var(--ease-accelIn),
             ink-rub-out-fade var(--motion-whisper) var(--ease-accelIn);
}
.margin-note-ink.note-leave-active[data-note-age] { transition: none; }
.note-leave-to { clip-path: inset(0 100% 0 0); opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .note-enter-active, .note-leave-active { animation: none; }
  .margin-note-ink[data-note-age] { transition: none; }
}
```

No fill on the rub-out — `FILL_ALLOWLIST` gains no row; `backwards` with no delay paints nothing
and would be ceremony. `index.css:1163` (`.margin-note-ink` in the global PRM block) stays exactly
where it is for the write-in; the site arm is the family's own and gate 7's static half asserts
THIS block, not another file's.

| state | class / attribute | what paints | motion |
|---|---|---|---|
| **writing** | `.note-enter-active` | clip `inset(0 100% 0 0)` → `inset(0)` | `ink-write-in` on `note` |
| **fresh** (0–8 beats) | no attribute | full pressure | none |
| **settled** (8 beats on; `record` and `state` only) | `data-note-age="settled"` | quiet ink | colour on `dusk`; PRM a step |
| **rubbing out** | `.note-leave-active` + `.note-leave-to` | clip `inset(0)` → `inset(0 100% 0 0)`, opacity 1 → 0, and the cascade already standing there when the animation releases | `whisper` on `--ease-accelIn`; Vue drops the node on the ANIMATION clock (150 > 0) |
| **replaced** (a different sentence) | old leaves, new enters | `out-in`: rub-out then write-in, **400 ms** | no empty frame in the region |
| **repeated** (the same sentence) | old leaves, region `""` for one beat, new enters | the hole opened on purpose: `@after-leave` → one beat → re-write; **525 ms** | the empty IS the announcement |
| **PRM** | site arm + `index.css:1163` + the ladder's 0 ms | `animationDuration "0s"`, `transitionDuration "0s"`; the node removed same-frame | three arms, one static (gate 7) |
| **parked** (`props.parked`) | per kind | a `reply` rubs out on the park; a `record` stands | the park is a writer (§2.3) |
| **quiet** (celebration) | unchanged | sr-only voice | any verdict-tone gate asserts `is-quiet === false` first |

Ageing is by KIND (the graft from NOTE-LEDGER): `record` and `state` settle; `grade` never; **`reply`
(the refusal) is the fifth kind, holds, never settles, leaves.** `.margin-note-meta` keeps its own
write-in on `var(--motion-note)` bare.

The (0,1,0) trap is ARMED in this family (the node carries `data-note-age`); the compound selector
is the cure and gate 16 reads computed `animation-name` and `transition-duration` DURING a settled
leave, never the stylesheet.

### 2.2 `GameBoard.vue` — five kinds, one counter, one hold, ONE repeat helper

```ts
type MarginKind = "record" | "grade" | "state" | "reply" | "empty";
let writeSeq = 0;
let pendingRepeat: { seq: number; write: () => void } | null = null;

/** The live-region law's third clause, timed: empty, wait ONE BEAT, re-write under a seq guard.
 *  `announce()` and the margin both use it; the only number is MOTION.beatMs. */
function afterBeat(seq: number, write: () => void) {
  setTimeout(() => { if (seq === writeSeq) write(); }, MOTION.beatMs);
}

function setMargin(text: string, tone: Tone, kind: MarginKind) {
  const seq = ++writeSeq;
  pendingRepeat = null;
  clearRefusalHold();
  if (text && text === marginText.value) {                 // the repeat
    marginText.value = "";                                 // the leave starts
    pendingRepeat = { seq, write: () => { marginText.value = text; marginTone.value = tone; marginKind.value = kind; marginSeq.value = seq; } };
    return;                                                // the re-write waits for the node
  }
  marginText.value = text; marginTone.value = tone; marginKind.value = kind; marginSeq.value = seq;
}
function onNoteLeft() {                                    // MarginNote's @after-leave → 'left'
  if (pendingRepeat) afterBeat(pendingRepeat.seq, pendingRepeat.write);
}
function announce(line: string) {                          // T9-W3 §3.5, re-timed
  if (boardVoice.value !== line) { sayBoard(line); return; }
  sayBoard("");
  afterBeat(++writeSeq, () => sayBoard(line));
}
```

`kind` is REQUIRED (TS2554 names the twelve call sites); `hintNoteLive` / `refusalNoteLive` die
(the kind is the predicate); the idle stale-clear at `:780` keys on `kind === "grade"`, not tone.

**The hole, with its basis (charter rows 6, 7).** As built, the AT-observable empty on a repeat is
13 ms chromium / 8 ms webkit (the node's removal to the re-write); `announce()`'s is ~0 ms (a
microtask). The prior art's clear-then-set floor is 100–150 ms (WordPress core #36853, the
practitioner 100 ms figure; background, not verdict). One beat is 125 ms, inside that band, from a
constant the house already owns. Cost: a repeat replaces at whisper + beat + note = 525 ms, a
different sentence at 400 ms — declared latencies the owner sees at the re-look. The device row
(M19) confirms; it no longer carries the whole of SC 2.2.1's defence alone.

**W3's file moves one line**: `announce()`'s `nextTick` becomes the same beat. Declared as the
class row's second occurrence (chair's to book), not smuggled.

| voice | kind | tone | retracted by (each → rub-out) | ages |
|---|---|---|---|---|
| hint | `record` | graphite | your write · the second H · deal · clear · fill · solve · a peer's write only on `{cell} ∪ because` · a newer note | settles at 8 beats; no clock |
| conflict verdict / solved | `grade` | red / gold | the grade reverting | never |
| refusal | **`reply`** | red | your ink that LANDS (self, incl. a revealed digit — gap 8) · deal · fill · the park · `refusalHoldBeats` from the LAST refusal · a peer's write: never | never; it leaves |
| receipts | `state` | graphite | the next writer | settles |

### 2.3 The park — "a reply outlives the act it answered"

Restated (charter row 9): the parked note is CLIPPED by `.live-face-slot { overflow: hidden }`
(`GameCard.vue:456-461`), 2.6 px below the slot, not painted. The `parked` prop still beats a
rect-against-clipping-ancestor test because the rect test is a coincidence of today's layout
(`checkVisibility()` has no option for an ancestor's clip; a slot one line taller paints it) and
because the reason is not visibility at all: a reply answered a keystroke on THIS board, and a
board folded into a deck card is not the board being written on. So the park is a WRITER:

```
App.vue:89-93   Scene: FunctionalComponent<{ leaving?: boolean; parked?: boolean }>
App.vue:864     :parked="view !== 'playing'"
GameShell.vue → BoardHost.vue → GameBoard.vue   (three forwards, exactly as `leaving`)
GameBoard.vue   watch(() => props.parked, p => { if (p && marginKind.value === "reply") setMargin("", "graphite", "empty") })
```

The watch and all four forwards land in ONE hunk so a U-10 revert is one hunk. The fold's
`BoardHost.vue` hunks (`:84-110`, `:259`, `cellAuthors`) are adjacent, not overlapping. G9 splits
per kind: G9a a `record` survives the park at the same box; G9b a `reply` is `""` within one
rub-out OF THE PARK. G9b is a behaviour change the owner sees (U-10).

### 2.4 The hold, derived, and the SC

`hold ≥ writeIn + notice + words × msPerWord`: fast 250 + 1000 + 4 × 333 = 2,582 → **24 beats**;
slow 250 + 2000 + 4 × 667 = 4,918 → **40 beats**. Default 24, ballot 24–40 (U-10). Gate G-hold is a
unit row computed from `MOTION` and the string. SC 2.2.1's defence (the given still shows, the cell
wears the shake, pressing again re-says it) is load-bearing on §2.2's repeat; SC 4.1.3 is what the
repeat serves; the M19 device row is what hears it.

### 2.5 `useGameState.ts` — the seam, `origin` REQUIRED, and gap 8 closed

`WriteOrigin = "self" | "peer"` required on `applyCellValue` AND `applyHintInk`; the `= "self"`
default dies; TS2554 names the six sites (`:298 :301 :375 :500 :735` + the annotation at `:373`).
The predicate on both primitives:

```
if (origin === "self" || armedHintTurnsOn(pos)) hintReasoning.value = null;
if (origin === "self")                          lastRefusal.value  = null;   // applyHintInk gains this line (gap 8)
```

Measured at HEAD: `applyHintInk` (`:537-547`) clears `values`, `solvedValues`, `animatingCells`,
`solveState` and nothing else. One line, one unit row. W1's file; specified and handed with its
seven unit rows.

---

## 3 · Desktop and mobile, light and dark

One construction at every width; nothing this family does changes a layout box
(`.margin-note-block { min-height: 1.3em }` holds the strip). `filter: none`, `transform: none` on
the span and every ancestor through the verb.

| surface | 390×844 | 1280×800 |
|---|---|---|
| fresh | 16 px, full graphite, 20.80 line | 18.18 px, 23.63 line |
| settled | same box, painted 5.19 light / 6.14 dark | same |
| rub-out | 150 ms; node gone ≤ whisper + 1 frame (lab: 150.3 / 159); **0** restored-ink frames (was 25 / 13); ≥ 18 / ≥ 8 distinct clip states | same |
| the park | clipped, unpainted; a `reply` leaves within one rub-out of `g` | same |
| board displacement | 0 | 0 |

Light and dark differ only in the token arms. The verb photographed live in pass 2
(`pass2/…/frames/midErase-*.png`) is cited, not re-shot.

## 4 · Copy

No string minted, moved or re-rendered; `that's a given clue` (`GameBoard.vue:747`) is unmoved by
the fold. `lint:copy` and `check-font-coverage` do not move.

## 5 · What this family does not do

No dismiss control; no clock on the hint; no new rung; no fill admission; no filter; no chromatic
token; no layout box; no focus move (PLR-SELF's escape-refocus rule considered and N/A: the strip
is `pointer-events: none` and holds no focusable node). The ONE declared π move is the replacement
latency: +150 ms for a different sentence (unchanged from pass 2), +275 ms for a repeat (was +167).

---

## PLAN — files, order, what dies

1. `src/pencil/config/pencilConfig.ts` — `MOTION.note = { settleAfterBeats: 8, refusalHoldBeats:
   24 }` only. This family's `MOTION.rungs` and `publishMotionRungs()` DELETED; `main.ts`'s call
   deleted. The rungs are §13's.
2. `src/assets/index.css` — `ink-rub-out` + `ink-rub-out-fade` beside `:1115` (shared with
   NOTE-LEDGER, one pair); `:1157-1171` UNTOUCHED; the `--ease-accelIn` roll-call at `:341-344`
   loses its enumeration and keeps the role sentence (`:336-338` is the block's own law).
3. `src/pencil/chrome/MarginNote.vue` — the block in §2.1 verbatim; `seq`, `kind` props; the
   `left` emit on `@after-leave`; the settle timer keyed on `kind`; every duration literal (`:13`,
   `:25`, `:149`, `:180`) → the bare rung; comments name the rung, never a number.
4. `src/games/shared/GameBoard.vue` — `writeSeq`, `marginKind`, `marginSeq`; `setMargin(text,
   tone, kind)` required; `afterBeat` shared by the repeat and `announce()`; the refusal hold on
   `refusalHoldBeats × beatMs`; the `parked` watch. Import block re-cut toward the fold
   (`useCoarsePointer` stays; named in the return).
5. `src/App.vue`, `src/games/shared/GameShell.vue`, `src/games/shared/BoardHost.vue` — `parked`,
   one hunk with step 4's watch.
6. `src/games/shared/useGameState.ts` — `origin` required on both primitives + the gap-8 line, with
   seven unit rows (W1's file, handed).
7. `scripts/check-ink-pressure.mjs` — NOTHING of this family's own: its consumer string
   `.margin-note-ink[data-note-age="settled"]` and two self-test cases are handed to NOTE-LEDGER's
   `gateNote` (§2.3); this family's copy dies.
8. `GameBoard.notes.test.ts` — replayed on top of B1b's sentences; the new rows added.

Dies: the four `250ms` literals AND their `var(…, 250ms)` fallbacks; `:key="text"`; the `nextTick`
re-write; `+ 17`; `origin = "self"`; the `--ease-accelIn` enumeration; the tone-as-age proxy;
`hintNoteLive` / `refusalNoteLive`; this family's rungs, publisher, gateNote copy; the refusal that
outlives its board; the silent repeat; the peer-anywhere wipe; the exit that snapped back.

Order once: step 3 with step 2 in one commit (the leave class needs its keyframe); step 4's watch
with step 5's prop (a watch on an undeclared prop passes G9b for the wrong reason); step 1's
deletions with step 3's bare `var()` reads (bare reads with no ladder in the worktree are the loud
failure — the prototype states whether MOT-LADDER's publisher is in its tree, and if not, lands
the registration + publisher from MOT-LADDER's diff by copy, declared as §13's).

## PROTOTYPE BRIEF — the smallest runnable build on the real surface

Build steps 1–8 on the pass-2 worktree replayed onto `74a2b5d9` (`git diff a8fee1f5` on the
pass-2 tree; the import-block hunk re-cut toward the fold; `GameBoard.notes.test.ts` re-read).
Dev server from `web/frontend`: `npx vite --config <evidence dir>/probe/vite.scratch.mjs --host
127.0.0.1 --port 4248 --strictPort` (private `cacheDir`); the HEAD control on the next free port in
the band, named `74a2b5d9`. Probes import playwright by absolute path from `node_modules`.
chromium + webkit; 390×844 dsf3 and 1280×800; light and dark; PRM off and on. Kill both servers;
verify the ports free. No `npm run build` on main; the built-dist rows need a dist built IN the
worktree, and whether W8 §8.1's freeze has lifted is the orchestrator's answer, stated in the return.

**Crops (≤4, ≤150 KB):**
1. 390 chromium, the settled exit at t ≈ whisper + 2 frames: the strip EMPTY where pass 2 showed a
   full line standing (the plateau's absence is the claim; the number is beside it)
2. 390 chromium, the repeat at t = removal + 60 ms: the strip empty between two identical refusals
   (the hole, on purpose, now a beat wide)
3. 1280 webkit, the reply under the park one frame after `g` + whisper, a `record` control beside it
4. none for the verb: pass 2's `midErase-*.png` are the live frames

**Numbers that mean success:**
- **the settled exit** (the must-fix): arm, wait past 8 beats + 1, retract; on every frame after
  `whisper` no sample reads `clip-path: none`; node gone ≤ whisper + 1 frame (expect ~150 / ~159);
  restored-ink frames **0** (was 25 / 13); DURING the leave `getComputedStyle(span)` reads
  `animation-name` `ink-rub-out, ink-rub-out-fade` and `transition-duration` `0s`; both engines
- **the fresh exit**: unchanged, ≥ 18 chromium / ≥ 8 webkit distinct clip states, span absent at
  ended + 1 frame; `filter: none`, `transform: none` on the span and every ancestor
- **the -to pose as the rest pose**: the last present sample reads `inset(0px 100% 0px 0px)` at
  opacity 0 (arm C's signature) even with the compound selector deleted (a negative control run)
- **the repeat, as a trajectory**: `[X, "", X]` at mutation time; the empty window ≥ `beatMs` − 1
  frame (expect ~125, was 13 / 8); `ink-rub-out` starts once; `announce()`'s deal repeat shows the
  same window on `useLiveRegion`'s node
- **the settle**: `data-note-age="settled"` at 1000 ms ± 1 frame; painted ≥ 4.5 both themes (expect
  5.19 / 6.14) with the per-channel cross-check ≤ 12; verdict tones at 8 beats + 1 unchanged; gold
  read off `CompletionVignette`'s node after a REAL solve with `is-quiet === false` asserted first
- **the hold**: a `reply` present at 23 beats, leaving at 24, absent at 24 + whisper + 1 frame; a
  second refusal at beat 12 keeps it to 36; G-hold green at 3000 ≥ 2582; the refusal-vs-peer row
  asserted INSIDE the hold on both engines (charter row 12)
- **the park**: G9a `record` same sentence same box after `g` + cancel; G9b `reply` `""` within one
  rub-out of `g`
- **the peer rows** on `?wire=local`: join stands · elsewhere stands · named cell erases · a
  distinct because-member erases (force a hidden single) · peer reveal erases · reply untouched;
  **self reveal clears `lastRefusal`** (gap 8)
- **the seam**: `vue-tsc` with `origin` required names six sites; seven unit rows green
- **the rungs**: `grep` for duration literals across every touched file = 0 (gate 13, original
  wording); `grep -c 'var(--motion-[a-z]*,'` = 0 (no fallback); DELETE the publisher → the exit
  row above reds (registration at 0 ms) — run once, banked, restored
- **PRM**: `animationDuration "0s"` and `transitionDuration "0s"` on the span; removed same-frame;
  the site block present in `MarginNote.vue` (static half)
- **π vs `74a2b5d9`**: board, controls, `scrollHeight` deltas 0 at 390 and 1280 across empty →
  fresh → settled → mid rub-out → parked; filterBudget 9 exact at 4×4 / 9×9 / 16×16 both engines
- the mechanical estate bare: `lint:ink` (NOTE-LEDGER's gateNote with this family's consumer),
  `lint:copy`, `lint:motion`, `lint:live-regions`, `lint:theme-*`, `lint:sleep`, `vitest run` on the
  touched test files

**Censuses to re-run** (copies with OUT re-pointed into `pass3/prototype/NOTE-ERASE/`; r0 frozen):
R3-d and **R3-g** (`r0/r3-marks/probe/marks2.probe.ts`, which runs under `reducedMotion: "reduce"`
so its five verdicts are unchanged by design; the reader amended with `age` + `leaving` in the copy,
`instruments/r3g-age.diff` proposed, r0 row MOVED); `wobble.probe.ts` + `budget.probe.ts`;
`r6-idiom-history/hue-census.mjs` on BOTH engines this time; `heading-voice.spec.ts` unmoved;
`e2e/filter-census.spec.ts` G3.2 source half now, built half + goldens 4/4 on a worktree dist if
the freeze has lifted, else OWED and said so.

## GATES — born-RED instruments this family lands with

1. **the exit exists, both states** — retract a fresh note AND a settled one; computed rub-out on
   `--motion-whisper` during the leave; gone at whisper + 1 frame; **no post-verb frame reads
   `clip-path: none`**. Pass-2 build: fresh GREEN, settled **RED** (25 / 13 restored frames).
2. **the rest pose** — with the compound selector removed, the last present sample is
   `inset(0 100% 0 0)` at opacity 0. Pass-2 build: RED.
3. **no duration literal anywhere touched** — `grep` = 0 across the diff, and no `var(--motion-*,`
   fallback. HEAD: 4 in `MarginNote.vue`; pass-2 build: 3 + one `+ 17`.
4. **PRM at the site** — the static block in `MarginNote.vue`; live `animationDuration "0s"` +
   `transitionDuration "0s"` + same-frame removal. Pass-2 build: static half RED.
5. **the rungs are consumed, not minted** — `MOTION.rungs`, `publishMotionRungs` absent from this
   family's diff; three reads (`note`, `whisper`, `dusk`). Pass-2 build: RED (a second publisher).
6. **the repeat speaks, one beat wide** — `[X, "", X]` with the empty ≥ beatMs − 1 frame, on the
   margin and on `announce()`'s region. Pass-2 build: RED (13 ms); HEAD `announce`: RED (~0 ms).
7. **delete the publisher** — the exit row reds (0 ms registration). Born with §13's registration.
8. **gap 8** — a self reveal clears `lastRefusal`; unit row. HEAD: RED.
9. **the park, per kind** — G9a GREEN; G9b RED at HEAD and on pass 1.
10. **G-hold** — 24 × 125 ≥ 250 + 8 × 125 + 4 × 333.
11. **the seam is required** — `vue-tsc` fails on a bare call to either primitive. RED once the
    default dies.
12. **verdicts never settle** — `grade` at 8 beats + 1 at full pressure, `is-quiet === false` first;
    gold read off the vignette after a real solve (the painted witness). Pass 2: no witness.
13. **no fill, no filter** — `FILL_ALLOWLIST` unchanged; filterBudget 9. Guard.
14. **the frame bar is the engine's** — `distinctClipStates ≥ ⌊whisper / medianRafMs⌋`, same run.
15. **the quiet rung's note row** — `gateNote` under NOTE-LEDGER carries this family's consumer and
    its two self-test cases; RED if the consumer string is absent from the row.
16. **the (0,1,0) audit, armed** — during a SETTLED leave, computed `transition-duration` is `0s`
    and `animation-name` is the rub-out. Pass-2 build: **RED** (`0.35s`).
17. **the refusal-vs-peer row, both engines, inside the hold** — pass 2: chromium-only.

Objections carried in the return, not in a diff: (1) the repeat is 525 ms and the owner should see
it; (2) G9b changes what a reader gets back after a park; (3) `refusalHoldBeats` 24 is a default in
a 24–40 band; (4) re-timing `announce()` is W3's file and the class row is the chair's to book;
(5) the exit's failure under an absent publisher is now a vanish, not a no-op — louder by design.
