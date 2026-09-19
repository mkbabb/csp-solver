# T9-W7 pass 1 · MRK-LIVE — THE LIVING MARK

Section §5 the wobble law · §6 focus rings. Lane port `127.0.0.1:4238` (`npx vite --host
127.0.0.1 --port 4238 --strictPort`). Every number below was taken on THIS tree (uncommitted
W3/W6/W7-loop work included) with `probe/pw.config.ts` — a copy of the estate's default minus
`webServer`/`globalSetup`, pointed at 4238 — chromium and webkit, 1280×800 and 393×699 dpr3.
The estate's own specs ran on `probe/e2e.config.ts`. No product file was edited: every
prototype is a `page.evaluate` overlay under `proto/`, replayable.

**Verdict: DEVELOP the wobble half (§5). ADJUST the ring half (§6): the singleton is REFUTED
by the deck; the one drawn idiom lands as a component with an event-driven position, and the
deck keeps an owner of its own.** The reasoning is in §7.

> **Where the probes ran.** Playwright resolves `@playwright/test` from the test file's own
> directory, and `docs/` has no `node_modules`. The suite therefore ran from a scratchpad copy
> with a `node_modules` symlink into `web/frontend`; the sources here are byte-identical to
> what ran, and re-running them needs only that symlink.

---

## 1. The substrate, verified on this tree

Every cite re-derived here; three of the charter's moved with W3/W6.

| claim | site on this tree | reading |
|---|---|---|
| the ghost is one static path per cell | `DigitCell.vue:411-422` (`.cell-ghost` div → one `<svg>` → one `<path :d="ghostPath">`) | confirmed; the path is resident on EVERY cell |
| its geometry | `GameBoard.vue:156 generateCellRects` → `gridPaths.ts:42-70` → `wobbleRect(roughness 0.4, segments 4 / 2 at ≥16, seed 42+500+pos*7, jagged)` | confirmed |
| passed down | `BoardHost.vue:300 :ghost-path="s.cellRects[pos]"` | confirmed |
| the amplitude law | `node_modules/@mkbabb/pencil-boil/dist/path.js:63` `maxDisplace = roughness * len * 0.015` | confirmed |
| the boiled-rect primitive already exists | `gridPaths.ts:213 generateRectBoilFrames(x,y,w,h,opts,boilAmount,frameCount,radius,grain?)` | exported, grain-bakes, used by `:352 generateFrameTraceFrames` |
| the shared beat | `pencilConfig.ts:123 MOTION.beatMs = 125`; `:200 beatsFor`; `:268-282 BOIL_CONFIG {frameCount 4, intervalMs 150, cellBoil 0.3}`; `boilBeat.ts:63 useBeatFrame` | see §2 — **the grid's real cadence is 125 ms, not 150** |
| the beat's DOM carrier | `HandDrawnGrid.vue:73 useBeatFrame`, `:386` `.boil-frame-bitmap.is-active`, `:405-410` `.boil-frame-layer.is-active` | 4 carriers, both stacks track the beat |
| the peer wash is a CSS box | `DigitCell.vue:263` `<div class="cell-peer">`; `gameCell.css:123-125` `background: color-mix(--color-crayon-blue 7%)` | confirmed: no geometry at all |
| the ghost's own filter | `budget.probe.ts` R3-h | `none` at 4×4 / 9×9 / 16×16, both engines |
| the false modality comment | `gameCell.css:242-244` ("only keyboard focus gets the drawn-on ring") | **false**, re-measured — §6 |
| the six bespoke rects | `DarkModeToggle.vue:741`, `HandwrittenLogo.vue:545`, `DrawerTab.vue:152`, `GameCard.vue:437`, `StagingBand.vue:432`, `GameGallery.vue:1451`; `index.css:446 outline-ring/50` | confirmed, unmoved |

### 1.1 THE FIRST CORRECTION: pose 0 IS today's ring, byte-for-byte

`logs/explore.json`, chromium, 9×9, focused cell pos 41:

```
generateRectBoilFrames(col*cellSize, row*cellSize, cellSize, cellSize,
                       {roughness 0.4, segments 4, seed 42+500+pos*7, jagged}, 0.3, 4)[0]
    ===  the cell's live ghostPath          →  pose0EqualsLive: true
```

The cure is not a new primitive and not even a new path: it is three siblings behind the one
that is already there. **The resting ring cannot change, because pose 0 is the incumbent.**
`R3-a4` asserts it rather than assuming it: ring σ over space before 0.092 px, after 0.092 px,
`identical: true`, at all three board sizes, both engines (`logs/live-law-*.json`).

### 1.2 THE SECOND CORRECTION: the beat is 8 Hz, not 6.7 Hz

`beatsFor(150) = max(1, round(150/125)) = 1`, so `BOIL_CONFIG.intervalMs: 150` quantizes to ONE
125 ms beat. Measured pose-change intervals on the live board: 124 / 125 / 117 / 133 / 125 /
125 / 125 / 125 / 125 ms (`logs/explore.json`, `beat.changes`). **The grid boils at 8 Hz, four
poses per 500 ms cycle.** Every "150 ms / 6.7 fps / shooting on fours" figure in the R3 and R6
censuses is the config's nominal, not the cadence on screen.

