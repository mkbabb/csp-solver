# PASS-2 SYNTHESIS · MRK-LIVE · The living mark

Section §5 wobble law · §6 focus rings. Section LEADER (registry-v1 §5, conv 72). Synthesizer:
Fable 5.1. Inputs: `../research/MRK-LIVE/RESEARCH.md` (26 logs, both engines, zero crops),
`../CHAIR-RULINGS.md` (§6.1 the token has one owner; §6.11 the laminate; §7), the pass-1
synthesis and critique, the r0 R3/R6 censuses, the owner's frames. Read-only on the product.
The frontend-design two-pass method was followed: plan → tell review → spec.

Every number below is a pass-2 measurement or the arithmetic model the research validated to
one byte; where a figure is mine and unmeasured it says ARITHMETIC.

---

## 0 · Plan, then the tell review

**Tokens.** Colour: `--color-focus-sketch` `#3a7bc4`, ONE value in both regimes, kept — the
flattest candidate of six (spread 1.04 across four grounds × two themes; every other chromatic
answer spreads 4.3–4.6). Its floor is the BOARD stop, not the chrome ring: 3.34 light / 3.48
dark against its own 0.08 fill at stroke-opacity 0.9; with MRK-WASH's 0.95 graft 3.61 / 3.73.
The chrome ring at stroke-opacity 1 reads 4.19–4.38. Ground tokens: `--color-card`,
`--color-background` (measured 253,253,252 / 251,250,249 light; 19,18,17 / 17,15,14 dark).
Geometry: `HandDrawnOutline`'s tuple stroke 2.5 / outset 3 (the tongue's), `outlineBoilPx 0.45`
(existing). Time: `MOTION.beatMs 125` (existing), `BOIL_CONFIG.markSettleBeats 4` (pass 1's one
new number, kept), `MOTION.boardFoldMs 520` as the landing burst's ceiling (existing, no new
constant). One new CSS number: the hint rim under selection at opacity **0.70** (the chair's
gate 2 contingency, solved for both themes in one value).

