# T9-W7 · pass 3 · SYNTHESIZE · CTRL-RULE — the margin column, arm (b), the pin kept

Section §10 · marks M01 M03 M04 M05 M12 M13 · pass-2 63, the fork ruled (chair §6.3a: the sticky
mechanic stays; arm (b) re-cuts to keep the pin). Synthesizer: Fable 5.1 (frontend-design
invoked). Read-only on the product. Inputs: `../CHAIR-RULINGS.md`, the pass-2 spec
(`../../pass2/synthesize/CTRL-RULE.md`, STANDS where not amended), the pass-3 research
(`../research/CTRL-RULE/README.md`, `readings/sticky-margin.json`, `pinned-name-i3.json`,
`ribbon-intersect.json`, `webkit-ribbon-twopress.json`, `law-probe-*.txt`), registry-v2, r0
R6/R7, Frame B. Base `74a2b5d9`. A SEPARATE route from CTRL-TAPE; nothing merged here.
Nothing closes (U-10).

The chair refused "nothing pins". The research measured the cure the chair ordered: a name
pinned IN THE MARGIN takes the orphaned field from 4/14 → 0/14 (chromium) and 4/13 → 0/13
(webkit) at 1280×800 and covers 0.000 of any control at every state, both engines, because
column 1 holds names and nothing else. The spec sentence becomes the stronger one:
**names pin in a column no control occupies.**

---

## 0 · The plan re-read, then the tell review

**Subject.** A worksheet page ruled by hand: a printed margin column on the left carrying each
group's name, a wide field on the right where the pencil chooses, one graphite rule under each
group across the full width. The name rides its own group and holds at the page's top while
the group is under the eye — the way a printed running head does.

**Tokens.** No new hex. `--rp-margin` (7.6rem = 121.6px; 6.4rem at ≤374.98) stands.
`--ring-ink` consumed `var(--ring-ink, currentColor)`. `--card-pad-t`, `--card-foot-h`,
`--sheet-chrome` CITED from CTRL-TAPE's §6.5 registration; this family's `, 0px` at
scene.css:138/:582 struck AFTER the block lands (order: registration → cite → strike).

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | #FDFDFC | #131211 | the page |
| `--color-foreground` | #0A0A0A | #EDEBE7 | chosen chips, act words, the confirm's sentence |
| `--color-muted-foreground` | #737373 (4.66) | #A8A69F (7.69) | every name (one ink), verbs at rest |
| `--ink-press-rule` | fg 55% mix | same | THE RULE (`RuledLine`, stroke 2.0) |
| `--color-red-ink` | #D02A52 (4.99 bare card) | #FF5C7C (6.30) | the destructive answer's word |
| `--ring-ink` | consumed, `currentColor` fallback (§2.4) | | 21 desk / 19 dock controls, 2px solid offset 4 |
| `--rp-margin` | 7.6rem · 6.4rem ≤374.98 | | the margin column |

**Type.** Fraunces 800 lowercase at `--type-heading` (25.888px, line-height 1.2) for the seven
names; Patrick Hand for the pencil's words; Fira Code 20px chips at every width. Ratio 1.2945.

**Layout, one sentence.** Each group is one row of a three-column grid
`[margin 121.6] [0.5rem] [field minmax(0,1fr)]` with `align-items: first baseline`; the name in
column 1 is `position: sticky` and rides its own grid area; a full-width hand-drawn rule under
each row; the foot below the page in `#card-foot`, standing on the safe-area inset (TAPE §1.3).

```
.controls-card (scrollport)
┌──────────────────────────────────────────────────────┐
│▒▒▒ fold sentinel · ::before · sticky · z 30 ▒▒▒▒▒▒▒▒▒│ ← W2's cue: solid over --card-pad-t, then a 2rem fade
├───── margin ─────┬──┬────── field ────────────────────┤
│  size  [pinned]  │  │  4×4   9×9   16×16              │ ← top: var(--card-pad-t), z 31: a pinned name sits
│  ··· 121.6 ····· │8 │  ··· minmax(0,1fr) ···          │   exactly where a resting one rests (the pin is invisible)
│╌╌╌╌╌╌╌╌ rule spans 1 / -1 · RuledLine 2.0 ╌╌╌╌╌╌╌╌╌╌╌│
│  level           │  │  easy  medium  hard             │ ← the incoming name pushes the outgoing up (handoff)
└──────────────────┴──┴─────────────────────────────────┘
   col 1: names only          col 3: EVERY control  ⇒  pinned name ∩ control = 0.000 BY CONSTRUCTION
#card-foot: ╌╌ rule ╌╌  clear  fill  solve  share  ·  while armed: [clear the board?  keep  clear] FULL WIDTH
```

