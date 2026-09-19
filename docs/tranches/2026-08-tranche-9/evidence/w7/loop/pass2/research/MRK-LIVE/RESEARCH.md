# PASS-2 RESEARCH · MRK-LIVE · The living mark

Section §5 wobble law · §6 focus rings. Read-only on product files: every cure below was
injected as a runtime stylesheet or read as a computed value, never written to source.

- Subject: the pass-1 prototype worktree `.claude/worktrees/wf_e58b4764-0fc-44` (16 files
  modified + `FocusRing.vue` untracked, unchanged by this lane), served on `127.0.0.1:4238`
  through `probe/vite.scratch.config.ts` (private `cacheDir`, removed after the run).
  The server is dead; the port is free.
- Instruments: `probe/p2.probe.ts` (ten tests, both engines) and `probe/token-table.mjs`
  (pure arithmetic over this lane's own logs). Logs: `logs/` — 26 JSON files, **zero crops**,
  172 KB total.
- Every browser number below is CHROMIUM AND WEBKIT and they agree, to the byte where the
  reading is a byte and to the frame where it is a frame, unless the row says otherwise.

---

## 1 · The rows this lane closed with a number

### 1.1 The cascade reach, and two cures that work in both engines · charter 1

The defect reproduces exactly as the critique states (`logs/A-cascade-*.json`, cell 40
focused, three still tiers induced by class):

| tier | ink | pose 0 | poses 1–3 |
|---|---|---|---|
| 3 conflict `.is-invalid` | `rgb(232,49,91)` | 1 | **0** |
| 4 peer cursor `.is-peer-cursor` | `rgb(37,99,235)` | 1 | **0** |
| 1 hover `.cell-ghost.is-active` | `rgb(38,38,38)` | 1 | **0** |

The mechanism, named precisely: `gameCell.css` is consumed as
`<style scoped src="@/games/shared/gameCell.css">` (`DigitCell.vue:427`), so every selector in
it is compiled with a `[data-v-…]` suffix. The shipped swap rule is therefore
`[data-mark-pose="1"] .cell-ghost-path:nth-of-type(1)[data-v-…]` at **(0,4,0)**, unlayered —
which is why a naive (0,3,0) override does not touch it (measured: the first cure attempt
changed nothing in either engine). Any cure has to clear (0,4,0) and stay unlayered.

**Both candidate scopes were injected and measured, and both hold in both engines.** The
living cell's own four-path swap is byte-for-byte unchanged under each (`1,0,0,0` → `0,1,0,0`
→ `0,0,1,0` → `0,0,0,1`), and all three still tiers hold opacity **1** at every pose:

| cure | selector shape | specificity | result |
|---|---|---|---|
| **A** gate on the living cell | `[data-mark-pose="N"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(…)` | (0,5,1) with the scope attribute | still tiers 1/1/1 at all four poses, living swap intact, chromium + webkit |
| **B** gate on the structure | `[data-mark-pose="N"] .cell-ghost-path:nth-of-type(1):has(~ .cell-ghost-path)` | (0,4,0)+`:has` | same |

Cure A is the one to ship: it names the design law (*the living cell is the focused cell*) in
the selector, it is the same `:has(input:focus-visible)` predicate tier 2 already uses
(`gameCell.css:267`), and it survives any future change to how many paths a cell carries.
Cure B is cheaper to author but encodes "the living cell is the one with extra siblings",
which is a fact about the implementation rather than about the design.

A third option — writing `data-mark-pose` on the CELL instead of the grid — is NOT
recommended and needs no measurement to refuse: the prototype already measured the cost of
moving the pose through the `v-for` (every cell re-rendered at 8 Hz; WebKit's 16×16 phone
traversal crossed 33 ms twice), and a per-cell attribute binding re-evaluates the whole
`v-for`'s props on each beat even when one value changes.

**The gate this lands with** (born-RED against the pass-1 build, which fails it):
`G-LIVE-8 · the living mark turns off nothing else` — with cell 40 focused, a conflicting
cell, a peer-cursor cell and a hovered cell each compute `.cell-ghost-path` opacity **1** at
`data-mark-pose` 0, 1, 2 and 3, both engines.

### 1.2 The settle arithmetic, corrected · charter 3

`useMarkPose` (`boilBeat.ts`, the pass-1 diff) is `elapsed = beat − start`, pose `0` when
`elapsed ≤ 0` or `elapsed ≥ markSettleBeats`, else `elapsed % frameCount`. With
`markSettleBeats === frameCount === 4` that is **exactly four swaps, in the sequence
1 → 2 → 3 → 0**, the first one beat after the landing and the last four beats after it.

Because the landing lands at an arbitrary phase φ ∈ [0, beatMs) inside the beat, the wall
times are `(125 − φ)` and `(500 − φ)`. Six independent samples now exist:

| run | first swap | last swap |
|---|---|---|
| prototype chromium / webkit | 48 / 64 ms | 423 / 446 ms |
| critique chromium / webkit | 116 / 40 ms | 491 / 430 ms |
| **this lane** chromium / webkit (`logs/F-settle-*.json`) | **90 / 33 ms** | **457 / 401 ms** |

So the design's number is **4 swaps, last in (375, 500] ms** — never "~6 swaps, last ~618 ms".
The spec sentence is what is wrong; the build is right. PRM: **0 swaps, final pose 0**, both
engines.