This re-reads the charter's own kill condition. "Ambient motion at 8 Hz under a selected cell"
is not a new cadence the family would introduce — **it is the cadence the board under that cell
is already running.** The question is not the rate. It is residency.

---

## 2. §5 — R3-a RE-BASED, and the born-RED row

### 2.1 What R3-a asserts today, and why it is the wrong law

r0's `wobble.probe.ts` R3-a asserts the ring's σ over SPACE lands in [0.5×, 2.0×] the grid's.
Re-run unchanged on this tree it is RED in both engines at exactly r0's numbers — ring 0.092 px
against a band of [0.722, 2.886] (`logs/wobble-chromium.json`, `logs/wobble-webkit.json`).

That law cannot be satisfied by a hand. `maxDisplace = roughness × len × 0.015`, so equal σ
between a 111-unit cell edge and a 948-unit rule would require the ring to wobble **8.5× harder
per unit of stroke** than the board it sits inside. R3-a as written asks for a mark that is not
in the house's hand.

There is a second problem with it as an instrument: it reads ONE line and ONE ring. The same
948-unit rule reads σ 1.031 / 1.443 / 0.631 px across r0's three boards purely because the
probe picked a different line index — three uniform draws per edge make a single reading a
sample, not a law.

### 2.2 R3-a1 — the proportional law, over the population (`probe/law2.probe.ts`)

σ over space for EVERY instance at each size, normalised by the length of the edge the σ was
taken on (`getTotalLength()` on a ghost is the whole PERIMETER — divide by 4, or the ring reads
4× quieter than it is).

| board | grid n | grid σ px (mean ± sd) | grid σ / 1000 px of edge | ring n | ring σ px (mean ± sd) | ring σ / 1000 px of edge | **ring ÷ grid** |
|---|---|---|---|---|---|---|---|
| 4×4 | 4 | 0.816 ± 0.128 | 2.084 | 16 | 0.157 ± 0.048 | 1.983 | **0.951** |
| 9×9 | 12 | 1.077 ± 0.327 | 1.782 | 81 | 0.110 ± 0.034 | 2.018 | **1.132** |
| 16×16 | 24 | 1.264 ± 0.372 | 2.092 | 256 | 0.044 ± 0.027 | 1.433 | **0.685** |

Identical to 4 dp in both engines (`logs/law2-chromium.json`, `logs/law2-webkit.json`).

**The ring and the grid are the same hand, to within 15% at 4×4 and 9×9.** The proportional law
is not a defence of the incumbent; it is a measurement of it. The 16×16 row runs quieter
(0.685) for a stated reason, not noise: `generateCellRects` drops to `segments: 2` at ≥16, so a
30 px edge carries ONE interior draw instead of three.

**THE RE-BASED LAW (R3-a1):** *σ ÷ the mark's own edge length agrees with the grid's within
[0.5×, 2.0×].* GREEN at HEAD, all three sizes, both engines — and it is the claim's test, not
its decoration: it would go red the moment a cure raised the ring's amplitude off the
proportional line, which is exactly what the "modest rebase" knob would do. **A rebase is
therefore not a secondary knob the centre may take if it likes; it is the one move that breaks
the law this family stands on.** The family does not rebase.

### 2.3 R3-a3 — σ over TIME, born RED (`probe/live.probe.ts`)

σ over time = RMS, across a mark's poses, of each sample point's distance from the poses'
centroid at that arc position. One path → 0 by construction.

| board | grid σ_t px | band [0.5×, 2.0×] | ring σ_t BEFORE | ring σ_t AFTER (house grammar) | verdict | ring σ_t, `perturbPointsClosed` |
|---|---|---|---|---|---|---|
| 4×4 | 0.0303 | [0.0152, 0.0606] | **0 (born RED)** | **0.0257** | GREEN | 0.0502 GREEN |
| 9×9 | 0.0268 | [0.0134, 0.0536] | **0 (born RED)** | **0.0421** | GREEN | 0.0806 **over ceiling** |
| 16×16 | 0.0268 | [0.0134, 0.0536] | **0 (born RED)** | **0.0397** | GREEN | 0.0701 **over ceiling** |

Identical to 4 dp in both engines (`logs/live-law-chromium.json`, `logs/live-law-webkit.json`).

Two things fall out.

1. **The family's central claim is proven.** σ over space is right and needs nothing; σ over
   time is zero and greens to the grid's own band with three sibling paths at `cellBoil 0.3` on
   the shared beat.
2. **The charter's named grammar is the wrong one.** `perturbPointsClosed` (corners live, no
   taper) runs 1.9× the grid's own boil and breaks the ceiling at 9×9 and 16×16. The house's
   `generateRectBoilFrames` — four edges perturbed independently with anchored corners and the
   `sin^0.9` taper, the board frame's own grammar — lands inside the band at every size. **Take
   the house grammar; the corners stay pinned.**

The mechanism behind the ranking is worth naming, because it is the family's law in one line:
**wobble (space) is PROPORTIONAL by library law; boil (time) is ABSOLUTE by house config.**
`frameBoil 1.2 / subgridBoil 0.6 / cellBoil 0.3` are flat viewBox units ranked by importance,
not by length. A ring on `cellBoil 0.3` is already ~2× the frame's proportional share
(1.2 × 111/948 = 0.14), so the ring is generously alive at the house's own number and there is
no amplitude argument left to have.

