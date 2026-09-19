# PLR-PLACE — pass 1 (RESEARCH) · the seating chart

T9-W7 §11 · §12 · mark M14. Lane port 127.0.0.1:4243. Read-only on the product: nothing under
`src/`, `e2e/` or `scripts/` was touched, no worktree was cut, and the prototype is a
`page.addScriptTag` overlay (`proto/mount-miniature.js`) that imports the app's OWN modules
through the dev server rather than copying their geometry.

**The idea, restated so the verdict has a subject.** Presence is a PLACE: a 24×24 miniature of
the board's own frame with a coloured dot per peer at the cell they are looking at; the lobby is
the same miniature at ~96px with the names beside it, in the @mbabb card's pose; solo is an
empty frame. Nothing shown that the wire does not carry.

**Verdict: ADJUST, and the adjustment is a SPLIT at the size boundary.** The 24px half dies on
two independent measured floors and takes the family's motion question with it. The 96px half
survives every floor it was asked to clear and is the only reading in this section that answers
"where are they". Detail in §7.

Run recipe for everything below (the specs live in `probe/`; they are run from a scratchpad copy
because `@playwright/test` resolves from `web/frontend/node_modules`):

```
# from web/frontend
npx vite --host 127.0.0.1 --port 4243 --strictPort
cp probe/*.ts $SCRATCH/ && cd $SCRATCH
PLC_HOME=<this dir> npx playwright test -c $SCRATCH/pw.config.ts <spec>
```

---

## 1 · The substrate, verified on this tree

| claim | cite | reading |
|---|---|---|
| `cur` is throttled leading+trailing | `useSession.ts:910` | `const CUR_MS = 120` — a **8.33 Hz ceiling**, not 8.0; the header's "~8 Hz" is right to two figures |
| `cur` is sent on FOCUS, not on movement | `GameBoard.vue:456-458` (`onCellFocus`), `:476` (`focusout` → `noteFocus(null)`), `App.vue:609` (deck open → `null`) | the wire carries one frame per focus CHANGE; a peer reading a cell sends nothing |
| `cur` never enters the ledger and never rides `st` | `useSession.ts:346-349` | attention is not state |
| a peer's ghost expires on silence | `useSession.ts:951-953`, `:624` | `PRESENCE_EXPIRY_MS = 45000`, armed by `cur` alone |
| the frame path | `gridPaths.ts:421-473` → `generateRectBoilFrames` (`:213`) at `FRAME_X_PAD 12 / FRAME_Y_PAD 0` (`:338-339`) | 4 poses, pose 0 is the still one |
| the board paints that frame at | `HandDrawnGrid.vue:339` | `stroke-width="12"` in a **1000-unit viewBox** (subgrid 8, cell 5) |
| the filter budget | `filterBudget.ts` | exact-match 9, both directions; re-derived **9** on this tree |
| the tap floor is a token | `App.vue:961` (`--tap-floor: 2.75rem`), declared on `.page-root`, **not `:root`** | the coarse min-WIDTH arm (`index.css:846-850`) covers only `.ctrl-btn` / `.mobile-heading-btn`; `.attribution-trigger` is named out |
| the @mbabb shell | `AttributionCard.vue:129-189` | `position: fixed; top: var(--head-rule); left: 0`, card 256 wide, popover 80%, border 2px at 30%, radius 16, padding 16 |
| the dots' ink | `playerIdentity.ts:68-70` | one line, one var rebind: `--color-user-ink: oklch(var(--peer-ink-l) 0.11 {(i×137.5)%360}deg)` |
| the damping precedent | `useJoinWash.ts:101-103` | `bootSuppressMs 1200 · coalesceMs 400 · minGapMs 4000` |
| the hand's cut | `index.css:95-96` | `U+0020-0021, U+0027, U+002D-002E, U+0030-0039, U+003F, U+0043, U+0052, U+0053, U+0061-0069, U+006B-0077, U+0079-007A, U+00D7, U+2014, U+2026` |