**Principles.** (1) One voice, one rung, one ink, one rule. (2) NAMES PIN IN A COLUMN NO
CONTROL OCCUPIES — the pin is truthful by geometry (a sticky grid item is bounded by its area,
so a name releases when its group leaves). (3) Nothing hidden: `level` is a row. (4) Boxes
mean consequence; weight ranks the confirm. (5) The memorable thing: the printed name in the
margin beside a hand-ruled line, holding at the top of the page while its group is under the
eye.

**The tell review.** (a) THE FORM TELL stands as pass 2 stated it and the 1280 rail is its
worst case (129.6 of 324px spent on the margin, one chip per line) — U-10's frame, reported,
not argued. (b) The first draft pinned at `top: 0` (the research's measured arm): the review
struck it — a name flush with the case's inner edge is Frame B's shorn-tape read. The pin sits
at `top: var(--card-pad-t)`, the same inset a resting name has, so a pinned name is
indistinguishable from a resting one; the research's `0` and `2rem` arms bracket it (both
0/14) and the prototype reads the middle. (c) "Two faces for one confirm" was the pass-2 aim;
R6 L5 forbids the bare-`keep` route (422 vs a 400-char window). Revised to the section's face
(TAPE §2.5): both answers drawn, 1.5 vs 2.5. (d) Broadsheet hairlines: the rule is
`wobbleLine` inside the grid's σ band at stroke 2.0, never a CSS hairline. (e) Motion: the
rules draw on once at mount on the ladder's `note` rung; nothing else unbidden.

---

## 1 · The rows this pass adds or re-cuts

### 1.1 The pinned margin name (chair §6.3a's re-cut)

```css
/* RuledGroup.vue — the name rides its area and holds at the page's inset */
.rp-name {
  position: sticky;
  top: var(--card-pad-t);        /* registered <length> (TAPE §1.1), NO fallback: the resting inset */
  z-index: 31;                   /* above W2's fold sentinel (30); column 1 holds nothing else */
  align-self: start;             /* THE PIN'S TRAVEL: a stretched grid item has no room to move and
                                    sticky becomes a silent no-op (the container's first-baseline
                                    alignment is what makes it work today; this pins it) */
}
```

- Measured (research): orphaned field 4/14 → 0/14 chromium, 4/13 → 0/13 webkit at 1280;
  name ∩ control 0.000 at every scroll state, every cell, both engines; margin boxes
  [821.25, 942.84] vs field 950.84 at 1280, [8, 129.59] vs 137.59 at 390.
- The fold sentinel is W2's decided cue; STATED and BOUNDED, not deleted: band height
  `2rem + --card-pad-t` (52 at 1280 / 38 at 390), solid over the first `--card-pad-t`. The name
  pins at the band's solid edge; what scrolls under the fade in column 1 is only the outgoing
  name, and handoff prevents overlap.