### 2.4 Is 0.04 px of σ actually life? The painted bytes (`probe/feel.probe.ts`)

A σ is geometry. dpr-3 crop, 318×318 device px, one focused cell plus 25% padding, light,
chromium. The grid's four baked poses are pinned by swapping all four `<image href>`s, so both
subjects are exact rather than raced (`logs/feel-perceptual.json`).

| subject | changed px | changed % | max channel Δ | mean channel Δ |
|---|---|---|---|---|
| **grid pose 0 → pose 2** (the house reference) | 2,948 | 2.92% | 89 | 0.863 |
| grid pose 0 → pose 0 — CONTROL | **0** | 0.00% | **0** | 0 |
| **ring pose 0 → pose 2** (house grammar) | 1,036 | 1.02% | 57 | 0.236 |
| ring pose 0 → pose 1 | 1,097 | 1.08% | 76 | 0.223 |
| ring pose 1 → pose 3 | 1,450 | 1.43% | 115 | 0.433 |
| ring pose 0 → pose 2, `perturbPointsClosed` | 1,216 | 1.20% | 88 | 0.374 |
| resting ring vs itself — CONTROL | **0** | 0.00% | **0** | 0 |
| ambient floor shipping today (grid live, ring resting) | 3,207 | 3.17% | 160 | 1.347 |

Both negative controls are EXACTLY zero, so every changed pixel above is real ink. The living
ring's inter-pose delta is **35–49% of the grid's changed-pixel count in the same crop, at
64–129% of its max channel delta**. It is the same order as the boil the estate ships and calls
the boil. The cure is visible, and it is one notch quieter than the board — which is the rank a
selection mark on top of a board should have.

### 2.5 R3-h — the π-guard, after (`probe/live.probe.ts`)

With the stack mounted on the active cell, both engines:

| board | live filters | rows | ghost `filter` | pose paths' own `filter` | `.cell-ghost-path` total | added | `.cell-ghost` aria-hidden |
|---|---|---|---|---|---|---|---|
| 4×4 | **9** | 2 heart · 2 toggle · 4 divider · 1 sparkle | `none` | `none` | 16 → **19** | +3 | true |
| 9×9 | **9** | same | `none` | `none` | 81 → **84** | +3 | true |
| 16×16 | **9** | same | `none` | `none` | 256 → **259** | +3 | true |

`+3 paths, never +N²` holds at every size (the naive per-cell stack would be 64 / 324 / 1,024).
`FILTER_BUDGET_UNION_AREA` is untouched: nothing new rasters, so no counted surface grows.

### 2.6 The cost — a mount per keystroke at 16×16 on the phone (`probe/feel.probe.ts`)

393×699 dpr3, 16×16, 24 arrow presses, rAF deltas, before and after, with the stack mounting
and unmounting on every focus change (`logs/feel-cost-*.json`):

| engine | | frames | median | p95 | max | **>33 ms** | >50 ms |
|---|---|---|---|---|---|---|---|
| chromium | before | 272 | 8.3 | 9.2 | 11.3 | **0** | 0 |
| chromium | after | 266 | 8.4 | 9.3 | **9.4** | **0** | 0 |
| webkit | before | 137 | 17 | 18 | 20 | **0** | 0 |
| webkit | after | 133 | 17 | 18 | 20 | **0** | 0 |

7 mounts / 6 unmounts over the traversal; pose-build time **median 0.1 ms, max 0.1 ms**
(chromium) and **0 ms** (webkit) — `generateRectBoilFrames` on a 17-vertex ring is four
`wobbleLinePoints` calls and three `perturbPoints` passes, and it is already LRU-able through
`useBoilCache` the way `generateCellRects` is. **The kill condition "a stack per arrow press is
a mount per keystroke" is CLEARED on measurement, not on argument.** No pre-mount is needed.

### 2.7 The first-class question — does it stop breathing after N beats?

`probe/feel.probe.ts` MRK-LIVE-n, four arms, 3 s observation each (`logs/feel-settle.json`):

| `settleBeats` | swaps in 3 s | first swap | last swap | settled on | settled |
|---|---|---|---|---|---|
| 0 (never settle) | 25 | 103 ms | 2991 ms | pose 2 (wherever the beat was) | no |
| **4** (500 ms) | 6 | 102 ms | **618 ms** | **pose 0** | yes |
| 8 (1 s) | 10 | 130 ms | 1136 ms | pose 0 | yes |
| 16 (2 s) | 18 | 103 ms | 2120 ms | pose 0 | yes |

The answer the family should carry: **N = 4, one full cycle, settling on pose 0.**

- It is one revolution of the mark's own four poses — the shortest N that shows the reader every
  pose exactly once, so nothing is hidden and nothing repeats.
- Pose 0 is the settled state and pose 0 IS today's ghostPath (§1.1), so **a settled ring is
  byte-identical to the ring the product ships today.** The question "does a settled ring still
  read as the selection" answers itself: it is the selection mark that has read as the selection
  since T4, unchanged, with a 500 ms flourish in front of it.