**Tightened gate.** G-LIVE-2 becomes: *exactly 4 swaps; the pose sequence is `1,2,3,0`; the
first within one beat of the landing (≤ 125 ms + scheduler jitter; measured band 33–116 ms);
the last in [375, 500] ms (measured band 401–491); 0 swaps in the following 3 s; final pose 0;
under PRM, 0 swaps.* Every clause can fail: a fifth swap, a wrong sequence, a last swap at
618 ms, all red it.

### 1.3 The phase question · charter 2

The first swap lands at 33–116 ms, always inside the 180 ms `ghost-draw-on`. Three ways out,
priced:

1. **Rewrite §5's sentence.** "Draw-on THEN one revolution" becomes "the mark is alive from
   the frame it arrives: the draw-on and the first breath overlap." Costs nothing, and it is
   the honest description of what four independent runs measured.
2. **Delay to the first beat after the draw-on.** `elapsed > 2` (250 ms ≥ 180 ms) pushes the
   last swap to `750 − φ` ms, **outside G-LIVE-2's own 700 ms window** — so this option
   re-opens a gate the family already banked. Refuse it or move the window with it.
3. **Make the arrival the first pose change.** Start at pose 1 on the landing frame rather
   than pose 0, so the sequence reads `1(arrival) → 2 → 3 → 0` and the first change is
   same-frame. This is already §2.5's stated rule for the chrome ring ("no draw-on: the
   movement is the arrival"); adopting it on the board makes one sentence cover both
   surfaces. It does NOT disturb "pose 0 is `generateCellRects`' output byte for byte",
   because pose 0 is still what it rests on.

Preference: **1 + 3 together** — the sentence tells the truth and the two surfaces stop
having two rules.

### 1.4 The board stop's painted ring, both themes · charter 7, G-LIVE-5's missing row

Sampled off screenshots, not computed: an empty cell, blurred then focused, the pixel of
maximum change (`logs/C-boardring-*.json`). Both engines agree to one byte.

| theme | painted ring | cell ground | interior under focus | ring vs ground | ring vs its own fill |
|---|---|---|---|---|---|
| light | `75,135,201` | `253,253,252` | `238,243,247` | **3.68** | **3.35** |
| dark | `54,114,180` | `19,18,17` | `23,27,31` | **3.76** | **3.48** |

The arithmetic model reproduces the measurement to one byte
(`0.9 × ink + 0.1 × (0.08 × ink + 0.92 × ground)` → 75.9 light, 54.4 dark), which is what
licenses the candidate table in §2 below.

Two things follow, and the second is the one the section must carry:

- The board stop **clears 1.4.11 on both themes**, with 0.35 / 0.48 of headroom against its
  own fill. The old comment's light-mode "3.60:1" was close; there is now a dark figure,
  3.76 / 3.48, where the estate had none.
- **§6's "4.19–4.38 on four grounds" is the CHROME ring, at stroke-opacity 1.** The board
  ring — the mark §5 is actually about — reads **3.34–3.48 at its worst**. The family's
  headline number and its own board's number are 0.85 apart, and the smaller one is the
  floor. Any sentence about this token must carry both.

### 1.5 The deck's masked fallback · charter 6

`logs/D-deckfallback-*.json`, identical in both engines:

| state | `aria-activedescendant` | `.gallery-viewport` matches `:focus-visible` | computed `outline-style` | `.focus-ring` count |
|---|---|---|---|---|
| as shipped | `gallery-card-0` | — | `none` | **1** |
| attribute removed, scrollport focused | absent | **true** | **`none`** | **0** |

Zero focus indicator, both engines. `outline-width` computes `3px` and `outline-style`
computes `none`, which is the Tailwind-v4 trap `gameCell.css:296` already documents: a width
without a style paints nothing.

**Gate:** `G-LIVE-9 · no stop is unmarked` — with `aria-activedescendant` removed and the
scrollport focused, either a `.focus-ring` exists or the focused element computes a solid
outline. Born RED on the pass-1 build.

**Cure candidates** for the synthesizer, in order of cheapness: (a) when the rank-1 lookup
yields an EXEMPT element and no activedescendant is declared, fall through to the
scrollport's FIRST option (`[role="option"]`, or `.game-card.is-center`) rather than to
`null`; (b) keep the card-side outline as the deck's floor (this is the `spoken-gallery`
ballot in §3.3); (c) drop `.gallery-viewport` from `EXEMPT` — refused, it is §3.7's own rule.

### 1.6 The armed ribbon frames the wrong thing · NEW, not in any pass-1 gap list

When the guard ribbon arms (deal on a dirty board), `document.activeElement` is
`.gallery-guard` — the ribbon CONTAINER, `tabindex="-1"`, focused programmatically. Measured
(`logs/J-armframe-*.json`, `logs/I-suppressions-*.json`), both engines:

- the container **matches `:focus-visible`** (both engines — this refutes the pass-1 note
  that "programmatic focus does not match `:focus-visible`, so G-LIVE-6 does not see it");
- it computes `outline-style: none` (`.gallery-guard:focus { outline: none }` survives, and
  `@layer base :focus-visible { outline: none }` would suppress it anyway);
- **one `.focus-ring` is drawn, and it frames the container**: ring `326 × 115.78` on a
  guard box of `320 × 109.78` = **35,130 px²**, against either verb's **1,563 px²**. A
  **22.5×** area error.

This is the same species as ringing the 1056 px scrollport — the defect `EXEMPT` exists to
prevent — and the ribbon container is not in `EXEMPT`. Two cures: add `.gallery-guard` to
`EXEMPT` (and let the ring appear when a verb takes focus), or move the arming focus onto the
default verb (`.guard-btn.guard-keep`) so the ring lands on something a reader can act on.
The second is better AX as well: `aria-modal` containment does not require focusing the
container itself.

