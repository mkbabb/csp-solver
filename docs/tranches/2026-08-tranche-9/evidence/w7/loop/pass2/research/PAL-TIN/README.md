# PAL-TIN · pass-2 RESEARCH — the tin, re-measured

Family **PAL-TIN (the tin)** · §11c the per-player colour system · §3's peer exception · §12.
Lane port 4245 (killed). Worktree read, never edited. Read-only on every product file.
Every number below is re-derived in this lane's own probes (`probe/`, readings in `out/`);
nothing is quoted from pass 1 without saying so.

Verdict for the synthesizer in one line: **the idea survives, the gate does not, and the
BANDS are the lever nobody pulled.** The five hues are within 0.003–0.012 ΔE of the best
placement this paper allows at the lightness pass 1 chose; move the two bands and the same
five hues clear ΔE 0.09–0.10 — twice today's floor — with AA rising in light.

---

## 1 · Row 1 · `adoptInk` — the defect is WORSE than the critique found, both engines

Driven on the real surface, chromium **and** webkit, byte-identical
(`out/r1-three-page-{chromium,webkit}.json`). Two browser CONTEXTS (one context shares
`session-identity-v1`, so a second page inherits the first's released peer id and believes
it IS the author — the rig then measures nothing; that is a trap for the prototype lane).

Rig: page A opens a room and its `st` is captured; A's context closes; page B joins by link
in a fresh context; a fake `mm-relay` relays A's board naming B index 7; then the TRUE
author's id sends a newer board naming B index 3.

| step | B's own swatch | B's ticks | roster |
|---|---|---|---|
| joined | `rgb(178,79,0)` amber (index 0) | 0 | 2 rows |
| after the NON-author relays index 7 | `rgb(178,79,0)` — **unchanged** | 0 | 2 rows |
| after the TRUE AUTHOR sends index 3 | `rgb(178,79,0)` — **unchanged** | 0 | **3 rows, TWO AMBERS** |

`refusedTheAuthor: true`, `duplicateInks: 1`, identical in both engines.

**Why, exactly.** B answered the fake `hi` with its own snapshot (`holdsTheBoard`,
`useSession.ts:685`) while holding a board it had dealt itself, so `ledger.epoch[1] ===
wire.selfId` was TRUE and the pass-1 rider's publish-side arm marked **every id in
`inkIndex` agreed, including B's own index 0** (prototype diff, `sendState`). B then refused
both the relay's `k` and the author's. B's captured traffic proves it:
`["<self>:hi", "<self>:st:e1:ea<self>"]` — a JOINER is its own epoch's author within a second
of arriving.

So the pass-1 critique's cure (`from === d.ea` on the adopt side) is **necessary and not
sufficient**: the publish-side condition is what fires here, and it fires on a page that has
joined somebody else's table. The end state is the one thing a five-stick tin exists to
prevent — two people in one pencil with no tick between them, on the screen of the person
who arrived last.

**The ONE rule for `useSession`, shared with PAL-WALK** (PAL-WALK's charter row 8 asks for
the same seam; their §f found the publish half from the other side):

> An index is AGREED when, and only when, it arrives in an `st` whose SENDER IS THE EPOCH'S
> AUTHOR (`from === d.ea`). A page's own publish agrees nothing — publishing `k` is a
> proposal, and it becomes agreement on the pages that adopt it, where `from === ea` holds
> by construction. An agreed index is never overwritten by a non-author's frame; an
> un-agreed one always yields.

Landing shape (HEAD line numbers, main tree):
- `adoptInk` (`useSession.ts:547-568`) takes the frame's provenance:
  `adoptInk(k: Record<string, number>, authoritative: boolean)`.
- Its one call site (`useSession.ts:763`, the `st` arm) already holds both halves:
  `adoptInk(d.k ?? {}, from === (d.ea as string))`.
