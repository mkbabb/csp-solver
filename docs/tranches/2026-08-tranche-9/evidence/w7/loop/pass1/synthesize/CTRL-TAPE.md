# T9-W7 · pass 1 · SYNTHESIZE · CTRL-TAPE — the taped case

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13
Synthesizer: Fable 5.1. Read-only on the product. Inputs: the pass-1 research record
(`../research/CTRL-TAPE/README.md` + `readings-digest.json`), the r0 censuses (R1, R6, R7),
the owner's four frames, `T9-W7-design.md`, the charter. Nothing closes here (U-10).

Verdict carried in: DEVELOP, with the iPad seal, the bar's burial and the portrait quick set
adjusted. This document is the design spec that spends those three adjustments.

---

## 0 · The design plan, then the tell review (the skill's two passes)

**Subject.** A pencil case. The controls card already IS one: a drawn case at stroke 3, drawn
compartments at 1.5, a tongue at 2.5, torn paper tape naming each compartment. The family's
whole move is to stop pretending the tape is a footnote and let it be the name.

**Tokens (base palette, both arms; every hex derives from a token already in `index.css`).**

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | `hsl(48 12% 99%)` ≈ #FDFDFB | `hsl(24 6% 7%)` = #131211 | the case's paper |
| `--color-foreground` | `hsl(0 0% 3.9%)` = #0A0A0A | `hsl(48 10% 92%)` ≈ #EDEBE7 | every name, every pressed word |
| `--color-muted-foreground` | #737373 (4.66:1 on card) | ≈ #A8A69F (7.69:1) | the quiet rung: verbs, lifted words |
| `--sheet-washi-neutral` | fg 6% into `hsl(0 0% 100%/.82)` | fg 6% into `hsl(24 5% 21%/.92)` | the tape's paper (law 17, never a hue) |
| `--ink-press-rule` | graphite 55% ≈ #8A8A89 on card | ≈ #7C7A75 | drawn edges the eye should not count |
| `--color-red-ink` | #D02A52 (4.99:1) | #FF5C7C (6.39:1) | the one loud word: `sure?` |

No new hex. The family adds ONE type role and ZERO colour tokens.

**Type.** Two faces, clearly distinct, as the estate already has them: Patrick Hand for
everything a hand wrote on the case (all eight names, verbs, sublabels, tally), Fira Code for
the option chips (the printed choices). Fraunces leaves the card entirely and goes back to the
masthead where it is the wordmark's voice. The ladder: names at φ (`--type-heading`
1.618rem = 25.888px, a fixed identity per law 26), chips at `--type-option` 20px, verbs at
`--type-verb`. Ratio name:chip = 1.2945 at every width by construction.

