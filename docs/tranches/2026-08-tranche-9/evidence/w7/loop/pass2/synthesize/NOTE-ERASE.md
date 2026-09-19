# NOTE-ERASE · THE ERASER — pass-2 design spec

T9-W7 §7, the hint note's lifecycle. Synthesized from the pass-2 research
(`../research/NOTE-ERASE/README.md`, 18 readings both engines), the pass-1 spec, prototype and
critique, and the chair's rulings (`../CHAIR-RULINGS.md`). A spec, not a cut; nothing closes
(U-10). Incompatible with NOTE-LEDGER by construction; the agglomerator decides.

**The arm, stated once: arm (b) with ONE hold.** No clock on the hint; a settle at 8 beats; a
hold on the refusal alone, derived (§2.4). A note is pencil and leaves by being rubbed out, the
write-in's mirror; retraction is by the next thing that changes what the note said, with an
authorship-and-cell test so a peer's digit elsewhere leaves it standing.

Pass 2's research moved four things, and each is now in the design rather than beside it: the
same-sentence repeat is silent because `:key="text"` early-finishes the leave (Vue 3.5.39
`runtime-core.cjs.js:1534-1537`) AND because `mode="out-in"` never lets the region pass through
`""` — the key is necessary and not sufficient; a park does not hide the note, it paints it at
8.63 px inside the deck card, so the park must SAY so; the gold-dark 12.46 was the inline star,
not the ink; and the retraction set is exactly {1, n}. The one memorable thing is unchanged and
now photographed live (`frames/midErase-{chromium,webkit}.png`): the line leaving from its END
backward. Everything else is a change of pressure.

---

## 1 · Tokens (nothing minted; the verbs read §13's ladder, the clocks stay in beats)

| role | token | light | dark | note |
|---|---|---|---|---|
| paper | `--color-background` | #fbfaf9 | #110f0e | not the card; `index.css:134/:363` |
| ink, fresh | `--color-pencil-graphite` | #262626 · 14.52:1 | #d1cfc7 · 12.25:1 | unchanged |
| ink, settled | `--ink-press-quiet` (68 %) | **5.19:1** (rgb 106,106,106) | **6.14:1** (rgb 148,146,140) | token arithmetic, `probe/token-arithmetic.mjs`; painted agrees to ≤ 0.07 |
| teacher-red (refusal, conflict) | `--color-red-ink` | #d02a52 · 4.87:1 | #ff5c7c · 6.44:1 | full pressure only; 68 % = 3.03 light, forbidden |
| gold (solved) | `--color-gold-ink` | #8c691d · 4.85:1 | #e5c74d · **11.48:1** | full pressure only; the token comment at `index.css:382` is RIGHT; the 12.46 was the star |
| the write-in | `MOTION.rungs.note` → `--motion-note` | 250 ms | | the incumbent, named; brings home all FOUR `250ms` literals in `MarginNote.vue` (:13, :25, :149, :180) |
| the rub-out | `MOTION.rungs.whisper` → `--motion-whisper` | **150 ms** | | consumed from §13's ladder (see 1.1); the frame bar and the π latency are derived from whatever lands |
| the settle step | `MOTION.rungs.dusk` → `--motion-dusk` | 350 ms | | a colour step, nothing geometric; the house's dusk is a colour crossfade too |
| the write-in curve | `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | | unchanged |
| the rub-out curve | `--ease-accelIn` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | | the laminate's lift-away; the note is its sixth surface and the census, not the comment, says so |
| the settle curve | `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | | |

Type untouched: `--font-hand` at `--type-body`, leading 1.3, tracking 0.02em.

### 1.1 The motion home — verbs on rungs, clocks in beats

R6 law 4 is broken four times inside `MarginNote.vue`; all four come home. MOT-LADDER's pass-1
law is that a duration is a rung and `beatMs` is a cadence, not a rung (`MOT-LADDER.md §1.1`),
so the family's verbs read the ladder and only its CLOCKS stay in beats:

```ts
// pencilConfig.ts — the verbs are rungs (§13's home; consumed, never re-minted here):
//   write-in = rungs.note (250) · rub-out = rungs.whisper (150) · settle = rungs.dusk (350)
// the note's clocks, in beats of MOTION.beatMs (125) — cadences, not verbs:
note: {
  settleAfterBeats: 8,    // 1000 ms after a graphite note lands it stops being the loudest ink
  refusalHoldBeats: 24,   // 3000 ms from the LAST refusal. BALLOT 24–40, both ends derived (§2.4)
},
```

