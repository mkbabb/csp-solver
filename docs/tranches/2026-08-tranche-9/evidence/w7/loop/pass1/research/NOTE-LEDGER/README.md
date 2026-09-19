# PASS 1 · NOTE-LEDGER — the margin keeps a column, and the column is two deep

T9-W7 §7, the hint note's lifecycle. Research lane, read-only on the product: every ledger line
below is a CLONE of the live `.margin-note-block` mounted by `page.evaluate`. Nothing in `src/`
was touched and no `.diff` was needed.

Rig: this tree (uncommitted W3/W6/W7/W8 work included), `npx vite` on `127.0.0.1:4243`
(the charter named :4250; the wave's laws reserve 4250-4260 for the concurrent W8 lanes and give
this loop 4230-4249, where 4232 and 4247 were already taken), chromium + webkit headless on this
lane's own config (`probe/pw.config.ts`, the estate's default minus `webServer`/`globalSetup`).
Logs in `logs/`, instruments in `probe/`, the replayable overlay in `proto/`, two crops in
`frames/` (47 KB for the pair).

---

## 0. The verdict in four numbers

| | measured |
|---|---|
| a second note IN FLOW at 390×844 | the board rises **13.59px** (webkit 13.60), untweened, in the insert's own layout step |
| a second note OUT OF FLOW at 390×844 | the board does not move; the column clears the fold's ribbon by **4.80px** |
| a third note, either way | covers the ribbon by **16.00px** — and its rung is **3.51:1**, sub-AA for text |
| a second note at 1280×800 | the board does not move; the page gains **18.06px** of scroll where it had none |

**DEVELOP, at depth two, out of flow, on the phone AND the desk — with the desk's page-scroll
row unresolved.** The family's own arithmetic kills the third line twice over, so "the honest
column is two" is not a concession the charter made in advance, it is the measurement.

---

## 1. The substrate, verified on this tree

| claim | where | reading |
|---|---|---|
| one note, one berth | `MarginNote.vue:53-86` | one `role="status" aria-live="polite" aria-atomic` paragraph; `v-if="text"` |
| the strip reserves exactly one line | `MarginNote.vue:96-107` | `.margin-note-block { min-height: 1.3em }` = **20.80px** at 390, measured |
| the write-in, and no exit | `MarginNote.vue:147-150` | `ink-write-in 250ms var(--ease-noteWrite) backwards`; **no wipe out, no ageing rule** |
| the strip is a COLUMN with a gap | `GameBoard.vue:1273-1281` | `display:flex; flex-direction:column; gap:0.4rem; margin-top:0.4rem` → a line costs **27.19px** in flow (20.80 ink + 6.38 gap) |
| in flow below 1024, overlay above | `GameBoard.vue:1300-1310` | `position: static` at 390/900, `absolute; top:100%` at 1280 (measured, both) |
| the strip yields the tongue's column | `GameBoard.vue:1293-1297` | `margin-right: 6.5rem` portrait → the line is **258px** wide at 390 |
| one writer, one slot | `GameBoard.vue:614-624` `setMargin` | `marginText` + `marginTone`, two refs; every writer clears `hintNoteLive`/`refusalNoteLive` |
| the five null sites | `useGameState.ts:434, :487, :604, :770, :790` | `hintReasoning.value = null` — clear/restore · any write · deal · fill-forced · the second H |
| the peer routes through :487 | `useGameState.ts:375` → `applyCellValue` | `sessionSource.applyValue` is the same primitive as your keystroke |
| the falsy arm that retracts | `GameBoard.vue:685-707` | W1 §1.2's `else if (hintNoteLive) setMargin("", "graphite")` |
| the grade clears on revert | `GameBoard.vue:750` | `state === "idle" && marginTone !== "graphite"` → non-graphite tones go stale by themselves |
| the ramp has TWO rungs, not three | `index.css:257-266` | `--ink-press-rule` 55% (non-text floor 3.0) · `--ink-press-quiet` 68% (text floor 4.5). A third rung is a re-run of `check-ink-pressure` over every rung in light, dark AND print (`scripts/check-ink-pressure.mjs:87-96`) |
| the caption may not come back | `GameBoard.receipt.test.ts:107-118` | an ordinary deal must leave the strip `""` and must not fall through to the wipe receipt |
| the ribbon under the strip is a TELEPORT | `GameControlPanel.vue:1382-1383` | `<Teleport defer to="#fold-tools" :disabled="!portraitDock">` wrapping `.play-controls`, `:inert="ribbonCovered"` — measured 245.83×55.98 at 390×844, the phone's only always-visible controls |

