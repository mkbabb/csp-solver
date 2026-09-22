# G-PANEL: opus design spec (T9-M17, the new-game panel)

Designed against main `1e6cfbbf`, the product the owner audited. Every measured number is the
census's (`census/panel-bar/README.md`, cited `PB §n`). Every height marked **(arith)** is
worked out from measured parts in this file, not rendered: nothing here was prototyped and no
server was bound. Nothing here retires a mark (U-10). The spec becomes pass-5 charter rows (§9)
for §10's leader (CTRL-FACE) and its siblings.

I invoked the frontend-design skill and followed its two passes: §2 is the plan, §3 checks it
against the tell list and the brief, and §4 onward is the spec.

---

## 0 · The memorable thing

**One question, one line.** On the desk rail, each question in the new-game compartment is a
heading with ONE written line of answers under it, and Deal shares its line with its receipt.
At 1280×800 the compartment drops from 503.19 px to about 295 **(arith)**. Deal moves from
under the bar's fade to about 240 px above it, and the next compartment's tape comes into view
without a scroll. The option words, their size, faces and inks stay as they are. Only the way
the space is used changes.

That's the one bold move. Everything else is keeping π.

---

## 1 · Ground (what binds the design)

- **The frame is the desk rail, not the phone** (PB §0). The m17 grammar (h2, then three chips
  one per line, a rule, h2, three chips, a rule, Deal) comes only from the `!mobile` arm:
  `GameControlPanel.vue:822-835` + `OptionSelector.vue:44`
  (`flex flex-col items-center md:items-stretch`). Below 1024 px the dock already lays the
  values in a row (60×44 · 60×44 · 84×44).
- **The mechanism is one arm with a stale premise.** `OptionSelector.vue:175` says "The rail is
  a 165px column". The fine rail's content column actually measures **259.59 (1024) · 268.22
  (1280) · 271.25 (1366) · 274 (1440) · 276.31 (1512) · 283.69 (1728)**. The coarse rail is
  still **168** because it mounts no crib (PB §1a).
- **The waste, measured:** the size and level sections spend 87–89 % of their area on paper
  (ink 0.11–0.13), and their widest run fills 22–27 % of the width (PB §1a). Each chip is a
  268.22 px row holding a 36–72 px word.
- **Deal is below the fold of its own card** at the reference desk rung. At 1280×800 with
  scrollTop 0, Deal sits at 560.47–633.27 and the bar's top is at 627.64, with a 32 px fade
  above it (PB §1a).
- **Rhythm defect:** the gap from the tape's bottom to the `size` h2's top is **2.19 px**, the
  smallest step on the card. The steps run 2.19 < 4.00 (h2→chip) < 7.2 (seam) < 13.6 (rule
  air). The two NAMES are closer together than two values are (PB §1a).
- **The dock's own defect of the same family:** the deal row is **48.7 %** of the zone's height
  at 7 % ink. The verb (56×70.39) and the tally (91×30.39) are stacked, with 27.2 px of rule
  air above them (PB §1b).
- **The rail is shrink-to-fit on max-content, and the board is centred against it.** Two
  histories come from exactly this. The crib keeps its max-content so the board doesn't walk
  about 24 px (`GameControlPanel.vue:1216`). And `1fr auto 1fr` on the deal row "widened the
  rail 276.25 → 283.14 and the centered `.app-layout` walked the board 3.45px left" (the T6
  mark-6/8 comment at `:1843`). Any row that gets wider on the rail moves the board unless it
  stops contributing to the rail's width.
- **The receipt went under the verb at T6 mark 8** because "a 36px die and a 1.9em tally leave
  no room to be side by side" **in one shared cell** (`e2e/visual-regression.spec.ts:574`).
  That cost **+32.79 px** (the seal comment, `:806`). This spec takes the 32.79 back with
  separate tracks, not a shared cell.

---

## 2 · Plan (frontend-design pass 1)

