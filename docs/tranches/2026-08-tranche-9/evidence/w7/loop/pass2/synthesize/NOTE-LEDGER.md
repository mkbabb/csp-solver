# NOTE-LEDGER · THE LEDGER — pass-2 design spec

T9-W7 §7, the hint note's lifecycle. Synthesized from the pass-2 research
(`../research/NOTE-LEDGER/README.md`, 26 readings both engines), the pass-1 spec and critique,
and the chair's rulings (`../CHAIR-RULINGS.md`). A spec, not a cut; nothing closes (U-10). The
family stays incompatible with NOTE-ERASE (ageing by displacement vs ageing by act and clock);
the agglomerator decides between them, not this file.

Pass 1 settled the shape (a column of exactly two, line two out of the page's flow, the board
invariant, the peer wipe dead by mechanism). Pass 2's research convicted the pass-1 build on two
numbers and one construction: the longest record has **4.99 %** headroom at 360 (the WIDTH row is
born RED), the desk pair is **one run-on sentence** (a record boundary 7.19 px against a 4.55 px
word space, ratio 1.58, no other cue but pressure), and the orphan deictic is a live claim in a
record's clothes because the graft's predicate reads a model field the model nulls.

**One move answers the first two, and it is the pass's one design decision: the aged line drops
to the TALLY'S tier.** `--type-caption`, tracked wide, quiet ink, baseline on the voice's line at
the desk and one line under it on the phone. That is the berth T4-P1 mark 6 built for the tally
and the owner has seen ("the verdict speaks, the tally trails it in the quiet ink"), so no new
gestalt is minted: what trails the voice is set in the tally's hand. The push is still the
memorable thing: the line you were reading steps down a rung, a size and a line as the new one
writes in above it. Everything else is quiet.

---

## 1 · Tokens (nothing minted; two rungs, one tier, two ladder rungs)

