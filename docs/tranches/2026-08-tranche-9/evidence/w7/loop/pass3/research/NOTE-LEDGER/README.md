# NOTE-LEDGER · pass-3 RESEARCH — what the spec has to be written against

Subject: **main at `74a2b5d9`** (the W7 execution fold — the new base, CHAIR-RULINGS "the base
moved"). Read-only on every product file. One dev server, `127.0.0.1:4249`, `--strictPort`,
private `cacheDir` in the session scratchpad (`probe/vite.head.mjs`), **killed before this lane
returned, port verified free**. Both engines on every live row. Evidence 108 KB, **zero crops**
(nothing here needs one that a number cannot say).

Probes: `probe/r1-berth-and-ransom.mjs` · `probe/r2-paint-and-box.mjs` · `probe/r3-ransom-live.mjs`.
Readings: `logs/r1-{chromium,webkit}.json` · `logs/r2-*.json` · `logs/r3-16x16-chromium.json`.
r0 copy re-pointed and re-run: `instruments/hue-census.COPY.mjs` → `logs/hue-census-pass3-HEAD-74a2b5d9.txt`.

---

## 0 · THE BASE MOVED — what the replay has to resolve toward the fold

`git diff a8fee1f5..74a2b5d9` over the files this family touches:

| file | the fold's hunks | collision |
|---|---|---|
| `GameBoard.vue` (+56/−28) | `useCoarsePointer`, `hoveredPos` → `pointedPos` + a computed `hoveredPos` (:497-520), `onGridFocusout`'s coarse clear (:470-481), the attribution-tape template/CSS | **none** — the margin block is :644-916 and the strip CSS :1296-1345, untouched by the fold |
| `GameBoard.notes.test.ts` (+14/−8) | B1b re-worded the four paper-note sentences and added two `not.toContain("solver")` guards | **YES** — the pass-2 diff edits this file; the replay keeps the fold's sentences and re-applies the ledger's rows on top |
| `check-font-coverage.mjs` (+34) | a new `paperNoteCopy` EXTRACT + a declared `.error-note-text` group | no collision, and it is the **template** for row 14 (below) |
| `check-copy-register.mjs` (+937) | the G17 discovery grammar: a declaration or object property whose NAME says copy hands its literals to the lexicon; `HOUSE_WORD` / `FURNITURE_NOTE` are named at :374 as the margin's tables | **matters for the U-10 copy arm** — a new margin string is now swept by `lint:copy`, so the copy arm must clear the lexicon before it is even written down |
| `MarginNote.vue`, `pencilConfig.ts`, `index.css`, `check-ink-pressure.mjs`, `GameBoard.receipt.test.ts` | untouched by the fold | none |

## 1 · THE SURFACES AND THE EXACT LINES

| what | where (HEAD) |
|---|---|
| the strip | `GameBoard.vue:1160-1170` (`.board-margin` > `MarginNote`), CSS `:1301-1345` |
| in-flow berth | `.board-margin { margin-top: .4rem; margin-inline: .25rem; gap: .4rem; pointer-events: none }` `:1301-1308`; portrait <1024 adds `margin-right: 6.5rem` `:1324-1326` |
| overlay berth | `@media (min-width: 1024px) { position: absolute; top: 100%; inset-inline: .25rem; z-index: 50 }` `:1329-1338` |
| the voice | `MarginNote.vue:54-82` — one `role="status"`, `.margin-note` `:124-132` (`--font-hand`, `--type-body`, leading `--type-leading-caption`, `user-select: none`, `pointer-events: none`) |
| the write-in | `.margin-note-ink { animation: ink-write-in 250ms var(--ease-noteWrite) backwards }` `:147-150` |
| the tally | `.margin-note-meta` `:169-181` — `--type-caption`, leading 1.3, `--type-tracking-wide`, `--ink-press-quiet`, `pointer-events: auto`, `width: fit-content` |
| the model | `setMargin(text, tone)` `GameBoard.vue:651-656`, **12 call sites** (`:723 :733 :747 :750 :764 :774 :778 :785 :816 :839 :840 :956`) |
| the hint's fields | `HintResult` `techniqueEngine.ts:706-719` — `cell`, **`value`**, `becauseCells`, `houseAxis`; consumed whole at `GameBoard.vue:719-736` |
| the record copy | `techniqueVoice.ts:42-58` (`formatHintNote`), `HOUSE_WORD` `:33-37`, `formatConflictNote` `:80-88` |
| the ink gate | `check-ink-pressure.mjs` — `SHIP4` `:399-445` already pins `.margin-note-meta` (row 4, `--ink-press-quiet`), `gateTape` `:515-535` is the shape a `gateNote` copies, self-test `:623-736` (`covered` = SHIP4 ∪ {5}) |
| PRM | `index.css:1157-1171` names `.margin-note-ink`, `.margin-note-meta` by element |
| the keyframe home | `index.css:1115` (`ink-write-in`); **`ink-rub-out` does not exist at HEAD** |
| the fold's ribbon | `GameScene.vue:149` `#fold-tools`; `scene.css:394-397` display:none outside the portrait dock |
| the berth's real owner | **`scene.css:400-410` `.app-layout { gap: 1.25rem }` — the 20.00 px is this gap, nothing else** |

## 2 · THE NUMBERS, RE-DERIVED AT `74a2b5d9` (both engines)

### 2.1 The phone berth — the red is the base's, not the prototype's

| rig | strip foot | first painted box below | gap | interactive? |
|---|---|---|---|---|
| 360×740 coarse | 543.50 / 543.20 | `div#fold-tools.fold-tools` | **20.0000** | **yes** (its `.play-controls` `.icon-btn`s at +5.59) |
| 390×844 | 614.92 / 614.61 | same | **20.0000** | yes |
| 393×699 | 543.92 / 543.61 | same | **20.0000** | yes |
| 390×664 | 524.92 / 524.61 | same | **20.0000** | yes |

(chromium / webkit; `logs/r1-*.json` P1.) The caption line box is **18.1875 px** at all four
(`--type-caption` = 14 px below 1024, `typography.css:103`), so line two's box leaves
**1.8125 px** — the critic's number, reproduced on the NEW base, 4 rigs × 2 engines.

**And the paint is worse than the box.** Patrick Hand at 14 px measures `fontAscent 15 /
fontDescent 4` — a **19 px font box in an 18.1875 px line box**, i.e. half-leading **−0.406**.
The record's own descender (`g` in "goes") measures `actualDescent 4.368`, so the painted ink
falls **0.774 px BELOW its own line box** (chromium −0.7743, webkit −0.7656, `logs/r2-*.json`).

> **Painted clearance to an interactive band = 20.00 − 18.1875 − 0.774 = 1.038 px.**
> The "measure paint, not the box" arm is therefore **DEAD** — it moves the number the wrong way.
> Nobody need spend a pass on it.

Arms, priced against the measured gap (all four rigs are the same 20.00, so one arithmetic serves):

| arm | what moves | painted clearance | cost |
|---|---|---|---|
| **A** `.app-layout { gap: 1.25rem → 1.5625rem }` (25 px) | W2's pose (`scene.css:404`) | **6.04** | +5 px of page at 390×664, the tightest fold; W2's row, an ASK |
| **B** line two takes the ROW CAPTION's own leading (1.1, not the tally's 1.3) | the family's own rule | **2.43** (box 15.40, ink −2.168) | none; and see §3.2 — it is the rung R6 actually names |
| **A+B** gap 1.25 → 1.4375rem (23 px) with leading 1.1 | W2 + the family | **6.03** | +3 px of page |
| **C** re-write the row against the CLASS law | the gate, not the pose | 1.038, **no overlap** | the 6.0 comfort floor goes to the owner (U-10) |
| **D** measure paint instead of the box | — | **1.038 — WORSE** | dead, above |