**Subject.** A pencil case for logic puzzles. The new-game compartment is an order slip: two
questions (size, level) and one act (Deal), plus the receipt of the last deal. The rail shows a
slip spaced like a menu, one value per line. A slip is filled in on lines.

**Palette.** Only existing tokens; this group adds no colour.

| name | light | dark | job |
|---|---|---|---|
| card paper | `rgb(253,253,252)` | `rgb(19,18,17)` | the ground (PB §2) |
| ink (selected value, underline) | `#1a1a1a` | `#ffffff` | `OptionSelector` `inkColor()` |
| quiet value | `text-muted-foreground` (`rgb(115,115,115)` light, census R6 §3.2) | its dark arm | unselected chips |
| rule | `--ink-press-rule` (55 % graphite) | its dark arm | section rules |
| tier ink | `--color-orange-ink` `rgb(162,96,9)` etc. | crayon dark arms (law 18) | `level` heading + selected tier |

**Type.** Also unchanged: Fraunces 800 for the group names (`--type-group-title` = 25.888 px at
≥768), Fira Code for the values (`--type-option` = 20 px on the rail), and Patrick Hand for the
tape, sublabels and `dealt`. Law 27's role seam isn't touched: no rung moves.

**Layout concept (one sentence).** The rail's answers run left to right on one line under
their question, flush-left with the question's first letter, and the act sits on one line with
its receipt.

```
DESK RAIL, fine, 268 px column              DOCK, 390 × 844 coarse (tabs unchanged)
┌ new game ──────────────────────┐          ┌ new game ─────────────────────────────┐
│                                │          │      size          level              │
│ size                           │          │                   Medium              │
│ 4×4   9×9   16×16              │          │      4×4    9×9    16×16              │
│ ────────────────────────────── │          │ ───────────────────────────────────── │
│ level                          │          │               ⚄                       │
│ Easy   Medium   Hard           │          │              Deal     dealt |卅       │
│ ────────────────────────────── │          └───────────────────────────────────────┘
│ ⚄        dealt |卅             │            verb on the well's spine, receipt in
│ Deal                           │            the right-hand track
└────────────────────────────────┘
```

**Alignment.** The rail is flush-left, and it already is: the h2s and the chip words share one
left ink edge in the census crop `c1`. The dock stays centred, as it is. Each arm keeps its own
axis, so the grammar is the same in both (values on a line, act beside receipt) and only the
alignment follows the arm.

**Principles.**
1. **The tightest step binds a name to its values.** Name→values is 4.00. The compartment's
   tape sits one seam (7.2) above the first question, never closer.
2. **A row that isn't a line has no business being a column.** The line wraps when the column
   can't hold it, and it never stacks one value per line.
3. **Nothing that gets wider on the rail may move the board.** Every new line is contained
   (`contain: inline-size`) so the rail's width is still set by what set it before.
4. **Height is paid back, never spent.** The compartment only shrinks. Every seam, floor and
   rule the estate gates stays.

---

## 3 · Review against the tells and the brief (pass 2): what I changed and why