| role | token | light | dark | note |
|---|---|---|---|---|
| paper | `--color-background` | #fbfaf9 | #110f0e | the page, not the card (`index.css:134/:363`) |
| line one, the voice | `--color-pencil-graphite` at `--type-body` | #262626 · 14.52:1 | #d1cfc7 · 12.25:1 | unchanged, 16 px at 390 / 18.18 px at 1280 |
| line two, the aged record | `--ink-press-quiet` (graphite 68 %) at `--type-caption` | painted #6a6a6a · **5.19:1** | painted #94928c · **6.14:1** | `typography.css:31/:103` — **14 px** below 1024 coarse, 14.05 px at 1280; AA for text at any size |
| line three | `--ink-press-rule` (55 %) | 3.51:1 | 4.37:1 | forbidden for text in both themes; there is no line three |
| grades | `--color-red-ink` / `--color-gold-ink` | #d02a52 / #8c691d | #ff5c7c / #e5c74d | line one only, full pressure, leave with the grade |
| the push | `MOTION.rungs.note` → `--motion-note` | 250 ms | | §13's ladder; the note's own write-in rung. Fallback byte-equal (`250ms`) |
| the pushed-off line's exit | `MOTION.rungs.whisper` → `--motion-whisper` | 150 ms | | the eraser's `ink-rub-out` keyframe, consumed; nearest rung to the beat |
| the push curve | `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | | unchanged |
| the exit curve | `--ease-accelIn` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | | the house's accelerate-away, shared with the laminate |

Type for line two is the tally's rule verbatim (`MarginNote.vue:169-181` at HEAD): `--font-hand`,
`--type-caption`, `--type-leading-caption` 1.3, `--type-tracking-wide` 0.025em, `--ink-press-quiet`.
Line box **18.2 px** at 390 (was 20.80 at body size).

### 1.1 What the tier buys, in numbers (re-derived from `logs/R1-vocabulary-*.json` at 14/16)

| rig | strip | longest record at body (pass 1) | at caption | headroom |
|---|---|---|---|---|
| 360×740 coarse | 228 | 216.63 (4.99 %) | **189.6** | **38.4 px · 16.9 %** |
| 390×844 | 258 | 216.63 (16.0 %) | 189.6 | 68.4 px · 26.5 % |
| 1280×800 | 632 | 246.00 | 190.2 (×0.773) | line one 246 + 7.2 + 190.2 = 443 in 632 |

Ribbon clearance at 390: line two's foot rises 2.6 px (20.80 → 18.2 line box): **4.80 → 7.40 px**.
The WIDTH row (L10-W) written as the charter asks — sweep the 99-string vocabulary against the
strip at 360, red under 10 % — is RED on the pass-1 build (4.99 %) and GREEN under this tier at
9×9 and 16×16 alike. No gate is re-worded; the ink got smaller.

The 16×16 tail (`D goes nowhere else in this column`) is the longest only because A B D E F G are
not in the hand's cut (R6 law 30 broken by a landed string; `logs/R14-ransom-*.json`). The ledger
neither causes nor cures it; it is a WAVE row (§7 declares it, `check-font-coverage` binds
strings to faces by a hand-written `where` and is green for the wrong reason). If the subset is
re-cut, every width number above moves DOWN, never up.

### 1.2 The motion home — nothing minted

The ledger has no clock, so it adds nothing to `MOTION`. It reads two rungs of §13's ladder:
the push on `note` (250, the incumbent write-in, one gesture on one clock) and the pushed-off
line's exit on `whisper` (150). The FLIP is WAAPI and reads `MOTION.rungs` directly (R6 law 3);
the exit is CSS and reads `var(--motion-whisper, 150ms)`. If §13 lands the ladder under another
name the numbers stay and the names follow. PRM: push duration 0, one frame; the exit is a
same-frame cut (the PRM block names the element, §2.2).

---

## 2 · Components and states

### 2.1 The model — `GameBoard.vue`, records that carry their referent

```ts
type MarginKind = "record" | "grade" | "state" | "empty";
type MarginRecord = { text: string; kind: MarginKind; tone: Tone; cell?: number; because?: number[] };
const marginLive = ref<MarginRecord>({ text: "", kind: "empty", tone: "graphite" });
const marginPrevious = ref<MarginRecord | null>(null);
let writeSeq = 0;   // the FLIP key and the stutter guard, one counter (the graft from NOTE-ERASE)
```

**The ruling, unchanged: a ledger holds RECORDS OF ACTS, never LIVE CLAIMS.** Pass 2 adds the
clause the critique earned: **a deictic record is struck the moment its referent is written,
whoever wrote it.** The hint watch has both fields at its one call site (`GameBoard.vue:689-706`
at HEAD; `hint.cell`, `hint.becauseCells`, `HintResult` at `techniqueEngine.ts:706-719`), so the
record carries them and the predicate survives the model's five nulls (`useGameState.ts:434/
:487/:604/:770/:790`), which is why NOTE-ERASE's `armedHintTurnsOn` could not be taken as
written. The ledger takes the PREDICATE (`pos === cell || because.includes(pos)`), not the
`WriteOrigin` seam: the ledger does not care whose hand falsified the sentence.

| record | referent | struck by |
|---|---|---|
| `only X fits here` | `cell` (1) | a value landing on that cell |
| `X goes nowhere else in this <house>` | `because` = the house (4 / 9 / 16) | a value landing anywhere in the house |
| `the answer is X` | the focused cell (1) | a value landing on it |
| `that's a given clue` | a given | **never** — a given is immutable; it cannot orphan |
| `the board is clear` | the act | never — a record of an act stays true as one |

"Struck" is one verb at either depth: line one → `""` through the exit (§2.3); line two →
removed through the exit. Line two never climbs back. A write ELSEWHERE moves nothing (the L2
law stands). The watch is one `watch(() => props.cells[...])`-shaped observer over the board's
values keyed on the two records' referent sets; it runs only while a deictic record exists.

The copy arm (U-10, priced at `logs/R12-copy-candidates-*`): `only 4 fits in row 4 column 7`
(172.92 px, not deictic, borrows W3's landed cell name) or `the answer was 4` (past tense, no
referent). It mints coordinates into copy that has never named a cell, and the comma is out of
the hand's cut. **This spec ships the strike and states the copy arm for the owner's re-look.**