**Type.** None. This family mints no rendered string (M16's arm is free; no woff2 re-cut).

**Layout.** One axis — liveness — on two surfaces, unchanged from pass 1; what pass 2 adds is
the REACH of each mark, drawn as a fence:

```
  THE BOARD                                THE CHROME
  ┌────┬────┬────┐                          ┌──────────────────────────┐
  │    │ 5  │  ! │  ! conflict (red, still)  │ ring [ frame [ verb ] ]  │  ring band 1px clear
  ├────┼────┼────┤                          │  ╰─ 1px air ─╯           │  of the drawn frame
  │ ~~~│~~~~│    │  ~ the LIVING cell: four  └──────────────────────────┘
  │ ~ 3 ~  │  ·  │    poses on the beat,     armed ribbon: the ring is on the KEEP verb
  │ ~~~│~~~~│    │    1,2,3,0 then rest     (1,563 px²), never on the ribbon (35,130 px²)
  ├────┼────┼────┤                          deck, no activedescendant yet: the first option
  │    │ ·  │ ·  │  · peer cursor (still)    is the owner, never nothing
  └────┴────┴────┘  the swap reaches the living cell and NOWHERE ELSE
```

**Principles.** (1) The living cell is the focused cell — the design law is written INTO the
selector, so the swap cannot reach a still mark. (2) A mark is alive from the frame it
arrives: draw-on and first breath overlap; four swaps, `1,2,3,0`, the last in (375, 500] ms;
then nothing. (3) A mark weighs the same in both themes: one value, no dark arm, and the
comment carries both numbers (the chrome's and the board's floor). (4) A ring never draws on
another line: on a framed control the ring's painted band clears the frame's by 1 px of air.
(5) A ring lands on something a reader can act on, never on a container, and never on
nothing. The memorable thing per surface: the selection breathes once when you land on it
(board); the same breath answers focus on one drawn ring (chrome).

**Tell review.** The generic answers are an infinite `outline` pulse, a feTurbulence "sketchy"
filter on a timer (T4-P1 deleted exactly that), and a dark-mode "brighter accent" arm minted
because dark mode is supposed to have one. Departures, each with its number: the poses are
pre-baked geometry opacity-swapped on the shared beat (zero filters, 9/9/9); the motion ENDS
(0 swaps per 3 s after the fourth; PRM 0 swaps); the token stays one value because the
contrast argument does not separate the candidates (all six clear 3:1 on every ground) and the
constancy argument does (1.04 vs 4.5). What the mirror removed this pass: the "house default
outset → 5.5" (it moves every framed control's goldens for a collision only three hosts have);
a per-cell `data-mark-pose` (the v-for cost pass 1 measured); and the frames-cap rewrite as a
frame count (refresh-rate dependent — it is a duration now).

---

## 1 · §5 · the living mark (spec, pass-2 delta)

### 1.1 The law, re-worded to the build

> Wobble in space is the library's length law (`maxDisplace = roughness × len × 0.015`).
> Wobble in time is a house number ranked by importance (`frameBoil 1.2 / subgridBoil 0.6 /
> cellBoil 0.3`). **The living cell is the focused cell.** From the frame it arrives it steps
> `1, 2, 3, 0` on the shared beat — the draw-on and the first breath overlap — and rests on
> pose 0, which is `generateCellRects`' output byte for byte. Every other mark on the board is
> still, and the swap cannot reach it.

### 1.2 The cascade cure (the pass-1 blocker) — cure A

`gameCell.css` is `<style scoped>` and UNLAYERED, so the swap compiles at (0,4,0) and any cure
must clear it and stay unlayered. Cure A names the law in the selector and reuses tier 2's own
anchor (`:has(input:focus-visible)`, evaluated on every focus change already — no new
invalidation source):

```css
/* pose swap — the LIVING cell only; a still mark has one path and is never reached */
.game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(n + 2) { opacity: 0; }
[data-mark-pose="1"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(1),
[data-mark-pose="2"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(1),
[data-mark-pose="3"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(1) { opacity: 0; }
[data-mark-pose="1"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(2),
[data-mark-pose="2"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(3),
[data-mark-pose="3"] .game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(4) { opacity: 1; }
```

Measured under injection, both engines: living swap `1,0,0,0 → 0,1,0,0 → 0,0,1,0 → 0,0,0,1`
unchanged; conflict, peer-cursor and hover paths hold opacity 1 at all four poses. Cure B
(`:nth-of-type(1):has(~ .cell-ghost-path)`) is the banked fallback if the quiet-box trace
convicts `:has` — it encodes an implementation fact, not the law, so it ships only on that
verdict.

### 1.3 The settle, stated once for both surfaces

`useMarkPose` is right; the spec sentence was wrong. `markSettleBeats 4` × `beatMs 125` =
exactly **4 swaps, `1,2,3,0`**, the first within one beat of the landing (measured band
33–116 ms), the last at `500 − φ` ms (measured 401–491). The phase φ is the beat's, not the
landing's, and the sentence now says so. The chrome ring obeys the same sentence: it appears
at pose 0 same-frame and steps `1,2,3,0` (no draw-on; the movement is the arrival). PRM: 0
swaps, final pose 0, both surfaces. Option "delay to the first beat after the draw-on" is
REFUSED — it pushes the last swap to `750 − φ` ms, outside the family's own window.

### 1.4 States on the board (tier table, pass-2 column added)

| tier | trigger | paint | life | reached by the swap? |
|---|---|---|---|---|
| 1 hover | pointer, no focus | graphite 5 / 0.65 / fill 0.06 | still | **no** (1.2) |
| 2 selection | `input:focus-visible`, every pointer | `#3a7bc4`, stroke 7, **0.95** (MRK-WASH graft), fill 0.08, `ghost-draw-on 180ms var(--ease-ghostDraw) backwards` | LIVING: `1,2,3,0` | yes — it IS the swap |
| 3 conflict | `.is-invalid` | teacher-red, unchanged | still | **no** |
| 4 peer cursor | `.is-peer-cursor` | peer ink, 4 / 0.55 / dashed, unchanged | still | **no** |

The 0.95 graft moves the board's worst reading 3.34 → 3.61 light, 3.48 → 3.73 dark (two
characters). The digit headroom budget holds: entry ink 4.62 light / 6.87 dark on the focused
fill (0.46 / 0.49 spent of 4.5's clearance); fill stays 0.08 — at 0.16 light crosses 4.5.

### 1.5 The hint laminate (chair §6.11, carried here with MRK-WASH's rank)

The body is a ground and yields under the two grounds above it; the rim is a mark and stays.
Gate 2 as the chair wrote it is RED (50% teacher-red over the 0.08 selection body reads
2.20 light / 2.50 dark), so the contingency fires as opacity, never width — one value:

```css
.game-cell:has(input:focus-visible) .cell-because,
.game-cell.is-peer-cursor .cell-because { background: transparent; }
.game-cell:has(input:focus-visible) .cell-because {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-teacher-red) 70%, transparent);
}
```

ARITHMETIC on the measured grounds: 0.70 reads ≥3:1 on both themes (0.70 light is the binding
arm; dark clears at 0.60). MRK-ABS's answer to the chair's question is booked: its dark alias
moves this reading by −0.03 and changes no verdict; the binding arm is LIGHT. The one-ground
rank (selection > peer cursor > hint laminate > unit) lands as MRK-WASH's `v-if` with a unit
test: `isPeer` with `isBecause` or a peer cursor renders no `.cell-peer`. Pre-existing and NOT
cured here, named so nobody writes "the rim stays" without the number: on an UNSELECTED
because-cell the 50% rim reads 2.04 / 2.44 over its own 15% body.

### 1.6 The armed verb (U-10 — measured, not closed)

Built and measured: only the destructive verb breathes (`.guard-leave`'s face steps `1,2,3,0`
and rests by 460 ms; `.guard-keep` stays `:pose="0"` and stays pruned). Cost named out loud:
the pose-prune latch is one-way, so the armed ribbon carries four `will-change: opacity` groups
on a 55×28 px box for the ribbon's life (seconds, `v-if`'d) — outside the filter census. The
frame the owner sees at the re-look is that verb at pose 0 and pose 2 (one crop). The spec
claims nothing about whether one breath on a destructive verb reads as emphasis or as alarm.