- 500 ms is inside the estate's own one-shot band — the drawer glides 520 ms, the cards step
  440 ms — so it is a user-triggered flourish, not ambient motion. The `settleBeats: 0` arm is
  the thing the restraint law refuses, and the family refuses it too.

This is also what makes the mark honest about liveness: it is alive at the moment the reader
moves it, and still while the reader thinks. The board keeps breathing underneath either way.

### 2.8 The wash — a filled path on the same seed (`probe/deckwash.probe.ts`, `proto/peer-wash.js`)

`.cell-peer` is a `<div>`: σ 0 **by construction, not by measurement**, which is the half of
R3-a that no amplitude change can ever reach. Replaced with one filled closed path per washed
cell on the cell's OWN ghost seed (`42 + 500 + pos*7` — the wash and the ring are the same hand
on the same square), `stroke: none`, the incumbent's own alpha, its own `<svg>` inside
`.cell-peer`'s box (the ghost's svg is `opacity: 0` off-focus — `gameCell.css:175`, a trap the
first prototype fell into and the log records).

| | edge σ over space, mean | n |
|---|---|---|
| incumbent `.cell-peer` | **0** (a CSS box) | — |
| filled wobble path | **0.1115 px** | 20 cells |
| the cell ghost, same board | **0.1102 px** | 101 paths |

Ratio to the ring **1.012** — the same hand, same seed, same board. Both engines identical
(`logs/wash-sigma-*.json`).

Painted bytes at dpr3, cell centre, both themes (`logs/wash-contrast.json`):

| theme | ground | incumbent box | filled path @7% | path ÷ box | @13% (`prefers-contrast: more`) |
|---|---|---|---|---|---|
| light | 253,253,252 | 240,245,249 (1.08:1) | 240,245,249 (1.08:1) | **1.00** | 230,239,247 (1.14:1) |
| dark | 19,18,17 | 25,29,33 (1.10:1) | 25,29,33 (1.10:1) | **1.00** | 31,38,45 (1.22:1) |

**The interior is byte-identical to the incumbent; the whole change lives at the edge**, which
is where it belongs. Node count is unchanged (one path per washed cell replaces one div's
background, 20/20 on this deal). 1.4.11 does not gate a decorative unit wash and these ratios
are reported so the family cannot claim a contrast it did not measure.

### 2.9 Modality — one mark for every pointer

Re-measured at HEAD, both engines (`logs/click/click-*.json`, `logs/phone-*.json`): a mouse
click, a click with the pointer moved away, an arrow key, and a phone TAP all paint tier 2 —
`rgb(58,123,196)`, 7px, 0.9, `cellMatchesFocusVisible: true` in every case. The focus target is
`<input type="text">`, which always matches `:focus-visible`. `gameCell.css:242-244`'s "only
keyboard focus gets the drawn-on ring" has never been true of this component. The family's move
is the honest one: **delete the comment, state the law — one mark for every pointer** — and the
living stack inherits it unchanged, because it rides `.is-active` and the same tier cascade.

---

## 3. §6 — ONE DRAWN RING OFF THE BOARD

`proto/focus-ring.js` mounts the same mark two ways and follows it three ways.

### 3.1 The inventory at HEAD, re-derived

`marks2.probe.ts` R3-f re-run unchanged reproduces r0 exactly (`logs/focus-contrast-*.json`):
11 chromium stops, 1 house-hand affordance, 5 shipped bespoke rects + the UA default on five
controls; `.logo-trigger` **2.70** and the deck card **2.70**, both under 3:1. WebKit's macOS
Tab traversal still returns one row — an engine fact, not a regression. R3-e reproduces too:
deck reach 6 px, air 9.6 / 713.6 / 24 / 24, **headroom 3.6 px** at both end cards
(`logs/deckring-chromium.json`).

### 3.2 THE LAG — and the artifact that had to be cleared first

The first lag run read 732 px on the dock glide for BOTH mountings. That reading is an artifact
and the artifact is a finding: clicking the tongue moves it between berths (`DrawerTab`, four
berths, T9-W2 §2.7), a berth change is a DOM move, a DOM move is an unmount, and **the tongue
loses focus.** Closing the dock with a `.ctrl-btn` focused does the same (`lostFocus: true`,
`logs/lag2-*.json`) — the drawer-open inert census (`access.spec.ts:328`) blurs what it buries.
A ring cannot lag a control that has no focus. The honest table (chromium, `logs/lag2-*.json`):

| what moves the control | `follow: "focusin"` | `follow: "raf"` | `follow: "events"` |
|---|---|---|---|
| controls card scrolls 240 px | **240.0 px off, 108/108 samples** | 0.00 px | **0.00 px** |
| viewport 1280 → 1024 | **128.0 px off, 109/109 samples** | 0.00 px | **0.00 px** |
| dock sheet glide | focus is lost first — nothing to lag | same | same |
| Teleport (Escape to the deck) | 0.00 px (focus moves, a new `focusin` fires) | 0.00 px | 0.00 px |
| repositions per 900 idle ms | 1 | **255** | **4** |
| frame budget during | median 8.6 / max 10.3 / 0 over 33 ms | median 8.4 / max 10.3 / 0 over 33 ms | median 8.3 / max 10.4 / 0 over 33 ms |