**The stutter, both clauses (charter row 9), now the spec's:** (a) a record is displaced only by a
DIFFERENT sentence (`text !== marginLive.value.text`) — two refusals in a row are one record said
twice; (b) the column never prints one sentence twice — if the new live line equals line two,
line two is dropped. (The second way in is a grade, which does not age, so line two still holds
the record the grade displaced.)

What enters line two (unchanged): records only. Grades replace in place and never age; `still
solving…` is a state; a deal and a solve empty both lines; a peer's digit adds nothing and
removes nothing unless it lands on a referent.

### 2.2 `MarginNote.vue` — one live region, one plain paragraph

```
<div class="margin-note-block" :class="{ 'is-quiet': quiet, 'has-previous': !!previous }">
  <p class="margin-note" :class="tone" role="status" aria-live="polite" aria-atomic="true">
    <span v-if="text" :key="seq" class="margin-note-ink">…</span>          ← line one, keyed on the write seq
  </p>
  <p v-if="meta" :key="meta" class="margin-note-meta">{{ meta }}</p>          ← the tally, unchanged
  <Transition name="note-previous">
    <p v-if="previous" :key="previous.seq" class="margin-note-previous">{{ previous.text }}</p>
  </Transition>                                                              ← line two: the tally's tier
</div>
```

**No `aria-hidden`, no `role`, no `user-select: none` on line two.** Research row 2 measured it:
line two is a SIBLING of the live region, so the push already announces line one only; the
announcement guard is DOM position. Dropping `aria-hidden` turns the strip's tree from
`- status: only 1 fits here` into `- status: …` + `- paragraph: only 7 fits here` — the aged
record is recoverable in browse mode with zero announcements (`logs/R10-aria-hidden-*.json`).
Line two takes the tally's selectability (`pointer-events: auto; width: fit-content` on the
phone; the flexed box on the desk, §2.3) — a record someone leans in to read is one they may copy.

| state | what paints | motion |
|---|---|---|
| **one line** | today's strip | the incumbent write-in on `--motion-note` |
| **two lines** | line one at body, full; line two at caption, quiet, graphite, no star, no tone class | — |
| **the push** | line two takes the outgoing text at the caption tier; line one writes in the new | WAAPI FLIP from line one's rect: `translate` + `scale(1.143→1)` at 390 (`1.294→1` at 1280; the body/caption ratio, transform-origin `0 100%`), colour full → quiet on the same clock, `--motion-note` on `--ease-noteWrite`, `fill: "backwards"` (law 6), `transform: none` at rest |
| **a third record** | the old line two leaves; the new one pushes in | the leaving `<p>` is `position: absolute` for its leave, `transition: none`, `animation: ink-rub-out var(--motion-whisper, 150ms) var(--ease-accelIn)` + the opacity twin; no fill, node removed by Vue at the computed duration. Both berths: the phone's line two is absolute already; the desk's leaving box is taken out of the flex row so the FLIP's target rect is the settled one |
| **struck** | at depth one: `""` through the same exit; at depth two: removed through it | the exit above |
| **a grade arrives** | line two takes the record; line one the grade at full pressure | the push |
| **a grade leaves** | line one `""`, line two stays (the grade-leaves pose: a blank body rung over a quiet caption one; the block's `min-height: 1.3em` holds the geometry) | none |
| **deal / solve** | both `""` | none; the receipt rows |
| **error card mounted** | line two `display: none` for the card's life | a PAINT ruling, not a layout one: line two costs zero height (absolute), but it and the card share **14.41 px** (581.72–602.52 vs 588.11–648.11 at 390, `logs/R13-*`, `R15-*`) and the card is the assertive one. If the card ever leaves the flow berth this ruling is re-made |
| **quiet** (the celebration) | the voice sr-only as today; line two `display: none` | the column is empty by then (a solve empties it); a guard |
| **PRM** | same layout | push 0 ms one frame; the exit is a same-frame cut because `index.css:1157-1171` names `.margin-note-ink` and MUST name `.margin-note-previous` beside it (the coupling NOTE-ERASE found: if §13 re-homes PRM to a `:root` scale, this element keeps a computed duration and hangs for exactly the readers who asked for less) |

### 2.3 The berth — one law, two berths, and the tally's own row

Line two is out of the page's flow, one tier down, after line one in reading order, taking the
air the pose already has:

| regime | where line two sits | what changed in pass 2 |
|---|---|---|
| **in-flow strip** (`<1024` portrait) | absolute host inside the block: `top: 100%; left: 0; width: fit-content; max-width: 100%`, one caption line box (18.2 px) | board `y` 219.73 at depth 1 and 2 (invariant); clearance to the ribbon **7.40 px** at 390 (was 4.80) |
| **overlay strip** (`≥1024`) | in the block's flex row after the tally: `flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` | **`has-previous { flex-wrap: nowrap }` DIES** (it reversed T4-P1 mark 6 and bought nothing: `logs/R8-desk-triple-*` — 48 px tall under both, nowrap only squeezed the tally's text into a wrap and pushed line two's ink 6.53 px outside its box). `flex-basis: 0` gives line two a hypothetical main size of 0, so it never causes the wrap; the block keeps `wrap` for the tally; ink that will not fit is elided inside its box (U+2026 is in the hand's cut, `index.css:96`) |
| **landscape `<1024`** (844×390, 900×500) | **depth one** | re-priced at 844×390 (`logs/R2-landscape-*`): strip 358 vs 467.26 for the pair, so the ballot's own rule fires depth one; and the deciding facts are new — the strip's TOP is at y 388.39 on a 390 fold, the page already scrolls (409/390), `#fold-tools` is 0×0 (there is no ribbon in landscape, `DrawerTab.vue:105`), and the first painted box below the strip is `.control-panel-filtered` at **8.70 px**. A second line would paint over the controls card. Not a concession, the only construction; B6's split-grammar row applies and the owner disposes |