---

## 2 · §6 · one drawn ring off the board (spec, pass-2 delta)

### 2.1 The law

> Off the board, focus is one drawn ring: `HandDrawnOutline`'s hand in px-native geometry on
> whatever the accessibility tree says has focus, stroke 2.5, ink `#3a7bc4`, `outlineBoilPx
> 0.45`, alive from the frame it arrives (`1,2,3,0`) and then still. It lands on something a
> reader can act on — never on a scrollport, never on a ribbon, never on nothing — and it never
> draws on another line.

### 2.2 The token, one owner (chair §6.1)

`--color-focus-sketch: #3a7bc4`, declared ONCE in `:root`, no `.dark` arm. The comment at
`index.css:219` is rewritten to tell the truth about its themes and to carry BOTH numbers:

```
chrome ring (stroke-opacity 1): 4.19 page / 4.29 card light · 4.38 page / 4.29 card dark
board ring (0.95 over the 0.08 fill): 3.97 vs cell / 3.61 vs own fill light · 4.00 / 3.73 dark
one value in both regimes on purpose: the mark weighs the same at night (spread 1.04; a dark
arm would buy 2.4 points and cost 4.5 of spread). Floor 3:1 (1.4.11) everywhere; the board's
own fill is the floor, not the chrome.
```

R6 law-probe R1 ("a chromatic token painting in both themes carries a dark arm") is refuted by
these numbers, not met. It is reported **MOVED**; the re-basing is banked as a diff
(`../research/MRK-LIVE/instruments/R6-R1-rebase.diff`): *every chromatic token's comment tells
the truth about its themes — a token declared once in `:root` says so; a token with a `.dark`
arm names its arm's measured reading.* That law would have caught the defect R6 actually found
(a comment claiming a dark arm the token never had), which the old R1 did not.