| plan element | verdict | revision |
|---|---|---|
| heading BESIDE its values on one line (the live zone's phone `zone-row` form) | rejected by arithmetic | "size" h2 ≈ 50 px + 13.6 + the 218.4 size line = 282 > 268.22. It doesn't fit at 1280, let alone at 1024. The heading stays over the line. |
| Deal centred on the well's spine with the receipt in a right track (`1fr auto 1fr`) on every arm | rejected on the coarse rail | The right track is (168 − 56)/2 = 56, less than the tally's 91. It holds on the fine rail and the dock only. The rail takes the flush-left pair and the dock takes the spine form (§4.3). |
| turn the rail's groups into tabs (the dock's arm) | rejected | Tabs hide one axis and make a level change two presses (PB §1b). The rail has room, and the mark is about wasting room, not about lacking it. |
| a size × level matrix of nine cells | rejected | It's clever rather than plain. The latin band has four sizes, and M16 wants plain controls. |
| justified lines (chips `flex-grow` to fill) | rejected | The scribble underline is `background-position: left bottom` on the content box. A grown chip with centred text would put the underline under nothing. Intrinsic chips keep the drawn mark's geometry byte-for-byte. |
| a new accent, a ground under the selected chip, or a drawn line under each row | rejected | A ground under a bare word would be a fourth hover form (law 14). A drawn line would be a new filter or frame surface (law 9/11/37). The selection keeps its scribble, which is already the house mark. |
| template tells (eyebrow labels, numbered markers, middle-dot meta, `→` on verbs, new cards) | none present | The spec adds no labels and no strings. The only "labels" are the existing tape and h2s. |

After the revisions, the plan's single commitment is geometric: lines instead of columns, and
the act beside its receipt. Everything a generic redesign would reach for (a new heading voice,
a card kit, an accent, a segmented-control pill) stays out, because §10's other families own
the voice and the product already has its marks.

---

## 4 · The spec

### 4.1 `OptionSelector` · the rail arm becomes a LINE

**Today** (`OptionSelector.vue:44`), the non-`mobile`, non-binary arm is
`'flex flex-col items-center md:items-stretch'`, and chips get `md:py-0.5 md:text-left`.

**Spec.** The arm is replaced by one class, `.options-line`:

```css
.options-line {
  display: flex;
  flex-wrap: wrap;            /* a line that doesn't fit wraps; it never becomes a column */
  justify-content: flex-start;/* flush-left with the heading's first letter */
  contain: inline-size;       /* contributes 0 to the rail's max-content: the board can't walk */
}
```

- The seam is unchanged: `.ctrl-options { gap: 0.45rem }` (7.2 px), which now applies on both
  axes of a line (between neighbours, and between wrapped lines).
- Chips keep `px-3` (12 px), `md:py-0.5` (38 px tall on a fine pointer), `text-left`, the
  `(n+1)ch` scribble underline, and the ghost underline under `(hover: hover)`. Their box
  becomes intrinsic: word + 24 px.
- `md:items-stretch` goes: a stretched chip in a row has no meaning.
- `.options-pair` (the binary) and `.options-row` (the phone/deck arm) are **untouched**. A
  binary is still a pair (T4-P1), and the phone is π.
- Stretch alignment from the parent (`.staged-section` is `md:items-stretch`,
  `.zone-row-stacked` is `align-items: stretch`) gives the contained line the column's full
  width, and it wraps against that width.

**Line-fit table (arith: chip = word + 24, seam 7.2; the words are the census's measured text
widths):**

| band | one-line width | fine rail 259.59 → 283.69 | coarse rail 168 |
|---|---|---|---|
| size `4×4 9×9 16×16` | 218.4 | one line at every rung (≥41 spare) | [4×4 9×9] [16×16]: 2 lines (HEAD 3) |
| level `Easy Medium Hard` | 254.4 | one line (5.19 spare at 1024, 13.82 at 1280) | 3 lines: 72 + 7.2 + 96 = 175.2 > 168 (**unchanged, a gap**) |
| latin `4×4 5×5 6×6 7×7` | 261.6 | **wraps 3+1 at 1024 (−2.01)**, one line from 1280 (+6.62) | [4×4 5×5] [6×6 7×7] |
| caged latin `4×4 5×5 6×6` | 194.4 | one line | [4×4 5×5] [6×6] |
| checking `Off Ask Live` (live zone) | 206.4 | one line | [Off Ask] [Live] |
| marks `Normal Corner Center` (live zone) | 302.4 | **wraps 2+1 at every rung** (the orphan `Center`) | 3 lines (unchanged) |