Two numbers MOVED from the round-zero census, both small and both named:

- **The note's backdrop is the PAGE, not the card.** Painted bytes read `rgb(251, 250, 249)`
  light / `rgb(17, 15, 14)` dark under every line, at 390 and at 1280. R6's ladder figures
  (rule 3.53 light / 4.36 dark) are resolved over `--color-card`; over the note's real paper the
  same rungs read **3.51 / 4.37**. The conclusion is unchanged and slightly worse.
- **The phone's note box.** R3 read 188×21 at y 523 on a 393×699 rig; at 390×844 it is
  **20.80px** tall at y 594.13, and the ink box is the string's own width (93-210px across the
  product's whole vocabulary).

---

## 2. HEIGHT — the deciding measurement

`probe/height.probe.ts` → `logs/height-*.json`. Both engines, both themes, sheet shut and open,
depths 1/2/3/5. Chromium at 390×844 (webkit within 0.32px on every row, and identical to 0.01px
in every delta):

| depth | board.y | board.h | strip.y | strip.h | ribbon.y | scrollH |
|---|---|---|---|---|---|---|
| 1 | 219.73 | 366 | 594.13 | 20.80 | 640.52 | 844 |
| 2 | **206.14** | 366 | 580.53 | 47.98 | 654.11 | 844 |
| 3 | **192.55** | 366 | 566.94 | 75.17 | 667.70 | 844 |
| 5 | **165.36** | 366 | 539.75 | 129.55 | 694.89 | 844 |

**The board moves 13.59px per line** — exactly half the 27.19px a line costs, because the phone's
column is centred: the growth below the board is paid half by the board and half by the ribbon.
Dark is byte-identical to light; sheet-open is byte-identical to sheet-shut (the risen sheet is
an overlay: `controls-card` y 844 → 216, and it covers the whole strip while it is up — see §7).

The air the phone actually has: the note's foot is 614.92 and the ribbon's top is 640.52, so
**25.60px**, and one line in flow costs 27.19px. The family is 1.59px short in its natural
construction, on every phone rig measured.

### The one shape that survives

Take the older notes OUT of flow (their own absolutely-positioned host inside the strip, gapless)
and the strip keeps its single reserved line. `probe/overlay.probe.ts` → `logs/overlay-*.json`:

| rig | n=2 clearance over the ribbon | n=3 |
|---|---|---|
| 390×844 | **+4.80px** | −16.00px (covers it) |
| 393×699 | +4.80px | −16.00px |
| 390×664 | +4.80px | −16.00px |
| 360×740 | +4.79px | −16.00px |

Board y invariant at every depth, both engines. The clearance is a CONSTANT across the phone
estate because both terms are fixed spacings, not viewport fractions — which is the good news and
the risk in one line (§8).

The desk is tighter than the phone above the fold:

| rig | air under the note | n=2 |
|---|---|---|
| 1280×800 | 5.55px | column foot 818.06 → **18.06px past the fold**, scrollH 800 → 818 |
| 900×500 | 0px | column foot 505.56 → 5.56px past the fold, scrollH 500 → 506 |

In flow it is worse (scrollH 800 → 825 → 855 at 1280; 500 → 512 → 541 at 900×500), because the
≥1024 strip is already absolute and its overflow still extends the document.

---

## 3. THE RAMP — two rungs, and the third fails in BOTH themes

`probe/ledger.probe.ts` NL-2 → `logs/ramp-*.json`. Read twice: composited colour math (the
`access.spec.ts` §2.3 method) and PAINTED BYTES off a device-scale screenshot decoded whole.
The two agree to **±0.04** on every cell, both engines.

