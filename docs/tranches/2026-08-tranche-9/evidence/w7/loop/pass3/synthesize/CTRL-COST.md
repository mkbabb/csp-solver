# T9-W7 · pass 3 · SYNTHESIZE · CTRL-COST — the ask costs nothing (the consequence ladder)

Section §10 with §15 at its centre · marks M01 M03 M04 M05 M12 M13 · pass-2 62 with one
BLOCKING row (WebKit's second press). Synthesizer: Fable 5.1 (frontend-design invoked).
Read-only on the product. Inputs: `../CHAIR-RULINGS.md` (§4 the merge watch, §6.4 the width
law, §6.5), the pass-2 spec (`../../pass2/synthesize/CTRL-COST.md`, STANDS where not amended),
the pass-3 research (`../research/CTRL-COST/README.md`, `readings/r1-r4.json`), registry-v2,
r0 R6/R7, the owner's frames. Base `74a2b5d9`. A SEPARATE route; the agglomerator decides
the fold. Nothing closes (U-10).

**The merge watch, answered from this side: YES on both halves.** The pin band is one mechanism
with two publishers (TAPE derives from a type rung; COST samples the first head — and the sampled
band is engine-split 38/41/42 and adequate only because the first head happens to carry the desk's
info button). `useTwoTap` and `askingAct` are one machinery (armed ref, one timer,
`confirmWindowMs`, fire-on-second-press, teardown) with two POLICIES (who asks, on which pointer,
whether the answer is a real control). So this spec is written the way chair §4 says a folded
family returns: the centre re-expressed on the section's substrate, plus a GRAFT LIST, plus the
two policy rows carried up to W1 §1.5 / U-10 rather than dying in a merge. It stays buildable
standalone as the four-band ladder for the owner's frame.

---

## 0 · The plan re-read, then the tell review

**Subject.** A ladder of consequence: four bands named for what they cost the board — `looking
· writing · starting over · players` — each act drawn by its cost. The memorable thing: the face
that asks without moving anything.

**Tokens.** No new hex; the 8% tier-3 ground stays RETIRED; `--ring-ink` consumed
`var(--ring-ink, currentColor)` (this tree's mint at index.css:199 STRUCK, registry §2.4).

| role | token | light | dark |
|---|---|---|---|
| paper | `--color-card` | #FDFDFC | #131211 |
| ink | `--color-foreground` | #0A0A0A | #EDEBE7 |
| band names, captions, tally | `--color-muted-foreground` | #737373 (4.66) | #A8A69F (7.69) |
| the asked word | `--color-red-ink` on BARE card | #D02A52 (4.99) | #FF5C7C (6.30) |
| hover ground (boxed faces, `hover:hover`, NEVER the destructive word) | `--color-accent` | hsl(48 8% 96.1%) ≈ #F6F5F3 | hsl(24 5% 15%) ≈ #282524 |
| focus | `--ring-ink` (consumed) | | |
| tap floor | `--tap-floor: 2.75rem` (44px) | | |

**Type.** Fraunces 800 lowercase at `--type-group-title` = `--type-heading` (25.888) for the four
band names at every width; Patrick Hand captions (`--type-tag`), act words (`--type-verb`), the
asked word at `--type-act`; Fira Code chips 20px.

**Layout, one sentence.** Four bands in a scrolling card whose top padding is the DERIVED pin
band the pinned head lives inside; each head is one line box (name left, the note's berth
right, children held to `1lh`); acts drawn by tier; the card's width is the legend fold's and
nothing inside out-measures it.

```
 ┌ case ═════════════════════════════════════════════════════════╗
 │▒▒▒▒ --pin-band = 0.6rem + --cost-head-h (DERIVED: 37.47) ▒▒▒▒▒│ ← the pinned head's only home
 │ looking                        ┆ show every digit that fits   │   head = 1lh, four heads one height
 │   marks      normal corner center                             │
 │   what fits  off on          checking  off ask live           │   ← contain: inline-size (wraps, prices 0)
 │ writing                                                       │
 │   undo  redo  hint            ← rung 1 (179.59)               │   ← the act row in TWO rungs,
 │   ╔fill╗ ╔solve╗              ← rung 2 (136.78)               │     both under the ruler 284.22
 │ starting over                                                 │
 │   ╔════════╗ ╔═════════╗  dealt ⊪                             │
 │   ║  ⚄     ║ ║  ✕      ║        rest: word `deal`             │
 │   ║  deal  ║ ║  clear  ║        armed: word `sure?` in red,   │
 │   ║ ┏ no ┓ ║ ║ ┏ no ┓  ║        the `no` foot VISIBLE, drawn  │  the face 2.5; `no` 1.5
 │   ╚════════╝ ╚═════════╝        1.5, 56×44 (44×44 desk)       │
 │ players    play together  share  · roster ·  leave            │
 └═══════════════════════════════════════════════════════════════╝  ruler: card width == legend max-content + padding
```

**Principles.** Pass 2's five stand. Added: (6) **the card's width is a ruler, not a number** —
it is the legend fold's max-content per engine (324.22 chromium / 332.31 webkit at HEAD, an
8.09px engine split), so the law is "nothing out-measures the ruler", never a pinned literal
(chair §6.4 with the research's caveat). (7) **a pointer arm moves no focus** — the cause of the
blocking row is that WebKit does not focus a pressed button, so the arm's own `focus()` was the
only thing putting focus in the face and the next pointerdown blurred it to BODY.

**The tell review.** (a) Cream + serif display + one red is the house, brief-pinned. (b) The
armed face's `no` was reviewed twice: pass 2 made it a real control; this pass makes it DRAWN at
1.5 inside the 2.5 face — the section's weight-ranked confirm (TAPE §2.5), so the destructive
channel is weight + red, never a ground. (c) The hover ground on `.act-face` is fenced OFF the
destructive word (registry §3.12: red on the accent ground reads 4.693 light, AA by 0.193). (d)
The first draft of the width cure reached for `flex-wrap` — measured useless (wrapping answers
layout, not intrinsic sizing; `.band-acts` prices 325.97 with wrap declared). Revised: two rungs
+ `contain: inline-size` on the wrapping row. (e) Motion: nothing unbidden.

---

## 1 · The rows, each with its number

### 1.1 BLOCKING ROW 1 — the ask on WebKit: a pointer arm moves no focus (cure c, belt a)

```ts
// GameControlPanel.vue — askingAct/useTwoTap: the input-split focus contract
press(e) {
  if (armed.value) return fire();
  arm();
  if (e.pointerType === '' || e.detail === 0) {           // keyboard: the safe answer takes focus
    void nextTick(() => answerEl.value?.focus({ preventScroll: true }));
  }                                                        // pointer: focus stays where it is (0 focusouts on WebKit)
}
leftFace(e) { const to = e.relatedTarget; if (to instanceof Node && !face.contains(to)) disarm(); } // null ≠ departure (the belt)
```

Measured basis (readings/r1.json): `armFiredFocusoutOnFace` 0 in both WebKit cells with nothing
focused in the face; the arm's +15/+16px scroll is the reveal-plus-focus, 0.00 with
`preventScroll`; the rAF re-check (cure b) resolves 15–25ms after pointerdown, always after the
click — not needed. `disarmElsewhere` (pointerdown.capture) and the 2500ms lapse cover real
departures. A reader who arms by touch then reaches for the keyboard has no focused answer: the
window and `disarmElsewhere` cover them — SAID in the record, not implied away.

### 1.2 BLOCKING ROW 2 — the ruler law (chair §6.4, engine-honest)

- `.band-acts` 325.97 (play-controls 179.59 + fill 63.59 + solve 63.59 + 2×9.6) → TWO rungs:
  `[undo redo hint]` 179.59 and `[fill solve]` 136.78, both under 284.22 / 292.31. A
  `grid-template-rows` pair, not a wrap.
- `.ctrl-options.options-row` in the marks band 302.42 / 305.19 (3 × 96.02 + 2×7.2) →
  `contain: inline-size` (contribution 0, content reflows; a 96px chip never overflows 284).
  SAFE only while an uncontained child still prices the card — the gate asserts the RULER.
- Everything else ≤ 233.50. Card width per engine == HEAD's; board x unchanged (131.89 /
  127.84); three goldens green by construction, no re-mint.

### 1.3 The pin band, DERIVED (the merge watch's first half)

`--cost-head-h: calc(var(--type-group-title) * 1.2 + 0.4rem)` = 37.47 predicted vs
37.45/37.44 measured on every plain head; the `looking` head's 32px `BUTTON.info-btn` is held to
the heading's line box (`.cost-band-head > * { max-block-size: 1lh }`, CTRL-FACE's `1lh` graft)
so all four heads are one height (40.39/41.44 → 37.45). `--pin-band: calc(0.6rem +
var(--cost-head-h))`; the ResizeObserver term at GCP:738-744 DIES; `--pin-band` and
`--card-pad-t` registered by TAPE's §6.5 block (cited); `.controls-card::after`'s four
`--card-pad-b, 0px` struck AFTER the block. The `.band-row` dead-gap row does NOT reproduce
(two live selectors; the critic's lines are `.act-face`'s own gap) — corrected against interest.