**States** (all existing, and none restyled):
- rest: quiet ink.
- selected: bold + ink or tier crayon + scribble underline, with `aria-pressed="true"`.
- hover (fine, `(hover: hover)`): the ghost underline, or the selected underline redraws one
  boil step on.
- focus: the estate's visible ring (law 39).
- disabled: none today.
- wrapped: the second line starts at the same left x as the first (principle 1's flush-left
  edge).

**Scope. Two arms, and the chair or owner picks one:**
- **ARM A (this spec's pick): component-wide.** The stale premise is the component's. Leaving
  the column arm on the pencils and checking wells keeps two rail grammars in one case, which
  is the M05 disease the §10 fold exists to cure ("desktop and mobile the same grammar",
  W7 §10). It's a **declared DELTA** on two wells the mark doesn't name: `checking` 128.4 →
  38.0 and `marks` 128.4 → 83.2 at the fine rail **(arith)**. Both need before/after frames for
  the owner.
- **ARM B (the π fallback):** the same `.options-line`, reached through one boolean prop
  (`line`) that only the staged zone passes. The live wells stay byte-identical. If the owner
  takes the whole case at the re-look, the prop dies at the fold.

### 4.2 The staged section · rhythm

- The first `.staged-section` gets `margin-top: 0.3125rem` (5.01 px), so the gap from the
  tape's bottom to the `size` h2's top reads **≥ 7.0** (one seam; HEAD 2.19, PB §1a).
- No custom property is minted. It's a single declaration with its reason, because a token
  with one consumer is ceremony.
- The tape's own three terms (`--washi-tag-lift` 3px, `--washi-tag-gap` 0px on this well,
  `--washi-tag-inset`) are untouched. The air is taken below the tape, inside the section, so
  the tape lane's law (the tape's box ends 3 px above the content edge) still holds by the
  same arithmetic.
- h2 → first chip stays **4.00** (`gap-1`), still the tightest step, binding name to values.
- The rule between sections is unchanged: 1.5 px declared (painting 1.00) with 0.85rem of air
  each side. Its AA is CTRL-RULE's row.

**The ladder after the cure:** 4.00 (name→values) < 7.2 (seam = tape→first name) < 13.6 (rule
air). A name is never closer to another name than to its own values.

### 4.3 The deal row · the act beside its receipt

**Today** (`.deal-row`, `:1867`) it's a one-column grid: verb in row 1, tally in row 2
(`grid-area: 2 / 1`).

**Spec, the rail arm (flush-left, like the lines above it):**

```css
.deal-row {
  display: flex;
  flex-wrap: wrap;               /* on a column too narrow for the pair, the receipt drops beneath: today's pose, not an overflow */
  align-items: last baseline;    /* the `Deal` sublabel and the `dealt` word share a baseline */
  column-gap: 0.85rem;           /* the rule air: an existing step, not a new number */
  row-gap: 0.15rem;              /* the receipt's existing margin-top, if it wraps */
  contain: inline-size;          /* the pair adds nothing to the rail's max-content */
  /* margin-top / padding-top / border-top: unchanged */
}
```

Fit (arith): fine rail, verb ≤ 72 + 13.6 + tally 91 = ≤ 176.6 against 259.59 at 1024, so ≥ 83
spare. On the coarse rail it holds only if the coarse verb is ≤ 63.4 wide (168 − 13.6 − 91).
The dock measures 56, but the coarse RAIL verb is unmeasured, so the pair either fits with
7.4 spare or wraps to today's pose. That's a gap to read, not a claim.

**Spec, the dock arm (centred, `.mobile-control-panel .deal-row`):**

```css
.mobile-control-panel .deal-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* the verb stays on the well's spine */
  column-gap: 0.85rem;
  align-items: last baseline;
  contain: inline-size;                /* cures the exact mirroring that killed this form at mark 6 */
}
.mobile-control-panel .deal-row > .deal-btn        { grid-column: 2; }
.mobile-control-panel .deal-row > .difficulty-tally { grid-column: 3; justify-self: start; }
```

