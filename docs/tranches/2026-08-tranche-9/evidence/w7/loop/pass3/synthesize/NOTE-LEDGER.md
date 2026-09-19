# NOTE-LEDGER · THE LEDGER — pass-3 design spec

T9-W7 §7, the hint note's lifecycle. Synthesized from the pass-3 research
(`../research/NOTE-LEDGER/README.md`, 74a2b5d9, both engines, zero crops), the pass-2 spec and
critique, the chair's rulings (`../CHAIR-RULINGS.md`) and the frontend-design method's two
passes. A spec, not a cut; nothing closes (U-10). Still incompatible with NOTE-ERASE (ageing by
displacement vs ageing by act and clock); the agglomerator decides, not this file.

**What pass 3 changes, in one paragraph.** The aged line lands on R6's ROW CAPTION, not on the
tally: the tally is debug-gated (`GameBoard.vue:915-916`, `useDebug.ts:14`) and needs a completed
solve, so a visitor never sees it, while the row caption (`GameControlPanel.vue:1615-1625`) ships
on every board. That rung is `--type-tag` at leading **1.1**, and the 1.1 is worth 2.79 px of the
berth the family was short in. The record carries its digit (`hint.value`, already at the one call
site), so a fulfilled record AGES and only a falsified one is STRUCK, which is the canonical
loop's cure and the house over-strike's cure in one field. The clearance row is re-written against
the CLASS law (a tape never covers an interactive element, chair §6.1) on the painted ink, and
6.0 px goes to the owner as the family's own ask with its price. The ransom note gets its two
gates. The memorable thing is unchanged: the line you were reading steps down a rung as the new
one writes in above it.

---

## 1 · Tokens (nothing minted; one role consumed, two rungs consumed)

| role | token | light | dark | note |
|---|---|---|---|---|
| paper | `--color-background` | #fbfaf9 | #110f0e | `index.css:134/:363` |
| line one, the voice | `--color-pencil-graphite` at `--type-body` | #262626 · 14.52:1 | #d1cfc7 · 12.25:1 | unchanged |
| line two, the aged record | `--ink-press-quiet` at **`--type-tag`**, leading **1.1** | painted #6a6a6a · **5.19:1** | painted #94928c · **6.14:1** | the row caption's five declarations, `GameControlPanel.vue:1619-1625`; `--type-tag: var(--type-caption)` (`typography.css:123`) so 14 px on every phone rig today |
| grades | `--color-red-ink` / `--color-gold-ink` | #d02a52 / #8c691d | #ff5c7c / #e5c74d | line one only, full pressure; never in line two |
| the push | `--motion-note` (§13's `note` rung) | 250 ms | | WAAPI reads `MOTION.rungs.note`; CSS reads `var(--motion-note)` with NO fallback (chair §6.5) |
| the pushed-off line's exit | `--motion-whisper` (§13's `whisper` rung) | 150 ms | | `ink-rub-out`, shared keyframe with NOTE-ERASE; `var(--motion-whisper)`, no fallback |
| the push curve | `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | | unchanged |
| the exit curve | `--ease-accelIn` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | | the house's accelerate-away |

### 1.1 The role, and the ASK it carries

`--type-tag` is R6 law 27's seam and its comment scopes it to the CONTROLS estate (`row caption ·
closed-tab value · roster`). Seating the margin's aged line on it is right by the idiom census
(the critic measured the pass-2 line landing ON that row: 14 px · 0.35 px · 68 %) and outside the
letter of the law's scope. **ASK to the chair, not assumed:** consume the role (so §10's re-floor
moves this line for free, one right-hand side), or consume the rung `--type-caption` (byte-identical
today, re-floored separately). The spec is written for the role; the fallback is one identifier.

### 1.2 What leading 1.1 buys, and what it must not cost

Patrick Hand at 14 px is a 19 px font box (ascent 15 / descent 4). In an 18.1875 px line box
(leading 1.3) the ink already overhangs by 0.406 each side; in a 15.40 px line box (leading 1.1)
by 1.80 each side, and the rendered descender (`actualDescent` 4.368) reaches 2.168 below the box.

- **Downward** that is the berth: box clearance to `#fold-tools` 20.00 − 15.40 = 4.60 px; painted
  clearance 4.60 − 2.168 = **2.43 px** (was 1.038 at 1.3). Above zero: the class law holds.