### 1.4 The asking face — the memorable thing, weight-ranked

| state | `.act-verb` word | `.act-answer` | ink | focus | AT |
|---|---|---|---|---|---|
| rest | `deal` / `clear` | `visibility: hidden`, box kept (44 tall) | fg | — | name `Deal a new board` |
| armed | `sure?` w600 | visible `no`, drawn HandDrawnOutline pose 0 **1.5** inside the **2.5** face | `--color-red-ink` on bare card | keyboard arm → `no` (preventScroll); pointer arm → unmoved | verb `Press again to deal a new board`; `aria-describedby` on the VERB only — the answer's own name `no` and description "keeps the board" (a second sr-only span; one sentence per act) |
| disarm | rest | hidden | — | back to the verb only if focus was inside the face | restored |

Boxes: `no` 56.00×44.00 at 390 (face 73.59×123.97) and **44.00×44.00 at the desk** — zero
headroom on the floor, gated per dimension with the firing control. GCP:569's stale 73.59×44 is
corrected. The hover ground (`--color-accent`) applies to `.act-face` at rest only; the armed
face has NO ground (`[data-armed] { background: none }`) so the red word reads 4.99 / 6.30.

### 1.5 The berth in the head — ~1px of vertical padding

Measured: the berthed tape's ink 0.61 above / 0.12 below its 36.50 label; `padding-block:
0.5px` predicts 37.72 tall against a 4.00 budget (overhang 3.88 → 0.12 of margin). Gate: ink ⊂
label box; head height unmoved (37.45 ± 0.05). If the margin goes negative under a type re-cut,
the record moves the pin band and re-prices the seal (declared), never a silent overhang.

### 1.6 Housekeeping with numbers

- `MOTION.inkLiftMs` (0 consumers) DIES; the eight `150ms` literals read `var(--motion-whisper)`
  (registered by TAPE, published by §13; `visibility 0s linear var(--motion-whisper)` collapses
  to 0 under PRM by the ladder).
- Band 3 (`starting over`) gets its two NOTES rows (`deal`: "a new board replaces this one";
  `clear`: "every digit you wrote is erased") — two copy rows paid through check-copy-register
  and the coverage corpus; the empty-by-construction NOTES list at GCP:441-456 and BOUND_TAPES's
  four-band pin then agree. The berth is absolute, so the height is unmoved.
- CSS-claim witnesses land as a NODE gate (O-12: CI is browserless): `scripts/check-cost-face.mjs
  --self-test` asserts the DECLARATIONS — `.act-answer` takes `min-height: var(--tap-floor)`,
  `.controls-card` padding-top is `var(--pin-band)`, the head's `top` is `calc(0.6rem -
  var(--pin-band))`, the berth label carries `padding-block`. The browser rows stay local.
- `GameScene.vue:187-199`'s comment (says the panel publishes `--card-pad-t`; it does not) is
  re-written.

---

## 2 · The graft list (chair §4; what folds into TAPE if the agglomerator folds)

1. `.act-face` — one drawn-box face (2.5 destructive / 2 act), the drawn `no` at 1.5, the
   hover ground fenced off the destructive word, the coarse floor per dimension.
2. The input-split focus contract (§1.1) — adopted by TAPE §2.5 already; the row "press 1 arms
   with 0 focus moves and Δ scrollTop 0; press 2 fires; both engines".
3. The berth-in-the-head (§1.5) with its 0.12px margin stated.
4. The ruler law + golden-attribution rig (§1.2; `probe/r2-width-and-head.mjs`).
5. The derived band (§1.3) — the closed form TAPE already has; COST's sampled publisher dies.
6. The node gate for CSS claims (§1.6).
THE POLICY ROWS THAT MUST NOT DIE IN THE MERGE (to W1 §1.5 / U-10): (i) the ask is
POINTER-AGNOSTIC (M12: "any destructive action"; the desk asks too); (ii) the answer is a REAL
control (`no`, ≥ 44 per dimension, in the a11y tree), not a name swap alone.

## 3 · Copy (M16)

Bands `looking · writing · starting over · players`; captions as HEAD; `sure?` · `no`; the two
new notes above (plain, no dash, lowercase by CSS). `players` needs Fraunces `p` (+260 B).
`ADMITTED` stays empty.

## 4 · Motion

| moment | what | duration | curve | home |
|---|---|---|---|---|
| arm / disarm | opacity crossfade of the stacked words; `visibility` flips at the ends | `var(--motion-whisper)` 150 | `--ease-standard` | §13's ladder |
| hover ground (boxed faces at rest) | background/color | `var(--motion-whisper)` | `--ease-standard` | §13's ladder |
| the disarm window | JS timer | 2500 | — | `MOTION.confirmWindowMs` (a hold) |
| focus move on a keyboard arm | none (same frame, preventScroll) | 0 | — | — |
| sticky heads | nothing | | | |

PRM: the crossfade collapses to the visibility swap. Desk and dock one grammar; light/dark by
tokens only.

---

## 5 · Plan — files, order, what dies

Replay `-30` onto a worktree from `74a2b5d9` (gate scripts toward the fold), then:
1. `index.css` — this tree's `--ring-ink` mint STRUCK; consumers `var(--ring-ink, currentColor)`;
   the `150ms` literals → `var(--motion-whisper)`; Fraunces `p`.
2. `GameControlPanel.vue` — `askingAct` per §1.1 (or TAPE's `useTwoTap` with the policy rows);
   `.act-answer` drawn 1.5; armed face no ground; `--cost-head-h` derived, the observer term
   deleted; heads held to `1lh`; `.band-acts` two rungs; `.options-row` `contain: inline-size`;
   the berth's `padding-block`; NOTES band 3; `aria-describedby` split; :569 corrected.
3. `scene.css` — AFTER TAPE's block: `::after`'s four fallbacks struck; `padding-top:
   var(--pin-band)`; portrait seam consumed, landscape `4rem`.
4. `pencilConfig.ts` — `inkLiftMs` deleted; `confirmWindowMs` kept (consumed).
5. `GameGallery.vue` — the guard's `.act-face` fixture carries the fence; L5 untouched.
6. `scripts/check-cost-face.mjs` (+ package.json `--self-test` row) — the node witness.
7. Tests — the 22 e2e re-aims; `GameControlPanel.test.ts` toward the fold; `check-font-coverage`
   corpus (bands, captions, `sure?`, `no`, the two notes); `check-copy-register` bare.
8. Instruments under `pass3/prototype/CTRL-COST/instruments/`: `r1-focus-model.mjs` re-run as
   the press-count row; `r2-width-and-head.mjs` vs the 74a2b5d9 control (the ruler); `r4-heads`
   (four heads one height); the berth's Range row; the occlusion predicate with
   `belowExemptBand` at dock 58/116 + desk 0–350.

Dies: the sampled band's observer term; `inkLiftMs`; this tree's `--ring-ink` mint; the four
`::after` fallbacks; the stale 73.59×44 figure; the empty NOTES bucket. Stays: every W2
mechanic; `BoilDivider` ×1; filterBudget 9; the note berth's rule.

---

## 6 · Prototype brief

Worktree from `74a2b5d9`; `127.0.0.1:4233 --strictPort`, private `cacheDir`; the HEAD control
on the next free band port (named); scratch Playwright config; both engines; settle ≥700ms;
goldens + filter-census off `npx vite build` in the worktree; servers killed before return.

**Crops (≤4):** (1) 390×844 light, `starting over` at rest and ARMED on `deal` side by side —
the same box, the drawn `no` visible at 1.5 inside the 2.5 face, nothing moved; (2) the same
pair in dark (#FF5C7C on bare card); (3) 1280×800 light, the `writing` band's two rungs with the
card at HEAD's width beside the HEAD control (the ruler, seen). No fourth.

**Censuses:** r0 heading-voice COPY (4 names, 1 voice, `<h2>` 4/4, 1.2945); R6 hue census COPY
vs the control (29 rows); law-probe COPY (L1 = 9; L3 the chair's wave-wide RED reported; R3/L5
GREEN); R7 I2′/I3′ (5 states; desk, dock, 900×500, 844×390 — I3′ the SHORT port) / I4 (the deal +
clear arms; fill/solve are W1 §1.5's); THE PRESS-COUNT ROW (pointer: press 1 arms, 0 focusouts
on the face, Δ scrollTop 0.00; press 2 fires — board CHANGES; keyboard: Enter arms + focus on
`no`, Enter disarms, board unchanged; Shift-Tab + Enter deals; Escape disarms, sheet stays; both
engines, 390×844 touch + 1280×800 mouse); THE RULER ROW (card width == legend max-content +
inline padding per engine; board x |Δ| ≤ 0.05 vs 74a2b5d9; every child max-content ≤ ruler);
four heads one height (37.45 ± 0.05); the band = 0.6rem + head (43.05 ± 0.05) with the head's
occlusion 0 below the exempt line; the berth's ink ⊂ label; the tap floor per dimension incl.
`no` 56×44 / 44×44 with the firing control; painted contrast (asked word ≥ 4.5 both themes on
bare card; `no` word; armed + hovered destructive word ≥ 4.5 — the fence proven); the gallery
π ×5 vs the control; TAPE's registration/publisher rows cited and run; W2 §2.2's reachability
×2 landscape cells GREEN, card clientHeight reported; `check-cost-face --self-test` RED at HEAD,
GREEN here; `check-theme-selectors`, `check-live-regions` (10/0), `check-font-coverage` (+260
B), `check-copy-register` (ADMITTED 0, the two notes paid), prettier, `lint:motion`, vitest —
BARE; filter EXACTLY 9; goldens 4/4 off the dist, attributed vs the control.

**Success:** every row at its number; goldens 4/4 with card width == HEAD per engine; the crops
show one box that asks without moving and a `no` a thumb can hit.

---

## 7 · Born-RED gates

| id | row | at HEAD | here |
|---|---|---|---|
| G5″ | a tier-3 press on a dirty board writes 0 and arms on BOTH pointer classes | RED (desk deals at once) | GREEN |
| G6′ | zero reflow with the `no` foot visible, Δ [0,0,0,0], 3 cells, 2 engines | RED | GREEN |
| G14′ | THE PRESS-COUNT ROW (pointer press 2 FIRES on WebKit; 0 focusouts on arm; Δ scrollTop 0; keyboard: second Enter lands on `no`; Escape disarms, sheet stays) | RED (WebKit never fires; +16px scroll) | GREEN |
| G15′ | `no` in the a11y tree, drawn 1.5 inside the 2.5 face, ≥ 44 per dimension with the firing control (desk exactly 44.00) | RED | GREEN |
| G16′ | the pinned head covers 0 below the exempt line; band == 0.6rem + derived head; four heads one height | RED (sampled 38/41/42; 40.39 head) | GREEN |
| G20 | THE RULER: card width == legend max-content + padding per engine; board x |Δ| ≤ 0.05 vs 74a2b5d9; no child max-content > ruler | RED on the pass-2 tree (+41.75) | GREEN |
| G21 | the armed + hovered destructive word ≥ 4.5 light (the fence) | RED (4.693) | GREEN |
| G22 | the berth's ink ⊂ its label box; head 37.45 ± 0.05 | RED (0.61 over) | GREEN |
| G23 | `check-cost-face --self-test` (the node witness) | RED | GREEN |
| G9′ | asked word ≥ 4.5 light on bare card | RED (4.20 on the 8% ground at pass 1) | GREEN (4.99) |
| G12′ | `check-font-coverage` exit 0 with `players` in Fraunces | RED | GREEN |
| Guards | seam ≥ 8 portrait ×3 (consumed); reachability ×2 landscape; filter 9; hue 29; gallery Δ 0.00; live regions 10/0; goldens 4/4; L5 GREEN; M16 0 | hold | |