| rung | light composited / painted | dark composited / painted | text floor 4.5 |
|---|---|---|---|
| full (`--color-pencil-graphite`) | 14.52 / 14.52 | 12.25 / 12.25 | pass |
| quiet (68%) | 5.18 / 5.17 | 6.11 / 6.07 (webkit 6.13) | **pass** |
| rule (55%) | 3.51 / 3.50 | **4.37 / 4.39** | **FAIL, both themes** |

The charter's premise held and then some: the rule rung is sub-AA for text in dark as well as
light, so no arithmetic on the dark side rescues a third line. **The honest column is two: full
and quiet.** Nothing new is minted — the family spends exactly the two rungs already shipping, so
`check-ink-pressure` is untouched and no re-pitch is priced.

What ages a note: displacement, and nothing else. No clock, no timer, no note that dies while it
is being read.

---

## 4. THE VOICES, and the ruling on a verdict that stopped being true

The margin's whole vocabulary, from the product's own formatters
(`techniqueVoice.ts:41-88`, `GameBoard.vue:685-760`), measured against the phone's 258px line
(`logs/strings-chromium.json`, webkit identical):

| line | width at 390 | wraps |
|---|---|---|
| `8 goes nowhere else in this column` | 210.06px | no |
| `check the greater than signs` | 174.36px | no |
| `no solution from here` | 132.33px | no |
| `that's a given clue` | 110.13px | no |
| `the board is clear` | 106.13px | no |
| `only 8 fits here` | 94.41px | no |
| `still solving…` | 82.27px | no |
| `and 4 more` | 66.17px | no |
| `solved it!` | 55.80px | no |

Nothing wraps, so no note is secretly two lines. That matters more than it looks: a wrap would
make the two-note column a three-line column and spend the 4.80px twice over.

**THE RULING (this family must make it, so here it is):** a ledger holds RECORDS OF ACTS, never
LIVE CLAIMS ABOUT THE BOARD.

- Joins the column: the hint you asked for, the refusal you earned, the wipe receipt. Each is
  true forever, because each is the record of something that happened.
- Never joins: the conflict verdict and `solved it!`. Both are GRADES of the board as it stands,
  the estate already retracts them when the grade reverts (`GameBoard.vue:750`), and both are
  written in the imperative — `check row 4` is an instruction, not a memory. An instruction that
  is no longer true is a lie in the margin however faintly it is inked, and demoting it one rung
  does not make it past tense. Grades keep the live slot (line one) and leave with the grade.

This is a smaller ledger than the idea proposed, and it is the only one that does not require
re-writing the verdicts into a past tense the M16 register would then have to re-price.

---

## 5. THE PEER ROW — measured on the wire, for the first time in this loop

R3's census settled this from the source path and said so ("un-measured on the wire here").
`probe/peer.probe.ts` runs the estate's own `?wire=local` harness, two live pages, both engines:

| act | your margin, after |
|---|---|
| a peer JOINS (no value written) | your note stands |
| a peer types a digit ELSEWHERE | **`""` — your note is gone** |
| a peer types on the cell your note names | **`""` — your note is gone** |

Confirmed on chromium and webkit. The defect is real, it is on the wire, and the family kills it
by construction: a peer's digit adds a line, it never subtracts one.

**Naming the author: NO.** The estate already names peers where attribution belongs — T8-W3 M1's
attribution tape on the cell, and the roster. A name in the margin mints a per-player string, a
second attribution grammar, and a line that varies in width with a slug nobody chose. The line
records the act; the board records who.

---

## 6. THE PUSH — one curve, no boil, PRM same-frame

`probe/ledger.probe.ts` NL-3 → `logs/push-*.json`. FLIP order, forced by motion law 6 (every verb
fills `backwards`, never `forwards`): insert first so the layout lands, then play each older line
from the row it is vacating.

