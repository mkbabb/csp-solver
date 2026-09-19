# PASS 2 · NOTE-LEDGER — research: the ledger measured where pass 1 guessed

T9-W7 §7, the hint note's lifecycle. Research lane, read-only on the product: every reading
below comes off the pass-1 prototype build (`.claude/worktrees/wf_e58b4764-0fc-54`, the diff
stands, nothing committed) served by this lane's own vite on `127.0.0.1:4249` with a private
`cacheDir`, chromium + webkit headless, PRM on, light. The server is down. Instruments in
`probe/`, readings in `logs/`, three cited crops in `frames/` (52.7 KB for all three). Nothing
under `loop/r0/` or `loop/pass1/` was written, re-run in place or re-worded.

---

## 0. The verdict in six numbers

| | measured, both engines |
|---|---|
| the TRUE longest record at 360×740 | **216.63px** (`D goes nowhere else in this column`) in a **228px** strip — **11.37px / 4.99% headroom** |
| why it is the longest | **A B D E F G are not in the hand's cut** and paint in the fallback face — proven by advance, both engines |
| the desk berth's sentence break | **7.19–7.20px**, against a **4.00px** word space at 360 and **4.55px** at 1280 — a record boundary 1.58× a word boundary |
| the desk push's travel | **dx −127.50px @1024 / −132.25px @1280, dy 0.00** — lateral, and a function of the displacing sentence's own width |
| 844×390 | the strip's TOP is at y **388.39** against a 390px fold; **8.70px** to the controls card; line two `display:none`; the page already scrolls (409 → 410) |
| the aged line vs the error card | zero px of layout, **14.41px of overlap** — the reason to hide it is collision, not height |