`--ring-ink` (§10's foreground-50%) is CONSUMED by the control lanes and not touched here.
Its reconciliation with this token is the pass-3 row; the shape is banked: A and `--ring-ink`
are the two flat answers (1.04 / 1.03) for the same reason — no theme arm. `--ring-ink`
generalises (a foreground mix needs no dark arm by construction); A keeps the ring a COLOUR a
reader learns. This family's principle is the second: the ring is chromatic, fixed, and one.

### 2.3 `FocusRing.vue` — five cures on the pass-1 component

| cure | today (measured) | pass 2 |
|---|---|---|
| **the ribbon's owner** | arming focuses `.gallery-guard` (container, `tabindex=-1`); it matches `:focus-visible` in both engines and the ring frames 35,130 px² against a verb's 1,563 (22.5×) | the arming focus lands on `.guard-btn.guard-keep` (the default, non-destructive verb); `.gallery-guard:focus { outline: none }` dies with it; `aria-modal` containment does not need the container focused. `GameGallery.a11y.test.ts` and `e2e/gallery-guard.spec.ts` move in the same diff |
| **the deck's masked fallback** | attribute removed + scrollport focused → EXEMPT → `take(null)` → zero indicator, both engines | `fromDocument()`: when the rank-1 lookup yields an EXEMPT element and no activedescendant is declared, fall through to the scrollport's first option (`[role="option"]`, else `.game-card.is-center`), never to `null` |
| **the settle bound** | `frames++ > 36` — 361 ms on a 120 Hz box, shorter than `cardStepMs 440`; chromium landed 0.05 px off | a DURATION: re-measure until three identical frames or `performance.now() − t0 > MOTION.boardFoldMs` (520, the estate's longest one-shot), whichever first; 0 writes per 900 ms idle stays the law |
| **the re-bake key** | `frames` depends on `rect.value` (fresh DOMRect on any move); a translation re-bakes four identical `d` strings, 23–36 times per landing | key the geometry on `{w, h, outset}` |
| **`generateCellFrames` in the shared LRU** | module-global cap-24 Map shared with `cellRects` and the grid's frames; `maxEntries` is per-call; a 24-step walk evicts the grid | a module-local 2-entry memo in `gridPaths.ts` (current + previous pos) OUTSIDE the LRU; the grid's entries survive any walk |

`EXEMPT` stays `.cell-native-input, .gallery-viewport`. Target source stays
`aria-activedescendant` → `document.activeElement` matching `:focus-visible`.

### 2.4 The ring clears the frame it rings (the collision, cured per host)

At both framed stops the painted bands overlap by 1.5 px, both engines: frame at
`HandDrawnOutline :outset="2"` stroke 2 paints `[btn−2, btn]`; the ring at outset 3 stroke 2.5
paints `[btn−3, btn−0.5]`. The two deleted rules were dodging this by riding the face at
`outline-offset: 4px`. The law, as a formula the seam already carries per host:

> `--focus-ring-outset` on a framed control = frameOutset + frameStroke/2 + 1.25 + 1 px of air.

| host | frame | required | declared |
|---|---|---|---|
| `.staging-btn` | outset 2, stroke 2 | 5.25 | **5.5** |
| `.guard-btn` (keep 2 / leave 2.5) | outset 2, stroke ≤2.5 | 5.5 | **5.5** |
| `.drawer-tab` | outset 3, stroke 2.5 | 6.5 | **6.5** |
| `.sun-moon-toggle` | ornament | — | 54 desk / 12 phone (W2 §2.4, a RANGE) |
| everything unframed | — | 3 | 3 (house default, unmoved — no golden moves on the chips) |

The house default stays 3; only three hosts declare, through the registered `@property
--focus-ring-outset` seam pass 1 built. Goldens: the deck's staging face and the ribbon move
by 2.5 px of ring — declared DELTA, two crops. The deck card is unframed and keeps reach 3 +
1.25 + wander ≈ 5.75 against 9.59 of air: WHOLE, 3.8 px headroom.

### 2.5 Suppression, restoration, and the seventh rule

The `@layer base` block of pass 1 stands (suppression then forced-colors restoration at equal
specificity, no `!important`). Two additions: (a) the NEGATIVE CONTROL — a test raises a
`(0,4,0)` suppression and proves the forced-colors arm goes to zero painted px, so G-LIVE-6
can fail; (b) `index.css:727 .sudoku-cell:focus-within {…}` is DELETED. It is dead today
(`.game-cell` and `.sudoku-cell` are the same node; `gameCell.css:300` is unlayered and wins),
and dead only by accident: layer `gameCell.css` and a 1 px ring plus a 50% accent wash
resurrect on every focused cell. Proof is a computed read, not a golden.

### 2.6 Mobile

Px-native, so 2.5 px at every viewport. The bottom tab (W2 §2.7, landed) takes the ring at
z 70 above the bar's 60. Dock sheet open (settle ≥700 ms): `.drawer-case` is `overflow:
visible`; the real clipper is `.controls-card` (`overflow: auto`); the tightest ordinary
control clears it by 8.39 px against a 4.25 px reach. The full-width sticky `.icon-btn`
already overruns its clipper by 32.2 px at HEAD — W2's mechanic — so no §6 gate asserts WHOLE
on it; it is named in the gate as the one declared clip. The toggle's exception is a range,
54 → 12 px.

### 2.7 Copy and motion

No copy. Motion, all in `pencilConfig`: `BOIL_CONFIG.markSettleBeats: 4` (4 × `MOTION.beatMs`
= 500 ms, inside the one-shot band beside 440 / 520; the beat is a step function, no curve);
`MOTION.boardFoldMs 520` re-used as the landing burst's ceiling (no new constant); the board
keeps `ghost-draw-on 180ms var(--ease-ghostDraw)`; the chrome ring has no draw-on. The
`intervalMs: 150` comment says "quantizes to one 125 ms beat, 8 Hz". PRM: pose 0, 0 swaps,
the ring appears without stepping. The landing burst is NOT a beat and R6 law 7 is not
touched: position is event-driven (capture `scroll`/`resize`/`ResizeObserver`); a LANDING may
re-measure until still because a WAAPI transform fires none of those. `follow: 'raf'` (255
repositions per 900 ms idle) stays refused, and the sentence now says which shape it refuses.

### 2.8 The spoken-gallery ballot (W3's instrument)

Stated so it can be voted, default named: **(a)** the re-base lands WITH this family —
`ringOwner`/`ringWhole` read both forms (a drawn `.focus-ring` on the activedescendant card OR a
bespoke outline anywhere), so "exactly one thing owns the deck's focus mark" stays literally
true and able to fail; or **(b)** §6 keeps a card-side outline as the deck's floor and the drawn
ring becomes a second mark on the one stop the section exists to unify. Default (a). The
argument that cuts the other way, in the ballot: a card-side outline would ALSO be the masked
fallback's floor (§2.3 row 2) — (a) closes that with the first-option fallthrough instead.

---

## 3 · Plan (files, order, what dies)

Start from the pass-1 worktree's diff (`git -C .claude/worktrees/wf_e58b4764-0fc-44 diff` +
the untracked `FocusRing.vue`), replayed into a FRESH worktree off HEAD; the pass-1 worktree is
the record and is not edited.

1. `gameCell.css` — the swap rules re-gated on `.game-cell:has(input:focus-visible)` (§1.2);
   tier 2 stroke-opacity 0.9 → 0.95; the `.cell-because` yield + 0.70 rim (§1.5); the modality
   comment already replaced in pass 1 stays.
2. `DigitCell.vue` / `useGameCell.ts` — MRK-WASH's one-ground `v-if` rank + its unit test.
3. `pencilConfig.ts` — `markSettleBeats: 4` (kept), the cadence comment (kept); nothing new.
4. `gridPaths.ts` — `generateCellFrames` gets the module-local 2-entry memo, off the LRU.
5. `FocusRing.vue` — the five cures of §2.3; `frames` keyed on `{w,h,outset}`; settle bound
   in ms against `MOTION.boardFoldMs`; the first-option fallthrough.
6. `GameGallery.vue` — arming focus → `.guard-btn.guard-keep`; `.gallery-guard:focus {
   outline: none }` dies; `GameGallery.a11y.test.ts` + `e2e/gallery-guard.spec.ts` updated in
   the same diff. `StagingBand.vue`, `GameGallery.vue`, `DrawerTab.vue` declare
   `--focus-ring-outset` 5.5 / 5.5 / 6.5 on their hosts.
7. `index.css` — `:219` comment rewritten (§2.2); `:727` deleted; the `@layer base` block
   gains its negative-control test beside it.
8. `e2e/spoken-gallery.spec.ts` — ballot (a) if resolved, else untouched and the row stays open.
9. Gates (§5) in the same commit; RED before step 1 on the pass-1 build where the row is
   pass-1's, RED at HEAD where the row is HEAD's.
10. Dist-bound suites (`visual-golden`, `filter-census`, `wordmark-integrity`,
    `theme-bake-freshness`, `theme-quadrants`, `throttled-void`) run AFTER W8 §8.1 returns
    dist — sequenced, not skipped; the family claims π only then.

Dies: `index.css:727`; `.gallery-guard:focus { outline: none }`; the 36-frame cap; the
`rect`-keyed re-bake; the R1 row as worded (MOVED). Kept from pass 1: six bespoke rules
deleted, the `outline-ring/50` sweep deleted, one component mounted, +3 paths on one cell.

---

## 4 · Prototype brief (pass 2)

**Build.** Fresh worktree off HEAD; `git apply --3way` the pass-1 diff + `FocusRing.vue`; then
the §3 delta. Serve from `<worktree>/web/frontend` on **127.0.0.1:4238** (`--strictPort`; next
free in 4230–4249 if taken) with a two-line scratch vite config in
`pass2/prototype/MRK-LIVE/` spreading the worktree's `vite.config.ts` with `cacheDir:
'<worktree>/.vite-cache'` — if vite cannot resolve the config's plugin imports from the
evidence dir (MRK-ABS's pass-2 lane hit this), symlink `node_modules` beside the config to the
worktree's `web/frontend/node_modules` as pass 1 did. Scratch playwright config from
`../research/MRK-LIVE/probe/pw.config.ts` re-pointed at the port. Kill the server and delete
`.vite-cache/` before returning. Load average is a precondition for the trace row (below).

**Crops (≤4, ≤150 KB, dpr3, cited):** (1) the living cell at pose 2 beside a conflicting
neighbour and a peer-cursor neighbour, 9×9 light chromium — the one frame that shows the
swap reaching nothing else; (2) the staging verb focused, ring at outset 5.5 over the drawn
frame, dark webkit — the 1 px of air; (3) the armed ribbon with the ring on `.guard-keep`,
light chromium — the owner's U-10 frame, verb at pose 2; (4) optional: the same at 393×699
with the dock sheet open and a chip focused. Everything else is a number.

**Censuses to re-run (copied and re-pointed, never in r0):** `hue-census.mjs` (must be
byte-identical to `hue-census-HEAD.txt` — the token is not re-valued); `law-probe.mjs` with
R1 reported MOVED (the diff, not a re-cut); the r0 heading census asserted unchanged; the
r0 wobble probe at 4×4/9×9/16×16 (σ over space 0.092 before = after — pose 0 is the shipped
path); `budget.probe.ts` 9/9/9, population 19/84/259, every ghost path `filter: none`;
`check-copy-register.mjs` 0/0; `lint:motion` with the two new specs declaring their PRM.

**Measure (both engines unless stated):** the cascade at four poses on a conflicting, a
peer-cursor and a hovered cell (G-LIVE-8); the settle timeline (G-LIVE-2, six samples now
exist — add two); the board stop's painted ring on both themes with the 0.95 graft (expect
3.97 / 3.61 light, 4.00 / 3.73 dark ±0.05); the chrome ring at four grounds (4.19–4.38); the
ring band at both framed stops via MRK-ABS's `instruments/ring-band.probe.ts` — disjoint
bands ≥1 px; the ribbon's ring area (≤ 2× the keep verb's box); the deck with
`aria-activedescendant` removed (one owner, the first option); the landing burst (last write
≤ 520 ms, 0 writes per 900 ms idle, landed err ≤ 0.05 px, both a 60 Hz and a 120 Hz
emulation if the rig can); the LRU walk (30 ArrowRight steps, then the grid's `cellRects`
entry is still a hit); the §6.11 gates 1–3 in MRK-WASH's own instrument; the forced-colors
negative control; the WebKit 16×16 phone trace ONLY on a box under load 2 with the PRM
control beside it — otherwise bank nothing and say so; `spoken-gallery.spec.ts` (ballot
(a): 16/16), `access.spec.ts` 2.1/2.2/2.3, `a11y.spec.ts` 3.5, `GameGallery.a11y.test.ts`,
`gallery-guard.spec.ts`.

**Success is:** G-LIVE-8 1/1/1 at poses 0–3; 4 swaps `1,2,3,0`, last in [375, 500], 0 after,
PRM 0; board ring ≥ 3.61 light / 3.73 dark on its own fill; chrome ring ≥ 4.19; ring–frame
bands disjoint ≥ 1 px at `.staging-btn`, `.guard-btn`, `.drawer-tab`; ribbon ring area ≤ 3,200
px²; deck fallback: 1 owner; burst ≤ 520 ms, idle 0; grid entries survive the walk; σ-space
0.092 unchanged; 9/9/9 and +3; hue census byte-identical; 0/0 copy; the suites green; dist
suites green once W8 §8.1 returns. Anything short of that list is the number, banked.

---

## 5 · Born-RED gates this family lands with

- **G-LIVE-1 σ over time, band read from the grid's own frames** — the focused ring's σ_t at
  4×4 / 9×9 / 16×16 inside the grid's σ_t band at that size, the band read from
  `HandDrawnGrid`'s SHIPPED frames (never re-derived from `cellBoil`). RED at HEAD: 0/0/0.
- **G-LIVE-2 one revolution, exact** — exactly 4 swaps, sequence `1,2,3,0`; first ≤ 125 ms +
  jitter; last in [375, 500] ms; 0 swaps in the following 3 s; final pose 0; PRM 0 swaps.
  RED at HEAD (0 swaps); a fifth swap, a wrong sequence or a 618 ms last swap each red it.
- **G-LIVE-3 one ring owner, exemptions in the sentence, clearance** — across ≥ 9 tab stops
  including `.staging-btn` and `.guard-btn` by name, every stop shows exactly one
  `.focus-ring` within 1 px of box + outset, OR is one of two DECLARED exemptions
  (`.cell-native-input`, `.gallery-viewport`) showing zero; any third zero is RED; at every
  framed stop the ring's painted band and the frame's are disjoint with ≥ 1 px between.
  RED at HEAD (no node) and RED on the pass-1 build (1.5 px overlap).
- **G-LIVE-4 position, bounded in time** — ≤ 0.5 px after a 240 px scroll and a 1280→1024
  resize; a landing's last write ≤ `MOTION.boardFoldMs`; 0 writes per 900 ms idle. RED at
  HEAD; the pass-1 build reds the 120 Hz landing (0.05 px, stopped at 361 ms).
- **G-LIVE-5 painted contrast, the board stop included** — every stop ≥ 3:1 from painted
  bytes, both engines, both themes, WITH the board cell against its own fill (floor 3.61 /
  3.73 at 0.95). RED at HEAD (WebKit UA 2.15; logo 2.70; deck 2.69).
- **G-LIVE-6 forced-colors, with its negative control** — every `:focus-visible` stop computes
  `outline-style: solid` under forced-colors, EXCEPT `.cell-native-input` whose ring rides the
  cell (`2px solid`, offset −2, asserted in the same run); and a raised (0,4,0) suppression
  proves the arm CAN go to zero. RED under the suppression as first written.
- **G-LIVE-7 cadence truth** — `beatsFor(BOIL_CONFIG.intervalMs) === 1` beside a grep that
  `pencilConfig.ts` no longer says "6.7". RED at HEAD.
- **G-LIVE-8 the living mark turns off nothing else** — with cell 40 focused, a conflicting,
  a peer-cursor and a hovered cell each compute `.cell-ghost-path` opacity 1 at
  `data-mark-pose` 0, 1, 2, 3, both engines. RED on the pass-1 build (0 at poses 1–3).
- **G-LIVE-9 no stop is unmarked** — with `aria-activedescendant` removed and the scrollport
  focused, exactly one `.focus-ring` exists and it frames the first option. RED on the pass-1
  build (0 rings).
- **G-LIVE-10 the ring rings a verb** — after arming on a dirty board, `document.activeElement`
  is `.guard-btn.guard-keep` and the ring's area ≤ 2× that verb's box. RED on the pass-1 build
  (35,130 px² on the container).
- **G-LIVE-11 the laminate yields (chair §6.11, gates 1–3)** — a selected because-cell's ground
  reads the selection's own L\* ±0.5 (MRK-WASH's instrument); the rim under selection ≥ 3:1
  against the selection body; the one-ground unit test. RED at HEAD (13.10 L\*; 2.20 / 2.50).
- **G-LIVE-12 the seventh rule is gone** — grep 0 for `.sudoku-cell:focus-within` AND a focused
  cell computes `outline-style: none`, `background: rgba(0,0,0,0)` — the second half stays
  green if the sheet is ever layered only because the first half is red. RED at HEAD (grep 1).
- **G-LIVE-13 the walk evicts nothing** — 30 keyboard steps, then `useBoilCache`'s `cellRects`
  entry for the board is still resident (a hit, not a regeneration). RED on the pass-1 build.
- Guards that must stay green: R3-a1 per unit of edge in [0.5×, 2.0×]; σ-space 0.092
  unchanged; 9/9/9 and +3; hue census byte-identical; copy 0/0; a11y 3.5; engine σ parity to
  4 dp; the toggle's 54 / 12 px offset untouched.

MOVED, not re-cut: R6 law-probe R1 (diff banked, `../research/MRK-LIVE/instruments/`). OPEN
by design: the spoken-gallery ballot (W3's), the WebKit quiet-box trace (a condition, not an
omission), the dist-bound run (sequenced after W8 §8.1). U-10: nothing here closes; the owner
sees crops 1–3 at the re-look.

## 6 · Coupling with MRK-ABS, stated for the agglomerator

The two routes are INCOMPATIBLE on two axes and are not merged here: (i) the token — this
family one value both themes; MRK-ABS a dark alias of crayon-blue (law 18/23-shaped); the
chair's §6.1 makes §6's leader the owner and this spec states the constancy principle so the
choice is argued on a principle, not on taste; (ii) the ring's geometry — this family keeps
pose 0 byte-identical to `generateCellRects` at the cell's edge; MRK-ABS insets the ring to
0.86 × cellSize. One number that binds BOTH: in dark, the ring's ink where it lands on the
grid rule reads under 3:1 for either token (alias measured 1.86; `#3a7bc4` ≈ 2.8 by my own
arithmetic, unmeasured). At 16×16 the two inks share 1.36 px of band before any wander, so
the inset is the only lever that keeps them apart, whichever ink wins. If the agglomerator
grafts the inset onto this route, "pose 0 byte for byte" becomes "pose 0 is the inset rect's
output byte for byte" — the guard's shape survives, its subject moves.