### 1.7 The two deleted rings DO have stops, and the ring collides with the drawn frame · charter 5

Both stops were reached and measured (`logs/E-deletedrings-*.json`, `E2-armed-*.json`,
`E3-guardstop-*.json`). The gallery route is not `/` — the board boots and the wordmark opens
the deck; the ribbon arms only on a DIRTY board via `.staging-btn.staging-deal` →
`attemptDeal()` (`GameGallery.vue:649-666`). Both stops: exactly **1** `.focus-ring`,
`outline-style: none` on both the button and its face, `errPx 0.00`.

But the geometry is a collision, and it is the same on both stops in both engines:

| stop | button box | drawn frame (`HandDrawnOutline`) | drawn ring | ring vs frame |
|---|---|---|---|---|
| `.staging-btn` | `86.39×40 @ (715.22, 690.19)` | `90.39×44 @ (713.22, …)` — outset 2, stroke 2 | `92.39×46 @ (712.22, …)` — outset 3, stroke 2.5 | **painted bands overlap by 1.5 px** |
| `.guard-btn.guard-leave` | `55.06×28.39 @ (294.94, 568.80)` | `59.06×32.39 @ (292.94, …)` — outset 2, stroke 2.5 | `61.06×34.39 @ (291.94, …)` | **overlap 1.5 px** |

Worked for the staging stop: the frame's path centreline sits at `btn − 2 + 1`, so it paints
`[btn−2, btn]`; the ring's centreline at `btn − 3 + 1.25`, painting `[btn−3, btn−0.5]`. The
shared band is `[btn−2, btn−0.5]` = 1.5 px of one line drawn on top of another.

This is MRK-ABS's graft taken literally — clearance against the NEIGHBOUR'S PAINTED BAND, not
the nominal box — and it converts into one number the synthesizer can spend:

> **required `--focus-ring-outset` = frameOutset + frameStroke/2 + ringStroke/2 + air.**
> For a control wearing `HandDrawnOutline :outset="2" :stroke-width="2"` and a ring at stroke
> 2.5: **4.5 px for touching, 5.5 px for 1 px of air, 6.5 px for 2 px.** The house default is
> **3**, which is 1.5 px short of touching.