Two of the charter's twelve rows changed shape under measurement (rows 3 and 11), one closed
with a cure nobody had named (row 2), one found a live estate defect the family did not cause
(the ransom note at 16×16), and the pose pass 1 could not reach (row 7's error card) is reached
and banked with a recipe that needs no product change.

---

## 1. Row 1 — THE ORPHAN DEICTIC: the graft cannot be taken as written

**What the graft is.** NOTE-ERASE's `armedHintTurnsOn(pos)` — `h.cell === pos ||
h.becauseCells.includes(pos)` — over `WriteOrigin = "self" | "peer"` at the wire's entry
(`research/NOTE-ERASE/proto/authorship-seam.diff`, unit-proven 6/6). It reads
`hintReasoning.value`.

**Why it does not reach the ledger's records.** `hintReasoning` is NULLED by the model at five
sites (`useGameState.ts:434, :487, :604, :770, :790`) — including the very write the rule is
meant to judge, and including the second H press that spends the hint
(`useGameState.ts:783-786`). The ledger's whole mechanism is that the SENTENCE survives that
null. So by the time a record is ageable, the predicate has nothing to test: `h` is `null` and
`armedHintTurnsOn` answers `false` forever. **The graft is a predicate without a subject.**

**What the family must do to take it.** The ledger's records must carry their own referent. The
model change is small and entirely inside `GameBoard.vue`'s `setMargin`, whose `kind` tag the
family already minted:

```ts
type MarginRecord = { text: string; kind: MarginKind; cell?: number; because?: number[] };
const marginLive = ref<MarginRecord>({ text: "", kind: "empty" });
const marginPrevious = ref<MarginRecord | null>(null);
```

The hint watch already has both fields in hand at the one call site (`GameBoard.vue:735-741` in the worktree:
`hint.cell`, `hint.becauseCells`, `HintResult` at `techniqueEngine.ts:706-719`). Measured
cardinality of `becauseCells`: **1** for a naked single (`techniqueEngine.ts:175`,
`becauseCells: [cell]`) and **the whole house** for a hidden single (`:205`,
`[...house.cells]` — 9 at 9×9, 16 at 16×16); futoshiki's forcing pair is **2** (`:410`).

**Then the ageing rule is one line, and it is the family's own grammar:** a record is STRUCK
(not aged — it is already aged) the moment a value lands on its `cell` or in its `because`,
whoever wrote it. Two consequences worth stating in the spec:

- The rule wants no `WriteOrigin` at all for the LEDGER's half. The ledger does not care whose
  hand falsified the sentence; it cares that the sentence stopped being a record of a live
  board state. `WriteOrigin` remains NOTE-ERASE's for the MODEL's half (the hint's highlight
  and the refusal), where "was it me?" is the question. Take the PREDICATE, not the seam.
- Deixis is not evenly distributed across the vocabulary, and one deictic record can never
  orphan:

| record | referent | can its referent be erased? |
|---|---|---|
| `only X fits here` | `hint.cell` (1 cell) | **yes** — the orphan pose |
| `X goes nowhere else in this <house>` | the house, 9 cells at 9×9 | **yes** — the critique's 9 → 0 reading |
| `the answer is X` | the focused cell (the `reveal` fallback) | **yes**, and it names no house at all |
| `that's a given clue` | the refused cell | **no** — a given is immutable; the refusal cannot orphan by construction |
| `the board is clear` | the whole board | not a cell; falsified by the next digit, but it is a record of an ACT and stays true as one |

So the ageing rule touches exactly the three hint sentences. That is the sharp, small shape.

**The copy arm (U-10), priced at 360 against the 228px strip** (`logs/R12-copy-candidates-*`):

| candidate | ink | headroom | note |
|---|---|---|---|
| `only 4 fits here` (HEAD) | 93.48 | 59.0% | deictic |
| `4 goes nowhere else in this column` (HEAD) | 209.13 | 8.3% | deictic |
| `only 4 fits in row 4 column 7` | 172.92 | 24.2% | not deictic; borrows W3's landed cell name (`useGameCell.ts:141`, `Row {r}, column {c}`) |
| `only 4 fits in row 4, column 7` | 176.55 | 22.6% | **the comma (U+002C) is NOT in the hand's cut** — R6 law 30, a ransom note |
| `4 went nowhere else in that column` | 211.58 | 7.2% | past tense; still deictic ("that column") |
| `the answer was 4` | 100.2 | 56.1% | past tense, no referent — the cheapest copy arm |

The copy arm is cheaper in px and dearer in register: it mints coordinates in a product whose
visible copy has never named a cell. The owner disposes (U-10); the spec states both and says
which it would ship.

---

## 2. Row 2 — THE NON-SIGHTED RECOVERY: `aria-hidden` buys nothing and costs everything

Measured at 390×844, column two deep, both engines (`logs/R6-a11y-*`, `logs/R10-aria-hidden-*`):

```
strip's ARIA tree, as shipped:      - status: only 1 fits here
strip's ARIA tree, aria-hidden off: - status: only 1 fits here
                                    - paragraph: only 7 fits here
```

`aria-hidden="true"` was added to keep the push from re-announcing the whole column. It does not
do that job: **line two is a SIBLING of the live region, not inside it**
(`MarginNote.vue` template — `.margin-note-previous` is outside `<p role="status">`), so the
region's content is unchanged whether line two is hidden or not. The announcement guard is the
DOM position, and it is already correct. What `aria-hidden` actually buys is the removal of the
aged record from browse mode — the exact loss the critique's G5 names.

**The cure is a deletion**, verified on the live element in both engines: drop
`aria-hidden="true"`, keep the node outside the live region, and the aged record becomes
`- paragraph: …` — recoverable by a screen-reader user arrowing the page, announced by nothing.
The estate's landed live-region roll is unchanged: 6 regions in the document, 5 of them
`.sr-only` (`.board-voice` role=status, `.players-status`, `.players-roster` role=log,
`.players-alone`, `.copy-status`), one in the strip. L6 keeps its exact assertion.

Two smaller rows that ride it: `user-select: none` on line two denies a sighted reader the copy
the TALLY is explicitly granted eleven lines above it (`MarginNote.vue:179` at HEAD, "a tally someone
leans in to read is one they may copy"); and `display: none` in landscape removes the record from
every reader in that pose, which is row 6's business.

---

## 3. Row 3 — THE WIDTH ROW: the gate the charter asks for is BORN RED

The record vocabulary is enumerable, and this is the whole of it — derived from the formatters,
not typed: 16 value glyphs (`glyphRegistry.ts:64-70`, 1–9 then A–G) × `only X fits here`, ×
4 house words (`techniqueVoice.ts:33-37` + the `"group"` fallback at `:52`) × `X goes nowhere
else in this <house>`, × `the answer is X`, plus `that's a given clue`, `the board is clear` and
`this shared link couldn't be read` (`BoardHost.vue:179-185`). **99 strings.**

Swept against the strip with a Range over the text node, both engines
(`logs/R1-vocabulary-*.json`):

| rig | strip | longest record | headroom | pair + 7.2px gap | trailing berth fits? |
|---|---|---|---|---|---|
| 360×740 | 228 | **216.63** / 216.61 | **11.37px · 4.99%** | 440.46 | no |
| 390×844 | 258 | 216.63 / 216.61 | 41.37px · 16.03% | 440.46 | no |
| 844×390 | 358 | 230.03 / 230.13 | 127.97px · 35.75% | 467.26 | no |
| 900×500 | 332 | 232.19 / 232.18 | 99.81px · 30.06% | 471.58 | no |
| 1024×768 | 600 | 236.66 / 236.71 | 363.34px · 60.56% | 480.52 | **yes** |
| 1280×800 | 632 | **246.00** / 246.07 | 386.00px · 61.08% | 499.20 | **yes** |

Three corrections to the record, all in the same direction: the spec's "max 210.06px" and the
critique's "213.72px (`G`)" both sampled instead of sweeping. The true longest is **`D goes
nowhere else in this column`**, which the spec understates by **6.57px** and the critique by
**2.91px**. A WIDTH row in L10 written as the charter asks — sweep the vocabulary at 360, red
under 10% headroom — is **RED on the pass-1 build at 4.99%**. That is the right gate and it
convicts the family a second time; what pass 2 owes is the cure, not a softer floor.

The cures available, with their costs:

1. **Cut the vocabulary's tail.** `D goes nowhere else in this column` only exists at 16×16.
   At 9×9 the longest is `7 goes nowhere else in this column` = **211.05px** (7.4% headroom) —
   still under 10%.
2. **Let line two wrap or clip.** `white-space: nowrap` with no wrap, clip or ellipsis is the
   masked fallback the critique named: the ink simply paints outside the box. `text-overflow:
   ellipsis` needs `overflow: hidden` and a definite width, and the ellipsis codepoint
   (U+2026) IS in the hand's cut (`index.css:96`), so it costs no woff2 re-cut.
3. **Shorten the copy** (row 1's copy arm doubles as row 3's cure: `only 4 fits in row 4
   column 7` is 172.92px, 24.2%).
4. **Drop the strip's tongue yield at 360.** The 6.5rem the strip yields to the tongue
   (`GameBoard.vue:1293-1297`) is 104px of the phone's width; the strip is 228px of 360.

---

## 4. Row 4 — `lint:ink` is blind to 11 of 16 consumers, not 1 of 7

The proposed diff, with its self-test arithmetic and a discovery shape, is banked whole at
`instruments/check-ink-pressure-row7.md`. The headline: `SHIP4`
(`scripts/check-ink-pressure.mjs:399-443`) names five selectors, closure 3 owns a sixth, and
the self-test at `:732-737` pins the census at 6 — while `src/` holds **16 sites** that write
`var(--ink-press-quiet)` or `var(--ink-press-rule)` (12 + 4; the ledger's line two makes 17).
Adding row 7 requires touching three places in one diff or the gate self-tests red. The
negative control the row inherits already exists and works (`:685`, every selector re-run with
a `-gone` suffix must fail).

---

## 5. Row 5 — the deal cure's unit row, exactly

`GameBoard.receipt.test.ts:93-107` already carries a givens-family deal
(`givenCells: new Set(["0","5","9"])`, `dealt: true`, `boardGeneration: 2`) — but it mounts on
an EMPTY margin and asserts line one only, so it cannot see the defect. The row the charter
asks for is that fixture with a standing column and both assertions:

```ts
it("a re-deal WITH givens empties a standing column", async () => {
  const w = mountBoard({ dealt: true, givenCells: new Set(["0", "5", "9"]) });
  await w.setProps({ hint: HINT_A }); await nextTick();       // record 1
  await w.setProps({ hint: null, refusal: { pos: 0, reason: "given", seq: 1 } });
  await nextTick();                                            // record 2 — the column is two deep
  expect(aged(w)).toBe("only 4 fits here");
  await w.setProps({ dealt: true, givenCells: new Set(["1", "6", "9"]), boardGeneration: 3 });
  await nextTick();
  expect(receipt(w)).toBe("");
  expect(aged(w), "a deal says nothing, on either line").toBe("");
});
```

The `aged()` helper is already in the file (`:69-70`). The existing "a deal leaves BOTH lines
empty" row (added by the pass-1 diff) runs the no-givens family; this is its twin.

---

## 6. Row 6 — 844×390 RE-PRICED, and the pose is worse than the ballot

`logs/R2-landscape-*.json`, both engines, byte-identical to 0.03px:

| | 844×390 | 900×500 |
|---|---|---|
| `scrollHeight` / `innerHeight`, strip EMPTY | **409 / 390** | 500 / 500 |
| `scrollHeight`, column two deep | 410 | 500 |
| strip y, h | **388.39**, 22.09 | 460.97, 22.30 |
| how much of line one is above the fold | **1.61px of 22.09 (7.3%)** | all of it |
| strip width | 358 | 332 |
| two longest + gap | 467.26 | 471.58 |
| first painted box below the strip | `.control-panel-filtered` @419.19 — **8.70px** clear | @489.77 — **6.50px** clear (webkit 7.11) |
| `#fold-tools` | **0×0, display none** | 0×0, display none |
| `.play-controls` | y **1070.61** (680px below the fold) | y 1180.61 |
| line two | `display: none` (the prototype's landscape arm) | `display: none` |

**The ballot re-prices to the same answer and for a stronger reason.** Its own rule (take the
trailing berth iff the strip holds the two longest plus the gap) fires depth-one at 844×390 as
it did at 900×500 — 358 < 467.26. But the deciding fact is new: at 844×390 the strip is
already below the fold, there is no ribbon at all (`#fold-tools` is 0×0 — `DrawerTab.vue:105`
says so in the source and the measurement agrees), and there are **8.70px** before the controls
card. A second line out of flow would paint over the controls card; in flow it would push it.
Depth one there is not a concession, it is the only construction. B6's split-grammar row still
applies and the owner disposes at the re-look.

One finding beyond this family's scope, for the wave: **at 844×390 the margin's LIVE line is
92.7% below the fold at HEAD.** The ledger neither causes nor cures that; §7's spec should
name it and hand it to W2.

---

## 7. Row 7 — the desk pair, the grade-leaves pose, and the path to `solveState: "error"`

**The graphite pair is induced, measured and photographed** — the pose neither the prototype
nor the critic could reach. The path: arm a hint (record 1), press `h` AGAIN to spend it (the
digit inks, the model nulls, the sentence stands — the family's own mechanism), move the caret,
arm again (record 2, the push). `logs/R5-graphite-pair-*.json`, `frames/1280-graphite-pair.png`,
`frames/1024-graphite-pair.png`.

```
1280×800, light, chromium — the common desk pose, actual size 632px of strip:

  only 5 fits here  4 goes nowhere else in this column
  └── 107.03px ──┘ ↑                                 └ 237.50px, quiet, 68% ─┘
   full graphite    7.19px           shared baseline, no punctuation, no rule
```

The critique's fear is confirmed as a number, not an opinion: **the word space in this type is
4.55px at 1280 and 4.00px at 360; the gap between two RECORDS is 7.19–7.20px.** A record
boundary is 1.58× a word boundary at the desk and 1.80× on the phone. The only other cue is the
pressure step (14.52:1 → 5.18:1). Whatever the synthesizer does about it — a wider gap, a
separator that is not a rule, a second berth — it should be decided against 1.58, not against
"7.20px of air".

**The error card over a two-line column, reached.** No product change: the page's own `Worker`
constructor is wrapped before boot (`probe/ledger2c.probe.ts` INIT) so live workers are
registered and a fault can be armed AFTER the records are written. `ensureWorker`
(`transport.ts:111-133`) retires a worker that fires `error` and re-mints on the next call, so:
arm the fault → dispatch `error` at the registered workers → open the sheet (settle 1100ms, the
dock slides) → press Solve → `WORKER_FAILURE` → `classifyError` → `solveState = "error"`
(`useGameState.ts:695`) → the paper note mounts. `logs/R7b-error-card-*.json`, both engines.

What it costs, at 390×844 (`logs/R13-hidePrevious-*.json`, `logs/R15-overlap-chromium.json`):

| | depth 2, no card | card, line two hidden | card, line two FORCED visible |
|---|---|---|---|
| board y | 219.73 | 186.53 | **186.53** |
| strip y, h | 594.13, 20.80 | 560.92, 87.19 | **560.92, 87.19** |
| `scrollHeight` | 844 | 844 | **844** |

**`hidePrevious` is worth zero pixels of layout** — line two is absolutely positioned below
1024, so it costs no height by construction. What it is worth is the collision: line two spans
581.72–602.52 and the card spans 588.11–648.11, so the two share **14.41px**, and the card wins
by paint order. `frames/390-card-over-aged-line.png` is that overlap with the sheet shut. The
spec's sentence ("both want the same 25.60px") should be replaced by the measured one: they want
the same 14.41px, the cost is zero height, and the ruling is a legibility ruling.

**The grade-leaves pose** needs no rig: it is `setMargin("", "graphite", "grade")`
(`GameBoard.vue:809` in the worktree) — line one empty, line two standing. The strip's reserved
line (`min-height: 1.3em`, `MarginNote.vue:185` in the worktree, `:96-107` at HEAD) holds the geometry, so the pose is a blank
full rung over a quiet second one. It is a frame for the prototype lane, not a measurement.

---

## 8. Row 8 — L5's negative control as a MODEL row

"A forced third line must not render" cannot fail against one `previous` prop. The model row
that can: drive THREE records through `setMargin` and assert the component receives exactly two
strings and paints exactly two boxes.

```ts
it("three records in, two lines out — and the oldest leaves no trace", async () => {
  const w = mountBoard({ dealt: true });
  await w.setProps({ hint: HINT_A }); await nextTick();   // "only 4 fits here"
  await w.setProps({ hint: HINT_B }); await nextTick();   // pushes A down
  await w.setProps({ hint: HINT_C }); await nextTick();   // pushes B down, A is gone
  expect(receipt(w)).toBe(noteFor(HINT_C));
  expect(aged(w)).toBe(noteFor(HINT_B));
  expect(w.html()).not.toContain(noteFor(HINT_A));
  expect(w.findAll(".margin-note-previous")).toHaveLength(1);
});
```

The prototype already measured the behaviour (`measurements.json` L5: `afterThreeRecords:
"still 1 + 1"`); what is missing is the assertion.

---

## 9. Rows 9, 10, 11 — the spec's debts, each with its number

**Row 9, the stutter.** Both clauses live only in the prototype's `setMargin`
(`GameBoard.vue:643-668` in the prototype worktree) and belong in the spec verbatim: *(a)* a record is
displaced only by a DIFFERENT sentence (`text !== marginText.value`), because two refusals in a
row are one record said twice; *(b)* the column never prints one sentence twice (if the new
live line equals line two, line two is dropped) — the second way in is a grade, which does not
age, so line two still holds the record the grade displaced.

**Row 10, the desk push is lateral and its travel is not a constant.** Measured
(`logs/R3-desk-pair-*.json`):

| rig | dx | dy | = line one's ink + gap |
|---|---|---|---|
| 1024×768 | **−127.50** (webkit −127.53) | **0.00** | 120.31 + 7.19 = 127.50 ✓ |
| 1280×800 | **−132.25** (webkit −132.28) | **0.00** | 125.06 + 7.19 = 132.25 ✓ |

So the declaration the spec owes is not a number but a rule: *at ≥1024 the mover travels line
one's own ink width plus the 7.2px column gap, horizontally, and 0.00px vertically.* Its range
over the whole vocabulary at 1280 is **108.95px → 253.20px** (shortest record `the answer is 1`
= 101.75, longest 246.00) — a **2.32× velocity spread** on one duration, which is MOT-DERIVE's
`dockGlideMs` finding arriving in the margin. Either the duration derives from the travel or the
spec admits the spread. Below 1024 the same push is vertical and constant at one line box
(20.80px), so the two berths do not share a velocity either.

**Row 11, `flex-wrap: nowrap` reverses T4-P1 mark 6 AND does not buy what it paid for.** Priced
on a clone of the live block at the narrowest desk (`logs/R8-desk-triple-*.json`), verdict
`check the greater than signs` + tally + the longest aged line:

| 1024, tally | wrap: block height | nowrap: block height | what nowrap actually did |
|---|---|---|---|
| `0 backtracks · 42ms` (140.61) | 24 (one row) | 24 | fits either way, 6px spare |
| `1284 backtracks · 19.9s` (162.41) | **48** | **48** | items shrank to 185.48 / 158.14 / 242.00; the TALLY's text wrapped inside its squeezed box |
| `99999 backtracks · 473.0s` (184.03) | 48 | 48 | same, and line two's ink paints 6.53px outside its own box |

`flex-wrap: nowrap` does not keep the block to one line — it moves the second line inside the
tally and silently pushes line two's ink out of its box. The block grows either way. So the
cure is not "scope the nowrap to the previous" (`flex-wrap` is a container property and cannot
be scoped to a child); it is to stop line two competing for the line:

```css
@media (min-width: 1024px) {
  .margin-note-previous { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
}
```

`flex-basis: 0` makes line two's hypothetical main size 0, so it never causes a wrap; the block
keeps `flex-wrap: wrap` and the tally keeps the second line T4-P1 mark 6 gave it; and the ink
that will not fit is elliptised inside the box instead of painting outside it (U+2026 is in the
hand's cut, `index.css:96`, so no woff2 is re-cut). Production hides the whole question today
only because the tally is debug-gated (`GameBoard.vue:886`, `useDebug` → `useStorage("sudoku-
debug", false)`).

---

## 10. A live estate defect this family's sweep found: the ransom note at 16×16

`toDisplayChar` (`glyphRegistry.ts:64-70`) renders values 10–16 as **A–G**, and the hint copy
prints that glyph (`GameBoard.vue:694-698`). The hand's declared cut
(`index.css:93-96`) carries exactly three uppercase letters: **C (U+0043), R (U+0052),
S (U+0053)**. Proven by advance, not by `cmap` (`logs/R14-ransom-*.json`; `document.fonts.check`
answered `true` for every character including the comma, so it is not evidence — the trap
CTRL-FACE booked in pass 1):

| glyph | advance with `"Patrick Hand", monospace` | advance with `monospace` alone | painted by the hand? |
|---|---|---|---|
| 1–9 | 6.14–8.25 | 9.92 | **yes** |
| C | 9.09 | 9.92 | **yes** |
| A B D E F G | **9.92** | 9.92 | **no** |
| `,` `;` `j` `x` | 9.92 | 9.92 | no |

In the note's real stack (`"Patrick Hand", cursive`) those six glyphs advance 10.92–13.81px
against the hand's 6.14–8.25px digits — which is exactly why `D …` is the widest record in the
vocabulary. This is R6 law 30 ("a rendered-string change mints a font ransom note — the woff2
subsets are letter-exact") broken by a LANDED string, live at HEAD on every 16×16 board, with
`check-font-coverage` green because it binds strings to faces by a hand-written `where`
(registry v1 §7.6's trap). The ledger neither causes it nor cures it; §7's width row depends on
it, so the spec must either cite it as a wave row or measure its vocabulary at 9×9 only and say
so.

---

## 11. The primitives to reuse, named

| primitive | where | what it gives §7 |
|---|---|---|
| `MOTION.note.{writeInBeats,pushBeats}` | `pencilConfig.ts:157-160` (prototype) | the note's two clocks as one, published to CSS by the `--card-step-ms` precedent |
| `--ease-noteWrite` | `index.css`, consumed at `MarginNote.vue:228` (prototype) | the write-in curve the push already rides; no fourth accidental curve |
| `--ink-press-quiet` (68%) / `--ink-press-rule` (55%) | `index.css:257-266` | the two rungs; the third is sub-AA for text in BOTH themes (3.51 light / 4.37 dark) |
| `min-height: 1.3em` on the block | `MarginNote.vue:185` (worktree) / `:106` (HEAD) | the reserved line that keeps the strip's height constant through every pose |
| the strip's two regimes | `GameBoard.vue:1273-1310` | in flow <1024, absolute overlay ≥1024 — the berth law follows the regime, it does not invent one |
| `kind: record \| grade \| state \| empty` | the family's own, `GameBoard.vue:641-642` (prototype) | already handed to MRK-*, PLR-*, ACC-*; the referent fields hang off it (row 1) |
| `armedHintTurnsOn` | NOTE-ERASE's diff | the PREDICATE, re-homed onto the record (row 1) |
| `.note-leave-active { transition: none }` + a computed-duration exit | NOTE-ERASE's prototype | the pushed-off line's exit; §13's `--rung-breath` **200ms** on `--verb-rubOut-ease` `cubic-bezier(0.32, 0, 0.67, 0)` with the `ink-rub-out` keyframe (`synthesize/MOT-VERB.md:122-128, 223-228`) is the house duration §7 consumes |
| `aged()` test helper | `GameBoard.receipt.test.ts:69-70` | rows 5 and 8 are assertions, not scaffolding |
| the `-gone` negative control | `check-ink-pressure.mjs:685` | row 7 inherits a working negative control |
| W3's sr-only roll (5 regions, one `role="log"`) | measured in `logs/R6-a11y-*` | the landed idiom row 2 would extend — and the measurement says it needs no extension |

---

## 12. Constraints it collides with

- **M16 / R6 law 30.** No new string without the subset arithmetic. The comma and semicolon are
  out of the hand's cut; the ellipsis (U+2026) and the apostrophe (U+0027) are in.
- **AA both themes.** Line two 5.18 light / 6.14 dark over `--color-background` (the critique's
  recomputation; the banked C5 parser was wrong and its file says so). Line three is forbidden
  by arithmetic, not taste.
- **filterBudget EXACTLY 9** (R6 law 9 / L1). This family draws nothing; the census stays 9 and
  the family says so rather than being silent.
- **π on unclaimed surfaces.** The pass-1 diff's only unconditional change outside the new
  element is `position: relative` on `.margin-note-block` below 1024 and `250ms` →
  `var(--note-write-ms, 250ms)` at the same value. Row 11's cure adds a `@media (min-width:
  1024px)` rule on the new element alone — still no unclaimed surface.
- **W2's landed mechanics.** The dock over the column reads Δ0.00px both engines (the
  critique's C9, settled 1100ms); the sheet SLIDES and must settle before measuring. Below
  1024 in landscape the tongue is on the right flank and `#fold-tools` is 0×0 — so "the ribbon"
  is not a landscape term at all.
- **R6 row 54** (the MarginNote idiom row): one always-mounted `role="status"`, 250ms clip-path
  write-in, three tones, comments on the puzzle only. The ledger adds a second PARAGRAPH, never
  a second region and never a fourth tone.
- **The strip's other tenants.** `SolverErrorNote` keeps the flow berth; the tally is a flex
  item between line one and line two; the celebration clips the VOICE, not the block
  (`MarginNote.vue:115-122` at HEAD).

---

## 13. Sketches

```
① THE PHONE, 390×844 — one law, two lines, zero board travel
   ┌───────────────────────── board 366×366, y 219.73 ─────────────────────────┐
   │                                                                           │
   └───────────────────────────────────────────────────────────────────────────┘
     strip (258px, yields 6.5rem to the tongue)                      ╭──╮ tongue
     only 4 fits here                            ← line one, full graphite, 20.80px, y 594.13
     4 goes nowhere else in this row             ← line two, quiet 68%, OUT OF FLOW (top:100%)
     ─────────────────────────────── 4.80px ────────────────────────────────────
     [ undo ][ redo ][ hint ][ peek ][ controls ]   ← the ribbon, 55.98px, y 640.52
   board y is 219.73 at depth 1 AND depth 2. The 4.80px is the whole safety margin.

② THE DESK, ≥1024 — the trailing berth, and what 7.19px is worth
   only 5 fits here␣␣4 goes nowhere else in this column
                  └┬┘
                   7.19px  ← the boundary between two RECORDS
   only␣5␣fits␣here
       └┬┘
        4.55px  ← the boundary between two WORDS.  Ratio 1.58.
   the push: dx = (line one's ink) + 7.2px, dy = 0.00.  1024: −127.50   1280: −132.25

③ 844×390 — the pose the ballot was never priced on
   ═══ fold, y 390 ═════════════════════════════════════════════════════════════
   strip top y 388.39  ← 1.61px of a 22.09px line is above the fold
   only 8 fits here                                    (line two: display:none)
   ────────── 8.70px ──────────
   .control-panel-filtered y 419.19 … .controls-card y 390, 302 tall
   #fold-tools 0×0 · .play-controls y 1070.61 (680px below the fold)
```

---

## 14. Risks the synthesizer inherits

1. **4.99% headroom at 360 and W7 §10 is re-cutting the type scale.** One px of `--type-body`
   at 360 costs ~13px of ink on the longest record. The family lives on 11.37px.
2. **Row 1's cure is a MODEL change** (records carry referents), which widens `setMargin`'s
   contract a second time in one pass. It is small, it is inside `GameBoard.vue`, and it is the
   only way the graft means anything — but it is not free.
3. **The desk gestalt may not be curable inside the trailing berth.** 1.58 word-spaces between
   two records, sharing a baseline, with no punctuation, is what the frames show. A wider gap
   spends strip width the 1024 rig has (363px spare) and the phone does not.
4. **The ransom note at 16×16 is not this family's to fix**, but the width row's worst case is
   a fallback glyph. If §10 or W8 re-cuts the subset, every number in §3 above moves.
5. **`hidePrevious` is a paint ruling now, not a layout one.** If the error card ever leaves the
   flow berth, the ruling's justification (14.41px of overlap) evaporates and must be re-made.
6. **The 844×390 fold is a wave-level fact.** §7 can only declare it; if W2 moves the strip at
   that pose, the landscape ballot must be re-priced a third time.

---

## 15. Housekeeping the charter asked for (row 12)

- **R3-d needs `--timeout=150000` on this rig.** Banked in this lane's `probe/pw.config.ts`
  (file-level `timeout: 150000`) with the reason in its docstring: R3-d walks nine acts with a
  30s idle.
- **The −505.56 "clearance" at 900×500 was measured against `#fold-tools`, which does not
  exist in landscape** (0×0, `display: none` — `DrawerTab.vue:105` says so and the measurement
  agrees). The honest selector is the first painted box below the strip: **6.50px** chromium /
  **7.11px** webkit at 900×500, **8.70 / 8.73px** at 844×390. The spec should name the box, not
  the id.
- **The hue census prints 24 site rows per pose**, four poses (`rest` / `focus` / `mid` /
  `hover`), per theme per engine — `r0/r2-accent-family/census/census-*-{light,dark}.json`,
  `sites` object. "29 rows" appears nowhere in the bank; the prototype's "24+24" is light 24 +
  dark 24 for one pose and is the closer figure. No r0 file was touched to establish this.

## 16. Instruments and readings

| file | what it is |
|---|---|
| `probe/vite.scratch.config.mts` | the lane's server: the estate's config spread, private `cacheDir`, `.mts` because a `.ts` scratch config outside the package bundles to CJS and breaks `@tailwindcss/vite`'s interop |
| `probe/pw.config.ts` | the estate's default minus `webServer`/`globalSetup`, baseURL `:4249`, timeout 150s |
| `probe/ledger2.probe.ts` | R1 vocabulary · R2 landscape · R3 desk pair and travel · R4 (superseded by R6) |
| `probe/ledger2b.probe.ts` | R5 graphite pair · R6 a11y · R7 (the 390 attempt that missed the sheet) · R8 desk triple |
| `probe/ledger2c.probe.ts` | R7b the error card, reached · R9 word space · R10 aria-hidden off |
| `probe/ledger2d.probe.ts` | R11 face by `fonts.check` (refuted) · R12 copy candidates · R13 what `hidePrevious` costs · R15 the overlap frame |
| `probe/ledger2e.probe.ts` | R14 the ransom test by advance — the decisive one |
| `instruments/check-ink-pressure-row7.md` | the proposed gate diff (row 7 + the discovery shape), not applied |
| `logs/*.json` | 26 readings, both engines |
| `frames/1280-graphite-pair.png` (12.7 KB) | the common desk pose, first time photographed |
| `frames/1024-graphite-pair.png` (9.4 KB) | the same pose on the narrowest desk |
| `frames/390-card-over-aged-line.png` (30.6 KB) | the 14.41px the card and the aged line share, sheet shut |

The dev server on 4249 is down. No r0 or pass-1 file was written.