Fit (arith): right track = (content − 56 − 27.2)/2, which is **137.4 at 390** and **102.4 at
320**, both ≥ the tally's 91. The dock card is full-bleed, so containment there is insurance,
not a cure.

**States:**
- rest: die + `Deal`, receipt beside.
- armed: `sure?` (the sublabel swaps in place; the receipt doesn't move, because it has its own
  track).
- pending: `ScribbleLoader` at 30 px in the verb's box.
- dealing: the die animates, unchanged.
- no receipt yet (`gradeTally` null): the verb alone. On the dock it stays on the spine; on the
  rail it sits at the left edge.
- DOM order stays verb, then receipt, which matches the reading order and the focus order.

The hazard class the T6 comment retired ("no growth of either box can occlude the other")
**stays retired**: they sit in separate tracks and can't overlap. The row is re-aimed in §6 G8.

### 4.4 What the owner sees, per arm (heights arith unless marked)

| cell | HEAD (measured, PB) | spec |
|---|---|---|
| 1280×800 fine · zone | **503.19** | **294.66**: size 163.44→73.06, level 178.03→87.66, deal 120.17→87.38, air +5.01. The 32.79 the deal row returns is exactly T6 mark 8's own +32.79. |
| 1280×800 fine · card scrollH | **1142** | ~933.5 (ARM B) · ~797.9 (ARM A, checking −90.4, marks −45.2) |
| 1280×800 fine · Deal, scrollTop 0 | 560.47–633.27, under the fade (fade top 595.64) | ≈ 384.7–457.5, 138 px clear of the fade |
| 1280×800 fine · `pencils` tape at scrollTop 0 | not painted (R6 census §3.2: 1 of 4 tapes painted) | expected painted: the zone bottom ≈ 460.7 plus the divider and margin puts the tape near 500, above the fade (gate G3, not claimed) |
| 1280×800 coarse · zone | **532.78** | ≈ 486.6 without the pair (size −51.2, air +5.01); ≈ 454.9 if the coarse pair fits |
| 390×844 coarse (dock) · zone | **241.73** | ≈ 208.95 (deal 117.77 → 84.99) |
| 390×844 · case scrollH vs clientH | 699 / 628 (71 under) | ≈ 666 / 628 (**38 still under: a gap**) |
| 430×932 · case | no overflow | no overflow |
| < 1024 tabs, chip row, tape, bar | as PB §1b | **π** (only the deal row moves: a declared DELTA) |
| rail card WIDTH, board rect | as PB §1a | **π by construction** (containment), gated G4 |

**Light and dark.** The census found themes never moved a geometry number (PB §0), and this
spec moves no colour. Both themes get the same geometry and the same tokens. AA is a floor
re-read from painted bytes (G11), because the census read computed colours only (PB §4).

**Phone and desktop.** The desk rail (≥1024, fine and coarse) is the mark's surface. The dock
(<1024 portrait) and the landscape stacked card keep their tab arm and chip row, and change
only the deal row.

### 4.5 Copy (M16)

**No string changes.** `new game`, `size`, `level`, the values, `Deal`, `sure?` and `dealt`
all stay as they are. `check-copy-register` stays bare at 0. No new glyph enters any woff2
subset (law 30), so there's no ransom-note risk. The one comment sentence that dies is source,
not product: `OptionSelector.vue:175`'s "The rail is a 165px column". It's re-derived in the
same commit with the six measured widths.

### 4.6 Motion

**None is added.** M09 asks for defined motion where motion exists, and this surface's only
motion is already defined or already law:
- **Selection:** the scribble underline swaps pose with no tween (0 ms). That's the pose-swap
  grammar at `OptionSelector.vue` §"THE ROW ANSWERS AS ONE".