Two corrections the lane owes the census:

- **Digits are in the hand and a COMMA is not.** `U+0030-0039` is in the range; `U+002C` is
  not, and neither is a colon. A count line (`3 here`) costs no re-cut; `3 players, here` does.
  `node scripts/check-font-coverage.mjs` at HEAD: OK, 2 faces, Patrick Hand 46 codepoints /
  4,312 B.
- **R5's F14 measured the @mbabb trigger at 75.5 × 39.8 on a phone.** That is the FINE-pointer
  box. On a real coarse phone (390×844, dpr 3, `isMobile`+`hasTouch`) it is **75.5 × 44** — the
  coarse floor bites (`index.css:834`). The free band is unmoved at **250.5px**.

---

## 2 · THE RATE — the family's first measurement

`probe/rate.spec.ts`. Two pages, one context, `?wire=local`. The tap wraps
`BroadcastChannel.prototype.postMessage` in an `addInitScript` on the SENDING page and forwards
unchanged, so the trace is the product's own traffic. Four arms, one 60 s scripted traversal
each where stated; the four damping rules are computed off the SAME trace, so this is one
recording read four ways, not four runs.

**chromium / webkit**

| arm | cur/s | gap p50 | gap min | raw moves/min | beat 125ms | settle 400 | settle 700 | settle 1200 |
|---|---|---|---|---|---|---|---|---|
| ORDINARY 60 s (80 arrow moves, a digit every 6th, two 4 s pauses) | **1.23 / 1.17** | 700 / 823 | 128 / 130 | **74.7 / 71.4** | 74.7 / 71.4 | 52.5 / 53.3 | **33.3 / 37.2** | 12.1 / 12.1 |
| SLOW 60 s (one move every 2–4 s) | 0.30 / 0.33 | 2695 / 3105 | 121 / 120 | 18.9 / 20.7 | 17.8 / 19.7 | 17.8 / 19.7 | 17.8 / 19.7 | 17.8 / 19.7 |
| TAP 14 s (20 cell taps) | 1.39 / 1.46 | 700 / 718 | 443 / 125 | 88.8 / 90.4 | 88.8 / 90.4 | 88.8 / 86.1 | 48.9 / 56.0 | 4.4 / 4.3 |
| SWEEP 20 s (key repeat at 30 ms) | **8.25 / 8.09** | 121 / 124 | **120.1 / 120.0** | 469.8 / 463.6 | 454.7 / 457.6 | 3.0 / 3.0 | 3.0 / 3.0 | 3.0 / 3.0 |

Banked at `logs/rate-chromium.json` / `logs/rate-webkit.json`, traces included. The whole
battery was run **twice** end to end; the first run gave chromium ordinary 74.7 raw / 33.3 at
settle 700 (identical) and webkit 72.5 / 37.8 against 71.4 / 37.2 here, and sweep 8.25 / 8.09
both times. The table above is the banked run; the spread between runs is the noise band.

Also measured: one `cur` on the local wire serialises to **82 B** (the header's "roughly 300 B a
frame" is the relay's envelope, not the payload — not re-derived here, so it is flagged, not
corrected). Tabbing out of the grid sends **2 frames, the second `p: null`** — "looked away" is
free and already on the wire. The throttle's shape is confirmed: two presses inside one window
produce two sends (leading + trailing), cells `[0, 2]`.

### What the rate says

1. **The ceiling is real but it is only reachable by key repeat.** The sweep hits 8.25 cur/s
   with a floor gap of exactly 120.0 ms in both engines. Ordinary play is **1.2 cur/s**, six
   times under it.
2. **Below the ceiling, `cur` is not a stream — it is one event per focus change.** `raw` and
   `cur_frames` are equal in every non-sweep arm. There is no smoothing left to do: the dot's
   motion budget IS the peer's focus-change rate.
