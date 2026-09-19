# T9-W7 · pass 3 · SYNTHESIZE · CTRL-FACE — the printed face

§10 with §1 §2 §8 inside · marks M01 M03 M05 · pass-2 78 (not converged on ENFORCEMENT).
Synthesizer: Fable 5.1 (frontend-design invoked). Read-only on the product. Inputs:
`../CHAIR-RULINGS.md`, the pass-2 spec (`../../pass2/synthesize/CTRL-FACE.md`, STANDS where
not amended), the pass-3 research (`../research/CTRL-FACE/README.md`, `readings/r3-*.jsonl`),
registry-v2, r0 R6/R7, Frame B. Base `74a2b5d9`. Composes under RULE/COST, never TAPE
(the agglomerator decides). Nothing closes (U-10).

The subject moved under the family: the fold renamed `candidates` → `what fits` (ballot T9-B1),
and a caption with a space wraps where a word could not. Every clearance pass 2 banked was read
on a word that no longer exists. This pass re-prices on the real word and turns the readings
that could not fail into rows that can.

---

## 0 · The plan re-read, then the tell review

**Subject.** A printed sheet the reader has written on: the eight compartment names read as the
sheet's own printing; everything under them reads as the reader's hand. Hierarchy is a FACE.

**Colour.** No new hex; the family mints none. `--color-foreground` (#0A0A0A / #EDEBE7) the
press · `--color-muted-foreground` (#737373 4.66 / #A8A69F 7.69) a shut head, an unselected chip
· `--ink-press-quiet` (fg 68%: 5.23 / 6.06) the shut value word · crayon inks (`#1d7f35` 4.95 ·
`#a26009` 4.91 · `#d02a52` 4.99; dark 10.11 / 10.26 / 6.32) the level readout · `--ring-ink`
consumed `var(--ring-ink, currentColor)` (it does not exist at HEAD; §2.4's form is the honest
one — a bare `var(--ring-ink)` would be a no-op dressed as a law).

**Type — three faces, declared aliases on `:root` (NOT measured tokens; §6.5 does not reach
them, and `*`-syntax registration carries no guarantee, so the witness is STATIC: CHECK 6).**
`--face-printed: var(--font-display)` Fraunces 800 lowercase, one rung `--type-heading`
(25.888px) at every width — the eight names, only those. `--face-written: var(--font-hand)`
Patrick Hand 400 lowercase — every value, every verb. `--face-mono: var(--font-mono)` Fira Code
— OptionSelector's own default, so the deck is unmoved. Correction to the research's (a):
`--washi-tag-rung`'s REGISTRATION needs an absolute initial-value (TAPE gives it 14px); its
DECLARED value stays `var(--type-tag)`/`var(--type-name)` — the two are different things.

**Layout.** None minted; W2's card, wells, sticky lane, tab row, bar. The family's ONE geometry
on the dock is the caption lane: the caption is ONE LINE (`white-space: nowrap`) and takes the
row's first line by the row's own wrap rule when it cannot sit beside its chips — which is
HEAD's own behaviour for `marks` today (two flex lines at 320 and 390).

```
 DOCK 390×844 printed rung, the pencils well          the two rows, one rule:
 ┌╌ pencils ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐            marks (3 chips, 290 > lane) → caption on line 1,
 │ marks                                  │              chips on line 2 (HEAD's own pose)
 │   normal   corner   center             │            what fits (2 chips) → beside them, ONE line:
 │ what fits      off   on                │              lane 120.69, chips 229.31 (≥ 2×44 + gap at 320: 224)
 ├╌ checking ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤ ← paper clears the caption's ink (re-priced on `what fits`)
```

**Principles.** Pass 2's five stand. Added: (6) **a caption is one line** — wrapping a two-word
caption inside a 60px lane is the collision, not the cure. (7) **a gate that reads a constant
is not a gate** — the overrun on any box basis is (n+1)/n by arithmetic; the `-1lh` build grep
cannot fail from the toolchain; both are re-aimed at what CAN fail (the engine split, the
runtime floor).

**The tell review.** (a) A size bump on two h2s would be the generic answer to M03; what
changes here is which FACE six names wear. (b) The first draft took the research's cheaper
arm (`nowrap`) and stopped; the review asked what happens at 320 with three chips — `marks`
already stacks by the row's wrap, so nowrap only ever squeezes a two-chip row (224 of 288 at
320, 12.9px of headroom, gated). (c) "Accent one word": `level`'s crayon is the value's ink,
a readout. (d) Two underline grammars: the CAD `.is-active` underline DIES; openness is ink
pressure. (e) Law 14 on the open head: the first draft kept HEAD's hover lift on the open head
to stay literally green; the review struck it — a hover affordance on a button whose press
changes nothing is the tell. The open head is reported INERT (its press is a no-op, measured)
and takes no affordance; the shut head takes exactly one (ink lift). Both arms buildable; the
chair owns the row. (f) Motion: one 150ms ink move on a tab switch; the scribble is a pose swap.

---

## 1 · The rows this pass re-cuts

### 1.1 The caption lane on the real word

```css
/* GameControlPanel.vue :1615-1626 */
.zone-row-label {
  flex: 0 0 3.75rem;             /* the lane opens to max(60px, min-content) */
  white-space: nowrap;           /* a caption is one line: `what fits` 120.69, never `what` / `fits` */
  align-self: flex-start;        /* clearance at the caption's TOP (the row is one line, so the ink gate
                                    is priced at the top again; the two-line bottom collision is gone) */
  font-family: var(--face-printed); font-size: var(--type-group-title); font-weight: var(--printed-weight);
  line-height: var(--type-leading-heading); text-transform: lowercase; color: var(--printed-ink);
}
.zone-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }  /* HEAD's; the stale :1558 comment re-written */
```

Measured (research): PRINTED + nowrap card 714 (wk 715) vs wrapping 724/725 vs HEAD 699;
`.options-row` 281.88 → 229.31 at 390 and 220 → 159.31 at 320 (against `what fits`'s TWO
chips: 44 + 7.2 + 44 = 95.2 — 64px of headroom; the three-chip `marks` row takes the row's
first line as at HEAD). The ink gate (`checking` paper over `what fits`'s ink) is RE-PRICED on
the one-line word; pass 2's +11.39/+10.91 are struck, the new numbers read on both engines.

### 1.2 The chip mark — priced off the rendered word, gated on what can fail

- `ch` is engine-split on this estate: Fira Code 1ch = 12.0016 chromium / 10.0000 webkit
  (no `0` in the cut → 0.5em fallback), so the shipped `${len+1}ch` mark is 48.01 vs 40.00px on
  one chip — a 16.7% split TODAY, on the card AND the deck. Under Patrick Hand (digits present)
  ch agrees (8.9594 both) but the (n+1)ch band opens to 1.22–1.93 on a proportional face.
- The card's mark is priced off the word: `.tray-well :deep(.ctrl-word) { background-size:
  calc(100% + 0.5rem) 8px; background-position: -0.25rem bottom }` — the scribble overhangs the
  rendered word by 4px each side (a fixed overhang, not a ratio, so a short word and a long
  word wear the same tear).
- THE GATE that can fail: (i) ENGINE IDENTITY — for every card chip, mark width chromium ==
  webkit ± 0.5px (HEAD: 8.00px apart); (ii) PAINTED OVERHANG — from the chip's bitmap, the
  underline's painted column extent exceeds the glyph ink's extent by ≥ 2 and ≤ 8px on each
  side, both engines (a painted read; WebKit's `actualBoundingBox` is the advance box, so no
  glyph-ink API is used). No box-ratio row is written.
- THE DECK keeps `${len+1}ch` (π: the wave does not claim it) and the split is NAMED as a ledger
  row for the deck's owner with the cure stated (the same word-priced mark, one reviewed
  re-mint at the fold with the owner's eye). Hiding it behind π is refused.

### 1.3 `-1lh` — the honest pair

The build grep cannot fail (lightningcss 1.32.0 passes `-1lh` at every target; the Tailwind
literal decodes to the declared floor). The pair: (a) the built css contains `-1lh` (a
regression guard, labelled); (b) a feature-floor row in `scripts/check-support-floor.mjs`:
`lh` needs chrome ≥109 / safari ≥16.4 / firefox ≥120, re-derived against the browserslist
floor the way check 2 re-derives Lightning's — RED if the floor ever drops below the unit
(the runtime failure: the whole margin shorthand lost, exactly GCP:1536-1540's documented
class).

### 1.4 Law 14 on the tab heads (the chair's row; both arms buildable)

At 820×1000 (hover live) HEAD's OPEN head moves `color` on hover and carries the CAD underline;
the SHUT head moves `color`. The slice: `.is-active` underline DIES; the lift is fenced to
`[aria-expanded="false"]`; the open head takes no affordance because its press is a no-op —
ASSERTED in the same row (press the open head → `expandedPanel` unchanged, 0 DOM mutations),
which is what licenses "inert text takes none". Ablation is by DELETING the two rules, never
`color: inherit` (that moves the computed colour and reads as a false pass — this lane's own
mistake, declared). Ink pressure ranks openness: open = foreground (or the tier's crayon),
shut = muted + the value word at the quiet rung. Focus: `2px dashed var(--ring-ink,
currentColor)` offset 3.

### 1.5 The printed count as a derivation; access 2.3 at a coarse cell

- `printed == tapes + captions + sections.length` at the assertion (all five games ship exactly
  two ControlSections; 8 holds with zero headroom and dies at a sixth game).
- `access.spec.ts` 2.3 gains a 390×844 coarse cell where `.heading-value` exists, and the cell
  OPENS each tab before sampling (six of fourteen `.ctrl-btn`s sit behind a shut tab with zero
  rects at HEAD and are still sampled — declared, cured by opening).
- The `.ctrl-word` span steals Playwright's `:text-is()` from the button: the five locators at
  zone-grammar.spec.ts:681-691 are re-aimed to `.ctrl-btn:has(.ctrl-word:text-is(…))` — declared
  up front, not rediscovered.
- ROW 2 (document rank) stays RED and is W3's; booked with the reading.

### 1.6 Paper-over-ink, per tape, per word

The paper-over-Range-ink number is the tape's padding (1.36–1.53, F4 again). The GLYPH basis
varies 7.73 (`pencils`) to 12.16 (`new game`) across four words of one face. Gate per tape on
the glyph basis with a per-word-derived band (measured at HEAD ± 1.0px), never a constant.

---

## 2 · Components and states (pass 2 §1.3 stands; the deltas)

| component | pass-2 | pass-3 delta |
|---|---|---|
| the compartment tape (printed on tape at the group rank, `1lh` pull, leading 1.05) | as pass 2 | unchanged; paper-over-glyph gated per word |
| the tab row (two printed names; openness is ink pressure) | `.is-active` dies; lift fenced | + the open head's INERTNESS asserted (law 14's licence); `padding-top: 0.35rem` stands |
| the option chip (written 20/400 lowercase; seeded scribble) | `background-size: 120%` | mark = word + 4px overhang each side; engine-identity + painted-overhang gates |
| the row caption | printed, right-aligned in the lane | `white-space: nowrap`; `align-self: flex-start`; re-priced on `what fits` |
| the desk h2s | `size` muted → foreground | unchanged |
| focus | `--ring-ink` | `var(--ring-ink, currentColor)` |
| the gallery | π, gated | π, gated; the `ch` split NAMED as the deck's ledger row |

Light and dark by the theme tokens; the contrast table of pass 2 §1.7 stands (re-read by
access.spec's `over()` compositor — this lane's alpha-blind helper is not carried).

## 3 · Copy (M16)

Zero strings minted. Rendered casing by CSS on the card only. `what fits` needs no new Fraunces
glyph (w h a t f i s all present); `pencils`/`players` need `p` (+260 B); the hand's both-cases
rule wants `A E H L M N O` (+584 B). Total +844 B, as declared in pass 2. The lowercase
authoring is a COPY RULING for U-10, carried as one.

## 4 · Motion

Tab-switch ink: `transition: color var(--motion-whisper) var(--ease-standard)` on the head and
the value word (the rung registered by TAPE, published by §13; the `duration-250` utility on the
head DIES so the row and its chips answer in one window). The scribble is a pose swap. PRM: the
rung reads 0ms. Nothing boils; filterBudget EXACTLY 9.

---

## 5 · Plan — files, order, what dies

Replay `-34` onto a worktree from `74a2b5d9` (gate scripts toward the fold: keep `paperNoteCopy`,
the `what fits` FACES row; re-apply the face MOVE and the split `optionLabels` corpora), then:
1. Fonts + gate, one commit with the CSS: `p` and `A E H L M N O` re-cuts (byte-identical to pass
   2), unicode-ranges + ledger comments; `check-font-coverage.mjs` CHECK 6 (FACE_SITES keyed by
   exact selector; first token `/^--face-/`; undeclared home RED; a law with no home RED) + the
   `zoneRowLabels` derive-count assertion (a rename must not turn the gate into a literal checker).
2. `typography.css` — the FACE LAW block; `--type-group-title: var(--type-heading)` at every
   width (`:133-137` deleted); `--type-option: 1.25rem` (`:146-168` deleted); `.section-heading`
   reads `--face-printed`; the stale header corrected.
3. `SheetWashiLabel.vue` — `.washi-tag` declares `var(--face-written)`; the `1lh` pull; the
   covenant comment.
4. `GameControlPanel.vue` — `.tray-well :deep(.washi-tag)` printed at the rung, leading 1.05;
   `.zone-row-label` per §1.1; `.tray-well :deep(.ctrl-btn)` written 400 lowercase;
   `.tray-well :deep(.ctrl-word)` the word-priced mark; `.mobile-heading-row { padding-top:
   0.35rem }`; `.is-active` deleted; the lift fenced; `duration-250` → the rung; the `:1558`
   comment re-written; `:focus-visible` reads `var(--ring-ink, currentColor)`.
5. `OptionSelector.vue` — `font-family: var(--face-mono)`; the label in `.ctrl-word`; the mark
   rules on `.ctrl-word` reading HEAD's `ch` variables (the deck's, unmoved).
6. `scripts/check-support-floor.mjs` — the `lh` floor row (§1.3).
7. Gates — `visual-regression.spec.ts` SEAL: the same restamp as TAPE (§6.1: one seal, one
   declared delta, measured on THIS tree; pass 2's 1261 is not written) with the second negative
   control; `access.spec.ts` four targets + the 390 coarse cell that opens each tab;
   `zone-grammar` `:has(.ctrl-word:text-is())` ×5; `font-census` retired rows; `face-law.spec.ts`
   promoted from `probe/` (the covenant-on-the-consumer, INK, engine-identity, painted-overhang,
   inertness rows); the heading-voice diff re-cut against 74a2b5d9 with the
   `?view=gallery&size=3&difficulty=MEDIUM` pin (r0 row MOVED, proposed under
   `pass3/prototype/CTRL-FACE/instruments/`).

Dies: two media blocks; one literal font-family; the CAD underline; `duration-250`; the
`background-size: 120%` constant; pass 2's clearance numbers. Lives on purpose: `--scribble-
width`/`--ghost-width`, `font-bold`, `rounded-md` (the deck's); ROW 2's RED (W3's).

---

## 6 · Prototype brief

Worktree from `74a2b5d9`; `127.0.0.1:4234 --strictPort`, private `cacheDir`; the HEAD control
on the next free band port (named); scratch Playwright config; both engines; settle ≥700ms;
`npx vite build` → preview for goldens/filter-census; servers killed before return.

**Crops (≤4):** (1) 390×844 dark, the pencils well: `marks` on its own line over three chips,
`what fits` one line beside two — the lane as HEAD's own pose (the memorable thing on the dock);
(2) 390×844 light, the `checking` tape over `what fits`'s ink (the re-priced gate, seen);
(3) one card chip at 4× in both engines side by side, the mark's painted extent over the word
(the engine-identity row, seen once). No fourth unless a gallery number moves > 0.25.

**Censuses:** r0 heading-voice COPY re-cut vs 74a2b5d9 + the URL pin (ROW 1 = 1 voice n=8 at
desk/dock/900×500; ROW 3 = 1.2945; the gallery cell HEAD-exact; ROW 2 RED recorded); R7 I1;
hue census COPY (Δ 0; stated); the wobble probe NOT run (no board mark touched; stated);
`shared-class-census.mjs` (3/2/3 consumers, every non-card consumer at HEAD's face); the gallery
π ×5 + chips ×6 + scribble bbox vs the control (|Δ| ≤ 0.25); the caption lane row (one line at
320/360/375/390/430/900×500 both engines; `.options-row` ≥ 95.2 for the two-chip row at 320);
the INK gate re-priced on `what fits` (paper top − ink bottom ≥ +2.0 expected; worst descender
≥ +0.5); tab head daylight ≥ +2.0 ×4 cells; the ENGINE-IDENTITY row (every card chip's mark
± 0.5 across engines; HEAD RED at 8.00); the PAINTED-OVERHANG row (2–8px each side); the
inertness row (press the open head: 0 change); law-14 by deletion at 820×1000; paper-over-glyph
per tape in band; printed count == the derivation; `check-font-coverage` (CHECK 6 RED at HEAD;
cmaps 31/53; bytes 14,896/4,896); `check-support-floor` with the `lh` row; the seal at the iPad
cell with both negative controls; `access` 2.3 at 1280 fine AND 390 coarse (tabs opened); chip
height == HEAD ± 0.5 (768–1023: HEAD − 1); filter 9; goldens 4/4 off the dist; vue-tsc, vitest,
lint:copy/ink/motion, prettier — BARE.

**Success:** voices 1 ×3 cells, 1.2945; caption one line at six cells; chips ≥ 44×44 with the
firing control; INK ≥ +2.0 on the real word; mark engine-identical ± 0.5 and painted overhang
in band; open head inert, shut head one affordance; gallery Δ ≤ 0.25 ×11 readings; CHECK 6
GREEN with derive counts; `lh` floor row GREEN; seal ≤ restamped with the table; filter 9;
goldens 4/4.

---

## 7 · Born-RED gates (RED at HEAD unless FENCE)

1. heading-voice ROW 1 + ROW 3 at desk, dock, 900×500 (HEAD 3 voices; 1.0175).
2. CHECK 6 re-cut + derive-count floors (HEAD: the literal, `.washi-tag` no face, `p` ×2).
3. THE CAPTION IS ONE LINE at six cells, both engines (HEAD printed: two lines at every phone cell).
4. THE INK GATE on `what fits` (paper over ink ≥ +2.0; worst descender ≥ +0.5) — RED at the
   pass-2 slice (−28.58 pre-reflow), FENCE at HEAD's hand rung.
5. ENGINE IDENTITY of the chip mark ± 0.5px (HEAD: 48.01 vs 40.00).
6. PAINTED OVERHANG 2–8px each side, both engines (HEAD: a `ch` mark, unbounded per engine).
7. THE OPEN HEAD IS INERT AND TAKES NO AFFORDANCE; the shut head exactly one; ablation by
   deletion (HEAD: the open head moves `color` + carries an underline).
8. PRINTED COUNT == tapes + captions + sections.length (HEAD: 2 printed).
9. `lh` FEATURE-FLOOR row in check-support-floor (RED if the floor drops below the unit; the
   build grep is a labelled guard).
10. CONTRAST_TARGETS + four sites, floor 4.5, at 1280 fine AND 390 coarse with tabs opened
    (HEAD: n rises 4 → 8; hidden chips sampled).
11. Hand weight 400 on every card chip and value word (HEAD: selected 700).
12. Gallery π cell — FENCE (HEAD-exact; RED under any shared-rule leak).
13. Tape covenant on the consumer — FENCE at the card, π on the gallery.
14. Paper-over-glyph per tape in its own band (HEAD-measured ± 1.0) — FENCE.
15. The seal restamped WITH its second negative control (captions to the hand rung → falls
    ≥ 28px; at HEAD the ablation moves 0 → RED).
Standing, bare: tap floor per dimension + control; filter 9; font-census both arms; goldens;
lint:copy/ink/motion; support floor.

TO THE CHAIR: law 14's row (the open head as inert — both arms buildable); the deck's `ch`
engine split (a ledger row for the deck's owner, cure stated); the third seal re-price is
TAPE's one restamp (§6.1), not a second constant.