Arm **C** deserves the synthesizer's attention: the estate's standing law is W2 §2.5 / chair §6.1
— *a tape never covers an interactive element* — which `1.038 > 0` satisfies. `6.0` is this
family's own charter floor and has no owner's mark on it. Chair §6.1's discipline applies
verbatim: **name the reference line** (here: the painted ink's bottom, `halfLeading + fontAscent
+ actualDescent`, not the line box), read it once in both engines, report.

### 2.2 The desk berth — L14's hole has a number now, and it is a collision

| rig | block foot | nearest painted box below | gap | what it is |
|---|---|---|---|---|
| 1024×768 | 762.02 / 761.72 | `button.ctrl-btn.rounded-md` | **8.27 / 8.19** | **interactive** |
| 1280×800 | 794.45 / 794.16 | `button.ctrl-btn.rounded-md` | **21.75 / 21.72** | **interactive** |

The ≥1024 strip is `position: absolute; z-index: 50`, so it does not push — it **overlays**. A
wrap of the block at 1024 puts a second line box (17.55 px there) **9.28 px INSIDE a control
button**, in ink, over the top of it: chair §6.1's class law, second bite, live.

This inverts the naive reading of L14. A `min-width` on line two is the WRONG cure — it is the
thing that *causes* the wrap. The minimum-readable-width row must be a **gate on the painted
width** (red if line two's used width < floor while it holds text), with the CSS keeping
`flex: 1 1 0; min-width: 0` so the row can never wrap. Sizing units, measured at the caption
tier: `1ch` = **6.625 px** at 390 / **6.6563** at 1280 / **6.3906** at 1024. Candidate floor
**12ch ≈ 79.5 px** (the shortest whole record, `only 4 fits here`, is 74.75 px of ink + 4.0 px
of tracking ≈ 78.7 px — so 12ch is "one whole short record or the row is a lie").

### 2.3 Landscape — chair §6.2 governs, and the neighbour is gone

| rig | strip top / foot | `#fold-tools` | first painted box below | scrollHeight / innerHeight | the tab |
|---|---|---|---|---|---|
| 844×390 | 388.39 / 410.48 | `display: none`, 0×0 | **NONE — nothing is painted below the strip** | 410 / 390 | `.drawer-tab` 48×92 at (597, 167) |
| 900×500 | 460.97 / 483.27 | `display: none`, 0×0 | `div#controls-drawer` at **500.00** (the fold line) → **16.73 / 17.34** | 500 / 500 | `.drawer-tab` 48×92 at (612, 253) |

Pass 2's `8.71` (844×390, `.control-panel-filtered`) and `45.92` (900×500) **do not reproduce on
this base**: at 844×390 my sweep of every ≥8×8 painted box finds nothing at all below the strip,
and at 900×500 the nearest is the parked drawer at the viewport edge. Report both, name the box.
Under chair §6.2 the card is reached through the tab (measured present, 48×92, hit-testable at
both rigs), so the landscape row is: **depth one stands, and the constraint is the FOLD, not a
neighbour** (410 of scroll in a 390 viewport already at HEAD; a second line adds 18.19 more).

### 2.4 π control rows at `74a2b5d9` (the prototype re-reads these)

board `y`: 180.31/180.02 (360×740) · 221.73/221.42 (390×844) · 147.73/147.42 (393×699) ·
131.73/131.42 (390×664) · 124.91/124.61 (1024) · 124.45/124.16 (1280). `scrollHeight` =
viewport height on every portrait rig; 410 at 844×390. Exactly one `p[role=status]` in the strip;
the ink node carries **no `data-*` attribute at HEAD** (so NOTE-ERASE's (0,1,0) leave-vs-state
trap is not armed here *until* this family adds one — see §5). Under PRM `.margin-note-ink`
computes `animation-name: none`, `duration 0s` (`index.css:1157-1171` works as written).
**hue census: byte-identical to r0** (`logs/hue-census-pass3-HEAD-74a2b5d9.txt` vs
`r0/r6-idiom-history/hue-census-HEAD.txt`, `diff` exit 0) — charter row 11 is closed at HEAD and
the prototype only has to hold it.

## 3 · THE TWO THINGS RESEARCH FOUND THAT NOBODY HAS BANKED

### 3.1 The ransom note is EIGHT codepoints wide, and one of them is on every 9×9

`patrickhand-subset.woff2` = **46 codepoints**, read off the file's cmap:
` !'-.0123456789?CRSabcdefghiklmnopqrstuvwyz×—…` — **the only capitals are C, R, S**, and
there is **no `j`, no `x`**. `index.css:93-95`'s `unicode-range` matches the cmap exactly, so
the descriptor is honest and the browser simply falls through to `cursive` per glyph.

Sweep the margin's whole rendered vocabulary against that cut:

| string (rendered in `--font-hand`) | out of cut |
|---|---|
| `4 goes nowhere else in this box` (`HOUSE_WORD.box`, `techniqueVoice.ts:35`; pinned at `techniqueVoice.test.ts:36-38`) | **`x` U+0078** |
| `check box 4` (`formatConflictNote`) | `x` U+0078 |
| `only D fits here` / `A…G goes nowhere else…` (16×16, `glyphRegistry.ts:64-70`) | A B D E F G |
| `1284 backtracks · 19.9s` (the tally) | `·` U+00B7 |

**Live, at HEAD, first arm on a 16×16:** `only E fits here` →
`{face: "Patrick Hand", shown: "only E fits here", missing: ["U+0045"]}` through the estate's own
census algorithm (`logs/r3-16x16-chromium.json`). No gate has ever seen this: `font-census.spec.ts`'s
`CELLS` (`:139-145`) load a board and never arm a hint, and `check-font-coverage.mjs`'s Patrick
Hand corpus (`:209-270`) has four groups — washi tapes, row captions, the paper note, the picker's
axis captions — and **no margin group at all**.

So charter row 14's "re-cut the subset or widen the gate's `where`" is a false pair. There are
three cures and the estate has already built two of them:

1. **`font-census.spec.ts` gains one act** — arm a hint in each existing cell (one keypress),
   and key the row the way the KenKen cage operators are keyed (`CAGE_LABEL` / `ledgerKey`,
   `:120-125`), because the sentence's digit is per-deal. Born RED today on `U+0078`.
2. **`check-font-coverage.mjs` gains a `marginRecordCopy` EXTRACT**, exactly the shape B1b landed
   for `paperNoteCopy` at `:117-131` — derive from `HOUSE_WORD` + `formatHintNote`'s static
   segments, declare the strings. Born RED today.
3. **the re-cut** — 46 → 53 codepoints (`x`, A, B, D, E, F, G; `·` if the tally counts).
   Estimated **+656 B** (93.7 B/codepoint on this file's own 4312/46); the source TTF is not in
   the repo, so that figure is an ESTIMATE and says so. R6 law 30 names the re-cut as the
   owner-declined cost, and `font-census.spec.ts:44-57` records that decline twice.

This family does not create the defect and cannot cure it. What it does is **double its dwell
time**: the aged record keeps the same vocabulary on screen for a second line. That is the
sentence the return owes the owner.

### 3.2 The tally is DEBUG-GATED, and the rung the family claims has leading 1.1

`GameBoard.vue:915-916` — `const debug = useDebug(); tally = debug ? formatSolveTally(…) : ""`,
and `useDebug` is `useStorage("sudoku-debug", false)` (`composables/useDebug.ts:14`). **A visitor
never sees a tally.** My desk runs with the flag set still print none, because the tally also
needs a completed solve's `solveStats`. So "line two mirrors the tally" is a mirror of a surface
production does not render, and the critic was right that the stronger defence is R6's row
caption — which ships, on every board, in the rail.

And the row caption's own declarations (`GameControlPanel.vue:1615-1625`) are:

```
font-family: var(--font-hand);  font-size: var(--type-tag);  line-height: 1.1;
letter-spacing: var(--type-tracking-wide);  color: var(--ink-press-quiet);
```

Two corrections fall out. (a) The rung is **`--type-tag`** (`typography.css:123`:
`--type-tag: var(--type-caption); /* row caption · closed-tab value · roster */`) — R6 law 27's
role seam, which W2 landed *precisely* so W7 writes one right-hand side per role; consuming the
ROLE also makes §10's re-floor free instead of a re-measure. (b) The leading is **1.1**, not the
tally's 1.3 — which is worth **2.79 px** of the very berth the family is 4.2 px short in (§2.1
arm B). The family has been copying the wrong neighbour's five declarations.

## 4 · PRIMITIVES TO REUSE (named, with their homes)

| need | primitive | home |
|---|---|---|
| the record carries its digit | `HintResult.value` + `toDisplayChar` | `techniqueEngine.ts:712`, `glyphRegistry.ts:64` — already both at the call site `GameBoard.vue:724-728` |
| the compiler names every writer | **make `kind` a REQUIRED parameter of `setMargin`** — NOTE-ERASE's origin seam applied to this file; TS2554 then names all **12** call sites | `GameBoard.vue:651` |
| the quiet rung | `--ink-press-quiet` (68 %), already gated | `index.css`, `check-ink-pressure.mjs:399-445` row 4 |
| the role rung | `--type-tag` | `typography.css:123` |
| the gate's shape | `gateTape` + its self-test case | `check-ink-pressure.mjs:515-535`, `:690` |
| the discovery census | the fold's own `derive`-and-declare pattern | `check-font-coverage.mjs:117-131` (B1b) |
| the mixed-face reader | `MIXED_FACE` + `ledgerKey`'s normalized-key class | `e2e/font-census.spec.ts:120-125, 147-225` |
| the rub-out rung | `--motion-whisper` 150 ms (§2.2), published by MOT-LADDER's `publishMotionRungs()` | not at HEAD; §13's publisher |
| PRM by element name | `index.css:1157-1171` | must gain `.margin-note-previous` |
| pointers handed back at the control | R6 law 40 — `.board-margin` is named in the law | `MarginNote.vue:179` is the precedent (`pointer-events: auto` on the tally) |
| the strip's reserved line | `.margin-note-block { min-height: 1.3em }` | `MarginNote.vue:106` |

## 5 · THE GRAFTS, checked against this tree

- **origin-required seam** — `WriteOrigin` does **not** exist at HEAD (it is NOTE-ERASE's
  proposal in W1's `useGameState.ts`). Take the *shape*, not the field: the ledger's predicate
  does not care whose hand wrote the digit, so what it grafts is "a required parameter the
  compiler enforces" → `kind` on `setMargin`.
- **the kind taxonomy** — `record | grade | state | empty` is the substrate the ageing rule needs
  (`grade` replaces in place, `state` never ages, `record` ages). It is also what makes the
  canonical-loop cure expressible: **AGE on `values[cell] === hint.value`, STRIKE on
  falsification**.
- **the (0,1,0) leave audit** — measured: the ink node carries **no `data-*`** at HEAD, so the
  trap is not armed today. It arms the moment this family adds a state attribute (e.g.
  `[data-note-age]`), and NOTE-ERASE proved a `[data-*]` (0,2,0) beats `.note-leave-active`
  (0,1,0). Rule for the spec: **line two's leave must be a class the element has no competing
  state rule for**, asserted by reading computed `animation-name` during the leave.
- **the marker-pair `--check`** — MOT-VERB's byte diff of the published `<style data-motion-rungs>`
  against `MOTION.rungs`; this family consumes two rungs and cites it rather than re-minting.
- **`1lh`** — not needed: nothing here tracks a leading it does not own; the two leadings it
  touches (1.3 body, 1.1 caption) are both declared in files this family edits.
- **the painted-byte cross-check** — `getComputedStyle().color` composited over the paper; the
  critic already did this arithmetic (5.22 light / 6.11 dark) and line two has no inline star, so
  painted and arithmetic agree.

## 6 · SKETCHES

```
(1) THE PHONE BERTH, to scale (390×844, HEAD numbers, hint armed)

    …board…                                        y 221.73  (π control)
    ┌───────────────────────────────────────────┐
    │ .margin-note   only 8 fits here           │  20.7969   ← body, leading 1.3
    ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤  y 614.92  = block foot
    │ .margin-note-previous (out of flow)       │  18.1875   ← caption, leading 1.3
    │   ink overhangs its own box by 0.774 ─────┼──┐
    └───────────────────────────────────────────┘  │  1.038 px of PAINTED air
    ════════ #fold-tools ═══════════════════════   ▼  y 634.92   ← INTERACTIVE
       [undo] [redo] [hint] [peek] [controls]         .app-layout gap = 1.25rem = 20.00

    arm B (leading 1.1): the box is 15.40, the ink overhangs 2.168 → 2.43 px
    arm A (gap 1.5625rem): 6.04 px            arm A+B (1.4375rem + 1.1): 6.03 px
```

```
(2) THE DESK ROW — why min-width is the wrong cure (1024×768)

    ┌ .margin-note-block  (position: absolute; top:100%; z-index:50) ─────────┐
    │ only 5 fits here   ·  4 goes nowhere else in this column               │
    │ ^ voice, --type-body   ^ tally berth      ^ line two: flex 1 1 0       │
    └──────────────────────────────────────────────────────────────  762.02 ─┘
                                                                     8.27 px
    ┌──────────────────────────────────────────────────────────────  770.28 ─┐
    │  [ button.ctrl-btn ]   ← INTERACTIVE, and the strip paints OVER it     │

    a min-width on line two ⇒ the block wraps ⇒ line two's 17.55px box lands
    9.28 px inside that button.  The floor must be a GATE on the used width,
    never a CSS minimum.
```

```
(3) THE AGEING RULE, after the two cures (the shape a receipt row can assert)

    hint arms ─────────────► live = {text, kind:"record", cell, value, because[]}
                                    │
        a digit lands on `cell` ────┼── values[cell] === value  → FULFILLED → AGE (push to line 2)
                                    │   values[cell] !== value  → FALSIFIED → STRIKE
        a digit lands in `because` ─┼── that VALUE now in the house → STRIKE
                                    │   any other value           → STANDS   ← pass 2 struck it
        anything else ──────────────┴── STANDS
```

## 7 · RISKS

1. **The clearance may not be closable inside this family.** Every arm that reaches 6.0 spends
   W2's `.app-layout` gap. If the owner declines the 4–5 px, the honest close is arm C (re-write
   the row against the no-overlap class law and carry 6.0 as the ask) — not a leading change that
   also breaks the rung.
2. **Chair §6.5 vs charter §2.1 are in tension.** §6.5 strikes `var(--x, fallback)` outright and
   requires `@property` + `initial-value`; §2.1 says the byte-equal fallbacks stand until
   MOT-LADDER's publisher lands in this worktree. The bridge is the drift assertion, and it must
   be written to DIE when the publisher lands. Note the CSS consequence: an absent *unregistered*
   custom property makes the whole `animation:` shorthand invalid at computed-value time → the
   exit becomes a cut, not a hang; with `@property` it resolves to the initial value. Either way
   the born-RED row is "delete the publisher".
3. **`--type-tag` is R6 law 27's CONTROLS-estate seam.** Seating the margin on it is right by the
   idiom census and wrong by the letter of the law's scope. Ask; do not assume.
4. **The minimum-readable-width gate can red on a long tally** (debug on) before it reds on a
   defect. Scope it to "line two holds text AND the block has not wrapped".
5. **The 16×16 record is the width driver and it is also the ransom note.** If the subset is
   re-cut, every width number moves DOWN (the fallback face is wider); if it is not, the family
   ships a second line of mixed-face ink. Both are the owner's, and the re-cut is twice-declined.
6. **The landscape figures moved between bases.** Do not carry pass 2's 8.71 / 45.92; re-derive
   and name the box, per chair §6.1.
7. **Nothing here is a production surface for the tally mirror.** If the synthesizer keeps the
   tally as the family's justification, the spec is defending a debug-only pose.