**The desk push, declared** (charter row 10): at ≥1024 the mover travels line one's own ink
width plus the 7.2 px column gap, horizontally, and 0.00 px vertically (dx −127.50 at 1024 /
−132.25 at 1280, `logs/R3-desk-pair-*`). Over the vocabulary at 1280 that is 108.95 → ~205 px
(the caption-tier target shrinks the far end), a ~1.9× spread on one 250 ms rung. Declared and
accepted: the eye reads a line stepping aside, not a distance; a derived duration would be a
seventh rung (§13's closed set). Below 1024 the push is vertical and constant at one line box.

**The desk gestalt, decided against 1.58** (charter row 7, `frames/1280-graphite-pair.png`): the
tier adds a SIZE step (18.18 → 14.05 px, x-height visibly lower) to the pressure step, on the
same 0.45rem gap the tally already trails the verdict with. The cue is now the one the owner
ratified for `solved it!  0 backtracks · 1ms`; the gap does not widen (it is the block's, shared
with the tally, and the phone has no width to spend).

### 2.4 One wave row this family can only declare

At 844×390 the margin's LIVE line is 92.7 % below the fold at HEAD (strip top 388.39, line 22.09
tall). The ledger neither causes nor cures it; W2 owns the strip's pose there. If W2 moves it the
landscape ballot is re-priced a third time.

---

## 3 · Desktop and mobile, light and dark

| | 390×844 phone | 1280×800 desk |
|---|---|---|
| line one | 16 px body, y 594.13, 20.80 line, full graphite | 18.18 px, 23.63 line, full graphite |
| line two | **14 px caption**, y 614.93, 18.2 line, quiet, same left edge | **14.05 px caption**, same baseline row, after the tally, quiet |
| board y | 219.73 at depth 1 AND 2 | invariant |
| ribbon clearance | **7.40 px** | n/a |
| scrollHeight | 844 → 844 | 800 → 800 |
| dock sheet open | covers the strip whole (settle ~700 ms before measuring); the ledger is read with the sheet shut | n/a |

Light and dark differ only in the token arms: line two 5.19 / 6.14 by token arithmetic
(`../research/NOTE-ERASE/probe/token-arithmetic.mjs` — the same number both note families
paint). The painted-byte reader is validated on graphite to ≤ 0.07 and wrong only where an inline
star sits in the text box (NOTE-ERASE §6); line two has no star, so painted and arithmetic agree.

## 4 · Copy