| | chromium | webkit |
|---|---|---|
| curve | `--ease-noteWrite` = `cubic-bezier(0.22, 1, 0.36, 1)` | same |
| declared / settled | 250ms / **208.9ms** | 250ms / **225.0ms** |
| travel | 27.19px | 27.20px |
| glyph `filter` | `none` ×3 | `none` ×3 |
| glyph `transform` | `none` ×3 | `none` ×3 |
| worst frame gap | 10.3ms | 19.0ms |
| PRM | duration 0, travel 0, settled 0 | same |

No text boils (law 13), no filter is added (the census stays 9 — this family draws nothing), and
PRM collapses the push to a same-frame step. 250ms is two beats, not one: the charter's "≤ one
beat" is not met and should not be — the note's own write-in is 250ms and a second curve for the
same ink would be the fourth accident R4 counted.

**The one motion number that convicts the in-flow construction:** the board's 13.59px displacement
happens in the insert's own layout step, before any animation frame, PRM or not. It is a jump, not
a motion, and no curve can cover it. That is what the out-of-flow host exists to remove.

---

## 7. THE CAPTION LAW, and the strip's other tenants

`GameBoard.receipt.test.ts` read whole. Its production row (`:107-118`) requires an ordinary deal
to leave the strip `""` and never reach the wipe receipt; `BoardHost.freshBoardCopy` returns `""`
on every ordinary deal since T8-W6 M16 deleted the caption, and the test guards the defect "in
either direction".

The family's distance from a caption, stated: the caption was ONE line describing the BOARD'S
IDENTITY, printed unconditionally on arrival. The ledger prints nothing until the player acts and
never describes the board's identity — a deal must add no line, which keeps the receipt row green
by construction. The distance is one rule wide, and the rule has to be written down or the next
lane re-mints the caption as "line two".

Three collisions the synthesizer inherits:

1. **The error card shares the strip** (`GameBoard.vue:1129-1142`, and the strip is in flow below
   1024 precisely so `SolverErrorNote`'s real height pushes the controls down). The ledger's older
   lines must hang in their own out-of-flow host; the live note and the error card keep the flow
   berth. Both want the same 25.60px of air, and an error card on a two-note ledger has not been
   measured.
2. **One live region.** `MarginNote`'s paragraph is `aria-live="polite" aria-atomic="true"`. The
   older lines must sit OUTSIDE it (aria-hidden ink), or every push re-announces the whole column.
   W3's live-region idiom is the law here.
3. **The celebration takes the strip away.** On the gold path `MarginNote` goes `quiet` (sr-only)
   so the vignette carries the verdict — a ledger would vanish whole at the crest and reappear
   after. Needs a ruling; the cheapest is that the column is quiet with the strip.

And on the phone, while the dock sheet is up, the strip is covered: controls-card y 216 against
the strip's 594 (measured, sheet settled 900ms). The ledger is a thing you read with the sheet
shut.

---

## 8. THE COUNT — there is no third line, so there is no count

The charter's open question ("a count? nothing?") is answered by two independent measurements:
the third rung is 3.51:1 light / 4.37:1 dark (sub-AA for text) and a third line covers the ribbon
by 16.00px on every phone rig. A count would be a third line drawn at the forbidden rung in the
forbidden 16px. **Nothing.** The third note displaces the oldest and leaves no trace, which is
what a margin does.

Priced anyway, because the family had to ask: `and 4 more` is 66.17px wide, clears `check-copy-
register` (plain English, no dash, no jargon — the gate is GREEN at HEAD: 0 dashes, 2 admitted
entries) and needs **zero new codepoints** — the painted-advance probe (`probe/font.probe.ts`,
both engines) reads the hand's cut as holding every letter and digit it needs and lacking only
`j`, `x`, `,` and the curly apostrophe. `check-font-coverage` is GREEN at HEAD (2 faces, Patrick
Hand 46 codepoints / 4312 B) and the margin's strings are the ledgered population it does not
claim, so no woff2 is re-cut either way.

---

## 9. Instruments

| instrument | status | reading |
|---|---|---|
| `r0/r3-marks/probe/marks.probe.ts` **R3-d**, re-run byte-identical (md5 `62b2a326…`) | **GREEN at HEAD** | 9 non-mutating acts leave the note standing at opacity 1; 30s idle does not age it; a digit retracts it. `logs/rerun-R3d-hintnote-chromium.json` |
| `r0/r3-marks/probe/marks2.probe.ts` **R3-g**, re-run byte-identical (md5 `5b848cbc…`) | **GREEN at HEAD** | all five board acts retract or replace: second H, deal, clear→"the board is clear", fill forced, solve→"solved it!". `logs/rerun-R3g-hintnote2-chromium.json` |
| `probe/ledger-law.probe.ts` **L1 accumulation** (new) | **born-RED** | `the displaced note must still be readable` — expected `"only 4 fits here"`, received `[]` |
| `probe/ledger-law.probe.ts` **L2 the peer row** (new) | **born-RED** | `a peer's digit may not remove your line` — expected `"only 5 fits here"`, received `[]` |
| `probe/ledger-law.probe.ts` **L3 the board** (new) | **born-RED, and it convicts the family's own first draft** | `the board moved 13.59px when the column took a second line` |
| `scripts/check-copy-register.mjs` | GREEN | 0 em/en dashes, 0 unadmitted jargon |
| `scripts/check-font-coverage.mjs` | GREEN | 2 subset faces, each covered as authored and as transformed |
| painted-byte contrast, 3 rungs × 2 themes × 2 rigs × 2 engines | see §3 | composited and painted agree to ±0.04 |

L3 stays RED under the in-flow construction and goes GREEN under the out-of-flow one — which is
the whole of this lane's design finding, expressed as a gate rather than an opinion.

## 10. Frames

- `frames/390-stack-three.png` (41 KB, dpr2 crop, light) — the three-line column against the
  board's foot, the tongue's berth at the right, and the ribbon's undo/redo/hint/peek row under
  it. The third line's pallor is the 3.51:1 rung, visible.
- `frames/1280-stack-two.png` (5.9 KB, light) — the desk's two-line column, full ink over quiet,
  shot in document coordinates because the second line is already past the fold.

## 11. Risks

1. **4.80px is the entire safety margin at 390, and W7 §10 is re-cutting the type scale.** A
   single px of extra line box on `--type-body` at 390 (or any rise in the strip's gap) puts the
   two-note column on top of a 55.98px control row. This family must be re-measured after the type
   roles land, not before.
2. **The desk's 18.06px of page scroll is unresolved.** At 1280×800 a second line pushes the
   document past the fold on a page whose standing law is that the board is whole in the first
   viewport. Either the desk column hangs upward into the board's right margin, or the desk keeps
   one line and the phone keeps two — which is the split grammar B6 fired against.
3. **The error card and the ledger want the same air.** Unmeasured in combination.
4. **A quiet whisper is now a standing column.** Two lines of standing text under a drawn board is
   the closest this product has come to the caption M16 deleted. The ruling in §4 is what keeps it
   a record of the player's own acts rather than a log of the machine's.
5. **The celebration's `quiet` path swallows the column whole.** Ruled cheaply above, but ruled by
   nobody yet.

## 12. Recommendation

**DEVELOP — at depth two, out of flow, records only.**

The idea's engine survives every measurement that matters: displacement ages a note with no clock
to tune, the peer-wipe defect (now confirmed live on the wire, both engines) dies by construction,
the push is one existing curve with no boil and a same-frame PRM arm, the strings all fit the
phone's line, and nothing new is minted — not a rung, not a filter, not a codepoint. What does not
survive is the idea's own shape: a column in flow moves the board 13.59px per line at 390, which is
the kill the charter named, and the cure is not a smaller type but a different berth — the live
note keeps the strip's one reserved line, the older notes hang out of flow in the 25.60px the phone
already has, and there are exactly two of them because the third rung is sub-AA in both themes and
the third line covers a 44px control row by 16px. The count dies with the third line. The verdicts
stay out of the column, because a ledger of things that happened cannot hold a claim the next
keystroke falsifies. What the next pass owes: the desk's 18.06px of page scroll, the error card
sharing the strip, and a re-measure the day W7 §10's type scale lands, because this family lives on
4.80px.