- **Chip ink lift on hover:** the existing `transition-colors duration-150` (Tailwind's default
  curve). It's a pre-existing literal outside `MOTION`, and this group doesn't re-time or
  re-home it. **Home:** the hover-ink rung of MOT-LADDER's ladder when that lands (the
  ladder's row, the undefined-token census's row, MOT-VERB). No new literal is minted.
- **A band switch or wrap change** (a game with four sizes, or the width crossing a fit
  threshold) is a **cut**, in full motion and under PRM alike. A height tween of a
  compartment inside a scrollport would drag the sticky tape and the bar's fade through
  layout on every frame. M09: no cure buys speed with quality, and none buys motion with
  layout churn either.
- **The drawer** keeps `MOTION.curves.drawerGlide` `cubic-bezier(0.32, 0.72, 0, 1)` @ 520 ms
  (R6 law 1). It's untouched and not re-timed. The dock's re-budgeted deal row changes the
  sheet's content height, not its pose. The ~700 ms settle still governs every coarse read.

---

## 5 · What DIES

1. `OptionSelector.vue:44`'s column arm (`'flex flex-col items-center md:items-stretch'`) and
   the chip's `md:items-stretch` premise. The rail has **zero** `flex-col` option groups (ARM
   A) or zero in the staged zone (ARM B).
2. The sentence "The rail is a 165px column" (`:175`), re-derived with the six measured widths.
3. `.deal-row > .difficulty-tally { grid-area: 2 / 1 }` and the "TWO ROWS, ONE AXIS"
   conclusion (`:1841-1856`). Its history keeps one line: the shared cell was cramped and the
   `1fr` mirroring walked the board. Its cure is written: separate tracks plus containment.
4. `visual-regression` test 8b's VERTICAL clearance read, re-aimed horizontally (G8). The
   comment at `:574` already tells the story of the last re-aim; this is the third, and it's
   written the same way.
5. The iPad coarse `SEAL = 1227.5` (`visual-regression.spec.ts`, the panelH ceiling) is
   **re-stamped downward** to the new reading plus the file's own engine slack. A ceiling left
   ~100 px above the card would green on any later drift. That file's own discipline is named,
   measured and ablated.

Nothing else dies. No component, token, tape, rule, tab or string goes.

---

## 6 · Gates (born-RED where the mark is measurable; guards carry a plant)

Instrument: rows in `e2e/zone-grammar.spec.ts` (+ the two re-aimed rows in
`visual-regression.spec.ts`), **both projects** (chromium + webkit), both `colorScheme`s.

- Settle: the card rect agrees across 3 polls ≥ 120 ms apart. The dock sheet slides, so its
  pose is polled to settle (~700 ms), never slept.
- Coarse rows run in a context with `hasTouch: true` and read `matchMedia('(pointer: coarse)')`
  true in-page before any number is taken (the witnessed regime).