- `data-fold-above` publishes asynchronously: the SCAN reads it a frame after writing
  scrollTop (the research's same-tick zero is not a reading).

### 1.2 I3 is MOVED; the successor is two rows, layout-neutral (banked, NOT applied)

I3's ≥50% proxy convicts a truthful margin pin (at scrollTop 125 the pinned `Size` names the
field at the port's top with own 0.282). `instruments/name-truth.mjs.proposed`:
ROW A · NO ORPHANED FIELD: ∀ group, fieldVis ≥ 0.33 ⟹ nameVis > 0 (HEAD RED; arm (b) as built
RED 4/14; margin pin GREEN 0/14). ROW B · NO STALE NAME: every on-screen name box ⊂ its own
group's box (HEAD RED; pin GREEN by construction). Born-RED: `align-items: stretch` injected →
ROW A reds. I3 reported MOVED with the diff cited; the chair disposes.

### 1.3 The rule — stroke 2.0, citations corrected, ink read everywhere

- Stroke **2.0** ships (the bank: seven card rules 3.437–3.53 chromium at 390/1280). The two
  shipped comments are re-written with their POPULATIONS named: `RuledLine.vue:86`'s "1.8 —
  2.366/2.909" appears nowhere in `rule-ink.json` and is struck; `:88` is the seven-card-rule
  figure; the README's 3.304/3.347 is the overall worst including the foot's rule at ITS stroke.
- The reading is sub-pixel-phase dependent (same ink, 3.530 at y 302.83 vs 2.413 at y 766.03).
  The gate therefore reads the WORST painted column over 7 census cells × 2 themes × 2 engines
  × 4 sub-pixel phases (scrollTop offsets 0 / 0.25 / 0.5 / 0.75 px) ≥ 3.0:1, on `RP_SEEDS`
  (σ ∈ [0.722, 2.886] each). If 2.0 fails the worst phase in light, the rule takes
  `--color-muted-foreground` and the record says the 55% ramp cannot draw a 2px line to 3:1.
- `wobbleLine`, `mulberry32`, `createStrokeDrawIn` only; `boilLineFrames`/`useLineBoil` are
  forbidden (each mints a `url(#…)` filter; filterBudget EXACTLY 9). `BoilDivider` ×1 stays.

### 1.4 The confirm — full width, the section's face, the press count explicit

- `ConfirmRibbon` (`position: absolute; bottom: 100%; z 70`) becomes `width: 100%` of
  `#card-foot` (`max-width` struck): measured 142.13×87.19 at 0.364 of the foot intersected
  `Off` at 0.395 and shared a baseline with three controls; full width takes ∩ to 0 and the
  shared baseline away. No ground (the deleted 8% wash stays dead).
- The face is TAPE §2.5's: `keep` drawn 1.5 · the verb drawn 2.5 in `--color-red-ink` on bare
  card · the sentence; ≥ 44×44 per dimension (`min-inline-size` AND `min-height`, present at
  :180-183). L5 GREEN (the gallery's `keep` keeps its outline at +105). One face, two files.
- Arming: TAPE's `useTwoTap` with the section's focus contract (pointer arm moves no focus;
  keyboard arm → `keep` with preventScroll; null relatedTarget is not a departure). The
  research's two probes disagreed on the press count (1 vs 2 in chromium under different
  boots): the prototype's row names the count — "press 1 arms · press 2 fires, sheet settled
  ≥700ms, both engines" — and `confirmWindowMs`'s lapse is measured only on a surface the row
  proved armed.

### 1.5 Tokens and fallbacks (order matters)

`@property` appears nowhere at HEAD; TAPE lands the block. This family CITES it and then
strikes `--card-foot-h, 0px` at scene.css:138 and :582 and `--rp-*`'s own fallbacks; never
before. `--masthead-foot` exists on neither tree: the 12.6rem constant's comment is honest
until TAPE's publisher lands, and then the portrait arm consumes W2 §2.5's derivation (TAPE
pass-2 §1.5) — the landscape arm stays `4rem` (chair §6.2).

### 1.6 The estate rows — 22 re-aims as a list, and the collision surface

zone-grammar ×9 (:55 :127 :179 :227 :319 :359 :548 :591 :669), viewport-law ×4 (:575 :610
re-aimed from `.washi-tag` to `.rp-name` — EDITS, not deletions, under the pin; :396 :287),
share-truth ×3 (:63 :97 :122), access ×2 (:255 :375), font-census ×2 (:231 :344),
join-language ×2 (:69 :134). Replay onto 74a2b5d9 collides only in the two gate scripts
(`check-copy-register.mjs` +892, `check-font-coverage.mjs` +32 — the fold's G17 grammar is law;
resolve toward the fold, re-apply only this family's extractor rows) and trivially in
`GameControlPanel.vue` (+10) / its test (+3). R6 L3 is RED at main by the fold's own strike
(`since:` count 1 ≠ 2) — the CHAIR's wave-wide MOVED row, reported. R6 R3 re-aimed to the bar's
SUBTREE (the drawn edge is a sibling `RuledLine`, not a declaration in `.action-bar {}`) —
MOVED with the diff; arm (b) flips GREEN under it.

---

## 2 · Components and states (pass 2 §2 stands; the deltas)

| component | pass-2 | pass-3 delta |
|---|---|---|
| the name (×7) `<h2 class="rp-name">` | static, margin cell, muted ink | STICKY at `top: var(--card-pad-t)`, z 31, `align-self: start`; ink unchanged |
| the rule (`RuledLine`) | 1.8 or 2.0 by measurement | 2.0 ships; comments corrected; worst-phase gate |
| the field (`.rp-field`) | wraps by law | unchanged (marks wraps at 390, +27) |
| ACT boxed / WORD bare / CHIP | pass 1 §2.4 | unchanged |
| focus | `--ring-ink` 2px solid offset 4 | `var(--ring-ink, currentColor)` |
| the bar / foot | `#card-foot`, one drawn top rule | stands on `0.5rem + --safe-b` (TAPE §1.3, cited) |
| the confirm | keep bare / verb boxed 2.5 red | BOTH drawn 1.5 / 2.5; FULL width; press count explicit |
| the quick set (§14) | landscape teleport | unchanged |
| the gallery's `keep` | to be made bare ("one face") | KEEPS its HandDrawnOutline (L5); the "one face" sentence in the diff comment is re-worded to "one face, weight-ranked" |

Desk and dock share the grammar; at ≤374.98 the margin is 6.4rem and the name drops one rung
(declared, reported beside the 1.23 law asserted at ≥375). Light and dark differ only by the
theme tokens above.

## 3 · Copy (M16; lowercase by CSS)

Names `size · level · new game · marks · what fits · checking · players`; confirm `clear the
board? · start a new board? · fill in the sure cells? · fill in the whole board?` with `keep`
and the verb; quick set `undo · redo`. `players` needs Fraunces `p` (+`U+0070`, ≈ +260 B,
banked with the commit). Zero new strings; ADMITTED stays empty.

## 4 · Motion

| verb | what | duration | curve | home |
|---|---|---|---|---|
| draw on | seven rules + the foot's at mount, once | `var(--motion-note)` 250, delay (seed % 7) × 22ms | `--ease-drawOn` | §13's ladder; `MOTION.ruleDrawMs: 260` is NOT minted (250 is the rung 10ms away — the ladder exists to refuse the literal) |
| ink lift | muted → fg on hover | `var(--motion-whisper)` 150 | `--ease-standard` | §13's ladder |
| ribbon | the confirm into the foot's row | `var(--motion-note)` 250 | `--ease-glassGlide` | §13's ladder (pass 2's 240 literal dies) |
| confirm window | disarm timer | 2500 | — | `MOTION.confirmWindowMs` (a hold; keeps its literal) |
| pin / release | sticky | 0 | — | — |

PRM: draw-on to `--draw-opacity`; the ribbon appears in place; the rungs read 0ms.

---

## 5 · Plan — files, order, what dies

Replay `-29` onto a fresh worktree from `74a2b5d9` (the two gate scripts toward the fold), then:
1. `RuledGroup.vue` — `.rp-name` sticky block (§1.1) with the `align-self` comment; the
   container keeps `align-items: first baseline`.
2. `GameControlPanel.vue` — the confirm's face (TAPE §2.5), `useTwoTap` consumed, ribbon
   full-width; R3's subject stated in the comment; `:deep(.rp-name)` 320-arm kept.
3. `ConfirmRibbon.vue` — `width: 100%`, `max-width` struck; `keep` takes `HandDrawnOutline
   :pose="0" :stroke-width="1.5"`; ring `var(--ring-ink, currentColor)`.
4. `RuledLine.vue` — stroke 2.0; comments :86/:88 re-written with populations.
5. `scene.css` — AFTER TAPE's block: `, 0px` at :138/:582 struck; `--sheet-chrome` portrait
   consumed, landscape `4rem`.
6. `GameGallery.vue` — the 8% ground stays dead; `keep`'s outline UNTOUCHED (L5).
7. `index.css` — Fraunces `U+006B-0070` + the re-cut woff2; this family's `--ring-ink` reads
   consumed.
8. Tests — the 22 re-aims (§1.6); `GameControlPanel.test.ts` toward the fold + the ruled rows.
9. Instruments under `pass3/prototype/CTRL-RULE/instruments/`: `sticky-margin.mjs` re-run with
   the `top: var(--card-pad-t)` arm and the frame-after read; `name-truth.mjs.proposed` (I3's
   successor, banked); R3 re-aim (MOVED); the rule's worst-phase sweep; hue census COPY run
   against a 74a2b5d9 control (29 rows; index.css moves here).

Dies: pass 2's 240 and 260 literals; this family's three masked fallbacks (after the block);
`max-width` on the ribbon; the "one face" comment's bare-`keep` sentence. Stays: W2's sticky
mechanic (as a margin pin), the fold sentinel, the dock, the tap-floor token, `BoilDivider` ×1,
filterBudget 9, the note berth.

---

## 6 · Prototype brief

Worktree from `74a2b5d9`; `127.0.0.1:4231 --strictPort`, private `cacheDir`; HEAD control on
the next free band port, named; scratch Playwright config; both engines; settle ≥700ms;
`npx vite build` in the worktree → preview on a lane port for filter-census and goldens (unrun at
both passes — a number, not "by construction"); every server killed before return.

**Crops (≤4):** (1) 1280×800 light rail at scrollTop 0.5 — `level` pinned in the margin at the
card's inset with its field under the eye, the outgoing `size` gone (M03's second look);
(2) 390×844 dark, sheet up, the confirm full-width in the foot: `keep` 1.5, `clear` 2.5 red,
no control under it; (3) 320×568, the margin's short arm (reported, not claimed). Fourth only
if the form-tell frame is re-asked (U-10).

**Censuses:** R1 heading-voice (7/7, one voice, 1.2945 ≥375); R7 I2 (clipped coverage 0.000) /
I3 (MOVED, RED reported with the successor rows GREEN) / I4 (RED until W1 §1.5); R6 law-probe
COPY (L1 = 9, L3 RED-at-main reported as the chair's, R3 re-aimed GREEN, L5 GREEN with the
gallery's outline kept); hue census COPY vs the control (29 rows, Δ 0); the orphan instrument
(0/14, 0/13); the name-over-control predicate incl. `::before`/`::after` (0.000, 5 states × 3
cells × 2 engines); the `align-items: stretch` ablation (ROW A → RED); the rule sweep (worst
column ≥ 3.0 over 7 cells × 2 themes × 2 engines × 4 phases; σ per seed); the ribbon row (width
= foot width, ∩ 0, press 1 arms / press 2 fires, lapse at 2500 on an armed surface, both
engines); the tap floor per dimension with the firing control; the gallery π at 390/1280 vs
the control (Δ 0.00 ×5); TAPE's registration/publisher rows cited and run; W2 §2.2's
reachability at 844×390 + 812×375 GREEN, card clientHeight reported; `check-font-coverage`
(exit 0, +260 B banked), `check-copy-register` (exit 0, ADMITTED 0), the 22 re-aimed specs
BARE; filter EXACTLY 9 + union ±2% off the built dist; goldens 4/4.

**Success:** orphan 0/14 and 0/13; name ∩ control 0.000 everywhere; ROW A/B GREEN with the
stretch ablation RED; pinned name's top = resting inset ± 0.5px; worst rule column ≥ 3.0 at
every phase; ribbon ∩ 0 and width = foot; `keep`/verb stroke 1.5/2.5; verbs ≥ 44 per
dimension; dock 390×844 scrollHeight ≤ 740 reported at four cells vs HEAD's 699/628; filter 9;
goldens 4/4; gallery Δ 0.00; L5 GREEN.

---

## 7 · Gates the family lands with

Born-RED at HEAD: ROW A (no orphaned field) and ROW B (no stale name) — HEAD RED both (I3's
successor, proposed); the name-over-control predicate over every sticky/fixed surface incl.
pseudo-elements → 0 (HEAD: `play` 100% at dock 0); the pin's TRAVEL ablation (stretch → ROW A
RED); R1 ROW 1/2/3; the rule's σ per seed and its worst-phase ≥ 3.0 row (a hairline is σ 0);
`level` at 2 taps; the ribbon's ∩ 0 and full width (HEAD's bar-adjacent ribbon 0.395); the
confirm's weight-ranked face (stroke 1.5/2.5, density ≥ 1.5×, red word ≥ 4.5 on bare card);
the press-count row (press 2 fires, both engines); the ring on all 21 desk controls ≥ 3:1;
the `p` glyph; R3 re-aimed (MOVED). Guards: filter EXACTLY 9 + union; goldens 4/4; gallery
Δ 0.00 ×5; L5 GREEN; L1/L4; W2 §2.2 reachability ×2 cells; `check-theme-selectors` exit 0;
M16 0 unadmitted; M01's 20px chip at 390 coarse.

TO THE CHAIR: (a) R6 L3 RED at main `74a2b5d9` — wave-wide, the fold's strike; (b) R3's subject
moved (re-aim to the subtree, proposed); (c) I3 MOVED with the successor banked; (d) the 1280
rail's form-tell frame is U-10's.