3. **Quantising to the shared 125 ms beat is NOT a damping.** Ordinary 74.7 → 74.7 and
   71.4 → 71.4, unchanged in both engines; sweep 469.8 → 454.7, a 3% cut. `CUR_MS` 120 < beat
   125, so the beat almost never has two frames to collapse. This retires one of the charter's
   three candidate arms on its own number.
4. **Settled-cell is the only real damping, and it cannot be read off arrivals.** The wire sends
   nothing while a peer sits still, so "settled" is a RECEIVER-side timer: hold the latest
   arrival, restart on a newer one, paint when it fires. At 700 ms it takes ordinary play
   74.7 → 33.3 and 71.4 → 37.2, and the whole 20 s sweep → **3.0 moves/min** (a sweep becomes
   one landing).
5. **It costs a thinking peer nothing.** The SLOW arm reads 17.8/19.7 at settle 400, 700 AND
   1200 — identical. Damping deletes exactly the motion nobody asked for.

### And then the sum, which is where it dies

Damping is per-peer; the masthead's budget is the SUM. Per-peer rates averaged over both
engines, and the peer count at which the mark reaches the estate's own 8 Hz beat:

| rule | moves/min/peer | steps/s/peer | N at 1 step/s | **N at 8 steps/s** |
|---|---|---|---|---|
| raw | 73.1 | 1.218 | 0.8 | **6.6** |
| beat 125 | 73.1 | 1.218 | 0.8 | 6.6 |
| settle 400 | 52.9 | 0.882 | 1.1 | 9.1 |
| settle 700 | 35.3 | 0.588 | 1.7 | **13.6** |
| settle 1200 | 12.1 | 0.202 | 5.0 | 39.7 |

The owner's standing figure is "16+ players within reason" (R5 F9). At 16 peers only the
1200 ms settle keeps the masthead under 8 steps/s — and 1200 ms costs a single ordinary peer
**84% of its moves** (74.7 → 12.1, one 2.67px jump every 5 s at 24px). That is the charter's own
stated collapse condition, met: *"if the honest damping makes the dots effectively static,
report the family as collapsed into a count."*

**KILL 1 (ambient motion in the masthead): FIRES at N ≥ 7 undamped, N ≥ 14 at the best honest
damping, and the damping that survives a full room empties the mark.**

---

## 3 · THE DOTS AND THE FRAME — the engine's painted bytes

`probe/geometry.spec.ts` (the path, from the app's own module) and `probe/paint.spec.ts` (the
pixels, screenshot → `sharp` → raw RGB, four grounds, both engines, dpr 1 and 2). No hex
arithmetic anywhere.

### 3.1 The geometry, before a pixel is painted

Frame pose 0: **25 vertices, 814 path chars, wobble max 7.07 units / rms 3.56 units**.

| | at 24px | at 96px |
|---|---|---|
| scale | 0.024 | 0.096 |
| frame stroke (12 units) | **0.288 px** | 1.152 px |
| subgrid stroke (8) | 0.192 px | 0.768 px |
| cell stroke (5) | 0.120 px | 0.480 px |
| wobble max / rms | **0.170 / 0.086 px** | 0.679 / 0.342 px |
| cell pitch 9×9 | **2.667 px** | 10.667 px |
| cell pitch 16×16 | **1.500 px** | 6.000 px |
| units per CSS px | 41.7 | 10.4 |

**The hand does not survive the shrink.** At 24px the wobble is 0.170 px on a 0.288 px stroke —
both under one device pixel even at dpr 2. "The same `wobbleRect` seed at small scale" resolves
to a grey rectangle. This is arithmetic, not taste, and it is true before any contrast question.

### 3.2 The painted contrast, WCAG 1.4.11 (3:1 non-text), best pixel in the mark

**dpr 1 — the desktop case, which is where a 24px head mark lives**

