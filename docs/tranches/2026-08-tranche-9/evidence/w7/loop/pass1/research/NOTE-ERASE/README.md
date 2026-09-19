# NOTE-ERASE · THE ERASER — pass-1 lane record

T9-W7 §7, the hint note's lifecycle (and the refusal note's, and the verdict's). One family,
alone, on its own terms. Nothing closes here (U-10).

Ran on THIS tree (uncommitted W7/W8 work in flight), dev server `127.0.0.1:4249`
(`npx vite --host 127.0.0.1 --port 4249 --strictPort`), playwright on this lane's own scratch
config (`probe/pw.config.ts` — the estate's default was never used; it starts :3000).
chromium + webkit headless, 390×844 and 1280×800, light and dark, DPR 1 and DPR 3.
No product file was touched. Every proposal below was shown by injection
(`addStyleTag` / `page.evaluate`) over the LIVE `MarginNote`; the one thing injection cannot
reach is written as a `.diff` and left unapplied (`proto/authorship-seam.diff`).

> **Where the probes were run from.** `docs/` has no `node_modules`, so playwright cannot
> resolve `@playwright/test` from a config inside it. The banked sources under `probe/` are
> the authority; they were run from a scratchpad mirror carrying a symlinked `node_modules`
> (`scratchpad/ne-probe/`), and `logs/` + `frames/` are copied back byte-for-byte. The r0
> instruments are copied in UNCHANGED (`probe/marks.probe.ts`, `probe/marks2.probe.ts`);
> their `OUT` is `../logs` relative to the probe file, so a re-run banks here and never
> writes back over r0's.

---

## 1 · THE SUBSTRATE, VERIFIED

| claim | site | reading on this tree |
|---|---|---|
| the note's arrival, and its only animation | `MarginNote.vue:147-149` | `ink-write-in 250ms var(--ease-noteWrite) backwards` |
| the keyframe itself | `index.css:1115-1122` | `from { clip-path: inset(0 100% 0 0) } to { inset(0 0 0 0) }` |
| the write-in's curve | `index.css:349` | `--ease-noteWrite: cubic-bezier(0.22, 1, 0.36, 1)` |
| the erase family's curve | `index.css:352` | `--ease-accelIn: cubic-bezier(0.55, 0.055, 0.675, 0.19)` |
| the asymmetry it already proves | `AnswerKeyLaminate.vue:221-226` vs `:229-237` | lift-away 200ms `accelIn` against a 280ms `glassGlide` lay-down — out:in = 0.714 |
| the beat | `pencilConfig.ts:123` | `MOTION.beatMs = 125`; the write-in is exactly two beats |
| the note's own span, keyed on its text | `MarginNote.vue:61` | `<span v-if="text" :key="text" class="margin-note-ink">` |
| the strip reserves its line whether or not it speaks | `MarginNote.vue:106` | `.margin-note-block { min-height: 1.3em }` |
| the note cannot be clicked | `MarginNote.vue:97, :130` | `pointer-events: none` on block and paragraph (the tally re-enables at `:179`) |
| the exit | — | **there is none**, as R4's M2 row says |
| the note's life, all of it | `GameBoard.vue:621-626` (`setMargin`), `:689-707` (hint + W1's falsy arm), `:713-724` (refusal), `:726-…` (verdict) | four writers, one strip |
| `props.hint` | `useGameState.ts:272` | `hintReasoning`, nulled at `:434`, `:487`, `:604`, `:770`, `:790` |
| a peer's digit reaches those nulls | `useSession.ts:792` → `useGameState.ts:375` → `:474` | `source.applyValue` → `applyCellValue` → `:487` / `:488` |
| PRM kills the note's animation outright | `index.css:1157-1171` | `.margin-note-ink, .margin-note-meta … { animation: none !important }` |
| a `forwards` fill is census-gated | `filterBudget.ts:252` (`FILL_ALLOWLIST`), `e2e/filter-census.spec.ts:507` (G3.2) | authored `forwards|both` sites must EQUAL the allowlist |
| the caption may not come back | `GameBoard.receipt.test.ts` | read; the note is not a caption and this family adds no second tenant |
| the ramp | `index.css:257-266`, comment `:236-247` | quiet 68%, priced **on `--color-card`** at 5.23 / 6.06 |