**The Teleport is not a lag source** — reparenting the live board moves focus, which fires
`focusin`. **Scroll and resize are**, and they are silent. `follow: "raf"` cures them at the
price of a permanent rAF subscriber, which is the exact shape `boilBeat.ts` exists to refuse
("45 sparse writers ≈ one continuous one"). `follow: "events"` — capture-phase `scroll`,
`resize`, and a `ResizeObserver` on the focused control — is correct to 0.00 px at **4
repositions instead of 255**, and idles at zero. That is the estate-shaped answer.

### 3.3 THE DECK REFUTES THE SINGLETON (`probe/deckwash.probe.ts` MRK-LIVE-r7)

With the six bespoke rules and the UA default suppressed and the house singleton installed
(`logs/deck-ring-chromium.json`):

| moment | `document.activeElement` | `aria-activedescendant` | ring painted | ring width | rings the scrollport | rings the card |
|---|---|---|---|---|---|---|
| after install, no focus event yet | — | gallery-card-0 | **false** | — | — | — |
| scrollport focused | `.gallery-viewport` | gallery-card-0 | true | **1064 px** | **true** | **false** |
| after ArrowRight | `.gallery-viewport` | gallery-card-**1** | true | **1064 px** (unmoved) | **true** | **false** |

The card is 332.8 px; the viewport is 1056 px. **A focus-driven singleton rings the scrollport,
which is the one element `spoken-gallery.spec.ts` §3.7 explicitly forbids a ring on
(`.gallery-viewport` must compute `outline-style: none`, exactly ONE owner, and it is the
activedescendant card).** Stepping the deck does not move it, because `aria-activedescendant`
fires no focus event at all. Row 1 adds a second failure: an element already focused when the
singleton installs never gets a ring (cold load, route change).

This is not a tuning problem. The deck's ring is an ACTIVEDESCENDANT ring, and DOM focus is the
wrong signal for it. Either the singleton also observes `aria-activedescendant` mutations on
every combobox/listbox in the estate — a second, parallel focus model — or the deck keeps an
owner of its own drawn in the same hand. The second is smaller and it is what §3.7 already
describes.

### 3.4 THE REACH — the house ring fits the deck's air

`logs/ring-reach-chromium.json`. Reach must clear the min air (9.6 px), counting the drawn
edge's own overshoot: `wobbleLinePoints` displaces up to `roughness × len × 0.015` perpendicular
(≈1.5 px at roughness 0.5 on a ~200 px card edge), so worst reach is
`outset + strokeWidth/2 + wander`.

| outset | stroke | nominal reach | worst reach | fits 9.6 px air | vs incumbent (6 px) |
|---|---|---|---|---|---|
| 3 | 2 | 5 | 5.50 | yes | −1.0 |
| **4** | **2** | 6 | **6.50** | **yes** | = |
| **4** | **2.5** | 6.5 | **6.75** | **yes** | +0.5 |
| 4 | 3 | 7 | 7.00 | yes | +1.0 |
| 5 | 2.5 | 7.5 | 7.75 | yes | +1.5 |
| 6 | 3 | 9 | 9.00 | yes, 0.6 px spare | +3.0 |