- **Upward** the risk is a kiss with line one's descenders. The baseline sits at box top +
  halfLeading + fontAscent = +13.2; the tallest ascender at 14 px is below 15 px of ascent, so
  the ink's top is BELOW the block foot, and line one's `g` reaches ~0.9 px below it. The
  prototype measures ink-to-ink (line one's painted bottom to line two's painted top) and
  reports it; the row is ≥ 0, both engines, both themes.
- **The clip.** Pass 2 gave line two `overflow: hidden` on the desk, which already sliced 0.406 px
  off every descender; at 1.1 it would slice 2.17. The clip is HORIZONTAL only:
  `overflow-x: clip; overflow-y: visible; text-overflow: ellipsis; white-space: nowrap`. Born-RED
  row L15 paints the `g` whole. If webkit refuses `text-overflow` under `overflow-x: clip`, the
  declared fallback is `overflow: hidden; padding-bottom: 0.2em; margin-bottom: -0.2em` (the box
  in flow unchanged, the ink descends into the padding), chosen by L15's own reading, never by eye.

### 1.3 The motion home — nothing minted, and the fallbacks die

The ledger has no clock of its own; it reads two rungs of §13's ladder. Chair §6.5 strikes
`var(--motion-note, 250ms)`: the CSS reads `var(--motion-note)` / `var(--motion-whisper)` bare, the
WAAPI push reads `MOTION.rungs.note`, and the registration is §13's (`@property` with
`initial-value: 0ms` per MOT-LADDER's pass-3 row E, so an absent publisher reads "every rung
instant" and gate L13 reds instead of a fallback masking it). This family's pass-2 publisher copy
and its drift assertion both die (§2.1). The `250ms` literals at `MarginNote.vue:13/:25/:149/:180`
go with them; the count in every touched file is 0.

---

## 2 · Components and states

### 2.1 The model — `GameBoard.vue`: records that carry their referent AND their digit

```ts
type MarginKind = "record" | "grade" | "state" | "empty";
type MarginRecord = {
  text: string; kind: MarginKind; tone: Tone;
  cell?: number; value?: number; because?: number[];   // the hint's own fields, verbatim
};
const marginLive = ref<MarginRecord>({ text: "", kind: "empty", tone: "graphite" });
const marginPrevious = ref<MarginRecord | null>(null);
let writeSeq = 0;                                       // the FLIP key and the stutter guard
function setMargin(text: string, tone: Tone, kind: MarginKind, ref?: Pick<MarginRecord, "cell" | "value" | "because">)
```

**`kind` is REQUIRED.** TS2554 names the twelve call sites (`:723 :733 :747 :750 :764 :774 :778
:785 :816 :839 :840 :956`) and each is a decision: hint → `record` with `{cell, value, because}`;
refusal → `record` (no referent: a given cannot orphan); verdicts and `solved it!` → `grade`;
`still solving…`, `the board is clear`, the fresh-board line → `state`; every `""` → `empty`.
This is NOTE-ERASE's origin seam taken as a SHAPE (a required parameter the compiler enforces),
not as a field: the ledger does not care whose hand wrote the digit.