Two things the substrate list in the charter got slightly wrong, and both matter:

1. **The note is not painted on the card.** Its composited backdrop is
   `--color-background` — `rgb(251, 250, 249)` light, `rgb(17, 15, 14)` dark, one layer, the
   page root (`logs/e1-lives-*.json` → `backdropAtHead.backdropChain`). The ramp's published
   figures are card figures; the note's own are §5.
2. **`applyHintInk` (`useGameState.ts:537`) nulls neither voice**, so a peer's REVEALED digit
   on the very cell your note names leaves the note standing today. Same defect, sign flipped.
   The seam in `proto/authorship-seam.diff` covers both functions.

---

## 2 · THE LIVES — hint, verdict, refusal

Against R3's fifteen-act census, re-run unchanged on this tree and extended to webkit
(r0 ran chromium only): **15 of 15 rows reproduce, both engines**
(`logs/hintnote-chromium.json`, `logs/hintnote-webkit.json`, `logs/hintnote2-*.json`).

| voice | tone | what it is | what retracts it TODAY | does it age |
|---|---|---|---|---|
| hint | graphite | advice you asked for | six board acts (2nd H, deal, clear, fill, solve, any digit — **including a peer's**) | **no** — opacity 1.000 after 30 s idle |
| conflict verdict | teacher-red | a fact about the board | the grade reverting to idle (`GameBoard.vue:726-…`, the non-graphite clear) | no |
| refusal | teacher-red | a reply to one keystroke | ink that LANDS, deal, fill (`useGameState.ts:488, 605, 771`) | **no** — measured at 30 s, still "that's a given clue" (`logs/e6-refusal-*.json`) |

The survivors, measured: nine non-mutating acts leave the hint note at opacity 1.000, and a
30 s idle is one of them. That is the family's whole subject.

Two lives that nobody has stated, both measured here:

- **A refusal cannot say the same thing twice.** Refuse the same given a second time and the
  strip does not move: `animationstart` 0, DOM mutations 0, text unchanged, both engines
  (`logs/e9-grammar-*.json` → `repeatRefusal`). `setMargin` writes the string the ref already
  holds, so Vue re-renders nothing, `:key="text"` never changes, the write-in never replays and
  an `aria-atomic` live region announces nothing. The board's SECOND voice cured exactly this
  class at `GameBoard.vue:659` (`announce()` — empty first, write on the next flush). The
  margin never got the cure, and a rub-out gives it one for free: the old line leaves, the new
  line writes in, and the two mutations the region needs happen because the note actually left.
- **The note's exit frees no space.** `.margin-note-block` holds `min-height: 1.3em`
  (`MarginNote.vue:106`), so retracting a note reclaims zero layout at either width. Anything
  the erase buys, it buys in attention, not in room.

---

## 3 · THE CLOCK — arm (a) vs arm (b)

Born-RED rows, taken at HEAD before anything was injected:

| row | family's expectation | HEAD, chromium | HEAD, webkit |
|---|---|---|---|
| (a) note gone N beats after the last board action | gone | **RED** — stands, opacity 1.000 at 30 s | **RED** — stands, opacity 1.000 at 30 s |
| (b) settled to the quiet rung 8 beats after arrival | ink at 68% | **RED** — full graphite, 14.52:1 light | **RED** — 14.52:1 light |
| (b) still standing at 30 s | standing | GREEN (it never leaves) | GREEN |

Prototyped, both arms, both viewports, both themes (`logs/e1-lives-*.json`): arm (b)'s settle
lands at 5.18:1 light / 6.11:1 dark and holds (§5). Arm (a) was prototyped as the rub-out
firing on a clock (`logs/e7-arm-a-cost-*.json`).

**What arm (a) costs, with the number.**

1. *The model does not leave with the note.* An overlay can rub the sentence out; it cannot
   null `hintReasoning`. That is not a limit of the rig, it is the coupling: the note and the
   armed hint are two objects, and ageing one silently desynchronises them. Measured, with the
   note rubbed out: `becauseCells` still lit — **1** cell for "only N fits here", **9** for
   "N goes nowhere else in this `<house>`" — so the board goes on making an argument the page
   no longer states. And the reader's natural next act, pressing H again, does **not** re-say
   it: it INKS THE DIGIT (`boardChangedByTheNextHPress: true`, both engines), because the
   second press consumes the armed hint (`useGameState.ts:788-792`). A clock that erases the
   sentence and leaves the model armed turns the hint key into a reveal key without telling
   anyone.
2. *So arm (a) must disarm too* — and then it takes the highlighted argument off the board at
   the same moment, which is the information the reader is actually staring at during a long
   think.
3. *Recovery is one keypress, and the sentence is the same one.* Ink the hint, undo it, press H
   again: `only 5 fits here` → `only 5 fits here` (chromium), `8 goes nowhere else in this row`
   → the same (webkit) (`logs/e7-arm-a-cost-*.json` → `determinism`). So arm (a) is not
   catastrophic. It is simply unpaid-for.
4. *And it buys nothing.* The strip's line is reserved either way (§2), the six board
   mutations already retract the note the moment it could become false, and a note the board
   has not moved under is still TRUE. Arm (a) spends a real cost — a desync risk, a disarmed
   argument, one keypress — to remove a true sentence from a line that stays empty anyway.

**N, if a clock is nevertheless wanted.** The generous N the charter fears is real: any N over
about 20 beats (2.5 s) is indistinguishable from HEAD on the sessions this probe can drive,
because every act that would restart the clock also retracts the note. The only regime where
arm (a) is observable at all is a reader who arms a hint and then does nothing at all — which
is precisely the long think it must not interrupt. **Arm (a) is only visible where it is
wrong.** That is the family's own kill condition, met.

**Verdict: arm (b).** No clock on the hint. The note settles to the quiet rung eight beats
(1000 ms) after it is written and waits for an act. One exception, argued in §8: the refusal.

---

## 4 · THE WIPE — the write-in's mirror, frame-traced

Injected verbatim from `proto/rub-out.css`; traced per frame at 390×844 and 1280×800, both
engines, PRM off and on (`logs/e2-wipe-*.json`).

```
THE WRITE-IN (HEAD)                          THE RUB-OUT (proposed)
clip-path: inset(0 100% 0 0) → inset(0)      clip-path: inset(0) → inset(0 100% 0 0)
250ms = 2 beats, --ease-noteWrite            125ms = 1 beat,  --ease-accelIn
fill: backwards                              fill: NONE — the node leaves instead

  |only 8 fi|                                  |only 8 fits her|
  |only 8 fits h|        the hand writes        |only 8 fi|        the hand rubs back
  |only 8 fits here|     left to right          |only|             from the end of the line
                                                ||
```

| viewport | engine | duration | frames sampled | distinct clip states | ended at | filter | transform on glyphs |
|---|---|---|---|---|---|---|---|
| 390×844 | chromium | 125 ms | 49 | 16 | 131.0 ms | none | none |
| 390×844 | chromium | 180 ms | 49 | 23 | 185.5 ms | none | none |
| 1280×800 | chromium | 125 ms | 50 | 16 | 124.2 ms | none | none |
| 1280×800 | chromium | 180 ms | 49 | 23 | 184.2 ms | none | none |
| 390×844 | webkit | 125 ms | 25 | 9 | 150.0 ms | none | none |
| 390×844 | webkit | 180 ms | 25 | 13 | 205.0 ms | none | none |
| 1280×800 | webkit | 125 ms | 25 | 9 | 142.0 ms | none | none |
| 1280×800 | webkit | 180 ms | 25 | 13 | 202.0 ms | none | none |

`dirtyAncestors` is empty in all eight cells: nothing on the note or above it filters or
transforms while the wipe plays. **Opacity and clip only; no glyph moves; nothing boils.** The
filter census is untouched by construction — the verb mints no filter, so `filterBudget` stays
9 by exact match.

**Duration: 125 ms, one beat.** The write-in is exactly two beats; the erase family's own
ratio (the laminate's 200/280 = 0.714) would put it at 179 ms, which is 1.43 beats and lands
on no grid. One beat is half the write-in, it is the house's own quantum, and even on webkit's
60 Hz sampling it reads as nine distinct steps rather than a cut. 180 ms is the named
fallback if a synthesizer prefers the laminate's ratio to the beat; both are traced above.
**Residue: zero.** The verb is one beat long, so nothing sits at the quiet rung afterwards —
the charter's "≤ one beat of residue" is met with room.

### The two traps the trace caught

**(i) No fill, and no `animationend`.** With no fill, the frame after the verb ends the note is
back: `clip: none, opacity: 1` at t = 393-407 ms in every non-PRM cell above. The end pose of
an exit is *not there*, so the node must be REMOVED when the verb finishes. A `forwards` fill
instead would need a new `FILL_ALLOWLIST` row (`filterBudget.ts:252`) and a G3.2 update, and
it would retain an effect on a resident element — the exact thing T6 marks 14/15 retired.

**(ii) The removal may not be gated on `animationend`.** Under PRM, `index.css:1157-1171` puts
`animation: none !important` on `.margin-note-ink`, so the injected verb does not run at all —
`animationName: "none"`, one distinct clip state, and `animationend` **never fires**, both
engines (`logs/e2-wipe-*.json`, and caught again live in `logs/e7-arm-a-cost-*.json` →
`prmArm: { animationEndFired: false, stillPainted: true }`, where this lane's own first
prototype made the note immortal for exactly the readers who asked for less motion).

The idiom that satisfies both: a Vue `<Transition>` around the keyed ink span, with the
rub-out on its `leave-active` class. Vue resolves a leave by reading the element's computed
animation/transition durations and falls straight through when there are none, so PRM collapses
to a same-frame removal by construction rather than by a timer somebody has to remember. A
replacement (a newer note) is `mode="out-in"`: the old line rubs out, the new one writes in,
total 375 ms, and the live region gets the two mutations the repeat defect in §2 needs.

---

## 5 · THE QUIET RUNG — painted bytes on the phone's 16 px hand face

390×844, `font-size: 16px`, `font-family: "Patrick Hand"` (desk reads 18.176 px), on the note's
REAL backdrop. Painted bytes are a screenshot of the note's own box read back through `sharp`:
the modal pixel is the paper, the ink core is the 0.5th-percentile pixel farthest from it.
Composite is `access.spec.ts` 2.3's bottom-up compositor, printed beside it as a control.

| theme | rung | composite | painted (chromium) | painted (webkit) | DPR 3 | floor |
|---|---|---|---|---|---|---|
| light | full graphite (HEAD) | 14.52 | 14.52 | 14.52 | 14.52 | — |
| light | **quiet 68 %** | **5.18** | **5.17** | **5.17** | **5.17** | 4.5 ✓ |
| dark | full graphite (HEAD) | 12.25 | 12.25 | 12.25 | 12.25 | — |
| dark | **quiet 68 %** | **6.11** | **6.07** | **6.13** | **6.07** | 4.5 ✓ |

Ink core light `rgb(107, 106, 106)` on paper `rgb(251, 250, 249)`; dark `rgb(147, 146, 140)` on
`rgb(17, 15, 14)`. Ink coverage 24-29 % of the crop's pixels at both rasters, so the core is a
real stroke and not one stray subpixel: painted and composite agree to ≤0.06.
Crops: `frames/note-quiet-light-chromium.png` (2.9 KB), `frames/note-quiet-dark-chromium.png`
(3.1 KB) — the only two banked, one per theme of the one claim a number could be doubted on.

**The rung holds, and the ramp's own comment is off by a card.** `index.css:236-247` prices
quiet at 5.23 light / 6.06 dark on `--color-card`; the note is painted on `--color-background`,
where the same token reads 5.18 / 6.11. Both clear AA at 16 px, DPR 1 and DPR 3, both engines.
No rung moves. (The ladder's law is untouched: nothing is added to it and no stop is
re-pitched, so `check-ink-pressure` has nothing new to rank.)

---

## 6 · THE PEER ROWS — two pages on `?wire=local`

One browser context, the product's own invite verb, page B a real second reader
(`logs/e4-peer-*.json`).

| row | family's law | HEAD, chromium | HEAD, webkit |
|---|---|---|---|
| a peer JOINS | the note stands | **GREEN** — "only 6 fits here" stands | **GREEN** — "only 5 fits here" stands |
| a peer writes ELSEWHERE | the note stands | **RED** — wiped to `""` | **RED** — wiped to `""` |
| a peer writes THE NAMED CELL | the note is erased | green, but for the wrong reason: every peer write erases | same |

A join touches no board value, so it reaches none of the five nulls — the row is green by
construction. The other two are one line apart in `applyCellValue` and the seam cannot tell
them apart, because `applyCellValue(pos, value)` never receives the write's source.

**The seam, specified not cut:** `proto/authorship-seam.diff`. A `WriteOrigin = "self" | "peer"`
third parameter defaulting to `"self"`; `sessionSource.applyValue` (`useGameState.ts:374-375`)
is the one call site that knows, and passes `"peer"`; the two nulls become

```
if (origin === "self" || armedHintTurnsOn(pos)) hintReasoning.value = null;
if (origin === "self")                          lastRefusal.value  = null;
```

where `armedHintTurnsOn` is `h.cell === pos || h.becauseCells.includes(pos)` — the dependency
set the board ALREADY highlights, measured at **1** cell for a naked single and **9** for a
hidden single at 9×9. `applyHintInk` takes the same parameter, because a peer's revealed digit
is a write too and today it retracts nothing at all. The diff names the five unit rows it
earns. It is W1's file; this family specifies it and does not cut it.

The same three lines also cure a second voice for free: at HEAD a peer's digit in the far
corner takes YOUR refusal note away (`useGameState.ts:488` is reached by the same path), which
nobody designed either.

---

## 7 · THE BOARD LEAVING — the census row does not say what it looks like it says

**R3-d's "press Escape (gallery)" row measured a board the reader never left.** `Escape` is the
DECK's key, bound on the window only while the deck is mounted (`GameGallery.vue:708-721`);
from a board it does nothing. The board's real entries are a bare `g` (`App.vue:774`, expressly
refused inside a cell input, so a hint-armed reader has to blur first) and the masthead
wordmark. Both were exercised (`logs/e5-leaving-*.json`):

| verb | deck up | note's box | in viewport |
|---|---|---|---|
| Escape | **no** | painted, 20.8 px tall at y 624.9 (390×844; width follows the sentence) | yes — nothing happened |
| `g` | yes | 0 × 0 | no |
| wordmark | yes | 0 × 0 | no |

And while the deck is up the whole board layout is `display: none`
(`logs/e8-roundtrip-*.json` → `deckA11y.hiddenBy: "display-none:app-layout"`,
`checkVisibility() === false`), so the note is neither painted nor in the accessibility tree.
Coming back by cancelling returns the SAME board (`boardSame: true`) with the same still-true
sentence, at the same box, both engines.

**So there is no defect on this path to cure.** A note cannot outlive its board here: either
the board comes back unchanged and the note is still true, or the trip changed the board — a
deal, a select — and the deal already nulls the hint at `useGameState.ts:604`. The rule "a note
may not outlive its board" should be stated as what it is: already true, by two mechanisms,
and worth one assertion in a suite rather than a new retraction. The deal/clear/fill/solve rows
re-read unchanged: deal, fill and the second H press RETRACT (`""`), clear and solve REPLACE
("the board is clear", "solved it!") — `logs/hintnote2-*.json`, five for five, both engines.

---

## 8 · ONE GRAMMAR — one wipe, three lives, and only one settle

The rub-out is the strip's exit and belongs to all three voices: one span, one keyframe, one
curve. The SETTLE is not, and the number says so. Every tone measured at full pressure and at
the quiet rung's 68 %, on the note's real backdrop, painted bytes and composite
(`logs/e9-grammar-*.json`):

| theme | tone | full | at 68 % | text floor 4.5 |
|---|---|---|---|---|
| light | graphite | 14.52 | **5.20** | ✓ |
| light | teacher-red | 4.87 | **3.04** | ✗ |
| light | gold-star | 4.85 | **2.70** | ✗ |
| dark | graphite | 12.25 | **6.11** | ✓ |
| dark | teacher-red | 6.44 | **3.52** | ✗ |
| dark | gold-star | 11.48 | **5.77** | ✓ |

(Graphite reads 5.20 here and 5.18 in §5: §5 settles through the ramp's own token
`--ink-press-quiet`, this table mixes 68 % of each tone's resolved colour so all three are
measured by one method. The 0.02 is the difference between the two, not a moving rung.)

Both verdict tones sit within 0.4 of the floor at FULL pressure in light mode, so dimming them
is not a style choice, it is a failure: 3.04 and 2.70 are below the non-text floor as well.
**A verdict never settles.** It is a grade, and a grade you can barely read is a grade you
doubt.

The three lives, stated:

```
HINT (graphite, advice)           write-in 250ms ──▶ 8 beats ──▶ settle to quiet ──▶ [waits]
                                                                                       │
   retracted by: your write · the second H press · deal · clear · fill · solve ─────────┤
                 a PEER's write ONLY on {hint.cell} ∪ becauseCells ─────────────────────┤
                 a newer note (out-in) ────────────────────────────────────────────────▶ rub-out 125ms

VERDICT (teacher-red / gold)      write-in 250ms ──▶ [holds at full pressure, never settles]
   leaves when the FACT leaves: the grade reverts to idle ────────────────────────────▶ rub-out 125ms

REFUSAL (teacher-red, a reply)    write-in 250ms ──▶ [holds] ──▶ 24 beats since the LAST
                                                                 refusal ──────────────▶ rub-out 125ms
   retracted by: your ink that lands · deal · fill ─────────────────────────────────────┘
   a peer's write: never (it was about YOUR keystroke on a given a peer cannot write either)
```

**The refusal is the one voice that ages, and its clock is not arm (a).** The hint's clock was
killed because the sentence stays true and carries information the reader is using. A refusal
carries neither: it answered one keystroke, that keystroke is over, and the thing it leaves on
the page is the loudest ink in the product with nothing to be about. At HEAD it stands
indefinitely — 30 s measured, and in principle for the rest of the session
(`logs/e6-refusal-*.json`). **24 beats = 3.0 s**, derived from the house's own definition of a
moment (`CELEBRATION`'s ≤3.2 s crest cap, `pencilConfig.ts §CELEBRATION`), measured from the
LAST refusal (`lastRefusal.seq` bumps per attempt) rather than from the first, so refusing
twice restarts it. This is the family's only clock and it is bounded by a number the estate
already ratified. The band to dispose at the re-look is **24-40 beats**: 24 is the house's
moment, 40 (5.0 s) is what the common external reading-time heuristic gives a four-word line
(≈3 s base + 1 s per three words), and the owner's eye is the instrument that settles it.

Crops: none. Every row above is a ratio or a count; the one claim a number could not settle
(what the quiet rung looks like at 16 px) has its two crops in §5.

---

## 9 · COPY

**No string is minted.** The family is a lifecycle: a curve, a rung, a clock and a seam. The
gates were run anyway as controls at HEAD, from `web/frontend`:

- `node scripts/check-copy-register.mjs` → 0 em/en dashes, 0 unadmitted jargon (2 admitted,
  both pre-existing, `GameControlPanel.vue:980, :1297`).
- `node scripts/check-font-coverage.mjs` → OK; Patrick Hand 46 codepoints / 4312 B, Fraunces 30
  / 14636 B, both cuts supersets of what 150 src files render.

Neither moves, because nothing rendered changes. A rendered-string change would be a woff2
re-cut and this family does not make one.

---

## 10 · INSTRUMENTS — before and after

| instrument | reused / new | reading |
|---|---|---|
| `r0/r3-marks/probe/marks.probe.ts` R3-d | reused UNCHANGED | 10/10 acts reproduce on this tree; extended to webkit (r0 was chromium-only) — `logs/hintnote-chromium.json`, `logs/hintnote-webkit.json` |
| `r0/r3-marks/probe/marks2.probe.ts` R3-g | reused UNCHANGED | 5/5 board-changing acts reproduce, both engines — `logs/hintnote2-*.json` |
| `probe/erase.probe.ts` E1 | new, born-RED where the family contradicts HEAD | 4 viewport×theme cells + the 30 s row + the re-read |
| E2 | new | 8 frame traces; PRM collapse proven on both engines |
| E3 / E3b | new (2.3-style contrast + painted bytes) | AA at DPR 1 and DPR 3, both themes |
| E4 | new, on R5's `?wire=local` rig | 3 peer rows, both engines |
| E5 / E8 | new | the gallery verbs; R3-d's Escape row corrected |
| E6 | new | the refusal at 30 s |
| E7 | new | arm (a)'s desync, priced |
| E9 | new | the three tones at the settle rung; the repeat-refusal silence |
| `check-copy-register.mjs` / `check-font-coverage.mjs` | reused | green, unchanged (§9) |
| `GameBoard.receipt.test.ts` | read, not run against a patch | the caption law; this family adds no tenant to the strip and no second region |

Two rows from the r0 re-run failed on **webkit** — `R3-b` (the whole tab order) and `R3-f`
(focus-ring contrast), both in other families' sections and both tab-traversal rows that
webkit's default keyboard-access model does not serve. Not this family's rows, not a product
regression; stated so the re-run's exit status is not read as a clean sweep.

---

## 11 · KILL CONDITIONS

| condition | met / cleared |
|---|---|
| a clock that ends when a hint is most useful | **MET, and it killed arm (a)** — the only regime where a clock is observable is a reader doing nothing, which is the long think |
| a generous N indistinguishable from HEAD | **MET** — every act that restarts the clock also retracts the note, so N > ~20 beats is unobservable |
| the quiet rung under AA | **CLEARED** — 5.17-5.18 light, 6.07-6.13 dark, painted and composite, both engines, DPR 1 and 3 |
| the note becoming a caption | **CLEARED** — no new tenant, no new region, no new string; `GameBoard.receipt.test.ts` untouched in both directions |
| the authorship test is W1's seam and may not be cut here | **HONOURED** — `proto/authorship-seam.diff`, unapplied |
| a dismiss control | not proposed; the strip is `pointer-events: none` at two levels and a 44 px target (`index.css:793+`) would be chrome the note has not earned |
| the erase touching the filter census | **CLEARED** — clip + opacity only, `filterBudget` 9 untouched, no `BoilDivider`, no live filter |

---

## 12 · RECOMMENDATION — **DEVELOP, with arm (a) dead**

Develop the eraser. The wipe is the strongest half and it is cheap: one keyframe that is the
existing `ink-write-in` reversed, one beat long, on the curve the laminate already leaves on,
clip and opacity only, no filter, no glyph transform, zero residue, and a PRM collapse that
comes free from a rule already in the stylesheet — proven frame by frame on both engines at
both widths. It closes R4's M2 hole (the estate's one transition with an arrival and no
departure) without minting a primitive, a string, a filter or a tap target.

Kill the clock on the hint note. Arm (a) died on its own numbers: the note's line is reserved
whether it speaks or not, every act that could make the note false already retracts it, and the
only way to erase a still-true sentence is to disarm the model with it — which takes the
highlighted argument off the board during the long think, or, if the model is left armed,
turns the next H press into a silent reveal. Arm (b) instead: after eight beats the note
settles to `--ink-press-quiet`, which measures 5.18:1 light and 6.11:1 dark on its real
backdrop at 16 px, and then it waits. One voice keeps a clock — the refusal, at 24 beats from
the last attempt, because a reply whose act is over is the one line on the strip with nothing
left to be about — and no verdict ever settles, because teacher-red at 68 % is 3.04:1 and gold
is 2.70:1. Take the seam to W1 as written: a peer's digit elsewhere leaves your note standing,
a peer's digit on the cell your note names takes it away, a join never touches it. And take the
repeat with it: the second identical refusal currently moves nothing at all, and a note that
can leave is what lets the same sentence be said twice.

---

## 13 · RISKS AND OPEN EDGES

1. **The leave must be a `<Transition>`, not an `animationend` listener.** Measured twice on
   this tree (§4 trap ii). Anything that watches for the event loses the note forever under
   PRM. If a synthesizer prefers an explicit timer, the timer's PRM arm must be 0 and must be
   read from the same media query, not assumed.
2. **`mode="out-in"` delays a REPLACEMENT by one beat** (125 ms before the new line starts its
   250 ms write-in). For the live region that is an improvement — two mutations instead of
   none — but a verdict arriving on a solve now lands 125 ms later than it does today. Nothing
   measured objects; a synthesizer should still state it.
3. **The dependency set is the board's own highlight, and it is bigger than it looks.** Nine
   `becauseCells` on a hidden single means nine squares where a peer's digit takes your note.
   That is right (the argument really does turn on them) but it makes the peer cure less
   visible than the headline suggests: on a busy board most peer writes will still land inside
   somebody's argument.
4. **`applyHintInk` is the third write path and nulls nothing today.** The diff covers it; a
   synthesizer that takes only the `applyCellValue` half will ship a note that survives a
   peer's REVEAL of the very cell it names.
5. **The 24-beat refusal clock is the one number in this record without a measurement behind
   it** — it is derived from the celebration cap, not observed. It is also the one number an
   owner can feel at a glance, so it belongs in the re-look rather than in a gate.
6. **The settle is a colour transition on text.** It touches no geometry and promotes no layer,
   but it is 500 ms of `color` on a hand face; if W8's device budget objects, the fallback is a
   step (no transition), which costs nothing and reads as the hand lifting.
7. **A timed disappearance on a `role="status"` region is a WCAG 2.2.1 question, not only a
   taste one.** Background reading only, and it does not decide anything here, but it points
   the same way the measurements do: the common guidance is that a message the reader must act
   on carries no timer at all, and that a status region which vanishes on a clock is a timeout
   unless it is adjustable. The hint note is exactly such a message, which is a second reason
   arm (a) is wrong; the refusal's 24-40 beat clock is the one place the question actually
   applies to this family, and a synthesizer should decide whether that clock pauses on hover
   or focus (the estate has no such idiom today, and minting one for a four-word reply may cost
   more than the clock is worth).
   [scottohara.me](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html) ·
   [w3c/wcag#976](https://github.com/w3c/wcag/issues/976) ·
   [Primer](https://primer.style/accessibility/patterns/accessible-notifications-and-messages/)
8. **`--ease-accelIn` currently has 5 sites** (R4 §2.1's curve census); this family adds one.
   Nothing in the law list scopes it the way the drawer's glass curve is scoped, but a
   synthesizer should check the count has not become its own argument.