The whole 3.6 px of headroom is spendable, and the house's own tongue spec (`HandDrawnOutline
:stroke-width="2.5" :outset="3"`) lands at 5.75 px worst reach — inside, with room. **The deck's
look can take the house hand without touching §3.7's WHOLE rule.**

### 3.5 THE CONTRAST, from painted bytes (`probe/ring.probe.ts` MRK-LIVE-r3)

Screenshot with the ring and without, take the most-changed pixel as the composited ink and its
own pixel in the OFF frame as the backdrop, WCAG formula. dpr3, both themes, a control on
`--color-card` (`.ctrl-btn`) and one on `--color-background` (`.logo-trigger`)
(`logs/ring-contrast.json`):

| ink | light/card | light/bg | dark/card | dark/bg | ≥3:1 on all four |
|---|---|---|---|---|---|
| **`--color-focus-sketch` #3a7bc4** | **4.29** | **4.19** | **4.29** | **4.38** | **yes** |
| `--color-crayon-blue` #4a90d9 | 3.28 | 3.21 | 5.60 | 5.72 | yes |
| `--color-user-ink` #2563eb | 5.08 | 4.96 | 3.62 | 3.70 | yes |
| `--color-pencil-graphite` | 14.87 | 14.52 | 11.99 | 12.25 | yes |
| `--color-foreground` | 19.45 | 18.99 | 15.84 | 16.18 | yes |

`--color-focus-sketch` is the flattest of the five across the four cells (4.19–4.38, spread
0.19) — the ink that behaves the same everywhere, which is what a single estate-wide ring wants.
It is also already the board's focus ink, so the estate would have ONE focus colour instead of
five. **Both 2.70 rings clear 3:1 by ≈1.55× the floor** the moment they stop using
`color-mix(--color-foreground 40%)`.

R6's finding that `--color-focus-sketch` has no dark arm is confirmed as a RECORD defect, not an
a11y one: the single `:root` value paints 4.29 on card-dark here, over the floor. It still wants
a declared dark arm so the record and the tree agree.

### 3.6 FORCED COLORS — a trap the family must carry (`logs/ring-forcedcolors.json`)

Under `forced-colors: active`, the cell's own restoration at `gameCell.css:352-356` paints
`2px solid rgba(5,0,73,0.8)` at offset −2 px. With the prototype's blanket suppression sheet up,
`.ctrl-btn:focus-visible` computes **`3px none`** while `outline-offset` still reads the
forced-colors rule's `2px` — the two halves resolved from different rules. The cause is
specificity: `.ctrl-btn:focus-visible { outline: none !important }` (0,2,0) beats
`:focus-visible { outline: 2px solid Highlight !important }` (0,1,0).

**A blanket `outline: none` sweep must carry its forced-colors restoration at equal or greater
specificity, in the same rule set, or the estate loses its focus indicator entirely in High
Contrast.** That is a P0 shape, it is cheap to get wrong, and this lane got it wrong first try.

### 3.7 The estate's own specs

`probe/e2e.config.ts` on 4238: `spoken-gallery.spec.ts` + `a11y.spec.ts` + `access.spec.ts` =
**58 passed, 0 failed**, chromium and webkit, at HEAD. Under the overlays
(`logs/specs-overlay-chromium.json`): image census **1 total, 1 named, 0 unnamed** with the
three pose paths mounted, all inside `aria-hidden` (`poseAriaHidden: true`) — a11y 3.5 holds by
construction, since the poses are siblings inside the ghost `<svg>` that is already hidden.
`.gallery-viewport` still computes `outline-style: none`. Subject-count guard: **7 distinct
controls reached with the ring painting** (`logs/ring-reach-chromium.json`), over the ≥3 floor.

---

## 4. The kill conditions, answered

| condition | verdict | on which number |
|---|---|---|
| ambient motion at 8 Hz under a selected cell | **CLEARED, with a change** | 8 Hz is the board's existing cadence (§1.2); the family settles at **N = 4 beats / 500 ms on pose 0** (§2.7), which is a one-shot flourish in the estate's own band, not ambient motion |
| a floating ring lags the Teleport and the sliding sheet | **the named sources are CLEARED; two UNNAMED ones kill the singleton's naive form** | Teleport 0.00 px, sheet blurs its own controls; **scroll 240 px and resize 128 px** are silent and real, cured to 0.00 px by `follow: "events"` at 4 repositions/900 ms |
| a per-control ring is the six bespoke rules re-spelled | **TRUE, and it is still the right answer** | one component with one geometry, one ink and one gate replaces six rules in six files plus a UA default — the difference from the incumbent is that the six stop disagreeing |
| a mount per keystroke costs a long frame at 16×16 | **CLEARED** | 0 frames >33 ms before or after, both engines; build 0.1 ms median (§2.6) |
| the proportional law leaves R3-a RED as written | **TRUE — re-based in the open** | R3-a1 GREEN at [0.951, 1.132, 0.685] over the population; R3-a3 born RED at 0 and GREEN at 0.0257/0.0421/0.0397 (§2.2, §2.3) |
| **NEW — the deck** | **REFUTES the singleton** | a focus-driven ring paints on the 1056 px scrollport, never the 332.8 px card, and does not move when the deck steps (§3.3) |

---

## 5. What the synthesizer needs

**Surfaces and tokens this family touches.** `gridPaths.ts:42` (`generateCellRects` → a
frames-returning sibling), `DigitCell.vue:411-422` (one `v-for` over poses), `GameBoard.vue:156`
/ `BoardHost.vue:300` (the prop becomes `string[]`), `gameCell.css:189` (tier 1) / `:245`
(tier 2) / `:242-244` (the comment goes) / `:123-125` (the wash) / `:352` (forced colors),
`pencilConfig.ts:268-282` (`cellBoil 0.3` reused, no new constant), `boilBeat.ts:63`
(`useBeatFrame` reused, no new cadence). Off the board: the six rules named in §1 plus
`index.css:446`, and a new `FocusRing.vue` in `src/pencil/chrome/`.

**Numbers it must hit.** σ over time in [0.5×, 2.0×] the grid's: [0.0152, 0.0606] at 4×4 and
[0.0134, 0.0536] at 9×9 and 16×16. σ over space unmoved at 0.1377 / 0.0920 / 0.0768. σ per 1000
px of own edge within [0.5×, 2.0×] of the grid's 2.084 / 1.782 / 2.092. Filter census exactly 9
at all three sizes with every pose `filter: none`. Ghost paths 19 / 84 / 259 — +3, never +N².
Deck ring worst reach ≤ 9.6 px. Every ring ≥3:1 on all four grounds. Zero frames over 33 ms
during 16×16 traversal at 393×699 dpr3. Zero unnamed image nodes.

**Primitives it reuses, by name.** `gridPaths.generateRectBoilFrames` (already exported, already
grain-bakes, already the frame trace's engine); `boilBeat.useBeatFrame` +
`beatsFor(BOIL_CONFIG.intervalMs)` (one beat, never a second); `useBoilCache` (the pose tuple
caches exactly as `cellRects` does); `HandDrawnOutline :pose="0"` (law 37, the off-board box
grammar); `BOIL_CONFIG.cellBoil` and `outlineBoilPx 0.45` (the two boil constants that already
exist, one per coordinate space); `--color-focus-sketch` (the ink, needing only its dark arm
declared).

**Constraints it collides with.** §3.7's one-owner/WHOLE rule and its activedescendant model
(§3.3); the forced-colors specificity trap (§3.6); `access.spec.ts:328`'s inert census, which
blurs controls the sheet buries; the restraint law, answered by N = 4 (§2.7); the 3.6 px deck
headroom; filterBudget 9 by exact match; M16 — this family mints no rendered string, so it
costs no woff2 re-cut (`scripts/check-font-coverage.mjs` unrun, deliberately: nothing to price).

### Sketch 1 — the stack's residency

```
        EVERY CELL (16 / 81 / 256)                 THE ACTIVE CELL ONLY
   ┌────────────────────────────┐            ┌────────────────────────────┐
   │ div.cell-ghost  opacity 0  │            │ div.cell-ghost  opacity 1  │
   │  svg[viewBox=cell window]  │            │  svg[viewBox=cell window]  │
   │   path.cell-ghost-path  ◄──┼── pose 0 ──┼──►  path  pose 0  o:1 ▓    │
   │                            │            │     path  pose 1  o:0      │  +3
   │   (nothing else, ever)     │            │     path  pose 2  o:0      │  nodes
   │                            │            │     path  pose 3  o:0      │
   └────────────────────────────┘            └────────────┬───────────────┘
                                                          │ opacity swap only
   pose 0 === today's ghostPath, byte-for-byte            │ (no geometry write)
   so the resting board does not move at all        ┌─────▼──────────────┐
                                                    │ boilBeat 125ms ×1  │
                                                    │ the grid's own beat│
                                                    └────────────────────┘