- `sendState` (`:689-716`) keeps publishing `k: {...inkIndex}` and marks **nothing** agreed.
- `teardown` (`:934` in the prototype's numbering) clears the set, as it already does.

Convergence argument (no probe needed, but state it): every page that is not the author
adopts-and-agrees the author's `k`; the author never adopts from anyone, so its own index
stays provisional and yields the moment a newer epoch by another author arrives, which is
exactly `newer()`'s tie-break. Two simultaneous dealers converge on `[lamport, author]`.

**The unit that must be born-RED** (`useSession.test.ts`, the existing `bootPage`/`p.hear`
harness — the landed adoption unit hides the hole because its `st` is sent by the same id it
names as `ea`): boot a page, have it publish once as its own epoch's author, then hear an
`st` from a NON-author carrying `k[self] = 7`, then an `st` from the author carrying
`k[self] = 3`. Green is `3`. At the pass-1 rider it is `0`.

---

## 2 · Row 2 · gate 1 · the metric is wrong AND the set is wrong

### 2.1 The "29 reserved inks" are 29 HEX DECLARATIONS across both themes

`check-peer-tin.mjs` reads `index.css` with one flat regex over the whole file
(`pass1/research/PAL-TIN/probe/instruments-family-law-tin.mjs:46-48`). Measured here
(`probe/tin2.mjs`, and the reproduction in the same probe):

- 29 hex literals, **17 distinct token names**, both blocks mixed into one list.
- `--color-teacher-red` and `--color-gold-star` are `var()` ALIASES (`index.css:212`, `:215`)
  and are therefore **absent from the gate's set entirely** — though R5's constraint 3 names
  both as required members.
- In dark, four more are aliases (`green-ink`, `orange-ink`, `red-ink`, `gold-ink` →
  `var(--color-crayon-*)`, `index.css:386-391`) and three inherit light
  (`focus-sketch`, `teacher-red`, `gold-star`): the dark arm is measured against **12** hex
  literals, the light arm against 17.
- **The gate compares light sticks against dark hexes and back.** That is where its headline
  number comes from.

**The spec's "≥13.5°" and the critique's "13.34°" are both artefacts of that mixing.**
Reproduced exactly: the flat list's minimum is **13.34° — peer-4 DARK `#a4b1ff` against
`--color-user-ink` LIGHT `#2563eb`**, two inks that are never on a screen together. Measured
WITHIN an arm, after resolving aliases (19 tokens per arm):

| arm | nearest anchor | gap |
|---|---|---|
| light | peer-4 `#5a61ce` vs `--color-user-ink` `#2563eb` | **13.75°** |
| dark | peer-5 `#f48ce6` vs `--color-solver-ink-1` `#f9a8d4` | **13.87°** |

Both numbers belong in the spec at citation; neither is 13.5 and neither is 13.34.

### 2.2 The set that matters is the CELL set, and it is nine

Grepped, with citations (`out/board-set.md` states the partition):

| ink | where it paints beside a player's digit |
|---|---|
| `--color-user-ink` | the digit itself — `HandwrittenGlyph.vue:85`, rebound per cell at `BoardHost.vue:73` |
| `--color-solver-ink-1…5` | **a solved digit is stroked with `url(#solver-ink)`** — `HandwrittenGlyph.vue:83`, the gradient at `SvgFilters.vue:180-184`. Board content by ruling (F8 §3.2). |
| `--color-teacher-red` (→`crayon-rose`) | the conflict ring and the hint laminate — `gameCell.css:144,150,167,170,274,289` |
| `--color-focus-sketch` / `--color-crayon-blue` | your own focus ring — `gameCell.css:246-248` |
| `--color-progress-ink` | the fill trace on the board frame — `HandDrawnGrid.vue:471` (same eye, not the same cell) |

Everything else in the 19 (`gold-ink`, `green-ink`, `orange-ink`, `red-ink`, `gold-star`, the
other crayons) paints in chrome — `MarginNote.vue:141,144`, `CompletionVignette.vue:108`,
`SolverErrorNote.vue:82`, `GameControlPanel.vue:2050`, `index.css:465-471` — never on the
grid. A law that counts them is a law about a picture nobody sees.

Note the sharper version of the same fact: **a solved digit is not one ink, it is a gradient
sweeping all five solver inks across its own box.** "Tell a player's pencil from the
machine's" is a demand against a five-hue sweep, not against one hex.

### 2.3 ΔE ≥ 0.10 against the reserved set is UNREACHABLE — measured, not argued

The pass-1 gate holds its own five members to ΔE ≥ 0.10 and then asserts degrees against the
anchors; the critique asks for one metric. The reason the family could not pick one is that
the floor it wants does not exist on this paper. Measured (`probe/ceiling.mjs`,
`probe/board-set.mjs`, `probe/pack.mjs`): at the tin's own light band, sweeping the whole
circle at **the sRGB gamut's own maximum chroma**,

- **678 of 720 hues** cannot reach ΔE 0.10 from the nearest of the 19 reserved inks;
- the single best berth on the whole light circle is **ΔE 0.140 at h 325.5**;
- against the CELL set of 9 it is the same 0.140, and **659/720** still fall under 0.10;
- **the best FIVE berths ≥40° apart hold min ΔE 0.070** (light), and with AA ≥ 4.5 enforced
  in both arms and the arms hue-locked, the best five-stick tin this paper holds is
  **ΔE 0.058** at ≥40° spread, **0.050** at ≥55°.

The pass-1 tin holds **0.046** (dark violet `#a4b1ff` vs `--color-solver-ink-2` `#c4b5fd`).
So the tin is **0.004–0.012 off the ceiling**, not "below its own floor by half". The
critique's charge is right about the metric and wrong about the remedy: no re-placement of
five hues at these bands buys 0.10.

### 2.4 The remedy the measurement DOES give: move the bands

Chroma is spent (three light sticks and three dark ones sit exactly ON the sRGB ceiling at
their (L,h) — `out/tin2.md`; the light teal's 0.093 is not a slip, it is `chromaAt(0.545,
200.6) = 0.093`, the gamut's narrowest point on the light circle). Hue is spent (the berths
are what the arcs leave). **Lightness was never spent.** Holding the five hues exactly as
pass 1 cut them (`probe/band.mjs`, `probe/band-light.mjs`):

| arm | band | worst ΔE to a CELL ink | worst AA | min pairwise ΔE |
|---|---|---|---|---|
| dark | **0.780** (pass 1) | 0.046 | 8.54 | 0.151 |
| dark | 0.700 | 0.059 | 6.00 | 0.172 |
| dark | 0.680 | 0.072 | 5.53 | 0.180 |
| dark | **0.650** | **0.100** | 4.95 | 0.172 |
| light | **0.545** (pass 1) | 0.068 | 4.55 | 0.145 |
| light | 0.500 | 0.062 | 5.55 | 0.134 |
| light | 0.470 | 0.071 | 6.29 | 0.125 |
| light | **0.440** | **0.090** | 7.15 | 0.116 |
| light | 0.400 | 0.126 | 8.60 | 0.106 |

**A tin at light L 0.44 / dark L 0.65 clears ΔE ≥ 0.090 in both arms against the cell set —
double today's floor — without moving one hue, and light AA rises 4.55 → 7.15.**

The mechanism, said plainly, is the dark arm's whole disease: **the solver's dark rainbow is
five pale pastels at L 0.81–0.92** (`#f9a8d4` .823, `#c4b5fd` .811, `#93c5fd` .809, `#6ee7b7`
.845, `#fde68a` .924) **and pass 1 put the players in the same band at 0.780.** Ten inks, one
lightness, one grid; the sRGB chroma ceiling in that band runs 0.111–0.265, so the arcs
between two pastels are short in ΔE whatever the degrees say. Hue cannot separate them.
Lightness can, and the incumbent `--color-user-ink` dark `#60a5fa` is already at **L 0.714** —
so a peer band at 0.65–0.70 is *closer to the estate's own dark ink* than 0.80 ever was.