| ground | frame@12u | dots 9×9 | dots 16×16 | frame@96px | dots@96px |
|---|---|---|---|---|---|
| light `--color-background` | **1.52 / 1.52** | **2.51–2.66 / 2.35–2.46** | 1.29–1.69 / 1.15–1.92 | 10.10 / 18.99 | 5.54–5.97 |
| light `--color-card` | **1.53 / 1.52** | **2.54–2.69 / 2.36–2.48** | 1.30–1.70 / 1.15–1.93 | 10.20 / 19.45 | 5.68–6.11 |
| dark `--color-background` | **1.59 / 1.61** | 4.17–4.38 / 3.77–3.93 | 1.40–2.37 / 1.17–2.90 | 9.77 / 16.18 | 9.97–10.63 |
| dark `--color-card` | **1.62 / 1.65** | 4.14–4.34 / 3.75–3.95 | 1.43–2.35 / 1.17–2.91 | 9.65 / 15.84 | 9.76–10.40 |

**dpr 2** — frame light **2.94 / 2.95** chromium (fails), 3.05 / 3.06 webkit (clears by 0.05);
frame dark 3.69–3.86 (clears); dots 9×9 5.21–10.63 (clear); dots 16×16 clear on best pixel but
the nominal centre reads the GROUND (1.07–1.36) — the dot is one or two device pixels, placed
sub-pixel.

Bold is a failure. **At 24px, dpr 1, on both light grounds, in both engines, the dots read
2.35–2.69:1 and the frame reads 1.52–1.53:1.** The same inks read 5.45–6.11:1 at 96px, so the
failure is SIZE and not colour — the negative control the charter asked for.

### 3.3 The sweeps — what it would cost to fix

Dot radius as a fraction of the cell pitch, 9×9, worst light ground, best pixel:

| frac | radius (css px @24) | diameter (device px) | dpr 1 chromium | dpr 1 webkit | dpr 2 |
|---|---|---|---|---|---|
| 0.20 | 0.533 | 1.07 | 1.52 | 1.33 | 2.81 |
| 0.28 | 0.747 | 1.49 | 2.08 | 1.91 | 5.07 |
| **0.32** (the natural in-cell dot) | 0.853 | 1.71 | **2.59** | **2.40** | 5.67 |
| **0.40** | 1.067 | 2.13 | **3.45** | **4.30** | 5.92 |
| 0.50 | 1.333 | 2.67 | 4.98 | 5.84 | 5.92 |

Frame stroke in viewBox units, 24px, dpr 1:

| units | css px | wobble/stroke | chromium | webkit |
|---|---|---|---|---|
| **12** (the board's) | 0.288 | 0.589 | **1.52** | **1.52** |
| 20 | 0.480 | 0.354 | 2.03 | 2.08 |
| 28 | 0.672 | 0.253 | 3.02 | **2.98** |
| **42** | 1.008 | **0.168** | 5.68 | 6.11 |
| 60 | 1.440 | 0.118 | 7.35 | 13.73 |

So the mark can be made to pass, and the price is stated: the dot must be **≥ 0.40 of the cell
pitch** (2.13 device px inside a 2.67 px cell) to clear 3:1 at dpr 1, and **0.50 to clear 4.5:1
— at which the dot IS the cell** and two neighbours touch. The frame needs **42 units, 3.5× the
board's own**, to clear 3:1 in both engines, and at 42 the wobble is 16.8% of the stroke against
the board's 58.9%: the hand flattens by the same factor that makes it visible.

**KILL 2 (sub-3:1 dots at 24px by construction): FIRES on the desk at dpr 1, both light grounds,
both engines — and clearing it costs the "place" (a cell-filling dot) and the "board's own
frame" (a 3.5× stroke).** The 16×16 board has no honest 24px miniature on any axis: 1.5px pitch,
1.15–2.91:1 dots.

---

## 4 · SIXTEEN DOTS, THE LOBBY, THE FLOOR, THE BUDGET

`probe/lobby.spec.ts`. A real two-page room, then 14 further peers driven onto the same channel
in the wire's own words (`hi` + `cur` at the live epoch — `localWire` treats any message from an
unseen id as a join, `useSession.ts:240-242`). Nothing forged that the grammar does not carry.