It also explains what the two deleted rules were FOR: both said "the focus ring rides the
FACE, so it traces the drawn box rather than a zero-padding button that is now smaller than
the frame around it" (`StagingBand.vue:424`, `GameGallery.vue:1449`, both deleted in the
pass-1 diff). Measured, the button and the face are the SAME box; it is the drawn FRAME that
is bigger. The old rule dodged the collision by riding the face at `outline-offset: 4px`
(face + 4 = btn + 4, outside the frame's `btn − 2`… wait, outside on every side by 2 px).
The drawn ring has to buy that clearance back with its own outset.

**Gate:** `G-LIVE-3` gains both stops by name, and gains a clearance assertion:
*at every stop that wears a drawn frame, the ring's painted band and the frame's painted band
are disjoint with ≥ 1 px between them.*

### 1.8 The landing burst is real, and its bound is in the wrong unit · charter 13

One real `ArrowRight` on the deck, with every attribute mutation on `.focus-ring` timestamped
(`logs/G2-landing-*.json`):

| engine | attribute writes | first | last | span | landed `errPx` | idle writes / 900 ms |
|---|---|---|---|---|---|---|
| chromium | **180** | 6 ms | 361 ms | 355 ms | 0.05 | **0** |
| webkit | **115** | 11 ms | 465 ms | 454 ms | 0.00 | **0** |

Each re-measure writes ~5 attributes (`style`, `width`, `height`, `viewBox`, plus the paths'
`d`), so 180 ≈ **36 frames** and 115 ≈ **23 frames**. Chromium hit the `frames++ > 36` cap
exactly, at **361 ms**; WebKit stopped on stillness at 454 ms.

That is the finding: **the cap is counted in FRAMES but the thing it must outlast is a
DURATION.** On this 120 Hz machine 36 frames is 300–360 ms, shorter than `cardStepMs` 440, and
chromium's ring consequently stopped re-measuring while the card was still moving — it landed
0.05 px off, where WebKit (which ran to stillness) landed 0.00. On a 60 Hz display the same
cap is 600 ms and the problem does not appear. A time bound (`performance.now() − t0 >
MOTION.boardFoldMs`) is refresh-rate-independent; a frame bound is not.

**Name the law this way** (it is the implementation that is right, not the §2.2 sentence):

> Position is event-driven — capture-phase `scroll`, `resize`, and a `ResizeObserver` on the
> target. A LANDING may re-measure until its box is still, because a WAAPI transform fires
> none of those three; that window is bounded by stillness (three identical frames) and by
> the estate's longest one-shot (`boardFoldMs` 520 ms), whichever comes first. There is no
> permanent subscriber: measured, **0 writes per 900 ms of idle**, both engines.

The refusal §2.2 recorded ("never rAF") was refusing the `follow: 'raf'` FOLLOWER, which
measured 255 repositions per 900 ms of idle. That refusal stands and the burst does not
contradict it — but the sentence has to say which shape it refuses.

### 1.9 The armed verb, built and measured · charter 4

It is wired and it works (`logs/H-armedverb-*.json`, sampled at 60/180/320/460/620/900/1600 ms
after the arm):

| engine | active pose by sample | rests at |
|---|---|---|
| chromium | 1 · 2 · 3 · 0 · 0 · 0 · 0 | pose 0 by 460 ms |
| webkit | 0 · 1 · 2 · 0 · 0 · 0 · 0 | pose 0 by 460 ms |

Two facts the frame owes the owner at the re-look (U-10 — this lane disposes nothing):

- **Only the destructive verb breathes.** `.guard-keep`'s face stays `:pose="0"` and stays
  pruned (`is-pruned` true at every sample); `.guard-leave`'s face un-prunes on its first
  pose change. One verb marked, one still — which is the same grammar the ribbon already uses
  for stroke weight (2 vs 2.5) and the 8 % ground.
- **It leaves four promoted layers behind.** `.boil-pose` goes `will-change: auto` →
  `opacity` on the first pose change and the latch is one-way
  (`HandDrawnOutline.vue:98-105, 193-205`). Measured: four `will-change: opacity` groups on a
  55×28 px box, still there at 1600 ms. The critique's §2.11 reading is CONFIRMED with one
  correction: the ribbon is `v-if`'d, so the promotion lives for the ARMED RIBBON's life
  (seconds), not the app's. Four layers on 1,563 px² for a 500 ms breath is the cost; it is
  outside the filter budget the census counts, which is exactly why it needs saying out loud.

### 1.10 The two surviving suppressions, censused · charter 10

`logs/I-suppressions-*.json`, both engines.

**(a) `index.css:727` `.sudoku-cell:focus-within { outline: 1px solid …; background: … }` is a
DEAD rule, not a live suppression.** `.game-cell` and `.sudoku-cell` are the SAME element
(`DigitCell.vue:203-205`; measured class list
`game-cell relative flex items-center justify-center sudoku-cell is-active`), and `gameCell.css`
is an UNLAYERED scoped sheet, so `.game-cell:focus-within { background: transparent; outline:
none }` (`gameCell.css:300`) beats an `@layer`-ed rule at any specificity. Measured on a
focused cell: `outline-style: none`, `background: rgba(0,0,0,0)`. Both the outline and the 50 %
accent wash are dead.

It is still a seventh focus-on-outline rule in the tree, and it is dead only because another
sheet happens to be unlayered — move `gameCell.css` into a layer and it resurrects. **Census
row: DELETE it** (the board's own hand is the ring; the rule has no other consumer).
Note it is at `index.css:765` in the prototype worktree — the critique's "`:766`" is that
tree's line, one off.

**(b) `.gallery-guard:focus { outline: none }` is LIVE and it matters more than pass 1
thought.** The container matches `:focus-visible` in both engines (§1.6), so the suppression
is reachable, and the drawn ring answers it by framing the whole ribbon. Census row: the rule
dies with the §1.6 cure — whichever cure lands, the container stops being the focus owner.

### 1.11 The three re-read gates, written into their own sentences · charter 9

Each exemption is defensible; none is in the gate, which is what would let the gate fail next
time. Proposed sentences:

- **G-LIVE-3** — *"Across ≥ 7 tab stops, every stop either shows exactly one `.focus-ring`
  within 1 px of its target's box + outset, or is one of the two DECLARED exemptions —
  `.cell-native-input` (the board draws its own) and `.gallery-viewport` (§3.7: the card is
  the owner) — which show zero. Any third stop showing zero is RED."* The walk must now
  include `.staging-btn` and `.guard-btn` by name (§1.7).
- **G-LIVE-6** — *"Under forced colors every `:focus-visible` stop computes `outline-style:
  solid`, EXCEPT `.cell-native-input`, which computes `3px none` because the board's
  high-contrast ring rides the CELL (`2px solid`, offset −2 px, asserted in the same run).
  11 of 12 solid + that one assertion is green; 11 of 12 without it is RED."*
- **G-LIVE-1** — *"σ_t of the focused ring at 4×4 / 9×9 / 16×16 lies inside the grid's own σ_t
  band at that size, measured from the SHIPPED path data, and the band is read from
  `HandDrawnGrid`'s frames rather than re-derived from `cellBoil`."* As written the mark and
  the band come out of one generator at one scalar, so the gate cannot go red short of
  passing a wrong number; reading the band from the grid's actual frames makes a rebase of
  either side visible.

---

## 2 · The focus token, reconciled over four grounds × two themes · charter 11

The chair ruled §6 owns the token (§6.1). Five families minted five answers; here they are on
one set of painted bytes. Grounds measured (`logs/B-grounds-*.json`, identical both engines):
light page `251,250,249` · light card `253,253,252` · dark page `17,15,14` · dark card
`19,18,17`. The board's fourth ground is the cell interior under focus, which carries the
ring's own 0.08 fill. The chrome columns are stroke-opacity 1 (how `FocusRing` paints); the
board columns are 0.9 over the 0.08 fill (how `gameCell.css` tier 2 paints).

| candidate | theme | value | chrome / page | chrome / card | board / cell | board / own fill | worst |
|---|---|---|---|---|---|---|---|
| **A · MRK-LIVE** one value | light | `#3a7bc4` | 4.19 | 4.29 | 3.67 | **3.34** | 3.34 |
| | dark | `#3a7bc4` | 4.38 | 4.29 | 3.72 | 3.48 | 3.48 |
| **B · MRK-ABS** dark alias | light | `#3a7bc4` | 4.19 | 4.29 | 3.67 | 3.34 | 3.34 |
| | dark | `#6aabeb` | 7.86 | 7.70 | 6.53 | 5.85 | 5.85 |
| **C · ACC-FIVE** dark arm | light | `#3a7bc4` | 4.19 | 4.29 | 3.67 | 3.34 | 3.34 |
| | dark | `#6aabeb` | 7.86 | 7.70 | 6.53 | 5.85 | 5.85 |
| **D · ACC-SIX** `--color-blue-ink` | light | `#2f76bd` | 4.53 | 4.64 | 3.96 | 3.58 | 3.58 |
| | dark | `#6aabeb` | 7.86 | 7.70 | 6.53 | 5.85 | 5.85 |
| **E · ACC-GRAPHITE** graphite | light | `#404040` | 9.95 | 10.19 | 7.80 | 6.84 | 6.84 |
| | dark | `#a3a3a3` | 7.58 | 7.42 | 6.33 | 5.63 | 5.63 |
| **F · `--ring-ink`** fg 50 % (§10) | light | `→ 132,132,131` | 3.68 | 3.68 | — | — | 3.68 |
| | dark | `→ 128,127,125` | 4.71 | 4.68 | — | — | 4.68 |

**Flatness — the spread of each candidate's readings across both themes:**

| candidate | min | max | spread |
|---|---|---|---|
| A · MRK-LIVE one value | 3.34 | 4.38 | **1.04** |
| F · `--ring-ink` fg 50 % | 3.68 | 4.71 | **1.03** |
| D · ACC-SIX | 3.58 | 7.86 | 4.28 |
| B/C · dark arm | 3.34 | 7.86 | 4.52 |
| E · ACC-GRAPHITE | 5.63 | 10.19 | 4.56 |

Four things to hand the synthesizer, and none of them is a preference:

1. **Every candidate clears 1.4.11's 3:1 on every ground in both themes.** The decision is not
   an accessibility decision. It is about whether the mark should WEIGH the same in both
   themes.
2. **A and F are the two flat answers, and they are flat to within 0.01 of each other.**
   They are flat for the same reason — one right-hand side, no theme arm — which is the
   strongest available argument that §6's token and §10's `--ring-ink` are the same idea
   wearing two names. That reconciliation (chair: a pass-3 row) has a shape already:
   §10's ring is an authored `outline` on a control that also wears a drawn frame, §6's is
   the drawn mark itself. One is achromatic and derived from the foreground; the other is
   chromatic and fixed. **If the two are to become one, F is the shape that generalises**
   (a foreground mix needs no dark arm by construction) and A is the shape that keeps the
   ring a colour a reader learns.
3. **A dark arm buys 2.4 points at night and costs 4.5 points of spread.** The mark would be
   noticeably heavier in dark mode than in light. That is a design ruling about constancy, and
   it should be stated as one rather than as a contrast argument, because the contrast
   argument does not separate the candidates.
4. **The floor is the board's own fill, at 3.34 / 3.48 — not 4.19.** Whoever writes the
   token's comment writes both numbers or the comment lies again.

### 2.1 R6's R1 row · MOVED, with the diff proposed

`law-probe.mjs` R1 asserts that a chromatic token painting in both themes carries a dark ARM.
This family's answer is the opposite and it is arithmetic, not taste: one value, flattest of
five by a factor of four, every ground over the floor. The row cannot go green as written.

Proposed re-basing, banked as a diff under `instruments/` and reported **MOVED** (never re-cut
in place, per the chair's §7): R1 becomes *"every chromatic token's comment tells the truth
about its themes — a token declared once in `:root` says so, and a token with a `.dark` arm
names its arm's measured reading."* That is a stronger law than the one it replaces: it would
have caught the defect this family actually found (a comment claiming a dark arm the token has
never had), which the current R1 did not.

### 2.2 The grafts, priced on the measured grounds

- **MRK-WASH's 0.95 resting stroke-opacity.** Confirmed four-for-four on this lane's own
  grounds: **+0.30 light / +0.28 dark** against the cell ground, **+0.27 / +0.25** against its
  own fill (0.9 → 3.67/3.34/3.72/3.48; 0.95 → 3.97/3.61/4.00/3.73). Two characters, and it
  moves the board stop's worst reading from 3.34 to 3.61.
- **MRK-WASH's digit-headroom budget.** Confirmed: the entry ink reads **5.08** bare light /
  **7.36** bare dark, and **4.62 / 6.87** on the focused cell's 0.08 fill — **0.46 / 0.49
  spent**, both still clear of AA 4.5. The ring's fill can afford its current weight and not
  much more: at fill 0.16 the light reading would cross 4.5.
- **MRK-ABS's `(0,1,0)`-inside-`@layer base` authoring.** The pass-1 diff is already that
  shape (`index.css`, `@layer base { :focus-visible { outline: none } … @media
  (forced-colors: active) { :focus-visible { outline: 2px solid Highlight } } }`), with the
  restoration after the suppression at equal specificity and no `!important` anywhere. What
  is MISSING is the negative control: a test that raises a `(0,4,0)` suppression and proves
  the forced-colors arm goes to zero painted px, which is what makes G-LIVE-6 able to fail.
  Ship it with the gate.
- **MRK-ABS's arrival-time probe.** Applied above (§1.8): "same-frame" on a deck landing is
  6 ms (chromium) / 11 ms (webkit) to the first write, and the landing's LAST write is where
  the honesty is.

### 2.3 The chair's §6.11 laminate ruling, priced · and gate 2 is RED as specified

Computed on the measured grounds, the composition the chair ruled on:

| theme | card | selection body (0.08 blue) | hint body (15 % red) | hint composed on selection |
|---|---|---|---|---|
| light | L\* 99.28 | `237,243,248` · ΔL\* **3.75** | `248,221,220` · ΔL\* **9.03** | `234,212,216` · ΔL\* **12.51** |
| dark | L\* 5.52 | `22,26,31` · ΔL\* 3.54 | `53,32,31` · ΔL\* 9.37 | `56,39,43` · ΔL\* 12.25 |

The rank inversion reproduces: the hint's body out-reads the selection's body by 2.4× in ΔL\*
alone, and 3.3× composed. (MRK-WASH's figures were 13.10 vs 5.90; my composed 12.51 is within
0.6 of theirs, my clean 3.75 is not — the units or the sampled teacher-red differ, so the
chair's gate-1 threshold should be re-read in MRK-WASH's own instrument, not in mine.)

**The chair's gate 2 fails as written, and the contingency fires.** The rim is 50 % teacher-red;
over the selection body it reads **2.20:1 light / 2.50:1 dark** — under the 3:1 floor. At full
opacity it reads 4.32 / 6.32. Solved: the rim needs **opacity 0.70 light / 0.60 dark** to clear
3:1, so **one value, 0.70, clears both themes**. That is the number for the chair's
"opacity, never width" clause:

```css
.game-cell:has(input:focus-visible) .cell-because,
.game-cell.is-peer-cursor .cell-because { background: transparent }
.game-cell:has(input:focus-visible) .cell-because {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-teacher-red) 70%, transparent);
}
```

Note the rim ALSO fails 3:1 over its own hint body today (2.04 / 2.44) — on an unselected
because-cell. That is a pre-existing reading this lane is not chartered to cure, but the
synthesizer should know the number before it writes "the rim stays".

---

## 3 · The rows this lane could not close, stated plainly

### 3.1 The dist-bound suites · charter 8 · BLOCKED, and the block is external

`visual-golden`, `filter-census`, `wordmark-integrity`, `theme-bake-freshness`,
`theme-quadrants` and `throttled-void` are `testIgnore`d in the prototype's config because
they are dist-bound by the golden discipline — correct for a dev-server run, and the
sentence must say so:

> *"The whole default e2e suite ran against this lane's dev server: 472 passed / 0 failed,
> EXCLUDING the six dist-bound specs (`visual-golden`, `filter-census`, `wordmark-integrity`,
> `theme-bake-freshness`, `theme-quadrants`, `throttled-void`), which the golden discipline
> binds to a built `dist` and which run before this folds."*

**The block:** the concurrent W8 §8.1 attribution lane has `dist` FIXED at
`index-9rZPzI5DEcpe.js` and no `npm run build` may run while it does. So the dist run is
sequenced AFTER W8 §8.1 returns, not skipped. Say so in the return rather than letting it
read as an omission.

### 3.2 The quiet-box WebKit 16×16 trace · charter 14 · NOT MEASURED, deliberately

Load average at measurement time was **17.19** (five concurrent lanes, `uptime`). Pass 1's
reading (living 2/8/0/0 long frames vs a PRM control of 0/2/1/0) was taken under the same
condition and is unreadable for the same reason. Banking another loaded sample would add noise
to the record, so this lane banks none. The trace wants a box under load 2, and the PRM
negative control beside it.

Two sub-rows that CAN be settled without the trace:

- **Frames keyed on w/h.** `FocusRing.vue`'s `frames` computed depends on `rect.value`, and
  `measure()` writes a fresh `DOMRect` on any move, so a pure translation re-bakes four poses
  whose `d` strings are identical (measured in pass 1: 0 `d` attribute writes, both engines —
  the cost is compute, never paint). Cure: derive the geometry from a `{w, h, outset}`
  computed rather than from `rect`, or route it through `useBoilCache` on those three keys.
  Under the §1.8 burst this is 23–36 re-bakes per landing, which is when it costs most.
- **`generateCellFrames` and the cap-24 LRU.** `useBoilCache`'s `maxEntries` defaults to 24
  and the `Map` is MODULE-GLOBAL and shared with `cellRects` and the grid's `BoilFrames`
  (`pencil-boil/dist/frames.js:25,29,60-73`); `maxEntries` is a per-CALL argument, so the
  effective cap is whatever the most recent caller passed. `generateCellFrames` keys on `pos`,
  so a 24-step keyboard traversal mints 24 fresh entries and evicts every grid entry in the
  cache; the next invalidation pays a full regeneration that used to be a hit. Cure that costs
  nothing: give the cell frames a module-local 2-entry memo in `gridPaths.ts` (current +
  previous, so a back-and-forth arrow is free) OUTSIDE the shared LRU. A walk then pays one
  regeneration per step and evicts nothing.

### 3.3 The `spoken-gallery.spec.ts` ballot · charter 12

W3 owns the instrument; §6 owns the ring. The ballot, stated so it can be voted:

> **BALLOT.** `spoken-gallery.spec.ts`'s `ringOwner`/`ringWhole` helpers read `outline-style`
> on the deck's card — the exact rule §6 deletes. Either
> **(a)** the re-base lands WITH this family (the helpers read both forms — a drawn
> `.focus-ring` on the activedescendant card OR a bespoke outline anywhere — so the spec's
> sentence, "exactly one thing owns the deck's focus mark", stays literally true and stays
> able to fail); or
> **(b)** §6 keeps a card-side outline as the deck's floor, the spec is untouched, and the
> drawn ring becomes a second mark on that one surface.
> **Default if unresolved: (a)**, because (b) puts two marks on the one stop the section
> exists to unify, and because (a) is the option that also closes §1.5's masked fallback
> (a card-side outline would be the fallback's floor, which argues the other way — say that
> out loud in the ballot rather than hiding it).

---

## 4 · What the synthesizer needs, condensed

### 4.1 Surfaces and tokens this family touches

| file | line(s) | what |
|---|---|---|
| `web/frontend/src/games/shared/gameCell.css` | 199–218 (worktree) | the pose swap rules — the (0,4,0) scoped cascade that must be re-gated (§1.1) |
| | 267–280 | tier 2, `:has(input:focus-visible)`, stroke 7 / 0.9 / fill 0.08 — the 0.95 graft lands here |
| | 139–155 | `.cell-because` — the chair's §6.11 body yield + rim opacity 0.70 |
| | 294–303 | `.game-cell:focus-within { outline: none }` — the rule that makes `index.css:727` dead |
| `web/frontend/src/assets/index.css` | 219–222 (HEAD) | `--color-focus-sketch` and its comment — the token and the sentence |
| | 727 (HEAD) / 765 (worktree) | `.sudoku-cell:focus-within` — the dead seventh rule, DELETE |
| | `@layer base` block (worktree :447–487) | the suppression + forced-colors restoration; needs the negative control |
| | `@property --focus-ring-outset` | the seam; the house default 3 is 1.5 px short (§1.7) |
| `web/frontend/src/pencil/chrome/FocusRing.vue` | 30 (`EXEMPT`) | add `.gallery-guard`, or move the arming focus (§1.6) |
| | 41–65 (`frames`) | key on `{w, h, outset}`, not on `rect` (§3.2) |
| | 107–119 (`settle`) | the 36-FRAME cap wants to be a 520-MS cap (§1.8) |
| | 135–154 (`fromDocument`) | the null fallback that leaves the deck unmarked (§1.5) |
| `web/frontend/src/pencil/composables/boilBeat.ts` | `useMarkPose` | the settle arithmetic is right; the SPEC's number is wrong (§1.2) |
| `web/frontend/src/pencil/grid/gridPaths.ts` | `generateCellFrames` | the cap-24 LRU eviction (§3.2) |
| `web/frontend/src/pencil/config/pencilConfig.ts` | `markSettleBeats: 4` | 4 × `MOTION.beatMs` = 500 ms |
| `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue` | :1449 (deleted), :1056 (`armedPose`) | the guard's ring + the armed verb |
| `web/frontend/src/pencil/chrome/GameGallery/StagingBand.vue` | :424 (deleted) | the staging ring |

### 4.2 Numbers to hit

- Board ring painted: **3.68 / 3.35** light, **3.76 / 3.48** dark (vs cell ground / vs own
  fill). With the 0.95 graft: **3.97 / 3.61**, **4.00 / 3.73**.
- Chrome ring painted: **4.19 / 4.29** light, **4.38 / 4.29** dark. Floor 3:1 everywhere.
- Settle: **4 swaps, `1,2,3,0`**, first ≤ 125 ms + jitter (33–116 measured), last in
  [375, 500] (401–491 measured), 0 in the next 3 s, final 0; PRM 0.
- Ring clearance on a framed control: `--focus-ring-outset` **≥ 5.5 px** (1 px of air) against
  `HandDrawnOutline :outset="2"`; house default 3 overlaps by 1.5 px.
- Landing burst: ≤ **520 ms**, stops on 3 still frames, **0** idle writes per 900 ms.
- Filter budget **9** exact, population +3 (19 / 84 / 259), every ghost path `filter: none`.
- Hint rim under selection: opacity **0.70** (one value, both themes) for 3:1.

### 4.3 Primitives to reuse, by name

`useMarkPose(landed)` (`boilBeat.ts` — the one-shot sibling of `useBeatFrame`, three consumers
already) · `generateRectBoilFrames` + the grain bake (`gridPaths.ts` §Grain bake — zero
filters by construction) · `useBoilCache` (`@mkbabb/pencil-boil` — but see §3.2's cap) ·
`HandDrawnOutline`'s `:pose` contract and its pose-prune latch · `.boil-frame-layer.is-active`,
the grid's own opacity-swap shape · `@property` registration for any custom property JS reads ·
`aria-activedescendant` as the ring's target source · `ghost-draw-on 180ms var(--ease-ghostDraw)
backwards` · `--tap-floor`, `--ring-ink`, `--ink-press-*` for the §10 seam.

### 4.4 Constraints it collides with

M16 (no copy is minted here, so the register arm is free) · filterBudget **exactly 9**, +3
population never +N² · AA on both themes (met by every candidate; see §2) · π identity on
unclaimed surfaces (the hue census must stay byte-identical — the token is not re-valued) ·
R6 law 7, one shared beat (the landing burst is not a beat and must be named so) · R6 law 37,
one box grammar — which is what creates the §1.7 collision · R6 law 39, focus rings
non-negotiable — which is what §1.5 and §1.6 violate today · W2's landed mechanics untouched ·
U-10 on the armed verb · the dist block in §3.1.

---

## 5 · Three sketches

**(a) The cascade's reach, before and after.** The attribute is on the grid; the question is
how far down the selector walks.

```
  TODAY  [data-mark-pose="2"]  ← on the GRID
    └── .game-cell (focused)      ghost paths [0,0,1,0]   ✓ living, correct
    └── .game-cell.is-invalid     ghost path  [0]         ✗ the red ring blinks out
    └── .game-cell.is-peer-cursor ghost path  [0]         ✗ the peer's pencil blinks out
    └── .game-cell:hover          ghost path  [0]         ✗ the hover sketch blinks out
                                              ^^^ nth-of-type(1) is the ONLY path they have

  CURED  [data-mark-pose="2"]
    └── .game-cell:has(input:focus-visible)   [0,0,1,0]   ✓ the swap reaches here and nowhere
    └── .game-cell.is-invalid                 [1]         ✓ still
    └── .game-cell.is-peer-cursor             [1]         ✓ still
    └── .game-cell:hover                      [1]         ✓ still
```

**(b) The painted-band collision at a framed control** (staging stop, px along x, both
engines; the button's left edge is 0).

```
        -3    -2    -1     0
         |     |     |     |
  frame  |  [======= 2px ==]|          HandDrawnOutline outset 2, stroke 2
  ring   [====== 2.5px =====]          FocusRing outset 3, stroke 2.5
              \_____________/
                   1.5 px of ONE LINE DRAWN ON ANOTHER

  outset 5.5 →  ring [===]  · 1px air ·  frame [=====]|      disjoint, legible
```

**(c) The ring's owner at each state — where it lands and where it should.**

```
  state            activeElement        ring frames            area      verdict
  ──────────────────────────────────────────────────────────────────────────────
  board cell       .cell-native-input   (EXEMPT — board's own hand)       ✓
  deck, normal     .gallery-viewport →  the activedescendant CARD          ✓
                   aria-activedescendant
  deck, attr gone  .gallery-viewport    NOTHING (EXEMPT → el = null)      ✗ §1.5
  ribbon armed     .gallery-guard       the whole 320×110 ribbon          ✗ §1.6
                                        (35,130 px² vs a verb's 1,563)
  staging verb     .staging-btn         the button, 3px out               ✓ box
                                        …on top of its own drawn frame    ✗ §1.7
```

---

## 6 · Risks

1. **Cure A's `:has()` runs on every cell at 8 Hz.** Both engines computed it correctly here,
   but the selector is evaluated against the whole subtree; the 16×16 phone trace (§3.2) is
   the instrument that would catch a cost, and it is the one measurement this lane could not
   take on a quiet box. Cure B avoids the focus predicate entirely and is the fallback if the
   trace convicts `:has`.
2. **Deleting `index.css:727` is a behaviour change only if `gameCell.css` ever gets layered.**
   It is dead today; the deletion is safe and the gate that proves it is a computed read, not
   a golden.
3. **Raising `--focus-ring-outset` to 5.5 px moves the ring on EVERY framed control** —
   goldens on the gallery and the controls card will move. That is a declared DELTA, not a π
   break, and it needs the crops the evidence policy asks for. It also interacts with the
   toggle's 54 px ornament outset, which must stay 54.
4. **The §1.6 cure touches the guard ribbon's focus management**, which `GameGallery.a11y.test.ts`
   and `gallery-guard.spec.ts` already assert on. Moving the arming focus to a verb changes
   what `aria-modal` containment starts from; check both suites in the same diff.
5. **The token decision is not a contrast decision** (§2), so it will be argued on taste unless
   the synthesizer states the constancy principle explicitly. If it is left implicit, five
   families will mint five answers again in pass 3.
6. **The dist block (§3.1) can eat the pass.** If W8 §8.1 has not returned by the prototype
   stage, the six dist-bound specs cannot run and the family cannot claim π. Sequence it.
7. **The chair's §6.11 gate 2 is RED as written** (§2.3). If the synthesizer copies the gate
   verbatim it ships a gate that cannot pass; it needs the 0.70 rim opacity in the same diff.

---

## 7 · Prior art · BACKGROUND ONLY

Two web reads, taken as background. Neither is a verdict; every verdict above comes from a
number measured on this codebase.

1. **WCAG 2.2 SC 2.4.11/2.4.13 Focus Appearance** (W3C Understanding docs). Two clauses bear
   directly on rows this lane measured. (a) *"a contrast ratio of at least 3:1 against ADJACENT
   non-focus-indicator colors"* — on a control wearing a drawn frame, the ring's adjacent
   colour is the FRAME'S INK, not the page. Computed on this estate's grounds, `#3a7bc4`
   against the frame's ink (`currentColor` at stroke-opacity 0.95 over the card) reads **≈4.4
   light** and **≈3.1 dark** — the dark arm clears by about 0.13, which is a second, independent
   reason to buy the §1.7 clearance rather than let two drawn lines abut. (b) *"the entire
   focus indicator encloses the component"* plus the minimum-area floor (a 1 px perimeter, or a
   4 px line along the shortest side): a 2.5 px stroke around the whole perimeter clears the
   area floor at every stop measured here, including the 55×28 px guard verb.
2. **`:has()` cost** (WebKit's own `:has()` post; the Chromium intent-to-ship; the CSSWG
   performance thread). The engines ship `:has`-specific caching and bloom filtering; the cost
   is driven by how loosely the pseudo-class is ANCHORED and how unconstrained its argument is.
   This matters for §6's risk 1 and it argues FOR cure A: `.game-cell:has(input:focus-visible)`
   is an anchor the estate already evaluates on every focus change (`gameCell.css:267`, tier 2),
   with a child-scoped argument, so the cure adds no new anchor and no new invalidation source —
   it reuses one. Cure B's `:has(~ .cell-ghost-path)` would introduce a new sibling-scoped
   anchor on every ghost path instead. The quiet-box trace (§3.2) is still the instrument that
   decides it on this estate's numbers.

Sources: [W3C Understanding 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) ·
[W3C Understanding 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) ·
[WebKit, "Using :has() as a CSS Parent Selector"](https://webkit.org/blog/13096/css-has-pseudo-class/) ·
[CSSWG, ":has() and performance"](https://github.com/w3c/csswg-drafts/issues/3345)