- The futoshiki route supplies the latin band.
- Any "same board" pair uses an ENCODED `?board=` payload minted with `persistence.ts:190-201`
  (the chair's 2026-09-19 addendum).

| id | reads | HEAD | spec | plant / negative control |
|---|---|---|---|---|
| **G1** one question, one line | distinct chip-top values per staged group at fine 1024/1280/1366/1440/1512/1728 (size, level; caged-latin; latin from 1280) | **RED**: 3 / 3 / 4 lines | 1 line each; latin at 1024 = 2 lines, named | re-inject `flex-direction: column` on the group: it must red |
| **G2** Deal in view | at 1280×800 fine, scrollTop 0: Deal's bottom ≤ bar top − 32 (the fade) | **RED**: 633.27 vs 595.64 | ≈ 457.5 | add 200 px of margin to the zone: it must red |
| **G3** the next compartment in view | `pencils` tape computed opacity 1 and not `data-under-bar` at 1280×800 fine, scrollTop 0 | **RED** (R6 §3.2) | expected green | the same 200 px plant |
| **G4** the board doesn't walk | rail card width and board rect vs the HEAD control at the six fine rungs, plus 1280×800 and 1366×1024 coarse: \|Δ\| ≤ 0.01 | guard (green) | green | strip `contain: inline-size` from `.options-line` and `.deal-row`: the coarse rail must widen and red |
| **G5** flush-left | the first chip's word ink left = its h2's ink left ± 1 px, and every wrapped line starts at the first line's x ± 0.5 | guard | green | `justify-content: center` on the line must red |
| **G6** M01 floor | coarse rail chips ≥ 44 × 44 in both dimensions; fine chips ≥ 24 × 24 (WCAG 2.5.8) | guard | green | strip the shared `min-width`/`min-height` first (the pair-branch row's method) |
| **G7** separation | extend "option chips keep their separation" to the line: horizontal seam ≥ 6 between line neighbours and vertical ≥ 6 between wrapped lines | guard (column axis today) | green, 7.2 | the file's own injected zero-gap control |
| **G8** act beside receipt | Deal sublabel baseline vs `dealt` baseline \|Δ\| ≤ 1; horizontal clearance verb↔receipt ≥ 0; dock: \|verb centre − well centre\| ≤ 0.5 | **RED**: the receipt is one row down (baseline Δ ≈ 32) | green | grow the verb by 120 px on hover: the clearance must red (it can't overlap by construction, so the control checks the READ, not the layout) |
| **G9** rhythm | tape bottom → first h2 top ≥ 7.0; h2 → first chip = 4.00 ± 0.3 | **RED**: 2.19 | ≈ 7.2 | drop the margin: it must red |
| **G10** π elsewhere | computed paint properties + tags + rects vs HEAD for the gallery `StagingBand`, the tabs, the phone chip row, the tape, the bar, the players well, and (ARM B) pencils + checking; goldens 4/4 unmoved except the declared DELTA crops; `filterBudget` 9 exact; union raster area ±2 % unmoved | guard | green | the existing census controls |
| **G11** AA from painted bytes | unselected chip ink vs card, the `dealt` word, and the `Deal` sublabel, both themes, off a screenshot's median ink mass | unread (PB §4) | ≥ 4.5 : 1 | a 40 % ink plant must red |
| **G12** copy and faces | `check-copy-register` bare = 0; font subset letter sets unchanged | green | green | the gate's own self-test |
| **G13** the seal | iPad coarse panelH re-stamped to the new reading + engine slack; the ablation control still breaks it | 1227.5 ceiling | re-stamped | the file's negative control |

Also in the battery, bare and never piped into `tail`: `lint:motion`,
`ledger-diff --verify-cites`, `npm audit` high+, vue-tsc, and the unit suite ("Tests", not
"Test Files").

---

## 7 · Couplings (read before the fold)

- **CTRL-FACE (§10 leader, 84 at pass 4).** The face law may re-face the chip words (its
  README puts every value in the hand). If it does, the line widths change, and G1 and G4 read
  measured lines rather than this file's constants, so they survive either face. The `(n+1)ch`
  underline is the chip's and the face law's joint row.
- **CTRL-TAPE.** The tape's lift/gap/inset terms and the `@property` block. §4.2 takes its air
  below the tape so the lane law's arithmetic still holds. G9 reads tape→h2, never the tape's
  own terms.
- **CTRL-RULE.** The 1.5 px rule's AA (1.638/1.651 light, the 1.4.11 row) is theirs and is
  untouched here.
- **CTRL-TABS (blocked at 55).** Nothing below 1024 moves except `.deal-row`, and the tab arm
  is π.
- **M18 / T9-B8 (the bar moves to `#card-foot` by default).** G2's reference line is "the
  bar's top − its fade" on whichever pose lands. If the foot pose moves the scrollport's
  bottom, G2 re-reads against it and doesn't re-price.
- **`visual-regression` test 10.** The iPad coarse 0.23 px headroom and the panelH seal: this
  spec only lowers panelH (G13 re-stamps it).
- **The owner's ~369 px card** (PB §4) doesn't reproduce. If the owner's rail really is
  ~30 px wider, every line fits with more room, and the latin band fits at 1024.

---

## 8 · Risks, stated against interest

- **The fine hit box shrinks.** On the fine rail a chip goes from 268.22×38 (a full-width row)
  to 60–96×38. The ink and the 20 px word are unchanged, the box stays ≥ 1.5× the word and
  ≥ 24×24, and M01's floor is a coarse law. But M01 is the owner's "larger targets", and the
  owner reads it at the re-look.
- **The coarse rail is only half cured.** The level band stays one per line on the 168 column,
  so the coarse zone drops 9–15 %, against 41 % on the fine rail. The column is an accident of
  which children mount. Widening it moves the board and the iPad seal, which is a larger move
  than this mark asks for.
- **ARM A adds an orphan.** `Center` alone on the second marks line, at every rail rung. It's
  still one line shorter than today, and it's owner-framed.
- **The latin band wraps 3+1 at 1024 fine** (−2.01 px).
- **This reverses a T6 mark-8 layout decision** (receipt beneath the verb). The reasons it
  cites (the shared cell, `1fr` mirroring walking the board 3.45 px) are answered by separate
  tracks plus containment. It's still decided history, and the chair books the row.
- **Two engine features are unwitnessed on this surface.** `align-items: last baseline` in
  flex/grid, and `contain: inline-size` on WebKit. The latter is witnessed only by CTRL-TABS's
  pass-3 tree (critic-reproduced). G8 and G4 read both engines, or the arm doesn't fold.
- **The phone case still overflows** by about 38 px at 390×844 after the deal row is
  re-budgeted.

---

## 9 · Pass-5 charter rows (the owning families; U-10: the owner disposes)

1. **§10 leader (CTRL-FACE) · M17 rail · the line arm.** Land `.options-line` (§4.1) as ARM A
   with ARM B's prop built and framed beside it. Deliver G1, G4, G5, G6, G7 and G10 on both
   engines, and re-derive `OptionSelector.vue:175`. Four crops (≤150 KB each; engine · theme ·
   viewport · pointer named): m17's pose before/after at chromium · light · 1280×800 · fine,
   and the ARM A live-well DELTA at webkit · dark · 1280×800 · fine.
2. **§10 leader · M17 rhythm.** §4.2's single declaration plus G9.
3. **§10 leader · M17 deal row, both arms.** §4.3, G8's re-aim of test 8b, G13's re-stamp,
   and the chair's booking of the T6-mark-8 reversal.
4. **§10 leader · M17 dock.** The dock deal-row DELTA crop at webkit · light · 390×844 ·
   coarse, the case overflow read at 390/430 (the remaining ~38 px is named, not cured here),
   and π on the tab arm (G10).
5. **Every §10 lane · AA.** G11 from painted bytes, both themes. It's the census's open gap.
6. **Chair's rows:** book the T6-mark-8 reversal, and rule ARM A vs ARM B for the fold. The
   default leans A (one rail grammar), and both frames go to the owner.

---

## 10 · Gaps (a gap is a gap)

- No prototype, no rendered height: every **(arith)** number is measured parts summed. The
  first prototype's G1–G9 readings replace them.
- The coarse RAIL deal verb's width is unmeasured, so whether the pair fits the 168 column is
  unknown.
- The coarse rail's level band stays one per line.
- The latin band wraps at 1024 fine.
- `Center` is orphaned under ARM A.
- The phone case still overflows by ~38 px.
- `last baseline` and WebKit `contain: inline-size` are unverified on this surface.
- AA hasn't been read from painted bytes by anyone.
- The owner's ~369 px card width is unexplained.
- G3 (the `pencils` tape in view) is expected, not derived: the divider's height wasn't read.