```

### Sketch 2 — the four beats, then rest

```
  focus lands
      │
      ▼   beat 1     beat 2     beat 3     beat 4          … and then still
  ┌───────┬──────────┬──────────┬──────────┬──────────────────────────────────►
  │pose 0 │ pose 1   │ pose 2   │ pose 3   │ pose 0, held                  t
  └───────┴──────────┴──────────┴──────────┴──────────────────────────────────
  0ms     125        250        375        500 ms
          ├──────────── 500ms, one revolution ─────────┤
          the flourish (drawer 520 · card step 440)     the settled mark IS
                                                        today's ring, unchanged
  measured: 6 swaps, last at 618ms, settles on pose 0   (logs/feel-settle.json)
```

### Sketch 3 — why the deck is not a focus ring

```
   DOM FOCUS                              ARIA ACTIVEDESCENDANT
   ─────────                              ─────────────────────
   .gallery-viewport   ◄── focusin ──►    aria-activedescendant="gallery-card-1"
   ┌─────────────────────────────────────────────────────────┐   1056 px
   │  ╔═══════════╗   ┌───────────┐   ┌───────────┐          │
   │  ║  card 0   ║   │  card 1   │   │  card 2   │          │   the singleton
   │  ╚═══════════╝   └───────────┘   └───────────┘          │   rings THIS box
   └─────────────────────────────────────────────────────────┘   (measured 1064)
      332.8 px each          ▲
                             └── §3.7: the ONE ring owner, and it moves
                                 on ArrowRight with NO focus event

   measured: ArrowRight → activedescendant 0 → 1, ring width 1064 → 1064 px.
   A focus-driven singleton cannot see the deck's selection at all.