Published by the `--card-step-ms` precedent: MarginNote reads `var(--motion-note, 250ms)`,
`var(--motion-whisper, 150ms)`, `var(--motion-dusk, 350ms)` (fallback byte-equal to the rung,
MOT-LADDER's B3). The hold and the settle delay are JS timers in GameBoard / MarginNote and
never reach CSS.

**The duration, handed to §13 with its argument.** The family's own number is 125: it IS the
beat, the write-in is exactly two of it, half the arrival is the erase asymmetry, and it clears
webkit's frame bar with room (8 ≥ 7). But 125 is not on the ladder, and the ladder's own gate
(a `<style>` duration is a rung or an admitted class) would red it. So this spec CONSUMES the
nearest rung, `whisper` 150, and the two numbers that move with the ruling are stated for each
candidate rather than re-derived silently:

| rub-out | frame bar (⌊ms / median rAF⌋) chromium 8.4 / webkit 17.0 | declared replacement latency |
|---|---|---|
| 125 (the beat; the family's objection, banked) | 14 / 7 | +125 ms |
| **150 `whisper` (consumed)** | **17 / 8** | **+150 ms** |
| 200 `leave` (MOT-VERB's RUB OUT) | 23 / 11 | +200 ms |

The laminate's 200 lifts a full-bleed SHEET (opacity + transform); this rubs a LINE (clip +
opacity). Sharing the curve is the kinship; sharing the duration is not entailed. MOT-VERB's
rest-pose keyframe is not needed at any of the three: the node is removed, there is no rest pose.

---

## 2 · Components and states

### 2.1 `MarginNote.vue` — the keyed span gains an exit, an age, and the right key

```
<Transition name="note" mode="out-in">
  <span v-if="text" :key="seq" class="margin-note-ink" :data-note-age="age">…</span>
</Transition>
```

`:key="seq"` — a monotonic write sequence passed down from `setMargin`, never the string. With
the string as key, a repeat re-enters under the same key and `beforeEnter` calls
`leavingVNode.el[leaveCbKey]()` (Vue 3.5.39 `:1536`): the leave is finished early, the rub-out
never starts (`logs/n1-repeat-*`: 3 deliveries, text never `""`, `ink-rub-out` never fires).

| state | class / attribute | what paints | motion |
|---|---|---|---|
| **writing** | `.note-enter-active` | clip `inset(0 100% 0 0)` → `inset(0)` | `ink-write-in var(--motion-note) var(--ease-noteWrite) backwards` (the incumbent keyframe, `index.css:1115`) |
| **fresh** (0–8 beats) | no attribute | full pressure, the kind's own ink | none |
| **settled** (8 beats on; kinds `record` and `state` only) | `data-note-age="settled"` | `color: var(--ink-press-quiet)` | `transition: color var(--motion-dusk) var(--ease-standard)`; PRM: `transition: none` (a step) |
| **rubbing out** | `.note-leave-active` (`transition: none`, load-bearing) | clip `inset(0)` → `inset(0 100% 0 0)` + opacity 1 → 0 (the twin hides the anti-aliased tail) | `ink-rub-out var(--motion-whisper) var(--ease-accelIn)` + `ink-rub-out-fade`; NO fill; node removed by Vue at the computed duration |
| **replaced** (a DIFFERENT sentence) | old leaves, new enters | `mode="out-in"`: rub-out, then write-in; 400 ms total at `whisper` | the region's name goes X → Y with no empty frame. The critic's C1 strength ("out-in opens no announcement hole") holds HERE and only here |
| **repeated** (the SAME sentence) | old leaves, region `""` for the leave, new enters | `setMargin` writes `""` and re-writes on a cancellable timer at `whisper + 17 ms` (§2.2) | **the hole is opened on purpose for one rub-out**: the leave completes, the span is REMOVED, `region.textContent === ""` at a mutation delivery, then the write-in. The empty IS the announcement |
| **PRM** | `index.css:1157-1171` names `.margin-note-ink` | `animation: none !important` → computed duration 0 → Vue removes the node same-frame | LOAD-BEARING ON THE NAME. If §13 re-homes PRM to a `:root` scale token, this element keeps a computed duration and hangs one beat for exactly the readers who asked for less; gate 7 reds on `animationDuration !== "0s"` under PRM and the family ships its own rule naming the element if the block moves |
| **parked** (`props.parked`, §2.3) | as the kind decides | a `reply` rubs out on the park; a `record` stands | the park is a WRITER |
| **quiet** (`is-quiet`, the celebration) | unchanged | sr-only clip on the voice | any gate on a verdict tone asserts `is-quiet === false` first or reads 2.17:1 bleed-through |

Ageing is by KIND, not by tone (the graft from NOTE-LEDGER, taken): `record` (hint) and `state`
(receipts) settle; `grade` (verdict, solved) never settles; **`reply` (the refusal) is the fifth
kind — the only one with a hold, and it never settles: it leaves.** `tone === "graphite"` was a
proxy for the kind; the tag is the honest predicate. `.margin-note-meta` keeps its own write-in
and takes `var(--motion-note, 250ms)` too (:180 was the literal pass 1 missed).

Keyframes, beside `ink-write-in`, named as its mirror (unchanged from pass 1):

```css
@keyframes ink-rub-out      { from { clip-path: inset(0 0 0 0) } to { clip-path: inset(0 100% 0 0) } }
@keyframes ink-rub-out-fade { from { opacity: 1 }                to { opacity: 0 } }
```

### 2.2 `GameBoard.vue` — five kinds, one counter, one hold (and one honest second timer)

```ts
let writeSeq = 0;                                     // the :key AND the guard
let repeatTimer: ReturnType<typeof setTimeout> | null = null;
function setMargin(text: string, tone: Tone, kind: MarginKind) {
  const seq = ++writeSeq;
  if (repeatTimer) { clearTimeout(repeatTimer); repeatTimer = null; }
  clearRefusalHold();
  if (text && text === marginText.value) {            // the repeat: open the hole, then re-say it
    marginText.value = "";
    repeatTimer = setTimeout(() => {
      if (seq !== writeSeq) return;                   // a later writer won; drop the stale re-write
      marginText.value = text; marginTone.value = tone; marginKind.value = kind; marginSeq.value = seq;
    }, MOTION.rungs.whisper + 17);
    return;
  }
  marginText.value = text; marginTone.value = tone; marginKind.value = kind; marginSeq.value = seq;
}
```

The `nextTick` race (charter row 12) and the key (row 1) are ONE counter: both ref writes of the
pass-1 clause land in a single observer delivery (`logs/n1-*`), so a writer in the same tick was
overwritten by the stale sentence with nothing to see it. **Honesty about the count:** this is a
second timer in a family whose argument is one clock. It is bounded (`whisper` + 1 frame),
cancellable, seq-guarded and cleared by every writer and on unmount. The refusal hold is the
one CLOCK; this is a deferral.

| voice | kind | tone | retracted by (each → rub-out) | ages |
|---|---|---|---|---|
| hint | `record` | graphite | your write · the second H press · deal · clear · fill · solve · a PEER's write only on `{hint.cell} ∪ becauseCells` · a newer note | settles at 8 beats; no clock |
| conflict verdict | `grade` | teacher-red | the grade reverting (`GameBoard.vue:750`) | never |
| solved | `grade` | gold | the grade reverting | never |
| refusal | **`reply`** | teacher-red | your ink that LANDS · deal · fill · **the park** · `refusalHoldBeats` after the LAST refusal (the second refusal restarts it) · a peer's write: never | never settles; it leaves |
| receipts (`the board is clear`, `still solving…`) | `state` | graphite | the next writer | settle at 8 beats |

**The retraction set is {1, n}** (charter row 11, measured): `hintReasoning` is `ref<HintResult |
null>` (`useGameState.ts:272`), `HintResult.technique` is the closed union naked / hidden / reveal
(`techniqueEngine.ts:707-709`), and `Deduction`'s seven other `becauseCells` shapes have no
consumer outside `techniqueEngine.ts`. Worst case 16 of 256 (6.25 %) at 16×16; pass 1's risk 3
was overstated.

### 2.3 The park is a writer (charter row 2)

Measured, both engines, both widths (`logs/n2*-park-*`): under `g` the live board is Teleported
into the gallery's centre card via `div.live-face-fit matrix(0.475)` at 1280 / `matrix(0.652)` at
390 — `checkVisibility()` TRUE, one client rect, `offsetParent` non-null, effective font **8.63 /
10.43 px**. No DOM predicate can tell you it is parked; every no-prop fallback was measured and
fails. (The "0×0, not painted" of pass 1 is the PRM arm only, `App.vue:606`.)

So the park SAYS so, on the seam the estate already uses for `leaving`:

```
App.vue:89-93    Scene: FunctionalComponent<{ leaving?: boolean; parked?: boolean }, …>
App.vue:864      <component … v-show="view === 'playing'" :leaving="leaving" :parked="view !== 'playing'">
GameShell.vue    forwards :parked exactly as :leaving (:51 / :153)
GameBoard.vue    watch(() => props.parked, p => { if (p && marginKind.value === "reply") setMargin("", "graphite", "empty") })
```

One prop, two files, zero new mechanics. **G9 splits per kind:** G9a (`record`) — `g`, cancel →
the same sentence at the same box (measured GREEN, 213×23.6 → 101.2×11.2 → 213×23.6 restored);
G9b (`reply`) — `g`, cancel → `""`, asserted within one rub-out OF THE PARK, not at the hold. A
reply answered a keystroke on THIS board; shrunk to 8.63 px inside a deck card it is not a
message. The retraction under the park plays the leave on a transform-scaled subtree; Vue
resolves it by `whenTransitionEnds`' duration timeout, no node leaks. This is a behaviour change
the owner's eye sees at the re-look (U-10), not a silent one.

### 2.4 The hold, derived, and the SC (charter row 10)

`hold ≥ writeIn + notice + words × msPerWord`, every constant the house's own:

| arm | write-in | notice | rate | total | quantized to the 8-beat settle grid |
|---|---|---|---|---|---|
| fast | 250 (`rungs.note`) | 1000 (`settleAfterBeats` 8) | 180 wpm · 4 words | 2,582 ms | **24 beats** (3.0 s) |
| slow | 250 | 2000 (two settles) | 90 wpm · 4 words | 4,918 ms | **40 beats** (5.0 s) |

The ballot band 24–40 is the span between two defensible reading rates, derived rather than
picked. Default 24; U-10 disposes. **Gate G-hold** (a unit row computed from `MOTION` and the
string): `refusalHoldBeats × beatMs ≥ rungs.note + settleAfterBeats × beatMs + wordCount("that's
a given clue") × 333` — 3000 ≥ 2582 at HEAD's values; re-timing either end reds it.

The SC is **WCAG 2.2 SC 2.2.1 Timing Adjustable (A)**; its exceptions do not apply. The
defensible position is that an auto-dismissing `role="status"` line is not a time limit set by
the content when the information remains obtainable — and here it is: the given still shows,
the cell wears the shake, and pressing the key again re-says it. **That defence is load-bearing
on §2.1's repeat**: today pressing the key again does NOT re-say it, so rows 1 and 10 are one
row, and the spec says so instead of asserting 2.2.1 in a sentence. **SC 4.1.3 Status Messages
(AA)** is what the repeat cure serves. What no headless gate proves: NVDA / VoiceOver coalescing
of identical utterances across a real empty — a device row (M19).

### 2.5 `useGameState.ts` — the seam, `origin` REQUIRED (charter row 3)

`WriteOrigin = "self" | "peer"` as a required third parameter on BOTH primitives
(`applyCellValue`, `applyHintInk`); the `= "self"` default dies. The compiler then names the six
sites and each is a real decision: `:298` undo/redo replay → `self`; `:301` undo of hint ink →
`self`; `:375` the wire → `peer` (already); `:500` `setCell` keystroke → `self`; `:735`
`inkReveal` → `self`. Typing `sessionSource` alone cannot do this (`SessionSource.applyValue` is
`(pos, value, solved) => void` and `registerSessionSource` checks it structurally); annotate
`const sessionSource: SessionSource` at `:373` as belt-and-braces. The predicate stays:

```
if (origin === "self" || armedHintTurnsOn(pos)) hintReasoning.value = null;
if (origin === "self")                          lastRefusal.value  = null;
```

This is W1's file; specified and handed with its six unit rows, not cut here.

---

## 3 · Desktop and mobile, light and dark

One construction at every width: the strip keeps its reserved line (`.margin-note-block
{ min-height: 1.3em }`); nothing this family does changes a layout box. The exit is clip +
opacity on the span; the settle is colour; `filter: none` and `transform: none` on the span and
every ancestor through the verb (`dirtyAncestors: []`, 8 cells).

| surface | 390×844 | 1280×800 |
|---|---|---|
| fresh | 16 px, full graphite, 20.80 line at y 594.13 | 18.18 px, 23.63 line |
| settled | same box, painted 5.17 light / 6.07 dark | same |
| rub-out at `whisper` | 150 ms; ≥ 17 clip states chromium / ≥ 8 webkit (the frame bar, §1.1) | same |
| the park | painted at 10.43 px inside the card; a reply leaves within one rub-out of `g` | at 8.63 px; same |
| board displacement | 0 | 0 |

The live verb, photographed (`frames/midErase-chromium.png` 954 B, 46.2 % of the line left at
t≈85 ms; `-webkit.png` 5,351 B, 63.4 % at 84 ms): the line shorter from its END, not dimmer from
everywhere; 86 % of the travel in the last ~50 ms reproduces live (0.837 → 0.164 between 52 and
102 ms at 125; the shape holds at 150, the timestamps scale ×1.2).

## 4 · Copy

No string minted, moved or re-rendered. `check-copy-register.mjs` (0 dashes, 0 unadmitted) and
`check-font-coverage.mjs` (Patrick Hand 46 codepoints / 4312 B) do not move.

## 5 · What the family does NOT do

No dismiss control; no clock on the hint; no new rung on the ramp, no fill admission, no filter,
no chromatic token, no layout box. filterBudget 9 exact both regimes, three sizes. π on unclaimed
surfaces unchanged except the ONE declared move: the replacement latency is **+150 ms** (was
+125 on the pass-1 build), restated because §13's rung was consumed, not silently kept.

---

## PLAN — files, order, what dies

1. `src/pencil/config/pencilConfig.ts` — `MOTION.note = { settleAfterBeats: 8, refusalHoldBeats:
   24 }` (clocks only); the verbs read `MOTION.rungs.{note, whisper, dusk}` — landed by §13, or
   by this family in MOT-LADDER's exact shape if §13 has not, never a beats band for a verb.
2. `src/assets/index.css` — `ink-rub-out` + `ink-rub-out-fade` beside `:1115`; the PRM block
   (:1157) already names `.margin-note-ink` (no edit; gate 7 guards it); the `--ease-accelIn`
   roll-call at `:341-344` **loses its enumeration** and keeps the role sentence — the block's own
   law three paragraphs up (`:336-338`, "a count the tree can derive should never be prose") and
   it has drifted twice more (five surfaces / six declarations today: laminate ×2, ScribbleLoader,
   DarkModeToggle, `bloom-out` → the celebration star; the note is the sixth).
3. `src/pencil/chrome/MarginNote.vue` — `<Transition name="note" mode="out-in">`; `:key="seq"`
   (new `seq` prop); write-in → `.note-enter-active`; `.note-leave-active` (`transition: none`,
   the rub-out on `--motion-whisper`); the settle timer keyed on `kind` (new `kind` prop) with
   `data-note-age` and the colour rule on `--motion-dusk`; ALL FOUR `250ms` literals →
   `var(--motion-note, 250ms)` (`:149`, `:180`) and the two header comments (`:13`, `:25`) say
   "the note rung, two beats".
4. `src/games/shared/GameBoard.vue` — `writeSeq`, `marginKind`, `marginSeq`; `setMargin(text,
   tone, kind)` with the repeat clause on a cancellable seq-guarded timer; every writer tagged
   (`record` / `grade` / `state` / `reply` / `empty`); the refusal hold on `refusalHoldBeats ×
   beatMs` re-armed per `r.seq`, cleared by every writer; the `parked` watch retracting a `reply`.
5. `src/App.vue` + `src/games/shared/GameShell.vue` — `parked?: boolean` on the Scene seam,
   `:parked="view !== 'playing'"` at `:864`, forwarded as `:leaving` is.
6. `src/games/shared/useGameState.ts` — the seam with `origin` required (§2.5), by W1, with six
   unit rows. Lands before or after; gates 4–5 stay RED until it does and the spec names it.
7. `scripts/check-ink-pressure.mjs` — `NOTE_QUIET` + `gateNote` beside `gateTape` (`:495-534`):
   `{ ink: "--ink-press-quiet", surface: "--color-background", floor: 4.5, consumers:
   ".margin-note-ink[data-note-age='settled'] (NOTE-ERASE) / .margin-note-previous (NOTE-LEDGER)" }`
   — ONE row for both note families; NOT a seventh `SHIP4` row (the self-test at `:730-736` pins
   six and would red).
8. The painted-byte reader (`probe/`, whoever owns it) — validates its core against
   `getComputedStyle(ink).color` and reds when any channel differs by > 12 (the star's |125−77| =
   48 would have caught it); cropping past `.note-star` is not enough (`overflow: visible`).

Dies: the four `250ms` literals; `:key="text"`; the `nextTick` re-write; `origin = "self"`'s
default; the `--ease-accelIn` enumeration; the tone-as-age proxy; the refusal that outlives its
board; the silent repeat; the peer-anywhere wipe.

Order once: step 3 with step 2 in one commit (the leave class needs its keyframe or the exit is
a cut); step 4's `parked` watch with step 5's prop (a watch on an undeclared prop is a no-op that
passes G9b for the wrong reason).

## PROTOTYPE BRIEF — the smallest runnable build on the real surface

Build steps 1–5 and 7 on a fresh worktree replayed from the pass-1 diff (`wf_e58b4764-0fc-53` is
the pass-1 record, not edited), plus step 6 in that worktree only so the peer rows measure. Dev
server from `web/frontend`: `npx vite --config <evidence dir>/probe/vite.scratch.config.mjs
--host 127.0.0.1 --port 4248 --strictPort` (private `cacheDir`). Scratch playwright config
(baseURL `:4248` only). chromium + webkit; 390×844 dsf3 and 1280×800; light and dark; PRM off
and on. Probes from a scratchpad mirror carrying a `node_modules` symlink; logs copied back
byte-for-byte. Kill the server before returning. No `npm run build` (W8 §8.1's dist freeze).

**Crops (≤4, ≤150 KB):**
1. the repeat at t = `whisper` + 8 ms, 390 chromium: the strip EMPTY between two identical
   refusals (the hole, on purpose)
2. the reply under the park at 1280, one frame after `g` + `whisper`: the deck card with the
   margin line gone, a `record` control beside it standing at 8.63 px
3. the settled hint, dark, 390 (the control is pass 1's `settled-390-dark.png`; only if the
   dusk rung changes the end pose — otherwise cite pass 1 and take no crop)
4. none needed for the verb: `frames/midErase-*.png` are the live frames

**Numbers that mean success:**
- **G6 trajectory**: a MutationObserver `{childList, characterData, subtree}` on the region,
  `textContent` read INSIDE each callback, refusing the same given twice → contains `""` strictly
  between two occurrences of the sentence (`[X, "", X]`), both engines; `ink-rub-out` starts once
- **the verb per frame**: rAF train with its own median interval beside the states;
  `distinctClipStates ≥ ⌊150 / medianRafMs⌋` (expect ≥ 17 chromium, ≥ 8 webkit); `filter: none`,
  `transform: none` on the span and every ancestor; the span ABSENT at ended + 1 frame; under
  PRM absent same-frame with `animationDuration === "0s"`
- **the settle**: `data-note-age="settled"` lands at 1000 ms ± 1 frame; painted ≥ 4.5 both themes
  (expect 5.17 / 6.07) with the computed-colour cross-check within 12 per channel; verdict tones
  at 8 beats + 1 unchanged (4.87 / 6.44 red; gold dark 11.48 with `is-quiet === false` asserted
  first; gold light has no painted witness at solve, 4.85 by arithmetic, stated)
- **the hold**: a `reply` present at 23 beats, leaving at 24, absent at 24 + `whisper` + 1 frame;
  a second refusal at beat 12 keeps it at 30 and 35, gone at 36 + `whisper`; G-hold's unit row
  green at 3000 ≥ 2582
- **the park**: G9a `record` — `g`, cancel → same sentence, same box (213×23.6 restored); G9b
  `reply` — `""` within one rub-out of `g` (NOT at the hold), cancel → `""`; `g` then Deal
  (`button[aria-label="Deal a new board"]`, visible at 1280) → `""`
- **the peer rows** on `?wire=local`: join stands · peer elsewhere stands · peer on `hint.cell`
  rubbed out · peer on a distinct because-member rubbed out (force a hidden single so the
  because set is n, both engines — pass 1's chromium row collapsed onto the named cell) · peer
  REVEAL on `hint.cell` rubbed out · a reply untouched by any peer write
- **the seam**: `vue-tsc` with `origin` required names exactly six sites; the six unit rows green
- **rects (π)**: board, controls and `scrollHeight` deltas 0 at 390 and 1280 across empty → fresh
  → settled → mid rub-out → parked; filterBudget 9 exact at 4×4 / 9×9 / 16×16, both engines

**Censuses to re-run** (copies with OUT re-pointed; r0 is frozen — `instruments/hue-census.probe.ts`
is the re-pointed copy, already banked):
- R3-d + R3-g — rows changed by design declared (30 s idle: settled, standing; any digit on the
  referent: rubbed out over `whisper`; the subject moved → the diff proposed under
  `pass2/prototype/NOTE-ERASE/instruments/`, r0 row reported MOVED)
- `wobble.probe.ts` + `budget.probe.ts` — σ and 9 unmoved
- `hue-census` — 24 site rows per pose, zero new chromatic tokens, `kin-arithmetic.json` identical
- `heading-voice.spec.ts` — unmoved control
- `npm run lint:ink` with `gateNote` green; `check-copy-register` / `check-font-coverage` unmoved;
  `e2e/filter-census.spec.ts` G3.2 source half (`FILL_ALLOWLIST` one row, unchanged); the built-dist
  half and the goldens (4/4, DELTA: none — no golden contains the margin) OWED at WGATE's rebuild

## GATES — born-RED instruments this family lands with

1. **the exit exists** — retract a hint; the span reports a computed `ink-rub-out` leave on
   `--motion-whisper` and is gone at ended + 1 frame. HEAD: RED.
2. **the settle** — a `record` at 8 beats + 1 paints ≥ 4.5 and ≤ 7 both themes, painted bytes
   cross-checked against computed colour (≤ 12 per channel). HEAD: RED (14.52 / 12.25).
3. **verdicts never settle** — `grade` kinds at 8 beats + 1 at full pressure, `is-quiet === false`
   asserted first. HEAD: GREEN; a negative control against a settle applied to the tone.
4. **the peer rows** (needs the seam) — elsewhere stands / named cell erases / distinct
   because-member erases / reveal erases / reply untouched. HEAD: RED / green-wrong / green-wrong /
   RED / RED.
5. **the reply leaves** — absent at `refusalHoldBeats` + `whisper` + 1 frame; a second refusal
   restarts. HEAD: RED (stands at 30 s).
6. **the repeat speaks — as a TRAJECTORY** — `[X, "", X]` at mutation time. HEAD: `[]`; pass-1
   build: `[X, X, X]` **RED**; cured `[X, "", X]`.
7. **PRM immortality guard, re-armed** — under PRM `getComputedStyle(ink).animationDuration ===
   "0s"` AND the span removed same-frame. HEAD: GREEN; it exists to red the day PRM leaves the
   element's name (MOT-LADDER's `:root` re-home) or an `animationend` listener appears.
8. **no fill, no filter** — `FILL_ALLOWLIST` unchanged, filterBudget 9 exact. HEAD: GREEN; guard.
9. **the park, per kind** — G9a a `record` survives `g` + cancel at the same box; G9b a `reply` is
   `""` within one rub-out of `g`. HEAD: G9a GREEN; G9b **RED** (the pass-1 build leaves it to the
   hold, `""` at 3.7 s).
10. **G-hold** — the unit row of §2.4. HEAD: n/a (no hold); born with the cure and reds if either
    end re-times.
11. **the seam is required** — `vue-tsc` fails on a call to either primitive with no `origin`.
    HEAD: GREEN-for-nothing (the default); RED once the default dies and a site is left bare.
12. **the quiet rung's note row** — `gateNote` ≥ 4.5 on `--color-background` both themes, plus the
    discovery census ≥ 16 consumers of the two rungs ⊇ the pinned rows. HEAD: RED (no row, no
    discovery).
13. **R6 law 4 inside the file** — `grep -c "250ms" MarginNote.vue` = 0. HEAD: 4. Pass-1 build: 3.
14. **the frame bar is the engine's** — `distinctClipStates ≥ ⌊rubOutMs / medianRafMs⌋` measured
    in the same run. Born with the cure; re-derived if §13 rules another rung.

Objections carried in the return, not in a diff: (1) 125 is the family's number and the ladder's
law is why 150 is consumed; (2) the repeat's deferral is a second timer, owned honestly; (3) G9b
changes what a reader gets back after a park and the owner should see it.