No string is minted, moved or re-rendered. The vocabulary is 99 strings and stays enumerable
(`techniqueVoice.ts:43-58`, `glyphRegistry.ts:64-70`, `BoardHost.vue:179-185`).
`check-copy-register.mjs` and `check-font-coverage.mjs` do not move. The ellipsis at the desk
berth is U+2026, already cut.

## 5 · The register risk, restated

Two lines of standing handwriting under a drawn board is the nearest this product comes to the
caption M16 deleted. The distance is one rule wide: the caption described the board unconditionally
on arrival; the ledger prints nothing until the player acts, never describes the board, a deal
empties it, and a deictic record dies with its referent. The residual the family pays for "no
clock": a hint followed by silence stands at full pressure until the next sentence.

---

## PLAN — files, order, what dies

1. `src/assets/index.css` — `@keyframes ink-rub-out` + `ink-rub-out-fade` beside `ink-write-in`
   (:1115) if NOTE-ERASE has not landed them (one keyframe pair, shared); `.margin-note-previous`
   added to the PRM block (:1157-1171) by name.
2. `src/pencil/chrome/MarginNote.vue` — the `previous: MarginRecord | null` prop; line one keyed
   on `seq`; `.margin-note-previous` as the tally's tier (the tally's five declarations, copied,
   with a comment saying which rule it mirrors), no `aria-hidden`, selectable; the two berths under
   the strip's own breakpoints (`@media (min-width: 1024px)` mirrors `GameBoard.vue:1301-1310`;
   the host MUST NOT set `position` on the ≥1024 strip); `has-previous { flex-wrap: nowrap }`
   deleted; the `<Transition name="note-previous">` leave (absolute, `transition: none`,
   `ink-rub-out` on `--motion-whisper`); the FLIP via `el.animate` (translate + scale + colour,
   `MOTION.rungs.note`, `fill: "backwards"`, PRM arm reading `matchMedia`); the four `250ms`
   literals (:13, :25, :149, :180) → `var(--motion-note, 250ms)` and comments that say "the note
   rung".
3. `src/games/shared/GameBoard.vue` — `MarginRecord` with `kind` + referent fields; `writeSeq`;
   `setMargin(text, tone, kind, ref?)` with both stutter clauses; the referent watch that strikes
   at either depth; the hint and refusal falsy arms keep their flags and lose their
   `setMargin("")` (a write elsewhere moves nothing); deal and solve empty both lines;
   `:previous` passed; `hidePrevious` while `showErrorNote`.
4. `src/games/shared/GameBoard.receipt.test.ts` — the rows in GATES 8, 9, 11, 12.
5. `scripts/check-ink-pressure.mjs` — `NOTE_QUIET` + `gateNote` beside `gateTape` (:495-534): one
   row for both note families (`ink: --ink-press-quiet, surface: --color-background, floor: 4.5,
   consumers: MarginNote .margin-note-previous (NOTE-LEDGER) / .margin-note-ink[data-note-age=
   settled] (NOTE-ERASE)`), NOT a seventh `SHIP4` row (the self-test at :730-736 pins six); plus
   the discovery assertion from `instruments/check-ink-pressure-row7.md` (regex over rule bodies,
   ≥16 consumers of the two rungs, superset of the pinned rows).
6. `src/pencil/config/pencilConfig.ts` — UNTOUCHED unless §13's ladder is not yet home, in which
   case `MOTION.rungs.{note: 250, whisper: 150}` land here by MOT-LADDER's shape, never a `note`
   band of beats.
7. `src/games/shared/useGameState.ts` — UNTOUCHED. The model's nulls stay; the ledger cures at
   the margin.

Dies: the retraction of a record's text on a write ELSEWHERE (W1 §1.2's falsy arm's
`setMargin("")`); the peer-anywhere wipe as a visible defect; `aria-hidden` and `user-select:
none` on line two; `has-previous { flex-wrap: nowrap }`; the four `250ms` literals in
`MarginNote.vue`; the pass-1 body-size line two.