```

---

## 6. Risks

1. **The deck needs its own ring owner.** Whatever §6 lands, the estate carries two selection
   models — DOM focus and `aria-activedescendant` — and one component cannot serve both from
   `focusin` alone. Cheapest honest shape: `FocusRing.vue` takes a target *element* rather than
   listening globally, and the deck passes its activedescendant card.
2. **The forced-colors specificity trap (§3.6)** will bite whoever writes the suppression sweep.
   It must land in the same commit and at equal specificity, with a spec row.
3. **Scroll and resize are silent movers.** `follow: "events"` must include a `ResizeObserver`
   on the target AND a capture-phase scroll listener; a naive `focusin`-only implementation is
   240 px wrong the first time anyone scrolls the controls card.
4. **`perturbPointsClosed` looks like the obvious primitive and is out of band** at 9×9 and
   16×16 (§2.3). Anyone reading the charter's prose rather than this measurement will reach for
   it.
5. **A rebase breaks R3-a1.** The "modest amplitude knob" is not secondary — it is the one move
   that reds the law this family proves. It should be struck, not parked.
6. **The record's cadence figures are wrong estate-wide.** "150 ms / 6.7 fps" appears in the R3
   census, the R6 census and `pencilConfig.ts`'s own comment; the measured cadence is 125 ms /
   8 Hz. Whoever writes the W7 spec will otherwise inherit a false number into a motion table.
7. **Engine parity is currently perfect** (every σ identical to 4 dp, both engines) because the
   geometry is computed in JS and painted filterlessly. Any cure that reaches for a filter or a
   CSS animation forfeits that.
8. **Unmeasured here:** the armed destructive verb's box (charter item 8) — the guard ribbon's
   `.guard-face` takes `HandDrawnOutline :pose="0"`, so the mechanism is a prop change from
   `:pose="0"` to beat-enrolled, and the filter cost is zero by that component's own contract,
   but this lane did not run it. It is the cheapest remaining row and pass 2 should take it.

---

## 7. Recommendation

**DEVELOP §5 as stated, with one correction; ADJUST §6.**

The family's centre survived every test it set itself. The library's proportional law is not a
defect to be cured but a hand to be recognised: over the population the ring and the grid wobble
the same per unit of stroke (0.951 / 1.132 / 0.685), and r0's R3-a was measuring the ratio of
two edge lengths. What the ring lacked was time, and time costs three sibling paths: σ over
time goes 0 → 0.0257 / 0.0421 / 0.0397 px, inside the grid's own band at every size in both
engines, at a painted delta 35–49% of the board's own boil, with the filter census unmoved at
9/9/9, the DOM at +3 and not +N², zero frames over 33 ms on a 16×16 phone traversal, and a
resting pose that is byte-identical to the ring shipping today. The one correction is the
grammar: take the house's `generateRectBoilFrames` with its anchored corners, not
`perturbPointsClosed`, which runs 1.9× hot and breaks the band's ceiling. The amplitude rebase
should be struck from the family outright — it is the only move that would red the law the
family proves. The ring breathes for **four beats, 500 ms, one revolution, then rests on pose
0**: alive under the reader's hand, still while the reader thinks, and never ambient. The wash
takes the same treatment for free — one filled path per washed cell on the ring's own seed,
edge σ 0.1115 against the ring's 0.1102, interior bytes identical to the incumbent — and the
false modality comment at `gameCell.css:242-244` is deleted, because one mark for every pointer
is what the product has always painted.

§6 needs adjusting on a number, not softening on a taste. One drawn idiom estate-wide is right:
`--color-focus-sketch` clears 3:1 on all four grounds by ≈1.4× with the flattest spread of five
candidates (4.19–4.38), which cures both 2.70 rings, retires five bespoke rects and the UA
default, and gives the estate ONE focus colour; the house hand fits the deck's 3.6 px of
headroom at every reasonable (outset, stroke) pair. But **the singleton form is refuted by the
deck**: the ring published by `aria-activedescendant` fires no focus event, and a focus-driven
singleton measurably rings the 1056 px scrollport — the one element §3.7 forbids — and does not
move when the deck steps. So the idiom lands as a component that takes its target, with an
event-driven position (`scroll` + `resize` + `ResizeObserver`: 0.00 px on both silent movers at
4 repositions per 900 ms against rAF's 255), and the deck passes it the activedescendant card
rather than the estate guessing from focus. The suppression sweep carries its forced-colors
restoration at equal specificity in the same rule set, or High Contrast loses its ring entirely.
Nothing closes here (U-10).

---

## 8. Prior art (background only — the verdict above came from the codebase)

Two web lookups, for context, not for authority.

- **The boil is an animation tradition, not a web trick.** The effect is the same frame redrawn
  several times with slight variation and cycled, and the standard web implementation is
  `feTurbulence` → `feDisplacementMap` with the seed shuffled on a timer (Visini, *Simulating
  Hand-Drawn Motion with SVG Filters*; the 2025 CSS-only variant at kirgroup.net; rough.js for
  the static hand). **Every published implementation reaches for a live filter — which is the
  one thing this estate has already refused** (`filterBudget` 9, exact match; the T4-P1 deletion
  cure). The house's answer, pre-baked pose geometry opacity-swapped on a shared beat, is the
  filterless form of the same idea, and this family extends it rather than importing the
  standard one. Nothing found in prior art addresses whether a boil should STOP, which is why
  §2.7's N = 4 is measured here rather than cited.
- **WCAG 2.4.13 Focus Appearance (AAA, WCAG 2.2)** asks for a focus indicator at least as large
  as a 2 CSS px perimeter of the component and ≥3:1 between the focused and unfocused states,
  and explicitly allows `outline-offset` to keep it clear of the component's own edge. The
  estate gates only 1.4.11's 3:1 today, but the AAA shape is the right target for a single
  estate-wide ring: the §3.4 candidates at stroke 2–2.5 and outset 3–4 meet the 2 px perimeter
  test, and §3.5's ratios are taken between painted focused and unfocused frames, which is
  2.4.13's own comparison rather than a token-vs-token one. Nothing in the criterion speaks to
  `aria-activedescendant`, which is exactly the gap §3.3 measures.

Sources: [Simulating Hand-Drawn Motion with SVG Filters](https://camillovisini.com/coding/simulating-hand-drawn-motion-with-svg-filters) ·
[SVG Hand Drawing without JS](https://kirgroup.net/blog/2025/07/21-SVG-Hand-Drawing-without-js.html) ·
[Rough.js](https://www.hongkiat.com/blog/roughjs-handdrawn-svg-library/) ·
[WCAG 2.2 — 2.4.13 Focus Appearance](https://www.wcag.com/designers/2-4-13-focus-appearance/) ·
[2.4.13 plain English](https://aaardvarkaccessibility.com/wcag-plain-english/2-4-13-focus-appearance/)
