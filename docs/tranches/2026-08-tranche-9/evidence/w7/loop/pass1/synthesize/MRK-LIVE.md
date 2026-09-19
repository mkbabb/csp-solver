# PASS-1 SYNTHESIS · MRK-LIVE · The living mark

Section §5 wobble law · §6 focus rings. Synthesizer: Fable 5.1. Input: the lane record at
`../research/MRK-LIVE/` (verdict DEVELOP §5 with one correction; ADJUST §6) and the r0
censuses. Read-only on the product. Two-pass method: plan → tell review → spec.

## 0 · Plan, then the tell review

**Tokens.** Colour: `--color-focus-sketch` `#3a7bc4`, ONE value both themes (painted 4.29
card-light / 4.19 bg-light / 4.29 card-dark / 4.38 bg-dark, the flattest of five candidates;
the "missing dark arm" is a comment defect, cured by rewriting the comment). Geometry:
`BOIL_CONFIG.cellBoil 0.3` (existing), `frameCount 4` (existing), `outlineBoilPx 0.45`
(existing, for chrome), stroke 2.5 / outset 3 (the tongue's own `HandDrawnOutline` tuple).
Time: `MOTION.beatMs 125` (existing). One new number: `BOIL_CONFIG.markSettleBeats: 4`.

**Type.** None. No rendered string is minted.

**Layout.** One axis, liveness, drawn the same on both surfaces:

```
   STILL (every resting mark)            LIVING (under the reader's hand)
   grid rule ······ boils (the page)     focused cell  ┌~~~~┐  4 poses, 125ms,
   cell ghost ····· one frozen path      of the board  │ 5  │  one revolution, then
   tongue, chips ·· drawn, still         armed verb    └~~~~┘  rests on pose 0 =
   deck flank ····· pose 0 forever       chrome focus  ┌~~~~~~~~~┐ today's exact ring
                                                       │ [ deal ]│
                                                       └~~~~~~~~~┘
```

**Principles.** (1) The library's proportional law is a hand, not a defect: ring÷grid per
unit of edge 0.951 / 1.132 / 0.685, the same hand at every size. (2) What the ring lacks is
TIME: the grid breathes and the ring does not. (3) Liveness is a user-triggered flourish
in the estate's one-shot band (500ms beside 440 and 520), not ambient motion: one revolution
and it rests on the ring that ships today. (4) Off the board, one drawn ring that takes its
target, never a global listener. The memorable thing: the selection breathes once when you
land on it, and the same breath answers focus everywhere else.

**Tell review.** The generic version is a CSS `outline` that pulses on an infinite keyframe,
or a feTurbulence "sketchy" filter on a timer (every published web boil does this; the
estate deleted exactly that in T4-P1). Departures: the poses are pre-baked geometry
opacity-swapped on the shared beat (zero filters, engine parity to 4 dp); the motion ENDS
(N = 4, settling on pose 0), which the skill's non-user-triggered-motion tell demands and
the registry's own detector flagged; and the ring's colour is not what makes it findable,
its movement is. What the mirror removed: the amplitude rebase (it is the one move that
reds R3-a1), `perturbPointsClosed` (1.9× hot, over the band's ceiling at 9×9 and 16×16),
and the focusin-driven singleton (it rings the 1056px scrollport, the one element §3.7
forbids).

## 1 · §5 · the living mark (spec)

### 1.1 The law

> Wobble in space is proportional to the stroke's own length (`maxDisplace = roughness ×
> len × 0.015`), the library's hand. Wobble in time is a flat house number ranked by
> importance (`frameBoil 1.2 / subgridBoil 0.6 / cellBoil 0.3`). A mark under the reader's
> hand lives: it steps four poses on the shared beat for one revolution and rests on
> pose 0. Every other mark is still.

R3-a is re-based in the open: the row asserts ring÷grid per 1000px of edge ∈ [0.5×, 2.0×]
(GREEN at HEAD: 0.951 / 1.132 / 0.685) and a NEW row asserts σ over time on the focused
ring inside the grid's own σ_t band (RED at HEAD: 0). Amplitude is never rebased.

### 1.2 The stack

- Poses: `generateRectBoilFrames(col×cellSize, row×cellSize, cellSize, cellSize,
  {roughness 0.4, segments: boardSize ≥ 16 ? 2 : 4, seed 42+500+pos×7, jagged: true},
  BOIL_CONFIG.cellBoil, BOIL_CONFIG.frameCount)` — the board frame's own grammar (four edges
  perturbed independently, corners anchored, sin^0.9 taper). Pose 0 is byte-identical to
  today's `ghostPath`, so the resting board cannot move (σ over space 0.092 before = after).
  Memoised through `useBoilCache` under `['cellFrames', boardSize, subgridSize, viewBoxSize,
  seed, pos]` beside `cellRects`.
- Residency: the ACTIVE cell only. `DigitCell.vue` renders its resident `.cell-ghost-path`
  as today and, while `.is-active`, three sibling `<path>` elements from the same v-for
  (cloned in-template so they carry the `[data-v-…]` scope; a `createElementNS` path renders
  black). Population 16→19, 81→84, 256→259: +3, never +N².
- Beat: `useBeatFrame(BOIL_CONFIG.frameCount, () => beatsFor(BOIL_CONFIG.intervalMs))`
  — one beat = 125ms (`beatsFor(150)` = 1; the "150ms / 6.7 fps" comment at
  `pencilConfig.ts:270` is corrected to "quantizes to one 125ms beat, 8Hz"). The stack
  enrols on selection and unenrols on blur; no second timer, no rAF subscriber.
- Settle: `BOIL_CONFIG.markSettleBeats: 4`. From the beat the cell takes focus, the pose
  index steps for four beats (six swaps, last at ~618ms measured), then pins to pose 0.
  A new selection restarts the revolution on the new cell. PRM: pose 0 only, zero swaps
  (`useBeatFrame`'s force-clear).
- Painted delta at dpr3 (measured): ring pose0→pose2 1.02% of the crop changed, max Δ 57,
  against the grid's own 2.92% — one notch quieter than the page, the right rank for a
  mark on it (`../research/MRK-LIVE/frames/ring-pose0.png`, `ring-pose2.png`).

### 1.3 States on the board

| tier | trigger | paint | life |
|---|---|---|---|
| 1 hover | pointer, no focus | graphite 5 / 0.65 / fill 0.06 | still |
| 2 selection | `input:focus-visible` (every pointer) | `--color-focus-sketch`, stroke 7, 0.9, fill 0.08, `ghost-draw-on 180ms var(--ease-ghostDraw) backwards` | LIVING: draw-on, then one revolution (500ms), then pose 0 |
| 3 conflict | `.is-invalid` | teacher-red (unchanged) | still |
| 4 peer cursor | `.is-peer-cursor` | peer ink, stroke 4, 0.55, dashed (unchanged) | still (someone else's hand is not under yours) |

The wash `.cell-peer` stays a CSS box in this spec. The filled-path form on the cell's own
seed is banked (`../research/MRK-LIVE/proto/peer-wash.js`: edge σ 0.1115 ≈ the ring's
0.1102, centre bytes identical) and lands only if §3's accent law gives the wash an edge a
reader can see; at 7% it is 1.08:1 and the geometry is invisible.

Modality: `gameCell.css:242-244` deleted and replaced with the true sentence (a text input
always matches `:focus-visible`; one mark for every pointer). The living stack rides
`.is-active` and the same tier cascade, so it inherits this unchanged.

### 1.4 The armed verb (charter item 8, unmeasured in pass 1)

The guard ribbon's `.guard-face` takes `HandDrawnOutline :pose="0"` today. The armed
DESTRUCTIVE face (stroke 2.5) takes `:pose="armedPose"`, where `armedPose` steps the shared
beat for `markSettleBeats` after arming and then rests at 0. Filter cost zero by the
component's own contract (baked pose geometry). Pass 2 measures it; the spec claims nothing
until then.

## 2 · §6 · one drawn ring off the board (spec)

### 2.1 The law

> Off the board, focus is one drawn ring: the house hand as an SVG rect in px-native
> geometry on whatever has focus, stroke 2.5 / outset 3 (the tongue's tuple), ink
> `--color-focus-sketch`, `outlineBoilPx 0.45`. It lives for one revolution on the shared
> beat when it lands and then rests. It is recognisable because it is the only thing
> moving under the reader's hand, not because of its colour.

### 2.2 `FocusRing.vue` — takes its target

One instance mounted in `App.vue`. It is NOT a global `focusin` singleton alone:

- Target sources, in priority: (1) an explicit target provided through
  `provide('focusRingTarget', ref<Element|null>)` — the gallery provides its
  `aria-activedescendant` card (measured: a focusin-only ring rings the 1056px scrollport
  and never moves on ArrowRight); (2) `document.activeElement` when it matches
  `:focus-visible`, read on `focusin`/`focusout` (capture).
- Exempt targets: `.cell-native-input` (the board has its own hand), `.gallery-viewport`
  (§3.7: the card is the owner, never the scrollport).
- Position: event-driven, never rAF — capture-phase `scroll`, `resize`, and a
  `ResizeObserver` on the target. Measured 0.00px error after a 240px card scroll and a
  1280→1024 resize at 4 repositions per 900ms; `follow: 'raf'` was 255 and is refused
  (the shape `boilBeat.ts` exists to eliminate). Teleport moves focus and fires `focusin`
  (0.00px, 193 samples); the sheet glide blurs its control (access 2.1's inert census), so
  neither is a lag source.
- Geometry: `generateRectBoilFrames` in px over the target's border box padded by outset 3
  (the target may declare `--focus-ring-outset`; the toggle sets it to its 54px ornament
  edge, W2 §2.4). Four poses, `outlineBoilPx 0.45`, grain baked, zero filters.
- Reach on the deck card: 3 + 1.25 + ~1.5 wander = 5.75 px worst against 9.6 px of air:
  WHOLE with 3.85px of headroom.
- Forced-colors: the ring is `display: none` and the outline restoration below paints.
- ARIA: `aria-hidden`, `pointer-events: none`, `position: fixed`, z above the sheet
  (`.action-bar` 60 → the ring at 70).

### 2.3 Suppression and the forced-colors restoration (same rule set)

```css
@layer base {
  :focus-visible { outline: none; }                       /* the drawn ring is the ring */
  .cell-native-input:focus-visible { outline: none; }     /* the board's own hand */
  @media (forced-colors: active) {
    :focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
    .focus-ring { display: none; }
  }
}
```

The restoration lives at equal specificity in the same block, AFTER the suppression;
measured, a `.ctrl-btn:focus-visible { outline: none !important }` at (0,2,0) beat a
(0,1,0) restoration and left High Contrast with no indicator. No `!important`, no
higher-specificity suppression anywhere. The six bespoke rules are DELETED at source
(`DarkModeToggle.vue:741`, `HandwrittenLogo.vue:545`, `DrawerTab.vue:152`, `GameCard.vue:437`,
`StagingBand.vue:432`, `GameGallery.vue:1451`), and the two `outline: none` on the
face-riding buttons go with them; `.gallery-viewport:focus-visible { outline: none }` at
`GameGallery.vue:1193` stays (§3.7). `index.css:445`'s `outline-ring/50` dies.

### 2.4 Mobile

The ring is px-native, so 2.5px stroke at every viewport. The tongue's four berths (W2
§2.7) are DOM moves: the tongue loses focus on a berth change (measured), which is the
existing behaviour; the ring simply follows the next `focusin`. On the bottom tab and the
floating bar the ring sits above the bar's z-index (70 > 60).

### 2.5 Copy and motion

No copy. Motion, in `pencilConfig`: `BOIL_CONFIG.markSettleBeats: 4` (one revolution =
4 × `MOTION.beatMs` = 500ms; inside the one-shot band beside `cardStepMs 440` and
`boardFoldMs 520`; no curve, the beat is a step function). The board ring keeps
`ghost-draw-on 180ms var(--ease-ghostDraw)`; the chrome ring appears at pose 0 same-frame
and steps (no draw-on: the movement is the arrival). PRM: pose 0, zero swaps.

## 3 · Plan (files, order, what dies)

1. `pencilConfig.ts` — `markSettleBeats: 4` in `DEFAULT_BOIL_CONFIG`; the `:270` cadence
   comment corrected (150 → one 125ms beat, 8Hz). Same fix to the R3/R6 census text.
2. `gridPaths.ts` — `generateCellFrames(boardSize, subgridSize, viewBoxSize, seed, pos)`
   wrapping `generateRectBoilFrames`, memoised; `generateCellRects` untouched (pose 0 is
   its output).
3. `GameBoard.vue:156` / `BoardHost.vue:300` — pass `cellFrames` for the active pos only
   (a computed on `focusedPos`).
4. `DigitCell.vue:411-422` — the v-for of three siblings while `.is-active`; the pose index
   from `useBeatFrame` with the settle counter.
5. `gameCell.css:242-244` comment replaced; `:245-258` tier 2 unchanged.
6. `src/pencil/chrome/FocusRing.vue` (new, ~90 lines) mounted in `App.vue`;
   `GameGallery.vue` provides its activedescendant card; `DarkModeToggle.vue` declares
   `--focus-ring-outset`.
7. `index.css` — §2.3 block replaces `:445`; the six bespoke rules and the two face-riding
   `outline: none` deleted in their files.
8. Gates (§5) in the same commit, red before step 2, green after step 7.

Dies: six focus rules, the `outline-ring/50` sweep, the false modality comment, the false
cadence comment. Mounted: one component, three sibling paths on one cell.

## 4 · Prototype brief (pass 2)

Build: the §3 diff in a throwaway worktree under the scratchpad (`living-ring.js` and
`focus-ring.js` under `../research/MRK-LIVE/proto/` are the replayable overlays; the
worktree makes them source), `npx vite --host 127.0.0.1 --port 4238 --strictPort`, scratch
config `../research/MRK-LIVE/probe/pw.config.ts` (a `node_modules` symlink into
`web/frontend` is needed to run from `docs/`). Poses to screenshot, dpr3 crops ≤150 KB,
both engines, light and dark: (a) the focused cell at pose 0 and pose 2 at 9×9, 1280×800
(pinned by href swap as the lane did); (b) the same at 393×699 at 16×16; (c) the chrome
ring on a `.ctrl-btn`, the toggle and the deck's centre card at pose 0 and pose 2; (d) the
armed destructive verb at pose 0 and pose 2. Eight crops at most.

Measure: `live.probe.ts` (σ over time in the band at 4×4/9×9/16×16, σ over space
unchanged), `law2.probe.ts` (R3-a1 per unit of edge stays in [0.5×, 2.0×]),
`feel.probe.ts` settle timeline (swaps stop by beat 5, final pose 0, 0 swaps in the 3s after)
and the 16×16 phone traversal trace (0 frames > 33ms, both engines), `budget.probe.ts`
9/9/9 with population +3 (19/84/259), `ring.probe.ts` painted contrast on four grounds for
every stop, `lag2.probe.ts` (0.00px after scroll and resize; repositions ≤ 8 per 900ms),
`deckwash.probe.ts` (the ring owner is the activedescendant card and moves on ArrowRight),
`spoken-gallery.spec.ts` 16/16, `access.spec.ts` 2.1/2.2/2.3, `a11y.spec.ts` 3.5 (image
census 1 named / 0 unnamed with the stack up), the forced-colors arm (outline solid on every
stop, `.focus-ring` hidden), R6 `hue-census.mjs` (zero new hexes), and the r0 heading census
asserted unchanged.

Success is: ring σ_t 0.026 / 0.042 / 0.040 px (±20%) inside the grid's band; σ over space
0.092 before = after; one revolution then rest (final pose 0, 0 idle swaps); 9/9/9 and
+3; 0 long frames on the phone; every focus stop ≥3:1 painted (expected 4.19–4.38); deck
ring on the card, headroom ≥ 3.6px, `.gallery-viewport` outline none; 0.00px after scroll
and resize; 16/16, 2.1/2.2/2.3, 3.5 green; engine parity to 4 dp.

## 5 · Born-RED gates this family lands with

- **G-LIVE-1 σ over time** — the focused ring's σ_t at 4×4 / 9×9 / 16×16 inside the grid's
  own σ_t band at that size, both engines. RED at HEAD: 0 / 0 / 0.
- **G-LIVE-2 one revolution** — after focus, pose swaps ≥ 4 within 700ms, then 0 swaps in
  the following 3s, final pose 0. RED at HEAD (0 swaps ever).
- **G-LIVE-3 one ring owner off the board** — across ≥ 7 tab stops exactly one `.focus-ring`
  is visible, within 1px of its target's box + outset; on the deck it sits on the
  activedescendant card and moves on ArrowRight; `.gallery-viewport` outline none. RED at
  HEAD (no such node).
- **G-LIVE-4 position after scroll and resize** — ≤ 0.5px error after a 240px scroll and a
  1280→1024 resize; ≤ 8 repositions per 900ms idle. RED at HEAD.
- **G-LIVE-5 focus contrast from painted bytes** — every stop ≥3:1 on its ground, both
  engines, both themes. RED at HEAD (WebKit UA 1.78–2.15; logo 2.70; deck 2.70).
- **G-LIVE-6 forced-colors restoration** — every `:focus-visible` stop computes
  `outline-style: solid` under forced-colors with the drawn ring hidden. RED under the
  suppression as first written (measured `3px none`), so it is born with its cure.
- **G-LIVE-7 cadence truth** — `beatsFor(BOIL_CONFIG.intervalMs) === 1` asserted beside a
  grep that `pencilConfig.ts` no longer says "6.7". RED at HEAD.
- Guards that must stay green: R3-a1 per unit of edge in [0.5×, 2.0×] (a rebase reds it);
  σ over space 0.092 unchanged; budget 9/9/9 and population +3; phone trace 0 > 33ms;
  a11y 3.5 image census; engine σ parity to 4 dp.

U-10: nothing here closes. Whether one breath per landing reads as a flourish or a blink is
the owner's eye at the re-look.