Order once: step 2's CSS lands with step 3's `previous` in one commit (a `previous` with no
berth rule mounts in flow and moves the phone's board; L3 catches it), and step 1's keyframe with
step 2's leave class (or Vue computes a 0 ms leave and the exit is a cut).

**Re-measure the day §10's type scale lands.** `--type-caption` is a control-ladder rung §10 may
re-floor (`typography.css:101-106`); one px on it costs ~12 px of ink on the longest record. The
family now lives on 38 px, not 11.

## PROTOTYPE BRIEF — the smallest runnable build on the real surface

Build steps 1–5 on a fresh worktree replayed from the pass-1 diff (`wf_e58b4764-0fc-54` is the
pass-1 record and is not edited). Dev server from `web/frontend`: `npx vite --config <evidence
dir>/probe/vite.scratch.config.mts --host 127.0.0.1 --port 4249 --strictPort` (private
`cacheDir`; the `.mts` extension matters outside the package — a `.ts` scratch config bundles to
CJS and dies on `@tailwindcss/vite`). Scratch playwright config copied from the estate's minus
`webServer`/`globalSetup`, baseURL `:4249`, `timeout: 150000` (R3-d walks nine acts with a 30 s
idle). chromium + webkit; 360×740 coarse dsf3, 390×844, 393×699, 390×664, 844×390, 900×500,
1024×768, 1280×800; light and dark; PRM off and on. Kill the server before returning.

**Crops (≤4, ≤150 KB each, only where a number cannot say it):**
1. the desk pair at 1280, light: `only 5 fits here` beside the caption-tier `4 goes nowhere else
   in this column` — the control is `../research/NOTE-LEDGER/frames/1280-graphite-pair.png`
2. the phone column at 360×740 coarse dark with the longest 16×16 record on line two (the width
   claim; the ransom glyph is visible and is declared, not hidden)
3. the push at t = 125 ms, 390×844 chromium (line two half-way down and half-way shrunk)
4. the grade-leaves pose at 390 (`setMargin("", "graphite", "grade")`: blank body rung over a
   quiet caption one)

**Numbers that mean success** (the pass-1 probes re-run under the build, plus the new rows):
- board `y` identical at depth 1 and 2 on every rig, both engines (L3)
- the WIDTH sweep: 99 strings at 360 coarse, longest ink ≤ 90 % of the strip (expect 189.6 in 228,
  16.9 %); ellipsis never triggers on the phone; at 1024 the verdict + `1284 backtracks · 19.9s`
  tally + longest aged line paints line two's ink INSIDE its box (was 6.53 px outside)
- ribbon clearance ≥ 6.0 px at 390×844, 393×699, 390×664, 360×740 (expect 7.40)
- `scrollHeight` unchanged by line two at 1280 (800), 1024 (768); depth one at 844×390 and 900×500
  with the honest clearance to the first painted box below the strip named (8.70 / 6.50)
- the push: settled ≤ 250 ms, `fill: "backwards"` on the mover, `transform: none` on both lines at
  rest, glyph `filter: none` ×2, dx/dy declared per berth; PRM one frame
- the exit of a pushed-off or struck line: computed leave `ink-rub-out` on `--motion-whisper`, the
  node absent at ended + 1 frame, the board and strip rects unmoved during it; under PRM absent
  on the same frame (`animationDuration` reads `0s` on `.margin-note-previous`)
- the strike: arm a hidden single (9 because-cells), write a digit IN the house → line one `""`
  within one exit; arm, spend with `h`, arm again (the pair), write on record 2's cell → line two
  removed, line one stands; write ELSEWHERE → both stand; `?wire=local` peer on a referent →
  struck, peer elsewhere → both stand; a refusal record is never struck by any write
- painted contrast: line two ≥ 4.5 both themes (expect 5.19 / 6.14, no star in the box); line one
  ≥ 12; line two never paints a red or gold core
- a11y: exactly one `role="status"` in the strip; line two `- paragraph:` in `ariaSnapshot`
  (`page.accessibility.snapshot` is gone from this Playwright); a push yields one mutation-time
  text change in the region and zero in line two
- the error card over a two-line column (the Worker-wrap recipe, `probe/ledger2c.probe.ts`): line
  two `display: none`, card foot above the ribbon, `scrollHeight` 844

**Censuses to re-run** (copies with OUT re-pointed into this lane's dir; r0 is frozen):
- `r3-marks/probe/marks.probe.ts` R3-d + `marks2.probe.ts` R3-g — R3-d's nine acts leave line one
  standing except a write on the referent (declared row by row); R3-g's deal / solve rows unmoved.
  The subject moved (a referent write now retracts) — propose the diff under
  `pass2/prototype/NOTE-LEDGER/instruments/` and report the r0 row MOVED
- `wobble.probe.ts` + `budget.probe.ts` — ring σ and filter count 9 unmoved (this family draws
  nothing)
- `hue-census.probe.ts` — 24 site rows per pose × 4 poses, no new token
- `heading-voice.spec.ts` — unmoved control
- `npm run lint:ink` with `gateNote` — the two rungs unchanged and the note row green;
  `check-live-regions.mjs` unchanged (6 regions); `check-copy-register` / `check-font-coverage`
  unmoved; `GameBoard.receipt.test.ts` green with its new rows; `e2e/board-covisibility.spec.ts`
  re-run (it clones `.margin-note-block` tenants); goldens 4/4 — DELTA: none declared, and the
  run is OWED at WGATE's rebuild (W8 §8.1 freezes the dist; no `npm run build` now)

## GATES — born-RED instruments this family lands with

1. **L1 accumulation** — after a second record the first is readable in `.margin-note-previous`.
   HEAD: RED.
2. **L2 the peer row** — a peer's digit ELSEWHERE leaves your line. HEAD: RED.
3. **L3 the board** — board `y` invariant at depth 2. HEAD: RED under the in-flow draft; GREEN
   only out of flow.
4. **L4 the fold** — `scrollHeight` invariant at 1280 and 1024 with two lines. RED under the
   below-berth.
5. **L5 the clearance, as a MODEL row** — three records in, exactly two `<p>` out, the oldest's
   text absent from the DOM; plus line two's foot ≥ 6.0 px above the ribbon on four phone rigs.
   Born with the cure.
6. **L6 one region** — exactly one live region in the strip; line two is a `paragraph` node in
   the tree (NOT hidden); a push changes the region's text once. HEAD: GREEN on the count; RED on
   the paragraph (the pass-1 build hides it).
7. **L7 the rung** — `gateNote` in `check-ink-pressure.mjs`: `--ink-press-quiet` on
   `--color-background` ≥ 4.5 both themes, and the discovery census ≥ 16 consumers ⊇ the pinned
   rows. HEAD: RED (the gate has no note row and no discovery).
8. **L8 the caption law** — a deal leaves both lines `""`, AND the givens twin: `givenCells
   {0,5,9}`, `dealt`, generation bump over a standing two-deep column → both `""`. HEAD: RED (the
   existing row mounts on an empty margin).
9. **L9 records only** — a conflict never lands in line two; a solve empties both before
   `celebrating`. Born with the cure.
10. **L10-W the width row** — the 99-string sweep at 360 coarse, red under 10 % headroom. Pass-1
    build: **RED at 4.99 %**. Cured: 16.9 %. Re-run at §10.
11. **L11 the strike** — a write on `cell` or in `because` (self or peer) removes the record at
    either depth within one exit; a write elsewhere leaves it; a refusal is never struck. HEAD:
    RED (the pass-1 build leaves the orphan standing, `readings/C2-orphan-*.json`).
12. **L12 the stutter** — the same sentence twice is one record; the column never prints one
    sentence twice. Pass-1 build: GREEN by the prototype's clauses; the row pins them to the spec.
13. **L13 the exit** — a pushed-off or struck line reports a computed `ink-rub-out` leave on
    `--motion-whisper` and is absent at ended + 1 frame; under PRM absent same-frame with
    `animationDuration 0s`. HEAD: RED (a cut); the PRM half exists to red if §13 re-homes PRM off
    the element's name.
14. **L14 the tally's berth** — at 1024 with verdict + a 162 px tally + the longest aged line,
    line two's ink is inside its box and the block keeps `flex-wrap: wrap`. Pass-1 build: RED
    (6.53 px outside).

Objection carried, not argued in a diff: the strike partly retracts the family's own "nothing an
act does wipes a note". It retracts it only for a sentence whose "here" no longer exists, which
is the family's ruling (records, not live claims) applied to itself. The copy arm is the
alternative and the owner disposes.