**The room.** 17 roster rows (self + peer + 14 driven + the probe's own `hi`). The roster box is
**268.2 × 120**, `scrollHeight` 348, **5.9 rows visible** — R5's F9 re-derived unmoved. The 16th
ink assigned live is `oklch(0.5 0.11 262.5)`, which is **0.4° from `--color-user-ink` #2563eb**:
R5 F4's worst collision, reproduced in a live room rather than computed.

**The chart's density.**

| | dots | same cell | nearest neighbour | at 24px | at 96px |
|---|---|---|---|---|---|
| spread (`p = 5i+1`), 9×9 | 14 | 0 | 1.41 cells | 3.77 px | 15.08 px |
| spread, 16×16 | 14 | 0 | 1.41 cells | 2.12 px | 8.49 px |
| **cluster** (all 14 inside one 3×3 box), 9×9 | 14 | — | — | the whole box is **8.0 px** | 32.0 px |
| cluster, distinct cells | 9 of 14 | **5 cells hold 2** | deepest stack 2 | | |

The spread is the flattering case. People work the region they are arguing about; in the cluster
arm the chart resolves 9 places inside an 8×8 px square at 24px.

**The lobby at 96px, in the @mbabb card's pose** (`frames/lobby-96-16-names-light-1280.png`):

| | measured |
|---|---|
| card | **256 × 301.3** (the @mbabb card is 256 × **151**) |
| chart | 96 × 96, 1 path + 14 circles, 17 nodes |
| names column | **112 px** wide, 265.3 tall, 14 rows at 18.95 px, `--type-tag` **14.048 px** |
| slugs clipped to an ellipsis | **2 of 14** |
| DOM cost | 4,345 B markup, **310 B per dot**, 33 nodes for the whole card |
| solo (empty) | 0 circles, 1 path, **1,229 B** |

**The budget.** `filterBudget` counting rule (own filter ≠ none AND own display ≠ none):

| scene | total | rows |
|---|---|---|
| desk 1280×800, settled, no overlay | **9** | the allowlist |
| desk 1280×800 with the 96px lobby chart mounted | **9** | unchanged |
| phone 390×844 dpr3 coarse, settled, with the 24px mark mounted | **9** | `g.(none)` 2 · `svg.toggle-icon` 2 · `g.boil-pose` 4 · `svg.sparkle-icon` 1 |

Both engines. **π holds: the miniature mints zero filters**, because pose 0 of a baked path is
geometry and nothing else. (Trap banked: censusing the phone before the bake reads **21** —
9 + 8 `svg.rest-pose` + 4 `g.logo-pose`, exactly the boot window `filterBudget.ts` documents.
Poll to 9 before measuring.)

**The floor**, 390×844 dpr 3, coarse:

| | measured |
|---|---|
| `.attribution-trigger` | 75.5 × **44** at (0, 0) |
| the sun | 64 × 64 at x = 326 |
| free band | **250.5 px** |
| the 24px mark in a `--tap-floor` box | **44 × 44** at (75.5, 12) — clears BOTH dimensions |
| band left after it | 206.5 px |
| overlaps the sun | no |
| **negative control** (floor removed) | **24 × 24** — fails both dimensions |

`--tap-floor` reads empty off `documentElement` because it is declared on `.page-root`
(`App.vue:961`); the fallback literal is the shipped value. A head mark must declare BOTH
dimensions itself: the coarse `min-width` arm names `.ctrl-btn` and `.mobile-heading-btn` only.

---

## 5 · SPEECH, MOTION, PERSISTENCE, PRIVACY

`probe/i3-overlay.spec.ts`, `probe/voice.spec.ts`.

**I3 greens under the overlay, both engines.** R5's I3 assertions run verbatim against the
family's own mark: 1 candidate, box **(88, 12, 44, 44)** — x < 200, y < 120 — and its press
reveals `[data-lobby]`. The accessible name is `3 players on this board` live and `players on
this board, just you` solo: a COUNT (R6 law 32), not the roster's own `who's on this board`
(law 33, one name per act). Nothing minted twice.

**M19 holds, measured.** With focus on `Row 1, column 1, empty`, a third page joined the room:
focus unmoved, lobby still shut, both engines.

**Six live regions already speak at HEAD** — `margin-note`, `board-voice`, `players-status`,
`players-roster` (`role="log"`, `who's on this board`), `players-alone`, `copy-status`. A lobby
mints none of them.

**PRM: the dot steps by construction.** Under `reducedMotion: reduce` the mounted dot computes
`transition-duration: 0s`, `animation-name: none`, `filter: none`. Nothing to collapse, because
nothing tweens. (This matches the estate's own peer ghost, which is "sketched on over 180ms,
never tweened between cells" — `gameCell.css:229-241`, stroke-width 4, stroke-opacity 0.55,
fill-opacity 0.04.)

**Persistence, which sharpens the third kill rather than confirming it.**

| | on the board | in the gallery |
|---|---|---|
| desk `.corner-left` | painted, 75.5 × 39.8 at (0, 12) | **still painted, same box** |
| phone `.mobile-attribution` | painted, 75.5 × 44 at (0, 0) | **`display: none`** |

So the head's left corner is the most persistent surface **on the desk only**: a place-mark
there would be on screen while the reader is browsing the deck and not at the board at all. On a
phone the mark leaves with the board. One design, two persistence promises.

**Privacy: the opt-out is already in the grammar, and it costs nothing.** Driven and measured:

| peer | roster row | `peerCursors` entry | has a place |
|---|---|---|---|
| sends `cur {p: null}` and nothing else | yes | `null` | **no** |
| sends no `cur` at all | yes | absent | **no** |
| ordinary | yes | `33` | yes |

A page that never sends a non-null `cur` is already representable, every peer already renders it
as "looked away", and **no new message kind is needed**. What the product's own voice would say,
in its own register (`M16`; the well's incumbent is "share this board and everyone writes on the
same grid"): *"everyone here can see which cell you are on"*, with the off switch reading
*"hide where i am looking"*. Both are inside Patrick Hand's cut (no comma, no colon needed).

**KILL 3 (a true but private fact on the most persistent surface): does NOT fire as written.**
The fact is already public — the peer ghost is drawn on the board at the cell itself — and the
opt-out is free. What DOES stand is narrower: the desk mark outlives the board, and there is no
UI today for the opt-out the grammar already permits.

---

## 6 · INSTRUMENTS — before and after

Re-run unchanged on this tree against 127.0.0.1:4243.

| id | file | at HEAD (this tree) | under this family's overlay |
|---|---|---|---|
| I2 | `r0/…/instruments.spec.ts` | **RED** both — self `rgb(37,99,235)` vs room `oklch(0.5 0.11 0)` | **stays RED.** F1 is a substrate fact and this family does not touch it; worse, the chart AMPLIFIES it (see §7) |
| I3 | same | **RED** both — 0 candidates | **GREEN** both — 1 candidate at (88,12,44,44), press opens the lobby |
| I4 | same | **RED** both — 137.5° → 327.5° on one page | **spoken to, not cured**: a peer's dot can change colour mid-read (`adoptInk` runs above `source.restore`) |
| I5 | same | **RED chromium** (`collided: true`) · **GREEN webkit** (`collided: false`) | **spoken to, not cured** |
| I1 | `r0/…/instruments-family-law.mjs` | **RED, exit 1, 37 collisions** (unchanged, index 11 at 0.2°, index 15 at 0.4° from your blue) | **RED. This family clears NO anchor set** — it paints the incumbent walk and inherits R2's question whole |

**I5 moved and the move is reported, not explained.** R5 banked it RED in both engines; this
tree gave chromium `collided: true` and webkit `collided: false` on a single run. It was not
re-run to exhaustion. Treat it as a divergence to re-derive, not as a cure.

New rows, born beside the old ones:

| id | asserts | state |
|---|---|---|
| P1 | the mark and the lobby add ZERO live filters (census 9 by exact match, desk and settled coarse phone) | **GREEN by construction**, both engines |
| P2 | a peer's dot never transitions (PRM: step, never glide) | **GREEN by construction** (`transition-duration: 0s`) |
| P3 | a 24px mark clears 3:1 on four grounds at dpr 1 | **RED** — 1.52–2.69:1 (§3.2) |
| P4 | a peer can withhold their place without a new message kind | **GREEN** — `cur {p:null}` or silence |

---

## 7 · WHERE THE FAMILY DIES, AND WHAT SURVIVES

Three kills were named. Two fire, one does not, and the prototype found a fourth the charter did
not anticipate.

**The fourth: the chart cannot name its own dots.** In `frames/lobby-96-16-names-light-1280.png`
fourteen dots sit beside fourteen names and the only binding between them is HUE — at 12.5°
minimum separation over the first 16 indices (R5 F2), at C 0.110, with index 15 sitting 0.4°
from the reader's own blue. A reader cannot say "that one is heron" without counting. So the
lobby's whole claim — *"'who is here' and 'where are they' in one object"* — is one object with
two readings that do not join. This is F1 and F4 arriving together on a surface that makes both
visible at once, and it is the strongest argument in the pass 1 record that §11's per-player
colour system must land BEFORE any chart is worth drawing.

**What dies: the 24px masthead miniature.** Three independent floors, each measured:

1. the frame is 0.288 px of stroke carrying 0.170 px of wobble — the hand is gone before contrast
   is asked about (§3.1);
2. the dots read 2.35–2.69:1 at dpr 1 on both light grounds, both engines, and clearing 3:1
   costs the dot its cell (§3.2–3.3);
3. the motion that would make it a PLACE rather than a picture reaches the estate's own 8 Hz
   beat at 6.6 peers, and the damping that survives 16 peers leaves 12 moves/min — a 2.67 px
   step every 5 seconds, which is the collapse the charter named in advance (§2).

**What survives: the lobby chart at ~96px.** Every floor it was asked to clear, it clears:
dots 5.45–6.11:1 light and 9.52–10.63:1 dark on all four grounds; frame 9.65–19.45:1; zero
filters; 310 B per dot; 44×44 on the trigger with a working negative control; I3 green; M19
held; PRM by construction; the opt-out free. And the motion question changes character inside
it, because a surface the reader OPENED is not ambient: the 700 ms settle (33–37 moves/min/peer,
and a 20 s keyboard sweep collapsed to 3) is honest damping in a place where motion was asked
for.

**RECOMMENDATION — ADJUST, by splitting the family at the size boundary.** The masthead half
collapses into a count, which is this section's sibling territory rather than this family's: a
still mark, the room's colour, a number, opening on the reader's press. The lobby half is kept
and is the family's real contribution — the only reading in §11 that answers "where are they" —
and it carries four named pieces of work into pass 2: (a) bind a dot to a name without asking
the reader to discriminate hue, (b) the card at 16 names (301.3 px against the incumbent 151,
with 2 of 14 slugs clipped in a 112 px column), (c) the 700 ms settle written as a constant
beside `useJoinWash.WASH` rather than invented, and (d) the 16×16 board, whose dots DO clear
contrast at 96px (5.54–6.11 light, 9.76–10.63 dark) but whose 6.00 px pitch puts a spread
fourteen at 8.49 px nearest-neighbour and a clustered fourteen inside a 18 px square. If the owner disposes against
the split, the family is a KILL and not an ADJUST: the 24px mark cannot be made to pass without
ceasing to be a miniature of this board.

---

## 8 · SKETCHES

**A — what was measured and what it costs (24px, 9×9, dpr 1)**

```
   the mark, 24x24               what the numbers say
  +------------------+
  |  . . . . . . . . |   frame stroke 0.288px  -> 1.52:1   FAILS 3:1
  |  . o . . . . . . |   wobble       0.170px  -> sub-pixel, no hand
  |  . . . . . . . . |   cell pitch   2.667px
  |  . . . . x . . . |   dot r 0.32   0.853px  -> 2.51:1   FAILS 3:1
  |  . . . . . . . . |   dot r 0.40   1.067px  -> 3.45:1   passes, 80% of the cell
  |  . . . . . . . o |   dot r 0.50   1.333px  -> 4.98:1   the dot IS the cell
  |  . . . . . . . . |
  +------------------+   frame at 42u (3.5x)   -> 5.68:1, wobble/stroke 0.589 -> 0.168
   24px = 2.667px/cell
```

**B — the lobby that survives, and the join that is missing**

```
  +--------------------------------------------+  card 256 x 301.3 at 14 names
  |  +----------------+   automatic-nightinga…|  |  (@mbabb's own card is 256 x 151)
  |  |   o        o   |   working-catfish     |  |
  |  |      o         |   ideological-mocking…|  |  names column 112px, --type-tag 14.048
  |  |  o      o    o |   common-chimpanzee   |  |  2 of 14 slugs clip
  |  |       o    o   |   tropical-hornet     |  |
  |  |   o        o   |   specified-clownfish |  |  every dot clears 3:1 (5.45-10.63)
  |  +----------------+   … 9 more            |  |  zero filters, 310 B per dot
  +--------------------------------------------+
        96 x 96                  ^
                                 |
              WHICH DOT IS WHICH? 14 hues, 12.5 deg apart, index 15 = your own blue.
              The two halves of the object never join. This is the pass-2 problem.
```

**C — the split the recommendation proposes**

```
  head, 390 coarse            the reader presses
  +-----------------------+
  | @mbabb  [ 3 ]     sun |   ---->   +-----------------------------+
  +-----------------------+           |  [ chart 96 ]  three names  |
    75.5x44   44x44  64x64            |                 you         |
              ^                       |  leave                      |
              |                       +-----------------------------+
    STILL. the room's colour          opened on purpose, so motion is
    and a count. no motion,           not ambient: settle 700ms, dots
    because 6.6 peers of raw          step and never glide.
    dots reaches the 8Hz beat.
```

---

## 9 · FILES

```
README.md                          this record
probe/pw.config.ts                 the scratch config (baseURL 127.0.0.1:4243, no webServer)
probe/rate.spec.ts                 §2  the wire rate + the four damping arms
probe/geometry.spec.ts             §3.1 the frame path at small scale, from the app's module
probe/paint.spec.ts                §3.2-3.3 painted contrast, four grounds, dpr 1/2, + the sweeps
probe/lobby.spec.ts                §4  sixteen peers, the chart, the floor, the budget
probe/i3-overlay.spec.ts           §5  I3 under the overlay, M19, the live-region census
probe/voice.spec.ts                §5  persistence, PRM, the opt-out
proto/mount-miniature.js           the overlay: window.__PLC.mount/clear, replayable
logs/*.json                        every reading above, machine-readable
logs/instruments-family-law-rerun.txt   I1 re-run: RED, 37 collisions, exit 1
frames/lobby-96-16-names-light-1280.png   §4, §7, sketch B   (35.7 KB)
frames/mark-24-n3-head-390.png            §3, sketch C       (20.1 KB)
```

Two crops, 55.8 KB. Every other claim is a number.