This reverses the pass-1 §1.1 rationale ("the dark arms sit in the PEER band L≈0.80, not the
crayon step"), which was reasoned by analogy and never measured against the rainbow. Say so.

### 2.5 So: what gate 1 should assert

Two metrics, and the file's header defends them because they answer two questions:

1. **Anchor identity, in degrees, within the arm, over the RESOLVED 19** — "this stick is not
   a named ink of the house wearing a different name". Floor 12°, measured 13.75 / 13.87.
2. **Readability, in OKLab ΔE over PAINTED bytes, against the CELL set of 9, within the
   arm** — "a reader can tell a player's hand from the machine's". Floor set by the paper,
   not by aspiration.

For (2), a bare number is gameable by lowering it. Re-derive the CEILING in the same run and
assert the RATIO: the gate prints `min ΔE / best-five-berth ceiling` and fails under, say,
0.75. The ceiling comes out of `index.css` every run, so a reserved ink that moves re-scores
the tin automatically and the gate cannot be re-worded to pass. Today's tin scores
0.046 / 0.058 = **0.79**; the band cure scores 0.090 / 0.058 → capped at 1.0 (the cure moves
the ceiling too; re-derive both in the same pass).

**Negative controls (charter row 3), one per gate, all inside `--self-test`:**
- gate 1a: inject a sixth stick at `--color-user-ink`'s hue ±6° → RED with a named collision.
- gate 1b: inject a stick at ΔE 0.02 from `--color-solver-ink-2` → RED.
- gate 2: pass 1 has it (a sixth stick 0.002 off amber) — keep.
- gate 3: rename one stick's value to a reserved ink's literal hex → RED ("a stick IS an
  anchor"). Today gate 3 cannot be shown failing at all.

---

## 3 · Row 13 · the ring, off painted pixels — and the ground pass 1 used is wrong

`out/r2-ring-*.json`, dpr 3, both engines, both themes, theme driven through the product's
own key (`localStorage["sudoku-color-scheme"]`, `useTheme.ts:9` — `colorScheme` emulation
alone leaves `<html>` in light; the first cut of this probe read a light ground under
`colorScheme:"dark"` and I banked the trap rather than the number).

| arm | ring body, painted | pass 1's composited claim |
|---|---|---|
| light, peer-2 green at 0.80 | **3.084 median / 3.133 extreme**, both engines | 3.200 |
| dark | **6.250 median**, both engines | — |

The bytes themselves agree with compositing arithmetic exactly: ink `rgb(95,125,0)` at 0.80
over `rgb(247,248,242)` = `rgb(125,150,48)`, which is the measured extreme pixel. The 0.07
gap is not a rounding difference, it is **the wrong ground**: pass 1 composited over
`--color-card` `#fdfdfc`, and a peer-cursor cell's actual interior is that paper under the
ring's OWN 4% fill (`gameCell.css:230-231`, `fill-opacity: 0.04`) = `rgb(247,248,242)`
(0.04·95 + 0.96·253 = 247, exact in all three channels). 1.4.11 asks about the adjacent
colour, and the adjacent colour on the inside of that ring is the ring's own wash.

Consequence for the spec: the margin over 3:1 in light is **0.084, not 0.20** — 2.7%. Any
further softening of the ring, and any stick lighter than peer-2 green, needs re-measuring
against this ground, not against the token. (Also measured: the anti-aliased edge pixels
bottom out at 1.07, which is expected and is not what 1.4.11 reads.)

PAL-WALK raised the ring to 0.80 too; the number is theirs and mine to the byte — **keep one
number (0.80) and one owner.** It is palette-independent and should land with whoever wins.

---

## 4 · Row 6 · the upright under a 1, as a NUMBER

`out/r3-digit-gap-chromium.json`, 9×9, real key presses. `getBBox()` of every glyph path,
mapped into cell units (the glyph svg measures 64.99% of the cell — `HandwrittenGlyph.vue:320`
confirmed on the surface). The tick's uprights run y 85→97 centred at x 50
(`PlayerTick.vue`, `TOP=85 FOOT=97 MID=50 GAP=7`).

| drawn | ink bottom (% of cell) | ink left→right | ink width | gap to the tick's top | gap px @61.77px cell |
|---|---|---|---|---|---|
| **1** | 73.21 | 41.88 → 51.62 | **9.75%** | 11.79% | 7.28 |
| **4** | 73.21 | 28.88 → 61.37 | 32.50% | 11.79% | 7.28 |
| **7** | 72.05 | 33.75 → 67.87 | 34.12% | 12.95% | 8.00 |
| 9 | 70.63 | 36.36 → 64.91 | 28.55% | 14.37% | 8.88 |
| 2 | 70.89 | 35.38 → 67.87 | 32.50% | 14.11% | 8.72 |

**The 1 is the case, and now it has a mechanism.** A drawn `1` is 9.75% of the cell wide with
its centre at x 46.75; a single upright is 3% wide at x 50. Two near-vertical pencil strokes
of comparable width, 3.25% of a cell apart on the x axis, 11.79% apart on the y — that is a
stem and its continuation, which is exactly what the pass-1 frame shows. The 4 and the 7 are
28–34% wide, so a 3% upright under them reads as a separate object; the 1 is the only numeral
whose ink is narrower than the mark beneath it.

Two cures a synthesizer can spec, both inside the tally's own grammar:
- **the tally is not centred.** Put the gate-five block in a CORNER of the lower band
  (x 12…26 rather than x 43…57): an annotation in the margin of the cell, never under a stem.
  Costs one constant in `PlayerTick.vue`; the roster crop (`viewBox "35 83 30 16"`) re-aims
  with it.
- **the gap widens under a narrow glyph.** Rejected here: it needs the glyph's bbox at paint
  time, which is a new coupling between two components that share nothing today.

The owner's question ("does the sixth player's tick read as a system or a bug") is U-10's
either way; this row is about whether the mark is legible AT ALL under a 1, and the answer is
a number the ballot can be put next to.

---

## 5 · Rows 5, 7, 8, 9, 11 — the small closures, each with its file:line

**Row 5 · the min-1px stroke.** `stroke-width: 3` in `PlayerTick`'s 100-unit box scales with
the cell: at 390 wide, 16×16, the cell is 22.63px and the mark paints 0.68px CSS. There is no
`--cell` custom property anywhere in `web/frontend/src` and `vector-effect` appears once, in a
comment (`HandDrawnOutline.vue:14`). Three ways, priced:
- **(a) the sanctioned fallback** — at 16×16 on a phone the roster is the legend and the board
  tick is decoration. Free. Needs the spec to SAY it, in the §1.3 geometry line, not in a
  footnote.
- **(b) `boardSize`, which the component already has.** `DigitCell.vue:31` declares
  `boardSize: number` and passes it down (`:400`). The tick's stroke can be a function of it
  (`3` at 9×9, ~5.5 at 16×16 — i.e. hold the painted width, not the user-unit width). Zero new
  mechanism, one computed, no CSS.
- **(c) `vector-effect: non-scaling-stroke` + `stroke-width: max(1px, 3cqw)`** with
  `container-type: inline-size` on `.game-cell`. Correct and general, and it prices at
  `contain: layout style inline-size` on 81–256 cells — a containment change on the board's hot
  path, which is a π question for the census lane, not a colour family's to spend.
Recommend (b) in the spec and name (c) as the general answer the estate can take later.

**Row 7 · `swatch · slug · tick(s) · you`.** The cause is one declaration:
`.player-name { flex: 1 1 auto }` — `GameControlPanel.vue:1769`. The name GROWS, so the tick
is pushed to the row's right edge. `flex: 0 1 auto` drops only the grow; `min-width: 0`,
`overflow: hidden` and `text-overflow: ellipsis` (`:1770-1773`) still truncate a long slug,
and `.player-swatch` is already `flex: 0 0 auto` (`:1683`). **No measured loss.** The fork is
design, not cost: a right-aligned column of tallies is easier to COUNT; a mark against the
word is what makes the roster row a LEGEND for the mark under the digit. The legend claim is
the family's whole answer to M16, so `flex: 0 1 auto` is the reading that keeps the idea — but
it is a ballot, and the third option (declare the column deliberately and re-cut §1.4's
dot-list) is honest too.

**Row 8 · do your own digits carry your own ticks?** They do, and the code says so by
omission: the prototype's `authorLap` has no self clause while `authorInk` gained
`&& roomId.value === null`. Rule it FOR, on F1's own words — R5's F1 is "a player's colour is
a PAGE's colour, not a player's", and R5's constraint 5 is "solo stays byte-identical". The
tick is the same fact as the ink, drawn; if your row shows amber + one tick and your digits
show amber + nothing, **the legend is false on your own board** — which is F1 again, wearing
the tick. Solo remains the negative control: `roomId === null` binds nothing and mounts
nothing. Book it under F1 in the spec, with the solo assertion as its gate.

**Row 9 · lap > 5.** `PlayerTick.vue` holds `n = Math.min(5, …)` and `lapFor` is
`floor(index/5)`, so the DRAWN states are {0,1,2,3,4,gate-of-five} = 6 and the tin's
board-distinguishable capacity is **5 inks × 6 states = 30 players**. Index 30 (the 31st
player) draws the same stick and the same gate of five as index 25 — the first true board
collision. The roster still separates them by slug. State the 30 in the spec; "beyond reason"
is a number now, and it is not 25 and not uncapped. (`IDENTITY_CAP = 8`,
`playerIdentity.ts`, is the identity STORE's prune bound — rooms remembered per browser —
and has nothing to do with room size. Say so once so nobody reads it as a cap.)

**Row 11 · the tick's seed.** `:seed="p.id.length"` (prototype diff) — peer ids are all the
same length, so every row wobbles alike. The estate already has the decorrelator:
`slugFor` computes `parseInt(hashBlob(peerId).slice(0, 8), 16)` (`playerIdentity.ts`, in
`slugFor`). Hoist that expression to an exported `seedFor(peerId)` and let both consume it —
one constant, two consumers, no new mechanism, and the roster's wobble stops rhyming.

---

## 6 · Row 10 · `HandDrawnGrid.vue:601` re-derived for the tin

The comment justifies the offset join-ring retrace with "`inkFor` walks the golden angle and
index 2 lands at 275deg, a hand's breadth from `--color-progress-ink`". Under the tin index 2
is the TEAL at h 200.4 and the sentence is false. **The hazard is not:** the join ring strokes
`var(--color-user-ink)` (`HandDrawnGrid.vue:504`) on the same rect as the progress trace's
`var(--color-progress-ink)` (`:471`), and the tin's VIOLET (index 3) is the stick that meets
it. Re-derived (`out/couplings.md`):

| arm | violet | `--color-progress-ink` | gap | ΔE |
|---|---|---|---|---|
| light | `#5a61ce` h 276.6 | `#8b5cf6` h 292.7 | 16.1° | **0.097** |
| dark | `#a4b1ff` h 276.2 | `#7c3aed` h 293.0 | 16.8° | **0.278** |

So the fusing hazard is a LIGHT-arm hazard (ΔE 0.097, one third of the dark reading), the
retrace offset stays load-bearing, and the comment must name the violet and index 3. One
sentence, same commit as the tokens — a ruling that lands without its enforcing text is the
lesson T2–T4 already booked.

---

## 7 · Couplings — ACC-FIVE helps, ACC-SIX bites, and both land on the violet

`out/couplings.md`. The violet is the only contested berth in every direction.

| world | what moves | the tin's violet, nearest reserved |
|---|---|---|
| HEAD | — | light 13.7° / ΔE 0.067 (`user-ink`); dark 17.4° / **ΔE 0.046** (`solver-ink-2`) |
| **ACC-FIVE** | `--color-user-ink` → `--color-blue-ink` `#026fc4` / `#47a7ff` (h 262.9→251.2) | light 25.4° / **ΔE 0.072**; dark 26.8° / ΔE 0.102 — **the tin gets better** |
| **ACC-SIX** | the answer's violet NAMED at h 292.7–293.6 with three rungs `#c4b5fd` / `#8b5cf6` / `#7c3aed`; blue → `#2f76bd` (h 251.4) | light 25.2° / ΔE 0.074 vs the blue, but the dark rung `#c4b5fd` IS the 0.046 collision — **ACC-SIX formalises it as an anchor** |

Read: under either accent family the blue retreats to ~251°, so the violet's window is the arc
251→293. Its max-min point is **h 272** (ΔE 0.052 in the worse arm) — the tin's 276.6 is 4.6°
off the optimum and worth 0.006. That is inside the noise; **the violet does not need to move,
the BAND does** (§2.4: at dark L 0.65 the same violet reads ΔE 0.100 from the same `#c4b5fd`).

State the reserved SET you clear against BOTH: against ACC-FIVE it is 19 tokens with
`user-ink` at 251.2 and `progress-ink` retired to gold; against ACC-SIX it is 20, with the
answer's violet as a named anchor at 293 in three rungs. The tin clears both — at the moved
bands, by ΔE 0.09+; at pass 1's bands, by 0.046 against ACC-SIX's own pale rung.

---

## 8 · The grafts, taken and answered with numbers

| graft | taken as |
|---|---|
| PAL-WALK `chromaAt` (per-hue sRGB ceiling) | `probe/color.mjs`. Result: **six of the ten arms sit exactly ON the ceiling** — light amber/green/teal, dark amber/teal/violet. The light teal's 0.093 IS `chromaAt(0.545, 200.6)`; it is the gamut, not a quiet choice. This is the authoring check the token block must carry. |
| PAL-WALK 8-bit margin ≤0.96° | **0.000° on every stick.** A table is authored IN bytes, so the round trip is the identity; the margin is a FORMULA's tax. The honest gate row is "declared == painted, 10/10" (pass 1 measured it) plus the ceiling check above. Say why the graft is zero rather than dropping it. |
| PAL-WALK OKLab ΔE over painted bytes as the currency | §2 throughout. Adopted. |
| PAL-WALK ring 0.80 | Kept; one number, one owner (§3). Painted 3.084/6.250, not 3.20. |
| PLR-COUNT `pixels.mjs` + 12.7° at N=3 | The 12.7° comes from self at `#2563eb` (h 263) beside walk index 2 (h 275). **Under the tin, self IS in the tin** (F1's cure), so the room at N=3 is peer-1/2/3: min painted separation **75.9° / ΔE 0.145 light, 75.6° / ΔE 0.185 dark**; at N=5 **55.6° / ΔE 0.145**. The walk's own painted figures for comparison: N=3 84.0°/0.148, N=5 51.9°/**0.088**, N=6 31.8°/0.060, N=16 12.2°/**0.023**. |
| PLR-SELF index-0 collision | Walk i=0 (h 0.0, light) is **0.55° / ΔE 0.0969 from `--color-solver-ink-1`**; the tin has no index 0 hue — amber sits at 48.4°, 15.8° / ΔE 0.046 from `orange-ink` (chrome, not the cell) and 0.111 from the nearest CELL ink. |
| ACC-GRAPHITE index-0 vs teacher-red | Walk i=0 light is **5.5° / ΔE 0.102 from `--color-teacher-red`** at i=8 and 0.55° from solver-ink-1 at i=0; ACC-GRAPHITE's 14.2°/12.2° is the teacher-red reading. The tin never puts a player at h≈0: the pink is at 332.2, **26.8° / ΔE 0.088 from `solver-ink-1`**. The tin ANSWERS this demand by construction. |
| ACC-FIVE index-19 vs the gauge (2.7°) | Walk i=19 lands at h 92.5: **8.93° from `--color-gold-star` light, 2.89° dark** (ΔE 0.046). The tin has no 92.5 stick — the green is at 124.6. Answered. |
| ACC-FIVE's 40-index sweep | Run here, painted, both arms (`out/walk-sweep-*.json`): light **21 of 40** indices land within 12° of a reserved ink and **32 of 40** within ΔE 0.10; dark **20 of 40** within 12° and **40 of 40** within ΔE 0.10. That is the walk's true bill, and it is the tin's whole case. |
| ACC-FIVE's ink-tier algorithm | Applied as §2.4: hold the hue, take the maximum chroma sRGB allows there, walk LIGHTNESS until the floor is cleared, and solve for the BAND when the element sits between two grounds. Exactly what §2.4 does — and it is the algorithm that finds the band cure, so cite ACC-FIVE for it. |

---

## 9 · Two instruments, proposed as diffs, r0 rows reported MOVED

Nothing under `loop/r0/` or `loop/pass1/` was written. Both proposals are in
`instruments/`.

1. **`r6/hue-census.mjs` tail** (charter row 12) — its last block prints "player walk
   (playerIdentity.inkFor, hue = i × 137.5)" from a hardcoded literal; the walk is dead under
   the tin and the census would print a palette that does not exist. The re-cut reads the
   PLAYER TOKENS out of `index.css` like every other row. **r0 row: MOVED.** Note the
   instrument writes nothing (stdout only), so no `OUT` needed re-pointing — say so, because
   the chair's rule assumes otherwise for r0 probes. Banked runnable at
   `instruments/hue-census.mjs`: against HEAD the 30 census rows are byte-identical to r0's
   run and the tail now reads `step 137.5 deg` out of `playerIdentity.ts`; against the pass-1
   prototype's stylesheet it prints the five sticks with L/C/h, reproducing this lane's own
   figures independently.
2. **`scripts/check-peer-tin.mjs`** — the whole of §2: resolve `var()` aliases, split the
   arms, two metrics with two sets, the ceiling re-derived in the same run, four negative
   controls. Not an r0 instrument (pass 1 minted it), so it is a plain re-cut, born-RED at
   HEAD as before.

Also standing, not this family's to move: R6 law 22 (T6 mark 13, "a formula, not a palette;
no cap") is the ballot, law 23 (a state token aliases a crayon, zero new hexes) is knowingly
excepted, law 21 ("the three ink families never compete") is TRUE in degrees and FALSE in ΔE
at both HEAD and the pass-1 tin — §2 is the evidence, and the law needs the metric named.

---

## 10 · Three sketches

**A · where the five sticks sit, and what is actually near them (light band).**

```
  0°        60°       120°      180°      240°      300°      360°
  |----------|---------|---------|---------|---------|---------|
  ✱ solver-1 ✱gold-ink                      ✱user-ink  ✱sol-2/progress
  ✱teacher-red     ✱green-ink   ✱solver-4      ✱focus   ✱crayon-blue
         ▲           ▲            ▲              ▲            ▲
      amber 48.4  green 124.6  teal 200.6   violet 276.6  pink 332.2
      ΔE .111      ΔE .101      ΔE .089      ΔE .067      ΔE .133
                                  ^gamut floor    ^the contested berth
                                   C=0.093         blue at 263 → 251 under ACC-*
                                                   answer at 293 (ACC-SIX names it)
```

**B · the band, which is the lever (dark arm, the same five hues).**

```
 L 0.92  ·············· solver-ink-5 #fde68a
 L 0.85  ············ solver-ink-4
 L 0.81  ······· solver-1 · solver-2 · solver-3      ← the machine's pastels
 L 0.78  ■■■■■ PASS 1's TIN  ────────── worst ΔE 0.046  AA 8.54
 L 0.71  ····· user-ink #60a5fa  (the estate's OWN dark ink)
 L 0.70  ■■■■■                ────────── worst ΔE 0.059  AA 6.00
 L 0.65  ■■■■■ PROPOSED       ────────── worst ΔE 0.100  AA 4.95   ← clears the family's own floor
 L 0.60  ■■■■■                ────────── worst ΔE 0.152  AA 4.08   ✗ under AA
```

**C · the 1, and why the upright reads as its stem (cell units, 9×9).**

```
   x: 0        29        42  47  52        62        72       100
      |---------|---------|---|---|---------|---------|---------|
                          ┌───┴───┐                               y 26  ink top
   the "1"                │  ▌    │  ← 9.75% wide, centre x 46.75
                          │  ▌    │
                          └───┬───┘                               y 73  ink bottom
                             gap 11.79% of the cell (7.28px @61.77)
                              ▌                                   y 85  tick top
   one upright                ▌     ← 3% wide, centre x 50.0
                              ▌                                   y 97  tick foot
      a "4" or a "7" is 32–34% wide here: the upright is inside a wider mark and reads
      as an annotation. Only the 1 is narrower than the thing beneath it.
```

---

## 11 · Risks, named

1. **The band move re-opens every AA number in the spec.** Light AA rises (4.55→7.15) but the
   dark falls (8.54→4.95) — still over 4.5, with 0.45 of margin rather than 4.0. Every dark
   reading in §1.1 must be re-measured on the engine's bytes, not re-derived on paper.
2. **The ring at 0.80 is measured against ONE stick.** My painted reading is peer-2 green on
   light paper (3.084). The worst stick over four grounds needs the same painted treatment,
   against the ring's own 4%-fill ground, before 3.20 is quoted again anywhere.
3. **A ratio gate needs its ceiling pinned.** If the gate divides by a ceiling re-derived each
   run, a reserved ink that moves changes the PASS threshold silently. Print both numbers and
   fail on the ratio AND on an absolute floor, so a drifting ceiling cannot hide a drifting tin.
4. **`from === d.ea` is a wire-law change with two consumers.** PAL-WALK needs the same seam;
   if both land it, one of them lands it twice. The chair should name the owner the way §6.1
   named the focus-ring's.
5. **The tally's corner move (row 6) collides with the mark cell's other tenants.** The lower
   band is also where `.cell-because`'s rim and the invalid ring pass; a corner tally at
   x 12–26 wants one measured frame before it is spec'd.
6. **Capacity 30 is a design claim, not a measurement.** Nothing in the tree exercises index
   ≥25. A unit over `lapFor` × `PlayerTick`'s `Math.min` costs four lines and makes it a fact.
7. **No real device.** Everything here is chromium and webkit on this machine; W8's owner-run
   iOS pass is the only place the 16×16 phone tick becomes evidence.
8. **The three-page rig is BroadcastChannel, not the relay.** The measured divergence is
   product code end to end (`holdsTheBoard` → `sendState` → `adoptInk`), but the relay arm is
   untested for it, exactly as PAL-WALK's charter row 12 says of theirs.

## 12 · Three owner ballots, banked (U-10 — not ruled here)

- **B-TIN-1 (law 22's formula half).** Does a player's colour become a designed palette of
  five with a drawn sharing mark, uncapped by the tick? The measured price of the alternative
  is in §8's sweep: the walk puts 32 of 40 indices within ΔE 0.10 of a reserved ink in light
  and 40 of 40 in dark.
- **B-TIN-2 (the sixth player's tick).** System or bug? Now with §4's number beside it: a
  single upright under a **1** is 3.25% of a cell off the numeral's own stem.
- **B-TIN-3 (the roster's tick position).** A right-aligned tally COLUMN (today's draw) or the
  mark against the word (`flex: 0 1 auto`, one token, no measured cost)? The legend claim —
  the family's whole answer to M16 — rests on a reader connecting the two marks.

---

Evidence: `probe/` (nine node probes + one Playwright spec + the scratch vite/pw configs),
`out/` (24 readings, 124 KB, no frames — every row above is a number). Server on 4245 killed.