**Layout (one sentence).** The card is a stack of drawn compartments; a compartment's name is
a tape stuck ASTRIDE its top edge, a row's name is the same tape lying FLAT inside it one
gutter further in; the bar is a fifth compartment at the foot. Left-aligned throughout (tapes
at the well's inset; chips centred inside their row as today). No columns.

```
      ┌[ new game ]────────────────────┐   tape astride the 1.5 stroke = GROUP
      │   ▓ size ▓        ▓ level ▓    │   flat, inset one gutter = ROW (the tabs)
      │    4×4    9×9    16×16         │   Fira 20
      │  ──────────────────────────    │   1px row rule
      │            ╔══════╗            │
      │            ║ deal ║  dealt ⊪   │   the ONE boxed thing (pose-0 at 2.5)
      │            ╚══════╝            │
      └────────────────────────────────┘
      ┌[ pencils ]─────────────────────┐
      │     ▓ marks ▓                  │
      │    Normal   Corner   Center    │
      │     ▓ what fits ▓              │
      │    Off   On                    │
      └────────────────────────────────┘
      ┌[ clear  fill  solve  share  i ]┐   the bar = a fifth compartment, 1.5, sticky
```

**Principles.** (1) Rank is WHERE, never WHICH face. (2) One tape tuple for eight names.
(3) The stroke ladder is the whole delineation: 3 · 2.5 · 1.5 · 1. (4) Exactly one boxed
control. (5) The memorable thing is the tape crossing the stroke; everything else is quiet.

**The tell review.** Against the skill's list: (a) "a label above every block" is the
silhouette this family wears. It survives ONLY because the tape is the accessible name
(law 34), it is the house's own object (law 17, `SheetWashiLabel`), and it crosses a drawn
stroke that a generic eyebrow never has; the research measured the ratio (1.2945) and the
compartment (1.5 stroke under every tape). Not revised, but the thinnest point is named in §7.
(b) "warm cream + serif display" is the estate's own soul, not this family's choice; the
family REMOVES the serif from the card. (c) No all-caps (Patrick Hand's cut forbids it),
no middle-dot meta strings, no arrows, no radius-on-everything (0 on anything drawn, 0.5rem
only on invisible hit boxes). (d) Motion: nothing moves that the reader did not press.
One revision from the review: my first plan put the row tape at the group tape's inset; the
research's "ranks are thin" finding (8px and one crossed stroke) made me move the row tape
one option-gutter further in as a second axis. That is the one change and its reason.

---

## 1 · Tokens the family mints or re-points

```css
/* typography.css — THE CONTROL ROLES block (:119-125). One new role; two re-points. */
:root {
  --type-name: var(--type-heading);      /* 1.618rem = 25.888px — every NAME on the case */
  --type-tag:  var(--type-caption);      /* UNCHANGED — the four non-names keep it:
                                            .heading-value .player-row .players-status .players-leave */
  --type-group-title: var(--type-name);  /* the two <h2>s (size, level) join the eight */
}
/* DELETE typography.css:133-137 (the 768 arm of --type-group-title): one rung, every width. */

/* --type-option: the 768–1023 arm (:149-153) 1.375rem → 1.25rem. Reason: 25.888/22 = 1.1767,
   under the law's own 1.23 floor at 900×500; at 20px the ratio is 1.2945 at every cell, and the
   phone already reads 20 (M01 loses nothing). ONE number for the chip. */
```

```css
/* GameControlPanel.vue — the straddle terms (:1484-1512), re-cut for a 25.9px tape */
.control-panel-wrap {
  --washi-tag-lift: 3px;                 /* unchanged */
  --washi-tag-gap: 0.1rem;               /* unchanged */
  --washi-tag-inset: 0.35rem;            /* GROUP tape inset — unchanged */
  --washi-row-inset: calc(0.35rem + var(--option-gutter, 0.75rem)); /* ROW tape: one gutter in */
  --washi-tag-top: calc(0.15rem - var(--card-pad-t, 0px));          /* unchanged */
}
.tray-well { padding: 0.35rem 0.5rem 0.2rem; }   /* was 0.7rem top: the tape now carries its own
                                                    overhang; −5.6px × 4 wells = −22.4px */
```

Radii: **0** on anything drawn (`HandDrawnOutline` frames, the tape's clip-path), **0.5rem** on
invisible hit boxes (`.icon-btn`, `.ctrl-btn`). The five radii collapse to two; `.info-glyph`'s
50% and the tab head's 0 die with their treatments.

Stroke ladder, stated once and unchanged: case **3** · tongue **2.5** · deal box **2.5** · wells
and bar **1.5** · row rule **1px** (`--ink-press-rule`). Z ladder unchanged: content ≤1 < sentinel
30 < pinned tape 35 < hover tape 50 < bar 60.

---

## 2 · Components and states

### 2.1 The name (eight of them, one tuple)

`SheetWashiLabel anchor="tag"` renders **`<h2>`** in place of `<span>` (ROW 2 counts 8 of 8;
`.tray-well > .washi-tag` keeps matching). The two `<h2>` section headings and the two row
captions take the `display: contents` host the mobile tab heads already use
(`GameControlPanel.vue:786-793`), each hosting a tape.

| property | value |
|---|---|
| face · size · weight · transform | Patrick Hand · `--type-name` (25.888px) · 500 · lowercase (CSS only, law 28) |
| line-height | **1.2** (`--type-leading-heading`) — buys ~40px over eight names and 1.04px of clip headroom |
| ground | `--sheet-washi-neutral`, seeded six-point tear, seeded ±1.5° tilt (the shipped tape) |
| ink | `--color-foreground`. The selected tier's crayon LEAVES the heading (law 17: washi is never a hue) and lives on the chip alone |
| GROUP rank | astride the well's top stroke; overhang **32.15px** measured at the name rung; inset `--washi-tag-inset` |
| ROW rank | flat inside, left, inset `--washi-row-inset`; no overhang; `position: static` |
| document rank | `<h2>` for all eight; the well's `aria-labelledby` unchanged (one-string law 33) |

The eight names and their ranks: **new game** (G) · size (R) · level (R) · **pencils** (G) ·
marks (R) · what fits (R, the B1 recut of `candidates`, §9) · **checking** (G) · **players** (G).

### 2.2 Sticky — the half-life law (the LOOK is here; the mechanism is a W2 §2.6 amendment)

What the reader sees: the tape at the top of the card is always the tape for the group under
the eye. A group tape pins at `--washi-tag-top` while its well is ≥ half on screen; when the
well passes half gone the tape **goes with it** and the next group's tape takes the top.
Between groups the card's top shows plain paper for the few pixels of the well's margin, never
a tape naming an absent group.

Implementation, named so W2 lands the right one (the research proved the wrapper form breaks
three estate selectors and the r0 instrument's population): **one attribute, no wrapper.** One
`IntersectionObserver` at threshold 0.5 per well sets `data-released` on its tape; the released
tape is `position: static`. The tape stays the well's direct first child. Net flow height stays
zero (`SheetWashiLabel.vue:171-173` untouched).

### 2.3 The three button treatments (seven censused controls → three)

| treatment | controls | drawn form | hover (`hover:hover`) | active | focus |
|---|---|---|---|---|---|
| **BOXED** | `deal` only | `HandDrawnOutline :pose="0" :stroke-width="2.5"` (the tongue's weight), radius 0, no ground | ink lift only; the `--color-accent` fill RETIRES (it was 2.9 lightness points) | `scale(.93)` (unchanged) | ring §2.6 |
| **BARE** | clear · fill · solve · share · undo · redo · hint · the `i` · `leave` · `play` | glyph at its `--icon-*` rung + Patrick Hand word at `--type-verb`; NO border, NO ground. `.info-glyph` loses its 1.5px ring; `.players-leave` loses its underline | ink lift `--color-muted-foreground` → `--color-foreground` | `scale(.93)` | ring §2.6 |
| **CHIP** | every option | Fira Code `--type-option`, the seeded scribble under the chosen one (unchanged) | the seeded ghost (unchanged) | — | ring §2.6 |

The `i` glyph, bare, keeps its `aria-expanded` ink lift; its crib (`.legend-fold`) is untouched.

### 2.4 The mobile tabs (§8) — two ROW tapes side by side

Under the `new game` group tape, `size` and `level` are two row tapes in one line:

| state | tilt | opacity | word | value |
|---|---|---|---|---|
| **pressed** (active) | 0° | 1 | `--color-foreground` | none (its options are showing) |
| **lifted** (inactive) | seeded ±1.5° | 0.68 | `--color-foreground` | the current value word at the tape's right end, `--type-tag`, `transform: none` |

One dimming only: the lifted tape dims by opacity, the word stays foreground (the TABS lane's
double-dim failure is the trap; measured here as a gate, §6). The CSS `text-decoration`
underline DIES (the card's second "this one is on" grammar, 40px from the chips' scribble).
Each tape ≥ **44×44** in both dimensions (`min-inline-size: var(--tap-floor)` joins the shipped
`min-height`). W2's one-panel mechanic is untouched (inactive options `display: none`).
How a reader learns the lifted tape is a tab: it carries a value word and it is lifted at an
angle beside a pressed one; the two are the same object in two poses, the tongue's own grammar.

### 2.5 The bar (M04) — the fifth compartment

- Drawn: `HandDrawnOutline :pose="0" :stroke-width="1.5"` around `.action-bar`, the wells' own
  weight; the `::after` skirt becomes the frame's outset; the `::before` fade stays (it is the
  bar's only motion and it is data-gated).
- Sticky in **all three** scrollports: the key at `GameControlPanel.vue:2173` gains
  `(max-width: 1023.98px) and (orientation: landscape)`. This is a one-line W2 §2.2 row, named
  as a dependency; at 900×500 today the bar is `position: relative`.
- Flow height RESERVED at the card's foot (`--action-bar-h` publisher, `:607-628`), so the
  card's END state buries nothing.
- **M04 splits.** Term 1 (chrome of its own): closed by the above, both engines, five cells.
  Term 2 (covers no option group): NOT closable by a sticky bar — worst burial after the reserve
  is 0.856 dock / 0.123 desk / 0.204 landscape. The spec names it as a **W2 layout dependency**
  (the bar leaving the scrollport) and does not claim it. The agglomerator decides whether this
  family adopts CTRL-RULE's foot; if it does, the fifth compartment is drawn at the case's foot
  and the reserve dies.

### 2.6 Focus — one ring for the whole card

`outline: 2px dashed currentColor; outline-offset: 3px` on `:focus-visible` for every control
in the card (the tongue's ring, `DrawerTab.vue:151-154`, promoted to a shared rule). Measured
from painted bytes: worst **4.59:1** (webkit, chip on the well's paper), 4.66 on the well and
the bar, 18.99 on the tongue. This closes a live a11y row the research found: WebKit's shipped
default ring is **2.15:1** on the card's paper. The board keeps its drawn `--color-focus-sketch`
ring (§5/§6 families' subject, not this one).

### 2.7 The quick set (§14, M13) — one law, two poses, like the tongue

- **Landscape (<1024, landscape):** the tongue's flank strip carries `undo · redo` above
  `controls`, three tongues under ONE outline (2.5), each 48×92, vertical-rl. This is the cure
  for the measured hole: at 844×390 and 900×500 the ribbon is `display: none` and undo/redo go
  from unreachable to 0 taps, 0 duplicated.
- **Portrait:** the tongue carries `controls` alone. The ribbon already holds undo/redo/hint/
  peek at 0 taps; a strip would duplicate 2 of 3 acts and spend 184 of the board's 274px of
  free edge. M13's own fence ("a second toolbar") fires, measured.
- Ballot for the re-look (U-10): the owner wrote "the controls tab on mobile should have a few
  quick actions". The recommendation above answers landscape; if the owner wants the strip in
  portrait too, the price is the ribbon's retirement (CTRL-TABS's one-tool-home move), and it
  should be disposed there, not silently.

### 2.8 The confirm (§15, M12) — the two-tap sublabel, one window

The idiom the owner has passed twice (Deal, Clear) extended to `fill` and `solve`:

| state | sublabel | ink |
|---|---|---|
| rest | `deal` · `clear` · `fill` · `solve` | `--color-muted-foreground` |
| armed (dirty board, first tap) | **`sure?`** | `--color-red-ink` w600 — 4.99:1 light / 6.39:1 dark, measured |
| disarm | any other tap, or `MOTION.confirmWindowMs` | back to rest |

ONE window: the incumbent's **2500ms** (`GameControlPanel.vue:506-533`), never the charter's
4000 (two windows on one idiom is how a second grammar is born). The sublabel reserves
`min-inline-size` = the wider of its two words so the verb's box does not shrink 8px on arm.
W1 §1.5 owns the ARMING (not in the tree; Fill writes 43–49 cells on one tap at HEAD); this
spec owns the face. No `role=dialog` anywhere.

### 2.9 The 390 seam (M03a) — derived one-sided, AFTER the voice

`--sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px))` where `--masthead-foot` is the
wordmark's border-box bottom, published by the masthead. Measured under the overlay:
+8.00/+7.98 at 390, +8.00/+8.48 at 375, +8.00/+7.98 at 430 (two stroke widths is 6.00px; 375
clears). The masthead-to-board gap is untouched (7.00 chromium / 6.41 webkit). The publisher is
one `ResizeObserver` on `.masthead` — a W2 §2.5 row; the DERIVATION is this family's and it
must be `max()`, never "exactly 8", or 430 loses the air it has.

---

## 3 · Copy (M16: plain English, lowercase by CSS, no j or x in the hand)

| site | string | note |
|---|---|---|
| the eight names | `new game` · `size` · `level` · `pencils` · `marks` · `what fits` · `checking` · `players` | `what fits` is B1's recut of `candidates` (registry §5); strike its ADMITTED row same commit |
| the armed sublabel | `sure?` | shipped; extended, not minted |
| the quick set | `undo` · `redo` · `controls` | shipped strings |
| the bar | `clear` · `fill` · `solve` · `share` | shipped |

New codepoints: none (`size`, `level` are already in the Patrick Hand corpus,
`scripts/check-font-coverage.mjs:223-235`). Flag: the gate binds a string to a face by a
hand-declared `where`; `.section-heading` moving to the hand must be declared there or the
gate cannot see the swap.

---

## 4 · Motion (curve · duration · home)

| verb | what | duration | curve | home |
|---|---|---|---|---|
| ink lift | muted → foreground on hover; tab tape 0.68 → 1 | 150ms | `--ease-standard` | `MOTION.inkLiftMs: 150` (the estate's most-used literal, named; pending the §13 family's ladder naming) |
| tape settle | lifted tab 1.5° → 0° on press | 150ms | `--ease-standard` | same row (the tongue's own de-tilt, `DrawerTab.vue`) |
| pin / release | sticky ↔ static | **0** — a scroll consequence, never tweened | — | — |
| arm | sublabel word swap | 0 | — | — |
| re-arm window | disarm timer | 2500ms | — | `MOTION.confirmWindowMs: 2500` (moves the Deal/Clear literal home, law 4) |
| bar fade | `::before` 2rem fade while `data-fold-below` | unchanged | unchanged | unchanged |

PRM: the ink lift and settle collapse to a same-frame swap. Nothing on the card moves unbidden.

---

## 5 · Plan — files, order, what dies

1. `typography.css` — mint `--type-name`; re-point `--type-group-title`; delete :133-137;
   `--type-option` 768 arm 22 → 20. (One commit, one block, per W2's "THE NUMBERS ARE W7'S".)
2. `SheetWashiLabel.vue` — `anchor="tag"` renders `h2`; `.washi-tag { font-size: var(--type-name); line-height: 1.2 }`.
3. `GameControlPanel.vue` — the two row captions and two staged names become tapes in
   `display: contents` hosts; `--washi-row-inset`; well padding; `.zone-row-label` →
   `--type-name`; the tabs' pressed/lifted rules + `min-inline-size`; **DELETE** `:2414-2418`
   (the CSS underline), **DELETE** `.info-glyph`'s border (`:2321-2338`), **DELETE** the
   `.icon-btn:hover` background (`:1932-1969`), `.players-leave` underline; `deal` takes
   `HandDrawnOutline :pose="0" :stroke-width="2.5"`; the bar takes a pose-0 frame at 1.5 and the
   skirt becomes its outset; the sticky key gains the landscape arm (W2 row, same commit if W2
   consents); the sublabel arm extended to fill/solve behind W1 §1.5's flag; the shared
   `:focus-visible` dashed ring.
4. `DrawerTab.vue` — the landscape strip (three tongues under one outline).
5. `scene.css:467` — `--sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px))`.
6. `pencilConfig.ts` — `MOTION.inkLiftMs`, `MOTION.confirmWindowMs`.
7. `e2e/visual-regression.spec.ts` test 10 — the iPad coarse seal, **re-priced by named
   ablation** (§7).
8. `scripts/check-copy-register.mjs` — strike `candidates` from ADMITTED; `check-font-coverage.mjs` — declare the hand's new `where`.

Dies: Fraunces on the card; the CSS underline; the info ring; the accent hover fill; the
`--type-group-title` 768 arm; the `--type-option` 22px arm; the portrait quick set (never
built). Stays: every W2 mechanic (sticky tag, dock, bottom tab, tap floor); `BoilDivider` ×1;
filterBudget 9 (the overlay adds no `filter`; both drawn edges are pose-0 geometry).

---

## 6 · Prototype brief

Build: the research overlay (`../research/CTRL-TAPE/proto/overlay.mjs`) promoted to a source
patch in a throwaway worktree under the scratchpad — the eight `<h2>` tapes, `--type-name`,
the row inset, the released attribute, the two pose-0 frames, the dashed ring, the tabs, the
landscape strip, the sublabel on fill/solve, the derived `--sheet-chrome`, line-height 1.2 and
the well padding. Dev server in the 4230 band, `--strictPort`; scratch Playwright config; both
engines; settle 700ms after every sheet open.

Screenshots (crops ≤150 KB, each cited): (1) 390×844 dark sheet-up — the eight tapes, group
astride / row flat, the boxed deal, the wordmark clear of the case stroke (beside the owner's
Frame B); (2) 1440×900 rail at scrollTop 500 — the top tape reads `pencils` (beside R7 p7);
(3) 900×500 sheet-up — the bar sticky with its 1.5 frame; (4) 390×844 the two row-tapes,
pressed and lifted, with the value word.

Censuses to re-run unchanged: R1 `heading-voice.spec.ts` (4 cells + a 900×500 cell added
beside); R7 I2/I3/I4 with the band row beside I3; `access.spec.ts` 2.1/2.2/2.3; R6
`law-probe.mjs` L1 (filter 9) L4 (washi neutral) L5 (one box grammar); the hue census (no
chromatic change expected: 29 rows → 29).

Numbers that mean success: voices 1, headings 8/8, ratio ≥1.23 at desk/dock/900×500 (expect
1.2945 at all three); band row 0 violations at five states both engines; I2 ownChrome true at
five cells; Fill/Solve write 0 cells on first tap once W1 §1.5 lands (until then: the FACE
arms under a capture-phase guard, as the research ran it); every re-cut target ≥44 in both
dimensions with a per-dimension negative control; dashed ring ≥3:1 on four grounds from
painted bytes; `sure?` ≥4.5:1 both themes; seam ≥6.00px at 375/390/430; first tape ≥8px
inside the dock card's top edge (was 1.04); `.control-panel-wrap` at 1280×800 coarse ≤ the
re-priced bound; card width byte-identical at every cell (goldens unmoved); filter census 9.

---

## 7 · The three adjustments, spent

**The iPad coarse seal (+141.95px over 1227.5).** Spent in three named parts: tape
`line-height: 1.2` (≈ −40), well top padding 0.7rem → 0.35rem (−22.4), and the remainder
(≈ 80px) declared as **M03's own cost** — eight names rising 14.05 → 25.89px is the mark's
arithmetic, 8 × 11.84 × 1.2 = 113.7px — and test 10's bound re-cut by named ablation in the
same commit (its third re-pricing; T6 marks 3/8 and mark 13 were the first two). The bar's
reserve is NOT spent: dropping it re-buries the players well at the end state, R7's exact
picture. If the agglomerator adopts the foot (CTRL-RULE), the reserve dies and −64.81 comes
back for free.

**The bar's burial.** Split, not claimed: chrome closes, burial is W2's (§2.5).

**The portrait quick set.** Deleted; landscape only (§2.7), with the owner's ballot named.

**The thinnest point** (for the critique pass): the two ranks are ~8px of offset and one
crossed stroke. The second axis (the row inset, one gutter in) is in the spec, not in reserve.
The critique should put crop (1) in front of a fresh reader and ask which names are groups.

---

## 8 · Gates the family lands with

Born-RED at HEAD (RED today, GREEN under the overlay, both engines): R1 ROW 1/2/3 at four cells
+ the 900×500 cell (1.1767 today under the 22px arm); the I3 band row (2/3/1 violations →
0/0/0); I2 term 1 (ownChrome false → true); the card's authored focus ring (webkit 2.15:1 →
≥3:1, four grounds, painted); the tab tape's `min-inline-size` (per-dimension negative control:
`min-width: 0` → 12×44 breaks it alone); I4's face (0 cells on first tap) — RED until W1 §1.5
lands and labelled so.
Regression guards (GREEN at HEAD, must stay): filter census 9 exact; washi neutral (L4); one
box grammar (L5); goldens `cell-light` / `grid-corner-light` unmoved; the masthead-to-board
gap; card width byte-identical at five cells; the 390/375/430 seam ≥6px (RED at 390 today:
−2.73, so this one is born-RED too).