**The ageing rule, corrected (the critic's two rows, one field):**

| a value lands | predicate | verdict | what paints |
|---|---|---|---|
| on `cell`, equal to `value` | `values[cell] === value` | **FULFILLED → AGE** | the record steps to line two (the push) |
| on `cell`, another digit | `values[cell] && values[cell] !== value` | **FALSIFIED → STRIKE** | line one `""` through the exit |
| in `because` (the house), the SAME digit | `because.some(p => values[p] === value)` | **FALSIFIED → STRIKE** | as above |
| in `because`, any OTHER digit | — | **STANDS** | nothing (pass 2 struck it; the born-RED twin, L11b) |
| anywhere else, by anyone | — | STANDS | nothing |
| a refusal record, any write | — | never struck | nothing |

"Struck" is one verb at either depth: line one → `""` through the exit; line two → removed
through the exit. Line two never climbs back. The watch is one observer over `props.values`, keyed
on the two records' `{cell, because}` sets, running only while a deictic record exists. A write on
the peer wire is the same write (`?wire=local` rows in the brief).

**The stutter, both clauses, unchanged from pass 2:** (a) a record is displaced only by a
DIFFERENT sentence; (b) the column never prints one sentence twice — a new live line equal to line
two drops line two.

The copy arm for the aged line's deixis (`only 9 fits here` with the laminate gone) is U-10 and is
NOT minted here. The two candidates stand as pass 2 priced them (`only 4 fits in row 4 column 7`
172.92 px; `the answer was 4`), with one new fact: the fold's copy gate now names `HOUSE_WORD` as
the margin's own table (`check-copy-register.mjs:374`), so either string clears `lint:copy`'s
lexicon before it is written down.

### 2.2 `MarginNote.vue` — one live region, one plain paragraph, no state attribute on line two

```
<div class="margin-note-block" :class="{ 'is-quiet': quiet, 'has-previous': !!previous }">
  <p class="margin-note" :class="tone" role="status" aria-live="polite" aria-atomic="true">
    <span v-if="text" :key="seq" class="margin-note-ink">…</span>           ← line one, keyed on the write seq
  </p>
  <p v-if="meta" :key="meta" class="margin-note-meta">{{ meta }}</p>           ← the tally (debug), unchanged
  <Transition name="note-previous">
    <p v-if="previous" :key="previous.seq" class="margin-note-previous">{{ previous.text }}</p>
  </Transition>                                                               ← line two: the row-caption rung
</div>
```

Line two carries **no `data-*` attribute, ever** — its state is its element. That is the (0,1,0)
audit (NOTE-ERASE's critic) closed by construction: `.note-previous-leave-active` (0,1,0) has no
competing attribute rule on the node, and L17 asserts it by reading computed `animation-name`
DURING the leave, not off the stylesheet. No `aria-hidden`, no `role`, no `user-select: none`
(pass 2's a11y row stands: one `status`, line two a `paragraph`).

| state | what paints | motion |
|---|---|---|
| **one line** | today's strip | the write-in on `var(--motion-note)` |
| **two lines** | line one at body, full; line two at the row-caption rung, quiet, graphite, no star, no tone class | — |
| **the push** | line two takes the outgoing text; line one writes the new | WAAPI FLIP from line one's rect: `translate` + `scale(1.143→1)` at 390 / `1.294→1` at 1280 (the body/tag ratio, READ OFF THE TWO ELEMENTS at runtime, never a literal), colour full → quiet on the same clock, `MOTION.rungs.note` on `--ease-noteWrite`, `fill: "backwards"` (law 6), `transform: none` at rest |
| **a third record / a strike at depth two** | the old line two leaves | `.note-previous-leave-active { position: absolute; animation: ink-rub-out var(--motion-whisper) var(--ease-accelIn), ink-rub-out-fade var(--motion-whisper) var(--ease-accelIn) }` + **`.note-previous-leave-to { clip-path: inset(0 100% 0 0); opacity: 0 }`** (the house idiom: every `<Transition>` in `src/` names its `-to`; the rest pose is where the keyframe ends, `index.css:985-990`), no fill (as `bloom-out`), node removed by Vue on the animation clock |
| **a strike at depth one** | line one `""` through the same exit (NOTE-ERASE's `.note-leave-*` shape if it lands; this family's own if not — one rule, one home) | as above |
| **a grade arrives** | line two takes the record; line one the grade | the push |
| **a grade leaves** | line one `""`, line two stays; `min-height: 1.3em` holds the geometry | none |
| **deal / solve** | both `""` | none |
| **error card mounted** | line two `display: none` for the card's life (they share 14.41 px at 390; the card is assertive) | — |
| **quiet** (celebration) | voice sr-only; line two `display: none` (a guard; a solve empties the column) | — |
| **PRM** | same layout | push 0 ms, one frame (WAAPI reads `matchMedia`); the leave `animation: none` **at the site**, in the three shipped `<Transition>`s' shape (`App.vue:1141-1153`, `GameGallery.vue:1471-1494`), so `index.css:1157-1171` is untouched — line two has no CSS write-in to name there |

### 2.3 The berth — one law, two berths, landscape depth one

| regime | where line two sits | pass-3 numbers (74a2b5d9, both engines) |
|---|---|---|
| **in-flow strip** (portrait <1024) | absolute inside the block: `top: 100%; left: 0; max-width: 100%; width: fit-content`, one row-caption line box **15.40 px**; `overflow-x: clip; overflow-y: visible; text-overflow: ellipsis; white-space: nowrap` | board `y` invariant at depth 0/1/2 (180.31 · 221.73 · 147.73 · 131.73 chromium); box clearance to `#fold-tools` **4.60 px**, painted **2.43 px**; `scrollHeight` = viewport height |
| **overlay strip** (≥1024) | in the block's flex row after the tally: `flex: 1 1 0; min-width: 0` + the same clip pair; the block keeps `flex-wrap: wrap` | the strip OVERLAYS (`position: absolute; z-index: 50`): a wrap at 1024 lands a second row 9.28 px inside `button.ctrl-btn` (8.27 px below the foot). **No CSS minimum ever** — the readable-width floor is a GATE (L14) on the used width |
| **landscape <1024** (844×390, 900×500) | **depth one** | 844×390: nothing painted below the strip, the page scrolls 410 in 390, the card is reached through the `.drawer-tab` (48×92 at 597,167) — chair §6.2 governs, a reading not a red; 900×500: nearest box is the parked `#controls-drawer` at the fold line, 16.73 / 17.34 px. Pass 2's 8.71 / 45.92 do NOT reproduce on this base and are struck |

### 2.4 The clearance row, re-written against the class law — and the ask

W2 §2.5 / chair §6.1: *a tape never covers an interactive element*. The row is written on the
PAINTED ink with its reference line declared: `inkBottom = lineBoxTop + halfLeading + fontAscent +
actualDescent(rendered string)`, cross-checked by a pixel scan for the last inked row under the
line box; read once in both engines on four phone rigs; **red if inkBottom ≥ the top of the first
painted interactive box below the strip** (found by sweep; `#fold-tools` today).

6.0 px is the family's own charter number and carries no owner's mark. It is carried as an ASK,
priced on the measured 20.00 (`scene.css:404`, `.app-layout { gap: 1.25rem }`, W2's pose):

| arm | painted clearance | cost | who |
|---|---|---|---|
| **B** (this spec) leading 1.1 | **2.43** | none | the family |
| A+B gap 1.4375rem + leading 1.1 | 6.03 | 3 px of page at 390×664 | W2's row, the owner |
| A alone gap 1.5625rem | 6.04 | 5 px of page | W2's row, the owner |

The prototype builds B and frames A+B once (one crop, both arms side by side at 390×664) so the
owner disposes on a picture, not a number.

### 2.5 The ransom note — a wave row this family gates and cannot cure

The hand's cut is 46 codepoints; its only capitals are C, R, S; there is no `x`. The margin's
vocabulary needs eight more: `x` (`HOUSE_WORD.box`, on every 9×9 box arm), A B D E F G (16×16), `·`
(the tally). Live at HEAD on a 16×16 the first hint reads `only E fits here` in a mixed face. The
ledger doubles that dwell time (the aged line keeps the vocabulary on screen a second line). Three
cures; this family lands the two the estate has already built the shape for:

1. **`e2e/font-census.spec.ts` gains one act per cell**: one keypress arms a hint in each existing
   CELL, the row keyed like `CAGE_LABEL` / `ledgerKey` (`:120-125`) because the digit is per-deal.
2. **`scripts/check-font-coverage.mjs` gains a `marginRecordCopy` EXTRACT** in B1b's own template
   (`:117-131`): derive from `HOUSE_WORD` + `formatHintNote`'s static segments + `glyphRegistry`'s
   display chars, declare the group.
3. **The re-cut** (46 → 53, ≈ +656 B on this file's own 93.7 B/codepoint; an ESTIMATE, the source
   TTF is not in the repo) — R6 law 30's owner-declined cost, U-10.

Both gates are born RED today. They land GREEN with an **admission ledger** in the copy gate's own
closed-both-ways shape: the eight codepoints admitted by name against ballot "the hand's cut"; a
re-cut that lands makes every admission stale and reds the gate the other way. The owner sees the
eight and the byte estimate in one row.

---

## 3 · Desktop and mobile, light and dark

| | 390×844 phone | 1280×800 desk |
|---|---|---|
| line one | 16 px body, 20.80 line, full graphite | 18.18 px, 23.63 line |
| line two | **14 px tag, 15.40 line** (was 18.19), quiet, same left edge | 14.05 px, same baseline row, after the tally, quiet |
| board y | 221.73 / 221.42 at depth 0, 1, 2 | 124.45 / 124.16 invariant |
| clearance | box 4.60, **painted 2.43** (≥ 0 the law; 6.0 the ask) | `scrollHeight` 800 → 800 |
| dock sheet open | covers the strip whole; settle ~700 ms before measuring; the ledger is read with the sheet shut | n/a |

Light and dark differ only in the token arms; line two 5.19 / 6.14 by the critic's own compositing;
no star ever sits in line two, so painted and arithmetic agree.

## 4 · Copy

No string is minted, moved or re-rendered. `lint:copy` does not move. The ellipsis at either berth
is U+2026, already cut. The copy arm is U-10 (§2.1).

## 5 · What this family does not do

No clock, no dismiss control, no new rung, no fill admission, no filter, no chromatic token, no
layout box in flow, no mechanic on W2's strip pose (the 3–5 px is an ASK, not a cut).

---

## PLAN — files, order, what dies

1. `src/assets/index.css` — `@keyframes ink-rub-out` + `ink-rub-out-fade` beside `ink-write-in`
   (`:1115`) if NOTE-ERASE has not landed them (one pair, shared). The PRM block (`:1157-1171`)
   is NOT edited.
2. `src/pencil/chrome/MarginNote.vue` — `previous: MarginRecord | null` and `seq` props; line one
   keyed on `seq`; `.margin-note-previous` as the row caption's five declarations (comment names
   `GameControlPanel.vue .zone-row-label` as the rule it mirrors), `--type-tag` (or `--type-caption`
   on the chair's word), `line-height: 1.1`; the two berths under the strip's own breakpoints; the
   horizontal-only clip pair; `<Transition name="note-previous">` with `-leave-active` (absolute,
   the rub-out on `var(--motion-whisper)`, no fill) and **`-leave-to`**; the site PRM arm; the FLIP
   via `el.animate` reading the scale off the two elements; the four `250ms` literals → bare
   `var(--motion-note)` and comments naming the rung.
3. `src/games/shared/GameBoard.vue` — `MarginRecord` with `kind` REQUIRED and `{cell, value,
   because}`; `writeSeq`; both stutter clauses; the values watch with the fulfil/falsify split;
   the hint and refusal falsy arms keep their flags and lose their `setMargin("")`; deal and solve
   empty both lines; `:previous` and `:seq` passed; `hidePrevious` while `showErrorNote`. The
   fold's hunks (`:470-520`, the attribution tape) are untouched by construction.
4. `src/games/shared/GameBoard.receipt.test.ts` — the rows in L8, L9, L11, L11b, L12;
   `GameBoard.notes.test.ts` — replayed ON TOP of B1b's four sentences and two `solver` guards.
5. `scripts/check-ink-pressure.mjs` — `gateNote` ONCE (§2.3): `--ink-press-quiet` on
   `--color-background` ≥ 4.5 both themes, consumers `.margin-note-previous` (this family) and
   `.margin-note-ink[data-note-age="settled"]` (NOTE-ERASE's string, handed over), floor = the
   build's own discovered count, NOTE-ERASE's two self-test cases folded in; NOT a seventh SHIP4 row.
6. `scripts/check-font-coverage.mjs` — the `marginRecordCopy` EXTRACT + group + admission ledger;
   `e2e/font-census.spec.ts` — the armed-hint act per CELL, keyed.
7. `src/pencil/config/pencilConfig.ts` — UNTOUCHED (the rungs are §13's).
8. `src/games/shared/useGameState.ts` — UNTOUCHED.

Dies: the retraction of a record on a write ELSEWHERE; the strike on fulfilment; the house
over-strike; the tally as the tier's justification; `has-previous { flex-wrap: nowrap }`;
`overflow: hidden` on line two; the four `250ms` literals AND their byte-equal fallbacks; this
family's `MOTION.rungs` copy, its publisher and its drift assertion; `aria-hidden` /
`user-select: none` on line two.

Order once: step 2's berth CSS with step 3's `previous` in one commit (L3); step 1's keyframe
with step 2's leave class (or the exit is a cut); step 5's gate with step 2's consumer string.

Re-measure the day §10's type scale lands: `--type-tag` is a role §10 re-floors; one px on it costs
~12 px of ink on the longest record and 1.1 px of berth.

## PROTOTYPE BRIEF — the smallest runnable build on the real surface

Build steps 1–6 on the pass-2 worktree replayed onto `74a2b5d9` (`GameBoard.notes.test.ts` is the
one collision; resolve toward B1b's sentences; name the hunk). Dev server from `web/frontend`:
`npx vite --config <evidence dir>/probe/vite.scratch.mjs --host 127.0.0.1 --port 4249 --strictPort`
(two-line config importing the worktree's `vite.config.ts` with a private `cacheDir`); the HEAD
control on the next free port in 4230–4249, named `74a2b5d9` in every π row. Probes import
playwright by absolute path from `node_modules` (the research's pattern, no scratch PW config).
chromium + webkit; 360×740 coarse, 390×844, 393×699, 390×664, 844×390, 900×500, 1024×768,
1280×800; light and dark; PRM off and on. Kill both servers; `lsof -ti :4249` reads empty.

**Crops (≤4, ≤150 KB, only where a number cannot say it):**
1. 390×844 **webkit** dark: a REAL graphite hint on line one, the fulfilled record on line two
   (charter row 9's re-shoot: no DOM overwrite; the pressure step and the size step in one frame)
2. 390×664 light: arm B beside arm A+B, the ribbon in frame (the owner's clearance ballot)
3. 360×740 coarse dark: the longest 16×16 record on line two at leading 1.1 (the ransom glyph is
   visible and declared)
4. 1280 **webkit** light: the desk pair, real graphite

**Numbers that mean success:**
- board `y` at depth 0/1/2 equals the HEAD control's on every rig, both engines (L3); `scrollHeight`
  unchanged at 1280/1024 with two lines (L4)
- the clearance (L5): painted ink bottom < `#fold-tools` top on four phone rigs, both engines;
  expect **2.43 px**; the reference line declared; A+B priced at 6.03 on the same reading
- ink-to-ink between line one's descender and line two's tallest glyph ≥ 0, reported
- L15: on both berths the `g` of `goes` paints whole (an inked pixel row exists below the line box
  by ≥ 1 px), and a planted 400-px string shows an ellipsis on both engines under `overflow-x: clip`
  (else the declared fallback lands and the row says which)
- L14: at 1024 and 1280 with verdict + the 162 px debug tally + the longest aged line, line two's
  used width ≥ 12 × its measured `1ch` (≈ 76.7 / 79.9 px) while the block is one row tall; the
  block never wraps; nothing paints inside `button.ctrl-btn`
- the push: settled ≤ 250 ms; `fill: "backwards"`; scale read as `bodySize / tagSize` off the two
  elements; `transform: none` at rest; PRM one frame
- the exit: computed `animation-name` on `.margin-note-previous` DURING the leave reads
  `ink-rub-out, ink-rub-out-fade`, `transition-duration` `0s`; the node absent at whisper + 1
  frame; under PRM `animationDuration "0s"` and absent same-frame (the site arm)
- the strike rows (self and `?wire=local` peer): fulfil → line two holds the record; falsify on
  `cell` → `""` within one exit; the SAME digit in the house → `""`; ANOTHER digit in the house →
  stands (L11b, born RED on the pass-2 build); elsewhere → stands; a refusal never struck; the
  canonical loop three rounds deep leaves a two-line column (L1 lived, not staged)
- the ransom: `font-census.spec.ts` with the armed cell reports `U+0078` on a 9×9 box arm (hunt a
  HARD deal; the 16×16 `U+0045` is already on camera) and the admission ledger clears it by name;
  `check-font-coverage.mjs` prints the `marginRecordCopy` group with 8 admitted codepoints
- painted contrast: line two ≥ 4.5 both themes (expect 5.19 / 6.14); line one ≥ 12
- a11y: one `role="status"`; line two a `paragraph` in `ariaSnapshot`; a push changes the region
  once; **no `data-*` on line two** (L17)
- the mechanical estate bare: `vue-tsc` (TS2554 on a bare `setMargin` call, then 0), `lint:ink`,
  `lint:copy`, `lint:motion`, `lint:live-regions`, `vitest run` on the two files, `grep -c 'ms'`
  duration literals in touched files = 0

**Censuses to re-run** (copies with OUT re-pointed into `pass3/prototype/NOTE-LEDGER/`; r0 frozen):
`r3-marks/probe/marks.probe.ts` R3-d (the two-act diff from `pass2/…/instruments/R3-d-MOVED.md`
re-applied in the copy, r0 row reported MOVED with the reading) and `marks2.probe.ts` R3-g;
`wobble.probe.ts` + `budget.probe.ts` (σ and 9 unmoved); `r6-idiom-history/hue-census.mjs` (byte-
identical to `hue-census-HEAD.txt`, the research's control); `r1-controls/probe/heading-voice.spec.ts`
unmoved; `e2e/board-covisibility.spec.ts` re-run; goldens 4/4 OWED at the wave's rebuild (no
`npm run build` on main).

## GATES — born-RED instruments this family lands with

1. **L1 accumulation, lived** — the canonical loop (ask, write the digit named) three rounds deep
   leaves line two holding the previous record. Pass-2 build: **RED** (webkit 3/3 emptied).
2. **L2 the peer row** — a peer's digit elsewhere leaves both lines. HEAD: RED.
3. **L3 the board** — `y` invariant at depth 2, equal to the control's. GREEN out of flow only.
4. **L4 the fold** — `scrollHeight` invariant at 1280 and 1024. RED under an in-flow berth.
5. **L5 the clearance, class law** — three records in, two `<p>` out; painted ink bottom above
   the first interactive box below the strip, both engines, four rigs; reference line declared;
   the 6.0 ask reported beside it. HEAD: n/a; pass-2 build at leading 1.3: 1.038 (green on the
   law, the number the ballot carries).
6. **L6 one region** — one `status`; line two a `paragraph`; a push mutates the region once.
7. **L7 `gateNote`** — ONE row, floor = the build's own count, both families' consumers, the two
   ERASE self-test cases. HEAD: RED.
8. **L8 the caption law** — a deal and the givens twin leave both lines `""`. HEAD: RED.
9. **L9 records only** — a conflict never lands in line two; a solve empties both. Born with the cure.
10. **L10-W the width row** — 99 strings at 360 coarse, red under 10 % headroom. Pass-1: RED 4.99 %.
11. **L11 the strike, split** — falsify on `cell` → struck; the same digit in the house → struck;
    a refusal never struck. HEAD: RED.
    **L11b the true sentence stands** — `values["2"] = 7` against `4 goes nowhere else in this
    row` leaves it; the receipt row re-written born RED against the pass-2 predicate.
12. **L12 the stutter** — both clauses pinned.
13. **L13 the exit and the rung** — a pushed-off or struck line leaves on `ink-rub-out` at
    `var(--motion-whisper)` and is absent at whisper + 1 frame; PRM absent same-frame via the SITE
    arm; **delete §13's publisher → the leave is instant and this row reds** (registration at
    0 ms, MOT-LADDER row E). HEAD: RED (a cut).
14. **L14 the readable floor, as a gate** — used width ≥ 12ch at 1024 and 1280 while the block is
    one row tall; the CSS carries no `min-width`. Pass-2 build: GREEN-by-accident (302/330 px);
    the row now has a floor and a wrap guard.
15. **L15 the descender** — the `g` paints whole under the clip on both berths, both engines.
    Pass-2 build: **RED** (0.406 px sliced on the desk).
16. **L16 the ransom census** — the armed-hint CELL in `font-census.spec.ts` and the
    `marginRecordCopy` group in `check-font-coverage.mjs`, both with the eight-codepoint admission
    ledger closed both ways. HEAD: RED on `U+0078` / RED on "no margin group".
17. **L17 the (0,1,0) audit** — line two carries no `data-*`; computed `animation-name` DURING the
    leave is the rub-out. HEAD: n/a; born with the cure; reds the day anyone adds a state attribute.

Objections carried, not argued in a diff: (1) the strike still retracts the family's own "nothing
an act does wipes a note", now only for a sentence a write made false; (2) the 6.0 floor is the
family's, not the owner's, and it is asked for at 3 px of W2's page; (3) `--type-tag`'s scope is
the chair's to widen; (4) the re-cut is twice declined and this family only doubles the dwell.
